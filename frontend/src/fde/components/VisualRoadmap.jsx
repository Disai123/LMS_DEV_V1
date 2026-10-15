import { useRef } from 'react'
import { StageIcon } from './stageIcons'

export default function VisualRoadmap({ stages }) {
  const stripRef = useRef(null)

  const scrollToStage = (slug) => {
    document.getElementById(`stage-${slug}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const onKeyDown = (e, index) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    e.preventDefault()
    const buttons = stripRef.current?.querySelectorAll('[data-stage-card]')
    if (!buttons?.length) return
    const next = e.key === 'ArrowRight' ? index + 1 : index - 1
    if (next >= 0 && next < buttons.length) {
      buttons[next].focus()
    }
  }

  return (
    <div
      ref={stripRef}
      className="flex items-stretch gap-0 overflow-x-auto pb-4 pt-2 px-1 snap-x snap-mandatory"
      role="list"
      aria-label="Roadmap stages"
    >
      {stages.map((stage, index) => (
        <div key={stage.slug} className="flex items-center shrink-0 snap-start">
          <button
            type="button"
            data-stage-card
            onClick={() => scrollToStage(stage.slug)}
            onKeyDown={(e) => onKeyDown(e, index)}
            className="w-[168px] min-h-[200px] text-left border-[1.5px] rounded-xl p-3 bg-[var(--fde-card)] cursor-pointer transition-shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#35d49a]"
            style={{
              borderColor: stage.color,
              boxShadow: `0 0 14px -6px ${stage.color}`,
              color: 'var(--fde-tx)',
            }}
            aria-label={`Stage ${index + 1}: ${stage.name}`}
          >
            <div
              className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold mx-auto mb-2"
              style={{ borderColor: stage.color, color: stage.color }}
            >
              {index + 1}
            </div>
            <div className="flex justify-center mb-2">
              <StageIcon name={stage.icon} style={{ color: stage.color }} />
            </div>
            <div
              className="text-xs font-semibold text-center leading-tight mb-2 min-h-[2.5rem]"
              style={{ color: stage.color }}
            >
              {stage.name}
            </div>
            <p className="text-[11px] text-[var(--fde-mut)] text-center leading-snug m-0">
              {stage.cardBlurb}
            </p>
          </button>
          {index < stages.length - 1 && (
            <div
              className="hidden sm:flex w-6 shrink-0 items-center justify-center text-[var(--fde-mut)] text-lg select-none"
              aria-hidden
            >
              <span className="opacity-60">→</span>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
