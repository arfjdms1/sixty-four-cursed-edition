import type { Vec2 } from '../../types/core.js'
import { VFX } from './VFX.js'
import type { ChasmTransferPayload, EffectHost } from './types.js'

export class ChasmTransfer extends VFX {
	declare resources: number[]
	declare path: Vec2[]

	constructor(master: EffectHost, payload: ChasmTransferPayload){

		super(master, payload)

		this.resources = payload.resources
		this.maxEndTime = 100 + Math.random() * 200
		this.path = payload.path
		this.oncomplete = payload?.f ? payload.f : (_value?: unknown)=>{this.master.addResourcesFromArray(payload.resources)}
		this.time = 0

		// for (let i = 0; i < this.path.length; i++){
		// 	this.path[i][0] += (Math.random() * 2 - 1) * this.master.unit * .2
		// 	this.path[i][1] += (Math.random() * 2 - 1) * this.master.unit * .2
		// }
		
	}

	render(){

		if (this.visibility[this.master.plane] && this.path.length > 1){

			const deviance = .05
			const delta = 2
			const t = this.time / this.maxEndTime
			const center = (this.path.length - 1) * t

			const ctx = this.master.ctx

			ctx.lineCap = `round`
			ctx.lineWidth = Math.max(0, (1 - Math.abs(.5 - t) * 2)) ** 4 * this.master.pixelRatio * 8

			let xyf: Vec2, xyl: Vec2
			const idf = Math.max(Math.floor(center - delta), 0)
			const fromStart = idf === 0
			if (fromStart){
				xyf = this.master.uvToXYUntranslated(this.path[idf])
			} else {
				const xyf0 = this.master.uvToXYUntranslated(this.path[idf])
				const xyf1 = this.master.uvToXYUntranslated(this.path[idf + 1])
				xyf = [xyf0[0] + (xyf1[0] - xyf0[0]) * (center % 1), xyf0[1] + (xyf1[1] - xyf0[1]) * (center % 1)]
			}

			const idl = Math.min(Math.floor(center + delta), this.path.length - 1)
			const toEnd = idl === this.path.length - 1
			if (toEnd){
				xyl = this.master.uvToXYUntranslated(this.path[idl])
			} else {
				const xyl0 = this.master.uvToXYUntranslated(this.path[idl])
				const xyl1 = this.master.uvToXYUntranslated(this.path[idl - 1])
				xyl = [xyl0[0] + (xyl1[0] - xyl0[0]) * (center % 1), xyl0[1] + (xyl1[1] - xyl0[1]) * (center % 1)]
			}

			let dx0 = 0, dy0 = 0, dx1 = 0, dy1 = 0

			if (fromStart){
				dx0 = (Math.random() * 2 - 1) * this.master.unit * deviance * 2
				dy0 = (Math.random() * 2 - 1) * this.master.unit * deviance * 2
			}
			if (toEnd){
				dx1 = (Math.random() * 2 - 1) * this.master.unit * deviance * 2
				dy1 = (Math.random() * 2 - 1) * this.master.unit * deviance * 2
			}

			

			for (let r = 0; r < this.resources.length; r++){
				if (this.resources[r]){
					ctx.strokeStyle = this.master.codex.resources[r].triplet[1]
					ctx.beginPath()
					ctx.moveTo(xyf[0] + dx0, xyf[1] + dy0)
					for (let i = idf + 1; i < idl; i++){
						const xy = this.master.uvToXYUntranslated(this.path[i])
						ctx.lineTo(xy[0] + ((i * this.master.time.lt * 57.319 * (r + 367.13) % 1) * 2 - 1) * this.master.unit * deviance, xy[1] + ((i * this.master.time.lt * 793.567 * (r + 17.2) % 1) * 2 - 1) * this.master.unit * deviance)
					}
					ctx.lineTo(xyl[0] + dx1, xyl[1] + dy1)
					ctx.stroke()
				}
			}

		}
	}
}
