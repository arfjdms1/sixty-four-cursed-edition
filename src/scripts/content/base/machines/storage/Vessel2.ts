import type { ColorTriplet, ResourceAmounts, Vec2 } from '../../../../../types/core.js'
import type { EntityHost } from '../../../../engine/entities/types.js'
import { Vessel } from './Vessel.js'
import { Entity } from '../../../../engine/entities/Entity.js'
import { Sprite } from '../../../../sprites.js'

export class Vessel2 extends Vessel{

	constructor(master: EntityHost){
		super(master)
		this.name = `vessel2`
		this.fuel = [0,0,0,0,0,0,0,0,0,1]
		this.soulPower = 1024

		this.capacity = 32768

		this.sprite = new Sprite({
			master: this.master,
			src: `resources/images/vessel2.png`,
			frames: [[0,0,454,615],[454,0,454,615]],
			origins: [227,484],
			scale: 1,
			sequences: [[0,1]],
			intervals: 100
		})

		this.initHint()
		this.initSellHint()
	}

}
