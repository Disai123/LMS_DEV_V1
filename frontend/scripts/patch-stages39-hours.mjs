import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const stagesPath = path.resolve(__dirname, '../src/fde/data/stages.json')
const data = JSON.parse(fs.readFileSync(stagesPath, 'utf8'))

const patches = {
  'fde-sdlc-business-requirement': {
    hours: 1,
    readMinutes: [8, 8, 8, 8, 8],
    practiseMinutes: [12, 8], // lab, assignment
  },
  'fde-sdlc-ui-ux-solution': {
    hours: 1,
    readMinutes: [8, 8, 8, 8, 8],
    practiseMinutes: [12, 8],
  },
  'fde-sdlc-architecture-solution': {
    hours: 1,
    readMinutes: [8, 8, 8, 8, 8],
    practiseMinutes: [12, 8],
  },
  development: {
    hours: 8,
    readMinutes: [12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
    practiseMinutes: [100, 85, 100, 75], // lab4, assign1, lab5, assign2
  },
  'mvp-poc-local-render': {
    hours: 2,
    readMinutes: [10, 10, 10, 10, 10, 10],
    practiseMinutes: [40, 20],
  },
  'production-deployment': {
    hours: 1,
    readMinutes: [8, 8, 8, 6],
    practiseMinutes: [12, 10, 8], // 7a, 7b, assignment
  },
  'enterprise-ai-fde': {
    hours: 2,
    readMinutes: [10, 10, 10, 10],
    practiseMinutes: [30, 25, 25],
  },
}

for (const stage of data.stages) {
  const p = patches[stage.slug]
  if (!p) continue
  stage.hours = p.hours
  p.readMinutes.forEach((m, i) => {
    if (stage.reads[i]) stage.reads[i].minutes = m
  })
  p.practiseMinutes.forEach((m, i) => {
    if (stage.practise[i]) stage.practise[i].minutes = m
  })
}

data.faq = data.faq.map((f) =>
  f.question === 'How are the 48 hours split?'
    ? {
        ...f,
        answer:
          'Section 1 is 16 hours (5h Python and FastAPI + 11h AI engineering). Section 2 is 16 hours: Stages 3–5 are 1h each; Development 8h; MVP/POC 2h; Production deployment 1h; Enterprise AI FDE 2h. Section 3 is 16 hours dedicated to four 4-hour hands-on capstone projects.',
      }
    : f
)

fs.writeFileSync(stagesPath, JSON.stringify(data, null, 2) + '\n')

let ok = true
for (const slug of Object.keys(patches)) {
  const stage = data.stages.find((s) => s.slug === slug)
  const readSum = stage.reads.reduce((a, x) => a + Number(x.minutes), 0)
  const pracSum = stage.practise.reduce((a, x) => a + Number(x.minutes), 0)
  const total = readSum + pracSum
  const want = stage.hours * 60
  const match = total === want
  if (!match) ok = false
  console.log(
    `${slug}: hours=${stage.hours} reads=${readSum} practise=${pracSum} total=${total} ${match ? 'OK' : `FAIL (want ${want})`}`,
  )
}

const section2 = data.stages.filter((s) => s.sectionLabel === 'Section 2')
const section2Hours = section2.reduce((a, s) => a + s.hours, 0)
console.log(`Section 2 stage hours sum: ${section2Hours} (expect 16)`)
if (!ok || section2Hours !== 16) process.exit(1)
console.log('Patched stages 3–9 hours')