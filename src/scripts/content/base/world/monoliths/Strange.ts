import type { ColorTriplet, ResourceAmounts, Vec2 } from '../../../../../types/core.js'
import type { EntityHost } from '../../../../engine/entities/types.js'
import { Entity } from '../../../../engine/entities/Entity.js'
import { Sprite } from '../../../../sprites.js'

export class Strange extends Entity{

	constructor(master: EntityHost){
		super(master)
		this.entityHeight = 3
		this.name = `strange`
		this.entitySpan = 1
		this.indestructible = true

		this.sprite = new Sprite({
			master: this.master,
			src: `resources/images/strange.png`,
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
		const screenxy = this.context.coordinates.uvToXYUntranslated(this.position)
		const pan = this.context.audio.getPanValueFromX(screenxy[0])
		const loudness = this.context.audio.getLoudnessFromXY(screenxy)
		this.context.audio.playSound(`horn`)
		this.master.stats.strangeRockPoked++
	}

	render(dt?: number, vposition?: Vec2){

		this.sprite.render(vposition ? vposition : this.position, dt)

	}

}
