import type { ColorTriplet, ResourceAmounts, Vec2 } from '../../../../../types/core.js'
import type { EntityHost } from '../../../../engine/entities/types.js'
import { Entity } from '../../../../engine/entities/Entity.js'
import { Sprite } from '../../../../sprites.js'

export class Generaldecay extends Entity {

	constructor(master: EntityHost){
		super(master)
		this.entityHeight = 2
		this.name = `generaldecay`
		this.maxCapacity = 1024
		this.capacity = 0
		this.resources = [0,0,0,0,0]
		this.soulPower = 4
		this.chasmNetwork = false

		this.sprite = new Sprite({
			master: this.master,
			src: `resources/images/generaldecay.png`,
			frames: [[0,0,455,875]],
			origins: [227, 743],
			scale: 1,
			sequences: [0,0],
			intervals: 100
		})

		this.initHint()
		this.initSellHint()
	}

	consume(r: number[]): void {

		for (let i = 0; i < r.length; i++){

			this.capacity += r[i]
			this.resources[i] += r[i]

		}

		if (this.capacity >= this.maxCapacity){

			const screenxy = this.context.coordinates.uvToXYUntranslated(this.position)
			const pan = this.context.audio.getPanValueFromX(screenxy[0])
			const loudness = this.context.audio.getLoudnessFromXY(screenxy)
			this.context.audio.playSound(`geiger`, pan, loudness)

			
			if (this.master.chasm && (this.master.chasm as { chasmNetwork?: unknown }).chasmNetwork === this.chasmNetwork){
				this.context.effects.createChasmTransfer(this.resources, [...(this.chasmPath || []), this.position].reverse() as unknown as Vec2)
			} else {
				this.context.effects.createResourceTransfer(this.resources, screenxy, screenxy, false, [0,0])
			}
			
			this.resources = [0,0,0,0,0]
			this.capacity = 0

		}

	}

	onDelete(): void {
		delete this.master.generaldecay
	}

	init(): void {
		this.master.generaldecay = this
		;(this.master.chasm as unknown as { updateChain?: () => void })?.updateChain?.()
	}

	render(dt?: number, vposition?: Vec2): void {
		this.sprite.renderState(vposition ? vposition : this.position, this.capacity > 0 ? 1 : 0)
	}
}
