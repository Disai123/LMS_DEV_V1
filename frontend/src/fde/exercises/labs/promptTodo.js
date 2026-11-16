import { compactPrompt } from '../labShared'
import { todoPrompt } from './promptCustomer'

// Panel intros (match exercise labContext)
export const INTRO_TODO_LAB1 =
  'With your tutor, practice discovery and a one-page requirements doc for the small Todo app—not Ask IT yet.'
export const INTRO_TODO_LAB2 =
  'You will describe how the Todo task list looks and flows (add task, mark done, empty state) in a short UI brief.'
export const INTRO_TODO_LAB3 =
  'You will sketch how Todo is built (browser → API → database) and record one architecture decision before coding.'
export const INTRO_TODO_LAB4 =
  'You will generate a minimal Todo API with health check and task endpoints, then prove it with curl.'
export const INTRO_TODO_LAB5 =
  'You will connect a simple React task list to your Todo API and fix integration issues with your tutor.'
export const INTRO_TODO_LAB6 =
  'You will run Todo on your laptop, then in Docker, then prepare a Render POC checklist—with tutor help when stuck.'
export const INTRO_TODO_LAB7A =
  'You will tighten Todo deploy settings for a pilot: secrets, CORS, and a production checklist including rollback.'
export const INTRO_TODO_LAB7B =
  'You will write a short runbook for Todo and practice one outage drill with a fix prompt.'
export const INTRO_TODO_LAB8A =
  'You will plan how to trace Todo API requests (for example with Langfuse) without pasting your whole app.'
export const INTRO_TODO_LAB8B =
  'You will practice a handover doc for Todo with plain-language bullets for a sponsor.'

const BRD_H2 = 'Overview, Functional Requirements, Non-Functional Requirements, User Stories, Conclusion'

// SDLC
export const PROMPT_TODO_DISCOVERY = todoPrompt(
  'Step 1 of the discovery lab: questions only—no BRD yet.',
  'Write **12 open-ended discovery questions** for the Todo app (3 business, 3 technical, 3 users, 3 risks).',
  '- Numbered list only\n- Each question ends with a question mark',
)

export const PROMPT_TODO_BRD = todoPrompt(
  'Step 2: turn discovery into a one-page Todo BRD with fixed section headings.',
  `Write a Todo **BRD** with these H2 sections: ${BRD_H2}.`,
  '- FR-01 through FR-05 for tasks: create, list, mark done, filter, delete\n- At least 6 user stories\n- Non-functional requirements in plain language',
)

export const FIX_TODO_BRD_SECTIONS = todoPrompt(
  'BRD is missing a required section.',
  `Rewrite the Todo BRD so it has exactly these H2 sections: ${BRD_H2}. Fill only missing sections.`,
  '- Full BRD text with all sections present',
)

export const FIX_TODO_BRD_FR = todoPrompt(
  'Requirements are vague and hard to test.',
  'Add numbered functional requirements FR-01..FR-05 for Todo CRUD and filters—one sentence each.',
  '- Updated FR section only',
)

export const PROMPT_TODO_UIUX = todoPrompt(
  INTRO_TODO_LAB2,
  'Write a Todo **UI brief** with H2: Overview, Design System, Task List Design, User Flow, Empty States, Conclusion.',
  '- Text description of list, add, and mark-done screens\n- Empty state when there are no tasks\n- Error state example',
)

export const FIX_TODO_UI_H2 = todoPrompt(
  'UI brief is missing a section.',
  'Rewrite the Todo UI brief with all 6 H2 sections; fill Task List Design and Empty States in detail.',
  '- Complete UI brief text',
)

export const PROMPT_TODO_ARCH = todoPrompt(
  INTRO_TODO_LAB3,
  'Write Todo **architecture notes**: React → FastAPI → SQLite, API routes, and **ADR-001** (auth optional in v1).',
  '- Text diagram with labeled components\n- List GET/POST /tasks and /health\n- ADR-001: decision, consequence',
)

