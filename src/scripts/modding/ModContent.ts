import type { ContentBuilder } from '../content/ContentContext.js'
import type { EntityDefinition } from '../registry/types.js'
import type { ResourceDefinition } from '../registry/resource-types.js'
import type { ModContentApi, ModEntityBehavior, ModEntityContext, ModEntityDefinition, ModEntityRef, ModEntitySelf, ModId, ModLogger, ModResourceDefinition } from './types.js'
import { Entity } from '../engine/entities/Entity.js'
import type { EntityHost } from '../engine/entities/types.js'
import type { Vec2 } from '../../types/core.js'
import type { ResourceTypeId } from '../registry/resource-types.js'

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function requiredTrimmedString(record: Record<string, unknown>, key: string, kind: string): string {
	const value = record[key]
	if (typeof value !== 'string' || !value.trim() || value !== value.trim()) {
		throw new Error(`Invalid ${kind} ${key}: must be a non-empty trimmed string`)
	}
	return value
}

class InertModEntity extends Entity {
	constructor(host: EntityHost) {
		super(host)
	}
}

function createInertConstructor(id: string): EntityDefinition['constructor'] {
	const ctor = class extends InertModEntity {
		constructor(host: EntityHost, misc?: unknown) {
			super(host)
			this.name = id
		}
	}
	return ctor as EntityDefinition['constructor']
}

function createBehavioralConstructor(
	definition: ModEntityDefinition,
	modId: ModId,
	logger: ModLogger,
): EntityDefinition['constructor'] {
	const behaviorFactory = definition.createBehavior as (() => ModEntityBehavior) | undefined
	if (typeof behaviorFactory !== 'function') throw new Error(`Invalid entity definition for ${definition.id}: createBehavior must be a function`)
	return class extends Entity {
		private readonly modLogger = logger
		private readonly modId = modId
		private readonly definitionId = definition.id
		private behavior: ModEntityBehavior | undefined
		private modSelf: ModEntitySelf | undefined
		private modContext: ModEntityContext | undefined

		constructor(host: EntityHost, misc?: unknown) {
			super(host)
			this.name = definition.id
			try {
				const b = (behaviorFactory as () => ModEntityBehavior)()
				if (!b || typeof b !== 'object') throw new Error(`createBehavior must return an object`)
				this.behavior = b
			} catch (error) {
				this.modLogger.error(`[${this.modId} entity:${this.definitionId} factory]`, error)
				throw error
			}
			const entity: Entity = this
			const stableSelf: ModEntitySelf = {
				get typeId() { return definition.id },
				get position(): Vec2 {
					const p = entity.position as Vec2 | undefined
					return p ? [p[0], p[1]] as Vec2 : [0, 0] as Vec2
				},
			}
			this.modSelf = stableSelf
			const resources = {
				amount: (id: ResourceTypeId): number => {
					try {
						return host.entityContext.resources.amount(id)
					} catch {
						return 0
					}
				},
			}
			const spatial = {
				entityAt: (pos: Vec2): ModEntityRef | undefined => {
					try {
						const found = host.entityContext.spatial.entityAt(pos)
						if (!found) return undefined
						return Object.freeze({
							typeId: found.name,
							position: [found.position[0], found.position[1]] as Vec2,
						})
					} catch {
						return undefined
					}
				},
			}
			this.modContext = Object.freeze({
				self: stableSelf,
				logger: this.modLogger,
				resources,
				spatial,
			})
		}

		override init(): void {
			if (this.behavior?.init) {
				try {
					this.behavior.init(this.modContext as ModEntityContext)
				} catch (error) {
					this.modLogger.error(`[${this.modId} entity:${this.definitionId} init]`, error)
				}
			}
		}

		override update(dt: number): void {
			if (this.behavior?.update) {
				try {
					this.behavior.update(dt, this.modContext as ModEntityContext)
				} catch (error) {
					this.modLogger.error(`[${this.modId} entity:${this.definitionId} update]`, error)
				}
			}
		}
	} as EntityDefinition['constructor']
}

function validateEntityDefinition(definition: ModEntityDefinition): void {
	if (!isRecord(definition)) throw new Error(`Invalid entity definition: expected an object`)
	const record = definition as Record<string, unknown>
	const id = requiredTrimmedString(record, 'id', 'entity')
	if (Object.hasOwn(record, 'constructor')) {
		throw new Error(`Invalid entity definition for ${id}: custom constructors are not supported; use createBehavior`)
	}
	if (record.createBehavior !== undefined && typeof record.createBehavior !== 'function') {
		throw new Error(`Invalid entity definition for ${id}: createBehavior must be a function`)
	}
	if (record.capabilities !== undefined && !Array.isArray(record.capabilities)) {
		throw new Error(`Invalid entity definition for ${id}: capabilities must be an array`)
	}
}

