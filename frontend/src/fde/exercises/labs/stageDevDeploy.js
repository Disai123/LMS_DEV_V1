import { GLOSSARY_COMMON, GLOSSARY_DOCKER, TUTOR_START, troubleshootingEntry } from '../labShared'

export const stageDevDeployLabs = {
  'development-backend/lab-4-application-skeleton': {
    track: 'todo',
    type: 'prompt-lab',
    title: 'Lab 11: Todo FastAPI backend',
    duration: '100 min',
    prerequisites: ['Architecture lab'],
    beforeYouStart: TUTOR_START,
    glossary: GLOSSARY_COMMON,
    labContext:
      'You will generate a minimal Todo API with two task endpoints (GET /tasks and POST /tasks), prove it with curl, then open the SQLite file to see the stored tasks.',
    whatYouLearn: [
    'Generate a minimal FastAPI Todo backend with GET /tasks and POST /tasks from prompts.',
    'Prove the API works with curl smoke tests, not only by reading code.',
    'Fix import, routing, and validation issues with small targeted prompts.',
    'Carry the same backend skeleton approach to Customer support ticketing system in the assignment.',
  ],
    prompts: [
      {
        step: 1,
        label: 'Backend',
        whereToRun: 'AI tool',
        prompt: `## Context
This step generates a minimal Todo API with two task endpoints, then proves it with curl.

## Task
Create a minimal FastAPI Todo backend in main.py with GET /tasks and POST /tasks, Pydantic models and SQLite storage in a table named tasks. POST /tasks returns the created task with status 201.

## Outcome
- How to start the server.
- curl GET /tasks returns the list of tasks.
- curl POST /tasks creates a task.`,
      },
      {
        step: 2,
        label: 'curl smoke tests',
        whereToRun: 'AI tool',
        prompt: `## Context
A running Todo API needs quick proof that it works.

## Task
Give 2 curl commands: POST /tasks with a title, and GET /tasks. Give each for Mac/Linux and for Windows PowerShell (curl.exe).

## Outcome
- One line per command.
- Expected HTTP status for each.`,
      },
    ],
    acceptanceCriteria: [
      'GET /tasks returns 200 with the list of tasks.',
      'POST /tasks creates a task and returns 201.',
      'Bad input returns 422 with a clear error.',
      'The created task shows as a row in the tasks table in DB Browser for SQLite.',
    ],
    troubleshooting: [
      troubleshootingEntry(
        'GET /tasks returns 404',
        'Tasks route missing or not registered.',
        'Wrong route path.',
        'Ensure GET /tasks is registered on the FastAPI app instance.',
      ),
      troubleshootingEntry(
        'POST /tasks returns 422',
        'Body does not match the model.',
        'Missing title field.',
        'Show one valid JSON body and the smallest model or handler fix.',
      ),
      troubleshootingEntry(
        'uvicorn fails on import',
        'Python cannot load the app.',
        'Syntax or missing package.',
        'Here is the traceback: <paste>. Fix only what breaks import.',
      ),
    ],
  },

  'development-frontend/lab-5-connect-rag-and-test': {
    track: 'todo',
    type: 'prompt-lab',
    title: 'Lab 12: Todo React UI',
    duration: '100 min',
    prerequisites: ['Lab 11'],
    beforeYouStart: TUTOR_START,
    glossary: GLOSSARY_COMMON,
    labContext: 'Add task works in the browser against your Todo API.',
    whatYouLearn: [
    'Connect a React Todo UI to your FastAPI backend with fetch calls.',
    'Resolve CORS and empty-list bugs using browser errors and fix prompts.',
    'Apply the same front-to-back integration steps on Customer support ticketing system later.',
    'Verify add-task and list-task flows end to end with a screenshot.',
  ],
    prompts: [
      {
        step: 1,
        label: 'Build the React UI',
        whereToRun: 'AI tool',
        prompt: `## Context
The Todo API from Lab 11 runs at http://localhost:8000 with two routes: GET /tasks and POST /tasks. The UI is a new Vite + React project in a folder named todo-ui.

## Task
Create a simple task list page. On load, call GET /tasks and show every task title. An input and an Add button call POST /tasks with {"title": ...}, then reload the list. Read the API address from VITE_API_URL and fall back to http://localhost:8000. Show any request error on the page. No toggle or delete, since the API has no such routes.

## Outcome
npm run dev shows the page. Adding one task updates the list.`,
      },
    ],
    acceptanceCriteria: [
      'The UI loads tasks from the API.',
      'Add task works end to end in the browser.',
    ],
    troubleshooting: [
      troubleshootingEntry(
        'CORS or Failed to fetch',
        'The Lab 11 backend has no CORS setting yet.',
        'Backend blocks cross-origin requests from the React dev server.',
        'Run step 5 to configure CORSMiddleware on the backend for http://localhost:5173.',
      ),
      troubleshootingEntry(
        'Tasks list stays empty',
        'GET result not shown.',
        'Backend is not running or wrong endpoint URL.',
        'Confirm the backend is running and http://localhost:8000/tasks opens in the browser.',
      ),
      troubleshootingEntry(
        'Add task does nothing',
        'Add button click does not submit or fails silently.',
        'Handler not wired or API request failed.',
        'Check the browser console and the backend terminal for the error, then paste it into Antigravity.',
      ),
    ],
  },

  'deployment/lab-6-poc-hardening': {
    track: 'todo',
    type: 'prompt-lab',
    title: 'Lab 13: Todo deploy — local, Docker, Render',
    duration: '40 min',
    prerequisites: ['Lab 12'],
    beforeYouStart: `${TUTOR_START} Learn Docker hello-world before containerizing Todo.`,
    glossary: [...GLOSSARY_COMMON, ...GLOSSARY_DOCKER],
    labContext:
      'You will run Todo on your laptop, then in Docker, then prepare a Render POC checklist—with tutor help when stuck.',
    whatYouLearn: [
    'Run Todo locally from steps you can hand to another developer.',
    'Prove Docker with hello-world, then run the app with docker compose.',
    'Fix port, engine, and DATABASE_URL issues common in real deploys.',
    'Prepare Render POC config—the same path repeats on Customer support ticketing system in your…',
  ],
    prompts: [
      {
        step: 1,
        label: 'Local run',
        whereToRun: 'AI tool',
        prompt: `## Context
Local run step in the deploy lab. Todo is a Python 3.11 FastAPI app with SQLite and an optional Vite React UI.

## Task
Write local run steps for Todo: start API and UI on a fresh laptop.

## Outcome
- Numbered steps
- One verify command for /health and GET /tasks
- What success looks like`,
      },
      {
        step: 2,
        label: 'Docker hello-world',
        whereToRun: 'Terminal',
        prompt: `## Context
Docker Desktop is installed on Windows or Mac. Docker is checked with hello-world before Todo is containerized.

## Task
List commands to check Docker and run hello-world on Windows or Mac.

## Outcome
- docker --version
- docker run hello-world
- What you should see if it worked`,
      },
      {
        step: 3,
        label: 'Docker compose',
        whereToRun: 'AI tool',
        prompt: `## Context
Containerize Todo so API and optional UI start together. The Todo monorepo has an API, an optional web app, and a database service.

## Task
Plan Docker setup for the Todo monorepo: API, optional web, database service.

## Outcome
- What each container does
- How to start with docker compose
- curl /health from outside`,
      },
      {
        step: 4,
        label: 'Render POC',
        whereToRun: 'AI tool',
        prompt: `## Context
Prepare Todo for a Render POC deploy. The API exposes /health for the health check.

## Task
Draft Render POC config and a short deploy checklist for Todo.

## Outcome
- healthCheckPath /health
- Env vars listed (no secrets in git)
- 5-step deploy and smoke URL check`,
      },
    ],
    acceptanceCriteria: [
      'Todo runs locally and in Docker.',
      'You used at least one fix prompt from troubleshooting.',
      'Render checklist completed or documented with tutor.',
    ],
    troubleshooting: [
      troubleshootingEntry(
        'Docker engine not running',
        'Compose cannot start.',
        'Docker Desktop stopped.',
        'Give steps to start Docker Desktop, run hello-world, and what success looks like.',
      ),
      troubleshootingEntry(
        'Port 8000 already in use',
        'Another process holds the port.',
        'Old uvicorn or container.',
        'Show how to stop the old process or map API to port 8001.',
      ),
      troubleshootingEntry(
        'DB connection to localhost:5432 fails in container',
        'Wrong host inside compose.',
        'DATABASE_URL uses localhost.',
        'Use host postgres in DATABASE_URL and show depends_on for the database service.',
      ),
    ],
  },

  'deployment/lab-7a-production-deployment': {
    track: 'todo',
    type: 'prompt-lab',
    title: 'Lab 14: Todo production Render',
    duration: '12 min',
    prerequisites: ['Todo Render POC lab'],
    beforeYouStart: TUTOR_START,
    glossary: GLOSSARY_COMMON,
    labContext:
      'You will tighten Todo deploy settings for a pilot: secrets, CORS, and a production checklist including rollback.',
    whatYouLearn: [
    'Harden Render config: secrets outside git, explicit CORS origin, health checks.',
    'Write a production checklist that includes rollback steps.',
    'Spot POC shortcuts that are unsafe for real users.',
    'Repeat this checklist pattern for Customer support ticketing system in the production assignment.',
  ],
    prompts: [
      {
        step: 1,
        label: 'Production config',
        whereToRun: 'AI tool',
        prompt: `## Context
Todo runs on Render from the Stage 7 POC. Deploy settings are tightened for a pilot: secrets, CORS, and a production checklist including rollback.

## Task
Upgrade Todo Render settings for pilot plus a production checklist (health, secrets, rollback).

## Outcome
- Secrets not in git
- Exact frontend origin for CORS
- Rollback steps numbered`,
      },
    ],
    acceptanceCriteria: [
      'Secrets not in git',
      'Exact FRONTEND_ORIGIN',
      'Rollback steps',
    ],
    troubleshooting: [
      troubleshootingEntry('API key in render.yaml', 'Secret in git.', 'Inlined value.', 'Remove key; note sync:false for secrets.'),
      troubleshootingEntry('CORS wildcard', 'Too open.', 'Dev wildcard copied.', 'Set FRONTEND_ORIGIN to exact Todo web URL.'),
      troubleshootingEntry('No rollback', 'On-call stuck.', 'Missing section.', 'Add 3 rollback steps to the production checklist.'),
    ],
  },

  'enterprise-ai-fde/lab-8a-observability-and-eval-evidence': {
    track: 'todo',
    type: 'prompt-lab',
    title: 'Lab 15: Todo tracing (Langfuse)',
    duration: '30 min',
    prerequisites: ['Lab 14'],
    beforeYouStart: TUTOR_START,
    glossary: [...GLOSSARY_COMMON, { term: 'Langfuse', meaning: 'Trace and score LLM/API calls.' }],
    labContext:
      'You will plan how to trace Todo API requests (for example with Langfuse) without pasting your whole app.',
    whatYouLearn: [
    'Define which Todo API spans you would trace (validation, DB write, etc.).',
    'List Langfuse env vars and flush behavior without exposing secrets.',
    'Connect tracing to debugging real latency and failure issues.',
    'Scale the same observability plan to Customer support ticketing system in the enterprise stage.',
  ],
    prompts: [
      {
        step: 1,
        label: 'Tracing plan',
        whereToRun: 'AI tool',
        prompt: `## Context
A plan for tracing Todo API requests, for example with Langfuse. Only setup notes are needed, not the whole app.

## Task
Describe how to trace Todo POST /tasks with Langfuse (spans: validate, db_write, total_ms)—setup notes only, not full app paste.

## Outcome
- Env vars to set
- Mention flush before exit
- What to see in the dashboard`,
      },
    ],
    acceptanceCriteria: ['validate + db_write spans named', 'flush mentioned'],
    troubleshooting: [
      troubleshootingEntry('Empty dashboard', 'No events.', 'Missing keys or flush.', 'List LANGFUSE env vars and flush() before exit.'),
      troubleshootingEntry('Full app pasted in doc', 'Too much code.', 'Open prompt.', 'Setup notes only—implement from bullets yourself.'),
      troubleshootingEntry('/ask instead of /tasks', 'Wrong endpoint.', 'Customer support ticketing system habit.', 'Instrument POST /tasks only for Todo.'),
    ],
  },
}
