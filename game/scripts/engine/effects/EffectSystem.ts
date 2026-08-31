import type { Vec2 } from '../../../types/core.js'
import type {
	EffectCompletion,
	EffectHost,
	EffectVisibility,
} from './types.js'
import { VFX } from './VFX.js'
import { Exhaust } from './Exhaust.js'
import { ResourceExplosion } from './ResourceExplosion.js'
import { ResourceSpark } from './ResourceSpark.js'
import { ResourceTransfer } from './ResourceTransfer.js'
import { ChasmTransfer } from './ChasmTransfer.js'
import { Lightning } from './Lightning.js'

export class EffectSystem {
	host: EffectHost
	vfx: VFX[] = []
	chasmVfx: VFX[] = []

	constructor(host: EffectHost){
		this.host = host
	}

	renderVFX(): void {
		for (let i = 0; i < this.vfx.length; i++){
			if (this.host.chillMode && i > 32) return
			this.vfx[i].render()
		}
	}

	renderChasmVFX(): void {
		for (let i = 0; i < this.chasmVfx.length; i++){
			if (this.host.chillMode && i > 32) return
			this.chasmVfx[i].render()
		}
	}

	updateVFX(dt: number): void {
		for (let i = 0; i < this.vfx.length; i++){
			this.vfx[i].update(dt)
			if (this.vfx[i].terminate){
				this.vfx.splice(i,1)
				i--
			}
		}

		for (let i = 0; i < this.chasmVfx.length; i++){
			this.chasmVfx[i].update(dt)
			if (this.chasmVfx[i].terminate){
				this.chasmVfx.splice(i,1)
				i--
			}
		}
	}

	createResourceTransfer(r: number[], p?: Vec2 | false, d?: Vec2, f?: EffectCompletion | false, v?: EffectVisibility, skip?: boolean): ResourceTransfer {
		const transfer = new ResourceTransfer(this.host, {resources: r, source: p, destination: d, f: f, visibility: v, skip: skip})
		this.vfx.push(transfer)
		return transfer
	}

	createChasmTransfer(r: number[], path: unknown, f?: EffectCompletion | false, v?: EffectVisibility): ChasmTransfer {
		const transfer = new ChasmTransfer(this.host, {resources: r, path: path as Vec2[], f: f, visibility: v})
		this.chasmVfx.push(transfer)
		return transfer
	}

	createLightning(r: number[], p?: Vec2 | false, d?: Vec2, f?: EffectCompletion | false, v?: EffectVisibility, c?: string): Lightning {
		const lightning = new Lightning(this.host, {resources: r, source: p, destination: d, f: f, visibility: v, color: c})
		this.vfx.push(lightning)
		return lightning
	}

	createResourceExplosion(r: number[], p?: Vec2 | false, v?: EffectVisibility): ResourceExplosion {
		const explosion = new ResourceExplosion(this.host, {resources: r, source: p, visibility: v})
		this.vfx.push(explosion)
		return explosion
	}

	createResourceSpark(c: number[], p?: Vec2 | false, v?: EffectVisibility): ResourceSpark {
		const spark = new ResourceSpark(this.host, {resources: c, source: p, visibility: v})
		this.vfx.push(spark)
		return spark
	}

	createExhaust(uv: Vec2, c?: string, v?: EffectVisibility): Exhaust {
		const exhaust = new Exhaust(this.host, {uv: uv, color: c, visibility: v})
		this.vfx.push(exhaust)
		return exhaust
	}
}
