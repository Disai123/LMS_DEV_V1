# Phase Document Prompts Catalog

Shared catalog for all **4 Antigravity Ecommerce Realtime projects**.

**Purpose:** When an LLM creates a phase document (`BRD.md`, `UI_UX.md`, `ARCHITECTURE.md`, `CODING.md`, `TESTING.md`, `DEPLOYMENT.md`), the output **must** include every LMS sidebar concept for that phase as a top-level heading.

**Source of truth for tabs:** each project's `shared/navigation.js` → `phaseSubphases`.

**Out of scope for this file:** Does **not** replace or edit existing `antigravity_prompts.md` / `Prompt_Library.html`. Paste these prompts when you want sidebar-complete documents.

**Prompt Library note:** The Development sidebar includes a **Prompt Library** teaching tab. Document prompts still require an H2 named `Prompt Library` with a short reference (which day/prompts were used)—not a fake product feature.

---

## Projects

| Key | Folder | Display name | Sidebar variant |
|-----|--------|--------------|-----------------|
| `ecommerce-fullstack` | `Antigravity_Ecommerce_Fullstack` | E-Commerce Web Application | A (classic store + admin) |
| `multi-agent` | `Antigravity_Ecommerce_Multi_Agent` | Multi-Agent E-Commerce Assistant | A (current nav matches Fullstack) |
| `single-agent` | `Antigravity_Ecommerce_Single_Agent` | E-Commerce AI Shopping Agent | B (chat / agent) |
| `agentic-rag` | `Antigravity_Ecommerce_Agentic_RAG` | Agentic RAG E-Commerce Assistant | B (chat / agent + RAG) |

---

## 1. Sidebar inventory

### 1.1 BRD (all 4 projects)

- Overview
- Functional Requirements
- Non-Functional Requirements
- User Stories
- Conclusion

### 1.2 Variant A — Fullstack + Multi-Agent

**UI/UX:** Overview, Design System, Customer Pages, Admin Pages, Navigation Flow, Conclusion

**Architectural:** Overview, System Architecture, Database Design, API Design, Security Architecture, Conclusion

**Development:** Overview, Prompt Library, Frontend Development, Backend Development, Database Implementation, Testing & QA, Conclusion

**Testing:** Overview, Test Planning, Unit Testing, Integration Testing, Performance Testing, Conclusion

**Deployment:** Overview, Deployment Planning, Environment Setup, Final Steps

### 1.3 Variant B — Single Agent + Agentic RAG

**UI/UX:** Overview, Design System, Chat Interface Design, User Experience Flow, Navigation Flow, Conclusion

**Architectural:** Overview, System Architecture, Database Design, API Design, AI Integration Architecture, Security Architecture, Conclusion

**Development:** Overview, Prompt Library, Backend Development, Tool Modules Development, Frontend Development, Database Implementation, AI Integration Development, Testing & QA, Conclusion

**Testing:** Overview, Test Planning, Unit Testing, Integration Testing, Chat Interface Testing, Performance Testing, Conclusion

**Deployment:** Overview, Deployment Planning, Environment Setup, Database Migration Deployment, Final Steps

---

## 2. How to use each prompt

1. Copy the prompt for the correct **project + phase**.
2. Paste into Antigravity / your LLM with the project context available.
3. Require the model to save **only** the named markdown file.
4. Verify every mandatory heading exists before accepting the document.

---

# 3. Static prompts — E-Commerce Web Application (Fullstack)

## 3.1 BRD — Fullstack → `BRD.md`

