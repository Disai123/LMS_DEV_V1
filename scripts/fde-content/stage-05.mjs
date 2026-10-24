import { fence } from './lesson.mjs'
import { RETAIL_CASE } from './_retail-story.mjs'

export default {
  stage: {
    slug: 'fde-sdlc-architecture',
    weeksLabel: 'Week 8',
    hours: 3,
    cardBlurb: 'Reference architecture, permissions, cost, and decisions.',
    description: 'Reference architecture, permissions, cost, and decisions.',
    outcomes: [
      'Document end-to-end architecture for Ask IT',
      'Define role-based FAQ access on the server',
      'Estimate monthly AI cost and record one architecture decision',
    ],
    readyWhen: 'Diagram, FAQ tags, cost estimate, and ADR are documented and explainable.',
  },
  items: [
    {
      slug: 'solution-architecture-ai-apps',
      type: 'read',
      title: 'Solution architecture and diagram',
      minutes: 30,
      summary: 'Browser, API, FAQ storage, retrieval, and LLM—with hosting on Render or AWS when deployed.',
      lesson: {
        explain: `
${RETAIL_CASE}

**Components:** web client, FastAPI backend, FAQ storage, retrieval (RAG), LLM API. Authentication distinguishes **staff** and **admin**; role checks occur on the server.

**Reference diagram:**

![Ask IT reference architecture](/fde/retail-ask-it-architecture.svg)

Pilot hosting may use **Render** or **AWS** (App Runner, Elastic Beanstalk, or equivalent); secrets via environment variables only.
`,
        steps: `
1. Label each box in the diagram for your implementation.
2. Explain the data path in three minutes to a peer.
`,
        mistakes: ['Client-only role checks', 'API keys in source control'],
      },
      objectives: ['Name five architectural components', 'Explain staff vs admin data path'],
      checkpoints: ['Where is role enforced?', 'Where do FAQ files live?'],
    },
    {
      slug: 'permissions-security-boundaries',
      type: 'read',
      title: 'Permission model for restricted FAQs',
      minutes: 25,
      summary: 'Tag FAQ chunks as staff_ok or admin_only; filter retrieval by authenticated role on the server.',
      lesson: {
        explain: `
Tag each chunk **staff_ok** or **admin_only**. Staff queries search staff_ok only; admin may search both. Enforce in FastAPI before returning any answer.

Store LLM and provider credentials in **.env** or host environment—never in Git.
`,
        template: fence(`
FAQ TAGS
File                    | staff_ok | admin_only
WiFi-FAQ.pdf            |    x     |
Admin-only-notes.pdf    |          |     x
`),
      },
      objectives: ['Define tagging and server-side filter', 'Plan one staff negative test'],
      checkpoints: ['Why server-side enforcement?'],
    },
    {
      slug: 'cost-latency-estimation',
      type: 'read',
      title: 'Cost and latency estimate',
      minutes: 20,
      summary: 'Monthly question volume × unit cost; expect roughly 2–5 seconds per answer with loading state.',
      lesson: {
        explain: `
Estimate monthly questions from user count and usage assumptions. Multiply by provider price per request. Add host cost (Render or AWS). Document a monthly range for the sponsor.

Show a loading indicator during retrieval and generation; set a timeout with a user-friendly error message.
`,
        template: fence(`
Questions/month: __
Cost per question (est.): $__
Monthly AI + host (range): $__
`),
      },
      objectives: ['Produce a written cost range', 'State expected latency'],
      checkpoints: ['What drives monthly AI cost?'],
    },
    {
      slug: 'architecture-decision-records',
      type: 'read',
      title: 'Architecture decision record (ADR)',
      minutes: 15,
      summary: 'One half-page ADR: decision, rationale, alternatives rejected.',
      lesson: {
        example: fence(`
Decision: FAQ folder + RAG for phase 1.
Because: Existing FAQs; fastest validated outcome.
Not chosen: Full ITSM integration in phase 1.
`),
        template: fence(`
ADR-001
Decision:
Because:
Not chosen:
`),
      },
      objectives: ['Write ADR-001'],
      checkpoints: ['What is explicitly deferred to phase 2?'],
    },
    {
      slug: 'northwind-architecture-lab',
      type: 'lab',
      title: 'Architecture lab: diagram, tags, cost, ADR',
      minutes: 75,
      summary: 'Complete diagram labels, FAQ tag table, cost estimate, and ADR-001.',
      lesson: {
        steps: `
1. Annotate architecture diagram for your repo layout.
2. Complete FAQ tag table.
3. Fill cost template.
4. Save ADR-001 under docs/.
5. Three-minute walkthrough with a peer.
`,
      },
      objectives: ['Deliver diagram, tags, cost, ADR'],
      checkpoints: ['Can a peer explain the diagram back?'],
      extras: {
        deliverables: ['Diagram export', 'FAQ tags', 'Cost note', 'ADR-001'],
      },
    },
    {
      slug: 'document-assistant-permissions',
      type: 'interview',
      title: 'Practice: restrict admin FAQ content',
      minutes: 15,
      summary: 'Explain how staff cannot receive answers sourced from admin-only FAQs.',
      lesson: {
        example: `
"Chunks are tagged by sensitivity. The API filters the retrieval index by role before generation. We verify with a staff login question that exists only in admin-only content—it must refuse, not leak."
`,
      },
      objectives: ['Explain tags, server filter, and test case'],
      checkpoints: ['Where is the filter applied?'],
      extras: {
        prompt: 'Some FAQ files are admin-only. How do you prevent staff from seeing those answers?',
        rubric: ['Server-side enforcement', 'Concrete test'],
      },
    },
  ],
}
