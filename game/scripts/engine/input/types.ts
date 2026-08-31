import type { Vec2 } from '../../../types/core.js'
import type { GameSpaceport } from '../../../types/platform.js'
import type { GameEntity, HeldItem } from '../../core/types.js'
import type { Messenger, Shop, Splash } from '../../ui.js'

export interface MouseState {
	xy: Vec2
	offsetxy: Vec2
	cursorVisible: boolean
	state: number
	positionChanged: boolean
	lastOffset: Vec2
	lastTouch: Vec2
	automate: boolean
	maxTimer: number
	timer: number
}

export interface PointerInput {
	offsetX?: number
	offsetY?: number
	clientX?: number
	clientY?: number
	buttons?: number
	movementX?: number
	movementY?: number
}

export interface InputHost {
	canvas: HTMLCanvasElement
	isWindows: boolean
	pixelRatio: number
	zoom: number
	w: number
	h: number
	translationMap: [number, number, number, number]
	altActive: boolean
	plane: 0 | 1
	hoveredEntity?: GameEntity | false
	spaceport?: GameSpaceport
	splash?: Splash
	shop?: Shop
	messenger?: Messenger
	itemInHand?: HeldItem | { name: string; eraser: boolean }
	transportedEntity?: GameEntity
	globalSoundVolume?: number

	initScreenSize(): void
	doOnBlur(): void
	doOnFocus(): void
	toggleSplash(): void
	processQ(): void
	processE(): void
	processClick(): void
	processMousedown(e?: unknown): void
	processMousemove(e?: PointerInput, dxy?: Vec2): void
	processMouseup(): void
	processMouseout(): void
	zoomInOut(delta: number): void
	canAfford?(name: string): boolean
	pickupItem?(name: string): void
	updateGlobalVolume?(v?: number): void
	togglePhotofobia?(): void
}
