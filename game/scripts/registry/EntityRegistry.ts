import type { EntityCapability, EntityDefinition, EntityFamilyId, EntityKind, RuntimeEntityConstructor } from './types.js'

export class EntityRegistry {
	private definitionsMap: Map<string, EntityDefinition> = new Map()
	private orderedIds: string[] = []

	constructor(definitions: readonly EntityDefinition[]){
		this.populate(definitions)
	}

	private populate(definitions: readonly EntityDefinition[]): void {
		for (const def of definitions){
			this.definitionsMap.set(def.id, def)
			this.orderedIds.push(def.id)
		}
	}

	get(id: string): EntityDefinition | undefined {
		return this.definitionsMap.get(id)
	}

	has(id: string): boolean {
		return this.definitionsMap.has(id)
	}

	getConstructor(id: string): RuntimeEntityConstructor | undefined {
		return this.definitionsMap.get(id)?.constructor
	}

	definitions(): IterableIterator<EntityDefinition> {
		return this.definitionsMap.values()
	}

	ids(): readonly string[] {
		return this.orderedIds
	}

	get size(): number {
		return this.definitionsMap.size
	}

	hasCapability(id: string, capability: EntityCapability): boolean {
		return this.definitionsMap.get(id)?.capabilities.includes(capability) || false
	}

	getFamily(id: string): EntityFamilyId | undefined {
		return this.definitionsMap.get(id)?.family
	}

	getKind(id: string): EntityKind | undefined {
		return this.definitionsMap.get(id)?.kind
	}
}
