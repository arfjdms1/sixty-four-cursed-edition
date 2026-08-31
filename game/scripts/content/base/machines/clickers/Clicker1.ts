import type { ColorTriplet, ResourceAmounts, Vec2 } from '../../../../../types/core.js'
import type { EntityHost } from '../../../../engine/entities/types.js'
import { Entity } from '../../../../engine/entities/Entity.js'
import { Sprite } from '../../../../sprites.js'

export class Clicker1 extends Entity{

	constructor(master: EntityHost){
		super(master)
		this.name = `clicker1`
		this.soulPower = 1

		this.sprite = new Sprite({
			master: this.master,
			src: `img/clicker1.png`,
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

		this.master.mouse.automate = true
		this.master.mouse.maxTimer = 150

	}

	onDelete(){

		this.master.mouse.automate = false

	}

	render(dt?: number, vposition?: Vec2){

		this.sprite.render(vposition ? vposition : this.position)

	}

}
