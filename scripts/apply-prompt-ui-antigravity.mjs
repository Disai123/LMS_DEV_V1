import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rt = path.join(__dirname, '../Realtime_projects')
const promptDir = path.join(rt, '_prompt_source')

const PROJECTS = [
  { folder: 'Antigravity_Ecommerce_Fullstack', key: 'ecommerce-fullstack' },
  { folder: 'Antigravity_Ecommerce_Single_Agent', key: 'single-agent' },
  { folder: 'Antigravity_Ecommerce_Multi_Agent', key: 'multi-agent' },
  { folder: 'Antigravity_Ecommerce_Agentic_RAG', key: 'agentic-rag' },
]

const CONCLUSION_PHASES = [
  { relPath: 'BRD_phase/Conclusion.html', label: 'BRD', phaseId: 'brd' },
  { relPath: 'UI_UX_phase/Conclusion.html', label: 'UI/UX', phaseId: 'uiux' },
  { relPath: 'Architectural_Design_phase/Conclusion.html', label: 'Architecture', phaseId: 'arch' },
  { relPath: 'Development Phase/Conclusion.html', label: 'Development', phaseId: 'dev' },
  { relPath: 'Testing_phase/Conclusion.html', label: 'Testing', phaseId: 'test' },
]

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function findByTitle(days, re) {
  return days.find((d) => re.test(d.title || ''))
}

function findByPrompt(days, ...res) {
  return days.find((d) => res.every((r) => r.test(d.promptText || '')))
}

function findBrdDay(days) {
  const hit = days.find(
    (d) =>
      /BRD|Business Requirements|Existing App Inspection/i.test(d.title || '') &&
      /BRD|Create BRD|update only BRD|update ONLY BRD|only BRD\.md/i.test(d.promptText || '')
  )
  if (hit) return hit
  return findByTitle(days, /Business Requirements|Initiation and BRD|Existing App Inspection/i)
}

const PROMPT_FINDERS = {
  'ecommerce-fullstack': {
    brd: findBrdDay,
    uiux: (days) =>
      findByTitle(days, /UI\/UX Screens/i) || findByPrompt(days, /Create UI_UX\.md/i),
    arch: (days) =>
      findByTitle(days, /Application Architecture/i) || findByPrompt(days, /ARCHITECTURE\.md/i),
    dev: (days) =>
      findByTitle(days, /FastAPI Project Structure/i) ||
      findByPrompt(days, /CODING\.md/i, /authentication/i),
    test: (days) =>
      findByTitle(days, /Final QA/i) || findByPrompt(days, /TESTING\.md/i, /Final/i),
  },
  'single-agent': {
    brd: (days) => findByTitle(days, /Initiation and BRD/i),
    uiux: (days) => findByTitle(days, /^UI\/UX Design$/i),
    arch: (days) => findByTitle(days, /^Architecture Design$/i),
    dev: (days) => findByTitle(days, /Backend Coding Setup/i),
    test: (days) => findByTitle(days, /^Testing and Evaluation$/i),
  },
  'multi-agent': {
    brd: (days) => findByTitle(days, /Initiation and BRD/i),
    uiux: (days) => findByTitle(days, /UI\/UX Design/i),
    arch: (days) => findByTitle(days, /Architecture Design/i),
    dev: (days) => findByTitle(days, /Backend Coding Setup/i),
    test: (days) => findByTitle(days, /Testing and Evaluation/i),
  },
  'agentic-rag': {
    brd: (days) => findByTitle(days, /Existing App Inspection & BRD/i),
    uiux: (days) =>
      days.find((d) => d.title === 'UI/UX Design' && /UI_UX\.md/i.test(d.promptText || '')),
    arch: (days) =>
      days.find(
        (d) =>
          d.title === 'Agentic RAG Architecture' ||
          (/ARCHITECTURE\.md/i.test(d.promptText || '') && /Agentic RAG Architecture/i.test(d.title || ''))
      ),
    dev: (days) =>
      findByTitle(days, /FastAPI Backend Integration/i) ||
      findByTitle(days, /Document Ingestion/i),
    test: (days) => findByTitle(days, /RAG Evaluation & Testing/i),
  },
}

function promptCard(title, promptText, label) {
  const safe = escapeHtml(promptText.trim())
  return `
      <div class="antigravity-phase-prompt" style="background:#f8fafc;border:1px solid #c7d2fe;border-radius:0.5rem;padding:1.25rem;margin-bottom:1.5rem;">
        <h4 style="font-size:1.125rem;font-weight:600;color:#1e293b;margin:0 0 0.5rem;">Antigravity prompt — ${escapeHtml(label)}</h4>
        <p style="font-size:0.875rem;color:#64748b;margin:0 0 0.75rem;">${escapeHtml(title)}. Copy into your AI coding assistant:</p>
        <pre style="white-space:pre-wrap;font-size:0.8rem;line-height:1.55;background:#fff;border:1px solid #e2e8f0;border-radius:0.5rem;padding:1rem;margin:0 0 0.75rem;max-height:280px;overflow:auto;color:#334155;">${safe}</pre>
        <button type="button" onclick="navigator.clipboard.writeText(this.previousElementSibling.textContent)" style="padding:0.5rem 1rem;background:#eef2ff;color:#4338ca;border:1px solid #c7d2fe;border-radius:0.5rem;font-weight:500;cursor:pointer;">Copy prompt</button>
      </div>`
}