```text
You are a Forward Deployed Engineer. Create BRD.md for the E-Commerce Web Application (React + FastAPI + PostgreSQL).

The document MUST use exactly these top-level headings (in order), matching the LMS BRD sidebar.
Do not omit any section. Do not rename headings.

## Overview
## Functional Requirements
## Non-Functional Requirements
## User Stories
## Conclusion

Under each heading include:
- Overview: business problem, project goals, primary users (customer, admin), in scope, out of scope, success criteria.
- Functional Requirements: numbered FR list covering register/login, browse/search/product detail, cart, checkout/orders, admin product/category/order management.
- Non-Functional Requirements: performance, security, availability, usability, maintainability (measurable where possible).
- User Stories: for customer and admin roles; each story has ID, role, story statement, and acceptance criteria.
- Conclusion: summary of scope decisions and what the next phase (UI/UX) must deliver.

Keep scope simple. Do not add marketplace, payments gateway complexity, or features not listed. After saving BRD.md, stop.
```

## 3.2 UI/UX — Fullstack → `UI_UX.md`

```text
You are a Forward Deployed Engineer. Create UI_UX.md for the E-Commerce Web Application.

The document MUST use exactly these top-level headings (in order), matching the LMS UI/UX sidebar.
Do not omit any section. Do not rename headings.

## Overview
## Design System
## Customer Pages
## Admin Pages
## Navigation Flow
## Conclusion

Under each heading include:
- Overview: design goals, target devices, alignment with BRD.md.
- Design System: colors, typography, spacing, buttons, forms, cards, empty/loading/error states.
- Customer Pages: wireframe-level description of home, catalog, product detail, cart, checkout, orders, auth screens.
- Admin Pages: wireframe-level description of admin login, products, categories, orders.
- Navigation Flow: primary user journeys (customer shop → checkout; admin manage catalog/orders) as step lists.
- Conclusion: open UX risks and handoff notes for Architecture.

Do not implement UI code. After saving UI_UX.md, stop.
```

## 3.3 Architectural — Fullstack → `ARCHITECTURE.md`

```text
You are a Forward Deployed Engineer. Create ARCHITECTURE.md for the E-Commerce Web Application.

The document MUST use exactly these top-level headings (in order), matching the LMS Architectural sidebar.
Do not omit any section. Do not rename headings.

## Overview
## System Architecture
## Database Design
## API Design
## Security Architecture
## Conclusion

Under each heading include:
- Overview: goals, constraints, alignment with BRD.md and UI_UX.md.
- System Architecture: React frontend, FastAPI backend, PostgreSQL; component diagram (text); request flow.
- Database Design: entities (users, products, categories, cart, orders, order_items), key relationships, indexes.
- API Design: main REST endpoints grouped by auth, products, cart, orders, admin; request/response summary.
- Security Architecture: auth (JWT/session), password hashing, role checks, CORS, secrets handling.
- Conclusion: ADRs or key decisions and risks for Development.

Do not write application code. After saving ARCHITECTURE.md, stop.
```

## 3.4 Development — Fullstack → `CODING.md`

```text
You are a Forward Deployed Engineer. Create CODING.md (development plan / build guide) for the E-Commerce Web Application.

The document MUST use exactly these top-level headings (in order), matching the LMS Development sidebar.
Do not omit any section. Do not rename headings.

## Overview
## Prompt Library
## Frontend Development
## Backend Development
## Database Implementation
## Testing & QA
## Conclusion

Under each heading include:
- Overview: build order, repo layout, prerequisites from ARCHITECTURE.md.
- Prompt Library: short reference listing which Antigravity/day prompts (or tools) will be used for FE/BE/DB work—not product features.
- Frontend Development: React pages/components to implement mapped to Customer/Admin screens.
- Backend Development: FastAPI routers/services to implement mapped to API Design.
- Database Implementation: migrations/schema creation steps and seed data.
- Testing & QA: what to verify at unit/API/UI smoke level during build.
- Conclusion: definition of done for the coding phase.

Do not dump full source code; give structured implementation guidance. After saving CODING.md, stop.
```

## 3.5 Testing — Fullstack → `TESTING.md`

