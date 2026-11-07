import { useState, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { BADGE_LAB, BADGE_ASSIGNMENT, stripGenericBeforeYouStart } from './labShared'

function isAssignment(exercise) {
  return exercise?.track === 'assignment'
}

function exerciseBadge(exercise) {
  return isAssignment(exercise) ? BADGE_ASSIGNMENT : BADGE_LAB
}

/** Readable markdown in the lab UI; Copy still uses raw text for the AI tool. */
function PromptMarkdown({ text, className = '' }) {
  if (!text) return null
  return (
    <div className={`fde-md fde-prompt-md max-w-none ${className}`.trim()}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
    </div>
  )
}

function CopyButton({ code }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [code])
  return (
    <button
      type="button"
      onClick={handleCopy}
      className="text-[11px] font-medium px-2.5 py-1 rounded border transition-colors"
      style={{
        borderColor: 'var(--fde-bd)',
        color: copied ? '#35d49a' : 'var(--fde-mut)',
        background: 'var(--fde-code-bg)',
      }}
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  )
}

function InfoRow({ label, children }) {
  const body =
    typeof children === 'string' ? (
      <PromptMarkdown text={children} className="text-[0.9rem]" />
    ) : (
      children
    )
  return (
    <div className="mb-4">
      <h4
        className="text-[10px] font-semibold uppercase tracking-widest mb-1.5"
        style={{ color: 'var(--fde-mut)' }}
      >
        {label}
      </h4>
      <div className="text-[0.9rem] leading-relaxed" style={{ color: 'var(--fde-tx)' }}>
        {body}
      </div>
    </div>
  )
}

function WhereTag({ where }) {
  if (!where) return null
  return (
    <span
      className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded"
      style={{ background: 'var(--fde-code-bg)', color: 'var(--fde-mut)' }}
    >
      {where}
    </span>
  )
}

function StepList({ steps }) {
  if (!steps?.length) return null
  return (
    <ol className="list-decimal pl-5 space-y-1.5 text-[0.9rem] leading-relaxed" style={{ color: 'var(--fde-mut)' }}>
      {steps.map((s, i) => (
        <li key={i} className="pl-1">{s}</li>
      ))}
    </ol>
  )
}

function CodeBlock({ language, code, filename }) {
  return (
    <div className="rounded-lg overflow-hidden border" style={{ borderColor: 'var(--fde-bd)' }}>
      <div
        className="flex items-center justify-between px-3 py-2"
        style={{ background: 'var(--fde-code-bg)', borderBottom: '1px solid var(--fde-bd)' }}
      >
        <span className="text-[11px] font-mono" style={{ color: 'var(--fde-mut)' }}>
          {filename || language}
        </span>
        <CopyButton code={code} />
      </div>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          borderRadius: 0,
          fontSize: '0.8rem',
          background: '#0b1020',
          padding: '1rem',
        }}
        wrapLongLines={false}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}

