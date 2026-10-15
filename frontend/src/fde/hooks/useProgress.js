import { useCallback, useEffect, useMemo, useState } from 'react'
import { countTotalItems, getAllItems, getProgressKey, getStages } from '../lib/stages.ts'

const STORAGE_KEY = 'fde-done'

function loadDone() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveDone(keys) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(keys))
  } catch {
    /* private mode or quota */
  }
}

export function useProgressState() {
  const [doneKeys, setDoneKeys] = useState(loadDone)

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) setDoneKeys(loadDone())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const totalItems = useMemo(() => countTotalItems(), [])

  const isDone = useCallback(
    (stageSlug, itemSlug) => doneKeys.includes(getProgressKey(stageSlug, itemSlug)),
    [doneKeys]
  )

  const toggleDone = useCallback((stageSlug, itemSlug) => {
    const key = getProgressKey(stageSlug, itemSlug)
    setDoneKeys((prev) => {
      const next = prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
      saveDone(next)
      return next
    })
  }, [])

  const doneCount = doneKeys.length
  const percent = totalItems ? Math.round((doneCount / totalItems) * 100) : 0

  const stageStats = useMemo(() => {
    return getStages().map((stage) => {
      const items = getAllItems(stage)
      const done = items.filter((it) =>
        doneKeys.includes(getProgressKey(stage.slug, it.slug))
      ).length
      const readsDone = stage.reads.filter((it) =>
        doneKeys.includes(getProgressKey(stage.slug, it.slug))
      ).length
      const practiseDone = stage.practise.filter((it) =>
        doneKeys.includes(getProgressKey(stage.slug, it.slug))
      ).length
      return {
        stage,
        done,
        total: items.length,
        readsDone,
        readsTotal: stage.reads.length,
        practiseDone,
        practiseTotal: stage.practise.length,
      }
    })
  }, [doneKeys])

  return {
    doneKeys,
    isDone,
    toggleDone,
    doneCount,
    totalItems,
    percent,
    stageStats,
  }
}
