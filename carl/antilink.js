/**
 * antilink.js - Advanced, Group-Specific Antilink System
 *
 * Version: 3.4.1 (Patched)
 * Change Log:
 * - Refactored enforcement logic to correctly prioritize admin checks, preventing false positives during network instability.
 * - Corrected whitelist logic to properly distinguish between user JIDs and domain names, preventing incorrect matches.
 * - Added a "🔗" emoji prefix to all command responses to prevent the bot's own messages from being reprocessed as commands.
 * - FINAL FIX: Corrected a logical flow bug that caused a success and an error message to be sent for the same command.
 * - Parsing is now hardened using the same regex method from lock.js to be more reliable.
 * - Added explicit `return` statements after a command is successfully processed to prevent any further execution.
 */

import { info, warn, error } from '../utils/logger.js';
import { db } from '../utils/database.js';
import { getConfig } from '../utils/config.js';
import { isadmin } from '../utils/isadmin.js';
import { getDefault, getConnection } from '../utils/connection.js';
import * as groupsUtil from '../utils/groups.js';
import { isSudo, userJidFromCtx, listSudo, normalizeToJid } from '../utils/sudo.js';
import { getBotJid } from '../utils/bot-state.js';
import LinkifyIt from 'linkify-it';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const tlds = require('tlds');
import axios from 'axios';
import { resolve as resolveDns } from 'dns/promises';

export const name = 'antilink';
export const version = '3.4.1';
export const priority = 100;
export const commands = ['antilink', 'antilinkwl'];

const TABLE_SETTINGS = 'antilink_settings';

let botRef = null;
let shuttingDown = false;
let config = {};

const linkify = LinkifyIt();
linkify.tlds(tlds);

const perChatQueue = new Map();
const perChatProcessing = new Map();
let activeChats = 0;
const processedMessageIds = new Map();
const perUserWarnings = new Map();

// --- Database Schema and Helpers ---
async function ensureSchema() {
    try {
        await db.exec(`
            CREATE TABLE IF NOT EXISTS ${TABLE_SETTINGS} (
                chat_jid TEXT PRIMARY KEY,
                enabled INTEGER DEFAULT 0,
                whitelist TEXT DEFAULT '[]'
            );
        `);
        info('[antilink] Database schema ensured.');
    } catch (e) {
        error(e, '[antilink] schema creation failed');
        throw e;
    }
}

async function getGroupSetting(chatJid) {
    try {
        const row = await db.get(`SELECT enabled, whitelist FROM ${TABLE_SETTINGS} WHERE chat_jid = ?`, [chatJid]);
        return {
            enabled: !!row?.enabled,
            whitelist: row ? JSON.parse(row.whitelist || '[]') : []
        };
    } catch (e) {
        warn(`[antilink] getGroupSetting error for ${chatJid}: ${e?.message || e}`);
        return { enabled: false, whitelist: [] };
    }
}

async function setGroupEnabled(chatJid, isEnabled) {
    try {
        await db.run(
            `INSERT INTO ${TABLE_SETTINGS} (chat_jid, enabled) VALUES (?, ?)
             ON CONFLICT(chat_jid) DO UPDATE SET enabled = excluded.enabled;`,
            [chatJid, isEnabled ? 1 : 0]
        );
        return true;
    } catch (e) {
        error(e, `[antilink] setGroupEnabled failed for ${chatJid}`);
        return false;
    }
}

async function setGroupWhitelist(chatJid, whitelist) {
    try {
        const uniqueWl = Array.from(new Set((whitelist || []).map(String).filter(Boolean)));
        await db.run(
            `INSERT INTO ${TABLE_SETTINGS} (chat_jid, whitelist) VALUES (?, ?)
             ON CONFLICT(chat_jid) DO UPDATE SET whitelist = excluded.whitelist;`,
            [chatJid, JSON.stringify(uniqueWl)]
        );
        return true;
    } catch (e) {
        error(e, `[antilink] setGroupWhitelist failed for ${chatJid}`);
        return false;
    }
}

// --- Config and Bot API Setup ---
function refreshConfig() {
    const fullConfig = getConfig() || {};
    config = {
        MAX_WARNS: 3,
        REMOVE_ON_MAX: true,
        SEND_WARNING: true,
        WARNING_MESSAGE: '🔗 {user}, links are not allowed here. Remaining warnings: {warnings}',
        VALIDATION_TIMEOUT_MS: 4000,
        LOG_DELETED_LINKS: true,
        BATCH_SIZE: 5,
        BATCH_DELAY_MS: 800,
        GLOBAL_CONCURRENCY: 2,
        DELETE_RETRY_COUNT: 2,
        ...(fullConfig.ANTILINK || {})
    };
}

