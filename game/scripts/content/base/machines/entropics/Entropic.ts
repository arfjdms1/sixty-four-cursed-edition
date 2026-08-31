import type { ColorTriplet, ResourceAmounts, Vec2 } from '../../../../../types/core.js'
import type { EntityHost } from '../../../../engine/entities/types.js'
import { Entity } from '../../../../engine/entities/Entity.js'
import { Sprite } from '../../../../sprites.js'
import { Cube } from '../../entities/Cube.js'
import { Gradient } from '../channels/Gradient.js'
import { Silo } from '../storage/Silo.js'

export class Entropic extends Entity{

	constructor(master: EntityHost){
		super(master)
		this.fill = 0
		this.state = 0
		this.power = .33
		this.interval = 1000
		this.timer = 0
		this.fuel = [0,0,1]
		this.name = `entropic`
		this.soulPower = 1

		this.sprite = new Sprite({
			master: this.master,
			src: `img/entropy.png`,
			mask: [0,0,455,335],
			frames: [[0,0,455,335],[0,335,455,335]],
			backframes: [[455,0,455,335],[455,335,455,335]],
			origins: [227, 204],
			scale: 1,
			sequences: [0,1],
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

	tap(){
		this.fill -= 1e-3
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

	update(dt?: number){

		if (this.state === 2){

			if (dt) this.timer += dt
			if (this.timer > this.interval){
				this.timer = 0

				//Find cubes to break
				for (let i = 0; i < this.soi.length; i++){

					const cell = this.master.stuffMap[`u${this.position[0] + this.soi[i][0]}v${this.position[1] + this.soi[i][1]}`]
					if (cell && cell instanceof Cube && cell.state === 2){
						this.tap()
						cell.onmousedown(this.power as number)
					} else if (cell && cell instanceof Gradient && cell.isConnected()){
						this.tap()
						cell.tap(this.power as number)
					}

				}

			}

		}

	}

	render(dt?: number, vposition?: Vec2){

		const position = vposition ? vposition : this.position

		if (position) {

			this.sprite.renderState(position, this.fill ? 1 : 0, true)

			if (this.fill){
				this.master.drawPrism([position[0] - .32, position[1] - .32], .25, .25 * this.fill, this.master.codex.resources[2].triplet)
			}

			this.sprite.renderState(position, this.fill ? 1 : 0)

		}

	}

}
