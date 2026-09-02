import type { ColorTriplet, ResourceAmounts, Vec2 } from '../../../../types/core.js'
import type { EntityHost } from '../../../engine/entities/types.js'
import { Entity } from '../../../engine/entities/Entity.js'
import { Sprite } from '../../../sprites.js'
import { Consumer } from '../machines/industrial/Consumer.js'
import { Destabilizer } from '../machines/destabilizers/Destabilizer.js'
import { Destabilizer2a } from '../machines/destabilizers/Destabilizer2a.js'
import { Injector } from '../machines/destabilizers/Injector.js'

export class Cube extends Entity{

	constructor(master: EntityHost, misc?: unknown){

		super(master)
		this.pump = (misc as { pump?: unknown })?.pump
		this.fill = 0
		this.maxFill = 64
		this.state = 0 //0 growing, 1 transition, 2 stable, 3 exploded

		this.name = `cube`

		this.colorBlank = [`#f8f8f8`, `#fefefe`, `#e6e6e4`]
		this.reversePause = 100
		this.reverseTimer = this.reversePause
		this.reverseSpeed = .01
		this.unveilSpeed = 4e-3
		this.unveilProgress = 0
		this.broken = 0
		this.baseBreakPower = .08
		this.breakPower = this.baseBreakPower
		this.shakePower = .04

		this.destabilizers = []
		this.consumers = []

		this.resources = (misc as { resources?: number[] })?.resources || []
		this.resourceCoordinates = []
		this.resourceShifts3d = []

	}

	initHint(){}

	// drawHint(){}

	canHit(){
		return this.state === 2
	}

	onDelete(){
		this.master.activeCubes.delete(this)
	}

	onmousedown(power = 1){
		if (this.state === 2){

			const screenxy = this.context.coordinates.uvToXYUntranslated(this.position)
			const pan = this.context.audio.getPanValueFromX(screenxy[0])
			const loudness = this.context.audio.getLoudnessFromXY(screenxy)

			for (let i = 0; i < this.composition.length; i++){
				if (this.composition[i]){
					this.context.audio.playSound(this.master.codex.resources[i].sfx, pan, loudness)
				}
			}

			if (this.master.resourceTransferType < 3) this.context.effects.createResourceSpark(this.composition,screenxy)
			
			let acc = 0
			const hellgem = this.composition[4]

			for (let i = 0; i < this.destabilizers.length; i++){
				const d = this.destabilizers[i]
				if (d.state === 2 && d instanceof Destabilizer2a){
					if (hellgem) acc += d.tap(power)
				} else if (d.state === 2){
					acc += d.tap(power)
				}
			}

			//Hard resources
			const hardmult = hellgem ? .03 : 1

			this.breakPower = this.baseBreakPower * (1 + acc) * hardmult

			this.broken += this.breakPower * power

			if (this.broken >= 1){
				this.broken = 1
				this.state = 3
				this.master.activeCubes.delete(this)
				if (this.master.plane === 1) {
					this.context.effects.createExhaust(this.position, `#FFF`)
				}

				let activeConsumers = []
				for (let i = 0; i < this.consumers.length; i++){
					const c = this.consumers[i] as { state?: number } | undefined
					if (c && c.state === 2){
						activeConsumers.push(c)
					}
				}
				const consumer = activeConsumers.length > 1 ? activeConsumers[Math.floor(Math.random() * activeConsumers.length)] : activeConsumers.length > 0 ? activeConsumers[0] : false

				this.context.audio.playSound(`break`, pan, loudness)

				if (this.master.resourceTransferType < 3){
					for (let i = 0; i < this.resourceCoordinates.length; i++){
						const scoords = this.context.coordinates.uvToXYUntranslated(this.resourceCoordinates[i])
						const r = []
						r[this.resources[i]] = 1

						if (consumer){
							(consumer as unknown as { consume?: (r: number[], s: Vec2) => void })?.consume?.(r, scoords)
						} else {
							this.context.effects.createResourceTransfer(r, scoords)
						}
						
					}
				} else {
					const resources = new Array(10).fill(0)
					for (let i = 0; i < this.resources.length; i++){
						resources[this.resources[i]]++
					}
					const scoords = this.context.coordinates.uvToXYUntranslated(this.position)
					if (consumer){
						(consumer as unknown as { consume?: (r: number[], s: Vec2) => void })?.consume?.(resources, scoords)
					} else {
						this.context.effects.createResourceTransfer(resources, scoords)
					}
				}

				this.master.processMousemove()
				this.killme = true

			} else {

				for (let i = 0; i < 64; i++){

					this.resourceShifts3d[i] = [(Math.random() * 2 - 1) * this.shakePower * this.broken, (Math.random() * 2 - 1) * this.shakePower * this.broken, (Math.random() * 2 - 1) * this.shakePower * 2 * this.broken] as [number, number, number]

				}

			}
		}
	}

