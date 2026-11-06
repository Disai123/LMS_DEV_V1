/** Shared copy and prompt building blocks for Ask IT labs (beginner audience). */

export const BADGE_LABEL = 'Ask IT Support Chatbot · Progressive Lab'

export const ASK_IT_ONE_LINER =
  'Ask IT is an internal chatbot that helps retail store staff get IT answers from FAQs, ' +
  'respects who is allowed to see sensitive info, and opens a helpdesk ticket when it is not sure.'

export const GLOSSARY_COMMON = [
  { term: 'Prompt', meaning: 'Instructions you give an AI tool in plain language so it knows what to create or fix.' },
  { term: 'API', meaning: 'A way for programs to talk over the internet—like a waiter carrying orders to the kitchen.' },
  { term: 'Artifact', meaning: 'A file or screenshot you keep as proof the lab step worked (e.g. BRD.md).' },
]

export const GLOSSARY_DOCKER = [
  { term: 'Docker', meaning: 'Runs your app in a portable box so it behaves the same on every computer.' },
  { term: 'Image', meaning: 'A recipe snapshot used to start a container.' },
  { term: 'Container', meaning: 'A running instance of an image (your app actually executing).' },
  { term: 'docker compose', meaning: 'Starts several containers together (API + web + database) from one file.' },
]

export function troubleshootingEntry(symptom, whatItMeans, likelyCause, fixPrompt) {
  return { symptom, whatItMeans, likelyCause, fixPrompt }
}

/** Paste at the start of most generation prompts */
export const ASK_IT_CONTEXT = `## Project — Ask IT (running scenario for this roadmap)
Ask IT is an enterprise IT support assistant for ~500 retail stores.

**Users & roles**
- staff: general store IT (POS, printers, WiFi basics)
- manager / admin: store ops policies, sensitive items (must never leak to staff)

**Core capabilities**
- RAG: answer from IT FAQs and runbooks (POS boot, barcode pairing, VPN, etc.)
- POST /ask with role-based filtering and citation sources
- POST /triage when confidence is low → ticket with priority High | Medium | Low and SLA hours
- Escalate to Human IT from the chat UI

**Technology (reference only — generate only what this task asks for)**
- Backend: Python 3.11, FastAPI, Pydantic v2, SQLAlchemy, SQLite (dev) / PostgreSQL (prod)
- Frontend: React 18 (Vite), single-screen chat
- AI: OpenAI embeddings + FAISS retrieval; optional LangChain/LangGraph agents
- Deploy: Docker Compose locally; Render for POC/production; Langfuse for traces

**Non-negotiable security**
- Filter FAQs by min_access_level BEFORE any text is sent to the LLM for staff roles.
- Never expose admin override codes or admin-only policies in staff responses.`

export const AUDIENCE_BEGINNER = `## Audience
The reader has NO prior programming or cloud experience (mixed backgrounds: support, QA, business, career switchers).
Explain jargon in plain language. Prefer short sentences and numbered steps.`

export const PROMPT_QUALITY_RULES = `## How you must respond
1. Follow the output format exactly (headings, filenames, or code files named below).
2. Do not add features outside scope.
3. Do not start servers, deploy, or run commands unless this task explicitly asks for shell commands only.
4. After delivering the artifact, summarize what you created in 3–5 bullets and stop.`

export function stopAfterFiles(filenames) {
  return `## Stop rule
Deliver ONLY these files (full contents): ${filenames}.
Do not create other files. Do not deploy. List the files you wrote, then stop.`
}

export function stopAfterMarkdown(filename, requiredH2) {
  return `## Stop rule
Output a single markdown document saved as **${filename}**.
Use these exact level-2 headings (##) in this order: ${requiredH2}.
Do not rename headings. Do not write code or start implementation. After the document, stop.`
}
