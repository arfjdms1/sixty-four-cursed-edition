import type { ColorTriplet, ResourceAmounts, Vec2 } from '../../../../../types/core.js'
import type { EntityHost } from '../../../../engine/entities/types.js'
import { Entity } from '../../../../engine/entities/Entity.js'
import { Sprite } from '../../../../sprites.js'
import { Silo } from '../storage/Silo.js'

export class Valve extends Entity{

	constructor(master: EntityHost){
		super(master)
		this.fill = 0
		this.state = 0
		this.fuel = [1]
		this.soulPower = .1

		this.name = `valve`

		this.sprite = new Sprite({
			master: this.master,
			src: `img/valve.png`,
			mask: [0,0,455,269],
			frames: [[0,0,455,269]],
			backframes: [[455,0,455,269]],
			origins: [227, 138],
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

	tap(dt?: number){
		if (dt) this.fill -= 1e-5 * dt
		if (this.fill <= 0){
			this.fill = 0
			if (this.state === 2) this.shootExhaust()
			this.state = 0
		}
	}

	refill(){
		if (this.state === 0){

			const resources = this.master.requestResources?.(this.fuel!, this.position, (_?: unknown) => {
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
			this.master.drawPrism([position[0] - .025 + .25, position[1] - .025], .25, .25 * this.fill, this.master.codex.resources[0].triplet)
		}

		this.sprite.render(position)
		
	}

}
