import { JSDOM } from 'jsdom'

// Component-only DOM simulation. No browser, page navigation or external resources.
const dom = new JSDOM('<!doctype html><html><body></body></html>', { pretendToBeVisual: true })
const { window } = dom
for (const name of ['window', 'document', 'navigator', 'HTMLElement', 'HTMLFormElement', 'HTMLInputElement', 'HTMLTextAreaElement', 'HTMLButtonElement', 'HTMLSelectElement', 'Element', 'Node', 'NodeFilter', 'DocumentFragment', 'MutationObserver', 'CustomEvent', 'Event', 'KeyboardEvent', 'MouseEvent', 'FocusEvent', 'DOMRect', 'ShadowRoot']) {
  Object.defineProperty(globalThis, name, { value: name === 'window' ? window : window[name], configurable: true, writable: true })
}
globalThis.getComputedStyle = window.getComputedStyle.bind(window)
globalThis.requestAnimationFrame = window.requestAnimationFrame.bind(window)
globalThis.cancelAnimationFrame = window.cancelAnimationFrame.bind(window)
globalThis.IS_REACT_ACT_ENVIRONMENT = true
window.HTMLElement.prototype.scrollIntoView = function () {}
window.HTMLElement.prototype.hasPointerCapture = () => false
window.HTMLElement.prototype.setPointerCapture = function () {}
window.HTMLElement.prototype.releasePointerCapture = function () {}
class ResizeObserver { observe() {} unobserve() {} disconnect() {} }
globalThis.ResizeObserver = window.ResizeObserver = ResizeObserver
class PointerEvent extends window.MouseEvent {
  constructor(type, options = {}) { super(type, options); this.pointerId = options.pointerId ?? 1; this.pointerType = options.pointerType ?? 'mouse'; this.isPrimary = true }
}
globalThis.PointerEvent = window.PointerEvent = PointerEvent

const { createRoot } = await import('react-dom/client')
const { act } = await import('react')
export { act }
export async function mount(element) {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const root = createRoot(container)
  await act(async () => { root.render(element) })
  return {
    container,
    async render(next) { await act(async () => { root.render(next) }) },
    async cleanup() { await act(async () => { root.unmount() }); container.remove() },
  }
}
export async function click(element) { await act(async () => { element.click() }) }
export async function focus(element) { await act(async () => { element.focus() }) }
export async function key(element, value, options = {}) { await act(async () => { element.dispatchEvent(new window.KeyboardEvent('keydown', { key: value, bubbles: true, cancelable: true, ...options })) }) }
export async function type(element, value) {
  await act(async () => {
    const proto = element.tagName === 'TEXTAREA' ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype
    Object.getOwnPropertyDescriptor(proto, 'value').set.call(element, value)
    element.dispatchEvent(new window.Event('input', { bubbles: true }))
  })
}
export async function wait(ms) { await act(async () => { await new Promise(resolve => setTimeout(resolve, ms)) }) }
