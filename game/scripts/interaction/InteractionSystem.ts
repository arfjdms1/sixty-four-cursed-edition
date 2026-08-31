import type { Vec2 } from '../../types/core.js'
import { Cube } from '../entities/Cube.js'
import type { EntityManager } from '../entities/EntityManager.js'
import { Gradient } from '../entities/Gradient.js'
import { Pump } from '../entities/Pump.js'
import type { GameEntity, HeldItem } from '../game/types.js'
import type { PointerInput } from '../input/types.js'
import type { ResourceSystem } from '../resources/ResourceSystem.js'
import { Cloud } from '../ui.js'
import type { InteractionHost } from './types.js'

export class InteractionSystem {
	host: InteractionHost
	entities: EntityManager
	resources: ResourceSystem

	selectedCell: Vec2 | false = false
	selectedEntity: GameEntity | false = false
	canPlace: boolean = false
	itemInHand?: HeldItem
	itemInHandPriceTag?: Cloud
	transportedEntity?: GameEntity
	hoveredCell?: Vec2
	hoveredEntity?: GameEntity
	hoveredResource: number | false = false
	altActive: boolean = false
	pressedQOnBlank?: boolean
	pressedQOnMachine?: boolean

	constructor(host: InteractionHost, entities: EntityManager, resources: ResourceSystem){
		this.host = host
		this.entities = entities
		this.resources = resources
	}

	pickupItem(name: string): void {
		if (name === `eraser` || name === `eraser2` || name === `eraser3`){
			this.itemInHand = {name: name, eraser: true} as HeldItem
		} else {
			this.itemInHand = new this.host.codex.entities[name].class!(this.host.entityHost) as HeldItem
		}

		delete this.transportedEntity

		if (!this.itemInHand.eraser){
			this.itemInHandPriceTag = new Cloud(this.host.entityHost as ConstructorParameters<typeof Cloud>[0])
			this.itemInHandPriceTag.addResourceList(this.resources.getRealPrice(this.itemInHand.name))
		}
	}

	processMousemove(e?: PointerInput, dxy?: Vec2): void {
		const x = e?.offsetX || e?.clientX
		const y = e?.offsetY || e?.clientY

		if (e){
			this.host.updateMouseData(x as number, y as number)

			if (e.buttons === 2) {
				this.host.translation[0] -= (e.movementX as number) * this.host.pixelRatio / this.host.zoom
				this.host.translation[1] -= (e.movementY as number) * this.host.pixelRatio / this.host.zoom
			} else if (e.buttons === 1 && this.hoveredEntity) {
				//DragFill
				const n = this.hoveredEntity.name
				const donotclick = (n === `cube` || n === `pump` || n === `pump2` || n === `waypoint` || n === `voidsculpture` || n === `strange` || n === `strange1` || n === `strange2` || n === `strange3` || n === `cookie` || n === `hollow`)
				if (!this.itemInHand && !this.host.plane && !donotclick){
					this.hoveredEntity?.onmousedown()	
				}
			} else if (dxy) {
				this.host.translation[0] -= dxy[0]
				this.host.translation[1] -= dxy[1]
			}
		}

		const uv = this.host.xyToUV([this.host.mouse.offsetxy[0], this.host.mouse.offsetxy[1]])
		const targetCell: Vec2 = [Math.floor(uv[0]), Math.floor(uv[1])]
		this.hoveredCell = targetCell
		this.hoveredEntity = this.entities.entityAtCoordinates(this.hoveredCell)

		this.hoveredResource = false
		const delta = this.host.screenUnit * .3
		for (let i = 0; i < this.host.resourceHomes.length; i++){
			const home = this.host.resourceHomes[i]
			if (this.host.mouse.xy[0] > home[0] - delta && this.host.mouse.xy[0] < home[0] + delta && this.host.mouse.xy[1] > home[1] - delta && this.host.mouse.xy[1] < home[1] + delta){
				this.hoveredResource = i
				break
			}
		}

		if (this.host.plane === 1 && this.hoveredEntity && this.hoveredEntity.ondarkhover) {
			this.hoveredEntity.ondarkhover()
		}

		this.canPlace = false
		if (this.itemInHand){
			const base = this.hoveredCell && this.resources.canAfford(this.itemInHand.name)
			const eraserOk = this.itemInHand.eraser && this.hoveredEntity && !this.hoveredEntity.indestructible && !(this.hoveredEntity instanceof Cube) && !((this.hoveredEntity instanceof Pump || this.hoveredEntity instanceof Gradient) && ((this.entities.entitiesInGame[`pump`] || 0) + (this.entities.entitiesInGame[`pump2`] || 0) + (this.entities.entitiesInGame[`gradient`] || 0) < 2))
			const newOk = !this.itemInHand.eraser && !this.hoveredEntity && !this.host.codex.entities[this.itemInHand.name].isUpgradeTo
			const upgradeOk = this.hoveredEntity && !this.itemInHand.eraser && this.host.codex.entities[this.itemInHand.name]?.isUpgradeTo === this.hoveredEntity.name

			this.canPlace = this.transportedEntity ? (!this.hoveredEntity || this.canRelocate(this.hoveredEntity)) : (base && (eraserOk || newOk || upgradeOk) ? true : false)
		}
	}

