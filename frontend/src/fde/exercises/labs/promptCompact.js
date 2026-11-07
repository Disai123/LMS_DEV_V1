import {
  TODO_CONTEXT,
  ASK_IT_CONTEXT,
  compactPrompt,
  stopAfterFiles,
  stopAfterMarkdown,
  PROMPT_STOP,
} from '../labShared'

export const PROMPT_TODO_LOCAL_RUN = compactPrompt({
  context: TODO_CONTEXT,
  task: 'Add a **README-RUN.md** for the Todo app: how to start the API (uvicorn) and the UI (npm run dev) on a fresh laptop.',
  output: '- Numbered steps\n- One **verify** command each for API /health and GET /tasks\n- What success looks like',
})

export const PROMPT_TODO_DOCKER_VERIFY = compactPrompt({
  task: 'I am new to Docker. List the exact commands to check Docker and run hello-world, and what I should see if it worked (Windows and Mac).',
  output: '- `docker --version`\n- `docker run hello-world`\n- 2–3 lines of expected output',
})

export const PROMPT_TODO_DOCKER_COMPOSE = compactPrompt({
  context: TODO_CONTEXT,
  task: 'Create Docker files for the Todo app monorepo: API + optional web + SQLite or Postgres.',
  output: [
    '- `backend/Dockerfile` (Python 3.11, GET /health)',
    '- `frontend/Dockerfile` if UI exists (multi-stage + nginx)',
    '- `docker-compose.yml` — services api, web; env_file `.env.example`',
    '- `DOCKER.md` — `docker compose up --build`, browser URL, curl /health',
  ].join('\n'),
  stop: stopAfterFiles('backend/Dockerfile, frontend/Dockerfile, docker-compose.yml, .env.example, DOCKER.md'),
})

export const PROMPT_TODO_RENDER_POC = compactPrompt({
  context: TODO_CONTEXT,
  task: 'Create **render.yaml** for Todo POC (API + static web if needed) and **poc-deploy-checklist.md**.',
  output: '- healthCheckPath /health\n- Env vars listed (no secrets in git)\n- 5-step deploy + smoke URL checklist',
  stop: stopAfterFiles('render.yaml, poc-deploy-checklist.md'),
})

export const PROMPT_TODO_DEV_BACKEND = compactPrompt({
  context: TODO_CONTEXT,
  task: 'Create **main.py** (FastAPI): GET /health, CRUD /tasks with Pydantic models, SQLite.',
  output: '- Run: `uvicorn main:app --reload`\n- curl GET /health returns `{"status":"ok"}`',
  stop: stopAfterFiles('main.py'),
})

export const PROMPT_TODO_DEV_UI = compactPrompt({
  context: TODO_CONTEXT,
  task: 'Create **frontend/src/App.jsx**: list tasks, add task, toggle done. Call API at VITE_API_URL or localhost:8000.',
  output: '- `npm run dev` shows UI\n- Add one task and see it in the list',
  stop: stopAfterFiles('frontend/src/App.jsx'),
})

/** Assignment: full deploy path on Ask IT (after Todo lab) */
export const PROMPT_ASKIT_DEPLOY_LOCAL = compactPrompt({
  context: ASK_IT_CONTEXT,
  task: 'Write **README-RUN.md** for Ask IT: local API + React chat (same idea as your Todo README-RUN).',
  output: '- Steps, verify /health and POST /ask with role=staff',
  stop: PROMPT_STOP,
})

export const PROMPT_ASKIT_DEPLOY_DOCKER = compactPrompt({
  context: ASK_IT_CONTEXT,
  task: 'Using your Todo Docker notes, generate Ask IT **docker-compose.yml**, Dockerfiles, **DOCKER.md**, and `.env.example` (api + web + postgres).',
  output: '- DATABASE_URL host **postgres** not localhost\n- `docker compose up --build` works',
  stop: stopAfterFiles('backend/Dockerfile, frontend/Dockerfile, docker-compose.yml, .env.example, DOCKER.md'),
})

export const PROMPT_ASKIT_DEPLOY_RENDER = compactPrompt({
  context: ASK_IT_CONTEXT,
  task: 'Create Ask IT **render.yaml** (POC) and **poc-deploy-checklist.md** with public URL smoke tests.',
  output: '- /health green on Render\n- VITE_API_URL points to Render API, not localhost',
  stop: stopAfterFiles('render.yaml, poc-deploy-checklist.md'),
})

export const PROMPT_ASKIT_BRD = compactPrompt({
  context: ASK_IT_CONTEXT,
  task: 'Write **BRD.md** for Ask IT with H2: Overview, Functional Requirements, Non-Functional Requirements, User Stories, Conclusion.',
  output: '- Staff vs admin rules\n- RAG + triage mentioned',
  stop: stopAfterMarkdown('BRD.md', 'Overview, Functional Requirements, Non-Functional Requirements, User Stories, Conclusion'),
})

