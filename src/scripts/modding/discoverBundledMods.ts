import type { BundledModCandidate } from './types.js'

function compareText(left: string, right: string): number {
	return left < right ? -1 : left > right ? 1 : 0
}

export function discoverBundledMods(
	modules: Record<string, unknown> = import.meta.glob('../../mods/*/index.ts', {
		eager: true,
		import: 'default',
	}),
): readonly BundledModCandidate[] {
	return Object.entries(modules)
		.sort(([left], [right]) => compareText(left, right))
		.map(([source, definition]) => Object.freeze({ source, definition }))
}
