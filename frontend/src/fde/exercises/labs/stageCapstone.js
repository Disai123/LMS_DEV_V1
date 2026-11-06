import { GLOSSARY_COMMON, troubleshootingEntry } from '../labShared'
import { capstoneFixPrompt, capstoneMainPrompt } from './promptText'

function capstoneLab(key, title, project, hourGoal, deliverable) {
  return {
    type: 'prompt-lab',
    title,
    duration: '60 min',
    prerequisites: ['Complete Ask IT Stages 1–9 labs'],
    beforeYouStart:
      `Capstone applies the same skills on the **${project}** Realtime e-commerce project. ` +
      'You already learned prompt → check → fix on Ask IT; now use fewer hints. No prior e-commerce knowledge required—prompts include context.',
    glossary: GLOSSARY_COMMON,
    objective: `Use prompts to ${hourGoal}.`,
    scenario: `Capstone track: ${project}. Transfer Ask IT workflow to e-commerce.`,
    prompts: [
      {
        step: 1,
        label: 'Execute main prompt',
        whereToRun: 'AI tool',
        prompt: capstoneMainPrompt(project, hourGoal, deliverable),
        checkpoint: `Deliverable ${deliverable} exists or clear progress documented.`,
      },
      {
        step: 2,
        label: 'Fix loop',
        whereToRun: 'AI tool',
        prompt: capstoneFixPrompt(project, hourGoal),
        checkpoint: 'Issue resolved or escalated with notes.',
      },
    ],
    acceptanceCriteria: [
      'You ran at least two prompts (main + fix or refinement).',
      `Artifact or notes for: ${deliverable}.`,
      'You can explain what you checked to know it worked.',
    ],
    troubleshooting: [
      troubleshootingEntry(
        `I cannot tell if "${hourGoal}" is finished`,
        'The step has no visible proof.',
        'The prompt did not name a file or a screen to check.',
        `Turn this goal into 3 checks a beginner can see: "${hourGoal}". Name the file ${deliverable} and what must be inside it. Project: ${project}.`,
      ),
      troubleshootingEntry(
        'The AI answered about Ask IT instead of this e-commerce project',
        'The capstone domain was ignored.',
        'The prompt forgot the project name.',
        `Stop. This capstone is ${project}, not Ask IT. Redo "${hourGoal}" for that store application only. Save ${deliverable}.`,
      ),
      troubleshootingEntry(
        'The output is a huge code dump and I cannot review it',
        'You need a small artifact, not the whole repo rewritten.',
        'The prompt did not limit the deliverable.',
        `Do not rewrite the repository. Produce only ${deliverable} for "${hourGoal}" with headings and the commands I should run to verify it.`,
      ),
    ],
    deliverable,
    stretchGoal: 'Run phase_document_prompts.md BRD prompt for this project before coding.',
    keyLearning: 'Capstone proves you can transfer prompt-driven FDE work to a new client domain.',
  }
}

