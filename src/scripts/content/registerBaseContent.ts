import { BASE_ENTITY_CONSTRUCTORS, getBaseEntityDefinitions } from './base/registerBaseEntities.js'
import { assertBaseResourceDefinitions, getBaseResourceDefinitions } from './base/resources/registerBaseResources.js'
import type { ContentRegistration } from './types.js'

export function registerBaseContent(content: ContentRegistration): void {
	const entityDefinitions = getBaseEntityDefinitions()
	if (entityDefinitions.length !== BASE_ENTITY_CONSTRUCTORS.length){
		throw new Error(`Invalid base entity definition count: ${entityDefinitions.length}`)
	}
	for (let index = 0; index < entityDefinitions.length; index++){
		const expectedId = BASE_ENTITY_CONSTRUCTORS[index][0]
		if (entityDefinitions[index].id !== expectedId){
			throw new Error(`Invalid base entity order at index ${index}: ${entityDefinitions[index].id}`)
		}
	}

	const resourceDefinitions = getBaseResourceDefinitions()
	assertBaseResourceDefinitions(resourceDefinitions)

	content.addEntityDefinitions(entityDefinitions)
	content.addResourceDefinitions(resourceDefinitions)
}