export const FIX_TODO_ARCH = todoPrompt(
  'Architecture doc is too generic or mentions Ask IT.',
  'Todo only: diagram React → FastAPI → SQLite; label /tasks routes; remove RAG or chat flows.',
  '- Revised architecture section',
)

// Dev
export const PROMPT_TODO_DEV_BACKEND = todoPrompt(
  INTRO_TODO_LAB4,
  'Create a minimal **FastAPI** Todo backend: GET /health, CRUD for /tasks with Pydantic models, SQLite storage.',
  '- How to start the server\n- curl GET /health returns {"status":"ok"}\n- curl POST /tasks creates a task',
)

export const PROMPT_TODO_CURL_SMOKE = todoPrompt(
  'You have a running Todo API and need quick proof it works.',
  'Give 3 curl commands: GET /health, POST /tasks with a title, GET /tasks.',
  '- One line per command\n- Expected HTTP status for each',
)

export const PROMPT_TODO_DEV_UI = todoPrompt(
  INTRO_TODO_LAB5,
  'Create a simple **React** task list: load tasks, add a task, toggle done. Call the API at VITE_API_URL or localhost:8000.',
  '- npm run dev shows the UI\n- Adding one task updates the list',
)

export const PROMPT_TODO_LOCAL_RUN = todoPrompt(
  'Local run step in the deploy lab.',
  'Write **local run steps** for Todo: start API and UI on a fresh laptop.',
  '- Numbered steps\n- One verify command for /health and GET /tasks\n- What success looks like',
)

export const PROMPT_TODO_DOCKER_VERIFY = compactPrompt({
  task: 'List commands to check Docker and run hello-world on Windows or Mac.',
  output: '- docker --version\n- docker run hello-world\n- What you should see if it worked',
  stop: '',
})

export const PROMPT_TODO_DOCKER_COMPOSE = todoPrompt(
  'Containerize Todo so API and optional UI start together.',
  'Plan Docker setup for the Todo monorepo: API, optional web, database service.',
  '- What each container does\n- How to start with docker compose\n- curl /health from outside',
)

export const PROMPT_TODO_RENDER_POC = todoPrompt(
  'Prepare Todo for a Render POC deploy.',
  'Draft Render POC config and a short deploy checklist for Todo.',
  '- healthCheckPath /health\n- Env vars listed (no secrets in git)\n- 5-step deploy and smoke URL check',
)

export const PROMPT_TODO_RENDER_PROD = todoPrompt(
  INTRO_TODO_LAB7A,
  'Upgrade Todo Render settings for pilot plus a **production checklist** (health, secrets, rollback).',
  '- Secrets not in git\n- Exact frontend origin for CORS\n- Rollback steps numbered',
)

export const PROMPT_TODO_RUNBOOK = todoPrompt(
  INTRO_TODO_LAB7B,
  'Write a Todo **runbook** for Render: health, common incidents, rollback, escalation.',
  '- Overview\n- Health check steps\n- Three incident playbooks\n- Rollback and who to call',
)

export const PROMPT_TODO_RUNBOOK_DRILL = todoPrompt(
  'Outage drill: Todo API returns 503.',
  'Write a short **drill log**: symptom, 3 triage steps, and the exact fix prompt you used.',
  '- Under 15 lines\n- Includes one follow-up prompt you pasted to the AI tool',
)

export const PROMPT_TODO_LANGFUSE = todoPrompt(
  INTRO_TODO_LAB8A,
  'Describe how to trace Todo POST /tasks with Langfuse (spans: validate, db_write, total_ms)—setup notes only, not full app paste.',
  '- Env vars to set\n- Mention flush before exit\n- What to see in the dashboard',
)

export const PROMPT_TODO_HANDOVER = todoPrompt(
  INTRO_TODO_LAB8B,
  'Write Todo **handover** for a pilot: URLs, how to run, limits, and 5 sponsor bullets in plain language.',
  '- 5 non-technical bullets at top\n- Technical run steps below\n- Real URLs not localhost',
)
