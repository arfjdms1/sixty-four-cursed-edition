import type { ColorTriplet, ResourceAmounts, Vec2 } from '../../../../../types/core.js'
import type { EntityHost } from '../../../../engine/entities/types.js'
import { Entity } from '../../../../engine/entities/Entity.js'
import { Sprite } from '../../../../sprites.js'
import { Cloud } from '../../../../ui.js'
import { Surge } from '../../entities/Surge.js'

export class Stabilizer extends Entity{
		
	constructor(master: EntityHost){
		super(master)
		this.name = `stabilizer`
		this.soulPower = 1
		this.attractorPosition = false

		this.surge = undefined
		this.timer = -1

		this.stabilization = .02
		this.baseInterval = 2000

		this.sprite = new Sprite({
			master: this.master,
			src: `resources/images/stabilizer.png`,
			frames: [[0,0,455,529]],
			origins: [227,398],
			scale: 1,
			sequences: [0],
			intervals: 100
		})

		this.initHint()
		this.initSellHint()
	}

	initHint(){

		this.hint = new Cloud(this.master)
		if (this.surge) this.hint.addGradeAndProgress((this.surge as unknown as { grade: number }).grade, (this.surge as unknown as { type: number }).type, () => (this.surge as unknown as { lifeTimer: number; maxLifeTimer: number }).lifeTimer / (this.surge as unknown as { lifeTimer: number; maxLifeTimer: number }).maxLifeTimer)

		const description = `<b>${this.master.words.entities[this.name]?.name} ${this.surge ? '(' + this.master.words.resources[(this.surge as unknown as { type: number }).type] + ')' : ''}</b><br/>${this.master.words.entities[this.name]?.description}`
		this.hint.addDescription(description)
		this.hint.addQEString(this.name !== `stabilizer3`,true)
		
	}

	getHint(){
		// return this.state === 0 ? this.hints[0] : this.state === 2 ? this.hints[1] : false
		return (this.surge || this.master.altActive) ? this.hint : false
	}

	update(dt?: number){

		if (this.power && typeof this.power === "object"){

			if (dt) this.power.timer -= dt
			if (this.power.timer <= 0){
				this.power.timer = this.power.maxTimer + (Math.random() * 2 - 1) * this.power.maxTimer * .5
				this.power.f()
			}

		}

	}

	setPosition(uv: Vec2){

		this.position = uv
		this.attractorPosition = [uv[0] - 1.5, uv[1] - 1.5]
		this.init()
		return this

	}

	init(){

		let previousSurge = -1
		this.master.stabilizers.add(this)

		if (this.surge) {
			previousSurge = this.surge as unknown as number
			(this.surge as unknown as { stabilizer: unknown }).stabilizer = false
			this.surge = undefined
		}

		let multipleSurgeSpawner = false
		const stabilizers = Array.from(this.master.stabilizers)
		for (let i = 0; i < stabilizers.length; i++){
			if ((stabilizers[i] as unknown as { surge?: { type?: number } }).surge?.type === 5) {
				multipleSurgeSpawner = true
				break
			}
		}

		let surges = []
		const n = this.getNeighbours() as Array<Entity | undefined>
		
		for (let i = 0; i < n.length; i++){
			const s = n[i] as Surge | undefined;
			if (s && s instanceof Surge && !s.harvestProgression){
					if (!s.stabilizer && !(multipleSurgeSpawner && s.type === 5)) surges.push(s)
					if ((n[i] as unknown) === previousSurge){
						surges = [s]
						break
					}
			}
		}

		if (surges.length){
			const id = Math.floor(Math.random() * surges.length)
			this.surge = surges[id] as unknown as { type: number; grade: number; lifeTimer: number; maxLifeTimer: number; stabilizer: unknown }
			(this.surge as unknown as { stabilizer: unknown }).stabilizer = this
		}

		this.initSurgePower()
		this.initHint()

	}

