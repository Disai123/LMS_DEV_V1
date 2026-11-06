import { ASK_IT_ONE_LINER, GLOSSARY_COMMON, troubleshootingEntry } from '../labShared'
import {
  PROMPT_WELCOME_STEP1,
  PROMPT_WELCOME_STEP2,
  PROMPT_ENV_SETUP_STEP1,
  PROMPT_ENV_SETUP_STEP2,
  PROMPT_ENV_SETUP_STEP3,
  PROMPT_LAB1A_GENERATE,
  PROMPT_LAB1A_FIX,
  PROMPT_HARDEN_TRIAGE,
  PROMPT_LAB1B_GENERATE,
  PROMPT_LAB1B_FIX,
} from './promptText'

export const stage01Labs = {
  'software-engineering/welcome-goals-and-the-running-scenario': {
    type: 'prompt-lab',
    title: 'Lab 0: Your first prompt and the Ask IT story',
    duration: '30 min',
    prerequisites: [],
    beforeYouStart:
      'You do not need prior coding experience. A Forward Deployed Engineer (FDE) helps a client ship AI software by writing clear prompts, checking results, and fixing mistakes with follow-up prompts. ' +
      ASK_IT_ONE_LINER +
      ' Today you only practice prompting—no coding.',
    glossary: [
      ...GLOSSARY_COMMON,
      { term: 'FDE', meaning: 'Forward Deployed Engineer—works on-site with the client to deliver AI solutions.' },
      { term: 'Ask IT', meaning: 'Our practice app: IT support chatbot for retail stores (Stages 1–9).' },
    ],
    objective: 'Run your first professional prompt and learn the loop: prompt → check → fix.',
    scenario:
      'Before touching Python or FastAPI, you must be comfortable directing an AI coding assistant. This lab sets that habit.',
    prompts: [
      {
        step: 1,
        label: 'Explain Ask IT in plain language',
        whereToRun: 'AI tool',
        prompt: PROMPT_WELCOME_STEP1,
        checkpoint: 'You receive a short bullet list you can read aloud in under 2 minutes.',
      },
      {
        step: 2,
        label: 'Practice the fix loop',
        whereToRun: 'AI tool',
        prompt: PROMPT_WELCOME_STEP2,
        checkpoint: 'The AI gives you a copy-paste fix prompt, not a full new BRD.',
      },
    ],
    acceptanceCriteria: [
      'You copied and ran both prompts in an AI tool.',
      'You saved a note (any file) with the 8-bullet Ask IT summary.',
      'You can state the three steps: prompt, check, fix.',
    ],
    troubleshooting: [
      troubleshootingEntry(
        'The reply is a long essay, not 8 bullets',
        'You cannot brief a teammate in two minutes.',
        'The prompt did not cap the format.',
        'Reply again with exactly 8 short bullets about Ask IT. No extra sections. Use words a non-programmer understands.',
      ),
      troubleshootingEntry(
        'The fix-loop step rewrote a whole BRD',
        'You asked for a follow-up prompt, not a new document.',
        'The model jumped ahead and generated the document.',
        'Do not write BRD.md. Reply with only (1) which heading is missing and (2) one copy-paste prompt I should use to add it.',
      ),
      troubleshootingEntry(
        'I do not know where to paste the prompt',
        'The lab is about the AI chat, not Terminal yet.',
        'The tool chat box was not opened.',
        'Open Cursor or ChatGPT chat. Paste the prompt. Send. Save the answer in notes/ask-it-summary.txt. Do not run code.',
      ),
    ],
    deliverable: 'notes/ask-it-summary.txt (or screenshot of the AI reply)',
    keyLearning: 'FDE work is prompt-driven; fixing gaps with follow-up prompts is the core skill—not memorizing syntax.',
  },

  'software-engineering/environment-setup-and-api-calls': {
    type: 'prompt-lab',
    title: 'Lab: Install tools and make your first API call',
    duration: '45 min',
    prerequisites: ['Lab 0'],
    beforeYouStart:
      'You will install free tools developers use: Python (runs backend logic), Node (runs the web UI), Git (saves versions), Cursor or VS Code (editor), and Docker Desktop (runs apps in containers later). ' +
      'An API call is asking a running program a question over the internet—like opening a menu and ordering food.',
    glossary: [
      ...GLOSSARY_COMMON,
      { term: 'Terminal', meaning: 'A text window where you type commands (PowerShell on Windows, Terminal on Mac).' },
      { term: 'PATH', meaning: 'A list of folders Windows/Mac searches to find programs when you type a command.' },
    ],
    objective: 'Install core tools with AI-guided steps and verify each install with one command.',
    scenario: 'Ask IT labs later need Python, Node, and Docker. Doing setup once prevents every lab from breaking on "command not found".',
    prompts: [
      {
        step: 1,
        label: 'Install checklist for your OS',
        whereToRun: 'AI tool',
        prompt: PROMPT_ENV_SETUP_STEP1,
        checkpoint: 'You have a checklist with verify commands you understand.',
      },
      {
        step: 2,
        label: 'Fix install errors',
        whereToRun: 'AI tool',
        prompt: PROMPT_ENV_SETUP_STEP2,
        checkpoint: 'Verify commands show version numbers (not "command not found").',
      },
      {
        step: 3,
        label: 'First API call (when backend is running later)',
        whereToRun: 'Terminal',
        prompt: PROMPT_ENV_SETUP_STEP3,
        checkpoint: 'You understand curl checks if the API is alive (future labs).',
      },
    ],
    acceptanceCriteria: [
      'python --version (or py --version) shows 3.11+.',
      'node --version shows v20+.',
      'git --version prints a version.',
      'docker --version works (Docker Desktop running).',
    ],
    troubleshooting: [
      troubleshootingEntry(
        '"python" or "py" is not recognized',
        'Windows cannot find Python because install did not update PATH.',
        'Python was installed without "Add to PATH", or the terminal was not reopened.',
        'I am on Windows. python is not recognized. Give beginner steps: reinstall Python 3.11 with Add python.exe to PATH checked, close PowerShell, open a new one, run py --version.',
      ),
      troubleshootingEntry(
        'Docker Desktop says the engine is not running',
        'The Docker app is installed but the engine is stopped.',
        'Docker Desktop was not started, or virtualization is off.',
        'Docker --version works but docker run hello-world fails with engine not running. Give Windows and Mac steps to start Docker Desktop and one success message I should see.',
      ),
      troubleshootingEntry(
        'node --version works in one terminal and fails in another',
        'The new terminal does not see the install yet.',
        'PATH was updated after that window opened.',
        'Explain in plain language why I must close and reopen the terminal after installing Node. Give the one command that proves Node 20 is ready.',
      ),
    ],
    deliverable: 'setup-checklist.md with verify outputs pasted',
    stretchGoal: 'Create a folder ask-it-labs and run git init with AI guidance.',
    keyLearning: 'Setup is part of the job; use prompts to fix install errors instead of guessing.',
  },

  'software-engineering/pydantic-and-typing': {
    type: 'concept',
    title: 'Concept: Validate a support ticket (Pydantic)',
    duration: '40 min',
    prerequisites: ['Environment setup lab'],
    beforeYouStart:
      'Pydantic is a Python library that checks data shapes before you use them—like a bouncer checking IDs at the door. Ask IT uses it so bad ticket data never enters the helpdesk queue.',
    glossary: [
      ...GLOSSARY_COMMON,
      { term: 'Pydantic', meaning: 'Python library that validates JSON/dict data against rules you define.' },
      { term: 'Model', meaning: 'A template describing required fields (email, store id, priority).' },
    ],
    objective: 'Run a tiny Python snippet that validates a TicketCreate payload.',
    scenario: 'When a store employee escalates an issue, TicketCreate must enforce email format and non-empty description.',
    steps: [
      'Open Terminal in a folder with Python installed.',
      'Save the snippet below as ticket_demo.py.',
      'Run: python ticket_demo.py',
      'Break the script on purpose (blank description) and read the error.',
    ],
    codeExplanation:
      'TicketCreate lists fields. field_validator strips spaces and rejects blanks. The __main__ block tries valid then invalid data.',
    conceptSnippet: {
      language: 'python',
      filename: 'ticket_demo.py',
      content: `from pydantic import BaseModel, EmailStr, field_validator
from typing import Literal

Priority = Literal["High", "Medium", "Low"]

class TicketCreate(BaseModel):
    user_email: EmailStr
    store_id: str
    issue_description: str
    category: str
    priority: Priority = "Medium"

    @field_validator("issue_description")
    @classmethod
    def not_blank(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("issue_description must not be blank")
        return v

if __name__ == "__main__":
    ok = TicketCreate(
        user_email="clerk@store042.retail.local",
        store_id="ST-042",
        issue_description="POS frozen on boot logo",
        category="POS",
        priority="High",
    )
    print("Valid:", ok.priority)
    try:
        TicketCreate(
            user_email="clerk@store042.retail.local",
            store_id="ST-042",
            issue_description="   ",
            category="POS",
        )
    except Exception as e:
        print("Expected error:", e)`,
      expectedOutput: `Valid: High
Expected error: ... issue_description must not be blank ...`,
    },
    acceptanceCriteria: ['Script runs without import errors (pip install pydantic email-validator if needed).', 'Blank description raises a clear validation error.'],
    troubleshooting: [
      troubleshootingEntry(
        'ModuleNotFoundError: pydantic or email_validator',
        'Python cannot find the libraries this snippet imports.',
        'They are not installed in this environment.',
        'I get ModuleNotFoundError for pydantic. Give the exact pip install command for pydantic and email-validator, then the command to rerun ticket_demo.py.',
      ),
      troubleshootingEntry(
        'Valid ticket prints but blank description does not error',
        'The validator is not attached to issue_description.',
        'The field_validator was removed or applied to the wrong field.',
        'Fix ticket_demo.py so a blank or spaces-only issue_description raises ValueError. Keep the valid example printing priority High.',
      ),
      troubleshootingEntry(
        'EmailStr rejects clerk@store042.retail.local',
        'The email checker is stricter than this lab example.',
        'email-validator wants a public-looking domain.',
        'Explain the email error in plain words and change the sample email to clerk@example.com so the valid case still prints.',
      ),
    ],
    deliverable: 'ticket_demo.py saved locally',
    keyLearning: 'Validate early with Pydantic so APIs and tickets stay trustworthy.',
  },

  'software-engineering/lab-1a-validated-api-call': {
    type: 'prompt-lab',
    title: 'Lab 1A: Generate an httpx client for POST /triage',
    duration: '50 min',
    prerequisites: ['Concept: Pydantic ticket'],
    beforeYouStart:
      'httpx is a Python library that calls APIs (sends JSON over the network). You will ask the AI to generate a script, run it in Terminal, and fix errors with follow-up prompts—not by rewriting from scratch.',
    glossary: [...GLOSSARY_COMMON, { term: 'POST', meaning: 'Send new data to an API (here, create a triage ticket).' }],
    objective: 'Use prompts to create submit_triage.py that POSTs to /triage and handles network vs validation errors.',
    scenario: 'Ask IT needs a script to test triage before the full backend exists (mock URL or local server later).',
    prompts: [
      {
        step: 1,
        label: 'Generate the client',
        whereToRun: 'AI tool',
        prompt: PROMPT_LAB1A_GENERATE,
        checkpoint: 'submit_triage.py exists in your project folder.',
      },
      {
        step: 2,
        label: 'Run and fix',
        whereToRun: 'Terminal',
        prompt: PROMPT_LAB1A_FIX,
        checkpoint: 'Script runs; if API is down, you see a friendly network message (not a crash).',
      },
    ],
    acceptanceCriteria: [
      'submit_triage.py uses httpx.post with JSON body.',
      'Network errors and validation errors are handled in separate except blocks.',
      'You fixed at least one issue using a follow-up prompt.',
    ],
    troubleshooting: [
      troubleshootingEntry(
        'Connection error when the API is not running',
        'The script tried localhost:8000 and nothing is listening. That is expected in this lab.',
        'The except block crashes instead of printing a friendly message.',
        'Update submit_triage.py so httpx.ConnectError prints "Ask IT API is not running" and exits 0. Do not start a server.',
      ),
      troubleshootingEntry(
        'Validation errors are caught as network errors',
        'A bad email and a dead server look the same to the user.',
        'One broad except Exception wraps both cases.',
        'Split handling: httpx.RequestError for network, ValidationError for bad ticket fields. Print which kind failed.',
      ),
      troubleshootingEntry(
        'The generated file calls GET /tasks',
        'The model reused an old to-do example.',
        'The prompt context was too weak.',
        'Rewrite submit_triage.py for Ask IT only: POST /triage with user_email, store_id, issue_description, category, priority. Remove any task or to-do code.',
      ),
    ],
    deliverable: 'submit_triage.py',
    keyLearning: 'Generate with prompts, verify in Terminal, fix with prompts—that is the FDE loop.',
  },

  'software-engineering/harden-the-api-script': {
    type: 'prompt-lab',
    title: 'Lab: Harden the triage client with prompts',
    duration: '35 min',
    prerequisites: ['Lab 1A'],
    beforeYouStart: 'Production scripts need timeouts and retries so one slow network does not hang forever.',
    glossary: GLOSSARY_COMMON,
    objective: 'Prompt the AI to add timeout, retries, and clearer error messages to submit_triage.py.',
    scenario: 'Store networks can be flaky; Ask IT triage scripts must fail gracefully.',
    prompts: [
      {
        step: 1,
        label: 'Add timeout and retries',
        whereToRun: 'AI tool',
        prompt: PROMPT_HARDEN_TRIAGE,
        checkpoint: 'File includes timeout=10 and a retry loop.',
      },
    ],
    acceptanceCriteria: ['Timeout is set on httpx calls.', 'Retries do not loop on 422 validation errors from API.'],
    troubleshooting: [
      troubleshootingEntry(
        'The script retries forever',
        'A permanent error (bad data) is treated like a network blip.',
        'The retry loop wraps every exception, including 422.',
        'Retry only httpx.ConnectError or timeouts, max 3 times. If status is 422, print the body and stop.',
      ),
      troubleshootingEntry(
        'timeout= is missing on the POST',
        'A hung network can freeze the script.',
        'The update prompt was applied to comments only.',
        'Set timeout=10 on the httpx client or post call. Show the one changed line.',
      ),
      troubleshootingEntry(
        'Retries print nothing, so I cannot tell what happened',
        'Silent retries look like a freeze to a beginner.',
        'No log line per attempt.',
        'Print "attempt 1 of 3" before each POST. After the last failure, print a one-line summary.',
      ),
    ],
    deliverable: 'Updated submit_triage.py',
    keyLearning: 'Reliability improvements are prompt-sized tasks—iterate, do not rewrite from scratch.',
  },

  'software-engineering/lab-1b-tested-triage-endpoint': {
    type: 'prompt-lab',
    title: 'Lab 1B: Prompt-build /triage + pytest',
    duration: '60 min',
    prerequisites: ['Lab 1A'],
    beforeYouStart:
      'FastAPI is a Python framework for building APIs. pytest runs automatic checks. You will prompt the AI to create main.py and test_main.py, then fix failing tests with prompts.',
    glossary: [
      ...GLOSSARY_COMMON,
      { term: 'FastAPI', meaning: 'Python toolkit to build web APIs quickly.' },
      { term: 'pytest', meaning: 'Runs test_*.py files and reports pass/fail.' },
    ],
    objective: 'Generate POST /triage with SLA hours and a pytest suite; fix failures via prompts.',
    scenario: 'This endpoint becomes Ask IT escalation when RAG confidence is low.',
    prompts: [
      {
        step: 1,
        label: 'Generate API + tests',
        whereToRun: 'AI tool',
        prompt: PROMPT_LAB1B_GENERATE,
        checkpoint: 'main.py and test_main.py saved.',
      },
      {
        step: 2,
        label: 'Run pytest and fix',
        whereToRun: 'Terminal',
        prompt: PROMPT_LAB1B_FIX,
        checkpoint: 'pytest shows 5 passed.',
      },
    ],
    acceptanceCriteria: ['pytest -v passes all tests.', 'POST blank description returns 422.'],
    troubleshooting: [
      troubleshootingEntry(
        'pytest collected 0 tests',
        'Pytest did not find test functions.',
        'The file is not named test_*.py or tests are not functions starting with test_.',
        'Rename the file to test_main.py and make sure each test is def test_.... Then run pytest -v from that folder.',
      ),
      troubleshootingEntry(
        'Tests fail because tickets from the previous test remain',
        'The in-memory list is shared across tests.',
        'The autouse fixture does not clear _tickets.',
        'Add a pytest fixture with autouse=True that clears the in-memory ticket list before and after each test.',
      ),
      troubleshootingEntry(
        'Blank description returns 201 instead of 422',
        'FastAPI accepted bad data.',
        'The Pydantic validator was not added to issue_description.',
        'Reject blank issue_description with a field_validator so POST /triage returns 422. Keep the happy-path test expecting 201 and sla_hours.',
      ),
    ],
    deliverable: 'main.py, test_main.py, pytest output screenshot',
    keyLearning: 'Tests are how you trust AI-generated backend code—run pytest after every prompt.',
  },
}
