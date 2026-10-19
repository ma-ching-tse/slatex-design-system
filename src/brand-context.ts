import { createContext, useContext } from 'react'
import type { themeTokens } from './foundations'

export const BrandContext = createContext<{
  color: string; setColor: (color: string) => void; tokens: typeof themeTokens; palette: Record<string, string>; css: string
} | null>(null)

export function useBrandTheme() {
  const context = useContext(BrandContext)
  if (!context) throw new Error('BrandThemeProvider is required')
  return context
}
