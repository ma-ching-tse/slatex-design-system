import { useLocale } from './locale-context'
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { Check, RotateCcw, X } from 'lucide-react'
import { Presence } from '@radix-ui/react-presence'
import { brandPresets, defaultBrand, hexToHSV, hsvToHex, normalizeHex } from './brand-color'
import { useBrandTheme } from './brand-context'
import './brand-picker.css'

export function BrandPicker() {
  const { t } = useLocale()

  const { color, setColor } = useBrandTheme()
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(color)
  const [invalid, setInvalid] = useState(false)
  const [hsv, setHSV] = useState(() => hexToHSV(color))
  const wrapper = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const hexInput = useRef<HTMLInputElement>(null)
  const dialog = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const outside = (event: globalThis.PointerEvent) => { if (!wrapper.current?.contains(event.target as Node)) setOpen(false) }
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.stopPropagation(); setOpen(false); trigger.current?.focus() }
      if (event.key === 'Tab') {
        const elements = Array.from(dialog.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input, [tabindex="0"]') ?? [])
        const first = elements[0], last = elements.at(-1)
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
      }
    }
    hexInput.current?.focus({ preventScroll: true })
    document.addEventListener('pointerdown', outside)
    document.addEventListener('keydown', keyboard)
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', keyboard) }
  }, [open])
  function update(changes: Partial<typeof hsv>) {
    const next = { ...hsv, ...changes }, hex = hsvToHex(next)
    setHSV(next); setColor(hex); setDraft(hex); setInvalid(false)
  }
  function chooseColor(hex: string) {
    const next = hexToHSV(hex)
    setColor(hex); setDraft(hex); setInvalid(false)
    setHSV({ ...next, h: next.s ? next.h : hsv.h })
  }
  function commit() {
    const normalized = normalizeHex(draft)
    setInvalid(!normalized)
    if (normalized) chooseColor(normalized)
  }
  function wheel(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    update({ h: (Math.atan2(event.clientY - rect.top - rect.height / 2, event.clientX - rect.left - rect.width / 2) * 180 / Math.PI + 90 + 360) % 360 })
  }
  const hue = hsvToHex({ h: hsv.h, s: 1, v: 1 })
  return <div className="brand-picker" ref={wrapper}>
    <button ref={trigger} className="icon-button brand-picker-trigger" type="button" aria-label={t("调整品牌色")} aria-haspopup="dialog" aria-expanded={open} aria-controls={open ? 'brand-picker-dialog' : undefined} onClick={() => setOpen(!open)}><span style={{ background: color }} /></button>
    <Presence present={open}><div ref={dialog} id="brand-picker-dialog" className="brand-picker-panel" data-state={open ? 'open' : 'closed'} inert={!open} aria-hidden={!open || undefined} role="dialog" aria-label={t("品牌色")}>
      <div className="brand-picker-heading"><strong>{t("品牌色")}</strong><div><button type="button" className="icon-button" onClick={() => chooseColor(defaultBrand)} aria-label={t("重置品牌色")} title={t("重置")}><RotateCcw size={15} /></button><button type="button" className="icon-button" aria-label={t("关闭品牌色设置")} onClick={() => { setOpen(false); trigger.current?.focus() }}><X size={16} /></button></div></div>
      <small className="brand-section-label">{t("Figma presets")}</small><div className="brand-presets">{brandPresets.map(preset => <button type="button" key={preset.name} aria-label={t(preset.name)} title={t(preset.name)} aria-pressed={color === preset.color} style={{ background: preset.color }} onClick={() => chooseColor(preset.color)}>{color === preset.color && <Check size={16} />}</button>)}</div>
      <small className="brand-section-label">{t("Custom preview")}</small><div className="brand-wheel" role="slider" tabIndex={0} aria-label={t("色相")} aria-valuemin={0} aria-valuemax={360} aria-valuenow={Math.round(hsv.h)} onPointerDown={event => { event.currentTarget.setPointerCapture(event.pointerId); wheel(event) }} onPointerMove={event => { if (event.currentTarget.hasPointerCapture(event.pointerId)) wheel(event) }} onKeyDown={event => { if (['ArrowLeft','ArrowDown','ArrowRight','ArrowUp','Home','End'].includes(event.key)) { event.preventDefault(); update({ h: event.key === 'Home' ? 0 : event.key === 'End' ? 359 : (hsv.h + (['ArrowLeft','ArrowDown'].includes(event.key) ? -1 : 1) * (event.shiftKey ? 10 : 1) + 360) % 360 }) } }}>
        <div className="brand-wheel-center"><span style={{ background: color }} /></div><span className="brand-wheel-pointer" style={{ transform: `rotate(${hsv.h}deg)` }}><i style={{ background: hue }} /></span>
      </div>
      <label className="brand-slider"><span>{t("饱和度")}</span><input type="range" min="0" max="100" aria-label={t("饱和度")} value={Math.round(hsv.s * 100)} onChange={event => update({ s: Number(event.target.value) / 100 })} style={{ '--track': `linear-gradient(to right, ${hsvToHex({ ...hsv, s: 0 })}, ${hsvToHex({ ...hsv, s: 1 })})` } as CSSProperties} /></label>
      <label className="brand-slider"><span>{t("亮度")}</span><input type="range" min="0" max="100" aria-label={t("亮度")} value={Math.round(hsv.v * 100)} onChange={event => update({ v: Number(event.target.value) / 100 })} style={{ '--track': `linear-gradient(to right, #000, ${hsvToHex({ ...hsv, v: 1 })})` } as CSSProperties} /></label>
      <label className="brand-hex"><span>HEX</span><input ref={hexInput} autoFocus value={draft} aria-label={t("品牌色 HEX")} aria-invalid={invalid} aria-describedby={invalid ? 'brand-hex-error' : undefined} spellCheck={false} maxLength={7} onChange={event => { const input = event.target.value; setDraft(input); setInvalid(false); const normalized = normalizeHex(input); if (normalized && input.replace(/^#/, '').length === 6) chooseColor(normalized) }} onBlur={commit} onKeyDown={event => { if (event.key === 'Enter') commit() }} /></label>
      {invalid && <span id="brand-hex-error" className="brand-hex-error" role="alert">{t("请输入 3 或 6 位 HEX 色值")}</span>}
    </div></Presence>
  </div>
}
