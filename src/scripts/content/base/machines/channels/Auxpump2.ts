import type { ColorTriplet, ResourceAmounts, Vec2 } from '../../../../../types/core.js'
import type { EntityHost } from '../../../../engine/entities/types.js'
import { Auxpump } from './Auxpump.js'
import { Entity } from '../../../../engine/entities/Entity.js'
import { Sprite } from '../../../../sprites.js'

export class Auxpump2 extends Auxpump{

	constructor(master: EntityHost){
		super(master)
		this.name = `auxpump2`
		this.fuel = [0,256,0,4]
		this.soulPower = 1

		this.sprite = new Sprite({
			master: this.master,
			src: `resources/images/auxpump1.png`,
			mask: [0,0,455,573],
			frames: [[0,0,455,573]],
			origins: [227, 440],
			scale: 1,
			sequences: [0],
			intervals: 100
		})

		this.initHint()
		this.initSellHint()
	}

	tap(dt: number = 0): number {

		if (this.state === 2){

			this.fill -= 1.2e-6 * dt//2e-6 * dt
			if (this.fill <= 0){
				this.fill = 0
				if (this.state === 2) this.shootExhaust()
				this.state = 0
			}
			return 1
		}

		return 0
	}

	render(dt?: number, vposition?: Vec2){

		const position = vposition ? vposition : this.position

		this.sprite.render(position)
		if (this.fill){
			this.context.render.drawPrism([position[0] - .42, position[1] + .50 - .42], .06, this.fill, this.master.codex.resources[3].triplet)
		}

	}

}
