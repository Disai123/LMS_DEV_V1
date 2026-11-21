import { askItPrompt } from './promptCustomer'

export const INTRO_ASKIT_BRD =
  'On your own: write Customer support ticketing system discovery and a BRD for the retail IT helper (staff vs admin, FAQs, triage).'
export const INTRO_ASKIT_UI =
  'On your own: describe Customer support ticketing system chat UI—roles, citations, and escalation—not the Todo task list.'
export const INTRO_ASKIT_ARCH =
  'On your own: architecture for Customer support ticketing system aligned to your BRD (API, RAG, RBAC, security).'
export const INTRO_ASKIT_STARTUP =
  'On your own: how to run Customer support ticketing system locally and a short manual test plan.'
export const INTRO_ASKIT_FIX_TEST =
  'On your own: pick one failing test, use a fix prompt, rerun until it passes.'
export const INTRO_ASKIT_DEPLOY =
  'On your own: local run, Docker, and Render POC for Customer support ticketing system—same path you practiced on Todo.'
export const INTRO_ASKIT_RUNBOOK =
  'On your own: operations runbook and pre-rollout checklist for Customer support ticketing system.'
export const INTRO_ASKIT_HANDOVER =
  'On your own: handover package and sponsor readout for Customer support ticketing system.'

const BRD_H2 = 'Overview, Functional Requirements, Non-Functional Requirements, User Stories, Conclusion'
const ARCH_H2 =
  'Overview, System Architecture, Database Design, API Design, AI Integration Architecture, Security Architecture, Conclusion'
const UI_H2 =
  'Overview, Design System, Chat Interface Design, User Experience Flow, Navigation Flow, Conclusion'

export const PROMPT_ASKIT_BRD = askItPrompt(
  INTRO_ASKIT_BRD,
  `Write **Customer support ticketing system BRD** with H2: ${BRD_H2}.`,
  '- Staff vs admin rules\n- RAG on FAQs and ticket triage\n- Pilot store constraints',
)

export const PROMPT_ASKIT_DISCOVERY_10 = askItPrompt(
  'Second step: discovery questions for Customer support ticketing system sponsors and store IT.',
  'List **10 discovery questions** covering RBAC, FAQs, escalation, and pilot stores.',
  '- Numbered questions only',
)

export const PROMPT_ASKIT_UIUX = askItPrompt(
  INTRO_ASKIT_UI,
  `Write **Customer support ticketing system UI brief** with H2: ${UI_H2}.`,
  '- Staff/admin toggle\n- Citation chips on answers\n- Escalate to ticket state',
)

export const FIX_ASKIT_UI_TODO = askItPrompt(
  'Draft looks like Todo task list, not Customer support ticketing system chat.',
  'Rewrite for Customer support ticketing system: single-screen chat, staff vs admin, citations—no task list UI.',
  '- Revised UI brief sections',
)

export const PROMPT_ASKIT_ARCH = askItPrompt(
  INTRO_ASKIT_ARCH,
  `Write **Customer support ticketing system architecture** with H2: ${ARCH_H2}.`,
  '- Text diagrams OK\n- RBAC before LLM\n- FAQ retrieval before generation',
)

export const PROMPT_ASKIT_DEPLOY_LOCAL = askItPrompt(
  INTRO_ASKIT_STARTUP,
  'Write **local run steps** for Customer support ticketing system: API + React chat (mirror the discipline from your Todo README).',
  '- Start commands\n- Verify /health and POST /ask as staff',
)

export const PROMPT_ASKIT_TEST_PLAN = askItPrompt(
  'After local run works, document how you will test Customer support ticketing system manually.',
  'Write a **test plan** with 5 manual tests: /health, staff /ask, admin FAQ, triage, RBAC negative case.',
  '- Steps and expected result for each test',
)

export const FIX_ASKIT_CORS = askItPrompt(
  'React on :5173 cannot reach the Customer support ticketing system API.',
  'Fix CORS so the Vite dev origin can call /ask. Minimal backend change only.',
  '- Header line to add\n- Where it goes in the API',
)

export const PROMPT_ASKIT_FIX_TEST_LOOP = askItPrompt(
  INTRO_ASKIT_FIX_TEST,
  'Pick one failing test from your test plan. Paste the error. Ask for the **smallest code fix** only.',
  '- Symptom in one line\n- Fix you applied\n- Pass or fail after rerun',
)

export const PROMPT_ASKIT_DEPLOY_DOCKER = askItPrompt(
  'Docker step in the Customer support ticketing system deploy assignment.',
  'Plan Docker for Customer support ticketing system: API, web, Postgres. Use service name **postgres** in DATABASE_URL—not localhost inside containers.',
  '- Services to define\n- How to verify docker compose up\n- DATABASE_URL pattern',
)

export const PROMPT_ASKIT_DEPLOY_RENDER = askItPrompt(
  'Render POC step for Customer support ticketing system.',
  'Draft Render POC config and smoke checklist for Customer support ticketing system public URL.',
  '- /health green on Render\n- Frontend build uses production API URL, not localhost',
)

export const FIX_ASKIT_DB_HOST = askItPrompt(
  'API in Docker cannot reach the database.',
  'Fix DATABASE_URL to use host postgres in docker-compose, not localhost.',
  '- Correct env line\n- depends_on note',
)

export const FIX_ASKIT_VITE_URL = askItPrompt(
  'Live UI still calls localhost:8000.',
  'Set build-time API URL to the Render API URL and list rebuild steps.',
  '- Env var name\n- Rebuild order (API then web)',
)

export const PROMPT_ASKIT_RUNBOOK = askItPrompt(
  INTRO_ASKIT_RUNBOOK,
  'Write **Customer support ticketing system runbook**: health, three incidents (429, slow RAG, RBAC leak), rollback, escalation.',
  '- Plain numbered steps\n- Use your real service names\n- No secrets in the doc',
)

export const PROMPT_ASKIT_HANDOVER = askItPrompt(
  INTRO_ASKIT_HANDOVER,
  'Write **Customer support ticketing system handover** plus **5 sponsor bullets** (goal, shipped, RBAC, observability, limits).',
  '- Non-technical bullets at top\n- Known limits listed\n- POC or production URLs',
)
