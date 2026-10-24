import { fence } from './lesson.mjs'
import { RETAIL_CASE } from './_retail-story.mjs'

export default {
  stage: {
    slug: 'enterprise-ai-fde',
    name: 'Enterprise AI FDE',
    weeksLabel: 'Week 10',
    hours: 3,
    cardBlurb: 'Security, Langfuse observability, evals, and sponsor handover.',
    description: 'Security, Langfuse observability, evals, and sponsor handover.',
    outcomes: [
      'Complete IT security questionnaire with evidence',
      'Configure Langfuse for traces and regression eval visibility',
      'Deliver handover package and sponsor readout',
    ],
    readyWhen: 'Security answers and Langfuse evidence exist; five-minute sponsor readout is rehearsed.',
  },
  items: [
    {
      slug: 'security-reviews',
      type: 'read',
      title: 'IT security questionnaire',
      minutes: 25,
      summary: 'Five direct answers: data, hosting, admin FAQ isolation, secrets, wrong-answer handling.',
      lesson: {
        explain: `
${RETAIL_CASE}

1. **Data processed:** FAQ text and user questions (no credentials in FAQs).
2. **Hosting:** production URL; FAQ storage location.
3. **Admin content:** server-side role filter; staff cannot retrieve admin-only chunks.
4. **Secrets:** environment variables on Render/AWS—not in Git.
5. **Incorrect answers:** source citation, refusal path, feedback to IT lead.
`,
        template: fence(`
SECURITY ANSWERS
1 Data:
2 Hosting:
3 Admin FAQ:
4 Secrets:
5 Wrong answers:
`),
      },
      objectives: ['Complete five answers with specifics'],
      checkpoints: ['Evidence for admin isolation?'],
    },
    {
      slug: 'langfuse-observability-evals',
      type: 'read',
      title: 'Langfuse: traces, evals, and evidence',
      minutes: 25,
      summary: 'Instrument ask requests in Langfuse; attach regression scores; export evidence for IT and sponsor.',
      lesson: {
        explain: `
**Langfuse** provides trace history per question (latency, retrieval, model call) and supports evaluation datasets.

Configure Langfuse keys via environment variables. Log each \`/ask\` invocation with correlation id. Import or score the 20-question regression set; store summary scores for handover.

Do not log API keys or full restricted FAQ text in traces.
`,
        steps: `
1. Create Langfuse project; add keys to .env.
2. Wrap ask pipeline with trace context.
3. Run regression; record scores in Langfuse or linked report.
4. Capture one trace screenshot for security pack.
`,
        mistakes: ['Secrets in trace payloads', 'No eval record after FAQ change'],
      },
      objectives: ['Langfuse receiving traces', 'Regression scores documented'],
      checkpoints: ['What do you show IT from Langfuse?'],
    },
    {
      slug: 'executive-communication-handover',
      type: 'read',
      title: 'Sponsor readout and handover package',
      minutes: 20,
      summary: 'Five-minute structure: scope, demo proof, risks, ask; README, runbook, security, tests.',
      lesson: {
        explain: `
**Readout:** what was built → evidence (regression, pilots, Langfuse) → risks and mitigations → decision request.

**Handover:** README, runbook.md, security-answers.md, questions.csv, Langfuse eval summary, .env.example.
`,
        template: fence(`
READOUT (5 min)
Built:
Evidence:
Risks:
Ask sponsor:
HANDOVER FILES: ...
`),
      },
      objectives: ['Outline readout', 'List handover artifacts'],
      checkpoints: ['What do you ask the sponsor to decide?'],
    },
    {
      slug: 'enterprise-integration',
      type: 'read',
      title: 'Phase 2 integrations (documentation only)',
      minutes: 20,
      summary: 'Document future SSO, ticketing, or intranet embedding without building in phase 1.',
      lesson: {
        explain: `
Record phase 2 candidates: corporate identity provider, ticket creation handoff, intranet link. One slide **Now vs Later** is sufficient for this workshop.
`,
      },
      objectives: ['Name two phase 2 items'],
      checkpoints: ['What remains in phase 1?'],
    },
    {
      slug: 'security-questionnaire-lab',
      type: 'lab',
      title: 'Lab: Langfuse wiring and eval run',
      minutes: 45,
      summary: 'Connect Langfuse, execute regression with tracing, export eval summary for handover.',
      lesson: {
        steps: `
1. Configure Langfuse on localhost or production URL.
2. Run full 20-question set; confirm traces.
3. Save eval summary and one trace screenshot.
4. Update security-answers.md with observability evidence.
`,
      },
      objectives: ['Traces and eval summary delivered'],
      checkpoints: ['Any secret leaked in traces?'],
      extras: {
        deliverables: ['Langfuse eval summary', 'security-answers.md'],
      },
    },
    {
      slug: 'executive-readout-lab',
      type: 'lab',
      title: 'Lab: rehearse sponsor readout',
      minutes: 25,
      summary: 'Five-minute timed readout plus two-minute demo.',
      lesson: {
        steps: `Prepare four bullets → rehearse with timer → incorporate feedback.`,
      },
      objectives: ['Readout within time limit'],
      checkpoints: ['Clear sponsor ask?'],
      extras: {
        deliverables: ['Slides or speaker notes'],
      },
    },
    {
      slug: 'external-model-blocked',
      type: 'interview',
      title: 'Practice: approved models only',
      minutes: 10,
      summary: 'Align with IT on approved providers; rerun regression on approved model.',
      lesson: {
        example: `"I request the approved model list from IT, rerun the 20-question regression on the approved endpoint, and compare scores before switching production configuration."`,
      },
      objectives: ['IT alignment and retest'],
      checkpoints: ['Why rerun regression?'],
    },
    {
      slug: 'say-no-use-case',
      type: 'interview',
      title: 'Practice: defer ticketing scope',
      minutes: 10,
      summary: 'Professional deferral to phase 2 with reference to BRD.',
      lesson: {
        example: `"Ticketing is scheduled for phase 2 after FAQ assistant acceptance. We will complete regression and pilot evidence for phase 1 first."`,
      },
      objectives: ['Defer with written scope reference'],
      checkpoints: ['Phase 1 vs phase 2?'],
    },
  ],
}
