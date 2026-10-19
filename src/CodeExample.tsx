import { useLocale } from './locale-context'
import { useState } from 'react'
import { componentArchive } from './component-library'
import { translateCode } from './translations'

export function ExampleCode({ children, components = ['SlateXButton'], icons = [], hooks = [], setup = '' }: { children: string; components?: string[]; icons?: string[]; hooks?: string[]; setup?: string }) {
  const { t, locale } = useLocale()

  const [copyState, setCopyState] = useState('复制')
  const imports = locale === 'zh' ? [...components, 'SlateXLocaleProvider'] : components
  const wrapper = locale === 'zh' ? 'SlateXLocaleProvider locale="zh"' : ''
  const body = translateCode(children, locale)
  const initialization = translateCode(setup, locale)
  const code = `${hooks.length ? `import { ${hooks.join(', ')} } from 'react'\n` : ''}import { ${imports.join(', ')} } from '@slatex/react'\nimport '@slatex/react/styles.css'\n${icons.length ? `import { ${icons.join(', ')} } from 'lucide-react'\n` : ''}\nexport function ComponentExample() {\n${initialization ? initialization.split('\n').map(line => `  ${line}`).join('\n') + '\n' : ''}  return (\n    <${wrapper}>\n${body.split('\n').map(line => line ? `      ${line}` : '').join('\n')}\n    </${locale === 'zh' ? 'SlateXLocaleProvider' : ''}>\n  )\n}`
  async function copy() {
    try { await navigator.clipboard.writeText(code); setCopyState('已复制') }
    catch { setCopyState('复制失败') }
  }
  return <details className="example-code" onToggle={() => setCopyState('复制')}><summary>{t("查看代码")}</summary><div className="code-actions"><button type="button" onClick={copy} aria-live="polite">{t(copyState)}</button></div><pre><code>{code}</code></pre></details>
}
export function PackageInstall() {
  const { t } = useLocale()

  return <details className="component-details"><summary>{t("接入 · React")}</summary><pre className="install-code"><code>{`npm install ./${componentArchive}`}</code></pre><a className="source-link" href={`${import.meta.env.BASE_URL}packages/${componentArchive}`} download>{t("下载组件包 ↗")}</a></details>
}
