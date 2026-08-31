import type { ColorTriplet, ResourceAmounts, Vec2 } from '../../../../../types/core.js'
import type { EntityHost } from '../../../../engine/entities/types.js'
import { Doublechannel } from './Doublechannel.js'
import { Entity } from '../../../../engine/entities/Entity.js'
import { Sprite } from '../../../../sprites.js'

export class Doublechannel2 extends Doublechannel{

	constructor(master: EntityHost){
		super(master)
		this.name = `doublechannel2`
		this.value = 3
		this.soulPower = 1

		this.sprite = new Sprite({
			master: this.master,
			src: `resources/images/double2.png`,
			frames: [[0,0,455,431],[455,0,455,431],[910,0,455,431]],
			origins: [226,300],
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
