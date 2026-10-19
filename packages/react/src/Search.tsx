import { useSlateXMessages } from './locale-context'
import { forwardRef, useId, useImperativeHandle, useRef, useState } from 'react'
import * as Popover from '@radix-ui/react-popover'
import { Search as SearchIcon } from 'lucide-react'
import { SlateXInput, type SlateXInputProps } from './Input'
import { SlateXDropdownItem, SlateXDropdownPanel, type DropdownOption } from './Dropdown'
import { useValue, useFormReset } from './shared'

export interface SlateXSearchProps extends Omit<SlateXInputProps, 'type' | 'state' | 'leadingIcon' | 'value' | 'defaultValue' | 'onSelect'> {
  value?: string
  defaultValue?: string
  options?: DropdownOption[]
  loading?: boolean
  emptyMessage?: string
  onSelect?: (option: DropdownOption) => void
  onSearch?: (query: string) => void
}
export const SlateXSearch = forwardRef<HTMLInputElement, SlateXSearchProps>(function SlateXSearch({ options = [], value, defaultValue = '', onValueChange, loading = false, error, emptyMessage, onSelect, onSearch, onFocus, onKeyDown, disabled, readOnly, label, ...props }, forwardedRef) {
  const messages = useSlateXMessages()

  const [query, setQuery] = useValue(value, defaultValue, onValueChange)
  const [open, setOpen] = useState(false), [active, setActive] = useState(-1)
  const input = useRef<HTMLInputElement>(null)
  useFormReset(input, value !== undefined, () => { setQuery(defaultValue); setOpen(false); setActive(-1) })
  useImperativeHandle(forwardedRef, () => input.current!, [])
  const listId = useId()
  const canChoose = !loading && !error
  const enabled = canChoose ? options.map((option, index) => !option.disabled ? index : -1).filter(index => index >= 0) : []
  const isOpen = open && !disabled && !readOnly && !!query
  function choose(index: number) {
    const option = options[index]
    if (!canChoose || !option || option.disabled) return
    setQuery(option.label); setOpen(false); setActive(-1); onSelect?.(option); input.current?.focus()
  }
  function move(direction: number) {
    const current = enabled.indexOf(active)
    const next = enabled[current < 0 ? direction > 0 ? 0 : enabled.length - 1 : (current + direction + enabled.length) % enabled.length]
    setActive(next ?? -1)
  }
  return <Popover.Root open={isOpen} onOpenChange={next => { setOpen(next); if (!next) setActive(-1) }} modal={false}>
    <Popover.Anchor asChild><div className="m-search">
      <SlateXInput {...props} ref={input} label={label} value={query} disabled={disabled} readOnly={readOnly} type="search" clearable leadingIcon={<SearchIcon />} error={error}
        role="combobox" aria-label={props['aria-label'] ?? (label ? undefined : messages.search)} aria-autocomplete="list" aria-expanded={isOpen} aria-controls={isOpen ? listId : undefined} aria-activedescendant={isOpen && enabled.includes(active) ? `${listId}-${active}` : undefined}
        onValueChange={next => { setQuery(next); setOpen(!!next); setActive(-1) }}
        onFocus={event => { if (query) setOpen(true); onFocus?.(event) }}
        onKeyDown={event => {
          onKeyDown?.(event)
          if (event.defaultPrevented || event.nativeEvent.isComposing) return
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); setOpen(true); move(event.key === 'ArrowDown' ? 1 : -1) }
          if (event.key === 'Enter') { event.preventDefault(); if (isOpen && active >= 0) choose(active); else { onSearch?.(query); setOpen(false) } }
          if (event.key === 'Escape') { event.preventDefault(); setOpen(false); setActive(-1) }
        }} />
    </div></Popover.Anchor>
    <Popover.Portal><Popover.Content asChild sideOffset={4} collisionPadding={12} align="start" onOpenAutoFocus={event => event.preventDefault()} onCloseAutoFocus={event => event.preventDefault()} onInteractOutside={event => { if (event.target instanceof Node && input.current?.contains(event.target)) event.preventDefault() }}>
      <SlateXDropdownPanel size={props.size} id={listId} role={canChoose && options.length ? 'listbox' : undefined} aria-label={messages.suggestions} className="m-search-panel" state={loading ? 'Loading' : error ? 'Error' : options.length ? 'Options' : 'Empty'} message={loading ? messages.loading : error || emptyMessage || messages.empty}>
        <div className="m-dropdown-viewport">{options.map((option, index) => <SlateXDropdownItem size={props.size} key={option.value} id={`${listId}-${index}`} disabled={option.disabled} highlighted={active === index} leadingIcon={option.icon ?? <SearchIcon />} onMouseEnter={() => { if (!option.disabled) setActive(index) }} onMouseDown={event => event.preventDefault()} onClick={() => choose(index)}>{option.label}</SlateXDropdownItem>)}</div>
      </SlateXDropdownPanel>
    </Popover.Content></Popover.Portal>
  </Popover.Root>
})
