import ItemLink from './ItemLink'
import ProgressBar from './ProgressBar'
import { useFdeProgress } from '../context/FdeProgressContext'

function SubHeading({ children }) {
  return <h3 className="fde-eyebrow mt-6 mb-2.5">{children}</h3>
}

function ReadSectionList({ stageSlug, accent, heading, slugs, itemList }) {
  const items = slugs.map((slug) => itemList.find((r) => r.slug === slug)).filter(Boolean)

  if (!items.length) return null

  return (
    <>
      <SubHeading>{heading}</SubHeading>
      <ul className="list-none p-0 m-0 space-y-1.5">
        {items.map((item) => (
          <ItemLink key={item.slug} stageSlug={stageSlug} item={item} accent={accent} />
        ))}
      </ul>
    </>
  )
}

export default function StageSection({ stage, index }) {
  const { stageStats } = useFdeProgress()
  const stats = stageStats[index]

  const readSections = stage.readSections
  const sectionSlugs = new Set(readSections?.flatMap((s) => s.slugs) ?? [])
  const unsectionedReads =
    readSections?.length > 0
      ? stage.reads.filter((r) => !sectionSlugs.has(r.slug))
      : stage.reads

  return (
    <section
      id={`stage-${stage.slug}`}
      className="border border-[var(--fde-bd)] border-l-4 rounded-xl px-5 py-6 sm:px-7 bg-[var(--fde-card)] scroll-mt-28"
      style={{ borderLeftColor: stage.color, '--fde-accent': stage.color }}
    >
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
        <div className="min-w-0">
          <h2 className="font-display text-xl sm:text-2xl font-black tracking-tight m-0" style={{ color: stage.color }}>
            <span className="text-[var(--fde-mut)] font-black tabular-nums">{index + 1}.</span> {stage.name}
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

      <p className="text-[0.9375rem] leading-relaxed mt-4 mb-0">{stage.description}</p>

      <SubHeading>You will be able to</SubHeading>
      <ul className="fde-bullets text-sm">
        {stage.outcomes.map((o) => (
          <li key={o}>{o}</li>
        ))}
      </ul>

      <p className="text-xs text-[var(--fde-mut)] mt-4 mb-0">
        {stage.slug === 'capstone-fde' ? (
          <>
            <strong className="text-[var(--fde-tx)]">Section 3:</strong> One e-commerce Fullstack Agentic RAG capstone — four modules.
          </>
        ) : (
          <>
            <strong className="text-[var(--fde-tx)]">Practise:</strong> Lab = Todo with tutor · Assignment = Customer support ticketing system
            on your own · Capstone = e-commerce (Stage 10)
          </>
        )}
      </p>

      {readSections?.length > 0 &&
        readSections.map((sec) => (
          <ReadSectionList
            key={sec.heading}
            stageSlug={stage.slug}
            accent={stage.color}
            heading={sec.heading}
            slugs={sec.slugs}
            itemList={stage.reads}
          />
        ))}

      {unsectionedReads.length > 0 && (
        <>
          <SubHeading>{readSections?.length ? 'More reading' : 'Read'}</SubHeading>
          <ul className="list-none p-0 m-0 space-y-1.5">
            {unsectionedReads.map((item) => (
              <ItemLink key={item.slug} stageSlug={stage.slug} item={item} accent={stage.color} />
            ))}
          </ul>
        </>
      )}

      {(() => {
        const practiseSections = stage.practiseSections
        const practiseSectionSlugs = new Set(practiseSections?.flatMap((s) => s.slugs) ?? [])
        const unsectionedPractise =
          practiseSections?.length > 0
            ? stage.practise.filter((r) => !practiseSectionSlugs.has(r.slug))
            : stage.practise

        if (!stage.practise.length) return null

        return (
          <>
            {practiseSections?.length > 0 &&
              practiseSections.map((sec) => (
                <ReadSectionList
                  key={sec.heading}
                  stageSlug={stage.slug}
                  accent={stage.color}
                  heading={`Practise · ${sec.heading}`}
                  slugs={sec.slugs}
                  itemList={stage.practise}
                />
              ))}
            {unsectionedPractise.length > 0 && (
              <>
                <SubHeading>{practiseSections?.length ? 'More practise' : 'Practise'}</SubHeading>
                <ul className="list-none p-0 m-0 space-y-1.5">
                  {unsectionedPractise.map((item) => (
                    <ItemLink key={item.slug} stageSlug={stage.slug} item={item} accent={stage.color} />
                  ))}
                </ul>
              </>
            )}
          </>
        )
      })()}
    </section>
  )
}