```text
You are a Forward Deployed Engineer. Create TESTING.md for the E-Commerce Web Application.

The document MUST use exactly these top-level headings (in order), matching the LMS Testing sidebar.
Do not omit any section. Do not rename headings.

## Overview
## Test Planning
## Unit Testing
## Integration Testing
## Performance Testing
## Conclusion

Under each heading include:
- Overview: test objectives, environments, entry/exit criteria.
- Test Planning: scope, risk areas (auth, cart, checkout, admin), traceability to BRD FRs.
- Unit Testing: backend model/service tests and frontend unit targets.
- Integration Testing: API + DB flows (register→login→cart→order; admin CRUD).
- Performance Testing: basic load/latency expectations for catalog and checkout APIs.
- Conclusion: residual risks and go/no-go checklist.

After saving TESTING.md, stop.
```

## 3.6 Deployment — Fullstack → `DEPLOYMENT.md`

```text
You are a Forward Deployed Engineer. Create DEPLOYMENT.md for the E-Commerce Web Application.

The document MUST use exactly these top-level headings (in order), matching the LMS Deployment sidebar.
Do not omit any section. Do not rename headings.

## Overview
## Deployment Planning
## Environment Setup
## Final Steps

Under each heading include:
- Overview: target hosting (e.g. Render + managed Postgres), success criteria.
- Deployment Planning: services (frontend static, backend web, database), env vars, health checks, CORS.
- Environment Setup: step-by-step local vs production config, secrets, build/start commands.
- Final Steps: smoke verification URLs, rollback notes, handover checklist.

After saving DEPLOYMENT.md, stop.
```

---

# 4. Static prompts — Multi-Agent E-Commerce Assistant

> Sidebar variant **A** (same tab labels as Fullstack in current `navigation.js`). Content must describe the **multi-agent** product.

## 4.1 BRD — Multi-Agent → `BRD.md`

```text
You are a Forward Deployed Engineer. Create BRD.md for the Multi-Agent E-Commerce Assistant (LangGraph multi-agent system on top of the e-commerce stack).

The document MUST use exactly these top-level headings (in order), matching the LMS BRD sidebar.
Do not omit any section. Do not rename headings.

## Overview
## Functional Requirements
## Non-Functional Requirements
## User Stories
## Conclusion

Under each heading include:
- Overview: business problem (complex shop questions need specialized agents), goals, users, in/out of scope, success criteria, reuse of existing shop app.
- Functional Requirements: numbered FRs for multi-agent routing, specialized agent roles, grounded answers from store data, escalation/fallback, chat or assistant entry points as in scope.
- Non-Functional Requirements: latency, reliability, security, observability, cost controls.
- User Stories: shopper and ops/admin stakeholders; ID + acceptance criteria each.
- Conclusion: summary and next phase (UI/UX).

Do not implement agents yet. After saving BRD.md, stop.
```

## 4.2 UI/UX — Multi-Agent → `UI_UX.md`

```text
You are a Forward Deployed Engineer. Create UI_UX.md for the Multi-Agent E-Commerce Assistant.

The document MUST use exactly these top-level headings (in order), matching the LMS UI/UX sidebar.
Do not omit any section. Do not rename headings.

## Overview
## Design System
## Customer Pages
## Admin Pages
## Navigation Flow
## Conclusion

Under each heading include:
- Overview: UX goals for adding multi-agent assistance without redesigning the whole shop.
- Design System: tokens and chat/assistant UI patterns consistent with the existing app.
- Customer Pages: where the assistant appears on customer journeys; message list, input, loading, citations/agent-role indicators if any.
- Admin Pages: any admin-facing monitoring or configuration screens in scope (or explicitly mark N/A with rationale).
- Navigation Flow: customer asks → agent graph → answer; error and out-of-scope paths.
- Conclusion: UX risks and Architecture handoff.

Do not implement UI. After saving UI_UX.md, stop.
```

## 4.3 Architectural — Multi-Agent → `ARCHITECTURE.md`

