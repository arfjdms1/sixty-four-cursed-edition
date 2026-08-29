import type { ColorTriplet, ResourceAmounts, Vec2 } from '../../types/core.js'
import type { EntityHost } from './types.js'
import { Clicker1 } from './Clicker1.js'
import { Entity } from './Entity.js'
import { Sprite } from '../sprites.js'

export class Clicker3 extends Clicker1{

	constructor(master: EntityHost){
		super(master)
		this.name = `clicker3`
		this.soulPower = 1

		this.sprite = new Sprite({
			master: this.master,
			src: `img/clicker3.png`,
			frames: [[0,0,455,343]],
			origins: [226,212],
			scale: 1,
			sequences: [0],
			intervals: 100
		})

		this.initHint()
		this.initSellHint()
	}

	init(){

		this.master.mouse.automate = true
		this.master.mouse.maxTimer = 50

	}

}