function GlossaryBlock({ glossary }) {
  const [open, setOpen] = useState(false)
  if (!glossary?.length) return null
  return (
    <div className="mb-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="text-[10px] font-semibold uppercase tracking-widest"
        style={{ color: 'var(--fde-mut)' }}
      >
        {open ? '▼' : '▶'} Glossary ({glossary.length} terms)
      </button>
      {open && (
        <ul className="mt-2 space-y-2 text-[0.85rem]" style={{ color: 'var(--fde-tx)' }}>
          {glossary.map((g, i) => (
            <li key={i}>
              <strong>{g.term}</strong>
              <span style={{ color: 'var(--fde-mut)' }}> — {g.meaning}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function PanelHowTo({ exercise }) {
  const assignment = isAssignment(exercise)
  return (
    <div
      className="rounded-lg border px-4 py-3 mb-5 text-[0.88rem] leading-relaxed"
      style={{ borderColor: 'var(--fde-bd)', background: 'var(--fde-code-bg)', color: 'var(--fde-tx)' }}
    >
      <p className="m-0 text-[0.82rem]" style={{ color: 'var(--fde-mut)' }}>
        {assignment ? (
          <>
            On your own: read <strong style={{ color: 'var(--fde-tx)' }}>Skills from the lab</strong>, then{' '}
            <strong style={{ color: 'var(--fde-tx)' }}>Copy</strong> → paste into your AI tool → pass the{' '}
            <strong style={{ color: 'var(--fde-tx)' }}>Checkpoint</strong> → open{' '}
            <strong style={{ color: 'var(--fde-tx)' }}>Troubleshooting</strong> if something breaks.
          </>
        ) : (
          <>
            With your tutor: one step at a time. <strong style={{ color: 'var(--fde-tx)' }}>Copy</strong> → paste into
            your AI tool → pass the <strong style={{ color: 'var(--fde-tx)' }}>Checkpoint</strong> → open{' '}
            <strong style={{ color: 'var(--fde-tx)' }}>Troubleshooting</strong> if something breaks.
          </>
        )}
      </p>
    </div>
  )
}

function LabMetaHeader({ exercise }) {
  const beforeExtra = stripGenericBeforeYouStart(exercise.beforeYouStart)
  return (
    <>
      {(exercise.duration || exercise.prerequisites?.length > 0) && (
        <div className="flex flex-wrap gap-3 mb-4 text-[0.85rem]" style={{ color: 'var(--fde-mut)' }}>
          {exercise.duration && <span>⏱ {exercise.duration}</span>}
          {exercise.prerequisites?.length > 0 && (
            <span>Prerequisites: {exercise.prerequisites.join(', ')}</span>
          )}
        </div>
      )}
      {beforeExtra && <InfoRow label="Before you start">{beforeExtra}</InfoRow>}
      <GlossaryBlock glossary={exercise.glossary} />
    </>
  )
}

function AcceptanceChecklist({ items }) {
  if (!items?.length) return null
  return (
    <div>
      <h4
        className="text-[10px] font-semibold uppercase tracking-widest mb-2"
        style={{ color: 'var(--fde-mut)' }}
      >
        Acceptance criteria
      </h4>
      <ul className="list-disc pl-5 space-y-1 text-[0.9rem]" style={{ color: 'var(--fde-tx)' }}>
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

function TroubleshootingBlock({ items }) {
  const [openIdx, setOpenIdx] = useState(null)
  if (!items?.length) return null
  return (
    <div>
      <h4
        className="text-[10px] font-semibold uppercase tracking-widest mb-2"
        style={{ color: 'var(--fde-mut)' }}
      >
        Troubleshooting (fix with prompts)
      </h4>
      <div className="space-y-2">
        {items.map((t, i) => (
          <div
            key={i}
            className="rounded-lg border overflow-hidden"
            style={{ borderColor: 'var(--fde-bd)' }}
          >
            <button
              type="button"
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
              className="w-full text-left px-3 py-2 text-[0.88rem] font-medium"
              style={{ background: 'var(--fde-code-bg)', color: 'var(--fde-tx)' }}
            >
              {openIdx === i ? '▼' : '▶'} {t.symptom}
            </button>
            {openIdx === i && (
              <div className="px-3 py-3 space-y-2 text-[0.85rem]" style={{ color: 'var(--fde-mut)' }}>
                {t.whatItMeans && <p><strong>What it means:</strong> {t.whatItMeans}</p>}
                {t.likelyCause && <p><strong>Likely cause:</strong> {t.likelyCause}</p>}
                <div
                  className="rounded border p-3 relative"
                  style={{ borderColor: 'var(--fde-bd)', background: '#0b1020' }}
                >
                  <div className="absolute top-2 right-2 z-10">
                    <CopyButton code={t.fixPrompt} />
                  </div>
                  <PromptMarkdown text={t.fixPrompt} className="pr-14" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function PromptsList({ prompts }) {
  if (!prompts?.length) return null
  return (
    <div className="space-y-4">
      <h4
        className="text-[10px] font-semibold uppercase tracking-widest"
        style={{ color: 'var(--fde-mut)' }}
      >
        Prompts to run
      </h4>
      {prompts.map((p) => (
        <div
          key={p.step}
          className="rounded-lg border p-4"
          style={{ borderColor: 'var(--fde-bd)', background: 'var(--fde-code-bg)' }}
        >
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-xs font-bold" style={{ color: '#35d49a' }}>Step {p.step}</span>
            <span className="text-sm font-semibold" style={{ color: 'var(--fde-tx)' }}>{p.label}</span>
            <WhereTag where={p.whereToRun} />
          </div>
          <div className="relative">
            <div className="absolute top-0 right-0 z-10">
              <CopyButton code={p.prompt} />
            </div>
            <PromptMarkdown text={p.prompt} className="pr-16 text-[0.875rem]" />
          </div>
          {p.checkpoint && (
            <p className="mt-3 text-[0.85rem]" style={{ color: 'var(--fde-mut)' }}>
              <strong>Checkpoint:</strong> {p.checkpoint}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}

function SkillsFromLab({ items }) {
  if (!items?.length) return null
  return (
    <div className="mb-4">
      <h4
        className="text-[10px] font-semibold uppercase tracking-widest mb-1.5"
        style={{ color: 'var(--fde-mut)' }}
      >
        Skills from the lab
      </h4>
      <ul className="list-disc pl-5 space-y-1 text-[0.9rem]" style={{ color: 'var(--fde-tx)' }}>
        {items.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ul>
    </div>
  )
}

function PromptLabExercise({ exercise }) {
  return (
    <div className="space-y-5">
      <PanelHowTo exercise={exercise} />
      <LabMetaHeader exercise={exercise} />
      {isAssignment(exercise) && <SkillsFromLab items={exercise.skillsFromLab} />}
      <InfoRow label="Objective">{exercise.objective}</InfoRow>
      <InfoRow label="Scenario">{exercise.scenario}</InfoRow>
      <PromptsList prompts={exercise.prompts} />
      <AcceptanceChecklist items={exercise.acceptanceCriteria} />
      <TroubleshootingBlock items={exercise.troubleshooting} />
      {exercise.deliverable && (
        <InfoRow label="Deliverable">{exercise.deliverable}</InfoRow>
      )}
      {exercise.stretchGoal && (
        <InfoRow label="Stretch goal">{exercise.stretchGoal}</InfoRow>
      )}
      {exercise.keyLearning && (
        <InfoRow label="Key learning">{exercise.keyLearning}</InfoRow>
      )}
    </div>
  )
}

function ConceptExercise({ exercise }) {
  const assignment = isAssignment(exercise)
  const snippet = !assignment && (exercise.conceptSnippet || exercise.code)
  const expected = !assignment && (exercise.conceptSnippet?.expectedOutput ?? exercise.expectedOutput)
  return (
    <div className="space-y-5">
      <PanelHowTo exercise={exercise} />
      <LabMetaHeader exercise={exercise} />
      {assignment && <SkillsFromLab items={exercise.skillsFromLab} />}
      <InfoRow label="Objective">{exercise.objective}</InfoRow>
      <InfoRow label="Scenario">{exercise.scenario}</InfoRow>
      {exercise.steps?.length > 0 && (
        <div>
          <h4
            className="text-[10px] font-semibold uppercase tracking-widest mb-2"
            style={{ color: 'var(--fde-mut)' }}
          >
            Steps
          </h4>
          <StepList steps={exercise.steps} />
        </div>
      )}
      {exercise.codeExplanation && (
        <InfoRow label="What each part does">{exercise.codeExplanation}</InfoRow>
      )}
      {snippet && (
        <div>
          <h4
            className="text-[10px] font-semibold uppercase tracking-widest mb-2"
            style={{ color: 'var(--fde-mut)' }}
          >
            Concept snippet (run in Terminal)
          </h4>
          <CodeBlock
            language={snippet.language}
            code={snippet.content}
            filename={snippet.filename}
          />
        </div>
      )}
      {expected && (
        <div>
          <h4
            className="text-[10px] font-semibold uppercase tracking-widest mb-2"
            style={{ color: 'var(--fde-mut)' }}
          >
            Expected output
          </h4>
          <div
            className="rounded-lg border p-4 font-mono text-[0.82rem] whitespace-pre-wrap"
            style={{ borderColor: 'var(--fde-bd)', background: 'var(--fde-code-bg)', color: '#a8d8a8' }}
          >
            {expected}
          </div>
        </div>
      )}
      {exercise.prompts?.length > 0 && <PromptsList prompts={exercise.prompts} />}
      <AcceptanceChecklist items={exercise.acceptanceCriteria} />
      <TroubleshootingBlock items={exercise.troubleshooting} />
      {exercise.deliverable && <InfoRow label="Deliverable">{exercise.deliverable}</InfoRow>}
      {exercise.keyLearning && <InfoRow label="Key learning">{exercise.keyLearning}</InfoRow>}
    </div>
  )
}

function PromptExercise({ exercise }) {
  const assignment = isAssignment(exercise)
  const [executed, setExecuted] = useState(false)
  const [running, setRunning] = useState(false)

  const handleExecute = () => {
    setRunning(true)
    setTimeout(() => {
      setRunning(false)
      setExecuted(true)
    }, 900)
  }

  const primaryPrompt = exercise.prompt || exercise.prompts?.[0]?.prompt

  return (
    <div className="space-y-5">
      <PanelHowTo exercise={exercise} />
      <LabMetaHeader exercise={exercise} />
      {assignment && <SkillsFromLab items={exercise.skillsFromLab} />}
      <InfoRow label="Objective">{exercise.objective}</InfoRow>
      <InfoRow label="Scenario">{exercise.scenario}</InfoRow>

      {exercise.prompts?.length > 1 ? (
        <PromptsList prompts={exercise.prompts} />
      ) : (
        primaryPrompt && (
          <div>
            <h4
              className="text-[10px] font-semibold uppercase tracking-widest mb-2"
              style={{ color: 'var(--fde-mut)' }}
            >
              AI prompt
            </h4>
            <div
              className="rounded-lg border p-4 relative"
              style={{ borderColor: 'var(--fde-bd)', background: 'var(--fde-code-bg)' }}
            >
              <div className="absolute top-2 right-2 z-10">
                <CopyButton code={primaryPrompt} />
              </div>
              <PromptMarkdown text={primaryPrompt} className="pr-16 text-[0.875rem]" />
            </div>
          </div>
        )
      )}

      {!assignment && exercise.staticResponse && !executed && (
        <button
          type="button"
          onClick={handleExecute}
          disabled={running}
          className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-lg transition-all"
          style={{
            background: running ? 'var(--fde-bd)' : '#35d49a',
            color: running ? 'var(--fde-mut)' : '#04210f',
            cursor: running ? 'not-allowed' : 'pointer',
          }}
        >
          {running ? (
            <>
              <span className="inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Generating…
            </>
          ) : (
            <>▶ Execute (sample output)</>
          )}
        </button>
      )}

      {!assignment && executed && exercise.staticResponse && (
        <div
          className="rounded-lg border p-5 space-y-3"
          style={{ borderColor: '#35d49a33', background: 'var(--fde-code-bg)' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span
              className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded"
              style={{ background: '#35d49a22', color: '#35d49a' }}
            >
              Sample output
            </span>
            <CopyButton code={exercise.staticResponse} />
          </div>
          <pre className="text-[0.84rem] leading-relaxed whitespace-pre-wrap font-mono" style={{ color: 'var(--fde-tx)' }}>
            {exercise.staticResponse}
          </pre>
        </div>
      )}

      <AcceptanceChecklist items={exercise.acceptanceCriteria} />
      <TroubleshootingBlock items={exercise.troubleshooting} />
      {exercise.deliverable && <InfoRow label="Deliverable">{exercise.deliverable}</InfoRow>}
      {exercise.keyLearning && <InfoRow label="Key learning">{exercise.keyLearning}</InfoRow>}
    </div>
  )
}

function CodeExercise({ exercise }) {
  return <ConceptExercise exercise={{ ...exercise, type: 'concept' }} />
}

function renderExerciseBody(exercise) {
  switch (exercise.type) {
    case 'prompt':
      return <PromptExercise exercise={exercise} />
    case 'prompt-lab':
      return <PromptLabExercise exercise={exercise} />
    case 'concept':
      return <ConceptExercise exercise={exercise} />
    case 'code':
      return <CodeExercise exercise={exercise} />
    default:
      return <PromptLabExercise exercise={exercise} />
  }
}

export default function ExerciseBlock({ exercise, accentColor }) {
  const [open, setOpen] = useState(false)

  if (!exercise) return null

  return (
    <div
      className="mt-8 rounded-xl border overflow-hidden"
      style={{ borderColor: accentColor ? `${accentColor}44` : 'var(--fde-bd)' }}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors"
        style={{
          background: accentColor ? `${accentColor}12` : 'var(--fde-card)',
          borderBottom: open ? `1px solid ${accentColor ? accentColor + '33' : 'var(--fde-bd)'}` : 'none',
        }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span
            className="shrink-0 text-sm font-bold px-2 py-0.5 rounded"
            style={{
              background: accentColor ? `${accentColor}22` : 'var(--fde-code-bg)',
              color: isAssignment(exercise) ? '#f0b429' : accentColor || '#35d49a',
            }}
          >
            {isAssignment(exercise) ? '📋 Assignment' : '🛠 Lab'}
          </span>
          <span className="text-sm font-semibold truncate" style={{ color: 'var(--fde-tx)' }}>
            {exercise.title}
          </span>
        </div>
        <span
          className="ml-4 shrink-0 text-lg leading-none transition-transform"
          style={{ color: 'var(--fde-mut)', transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}
        >
          ›
        </span>
      </button>

      {open && (
        <div className="px-5 py-6 sm:px-7" style={{ background: 'var(--fde-card)' }}>
          <div
            className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full mb-5 border"
            style={{
              borderColor: 'var(--fde-bd)',
              color: 'var(--fde-mut)',
              background: 'var(--fde-code-bg)',
            }}
          >
            <span>🤖</span>
            <span>{exerciseBadge(exercise)}</span>
          </div>
          {renderExerciseBody(exercise)}
        </div>
      )}
    </div>
  )
}
