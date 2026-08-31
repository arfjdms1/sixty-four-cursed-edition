import type { Vec2 } from '../../../types/core.js'
import type { CodexData } from '../../codex.js'

export type EffectVisibility = Array<number | boolean>
export type EffectCompletion = (_value?: unknown) => void

export interface EffectHost {
	ctx: CanvasRenderingContext2D
	unit: number
	pixelRatio: number
	plane: 0 | 1
	w: number
	h: number
	time: { lt: number }
	chillMode: boolean
	resourceTransferType: number
	renderLimitOfAKind: number
	resourceHomes: Vec2[]
	codex: Pick<CodexData, 'resources'>
	addResourcesFromArray(resources: number[], skipAnalytics?: boolean): void
	drawResourceInScreenCoordinates(id: number, position: Vec2): void
	uvToXYUntranslated(position: Vec2): Vec2
}

export interface VFXPayload {
	visibility?: EffectVisibility
}

export interface ExhaustPayload extends VFXPayload {
	uv?: Vec2
	color?: string
}

export interface ResourceEffectPayload extends VFXPayload {
	resources: number[]
	source?: Vec2 | false
	force?: number
}

export interface ResourceTransferPayload extends ResourceEffectPayload {
	destination?: Vec2
	f?: EffectCompletion | false
	skip?: boolean
}

export interface ChasmTransferPayload extends VFXPayload {
	resources: number[]
	path: Vec2[]
	f?: EffectCompletion | false
}

export interface LightningPayload extends ResourceTransferPayload {
	color?: string
}
