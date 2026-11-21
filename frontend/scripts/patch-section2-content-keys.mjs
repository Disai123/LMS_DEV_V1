import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const contentDir = path.join(__dirname, '../src/fde/data/content')

const BACKEND_KEYS = [
  'recap-and-development-plan',
  'backend-module',
  'database-and-faq-data',
  'review-and-assignment-brief-session-4',
  'startup-instructions-and-tests',
  'lab-4-application-skeleton',
]
const FRONTEND_KEYS = [
  'frontend-module',
  'recap-and-development-status',
  'rag-integration',
  'no-answer-and-permission-behaviour',
  'regression-test-design',
  'review-and-assignment-brief-session-5',
  'lab-5-connect-rag-and-test',
  'fix-a-failed-test-and-rerun',
]

const stage06Path = path.join(contentDir, 'stage-06.json')
const stage06 = JSON.parse(fs.readFileSync(stage06Path, 'utf8'))
const out06 = {}
for (const [key, val] of Object.entries(stage06)) {
  const itemSlug = key.replace(/^development\//, '')
  if (BACKEND_KEYS.includes(itemSlug)) {
    out06[`development-backend/${itemSlug}`] = val
  } else if (FRONTEND_KEYS.includes(itemSlug)) {
    out06[`development-frontend/${itemSlug}`] = val
  }
}
fs.writeFileSync(stage06Path, JSON.stringify(out06, null, 2) + '\n')

const stage07 = JSON.parse(fs.readFileSync(path.join(contentDir, 'stage-07.json'), 'utf8'))
const stage08 = JSON.parse(fs.readFileSync(path.join(contentDir, 'stage-08.json'), 'utf8'))
const deployment = {}
for (const [key, val] of Object.entries({ ...stage07, ...stage08 })) {
  const itemSlug = key.split('/').slice(1).join('/')
  deployment[`deployment/${itemSlug}`] = val
}
fs.writeFileSync(path.join(contentDir, 'stage-07.json'), JSON.stringify(deployment, null, 2) + '\n')
fs.writeFileSync(path.join(contentDir, 'stage-08.json'), '{}\n')

function patchJsFile(filePath, replacements) {
  let text = fs.readFileSync(filePath, 'utf8')
  for (const [from, to] of replacements) {
    text = text.split(from).join(to)
  }
  fs.writeFileSync(filePath, text)
}

const labsDir = path.join(__dirname, '../src/fde/exercises/labs')
patchJsFile(path.join(labsDir, 'stageDevDeploy.js'), [
  ['development/lab-4-application-skeleton', 'development-backend/lab-4-application-skeleton'],
  ['development/lab-5-connect-rag-and-test', 'development-frontend/lab-5-connect-rag-and-test'],
  ['mvp-poc-local-render/lab-6-poc-hardening', 'deployment/lab-6-poc-hardening'],
  ['production-deployment/lab-7a-production-deployment', 'deployment/lab-7a-production-deployment'],
])
patchJsFile(path.join(labsDir, 'assignments.js'), [
  ['development/startup-instructions-and-tests', 'development-backend/startup-instructions-and-tests'],
  ['development/fix-a-failed-test-and-rerun', 'development-frontend/fix-a-failed-test-and-rerun'],
  ['mvp-poc-local-render/staging-checklist-and-pilot-plan', 'deployment/staging-checklist-and-pilot-plan'],
  ['production-deployment/runbook-and-pre-rollout-checklist', 'deployment/runbook-and-pre-rollout-checklist'],
])

console.log('Content keys and lab paths updated.')