function setupApi(bot) {
    botRef = bot;
}

// --- Link Validation and Core Logic ---
function extractTextFromMessage(msg) {
    if (!msg || !msg.message) return '';
    const m = msg.message;
    return m.conversation
        || m.extendedTextMessage?.text
        || m.imageMessage?.caption
        || m.videoMessage?.caption
        || '';
}

async function messageContainsLink(msg) {
    const text = extractTextFromMessage(msg);
    if (!text) return false;
    const matches = linkify.match(text);
    if (!matches) return false;

    for (const match of matches) {
        try {
            const url = new URL(match.url);
            await resolveDns(url.hostname);
            return true;
        } catch (e) {
            continue;
        }
    }
    return false;
}


// --- Deletion Queue and Warning Management ---

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

async function deleteWithRetry(ctx) {
    const attempts = Math.max(1, config.DELETE_RETRY_COUNT || 1);
    const jid = ctx.key?.remoteJid;
    if (!jid) return false;
    for (let i = 1; i <= attempts; i++) {
        try {
            const sock = botRef?.sock || botRef;
            await sock.sendMessage(jid, { delete: ctx.key });
            return true;
        } catch (e) {
            if (i < attempts) {
                await sleep(400 * i);
                continue;
            }
            warn(`[antilink] deleteWithRetry failed: ${e?.message || e}`);
            return false;
        }
    }
    return false;
}

async function getLogTargetJid() {
    try {
        const row = await db.get("SELECT value FROM delete_prefs WHERE key = 'target_jid'");
        return row?.value || getBotJid();
    } catch (e) {
        return getBotJid();
    }
}


async function forwardDeletedLink(ctx) {
    if (!config.LOG_DELETED_LINKS) return;
    try {
        const targetJid = await getLogTargetJid();
        if (!targetJid) return;

        const sender = ctx.key?.participant || ctx.key?.remoteJid || 'Unknown';
        const groupJid = ctx.key?.remoteJid;
        const text = extractTextFromMessage(ctx);

        let groupName = 'PM';
        try {
            if (groupJid.endsWith('@g.us')) {
                const metadata = await (botRef?.sock || botRef).groupMetadata(groupJid);
                groupName = metadata.subject;
            }
        } catch (e) {
            groupName = 'Unknown Group';
        }

        const logMessage = `🚫 *Antilink Deletion*\n\n` +
            `👤 *User:* @${sender.split('@')[0]}\n` +
            `💬 *Chat:* ${groupName} (${groupJid})\n` +
            `🔗 *Original Message:*\n\`\`\`${text}\`\`\``;

        await (botRef?.sock || botRef).sendMessage(targetJid, {
            text: logMessage,
            mentions: [sender]
        });
    } catch (e) {
        warn(`[antilink] Failed to forward deleted link: ${e.message}`);
    }
}


function userKey(chatId, sender) { return `${chatId}::${sender}`; }

async function incrementWarningAndMaybeRemove(ctx) {
    try {
        const chat = ctx.key?.remoteJid;
        const sender = ctx.key?.participant || ctx.key?.remoteJid || '';
        if (!chat || !sender) return { count: 0, removed: false };

        const k = userKey(chat, sender);
        const current = perUserWarnings.get(k) || { count: 0 };
        current.count++;
        perUserWarnings.set(k, current);

        if (config.REMOVE_ON_MAX && current.count >= config.MAX_WARNS) {
            const sock = botRef?.sock || botRef;
            await sock.groupParticipantsUpdate(chat, [sender], 'remove');
            perUserWarnings.delete(k);
            return { count: current.count, removed: true };
        }
        return { count: current.count, removed: false };
    } catch (e) {
        warn(`[antilink] incrementWarning error: ${e?.message || e}`);
        return { count: 0, removed: false };
    }
}

async function sendWarning(ctx, count) {
    if (!config.SEND_WARNING) return;
    try {
        const sender = ctx.key?.participant || ctx.key?.remoteJid || '';
        const remaining = Math.max(0, config.MAX_WARNS - count);
        const text = config.WARNING_MESSAGE
            .replace('{user}', `@${sender.split('@')[0]}`)
            .replace('{warnings}', String(remaining));

        const jid = ctx.key.remoteJid;
        const sock = botRef?.sock || botRef;
        await sock.sendMessage(jid, { text, mentions: [sender] });
    } catch (e) {
        warn(`[antilink] sendWarning failed: ${e?.message || e}`);
    }
}


function enqueueDeletion(ctx) {
    const chatId = ctx.key?.remoteJid;
    if (!chatId) return;
    if (!perChatQueue.has(chatId)) perChatQueue.set(chatId, []);
    perChatQueue.get(chatId).push(ctx);
    if (!perChatProcessing.get(chatId)) tryStartProcessingForChat(chatId);
}

