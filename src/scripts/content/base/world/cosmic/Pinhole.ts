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
			this.context.audio.playSound(`lightning`)
			this.master.createHollowEvent(`#000`, 50000)
			this.happened = true

			const vsPos = this.context.references.voidsculpturePosition()
			if (vsPos) this.context.spatial.clearCell(vsPos)
			if (this.master.shop?.vessel) this.master.shop.vessel.style.display = `none`
			if (this.master.shop?.shopToggle) this.master.shop.shopToggle.style.display = `none`
			const hollowSite = this.context.references.hollowSite()
			if (hollowSite) hollowSite.spawnTimerBase = 2000
			this.context.references.registerPinhole(this)
			this.context.audio.playSound(`endingMusic`,undefined,undefined,undefined,true)

			this.totalCount = this.context.spatial.entityCount()

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

		this.maxFlashTimer = Math.max(250, this.finalTimer / (this.context.spatial.entityCount() + 1) * 2)

		if (this.flashTimer <= 0){
			this.flashTimer = this.maxFlashTimer * Math.random()// * (this.context.spatial.entityCount() < 4 ? .2 : 1)

			const entities = this.context.spatial.entities()
			const entity = entities[Math.floor(Math.random() * entities.length)]
			
			const exy = this.context.coordinates.uvToXYUntranslated(entity.position)
			const gxy = this.context.coordinates.uvToXYUntranslated([this.position[0] - 1, this.position[1] - 1])

			this.context.audio.playSound(`lightning`, undefined, undefined, this.context.plane.plane ? true : false)
			this.context.effects.createLightning([], exy, gxy, (_?: unknown) => {}, [1,1], this.context.plane.plane ? `#FFF` : `#112`)

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
				this.context.effects.createResourceExplosion(this.master.getRealPrice(entity.name), exy)
				this.context.spatial.clearCell(entity.position)
			} else if (entity.name === `strange3`){
				this.context.audio.playSound(`horn`)
			}

		}

		if (this.switchTimer <= 0){
			this.switchTimer = this.maxSwitchTimer
			this.context.audio.playSound(`teleport`,undefined,undefined, this.context.plane.plane ? true : false,true)
			this.context.plane.switchPlane(this.context.plane.plane ? 0 : 1)
		}

		this.f = 1 - ((this.context.spatial.entityCount() - 2) / this.totalCount)


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
