import { useSlateXMessages } from './locale-context'
import { FieldShell } from './FieldShell'
import { forwardRef, useId, type ComponentPropsWithoutRef, type ReactNode } from 'react'
import * as Select from '@radix-ui/react-select'
import { Check, ChevronDown } from 'lucide-react'
import { cx, describedBy, useValue, type FieldLabelProps, type FieldSize } from './shared'
import type { DropdownOption } from './Dropdown'

export interface SlateXSelectProps extends ComponentPropsWithoutRef<typeof Select.Root>, FieldLabelProps {
  options: DropdownOption[]
  size?: FieldSize
  placeholder?: string
  leadingIcon?: ReactNode
  id?: string
  className?: string
  'aria-label'?: string
  'aria-describedby'?: string
}
export const SlateXSelect = forwardRef<HTMLButtonElement, SlateXSelectProps>(function SlateXSelect({ options, size = 'Medium', placeholder, leadingIcon, label, helper, error, required, id: providedId, className, 'aria-label': ariaLabel, 'aria-describedby': ariaDescription, ...props }, ref) {
  const messages = useSlateXMessages()

  const uid = useId(), id = providedId ?? uid
  const [selected, setSelected] = useValue(props.value, props.defaultValue ?? '', props.onValueChange)
  const groups = [...new Set(options.map(option => option.group ?? ''))]
  return <FieldShell id={id} label={label} helper={helper} error={error} required={required} className={cx(`field-${size}`, `select-${size}`, className)}>
    <Select.Root {...props} value={selected} onValueChange={setSelected} required={required}>
      <Select.Trigger ref={ref} id={id} className="m-input-control m-select-trigger" aria-label={ariaLabel} aria-invalid={!!error || undefined} aria-describedby={describedBy(id, helper, error, ariaDescription)}>
        {leadingIcon ? <span className="m-field-icon" aria-hidden="true">{leadingIcon}</span> : null}<Select.Value placeholder={placeholder ?? messages.select}>{options.find(option => option.value === selected)?.label}</Select.Value><Select.Icon className="m-field-icon"><ChevronDown /></Select.Icon>
      </Select.Trigger>
      <Select.Portal><Select.Content className={cx('m-dropdown-panel', `dropdown-${size}`, 'm-select-panel')} position="popper" sideOffset={4} collisionPadding={12}>
        <Select.Viewport className="m-dropdown-viewport">{groups.map(group => <Select.Group key={group}>
          {group ? <Select.Label className="m-dropdown-heading">{group}</Select.Label> : null}
          {options.filter(option => (option.group ?? '') === group).map(option => <Select.Item key={option.value} value={option.value} disabled={option.disabled} textValue={option.label} className={cx('m-dropdown-item', `dropdown-${size}`)}>
            {option.icon ? <span className="m-field-icon" aria-hidden="true">{option.icon}</span> : null}<Select.ItemText className="m-option-label">{option.label}</Select.ItemText><Select.ItemIndicator className="m-option-check"><Check /></Select.ItemIndicator>
          </Select.Item>)}
        </Select.Group>)}</Select.Viewport>
      </Select.Content></Select.Portal>
    </Select.Root>
  </FieldShell>
})
