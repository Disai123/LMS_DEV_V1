/**
 * Audit Realtime_projects HTML/MD for duplicate phase prompt blocks and broken characters.
 * Usage: node scripts/audit-realtime-projects.mjs [--fix]
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'Realtime_projects');
const FIX = process.argv.includes('--fix');

const BLOCK_RE = /[ \t]*<div class="antigravity-phase-prompt"[\s\S]*?<\/pre>\s*<button[\s\S]*?<\/button>\s*<\/div>[ \t]*\r?\n?/g;
const BAD_CHAR_RE = /[\uFFFD\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]|â€|Ã[\u0080-\u00BF]|Â[\u00A0-\u00BF]/;

const normalize = (s) => s.replace(/[^a-z0-9]/gi, '').toLowerCase();

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full, out);
    else if (/\.(html|md|js|css|json)$/i.test(ent.name)) out.push(full);
  }
  return out;
}

const issues = [];
let fixedFiles = 0;

for (const file of walk(root)) {
  const rel = path.relative(root, file);
  let text = fs.readFileSync(file, 'utf8');
  let changed = false;

  const blocks = text.match(BLOCK_RE) || [];
  if (blocks.length > 1) {
    const seen = new Map();
    for (const block of blocks) {
      const pre = (block.match(/<pre[^>]*>([\s\S]*?)<\/pre>/) || [])[1] || '';
      const key = normalize(pre);
      const isBroken = BAD_CHAR_RE.test(block);
      if (!seen.has(key)) {
        seen.set(key, { block, isBroken });
        continue;
      }
      const prev = seen.get(key);
      const drop = prev.isBroken && !isBroken ? prev.block : block;
      issues.push(`${rel}: duplicate prompt block`);
      if (FIX) {
        text = text.replace(drop, '');
        changed = true;
      }
      if (drop === prev.block) seen.set(key, { block, isBroken });
    }
  }

  text.split(/\r?\n/).forEach((line, i) => {
    if (BAD_CHAR_RE.test(line)) {
      issues.push(`${rel}:${i + 1}: broken character -> ${line.trim().slice(0, 100)}`);
    }
  });

  if (changed) {
    fs.writeFileSync(file, text, 'utf8');
    fixedFiles++;
  }
}

console.log(issues.length ? issues.join('\n') : 'No issues found');
console.log(`\n${issues.length} issue(s)${FIX ? `, ${fixedFiles} file(s) fixed` : ''}`);
