import type { PreviewMode } from './ComponentExamples'
export interface DemoCode { children: string; components: string[]; icons?: string[]; hooks?: string[]; setup?: string }
export function componentCode(id: string, mode: PreviewMode): DemoCode {
  if (id === 'tabs') return {components:['SlateXTabs'], children:mode === 'sizes' ? '<SlateXTabs size="Tiny" aria-label="Period" items={[{value:"day",label:"Day"},{value:"week",label:"Week"}]} />' : mode === 'states' ? '<SlateXTabs disabled aria-label="Period" items={[{value:"day",label:"Day"},{value:"week",label:"Week"}]} />' : '<SlateXTabs aria-label="Period" items={[{value:"day",label:"Day",content:"Today"},{value:"week",label:"Week",content:"This week"},{value:"month",label:"Month",content:"This month"}]} />'}
  if (id === 'skeleton') return {components:['SlateXSkeleton'], children:mode === 'states' ? '<SlateXSkeleton width={160} />\n<SlateXSkeleton width={160} animate={false} />' : '<div role="status" aria-label="Loading">\n  <SlateXSkeleton shape="Text" />\n  <SlateXSkeleton shape="Block" width={280} height={144} />\n  <SlateXSkeleton shape="Circle" />\n</div>'}
  const component = `SlateX${id.charAt(0).toUpperCase()}${id.slice(1)}`
  const main: Record<string, DemoCode> = {
    input:{components:['SlateXInput'],children:'<SlateXInput label="项目名称" placeholder="新项目" required clearable />\n<SlateXInput label="密码" type="password" passwordToggle />'},
    textarea:{components:['SlateXTextarea'],children:'<SlateXTextarea label="项目说明" placeholder="描述这个项目" showCount maxLength={200} />'},
    search:{components:['SlateXSearch'],hooks:['useState'],setup:"const [query, setQuery] = useState('')\nconst items = ['Button', 'Input', 'Switch'].map(label => ({ label, value: label.toLowerCase() }))",children:'<SlateXSearch label="组件" value={query} onValueChange={setQuery}\n  options={items.filter(item => item.label.toLowerCase().includes(query.toLowerCase()))} />'},
    composer:{components:['SlateXComposer'],hooks:['useState'],setup:'const [generating, setGenerating] = useState(false)',children:'<SlateXComposer generating={generating}\n  onSend={() => setGenerating(true)} onStop={() => setGenerating(false)} />'},
    checkbox:{components:['SlateXCheckbox'],children:'<SlateXCheckbox label="自动保存" defaultChecked />\n<SlateXCheckbox label="同步到所有项目" defaultChecked="indeterminate" />'},
    radio:{components:['SlateXRadioGroup','SlateXRadio'],children:'<SlateXRadioGroup name="project" defaultValue="design" aria-label="项目类型">\n  <SlateXRadio value="design" label="Design" />\n  <SlateXRadio value="marketing" label="Marketing" />\n  <SlateXRadio value="research" label="Research" disabled />\n</SlateXRadioGroup>'},
    switch:{components:['SlateXSwitch'],children:'<SlateXSwitch label="自动保存" defaultChecked />\n<SlateXSwitch label="接收通知" />'},
    select:{components:['SlateXSelect'],children:'<SlateXSelect label="项目类型" options={[\n  { value: "design", label: "Design" },\n  { value: "marketing", label: "Marketing" },\n  { value: "research", label: "Research", disabled: true },\n]} />'},
    tag:{components:['SlateXTag'],children:'<SlateXTag tone="Brand">Design</SlateXTag>\n<SlateXTag tone="Success">已完成</SlateXTag>'},
    badge:{components:['SlateXBadge'],children:'<SlateXBadge tone="Brand" count={8} />\n<SlateXBadge tone="Success" variant="Dot" aria-label="已同步" />'},
    avatar:{components:['SlateXAvatar'],children:'<SlateXAvatar src="/brand/atlas-cloud-logomark-black.svg" alt="Atlas" />\n<SlateXAvatar initials="RM" alt="Ringo" />\n<SlateXAvatar alt="成员" />'},
    tooltip:{components:['SlateXTooltip','SlateXButton'],children:'<SlateXTooltip label="添加组件" placement="top" showArrow>\n  <SlateXButton kind="Secondary" size="Small">添加组件</SlateXButton>\n</SlateXTooltip>'},
    popover:{components:['SlateXPopover','SlateXButton','SlateXSwitch'],children:'<SlateXPopover title="项目设置" showClose\n  trigger={<SlateXButton kind="Secondary">项目设置</SlateXButton>}>\n  <SlateXSwitch label="自动保存" defaultChecked />\n</SlateXPopover>'},
    dialog:{components:['SlateXDialog','SlateXButton'],children:'<SlateXDialog title="保存项目"\n  trigger={<SlateXButton kind="Secondary">打开弹窗</SlateXButton>}>\n  保存当前项目设置？\n</SlateXDialog>'},
    toast:{components:['SlateXToast','SlateXButton'],hooks:['useState'],setup:'const [open, setOpen] = useState(false)',children:'<SlateXButton onClick={() => setOpen(true)}>保存项目</SlateXButton>\n<SlateXToast message="已保存" tone="Success" open={open} onOpenChange={setOpen} showClose />'},
    alert:{components:['SlateXAlert'],children:'<SlateXAlert tone="Info" title="有可用更新" description="版本 0.2.0" />'},
  }
  if (mode === 'main') return main[id]
  const states: Record<string,string> = {
    input:'<SlateXInput error="名称已被使用" defaultValue="Design System" aria-label="项目名称" />\n<SlateXInput disabled aria-label="项目名称" placeholder="项目名称" />',
    textarea:'<SlateXTextarea error="请补充项目说明" aria-label="项目说明" />\n<SlateXTextarea readOnly defaultValue="Design System 组件库" aria-label="项目说明" />',
    composer:'<SlateXComposer generating defaultValue="整理设计规范" onSend={() => {}} onStop={() => {}} />\n<SlateXComposer error="生成失败，请重试" defaultValue="整理设计规范" onSend={() => {}} />',
    checkbox:'<SlateXCheckbox label="自动保存" defaultChecked="indeterminate" />\n<SlateXCheckbox label="自动保存" defaultChecked disabled />',
    switch:'<SlateXSwitch label="自动保存" />\n<SlateXSwitch label="自动保存" defaultChecked disabled />',
    tag:'<SlateXTag variant="Outline" tone="Brand">Design</SlateXTag>',
    badge:'<SlateXBadge count={148} max={99} />\n<SlateXBadge count={0} showZero />',
    avatar:'<SlateXAvatar initials="RM" alt="Ringo" />\n<SlateXAvatar initials="林" alt="林" />',
    tooltip:'<SlateXTooltip label="添加组件" showArrow>\n  <SlateXButton kind="Secondary">添加组件</SlateXButton>\n</SlateXTooltip>',
    popover:'<SlateXPopover title="项目设置" showClose\n  trigger={<SlateXButton kind="Secondary">项目设置</SlateXButton>}>\n  <SlateXSwitch label="自动保存" />\n</SlateXPopover>',
    dialog:'<SlateXDialog title="删除项目"\n  trigger={<SlateXButton kind="Danger">删除项目</SlateXButton>}>\n  项目删除后无法恢复。\n</SlateXDialog>',
    toast:'<SlateXToast message="项目已保存" showClose duration={0} inline />',
    alert:'<SlateXAlert tone="Error" title="请求失败" description="请重试" />',
  }
  if (mode === 'states' && id === 'search') return {components:['SlateXDropdownPanel'],children:'<SlateXDropdownPanel state="Loading" />\n<SlateXDropdownPanel state="Empty" />\n<SlateXDropdownPanel state="Error" message="搜索失败，请重试" />'}
  if (mode === 'states' && id === 'select') return {components:['SlateXSelect'],children:'<SlateXSelect label="项目类型" options={[{value:"design",label:"Design"}]} error="请选择项目类型" />\n<SlateXSelect options={[{value:"design",label:"Design"}]} defaultValue="design" disabled aria-label="项目类型" />'}
  if (mode === 'states' && states[id]) return { ...main[id], hooks: [], setup: '', children: states[id] }
  const config: Record<string, string> = {
    input:'<SlateXInput size="Small" placeholder="项目名称" aria-label="项目名称" />\n<SlateXInput size="Large" placeholder="项目名称" aria-label="项目名称" />',
    textarea:'<SlateXTextarea size="Tiny" placeholder="项目说明" aria-label="项目说明" />\n<SlateXTextarea size="Large" placeholder="项目说明" aria-label="项目说明" />',
    search:'<SlateXSearch size="Small" placeholder="搜索组件" />\n<SlateXSearch size="Large" placeholder="搜索组件" />',
    composer:'<SlateXComposer defaultValue="看看这张图" attachment={{name:"cover.webp"}} onSend={() => {}} />',
    checkbox:'<SlateXCheckbox size="Tiny" label="自动保存" defaultChecked />\n<SlateXCheckbox size="Medium" label="自动保存" defaultChecked />',
    switch:'<SlateXSwitch size="Tiny" label="自动保存" defaultChecked />\n<SlateXSwitch size="Medium" label="自动保存" defaultChecked />',
    tag:'<SlateXTag size="Tiny" tone="Brand">Design</SlateXTag>\n<SlateXTag size="Medium" leadingIcon={<FileImage />}>Image</SlateXTag>',
    badge:'<SlateXBadge size="Tiny" tone="Brand" count={8} />\n<SlateXBadge size="Medium" tone="Brand" count={8} />',
    avatar:'<SlateXAvatar size={16} initials="R" alt="Ringo" />\n<SlateXAvatar size={64} initials="R" alt="Ringo" />',
    tooltip:'<SlateXTooltip size="Medium" label="添加组件" placement="bottom">\n  <SlateXButton kind="Secondary">添加组件</SlateXButton>\n</SlateXTooltip>',
    popover:'<SlateXPopover placement="right" showArrow title="项目设置"\n  trigger={<SlateXButton kind="Secondary">项目设置</SlateXButton>}>\n  <SlateXSwitch label="自动保存" />\n</SlateXPopover>',
    dialog:'<SlateXDialog size="Small" title="保存项目"\n  trigger={<SlateXButton kind="Secondary">打开弹窗</SlateXButton>}>\n  保存当前项目设置？\n</SlateXDialog>',
    toast:'<SlateXToast tone="Success" message="已保存" duration={0} inline />',
    alert:'<SlateXAlert size="Large" title="有可用更新" />',
  }
  if (config[id]) return { ...main[id], hooks: [], setup: '', icons: id === 'tag' ? ['FileImage'] : [], children: config[id] }
  return { ...main[id], components: main[id]?.components ?? [component] }
}
