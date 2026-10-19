import { useLocale } from './locale-context'
import { Plus } from 'lucide-react'
import { ExampleCode, PackageInstall } from './CodeExample'
import { componentLibrary } from './component-library'
import { SlateXButton, type ButtonKind, type ButtonSize, type ButtonState } from '@slatex/react'

const kinds: ButtonKind[] = ['Primary','Neutral','Secondary','Tertiary','Danger']
const states: ButtonState[] = ['Default','Hover','Pressed','Loading','Disabled']
const sizeSpecs = [
 { name: 'Tiny', height: 24, font: 12, line: 16, padding: 8, icon: 14, radius: 9999 },
 { name: 'Small', height: 32, font: 14, line: 20, padding: 12, icon: 16, radius: 9999 },
 { name: 'Medium', height: 40, font: 14, line: 20, padding: 16, icon: 16, radius: 9999 },
 { name: 'Large', height: 48, font: 16, line: 24, padding: 20, icon: 16, radius: 9999 },
] satisfies Array<{ name: ButtonSize; height: number; font: number; line: number; padding: number; icon: number; radius: number }>
const components = ['Button', ...componentLibrary.map(component => component.name)]
export function ComponentsPage({embedded=false}:{embedded?:boolean}) {
  const { t } = useLocale()

 return <>{!embedded&&<header className="page-header"><h1>{t("Components")}</h1></header>}<div className="component-catalog" id="component-index">{components.map((name,i)=><a href={`#/${name.toLowerCase()}`} className="catalog-row" key={name}><span className="catalog-number">{String(i+1).padStart(2,'0')}</span><strong>{name}</strong><span aria-hidden="true">↗</span></a>)}</div></>
}
function Section({index,title,children}:{index:number;title:string;children:React.ReactNode}) {return <section className="doc-section" id={`button-${index}`}><h2>{title}</h2>{children}</section>}
export function ButtonPage() {
  const { t } = useLocale()

 return <div className="component-document">
  <header className="page-header">
   <div className="page-meta-row"><h1>Button</h1></div>
   <a className="source-link" href="https://www.figma.com/design/JsOdWljwN8c1Fnbp3cdOXH/SlateX-Design-System?node-id=284-6402" target="_blank" rel="noreferrer">Figma ↗</a>
  </header>
  <Section index={0} title={t("类型")}>
   <div className="type-examples">{kinds.map((kind, i) => <div className="type-example" key={kind}>
    <div className="example-stage"><SlateXButton kind={kind}>{t(['Continue','Create project','Cancel','Learn more','Delete'][i])}</SlateXButton></div>
    <strong>{kind}</strong>
   </div>)}</div>
   <ExampleCode>{'<SlateXButton>Continue</SlateXButton>\n<SlateXButton kind="Neutral">Create project</SlateXButton>\n<SlateXButton kind="Secondary">Cancel</SlateXButton>\n<SlateXButton kind="Tertiary">Learn more</SlateXButton>\n<SlateXButton kind="Danger">Delete</SlateXButton>'}</ExampleCode>
  </Section>
  <Section index={1} title={t("尺寸与配置")}>
   <div className="size-examples">{sizeSpecs.map(spec => <div className="size-example" key={spec.name}>
    <div className="example-stage"><SlateXButton size={spec.name}>{spec.name}</SlateXButton></div>
    <strong>{spec.name}</strong><span>{t('H')} {spec.height} px · {t('Font')} {spec.font} px</span>
   </div>)}</div>
   <div className="configuration-examples">
    <div><SlateXButton pill>Pill</SlateXButton></div>
    <div><SlateXButton icon aria-label={t("添加项目")}><Plus /></SlateXButton></div>
    <div><SlateXButton><Plus/>{t("Add item")}</SlateXButton></div>
    <div><SlateXButton>{t("Add item")}<Plus/></SlateXButton></div>
   </div>
   <ExampleCode icons={['Plus']}>{'<SlateXButton size="Tiny">Tiny</SlateXButton>\n<SlateXButton size="Small">Small</SlateXButton>\n<SlateXButton>Medium</SlateXButton>\n<SlateXButton size="Large">Large</SlateXButton>\n\n<SlateXButton pill>Pill</SlateXButton>\n<SlateXButton icon aria-label="添加项目"><Plus /></SlateXButton>\n<SlateXButton><Plus />Add item</SlateXButton>\n<SlateXButton>Add item<Plus /></SlateXButton>'}</ExampleCode>
  </Section>
  <Section index={2} title={t("状态与行为")}>
   <div className="behavior-examples">
    <div><SlateXButton loading>Loading</SlateXButton></div>
    <div><SlateXButton disabled>Disabled</SlateXButton></div>
   </div>
   <ExampleCode>{'<SlateXButton loading>Loading</SlateXButton>\n<SlateXButton disabled>Disabled</SlateXButton>'}</ExampleCode>
   <details className="component-details"><summary>{t("全部状态")}</summary>
    <div className="matrix-scroll" tabIndex={0} aria-label={t("按钮状态对照表，可横向滚动")}><table className="state-matrix" inert><thead><tr><th scope="col">Type</th>{states.map(s => <th scope="col" key={s}>{s}</th>)}</tr></thead><tbody>{kinds.map(kind => <tr key={kind}><th scope="row">{kind}</th>{states.map(state => <td key={state}><SlateXButton kind={kind} size="Small" state={state}>Button</SlateXButton></td>)}</tr>)}</tbody></table></div>
   </details>
  </Section>
  <Section index={3} title={t("实现参考")}>
   <PackageInstall />
   <details className="component-details"><summary>{t("属性对照")}</summary>
    <div className="spec-scroll" tabIndex={0} aria-label={t("按钮属性对照表，可横向滚动")}><table className="component-table"><thead><tr><th scope="col">{t("属性")}</th><th scope="col">{t("选项 / 类型")}</th><th scope="col">{t("默认值")}</th><th scope="col">{t("Figma 对应项")}</th></tr></thead><tbody>
     <tr><th scope="row">kind</th><td>Primary / Neutral / Secondary / Tertiary / Danger</td><td>Primary</td><td>Type</td></tr>
     <tr><th scope="row">size</th><td>Tiny / Small / Medium / Large</td><td>Medium</td><td>{t("Size")}</td></tr>
     <tr><th scope="row">loading / disabled</th><td>boolean</td><td>false</td><td>State = Loading / Disabled</td></tr>
     <tr><th scope="row">state</th><td>Default / Hover / Pressed / Loading / Disabled</td><td>{t("Default")}</td><td>{t("State · 固定预览")}</td></tr>
     <tr><th scope="row">pill</th><td>boolean</td><td>true</td><td>Shape = Pill</td></tr>
     <tr><th scope="row">icon</th><td>boolean</td><td>false</td><td>Content = Icon</td></tr>
     <tr><th scope="row">children</th><td>ReactNode</td><td>Button</td><td>{t("标签 / 任意图标")}</td></tr>
     <tr><th scope="row">aria-label</th><td>string</td><td>—</td><td>{t("纯图标名称")}</td></tr>
     <tr><th scope="row">onClick</th><td>MouseEventHandler</td><td>—</td><td>—</td></tr>
     <tr><th scope="row">type</th><td>button / submit / reset</td><td>button</td><td>—</td></tr>
     <tr><th scope="row">ref / className / style</th><td>{t("原生 button 属性")}</td><td>—</td><td>—</td></tr>
    </tbody></table></div>
   </details>
   <details className="component-details"><summary>{t("数值规格")}</summary>
    <div className="spec-scroll" tabIndex={0} aria-label={t("按钮数值规格表，可横向滚动")}><table className="component-table"><thead><tr>{['Size',t('高度'),t('字号 / 行高'),t('内边距'),t('图标'),t('圆角')].map(label => <th scope="col" key={label}>{t(label)}</th>)}</tr></thead><tbody>{sizeSpecs.map(spec => <tr key={spec.name}><th scope="row">{spec.name}</th><td>{spec.height}</td><td>{spec.font} / {spec.line}</td><td>{spec.padding}</td><td>{spec.icon}</td><td>{spec.radius}</td></tr>)}</tbody></table></div>

    <dl className="spec-facts">{[[t('字重'),'500'],[t('图文间距'),'4 px'],[t('Pill 圆角'),'9999 px'],[t('主次间距'),'8 px'],[t('触屏尺寸'),'48 px'],[t('按压反馈'),'0.97 → 1.012 → 1 · 200 ms']].map(([label,value]) => <div key={label}><dt>{t(label)}</dt><dd>{value}</dd></div>)}</dl>
   </details>
   <details className="component-details"><summary>{t("主题映射")}</summary>
    <div className="spec-scroll" tabIndex={0} aria-label={t("按钮主题映射表，可横向滚动")}><table className="component-table"><thead><tr><th scope="col">Type</th><th scope="col">{t("背景")}</th><th scope="col">{t("前景")}</th><th scope="col">Hover</th><th scope="col">Pressed</th><th scope="col">{t("描边")}</th></tr></thead><tbody>
     <tr><th scope="row">Primary</th><td>brand/solid</td><td>brand/on-solid</td><td>brand/8</td><td>{t("brand/pressed")}</td><td>—</td></tr>
     <tr><th scope="row">Neutral</th><td>neutral/7</td><td>neutral/on-solid</td><td>neutral/8</td><td>{t("neutral/8 + 12% 黑色")}</td><td>—</td></tr>
     <tr><th scope="row">Secondary</th><td>neutral/1</td><td>text/primary</td><td>neutral/2</td><td>neutral/3</td><td>1 px · default / hover / strong</td></tr>
     <tr><th scope="row">Tertiary</th><td>{t("透明")}</td><td>text/primary</td><td>neutral/1</td><td>neutral/2</td><td>—</td></tr>
     <tr><th scope="row">Danger</th><td>red/7</td><td>red/on-solid</td><td>red/8</td><td>{t("red/8 + 12% 黑色")}</td><td>—</td></tr>
     <tr><th scope="row">Disabled</th><td>{t("neutral/1（Tertiary：透明）")}</td><td>text/disabled</td><td>—</td><td>—</td><td>Secondary：border/default</td></tr>
    </tbody></table></div>
   </details>
  </Section>
 </div>
}
