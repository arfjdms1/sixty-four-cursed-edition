import type { ColorTriplet, ResourceAmounts, Vec2 } from '../../../../../types/core.js'
import type { EntityHost } from '../../../../engine/entities/types.js'
import { Entity } from '../../../../engine/entities/Entity.js'
import { Sprite } from '../../../../sprites.js'
import { Cloud } from '../../../../ui.js'

export class Voidsculpture extends Entity{

	constructor(master: EntityHost){
		super(master)
		this.entityHeight = 3.5
		this.name = `voidsculpture`
		
		this.threshold = 512
		this.bridge = false
		this.fuel = [0,0,0,0,0,0,0,0,1]
		this.darkFuel = [0,0,0,0,0,0,0,0,0,1]

		this.sprite = new Sprite({
			master: this.master,
			src: `img/voidsculpture.png`,
			frames: [[0,0,455,1100]],
			origins: [226,968],
			scale: 1,
			sequences: [0],
			intervals: 100
		})
		this.darksprite = new Sprite({
			master: this.master,
			src: `img/voidsculpture_dark.png`,
			frames: [[0,0,455,385]],
			origins: [226,254],
			scale: 1,
			sequences: [0],
			intervals: 100
		})

		this.initHint()
		this.initSellHint()
	}

	getHint(){
		return (this.master.plane === 0 && this.master.bridge) ? this.hints[0] : false
	}
	getDarkHint(){
		return this.master.resources[9] >= this.threshold ? this.hints[1] : false
	}

	initHint(){
		this.hints = [new Cloud(this.master), new Cloud(this.master)]
		this.hints[0].addResourceList([0,0,0,0,0,0,0,0,1])
		this.hints[1].addResourceList([0,0,0,0,0,0,0,0,0,1])
		this.hints[1].setDarkMode()

		this.hints[0].addDescription(`<b>${this.master.words.entities[this.name || "voidsculpture"].name}</b><br/>${this.master.words.entities[this.name || "voidsculpture"].description}`)
		this.hints[0].addQEString(false,true)
	}

	ondarkhover(){}

	init(){

		this.master.voidsculpture = this

	}

	canHit(){
		return (this.master.plane === 0 && this.master.bridge && this.master.resources[8] >= 1) || (this.master.plane === 1)
	}
	canDarkHit(){
		return this.master.resources[9] >= this.threshold
	}

	onDelete(){

		this.master.voidsculpture = false

	}

	ondarkmousedown(){
		if (this.master.resources[9] >= this.threshold){
			this.master.bridge = true
			this.master.substractResourcesFromArray([0,0,0,0,0,0,0,0,0,1])
			this.master.switchPlane(0)
			this.master.playSound(`teleport`,undefined,undefined,undefined,true)
			this.master.createHollowEvent(`#FFF`, 20000)

			//Gamepad
			const gamepad = navigator.getGamepads()[0]
			if (gamepad){
				gamepad.vibrationActuator?.reset()
				gamepad.vibrationActuator?.playEffect(`dual-rumble`,{
				startDelay: 0,
				  duration: 200,
				  weakMagnitude: .2,
				  strongMagnitude: .4,
				})
			}
		}
	}

	onmousedown(){
		if (this.master.bridge && this.master.resources[8] >= 1){
			this.master.substractResourcesFromArray([0,0,0,0,0,0,0,0,1])
			this.master.switchPlane(1)
			this.master.playSound(`teleport`,undefined,undefined,undefined,true)

			//Gamepad
			const gamepad = navigator.getGamepads()[0]
			if (gamepad && gamepad.vibrationActuator){
				gamepad.vibrationActuator?.reset()
				gamepad.vibrationActuator?.playEffect(`dual-rumble`,{
				startDelay: 0,
				  duration: 200,
				  weakMagnitude: .2,
				  strongMagnitude: .4,
				})
			}

		}
	}

