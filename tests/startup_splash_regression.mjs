import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { pathToFileURL } from 'node:url'

const root = new URL('../', import.meta.url)
const rootPath = new URL('.', root).pathname
const output = mkdtempSync(join(tmpdir(), 'sixtyfour-startup-splash-'))

try {
	execFileSync(process.execPath, [
		join(rootPath, 'node_modules/typescript/bin/tsc'),
		'--rootDir', join(rootPath, 'src'),
		'--outDir', output,
		'--noEmit', 'false',
		'--declaration', 'false',
	], { cwd: root, stdio: 'pipe' })
	writeFileSync(join(output, 'package.json'), JSON.stringify({ type: 'module' }))
	const startup = await import(pathToFileURL(join(output, 'scripts/startupPresentation.js')))
	const { HOME_SCREEN_VARIANTS, STARTUP_SPLASH_TEXT, printStartupConsoleSplash, selectHomeScreenVariant } = startup

	let passed = 0
	const test = async (name, run) => {
		await run()
		passed++
		console.log(`  ok ${passed} - ${name}`)
	}

	await test('source truth is eight selectable home-screen variants', () => {
		assert.equal(HOME_SCREEN_VARIANTS.length, 8)
		assert.deepEqual(HOME_SCREEN_VARIANTS.map(variant => variant.id), [0, 1, 2, 3, 4, 5, 6, 7])
	})

	await test('every sprite cell maps to one console artwork', () => {
		assert.deepEqual(HOME_SCREEN_VARIANTS.map(({ column, row }) => [column, row]), [[0,0],[1,0],[2,0],[3,0],[0,1],[1,1],[2,1],[3,1]])
		assert.equal(new Set(HOME_SCREEN_VARIANTS.map(variant => variant.consolePreviewUrl)).size, 8)
	})

	await test('one selected identity drives home and console artwork', () => {
		const main = readFileSync(join(rootPath, 'src/scripts/main.ts'), 'utf8')
		const game = readFileSync(join(rootPath, 'src/scripts/core/Game.ts'), 'utf8')
		const ui = readFileSync(join(rootPath, 'src/scripts/ui.ts'), 'utf8')
		assert.match(main, /printStartupConsoleSplash\(selectedHomeVariant\)/)
		assert.match(main, /new Game\([^\n]+selectedHomeVariant/)
		assert.match(game, /new Splash\([^\n]+homeScreenVariant\)/)
		assert.match(ui, /this\.homeScreenVariant\.backgroundPosition/)
	})

	await test('console splash names Cursed Edition', () => {
		assert.equal(STARTUP_SPLASH_TEXT.title, 'Sixty Four: Cursed Edition')
	})

	await test('console splash credits arfjdms1', () => {
		assert.equal(STARTUP_SPLASH_TEXT.credit, 'Browser modernization & modding by arfjdms1')
	})

	await test('console splash identifies experimental Mod API v0', () => {
		assert.match(STARTUP_SPLASH_TEXT.api, /Mod API v0/)
		assert.match(STARTUP_SPLASH_TEXT.api, /Experimental/)
	})

	await test('console splash does not claim original-game authorship', () => {
		const text = Object.values(STARTUP_SPLASH_TEXT).join('\n')
		assert.doesNotMatch(text, /(?:Sixty Four created|Original game) by arfjdms1/i)
	})

	await test('console splash uses one console call', () => {
		const calls = []
		printStartupConsoleSplash(HOME_SCREEN_VARIANTS[3], { info: (...args) => calls.push(args) })
		assert.equal(calls.length, 1)
		assert.match(calls[0][0], /Sixty Four: Cursed Edition/)
	})

	await test('guarded startup owns the only splash invocation', () => {
		const main = readFileSync(join(rootPath, 'src/scripts/main.ts'), 'utf8')
		assert.equal((main.match(/printStartupConsoleSplash\(/g) ?? []).length, 1)
		assert.match(main, /if \(!startPromise\) startPromise = initializeGame\(preload\)/)
	})

	await test('update and render loops never print startup splash', () => {
		for (const path of ['src/scripts/core/Game.ts', 'src/scripts/engine/rendering/RenderSystem.ts']) {
			assert.doesNotMatch(readFileSync(join(rootPath, path), 'utf8'), /printStartupConsoleSplash/)
		}
	})

	await test('every variant has a small local preview', () => {
		for (const id of HOME_SCREEN_VARIANTS.map(variant => variant.id)) {
			const path = join(rootPath, `src/resources/images/logo/console/variant-${id}.png`)
			assert.equal(existsSync(path), true)
			assert.ok(statSync(path).size < 4096, `${path} must remain small enough for hosted Vite inlining`)
		}
	})

	await test('home and console do not select independently', () => {
		const ui = readFileSync(join(rootPath, 'src/scripts/ui.ts'), 'utf8')
		const presentation = readFileSync(join(rootPath, 'src/scripts/startupPresentation.ts'), 'utf8')
		assert.doesNotMatch(ui, /Math\.random/)
		assert.equal((presentation.match(/random\(\)/g) ?? []).length, 1)
		assert.equal(selectHomeScreenVariant(() => 0.999).id, 7)
	})

	console.log(`startup splash regression passed (${passed} tests)`)
} finally {
	rmSync(output, { recursive: true, force: true })
}
