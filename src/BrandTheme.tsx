import { useLayoutEffect, useMemo, useState, type ReactNode } from 'react'
import { brandCSS, brandVariables, createBrandTheme, defaultBrand, normalizeHex } from './brand-color'
import { themeTokens } from './foundations'
import { BrandContext } from './brand-context'

const storageKey = 'slatex-brand'
export function BrandThemeProvider({ mode, children }: { mode: 'light' | 'dark'; children: ReactNode }) {
  const [color, setColor] = useState(() => {
    try { return normalizeHex(localStorage.getItem(storageKey) ?? '') ?? defaultBrand }
    catch { return defaultBrand }
  })
  const theme = useMemo(() => createBrandTheme(color), [color])
  const value = useMemo(() => {
    const tokens = themeTokens.map(token => {
      if (token.name === 'internal/input-ring/editing') return { ...token,
        light: 'light/ring', dark: 'dark/ring',
        value: theme.light.values.ring ?? `${theme.light.values.solid}33`, darkValue: theme.dark.values.ring ?? `${theme.dark.values.solid}33` }
      if (!token.name.startsWith('brand/')) return token
      const role = token.name.slice(6)
      return { ...token, light: theme.light.aliases[role], dark: theme.dark.aliases[role],
        value: theme.light.values[role], darkValue: theme.dark.values[role] }
    })
    return { color, setColor: (input: string) => { const hex = normalizeHex(input); if (hex) setColor(hex) },
      tokens, palette: theme.palette, css: brandCSS(theme) }
  }, [color, theme])
  useLayoutEffect(() => {
    const root = document.documentElement, variables = brandVariables(theme, mode)
    for (const [name, value] of Object.entries(variables)) root.style.setProperty(name, value)
    try { localStorage.setItem(storageKey, color) } catch { /* Preview remains usable without storage. */ }
    return () => { for (const name of Object.keys(variables)) root.style.removeProperty(name) }
  }, [color, mode, theme])
  return <BrandContext value={value}>{children}</BrandContext>
}
