import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rt = path.join(__dirname, '../Realtime_projects')

const FOLDERS = [
  'Antigravity_Ecommerce_Fullstack',
  'Antigravity_Ecommerce_Single_Agent',
  'Antigravity_Ecommerce_Multi_Agent',
  'Antigravity_Ecommerce_Agentic_RAG',
]

const TEMPLATE = path.join(rt, 'Ecommerce_web/Deployment Phase/Final_Steps.html')

/** Build exact bad prefixes from legacy template (UTF-8 emojis saved as Latin-1 mojibake). */
function buildMojibakeReplacements() {
  const sample = fs.readFileSync(TEMPLATE, 'utf8')
  const anchors = [
    'IMPORTANT: Submit',
    'How to Submit:',
    'Congratulations!',
    '<strong>Tip:</strong>',
  ]
  const reps = new Map()
  for (const anchor of anchors) {
    const i = sample.indexOf(anchor)
    if (i < 1) continue
    let j = i
    while (j > 0 && sample[j - 1] !== '>' && sample[j - 1] !== '\n') j--
    const prefix = sample.slice(j, i)
    if (/[^\x00-\x7E]/.test(prefix)) {
      reps.set(prefix, prefix.replace(/[^\x20-\x7E]/g, '').replace(/\s+$/, '') || '')
    }
  }
  return [...reps.entries()]
}

const MOJIBAKE_REPLACEMENTS = buildMojibakeReplacements()

function walk(dir, cb) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) walk(p, cb)
    else cb(p)
  }
}

function sanitize(html) {
  let out = html
  for (const [bad, good] of MOJIBAKE_REPLACEMENTS) {
    if (bad) out = out.split(bad).join(good)
  }
  // Other common legacy emoji blobs in workshop HTML (exact sequences from templates)
  const extra = [
    ['ðŸŽ‰', ''],
    ['ðŸš€', ''],
    ['ðŸ“‹', ''],
    ['ðŸŽ¨', ''],
    ['ðŸ’»', ''],
    ['ðŸ§ª', ''],
    ['ðŸ›’', ''],
    ['ðŸ’³', ''],
    ['ðŸ‘¤', ''],
    ['ðŸ“¦', ''],
    ['ðŸ”\x90', ''],
    ['ðŸ“\xb1', ''],
    ['ðŸ’\xa1 ', ''],
    ['ðŸ“\x8d ', ''],
    ['âš™ï¸\x8f', ''],
    ['ðŸ—ºï¸\x8f', ''],
    ['âš \xef¸\x8f', ''],
    ['âš\xa0ï¸\x8f', ''],
    ['âš\xa0ï¸\x8f ', ''],
    ['ðŸ‘\xa5', ''],
    ['ðŸ¤–', ''],
  ]
  for (const [bad, good] of extra) {
    out = out.split(bad).join(good)
  }
  // Repair damage from an earlier overly broad cleanup pass
  out = out.replace(/\}0 Congratulations!/g, 'Congratulations!')
  out = out.replace(/<!--\s*\}0\s+/g, '<!-- ')
  out = out.replace(
    /<div style="font-size: 2rem; margin-bottom: 0\.5rem;">a<\/div>/g,
    '<div style="font-size: 2rem; margin-bottom: 0.5rem;"></div>'
  )
  out = out.replace(/\uFE0F\s+(?=IMPORTANT:)/g, '')
  out = out.replace(/\u001c(?=How to Submit:)/g, '')
  out = out.replace(/\u0019(?=<strong>Tip:<)/g, '')
  out = out.replace(/\uFFFD+/g, '')
  out = out.replace(
    /(<div style="font-size: 1\.875rem; margin-bottom: 0\.75rem;">)([\s\S]*?)(<\/div>)/g,
    (m, a, mid, b) => (/[^\x00-\x7E]/.test(mid) ? `${a}•${b}` : m)
  )
  out = out.replace(
    /(<div style="font-size: 1\.5rem; margin-bottom: 0\.5rem;">)([\s\S]*?)(<\/div>)/g,
    (m, a, mid, b) => (/[^\x00-\x7E]/.test(mid) ? `${a}•${b}` : m)
  )
  return out
}

let fixed = 0
for (const folder of FOLDERS) {
  const root = path.join(rt, folder)
  if (!fs.existsSync(root)) continue
  walk(root, (fp) => {
    if (!fp.endsWith('.html')) return
    const raw = fs.readFileSync(fp, 'utf8')
    const next = sanitize(raw)
    if (next === raw) return
    fs.writeFileSync(fp, next, 'utf8')
    fixed++
    console.log('Fixed:', path.relative(rt, fp))
  })
}

console.log('Mojibake prefix rules:', MOJIBAKE_REPLACEMENTS.length)
console.log(`Done. ${fixed} HTML file(s) updated.`)
