import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rt = path.join(__dirname, '../Realtime_projects')

const ALLOWED_URLS = new Set([
  'https://ecommerce-frontend-project.onrender.com',
  'https://ecommerce-single-agent-fastapi-frontend.onrender.com',
  'https://ecommerce-multi-agent-fastapi-frontend.onrender.com',
  'https://agentic-rag-fastapi-frontend.onrender.com',
])

const FOLDER_URL = {
  Antigravity_Ecommerce_Fullstack: 'https://ecommerce-frontend-project.onrender.com',
  Antigravity_Ecommerce_Single_Agent: 'https://ecommerce-single-agent-fastapi-frontend.onrender.com',
  Antigravity_Ecommerce_Multi_Agent: 'https://ecommerce-multi-agent-fastapi-frontend.onrender.com',
  Antigravity_Ecommerce_Agentic_RAG: 'https://agentic-rag-fastapi-frontend.onrender.com',
}

function walk(dir, cb) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) walk(p, cb)
    else cb(p)
  }
}

for (const [folder, liveUrl] of Object.entries(FOLDER_URL)) {
  const root = path.join(rt, folder)
  if (!fs.existsSync(root)) continue

  const shots = path.join(root, 'screenshots')
  if (fs.existsSync(path.join(shots, 'products.png')) && !fs.existsSync(path.join(shots, 'product_detail.png'))) {
    fs.copyFileSync(path.join(shots, 'products.png'), path.join(shots, 'product_detail.png'))
  }

  const brdOverview = path.join(root, 'BRD_phase', 'Overview_Content.html')
  if (fs.existsSync(brdOverview)) {
    let html = fs.readFileSync(brdOverview, 'utf8')
    const banner = `<p style="padding:1rem;background:#ecfdf5;border-left:4px solid #10b981;border-radius:8px;margin-bottom:1rem;"><strong>Antigravity workshop:</strong> Built with prompt-only development. Live app: <a href="${liveUrl}" target="_blank" rel="noopener">${liveUrl}</a></p>`
    if (!html.includes('Antigravity workshop')) {
      html = html.replace('<div class="content-body">', `<div class="content-body">\n${banner}`)
      fs.writeFileSync(brdOverview, html, 'utf8')
    }
  }

  walk(root, (fp) => {
    if (!fp.endsWith('.html')) return
    let html = fs.readFileSync(fp, 'utf8')
    let changed = false
    const urls = html.match(/https:\/\/[a-z0-9-]+\.onrender\.com/gi) || []
    for (const u of urls) {
      if (u !== liveUrl && !ALLOWED_URLS.has(u)) {
        html = html.split(u).join(liveUrl)
        changed = true
      }
    }
    if (changed) fs.writeFileSync(fp, html, 'utf8')
  })
  console.log('Content patch:', folder)
}

// QA: stale URLs
let stale = []
for (const folder of Object.keys(FOLDER_URL)) {
  const root = path.join(rt, folder)
  const expected = FOLDER_URL[folder]
  walk(root, (fp) => {
    if (!/\.(html|js|md|json)$/i.test(fp)) return
    const text = fs.readFileSync(fp, 'utf8')
    const urls = text.match(/https:\/\/[a-z0-9-]+\.onrender\.com/gi) || []
    for (const u of urls) {
      if (u !== expected && !ALLOWED_URLS.has(u)) stale.push({ fp, u })
    }
  })
}
if (stale.length) {
  console.warn('Stale URLs found:', stale.length)
  stale.slice(0, 10).forEach((s) => console.warn(s.fp, s.u))
} else {
  console.log('No stale onrender URLs in Antigravity folders.')
}
