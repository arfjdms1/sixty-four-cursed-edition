// @ts-nocheck
// Deferred: bootstrap aggregates every compatibility global and the complete Game API.
import * as BezierModule from './bezier.js'
import * as UiModule from './ui.js'
import * as SpritesModule from './sprites.js'
import * as WordsModule from './words.js'
import * as CodexModule from './codex.js'
import * as GameModule from './game.js'
import { Entity } from './entities/Entity.js'
import { Annihilator } from './entities/Annihilator.js'
import { Auxpump } from './entities/Auxpump.js'
import { Auxpump2 } from './entities/Auxpump2.js'
import { Chasm } from './entities/Chasm.js'
import { Clicker1 } from './entities/Clicker1.js'
import { Clicker2 } from './entities/Clicker2.js'
import { Clicker3 } from './entities/Clicker3.js'
import { Conductor } from './entities/Conductor.js'
import { Consumer } from './entities/Consumer.js'
import { Converter13 } from './entities/Converter13.js'
import { Converter32 } from './entities/Converter32.js'
import { Converter41 } from './entities/Converter41.js'
import { Converter64 } from './entities/Converter64.js'
import { Converter76 } from './entities/Converter76.js'
import { Cookie } from './entities/Cookie.js'
import { Cube } from './entities/Cube.js'
import { Destabilizer } from './entities/Destabilizer.js'
import { Destabilizer2 } from './entities/Destabilizer2.js'
import { Destabilizer2a } from './entities/Destabilizer2a.js'
import { Doublechannel } from './entities/Doublechannel.js'
import { Doublechannel2 } from './entities/Doublechannel2.js'
import { Entropic } from './entities/Entropic.js'
import { Entropic2 } from './entities/Entropic2.js'
import { Entropic2a } from './entities/Entropic2a.js'
import { Entropic3 } from './entities/Entropic3.js'
import { Eye } from './entities/Eye.js'
import { Flower } from './entities/Flower.js'
import { Fruit } from './entities/Fruit.js'
import { Generaldecay } from './entities/Generaldecay.js'
import { Gradient } from './entities/Gradient.js'
import { Hollow } from './entities/Hollow.js'
import { Injector } from './entities/Injector.js'
import { Mega1 } from './entities/Mega1.js'
import { Mega1a } from './entities/Mega1a.js'
import { Mega1b } from './entities/Mega1b.js'
import { Mega2 } from './entities/Mega2.js'
import { Mega3 } from './entities/Mega3.js'
import { Pinhole } from './entities/Pinhole.js'
import { Preheater } from './entities/Preheater.js'
import { Pump } from './entities/Pump.js'
import { Pump2 } from './entities/Pump2.js'
import { Reflector } from './entities/Reflector.js'
import { Silo } from './entities/Silo.js'
import { Silo2 } from './entities/Silo2.js'
import { Stabilizer } from './entities/Stabilizer.js'
import { Stabilizer2 } from './entities/Stabilizer2.js'
import { Stabilizer3 } from './entities/Stabilizer3.js'
import { Strange } from './entities/Strange.js'
import { Strange1 } from './entities/Strange1.js'
import { Strange2 } from './entities/Strange2.js'
import { Strange3 } from './entities/Strange3.js'
import { Surge } from './entities/Surge.js'
import { Valve } from './entities/Valve.js'
import { Vault } from './entities/Vault.js'
import { Vessel } from './entities/Vessel.js'
import { Vessel2 } from './entities/Vessel2.js'
import { Voidsculpture } from './entities/Voidsculpture.js'
import { Waypoint } from './entities/Waypoint.js'

const EntitiesModule = {
	Entity,
	Annihilator,
	Auxpump,
	Auxpump2,
	Chasm,
	Clicker1,
	Clicker2,
	Clicker3,
	Conductor,
	Consumer,
	Converter13,
	Converter32,
	Converter41,
	Converter64,
	Converter76,
	Cookie,
	Cube,
	Destabilizer,
	Destabilizer2,
	Destabilizer2a,
	Doublechannel,
	Doublechannel2,
	Entropic,
	Entropic2,
	Entropic2a,
	Entropic3,
	Eye,
	Flower,
	Fruit,
	Generaldecay,
	Gradient,
	Hollow,
	Injector,
	Mega1,
	Mega1a,
	Mega1b,
	Mega2,
	Mega3,
	Pinhole,
	Preheater,
	Pump,
	Pump2,
	Reflector,
	Silo,
	Silo2,
	Stabilizer,
	Stabilizer2,
	Stabilizer3,
	Strange,
	Strange1,
	Strange2,
	Strange3,
	Surge,
	Valve,
	Vault,
	Vessel,
	Vessel2,
	Voidsculpture,
	Waypoint
}

// Preserve the legacy global bindings for the console and external runtime code.
Object.assign(
	globalThis,
	BezierModule,
	UiModule,
	SpritesModule,
	EntitiesModule,
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