export const stageCapstoneLabs = {
  'capstone-fde/project-1-hour-1-requirements-structure-and-database': capstoneLab(
    'p1h1',
    'Capstone P1H1: Schema + requirements (e-commerce)',
    'E-Commerce Web Application (Fullstack)',
    'design production SQL schema (products, orders, users) and align with BRD sections',
    'schema.sql + requirements-notes.md',
  ),
  'capstone-fde/project-2-hour-1-agent-concepts-and-single-agent-baseline': capstoneLab(
    'p2h1',
    'Capstone P2H1: Single-agent baseline',
    'E-Commerce AI Shopping Agent',
    'document Ask the Store agent scope and baseline architecture',
    'agent-baseline.md',
  ),
  'capstone-fde/project-3-hour-1-knowledge-sources-and-document-preparation': capstoneLab(
    'p3h1',
    'Capstone P3H1: RAG knowledge prep',
    'Agentic RAG E-Commerce Assistant',
    'list knowledge sources and prepare documents for ingestion',
    'knowledge-sources.md',
  ),
  'capstone-fde/project-4-hour-1-integration-design-and-codebase-review': capstoneLab(
    'p4h1',
    'Capstone P4H1: Integration design',
    'Unified E-Commerce Capstone',
    'review codebase and design integration of modules',
    'integration-design.md',
  ),
  'capstone-fde/project-1-hour-2-backend-apis-and-business-flow': capstoneLab(
    'p1h2',
    'Capstone P1H2: Backend APIs',
    'E-Commerce Web Application (Fullstack)',
    'prompt-implement core FastAPI APIs for catalog and cart',
    'api-implementation-notes.md',
  ),
  'capstone-fde/project-1-hour-3-react-ui-and-api-integration': capstoneLab(
    'p1h3',
    'Capstone P1H3: React + API',
    'E-Commerce Web Application (Fullstack)',
    'prompt-connect React storefront to backend APIs',
    'ui-integration-screenshot.png',
  ),
  'capstone-fde/project-1-hour-4-end-to-end-testing-and-handover': capstoneLab(
    'p1h4',
    'Capstone P1H4: E2E test + handover',
    'E-Commerce Web Application (Fullstack)',
    'run end-to-end smoke tests and draft handover',
    'e2e-handover.md',
  ),
  'capstone-fde/project-2-hour-2-define-multi-agent-responsibilities': capstoneLab(
    'p2h2',
    'Capstone P2H2: Multi-agent responsibilities',
    'Multi-Agent E-Commerce Assistant',
    'define agent roles and responsibilities in LangGraph terms',
    'agent-roles.md',
  ),
  'capstone-fde/project-2-hour-3-build-the-langgraph-flow': capstoneLab(
    'p2h3',
    'Capstone P2H3: LangGraph flow',
    'Multi-Agent E-Commerce Assistant',
    'prompt-build LangGraph flow for shop assistant',
    'langgraph-flow-notes.md',
  ),
  'capstone-fde/project-2-hour-4-test-actions-permissions-and-failures': capstoneLab(
    'p2h4',
    'Capstone P2H4: Agent tests',
    'Multi-Agent E-Commerce Assistant',
    'test agent actions, permissions, and failure paths',
    'agent-test-log.md',
  ),
  'capstone-fde/project-3-hour-2-embeddings-faiss-and-retrieval': capstoneLab(
    'p3h2',
    'Capstone P3H2: Embeddings + FAISS',
    'Agentic RAG E-Commerce Assistant',
    'build embeddings index for product/policy docs',
    'faiss-ingest-log.txt',
  ),
  'capstone-fde/project-3-hour-3-agentic-retrieval-and-grounded-answers': capstoneLab(
    'p3h3',
    'Capstone P3H3: Grounded RAG answers',
    'Agentic RAG E-Commerce Assistant',
    'implement agentic retrieval with citations',
    'rag-eval-notes.md',
  ),
  'capstone-fde/project-3-hour-4-api-ui-integration-and-evaluation': capstoneLab(
    'p3h4',
    'Capstone P3H4: RAG UI + eval',
    'Agentic RAG E-Commerce Assistant',
    'integrate RAG API with UI and run evaluation',
    'rag-ui-eval.md',
  ),
  'capstone-fde/project-4-hour-2-integrate-the-multi-agent-module': capstoneLab(
    'p4h2',
    'Capstone P4H2: Integrate multi-agent',
    'Unified E-Commerce Capstone',
    'integrate multi-agent module into unified app',
    'integration-multi-agent.md',
  ),
  'capstone-fde/project-4-hour-3-integrate-the-agentic-rag-module': capstoneLab(
    'p4h3',
    'Capstone P4H3: Integrate Agentic RAG',
    'Unified E-Commerce Capstone',
    'integrate agentic RAG module',
    'integration-rag.md',
  ),
  'capstone-fde/project-4-hour-4-end-to-end-validation-and-demo': capstoneLab(
    'p4h4',
    'Capstone P4H4: Final demo',
    'Unified E-Commerce Capstone',
    'end-to-end validation and sponsor demo script',
    'demo-script.md',
  ),
}
