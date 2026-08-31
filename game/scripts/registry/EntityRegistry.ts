import type { CodexData } from '../codex.js'
import { baseEntityMetadata } from './baseEntityMetadata.js'
import type { EntityCapability, EntityDefinition, EntityFamilyId, EntityKind, RuntimeEntityConstructor } from './types.js'

export class EntityRegistry {
	private definitionsMap: Map<string, EntityDefinition> = new Map()
	private orderedIds: string[] = []

	constructor(codex: Pick<CodexData, 'entities'>){
		this.populateFromCodex(codex)
	}

	private populateFromCodex(codex: Pick<CodexData, 'entities'>): void {
		const metaMap = new Map(baseEntityMetadata.map(m => [m.id, m]))

		for (const [id, def] of Object.entries(codex.entities)){
			if (typeof def.class === 'function'){
				const meta = metaMap.get(id)
				const definition: EntityDefinition = {
					id,
					constructor: def.class as RuntimeEntityConstructor,
					kind: meta?.kind || 'machine',
					family: meta?.family || 'anomalies',
					capabilities: meta?.capabilities || [],
					isUpgradeTo: def.isUpgradeTo,
					onlyone: def.onlyone,
					canPurchase: def.canPurchase !== undefined ? def.canPurchase : true,
				}
				this.definitionsMap.set(id, definition)
				this.orderedIds.push(id)
			}
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
