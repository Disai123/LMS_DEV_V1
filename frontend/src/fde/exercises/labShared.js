/** Shared copy for FDE labs (Todo, tutor) and assignments (Ask IT, solo). */

export const BADGE_LAB = 'Todo · Tutored lab'
export const BADGE_ASSIGNMENT = 'Ask IT · On your own'
/** @deprecated use BADGE_LAB or BADGE_ASSIGNMENT */
export const BADGE_LABEL = BADGE_LAB

export const TUTOR_START =
  'Work **with your tutor**. Do **one step at a time**. Pass each checkpoint before opening the next prompt. If something breaks, expand **Troubleshooting** and paste the fix prompt—do not skip ahead.'

export const ASSIGNMENT_START =
  'You are **on your own** (no tutor). Read **Skills from the lab** first, then use the same prompt → checkpoint → fix loop. Run everything in **your Ask IT repo** on your laptop.'

/** Hide generic opener when the exercise panel already explains the loop. */
export function stripGenericBeforeYouStart(text) {
  if (!text || typeof text !== 'string') return null
  const trimmed = text.trim()
  if (trimmed === TUTOR_START || trimmed === ASSIGNMENT_START) return null
  if (trimmed.startsWith(TUTOR_START)) {
    const rest = trimmed.slice(TUTOR_START.length).trim()
    return rest || null
  }
  if (trimmed.startsWith(ASSIGNMENT_START)) {
    const rest = trimmed.slice(ASSIGNMENT_START.length).trim()
    return rest || null
  }
  return trimmed
}

export const TODO_ONE_LINER =
  'A small Todo app: add tasks, mark done, filter by status—FastAPI + SQLite + simple React or CLI.'

export const ASK_IT_ONE_LINER =
  'Ask IT helps store staff with IT FAQs, respects staff vs admin access, and opens tickets when unsure.'

export const GLOSSARY_COMMON = [
  { term: 'Prompt', meaning: 'Instructions you give an AI tool so it knows what to create or fix.' },
  { term: 'API', meaning: 'How two programs talk over the network—like sending an order to the kitchen.' },
  { term: 'Artifact', meaning: 'A file or screenshot that proves a step worked (e.g. BRD.md).' },
]

export const GLOSSARY_DOCKER = [
  { term: 'Docker', meaning: 'Runs your app in a portable box so it behaves the same on every computer.' },
  { term: 'Container', meaning: 'A running copy of your app from a Docker image.' },
  { term: 'docker compose', meaning: 'Starts API + UI + database together from one file.' },
]

export function troubleshootingEntry(symptom, whatItMeans, likelyCause, fixPrompt) {
  return { symptom, whatItMeans, likelyCause, fixPrompt }
}

/** First prompt in a Todo lab only — keep short. */
export const TODO_CONTEXT = `## Todo app (practice project)
- Tasks: title, done/open, optional due date
- API: GET/POST /tasks, PATCH /tasks/{id}, GET /health
- Stack: Python 3.11 FastAPI, SQLite, optional Vite React UI`

/** First prompt in an Ask IT assignment only — keep short. */
export const ASK_IT_CONTEXT = `## Ask IT (your assignment)
- Retail IT helper: RAG on FAQs, POST /ask, POST /triage, staff vs admin RBAC
- Build in your own repo; submit artifacts to your tutor`

export const AUDIENCE_BEGINNER = `Write for a beginner. Short sentences.`

export const PROMPT_STOP = `**Stop:** Do only what this step asks. No extra features.`

export function compactPrompt({ context, task, output, stop = PROMPT_STOP }) {
  const parts = []
  if (context) parts.push(context)
  parts.push(`## Task\n${task}`)
  parts.push(`## Output\n${output}`)
  parts.push(stop)
  return parts.join('\n\n')
}

export function stopAfterFiles(filenames) {
  return `**Stop:** Deliver only these files (full contents): ${filenames}. Then list filenames and stop.`
}

export function stopAfterMarkdown(filename, requiredH2) {
  return `**Stop:** One markdown file **${filename}** with H2 sections: ${requiredH2}. No code. Then stop.`
}

/** Legacy — avoid on new prompts */
export const PROMPT_QUALITY_RULES = PROMPT_STOP
export const ASK_IT_CONTEXT_LEGACY = ASK_IT_CONTEXT
