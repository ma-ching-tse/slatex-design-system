import type { ReactNode } from 'react'
import { cx, type FieldLabelProps } from './shared'

export function FieldShell({ id, label, helper, error, required, className, children }: FieldLabelProps & { id: string; className?: string; children: ReactNode }) {
  const message = typeof error === 'boolean' ? helper : error || helper
  return <div className={cx('m-field', !!error && 'has-error', className)}>
    {label ? <label className="m-field-label" htmlFor={id}>{label}{required ? <span aria-hidden="true"> *</span> : null}</label> : null}
    {children}
    {message ? <div id={`${id}-helper`} className="m-field-helper">{message}</div> : null}
  </div>
}
