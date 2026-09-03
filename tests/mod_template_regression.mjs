import assert from 'node:assert/strict'
import { cpSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { join } from 'node:path'

const root = new URL('../', import.meta.url)
const rootPath = new URL('.', root).pathname
const copied = mkdtempSync(join(rootPath, 'src/mods/.template-regression-'))

try {
	cpSync(join(rootPath, 'examples/mod-template/index.ts'), join(copied, 'index.ts'))
	cpSync(join(rootPath, 'examples/mod-template/README.md'), join(copied, 'README.md'))
	const source = readFileSync(join(copied, 'index.ts'), 'utf8')
	assert.match(source, /manifest:/)
	assert.match(source, /setup\(\{ logger \}\)/)
	assert.match(source, /scripts\/modding\/api\/index\.js/)
	assert.doesNotMatch(source, /scripts\/(?:core|engine|registry)\//)
	execFileSync('npm', ['run', 'typecheck'], { cwd: root, stdio: 'pipe' })
	console.log('mod template regression passed (5 tests)')
} finally {
	rmSync(copied, { recursive: true, force: true })
}
