# Modding API v0 - Experimental

> **Experimental API version 0:** no semantic stability is promised. Additive and breaking changes may occur before v1.

Bundled mods are trusted application code compiled eagerly by Vite. `ModContext` is an API boundary, not a sandbox or permissions boundary.

## Public Entry

For `src/mods/<name>/index.ts`:

```ts
import type { ModDefinition } from '../../scripts/modding/api/index.js'
```

`src/scripts/modding/api/index.ts` is the only supported source-local mod import. It is not yet a published package entry. Do not import `Game`, `Entity`, hosts, managers, systems, registries, base content, UI internals, or raw DOM types.

## Definition And Manifest

```ts
interface ModDefinition {
  readonly manifest: ModManifest
  setup(context: ModContext): void | Promise<void>
}

interface ModManifest {
  readonly id: ModId
  readonly name: string
  readonly version: string
  readonly apiVersion: 0
  readonly author?: string
  readonly description?: string
  readonly homepage?: string
  readonly enabledByDefault?: boolean
  readonly internal?: boolean
}
```

IDs are runtime-validated lowercase `namespace:name` strings. `internal` is reserved for application fixtures hidden from the Mods menu. Unsupported API versions and duplicate IDs are rejected deterministically.

## ModContext

```ts
interface ModContext {
  readonly mod: ModInfo
  readonly logger: ModLogger
  readonly content: ModContentApi
  readonly ui: ModUiApi
}
```

The context is created for the current mod and provided only to `setup`. It exposes no `Game`, `master`, host, manager, system, role collection, rendering context, DOM object, or global escape hatch.

### Logger

```ts
interface ModLogger {
  info(message: string): void
  warn(message: string): void
  error(message: string, error?: unknown): void
}
```

Messages are attributed to the current `ModId`.

## Content API

```ts
interface ModContentApi {
  registerEntity(definition: ModEntityDefinition): void
  registerResource(definition: ModResourceDefinition): void
}
```

Content changes are staged per mod and commit only when setup completes successfully. Calls retained past setup are rejected.

### Entities

```ts
interface ModEntityDefinition {
  readonly id: string
  readonly kind?: EntityKind
  readonly family?: EntityFamilyId
  readonly capabilities?: readonly EntityCapability[]
  readonly isUpgradeTo?: string
  readonly onlyone?: boolean
  readonly canPurchase?: boolean
  readonly createBehavior?: () => ModEntityBehavior
}

interface ModEntityBehavior {
  init?(context: ModEntityContext): void
  update?(dt: number, context: ModEntityContext): void
}

interface ModEntityContext {
  readonly self: ModEntitySelf
  readonly logger: ModLogger
  readonly resources: ModEntityResources
  readonly spatial: ModEntitySpatial
}
```

Defaults are `kind: 'machine'`, `family: 'industrial'`, and capabilities `['relocatable', 'soulProducer']`. `createBehavior` runs once per runtime entity. Return a new behavior object so closure state is instance-local.

`self` provides a stable facade with `typeId` and a live position copy. Resource reads use stable string IDs. Spatial lookups return `{ typeId, position }` snapshots, never raw entities. `ModEntityContext` intentionally does not expose the setup-time UI API.

Factory, `init`, and `update` errors are caught and attributed per entity. There is no public entity subclass constructor, render hook, `onDelete` hook, or persistent custom behavior state in v0.

### Resources

```ts
interface ModResourceDefinition {
  readonly id: ResourceTypeId
  readonly name: string
  readonly sfx: string
  readonly triplet: ColorTriplet
  readonly surgeTriplet?: ColorTriplet
  readonly chances?: readonly ResourceChance[]
  readonly probabilities?: readonly ResourceProbability[]
  readonly mean?: number
  readonly stdev?: number
  readonly base?: number
}
```

Base legacy indexes remain reserved and deterministic. Mod resource metadata can be registered, but runtime balances, rates, pops, and analytics still have 10 base-resource slots. Custom resources are metadata-only in v0.

Entity registration does not create Codex, shop, unlock, pricing, or progression entries.

## Safe UI API

```ts
type ModUiTargetId = 'steam-warning'

interface ModUiApi {
  setVisible(target: ModUiTargetId, visible: boolean): void
}
```

`'steam-warning'` is the sole API v0 target. It refers semantically to the warning shown when Steam integration is unavailable. It is not `.steamWarning` and cannot be replaced with a selector.

The API exposes no `document`, `window`, `Document`, `Window`, `Element`, `HTMLElement`, selectors, nodes, arbitrary HTML, or internal UI objects.

### Desired-state semantics

Mod setup occurs before `ContentBuilder.finalize()`, `Game` construction, and warning creation. `setVisible` therefore records desired semantic state rather than touching an element. Later UI construction observes the effective state.

Requests are automatically attributed to the current mod. Visibility is suppressive and order-independent: the target is visible only when no successfully activated mod requests it hidden. `setVisible(target, true)` releases only the calling mod's hide request. Failed setup discards staged UI requests.

Hot unload is not supported. Persisted Mods-menu configuration is applied on the next reload.

## Startup Order

1. Create `ContentBuilder` and register 58 base entities plus 10 base resources.
2. Create neutral mod UI desired state.
3. Discover bundled entries and activate enabled mods in sorted `ModId` order.
4. Commit each successful mod's staged content and UI requests.
5. Finalize immutable content.
6. Construct `Game`; normal UI creation observes effective named visibility.

Setup may be synchronous or asynchronous. Async setups remain sequential. Disabled mods receive no context.

## Failures And Diagnostics

- Malformed or unsupported candidates create validation diagnostics and are omitted.
- Duplicate IDs create deterministic failed records.
- Setup failures mark only that mod failed and discard its staged content and UI requests.
- Other mods continue activating.
- Registration or UI calls after setup are rejected.

## Discovery, Mods Menu, And Reload

Vite eagerly discovers `src/mods/*/index.ts`. Top-level module evaluation must remain side-effect free because an eager ESM evaluation failure occurs outside setup isolation.

Visible bundled mods appear in the home-screen **Mods** panel. Enable/disable choices persist under the account-specific v0 state key. Changes made after activation report that a reload is required; v0 does not hot-load or hot-unload code.

## Optional Future Work

- External/drop-in package discovery and installation.
- A safe render API.
- An `onDelete` behavior hook.
- Save-backed persistent mod-entity state.
- Codex and shop integration.
- Fully dynamic custom resource balances.
- Hot unload.
- Optional conversion of base content into `builtin:vanilla`.
- Remaining internal modernization.

See [the beginner guide](modding.md) for a copy workflow and examples.
