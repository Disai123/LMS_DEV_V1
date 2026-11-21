import { FOUNDATION_START, GLOSSARY_COMMON, troubleshootingEntry } from '../labShared'
import {
  INTRO_S1_FASTAPI_SIMPLE,
  INTRO_S1_FASTAPI_TEST,
  PROMPT_S1_FASTAPI_SIMPLE,
  PROMPT_S1_FASTAPI_SIMPLE_FIX,
  PROMPT_S1_FASTAPI_TEST,
  PROMPT_S1_FASTAPI_TEST_FIX,
} from './promptFoundation'

export const stage01Labs = {
  'software-engineering/lab-0-python-basics': {
    track: 'foundation',
    type: 'prompt-lab',
    title: 'Lab 0: Python basics',
    duration: '40 min',
    beforeYouStart: FOUNDATION_START,
    glossary: [
      {
        term: 'Variable',
        meaning: 'A name that holds a value, such as days = 6.',
      },
      {
        term: 'List and dictionary',
        meaning: 'A list holds items in order; a dictionary holds values under names (keys).',
      },
      {
        term: 'Function',
        meaning: 'A named block of code that takes input and returns a result.',
      },
    ],
    labContext:
      'Build a small Python script, basics.py, for a fruit shop, run it, and change one value to see the result change. This is the first step before the API labs in Lab 1A.',
    whatYouLearn: [
    'Variables, strings, lists and dictionaries in one small script.',
    'A function plus loop and if to count items.',
    'How dict/list shapes relate to JSON in the next API lab.',
  ],
    prompts: [
      {
        step: 1,
        label: 'Generate the basics',
        whereToRun: 'Antigravity',
        prompt: `## Context
A beginner Python script named basics.py is being built for a small fruit shop. Each concept sits in its own short block with a one-line comment.

## Task
Create basics.py with four blocks:
1. Variables: a shop name as text with extra spaces, the number of days open per week, and an open flag set to True.
2. Strings: clean the shop name with strip() and title(), then print a welcome line using an f-string and print the name in upper case.
3. List: three fruit names, then print how many there are.
4. Dictionary: one item with name, price and quantity, then print its name and print the whole item with json.dumps.

## Outcome
- python basics.py prints the welcome line, the upper-case name, Fruits: 3, the item name and one line of JSON.
- Every block has a one-line comment.`,
      },
      {
        step: 2,
        label: 'Add functions, a loop and a decision',
        whereToRun: 'Antigravity',
        prompt: `## Context
basics.py from Step 1 runs correctly. Functions, a loop and an if statement are added to the same file.

## Task
Add a list of three items, each a dictionary with name, price and quantity. Add a function total_price(item) that returns price times quantity, and a function count_low_stock(items) that uses a for loop and an if statement to count items with a quantity below 5. Print each item's total and the low-stock count.

## Outcome
- One line per item in the format apple: 480.
- One final line: Low stock: 1.`,
      },
      {
        step: 3,
        label: 'Fix (only if needed)',
        whereToRun: 'Antigravity',
        prompt: `## Context
basics.py failed to run, or printed the wrong output.

## Task
Error: <paste the full error here>. Fix it with the smallest possible change.

## Outcome
One line saying what changed.`,
      },
    ],
    acceptanceCriteria: [
      'The script uses a variable, a string method, a list, a dictionary, two functions, a for loop and an if.',
      'The output matches the Outcome of each step.',
      'Changing a quantity changes the low-stock count.',
    ],
    troubleshooting: [
      troubleshootingEntry(
        'python is not recognised',
        'The terminal cannot find python on your PATH.',
        'Python is not installed or not added to system PATH.',
        'python is not recognised in the terminal. Provide step-by-step instructions to verify installation and run python or python3 on Windows and Mac/Linux.',
      ),
      troubleshootingEntry(
        'IndentationError or SyntaxError',
        'Python found mismatched indentation or invalid syntax in basics.py.',
        'Mixing tabs and spaces, or a missing colon or parenthesis.',
        'Error: <paste the full error here>. Fix the indentation or syntax error in basics.py with the smallest possible change.',
      ),
      troubleshootingEntry(
        'KeyError',
        'The script tried to access a dictionary key that does not exist.',
        'Typo in a key name such as item["price"] or a missing key in a dictionary.',
        'Error: KeyError: <key>. Check the dictionary keys in basics.py and fix the mismatch with the smallest change.',
      ),
    ],
  },

  'software-engineering/lab-fastapi-simple-api': {
    track: 'foundation',
    type: 'prompt-lab',
    title: 'Lab 1A: Create a simple API',
    duration: '45 min',
    beforeYouStart: FOUNDATION_START,
    glossary: [
      {
        term: 'uvicorn',
        meaning:
          'The server program that runs a FastAPI app and listens for requests.',
      },
      {
        term: 'Endpoint',
        meaning: 'A URL path an API answers, such as /health.',
      },
      {
        term: 'curl',
        meaning:
          'A command-line tool for sending requests to an API and printing the reply.',
      },
    ],
    labContext:
      'Ask the AI tool to create main.py, set up a virtual environment, start the server and confirm it works. This is the first step before AI or customer APIs in later stages.',
    whatYouLearn: [
    'Start a FastAPI app with uvicorn on a local machine.',
    'Expose a welcome route and a /health route.',
    'Verify behaviour with curl before adding complexity.',
  ],
    prompts: [
      {
        step: 1,
        label: 'Generate',
        whereToRun: 'AI tool',
        prompt: `## Context
A small API is being built with FastAPI. This first version needs only two routes.

## Task
Create a Python file named main.py containing a FastAPI application with two endpoints:

GET / returns {"message": "Welcome to the API built with FastAPI"}.
GET /health returns {"status": "ok"}.

## Outcome
Reply with only the name of the file created and one line about what it does. Do not paste the file contents.`,
      },
      {
        step: 2,
        label: 'Fix (only if needed)',
        whereToRun: 'AI tool',
        prompt: `## Context
The FastAPI application failed to start, or an endpoint returned an error.

## Task
Error: <paste the full error here>. Fix it with the smallest possible change.

## Outcome
One line saying what changed.`,
      },
    ],
    acceptanceCriteria: [
      'GET / returns the welcome message.',
      'GET /health returns {"status":"ok"} in the browser and with curl.',
      'The Swagger page at /docs lists both endpoints.',
    ],
    troubleshooting: [
      troubleshootingEntry(
        '/health returns 404',
        'The /health route returns 404.',
        'Check route path and confirm uvicorn main:app is using the right file.',
        'The /health route returns 404. Check the route path and confirm uvicorn main:app is using the right file, then fix it with the smallest change.',
      ),
      troubleshootingEntry(
        'uvicorn import error',
        'uvicorn cannot import main:app.',
        'File name typo, app variable mismatch, or running from the wrong folder.',
        'uvicorn cannot import main:app. Check the file name, the app variable name and the current folder, then state what to change.',
      ),
    ],
  },

  'software-engineering/lab-fastapi-validation-and-testing': {
    track: 'foundation',
    type: 'prompt-lab',
    title: 'Lab 1B: FastAPI validation and testing',
    duration: '45 min',
    prerequisites: ['Typing, Pydantic and async', 'Lab 1A: Create a simple API'],
    beforeYouStart: FOUNDATION_START,
    glossary: [
      {
        term: 'Pydantic model',
        meaning:
          'A class that defines the fields a request body must contain and checks them automatically.',
      },
      {
        term: '422',
        meaning:
          'The status code FastAPI returns when a request body is invalid.',
      },
      {
        term: 'TestClient',
        meaning:
          'A FastAPI tool that sends requests to the app inside a test, without a running server.',
      },
    ],
    labContext:
      'Ask the AI tool to add a POST /greet route that validates its input and three pytest tests for it, then run the tests.',
    whatYouLearn: [
    'Reject bad JSON with Pydantic and a clear 422 response.',
    'Write pytest tests with TestClient, without a live server.',
    'Use fix prompts when a test fails for the wrong reason.',
  ],
    prompts: [
      {
        step: 1,
        label: 'Generate',
        whereToRun: 'AI tool',
        prompt: `## Context
A FastAPI application in main.py already has GET / and GET /health.

## Task
Update main.py and create test_main.py.

In main.py, add a Pydantic model named GreetRequest with one required field, name, a string with at least 1 character. Add POST /greet, which accepts GreetRequest and returns {"message": "Hello, <name>"}. Do not change the existing routes.

In test_main.py, use pytest and FastAPI’s TestClient to write exactly three tests:

test_health checks that GET /health returns 200 and {"status": "ok"}.
test_greet_valid checks that POST /greet with {"name": "Asha"} returns 200 and {"message": "Hello, Asha"}.
test_greet_missing_name checks that POST /greet with {} returns 422.

## Outcome
Reply with only the names of the files changed or created and one line about what each does. Do not paste the file contents.`,
      },
      {
        step: 2,
        label: 'Fix (only if needed)',
        whereToRun: 'AI tool',
        prompt: `## Context
A test failed, or the application returned an error.

## Task
Error: <paste the full error here>. Fix it with the smallest possible change.

## Outcome
One line saying what changed.`,
      },
    ],
    acceptanceCriteria: [
      'POST /greet with a valid name returns 200 and the greeting.',
      'POST /greet with no name returns 422.',
      'At least three pytest tests pass.',
    ],
    troubleshooting: [
      troubleshootingEntry(
        'Tests return 500 on bad input',
        'Invalid request returns 500 instead of 422.',
        'Route does not use the GreetRequest model as its body type.',
        'The invalid request to /greet returns 500 instead of 422. Check that the route uses the GreetRequest model as its body type, and fix it with the smallest change.',
      ),
      troubleshootingEntry(
        'pytest cannot import app',
        'pytest cannot import app from main.',
        'File name typo, app variable mismatch, or running pytest outside main.py folder.',
        'pytest cannot import app from main. Check the file name, the app variable name and that pytest runs from the folder containing main.py, then state what to change.',
      ),
    ],
  },

  'software-engineering/assignment-harden-the-api-script': {
    track: 'foundation-assignment',
    type: 'prompt-lab',
    title: 'Assignment 1: Harden the API script',
    duration: '60 min',
    prerequisites: [
      'Lab 1A: Create a simple API',
      'Lab 1B: FastAPI validation and testing',
    ],
    beforeYouStart: FOUNDATION_START,
    glossary: [
      {
        term: 'Timeout',
        meaning:
          'The maximum time a client waits for a reply before giving up.',
      },
      {
        term: 'Backoff',
        meaning:
          'Waiting longer between each retry, for example 1 second then 2 seconds, so a struggling server is not overloaded.',
      },
      {
        term: '429 / Retry-After',
        meaning:
          'The status code for "too many requests" and the header that states how long to wait.',
      },
      {
        term: 'Retry limit',
        meaning:
          'The maximum number of attempts before the client stops and raises an error.',
      },
      {
        term: 'Custom error',
        meaning:
          'A named exception that gives a clear message instead of a raw crash.',
      },
      {
        term: 'Transient error',
        meaning:
          'A failure that may succeed on a later attempt, such as a timeout or a 429.',
      },
    ],
    assignmentContext:
      'Ask the AI tool to add three failing routes and a hardened client, run the client against the server, and write a short note on the retry choices.',
    skillsFromLabTitle: 'Skills from the labs',
    skillsFromLab: [
      'Lab 1A: Built an API with / and /health, started it with uvicorn and checked it with curl.',
      'Lab 1B: Added POST /greet with validation, so bad input returns 422.',
      'This assignment: Uses the same project, focused on failures, with no new features.',
    ],
    whatYouLearn: [
    'Add a timeout and a capped number of retries to an HTTP client.',
    'Wait for the Retry-After time when a 429 response arrives.',
    'Handle a reply that is not valid JSON without crashing.',
    'Decide which failures are worth retrying and which are not.',
  ],
    prompts: [
      {
        step: 1,
        label: 'Add failing routes',
        whereToRun: 'AI tool',
        prompt: `## Context
main.py has GET /, GET /health and POST /greet.

## Task
Add three routes without changing the others:
- GET /slow waits 5 seconds, then returns {"status": "ok"}.
- GET /limited returns 429 with Retry-After: 1 for the first 2 calls, then returns {"status": "ok"}.
- GET /bad-json returns 200 with the text not json.

## Outcome
Reply with only the name of the file changed and one line about what was added. Do not paste the file contents.`,
      },
      {
        step: 2,
        label: 'Write the client',
        whereToRun: 'AI tool',
        prompt: `## Context
The API has /health, /slow, /limited and /bad-json at http://localhost:8000.

## Task
Create client.py with call_api(path) using httpx and a 2-second timeout:
- On a timeout, retry up to 3 attempts, waiting 1 second, then 2 seconds, then raise an error.
- On a 429, wait for Retry-After and retry, up to 3 attempts.
- On invalid JSON, raise an error with no retry.

Print each attempt. Call the four routes and print each result or error.

## Outcome
Reply with only the name of the file created and one line about what it does. Do not paste the file contents.`,
      },
    ],
    acceptanceCriteria: [
      '/, /health and /greet from Labs 1A and 1B still work.',
      'Every request in client.py has a 2-second timeout.',
      'Retries stop after 3 attempts, and every attempt is printed.',
      'A 429 response is followed by a wait equal to the Retry-After value.',
      'Invalid JSON raises a clear error after 1 attempt, with no retry.',
      'note.md has 5 to 8 lines and names which failures are retried and which are not.',
    ],
    troubleshooting: [
      troubleshootingEntry(
        'Client retries forever',
        'The retry loop never stops.',
        'Missing maximum attempt limit or condition.',
        'The retry loop never stops. Add a hard limit of 3 attempts and raise a clear error after the last one.',
      ),
      troubleshootingEntry(
        '/limited always returns 200',
        'The counter for /limited resets on every request.',
        'State not persisted across requests.',
        'The counter for /limited resets on every request. Store the call count in a variable outside the route function.',
      ),
      troubleshootingEntry(
        'Invalid JSON still crashes the script',
        'Unhandled exception on non-JSON response.',
        'Missing try/except block around json parsing.',
        'Wrap the JSON parsing in try/except ValueError and raise a custom error instead.',
      ),
    ],
    checkoutQuestion: 'Why should a 401 error never be retried?',
  },
}
