import assert from 'node:assert/strict'
import { test } from 'node:test'
import { contrastRatio } from '../src/color-contrast.ts'
import presets from '../docs/sources/slatex/presets.json' with { type: 'json' }
import source from '../docs/sources/foundations-slatex.json' with { type: 'json' }
import { brandPresets, brandSteps, createBrandTheme, defaultBrand, generateBrandPalette, hexToHSV, hsvToHex, normalizeHex, brandCSS } from '../src/brand-color.ts'

test('HEX accepts common inputs and rejects incomplete or unsafe values', () => {
  assert.equal(normalizeHex(' abc '), '#AABBCC')
  assert.equal(normalizeHex('#32e879'), '#32E879')
  for (const value of ['#12', '#12345', '#12345678', 'red', 'url(x)', '']) assert.equal(normalizeHex(value), null)
  assert.throws(() => createBrandTheme('invalid'))
})

test('HSV preserves exact RGB colors, including grayscale endpoints', () => {
  for (const color of [...brandPresets.map(preset => preset.color), '#000000', '#FFFFFF', '#888888', '#FF0000', '#00FFFF', '#182C44']) {
    assert.equal(hsvToHex(hexToHSV(color)), color)
  }
})

test('custom brand stays exact and text remains readable in both modes and interaction states', () => {
  const colors = [ '#000000', '#FFFFFF', '#777777', '#FFFF00', '#00FFFF']
  for (let h = 0; h < 360; h += 15) {
    for (const s of [0, 0.3, 0.6, 1]) for (const v of [0.1, 0.4, 0.7, 1]) colors.push(hsvToHex({ h, s, v }))
  }
  for (const color of colors) {
    const theme = createBrandTheme(color)
    assert.deepEqual(Object.keys(theme.palette), brandSteps.map(String))
    assert.equal(theme.palette[500].toUpperCase(), color)
    for (const mode of ['light', 'dark']) {
      const palette = theme[mode].values
      if (color !== defaultBrand) assert.equal(palette.solid, color)
      for (const state of ['solid', '8', 'pressed']) assert.ok(contrastRatio(palette['on-solid'], palette[state]) >= 4.5, `${color} ${mode} ${state}`)
      assert.ok(contrastRatio(palette.foreground, palette.background) >= 4.5, `${color} ${mode} subtle`)
      for (const [role, reference] of Object.entries(theme[mode].aliases)) {
        const expected = reference.startsWith('brand/') ? theme.palette[reference.slice(6)] : source.primitives[reference].slice(0, 7).toUpperCase()
        assert.equal(palette[role], expected, `${color} ${mode} ${role} resolves to its base color`)
      }
    }
  }
})

test('generated base palette runs from white through the exact seed to black', () => {
  for (const { color } of brandPresets) {
    const palette = generateBrandPalette(color)
    assert.equal(palette[0], '#FFFFFF')
    assert.equal(palette[1000], '#000000')
    let previous = 21
    for (const step of brandSteps) {
      const luminance = contrastRatio(palette[step], '#000000')
      assert.ok(luminance <= previous, `${color} ${step}`)
      previous = luminance
    }
  }
})

test('approved presets preserve Figma palettes, aliases and both theme modes verbatim', () => {
  for (const preset of presets) assert.deepEqual(createBrandTheme(preset.color), preset)
  assert.equal(createBrandTheme(defaultBrand).light.values.solid, '#ff571a')
  assert.equal(createBrandTheme('#FFF820').light.values['on-solid'], '#000000')
  assert.equal(createBrandTheme('#7036F0').dark.values.solid, '#8b7eff')
})

test('CSS export contains complete base colors and stable semantic aliases for both modes', () => {
  const theme = createBrandTheme('#2563FF')
  const css = brandCSS(theme)
  assert.ok(css.includes(":root[data-theme='dark']"))
  for (const step of brandSteps) assert.ok(css.includes(`--m-palette-brand-${step}: ${theme.palette[step]};`))
  assert.ok(css.includes('--m-brand-solid: var(--m-palette-brand-500);'))
  assert.ok(css.includes('--m-brand-on-solid: var(--m-palette-brand-0);'))
  assert.ok(css.includes('--m-brand-background: var(--m-palette-brand-50);'))
  assert.ok(css.includes('--m-brand-background: var(--m-palette-brand-900);'))
  assert.ok(css.includes('--m-brand-pressed: var(--m-palette-brand-'))
  assert.ok(css.includes('--m-internal-input-ring-editing: color-mix(in srgb, var(--m-brand-solid) 20%, transparent);'))
  assert.ok(!/--m-brand-[\w-]+: #/.test(css))
})
