/**
 * Clone template Realtime project folders → Antigravity variants + global replacements
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const rt = path.join(root, 'Realtime_projects')

const PROJECTS = [
  {
    folder: 'Antigravity_Ecommerce_Fullstack',
    template: 'Ecommerce_web',
    id: 'antigravity-ecommerce-fullstack',
    name: 'Antigravity E-Commerce Full Stack (Prompt Workshop)',
    description:
      'Build a production e-commerce platform using prompt-driven development. React frontend and API backend deployed on Render.',
    category: 'Full-Stack E-Commerce',
    order: 10,
    estimatedHours: 48,
    liveUrl: 'https://ecommerce-frontend-project.onrender.com',
    productName: 'ShopNova',
    replaceUrls: [
      ['https://ecommerce-frontend-hwbf.onrender.com', 'https://ecommerce-frontend-project.onrender.com'],
      ['ecommerce-frontend-hwbf.onrender.com', 'ecommerce-frontend-project.onrender.com'],
    ],
    replaceNames: [
      ['ShopEasy', 'ShopNova'],
      ['E-Commerce Project', 'Antigravity E-Commerce Full Stack'],
      ['E-Commerce application', 'Antigravity e-commerce application'],
    ],
    tags: ['React', 'Node.js', 'PostgreSQL', 'Prompt-driven', 'Render'],
  },
  {
    folder: 'Antigravity_Ecommerce_Single_Agent',
    template: 'Ecommerce_AI_Agent',
    id: 'antigravity-ecommerce-single-agent',
    name: 'Antigravity E-Commerce Single Agent (Prompt Workshop)',
    description:
      'Add a single AI shopping agent to e-commerce with FastAPI, LangChain, and Langfuse—built step-by-step from prompts.',
    category: 'Single AI Agent',
    order: 11,
    estimatedHours: 40,
    liveUrl: 'https://ecommerce-single-agent-fastapi-frontend.onrender.com',
    productName: 'ShopNova AI',
    replaceUrls: [
      ['https://ecommerce-single-agent-official-1.onrender.com', 'https://ecommerce-single-agent-fastapi-frontend.onrender.com'],
      ['ecommerce-single-agent-official-1.onrender.com', 'ecommerce-single-agent-fastapi-frontend.onrender.com'],
    ],
    replaceNames: [
      ['Ecommerce Single AI Agent', 'Antigravity Single Agent E-Commerce'],
      ['AI Agent', 'Single Agent Assistant'],
    ],
    tags: ['FastAPI', 'LangChain', 'Langfuse', 'React', 'Prompt-driven'],
  },
  {
    folder: 'Antigravity_Ecommerce_Multi_Agent',
    template: 'Ecommerce_multi_agent',
    id: 'antigravity-ecommerce-multi-agent',
    name: 'Antigravity E-Commerce Multi-Agent (Prompt Workshop)',
    description:
      'Orchestrate multiple AI agents for shopping with LangGraph and FastAPI—prompt-guided implementation on Render.',
    category: 'Multi-Agent AI System',
    order: 12,
    estimatedHours: 45,
    liveUrl: 'https://ecommerce-multi-agent-fastapi-frontend.onrender.com',
    productName: 'ShopNova Multi-Agent',
    replaceUrls: [],
    replaceNames: [
      ['Ecommerce Multi-Agent Assistant', 'Antigravity Multi-Agent E-Commerce'],
      ['Multi-Agent', 'Antigravity Multi-Agent'],
    ],
    tags: ['LangGraph', 'FastAPI', 'Multi-Agent', 'React', 'Prompt-driven'],
  },
  {
    folder: 'Antigravity_Ecommerce_Agentic_RAG',
    template: 'Ecommerce_AI_Agent',
    id: 'antigravity-ecommerce-agentic-rag',
    name: 'Antigravity Agentic RAG E-Commerce (Prompt Workshop)',
    description:
      'Build an agentic RAG assistant over e-commerce catalog and policies with citations, FastAPI, and React on Render.',
    category: 'Agentic RAG',
    order: 13,
    estimatedHours: 40,
    liveUrl: 'https://agentic-rag-fastapi-frontend.onrender.com',
    productName: 'ShopNova RAG',
    replaceUrls: [
      ['https://ecommerce-single-agent-official-1.onrender.com', 'https://agentic-rag-fastapi-frontend.onrender.com'],
      ['ecommerce-single-agent-official-1.onrender.com', 'agentic-rag-fastapi-frontend.onrender.com'],
    ],
    replaceNames: [
      ['Ecommerce Single AI Agent', 'Antigravity Agentic RAG'],
      ['AI shopping assistant', 'Agentic RAG shopping assistant'],
      ['Single Agent', 'Agentic RAG'],
    ],
    tags: ['RAG', 'FastAPI', 'Agents', 'Langfuse', 'React', 'Prompt-driven'],
  },
]

function copyDir(src, dest, skip = new Set(['Agent_Skills_phase'])) {
  fs.mkdirSync(dest, { recursive: true })
  for (const ent of fs.readdirSync(src, { withFileTypes: true })) {
    if (skip.has(ent.name)) continue
    const s = path.join(src, ent.name)
    const d = path.join(dest, ent.name)
    if (ent.isDirectory()) copyDir(s, d, skip)
    else fs.copyFileSync(s, d)
  }
}

function walkFiles(dir, cb) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) walkFiles(p, cb)
    else cb(p)
  }
}

function applyReplacements(filePath, pairs) {
  const ext = path.extname(filePath).toLowerCase()
  const textExts = new Set(['.html', '.js', '.css', '.md', '.json', '.svg'])
  if (!textExts.has(ext)) return
  let content = fs.readFileSync(filePath, 'utf8')
  let changed = false
  for (const [from, to] of pairs) {
    if (content.includes(from)) {
      content = content.split(from).join(to)
      changed = true
    }
  }
  if (changed) fs.writeFileSync(filePath, content, 'utf8')
}

function writeProjectJson(destFolder, cfg) {
  const jsonPath = path.join(destFolder, 'project.json')
  const projectJson = {
    id: cfg.id,
    name: cfg.name,
    description: cfg.description,
    category: cfg.category,
    difficulty: 'advanced',
    estimatedHours: cfg.estimatedHours,
    order: cfg.order,
    tags: cfg.tags,
    version: '1.0.0',
    liveDemoUrl: cfg.liveUrl,
    promptSourceKey: cfg.promptKey,
  }
  fs.writeFileSync(jsonPath, JSON.stringify(projectJson, null, 2), 'utf8')
}

function ensureLiveUrlInFinalSteps(destFolder, liveUrl, productName) {
  const finalPath = path.join(destFolder, 'Deployment Phase', 'Final_Steps.html')
  if (!fs.existsSync(finalPath)) return
  let html = fs.readFileSync(finalPath, 'utf8')
  html = html.replace(/https:\/\/[a-z0-9-]+\.onrender\.com/gi, liveUrl)
  if (!html.includes(liveUrl)) {
    html = html.replace(
      /(<span[^>]*font-family:\s*monospace[^>]*>)([^<]*)(<\/span>)/i,
      `$1${liveUrl}$3`
    )
  }
  fs.writeFileSync(finalPath, html, 'utf8')
}

async function main() {
  for (const cfg of PROJECTS) {
    const src = path.join(rt, cfg.template)
    const dest = path.join(rt, cfg.folder)
    if (!fs.existsSync(src)) {
      console.error('Template missing:', src)
      continue
    }
    if (fs.existsSync(dest)) {
      console.log('Removing existing', dest)
      fs.rmSync(dest, { recursive: true, force: true })
    }
    console.log('Copying', cfg.template, '→', cfg.folder)
    copyDir(src, dest)

    const allPairs = [...cfg.replaceUrls, ...cfg.replaceNames]
    allPairs.push([cfg.liveUrl, cfg.liveUrl])
    walkFiles(dest, (fp) => applyReplacements(fp, allPairs))

    cfg.promptKey = cfg.id.replace('antigravity-ecommerce-', '').replace('antigravity-', '')
    if (cfg.folder.includes('Fullstack')) cfg.promptKey = 'ecommerce-fullstack'
    if (cfg.folder.includes('Single_Agent')) cfg.promptKey = 'single-agent'
    if (cfg.folder.includes('Multi_Agent')) cfg.promptKey = 'multi-agent'
    if (cfg.folder.includes('Agentic_RAG')) cfg.promptKey = 'agentic-rag'

    writeProjectJson(dest, cfg)
    ensureLiveUrlInFinalSteps(dest, cfg.liveUrl, cfg.productName)
    console.log('Done:', cfg.folder)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
