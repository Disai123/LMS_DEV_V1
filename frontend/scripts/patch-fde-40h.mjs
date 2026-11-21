import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const stagesPath = path.resolve(__dirname, '../src/fde/data/stages.json')
const data = JSON.parse(fs.readFileSync(stagesPath, 'utf8'))

const STAGE_HOURS = {
  'software-engineering': 3,
  'ai-engineering': 12,
  'fde-sdlc-business-requirement': 1,
  'fde-sdlc-ui-ux-solution': 1,
  'fde-sdlc-architecture-solution': 1.5,
  'development-backend': 4,
  'development-frontend': 3,
  deployment: 3,
  'enterprise-ai-fde': 1.5,
  'capstone-fde': 10,
}

const NEW_STAGE1_READS = [
  {
    slug: 'antigravity-for-fde',
    type: 'read',
    title: 'Antigravity for FDE',
    minutes: 45,
  },
  {
    slug: 'python-basics-for-ai-fde',
    type: 'read',
    title: 'Python basics for AI FDE',
    minutes: 45,
  },
  {
    slug: 'sql-api-fastapi-and-data-integration',
    type: 'read',
    title: 'SQL, API (FastAPI) and data integration',
    minutes: 45,
  },
  {
    slug: 'git-docker-and-cloud',
    type: 'read',
    title: 'Git, Docker and cloud',
    minutes: 45,
  },
]

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

// --- Hero & global copy ---
data.hero.title = 'Forward Deployed Engineer Roadmap (40h)'
data.chips = data.chips.map((c) => (c === '48 hours' ? '40 hours' : c))
data.phases = [
  {
    label: 'Section 1 · 15 h',
    detail: 'Stages 1–2: Software engineering (3h) and AI engineering (12h)',
  },
  {
    label: 'Section 2 · 15 h',
    detail:
      'Stages 3–9: BRD (1h), UI/UX (1h), architecture (1.5h), backend (4h), frontend (3h), deployment (3h), Langfuse/evals/obs/guardrails (1.5h)',
  },
  {
    label: 'Section 3 · 10 h',
    detail:
      'Stage 10: Four capstone projects (2.5h each) — Full-Stack, Multi-Agent, Agentic RAG, Integration',
  },
]

data.capstone.title = 'Section 3: Capstone Projects (10h)'
data.capstone.intro =
  'Four hands-on capstone projects (2.5 hours each): E-commerce Full-Stack Application, Single Agent and Multi-Agent Orchestration, Agentic RAG with FAISS, and one Integrated Application combining all three.'

data.faq = data.faq.map((f) => {
  if (f.question === 'How long does this roadmap take?') {
    return {
      ...f,
      answer:
        '40 hours total: Section 1 (Foundations, 15h — 3h software engineering + 12h AI engineering), Section 2 (FDE SDLC, 15h), and Section 3 (Capstone projects, 10h). Move on when you meet each stage’s "ready to move on" checkpoint.',
    }
  }
  if (f.question === 'How are the 48 hours split?') {
    return {
      question: 'How are the 40 hours split?',
      answer:
        'Section 1 is 15 hours (Stage 1: 3h Session 1 — Antigravity, Python, SQL/FastAPI, Git/Docker/Cloud; Stage 2: 12h AI — LLM, RAG, agents, MCP and guardrails). Section 2 is 15 hours: BRD, UI/UX and architecture 1.5h each; development 6h (backend and frontend); MVP/POC and production deployment 3h combined; enterprise observability and handover 1.5h. Section 3 is 10 hours — four 2.5-hour capstone projects.',
    }
  }
  if (f.question === 'What are the Capstone Projects in Section 3?') {
    return {
      ...f,
      answer:
        'Four 2.5-hour projects: 1) E-commerce Full-Stack Application (React + FastAPI + PostgreSQL), 2) Single Agent and Multi-Agent (LangGraph orchestration and specialists), 3) Agentic RAG (FAISS retrieval and cited answers), and 4) Integrated Application (unified commerce platform combining multi-agent and RAG).',
    }
  }
  return f
})

// --- Stage 1: prepend session reads ---
const se = data.stages.find((s) => s.slug === 'software-engineering')
if (se) {
  const existingSlugs = new Set(se.reads.map((r) => r.slug))
  const toPrepend = NEW_STAGE1_READS.filter((r) => !existingSlugs.has(r.slug))
  se.reads = [...toPrepend, ...se.reads]
  se.hours = 3
  se.cardBlurb =
    'Session 1 (3h): Antigravity for FDE, Python basics, SQL/FastAPI, Git/Docker/Cloud — then hands-on labs.'
  distributeMinutes(se, 3 * 60)
}

// --- Other stages ---
for (const stage of data.stages) {
  const h = STAGE_HOURS[stage.slug]
  if (h == null) continue
  if (stage.slug === 'software-engineering') continue
  stage.hours = h
  if (stage.slug === 'capstone-fde') {
    const items = [...stage.reads, ...stage.practise]
    const target = h * 60
    let allocated = 0
    for (let i = 0; i < items.length; i++) {
      if (i === items.length - 1) items[i].minutes = target - allocated
      else {
        items[i].minutes = 38
        allocated += 38
      }
    }
    if (items.length) items[items.length - 1].minutes = target - (items.length - 1) * 38
  } else {
    distributeMinutes(stage, h * 60)
  }
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
  const match = total === want
  if (!match) ok = false
  console.log(`${stage.slug}: hours=${stage.hours} items=${total}min want=${want} ${match ? 'OK' : 'MISMATCH'}`)
}
console.log(`Total roadmap hours: ${totalH} (want 40) ${totalH === 40 ? 'OK' : 'MISMATCH'}`)
process.exit(ok && totalH === 40 ? 0 : 1)