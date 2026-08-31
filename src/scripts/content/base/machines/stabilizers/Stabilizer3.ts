import type { ColorTriplet, ResourceAmounts, Vec2 } from '../../../../../types/core.js'
import type { EntityHost } from '../../../../engine/entities/types.js'
import { Stabilizer } from './Stabilizer.js'
import { Entity } from '../../../../engine/entities/Entity.js'
import { Sprite } from '../../../../sprites.js'

export class Stabilizer3 extends Stabilizer{

	constructor(master: EntityHost){
		super(master)
		this.name = `stabilizer3`
		this.soulPower = 64

		this.stabilization = 0
		this.baseInterval = 500

		this.sprite = new Sprite({
			master: this.master,
			src: `resources/images/stabilizer3.png`,
			frames: [[0,0,455,580]],
			origins: [227,448],
			scale: 1,
			sequences: [0],
			intervals: 100
		})

		this.initHint()
		this.initSellHint()
	}

	setPosition(uv: Vec2){

		this.position = uv
		this.attractorPosition = [uv[0] - .6, uv[1] - .6]
		this.init()
		return this

	}

}
