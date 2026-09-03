import { ModEnabledState } from './ModEnabledState.js'
import { validateModDefinition } from './manifest.js'
import { StagedModContent, ThrowingModContent } from './ModContent.js'
import type { ContentBuilder } from '../content/ContentContext.js'
import type {
	BundledModCandidate,
	ModContext,
	ModDefinition,
	ModDiagnostic,
	ModId,
	ModInfo,
	ModLoaderOptions,
	ModLogger,
	ModSnapshot,
	ModStatus,
} from './types.js'

interface ModRecord {
	readonly definition: ModDefinition
	readonly source: string
	enabled: boolean
	status: ModStatus
	reloadRequired: boolean
	error?: ModDiagnostic
}

function compareText(left: string, right: string): number {
	return left < right ? -1 : left > right ? 1 : 0
}

const defaultLoggerFactory = (id: ModId): ModLogger => ({
	info: message => console.info(`[mod:${id}] ${message}`),
	warn: message => console.warn(`[mod:${id}] ${message}`),
	error: (message, error) => console.error(`[mod:${id}] ${message}`, error),
})

function toError(error: unknown): Error {
	return error instanceof Error ? error : new Error(String(error))
}

export class ModLoader {
	private readonly enabledState: ModEnabledState
	private readonly loggerFactory: (id: ModId) => ModLogger
	private readonly onDiagnostic: (diagnostic: ModDiagnostic) => void
	private readonly records = new Map<ModId, ModRecord>()
	private readonly diagnosticEntries: ModDiagnostic[] = []
	private activationStarted = false
	private activationComplete = false
	private activationPromise?: Promise<void>
	private contentBuilder?: ContentBuilder

	constructor(options: ModLoaderOptions) {
		this.onDiagnostic = options.onDiagnostic ?? (diagnostic => {
			console.error(`[mod-loader:${diagnostic.phase}] ${diagnostic.modId ?? diagnostic.source ?? 'unknown mod'}`, diagnostic.error)
		})
		this.enabledState = new ModEnabledState(options.storage, options.storageKey, error => {
			this.addDiagnostic({ phase: 'persistence', error })
		})
		this.loggerFactory = options.loggerFactory ?? defaultLoggerFactory
	}

	discover(candidates: readonly BundledModCandidate[]): void {
		if (this.activationStarted) throw new Error(`Cannot discover mods after activation has started`)
		this.records.clear()
		this.diagnosticEntries.length = 0

		const definitions = new Map<ModId, Array<{ definition: ModDefinition; source: string }>>()
		for (const candidate of [...candidates].sort((left, right) => compareText(left.source, right.source))) {
			try {
				const definition = validateModDefinition(candidate.definition)
				const entries = definitions.get(definition.manifest.id) ?? []
				entries.push({ definition, source: candidate.source })
				definitions.set(definition.manifest.id, entries)
			} catch (error) {
				this.addDiagnostic({ source: candidate.source, phase: 'validation', error: toError(error) })
			}
		}

		for (const id of [...definitions.keys()].sort(compareText)) {
			const entries = definitions.get(id)!
			if (entries.length > 1) {
				const diagnostic = this.addDiagnostic({
					modId: id,
					source: entries.map(entry => entry.source).join(', '),
					phase: 'discovery',
					error: new Error(`Duplicate mod ID: ${id}`),
				})
				this.records.set(id, {
					definition: entries[0].definition,
					source: entries[0].source,
					enabled: false,
					status: 'failed',
					reloadRequired: false,
					error: diagnostic,
				})
				continue
			}

			const entry = entries[0]
			let enabled = entry.definition.manifest.enabledByDefault ?? false
			try {
				enabled = this.enabledState.isEnabled(entry.definition.manifest)
			} catch (error) {
				this.addDiagnostic({ modId: id, source: entry.source, phase: 'persistence', error: toError(error) })
			}
			this.records.set(id, {
				definition: entry.definition,
				source: entry.source,
				enabled,
				status: enabled ? 'discovered' : 'disabled',
				reloadRequired: false,
			})
		}
	}

	async activateEnabled(contentBuilder?: ContentBuilder): Promise<void> {
		if (contentBuilder) this.contentBuilder = contentBuilder
		if (this.activationPromise) return this.activationPromise
		this.activationPromise = this.activateSequentially()
		return this.activationPromise
	}

	private async activateSequentially(): Promise<void> {
		this.activationStarted = true

		for (const id of [...this.records.keys()].sort(compareText)) {
			const record = this.records.get(id)!
			if (!record.enabled || record.status === 'failed') continue

			record.status = 'loading'
			const modInfo: ModInfo = Object.freeze({
				id: record.definition.manifest.id,
				name: record.definition.manifest.name,
				version: record.definition.manifest.version,
				apiVersion: record.definition.manifest.apiVersion,
			})
			const logger = this.loggerFactory(id)
			const staged = this.contentBuilder ? new StagedModContent(id, this.contentBuilder) : new ThrowingModContent()
			const context: ModContext = Object.freeze({
				mod: modInfo,
				logger,
				content: staged,
			})
			try {
				await record.definition.setup(context)
				if (staged instanceof StagedModContent) staged.commit()
				record.status = 'active'
			} catch (error) {
				if (staged instanceof StagedModContent) staged.discard()
				const diagnostic = this.addDiagnostic({
					modId: id,
					source: record.source,
					phase: 'setup',
					error: toError(error),
				})
				record.status = 'failed'
				record.error = diagnostic
			}
		}
		this.activationComplete = true
	}

	enable(id: ModId): boolean {
		return this.setEnabled(id, true)
	}

	disable(id: ModId): boolean {
		return this.setEnabled(id, false)
	}

	isEnabled(id: ModId): boolean {
		return this.records.get(id)?.enabled ?? false
	}

	mods(): readonly ModSnapshot[] {
		return [...this.records.values()]
			.sort((left, right) => compareText(left.definition.manifest.id, right.definition.manifest.id))
			.map(record => Object.freeze({
				manifest: record.definition.manifest,
				enabled: record.enabled,
				status: record.status,
				reloadRequired: record.reloadRequired,
				...(record.error === undefined ? {} : { error: record.error }),
			}))
	}

	diagnostics(): readonly ModDiagnostic[] {
		return [...this.diagnosticEntries]
	}

	private setEnabled(id: ModId, enabled: boolean): boolean {
		const record = this.records.get(id)
		if (!record || record.error?.phase === 'discovery') return false
		if (this.activationStarted && !this.activationComplete) return false

		try {
			this.enabledState.setEnabled(id, enabled)
		} catch (error) {
			this.addDiagnostic({ modId: id, source: record.source, phase: 'persistence', error: toError(error) })
			return false
		}

		record.enabled = enabled
		if (this.activationStarted) {
			record.reloadRequired = record.status === 'failed' || (record.status === 'active') !== enabled
		} else {
			record.status = enabled ? 'discovered' : 'disabled'
		}
		return true
	}

	private addDiagnostic(diagnostic: ModDiagnostic): ModDiagnostic {
		const frozen = Object.freeze(diagnostic)
		this.diagnosticEntries.push(frozen)
		this.onDiagnostic(frozen)
		return frozen
	}
}
