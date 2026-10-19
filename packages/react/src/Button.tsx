import { forwardRef, useRef, type ButtonHTMLAttributes } from 'react'

export type ButtonKind = 'Primary' | 'Neutral' | 'Secondary' | 'Tertiary' | 'Danger'
export type ButtonSize = 'Tiny' | 'Small' | 'Medium' | 'Large'
export type ButtonState = 'Default' | 'Hover' | 'Pressed' | 'Loading' | 'Disabled'

export interface SlateXButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  kind?: ButtonKind
  size?: ButtonSize
  state?: ButtonState
  pill?: boolean
  icon?: boolean
  loading?: boolean
}

export const SlateXButton = forwardRef<HTMLButtonElement, SlateXButtonProps>(function SlateXButton(
  {
    kind = 'Primary',
    size = 'Medium',
    state = 'Default',
    pill = true,
    icon = false,
    loading = false,
    disabled = false,
    type = 'button',
    className,
    children = 'Button',
    onClick,
    'aria-busy': ariaBusy,
    ...props
  },
  ref,
) {
  const feedback = useRef<Animation | null>(null)
  const isLoading = loading || state === 'Loading'
  const isDisabled = disabled || state === 'Disabled' || isLoading
  const displayState = isLoading ? 'Loading' : isDisabled ? 'Disabled' : state
  const classes = [
    'm-button', `kind-${kind}`, `size-${size}`, `state-${displayState}`,
    pill && 'is-pill', icon && 'is-icon', className,
  ].filter(Boolean).join(' ')

  return (
    <button {...props} ref={ref} type={type} className={classes} disabled={isDisabled} aria-busy={isLoading || ariaBusy}
      onClick={event => {
        const button = event.currentTarget
        if (button.animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          feedback.current?.cancel()
          feedback.current = button.animate(
            [{ scale: '0.97' }, { scale: '1.012', offset: 0.62 }, { scale: '1' }],
            { duration: 200, easing: 'ease-out', id: 'm-button-feedback' },
          )
        }
        onClick?.(event)
      }}>
      <span className="m-button-content">{children}</span>
      {isLoading ? <span className="m-spinner" aria-hidden="true" /> : null}
    </button>
  )
})
