export default function ProgressBar({ percent, className = '' }) {
  const safe = Math.min(100, Math.max(0, percent))
  return (
    <div
      className={`h-1.5 rounded-full overflow-hidden bg-[var(--fde-bd)] ${className}`}
      role="progressbar"
      aria-valuenow={safe}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full bg-[#35d49a] transition-all duration-300"
        style={{ width: `${safe}%` }}
      />
    </div>
  )
}
