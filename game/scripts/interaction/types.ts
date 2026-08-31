import type { Vec2 } from '../../types/core.js'
import type { CodexData } from '../codex.js'
import type { EffectCompletion, EffectVisibility } from '../effects/types.js'
import type { EntityHost } from '../entities/types.js'
import type { GameEntity, HeldItem } from '../game/types.js'
import type { MouseState } from '../input/types.js'

export interface InteractionHost {
	w2: number
	h2: number
	pixelRatio: number
	zoom: number
	translation: Vec2
	screenUnit: number
	resourceHomes: Vec2[]
	plane: 0 | 1
	eraserType: 0 | 1 | 2
	onlyones: Record<string, boolean | undefined>
	codex: Pick<CodexData, 'entities'>
	stats: {
		machinesBuild: number
		machinesSold: number
		timeSinceLastDelete: number | null
		totalCubeClicks: number
	} & Record<string, unknown>
	shop?: {
		updateElements(): void
		check(): void
		centerItem(name: string): void
	}
	mouse: MouseState
	entityHost: EntityHost
	preventSaving?: boolean
	xyToUV(xy: Vec2): Vec2
	uvToXYUntranslated(uv: Vec2): Vec2
	updateMouseData(x: number, y: number): void
	createResourceTransfer(
		resources: number[],
		source?: Vec2 | false,
		destination?: Vec2,
		oncomplete?: EffectCompletion | false,
		visibility?: EffectVisibility,
		skipAnalytics?: boolean,
	): unknown
	removeHint(): void
	saveGame(): unknown
}
