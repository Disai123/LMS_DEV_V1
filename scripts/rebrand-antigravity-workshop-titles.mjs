/**
 * One-off: professional display titles in Antigravity workshop shell UI.
 * Skips Prompt_Library.html and antigravity_prompts.md (prompt track unchanged).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'Realtime_projects');

const SKIP_FILES = new Set(['Prompt_Library.html', 'antigravity_prompts.md']);

const GLOBAL_IN_ANTIGRAVITY = [
  ['<strong>Antigravity workshop:</strong> Built with prompt-only development.', '<strong>Live demo:</strong>'],
  ['Define the e-commerce scope with Antigravity prompts:', 'Define the e-commerce scope:'],
  ['Project goal + Antigravity Day 2 BRD prompt', 'Project goal + BRD requirements'],
];

const PROJECTS = [
  {
    dir: 'Antigravity_Ecommerce_Fullstack',
    replacements: [
      ['Antigravity E-Commerce Full Stack (Prompt Workshop)', 'E-Commerce Web Application'],
      ['Antigravity E-Commerce Full Stack', 'E-Commerce Web Application'],
      ['Antigravity e-commerce application', 'the e-commerce application'],
      ['Antigravity e-commerce', 'the e-commerce'],
      ['this Antigravity prompt workshop', 'this e-commerce project'],
      ['Antigravity prompt workshop', 'e-commerce project'],
      ['Antigravity workshop:', 'Workshop:'],
      ['🏪 Antigravity E-Commerce Full Stack', '🏪 E-Commerce Web Application'],
    ],
  },
  {
    dir: 'Antigravity_Ecommerce_Single_Agent',
    replacements: [
      ['Antigravity E-Commerce Single Agent (Prompt Workshop)', 'E-Commerce AI Shopping Agent'],
      ['Antigravity E-Commerce Single Agent', 'E-Commerce AI Shopping Agent'],
      ['Ecommerce Single Agent Assistant (askunicart)', 'E-Commerce AI Shopping Agent'],
      ['Ecommerce Single Agent Assistant', 'E-Commerce AI Shopping Agent'],
    ],
  },
  {
    dir: 'Antigravity_Ecommerce_Multi_Agent',
    replacements: [
      ['Antigravity E-Commerce Multi-Agent (Prompt Workshop)', 'Multi-Agent E-Commerce Assistant'],
      ['Antigravity E-Commerce Multi-Agent', 'Multi-Agent E-Commerce Assistant'],
      ['Antigravity Multi-Agent E-commerce Assistant', 'Multi-Agent E-Commerce Assistant'],
      ['Antigravity Multi-Agent E-Commerce Assistant', 'Multi-Agent E-Commerce Assistant'],
      ['Antigravity Multi-Agent Assistant', 'Multi-Agent E-Commerce Assistant'],
      ['Antigravity Multi-Agent System Deployed', 'Multi-Agent system deployed'],
      ['Antigravity Multi-Agent System', 'Multi-Agent E-Commerce System'],
      ['Antigravity Multi-Agent Home', 'Multi-Agent home'],
      ['Antigravity Multi-Agent Chat', 'Multi-Agent chat'],
      ['Antigravity Multi-Agent Panel', 'Multi-Agent panel'],
      ['Antigravity Multi-Agent</span>', 'Multi-Agent</span>'],
      ['🤖 Antigravity Multi-Agent E-commerce Assistant', '🤖 Multi-Agent E-Commerce Assistant'],
      ['Antigravity Multi-Agent Flow', 'Multi-agent orchestration flow'],
      ['Antigravity Multi-Agent', 'Multi-Agent E-Commerce'],
    ],
  },
  {
    dir: 'Antigravity_Ecommerce_Agentic_RAG',
    replacements: [
      ['Antigravity Agentic RAG E-Commerce (Prompt Workshop)', 'Agentic RAG E-Commerce Assistant'],
      ['Antigravity Agentic RAG E-Commerce', 'Agentic RAG E-Commerce Assistant'],
      ['Ecommerce AI Agent', 'Agentic RAG E-Commerce Assistant'],
    ],
  },
];

function walk(dir, callback) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full, callback);
    else callback(full, ent.name);
  }
}

let filesChanged = 0;
for (const { dir, replacements } of PROJECTS) {
  const projectPath = path.join(root, dir);
  if (!fs.existsSync(projectPath)) {
    console.warn('Skip missing', dir);
    continue;
  }
  walk(projectPath, (filePath, baseName) => {
    if (SKIP_FILES.has(baseName)) return;
    const ext = path.extname(baseName).toLowerCase();
    if (!['.html', '.md', '.json'].includes(ext)) return;
    if (baseName === 'project.json') return;

    let content = fs.readFileSync(filePath, 'utf8');
    let next = content;
    const allReplacements = [...GLOBAL_IN_ANTIGRAVITY, ...replacements];
    for (const [from, to] of allReplacements) {
      next = next.split(from).join(to);
    }
    if (next !== content) {
      fs.writeFileSync(filePath, next, 'utf8');
      filesChanged++;
    }
  });
}

console.log('Updated', filesChanged, 'files');
