import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const labsDir = path.join(__dirname, '../src/fde/exercises/labs')

const MAX = 4
const MAX_CHARS = 100

function trimLine(s) {
  const t = s.trim()
  if (t.length <= MAX_CHARS) return t
  return `${t.slice(0, 97).replace(/\s+\S*$/, '')}…`
}

function patchWhatYouLearnBlock(block) {
  const items = []
  const re = /'((?:\\'|[^'])*)'/g
  let m
  while ((m = re.exec(block)) && items.length < MAX) {
    items.push(trimLine(m[1].replace(/\\'/g, "'")))
  }
  if (!items.length) return null
  const indent = '    '
  const lines = items.map((i) => `${indent}'${i.replace(/'/g, "\\'")}',`)
  return `whatYouLearn: [\n${lines.join('\n')}\n${indent.slice(0, 2)}]`
}

let filesTouched = 0
for (const name of fs.readdirSync(labsDir)) {
  if (!name.endsWith('.js') || name.startsWith('prompt')) continue
  const filePath = path.join(labsDir, name)
  let text = fs.readFileSync(filePath, 'utf8')
  const next = text.replace(/whatYouLearn:\s*\[[\s\S]*?\]/g, (match) => {
    const replacement = patchWhatYouLearnBlock(match)
    return replacement || match
  })
  if (next !== text) {
    fs.writeFileSync(filePath, next)
    filesTouched++
  }
}
console.log(`Trimmed whatYouLearn in ${filesTouched} lab files.`)