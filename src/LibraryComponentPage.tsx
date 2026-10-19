import { useLocale } from './locale-context'
import { ExampleCode, PackageInstall } from './CodeExample'
import { ComponentPreview } from './ComponentExamples'
import { componentCode } from './ComponentCode'
import type { ComponentDefinition } from './component-library'
import { componentMotion } from './component-library'
export function LibraryComponentPage({ component }: { component: ComponentDefinition }) {
  const { t } = useLocale()

  const passive = ['tag','badge','avatar'].includes(component.id)
  const states = componentCode(component.id, 'states')
  return <div className="component-document">
    <header className="page-header"><div className="page-meta-row"><h1>{component.name}</h1></div><a className="source-link" href={`https://www.figma.com/design/JsOdWljwN8c1Fnbp3cdOXH/SlateX-Design-System?node-id=${component.node}`} target="_blank" rel="noreferrer">Figma ↗</a></header>
    <section className="doc-section" id={`${component.id}-examples`}><h2>{passive ? t('类型') : t('示例')}</h2><div className="component-main-preview"><ComponentPreview id={component.id} mode="main" /></div><ExampleCode {...componentCode(component.id,'main')} /></section>
    <section className="doc-section" id={`${component.id}-configuration`}><h2>{t("尺寸与配置")}</h2><ComponentPreview id={component.id} mode="sizes" /><ExampleCode {...componentCode(component.id,'sizes')} /></section>
    <section className="doc-section" id={`${component.id}-states`}><h2>{passive ? t('配置') : t('状态与行为')}</h2>
      {['input','textarea','composer'].includes(component.id) ? <details className="component-details"><summary>{t("全部状态")}</summary><ComponentPreview id={component.id} mode="states" /></details> : <ComponentPreview id={component.id} mode="states" />}
      <ExampleCode {...states} />
    </section>
    <section className="doc-section" id={`${component.id}-reference`}><h2>{t("实现参考")}</h2><PackageInstall />
      <details className="component-details"><summary>{t("属性对照")}</summary><div className="spec-scroll" tabIndex={0} aria-label={`${component.name} ${t('Props')}`}><table className="component-table"><thead><tr>{[t('属性'),t('类型 / 选项'),t('默认值')].map(label => <th scope="col" key={label}>{t(label)}</th>)}</tr></thead><tbody>{component.api.map(([property,type,value]) => <tr key={property}><th scope="row">{property}</th><td>{t(type)}</td><td>{t(value)}</td></tr>)}</tbody></table></div></details>
      <details className="component-details"><summary>{t("数值规格 · px")}</summary><div className="spec-scroll" tabIndex={0} aria-label={`${component.name} ${t('Specifications')}`}><table className="component-table"><thead><tr>{component.columns.map(column => <th scope="col" key={column}>{t(column)}</th>)}</tr></thead><tbody>{component.specs.map((row,index) => <tr key={index}>{row.map((value,i) => i === 0 ? <th scope="row" key={i}>{t(value)}</th> : <td key={i}>{t(value)}</td>)}</tr>)}</tbody></table></div></details>
      {componentMotion[component.id] ? <details className="component-details"><summary>Motion</summary><table className="component-table"><tbody>{componentMotion[component.id].map(([name,value]) => <tr key={name}><th scope="row">{name}</th><td>{value}</td></tr>)}</tbody></table></details> : null}
    </section>
  </div>
}
