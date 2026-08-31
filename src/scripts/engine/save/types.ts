import type { ResourceAmounts, Vec2 } from '../../../types/core.js'
import type {
	EncodedSave,
	LoadableSaveState,
	SaveBackup,
	SaveSource,
	SaveState,
	SaveStats,
	SerializedEntity,
	SerializedEntityParams,
	SlowdownState,
} from '../../../types/save.js'
import type { CodexData } from '../../codex.js'
import type { GameEntity, GameStats } from '../../core/types.js'
import type { GameSpaceport } from '../../../types/platform.js'

export type {
	EncodedSave,
	LoadableSaveState,
	SaveBackup,
	SaveSource,
	SaveState,
	SaveStats,
	SerializedEntity,
	SerializedEntityParams,
	SlowdownState,
}

export interface SaveHost {
	steamId: string | number
	version: string
	zoom: number
	resources: ResourceAmounts
	onlyones: Record<string, boolean | undefined>
	eraserType: 0 | 1 | 2
	hollowHardness: number
	slowdown: SlowdownState
	plane: 0 | 1
	switchedplanes: boolean
	bridge: boolean
	unlockedEntities: Record<string, boolean | undefined>
	needNoHelp: boolean
	stats: GameStats | SaveStats
	stuff: GameEntity[]
	entitiesInGame: Record<string, number>
	spaceport?: GameSpaceport
	steamAchievements?: Array<0 | 1>
	codex: Pick<CodexData, 'entities'>
	shop?: {
		existed?: Record<string, boolean | undefined>
		setExisted(existed: Record<string, boolean | undefined>): void
		switchPlane(p: number): void
		updateElements(): void
	}
	splash?: {
		updateBackups(): void
	}
	messenger?: {
		shownMessages: number[]
		firedEvents: Array<boolean | null>
		messagesShown: 0 | 1
		setState(events: Array<boolean | null>, shown: number[], messagesShown: 0 | 1): void
	}
	achiever?: {
		fired: Array<boolean | 0 | 1>
		setState(state: Array<boolean | 0 | 1>): void
	}
	addEntity(name: string, pos: Vec2, misc?: unknown, options?: { skipShopUpdate?: boolean }): GameEntity | false
	updateEraserType(t: 0 | 1 | 2): void
	prepopulate(): void
	cleanup(): void
}

export interface SaveStorage {
	getItem(key: string): string | null
	setItem(key: string, value: string): void
	removeItem?(key: string): void
}
