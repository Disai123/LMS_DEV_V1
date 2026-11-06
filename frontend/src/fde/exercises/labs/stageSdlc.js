import { ASK_IT_ONE_LINER, GLOSSARY_COMMON, troubleshootingEntry } from '../labShared'
import {
  PROMPT_DISCOVERY_12,
  PROMPT_BRD_FULL,
  PROMPT_DISCOVERY_ONE_PAGE,
  PROMPT_UIUX_FULL,
  PROMPT_ARCH_FULL,
} from './promptText'

const BRD_HEADINGS =
  'Overview, Functional Requirements, Non-Functional Requirements, User Stories, Conclusion'

const brdSampleStatic = `════════════════════════════════════════════════════════
  BUSINESS REQUIREMENTS DOCUMENT — Ask IT (sample)
════════════════════════════════════════════════════════

## Overview
Ask IT reduces L1 IT tickets for 500 retail stores via RAG + RBAC chat and triage.

## Functional Requirements
FR-01 Chat questions FR-02 RAG with citations FR-03 Role filter FR-04 Triage tickets FR-05 Escalate button FR-06 FAQ admin

## Non-Functional Requirements
NFR-01 p95 /ask < 3s NFR-02 RBAC audit NFR-03 Pydantic validation NFR-04 Langfuse traces

## User Stories
US-01 Staff asks POS question → cited answer ...
US-02 Admin asks policy → allowed content only ...

## Conclusion
Next: UI/UX wireframe lab.`

