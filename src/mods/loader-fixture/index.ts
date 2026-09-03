import type { ModDefinition } from '../../scripts/modding/types.js'

// Bundled mods are trusted code and must keep top-level module evaluation side-effect free.
const loaderFixture: ModDefinition = {
	manifest: {
		id: 'builtin:loader-fixture',
		name: 'Internal Loader Fixture',
		version: '0.0.0',
		apiVersion: 0,
		description: 'Inert bundled module used to verify Vite mod discovery.',
		enabledByDefault: false,
		internal: true,
	},
	setup({ logger }) {
		logger.info(`Internal loader fixture activated`)
	},
}

export default loaderFixture
