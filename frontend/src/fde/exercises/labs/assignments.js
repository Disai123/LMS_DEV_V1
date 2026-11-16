import { ASSIGNMENT_START, GLOSSARY_COMMON, troubleshootingEntry } from '../labShared'
import {
  INTRO_ASKIT_BRD,
  INTRO_ASKIT_UI,
  INTRO_ASKIT_ARCH,
  INTRO_ASKIT_STARTUP,
  INTRO_ASKIT_FIX_TEST,
  INTRO_ASKIT_DEPLOY,
  INTRO_ASKIT_RUNBOOK,
  INTRO_ASKIT_HANDOVER,
  PROMPT_ASKIT_BRD,
  PROMPT_ASKIT_DISCOVERY_10,
  PROMPT_ASKIT_UIUX,
  PROMPT_ASKIT_ARCH,
  PROMPT_ASKIT_DEPLOY_LOCAL,
  PROMPT_ASKIT_TEST_PLAN,
  PROMPT_ASKIT_FIX_TEST_LOOP,
  PROMPT_ASKIT_DEPLOY_DOCKER,
  PROMPT_ASKIT_DEPLOY_RENDER,
  PROMPT_ASKIT_RUNBOOK,
  PROMPT_ASKIT_HANDOVER,
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
    title: 'Assignment: Ask IT BRD + discovery questions',
    duration: '60 min',
    skillsFromLab: ['Todo lab: you drafted a smaller BRD for Todo.', 'Do the full BRD for Ask IT on your own.'],
    assignmentContext: INTRO_ASKIT_BRD,
    whatYouLearn: [
      'Transfer the Todo BRD structure to Ask IT without copying Todo features.',
      'Cover staff vs admin and triage in requirements.',
    ],
    prompts: [
      { step: 1, label: 'Ask IT BRD', whereToRun: 'AI tool', prompt: PROMPT_ASKIT_BRD },
      { step: 2, label: 'Discovery questions', whereToRun: 'AI tool', prompt: PROMPT_ASKIT_DISCOVERY_10 },
    ],
    acceptanceCriteria: ['BRD mentions staff vs admin.', '10 discovery questions cover security and pilot.'],
    troubleshooting: [],
  }),

  'fde-sdlc-ui-ux-solution/revise-the-flow-and-wireframes': assignmentBase({
    title: 'Assignment: Ask IT UI/UX pack',
    duration: '60 min',
    skillsFromLab: ['Todo lab: UI brief for task list.', 'Same structure for Ask IT chat UI.'],
    assignmentContext: INTRO_ASKIT_UI,
    whatYouLearn: [
      'Describe Ask IT chat, roles, citations, and escalation in a UI brief.',
      'Keep headings consistent with the Todo lab discipline.',
    ],
    prompts: [{ step: 1, label: 'UI brief', whereToRun: 'AI tool', prompt: PROMPT_ASKIT_UIUX }],
    acceptanceCriteria: ['Escalation flow described', 'No Todo task list UI'],
    troubleshooting: [
      troubleshootingEntry('Todo task list wireframe', 'Wrong app.', 'Todo habit.', FIX_ASKIT_UI_TODO),
    ],
  }),

  'fde-sdlc-architecture-solution/update-the-architecture-pack': assignmentBase({
    title: 'Assignment: Ask IT architecture pack',
    duration: '60 min',
    skillsFromLab: ['Todo lab: simple system diagram.', 'Ask IT needs API, RAG, RBAC, deploy notes.'],
    assignmentContext: INTRO_ASKIT_ARCH,
    whatYouLearn: ['Align architecture to BRD.', 'Call out security before the LLM runs.'],
    prompts: [{ step: 1, label: 'Architecture', whereToRun: 'AI tool', prompt: PROMPT_ASKIT_ARCH }],
    acceptanceCriteria: ['Security section mentions FAQ filter before LLM.'],
    troubleshooting: [],
  }),

  'development/startup-instructions-and-tests': assignmentBase({
    title: 'Assignment: Ask IT startup + tests',
    duration: '75 min',
    skillsFromLab: ['Todo lab: you built and ran Todo locally.', 'Repeat for Ask IT in your repo.'],
    assignmentContext: INTRO_ASKIT_STARTUP,
    whatYouLearn: ['Local run and manual test plan for Ask IT.', 'Same loop as Todo, different app.'],
    prompts: [
      { step: 1, label: 'Local run', whereToRun: 'AI tool', prompt: PROMPT_ASKIT_DEPLOY_LOCAL },
      { step: 2, label: 'Test plan', whereToRun: 'AI tool', prompt: PROMPT_ASKIT_TEST_PLAN },
    ],
    acceptanceCriteria: ['You ran tests locally.', 'Staff cannot see admin-only content in your notes.'],
    troubleshooting: [troubleshootingEntry('CORS or fetch errors', 'Browser cannot reach API.', 'Wrong URL or CORS.', FIX_ASKIT_CORS)],
  }),

  'development/fix-a-failed-test-and-rerun': assignmentBase({
    title: 'Assignment: Fix failing Ask IT test',
    duration: '60 min',
    skillsFromLab: ['Todo lab: fix prompt when tests failed.', 'Do the same on Ask IT.'],
    assignmentContext: INTRO_ASKIT_FIX_TEST,
    whatYouLearn: ['Prompt → fail → fix prompt → run again.'],
    prompts: [{ step: 1, label: 'Fix loop', whereToRun: 'AI tool', prompt: PROMPT_ASKIT_FIX_TEST_LOOP }],
    acceptanceCriteria: ['Log includes the fix you used.', 'That test passes after fix.'],
    troubleshooting: [],
  }),

  'mvp-poc-local-render/staging-checklist-and-pilot-plan': assignmentBase({
    title: 'Assignment: Ask IT local + Docker + Render',
    duration: '90 min',
    skillsFromLab: ['Todo lab: local → Docker → Render POC.', 'Mirror for Ask IT on your own.'],
    assignmentContext: INTRO_ASKIT_DEPLOY,
    whatYouLearn: ['End-to-end deploy evidence for Ask IT pilot.'],
    prompts: [
      { step: 1, label: 'Local', whereToRun: 'AI tool', prompt: PROMPT_ASKIT_DEPLOY_LOCAL },
      { step: 2, label: 'Docker', whereToRun: 'AI tool', prompt: PROMPT_ASKIT_DEPLOY_DOCKER },
      { step: 3, label: 'Render POC', whereToRun: 'AI tool', prompt: PROMPT_ASKIT_DEPLOY_RENDER },
    ],
    acceptanceCriteria: ['Docker steps documented.', 'Public URL or pilot plan note with smoke test.'],
    troubleshooting: [
      troubleshootingEntry('Compose DB connection fails', 'API uses localhost in container.', 'Wrong DATABASE_URL.', FIX_ASKIT_DB_HOST),
      troubleshootingEntry('Live UI calls localhost:8000', 'Missing production API URL at build.', 'VITE_API_URL.', FIX_ASKIT_VITE_URL),
    ],
  }),

  'production-deployment/runbook-and-pre-rollout-checklist': assignmentBase({
    title: 'Assignment: Ask IT runbook + rollout checklist',
    duration: '60 min',
    skillsFromLab: ['Todo Render POC taught smoke URLs.', 'Production runbook is Ask IT specific.'],
    assignmentContext: INTRO_ASKIT_RUNBOOK,
    whatYouLearn: ['Ops docs are written with prompts too.'],
    prompts: [{ step: 1, label: 'Runbook', whereToRun: 'AI tool', prompt: PROMPT_ASKIT_RUNBOOK }],
    acceptanceCriteria: ['Rollback steps included.', 'No secrets in the doc.'],
    troubleshooting: [],
  }),

  'enterprise-ai-fde/handover-package-and-sponsor-readout': assignmentBase({
    title: 'Assignment: Ask IT handover + sponsor readout',
    duration: '60 min',
    skillsFromLab: ['You traced and deployed Ask IT.', 'Package it for the sponsor.'],
    assignmentContext: INTRO_ASKIT_HANDOVER,
    whatYouLearn: ['Close the engagement with a readable handover.'],
    prompts: [{ step: 1, label: 'Handover', whereToRun: 'AI tool', prompt: PROMPT_ASKIT_HANDOVER }],
    acceptanceCriteria: ['Known limits listed.', 'URLs are POC/production not localhost.'],
    troubleshooting: [],
  }),
}
