import type { ModId, ModSnapshot } from './types.js'
import type { ModLoader } from './ModLoader.js'

export interface ModManagementApi {
	mods(): readonly ModSnapshot[]
	allMods(): readonly ModSnapshot[]
	enable(id: ModId): boolean
	disable(id: ModId): boolean
	reload(): void
}

export function createModManagementApi(
	loader: ModLoader,
	reloadFn: () => void = () => location.reload(),
): ModManagementApi {
	return {
		mods(): readonly ModSnapshot[] {
			return loader.mods().filter(snapshot => !snapshot.manifest.internal)
		},
		allMods(): readonly ModSnapshot[] {
			return loader.mods()
		},
		enable(id: ModId): boolean {
			return loader.enable(id)
		},
		disable(id: ModId): boolean {
			return loader.disable(id)
		},
		reload(): void {
			reloadFn()
		},
	}
}
