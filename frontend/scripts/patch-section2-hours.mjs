import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const stagesPath = path.join(root, 'src/fde/data/stages.json')

const STAGE_HOURS = {
  'fde-sdlc-business-requirement': 1,
  'fde-sdlc-ui-ux-solution': 1,
  'fde-sdlc-architecture-solution': 1.5,
  'development-backend': 4,
  'development-frontend': 3,
  deployment: 3,
  'enterprise-ai-fde': 1.5,
}

function distributeMinutes(stage, targetMinutes) {
  const reads = stage.reads || []
  const practise = stage.practise || []
  const items = [...reads, ...practise]
  if (!items.length) return

  const weights = items.map((i) => Math.max(1, Number(i.minutes) || 1))
  const sumW = weights.reduce((a, b) => a + b, 0)

  let allocated = 0
  for (let i = 0; i < items.length; i++) {
    if (i === items.length - 1) {
      items[i].minutes = targetMinutes - allocated
    } else {
      const m = Math.max(1, Math.round((weights[i] / sumW) * targetMinutes))
      items[i].minutes = m
      allocated += m
    }
  }
}

const data = JSON.parse(fs.readFileSync(stagesPath, 'utf8'))

data.phases = data.phases.map((p) =>
  p.label.startsWith('Section 2')
    ? {
        ...p,
        detail:
          'Stages 3–9: BRD (1h), UI/UX (1h), architecture (1.5h), backend (4h), frontend (3h), deployment (3h), Langfuse/evals/obs/guardrails (1.5h)',
      }
    : p
)

const faqSplit = data.faq.find((f) => f.question === 'How are the 40 hours split?')
if (faqSplit) {
  faqSplit.answer =
    'Section 1 is 15 hours (Stage 1: 3h — FDE Intro, Python/FastAPI reads, Git and cloud last; Stage 2: 12h AI — LLM, RAG, agents, MCP and guardrails). Section 2 is 15 hours: BRD 1h, UI/UX 1h, architecture 1.5h, development backend 4h, development frontend 3h, deployment 3h, Langfuse/evals/observability/guardrails and handover 1.5h. Section 3 is 10 hours — one e-commerce Fullstack Agentic RAG capstone in four modules.'
}

const devIdx = data.stages.findIndex((s) => s.slug === 'development')
const mvpIdx = data.stages.findIndex((s) => s.slug === 'mvp-poc-local-render')
const prodIdx = data.stages.findIndex((s) => s.slug === 'production-deployment')

if (devIdx < 0) throw new Error('development stage missing')

const dev = data.stages[devIdx]
const devReads = Object.fromEntries(dev.reads.map((r) => [r.slug, r]))
const devPractise = Object.fromEntries(dev.practise.map((p) => [p.slug, p]))

const backendReadSlugs = [
  'recap-and-development-plan',
  'backend-module',
  'database-and-faq-data',
  'review-and-assignment-brief-session-4',
]
const frontendReadSlugs = [
  'frontend-module',
  'recap-and-development-status',
  'rag-integration',
  'no-answer-and-permission-behaviour',
  'regression-test-design',
  'review-and-assignment-brief-session-5',
]

const developmentBackend = {
  ...dev,
  slug: 'development-backend',
  name: 'Development: Backend',
  hours: 4,
  cardBlurb:
    'Todo lab: FastAPI backend with tutor. Assignment: Customer support ticketing system startup and tests on your own.',
  description:
    'Tutored Todo lab for FastAPI, data, and tests. Assignment: Customer support ticketing system backend run and test plan independently.',
  outcomes: [
    'Build the Todo API with your tutor',
    'Complete Customer support ticketing system backend startup and tests solo',
    'Document staff vs admin server checks before pilot',
  ],
  readyWhen:
    'Todo backend lab passes checkpoints; Customer support ticketing system assignment shows local API run and test notes.',
  reads: backendReadSlugs.map((s) => devReads[s]).filter(Boolean),
  practise: [devPractise['lab-4-application-skeleton'], devPractise['startup-instructions-and-tests']].filter(Boolean),
}

