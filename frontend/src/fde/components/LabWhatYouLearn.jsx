const MAX_LEARN = 4

export default function LabWhatYouLearn({ items, accentColor }) {
  if (!items?.length) return null
  const lines = items.slice(0, MAX_LEARN).map((line) => {
    const t = String(line).trim()
    if (t.length <= 100) return t
    const cut = t.slice(0, 97).replace(/\s+\S*$/, '')
    return `${cut}…`
  })

  return (
    <section
      className="mt-8 rounded-xl border px-5 py-4 sm:px-6"
      style={{
        borderColor: accentColor ? `${accentColor}44` : 'var(--fde-bd)',
        borderLeftWidth: '4px',
        borderLeftColor: accentColor || '#35d49a',
        background: 'var(--fde-card)',
      }}
    >
      <h2 className="text-sm font-semibold tracking-tight m-0 mb-3" style={{ color: 'var(--fde-tx)' }}>
        What you will learn
      </h2>
      <ul className="fde-bullets text-sm leading-relaxed text-[var(--fde-mut)] m-0 max-w-3xl">
        {lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </section>
  )
}
