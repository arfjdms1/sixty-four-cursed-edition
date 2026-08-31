import type { Vec2 } from '../../../types/core.js'
import { VFX } from './VFX.js'
import type { EffectHost, ExhaustPayload } from './types.js'

export class Exhaust extends VFX {
	declare uv: Vec2
	declare shift: Vec2
	declare maxRadius: number
	declare color: string

	constructor(master: EffectHost, payload?: ExhaustPayload){

		super(master, payload)

		this.time = 0
		this.maxEndTime = 220
		this.uv = payload?.uv || [0,0]
		this.shift = [(Math.random() * 2 - 1) * this.master.unit * .2, (Math.random() * 2 - 1) * this.master.unit * .2]
		this.maxRadius = (.6 + Math.random() * .8) * this.master.unit
		this.color = payload?.color || `#EEE`

	}

	render(){

		if (this.visibility[this.master.plane]){

			const f = (this.time / this.maxEndTime)
			const r1 = f ** .3 * this.maxRadius
			const r2 = Math.max(0, (f - .3333) * 1.3) ** .4 * this.maxRadius
			const p = this.master.uvToXYUntranslated(this.uv)

			const ctx = this.master.ctx

			ctx.fillStyle = this.color

			ctx.beginPath()
			ctx.arc(p[0], p[1], r1, 0, Math.PI * 2)
			// ctx.closePath()

			// ctx.beginPath()
			ctx.arc(p[0], p[1], r2, 0, Math.PI * 2)
			ctx.closePath()

			ctx.fill(`evenodd`)

		}

	}
}
