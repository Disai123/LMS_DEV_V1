import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rt = path.join(__dirname, '../Realtime_projects')
const promptDir = path.join(rt, '_prompt_source')

const MAP = [
  { folder: 'Antigravity_Ecommerce_Fullstack', key: 'ecommerce-fullstack', md: 'development' },
  { folder: 'Antigravity_Ecommerce_Single_Agent', key: 'single-agent', md: 'development' },
  { folder: 'Antigravity_Ecommerce_Multi_Agent', key: 'multi-agent', md: 'development' },
  { folder: 'Antigravity_Ecommerce_Agentic_RAG', key: 'agentic-rag', md: 'development' },
]

for (const { folder, key } of MAP) {
  const data = JSON.parse(fs.readFileSync(path.join(promptDir, `${key}.json`), 'utf8'))
  const mdDir = path.join(rt, folder, 'MD_files')
  fs.mkdirSync(mdDir, { recursive: true })
  let md = `# Antigravity prompt guide\n\nSource: ${data.sourceFile}\n\n`
  for (const d of data.days) {
    md += `\n## Day ${d.day} — ${d.title}\n\n${d.promptText}\n\n---\n`
  }
  fs.writeFileSync(path.join(mdDir, 'antigravity_prompts.md'), md, 'utf8')

  const overviewPath = path.join(rt, folder, 'Development Phase', 'Overview_Content.html')
  if (fs.existsSync(overviewPath)) {
    let html = fs.readFileSync(overviewPath, 'utf8')
    const note = `<p style="margin-top:1rem;padding:1rem;background:#eef2ff;border-radius:8px;border:1px solid #c7d2fe;"><strong>Prompt-driven build:</strong> This workshop follows the Antigravity day-by-day prompts. Open the <em>Prompt Library</em> tab in this phase for copy-paste prompts aligned to your live Render demo.</p>`
    if (!html.includes('Prompt-driven build')) {
      html = html.replace('<div class="content-body">', `<div class="content-body">\n${note}`)
      fs.writeFileSync(overviewPath, html, 'utf8')
    }
  }
  console.log('MD + dev overview:', folder)
}
