import type { ModContext, ModDefinition, ModManifest } from './types.js'

export const SUPPORTED_MOD_API_VERSION = 0 as const

const MOD_ID_PATTERN = /^[a-z0-9][a-z0-9._-]*:[a-z0-9][a-z0-9._-]*$/

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function requiredString(record: Record<string, unknown>, key: string): string {
	const value = record[key]
	if (typeof value !== 'string' || !value.trim() || value !== value.trim()) {
		throw new Error(`Invalid mod manifest: ${key} must be a non-empty trimmed string`)
	}
	return value
}

function optionalString(record: Record<string, unknown>, key: string): string | undefined {
	const value = record[key]
	if (value === undefined) return undefined
	if (typeof value !== 'string' || !value.trim() || value !== value.trim()) {
		throw new Error(`Invalid mod manifest: ${key} must be a non-empty trimmed string`)
	}
	return value
}

export function validateModManifest(value: unknown): ModManifest {
	if (!isRecord(value)) throw new Error(`Invalid mod manifest: expected an object`)

	const id = requiredString(value, 'id')
	if (!MOD_ID_PATTERN.test(id)) {
		throw new Error(`Invalid mod manifest: id "${id}" must use namespace:name format`)
	}

	const name = requiredString(value, 'name')
	const version = requiredString(value, 'version')
	if (value.apiVersion !== SUPPORTED_MOD_API_VERSION) {
		throw new Error(`Unsupported mod API version for ${id}: ${String(value.apiVersion)}`)
	}
	if (value.enabledByDefault !== undefined && typeof value.enabledByDefault !== 'boolean') {
		throw new Error(`Invalid mod manifest: enabledByDefault must be a boolean`)
	}

	const author = optionalString(value, 'author')
	const description = optionalString(value, 'description')
	const homepage = optionalString(value, 'homepage')
	if (value.internal !== undefined && typeof value.internal !== 'boolean') {
		throw new Error(`Invalid mod manifest: internal must be a boolean`)
	}

	return Object.freeze({
		id,
		name,
		version,
		apiVersion: SUPPORTED_MOD_API_VERSION,
		...(author === undefined ? {} : { author }),
		...(description === undefined ? {} : { description }),
		...(homepage === undefined ? {} : { homepage }),
		...(value.enabledByDefault === undefined ? {} : { enabledByDefault: value.enabledByDefault }),
		...(value.internal === undefined ? {} : { internal: value.internal as boolean }),
	})
}

export function validateModDefinition(value: unknown): ModDefinition {
	if (!isRecord(value)) throw new Error(`Invalid mod definition: expected an object`)
	const manifest = validateModManifest(value.manifest)
	const setup = value.setup
	if (typeof setup !== 'function') throw new Error(`Invalid mod definition for ${manifest.id}: setup must be a function`)

	return Object.freeze({
		manifest,
		setup: (context: ModContext) => setup(context),
	})
}
