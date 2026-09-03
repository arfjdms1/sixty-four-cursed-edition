import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { pathToFileURL } from 'node:url'

const root = new URL('../', import.meta.url)
const rootPath = new URL('.', root).pathname
const output = mkdtempSync(join(tmpdir(), 'sixtyfour-fullscreen-'))

try {
	execFileSync(process.execPath, [
		join(rootPath, 'node_modules/typescript/bin/tsc'),
		'--rootDir', join(rootPath, 'src'),
		'--outDir', output,
		'--noEmit', 'false',
		'--declaration', 'false',
	], { cwd: root, stdio: 'pipe' })
	writeFileSync(join(output, 'package.json'), JSON.stringify({ type: 'module' }))
	const { toggleFullscreen } = await import(pathToFileURL(join(output, 'scripts/ui/fullscreen.js')))

	let passed = 0
	const test = async (name, run) => {
		await run()
		passed++
		console.log(`  ok ${passed} - ${name}`)
	}
	const placeholder = { isPlaceholder: true, send: () => false }

	await test('existing splash fullscreen control is reused', () => {
		const source = readFileSync(join(rootPath, 'src/scripts/ui.ts'), 'utf8')
		assert.match(source, /fullscreen\.classList\.add\(`fullscreen`\)/)
		assert.match(source, /fullscreen\.onclick = _=>\{\s*void toggleFullscreen\(this\.master\.spaceport\)/)
	})

	await test('browser enter calls documentElement.requestFullscreen', async () => {
		let entered = 0
		const doc = { fullscreenElement: null, documentElement: { async requestFullscreen() { entered++ } } }
		await toggleFullscreen(placeholder, doc)
		assert.equal(entered, 1)
	})

	await test('browser exit calls document.exitFullscreen', async () => {
		let exited = 0
		const doc = { fullscreenElement: {}, documentElement: {}, async exitFullscreen() { exited++ } }
		await toggleFullscreen(placeholder, doc)
		assert.equal(exited, 1)
	})

	await test('fullscreenElement is authoritative', async () => {
		const calls = []
		const doc = {
			fullscreenElement: {},
			documentElement: { async requestFullscreen() { calls.push('enter') } },
			async exitFullscreen() { calls.push('exit') },
		}
		await toggleFullscreen(placeholder, doc)
		doc.fullscreenElement = null
		await toggleFullscreen(placeholder, doc)
		assert.deepEqual(calls, ['exit', 'enter'])
	})

	await test('request rejection is handled', async () => {
		const warnings = []
		const originalWarn = console.warn
		console.warn = (...args) => warnings.push(args)
		try {
			const doc = { fullscreenElement: null, documentElement: { requestFullscreen: () => Promise.reject(new Error('denied')) } }
			await assert.doesNotReject(toggleFullscreen(placeholder, doc))
			assert.equal(warnings.length, 1)
		} finally {
			console.warn = originalWarn
		}
	})

	await test('unsupported fullscreen is handled', async () => {
		const warnings = []
		const originalWarn = console.warn
		console.warn = (...args) => warnings.push(args)
		try {
			await toggleFullscreen(placeholder, { fullscreenElement: null, documentElement: {} })
			assert.match(String(warnings[0][0]), /not supported/)
		} finally {
			console.warn = originalWarn
		}
	})

	await test('Electron fullscreen IPC behavior remains intact', async () => {
		const calls = []
		await toggleFullscreen({ send: (...args) => calls.push(args) }, { fullscreenElement: null, documentElement: {} })
		assert.deepEqual(calls, [['toggleFullscreen', '']])
	})

	await test('fullscreen does not alter input handling', () => {
		const input = readFileSync(join(rootPath, 'src/scripts/engine/input/InputSystem.ts'), 'utf8')
		assert.doesNotMatch(input, /requestFullscreen|exitFullscreen|toggleFullscreen/)
	})

	console.log(`fullscreen regression passed (${passed} tests)`)
} finally {
	rmSync(output, { recursive: true, force: true })
}
