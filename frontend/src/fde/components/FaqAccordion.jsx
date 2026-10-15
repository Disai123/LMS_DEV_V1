export default function FaqAccordion({ items }) {
  return (
    <div className="space-y-2">
      {items.map((f) => (
        <details
          key={f.question}
          className="border border-[var(--fde-bd)] rounded-lg px-4 py-3 bg-[var(--fde-card)] group"
        >
          <summary className="cursor-pointer font-semibold list-none flex justify-between items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#35d49a]">
            {f.question}
            <span className="text-[var(--fde-mut)] text-sm group-open:rotate-180 transition-transform">
              ▾
            </span>
          </summary>
          <p className="mt-3 text-[var(--fde-mut)] text-sm leading-relaxed">{f.answer}</p>
        </details>
      ))}
    </div>
  )
}
