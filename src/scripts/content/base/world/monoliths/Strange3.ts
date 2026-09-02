import type { ColorTriplet, ResourceAmounts, Vec2 } from '../../../../../types/core.js'
import type { EntityHost } from '../../../../engine/entities/types.js'
import { Strange2 } from './Strange2.js'
import { Entity } from '../../../../engine/entities/Entity.js'
import { Sprite } from '../../../../sprites.js'

export class Strange3 extends Strange2{

	constructor(master: EntityHost){
		super(master)
		this.name = `strange3`

		this.spawnRadius = 8
		this.maxSpawnedHollows = 16
		this.spawnedHollows = 0
		this.spawnTimerBase = 6000
		this.spawnTimer = 20000

		this.sprite = new Sprite({
			master: this.master,
			src: `resources/images/strange3.png`,
			frames: [[0,0,936,994]],
			origins: [455,732],
			scale: 3,
			sequences: [0],
			intervals: 100
		})

		this.initHint()
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

		if (!consumed){

			for (let i = 0; i < 32; i++){

				const dx = -this.spawnRadius + Math.floor(Math.random() * this.spawnRadius * 2)
				const dy = -this.spawnRadius + Math.floor(Math.random() * this.spawnRadius * 2)

				if ((dx >= -2 && dx <= 1 && dy >= -2 && dy <= 1) || (dx >= -4 && dx <= -1 && dy >= -4 && dy <= -1)) continue

				const rx = this.position[0] + dx
				const ry = this.position[1] + dy

				if (!this.context.spatial.hasEntityAt([rx, ry])){

					this.context.spatial.addEntity(`hollow`, [rx, ry])
					this.spawnedHollows++
					break

				}

			}

		}

	}

	onmousedown(){
		const screenxy = this.context.coordinates.uvToXYUntranslated(this.position)
		const pan = this.context.audio.getPanValueFromX(screenxy[0])
		const loudness = this.context.audio.getLoudnessFromXY(screenxy)
		this.context.audio.playSound(`horn`, pan, loudness)
		this.master.stats.strangeRockPoked++

		if (this.master.pinhole && this.context.spatial.entityCount() < 3){
			this.master.watchCredits()
		}
	}

	render(dt?: number, vposition?: Vec2){

		const position = vposition ? vposition : this.position
		if (vposition) {
			this.sprite.render(position, dt)
		} else {
			let delta = Math.sin(performance.now() / 6000) * .5

			this.sprite.render([position[0] + delta, position[1] + delta], dt)
		}

	}

}
