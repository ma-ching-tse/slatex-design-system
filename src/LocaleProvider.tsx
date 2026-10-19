import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { SlateXLocaleProvider } from '@slatex/react'
import { LocaleContext } from './locale-context'
import { translate, type Locale } from './translations'

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => localStorage.getItem('slatex-language') === 'zh' ? 'zh' : 'en')
  useEffect(() => {
    document.documentElement.lang = locale === 'en' ? 'en' : 'zh-CN'
    localStorage.setItem('slatex-language', locale)
  }, [locale])
  const value = useMemo(() => ({ locale, setLocale, t: (text: string) => translate(text, locale) }), [locale])
  return <LocaleContext.Provider value={value}><SlateXLocaleProvider locale={locale}>{children}</SlateXLocaleProvider></LocaleContext.Provider>
}
