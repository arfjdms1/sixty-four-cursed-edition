import type { ColorTriplet, ResourceAmounts, Vec2 } from '../../types/core.js'
import type { EntityHost } from './types.js'
import { Flower } from './Flower.js'
import { Entity } from './Entity.js'
import { Sprite } from '../sprites.js'
import { Cloud } from '../ui.js'

export class Fruit extends Flower {

	constructor(master: EntityHost, owner?: unknown){
		super(master)
		this.name = `fruit`
		this.soulPower = 128

		this.conversion = 0
		this.baseConversionSpeed = 1e-5
		this.state = 0

		this.sprite = new Sprite({
			master: this.master,
			src: `img/fruit.png`,
			frames: [[0,0,455,480],[455,0,455,480]],
			origins: [[227,341],[227,240]],
			scale: 1,
			sequences: [[0,1]],
			intervals: 100
		})

		this.initHint()
		this.initSellHint()
	}

	getHint(): Cloud | false | undefined {
		return this.hints[1]
	}

	seed(): boolean {

		if (!this.state){
			this.state = 2//zzz
			this.conversion = 0
			return true
		}

		return false
	}

	update(dt?: number): void {

		if (this.state === 2){
			this.conversion += (this.baseConversionSpeed + (this.baseConversionSpeed * .1 * (Math.random() * 2 - 1))) * (dt || 0)
			if (this.conversion >= 1){
				this.state = 0
				const screenxy = this.master.uvToXYUntranslated(this.position)
				const pan = this.master.getPanValueFromX(screenxy[0])
				const loudness = this.master.getLoudnessFromXY(screenxy)
				this.master.createResourceTransfer(this.getResourceFromFraction(this.conversion), screenxy, screenxy)
				this.conversion = 0
				this.master.playSound(`hollow`, pan, loudness)
			}
		}

	}

	getResourceFromFraction(f: number): number[] {
		const base = f * 8
		const add = f * 8 * Math.random()
		return [0,0,0,0,0,0,0,base + add]
	}

	canHit(): boolean {
		return this.state === 2
	}

	init(): void {
		this.master.fruits.add(this)
	}

	onmousedown(): void {
		if (this.state === 2){

			this.state = 0
			const screenxy = this.master.uvToXYUntranslated(this.position)
			const pan = this.master.getPanValueFromX(screenxy[0])
			const loudness = this.master.getLoudnessFromXY(screenxy)
			this.master.createResourceTransfer(this.getResourceFromFraction(this.conversion), screenxy, screenxy)
			this.master.playSound(`hollow`, pan, loudness)

		}
	}

	onDelete(): void {
		this.master.fruits.delete(this)
	}

	render(dt?: number, vposition?: Vec2): void {

		const position = vposition ? vposition : this.position
		this.sprite.renderState(position, 0)
		if (this.state === 2) this.sprite.renderState([position[0] - 1.3, position[1] - 1.3], 1, false, this.conversion)

	}

}
