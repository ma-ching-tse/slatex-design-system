import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createElement as h } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import {
  SlateXInput, SlateXTextarea, SlateXCheckbox, SlateXRadio, SlateXRadioGroup, SlateXSwitch,
  SlateXSelect, SlateXComposer, SlateXTag, SlateXBadge, SlateXAvatar, SlateXAlert, SlateXToast,
  SlateXDropdownPanel,
} from '../packages/react/dist/index.js'
const render = (Component, props, children) => renderToStaticMarkup(h(Component, props, children))

test('fields link labels and errors to their native control', () => {
  const html = render(SlateXInput, { id:'project', label:'项目名称', error:'名称已被使用', name:'project', defaultValue:'Design' })
  for (const text of ['for="project"','id="project"','name="project"','value="Design"','aria-invalid="true"','aria-describedby="project-helper"','id="project-helper"']) assert.ok(html.includes(text), text)
  assert.match(render(SlateXInput, {readOnly:true, defaultValue:'只读'}), /readOnly=""/i)
  assert.match(render(SlateXInput, {disabled:true}), /disabled=""/)
})
test('textarea exposes native constraints and an actual count', () => {
  const html = render(SlateXTextarea, {defaultValue:'Design', showCount:true, maxLength:200, name:'description', required:true})
  assert.match(html, /6 \/ 200/)
  assert.match(html, /maxLength="200"/i)
  assert.match(html, /required=""/)
})
test('checkbox retains mixed and disabled checked semantics', () => {
  assert.match(render(SlateXCheckbox, {defaultChecked:'indeterminate', label:'同步'}), /aria-checked="mixed"/)
  assert.match(render(SlateXCheckbox, {defaultChecked:true, disabled:true, label:'同步'}), /aria-checked="true"/)
})
test('radio and switch expose their selected state', () => {
  const html = render(SlateXRadioGroup, {defaultValue:'design','aria-label':'类型'}, [h(SlateXRadio,{key:'a',value:'design',label:'Design'}),h(SlateXRadio,{key:'b',value:'marketing',label:'Marketing'})])
  assert.match(html, /role="radiogroup"/)
  assert.equal((html.match(/aria-checked="true"/g) ?? []).length,1)
  assert.match(render(SlateXSwitch, {defaultChecked:true,label:'自动保存'}), /role="switch"/)
})
test('composer disallows blank, disabled and generating sends', () => {
  assert.match(render(SlateXComposer, {onSend:()=>{}}), /disabled=""/)
  const html = render(SlateXComposer, {generating:true, defaultValue:'整理设计规范', onSend:()=>{}, onStop:()=>{}})
  assert.match(html, /Stop generating/)
  assert.match(html, /readOnly=""/i)
  assert.doesNotMatch(html, /aria-label="Send message"/)
})
test('select supports initial values without requiring client rendering', () => {
  const html = render(SlateXSelect, {label:'类型',defaultValue:'design',options:[{value:'design',label:'Design'}]})
  assert.match(html, /role="combobox"/)
  assert.match(html, /Design/)
})
test('badges cap counts, hide zero and support dots', () => {
  assert.match(render(SlateXBadge, {count:148}), /99\+/)
  assert.equal(render(SlateXBadge, {count:0}), '')
  assert.match(render(SlateXBadge, {count:0,showZero:true}), />0<\/span>/)
  assert.match(render(SlateXBadge, {variant:'Dot','aria-label':'已同步'}), /aria-label="已同步"/)
})
test('display and feedback components preserve content and accessible semantics', () => {
  assert.match(render(SlateXTag,{tone:'Success'},'已完成'), /已完成/)
  assert.match(render(SlateXAvatar,{initials:'RM',alt:'Ringo'}), /aria-label="Ringo"/)
  assert.match(render(SlateXAlert,{tone:'Error',title:'请求失败'}), /role="alert"/)
  assert.match(render(SlateXToast,{message:'已保存',inline:true,duration:0}), /role="status"/)
  assert.match(render(SlateXDropdownPanel,{state:'Empty'}), /No results/)
})
