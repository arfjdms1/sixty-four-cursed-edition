import type { UsedIpcRenderer } from './platform.js'

type BezierGlobals = typeof import('../scripts/bezier.js')
type SpriteGlobals = typeof import('../scripts/sprites.js')
type CodexGlobals = typeof import('../scripts/codex.js')
type UiGlobals = typeof import('../scripts/ui.js')
type WordsGlobals = typeof import('../scripts/words.js')
type GameGlobals = typeof import('../scripts/game.js')
type RuntimeGame = import('../scripts/game.js').Game

type EntityType = typeof import('../scripts/entities/Entity.js').Entity
type AnnihilatorType = typeof import('../scripts/entities/Annihilator.js').Annihilator
type AuxpumpType = typeof import('../scripts/entities/Auxpump.js').Auxpump
type Auxpump2Type = typeof import('../scripts/entities/Auxpump2.js').Auxpump2
type ChasmType = typeof import('../scripts/entities/Chasm.js').Chasm
type Clicker1Type = typeof import('../scripts/entities/Clicker1.js').Clicker1
type Clicker2Type = typeof import('../scripts/entities/Clicker2.js').Clicker2
type Clicker3Type = typeof import('../scripts/entities/Clicker3.js').Clicker3
type ConductorType = typeof import('../scripts/entities/Conductor.js').Conductor
type ConsumerType = typeof import('../scripts/entities/Consumer.js').Consumer
type Converter13Type = typeof import('../scripts/entities/Converter13.js').Converter13
type Converter32Type = typeof import('../scripts/entities/Converter32.js').Converter32
type Converter41Type = typeof import('../scripts/entities/Converter41.js').Converter41
type Converter64Type = typeof import('../scripts/entities/Converter64.js').Converter64
type Converter76Type = typeof import('../scripts/entities/Converter76.js').Converter76
type CookieType = typeof import('../scripts/entities/Cookie.js').Cookie
type CubeType = typeof import('../scripts/entities/Cube.js').Cube
type DestabilizerType = typeof import('../scripts/entities/Destabilizer.js').Destabilizer
type Destabilizer2Type = typeof import('../scripts/entities/Destabilizer2.js').Destabilizer2
type Destabilizer2aType = typeof import('../scripts/entities/Destabilizer2a.js').Destabilizer2a
type DoublechannelType = typeof import('../scripts/entities/Doublechannel.js').Doublechannel
type Doublechannel2Type = typeof import('../scripts/entities/Doublechannel2.js').Doublechannel2
type EntropicType = typeof import('../scripts/entities/Entropic.js').Entropic
type Entropic2Type = typeof import('../scripts/entities/Entropic2.js').Entropic2
type Entropic2aType = typeof import('../scripts/entities/Entropic2a.js').Entropic2a
type Entropic3Type = typeof import('../scripts/entities/Entropic3.js').Entropic3
type EyeType = typeof import('../scripts/entities/Eye.js').Eye
type FlowerType = typeof import('../scripts/entities/Flower.js').Flower
type FruitType = typeof import('../scripts/entities/Fruit.js').Fruit
type GeneraldecayType = typeof import('../scripts/entities/Generaldecay.js').Generaldecay
type GradientType = typeof import('../scripts/entities/Gradient.js').Gradient
type HollowType = typeof import('../scripts/entities/Hollow.js').Hollow
type InjectorType = typeof import('../scripts/entities/Injector.js').Injector
type Mega1Type = typeof import('../scripts/entities/Mega1.js').Mega1
type Mega1aType = typeof import('../scripts/entities/Mega1a.js').Mega1a
type Mega1bType = typeof import('../scripts/entities/Mega1b.js').Mega1b
type Mega2Type = typeof import('../scripts/entities/Mega2.js').Mega2
type Mega3Type = typeof import('../scripts/entities/Mega3.js').Mega3
type PinholeType = typeof import('../scripts/entities/Pinhole.js').Pinhole
type PreheaterType = typeof import('../scripts/entities/Preheater.js').Preheater
type PumpType = typeof import('../scripts/entities/Pump.js').Pump
type Pump2Type = typeof import('../scripts/entities/Pump2.js').Pump2
type ReflectorType = typeof import('../scripts/entities/Reflector.js').Reflector
type SiloType = typeof import('../scripts/entities/Silo.js').Silo
type Silo2Type = typeof import('../scripts/entities/Silo2.js').Silo2
type StabilizerType = typeof import('../scripts/entities/Stabilizer.js').Stabilizer
type Stabilizer2Type = typeof import('../scripts/entities/Stabilizer2.js').Stabilizer2
type Stabilizer3Type = typeof import('../scripts/entities/Stabilizer3.js').Stabilizer3
type StrangeType = typeof import('../scripts/entities/Strange.js').Strange
type Strange1Type = typeof import('../scripts/entities/Strange1.js').Strange1
type Strange2Type = typeof import('../scripts/entities/Strange2.js').Strange2
type Strange3Type = typeof import('../scripts/entities/Strange3.js').Strange3
type SurgeType = typeof import('../scripts/entities/Surge.js').Surge
type ValveType = typeof import('../scripts/entities/Valve.js').Valve
type VaultType = typeof import('../scripts/entities/Vault.js').Vault
type VesselType = typeof import('../scripts/entities/Vessel.js').Vessel
type Vessel2Type = typeof import('../scripts/entities/Vessel2.js').Vessel2
type VoidsculptureType = typeof import('../scripts/entities/Voidsculpture.js').Voidsculpture
type WaypointType = typeof import('../scripts/entities/Waypoint.js').Waypoint

