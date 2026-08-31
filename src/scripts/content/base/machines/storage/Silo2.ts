import type { ColorTriplet, ResourceAmounts, Vec2 } from '../../../../../types/core.js'
import type { EntityHost } from '../../../../engine/entities/types.js'
import { Silo } from './Silo.js'
import { Entity } from '../../../../engine/entities/Entity.js'
import { Sprite } from '../../../../sprites.js'

export class Silo2 extends Silo{

	constructor(master: EntityHost){
		super(master)
		this.name = `silo2`
		this.fuel = [0,1024,0,0,8,16]
		this.diveSpeed = 2e-3
		this.bubbleSpeed = 1e-3
		this.soulPower = 1

		this.sprite = new Sprite({
			master: this.master,
			src: `resources/images/silo2.png`,
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
			const cell = this.master.entityAtCoordinates([this.position[0] + this.soi[i][0], this.position[1] + this.soi[i][1]])
			if (cell && cell instanceof Silo){
				this.master.perpetum = true
				break
			}

		}

		(this.master.chasm as unknown as { updateChain?: () => void })?.updateChain?.()

	}

	tap(){
		if (this.freeTimer <= 0){
			this.fill -= .015625
			if (this.fill <= 0){
				this.fill = 0
				if (this.state === 2) {

					const screenxy = this.master.uvToXYUntranslated(this.position)
					const pan = this.master.getPanValueFromX(screenxy[0])
					const loudness = this.master.getLoudnessFromXY(screenxy)
					this.master.playSound(`silo2`, pan, loudness)
					this.shootExhaust()

					this.shootExhaust()
				}
				this.state = 4 //Bubbling
			}
			this.freeTimer = 200
		}

	}

}
