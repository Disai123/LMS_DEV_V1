import { fence } from './lesson.mjs'

const CAPSTONE_SCOPE = `
**Ecommerce Multi RAG agent** is the capstone sequence: three integrated modules on a shared stack (React, FastAPI, PostgreSQL). Complete modules in order.

1. **Ecommerce Full stack** — catalog, cart, checkout, orders.
2. **Ecommerce Multi Agent** — LangGraph agents with tools over live store data (scoped writes).
3. **Ecommerce Agentic RAG** — FAISS over approved product manuals; cited answers; no cart mutations.

Shared rules: one frontend and API; separate backend packages for multi-agent and agentic RAG; Langfuse for traces and evals; secrets via environment variables only.

${fence(`
backend/
  app/
  ecommerce/
  agents/multi_agent/
  agents/agentic_rag/
frontend/
`)}
`

export default {
  stage: {
    slug: 'capstone-fde',
    name: 'Capstone Project',
    weeksLabel: 'Weeks 11–12',
    hours: 10,
    cardBlurb: 'Ecommerce Multi RAG agent: full stack, multi-agent, and agentic RAG modules.',
    description: 'Three-module capstone: e-commerce core, multi-agent assistant, agentic RAG assistant.',
    outcomes: [
      'Deliver core commerce flows on React, FastAPI, and PostgreSQL',
      'Ship multi-agent and agentic RAG modules in isolated packages with Langfuse',
      'Meet module acceptance criteria documented in the capstone brief',
    ],
    readyWhen: 'All three modules pass their acceptance checks and module handover notes are complete.',
  },
  items: [
    {
      slug: 'capstone-brief-rubric',
      type: 'read',
      title: 'Capstone brief and evaluation criteria',
      minutes: 30,
      summary: 'Scope, sequence, stack, and evaluation weights for the three capstone modules.',
      lesson: {
        explain: `
This capstone applies delivery practices from Stages 3–9 at e-commerce scale. The retail Ask IT exercise is complete; this work is the **Ecommerce Multi RAG agent** track.

${CAPSTONE_SCOPE}

Maintain a brief decision log per module. Do not commit credentials to Git.
`,
        steps: `
Work packages:

1. Ecommerce Full stack
2. Ecommerce Multi Agent
3. Ecommerce Agentic RAG

Complete modules in order. Each module includes build, smoke test, and short handover notes (environment, limits, eval summary where applicable).
`,
        extra: [
          {
            heading: 'Evaluation criteria',
            body: fence(`
Module                    Requirement                              Weight
Ecommerce Full stack      Checkout works before AI modules         35%
Ecommerce Multi Agent     Live DB tools; isolated package          30%
Ecommerce Agentic RAG     FAISS + citations; no cart writes        35%
`),
          },
        ],
        mistakes: `
- Starting AI modules before commerce checkout is validated.
- Mixing RAG ingestion with multi-agent tool code without boundaries.
- Hard-coded API keys or database URLs in the repository.
`,
      },
      objectives: [
        'State module order and shared stack',
        'Map acceptance criteria to three modules',
      ],
      checkpoints: [
        'Which module uses FAISS vs live database tools?',
        'Where does Langfuse attach?',
      ],
    },
    {
      slug: 'capstone-1-discovery',
      type: 'capstone',
      title: 'Module 1: Ecommerce Full stack',
      minutes: 190,
      summary: 'Catalog, cart, checkout, auth, and PostgreSQL schema; commerce works without AI.',
      lesson: {
        explain: `
Deliver storefront flows: browse, cart, checkout, order persistence. Minimal admin or seeded catalog is acceptable for v1.

**Module time (~190 min workshop block):** ~30 min planning and checklist; ~120 min core implementation milestone; ~25 min smoke test; ~15 min handover notes.
`,
        steps: `
1. Schema: users, products, cart, orders.
2. FastAPI routes and React pages.
3. One full purchase on localhost.
4. Document API list and local setup in README.
`,
      },
      objectives: ['End-to-end purchase without AI', 'Schema documented'],
      checkpoints: ['Checkout with AI modules disabled?'],
      extras: {
        scope: 'Commerce only—no agent graphs or vector indexes.',
        acceptanceCriteria: [
          'Guest or registered checkout',
          'Orders persisted in PostgreSQL',
        ],
      },
    },
    {
      slug: 'capstone-2-design',
      type: 'capstone',
      title: 'Module 2: Ecommerce Multi Agent',
      minutes: 190,
      summary: 'LangGraph agents, live store tools, isolated agents/multi_agent/, Langfuse traces.',
      lesson: {
        explain: `
First chat surface in the React app. Code under \`agents/multi_agent/\`. Tools read inventory and pricing; writes only on an explicit allow list.

**Module time (~190 min):** tool contracts, graph orchestration, UI wiring, five scripted store queries, trace review in Langfuse.
`,
        steps: `
1. Define tool schemas and authorization rules.
2. Implement LangGraph flow.
3. Expose chat API and connect UI.
4. Langfuse trace on each turn.
5. Run five scripted store questions.
`,
      },
      objectives: ['Isolated package', 'Live DB tools', 'Langfuse traces'],
      checkpoints: ['Actions out of scope for this module?'],
    },
    {
      slug: 'capstone-3-prototype',
      type: 'capstone',
      title: 'Module 3: Ecommerce Agentic RAG',
      minutes: 190,
      summary: 'FAISS over manuals, second chat UI, citations, agents/agentic_rag/, read-only for orders.',
      lesson: {
        explain: `
Second chat surface. Ingest approved PDFs/text into FAISS with metadata. RAG path does not mutate carts or orders.

**Module time (~190 min):** ingestion pipeline, cited answers, ten-question eval set, Langfuse or written eval summary, module handover.
`,
        steps: `
1. Build FAISS index with metadata.
2. RAG flow with citations in responses.
3. Second chat panel in frontend.
4. Ten document-grounded eval questions with recorded scores.
`,
      },
      objectives: ['FAISS reproducible', 'Cited answers', 'Separate from multi-agent writes'],
      checkpoints: ['Example response with document citation?'],
    },
  ],
}
