import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, rmSync, writeFileSync, readFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { JSDOM } from 'jsdom'

const root = new URL('../', import.meta.url)
const output = mkdtempSync(join(tmpdir(), 'sixtyfour-mod-menu-'))

// Setup JSDOM for UI tests
const dom = new JSDOM(`<!DOCTYPE html><html><head></head><body><canvas class="canvas"></canvas><div class="shop"></div></body></html>`, { url: 'http://localhost' })
globalThis.window = dom.window
globalThis.document = dom.window.document
globalThis.HTMLElement = dom.window.HTMLElement
globalThis.HTMLDivElement = dom.window.HTMLDivElement
globalThis.HTMLButtonElement = dom.window.HTMLButtonElement
globalThis.Node = dom.window.Node
globalThis.Event = dom.window.Event
globalThis.KeyboardEvent = dom.window.KeyboardEvent
globalThis.MouseEvent = dom.window.MouseEvent
globalThis.getComputedStyle = dom.window.getComputedStyle
globalThis.Image = dom.window.Image ?? class { src = '' }
globalThis.localStorage = dom.window.localStorage ?? { getItem: () => null, setItem: () => {}, removeItem: () => {} }
globalThis.requestAnimationFrame = (cb) => setTimeout(cb, 0)
globalThis.devicePixelRatio = 1

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
	const uiRoot = join(output, 'scripts/ui')
	const { ModLoader } = await import(pathToFileURL(join(moddingRoot, 'ModLoader.js')))
	const { ContentBuilder } = await import(pathToFileURL(join(output, 'scripts/content/ContentContext.js')))
	const { registerBaseContent } = await import(pathToFileURL(join(output, 'scripts/content/registerBaseContent.js')))
	const { createModManagementApi } = await import(pathToFileURL(join(moddingRoot, 'ModManagement.js')))
	const { ModsPanel } = await import(pathToFileURL(join(uiRoot, 'ModsPanel.js')))
	const { Splash } = await import(pathToFileURL(join(output, 'scripts/ui.js')))
	const { HOME_SCREEN_VARIANTS } = await import(pathToFileURL(join(output, 'scripts/startupPresentation.js')))

	class MemoryStorage {
		values = new Map()
		getItem(key) { return this.values.get(key) ?? null }
		setItem(key, value) { this.values.set(key, value) }
	}

	const manifest = (id, overrides = {}) => ({
		id,
		name: id,
		version: '1.0.0',
		apiVersion: 0,
		author: 'Test Author',
		description: 'Test description',
		homepage: 'https://example.com',
		...overrides,
	})
	const definition = (id, setup = () => {}, overrides = {}) => ({
		manifest: manifest(id, overrides),
		setup,
	})
	const candidate = (source, value) => ({ source, definition: value })
	const createLoader = (storage = new MemoryStorage()) => new ModLoader({
		storage,
		loggerFactory: () => ({ info() {}, warn() {}, error() {} }),
		onDiagnostic() {},
	})

	let passed = 0
	const test = async (name, run) => {
		await run()
		passed++
		console.log(`  ok ${passed} - ${name}`)
		// cleanup DOM between tests
		document.body.innerHTML = '<canvas class="canvas"></canvas><div class="shop"></div>'
	}

	// Helper to create a visible mod
	function createVisibleMod(id, overrides = {}) {
		return definition(id, () => {}, { ...overrides })
	}

	// 1-5: Entry / Panel
	await test('Mods entry exists', async () => {
		const loader = createLoader()
		loader.discover([candidate('/mod.ts', createVisibleMod('example:visible'))])
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		await loader.activateEnabled(builder)
		builder.finalize()
		const api = createModManagementApi(loader)
		const splashHost = {
			isMute: false,
			steamId: '',
			words: { splash: { language: 'Language', reset: 'Reset', quit: 'Quit', continue: 'Continue', start: 'Start', soundon: 'Sound on', soundoff: 'Sound off' }, achievements: [], messages: [] },
			version: '1.0.0',
			spaceport: { send: () => {} },
			languageId: 0,
			languages: ['en'],
			codex: { achievements: [] },
			backups: [],
			mute: () => {},
			initAudio: () => {},
			updateGlobalVolume: () => {},
			exportSave: () => {},
			loadSaveFromClipboard: () => {},
			changeLanguage: () => {},
			saveGame: () => {},
			togglePhotofobia: () => {},
			toggleChill: () => {},
			restoreBackup: () => {},
			modManagementApi: api,
		}
		const splash = new Splash(splashHost, HOME_SCREEN_VARIANTS[0])
		assert.ok(splash.modsIcon, 'modsIcon should exist')
		assert.ok(splash.modsIcon.classList.contains('modsIcon'))
		assert.equal(splash.modsIcon.getAttribute('aria-label'), 'Mods')
		assert.equal(splash.modsIcon.getAttribute('role'), 'button')
		assert.ok(splash.modsPanel instanceof ModsPanel)
	})

	await test('panel opens', async () => {
		const loader = createLoader()
		loader.discover([candidate('/mod.ts', createVisibleMod('example:visible'))])
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		await loader.activateEnabled(builder)
		builder.finalize()
		const api = createModManagementApi(loader)
		const panel = new ModsPanel(api)
		panel.show()
		assert.ok(document.querySelector('.modsPanel'))
		assert.equal(document.querySelector('.modsPanel').getAttribute('role'), 'dialog')
	})

	await test('panel closes', async () => {
		const loader = createLoader()
		loader.discover([])
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		await loader.activateEnabled(builder)
		builder.finalize()
		const api = createModManagementApi(loader)
		const panel = new ModsPanel(api)
		panel.show()
		assert.ok(document.querySelector('.modsPanel'))
		panel.hide()
		assert.equal(document.querySelector('.modsPanel'), null)
	})

	await test('Escape closes if consistent', async () => {
		const loader = createLoader()
		loader.discover([])
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		await loader.activateEnabled(builder)
		builder.finalize()
		const api = createModManagementApi(loader)
		const panel = new ModsPanel(api)
		panel.show()
		assert.ok(panel.isOpen())
		const ev = new dom.window.KeyboardEvent('keydown', { key: 'Escape' })
		document.dispatchEvent(ev)
		assert.equal(panel.isOpen(), false)
	})

	await test('reopening works without duplicate panels', async () => {
		const loader = createLoader()
		loader.discover([candidate('/mod.ts', createVisibleMod('example:visible'))])
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		await loader.activateEnabled(builder)
		builder.finalize()
		const api = createModManagementApi(loader)
		const panel = new ModsPanel(api)
		panel.show()
		panel.show()
		assert.equal(document.querySelectorAll('.modsPanel').length, 1)
		panel.hide()
		panel.show()
		assert.equal(document.querySelectorAll('.modsPanel').length, 1)
	})

	// 6-10: Visibility
	await test('normal visible mod appears', async () => {
		const loader = createLoader()
		loader.discover([candidate('/mod.ts', createVisibleMod('example:visible', { enabledByDefault: true }))])
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		await loader.activateEnabled(builder)
		builder.finalize()
		const api = createModManagementApi(loader)
		const panel = new ModsPanel(api)
		panel.show()
		assert.ok(document.querySelector('[data-mod-id="example:visible"]'))
	})

	await test('internal loader fixture hidden', async () => {
		const loader = createLoader()
		loader.discover([
			candidate('/loader.ts', definition('builtin:loader-fixture', () => {}, { enabledByDefault: false, internal: true })),
			candidate('/visible.ts', createVisibleMod('example:visible', { enabledByDefault: true })),
		])
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		await loader.activateEnabled(builder)
		builder.finalize()
		const api = createModManagementApi(loader)
		const panel = new ModsPanel(api)
		panel.show()
		assert.equal(document.querySelector('[data-mod-id="builtin:loader-fixture"]'), null)
		assert.ok(document.querySelector('[data-mod-id="example:visible"]'))
	})

	await test('internal context fixture hidden', async () => {
		const loader = createLoader()
		loader.discover([
			candidate('/context.ts', definition('builtin:context-fixture', () => {}, { enabledByDefault: false, internal: true })),
			candidate('/visible.ts', createVisibleMod('example:visible2', { enabledByDefault: true })),
		])
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		await loader.activateEnabled(builder)
		builder.finalize()
		const api = createModManagementApi(loader)
		const panel = new ModsPanel(api)
		panel.show()
		assert.equal(document.querySelector('[data-mod-id="builtin:context-fixture"]'), null)
	})

	await test('hidden fixture still discovered by loader', async () => {
		const loader = createLoader()
		loader.discover([
			candidate('/loader.ts', definition('builtin:loader-fixture', () => {}, { enabledByDefault: false, internal: true })),
		])
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		await loader.activateEnabled(builder)
		builder.finalize()
		assert.equal(loader.mods().length, 1)
		assert.equal(loader.mods()[0].manifest.id, 'builtin:loader-fixture')
		assert.equal(createModManagementApi(loader).mods().length, 0)
		assert.equal(createModManagementApi(loader).allMods().length, 1)
	})

	await test('deterministic visible ordering', async () => {
		const loader = createLoader()
		loader.discover([
			candidate('/z.ts', createVisibleMod('example:z', { enabledByDefault: true })),
			candidate('/a.ts', createVisibleMod('example:a', { enabledByDefault: true })),
		])
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		await loader.activateEnabled(builder)
		builder.finalize()
		const api = createModManagementApi(loader)
		const panel = new ModsPanel(api)
		panel.show()
		const cards = [...document.querySelectorAll('.modCard')].map(el => el.getAttribute('data-mod-id'))
		assert.deepEqual(cards, ['example:a', 'example:z'])
	})

	// 11-15: Metadata
	await test('name rendered', async () => {
		const loader = createLoader()
		loader.discover([candidate('/mod.ts', definition('example:meta', () => {}, { name: 'My Mod', enabledByDefault: true }))])
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		await loader.activateEnabled(builder)
		builder.finalize()
		const api = createModManagementApi(loader)
		const panel = new ModsPanel(api)
		panel.show()
		assert.equal(document.querySelector('.modName').textContent, 'My Mod')
	})

	await test('version rendered', async () => {
		const loader = createLoader()
		loader.discover([candidate('/mod.ts', definition('example:ver', () => {}, { version: '2.3.4', enabledByDefault: true }))])
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		await loader.activateEnabled(builder)
		builder.finalize()
		const api = createModManagementApi(loader)
		const panel = new ModsPanel(api)
		panel.show()
		assert.equal(document.querySelector('.modVersion').textContent, 'v2.3.4')
	})

	await test('author rendered', async () => {
		const loader = createLoader()
		loader.discover([candidate('/mod.ts', definition('example:auth', () => {}, { author: 'Jane Doe', enabledByDefault: true }))])
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		await loader.activateEnabled(builder)
		builder.finalize()
		const api = createModManagementApi(loader)
		const panel = new ModsPanel(api)
		panel.show()
		assert.equal(document.querySelector('.modAuthor').textContent, 'by Jane Doe')
	})

	await test('description rendered', async () => {
		const loader = createLoader()
		loader.discover([candidate('/mod.ts', definition('example:desc2', () => {}, { description: 'A great mod', enabledByDefault: true }))])
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		await loader.activateEnabled(builder)
		builder.finalize()
		const api = createModManagementApi(loader)
		const panel = new ModsPanel(api)
		panel.show()
		assert.equal(document.querySelector('.modDescription').textContent, 'A great mod')
	})

	await test('missing optional fields handled cleanly', async () => {
		const loader = createLoader()
		loader.discover([candidate('/mod.ts', definition('example:minimal', () => {}, { author: undefined, description: undefined, homepage: undefined, enabledByDefault: true }))])
		// Remove optional fields
		const mod = loader.mods()[0]
		// manifest has no author/description/homepage by default
		assert.equal(mod.manifest.author, undefined)
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		await loader.activateEnabled(builder)
		builder.finalize()
		const api = createModManagementApi(loader)
		const panel = new ModsPanel(api)
		panel.show()
		assert.equal(document.querySelector('.modAuthor'), null)
		assert.equal(document.querySelector('.modDescription'), null)
	})

	// 16-22: Status
	await test('disabled', async () => {
		const loader = createLoader()
		loader.discover([candidate('/mod.ts', createVisibleMod('example:dis', { enabledByDefault: false }))])
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		await loader.activateEnabled(builder)
		builder.finalize()
		const api = createModManagementApi(loader)
		const panel = new ModsPanel(api)
		panel.show()
		assert.match(document.querySelector('.modStatus').textContent, /Disabled/)
	})

	await test('discovered', async () => {
		const loader = createLoader()
		loader.discover([candidate('/mod.ts', createVisibleMod('example:disc', { enabledByDefault: true }))])
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		// not yet activated, status is discovered
		const api = createModManagementApi(loader)
		const panel = new ModsPanel(api)
		panel.show()
		// after discover but before activate, status is discovered for enabled
		assert.match(document.querySelector('.modStatus').textContent, /Enabled|Discovered|Active/)
	})

	await test('loading', async () => {
		let release
		const gate = new Promise(r => { release = r })
		const loader = createLoader()
		loader.discover([candidate('/mod.ts', definition('example:load', () => gate, { enabledByDefault: true }))])
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		const p = loader.activateEnabled(builder)
		const api = createModManagementApi(loader)
		const panel = new ModsPanel(api)
		panel.show()
		assert.match(document.querySelector('.modStatus').textContent, /Loading/)
		assert.equal(document.querySelector('.modToggle').disabled, true)
		release()
		await p
	})

	await test('active', async () => {
		const loader = createLoader()
		loader.discover([candidate('/mod.ts', createVisibleMod('example:active', { enabledByDefault: true }))])
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		await loader.activateEnabled(builder)
		builder.finalize()
		const api = createModManagementApi(loader)
		const panel = new ModsPanel(api)
		panel.show()
		assert.match(document.querySelector('.modStatus').textContent, /Active/)
	})

	await test('failed', async () => {
		const loader = createLoader()
		loader.discover([candidate('/mod.ts', definition('example:fail', () => { throw new Error('boom') }, { enabledByDefault: true }))])
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		await loader.activateEnabled(builder)
		builder.finalize()
		const api = createModManagementApi(loader)
		const panel = new ModsPanel(api)
		panel.show()
		assert.match(document.querySelector('.modStatus').textContent, /Failed/)
	})

	await test('concise failure message', async () => {
		const loader = createLoader()
		loader.discover([candidate('/mod.ts', definition('example:fail2', () => { throw new Error('oops failed') }, { enabledByDefault: true }))])
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		await loader.activateEnabled(builder)
		builder.finalize()
		const api = createModManagementApi(loader)
		const panel = new ModsPanel(api)
		panel.show()
		const err = document.querySelector('.modError')
		assert.ok(err)
		assert.match(err.textContent, /oops failed/)
		assert.match(err.textContent, /setup/)
		// should not contain stack trace
		assert.equal(err.textContent.includes('at '), false)
	})

	await test('reload-required', async () => {
		const loader = createLoader()
		loader.discover([candidate('/mod.ts', createVisibleMod('example:reload', { enabledByDefault: false }))])
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		await loader.activateEnabled(builder)
		builder.finalize()
		loader.enable('example:reload')
		const api = createModManagementApi(loader)
		const panel = new ModsPanel(api)
		panel.show()
		assert.ok(document.querySelector('.modReloadRequired'))
		assert.match(document.querySelector('.modStatus').textContent, /Reload required/)
	})

	// 23-28: Management
	await test('enable invokes management API', async () => {
		let enabledId = null
		const loader = createLoader()
		loader.discover([candidate('/mod.ts', createVisibleMod('example:en', { enabledByDefault: false }))])
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		await loader.activateEnabled(builder)
		builder.finalize()
		const api = createModManagementApi(loader)
		const origEnable = api.enable.bind(api)
		api.enable = (id) => { enabledId = id; return origEnable(id) }
		const panel = new ModsPanel(api)
		panel.show()
		const toggle = document.querySelector('.modToggle')
		toggle.checked = true
		toggle.dispatchEvent(new dom.window.Event('change', { bubbles: true }))
		assert.equal(enabledId, 'example:en')
	})

	await test('disable invokes management API', async () => {
		let disabledId = null
		const loader = createLoader()
		loader.discover([candidate('/mod.ts', createVisibleMod('example:dis2', { enabledByDefault: true }))])
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		await loader.activateEnabled(builder)
		builder.finalize()
		const api = createModManagementApi(loader)
		const origDisable = api.disable.bind(api)
		api.disable = (id) => { disabledId = id; return origDisable(id) }
		const panel = new ModsPanel(api)
		panel.show()
		const toggle = document.querySelector('.modToggle')
		toggle.checked = false
		toggle.dispatchEvent(new dom.window.Event('change', { bubbles: true }))
		assert.equal(disabledId, 'example:dis2')
	})

	await test('snapshots refreshed after enable', async () => {
		const loader = createLoader()
		loader.discover([candidate('/mod.ts', createVisibleMod('example:ref', { enabledByDefault: false }))])
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		await loader.activateEnabled(builder)
		builder.finalize()
		const api = createModManagementApi(loader)
		const panel = new ModsPanel(api)
		panel.show()
		assert.match(document.querySelector('.modStatus').textContent, /Disabled/)
		api.enable('example:ref')
		panel.show()
		// After enable, should show reload required
		assert.match(document.querySelector('.modStatus').textContent, /Reload required|Enabled/)
	})

	await test('snapshots refreshed after disable', async () => {
		const loader = createLoader()
		loader.discover([candidate('/mod.ts', createVisibleMod('example:ref2', { enabledByDefault: true }))])
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		await loader.activateEnabled(builder)
		builder.finalize()
		const api = createModManagementApi(loader)
		const panel = new ModsPanel(api)
		panel.show()
		api.disable('example:ref2')
		panel.show()
		assert.match(document.querySelector('.modStatus').textContent, /Reload required|Disabled/)
	})

	await test('operation failure does not leave false optimistic state', async () => {
		const loader = createLoader()
		loader.discover([candidate('/mod.ts', createVisibleMod('example:failop', { enabledByDefault: false }))])
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		await loader.activateEnabled(builder)
		builder.finalize()
		const api = createModManagementApi(loader)
		// make enable fail
		api.enable = () => false
		const panel = new ModsPanel(api)
		panel.show()
		const toggle = document.querySelector('.modToggle')
		const prev = toggle.checked
		toggle.checked = true
		toggle.dispatchEvent(new dom.window.Event('change', { bubbles: true }))
		assert.equal(toggle.checked, prev, 'should revert on failure')
	})

	await test('operation failure rendered/handled', async () => {
		const loader = createLoader()
		loader.discover([candidate('/mod.ts', createVisibleMod('example:failop2', { enabledByDefault: false }))])
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		await loader.activateEnabled(builder)
		builder.finalize()
		const api = createModManagementApi(loader)
		api.enable = () => false
		const panel = new ModsPanel(api)
		panel.show()
		// should not throw
		const toggle = document.querySelector('.modToggle')
		toggle.checked = true
		toggle.dispatchEvent(new dom.window.Event('change', { bubbles: true }))
		assert.ok(document.querySelector('.modCard'))
	})

	// 29-31: Reload
	await test('reload button absent when not required', async () => {
		const loader = createLoader()
		loader.discover([candidate('/mod.ts', createVisibleMod('example:noreload', { enabledByDefault: true }))])
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		await loader.activateEnabled(builder)
		builder.finalize()
		const api = createModManagementApi(loader)
		const panel = new ModsPanel(api)
		panel.show()
		const btn = document.querySelector('.modsReloadButton')
		assert.equal(btn.style.display, 'none')
	})

	await test('reload button present when required', async () => {
		const loader = createLoader()
		loader.discover([candidate('/mod.ts', createVisibleMod('example:needreload', { enabledByDefault: false }))])
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		await loader.activateEnabled(builder)
		builder.finalize()
		loader.enable('example:needreload')
		const api = createModManagementApi(loader)
		const panel = new ModsPanel(api)
		panel.show()
		const btn = document.querySelector('.modsReloadButton')
		assert.notEqual(btn.style.display, 'none')
		assert.equal(btn.disabled, false)
	})

	await test('reload action invokes injected reload mechanism', async () => {
		let reloaded = false
		const loader = createLoader()
		loader.discover([candidate('/mod.ts', createVisibleMod('example:reloadact', { enabledByDefault: false }))])
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		await loader.activateEnabled(builder)
		builder.finalize()
		loader.enable('example:reloadact')
		const api = createModManagementApi(loader, () => { reloaded = true })
		const panel = new ModsPanel(api)
		panel.show()
		document.querySelector('.modsReloadButton').click()
		assert.equal(reloaded, true)
	})

	// 32-34: Empty / Notices
	await test('empty state', async () => {
		const loader = createLoader()
		loader.discover([])
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		await loader.activateEnabled(builder)
		builder.finalize()
		const api = createModManagementApi(loader)
		const panel = new ModsPanel(api)
		panel.show()
		assert.equal(document.querySelector('.modsEmpty').textContent, 'No mods installed.')
	})

	await test('trust notice', async () => {
		const loader = createLoader()
		loader.discover([])
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		await loader.activateEnabled(builder)
		builder.finalize()
		const api = createModManagementApi(loader)
		const panel = new ModsPanel(api)
		panel.show()
		assert.equal(document.querySelector('.modsTrust'), null)
	})

	await test('experimental API notice', async () => {
		const loader = createLoader()
		loader.discover([])
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		await loader.activateEnabled(builder)
		builder.finalize()
		const api = createModManagementApi(loader)
		const panel = new ModsPanel(api)
		panel.show()
		assert.match(document.querySelector('.modsExperimental').textContent, /Mod API v0.*Experimental/)
	})

	// 35-38: Accessibility
	await test('toggle has associated label', async () => {
		const loader = createLoader()
		loader.discover([candidate('/mod.ts', createVisibleMod('example:acc', { enabledByDefault: true }))])
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		await loader.activateEnabled(builder)
		builder.finalize()
		const api = createModManagementApi(loader)
		const panel = new ModsPanel(api)
		panel.show()
		const label = document.querySelector('.modToggleLabel')
		assert.ok(label)
		assert.equal(label.querySelector('.modToggle').getAttribute('aria-label'), 'Enable example:acc')
	})

	await test('controls are keyboard-focusable', async () => {
		const loader = createLoader()
		loader.discover([candidate('/mod.ts', createVisibleMod('example:focus', { enabledByDefault: true }))])
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		await loader.activateEnabled(builder)
		builder.finalize()
		const api = createModManagementApi(loader)
		const panel = new ModsPanel(api)
		panel.show()
		const toggle = document.querySelector('.modToggle')
		assert.equal(toggle.tabIndex, 0)
		const close = document.querySelector('.modsCloseButton')
		assert.equal(close.tabIndex, 0)
	})

	await test('close button semantic', async () => {
		const loader = createLoader()
		loader.discover([])
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		await loader.activateEnabled(builder)
		builder.finalize()
		const api = createModManagementApi(loader)
		const panel = new ModsPanel(api)
		panel.show()
		const btn = document.querySelector('.modsCloseButton')
		assert.equal(btn.tagName, 'BUTTON')
		assert.equal(btn.textContent, 'Close')
	})

	await test('status represented as text', async () => {
		const loader = createLoader()
		loader.discover([candidate('/mod.ts', createVisibleMod('example:statustext', { enabledByDefault: true }))])
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		await loader.activateEnabled(builder)
		builder.finalize()
		const api = createModManagementApi(loader)
		const panel = new ModsPanel(api)
		panel.show()
		const status = document.querySelector('.modStatus')
		assert.ok(status.textContent.length > 0)
		assert.equal(status.getAttribute('aria-live'), 'polite')
	})

	// Static architecture tests
	await test('no localStorage usage in panel', async () => {
		const src = readFileSync(join(new URL('.', root).pathname, 'src/scripts/ui/ModsPanel.ts'), 'utf8')
		assert.equal(src.includes('localStorage'), false)
	})

	await test('no engine coupling in panel', async () => {
		const src = readFileSync(join(new URL('.', root).pathname, 'src/scripts/ui/ModsPanel.ts'), 'utf8')
		assert.equal(src.includes('Game'), false)
		assert.equal(src.includes('EntityHost'), false)
		assert.equal(src.includes('EntityContext'), false)
		assert.equal(src.includes('EntityManager'), false)
		assert.equal(src.includes('ResourceSystem'), false)
		assert.equal(src.includes('RenderSystem'), false)
		assert.equal(src.includes('ContentBuilder'), false)
		assert.equal(src.includes('master'), false)
	})

	await test('no window.modLoader global', async () => {
		const src1 = readFileSync(join(new URL('.', root).pathname, 'src/scripts/ui/ModsPanel.ts'), 'utf8')
		const src2 = readFileSync(join(new URL('.', root).pathname, 'src/scripts/modding/ModManagement.ts'), 'utf8')
		assert.equal(src1.includes('window.modLoader'), false)
		assert.equal(src2.includes('window.modLoader'), false)
		assert.equal(src1.includes('globalThis.modLoader'), false)
	})

	await test('export save displays stylized token dialog and copies', async () => {
		const loader = createLoader()
		loader.discover([])
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		await loader.activateEnabled(builder)
		builder.finalize()
		const api = createModManagementApi(loader)
		const saveApi = {
			exportSaveToken: () => 'base64-token-123',
			importSaveToken: () => true,
		}
		const panel = new ModsPanel(api, saveApi)
		panel.show()
		const exportBtn = [...document.querySelectorAll('.modsSaveButton')].find(b => b.textContent === 'Export Save')
		assert.ok(exportBtn, 'Export Save button should exist')
		exportBtn.click()
		const dialog = document.querySelector('.modsExportDialog')
		assert.ok(dialog, 'Export dialog should be displayed')
		const input = dialog.querySelector('.modsSaveTokenInput')
		assert.equal(input.value, 'base64-token-123')
		const copyBtn = dialog.querySelector('.modsCopyBtn')
		assert.ok(copyBtn, 'Copy button should exist')
		copyBtn.click()
		const status = dialog.querySelector('.modsSaveDialogStatus')
		assert.match(status.textContent, /Copied/)
	})

	await test('import save displays stylized input and restores', async () => {
		const loader = createLoader()
		loader.discover([])
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		await loader.activateEnabled(builder)
		builder.finalize()
		const api = createModManagementApi(loader)
		let imported = null
		const saveApi = {
			exportSaveToken: () => 'token',
			importSaveToken: (t) => { imported = t; return true },
		}
		const panel = new ModsPanel(api, saveApi)
		panel.show()
		const importBtn = [...document.querySelectorAll('.modsSaveButton')].find(b => b.textContent === 'Import Save')
		assert.ok(importBtn)
		importBtn.click()
		const dialog = document.querySelector('.modsImportDialog')
		assert.ok(dialog, 'Import dialog should be displayed')
		const input = dialog.querySelector('.modsSaveTokenInput')
		input.value = 'my-base64-token'
		const applyBtn = dialog.querySelector('.modsApplyImportBtn')
		assert.ok(applyBtn)
		applyBtn.click()
		assert.equal(imported, 'my-base64-token')
	})

	await test('escape while mod menu open does not toggle splash', async () => {
		const loader = createLoader()
		loader.discover([])
		const builder = new ContentBuilder()
		registerBaseContent(builder)
		await loader.activateEnabled(builder)
		builder.finalize()
		const api = createModManagementApi(loader)
		let toggled = false
		const splashHost = {
			isMute: false,
			steamId: '',
			words: { splash: { language: 'Language', reset: 'Reset', quit: 'Quit', continue: 'Continue', start: 'Start', soundon: 'Sound on', soundoff: 'Sound off' }, achievements: [], messages: [] },
			version: '1.0.0',
			spaceport: { send: () => {} },
			languageId: 0,
			languages: ['en'],
			codex: { achievements: [] },
			backups: [],
			mute: () => {},
			initAudio: () => {},
			updateGlobalVolume: () => {},
			exportSave: () => {},
			loadSaveFromClipboard: () => {},
			changeLanguage: () => {},
			saveGame: () => {},
			togglePhotofobia: () => {},
			toggleChill: () => {},
			restoreBackup: () => {},
			modManagementApi: api,
			toggleSplash: () => { toggled = true },
		}
		const splash = new Splash(splashHost, HOME_SCREEN_VARIANTS[0])
		// Simulate InputSystem's escape handler that would call toggleSplash
		const inputHandler = (e) => {
			if (e.key === 'Escape' || e.keyCode === 27) {
				if (!e.defaultPrevented) splashHost.toggleSplash()
			}
		}
		window.addEventListener('keydown', inputHandler, false)
		splash.modsIcon.click()
		assert.ok(splash.modsPanel.isOpen())
		const ev = new dom.window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })
		window.dispatchEvent(ev)
		// modest panel should be closed, but splash should not have toggled (i.e., should still be shown)
		assert.equal(splash.modsPanel.isOpen(), false)
		assert.equal(toggled, false, 'toggleSplash should not be called when mod menu handles Escape')
		assert.equal(splash.isShown, true, 'splash should remain shown')
		window.removeEventListener('keydown', inputHandler, false)
	})

	console.log(`mod menu regression passed (${passed} tests)`)
} finally {
	rmSync(output, { recursive: true, force: true })
}
