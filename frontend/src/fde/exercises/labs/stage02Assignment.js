import { FOUNDATION_START, GLOSSARY_COMMON } from '../labShared'
import {
  INTRO_S2_ASSIGNMENT,
  PROMPT_S2_ASSIGN_1,
  PROMPT_S2_ASSIGN_2,
  PROMPT_S2_ASSIGN_3,
  PROMPT_S2_ASSIGN_4,
  PROMPT_S2_ASSIGN_5,
  PROMPT_S2_ASSIGN_6,
  PROMPT_S2_ASSIGN_7,
} from './promptFoundation'

const SKILLS_FROM_STAGE = [
  'Compare two models (eval harness)',
  'Extraction and tool-calling assistant',
  'Ingest, chunk, and index policy_corpus/',
  'Baseline cited RAG (POST /ask)',
  'Hybrid search and rerank',
  'Diagnose RAG failures',
  'LangGraph human approval',
  'Agentic RAG mini-loop',
  'Red-team and guardrails',
  'MCP search_policy_index',
]

export const stage02Assignment = {
  'ai-engineering/assignment-integrated-policy-assistant': {
    track: 'foundation-assignment',
    type: 'prompt-lab',
    title: 'Assignment: Integrated policy assistant (Stage 2 capstone)',
    duration: '60 min',
    beforeYouStart: FOUNDATION_START,
    glossary: GLOSSARY_COMMON,
    assignmentContext: INTRO_S2_ASSIGNMENT,
    skillsFromStage: SKILLS_FROM_STAGE,
    whatYouLearn: [
      'Connect every Stage 2 lab into one documented policy assistant.',
      'Show evidence (JSON, traces, tables) — not a generic summary.',
    ],
    prompts: [
      { step: 1, label: 'Default model', whereToRun: 'AI tool', prompt: PROMPT_S2_ASSIGN_1 },
      { step: 2, label: 'Cited RAG', whereToRun: 'AI tool', prompt: PROMPT_S2_ASSIGN_2 },
      { step: 3, label: 'Hybrid win', whereToRun: 'AI tool', prompt: PROMPT_S2_ASSIGN_3 },
      { step: 4, label: 'Diagnose fix', whereToRun: 'AI tool', prompt: PROMPT_S2_ASSIGN_4 },
      { step: 5, label: 'Approval gate', whereToRun: 'AI tool', prompt: PROMPT_S2_ASSIGN_5 },
      { step: 6, label: 'Guardrails', whereToRun: 'AI tool', prompt: PROMPT_S2_ASSIGN_6 },
      { step: 7, label: 'MCP search', whereToRun: 'AI tool', prompt: PROMPT_S2_ASSIGN_7 },
    ],
    acceptanceCriteria: [
      'All seven steps include concrete artifacts (model id, HTTP JSON, file names, traces, or MCP snippet).',
      'Uses policy_corpus/ storyline — not a generic “sample docs” folder.',
      'No Ask IT or Todo product names in deliverables.',
    ],
    troubleshooting: [],
  },
}