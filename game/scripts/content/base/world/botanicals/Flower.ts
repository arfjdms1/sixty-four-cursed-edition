import type { ColorTriplet, ResourceAmounts, Vec2 } from '../../../../../types/core.js'
import type { EntityHost } from '../../../../engine/entities/types.js'
import { Entity } from '../../../../engine/entities/Entity.js'
import { Sprite } from '../../../../sprites.js'

export class Flower extends Entity{

	constructor(master: EntityHost, owner?: unknown){
		super(master)
		this.entityHeight = 2
		this.name = `flower`
		this.soulPower = 32

		this.sprite = new Sprite({
			master: this.master,
			src: `img/flower.png`,
			frames: [[0,0,455,847]],
			origins: [226,716],
			scale: 1,
			sequences: [[0]],
			intervals: 100
		})

		this.initHint()
		this.initSellHint()
	}

	canHit(){
		return false
	}

	getOwner(){
		return this.master.hollowSite
	}

	init(){

	}

	onmousedown(){

	}

	onDelete(){
		const hollowSite = this.getOwner()
	}

	render(dt?: number, vposition?: Vec2){

		this.sprite.render(vposition ? vposition : this.position)

	}

}
