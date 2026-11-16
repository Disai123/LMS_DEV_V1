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
    title: 'Lab: Create a simple FastAPI API',
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
    title: 'Lab: FastAPI validation and testing',
    duration: '45 min',
    prerequisites: ['Typing, Pydantic and async', 'Lab: Create a simple FastAPI API'],
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
}