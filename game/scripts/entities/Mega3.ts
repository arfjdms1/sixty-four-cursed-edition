import type { ColorTriplet, ResourceAmounts, Vec2 } from '../../types/core.js'
import type { EntityHost } from './types.js'
import { Entity } from './Entity.js'
import { Sprite } from '../sprites.js'

export class Mega3 extends Entity{

	constructor(master: EntityHost){
		super(master)
		this.entityHeight = 3
		this.name = `mega3`
		this.soulPower = 2

		this.sprite = new Sprite({
			master: this.master,
			src: `img/recycler2.png`,
			frames: [[0,0,455,1093]],
			origins: [226,961],
			scale: 1,
			sequences: [0],
			intervals: 100
		})

		this.initHint()
		this.initSellHint()
	}

	init(){

		this.master.updateEraserType()
		document.body.classList.add(`allowEHints`)
		// this.master.resourceTransferType = Math.max(this.master.resourceTransferType, 1)

	}

	onDelete(){

		this.master.updateEraserType()
		document.body.classList.remove(`allowEHints`)
		// if (this.master.resourceTransferType === 1) this.master.resourceTransferType = 0

	}

	render(dt?: number, vposition?: Vec2){

		this.sprite.render(vposition ? vposition : this.position)

	}

}
