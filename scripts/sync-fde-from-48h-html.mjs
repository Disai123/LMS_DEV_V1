/**
 * Sync FDE Roadmap from AI_FDE_Course__Stage_by_Stage__48h.html
 * Generates:
 *   - frontend/src/fde/data/stages.json
 *   - frontend/src/fde/data/content/stage-01.json ... stage-10.json
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const htmlPath = path.join(root, 'AI_FDE_Course__Stage_by_Stage__48h.html')
const fdeData = path.join(root, 'frontend/src/fde/data')
const stagesPath = path.join(fdeData, 'stages.json')
const contentDir = path.join(fdeData, 'content')

if (!fs.existsSync(htmlPath)) {
  console.error(`Source HTML not found: ${htmlPath}`)
  process.exit(1)
}

const html = fs.readFileSync(htmlPath, 'utf8')
const sMatch = html.match(/var S=(\[.*?\]);/s)
const cMatch = html.match(/var C=(\{.*?\});/s)

if (!sMatch || !cMatch) {
  console.error('Failed to locate S or C in HTML')
  process.exit(1)
}

const S = JSON.parse(sMatch[1])
const C = JSON.parse(cMatch[1])

const STAGE_CONFIG = [
  { slug: 'software-engineering', icon: 'code', section: 'Section 1', hours: 3, file: 'stage-01.json' },
  { slug: 'ai-engineering', icon: 'brain', section: 'Section 1', hours: 13, file: 'stage-02.json' },
  { slug: 'fde-sdlc-business-requirement', icon: 'clipboard-list', section: 'Section 2', hours: 2, file: 'stage-03.json' },
  { slug: 'fde-sdlc-ui-ux-solution', icon: 'monitor', section: 'Section 2', hours: 2, file: 'stage-04.json' },
  { slug: 'fde-sdlc-architecture-solution', icon: 'layers', section: 'Section 2', hours: 2, file: 'stage-05.json' },
  { slug: 'development', icon: 'code', section: 'Section 2', hours: 4, file: 'stage-06.json' },
  { slug: 'mvp-poc-local-render', icon: 'lightbulb', section: 'Section 2', hours: 2, file: 'stage-07.json' },
  { slug: 'production-deployment', icon: 'cloud-upload', section: 'Section 2', hours: 2, file: 'stage-08.json' },
  { slug: 'enterprise-ai-fde', icon: 'building', section: 'Section 2', hours: 2, file: 'stage-09.json' },
  { slug: 'capstone-fde', icon: 'trophy', section: 'Section 3', hours: 16, file: 'stage-10.json' },
]

function slugify(title) {
  return String(title)
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function decodeHtml(str) {
  return String(str)
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

function htmlToMarkdown(html = '') {
  if (!html) return ''
  let md = html

  // Replace li inside ul with markdown bullets
  md = md.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (match, inner) => {
    const items = []
    inner.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, li) => {
      items.push(`- ${li.trim()}`)
    })
    return items.join('\n') + '\n\n'
  })

  // Replace li inside ol with numbered list
  md = md.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (match, inner) => {
    const items = []
    let num = 1
    inner.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, li) => {
      items.push(`${num++}. ${li.trim()}`)
    })
    return items.join('\n') + '\n\n'
  })

  // Paragraphs
  md = md.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '$1\n\n')

  // Inline formatting
  md = md.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, '`$1`')
  md = md.replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, '**$1**')
  md = md.replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, '**$1**')
  md = md.replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, '*$1*')
  md = md.replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, '*$1*')
  md = md.replace(/<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)')
  md = md.replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, '```\n$1\n```\n\n')
  md = md.replace(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi, '### $1\n\n')

  // Clean any stray tags
  md = md.replace(/<\/?[^>]+(>|$)/g, '')
  md = decodeHtml(md).trim()
  return md
}

const existingRoadmap = JSON.parse(fs.readFileSync(stagesPath, 'utf8'))

const updatedStages = S.map((s, si) => {
  const conf = STAGE_CONFIG[si]
  const cleanName = s.nm.replace(/^Stage \d+:\s*/, '')
  const usedSlugs = new Set()

  const rawItems = s.r.map(([type, title, minutes], ii) => {
    let slug = slugify(title)
    if (usedSlugs.has(slug)) {
      let counter = 2
      while (usedSlugs.has(`${slug}-${counter}`)) counter++
      slug = `${slug}-${counter}`
    }
    usedSlugs.add(slug)

    const rawType = type.toLowerCase()
    const itemKey = `s${si + 1}-${ii}`
    const rawContent = C[itemKey] || {}

    return {
      type: rawType,
      slug,
      title,
      minutes,
      rawContent,
      itemKey,
    }
  })

  const reads = rawItems
    .filter((x) => x.type === 'read')
    .map(({ slug, type, title, minutes }) => ({ slug, type, title, minutes }))

  const practise = rawItems
    .filter((x) => x.type !== 'read')
    .map(({ slug, type, title, minutes }) => ({ slug, type, title, minutes }))

  // Build stage content dictionary
  const stageContent = {}
  for (const item of rawItems) {
    const sections = (item.rawContent.sections || []).map((sec) => ({
      heading: sec.heading,
      body: htmlToMarkdown(sec.html),
    }))

    // If no sections were present, provide an Overview
    if (sections.length === 0) {
      sections.push({
        heading: 'Overview',
        body: item.rawContent.summary || item.title,
      })
    }

    const typeExtras = {}
    if (item.rawContent.objectives?.length) {
      typeExtras.objectives = item.rawContent.objectives
    }
    if (item.rawContent.checkpointQuestions?.length) {
      typeExtras.checkpointQuestions = item.rawContent.checkpointQuestions
    }

    stageContent[`${conf.slug}/${item.slug}`] = {
      summary: item.rawContent.summary || item.title,
      sections,
      typeExtras,
    }
  }

  // Write stage content file
  fs.writeFileSync(
    path.join(contentDir, conf.file),
    JSON.stringify(stageContent, null, 2) + '\n',
    'utf8'
  )
  console.log(`Saved ${conf.file}: ${rawItems.length} items (${reads.length} reads, ${practise.length} practise)`)

  return {
    slug: conf.slug,
    name: cleanName,
    icon: conf.icon,
    color: s.col,
    weeksLabel: `${conf.section}`,
    sectionLabel: conf.section,
    hours: conf.hours,
    cardBlurb: s.d,
    description: s.d,
    outcomes: s.can,
    readyWhen: s.ready,
    reads,
    practise,
  }
})

