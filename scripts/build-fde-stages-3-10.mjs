import fs from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import { lessonSections } from './fde-content/lesson.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const fdeData = path.join(root, 'frontend/src/fde/data')
const stagesPath = path.join(fdeData, 'stages.json')
const contentDir = path.join(fdeData, 'content')
const sourceDir = path.join(__dirname, 'fde-content')

const roadmap = JSON.parse(fs.readFileSync(stagesPath, 'utf8'))
fs.mkdirSync(contentDir, { recursive: true })

const files = fs
  .readdirSync(sourceDir)
  .filter((f) => /^stage-\d{2}\.mjs$/.test(f))
  .sort()

for (const file of files) {
  const { default: src } = await import(pathToFileURL(path.join(sourceDir, file)).href)
  const stage = roadmap.stages.find((s) => s.slug === src.stage.slug)
  if (!stage) throw new Error(`Stage ${src.stage.slug} not found in stages.json`)

  Object.assign(stage, src.stage)

  const toItem = ({ slug, type, title, minutes }) => ({ slug, type, title, minutes })
  stage.reads = src.items.filter((x) => x.type === 'read').map(toItem)
  stage.practise = src.items.filter((x) => x.type !== 'read').map(toItem)

  const content = {}
  let minutes = 0
  for (const item of src.items) {
    minutes += item.minutes
    content[`${stage.slug}/${item.slug}`] = {
      summary: item.summary,
      sections: lessonSections(item.lesson),
      typeExtras: {
        objectives: item.objectives,
        checkpointQuestions: item.checkpoints,
        ...(item.extras || {}),
      },
    }
  }

  const outName = file.replace('.mjs', '.json')
  fs.writeFileSync(path.join(contentDir, outName), JSON.stringify(content, null, 2) + '\n', 'utf8')
  const warn = minutes !== stage.hours * 60 ? `  (WARNING: ${minutes} min vs ${stage.hours * 60} expected)` : ''
  console.log(`${stage.name}: ${src.items.length} items, ${minutes} min -> ${outName}${warn}`)
}

fs.writeFileSync(stagesPath, JSON.stringify(roadmap, null, 2) + '\n', 'utf8')
console.log('Updated stages.json')