	processMousedown(e?: unknown): void {
		if ((e as { buttons?: number })?.buttons !== 2){
			this.host.mouse.state = 1
			const cubeClicked = this.hoveredEntity && this.hoveredEntity.name === `cube`
			if (!this.itemInHand || cubeClicked){
				if (cubeClicked) this.host.stats.totalCubeClicks++
				if (this.hoveredEntity) {
					this.selectedEntity = this.hoveredEntity
					if (!this.host.plane) {
						this.selectedEntity.onmousedown()
					} else if (this.host.plane === 1 && this.selectedEntity.ondarkmousedown){
						this.selectedEntity.ondarkmousedown()
					}
				}
				this.processMousemove()
			}
		}
		this.host.mouse.positionChanged = false
	}

	processMouseup(): void {
		this.host.mouse.state = 0
		this.host.mouse.timer = this.host.mouse.maxTimer
		if (this.selectedEntity && !this.host.plane) this.selectedEntity.onmouseup()
		this.selectedEntity = false
	}

	processMouseout(): void {
		this.host.mouse.cursorVisible = false
		if (this.selectedEntity && !this.host.plane) this.selectedEntity.onmouseup()
		this.selectedEntity = false
		this.host.removeHint()
	}

	processQ(): void {
		if (this.itemInHand){
			delete this.itemInHand
			delete this.transportedEntity
		} else if (this.hoveredEntity && !this.host.plane){
			this.host.shop?.centerItem(this.hoveredEntity.name)

			if (this.resources.canAfford(this.hoveredEntity.name) && !this.host.onlyones[this.hoveredEntity.name] && this.host.codex.entities[this.hoveredEntity.name].canPurchase){
				this.pickupItem(this.hoveredEntity.name)
				this.pressedQOnMachine = true
			}
		} else if (!this.host.plane) {
			const eraser = this.host.eraserType === 2 ? `eraser3` : this.host.eraserType === 1 ? `eraser2` : `eraser`
			if (this.resources.canAfford(eraser)) {
				this.pressedQOnBlank = true
				this.pickupItem(eraser)
			}
		}
	}

	processE(): void {
		if (this.entities.entitiesInGame.mega3 > 0 && this.resources.resources[4] >= 1 && this.hoveredEntity && this.canRelocate(this.hoveredEntity) && !this.host.plane && !this.entities.entitiesInGame.pinhole){
			this.transportedEntity = this.hoveredEntity
			this.itemInHand = new this.host.codex.entities[this.hoveredEntity.name].class!(this.host.entityHost) as HeldItem
			delete this.itemInHandPriceTag
		}
	}

	canRelocate(e: GameEntity | false | undefined): boolean {
		if (!e || !e.name) return false
		return (this.host.codex.entities[e.name].canPurchase || e.name === `stabilizer3`) && !(e.name === `flower` || e.name === `fruit` || e.name === `strange1` || e.name === `strange2` || e.name === `strange3` || e.name === `pump` || e.name === `pump2` || e.name === `cube`)
	}

