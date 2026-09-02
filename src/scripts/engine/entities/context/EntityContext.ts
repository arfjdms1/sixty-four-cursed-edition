import type { Vec2 } from '../../../../types/core.js'
import type { EffectCompletion, EffectVisibility } from '../../effects/types.js'
import type { ResourceTypeId } from '../../../registry/resource-types.js'
import type { ResourceRegistry } from '../../../registry/ResourceRegistry.js'
import type { ResourceSystem } from '../../resources/ResourceSystem.js'
import type { GameEntity } from '../../../core/types.js'
import type { EntityContext } from './types.js'

export interface EntityContextHost {
	playSound(id: string | number, panning?: number, loudness?: number, dark?: boolean, forced?: boolean): void
	stopSound(sfx?: unknown, t?: number): void
	fadeSound(id: string | number, targetVolume?: number, time?: number): void
	getPanValueFromX(x: number): number
	getLoudnessFromXY(xy: Vec2): number
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
	uvToXY(uv: Vec2): Vec2
	uvToXYUntranslated(uv: Vec2): Vec2
	translation: Vec2
	readonly resourceRegistry: ResourceRegistry
	readonly resourceSystem: ResourceSystem
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
	substractResourcesFromArray(a: number[], skipAnalytics?: boolean): void
	entityAtCoordinates(pos: Vec2): GameEntity | undefined
	stuff: GameEntity[]
	addEntity(
		name: string,
		position: Vec2,
		misc?: unknown,
		options?: { skipShopUpdate?: boolean },
	): GameEntity | false
	clearCell(uv: Vec2): void
}

export function createEntityContext(host: EntityContextHost): EntityContext {
	return {
		audio: {
			playSound: (id, panning, loudness, dark, forced) => host.playSound(id, panning, loudness, dark, forced),
			stopSound: (sfx, t) => host.stopSound(sfx, t),
			fadeSound: (id, targetVolume, time) => host.fadeSound(id, targetVolume, time),
			getPanValueFromX: (x) => host.getPanValueFromX(x),
			getLoudnessFromXY: (xy) => host.getLoudnessFromXY(xy),
		},
		effects: {
			createResourceTransfer: (resources, source, destination, oncomplete, visibility, skipAnalytics) =>
				host.createResourceTransfer(resources, source, destination, oncomplete, visibility, skipAnalytics),
			createChasmTransfer: (resources, path, oncomplete, visibility) =>
				host.createChasmTransfer(resources, path, oncomplete, visibility),
			createLightning: (resources, source, destination, oncomplete, visibility, color) =>
				host.createLightning(resources, source, destination, oncomplete, visibility, color),
			createResourceExplosion: (resources, source, visibility) =>
				host.createResourceExplosion(resources, source, visibility),
			createResourceSpark: (resources, source, visibility) =>
				host.createResourceSpark(resources, source, visibility),
			createExhaust: (position, color, visibility) => host.createExhaust(position, color, visibility),
		},
		coordinates: {
			uvToXY: (uv) => host.uvToXY(uv),
			uvToXYUntranslated: (uv) => host.uvToXYUntranslated(uv),
			get translation() {
				return host.translation
			},
		},
		resources: {
			amount(id: ResourceTypeId): number {
				const index = host.resourceRegistry.getLegacyIndex(id)
				if (index === undefined) return 0
				return host.resourceSystem.resources[index] ?? 0
			},
			amountByLegacyIndex(index: number): number {
				return host.resourceSystem.resources[index] ?? 0
			},
			requestResources(r, d, f, skip) {
				return host.requestResources(r, d, f, skip)
			},
			askForResources(r, d, f, skip) {
				return host.askForResources(r, d, f, skip)
			},
			addResourcesFromArray(a, skipAnalytics) {
				host.addResourcesFromArray(a, skipAnalytics)
			},
			subtractResourcesFromArray(a, skipAnalytics) {
				host.substractResourcesFromArray(a, skipAnalytics)
			},
			add(id: ResourceTypeId, amount: number, skipAnalytics?: boolean): void {
				const index = host.resourceRegistry.getLegacyIndex(id)
				if (index !== undefined) {
					const a = new Array(10).fill(0)
					a[index] = amount
					host.addResourcesFromArray(a, skipAnalytics)
				}
			},
			subtract(id: ResourceTypeId, amount: number, skipAnalytics?: boolean): void {
				const index = host.resourceRegistry.getLegacyIndex(id)
				if (index !== undefined) {
					const a = new Array(10).fill(0)
					a[index] = amount
					host.substractResourcesFromArray(a, skipAnalytics)
				}
			},
		},
		spatial: {
			entityAt: (uv) => host.entityAtCoordinates(uv),
			hasEntityAt: (uv) => Boolean(host.entityAtCoordinates(uv)),
			entities: () => host.stuff,
			entityCount: () => host.stuff.length,
			addEntity: (name, position, misc, options) => host.addEntity(name, position, misc, options),
			clearCell: (uv) => host.clearCell(uv),
		},
	}
}
