import { Helmet } from 'react-helmet-async'
import { Link, useParams } from 'react-router-dom'
import FdeItemBody from '../components/FdeItemBody'
import { useFdeProgress } from '../context/FdeProgressContext'
import { getAdjacentItems, getItem, getItemContent } from '../lib/stages.ts'

const TYPE_LABEL = {
  read: 'Read',
  lab: 'Lab',
  interview: 'Interview',
  project: 'Project',
  capstone: 'Capstone',
}

export default function FdeItemPage() {
  const { stageSlug, itemSlug } = useParams()
  const { isDone, toggleDone } = useFdeProgress()

  const resolved = getItem(stageSlug, itemSlug)
  if (!resolved) {
    return (
      <div>
        <Link to="/roadmap/fde" className="text-sm text-[var(--fde-mut)] hover:text-[var(--fde-tx)]">
          ← Back to roadmap
        </Link>
        <p className="mt-4">Item not found.</p>
      </div>
    )
  }

  const { stage, item, stageIndex } = resolved
  const content = getItemContent(stageSlug, itemSlug)
  const { prev, next } = getAdjacentItems(stageSlug, itemSlug)
  const done = isDone(stageSlug, itemSlug)

  return (
    <>
      <Helmet>
        <title>
          {item.title} · FDE Roadmap · GNANAM AI
        </title>
        <meta name="description" content={content?.summary || item.title} />
      </Helmet>

      <nav
        aria-label="Breadcrumb"
        className="text-xs text-[var(--fde-mut)] mb-6 flex flex-wrap items-center gap-x-2 gap-y-1"
      >
        <Link to="/roadmap/fde" className="hover:text-[var(--fde-tx)]">
          Roadmap
        </Link>
        <span aria-hidden className="opacity-50">/</span>
        <Link to={`/roadmap/fde#stage-${stage.slug}`} className="hover:text-[var(--fde-tx)]">
          Stage {stageIndex + 1}: {stage.name}
        </Link>
        <span aria-hidden className="opacity-50">/</span>
        <span className="text-[var(--fde-tx)] truncate max-w-full">{item.title}</span>
      </nav>

      <div
        className="border border-[var(--fde-bd)] border-l-4 rounded-xl px-5 py-6 sm:px-8 sm:py-8 bg-[var(--fde-card)]"
        style={{ borderLeftColor: stage.color }}
      >
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-xs text-[var(--fde-mut)] mb-3">
          <span>
            Stage {stageIndex + 1} · {stage.name}
          </span>
          <span aria-hidden className="opacity-50">·</span>
          <span
            className="font-semibold uppercase tracking-wider text-[10px] border rounded px-1.5 py-0.5"
            style={{ color: stage.color, borderColor: stage.color }}
          >
            {TYPE_LABEL[item.type]}
          </span>
          <span aria-hidden className="opacity-50">·</span>
          <span className="tabular-nums">{item.minutes} min</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight mb-5">{item.title}</h1>

        {content && <FdeItemBody content={content} itemType={item.type} />}

        <div className="mt-10 pt-6 border-t border-[var(--fde-bd)] flex flex-wrap gap-3 items-center">
          <button
            type="button"
            onClick={() => toggleDone(stageSlug, itemSlug)}
            className={`text-sm font-medium px-4 py-2 rounded-lg border transition-colors ${
              done
                ? 'bg-[#35d49a] text-[#04210f] border-[#35d49a]'
                : 'border-[var(--fde-bd)] bg-[var(--fde-card)] hover:border-[#35d49a]'
            }`}
          >
            {done ? '✓ Done' : 'Mark as done'}
          </button>
        </div>
      </div>

      <nav aria-label="Lesson navigation" className="grid grid-cols-2 gap-4 mt-6 text-sm">
        {prev ? (
          <Link
            to={`/roadmap/fde/item/${prev.stageSlug}/${prev.item.slug}`}
            className="group rounded-lg border border-[var(--fde-bd)] bg-[var(--fde-card)] px-4 py-3 hover:border-[var(--fde-mut)]"
          >
            <span className="block text-[11px] uppercase tracking-wider text-[var(--fde-mut)] mb-1">← Previous</span>
            <span className="block text-[var(--fde-tx)] leading-snug">{prev.item.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            to={`/roadmap/fde/item/${next.stageSlug}/${next.item.slug}`}
            className="group rounded-lg border border-[var(--fde-bd)] bg-[var(--fde-card)] px-4 py-3 text-right hover:border-[var(--fde-mut)]"
          >
            <span className="block text-[11px] uppercase tracking-wider text-[var(--fde-mut)] mb-1">Next →</span>
            <span className="block text-[var(--fde-tx)] leading-snug">{next.item.title}</span>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </>
  )
}
