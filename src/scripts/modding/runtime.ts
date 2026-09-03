import type { ModLoader } from './ModLoader.js'

let currentLoader: ModLoader | undefined

export function setCurrentModLoader(loader: ModLoader): void {
	currentLoader = loader
}

export function getCurrentModLoader(): ModLoader | undefined {
	return currentLoader
}
