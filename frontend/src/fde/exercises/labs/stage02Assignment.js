import { FOUNDATION_START, troubleshootingEntry } from '../labShared'

const SKILLS_FROM_STAGE = [
  'Lab 2A: Compare two models with an eval harness',
  'Lab 3B: Baseline cited RAG (POST /ask)',
  'Lab 4A: Hybrid search and rerank',
  'Lab 4B: Diagnose RAG failures',
  'Lab 5A: LangGraph human approval',
  'Lab 6: Red-team and guardrails',
  'Lab 7: MCP search_policy_index',
]

export const stage02Assignment = {
  'ai-engineering/assignment-integrated-policy-assistant': {
    track: 'foundation-assignment',
    type: 'prompt-lab',
    title: 'Capstone: Integrated policy assistant',
    duration: '60 min',
    deliverable: 'capstone.md',
    beforeYouStart: FOUNDATION_START,
    glossary: [
      {
        term: 'Capstone',
        meaning:
          'A final project that combines everything learned in a stage.',
      },
      {
        term: 'Evidence',
        meaning:
          'A real result, such as a JSON reply, a trace or a table, that shows something works.',
      },
      {
        term: 'Trace',
        meaning:
          'A step-by-step record of what the agent did during one run.',
      },
    ],
    assignmentContext:
      'Wire one integrated policy assistant that reuses the model choice, the policy_corpus/ index, cited RAG, hybrid search, the approval gate, the guardrails and the MCP search. Document each part in capstone.md.',
    skillsFromStage: SKILLS_FROM_STAGE,
    whatYouLearn: [
    'Connect every Stage 2 lab into one documented policy assistant.',
    'Show evidence (JSON, traces, tables), not a general summary.',
  ],
    prompts: [
      {
        step: 1,
        label: 'Default model',
        whereToRun: 'AI tool',
        prompt: `## Context
Stage 2 capstone. capstone.md documents one integrated policy assistant.

## Task
Add a "Default model" section from results.csv and recommendation.md (Lab 2A): the model id, the number of rows in the eval table, and one metric (average latency or average quality) that supports the choice.

## Outcome
Add the section to capstone.md. Reply with one line saying what was added.`,
      },
      {
        step: 2,
        label: 'Cited RAG',
        whereToRun: 'AI tool',
        prompt: `## Context
Stage 2 capstone. capstone.md documents one integrated policy assistant.

## Task
Run app.py (Lab 3B) and call POST /ask with "How many PTO days can roll over?" and "Can I expense a personal gaming console?". Add a "Cited RAG" section with both requests and their JSON replies.

## Outcome
Add the section to capstone.md. Reply with one line saying what was added.`,
      },
      {
        step: 3,
        label: 'Hybrid win',
        whereToRun: 'AI tool',
        prompt: `## Context
Stage 2 capstone. capstone.md documents one integrated policy assistant.

## Task
Run hybrid.py (Lab 4A). Add a "Hybrid search" section with the question "How many vacation days can I carry into next year?", the vector-only top 1 chunk, the hybrid top 1 chunk, and one sentence on why hybrid helped or did not.

## Outcome
Add the section to capstone.md. Reply with one line saying what was added.`,
      },
      {
        step: 4,
        label: 'Diagnose fix',
        whereToRun: 'AI tool',
        prompt: `## Context
Stage 2 capstone. capstone.md documents one integrated policy assistant.

## Task
Run python debug_rag.py data and then python debug_rag.py data --fix (Lab 4B). Add a "Diagnose and fix" section with one row: symptom, layer, fix and outcome for the PTO roll-over question.

## Outcome
Add the section to capstone.md. Reply with one line saying what was added.`,
      },
      {
        step: 5,
        label: 'Approval gate',
        whereToRun: 'AI tool',
        prompt: `## Context
Stage 2 capstone. capstone.md documents one integrated policy assistant.

## Task
Run agent.py (Lab 5A) on "Summarize remote work requirements for manager email", answering yes once and no once. Add an "Approval gate" section with both traces, including human_approved and the final status.

## Outcome
Add the section to capstone.md. Reply with one line saying what was added.`,
      },
      {
        step: 6,
        label: 'Guardrails',
        whereToRun: 'AI tool',
        prompt: `## Context
Stage 2 capstone. capstone.md documents one integrated policy assistant.

## Task
Run redteam.py (Lab 6). Add a "Guardrails" section with a 2-row table for the normal PTO question and Attack 1, with the columns prompt, tools called, result and pass or fail.

## Outcome
Add the section to capstone.md. Reply with one line saying what was added.`,
      },
      {
        step: 7,
        label: 'MCP search',
        whereToRun: 'AI tool',
        prompt: `## Context
Stage 2 capstone. capstone.md documents one integrated policy assistant.

## Task
Run mcp_client.py (Lab 7) with the query "How many PTO days can roll over?". Add an "MCP search" section with the tool call arguments and the first result's chunk id and file.

## Outcome
Add the section to capstone.md. Reply with one line saying what was added.`,
      },
    ],
    acceptanceCriteria: [
      'All seven sections include real results (a model id, HTTP JSON, file names, traces or an MCP result).',
      'The write-up uses the policy_corpus/ storyline, not a generic "sample documents" folder.',
      'No Customer support ticketing system or Todo product names appear in the deliverable.',
    ],
    troubleshooting: [
      troubleshootingEntry(
        'A section has no real result',
        'The section holds general text only.',
        'Placeholder text was left in capstone.md without running the lab script.',
        'The section holds general text only. Run the script and replace the text with the real output.',
      ),
      troubleshootingEntry(
        'A script fails',
        'The script failed with an execution error.',
        'Environment or runtime error encountered while executing a lab step.',
        'The script failed with this error: <paste the full error here>. Fix it with the smallest possible fix, then run it again.',
      ),
    ],
  },
}
