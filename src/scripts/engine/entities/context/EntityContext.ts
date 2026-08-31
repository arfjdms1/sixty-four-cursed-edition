import type { Vec2 } from '../../../../types/core.js'
import type { EffectCompletion, EffectVisibility } from '../../effects/types.js'
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
	}
}
