import {
  ASK_IT_CONTEXT,
  ASSIGNMENT_START,
  GLOSSARY_COMMON,
  troubleshootingEntry,
  compactPrompt,
  PROMPT_STOP,
  stopAfterMarkdown,
} from '../labShared'
import {
  PROMPT_ASKIT_BRD,
  PROMPT_ASKIT_ARCH,
  PROMPT_ASKIT_DEPLOY_DOCKER,
  PROMPT_ASKIT_DEPLOY_LOCAL,
  PROMPT_ASKIT_DEPLOY_RENDER,
  PROMPT_ASKIT_HARDEN_API,
} from './promptCompact'

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
  'software-engineering/harden-the-api-script': assignmentBase({
    title: 'Assignment: Harden Ask IT triage client (spec only)',
    duration: '45 min',
    skillsFromLab: [
      'Todo Lab 1A/1B: you validated JSON and wrote tests on the Todo API.',
      'Now write the same quality of checks for Ask IT ticket submission—spec only.',
    ],
    objective: 'Produce a short spec your future Ask IT client must pass.',
    scenario: 'Ask IT ticket JSON must be strict before production.',
    prompts: [
      {
        step: 1,
        label: 'Triage spec',
        whereToRun: 'AI tool',
        prompt: PROMPT_ASKIT_HARDEN_API,
        checkpoint: 'Spec lists fields and two error examples.',
      },
    ],
    acceptanceCriteria: ['One markdown or doc with validation rules.', 'No full application source in your submission.'],
    troubleshooting: [
      troubleshootingEntry(
        'Spec describes Todo tasks instead of tickets',
        'Wrong domain for this assignment.',
        'Prompt did not say Ask IT.',
        'Rewrite for Ask IT POST /triage only: user_email, store_id, issue_description, category, priority High|Medium|Low.',
      ),
    ],
    deliverable: 'triage-validation-spec.md',
    keyLearning: 'Specs from Todo labs transfer to the customer app.',
  }),

  'fde-sdlc-business-requirement/one-page-brd-and-discovery-questions': assignmentBase({
    title: 'Assignment: Ask IT BRD + discovery questions',
    duration: '60 min',
    skillsFromLab: ['Todo lab: you drafted a smaller BRD for Todo.', 'Do the full BRD for Ask IT on your own.'],
    objective: 'BRD.md + 10 discovery questions.',
    scenario: 'Synthetic customer sign-off before build.',
    prompts: [
      { step: 1, label: 'BRD', whereToRun: 'AI tool', prompt: PROMPT_ASKIT_BRD, checkpoint: 'BRD.md has all H2 sections.' },
      {
        step: 2,
        label: 'Discovery',
        whereToRun: 'AI tool',
        prompt: compactPrompt({
          context: ASK_IT_CONTEXT,
          task: 'List **10 discovery questions** for Ask IT (RBAC, FAQs, escalation, pilot stores).',
          output: 'Numbered questions only',
        }),
        checkpoint: '10 questions saved.',
      },
    ],
    acceptanceCriteria: ['BRD mentions staff vs admin.', 'Questions cover security and pilot.'],
    troubleshooting: [],
    deliverable: 'BRD.md + discovery-questions.md',
    keyLearning: 'BRD is prompt-first, then you refine with the customer.',
  }),

  'fde-sdlc-architecture-solution/update-the-architecture-pack': assignmentBase({
    title: 'Assignment: Ask IT architecture pack',
    duration: '60 min',
    skillsFromLab: ['Todo lab: simple system diagram.', 'Ask IT needs API, RAG, RBAC, deploy notes.'],
    objective: 'ARCHITECTURE.md aligned to BRD.',
    scenario: 'Architecture sign-off.',
    prompts: [
      {
        step: 1,
        label: 'Architecture',
        whereToRun: 'AI tool',
        prompt: PROMPT_ASKIT_ARCH,
        checkpoint: 'ARCHITECTURE.md complete.',
      },
    ],
    acceptanceCriteria: ['Security section mentions FAQ filter before LLM.'],
    troubleshooting: [],
    deliverable: 'ARCHITECTURE.md',
    keyLearning: 'Architecture prompts follow BRD—not the other way around.',
  }),

  'development/startup-instructions-and-tests': assignmentBase({
    title: 'Assignment: Ask IT startup + tests',
    duration: '75 min',
    skillsFromLab: ['Todo lab: you built and ran Todo locally.', 'Repeat for Ask IT in your repo.'],
    objective: 'Runnable Ask IT locally with a short test plan.',
    scenario: 'Development handoff to pilot.',
    prompts: [
      {
        step: 1,
        label: 'Runbook local',
        whereToRun: 'AI tool',
        prompt: PROMPT_ASKIT_DEPLOY_LOCAL,
        checkpoint: 'README-RUN.md works on your machine.',
      },
      {
        step: 2,
        label: 'Test plan',
        whereToRun: 'AI tool',
        prompt: compactPrompt({
          context: ASK_IT_CONTEXT,
          task: 'Write **TEST-PLAN.md** with 5 manual tests: /health, staff /ask, admin FAQ, triage, RBAC negative.',
          output: 'Steps + expected result each',
        }),
        checkpoint: 'Five tests documented.',
      },
    ],
    acceptanceCriteria: ['You ran tests locally.', 'Staff cannot see admin-only content in your notes.'],
    troubleshooting: [
      troubleshootingEntry(
        'CORS or fetch errors',
        'Browser cannot reach API.',
        'Wrong API URL or CORS.',
        'My React app on :5173 cannot call /ask. Fix CORS for that origin only. Show the header line to add. Minimal diff.',
      ),
    ],
    deliverable: 'README-RUN.md + TEST-PLAN.md + test notes',
    keyLearning: 'Same run/fix loop as Todo—different app.',
  }),

  'development/fix-a-failed-test-and-rerun': assignmentBase({
    title: 'Assignment: Fix failing Ask IT test',
    duration: '60 min',
    skillsFromLab: ['Todo lab: you used a fix prompt when tests failed.', 'Do the same on Ask IT.'],
    objective: 'One failing test fixed with a follow-up prompt; rerun passes.',
    scenario: 'Regression before Docker.',
    prompts: [
      {
        step: 1,
        label: 'Fix loop',
        whereToRun: 'AI tool',
        prompt: compactPrompt({
          context: ASK_IT_CONTEXT,
          task: 'Pick one failing test from TEST-PLAN.md. Paste the error. Ask the AI for the **smallest code fix** only.',
          output: '- Symptom\n- Fix prompt you used\n- Pass/fail after rerun',
        }),
        checkpoint: 'failure-fix-log.md saved.',
      },
    ],
    acceptanceCriteria: ['Log includes the exact fix prompt.', 'That test passes after fix.'],
    troubleshooting: [],
    deliverable: 'failure-fix-log.md',
    keyLearning: 'Prompt → fail → fix prompt → run again.',
  }),

  'mvp-poc-local-render/staging-checklist-and-pilot-plan': assignmentBase({
    title: 'Assignment: Ask IT local + Docker + Render',
    duration: '90 min',
    skillsFromLab: [
      'Todo lab: local → hello-world → compose → Render POC.',
      'Mirror the same path for Ask IT on your own.',
    ],
    objective: 'End-to-end deploy evidence for Ask IT.',
    scenario: 'Pilot URL for stakeholders.',
    prompts: [
      {
        step: 1,
        label: 'Local',
        whereToRun: 'AI tool',
        prompt: PROMPT_ASKIT_DEPLOY_LOCAL,
        checkpoint: 'Local chat works.',
      },
      {
        step: 2,
        label: 'Docker',
        whereToRun: 'AI tool',
        prompt: PROMPT_ASKIT_DEPLOY_DOCKER,
        checkpoint: 'docker compose up succeeds.',
      },
      {
        step: 3,
        label: 'Render POC',
        whereToRun: 'AI tool',
        prompt: PROMPT_ASKIT_DEPLOY_RENDER,
        checkpoint: 'Public URL smoke-tested.',
      },
    ],
    acceptanceCriteria: ['DOCKER.md and poc checklist exist.', 'Screenshot or URL in pilot-plan.md.'],
    troubleshooting: [
      troubleshootingEntry(
        'Compose DB connection fails',
        'API uses localhost inside container.',
        'Wrong DATABASE_URL host.',
        'Fix only DATABASE_URL to use host postgres. Show the one line change in docker-compose.',
      ),
      troubleshootingEntry(
        'Live UI calls localhost:8000',
        'Built without production API URL.',
        'Missing VITE_API_URL at build.',
        'Set VITE_API_URL to Render API URL. List rebuild steps only.',
      ),
    ],
    deliverable: 'DOCKER.md + render.yaml + pilot-plan.md',
    keyLearning: 'Deploy path you practiced on Todo—now on Ask IT.',
  }),

  'production-deployment/runbook-and-pre-rollout-checklist': assignmentBase({
    title: 'Assignment: Ask IT runbook + rollout checklist',
    duration: '60 min',
    skillsFromLab: ['Todo Render POC taught smoke URLs.', 'Production runbook is Ask IT specific.'],
    objective: 'RUNBOOK.md + pre-rollout checklist.',
    scenario: 'Go-live readiness.',
    prompts: [
      {
        step: 1,
        label: 'Runbook',
        whereToRun: 'AI tool',
        prompt: compactPrompt({
          context: ASK_IT_CONTEXT,
          task: 'Write **RUNBOOK.md**: health check, 3 incidents (429, slow RAG, RBAC leak), rollback, escalation.',
          output: 'Plain steps, real service names you deployed',
        }),
        checkpoint: 'RUNBOOK.md saved.',
      },
    ],
    acceptanceCriteria: ['Rollback steps included.', 'No secrets in the doc.'],
    troubleshooting: [],
    deliverable: 'RUNBOOK.md + pre-rollout-checklist.md',
    keyLearning: 'Ops docs are prompts too.',
  }),

  'enterprise-ai-fde/handover-package-and-sponsor-readout': assignmentBase({
    title: 'Assignment: Ask IT handover + sponsor readout',
    duration: '60 min',
    skillsFromLab: ['You traced and deployed Ask IT.', 'Package it for the sponsor.'],
    objective: 'HANDOVER.md + 5-bullet sponsor summary.',
    scenario: 'Engagement close.',
    prompts: [
      {
        step: 1,
        label: 'Handover',
        whereToRun: 'AI tool',
        prompt: compactPrompt({
          context: ASK_IT_CONTEXT,
          task: 'Write **HANDOVER.md** and a **5-bullet sponsor readout** (goal, shipped, RBAC, observability, limits).',
          output: 'Non-technical sponsor bullets at top',
          stop: PROMPT_STOP,
        }),
        checkpoint: 'Readable in 2 minutes aloud.',
      },
    ],
    acceptanceCriteria: ['Known limits listed.', 'URLs are production/POC not localhost.'],
    troubleshooting: [],
    deliverable: 'HANDOVER.md',
    keyLearning: 'Handover closes the prompt-build-fix-run loop.',
  }),
}

