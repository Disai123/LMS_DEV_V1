const DEFAULT_CHAPTER_MINUTES = 5;
const DEFAULT_QUIZ_MAX_ATTEMPTS = 3;
const COMPLETION_THRESHOLD = 0.9;
const QUIZ_WEIGHT = 0.4;
const FINAL_EXAM_WEIGHT = 0.6;

const getEffectiveDuration = (durationMinutes) => {
  const value = parseInt(durationMinutes, 10);
  return value > 0 ? value : DEFAULT_CHAPTER_MINUTES;
};

const getRequiredMinutes = (durationMinutes) => {
  return Math.ceil(getEffectiveDuration(durationMinutes) * COMPLETION_THRESHOLD);
};

const isTimeRequirementMet = (timeSpent, durationMinutes) => {
  const spent = parseInt(timeSpent, 10) || 0;
  return spent >= getRequiredMinutes(durationMinutes);
};

const getCompletionPercent = (timeSpent, durationMinutes) => {
  const required = getRequiredMinutes(durationMinutes);
  const spent = parseInt(timeSpent, 10) || 0;
  if (required <= 0) return 100;
  return Math.min(100, Math.round((spent / required) * 100));
};

const isAssignmentChapter = (title) => {
  const normalized = (title || '').toLowerCase();
  return normalized.includes('assignment')
    || normalized.includes('test')
    || normalized.includes('exam')
    || normalized.includes('final');
};

const getEffectiveMaxAttempts = (test) => {
  const configured = test?.max_attempts;
  if (configured != null && configured > 0) return configured;
  if ((test?.test_type || 'final_exam') === 'chapter_quiz') return DEFAULT_QUIZ_MAX_ATTEMPTS;
  return null;
};

module.exports = {
  DEFAULT_CHAPTER_MINUTES,
  DEFAULT_QUIZ_MAX_ATTEMPTS,
  COMPLETION_THRESHOLD,
  QUIZ_WEIGHT,
  FINAL_EXAM_WEIGHT,
  getEffectiveDuration,
  getRequiredMinutes,
  isTimeRequirementMet,
  getCompletionPercent,
  isAssignmentChapter,
  getEffectiveMaxAttempts
};
