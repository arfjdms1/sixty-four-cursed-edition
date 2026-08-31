import type { ResourceDefinition, ResourceTypeId } from './resource-types.js'

export class ResourceRegistry {
	private definitionsMap: Map<ResourceTypeId, Readonly<ResourceDefinition>> = new Map()
	private legacyDefinitionsMap: Map<number, Readonly<ResourceDefinition>> = new Map()
	private orderedIds: ResourceTypeId[] = []

	constructor(definitions: readonly Readonly<ResourceDefinition>[]){
		this.populate(definitions)
	}

	private populate(definitions: readonly Readonly<ResourceDefinition>[]): void {
		for (const definition of definitions){
			if (typeof definition.id !== 'string' || !definition.id.trim() || definition.id !== definition.id.trim()){
				throw new Error(`Invalid resource ID: ${String(definition.id)}`)
			}
			if (this.definitionsMap.has(definition.id)){
				throw new Error(`Duplicate resource ID: ${definition.id}`)
			}

			const storedDefinition = Object.freeze({ ...definition })
			const legacyIndex = storedDefinition.legacyIndex
			if (legacyIndex !== undefined){
				if (!Number.isInteger(legacyIndex) || legacyIndex < 0){
					throw new Error(`Invalid legacy resource index for ${definition.id}: ${legacyIndex}`)
				}
				if (this.legacyDefinitionsMap.has(legacyIndex)){
					throw new Error(`Duplicate legacy resource index: ${legacyIndex}`)
				}
				this.legacyDefinitionsMap.set(legacyIndex, storedDefinition)
			}

			this.definitionsMap.set(storedDefinition.id, storedDefinition)
			this.orderedIds.push(storedDefinition.id)
		}
	}

	get(id: ResourceTypeId): Readonly<ResourceDefinition> | undefined {
		return this.definitionsMap.get(id)
	}

	has(id: ResourceTypeId): boolean {
		return this.definitionsMap.has(id)
	}

	getByLegacyIndex(index: number): Readonly<ResourceDefinition> | undefined {
		return this.legacyDefinitionsMap.get(index)
	}

	getLegacyIndex(id: ResourceTypeId): number | undefined {
		return this.definitionsMap.get(id)?.legacyIndex
	}

	getIdByLegacyIndex(index: number): ResourceTypeId | undefined {
		return this.legacyDefinitionsMap.get(index)?.id
	}

	definitions(): IterableIterator<Readonly<ResourceDefinition>> {
		return this.definitionsMap.values()
	}

	legacyDefinitions(): readonly Readonly<ResourceDefinition>[] {
		return [...this.legacyDefinitionsMap.entries()]
			.sort(([a], [b]) => a - b)
			.map(([, definition]) => definition)
	}

	ids(): readonly ResourceTypeId[] {
		return [...this.orderedIds]
	}

	get size(): number {
		return this.definitionsMap.size
	}
}