const READY_CARD_RE =
  /(\s*)(<div\s*\n?\s*style="background: linear-gradient\(to right, #(?:faf5ff|eef2ff), #eff6ff\)[^>]*>)/i

function removeDownloadLinks(html) {
  return html.replace(/<a[^>]*>\s*Download[\s\S]*?<\/a>\s*/gi, '')
}

function patchPhaseConclusion(folder, relPath, day, label) {
  const file = path.join(rt, folder, relPath)
  if (!fs.existsSync(file) || !day) {
    if (!day) console.warn('No prompt day for', folder, relPath, label)
    return
  }

  let html = fs.readFileSync(file, 'utf8')
  const before = html
  html = removeDownloadLinks(html)

  const marker = `Antigravity prompt — ${label}`
  if (!html.includes(marker)) {
    const card = promptCard(day.title, day.promptText, label)
    if (READY_CARD_RE.test(html)) {
      html = html.replace(READY_CARD_RE, `$1${card}\n$1$2`)
    } else {
      html = html.replace(/Ready to\s*Proceed\?/i, `${card.trim()}\n        Ready to Proceed?`)
    }
  }

  if (html !== before) {
    fs.writeFileSync(file, html, 'utf8')
    console.log('Patched:', folder, relPath)
  }
}

function deploymentSection(projectName) {
  return `<div
      style="background: linear-gradient(to right, #eff6ff, #e0e7ff); border-radius: 0.75rem; padding: 2rem; border: 1px solid #bfdbfe; text-align: center; margin-bottom: 2rem;">
      <h4 style="font-size: 1.875rem; font-weight: 600; color: #1f2937; margin-bottom: 1rem;">Complete Antigravity prompt guide</h4>
      <p
        style="font-size: 1.125rem; color: #4b5563; margin-bottom: 2rem; max-width: 36rem; margin-left: auto; margin-right: auto;">
        Your live app is on Render. To rebuild or extend ${escapeHtml(projectName)}, use the full day-by-day Antigravity prompts—not a separate source download.
      </p>
      <div style="display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center;">
        <a href="../MD_files/antigravity_prompts.md" target="_blank" rel="noopener noreferrer"
          style="padding: 1rem 2rem; background: #3b82f6; color: #ffffff; border-radius: 0.5rem; font-weight: 600; font-size: 1.125rem; text-decoration: none;"
          onmouseover="this.style.background='#2563eb'" onmouseout="this.style.background='#3b82f6'">
          Open full prompt document
        </a>
      </div>
      <p style="margin-top: 1.5rem; font-size: 0.875rem; color: #6b7280;">
        Includes every day&apos;s copy-paste prompt from the workshop. Also available under Development → Prompt Library.
      </p>
    </div>`
}

function patchFinalSteps(folder, projectName) {
  const file = path.join(rt, folder, 'Deployment Phase', 'Final_Steps.html')
  if (!fs.existsSync(file)) return
  let html = fs.readFileSync(file, 'utf8')
  html = removeDownloadLinks(html)

  if (html.includes('Complete Antigravity prompt guide') && !/Download Your/i.test(html)) {
    fs.writeFileSync(file, html, 'utf8')
    return
  }

  const downloadBlock =
    /<div\s*\n?\s*style="background: linear-gradient\(to right, #eff6ff, #e0e7ff\); border-radius: 0\.75rem; padding: 2rem; border: 1px solid #bfdbfe; text-align: center; margin-bottom: 2rem;">\s*<h4[^>]*>Download Your[\s\S]*?<div style="margin-top: 1\.5rem; font-size: 0\.875rem; color: #6b7280;">[\s\S]*?<\/div>\s*<\/div>/i
  if (downloadBlock.test(html)) {
    html = html.replace(downloadBlock, deploymentSection(projectName))
  } else if (!html.includes('Complete Antigravity prompt guide')) {
    html = html.replace(
      /<!-- IMPORTANT: Project Submission Notice -->/,
      deploymentSection(projectName) + '\n\n    <!-- IMPORTANT: Project Submission Notice -->'
    )
  }

  fs.writeFileSync(file, html, 'utf8')
  console.log('Patched Final Steps:', folder)
}

for (const { folder, key } of PROJECTS) {
  const jsonPath = path.join(promptDir, `${key}.json`)
  const pjPath = path.join(rt, folder, 'project.json')
  if (!fs.existsSync(jsonPath)) continue
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))
  const pj = JSON.parse(fs.readFileSync(pjPath, 'utf8'))
  const days = data.days || []
  const finders = PROMPT_FINDERS[key]

  for (const phase of CONCLUSION_PHASES) {
    const finder = finders?.[phase.phaseId]
    const day = finder ? finder(days) : null
    patchPhaseConclusion(folder, phase.relPath, day, phase.label)
  }

  patchFinalSteps(folder, pj.name)
}

console.log('Done.')
