/**
 * Experimental Mod API v0
 *
 * API version 0 is experimental and may change without notice before v1.
 * Bundled mods are trusted application code; this API is an API boundary, not a sandbox.
 */

export type { ModId, ModManifest, ModInfo, ModLogger, ModContext, ModContentApi, ModEntityDefinition, ModResourceDefinition, ModDefinition } from '../types.js'

export type { EntityKind, EntityFamilyId, EntityCapability } from '../../registry/types.js'
export type { ResourceTypeId, ResourceChance, ResourceProbability } from '../../registry/resource-types.js'
export type { ColorTriplet } from '../../../types/core.js'
