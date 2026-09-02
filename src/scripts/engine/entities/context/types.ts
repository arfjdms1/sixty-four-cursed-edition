import type { ColorTriplet, Vec2 } from '../../../../types/core.js'
import type { EffectCompletion, EffectVisibility } from '../../effects/types.js'
import type { ResourceTypeId } from '../../../registry/resource-types.js'
import type { GameEntity } from '../../../core/types.js'
import type { Sprite } from '../../../sprites.js'
import type { Entity } from '../Entity.js'

export interface HollowSiteAccess {
	spawnHollow(): void
	spawnedHollows: number
	readonly maxSpawnedHollows: number
	spawnTimerBase: number
}

export interface EntityWorldReferenceContext {
	hasVoidsculpture(): boolean
	voidsculpturePosition(): Vec2 | undefined
	registerVoidsculpture(entity: Entity): void
	clearVoidsculpture(): void
	hasPinhole(): boolean
	registerPinhole(entity: Entity): void
	hollowSite(): HollowSiteAccess | false
	registerHollowSite(access: HollowSiteAccess): void
	clearHollowSite(): void
}

export interface EntityAudioContext {
	playSound(id: string | number, panning?: number, loudness?: number, dark?: boolean, forced?: boolean): void
	stopSound(sfx: unknown, t?: number): void
	fadeSound(id: string | number, targetVolume?: number, time?: number): void
	getPanValueFromX(x: number): number
	getLoudnessFromXY(xy: Vec2): number
}

export interface EntityEffectContext {
	createResourceTransfer(
		resources: number[],
		source?: Vec2 | false | unknown,
		destination?: Vec2,
		oncomplete?: EffectCompletion | false,
		visibility?: EffectVisibility | number | unknown,
		skipAnalytics?: boolean,
	): unknown
	createChasmTransfer(
		resources: number[],
		path: unknown,
		oncomplete?: EffectCompletion | false,
		visibility?: EffectVisibility,
	): unknown
	createLightning(
		resources: number[],
		source?: Vec2 | false,
		destination?: Vec2,
		oncomplete?: EffectCompletion | false,
		visibility?: EffectVisibility,
		color?: string,
	): unknown
	createResourceExplosion(
		resources: number[],
		source?: Vec2 | false,
		visibility?: EffectVisibility,
	): unknown
	createResourceSpark(
		resources: number[],
		source?: Vec2 | false,
		visibility?: EffectVisibility,
	): unknown
	createExhaust(position: Vec2, color?: string, visibility?: EffectVisibility): unknown
}

export interface EntityCoordinateContext {
	uvToXY(uv: Vec2): Vec2
	uvToXYUntranslated(uv: Vec2): Vec2
	readonly translation: Vec2
}

export interface EntityResourceContext {
	amount(id: ResourceTypeId): number
	amountByLegacyIndex(index: number): number
	requestResources(
		r: number[],
		d: Vec2,
		f?: EffectCompletion | false,
		skip?: boolean,
	): boolean
	askForResources(
		r: number[],
		d: Vec2,
		f?: ((resources: number[]) => void) | false,
		skip?: boolean,
	): boolean
	addResourcesFromArray(a: number[], skipAnalytics?: boolean): void
	subtractResourcesFromArray(a: number[], skipAnalytics?: boolean): void
	add(id: ResourceTypeId, amount: number, skipAnalytics?: boolean): void
	subtract(id: ResourceTypeId, amount: number, skipAnalytics?: boolean): void
}

export interface EntitySpatialContext {
	entityAt(uv: Vec2): GameEntity | undefined
	hasEntityAt(uv: Vec2): boolean
	entities(): readonly GameEntity[]
	entityCount(): number
	addEntity(
		name: string,
		position: Vec2,
		misc?: unknown,
		options?: { skipShopUpdate?: boolean },
	): GameEntity | false
	clearCell(uv: Vec2): void
}

export interface EntityRenderContext {
	readonly unit: number
	readonly zoom: number
	readonly pixelRatio: number
	drawPrism(position: Vec2, size: number, height: number, triplet?: ColorTriplet): void
	resourceSprite(id: ResourceTypeId): Sprite | undefined
	resourceSpriteByLegacyIndex(index: number): Sprite | undefined
	readonly ctx: CanvasRenderingContext2D
}

export interface EntityRoleContext {
	readonly activeCubes: Set<Entity>
	readonly activeConverters: Set<Entity>
	readonly pumps: Set<Entity>
	readonly vaults: Set<Entity>
	readonly conductors: Set<Entity>
	readonly stabilizers: Set<Entity>
	readonly annihilators: Set<Entity>
	readonly annihilationMachines: Set<Entity>
	readonly fruits: Set<Entity>
	vaultCount(): number
	hasPump(entity: Entity): boolean
}

export interface EntityPlaneContext {
	readonly plane: 0 | 1
	readonly bridge: boolean
	readonly switchedplanes: boolean
	switchPlane(p: 0 | 1): void
	activateBridge(): void
	markPlanesSwitched(): void
}

export interface EntityContext {
	readonly audio: EntityAudioContext
	readonly effects: EntityEffectContext
	readonly coordinates: EntityCoordinateContext
	readonly resources: EntityResourceContext
	readonly spatial: EntitySpatialContext
	readonly render: EntityRenderContext
	readonly roles: EntityRoleContext
	readonly plane: EntityPlaneContext
	readonly references: EntityWorldReferenceContext
}
