import type { ColorTriplet, ResourceAmounts, Vec2 } from '../../../../types/core.js'
import type { EntityHost } from '../../../engine/entities/types.js'
import { Entity } from '../../../engine/entities/Entity.js'
import { Bezier } from '../../../bezier.js'
import { Stabilizer } from '../machines/stabilizers/Stabilizer.js'
import { Cloud } from '../../../ui.js'

interface SurgeRay {
	originOffset: Vec2
	endControlOffset: Vec2
	height: number
	color: string
	r: number
	s: number
	dr: number
	rs: number
	reach: number
}

export class Surge extends Entity{
	declare rays: SurgeRay[]

	constructor(master: EntityHost, args?: unknown){
		super(master)
		this.name = `surge`
		this.soulPower = 8
		this.resources = (args as { resources?: number[] })?.resources || []
		this.grade = (args as { grade?: number })?.grade || 0 || 0
		this.rayNumber = (args as { rayNumber?: number })?.rayNumber || 0
		this.colors = (args as { colors?: ColorTriplet })?.colors || ["#fff","#fff","#fff"]
		this.type = (args as { type?: number })?.type || 0
		this.indestructible = true

		this.maxHarvestTimer = 400
		this.harvestTimer = 400
		this.harvestProgression = 0
		this.mouseDistance = Infinity
		const life = 12000 + Math.random() * 28000
		this.maxLifeTimer = (args as { maxLife?: number })?.maxLife || life
		this.lifeTimer = (args as { life?: number })?.life || life
		this.ripeTime = 1000
		this.ripeTimer = 0
		this.ripe = 0

		this.done = false

	}

	override getHint(): Cloud | false | undefined { return false }

	init(){

		const n = this.getNeighbours()
		
		for (let i = 0; i < n.length; i++){
			const cell = n[i];
			if (cell && cell instanceof Stabilizer){
				cell.init();
			}
		}

	}

	setPosition(uv: Vec2){

		this.position = uv

		this.rays = []
		for (let i = 0; i < this.rayNumber; i++){

			const originOffset: Vec2 = [Math.random() * .4 - .2, Math.random() * .4 - .2]

			const endControlAngle = Math.random() * Math.PI * 2
			const endControlRadius = Math.random() * 3
			const endControlOffset: Vec2 = [Math.cos(endControlAngle) * endControlRadius, Math.sin(endControlAngle) * endControlRadius]
			
			const height = Math.random() * 2
			const color = `#000`

			const rad = Math.random() * 2 - 1
			const sp = Math.random() * 2 - 1

			const p = this.context.coordinates.uvToXY(this.position)
			const u = this.master.unit

			this.rays.push({
				originOffset: originOffset,
				endControlOffset: endControlOffset,
				height: height, 
				color: this.colors[Math.floor(Math.random() * this.colors.length)],
				r: rad,
				s: sp,
				dr: Math.random(),
				rs: Math.random(),
				reach: .5 + Math.random()
			})

		}

		return this

	}

	onDelete(){
		if (this.stabilizer){
			(this.stabilizer as { surge?: unknown; init?: () => void }).surge = false;
			(this.stabilizer as { surge?: unknown; init?: () => void }).init?.();
		}
	}

