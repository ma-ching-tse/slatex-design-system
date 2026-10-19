import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createElement as h } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { SlateXTabs, SlateXSkeleton } from '../packages/react/dist/index.js'

test('tabs link unique panels, expose the selection and keep disabled items out of tab order', () => {
  const items=[{value:'day',label:'Day',content:'Today'},{value:'week',label:'Week',content:'This week',disabled:true},{value:'month',label:'Month',content:'This month'}]
  const html=renderToStaticMarkup(h(SlateXTabs,{items,defaultValue:'month','aria-label':'Period'}))
  assert.equal((html.match(/role="tab"/g)||[]).length,3)
  assert.equal((html.match(/aria-selected="true"/g)||[]).length,1)
  assert.equal((html.match(/tabindex="0"[^>]*>Month/g)||[]).length,1)
  for (const match of html.matchAll(/aria-controls="([^"]+)"/g)) assert.ok(html.includes(`id="${match[1]}"`))
  assert.match(html,/disabled="" tabindex="-1"[^>]*>Week/)
  assert.match(html,/hidden=""[^>]*>Today/)
  assert.doesNotMatch(html,/hidden=""[^>]*>This month/)
})
test('tabs select the first available option by default and accept controlled selection', () => {
  const items=[{value:'day',label:'Day',disabled:true},{value:'week',label:'Week'}]
  const html=renderToStaticMarkup(h(SlateXTabs,{items,'aria-label':'Period'}))
  assert.match(html,/aria-selected="true"[^>]*>Week/)
  const controlled=renderToStaticMarkup(h(SlateXTabs,{items:[{value:'a',label:'A'},{value:'b',label:'B'}],value:'b','aria-label':'Period'}))
  assert.match(controlled,/aria-selected="true"[^>]*>B/)
})
test('skeletons are decorative, adjustable, optionally static and keep circular placeholders square', () => {
  const html=renderToStaticMarkup(h(SlateXSkeleton,{shape:'Block',width:280,height:144}))
  assert.match(html,/aria-hidden="true"/)
  assert.match(html,/width:280px;height:144px/)
  assert.match(html,/is-animated/)
  assert.doesNotMatch(renderToStaticMarkup(h(SlateXSkeleton,{animate:false})),/is-animated/)
  assert.match(renderToStaticMarkup(h(SlateXSkeleton,{shape:'Circle',width:64})),/width:64px;height:64px/)
})
