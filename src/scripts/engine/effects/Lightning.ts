import { Bezier } from '../../bezier.js'
import { VFX } from './VFX.js'
import type { EffectHost, LightningPayload } from './types.js'

// The fallback branches intentionally retain the legacy unresolved identifier.
declare const i: number

export class Lightning extends VFX {
	declare color: string
	declare resources: number[]
	declare path: Bezier

	constructor(master: EffectHost, payload: LightningPayload){

		super(master, payload)

		this.color = payload.color || `#FFF`

		const force = 4 * this.master.unit
		this.resources = payload.resources
		this.maxEndTime = 100 + Math.random() * 200

		const rd = payload?.destination ? payload.destination : this.master.resourceHomes[i]
		const rp = payload?.source ? payload.source : this.master.resourceHomes[i]
		const curve = new Bezier([
			[rp[0], rp[1]], 
			[rp[0] + force * (Math.random() * 2 - 1), rp[1] + force * (Math.random() * 2 - 1)],
			[rd[0] + force * (Math.random() * 2 - 1), rd[1] + force * (Math.random() * 2 - 1)],
			[rd[0], rd[1]]
			])
		
		this.path = curve
		this.oncomplete = payload?.f ? payload.f : (_value?: unknown)=>{this.master.addResourcesFromArray(payload.resources)}
		this.time = 0
		
	}

	render(){

		if (this.visibility[this.master.plane]){

			const t = this.time / this.maxEndTime

			this.master.ctx.strokeStyle = this.color
			this.master.ctx.lineCap = `round`
			this.master.ctx.lineWidth = (1 - t) * this.master.pixelRatio * 4
			this.master.ctx.beginPath()
			const p0 = this.path.getXY(0)
			this.master.ctx.moveTo(p0[0], p0[1])
			for (let f = .05; f <= 1; f+=.05){
				const p = this.path.getXY(f)
				const r1 = (Math.random() * 2 - 1) * this.master.unit * .1
				const r2 = (Math.random() * 2 - 1) * this.master.unit * .1
				this.master.ctx.lineTo(p[0] + r1, p[1] + r2)
			}
			this.master.ctx.stroke()

			if (t < .33 && !this.master.chillMode){
				this.master.ctx.save()
				this.master.ctx.globalAlpha = (1 - t*3) * .1
				// this.master.ctx.fillStyle = `rgba(255,255,255,${(1 - t*3) * .1})`
				this.master.ctx.fillStyle = this.color
				this.master.ctx.fillRect(0,0,this.master.w,this.master.h)
				this.master.ctx.restore()

			}

		}
	}
}