	update(dt?: number){

		
		if (this.ripe < 1){
			if (dt) this.ripeTimer += dt
			this.ripe = this.ripeTimer / this.ripeTime
			if (this.ripe >= 1){
				this.ripe = 1
			}
		}

		if (this.stabilizer){

			if (dt) if (dt) this.lifeTimer -= dt * ((this.stabilizer as { stabilization?: number })?.stabilization || 1)

		} else {

			if (dt) if (dt) this.lifeTimer -= dt

			const mUV = this.master.xyToUV(this.master.mouse.offsetxy)
			this.mouseDistance = ((this.position[0] - mUV[0]) ** 2 + (this.position[1] - mUV[1]) ** 2) ** .5

			if (this.mouseDistance < .75 || this.harvestProgression){
				if (!this.harvestProgression){
					const pan = this.context.audio.getPanValueFromX(this.context.coordinates.uvToXYUntranslated(this.position)[0])
					this.context.audio.playSound(`collect`, pan, .4)
				}
				if (dt) if (dt) this.harvestTimer -= dt
				this.harvestProgression = 1 - this.harvestTimer / this.maxHarvestTimer
			}

			if (this.harvestProgression >= 1 && !this.killme){
				this.harvestProgression = 1
				this.killme = true
				this.context.effects.createResourceTransfer(this.resources, this.master.mouse.xy)

				const pan = this.context.audio.getPanValueFromX(this.context.coordinates.uvToXYUntranslated(this.position)[0])
				for (let i = 0; i < this.resources.length; i++){
					if (this.resources[i]){
						this.context.audio.playSound(this.master.codex.resources[i].sfx, pan, 1)
						this.context.audio.playSound(`lightning`, pan, .4)
					}
				}
			}

		}

		if (this.lifeTimer <= 0){
				this.killme = true
			this.context.effects.createResourceExplosion(this.resources, this.context.coordinates.uvToXYUntranslated(this.position))

			const screenxy = this.context.coordinates.uvToXYUntranslated(this.position)
			const pan = this.context.audio.getPanValueFromX(screenxy[0])
			const loudness = this.context.audio.getLoudnessFromXY(screenxy)
			this.context.audio.playSound(`lightning`, pan, loudness * .2)
		}

	}

	render(dt?: number, vposition?: Vec2){

		const ctx = this.master.ctx
		const p = this.context.coordinates.uvToXY(this.position)

		ctx.lineWidth = this.master.pixelRatio * 2

		if (this.rays && !this.done){
			const t = this.master.time.lt / 600
			for (let i = 0; i < this.rays.length; i++){

				const r = this.rays[i] as SurgeRay
				const u = this.master.unit

				ctx.strokeStyle = r.color
				ctx.beginPath()

				// ctx.stroke()
				const rr = r.r + Math.cos(t * r.rs) * r.dr
				const endXY_a = [this.position[0] + Math.cos(t * r.s) * rr, this.position[1] + Math.sin(t * r.s) * rr]
				const mouseUV = this.master.xyToUV(this.master.mouse.offsetxy)
				const endXY_b = this.stabilizer ? (((this.stabilizer as { attractorPosition?: Vec2 }).attractorPosition) || [0, 0]) : [mouseUV[0] - .5, mouseUV[1] - .5]
				const d = ((endXY_b[0] - this.position[0]) ** 2 + (endXY_b[1] - this.position[1]) ** 2) ** .5
				const f = this.stabilizer ? 0 : this.harvestProgression > 0 ? 0 : Math.min(Math.max(0, (d * r.reach - 1) / 2), 1)

				const endXY = [endXY_a[0] * f + endXY_b[0] * (1-f), endXY_a[1] * f + endXY_b[1] * (1-f)]
				const endShift = [-r.height * f + r.endControlOffset[0] * (1 - f), -r.height * f + r.endControlOffset[1] * (1 - f)]

				const line = new Bezier([
					[this.position[0] + r.originOffset[0], this.position[1] + r.originOffset[1]],
					[this.position[0] + r.originOffset[0] - r.height, this.position[1] + r.originOffset[1] - r.height],
					[endXY[0] + endShift[0], endXY[1] + endShift[1]],
					[endXY[0], endXY[1]]
				])

				for (let j = this.harvestProgression || 0; j <= (this.ripe || 0); j+=.1){

					const xy = this.context.coordinates.uvToXY(line.getXY(j))
					if (j%1) {
						xy[0] += (Math.random() * 2 - 1) * u * (.02 + f * .04)
						xy[1] += (Math.random() * 2 - 1) * u * (.02 + f * .04)
					}
					ctx.lineTo(xy[0], xy[1])
				}

				ctx.stroke()

			}
		}

		// ctx.fillStyle = `#F00`
		// ctx.beginPath()
		// ctx.arc(p[0], p[1], this.master.unit / 4, 0, Math.PI * 2)
		// ctx.closePath()
		// ctx.fill()

	}

}
