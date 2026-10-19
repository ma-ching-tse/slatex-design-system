import { FieldShell } from './FieldShell'
import { forwardRef, useId, useImperativeHandle, useRef, type TextareaHTMLAttributes } from 'react'
import { cx, describedBy, useValue, useFormReset, type FieldLabelProps, type FieldState } from './shared'

export interface SlateXTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, FieldLabelProps {
  size?: 'Tiny' | 'Medium' | 'Large'
  state?: FieldState
  showCount?: boolean
  onValueChange?: (value: string) => void
}
export const SlateXTextarea = forwardRef<HTMLTextAreaElement, SlateXTextareaProps>(function SlateXTextarea({
  size = 'Medium', state = 'Default', label, helper, error, showCount = false, onValueChange,
  id: providedId, className, value, defaultValue = '', onChange, disabled, readOnly, required, maxLength,
  'aria-describedby': ariaDescription, ...props
}, forwardedRef) {
  const uid = useId(), id = providedId ?? uid
  const ref = useRef<HTMLTextAreaElement>(null)
  useImperativeHandle(forwardedRef, () => ref.current!, [])
  const [text, setText] = useValue(value === undefined ? undefined : String(value), String(defaultValue), onValueChange)
  useFormReset(ref, value !== undefined, () => setText(String(defaultValue)))
  const invalid = error || state === 'Error'
  return <FieldShell id={id} label={label} helper={helper} error={invalid} required={required} className={cx(`textarea-${size}`, className)}>
    <div className="m-textarea-control" data-preview={state} data-disabled={disabled || state === 'Disabled' || undefined}>
      <textarea {...props} ref={ref} id={id} value={text} maxLength={maxLength} required={required} disabled={disabled || state === 'Disabled'} readOnly={readOnly || state === 'ReadOnly'}
        aria-invalid={invalid ? true : props['aria-invalid']} aria-describedby={describedBy(id, helper, invalid, ariaDescription)} onChange={event => { setText(event.target.value); onChange?.(event) }} />
      {showCount ? <span className="m-textarea-count">{text.length}{maxLength === undefined ? '' : ` / ${maxLength}`}</span> : null}
    </div>
  </FieldShell>
})
