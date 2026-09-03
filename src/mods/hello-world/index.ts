import type { ModDefinition } from '../../scripts/modding/api/index.js'

const helloWorldMod: ModDefinition = {
	manifest: {
		id: 'builtin:hello-world',
		name: 'Hello World',
		version: '1.0.0',
		apiVersion: 0,
		author: 'arfjdms1',
		description: 'Minimal example demonstrating Mod API v0 setup and logging.',
		enabledByDefault: false,
	},
	setup({ logger }) {
		logger.info('Hello, World! Mod API v0 initialized successfully.')
	},
}

export default helloWorldMod
