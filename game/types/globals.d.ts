import type { UsedIpcRenderer } from './platform.js'

type BezierGlobals = typeof import('../scripts/bezier.js')
type SpriteGlobals = typeof import('../scripts/sprites.js')
type CodexGlobals = typeof import('../scripts/codex.js')
type StuffGlobals = typeof import('../scripts/stuff.js')
type UiGlobals = typeof import('../scripts/ui.js')
type WordsGlobals = typeof import('../scripts/words.js')
type GameGlobals = typeof import('../scripts/game.js')
type RuntimeGame = import('../scripts/game.js').Game

declare global {
	interface Window extends
		BezierGlobals,
		SpriteGlobals,
		CodexGlobals,
		StuffGlobals,
		UiGlobals,
		WordsGlobals,
		GameGlobals {
		game: RuntimeGame | undefined
		require?: (id: 'electron') => { ipcRenderer: UsedIpcRenderer }
	}

	var Bezier: BezierGlobals['Bezier']
	var Sprite: SpriteGlobals['Sprite']
	var GLSprite: SpriteGlobals['GLSprite']
	var abstract_getCodex: CodexGlobals['abstract_getCodex']

	var Entity: StuffGlobals['Entity']
	var Strange: StuffGlobals['Strange']
	var Strange1: StuffGlobals['Strange1']
	var Strange2: StuffGlobals['Strange2']
	var Strange3: StuffGlobals['Strange3']
	var Vault: StuffGlobals['Vault']
	var Doublechannel: StuffGlobals['Doublechannel']
	var Consumer: StuffGlobals['Consumer']
	var Preheater: StuffGlobals['Preheater']
	var Doublechannel2: StuffGlobals['Doublechannel2']
	var Auxpump: StuffGlobals['Auxpump']
	var Auxpump2: StuffGlobals['Auxpump2']
	var Valve: StuffGlobals['Valve']
	var Injector: StuffGlobals['Injector']
	var Entropic: StuffGlobals['Entropic']
	var Entropic2: StuffGlobals['Entropic2']
	var Entropic2a: StuffGlobals['Entropic2a']
	var Entropic3: StuffGlobals['Entropic3']
	var Destabilizer: StuffGlobals['Destabilizer']
	var Destabilizer2: StuffGlobals['Destabilizer2']
	var Destabilizer2a: StuffGlobals['Destabilizer2a']
	var Converter32: StuffGlobals['Converter32']
	var Converter13: StuffGlobals['Converter13']
	var Converter41: StuffGlobals['Converter41']
	var Converter76: StuffGlobals['Converter76']
	var Converter64: StuffGlobals['Converter64']
	var Reflector: StuffGlobals['Reflector']
	var Generaldecay: StuffGlobals['Generaldecay']
	var Cube: StuffGlobals['Cube']
	var Pump: StuffGlobals['Pump']
	var Pump2: StuffGlobals['Pump2']
	var Mega1: StuffGlobals['Mega1']
	var Mega1a: StuffGlobals['Mega1a']
	var Mega1b: StuffGlobals['Mega1b']
	var Mega2: StuffGlobals['Mega2']
	var Mega3: StuffGlobals['Mega3']
	var Eye: StuffGlobals['Eye']
	var Clicker1: StuffGlobals['Clicker1']
	var Clicker2: StuffGlobals['Clicker2']
	var Clicker3: StuffGlobals['Clicker3']
	var Cookie: StuffGlobals['Cookie']
	var Pinhole: StuffGlobals['Pinhole']
	var Gradient: StuffGlobals['Gradient']
	var Chasm: StuffGlobals['Chasm']
	var Conductor: StuffGlobals['Conductor']
	var Voidsculpture: StuffGlobals['Voidsculpture']
	var Hollow: StuffGlobals['Hollow']
	var Flower: StuffGlobals['Flower']
	var Fruit: StuffGlobals['Fruit']
	var Vessel: StuffGlobals['Vessel']
	var Vessel2: StuffGlobals['Vessel2']
	var Silo: StuffGlobals['Silo']
	var Silo2: StuffGlobals['Silo2']
	var Waypoint: StuffGlobals['Waypoint']
	var Annihilator: StuffGlobals['Annihilator']
	var Surge: StuffGlobals['Surge']
	var Stabilizer: StuffGlobals['Stabilizer']
	var Stabilizer2: StuffGlobals['Stabilizer2']
	var Stabilizer3: StuffGlobals['Stabilizer3']

	var Achiever: UiGlobals['Achiever']
	var Messenger: UiGlobals['Messenger']
	var Splash: UiGlobals['Splash']
	var Cloud: UiGlobals['Cloud']
	var Shop: UiGlobals['Shop']
	var Explainer: UiGlobals['Explainer']

	var generateGlobalJson: WordsGlobals['generateGlobalJson']
	var getAllJson: WordsGlobals['getAllJson']
	var generateTranslationJson: WordsGlobals['generateTranslationJson']
	var getLanguageObjectFromString: WordsGlobals['getLanguageObjectFromString']
	var _getLanguageObjectFromData: WordsGlobals['_getLanguageObjectFromData']
	var getLanguageObject: WordsGlobals['getLanguageObject']
	var abstract_getWords: WordsGlobals['abstract_getWords']

	var VFX: GameGlobals['VFX']
	var Exhaust: GameGlobals['Exhaust']
	var ResourceExplosion: GameGlobals['ResourceExplosion']
	var ResourceSpark: GameGlobals['ResourceSpark']
	var ResourceTransfer: GameGlobals['ResourceTransfer']
	var ChasmTransfer: GameGlobals['ChasmTransfer']
	var Lightning: GameGlobals['Lightning']
	var Game: GameGlobals['Game']
	var game: RuntimeGame | undefined
}

export {}
