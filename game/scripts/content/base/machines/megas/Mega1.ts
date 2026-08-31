import type { ColorTriplet, ResourceAmounts, Vec2 } from '../../../../../types/core.js'
import type { EntityHost } from '../../../../engine/entities/types.js'
import { Entity } from '../../../../engine/entities/Entity.js'
import { Sprite } from '../../../../sprites.js'

export class Mega1 extends Entity{

	constructor(master: EntityHost){
		super(master)
		this.entityHeight = 4
		this.name = `mega1`
		this.soulPower = 1

		this.sprite = new Sprite({
			master: this.master,
			src: `img/mega1.png`,
			frames: [[0,0,455,1469]],
			origins: [226,1337],
			scale: 1,
			sequences: [0],
			intervals: 100
		})

		this.initHint()
		this.initSellHint()
	}

	init(){

		this.master.resourceTransferType = Math.max(this.master.resourceTransferType, 1)

	}

	onDelete(){

		if (this.master.resourceTransferType === 1) this.master.resourceTransferType = 0

	}

	render(dt?: number, vposition?: Vec2){

		this.sprite.render(vposition ? vposition : this.position)

	}

}
