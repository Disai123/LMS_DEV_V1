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
}

export default function FdeItemPage() {
  const { stageSlug, itemSlug } = useParams()
  const { isDone, toggleDone } = useFdeProgress()

  const resolved = getItem(stageSlug, itemSlug)
  if (!resolved) {
    return (
      <div>
        <Link to="/roadmap/fde" className="text-sm text-[var(--fde-mut)]">
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

      <nav className="text-xs text-[var(--fde-mut)] mb-4 flex flex-wrap gap-1">
        <Link to="/roadmap/fde" className="hover:text-[var(--fde-tx)]">
          Roadmap
        </Link>
        <span>/</span>
        <Link to={`/roadmap/fde#stage-${stage.slug}`} className="hover:text-[var(--fde-tx)]">
          Stage {stageIndex + 1}: {stage.name}
        </Link>
        <span>/</span>
        <span className="text-[var(--fde-tx)]">{item.title}</span>
      </nav>

      <Link to={`/roadmap/fde#stage-${stage.slug}`} className="text-sm text-[var(--fde-mut)] inline-block mb-4">
        ← Back to roadmap
      </Link>

      <div
        className="border border-[var(--fde-bd)] border-l-4 rounded-xl p-5 bg-[var(--fde-card)]"
        style={{ borderLeftColor: stage.color }}
      >
        <p className="text-sm text-[var(--fde-mut)] mb-2">
          Stage {stageIndex + 1} · {stage.name} ·{' '}
          <span style={{ color: stage.color }}>{TYPE_LABEL[item.type]}</span> · {item.minutes} min
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">{item.title}</h1>

        {content && <FdeItemBody content={content} itemType={item.type} />}

        <div className="mt-8 pt-6 border-t border-[var(--fde-bd)] flex flex-wrap gap-3 items-center">
          <button
            type="button"
            onClick={() => toggleDone(stageSlug, itemSlug)}
            className={`text-sm px-4 py-2 rounded-lg border transition-colors ${
              done
                ? 'bg-[#35d49a] text-[#04210f] border-[#35d49a]'
                : 'border-[var(--fde-bd)] bg-[var(--fde-card)]'
            }`}
          >
            {done ? '✓ Done' : 'Mark as done'}
          </button>
        </div>
      </div>

      <div className="flex justify-between gap-4 mt-8 text-sm">
        {prev ? (
          <Link
            to={`/roadmap/fde/item/${prev.stageSlug}/${prev.item.slug}`}
            className="text-[var(--fde-mut)] hover:text-[var(--fde-tx)] max-w-[45%]"
          >
            ← {prev.item.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            to={`/roadmap/fde/item/${next.stageSlug}/${next.item.slug}`}
            className="text-[var(--fde-mut)] hover:text-[var(--fde-tx)] max-w-[45%] text-right ml-auto"
          >
            {next.item.title} →
          </Link>
        ) : null}
      </div>
    </>
  )
}
