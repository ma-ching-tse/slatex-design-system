import { useLocale } from './locale-context'
import { useRef, useState, type ReactNode } from 'react'
import { FileImage, FileVideo, Plus } from 'lucide-react'
import {
  SlateXTabs, SlateXSkeleton, SlateXAlert, SlateXAvatar, SlateXBadge, SlateXButton, SlateXCheckbox, SlateXComposer, SlateXDialog,
  SlateXDropdownPanel, SlateXInput, SlateXPopover, SlateXRadio, SlateXRadioGroup, SlateXSearch,
  SlateXSelect, SlateXSwitch, SlateXTag, SlateXTextarea, SlateXToast, SlateXTooltip,
  type CompactSize, type FieldSize, type FieldState, type Placement, type Tone,
} from '@slatex/react'
export type PreviewMode = 'main' | 'sizes' | 'states'
const sizes: FieldSize[] = ['Small', 'Medium', 'Large']
const compact: CompactSize[] = ['Tiny', 'Small', 'Medium']
const fieldStates: FieldState[] = ['Default', 'Hover', 'Editing', 'Filled', 'Error', 'Disabled', 'ReadOnly']
const tones: Tone[] = ['Neutral', 'Brand', 'Success', 'Info', 'Warning', 'Error']
const feedbackTones = ['Neutral', 'Success', 'Info', 'Warning', 'Error'] as const
const placements: Placement[] = ['top', 'bottom', 'left', 'right']
const projectOptions = [{ value: 'design', label: 'Design' }, { value: 'marketing', label: 'Marketing' }, { value: 'research', label: 'Research', disabled: true }]
function Gallery({ children }: { children: ReactNode }) { return <div className="component-preview-grid">{children}</div> }
function Item({ label, children }: { label?: string; children: ReactNode }) { return <div className="component-preview-item"><div>{children}</div>{label ? <strong>{label}</strong> : null}</div> }
function SearchPreview() {
  const { t } = useLocale()

  const [query, setQuery] = useState('')
  const all = ['Button', 'Input', 'Switch'].map(label => ({ label, value: label.toLowerCase() }))
  return <SlateXSearch label={t("组件")} placeholder={t("搜索组件")} value={query} onValueChange={setQuery} options={all.filter(item => item.label.toLowerCase().includes(query.toLowerCase()))} />
}
function ComposerPreview() {
  const [value, setValue] = useState(''), [generating, setGenerating] = useState(false), [file, setFile] = useState<string>()
  const picker = useRef<HTMLInputElement>(null)
  return <><input ref={picker} type="file" hidden onChange={event => { setFile(event.target.files?.[0]?.name); event.target.value = '' }} />
    <SlateXComposer value={value} onValueChange={setValue} generating={generating} onSend={() => setGenerating(true)} onStop={() => setGenerating(false)} onAttach={() => picker.current?.click()} attachment={file ? { name: file } : undefined} onRemoveAttachment={() => setFile(undefined)} /></>
}
function PopoverPreview() {
  const { t } = useLocale()

  const [open, setOpen] = useState(false)
  return <SlateXPopover open={open} onOpenChange={setOpen} trigger={<SlateXButton kind="Secondary">{t("项目设置")}</SlateXButton>} title={t("项目设置")} showClose><SlateXSwitch label={t("自动保存")} defaultChecked /><SlateXButton size="Small" onClick={() => setOpen(false)}>{t("完成")}</SlateXButton></SlateXPopover>
}
function DialogPreview({ size = 'Medium', danger = false }: { size?: 'Small' | 'Medium'; danger?: boolean }) {
  const { t } = useLocale()

  const [open, setOpen] = useState(false)
  return <SlateXDialog open={open} onOpenChange={setOpen} size={size} title={danger ? t('删除项目') : t('保存项目')} trigger={<SlateXButton kind={danger ? 'Danger' : 'Secondary'}>{danger ? t('删除项目') : t('打开弹窗')}</SlateXButton>}
    footer={<><SlateXButton pill={false} kind="Secondary" onClick={() => setOpen(false)}>{t("取消")}</SlateXButton><SlateXButton pill={false} kind={danger ? 'Danger' : 'Primary'} onClick={() => setOpen(false)}>{danger ? t('删除') : t('保存')}</SlateXButton></>}>{danger ? t('项目删除后无法恢复。') : t('保存当前项目设置？')}</SlateXDialog>
}
function ToastPreview() {
  const { t } = useLocale()

  const [open, setOpen] = useState(false)
  return <><SlateXButton kind="Secondary" onClick={() => setOpen(true)}>{t("保存项目")}</SlateXButton><SlateXToast message={t("已保存")} tone="Success" open={open} onOpenChange={setOpen} showClose /></>
}
export function ComponentPreview({ id, mode }: { id: string; mode: PreviewMode }) {
  const { t } = useLocale()

  switch (id) {
    case 'tabs':
      if (mode === 'main') return <SlateXTabs aria-label="Period" items={[{value:'day',label:'Day',content:t('今天')},{value:'week',label:'Week',content:t('本周')},{value:'month',label:'Month',content:t('本月')}]} />
      if (mode === 'sizes') return <Gallery>{(['Tiny','Medium','Large'] as const).map(size=><Item label={size} key={size}><SlateXTabs size={size} aria-label={size} items={[{value:'day',label:'Day'},{value:'week',label:'Week'},{value:'month',label:'Month'}]} /></Item>)}</Gallery>
      return <Gallery><Item label="2 options"><SlateXTabs aria-label="Two options" items={[{value:'day',label:'Day'},{value:'week',label:'Week'}]} /></Item><Item label="Disabled"><SlateXTabs disabled aria-label="Disabled period" items={[{value:'day',label:'Day'},{value:'week',label:'Week'}]} /></Item></Gallery>
    case 'skeleton':
      if (mode === 'main') return <div className="skeleton-preview" role="status" aria-label={t('加载中')}><SlateXSkeleton shape="Block" width="100%" height={144} /><div className="skeleton-preview-row"><SlateXSkeleton shape="Circle" /><div><SlateXSkeleton width="72%" /><SlateXSkeleton width="48%" /></div></div></div>
      if (mode === 'sizes') return <Gallery>{(['Text','Block','Circle'] as const).map(shape=><Item label={shape} key={shape}><SlateXSkeleton shape={shape} /></Item>)}</Gallery>
      return <Gallery><Item label="Pulse · 1600 ms"><SlateXSkeleton width={160} /></Item><Item label="Static"><SlateXSkeleton width={160} animate={false} /></Item></Gallery>

    case 'input':
      if (mode === 'main') return <div className="component-preview-stack"><SlateXInput label={t("项目名称")} placeholder={t("新项目")} required clearable /><SlateXInput label={t("密码")} type="password" passwordToggle defaultValue="ringo-design" /></div>
      if (mode === 'sizes') return <Gallery>{sizes.map(size => <Item label={size} key={size}><SlateXInput size={size} aria-label={size} placeholder={t("项目名称")} /></Item>)}</Gallery>
      return <Gallery>{fieldStates.map(state => <Item label={state} key={state}><SlateXInput state={state} aria-label={state} placeholder={t("项目名称")} defaultValue={['Filled','Error','ReadOnly'].includes(state) ? 'Design System' : ''} error={state === 'Error' ? t('名称已被使用') : undefined} /></Item>)}</Gallery>
    case 'textarea':
      if (mode === 'main') return <SlateXTextarea label={t("项目说明")} placeholder={t("描述这个项目")} showCount maxLength={200} />
      if (mode === 'sizes') return <Gallery>{(['Tiny','Medium','Large'] as const).map(size => <Item label={size} key={size}><SlateXTextarea size={size} aria-label={size} placeholder={t("项目说明")} /></Item>)}</Gallery>
      return <Gallery>{fieldStates.map(state => <Item label={state} key={state}><SlateXTextarea state={state} aria-label={state} placeholder={t("项目说明")} defaultValue={['Filled','Error','ReadOnly'].includes(state) ? t('Design System 组件库') : ''} error={state === 'Error' ? t('请补充项目说明') : undefined} /></Item>)}</Gallery>
    case 'search':
      if (mode === 'main') return <SearchPreview />
      if (mode === 'sizes') return <Gallery>{sizes.map(size => <Item label={size} key={size}><SlateXSearch size={size} aria-label={size} placeholder={t("搜索组件")} options={projectOptions} /></Item>)}</Gallery>
      return <Gallery>{(['Options','Loading','Empty','Error'] as const).map(state => <Item label={state} key={state}><SlateXDropdownPanel state={state}>{projectOptions.map(option => <div className="m-dropdown-item" key={option.value}>{option.label}</div>)}</SlateXDropdownPanel></Item>)}</Gallery>
    case 'composer':
      if (mode === 'main') return <ComposerPreview />
      if (mode === 'sizes') return <Gallery><Item label="560 × 200"><SlateXComposer onSend={() => {}} placeholder={t("输入消息…")} /></Item><Item label={t("附件")}><SlateXComposer defaultValue={t("看看这张图")} onSend={() => {}} attachment={{name:'cover.webp'}} /></Item></Gallery>
      return <Gallery>{(['Empty','Ready','Generating','Error','Disabled'] as const).map(state => <Item label={state} key={state}><SlateXComposer onSend={() => {}} onStop={() => {}} generating={state === 'Generating'} disabled={state === 'Disabled'} defaultValue={['Ready','Generating','Error'].includes(state) ? t('整理这个项目的设计规范') : ''} error={state === 'Error' ? t('生成失败，请重试') : undefined} /></Item>)}</Gallery>
    case 'checkbox':
      if (mode === 'main') return <div className="component-preview-stack"><SlateXCheckbox label={t("自动保存")} defaultChecked /><SlateXCheckbox label={t("同步到所有项目")} defaultChecked="indeterminate" /><SlateXCheckbox label={t("接收更新")} /></div>
      if (mode === 'sizes') return <Gallery>{compact.map(size => <Item label={size} key={size}><SlateXCheckbox size={size} label={t("自动保存")} defaultChecked /></Item>)}</Gallery>
      return <Gallery><Item label="Unchecked"><SlateXCheckbox label={t("自动保存")} /></Item><Item label="Checked"><SlateXCheckbox label={t("自动保存")} defaultChecked /></Item><Item label="Indeterminate"><SlateXCheckbox label={t("自动保存")} defaultChecked="indeterminate" /></Item><Item label="Disabled"><SlateXCheckbox label={t("自动保存")} defaultChecked disabled /></Item></Gallery>
    case 'radio':
      if (mode === 'main') return <SlateXRadioGroup defaultValue="design" aria-label={t("项目类型")}><SlateXRadio value="design" label="Design" /><SlateXRadio value="marketing" label="Marketing" /><SlateXRadio value="research" label="Research" disabled /></SlateXRadioGroup>
      if (mode === 'sizes') return <Gallery>{compact.map(size => <Item label={size} key={size}><SlateXRadioGroup defaultValue="design" aria-label={size}><SlateXRadio size={size} value="design" label="Design" /><SlateXRadio size={size} value="marketing" label="Marketing" /></SlateXRadioGroup></Item>)}</Gallery>
      return <SlateXRadioGroup defaultValue="selected" aria-label={t("状态")} orientation="horizontal"><SlateXRadio value="default" label="Default" /><SlateXRadio value="selected" label="Selected" /><SlateXRadio value="disabled" label="Disabled" disabled /></SlateXRadioGroup>
    case 'switch':
      if (mode === 'main') return <div className="component-preview-stack"><SlateXSwitch label={t("自动保存")} defaultChecked /><SlateXSwitch label={t("接收通知")} /></div>
      if (mode === 'sizes') return <Gallery>{compact.map(size => <Item label={size} key={size}><SlateXSwitch size={size} label={t("自动保存")} defaultChecked /></Item>)}</Gallery>
      return <Gallery><Item label="Off"><SlateXSwitch label={t("自动保存")} /></Item><Item label="On"><SlateXSwitch label={t("自动保存")} defaultChecked /></Item><Item label="Disabled · Off"><SlateXSwitch label={t("自动保存")} disabled /></Item><Item label="Disabled · On"><SlateXSwitch label={t("自动保存")} defaultChecked disabled /></Item></Gallery>
    case 'select':
      if (mode === 'main') return <SlateXSelect label={t("项目类型")} options={projectOptions} placeholder={t("选择项目类型")} />
      if (mode === 'sizes') return <Gallery>{sizes.map(size => <Item label={size} key={size}><SlateXSelect size={size} aria-label={size} options={projectOptions} defaultValue="design" /></Item>)}</Gallery>
      return <Gallery><Item label="Default"><SlateXSelect options={projectOptions} aria-label="Default" /></Item><Item label="Filled"><SlateXSelect options={projectOptions} defaultValue="design" aria-label="Filled" /></Item><Item label="Error"><SlateXSelect options={projectOptions} error={t("请选择项目类型")} aria-label="Error" /></Item><Item label="Disabled"><SlateXSelect options={projectOptions} defaultValue="design" disabled aria-label="Disabled" /></Item></Gallery>
    case 'tag':
      if (mode === 'main') return <div className="component-preview-row">{tones.map(tone => <SlateXTag key={tone} tone={tone}>{tone}</SlateXTag>)}</div>
      if (mode === 'sizes') return <div className="component-preview-row">{compact.map(size => <Item label={size} key={size}><SlateXTag size={size} tone="Brand">Design</SlateXTag></Item>)}<SlateXTag leadingIcon={<FileImage />}>Image</SlateXTag><SlateXTag trailingIcon={<FileVideo />}>Video</SlateXTag></div>
      return <div className="component-preview-row">{tones.map(tone => <SlateXTag key={tone} tone={tone} variant="Outline">{tone}</SlateXTag>)}</div>
    case 'badge':
      if (mode === 'main') return <div className="component-preview-row">{tones.map(tone => <Item label={tone} key={tone}><SlateXBadge tone={tone} count={8} /></Item>)}</div>
      if (mode === 'sizes') return <div className="component-preview-row">{compact.map(size => <Item label={size} key={size}><SlateXBadge size={size} tone="Brand" count={8} /><SlateXBadge size={size} tone="Brand" variant="Dot" aria-label={t("更新")} /></Item>)}</div>
      return <div className="component-preview-row"><SlateXBadge count={0} showZero /><SlateXBadge count={99} /><SlateXBadge count={148} /><SlateXBadge variant="Dot" tone="Success" aria-label={t("已同步")} /></div>
    case 'avatar':
      if (mode === 'main') return <div className="component-preview-row"><Item label="Image"><SlateXAvatar src={`${import.meta.env.BASE_URL}images/avatar-default.png`} alt="Atlas" /></Item><Item label="Initials"><SlateXAvatar initials="RM" alt="Ringo" /></Item><Item label="Icon"><SlateXAvatar alt={t("成员")} /></Item></div>
      if (mode === 'sizes') return <div className="component-preview-row">{[16,32,52,64].map(size => <Item label={`${size} px · ×${size / 32}`} key={size}><SlateXAvatar size={size} initials="R" alt="Ringo" /></Item>)}</div>
      return <div className="component-preview-row"><SlateXAvatar initials="RM" alt="Ringo" /><SlateXAvatar initials="林" alt="林" /><SlateXAvatar alt={t("成员")} /></div>
    case 'tooltip':
      if (mode === 'main') return <div className="component-preview-row">{placements.map(placement => <SlateXTooltip key={placement} placement={placement} label={t("添加组件")} showArrow><SlateXButton kind="Secondary" size="Small">{placement}</SlateXButton></SlateXTooltip>)}</div>
      if (mode === 'sizes') return <div className="component-preview-row">{(['Small','Medium'] as const).map(size => <SlateXTooltip key={size} size={size} label={t("添加组件")}><SlateXButton kind="Secondary" size="Small">{size}</SlateXButton></SlateXTooltip>)}</div>
      return <div className="component-preview-row"><SlateXTooltip label={t("添加组件")} showArrow><SlateXButton icon size="Small" aria-label={t("添加组件")}><Plus /></SlateXButton></SlateXTooltip><SlateXTooltip label={t("添加组件到当前项目")}><SlateXButton kind="Secondary" size="Small">{t("无箭头")}</SlateXButton></SlateXTooltip></div>
    case 'popover':
      if (mode === 'main') return <PopoverPreview />
      if (mode === 'sizes') return <div className="component-preview-row">{placements.map(placement => <SlateXPopover key={placement} placement={placement} title={t("项目设置")} showArrow trigger={<SlateXButton kind="Secondary" size="Small">{placement}</SlateXButton>}><SlateXSwitch label={t("自动保存")} /></SlateXPopover>)}</div>
      return <SlateXPopover title={t("项目设置")} showClose trigger={<SlateXButton kind="Secondary" size="Small">{t("关闭按钮")}</SlateXButton>}><SlateXCheckbox label={t("同步设置")} defaultChecked /></SlateXPopover>
    case 'dialog':
      if (mode === 'main') return <DialogPreview />
      if (mode === 'sizes') return <div className="component-preview-row">{(['Small','Medium'] as const).map(size => <Item label={size} key={size}><DialogPreview size={size} /></Item>)}</div>
      return <DialogPreview danger />
    case 'toast':
      if (mode === 'main') return <ToastPreview />
      if (mode === 'sizes') return <div className="component-preview-stack">{feedbackTones.map(tone => <Item label={tone} key={tone}><SlateXToast tone={tone} message={t("已保存")} duration={0} inline /></Item>)}</div>
      return <SlateXToast message={t("项目已保存")} showClose duration={0} inline />
    case 'alert':
      if (mode === 'main') return <SlateXAlert tone="Info" title={t("有可用更新")} description={t("版本 0.2.0")} />
      if (mode === 'sizes') return <Gallery>{(['Medium','Large'] as const).map(size => <Item label={size} key={size}><SlateXAlert size={size} title={t("有可用更新")} /></Item>)}</Gallery>
      return <div className="component-preview-stack">{feedbackTones.map(tone => <SlateXAlert key={tone} tone={tone} title={tone} description={tone === 'Error' ? t('请求失败，请重试') : undefined} />)}</div>
    default: return null
  }
}
