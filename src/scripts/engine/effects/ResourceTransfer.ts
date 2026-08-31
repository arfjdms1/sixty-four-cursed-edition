import { Bezier } from '../../bezier.js'
import { VFX } from './VFX.js'
import type { EffectHost, ResourceTransferPayload } from './types.js'

export class ResourceTransfer extends VFX {
	declare resources: number[]
	declare quantities: number[]
	declare paths: Bezier[]
	declare endTimes: number[]

	constructor(master: EffectHost, payload: ResourceTransferPayload){

		super(master, payload)

		//payload:
		//force, resources, source, destination, skip analytics

		const force = (payload?.force || 9) * this.master.unit
		const endRange = this.master.resourceTransferType < 2 ? [900,1500] : [100,600]
		const paths = []
		const resources = []
		const endTimes = []
		const quantities = []
		let maxEndTime = 0

		if (this.master.resourceTransferType < 3){

			for (let i = 0; i < payload.resources.length; i++){

				if (payload.resources[i]){

					const max = Math.min(payload.resources[i], this.master.renderLimitOfAKind)
					const rd = payload?.destination ? payload.destination : this.master.resourceHomes[i]
					const rp = payload?.source ? payload.source : this.master.resourceHomes[i]

					for (let j = 0; j < max; j++){

						const curve = new Bezier([
							[rp[0], rp[1]], 
							[rp[0] + force * (Math.random() * 2 - 1), rp[1] + force * (Math.random() * 2 - 1)],
							[rd[0] + force * .1 * (Math.random() * 2 - 1), rd[1] + force * .1 * (Math.random() * 2 - 1)], 
							[rd[0], rd[1]]
						])
						const span = [endRange[1] - endRange[0]]
						const endTime = endRange[0] + Math.random() * span[0]
						paths.push(curve)
						resources.push(i)
						quantities.push(1)
						endTimes.push(endTime)
						maxEndTime = Math.max(maxEndTime, endTime)
						
					}
				}

			}
		} else {
			for (let i = 0; i < payload.resources.length; i++){

				if (payload.resources[i]){

				const rd = payload?.destination ? payload.destination : this.master.resourceHomes[i]
				const rp = payload?.source ? payload.source : this.master.resourceHomes[i]

				const curve = new Bezier([
					[rp[0], rp[1]], 
					[rp[0] + force * (Math.random() * 2 - 1), rp[1] + force * (Math.random() * 2 - 1)],
					[rd[0] + force * (Math.random() * 2 - 1), rd[1] + force * (Math.random() * 2 - 1)],
					[rd[0], rd[1]]
					])
				const endTime = endRange[0] + Math.random() * (endRange[1] - endRange[0])
				paths.push(curve)
				resources.push(i)
				quantities.push(payload.resources[i])
				endTimes.push(endTime)
				maxEndTime = Math.max(maxEndTime, endTime)
					
				}

			}
		}


		this.resources = resources
		this.quantities = quantities
		this.paths = paths
		this.endTimes = endTimes
		this.maxEndTime = maxEndTime
		this.oncomplete = payload?.f ? payload.f : (_value?: unknown)=>{this.master.addResourcesFromArray(payload.resources, payload.skip)}
		this.time = 0
		
	}

	render(){

		if (this.visibility[this.master.plane]){

			for (let j = 0; j < this.resources.length; j++){

				
				let f = (this.time / this.endTimes[j]) ** .6
				if (f <= 1){

					if (this.master.resourceTransferType === 0){

						const coords = this.paths[j].getXY(f)
						this.master.drawResourceInScreenCoordinates(this.resources[j], coords)

					} else {
				
						const from = Math.max(0, f - .05)
						const to = Math.min(1, f + .05)
						const q = this.quantities ? this.quantities[j] : 1

						const b = this.paths[j]
						this.master.ctx.strokeStyle = this.master.codex.resources[this.resources[j]].triplet[j%3]
						this.master.ctx.lineCap = `round`
						this.master.ctx.lineWidth = (.5 + (1-f) * .5) * this.master.pixelRatio * 4 * (this.master.resourceTransferType < 3 ? 1 : .5 + 5 * Math.min(1, q / 256))
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
}