const developmentFrontend = {
  ...dev,
  slug: 'development-frontend',
  name: 'Development: Frontend',
  hours: 3,
  cardBlurb:
    'Todo lab: React UI with tutor. Assignment: connect RAG, fix tests, and validate Customer support ticketing system UI solo.',
  description:
    'Tutored Todo lab for React UI. Assignment: Customer support ticketing system frontend, RAG hooks, and fix loops on your own.',
  outcomes: [
    'Build the Todo UI in lab with your tutor',
    'Complete Customer support ticketing system UI and regression checks independently',
    'Use prompt → checkpoint → fix when builds fail',
  ],
  readyWhen:
    'Todo UI lab passes checkpoints; Customer support ticketing system assignment shows UI wired and regression notes.',
  reads: frontendReadSlugs.map((s) => devReads[s]).filter(Boolean),
  practise: [devPractise['lab-5-connect-rag-and-test'], devPractise['fix-a-failed-test-and-rerun']].filter(Boolean),
}

let deployment = null
if (mvpIdx >= 0 && prodIdx >= 0) {
  const mvp = data.stages[mvpIdx]
  const prod = data.stages[prodIdx]
  deployment = {
    slug: 'deployment',
    name: 'Deployment',
    icon: 'cloud-upload',
    color: '#7a8cff',
    weeksLabel: 'Section 2',
    sectionLabel: 'Section 2',
    hours: 3,
    cardBlurb:
      'Todo labs: local, Docker, Render POC, and production. Customer support ticketing system assignments: pilot and rollout checklists.',
    description:
      'Local run through Docker, Render POC, and production hardening—secrets, runbooks, and operations.',
    outcomes: [
      'Distinguish development, MVP/POC, and production environments',
      'Deploy Customer support ticketing system to Render or AWS with secrets outside Git',
      'Run pilot regression and author runbook for common failures',
    ],
    readyWhen:
      'POC and production URLs work, pilots are scored, secrets are in env config, and runbook is peer-tested.',
    reads: [...mvp.reads, ...prod.reads],
    practise: [...mvp.practise, ...prod.practise],
  }
}

const enterprise = data.stages.find((s) => s.slug === 'enterprise-ai-fde')
if (enterprise) {
  enterprise.name = 'Langfuse, evals, observability and guardrails'
  enterprise.cardBlurb =
    'Todo lab: Langfuse traces and eval snapshot. Customer support ticketing system assignment: security, guardrails evidence, and sponsor readout.'
  enterprise.description =
    'Langfuse observability, regression evals, guardrails evidence, IT security questionnaire, and sponsor handover.'
}

const before = data.stages.slice(0, devIdx)
const afterEnterprise =
  enterprise != null ? data.stages.slice(data.stages.findIndex((s) => s.slug === 'enterprise-ai-fde')) : []
const capstone = data.stages.find((s) => s.slug === 'capstone-fde')

data.stages = [
  ...before,
  developmentBackend,
  developmentFrontend,
  ...(deployment ? [deployment] : []),
  ...afterEnterprise.filter((s) => s.slug !== 'capstone-fde'),
  ...(capstone ? [capstone] : []),
]

for (const stage of data.stages) {
  const h = STAGE_HOURS[stage.slug]
  if (h == null) continue
  stage.hours = h
  distributeMinutes(stage, h * 60)
}

fs.writeFileSync(stagesPath, JSON.stringify(data, null, 2) + '\n')

let ok = true
let totalH = 0
for (const stage of data.stages) {
  totalH += stage.hours
  const readSum = (stage.reads || []).reduce((a, x) => a + Number(x.minutes), 0)
  const pracSum = (stage.practise || []).reduce((a, x) => a + Number(x.minutes), 0)
  const total = readSum + pracSum
  const want = stage.hours * 60
  if (total !== want) ok = false
  console.log(`${stage.slug}: hours=${stage.hours} items=${total}min want=${want} ${total === want ? 'OK' : 'MISMATCH'}`)
}
console.log(`Total: ${totalH}h ${totalH === 40 ? 'OK' : 'MISMATCH'}`)
process.exit(ok && totalH === 40 ? 0 : 1)