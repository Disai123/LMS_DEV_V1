import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rt = path.join(__dirname, '../Realtime_projects')

const configs = fs
  .readdirSync(rt)
  .filter((f) => f.startsWith('Antigravity_'))
  .map((folder) => {
    const pj = JSON.parse(fs.readFileSync(path.join(rt, folder, 'project.json'), 'utf8'))
    return { folder, ...pj }
  })

for (const cfg of configs) {
  const indexPath = path.join(rt, cfg.folder, 'index.html')
  if (!fs.existsSync(indexPath)) continue
  let html = fs.readFileSync(indexPath, 'utf8')
  if (html.includes('Antigravity Prompt Workshop')) continue

  html = html.replace(/<title>[^<]*<\/title>/, `<title>${cfg.name} - Overview</title>`)

  const badge = `<div style="display:inline-block;margin-bottom:1rem;padding:0.35rem 0.85rem;border-radius:999px;background:rgba(99,102,241,0.15);color:#4338ca;font-size:0.75rem;font-weight:700;letter-spacing:0.04em;">ANTIGRAVITY · PROMPT WORKSHOP · LIVE ON RENDER</div>`

  if (!html.includes('ANTIGRAVITY · PROMPT WORKSHOP')) {
    html = html.replace(/(<h1[^>]*>)/i, badge + '\n$1')
  }

  if (cfg.liveDemoUrl && !html.includes(cfg.liveDemoUrl)) {
    html = html.replace(/https:\/\/[a-z0-9-]+\.onrender\.com/gi, cfg.liveDemoUrl)
  }

  fs.writeFileSync(indexPath, html, 'utf8')
  console.log('Patched index:', cfg.folder)
}
