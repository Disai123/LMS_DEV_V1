import ItemLink from './ItemLink'
import ProgressBar from './ProgressBar'
import { useFdeProgress } from '../context/FdeProgressContext'

function SubHeading({ children }) {
  return <h3 className="fde-eyebrow mt-6 mb-2.5">{children}</h3>
}

export default function StageSection({ stage, index }) {
  const { stageStats } = useFdeProgress()
  const stats = stageStats[index]

  return (
    <section
      id={`stage-${stage.slug}`}
      className="border border-[var(--fde-bd)] border-l-4 rounded-xl px-5 py-6 sm:px-7 mb-5 bg-[var(--fde-card)] scroll-mt-28"
      style={{ borderLeftColor: stage.color, '--fde-accent': stage.color }}
    >
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
        <div className="min-w-0">
          <h2 className="text-xl font-bold tracking-tight m-0" style={{ color: stage.color }}>
            {index + 1}. {stage.name}
          </h2>
          <p className="text-sm text-[var(--fde-mut)] mt-1 mb-0 tabular-nums">
            {stage.weeksLabel} · {stage.hours} hours
            {stats && stats.total > 0 && (
              <>
                {' '}
                · {stats.done}/{stats.total} done
              </>
            )}
          </p>
        </div>
        {stats && stats.total > 0 && (
          <ProgressBar percent={(stats.done / stats.total) * 100} className="w-full sm:w-48 sm:mt-3" />
        )}
      </div>

      <p className="text-[0.9375rem] leading-relaxed mt-4 mb-0 max-w-3xl">{stage.description}</p>

      <SubHeading>You will be able to</SubHeading>
      <ul className="fde-bullets text-sm">
        {stage.outcomes.map((o) => (
          <li key={o}>{o}</li>
        ))}
      </ul>

      {stage.reads.length > 0 && (
        <>
          <SubHeading>Read</SubHeading>
          <ul className="list-none p-0 m-0 space-y-1.5">
            {stage.reads.map((item) => (
              <ItemLink key={item.slug} stageSlug={stage.slug} item={item} accent={stage.color} />
            ))}
          </ul>
        </>
      )}

      {stage.practise.length > 0 && (
        <>
          <SubHeading>Practise</SubHeading>
          <ul className="list-none p-0 m-0 space-y-1.5">
            {stage.practise.map((item) => (
              <ItemLink key={item.slug} stageSlug={stage.slug} item={item} accent={stage.color} />
            ))}
          </ul>
        </>
      )}

      <p className="text-sm leading-relaxed text-[var(--fde-mut)] mt-6 mb-0 pt-4 border-t border-[var(--fde-bd)]">
        <strong className="text-[var(--fde-tx)] font-semibold">Ready to move on when:</strong> {stage.readyWhen}
      </p>
    </section>
  )
}
