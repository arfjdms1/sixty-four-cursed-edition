import type { Vec2 } from '../../types/core.js'
import type {
	AudioHost,
	AudioPlayback,
	AudioSampleConfig,
	PlayingSound,
	SoundState,
} from './types.js'

export const BASE_AUDIO_SAMPLES: AudioSampleConfig[] = [
	{src: `sfx/tap.mp3?v5`, name: `tap1`, duration: .2, detune: 300, volume: .5},
	{src: `sfx/tap2.mp3?v2`, name: `tap2`, duration: 1.5, detune: 300, volume: .06},
	{src: `sfx/tap3.mp3?v1`, name: `tap3`, duration: 2, detune: 200, volume: .4},
	{src: `sfx/tap4.mp3?v1`, name: `tap4`, duration: .7, detune: 300, volume: .3},
	{src: `sfx/tap5.mp3?v1`, name: `tap5`, duration: .6, detune: 200, volume: .1},
	{src: `sfx/tap6.mp3?v1`, name: `tap6`, detune: 200, volume: .6},
	{src: `sfx/tap7.mp3`, name: `tap7`, detune: 80, volume: .3},
	{src: `sfx/break.mp3?v3`, name: `break`, duration: .5, detune: 300, volume: .6},
	{src: `sfx/rumble.mp3`, name: `rumble`, volume: .8},
	{src: `sfx/bubble.mp3`, name: `bubble`, volume: .2},
	{src: `sfx/counter.mp3`, name: `geiger`, volume: .3, detune: 100},
	{src: `sfx/release.mp3`, name: `release`, volume: .6},
	{src: `sfx/hellbreak.mp3`, name: `hellbreak`, volume: .4, detune: 100},
	{src: `sfx/horn.mp3`, name: `horn`, volume: .9},
	{src: `sfx/hollow.mp3`, name: `hollow`, detune: 250, volume: .2},
	{src: `sfx/teleport.mp3`, name: `teleport`, volume: .9},
	{src: `sfx/void.mp3`, name: `void`, volume: .9, detune: 100},
	{src: `sfx/soul.mp3`, name: `soul`, volume: 1, detune: 800},
	{src: `sfx/exhaust.mp3`, name: `exhaust`, volume: 1, detune: 200},
	{src: `sfx/lightning.mp3`, name: `lightning`, volume: .5, detune: 50},
	{src: `sfx/siloin.mp3`, name: `silo`, volume: .8},
	{src: `sfx/siloout.mp3`, name: `silo2`, volume: .8},
	{src: `sfx/collect.mp3`, name: `collect`, volume: 1},
	{src: `sfx/shallow_anne.mp3`, name: `endingMusic`, volume: 1}
]

export class AudioSystem implements AudioPlayback {
	host: AudioHost
	isMute: boolean
	globalSoundVolume: number = .6
	actx?: AudioContext
	sfx?: SoundState
	readonly samplesConfig: AudioSampleConfig[] = BASE_AUDIO_SAMPLES

	constructor(host: AudioHost){
		this.host = host
		this.isMute = this.getMute()
	}

	getMute(): boolean {
		const mute = localStorage.getItem(`abstractv03_mute${this.host.steamId}`)
		return mute === `true` ? true : false
	}

	mute(on: boolean): void {
		if (on){
			this.fadeSound(0)
			this.isMute = true
		} else {
			this.fadeSound(1)
			this.isMute = false
		}
	}

	getLoudnessFromXY(xy: Vec2): number {
		const distance = Math.max(Math.abs(xy[0] - this.host.w2), Math.abs(xy[1] - this.host.h2)) / this.host.w / 2
		return Math.max(0, 1 - distance)
	}

	getPanValueFromX(x: number): number {
		return Math.min(Math.max(-1, x / this.host.w * 2 - 1), 1)
	}

	updateGlobalSounds(): void {
		if (!this.host.stuff) return
		for (let i = 0; i < this.host.stuff.length; i++){
			if (this.host.stuff[i].sfxPlaying) {

				const pos = this.host.stuff[i].position
				const screenxy = this.host.uvToXYUntranslated ? this.host.uvToXYUntranslated(pos) : pos
				const pan = this.getPanValueFromX(screenxy[0])
				const loudness = this.getLoudnessFromXY(screenxy)

				this.setPanToSFX(this.host.stuff[i].sfxPlaying, pan)
				this.setLoudnessToSFX(this.host.stuff[i].sfxPlaying, loudness)

			}
		}
	}

	updateGlobalVolume(v: number = this.globalSoundVolume): void {
		v = Math.max(0, Math.min(1, v))
		this.globalSoundVolume = v
		if (this.host.splash?.soundSlider) this.host.splash.soundSlider.style.width = 100 * v + `%`
		localStorage.setItem(`abstractv03_globalSoundVolume${this.host.steamId}`, String(v))
	}

