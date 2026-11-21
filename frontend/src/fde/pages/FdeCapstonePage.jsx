import { useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import ItemLink from '../components/ItemLink'
import ProgressBar from '../components/ProgressBar'
import { useFdeProgress } from '../context/FdeProgressContext'
import { getAllItems, getProgressKey, getRoadmapData, getStage } from '../lib/stages.ts'

const MODULE_META = [
  { slug: 'module-1-fullstack-commerce', color: '#3aa6ff' },
  { slug: 'module-2-multi-agent-store-assistant', color: '#a074ff' },
  { slug: 'module-3-agentic-rag-product-manuals', color: '#ff9a2f' },
  { slug: 'module-4-deployment-and-demo', color: '#27d3e0' },
]

const TECH = ['React', 'FastAPI', 'PostgreSQL', 'LangGraph', 'ChromaDB', 'Langfuse']

export default function FdeCapstonePage() {
  const { capstone } = getRoadmapData()
  const { doneKeys, isDone } = useFdeProgress()
  const capstoneStage = getStage('capstone-fde')

  const allItems = useMemo(() => {
    return capstoneStage ? getAllItems(capstoneStage) : []
  }, [capstoneStage])

  const totalCapstoneMinutes = useMemo(
    () => allItems.reduce((sum, item) => sum + Number(item.minutes), 0),
    [allItems]
  )

  const completedCapstoneMinutes = useMemo(() => {
    return allItems
      .filter((item) => doneKeys.includes(getProgressKey('capstone-fde', item.slug)))
      .reduce((sum, item) => sum + Number(item.minutes), 0)
  }, [allItems, doneKeys])

  const totalCapstoneHours = Math.round((totalCapstoneMinutes / 60) * 10) / 10
  const completedCapstoneHours = Math.round((completedCapstoneMinutes / 60) * 10) / 10

  const capstonePercent =
    totalCapstoneMinutes > 0
      ? Math.round((completedCapstoneMinutes / totalCapstoneMinutes) * 100)
      : 0

  const nextItem = useMemo(() => {
    return allItems.find((it) => !isDone('capstone-fde', it.slug)) || allItems[0]
  }, [allItems, isDone])

  const startUrl = nextItem
    ? `/roadmap/fde/item/capstone-fde/${nextItem.slug}`
    : `/roadmap/fde/item/capstone-fde/${capstone.startItemSlug}`

  return (
    <>
      <Helmet>
        <title>E-commerce Fullstack Agentic RAG Capstone (10h) · GNANAM AI</title>
        <meta
          name="description"
          content="One integrated e-commerce capstone: full-stack commerce, multi-agent assistant, agentic RAG with ChromaDB, and deployment."
        />
      </Helmet>

      <nav aria-label="Breadcrumb" className="text-xs text-[var(--fde-mut)] mb-4 flex items-center gap-2">
        <Link to="/roadmap/fde" className="hover:text-[var(--fde-tx)]">
          Roadmap
        </Link>
        <span aria-hidden className="opacity-50">/</span>
        <span className="text-[var(--fde-tx)] font-medium">Capstone</span>
      </nav>

      <header className="mb-8">
        <p className="fde-eyebrow m-0 text-xs font-semibold uppercase tracking-wider text-[#27d3e0]">
          Section 3 · 10 Hours
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mt-2 mb-3">
          E-commerce Fullstack Agentic RAG
        </h1>
        <p className="text-base sm:text-lg leading-relaxed text-[var(--fde-mut)] max-w-3xl m-0">
          {capstone.intro}
        </p>

        <div className="flex flex-wrap gap-2 mt-5">
          <span className="text-xs font-medium border border-[var(--fde-bd)] rounded-full px-3 py-1 text-[var(--fde-mut)] bg-[var(--fde-card)]">
            1 Integrated project
          </span>
          <span className="text-xs font-medium border border-[var(--fde-bd)] rounded-full px-3 py-1 text-[var(--fde-mut)] bg-[var(--fde-card)]">
            10 Hours Total
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-4">
          {TECH.map((t) => (
            <span
              key={t}
              className="text-[11px] font-medium px-2 py-0.5 rounded bg-[var(--fde-bg)] border border-[var(--fde-bd)] text-[var(--fde-mut)]"
            >
              {t}
            </span>
          ))}
        </div>
      </header>

      <div className="rounded-xl border border-[var(--fde-bd)] bg-[var(--fde-card)] px-5 py-4 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5">
          <p className="text-sm m-0 tabular-nums">
            <span className="font-semibold text-[var(--fde-tx)]">
              {completedCapstoneHours}/{totalCapstoneHours} hours done
            </span>
            <span className="text-[var(--fde-mut)]"> · {capstonePercent}% completed</span>
          </p>
          <Link
            to={startUrl}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-[var(--fde-bd)] hover:border-[#27d3e0] text-[#27d3e0] bg-[var(--fde-bg)] transition-colors"
          >
            {completedCapstoneMinutes === 0
              ? 'Start Module 1 →'
              : completedCapstoneMinutes >= totalCapstoneMinutes
              ? 'Review modules →'
              : 'Continue next module →'}
          </Link>
        </div>
        <ProgressBar percent={capstonePercent} />
      </div>

      <div className="space-y-6 mb-12">
        {MODULE_META.map((meta, index) => {
          const item = allItems.find((i) => i.slug === meta.slug)
          if (!item) return null
          const done = isDone('capstone-fde', item.slug)

          return (
            <section
              key={meta.slug}
              id={`capstone-module-${index + 1}`}
              className="border border-[var(--fde-bd)] border-l-4 rounded-xl px-5 py-6 sm:px-7 bg-[var(--fde-card)] scroll-mt-28"
              style={{ borderLeftColor: meta.color }}
            >
              <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3 mb-4">
                <div>
                  <span
                    className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border"
                    style={{ color: meta.color, borderColor: meta.color }}
                  >
                    Module {index + 1}
                  </span>
                  <h2 className="text-xl font-bold tracking-tight mt-2 m-0" style={{ color: meta.color }}>
                    {item.title.replace(/^Module \d+: /, '')}
                  </h2>
                </div>
                {done && (
                  <span className="text-xs font-medium text-[#35d49a]">✓ Marked done</span>
                )}
              </div>
              <ul className="list-none p-0 m-0 space-y-1.5">
                <ItemLink stageSlug="capstone-fde" item={item} accent={meta.color} />
              </ul>
            </section>
          )
        })}
      </div>

      <section
        className="border border-[var(--fde-bd)] border-l-4 rounded-xl px-5 py-6 sm:px-7 bg-[var(--fde-card)] mb-10"
        style={{ borderLeftColor: '#27d3e0' }}
      >
        <h2 className="text-lg font-bold tracking-tight mb-4">Module overview</h2>
        <ol className="list-decimal pl-5 space-y-2.5 text-[0.9375rem] leading-relaxed marker:font-semibold marker:text-[#27d3e0]">
          {capstone.deliverables.map((d) => (
            <li key={d} className="pl-1 text-[var(--fde-tx)]">
              {d}
            </li>
          ))}
        </ol>
      </section>

      <h2 className="text-xl font-bold tracking-tight mb-4">Engineering themes</h2>
      <div className="grid gap-3 sm:grid-cols-2 mb-10">
        {capstone.strongWork.map((block) => (
          <div
            key={block.title}
            className="border border-[var(--fde-bd)] rounded-lg px-5 py-4 bg-[var(--fde-card)]"
          >
            <h3 className="text-[0.9375rem] font-semibold mb-1.5 text-[var(--fde-tx)]">{block.title}</h3>
            <p className="text-sm leading-relaxed text-[var(--fde-mut)] m-0">{block.body}</p>
          </div>
        ))}
      </div>

      <div className="pt-6 border-t border-[var(--fde-bd)] flex flex-wrap items-center justify-between gap-4">
        <Link to="/roadmap/fde" className="text-sm text-[var(--fde-mut)] hover:text-[var(--fde-tx)]">
          ← Back to full roadmap
        </Link>
        <Link
          to={startUrl}
          className="inline-block text-sm border border-[var(--fde-bd)] rounded-lg px-5 py-2.5 bg-[var(--fde-card)] hover:border-[#27d3e0] font-medium text-[var(--fde-tx)]"
        >
          Open next module →
        </Link>
      </div>
    </>
  )
}