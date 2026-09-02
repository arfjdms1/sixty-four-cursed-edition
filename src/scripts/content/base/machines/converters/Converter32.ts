import type { ColorTriplet, ResourceAmounts, Vec2 } from '../../../../../types/core.js'
import type { EntityHost } from '../../../../engine/entities/types.js'
import { Entity } from '../../../../engine/entities/Entity.js'
import { Sprite } from '../../../../sprites.js'
import { Preheater } from './Preheater.js'
import { Silo } from '../storage/Silo.js'

export class Converter32 extends Entity{

	constructor(master: EntityHost){
		super(master)
		this.fill = 0
		this.conversion = 0
		this.baseConversionSpeed = 1e-5
		this.state = 0
		this.fuel = [256,0,32]
		this.name = `converter32`
		this.soulPower = 1

		this.sprite = new Sprite({
			master: this.master,
			src: `resources/images/c31-2.png`,
			mask: [0,0,455,393],
			frames: [[0,0,455,393]],
			backframes: [[455,0,455,393]],
			origins: [227, 262],
			scale: 1,
			sequences: [0],
			intervals: 100
		})

		this.initHint()
		this.initSellHint()

	}

	getConversionOutput(){
		return [0, 256]
	}

	update(dt?: number){

		if (this.state === 2){
			let multiplicator = 1
			for (let i = 0; i < this.preheaters.length; i++){
				// if (this.preheaters[i].state === 2){
					const tap = ((this.preheaters[i] as unknown as { tap?: () => number })?.tap?.() || 0)
					multiplicator += tap
				// }
			}
			this.conversion += (this.baseConversionSpeed + (this.baseConversionSpeed * .01 * (Math.random() * 2 - 1))) * (dt || 0) * multiplicator
			if (this.conversion >= 1){
				if (this.state === 2) this.shootExhaust()
				this.state = 0
				this.conversion = 0
				this.fill = 0
				this.context.roles.activeConverters.delete(this)
				const screenxy = this.context.coordinates.uvToXYUntranslated(this.position)
				const pan = this.context.audio.getPanValueFromX(screenxy[0])
				const loudness = this.context.audio.getLoudnessFromXY(screenxy)
				this.context.effects.createResourceTransfer(this.getConversionOutput(), screenxy)
				this.context.audio.playSound(`break`, pan, loudness)
				this.context.audio.playSound(`tap2`, pan, loudness)
			}
		}

		if (this.conversion > 0 && this.sprite.currentSequence === 0) this.sprite.switchSequence(1)

	}

	refill(){
		if (this.state === 0){

			const resources = this.context.resources.requestResources?.(this.fuel, this.position, (_event?: unknown)=>{
				this.activate()
			})
			if (resources) this.state = 1

		}
	}

	activate(){
		this.fill = 1
		this.state = 2
		this.context.roles.activeConverters.add(this)
	}

	onDelete(){
		this.context.roles.activeConverters.delete(this)
	}

	onmousedown(){

		this.refill()

	}

	init(){

		this.preheaters = []
		this.isNextToSilo = false

		for (let i = 0; i < this.soi.length; i++){
			const cell = this.context.spatial.entityAt([this.position[0] + this.soi[i][0], this.position[1] + this.soi[i][1]])
			if (cell && cell instanceof Preheater){
				this.preheaters.push(cell)
			} else if (cell && cell instanceof Silo){
				this.isNextToSilo = true
			}

		}
		
	}

	render(dt?: number, vposition?: Vec2){

		const ctx = this.context.render.ctx
		const unit = this.context.render.unit
		const position = vposition ? vposition : this.position
		const xy = this.context.coordinates.uvToXY(position)


		this.sprite.render(position,0,true)

		if (this.fill){
			ctx.save()
			ctx.translate(xy[0], xy[1]-unit/2.2)
			ctx.fillStyle = this.master.codex.resources[0].triplet[1]
			ctx.beginPath()
			ctx.arc(0,0, unit/1.9, 0, Math.PI * 2)
			ctx.closePath()
			ctx.fill()

			ctx.globalAlpha = this.conversion
			ctx.fillStyle = this.master.codex.resources[1].triplet[1]
			ctx.beginPath()
			ctx.arc(0,0, unit/1.9, 0, Math.PI * 2)
			ctx.closePath()
			ctx.fill()
			ctx.restore()
		}

		this.sprite.render(position)

	}

}
