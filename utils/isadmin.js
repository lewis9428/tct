// utils/isadmin.js
import { info as _info, warn as _warn, error as _error } from './logger.js';

/**
 * isadmin.js v2.0.0
 *
 * This version introduces a permanent, event-driven cache and resilient fetching.
 * - PERMANENT CACHE: The admin list for a group is now cached indefinitely. The 7-day TTL has been removed.
 * - EVENT-DRIVEN REFRESH: The cache is still intelligently invalidated or updated instantly when a user is promoted, demoted, added, or removed from a group.
 * - RESILIENT FETCHING: On a cache miss, the function will now retry the network request up to 3 times to overcome transient network errors, preventing admins from being accidentally warned.
 */

/* ------------------------- Logging (silent except errors) ------------------------- */
const info = () => {};
const warn = _warn; // Use the real warn for retry attempts
const error = _error;

/* ------------------------- Utilities ------------------------- */

function now() {
  return Date.now();
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function normalizeJid(jid) {
  if (!jid || typeof jid !== 'string') return jid;
  const s = jid.trim().toLowerCase();
  const atIdx = s.indexOf('@');
  if (atIdx === -1) {
    const local = s.split(/[:/]/)[0];
    return local;
  }
  const local = s.slice(0, atIdx).split(/[:/]/)[0];
  const domain = s.slice(atIdx + 1);
  return `${local}@${domain}`;
}

function jidEquals(a, b) {
  try {
    if (!a || !b) return false;
    return normalizeJid(a) === normalizeJid(b);
  } catch (e) {
    try { error(e, 'jidEquals error'); } catch (ee) {}
    return false;
  }
}

function normalizeParticipantId(p) {
  if (!p) return null;
  if (typeof p === 'string') return normalizeJid(p);
  const possible = p?.id ?? p?.jid ?? p?.participant ?? null;
  return possible ? normalizeJid(possible) : null;
}

function buildAdminSetFromParticipants(participants = []) {
  const admins = new Set();
  for (const p of participants) {
    if (!p) continue;
    if (typeof p === 'string') {
      continue;
    }

    const id = normalizeParticipantId(p);
    if (!id) continue;

    const role = (p?.role || p?.participantType || '').toString().toLowerCase();
    const isAdminFlag =
      !!p?.isAdmin ||
      !!p?.isSuperAdmin ||
      !!p?.admin ||
      !!p?.superAdmin ||
      !!p?.isCreator ||
      role === 'admin' ||
      role === 'creator' ||
      role === 'superadmin' ||
      role === 'owner';

    if (isAdminFlag) admins.add(id);
  }
  return admins;
}

/* ------------------------- Helpers for message shapes ------------------------- */

function getChatIdFromMessage(m) {
  if (!m) return null;
  const candidate =
    m?.key?.remoteJid ??
    m?.remoteJid ??
    m?.key?.from ??
    m?.key?.participant ??
    null;
  return candidate || null;
}

/* ------------------------- Attachment / Reattachment ------------------------- */

function ensureAdminCache(bot) {
  if (!bot) return;

  if (!bot._adminCache) {
    bot._adminCache = new Map();
  }
  
  // bot.adminCacheTtl is no longer used, but we don't remove it to avoid breaking other potential dependencies.

  if (!bot._adminCacheFetches) bot._adminCacheFetches = new Map();

  const attachListenersToSock = (sock) => {
    try {
      if (!sock || !sock.ev || typeof sock.ev.on !== 'function') return;
      if (bot._adminCacheHandlers && bot._adminCacheHandlers.sock === sock) {
        return;
      }

      if (bot._adminCacheHandlers && bot._adminCacheHandlers.sock) {
        const old = bot._adminCacheHandlers;
        try {
          if (old.sock.ev && typeof old.sock.ev.off === 'function') {
            if (old.gpHandler) old.sock.ev.off('group-participants.update', old.gpHandler);
            if (old.upsertHandler) old.sock.ev.off('messages.upsert', old.upsertHandler);
          }
        } catch (e) {}
      }

      const gpHandler = (update) => {
        try {
          const { id: chatIdRaw, participants = [], action } = update || {};
          if (!chatIdRaw) return;
          const chatId = chatIdRaw;
          const cacheEntry = bot._adminCache.get(chatId);
          
          if (!cacheEntry) {
              if (['add', 'remove', 'leave', 'invite', 'change', 'promote', 'demote'].includes(action)) {
                if (bot._adminCache.has(chatId)) bot._adminCache.delete(chatId);
              }
              return;
          }

          const partIds = participants.map(normalizeParticipantId).filter(Boolean);

          if (action === 'promote' || action === 'demote') {
            const admins = new Set(cacheEntry.admins);
            if (action === 'promote') {
              for (const pid of partIds) admins.add(pid);
            } else {
              for (const pid of partIds) admins.delete(pid);
            }
            cacheEntry.admins = admins;
            bot._adminCache.set(chatId, cacheEntry);
            return;
          }

          if (['add', 'remove', 'leave', 'invite', 'change'].includes(action)) {
            bot._adminCache.delete(chatId);
            return;
          }
        } catch (e) {
          try { error(e, 'admin-cache: group-participants.update handler failed'); } catch (ee) {}
        }
      };

      const upsertHandler = ({ messages }) => {
        try {
          if (!Array.isArray(messages)) return;
          for (const m of messages) {
            const stub = m?.message?.messageStubType ?? m?.messageStubType;
            const params = m?.message?.messageStubParameters ?? m?.messageStubParameters;
            const chatId = getChatIdFromMessage(m);
            if (!chatId || !stub) continue;

            const cacheEntry = bot._adminCache.get(chatId);

            if (!cacheEntry) {
              if ([24, 25, 26, 27, 29, 30].includes(stub)) {
                bot._adminCache.delete(chatId);
              }
              continue;
            }

            const paramIds = Array.isArray(params) ? params.map(normalizeParticipantId).filter(Boolean) : [];

            if (stub === 29 && paramIds.length) { // promoted
              for (const pid of paramIds) cacheEntry.admins.add(pid);
              bot._adminCache.set(chatId, cacheEntry);
            } else if (stub === 30 && paramIds.length) { // demoted
              for (const pid of paramIds) cacheEntry.admins.delete(pid);
              bot._adminCache.set(chatId, cacheEntry);
            } else if ([24, 25, 26, 27].includes(stub)) { // structural changes
              bot._adminCache.delete(chatId);
            }
          }
        } catch (e) {
          try { error(e, 'admin-cache: messages.upsert handler failed'); } catch (ee) {}
        }
      };

      sock.ev.on('group-participants.update', gpHandler);
      sock.ev.on('messages.upsert', upsertHandler);

      bot._adminCacheHandlers = { sock, gpHandler, upsertHandler };
      bot._adminCacheListenersAttached = true;
      bot._adminCacheAttachedAt = now();
    } catch (e) {
      try { error(e, 'admin-cache: attach listeners failed'); } catch (ee) {}
    }
  };

  if (bot.sock && bot.sock.ev && typeof bot.sock.ev.on === 'function') {
    attachListenersToSock(bot.sock);
  }

  if (!bot._adminCacheSockMonitor) {
    bot._adminCacheSockMonitor = setInterval(() => {
      try {
        const currentSock = bot.sock;
        const attachedSock = bot._adminCacheHandlers && bot._adminCacheHandlers.sock;
        if (currentSock && currentSock !== attachedSock) {
          attachListenersToSock(currentSock);
        }
      } catch (e) {}
    }, 2000);
  }
}

/* ------------------------- Resilient Fetch with Retries ------------------------- */

async function fetchGroupMetadataDeduped(bot, chatId) {
  if (!bot || !chatId) return null;
  if (!bot._adminCacheFetches) bot._adminCacheFetches = new Map();

  const existing = bot._adminCacheFetches.get(chatId);
  if (existing) return existing;

  const p = (async () => {
    // --- NEW: RETRY LOGIC ---
    for (let i = 0; i < 3; i++) {
        try {
            const metadata =
                (typeof bot.groupMetadata === 'function' && (await bot.groupMetadata(chatId))) ||
                (bot.sock && typeof bot.sock.groupMetadata === 'function' && (await bot.sock.groupMetadata(chatId))) ||
                (typeof bot.getGroupMetadata === 'function' && (await bot.getGroupMetadata(chatId))) ||
                (bot.sock && typeof bot.sock.fetchGroupMetadata === 'function' && (await bot.sock.fetchGroupMetadata(chatId))) ||
                null;
            
            // If we get a successful result, return it immediately.
            if (metadata) {
                return metadata;
            }

            // If metadata is null but no error was thrown, it's still a failure to fetch.
            warn(`[isadmin] Metadata fetch for ${chatId} returned null. Attempt #${i + 1}.`);

        } catch (e) {
            warn(`[isadmin] Metadata fetch for ${chatId} failed with error on attempt #${i + 1}: ${e.message}`);
        }
        
        // If it's not the last attempt, wait before retrying.
        if (i < 2) {
            await sleep(300 * (i + 1)); // Wait 300ms, then 600ms
        }
    }
    
    // If all retries fail, log a final error and return null.
    error(`[isadmin] All 3 attempts to fetch metadata for ${chatId} failed.`);
    return null;
    // --- END: RETRY LOGIC ---
  })().finally(() => {
      // Always remove the in-flight promise after it resolves or rejects.
      try { bot._adminCacheFetches && bot._adminCacheFetches.delete(chatId); } catch (ee) {}
  });

  bot._adminCacheFetches.set(chatId, p);
  return p;
}


/* ------------------------- Public helpers ------------------------- */

export function invalidateAdminCacheForChat(bot, chatId) {
  try {
    if (!bot || !chatId) return;
    if (bot._adminCache && bot._adminCache.has(chatId)) {
      bot._adminCache.delete(chatId);
    }
  } catch (e) {
    try { error(e, 'invalidateAdminCacheForChat failed'); } catch (ee) {}
  }
}

export function clearAdminCache(bot) {
  try {
    if (!bot) return;
    if (bot._adminCache) bot._adminCache.clear();
  } catch (e) {
    try { error(e, 'clearAdminCache failed'); } catch (ee) {}
  }
}

export function teardownAdminCache(bot) {
  try {
    if (!bot) return;
    if (bot._adminCacheSockMonitor) {
      try { clearInterval(bot._adminCacheSockMonitor); } catch (e) {}
      bot._adminCacheSockMonitor = null;
    }
    if (bot._adminCacheHandlers && bot._adminCacheHandlers.sock) {
      try {
        const old = bot._adminCacheHandlers;
        if (old.sock?.ev?.off) {
          if (old.gpHandler) old.sock.ev.off('group-participants.update', old.gpHandler);
          if (old.upsertHandler) old.sock.ev.off('messages.upsert', old.upsertHandler);
        }
      } catch (e) {}
    }
    if (bot._adminCache) {
      try { bot._adminCache.clear(); } catch (e) {}
      bot._adminCache = new Map();
    }
    if (bot._adminCacheFetches) {
      try { bot._adminCacheFetches.clear(); } catch (e) {}
      bot._adminCacheFetches = new Map();
    }
    bot._adminCacheHandlers = null;
    bot._adminCacheListenersAttached = false;
  } catch (e) {
    try { error(e, 'teardownAdminCache failed'); } catch (ee) {}
  }
}

/* ------------------------- isadmin function ------------------------- */

export async function isadmin(bot, ctx) {
  try {
    if (!bot || !ctx?.key) return false;
    if (ctx.key.fromMe) return true;

    const chatId = ctx.key.remoteJid || ctx.remoteJid || null;
    if (!chatId || !String(chatId).endsWith('@g.us')) {
      return false; // Not a group
    }

    const senderRaw = ctx.key.participant || ctx.participant || ctx.sender || ctx.key?.from || null;
    if (!senderRaw) return false;
    const sender = normalizeJid(senderRaw);

    ensureAdminCache(bot);

    // --- MODIFIED: PERMANENT CACHE CHECK ---
    // Fast-path: Check for a permanent cached entry. No expiry check needed.
    const cached = bot._adminCache && bot._adminCache.get(chatId);
    if (cached && cached.admins instanceof Set) {
      for (const a of cached.admins) {
        if (a && jidEquals(a, sender)) return true;
      }
      return false;
    }
    // --- END MODIFICATION ---

    // Cache miss -> fetch metadata (now with retries)
    const metadata = await fetchGroupMetadataDeduped(bot, chatId);
    if (!metadata) {
      // All fetch attempts failed -> return false (safe)
      return false;
    }

    const participants = Array.isArray(metadata?.participants) ? metadata.participants : [];
    const admins = buildAdminSetFromParticipants(participants);

    // --- MODIFIED: PERSIST PERMANENT CACHE ---
    // Persist in cache without any TTL or expiry.
    bot._adminCache.set(chatId, { admins });
    // --- END MODIFICATION ---

    for (const a of admins) {
      if (a && jidEquals(a, sender)) return true;
    }
    return false;
  } catch (err) {
    try { error(err, 'isadmin: unexpected error'); } catch (e) {}
    return false;
  }
}

/* ------------------------- Exports (maintain API) ------------------------- */

export default { isadmin, invalidateAdminCacheForChat, clearAdminCache, teardownAdminCache };
