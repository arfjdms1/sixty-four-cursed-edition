# Modding API v0 — Experimental

> **Experimental — API version 0**
> This API is experimental and will change without notice before v1.
> No semantic stability is promised. Breaking changes may occur.

Bundled mods are **trusted application code** compiled by Vite.
`ModContext` is an API boundary, not a sandbox boundary.
No isolation from JavaScript is provided.

## Entry Point

```ts
import type { ModDefinition } from '../scripts/modding/api/index.js'
```

Use the single public entry `src/scripts/modding/api/index.ts` for all mod-facing imports.
Do not import `Game`, `EntityHost`, `EntityManager`, `Entity`, `RenderSystem`, `ResourceSystem`, or raw `EntityContext`.

## ModDefinition

```ts
interface ModDefinition {
  readonly manifest: ModManifest
  setup(context: ModContext): void | Promise<void>
}
interface ModManifest {
  readonly id: `${string}:${string}` // lowercase namespace:name, e.g. example:my-mod
  readonly name: string
  readonly version: string
  readonly apiVersion: 0
  readonly author?: string
  readonly description?: string
  readonly homepage?: string
  readonly enabledByDefault?: boolean
}
```

Unsupported `apiVersion` values are rejected during discovery. Duplicate IDs are rejected deterministically.

## ModContext

```ts
interface ModContext {
  readonly mod: ModInfo      // { id, name, version, apiVersion }
  readonly logger: ModLogger // info/warn/error attributed to ModId
  readonly content: ModContentApi
}
```

`ModContext` is provided only as the argument to `setup`. It is not exposed via `window` or `globalThis`.

### Why ModContext is small

`ModContext` deliberately does **not** expose:

- `Game` / `master`
- `EntityHost` / `EntityManager` / `EntityContext`
- `RenderSystem` / `ResourceSystem` / `AudioSystem` / `SaveSystem`
- `stats`, `shop`, role `Sets`, spatial `stuffMap`, raw `CanvasRenderingContext2D`

Custom behavior is expressed through **registered content** (entities/resources) rather than direct engine mutation.

## Content API

```ts
interface ModContentApi {
  registerEntity(definition: ModEntityDefinition): void
  registerResource(definition: ModResourceDefinition): void
}
```

### Entity registration

```ts
interface ModEntityDefinition {
  readonly id: string                    // open-ended, e.g. example:my-machine
  readonly kind?: EntityKind             // default: 'machine'
  readonly family?: EntityFamilyId       // default: 'industrial'
  readonly capabilities?: EntityCapability[]
  readonly isUpgradeTo?: string
  readonly onlyone?: boolean
  readonly canPurchase?: boolean
  // custom constructors are deferred in API v0; entities use an inert default behavior
}
```

- IDs are open-ended; base IDs remain lowercase strings like `pump`, `vault`. Namespaced IDs are recommended for mods.
- API v0 does **not** expose `Entity` for subclassing; `Entity.master`/`Entity.context` remain inaccessible to mods. Custom behavioral entities are deferred to a future safe `ModEntity` base.
- Mod entities are registered as inert metadata and use an internal default `Entity` implementation.
- Base-game order is preserved; mod entities are appended in deterministic activation order (sorted `ModId`, then registration order).
- Duplicate entity IDs (including collisions with base content or between mods) are rejected.

The 58 base entities remain; a bundled mod can add the 59th, 60th, … entity. Synthetic entity registration order is deterministic.

### Resource registration

```ts
interface ModResourceDefinition {
  readonly id: ResourceTypeId // open-ended string, e.g. example:my-resource
  readonly name: string
  readonly sfx: string
  readonly triplet: ColorTriplet
  readonly surgeTriplet?: ColorTriplet
  // optional generation metadata: chances, probabilities, mean, stdev, base
}
```

- `legacyIndex` must **not** be set for mod resources; resource order is deterministic and base resources (0..9) remain in base order.
- Duplicate resource IDs are rejected.
- **Limitation:** Resource metadata registration is supported, but runtime resource balance vectors (`resources`, `resourcePops`, `resourceRates`, analytics) remain length 10 for base resources. Custom resources are metadata-only in v0.

### Codex

`Codex` is not yet public. Entity registration does not automatically produce a shop/Codex entry; this remains a deferred capability.

## Setup Timing

1. `ContentBuilder` is created
2. `registerBaseContent(builder)` — 58 entities, 10 resources
3. `ModLoader.discover` + `activateEnabled(builder)` — staged `registerEntity`/`registerResource` per mod
4. `builder.finalize()` — freeze; further registration throws `Cannot register content after finalization`
5. `new Game(canvas, preload, content)` — `EntityRegistry`/`ResourceRegistry` constructed from finalized content

`setup` may be synchronous or `async`. Activation order is deterministic (sorted `ModId`). Async setups remain sequential: the next mod does not start until the previous `setup` resolves.

## Failure Semantics

- **Validation/discovery failures** (malformed manifest, unsupported `apiVersion`, duplicate mod ID) — mod is `failed`, other mods continue.
- **Setup failures** (thrown inside `setup`, or `registerEntity`/`registerResource` validation such as duplicate entity/resource ID) — that mod is marked `failed` and a diagnostic `{ modId, phase: 'setup', error }` is recorded. Unrelated mods are unaffected.
- **Per-mod transaction:** Content registrations are staged per mod and committed only if that mod’s `setup` completes without throwing. A failed setup discards that mod’s pending entities/resources; registrations completed by earlier successful mods remain.
- **Post-finalize:** Calling `content.registerEntity` after `finalize()` throws. Calls after a mod’s setup has completed also throw `Cannot register content after mod setup has completed`.

Per-mod diagnostics are queryable via `ModLoader.mods()` and `diagnostics()` without DOM coupling.

## Enabled State & Reload

- Persisted key: `abstractv03_modState_v0${accountId}` with `{ version: 0, enabled: Record<ModId, boolean> }`
- Default is disabled unless `manifest.enabledByDefault === true`. The proof fixture `builtin:context-fixture` is disabled by default.
- `enable(id)`/`disable(id)` persist immediately. After activation has completed, they set `reloadRequired: true`; hot disable of active mods is not supported in v0.

## Trust

Bundled/internal mods are trusted ESM compiled by Vite. Top-level module evaluation should remain side-effect free; per-mod isolation for exported definitions and `setup` is guaranteed, but top-level evaluation failures are static ESM failures.

## Deferred for later steps

- Full Mods UI / marketplace / ZIP install / networking / dependency solver / permissions / Workshop
- Generic update/tick, render, UI, or event hooks (entity-owned `update`/`render` via custom `ModEntity` — deferred until safe base exists)
- Read-only runtime queries beyond `ModInfo`/`logger`; resource/metadata queries via new resources only
- Broad gameplay APIs; `Codex`/shop automation
- Custom behavioral `Entity` subclasses (requires safe `ModEntity` facade)
