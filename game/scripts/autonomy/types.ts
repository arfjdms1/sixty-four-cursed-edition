import type { Vec2 } from '../../types/core.js'
import type { Pump } from '../entities/Pump.js'
import type { GameEntity } from '../game/types.js'

export interface AutonomyHost {
	chasm?: GameEntity
}

export interface PumpZone {
	pump: Pump
	speed: number
	uvs: Vec2[]
}