```text
You are a Forward Deployed Engineer. Create ARCHITECTURE.md for the Multi-Agent E-Commerce Assistant.

The document MUST use exactly these top-level headings (in order), matching the LMS Architectural sidebar.
Do not omit any section. Do not rename headings.

## Overview
## System Architecture
## Database Design
## API Design
## Security Architecture
## Conclusion

Under each heading include:
- Overview: constraints and alignment with BRD/UI_UX.
- System Architecture: React → FastAPI → LangGraph multi-agent orchestrator → tools/data → PostgreSQL; text diagram; agent roles.
- Database Design: existing shop tables reused + any new tables (sessions, traces, message logs) if needed.
- API Design: assistant/ask endpoints plus reuse of existing commerce APIs.
- Security Architecture: auth on assistant routes, tool allowlists, PII/secret handling, prompt-injection defenses.
- Conclusion: key decisions and Development risks.

Do not write production code. After saving ARCHITECTURE.md, stop.
```

## 4.4 Development — Multi-Agent → `CODING.md`

```text
You are a Forward Deployed Engineer. Create CODING.md for the Multi-Agent E-Commerce Assistant.

The document MUST use exactly these top-level headings (in order), matching the LMS Development sidebar.
Do not omit any section. Do not rename headings.

## Overview
## Prompt Library
## Frontend Development
## Backend Development
## Database Implementation
## Testing & QA
## Conclusion

Under each heading include:
- Overview: build order for orchestrator, agents, API, UI hooks.
- Prompt Library: reference to day/prompts used for multi-agent build.
- Frontend Development: customer/admin UI changes for the assistant.
- Backend Development: FastAPI routes + LangGraph graph wiring.
- Database Implementation: migrations/seeds for any new tables.
- Testing & QA: routing correctness, tool safety, smoke paths.
- Conclusion: definition of done.

After saving CODING.md, stop.
```

## 4.5 Testing — Multi-Agent → `TESTING.md`

```text
You are a Forward Deployed Engineer. Create TESTING.md for the Multi-Agent E-Commerce Assistant.

The document MUST use exactly these top-level headings (in order), matching the LMS Testing sidebar.
Do not omit any section. Do not rename headings.

## Overview
## Test Planning
## Unit Testing
## Integration Testing
## Performance Testing
## Conclusion

Under each heading include:
- Overview: objectives for multi-agent quality.
- Test Planning: cases for routing, each agent role, fallback, out-of-scope.
- Unit Testing: graph nodes/tools unit tests.
- Integration Testing: API → orchestrator → DB end-to-end scenarios.
- Performance Testing: p95 latency and concurrency expectations for /ask-style endpoints.
- Conclusion: go/no-go checklist.

After saving TESTING.md, stop.
```

## 4.6 Deployment — Multi-Agent → `DEPLOYMENT.md`

```text
You are a Forward Deployed Engineer. Create DEPLOYMENT.md for the Multi-Agent E-Commerce Assistant.

The document MUST use exactly these top-level headings (in order), matching the LMS Deployment sidebar.
Do not omit any section. Do not rename headings.

## Overview
## Deployment Planning
## Environment Setup
## Final Steps

Under each heading include:
- Overview: hosting targets and success criteria for the multi-agent feature.
- Deployment Planning: services, LLM keys, env vars, health checks.
- Environment Setup: local and production setup steps.
- Final Steps: smoke tests (routing sample questions), rollback, handover.

After saving DEPLOYMENT.md, stop.
```

---

# 5. Static prompts — E-Commerce AI Shopping Agent (Single Agent)

## 5.1 BRD — Single Agent → `BRD.md`

```text
You are a Forward Deployed Engineer. Create BRD.md for the E-Commerce AI Shopping Agent (“Ask the Store”) built on the existing React + FastAPI + PostgreSQL shop.

The document MUST use exactly these top-level headings (in order), matching the LMS BRD sidebar.
Do not omit any section. Do not rename headings.

## Overview
## Functional Requirements
## Non-Functional Requirements
## User Stories
## Conclusion

Under each heading include:
- Overview: business problem, Ask the Store goal, target users, in-scope question types (products, categories, customers, orders, stock/sales totals as allowed), out of scope, read-only rule, success criteria, reused app parts.
- Functional Requirements: numbered FRs for ask UI/API, grounded answers, safe refusals, auth expectations.
- Non-Functional Requirements: latency, accuracy/groundedness, security, observability.
- User Stories: customer (and staff if in scope) with acceptance criteria.
- Conclusion: next phase (UI/UX).

Do not build the agent yet. After saving BRD.md, stop.
```

