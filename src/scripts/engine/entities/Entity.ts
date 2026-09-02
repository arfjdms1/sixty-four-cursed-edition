import type { ColorTriplet, ResourceAmounts, Vec2 } from '../../../types/core.js'
import type { EntityHost } from './types.js'
import type { EntityContext } from './context/types.js'
import { Sprite } from '../../sprites.js'
import { Cloud } from '../../ui.js'
import type { Destabilizer } from '../../content/base/machines/destabilizers/Destabilizer.js'

export interface Entity {
	boost?(): void
	refill?(): boolean | void
	seed?(): void
	swapRandomResource?(cell: unknown, swapResourceId: number): void
	tap?(arg?: number): number | boolean | void
	accept?(q?: number): boolean
	getConversionOutput?(): number[] | false
	addResources?(c: number, q: number): void
	extract?(q?: number): boolean
	consume?(fuel?: number[], opt?: number[] | Vec2 | unknown): void
}

export class Entity {
	declare master: EntityHost
	declare context: EntityContext
	declare soi: Vec2[]
	declare entitySpan: number
	declare entityHeight: number
	declare darksprite: Sprite
	declare soul: number
	declare soulPower: number
	declare hints: Cloud[]
	declare position: Vec2
	declare name: string
	declare state: number
	declare fill: number
	declare fuel: number[]
	declare darkFuel: number[]
	declare conversion: number
	declare sellHint: Cloud
	declare chasmNetwork: unknown
	declare chasmNetworkKey: string
	declare indestructible: boolean
	declare value: number
	declare capacity: number
	declare isUsed: boolean
	declare excitement: number
	declare maxExcitement: number
	declare threshold: number
	declare bridge: boolean
	declare order: number
	declare spawnTimer: number
	declare spawnTimerBase: number
	declare spawnedHollows: number
	declare maxSpawnedHollows: number
	declare spawnRadius: number
	declare ripe: number
	declare ripeTimer: number
	declare ripeTime: number
	declare lifeTimer: number
	declare maxLifeTimer: number
	declare harvestTimer: number
	declare maxHarvestTimer: number
	declare harvestProgression: number
	declare mouseDistance: number
	declare rays: unknown[]
	declare rayNumber: number
	declare colors: ColorTriplet
	declare type: number
	declare grade: number
	declare done: boolean
	declare killme: boolean
	declare stabilizer: unknown
	declare stabilization: number
	declare timer: number
	declare maxTimer: number
	declare surge: { type: number; grade: number; lifeTimer: number; maxLifeTimer: number; stabilizer: unknown } | unknown
	declare surgeTimer: number
	declare surgeMaxTime: number
	declare surgeBoost: number
	declare pump: unknown
	declare pumpSpeed: number
	declare depth: number
	declare auxes: unknown[]
	declare active: boolean
	declare sfxPlaying: unknown
	declare transitionTime: number
	declare transitionState: number
	declare isNextToSilo: boolean
	declare connected: boolean
	declare reach: number
	declare height: number
	declare originOffset: Vec2
	declare endControlOffset: Vec2
	declare f: number

	declare flashTimer: number
	declare maxFlashTimer: number
	declare flashTimer2: number
	declare flashTimer3: number
	declare finalTimer: number
	declare switchTimer: number
	declare maxSwitchTimer: number
	declare totalCount: number
	declare shopsprite: Sprite
	declare convertersNearby: number
	declare multiplicator: number
	declare maxMultiplicator: number
	declare spriteState: number
	declare basePumpSpeed: number
	declare doublechannel: number | boolean
	declare auxpump: unknown
	declare spoolup: number
	declare spoolupSpeed: number
	declare spoolupTimer: number
	declare spooldownSpeed: number
	declare online: boolean
	declare hold: boolean
	declare digSpeed: number
	declare hitboxPriority: number
	declare soe: Vec2[]
	declare timeStamp: number
	declare passed6400: boolean
	declare variant: number
	declare variantMap: Record<string, number> | number[]
	declare dive: number
	declare diveSpeed: number
	declare diveTimer: number
	declare bubbleSpeed: number
	declare freeTimer: number
	declare attractorPosition: Vec2 | false
	declare baseInterval: number
	declare power: { maxTimer: number; timer: number; f: (m?: unknown) => void } | number | false
	declare powerTimer: { maxTimer: number; timer: number; f: (m?: unknown) => void } | number
	declare composition: number[]
	declare broken: number
	declare resources: number[]
	declare fillTimer: number
	declare excitementTimer: number
	declare darkHint: Cloud
	declare chasmPath: Vec2[]
	declare integrity: number
	declare happened: boolean
	declare hint: Cloud
	declare sprite: Sprite
	declare destabilizers: Destabilizer[]
	declare base: number
	declare interval: number
	declare candidates: Record<string, unknown>
	declare maxCapacity: number
	declare baseConversionSpeed: number
	declare unveilProgress: number
	declare colorBlank: ColorTriplet
	declare colorCube: ColorTriplet
	declare reverseTimer: number
	declare reversePause: number
	declare maxFill: number
	declare shakePower: number
	declare resourceCoordinates: Vec2[]
	declare resourceShifts3d: Array<[number, number, number] | Vec2>
	declare conversionSpeed: number
	declare resetTimer: number
	declare resetTime: number
	declare maxResourceCount: number
	declare resourceCount: number
	declare bonus: number
	declare preheaters: Entity[]
	declare sor: Vec2[]
	declare reflectorCount: number
	declare alone: boolean
	declare reverseSpeed: number
	declare unveilSpeed: number
	declare baseBreakPower: number
	declare breakPower: number
	declare consumers: unknown[]
	declare shakeProgress: number
	declare shakeTime: number
	declare conversionTime: number
	declare chasmOrder: number

