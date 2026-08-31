import type { ColorTriplet, ResourceAmounts, Vec2 } from '../../../../../types/core.js'
import type { EntityHost } from '../../../../engine/entities/types.js'
import { Entity } from '../../../../engine/entities/Entity.js'
import { Sprite } from '../../../../sprites.js'

export class Hollow extends Entity{

	constructor(master: EntityHost, owner?: unknown){
		super(master)
		this.name = `hollow`
		this.integrity = 1
		this.state = 2
		this.indestructible = true

		this.soulPower = 0

		this.sprite = new Sprite({
			master: this.master,
			src: `img/hollow.png`,
			frames: [[0,0,455,312],[455,0,455,312],[910,0,455,312],[0,312,455,312],[455,312,455,312],[910,312,455,312]],
			origins: [226,180],
			scale: 1,
			sequences: [[0],[1],[2],[3],[4],[5]],
			intervals: 100
		})

		this.darksprite = new Sprite({
			master: this.master,
			src: `img/vent.png`,
			frames: [[0,0,454,831]],
			origins: [227, 700],
			scale: 1,
			sequences: [0],
			intervals: 100
		})
	}

	updateSoul(){this.soul = 1}

	initHint(){}

	ondarkhover(){
		
	}

	canHit(){
		return true
	}

	getOwner(){
		return this.master.hollowSite
	}

	init(){

		if (!this.variant) this.variant = Math.floor(Math.random() * this.sprite.sequences.length)
		this.sprite.switchSequence(this.variant)

	}

	onmousedown(){

		if (this.state === 2){

			this.integrity -= 1 / this.master.hollowHardness

			const screenxy = this.master.uvToXYUntranslated(this.position)
			const pan = this.master.getPanValueFromX(screenxy[0])
			const loudness = this.master.getLoudnessFromXY(screenxy)
			this.master.playSound(`hollow`, pan, loudness)
			this.master.createResourceExplosion([0,0,0,0,0,0,0,64],screenxy)

			if (this.integrity <= 0 && !this.killme){

				const screenxy = this.master.uvToXYUntranslated(this.position)
				const pan = this.master.getPanValueFromX(screenxy[0])
				const loudness = this.master.getLoudnessFromXY(screenxy)
				this.master.playSound(`break`, pan, loudness)
				this.master.createResourceTransfer([0,0,0,0,0,0,0,1], screenxy)

				this.master.hollowHardness = Math.max(4, this.master.hollowHardness / 2)
				this.killme = true
				this.state = 3

			}
		}
	}

	onDelete(){
		const hollowSite = this.getOwner()
		const site = hollowSite as { spawnedHollows?: number } | undefined;
		if (site && typeof site.spawnedHollows === "number") site.spawnedHollows--;
	}

	render(dt?: number, vposition?: Vec2){

		this.sprite.render(vposition ? vposition : this.position)

	}

}
