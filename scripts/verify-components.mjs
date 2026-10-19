import { execFileSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, symlinkSync, writeFileSync, realpathSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { build, createServer } from 'vite'

const root = fileURLToPath(new URL('../', import.meta.url))
const componentPackage = JSON.parse(readFileSync(join(root, 'packages/react/package.json'), 'utf8'))
const archive = `${componentPackage.name.replace(/^@/, '').replace('/', '-')}-${componentPackage.version}.tgz`
const consumer = mkdtempSync(join(tmpdir(), 'dsm-react-consumer-'))
writeFileSync(join(consumer, 'package.json'), JSON.stringify({ name: 'component-consumer', private: true, type: 'module' }))
execFileSync('npm', ['install', join(root, 'public/packages', archive), '--ignore-scripts', '--legacy-peer-deps', '--no-audit', '--no-fund'], { cwd: consumer, stdio: 'pipe' })
for (const dependency of ['react', 'react-dom', 'lucide-react', '@types']) {
  if (!existsSync(join(consumer, 'node_modules', dependency))) symlinkSync(join(root, 'node_modules', dependency), join(consumer, 'node_modules', dependency), 'dir')
}
writeFileSync(join(consumer, 'tsconfig.json'), JSON.stringify({
  compilerOptions: { strict: true, noEmit: true, jsx: 'react-jsx', module: 'ESNext', moduleResolution: 'bundler', target: 'ES2020', skipLibCheck: true },
  include: ['*.tsx', '*.d.ts'],
}))
writeFileSync(join(consumer, 'styles.d.ts'), "declare module '*.css'\n")
writeFileSync(join(consumer, 'usage.tsx'), `
import { createRef } from 'react'
import { SlateXButton, type SlateXButtonProps } from '@slatex/react'
import { SlateXDropdownItem, SlateXDropdownPanel } from '@slatex/react'
import '@slatex/react/styles.css'
const props: SlateXButtonProps = { kind: 'Danger', size: 'Small', loading: true }
export const button = <SlateXButton {...props} ref={createRef<HTMLButtonElement>()} type="submit" onClick={event => event.currentTarget.focus()} aria-label="保存" />
// @ts-expect-error Unsupported variants must be rejected.
export const invalid = <SlateXButton kind="Unknown" />
export const dropdown = <SlateXDropdownPanel><SlateXDropdownItem selected onClick={event => event.currentTarget.focus()}>Design</SlateXDropdownItem></SlateXDropdownPanel>
`)
const examplesPath = join(root, 'output/component-examples.json')
const examples = existsSync(examplesPath) ? JSON.parse(readFileSync(examplesPath, 'utf8')) : []
for (const example of examples) writeFileSync(join(consumer, `${example.name}.tsx`), example.code)
writeFileSync(join(consumer, 'index.html'), '<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Component package verification</title></head><body><div id="root"></div><script type="module" src="/main.tsx"></script></body></html>')
writeFileSync(join(consumer, 'main.tsx'), readFileSync(join(root, 'tests/consumer.tsx'), 'utf8'))
execFileSync(process.execPath, [join(root, 'node_modules/typescript/bin/tsc'), '-p', join(consumer, 'tsconfig.json')], { stdio: 'inherit' })
await build({ configFile: false, root: consumer, logLevel: 'warn' })
console.log(JSON.stringify({ consumer, packagePath: realpathSync(join(consumer, 'node_modules/@slatex/react')), examples: examples.length, types: 'passed', build: 'passed' }))
if (process.argv.includes('--serve')) {
  const server = await createServer({ configFile: false, root: consumer, server: { host: '127.0.0.1', port: 5174, strictPort: true } })
  await server.listen()
  console.log('Consumer preview: http://127.0.0.1:5174')
}
