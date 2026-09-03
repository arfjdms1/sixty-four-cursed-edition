import type { ModId, ModUiApi, ModUiHost, ModUiTargetId } from './types.js'

function requireTarget(target: ModUiTargetId): void {
	if (target !== 'steam-warning') throw new TypeError(`Unknown mod UI target: ${String(target)}`)
}

function requireVisibility(visible: boolean): void {
	if (typeof visible !== 'boolean') throw new TypeError('Mod UI visibility must be a boolean')
}

export class ModUiState implements ModUiHost {
	readonly #hiddenOwners = new Map<ModUiTargetId, Set<ModId>>()

	setVisible(modId: ModId, target: ModUiTargetId, visible: boolean): void {
		requireTarget(target)
		requireVisibility(visible)
		const owners = this.#hiddenOwners.get(target) ?? new Set<ModId>()
		if (visible) owners.delete(modId)
		else owners.add(modId)
		if (owners.size === 0) this.#hiddenOwners.delete(target)
		else this.#hiddenOwners.set(target, owners)
	}

	isVisible(target: ModUiTargetId): boolean {
		requireTarget(target)
		return (this.#hiddenOwners.get(target)?.size ?? 0) === 0
	}

	hiddenBy(target: ModUiTargetId): readonly ModId[] {
		requireTarget(target)
		return Object.freeze([...(this.#hiddenOwners.get(target) ?? [])].sort())
	}
}

export class StagedModUi {
	readonly #requests = new Map<ModUiTargetId, boolean>()
	#open = true
	readonly #modId: ModId
	readonly #host?: ModUiHost
	readonly api: ModUiApi

	constructor(modId: ModId, host?: ModUiHost) {
		this.#modId = modId
		this.#host = host
		this.api = Object.freeze({
			setVisible: (target: ModUiTargetId, visible: boolean) => this.stageVisibility(target, visible),
		})
	}

	private stageVisibility(target: ModUiTargetId, visible: boolean): void {
		if (!this.#open) throw new Error('Cannot change UI visibility after mod setup has completed')
		requireTarget(target)
		requireVisibility(visible)
		this.#requests.set(target, visible)
	}

	commit(): void {
		if (!this.#open) return
		for (const [target, visible] of this.#requests) this.#host?.setVisible(this.#modId, target, visible)
		this.#open = false
	}

	discard(): void {
		this.#requests.clear()
		this.#open = false
	}
}
