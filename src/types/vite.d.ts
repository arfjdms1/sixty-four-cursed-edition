import type { ImportGlobFunction } from 'vite/types/importGlob'

declare global {
	interface ImportMeta {
		glob: ImportGlobFunction
	}
}

export {}