## 5.2 UI/UX — Single Agent → `UI_UX.md`

```text
You are a Forward Deployed Engineer. Create UI_UX.md for the Ask the Store single-agent feature.

The document MUST use exactly these top-level headings (in order), matching the LMS UI/UX sidebar.
Do not omit any section. Do not rename headings.

## Overview
## Design System
## Chat Interface Design
## User Experience Flow
## Navigation Flow
## Conclusion

Under each heading include:
- Overview: UX goals; match existing React look and feel; no full redesign.
- Design System: colors/typography/components reused; chat-specific tokens.
- Chat Interface Design: question input, Ask button, loading, answer area, no-data / out-of-scope / error / empty states; mobile behavior; what must never be shown.
- User Experience Flow: happy path and failure paths.
- Navigation Flow: where Ask the Store sits in the existing app IA.
- Conclusion: handoff to Architecture.

Do not implement UI. After saving UI_UX.md, stop.
```

## 5.3 Architectural — Single Agent → `ARCHITECTURE.md`

```text
You are a Forward Deployed Engineer. Create ARCHITECTURE.md for the Ask the Store single-agent feature.

The document MUST use exactly these top-level headings (in order), matching the LMS Architectural sidebar.
Do not omit any section. Do not rename headings.

## Overview
## System Architecture
## Database Design
## API Design
## AI Integration Architecture
## Security Architecture
## Conclusion

Under each heading include:
- Overview: constraints and alignment with BRD/UI_UX.
- System Architecture: React UI → FastAPI /agent/ask → LangGraph (or LangChain) agent → approved store data → PostgreSQL → answer.
- Database Design: existing tables reused; any new logging/session tables.
- API Design: ask endpoint contract; auth; error shapes.
- AI Integration Architecture: tools, grounding, model choice, prompt structure, no free-form DB access.
- Security Architecture: auth gate, read-only rule, secret handling, injection defenses.
- Conclusion: Development risks.

After saving ARCHITECTURE.md, stop.
```

## 5.4 Development — Single Agent → `CODING.md`

```text
You are a Forward Deployed Engineer. Create CODING.md for the Ask the Store single-agent feature.

The document MUST use exactly these top-level headings (in order), matching the LMS Development sidebar.
Do not omit any section. Do not rename headings.

## Overview
## Prompt Library
## Backend Development
## Tool Modules Development
## Frontend Development
## Database Implementation
## AI Integration Development
## Testing & QA
## Conclusion

Under each heading include:
- Overview: build sequence for agent feature.
- Prompt Library: day/prompt references used for this build.
- Backend Development: FastAPI project structure and ask route.
- Tool Modules Development: approved data-access tools only.
- Frontend Development: Ask the Store React UI.
- Database Implementation: any migrations; reuse Neon/Postgres.
- AI Integration Development: agent graph wiring, prompts, grounding.
- Testing & QA: unit/integration smoke for ask path.
- Conclusion: definition of done.

After saving CODING.md, stop.
```

## 5.5 Testing — Single Agent → `TESTING.md`

```text
You are a Forward Deployed Engineer. Create TESTING.md for the Ask the Store single-agent feature.

The document MUST use exactly these top-level headings (in order), matching the LMS Testing sidebar.
Do not omit any section. Do not rename headings.

## Overview
## Test Planning
## Unit Testing
## Integration Testing
## Chat Interface Testing
## Performance Testing
## Conclusion

Under each heading include:
- Overview: quality goals for the agent feature.
- Test Planning: in-scope vs out-of-scope question matrix; auth cases.
- Unit Testing: tools and agent nodes.
- Integration Testing: API → agent → DB.
- Chat Interface Testing: UI states (loading, empty, error, refusal).
- Performance Testing: latency/token budget expectations.
- Conclusion: go/no-go checklist.

After saving TESTING.md, stop.
```

