import { useId, useRef, type ReactNode, type CSSProperties } from 'react'
import { cx, useValue } from './shared'

export type TabsSize = 'Tiny' | 'Medium' | 'Large'
export interface TabItem { value: string; label: ReactNode; content?: ReactNode; disabled?: boolean }
export interface SlateXTabsProps {
  items: TabItem[]
  size?: TabsSize
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  'aria-label': string
  className?: string
}
export function SlateXTabs({ items, size = 'Medium', value, defaultValue, onValueChange, disabled = false, 'aria-label': label, className }: SlateXTabsProps) {
  const id = useId()
  const [selected, setSelected] = useValue(value, defaultValue ?? items.find(item => !item.disabled)?.value ?? '', onValueChange)
  const refs = useRef<Array<HTMLButtonElement | null>>([])
  return <div className={cx('m-tabs', className)}>
    <div className={cx('m-tab-list', `tabs-${size}`)} role="tablist" style={{ '--tab-count': items.length } as CSSProperties} aria-label={label} aria-disabled={disabled || undefined}>
      {items.map((item, index) => <button key={item.value} ref={element => { refs.current[index] = element }}
        type="button" role="tab" id={`${id}-tab-${index}`} aria-selected={selected === item.value}
        aria-controls={item.content !== undefined ? `${id}-panel-${index}` : undefined}
        disabled={disabled || item.disabled} tabIndex={selected === item.value ? 0 : -1}
        onClick={() => setSelected(item.value)} onKeyDown={event => {
          if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
          event.preventDefault()
          const enabled = items.map((item,i) => !item.disabled ? i : -1).filter(i => i >= 0)
          if (!enabled.length) return
          const cursor = enabled.indexOf(index)
          const next = event.key === 'Home' ? enabled[0] : event.key === 'End' ? enabled[enabled.length - 1] : enabled[(cursor + (event.key === 'ArrowRight' ? 1 : -1) + enabled.length) % enabled.length]
          setSelected(items[next].value)
          refs.current[next]?.focus()
        }}>{item.label}</button>)}
    </div>
    {items.map((item,index) => item.content !== undefined && <div key={item.value} role="tabpanel" id={`${id}-panel-${index}`} aria-labelledby={`${id}-tab-${index}`} tabIndex={0} hidden={selected !== item.value} className="m-tab-panel">{item.content}</div>)}
  </div>
}
