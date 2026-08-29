import { useState, useEffect, useRef } from 'react'
import { progressService } from '../services/progressService'
import {
  getEffectiveDuration,
  getRequiredMinutes,
  getCompletionPercent,
  canProceedChapter
} from '../utils/chapterConstants'

const SYNC_INTERVAL_MS = 30000

export const useChapterTimeTracker = ({
  enrollmentId,
  chapterId,
  durationMinutes,
  initialTimeSpent = 0,
  isCompleted = false,
  enabled = true
}) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const syncedMinutesRef = useRef(0)
  const elapsedSecondsRef = useRef(0)

  const baseMinutes = initialTimeSpent || 0
  const localMinutes = Math.floor(elapsedSeconds / 60)
  const timeSpent = baseMinutes + localMinutes
  const effectiveDuration = getEffectiveDuration(durationMinutes)
  const requiredMinutes = getRequiredMinutes(durationMinutes)
  const completionPercent = getCompletionPercent(timeSpent, durationMinutes)
  const canProceed = canProceedChapter(timeSpent, durationMinutes, isCompleted)

  const syncMinutes = async (minutes) => {
    if (!enrollmentId || !chapterId || minutes < 1) return
    try {
      await progressService.addTimeSpent(enrollmentId, chapterId, minutes)
    } catch (error) {
      console.warn('Failed to sync chapter time:', error)
      syncedMinutesRef.current -= minutes
    }
  }

  useEffect(() => {
    setElapsedSeconds(0)
    syncedMinutesRef.current = 0
    elapsedSecondsRef.current = 0
  }, [chapterId, enrollmentId, initialTimeSpent])

  useEffect(() => {
    elapsedSecondsRef.current = elapsedSeconds
  }, [elapsedSeconds])

  useEffect(() => {
    if (!enabled || !enrollmentId || !chapterId || isCompleted) return undefined

    const tick = setInterval(() => {
      if (document.visibilityState !== 'visible') return
      setElapsedSeconds((prev) => prev + 1)
    }, 1000)

    const syncTimer = setInterval(() => {
      const totalLocal = Math.floor(elapsedSecondsRef.current / 60)
      const pending = totalLocal - syncedMinutesRef.current
      if (pending >= 1) {
        syncedMinutesRef.current += pending
        syncMinutes(pending)
      }
    }, SYNC_INTERVAL_MS)

    return () => {
      clearInterval(tick)
      clearInterval(syncTimer)
      const totalLocal = Math.floor(elapsedSecondsRef.current / 60)
      const pending = totalLocal - syncedMinutesRef.current
      if (pending >= 1) {
        syncedMinutesRef.current += pending
        syncMinutes(pending)
      }
    }
  }, [chapterId, enabled, enrollmentId, isCompleted])

  return {
    timeSpent,
    effectiveDuration,
    requiredMinutes,
    completionPercent,
    canProceed,
    isTracking: enabled && !isCompleted
  }
}

export default useChapterTimeTracker