// Build updated master stages.json
const updatedRoadmap = {
  hero: {
    eyebrow: 'Level 4 · Forward Deployed Engineering',
    title: 'Forward Deployed Engineer Roadmap (48h)',
    subtitle:
      'Work at the intersection of customer, product, engineering and AI. 10 stages across 3 sections — 48 hours total.',
  },
  chips: [
    '3 Sections',
    '10 Stages',
    '48 hours',
    'Hands-on Labs & Capstones',
  ],
  phases: [
    {
      label: 'Section 1 · 16 h',
      detail: 'Stages 1–2: Python and AI engineering foundations (3h + 13h)',
    },
    {
      label: 'Section 2 · 16 h',
      detail: 'Stages 3–9: FDE SDLC — Requirements to Production & Handover (7 stages)',
    },
    {
      label: 'Section 3 · 16 h',
      detail: 'Stage 10: Four 4-Hour Capstone Projects (Full-Stack, Multi-Agent, Agentic RAG, Integration)',
    },
  ],
  capabilities: [
    'Write reliable Python that calls APIs, validates data with Pydantic and ships as a tested FastAPI service',
    'Prompt, evaluate, and connect LLMs with structured output, tools, RAG, and LangGraph agents',
    'Run structured customer discovery and author a crisp one-page business requirements document (BRD)',
    'Define user flows, wireframes, reference architecture, role-based access, and latency/cost trade-offs',
    'Develop, test, and harden customer solutions locally with a 20-question regression set',
    'Deploy to Render or AWS with secrets in env, Langfuse traces/evals, and incident runbooks',
    'Complete IT security questionnaires, run sponsor readouts, and deliver production handover packages',
    'Deliver 4 hands-on capstone projects: E-commerce full-stack, multi-agent orchestration, agentic RAG, and unified integration',
  ],
  faq: [
    {
      question: 'How long does this roadmap take?',
      answer:
        '48 hours total, divided into three 16-hour sections: Section 1 (Foundations, 16h), Section 2 (FDE SDLC, 16h), and Section 3 (Capstone Projects, 16h). Move on when you meet each stage’s "ready to move on" checkpoint.',
    },
    {
      question: 'What does the roadmap cover?',
      answer:
        'Ten stages: Software Engineering (Python), AI Engineering (LLMs, RAG, LangGraph agents, MCP), FDE SDLC (business requirements, UI/UX, architecture), Development, MVP/POC (local and Render validation), Production deployment, Enterprise AI FDE, and Capstone Project. Stages 3–9 apply the retail Ask IT case; Stage 10 delivers four 4-hour capstone projects.',
    },
    {
      question: 'What will I be able to do after?',
      answer:
        'Stand up tested APIs and RAG prototypes, run customer discovery, produce BRDs and architecture diagrams, develop and test solutions, deploy to Render or AWS, configure Langfuse observability, pass enterprise security reviews, and build multi-agent applications.',
    },
    {
      question: 'How are the 48 hours split?',
      answer:
        'Section 1 is 16 hours (3h Python + 13h AI engineering). Section 2 is 16 hours covering Stages 3 through 9 across the full customer engagement lifecycle. Section 3 is 16 hours dedicated to four 4-hour hands-on capstone projects.',
    },
    {
      question: 'What are the Capstone Projects in Section 3?',
      answer:
        'Four 4-hour projects: 1) E-commerce Full-Stack Application (React + FastAPI + PostgreSQL), 2) Single Agent & Multi-Agent (LangGraph orchestration & specialists), 3) Agentic RAG (FAISS retrieval & cited answers), and 4) Integrated Application (unified commerce platform combining multi-agent and RAG).',
    },
    {
      question: 'Is progress saved? Do I need an account?',
      answer:
        'Progress is saved in your browser (localStorage). No login or backend is required for the FDE roadmap.',
    },
  ],
  capstone: {
    title: 'Section 3: Capstone Projects (16h)',
    intro:
      'Four hands-on capstone projects (4 hours each): E-commerce Full-Stack Application, Single Agent + Multi-Agent Orchestration, Agentic RAG with FAISS, and one Integrated Application combining all three.',
    deliverables: [
      'Project 1: E-commerce Full-Stack Application (ReactJS frontend, FastAPI backend, PostgreSQL database, customer journey)',
      'Project 2: E-commerce Single Agent + Multi-Agent (LangGraph orchestrator, Product Search Agent, Cart Agent, Order Agent)',
      'Project 3: E-commerce Agentic RAG (Product document prep, embeddings, FAISS vector index, grounded cited answers)',
      'Project 4: Integrated E-Commerce Application (Single app combining full-stack commerce, multi-agent store actions, and RAG product manual assistance)',
    ],
    strongWork: [
      {
        title: 'Full-stack commerce verified first',
        body: 'Browse, cart, checkout, and order persistence in PostgreSQL are tested before AI layers are added.',
      },
      {
        title: 'Clear agent responsibilities',
        body: 'LangGraph orchestrator routes to specialist agents with scoped database tool permissions and clear boundaries.',
      },
      {
        title: 'Grounded RAG retrieval',
        body: 'FAISS retrieval over approved manuals provides citations and explicit "I don’t know" refusal behavior without cart mutations.',
      },
      {
        title: 'Single unified interface',
        body: 'One React client and FastAPI service cleanly separating store actions and product manual assistance modes.',
      },
    ],
    startStageSlug: 'capstone-fde',
    startItemSlug: updatedStages[9].reads[0]?.slug || 'project-1-hour-1-requirements-structure-and-database',
  },
  stages: updatedStages,
}

fs.writeFileSync(stagesPath, JSON.stringify(updatedRoadmap, null, 2) + '\n', 'utf8')
console.log('Successfully updated stages.json')

const totalCount = updatedStages.reduce((sum, s) => sum + s.reads.length + s.practise.length, 0)
console.log(`Total items across 10 stages: ${totalCount}`)