function validateResourceDefinition(definition: ModResourceDefinition): void {
	if (!isRecord(definition)) throw new Error(`Invalid resource definition: expected an object`)
	const record = definition as Record<string, unknown>
	const id = requiredTrimmedString(record, 'id', 'resource')
	requiredTrimmedString(record, 'name', 'resource')
	requiredTrimmedString(record, 'sfx', 'resource')
	const triplet = record.triplet
	if (!Array.isArray(triplet) || triplet.length !== 3 || triplet.some(entry => typeof entry !== 'string')) {
		throw new Error(`Invalid resource definition for ${id}: triplet must be a [string, string, string]`)
	}
	if (Object.hasOwn(record, 'legacyIndex')) {
		throw new Error(`Invalid resource definition for ${id}: legacyIndex must not be set for mod resources`)
	}
}

export class StagedModContent implements ModContentApi {
	private pendingEntities: EntityDefinition[] = []
	private pendingResources: ResourceDefinition[] = []
	private pendingEntityIds = new Set<string>()
	private pendingResourceIds = new Set<string>()
	private finished = false

	constructor(
		private readonly modId: ModId,
		private readonly builder: ContentBuilder,
		private readonly logger: ModLogger,
	) {}

	registerEntity(definition: ModEntityDefinition): void {
		if (this.finished) throw new Error(`Cannot register content after mod setup has completed for ${this.modId}`)
		if (this.builder.isFinalized()) throw new Error(`Cannot register entity ${definition.id}: content is already finalized`)
		validateEntityDefinition(definition)
		if (this.pendingEntityIds.has(definition.id) || this.builder.hasEntityId(definition.id)) {
			throw new Error(`Duplicate entity ID: ${definition.id}`)
		}
		const ctor = definition.createBehavior
			? createBehavioralConstructor(definition, this.modId, this.logger)
			: createInertConstructor(definition.id)
		const entityDefinition: EntityDefinition = {
			id: definition.id,
			constructor: ctor,
			kind: definition.kind ?? 'machine',
			family: definition.family ?? 'industrial',
			capabilities: definition.capabilities ?? ['relocatable', 'soulProducer'],
			isUpgradeTo: definition.isUpgradeTo,
			onlyone: definition.onlyone,
			canPurchase: definition.canPurchase,
		}
		this.pendingEntities.push(Object.freeze(entityDefinition))
		this.pendingEntityIds.add(definition.id)
	}

	registerResource(definition: ModResourceDefinition): void {
		if (this.finished) throw new Error(`Cannot register content after mod setup has completed for ${this.modId}`)
		if (this.builder.isFinalized()) throw new Error(`Cannot register resource ${definition.id}: content is already finalized`)
		validateResourceDefinition(definition)
		if (this.pendingResourceIds.has(definition.id) || this.builder.hasResourceId(definition.id)) {
			throw new Error(`Duplicate resource ID: ${definition.id}`)
		}
		const resourceDefinition: ResourceDefinition = {
			id: definition.id,
			name: definition.name,
			sfx: definition.sfx,
			triplet: definition.triplet,
			surgeTriplet: definition.surgeTriplet,
			chances: definition.chances ? [...definition.chances] : undefined,
			probabilities: definition.probabilities ? [...definition.probabilities] : undefined,
			mean: definition.mean,
			stdev: definition.stdev,
			base: definition.base,
		}
		this.pendingResources.push(Object.freeze(resourceDefinition))
		this.pendingResourceIds.add(definition.id)
	}

	commit(): void {
		if (this.finished) return
		this.finished = true
		for (const definition of this.pendingEntities) {
			this.builder.addEntityDefinition(definition)
		}
		for (const definition of this.pendingResources) {
			this.builder.addResourceDefinition(definition)
		}
	}

	discard(): void {
		this.finished = true
		this.pendingEntities.length = 0
		this.pendingResources.length = 0
		this.pendingEntityIds.clear()
		this.pendingResourceIds.clear()
	}
}

export class ThrowingModContent implements ModContentApi {
	registerEntity(): void {
		throw new Error(`Content registration is not available outside mod setup`)
	}

	registerResource(): void {
		throw new Error(`Content registration is not available outside mod setup`)
	}
}
