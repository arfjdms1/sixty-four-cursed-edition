import type { ModId, ModManifest, ModStateStorage } from './types.js'

export const DEFAULT_MOD_STATE_KEY = `abstractv03_modState_v0`

interface PersistedModState {
	readonly version: 0
	readonly enabled: Readonly<Record<ModId, boolean>>
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export class LocalStorageModStateStorage implements ModStateStorage {
	getItem(key: string): string | null {
		return localStorage.getItem(key)
	}

	setItem(key: string, value: string): void {
		localStorage.setItem(key, value)
	}
}

export class ModEnabledState {
	private invalidStateReported = false

	constructor(
		private readonly storage: ModStateStorage,
		private readonly key: string = DEFAULT_MOD_STATE_KEY,
		private readonly onInvalidState?: (error: Error) => void,
	) {}

	isEnabled(manifest: ModManifest): boolean {
		const override = this.read().enabled[manifest.id]
		return override ?? manifest.enabledByDefault ?? false
	}

	setEnabled(id: ModId, enabled: boolean): void {
		const current = this.read()
		this.storage.setItem(this.key, JSON.stringify({
			version: 0,
			enabled: { ...current.enabled, [id]: enabled },
		} satisfies PersistedModState))
	}

	private read(): PersistedModState {
		const raw = this.storage.getItem(this.key)
		if (raw === null) return { version: 0, enabled: {} }

		let value: unknown
		try {
			value = JSON.parse(raw)
		} catch {
			this.reportInvalidState(`Stored mod state is not valid JSON`)
			return { version: 0, enabled: {} }
		}

		if (!isRecord(value) || value.version !== 0 || !isRecord(value.enabled)) {
			this.reportInvalidState(`Stored mod state has an unsupported schema`)
			return { version: 0, enabled: {} }
		}

		const enabled: Record<ModId, boolean> = {}
		let invalidEntry = false
		for (const [id, state] of Object.entries(value.enabled)) {
			if (typeof state === 'boolean') {
				enabled[id] = state
			} else {
				invalidEntry = true
			}
		}
		if (invalidEntry) this.reportInvalidState(`Stored mod state contains a non-boolean enabled value`)
		return { version: 0, enabled }
	}

	private reportInvalidState(message: string): void {
		if (this.invalidStateReported) return
		this.invalidStateReported = true
		this.onInvalidState?.(new Error(message))
	}
}