## 5.6 Deployment — Single Agent → `DEPLOYMENT.md`

```text
You are a Forward Deployed Engineer. Create DEPLOYMENT.md for the Ask the Store single-agent feature.

The document MUST use exactly these top-level headings (in order), matching the LMS Deployment sidebar.
Do not omit any section. Do not rename headings.

## Overview
## Deployment Planning
## Environment Setup
## Database Migration Deployment
## Final Steps

Under each heading include:
- Overview: deploy targets and success criteria.
- Deployment Planning: frontend/backend services, OPENAI (or LLM) keys, health checks.
- Environment Setup: local and production env vars.
- Database Migration Deployment: how schema changes (if any) are applied safely.
- Final Steps: smoke ask questions, rollback, handover.

After saving DEPLOYMENT.md, stop.
```

---

# 6. Static prompts — Agentic RAG E-Commerce Assistant

## 6.1 BRD — Agentic RAG → `BRD.md`

```text
You are a Forward Deployed Engineer. Create BRD.md for the Agentic RAG E-Commerce Assistant (retrieval-augmented agent over store knowledge + existing shop APIs).

The document MUST use exactly these top-level headings (in order), matching the LMS BRD sidebar.
Do not omit any section. Do not rename headings.

## Overview
## Functional Requirements
## Non-Functional Requirements
## User Stories
## Conclusion

Under each heading include:
- Overview: problem (policy/FAQ/product knowledge + transactional questions), goals, users, RAG vs tool-calling scope, in/out of scope, success criteria, reused stack.
- Functional Requirements: numbered FRs for ingest/index, retrieve, agent tool use, cited answers, refusals, ticket/escalation if in scope.
- Non-Functional Requirements: retrieval quality, latency, security, freshness of index, observability.
- User Stories: with acceptance criteria for ask + citation behaviors.
- Conclusion: next phase (UI/UX).

After saving BRD.md, stop.
```

## 6.2 UI/UX — Agentic RAG → `UI_UX.md`

```text
You are a Forward Deployed Engineer. Create UI_UX.md for the Agentic RAG E-Commerce Assistant.

The document MUST use exactly these top-level headings (in order), matching the LMS UI/UX sidebar.
Do not omit any section. Do not rename headings.

## Overview
## Design System
## Chat Interface Design
## User Experience Flow
## Navigation Flow
## Conclusion

Under each heading include:
- Overview: UX goals for RAG answers with citations.
- Design System: consistency with existing shop UI.
- Chat Interface Design: input, send, loading, answer, citation chips/sources, low-confidence / escalate states, empty/error.
- User Experience Flow: retrieve → answer → cite; failure paths.
- Navigation Flow: placement inside the existing application.
- Conclusion: Architecture handoff.

Do not implement UI. After saving UI_UX.md, stop.
```

## 6.3 Architectural — Agentic RAG → `ARCHITECTURE.md`

```text
You are a Forward Deployed Engineer. Create ARCHITECTURE.md for the Agentic RAG E-Commerce Assistant.

The document MUST use exactly these top-level headings (in order), matching the LMS Architectural sidebar.
Do not omit any section. Do not rename headings.

## Overview
## System Architecture
## Database Design
## API Design
## AI Integration Architecture
## Security Architecture
## Conclusion

Under each heading include:
- Overview: constraints and BRD/UI_UX alignment.
- System Architecture: React → FastAPI → agent + retriever (FAISS/vector store) → Postgres/docs → grounded answer.
- Database Design: shop tables + FAQ/document metadata tables if needed.
- API Design: /ask (or equivalent), ingest/admin endpoints if in scope.
- AI Integration Architecture: chunking, embeddings, top-k, agent tools, citation assembly, hallucination controls.
- Security Architecture: auth, access filtering before context hits the LLM, secret handling.
- Conclusion: Development risks.

After saving ARCHITECTURE.md, stop.
```

