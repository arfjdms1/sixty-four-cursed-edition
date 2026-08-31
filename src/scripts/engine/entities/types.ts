import type { ColorTriplet, ResourceAmounts, Vec2 } from '../../../types/core.js'
import type { LanguagePack } from '../../words.js'
import type { CodexData } from '../../codex.js'
import type { Sprite } from '../../sprites.js'
import type { Entity } from './Entity.js'
import type { EntityContext } from './context/types.js'

export interface EntityHost {
	readonly entityContext: EntityContext
	ctx: CanvasRenderingContext2D
	unit: number
	pixelRatio: number
	zoom: number
	plane: 0 | 1
	bridge: boolean
	switchedplanes: boolean
	time: { lt: number; dt: number; realDt: number }
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
	resources: ResourceAmounts
	stuff: Entity[]
	stuffMap: Record<string, Entity | undefined>
	entitiesInGame: Record<string, number | undefined>
	stats: {
		totalResourcesMined: number[]
		absoluteResourcesCount: number
		maxDepth: number
		timeEvents: number
		totalPlayTime: number
		totalCubeClicks: number
		machinesBuild: number
		machinesSold: number
		timesTeleported: number
		strangeRockPoked: number
		darkVisited: number
		timeSinceLastDelete: number | null
		excavatorWasBuilt: boolean
	} & Record<string, unknown>
	words: LanguagePack
	codex: CodexData
	images: Record<string, HTMLImageElement | undefined>
	eraserType: 0 | 1 | 2
	makeReadable(value: number): string | number
	resourcesSprites: Sprite[] & Record<string | number, Sprite>
	translation?: Vec2
	shop?: {
		existed?: Record<string, boolean | undefined>
		selected?: boolean
		selectedId?: number
		items?: Array<{ name: string; html: HTMLElement }>
		updateElements?: () => void
		vessel?: HTMLElement
		shopToggle?: HTMLElement
	}
	bigFont?: string

	// Sets
	activeCubes: Set<Entity>
	annihilators: Set<Entity>
	annihilationMachines: Set<Entity>
	vaults: Set<Entity>
	fruits: Set<Entity>
	pumps: Set<Entity>
	conductors: Set<Entity>
	activeConverters: Set<Entity>
	stabilizers: Set<Entity>

	// Special entities & state
	hoveredEntity?: Entity | false
	hoveredCell?: Vec2 | false
	itemInHand?: Entity | false
	altActive: boolean
	chasm?: Entity | false | { chasmNetwork?: unknown; chasmNetworkKey?: string; position?: Vec2; updateChain?: () => void }
	gradient?: Entity | false
	preGradient?: unknown
	pinhole?: Entity | false
	cookie?: unknown
	voidsculpture?: Entity | false | { position: Vec2 }
	generaldecay?: Entity | false
	strange1?: unknown
	strange2?: unknown
	strange3?: unknown
	forcedAnnihilation: boolean
	gameIsLocked: boolean
	perpetum: boolean
	got64kmphAchievement: boolean
	rbrtimeup: boolean
	hollowSite: unknown
	hollowHardness: number
	hellgemChunk: number
	resourceTransferType: number
	showUnfilled: boolean
	unfilledEntities: Entity[]
	currentlyExtracting: number
	waypointList?: unknown[]

	// Methods
	uvToXY(uv: Vec2): Vec2
	uvToXYUntranslated(uv: Vec2): Vec2
	xyToUV(xy: Vec2): Vec2
	entityAtCoordinates(pos: Vec2): Entity | undefined
	drawPrism(pos: Vec2, width: number, height: number, colors: ColorTriplet, ...args: unknown[]): void
	playSound(sfx: string | number, ...args: unknown[]): void
	startSound(sfx: string | number, ...args: unknown[]): unknown
	stopSound(id: unknown, ...args: unknown[]): void
	getPanValueFromX(x: number): number
	getLoudnessFromXY(pos: Vec2): number
	getRealPrice(name: string, selling?: boolean): number[]
	addResourcesFromArray(resources: number[], skip?: boolean): void
	substractResourcesFromArray(resources: number[]): void
	createExhaust(pos: Vec2, color?: string): void
	createResourceExplosion(...args: unknown[]): void
	createResourceSpark(...args: unknown[]): void
	createResourceTransfer(...args: unknown[]): void
	createChasmTransfer(...args: unknown[]): void
	createLightning(...args: unknown[]): void
	createHollowEvent(...args: unknown[]): void
	addEntity(name: string, pos: Vec2, misc?: unknown): unknown
	clearCell(pos: Vec2): void
	canRelocate(entity: Entity): boolean
	updateEraserType(...args: unknown[]): void
	switchPlane(plane: 0 | 1): void
	watchCredits(): void
	spawnSurge(type?: number, ...args: unknown[]): void
	findEntity?(entityClass: unknown): Entity | undefined
	useWaypoint(waypoint: Entity, ...args: unknown[]): unknown
	addWaypoint(waypoint: Entity, ...args: unknown[]): unknown
	removeWaypoint(waypoint: Entity, ...args: unknown[]): unknown
	processMousemove(): void
	saveGame(...args: unknown[]): unknown
	requestResources(fuel: number[], position?: Vec2 | ((...args: unknown[]) => void) | boolean, cb?: () => void): boolean
}
