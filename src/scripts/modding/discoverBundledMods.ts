import type { BundledModCandidate } from './types.js'

function compareText(left: string, right: string): number {
	return left < right ? -1 : left > right ? 1 : 0
}

function toError(error: unknown): Error {
	return error instanceof Error ? error : new Error(String(error))
}

export async function discoverBundledMods(
	modules: Record<string, () => Promise<unknown>> = import.meta.glob('../../mods/*/index.ts', {
		import: 'default',
	}),
): Promise<readonly BundledModCandidate[]> {
	const candidates: BundledModCandidate[] = []
	for (const [source, load] of Object.entries(modules).sort(([left], [right]) => compareText(left, right))) {
		try {
			candidates.push(Object.freeze({ source, definition: await load() }))
		} catch (error) {
			candidates.push(Object.freeze({ source, error: toError(error) }))
		}
	}
	return candidates
}
