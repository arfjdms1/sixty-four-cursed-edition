import type { ColorTriplet, ResourceAmounts, Vec2 } from '../../../../types/core.js'
import type { EntityHost } from '../../../engine/entities/types.js'
import { Entity } from '../../../engine/entities/Entity.js'
import { Sprite } from '../../../sprites.js'

export class Eye extends Entity{

	constructor(master: EntityHost){
		super(master)
		this.name = `eye`
		this.soulPower = 1

		this.sprite = new Sprite({
			master: this.master,
			src: `img/eye.png`,
			frames: [[0,0,455,343]],
			origins: [226,212],
			scale: 1,
			sequences: [0],
			intervals: 100
		})

		this.initHint()
		this.initSellHint()
	}

	init(){

		this.master.showUnfilled = true

	}

	onDelete(){

		this.master.showUnfilled = false

	}

	render(dt?: number, vposition?: Vec2){

		this.sprite.render(vposition ? vposition : this.position)

	}

}
