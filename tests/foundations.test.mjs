import assert from 'node:assert/strict'
import { test } from 'node:test'
import { contrastRatio } from '../src/color-contrast.ts'

test('contrast covers black/white endpoints and is symmetric', () => {
  assert.equal(contrastRatio('#000000', '#ffffff'), 21)
  assert.equal(contrastRatio('#ffffff', '#000000'), 21)
  assert.equal(contrastRatio('#7036f0', '#7036f0'), 1)
})
test('contrast distinguishes the current secondary-text backgrounds', () => {
  assert.ok(contrastRatio('#737373', '#fdfdfd') >= 4.5)
  assert.ok(contrastRatio('#737373', '#f5f5f5') < 4.5)
  assert.equal(contrastRatio('#737373', '#f5f5f5').toFixed(2), '4.35')
})
test('contrast does not round a failing threshold into a pass', () => {
  const ratio = contrastRatio('#777777', '#ffffff')
  assert.ok(ratio < 4.5)
  assert.equal(ratio.toFixed(1), '4.5')
})
