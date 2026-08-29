import type { ColorTriplet, ResourceAmounts, Vec2 } from '../../types/core.js'
import type { EntityHost } from './types.js'
import { Strange1 } from './Strange1.js'
import { Entity } from './Entity.js'
import { Sprite } from '../sprites.js'

export class Strange2 extends Strange1{

	constructor(master: EntityHost){
		super(master)
		this.name = `strange2`

		this.spawnRadius = 8
		this.maxSpawnedHollows = 16
		this.spawnedHollows = 0
		this.spawnTimerBase = 40000
		this.spawnTimer = 80000

		this.sprite = new Sprite({
			master: this.master,
			src: `img/strange2.png`,
			frames: [[0,0,936,994]],
			origins: [455,732],
			scale: 3,
			sequences: [0],
			intervals: 100
		})

		this.initHint()
	}

}