declare global {
	interface Window extends
		BezierGlobals,
		SpriteGlobals,
		CodexGlobals,
		UiGlobals,
		WordsGlobals,
		GameGlobals {
		Entity: EntityType
		Annihilator: AnnihilatorType
		Auxpump: AuxpumpType
		Auxpump2: Auxpump2Type
		Chasm: ChasmType
		Clicker1: Clicker1Type
		Clicker2: Clicker2Type
		Clicker3: Clicker3Type
		Conductor: ConductorType
		Consumer: ConsumerType
		Converter13: Converter13Type
		Converter32: Converter32Type
		Converter41: Converter41Type
		Converter64: Converter64Type
		Converter76: Converter76Type
		Cookie: CookieType
		Cube: CubeType
		Destabilizer: DestabilizerType
		Destabilizer2: Destabilizer2Type
		Destabilizer2a: Destabilizer2aType
		Doublechannel: DoublechannelType
		Doublechannel2: Doublechannel2Type
		Entropic: EntropicType
		Entropic2: Entropic2Type
		Entropic2a: Entropic2aType
		Entropic3: Entropic3Type
		Eye: EyeType
		Flower: FlowerType
		Fruit: FruitType
		Generaldecay: GeneraldecayType
		Gradient: GradientType
		Hollow: HollowType
		Injector: InjectorType
		Mega1: Mega1Type
		Mega1a: Mega1aType
		Mega1b: Mega1bType
		Mega2: Mega2Type
		Mega3: Mega3Type
		Pinhole: PinholeType
		Preheater: PreheaterType
		Pump: PumpType
		Pump2: Pump2Type
		Reflector: ReflectorType
		Silo: SiloType
		Silo2: Silo2Type
		Stabilizer: StabilizerType
		Stabilizer2: Stabilizer2Type
		Stabilizer3: Stabilizer3Type
		Strange: StrangeType
		Strange1: Strange1Type
		Strange2: Strange2Type
		Strange3: Strange3Type
		Surge: SurgeType
		Valve: ValveType
		Vault: VaultType
		Vessel: VesselType
		Vessel2: Vessel2Type
		Voidsculpture: VoidsculptureType
		Waypoint: WaypointType
		game: RuntimeGame | undefined
		require?: (id: 'electron') => { ipcRenderer: UsedIpcRenderer }
	}

	var Bezier: BezierGlobals['Bezier']
	var Sprite: SpriteGlobals['Sprite']
	var GLSprite: SpriteGlobals['GLSprite']
	var abstract_getCodex: CodexGlobals['abstract_getCodex']

	var Entity: EntityType
	var Annihilator: AnnihilatorType
	var Auxpump: AuxpumpType
	var Auxpump2: Auxpump2Type
	var Chasm: ChasmType
	var Clicker1: Clicker1Type
	var Clicker2: Clicker2Type
	var Clicker3: Clicker3Type
	var Conductor: ConductorType
	var Consumer: ConsumerType
	var Converter13: Converter13Type
	var Converter32: Converter32Type
	var Converter41: Converter41Type
	var Converter64: Converter64Type
	var Converter76: Converter76Type
	var Cookie: CookieType
	var Cube: CubeType
	var Destabilizer: DestabilizerType
	var Destabilizer2: Destabilizer2Type
	var Destabilizer2a: Destabilizer2aType
	var Doublechannel: DoublechannelType
	var Doublechannel2: Doublechannel2Type
	var Entropic: EntropicType
	var Entropic2: Entropic2Type
	var Entropic2a: Entropic2aType
	var Entropic3: Entropic3Type
	var Eye: EyeType
	var Flower: FlowerType
	var Fruit: FruitType
	var Generaldecay: GeneraldecayType
	var Gradient: GradientType
	var Hollow: HollowType
	var Injector: InjectorType
	var Mega1: Mega1Type
	var Mega1a: Mega1aType
	var Mega1b: Mega1bType
	var Mega2: Mega2Type
	var Mega3: Mega3Type
	var Pinhole: PinholeType
	var Preheater: PreheaterType
	var Pump: PumpType
	var Pump2: Pump2Type
	var Reflector: ReflectorType
	var Silo: SiloType
	var Silo2: Silo2Type
	var Stabilizer: StabilizerType
	var Stabilizer2: Stabilizer2Type
	var Stabilizer3: Stabilizer3Type
	var Strange: StrangeType
	var Strange1: Strange1Type
	var Strange2: Strange2Type
	var Strange3: Strange3Type
	var Surge: SurgeType
	var Valve: ValveType
	var Vault: VaultType
	var Vessel: VesselType
	var Vessel2: Vessel2Type
	var Voidsculpture: VoidsculptureType
	var Waypoint: WaypointType

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
