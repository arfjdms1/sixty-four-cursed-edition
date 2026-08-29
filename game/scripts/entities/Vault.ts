import type { ColorTriplet, ResourceAmounts, Vec2 } from '../../types/core.js'
import type { EntityHost } from './types.js'
import { Entity } from './Entity.js'
import { Sprite } from '../sprites.js'

export class Vault extends Entity{

	constructor(master: EntityHost){
		super(master)
		this.entityHeight = 2
		this.name = `vault`
		this.maxExcitement = 1024
		this.excitement = 0
		this.soulPower = 16

		this.sprite = new Sprite({
			master: this.master,
			src: `img/vault.png`,
			frames: [[0,0,455,838],[455,0,455,838]],
			origins: [227,707],
			scale: 1,
			sequences: [0,1],
			intervals: 30
		})

		this.initHint()
		this.initSellHint()
	}

	tap(){
		this.excitement = this.maxExcitement
	}

	update(dt?: number){

		if (this.excitement > 0) {
			this.excitement = Math.max(0, this.excitement - (dt || 0))
		}

	}

	render(dt?: number, vposition?: Vec2){

		this.sprite.renderState(vposition ? vposition : this.position, 0)
		this.master.ctx.globalAlpha = (this.excitement / this.maxExcitement) ** 2
		this.sprite.renderState(vposition ? vposition : this.position, 1)
		this.master.ctx.globalAlpha = 1

	}

	onDelete(){

		this.master.vaults.delete(this)
		this.master.annihilationMachines.delete(this)

	}

	init(){

		this.master.vaults.add(this)
		this.master.annihilationMachines.add(this)

	}

}
