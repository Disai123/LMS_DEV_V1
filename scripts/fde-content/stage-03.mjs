import { fence } from './lesson.mjs'
import { RETAIL_CASE } from './_retail-story.mjs'

export default {
  stage: {
    slug: 'fde-sdlc-business-requirement',
    weeksLabel: 'Week 7',
    hours: 3,
    cardBlurb: 'Discovery and a one-page requirements note for the retail Ask IT case.',
    description: 'Discovery and a one-page requirements note for the retail Ask IT case.',
    outcomes: [
      'Describe the FDE engagement lifecycle',
      'Conduct structured discovery with the IT sponsor',
      'Produce a one-page business requirements document (BRD)',
    ],
    readyWhen: 'You have discovery notes and a one-page BRD the IT lead can approve.',
  },
  items: [
    {
      slug: 'fde-role-engagement-lifecycle',
      type: 'read',
      title: 'What is an FDE?',
      minutes: 20,
      summary: 'Forward Deployed Engineers align customer problems with deliverable software through discovery, design, build, and handover.',
      lesson: {
        explain: `
A **Forward Deployed Engineer (FDE)** combines engineering with customer delivery: clarify the problem, document scope, implement incrementally, validate with evidence, and hand over runnable artifacts.

**Typical sequence in this workshop:**

1. **Discovery** — stakeholders, constraints, success measures.
2. **Design** — UI flow and solution architecture.
3. **Development** — working software on localhost.
4. **MVP/POC** — repeatable run and pilot validation.
5. **Production** — hosted deployment and operations.
6. **Enterprise handover** — security, observability, and sponsor readout.

${RETAIL_CASE}
`,
        steps: `
1. Review the retail case above.
2. Write one sentence describing the business problem.
3. Write one sentence describing measurable success for the IT lead.
`,
        mistakes: `
- Opening with technology choices before scope is agreed.
- Skipping written notes after stakeholder conversations.
- Expanding scope beyond the FAQ assistant in phase 1.
`,
      },
      objectives: ['Summarize the FDE delivery sequence', 'State the retail IT problem in one sentence'],
      checkpoints: ['What is phase 1 in scope?', 'Who is the sponsor?'],
    },
    {
      slug: 'running-discovery-session',
      type: 'read',
      title: 'Retail discovery and stakeholder questions',
      minutes: 25,
      summary: 'Structured questions covering problem, users, FAQ sources, restricted content, and success metrics.',
      lesson: {
        explain: `
Run a **30–45 minute discovery** with the IT lead. Capture answers under five headings:

1. **Current state** — how employees obtain IT answers today.
2. **Users** — who will use Ask IT (all staff, stores only, etc.).
3. **Knowledge base** — location, format, and count of FAQ documents; update process.
4. **Restrictions** — documents or topics that must not appear for standard staff.
5. **Success** — metric the sponsor will use (for example, reduction in repeat FAQ emails).

Send a short confirmation note after the session: “This is what we understood—please correct any errors.”
`,
        example: `
- Volume: ~100 IT emails weekly; high repetition on access and device topics.
- Users: ~50 employees; IT lead owns FAQ maintenance.
- Restricted FAQ: admin-only file; must not surface for staff role.
- Success: measurable drop in repeat FAQ-style emails within two months.
`,
        template: fence(`
DISCOVERY NOTES
Problem:
Users:
FAQ sources:
Restricted content:
Success metric:
Open questions:
`),
      },
      objectives: ['List five discovery areas', 'Draft at least eight specific questions'],
      checkpoints: ['Which area covers restricted FAQs?', 'Why confirm notes with the sponsor?'],
    },
    {
      slug: 'writing-a-brd',
      type: 'read',
      title: 'One-page BRD structure',
      minutes: 25,
      summary: 'Goal, users, in-scope and out-of-scope items, and a measurable success criterion on a single page.',
      lesson: {
        explain: `
The **BRD** is a one-page agreement: what will be built, what will not, and how success is measured. The IT lead should review it in about five minutes.

**Required sections:** goal, users, in scope, out of scope, success metric, open questions, approval line.

**Phase 1 in scope (retail case):** Ask IT page, answers from approved FAQs with source file name, refusal when no match, role-based exclusion of admin-only content.

**Out of scope (examples):** full ticketing, automated email replies, mobile-native app, company SSO integration.
`,
        template: fence(`
RETAIL — ASK IT (BRD v1)
Goal:
Users:
In scope:
Out of scope:
Success metric:
Approved by: ______  Date: ______
`),
      },
      objectives: ['Complete all BRD sections', 'Include one numeric success metric'],
      checkpoints: ['Why document out-of-scope items?', 'Name one out-of-scope capability'],
    },
    {
      slug: 'northwind-discovery-lab',
      type: 'lab',
      title: 'Requirements workshop and BRD draft',
      minutes: 95,
      summary: 'Run discovery against the retail case, then produce notes and a one-page BRD.',
      lesson: {
        steps: `
1. Conduct a structured discovery session (partner or scripted sponsor).
2. Produce half a page of discovery notes.
3. Draft the one-page BRD from the template.
4. Peer review: can a reader understand scope without verbal explanation?
`,
        mistakes: ['Missing out-of-scope section', 'No success metric'],
      },
      objectives: ['Discovery notes and BRD v1 complete', 'One round of peer feedback'],
      checkpoints: ['What changed after peer review?'],
      extras: {
        prerequisites: ['Stage 3 reads completed'],
        steps: ['Discovery', 'Notes', 'BRD', 'Review'],
        deliverables: ['Discovery notes', 'BRD v1'],
      },
    },
    {
      slug: 'ai-assistant-first-30-min',
      type: 'interview',
      title: 'Practice: first 30 minutes with the sponsor',
      minutes: 15,
      summary: 'Respond professionally when the sponsor requests an AI assistant over internal documents.',
      lesson: {
        explain: `Lead with discovery questions and a written scope summary—not infrastructure details.`,
        example: `
"I would confirm the business problem, intended users, document locations, any restricted sources, and how success will be measured. I would capture that in a one-page BRD and agree on a first deliverable: the Ask IT FAQ assistant before any ticketing expansion."
`,
      },
      objectives: ['Cover users, data, restrictions, and success', 'Propose a bounded first deliverable'],
      checkpoints: ['What is the phase 1 deliverable?'],
      extras: {
        prompt: 'The IT lead wants AI over internal IT FAQ documents. What do you do in the first 30 minutes?',
        howToApproach: ['Structured questions', 'Written summary', 'Bounded scope'],
        rubric: ['Professional tone', 'No premature architecture'],
      },
    },
  ],
}
