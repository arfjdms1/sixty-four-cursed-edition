import type { ColorTriplet, ResourceAmounts, Vec2 } from '../../../../../types/core.js'
import type { EntityHost } from '../../../../engine/entities/types.js'
import { Entity } from '../../../../engine/entities/Entity.js'
import { Sprite } from '../../../../sprites.js'

export class Silo extends Entity{

	constructor(master: EntityHost){
		super(master)
		this.name = `silo`
		this.fill = 0
		this.state = 0
		this.fuel = [0,256,0,0,2]
		this.dive = 0
		this.diveSpeed = 1e-3
		this.bubbleSpeed = 5e-4
		this.soulPower = .5
		this.chasmNetwork = false
		this.freeTimer = 100

		this.sprite = new Sprite({
			master: this.master,
			src: `resources/images/silo.png`,
			frames: [[0,0,455,594],[455,0,455,594],[910,0,455,594],[1365,0,455,594],[1820,0,455,594],[2275,0,455,594],[0,594,455,594],[455,594,455,594],[910,594,455,594],[1365,594,455,594],[1820,594,455,594],[2275,594,455,594]],
			origins: [226,462],
			scale: 1,
			sequences: [0,1,2,3,4,5,6,7,8,9,10,11],
			intervals: 60
		})

		this.initHint()
		this.initSellHint()

	}

	init(){

		for (let i = 0; i < this.soi.length; i++){
			const cell = this.context.spatial.entityAt([this.position[0] + this.soi[i][0], this.position[1] + this.soi[i][1]])
			if (cell && cell instanceof Silo){
				this.master.perpetum = true
				break
			}

		}

	}


	tap(){
		if (this.freeTimer <= 0){
			this.fill -= .0625
			if (this.fill <= 0){
				this.fill = 0
				if (this.state === 2) {
					const screenxy = this.context.coordinates.uvToXYUntranslated(this.position)
					const pan = this.context.audio.getPanValueFromX(screenxy[0])
					const loudness = this.context.audio.getLoudnessFromXY(screenxy)
					this.context.audio.playSound(`silo2`, pan, loudness)
					this.shootExhaust()
				}
				this.state = 4 //Bubbling
			}
			this.freeTimer = 200
		}
	}


	update(dt?: number){

		if (this.state === 0 && this.chasmNetwork && this.chasmNetwork === (this.master.chasm as { chasmNetwork?: unknown })?.chasmNetwork) {
			
			const good = this.refill()
			if (good){
				this.context.effects.createChasmTransfer(this.fuel, [...this.chasmPath, this.position], (_?: unknown) => {})
			}
		}

		if (this.state === 2){

			this.dive = 1
			if (this.freeTimer > 0) if (dt) if (dt) this.freeTimer -= dt

			for (let i = 0; i < this.soi.length; i++){

				const cell = this.context.spatial.entityAt([this.position[0] + this.soi[i][0], this.position[1] + this.soi[i][1]])
				if (cell && cell.canHit() && (cell as unknown as { refill?: () => void }).refill && !(cell as unknown instanceof Silo)){

					const request = cell.fuel
					let ok = true
					for (let j = 0; j < cell.fuel.length; j++){
						if (cell.fuel[j] && this.context.resources.amountByLegacyIndex(j) < cell.fuel[j]){
							ok = false
							break
						}
					}
					if (ok){

						cell.refill?.()
						this.tap()

					}

				}

			}

		} else if (this.state === 3){

			//Diving
			if (dt) this.dive += this.diveSpeed * dt
			if (this.dive >= 1){
				this.state = 2
				this.freeTimer = 100
			}

		} else if (this.state === 4){

			//Bubbling
			if (dt) this.dive -= this.bubbleSpeed * dt
			if (this.dive <= 0){
				this.dive = 0
				this.state = 0
			}

		}
	}

	onmousedown(){

		this.refill()

	}

	refill(){
		if (this.state === 0){

			const resources = this.context.resources.requestResources?.(this.fuel!, this.position, (_?: unknown) => {
				this.activate()
			})

			if (resources) {

				this.state = 1
				return true
			}

		}

		return false
	}

	activate(){
		const screenxy = this.context.coordinates.uvToXYUntranslated(this.position)
		const pan = this.context.audio.getPanValueFromX(screenxy[0])
		const loudness = this.context.audio.getLoudnessFromXY(screenxy)
		this.context.audio.playSound(`silo`, pan, loudness)

		this.fill = 1
		this.state = 3
	}

	render(dt?: number, vposition?: Vec2){

		this.sprite.renderState(vposition ? vposition : this.position, this.dive)

	}

}
