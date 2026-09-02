import type { ColorTriplet, ResourceAmounts, Vec2 } from '../../../../../types/core.js'
import type { EntityHost } from '../../../../engine/entities/types.js'
import { Destabilizer } from './Destabilizer.js'
import { Entity } from '../../../../engine/entities/Entity.js'
import { Sprite } from '../../../../sprites.js'

export class Destabilizer2a extends Destabilizer{

	constructor(master: EntityHost){
		super(master)
		this.fuel = [0,64,0,0,1]
		this.name = `destabilizer2a`
		this.soulPower = 2

		this.sprite = new Sprite({
			master: this.master,
			src: `resources/images/des2a.png`,
			mask: [0,0,455,395],
			frames: [[0,0,455,395],[455,0,455,395],[910,0,455,395],[1365,0,455,395]],
			origins: [227, 264],
			scale: 1,
			sequences: [[0],[1,2,3]],
			intervals: 30
		})

		this.initHint()
		this.initSellHint()
	}

	tap(mult: number = 1): number {
		this.fill -= 3e-3 * mult//1.2e-2 * mult
		if (this.fill <= 0){
			this.fill = 0
			this.sprite.switchSequence(0)
			if (this.state === 2) this.shootExhaust()
			this.state = 0
		}
		return 625
	}

	update(){
		if (this.state === 2 && this.sprite.currentSequence === 0) this.sprite.switchSequence(1)
	}

	render(dt?: number, vposition?: Vec2){

		const position = vposition ? vposition : this.position

		this.sprite.render(position, dt)

		if (this.fill){
			const screen = this.context.coordinates.uvToXY([position[0] - .25, position[1] - .48])
			const scale = .2 + this.fill * .8
			this.context.render.ctx.save()
			const tr = this.context.coordinates.translation || [0, 0];
			this.context.render.ctx.translate(screen[0] + (Math.random() * 2 - 1) * this.context.render.unit * .01 + tr[0] * scale * this.context.render.zoom, screen[1] + (Math.random() * 2 - 1) * this.context.render.unit * .01 + tr[1] * scale * this.context.render.zoom)
			this.context.render.ctx.scale(scale,scale)
			this.context.render.resourceSprite(`hell-gem`)?.render([0,0])
			this.context.render.ctx.restore()
		}

	}

}
