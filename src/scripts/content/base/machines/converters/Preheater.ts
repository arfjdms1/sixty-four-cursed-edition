import type { ColorTriplet, ResourceAmounts, Vec2 } from '../../../../../types/core.js'
import type { EntityHost } from '../../../../engine/entities/types.js'
import { Entity } from '../../../../engine/entities/Entity.js'
import { Sprite } from '../../../../sprites.js'
import { Converter13 } from './Converter13.js'
import { Converter32 } from './Converter32.js'
import { Converter41 } from './Converter41.js'
import { Converter64 } from './Converter64.js'
import { Converter76 } from './Converter76.js'
import { Silo } from '../storage/Silo.js'

export class Preheater extends Entity{

	constructor(master: EntityHost){
		super(master)
		this.name = `preheater`
		this.maxMultiplicator = 3
		this.multiplicator = 1.5

		this.fill = 0
		this.state = 0
		this.fuel = [0,0,0,65536,0,512]
		this.soulPower = 2

		this.sprite = new Sprite({
			master: this.master,
			src: `resources/images/preheater.png`,
			frames: [[0,0,455,293],[455,0,455,293],[910,0,455,293],[1365,0,455,293]],
			origins: [226,161],
			scale: 1,
			sequences: [0,1,2,3],
			intervals: 100
		})

		this.initHint()
		this.initSellHint()
	}

	tap(){
		if (this.state === 2){
			this.fill -= 3e-6
			if (this.fill <= 0){
				this.fill = 0
				if (this.state === 2) this.shootExhaust()
				this.state = 0
				return 0
			}
			return this.multiplicator
		}
		return 0

	}

	init(){


		this.convertersNearby = 0
		this.isNextToSilo = false

		for (let i = 0; i < this.soi.length; i++){
			const cell = this.context.spatial.entityAt([this.position[0] + this.soi[i][0], this.position[1] + this.soi[i][1]])
			if (cell && (cell instanceof Converter32 || cell instanceof Converter13 || cell instanceof Converter41 || cell instanceof Converter76 || cell instanceof Converter64) ){
				this.convertersNearby++
			} else if (cell && (cell instanceof Silo)){
				this.isNextToSilo = true
			}

		}

		this.multiplicator = .5 + 2.5 * this.convertersNearby / 8
		this.spriteState = Math.min(1, .25 + this.convertersNearby / 8 * .75)

	}

	refill(){
		if (this.state === 0){

			const resources = this.context.resources.requestResources?.(this.fuel!, this.position, (_?: unknown) => {
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

		const f = this.fill ? this.spriteState : 0
		this.sprite.renderState(vposition ? vposition : this.position, f)

	}

}
