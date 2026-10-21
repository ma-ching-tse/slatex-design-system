import { fileURLToPath } from 'node:url'
const root=fileURLToPath(new URL('../',import.meta.url))
import * as icons from 'lucide-react'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { mkdirSync,writeFileSync,readFileSync } from 'node:fs'
const names=JSON.parse(readFileSync(`${root}docs/sources/slatex/icons.json`,'utf8')).icons.map(icon=>icon.name)
mkdirSync(`${root}public/icons/lucide`,{recursive:true})
for(const name of names){const key=name.split('-').map(p=>p[0].toUpperCase()+p.slice(1)).join('');if(!icons[key])throw new Error(key);writeFileSync(`${root}public/icons/lucide/${name}.svg`,renderToStaticMarkup(createElement(icons[key],{size:24,strokeWidth:2})));}