/** Generic Ask IT assignment for remaining stage project slugs */
function genericAssignment(title, skill, task, deliverable) {
  return assignmentBase({
    title,
    duration: '45 min',
    skillsFromLab: [skill],
    objective: task,
    scenario: 'Ask IT customer work—solo.',
    prompts: [
      {
        step: 1,
        label: 'Main prompt',
        whereToRun: 'AI tool',
        prompt: compactPrompt({ context: ASK_IT_CONTEXT, task, output: `Save as ${deliverable}` }),
        checkpoint: `${deliverable} ready for review.`,
      },
    ],
    acceptanceCriteria: ['Artifact matches Ask IT, not Todo.'],
    troubleshooting: [
      troubleshootingEntry(
        'Output is about Todo',
        'Wrong app in the draft.',
        'Forgot Ask IT in the prompt.',
        `Stop. This assignment is Ask IT only. Redo: ${task}. Save ${deliverable}.`,
      ),
    ],
    deliverable,
    keyLearning: 'Transfer Todo lab skills to Ask IT.',
  })
}

Object.assign(ASSIGNMENTS, {
  'ai-engineering/batch-classifier-and-model-selection-note': genericAssignment(
    'Assignment: Ask IT model choice notes',
    'Todo lab: compared small models on simple text.',
    'Write **model-selection.md** for Ask IT: which model for classify vs RAG, cost/latency tradeoffs.',
    'model-selection.md',
  ),
  'ai-engineering/model-recommendation': genericAssignment(
    'Assignment: Ask IT model recommendation',
    'Todo lab: pick a model for a toy task.',
    'One-page recommendation for Ask IT embeddings + chat model with risks.',
    'model-recommendation.md',
  ),
  'ai-engineering/chunking-comparison': genericAssignment(
    'Assignment: Ask IT FAQ chunking',
    'Todo lab: tried chunk sizes on help docs.',
    'Compare 2 chunk strategies for Ask IT IT FAQs; pick one with reason.',
    'chunking-comparison.md',
  ),
  'ai-engineering/rag-evaluation-report': genericAssignment(
    'Assignment: Ask IT RAG eval report',
    'Todo lab: measured recall on Todo docs.',
    '5-question eval on Ask IT FAQs: precision/recall notes and one fix idea.',
    'rag-evaluation-report.md',
  ),
  'ai-engineering/workflow-or-agent': genericAssignment(
    'Assignment: Ask IT agent vs workflow',
    'Todo lab: built a tiny agent for tasks.',
    'Decide workflow vs agent for Ask IT triage; 1-page ADR.',
    'workflow-or-agent-adr.md',
  ),
  'ai-engineering/agent-threat-model': genericAssignment(
    'Assignment: Ask IT agent threats',
    'Todo lab: discussed tool misuse.',
    'Threat model for Ask IT agent: prompt injection, data leak, ticket spam.',
    'agent-threat-model.md',
  ),
  'ai-engineering/final-project-package-and-present-your-assistant': genericAssignment(
    'Assignment: Package Ask IT assistant',
    'All Todo + Ask IT labs completed.',
    'README + demo script + gaps list for Ask IT pilot.',
    'ask-it-package.md',
  ),
  'fde-sdlc-ui-ux-solution/revise-the-flow-and-wireframes': assignmentBase({
    title: 'Assignment: Ask IT UI/UX pack',
    duration: '60 min',
    skillsFromLab: ['Todo lab: UI_UX.md for task list.', 'Same structure for Ask IT chat UI.'],
    objective: 'UI_UX.md for Ask IT with chat, roles, citations, escalate.',
    scenario: 'Solo after tutor Todo UI lab.',
    prompts: [
      {
        step: 1,
        label: 'UI/UX',
        whereToRun: 'AI tool',
        prompt: compactPrompt({
          context: ASK_IT_CONTEXT,
          task: 'Write **UI_UX.md** with H2: Overview, Design System, Chat Interface Design, User Experience Flow, Navigation Flow, Conclusion.',
          output: 'Staff/admin toggle; citation chips; escalate state',
          stop: stopAfterMarkdown(
            'UI_UX.md',
            'Overview, Design System, Chat Interface Design, User Experience Flow, Navigation Flow, Conclusion',
          ),
        }),
        checkpoint: 'All 6 H2 sections.',
      },
    ],
    acceptanceCriteria: ['Escalation flow described', 'No Todo task list UI'],
    troubleshooting: [
      troubleshootingEntry(
        'Todo task list wireframe',
        'Wrong app.',
        'Todo habit.',
        'Ask IT single-screen chat only; staff vs admin.',
      ),
    ],
    deliverable: 'UI_UX.md',
    keyLearning: 'Headings match Todo lab discipline—content is Ask IT.',
  }),
})
