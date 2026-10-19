import source from '../docs/sources/foundations-slatex.json' with { type: 'json' }
import presets from '../docs/sources/slatex/presets.json' with { type: 'json' }
import { contrastRatio } from './color-contrast.ts'

export const defaultBrand = '#FF571A'
export const brandPresets = presets.map(({ name, color }) => ({ name, color }))
export type BrandPalette = Record<string, string>
export type BrandMode = { aliases: Record<string, string>; values: BrandPalette }
export type BrandTheme = { palette: BrandPalette; light: BrandMode; dark: BrandMode }
export const brandSteps = [0, 50, 100, 200, 250, 275, 300, 350, 400, 450, 500, 550, 600, 650, 675, 700, 750, 800, 900, 950, 1000]
export type HSV = { h: number; s: number; v: number }

export function normalizeHex(value: string): string | null {
  const hex = value.trim().replace(/^#/, '')
  if (/^[\da-f]{3}$/i.test(hex)) return `#${hex.split('').map(char => char + char).join('')}`.toUpperCase()
  return /^[\da-f]{6}$/i.test(hex) ? `#${hex.toUpperCase()}` : null
}
export function hexToHSV(hex: string): HSV {
  const [r, g, b] = [1, 3, 5].map(index => parseInt(hex.slice(index, index + 2), 16) / 255)
  const max = Math.max(r, g, b), min = Math.min(r, g, b), delta = max - min
  let h = 0
  if (delta) h = max === r ? ((g - b) / delta) % 6 : max === g ? (b - r) / delta + 2 : (r - g) / delta + 4
  return { h: (h * 60 + 360) % 360, s: max ? delta / max : 0, v: max }
}
export function hsvToHex({ h, s, v }: HSV) {
  const hue = ((h % 360) + 360) % 360 / 60, c = v * s, x = c * (1 - Math.abs(hue % 2 - 1)), m = v - c
  const channels = hue < 1 ? [c, x, 0] : hue < 2 ? [x, c, 0] : hue < 3 ? [0, c, x] : hue < 4 ? [0, x, c] : hue < 5 ? [x, 0, c] : [c, 0, x]
  return `#${channels.map(channel => Math.round((channel + m) * 255).toString(16).padStart(2, '0')).join('')}`.toUpperCase()
}
function mix(color: string, target: string, amount: number) {
  return `#${[1, 3, 5].map(index => Math.round(parseInt(color.slice(index, index + 2), 16) * (1 - amount) + parseInt(target.slice(index, index + 2), 16) * amount).toString(16).padStart(2, '0')).join('')}`.toUpperCase()
}
function stateColor(solid: string, front: string, target: string, amount: number) {
  // Keep the chosen foreground readable through both interaction states.
  for (let step = 100; step >= 0; step--) {
    const result = mix(solid, target, amount * step / 100)
    if (contrastRatio(front, result) >= 4.5) return result
  }
  return solid
}
export function generateBrandPalette(seed: string): BrandPalette {
  const solid = normalizeHex(seed)
  if (!solid) throw new Error('Invalid brand HEX')
  const front = contrastRatio('#FFFFFF', solid) >= contrastRatio('#000000', solid) ? '#FFFFFF' : '#000000'
  const palette: BrandPalette = { 0: '#FFFFFF', 500: solid, 1000: '#000000' }
  for (const [step, amount] of [[50,.94],[100,.85],[200,.7],[250,.58],[275,.52],[300,.45],[350,.34],[400,.22]]) palette[step] = mix(solid, '#FFFFFF', amount)
  palette[450] = stateColor(solid, front, '#FFFFFF', .08)
  palette[550] = stateColor(solid, front, '#000000', .08)
  palette[600] = stateColor(solid, front, '#000000', .18)
  for (const [step, amount] of [[650,.3],[675,.38],[700,.45],[750,.55],[800,.65],[900,.78],[950,.9]]) palette[step] = mix(solid, '#000000', amount)
  return Object.fromEntries(brandSteps.map(step => [step, palette[step]]))
}
function resolveMode(palette: BrandPalette, aliases: Record<string, string>): BrandMode {
  const primitives = source.primitives as Record<string, string>
  return { aliases, values: Object.fromEntries(Object.entries(aliases).map(([role, reference]) => [role,
    reference.startsWith('brand/') ? palette[reference.slice(6)] : primitives[reference].slice(0, 7).toUpperCase(),
  ])) }
}
export function createBrandTheme(seed: string): BrandTheme {
  const color = normalizeHex(seed)
  if (!color) throw new Error('Invalid brand HEX')
  const preset = presets.find(preset => preset.color === color)
  if (preset) return preset
  const palette = generateBrandPalette(color)
  const onSolid = contrastRatio(palette[0], color) >= contrastRatio(palette[1000], color) ? 0 : 1000
  const choose = (steps: number[], background: string) => steps.find(step => contrastRatio(palette[step], background) >= 4.5)!
  const mode = (dark: boolean) => {
    const background = dark ? 900 : 50
    const textSteps = dark ? [...brandSteps].reverse().filter(step => step <= 500) : brandSteps.filter(step => step >= 500)
    const foreground = choose(textSteps, palette[background])
    const strong = textSteps[Math.min(textSteps.indexOf(foreground) + 1, textSteps.length - 1)]
    const hover = choose(dark ? [450, 500] : [550, 500], palette[onSolid])
    const pressed = choose(dark ? [400, 450, 500] : [600, 550, 500], palette[onSolid])
    const roles = { background, '2': dark ? 800 : 100, '3': dark ? 700 : 200, '4': dark ? 650 : 300,
      '5': dark ? 450 : 400, '6': 500, solid: 500, '8': hover, pressed, foreground, '10': strong, 'on-solid': onSolid }
    return resolveMode(palette, Object.fromEntries(Object.entries(roles).map(([role, step]) => [role, `brand/${step}`])))
  }
  return { palette, light: mode(false), dark: mode(true) }
}
export const brandReferenceCSS = (reference: string) => reference.startsWith('brand/') ? `--m-palette-brand-${reference.slice(6)}` : `--m-${reference.replaceAll('/', '-')}`
export function brandVariables(theme: BrandTheme, mode: 'light' | 'dark') {
  return {
    ...Object.fromEntries(Object.entries(theme.palette).map(([step, value]) => [`--m-palette-brand-${step}`, value])),
    '--m-neutral-0': '#FFFFFF', '--m-neutral-900': '#141414',
    ...Object.fromEntries(Object.entries(theme[mode].aliases).map(([role, reference]) => [`--m-brand-${role}`, reference.startsWith('#') ? reference : `var(${brandReferenceCSS(reference)})`])),
    '--m-internal-input-ring-editing': theme[mode].values.ring ?? 'color-mix(in srgb, var(--m-brand-solid) 20%, transparent)',
  }
}
export function brandCSS(theme: BrandTheme) {
  const variables = brandVariables(theme, 'light')
  const lines = (values: Record<string, string>) => Object.entries(values).map(([name, value]) => `  ${name}: ${value};`).join('\n')
  const dark = Object.fromEntries(Object.entries(brandVariables(theme, 'dark')).filter(([name]) => name.startsWith('--m-brand-') || name === '--m-internal-input-ring-editing'))
  return `:root {\n${lines(variables)}\n}\n:root[data-theme='dark'] {\n${lines(dark)}\n}`
}
