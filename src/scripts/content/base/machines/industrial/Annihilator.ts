import type { ColorTriplet, ResourceAmounts, Vec2 } from '../../../../../types/core.js'
import type { EntityHost } from '../../../../engine/entities/types.js'
import { Entity } from '../../../../engine/entities/Entity.js'
import { Sprite } from '../../../../sprites.js'
import { Silo } from '../storage/Silo.js'

export class Annihilator extends Entity{

	constructor(master: EntityHost){
		super(master)
		this.name = `annihilator`
		this.value = 1

		this.fill = 0
		this.state = 0
		this.fuel = [0,0,0,0,0,0,0,1]
		this.soulPower = 2

		this.transitionTime = 900
		this.transitionState = 0

		this.sprite = new Sprite({
			master: this.master,
			src: `resources/images/annihilator.png`,
			frames: [[0,0,455,480],[455,0,455,480],[910,0,455,480],[1365,0,455,480],[1820,0,455,480],[2275,0,455,480],[0,480,455,480],[455,480,455,480],[910,480,455,480],[1365,480,455,480],[1820,480,455,480],[0,960,455,480],[455,960,455,480],[910,960,455,480],[1365,960,455,480],[1820,960,455,480],[2275,960,455,480]],
			origins: [226, 348],
			scale: 1,
			sequences: [[16],[0,1,2,3,4,5,6,7,8,9,10],[15,14,13,12,11],[11,12,13,14,15]],
			intervals: 100
		})

		this.sprite.switchSequence(0)
		this.initHint()
		this.initSellHint()
	}

	onDelete(){
		this.master.annihilators.delete(this)
	}

	init(){

		this.master.annihilators.add(this)
		if (this.state === 2 && this.sprite.currentSequence === 0) {
			this.timer = this.transitionTime
			this.sprite.switchSequence(2)
		}

		this.isNextToSilo = false
		for (let i = 0; i < this.soi.length; i++){
			const cell = this.context.spatial.entityAt([this.position[0] + this.soi[i][0], this.position[1] + this.soi[i][1]])
			if (cell instanceof Silo){
				this.isNextToSilo = true
				break
			}
		}

	}

	tap(){
		if (this.state === 2){
			this.fill -= .03125
			if (this.fill <= 0){
				this.fill = 0
				if (this.state === 2) this.shootExhaust()
				this.state = 0
				this.sprite.switchSequence(3)
				this.timer = this.transitionTime
			}

			const screenxy = this.context.coordinates.uvToXYUntranslated(this.position)
			this.context.effects.createResourceSpark([0,0,0,0,0,0,0,0,1], screenxy)
			this.context.effects.createResourceTransfer([0,0,0,0,0,0,0,0,1], screenxy, screenxy, false, [0,0])
			this.context.effects.createResourceExplosion([0,0,0,0,0,0,0,0,16], screenxy)
			if (!this.master.voidsculpture) this.master.createHollowEvent(`#60F1`,500)

			return true
		}
		return false
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

		this.sprite.switchSequence(2)
		this.timer = this.transitionTime
	}

	onmousedown(){

		this.refill()

	}

	render(dt?: number, vposition?: Vec2){
		if (this.sprite.currentSequence === 2 || this.sprite.currentSequence === 3){
			this.sprite.renderState(vposition ? vposition : this.position, this.transitionState)
		} else {
			this.sprite.render(vposition ? vposition : this.position, dt)
		}

	}

	update(dt?: number){

		if (this.sprite.currentSequence === 2 || this.sprite.currentSequence === 3){

			if (dt) this.timer -= dt
			this.transitionState = Math.min(1, 1 - this.timer / this.transitionTime)

			if (this.timer <= 0){

				this.transitionState = 0
				this.sprite.switchSequence(this.sprite.currentSequence === 2 ? 1 : 0)

			}

		}

	}

}
