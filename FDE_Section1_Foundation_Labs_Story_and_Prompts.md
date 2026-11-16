# FDE Stage 1 — Software Engineering (5h)

**Story and copy-paste prompts** (foundation labs only). Prompts match the LMS: **Context → Task → Output**.

---

## How this stage is structured (5 hours)

| Block | Time | What |
|-------|------|------|
| **FDE + SDLC intro** | **1 h** | Read: FDE role, SDLC lifecycle, how Sections 1–3 and Stages 3–10 connect |
| **Python reads** | **~2.5 h** | Five reads (unchanged): essentials, data, APIs, Pydantic/async, FastAPI/pytest |
| **Labs** | **~1.5 h** | Two FastAPI foundation labs below |

Stage 1 stands alone: you get course context and a **tested small API** before Stage 2 (AI) and Stage 3+ (Todo / Ask IT customer work).

---

## Why these labs exist

1. **Simple FastAPI API** — Everything later (Ask IT, RAG, agents) is exposed over HTTP. You need `/health` and one resource working locally, with curl proof, before adding AI.

2. **Validation and testing** — Bad JSON and untested routes break pilots. Pydantic + pytest with `TestClient` is the same discipline used in development stages—on a tiny notes API so the scope stays small.

---

## Lab 1 — Create a simple FastAPI API

**Acceptance criteria (LMS)**  
- GET /health returns ok  
- POST and GET on your resource work with curl  

#### Main prompt

## Context
You will build a tiny FastAPI app: a health check and one simple resource (for example short notes or bookmarks). Run it locally and prove it works with curl. This is the first step before AI or customer APIs in later stages.

## Task
Create a minimal FastAPI app with GET /health returning {"status":"ok"} and a small in-memory resource (e.g. GET/POST /notes with id and text).

## Output
- How to install FastAPI and uvicorn
- Route list in plain words
- Commands to start the server
- Two curl examples that should return 200

#### Fix prompt

## Context
Same simple FastAPI lab. Server will not start or /health returns 404.

## Task
Diagnose import errors or a missing /health route. Give the smallest fix.

## Output
- Likely cause in one line
- Fix steps
- One curl that proves /health works

---

## Lab 2 — FastAPI validation and testing

**Acceptance criteria (LMS)**  
- Invalid POST body returns 422  
- At least three pytest tests pass  

#### Main prompt

## Context
You will add Pydantic models so bad JSON gets a clear error, and write a few pytest tests with FastAPI’s test client. This matches the FastAPI, logging and pytest read.

## Task
Extend the notes API with Pydantic request and response models, return 422 on invalid body, and add pytest tests using TestClient (health, happy POST, invalid POST).

## Output
- Fields required on create
- What 422 looks like for a bad body
- Three test names and what each asserts

#### Fix prompt

## Context
Same validation and testing lab. Tests fail or invalid JSON returns 500 instead of 422.

## Task
Fix models or tests with minimal changes so invalid input returns 422 and tests pass.

## Output
- Root cause
- Model or test change
- How you will rerun pytest

---

*Source of truth: `frontend/src/fde/exercises/labs/promptFoundation.js`, `stage01.js`, `stages.json`.*

*Stage 2 AI foundation labs are documented separately in the LMS; they are not in this file.*