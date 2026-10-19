import { forwardRef, useId, type ComponentPropsWithoutRef, type ReactNode } from 'react'
import * as Checkbox from '@radix-ui/react-checkbox'
import * as Radio from '@radix-ui/react-radio-group'
import * as Switch from '@radix-ui/react-switch'
import { Check, Minus } from 'lucide-react'
import { cx, type CompactSize } from './shared'

interface SelectionLabelProps { label?: ReactNode; description?: ReactNode; size?: CompactSize }
function SelectionText({ label, description, id }: { label?: ReactNode; description?: ReactNode; id: string }) {
  return label || description ? <span className="m-selection-text">{label ? <label htmlFor={id}>{label}</label> : null}{description ? <span id={`${id}-description`}>{description}</span> : null}</span> : null
}
export interface SlateXCheckboxProps extends ComponentPropsWithoutRef<typeof Checkbox.Root>, SelectionLabelProps {}
export const SlateXCheckbox = forwardRef<HTMLButtonElement, SlateXCheckboxProps>(function SlateXCheckbox({ label, description, size = 'Small', id: providedId, className, ...props }, ref) {
  const uid = useId(), id = providedId ?? uid
  return <span className={cx('m-selection', `selection-${size}`, className)} data-disabled={props.disabled || undefined}>
    <Checkbox.Root {...props} ref={ref} id={id} className="m-checkbox" aria-describedby={description ? `${id}-description` : props['aria-describedby']}>
      <Checkbox.Indicator><Minus className="m-indeterminate-mark" /><Check className="m-checked-mark" /></Checkbox.Indicator>
    </Checkbox.Root><SelectionText id={id} label={label} description={description} />
  </span>
})
export interface SlateXRadioProps extends ComponentPropsWithoutRef<typeof Radio.Item>, SelectionLabelProps {}
export const SlateXRadio = forwardRef<HTMLButtonElement, SlateXRadioProps>(function SlateXRadio({ label, description, size = 'Small', id: providedId, className, ...props }, ref) {
  const uid = useId(), id = providedId ?? uid
  return <span className={cx('m-selection', `selection-${size}`, className)} data-disabled={props.disabled || undefined}>
    <Radio.Item {...props} ref={ref} id={id} className="m-radio" aria-describedby={description ? `${id}-description` : props['aria-describedby']}><Radio.Indicator className="m-radio-dot" /></Radio.Item>
    <SelectionText id={id} label={label} description={description} />
  </span>
})
export type SlateXRadioGroupProps = ComponentPropsWithoutRef<typeof Radio.Root>
export const SlateXRadioGroup = forwardRef<HTMLDivElement, SlateXRadioGroupProps>(function SlateXRadioGroup({ className, ...props }, ref) {
  return <Radio.Root {...props} ref={ref} className={cx('m-radio-group', className)} />
})
export interface SlateXSwitchProps extends ComponentPropsWithoutRef<typeof Switch.Root>, SelectionLabelProps {}
export const SlateXSwitch = forwardRef<HTMLButtonElement, SlateXSwitchProps>(function SlateXSwitch({ label, description, size = 'Small', id: providedId, className, ...props }, ref) {
  const uid = useId(), id = providedId ?? uid
  return <span className={cx('m-selection', 'm-switch-row', `selection-${size}`, className)} data-disabled={props.disabled || undefined}>
    <Switch.Root {...props} ref={ref} id={id} className="m-switch" aria-describedby={description ? `${id}-description` : props['aria-describedby']}><Switch.Thumb className="m-switch-thumb" /></Switch.Root>
    <SelectionText id={id} label={label} description={description} />
  </span>
})
