# SlateX · React

版本 `1.0.0`，支持 React 18 / 19。首版网页提供 16 个完成的组件，包含 Tabs 和 Skeleton；Avatar / Popover / Composer 暂不作为首版交付组件。

```sh
npm install ./slatex-react-1.0.0.tgz
```

```tsx
import { SlateXButton, SlateXLocaleProvider } from '@slatex/react'
import '@slatex/react/styles.css'

export function Save() {
  return <SlateXLocaleProvider locale="zh"><SlateXButton>保存</SlateXButton></SlateXLocaleProvider>
}
```

- 字体：包内带 General Sans Variable。应用设置 `font-family: 'General Sans', 'Noto Sans SC', sans-serif`，中文字体由应用加载。
- 默认品牌 Orange；在网站选择品牌后，下载 Tokens CSS，在组件样式之后引入。
- Dark：给根元素设置 `data-theme="dark"`。品牌和明暗两项独立。
- Button 默认 Pill；Dialog 内按钮按 Figma 实例保留 12px 圆角。
- Tabs：Tiny / Medium / Large，2–3 项，支持点击、方向键、Home / End 和禁用项。
- Skeleton：Text / Block / Circle，默认 1600ms Pulse；减少动态效果时静止。父级负责一次性播报加载状态。
- Input、Textarea、Search 支持原生字段属性与受控值；Select / Radio / Checkbox / Switch 支持表单和键盘。
- Dialog / Tooltip / Select / Search 使用 Portal。Dialog 管理模态焦点，关闭后归还焦点。
- Toast 默认 4000ms，0 为常驻；队列由业务管理。
- 数值规格和完整属性以网页「实现参考」及随包类型定义为准。

尚未发布至 npm registry；通过本地压缩包安装。Figma 预设保留原值，可在 Contrast 页检查对比度。
