# Bundled Modding Guide

Sixty Four: Cursed Edition includes an **experimental Mod API v0** for trusted, source-tree mods. This guide is for JavaScript or TypeScript developers who are new to this repository.

API v0 is intentionally small and may change without notice before v1. It is an API boundary, not a security sandbox.

## Bundled Source Mods

Bundled mods are TypeScript modules under `src/mods/`. Vite discovers each `src/mods/*/index.ts` entry and compiles it into the application. Activation is deterministic by mod ID.

This is not a drop-in external mod installer. Adding or changing a source mod requires rebuilding the application. Downloaded archives, a package format, and runtime external loading remain optional future work.

## Start From The Template

Copy the starter and rename its manifest:

```bash
cp -r examples/mod-template src/mods/my-mod
```

Edit `src/mods/my-mod/index.ts`, especially the unique lowercase `namespace:name` ID, display name, author, and description. Import mod-facing types only from the public source entry:

```ts
import type { ModDefinition } from '../../scripts/modding/api/index.js'
```

## Manifest And Setup

Every entry exports one `ModDefinition`:

```ts
import type { ModDefinition } from '../../scripts/modding/api/index.js'

const mod: ModDefinition = {
  manifest: {
    id: 'example:hello',
    name: 'Example Hello',
    version: '1.0.0',
    apiVersion: 0,
    author: 'Your Name',
    description: 'Logs a message during startup.',
    enabledByDefault: false,
  },
  setup(context) {
    context.logger.info('Example Hello initialized.')
  },
}

export default mod
```

`setup(context)` runs once for each enabled mod during startup, before the game and its normal UI are constructed. It may be synchronous or asynchronous. Keep top-level module evaluation side-effect free; eager ESM evaluation errors happen before per-mod setup isolation exists.

## Logger

Use `context.logger.info`, `warn`, and `error`. Messages are attributed to the active mod ID. Avoid direct recurring `console` output, especially from entity update hooks.

## Content Registration

`context.content` supports staged entity and resource registration:

```ts
setup({ content }) {
  content.registerEntity({
    id: 'example:marker',
    kind: 'machine',
    family: 'industrial',
  })
}
```

Registrations commit only after setup succeeds. IDs must be unique. A registered entity is not automatically added to the shop or Codex. Custom resource metadata is supported, but runtime balance arrays remain limited to the 10 base resources in v0.

## Safe Behavioral Entities

Use `createBehavior` instead of subclassing the internal `Entity` class:

```ts
content.registerEntity({
  id: 'example:counter',
  createBehavior() {
    let elapsed = 0
    return {
      init({ logger, self }) {
        logger.info(`Created at ${self.position.join(', ')}`)
      },
      update(dt, { resources }) {
        elapsed += dt
        if (elapsed >= 5000) {
          elapsed = 0
          void resources.amount('charonite')
        }
      },
    }
  },
})
```

The factory runs per entity instance, so closure state is isolated. Entity contexts expose only `self`, `logger`, safe resource reads, and safe spatial snapshots. Behavior state is ephemeral and is not included in saves. There is no `onDelete` hook in v0.

## Safe UI Visibility

`context.ui` exposes one semantic operation:

```ts
context.ui.setVisible('steam-warning', false)
```

The only v0 target is `'steam-warning'`. It identifies the browser/Steam availability warning, not a CSS selector. The API exposes no `document`, `window`, element, selector, or arbitrary HTML access.

UI calls declare desired startup state, so they work even though setup runs before the warning element exists. Multiple mods compose safely: the target remains hidden while any active mod requests it hidden. Requests are attributed to the current mod automatically.

The bundled `src/mods/hide-banner/index.ts` is the canonical example.

## Build And Enable

Validate and build after copying or changing a mod:

```bash
npm run typecheck
npm run build
```

Run the game, open **Mods** from the home screen, enable the mod, and reload when prompted. Enable/disable choices persist. API v0 does not hot-load or hot-unload mods; configuration changes apply after a page reload.

## API v0 Limitations

- Bundled source-tree mods only; no drop-in external installer or stable package import.
- Trusted code only; no sandbox, permissions system, dependency solver, or compatibility resolver.
- No raw engine objects, `Game`, DOM, rendering, audio/effects, or input APIs.
- UI access is limited to named visibility for `'steam-warning'`.
- Custom resources are metadata-only for runtime balances.
- No automatic Codex, shop, or progression integration.
- No persistent custom behavior state or deletion hook.
- No hot unload; changes require reload.

See the exact contracts and lifecycle rules in [Modding API v0](modding-api-v0.md).

## Optional Future Work

The experimental v0 milestone is complete. Remaining ideas are optional, not release blockers:

- External/drop-in mod loading.
- A safe render API.
- An `onDelete` behavior hook.
- Save-backed persistent mod-entity state.
- Codex and shop integration.
- Fully dynamic custom resource balances.
- Hot unload.
- Converting base content into an optional `builtin:vanilla` mod.
- Remaining internal modernization.
