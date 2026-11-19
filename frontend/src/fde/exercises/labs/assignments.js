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
    title: 'Assignment 8: Ask IT BRD and discovery questions',
    duration: '8 min',
    deliverable: 'One-page BRD and discovery notes',
    skillsFromLab: [
      'Todo lab: you drafted a smaller BRD for Todo.',
      'Do the full BRD for Ask IT on your own.',
    ],
    assignmentContext:
      'On your own: write Ask IT discovery and a BRD for the retail IT helper (staff vs admin, FAQs, triage).',
    whatYouLearn: [
      'Transfer the Todo BRD structure to Ask IT without copying Todo features.',
      'Cover staff vs admin and triage in requirements.',
    ],
    prompts: [
      {
        step: 1,
        label: 'Ask IT BRD',
        whereToRun: 'AI tool',
        prompt: `## Context
Ask IT (your assignment):
- Retail IT helper: RAG on FAQs, POST /ask, POST /triage, staff vs admin RBAC
- Build in your own repo; submit artifacts to your tutor

This step is done on your own: write the Ask IT BRD for the retail IT helper (staff vs admin, FAQs, triage).

## Task
Write the Ask IT BRD with these H2 sections: Overview, Functional Requirements, Non-Functional Requirements, User Stories and Conclusion.

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
Ask IT (your assignment):
- Retail IT helper: RAG on FAQs, POST /ask, POST /triage, staff vs admin RBAC
- Build in your own repo; submit artifacts to your tutor

This is the second step: discovery questions for Ask IT sponsors and store IT.

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
    title: 'Assignment 9: Ask IT UI/UX pack',
    duration: '8 min',
    skillsFromLab: [
      'Todo lab: UI brief for task list.',
      'Same structure for Ask IT chat UI.',
    ],
    assignmentContext:
      'On your own: describe Ask IT chat UI (roles, citations and escalation), not the Todo task list.',
    whatYouLearn: [
      'Describe Ask IT chat, roles, citations, and escalation in a UI brief.',
      'Keep headings consistent with the Todo lab discipline.',
    ],
    prompts: [
      {
        step: 1,
        label: 'UI brief',
        whereToRun: 'AI tool',
        prompt: `## Context
This step is done on your own: describe the Ask IT chat UI (roles, citations and escalation), not the Todo task list.

## Task
Write the Ask IT UI brief with these H2 sections: Overview, Design System, Chat Interface Design, User Experience Flow, Navigation Flow and Conclusion.

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
        'Draft describes the Todo task list instead of Ask IT chat.',
        'Accidentally used Todo task list patterns rather than Ask IT chat interface.',
        'Rewrite the UI brief strictly for Ask IT chat (staff and admin roles, citations, escalation to tickets), removing all Todo task-list elements.',
      ),
    ],
  }),

  'fde-sdlc-architecture-solution/update-the-architecture-pack': assignmentBase({
    title: 'Assignment 10: Ask IT architecture pack',
    duration: '8 min',
    deliverable: 'Architecture diagram, FAQ permission model, cost estimate and ADR',
    skillsFromLab: [
      'Todo lab: simple system diagram.',
      'Ask IT needs API, RAG, RBAC, deploy notes.',
    ],
    assignmentContext:
      'On your own: architecture for Ask IT aligned to your BRD (API, RAG, RBAC, security).',
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
This step is done on your own: architecture for Ask IT aligned to your BRD (API, RAG, RBAC, security).

## Task
Write the Ask IT architecture with these H2 sections: Overview, System Architecture, Database Design, API Design, AI Integration Architecture, Security Architecture and Conclusion.

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

  'development/startup-instructions-and-tests': assignmentBase({
    title: 'Assignment 11: Ask IT startup + tests',
    duration: '85 min',
    skillsFromLab: [
      'Todo lab: you built and ran Todo locally.',
      'Repeat for Ask IT in your repo.',
    ],
    assignmentContext:
      'On your own: how to run Ask IT locally and a short manual test plan.',
    whatYouLearn: [
      'Local run and manual test plan for Ask IT.',
      'Same loop as Todo, different app.',
    ],
    prompts: [
      {
        step: 1,
        label: 'Local run',
        whereToRun: 'AI tool',
        prompt: `## Context
This step is done on your own: how to run Ask IT locally and a short manual test plan.

## Task
Write local run steps for Ask IT in README-RUN.md: API + React chat (mirror the discipline from your Todo README).

## Outcome
- Start commands.
- Verify /health and POST /ask as staff.`,
      },
      {
        step: 2,
        label: 'Test plan',
        whereToRun: 'AI tool',
        prompt: `## Context
After the local run works, document how Ask IT will be tested manually.

## Task
Write a test plan in TEST-PLAN.md with 5 manual tests: /health, staff /ask, admin FAQ, triage and RBAC negative case.

## Outcome
- Steps and expected result for each test.`,
      },
    ],
    executionSteps: [
      '**[Antigravity]** Paste the Step 1 prompt and send it.\n\n*Outcome:* `README-RUN.md` appears in the repo (Checkpoint 1).',
      '**[Manual]** Follow `README-RUN.md` to start the API and the React chat, then check `/health` and send a `POST /ask` as staff.\n\n*Outcome:* `/health` returns ok, `POST /ask` as staff returns an answer, and the chat page loads (Checkpoint 2).',
      '**[Antigravity]** Paste the Step 2 prompt and send it.\n\n*Outcome:* `TEST-PLAN.md` appears with 5 tests, each with steps and an expected result.',
      '**[Manual]** Run the 5 tests locally and write pass or fail next to each one in `TEST-PLAN.md`.\n\n*Outcome:* Every test has a result, and the RBAC negative test shows that staff cannot see admin-only content (Checkpoint 3).',
      '**[Antigravity]** Only if a step above showed an error: paste the full error and ask for the smallest possible fix, then repeat the step that failed.\n\n*Outcome:* The local run and the tests work as described.',
    ],
    acceptanceCriteria: [
      'You ran tests locally.',
      'Staff cannot see admin-only content in your notes.',
    ],
    troubleshooting: [
      troubleshootingEntry('CORS or fetch errors', 'Browser cannot reach API.', 'Wrong URL or CORS.', FIX_ASKIT_CORS),
    ],
  }),

  'development/fix-a-failed-test-and-rerun': assignmentBase({
    title: 'Assignment 12: Fix failing Ask IT test',
    duration: '75 min',
    skillsFromLab: [
      'Todo lab: fix prompt when tests failed. Do the same on Ask IT.',
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
This step is done independently on the Ask IT project. One failing test from TEST-PLAN.md is fixed with a fix prompt, then rerun until it passes.

## Task
Pick one failing test. Paste the full error. Ask for the smallest code fix only, with no unrelated changes.

## Outcome
failure-fix-log.md holds the symptom in one line, the fix prompt used, the fix applied, and pass or fail after rerun.`,
      },
    ],
    executionSteps: [
      '**[Manual] Find a failing test**\nRun the tests listed in TEST-PLAN.md and pick one that fails.\n\n*Outcome:* One failing test and its full error (Checkpoint: the error text is copied in full).',
      '**[Antigravity] Apply the fix**\nPaste the Step 1 prompt together with the error.\n\n*Outcome:* A small code fix is applied.',
      '**[Manual] Rerun the test**\nRun the same test again. If it still fails, repeat step 2 with the new error.\n\n*Outcome:* The test passes (Checkpoint: the same test now passes).',
      '**[Manual] Write the log**\nCreate failure-fix-log.md with the symptom, fix prompt, fix and result.\n\n*Outcome:* Log file is complete.',
    ],
    acceptanceCriteria: [
      'The log includes the fix used.',
      'The test passes after the fix.',
    ],
    troubleshooting: [],
  }),

  'mvp-poc-local-render/staging-checklist-and-pilot-plan': assignmentBase({
    title: 'Assignment 13: Ask IT local + Docker + Render',
    duration: '20 min',
    skillsFromLab: [
      'Todo lab: local → Docker → Render POC.',
      'Mirror for Ask IT on your own.',
    ],
    assignmentContext:
      'On your own: local run, Docker, and Render POC for Ask IT—same path you practiced on Todo.',
    whatYouLearn: ['End-to-end deploy evidence for Ask IT pilot.'],
    prompts: [
      {
        step: 1,
        label: 'Local',
        whereToRun: 'AI tool',
        prompt: `## Context
On your own: how to run Ask IT locally and a short manual test plan. Ask IT has an API and a React chat.

## Task
Write local run steps for Ask IT: API + React chat (mirror the discipline from your Todo README).

## Outcome
- Start commands
- Verify /health and POST /ask as staff`,
      },
      {
        step: 2,
        label: 'Docker',
        whereToRun: 'AI tool',
        prompt: `## Context
Docker step in the Ask IT deploy assignment. Inside containers, the database is reached by its service name, not localhost.

## Task
Plan Docker for Ask IT: API, web, Postgres. Use service name postgres in DATABASE_URL—not localhost inside containers.

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
Render POC step for Ask IT. The deployed app needs a public URL.

## Task
Draft Render POC config and smoke checklist for Ask IT public URL.

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

  'production-deployment/runbook-and-pre-rollout-checklist': assignmentBase({
    title: 'Assignment 14: Ask IT runbook + rollout checklist',
    duration: '8 min',
    deliverable:
      'Deployment evidence, logging notes, and a one-page runbook for Ask IT',
    skillsFromLab: [
      'Todo Render POC taught smoke URLs.',
      'Production runbook is Ask IT specific.',
    ],
    assignmentContext:
      'On your own: operations runbook and pre-rollout checklist for Ask IT.',
    whatYouLearn: ['Ops docs are written with prompts too.'],
    prompts: [
      {
        step: 1,
        label: 'Runbook',
        whereToRun: 'AI tool',
        prompt: `## Context
On your own: operations runbook and pre-rollout checklist for Ask IT.

## Task
Write Ask IT runbook: health, three incidents (429, slow RAG, RBAC leak), rollback, escalation.

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
    title: 'Assignment 15: Ask IT handover + sponsor readout',
    duration: '25 min',
    deliverable:
      'Security questionnaire evidence, trace/eval snapshot, README, architecture diagram, runbook, and a five-minute sponsor readout script for Ask IT.',
    skillsFromLab: [
      'You traced and deployed Ask IT.',
      'Package it for the sponsor.',
    ],
    assignmentContext:
      'On your own: handover package and sponsor readout for Ask IT.',
    whatYouLearn: [
      'Close the engagement with a readable handover.',
    ],
    prompts: [
      {
        step: 1,
        label: 'Handover',
        whereToRun: 'AI tool',
        prompt: `## Context
On your own: handover package and sponsor readout for Ask IT.

## Task
Write Ask IT handover plus 5 sponsor bullets (goal, shipped, RBAC, observability, limits).

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