export const PROMPT_ASKIT_ARCH = compactPrompt({
  context: ASK_IT_CONTEXT,
  task: 'Write **ARCHITECTURE.md** with H2: Overview, System Architecture, Database Design, API Design, AI Integration Architecture, Security Architecture, Conclusion.',
  output: '- Text diagrams OK\n- RBAC before LLM called out',
  stop: stopAfterMarkdown(
    'ARCHITECTURE.md',
    'Overview, System Architecture, Database Design, API Design, AI Integration Architecture, Security Architecture, Conclusion',
  ),
})

export const PROMPT_ASKIT_HARDEN_API = compactPrompt({
  context: ASK_IT_CONTEXT,
  task: 'Specify how **submit_triage** (or triage client) should validate JSON for Ask IT—fields and error messages only, no full app code.',
  output: '- Bullet spec + 2 example invalid payloads and expected errors',
  stop: PROMPT_STOP,
})

// —— Stage 1 · Todo tutored labs ——
export const PROMPT_TODO_WELCOME_SUMMARY = compactPrompt({
  context: TODO_CONTEXT,
  task: 'Explain the **Todo practice app** in exactly **8 bullets** for a non-programmer.',
  output: 'What it does, who uses it, API + UI idea, what we build in labs, one success metric',
})

export const PROMPT_TODO_WELCOME_FIX = compactPrompt({
  task: 'A draft Todo BRD had only Overview, Functional Requirements, Conclusion. **User Stories** is missing.',
  output:
    '1) What is missing (2 sentences)\n2) One copy-paste follow-up prompt to add only User Stories with exact H2 name\n**Stop:** Do not rewrite the full BRD.',
})

export const PROMPT_TODO_ENV_CHECKLIST = compactPrompt({
  context: TODO_CONTEXT,
  task: 'Give a numbered install checklist: Python 3.11+, Node 20, Git, Cursor/VS Code, Docker Desktop.',
  output: 'Each item: purpose, verify command, what success looks like',
})

export const PROMPT_TODO_ENV_FIX = compactPrompt({
  task: 'Paste your install error below. Give the **smallest fix** for Windows or Mac.',
  output: 'Steps numbered; one verify command at the end',
})

export const PROMPT_TODO_ENV_CURL = compactPrompt({
  task: 'When Todo API runs later: show one `curl` to GET /health and what JSON you expect.',
  output: 'One curl line + sample response',
})

export const PROMPT_TODO_HTTPX_CLIENT = compactPrompt({
  context: TODO_CONTEXT,
  task: 'Create **submit_task.py**: POST JSON to `http://localhost:8000/tasks` with title; handle network errors kindly.',
  output: 'Full file; timeout=10; print status or friendly message',
  stop: stopAfterFiles('submit_task.py'),
})

export const PROMPT_TODO_HTTPX_FIX = compactPrompt({
  task: 'submit_task.py crashed or mis-handled errors. Paste traceback. Fix **minimal diff only**.',
  output: 'Updated file or patch',
})

export const PROMPT_TODO_API_TESTS = compactPrompt({
  context: TODO_CONTEXT,
  task: 'Create **main.py** (FastAPI POST/GET /tasks, Pydantic) and **test_main.py** (pytest, 4+ tests).',
  output: 'Blank title → 422; happy path 201',
  stop: stopAfterFiles('main.py, test_main.py'),
})

export const PROMPT_TODO_PYTEST_FIX = compactPrompt({
  task: 'pytest failed. Paste output. Fix tests or app with **minimal change**.',
  output: 'What changed and why in 3 bullets',
})

// —— Stage 2 · Todo AI labs ——
export const PROMPT_TODO_MODEL_COMPARE_NOTE = compactPrompt({
  context: TODO_CONTEXT,
  task: 'I compared two models on Todo **task priority** labels. Summarize which model to pick and why (cost, speed, accuracy)—one paragraph.',
  output: 'Recommendation + one risk',
})

export const PROMPT_TODO_INGEST = compactPrompt({
  context: TODO_CONTEXT,
  task: 'Create **ingest_todo_help.py**: 6 short Todo help strings → embeddings → FAISS; print top match for "mark task done".',
  output: 'Full script using faiss-cpu + openai embeddings',
  stop: stopAfterFiles('ingest_todo_help.py'),
})

export const PROMPT_TODO_INGEST_FIX = compactPrompt({
  task: 'Query "mark task done" returns wrong FAQ. Fix retrieval only—minimal diff.',
  output: 'Updated sentence in help text or k value',
})

export const PROMPT_TODO_RAG_DIAG = compactPrompt({
  task: 'User asked "delete completed tasks" but bot answered "add task". Give a 4-step diagnosis: data, retrieval, prompt, model.',
  output: 'Numbered checklist',
})

