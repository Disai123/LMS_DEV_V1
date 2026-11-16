import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const stagesPath = path.resolve(__dirname, '../src/fde/data/stages.json')
const data = JSON.parse(fs.readFileSync(stagesPath, 'utf8'))

const softwareEngineering = {
  slug: 'software-engineering',
  name: 'Software Engineering (Python)',
  icon: 'code',
  color: '#2fd3a0',
  weeksLabel: 'Section 1',
  sectionLabel: 'Section 1',
  hours: 5,
  cardBlurb: '1h FDE and SDLC context, then Python, APIs, and a tested FastAPI service.',
  description: 'Understand how the FDE course flows, then build reliable Python and a small FastAPI API with validation and tests.',
  outcomes: [
    'Explain the FDE role and SDLC stages used in this course',
    'Write Python that handles files, JSON, and API calls safely',
    'Validate request and response data with Pydantic',
    'Ship a minimal tested FastAPI service',
  ],
  readyWhen:
    'You can explain the course flow and stand up a tested FastAPI API with /health and one resource in a day.',
  reads: [
    {
      slug: 'fde-role-sdlc-and-how-this-course-flows',
      type: 'read',
      title: 'FDE role, SDLC lifecycle, and how this course is structured',
      minutes: 60,
    },
    { slug: 'python-essentials-and-environment-setup', type: 'read', title: 'Python essentials and environment setup', minutes: 30 },
    { slug: 'data-structures-json-and-pandas', type: 'read', title: 'Data structures, JSON and pandas', minutes: 30 },
    { slug: 'working-with-apis-reliably', type: 'read', title: 'Working with APIs reliably', minutes: 30 },
    { slug: 'typing-pydantic-and-async', type: 'read', title: 'Typing, Pydantic and async', minutes: 30 },
    { slug: 'fastapi-logging-and-pytest', type: 'read', title: 'FastAPI, logging and pytest', minutes: 30 },
  ],
  practise: [
    { slug: 'lab-fastapi-simple-api', type: 'lab', title: 'Lab: Create a simple FastAPI API', minutes: 45 },
    { slug: 'lab-fastapi-validation-and-testing', type: 'lab', title: 'Lab: FastAPI validation and testing', minutes: 45 },
  ],
}

