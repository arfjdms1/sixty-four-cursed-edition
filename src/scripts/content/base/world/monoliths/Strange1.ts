import type { ColorTriplet, ResourceAmounts, Vec2 } from '../../../../../types/core.js'
import type { EntityHost } from '../../../../engine/entities/types.js'
import { Entity } from '../../../../engine/entities/Entity.js'
import { Sprite } from '../../../../sprites.js'

export class Strange1 extends Entity{

	constructor(master: EntityHost){
		super(master)
		this.entityHeight = 3
		this.name = `strange1`
		this.entitySpan = 1
		this.indestructible = true

		this.spawnRadius = 8
		this.maxSpawnedHollows = 8
		this.spawnedHollows = 0
		this.spawnTimerBase = 80000
		this.spawnTimer = 160000

		this.soulPower = 0

		this.sprite = new Sprite({
			master: this.master,
			src: `resources/images/strange1.png`,
			frames: [[0,0,907,1002]],
			origins: [454,741],
			scale: 3,
			sequences: [0],
			intervals: 100
		})

		this.darksprite = new Sprite({
			master: this.master,
			src: `resources/images/vent.png`,
			frames: [[0,0,454,831]],
			origins: [227, 700],
			scale: 3,
			sequences: [0],
			intervals: 100
		})

		this.initHint()
	}

	ondarkhover(){}

	updateSoul(){this.soul = 1}

	update(dt?: number){

		if (dt) this.spawnTimer -= dt

		if (this.spawnTimer <= 0){

			this.spawnTimer = this.spawnTimerBase + Math.random() * this.spawnTimerBase * 2
			if (this.spawnedHollows < this.maxSpawnedHollows){
				this.spawnHollow()
			}

		}

	}

	spawnHollow(){

		let consumed = false

		if (this.context.roles.fruits.size){

			for (const f of this.context.roles.fruits){
				if (f && (f as unknown as { seed?: () => void }).seed) {
					(f as unknown as { seed: () => void }).seed();
					consumed = true;
					break;
				}
			}

		}

		if (consumed){

			this.context.audio.playSound(`horn`, 0, .4)

		} else {

			for (let i = 0; i < 32; i++){

				const dx = -this.spawnRadius + Math.floor(Math.random() * this.spawnRadius * 2)
				const dy = -this.spawnRadius + Math.floor(Math.random() * this.spawnRadius * 2)

				if ((dx >= -2 && dx <= 1 && dy >= -2 && dy <= 1) || (dx >= -4 && dx <= -1 && dy >= -4 && dy <= -1)) continue

				const rx = this.position[0] + dx
				const ry = this.position[1] + dy

				if (!this.context.spatial.hasEntityAt([rx, ry])){

					this.context.spatial.addEntity(`hollow`, [rx, ry])
					this.spawnedHollows++
					this.master.createHollowEvent(`#FFBB36`, 6000, `horn`, true)
					break

				}

			}

		}
		

	}

	init(){
		this.master.hellgemChunk = 512
		this.master.hollowSite = this
	}

	onDelete(){
		this.master.hellgemChunk = 64
	}

	canHit(){
		return true
	}

	onmousedown(){
		const screenxy = this.context.coordinates.uvToXYUntranslated(this.position)
		const pan = this.context.audio.getPanValueFromX(screenxy[0])
		const loudness = this.context.audio.getLoudnessFromXY(screenxy)
		this.context.audio.playSound(`horn`, pan, loudness)
		this.master.stats.strangeRockPoked++
	}

	render(dt?: number, vposition?: Vec2){

		this.sprite.render(vposition ? vposition : this.position, dt)

	}

}
