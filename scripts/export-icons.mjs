import { fileURLToPath } from 'node:url'
const root=fileURLToPath(new URL('../',import.meta.url))
import * as icons from 'lucide-react'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { mkdirSync,writeFileSync } from 'node:fs'
const names=["house", "menu", "arrow-left", "arrow-right", "arrow-up", "arrow-down", "chevron-left", "chevron-right", "chevron-up", "chevron-down", "external-link", "log-out", "search", "x", "plus", "minus", "check", "ellipsis", "pencil", "trash", "upload", "download", "refresh-cw", "copy", "info", "circle-check", "circle-alert", "circle-x", "triangle-alert", "eye", "eye-off", "lock", "folder", "folder-open", "file", "file-text", "file-search-corner", "image", "paperclip", "link", "user", "users", "bell", "mail", "message-square", "calendar", "clock", "settings", "funnel", "arrow-up-down", "wrench", "scissors", "pen-tool", "ruler", "pipette", "sliders-horizontal", "terminal", "code-xml", "braces", "git-branch", "plug", "globe", "webhook", "flask-conical", "search-code", "bot", "bot-message-square", "sparkles", "brain", "brain-circuit", "cpu", "network", "workflow", "wand-sparkles", "lightbulb", "scan", "scan-text", "database", "blocks", "waypoints"]
mkdirSync(`${root}public/icons/lucide`,{recursive:true})
for(const name of names){const key=name.split('-').map(p=>p[0].toUpperCase()+p.slice(1)).join('');if(!icons[key])throw new Error(key);writeFileSync(`${root}public/icons/lucide/${name}.svg`,renderToStaticMarkup(createElement(icons[key],{size:24,strokeWidth:2})));}