export const PROMPT_TODO_RAG_FIX = compactPrompt({
  task: 'Apply **one** fix so "delete completed" retrieves the delete FAQ first.',
  output: 'What you changed + test query result',
})

export const PROMPT_TODO_AGENT = compactPrompt({
  context: TODO_CONTEXT,
  task: 'Create **todo_agent.py** (LangChain): tools `search_todo_help` and `create_task`; one demo question.',
  output: 'Two @tool functions; verbose trace on',
  stop: stopAfterFiles('todo_agent.py'),
})

export const PROMPT_TODO_AGENT_APPROVAL = compactPrompt({
  task: 'Add y/n approval before `create_task` runs. FAQ search must not ask approval.',
  output: 'Minimal diff to todo_agent.py',
})

export const PROMPT_TODO_ATTACK = compactPrompt({
  task: 'Write one **prompt injection** attack that tries to wipe all tasks. State expected **safe** refusal.',
  output: 'Attack text + 3 lines expected safe behavior',
})

export const PROMPT_TODO_GUARDRAIL = compactPrompt({
  task: 'Add a guardrail so injection cannot call bulk-delete. Normal "add task" still works.',
  output: 'Rule list + one test question',
})

export const PROMPT_TODO_SKILL = compactPrompt({
  task: 'Write **skills/task_lookup.md** and a short MCP tool spec: GET /tasks/{id}.',
  output: 'Skill inputs/outputs + MCP JSON schema',
  stop: stopAfterFiles('skills/task_lookup.md'),
})

// —— SDLC · Todo documents (tutor) ——
export const PROMPT_TODO_DISCOVERY = compactPrompt({
  context: TODO_CONTEXT,
  task: 'Write **12 open-ended discovery questions** for the Todo app (3 business, 3 technical, 3 users, 3 risks).',
  output: 'Numbered list only—no BRD',
})

export const PROMPT_TODO_BRD = compactPrompt({
  context: TODO_CONTEXT,
  task: 'Write **BRD.md** for Todo with H2: Overview, Functional Requirements, Non-Functional Requirements, User Stories, Conclusion.',
  output: 'FR-01..FR-05 for tasks CRUD + filters',
  stop: stopAfterMarkdown('BRD.md', 'Overview, Functional Requirements, Non-Functional Requirements, User Stories, Conclusion'),
})

export const PROMPT_TODO_UIUX = compactPrompt({
  context: TODO_CONTEXT,
  task: 'Write **UI_UX.md** with H2: Overview, Design System, Task List Design, User Flow, Empty States, Conclusion.',
  output: 'Text wireframe for list + add + mark done',
  stop: stopAfterMarkdown('UI_UX.md', 'Overview, Design System, Task List Design, User Flow, Empty States, Conclusion'),
})

export const PROMPT_TODO_ARCH = compactPrompt({
  context: TODO_CONTEXT,
  task: 'Write **ARCHITECTURE.md** for Todo: React → FastAPI → SQLite; include **ADR-001** auth optional for v1.',
  output: 'Text diagram + API list',
  stop: stopAfterMarkdown(
    'ARCHITECTURE.md',
    'Overview, System Architecture, Database Design, API Design, Security, Conclusion',
  ),
})

export const PROMPT_TODO_RENDER_PROD = compactPrompt({
  context: TODO_CONTEXT,
  task: 'Upgrade Todo **render.yaml** for pilot + **PRODUCTION_CHECKLIST.md** (health, secrets, rollback).',
  output: 'sync:false on secrets; no wildcards',
  stop: stopAfterFiles('render.yaml, PRODUCTION_CHECKLIST.md'),
})

export const PROMPT_TODO_RUNBOOK = compactPrompt({
  context: TODO_CONTEXT,
  task: 'Write **RUNBOOK.md** for Todo on Render: health, 429, DB down, rollback.',
  output: 'Plain steps',
  stop: stopAfterMarkdown('RUNBOOK.md', 'Overview, Health, Incidents, Rollback, Escalation'),
})

export const PROMPT_TODO_RUNBOOK_DRILL = compactPrompt({
  context: TODO_CONTEXT,
  task: 'Simulate: Todo API returns 503. Write **drill-log.md**: symptom, 3 triage steps, one fix prompt you used.',
  output: 'Under 15 lines',
})

export const PROMPT_TODO_LANGFUSE = compactPrompt({
  context: TODO_CONTEXT,
  task: 'Describe how to add Langfuse trace on POST /tasks (spans: validate, db_write, total_ms). **langfuse-setup.md** only—no full app paste.',
  output: 'Env vars + flush() note + one screenshot instruction',
})

export const PROMPT_TODO_HANDOVER = compactPrompt({
  context: TODO_CONTEXT,
  task: 'Write **HANDOVER.md** for Todo pilot: URLs, run steps, limits, 5 sponsor bullets.',
  output: 'Sponsor bullets non-technical',
})
