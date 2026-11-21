import { ASSIGNMENT_START, GLOSSARY_COMMON, troubleshootingEntry } from '../labShared'
import {
  INTRO_ASKIT_BRD,
  INTRO_ASKIT_UI,
  INTRO_ASKIT_ARCH,
  PROMPT_ASKIT_BRD,
  PROMPT_ASKIT_DISCOVERY_10,
  PROMPT_ASKIT_UIUX,
  PROMPT_ASKIT_ARCH,
  FIX_ASKIT_CORS,
  FIX_ASKIT_DB_HOST,
  FIX_ASKIT_VITE_URL,
  FIX_ASKIT_UI_TODO,
} from './promptAskIt'

function assignmentBase(extra) {
  return {
    track: 'assignment',
    type: 'prompt-lab',
    glossary: GLOSSARY_COMMON,
    beforeYouStart: ASSIGNMENT_START,
    ...extra,
  }
}

export const ASSIGNMENTS = {
  'fde-sdlc-business-requirement/one-page-brd-and-discovery-questions': assignmentBase({
    title: 'Assignment 8: Customer support ticketing system BRD and discovery questions',
    duration: '8 min',
    deliverable: 'One-page BRD and discovery notes',
    skillsFromLab: [
      'Todo lab: you drafted a smaller BRD for Todo.',
      'Do the full BRD for Customer support ticketing system on your own.',
    ],
    assignmentContext:
      'On your own: write Customer support ticketing system discovery and a BRD for the retail IT helper (staff vs admin, FAQs, triage).',
    whatYouLearn: [
    'Transfer the Todo BRD structure to Customer support ticketing system without copying Todo features.',
    'Cover staff vs admin and triage in requirements.',
  ],
    prompts: [
      {
        step: 1,
        label: 'Customer support ticketing system BRD',
        whereToRun: 'AI tool',
        prompt: `## Context
Customer support ticketing system (your assignment):
- Retail IT helper: RAG on FAQs, POST /ask, POST /triage, staff vs admin RBAC
- Build in your own repo; submit artifacts to your tutor

This step is done on your own: write the Customer support ticketing system BRD for the retail IT helper (staff vs admin, FAQs, triage).

## Task
Write the Customer support ticketing system BRD with these H2 sections: Overview, Functional Requirements, Non-Functional Requirements, User Stories and Conclusion.

## Outcome
- Staff vs admin rules.
- RAG on FAQs and ticket triage.
- Pilot store constraints.`,
      },
      {
        step: 2,
        label: 'Discovery questions',
        whereToRun: 'AI tool',
        prompt: `## Context
Customer support ticketing system (your assignment):
- Retail IT helper: RAG on FAQs, POST /ask, POST /triage, staff vs admin RBAC
- Build in your own repo; submit artifacts to your tutor

This is the second step: discovery questions for Customer support ticketing system sponsors and store IT.

## Task
List 10 discovery questions covering RBAC, FAQs, escalation and pilot stores.

## Outcome
- Numbered questions only.`,
      },
    ],
    acceptanceCriteria: [
      'BRD mentions staff vs admin.',
      '10 discovery questions cover security and pilot.',
    ],
    troubleshooting: [],
  }),

  'fde-sdlc-ui-ux-solution/revise-the-flow-and-wireframes': assignmentBase({
    title: 'Assignment 9: Customer support ticketing system UI/UX pack',
    duration: '8 min',
    skillsFromLab: [
      'Todo lab: UI brief for task list.',
      'Same structure for Customer support ticketing system chat UI.',
    ],
    assignmentContext:
      'On your own: describe Customer support ticketing system chat UI (roles, citations and escalation), not the Todo task list.',
    whatYouLearn: [
    'Describe Customer support ticketing system chat, roles, citations, and escalation in a UI brief.',
    'Keep headings consistent with the Todo lab discipline.',
  ],
    prompts: [
      {
        step: 1,
        label: 'UI brief',
        whereToRun: 'AI tool',
        prompt: `## Context
This step is done on your own: describe the Customer support ticketing system chat UI (roles, citations and escalation), not the Todo task list.

## Task
Write the Customer support ticketing system UI brief with these H2 sections: Overview, Design System, Chat Interface Design, User Experience Flow, Navigation Flow and Conclusion.

## Outcome
- Staff/admin toggle.
- Citation chips on answers.
- Escalate to ticket state.`,
      },
    ],
    acceptanceCriteria: [
      'Escalation flow described',
      'No Todo task list UI',
    ],
    troubleshooting: [
      troubleshootingEntry(
        'Todo task list wireframe',
        'Draft describes the Todo task list instead of Customer support ticketing system chat.',
        'Accidentally used Todo task list patterns rather than Customer support ticketing system chat interface.',
        'Rewrite the UI brief strictly for Customer support ticketing system chat (staff and admin roles, citations, escalation to tickets), removing all Todo task-list elements.',
      ),
    ],
  }),

  'fde-sdlc-architecture-solution/update-the-architecture-pack': assignmentBase({
    title: 'Assignment 10: Customer support ticketing system architecture pack',
    duration: '8 min',
    deliverable: 'Architecture diagram, FAQ permission model, cost estimate and ADR',
    skillsFromLab: [
      'Todo lab: simple system diagram.',
      'Customer support ticketing system needs API, RAG, RBAC, deploy notes.',
    ],
    assignmentContext:
      'On your own: architecture for Customer support ticketing system aligned to your BRD (API, RAG, RBAC, security).',
    whatYouLearn: [
    'Align architecture to BRD.',
    'Call out security before the LLM runs.',
  ],
    prompts: [
      {
        step: 1,
        label: 'Architecture',
        whereToRun: 'AI tool',
        prompt: `## Context
This step is done on your own: architecture for Customer support ticketing system aligned to your BRD (API, RAG, RBAC, security).

## Task
Write the Customer support ticketing system architecture with these H2 sections: Overview, System Architecture, Database Design, API Design, AI Integration Architecture, Security Architecture and Conclusion.

## Outcome
- Text diagrams OK.
- RBAC before LLM.
- FAQ retrieval before generation.`,
      },
    ],
    acceptanceCriteria: [
      'Security section mentions FAQ filter before LLM.',
    ],
    troubleshooting: [],
  }),

  'development-backend/startup-instructions-and-tests': assignmentBase({
    title: 'Assignment 11: Customer support ticketing system startup + tests',
    duration: '85 min',
    skillsFromLab: [
      'Todo lab: you built and ran Todo locally.',
      'Repeat for Customer support ticketing system in your repo.',
    ],
    assignmentContext:
      'On your own: how to run Customer support ticketing system locally and a short manual test plan.',
    whatYouLearn: [
    'Local run and manual test plan for Customer support ticketing system.',
    'Same loop as Todo, different app.',
  ],
    prompts: [
      {
        step: 1,
        label: 'Local run',
        whereToRun: 'AI tool',
        prompt: `## Context
This step is done on your own: how to run Customer support ticketing system locally and a short manual test plan.

## Task
Write local run steps for Customer support ticketing system in README-RUN.md: API + React chat (mirror the discipline from your Todo README).

## Outcome
- Start commands.
- Verify /health and POST /ask as staff.`,
      },
      {
        step: 2,
        label: 'Test plan',
        whereToRun: 'AI tool',
        prompt: `## Context
After the local run works, document how Customer support ticketing system will be tested manually.

## Task
Write a test plan in TEST-PLAN.md with 5 manual tests: /health, staff /ask, admin FAQ, triage and RBAC negative case.

## Outcome
- Steps and expected result for each test.`,
      },
    ],
    acceptanceCriteria: [
      'You ran tests locally.',
      'Staff cannot see admin-only content in your notes.',
    ],
    troubleshooting: [
      troubleshootingEntry('CORS or fetch errors', 'Browser cannot reach API.', 'Wrong URL or CORS.', FIX_ASKIT_CORS),
    ],
  }),

  'development-frontend/fix-a-failed-test-and-rerun': assignmentBase({
    title: 'Assignment 12: Fix failing Customer support ticketing system test',
    duration: '75 min',
    skillsFromLab: [
      'Todo lab: fix prompt when tests failed. Do the same on Customer support ticketing system.',
    ],
    assignmentContext:
      'Document symptom, fix prompt, and pass/fail after rerun in failure-fix-log.md.',
    whatYouLearn: [
    'Prompt → fail → fix prompt → run again.',
  ],
    prompts: [
      {
        step: 1,
        label: 'Fix one failing test',
        whereToRun: 'AI tool',
        prompt: `## Context
This step is done independently on the Customer support ticketing system project. One failing test from TEST-PLAN.md is fixed with a fix prompt, then rerun until it passes.

## Task
Pick one failing test. Paste the full error. Ask for the smallest code fix only, with no unrelated changes.

## Outcome
failure-fix-log.md holds the symptom in one line, the fix prompt used, the fix applied, and pass or fail after rerun.`,
      },
    ],
    acceptanceCriteria: [
      'The log includes the fix used.',
      'The test passes after the fix.',
    ],
    troubleshooting: [],
  }),

  'deployment/staging-checklist-and-pilot-plan': assignmentBase({
    title: 'Assignment 13: Customer support ticketing system local + Docker + Render',
    duration: '20 min',
    skillsFromLab: [
      'Todo lab: local → Docker → Render POC.',
      'Mirror for Customer support ticketing system on your own.',
    ],
    assignmentContext:
      'On your own: local run, Docker, and Render POC for Customer support ticketing system—same path you practiced on Todo.',
    whatYouLearn: [
    'End-to-end deploy evidence for Customer support ticketing system pilot.',
  ],
    prompts: [
      {
        step: 1,
        label: 'Local',
        whereToRun: 'AI tool',
        prompt: `## Context
On your own: how to run Customer support ticketing system locally and a short manual test plan. Customer support ticketing system has an API and a React chat.

## Task
Write local run steps for Customer support ticketing system: API + React chat (mirror the discipline from your Todo README).

## Outcome
- Start commands
- Verify /health and POST /ask as staff`,
      },
      {
        step: 2,
        label: 'Docker',
        whereToRun: 'AI tool',
        prompt: `## Context
Docker step in the Customer support ticketing system deploy assignment. Inside containers, the database is reached by its service name, not localhost.

## Task
Plan Docker for Customer support ticketing system: API, web, Postgres. Use service name postgres in DATABASE_URL—not localhost inside containers.

## Outcome
- Services to define
- How to verify docker compose up
- DATABASE_URL pattern`,
      },
      {
        step: 3,
        label: 'Render POC',
        whereToRun: 'AI tool',
        prompt: `## Context
Render POC step for Customer support ticketing system. The deployed app needs a public URL.

## Task
Draft Render POC config and smoke checklist for Customer support ticketing system public URL.

## Outcome
- /health green on Render
- Frontend build uses production API URL, not localhost`,
      },
    ],
    acceptanceCriteria: [
      'Docker steps documented.',
      'Public URL or pilot plan note with smoke test.',
    ],
    troubleshooting: [
      troubleshootingEntry(
        'Compose DB connection fails',
        'API uses localhost in container.',
        'Wrong DATABASE_URL.',
        FIX_ASKIT_DB_HOST,
      ),
      troubleshootingEntry(
        'Live UI calls localhost:8000',
        'Missing production API URL at build.',
        'VITE_API_URL.',
        FIX_ASKIT_VITE_URL,
      ),
    ],
  }),

  'deployment/runbook-and-pre-rollout-checklist': assignmentBase({
    title: 'Assignment 14: Customer support ticketing system runbook + rollout checklist',
    duration: '8 min',
    deliverable:
      'Deployment evidence, logging notes, and a one-page runbook for Customer support ticketing system',
    skillsFromLab: [
      'Todo Render POC taught smoke URLs.',
      'Production runbook is Customer support ticketing system specific.',
    ],
    assignmentContext:
      'On your own: operations runbook and pre-rollout checklist for Customer support ticketing system.',
    whatYouLearn: [
    'Ops docs are written with prompts too.',
  ],
    prompts: [
      {
        step: 1,
        label: 'Runbook',
        whereToRun: 'AI tool',
        prompt: `## Context
On your own: operations runbook and pre-rollout checklist for Customer support ticketing system.

## Task
Write Customer support ticketing system runbook: health, three incidents (429, slow RAG, RBAC leak), rollback, escalation.

## Outcome
- Plain numbered steps
- Use your real service names
- No secrets in the doc`,
      },
    ],
    acceptanceCriteria: ['Rollback steps included.', 'No secrets in the doc.'],
    troubleshooting: [],
  }),

  'enterprise-ai-fde/handover-package-and-sponsor-readout': assignmentBase({
    title: 'Assignment 15: Customer support ticketing system handover + sponsor readout',
    duration: '25 min',
    deliverable:
      'Security questionnaire evidence, trace/eval snapshot, README, architecture diagram, runbook, and a five-minute sponsor readout script for Customer support ticketing system.',
    skillsFromLab: [
      'You traced and deployed Customer support ticketing system.',
      'Package it for the sponsor.',
    ],
    assignmentContext:
      'On your own: handover package and sponsor readout for Customer support ticketing system.',
    whatYouLearn: [
    'Close the engagement with a readable handover.',
  ],
    prompts: [
      {
        step: 1,
        label: 'Handover',
        whereToRun: 'AI tool',
        prompt: `## Context
On your own: handover package and sponsor readout for Customer support ticketing system.

## Task
Write Customer support ticketing system handover plus 5 sponsor bullets (goal, shipped, RBAC, observability, limits).

## Outcome
- Non-technical bullets at top
- Known limits listed
- POC or production URLs`,
      },
    ],
    acceptanceCriteria: [
      'Known limits listed.',
      'URLs are POC/production not localhost.',
    ],
    troubleshooting: [],
  }),
}
