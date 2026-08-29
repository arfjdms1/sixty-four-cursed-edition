import type { ColorTriplet, ResourceAmounts, Vec2 } from '../../types/core.js'
import type { EntityHost } from './types.js'
import { Entity } from './Entity.js'
import { Sprite } from '../sprites.js'

export class Strange extends Entity{

	constructor(master: EntityHost){
		super(master)
		this.entityHeight = 3
		this.name = `strange`
		this.entitySpan = 1
		this.indestructible = true

		this.sprite = new Sprite({
			master: this.master,
			src: `img/strange.png`,
			frames: [[0,0,907,829]],
			origins: [454,566],
			scale: 3,
			sequences: [0],
			intervals: 100
		})

		this.initHint()
	}

	canHit(){
		return true
	}

	onmousedown(){
		const screenxy = this.master.uvToXYUntranslated(this.position)
		const pan = this.master.getPanValueFromX(screenxy[0])
		const loudness = this.master.getLoudnessFromXY(screenxy)
		this.master.playSound(`horn`)
		this.master.stats.strangeRockPoked++
	}

	render(dt?: number, vposition?: Vec2){

		this.sprite.render(vposition ? vposition : this.position, dt)

	}

}
