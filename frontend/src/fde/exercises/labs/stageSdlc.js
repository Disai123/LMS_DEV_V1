import { TUTOR_START, GLOSSARY_COMMON, troubleshootingEntry } from '../labShared'
import { PROMPT_TODO_DISCOVERY, PROMPT_TODO_BRD, PROMPT_TODO_UIUX, PROMPT_TODO_ARCH } from './promptCompact'

const TODO_BRD_H2 =
  'Overview, Functional Requirements, Non-Functional Requirements, User Stories, Conclusion'

const todoBrdSample = `BRD — Todo (sample excerpt)

## Overview
Simple task list for personal and team use.

## Functional Requirements
FR-01 Create task FR-02 Mark done FR-03 List/filter FR-04 Delete FR-05 Health check

## Non-Functional Requirements
NFR-01 Response < 500ms local NFR-02 Validate input

## User Stories
US-01 As a user I add a task...

## Conclusion
Next: UI brief.`

export const stageSdlcLabs = {
  'fde-sdlc-business-requirement/lab-1-discovery-and-brd': {
    track: 'todo',
    type: 'prompt-lab',
    title: 'Lab: Todo discovery + BRD',
    duration: '60 min',
    prerequisites: ['AI Engineering through Lab 3'],
    beforeYouStart: TUTOR_START,
    glossary: [
      ...GLOSSARY_COMMON,
      { term: 'BRD', meaning: 'What to build and why—for Todo in this lab.' },
    ],
    objective: 'discovery.md + Todo BRD.md with exact H2 order.',
    scenario: 'Tutor workshop → Todo BRD.',
    prompts: [
      {
        step: 1,
        label: 'Discovery',
        whereToRun: 'AI tool',
        prompt: PROMPT_TODO_DISCOVERY,
        checkpoint: '12 questions in discovery.md.',
      },
      {
        step: 2,
        label: 'BRD',
        whereToRun: 'AI tool',
        prompt: PROMPT_TODO_BRD,
        checkpoint: `BRD.md has H2: ${TODO_BRD_H2}.`,
      },
    ],
    acceptanceCriteria: ['12 questions', 'FR-01 style requirements', '6+ user stories'],
    troubleshooting: [
      troubleshootingEntry(
        'Missing BRD section',
        'Wrong headings.',
        'Model skipped H2.',
        `Rewrite BRD.md with exact H2 order: ${TODO_BRD_H2}. Fill gaps only.`,
      ),
      troubleshootingEntry(
        'Vague requirements',
        'Not testable.',
        'No FR numbers.',
        'FR-01..FR-05 for Todo CRUD and filters; one sentence each.',
      ),
      troubleshootingEntry(
        'Stories without acceptance criteria',
        'Cannot test.',
        'Prompt too thin.',
        'Each story: 3 checkable acceptance bullets.',
      ),
    ],
    deliverable: 'discovery.md + BRD.md',
    whatYouLearn: [
      'Run structured discovery questions before you specify requirements.',
      'Write a one-page Todo BRD with fixed headings reviewers can scan quickly.',
      'Number functional requirements and user stories so they are testable.',
      'Reuse the same BRD pattern on the Ask IT assignment without copying Todo features.',
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
    objective: 'UI_UX.md for Todo task list.',
    scenario: 'Describe list, add, done states.',
    prompts: [
      {
        step: 1,
        label: 'UI/UX',
        whereToRun: 'AI tool',
        prompt: PROMPT_TODO_UIUX,
        checkpoint: 'All 6 H2 sections present.',
      },
    ],
    acceptanceCriteria: ['Empty + error states', 'Add and mark-done flows'],
    troubleshooting: [
      troubleshootingEntry(
        'Missing Task List Design H2',
        'Wrong outline.',
        'Skipped section.',
        'Rewrite UI_UX.md with required 6 H2s; fill Task List Design.',
      ),
      troubleshootingEntry(
        'No empty state',
        'Bad UX spec.',
        'Happy path only.',
        'Add empty state: "No tasks yet" + add button.',
      ),
      troubleshootingEntry(
        'Written for chat UI not Todo list',
        'Wrong app.',
        'Ask IT bleed-through.',
        'Todo task list only; no chat citations.',
      ),
    ],
    deliverable: 'UI_UX.md',
    whatYouLearn: [
      'Describe Todo screens (list, add, mark done) in a wireframe-style markdown brief.',
      'Include empty and error states, not only the happy path.',
      'Keep scope on the task-list app—no chat or Ask IT flows in this lab.',
      'Produce a UI spec you can mirror for Ask IT in the assignment.',
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
    objective: 'ARCHITECTURE.md for Todo with ADR-001.',
    scenario: 'React → FastAPI → SQLite before coding.',
    prompts: [
      {
        step: 1,
        label: 'Architecture',
        whereToRun: 'AI tool',
        prompt: PROMPT_TODO_ARCH,
        checkpoint: 'ADR-001 mentions v1 auth optional.',
      },
    ],
    acceptanceCriteria: ['Text diagram', 'GET/POST /tasks listed'],
    troubleshooting: [
      troubleshootingEntry(
        'No SQLite or API in diagram',
        'Too generic.',
        'Missing stack.',
        'Diagram: React → FastAPI → SQLite; label /tasks routes.',
      ),
      troubleshootingEntry(
        'ADR-001 missing',
        'No decision recorded.',
        'Skipped ADR.',
        'ADR-001: optional auth in v1; consequence noted.',
      ),
      troubleshootingEntry(
        'Ask IT /ask flow included',
        'Wrong system.',
        'Context leak.',
        'Todo architecture only; remove RAG/triage.',
      ),
    ],
    deliverable: 'ARCHITECTURE.md',
    whatYouLearn: [
      'Sketch Todo as React → FastAPI → SQLite with labeled API routes.',
      'Record an ADR that explains one real decision (e.g. auth deferred in v1).',
      'List components and data flow before writing production code.',
      'Use the same architecture discipline on Ask IT in your assignment.',
    ],
  },
}
