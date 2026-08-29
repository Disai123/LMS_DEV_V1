export const DEFAULT_CHAPTER_MINUTES = 5
export const DEFAULT_QUIZ_MAX_ATTEMPTS = 3
export const COMPLETION_THRESHOLD = 0.9

export const getEffectiveDuration = (durationMinutes) => {
  const value = parseInt(durationMinutes, 10)
  return value > 0 ? value : DEFAULT_CHAPTER_MINUTES
}

export const getRequiredMinutes = (durationMinutes) => {
  return Math.ceil(getEffectiveDuration(durationMinutes) * COMPLETION_THRESHOLD)
}

export const getCompletionPercent = (timeSpent, durationMinutes) => {
  const required = getRequiredMinutes(durationMinutes)
  const spent = parseInt(timeSpent, 10) || 0
  if (required <= 0) return 100
  return Math.min(100, Math.round((spent / required) * 100))
}

export const canProceedChapter = (timeSpent, durationMinutes, isCompleted = false) => {
  if (isCompleted) return true
  const spent = parseInt(timeSpent, 10) || 0
  return spent >= getRequiredMinutes(durationMinutes)
}
