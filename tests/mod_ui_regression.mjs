import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { pathToFileURL } from 'node:url'

const root = new URL('../', import.meta.url)
const rootPath = new URL('.', root).pathname
const output = mkdtempSync(join(tmpdir(), 'sixtyfour-mod-ui-'))

try {
	execFileSync(process.execPath, [
		join(rootPath, 'node_modules/typescript/bin/tsc'),
		'--rootDir', join(rootPath, 'src'),
		'--outDir', output,
		'--noEmit', 'false',
		'--declaration', 'false',
	], { cwd: root, stdio: 'pipe' })
	writeFileSync(join(output, 'package.json'), JSON.stringify({ type: 'module' }))

	const moddingRoot = join(output, 'scripts/modding')
	const { ModLoader } = await import(pathToFileURL(join(moddingRoot, 'ModLoader.js')))
	const { ModUiState } = await import(pathToFileURL(join(moddingRoot, 'ModUi.js')))
	const api = await import(pathToFileURL(join(moddingRoot, 'api/index.js')))

	class MemoryStorage {
		values = new Map()
		getItem(key) { return this.values.get(key) ?? null }
		setItem(key, value) { this.values.set(key, value) }
	}
	const definition = (id, setup) => ({ manifest: { id, name: id, version: '1.0.0', apiVersion: 0, enabledByDefault: true }, setup })
	const activate = async (definitions, uiHost = new ModUiState()) => {
		const loader = new ModLoader({ storage: new MemoryStorage(), uiHost, loggerFactory: () => ({ info() {}, warn() {}, error() {} }), onDiagnostic() {} })
		loader.discover(definitions.map((value, index) => ({ source: `/${index}.ts`, definition: value })))
		await loader.activateEnabled()
		return { loader, uiHost }
	}

	let passed = 0
	const test = async (name, run) => {
		await run()
		passed++
		console.log(`  ok ${passed} - ${name}`)
	}

	await test('ModContext exposes ui', async () => {
		let seen
		await activate([definition('test:context', context => { seen = context.ui })])
		assert.equal(typeof seen.setVisible, 'function')
	})

	await test('ModEntityContext does not expose ui', () => {
		const types = readFileSync(join(rootPath, 'src/scripts/modding/types.ts'), 'utf8')
		const entityContext = types.match(/export interface ModEntityContext \{([\s\S]*?)\n\}/)[1]
		assert.doesNotMatch(entityContext, /\bui\b/)
	})

	await test('allowed target is accepted', async () => {
		const { loader } = await activate([definition('test:allowed', context => context.ui.setVisible('steam-warning', false))])
		assert.equal(loader.mods()[0].status, 'active')
	})

	await test('unknown target is rejected', async () => {
		const { loader } = await activate([definition('test:unknown', context => context.ui.setVisible('arbitrary-selector', false))])
		assert.equal(loader.mods()[0].status, 'failed')
		assert.match(loader.diagnostics()[0].error.message, /Unknown mod UI target/)
	})

	await test('hide request changes desired state', async () => {
		const { uiHost } = await activate([definition('test:hide', context => context.ui.setVisible('steam-warning', false))])
		assert.equal(uiHost.isVisible('steam-warning'), false)
	})

	await test('show and default state are visible', () => {
		const state = new ModUiState()
		assert.equal(state.isVisible('steam-warning'), true)
		state.setVisible('test:owner', 'steam-warning', false)
		state.setVisible('test:owner', 'steam-warning', true)
		assert.equal(state.isVisible('steam-warning'), true)
	})

	await test('request is attributed to current ModId', async () => {
		const { uiHost } = await activate([definition('test:owner', context => context.ui.setVisible('steam-warning', false))])
		assert.deepEqual(uiHost.hiddenBy('steam-warning'), ['test:owner'])
	})

	await test('multiple hide requests compose independently of order', async () => {
		const { uiHost } = await activate([
			definition('test:z', context => context.ui.setVisible('steam-warning', false)),
			definition('test:a', context => context.ui.setVisible('steam-warning', false)),
		])
		uiHost.setVisible('test:a', 'steam-warning', true)
		assert.equal(uiHost.isVisible('steam-warning'), false)
		assert.deepEqual(uiHost.hiddenBy('steam-warning'), ['test:z'])
	})

	await test('UI facade returns no raw DOM object', async () => {
		let ui
		await activate([definition('test:shape', context => { ui = context.ui })])
		assert.deepEqual(Object.keys(ui), ['setVisible'])
		assert.equal('document' in ui, false)
		assert.equal('querySelector' in ui, false)
		assert.equal('commit' in ui, false)
		assert.equal('discard' in ui, false)
	})

	await test('public API exports no DOM or internal UI service', () => {
		for (const name of ['Document', 'Window', 'Element', 'HTMLElement', 'ModUiState', 'Game']) assert.equal(name in api, false)
		const publicEntry = readFileSync(join(rootPath, 'src/scripts/modding/api/index.ts'), 'utf8')
		assert.match(publicEntry, /ModUiTargetId, ModUiApi/)
		assert.doesNotMatch(publicEntry, /ModUiHost|ModUiState|Document|Window|HTMLElement|Element/)
	})

	await test('setup-before-DOM works', async () => {
		assert.equal('document' in globalThis, false)
		const { uiHost } = await activate([definition('test:no-dom', context => context.ui.setVisible('steam-warning', false))])
		assert.equal(uiHost.isVisible('steam-warning'), false)
	})

	await test('later UI creation observes desired state', async () => {
		const { uiHost } = await activate([definition('test:later', context => context.ui.setVisible('steam-warning', false))])
		const gameSource = readFileSync(join(rootPath, 'src/scripts/core/Game.ts'), 'utf8')
		assert.equal(uiHost.isVisible('steam-warning'), false)
		assert.match(gameSource, /if \(!this\.hasSteam && steamWarningVisible\) this\.showSteamWarning\(\)/)
	})

	await test('failed setup discards staged UI requests', async () => {
		const { uiHost } = await activate([definition('test:failed', context => {
			context.ui.setVisible('steam-warning', false)
			throw new Error('fail')
		})])
		assert.equal(uiHost.isVisible('steam-warning'), true)
	})

	await test('retained UI facade closes after setup', async () => {
		let ui
		await activate([definition('test:closed', context => { ui = context.ui })])
		assert.throws(() => ui.setVisible('steam-warning', false), /after mod setup/)
	})

	await test('synchronous setup closes before queued microtasks', async () => {
		let lateError
		const { uiHost } = await activate([definition('test:microtask', context => {
			queueMicrotask(() => {
				try { context.ui.setVisible('steam-warning', false) }
				catch (error) { lateError = error }
			})
		})])
		await Promise.resolve()
		assert.match(lateError.message, /after mod setup/)
		assert.equal(uiHost.isVisible('steam-warning'), true)
	})

	await test('mods cannot commit their own staged UI request', async () => {
		const { loader, uiHost } = await activate([definition('test:no-commit', context => {
			assert.equal('commit' in context.ui, false)
			context.ui.setVisible('steam-warning', false)
			throw new Error('rollback')
		})])
		assert.equal(loader.mods()[0].status, 'failed')
		assert.equal(uiHost.isVisible('steam-warning'), true)
	})

	console.log(`mod UI regression passed (${passed} tests)`)
} finally {
	rmSync(output, { recursive: true, force: true })
}
