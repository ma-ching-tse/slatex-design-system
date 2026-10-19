import type { ReactNode } from 'react'
import { SlateXLocaleContext, type SlateXLocale } from './locale-context'
export type { SlateXLocale } from './locale-context'

export function SlateXLocaleProvider({ locale, children }: { locale: SlateXLocale; children: ReactNode }) {
  return <SlateXLocaleContext.Provider value={locale}>{children}</SlateXLocaleContext.Provider>
}
