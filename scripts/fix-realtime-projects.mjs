/**
 * Repairs workshop pages under Realtime_projects/Antigravity_*:
 * duplicate phase prompt blocks, stripped/mis-encoded characters, dead emoji
 * slots, and prompt text whose line breaks were lost in the .docx conversion.
 * Usage: node scripts/fix-realtime-projects.mjs [--dry]
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'Realtime_projects');
const DRY = process.argv.includes('--dry');

const PROMPT_BLOCK_RE = /[ \t]*<div class="antigravity-phase-prompt"[\s\S]*?<\/pre>\s*<button[\s\S]*?<\/button>\s*<\/div>[ \t]*\r?\n?/g;
const CONTROL_RE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F\uFFFD]/;

// High byte stripped from U+20xx punctuation.
const STRIPPED_PUNCT = {
  '\u0013': '–', '\u0014': '—', '\u0018': '‘', '\u0019': '’', '\u001C': '“', '\u001D': '”',
};

const MOJIBAKE = [
  ['â€¢', '•'], ['â€”', '—'], ['â€“', '–'], ['â€™', '’'], ['â€˜', '‘'], ['â€œ', '“'], ['â€\u009d', '”'], ['â€¦', '…'],
];

// Names that legitimately join a lowercase letter to a capital.
const PROTECTED_TOKENS = ['FastAPI', 'ReactJS', 'PostgreSQL', 'LangGraph', 'LangChain', 'JavaScript', 'TypeScript', 'LangSmith', 'GitHub', 'OpenAI', 'pgVector'];

function reflowPrompt(text) {
  const placeholders = [];
  let out = text.replace(new RegExp(PROTECTED_TOKENS.join('|'), 'g'), (m) => {
    placeholders.push(m);
    return `\u0000${placeholders.length - 1}\u0000`;
  });

  out = out
    .replace(/[ \t]+↓[ \t]*/g, '\n        ↓\n')
    .replace(/([a-z0-9)\]"'’”])([.?!])([A-Z\u0000])/g, '$1$2\n$3')
    .replace(/([a-z]):(?=[A-Z\u0000[])/g, '$1:\n')
    .replace(/([.?:])(\d{1,2})\. (?=[A-Z\u0000])/g, '$1\n$2. ')
    .replace(/([a-z)\]])([A-Z])/g, '$1\n$2')
    .replace(/([A-Z]{2,})(Then|Also|Clearly)\b/g, '$1\n$2')
    .replace(/(\S)->[ \t]?/g, '$1\n-> ')
    .replace(/(\S)-&gt;[ \t]?/g, '$1\n-&gt; ')
    .replace(/([^\s])- (?=\S)/g, '$1\n- ');

  return out.replace(/\u0000(\d+)\u0000/g, (_, i) => placeholders[Number(i)]);
}

function reflowPreBlocks(html) {
  return html.replace(/(<pre[^>]*>)([\s\S]*?)(<\/pre>)/g, (_, open, body, close) => open + reflowPrompt(body) + close);
}

function dedupePromptBlocks(html) {
  const blocks = html.match(PROMPT_BLOCK_RE) || [];
  if (blocks.length < 2) return html;
  const keyOf = (b) => ((b.match(/<pre[^>]*>([\s\S]*?)<\/pre>/) || [])[1] || '').replace(/[^a-z0-9]/gi, '').toLowerCase();
  const kept = new Map();
  for (const block of blocks) {
    const key = keyOf(block);
    const prev = kept.get(key);
    if (!prev) {
      kept.set(key, block);
      continue;
    }
    const prevBroken = CONTROL_RE.test(prev);
    const drop = prevBroken && !CONTROL_RE.test(block) ? prev : block;
    html = html.replace(drop, '');
    if (drop === prev) kept.set(key, block);
  }
  return html;
}

function fixCharacters(html) {
  for (const [bad, good] of MOJIBAKE) html = html.split(bad).join(good);

  // Card titles that lost their leading emoji, e.g. ">}Recommendations", ">:’ Cart Management".
  html = html.replace(/(<div style="font-weight: 600; color: #1f2937; margin-bottom: 0\.5rem;">)(?:[\u0000-\u001F}]|:[\u0000-\u001F]\s?)+/g, '$1');

  // Icon spans that are empty or hold only a corrupted emoji remnant.
  html = html.replace(/[ \t]*<span(?: style="font-size: ?[0-9.]+rem;")?>(?:[\u0000-\u001F}{"'`|~]\uFE0F?)?<\/span>[ \t]*(?:\r?\n)?/g, (m) => {
    const lead = m.match(/^[ \t]*/)[0];
    return m.endsWith('\n') ? '' : lead;
  });

  // Large icon divs left empty or with a lone bullet where an emoji used to be.
  html = html.replace(/[ \t]*<div style="font-size: ?(?:1\.5|1\.875|2)rem; margin-bottom: 0\.[0-9]+rem;">(?:•|[\u0000-\u001F])?<\/div>[ \t]*\r?\n/g, '');

  return html.replace(/[\u0013\u0014\u0018\u0019\u001C\u001D]/g, (c) => STRIPPED_PUNCT[c]);
}

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

let changedCount = 0;
for (const projectDir of fs.readdirSync(root).filter((d) => d.startsWith('Antigravity_'))) {
  for (const file of walk(path.join(root, projectDir))) {
    const base = path.basename(file);
    const ext = path.extname(base).toLowerCase();
    if (!['.html', '.md'].includes(ext)) continue;

    const original = fs.readFileSync(file, 'utf8');
    let text = original;

    if (base === 'antigravity_prompts.md') {
      text = text.split(/(\r?\n---\r?\n)/).map((part) => (/^\r?\n---/.test(part) ? part : reflowPrompt(part))).join('');
    } else if (ext === '.html') {
      text = dedupePromptBlocks(text);
      text = fixCharacters(text);
      if (base === 'Prompt_Library.html' || text.includes('antigravity-phase-prompt')) {
        text = text.replace(/(<div class="antigravity-phase-prompt"[\s\S]*?<\/pre>)/g, (block) => reflowPreBlocks(block));
        if (base === 'Prompt_Library.html') text = reflowPreBlocks(text);
      }
    }

    if (text !== original) {
      changedCount++;
      console.log('fixed', path.relative(root, file));
      if (!DRY) fs.writeFileSync(file, text, 'utf8');
    }
  }
}
console.log(`\n${changedCount} file(s) ${DRY ? 'would change' : 'changed'}`);