function tryStartProcessingForChat(chatId) {
    if (perChatProcessing.get(chatId) || shuttingDown) return;
    if (activeChats >= (config.GLOBAL_CONCURRENCY || 1)) {
        setTimeout(() => tryStartProcessingForChat(chatId), 150);
        return;
    }
    activeChats++;
    perChatProcessing.set(chatId, true);
    (async () => {
        try {
            await processChatQueue(chatId);
        } catch (e) {
            warn(`[antilink] processChatQueue error for ${chatId}: ${e?.message || e}`);
        } finally {
            perChatProcessing.set(chatId, false);
            activeChats--;
            if (perChatQueue.get(chatId)?.length) setImmediate(() => tryStartProcessingForChat(chatId));
        }
    })();
}

async function processChatQueue(chatId) {
    while (perChatQueue.get(chatId)?.length > 0 && !shuttingDown) {
        const batch = perChatQueue.get(chatId).splice(0, config.BATCH_SIZE || 1);
        for (const ctx of batch) {
            const deleted = await deleteWithRetry(ctx);
            if (deleted) {
                await forwardDeletedLink(ctx);
                const { count, removed } = await incrementWarningAndMaybeRemove(ctx);
                if (!removed) {
                    await sendWarning(ctx, count);
                }
            }
        }
        if (perChatQueue.get(chatId)?.length > 0) {
            await sleep(config.BATCH_DELAY_MS || 500);
        }
    }
}


function getMessageKey(ctx) {
    if (!ctx?.key?.id) return null;
    return `${ctx.key.remoteJid}:${ctx.key.id}`;
}

// --- Command Parsing and Handling ---

function splitRestForGp(rest) {
    if (!rest) return { left: '', gp: null };
    const m = rest.match(/\bgp[:\s]+(.+)$/i);
    if (m) {
        return { left: rest.slice(0, m.index).trim(), gp: m[1].trim() };
    }
    return { left: rest.trim(), gp: null };
}

async function resolveTargetsForGroupAdmin(senderKey) {
    const defNamesRaw = await getDefault(senderKey).catch(() => null);
    if (!defNamesRaw) return [];
    const defNames = Array.isArray(defNamesRaw) ? defNamesRaw : [defNamesRaw];
    let defaultChatJids = [];
    for (const dn of defNames) {
        const j = await getConnection(dn).catch(() => null);
        if (Array.isArray(j)) defaultChatJids.push(...j);
        else if (j) defaultChatJids.push(String(j));
    }
    return Array.from(new Set(defaultChatJids));
}

async function resolveTargetsForSudo(gp) {
    if (!gp) return [];
    if (gp.toLowerCase() === 'all') {
        return await groupsUtil.getUniqueJids();
    }
    const resolved = await groupsUtil.resolveName(gp);
    if (resolved) return [resolved];
    if (gp.includes('@')) return [groupsUtil.normalizeToUserJid(gp)];
    return [];
}


async function findStoredMatchFromFindings(findings = []) {
  try {
    const stored = await listSudo();
    if (!stored?.length) return null;
    const storedSet = new Set(stored.map(String));
    for (const f of findings || []) {
      if (f?.jid && storedSet.has(normalizeToJid(f.jid))) return normalizeToJid(f.jid);
    }
    return null;
  } catch (e) { return null; }
}


// --- Lifecycle and Message Handler ---

export async function initialize(bot) {
    try {
        setupApi(bot);
        await ensureSchema();
        refreshConfig();
        shuttingDown = false;
        info('[antilink] module initialized.');
    } catch (e) {
        error(e, '[antilink] initialize failed');
        throw e;
    }
}

