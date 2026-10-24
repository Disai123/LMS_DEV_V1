/**
 * Extract day/task prompts from Antigravity DOCX files → JSON
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import mammoth from 'mammoth'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const promptsDir = path.join(root, 'Prompts')
const outDir = path.join(root, 'Realtime_projects', '_prompt_source')

const FILES = [
  {
    key: 'ecommerce-fullstack',
    file: 'Antigravity_Ecommerce_24_Day_Task_Wise_Prompts_Final_v2.docx',
  },
  {
    key: 'single-agent',
    file: 'Antigravity_Single_Agent_20_Day_Task_Wise_Prompts_Langfuse_Complete.docx',
  },
  {
    key: 'multi-agent',
    file: 'Antigravity_Multi_Agent_20_Day_Task_Wise_Prompts_Langfuse_Complete_FINAL.docx',
  },
  {
    key: 'agentic-rag',
    file: 'Antigravity_Agentic_RAG_20_Day_Task_Wise_Prompts_Langfuse_Complete.docx',
  },
]

function parseDays(text) {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
  const entries = []
  let current = null

  const dayStart = /^(?:day\s*)?(\d{1,2})\s*[:\.\-\)]\s*(.*)$/i
  const taskStart = /^(?:task\s*)?(\d{1,2})\s*[:\.\-\)]\s*(.*)$/i
  const dayOnly = /^day\s*(\d{1,2})\b/i

  for (const line of lines) {
    const dm = line.match(dayStart) || line.match(taskStart)
    if (dm) {
      if (current?.promptText?.trim()) entries.push(current)
      current = {
        day: parseInt(dm[1], 10),
        title: (dm[2] || `Day ${dm[1]}`).trim().slice(0, 200),
        promptText: '',
      }
      continue
    }
    if (dayOnly.test(line) && !current) {
      const n = parseInt(line.match(dayOnly)[1], 10)
      current = { day: n, title: line, promptText: '' }
      continue
    }
    if (!current) {
      current = { day: entries.length + 1, title: line.slice(0, 120), promptText: line + '\n' }
    } else {
      current.promptText += (current.promptText ? '\n' : '') + line
    }
  }
  if (current?.promptText?.trim()) entries.push(current)

  if (entries.length < 3) {
    const chunks = text.split(/(?=Day\s+\d+)/gi).filter((c) => c.trim())
    if (chunks.length > 1) {
      return chunks.map((chunk, i) => {
        const firstLine = chunk.trim().split(/\n/)[0] || `Day ${i + 1}`
        const dayMatch = firstLine.match(/(\d{1,2})/)
        return {
          day: dayMatch ? parseInt(dayMatch[1], 10) : i + 1,
          title: firstLine.slice(0, 200),
          promptText: chunk.trim(),
        }
      })
    }
  }

  return entries.sort((a, b) => a.day - b.day)
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true })
  for (const { key, file } of FILES) {
    const docPath = path.join(promptsDir, file)
    if (!fs.existsSync(docPath)) {
      console.error('Missing:', docPath)
      continue
    }
    const result = await mammoth.extractRawText({ path: docPath })
    const text = result.value
    const days = parseDays(text)
    const out = {
      sourceFile: file,
      extractedAt: new Date().toISOString(),
      dayCount: days.length,
      days,
      rawTextLength: text.length,
    }
    const outPath = path.join(outDir, `${key}.json`)
    fs.writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8')
    console.log(`Wrote ${outPath} (${days.length} days)`)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
