import type { ColorTriplet, ResourceAmounts, Vec2 } from '../../../../../types/core.js'
import type { EntityHost } from '../../../../engine/entities/types.js'
import { Entity } from '../../../../engine/entities/Entity.js'
import { Sprite } from '../../../../sprites.js'
import { Cloud } from '../../../../ui.js'

export class Waypoint extends Entity{

	constructor(master: EntityHost, owner?: unknown){
		super(master)
		this.name = `waypoint`
		this.soulPower = 2
		this.fuel = [0,0,0,0,512]

		this.sprite = new Sprite({
			master: this.master,
			src: `resources/images/waypoint.png`,
			frames: [[0,0,455,616],[455,0,455,616],[910,0,455,616]],
			origins: [226,484],
			scale: 1,
			sequences: [0,1,2],
			intervals: 60
		})

		this.initHint()
		this.initSellHint()
	}

	canHit(){
		return true
	}

	getHint(): Cloud | false | undefined {
		return this.hint || false
	}

	initHint(){

		this.hint = new Cloud(this.master)
		this.hint.addResourceList([0,0,0,0,512])

		this.hint.addDescription(`<b>${this.master.words.entities[this.name].name}</b><br/>${this.master.words.entities[this.name].description}`)
		this.hint.addQEString(true,true)

	}

	init(){

		const o = this.master.addWaypoint(this, this.order);
		if (typeof o === "number") this.order = o;
		
	}

	onmousedown(){

		const good = this.context.resources.requestResources([0,0,0,0,512],this.position)

		if (good){
			const prerequisites = this.master.voidsculpture && !this.context.plane.switchedplanes && (Math.random() < .5)
			if (prerequisites){

				this.context.plane.markPlanesSwitched()
				this.context.plane.switchPlane(1)
				this.context.audio.playSound(`teleport`,undefined,undefined,undefined,true)
				this.master.createHollowEvent(`#000`, this.master.voidsculpture ? 1000 : 10000)

				//Gamepad
				const gamepad = navigator.getGamepads()[0]
				if (gamepad && gamepad.vibrationActuator){
					gamepad.vibrationActuator?.reset()
					gamepad.vibrationActuator?.playEffect(`dual-rumble`,{
					startDelay: 0,
					  duration: 200,
					  weakMagnitude: .4,
					  strongMagnitude: .6,
					})
				}

			} else {

				this.master.useWaypoint(this)
				this.context.audio.playSound(`teleport`,undefined,undefined,undefined,true)
				this.master.createHollowEvent(`#000`, this.master.voidsculpture ? 1000 : 10000)
				this.master.stats.timesTeleported++

				//Gamepad
				const gamepad = navigator.getGamepads()[0]
				if (gamepad && gamepad.vibrationActuator){
					gamepad.vibrationActuator?.reset()
					gamepad.vibrationActuator?.playEffect(`dual-rumble`,{
					startDelay: 0,
					  duration: 200,
					  weakMagnitude: .2,
					  strongMagnitude: 0,
					})
				}

			}
		}
		
	}

	onDelete(){

		this.master.removeWaypoint?.(this)
		
	}

	render(dt?: number, vposition?: Vec2){

		this.sprite.render(vposition ? vposition : this.position, dt)

	}

	// drawHint(){

	// 	const ctx = this.master.ctx

	// 	ctx.font = this.master.bigFont
	// 	ctx.textAlign = `left`
	// 	ctx.save()
	// 	ctx.translate(this.master.unit / 2,0)
	// 	ctx.scale(.5, .5)

	// 	ctx.globalAlpha = 1
	// 	ctx.fillStyle = `#FFFE`
		
	// 	const sprite = this.master.resourcesSprites[4]
	// 	ctx.fillRect(-this.master.unit / 3, -this.master.unit / 3, this.master.unit * (1.4), this.master.unit * .6)
	// 	const mask = sprite.frames[sprite.sequences[sprite.currentSequence][sprite.currentFrame]]
	// 	const origin = sprite.origins[sprite.sequences[sprite.currentSequence][sprite.currentFrame]]
	// 	const scale = this.master.unit * 1.737 / mask[2] * sprite.scale

	// 	ctx.globalAlpha = this.context.resources.amount('hell-gem') >= 512 ? 1 : .3

	// 	ctx.drawImage(
	// 		sprite.img, 
	// 		mask[0], 
	// 		mask[1], 
	// 		mask[2], 
	// 		mask[3], 
	// 		-origin[0]*scale, 
	// 		-origin[1]*scale, 
	// 		mask[2]*scale, 
	// 		mask[3]*scale
	// 	)

	// 	ctx.fillStyle = `#000`
	// 	ctx.fillText(512, this.master.unit/3, 0)
		

	// 	ctx.restore()

	// }

}
