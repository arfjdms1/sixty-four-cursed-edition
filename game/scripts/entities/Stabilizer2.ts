import type { ColorTriplet, ResourceAmounts, Vec2 } from '../../types/core.js'
import type { EntityHost } from './types.js'
import { Stabilizer } from './Stabilizer.js'
import { Entity } from './Entity.js'
import { Sprite } from '../sprites.js'

export class Stabilizer2 extends Stabilizer{

	constructor(master: EntityHost){
		super(master)
		this.name = `stabilizer2`
		this.soulPower = 16

		this.stabilization = .01
		this.baseInterval = 1000

		this.sprite = new Sprite({
			master: this.master,
			src: `img/stabilizer2.png`,
			frames: [[0,0,455,529]],
			origins: [227,398],
			scale: 1,
			sequences: [0],
			intervals: 100
		})

		this.initHint()
		this.initSellHint()
	}

}
