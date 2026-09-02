import type { ColorTriplet, ResourceAmounts, Vec2 } from '../../../../../types/core.js'
import type { EntityHost } from '../../../../engine/entities/types.js'
import { Entity } from '../../../../engine/entities/Entity.js'
import { Sprite } from '../../../../sprites.js'
import { Chasm } from '../../world/cosmic/Chasm.js'
import { Generaldecay } from '../../world/anomalies/Generaldecay.js'
import { Gradient } from '../channels/Gradient.js'
import { Silo2 } from '../storage/Silo2.js'

export class Conductor extends Entity{

	constructor(master: EntityHost){
		super(master)
		this.name = `conductor`
		this.variant = 0
		this.chasmNetwork = false

		const df = 1/11
		this.variantMap = {
			bbbb: 0,
			bbab: df,
			abab: df,
			abbb: df,
			bbaa: df*2,
			abba: df*3,
			aabb: df*4,
			baab: df*5,
			aaba: df*6,
			abaa: df*7,
			baaa: df*8,
			aaab: df*9,
			aaaa: df*10
		}

		this.sprite = new Sprite({
			master: this.master,
			src: `resources/images/conductor.png`,
			frames: [[0,0,454,263],[454,0,454,263],[910,0,454,263],[1364,0,454,263],[0,263,454,263],[454,263,454,263],[910,263,454,263],[1364,263,454,263],[0,526,454,263],[454,526,454,263],[910,526,454,263]],
			origins: [226,130],
			scale: 1,
			sequences: [0,1,2,3,4,5,6,7,8,9,10],
			intervals: 100
		})

		this.initHint()
		this.initSellHint()
	}

	init(){

		let map = ``

		for (let i = 0; i < this.soi.length; i+=2){
			const cell = this.context.spatial.entityAt([this.position[0] + this.soi[i][0], this.position[1] + this.soi[i][1]])
			const condition = Boolean(cell && (cell instanceof Conductor || cell instanceof Chasm || cell instanceof Silo2 || cell instanceof Gradient || cell instanceof Generaldecay))
			map += (condition ? `a` : `b`)

		}

		this.variant = (this.variantMap as Record<string, number>)[map] || 0
		if (this.master.chasm && "updateChain" in (this.master.chasm as object)) ((this.master.chasm as unknown as { updateChain: () => void }).updateChain())
		this.master.conductors.add(this)

	}

	onDelete(){

		this.master.conductors.delete(this)

	}

	render(dt?: number, vposition?: Vec2){

		this.sprite.renderState(vposition ? vposition : this.position, this.variant)

	}

}
