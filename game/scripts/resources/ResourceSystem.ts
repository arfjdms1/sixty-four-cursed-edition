import type { ResourceAmounts, Vec2 } from '../../types/core.js'
import type { EffectCompletion } from '../effects/types.js'
import type { AnalyticsState, ResourceHost } from './types.js'

export class ResourceSystem {
	host: ResourceHost
	declare resources: ResourceAmounts
	declare resourcePops: number[]
	declare analytics: AnalyticsState
	declare resourceBuffer: number[]
	declare resourceRates: number[]
	declare rateMeasureMode?: boolean

	constructor(host: ResourceHost){
		this.host = host
	}

	initResources(): void {
		this.resources = new Array(10).fill(0) as ResourceAmounts
		this.resourcePops = new Array(10).fill(0)
	}

	initRateTracking(): void {
		this.resourceBuffer = new Array(10).fill(0)
		this.resourceRates = new Array(10).fill(0)
	}

	initAnalytics(): void {
		this.analytics = {
			measuringFrame: 1000,
			frameCount: 16,
			frames: [],
			frame: [[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],
			frameTimer: 0,
			average: [[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],
			instant: [[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],
			dataSize: 64,
			graphs: []
		}

		for (let i = 0; i < 10; i++){
			const canvas = document.createElement(`canvas`)
			canvas.width = this.host.w2 / 2
			canvas.height = this.host.h2 / 2

			this.analytics.graphs.push({
				canvas: canvas,
				ctx: canvas.getContext(`2d`) as CanvasRenderingContext2D,
				data: [],
				max: 10
			})
		}
	}

	getRealPrice(name: string, sale?: boolean): number[] {
		const entity = this.host.codex.entities[name]
		const mult = entity.priceExponent ? entity.priceExponent ** Math.max(0, (this.host.entitiesInGame[name] || 0) - (sale ? 1 : 0)) : 1
		const sellMult = sale ? (this.host.eraserType === 2 ? 1 : this.host.eraserType === 1 ? .9 : .5) : 1
		if (mult === 1) return entity.price

		const realPrice = []
		for (let i = 0; i < entity.price.length; i++){
			realPrice.push(entity.price[i] * mult * sellMult)
		}
		return realPrice
	}

	canAfford(name: string): boolean {
		let can = true
		const price = this.getRealPrice(name)

		for (let i = 0; i < price.length; i++){
			if (price[i] && this.resources[i] < price[i]){
				can = false
				break
			}
		}

		return can
	}

	requestResources(r: number[], d: Vec2, f?: ((resources?: number[]) => void) | false, skip?: boolean): boolean {
		let good = true

		for (let i = 0; i < r.length; i++){
			if (r[i] && this.resources[i] < r[i]){
				good = false
				break
			}
		}

		if (good) {
			this.substractResourcesFromArray(r,skip)
			this.host.createResourceTransfer(r, false, this.host.uvToXYUntranslated(d), f ? f as EffectCompletion : (_: unknown)=>{}, undefined, skip)
			return true
		}

		return false
	}

	askForResources(r: number[], d: Vec2, f?: ((resources: number[]) => void) | false, skip?: boolean): boolean {
		const response: number[] = []

		for (let i = 0; i < r.length; i++){
			if (r[i]){
				response[i] = Math.min(this.resources[i], r[i])
			}
		}

		this.substractResourcesFromArray(response,skip)
		this.host.createResourceTransfer(response, false, this.host.uvToXYUntranslated(d), f ? (_: unknown)=>{f(response)} : (_: unknown)=>{}, undefined, skip)
		return true
	}

	addResourcesFromArray(a: number[], skipAnalytics?: boolean): void {
		const f = this.analytics.frame || []

		for (let i = 0; i < a.length; i++){
			if (a[i]) {
				this.resources[i] += a[i]
				if (!skipAnalytics) f[i][0] += a[i]
				this.resourcePops[i] = .5
				this.host.stats.totalResourcesMined[i] += a[i]
				this.host.stats.absoluteResourcesCount += a[i]
			}
		}
	}

	substractResourcesFromArray(a: number[], skipAnalytics?: boolean): void {
		const f = this.analytics.frame || []

		for (let i = 0; i < a.length; i++){
			if (a[i]) {
				this.resources[i] = Math.max(0, this.resources[i] -= a[i])
				if (!skipAnalytics) f[i][1] -= a[i]
			}
		}
	}

	updateResourcePops(dt: number): void {
		for (let i = 0; i < this.resourcePops.length; i++){
			this.resourcePops[i] = Math.max(0, this.resourcePops[i] * (1 - 1/dt))
		}
	}

	updateAnalytics(dt: number): void {
		const a = this.analytics
		a.frameTimer -= dt
		if (a.frameTimer < 0){
			a.frameTimer = a.measuringFrame + a.frameTimer
			a.frames.push(a.frame)
			a.instant = a.frame
			for (let i = 0; i < a.instant.length; i++){
				const norm = a.measuringFrame / 1000
				a.instant[i][0] /= norm
				a.instant[i][1] /= norm
				a.graphs[i].data.push(a.instant[i])
				if (a.graphs[i].data.length > a.dataSize) a.graphs[i].data.shift()
			}

			a.frame = [[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]]
			if (a.frames.length > a.frameCount) a.frames.shift()

			a.average = [[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]]
			for (let i = 0; i < a.frames.length; i++){
				const norm = a.frames.length / (i + 1) * this.analytics.frames.length / 2
				for (let j = 0; j < a.frames[i].length; j++){
					a.average[j][0] += a.frames[i][j][0] / norm
					a.average[j][1] += a.frames[i][j][1] / norm
				}
			}
		}
	}

	measureRates(oncomplete?: () => void): void {
		const timeWindow = 11000
		const resourceBuffer = [...this.resources]
		this.rateMeasureMode = true

		setTimeout((_: unknown)=>{
			const delta = this.resources.map((v,i)=>v-resourceBuffer[i])
			const resourceRates = delta.map(v=>v/timeWindow*100)
			console.log(resourceRates)
			delete this.rateMeasureMode
			oncomplete?.()
		},timeWindow)
	}
}
