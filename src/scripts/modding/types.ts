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

export interface ModLifecycleContext {
	readonly id: ModId
	readonly logger: ModLogger
}

export interface ModDefinition {
	readonly manifest: ModManifest
	setup(context: ModLifecycleContext): void | Promise<void>
}

export interface BundledModCandidate {
	readonly source: string
	readonly definition?: unknown
	readonly error?: Error
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
