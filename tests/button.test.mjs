import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { SlateXButton } from '../packages/react/dist/index.js'

const render = (props, children = '保存') => renderToStaticMarkup(createElement(SlateXButton, props, children))

test('native attributes survive the component boundary', () => {
  const html = render({ type: 'submit', name: 'action', value: 'save', form: 'editor', className: 'custom', 'data-action': 'save' })
  for (const attribute of ['type="submit"', 'name="action"', 'value="save"', 'form="editor"', 'data-action="save"']) {
    assert.ok(html.includes(attribute), attribute)
  }
  assert.match(html, /class="[^"]*custom"/)
  assert.match(render({}), /type="button"/)
})

test('loading preserves label content and blocks activation', () => {
  for (const props of [{ loading: true }, { state: 'Loading' }]) {
    const html = render(props)
    assert.match(html, /disabled=""/)
    assert.match(html, /aria-busy="true"/)
    assert.match(html, /m-button-content">保存<\/span>/)
    assert.match(html, /class="m-spinner" aria-hidden="true"/)
  }
})

test('disabled wins over a fixed hover state', () => {
  assert.match(render({ disabled: true, state: 'Hover' }), /state-Disabled/)
  assert.match(render({ state: 'Disabled' }), /disabled=""/)
  assert.doesNotMatch(render({ disabled: false }), /disabled=""/)
})

test('icon content and accessible names are supplied by the consumer', () => {
  const icon = createElement('svg', { 'aria-hidden': true, 'data-icon': 'trash' })
  const html = render({ icon: true, 'aria-label': '删除项目' }, icon)
  assert.match(html, /is-icon/)
  assert.match(html, /aria-label="删除项目"/)
  assert.match(html, /data-icon="trash"/)
  assert.doesNotMatch(html, /添加项目/)
})
