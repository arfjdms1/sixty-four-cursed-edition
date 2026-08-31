import type { ResourceAmounts } from '../../types/core.js'

export interface EntityManagerHost {
	resources: ResourceAmounts
	shop?: {
		updateElements(): void
	}
}
