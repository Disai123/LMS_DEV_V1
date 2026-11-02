/**
 * FDE Practical Exercises — To-Do Management Application
 *
 * Keys follow the pattern  "stageSlug/itemSlug"  matching content JSON keys.
 * Each exercise has:
 *   type        : 'code' | 'prompt'
 *   title       : shown in the collapsible header
 *   objective   : one sentence
 *   scenario    : how it relates to the To-Do app
 *   steps?      : implementation steps (code type)
 *   code?       : { language, filename, content }
 *   codeBlocks? : [{ label, language, filename, content }]
 *   expectedOutput? : string
 *   prompt?         : the AI prompt text  (prompt type)
 *   staticResponse? : predefined LLM output (prompt type)
 *   keyLearning : one sentence takeaway
 */
export const EXERCISES = {

  /* ══════════════════════════════════════════════════════════════
     STAGE 1 – Software Engineering Foundations
     ══════════════════════════════════════════════════════════════ */

  'software-engineering/pydantic-and-typing': {
    type: 'code',
    title: 'Validate a Task Payload with Pydantic',
    objective:
      'Use Pydantic to define and validate a Task model that will be the backbone of our To-Do API.',
    scenario:
      'Every time a user submits a new task to the To-Do app the backend must validate the payload. ' +
      'We use Pydantic models to enforce types and constraints before the data reaches the database.',
    steps: [
      'Define a TaskCreate Pydantic model with a required title (str) and optional done (bool, default False).',
      'Add a validator that strips leading/trailing whitespace from the title and raises ValueError if it is empty.',
      'Write a short test function that passes a valid payload and an invalid empty-title payload.',
      'Run the script and observe the validation errors.',
    ],
    code: {
      language: 'python',
      filename: 'models.py',
      content: `from pydantic import BaseModel, field_validator
from typing import Optional

# ── Task models ────────────────────────────────────────────────
class TaskCreate(BaseModel):
    title: str
    done: Optional[bool] = False

    @field_validator("title")
    @classmethod
    def title_must_not_be_blank(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("title must not be blank")
        return v


class Task(TaskCreate):
    id: int

    model_config = {"from_attributes": True}


# ── Quick validation test ──────────────────────────────────────
if __name__ == "__main__":
    # Valid task
    t = TaskCreate(title="  Buy groceries  ")
    print("Valid task:", t)          # title is stripped

    # Invalid task — blank title
    try:
        TaskCreate(title="   ")
    except Exception as e:
        print("Validation error:", e)
`,
    },
    expectedOutput: `Valid task: title='Buy groceries' done=False
Validation error: 1 validation error for TaskCreate
title
  Value error, title must not be blank [type=value_error, ...]`,
    keyLearning:
      'Pydantic enforces data contracts at runtime; catching bad input early protects the database and keeps error messages user-friendly.',
  },

  'software-engineering/lab-1a-validated-api-call': {
    type: 'code',
    title: 'Call the Tasks API and Validate the Response',
    objective:
      'Write a Python script that calls a running To-Do API, validates the response with Pydantic, and handles errors gracefully.',
    scenario:
      'In the FDE lifecycle you often need to call client APIs and process structured data. ' +
      'Here we call our own To-Do API\'s GET /tasks endpoint and validate that each returned object matches our Task model.',
    steps: [
      'Import httpx (or requests) and the Task Pydantic model.',
      'Write a fetch_tasks() function that calls GET http://localhost:8000/tasks.',
      'Parse the JSON list and validate each item with Task.model_validate().',
      'Handle connection errors and validation errors separately.',
      'Print a summary of valid tasks.',
    ],
    code: {
      language: 'python',
      filename: 'fetch_tasks.py',
      content: `import httpx
from pydantic import ValidationError
from models import Task          # from the previous exercise

BASE_URL = "http://localhost:8000"

def fetch_tasks() -> list[Task]:
    """Fetch tasks from the To-Do API and validate each one."""
    try:
        response = httpx.get(f"{BASE_URL}/tasks", timeout=5)
        response.raise_for_status()
    except httpx.RequestError as exc:
        print(f"[ERROR] Could not reach API: {exc}")
        return []
    except httpx.HTTPStatusError as exc:
        print(f"[ERROR] API returned {exc.response.status_code}")
        return []

    raw_list = response.json()
    validated: list[Task] = []

    for raw in raw_list:
        try:
            validated.append(Task.model_validate(raw))
        except ValidationError as e:
            print(f"[WARN] Skipping invalid task {raw}: {e}")

    return validated


if __name__ == "__main__":
    tasks = fetch_tasks()
    if tasks:
        print(f"Fetched {len(tasks)} task(s):")
        for t in tasks:
            status = "✓" if t.done else "○"
            print(f"  [{status}] #{t.id} — {t.title}")
    else:
        print("No tasks found or API unavailable.")
`,
    },
    expectedOutput: `Fetched 3 task(s):
  [○] #1 — Buy groceries
  [✓] #2 — Write unit tests
  [○] #3 — Deploy to staging`,
    keyLearning:
      'Separating network errors from validation errors makes scripts resilient; Pydantic gives you a typed object instead of raw dicts.',
  },

  'software-engineering/lab-1b-tested-triage-endpoint': {
    type: 'code',
    title: 'Build and Test a GET /tasks FastAPI Endpoint',
    objective:
      'Create the first real FastAPI endpoint for the To-Do backend and write a pytest test to verify it.',
    scenario:
      'Stage 1 culminates in a working, tested API endpoint. ' +
      'We implement GET /tasks which the React frontend will call to display the task list.',
    steps: [
      'Create main.py with a FastAPI app and an in-memory tasks list.',
      'Add GET /tasks that returns all tasks.',
      'Add POST /tasks to create a task (needed for the test setup).',
      'Write test_main.py using TestClient from httpx and pytest.',
      'Run pytest and confirm all tests pass.',
    ],
    codeBlocks: [
      {
        label: 'Backend — main.py',
        language: 'python',
        filename: 'main.py',
        content: `from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, field_validator
from typing import Optional

app = FastAPI(title="To-Do API")

# ── In-memory store (replaced by SQLite in Stage 6) ───────────
_tasks: list[dict] = []
_next_id = 1


class TaskCreate(BaseModel):
    title: str
    done: Optional[bool] = False

    @field_validator("title")
    @classmethod
    def title_not_blank(cls, v):
        v = v.strip()
        if not v:
            raise ValueError("title must not be blank")
        return v


class Task(TaskCreate):
    id: int


# ── Routes ────────────────────────────────────────────────────
@app.get("/tasks", response_model=list[Task])
def get_tasks():
    return _tasks


@app.post("/tasks", response_model=Task, status_code=201)
def create_task(body: TaskCreate):
    global _next_id
    task = {"id": _next_id, **body.model_dump()}
    _tasks.append(task)
    _next_id += 1
    return task


@app.delete("/tasks/{task_id}", status_code=204)
def delete_task(task_id: int):
    global _tasks
    before = len(_tasks)
    _tasks = [t for t in _tasks if t["id"] != task_id]
    if len(_tasks) == before:
        raise HTTPException(status_code=404, detail="Task not found")
`,
      },
      {
        label: 'Tests — test_main.py',
        language: 'python',
        filename: 'test_main.py',
        content: `import pytest
from fastapi.testclient import TestClient
from main import app, _tasks

client = TestClient(app)


@pytest.fixture(autouse=True)
def clear_tasks():
    """Reset in-memory store before each test."""
    _tasks.clear()
    yield
    _tasks.clear()


def test_get_tasks_empty():
    resp = client.get("/tasks")
    assert resp.status_code == 200
    assert resp.json() == []


def test_create_and_get_task():
    resp = client.post("/tasks", json={"title": "Buy milk"})
    assert resp.status_code == 201
    data = resp.json()
    assert data["title"] == "Buy milk"
    assert data["done"] is False
    assert "id" in data

    resp2 = client.get("/tasks")
    assert len(resp2.json()) == 1


def test_delete_task():
    task_id = client.post("/tasks", json={"title": "Delete me"}).json()["id"]
    resp = client.delete(f"/tasks/{task_id}")
    assert resp.status_code == 204
    assert client.get("/tasks").json() == []


def test_delete_nonexistent_returns_404():
    resp = client.delete("/tasks/9999")
    assert resp.status_code == 404


def test_blank_title_rejected():
    resp = client.post("/tasks", json={"title": "   "})
    assert resp.status_code == 422
`,
      },
    ],
    expectedOutput: `============================= test session starts ==============================
collected 5 items

test_main.py .....                                                       [100%]

============================== 5 passed in 0.31s ==============================`,
    keyLearning:
      'TestClient lets you write fast, isolated API tests without spinning up a real server; autouse fixtures keep tests independent.',
  },

  /* ══════════════════════════════════════════════════════════════
     STAGE 2 – AI Engineering
     ══════════════════════════════════════════════════════════════ */

  'ai-engineering/lab-2-compare-two-models': {
    type: 'code',
    title: 'LLM Task Classifier — Compare Two Models',
    objective:
      'Call two different LLM models via OpenAI-compatible API, classify task priority, and compare the results.',
    scenario:
      'The To-Do app will gain an AI feature: automatically classify each task as High / Medium / Low priority. ' +
      'Here we experiment with two models to find the best fit before wiring it into the backend.',
    steps: [
      'Write a classify_priority() function that sends a task title to an LLM and asks for a priority label.',
      'Call the function twice with different model names (e.g. gpt-4o-mini vs gpt-3.5-turbo).',
      'Record latency and token usage for each call.',
      'Print a comparison table.',
    ],
    code: {
      language: 'python',
      filename: 'compare_models.py',
      content: `import time
from openai import OpenAI

client = OpenAI()   # uses OPENAI_API_KEY from environment

SYSTEM_PROMPT = """You are a task priority classifier.
Given a task title, respond with exactly one word: High, Medium, or Low."""

TASKS = [
    "Fix critical authentication bug",
    "Update README with new API docs",
    "Buy coffee for the office",
]

MODELS = ["gpt-4o-mini", "gpt-3.5-turbo"]


def classify_priority(task_title: str, model: str) -> tuple[str, float, int]:
    """Returns (priority_label, latency_seconds, total_tokens)."""
    start = time.time()
    resp = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"Task: {task_title}"},
        ],
        max_tokens=5,
        temperature=0,
    )
    latency = time.time() - start
    label = resp.choices[0].message.content.strip()
    tokens = resp.usage.total_tokens
    return label, latency, tokens


# ── Run comparison ────────────────────────────────────────────
print(f"{'Task':<40} {'Model':<20} {'Priority':<10} {'Latency':>8} {'Tokens':>7}")
print("-" * 90)

for task in TASKS:
    for model in MODELS:
        label, latency, tokens = classify_priority(task, model)
        print(f"{task:<40} {model:<20} {label:<10} {latency:>7.2f}s {tokens:>7}")
`,
    },
    expectedOutput: `Task                                     Model                Priority   Latency  Tokens
------------------------------------------------------------------------------------------
Fix critical authentication bug          gpt-4o-mini          High         0.42s      18
Fix critical authentication bug          gpt-3.5-turbo        High         0.38s      18
Update README with new API docs          gpt-4o-mini          Medium       0.39s      19
Update README with new API docs          gpt-3.5-turbo        Low          0.35s      19
Buy coffee for the office                gpt-4o-mini          Low          0.40s      18
Buy coffee for the office                gpt-3.5-turbo        Low          0.33s      17`,
    keyLearning:
      'Comparing models on your actual data — not benchmarks — reveals real differences in quality and cost before you commit to one.',
  },

  'ai-engineering/lab-3-ingest-and-index': {
    type: 'code',
    title: 'Ingest Task Descriptions into a Vector Store',
    objective:
      'Embed task titles and store them in an in-memory FAISS index so similar tasks can be retrieved semantically.',
    scenario:
      'A future To-Do feature will warn users when they add a duplicate or very similar task. ' +
      'This exercise builds the ingestion pipeline that powers that feature.',
    steps: [
      'Install faiss-cpu and openai (or use sentence-transformers for local embeddings).',
      'Define a list of sample tasks.',
      'Embed each task title using the OpenAI Embeddings API.',
      'Build a FAISS IndexFlatL2 and add the embeddings.',
      'Query the index with a new task title and print the top-2 similar tasks.',
    ],
    code: {
      language: 'python',
      filename: 'ingest_tasks.py',
      content: `import numpy as np
import faiss
from openai import OpenAI

client = OpenAI()

SAMPLE_TASKS = [
    "Buy groceries from the supermarket",
    "Write unit tests for the API",
    "Deploy backend to production server",
    "Fix login page CSS bug",
    "Update API documentation",
    "Schedule team standup meeting",
    "Review pull request #42",
    "Upgrade Python dependencies",
]

EMBED_MODEL = "text-embedding-3-small"
DIM = 1536   # dimensions for text-embedding-3-small


def embed(texts: list[str]) -> np.ndarray:
    resp = client.embeddings.create(model=EMBED_MODEL, input=texts)
    vecs = [e.embedding for e in resp.data]
    return np.array(vecs, dtype="float32")


def build_index(tasks: list[str]):
    vectors = embed(tasks)
    index = faiss.IndexFlatL2(DIM)
    index.add(vectors)
    return index, tasks


def find_similar(query: str, index, tasks: list[str], k: int = 2):
    q_vec = embed([query])
    distances, indices = index.search(q_vec, k)
    return [(tasks[i], float(distances[0][j])) for j, i in enumerate(indices[0])]


# ── Demo ──────────────────────────────────────────────────────
if __name__ == "__main__":
    print("Building index from sample tasks…")
    idx, task_list = build_index(SAMPLE_TASKS)
    print(f"Indexed {idx.ntotal} tasks.\n")

    query = "Purchase food at the grocery store"
    print(f'Query: "{query}"')
    results = find_similar(query, idx, task_list)
    print("Top similar tasks:")
    for title, dist in results:
        print(f"  [dist={dist:.4f}] {title}")
`,
    },
    expectedOutput: `Building index from sample tasks…
Indexed 8 tasks.

Query: "Purchase food at the grocery store"
Top similar tasks:
  [dist=0.1823] Buy groceries from the supermarket
  [dist=0.8941] Update API documentation`,
    keyLearning:
      'Vector similarity search surfaces semantically related content even when exact words differ — the foundation of duplicate detection and RAG.',
  },

  'ai-engineering/lab-5a-first-agent': {
    type: 'code',
    title: 'Build a Simple Task-Manager Agent with LangChain',
    objective:
      'Create a LangChain agent that can list tasks and add new ones by calling To-Do API tools.',
    scenario:
      'Instead of a traditional UI, an agent can manage the To-Do list by understanding natural language commands. ' +
      'This exercise wires up the agent to real API tool calls.',
    steps: [
      'Define two LangChain tools: get_tasks and add_task, each calling the local To-Do API.',
      'Create a ChatOpenAI-based agent with these tools.',
      'Invoke the agent with a natural language instruction.',
      'Observe the tool call trace and the final response.',
    ],
    code: {
      language: 'python',
      filename: 'todo_agent.py',
      content: `from langchain_openai import ChatOpenAI
from langchain.tools import tool
from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain_core.prompts import ChatPromptTemplate
import httpx

BASE_URL = "http://localhost:8000"


@tool
def get_tasks() -> str:
    """Retrieve all current tasks from the To-Do list."""
    resp = httpx.get(f"{BASE_URL}/tasks", timeout=5)
    resp.raise_for_status()
    tasks = resp.json()
    if not tasks:
        return "The task list is empty."
    lines = [f"[{'✓' if t['done'] else '○'}] #{t['id']} — {t['title']}" for t in tasks]
    return "\n".join(lines)


@tool
def add_task(title: str) -> str:
    """Add a new task to the To-Do list. title: the task description."""
    resp = httpx.post(f"{BASE_URL}/tasks", json={"title": title}, timeout=5)
    resp.raise_for_status()
    task = resp.json()
    return f"Task #{task['id']} created: '{task['title']}'"


tools = [get_tasks, add_task]

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful To-Do list assistant. Use your tools to manage tasks."),
    ("human", "{input}"),
    ("placeholder", "{agent_scratchpad}"),
])

agent = create_tool_calling_agent(llm, tools, prompt)
agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

if __name__ == "__main__":
    result = agent_executor.invoke({
        "input": "Please add 'Write deployment runbook' to my task list, then show me all tasks."
    })
    print("\n── Final Answer ──")
    print(result["output"])
`,
    },
    expectedOutput: `> Entering new AgentExecutor chain...
> Invoking: 'add_task' with {'title': 'Write deployment runbook'}
Task #4 created: 'Write deployment runbook'
> Invoking: 'get_tasks' with {}
[○] #1 — Buy groceries
[✓] #2 — Write unit tests
[○] #3 — Deploy to staging
[○] #4 — Write deployment runbook

── Final Answer ──
I've added "Write deployment runbook" to your task list. You now have 4 tasks total.`,
    keyLearning:
      'Agents bridge natural language and structured APIs; the same tool-calling pattern scales to much more complex workflows.',
  },

  /* ══════════════════════════════════════════════════════════════
     STAGE 3 – Business Requirement (BRD)
     ══════════════════════════════════════════════════════════════ */

  'fde-sdlc-business-requirement/lab-1-discovery-and-brd': {
    type: 'prompt',
    title: 'Generate a BRD for the To-Do App',
    objective:
      'Use an LLM prompt to produce a complete Business Requirements Document for the To-Do Management Application.',
    scenario:
      'You have just finished a discovery call with the client who wants a simple task tracking tool. ' +
      'Your job as an FDE is to turn the rough notes into a structured BRD that the design and engineering teams can act on.',
    prompt:
      'You are a senior Forward Deployed Engineer. Generate a concise Business Requirements Document (BRD) for a Simple To-Do Management Application.\n\n' +
      'Context:\n' +
      '- Single-screen web application\n' +
      '- Users can add, view, and delete tasks\n' +
      '- Each task has a title and a completion status\n' +
      '- Simple REST backend, PostgreSQL database\n' +
      '- React frontend\n\n' +
      'Include: Project Overview, Business Objectives, Functional Requirements, Non-Functional Requirements, User Workflow, and Expected Deliverables.',
    staticResponse: `════════════════════════════════════════════════════════
  BUSINESS REQUIREMENTS DOCUMENT
  Project: To-Do Management Application  |  Version 1.0
════════════════════════════════════════════════════════

1. PROJECT OVERVIEW
   A lightweight single-screen web application that allows
   users to manage their daily tasks. The system provides
   create, read, and delete operations on tasks backed by
   a REST API and a relational database.

2. BUSINESS OBJECTIVES
   • Reduce context-switching by providing a focused task
     tracker embedded in the team's existing workflow.
   • Deliver a working MVP within two weeks.
   • Establish a reusable FastAPI + React template for
     future internal tools.

3. FUNCTIONAL REQUIREMENTS
   FR-01  Users can view the full list of existing tasks.
   FR-02  Users can add a new task by entering a title.
   FR-03  Users can mark a task as complete/incomplete.
   FR-04  Users can delete a task permanently.
   FR-05  Task data persists across browser sessions.

4. NON-FUNCTIONAL REQUIREMENTS
   NFR-01  API response time < 300 ms for all CRUD ops.
   NFR-02  UI renders correctly on desktop and mobile.
   NFR-03  All API endpoints validated with Pydantic.
   NFR-04  Code covered by automated tests (≥ 80 %).

5. USER WORKFLOW
   Step 1  User opens the application in a browser.
   Step 2  Existing tasks are loaded and displayed.
   Step 3  User types a task title and clicks Add Task.
   Step 4  New task appears at the top of the list.
   Step 5  User clicks Delete to remove a completed task.

6. EXPECTED DELIVERABLES
   □  Pydantic data models for Task entity
   □  FastAPI backend with GET / POST / DELETE endpoints
   □  React single-page frontend connected to the API
   □  PostgreSQL schema with tasks table
   □  Basic test suite (pytest + React Testing Library)
   □  Deployment configuration (Render / Docker)

════════════════════════════════════════════════════════`,
    keyLearning:
      'A well-structured prompt that includes context and a required output format produces a BRD that is immediately usable by the team.',
  },

  'fde-sdlc-business-requirement/one-page-brd-and-discovery-questions': {
    type: 'prompt',
    title: 'Generate Discovery Questions for the To-Do App',
    objective:
      'Produce a set of structured discovery questions an FDE would ask before writing the BRD.',
    scenario:
      'Before the first client meeting you need a prepared question bank so you can fill gaps in the requirements and avoid rework.',
    prompt:
      'Act as an experienced FDE conducting a requirements discovery session for a To-Do Management Application.\n\n' +
      'Generate 12 targeted discovery questions across these categories:\n' +
      '1. Business context (3 questions)\n' +
      '2. User needs (3 questions)\n' +
      '3. Technical constraints (3 questions)\n' +
      '4. Success metrics (3 questions)\n\n' +
      'Keep each question concise and open-ended.',
    staticResponse: `DISCOVERY QUESTIONS — To-Do Management Application
═══════════════════════════════════════════════════

BUSINESS CONTEXT
  1. What specific problem does this tool solve that
     existing solutions (Notion, Trello) do not?
  2. Who are the primary stakeholders and how will
     they measure the tool's success?
  3. What is the planned rollout timeline and are
     there any hard deadlines driven by other projects?

USER NEEDS
  4. How many concurrent users do you expect, and are
     they internal staff or external customers?
  5. Do users need to share or collaborate on task
     lists, or is each list private to one user?
  6. What devices and browsers must the application
     support (desktop only, mobile, both)?

TECHNICAL CONSTRAINTS
  7. Is there an existing authentication system (SSO,
     LDAP) the application must integrate with?
  8. Are there data residency or compliance requirements
     (GDPR, SOC 2) that affect where data is stored?
  9. What is the preferred cloud provider and do you
     have existing infrastructure we should reuse?

SUCCESS METRICS
 10. What does a successful MVP look like after
     the first two weeks of use?
 11. How will you measure whether users are adopting
     the tool (DAU, task completion rate, etc.)?
 12. What would cause the project to be considered a
     failure, and how do we avoid that outcome?`,
    keyLearning:
      'Structured discovery questions prevent assumption-driven development and surface constraints early when they are cheapest to address.',
  },

  /* ══════════════════════════════════════════════════════════════
     STAGE 4 – UI / UX Solution Design
     ══════════════════════════════════════════════════════════════ */

  'fde-sdlc-ui-ux-solution/lab-2-wireframe-ask-it': {
    type: 'prompt',
    title: 'Generate UI/UX Design Brief for the To-Do App',
    objective:
      'Use a prompt to produce a detailed UI/UX design brief including user flow, wireframe description, and component list.',
    scenario:
      'With the BRD approved, the next step is translating requirements into a concrete UI design brief ' +
      'that a developer can implement without a dedicated designer.',
    prompt:
      'You are a UI/UX designer and FDE. Create a complete UI/UX design brief for a single-screen To-Do Management Application.\n\n' +
      'Requirements from BRD:\n' +
      '- Single page, no navigation\n' +
      '- Add Task form (title input + button)\n' +
      '- Task list with delete button per item\n' +
      '- Visual indicator for completed tasks\n' +
      '- Responsive (desktop & mobile)\n\n' +
      'Include: Screen Layout Description, Component List, User Flow, Interaction States, and Accessibility Notes.',
    staticResponse: `UI/UX DESIGN BRIEF — To-Do Management Application
═══════════════════════════════════════════════════

SCREEN LAYOUT (Top → Bottom)
  ┌─────────────────────────────────────────┐
  │  📝  My Tasks              [Light/Dark] │  ← Header bar
  ├─────────────────────────────────────────┤
  │  [ Task title...          ] [Add Task]  │  ← Add Task form
  ├─────────────────────────────────────────┤
  │  ○  Buy groceries               [✕]    │  ← Task item (active)
  │  ✓  Write unit tests            [✕]    │  ← Task item (done, strikethrough)
  │  ○  Deploy to staging           [✕]    │
  └─────────────────────────────────────────┘
        3 tasks · 1 completed

COMPONENT LIST
  Header        App title + theme toggle (optional)
  TaskForm      Text input + Add Task button; disabled when input empty
  TaskList      Scrollable container for TaskItem components
  TaskItem      Checkbox · Title · Delete button
  EmptyState    Displayed when task list is empty ("No tasks yet!")
  StatusBar     Shows total / completed counts

USER FLOW
  1. Page loads → GET /tasks → render TaskList
  2. User types title → Add Task button activates
  3. Click Add Task → POST /tasks → prepend new item → clear input
  4. Click checkbox → PATCH /tasks/{id} → toggle done style
  5. Click ✕ → confirm → DELETE /tasks/{id} → remove item

INTERACTION STATES
  Input empty      Add Task button is disabled (opacity 50 %)
  Loading tasks    Skeleton placeholders (3 rows)
  API error        Toast notification: "Could not reach server"
  Empty list       Illustration + "Add your first task" prompt

ACCESSIBILITY NOTES
  • Input has aria-label="New task title"
  • Delete button has aria-label="Delete task: {title}"
  • Checkbox uses native <input type="checkbox"> with visible focus ring
  • Colour contrast ratio ≥ 4.5:1 for all text elements`,
    keyLearning:
      'A text-based design brief generated by an LLM gives developers enough detail to build a consistent UI without a Figma file.',
  },

  /* ══════════════════════════════════════════════════════════════
     STAGE 5 – Architecture Solution
     ══════════════════════════════════════════════════════════════ */

  'fde-sdlc-architecture-solution/lab-3-diagram-tags-cost-and-adr': {
    type: 'prompt',
    title: 'Generate Architecture Document for the To-Do App',
    objective:
      'Produce a complete architecture document including component diagram, technology choices, cost estimate, and an ADR.',
    scenario:
      'The BRD and UI brief are approved. Before development begins, the engineering team needs an architecture document ' +
      'that justifies technology choices and maps the system components.',
    prompt:
      'You are a solutions architect. Generate a concise architecture document for a Simple To-Do Management Application.\n\n' +
      'Stack:\n' +
      '- Frontend: React 18 (Vite), served as static files\n' +
      '- Backend: Python 3.11, FastAPI, Uvicorn\n' +
      '- Database: PostgreSQL 15\n' +
      '- Deployment: Render (free tier for MVP, standard for production)\n\n' +
      'Include: Architecture Overview, Component Diagram (text), Data Flow, Technology Justification, ' +
      'Cost Estimate (MVP vs Production), and one Architecture Decision Record (ADR-001).',
    staticResponse: `ARCHITECTURE DOCUMENT — To-Do Management Application v1.0
══════════════════════════════════════════════════════════

1. ARCHITECTURE OVERVIEW
   Three-tier web application: static React frontend,
   REST API backend (FastAPI), and a managed PostgreSQL
   database. All tiers are independently deployable.

2. COMPONENT DIAGRAM
   ┌──────────────┐     HTTPS      ┌─────────────────┐
   │  Browser     │◄──────────────►│  React Frontend │
   │  (User)      │                │  (Render CDN)   │
   └──────────────┘                └────────┬────────┘
                                            │ REST API calls
                                   ┌────────▼────────┐
                                   │  FastAPI Backend│
                                   │  (Render Web    │
                                   │   Service)      │
                                   └────────┬────────┘
                                            │ SQL
                                   ┌────────▼────────┐
                                   │  PostgreSQL 15  │
                                   │  (Render DB)    │
                                   └─────────────────┘

3. DATA FLOW
   GET /tasks
     Browser → FastAPI → SELECT * FROM tasks → JSON list → Browser

   POST /tasks
     Browser → FastAPI → validate (Pydantic) →
     INSERT INTO tasks → return new task → Browser

   DELETE /tasks/{id}
     Browser → FastAPI → DELETE FROM tasks WHERE id=? → 204

4. TECHNOLOGY JUSTIFICATION
   React      Wide talent pool; Vite gives fast HMR in dev
   FastAPI    Auto docs, Pydantic validation, async support
   PostgreSQL ACID compliance; Render provides managed backups
   Render     Zero-infra deployment; scales via config change

5. COST ESTIMATE
   MVP (Development / Pilot)
     Render Free tier: $0/month (750 h compute, 1 GB PostgreSQL)
     Suitable for < 100 users

   Production
     Render Standard web service:  $7/month
     Render PostgreSQL Standard:   $7/month
     Total:                       ~$14/month for up to 10k MAU

6. ADR-001 — Use SQLite in Development, PostgreSQL in Production
   Status:   Accepted
   Context:  Developers need a zero-setup local database.
   Decision: Use SQLite (via SQLAlchemy DATABASE_URL env var)
             in development; PostgreSQL on Render in staging
             and production.
   Consequences:
     + No Docker required for local dev
     + SQL dialect differences are minimal for CRUD-only ops
     - Developer must remember to test with Postgres before PR`,
    keyLearning:
      'Architecture documents created before coding prevent expensive rework; ADRs capture the reasoning so future engineers understand why choices were made.',
  },

  /* ══════════════════════════════════════════════════════════════
     STAGE 6 – Development
     ══════════════════════════════════════════════════════════════ */

  'development/lab-4-application-skeleton': {
    type: 'code',
    title: 'Build the Full FastAPI Backend for the To-Do App',
    objective:
      'Implement the complete production-ready FastAPI backend with SQLite persistence, all CRUD endpoints, and CORS for the React frontend.',
    scenario:
      'This is the central backend that all subsequent stages build on. ' +
      'Every endpoint created here maps directly to a button or list in the React UI.',
    steps: [
      'Set up a FastAPI app with SQLite via SQLAlchemy (synchronous for simplicity).',
      'Define the tasks table with id, title, done, and created_at columns.',
      'Implement GET /tasks, POST /tasks, PATCH /tasks/{id}, and DELETE /tasks/{id}.',
      'Add CORS middleware to allow the React dev server (localhost:5173).',
      'Run with uvicorn and test each endpoint with curl.',
    ],
    codeBlocks: [
      {
        label: 'Backend — main.py (complete)',
        language: 'python',
        filename: 'main.py',
        content: `from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator
from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, func
from sqlalchemy.orm import declarative_base, Session, sessionmaker
from typing import Optional
import os

# ── Database setup ────────────────────────────────────────────
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./todos.db")
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {},
)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()


class TaskDB(Base):
    __tablename__ = "tasks"
    id         = Column(Integer, primary_key=True, index=True)
    title      = Column(String, nullable=False)
    done       = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, server_default=func.now())

Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ── Pydantic schemas ──────────────────────────────────────────
class TaskCreate(BaseModel):
    title: str

    @field_validator("title")
    @classmethod
    def title_not_blank(cls, v):
        v = v.strip()
        if not v:
            raise ValueError("title must not be blank")
        return v


class TaskUpdate(BaseModel):
    done: Optional[bool] = None
    title: Optional[str] = None


class TaskOut(BaseModel):
    id: int
    title: str
    done: bool

    model_config = {"from_attributes": True}


# ── App + CORS ────────────────────────────────────────────────
app = FastAPI(title="To-Do API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Routes ────────────────────────────────────────────────────
@app.get("/tasks", response_model=list[TaskOut])
def get_tasks(db: Session = Depends(get_db)):
    return db.query(TaskDB).order_by(TaskDB.created_at.desc()).all()


@app.post("/tasks", response_model=TaskOut, status_code=201)
def create_task(body: TaskCreate, db: Session = Depends(get_db)):
    task = TaskDB(title=body.title)
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


@app.patch("/tasks/{task_id}", response_model=TaskOut)
def update_task(task_id: int, body: TaskUpdate, db: Session = Depends(get_db)):
    task = db.get(TaskDB, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    if body.done is not None:
        task.done = body.done
    if body.title is not None:
        task.title = body.title.strip()
    db.commit()
    db.refresh(task)
    return task


@app.delete("/tasks/{task_id}", status_code=204)
def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.get(TaskDB, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()


# ── Run: uvicorn main:app --reload --port 8000 ────────────────
`,
      },
      {
        label: 'Test with curl',
        language: 'bash',
        filename: 'test_api.sh',
        content: `# Start the server first:
# uvicorn main:app --reload --port 8000

# Create tasks
curl -s -X POST http://localhost:8000/tasks \\
  -H "Content-Type: application/json" \\
  -d '{"title": "Buy groceries"}' | python -m json.tool

# List tasks
curl -s http://localhost:8000/tasks | python -m json.tool

# Mark task #1 as done
curl -s -X PATCH http://localhost:8000/tasks/1 \\
  -H "Content-Type: application/json" \\
  -d '{"done": true}' | python -m json.tool

# Delete task #1
curl -s -X DELETE http://localhost:8000/tasks/1 -w "Status: %{http_code}"
`,
      },
    ],
    expectedOutput: `{
    "id": 1,
    "title": "Buy groceries",
    "done": false
}

[
    {"id": 1, "title": "Buy groceries", "done": false}
]

{"id": 1, "title": "Buy groceries", "done": true}

Status: 204`,
    keyLearning:
      'SQLAlchemy ORM + Pydantic schemas keep the data layer, validation layer, and transport layer cleanly separated — this structure scales to large codebases.',
  },

  'development/lab-5-connect-rag-and-test': {
    type: 'code',
    title: 'Build the React Frontend and Connect to the API',
    objective:
      'Create a complete single-screen React To-Do app that reads, adds, toggles, and deletes tasks via the FastAPI backend.',
    scenario:
      'With the backend ready, we now build the frontend UI. ' +
      'This is the component the end user sees — it must handle loading states, errors, and optimistic updates.',
    steps: [
      'Bootstrap a Vite + React app (npm create vite@latest todo-frontend -- --template react).',
      'Create the main App.jsx with state for tasks, loading, and error.',
      'Fetch tasks on mount with useEffect.',
      'Implement addTask, toggleTask, and deleteTask functions.',
      'Render a form and a task list with conditional styling for done items.',
    ],
    codeBlocks: [
      {
        label: 'Frontend — App.jsx',
        language: 'jsx',
        filename: 'src/App.jsx',
        content: `import { useState, useEffect, useCallback } from 'react'

const API = 'http://localhost:8000'

export default function App() {
  const [tasks, setTasks]     = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  // ── Fetch tasks on mount ───────────────────────────────────
  const loadTasks = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(\`\${API}/tasks\`)
      if (!res.ok) throw new Error(\`Server error \${res.status}\`)
      setTasks(await res.json())
    } catch (e) {
      setError('Could not load tasks. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadTasks() }, [loadTasks])

  // ── Add task ───────────────────────────────────────────────
  const addTask = async (e) => {
    e.preventDefault()
    if (!newTitle.trim()) return
    const res = await fetch(\`\${API}/tasks\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle.trim() }),
    })
    if (res.ok) {
      const task = await res.json()
      setTasks((prev) => [task, ...prev])
      setNewTitle('')
    }
  }

  // ── Toggle done ────────────────────────────────────────────
  const toggleTask = async (task) => {
    const res = await fetch(\`\${API}/tasks/\${task.id}\`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done: !task.done }),
    })
    if (res.ok) {
      const updated = await res.json()
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
    }
  }

  // ── Delete task ────────────────────────────────────────────
  const deleteTask = async (id) => {
    const res = await fetch(\`\${API}/tasks/\${id}\`, { method: 'DELETE' })
    if (res.ok) {
      setTasks((prev) => prev.filter((t) => t.id !== id))
    }
  }

  // ── Render ─────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: 480, margin: '2rem auto', fontFamily: 'system-ui, sans-serif', padding: '0 1rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>📝 My Tasks</h1>

      {/* Add Task form */}
      <form onSubmit={addTask} style={{ display: 'flex', gap: 8, marginBottom: '1.5rem' }}>
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="New task title…"
          aria-label="New task title"
          style={{ flex: 1, padding: '8px 12px', borderRadius: 6, border: '1px solid #ccc', fontSize: '0.95rem' }}
        />
        <button
          type="submit"
          disabled={!newTitle.trim()}
          style={{
            padding: '8px 16px', borderRadius: 6, border: 'none',
            background: newTitle.trim() ? '#2563eb' : '#9ca3af',
            color: '#fff', cursor: newTitle.trim() ? 'pointer' : 'not-allowed',
            fontWeight: 600,
          }}
        >
          Add
        </button>
      </form>

      {/* States */}
      {loading && <p style={{ color: '#6b7280' }}>Loading tasks…</p>}
      {error   && <p style={{ color: '#ef4444' }}>{error}</p>}

      {/* Task list */}
      {!loading && !error && tasks.length === 0 && (
        <p style={{ color: '#9ca3af', textAlign: 'center', marginTop: '2rem' }}>
          No tasks yet — add one above!
        </p>
      )}

      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {tasks.map((task) => (
          <li
            key={task.id}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 14px', borderRadius: 8,
              border: '1px solid #e5e7eb', background: '#fff',
            }}
          >
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => toggleTask(task)}
              aria-label={\`Mark "\${task.title}" as \${task.done ? 'incomplete' : 'complete'}\`}
              style={{ width: 16, height: 16, cursor: 'pointer' }}
            />
            <span
              style={{
                flex: 1, fontSize: '0.95rem',
                textDecoration: task.done ? 'line-through' : 'none',
                color: task.done ? '#9ca3af' : '#111827',
              }}
            >
              {task.title}
            </span>
            <button
              onClick={() => deleteTask(task.id)}
              aria-label={\`Delete task: \${task.title}\`}
              style={{
                background: 'none', border: 'none',
                cursor: 'pointer', color: '#ef4444',
                fontSize: '1.1rem', lineHeight: 1,
              }}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      {tasks.length > 0 && (
        <p style={{ color: '#9ca3af', fontSize: '0.8rem', marginTop: 12, textAlign: 'right' }}>
          {tasks.filter((t) => t.done).length} / {tasks.length} completed
        </p>
      )}
    </div>
  )
}
`,
      },
    ],
    expectedOutput: `App renders at http://localhost:5173

Displays task list fetched from the API.
Typing a title and clicking Add → task appears instantly.
Clicking checkbox toggles strikethrough style.
Clicking ✕ removes the task from the list.`,
    keyLearning:
      'Keeping API calls in handler functions and state in one component is the simplest correct pattern — optimise with context or React Query only when the app grows.',
  },

  /* ══════════════════════════════════════════════════════════════
     STAGE 7 – MVP / POC Local + Render
     ══════════════════════════════════════════════════════════════ */

  'mvp-poc-local-render/lab-6-poc-hardening': {
    type: 'code',
    title: 'Prepare the To-Do App for MVP Deployment',
    objective:
      'Create all configuration files needed to run the To-Do app locally with one command and deploy it to Render as an MVP.',
    scenario:
      'The app works on your machine — now you need to make it reproducible for teammates and deployable for the pilot client.',
    steps: [
      'Create requirements.txt with pinned dependencies.',
      'Create a .env.example to document required environment variables.',
      'Write a Makefile (or run.sh) that starts both frontend and backend with one command.',
      'Verify the app works end-to-end with a smoke test script.',
    ],
    codeBlocks: [
      {
        label: 'requirements.txt',
        language: 'text',
        filename: 'requirements.txt',
        content: `fastapi==0.111.0
uvicorn[standard]==0.30.1
sqlalchemy==2.0.30
pydantic==2.7.1
python-dotenv==1.0.1
httpx==0.27.0
pytest==8.2.1
`,
      },
      {
        label: '.env.example',
        language: 'bash',
        filename: '.env.example',
        content: `# Copy this file to .env and fill in values
DATABASE_URL=sqlite:///./todos.db      # dev default (SQLite)
# DATABASE_URL=postgresql://user:pass@host:5432/todos  # production

# Optional: enable CORS for a custom frontend origin
FRONTEND_ORIGIN=http://localhost:5173
`,
      },
      {
        label: 'Makefile',
        language: 'makefile',
        filename: 'Makefile',
        content: `.PHONY: install backend frontend test

install:
\tpip install -r requirements.txt
\tnpm --prefix frontend install

backend:
\tuvicorn main:app --reload --port 8000

frontend:
\tnpm --prefix frontend run dev

test:
\tpytest -v
\tnpm --prefix frontend test -- --watchAll=false
`,
      },
      {
        label: 'Smoke test — smoke_test.py',
        language: 'python',
        filename: 'smoke_test.py',
        content: `"""Run after 'make backend' is started. Verifies the full CRUD cycle."""
import httpx, sys

BASE = "http://localhost:8000"

def run():
    c = httpx.Client(base_url=BASE, timeout=5)

    # Create
    r = c.post("/tasks", json={"title": "Smoke test task"})
    assert r.status_code == 201, f"Create failed: {r.status_code}"
    task_id = r.json()["id"]
    print(f"  ✓ Created task #{task_id}")

    # Read
    r = c.get("/tasks")
    assert any(t["id"] == task_id for t in r.json()), "Task missing from list"
    print("  ✓ Listed tasks")

    # Update
    r = c.patch(f"/tasks/{task_id}", json={"done": True})
    assert r.json()["done"] is True, "Toggle failed"
    print("  ✓ Marked done")

    # Delete
    r = c.delete(f"/tasks/{task_id}")
    assert r.status_code == 204, f"Delete failed: {r.status_code}"
    print("  ✓ Deleted task")

    print("\n✅ All smoke tests passed!")

if __name__ == "__main__":
    try:
        run()
    except Exception as e:
        print(f"❌ Smoke test failed: {e}")
        sys.exit(1)
`,
      },
    ],
    expectedOutput: `  ✓ Created task #1
  ✓ Listed tasks
  ✓ Marked done
  ✓ Deleted task

✅ All smoke tests passed!`,
    keyLearning:
      'Reproducible local setup (Makefile + .env.example) and a smoke test script dramatically reduce onboarding time for new engineers.',
  },

  /* ══════════════════════════════════════════════════════════════
     STAGE 8 – Production Deployment
     ══════════════════════════════════════════════════════════════ */

  'production-deployment/lab-7a-production-deployment': {
    type: 'code',
    title: 'Deploy the To-Do App to Render (Production Config)',
    objective:
      'Create a render.yaml blueprint and production environment config that deploys both the FastAPI backend and the React frontend.',
    scenario:
      'The MVP has been validated. It is time to promote it to a production-grade deployment with a managed database, ' +
      'environment variables, and health checks.',
    steps: [
      'Create render.yaml defining the web service and PostgreSQL database.',
      'Update main.py to read DATABASE_URL from environment (already done in Stage 6).',
      'Create a Dockerfile for the backend for consistent builds.',
      'Add a /health endpoint to the FastAPI app for Render health checks.',
    ],
    codeBlocks: [
      {
        label: 'render.yaml',
        language: 'yaml',
        filename: 'render.yaml',
        content: `services:
  # ── Backend (FastAPI) ─────────────────────────────────────
  - type: web
    name: todo-api
    runtime: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT
    healthCheckPath: /health
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: todo-db
          property: connectionString
      - key: FRONTEND_ORIGIN
        value: https://todo-app.onrender.com

  # ── Frontend (React static site) ─────────────────────────
  - type: web
    name: todo-app
    runtime: static
    buildCommand: npm --prefix frontend install && npm --prefix frontend run build
    staticPublishPath: frontend/dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html

# ── Managed PostgreSQL ────────────────────────────────────
databases:
  - name: todo-db
    plan: free
    databaseName: todos
    user: todos_user
`,
      },
      {
        label: 'Health endpoint (add to main.py)',
        language: 'python',
        filename: 'main.py (addition)',
        content: `# Add this route to main.py alongside the other routes

@app.get("/health")
def health_check():
    """Render uses this endpoint to verify the service is alive."""
    return {"status": "ok", "service": "todo-api"}
`,
      },
      {
        label: 'Frontend — set API URL via env',
        language: 'jsx',
        filename: 'src/api.js',
        content: `// src/api.js
// Vite exposes VITE_ prefixed variables to the browser bundle.
// Set VITE_API_URL=https://todo-api.onrender.com in Render's
// environment variables for the frontend static service.

export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'
`,
      },
    ],
    expectedOutput: `# After pushing to GitHub and connecting Render:

todo-api   → https://todo-api.onrender.com/health
             {"status": "ok", "service": "todo-api"}

todo-app   → https://todo-app.onrender.com
             (React app loads tasks from todo-api)`,
    keyLearning:
      'render.yaml-as-code means the entire deployment is version-controlled and reproducible; health checks give Render visibility into service readiness.',
  },

  'production-deployment/lab-7b-runbook-and-outage-drill': {
    type: 'prompt',
    title: 'Generate an Operational Runbook for the To-Do App',
    objective:
      'Use an LLM prompt to produce a structured runbook covering common incidents, triage steps, and rollback procedures.',
    scenario:
      'The app is live in production. The on-call engineer needs a runbook they can follow during an outage without ' +
      'having to read source code.',
    prompt:
      'You are a senior SRE. Write an operational runbook for the To-Do Management Application in production.\n\n' +
      'Stack: FastAPI backend on Render, React frontend on Render CDN, PostgreSQL on Render.\n\n' +
      'Include runbook sections for:\n' +
      '1. Service overview and key URLs\n' +
      '2. How to check service health\n' +
      '3. Common incidents and triage steps:\n' +
      '   a. API returns 500 errors\n' +
      '   b. Frontend cannot reach the API (CORS error)\n' +
      '   c. Database connection failure\n' +
      '4. Rollback procedure\n' +
      '5. Escalation contacts',
    staticResponse: `OPERATIONAL RUNBOOK — To-Do Management Application
════════════════════════════════════════════════════

1. SERVICE OVERVIEW
   Component         URL
   ─────────────────────────────────────────────────
   Backend API       https://todo-api.onrender.com
   Frontend          https://todo-app.onrender.com
   Health endpoint   https://todo-api.onrender.com/health
   Render Dashboard  https://dashboard.render.com

2. HEALTH CHECK PROCEDURE
   Step 1  Visit /health endpoint. Expected: {"status":"ok"}
   Step 2  Open frontend URL. Task list must load within 3 s.
   Step 3  Check Render dashboard for deploy status (green).
   Step 4  Review last 100 lines of backend logs in Render.

3. COMMON INCIDENTS

   a. API returns 500 errors
      Triage:
        1. Check /health — if 500, backend is crashing.
        2. Read Render logs: Render → todo-api → Logs.
        3. Look for SQLAlchemy or Pydantic tracebacks.
        4. If DB error → see section 3c.
        5. If code error → rollback (section 4).

   b. Frontend cannot reach API (CORS error)
      Triage:
        1. Open browser DevTools → Network tab.
        2. Confirm the request URL matches VITE_API_URL.
        3. In Render env vars, verify FRONTEND_ORIGIN is set
           to the exact frontend URL (no trailing slash).
        4. Redeploy backend after fixing env var.

   c. Database connection failure
      Triage:
        1. Open Render Dashboard → todo-db → check status.
        2. Verify DATABASE_URL env var on todo-api service
           matches the connection string shown in Render DB.
        3. Check for Render maintenance events on status page.
        4. If persistent, restore from latest Render backup:
           Dashboard → todo-db → Backups → Restore.

4. ROLLBACK PROCEDURE
   Step 1  Render Dashboard → todo-api → Deploys.
   Step 2  Find the last known-good deploy.
   Step 3  Click "Rollback to this deploy".
   Step 4  Wait 60 s for service to restart.
   Step 5  Verify /health returns 200.

5. ESCALATION
   On-call engineer  → Slack #todo-app-alerts
   Database issues   → Render support chat
   Code-level bugs   → GitHub Issues → assign to backend team`,
    keyLearning:
      'A prompt-generated runbook creates a useful first draft in minutes; the team then refines it with actual URLs and contacts before going live.',
  },

  /* ══════════════════════════════════════════════════════════════
     STAGE 9 – Enterprise AI / FDE Handover
     ══════════════════════════════════════════════════════════════ */

  'enterprise-ai-fde/lab-8a-observability-and-eval-evidence': {
    type: 'code',
    title: 'Add Langfuse Observability to the To-Do AI Feature',
    objective:
      'Instrument the task priority classification feature with Langfuse so every LLM call is traced, scored, and auditable.',
    scenario:
      'The To-Do app has gained an AI feature: automatic priority classification. ' +
      'Before handing over to the client\'s engineering team, we instrument it with Langfuse to satisfy the enterprise observability requirement.',
    steps: [
      'Install langfuse and set the LANGFUSE_* env vars.',
      'Wrap the classify_priority() function with a Langfuse trace.',
      'Add an evaluation score (1 if label is valid, 0 otherwise).',
      'Log the result to Langfuse and verify it appears in the dashboard.',
    ],
    codeBlocks: [
      {
        label: 'Instrumented classifier — classify_with_trace.py',
        language: 'python',
        filename: 'classify_with_trace.py',
        content: `import os
from openai import OpenAI
from langfuse import Langfuse
from langfuse.openai import openai as lf_openai  # auto-instrumented client

# ── Initialise Langfuse ───────────────────────────────────────
# Set in .env:
#   LANGFUSE_PUBLIC_KEY=pk-lf-...
#   LANGFUSE_SECRET_KEY=sk-lf-...
#   LANGFUSE_HOST=https://cloud.langfuse.com
langfuse = Langfuse()

VALID_LABELS = {"High", "Medium", "Low"}
SYSTEM_PROMPT = (
    "You are a task priority classifier. "
    "Respond with exactly one word: High, Medium, or Low."
)


def classify_priority(task_title: str, task_id: int) -> str:
    """Classify task priority and log the call to Langfuse."""
    trace = langfuse.trace(
        name="classify-task-priority",
        input={"task_id": task_id, "title": task_title},
        tags=["todo-app", "classification"],
    )

    generation = trace.generation(
        name="priority-classification",
        model="gpt-4o-mini",
        input=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user",   "content": f"Task: {task_title}"},
        ],
    )

    # Use Langfuse-patched OpenAI client for automatic token tracking
    client = lf_openai.OpenAI()
    resp = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user",   "content": f"Task: {task_title}"},
        ],
        max_tokens=5,
        temperature=0,
    )
    label = resp.choices[0].message.content.strip()

    # End generation span
    generation.end(output=label, usage=resp.usage)

    # Evaluate: 1.0 if label is valid, 0.0 otherwise
    score = 1.0 if label in VALID_LABELS else 0.0
    trace.score(name="label-validity", value=score)
    trace.update(output={"priority": label})

    langfuse.flush()   # ensure events are sent before process exit
    return label


# ── Demo ──────────────────────────────────────────────────────
if __name__ == "__main__":
    test_tasks = [
        (1, "Fix critical authentication bug"),
        (2, "Update README"),
        (3, "Buy coffee for the team"),
    ]
    for tid, title in test_tasks:
        priority = classify_priority(title, tid)
        print(f"  Task #{tid}: '{title}' → {priority}")

    print("\nOpen Langfuse dashboard to review traces.")
`,
      },
    ],
    expectedOutput: `  Task #1: 'Fix critical authentication bug' → High
  Task #2: 'Update README' → Medium
  Task #3: 'Buy coffee for the team' → Low

Open Langfuse dashboard to review traces.
(Each call appears as a trace with token usage, latency, and label-validity score)`,
    keyLearning:
      'Observability is not optional in enterprise AI; Langfuse gives stakeholders evidence that the model is performing correctly before handover.',
  },

  'enterprise-ai-fde/lab-8b-sponsor-readout-and-handover': {
    type: 'prompt',
    title: 'Generate Handover Documentation for the To-Do App',
    objective:
      'Produce a complete handover package that the client\'s engineering team can use to maintain and extend the To-Do app independently.',
    scenario:
      'The engagement is complete. You need to hand over the application to the client so their team can own it going forward. ' +
      'A clear handover document prevents the client from needing to call you back for basic questions.',
    prompt:
      'You are a Forward Deployed Engineer completing a client engagement. ' +
      'Write a technical handover document for the To-Do Management Application.\n\n' +
      'The application is now live on Render with:\n' +
      '- FastAPI backend at https://todo-api.onrender.com\n' +
      '- React frontend at https://todo-app.onrender.com\n' +
      '- PostgreSQL database on Render\n' +
      '- Langfuse observability for the AI classification feature\n\n' +
      'Include: System Overview, Repository Structure, Local Development Setup, ' +
      'Deployment Process, Environment Variables Reference, AI Feature Overview, ' +
      'Known Limitations, and Recommended Next Steps.',
    staticResponse: `TECHNICAL HANDOVER DOCUMENT
To-Do Management Application — FDE Engagement Closeout
════════════════════════════════════════════════════════

1. SYSTEM OVERVIEW
   A production-ready To-Do web application built during
   the FDE engagement. It demonstrates the full FDE SDLC
   from BRD through deployment with AI-assisted features.

   Live URLs:
   • Frontend:  https://todo-app.onrender.com
   • API:       https://todo-api.onrender.com
   • API Docs:  https://todo-api.onrender.com/docs

2. REPOSITORY STRUCTURE
   todo-app/
   ├── main.py              FastAPI application entry point
   ├── models.py            Pydantic schemas
   ├── requirements.txt     Python dependencies
   ├── render.yaml          Render deployment blueprint
   ├── Makefile             Developer convenience commands
   ├── smoke_test.py        Post-deploy smoke test
   ├── classify_with_trace.py  AI classification + Langfuse
   └── frontend/
       ├── src/App.jsx      React single-page application
       └── src/api.js       API base URL configuration

3. LOCAL DEVELOPMENT SETUP
   Prerequisites: Python 3.11+, Node.js 20+, git

   git clone <repo-url>
   cd todo-app
   cp .env.example .env        # fill in values
   make install                # install all dependencies
   make backend                # start API on :8000
   make frontend               # start React on :5173

4. DEPLOYMENT PROCESS
   Any push to the 'main' branch triggers auto-deploy on Render.
   Manual deploy: Render Dashboard → service → Manual Deploy.
   Rollback: Render Dashboard → Deploys → Rollback to previous.

5. ENVIRONMENT VARIABLES REFERENCE
   Variable            Service    Description
   DATABASE_URL        backend    PostgreSQL connection string (set by Render)
   FRONTEND_ORIGIN     backend    Allowed CORS origin
   VITE_API_URL        frontend   Backend API URL
   LANGFUSE_PUBLIC_KEY backend    Langfuse project public key
   LANGFUSE_SECRET_KEY backend    Langfuse project secret key

6. AI FEATURE — TASK PRIORITY CLASSIFICATION
   • Model:  gpt-4o-mini via OpenAI API
   • Logic:  classify_with_trace.py → returns High/Medium/Low
   • Traces: https://cloud.langfuse.com (login required)
   • Cost:   ~0.001 USD per 100 classifications

7. KNOWN LIMITATIONS
   • In-memory SQLite is used if DATABASE_URL is not set —
     data is lost on restart. Always set DATABASE_URL in prod.
   • The AI classifier has no fallback if OpenAI API is down.
   • No authentication — the app is open to anyone with the URL.

8. RECOMMENDED NEXT STEPS
   Priority 1  Add user authentication (Auth0 or Supabase)
   Priority 2  Add a fallback label ("Unclassified") when
               the AI API is unavailable
   Priority 3  Write end-to-end tests with Playwright
   Priority 4  Set up a CI/CD pipeline (GitHub Actions)`,
    keyLearning:
      'A complete handover document is the final deliverable of an FDE engagement — it determines whether the client can be self-sufficient.',
  },

  /* ══════════════════════════════════════════════════════════════
     STAGE 10 – Capstone Projects
     ══════════════════════════════════════════════════════════════ */

  'capstone-fde/project-1-hour-1-requirements-structure-and-database': {
    type: 'code',
    title: 'Capstone Baseline — Relational Schema & Migration for Tasks with Priorities & Tags',
    objective:
      'Design and apply the production database schema for the complete To-Do application including task tags and priority levels.',
    scenario:
      'In Capstone Project 1, we solidify the core foundations. We extend our To-Do database from simple tasks into a robust schema supporting categorized tags, priority status, and audit timestamps.',
    steps: [
      'Define the schema with foreign keys or normalized tags table for To-Do items.',
      'Create an initialization script that creates tables and seeds starter categories.',
      'Verify the table creation and constraints using SQLite or PostgreSQL CLI.',
    ],
    code: {
      language: 'sql',
      filename: 'schema.sql',
      content: `-- ── Production Schema for To-Do Management App ─────────────────
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    color_hex VARCHAR(7) DEFAULT '#35d49a'
);

CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority VARCHAR(10) CHECK (priority IN ('Low', 'Medium', 'High')) DEFAULT 'Medium',
    done BOOLEAN NOT NULL DEFAULT FALSE,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tasks_done ON tasks(done);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);

-- Seed baseline categories
INSERT INTO categories (name, color_hex) VALUES 
('Engineering', '#3b82f6'),
('Documentation', '#10b981'),
('Operations', '#f59e0b')
ON CONFLICT (name) DO NOTHING;
`,
    },
    expectedOutput: `CREATE TABLE
CREATE TABLE
CREATE INDEX
CREATE INDEX
INSERT 0 3`,
    keyLearning:
      'Well-indexed relational schemas with foreign key integrity and CHECK constraints eliminate invalid state in production enterprise systems.',
  },
}

