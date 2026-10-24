import { fence } from './lesson.mjs'
import { RETAIL_CASE } from './_retail-story.mjs'

export default {
  stage: {
    slug: 'production-deployment',
    name: 'Production deployment',
    weeksLabel: 'Weeks 9-10',
    hours: 3,
    cardBlurb: 'Production on Render or AWS; secrets, runbook, and operations.',
    description: 'Production on Render or AWS; secrets, runbook, and operations.',
    outcomes: [
      'Deploy Ask IT to Render or AWS with secrets outside Git',
      'Configure logging and user-facing error handling',
      'Author a one-page runbook for common failures',
    ],
    readyWhen: 'Production URL is stable, secrets are in environment config, and a peer resolved a simulated outage using the runbook.',
  },
  items: [
    {
      slug: 'deployment-basics',
      type: 'read',
      title: 'Deployment fundamentals (Render and AWS)',
      minutes: 30,
      summary: 'Always-on hosting via Render or AWS; Git-based deploy; environment secrets; health endpoint.',
      lesson: {
        explain: `
**Render:** connect repository, set start command, configure environment variables, deploy, verify URL.

**AWS (when required):** App Runner or Elastic Beanstalk for FastAPI; S3/CloudFront or equivalent for static frontend; RDS if database is required; Secrets Manager or parameter store for credentials; single region documented.

**Common rules:** no secrets in Git; \`/health\` endpoint; test Ask IT from a network outside your laptop.

${RETAIL_CASE}
`,
        template: fence(`
PRODUCTION CHECKLIST
[ ] Secrets in host env only
[ ] /health returns OK
[ ] Public URL tested
[ ] One FAQ question succeeds
`),
      },
      objectives: ['Contrast Render vs AWS use cases', 'List deploy safety checks'],
      checkpoints: ['Where do production secrets live?'],
    },
    {
      slug: 'observability-tracing',
      type: 'read',
      title: 'Logging and monitoring',
      minutes: 25,
      summary: 'Request logs, error counts, and feedback records for the IT lead.',
      lesson: {
        explain: `
Log timestamp, outcome, and duration per ask request (avoid logging secrets or full API keys). Retain negative feedback with question, answer, and source for FAQ updates. Use host log dashboard (Render or AWS CloudWatch).
`,
        template: fence(`
INCIDENT LOOKUP
1. Open host logs
2. Match time window
3. Cross-check feedback file
4. Reproduce locally
`),
      },
      objectives: ['Enable structured request logs', 'Locate logs on chosen host'],
      checkpoints: ['What not to log?'],
    },
    {
      slug: 'reliability-cost-incidents',
      type: 'read',
      title: 'Timeouts and production errors',
      minutes: 25,
      summary: 'LLM timeout with friendly message; monitor provider spend during pilot.',
      lesson: {
        explain: `
Set request timeout (e.g. 30s). On failure, show a neutral message and IT contact—never raw stack traces. Review provider usage weekly during early production.
`,
      },
      objectives: ['User-safe error handling', 'Timeout configured'],
      checkpoints: ['User-visible text on failure?'],
    },
    {
      slug: 'deploy-with-tracing',
      type: 'lab',
      title: 'Lab: production deploy',
      minutes: 65,
      summary: 'Promote POC to production posture on Render or AWS; verify URL and logs.',
      lesson: {
        steps: `
1. Deploy with production env vars.
2. Verify /health and Ask IT from external network.
3. Capture log screenshot after successful and failed request.
`,
      },
      objectives: ['Production URL operational'],
      checkpoints: ['Tested off localhost?'],
      extras: {
        deliverables: ['Production URL', 'Log screenshot'],
      },
    },
    {
      slug: 'runbook-incident-drill',
      type: 'lab',
      title: 'Lab: runbook and outage drill',
      minutes: 20,
      summary: 'One-page runbook; partner simulates bad API key and recovers using runbook only.',
      lesson: {
        template: fence(`
RUNBOOK
URL:
Health:
Logs location:
If API errors: check ___ env var
If slow: check provider status
Contact:
`),
      },
      objectives: ['Runbook validated by drill'],
      checkpoints: ['Missing step identified?'],
      extras: {
        deliverables: ['runbook.md'],
      },
    },
    {
      slug: 'poc-to-production',
      type: 'interview',
      title: 'Practice: before wider rollout',
      minutes: 15,
      summary: 'Checklist before all staff use Ask IT daily.',
      lesson: {
        example: `
"Confirm production URL, secrets, role enforcement, runbook, IT lead review of negative feedback, FAQ ownership, and regression after any FAQ update."
`,
      },
      objectives: ['List five rollout gates'],
      checkpoints: ['Why rerun regression after FAQ edits?'],
    },
  ],
}
