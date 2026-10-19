import { createContext, useContext } from 'react'
import type { Locale } from './translations'

export const LocaleContext = createContext<{ locale: Locale; setLocale: (locale: Locale) => void; t: (text: string) => string } | null>(null)
export function useLocale() {
  const value = useContext(LocaleContext)
  if (!value) throw new Error('useLocale requires LocaleProvider')
  return value
}
