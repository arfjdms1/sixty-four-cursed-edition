import type { ResourceAmounts, Vec2 } from '../../../types/core.js'
import type { CodexData } from '../../codex.js'

export interface HollowEvent {
	max: number
	time: number
	color: string
	imageTime: number
	maxImageTime: number
}

export interface WorldEventHost {
	time: { lt: number; dt: number; realDt: number }
	plane: 0 | 1
	entitiesInGame: Record<string, number>
	stats: {
		timeEvents: number
		totalResourcesMined: ResourceAmounts
	} & Record<string, unknown>
	codex: Pick<CodexData, 'entities' | 'resources'>
	mouse: {
		offsetxy: Vec2
	}
	currentlyExtracting: number
	xyToUV(xy: Vec2): Vec2
	playSound(sfx: string | number, panning?: number, loudness?: number): void
}
