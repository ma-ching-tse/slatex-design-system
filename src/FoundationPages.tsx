import { useLocale } from './locale-context'
import { useState, type ReactNode } from 'react'
import { ArrowRight, Check, ExternalLink, Maximize2, Minimize2 } from 'lucide-react'
import { SlateXTag } from '@slatex/react'
import {
  contrastPairs, contrastRatio, cssName, dimensions, displayHex, foundationPages,
  foundationSource, iconLibrary, layoutPresets, primitives, themeTokens, typeScale,
} from './foundations'
import { siteConfig } from './content'
import { useBrandTheme } from './brand-context'
import './foundations.css'
import { slatexIcons } from './icons'

type Theme = 'light' | 'dark'
function CopyButton({ value, label = value, className = '' }: { value: string; label?: string; className?: string }) {
  const { t } = useLocale()

  const [result, setResult] = useState<{ value: string; state: 'copied' | 'error' } | null>(null)
  const state = result?.value === value ? result.state : 'idle'
  async function copy() {
    try { await navigator.clipboard.writeText(value); setResult({ value, state: 'copied' }) }
    catch { setResult({ value, state: 'error' }) }
  }
  return <button type="button" className={`foundation-copy ${className}`} style={{ position: 'relative' }} onClick={copy} title={`${t('Copy')} ${value}`} aria-label={`${t('Copy')} ${value}`}>
    <span>{state === 'copied' ? t('已复制') : state === 'error' ? t('复制失败') : label}</span><span className="sr-only" aria-live="polite">{state === 'copied' ? t('已复制') : state === 'error' ? t('复制失败') : ''}</span>
  </button>
}
function Section({ title, children }: { title: string; children: ReactNode }) { const { t } = useLocale(); return <section className="doc-section"><h2>{t(title)}</h2>{children}</section> }
function Specs({ columns, rows }: { columns: string[]; rows: ReactNode[][] }) {
  const { t } = useLocale()
  const cell = (value: ReactNode) => typeof value === 'string' ? t(value) : value
  return <div className="spec-scroll" tabIndex={0} aria-label={columns.map(t).join(' / ')}><table className="component-table foundation-specs"><thead><tr>{columns.map(column => <th key={column} scope="col">{t(column)}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={index}>{row.map((value, i) => i === 0 ? <th scope="row" key={i}>{cell(value)}</th> : <td key={i}>{cell(value)}</td>)}</tr>)}</tbody></table></div>
}
function Code({ code }: { code: string }) {
  const { t } = useLocale()

  return <details className="example-code"><summary>CSS</summary><div className="code-actions"><CopyButton value={code} label={t("复制")} /></div><pre><code>{code}</code></pre></details>
}
function ThemeTable({ tokens }: { tokens: typeof themeTokens }) {
  return <Specs columns={['Token', 'Light', 'Dark']} rows={tokens.map(token => [
    <CopyButton key="name" value={cssName(token.name)} label={token.name} />,
    <ColorCell key="light" reference={token.light} value={token.value} />,
    <ColorCell key="dark" reference={token.dark} value={token.darkValue} />,
  ])} />
}
function ColorCell({ reference, value }: { reference: string; value: string }) {
  return <div className="foundation-color-cell"><span className="foundation-swatch" style={{ background: value }} aria-hidden="true" /><div><CopyButton value={displayHex(value)} /><small>{reference.startsWith('#') ? 'Direct' : reference}</small></div></div>
}
function Colors({ onNavigate }: { onNavigate: (id: string) => void }) {
  const { t } = useLocale()

  const { css, tokens } = useBrandTheme()
  return <><Section title="Theme"><div className="foundation-color-pairs"><div className="foundation-pair" style={{ background: 'var(--m-brand-background)', color: 'var(--m-brand-foreground)' }}>{t("Brand")}</div><div className="foundation-pair" style={{ background: 'var(--m-brand-solid)', color: 'var(--m-brand-on-solid)' }}>{t("Brand")}</div></div><div className="foundation-tone-row">{(['Success','Info','Warning','Error'] as const).map(tone => <SlateXTag tone={tone} key={tone}>{tone}</SlateXTag>)}</div></Section>
    <Section title="Color library"><div className="feature-list">{[['colors-semantic','Theme',String(tokens.length)],['colors-primitives','Primitives','92'],['colors-accessibility','Contrast','Light / Dark']].map(([id, name, count]) => <button className="feature-row" key={id} onClick={() => onNavigate(id)}><span><strong>{t(name)}</strong><small>{count}</small></span><ArrowRight size={18} /></button>)}</div></Section>
    <Section title="CSS"><Code code={`${css}\n\n.action {\n  color: var(--m-brand-on-solid);\n  background: var(--m-brand-solid);\n}`} /></Section></>
}
function Primitives() {
  const { t } = useLocale()

  const [copied, setCopied] = useState('')
  async function copy(name: string, value: string) { try { await navigator.clipboard.writeText(displayHex(value)); setCopied(name) } catch { setCopied('') } }
  return <>{primitives.map(family => <Section title={family.name} key={family.name}><div className="foundation-palette">{family.values.map(token => <button className="foundation-color-tile" key={token.name} onClick={() => copy(token.name, token.value)} aria-label={`${t('Copy')} ${token.name} ${displayHex(token.value)}`} title={token.name}><span style={{ background: token.value }} /><strong>{token.step}</strong><code>{copied === token.name ? t('已复制') : displayHex(token.value)}</code></button>)}</div></Section>)}</>
}
function ThemeColors() {
  const { t } = useLocale()

  const { tokens: themeTokens, palette } = useBrandTheme()
  const common = themeTokens.filter(token => token.common)
  return <>{['text','surface','border','brand','status','overlay'].map(group => <Section title={group === 'status' ? 'Status' : group.charAt(0).toUpperCase() + group.slice(1)} key={group}><ThemeTable tokens={common.filter(token => token.name.startsWith(`${group}/`))} /></Section>)}
    <Section title={t("组件色阶")}><details className="component-details"><summary>{t('All')} · {themeTokens.length - common.length}</summary><ThemeTable tokens={themeTokens.filter(token => !token.common)} /><h3>{t('Brand palette')}</h3><Specs columns={['Token', 'HEX']} rows={Object.entries(palette).map(([step, value]) => [<CopyButton key="name" value={`--m-palette-brand-${step}`} label={`brand/${step}`} />, <ColorCell key="value" reference={`brand/${step}`} value={value} />])} /></details></Section></>
}
function Typography() {
  const { t } = useLocale()

  const [weight, setWeight] = useState(400)
  const weights = [[400,'Regular'],[500,'Medium'],[550,'SemiBold']] as const
  const weightName = weights.find(row => row[0] === weight)![1]
  return <><Section title="General Sans · Noto Sans SC"><div className="foundation-typeface" style={{ fontWeight: weight }}>Design 设计</div><div className="foundation-segmented" aria-label={t("字重")}>{weights.map(([value, name]) => <button type="button" key={value} aria-pressed={weight === value} onClick={() => setWeight(value)}>{value} {name}</button>)}</div></Section>
    <Section title="Type scale"><div className="foundation-type-list">{typeScale.map(style => <div className="foundation-type-row" key={style.size}><span className="foundation-type-sample" style={{ fontSize: style.size, lineHeight: `${style.lineHeight}px`, fontWeight: weight }}>Aa</span><CopyButton value={`Text/${style.size}/${weightName}`} /><span>{style.size} / {style.lineHeight}</span><span>0%</span></div>)}</div></Section>
    <Section title={t("实现参考")}><Code code={"body {\n  font-family: 'General Sans', 'Noto Sans SC', sans-serif;\n}\n.label {\n  font-size: 14px;\n  line-height: 20px;\n  font-weight: 500;\n  letter-spacing: 0;\n}"} /><details className="component-details"><summary>{t("项目角色参考")}</summary><Specs columns={[t('角色'),t('基础样式')]} rows={[
      ['Heading/Page','Text/32/SemiBold'],['Heading/Section','Text/24/Medium'],['Body/Default','Text/16/Regular'],['Label/Default','Text/14/Medium'],['Caption/Default','Text/12/Regular'],['Label/Micro','Text/10/Medium'],
    ]} /></details></Section></>
}
function Spacing() {
  return <><Section title="Scale"><div className="foundation-spacing-list">{dimensions('space').map(token => <div className="foundation-spacing-row" key={token.name}><CopyButton value={cssName(token.name)} label={token.name} /><div className="foundation-spacing-track"><span style={{ width: token.value }} /></div><strong>{token.value} px</strong></div>)}</div></Section><Section title="CSS"><Code code={".card {\n  padding: var(--m-space-24);\n  gap: var(--m-space-16);\n}"} /></Section></>
}
function Radius() {
  const { t } = useLocale()

  return <><Section title="Scale"><div className="foundation-radius-grid">{dimensions('radius').map(token => <div className="foundation-radius-item" key={token.name}><div style={{ borderRadius: token.value }} /><CopyButton value={cssName(token.name)} label={token.name} /><span>{token.value === 9999 ? 'Full' : `${token.value} px`}</span></div>)}</div></Section><Section title={t("嵌套")}><div className="foundation-nested-radius"><div><span>24 − 16 = 8</span></div></div></Section><Section title="CSS"><Code code={".card { border-radius: var(--m-radius-12); }\n.pill { border-radius: var(--m-radius-9999); }"} /></Section></>
}
function Border() {
  const { t } = useLocale()

  return <><Section title="Width"><div className="foundation-border-grid">{[0,1,2].map(width => <div className="foundation-border-item" key={width}><span style={{ borderWidth: width }}>{width} px</span></div>)}</div></Section>
    <Section title="Color"><ThemeTable tokens={themeTokens.filter(token => token.name.startsWith('border/'))} /></Section>
    <Section title="Focus"><div className="foundation-focus-stage"><span className="foundation-focus-sample">{t("Focus")}</span><code>2 px + 2 px</code></div><Code code={"button:focus-visible {\n  outline: 2px solid var(--m-brand-6);\n  outline-offset: 2px;\n}"} /></Section></>
}
const layoutCSS = ".standard {\n  box-sizing: border-box;\n  width: 100%;\n  max-width: 1536px;\n  margin-inline: auto;\n  padding-inline: 48px;\n}\n.grid { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: 16px; }\n@media (width < 1200px) { .grid { grid-template-columns: repeat(8, minmax(0, 1fr)); } }\n@media (width < 1200px) and (width >= 768px) { .standard { padding-inline: 32px; max-width: 1504px; } }\n@media (width < 768px) {\n  .standard { padding-inline: 16px; }\n  .grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }\n}"
const sidebarCSS = `.sidebar-layout { display: grid; grid-template-columns: 256px minmax(0, 1fr); }
.sidebar-main { container: main / inline-size; min-width: 0; }
.sidebar-content { width: calc(100% - 64px); max-width: 1440px; margin-inline: auto; }
.sidebar-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; }
@container main (width >= 600px) { .sidebar-grid { grid-template-columns: repeat(8, minmax(0, 1fr)); } }
@container main (width >= 1200px) { .sidebar-grid { grid-template-columns: repeat(12, minmax(0, 1fr)); } }
@media (768px <= width < 1200px) {
  .sidebar-layout { grid-template-columns: 72px minmax(0, 1fr); }
  .sidebar-content { width: calc(100% - 48px); }
}
@media (width < 768px) {
  .sidebar-layout { grid-template-columns: minmax(0, 1fr); }
  .sidebar-content { width: calc(100% - 32px); }
  .sidebar { display: none; }
  .drawer { width: min(280px, calc(100vw - 48px)); }
}`

