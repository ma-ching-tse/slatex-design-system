import { useCallback, useEffect, useState, type ReactNode, type RefObject } from 'react'

export type FieldSize = 'Small' | 'Medium' | 'Large'
export type FieldState = 'Default' | 'Hover' | 'Editing' | 'Filled' | 'Error' | 'Disabled' | 'ReadOnly'
export type Tone = 'Neutral' | 'Brand' | 'Success' | 'Info' | 'Warning' | 'Error'
export type CompactSize = 'Tiny' | 'Small' | 'Medium'
export type Placement = 'top' | 'bottom' | 'left' | 'right'
export const cx = (...classes: Array<string | false | undefined>) => classes.filter(Boolean).join(' ')

export function useValue<T>(value: T | undefined, defaultValue: T, onChange?: (value: T) => void) {
  const [internal, setInternal] = useState(defaultValue)
  const controlled = value !== undefined
  const setValue = useCallback((next: T) => {
    if (!controlled) setInternal(next)
    onChange?.(next)
  }, [controlled, onChange])
  return [controlled ? value : internal, setValue] as const
}

export function useFormReset<T extends HTMLInputElement | HTMLTextAreaElement>(ref: RefObject<T | null>, controlled: boolean, reset: () => void) {
  useEffect(() => {
    const form = ref.current?.form
    if (!form || controlled) return
    const onReset = (event: Event) => { queueMicrotask(() => { if (!event.defaultPrevented) reset() }) }
    form.addEventListener('reset', onReset)
    return () => form.removeEventListener('reset', onReset)
  }, [ref, controlled, reset])
}

export interface FieldLabelProps { label?: ReactNode; helper?: ReactNode; error?: ReactNode; required?: boolean }
export function describedBy(id: string, helper: ReactNode, error: ReactNode, existing?: string) {
  return [existing, helper || (error && typeof error !== 'boolean') ? `${id}-helper` : undefined].filter(Boolean).join(' ') || undefined
}
