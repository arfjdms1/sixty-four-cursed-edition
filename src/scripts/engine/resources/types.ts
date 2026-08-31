import type { CodexData } from '../../codex.js'
import type { EffectCompletion, EffectVisibility } from '../effects/types.js'
import type { ResourceAmounts, Vec2 } from '../../../types/core.js'

export interface AnalyticsGraph {
	canvas: HTMLCanvasElement
	ctx: CanvasRenderingContext2D
	data: Array<[number, number]>
	max: number
}

export interface AnalyticsState {
	measuringFrame: number
	frameCount: number
	frames: Array<Array<[number, number]>>
	frame: Array<[number, number]>
	frameTimer: number
	average: Array<[number, number]>
	instant: Array<[number, number]>
	dataSize: number
	graphs: AnalyticsGraph[]
}

export interface ResourceStats {
	totalResourcesMined: ResourceAmounts
	absoluteResourcesCount: number
}

export interface ResourceHost {
	w2: number
	h2: number
	codex: Pick<CodexData, 'entities'>
	entitiesInGame: Record<string, number>
	eraserType: 0 | 1 | 2
	stats: ResourceStats
	uvToXYUntranslated(position: Vec2): Vec2
	createResourceTransfer(
		resources: number[],
		source?: Vec2 | false,
		destination?: Vec2,
		oncomplete?: EffectCompletion | false,
		visibility?: EffectVisibility,
		skipAnalytics?: boolean,
	): unknown
}