export async function onMessage(ctx) {
    if (!ctx?.key?.remoteJid || !ctx.message || shuttingDown) return;

    const remote = ctx.key.remoteJid;
    const isGroup = remote.endsWith('@g.us');
    const senderJid = ctx.key.participant || ctx.key.remoteJid;
    const senderKey = senderJid.split('@')[0];
    const rawText = extractTextFromMessage(ctx);
    const cmdText = (ctx.text || rawText).trim();
    const cmd = (ctx.isCommand && cmdText) ? cmdText.split(/\s+/)[0].toLowerCase().replace('/', '') : null;

    // --- Command Handling ---
    if (ctx.isCommand && commands.includes(cmd)) {
        let finalDest = remote;
        let isAuthorized = false;
        let isSudoPM = false;

        if (isGroup) {
            if (await isadmin(botRef, ctx)) isAuthorized = true;
        } else {
            if (ctx.key.fromMe) {
                isAuthorized = true;
                isSudoPM = true;
                finalDest = getBotJid() || remote;
            } else if (await isSudo(botRef, ctx)) {
                isAuthorized = true;
                isSudoPM = true;
                const extracted = await userJidFromCtx(ctx) || { findings: [] };
                finalDest = await findStoredMatchFromFindings(extracted.findings) || remote;
            }
        }

        if (!isAuthorized) return;
        
        if (cmd === 'antilink') {
            const rest = cmdText.replace(new RegExp(`^/?${cmd}\\b`, 'i'), '').trim();
            const { left, gp } = splitRestForGp(rest);
            const mode = left.split(/[, ]+/)[0]?.toLowerCase();

            if (!mode) {
                return (botRef?.sock || botRef).sendMessage(finalDest, { text: '🔗 Command requires a subcommand. Use: .antilink <on|off|status>' });
            }
            if (!['on', 'off', 'status'].includes(mode)) {
                return (botRef?.sock || botRef).sendMessage(finalDest, { text: `🔗 Invalid subcommand: "${mode}". Use on, off, or status.` });
            }

            let targets = [];
            if (isSudoPM) {
                if (!gp) {
                    return (botRef?.sock || botRef).sendMessage(finalDest, { text: '🔗 PM Usage: .antilink <on|off|status> gp:<alias|jid|all>' });
                }
                targets = await resolveTargetsForSudo(gp);
                 if (!targets.length) {
                    return (botRef?.sock || botRef).sendMessage(finalDest, { text: `🔗 Could not resolve any target groups for '${gp}'.` });
                }
            } else { // Group Admin
                targets = await resolveTargetsForGroupAdmin(senderKey);
                if (!targets.length) {
                    return (botRef?.sock || botRef).sendMessage(finalDest, { text: `🔗 This command only works on default connections. Please use /setdefault to configure one.` });
                }
            }

            if (mode === 'on' || mode === 'off') {
                const enable = mode === 'on';
                let successCount = 0;
                for (const chatJid of targets) {
                    if (await setGroupEnabled(chatJid, enable)) {
                        successCount++;
                    }
                }
                await (botRef?.sock || botRef).sendMessage(finalDest, { text: `🔗 Antilink ${enable ? 'ENABLED' : 'DISABLED'} for ${successCount}/${targets.length} group(s).` });
                return; 
            } 
            
            if (mode === 'status') {
                let statusMsg = '🔗 *Antilink Status*\n\n';
                for (const chatJid of targets) {
                    const { enabled } = await getGroupSetting(chatJid);
                    statusMsg += `${chatJid}: ${enabled ? '✅ ON' : '❌ OFF'}\n`;
                }
                await (botRef?.sock || botRef).sendMessage(finalDest, { text: statusMsg });
                return;
            }
        }
        return;
    }

    // --- Antilink Enforcement Logic ---
    if (isGroup) {
        const setting = await getGroupSetting(remote);

        // 1. First, check if the module is even enabled for this group.
        if (!setting.enabled) {
            return;
        }

        // 2. Immediately ignore messages from the bot itself or from any group admin.
        // This is the primary fix for your issue.
        if (ctx.key.fromMe || await isadmin(botRef, ctx)) {
            return;
        }

        // 3. Perform a smarter, combined whitelist check.
        // This new logic correctly distinguishes between JIDs and domains.
        const text = extractTextFromMessage(ctx);
        let isWhitelisted = false;
        for (const item of setting.whitelist) {
            // Check if the whitelist item is a JID and matches the sender
            if (item.includes('@') && item === senderJid) {
                isWhitelisted = true;
                break; // Found a match, no need to check further
            }
            // Check if the whitelist item is a domain and is present in the message text
            if (!item.includes('@') && text.includes(item)) {
                isWhitelisted = true;
                break; // Found a match, no need to check further
            }
        }

        if (isWhitelisted) {
            return;
        }

        // 4. If all checks above have failed, then check for a link and take action.
        if (await messageContainsLink(ctx)) {
            const msgKey = getMessageKey(ctx);
            if (processedMessageIds.has(msgKey)) return;
            processedMessageIds.set(msgKey, setTimeout(() => processedMessageIds.delete(msgKey), 5000));
            enqueueDeletion(ctx);
        }
    }
}

export async function cleanup() {
    shuttingDown = true;
    perChatQueue.clear();
    perChatProcessing.clear();
    processedMessageIds.forEach(timeout => clearTimeout(timeout));
    processedMessageIds.clear();
    perUserWarnings.clear();
    activeChats = 0;
    info('[antilink] cleaned up.');
}

export default { name, version, priority, commands, initialize, onMessage, cleanup };
