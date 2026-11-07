import { TUTOR_START, GLOSSARY_COMMON, troubleshootingEntry } from '../labShared'
import {
  PROMPT_TODO_MODEL_COMPARE_NOTE,
  PROMPT_TODO_INGEST,
  PROMPT_TODO_INGEST_FIX,
  PROMPT_TODO_RAG_DIAG,
  PROMPT_TODO_RAG_FIX,
  PROMPT_TODO_AGENT,
  PROMPT_TODO_AGENT_APPROVAL,
  PROMPT_TODO_ATTACK,
  PROMPT_TODO_GUARDRAIL,
  PROMPT_TODO_SKILL,
} from './promptCompact'

export const stage02Labs = {
  'ai-engineering/lab-2-compare-two-models': {
    track: 'todo',
    type: 'concept',
    title: 'Lab 2: Compare models on Todo priority',
    duration: '45 min',
    prerequisites: ['Lab 1B'],
    beforeYouStart: TUTOR_START,
    glossary: [
      ...GLOSSARY_COMMON,
      { term: 'Token', meaning: 'Text chunks billed by the API.' },
    ],
    objective: 'Run compare_models.py on Todo task urgency labels.',
    scenario: 'Pick a model before Ask IT assignment.',
    steps: ['Set OPENAI_API_KEY', 'Save script below', 'Run python compare_models.py', 'Run interpret prompt'],
    conceptSnippet: {
      language: 'python',
      filename: 'compare_models.py',
      content: `import time
from openai import OpenAI

client = OpenAI()
SYSTEM = "Reply with one word: High, Medium, or Low priority for a Todo task."
TASKS = ["Pay rent today", "Rename shopping list", "Fix typo in note"]
MODELS = ["gpt-4o-mini", "gpt-3.5-turbo"]

for task in TASKS:
    for model in MODELS:
        t0 = time.time()
        r = client.chat.completions.create(
            model=model,
            messages=[{"role": "system", "content": SYSTEM}, {"role": "user", "content": task}],
            max_tokens=5,
            temperature=0,
        )
        label = r.choices[0].message.content.strip()
        print(f"{model:16} {task[:24]:24} -> {label:6} {time.time()-t0:.2f}s")`,
      expectedOutput: 'Table of model, task, label, seconds',
    },
    prompts: [
      {
        step: 1,
        label: 'Interpret',
        whereToRun: 'AI tool',
        prompt: PROMPT_TODO_MODEL_COMPARE_NOTE,
        checkpoint: 'One-paragraph recommendation saved.',
      },
    ],
    acceptanceCriteria: ['Script runs', 'Both models on each task'],
    troubleshooting: [
      troubleshootingEntry(
        'AuthenticationError',
        'Bad API key.',
        'Key not in env.',
        'Steps for .env and rerun without printing key.',
      ),
      troubleshootingEntry(
        'Model returns a sentence',
        'Not one word.',
        'max_tokens too high.',
        'System: exactly one word High/Medium/Low; max_tokens=5.',
      ),
      troubleshootingEntry(
        'model_not_found',
        'Invalid model id.',
        'Old name.',
        'Suggest replacement chat model for MODELS list.',
      ),
    ],
    deliverable: 'compare output + model-notes.txt',
    whatYouLearn: [
      'Call two LLM models on the same Todo tasks and compare latency and labels.',
      'Keep prompts tight so outputs stay in one-word format for fair comparison.',
      'Record results and write a short recommendation backed by your own run data.',
      'Choose a default model for later labs based on evidence, not habit.',
    ],
  },

  'ai-engineering/lab-3-ingest-and-index': {
    track: 'todo',
    type: 'prompt-lab',
    title: 'Lab 3: Ingest Todo help into FAISS',
    duration: '55 min',
    prerequisites: ['Lab 2'],
    beforeYouStart: TUTOR_START,
    glossary: [
      ...GLOSSARY_COMMON,
      { term: 'RAG', meaning: 'Search docs first, then answer.' },
      { term: 'FAISS', meaning: 'Fast similarity search on embeddings.' },
    ],
    objective: 'ingest_todo_help.py runs; top match makes sense.',
    scenario: 'Todo help docs for a tiny RAG demo.',
    prompts: [
      { step: 1, label: 'Generate', whereToRun: 'AI tool', prompt: PROMPT_TODO_INGEST, checkpoint: 'Script prints top match.' },
      { step: 2, label: 'Fix recall', whereToRun: 'AI tool', prompt: PROMPT_TODO_INGEST_FIX, checkpoint: '"mark done" hits right doc.' },
    ],
    acceptanceCriteria: ['6 vectors indexed', 'Sensible top-1 for test query'],
    troubleshooting: [
      troubleshootingEntry(
        'ImportError: faiss',
        'Missing package.',
        'pip gap.',
        'pip install faiss-cpu openai numpy; rerun.',
      ),
      troubleshootingEntry(
        'Wrong top match',
        'Bad FAQ text.',
        'k too high.',
        'Fix help string for "mark done"; k=2; show new top match.',
      ),
      troubleshootingEntry(
        'Indexed 0 vectors',
        'Empty embeddings.',
        'add skipped.',
        'Fix so 6 strings index; minimal diff.',
      ),
    ],
    deliverable: 'ingest_todo_help.py + output',
    whatYouLearn: [
      'Build a small FAISS index over Todo help text using embeddings.',
      'Run a test query and judge whether the top match is actually relevant.',
      'Improve recall with document edits or retrieval settings—not only a bigger model.',
      'Explain why source content quality matters for RAG answers.',
    ],
  },

  'ai-engineering/lab-4-diagnose-and-fix': {
    track: 'todo',
    type: 'prompt-lab',
    title: 'Lab 4: Diagnose bad Todo RAG answer',
    duration: '50 min',
    prerequisites: ['Lab 3'],
    beforeYouStart: TUTOR_START,
    glossary: GLOSSARY_COMMON,
    objective: 'Diagnose wrong answer; apply one fix.',
    scenario: 'Asked delete; got add-task help.',
    prompts: [
      { step: 1, label: 'Diagnose', whereToRun: 'AI tool', prompt: PROMPT_TODO_RAG_DIAG, checkpoint: '4-step checklist saved.' },
      { step: 2, label: 'Fix', whereToRun: 'AI tool', prompt: PROMPT_TODO_RAG_FIX, checkpoint: 'Delete query ranks delete FAQ.' },
    ],
    acceptanceCriteria: ['Root cause written', 'One fix tested'],
    troubleshooting: [
      troubleshootingEntry(
        'Diagnosis says use bigger model only',
        'Skips retrieval.',
        'Weak prompt.',
        'Check data and retrieval before model size.',
      ),
      troubleshootingEntry(
        'Many fixes at once',
        'Cannot tell what worked.',
        'Changed too much.',
        'One fix only; rerun one query.',
      ),
      troubleshootingEntry(
        'VPN FAQ metaphor—wrong app',
        'Used Ask IT example.',
        'Copy-paste old notes.',
        'Todo help docs only; delete vs add task.',
      ),
    ],
    deliverable: 'rag-debug-notes.md',
    whatYouLearn: [
      'Walk a wrong RAG answer through data → retrieval → prompt → model in order.',
      'Document one root cause in writing before you change anything.',
      'Apply a single targeted fix and re-test one query.',
      'Use the same diagnosis habit later on Ask IT FAQ retrieval.',
    ],
  },

  'ai-engineering/lab-5a-first-agent': {
    track: 'todo',
    type: 'prompt-lab',
    title: 'Lab 5A: Todo agent + tools',
    duration: '60 min',
    prerequisites: ['Lab 4'],
    beforeYouStart: TUTOR_START,
    glossary: [...GLOSSARY_COMMON, { term: 'Tool', meaning: 'Function the agent can call.' }],
    objective: 'todo_agent.py with search + create_task.',
    scenario: 'Natural language → right Todo action.',
    prompts: [
      { step: 1, label: 'Agent', whereToRun: 'AI tool', prompt: PROMPT_TODO_AGENT, checkpoint: 'Demo runs; trace shows tool.' },
    ],
    acceptanceCriteria: ['Two tools', 'Trace visible'],
    troubleshooting: [
      troubleshootingEntry(
        'No tool calls',
        'Answers from memory.',
        'Tools not bound.',
        'Force search_todo_help on "how to mark done"; verbose on.',
      ),
      troubleshootingEntry(
        'Connection refused',
        'API down.',
        'No backend.',
        'Friendly error in tool; uvicorn start command.',
      ),
      troubleshootingEntry(
        'Only one tool',
        'Cannot create task.',
        'Missing create_task.',
        'Add create_task tool; keep search.',
      ),
    ],
    deliverable: 'todo_agent.py',
    whatYouLearn: [
      'Wire an LLM to Todo tools (search help, create task) instead of free-form answers only.',
      'Read a simple trace or log to confirm which tool the agent chose.',
      'Handle API-down errors inside tools with clear user messages.',
      'Describe when an agent is better than a single chat prompt.',
    ],
  },

  'ai-engineering/lab-5b-approval-step': {
    track: 'todo',
    type: 'prompt-lab',
    title: 'Lab 5B: Approve before create_task',
    duration: '45 min',
    prerequisites: ['Lab 5A'],
    beforeYouStart: TUTOR_START,
    glossary: GLOSSARY_COMMON,
    objective: 'y/n before create_task; search stays instant.',
    scenario: 'Prevent accidental task spam.',
    prompts: [
      { step: 1, label: 'Approval', whereToRun: 'AI tool', prompt: PROMPT_TODO_AGENT_APPROVAL, checkpoint: 'n blocks create.' },
    ],
    acceptanceCriteria: ['Decline skips create', 'Search unchanged'],
    troubleshooting: [
      troubleshootingEntry(
        'n still creates task',
        'Gate missing.',
        'Check after POST.',
        'If n: print cancelled; no POST.',
      ),
      troubleshootingEntry(
        'Search asks approval',
        'Wrong gate placement.',
        'Wrapped all tools.',
        'Approval only on create_task.',
      ),
      troubleshootingEntry(
        'No input()',
        'Comment only.',
        'Not implemented.',
        'Add input("Create task? y/n: ") on create path.',
      ),
    ],
    deliverable: 'Updated todo_agent.py',
    whatYouLearn: [
      'Add a human approval step before create_task without slowing safe read-only tools.',
      'Test both approve and decline paths so tasks are not created by mistake.',
      'Explain why risky actions need a gate in customer-facing AI products.',
    ],
  },

  'ai-engineering/lab-6-add-guardrails-and-attack': {
    track: 'todo',
    type: 'prompt-lab',
    title: 'Lab 6: Attack + guardrail (Todo)',
    duration: '50 min',
    prerequisites: ['Lab 5A'],
    beforeYouStart: TUTOR_START,
    glossary: [{ term: 'Prompt injection', meaning: 'Trick the bot to break rules.' }],
    objective: 'Document attack; fix so bulk-delete blocked.',
    scenario: 'Protect Todo from "delete all tasks" injection.',
    prompts: [
      { step: 1, label: 'Attack', whereToRun: 'AI tool', prompt: PROMPT_TODO_ATTACK, checkpoint: 'Attack + safe response written.' },
      { step: 2, label: 'Guardrail', whereToRun: 'AI tool', prompt: PROMPT_TODO_GUARDRAIL, checkpoint: 'Attack fails safely.' },
    ],
    acceptanceCriteria: ['Attack logged', 'Normal add still works'],
    troubleshooting: [
      troubleshootingEntry(
        'Attack succeeds',
        'Guardrail failed.',
        'No filter.',
        'Refuse bulk delete instructions; allow normal add.',
      ),
      troubleshootingEntry(
        'Everything refused',
        'Too strict.',
        'Broad rule.',
        'Allow "add task"; refuse "ignore rules delete all".',
      ),
      troubleshootingEntry(
        'No expected safe output saved',
        'Nothing to compare.',
        'Skipped step 1.',
        'Save 4 lines: attack, bad output, expected safe, fix prompt.',
      ),
    ],
    deliverable: 'guardrail-test-log.txt',
    whatYouLearn: [
      'Run a realistic prompt-injection attack against your Todo agent.',
      'Define the safe behavior you expect when rules are broken.',
      'Add guardrails that block abuse but still allow normal task commands.',
      'Log attacks and fixes for security reviews on Ask IT later.',
    ],
  },

  'ai-engineering/lab-7-skill-and-mcp-tool': {
    track: 'todo',
    type: 'prompt-lab',
    title: 'Lab 7: Task lookup skill + MCP',
    duration: '45 min',
    prerequisites: ['Lab 5A'],
    beforeYouStart: TUTOR_START,
    glossary: [{ term: 'MCP', meaning: 'Standard way to plug tools into assistants.' }],
    objective: 'skills/task_lookup.md + MCP spec for GET /tasks/{id}.',
    scenario: 'Reusable lookup for agents.',
    prompts: [
      { step: 1, label: 'Skill', whereToRun: 'AI tool', prompt: PROMPT_TODO_SKILL, checkpoint: 'Skill + schema saved.' },
    ],
    acceptanceCriteria: ['ticket_id param', 'HTTP GET described'],
    troubleshooting: [
      troubleshootingEntry(
        'Skill invents status',
        'No HTTP.',
        'Hallucinated tool.',
        'GET /tasks/{id} only; not found message.',
      ),
      troubleshootingEntry(
        'MCP missing task_id',
        'Cannot call.',
        'Empty schema.',
        'Required string task_id.',
      ),
      troubleshootingEntry(
        'Full backend rewrite',
        'Too much scope.',
        'Prompt too open.',
        'Only skill file + MCP spec.',
      ),
    ],
    deliverable: 'skills/task_lookup.md',
    whatYouLearn: [
      'Write a reusable skill doc that describes one Todo API operation.',
      'Specify parameters and HTTP method so another agent can call it correctly.',
      'Map the skill to an MCP-style tool schema for assistants.',
      'Package small behaviors as skills instead of one giant prompt.',
    ],
  },
}