	initSurgePower(){

		if (this.surge){

			const surgeObj = this.surge as unknown as { type: number; grade: number; lifeTimer: number; maxLifeTimer: number; stabilizer: unknown }
			const t = surgeObj.type
			const g = surgeObj.grade
			const strength = g === 0 ? 2 : g === 1 ? 4 : 8
			const conversion = g === 0 ? .6 : g === 1 ? .75 : .9

			const times = [
				g === 0 ? this.baseInterval * 8 : g === 1 ? this.baseInterval * 4 : this.baseInterval * 2,
				g === 0 ? this.baseInterval * 16 : g === 1 ? this.baseInterval * 12 : this.baseInterval * 6,
				g === 0 ? this.baseInterval * 4 : g === 1 ? this.baseInterval * 1 : this.baseInterval * .5,
				g === 0 ? this.baseInterval * 4 : g === 1 ? this.baseInterval * 2 : this.baseInterval,
				g === 0 ? this.baseInterval * 18 : g === 1 ? this.baseInterval * 12 : this.baseInterval * 8,
				g === 0 ? this.baseInterval * 48 : g === 1 ? this.baseInterval * 32 : this.baseInterval * 24,
				g === 0 ? this.baseInterval * 4 : g === 1 ? this.baseInterval * 2 : this.baseInterval,
				g === 0 ? this.baseInterval * 24 : g === 1 ? this.baseInterval * 18 : this.baseInterval * 12,
				g === 0 ? this.baseInterval * 18 : g === 1 ? this.baseInterval * 12 : this.baseInterval * 8,
				g === 0 ? this.baseInterval * 48 : g === 1 ? this.baseInterval * 32 : this.baseInterval * 24
			]
			const functions: Array<(m?: unknown) => void> = [
				(m?: unknown) => {
					const pumps = Array.from(this.master.pumps)
					const dice = Math.floor(Math.random() * pumps.length)
					if (pumps[dice]) {
						pumps[dice].boost?.()
						const screenxy = this.context.coordinates.uvToXYUntranslated((this.attractorPosition || [0, 0]) as Vec2)
						const pan = this.context.audio.getPanValueFromX(screenxy[0])
						const loudness = this.context.audio.getLoudnessFromXY(screenxy)
						this.context.audio.playSound(`lightning`, pan, loudness, this.master.plane ? true : false)
						this.context.effects.createLightning([], screenxy, this.context.coordinates.uvToXYUntranslated(pumps[dice].position), (_?: unknown) => {}, [1,0], `#112`)
					}

				},
				(m?: unknown) => {
					const unfilled = Array.from(this.master.unfilledEntities)
					const dice = Math.floor(Math.random() * unfilled.length)
					if (unfilled[dice]) {
						unfilled[dice].onmousedown(strength)
						const screenxy = this.context.coordinates.uvToXYUntranslated((this.attractorPosition || [0, 0]) as Vec2)
						const pan = this.context.audio.getPanValueFromX(screenxy[0])
						const loudness = this.context.audio.getLoudnessFromXY(screenxy)
						this.context.audio.playSound(`lightning`, pan, loudness, this.master.plane ? true : false)
						this.context.effects.createLightning([], screenxy, this.context.coordinates.uvToXYUntranslated(unfilled[dice].position), (_?: unknown) => {}, [1,0], `#FA3`)
					}
				},
				(m?: unknown) => {
					const cubes = Array.from(this.master.activeCubes)
					const dice = Math.floor(Math.random() * cubes.length)
					if (cubes[dice]) {
						cubes[dice].onmousedown(strength)
						const screenxy = this.context.coordinates.uvToXYUntranslated((this.attractorPosition || [0, 0]) as Vec2)
						const pan = this.context.audio.getPanValueFromX(screenxy[0])
						const loudness = this.context.audio.getLoudnessFromXY(screenxy)
						this.context.audio.playSound(`lightning`, pan, loudness, this.master.plane ? true : false)
						this.context.effects.createLightning([], screenxy, this.context.coordinates.uvToXYUntranslated(cubes[dice].position), (_?: unknown) => {}, [1,0], `#863DFF`)
					}
				},
				(m?: unknown) => {
					const cubes = Array.from(this.master.activeCubes)
					const dice = Math.floor(Math.random() * cubes.length)
					if (cubes[dice] && cubes[dice].composition[3]) {
						cubes[dice].broken = cubes[dice].broken + (1 - cubes[dice].broken) * .8
						let swapped = 0
						for (let i = 0; i < cubes[dice].resources.length; i++){

							if (cubes[dice].resources[i] === 3) {
								const dice2 = Math.random()
								const rid = dice2 < .92 ? 0 : dice2 < .96 ? 1 : 2
								cubes[dice].resources[i] = rid
								cubes[dice].composition[3] -= 0.015625
								cubes[dice].composition[rid] = cubes[dice].composition[rid] ? cubes[dice].composition[rid] + 0.015625 : 0.015625
								swapped++
							}

						}

						const screenxy = this.context.coordinates.uvToXYUntranslated((this.attractorPosition || [0, 0]) as Vec2)
						const cubeScreenxy = this.context.coordinates.uvToXYUntranslated(cubes[dice].position)
						const pan = this.context.audio.getPanValueFromX(screenxy[0])
						const loudness = this.context.audio.getLoudnessFromXY(screenxy)
						this.context.audio.playSound(`lightning`, pan, loudness, this.master.plane ? true : false)
						this.context.effects.createLightning([], screenxy, cubeScreenxy, (_?: unknown) => {}, [1,0], `#F26F67`)

						if (swapped){
							const r = [0,0,0,swapped]
							this.context.effects.createResourceTransfer(r, cubeScreenxy)
						}

					}
				},
				(m?: unknown) => {
					const converters = Array.from(this.master.activeConverters)
					const dice = Math.floor(Math.random() * converters.length)
					if (converters[dice]) {
						
						converters[dice].conversion = converters[dice].conversion + (1 - converters[dice].conversion) * conversion
						const screenxy = this.context.coordinates.uvToXYUntranslated((this.attractorPosition || [0, 0]) as Vec2)
						const pan = this.context.audio.getPanValueFromX(screenxy[0])
						const loudness = this.context.audio.getLoudnessFromXY(screenxy)
						this.context.audio.playSound(`lightning`, pan, loudness, this.master.plane ? true : false)
						this.context.effects.createLightning([], screenxy, this.context.coordinates.uvToXYUntranslated(converters[dice].position), (_?: unknown) => {}, [1,0], `#A6F246`)
					}
				},
				(m?: unknown) => {
					this.master.spawnSurge(0)
				},
				(m?: unknown) => {
					this.master.forcedAnnihilation = true
				},
				(m?: unknown) => {
					if (this.master.hollowSite && (this.master.hollowSite as unknown as { spawnHollow?: () => void; spawnedHollows: number; maxSpawnedHollows: number }).spawnHollow && (this.master.hollowSite as unknown as { spawnedHollows: number; maxSpawnedHollows: number }).spawnedHollows < (this.master.hollowSite as unknown as { spawnedHollows: number; maxSpawnedHollows: number }).maxSpawnedHollows){

						(this.master.hollowSite as unknown as { spawnHollow: () => void }).spawnHollow()

					}
				},
				(m?: unknown) => {
					const stabilizers = Array.from(this.master.stabilizers)
					const stabilizers2 = []
					let theone: Entity | false = false
					for (let i = 0; i < stabilizers.length; i++){
						if (stabilizers[i].name === `stabilizer2` && (stabilizers[i] as { surge?: unknown }).surge && (stabilizers[i] as unknown) !== this) {
							stabilizers2.push(stabilizers[i])
							if (!this.master.entitiesInGame.stabilizer3 && (stabilizers[i] as unknown as { surge?: { type?: number } }).surge?.type === 9) theone = stabilizers[i]
						}
					}
					if (theone){

						if (theone) {
						const uv = (theone as { position: Vec2 }).position;
						this.context.spatial.clearCell(uv);
						this.context.spatial.addEntity(`stabilizer3`, uv);
					}
						

					} else if (stabilizers2.length){

						const dice = Math.floor(Math.random() * stabilizers2.length);
						const one = stabilizers2[dice] as unknown as { position: Vec2; surge: { lifeTimer: number; maxLifeTimer: number } };
						one.surge.lifeTimer = one.surge.maxLifeTimer;
						(this.surge as unknown as { lifeTimer: number }).lifeTimer = 64;

						const screenxy = this.context.coordinates.uvToXYUntranslated((this.attractorPosition || [0, 0]) as Vec2)
						const pan = this.context.audio.getPanValueFromX(screenxy[0])
						const loudness = this.context.audio.getLoudnessFromXY(screenxy)
						this.context.audio.playSound(`lightning`, pan, loudness, this.master.plane ? true : false)
						this.context.effects.createLightning([], screenxy, this.context.coordinates.uvToXYUntranslated((one as { position: Vec2 }).position), (_?: unknown) => {}, [1,0], `#000`)
					}
				},
				(m?: unknown) => {
					const entities = this.context.spatial.entities()
					for (let i = 0; i < entities.length; i++){
						entities[i].updateSoul(strength * 16000)
					}
				}
			]

			this.power = {
				maxTimer: times[t],
				timer: times[t] * 1.5,
				f: functions[t]
			}

		} else {

			this.power = false

		}

	}

