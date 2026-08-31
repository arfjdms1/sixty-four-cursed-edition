import type { ColorTriplet, ResourceAmounts, Vec2 } from '../../../../../types/core.js'
import type { EntityHost } from '../../../../engine/entities/types.js'
import { Entity } from '../../../../engine/entities/Entity.js'
import { Sprite } from '../../../../sprites.js'

export class Mega1b extends Entity{

	constructor(master: EntityHost){
		super(master)
		this.entityHeight = 4
		this.name = `mega1b`
		this.soulPower = 4

		this.sprite = new Sprite({
			master: this.master,
			src: `img/mega1b.png`,
			frames: [[0,0,697,1469]],
			origins: [226,1337],
			scale: 1.532,
			sequences: [0],
			intervals: 100
		})

		this.initHint()
		this.initSellHint()
	}

	init(){

		this.master.resourceTransferType = Math.max(this.master.resourceTransferType, 3)

	}

	onDelete(){

		if (this.master.resourceTransferType === 3) this.master.resourceTransferType = 0

	}

	render(dt?: number, vposition?: Vec2){

		this.sprite.render(vposition ? vposition : this.position)

	}

}
