import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { JSDOM } from 'jsdom'

const root = new URL('../', import.meta.url)
const output = mkdtempSync(join(tmpdir(), 'sixtyfour-right-click-'))

try {
	execFileSync(process.execPath, [
		join(new URL('.', root).pathname, 'node_modules/typescript/bin/tsc'),
		'--rootDir', join(new URL('.', root).pathname, 'src'),
		'--outDir', output,
		'--noEmit', 'false',
		'--declaration', 'false',
	], { cwd: new URL('.', root), stdio: 'pipe' })
	writeFileSync(join(output, 'package.json'), JSON.stringify({ type: 'module' }))

	const inputModulePath = join(output, 'scripts', 'engine', 'input', 'InputSystem.js')
	const { InputSystem } = await import(pathToFileURL(inputModulePath))
	const modsPanelPath = join(output, 'scripts', 'ui', 'ModsPanel.js')
	const { ModsPanel } = await import(pathToFileURL(modsPanelPath))

	let passed = 0
	const test = async (name, run) => {
		await run()
		passed++
		console.log(`  ok ${passed} - ${name}`)
	}

	function setupEnvironment() {
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
		globalThis.devicePixelRatio = 1
		globalThis.cancelAnimationFrame = () => {}
		globalThis.requestAnimationFrame = () => 1

		const canvas = dom.window.document.querySelector('.canvas')
		let mousedownEvent = null
		let mouseupCalled = 0
		let clickCalled = 0
		const interaction = {
			itemInHand: { name: 'silo', eraser: false },
			transportedEntity: { name: 'vessel' },
		}
		const host = {
			canvas,
			isWindows: false,
			pixelRatio: 1,
			zoom: 1,
			w: 1280,
			h: 720,
			translationMap: [0, 0, 0, 0],
			altActive: false,
			plane: 0,
			initScreenSize() {},
			doOnBlur() {},
			doOnFocus() {},
			toggleSplash() {},
			processQ() {},
			processE() {},
			processClick() { clickCalled++ },
			processMousedown(e) { mousedownEvent = e },
			processMousemove() {},
			processMouseup() { mouseupCalled++ },
			processMouseout() {},
			zoomInOut() {},
			get mousedownEvent() { return mousedownEvent },
			get mouseupCalled() { return mouseupCalled },
			get clickCalled() { return clickCalled },
			interaction,
		}
		for (const property of ['itemInHand', 'transportedEntity']) {
			Object.defineProperty(host, property, {
				configurable: true,
				enumerable: true,
				get: () => interaction[property],
				set: value => { interaction[property] = value },
			})
		}
		return { dom, host }
	}

	// 1. contextmenu default is prevented
	await test('contextmenu default is prevented', () => {
		const { dom, host } = setupEnvironment()
		const input = new InputSystem(host)
		input.setListeners()

		const event = new dom.window.MouseEvent('contextmenu', { bubbles: true, cancelable: true })
		dom.window.dispatchEvent(event)
		assert.equal(event.defaultPrevented, true)
	})

	// 2. right-button mousedown still reaches existing game/application logic
	await test('right-button mousedown still reaches existing game/application logic', () => {
		const { dom, host } = setupEnvironment()
		const input = new InputSystem(host)
		input.setListeners()

		const event = new dom.window.MouseEvent('mousedown', { bubbles: true, cancelable: true, button: 2, buttons: 2 })
		host.canvas.dispatchEvent(event)
		assert.ok(host.mousedownEvent)
		assert.equal(host.mousedownEvent.button, 2)
		assert.equal(host.mousedownEvent.buttons, 2)
	})

	// 3. right-button mouseup still reaches existing game/application logic
	await test('right-button mouseup still reaches existing game/application logic', () => {
		const { dom, host } = setupEnvironment()
		const input = new InputSystem(host)
		input.setListeners()

		input.mouse.positionChanged = false
		assert.ok(host.itemInHand)
		const event = new dom.window.MouseEvent('mouseup', { bubbles: true, cancelable: true, button: 2 })
		host.canvas.dispatchEvent(event)

		assert.equal(host.mouseupCalled, 1)
		assert.equal(host.itemInHand, undefined)
		assert.equal(host.transportedEntity, undefined)
	})

	// 4. button === 2 remains observable by game handlers
	await test('button === 2 remains observable by game handlers', () => {
		const { dom, host } = setupEnvironment()
		const input = new InputSystem(host)
		input.setListeners()

		const event = new dom.window.MouseEvent('mousedown', { bubbles: true, cancelable: true, button: 2, buttons: 2 })
		host.canvas.dispatchEvent(event)
		assert.equal(host.mousedownEvent.button, 2)
	})

	// 5. preventing contextmenu does not call stopPropagation
	await test('preventing contextmenu does not call stopPropagation', () => {
		const { dom, host } = setupEnvironment()
		const input = new InputSystem(host)
		input.setListeners()

		let stopPropCalled = false
		let stopImmPropCalled = false
		const event = new dom.window.MouseEvent('contextmenu', { bubbles: true, cancelable: true })
		const origStop = event.stopPropagation.bind(event)
		const origStopImm = event.stopImmediatePropagation.bind(event)
		event.stopPropagation = () => { stopPropCalled = true; origStop() }
		event.stopImmediatePropagation = () => { stopImmPropCalled = true; origStopImm() }

		dom.window.dispatchEvent(event)
		assert.equal(event.defaultPrevented, true)
		assert.equal(stopPropCalled, false)
		assert.equal(stopImmPropCalled, false)
	})

	// 6. contextmenu suppression works over the game surface
	await test('contextmenu suppression works over the game surface', () => {
		const { dom, host } = setupEnvironment()
		const input = new InputSystem(host)
		input.setListeners()

		const canvas = dom.window.document.querySelector('.canvas')
		const event = new dom.window.MouseEvent('contextmenu', { bubbles: true, cancelable: true })
		canvas.dispatchEvent(event)
		assert.equal(event.defaultPrevented, true)
	})

	// 7. contextmenu suppression works over normal UI
	await test('contextmenu suppression works over normal UI', () => {
		const { dom, host } = setupEnvironment()
		const input = new InputSystem(host)
		input.setListeners()

		const shop = dom.window.document.querySelector('.shop')
		const event1 = new dom.window.MouseEvent('contextmenu', { bubbles: true, cancelable: true })
		shop.dispatchEvent(event1)
		assert.equal(event1.defaultPrevented, true)

		const splash = dom.window.document.querySelector('.splash')
		const event2 = new dom.window.MouseEvent('contextmenu', { bubbles: true, cancelable: true })
		splash.dispatchEvent(event2)
		assert.equal(event2.defaultPrevented, true)
	})

	// 8. contextmenu suppression works while Mods panel is open
	await test('contextmenu suppression works while Mods panel is open', () => {
		const { dom, host } = setupEnvironment()
		const input = new InputSystem(host)
		input.setListeners()

		const mockApi = {
			mods() {
				return [{
					manifest: {
						id: 'test:mod',
						name: 'Test Mod',
						version: '1.0.0',
						apiVersion: 0,
						homepage: 'https://example.com',
					},
					enabled: true,
					status: 'active',
					reloadRequired: false,
				}]
			},
			allMods() { return this.mods() },
			enable() { return true },
			disable() { return true },
			reload() {},
		}
		const panel = new ModsPanel(mockApi)
		panel.show()

		const panelEl = dom.window.document.querySelector('.modsPanel')
		assert.ok(panelEl)
		const event1 = new dom.window.MouseEvent('contextmenu', { bubbles: true, cancelable: true })
		panelEl.dispatchEvent(event1)
		assert.equal(event1.defaultPrevented, true)

		const linkEl = dom.window.document.querySelector('.modHomepage')
		assert.ok(linkEl)
		const event2 = new dom.window.MouseEvent('contextmenu', { bubbles: true, cancelable: true })
		linkEl.dispatchEvent(event2)
		assert.equal(event2.defaultPrevented, true)

		panel.hide()
	})

	// 9. left-click behavior remains unchanged
	await test('left-click behavior remains unchanged', () => {
		const { dom, host } = setupEnvironment()
		const input = new InputSystem(host)
		input.setListeners()

		const event = new dom.window.MouseEvent('click', { bubbles: true, cancelable: true, button: 0 })
		host.canvas.dispatchEvent(event)
		assert.equal(host.clickCalled, 1)
		assert.equal(event.defaultPrevented, false)
	})

	// 10. listener is installed only once / no duplicate behavior
	await test('listener is installed only once / no duplicate behavior', () => {
		const { dom, host } = setupEnvironment()
		let contextmenuListenerCount = 0
		const origAdd = globalThis.addEventListener
		globalThis.addEventListener = (type, listener, options) => {
			if (type === 'contextmenu') contextmenuListenerCount++
			return origAdd(type, listener, options)
		}

		const input = new InputSystem(host)
		input.setListeners()
		input.setListeners()
		input.setListeners()

		assert.equal(contextmenuListenerCount, 1, 'contextmenu listener must be registered exactly once')

		let preventCount = 0
		const event = new dom.window.MouseEvent('contextmenu', { bubbles: true, cancelable: true })
		const origPrevent = event.preventDefault.bind(event)
		event.preventDefault = () => {
			preventCount++
			origPrevent()
		}

		dom.window.dispatchEvent(event)
		assert.equal(event.defaultPrevented, true)
		assert.equal(preventCount, 1, 'preventDefault should be called exactly once')

		globalThis.addEventListener = origAdd
	})

	console.log(`right-click regression passed (${passed} tests)`)
} finally {
	rmSync(output, { recursive: true, force: true })
}
