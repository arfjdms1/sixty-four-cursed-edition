import type { ColorTriplet, ResourceAmounts, Vec2 } from '../../../../../types/core.js'
import type { EntityHost } from '../../../../engine/entities/types.js'
import { Entity } from '../../../../engine/entities/Entity.js'
import { Sprite } from '../../../../sprites.js'
import { Silo } from '../storage/Silo.js'

export class Destabilizer extends Entity{

	constructor(master: EntityHost){
		super(master)
		this.fill = 0
		this.state = 0
		this.fuel = [0,1]
		this.soulPower = .2

		this.name = `destabilizer`

		this.sprite = new Sprite({
			master: this.master,
			src: `resources/images/des.png`,
			mask: [0,0,455,306],
			frames: [[0,0,455,306]],
			backframes: [[455,0,455,306]],
			origins: [227, 175],
			scale: 1,
			sequences: [0],
			intervals: 100
		})

		// this.puff = new Sprite({
		// 	master: this.master,
		// 	src: `resources/images/puff.png`,
		// 	frames: [[0,0,210,210],[210,0,210,210],[420,0,210,210],[630,0,210,210], [0,210,210,210],[210,210,210,210],[420,210,210,210],[630,210,210,210], [0,420,210,210],[210,420,210,210],[420,420,210,210],[630,420,210,210], [0,630,210,210],[210,630,210,210],[420,630,210,210],[630,630,210,210]],
		// 	origins: [105, 170],
		// 	scale: 1,
		// 	sequences: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
		// 	intervals: 80
		// })

		this.initHint()
		this.initSellHint()
	}

	init(){
		this.isNextToSilo = false
		for (let i = 0; i < this.soi.length; i++){
			const cell = this.master.entityAtCoordinates([this.position[0] + this.soi[i][0], this.position[1] + this.soi[i][1]])
			if (cell instanceof Silo){
				this.isNextToSilo = true
				break
			}
		}
	}

	tap(mult: number = 1): number {
		this.fill -= .0078125 * mult//.015625 * mult
		if (this.fill <= 0){
			this.fill = 0
			if (this.state === 2) this.shootExhaust()
			this.state = 0
		}
		return 1
	}

	refill(){
		if (this.state === 0){

			const resources = this.master.requestResources?.(this.fuel, this.position, (_event?: unknown)=>{
				this.activate()
			})
			if (resources) this.state = 1

		}
	}

	activate(){
		this.fill = 1
		this.state = 2
	}

	onmousedown(){

		this.refill()

	}

	render(dt?: number, vposition?: Vec2){

		const position = vposition ? vposition : this.position

		this.sprite.render(position, 0, true)

		if (this.fill){
			this.master.drawPrism([position[0] - .025 + .27, position[1] - .025 + .02], .25, .25 * this.fill, this.master.codex.resources[1].triplet)
		}

		this.sprite.render(position, 0)

	}

}
