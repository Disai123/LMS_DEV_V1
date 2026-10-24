export default function FaqAccordion({ items }) {
  return (
    <div className="space-y-2">
      {items.map((f) => (
        <details
          key={f.question}
          className="border border-[var(--fde-bd)] rounded-lg bg-[var(--fde-card)] group"
        >
          <summary className="cursor-pointer px-5 py-4 text-[0.9375rem] font-semibold list-none flex justify-between items-center gap-4 [&::-webkit-details-marker]:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#35d49a] rounded-lg">
            {f.question}
            <span className="shrink-0 text-[var(--fde-mut)] text-sm group-open:rotate-180 transition-transform">
              ▾
            </span>
          </summary>
          <p className="px-5 pb-4 pt-0 m-0 text-[var(--fde-mut)] text-sm leading-relaxed max-w-3xl">{f.answer}</p>
        </details>
      ))}
    </div>
  )
}
