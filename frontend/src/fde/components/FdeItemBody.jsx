import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

function BlockHeading({ children }) {
  return <h3 className="fde-eyebrow mb-3">{children}</h3>
}

function ListBlock({ title, items, ordered = false }) {
  if (!items?.length) return null
  const ListTag = ordered ? 'ol' : 'ul'
  return (
    <section className="mt-8">
      <BlockHeading>{title}</BlockHeading>
      <ListTag
        className={
          ordered
            ? 'list-decimal pl-5 space-y-1.5 text-[0.9375rem] leading-relaxed text-[var(--fde-mut)] marker:font-semibold marker:text-[var(--fde-mut)]'
            : 'fde-bullets text-[0.9375rem] text-[var(--fde-mut)]'
        }
      >
        {items.map((x) => (
          <li key={x} className={ordered ? 'pl-1' : ''}>
            {x}
          </li>
        ))}
      </ListTag>
    </section>
  )
}

export default function FdeItemBody({ content, itemType }) {
  const extras = content.typeExtras || {}
  const isProject = itemType === 'project' || itemType === 'capstone'

  return (
    <article className="text-[var(--fde-tx)]">
      <p className="text-base sm:text-lg leading-relaxed text-[var(--fde-mut)] max-w-3xl m-0">
        {content.summary}
      </p>

      {content.sections.map((sec) => (
        <section key={sec.heading} className="mt-8 pt-6 border-t border-[var(--fde-bd)]">
          <h2 className="text-lg font-semibold tracking-tight mb-3 text-[var(--fde-tx)]">{sec.heading}</h2>
          <div className="fde-md max-w-3xl">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{sec.body}</ReactMarkdown>
          </div>
        </section>
      ))}

      {Object.keys(extras).length > 0 && <div className="mt-8 border-t border-[var(--fde-bd)]" />}

      {itemType === 'interview' && extras.prompt && (
        <section className="mt-8 p-4 rounded-lg border border-[var(--fde-bd)] bg-[var(--fde-bg)]">
          <BlockHeading>Prompt</BlockHeading>
          <p className="text-[0.9375rem] leading-relaxed m-0">{extras.prompt}</p>
        </section>
      )}

      {isProject && extras.scope && (
        <section className="mt-8">
          <BlockHeading>Scope</BlockHeading>
          <p className="text-[0.9375rem] leading-relaxed text-[var(--fde-mut)] m-0 max-w-3xl">
            {extras.scope}
          </p>
        </section>
      )}

      <ListBlock title="Objectives" items={extras.objectives} />

      {itemType === 'lab' && (
        <>
          <ListBlock title="Prerequisites" items={extras.prerequisites} />
          <ListBlock title="Steps" items={extras.steps} ordered />
          <ListBlock title="Deliverables" items={extras.deliverables} />
        </>
      )}

      {itemType === 'interview' && (
        <>
          <ListBlock title="How to approach" items={extras.howToApproach} />
          <ListBlock title="Strong answer covers" items={extras.rubric} />
        </>
      )}

      {isProject && (
        <>
          <ListBlock title="Milestones" items={extras.milestones} ordered />
          <ListBlock title="Acceptance criteria" items={extras.acceptanceCriteria} />
        </>
      )}

      <ListBlock title="Checkpoint questions" items={extras.checkpointQuestions} />
    </article>
  )
}
