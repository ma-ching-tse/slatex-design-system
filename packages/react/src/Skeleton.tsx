import type { CSSProperties } from 'react'
import { cx } from './shared'

export interface SlateXSkeletonProps {
  shape?: 'Text' | 'Block' | 'Circle'
  width?: CSSProperties['width']
  height?: CSSProperties['height']
  animate?: boolean
  className?: string
}
export function SlateXSkeleton({ shape = 'Text', width, height, animate = true, className }: SlateXSkeletonProps) {
  const circleSize = width ?? height ?? 40
  return <span aria-hidden="true" className={cx('m-skeleton', `skeleton-${shape}`, animate && 'is-animated', className)} style={shape === 'Circle' ? { width:circleSize, height:circleSize } : { width,height }} />
}
