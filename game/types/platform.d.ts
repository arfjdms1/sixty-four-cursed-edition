import type { EncodedSave } from './save.js'

export interface RuntimePreload {
	steamId: string | number
	languageId: number | null
	save: EncodedSave | false
	steamAchievements: Array<0 | 1>
	debug: unknown
}

export type GameStartupPayload = RuntimePreload | null | undefined

export interface RendererToMain {
	getMyStuff: 'please'
	achieve: string
	save: EncodedSave | undefined
	reset: ''
	quit: ''
	updateStat: Array<{ id: string; value: number }>
	gameError: unknown
	toggleFullscreen: ''
	openDiscord: ''
}

export interface MainToRenderer {
	hereYouGoSir: RuntimePreload | null
	windowState: 'blur' | 'focus'
}

export interface UsedIpcRenderer {
	readonly isPlaceholder?: undefined
	send<C extends keyof RendererToMain>(channel: C, payload: RendererToMain[C]): void
	on<C extends keyof MainToRenderer>(
		channel: C,
		listener: (event: object, payload: MainToRenderer[C]) => void,
	): this
}

export interface PlaceholderIpcRenderer {
	readonly isPlaceholder: true
	send(channel: string, payload?: unknown): false
}

export type GameSpaceport = UsedIpcRenderer | PlaceholderIpcRenderer
export type ClockWorkerRequest = true
export type ClockWorkerTick = true