	onDelete(){

		if (this.surge) (this.surge as unknown as { stabilizer: unknown }).stabilizer = false
		this.master.stabilizers.delete(this)

	}

	render(dt?: number, vposition?: Vec2){

		const axy = (this.attractorPosition || [0, 0]) as Vec2 ? this.context.coordinates.uvToXY((this.attractorPosition || [0, 0]) as Vec2) : false
		this.sprite.render(vposition ? vposition : this.position)

		if (this.power && typeof this.power === "object" && this.surge){
			const timeFraction = Math.min(1, this.power.timer / this.power.maxTimer)
			const f = Math.min(.9, Math.max(.04, (timeFraction ** .5) * .6 + (Math.random() * 2 - 1) * .04))
			const delta = this.context.render.unit * 2
			const gradient = this.context.render.ctx.createRadialGradient((axy as Vec2)[0],(axy as Vec2)[1],0,(axy as Vec2)[0],(axy as Vec2)[1],delta)
			this.context.render.ctx.globalAlpha = (1 - timeFraction) * .8
			gradient.addColorStop(f-.04,`#FFF0`)
			gradient.addColorStop(f, this.master.codex.resources[(this.surge as unknown as { type: number }).type].triplet[Math.floor(Math.random() * 2)])
			gradient.addColorStop(f+.1,`#FFF0`)
			this.context.render.ctx.fillStyle = gradient
			this.context.render.ctx.fillRect((axy as Vec2)[0] - delta, (axy as Vec2)[1] - delta, delta*2, delta*2)
			this.context.render.ctx.globalAlpha = 1
		}
		

	}

}
