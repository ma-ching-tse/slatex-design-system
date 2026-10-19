import { useSlateXMessages } from './locale-context'
import { forwardRef, type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode } from 'react'
import { Check } from 'lucide-react'
import { cx, type FieldSize } from './shared'

export interface DropdownOption { value: string; label: string; disabled?: boolean; icon?: ReactNode; group?: string }
export interface SlateXDropdownPanelProps extends HTMLAttributes<HTMLDivElement> {
  size?: FieldSize
  state?: 'Options' | 'Loading' | 'Empty' | 'Error'
  message?: ReactNode
}
export const SlateXDropdownPanel = forwardRef<HTMLDivElement, SlateXDropdownPanelProps>(function SlateXDropdownPanel({ size = 'Medium', state = 'Options', message, children, className, ...props }, ref) {
  const messages = useSlateXMessages()

  return <div {...props} ref={ref} className={cx('m-dropdown-panel', `dropdown-${size}`, className)}>
    {state === 'Options' ? children : <div className="m-dropdown-feedback" role={state === 'Error' ? 'alert' : 'status'}>{state === 'Loading' ? <span className="m-inline-spinner" aria-hidden="true" /> : null}{message ?? ({ Loading: messages.loading, Empty: messages.empty, Error: messages.searchError })[state]}</div>}
  </div>
})
export interface SlateXDropdownItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: FieldSize
  selected?: boolean
  highlighted?: boolean
  leadingIcon?: ReactNode
}
export const SlateXDropdownItem = forwardRef<HTMLButtonElement, SlateXDropdownItemProps>(function SlateXDropdownItem({ size = 'Medium', selected = false, highlighted = false, leadingIcon, children, className, ...props }, ref) {
  return <button {...props} ref={ref} type="button" role="option" aria-selected={selected} tabIndex={-1} className={cx('m-dropdown-item', `dropdown-${size}`, className)} data-highlighted={highlighted || undefined}>
    {leadingIcon ? <span className="m-field-icon" aria-hidden="true">{leadingIcon}</span> : null}<span className="m-option-label">{children}</span>{selected ? <Check className="m-option-check" aria-hidden="true" /> : null}
  </button>
})
