export type ModId = string

export type ModStatus = 'disabled' | 'discovered' | 'loading' | 'active' | 'failed'

export type ModDiagnosticPhase = 'validation' | 'discovery' | 'setup' | 'persistence'

export interface ModManifest {
	readonly id: ModId
	readonly name: string
	readonly version: string
	readonly apiVersion: 0
	readonly author?: string
	readonly description?: string
	readonly homepage?: string
	readonly enabledByDefault?: boolean
}

export interface ModLogger {
	info(message: string): void
	warn(message: string): void
	error(message: string, error?: unknown): void
}

export interface ModInfo {
	readonly id: ModId
	readonly name: string
	readonly version: string
	readonly apiVersion: 0
}

export interface ModLifecycleContext {
	readonly id: ModId
	readonly logger: ModLogger
}

export interface ModEntityDefinition {
	readonly id: string
	readonly kind?: import('../registry/types.js').EntityKind
	readonly family?: import('../registry/types.js').EntityFamilyId
	readonly capabilities?: readonly import('../registry/types.js').EntityCapability[]
	readonly isUpgradeTo?: string
	readonly onlyone?: boolean
	readonly canPurchase?: boolean
}

export interface ModResourceDefinition {
	readonly id: import('../registry/resource-types.js').ResourceTypeId
	readonly name: string
	readonly sfx: string
	readonly triplet: import('../../types/core.js').ColorTriplet
	readonly surgeTriplet?: import('../../types/core.js').ColorTriplet
	readonly chances?: readonly import('../registry/resource-types.js').ResourceChance[]
	readonly probabilities?: readonly import('../registry/resource-types.js').ResourceProbability[]
	readonly mean?: number
	readonly stdev?: number
	readonly base?: number
}

export interface ModContentApi {
	registerEntity(definition: ModEntityDefinition): void
	registerResource(definition: ModResourceDefinition): void
}

export interface ModContext {
	readonly mod: ModInfo
	readonly logger: ModLogger
	readonly content: ModContentApi
}

export interface ModDefinition {
	readonly manifest: ModManifest
	setup(context: ModContext): void | Promise<void>
}

export interface BundledModCandidate {
	readonly source: string
	readonly definition: unknown
}

export interface ModDiagnostic {
	readonly modId?: ModId
	readonly source?: string
	readonly phase: ModDiagnosticPhase
	readonly error: Error
}

export interface ModSnapshot {
	readonly manifest: ModManifest
	readonly enabled: boolean
	readonly status: ModStatus
	readonly reloadRequired: boolean
	readonly error?: ModDiagnostic
}

export interface ModStateStorage {
	getItem(key: string): string | null
	setItem(key: string, value: string): void
}

export interface ModLoaderOptions {
	readonly storage: ModStateStorage
	readonly storageKey?: string
	readonly loggerFactory?: (id: ModId) => ModLogger
	readonly onDiagnostic?: (diagnostic: ModDiagnostic) => void
}