	fadeSound(v: number): void {
		if (this.actx && this.sfx){
			this.sfx.master.gain.cancelScheduledValues(this.actx.currentTime)
			this.sfx.master.gain.linearRampToValueAtTime(.001 + this.globalSoundVolume * v, this.actx.currentTime + 1)
			if (v === 0) this.sfx.master.gain.setValueAtTime(0, this.actx.currentTime + 1)
		}
	}

	initAudio(): void {
		if (this.actx) return

		this.actx = new (AudioContext || webkitAudioContext)()
		this.sfx = {
			ready: false,
			master: this.actx.createGain(),
			samples: {},
			stackSize: 0
		}
		this.sfx.master.gain.value = this.globalSoundVolume
		this.sfx.master.connect(this.actx.destination)

		let counter = 0
		const samples = this.samplesConfig

		for (let i = 0; i < samples.length; i++){

			const s = samples[i]

			fetch(s.src).then(r => {
				r.arrayBuffer().then(buffer=>{
					this.actx!.decodeAudioData(buffer, data=>{
						this.sfx!.samples[s.name] = {data: data, duration: s.duration, detune: s.detune, volume: s.volume}
						check(this.sfx!)
					})
				})
			})

		}

		function check(sfx: SoundState){
			counter++
			if (counter >= samples.length) sfx.ready = true;
		}
	}

	startSound(id: string | number, panning?: number, loudness?: number): PlayingSound | false {
		if (this.sfx?.ready && this.actx){
			if (loudness === undefined) loudness = 1
			const source = this.actx.createBufferSource()
			const volume = this.actx.createGain()
			const pan = this.actx.createStereoPanner()
			pan.pan.value = panning || 0
			volume.gain.value = this.sfx.samples[id].volume * loudness || .5 * loudness
			source.buffer = this.sfx.samples[id].data
			source.loop = true
			if (this.sfx.samples[id].detune) source.detune.value = (Math.random() * 2 - 1) * this.sfx.samples[id].detune
			source.connect(pan)
			pan.connect(volume)
			volume.connect(this.sfx.master)
			
			source.start(this.actx.currentTime)

			return {source: source, volume: volume, pan: pan, baseVolume: this.sfx.samples[id].volume || .5}
		}
		return false
	}

	stopSound(sfx: unknown, t?: number): void {
		if (this.sfx?.ready && sfx && this.actx){
			;(sfx as PlayingSound).volume.gain.exponentialRampToValueAtTime(.01, this.actx.currentTime + (t || 1))
			;(sfx as PlayingSound).source.stop(this.actx.currentTime + (t || 1))
		}
	}

	setLoudnessToSFX(sfx: unknown, l: number): void {
		if (this.sfx?.ready && sfx){
			(sfx as PlayingSound).volume.gain.value = (sfx as PlayingSound).baseVolume * l
		}
	}

	setPanToSFX(sfx: unknown, p: number): void {
		if (this.sfx?.ready && sfx){
			(sfx as PlayingSound).pan.pan.value = p
		}
	}

	playSound(id: string | number, panning?: number, loudness?: number, dark?: boolean, forced?: boolean): void {
		if (this.sfx?.ready && (this.sfx.stackSize < 128 || forced) && this.actx){
			loudness = (loudness === undefined ? 1 : loudness)
			let filter
			let source = this.actx.createBufferSource()
			let volume = this.actx.createGain()
			let pan = this.actx.createStereoPanner()
			pan.pan.value = panning || 0
			volume.gain.value = this.sfx.samples[id].volume * loudness || .5 * loudness
			source.buffer = this.sfx.samples[id].data
			let detune = this.sfx.samples[id].detune ? (Math.random() * 2 - 1) * this.sfx.samples[id].detune : 0
			if (this.host.slowdown.state) {
				detune += (this.host.slowdown.multiplyer < 1 ? -100/this.host.slowdown.multiplyer : this.host.slowdown.multiplyer * 200) * this.host.slowdown.f
			}
			source.detune.value = detune
			source.connect(pan)
			pan.connect(volume)
			if (!this.host.plane || dark){
				volume.connect(this.sfx.master)
			} else {
				filter = this.actx.createBiquadFilter()
				filter.type = `lowpass`
				volume.connect(filter).connect(this.sfx.master)
			}
			this.sfx.stackSize++

			setTimeout((_: unknown)=>{
				if (this.sfx) this.sfx.stackSize = Math.max(0, this.sfx.stackSize - 1)
			}, (this.sfx.samples[id].duration || source.buffer!.duration) * 1000)
			source.start(this.actx.currentTime)
			source.stop(this.actx.currentTime + (this.sfx.samples[id].duration || source.buffer!.duration))
		}
	}
}
