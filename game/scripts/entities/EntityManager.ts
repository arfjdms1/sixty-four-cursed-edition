import type { Vec2 } from '../../types/core.js'
import type { GameEntity } from '../game/types.js'
import { Cube } from './Cube.js'
import { Vessel } from './Vessel.js'
import type { EntityManagerHost } from './manager-types.js'
import type { EntityHost } from './types.js'

export class EntityManager {
	host: EntityManagerHost
	entityHost: EntityHost
	declare stuff: GameEntity[]
	declare stuffMap: Record<string, GameEntity | undefined>
	declare entitiesInGame: Record<string, number>
	declare chromaToContain: number

	constructor(host: EntityManagerHost, entityHost: EntityHost){
		this.host = host
		this.entityHost = entityHost
	}

	initEntities(): void {
		this.stuff = []
		this.stuffMap = {}
		this.entitiesInGame = {}
		this.chromaToContain = 0
	}

	entityAtCoordinates(pos: Vec2): GameEntity | undefined {
		return this.stuffMap[`u${pos[0]}v${pos[1]}`]
	}

	addEntity(name: string, position: Vec2, misc?: unknown, options: { skipShopUpdate?: boolean } = {}): GameEntity | false {
		//Make check for bigger entities zzz
		if (this.host.codex.entities[name] && !this.entityAtCoordinates(position)){
			let entity: GameEntity | false
			try {
				entity = new this.host.codex.entities[name].class!(this.entityHost, misc) as GameEntity
			} catch {
				entity = false
			}

			if (entity){
				this.stuff.push(entity)
				if (!entity.entitySpan) {
					this.stuffMap[`u${position[0]}v${position[1]}`] = entity
				} else {
					const s = entity.entitySpan
					for (let dy = -s; dy <= s; dy++){
						for (let dx = -s; dx <= s; dx++){
							this.stuffMap[`u${position[0]+dx}v${position[1]+dy}`] = entity
						}
					}
				}
				
				entity.setPosition(position)
				this.stuff.sort((a,b)=>a.position[0] + a.position[1] - b.position[0] - b.position[1])

				//AUTOINIT everything around
				if (!(entity instanceof Cube)){
					for (let i = 0; i < entity.soi.length; i++){
						const cell = this.stuffMap[`u${entity.position[0] + entity.soi[i][0]}v${entity.position[1] + entity.soi[i][1]}`]
						if (cell){
							cell.init()
						}
					}
				}

				if (!this.entitiesInGame[entity.name]) {
					this.entitiesInGame[entity.name] = 1
				} else {
					this.entitiesInGame[entity.name]!++
				}

				if (!options.skipShopUpdate && name !== `cube`) this.host.shop?.updateElements()
			}

			return entity
		} else {
			// console.log(`This place is occupied`)
		}
		return false
	}

	clearCell(uv: Vec2): void {
		const entity = this.entityAtCoordinates(uv)
		if (!entity) return
		if (entity.onDelete) entity.onDelete()
		const n = entity.getNeighbours()

		this.entitiesInGame[entity.name]!--
		this.host.shop?.updateElements()

		if (!entity.entitySpan) {
			delete this.stuffMap[`u${entity.position[0]}v${entity.position[1]}`]
		} else {
			const s = entity.entitySpan
			for (let dy = -s; dy <= s; dy++){
				for (let dx = -s; dx <= s; dx++){
					delete this.stuffMap[`u${entity.position[0]+dx}v${entity.position[1]+dy}`]
				}
			}
		}
		
		for (let i = 0; i < this.stuff.length; i++){
			if (this.stuff[i] === entity){
				this.stuff.splice(i,1)
				break
			}
		}

		for (let i = 0; i < n.length; i++){
			if (n[i]) n[i]!.init()
		}
	}

	relocate(e: GameEntity, p: Vec2): void {
		const n = e.getNeighbours()
		const targetEntity = this.entityAtCoordinates(p)

		//Clean up without triigering ondelete
		if (!e.entitySpan) {
			delete this.stuffMap[`u${e.position[0]}v${e.position[1]}`]
		} else {
			const s = e.entitySpan
			for (let dy = -s; dy <= s; dy++){
				for (let dx = -s; dx <= s; dx++){
					delete this.stuffMap[`u${e.position[0]+dx}v${e.position[1]+dy}`]
				}
			}
		}

		//relocate
		if (!e.entitySpan) {
			this.stuffMap[`u${p[0]}v${p[1]}`] = e
		} else {
			const s = e.entitySpan
			for (let dy = -s; dy <= s; dy++){
				for (let dx = -s; dx <= s; dx++){
					this.stuffMap[`u${p[0]+dx}v${p[1]+dy}`] = e
				}
			}
		}

		//swap
		if (targetEntity) {
			this.stuffMap[`u${e.position[0]}v${e.position[1]}`] = targetEntity
			targetEntity.setPosition([...e.position] as Vec2)
		}
		
		e.setPosition(p)

		this.stuff.sort((a,b)=>a.position[0] + a.position[1] - b.position[0] - b.position[1])

		//update new neighbours
		for (let i = 0; i < e.soi.length; i++){
			const cell = this.stuffMap[`u${e.position[0] + e.soi[i][0]}v${e.position[1] + e.soi[i][1]}`]
			if (cell){
				cell.init()
			}
		}

		//update previous neighbours
		for (let i = 0; i < n.length; i++){
			if (n[i]) n[i]!.init()
		}
	}

	updateEntities(dt: number): void {
		this.chromaToContain = this.host.resources[5]
		// this.unfilledEntities = []

		for (let i = 0; i < this.stuff.length; i++){
			if (this.stuff[i].killme){
				this.stuff[i].onDelete()
				this.entitiesInGame[this.stuff[i].name]!--
				delete this.stuffMap[`u${this.stuff[i].position[0]}v${this.stuff[i].position[1]}`]
				this.stuff.splice(i,1)
				i--
			} else {
				//Halflife stuff
				if (this.stuff[i] instanceof Vessel){
					if (this.chromaToContain && this.stuff[i].state === 2){
						this.stuff[i].tap!(dt)
						this.stuff[i].isUsed = true
						this.chromaToContain = Math.max(0, this.chromaToContain - this.stuff[i].capacity)
					} else {
						this.stuff[i].isUsed = false
					}
				}

				this.stuff[i].update(dt)
				this.stuff[i]?.updateSoul(dt)
				// if (this.stuff[i]?.fill === 0 && !(this.stuff[i] instanceof Cube)) this.unfilledEntities.push(this.stuff[i])
				// if (!(this.stuff[i] instanceof Cube) && this.stuff[i]?.fill === 0 && !this.stuff[i].isNextToSilo) this.unfilledEntities.push(this.stuff[i])
			}
		}
	}
}
