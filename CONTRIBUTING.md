# Contributing to Sixty Four: Cursed Edition

Thank you for your interest in contributing to **Sixty Four: Cursed Edition**!

---

## 1. Core Principles

1. **Preserve Behavior First**: Refactoring and architectural extraction must remain behavior-preserving. Never rewrite code merely for aesthetic reasons if it changes game balance, save compatibility, or simulation timing.
2. **Deterministic Regression Testing**: All changes must pass the full suite of semantic regression tests, save fixtures, and type-checks before merging.
3. **No Unsafe Type Assertions**: The codebase maintains strict TypeScript (`strict: true`) with 0 explicit `any` and 0 compiler suppressions. Keep `as unknown as` double-assertions at or below baseline.
4. **Separate Fixes from Refactors**: Keep structural file moves, architectural decoupling, and bug fixes in distinct, focused commits.

---

## 2. Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Setup

```bash
git clone https://github.com/<owner>/sixty-four-cursed-edition.git
cd sixty-four-cursed-edition
npm install
```

### Development Server

```bash
npm run dev
```

Opens the development server at `http://127.0.0.1:6464`.

---

## 3. Build & Test Commands

### Type Checking

```bash
npm run typecheck
```

Runs TypeScript compiler with `--noEmit` across all source files and declaration files.

### Build Targets

```bash
# Build conventional hosted web target (output in dist/hosted/)
npm run build:hosted

# Build self-contained offline distribution target (output in dist/offline/)
npm run build:offline

# Default build (delegates to build:hosted)
npm run build
```

### Preview Servers

```bash
# Preview hosted web build on local server
npm run preview:hosted

# Preview offline distribution build on local server
npm run preview:offline
```

### Asset & Icon Validation

```bash
npm run validate:achievement-icons
```

Validates that all 33 achievement icons and locked placeholders exist on disk and resolve with HTTP 200 OK responses on build artifacts.

---

## 4. Architectural Boundaries

- **`src/core/`**: Top-level game coordinator (`Game.ts`) and core state contracts.
- **`src/engine/`**: 10 decomposed runtime subsystems (`audio`, `autonomy`, `effects`, `entities`, `events`, `input`, `interaction`, `rendering`, `resources`, `save`).
- **`src/content/`**: Content composition infrastructure (`ContentBuilder`, `ContentContext`, `registerBaseContent`).
- **`src/content/base/`**: 58 concrete base entity classes and 10 base resource definitions.
- **`src/registry/`**: Generic, content-agnostic registries (`EntityRegistry`, `ResourceRegistry`).
- **`src/resources/`**: Static runtime media assets (`audio/`, `fonts/`, `images/`, `video/`).

`Game.ts` and generic registries must **never** import concrete base content classes directly; all content enters through explicit composition in `registerBaseContent()`.
