import type { Vec2 } from '../../../types/core.js'
import type { SlowdownState } from '../../../types/save.js'

export type SfxId =
	| 'tap1'
	| 'tap2'
	| 'tap3'
	| 'tap4'
	| 'tap5'
	| 'tap6'
	| 'tap7'
	| 'break'
	| 'rumble'
	| 'bubble'
	| 'geiger'
	| 'release'
	| 'hellbreak'
	| 'horn'
	| 'hollow'
	| 'teleport'
	| 'void'
	| 'soul'
	| 'exhaust'
	| 'lightning'
	| 'silo'
	| 'silo2'
	| 'collect'
	| 'endingMusic'

export interface AudioSampleConfig {
	src: string
	name: SfxId
	duration?: number
	detune?: number
	volume: number
}

export interface DecodedAudioSample {
	data: AudioBuffer
	duration?: number
	detune?: number
	volume: number
}

export interface SoundState {
	ready: boolean
	master: GainNode
	samples: Record<string, DecodedAudioSample>
	stackSize: number
}

export interface PlayingSound {
	source: AudioBufferSourceNode
	volume: GainNode
	pan: StereoPannerNode
	baseVolume: number
}

export interface AudioSpatialHost {
	w: number
	h: number
	w2: number
	h2: number
}

export interface AudioHost extends AudioSpatialHost {
	steamId: string | number
	plane: 0 | 1
	slowdown: Pick<SlowdownState, 'state' | 'multiplyer' | 'f'>
	splash?: {
		soundSlider?: HTMLDivElement
	}
	stuff?: Array<{ sfxPlaying?: unknown; position: Vec2 }>
	uvToXYUntranslated?(pos: Vec2): Vec2
}

export interface AudioPlayback {
	playSound(id: string | number, panning?: number, loudness?: number, dark?: boolean, forced?: boolean): void
	startSound(id: string | number, panning?: number, loudness?: number): PlayingSound | false
	stopSound(sfx: unknown, t?: number): void
	setLoudnessToSFX(sfx: unknown, l: number): void
	setPanToSFX(sfx: unknown, p: number): void
	getLoudnessFromXY(xy: Vec2): number
	getPanValueFromX(x: number): number
}

declare global {
	var webkitAudioContext: typeof AudioContext
}