## 6.4 Development — Agentic RAG → `CODING.md`

```text
You are a Forward Deployed Engineer. Create CODING.md for the Agentic RAG E-Commerce Assistant.

The document MUST use exactly these top-level headings (in order), matching the LMS Development sidebar.
Do not omit any section. Do not rename headings.

## Overview
## Prompt Library
## Backend Development
## Tool Modules Development
## Frontend Development
## Database Implementation
## AI Integration Development
## Testing & QA
## Conclusion

Under each heading include:
- Overview: build order (ingest → retrieve → agent → API → UI).
- Prompt Library: day/prompt references for this project.
- Backend Development: FastAPI services and routes.
- Tool Modules Development: retrieval tool + safe commerce/data tools.
- Frontend Development: chat UI with citations.
- Database Implementation: schema/migrations/seeds for docs/FAQs.
- AI Integration Development: embeddings, index build, agent wiring.
- Testing & QA: groundedness and smoke paths.
- Conclusion: definition of done.

After saving CODING.md, stop.
```

## 6.5 Testing — Agentic RAG → `TESTING.md`

```text
You are a Forward Deployed Engineer. Create TESTING.md for the Agentic RAG E-Commerce Assistant.

The document MUST use exactly these top-level headings (in order), matching the LMS Testing sidebar.
Do not omit any section. Do not rename headings.

## Overview
## Test Planning
## Unit Testing
## Integration Testing
## Chat Interface Testing
## Performance Testing
## Conclusion

Under each heading include:
- Overview: RAG quality + reliability goals.
- Test Planning: golden questions, citation checks, refusal cases.
- Unit Testing: chunking, retriever, tools.
- Integration Testing: ask path with index + DB.
- Chat Interface Testing: citation chips and error states.
- Performance Testing: retrieval + generation latency budgets.
- Conclusion: go/no-go checklist.

After saving TESTING.md, stop.
```

## 6.6 Deployment — Agentic RAG → `DEPLOYMENT.md`

```text
You are a Forward Deployed Engineer. Create DEPLOYMENT.md for the Agentic RAG E-Commerce Assistant.

The document MUST use exactly these top-level headings (in order), matching the LMS Deployment sidebar.
Do not omit any section. Do not rename headings.

## Overview
## Deployment Planning
## Environment Setup
## Database Migration Deployment
## Final Steps

Under each heading include:
- Overview: hosting and index hosting assumptions.
- Deployment Planning: API, frontend, DB, vector index rebuild strategy, env vars, health checks.
- Environment Setup: local vs production.
- Database Migration Deployment: schema + reindex steps.
- Final Steps: smoke RAG questions with citations, rollback, handover.

After saving DEPLOYMENT.md, stop.
```

---

## 7. Checklist (24 prompts)

| Project | BRD | UI/UX | Arch | Dev | Test | Deploy |
|---------|-----|-------|------|-----|------|--------|
| Fullstack | §3.1 | §3.2 | §3.3 | §3.4 | §3.5 | §3.6 |
| Multi-Agent | §4.1 | §4.2 | §4.3 | §4.4 | §4.5 | §4.6 |
| Single Agent | §5.1 | §5.2 | §5.3 | §5.4 | §5.5 | §5.6 |
| Agentic RAG | §6.1 | §6.2 | §6.3 | §6.4 | §6.5 | §6.6 |

---

## 8. Related paths (read-only references)

- `Realtime_projects/Antigravity_Ecommerce_Fullstack/shared/navigation.js`
- `Realtime_projects/Antigravity_Ecommerce_Multi_Agent/shared/navigation.js`
- `Realtime_projects/Antigravity_Ecommerce_Single_Agent/shared/navigation.js`
- `Realtime_projects/Antigravity_Ecommerce_Agentic_RAG/shared/navigation.js`
