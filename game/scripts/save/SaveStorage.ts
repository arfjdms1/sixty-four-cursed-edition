import type { SaveStorage } from './types.js'

export class LocalStorageSaveStorage implements SaveStorage {
	getItem(key: string): string | null {
		return localStorage.getItem(key)
	}

	setItem(key: string, value: string): void {
		localStorage.setItem(key, value)
	}

	removeItem(key: string): void {
		localStorage.removeItem(key)
	}
}
