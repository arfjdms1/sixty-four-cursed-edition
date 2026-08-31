import type { ColorTriplet, ResourceAmounts, Vec2 } from '../../../../../types/core.js'
import type { EntityHost } from '../../../../engine/entities/types.js'
import { Entity } from '../../../../engine/entities/Entity.js'
import { Sprite } from '../../../../sprites.js'
import { Converter64 } from './Converter64.js'

export class Reflector extends Entity{

	constructor(master: EntityHost){
		super(master)
		this.name = `reflector`
		this.variant = 0
		this.soulPower = .5

		this.variantMap = [.25, .125, 0, .875, .75, .625, .5, .375]

		this.sprite = new Sprite({
			master: this.master,
			src: `resources/images/reflector.png`,
			frames: [[0,0,455,279],[455,0,455,279],[910,0,455,279],[1365,0,455,279],[0,279,455,279],[455,279,455,279],[910,279,455,279],[1365,279,455,279]],
			origins: [227, 147],
			scale: 1,
			sequences: [0,1,2,3,4,5,6,7],
			intervals: 100
		})

		this.initHint()
		this.initSellHint()
	}

	init(){

		for (let i = 0; i < this.soi.length; i++){
			const cell = this.master.entityAtCoordinates([this.position[0] + this.soi[i][0], this.position[1] + this.soi[i][1]])
			if (cell && cell instanceof Converter64){
				this.variant = (this.variantMap as number[])[i] || 0
				break
			}

		}
	}

	render(dt?: number, vposition?: Vec2){
		this.sprite.renderState(vposition ? vposition : this.position, this.variant)
	}
}
