import { fence } from './lesson.mjs'
import { RETAIL_CASE } from './_retail-story.mjs'

export default {
  stage: {
    slug: 'minimum-viable-product',
    name: 'MVP/POC: Local and Render validation',
    weeksLabel: 'Week 9',
    hours: 3,
    cardBlurb: 'Repeatable local run, Render POC deploy, regression, and pilot feedback.',
    description: 'Repeatable local run, Render POC deploy, regression, and pilot feedback.',
    outcomes: [
      'Distinguish development, MVP/POC, and production environments',
      'Document local startup and deploy a Render POC URL',
      'Run regression and three pilot sessions; triage top fixes',
    ],
    readyWhen: 'Local and Render POC URLs work, regression is scored, three pilots completed, top fixes listed.',
  },
  items: [
    {
      slug: 'poc-mvp-production',
      type: 'read',
      title: 'Development vs MVP/POC vs production',
      minutes: 20,
      summary: 'Development on localhost; MVP/POC adds repeatable run plus Render pilot URL; production is Stage 8 hardening on Render or AWS.',
      lesson: {
        explain: `
- **Development (Stage 6):** feature-complete slice on localhost.
- **MVP/POC (this stage):** documented startup, staff/admin login, UI polish, **Render POC URL** for sponsor demo, regression and pilots.
- **Production (Stage 8):** production posture on **Render or AWS**, runbook, monitoring.

${RETAIL_CASE}

MVP/POC must-haves: login, Ask IT UI, feedback capture, full 20-question regression after material changes.
`,
      },
      objectives: ['Contrast three environments', 'List MVP/POC additions'],
      checkpoints: ['What does POC add beyond localhost?'],
    },
    {
      slug: 'fake-vs-real',
      type: 'read',
      title: 'Repeatable local run',
      minutes: 25,
      summary: 'README, .env.example, and startup steps so a peer can run without your machine.',
      lesson: {
        explain: `
Document Python/Node versions, dependencies, \`.env.example\`, and start commands for backend and frontend. A peer should run from README alone.

Secrets remain in environment variables, not Git.
`,
        template: fence(`
LOCAL RUN
1. clone
2. cp .env.example .env
3. start backend: ___
4. start frontend: ___
5. URL: ___
`),
      },
      objectives: ['README validated by peer'],
      checkpoints: ['What blocked your peer?'],
    },
    {
      slug: 'render-poc-deploy',
      type: 'read',
      title: 'Render POC deployment',
      minutes: 30,
      summary: 'Connect repository, configure environment variables, deploy FastAPI and static frontend, verify public POC URL.',
      lesson: {
        explain: `
**Render POC steps:**

1. Push code to Git (no \`.env\` committed).
2. Create **Web Service**; connect repository; set start command (e.g. \`uvicorn main:app\`).
3. Add environment variables (LLM key, app secrets) in Render dashboard.
4. Deploy; confirm \`/health\` and one FAQ question from a device outside localhost.
5. Record POC URL for sponsor demo.

Production hardening (custom domain, scaling, AWS) follows in Stage 8.
`,
        steps: `
1. Confirm \`.gitignore\` excludes secrets.
2. Deploy backend; attach frontend static site or combined service per your layout.
3. Smoke-test staff login and one answered question on the public URL.
`,
        mistakes: ['API keys in repository', 'Skipping health check'],
      },
      objectives: ['Obtain working Render POC URL', 'Verify ask flow on public URL'],
      checkpoints: ['Where are secrets configured on Render?'],
    },
    {
      slug: 'build-mvp-slice',
      type: 'lab',
      title: 'Lab: MVP hardening and staging checklist',
      minutes: 60,
      summary: 'Login, feedback persistence, README, local and Render POC smoke tests.',
      lesson: {
        steps: `
1. Enforce staff/admin login on server.
2. Persist thumbs-down (file or database).
3. Finalize README local and Render sections.
4. Smoke: health, one staff answer, one refusal, admin-as-staff leak test on POC URL.
`,
      },
      objectives: ['Login and feedback on POC', 'Smoke tests documented'],
      checkpoints: ['Zero admin leaks on POC?'],
      extras: {
        deliverables: ['README', 'POC URL', 'Smoke checklist'],
      },
    },
    {
      slug: 'pilot-feedback-loops',
      type: 'read',
      title: 'Regression and pilot feedback',
      minutes: 30,
      summary: 'Run full 20-question CSV; three pilot sessions; record results and top three fixes.',
      lesson: {
        explain: `
Run smoke tests plus full regression; save results under \`tests/results/\`. Conduct three pilot sessions without hand-holding; note confusion points; prioritize three fixes before production stage.
`,
        steps: `Regression → save scores → three pilots → top-three fix list.`,
        mistakes: ['Skipping regression after UI changes', 'No written pilot notes'],
      },
      objectives: ['Regression file updated', 'Three pilots and fix list'],
      checkpoints: ['When must regression rerun?'],
    },
    {
      slug: 'vp-demo-next-week',
      type: 'interview',
      title: 'Practice: POC demo script',
      minutes: 15,
      summary: 'Demo Render POC with cited answers, refusal, and honest limits before production.',
      lesson: {
        example: `
"I will demo on our Render POC: two answered questions with sources, one refusal, staff blocked from admin FAQ content, regression at __/20. Production runbook and AWS/Render production choice follow in Stage 8."
`,
      },
      objectives: ['Timeboxed honest demo outline'],
      checkpoints: ['Include refusal in demo?'],
    },
  ],
}
