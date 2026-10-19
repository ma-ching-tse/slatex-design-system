import { useSlateXMessages } from './locale-context'
import { forwardRef, useId, useImperativeHandle, useRef, type ReactNode, type TextareaHTMLAttributes } from 'react'
import { ArrowUp, Paperclip, Square, X } from 'lucide-react'
import { SlateXButton } from './Button'
import { cx, useValue, useFormReset } from './shared'

export interface SlateXComposerProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  generating?: boolean
  error?: ReactNode
  attachment?: { name: string }
  onRemoveAttachment?: () => void
  onAttach?: () => void
  modelAction?: ReactNode
  onValueChange?: (value: string) => void
  onSend: (message: string) => void
  onStop?: () => void
}
export const SlateXComposer = forwardRef<HTMLTextAreaElement, SlateXComposerProps>(function SlateXComposer({ generating = false, error, attachment, onRemoveAttachment, onAttach, modelAction, onSend, onStop, onValueChange, value, defaultValue = '', onChange, onKeyDown, disabled, readOnly, className, placeholder, ...props }, forwardedRef) {
  const messages = useSlateXMessages()

  const ref = useRef<HTMLTextAreaElement>(null)
  const errorId = useId()
  useImperativeHandle(forwardedRef, () => ref.current!, [])
  const [text, setText] = useValue(value === undefined ? undefined : String(value), String(defaultValue), onValueChange)
  useFormReset(ref, value !== undefined, () => setText(String(defaultValue)))
  const canSend = !disabled && !readOnly && !generating && !!text.trim()
  function send() { if (canSend) onSend(text.trim()) }
  return <div className={cx('m-composer', !!error && 'has-error', className)} data-disabled={disabled || undefined} data-generating={generating || undefined}>
    {attachment ? <div className="m-attachment"><Paperclip aria-hidden="true" /><span>{attachment.name}</span>{onRemoveAttachment ? <button type="button" className="m-field-action" aria-label={`${messages.remove} ${attachment.name}`} disabled={disabled || generating} onClick={onRemoveAttachment}><X /></button> : null}</div> : null}
    <textarea {...props} ref={ref} value={text} placeholder={placeholder ?? messages.placeholder} disabled={disabled} readOnly={readOnly || generating} aria-label={props['aria-label'] ?? messages.message} aria-invalid={!!error || undefined} aria-busy={generating || undefined} aria-describedby={[props['aria-describedby'], error ? errorId : undefined].filter(Boolean).join(' ') || undefined}
      onChange={event => { setText(event.target.value); onChange?.(event) }} onKeyDown={event => { onKeyDown?.(event); if (!event.defaultPrevented && event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing && event.keyCode !== 229) { event.preventDefault(); send() } }} />
    {error ? <div id={errorId} className="m-composer-error" role="alert">{error}</div> : null}
    <div className="m-composer-tools"><div className="m-composer-options" inert={disabled || generating}>{onAttach ? <SlateXButton kind="Tertiary" size="Small" icon aria-label={messages.attach} disabled={disabled || generating} onClick={onAttach}><Paperclip /></SlateXButton> : null}{modelAction}</div>
      {generating ? <SlateXButton size="Small" icon aria-label={messages.stop} disabled={disabled || !onStop} onClick={onStop}><Square /></SlateXButton> : <SlateXButton size="Small" icon aria-label={messages.send} disabled={!canSend} onClick={send}><ArrowUp /></SlateXButton>}
    </div>
  </div>
})
