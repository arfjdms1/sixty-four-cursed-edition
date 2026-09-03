import type { GameStartupPayload } from '../types/platform.js'
import { ContentBuilder } from './content/ContentContext.js'
import { registerBaseContent } from './content/registerBaseContent.js'
import { discoverBundledMods } from './modding/discoverBundledMods.js'
import { DEFAULT_MOD_STATE_KEY, LocalStorageModStateStorage } from './modding/ModEnabledState.js'
import { ModLoader } from './modding/ModLoader.js'
import { setCurrentModLoader } from './modding/runtime.js'
import * as BezierModule from './bezier.js'
import * as UiModule from './ui.js'
import * as SpritesModule from './sprites.js'
import * as WordsModule from './words.js'
import * as CodexModule from './codex.js'
import * as GameModule from './core/Game.js'
import { Game } from './core/Game.js'
import { Entity } from './engine/entities/Entity.js'
import { Annihilator } from './content/base/machines/industrial/Annihilator.js'
import { Auxpump } from './content/base/machines/channels/Auxpump.js'
import { Auxpump2 } from './content/base/machines/channels/Auxpump2.js'
import { Chasm } from './content/base/world/cosmic/Chasm.js'
import { Clicker1 } from './content/base/machines/clickers/Clicker1.js'
import { Clicker2 } from './content/base/machines/clickers/Clicker2.js'
import { Clicker3 } from './content/base/machines/clickers/Clicker3.js'
import { Conductor } from './content/base/machines/industrial/Conductor.js'
import { Consumer } from './content/base/machines/industrial/Consumer.js'
import { Converter13 } from './content/base/machines/converters/Converter13.js'
import { Converter32 } from './content/base/machines/converters/Converter32.js'
import { Converter41 } from './content/base/machines/converters/Converter41.js'
import { Converter64 } from './content/base/machines/converters/Converter64.js'
import { Converter76 } from './content/base/machines/converters/Converter76.js'
import { Cookie } from './content/base/world/anomalies/Cookie.js'
import { Cube } from './content/base/entities/Cube.js'
import { Destabilizer } from './content/base/machines/destabilizers/Destabilizer.js'
import { Destabilizer2 } from './content/base/machines/destabilizers/Destabilizer2.js'
import { Destabilizer2a } from './content/base/machines/destabilizers/Destabilizer2a.js'
import { Doublechannel } from './content/base/machines/channels/Doublechannel.js'
import { Doublechannel2 } from './content/base/machines/channels/Doublechannel2.js'
import { Entropic } from './content/base/machines/entropics/Entropic.js'
import { Entropic2 } from './content/base/machines/entropics/Entropic2.js'
import { Entropic2a } from './content/base/machines/entropics/Entropic2a.js'
import { Entropic3 } from './content/base/machines/entropics/Entropic3.js'
import { Eye } from './content/base/entities/Eye.js'
import { Flower } from './content/base/world/botanicals/Flower.js'
import { Fruit } from './content/base/world/botanicals/Fruit.js'
import { Generaldecay } from './content/base/world/anomalies/Generaldecay.js'
import { Gradient } from './content/base/machines/channels/Gradient.js'
import { Hollow } from './content/base/world/botanicals/Hollow.js'
import { Injector } from './content/base/machines/destabilizers/Injector.js'
import { Mega1 } from './content/base/machines/megas/Mega1.js'
import { Mega1a } from './content/base/machines/megas/Mega1a.js'
import { Mega1b } from './content/base/machines/megas/Mega1b.js'
import { Mega2 } from './content/base/machines/megas/Mega2.js'
import { Mega3 } from './content/base/machines/megas/Mega3.js'
import { Pinhole } from './content/base/world/cosmic/Pinhole.js'
import { Preheater } from './content/base/machines/converters/Preheater.js'
import { Pump } from './content/base/machines/pumps/Pump.js'
import { Pump2 } from './content/base/machines/pumps/Pump2.js'
import { Reflector } from './content/base/machines/converters/Reflector.js'
import { Silo } from './content/base/machines/storage/Silo.js'
import { Silo2 } from './content/base/machines/storage/Silo2.js'
import { Stabilizer } from './content/base/machines/stabilizers/Stabilizer.js'
import { Stabilizer2 } from './content/base/machines/stabilizers/Stabilizer2.js'
import { Stabilizer3 } from './content/base/machines/stabilizers/Stabilizer3.js'
import { Strange } from './content/base/world/monoliths/Strange.js'
import { Strange1 } from './content/base/world/monoliths/Strange1.js'
import { Strange2 } from './content/base/world/monoliths/Strange2.js'
import { Strange3 } from './content/base/world/monoliths/Strange3.js'
import { Surge } from './content/base/entities/Surge.js'
import { Valve } from './content/base/machines/channels/Valve.js'
import { Vault } from './content/base/machines/storage/Vault.js'
import { Vessel } from './content/base/machines/storage/Vessel.js'
import { Vessel2 } from './content/base/machines/storage/Vessel2.js'
import { Voidsculpture } from './content/base/world/cosmic/Voidsculpture.js'
import { Waypoint } from './content/base/world/anomalies/Waypoint.js'

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
	Waypoint,
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

let game: Game | undefined
globalThis.game = game

let startPromise: Promise<void> | undefined

function startGame(preload?: GameStartupPayload): Promise<void> {
	if (!startPromise) startPromise = initializeGame(preload)
	return startPromise
}

async function initializeGame(preload?: GameStartupPayload): Promise<void> {
	const canvas = document.querySelector<HTMLCanvasElement>(`.canvas`)
	if (canvas) {
		const contentBuilder = new ContentBuilder()
		registerBaseContent(contentBuilder)
		const accountId = preload?.steamId ?? ``
		const modLoader = new ModLoader({
			storage: new LocalStorageModStateStorage(),
			storageKey: `${DEFAULT_MOD_STATE_KEY}${accountId}`,
		})
		modLoader.discover(await discoverBundledMods())
		await modLoader.activateEnabled()
		setCurrentModLoader(modLoader)
		const content = contentBuilder.finalize()
		game = new Game(canvas, preload, content)
		globalThis.game = game
	}
}

function launchGame(preload?: GameStartupPayload): void {
	void startGame(preload).catch(error => {
		setTimeout(() => { throw error }, 0)
	})
}

window.onload = () => {
	try {
		if (typeof window.require !== `function`) throw new ReferenceError(`require is not defined`)
		const spaceport = window.require(`electron`).ipcRenderer
		if (spaceport){
			window.onerror = (_ev, _so, _li, _co, er) => {
				spaceport.send(`gameError`, er)
			}
			spaceport.on(`hereYouGoSir`, (_e, d) => {
				launchGame(d)
			})
			spaceport.send(`getMyStuff`, `please`)
		}
	} catch (_e){
		launchGame()
	}
}
