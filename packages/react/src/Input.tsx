import { useSlateXMessages } from './locale-context'
import { FieldShell } from './FieldShell'
import { forwardRef, useId, useImperativeHandle, useRef, useState, type InputHTMLAttributes, type ReactNode } from 'react'
import { Eye, EyeOff, X } from 'lucide-react'
import { cx, describedBy, useValue, useFormReset, type FieldLabelProps, type FieldSize, type FieldState } from './shared'

export interface SlateXInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>, FieldLabelProps {
  size?: FieldSize
  state?: FieldState
  leadingIcon?: ReactNode
  trailingAction?: ReactNode
  clearable?: boolean
  passwordToggle?: boolean
  onValueChange?: (value: string) => void
}
export const SlateXInput = forwardRef<HTMLInputElement, SlateXInputProps>(function SlateXInput({
  size = 'Medium', state = 'Default', label, helper, error, leadingIcon, trailingAction,
  clearable = false, passwordToggle = false, onValueChange, id: providedId, className,
  value, defaultValue = '', onChange, type = 'text', disabled, readOnly, required,
  'aria-describedby': ariaDescription, ...props
}, forwardedRef) {
  const messages = useSlateXMessages()

  const uid = useId(), id = providedId ?? uid
  const ref = useRef<HTMLInputElement>(null)
  useImperativeHandle(forwardedRef, () => ref.current!, [])
  const [text, setText] = useValue(value === undefined ? undefined : String(value), String(defaultValue), onValueChange)
  useFormReset(ref, value !== undefined, () => setText(String(defaultValue)))
  const [visible, setVisible] = useState(false)
  const isDisabled = disabled || state === 'Disabled', isReadOnly = readOnly || state === 'ReadOnly'
  const invalid = error || state === 'Error'
  return <FieldShell id={id} label={label} helper={helper} error={invalid} required={required} className={cx(`field-${size}`, className)}>
    <div className="m-input-control" data-preview={state} data-disabled={isDisabled || undefined} data-readonly={isReadOnly || undefined}>
      {leadingIcon ? <span className="m-field-icon" aria-hidden="true">{leadingIcon}</span> : null}
      <input {...props} ref={ref} id={id} type={passwordToggle && type === 'password' && visible ? 'text' : type} value={text}
        disabled={isDisabled} readOnly={isReadOnly} required={required} aria-invalid={invalid ? true : props['aria-invalid']}
        aria-describedby={describedBy(id, helper, invalid, ariaDescription)} onChange={event => { setText(event.target.value); onChange?.(event) }} />
      {clearable && text ? <button className="m-field-action" type="button" aria-label={messages.clear} disabled={isDisabled || isReadOnly} onClick={() => { setText(''); ref.current?.focus() }}><X /></button> : null}
      {passwordToggle && type === 'password' ? <button className="m-field-action" type="button" aria-label={visible ? messages.hidePassword : messages.showPassword} aria-pressed={visible} disabled={isDisabled} onClick={() => setVisible(!visible)}>{visible ? <EyeOff /> : <Eye />}</button> : null}
      {trailingAction}
    </div>
  </FieldShell>
})
