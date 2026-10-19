import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
const root = fileURLToPath(new URL('../', import.meta.url))
const read = name => JSON.parse(readFileSync(`${root}docs/sources/slatex/${name}.json`, 'utf8'))
const [base, theme] = read('colors'), brand = read('brand'), styles = read('styles')
const primitives = Object.fromEntries(base.values.map(([name,value]) => [name,value]))
const themes = Object.fromEntries(theme.values.map(([name,...values]) => [name,values]))
const brands = Object.fromEntries(brand.values.map(([name,...values]) => [name,values]))
function resolve(reference, mode = 0, preset = 0, seen = new Set()) {
  if (!reference.startsWith('@')) return reference
  const name = reference.slice(1)
  if (seen.has(name)) throw new Error(`Alias cycle: ${name}`)
  seen.add(name)
  const value = primitives[name] ?? brands[name]?.[preset] ?? themes[name]?.[mode]
  if (typeof value !== 'string') throw new Error(`Unknown alias: ${reference}`)
  return resolve(value, mode, preset, seen)
}
const presets = brand.modes.map((mode,index) => ({
  name: mode.name,
  color: resolve('@brand/500',0,index).toUpperCase(),
  palette: Object.fromEntries(brand.values.filter(([name])=>name.startsWith('brand/')).map(([name,...values])=>[name.slice(6),values[index]])),
  ...Object.fromEntries(['light','dark'].map((mode,m)=>[mode,{
    aliases:Object.fromEntries(brand.values.filter(([name])=>name.startsWith(`${mode}/`)).map(([name,...values])=>[name.slice(mode.length+1),values[index].replace(/^@/,'')])),
    values:Object.fromEntries(brand.values.filter(([name])=>name.startsWith(`${mode}/`)).map(([name,...values])=>[name.slice(mode.length+1),resolve(values[index],m,index)])),
  }]))
}))
function reference(value,mode) {
  if (!value.startsWith('@')) return value
  const name=value.slice(1)
  if (primitives[name] || name.startsWith('brand/')) return name
  return reference(brands[name]?.[0] ?? themes[name][mode],mode)
}
const common = name => /^(text|surface|border|status|overlay)\//.test(name) || /^brand\/(background|solid|foreground|on-solid)$/.test(name)
const source={fileKey:'JsOdWljwN8c1Fnbp3cdOXH',capturedAt:'2026-10-18',
 collections:[base,theme,brand].map(c=>({name:c.name,count:c.values.length})),
 primitives:{...primitives,...Object.fromEntries(Object.entries(presets[0].palette).map(([step,color])=>[`brand/${step}`,color]))},
 theme:theme.values.map(([name,light,dark])=>[name,reference(light,0),reference(dark,1),common(name)]),
 dimension:Object.fromEntries(styles.dimensions),textStyles:styles.textStyles.map(row=>row.slice(0,6)),
 effects:styles.effects.map(([name,effects])=>({name,effects})),
}
const cssName = name => `--m-${name.replaceAll('/','-')}`
const lines=[]
for(const [mode,index] of [['light',0],['dark',1]]) {
 lines.push(mode==='light'?':root {':":root[data-theme='dark'] {")
 for(const [name,...values] of theme.values) lines.push(`  ${cssName(name)}: ${resolve(values[index],index)};`)
 if(mode==='light') for(const [name,value] of styles.dimensions) lines.push(`  ${cssName(name)}: ${value}px;`)
 lines.push('}')
}
const css=`/* SlateX · Figma snapshot 2026-10-18 · default brand: Orange */\n${lines.join('\n')}\n`
mkdirSync(`${root}public/tokens`,{recursive:true})
writeFileSync(`${root}docs/sources/foundations-slatex.json`,JSON.stringify(source,null,2)+'\n')
writeFileSync(`${root}docs/sources/slatex/presets.json`,JSON.stringify(presets,null,2)+'\n')
writeFileSync(`${root}packages/react/src/tokens.css`,css)
writeFileSync(`${root}public/tokens/slatex.css`,css)
writeFileSync(`${root}public/tokens/slatex.json`,JSON.stringify({source,presets},null,2)+'\n')
console.log(`Synced ${theme.values.length} theme colors, ${presets.length} brand presets, ${styles.textStyles.length} text styles.`)
