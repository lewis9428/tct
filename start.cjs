// start.cjs
// Forensic-grade pm2 starter: uses only local pm2, no fallback
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const target = process.argv[2] || 'tct';
const cwd = process.cwd();

function fileExists(p) {
  try { return fs.existsSync(p) && fs.statSync(p).isFile(); }
  catch (e) { return false; }
}

function tryCandidates(baseDir, candidates) {
  for (const c of candidates) {
    const p = path.join(baseDir, c);
    if (fileExists(p)) return p;
  }
  return null;
}

function findEntry() {
  const candidates = ['bot.js','index.js','app.js','start.js','server.js'];
  let entry = tryCandidates(cwd, candidates);
  if (entry) return entry;

  const pkgPath = path.join(cwd, 'package.json');
  if (fileExists(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8') || '{}');
      if (pkg.main && typeof pkg.main === 'string') {
        const resolved = path.resolve(cwd, pkg.main);
        if (fileExists(resolved)) return resolved;
        if (fs.existsSync(resolved) && fs.statSync(resolved).isDirectory()) {
          const inside = tryCandidates(resolved, candidates);
          if (inside) return inside;
        }
      }
    } catch (err) {}
  }

  const files = fs.readdirSync(cwd);
  const jsFiles = files.filter(f => f.endsWith('.js'));
  if (jsFiles.length === 1) return path.join(cwd, jsFiles[0]);

  return null;
}

const entry = findEntry();
if (!entry) {
  console.error('[start.cjs] ERROR: Could not find an entry file (bot.js/index.js/app.js or package.json main).');
  process.exit(2);
}

const entryRel = path.relative(cwd, entry);
const localPm2 = path.join(cwd, 'node_modules', '.bin', 'pm2');

if (!fileExists(localPm2)) {
  console.error('[start.cjs] ERROR: Local pm2 not found at node_modules/.bin/pm2');
  console.error('Please install pm2 locally: npm install pm2');
  process.exit(4);
}

const cmd = `"${localPm2}" start "${entryRel}" --attach --name "${target}"`;
console.log(`[start.cjs] Using local pm2: ${localPm2}`);
console.log(`[start.cjs] Running: ${cmd}`);

try {
  execSync(cmd, { stdio: 'inherit' });
} catch (err) {
  console.error('[start.cjs] pm2 failed to start the entry file:', entryRel);
  process.exit(3);
}
