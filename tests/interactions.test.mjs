import { act, mount, click, focus, key, type, wait } from './helpers/dom.mjs'
import assert from 'node:assert/strict'
import { test, afterEach } from 'node:test'
import { createElement as h, useState } from 'react'
const {
  SlateXButton, SlateXInput, SlateXTextarea, SlateXSearch, SlateXSelect,
  SlateXCheckbox, SlateXRadio, SlateXRadioGroup, SlateXSwitch,
  SlateXTabs, SlateXDialog, SlateXToast, SlateXAlert,
} = await import('../packages/react/dist/index.js')

let mounted
const render = async element => { mounted = await mount(element); return mounted }
afterEach(async () => { await mounted?.cleanup(); mounted = undefined })
const q = selector => document.querySelector(selector)
const qa = selector => [...document.querySelectorAll(selector)]

test('input edits, clears with focus retained, and resets to its original value', async () => {
  const changes = []
  await render(h('form', null, h(SlateXInput, { label:'Name', defaultValue:'Original', clearable:true, onValueChange:v => changes.push(v) })))
  await type(q('input'), 'Updated')
  assert.equal(q('input').value, 'Updated')
  await click(q('button[aria-label="Clear"]'))
  assert.equal(q('input').value, '')
  assert.equal(document.activeElement, q('input'))
  await act(async () => { q('form').reset() })
  assert.equal(q('input').value, 'Original')
  assert.deepEqual(changes, ['Updated', '', 'Original'])
})

test('controlled input clear updates its parent and disabled clear does nothing', async () => {
  function Example() { const [value,setValue] = useState('Current'); return h(SlateXInput,{value,onValueChange:setValue,clearable:true,'aria-label':'Name'}) }
  await render(h(Example))
  await click(q('button[aria-label="Clear"]'))
  assert.equal(q('input').value,'')
  await mounted.render(h(SlateXInput,{defaultValue:'Locked',disabled:true,clearable:true,'aria-label':'Name'}))
  await click(q('button[aria-label="Clear"]'))
  assert.equal(q('input').value,'Locked')
})

test('password visibility changes without changing the value', async () => {
  await render(h(SlateXInput,{type:'password',defaultValue:'sample-value',passwordToggle:true,'aria-label':'Password'}))
  await click(q('button'))
  assert.equal(q('input').type,'text')
  assert.equal(q('button').getAttribute('aria-pressed'),'true')
  await click(q('button'))
  assert.equal(q('input').type,'password')
  assert.equal(q('input').value,'sample-value')
})

test('textarea count follows edits and resets with the form', async () => {
  await render(h('form',null,h(SlateXTextarea,{defaultValue:'Text',showCount:true,maxLength:200,'aria-label':'Description'})))
  await type(q('textarea'),'Updated text')
  assert.equal(q('.m-textarea-count').textContent,'12 / 200')
  await act(async () => { q('form').reset() })
  assert.equal(q('textarea').value,'Text')
  assert.equal(q('.m-textarea-count').textContent,'4 / 200')
})

test('checkbox, switch and radio respond to selection and preserve disabled values', async () => {
  await render(h('div',null,
    h(SlateXCheckbox,{label:'Enabled',defaultChecked:'indeterminate'}),
    h(SlateXSwitch,{label:'Auto save'}),
    h(SlateXCheckbox,{label:'Locked',disabled:true}),
    h(SlateXRadioGroup,{defaultValue:'a','aria-label':'Choice'}, h(SlateXRadio,{value:'a',label:'A'}),h(SlateXRadio,{value:'b',label:'B'})),
  ))
  await click(q('[role="checkbox"]'))
  assert.equal(q('[role="checkbox"]').getAttribute('aria-checked'),'true')
  await click(q('[role="switch"]'))
  assert.equal(q('[role="switch"]').getAttribute('aria-checked'),'true')
  await click(q('[role="checkbox"][disabled]'))
  assert.equal(q('[role="checkbox"][disabled]').getAttribute('aria-checked'),'false')
  await click(qa('[role="radio"]')[1])
  assert.deepEqual(qa('[role="radio"]').map(x=>x.getAttribute('aria-checked')),['false','true'])
})

test('tabs support click, arrows, Home and End, skipping disabled options', async () => {
  const values=[]
  await render(h(SlateXTabs,{'aria-label':'Period',items:[{value:'a',label:'A',content:'Panel A'},{value:'b',label:'B',disabled:true,content:'Panel B'},{value:'c',label:'C',content:'Panel C'}],onValueChange:v=>values.push(v)}))
  await focus(qa('[role="tab"]')[0])
  await key(document.activeElement,'ArrowRight')
  assert.equal(document.activeElement.textContent,'C')
  assert.equal(q('[role="tabpanel"]:not([hidden])').textContent,'Panel C')
  await key(document.activeElement,'ArrowRight')
  assert.equal(document.activeElement.textContent,'A')
  await key(document.activeElement,'End')
  assert.equal(document.activeElement.textContent,'C')
  await key(document.activeElement,'Home')
  assert.equal(document.activeElement.textContent,'A')
  await click(qa('[role="tab"]')[1])
  assert.equal(q('[role="tab"][aria-selected="true"]').textContent,'A')
  assert.deepEqual(values,['c','a','c','a'])
})

