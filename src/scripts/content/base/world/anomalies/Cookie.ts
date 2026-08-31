import type { ColorTriplet, ResourceAmounts, Vec2 } from '../../../../../types/core.js'
import type { EntityHost } from '../../../../engine/entities/types.js'
import { Entity } from '../../../../engine/entities/Entity.js'
import { Sprite } from '../../../../sprites.js'

export class Cookie extends Entity{

	constructor(master: EntityHost){
		super(master)
		this.name = `cookie`
		this.soulPower = 1
		this.indestructible = true

		this.sprite = new Sprite({
			master: this.master,
			src: `resources/images/cookie.png`,
			frames: [[0,0,454,291]],
			origins: [227,159],
			scale: 1,
			sequences: [0],
			intervals: 100
		})

		this.initHint()
	}

	onmousedown(){
		this.master.cookie = true
	}

	render(dt?: number){

		this.sprite.renderState(this.position,0)

	}

}
