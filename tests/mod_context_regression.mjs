import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, rmSync, writeFileSync, readFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { build as viteBuild } from 'vite'
import createViteConfig from '../vite.config.mjs'

const root = new URL('../', import.meta.url)
const output = mkdtempSync(join(tmpdir(), 'sixtyfour-mod-context-'))

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
	const contentRoot = join(output, 'scripts/content')
	const registryRoot = join(output, 'scripts/registry')
	const { ModLoader } = await import(pathToFileURL(join(moddingRoot, 'ModLoader.js')))
	const { discoverBundledMods } = await import(pathToFileURL(join(moddingRoot, 'discoverBundledMods.js')))
	const { DEFAULT_MOD_STATE_KEY } = await import(pathToFileURL(join(moddingRoot, 'ModEnabledState.js')))
	const { ContentBuilder } = await import(pathToFileURL(join(contentRoot, 'ContentContext.js')))
	const { registerBaseContent } = await import(pathToFileURL(join(contentRoot, 'registerBaseContent.js')))
		const api = await import(pathToFileURL(join(moddingRoot, 'api/index.js')))

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
	const createLoader = (storage = new MemoryStorage(), loggerFactory = silentLoggerFactory) => new ModLoader({
		storage,
		loggerFactory,
		onDiagnostic() {},
	})

	let passed = 0
	const test = async (name, run) => {
		await run()
		passed++
		console.log(`  ok ${passed} - ${name}`)
	}

	await test('ModContext contains correct mod ID', async () => {
		let seen = null
		const loader = createLoader()
		loader.discover([candidate('/mod.ts', definition('example:ctx', ctx => { seen = ctx.mod.id }, { enabledByDefault: true }))])
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		await loader.activateEnabled(builder)
		assert.equal(seen, 'example:ctx')
	})

	await test('logger attribution', async () => {
		let logged = null
		const loader = new ModLoader({
			storage: new MemoryStorage(),
			loggerFactory: id => ({
				info: msg => { logged = `${id}:${msg}` },
				warn() {},
				error() {},
			}),
			onDiagnostic() {},
		})
		loader.discover([candidate('/mod.ts', definition('example:log', ctx => ctx.logger.info('hello'), { enabledByDefault: true }))])
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		await loader.activateEnabled(builder)
		assert.equal(logged, 'example:log:hello')
	})

	await test('public API exports no Game', () => {
		assert.equal('Game' in api, false)
		assert.equal('master' in api, false)
	})
	await test('public API exports no EntityHost', () => {
		assert.equal('EntityHost' in api, false)
	})
	await test('public API exports no EntityManager', () => {
		assert.equal('EntityManager' in api, false)
	})
	await test('public API exports no raw EntityContext', () => {
		assert.equal('EntityContext' in api, false)
		assert.equal('EntityContextHost' in api, false)
	})
	await test('public API does not leak RenderSystem or ResourceSystem', () => {
		assert.equal('RenderSystem' in api, false)
		assert.equal('ResourceSystem' in api, false)
		assert.equal('Game' in api, false)
	})

	await test('register unique entity ID', async () => {
		const loader = createLoader()
		loader.discover([candidate('/mod.ts', definition('example:unique', ctx => {
			ctx.content.registerEntity({ id: 'example:unique-entity' })
		}, { enabledByDefault: true }))])
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		await loader.activateEnabled(builder)
		const content = builder.finalize()
		assert.ok(content.entityDefinitions.some(d => d.id === 'example:unique-entity'))
	})

	await test('duplicate entity ID rejected', async () => {
		const loader = createLoader()
		loader.discover([candidate('/mod.ts', definition('example:dup', ctx => {
			ctx.content.registerEntity({ id: 'pump' })
		}, { enabledByDefault: true }))])
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		await loader.activateEnabled(builder)
		assert.equal(loader.mods()[0].status, 'failed')
		assert.match(loader.diagnostics()[0].error.message, /Duplicate entity ID/)
	})

	await test('deterministic entity registration order', async () => {
		const loader = createLoader()
		loader.discover([
			candidate('/a.ts', definition('example:z', ctx => {
				ctx.content.registerEntity({ id: 'example:z-entity' })
			}, { enabledByDefault: true })),
			candidate('/z.ts', definition('example:a', ctx => {
				ctx.content.registerEntity({ id: 'example:a-entity' })
			}, { enabledByDefault: true })),
		])
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		await loader.activateEnabled(builder)
		const content = builder.finalize()
		const ids = content.entityDefinitions.map(d => d.id)
		const zi = ids.indexOf('example:z-entity')
		const ai = ids.indexOf('example:a-entity')
		assert.ok(ai < zi, `a should come before z due to ModId ordering: ${ids}`)
	})

	await test('synthetic 59th/base+mod entity still works', async () => {
		const loader = createLoader()
		loader.discover([candidate('/mod.ts', definition('example:synthetic', ctx => {
			ctx.content.registerEntity({ id: 'synthetic59' })
		}, { enabledByDefault: true }))])
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		await loader.activateEnabled(builder)
		const content = builder.finalize()
		assert.equal(content.entityDefinitions.length, 59)
		assert.ok(content.entityDefinitions.some(d => d.id === 'synthetic59'))
	})

	await test('post-finalize registration rejected', async () => {
		const loader = createLoader()
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		let contextRef = null
		loader.discover([candidate('/mod.ts', definition('example:post', ctx => { contextRef = ctx; ctx.content.registerEntity({ id: 'example:post-ok' }) }, { enabledByDefault: true }))])
		await loader.activateEnabled(builder)
		builder.finalize()
		assert.throws(() => contextRef.content.registerEntity({ id: 'example:post-fail' }), /Cannot register content after/)
	})

	await test('registration failure attributed to mod', async () => {
		const loader = createLoader()
		loader.discover([candidate('/mod.ts', definition('example:fail', ctx => {
			ctx.content.registerEntity({ id: 'pump' })
		}, { enabledByDefault: true }))])
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		await loader.activateEnabled(builder)
		assert.equal(loader.diagnostics()[0].modId, 'example:fail')
		assert.equal(loader.diagnostics()[0].phase, 'setup')
	})

	await test('one mod registration failure does not corrupt unrelated mod diagnostics', async () => {
		const loader = createLoader()
		loader.discover([
			candidate('/a.ts', definition('example:a', ctx => {
				ctx.content.registerEntity({ id: 'pump' })
			}, { enabledByDefault: true })),
			candidate('/b.ts', definition('example:b', ctx => {
				ctx.content.registerEntity({ id: 'example:b-entity' })
			}, { enabledByDefault: true })),
		])
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		await loader.activateEnabled(builder)
		const mods = loader.mods()
		const a = mods.find(m => m.manifest.id === 'example:a')
		const b = mods.find(m => m.manifest.id === 'example:b')
		assert.equal(a.status, 'failed')
		assert.equal(b.status, 'active')
		assert.equal(loader.diagnostics().length, 1)
	})

	await test('resource metadata registration', async () => {
		const loader = createLoader()
		loader.discover([candidate('/mod.ts', definition('example:res', ctx => {
			ctx.content.registerResource({ id: 'example:custom-res', name: 'Custom', sfx: 'tap1', triplet: ['#111','#222','#333'] })
		}, { enabledByDefault: true }))])
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		await loader.activateEnabled(builder)
		const content = builder.finalize()
		assert.ok(content.resourceDefinitions.some(d => d.id === 'example:custom-res'))
	})

	await test('duplicate resource rejected', async () => {
		const loader = createLoader()
		loader.discover([candidate('/mod.ts', definition('example:dup-res', ctx => {
			ctx.content.registerResource({ id: 'charonite', name: 'Dup', sfx: 'tap1', triplet: ['#111','#222','#333'] })
		}, { enabledByDefault: true }))])
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		await loader.activateEnabled(builder)
		assert.equal(loader.mods()[0].status, 'failed')
	})

	await test('synthetic 11th resource remains supported', async () => {
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		const loader = createLoader()
		loader.discover([candidate('/mod.ts', definition('example:synth-res', ctx => {
			ctx.content.registerResource({ id: 'synthetic-res-11', name: 'Synthetic', sfx: 'tap1', triplet: ['#111','#222','#333'] })
		}, { enabledByDefault: true }))])
		await loader.activateEnabled(builder)
		const content = builder.finalize()
		assert.equal(content.resourceDefinitions.length, 11)
		assert.ok(content.resourceDefinitions.some(d => d.id === 'synthetic-res-11'))
	})

	await test('setup receives correct ModContext', async () => {
		let ctxSeen = null
		const loader = createLoader()
		loader.discover([candidate('/mod.ts', definition('example:ctx2', ctx => { ctxSeen = ctx }, { enabledByDefault: true }))])
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		await loader.activateEnabled(builder)
		assert.equal(ctxSeen.mod.id, 'example:ctx2')
		assert.equal(typeof ctxSeen.logger.info, 'function')
		assert.equal(typeof ctxSeen.content.registerEntity, 'function')
		assert.equal(typeof ctxSeen.content.registerResource, 'function')
		assert.equal(typeof ctxSeen.ui.setVisible, 'function')
	})

	await test('async setup still works', async () => {
		const order = []
		const loader = createLoader()
		loader.discover([
			candidate('/a.ts', definition('example:a', async ctx => {
				await Promise.resolve()
				ctx.content.registerEntity({ id: 'example:async-a' })
				order.push('a')
			}, { enabledByDefault: true })),
			candidate('/b.ts', definition('example:b', ctx => {
				ctx.content.registerEntity({ id: 'example:async-b' })
				order.push('b')
			}, { enabledByDefault: true })),
		])
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		await loader.activateEnabled(builder)
		assert.deepEqual(order, ['a','b'])
		const content = builder.finalize()
		assert.ok(content.entityDefinitions.some(d => d.id === 'example:async-a'))
	})

	await test('loader failure isolation still works', async () => {
		const calls = []
		const loader = createLoader()
		loader.discover([
			candidate('/a.ts', definition('example:a', () => { throw new Error('broken') }, { enabledByDefault: true })),
			candidate('/b.ts', definition('example:b', ctx => {
				ctx.content.registerEntity({ id: 'example:b-ok' })
				calls.push('b')
			}, { enabledByDefault: true })),
		])
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		await loader.activateEnabled(builder)
		assert.deepEqual(calls, ['b'])
	})

	await test('disabled mod receives no context/setup', async () => {
		let called = false
		const loader = createLoader()
		loader.discover([candidate('/mod.ts', definition('example:disabled', () => { called = true }))])
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		await loader.activateEnabled(builder)
		assert.equal(called, false)
	})

	await test('fixture/proof mod discovery', async () => {
		const viteOutput = join(output, 'vite-context')
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
		assert.match(bundledCode, /builtin:context-fixture/)
		assert.match(bundledCode, /builtin:hello-world/)
		assert.match(bundledCode, /builtin:behavior-demo/)
		assert.match(bundledCode, /builtin:hide-banner/)
	})

	await test('default fixture remains behaviorally inert', async () => {
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		const content = builder.finalize()
		assert.equal(content.entityDefinitions.length, 58)
		assert.equal(content.resourceDefinitions.length, 10)
	})

	await test('API version remains 0', async () => {
		let seen = null
		const loader = createLoader()
		loader.discover([candidate('/mod.ts', definition('example:ver', ctx => { seen = ctx.mod.apiVersion }, { enabledByDefault: true }))])
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		await loader.activateEnabled(builder)
		assert.equal(seen, 0)
	})

	await test('partial setup failure is per-mod transactional', async () => {
		const loader = createLoader()
		loader.discover([candidate('/mod.ts', definition('example:partial', ctx => {
			ctx.content.registerEntity({ id: 'example:partial-entity' })
			throw new Error('fail after register')
		}, { enabledByDefault: true }))])
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		await loader.activateEnabled(builder)
		const content = builder.finalize()
		assert.equal(content.entityDefinitions.some(d => d.id === 'example:partial-entity'), false)
		assert.equal(loader.mods()[0].status, 'failed')
	})

	await test('public API does not expose Entity for subclassing', () => {
		assert.equal('Entity' in api, false)
	})

	await test('ModContext has no reachable Game/master/host escape hatch', async () => {
		let seen = null
		const loader = createLoader()
		loader.discover([candidate('/mod.ts', definition('example:escape', ctx => { seen = ctx }, { enabledByDefault: true }))])
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		await loader.activateEnabled(builder)
		assert.equal('master' in seen, false)
		assert.equal('game' in seen, false)
		assert.equal('EntityHost' in seen, false)
		assert.equal('entityContext' in seen, false)
		assert.equal('EntityManager' in seen, false)
		assert.equal('context' in seen.content, false)
		assert.equal('document' in seen.ui, false)
		assert.equal('window' in seen.ui, false)
		assert.equal('querySelector' in seen.ui, false)
		assert.equal(typeof seen.content.registerEntity, 'function')
	})

	await test('compile-time leak fixture is rejected', () => {
		const fixtureDir = mkdtempSync(join(new URL('.', root).pathname, 'tests/.tmp-boundary-'))
		try {
			const good = `
import type { ModDefinition } from '../../src/scripts/modding/api/index.ts'
const mod: ModDefinition = {
  manifest: { id: 'test:good', name: 'good', version: '1.0.0', apiVersion: 0 },
  setup(ctx) {
    ctx.content.registerEntity({ id: 'test:good-entity' })
    ctx.ui.setVisible('steam-warning', false)
  }
}
export default mod
`
			const bad = `
import { Entity } from '../../src/scripts/modding/api/index.ts'
class Evil extends Entity {
  probe() { return (this as unknown as { master: unknown }).master }
}
`
			const badMaster = `
import type { ModDefinition } from '../../src/scripts/modding/api/index.ts'
import { Entity } from '../../src/scripts/modding/api/index.ts'
class Evil extends Entity {
  probe() { return this.master }
}
`
			const badUi = `
import type { ModDefinition } from '../../src/scripts/modding/api/index.ts'
const mod: ModDefinition = {
  manifest: { id: 'test:bad-ui', name: 'bad ui', version: '1.0.0', apiVersion: 0 },
  setup(ctx) { ctx.ui.setVisible('.steamWarning', false) }
}
export default mod
`
			writeFileSync(join(fixtureDir, 'good.ts'), good)
			writeFileSync(join(fixtureDir, 'bad.ts'), bad)
			writeFileSync(join(fixtureDir, 'badMaster.ts'), badMaster)
			writeFileSync(join(fixtureDir, 'badUi.ts'), badUi)
			writeFileSync(join(fixtureDir, 'tsconfig.good.json'), JSON.stringify({
				extends: '../../tsconfig.json',
				include: ['good.ts'],
				compilerOptions: { noEmit: true, skipLibCheck: true },
			}))
			// good should compile
			execFileSync(process.execPath, [join(new URL('.', root).pathname, 'node_modules/typescript/bin/tsc'), '--p', join(fixtureDir, 'tsconfig.good.json')], { cwd: new URL('.', root), stdio: 'pipe' })
			// bad should fail because Entity not exported
			writeFileSync(join(fixtureDir, 'tsconfig.bad.json'), JSON.stringify({
				extends: '../../tsconfig.json',
				include: ['bad.ts'],
				compilerOptions: { noEmit: true, skipLibCheck: true },
			}))
			let failed = false
			try {
				execFileSync(process.execPath, [join(new URL('.', root).pathname, 'node_modules/typescript/bin/tsc'), '--p', join(fixtureDir, 'tsconfig.bad.json')], { cwd: new URL('.', root), stdio: 'pipe' })
			} catch (e) {
				failed = true
				const out = (e.stdout?.toString() ?? '') + (e.stderr?.toString() ?? '')
				assert.match(out, /has no exported member .Entity./)
			}
			assert.equal(failed, true)
			writeFileSync(join(fixtureDir, 'tsconfig.badMaster.json'), JSON.stringify({
				extends: '../../tsconfig.json',
				include: ['badMaster.ts'],
				compilerOptions: { noEmit: true, skipLibCheck: true },
			}))
			failed = false
			try {
				execFileSync(process.execPath, [join(new URL('.', root).pathname, 'node_modules/typescript/bin/tsc'), '--p', join(fixtureDir, 'tsconfig.badMaster.json')], { cwd: new URL('.', root), stdio: 'pipe' })
			} catch (e) {
				failed = true
				const out = (e.stdout?.toString() ?? '') + (e.stderr?.toString() ?? '')
				assert.match(out, /has no exported member .Entity.|master/)
			}
			assert.equal(failed, true)
			writeFileSync(join(fixtureDir, 'tsconfig.badUi.json'), JSON.stringify({
				extends: '../../tsconfig.json',
				include: ['badUi.ts'],
				compilerOptions: { noEmit: true, skipLibCheck: true },
			}))
			failed = false
			try {
				execFileSync(process.execPath, [join(new URL('.', root).pathname, 'node_modules/typescript/bin/tsc'), '--p', join(fixtureDir, 'tsconfig.badUi.json')], { cwd: new URL('.', root), stdio: 'pipe' })
			} catch (e) {
				failed = true
				const out = (e.stdout?.toString() ?? '') + (e.stderr?.toString() ?? '')
				assert.match(out, /not assignable to parameter of type/)
			}
			assert.equal(failed, true)
		} finally {
			rmSync(fixtureDir, { recursive: true, force: true })
		}
	})

	console.log(`mod context regression passed (${passed} tests)`)
} finally {
	rmSync(output, { recursive: true, force: true })
}
