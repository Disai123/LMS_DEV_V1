import ItemLink from './ItemLink'
import ProgressBar from './ProgressBar'
import { useFdeProgress } from '../context/FdeProgressContext'

export default function StageSection({ stage, index }) {
  const { stageStats } = useFdeProgress()
  const stats = stageStats[index]

  return (
    <section
      id={`stage-${stage.slug}`}
      className="border border-[var(--fde-bd)] border-l-4 rounded-xl p-5 mb-4 bg-[var(--fde-card)] scroll-mt-28"
      style={{ borderLeftColor: stage.color, '--fde-accent': stage.color }}
    >
      <h2 className="text-xl font-bold m-0 mb-1" style={{ color: stage.color }}>
        {index + 1}. {stage.name}
      </h2>
      <p className="text-sm text-[var(--fde-mut)] mb-2">
        {stage.weeksLabel} · {stage.hours} hours
        {stats && stats.total > 0 && (
          <span className="ml-2">
            · {stats.done}/{stats.total} done
          </span>
        )}
      </p>
      {stats && stats.total > 0 && (
        <ProgressBar percent={(stats.done / stats.total) * 100} className="mb-3 max-w-xs" />
      )}
      <p className="text-sm mb-3">{stage.description}</p>

      <h3 className="text-xs uppercase tracking-wider text-[var(--fde-mut)] mt-4 mb-2">
        You will be able to
      </h3>
      <ul className="list-none p-0 m-0 mb-2 space-y-1">
        {stage.outcomes.map((o) => (
          <li key={o} className="text-sm pl-0">
            • {o}
          </li>
        ))}
      </ul>

      {stage.reads.length > 0 && (
        <>
          <h3 className="text-xs uppercase tracking-wider text-[var(--fde-mut)] mt-4 mb-2">Read</h3>
          <ul className="list-none p-0 m-0 space-y-1.5">
            {stage.reads.map((item) => (
              <ItemLink key={item.slug} stageSlug={stage.slug} item={item} accent={stage.color} />
            ))}
          </ul>
        </>
      )}

      {stage.practise.length > 0 && (
        <>
          <h3 className="text-xs uppercase tracking-wider text-[var(--fde-mut)] mt-4 mb-2">
            Practise
          </h3>
          <ul className="list-none p-0 m-0 space-y-1.5">
            {stage.practise.map((item) => (
              <ItemLink key={item.slug} stageSlug={stage.slug} item={item} accent={stage.color} />
            ))}
          </ul>
        </>
      )}

      <p className="text-sm text-[var(--fde-mut)] mt-4">
        <strong className="text-[var(--fde-tx)]">Ready to move on when:</strong> {stage.readyWhen}
      </p>
    </section>
  )
}
