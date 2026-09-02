import type { ColorTriplet, ResourceAmounts, Vec2 } from '../../../../../types/core.js'
import type { EntityHost } from '../../../../engine/entities/types.js'
import { Entity } from '../../../../engine/entities/Entity.js'
import { Sprite } from '../../../../sprites.js'
import { Destabilizer } from '../destabilizers/Destabilizer.js'
import { Destabilizer2a } from '../destabilizers/Destabilizer2a.js'

export class Gradient extends Entity{

	constructor(master: EntityHost){
		super(master)
		this.name = `gradient`
		this.soulPower = 0

		this.maxFlashTimer = 1000
		this.flashTimer = this.maxFlashTimer + Math.random() * this.maxFlashTimer

		this.base = 4096
		// this.gradient = [mult * 0.10416666666666667, mult * 0.020833333333333332, mult * 0.03125, mult * 0.20833333333333334, 0, mult * 0.010416666666666666, mult * 0.625]//[10,2,3,20,0,1,60]

		this.sprite = new Sprite({
			master: this.master,
			src: `resources/images/gradient.png`,
			frames: [[0,0,468,540]],
			origins: [234,408],
			scale: 1,
			sequences: [0],
			intervals: 100
		})

		this.initHint()
		this.initSellHint()
	}

	getDiscrete(mult: number): number[] {
		return [this.base * mult * 0.10416666666666667, this.base * mult * 0.020833333333333332, this.base * mult * 0.03125, this.base * mult * 0.20833333333333334, 0, 0, this.base * mult * 0.625]
		// return [this.base * mult * 0.10416666666666667, this.base * mult * 0.020833333333333332, this.base * mult * 0.03125, this.base * mult * 0.20833333333333334, 0, this.base * mult * 0.010416666666666666, this.base * mult * 0.625]
	}

	tap(power: number): void {

		let acc = 0

		for (let i = 0; i < this.destabilizers.length; i++){
			const d = this.destabilizers[i]
			if (d.state === 2){
				acc += d.tap(power)
			}
		}

		power *= (1 + acc)
		const r = this.getDiscrete(power)
		const scoords = this.context.coordinates.uvToXYUntranslated(this.position)
		this.context.effects.createChasmTransfer(scoords, (this.chasmPath ? [...this.chasmPath, this.position] : [this.position]).reverse()[0])
		// this.context.resources.addResourcesFromArray(r)

	}

	update(dt?: number){

		if (dt) this.flashTimer -= dt

		if (this.flashTimer <= 0){
			this.flashTimer = this.maxFlashTimer + Math.random() * this.maxFlashTimer

			const entities = this.context.spatial.entities()
			const entity = entities[Math.floor(Math.random() * entities.length)]
			
			if (entity && entity.soul === 1){

				const exy = this.context.coordinates.uvToXYUntranslated(entity.position)
				const gxy = this.context.coordinates.uvToXYUntranslated(this.position)

				if (this.context.plane.plane){
					const pan = this.context.audio.getPanValueFromX(gxy[0])
					const loudness = Math.max(this.context.audio.getLoudnessFromXY(exy), this.context.audio.getLoudnessFromXY(gxy))
					this.context.audio.playSound(`lightning`, pan, loudness, true)

				}

				entity.soul = 0
				this.context.effects.createLightning([0,0,0,0,0,0,0,0,0,entity.soulPower], exy, gxy, false, [0,1])
			}

		}

	}

	init(){

		this.destabilizers = []
		for (let i = 0; i < this.soi.length; i++){

			const cell = this.context.spatial.entityAt([this.position[0] + this.soi[i][0], this.position[1] + this.soi[i][1]])

			if (cell && cell instanceof Destabilizer && !(cell instanceof Destabilizer2a)) {
				this.destabilizers.push(cell)
			}

		}

		(this.master.chasm as unknown as { updateChain?: () => void })?.updateChain?.()

	}

	onDelete(){

		// this.master.showUnfilled = false

	}

	render(dt?: number, vposition?: Vec2){

		this.sprite.render(vposition ? vposition : this.position)

	}

	darkrender(dt?: number, vposition?: Vec2){

		// this.sprite.render(vposition ? vposition : this.position)
		const ctx = this.context.render.ctx

		const height = 3
		const hy = height * this.context.render.unit
		const dx = 1 * .866 * this.context.render.unit
		const dy = 1 * .5 * this.context.render.unit

		const color = ctx.createLinearGradient(0,-dy,0,-hy)
		color.addColorStop(0, `#FFF`)
		color.addColorStop(1, `#FFF0`)
		ctx.fillStyle = color

		ctx.save()
		const xy = this.context.coordinates.uvToXY(this.position)
		ctx.translate(xy[0], xy[1])

		ctx.beginPath()
		ctx.moveTo(0, -hy - dy)
		ctx.lineTo(dx, -hy)
		ctx.lineTo(dx, 0)
		ctx.lineTo(0, dy)
		ctx.lineTo(-dx, 0)
		ctx.lineTo(-dx, -hy)
		ctx.closePath()
		ctx.fill()

		const gradient = ctx.createRadialGradient(0,0,0,0,0,this.context.render.unit * 2)
		gradient.addColorStop(0,`#FFF9`)
		gradient.addColorStop(1,`#FFF0`)
		ctx.fillStyle = gradient
		ctx.beginPath()
		ctx.arc(0,0,this.context.render.unit * 2,0,Math.PI * 2)
		ctx.closePath()
		ctx.fill()

		ctx.restore()

	}

}
