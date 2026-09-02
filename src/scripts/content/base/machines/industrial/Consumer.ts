import type { ColorTriplet, ResourceAmounts, Vec2 } from '../../../../../types/core.js'
import type { EntityHost } from '../../../../engine/entities/types.js'
import { Entity } from '../../../../engine/entities/Entity.js'
import { Sprite } from '../../../../sprites.js'
import { Silo } from '../storage/Silo.js'

export class Consumer extends Entity{

	constructor(master: EntityHost){
		super(master)
		this.name = `consumer`
		this.resetTime = 16000
		this.timer = 0
		this.maxMultiplicator = 9
		this.multiplicator = 1
		this.resources = new Array(10).fill(0)
		this.maxResourceCount = 1024
		this.resourceCount = 0
		this.bonus = .11111 // *9=1

		this.fill = 0
		this.state = 0
		this.fuel = [0,0,0,1024,0,16]
		this.soulPower = 2

		this.sprite = new Sprite({
			master: this.master,
			src: `resources/images/consumer.png`,
			frames: [[0,0,455,423],[455,0,455,423],[910,0,455,423],[0,423,455,423],[455,423,455,423],[910,423,455,423]],
			origins: [226,292],
			scale: 1,
			sequences: [[0],[1,2,3,4,5]],
			intervals: 100
		})

		this.initHint()
		this.initSellHint()
	}

	init(){

		this.isNextToSilo = false
		for (let i = 0; i < this.soi.length; i++){
			const cell = this.context.spatial.entityAt([this.position[0] + this.soi[i][0], this.position[1] + this.soi[i][1]])
			if (cell instanceof Silo){
				this.isNextToSilo = true
				break
			}
		}

	}

	consume(r: number[], o?: unknown){

		this.context.effects.createResourceTransfer(r, o, this.context.coordinates.uvToXYUntranslated(this.position), (_?: unknown) => {
			
			for (let i = 0; i < r.length; i++){
				if (r[i]){
					this.resources[i] += r[i]
					this.resourceCount += r[i]
					if (this.resourceCount >= this.maxResourceCount){
						this.release()
					}
				}
			}

		}, 3)

	}

	onDelete(){

		this.context.effects.createResourceTransfer(this.resources, this.context.coordinates.uvToXYUntranslated(this.position))

	}

	release(){

		const screenxy = this.context.coordinates.uvToXYUntranslated(this.position)
		const pan = this.context.audio.getPanValueFromX(screenxy[0])
		const loudness = this.context.audio.getLoudnessFromXY(screenxy)
		this.context.audio.playSound(`release`, pan, loudness)

		this.fill -= .00390625 // 1/256
		if (this.fill <= 0){
			this.fill = 0
			if (this.state === 2) this.shootExhaust()
			this.state = 0
			this.sprite.switchSequence(0)
		}
		this.timer = this.resetTime

		for (let i = 0; i < this.resources.length; i++){
			this.resources[i] = Math.floor(this.resources[i] * (1 + (this.multiplicator * this.bonus)))
		}

		this.context.effects.createResourceTransfer(this.resources, this.context.coordinates.uvToXYUntranslated(this.position))
		this.resourceCount = 0
		this.resources = new Array(10).fill(0)
		this.multiplicator = Math.min(this.multiplicator + 1, this.maxMultiplicator)

	}

	update(dt?: number){

		if (this.state === 2 && this.sprite.currentSequence === 0) this.sprite.switchSequence(1)
		this.timer = Math.max(0, this.timer - (dt || 0))
		if (this.timer === 0) {
			this.multiplicator = 1
		}

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
	}

	onmousedown(){

		this.refill()

	}

	render(dt?: number, vposition?: Vec2){

		const f = (this.multiplicator - 1) / this.maxMultiplicator
		this.sprite.renderState(vposition ? vposition : this.position, f)

	}

}
