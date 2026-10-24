import { fence } from './lesson.mjs'
import { RETAIL_CASE } from './_retail-story.mjs'

export default {
  stage: {
    slug: 'fde-sdlc-ui-ux',
    weeksLabel: 'Week 7',
    hours: 3,
    cardBlurb: 'UI rules, user flow, and wireframes for Ask IT.',
    description: 'UI rules, user flow, and wireframes for Ask IT.',
    outcomes: [
      'Define UX requirements for an internal FAQ assistant',
      'Document user flow for answer and no-answer paths',
      'Produce wireframes aligned to the BRD',
    ],
    readyWhen: 'Wireframes and flow are reviewed against the BRD and show source citation and escalation.',
  },
  items: [
    {
      slug: 'ux-for-ai-products',
      type: 'read',
      title: 'Design rules for Ask IT',
      minutes: 25,
      summary: 'Citation of FAQ source, explicit uncertainty, and escalation when the assistant cannot answer.',
      lesson: {
        explain: `
${RETAIL_CASE}

**Required UI elements:**

1. **Question input** — single field and submit action.
2. **Answer panel** — concise text plus **FAQ file name** used.
3. **No-answer state** — clear message and contact path to IT.
4. **Trust line** — answers are FAQ-based; users should verify critical actions with IT.
5. **Optional feedback** — thumbs up/down for the IT lead to review.

Do not present the assistant as infallible.
`,
        template: fence(`
UI CHECKLIST
[ ] Question input
[ ] Answer + source file
[ ] No-answer + contact IT
[ ] Trust disclaimer
[ ] Feedback (optional)
`),
      },
      objectives: ['List required UI elements', 'Define the no-answer state'],
      checkpoints: ['What must appear under every valid answer?'],
    },
    {
      slug: 'user-flows-wireframing',
      type: 'read',
      title: 'User flow and sample wireframe',
      minutes: 35,
      summary: 'Happy path and refusal path; reference wireframe for layout.',
      lesson: {
        explain: `
**Flow:** Open Ask IT → enter question → receive answer with source **or** receive no-answer guidance → optional feedback or email IT.

**Minimum screens:** Home (input), Answer, No answer.

**Reference wireframe (layout only):**

![Ask IT wireframe reference](/fde/retail-ask-it-wireframe.svg)

Use the wireframe as a layout guide; adapt labels to your BRD.
`,
        example: fence(`
Open Ask IT → Ask → Found → Answer screen
                 → Not found → No-answer screen
`),
      },
      objectives: ['Document dual-path flow', 'Relate wireframe to three screens'],
      checkpoints: ['Minimum screen count?', 'Action after no-answer?'],
    },
    {
      slug: 'wireframe-northwind-assistant',
      type: 'lab',
      title: 'Wireframe Ask IT screens',
      minutes: 90,
      summary: 'Produce flow diagram and wireframes for Home, Answer, and No answer; optional admin feedback view.',
      lesson: {
        steps: `
1. Draw the user flow (answer vs no-answer).
2. Wireframe Home, Answer, and No answer screens.
3. Optional: admin view of negative feedback entries.
4. Cross-check against the Stage 3 BRD.
`,
        mistakes: ['Omitting source file on Answer screen', 'No escalation path'],
      },
      objectives: ['Flow plus three wireframes delivered'],
      checkpoints: ['Where is the FAQ source shown?'],
      extras: {
        prerequisites: ['Stage 3 BRD'],
        deliverables: ['Flow diagram', 'Wireframe images or exports'],
      },
    },
    {
      slug: 'show-ai-might-be-wrong',
      type: 'interview',
      title: 'Practice: incorrect or missing answers',
      minutes: 30,
      summary: 'Explain UX mitigations when the model err or FAQs do not contain the answer.',
      lesson: {
        example: `
"We display the FAQ source, refuse to invent content when retrieval fails, provide a direct IT contact, and log negative feedback for the IT lead to review and update FAQs."
`,
      },
      objectives: ['Cover citation, refusal, escalation, feedback'],
      checkpoints: ['Why show the source file name?'],
      extras: {
        prompt: 'How do you design Ask IT when answers may be wrong or absent?',
        rubric: ['Source visibility', 'Refusal behavior', 'Human escalation'],
      },
    },
  ],
}
