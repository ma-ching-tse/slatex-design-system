import source from '../docs/sources/foundations-slatex.json'
import iconAssets from '../docs/sources/icon-assets.json'
export { contrastRatio } from './color-contrast'

export const foundationSource = source
const colors: Record<string, string> = source.primitives
export const colorValue = (reference: string) => colors[reference] ?? reference
export const cssName = (name: string) => `--m-${name.replaceAll('/', '-')}`
export const displayHex = (value: string) => (value.length === 9 && value.endsWith('ff') ? value.slice(0, -2) : value).toUpperCase()
export const themeTokens = source.theme.map(([name, light, dark, common]) => ({
  name: String(name), light: String(light), dark: String(dark), common: !!common,
  value: colorValue(String(light)), darkValue: colorValue(String(dark)),
}))
export const primitives = ['neutral', 'purple', 'blue', 'green', 'orange', 'red', 'black', 'white'].map(name => ({
  name, values: Object.entries(colors).filter(([key]) => key.startsWith(`${name}/`)).map(([key, value]) => ({ name: key, step: key.slice(name.length + 1), value })).sort((a,b) => parseFloat(a.step) - parseFloat(b.step) || a.step.localeCompare(b.step)),
}))
export const dimensions = (prefix: string) => Object.entries(source.dimension).filter(([name]) => name.startsWith(`${prefix}/`)).sort((a, b) => a[1] - b[1]).map(([name, value]) => ({ name, value }))
const textStyles = source.textStyles as Array<[string, string, string, number, { unit: string; value: number }, { unit: string; value: number }]>
export const typeScale = textStyles.filter(row => row[2] === 'Regular').map(row => ({
  size: Number(row[3]), lineHeight: Number(row[4].value), letterSpacing: Number(row[5].value),
})).sort((a, b) => a.size - b.size)
export const iconLibrary = iconAssets
export const layoutPresets = {
  Standard: [[1920, 12, 1440, 240, 16], [1440, 12, 1344, 48, 16], [768, 8, 704, 32, 16], [390, 4, 358, 16, 16]],
  Sidebar: [[1920, 256, 1664, 1440, 112, 12], [1440, 256, 1184, 1120, 32, 8], [768, 72, 696, 648, 24, 8], [390, 0, 390, 358, 16, 4]],
}
export const foundationPages: Record<string, { title: string; node: string }> = {
  colors: { title: 'Colors', node: '124-216' },
  'colors-primitives': { title: 'Primitives', node: '91-217' },
  'colors-semantic': { title: 'Theme', node: '124-216' },
  'colors-accessibility': { title: 'Contrast', node: '247-2' },
  typography: { title: 'Typography', node: '150-293' },
  spacing: { title: 'Spacing', node: '191-156' },
  radius: { title: 'Radius', node: '191-239' },
  border: { title: 'Border', node: '191-301' },
  'grid-layout': { title: 'Grid & Layout', node: '246-2' },
  iconography: { title: 'Iconography', node: '362-2181' },
  effects: { title: 'Shadow & Effects', node: '0-1' },
  accessibility: { title: 'Accessibility', node: '247-2' },
  naming: { title: 'Naming & Usage', node: '241-261' },
}

export const contrastPairs = [
  ['text/primary', 'surface/default'], ['text/secondary', 'surface/default'], ['text/secondary', 'surface/page'],
  ['brand/on-solid', 'brand/solid'], ['brand/foreground', 'brand/background'],
  ...['success', 'info', 'warning', 'error'].map(tone => [`status/${tone}/foreground`, `status/${tone}/background`]),
]
