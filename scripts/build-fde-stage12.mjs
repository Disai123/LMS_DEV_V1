import fs from 'fs'
import path from 'path'
import vm from 'vm'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const htmlPath = path.join(root, 'AI FDE Course_ Stage by Stage (2).html')
const fdeData = path.join(root, 'frontend/src/fde/data')
const stagesPath = path.join(fdeData, 'stages.json')
const contentDir = path.join(fdeData, 'content')

const STAGE_META = [
  { slug: 'software-engineering', weeksLabel: 'Week 1', hours: 5, file: 'stage-01.json' },
  { slug: 'ai-engineering', weeksLabel: 'Weeks 2-6', hours: 25, file: 'stage-02.json' },
]

const html = fs.readFileSync(htmlPath, 'utf8')
const match = html.match(/var S=(\[[\s\S]*?\]);/)
if (!match) throw new Error('Could not find the stage array (var S=...) in the HTML')
const S = vm.runInNewContext(`(${match[1]})`)
if (!S[0]?.r?.[0] || S[0].r[0].length < 7) {
  console.log(
    'HTML uses the merged export format (Stages 1–10 from LMS). Import from HTML is skipped.\n' +
      'Edit frontend/src/fde/data and scripts/fde-content, then run: node scripts/build-fde-full-html.mjs',
  )
  process.exit(0)
}

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const roadmap = JSON.parse(fs.readFileSync(stagesPath, 'utf8'))
fs.mkdirSync(contentDir, { recursive: true })

S.forEach((src, i) => {
  const meta = STAGE_META[i]
  const stage = roadmap.stages.find((s) => s.slug === meta.slug)
  if (!stage) throw new Error(`Stage ${meta.slug} not found in stages.json`)

  const used = new Set()
  const items = src.r.map(([type, title, minutes, dayRef, focus, objectives, checkpoints]) => {
    let slug = slugify(title)
    while (used.has(slug)) slug += '-2'
    used.add(slug)
    return { type: type.toLowerCase(), slug, title, minutes, dayRef, focus, objectives, checkpoints }
  })

  stage.name = src.nm.replace(/^Stage \d+:\s*/, '')
  stage.weeksLabel = meta.weeksLabel
  stage.hours = meta.hours
  stage.cardBlurb = src.d
  stage.description = src.d
  stage.outcomes = src.can
  stage.readyWhen = src.ready
  const toItem = ({ slug, type, title, minutes }) => ({ slug, type, title, minutes })
  stage.reads = items.filter((x) => x.type === 'read').map(toItem)
  stage.practise = items.filter((x) => x.type !== 'read').map(toItem)

  const content = {}
  for (const x of items) {
    content[`${meta.slug}/${x.slug}`] = {
      summary: x.focus,
      sections: [{ heading: 'Focus', body: x.focus }],
      typeExtras: { objectives: x.objectives, checkpointQuestions: x.checkpoints },
    }
  }
  fs.writeFileSync(path.join(contentDir, meta.file), JSON.stringify(content, null, 2) + '\n', 'utf8')
  console.log(`${stage.name}: ${stage.reads.length} reads, ${stage.practise.length} practise -> ${meta.file}`)
})

fs.writeFileSync(stagesPath, JSON.stringify(roadmap, null, 2) + '\n', 'utf8')
console.log('Updated stages.json')
