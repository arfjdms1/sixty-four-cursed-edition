import type { ColorTriplet, ResourceAmounts, Vec2 } from '../../../../../types/core.js'
import type { EntityHost } from '../../../../engine/entities/types.js'
import { Entity } from '../../../../engine/entities/Entity.js'
import { Sprite } from '../../../../sprites.js'

export class Doublechannel extends Entity{

	constructor(master: EntityHost){
		super(master)
		this.name = `doublechannel`
		this.value = 1
		this.soulPower = .2

		this.sprite = new Sprite({
			master: this.master,
			src: `resources/images/double_spr.png`,
			frames: [[0,0,455,265],[455,0,455,265],[910,0,455,265]],
			origins: [226,131],
			scale: 1,
			sequences: [0,1,2],
			intervals: 30
		})

		this.initHint()
		this.initSellHint()
	}

	render(dt?: number, vposition?: Vec2){

		this.sprite.render(vposition ? vposition : this.position, dt)

	}

}
