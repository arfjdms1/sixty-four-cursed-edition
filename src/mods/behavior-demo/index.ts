import type { ModDefinition, ModEntityBehavior } from '../../scripts/modding/api/index.js'

const behaviorDemoMod: ModDefinition = {
	manifest: {
		id: 'builtin:behavior-demo',
		name: 'Behavior Demo',
		version: '1.0.0',
		apiVersion: 0,
		author: 'arfjdms1',
		description: 'Demonstrates safe custom behavioral entities with isolated per-instance state, init, and throttled update hooks.',
		enabledByDefault: false,
	},
	setup({ content, logger }) {
		logger.info('Behavior demo mod registering entity...')
		content.registerEntity({
			id: 'builtin:behavior-demo-entity',
			kind: 'machine',
			family: 'industrial',
			capabilities: ['relocatable'],
			createBehavior(): ModEntityBehavior {
				let tickCount = 0
				let elapsedMs = 0

				return {
					init(ctx) {
						ctx.logger.info(`Behavior demo entity initialized at [${ctx.self.position[0]}, ${ctx.self.position[1]}]`)
						// Query safe capabilities without exposing raw engine internals
						void ctx.resources.amount('charonite')
						void ctx.spatial.entityAt(ctx.self.position)
					},
					update(dt, ctx) {
						tickCount++
						elapsedMs += dt

						// Log only on first update and deterministically throttled thereafter
						if (tickCount === 1) {
							ctx.logger.info(`Behavior demo entity initial update tick (dt: ${dt.toFixed(1)}ms)`)
						} else if (elapsedMs >= 5000) {
							elapsedMs = 0
							ctx.logger.info(`Behavior demo entity active (${tickCount} ticks processed)`)
						}
					},
				}
			},
		})
	},
}

export default behaviorDemoMod
