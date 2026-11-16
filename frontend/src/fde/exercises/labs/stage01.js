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
  'software-engineering/lab-fastapi-simple-api': {
    track: 'foundation',
    type: 'prompt-lab',
    title: 'Lab 1A: Create a simple API',
    duration: '45 min',
    prerequisites: [
      'Python essentials and environment setup',
      'Working with APIs reliably',
      'FastAPI, logging and pytest',
    ],
    beforeYouStart: FOUNDATION_START,
    glossary: GLOSSARY_COMMON,
    labContext: INTRO_S1_FASTAPI_SIMPLE,
    whatYouLearn: [
      'Start a FastAPI app with uvicorn on your machine.',
      'Expose /health and one small JSON resource.',
      'Verify behaviour with curl before adding complexity.',
    ],
    prompts: [
      {
        step: 1,
        label: 'Build and run',
        whereToRun: 'AI tool',
        prompt: PROMPT_S1_FASTAPI_SIMPLE,
      },
    ],
    acceptanceCriteria: ['GET /health returns ok', 'POST and GET on your resource work with curl'],
    troubleshooting: [
      troubleshootingEntry(
        '/health returns 404',
        'Route not registered.',
        'Wrong path or app object.',
        PROMPT_S1_FASTAPI_SIMPLE_FIX,
      ),
      troubleshootingEntry(
        'uvicorn import error',
        'App does not load.',
        'Missing package or typo in module path.',
        PROMPT_S1_FASTAPI_SIMPLE_FIX,
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
    glossary: GLOSSARY_COMMON,
    labContext: INTRO_S1_FASTAPI_TEST,
    whatYouLearn: [
      'Reject bad JSON with Pydantic and a clear 422 response.',
      'Write pytest tests with TestClient without a live server.',
      'Use fix prompts when a test fails for the wrong reason.',
    ],
    prompts: [
      {
        step: 1,
        label: 'Validate and test',
        whereToRun: 'AI tool',
        prompt: PROMPT_S1_FASTAPI_TEST,
      },
    ],
    acceptanceCriteria: [
      'Invalid POST body returns 422',
      'At least three pytest tests pass',
    ],
    troubleshooting: [
      troubleshootingEntry(
        'Tests return 500 on bad input',
        'Validation not wired.',
        'Model not on route.',
        PROMPT_S1_FASTAPI_TEST_FIX,
      ),
      troubleshootingEntry(
        'pytest cannot import app',
        'Path or module wrong.',
        'Different working directory.',
        PROMPT_S1_FASTAPI_TEST_FIX,
      ),
    ],
  },

  'software-engineering/assignment-harden-the-api-script': {
    track: 'foundation-assignment',
    type: 'prompt-lab',
    title: 'Assignment 1: Harden the API script',
    duration: 'About 60 min',
    prerequisites: [
      'Lab 1A: Create a simple API',
      'Lab 1B: FastAPI validation and testing',
    ],
    beforeYouStart: FOUNDATION_START,
    glossary: [
      {
        term: 'Timeout',
        meaning: 'The maximum time the client waits for a response before giving up.',
      },
      {
        term: 'Backoff',
        meaning:
          'Waiting longer between each retry, for example 1s then 2s, so a struggling server is not overloaded.',
      },
      {
        term: '429 / Retry-After',
        meaning:
          'The status code meaning “too many requests”, and the header saying how long to wait.',
      },
      {
        term: 'Retry cap',
        meaning: 'The maximum number of attempts before the client stops and raises an error.',
      },
      {
        term: 'Transient error',
        meaning: 'A failure that may succeed if tried again later, such as a timeout or a 429.',
      },
      {
        term: 'Custom error',
        meaning:
          'Your own exception class, such as InvalidJSONError, that gives a clear message instead of a raw crash.',
      },
    ],
    assignmentContext: `- Add three small endpoints to your Lab 1A app that fail on purpose.
- Write a client script, \`client.py\`, that calls your API and handles each failure.
- Add pytest tests for each failure mode.
- Write a 5 to 8 line note (\`note.md\`) covering which failures you retry, which you do not, and why. Include your retry limit and backoff choice.`,
    skillsFromLabTitle: 'Skills from the labs',
    skillsFromLab: [
      'Lab 1A: You built GET /health and GET/POST /notes and checked them with curl.',
      'Lab 1B: You added Pydantic validation, returned 422 on bad input, and wrote TestClient tests.',
      'This assignment: You work on the failure side of the same API, using the same tools and without adding new features.',
    ],
    whatYouLearn: [
      'Add timeouts and bounded retries to an HTTP client.',
      'Handle a 429 response by honouring Retry-After.',
      'Parse a response safely when the body is not valid JSON.',
      'Prove each failure mode with pytest, as in Lab 1B.',
      'Decide which failures are worth retrying and which are not.',
    ],
    prompts: [
      {
        step: 1,
        label: 'Add failing endpoints',
        whereToRun: 'AI tool',
        prompt: `## Context
Lab 1A notes API (FastAPI, in-memory). I need endpoints that simulate failures so I can test a client.

## What you are doing
Making the API misbehave on purpose, so the client has something to survive.

## Task
Add these routes to my existing app without changing /health or /notes:

- GET /slow sleeps for a configurable number of seconds (default 5), then returns {"status":"ok"}.
- GET /limited returns 429 with a Retry-After: 1 header for the first 2 calls, then 200 with {"status":"ok"}.
- GET /bad-json returns status 200 with a plain-text body that is not valid JSON.

## Output
- Updated app code only for the new routes
- One curl example for each route showing what to expect`,
      },
      {
        step: 2,
        label: 'Harden the client script',
        whereToRun: 'AI tool',
        prompt: `## Context
I have a FastAPI app with /health, /notes, /slow, /limited and /bad-json. I need a client.py using httpx or requests.

## What you are doing
Making the client survive timeout, 429 and invalid JSON without crashing.

## Task
Write client.py with one function, call_api(path), that:

- Sets a 2-second timeout on every request.
- Retries on timeout, up to 3 attempts, with exponential backoff (1s, 2s).
- Retries on 429, waiting for the Retry-After value, up to 3 attempts.
- Catches invalid JSON and raises a clear custom error. It does not retry this case.
- Does not retry other 4xx errors, including 401, 403 and 422.
- Logs each attempt with the attempt number and the reason.

## Output
- Full client.py
- A short demo that calls /health, /slow, /limited and /bad-json and prints the result of each`,
      },
      {
        step: 3,
        label: 'Test each failure mode',
        whereToRun: 'AI tool',
        prompt: `## Context
Same project. I have client.py and the failing endpoints, and pytest is installed (Lab 1B).

## What you are doing
Proving the hardening works with automated tests.

## Task
Write pytest tests, using mocking or TestClient as appropriate, for:

- Timeout: retries 3 times, then raises a clear error.
- 429: waits and then succeeds on the third call.
- Invalid JSON: raises the custom error after exactly 1 attempt, with no retry.
- Bonus: a 422 response is not retried.

## Output
- The test file
- Test names, each with one line on what it asserts`,
      },
    ],
    acceptanceCriteria: [
      'GET /health and the notes routes from Labs 1A and 1B still work.',
      'Every request has a timeout of 2 seconds or less.',
      'Retries are capped at 3 attempts, and each attempt is logged.',
      'A 429 response waits for Retry-After before the next attempt.',
      'Invalid JSON never crashes the script and is never retried.',
      'At least 3 pytest tests pass, one per failure mode.',
      'note.md is 5 to 8 lines and names which failures you retry and which you do not.',
    ],
    troubleshooting: [
      troubleshootingEntry(
        'Client retries forever',
        'Retry loop never stops.',
        'Missing maximum attempt cap or counter not incrementing.',
        'My retry loop never stops. Add a hard cap of 3 attempts and raise a clear error after the last one.',
      ),
      troubleshootingEntry(
        'Tests take too long',
        'Timeout tests wait for real sleeps.',
        'Unmocked sleep calls cause slow test execution.',
        'My timeout tests wait for real sleeps. Mock the sleep or reduce delays so the test runs in under 2 seconds.',
      ),
      troubleshootingEntry(
        '/limited always returns 200',
        'Counter resets on each request.',
        'Request state not persisted across test calls.',
        'My counter resets on each request. Store the call count in a module-level variable and reset it between tests.',
      ),
      troubleshootingEntry(
        'JSON error still crashes the script',
        'Uncaught JSON error on non-JSON response.',
        'Missing try/except block around json parsing.',
        'Wrap response parsing in try/except for ValueError and raise my custom error instead.',
      ),
    ],
    checkoutQuestion: 'Why should a 401 error never be retried?',
  },
}