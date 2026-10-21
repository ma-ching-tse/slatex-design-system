import { componentLibrary } from './component-library'

export type PageStatus = 'planned' | 'draft' | 'review' | 'stable' | 'deprecated'

export interface NavigationItem {
  id: string
  label: string
  status: PageStatus
  level?: number
  group?: string
  keywords?: string
}

export const siteConfig = {
  name: 'SlateX Design System',
  organization: 'Design Library',
  version: 'v1.1',
  updatedAt: '2026.10.21',
  description: '面向设计师与前端的组件与规范查阅站。',
  figmaUrl: 'https://www.figma.com/design/JsOdWljwN8c1Fnbp3cdOXH/SlateX-Design-System?node-id=0-1',
}

export const navigation: Array<{ label: string; items: NavigationItem[] }> = [
  {
    label: 'Introduction',
    items: [
      { id: 'overview', label: 'Overview', status: 'stable', group: 'Introduction', keywords: '首页 介绍 overview' },
    ],
  },
  {
    label: 'Foundations',
    items: [
      { id: 'accessibility', label: 'Accessibility', status: 'review', group: 'Foundations', keywords: '可访问性 keyboard focus contrast' },
      { id: 'border', label: 'Border', status: 'review', group: 'Foundations', keywords: '描边 边框 焦点 border focus' },
      { id: 'colors', label: 'Colors', status: 'review', group: 'Foundations', keywords: '颜色 色阶 primitives semantic color' },
      { id: 'colors-accessibility', label: 'Contrast', status: 'review', level: 1, group: 'Colors', keywords: '对比度 wcag' },
      { id: 'colors-primitives', label: 'Primitives', status: 'review', level: 1, group: 'Colors', keywords: '基础色阶 hex' },
      { id: 'colors-semantic', label: 'Theme', status: 'review', level: 1, group: 'Colors', keywords: '语义 text surface border primary status' },
      { id: 'grid-layout', label: 'Grid & Layout', status: 'review', group: 'Foundations', keywords: '栅格 页面 响应式' },
      { id: 'iconography', label: 'Iconography', status: 'review', group: 'Foundations', keywords: '图标 icon' },
      { id: 'naming', label: 'Naming & Usage', status: 'review', group: 'Foundations', keywords: '命名 使用 绑定 naming' },
      { id: 'radius', label: 'Radius', status: 'review', group: 'Foundations', keywords: '圆角 full radius' },
      { id: 'effects', label: 'Shadow & Effects', status: 'review', group: 'Foundations', keywords: '阴影 层级 effect elevation' },
      { id: 'spacing', label: 'Spacing', status: 'review', group: 'Foundations', keywords: '间距 dimension gap padding' },
      { id: 'typography', label: 'Typography', status: 'review', group: 'Foundations', keywords: '字体 字号 行高 general sans noto'  },
    ],
  },
  {
    label: 'Library',
    items: [
      { id: 'components', label: 'Components', status: 'review' as const, group: 'Library', keywords: '组件 button form navigation' },
      { id: 'button', label: 'Button', status: 'review' as const, group: 'Components', keywords: '按钮 尺寸 状态 button' },
      ...componentLibrary.map(component => ({ id: component.id, label: component.name, status: 'review' as const, group: 'Components', keywords: component.name })),
    ].sort((a, b) => a.label.localeCompare(b.label, 'en')),
  },
  {
    label: 'Resources',
    items: [
      { id: 'figma-library', label: 'Figma Library', status: 'stable', group: 'Resources', keywords: 'figma 变量 组件' },
    ],
  },
]
