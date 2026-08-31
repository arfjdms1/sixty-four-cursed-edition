import type { ColorTriplet } from '../../types/core.js'

export type ResourceTypeId = string

export interface ResourceChance {
	type: number
	mean?: number
	stdev?: number
	base?: number
	from?: number
	to?: number
}

export interface ResourceProbability {
	point: number
	spread: number
	value: number
	span?: number
}

export interface ResourceMetadata {
	name: string
	sfx: string
	triplet: ColorTriplet
	surgeTriplet?: ColorTriplet
	chances?: ResourceChance[]
	probabilities?: ResourceProbability[]
	mean?: number
	stdev?: number
	base?: number
}

export interface ResourceDefinition extends ResourceMetadata {
	readonly id: ResourceTypeId
	readonly legacyIndex?: number
}
