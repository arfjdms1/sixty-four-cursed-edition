import type { ColorTriplet, ResourceAmounts, Vec2 } from '../../../../../types/core.js'
import type { EntityHost } from '../../../../engine/entities/types.js'
import { Entropic } from './Entropic.js'
import { Entity } from '../../../../engine/entities/Entity.js'
import { Sprite } from '../../../../sprites.js'

export class Entropic2 extends Entropic{

	constructor(master: EntityHost){
		super(master)
		this.interval = 300
		this.fuel = [0,0,0,0,0,1]
		this.power = .66
		this.name = `entropic2`
		this.soulPower = 2

		this.sprite = new Sprite({
			master: this.master,
			src: `resources/images/entropy2.png`,
			mask: [0,0,455,335],
			frames: [[0,0,455,335],[0,335,455,335]],
			backframes: [[455,0,455,335],[455,335,455,335]],
			origins: [227, 204],
			scale: 1,
			sequences: [0,1],
			intervals: 100
		})

		this.initHint()
		this.initSellHint()
	}

	tap(){
		this.fill -= 5e-5
		if (this.fill <= 0){
			this.fill = 0
			if (this.state === 2) this.shootExhaust()
			this.state = 0
		}
	}


	render(dt?: number, vposition?: Vec2){

		const position = vposition ? vposition : this.position

		if (position) {

			this.sprite.renderState(position, this.fill ? 1 : 0, true)

			if (this.fill){
				this.master.drawPrism([position[0] - .32, position[1] - .32], .25, .25 * this.fill, this.master.codex.resources[5].triplet)
			}

			this.sprite.renderState(position, this.fill ? 1 : 0)

		}

	}

}