function Layout() {
  const { t } = useLocale()

  const [preset, setPreset] = useState<'Standard' | 'Sidebar'>('Standard')
  const [viewport, setViewport] = useState(1440)
  const row = layoutPresets[preset].find(row => row[0] === viewport)!
  const sidebar = preset === 'Sidebar' ? row[1] : 0
  const columns = preset === 'Standard' ? row[1] : row[5]
  const content = preset === 'Standard' ? row[2] : row[3]
  return <><Section title="Presets"><div className="foundation-layout-controls"><div className="foundation-segmented" aria-label={t("布局类型")}>{(['Standard','Sidebar'] as const).map(name => <button type="button" key={name} aria-pressed={preset === name} onClick={() => setPreset(name)}>{name}</button>)}</div><select aria-label={t("参考宽度")} value={viewport} onChange={event => setViewport(Number(event.target.value))}>{[1920,1440,768,390].map(width => <option value={width} key={width}>{width} px</option>)}</select></div>
      <div className={`foundation-layout-demo ${viewport < 768 ? 'is-phone' : ''}`}><div className="foundation-layout-header">{t("Logo")}</div><div className="foundation-layout-body">{sidebar > 0 ? <aside style={{ width: `${sidebar / viewport * 100}%` }}>{sidebar === 72 ? '☰' : 'Navigation'}</aside> : null}<div className="foundation-layout-main"><div className="foundation-layout-columns" style={{ width: `${content / (viewport - sidebar) * 100}%`, gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, columnGap: `${16 / content * 100}%` }}>{Array.from({length:columns},(_,index) => <span key={index} />)}</div></div></div></div>
      <div className="foundation-metrics"><span>{columns} {t('Columns').toLowerCase()}</span><span>{t("Content")} {content} px</span><span>Gutter 16 px</span>{preset === 'Sidebar' ? <span>{sidebar ? `Sidebar ${sidebar} px` : 'Drawer'}</span> : null}</div></Section>
    <Section title={t("规格")}><Specs columns={preset === 'Standard' ? [t('视口'),t('列数'),t('内容'),t('边距'),'Gutter'] : [t('视口'),t('侧栏'),t('主区域'),t('内容'),t('留白'),t('列数')]} rows={layoutPresets[preset]} /><details className="component-details"><summary>{t("响应区间")}</summary><Specs columns={[t('视口'),'Standard','Sidebar']} rows={[
      ['≥ 1200',t('12 列 · 48 px'),'256 px · 32 px'],['768–1199',t('8 列 · 32 px'),'72 px · 24 px'],['< 768',t('4 列 · 16 px'),'Drawer · 16 px'],['Drawer','—','min(280 px, 100vw − 48 px)'],[t('Sidebar 内容列数'),'—','主区域 ≥1200 / ≥600 / <600 → 12 / 8 / 4'],
    ]} /></details><Code code={preset === 'Standard' ? layoutCSS : sidebarCSS} /></Section></>
}
function Icon({ name, size = 24 }: { name: string; size?: number }) {
  const Svg = slatexIcons[name as keyof typeof slatexIcons]
  return Svg ? <Svg size={size} strokeWidth={2} aria-hidden="true" /> : null
}
function Icons({ theme }: { theme: Theme }) {
  const { t } = useLocale()

  const [copied, setCopied] = useState('')
  async function copy(name: string) { try { await navigator.clipboard.writeText(`Icon/${name}`); setCopied(name) } catch { setCopied('') } }
  return <><Section title="Lucide"><div className="foundation-icon-grid">{Object.keys(slatexIcons).map(name => ({name})).map(icon => <button type="button" key={icon.name} onClick={() => copy(icon.name)} aria-label={`${t('Copy')} Icon/${icon.name}`} title={`Icon/${icon.name}`}><Icon name={icon.name} /><span>{copied === icon.name ? t('已复制') : icon.name}</span></button>)}</div></Section>
    <Section title={t("尺寸与配置")}><div className="foundation-icon-sizes">{[16,20,24,32].map(size => <div key={size}><Icon name="search" size={size} /><span>{size} px</span></div>)}</div><div className="foundation-icon-text"><Icon name="search" size={16} /><span>Search 搜索</span><code>14 / 20 · gap 4</code></div></Section>
    <Section title="Media"><details className="component-details"><summary>40 brands · Mono / Color</summary>{['AI','Social'].map(group => <div className="foundation-media-group" key={group}><h3>{group}</h3><div className="foundation-media-grid">{iconLibrary.media.filter(icon => icon.group === group).map(icon => <div key={icon.slug}><div><span className="foundation-icon" aria-hidden="true" style={{maskImage:`url('${import.meta.env.BASE_URL}icons/media/${icon.slug}-mono.svg')`}} />{!icon.monochrome ? <img src={`${import.meta.env.BASE_URL}icons/media/${icon.slug}-color${theme === 'dark' && ['kimi','tiktok'].includes(icon.slug) ? '-dark' : ''}.svg`} width="24" height="24" alt="" /> : null}</div><CopyButton value={`Icon/${icon.slug}-mono`} label={icon.name} /></div>)}</div></div>)}</details></Section>
    <Section title={t("资源")}><a className="source-link" href={`${import.meta.env.BASE_URL}icons/slatex-lucide.svg.zip`} download>Lucide · 80 SVG ↗</a><details className="component-details"><summary>{t("来源")}</summary><div className="foundation-source-list"><a href="https://lucide.dev/icons" target="_blank" rel="noreferrer">Lucide ↗</a><a href="https://github.com/lobehub/lobe-icons" target="_blank" rel="noreferrer">Lobe Icons 1.95.1 ↗</a><a href="https://github.com/pheralb/svgl" target="_blank" rel="noreferrer">SVGL ↗</a><a href="https://github.com/simple-icons/simple-icons" target="_blank" rel="noreferrer">Simple Icons 16.33.0 ↗</a></div></details></Section></>
}
function Effects() {
  return <><Section title="Elevation"><div className="foundation-elevation-grid">{foundationSource.effects.map(style => {
    const shadow = style.effects.map(effect => `${effect.offset.x}px ${effect.offset.y}px ${effect.radius}px ${effect.spread}px rgb(0 0 0 / ${Math.round(effect.color.a * 100)}%)`).join(', ')
    return <div className="foundation-elevation-item" key={style.name}><div style={{boxShadow:shadow}} /><CopyButton value={`box-shadow: ${shadow};`} label={style.name} /></div>
  })}</div></Section><Section title="Overlay"><ThemeTable tokens={themeTokens.filter(token => token.name === 'overlay/scrim')} /></Section><Section title="CSS"><Code code={".popover {\n  box-shadow: 0 1px 2px rgb(0 0 0 / 6%),\n    0 4px 12px -2px rgb(0 0 0 / 6%);\n}"} /></Section></>
}
function Contrast() {
  const { t } = useLocale()

  const { tokens: themeTokens } = useBrandTheme()
  return <><Section title={t("前景 / 背景")}><Specs columns={[t('配对'),'Light','Dark']} rows={contrastPairs.map(([foreground,background]) => {
    const front=themeTokens.find(token => token.name===foreground)!, back=themeTokens.find(token => token.name===background)!
    return [<div key="pair" className="foundation-pair-name"><code>{foreground}</code><code>{background}</code></div>, ...(['light','dark'] as const).map(mode => {
      const fg=mode==='light'?front.value:front.darkValue,bg=mode==='light'?back.value:back.darkValue, ratio=contrastRatio(fg,bg)
      return <div key={mode} className="foundation-contrast-cell"><span style={{color:fg,background:bg}}>Aa</span><strong>{ratio.toFixed(2)}:1</strong><span className={ratio >= 4.5 ? 'contrast-pass' : 'contrast-fail'}>{ratio >= 4.5 ? <Check size={14} aria-label={t("满足普通文字对比度")} /> : t('低于 4.5')}</span></div>
    })]
  })} /></Section><Section title={t("门槛")}><Specs columns={[t('内容'),t('对比度')]} rows={[
    [t('普通文字'),'4.5:1'],[t('大字号文字 · 24 px / 18.67 px Bold'),'3:1'],[t('必要控件边界 / 图形'),'3:1'],
  ]} /><a className="source-link" href="https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html" target="_blank" rel="noreferrer">WCAG 2.2 · Contrast ↗</a></Section></>
}
function Accessibility() {
  const { t } = useLocale()

  return <><Section title="WCAG 2.2 AA"><Specs columns={[t('检查项'),t('规格')]} rows={[
    [t('普通文字 / 大字号'),'4.5:1 / 3:1'],[t('必要控件边界'),'3:1'],[t('点击目标'),t('≥ 24 × 24 CSS px（或满足间距例外）')],[t('移动主要操作'),t('建议 ≥ 44 × 44 px')],[t('重排'),'320 CSS px'],[t('文字缩放'),'200%'],[t('焦点样本'),t('2 px + 2 px；不被遮挡')],
  ]} /></Section><Section title="Keyboard"><Specs columns={[t('操作'),t('按键')]} rows={[
    [t('移动焦点'),'Tab / Shift+Tab'],[t('触发'),'Enter / Space'],[t('关闭浮层'),'Escape'],['Modal',t('焦点进入、限制、关闭后返回')],
  ]} /></Section><Section title={t("交付检查")}><details className="component-details"><summary>{t("检查清单")}</summary><ul className="foundation-checklist">{[t('Light / Dark 与实际背景'),t('标签、必填与错误关联'),t('图标按钮名称与图片替代文本'),t('动态状态播报'),t('长文本与 320 px 重排'),t('200% 文字缩放'),t('键盘与屏幕阅读器')].map(item => <li key={item}>{item}</li>)}</ul></details><a className="source-link" href="https://www.w3.org/WAI/WCAG22/quickref/" target="_blank" rel="noreferrer">WCAG 2.2 ↗</a></Section></>
}
function Naming() {
  const { t } = useLocale()

  return <><Section title="Names"><Specs columns={[t('对象'),t('命名')]} rows={[
    [t('基础色'),'neutral/600'],[t('主题色'),'text/secondary · brand/on-solid'],[t('间距 / 圆角'),'space/16 · radius/12'],[t('文字样式'),'Text/14/Medium'],[t('图标'),'Icon/search'],[t('组件属性'),'Type / Size / State / Shape / Content'],
  ]} /></Section><Section title="Bindings"><Specs columns={[t('属性'),t('来源')]} rows={[
    [t('颜色'),'02 · Theme · Color · Light / Dark'],[t('字号 / 行高 / 字距'),t('Text 样式')],[t('间距 / 圆角'),'03 · Dimension'],[t('组件尺寸'),t('组件自身规格')],[t('项目复制'),t('变量 + 文字样式 + 主组件依赖')],
  ]} /></Section></>
}
export function FoundationPage({ id, theme, onNavigate }: { id: string; theme: Theme; onNavigate: (id: string) => void }) {
  const { t } = useLocale()

  const { css } = useBrandTheme()
  const [downloadError, setDownloadError] = useState(false)
  async function downloadTokens() {
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}tokens/slatex.css`)
      if (!response.ok) throw new Error('Token download failed')
      const url = URL.createObjectURL(new Blob([await response.text(), '\n', css], { type: 'text/css' }))
      const link = document.createElement('a')
      link.href = url; link.download = 'slatex.css'; link.click()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
      setDownloadError(false)
    } catch { setDownloadError(true) }
  }
  const page=foundationPages[id]
  let content: ReactNode
  switch(id) {
    case 'colors': content=<Colors onNavigate={onNavigate} />;break
    case 'colors-primitives': content=<Primitives />;break
    case 'colors-semantic': content=<ThemeColors />;break
    case 'colors-accessibility': content=<Contrast />;break
    case 'typography': content=<Typography />;break
    case 'spacing': content=<Spacing />;break
    case 'radius': content=<Radius />;break
    case 'border': content=<Border />;break
    case 'grid-layout': content=<Layout />;break
    case 'iconography': content=<Icons theme={theme} />;break
    case 'effects': content=<Effects />;break
    case 'accessibility': content=<Accessibility />;break
    case 'naming': content=<Naming />;break
  }
  return <div className="foundation-document"><header className="page-header"><div className="page-meta-row"><h1>{t(page.title)}</h1></div><div className="foundation-header-links"><a className="source-link" href={`${siteConfig.figmaUrl.split('?')[0]}?node-id=${page.node}`} target="_blank" rel="noreferrer">Figma ↗</a><a className="source-link" href={`${import.meta.env.BASE_URL}tokens/slatex.css`} download onClick={event => { event.preventDefault(); void downloadTokens() }}>Tokens CSS ↗</a>{downloadError && <span role="alert">{t("下载失败，请重试")}</span>}</div></header>{content}</div>
}
export function FigmaLibraryPreview({ theme }: { theme: Theme }) {
  const { t } = useLocale()

  const [expanded, setExpanded] = useState(false)
  const embed=`https://embed.figma.com/design/${foundationSource.fileKey}?embed-host=slatex&node-id=124-216&theme=${theme}`
  return <section className={`figma-preview ${expanded ? 'is-expanded' : ''}`} aria-label={t("Figma 文件预览")}><div className="figma-preview-toolbar"><strong>{siteConfig.name}</strong><div><button className="icon-button" type="button" onClick={() => setExpanded(!expanded)} aria-expanded={expanded} aria-controls="figma-file-preview" aria-label={expanded ? t('收起预览') : t('展开预览')}>{expanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}</button><a className="icon-button" href={siteConfig.figmaUrl} target="_blank" rel="noreferrer" aria-label={t("在 Figma 中打开文件")}><ExternalLink size={18} /></a></div></div><iframe id="figma-file-preview" title={t("SlateX Design System · Figma 文件预览")} src={embed} allowFullScreen /></section>
}
