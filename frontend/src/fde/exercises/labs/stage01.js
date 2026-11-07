import { TODO_ONE_LINER, TUTOR_START, GLOSSARY_COMMON, troubleshootingEntry } from '../labShared'
import {
  PROMPT_TODO_WELCOME_SUMMARY,
  PROMPT_TODO_WELCOME_FIX,
  PROMPT_TODO_ENV_CHECKLIST,
  PROMPT_TODO_ENV_FIX,
  PROMPT_TODO_ENV_CURL,
  PROMPT_TODO_HTTPX_CLIENT,
  PROMPT_TODO_HTTPX_FIX,
  PROMPT_TODO_API_TESTS,
  PROMPT_TODO_PYTEST_FIX,
} from './promptCompact'

export const stage01Labs = {
  'software-engineering/welcome-goals-and-the-running-scenario': {
    track: 'todo',
    type: 'prompt-lab',
    title: 'Lab 0: First prompt on the Todo app',
    duration: '30 min',
    prerequisites: [],
    beforeYouStart: `${TUTOR_START} ${TODO_ONE_LINER} Today: prompts only—no coding.`,
    glossary: [
      ...GLOSSARY_COMMON,
      { term: 'FDE', meaning: 'Forward Deployed Engineer—ships AI solutions with prompts and checks.' },
      { term: 'Todo app', meaning: 'Practice app for tutored labs; Ask IT is for assignments.' },
    ],
    objective: 'Practice prompt → check → fix on the Todo story.',
    scenario: 'Learn the loop before Python labs.',
    prompts: [
      {
        step: 1,
        label: 'Explain Todo',
        whereToRun: 'AI tool',
        prompt: PROMPT_TODO_WELCOME_SUMMARY,
        checkpoint: '8 bullets you can read in under 2 minutes.',
      },
      {
        step: 2,
        label: 'Fix loop',
        whereToRun: 'AI tool',
        prompt: PROMPT_TODO_WELCOME_FIX,
        checkpoint: 'You get a follow-up prompt, not a full new BRD.',
      },
    ],
    acceptanceCriteria: ['Both prompts run.', 'Saved todo-summary.txt or screenshot.'],
    troubleshooting: [
      troubleshootingEntry(
        'Reply is an essay, not 8 bullets',
        'Format was ignored.',
        'Model added sections.',
        'Reply with exactly 8 bullets about the Todo app. No intro paragraph.',
      ),
      troubleshootingEntry(
        'Step 2 rewrote entire BRD',
        'You wanted a fix prompt only.',
        'Task was too broad.',
        'Do not write BRD.md. Give missing heading + one copy-paste fix prompt only.',
      ),
      troubleshootingEntry(
        'Unsure where to paste',
        'Need the chat box.',
        'Wrong tool window.',
        'Open Cursor or ChatGPT chat, paste, send. Save answer to todo-summary.txt.',
      ),
    ],
    deliverable: 'todo-summary.txt',
    keyLearning: 'Prompt, check, fix—same loop for code later.',
  },

  'software-engineering/environment-setup-and-api-calls': {
    track: 'todo',
    type: 'prompt-lab',
    title: 'Lab: Install tools for Todo labs',
    duration: '45 min',
    prerequisites: ['Lab 0'],
    beforeYouStart: TUTOR_START,
    glossary: [
      ...GLOSSARY_COMMON,
      { term: 'Terminal', meaning: 'PowerShell (Windows) or Terminal (Mac) for commands.' },
    ],
    objective: 'Install Python, Node, Git, Docker; verify each.',
    scenario: 'Todo labs need these tools once.',
    prompts: [
      { step: 1, label: 'Checklist', whereToRun: 'AI tool', prompt: PROMPT_TODO_ENV_CHECKLIST, checkpoint: 'Checklist saved.' },
      { step: 2, label: 'Fix errors', whereToRun: 'AI tool', prompt: PROMPT_TODO_ENV_FIX, checkpoint: 'Versions print.' },
      { step: 3, label: 'Future curl', whereToRun: 'AI tool', prompt: PROMPT_TODO_ENV_CURL, checkpoint: 'You understand /health check.' },
    ],
    acceptanceCriteria: ['python 3.11+', 'node 20+', 'git', 'docker --version (engine on).'],
    troubleshooting: [
      troubleshootingEntry(
        'python not recognized',
        'PATH issue on Windows.',
        'Install without Add to PATH.',
        'Windows: reinstall Python with Add to PATH; reopen PowerShell; run py --version.',
      ),
      troubleshootingEntry(
        'Docker engine not running',
        'Desktop stopped.',
        'App not started.',
        'Start Docker Desktop; run docker run hello-world; describe success output.',
      ),
      troubleshootingEntry(
        'node works in one terminal only',
        'Old PATH.',
        'Terminal opened before install.',
        'Close all terminals; open new one; node --version.',
      ),
    ],
    deliverable: 'setup-checklist.md with pasted verify output',
    keyLearning: 'Fix installs with prompts, not guessing.',
  },

  'software-engineering/pydantic-and-typing': {
    track: 'todo',
    type: 'concept',
    title: 'Concept: Validate a Todo task (Pydantic)',
    duration: '40 min',
    prerequisites: ['Environment setup lab'],
    beforeYouStart: TUTOR_START,
    glossary: [
      ...GLOSSARY_COMMON,
      { term: 'Pydantic', meaning: 'Checks JSON shapes before your API uses them.' },
    ],
    objective: 'Run a tiny TaskCreate validator.',
    scenario: 'Todo POST /tasks must reject blank titles.',
    steps: [
      'Save snippet as task_demo.py.',
      'Run: python task_demo.py',
      'Break title (blank) and read the error.',
    ],
    codeExplanation: 'TaskCreate requires title. Validator rejects blanks.',
    conceptSnippet: {
      language: 'python',
      filename: 'task_demo.py',
      content: `from pydantic import BaseModel, field_validator

class TaskCreate(BaseModel):
    title: str
    done: bool = False

    @field_validator("title")
    @classmethod
    def not_blank(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("title must not be blank")
        return v

if __name__ == "__main__":
    ok = TaskCreate(title="Buy milk")
    print("Valid:", ok.title)
    try:
        TaskCreate(title="   ")
    except Exception as e:
        print("Expected error:", e)`,
      expectedOutput: 'Valid: Buy milk\nExpected error: ... title must not be blank ...',
    },
    acceptanceCriteria: ['Runs after pip install pydantic', 'Blank title errors'],
    troubleshooting: [
      troubleshootingEntry(
        'ModuleNotFoundError: pydantic',
        'Not installed.',
        'Missing pip install.',
        'Give pip install pydantic and rerun command.',
      ),
      troubleshootingEntry(
        'Blank title does not error',
        'Validator missing.',
        'Wrong field.',
        'Add field_validator on title; minimal fix to task_demo.py.',
      ),
      troubleshootingEntry(
        'Import error on validator syntax',
        'Python version or typo.',
        'Old Python.',
        'Fix syntax for Pydantic v2 field_validator only; show full fixed file.',
      ),
    ],
    deliverable: 'task_demo.py',
    keyLearning: 'Validate early—same idea for Ask IT tickets in assignments.',
  },

  'software-engineering/lab-1a-validated-api-call': {
    track: 'todo',
    type: 'prompt-lab',
    title: 'Lab 1A: httpx client for POST /tasks',
    duration: '50 min',
    prerequisites: ['Concept: Pydantic task'],
    beforeYouStart: TUTOR_START,
    glossary: [...GLOSSARY_COMMON, { term: 'POST', meaning: 'Send new data to an API.' }],
    objective: 'Generate submit_task.py; run; fix with prompts.',
    scenario: 'Call Todo API before full UI exists.',
    prompts: [
      { step: 1, label: 'Generate', whereToRun: 'AI tool', prompt: PROMPT_TODO_HTTPX_CLIENT, checkpoint: 'submit_task.py saved.' },
      { step: 2, label: 'Fix', whereToRun: 'AI tool', prompt: PROMPT_TODO_HTTPX_FIX, checkpoint: 'Friendly message if API down.' },
    ],
    acceptanceCriteria: ['httpx.post with JSON title', 'Network vs validation errors separated'],
    troubleshooting: [
      troubleshootingEntry(
        'Connection error when API down',
        'Expected in lab.',
        'No except for ConnectError.',
        'Catch httpx.ConnectError; print "Todo API is not running"; exit 0.',
      ),
      troubleshootingEntry(
        'Script still has /triage or Ask IT',
        'Wrong scenario.',
        'Old prompt context.',
        'Todo only: POST /tasks with {title}. Remove triage code.',
      ),
      troubleshootingEntry(
        '422 treated as network error',
        'Wrong except block.',
        'Broad Exception.',
        'Split RequestError vs ValidationError; print which failed.',
      ),
    ],
    deliverable: 'submit_task.py',
    whatYouLearn: [
      'Send JSON to a Todo API with httpx and read status codes and response bodies.',
      'Tell network errors apart from validation errors and explain each in plain English.',
      'Use a fix prompt when the API is down instead of changing code at random.',
      'Run a small client script from your project folder and save it as a deliverable.',
    ],
  },

  'software-engineering/lab-1b-tested-triage-endpoint': {
    track: 'todo',
    type: 'prompt-lab',
    title: 'Lab 1B: Todo API + pytest',
    duration: '60 min',
    prerequisites: ['Lab 1A'],
    beforeYouStart: TUTOR_START,
    glossary: [
      ...GLOSSARY_COMMON,
      { term: 'pytest', meaning: 'Runs test_*.py and reports pass/fail.' },
    ],
    objective: 'Prompt main.py + tests; pytest passes.',
    scenario: 'Todo /tasks endpoint with tests.',
    prompts: [
      { step: 1, label: 'Generate', whereToRun: 'AI tool', prompt: PROMPT_TODO_API_TESTS, checkpoint: 'main.py + test_main.py.' },
      { step: 2, label: 'pytest fix', whereToRun: 'AI tool', prompt: PROMPT_TODO_PYTEST_FIX, checkpoint: 'pytest -v green.' },
    ],
    acceptanceCriteria: ['Blank title → 422', 'All tests pass'],
    troubleshooting: [
      troubleshootingEntry(
        'pytest collected 0 tests',
        'Wrong file name.',
        'Not test_*.py.',
        'Rename to test_main.py; functions start with test_.',
      ),
      troubleshootingEntry(
        'Tests interfere with each other',
        'Shared list.',
        'No autouse clear.',
        'Add autouse fixture to reset in-memory tasks between tests.',
      ),
      troubleshootingEntry(
        'Blank title returns 201',
        'No validator.',
        'Pydantic skipped.',
        'Reject blank title; POST returns 422.',
      ),
    ],
    deliverable: 'main.py, test_main.py, pytest log',
    whatYouLearn: [
      'Scaffold a FastAPI Todo endpoint with Pydantic validation using AI-generated code.',
      'Write pytest tests that expect 422 for bad input and pass when behavior is correct.',
      'Run pytest, read failures, and apply a minimal fix prompt until tests are green.',
      'Verify AI-written backend code with automated tests before you trust it.',
    ],
  },
}
