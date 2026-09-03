import type { GameSpaceport } from '../../types/platform.js'

export async function toggleFullscreen(
	spaceport: GameSpaceport,
	fullscreenDocument: Document = document,
): Promise<void> {
	if (!spaceport.isPlaceholder) {
		spaceport.send('toggleFullscreen', '')
		return
	}

	try {
		if (fullscreenDocument.fullscreenElement) {
			if (typeof fullscreenDocument.exitFullscreen !== 'function') {
				console.warn('Fullscreen is not supported by this browser.')
				return
			}
			await fullscreenDocument.exitFullscreen()
			return
		}

		if (typeof fullscreenDocument.documentElement.requestFullscreen !== 'function') {
			console.warn('Fullscreen is not supported by this browser.')
			return
		}
		await fullscreenDocument.documentElement.requestFullscreen()
	} catch (error) {
		console.warn('Unable to change fullscreen state.', error)
	}
}
