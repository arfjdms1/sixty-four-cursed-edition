import type { ModDefinition } from '../../scripts/modding/api/index.js'

const mod: ModDefinition = {
	manifest: {
		id: 'example:my-mod',
		name: 'My Mod',
		version: '1.0.0',
		apiVersion: 0,
		author: 'Your Name',
		description: 'A bundled source mod for Sixty Four: Cursed Edition.',
		enabledByDefault: false,
	},
	setup({ logger }) {
		logger.info('My Mod initialized.')
	},
}

export default mod
