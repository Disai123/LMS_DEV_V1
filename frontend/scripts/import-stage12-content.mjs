import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const htmlPath = path.resolve(__dirname, '../../AI FDE Course_ Stage by Stage (2).html')
const h = fs.readFileSync(htmlPath, 'utf8')
const mC = h.match(/var C=(\{[\s\S]*?\});[\r\n]*var L=/)
const C = eval('(' + mC[1] + ')')

function htmlToMd(html) {
  if (!html) return ''
  return html
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<p>/gi, '')
    .replace(/<strong>/gi, '**')
    .replace(/<\/strong>/gi, '**')
    .replace(/<code>/gi, '`')
    .replace(/<\/code>/gi, '`')
    .replace(/<ol>/gi, '\n')
    .replace(/<\/ul>/gi, '\n')
    .replace(/<li>/gi, '- ')
    .replace(/<\/li>/gi, '\n')
    .replace(/<pre>/gi, '\n```\n')
    .replace(/<\/pre>/gi, '\n```\n')
    .replace(/<a [^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/gi, '[$2]($1)')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function buildContent(key, stageSlug, itemSlug) {
  const c = C[key]
  if (!c) {
    console.warn('missing', key)
    return null
  }
  const sections = (c.sections || []).map((sec) => ({
    heading: sec.heading === 'Focus' ? 'Overview' : sec.heading,
    body: htmlToMd(sec.html || sec.body || ''),
  }))
  const out = { summary: c.summary, sections, typeExtras: {} }
  // Objectives come from stage12-clear-objectives.json (plain-language), not HTML jargon
  // Stage 1–2: no checkpoint questions
  return { [`${stageSlug}/${itemSlug}`]: out }
}

const stage01 = {}
const s1 = [
  ['s1-0', 'python-essentials-and-environment-setup'],
  ['s1-1', 'data-structures-json-and-pandas'],
  ['s1-2', 'working-with-apis-reliably'],
  ['s1-3', 'typing-pydantic-and-async'],
  ['s1-4', 'fastapi-logging-and-pytest'],
]
for (const [k, slug] of s1) {
  Object.assign(stage01, buildContent(k, 'software-engineering', slug))
}

// Stage 1 intro read + FastAPI labs — authored in JSON (not in HTML C object)
const stage1Authored = {
  'software-engineering/fde-role-sdlc-and-how-this-course-flows': {
    summary:
      'What a Forward Deployed Engineer does, the SDLC stages you will practise, and how Section 1 (foundations), Section 2 (customer delivery), and Section 3 (capstone) fit together.',
    sections: [
      {
        heading: 'Overview',
        body: 'This hour sets context before Python and FastAPI. You are learning how real customer engagements run—not building the Ask IT app yet.',
      },
      {
        heading: 'What an FDE does',
        body: '- Works with the customer on discovery, design, build, validation, deploy, and handover.\n- Turns fuzzy requests into working software with clear acceptance checks.\n- Uses AI tools and engineering discipline together—not only coding in isolation.',
      },
      {
        heading: 'SDLC in this course',
        body: '- **Discover & requirements** — Stages 3–4 (business, UI/UX).\n- **Architecture** — Stage 5.\n- **Build & test** — Stage 6.\n- **Pilot & production** — Stages 7–8.\n- **Operate & handover** — Stage 9.\n- **Capstone** — Stage 10 applies everything on e-commerce projects.',
      },
    ],
    typeExtras: {},
  },
  'software-engineering/lab-fastapi-simple-api': {
    summary: 'Stand up a minimal FastAPI service with /health and one small JSON resource, then verify with curl.',
    sections: [
      {
        heading: 'Overview',
        body: 'You build the smallest useful HTTP API: health check plus one resource. No database required— in-memory is fine for this lab.',
      },
    ],
    typeExtras: {},
  },
  'software-engineering/lab-fastapi-validation-and-testing': {
    summary: 'Add Pydantic validation and pytest tests so bad input returns 422 and core routes stay protected by tests.',
    sections: [
      {
        heading: 'Overview',
        body: 'Extend the API from the previous lab. Invalid bodies should fail clearly; tests should run with TestClient without starting a server manually.',
      },
    ],
    typeExtras: {},
  },
}
Object.assign(stage01, stage1Authored)

const stage02 = {}
const s2reads = [
  'llm-fundamentals',
  'model-landscape-and-selection',
  'prompt-engineering',
  'structured-outputs-and-tool-calling',
  'llm-evaluation-cost-and-safety',
  'rag-foundations-and-ingestion',
  'chunking-embeddings-and-vector-stores',
  'hybrid-search-reranking-and-query-transformation',
  'rag-evaluation-and-production',
  'agent-fundamentals-and-langchain',
  'langgraph-state-memory-and-human-in-the-loop',
  'agentic-rag',
  'guardrails-and-agent-safety',
  'observability-and-agent-evaluation',
  'model-context-protocol-mcp',
  'agent-skills-and-cursor-rules',
]
for (let i = 0; i < 16; i++) {
  Object.assign(stage02, buildContent(`s2-${i}`, 'ai-engineering', s2reads[i]))
}

const labKeys = {
  'lab-compare-two-models': 's2-16',
  'lab-extraction-and-tool-calling': 's2-17',
  'lab-ingest-chunk-and-index': 's2-5',
  'lab-baseline-cited-rag': 's2-18',
  'lab-hybrid-search-reranker': 's2-19',
  'lab-diagnose-rag-failures': 's2-20',
  'lab-langgraph-human-approval': 's2-22',
  'lab-agentic-rag-mini-loop': 's2-11',
  'lab-red-team-guardrails': 's2-24',
  'lab-mcp-server': 's2-25',
}
for (const [slug, ck] of Object.entries(labKeys)) {
  const built = buildContent(ck, 'ai-engineering', slug)
  if (built) Object.assign(stage02, built)
  else {
    stage02[`ai-engineering/${slug}`] = {
      summary: slug.replace(/-/g, ' '),
      sections: [{ heading: 'Overview', body: 'Complete the lab in the panel below.' }],
      typeExtras: {},
    }
  }
}

const clearObjectivesPath = path.resolve(__dirname, 'stage12-clear-objectives.json')
const clearObjectives = JSON.parse(fs.readFileSync(clearObjectivesPath, 'utf8'))
function applyClearObjectives(bag) {
  for (const [key, objectives] of Object.entries(clearObjectives)) {
    if (!bag[key]) continue
    bag[key].typeExtras = bag[key].typeExtras || {}
    bag[key].typeExtras.objectives = objectives
  }
}
applyClearObjectives(stage01)
applyClearObjectives(stage02)

const outDir = path.resolve(__dirname, '../src/fde/data/content')
fs.writeFileSync(path.join(outDir, 'stage-01.json'), JSON.stringify(stage01, null, 2) + '\n')
fs.writeFileSync(path.join(outDir, 'stage-02.json'), JSON.stringify(stage02, null, 2) + '\n')
console.log('Wrote stage-01.json keys', Object.keys(stage01).length)
console.log('Wrote stage-02.json keys', Object.keys(stage02).length)