const aiEngineering = {
  slug: 'ai-engineering',
  name: 'AI Engineering',
  icon: 'brain',
  color: '#3aa6ff',
  weeksLabel: 'Section 1',
  sectionLabel: 'Section 1',
  hours: 11,
  cardBlurb: 'LLMs, RAG, agents, guardrails, and MCP — concept labs only.',
  description: 'Work with LLMs, RAG, agents and MCP to build and ship intelligent solutions.',
  outcomes: [
    'Prompt and call LLM APIs with structured output and tools',
    'Build RAG with citations, hybrid search and reranking',
    'Evaluate RAG and agents with measurable metrics',
    'Build agents with LangGraph, guardrails and human approval',
    'Expose tools through MCP and package reusable skills',
  ],
  readyWhen: 'You can build a cited, guarded, agent-driven Q&A prototype over documents in a week.',
  reads: [
    { slug: 'llm-fundamentals', type: 'read', title: 'LLM fundamentals', minutes: 20 },
    { slug: 'model-landscape-and-selection', type: 'read', title: 'Model landscape and selection', minutes: 20 },
    { slug: 'prompt-engineering', type: 'read', title: 'Prompt engineering', minutes: 20 },
    { slug: 'structured-outputs-and-tool-calling', type: 'read', title: 'Structured outputs and tool calling', minutes: 20 },
    { slug: 'llm-evaluation-cost-and-safety', type: 'read', title: 'LLM evaluation, cost and safety', minutes: 20 },
    { slug: 'rag-foundations-and-ingestion', type: 'read', title: 'RAG foundations and ingestion', minutes: 20 },
    { slug: 'chunking-embeddings-and-vector-stores', type: 'read', title: 'Chunking, embeddings and vector stores', minutes: 20 },
    { slug: 'hybrid-search-reranking-and-query-transformation', type: 'read', title: 'Hybrid search, reranking and query transformation', minutes: 20 },
    { slug: 'rag-evaluation-and-production', type: 'read', title: 'RAG evaluation and production', minutes: 20 },
    { slug: 'agent-fundamentals-and-langchain', type: 'read', title: 'Agent fundamentals and LangChain', minutes: 20 },
    { slug: 'langgraph-state-memory-and-human-in-the-loop', type: 'read', title: 'LangGraph: state, memory and human-in-the-loop', minutes: 20 },
    { slug: 'agentic-rag', type: 'read', title: 'Agentic RAG', minutes: 20 },
    { slug: 'guardrails-and-agent-safety', type: 'read', title: 'Guardrails and agent safety', minutes: 20 },
    { slug: 'observability-and-agent-evaluation', type: 'read', title: 'Observability and agent evaluation', minutes: 20 },
    { slug: 'model-context-protocol-mcp', type: 'read', title: 'Model Context Protocol (MCP)', minutes: 20 },
    { slug: 'agent-skills-and-cursor-rules', type: 'read', title: 'Agent skills and Cursor rules', minutes: 20 },
  ],
  practise: [
    { slug: 'lab-compare-two-models', type: 'lab', title: 'Lab: Compare two models with an eval harness', minutes: 25 },
    { slug: 'lab-extraction-and-tool-calling', type: 'lab', title: 'Lab: Extraction pipeline and tool-calling assistant', minutes: 25 },
    { slug: 'lab-ingest-chunk-and-index', type: 'lab', title: 'Lab: Ingest, chunk, and index a policy corpus', minutes: 28 },
    { slug: 'lab-baseline-cited-rag', type: 'lab', title: 'Lab: Baseline cited RAG Q&A', minutes: 28 },
    { slug: 'lab-hybrid-search-reranker', type: 'lab', title: 'Lab: Add hybrid search and a reranker', minutes: 28 },
    { slug: 'lab-diagnose-rag-failures', type: 'lab', title: 'Lab: Diagnose and fix planted RAG failures', minutes: 30 },
    { slug: 'lab-langgraph-human-approval', type: 'lab', title: 'Lab: LangGraph agent with human approval', minutes: 30 },
    { slug: 'lab-agentic-rag-mini-loop', type: 'lab', title: 'Lab: Agentic RAG mini-loop', minutes: 28 },
    { slug: 'lab-red-team-guardrails', type: 'lab', title: 'Lab: Red-team your agent and add guardrails', minutes: 28 },
    { slug: 'lab-mcp-server', type: 'lab', title: 'Lab: Build an MCP server and connect it to your agent', minutes: 30 },
    {
      slug: 'assignment-integrated-policy-assistant',
      type: 'assignment',
      title: 'Assignment: Integrated policy assistant (Stage 2 capstone)',
      minutes: 60,
    },
  ],
}

const i0 = data.stages.findIndex((s) => s.slug === 'software-engineering')
const i1 = data.stages.findIndex((s) => s.slug === 'ai-engineering')
data.stages[i0] = softwareEngineering
data.stages[i1] = aiEngineering

data.hero.subtitle =
  'Section 1: core Python and AI labs. From Stage 3: customer story with Todo tutor labs and Ask IT assignments.'
data.phases = data.phases.map((p) =>
  p.label === 'Section 1 · 16 h'
    ? { ...p, detail: 'Stages 1–2: Python and AI engineering foundations (5h + 11h)' }
    : p
)
data.faq = data.faq.map((f) => {
  if (f.question === 'How are the 48 hours split?') {
    return {
      ...f,
      answer:
        'Section 1 is 16 hours (5h Python and FastAPI + 11h AI engineering). Section 2 is 16 hours covering Stages 3 through 9 across the full customer engagement lifecycle. Section 3 is 16 hours dedicated to four 4-hour hands-on capstone projects.',
    }
  }
  return f
})
data.faq = data.faq.map((f) =>
  f.question === 'Why Todo in labs and Ask IT in assignments?'
    ? {
        ...f,
        answer:
          'Stages 1–2 are concept labs only (no customer storyline). From Stage 3 onward, tutored labs use the Todo app and assignments use the Ask IT retail scenario.',
      }
    : f
)

fs.writeFileSync(stagesPath, JSON.stringify(data, null, 2) + '\n')
console.log('Patched stages 1–2')
