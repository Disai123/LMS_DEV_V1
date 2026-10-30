import { useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import ItemLink from '../components/ItemLink'
import ProgressBar from '../components/ProgressBar'
import { useFdeProgress } from '../context/FdeProgressContext'
import { getAllItems, getProgressKey, getRoadmapData, getStage } from '../lib/stages.ts'

const PROJECTS_DATA = [
  {
    id: 1,
    title: 'Project 1: E-commerce Full-Stack Application',
    hoursLabel: '4 Hours',
    color: '#3aa6ff',
    tech: ['ReactJS', 'FastAPI', 'PostgreSQL'],
    description:
      'Confirm customer and admin scope, inspect starter project structure, implement and connect core APIs to PostgreSQL, and validate the end-to-end shopping journey before introducing AI layers.',
    outcomes: [
      'Application flow and project structure understood; database is reachable and seeded.',
      'Core catalog, cart, and order APIs return real database data with proper validation.',
      'React frontend connected to FastAPI with loading, empty, and error states handled.',
      'Customer journey verified end-to-end with high-priority issues resolved and documented.',
    ],
    expectedOutcome:
      'A working full-stack walkthrough across React, FastAPI and PostgreSQL with verified features and known gaps.',
  },
  {
    id: 2,
    title: 'Project 2: E-commerce Single Agent + Multi-Agent',
    hoursLabel: '4 Hours',
    color: '#a074ff',
    tech: ['FastAPI', 'LangChain', 'LangGraph', 'PostgreSQL'],
    description:
      'Build a single-agent baseline on store tools, discover where one agent struggles, then architect a LangGraph multi-agent orchestrator with specialist agents and strict permission boundaries.',
    outcomes: [
      'Single-agent baseline tested on product search, cart, and order queries to identify limits.',
      'Orchestrator and specialist responsibilities, routing rules, and permission boundaries designed.',
      'LangGraph flow implemented with conditional routing and minimal context passing.',
      'Extensive testing of edge cases, invalid questions, unauthorized access, and failure modes.',
    ],
    expectedOutcome:
      'A single-agent vs multi-agent comparison, with core routing and permission checks tested.',
  },
  {
    id: 3,
    title: 'Project 3: E-commerce Agentic RAG',
    hoursLabel: '4 Hours',
    color: '#ff9a2f',
    tech: ['FastAPI', 'FAISS', 'Embeddings', 'LangGraph'],
    description:
      'Prepare approved product manuals, generate embeddings, index in FAISS, and implement an agentic retrieval flow that delivers grounded, cited answers and refuses unsupported questions.',
    outcomes: [
      'Approved product documentation extracted, cleaned, chunked, and tagged with metadata.',
      'Vector embeddings generated and stored in FAISS with metadata mapping.',
      'Agentic query preparation, retrieval sufficiency checks, and grounded answer generation.',
      'FastAPI endpoint and React chat panel tested against ambiguous queries and injection attacks.',
    ],
    expectedOutcome:
      'A working document-question-answering demo with grounded answers and an evaluation checklist.',
  },
  {
    id: 4,
    title: 'Project 4: E-commerce Full-Stack + Multi-Agent + Agentic RAG',
    hoursLabel: '4 Hours',
    color: '#27d3e0',
    tech: ['ReactJS', 'FastAPI', 'PostgreSQL', 'LangGraph', 'FAISS', 'Langfuse'],
    description:
      'Unify the full-stack commerce platform, multi-agent store actions, and agentic RAG manual assistance into one cohesive application with two distinct assistant modes and observability.',
    outcomes: [
      'Clean integration design with two explicit assistant modes: Store Actions vs. Product Manuals.',
      'Multi-Agent module connected to handle live store queries and permitted database actions.',
      'Agentic RAG module connected to answer manual questions with citations without store mutations.',
      'End-to-end validation across commerce, agent actions, RAG retrieval, and Langfuse tracing.',
    ],
    expectedOutcome:
      'One integrated application demonstrates full-stack shopping, multi-agent store assistance and Agentic RAG in separate modes.',
  },
]

export default function FdeCapstonePage() {
  const { capstone } = getRoadmapData()
  const { doneKeys, isDone } = useFdeProgress()
  const capstoneStage = getStage('capstone-fde')

  const allItems = useMemo(() => {
    return capstoneStage ? getAllItems(capstoneStage) : []
  }, [capstoneStage])

  // Group items by project (1 to 4)
  const projectItemsMap = useMemo(() => {
    const map = {}
    PROJECTS_DATA.forEach((p) => {
      const items = allItems.filter((i) => i.slug.startsWith(`project-${p.id}-`))
      // Sort in hour order
      items.sort((a, b) => a.slug.localeCompare(b.slug))
      map[p.id] = items
    })
    return map
  }, [allItems])

  const totalCapstoneHours = 16
  const completedCapstoneCount = useMemo(() => {
    return allItems.filter((item) =>
      doneKeys.includes(getProgressKey('capstone-fde', item.slug))
    ).length
  }, [allItems, doneKeys])

  const capstonePercent = Math.round((completedCapstoneCount / totalCapstoneHours) * 100)

  // Find next unfinished capstone item
  const nextItem = useMemo(() => {
    return allItems.find((it) => !isDone('capstone-fde', it.slug)) || allItems[0]
  }, [allItems, isDone])

  const startUrl = nextItem
    ? `/roadmap/fde/item/capstone-fde/${nextItem.slug}`
    : `/roadmap/fde/item/capstone-fde/${capstone.startItemSlug}`

  return (
    <>
      <Helmet>
        <title>FDE Capstone Projects (16h) · GNANAM AI</title>
        <meta
          name="description"
          content="Four hands-on capstone projects: E-commerce Full-Stack, Single & Multi-Agent, Agentic RAG, and Integrated Application."
        />
      </Helmet>

      {/* Top Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-xs text-[var(--fde-mut)] mb-4 flex items-center gap-2">
        <Link to="/roadmap/fde" className="hover:text-[var(--fde-tx)]">
          Roadmap
        </Link>
        <span aria-hidden className="opacity-50">/</span>
        <span className="text-[var(--fde-tx)] font-medium">Capstone Projects</span>
      </nav>

      {/* Header */}
      <header className="mb-8">
        <p className="fde-eyebrow m-0 text-xs font-semibold uppercase tracking-wider text-[#27d3e0]">
          Section 3 · 16 Hours
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mt-2 mb-3">
          FDE Capstone Projects
        </h1>
        <p className="text-base sm:text-lg leading-relaxed text-[var(--fde-mut)] max-w-3xl m-0">
          Four compact, hands-on capstone projects (4 hours each) taking a full-stack e-commerce application
          from React + FastAPI + PostgreSQL to Multi-Agent Orchestration, Agentic RAG with FAISS citations,
          and a Unified Commerce Platform.
        </p>

        {/* Chips */}
        <div className="flex flex-wrap gap-2 mt-5">
          <span className="text-xs font-medium border border-[var(--fde-bd)] rounded-full px-3 py-1 text-[var(--fde-mut)] bg-[var(--fde-card)]">
            4 Projects
          </span>
          <span className="text-xs font-medium border border-[var(--fde-bd)] rounded-full px-3 py-1 text-[var(--fde-mut)] bg-[var(--fde-card)]">
            16 Hours Total
          </span>
          <span className="text-xs font-medium border border-[var(--fde-bd)] rounded-full px-3 py-1 text-[var(--fde-mut)] bg-[var(--fde-card)]">
            4 Hours per Project
          </span>
          <span className="text-xs font-medium border border-[var(--fde-bd)] rounded-full px-3 py-1 text-[var(--fde-mut)] bg-[var(--fde-card)]">
            Hands-on Code & Demonstrations
          </span>
        </div>
      </header>

      {/* Overall Capstone Progress Card */}
      <div className="rounded-xl border border-[var(--fde-bd)] bg-[var(--fde-card)] px-5 py-4 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5">
          <p className="text-sm m-0 tabular-nums">
            <span className="font-semibold text-[var(--fde-tx)]">
              {completedCapstoneCount}/{totalCapstoneHours} hours done
            </span>
            <span className="text-[var(--fde-mut)]"> · {capstonePercent}% completed</span>
          </p>
          <Link
            to={startUrl}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-[var(--fde-bd)] hover:border-[#27d3e0] text-[#27d3e0] bg-[var(--fde-bg)] transition-colors"
          >
            {completedCapstoneCount === 0
              ? 'Start Project 1 (Hour 1) →'
              : completedCapstoneCount === totalCapstoneHours
              ? 'Review Capstone Items →'
              : 'Continue Next Hour →'}
          </Link>
        </div>
        <ProgressBar percent={capstonePercent} />
      </div>

      {/* 4 Capstone Projects Sections */}
      <div className="space-y-6 mb-12">
        {PROJECTS_DATA.map((proj) => {
          const items = projectItemsMap[proj.id] || []
          const projDoneCount = items.filter((it) => isDone('capstone-fde', it.slug)).length

          return (
            <section
              key={proj.id}
              id={`capstone-project-${proj.id}`}
              className="border border-[var(--fde-bd)] border-l-4 rounded-xl px-5 py-6 sm:px-7 bg-[var(--fde-card)] scroll-mt-28"
              style={{ borderLeftColor: proj.color, '--fde-accent': proj.color }}
            >
              {/* Project Header */}
              <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span
                      className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border"
                      style={{ color: proj.color, borderColor: proj.color }}
                    >
                      Project {proj.id}
                    </span>
                    <span className="text-xs text-[var(--fde-mut)]">{proj.hoursLabel}</span>
                  </div>
                  <h2 className="text-xl font-bold tracking-tight m-0" style={{ color: proj.color }}>
                    {proj.title}
                  </h2>
                </div>

                {/* Project Done Count */}
                <div className="text-xs text-[var(--fde-mut)] font-medium tabular-nums">
                  {projDoneCount}/{items.length} hours done
                </div>
              </div>

              {/* Tech Stack Tags */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {proj.tech.map((t) => (
                  <span
                    key={t}
                    className="text-[11px] font-medium px-2 py-0.5 rounded bg-[var(--fde-bg)] border border-[var(--fde-bd)] text-[var(--fde-mut)]"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Description */}
              <p className="text-[0.9375rem] leading-relaxed mt-4 mb-4 max-w-3xl text-[var(--fde-tx)]">
                {proj.description}
              </p>

              {/* Outcomes list */}
              <h3 className="fde-eyebrow mt-4 mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--fde-mut)]">
                Focus & Outcomes
              </h3>
              <ul className="fde-bullets text-sm mb-6">
                {proj.outcomes.map((o) => (
                  <li key={o}>{o}</li>
                ))}
              </ul>

              {/* Hourly Implementation Sessions (Items) */}
              <h3 className="fde-eyebrow mt-6 mb-2.5 text-xs font-semibold uppercase tracking-wider text-[var(--fde-mut)]">
                Hourly Implementation Sessions
              </h3>
              <ul className="list-none p-0 m-0 space-y-1.5">
                {items.map((item) => (
                  <ItemLink
                    key={item.slug}
                    stageSlug="capstone-fde"
                    item={item}
                    accent={proj.color}
                  />
                ))}
              </ul>

              {/* Expected Outcome Footer */}
              <p className="text-sm leading-relaxed text-[var(--fde-mut)] mt-6 mb-0 pt-4 border-t border-[var(--fde-bd)]">
                <strong className="text-[var(--fde-tx)] font-semibold">Expected outcome:</strong>{' '}
                {proj.expectedOutcome}
              </p>
            </section>
          )
        })}
      </div>

      {/* Deliverables Section */}
      <section
        className="border border-[var(--fde-bd)] border-l-4 rounded-xl px-5 py-6 sm:px-7 bg-[var(--fde-card)] mb-10"
        style={{ borderLeftColor: '#27d3e0' }}
      >
        <h2 className="text-lg font-bold tracking-tight mb-4">Capstone Deliverables</h2>
        <ol className="list-decimal pl-5 space-y-2.5 text-[0.9375rem] leading-relaxed marker:font-semibold marker:text-[#27d3e0]">
          {capstone.deliverables.map((d) => (
            <li key={d} className="pl-1 text-[var(--fde-tx)]">
              {d}
            </li>
          ))}
        </ol>
      </section>

      {/* Quality Expectations */}
      <h2 className="text-xl font-bold tracking-tight mb-4">Quality & Engineering Standards</h2>
      <div className="grid gap-3 sm:grid-cols-2 mb-10">
        {capstone.strongWork.map((block) => (
          <div
            key={block.title}
            className="border border-[var(--fde-bd)] rounded-lg px-5 py-4 bg-[var(--fde-card)]"
          >
            <h3 className="text-[0.9375rem] font-semibold mb-1.5 text-[var(--fde-tx)]">
              {block.title}
            </h3>
            <p className="text-sm leading-relaxed text-[var(--fde-mut)] m-0">{block.body}</p>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="pt-6 border-t border-[var(--fde-bd)] flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/roadmap/fde"
          className="text-sm text-[var(--fde-mut)] hover:text-[var(--fde-tx)] inline-block"
        >
          ← Back to full roadmap
        </Link>
        <Link
          to={startUrl}
          className="inline-block text-sm border border-[var(--fde-bd)] rounded-lg px-5 py-2.5 bg-[var(--fde-card)] hover:border-[#27d3e0] font-medium text-[var(--fde-tx)]"
        >
          Open next session →
        </Link>
      </div>
    </>
  )
}
