import ReactMarkdown from 'react-markdown'

function ListBlock({ title, items }) {
  if (!items?.length) return null
  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--fde-mut)] mb-2">
        {title}
      </h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        {items.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>
    </div>
  )
}

export default function FdeItemBody({ content, itemType }) {
  const extras = content.typeExtras || {}

  return (
    <article className="prose prose-sm max-w-none prose-invert:fde text-[var(--fde-tx)]">
      <p className="text-[var(--fde-mut)] text-base leading-relaxed">{content.summary}</p>

      {content.sections.map((sec) => (
        <div key={sec.heading} className="mt-6">
          <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--fde-tx)' }}>
            {sec.heading}
          </h2>
          <div className="text-sm leading-relaxed text-[var(--fde-mut)] [&_strong]:text-[var(--fde-tx)]">
            <ReactMarkdown>{sec.body}</ReactMarkdown>
          </div>
        </div>
      ))}

      {itemType === 'read' && (
        <>
          <ListBlock title="Objectives" items={extras.objectives} />
          <ListBlock title="Checkpoint questions" items={extras.checkpointQuestions} />
        </>
      )}

      {itemType === 'lab' && (
        <>
          <ListBlock title="Prerequisites" items={extras.prerequisites} />
          <ListBlock title="Steps" items={extras.steps} />
          <ListBlock title="Deliverables" items={extras.deliverables} />
        </>
      )}

      {itemType === 'interview' && extras.prompt && (
        <div className="mt-6 p-4 rounded-lg border border-[var(--fde-bd)] bg-[var(--fde-bg)]">
          <h3 className="text-sm font-semibold mb-2">Prompt</h3>
          <p className="text-sm m-0">{extras.prompt}</p>
        </div>
      )}
      {itemType === 'interview' && (
        <>
          <ListBlock title="How to approach" items={extras.howToApproach} />
          <ListBlock title="Strong answer covers" items={extras.rubric} />
        </>
      )}

      {itemType === 'project' && extras.scope && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--fde-mut)] mb-2">
            Scope
          </h3>
          <p className="text-sm">{extras.scope}</p>
        </div>
      )}
      {itemType === 'project' && (
        <>
          <ListBlock title="Milestones" items={extras.milestones} />
          <ListBlock title="Acceptance criteria" items={extras.acceptanceCriteria} />
        </>
      )}
    </article>
  )
}
