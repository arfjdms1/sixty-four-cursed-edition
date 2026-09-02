import type { ColorTriplet, ResourceAmounts, Vec2 } from '../../../../../types/core.js'
import type { EntityHost } from '../../../../engine/entities/types.js'
import { Entity } from '../../../../engine/entities/Entity.js'
import { Sprite } from '../../../../sprites.js'
import { Preheater } from './Preheater.js'
import { Silo } from '../storage/Silo.js'

export class Converter76 extends Entity{

	constructor(master: EntityHost){
		super(master)
		this.entityHeight = 2
		this.fill = 0
		this.conversion = 0
		this.baseConversionSpeed = 1e-5
		this.state = 0
		this.fuel = [0, 0, 0, 0, 0, 1, 8192]
		this.name = `converter76`
		this.soulPower = 2

		this.sprite = new Sprite({
			master: this.master,
			src: `resources/images/c7-6.png`,
			// mask: [0,0,455,730],
			frames: [[0,0,455,795],[455,0,455,795],[910,0,455,795],[1365,0,455,795]],
			origins: [227, 663],
			scale: 1,
			sequences: [[0],[1,2,3]],
			intervals: 30
		})

		this.initHint()
		this.initSellHint()

	}

	getConversionOutput(){
		return [0, 0, 0, 0, 1, 2048]
	}

	update(dt?: number){

		if (this.state === 2){

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
				this.context.roles.activeConverters.delete(this)
				const screenxy = this.context.coordinates.uvToXYUntranslated(this.position)
				const pan = this.context.audio.getPanValueFromX(screenxy[0])
				const loudness = this.context.audio.getLoudnessFromXY(screenxy)
				this.context.effects.createResourceTransfer(this.getConversionOutput(), screenxy)
				this.sprite.switchSequence(0)
				this.context.audio.playSound(`break`, pan, loudness)
				this.context.audio.playSound(`tap6`, pan, loudness)
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
		this.sprite.switchSequence(1)
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

		const position = vposition ? vposition : this.position
		this.sprite.render(position, dt)
	}
}
