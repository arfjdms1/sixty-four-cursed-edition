import type { ModDefinition } from '../../scripts/modding/api/index.js'

const hideBannerMod: ModDefinition = {
	manifest: {
		id: 'builtin:hide-banner',
		name: 'Hide Banner',
		version: '1.0.0',
		apiVersion: 0,
		author: 'arfjdms1',
		description: 'Hides the browser/Steam warning banner.',
		enabledByDefault: false,
	},
	setup({ ui }) {
		ui.setVisible('steam-warning', false)
	},
}

export default hideBannerMod
