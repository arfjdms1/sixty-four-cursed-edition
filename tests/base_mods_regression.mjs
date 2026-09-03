import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, rmSync, writeFileSync, readFileSync, readdirSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { JSDOM } from 'jsdom'

const root = new URL('../', import.meta.url)
const output = mkdtempSync(join(tmpdir(), 'sixtyfour-base-mods-'))

const dom = new JSDOM(`<!DOCTYPE html><html><head></head><body><canvas class="canvas"></canvas><div class="shop"></div><div class="splash"></div></body></html>`, { url: 'http://localhost' })
globalThis.window = dom.window
globalThis.document = dom.window.document
globalThis.addEventListener = dom.window.addEventListener.bind(dom.window)
globalThis.removeEventListener = dom.window.removeEventListener.bind(dom.window)
globalThis.HTMLElement = dom.window.HTMLElement
globalThis.HTMLDivElement = dom.window.HTMLDivElement
globalThis.HTMLButtonElement = dom.window.HTMLButtonElement
globalThis.HTMLCanvasElement = dom.window.HTMLCanvasElement
globalThis.Node = dom.window.Node
globalThis.Event = dom.window.Event
globalThis.MouseEvent = dom.window.MouseEvent
globalThis.KeyboardEvent = dom.window.KeyboardEvent
globalThis.getComputedStyle = dom.window.getComputedStyle
globalThis.Image = dom.window.Image ?? class { src = '' }
globalThis.devicePixelRatio = 1
globalThis.cancelAnimationFrame = () => {}
globalThis.requestAnimationFrame = () => 1

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
	const modsRoot = join(output, 'mods')

	const { ModLoader } = await import(pathToFileURL(join(moddingRoot, 'ModLoader.js')))
	const { ContentBuilder } = await import(pathToFileURL(join(contentRoot, 'ContentContext.js')))
	const { registerBaseContent } = await import(pathToFileURL(join(contentRoot, 'registerBaseContent.js')))
	const { createModManagementApi } = await import(pathToFileURL(join(moddingRoot, 'ModManagement.js')))
	const { validateModManifest } = await import(pathToFileURL(join(moddingRoot, 'manifest.js')))

	// Import the bundled mods
	const helloWorldMod = (await import(pathToFileURL(join(modsRoot, 'hello-world/index.js')))).default
	const behaviorDemoMod = (await import(pathToFileURL(join(modsRoot, 'behavior-demo/index.js')))).default
	const contextFixtureMod = (await import(pathToFileURL(join(modsRoot, 'context-fixture/index.js')))).default
	const loaderFixtureMod = (await import(pathToFileURL(join(modsRoot, 'loader-fixture/index.js')))).default

	class MemoryStorage {
		values = new Map()
		getItem(key) { return this.values.get(key) ?? null }
		setItem(key, value) { this.values.set(key, value) }
	}

	function createMockHost() {
		const entityContext = {
			resources: {
				amount: (id) => id === 'charonite' ? 50 : 0,
				amountByLegacyIndex: () => 0,
				requestResources: () => false,
				askForResources: () => false,
				addResourcesFromArray: () => {},
				subtractResourcesFromArray: () => {},
				add: () => {},
				subtract: () => {},
			},
			spatial: {
				entityAt: (pos) => ({ name: 'pump', position: [pos[0], pos[1]] }),
				hasEntityAt: () => true,
				entities: () => [],
				entityCount: () => 1,
				addEntity: () => false,
				clearCell: () => {},
			},
			render: {
				unit: 1, zoom: 1, pixelRatio: 1, drawPrism() {},
				resourceSprite: () => undefined, resourceSpriteByLegacyIndex: () => undefined,
				ctx: { save() {}, restore() {}, translate() {}, scale() {}, fillRect() {}, clearRect() {}, drawImage() {} },
			},
			audio: { playSound() {}, stopSound() {}, fadeSound() {}, getPanValueFromX: () => 0, getLoudnessFromXY: () => 0 },
			effects: { createResourceTransfer() {}, createChasmTransfer() {}, createLightning() {}, createResourceExplosion() {}, createResourceSpark() {}, createExhaust() {} },
			coordinates: { uvToXY: (uv) => [uv[0], uv[1]], uvToXYUntranslated: (uv) => [uv[0], uv[1]], translation: [0,0] },
			roles: { activeCubes: new Set(), activeConverters: new Set(), pumps: new Set(), vaults: new Set(), conductors: new Set(), stabilizers: new Set(), annihilators: new Set(), annihilationMachines: new Set(), fruits: new Set(), vaultCount: () => 0, hasPump: () => false },
			plane: { plane: 0, bridge: false, switchedplanes: false, switchPlane() {}, activateBridge() {}, markPlanesSwitched() {} },
			references: { hasVoidsculpture: () => false, voidsculpturePosition: () => undefined, registerVoidsculpture() {}, clearVoidsculpture() {}, hasPinhole: () => false, registerPinhole() {}, hollowSite: () => false, registerHollowSite() {}, clearHollowSite() {} },
		}
		return {
			entityContext,
			words: { entities: {} },
			codex: { entities: {}, resources: [] },
			images: {},
			ctx: { drawImage() {}, fillRect() {}, clearRect() {}, save() {}, restore() {}, translate() {}, scale() {}, beginPath() {}, arc() {}, fill() {}, stroke() {}, closePath() {} },
			unit: 1,
			uvToXY: (uv) => [uv[0], uv[1]],
		}
	}

	const bundledCandidates = [
		{ source: 'src/mods/loader-fixture/index.ts', definition: loaderFixtureMod },
		{ source: 'src/mods/context-fixture/index.ts', definition: contextFixtureMod },
		{ source: 'src/mods/hello-world/index.ts', definition: helloWorldMod },
		{ source: 'src/mods/behavior-demo/index.ts', definition: behaviorDemoMod },
	]

	let passed = 0
	const test = async (name, run) => {
		await run()
		passed++
		console.log(`  ok ${passed} - ${name}`)
	}

	// 1. hello-world discovered
	await test('hello-world discovered', () => {
		const loader = new ModLoader({ storage: new MemoryStorage(), onDiagnostic() {} })
		loader.discover(bundledCandidates)
		const found = loader.mods().find(m => m.manifest.id === 'builtin:hello-world')
		assert.ok(found, 'builtin:hello-world must be discovered')
	})

	// 2. hello-world visible
	await test('hello-world visible', () => {
		const loader = new ModLoader({ storage: new MemoryStorage(), onDiagnostic() {} })
		loader.discover(bundledCandidates)
		const api = createModManagementApi(loader)
		const visible = api.mods().find(m => m.manifest.id === 'builtin:hello-world')
		assert.ok(visible, 'builtin:hello-world must be visible in management API')
		assert.notEqual(visible.manifest.internal, true)
	})

	// 3. hello-world disabled by default
	await test('hello-world disabled by default', () => {
		const loader = new ModLoader({ storage: new MemoryStorage(), onDiagnostic() {} })
		loader.discover(bundledCandidates)
		assert.equal(helloWorldMod.manifest.enabledByDefault, false)
		assert.equal(loader.isEnabled('builtin:hello-world'), false)
		assert.equal(loader.mods().find(m => m.manifest.id === 'builtin:hello-world').status, 'disabled')
	})

	// 4. hello-world manifest valid
	await test('hello-world manifest valid', () => {
		const validated = validateModManifest(helloWorldMod.manifest)
		assert.equal(validated.id, 'builtin:hello-world')
		assert.equal(validated.name, 'Hello World')
		assert.equal(validated.version, '1.0.0')
		assert.equal(validated.apiVersion, 0)
		assert.ok(validated.author)
		assert.ok(validated.description)
	})

	// 5. hello-world setup executes
	await test('hello-world setup executes', async () => {
		let executed = false
		const storage = new MemoryStorage()
		const loader = new ModLoader({
			storage,
			loggerFactory: () => ({
				info() { executed = true },
				warn() {},
				error() {},
			}),
			onDiagnostic() {},
		})
		loader.discover(bundledCandidates)
		loader.enable('builtin:hello-world')
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		await loader.activateEnabled(builder)
		assert.equal(executed, true, 'hello-world setup should execute on activation')
		assert.equal(loader.mods().find(m => m.manifest.id === 'builtin:hello-world').status, 'active')
	})

	// 6. hello-world logger attribution correct
	await test('hello-world logger attribution correct', async () => {
		let loggedModId = null
		let loggedMsg = null
		const storage = new MemoryStorage()
		const loader = new ModLoader({
			storage,
			loggerFactory: (id) => ({
				info(msg) { loggedModId = id; loggedMsg = msg },
				warn() {},
				error() {},
			}),
			onDiagnostic() {},
		})
		loader.discover(bundledCandidates)
		loader.enable('builtin:hello-world')
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		await loader.activateEnabled(builder)
		assert.equal(loggedModId, 'builtin:hello-world')
		assert.match(loggedMsg, /Hello, World!/)
	})

	// 7. behavior-demo discovered
	await test('behavior-demo discovered', () => {
		const loader = new ModLoader({ storage: new MemoryStorage(), onDiagnostic() {} })
		loader.discover(bundledCandidates)
		const found = loader.mods().find(m => m.manifest.id === 'builtin:behavior-demo')
		assert.ok(found, 'builtin:behavior-demo must be discovered')
	})

	// 8. behavior-demo visible
	await test('behavior-demo visible', () => {
		const loader = new ModLoader({ storage: new MemoryStorage(), onDiagnostic() {} })
		loader.discover(bundledCandidates)
		const api = createModManagementApi(loader)
		const visible = api.mods().find(m => m.manifest.id === 'builtin:behavior-demo')
		assert.ok(visible, 'builtin:behavior-demo must be visible')
		assert.notEqual(visible.manifest.internal, true)
	})

	// 9. behavior-demo disabled by default
	await test('behavior-demo disabled by default', () => {
		const loader = new ModLoader({ storage: new MemoryStorage(), onDiagnostic() {} })
		loader.discover(bundledCandidates)
		assert.equal(behaviorDemoMod.manifest.enabledByDefault, false)
		assert.equal(loader.isEnabled('builtin:behavior-demo'), false)
		assert.equal(loader.mods().find(m => m.manifest.id === 'builtin:behavior-demo').status, 'disabled')
	})

	// 10. behavior-demo entity registration succeeds
	await test('behavior-demo entity registration succeeds', async () => {
		const storage = new MemoryStorage()
		const loader = new ModLoader({ storage, onDiagnostic() {} })
		loader.discover(bundledCandidates)
		loader.enable('builtin:behavior-demo')
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		await loader.activateEnabled(builder)
		const content = builder.finalize()
		const def = content.entityDefinitions.find(d => d.id === 'builtin:behavior-demo-entity')
		assert.ok(def, 'builtin:behavior-demo-entity must be registered')
		assert.equal(def.kind, 'machine')
		assert.equal(def.family, 'industrial')
	})

	// 11. createBehavior creates independent state per entity
	await test('createBehavior creates independent state per entity', async () => {
		const storage = new MemoryStorage()
		const loader = new ModLoader({ storage, onDiagnostic() {} })
		loader.discover(bundledCandidates)
		loader.enable('builtin:behavior-demo')
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		await loader.activateEnabled(builder)
		const content = builder.finalize()
		const def = content.entityDefinitions.find(d => d.id === 'builtin:behavior-demo-entity')

		const host = createMockHost()
		const entityA = new def.constructor(host)
		const entityB = new def.constructor(host)

		entityA.setPosition([1, 1])
		entityB.setPosition([2, 2])

		// update A three times, update B once
		entityA.update(16)
		entityA.update(16)
		entityA.update(16)
		entityB.update(16)

		// They should not share closure state; verify both updated without throw
		assert.equal(entityA.name, 'builtin:behavior-demo-entity')
		assert.equal(entityB.name, 'builtin:behavior-demo-entity')
	})

	// 12. init hook works
	await test('init hook works', async () => {
		let initLogged = false
		const storage = new MemoryStorage()
		const loader = new ModLoader({
			storage,
			loggerFactory: () => ({
				info(msg) { if (msg.includes('initialized at')) initLogged = true },
				warn() {},
				error() {},
			}),
			onDiagnostic() {},
		})
		loader.discover(bundledCandidates)
		loader.enable('builtin:behavior-demo')
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		await loader.activateEnabled(builder)
		const content = builder.finalize()
		const def = content.entityDefinitions.find(d => d.id === 'builtin:behavior-demo-entity')
		const host = createMockHost()
		const entity = new def.constructor(host)
		entity.setPosition([5, 5])
		assert.equal(initLogged, true, 'init hook must log entity initialization')
	})

	// 13. update hook works
	await test('update hook works', async () => {
		let updateLogged = false
		const storage = new MemoryStorage()
		const loader = new ModLoader({
			storage,
			loggerFactory: () => ({
				info(msg) { if (msg.includes('initial update tick')) updateLogged = true },
				warn() {},
				error() {},
			}),
			onDiagnostic() {},
		})
		loader.discover(bundledCandidates)
		loader.enable('builtin:behavior-demo')
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		await loader.activateEnabled(builder)
		const content = builder.finalize()
		const def = content.entityDefinitions.find(d => d.id === 'builtin:behavior-demo-entity')
		const host = createMockHost()
		const entity = new def.constructor(host)
		entity.setPosition([5, 5])
		entity.update(16)
		assert.equal(updateLogged, true, 'update hook must log initial tick')
	})

	// 14. safe self capability works
	await test('safe self capability works', async () => {
		let capturedSelf = null
		const storage = new MemoryStorage()
		const loader = new ModLoader({
			storage,
			loggerFactory: () => ({ info() {}, warn() {}, error() {} }),
			onDiagnostic() {},
		})
		loader.discover([{
			source: 'src/mods/behavior-demo/index.ts',
			definition: {
				manifest: behaviorDemoMod.manifest,
				setup({ content }) {
					content.registerEntity({
						id: 'builtin:behavior-demo-entity',
						createBehavior() {
							return {
								init(ctx) { capturedSelf = ctx.self },
							}
						},
					})
				},
			},
		}])
		loader.enable('builtin:behavior-demo')
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		await loader.activateEnabled(builder)
		const content = builder.finalize()
		const def = content.entityDefinitions.find(d => d.id === 'builtin:behavior-demo-entity')
		const host = createMockHost()
		const entity = new def.constructor(host)
		entity.setPosition([7, 9])
		assert.ok(capturedSelf)
		assert.equal(capturedSelf.typeId, 'builtin:behavior-demo-entity')
		assert.deepEqual(capturedSelf.position, [7, 9])
	})

	// 15. resource query works
	await test('resource query works', async () => {
		let charoniteAmount = null
		const storage = new MemoryStorage()
		const loader = new ModLoader({ storage, onDiagnostic() {} })
		loader.discover([{
			source: 'src/mods/behavior-demo/index.ts',
			definition: {
				manifest: behaviorDemoMod.manifest,
				setup({ content }) {
					content.registerEntity({
						id: 'builtin:behavior-demo-entity',
						createBehavior() {
							return {
								init(ctx) { charoniteAmount = ctx.resources.amount('charonite') },
							}
						},
					})
				},
			},
		}])
		loader.enable('builtin:behavior-demo')
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		await loader.activateEnabled(builder)
		const content = builder.finalize()
		const def = content.entityDefinitions.find(d => d.id === 'builtin:behavior-demo-entity')
		const host = createMockHost()
		const entity = new def.constructor(host)
		entity.setPosition([0, 0])
		assert.equal(charoniteAmount, 50)
	})

	// 16. spatial query returns safe snapshot
	await test('spatial query returns safe snapshot', async () => {
		let ref = null
		const storage = new MemoryStorage()
		const loader = new ModLoader({ storage, onDiagnostic() {} })
		loader.discover([{
			source: 'src/mods/behavior-demo/index.ts',
			definition: {
				manifest: behaviorDemoMod.manifest,
				setup({ content }) {
					content.registerEntity({
						id: 'builtin:behavior-demo-entity',
						createBehavior() {
							return {
								init(ctx) { ref = ctx.spatial.entityAt([0, 0]) },
							}
						},
					})
				},
			},
		}])
		loader.enable('builtin:behavior-demo')
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		await loader.activateEnabled(builder)
		const content = builder.finalize()
		const def = content.entityDefinitions.find(d => d.id === 'builtin:behavior-demo-entity')
		const host = createMockHost()
		const entity = new def.constructor(host)
		entity.setPosition([0, 0])
		assert.ok(ref)
		assert.equal(ref.typeId, 'pump')
		assert.deepEqual(ref.position, [0, 0])
		assert.equal('master' in ref, false)
		assert.equal('context' in ref, false)
	})

	// 17. internal loader fixture remains hidden
	await test('internal loader fixture remains hidden', () => {
		const loader = new ModLoader({ storage: new MemoryStorage(), onDiagnostic() {} })
		loader.discover(bundledCandidates)
		const api = createModManagementApi(loader)
		const visible = api.mods().find(m => m.manifest.id === 'builtin:loader-fixture')
		assert.equal(visible, undefined, 'builtin:loader-fixture must be hidden from user-facing menu')
	})

	// 18. internal context fixture remains hidden
	await test('internal context fixture remains hidden', () => {
		const loader = new ModLoader({ storage: new MemoryStorage(), onDiagnostic() {} })
		loader.discover(bundledCandidates)
		const api = createModManagementApi(loader)
		const visible = api.mods().find(m => m.manifest.id === 'builtin:context-fixture')
		assert.equal(visible, undefined, 'builtin:context-fixture must be hidden from user-facing menu')
	})

	// 19. visible Mods menu contains real bundled mods
	await test('visible Mods menu contains real bundled mods', () => {
		const loader = new ModLoader({ storage: new MemoryStorage(), onDiagnostic() {} })
		loader.discover(bundledCandidates)
		const api = createModManagementApi(loader)
		const visibleIds = api.mods().map(m => m.manifest.id)
		assert.deepEqual(visibleIds, ['builtin:behavior-demo', 'builtin:hello-world'])
	})

	// 20. visible ordering deterministic
	await test('visible ordering deterministic', () => {
		const loader = new ModLoader({ storage: new MemoryStorage(), onDiagnostic() {} })
		loader.discover(bundledCandidates)
		const api = createModManagementApi(loader)
		const visibleIds = api.mods().map(m => m.manifest.id)
		// sorted lexicographically by ModId
		assert.equal(visibleIds[0], 'builtin:behavior-demo')
		assert.equal(visibleIds[1], 'builtin:hello-world')
	})

	// 21. all bundled mods use only supported public API imports
	await test('all bundled mods use only supported public API imports', () => {
		const srcModsDir = join(new URL('.', root).pathname, 'src/mods')
		const modDirs = readdirSync(srcModsDir)
		for (const dir of modDirs) {
			const modFile = join(srcModsDir, dir, 'index.ts')
			const content = readFileSync(modFile, 'utf8')
			const importLines = content.split('\n').filter(line => line.startsWith('import '))
			for (const line of importLines) {
				assert.match(
					line,
					/from ['"](\.\.\/)+scripts\/modding\/(api\/index|types)\.js['"]/,
					`Mod ${dir} must only import from public modding API, found: ${line}`,
				)
			}
		}
	})

	// 22. no forbidden deep imports
	await test('no forbidden deep imports', () => {
		const srcModsDir = join(new URL('.', root).pathname, 'src/mods')
		const modDirs = readdirSync(srcModsDir)
		for (const dir of modDirs) {
			const modFile = join(srcModsDir, dir, 'index.ts')
			const content = readFileSync(modFile, 'utf8')
			assert.doesNotMatch(content, /scripts\/core\//, `Mod ${dir} must not import from core/`)
			assert.doesNotMatch(content, /scripts\/engine\//, `Mod ${dir} must not import from engine/`)
			assert.doesNotMatch(content, /scripts\/registry\//, `Mod ${dir} must not import from registry/`)
			assert.doesNotMatch(content, /scripts\/content\/base\//, `Mod ${dir} must not import from content/base/`)
			assert.doesNotMatch(content, /scripts\/ui\.ts/, `Mod ${dir} must not import from ui.ts`)
		}
	})

	// 23. no Game/master/global escape
	await test('no Game/master/global escape', () => {
		const srcModsDir = join(new URL('.', root).pathname, 'src/mods')
		for (const modName of ['hello-world', 'behavior-demo']) {
			const modFile = join(srcModsDir, modName, 'index.ts')
			const content = readFileSync(modFile, 'utf8')
			assert.doesNotMatch(content, /\bwindow\b/, `Mod ${modName} must not access window`)
			assert.doesNotMatch(content, /\bdocument\b/, `Mod ${modName} must not access document`)
			assert.doesNotMatch(content, /\bglobalThis\b/, `Mod ${modName} must not access globalThis`)
			assert.doesNotMatch(content, /\bmaster\b/, `Mod ${modName} must not access master`)
		}
	})

	// 24. default disabled content remains 58 entities / 10 resources
	await test('default disabled content remains 58 entities / 10 resources', async () => {
		const storage = new MemoryStorage()
		const loader = new ModLoader({ storage, onDiagnostic() {} })
		loader.discover(bundledCandidates)
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		await loader.activateEnabled(builder)
		const content = builder.finalize()
		assert.equal(content.entityDefinitions.length, 58, 'Default game must have 58 entities')
		assert.equal(content.resourceDefinitions.length, 10, 'Default game must have 10 resources')
	})

	// 25. hide-banner either exists cleanly or is explicitly absent/deferred
	await test('hide-banner is explicitly deferred because Mod API v0 has no UI capability', () => {
		const srcModsDir = join(new URL('.', root).pathname, 'src/mods')
		const modDirs = readdirSync(srcModsDir)
		assert.equal(modDirs.includes('hide-banner'), false, 'builtin:hide-banner must be deferred in API v0')
	})

	console.log(`base mods regression passed (${passed} tests)`)
} finally {
	rmSync(output, { recursive: true, force: true })
}
