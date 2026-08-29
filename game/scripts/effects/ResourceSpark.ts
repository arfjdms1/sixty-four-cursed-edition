import { Bezier } from '../bezier.js'
import { VFX } from './VFX.js'
import type { EffectHost, ResourceEffectPayload } from './types.js'

export class ResourceSpark extends VFX {
	declare resources: number[]
	declare paths: Bezier[]
	declare endTimes: number[]
	declare quantities?: number[]

	constructor(master: EffectHost, payload: ResourceEffectPayload){

		super(master, payload)

		//payload:
		//resources, source

		const multiplyer = 16
		const force = this.master.unit * 2
		const endRange = [60,300]
		const paths = []
		const resources = []
		const endTimes = []

		let maxEndTime = 0

		for (let i = 0; i < payload.resources.length; i++){

			const max = Math.min(payload.resources[i] * multiplyer, this.master.renderLimitOfAKind)
			const rp = payload?.source ? payload.source : this.master.resourceHomes[i]

			for (let j = 0; j < max; j++){

				const d = [force * (Math.random() * 2 - 1), force * (Math.random() * 2 - 1)]
				const offsetA = [force * (Math.random() * 2 - 1) * .2, force * (Math.random() * 2 - 1) * .2]
				const offsetB = [force * (Math.random() * 2 - 1) * .2, force * (Math.random() * 2 - 1) * .2]

				const curve = new Bezier([
					[rp[0], rp[1]], 
					[rp[0] + offsetA[0], rp[1] + offsetA[0]],
					[rp[0] + d[0] + offsetB[0], rp[1] + d[1] + offsetB[1]], 
					[rp[0] + d[0], rp[1] + d[1]]])
				const endTime = endRange[0] + Math.random() * ([endRange[1] - endRange[0]] as unknown as number)
				paths.push(curve)
				resources.push(i)
				endTimes.push(endTime)
				maxEndTime = Math.max(maxEndTime, endTime)
				
			}
		}

		this.resources = resources
		this.paths = paths
		this.endTimes = endTimes
		this.maxEndTime = maxEndTime
		this.time = 0

	}

	render(){

		if (this.visibility[this.master.plane]){

			for (let j = 0; j < this.resources.length; j++){

				

					const f = (this.time / this.endTimes[j]) ** .6
					if (f <= 1){
					
						const from = Math.max(0, f - .05)
						const to = Math.min(1, f + .05)
						const q = this.quantities ? this.quantities[j] : 1

						const b = this.paths[j]
						this.master.ctx.strokeStyle = this.master.codex.resources[this.resources[j]].triplet[j%3]
						this.master.ctx.lineCap = `round`
						this.master.ctx.lineWidth = (.5 + (1-f) * .5) * this.master.pixelRatio * 4
						this.master.ctx.beginPath()
						const p0 = b.getXY(from)
						this.master.ctx.moveTo(p0[0], p0[1])
						for (let f = from + .02; f < to; f+=.02){
							const p = b.getXY(f)
							this.master.ctx.lineTo(p[0], p[1])
						}
						this.master.ctx.stroke()

					}

				
				

			}

		}
	}
}
