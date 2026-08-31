import type { ColorTriplet, ResourceAmounts, Vec2 } from '../../../../../types/core.js'
import type { EntityHost } from '../../../../engine/entities/types.js'
import { Entropic } from './Entropic.js'
import { Entity } from '../../../../engine/entities/Entity.js'
import { Sprite } from '../../../../sprites.js'
import { Cube } from '../../entities/Cube.js'

export class Entropic2a extends Entropic{

	constructor(master: EntityHost){
		super(master)
		this.fuel = [0,0,0,0,0,8]
		this.power = 2
		this.name = `entropic2a`
		this.soulPower = 2

		this.candidates = {}

		this.sprite = new Sprite({
			master: this.master,
			src: `resources/images/entropy2a.png`,
			mask: [0,0,455,382],
			frames: [[0,0,455,382],[0,382,455,382]],
			backframes: [[455,0,455,382],[455,382,455,382]],
			origins: [227, 250],
			scale: 1,
			sequences: [0,1],
			intervals: 100
		})

		this.initHint()
		this.initSellHint()
	}

	update(dt?: number){

		if (this.state === 2){

			//Find cubes to break
			for (let i = 0; i < this.soi.length; i++){

				const hash = `u${this.position[0] + this.soi[i][0]}v${this.position[1] + this.soi[i][1]}`
				const cell = this.master.stuffMap[hash]
				if (cell && cell instanceof Cube){

					if (cell.state === 2 && this.candidates[hash]){
						this.tap()
						cell.onmousedown(this.power as number)
						delete this.candidates[hash]
					} else if (cell.state < 2 && !this.candidates[hash]){
						this.candidates[hash] = true
					}
					
				}

			}

		}

	}

	tap(){
		this.fill -= 5e-3
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
