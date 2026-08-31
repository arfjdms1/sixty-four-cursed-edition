import type { CodexData } from '../codex.js'
import type { VFX } from '../effects/VFX.js'
import type { Entity } from '../entities/Entity.js'
import type { Sprite } from '../sprites.js'
import type { Achiever, Cloud, Explainer, Messenger, Shop, Splash } from '../ui.js'
import type { LanguageCode, LanguagePack } from '../words.js'
import type { ResourceAmounts, Vec2 } from '../../types/core.js'
import type { GameSpaceport } from '../../types/platform.js'
import type { SaveBackup, SaveStats, SlowdownState } from '../../types/save.js'
import type { SaveSystem } from '../save/SaveSystem.js'
import type { AudioSystem } from '../audio/AudioSystem.js'
import type { EffectSystem } from '../effects/EffectSystem.js'
import type { InputSystem } from '../input/InputSystem.js'
import type { RenderSystem } from '../rendering/RenderSystem.js'
import type { MouseState, PointerInput } from '../input/types.js'
import type { PlayingSound, SoundState, DecodedAudioSample as AudioSample } from '../audio/types.js'
import type { AnalyticsState } from '../resources/types.js'
import type { ResourceSystem } from '../resources/ResourceSystem.js'
import type { EntityManager } from '../entities/EntityManager.js'
import type { InteractionSystem } from '../interaction/InteractionSystem.js'
import type { AutonomySystem } from '../autonomy/AutonomySystem.js'
import type { WorldEventSystem } from '../events/WorldEventSystem.js'
import type { HollowEvent } from '../events/types.js'
import type { EntityRegistry } from '../registry/EntityRegistry.js'

export type { PlayingSound, SoundState, AudioSample, MouseState, PointerInput }
export type { AnalyticsGraph, AnalyticsState } from '../resources/types.js'
export type { HollowEvent } from '../events/types.js'

export interface GameEntity extends Entity {
	eraser?: boolean
	span?: number
	ondarkmousedown?(): void
}

export interface HeldItem extends GameEntity {
	eraser?: boolean
}

export interface GlState {
	gl: WebGL2RenderingContext
	textures: Record<string, WebGLTexture | undefined>
	pal: number
	tal: number
	uspriteoffset: WebGLUniformLocation | null
	uoffset: WebGLUniformLocation | null
}

export type GameStats = Omit<SaveStats, 'timeSinceLastDelete'> & {
	timeSinceLastDelete: number
} & Record<string, number | boolean | null | number[]>

export interface GameRuntimeState {
	canvas: HTMLCanvasElement
	ctx: CanvasRenderingContext2D
	isWindows: boolean
	steamId: string | number
	languages: LanguageCode[]
	languageId: number
	language: LanguageCode
	hasSteam: boolean
	saves: SaveSystem
	audio: AudioSystem
	effects: EffectSystem
	input: InputSystem
	renderer: RenderSystem
	resourceSystem: ResourceSystem
	entityManager: EntityManager
	interaction: InteractionSystem
	autonomy: AutonomySystem
	worldEvents: WorldEventSystem
	entityRegistry: EntityRegistry
	backups: SaveBackup[]
	spaceport: GameSpaceport
	pixelRatio: number
	translation: Vec2
	translationMap: [number, number, number, number]
	zoomRange: Vec2
	zoom: number
	translationSpeed: number
	distanceToOrigins: number
	time: { lt: number; dt: number; realDt: number }
	renderTime: { lt: number; dt: number }
	mouse: {
		xy: Vec2
		offsetxy: Vec2
		cursorVisible: boolean
		state: number
		positionChanged: boolean
		lastOffset: Vec2
		lastTouch: Vec2
		automate: boolean
		maxTimer: number
		timer: number
	}
	gamepadButtons: Array<number | boolean>
	isMute: boolean
	globalSoundVolume: number
	chillMode: boolean
	version: string
	stuff: GameEntity[]
	stuffMap: Record<string, GameEntity | undefined>
	unlockedEntities: Record<string, boolean | undefined>
	vfx: VFX[]
	chasmVfx: VFX[]
	entitiesInGame: Record<string, number>
	plane: 0 | 1
	bridge: boolean
	maxEntityHeight: number
	selectedCell: Vec2 | false
	selectedEntity: GameEntity | false
	resourceTransferType: number
	onlyones: Record<string, boolean | undefined>
	eraserType: 0 | 1 | 2
	hellgemChunk: number
	renderLimitOfAKind: number
	currentHint: { entity?: GameEntity; element?: HTMLDivElement }
	canPlace: boolean | undefined
	needNoHelp: boolean
	hollowSite: unknown
	hollowHardness: number
	hollowEvents: HollowEvent[]
	darkHollowEvents: HollowEvent[]
	hollowImage: HTMLImageElement
	surgeSpawnTimer: number
	voidsculpture: GameEntity | false
	switchedplanes: boolean
	slowdown: SlowdownState
	waypointList: Array<GameEntity | undefined>
	activeCubes: Set<Entity>
	annihilators: Set<Entity>
	annihilationMachines: Set<Entity>
	vaults: Set<Entity>
	fruits: Set<Entity>
	pumps: Set<Entity>
	conductors: Set<Entity>
	activeConverters: Set<Entity>
	stabilizers: Set<Entity>
	stats: GameStats
	codex: CodexData
	images: Record<string, HTMLImageElement | undefined>
	words: LanguagePack
	shop: Shop
	splash: Splash
	messenger: Messenger
	steamAchievements?: Array<0 | 1>
	achiever: Achiever
	explainer: Explainer
	clock: Worker
	analytics: AnalyticsState
	photofobia?: boolean
	w: number
	h: number
	w2: number
	h2: number
	solidUnit: number
	unit: number
	screenUnit: number
	regularFont: string
	smallFont: string
	microFont: string
	bigFont: string
	flashlight: CanvasGradient
	preventSaving?: boolean
	preventCloud?: boolean
	halt?: boolean
	lastDialogue?: boolean
	credits?: HTMLDivElement
	creditImage: HTMLVideoElement
	creditPillar: HTMLDivElement
	resources: ResourceAmounts
	resourcePops: number[]
	resourcesSprites: Sprite[] & Record<string | number, Sprite>
	resourceBuffer: number[]
	resourceRates: number[]
	resourceHomes: Vec2[]
	glcanvas: HTMLCanvasElement
	gl: WebGL2RenderingContext
	glStuff: GlState
	itemInHand?: HeldItem
	itemInHandPriceTag?: Cloud
	transportedEntity?: GameEntity
	hoveredCell?: Vec2
	hoveredEntity?: GameEntity
	hoveredResource: number | false
	altActive: boolean
	pressedQOnBlank?: boolean
	pressedQOnMachine?: boolean
	actx?: AudioContext
	sfx?: SoundState
	resizeAnimationFrame?: number
	gamepadControl?: boolean
	thereWasZoomAction?: boolean
	keyboardMovementHappening?: number
	zoomWhenShiftPressed?: number
	shiftPressed?: boolean
	rateMeasureMode?: boolean
	currentlyExtracting: number
	forcedAnnihilation?: boolean
	chromaToContain: number
	unfilledEntities: GameEntity[]
	showUnfilled: boolean
	gameIsLocked: boolean
	perpetum: boolean
	got64kmphAchievement: boolean
	rbrtimeup: boolean
	range: { x: Vec2; y: Vec2 }
	chasm?: GameEntity
	gradient?: GameEntity
	pinhole?: GameEntity
	generaldecay?: GameEntity & { consume(resources: number[]): void }
}

declare global {
	var webkitAudioContext: typeof AudioContext
}
