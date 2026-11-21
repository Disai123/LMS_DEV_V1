import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const contentDir = path.join(__dirname, '../src/fde/data/content')

function briefText(text) {
  if (!text || typeof text !== 'string') return ''
  const clean = text.replace(/\*\*/g, '').replace(/\n+/g, ' ').trim()
  if (clean.length <= 160) return clean
  const parts = clean.split(/(?<=[.!?])\s+/)
  return parts.slice(0, 2).join(' ').slice(0, 200).trim()
}

function patchFile(filePath) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  let changed = 0
  for (const [key, entry] of Object.entries(data)) {
    if (!/\/lab-/.test(key)) continue
    const summary = briefText(entry.summary)
    const overviewSec =
      entry.sections?.find((s) => /^overview$/i.test(s.heading)) ||
      entry.sections?.[0]
    const overviewBody = briefText(overviewSec?.body || summary || entry.summary)
    entry.summary = summary || overviewBody
    entry.sections = [{ heading: 'Overview', body: overviewBody || summary }]
    if (entry.typeExtras?.objectives) {
      entry.typeExtras.objectives = entry.typeExtras.objectives.slice(0, 3).map((o) => briefText(o))
    }
    changed++
  }
  if (changed) fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n')
  return changed
}

let total = 0
for (const name of fs.readdirSync(contentDir)) {
  if (!name.endsWith('.json')) continue
  total += patchFile(path.join(contentDir, name))
}
console.log(`Patched ${total} lab content entries.`)