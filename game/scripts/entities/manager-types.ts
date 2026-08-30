import type { ResourceAmounts } from '../../types/core.js'
import type { CodexData } from '../codex.js'

export interface EntityManagerHost {
	codex: Pick<CodexData, 'entities'>
	resources: ResourceAmounts
	shop?: {
		updateElements(): void
	}
}
