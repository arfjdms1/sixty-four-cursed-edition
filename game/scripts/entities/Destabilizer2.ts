import type { ColorTriplet, ResourceAmounts, Vec2 } from '../../types/core.js'
import type { EntityHost } from './types.js'
import { Destabilizer } from './Destabilizer.js'
import { Entity } from './Entity.js'
import { Sprite } from '../sprites.js'

export class Destabilizer2 extends Destabilizer{

	constructor(master: EntityHost){
		super(master)
		this.fuel = [0,64]
		this.name = `destabilizer2`
		this.soulPower = 1

		this.sprite = new Sprite({
			master: this.master,
			src: `img/des2.png`,
			mask: [0,0,455,395],
			frames: [[0,0,455,395],[455,0,455,395],[910,0,455,395]],
			origins: [227, 264],
			scale: 1,
			sequences: [0,1,2],
			intervals: 30
		})

		this.initHint()
		this.initSellHint()
	}

	tap(mult: number = 1): number {
		this.fill -= 7e-4 * mult //1.4e-3 * mult 
		if (this.fill <= 0){
			this.fill = 0
			if (this.state === 2) this.shootExhaust()
			this.state = 0
		}
		return 2
	}

	render(dt?: number, vposition?: Vec2){


		const position = vposition ? vposition : this.position

		this.sprite.render(position, this.fill ? dt : 0)

		if (this.fill){
			this.master.drawPrism([position[0] - .44, position[1] - .34 - .44], .06, this.fill, this.master.codex.resources[1].triplet)
		}

		// this.puff.render([position[0] - .4, position[1] - .76], dt)

	}

}
