import type { ColorTriplet, ResourceAmounts, Vec2 } from '../../../../../types/core.js'
import type { EntityHost } from '../../../../engine/entities/types.js'
import { Entity } from '../../../../engine/entities/Entity.js'
import { Sprite } from '../../../../sprites.js'
import { Preheater } from './Preheater.js'
import { Reflector } from './Reflector.js'
import { Silo } from '../storage/Silo.js'

export class Converter64 extends Entity{

	constructor(master: EntityHost){
		super(master)
		this.soi = [[0,-1], [1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-2],[1,-2],[2,-2],[2,-1],[2,0],[2,1],[2,2],[1,2],[0,2],[-1,2],[-2,2],[-2,1],[-2,0],[-2,-1],[-2,-2],[-1,-2]]
		this.sor = [[0,-1], [1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]]
		this.fill = 0
		this.conversion = 0
		this.baseConversionSpeed = 1e-5
		this.state = 0
		this.fuel = [0, 0, 0, 0, 0, 4096, 32768]
		this.name = `converter64`
		this.soulPower = 2
		this.reflectorCount = 0

		this.sprite = new Sprite({
			master: this.master,
			src: `resources/images/reactor.png`,
			frames: [[0,0,455,443],[455,0,455,443]],
			origins: [227, 311],
			scale: 1,
			sequences: [[0,1]],
			intervals: 100
		})

		this.initHint()
		this.initSellHint()

	}

	getConversionOutput(){
		const output = (32768 + this.reflectorCount * 8192) * 4
		return [0, 0, 0, output, 128]
	}

	init(){


		this.preheaters = []
		this.alone = true
		this.reflectorCount = 0
		this.isNextToSilo = false

		for (let i = 0; i < this.sor.length; i++){
			const cell = this.master.entityAtCoordinates([this.position[0] + this.sor[i][0], this.position[1] + this.sor[i][1]])
			if (cell && cell instanceof Reflector){
				this.reflectorCount++
			} else if (cell && cell instanceof Preheater){
				this.preheaters.push(cell)
			}

		}
		for (let i = 0; i < this.soi.length; i++){
			const cell = this.master.entityAtCoordinates([this.position[0] + this.soi[i][0], this.position[1] + this.soi[i][1]])
			if (cell && cell instanceof Converter64){
				this.alone = false
				// break
			} else if (cell && cell instanceof Silo){
				this.isNextToSilo = true
			}

		}

	}

	update(dt?: number){

		if (this.state === 2 && this.alone){

			let multiplicator = 1
			for (let i = 0; i < this.preheaters.length; i++){
				const tap = ((this.preheaters[i] as unknown as { tap?: () => number })?.tap?.() || 0)
				multiplicator += tap
			}
			this.conversion += (this.baseConversionSpeed + (this.baseConversionSpeed * .1 * (Math.random() * 2 - 1))) * (dt || 0) * (1 + this.reflectorCount / 8) * multiplicator//this.baseConversionSpeed * dt
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
				this.master.playSound(`break`, pan, loudness)
				this.master.playSound(`tap4`, pan, loudness)
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
		this.master.activeConverters.add(this)
	}

	onDelete(){
		this.master.activeConverters.delete(this)
	}

	onmousedown(){

		this.refill()

	}

	render(dt?: number, vposition?: Vec2){
		this.sprite.renderState(vposition ? vposition : this.position, (this.fill > 0 && this.alone) ? 1 : 0)
	}
}
