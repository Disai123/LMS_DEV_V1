/** GNANAM-style editorial headings — matches main landing (Playfair, amber rule, watermark). */

export function FdeEditorialLabel({ children }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="h-px w-12 bg-amber-400 shrink-0" aria-hidden />
      <span className="text-amber-400 text-xs font-bold tracking-[0.25em] uppercase">{children}</span>
    </div>
  )
}

export function FdeHeroHeadline({ eyebrow, subtitle }) {
  return (
    <div className="relative">
      <FdeEditorialLabel>{eyebrow}</FdeEditorialLabel>
      <div className="mb-8">
        <h1 className="m-0">
          <span className="block font-display font-black text-5xl sm:text-6xl lg:text-[4.5rem] xl:text-[5.25rem] leading-[0.9] tracking-tight text-[var(--fde-tx)]">
            Forward
          </span>
          <span className="block font-display font-black text-5xl sm:text-6xl lg:text-[4.5rem] xl:text-[5.25rem] leading-[0.9] tracking-tight text-amber-400">
            Deployed
          </span>
          <span
            className="block font-display font-black text-5xl sm:text-6xl lg:text-[4.5rem] xl:text-[5.25rem] leading-[0.9] tracking-tight text-transparent"
            style={{ WebkitTextStroke: '1.5px rgba(232, 236, 247, 0.32)' }}
          >
            Engineer.
          </span>
          <span className="block font-display font-black text-xl sm:text-2xl text-[var(--fde-mut)] mt-4 tracking-wide">
            40-hour roadmap
          </span>
        </h1>
      </div>
      {subtitle && (
        <p className="text-base sm:text-lg text-[var(--fde-mut)] font-light leading-relaxed m-0 max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  )
}

export function FdeSectionHeader({ sectionIndex, label, title, emphasis, description, className = '' }) {
  return (
    <header className={`relative mb-8 overflow-hidden ${className}`.trim()}>
      {sectionIndex != null && (
        <span
          className="absolute -right-1 sm:right-4 top-0 text-[5rem] sm:text-[6.5rem] font-black font-display text-[var(--fde-tx)] opacity-[0.05] leading-none select-none pointer-events-none tabular-nums"
          aria-hidden
        >
          {String(sectionIndex).padStart(2, '0')}
        </span>
      )}
      <FdeEditorialLabel>{label}</FdeEditorialLabel>
      <h2 className="font-display font-black text-4xl sm:text-5xl text-[var(--fde-tx)] leading-[1.05] m-0 max-w-4xl">
        {emphasis ? (
          <>
            {title} <span className="text-amber-400">{emphasis}</span>
          </>
        ) : (
          title
        )}
      </h2>
      {description && (
        <p className="text-base text-[var(--fde-mut)] font-light leading-relaxed mt-4 mb-0 max-w-3xl">
          {description}
        </p>
      )}
    </header>
  )
}