import { TUTOR_START, GLOSSARY_COMMON, troubleshootingEntry } from '../labShared'
import {
  INTRO_TODO_LAB1,
  INTRO_TODO_LAB2,
  INTRO_TODO_LAB3,
  PROMPT_TODO_DISCOVERY,
  PROMPT_TODO_BRD,
  PROMPT_TODO_UIUX,
  PROMPT_TODO_ARCH,
  FIX_TODO_BRD_SECTIONS,
  FIX_TODO_BRD_FR,
  FIX_TODO_UI_H2,
  FIX_TODO_ARCH,
} from './promptTodo'

export const stageSdlcLabs = {
  'fde-sdlc-business-requirement/lab-1-discovery-and-brd': {
    track: 'todo',
    type: 'prompt-lab',
    title: 'Lab: Todo discovery + BRD',
    duration: '60 min',
    prerequisites: ['AI Engineering foundation labs'],
    beforeYouStart: TUTOR_START,
    glossary: [...GLOSSARY_COMMON, { term: 'BRD', meaning: 'What to build and why—for Todo in this lab.' }],
    labContext: INTRO_TODO_LAB1,
    whatYouLearn: [
      'Run structured discovery questions before you specify requirements.',
      'Write a one-page Todo BRD with fixed headings reviewers can scan quickly.',
      'Number functional requirements and user stories so they are testable.',
      'Reuse the same BRD pattern on the Ask IT assignment without copying Todo features.',
    ],
    prompts: [
      { step: 1, label: 'Discovery questions', whereToRun: 'AI tool', prompt: PROMPT_TODO_DISCOVERY },
      { step: 2, label: 'Todo BRD', whereToRun: 'AI tool', prompt: PROMPT_TODO_BRD },
    ],
    acceptanceCriteria: ['12 discovery questions', 'FR-01 style requirements', '6+ user stories'],
    troubleshooting: [
      troubleshootingEntry('Missing BRD section', 'Wrong headings.', 'Model skipped H2.', FIX_TODO_BRD_SECTIONS),
      troubleshootingEntry('Vague requirements', 'Not testable.', 'No FR numbers.', FIX_TODO_BRD_FR),
      troubleshootingEntry(
        'Stories without acceptance criteria',
        'Cannot test.',
        'Prompt too thin.',
        'Each user story: 3 checkable acceptance bullets in plain language.',
      ),
    ],
  },

  'fde-sdlc-ui-ux-solution/lab-2-wireframe-ask-it': {
    track: 'todo',
    type: 'prompt-lab',
    title: 'Lab: Todo UI/UX brief',
    duration: '45 min',
    prerequisites: ['Todo BRD lab'],
    beforeYouStart: TUTOR_START,
    glossary: [...GLOSSARY_COMMON, { term: 'Wireframe', meaning: 'Text layout of screens.' }],
    labContext: INTRO_TODO_LAB2,
    whatYouLearn: [
      'Describe Todo screens (list, add, mark done) in a wireframe-style markdown brief.',
      'Include empty and error states, not only the happy path.',
      'Keep scope on the task-list app—no chat or Ask IT flows in this lab.',
      'Produce a UI spec you can mirror for Ask IT in the assignment.',
    ],
    prompts: [{ step: 1, label: 'UI brief', whereToRun: 'AI tool', prompt: PROMPT_TODO_UIUX }],
    acceptanceCriteria: ['Empty + error states', 'Add and mark-done flows'],
    troubleshooting: [
      troubleshootingEntry('Missing section', 'Wrong outline.', 'Skipped section.', FIX_TODO_UI_H2),
      troubleshootingEntry(
        'No empty state',
        'Bad UX spec.',
        'Happy path only.',
        'Add empty state: "No tasks yet" and how the user adds the first task.',
      ),
      troubleshootingEntry(
        'Chat UI instead of task list',
        'Wrong app.',
        'Ask IT bleed-through.',
        FIX_TODO_UI_H2,
      ),
    ],
  },

  'fde-sdlc-architecture-solution/lab-3-diagram-tags-cost-and-adr': {
    track: 'todo',
    type: 'prompt-lab',
    title: 'Lab: Todo architecture + ADR-001',
    duration: '50 min',
    prerequisites: ['Todo UI lab'],
    beforeYouStart: TUTOR_START,
    glossary: [...GLOSSARY_COMMON, { term: 'ADR', meaning: 'Why we chose an approach.' }],
    labContext: INTRO_TODO_LAB3,
    whatYouLearn: [
      'Sketch Todo as React → FastAPI → SQLite with labeled API routes.',
      'Record an ADR that explains one real decision (e.g. auth deferred in v1).',
      'List components and data flow before writing production code.',
      'Use the same architecture discipline on Ask IT in your assignment.',
    ],
    prompts: [{ step: 1, label: 'Architecture', whereToRun: 'AI tool', prompt: PROMPT_TODO_ARCH }],
    acceptanceCriteria: ['Text diagram', 'GET/POST /tasks listed', 'ADR-001 present'],
    troubleshooting: [
      troubleshootingEntry('No SQLite or API in diagram', 'Too generic.', 'Missing stack.', FIX_TODO_ARCH),
      troubleshootingEntry(
        'ADR-001 missing',
        'No decision recorded.',
        'Skipped ADR.',
        'Add ADR-001: optional auth in v1 and one consequence.',
      ),
      troubleshootingEntry('Ask IT /ask flow included', 'Wrong system.', 'Context leak.', FIX_TODO_ARCH),
    ],
  },
}
