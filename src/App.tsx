import { useLocale } from './locale-context'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Presence } from '@radix-ui/react-presence'
import {
  ArrowLeft,
  ArrowRight,
  Command,
  ExternalLink,
  Menu,
  Moon,
  Search,
  Sun,
  X,
} from 'lucide-react'
import {
  navigation,
  siteConfig,
  type NavigationItem,
  type PageStatus,
} from './content'
import './App.css'
import { ButtonPage, ComponentsPage } from './ButtonPage'
import { LibraryComponentPage } from './LibraryComponentPage'
import { componentLibrary } from './component-library'
import { FoundationPage, FigmaLibraryPreview } from './FoundationPages'
import { foundationPages } from './foundations'
import { BrandThemeProvider } from './BrandTheme'
import { BrandPicker } from './BrandPicker'
import '@slatex/react/styles.css'
import './master.css'

type Theme = 'light' | 'dark'
const allItems = navigation
  .flatMap((group) => group.items)
  .filter((item, index, items) => items.findIndex((entry) => entry.id === item.id) === index)
const readRoute = () => window.location.hash.replace(/^#\/?/, '') || 'overview'

function App() {
  const [route, setRoute] = useState(readRoute)
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = window.localStorage.getItem('slatex-theme')
    if (saved === 'light' || saved === 'dark') return saved
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })
  const [searchOpen, setSearchOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [drawerMode, setDrawerMode] = useState(() => !window.matchMedia('(min-width: 1200px)').matches)

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1200px)')
    const closeOnDesktop = () => { setDrawerMode(!desktop.matches); if (desktop.matches) setSidebarOpen(false) }
    desktop.addEventListener('change', closeOnDesktop)
    return () => desktop.removeEventListener('change', closeOnDesktop)
  }, [])

  useEffect(() => {
    const onHashChange = () => {
      setRoute(readRoute())
      setSidebarOpen(false)
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem('slatex-theme', theme)
  }, [theme])

  useEffect(() => {
    document.title = siteConfig.name
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setSidebarOpen(false)
        setSearchOpen(true)
      }
      if (event.key === 'Escape') {
        setSearchOpen(false)
        setSidebarOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const currentIndex = allItems.findIndex((item) => item.id === route)
  const currentItem = allItems[currentIndex] ?? allItems[0]
  const navigate = (id: string) => { window.location.hash = `/${id}` }

  return (
    <BrandThemeProvider mode={theme}>
    <div className="app-shell">
      <Topbar
        theme={theme}
        onThemeChange={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        onSearch={() => { setSidebarOpen(false); setSearchOpen(true) }}
        onMenu={() => setSidebarOpen(true)}
        menuOpen={sidebarOpen}
      />
      <Sidebar
        activeId={currentItem.id}
        open={sidebarOpen}
        drawerMode={drawerMode}
        onClose={() => setSidebarOpen(false)}
        onNavigate={navigate}
      />
      <main className="main-area" inert={sidebarOpen}>
        <div className="content-grid">
          <article className="document">
            <Page current={currentItem} onNavigate={navigate} theme={theme} />
            <PagePager
              previous={allItems[currentIndex - 1]}
              next={allItems[currentIndex + 1]}
              onNavigate={navigate}
            />
          </article>
        </div>
      </main>
        <SearchDialog open={searchOpen}
          onClose={() => setSearchOpen(false)}
          onNavigate={(id) => {
            navigate(id)
            setSearchOpen(false)
          }}
        />
    </div>
    </BrandThemeProvider>
  )
}

function Topbar({
  theme,
  onThemeChange,
  onSearch,
  onMenu,
  menuOpen,
}: {
  theme: Theme
  onThemeChange: () => void
  onSearch: () => void
  onMenu: () => void
  menuOpen: boolean
}) {
  const { t, locale, setLocale } = useLocale()

  return (
    <header className="topbar">
      <div className="brand-lockup">
        <button className="icon-button menu-button" onClick={onMenu} aria-label={t("打开导航")} aria-expanded={menuOpen} aria-controls="site-navigation"><Menu size={19} /></button>
        <a className="brand" href="#/overview" aria-label={`${siteConfig.name} · ${t('Home')}`}>
          <span className="brand-mark" aria-hidden="true">S</span>
          <span>{siteConfig.name}</span>
        </a>
        <span className="version-chip">{siteConfig.version}</span>
      </div>
      <div className="topbar-actions">
        <button className="search-trigger" onClick={onSearch} aria-label={t('Search docs')}>
          <Search size={17} />
          <span>{t("搜索规范")}</span>
          <kbd><Command size={12} />K</kbd>
        </button>
        <button className="language-button" type="button" onClick={() => setLocale(locale === 'en' ? 'zh' : 'en')} aria-label={locale === 'en' ? 'Switch to Chinese' : '切换为英文'} title={locale === 'en' ? '中文' : 'English'}>{locale === 'en' ? 'EN' : '中文'}</button>
        <BrandPicker />
        <button className="icon-button" onClick={onThemeChange} aria-label={t("切换明暗模式")}>
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        <a className="icon-button" href={siteConfig.figmaUrl} target="_blank" rel="noreferrer" aria-label={t("在 Figma 中打开")}>
          <ExternalLink size={18} />
        </a>
      </div>
    </header>
  )
}

function Sidebar({
  activeId,
  open,
  drawerMode,
  onClose,
  onNavigate,
}: {
  activeId: string
  open: boolean
  drawerMode: boolean
  onClose: () => void
  onNavigate: (id: string) => void
}) {
  const { t } = useLocale()

  const navRef = useRef<HTMLElement>(null)
  useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement | null
    navRef.current?.querySelector<HTMLButtonElement>('.sidebar-mobile-head button')?.focus()
    const trap = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return
      const items = Array.from(navRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]') ?? [])
      const first = items[0], last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
    }
    document.querySelector('.topbar')?.setAttribute('inert', '')
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', trap)
    return () => {
      document.removeEventListener('keydown', trap)
      document.querySelector('.topbar')?.removeAttribute('inert')
      document.body.style.overflow = previousOverflow
      previous?.focus()
    }
  }, [open])
  return (
    <>
      <Presence present={open}><button className="sidebar-scrim" data-state={open ? 'open' : 'closed'} inert={!open} onClick={onClose} aria-label={t("关闭导航")} tabIndex={-1} /></Presence>
      <aside ref={navRef} id="site-navigation" inert={drawerMode && !open} className={`sidebar ${open ? 'is-open' : ''}`} role={open ? 'dialog' : undefined} aria-modal={open || undefined} aria-label={t('Navigation')}>
        <div className="sidebar-mobile-head">
          <span>{t("目录")}</span>
          <button className="icon-button" onClick={onClose} aria-label={t("关闭导航")}><X size={18} /></button>
        </div>
        <nav aria-label={t("设计系统目录")}>
          {navigation.map((group) => (
            <div className="nav-group" key={group.label}>
              <p className="nav-group-label">{t(group.label)}</p>
              <div className="nav-list">
                {group.items.map((item, index) => (
                  <button
                    key={`${item.id}-${index}`}
                    className={`nav-item ${activeId === item.id ? 'is-active' : ''} level-${item.level ?? 0}`}
                    title={t(item.label)}
                    onClick={() => { onNavigate(item.id); onClose() }}
                    aria-current={activeId === item.id ? 'page' : undefined}
                  >
                    <span>{t(item.label)}</span>
                    {item.status !== 'stable' && <StatusDot status={item.status} />}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>
        <div className="sidebar-footer"><span>{t("Last updated")}</span><strong>{siteConfig.updatedAt}</strong></div>
      </aside>
    </>
  )
}

function StatusDot({ status }: { status: PageStatus }) {
  const { t } = useLocale()
  if (status === 'review') return null
  return <span className={`status-dot status-${status}`} title={t(statusLabel(status))} aria-label={t(statusLabel(status))} />
}

function StatusBadge({ status }: { status: PageStatus }) {
  const { t } = useLocale()
  if (status === 'review') return null
  return <span className={`status-badge status-${status}`}>{t(statusLabel(status))}</span>
}

function statusLabel(status: PageStatus) {
  return ({ stable: 'Stable', draft: 'Draft', review: 'Review', planned: 'Planned', deprecated: 'Deprecated' })[status]
}

function Page({ current, onNavigate, theme }: { current: NavigationItem; onNavigate: (id: string) => void; theme: Theme }) {
  if (foundationPages[current.id]) return <FoundationPage key={current.id} id={current.id} theme={theme} onNavigate={onNavigate} />
  const component = componentLibrary.find(component => component.id === current.id)
  if (component) return <LibraryComponentPage key={component.id} component={component} />
  switch (current.id) {
    case 'button': return <ButtonPage />
    case 'components': return <ComponentsPage />
    case 'overview': return <OverviewPage onNavigate={onNavigate} />
    case 'principles': return <PrinciplesPage />
    case 'status-versioning': return <StatusPage />
    case 'figma-library': return <FigmaPage theme={theme} />
    default: return <PlannedPage item={current} />
  }
}

function PageHeader({ title, status }: { title: string; status: PageStatus }) {
  const { t } = useLocale()
  return <header className="page-header"><div className="page-meta-row"><h1>{t(title)}</h1><StatusBadge status={status} /></div></header>
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  const { t } = useLocale()
  return <section className="doc-section" id={id}><h2>{t(title)}</h2>{children}</section>
}

function OverviewPage({ onNavigate }: { onNavigate: (id: string) => void }) {
  const { t } = useLocale()
  return <><PageHeader title="SlateX Design System" status="review" /><Section id="component-entry" title="Components"><ComponentsPage embedded /></Section><Section id="foundation-entry" title="Foundations"><div className="feature-list">{[['colors','Colors'],['typography','Typography'],['spacing','Spacing'],['radius','Radius'],['grid-layout','Grid & Layout'],['iconography','Iconography'],['accessibility','Accessibility']].map(([id,label]) => <button className="feature-row" key={id} onClick={() => onNavigate(id)}><span><strong>{t(label)}</strong></span><ArrowRight size={18}/></button>)}</div></Section></>
}


function PrinciplesPage() {
  const { t } = useLocale()

  return (
    <>
      <PageHeader title="Design Principles" status="draft" />
      <Section id="clarity" title="Clarity over decoration"><p className="body-copy">{t("视觉服务识别与操作。")}</p></Section>
      <Section id="semantic" title="Semantic before specific"><p className="body-copy">{t("业务页面使用语义 Token，如")} <InlineCode>text/secondary</InlineCode></p></Section>
      <Section id="progressive" title="Progressive completion"><p className="body-copy">{t("未完成内容标记 Planned / Draft。")}</p></Section>
    </>
  )
}

function StatusPage() {
  const { t } = useLocale()

  const rows: Array<[PageStatus, string, string]> = [
    ['planned', t('已进入规划，内容尚未建立'), t('不可作为设计依据')],
    ['draft', t('正在制定和讨论'), t('可参考，不建议正式交付')],
    ['stable', t('已经批准并可以正式使用'), t('默认使用')],
    ['deprecated', t('已经废弃，保留迁移信息'), t('仅用于历史查询')],
  ]
  return (
    <>
      <PageHeader title="Status & Versioning" status="stable" />
      <Section id="statuses" title={t("内容状态")}>
        <div className="status-table">
          {rows.map(([status, meaning, usage]) => <div className="status-row" key={status}><StatusBadge status={status} /><span>{meaning}</span><small>{usage}</small></div>)}
        </div>
      </Section>
      <Section id="version-rules" title={t("版本规则")}><p className="body-copy">{t("Token、命名或用途变更时更新版本与 Changelog。")}</p></Section>
    </>
  )
}

function PlannedPage({ item }: { item: NavigationItem }) {
  const { t } = useLocale()

  const plans: Record<string, { includes: string[] }> = {
    motion: { includes: ['Duration', 'Easing', 'Reduced motion'] },
    patterns: { includes: ['Generation', 'Workflow', 'Result & Status'] },
    'brand-voice': { includes: ['Brand voice', 'Writing principles', t('示例与禁用表达')] },
    'brand-imagery': { includes: ['Image style', 'Crop & composition', t('来源与版权')] },
    changelog: { includes: [t('版本'), t('变更内容'), t('影响范围')] },
  }
  const plan = plans[item.id] ?? { includes: [t('定义'), t('示例'), t('使用规则')] }
  return (
    <>
      <PageHeader title={item.label} status={item.status} />
      <Section id="planned-content" title={t("计划内容")}><div className="planned-list">{plan.includes.map((entry, index) => <div key={entry}><span>{String(index + 1).padStart(2, '0')}</span><strong>{t(entry)}</strong></div>)}</div></Section>
    </>
  )
}

function FigmaPage({ theme }: { theme: Theme }) {
  return (
    <>
      <PageHeader title="Figma Library" status="stable" />
      <FigmaLibraryPreview theme={theme} />
    </>
  )
}

function InlineCode({ children }: { children: React.ReactNode }) {
  return <code className="inline-code">{children}</code>
}

function PagePager({ previous, next, onNavigate }: { previous?: NavigationItem; next?: NavigationItem; onNavigate: (id: string) => void }) {
  const { t } = useLocale()

  return (
    <nav className="page-pager" aria-label={t("页面切换")}>
      {previous ? <button onClick={() => onNavigate(previous.id)}><ArrowLeft size={17} /><span><small>{t("Previous")}</small>{t(previous.label)}</span></button> : <span />}
      {next && <button className="next" onClick={() => onNavigate(next.id)}><span><small>{t("Next")}</small>{t(next.label)}</span><ArrowRight size={17} /></button>}
    </nav>
  )
}

type SearchDialogProps = { open: boolean; onClose: () => void; onNavigate: (id: string) => void }
function SearchDialog(props: SearchDialogProps) {
  return <Presence present={props.open}><div className="dialog-backdrop" data-state={props.open ? 'open' : 'closed'} inert={!props.open} role="presentation" onMouseDown={props.onClose}><SearchDialogContent {...props} /></div></Presence>
}

function SearchDialogContent({ open, onClose, onNavigate }: SearchDialogProps) {
  const { t } = useLocale()

  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement | null
    inputRef.current?.focus()
    return () => previous?.focus()
  }, [open])
  const uniqueItems = useMemo(() => allItems.filter((item, index) => allItems.findIndex((entry) => entry.id === item.id) === index), [])
  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return uniqueItems.slice(0, 8)
    return uniqueItems.filter((item) => `${item.label} ${t(item.label)} ${item.keywords ?? ''}`.toLowerCase().includes(normalized))
  }, [query, uniqueItems, t])
  return (
      <div className="search-dialog" role="dialog" aria-modal="true" aria-label={t("搜索设计规范")} onMouseDown={(event) => event.stopPropagation()}>
        <div className="search-field"><Search size={19} /><input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("搜索颜色、字体、间距或状态…")} /><button onClick={onClose}>Esc</button></div>
        <div className="search-results">
          {results.length ? results.map((item) => <button key={item.id} onClick={() => onNavigate(item.id)}><span><strong>{t(item.label)}</strong><small>{t(item.group ?? '')}</small></span><StatusBadge status={item.status} /></button>) : <div className="search-empty"><strong>{t("没有匹配的规范")}</strong></div>}
        </div>
      </div>
  )
}

export default App
