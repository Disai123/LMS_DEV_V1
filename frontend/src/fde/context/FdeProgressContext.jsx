import { createContext, useContext } from 'react'
import { useProgressState } from '../hooks/useProgress'

const FdeProgressContext = createContext(null)

export function FdeProgressProvider({ children }) {
  const value = useProgressState()
  return (
    <FdeProgressContext.Provider value={value}>{children}</FdeProgressContext.Provider>
  )
}

export function useFdeProgress() {
  const ctx = useContext(FdeProgressContext)
  if (!ctx) throw new Error('useFdeProgress must be used within FdeProgressProvider')
  return ctx
}
