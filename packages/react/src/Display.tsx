import { useState, type HTMLAttributes, type ReactNode } from 'react'
import { User } from 'lucide-react'
import { cx, type CompactSize, type Tone } from './shared'

export interface SlateXTagProps extends HTMLAttributes<HTMLSpanElement> {
  size?: CompactSize
  tone?: Tone
  variant?: 'Subtle' | 'Outline'
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
}
export function SlateXTag({ size = 'Medium', tone = 'Neutral', variant = 'Subtle', leadingIcon, trailingIcon, className, children, ...props }: SlateXTagProps) {
  return <span {...props} className={cx('m-tag', `compact-${size}`, `tone-${tone}`, `tag-${variant}`, className)}>{leadingIcon ? <span aria-hidden="true">{leadingIcon}</span> : null}{children}{trailingIcon ? <span aria-hidden="true">{trailingIcon}</span> : null}</span>
}
export interface SlateXBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  size?: CompactSize
  tone?: Tone
  variant?: 'Count' | 'Dot'
  count?: number | string
  max?: number
  showZero?: boolean
}
export function SlateXBadge({ size = 'Medium', tone = 'Neutral', variant = 'Count', count = 8, max = 99, showZero = false, className, ...props }: SlateXBadgeProps) {
  if (variant === 'Count' && Number(count) === 0 && !showZero) return null
  return <span {...props} className={cx('m-badge', `compact-${size}`, `tone-${tone}`, `badge-${variant}`, className)}>{variant === 'Dot' ? null : typeof count === 'number' && count > max ? `${max}+` : count}</span>
}
export type AvatarSize = 16 | 24 | 32 | 40 | 48 | 64
export interface SlateXAvatarProps extends HTMLAttributes<HTMLSpanElement> { size?: AvatarSize; src?: string; alt?: string; initials?: string; icon?: ReactNode }
function AvatarImage({ src, alt, fallback }: { src: string; alt: string; fallback: ReactNode }) {
  const [failed, setFailed] = useState(false)
  return failed ? fallback : <img src={src} alt={alt} onError={() => setFailed(true)} />
}
export function SlateXAvatar({ size = 32, src, alt = '', initials, icon, className, children, ...props }: SlateXAvatarProps) {
  const fallback = initials || icon || <User aria-hidden="true" />
  return <span {...props} className={cx('m-avatar', `avatar-${size}`, className)} role={src ? undefined : alt ? 'img' : undefined} aria-label={!src && alt ? alt : props['aria-label']}>
    {src ? <AvatarImage key={src} src={src} alt={alt} fallback={<span role={alt ? 'img' : undefined} aria-label={alt || undefined}>{fallback}</span>} /> : children ?? fallback}
  </span>
}
