import { useSlateXMessages } from './locale-context'
import { useEffect, useId, useState, type HTMLAttributes, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Presence } from '@radix-ui/react-presence'
import { CheckCircle2, Info, TriangleAlert, X, XCircle } from 'lucide-react'
import { cx, useValue, type Tone } from './shared'

type FeedbackTone = Exclude<Tone, 'Brand'>
const toneIcons = { Neutral: Info, Success: CheckCircle2, Info, Warning: TriangleAlert, Error: XCircle }
export interface SlateXAlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  tone?: FeedbackTone
  size?: 'Medium' | 'Large'
  title: ReactNode
  description?: ReactNode
  showIcon?: boolean
  onClose?: () => void
}
export function SlateXAlert({ tone = 'Neutral', size = 'Medium', title, description, showIcon = true, onClose, className, ...props }: SlateXAlertProps) {
  const messages = useSlateXMessages()

  const Icon = toneIcons[tone]
  return <div role={tone === 'Error' ? 'alert' : 'status'} {...props} className={cx('m-alert', `alert-${size}`, `tone-${tone}`, className)}>
    {showIcon ? <Icon aria-hidden="true" /> : null}<div className="m-alert-text"><strong>{title}</strong>{description ? <div>{description}</div> : null}</div>{onClose ? <button type="button" className="m-close" aria-label={messages.closeAlert} onClick={onClose}><X /></button> : null}
  </div>
}
export interface SlateXToastProps {
  message: ReactNode
  tone?: FeedbackTone
  showIcon?: boolean
  showClose?: boolean
  duration?: number
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  inline?: boolean
}
export function SlateXToast({ message, tone = 'Neutral', showIcon = true, showClose = false, duration = 4000, open, defaultOpen = true, onOpenChange, inline = false }: SlateXToastProps) {
  const messages = useSlateXMessages()

  const [visible, setVisible] = useValue(open, defaultOpen, onOpenChange)
  const [paused, setPaused] = useState(false)
  const id = useId()
  useEffect(() => {
    if (!visible || duration <= 0 || paused) return
    const timer = setTimeout(() => setVisible(false), duration)
    return () => clearTimeout(timer)
  }, [visible, duration, paused, setVisible])
  const Icon = toneIcons[tone]
  const toast = <Presence present={visible}><div id={id} data-state={visible ? 'open' : 'closed'} aria-hidden={!visible || undefined} className={cx('m-toast', `tone-${tone}`, !inline && 'm-toast-floating')} role={tone === 'Error' ? 'alert' : 'status'} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
    {showIcon ? <Icon className="m-toast-icon" aria-hidden="true" /> : null}<div className="m-toast-message">{message}</div>{showClose ? <button type="button" className="m-close" aria-label={messages.closeToast} disabled={!visible} onClick={() => { setPaused(false); setVisible(false) }}><X /></button> : null}
  </div></Presence>
  return inline ? toast : typeof document === 'undefined' ? null : createPortal(toast, document.body)
}
