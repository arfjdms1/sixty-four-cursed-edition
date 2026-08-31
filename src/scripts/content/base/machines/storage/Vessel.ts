import type { ColorTriplet, ResourceAmounts, Vec2 } from '../../../../../types/core.js'
import type { EntityHost } from '../../../../engine/entities/types.js'
import { Entity } from '../../../../engine/entities/Entity.js'
import { Sprite } from '../../../../sprites.js'
import { Silo } from './Silo.js'

export class Vessel extends Entity{

	constructor(master: EntityHost){
		super(master)
		this.name = `vessel`
		this.fill = 0
		this.state = 0
		this.fuel = [0,0,0,0,1]
		this.soulPower = 1

		this.isUsed = false
		this.capacity = 32

		this.sprite = new Sprite({
			master: this.master,
			src: `resources/images/vessel.png`,
			frames: [[0,0,455,391],[455,0,455,391]],
			origins: [226,260],
			scale: 1,
			sequences: [[0,1]],
			intervals: 100
		})

		this.initHint()
		this.initSellHint()
	}

	init(){
		this.isNextToSilo = false
		for (let i = 0; i < this.soi.length; i++){
			const cell = this.master.entityAtCoordinates([this.position[0] + this.soi[i][0], this.position[1] + this.soi[i][1]])
			if (cell instanceof Silo){
				this.isNextToSilo = true
				break
			}
		}
	}

	tap(dt?: number){
		if (dt) this.fill -= 3e-7 * dt//1e-6 * dt
		if (this.fill <= 0){
			this.fill = 0
			if (this.state === 2) this.shootExhaust()
			this.state = 0
		}
	}

	refill(){
		if (this.state === 0){

			const resources = this.master.requestResources?.(this.fuel!, this.position, (_?: unknown) => {
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

		this.sprite.renderState(vposition ? vposition : this.position, this.isUsed ? 1 : 0)

	}

}
