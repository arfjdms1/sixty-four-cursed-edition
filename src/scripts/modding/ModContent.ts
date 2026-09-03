import type { ContentBuilder } from '../content/ContentContext.js'
import type { EntityDefinition } from '../registry/types.js'
import type { ResourceDefinition } from '../registry/resource-types.js'
import type { ModContentApi, ModEntityDefinition, ModId, ModResourceDefinition } from './types.js'
import { Entity } from '../engine/entities/Entity.js'
import type { EntityHost } from '../engine/entities/types.js'

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

function validateEntityDefinition(definition: ModEntityDefinition): void {
	if (!isRecord(definition)) throw new Error(`Invalid entity definition: expected an object`)
	const record = definition as Record<string, unknown>
	const id = requiredTrimmedString(record, 'id', 'entity')
	if (Object.hasOwn(record, 'constructor')) {
		throw new Error(`Invalid entity definition for ${id}: custom constructors are deferred in API v0`)
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
	) {}

	registerEntity(definition: ModEntityDefinition): void {
		if (this.finished) throw new Error(`Cannot register content after mod setup has completed for ${this.modId}`)
		if (this.builder.isFinalized()) throw new Error(`Cannot register entity ${definition.id}: content is already finalized`)
		validateEntityDefinition(definition)
		if (this.pendingEntityIds.has(definition.id) || this.builder.hasEntityId(definition.id)) {
			throw new Error(`Duplicate entity ID: ${definition.id}`)
		}
		const entityDefinition: EntityDefinition = {
			id: definition.id,
			constructor: createInertConstructor(definition.id),
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
