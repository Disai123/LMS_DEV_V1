import { fence } from './lesson.mjs'
import { RETAIL_CASE } from './_retail-story.mjs'

export default {
  stage: {
    slug: 'proof-of-concept',
    name: 'Development',
    weeksLabel: 'Weeks 8-9',
    hours: 3,
    cardBlurb: 'Backend, frontend, RAG, and data modules for Ask IT on localhost.',
    description: 'Backend, frontend, RAG, and data modules for Ask IT on localhost.',
    outcomes: [
      'Implement FastAPI backend with role-aware FAQ ingest and ask endpoint',
      'Build Ask IT frontend wired to the API',
      'Integrate RAG with citations and refusal behavior',
      'Run a 20-question regression set with zero admin leaks',
    ],
    readyWhen: 'Ask IT runs on localhost, regression is scored, and admin-only content does not leak to staff.',
  },
  items: [
    {
      slug: 'dev-backend',
      type: 'read',
      title: 'Development module: Backend',
      minutes: 18,
      summary: 'FastAPI structure, FAQ ingest, POST /ask, role parameter, secrets in environment.',
      lesson: {
        explain: `
${RETAIL_CASE}

**Backend deliverables:** ingest FAQ files; tag chunks; expose \`POST /ask\` with question and role; return answer + \`source_file\` or structured refusal; enforce role filter before search.

**Acceptance target (with sponsor):** 16+ of 20 regression questions correct, zero admin leaks, source on every valid answer.
`,
        mistakes: ['Secrets in Git', 'Role check only in UI'],
      },
      objectives: ['List backend endpoints and role rules'],
      checkpoints: ['Where is role validated?'],
    },
    {
      slug: 'dev-frontend',
      type: 'read',
      title: 'Development module: Frontend',
      minutes: 18,
      summary: 'Ask IT screens per wireframes: input, answer with source, no-answer state, optional feedback.',
      lesson: {
        explain: `
Implement Home, Answer, and No-answer views from Stage 4. Display loading state during API calls. Surface API errors without stack traces.

Optional: staff/admin login selector or test accounts for regression.
`,
      },
      objectives: ['Map wireframes to components', 'Handle loading and errors'],
      checkpoints: ['What displays on timeout?'],
    },
    {
      slug: 'dev-rag',
      type: 'read',
      title: 'Development module: RAG',
      minutes: 22,
      summary: 'Retrieve FAQ chunks, generate answers with citations; refuse when retrieval is insufficient.',
      lesson: {
        explain: `
Reuse Stage 2 retrieval patterns. Pass only role-allowed chunks to the generator. Include source file name in the response. When no chunk meets threshold, return the no-answer message—do not hallucinate policy content.
`,
      },
      objectives: ['Describe retrieval + generation boundary', 'Define refusal condition'],
      checkpoints: ['When do you refuse to answer?'],
    },
    {
      slug: 'dev-data',
      type: 'read',
      title: 'Development module: Database and data',
      minutes: 18,
      summary: 'FAQ file layout, chunk metadata, staff_ok/admin_only tags, sample data for tests.',
      lesson: {
        explain: `
Store FAQs as files or normalized tables; maintain metadata: file name, chunk id, sensitivity tag. Version sample FAQs for regression. Document how to add or update a FAQ and rerun tests.
`,
        template: fence(`
Chunk metadata: file_name, tag (staff_ok | admin_only), chunk_id
`),
      },
      objectives: ['Document FAQ metadata schema', 'Provide sample FAQs for pilot'],
      checkpoints: ['How are admin-only files marked?'],
    },
    {
      slug: 'eval-set-from-customer-data',
      type: 'read',
      title: 'Regression test set (20 questions)',
      minutes: 22,
      summary: 'CSV with normal, edge, out-of-scope, and admin-as-staff cases for acceptance.',
      lesson: {
        explain: `
Create \`tests/questions.csv\`: ~12 standard, ~4 edge, ~2 out-of-scope (expect refusal), ~2 admin-only topics asked as **staff** (must not leak). Reuse in Stages 7–9.
`,
        example: fence(`
id,question,expected_file,user_role,notes
1,Reset password?,Password-FAQ.pdf,staff,
2,Server room code?,Admin-only.pdf,staff,must refuse
`),
      },
      objectives: ['Publish 20-row CSV', 'Include admin leak test rows'],
      checkpoints: ['Which rows test admin isolation?'],
    },
    {
      slug: 'poc-scope-golden-set',
      type: 'lab',
      title: 'Lab: development plan and sample FAQs',
      minutes: 27,
      summary: 'Document build plan, add sample FAQ files, complete questions.csv.',
      lesson: {
        steps: `
1. Write development plan (scope + acceptance numbers).
2. Add 3–5 sample FAQ files with tags.
3. Complete questions.csv; peer-review five rows.
`,
      },
      objectives: ['Plan, sample data, and CSV ready'],
      checkpoints: ['Acceptance numbers agreed?'],
      extras: {
        deliverables: ['Development plan', 'questions.csv', 'sample FAQs'],
      },
    },
    {
      slug: 'northwind-poc-build',
      type: 'project',
      title: 'Project: build Ask IT (development slice)',
      minutes: 40,
      summary: 'End-to-end localhost build; run 20-question regression; short results report.',
      lesson: {
        steps: `
1. Backend ingest, ask API, role filter.
2. Frontend wired to API.
3. Execute all CSV rows; log pass/fail.
4. Fix highest-impact failure; rerun failed rows.
5. Write results summary.
`,
        template: fence(`
RESULTS
Correct: __/20
Admin leaks: __ (target 0)
Top failure:
Fix:
`),
      },
      objectives: ['Localhost E2E', 'Regression logged'],
      checkpoints: ['Met acceptance threshold?'],
      extras: {
        scope: 'Ask IT on localhost with regression report',
        acceptanceCriteria: ['0 admin leaks', 'Source on valid answers'],
      },
    },
    {
      slug: 'poc-scope-creep',
      type: 'interview',
      title: 'Practice: scope change during development',
      minutes: 15,
      summary: 'Defer out-of-scope requests using the BRD and acceptance criteria.',
      lesson: {
        example: `
"I will log tickets for phase 2. Phase 1 completes the FAQ assistant and the agreed regression score. Let us finish acceptance on the current plan, then schedule an scope review."
`,
      },
      objectives: ['Reference written scope and metrics'],
      checkpoints: ['Which document defines phase 1?'],
      extras: {
        prompt: 'Mid-build request for ticketing and chat integrations.',
        rubric: ['Professional deferral', 'Cites acceptance criteria'],
      },
    },
  ],
}
