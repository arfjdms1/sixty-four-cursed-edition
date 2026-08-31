import type { Vec2 } from '../../../../types/core.js'
import type { EffectCompletion, EffectVisibility } from '../../effects/types.js'
import type { ResourceTypeId } from '../../../registry/resource-types.js'

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

export interface EntityContext {
	readonly audio: EntityAudioContext
	readonly effects: EntityEffectContext
	readonly coordinates: EntityCoordinateContext
	readonly resources: EntityResourceContext
}
