import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const file = path.join(__dirname, '../Realtime_projects/_prompt_source/ecommerce-fullstack.json')
const data = JSON.parse(fs.readFileSync(file, 'utf8'))
const blob = data.days.find((d) => d.day === 5)?.promptText || data.days.map((d) => d.promptText).join('\n')
const parts = blob.split(/\n(?=DAY\s+\d+\s*[—\-])/i).filter(Boolean)
const days = parts.map((part) => {
  const m = part.match(/^DAY\s+(\d+)\s*[—\-]\s*([^\n]+)/i)
  return {
    day: m ? parseInt(m[1], 10) : 0,
    title: m ? m[2].trim() : part.slice(0, 80),
    promptText: part.trim(),
  }
}).filter((d) => d.day > 0)

if (days.length >= 10) {
  data.days = days
  data.dayCount = days.length
  fs.writeFileSync(file, JSON.stringify(data, null, 2))
  console.log('Updated fullstack to', days.length, 'days')
} else {
  console.log('Split failed, kept', data.dayCount)
}
