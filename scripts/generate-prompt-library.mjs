import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rt = path.join(__dirname, '../Realtime_projects')
const promptDir = path.join(rt, '_prompt_source')

const MAP = [
  { folder: 'Antigravity_Ecommerce_Fullstack', key: 'ecommerce-fullstack' },
  { folder: 'Antigravity_Ecommerce_Single_Agent', key: 'single-agent' },
  { folder: 'Antigravity_Ecommerce_Multi_Agent', key: 'multi-agent' },
  { folder: 'Antigravity_Ecommerce_Agentic_RAG', key: 'agentic-rag' },
]

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function buildHtml(days, projectName) {
  const cards = days
    .map(
      (d) => `
    <section class="prompt-day" id="day-${d.day}" style="margin-bottom:1.5rem;border:1px solid #e5e7eb;border-radius:12px;padding:1rem;background:#fff;">
      <h3 style="margin:0 0 0.5rem;color:#4338ca;">Day ${d.day}: ${escapeHtml(d.title)}</h3>
      <pre style="white-space:pre-wrap;font-size:0.8rem;line-height:1.5;background:#f8fafc;padding:1rem;border-radius:8px;max-height:320px;overflow:auto;">${escapeHtml(d.promptText)}</pre>
      <button type="button" onclick="navigator.clipboard.writeText(this.previousElementSibling.textContent)" style="margin-top:0.5rem;padding:0.4rem 0.8rem;border-radius:6px;border:1px solid #c7d2fe;background:#eef2ff;cursor:pointer;">Copy prompt</button>
    </section>`
    )
    .join('\n')

  return `<div class="content-body">
  <div class="content-section">
    <h2 style="font-size:1.5rem;font-weight:700;margin-bottom:0.5rem;">Antigravity prompt library</h2>
    <p style="color:#4b5563;margin-bottom:1.5rem;">Day-by-day prompts for <strong>${escapeHtml(projectName)}</strong>. Paste into your AI coding assistant one day at a time; test before moving on.</p>
    ${cards}
  </div>
</div>`
}

function patchNavigation(navPath) {
  if (!fs.existsSync(navPath)) return
  let js = fs.readFileSync(navPath, 'utf8')
  const needle = "{ id: 'overview', file: 'Overview_Content.html', label: 'Overview', icon: '💻' },"
  const insert = `{ id: 'overview', file: 'Overview_Content.html', label: 'Overview', icon: '💻' },
        { id: 'prompt-library', file: 'Prompt_Library.html', label: 'Prompt Library', icon: '📝' },`
  if (!js.includes('Prompt_Library.html') && js.includes(needle)) {
    js = js.replace(needle, insert)
    fs.writeFileSync(navPath, js, 'utf8')
    console.log('Patched navigation:', navPath)
  }
}

for (const { folder, key } of MAP) {
  const jsonPath = path.join(promptDir, `${key}.json`)
  if (!fs.existsSync(jsonPath)) continue
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))
  const days = data.days || []
  const devDir = path.join(rt, folder, 'Development Phase')
  fs.mkdirSync(devDir, { recursive: true })
  const projectJson = JSON.parse(fs.readFileSync(path.join(rt, folder, 'project.json'), 'utf8'))
  fs.writeFileSync(path.join(devDir, 'Prompt_Library.html'), buildHtml(days, projectJson.name), 'utf8')
  patchNavigation(path.join(rt, folder, 'shared', 'navigation.js'))
  console.log('Prompt library:', folder, days.length, 'days')
}
