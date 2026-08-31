import type { EntityHost } from '../entities/types.js'
import type { GameEntity } from '../game/types.js'

export type EntityKind = 'machine' | 'entity' | 'world'

export type EntityFamilyId =
	| 'pumps'
	| 'channels'
	| 'destabilizers'
	| 'entropics'
	| 'converters'
	| 'storage'
	| 'industrial'
	| 'clickers'
	| 'stabilizers'
	| 'megas'
	| 'minerals'
	| 'monoliths'
	| 'botanicals'
	| 'cosmic'
	| 'anomalies'

export type EntityCapability =
	| 'extractor'
	| 'fuelConsumer'
	| 'storage'
	| 'clickable'
	| 'indestructible'
	| 'relocatable'
	| 'multiCell'
	| 'soulProducer'
	| 'annihilator'
	| 'auxSpeedBoost'
	| 'instantPowerProvider'
	| 'continuousPowerProvider'
	| 'singleton'

export type RuntimeEntityConstructor = new (master: EntityHost, misc?: unknown) => GameEntity

export interface BaseEntityMetadata {
	id: string
	kind: EntityKind
	family: EntityFamilyId
	capabilities: readonly EntityCapability[]
}

export interface EntityDefinition extends BaseEntityMetadata {
	constructor: RuntimeEntityConstructor
	isUpgradeTo?: string
	onlyone?: boolean
	canPurchase?: boolean
}
