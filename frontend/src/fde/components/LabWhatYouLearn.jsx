export default function LabWhatYouLearn({ items, accentColor }) {
  if (!items?.length) return null

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
      <p className="text-xs text-[var(--fde-mut)] m-0 mb-3 max-w-2xl">
        By the end of this tutored Todo lab, you should be able to do the following—with your tutor and the prompts in
        the panel below.
      </p>
      <ul className="fde-bullets text-[0.9375rem] text-[var(--fde-tx)] m-0 max-w-3xl">
        {items.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </section>
  )
}
