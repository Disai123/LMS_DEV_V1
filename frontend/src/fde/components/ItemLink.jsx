import { Link } from 'react-router-dom'
import { useFdeProgress } from '../context/FdeProgressContext'
import { EXERCISES } from '../exercises/exerciseData'

const TYPE_LABEL = {
  read: 'Read',
  lab: 'Lab',
  interview: 'Interview',
  project: 'Project',
  assignment: 'Assignment',
  capstone: 'Capstone',
}

export default function ItemLink({ stageSlug, item, accent }) {
  const { isDone } = useFdeProgress()
  const done = isDone(stageSlug, item.slug)
  const hasExercise = Boolean(EXERCISES[`${stageSlug}/${item.slug}`])

  return (
    <li>
      <Link
        to={`/roadmap/fde/item/${stageSlug}/${item.slug}`}
        className={`flex items-center justify-between gap-4 px-3.5 py-2.5 border rounded-lg text-sm transition-colors hover:border-[var(--fde-accent)] hover:bg-[var(--fde-bg)] ${
          done ? 'opacity-55' : ''
        } border-[var(--fde-bd)]`}
        style={{ '--fde-accent': accent }}
      >
        <span className="flex items-center gap-3 min-w-0">
          <span
            className="shrink-0 w-[84px] text-center text-[10px] font-semibold uppercase tracking-wider border rounded px-1.5 py-0.5"
            style={{ color: accent, borderColor: accent }}
          >
            {TYPE_LABEL[item.type] || item.type}
          </span>
          <span className={`leading-snug ${done ? 'line-through' : ''}`}>{item.title}</span>
        </span>
        <span className="shrink-0 flex items-center text-xs text-[var(--fde-mut)] tabular-nums">
          {hasExercise && (
            <span
              className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold border rounded px-1.5 py-0.5 mr-2"
              style={{
                color: '#35d49a',
                borderColor: 'rgba(53, 212, 154, 0.3)',
                backgroundColor: 'rgba(53, 212, 154, 0.08)',
              }}
            >
              <span>🛠</span> Exercise
            </span>
          )}
          {done && <span className="text-[#35d49a] mr-1.5">✓</span>}
          {item.minutes} min
        </span>
      </Link>
    </li>
  )
}
