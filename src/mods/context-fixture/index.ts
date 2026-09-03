import type { ModDefinition } from '../../scripts/modding/api/index.js'

const contextFixture: ModDefinition = {
	manifest: {
		id: 'builtin:context-fixture',
		name: 'Context Fixture',
		version: '0.0.0',
		apiVersion: 0,
		description: 'Proves ModContext content registration is staged and deterministic.',
		enabledByDefault: false,
	},
	setup({ content, logger }) {
		logger.info(`Context fixture registering synthetic content`)
		content.registerEntity({
			id: 'builtin:context-fixture-entity',
			kind: 'machine',
			family: 'industrial',
			capabilities: ['relocatable'],
		})
		content.registerResource({
			id: 'builtin:context-fixture-resource',
			name: 'Context Fixture Resource',
			sfx: 'tap1',
			triplet: ['#112233', '#445566', '#778899'],
		})
	},
}

export default contextFixture