for (const size of ['Small','Medium','Large']) test(`search ${size} dropdown inherits size and keyboard selection skips disabled results`, async () => {
  const selected=[]
  await render(h(SlateXSearch,{size,'aria-label':'Search',options:[{value:'a',label:'Alpha'},{value:'b',label:'Beta',disabled:true},{value:'c',label:'Gamma'}],onSelect:v=>selected.push(v.value)}))
  await focus(q('input'))
  await type(q('input'),'a')
  assert.equal(q('input').getAttribute('aria-expanded'),'true')
  assert.ok(q(`.m-search-panel.dropdown-${size}`))
  assert.ok(qa('[role="option"]').every(x=>x.classList.contains(`dropdown-${size}`)))
  await key(q('input'),'ArrowDown')
  await key(q('input'),'ArrowDown')
  const active=q('input').getAttribute('aria-activedescendant')
  assert.equal(document.getElementById(active).textContent,'Gamma')
  await key(q('input'),'Enter')
  assert.deepEqual(selected,['c'])
  assert.equal(q('input').value,'Gamma')
  assert.equal(q('input').getAttribute('aria-expanded'),'false')
})

test('search loading and error suppress selection; Escape closes suggestions', async () => {
  const selected=[]
  const props={'aria-label':'Search',defaultValue:'a',options:[{value:'a',label:'Alpha'}],onSelect:v=>selected.push(v.value)}
  await render(h(SlateXSearch,{...props,loading:true}))
  await focus(q('input'))
  await key(q('input'),'ArrowDown')
  await key(q('input'),'Enter')
  assert.deepEqual(selected,[])
  await mounted.render(h(SlateXSearch,{...props,error:'Failed'}))
  await key(q('input'),'ArrowDown')
  assert.equal(q('[role="alert"]').textContent,'Failed')
  assert.equal(q('input').hasAttribute('aria-activedescendant'),false)
  await key(q('input'),'Escape')
  assert.equal(q('input').getAttribute('aria-expanded'),'false')
})

for (const size of ['Small','Medium','Large']) test(`select ${size} opens, selects, closes and submits the selected value`, async () => {
  const changes=[]
  await render(h('form',null,h(SlateXSelect,{size,label:'Type',name:'type',defaultValue:'a',options:[{value:'a',label:'Alpha'},{value:'b',label:'Beta',disabled:true},{value:'c',label:'Gamma'}],onValueChange:v=>changes.push(v)})))
  const trigger=q('[role="combobox"]')
  await focus(trigger)
  await key(trigger,'ArrowDown')
  assert.ok(q(`.m-select-panel.dropdown-${size}`))
  assert.equal(trigger.getAttribute('aria-expanded'),'true')
  assert.equal(qa('[role="option"]')[1].getAttribute('aria-disabled'),'true')
  await click(qa('[role="option"]')[2])
  assert.deepEqual(changes,['c'])
  assert.equal(trigger.textContent,'Gamma')
  assert.equal(trigger.getAttribute('aria-expanded'),'false')
  assert.equal(new window.FormData(q('form')).get('type'),'c')
})

test('dialog opens, dismisses on Escape and returns focus to the trigger', async () => {
  await render(h(SlateXDialog,{title:'Confirm change',description:'Please confirm.',trigger:h('button',null,'Open dialog')}))
  const trigger=q('button')
  await focus(trigger)
  await click(trigger)
  assert.ok(q('[role="dialog"]'))
  assert.ok(q('[role="dialog"]').contains(document.activeElement))
  await key(document.activeElement,'Escape')
  assert.equal(q('[role="dialog"]'),null)
  await wait(0)
  assert.equal(document.activeElement === trigger,true)
})

test('toast closes on its action and alert invokes its close callback', async () => {
  const changes=[]
  await render(h(SlateXToast,{message:'Saved',showClose:true,duration:0,inline:true,onOpenChange:v=>changes.push(v)}))
  await click(q('button'))
  assert.deepEqual(changes,[false])
  assert.equal(q('[role="status"]'),null)
  let closed=0
  await mounted.render(h(SlateXAlert,{title:'Notice',onClose:()=>closed++}))
  await click(q('button'))
  assert.equal(closed,1)
})

test('toast pauses dismissal while hovered and resumes after leaving', async () => {
  await render(h(SlateXToast,{message:'Saved',duration:40,inline:true}))
  const toast=q('[role="status"]')
  await act(async () => { toast.dispatchEvent(new window.MouseEvent('mouseover',{bubbles:true})) })
  await wait(80)
  assert.ok(q('[role="status"]'))
  await act(async () => { toast.dispatchEvent(new window.MouseEvent('mouseout',{bubbles:true,relatedTarget:document.body})) })
  await wait(80)
  assert.equal(q('[role="status"]'),null)
})

test('loading and disabled buttons suppress actions', async () => {
  let clicks=0
  await render(h('div',null,h(SlateXButton,{loading:true,onClick:()=>clicks++},'Save'),h(SlateXButton,{disabled:true,onClick:()=>clicks++},'Delete')))
  for(const button of qa('button')) await click(button)
  assert.equal(clicks,0)
  assert.equal(qa('button')[0].getAttribute('aria-busy'),'true')
})
