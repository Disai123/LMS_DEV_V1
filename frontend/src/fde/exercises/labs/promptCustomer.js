import { ASK_IT_CONTEXT, TODO_CONTEXT, compactPrompt } from '../labShared'

/** Context → Task → Output for Stages 3–9 (no Stop line). */
export function todoPrompt(stepIntro, task, output) {
  const context = stepIntro
    ? `${TODO_CONTEXT}\n\n## What you are doing\n${stepIntro}`
    : TODO_CONTEXT
  return compactPrompt({ context, task, output, stop: '' })
}

export function askItPrompt(stepIntro, task, output) {
  const context = stepIntro
    ? `${ASK_IT_CONTEXT}\n\n## What you are doing\n${stepIntro}`
    : ASK_IT_CONTEXT
  return compactPrompt({ context, task, output, stop: '' })
}
