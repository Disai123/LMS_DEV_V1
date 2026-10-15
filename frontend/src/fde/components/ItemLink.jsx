import { Link } from 'react-router-dom'
import { useFdeProgress } from '../context/FdeProgressContext'

const TYPE_LABEL = {
  read: 'Read',
  lab: 'Lab',
  interview: 'Interview',
  project: 'Project',
}

export default function ItemLink({ stageSlug, item, accent }) {
  const { isDone } = useFdeProgress()
  const done = isDone(stageSlug, item.slug)

  return (
    <li>
      <Link
        to={`/roadmap/fde/item/${stageSlug}/${item.slug}`}
        className={`flex justify-between gap-3 px-3 py-2 border rounded-lg text-sm transition-colors hover:border-[var(--fde-accent)] ${
          done ? 'opacity-55' : ''
        } border-[var(--fde-bd)]`}
        style={{ '--fde-accent': accent }}
      >
        <span className="min-w-0">
          <span
            className="text-[11px] border rounded px-1.5 mr-2 inline-block align-middle"
            style={{ color: accent, borderColor: accent }}
          >
            {TYPE_LABEL[item.type] || item.type}
          </span>
          <span className={done ? 'line-through' : ''}>{item.title}</span>
        </span>
        <span className="shrink-0 text-[var(--fde-mut)]">{item.minutes} min</span>
      </Link>
    </li>
  )
}
