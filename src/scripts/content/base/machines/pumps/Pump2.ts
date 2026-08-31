import type { ColorTriplet, ResourceAmounts, Vec2 } from '../../../../../types/core.js'
import type { EntityHost } from '../../../../engine/entities/types.js'
import { Pump } from './Pump.js'
import { Entity } from '../../../../engine/entities/Entity.js'
import { Sprite } from '../../../../sprites.js'
import { Cube } from '../../entities/Cube.js'
import { Valve } from '../channels/Valve.js'

export class Pump2 extends Pump{

	constructor(master: EntityHost){
		super(master)
		this.soe = [[0,-1], [1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-2],[1,-2],[2,-2],[2,-1],[2,0],[2,1],[2,2],[1,2],[0,2],[-1,2],[-2,2],[-2,1],[-2,0],[-2,-1],[-2,-2],[-1,-2]]
		this.basePumpSpeed = .08
		this.pumpSpeed = this.basePumpSpeed
		this.soulPower = 2

		//Glory Stuff
		this.timeStamp = performance.now()
		this.passed6400 = false

		this.name = `pump2`

		this.spoolupSpeed = 1e-3
		this.spooldownSpeed = 4e-4

		this.digSpeed = .08

		this.sprite = new Sprite({
			master: this.master,
			src: `resources/images/channel2.png`,
			mask: [0,0,455,466],
			frames: [[0,0,455,463],[455,0,455,463],[910,0,455,463],[1365,0,455,463],[1820,0,455,463],[2275,0,455,463],[2730,0,455,463],[3185,0,455,463]],
			origins: [227, 332],
			scale: 1,
			sequences: [0,1,2,3,4,5,6,7],
			intervals: 100
		})

		this.initSellHint()

	}

	init(){
		this.master.stats.excavatorWasBuilt = true
		this.master.pumps.add(this)
		this.checkForModifiers()
	}

	onDelete(){
		this.master.stats.excavatorWasBuilt = true
		this.master.pumps.delete(this)
	}

	update(dt?: number){

		if (this.surgeTimer){

			if (dt) this.surgeTimer -= dt
			if (this.surgeTimer < 0){
				this.surgeTimer = 0
			}
			this.surgeBoost = (this.surgeTimer / this.surgeMaxTime) ** 2 * 8

		}

		let work = false
		if ((this.master.hoveredEntity as unknown) !== this) this.onmouseup()

		//Check aux pumps for initiating
		let totalspeed = this.active ? this.pumpSpeed : 0
		let auxSpeed = 0
		let activeAuxes = []
		if (this.auxes?.length){
			for (let i = 0; i < this.auxes.length; i++){
				// totalspeed += this.auxes[i].tap(0) * this.pumpSpeed
				const aux = this.auxes[i] as { tap?: (n: number) => number } | undefined;
				const ping = aux?.tap?.(0) || 0;
				if (ping) {
					activeAuxes.push(this.auxes[i])
					if (!this.active) auxSpeed = Math.max(ping, auxSpeed)
				}
			}
		}
		totalspeed += (auxSpeed + this.surgeBoost) * this.pumpSpeed

		if (totalspeed){

			work = true

			//Spooling?
			if (this.spoolup < 1){
				this.spoolup = Math.min(1, this.spoolup + this.spoolupSpeed * (dt || 0))
				if (!this.active){
					for (let i = 0; i < activeAuxes.length; i++){
						(activeAuxes[i] as { tap?: (n: number) => number })?.tap?.((dt || 0) / activeAuxes.length)
					}
				}
			} else {
				const spotIds = []
				let cubes = []

				//Check for existing cubes
				for (let i = 0; i < this.soe.length; i++){

					// const cell = this.master.stuffMap[`u${this.position[0] + this.soi[i][0]}v${this.position[1] + this.soi[i][1]}`]
					const p: Vec2 = [this.position[0] + this.soe[i][0], this.position[1] + this.soe[i][1]]
					const cell = this.master.entityAtCoordinates(p)

					if (cell && cell instanceof Cube && cell.state === 0 && cell.pump === this){
						cubes.push(cell)
					//Preventing aux lock for building
					} else if (!cell && !(this.master.itemInHand && ((this.master.hoveredCell as Vec2)[0]) === p[0] && ((this.master.hoveredCell as Vec2)[1]) === p[1])){
						spotIds.push(i)
					}

				}

				//Update cubes
				if (cubes.length){
					const quantity = totalspeed / cubes.length * (dt || 0)
					for (let i = 0; i < cubes.length; i++){
						this.pumpTo(cubes[i] as { accept?: (q: number) => boolean }, quantity)
					}
					if (!this.active){
						for (let i = 0; i < activeAuxes.length; i++){
							(activeAuxes[i] as { tap?: (n: number) => number })?.tap?.((dt || 0) / activeAuxes.length)
						}
					}
				
				//Or initiating new
				} else if (spotIds.length){

					const id = spotIds[Math.floor(Math.random() * spotIds.length)]
					const spotPosition: Vec2 = [this.position[0] + this.soe[id][0], this.position[1] + this.soe[id][1]]
					const resources = []
					for (let r = 0; r < 64; r++){
						resources.push(this.getResource())
					}
					this.master.addEntity(`cube`, spotPosition, {pump: this, resources: resources})
					this.master.processMousemove()
					// if (pumpactive) this.auxpump.tap(dt)

				} else {
					work = false
				}
			}


		} else {

			//Check for valve
			this.hold = false

			if (this.spoolup){
				for (let i = 0; i < this.soi.length; i++){

					// const cell = this.master.stuffMap[`u${this.position[0] + this.soi[i][0]}v${this.position[1] + this.soi[i][1]}`]
					const cell = this.master.entityAtCoordinates([this.position[0] + this.soi[i][0], this.position[1] + this.soi[i][1]] as Vec2)

					if (cell && cell instanceof Valve && cell.state === 2){
						(cell as unknown as { tap?: (d?: number) => void })?.tap?.(dt)
						this.hold = true
						break
					}

				}
			}

			if (!this.hold){
				this.spoolup = Math.max(0, this.spoolup - this.spooldownSpeed * (dt || 0))
			}

		}

		if (work){
			if (!this.sfxPlaying){
				const screenxy = this.master.uvToXYUntranslated(this.position)
				const pan = this.master.getPanValueFromX(screenxy[0])
				const loudness = this.master.getLoudnessFromXY(screenxy)
				this.sfxPlaying = this.master.startSound(`rumble`, pan, loudness)
			}
		} else {
			if (this.sfxPlaying){
				this.master.stopSound(this.sfxPlaying, 3)
				delete this.sfxPlaying
			}
		}

		if (!this.passed6400 && this.depth >= 640){
			this.passed6400 = true
			if (Math.abs(performance.now() - (this.timeStamp || Infinity)) < 360000) this.master.got64kmphAchievement = true
		}

	}

}