	processClick(): void {
		const ok = this.itemInHand && this.hoveredCell && this.resources.canAfford(this.itemInHand.name) && !(this.itemInHand.eraser && (this.hoveredEntity instanceof Pump || this.hoveredEntity instanceof Gradient) && ((this.entities.entitiesInGame[`pump`] || 0) + (this.entities.entitiesInGame[`pump2`] || 0) + (this.entities.entitiesInGame[`gradient`] || 0) < 2))

		if (this.transportedEntity && this.hoveredCell && this.resources.resources[4] >= 1){
			this.resources.requestResources([0,0,0,0,1], this.hoveredCell, false, true)
			this.relocate(this.transportedEntity, this.hoveredCell)
			delete this.transportedEntity
			delete this.itemInHand
		} else if (ok){
			if (!this.hoveredEntity && !this.itemInHand!.eraser && !this.host.codex.entities[this.itemInHand!.name].isUpgradeTo){
				//Placement
				const price = this.resources.getRealPrice(this.itemInHand!.name)
				this.resources.requestResources(price, this.hoveredCell as Vec2, false, true)
				this.entities.addEntity(this.itemInHand!.name, this.hoveredCell as Vec2)
				this.host.stats.machinesBuild++
				this.processMousemove()

				if (this.host.codex.entities[this.itemInHand!.name].onlyone) {
					this.host.onlyones[this.itemInHand!.name] = true
					this.host.shop?.check()
					delete this.itemInHand
				} else if (!this.resources.canAfford(this.itemInHand!.name)){
					delete this.itemInHand
				} else {
					this.pickupItem(this.itemInHand!.name)
				}
			} else if (this.hoveredEntity && this.itemInHand!.eraser && !(this.hoveredEntity instanceof Cube) && !this.hoveredEntity.indestructible){
				//Erase
				const price = this.resources.getRealPrice(this.hoveredEntity.name, true)
				const xy = this.host.uvToXYUntranslated(this.hoveredCell as Vec2)

				if (this.host.codex.entities[this.hoveredEntity.name].onlyone){
					let previous = this.host.codex.entities[this.hoveredEntity.name].isUpgradeTo
					while (previous){
						delete this.host.onlyones[previous]
						previous = this.host.codex.entities[previous]?.isUpgradeTo
					}
					delete this.host.onlyones[this.hoveredEntity.name]
					this.host.shop?.check()
				}

				this.host.createResourceTransfer(price, xy, undefined, undefined, undefined, true)
				this.resources.requestResources(this.resources.getRealPrice(this.itemInHand!.name), this.hoveredCell as Vec2, false, true)
				this.entities.clearCell(this.hoveredCell as Vec2)
				this.host.stats.machinesSold++
				this.host.stats.timeSinceLastDelete = 0
				this.hoveredEntity = undefined
			} else if (this.hoveredEntity && !this.itemInHand!.eraser && this.host.codex.entities[this.itemInHand!.name]?.isUpgradeTo === this.hoveredEntity.name){
				//Upgrade
				if (this.itemInHand!.name === `pinhole`){
					this.host.saveGame()
					this.host.preventSaving = true
				}
				this.entities.clearCell(this.hoveredCell as Vec2)
				this.host.stats.timeSinceLastDelete = 0
				const price = this.resources.getRealPrice(this.itemInHand!.name)
				const refund = this.resources.getRealPrice(this.hoveredEntity.name)
				this.host.createResourceTransfer(refund, this.host.uvToXYUntranslated(this.hoveredCell as Vec2), undefined, undefined, undefined, true)
				this.resources.requestResources(price, this.hoveredCell as Vec2, (_: unknown)=>{}, true)
				this.entities.addEntity(this.itemInHand!.name, this.hoveredEntity.position)
				this.host.stats.machinesBuild++
				if (this.host.codex.entities[this.itemInHand!.name].onlyone) {
					this.host.onlyones[this.itemInHand!.name] = true
					this.host.shop?.check()
					delete this.itemInHand
				} else if (!this.resources.canAfford(this.itemInHand!.name)){
					delete this.itemInHand
				} else {
					this.pickupItem(this.itemInHand!.name)
				}
				this.host.shop?.check()
			} else if (this.itemInHand && this.hoveredEntity && this.hoveredEntity.name !== `cube`) {
				delete this.itemInHand
			}
		}
	}

	relocate(e: GameEntity, p: Vec2): void {
		const targetEntity = this.entities.entityAtCoordinates(p)
		if (targetEntity && (targetEntity.span || !(this.canRelocate(targetEntity)))) return
		this.entities.relocate(e, p)
	}
}
