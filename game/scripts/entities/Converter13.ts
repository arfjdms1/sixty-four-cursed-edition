import type { ColorTriplet, ResourceAmounts, Vec2 } from '../../types/core.js'
import type { EntityHost } from './types.js'
import { Entity } from './Entity.js'
import { Sprite } from '../sprites.js'
import { Preheater } from './Preheater.js'
import { Silo } from './Silo.js'

export class Converter13 extends Entity{

	constructor(master: EntityHost){
		super(master)
		this.fill = 0
		this.conversion = 0
		this.baseConversionSpeed = 1e-5
		this.state = 0
		this.fuel = [4096, 64, 0, 32]
		this.name = `converter13`
		this.soulPower = 1

		this.sprite = new Sprite({
			master: this.master,
			src: `img/c1-3.png`,
			mask: [0,0,455,280],
			frames: [[0,560,455,280],[0,0,455,280],[455,0,455,280],[910,0,455,280],[1365,0,455,280],[1820,0,455,280]],
			backframes: [[0,560,455,280],[0,280,455,280],[455,280,455,280],[910,280,455,280],[1365,280,455,280],[1820,280,455,280]],
			origins: [227, 148],
			scale: 1,
			sequences: [[0],[1,2,3,4,5]],
			intervals: 240
		})

		this.initHint()
		this.initSellHint()

	}

	getConversionOutput(){
		return [2048, 0, 256]
	}

	onDelete(){
		if (this.sfxPlaying) this.master.stopSound(this.sfxPlaying,1)
		this.master.activeConverters.delete(this)
	}

	update(dt?: number){

		if (this.state === 2){
			if (!this.sfxPlaying){
				const screenxy = this.master.uvToXYUntranslated(this.position)
				const pan = this.master.getPanValueFromX(screenxy[0])
				const loudness = this.master.getLoudnessFromXY(screenxy)
				this.sfxPlaying = this.master.startSound(`bubble`, pan, loudness)
			}
			let multiplicator = 1
			for (let i = 0; i < this.preheaters.length; i++){
				const tap = ((this.preheaters[i] as unknown as { tap?: () => number })?.tap?.() || 0)
				multiplicator += tap
			}
			this.conversion += (this.baseConversionSpeed + (this.baseConversionSpeed * .1 * (Math.random() * 2 - 1))) * (dt || 0) * multiplicator//this.baseConversionSpeed * dt
			if (this.conversion >= 1){
				if (this.state === 2) this.shootExhaust()
				this.state = 0
				this.conversion = 0
				this.fill = 0
				this.master.activeConverters.delete(this)
				const screenxy = this.master.uvToXYUntranslated(this.position)
				const pan = this.master.getPanValueFromX(screenxy[0])
				const loudness = this.master.getLoudnessFromXY(screenxy)
				this.master.createResourceTransfer(this.getConversionOutput(), screenxy)
				this.sprite.switchSequence(0)
				this.master.playSound(`break`, pan, loudness)
				this.master.playSound(`tap3`, pan, loudness)
				this.master.stopSound(this.sfxPlaying,3)
				delete this.sfxPlaying
			}

		}

		if (this.conversion > 0 && this.sprite.currentSequence === 0) this.sprite.switchSequence(1)

	}

	refill(){
		if (this.state === 0){

			const resources = this.master.requestResources?.(this.fuel, this.position, (_event?: unknown)=>{
				this.activate()
			})
			if (resources) this.state = 1

		}
	}

	activate(){
		this.fill = 1
		this.state = 2
		this.sprite.switchSequence(1)
		this.master.activeConverters.add(this)
	}

	onmousedown(){

		this.refill()

	}

	init(){

		this.preheaters = []
		this.isNextToSilo = false

		for (let i = 0; i < this.soi.length; i++){
			const cell = this.master.entityAtCoordinates([this.position[0] + this.soi[i][0], this.position[1] + this.soi[i][1]])
			if (cell && cell instanceof Preheater){
				this.preheaters.push(cell)
			} else if (cell && cell instanceof Silo){
				this.isNextToSilo = true
			}

		}
		
	}

	render(dt?: number, vposition?: Vec2){

		const position = vposition ? vposition : this.position

		if (this.state === 2) this.sprite.render(position,dt,true)

		if (this.fill){
			this.master.drawPrism([position[0] - .26, position[1] + .26], .36, .28 * this.conversion, this.master.codex.resources[2].triplet)
		}

		this.sprite.render(position, dt)

	}

}
