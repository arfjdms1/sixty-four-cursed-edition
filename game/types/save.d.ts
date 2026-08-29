import type { ColorTriplet, ResourceAmounts, Vec2 } from './core.js'

export type EncodedSave = string

export interface SerializedEntityParams {
	depth?: number
	timeStamp?: 0
	fill?: number
	state?: number
	conversion?: number
	resources?: Array<number | null>
	resourceCount?: number
	spawnedHollows?: number
	variant?: number
	order?: number
	soul?: number
	grade?: 0 | 1 | 2
	type?: number
	rayNumber?: number
	colors?: ColorTriplet
	maxLife?: number
	life?: number
	broken?: number
}

export interface SerializedEntity {
	name: string
	position: Vec2
	par: SerializedEntityParams
}

export interface SlowdownState {
	state: boolean
	timer: number
	totalTime: number
	multiplyer: number
	f: number
	cooldown: number
}

export interface SaveStats {
	totalResourcesMined: ResourceAmounts
	absoluteResourcesCount: number
	maxDepth: number
	timeEvents: number
	totalPlayTime: number
	totalCubeClicks: number
	machinesBuild: number
	machinesSold: number
	timesTeleported: number
	strangeRockPoked: number
	darkVisited: number
	timeSinceLastDelete: number | null
	excavatorWasBuilt: boolean
}

export interface SaveBackup {
	timestamp: number
	data: EncodedSave
}

export interface SaveState {
	stuff: SerializedEntity[]
	onlyones: Record<string, boolean>
	resources: ResourceAmounts
	eraserType: 0 | 1 | 2
	hollowHardness: number
	slowdown: SlowdownState
	plane: 0 | 1
	version: string
	switchedplanes: boolean
	bridge: boolean
	unlockedEntities: Record<string, boolean>
	needNoHelp: boolean
	messengerShownMessages: number[]
	messengerFiredEvents: Array<boolean | null>
	messengerShown: 0 | 1
	existed: Record<string, boolean>
	glory: Array<boolean | 0 | 1>
	stats: SaveStats
	timestamp: number
	backups?: SaveBackup[]
}

export type LoadableSaveState =
	Pick<SaveState, 'stuff'> & {
		resources: number[]
	} &
	Partial<Omit<SaveState, 'stuff' | 'resources' | 'stats'>> & {
		stats?: Partial<SaveStats>
	}

export type SaveSource = EncodedSave | false | null | undefined
