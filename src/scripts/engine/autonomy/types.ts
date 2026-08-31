import type { Vec2 } from '../../../types/core.js'
import type { Pump } from '../../content/base/machines/pumps/Pump.js'
import type { GameEntity } from '../../core/types.js'

export interface AutonomyHost {
	chasm?: GameEntity
}

export interface PumpZone {
	pump: Pump
	speed: number
	uvs: Vec2[]
}
