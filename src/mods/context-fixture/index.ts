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
			createBehavior: () => {
				let updates = 0
				return {
					init(ctx) {
						ctx.logger.info(`init ${ctx.self.typeId} at ${ctx.self.position}`)
						// safe context use: resources and spatial are available without leaking master
						void ctx.resources.amount('charonite')
						void ctx.spatial.entityAt([0, 0])
					},
					update(dt, ctx) {
						updates++
						// per-instance state: updates is closed over per behavior instance
						if (updates === 1) ctx.logger.info(`first update ${ctx.self.typeId}`)
					},
				}
			},
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