	init(){

		if (!this.composition){

			this.composition = []

			for (let i = 0; i < 64; i++){

				const resource = this.resources[i]
				if (!this.composition[resource]) this.composition[resource] = 0.015625; else this.composition[resource] += 0.015625

				const dx = -.385 + .25 * (i % 4)
				const dy = -.385 + .25 * (Math.floor(i/4) % 4)
				const dz = .25 * Math.floor(Math.floor(i/4) / 4)
				this.resourceCoordinates.push([this.position[0] + dx - dz, this.position[1] + dy - dz])
				this.resourceShifts3d.push([0,0,0] as [number, number, number])

			}

		}
		this.consumers = []
		this.destabilizers = []
		for (let i = 0; i < this.soi.length; i++){

			const cell = this.context.spatial.entityAt([this.position[0] + this.soi[i][0], this.position[1] + this.soi[i][1]])

			if (cell && cell instanceof Destabilizer) {
				this.destabilizers.push(cell)
			} else if (cell && cell instanceof Consumer){
				this.consumers.push(cell)
			}

		}

		if (this.state === 2){
			this.master.activeCubes.add(this)
		}

	}

	update(dt?: number){

		//DEGRADE
		if (this.state === 0 && !(this.pump as { hold?: boolean })?.hold){
			if (this.reverseTimer){

				this.reverseTimer = Math.min(0, this.reverseTimer - (dt || 0))

			} else {

				if (dt) this.fill -= (this.reverseSpeed || 1) * dt
				if (this.fill <= 0) {
					this.fill = 0
					this.context.spatial.clearCell(this.position)
				}

			}
		//UNVEIL
		} else if (this.state === 1){

			if (dt) this.unveilProgress += (this.unveilSpeed || 1) * dt
			if (this.unveilProgress >= 1){
				this.unveilProgress = 1
				this.state = 2
				this.master.processMousemove()
				this.master.activeCubes.add(this)

				//Checking for injectors
				for (let i = 0; i < this.soi.length; i++){
					const cell = this.context.spatial.entityAt([this.position[0] + this.soi[i][0], this.position[1] + this.soi[i][1]])
					if (cell && cell instanceof Injector && cell.state === 2){

						this.swapRandomResource(cell, 4)
						break
						
					}

				}

			}

		}

	}

	swapRandomResource(cell: unknown, swapResourceId: number): void{
		if (!this.composition[swapResourceId]){
			const c = cell as { tap?: (mult: number) => void; position?: Vec2 } | undefined;
			if (c && c.tap) c.tap(1)
			const swapPosition = Math.floor(Math.random() * 64)
			const resourceId = this.resources[swapPosition]

			this.resources[swapPosition] = swapResourceId
			this.composition[swapResourceId] = 0.015625
			this.composition[resourceId] -= 0.015625

			const screenxy = this.context.coordinates.uvToXYUntranslated(this.resourceCoordinates[swapPosition])
			const pan = this.context.audio.getPanValueFromX(screenxy[0])
			const loudness = this.context.audio.getLoudnessFromXY(screenxy)

			const explosionArray = []
			explosionArray[resourceId] = 1
			this.context.audio.playSound(this.master.codex.resources[resourceId].sfx, pan, loudness)
			this.context.effects.createResourceTransfer(explosionArray, screenxy, screenxy, false, [0,0])
		}
	}

	drawResources(){

			const visible = [12,13,14,3,7,11,15, 28,29,30,19,23,27,31, 44,45,46,35,39,43,47, 48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63]

			for (let id = 0; id < visible.length; id++){

				const i = visible[id]

				const dx = (Math.random() * 2 - 1) * this.broken * this.shakePower
				const dy = (Math.random() * 2 - 1) * this.broken * this.shakePower
				const dz = (Math.random() * 2 - 1) * this.broken * this.shakePower + .125

			const sprite = this.context.render.resourceSpriteByLegacyIndex(this.resources[i]);
			const rc = this.resourceCoordinates[i];
				const shift = (this.resourceShifts3d[i] || [0,0,0]) as [number, number, number];
				if (sprite && rc) sprite.render([
					rc[0] + shift[0] + dx - dz - (shift[2] || 0), 
					rc[1] + shift[1] + dy - dz - (shift[2] || 0)
				])

			}

	}

	render(){

		const ctx = this.context.render.ctx
		const unit = this.context.render.unit

		ctx.strokeStyle = `#99A`
		ctx.lineWidth = unit * .01

		if (this.state === 0){
			this.context.render.drawPrism(this.position, 1, this.fill / this.maxFill, this.colorBlank)
		} else if (this.state === 1){
			this.drawResources()
			this.context.render.ctx.save()
			this.context.render.ctx.globalAlpha = 1 - this.unveilProgress
			this.context.render.drawPrism(this.position, 1, 1, this.colorBlank)
			this.context.render.ctx.restore()
		} else if (this.state === 2){
			this.drawResources()
		}

		//DEBUG
		// this.showHitbox()

	}

	darkrender(){

		// const ctx = this.master.ctx
		// const unit = this.master.unit
		// const size = .5 * (1 - this.fill / this.maxFill)

		// ctx.fillStyle = `#FFF`
		// const xy = this.context.coordinates.uvToXY(this.position)

		// ctx.beginPath()
		// ctx.arc(xy[0], xy[1], size * unit, 0, Math.PI * 2)
		// ctx.closePath()
		// ctx.fill()

	}

	accept(q: number = 0){
		
		this.fill += q
		this.reverseTimer = this.reversePause
		if (this.fill > this.maxFill) {
			this.fill = this.maxFill
			this.state = 1
			return false
		}

		return true

	}

	ondarkhover(){}
	updateSoul(){}

}
