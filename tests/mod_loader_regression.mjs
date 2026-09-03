import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { build as viteBuild } from 'vite'
import createViteConfig from '../vite.config.mjs'

const root = new URL('../', import.meta.url)
const output = mkdtempSync(join(tmpdir(), 'sixtyfour-mod-loader-'))

try {
	execFileSync(process.execPath, [
		join(new URL('.', root).pathname, 'node_modules/typescript/bin/tsc'),
		'--rootDir', join(new URL('.', root).pathname, 'src'),
		'--outDir', output,
		'--noEmit', 'false',
		'--declaration', 'false',
	], { cwd: new URL('.', root), stdio: 'pipe' })
	writeFileSync(join(output, 'package.json'), JSON.stringify({ type: 'module' }))

	const moddingRoot = join(output, 'scripts/modding')
	const { ModLoader } = await import(pathToFileURL(join(moddingRoot, 'ModLoader.js')))
	const { discoverBundledMods } = await import(pathToFileURL(join(moddingRoot, 'discoverBundledMods.js')))
	const { validateModManifest } = await import(pathToFileURL(join(moddingRoot, 'manifest.js')))
	const { DEFAULT_MOD_STATE_KEY } = await import(pathToFileURL(join(moddingRoot, 'ModEnabledState.js')))

	class MemoryStorage {
		values = new Map()
		getItem(key) { return this.values.get(key) ?? null }
		setItem(key, value) { this.values.set(key, value) }
	}

	const silentLoggerFactory = () => ({ info() {}, warn() {}, error() {} })
	const manifest = (id, overrides = {}) => ({
		id,
		name: id,
		version: '1.0.0',
		apiVersion: 0,
		...overrides,
	})
	const definition = (id, setup = () => {}, overrides = {}) => ({
		manifest: manifest(id, overrides),
		setup,
	})
	const candidate = (source, value) => ({ source, definition: value })
	const createLoader = (storage = new MemoryStorage()) => new ModLoader({
		storage,
		loggerFactory: silentLoggerFactory,
		onDiagnostic() {},
	})

	let passed = 0
	const test = async (name, run) => {
		await run()
		passed++
		console.log(`  ok ${passed} - ${name}`)
	}
	const rejects = (value, pattern) => assert.throws(() => validateModManifest(value), pattern)

	await test('valid manifest accepted', () => {
		assert.equal(validateModManifest(manifest('example:valid')).id, 'example:valid')
	})
	await test('missing ID rejected', () => rejects({ name: 'Missing', version: '1', apiVersion: 0 }, /id/))
	await test('malformed ID rejected', () => rejects(manifest('not namespaced'), /namespace:name/))
	await test('missing name rejected', () => rejects({ id: 'example:no-name', version: '1', apiVersion: 0 }, /name/))
	await test('missing version rejected', () => rejects({ id: 'example:no-version', name: 'No version', apiVersion: 0 }, /version/))
	await test('unsupported API version rejected', () => rejects(manifest('example:new-api', { apiVersion: 1 }), /Unsupported/))
	await test('duplicate ID rejected deterministically', () => {
		const loader = createLoader()
		loader.discover([candidate('/z.ts', definition('example:duplicate')), candidate('/a.ts', definition('example:duplicate'))])
		assert.equal(loader.mods()[0].status, 'failed')
		assert.match(loader.diagnostics()[0].error.message, /Duplicate mod ID/)
		assert.equal(loader.diagnostics()[0].source, '/a.ts, /z.ts')
	})
	await test('discovery ordering is source deterministic', () => {
		assert.deepEqual(
			discoverBundledMods({
				'/z.ts': definition('example:z'),
				'/a.ts': definition('example:a'),
			}).map(entry => entry.source),
			['/a.ts', '/z.ts'],
		)
	})
	await test('activation ordering is ModId deterministic', async () => {
		const calls = []
		const loader = createLoader()
		loader.discover([
			candidate('/a.ts', definition('example:z', () => calls.push('z'), { enabledByDefault: true })),
			candidate('/z.ts', definition('example:a', () => calls.push('a'), { enabledByDefault: true })),
		])
		await loader.activateEnabled()
		assert.deepEqual(calls, ['a', 'z'])
	})
	await test('disabled mod is not activated', async () => {
		let calls = 0
		const loader = createLoader()
		loader.discover([candidate('/mod.ts', definition('example:disabled', () => calls++))])
		await loader.activateEnabled()
		assert.equal(calls, 0)
		assert.equal(loader.mods()[0].status, 'disabled')
	})
	await test('enabled mod is activated', async () => {
		let calls = 0
		const loader = createLoader()
		loader.discover([candidate('/mod.ts', definition('example:enabled', () => calls++, { enabledByDefault: true }))])
		await loader.activateEnabled()
		assert.equal(calls, 1)
		assert.equal(loader.mods()[0].status, 'active')
	})
	await test('setup is called exactly once', async () => {
		let calls = 0
		const loader = createLoader()
		loader.discover([candidate('/mod.ts', definition('example:once', () => calls++, { enabledByDefault: true }))])
		await loader.activateEnabled()
		await loader.activateEnabled()
		assert.equal(calls, 1)
	})
	await test('concurrent activation callers await the same work', async () => {
		let release
		const gate = new Promise(resolve => { release = resolve })
		const loader = createLoader()
		loader.discover([candidate('/mod.ts', definition('example:concurrent', () => gate, { enabledByDefault: true }))])
		const first = loader.activateEnabled()
		let secondResolved = false
		const second = loader.activateEnabled().then(() => { secondResolved = true })
		await Promise.resolve()
		assert.equal(secondResolved, false)
		release()
		await Promise.all([first, second])
		assert.equal(loader.mods()[0].status, 'active')
	})
	await test('enabled state cannot change while activation is running', async () => {
		let release
		const gate = new Promise(resolve => { release = resolve })
		const loader = createLoader()
		loader.discover([candidate('/mod.ts', definition('example:locked', () => gate, { enabledByDefault: true }))])
		const activation = loader.activateEnabled()
		assert.equal(loader.disable('example:locked'), false)
		release()
		await activation
		assert.equal(loader.mods()[0].enabled, true)
	})
	await test('async setup remains sequential', async () => {
		const calls = []
		const loader = createLoader()
		loader.discover([
			candidate('/a.ts', definition('example:a', async () => { calls.push('a:start'); await Promise.resolve(); calls.push('a:end') }, { enabledByDefault: true })),
			candidate('/b.ts', definition('example:b', () => calls.push('b'), { enabledByDefault: true })),
		])
		await loader.activateEnabled()
		assert.deepEqual(calls, ['a:start', 'a:end', 'b'])
	})
	await test('failed mod does not block following mods', async () => {
		const calls = []
		const loader = createLoader()
		loader.discover([
			candidate('/a.ts', definition('example:a', () => { throw new Error('broken') }, { enabledByDefault: true })),
			candidate('/b.ts', definition('example:b', () => calls.push('b'), { enabledByDefault: true })),
		])
		await loader.activateEnabled()
		assert.deepEqual(calls, ['b'])
	})
	await test('failed status is recorded', async () => {
		const loader = createLoader()
		loader.discover([candidate('/bad.ts', definition('example:bad', () => { throw new Error('broken') }, { enabledByDefault: true }))])
		await loader.activateEnabled()
		assert.equal(loader.mods()[0].status, 'failed')
	})
	await test('error diagnostic records ID and phase', async () => {
		const loader = createLoader()
		loader.discover([candidate('/bad.ts', definition('example:bad', () => { throw new Error('broken') }, { enabledByDefault: true }))])
		await loader.activateEnabled()
		assert.equal(loader.diagnostics()[0].modId, 'example:bad')
		assert.equal(loader.diagnostics()[0].phase, 'setup')
	})
	await test('enable persists', () => {
		const storage = new MemoryStorage()
		const loader = createLoader(storage)
		loader.discover([candidate('/mod.ts', definition('example:persist'))])
		assert.equal(loader.enable('example:persist'), true)
		assert.equal(JSON.parse(storage.getItem(DEFAULT_MOD_STATE_KEY)).enabled['example:persist'], true)
	})
	await test('disable persists', () => {
		const storage = new MemoryStorage()
		const loader = createLoader(storage)
		loader.discover([candidate('/mod.ts', definition('example:persist', () => {}, { enabledByDefault: true }))])
		assert.equal(loader.disable('example:persist'), true)
		assert.equal(JSON.parse(storage.getItem(DEFAULT_MOD_STATE_KEY)).enabled['example:persist'], false)
	})
	await test('unknown persisted IDs are preserved', () => {
		const storage = new MemoryStorage()
		storage.setItem(DEFAULT_MOD_STATE_KEY, JSON.stringify({ version: 0, enabled: { 'missing:mod': true } }))
		const loader = createLoader(storage)
		loader.discover([candidate('/mod.ts', definition('example:known'))])
		loader.enable('example:known')
		assert.deepEqual(JSON.parse(storage.getItem(DEFAULT_MOD_STATE_KEY)).enabled, { 'missing:mod': true, 'example:known': true })
	})
	await test('empty mod set is valid', async () => {
		const loader = createLoader()
		loader.discover([])
		await loader.activateEnabled()
		assert.deepEqual(loader.mods(), [])
	})
	await test('same definition at two sources is a duplicate', () => {
		const shared = definition('example:shared')
		const loader = createLoader()
		loader.discover([candidate('/a.ts', shared), candidate('/b.ts', shared)])
		assert.equal(loader.mods()[0].status, 'failed')
	})
	await test('invalid mod does not block valid discovery', () => {
		const loader = createLoader()
		loader.discover([candidate('/bad.ts', {}), candidate('/good.ts', definition('example:good'))])
		assert.equal(loader.mods()[0].manifest.id, 'example:good')
		assert.equal(loader.diagnostics().length, 1)
	})
	await test('post-activation enable explicitly requires reload', async () => {
		const loader = createLoader()
		loader.discover([candidate('/mod.ts', definition('example:reload'))])
		await loader.activateEnabled()
		loader.enable('example:reload')
		assert.equal(loader.mods()[0].reloadRequired, true)
	})
	await test('setup-failed mod can be disabled persistently', async () => {
		const storage = new MemoryStorage()
		const loader = createLoader(storage)
		loader.discover([candidate('/bad.ts', definition('example:bad', () => { throw new Error('broken') }, { enabledByDefault: true }))])
		await loader.activateEnabled()
		assert.equal(loader.disable('example:bad'), true)
		assert.equal(JSON.parse(storage.getItem(DEFAULT_MOD_STATE_KEY)).enabled['example:bad'], false)
	})
	await test('malformed persisted state records a diagnostic', () => {
		const storage = new MemoryStorage()
		storage.setItem(DEFAULT_MOD_STATE_KEY, '{bad json')
		const loader = createLoader(storage)
		loader.discover([candidate('/mod.ts', definition('example:state'))])
		assert.equal(loader.diagnostics()[0].phase, 'persistence')
	})
	await test('actual Vite build discovers bundled fixture', async () => {
		const viteOutput = join(output, 'vite')
		const result = await viteBuild({
			configFile: false,
			root: join(new URL('.', root).pathname, 'src'),
			publicDir: false,
			logLevel: 'silent',
			build: { outDir: viteOutput, emptyOutDir: true, write: false },
		})
		const outputs = Array.isArray(result) ? result : [result]
		const bundledCode = outputs.flatMap(entry => entry.output)
			.filter(file => file.type === 'chunk')
			.map(file => file.code)
			.join('\n')
		assert.match(bundledCode, /builtin:loader-fixture/)
		assert.match(bundledCode, /builtin:hello-world/)
		assert.match(bundledCode, /builtin:behavior-demo/)
	})
	await test('offline build includes bundled fixture without dynamic module loading', async () => {
		const offlineConfig = createViteConfig({ mode: 'offline' })
		offlineConfig.plugins = offlineConfig.plugins.filter(plugin => plugin.name !== 'copy-static-assets')
		offlineConfig.build = {
			...offlineConfig.build,
			outDir: join(output, 'offline'),
			write: false,
		}
		const result = await viteBuild({ ...offlineConfig, configFile: false, logLevel: 'silent' })
		const outputs = Array.isArray(result) ? result : [result]
		const files = outputs.flatMap(entry => entry.output)
		assert.equal(files.filter(file => file.type === 'chunk').length, 0)
		const html = files
			.find(file => file.type === 'asset' && file.fileName === 'index.html')
		assert.ok(html)
		const htmlSource = String(html.source)
		assert.doesNotMatch(htmlSource, /import\(["']\.\/[^"']+\.js["']\)/)
		assert.doesNotMatch(htmlSource, /data:text\/javascript/)
		assert.match(htmlSource, /builtin:loader-fixture/)
		assert.match(htmlSource, /builtin:hello-world/)
		assert.match(htmlSource, /builtin:behavior-demo/)
	})

	console.log(`mod loader regression passed (${passed} tests)`)
} finally {
	rmSync(output, { recursive: true, force: true })
}