export const stageSdlcLabs = {
  'fde-sdlc-business-requirement/lab-1-discovery-and-brd': {
    type: 'prompt',
    title: 'Lab: Discovery + BRD for Ask IT',
    duration: '60 min',
    prerequisites: ['AI Engineering labs through Lab 3'],
    beforeYouStart:
      'A BRD is the contract between business and engineering. ' + ASK_IT_ONE_LINER + ' Your BRD must match LMS sidebar sections exactly.',
    glossary: [
      ...GLOSSARY_COMMON,
      { term: 'BRD', meaning: 'Business Requirements Document—what to build and why.' },
      { term: 'FR / NFR', meaning: 'Functional = features; Non-functional = quality (speed, security).' },
    ],
    objective: 'Run discovery prompt then BRD prompt with mandatory sections; fix gaps with follow-up prompts.',
    scenario: 'You are the FDE after a client workshop; turn notes into BRD.md.',
    prompts: [
      {
        step: 1,
        label: 'Discovery questions',
        whereToRun: 'AI tool',
        prompt: PROMPT_DISCOVERY_12,
        checkpoint: '12 questions saved in discovery.md.',
      },
      {
        step: 2,
        label: 'BRD with sidebar sections',
        whereToRun: 'AI tool',
        prompt: PROMPT_BRD_FULL,
        checkpoint: 'BRD.md contains all 5 H2 sections in order.',
      },
    ],
    prompt: PROMPT_BRD_FULL,
    staticResponse: brdSampleStatic,
    acceptanceCriteria: [
      'discovery.md with 12 questions.',
      `BRD.md has H2: ${BRD_HEADINGS}.`,
      'At least 6 numbered functional requirements.',
    ],
    troubleshooting: [
      troubleshootingEntry(
        'BRD is missing Overview, Functional Requirements, NFR, User Stories, or Conclusion',
        'The file does not match the BRD sidebar, so reviewers cannot find a required section.',
        'The prompt did not force those exact H2 headings.',
        'Rewrite only BRD.md. Use these exact H2 headings in order: Overview, Functional Requirements, Non-Functional Requirements, User Stories, Conclusion. Fill any missing section. Do not rename headings.',
      ),
      troubleshootingEntry(
        'Functional requirements are vague ("the system should be helpful")',
        'Engineering cannot build or test a requirement that has no clear behavior.',
        'The prompt did not ask for numbered FR-01 style requirements.',
        'Rewrite the Functional Requirements section as FR-01 to FR-06 for Ask IT: chat, RAG with citations, staff vs admin filtering, ticket triage, escalate button, and FAQ list. One sentence each.',
      ),
      troubleshootingEntry(
        'User stories have no acceptance criteria',
        'A story without a check cannot be marked done.',
        'The prompt only asked for story sentences.',
        'Add 6 user stories (3 staff, 3 admin). Each story needs 3 acceptance-criteria bullets a tester can verify.',
      ),
    ],
    deliverable: 'BRD.md + discovery.md',
    keyLearning: 'Document prompts must mirror LMS sidebar headings so learners and reviewers align.',
  },

  'fde-sdlc-business-requirement/one-page-brd-and-discovery-questions': {
    type: 'prompt',
    title: 'Practical: One-page discovery question bank',
    duration: '30 min',
    prerequisites: [],
    beforeYouStart: 'Discovery questions prevent building the wrong product.',
    glossary: GLOSSARY_COMMON,
    objective: 'Generate 12 categorized discovery questions for Ask IT.',
    scenario: 'Prepare before client workshop.',
    prompt: PROMPT_DISCOVERY_ONE_PAGE,
    staticResponse: `DISCOVERY QUESTIONS — Ask IT\n\nBUSINESS (1-3) ... TECHNICAL (4-6) ... ROLES (7-9) ... COMPLIANCE (10-12) ...`,
    acceptanceCriteria: ['12 questions in 4 categories.', 'Copy saved to discovery-questions.md'],
    troubleshooting: [
      troubleshootingEntry(
        'Questions are yes/no instead of open-ended',
        'Yes/no questions hide the real constraints of store IT support.',
        'The prompt did not say "open-ended" for each category.',
        'Rewrite the 12 questions so none can be answered with only yes or no. Keep 3 business, 3 technical, 3 roles, 3 compliance for Ask IT.',
      ),
      troubleshootingEntry(
        'All questions are about features, none about compliance',
        'Admin passwords and audit rules will be missed later.',
        'The prompt mixed categories or skipped compliance.',
        'Replace questions 10-12 with compliance questions: who may see override codes, what must be logged, and SSO or security questionnaire needs.',
      ),
      troubleshootingEntry(
        'The AI wrote a full BRD instead of questions',
        'You asked for a question bank and received a document.',
        'The prompt did not say "questions only, no BRD".',
        'Output only 12 numbered discovery questions in 4 groups. Do not write a BRD. Stop after the question list.',
      ),
    ],
    deliverable: 'discovery-questions.md',
    keyLearning: 'Good discovery saves weeks of rework.',
  },

  'fde-sdlc-ui-ux-solution/lab-2-wireframe-ask-it': {
    type: 'prompt',
    title: 'Lab: UI/UX brief for Ask IT chat',
    duration: '45 min',
    prerequisites: ['BRD lab'],
    beforeYouStart: 'Wireframes describe screens in words so developers know what to build—no art degree required.',
    glossary: [...GLOSSARY_COMMON, { term: 'Wireframe', meaning: 'Simple layout sketch (often text) of screens.' }],
    objective: 'Create UI_UX.md matching sidebar: Overview, Design System, Chat Interface Design, User Experience Flow, Navigation Flow, Conclusion.',
    scenario: 'Single-screen chat with role toggle and citations.',
    prompts: [
      {
        step: 1,
        label: 'UI/UX document',
        whereToRun: 'AI tool',
        prompt: PROMPT_UIUX_FULL,
        checkpoint: 'All 6 H2 sections present.',
      },
    ],
    prompt: PROMPT_UIUX_FULL,
    staticResponse: `UI/UX — Ask IT\n## Overview\n...\n## Design System\n...\n## Chat Interface Design\n...\n## User Experience Flow\n...\n## Navigation Flow\n...\n## Conclusion\n...`,
    acceptanceCriteria: ['UI_UX.md has 6 H2 sections.', 'Escalation and role toggle described.'],
    troubleshooting: [
      troubleshootingEntry(
        'UI_UX.md is missing Chat Interface Design or another required heading',
        'The wireframe doc does not match this lab\'s sidebar sections.',
        'The prompt listed different headings or the model skipped one.',
        'Rewrite UI_UX.md with these exact H2 headings in order: Overview, Design System, Chat Interface Design, User Experience Flow, Navigation Flow, Conclusion. Fill missing sections only.',
      ),
      troubleshootingEntry(
        'The chat screen has no loading, error, or escalate state',
        'Store staff will not know what to do when the bot is slow or unsure.',
        'The prompt described only the happy path.',
        'In Chat Interface Design, add four states: empty, loading ("Thinking…"), error with retry, and Escalate to Human IT with ticket confirmation. Keep the Staff/Admin role toggle.',
      ),
      troubleshootingEntry(
        'Answers have no citation chips',
        'Users cannot see which runbook the answer came from.',
        'Citations were not required in the prompt.',
        'Add citation chips under assistant messages, for example "Source: POS Runbook v2.1". Show one text wireframe of a user question and a cited answer.',
      ),
    ],
    deliverable: 'UI_UX.md',
    keyLearning: 'UI briefs can be prompt-generated if headings match the course sidebar.',
  },

  'fde-sdlc-architecture-solution/lab-3-diagram-tags-cost-and-adr': {
    type: 'prompt',
    title: 'Lab: Architecture doc + ADR-001',
    duration: '50 min',
    prerequisites: ['UI/UX lab'],
    beforeYouStart: 'Architecture explains how pieces connect—React, API, database, AI—before anyone codes.',
    glossary: [...GLOSSARY_COMMON, { term: 'ADR', meaning: 'Architecture Decision Record—why we chose an approach.' }],
    objective: 'ARCHITECTURE.md with sidebar H2s including trust boundaries and ADR-001 (RBAC before LLM).',
    scenario: 'Prevent admin FAQ leakage at design time.',
    prompts: [
      {
        step: 1,
        label: 'Architecture document',
        whereToRun: 'AI tool',
        prompt: PROMPT_ARCH_FULL,
        checkpoint: 'ADR-001 section mentions RBAC filter before LLM.',
      },
    ],
    prompt: PROMPT_ARCH_FULL,
    staticResponse: `ARCHITECTURE — Ask IT\n## Overview\n...\n## System Architecture\n...\n## ADR-001 Permission filter before LLM\nStatus: Accepted\n...`,
    acceptanceCriteria: ['ARCHITECTURE.md includes ADR-001.', 'Text diagram shows React → FastAPI → DB/FAISS.'],
    troubleshooting: [
      troubleshootingEntry(
        'The diagram never mentions FAISS, PostgreSQL, or the role filter',
        'The architecture looks like a generic website, not Ask IT.',
        'The prompt did not name the stack pieces that must appear.',
        'Update System Architecture with a text diagram: React chat → FastAPI → role filter → FAISS + PostgreSQL → answer or /triage ticket. Label trust boundaries.',
      ),
      troubleshootingEntry(
        'ADR-001 is missing or does not filter before the LLM',
        'Admin FAQs could be sent into the model prompt for staff.',
        'The decision was described after generation instead of before retrieval context.',
        'Add ADR-001 titled "Filter FAQs by min_access_level before the LLM prompt." Status: Accepted. Include one consequence: staff never receive admin override text.',
      ),
      troubleshootingEntry(
        '/ask and /triage are described as the same flow',
        'Escalation and answering are different paths.',
        'The data-flow section collapsed both endpoints.',
        'Split Data Flow into POST /ask (retrieve, cite, return confidence) and POST /triage (validate ticket, assign id and SLA). Do not merge them.',
      ),
    ],
    deliverable: 'ARCHITECTURE.md',
    keyLearning: 'ADRs capture security decisions so later prompts do not accidentally remove them.',
  },
}
