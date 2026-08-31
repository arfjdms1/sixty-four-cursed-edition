import type { SlowdownState } from '../../../types/save.js'
import type { EntityManager } from '../entities/EntityManager.js'
import type { ResourceSystem } from '../resources/ResourceSystem.js'
import type { HollowEvent, WorldEventHost } from './types.js'

export class WorldEventSystem {
	host: WorldEventHost
	entities: EntityManager
	resources: ResourceSystem

	slowdown: SlowdownState
	hollowEvents: HollowEvent[]
	darkHollowEvents: HollowEvent[]
	surgeSpawnTimer: number

	constructor(host: WorldEventHost, entities: EntityManager, resources: ResourceSystem){
		this.host = host
		this.entities = entities
		this.resources = resources

		this.slowdown = {
			state: false,
			timer: 0,
			totalTime: 0,
			multiplyer: .1,
			f: 0,
			cooldown: 0
		}
		this.hollowEvents = []
		this.darkHollowEvents = []
		this.surgeSpawnTimer = 30000 + Math.random() * 120000
	}

	updateSlowdownEvent(): void {
		if (this.slowdown.state){
			this.slowdown.timer -= this.host.time.dt

			const f = this.slowdown.timer / this.slowdown.totalTime
			this.slowdown.f = f < .2 ? f * 5 : f < .8 ? 1 : 1 - (f - .8) * 5

			this.host.time.dt *= (1 * (1 - this.slowdown.f) + this.slowdown.multiplyer * this.slowdown.f)

			//zzz I don't remember why it was !this.plane. Weird.
			if (this.slowdown.timer <= 0 || this.host.plane){
				this.slowdown.state = false
			}
		} else if (!this.slowdown.cooldown && !this.entities.entitiesInGame.pinhole){
			const hollows = this.entities.entitiesInGame.hollow || 0
			const flowers = (this.entities.entitiesInGame.flower || 0) + (this.entities.entitiesInGame.fruit || 0)
			const threshold = Math.max(0, hollows - flowers) * this.host.time.dt * 1e-6

			//Initiate slowdown
			if (Math.random() < threshold && !this.host.plane){
				const dice = Math.random()
				const power = (dice < .1 && hollows > 8) ? .02 : dice < .3 ? .1 : dice < .7 ? .5 : 2
				const time = (10000 + Math.random() * 10000 * hollows) * ((power as number) === .01 ? .5 : 1)

				this.slowdown.cooldown = 96000
				this.initiateSlowdown(time, power)
			}
		}

		if (!this.slowdown.state && this.slowdown.cooldown){
			this.slowdown.cooldown = Math.max(0, this.slowdown.cooldown - this.host.time.dt)
		}
	}

	initiateSlowdown(t: number, m: number): void {
		this.host.stats.timeEvents++

		this.slowdown.state = true
		this.slowdown.timer = t
		this.slowdown.totalTime = t
		this.slowdown.multiplyer = m
	}

	createHollowEvent(color = `#FFBB36`, time = 6000, sound: string | number | false = false, image = false): void {
		if (sound) this.host.playSound(sound, 0, 1)

		this.hollowEvents.push({
			max: time,
			time: time,
			color: color,
			imageTime: image ? 250 : 0,
			maxImageTime: 200
		})
	}

	createDarkHollowEvent(color = `#FFBB36`, time = 6000, sound: string | number | false = false, image = false): void {
		if (sound) this.host.playSound(sound, 0, 1)

		this.darkHollowEvents.push({
			max: time,
			time: time,
			color: color,
			imageTime: image ? 250 : 0,
			maxImageTime: 200
		})
	}

	updateHollowEvents(dt: number): void {
		for (let i = 0; i < this.hollowEvents.length; i++){
			const e = this.hollowEvents[i]
			e.time -= dt
			e.imageTime -= dt

			if (e.time <= 0){
				this.hollowEvents.splice(i,1)
				i--
			}
		}

		for (let i = 0; i < this.darkHollowEvents.length; i++){
			const e = this.darkHollowEvents[i]
			e.time -= dt
			e.imageTime -= dt

			if (e.time <= 0){
				this.darkHollowEvents.splice(i,1)
				i--
			}
		}
	}

	updateSurge(dt: number): void {
		if (this.host.currentlyExtracting) this.surgeSpawnTimer -= dt

		if (this.surgeSpawnTimer <= 0){
			this.spawnSurge()
			this.surgeSpawnTimer = 20000 + Math.random() * 80000
		}
	}

	spawnSurge(type?: number): void {
		if (!this.resources.resources[1]) return

		const dice = Math.random()
		const multiplyer = dice < .75 ? .1 : dice < .9 ? .3 : .5

		let maxId = 0
		for (let i = 9; i >= 0; i--){
			if (this.resources.resources[i] > 0){
				maxId = i
				break
			}
		}
		const rid = type !== undefined ? type : Math.floor(Math.random() * (maxId + 1))
		const source = rid > 6 ? Math.min(this.resources.resources[rid], 512) : rid === 5 ? Math.min(this.resources.resources[rid], 16384) : Math.min(this.resources.resources[rid], 262144)
		const base = this.host.stats.totalResourcesMined[rid] > 2048 ? 512 + multiplyer * source : multiplyer * source
		const amount = Math.max(1, base + source * multiplyer * Math.random())
		const resources = []
		resources[rid] = amount
		const colors = this.host.codex.resources[rid].surgeTriplet || this.host.codex.resources[rid].triplet

		const origin = this.host.xyToUV(this.host.mouse.offsetxy)
		const radius = 6

		for (let i = 0; i < 32; i++){
			const u = Math.floor((Math.random() * 2 - 1) * radius + origin[0])
			const v = Math.floor((Math.random() * 2 - 1) * radius + origin[1])

			const rayNumber = 1 + Math.floor(multiplyer * 24)
			const grade = rayNumber < 5 ? 0 : rayNumber < 10 ? 1 : 2

			const placed = this.entities.addEntity(`surge`, [u,v], {
				resources: resources,
				rayNumber: rayNumber,
				grade: grade,
				colors: colors,
				type: rid
			}, {skipShopUpdate: true})

			if (placed) break
		}
	}
}