	render(dt?: number, vposition?: Vec2){

		this.sprite.render(vposition ? vposition : this.position)

		if (this.master.bridge && !vposition){

			const radius = this.master.unit * 1
			const da = .05
			const time = performance.now() / 1000

			const ctx = this.master.ctx
			const xy = this.master.uvToXY(this.position)
			ctx.save()
			ctx.translate(xy[0], xy[1] - this.master.unit * 3.6)
			ctx.fillStyle = `#000`

			ctx.beginPath()
			ctx.moveTo(radius + radius * Math.sin(time) * .04 + radius * Math.sin(time*1.3) * .04 + radius * Math.sin(-time*1.9) * .02, 0)
			for (let a = da; a < Math.PI * 2; a+=da){

				const r = radius + radius * Math.sin(a * 5 + time) * .04 + radius * Math.sin(a * 4 + time*1.3) * .04 + radius * Math.sin(a * 7 - time*1.9) * .02
				ctx.lineTo(r * Math.cos(a), r * Math.sin(a))

			}

			ctx.closePath()
			ctx.fill()
			ctx.restore()

		}

	}
	darkrender(dt?: number, vposition?: Vec2){

		const position = vposition ? vposition : this.position
		const radius = this.master.unit * (Math.min(1, this.master.resources[9] / this.threshold) + .01)
		const da = .05
		const time = performance.now() / 1000

		this.darksprite.render(vposition ? vposition : this.position)

		const ctx = this.master.ctx
		const xy = this.master.uvToXY(position)
		ctx.save()
		ctx.translate(xy[0], xy[1] - this.master.unit)
		ctx.fillStyle = `#FFF`

		ctx.beginPath()
		ctx.moveTo(radius + radius * Math.sin(time) * .04 + radius * Math.sin(time*1.3) * .04 + radius * Math.sin(-time*1.9) * .02, 0)
		for (let a = da; a < Math.PI * 2; a+=da){

			const r = radius + radius * Math.sin(a * 5 + time) * .04 + radius * Math.sin(a * 4 + time*1.3) * .04 + radius * Math.sin(a * 7 - time*1.9) * .02
			ctx.lineTo(r * Math.cos(a), r * Math.sin(a))

		}

		ctx.closePath()
		ctx.fill()

		if (this.master.resources[9] >= this.threshold){
			const gradient = ctx.createRadialGradient(0,0,0,0,0,this.master.unit * 8)
			gradient.addColorStop(0,`#FFF9`)
			gradient.addColorStop(1,`#FFF0`)
			ctx.fillStyle = gradient
			ctx.beginPath()
			ctx.arc(0,0,this.master.unit * 8,0,Math.PI * 2)
			ctx.closePath()
			ctx.fill()
		}

		ctx.restore()

	}
	renderDarkHint(){

		const ctx = this.master.ctx


		const startAngle = -Math.PI / 2
		const endAngle = Math.PI * 2 * Math.min(1, this.master.resources[9] / this.threshold) + startAngle
		
		const radius = this.master.pixelRatio * 10

		ctx.lineCap = `round`

		ctx.lineWidth = this.master.pixelRatio * 2
		ctx.strokeStyle = `#fff`
		ctx.beginPath()
		ctx.arc(0, 0, radius, startAngle, endAngle)
		ctx.stroke()

		if (this.master.resources[9] > this.threshold){
			ctx.fillStyle = `#FFF`
			ctx.beginPath()
			ctx.arc(0, 0, this.master.unit * .06, 0, Math.PI * 2)
			ctx.closePath()
			ctx.fill()

			ctx.fillStyle = `#000`
			if (this.master.bigFont) ctx.font = this.master.bigFont
			ctx.textAlign = `left`
			ctx.save()
			ctx.translate(this.master.unit / 2,0)
			ctx.scale(.5, .5)

			const sprite = this.master.resourcesSprites[9]
			const p = [0, this.master.unit * .6]
			ctx.fillRect(-this.master.unit / 3, -this.master.unit / 3 + p[1], this.master.unit * 1, this.master.unit * .65)
			const mask = sprite.frames[sprite.sequences[sprite.currentSequence][sprite.currentFrame]]
			const origin = sprite.origins[sprite.sequences[sprite.currentSequence][sprite.currentFrame]]
			const scale = this.master.unit * 1.737 / mask[2] * sprite.scale

			ctx.drawImage(
				sprite.img, 
				mask[0], 
				mask[1], 
				mask[2], 
				mask[3], 
				p[0] - origin[0]*scale, 
				p[1] - origin[1]*scale, 
				mask[2]*scale, 
				mask[3]*scale
			)

			ctx.fillStyle = `#FFF`
			ctx.fillText("1", p[0] + this.master.unit/3, p[1])
			ctx.restore()


		}
			
	}

}
