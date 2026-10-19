import { useSlateXMessages } from './locale-context'
import { useId, type ReactElement, type ReactNode } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import * as Popover from '@radix-ui/react-popover'
import * as Tooltip from '@radix-ui/react-tooltip'
import { X } from 'lucide-react'
import { SlateXButton } from './Button'
import { cx, type Placement } from './shared'

export interface SlateXTooltipProps {
  children: ReactElement
  label: ReactNode
  size?: 'Small' | 'Medium'
  placement?: Placement
  showArrow?: boolean
  delayDuration?: number
}
export function SlateXTooltip({ children, label, size = 'Small', placement = 'top', showArrow = false, delayDuration = 400 }: SlateXTooltipProps) {
  return <Tooltip.Provider delayDuration={delayDuration}><Tooltip.Root><Tooltip.Trigger asChild>{children}</Tooltip.Trigger><Tooltip.Portal>
    <Tooltip.Content className={cx('m-tooltip', `tooltip-${size}`)} side={placement} sideOffset={6} collisionPadding={12}>{label}{showArrow ? <Tooltip.Arrow width={8} height={4} /> : null}</Tooltip.Content>
  </Tooltip.Portal></Tooltip.Root></Tooltip.Provider>
}
export interface SlateXPopoverProps {
  trigger: ReactElement
  children: ReactNode
  title?: ReactNode
  placement?: Placement
  showArrow?: boolean
  showClose?: boolean
  width?: number
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}
export function SlateXPopover({ trigger, children, title, placement = 'bottom', showArrow = false, showClose = false, width = 288, ...props }: SlateXPopoverProps) {
  const messages = useSlateXMessages()

  const titleId = useId()
  return <Popover.Root {...props}><Popover.Trigger asChild>{trigger}</Popover.Trigger><Popover.Portal>
    <Popover.Content className="m-popover" style={{ width }} side={placement} sideOffset={6} collisionPadding={12} aria-labelledby={title ? titleId : undefined} aria-label={title ? undefined : messages.more}>
      {title || showClose ? <div className="m-overlay-header">{title ? <div id={titleId} className="m-overlay-title">{title}</div> : null}{showClose ? <Popover.Close className="m-close" aria-label={messages.close}><X /></Popover.Close> : null}</div> : null}
      {children}{showArrow ? <Popover.Arrow className="m-popover-arrow" width={10} height={5} /> : null}
    </Popover.Content>
  </Popover.Portal></Popover.Root>
}
export interface SlateXDialogProps {
  title: ReactNode
  children?: ReactNode
  description?: string
  trigger?: ReactElement
  size?: 'Small' | 'Medium'
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  showClose?: boolean
  footer?: ReactNode
  showActions?: boolean
  showCancel?: boolean
  closeOnOutside?: boolean
}
export function SlateXDialog({ title, description, children, trigger, size = 'Medium', showClose = true, footer, showActions = true, showCancel = true, closeOnOutside = false, ...props }: SlateXDialogProps) {
  const messages = useSlateXMessages()

  const descriptionId = useId()
  return <Dialog.Root {...props}>{trigger ? <Dialog.Trigger asChild>{trigger}</Dialog.Trigger> : null}<Dialog.Portal>
    <Dialog.Overlay className="m-dialog-overlay" />
    <Dialog.Content className={cx('m-dialog', `dialog-${size}`)} onPointerDownOutside={event => { if (!closeOnOutside) event.preventDefault() }} aria-describedby={description ? descriptionId : undefined}>
      <div className="m-overlay-header"><Dialog.Title className="m-dialog-title">{title}</Dialog.Title>{showClose ? <Dialog.Close className="m-close" aria-label={messages.close}><X /></Dialog.Close> : null}</div>
      {description ? <Dialog.Description id={descriptionId} className="m-dialog-description">{description}</Dialog.Description> : null}
      {children ? <div className="m-dialog-body">{children}</div> : null}
      {showActions ? <div className="m-dialog-actions">{footer ?? <>{showCancel ? <Dialog.Close asChild><SlateXButton pill={false} kind="Secondary">{messages.cancel}</SlateXButton></Dialog.Close> : null}<Dialog.Close asChild><SlateXButton pill={false}>{messages.confirm}</SlateXButton></Dialog.Close></>}</div> : null}
    </Dialog.Content>
  </Dialog.Portal></Dialog.Root>
}
