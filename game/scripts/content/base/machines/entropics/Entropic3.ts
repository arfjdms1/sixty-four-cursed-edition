import type { ColorTriplet, ResourceAmounts, Vec2 } from '../../../../../types/core.js'
import type { EntityHost } from '../../../../engine/entities/types.js'
import { Entity } from '../../../../engine/entities/Entity.js'
import { Sprite } from '../../../../sprites.js'
import { Cube } from '../../entities/Cube.js'
import { Gradient } from '../channels/Gradient.js'
import { Silo } from '../storage/Silo.js'

export class Entropic3 extends Entity{

	constructor(master: EntityHost){
		super(master)
		this.fill = 0
		this.state = 0
		this.fuel = [0,0,0,0,0,0,0,0,1]
		this.power = 256
		this.name = `entropic3`
		this.soulPower = 4

		this.sprite = new Sprite({
			master: this.master,
			src: `img/entropy3.png`,
			mask: [0,0,455,368],
			frames: [[0,0,455,368],[0,368,455,368]],
			backframes: [[455,0,455,368],[455,368,455,368]],
			origins: [227, 236],
			scale: 1,
			sequences: [0,1],
			intervals: 100
		})

		this.initHint()
		this.initSellHint()
	}

	init(){
		this.master.annihilationMachines.add(this)
		this.isNextToSilo = false
		for (let i = 0; i < this.soi.length; i++){
			const cell = this.master.entityAtCoordinates([this.position[0] + this.soi[i][0], this.position[1] + this.soi[i][1]])
			if (cell instanceof Silo){
				this.isNextToSilo = true
				break
			}
		}
	}

	onDelete(){
		this.master.annihilationMachines.delete(this)
	}

	tap(){
		
		this.process()

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

	process(){
		if (this.state === 2){

			//Find cubes to break
			let cubesAround = false
			for (let i = 0; i < this.soi.length; i++){

				const cell = this.master.stuffMap[`u${this.position[0] + this.soi[i][0]}v${this.position[1] + this.soi[i][1]}`]
				if (cell && cell instanceof Cube && cell.state === 2){
					cubesAround = true
					cell.onmousedown(this.power as number)
				} else if (cell && cell instanceof Gradient && cell.isConnected()){
					cubesAround = true
					cell.tap(this.power as number)
				}

			}

			if (cubesAround) {
				this.master.createResourceExplosion([0,0,0,0,0,0,0,0,16], this.master.uvToXYUntranslated(this.position))
				this.fill -= 4e-3//0.0078125//0.015625
				if (!this.master.voidsculpture) this.master.createHollowEvent(`#60F2`,500)
			}
		}
	}

	render(dt?: number, vposition?: Vec2){

		const position = vposition ? vposition : this.position

		if (position) {

			this.sprite.renderState(position, this.fill ? 1 : 0, true)

			if (this.fill){
				this.master.drawPrism([position[0] - .48, position[1] - .48], .25, .25 * this.fill, this.master.codex.resources[8].triplet)
			}

			this.sprite.renderState(position, this.fill ? 1 : 0)

		}

	}

}
