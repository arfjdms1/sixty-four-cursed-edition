import type { EntityDefinition } from '../registry/types.js'
import type { ResourceDefinition } from '../registry/resource-types.js'
import type { ContentContext, ContentRegistration } from './types.js'

export class ContentBuilder implements ContentRegistration {
	private entityDefinitions: EntityDefinition[] = []
	private resourceDefinitions: ResourceDefinition[] = []
	private entityIds: Set<string> = new Set()
	private resourceIds: Set<string> = new Set()
	private finalized?: ContentContext

	addEntityDefinition(definition: EntityDefinition): void {
		this.ensureMutable()
		this.validateId('entity', definition.id)
		if (this.entityIds.has(definition.id)) throw new Error(`Duplicate entity ID: ${definition.id}`)
		this.entityIds.add(definition.id)
		this.entityDefinitions.push(definition)
	}

	addEntityDefinitions(definitions: readonly EntityDefinition[]): void {
		this.ensureMutable()
		for (const definition of definitions) this.addEntityDefinition(definition)
	}

	addResourceDefinition(definition: ResourceDefinition): void {
		this.ensureMutable()
		this.validateId('resource', definition.id)
		if (this.resourceIds.has(definition.id)) throw new Error(`Duplicate resource ID: ${definition.id}`)
		this.resourceIds.add(definition.id)
		this.resourceDefinitions.push(definition)
	}

	addResourceDefinitions(definitions: readonly ResourceDefinition[]): void {
		this.ensureMutable()
		for (const definition of definitions) this.addResourceDefinition(definition)
	}

	finalize(): ContentContext {
		if (this.finalized) return this.finalized
		this.validateDefinitions('entity', this.entityDefinitions)
		this.validateDefinitions('resource', this.resourceDefinitions)

		const entityDefinitions = Object.freeze(this.entityDefinitions.map(definition => Object.freeze(definition)))
		const resourceDefinitions = Object.freeze(this.resourceDefinitions.map(definition => Object.freeze(definition)))
		this.finalized = Object.freeze({ entityDefinitions, resourceDefinitions })
		return this.finalized
	}

	hasEntityId(id: string): boolean {
		return this.entityIds.has(id)
	}

	hasResourceId(id: string): boolean {
		return this.resourceIds.has(id)
	}

	isFinalized(): boolean {
		return this.finalized !== undefined
	}

	private ensureMutable(): void {
		if (this.finalized) throw new Error(`Cannot register content after finalization`)
	}

	private validateId(kind: 'entity' | 'resource', id: string): void {
		if (typeof id !== 'string' || !id.trim() || id !== id.trim()){
			throw new Error(`Invalid ${kind} ID: ${String(id)}`)
		}
	}

	private validateDefinitions(
		kind: 'entity' | 'resource',
		definitions: readonly (EntityDefinition | ResourceDefinition)[],
	): void {
		const ids = new Set<string>()
		for (const definition of definitions){
			this.validateId(kind, definition.id)
			if (ids.has(definition.id)) throw new Error(`Duplicate ${kind} ID: ${definition.id}`)
			ids.add(definition.id)
		}
	}
}
