import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createElement as h } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { SlateXLocaleProvider, SlateXComposer, SlateXDropdownPanel, SlateXInput, SlateXSelect } from '../packages/react/dist/index.js'
import { translateCode } from '../src/translations.ts'

test('component language defaults to English and a provider switches built-in labels', () => {
  const controls = [h(SlateXComposer, { key: 'composer', onSend() {} }), h(SlateXDropdownPanel, { key: 'empty', state: 'Empty' }), h(SlateXInput, { key: 'password', type: 'password', passwordToggle: true, label: 'Custom label' }), h(SlateXSelect, { key: 'select', options: [] })]
  const english = renderToStaticMarkup(controls)
  for (const text of ['Type a message…', 'Send message', 'No results', 'Show password', 'Select…', 'Custom label']) assert.ok(english.includes(text), text)
  const chinese = renderToStaticMarkup(h(SlateXLocaleProvider, { locale: 'zh' }, controls))
  for (const text of ['输入消息…', '发送消息', '无匹配结果', '显示密码', '请选择', 'Custom label']) assert.ok(chinese.includes(text), text)
})

test('localized examples keep API enum values, imports and custom labels intact', () => {
  const code = 'import { SlateXInput } from "@slatex/react"\n<SlateXInput size="Small" state="Default" placeholder="项目名称" aria-label="Custom label" />\n<SlateXButton kind="Primary">Cancel</SlateXButton>'
  const english = translateCode(code, 'en')
  assert.ok(english.includes('placeholder="Project name"'))
  const chinese = translateCode(english, 'zh')
  assert.ok(chinese.includes('>取消</SlateXButton>'))
  for (const text of ['state="Default"', 'size="Small"', 'kind="Primary"', 'aria-label="Custom label"', '"@slatex/react"']) assert.ok(chinese.includes(text), text)
})
