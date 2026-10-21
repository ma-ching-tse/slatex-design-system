# Changelog

## 1.1.0 · 2026-10-21

按当日 Figma 当前值同步 CHG-001～004。共 17 个展示组件、91 个 Lucide 图标；React 下载包为 `slatex-react-1.1.0.tgz`。

| 记录 | 同步结果 | 代码位置 |
| --- | --- | --- |
| [CHG-004 · Skeleton 头像引用](https://www.figma.com/design/JsOdWljwN8c1Fnbp3cdOXH/SlateX-Design-System?node-id=2307-2815) | 已核对一致。Figma 两处实例改用新 Avatar master；代码独立绘制占位，无 master 引用。保持 40 × 40 px、空内容、无边框、Light / Dark 的 neutral/2。补充回归检查。 | `packages/react/src/Skeleton.tsx`、`tests/slatex.test.mjs`、`docs/sources/slatex/skeleton.json` |
| [CHG-003 · Avatar 精简](https://www.figma.com/design/JsOdWljwN8c1Fnbp3cdOXH/SlateX-Design-System?node-id=411-68) | 纳入查阅站。Image / Initials / Icon 三类，32 px 基准；文字 14 / 20 px、图标 20 px、1 px 内描边随尺寸等比缩放。保留数值 `size` API，支持任意正尺寸。同步当前默认图片，空缩写保持空白；图片失败后回退，换图后重试。 | `packages/react/src/Display.tsx`、`packages/react/src/components.css`、`src/ComponentExamples.tsx`、`src/ComponentCode.ts`、`src/component-library.ts`、`public/images/avatar-default.png` |
| [CHG-002 · 规范一致性修订](https://www.figma.com/design/JsOdWljwN8c1Fnbp3cdOXH/SlateX-Design-System?node-id=307-406) | Search 的 Small / Medium 共用 36 px 选项，Large 为 40 px；补齐 Suggestions 标题，Dropdown 标题使用 12 / 16 px Medium。更新品牌模式和图标说明，展示与下载清单统一为当前 91 个 Lucide 图标。红色色阶和布局 16 px gutter 已符合，保留原值。 | `packages/react/src/Search.tsx`、`packages/react/src/components.css`、`packages/react/src/locale-context.ts`、`src/FoundationPages.tsx`、`src/icons.tsx`、`scripts/export-icons.mjs`、`public/icons/` |
| [CHG-001 · 规范说明与命名](https://www.figma.com/design/JsOdWljwN8c1Fnbp3cdOXH/SlateX-Design-System?node-id=171-329) | 补齐控件间距说明和 Figma 属性命名；Button 的圆角覆写不再标为 Figma Shape 变体。核对 General Sans / Noto Sans SC、39 个文字样式、400 / 500 / 550 字重、控件 12 px 内边距、下拉 4 / 8 px 间距和按钮 8 / 12 / 16 / 20 px 内边距，已一致的实现保持原值。 | `src/FoundationPages.tsx`、`src/ButtonPage.tsx`、`src/translations.ts`、`docs/sources/slatex/styles.json`、`packages/react/src/components.css` |

来源与边界：首次采集快照 B001 / B002 保持不变。本次定向重读后，Avatar 采用当前 14 / 20 px 文字与默认图片，图标采用当前 91 个清单；不是重新封存全量设计基线。EXP-001 内容交互探索仍待确认，未纳入本次同步。基础颜色与文字样式文件保留原始采集日期，不将其标成全量重新采集。

验证：45 项自动化检查、静态检查、生产构建和下载包独立安装后的类型检查／构建通过；浏览器检查了 Avatar 等比缩放、图片和窄屏，三档 Search 键盘选择与选项尺寸、Skeleton 明暗主题，以及图标清单。首版其余页面的完整视觉验收仍待补齐。
