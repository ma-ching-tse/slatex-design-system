import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  SlateXButton, SlateXInput, SlateXTextarea, SlateXComposer, SlateXSearch,
  SlateXCheckbox, SlateXRadio, SlateXRadioGroup, SlateXSwitch, SlateXSelect,
  SlateXTag, SlateXBadge, SlateXAvatar, SlateXTooltip, SlateXPopover,
  SlateXDialog, SlateXToast, SlateXAlert, SlateXDropdownPanel, SlateXDropdownItem,
} from '@slatex/react'
import '@slatex/react/styles.css'

export function App() {
  const [loading, setLoading] = useState(false)
  const [clicks, setClicks] = useState(0)
  const [submits, setSubmits] = useState('')
  const [refName, setRefName] = useState('')
  const [generating, setGenerating] = useState(false)
  const [sent, setSent] = useState('')
  const [toast, setToast] = useState(false)
  const [controlled, setControlled] = useState('Controlled')
  const [feedbackClicks, setFeedbackClicks] = useState(0)
  const [feedbackReport, setFeedbackReport] = useState('')
  const [motionReport, setMotionReport] = useState<string[]>([])
  const [reopenReport, setReopenReport] = useState('')
  useEffect(() => {
    const selectors = '.m-dialog,.m-dialog-overlay,.m-popover,.m-select-panel,.m-search-panel,.m-toast-floating,.m-tooltip'
    const timers = new Set<ReturnType<typeof setTimeout>>()
    const report = (value: object) => setMotionReport(previous => [...previous.slice(-39), JSON.stringify(value)])
    const animation = (event: AnimationEvent) => {
      const element = event.target as HTMLElement
      if (!element.matches(selectors)) return
      report({ phase: event.type, component: element.classList[0], state: element.dataset.state,
        name: event.animationName, duration: event.elapsedTime * 1000 })
    }
    const observer = new MutationObserver(records => {
      for (const record of records) {
        const element = record.target as HTMLElement
        if (!element.matches(selectors) || element.dataset.state !== 'closed') continue
        report({ phase: 'close', component: element.classList[0], retained: element.isConnected,
          duration: getComputedStyle(element).animationDuration })
        const timer = setTimeout(() => { timers.delete(timer); report({ phase: 'settled', component: element.classList[0],
          connected: element.isConnected, state: element.dataset.state }) }, 250)
        timers.add(timer)
      }
    })
    observer.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['data-state'] })
    document.addEventListener('animationstart', animation)
    document.addEventListener('animationend', animation)
    return () => { observer.disconnect(); timers.forEach(clearTimeout); document.removeEventListener('animationstart', animation); document.removeEventListener('animationend', animation) }
  }, [])
  const ref = useRef<HTMLButtonElement>(null)
  const options = [{ value: 'design', label: 'Design' }, { value: 'marketing', label: 'Marketing' }]
  useEffect(() => { setRefName(ref.current?.tagName ?? '') }, [])
  return <main style={{ display: 'grid', gap: 24, padding: 24, fontFamily: 'sans-serif' }}>
    <h1>Component package verification</h1>
    <details open><summary>Motion lifecycle</summary><output id="motion-report" style={{ whiteSpace: 'pre-wrap', fontSize: 12 }}>{motionReport.join('\n')}</output></details>
    <div><SlateXButton id="feedback" onClick={event => {
      setFeedbackClicks(count => count + 1)
      const button = event.currentTarget
      const animation = button.getAnimations().find(item => item.id === 'm-button-feedback')
      if (!animation) { setFeedbackReport('No animation'); return }
      const width = button.offsetWidth
      const samples: number[] = []
      let layoutStable = true
      function sample() {
        samples.push(Number.parseFloat(getComputedStyle(button).scale) || 1)
        layoutStable &&= button.offsetWidth === width
        if (animation!.playState === 'running') requestAnimationFrame(sample)
      }
      requestAnimationFrame(sample)
      animation.finished.then(() => setFeedbackReport(JSON.stringify({
        duration: animation.effect?.getTiming().duration,
        shrink: samples.some(scale => scale < 1), rebound: samples.some(scale => scale > 1),
        restored: getComputedStyle(button).scale === 'none', layoutStable,
        min: Math.min(...samples), max: Math.max(...samples),
      }))).catch(() => {})
    }}>Test feedback</SlateXButton><output id="feedback-clicks">{feedbackClicks}</output><output id="feedback-report">{feedbackReport}</output></div>
    <div><SlateXButton id="normal" ref={ref} loading={loading} onClick={() => { setClicks(n => n + 1); setLoading(true) }}>保存</SlateXButton><output id="clicks">{clicks}</output></div>
    <output id="ref-check">{refName}</output>
    <button onClick={() => setLoading(false)}>恢复</button>
    <SlateXButton disabled>Disabled</SlateXButton>
    <form onSubmit={event => { event.preventDefault(); setSubmits(JSON.stringify(Object.fromEntries(new FormData(event.currentTarget)))) }} style={{ display: 'grid', gap: 16 }}>
      <SlateXInput label="Name" name="name" defaultValue="Original" clearable />
      <SlateXInput label="Controlled" name="controlled" value={controlled} onValueChange={setControlled} />
      <SlateXTextarea label="Description" name="description" defaultValue="Initial description" showCount maxLength={80} />
      <SlateXComposer aria-label="Compose" name="message" defaultValue="Initial message" generating={generating} onSend={message => { setSent(message); setGenerating(true) }} onStop={() => setGenerating(false)} />
      <SlateXCheckbox label="Subscribe" name="subscribe" defaultChecked />
      <SlateXSwitch label="Auto save" name="autoSave" defaultChecked />
      <SlateXRadioGroup name="projectType" defaultValue="design" aria-label="Type"><SlateXRadio value="design" label="Design" /><SlateXRadio value="marketing" label="Marketing" /></SlateXRadioGroup>
      <SlateXSelect name="team" label="Team" options={options} defaultValue="design" />
      <SlateXSearch label="Search" name="query" options={options} defaultValue="Initial query" />
      <div><SlateXButton type="submit">提交表单</SlateXButton><SlateXButton kind="Secondary" type="reset">重置表单</SlateXButton></div>
      <output id="submits">{submits}</output><output id="sent">{sent}</output>
    </form>
    <div><SlateXTag tone="Success">Ready</SlateXTag><SlateXBadge count={148} /><SlateXAvatar src="/missing-avatar.png" initials="RM" alt="Fallback avatar" /></div>
    <SlateXTooltip label="Tooltip content"><SlateXButton kind="Secondary">Tooltip trigger</SlateXButton></SlateXTooltip>
    <SlateXPopover title="Popover" trigger={<SlateXButton kind="Secondary">Popover trigger</SlateXButton>} showClose><SlateXSwitch label="Popup switch" /></SlateXPopover>
    <SlateXDialog title="Dialog" trigger={<SlateXButton kind="Secondary">Dialog trigger</SlateXButton>}><SlateXInput label="Dialog input" /></SlateXDialog>
    <SlateXButton kind="Secondary" onClick={() => setToast(true)}>Show toast</SlateXButton><SlateXToast message="Saved" duration={1500} open={toast} onOpenChange={setToast} showClose />
    <button onClick={() => {
      setToast(true)
      setTimeout(() => setToast(false), 40)
      setTimeout(() => setToast(true), 80)
      setTimeout(() => setReopenReport(JSON.stringify({ open: document.querySelector('.m-toast-floating')?.getAttribute('data-state') === 'open' })), 400)
    }}>Test rapid reopen</button><output id="reopen-report">{reopenReport}</output>
    <SlateXAlert tone="Error" title="Error feedback" />
    <SlateXDropdownPanel><SlateXDropdownItem selected>Design</SlateXDropdownItem></SlateXDropdownPanel>
  </main>
}
createRoot(document.getElementById('root')!).render(<App />)
