// @ts-nocheck
// Deferred: bootstrap aggregates every compatibility global and the complete Game API.
import * as BezierModule from './bezier.js'
import * as UiModule from './ui.js'
import * as SpritesModule from './sprites.js'
import * as StuffModule from './stuff.js'
import * as WordsModule from './words.js'
import * as CodexModule from './codex.js'
import * as GameModule from './game.js'

// Preserve the legacy global bindings for the console and external runtime code.
Object.assign(
	globalThis,
	BezierModule,
	UiModule,
	SpritesModule,
	StuffModule,
	WordsModule,
	CodexModule,
	GameModule,
)

let game
globalThis.game = game

function startGame(preload){
	game = new GameModule.Game(document.querySelector(`.canvas`), preload)
	globalThis.game = game
}

window.onload = _=>{
	try {
		if (typeof window.require !== `function`) throw new ReferenceError(`require is not defined`)
		const spaceport = window.require(`electron`).ipcRenderer
		if (spaceport){
			window.onerror = (ev, so, li, co, er)=>{
				spaceport.send(`gameError`, er)
			}
			spaceport.on(`hereYouGoSir`, (e,d)=>{
				startGame(d)
			})
			spaceport.send(`getMyStuff`, `please`)
		}
	} catch (e){
		startGame()
	}
}
