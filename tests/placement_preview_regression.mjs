import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const outputRoot = await mkdtemp(join(tmpdir(), 'placement-preview-regression-'))
let InputSystem
try {
	execFileSync(join(projectRoot, 'node_modules', '.bin', 'tsc'), [
		'--project', join(projectRoot, 'tsconfig.json'),
		'--noEmit', 'false',
		'--rootDir', join(projectRoot, 'src'),
		'--outDir', outputRoot,
	], { cwd: projectRoot, stdio: 'pipe' })
	const outputPath = join(outputRoot, 'scripts', 'engine', 'input', 'InputSystem.js')
	const outputText = await readFile(outputPath, 'utf8')
	const moduleUrl = `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`
	;({ InputSystem } = await import(moduleUrl))
} finally {
	await rm(outputRoot, { recursive: true, force: true })
}

const windowListeners = new Map()
globalThis.addEventListener = (type, listener) => {
	windowListeners.set(type, listener)
}
globalThis.cancelAnimationFrame = () => {}
globalThis.requestAnimationFrame = () => 1

const canvasListeners = new Map()
const interaction = {
	itemInHand: { name: 'silo', eraser: false },
	transportedEntity: { name: 'vessel' },
}
let mouseupCalls = 0

const host = {
	canvas: {
		addEventListener(type, listener) {
			canvasListeners.set(type, listener)
		},
	},
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
	processClick() {},
	processMousedown() {},
	processMousemove() {},
	processMouseup() { mouseupCalls++ },
	processMouseout() {},
	zoomInOut() {},
}

for (const property of ['itemInHand', 'transportedEntity']) {
	Object.defineProperty(host, property, {
		configurable: true,
		enumerable: true,
		get: () => interaction[property],
		set: value => { interaction[property] = value },
	})
}

const input = new InputSystem(host)
input.setListeners()

windowListeners.get('keydown')({ keyCode: 27, preventDefault() {} })

assert.equal(interaction.itemInHand, undefined, 'Escape must clear the interaction-owned held item')
assert.equal(interaction.transportedEntity, undefined, 'Escape must clear the interaction-owned transported entity')
assert.ok(Object.getOwnPropertyDescriptor(host, 'itemInHand')?.get, 'Escape must preserve the Game forwarding accessor')
assert.ok(Object.getOwnPropertyDescriptor(host, 'transportedEntity')?.get, 'Escape must preserve the transport forwarding accessor')

host.itemInHand = { name: 'silo', eraser: false }
host.transportedEntity = { name: 'vessel' }
assert.equal(host.itemInHand.name, 'silo', 'shop reselection must remain visible through the forwarding accessor')

input.mouse.positionChanged = false
canvasListeners.get('mouseup')({ button: 2 })

assert.equal(interaction.itemInHand, undefined, 'stationary right-click must clear the interaction-owned held item')
assert.equal(interaction.transportedEntity, undefined, 'stationary right-click must clear the interaction-owned transported entity')
assert.ok(Object.getOwnPropertyDescriptor(host, 'itemInHand')?.get, 'right-click must preserve the Game forwarding accessor')
assert.ok(Object.getOwnPropertyDescriptor(host, 'transportedEntity')?.get, 'right-click must preserve the transport forwarding accessor')
assert.equal(mouseupCalls, 1)

console.log('placement preview regression passed')
