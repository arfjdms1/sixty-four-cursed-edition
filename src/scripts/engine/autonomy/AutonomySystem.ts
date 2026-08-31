import type { Vec2 } from '../../../types/core.js'
import { Auxpump } from '../../content/base/machines/channels/Auxpump.js'
import { Auxpump2 } from '../../content/base/machines/channels/Auxpump2.js'
import { Cube } from '../../content/base/entities/Cube.js'
import type { EntityManager } from '../entities/EntityManager.js'
import { Entropic } from '../../content/base/machines/entropics/Entropic.js'
import { Entropic2a } from '../../content/base/machines/entropics/Entropic2a.js'
import { Pump } from '../../content/base/machines/pumps/Pump.js'
import { Silo } from '../../content/base/machines/storage/Silo.js'
import type { GameEntity } from '../../core/types.js'
import type { AutonomyHost, PumpZone } from './types.js'

export class AutonomySystem {
	host: AutonomyHost
	entities: EntityManager

	constructor(host: AutonomyHost, entities: EntityManager){
		this.host = host
		this.entities = entities
	}

	getAutonomy(): false | void {
		if (!this.host.chasm) return false

		const key = this.host.chasm.chasmNetwork
		const silos: Silo[] = []
		const automatedStuff = new Set<GameEntity>()
		const auxes = new Set<Auxpump | Auxpump2>()
		const pumps = new Set<Pump>()
		const mapTiles = new Set<string>()
		const pumpZones: PumpZone[] = []

		//Get all connected silos
		for (let i = 0; i < this.entities.stuff.length; i++){
			const s = this.entities.stuff[i]
			if (s instanceof Silo && s.chasmNetwork === key){
				silos.push(s)
			}
		}

		//Get all supplied auxes
		for (let i = 0; i < silos.length; i++){
			const s = silos[i]
			const m = s.getNeighbours()

			for (let j = 0; j < m.length; j++){
				if (m[j] && m[j] instanceof Auxpump) auxes.add(m[j] as Auxpump)
				if (m[j] && !(m[j] instanceof Cube)) automatedStuff.add(m[j] as GameEntity)
			}
		}

		//Get all automated pumps
		for (const a of auxes){
			for (let i = 0; i < a.soi.length; i++){
				const uv: Vec2 = [a.position[0] + a.soi[i][0], a.position[1] + a.soi[i][1]]
				const entity = this.entities.entityAtCoordinates(uv)
				if (entity instanceof Pump) pumps.add(entity)
			}
		}

		//Get zones available for cubes with pump speeds
		for (const p of pumps){
			const range = p.soe ? p.soe : p.soi

			//Hardcode for auxes
			let auxMult = .25
			for (let i = 0; i < p.auxes.length; i++){
				const aux = p.auxes[i]
				if (auxes.has(aux as Auxpump | Auxpump2) && aux instanceof Auxpump2){
					auxMult = 1
					break
				}
			}

			const zone: PumpZone = {
				pump: p,
				speed: p.pumpSpeed * (1 + auxMult),
				uvs: []
			}

			for (let i = 0; i < range.length; i++){
				const uv: Vec2 = [p.position[0] + range[i][0], p.position[1] + range[i][1]]
				const uvString = `u${uv[0]}v${uv[1]}`
				const entity = this.entities.entityAtCoordinates(uv)

				if (!entity || entity instanceof Cube || !mapTiles.has(uvString)) {
					zone.uvs.push(uv)
					mapTiles.add(uvString)
				}
			}

			pumpZones.push(zone)
		}

		//Check for bonuses and breakers for each spot
		const soi: Vec2[] = [[0,-1], [1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]]
		for (let i = 0; i < pumpZones.length; i++){
			const pz = pumpZones[i]

			for (let j = 0; j < pz.uvs.length; j++){
				const c = pz.uvs[j]

				let cubeBreakpower = .08
				let initialPower = 0
				let powerRate = 0
				let breakSpeed = 0

				for (let k = 0; k < soi.length; k++){
					const entity = this.entities.entityAtCoordinates( [c[0] + soi[k][0], c[1] + soi[k][1]] )
					if (!entity || !automatedStuff.has(entity)) continue
					if (entity instanceof Entropic2a) {
						initialPower += entity.power as number
					} else if (entity instanceof Entropic) {
						initialPower += entity.power as number
						powerRate += (entity.power as number) / entity.interval
					}
				}

				if(!initialPower || !powerRate) console.log(c)
			}
		}
	}
}
