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
    title: 'Lab 8: Todo discovery and BRD',
    duration: '12 min',
    prerequisites: ['AI Engineering foundation labs'],
    beforeYouStart: TUTOR_START,
    glossary: [
      ...GLOSSARY_COMMON,
      {
        term: 'BRD',
        meaning:
          'Business Requirements Document: what to build and why for Todo in this lab.',
      },
    ],
    labContext:
      'With your tutor, practice discovery and a one-page requirements doc for the small Todo app, not Customer support ticketing system yet.',
    whatYouLearn: [
    'Run structured discovery questions before you specify requirements.',
    'Write a one-page Todo BRD with fixed headings reviewers can scan quickly.',
    'Number functional requirements and user stories so they are testable.',
    'Reuse the same BRD pattern on the Customer support ticketing system assignment without copying…',
  ],
    prompts: [
      {
        step: 1,
        label: 'Discovery questions',
        whereToRun: 'AI tool',
        prompt: `## Context
This step is questions only. No BRD yet.

## Task
Write 12 open-ended discovery questions for the Todo app: 3 business, 3 technical, 3 users and 3 risks.

## Outcome
- Numbered list only.
- Each question ends with a question mark.`,
      },
      {
        step: 2,
        label: 'Todo BRD',
        whereToRun: 'AI tool',
        prompt: `## Context
This step turns the discovery questions into a one-page Todo BRD with fixed section headings.

## Task
Write a Todo BRD with these H2 sections: Overview, Functional Requirements, Non-Functional Requirements, User Stories and Conclusion.

## Outcome
- FR-01 through FR-05 for tasks: create, list, mark done, filter and delete.
- At least 6 user stories.
- Non-functional requirements in plain language.`,
      },
    ],
    acceptanceCriteria: [
      '12 discovery questions',
      'FR-01 style requirements',
      '6+ user stories',
    ],
    troubleshooting: [
      troubleshootingEntry(
        'Missing BRD section',
        'Wrong headings in BRD.',
        'Model skipped required H2 section headings.',
        'Rewrite the Todo BRD so it has exactly these H2 sections: Overview, Functional Requirements, Non-Functional Requirements, User Stories, Conclusion. Fill only missing sections.',
      ),
      troubleshootingEntry(
        'Vague requirements',
        'Requirements are not testable.',
        'Missing numbered functional requirement identifiers.',
        'Add numbered functional requirements FR-01 through FR-05 for Todo CRUD and filters, one sentence each.',
      ),
      troubleshootingEntry(
        'Stories without acceptance criteria',
        'User stories cannot be tested.',
        'User story prompt was too thin or lacked detail.',
        'For each user story, add 3 checkable acceptance bullets in plain language.',
      ),
    ],
  },

  'fde-sdlc-ui-ux-solution/lab-2-wireframe-ask-it': {
    track: 'todo',
    type: 'prompt-lab',
    title: 'Lab 9: Todo UI/UX brief',
    duration: '12 min',
    prerequisites: ['Todo BRD lab'],
    beforeYouStart: TUTOR_START,
    glossary: [
      ...GLOSSARY_COMMON,
      {
        term: 'Wireframe',
        meaning: 'Text layout of screens.',
      },
    ],
    labContext:
      'You will describe how the Todo task list looks and flows (add task, mark done, empty state) in a short UI brief.',
    whatYouLearn: [
    'Describe Todo screens (list, add, mark done) in a wireframe-style markdown brief.',
    'Include empty and error states, not only the happy path.',
    'Keep scope on the task-list app, with no chat or Customer support ticketing system flows in this…',
    'Produce a UI spec you can mirror for Customer support ticketing system in the assignment.',
  ],
    prompts: [
      {
        step: 1,
        label: 'UI brief',
        whereToRun: 'AI tool',
        prompt: `## Context
This step describes how the Todo task list looks and flows (add task, mark done, empty state) in a short UI brief.

## Task
Write a Todo UI brief with these H2 sections: Overview, Design System, Task List Design, User Flow, Empty States and Conclusion.

## Outcome
- Text description of the list, add and mark-done screens.
- Empty state when there are no tasks.
- Error state example.`,
      },
    ],
    acceptanceCriteria: [
      'Empty + error states',
      'Add and mark-done flows',
    ],
    troubleshooting: [
      troubleshootingEntry(
        'Missing section',
        'UI brief is missing a required section.',
        'Model skipped required H2 section headings.',
        'Rewrite the Todo UI brief so it has exactly these H2 sections: Overview, Design System, Task List Design, User Flow, Empty States, Conclusion. Fill only missing sections.',
      ),
      troubleshootingEntry(
        'No empty state',
        'Missing empty state description.',
        'Only happy path described without edge cases.',
        'Add empty state: "No tasks yet" and how the user adds the first task.',
      ),
      troubleshootingEntry(
        'Chat UI instead of task list',
        'Wrong application UI described.',
        'Customer support ticketing system bleed-through into Todo task-list prompt.',
        'Rewrite the UI brief strictly for the Todo task list (list, add, mark done), removing any chat or Customer support ticketing system interface elements.',
      ),
    ],
  },

  'fde-sdlc-architecture-solution/lab-3-diagram-tags-cost-and-adr': {
    track: 'todo',
    type: 'prompt-lab',
    title: 'Lab 10: Todo architecture and ADR',
    duration: '12 min',
    prerequisites: ['Todo UI lab'],
    beforeYouStart: TUTOR_START,
    glossary: [
      ...GLOSSARY_COMMON,
      {
        term: 'ADR',
        meaning: 'Architecture Decision Record: why we chose an approach.',
      },
    ],
    labContext:
      'You will sketch how Todo is built (browser → API → database) and record one architecture decision before coding.',
    whatYouLearn: [
    'Sketch Todo as React → FastAPI → SQLite with labeled API routes.',
    'Record an ADR that explains one real decision (e.g. auth deferred in v1).',
    'List components and data flow before writing production code.',
    'Use the same architecture discipline on Customer support ticketing system in your assignment.',
  ],
    prompts: [
      {
        step: 1,
        label: 'Architecture',
        whereToRun: 'AI tool',
        prompt: `## Context
This step sketches how Todo is built (browser → API → database) and records one architecture decision before coding.

## Task
Write Todo architecture notes: React → FastAPI → SQLite, API routes, and ADR-001 (auth optional in v1).

## Outcome
- Text diagram with labeled components.
- List GET/POST /tasks and /health.
- ADR-001: decision, consequence.`,
      },
    ],
    acceptanceCriteria: [
      'Text diagram',
      'GET/POST /tasks listed',
      'ADR-001 present',
    ],
    troubleshooting: [
      troubleshootingEntry(
        'No SQLite or API in diagram',
        'Architecture doc is too generic or missing stack components.',
        'Diagram lacks specific database or API details.',
        'Update the architecture diagram so it clearly shows React → FastAPI → SQLite and labels the /tasks and /health routes.',
      ),
      troubleshootingEntry(
        'ADR-001 missing',
        'No Architecture Decision Record found.',
        'Skipped ADR section in the document.',
        'Add ADR-001: decision (auth optional in v1) and consequence.',
      ),
      troubleshootingEntry(
        'Customer support ticketing system /ask flow included',
        'Wrong application context included.',
        'Customer support ticketing system bleed-through into Todo architecture.',
        'Remove any Customer support ticketing system or RAG /ask flows and keep the architecture strictly focused on the Todo app (React → FastAPI → SQLite).',
      ),
    ],
  },
}
