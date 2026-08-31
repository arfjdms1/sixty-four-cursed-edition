import type { EntityDefinition } from '../registry/types.js'
import type { ResourceDefinition } from '../registry/resource-types.js'

export interface ContentRegistration {
	addEntityDefinition(definition: EntityDefinition): void
	addEntityDefinitions(definitions: readonly EntityDefinition[]): void
	addResourceDefinition(definition: ResourceDefinition): void
	addResourceDefinitions(definitions: readonly ResourceDefinition[]): void
}

export interface ContentContext {
	readonly entityDefinitions: readonly Readonly<EntityDefinition>[]
	readonly resourceDefinitions: readonly Readonly<ResourceDefinition>[]
}
