import type { ColorTriplet, ResourceAmounts, Vec2 } from '../../../../../types/core.js'
import type { EntityHost } from '../../../../engine/entities/types.js'
import { Entity } from '../../../../engine/entities/Entity.js'
import { Sprite } from '../../../../sprites.js'
import { Silo } from '../storage/Silo.js'

export class Auxpump extends Entity{

	constructor(master: EntityHost){
		super(master)
		this.fill = 0
		this.state = 0
		this.name = `auxpump`
		this.fuel = [0,8]
		this.soulPower = .2

		this.sprite = new Sprite({
			master: this.master,
			src: `resources/images/auxpump.png`,
			mask: [0,0,455,507],
			frames: [[0,0,455,507]],
			backframes: [[455,0,455,507]],
			origins: [227, 376],
			scale: 1,
			sequences: [0],
			intervals: 100
		})

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


	tap(dt: number = 0): number {

		if (this.state === 2){

			this.fill -= 1e-5 * dt//2e-5 * dt
			if (this.fill <= 0){
				this.fill = 0
				if (this.state === 2) this.shootExhaust()
				this.state = 0
			}
			return .25
		}

		return 0
	}

	refill(){
		if (this.state === 0){

			const resources = this.context.resources.requestResources?.(this.fuel, this.position, (_event?: unknown)=>{
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
			this.master.drawPrism([this.position[0] - .025 + .125, this.position[1] - .025 - .125], .5, .5 * this.fill, this.master.codex.resources[1].triplet)
		}
		this.sprite.render(position)

	}

}
