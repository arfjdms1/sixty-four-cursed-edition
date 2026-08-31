import type { ColorTriplet, ResourceAmounts, Vec2 } from '../../../../../types/core.js'
import type { EntityHost } from '../../../../engine/entities/types.js'
import { Entity } from '../../../../engine/entities/Entity.js'
import { Sprite } from '../../../../sprites.js'
import { Cube } from '../../entities/Cube.js'
import { Silo } from '../storage/Silo.js'

export class Injector extends Entity{

	constructor(master: EntityHost){
		super(master)
		this.fill = 0
		this.state = 0
		this.fuel = [0,0,64,0,32]
		this.name = `injector`
		this.soulPower = 1

		this.sprite = new Sprite({
			master: this.master,
			src: `resources/images/injector.png`,
			mask: [0,0,455,287],
			frames: [[0,0,455,287],[455,0,455,287],[910,0,455,287]],
			origins: [227, 156],
			scale: 1,
			sequences: [[0],[1,2]],
			intervals: 60
		})

		this.initHint()
		this.initSellHint()
	}

	init(){
		this.isNextToSilo = false
		for (let i = 0; i < this.soi.length; i++){
			const cell = this.master.entityAtCoordinates([this.position[0] + this.soi[i][0], this.position[1] + this.soi[i][1]])
			if (cell instanceof Silo){
				this.isNextToSilo = true
				break
			}
		}
	}

	update(){
		if (this.state === 2 && this.sprite.currentSequence === 0) this.sprite.switchSequence(1)
	}

	tap(mult: number = 1): number {
		if (this.state === 2) return 1;
		return 0;
		mult = mult || 1
		if (this.state === 2){
			return 1
		}
		return 0
		this.fill -= 0.03125 * mult
		if (this.fill <= 0){
			this.fill = 0
			if (this.state === 2) this.shootExhaust()
			this.state = 0
			this.sprite.switchSequence(0)
		}
	}

	refill(){

		if (this.state === 0){

			const resources = this.master.requestResources?.(this.fuel!, this.position, (_?: unknown) => {
				this.activate()
			})

			if (resources) this.state = 1

		}

	}

	activate(){
		this.fill = 1
		this.state = 2

		//Looking for something to swap
		const n = this.getNeighbours()

		for (let i = 0; i < n.length; i++){
			const cell = n[i];
			if (cell && cell instanceof Cube && cell.state === 2){
				cell.swapRandomResource(this, 4);
			}
		}

	}

	onmousedown(){

		this.refill()

	}

	render(dt?: number, vposition?: Vec2){

		const ctx = this.master.ctx
		const unit = this.master.unit
		const position = vposition ? vposition : this.position

		this.sprite.render(position, dt)

		if (this.fill){
			const screen = this.master.uvToXY([position[0] - .6, position[1] - .6])
			const scale = .2 + this.fill * .8
			ctx.save()
			ctx.translate(screen[0] + (Math.random() * 2 - 1) * unit * .01 + (this.master.translation || [0,0])[0] * scale * this.master.zoom, screen[1] + (Math.random() * 2 - 1) * unit * .01 + (this.master.translation || [0,0])[1] * scale * this.master.zoom)
			ctx.scale(scale,scale)
			this.master.resourcesSprites[4].render([0,0])
			ctx.restore()
		}

	}

}
