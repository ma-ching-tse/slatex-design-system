# SlateX · React

版本 `1.1.0`，支持 React 18 / 19。网页提供 17 个组件，包含 Avatar、Tabs 和 Skeleton；Popover / Composer 暂不作为正式交付组件。

```sh
npm install ./slatex-react-1.1.0.tgz
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
- Avatar：Image / Initials / Icon；32 px 基准，`size` 接受任意正数并等比缩放文字、图标与描边，对应 Figma 的 Scale（K）。基准文字 14 / 20 px、图标 20 px；`initials=""` 保持空占位。图片由调用方传入。
- Search：Small / Medium 使用 Medium 下拉（36 px 选项），Large 使用 Large（40 px）；Suggestions 为 12 / 16 px、500 字重。
- Skeleton：Text / Block / Circle，默认 1600ms Pulse；减少动态效果时静止。父级负责一次性播报加载状态。
- Input、Textarea、Search 支持原生字段属性与受控值；Select / Radio / Checkbox / Switch 支持表单和键盘。
- Dialog / Tooltip / Select / Search 使用 Portal。Dialog 管理模态焦点，关闭后归还焦点。
- Toast 默认 4000ms，0 为常驻；队列由业务管理。
- 数值规格和完整属性以网页「实现参考」及随包类型定义为准。

尚未发布至 npm registry；通过本地压缩包安装。Figma 预设保留原值，可在 Contrast 页检查对比度。
