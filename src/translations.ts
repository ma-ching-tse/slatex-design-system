export type Locale = 'en' | 'zh'

// Technical names, Token keys and API values stay unchanged.
const pairs: Array<[string, string]> = [
  ['Corner radius override; no Shape variant','圆角覆写；无 Shape 变体'],
  ['Base size','基准尺寸'], ['number · px (proportional scaling)','number · px（等比缩放）'],
  ['Use','用途'], ['Label to input gap','Label 与输入区间距'],
  ['Brand palette','品牌基础色板'],
  ['Introduction','简介'], ['Overview','概览'], ['Design Principles','设计原则'], ['Status & Versioning','状态与版本'], ['Changelog','更新记录'],
  ['Atlas archive','Atlas 归档'], ['Brand','品牌'], ['Brand Overview','品牌概览'], ['Logo','标志'], ['Voice & Tone','语气与风格'], ['Imagery','品牌图像'],
  ['Foundations','基础规范'], ['Colors','颜色'], ['Primitives','基础色阶'], ['Theme','主题'], ['Contrast','对比度'], ['Typography','字体'], ['Spacing','间距'], ['Radius','圆角'], ['Border','描边'], ['Grid & Layout','栅格与布局'], ['Iconography','图标'], ['Shadow & Effects','阴影与效果'], ['Motion','动效'], ['Naming & Usage','命名与使用'], ['Accessibility','可访问性'],
  ['Library','组件库'], ['Components','组件'], ['Patterns','模式'], ['Resources','资源'], ['Figma Library','Figma 组件库'],
  ['Stable','稳定'], ['Review','待确认'], ['Draft','草案'], ['Planned','计划中'], ['Deprecated','已弃用'], ['Last updated','更新日期'], ['Previous','上一页'], ['Next','下一页'],
  ['Open navigation','打开导航'], ['Close navigation','关闭导航'], ['Navigation','目录'], ['Design system navigation','设计系统目录'], ['Search docs','搜索规范'], ['Toggle theme','切换明暗模式'], ['Open in Figma','在 Figma 中打开'], ['Home','首页'],
  ['Search design system','搜索设计规范'], ['Search colors, type, spacing…','搜索颜色、字体、间距或状态…'], ['No results','没有匹配的规范'],
  ['Clarity over decoration','清晰优先'], ['Semantic before specific','语义优先'], ['Progressive completion','逐步完善'],
  ['Visuals support recognition and actions.','视觉服务识别与操作。'], ['Use semantic Tokens, e.g.','业务页面使用语义 Token，如'], ['Mark unfinished content as Planned / Draft.','未完成内容标记 Planned / Draft。'],
  ['Planned; content pending','已进入规划，内容尚未建立'], ['Not a design reference','不可作为设计依据'], ['In progress','正在制定和讨论'], ['Reference only','可参考，不建议正式交付'], ['Ready for review','规则基本完成，等待确认'], ['Limited use','限制性使用'], ['Approved for use','已经批准并可以正式使用'], ['Use by default','默认使用'], ['Retired; migration retained','已经废弃，保留迁移信息'], ['Historical reference','仅用于历史查询'],
  ['Content status','内容状态'], ['Version rules','版本规则'], ['Update the version and Changelog when Tokens, names or usage change.','Token、命名或用途变更时更新版本与 Changelog。'],
  ['Modules','模块'], ['Primary logo','主标志'], ['Logomark','图形标志'], ['Logo variants','标志变体'], ['Assets','资产'], ['Pending rules','待补充规则'], ['Clear space / minimum size: Draft','安全空间 / 最小尺寸：Draft'],
  ['Brand voice','品牌语气'], ['Writing principles','文案原则'], ['Examples & exclusions','示例与禁用表达'], ['Image style','图像风格'], ['Crop & composition','裁切与构图'], ['Sources & copyright','来源与版权'],
  ['Version','版本'], ['Changes','变更内容'], ['Scope','影响范围'], ['Definition','定义'], ['Usage','使用规则'], ['Planned content','计划内容'], ['Duration','时长'], ['Easing','缓动'], ['Reduced motion','减少动态效果'], ['Generation','生成'], ['Workflow','工作流'], ['Result & Status','结果与状态'], ['Page navigation','页面切换'],
  ['Types','类型'], ['Examples','示例'], ['Sizes & configuration','尺寸与配置'], ['States & behavior','状态与行为'], ['All states','全部状态'], ['Implementation','实现参考'], ['Props','属性对照'], ['Configuration','配置'],
  ['Property','属性'], ['Options / type','选项 / 类型'], ['Type / options','类型 / 选项'], ['Default','默认值'], ['Figma property','Figma 对应项'], ['State · preview','State · 固定预览'], ['Label / custom icon','标签 / 任意图标'], ['Icon-only label','纯图标名称'], ['Native button attributes','原生 button 属性'],
  ['Specifications','数值规格'], ['Specifications · px','数值规格 · px'], ['Height','高度'], ['Font size / line height','字号 / 行高'], ['Padding','内边距'], ['Icon','图标'], ['Radius','圆角'], ['Weight','字重'], ['Icon gap','图文间距'], ['Pill radius','Pill 圆角'], ['Action gap','主次间距'], ['Touch size','触屏尺寸'], ['Press feedback','按压反馈'], ['Theme mapping','主题映射'], ['Background','背景'], ['Foreground','前景'], ['Stroke','描边'], ['Transparent','透明'],
  ['brand/8 + 12% black','brand/8 + 12% 黑色'], ['neutral/8 + 12% black','neutral/8 + 12% 黑色'], ['red/8 + 12% black','red/8 + 12% 黑色'], ['neutral/1 (Tertiary: transparent)','neutral/1（Tertiary：透明）'],
  ['Button states; scroll horizontally','按钮状态对照表，可横向滚动'], ['Button props; scroll horizontally','按钮属性对照表，可横向滚动'], ['Button specifications; scroll horizontally','按钮数值规格表，可横向滚动'], ['Button theme mapping; scroll horizontally','按钮主题映射表，可横向滚动'],
  ['Copy','复制'], ['Copied','已复制'], ['Copy failed','复制失败'], ['Code','查看代码'], ['Install · React','接入 · React'], ['Download package ↗','下载组件包 ↗'],
  ['Continue','继续'], ['Create project','创建项目'], ['Cancel','取消'], ['Learn more','了解更多'], ['Delete','删除'], ['Add item','添加项目'],
  ['Search components','搜索组件'], ['Project settings','项目设置'], ['Autosave','自动保存'], ['Done','完成'], ['Delete project','删除项目'], ['Save project','保存项目'], ['Open dialog','打开弹窗'], ['Save','保存'], ['Deleting this project cannot be undone.','项目删除后无法恢复。'], ['Save project settings?','保存当前项目设置？'], ['Saved','已保存'],
  ['Project name','项目名称'], ['New project','新项目'], ['Password','密码'], ['Name already exists','名称已被使用'], ['Project description','项目说明'], ['Describe this project','描述这个项目'], ['Design System library','Design System 组件库'], ['Add a project description','请补充项目说明'],
  ['Type a message…','输入消息…'], ['Attachment','附件'], ['Look at this image','看看这张图'], ['Organize this project’s design guidelines','整理这个项目的设计规范'], ['Generation failed. Try again.','生成失败，请重试'], ['Sync to all projects','同步到所有项目'], ['Receive updates','接收更新'], ['Project type','项目类型'], ['Status','状态'], ['Receive notifications','接收通知'], ['Select project type','选择项目类型'], ['Select a project type','请选择项目类型'], ['Updates','更新'], ['Synced','已同步'], ['Member','成员'],
  ['Add component','添加组件'], ['Add component to this project','添加组件到当前项目'], ['No arrow','无箭头'], ['Close button','关闭按钮'], ['Sync settings','同步设置'], ['Project saved','项目已保存'], ['Update available','有可用更新'], ['Version 0.2.0','版本 0.2.0'], ['Request failed. Try again.','请求失败，请重试'],
  ['Color library','颜色库'], ['Component scales','组件色阶'], ['All','全部'], ['Type scale','字体阶梯'], ['Project roles','项目角色参考'], ['Role','角色'], ['Base style','基础样式'], ['Scale','档位'], ['Nested','嵌套'], ['Width','宽度'], ['Color','颜色'], ['Focus','焦点'],
  ['Presets','预设'], ['Layout preset','布局类型'], ['Reference width','参考宽度'], ['Specification','规格'], ['Viewport','视口'], ['Columns','列数'], ['Content','内容'], ['Margin','边距'], ['Sidebar','侧栏'], ['Main area','主区域'], ['Inset','留白'], ['Breakpoints','响应区间'],
  ['12 columns · 48 px','12 列 · 48 px'], ['8 columns · 32 px','8 列 · 32 px'], ['4 columns · 16 px','4 列 · 16 px'], ['Sidebar content columns','Sidebar 内容列数'], ['Main area ≥1200 / ≥600 / <600 → 12 / 8 / 4','主区域 ≥1200 / ≥600 / <600 → 12 / 8 / 4'],
  ['Media','媒体'], ['Sources','来源'], ['Elevation','层级'], ['Overlay','遮罩'], ['Foreground / background','前景 / 背景'], ['Pair','配对'], ['Meets text contrast','满足普通文字对比度'], ['Below 4.5','低于 4.5'], ['Thresholds','门槛'],
  ['Body text','普通文字'], ['Large text · 24 px / 18.67 px Bold','大字号文字 · 24 px / 18.67 px Bold'], ['Control boundaries / graphics','必要控件边界 / 图形'], ['Check','检查项'], ['Body / large text','普通文字 / 大字号'], ['Control boundaries','必要控件边界'], ['Target size','点击目标'], ['≥ 24 × 24 CSS px (or spacing exception)','≥ 24 × 24 CSS px（或满足间距例外）'], ['Primary mobile actions','移动主要操作'], ['Recommended ≥ 44 × 44 px','建议 ≥ 44 × 44 px'], ['Reflow','重排'], ['Text scaling','文字缩放'], ['Focus sample','焦点样本'], ['2 px + 2 px; unobscured','2 px + 2 px；不被遮挡'],
  ['Keyboard','键盘'], ['Action','操作'], ['Key','按键'], ['Move focus','移动焦点'], ['Activate','触发'], ['Dismiss overlay','关闭浮层'], ['Enter, trap and restore focus','焦点进入、限制、关闭后返回'], ['Delivery checks','交付检查'], ['Checklist','检查清单'],
  ['Light / Dark on actual backgrounds','Light / Dark 与实际背景'], ['Labels, required fields and errors','标签、必填与错误关联'], ['Icon labels and image alt text','图标按钮名称与图片替代文本'], ['Live status announcements','动态状态播报'], ['Long text and 320 px reflow','长文本与 320 px 重排'], ['200% text scaling','200% 文字缩放'], ['Keyboard and screen readers','键盘与屏幕阅读器'],
  ['Names','名称'], ['Bindings','绑定'], ['Object','对象'], ['Naming','命名'], ['Primitive color','基础色'], ['Theme color','主题色'], ['Spacing / radius','间距 / 圆角'], ['Text style','文字样式'], ['Component props','组件属性'], ['Font size / line height / tracking','字号 / 行高 / 字距'], ['Text styles','Text 样式'], ['Component size','组件尺寸'], ['Component specification','组件自身规格'], ['Project copy','项目复制'], ['Variables + text styles + component dependencies','变量 + 文字样式 + 主组件依赖'],
  ['Download failed. Try again.','下载失败，请重试'], ['Figma file preview','Figma 文件预览'], ['Collapse preview','收起预览'], ['Expand preview','展开预览'], ['Open file in Figma','在 Figma 中打开文件'], ['SlateX Design System · Figma preview','SlateX Design System · Figma 文件预览'],
  ['Adjust brand color','调整品牌色'], ['Brand color','品牌色'], ['Reset brand color','重置品牌色'], ['Reset','重置'], ['Close color settings','关闭品牌色设置'], ['Hue','色相'], ['Saturation','饱和度'], ['Brightness','亮度'], ['Brand color HEX','品牌色 HEX'], ['Enter a 3 or 6 digit HEX color','请输入 3 或 6 位 HEX 色值'], ['Purple','紫色'], ['Blue','亮蓝'], ['Green','鲜绿'], ['Orange','亮橙'], ['Pink','亮粉'],
  ['Input element','输入元素'], ['Input height','输入高度'], ['Padding H / V','内边距 H / V'], ['Option height','选项高度'], ['Panel radius','面板圆角'], ['Default width × height','默认宽 × 高'], ['Min. width × height','最小宽 × 高'], ['Padding / gap','内边距 / 间距'], ['Required','必填'], ['Control','控件'], ['Native form attributes','原生表单属性'], ['Track','轨道'], ['Thumb','滑块'], ['Select…','请选择'], ['Icon / radius','图标 / 圆角'], ['Count height / min. width','Count 高 / 最小宽'], ['Size','尺寸'], ['Initials size','缩写字号'], ['Max. width','最大宽'], ['Focusable element','可聚焦元素'], ['Default width','默认宽'], ['Arrow width × height','箭头宽 × 高'], ['Max. body height','正文最大高'], ['Gap','间距'], ['number · ms (0 = persistent)','number · ms（0 = 常驻）'],
  ['Figma presets','Figma 预设'], ['Custom preview','自定义预览'],
  ['Today','今天'], ['This week','本周'], ['This month','本月'], ['Loading','加载中'], ['Yellow','黄色'], ['Tabs','Tabs'], ['Skeleton','Skeleton'], ['First enabled item','首个可用项'], ['Height','高度'], ['Outer / inner radius','外 / 内圆角'], ['By shape','按 Shape'],
  ['H','高'], ['Font','字号'],
]

const dictionary = new Map<string, { en: string; zh: string }>()
for (const [en, zh] of pairs) {
  // A source label may have several English aliases (e.g. Iconography / Icon).
  if (!dictionary.has(zh)) dictionary.set(zh, { en, zh })
  dictionary.set(en, { en, zh })
}

export function translate(text: string, locale: Locale) {
  return dictionary.get(text)?.[locale] ?? text
}

export function translateCode(source: string, locale: Locale) {
  // Translate complete text/attribute literals; never touch imports, identifiers or enum values.
  return source.replace(/((?:label|placeholder|aria-label|title|message|description|error|alt|defaultValue)\s*[=:]\s*)(["'])((?:\\.|(?!\2)[^\\])*)\2|>([^<>{}\n]+)(?=[<{])/g, (_match, prefix, quote, literal, text) => {
    if (quote) return prefix + quote + translate(literal, locale) + quote
    const trimmed = text.trim()
    return '>' + text.replace(trimmed, translate(trimmed, locale))
  })
}