	constructor(master: EntityHost){
		this.master = master
		this.context = master.entityContext
		this.soi = [[0,-1], [1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]]
		this.entitySpan = 0
		this.entityHeight = 1

		this.darksprite = new Sprite({
			master: this.master,
			src: `resources/images/symbol0${Math.floor(Math.random() * 4) + 1}.png`,
			mask: [0,0,256,256],
			frames: [[0,0,256,256],[256,0,256,256],[512,0,256,256]],
			origins: [128, 256],
			scale: .7,
			sequences: [0,1,2],
			intervals: 80
		})

		this.soul = 1
		this.soulPower = 0

		this.hints = []

	}

	//HINT STUFF

	getHint(): Cloud | false | undefined {
		// return this.state === 0 ? this.hints[0] : this.state === 2 ? this.hints[1] : false
		return this.state === 0 ? this.hints[0] : this.state === 2 ? this.hints[1] : this.master.altActive ? this.hints[0] : false
	}
	getDarkHint(): Cloud | false | undefined {
		return false
	}
	getSellHint(): Cloud | false | undefined {
		return this.sellHint || false
	}
	initHint(): void {
		this.hints = [new Cloud(this.master), new Cloud(this.master)]
		if (this.fuel) {
			if (this.conversion !== undefined){
				// this.hints[0].addResourceList(this.fuel)
				this.hints[0].addConvertersOutput(this.fuel, (this as unknown as { getConversionOutput: () => number[] | false }).getConversionOutput.bind(this))
			} else {
				this.hints[0].addResourceList(this.fuel)
			}
			
		}
		if (this.conversion !== undefined){
			this.hints[1].addProgress((_value?: unknown)=>this.conversion as number)
		} else if (this.fill !== undefined) {
			this.hints[1].addProgress((_value?: unknown)=>this.fill as number)
		}

		const description = `<b>${this.master.words.entities[this.name]?.name}</b><br/>${this.master.words.entities[this.name]?.description}`
		this.hints[0].addDescription(description)
		this.hints[1].addDescription(description)

		const qHint = (this.master.codex.entities[this.name]?.canPurchase && !this.master.codex.entities[this.name]?.onlyone) as boolean
		const eHint = this.master.canRelocate(this)
		if (qHint || eHint){
			this.hints[0].addQEString(qHint,eHint)
			this.hints[1].addQEString(qHint,eHint)
		}
		
	}
	initSellHint(): void {
		this.sellHint = new Cloud(this.master)
		this.sellHint.addSellIcon()
		this.sellHint.addLine()
		this.sellHint.addRefundList(this.name)
	}

	shootExhaust(): void {

		const screenxy = this.context.coordinates.uvToXYUntranslated(this.position)
		const pan = this.context.audio.getPanValueFromX(screenxy[0])
		const loudness = this.context.audio.getLoudnessFromXY(screenxy)
		this.context.audio.playSound(`exhaust`, pan, loudness)
		this.context.effects.createExhaust(this.position, this.master.codex.resources[this.fuel!.length - 1].triplet[1])

	}

	update(dt?: number): void {}
	render(dt?: number, vposition?: Vec2, back?: boolean): void {}
	init(): void {}
	onmousedown(e?: unknown): void {}
	onmouseup(e?: unknown): void {}
	onDelete(): void {}

	updateSoul(dt: number): void {
		if (this.soul < 1){
			this.soul += 1e-5 * dt
			if (this.soul > 1) this.soul = 1
		}
	}

	darkrender(dt?: number, vposition?: Vec2): void {
		const position = vposition ? vposition : this.position
		const ctx = this.context.render.ctx
		// const xy = this.context.coordinates.uvToXY(position)
		ctx.save()
		// ctx.translate(xy[0], xy[1])
		ctx.globalAlpha = this.soul
		this.darksprite.render(position, dt, false, .5 + this.soulPower ** .2)
		ctx.restore()
	}

	ondarkhover(): void {
		if (this.soul === 1){

			const screenxy = this.context.coordinates.uvToXYUntranslated(this.position)
			const pan = this.context.audio.getPanValueFromX(screenxy[0])
			const loudness = this.context.audio.getLoudnessFromXY(screenxy)
			this.context.audio.playSound(`soul`, pan, loudness, true)

			this.soul = 0
			if (this.context.references.hasVoidsculpture()) {
				const vsPos = this.context.references.voidsculpturePosition()
				if (vsPos) this.context.effects.createResourceTransfer([0,0,0,0,0,0,0,0,0,this.soulPower], screenxy, this.context.coordinates.uvToXYUntranslated([vsPos[0] - 1, vsPos[1] - 1]), false, [0,1])
			}
		}
	}

	canHit(): boolean {
		return (this.state === 0)
	}
	canDarkHit(): boolean {return false}

	setPosition(uv: Vec2): this {

		this.position = uv
		this.init()
		return this

	}

	getNeighbours(): Array<Entity | undefined> {

		const n: Array<Entity | undefined> = []

		for (let i = 0; i < this.soi.length; i++){
			n.push(this.context.spatial.entityAt([this.position[0] + this.soi[i][0], this.position[1] + this.soi[i][1]]) as Entity | undefined)
		}

		return n

	}

	isConnected(): boolean {
		return this.chasmNetwork ? this.chasmNetwork === (this.master.chasm as { chasmNetwork?: unknown })?.chasmNetwork : false
	}

}
