# SlateX Design System

基于 Master 的独立查阅站。设计依据：[SlateX Figma](https://www.figma.com/design/JsOdWljwN8c1Fnbp3cdOXH/SlateX-Design-System?node-id=509-506)，快照日期 2026-10-18。

## 范围

- 16 个组件：Button、Input、Textarea、Search、Checkbox、Radio、Switch、Select、Tag、Badge、Tooltip、Dialog、Toast、Alert、Tabs、Skeleton。
- Avatar、Popover 暂不展示；Composer 不在本次范围。
- General Sans 400 / 500 / 550；中文 Noto Sans SC。39 个文字样式。
- Lucide 80 个常用图标、现有 Media 标识、Standard / Sidebar 布局。
- 92 个主题变量；Orange / Yellow / Purple 三套 Figma 品牌预设，每套 21 个基础色阶，独立 Light / Dark 映射。
- 页头保留自定义品牌色预览。三套预设逐项保留 Figma 数值；自定义颜色使用 Master 的色阶生成算法，不会改写 Figma。

## 本地运行

```sh
npm install
npm run dev -- --port 5180
```

此站点使用独立依赖目录；复制到别处后执行 `npm ci` 即可安装锁定版本。没有复用 Master 的 Vercel 项目绑定。

```sh
npm run build
npm run lint
npm run test:components
```

`dist/` 为静态站点；`public/packages/slatex-react-1.0.0.tgz` 为 React 包。组件页可复制完整使用代码，基础规范页可下载包含当前品牌选择的 CSS。

## 更新设计数据

`docs/sources/slatex/` 保留 Figma 的基础色、主题别名、品牌模式和文字样式快照。更新这些快照后运行 `npm run sync:figma`，生成网站数据、默认 CSS 和 JSON 交付文件。它读取本地快照，不会自动修改或写回 Figma。

组件几何数值保存在组件 CSS 中，按 Figma 规范维护；不创建额外的尺寸变量层。交付包中保留少量模板内部组件，未纳入首版的组件不在网页中展示。

## 验证记录

构建、静态检查、43 项组件与品牌色测试通过。其中 17 项在 JSDOM 中验证输入、清空、表单重置、禁用状态、选择、键盘切换、弹窗焦点返回和 Toast 计时；修复了 Search 的 Small / Large 下拉错误使用 Medium 尺寸的问题。此前的 118 个中英文服务端视图生成检查通过。

JSDOM 测试不验证真实布局、字体渲染或浮层定位。首版已通过自动化测试；真实浏览器的视觉、点击和窄屏验收仍待完成。

Figma 的 Orange 预设使用白色 on-solid；原值保留，普通文字对比度低于 4.5 的组合可在网站 Contrast 页看到。尚未擅自调整这项设计决策。
