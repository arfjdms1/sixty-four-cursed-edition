import type { ColorTriplet, ResourceAmounts, Vec2 } from '../../types/core.js'
import type { CodexData } from '../codex.js'
import type { Entity } from '../entities/Entity.js'
import type { AnalyticsState, GameEntity, HeldItem, HollowEvent } from '../game/types.js'
import type { MouseState } from '../input/types.js'
import type { Sprite } from '../sprites.js'
import type { Cloud } from '../ui.js'
import type { LanguagePack } from '../words.js'

export interface RenderHost extends WorldProjection {
	canvas: HTMLCanvasElement
	ctx: CanvasRenderingContext2D
	pixelRatio: number
	translation: Vec2
	zoom: number
	solidUnit: number
	unit: number
	screenUnit: number
	w: number
	h: number
	w2: number
	h2: number
	regularFont: string
	smallFont: string
	microFont: string
	bigFont: string
	flashlight: CanvasGradient
	photofobia?: boolean
	chillMode: boolean
	plane: 0 | 1
	altActive: boolean
	slowdown: { state: boolean; f: number }
	mouse: MouseState
	hoveredCell?: Vec2
	hoveredEntity?: GameEntity
	itemInHand?: HeldItem
	itemInHandPriceTag?: Cloud
	currentHint: { entity?: GameEntity; element?: HTMLDivElement }
	canPlace: boolean | undefined
	showUnfilled: boolean
	unfilledEntities: GameEntity[]
	stuff: GameEntity[]
	stuffMap: Record<string, GameEntity | undefined>
	conductors: Set<Entity>
	resources: ResourceAmounts
	resourcePops: number[]
	resourcesSprites: Sprite[] & Record<string | number, Sprite>
	resourceHomes: Vec2[]
	hoveredResource: number | false
	entitiesInGame: Record<string, number>
	distanceToOrigins: number
	words: LanguagePack
	codex: CodexData
	analytics: AnalyticsState
	chasm?: GameEntity
	pinhole?: GameEntity
	hollowEvents: HollowEvent[]
	darkHollowEvents: HollowEvent[]
	hollowImage: HTMLImageElement

	makeReadable(n: number): string | number
	setResourceHomes(): void
	drawResourceInScreenCoordinates(id: number, p: Vec2): void
	drawPrism(position: Vec2, size: number, height: number, triplet?: ColorTriplet): void
	isVisible(entity: GameEntity): boolean
	renderSlowdown(): void
	renderHoveredCell(): void
	renderSOI(entity: GameEntity | Vec2): void
	renderAffected(name: string): void
	renderCursor(): void
	removeHint(): void
	renderUnfilled(): void
	renderAvailability(): void
	renderResources(): void
	renderDarkResources(): void
	renderConductors(dt: number): void
	renderEntities(dt: number): void
	renderVFX(): void
	renderChasmVFX(): void
	renderChasm(): void
	renderHollowEvents(): void
	renderDarkHollowEvents(): void
}

export interface WorldProjection {
	uvToXY(uv: Vec2): Vec2
	uvToXYUntranslated(uv: Vec2): Vec2
	xyToUV(xy: Vec2): Vec2
	getHitCoordinates(xy: Vec2): Vec2
}
