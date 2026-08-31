import type { ColorTriplet, ResourceAmounts, Vec2 } from '../../../../../types/core.js'
import type { EntityHost } from '../../../../engine/entities/types.js'
import { Entity } from '../../../../engine/entities/Entity.js'
import { Sprite } from '../../../../sprites.js'

export class Pinhole extends Entity{

	constructor(master: EntityHost){
		super(master)
		this.name = `pinhole`
		this.indestructible = true
		this.happened = false

		this.f = 0

		this.maxFlashTimer = 2000
		this.flashTimer = this.maxFlashTimer * Math.random()

		this.maxSwitchTimer = 16000
		this.switchTimer = 32000

		this.sprite = new Sprite({
			master: this.master,
			src: `resources/images/pinhole.png`,
			frames: [[0,0,454,299]],
			origins: [227,167],
			scale: 1,
			sequences: [0],
			intervals: 100
		})

		this.shopsprite = new Sprite({
			master: this.master,
			src: `resources/images/chasm.png`,
			frames: [[0,0,454,559]],
			origins: [227,428],
			scale: 1,
			sequences: [0],
			intervals: 100
		})
	}

	initHint(){}

	init(){

		if (!this.happened){
			this.master.playSound(`lightning`)
			this.master.createHollowEvent(`#000`, 50000)
			this.happened = true

			if (this.master.voidsculpture) this.master.clearCell(this.master.voidsculpture.position)
			if (this.master.shop?.vessel) this.master.shop.vessel.style.display = `none`
			if (this.master.shop?.shopToggle) this.master.shop.shopToggle.style.display = `none`
			if (this.master.hollowSite) (this.master.hollowSite as { spawnTimerBase?: number }).spawnTimerBase = 2000
			this.master.pinhole = this
			this.master.playSound(`endingMusic`,undefined,undefined,undefined,true)

			this.totalCount = this.master.stuff.length

			//TST
			this.finalTimer = 300000
			// const timeGoal = 300000
			// this.maxFlashTimer = timeGoal / this.totalCount * 2

			setTimeout((_event?: unknown)=>this.master.rbrtimeup = true, 640)
		}

	}

	update(dt?: number){

		if (dt) this.flashTimer -= dt
		if (dt) this.switchTimer -= dt
		if (dt) this.finalTimer -= dt

		this.maxFlashTimer = Math.max(250, this.finalTimer / (this.master.stuff.length + 1) * 2)

		if (this.flashTimer <= 0){
			this.flashTimer = this.maxFlashTimer * Math.random()// * (this.master.stuff.length < 4 ? .2 : 1)

			const entity = this.master.stuff[Math.floor(Math.random() * this.master.stuff.length)]
			
			const exy = this.master.uvToXYUntranslated(entity.position)
			const gxy = this.master.uvToXYUntranslated([this.position[0] - 1, this.position[1] - 1])

			this.master.playSound(`lightning`, undefined, undefined, this.master.plane ? true : false)
			this.master.createLightning([], exy, gxy, (_?: unknown) => {}, [1,1], this.master.plane ? `#FFF` : `#112`)

			//Gamepad
			const gamepad = navigator.getGamepads()[0]
			if (gamepad){
				gamepad.vibrationActuator?.reset()
				gamepad.vibrationActuator?.playEffect(`dual-rumble`,{
				startDelay: 0,
				  duration: 50,
				  weakMagnitude: .6,
				  strongMagnitude: .2
				})
			}

			//(entity.name === `mega1b` && this.master.stuff.length > 4)
			if (entity.name !== `pinhole` && entity.name !== `strange3`){
				this.master.createResourceExplosion(this.master.getRealPrice(entity.name), exy)
				this.master.clearCell(entity.position)
			} else if (entity.name === `strange3`){
				this.master.playSound(`horn`)
			}

		}

		if (this.switchTimer <= 0){
			this.switchTimer = this.maxSwitchTimer
			this.master.playSound(`teleport`,undefined,undefined, this.master.plane ? true : false,true)
			this.master.switchPlane(this.master.plane ? 0 : 1)
		}

		this.f = 1 - ((this.master.stuff.length - 2) / this.totalCount)


	}

	onDelete(){


	}

	render(dt?: number, vposition?: Vec2){

		if (vposition){

			this.shopsprite.renderState(vposition,0)

		} else {

			this.sprite.render(this.position)

		}

	}

}
