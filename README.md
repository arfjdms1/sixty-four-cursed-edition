# Sixty Four: Cursed Edition

> A modernization of Sixty Four for the web, after discovering that the
> "web port" was apparently already finished.

This project started with a fairly reasonable idea:

> "Sixty Four is an Electron game written in JavaScript. Maybe I can port it
> to the web."

That turned out to be unnecessary.

The shipped game already contains readable JavaScript, HTML, Canvas rendering,
browser-compatible audio, browser-compatible save logic, and explicit fallback
behavior for when Electron does not exist.

The initial web port was therefore:

```bash
cd game
python -m http.server 6464
````

And then opening:

```text
http://localhost:6464
```

The game worked.

The saves worked.

The audio worked.

The renderer worked.

The game even gracefully handled Electron being missing.

So that was apparently the web port.

Software engineering is a serious profession.

---

## What is Sixty Four?

**Sixty Four** is an incremental automation game by Oleg Danilov.

You start with some suspiciously smooth black cubes and gradually construct an
increasingly unreasonable collection of machinery for extracting, processing,
destroying, converting, and generally abusing resources.

It is currently distributed primarily as a desktop game through Steam.

Underneath that desktop release, however, the actual game is largely:

* HTML
* JavaScript
* CSS
* Canvas 2D
* images
* audio
* `localStorage`

with Electron acting mostly as a desktop wrapper and bridge to Steam-specific
features.

The application structure looks roughly like this:

```text
resources/
└── app/
    ├── main.js
    ├── package.json
    ├── node_modules/
    ├── steam_appid.txt
    └── game/
        ├── index.html
        ├── scripts/
        ├── img/
        ├── sfx/
        └── font/
```

Yes.

There is literally a directory called `game` containing `index.html`.

No, apparently nobody thought to serve it.

---

## Why does this project exist?

Originally:

> Port Sixty Four from Electron to the browser.

Current objective:

> Modernize the browser game that was apparently sitting inside the Electron
> release the entire time.

This project aims to preserve the original gameplay while rebuilding the
surrounding platform using modern web tooling.

Planned improvements include:

* Vite
* TypeScript
* TSX for appropriate UI components
* ES modules instead of global script soup
* IndexedDB persistence
* optional account-based cloud saves
* save history and rollback
* manual **Sync Now**
* automatic server sync roughly every four minutes
* better cross-browser behavior
* touch and pointer input support
* proper right-click handling
* improved mobile/Chromebook behavior
* web-native achievements
* mod compatibility
* performance improvements
* bug fixes discovered during modernization
* code organization that does not involve putting an entire ecosystem into
  `stuff.js`

The goal is **not** to rewrite the game merely because rewriting functioning
software is an excellent way to manufacture new bugs.

---

## Current status

### Browser compatibility

* [x] Game starts in a normal browser
* [x] Canvas renderer works
* [x] Core simulation works
* [x] Mouse input works
* [x] Audio works
* [x] Assets load correctly
* [x] Browser autosaves work
* [x] Browser save loading works
* [x] Save export/import works
* [x] Reloading the page preserves progress
* [ ] Remove misleading Steam failure warning
* [ ] Proper right-click handling
* [ ] Touch input
* [ ] Mobile layout testing
* [ ] Safari testing
* [ ] Chromebook performance testing

### Modernization

* [ ] Vite migration
* [ ] ES module conversion
* [ ] TypeScript migration
* [ ] TSX UI migration where useful
* [ ] Typed save format
* [ ] IndexedDB storage provider
* [ ] account system
* [ ] cloud save API
* [ ] save conflict handling
* [ ] save history
* [ ] web achievements
* [ ] mod loader integration

### Status summary

```text
Expected project:

Electron game
    ↓
reverse engineering
    ↓
renderer port
    ↓
filesystem replacement
    ↓
Steam removal
    ↓
browser compatibility
    ↓
weeks of suffering


Actual project:

cd game
python -m http.server 6464
    ↓
works
```

We take those.

---

## The Steam warning is lying

When Sixty Four runs without Steam, it displays a large red warning claiming
that autosaving will not work.

Meanwhile, the game proceeds to autosave perfectly well into browser
`localStorage`.

Conceptually, the existing architecture is already something like:

```text
                   ┌── localStorage
Game.save() ───────┤
                   └── Electron IPC ──► Steam Cloud
```

Not:

```text
Game.save() ──► Steam or death
```

Without Steam, the Steam ID becomes an empty string and the local browser save
key still works normally.

So the browser effectively does:

```text
save
↓
localStorage
↓
reload page
↓
load save
↓
continue playing
```

while a red banner explains with tremendous confidence that none of this is
possible.

This will be fixed.

---

## Development philosophy

### 1. Preserve behavior first

The modernization should happen in stages:

```text
original browser build
        ↓
Vite
        ↓
ES modules
        ↓
TypeScript
        ↓
UI modernization
        ↓
new platform features
        ↓
actual refactoring
```

Each stage should behave identically before proceeding.

No giant:

```text
"rewrite everything and see what explodes"
```

commits.

That strategy has been tested extensively by the software industry and the
results are available in every issue tracker ever created.

---

### 2. Refactors and bug fixes stay separate

Migration commits should not intentionally change gameplay.

Bad:

```text
refactor: convert 6,000 lines to TypeScript and fix seventeen mysterious bugs
```

Good:

```text
refactor: convert sprite loader to TypeScript
fix: prevent invalid sprite index during reload
```

If something breaks, Git should be able to tell us which terrible decision was
responsible.

---

### 3. The compiler is allowed to disagree with us

The original code is JavaScript.

This means variables may occasionally discover themselves and pursue several
different careers during their lifetime.

Something that appears to be:

```ts
target: Entity
```

may, at runtime, turn out to be:

```ts
Entity | number | false | null | string | probably a toaster
```

Types will therefore be tightened gradually.

Temporary `unknown` is preferable to confidently inventing types that are
wrong.

---

### 4. TSX is for UI

The game renderer and simulation do not need to become React components.

The intended architecture is roughly:

```text
src/
├── game/
│   ├── Game.ts
│   ├── Entity.ts
│   ├── Simulation.ts
│   └── ...
│
├── platform/
│   ├── saves/
│   ├── cloud/
│   ├── achievements/
│   └── input/
│
└── ui/
    ├── App.tsx
    ├── VolumeSlider.tsx
    ├── AccountMenu.tsx
    ├── SaveManager.tsx
    └── SyncStatus.tsx
```

Canvas remains Canvas.

We do not need JSX representations of industrial machinery simply because npm
exists.

---

## Saving

The existing game stores saves locally in the browser.

Cursed Edition will retain fast local persistence while adding an optional
server-side layer.

Planned flow:

```text
Game state
    ↓
local save
    ↓
IndexedDB
    ↓
mark save dirty
    ↓
every ~4 minutes
    ↓
cloud sync
```

There will also be a:

```text
[ Sync Now ]
```

button for immediate synchronization.

The game should never stop working because the cloud server decided it needed
some personal time.

---

## Save conflict handling

Trying to automatically merge two independently modified game saves sounds
like an entertaining way to create a universe in which the same machine both
exists and does not exist.

Instead, conflicts will be explicit.

Example:

```text
Cloud Save
Revision 182
10:42 PM

This Device
Revision 179
10:39 PM

[ Use Cloud Save ]
[ Use This Device ]
```

The losing version should be preserved as a backup rather than immediately
launched into the void.

---

## Local storage

The existing game uses `localStorage`.

That works surprisingly well, as demonstrated by the fact that we expected to
implement browser saves and then discovered the developer had already done it.

Long term, primary local persistence will move to IndexedDB because it provides:

* larger practical storage capacity
* structured data
* asynchronous access
* better room for save history
* multiple save slots
* metadata
* migration support

`localStorage` compatibility may remain for importing existing saves.

---

## Input handling

The original game was written primarily for desktop Electron input.

Browser-specific improvements will include:

* preventing the context menu on the game surface
* preserving normal right-click behavior outside the game
* Pointer Events
* touch support
* pointer capture for drag controls
* proper mobile interaction
* replacing fragile custom controls where appropriate

For example, the current volume slider is essentially a pair of `<div>`
elements combined with mouse-coordinate arithmetic.

It works.

Mostly.

A native or purpose-built slider will eventually replace it because browsers
already solved this problem and we do not receive bonus points for solving it
again badly.

---

## Performance

Sixty Four is already lightweight compared with the Electron runtime that
contains it.

The web edition removes the need to ship an entire dedicated Chromium runtime
with a game whose core code is comparatively tiny.

Potential web-specific optimizations include:

* requestAnimationFrame cleanup
* simulation/render decoupling
* reduced UI update frequency
* off-screen rendering avoidance
* asset preloading
* service-worker caching
* Brotli compression for text assets
* modern image/audio formats where appropriate
* optional reduced-effects mode
* optional 30 FPS rendering mode

Tentative Chromebook mode:

```text
Simulation     10-20 Hz
Rendering      30 FPS
UI counters     4-10 Hz
Cloud sync      ~4 min
```

There is no compelling scientific reason to redraw a resource counter sixty
times per second.

---

## Assets

Images, sounds, fonts, and other game assets currently remain in their original
formats.

The web build may eventually use:

```text
PNG / images    → optimized formats where appropriate
audio           → browser-efficient compressed formats
fonts           → WOFF2
JS / CSS / HTML → Brotli / gzip
```

Assets will likely be precached with a service worker instead of shoved into a
single enormous archive named something responsible like:

```text
assets-final-final-v2-real.pak
```

Modern HTTP is capable of transferring more than one file without civilization
ending.

---

## Mods

Maintaining compatibility with existing Sixty Four mods is a desirable goal.

The original game exposes a large amount of functionality through global
classes and monkey-patching.

As the project migrates to ES modules and TypeScript, a compatibility API may
be provided rather than forcing mods to depend directly on internal module
layout.

Possible future API:

```ts
SixtyFour.mods.register({
    id: "example-mod",
    name: "Example Mod",

    setup(game) {
        // commit crimes against cubes here
    }
})
```

Existing mods should require as little rewriting as reasonably possible.

---

## `stuff.js`

There is a file called:

```text
stuff.js
```

It contains a substantial portion of the physical universe.

This is not a joke.

The long-term migration will break large monolithic files into understandable
modules without changing their behavior.

Something more like:

```text
src/game/entities/
├── Entity.ts
├── Cube.ts
├── machines/
├── storage/
├── extraction/
├── strange/
└── index.ts
```

instead of:

```text
stuff.js
```

containing, approximately:

```text
stuff
```

The original naming is nonetheless respected for its honesty.

---

## Running the original browser-compatible build

For development/testing with a legally obtained local installation:

```bash
cd game
python -m http.server 6464
```

Then open:

```text
http://localhost:6464
```

Use the same hostname consistently.

For example:

```text
http://localhost:6464
```

and:

```text
http://127.0.0.1:6464
```

are different browser origins and therefore receive different browser storage.

If your save appears to vanish after changing between them, the game has not
destroyed your progress.

The browser is simply doing browser things.

---

## Future Vite development

Eventually development should look more conventionally cursed:

```bash
npm install
npm run dev
```

Production:

```bash
npm run build
```

Expected output:

```text
dist/
├── index.html
└── assets/
```

Specific setup instructions will be updated once the migration reaches that
point.

There is little value in documenting build commands for a build system that
does not exist yet.

---

## Project goals

### Preserve

* gameplay
* progression
* visual identity
* save compatibility
* simulation behavior
* existing content

### Improve

* code readability
* maintainability
* browser compatibility
* input handling
* persistence
* cross-device play
* performance
* modding interfaces
* debugging
* type safety

### Avoid

* unnecessary rewrites
* framework-for-the-sake-of-framework decisions
* breaking existing saves
* changing game balance during refactors
* turning every three-line utility into a dependency
* creating `AbstractEntityManagerFactoryProvider.ts`

We have standards.

Some.

---

## Contributions

This project is currently experimental.

Before contributing substantial changes:

1. preserve existing behavior
2. keep refactors focused
3. separate fixes from migrations
4. test saves before and after changes
5. do not commit original game assets or code unless the repository's rights
   situation explicitly allows it
6. explain weird behavior before "fixing" it

A suspicious line of code may be a bug.

It may also be keeping an unrelated machine three progression stages later
from spontaneously becoming `NaN`.

Observe before deleting.

---

## Original game

Sixty Four was created by **Oleg Danilov**.

Please support the original developer and obtain the game through its official
distribution channels.

This project exists because the game is interesting enough to be worth
experimenting with, not because the original developer should be deprived of
sales.

---

## Disclaimer

**Sixty Four: Cursed Edition is an unofficial community project.**

It is not affiliated with, sponsored by, approved by, or endorsed by Oleg
Danilov or the publisher/distributor of Sixty Four.

The original:

* game code
* game assets
* artwork
* audio
* text
* trademarks
* game design

remain the property of their respective rights holders.

This project does not claim ownership over the original game.

Development is currently taking place privately while the technical and legal
shape of the project is being determined.

Any future public release should avoid redistributing original copyrighted game
files unless explicit permission or an appropriate license exists.

If the rights holder requests that distribution stop, requires ownership
verification, wants official integration, or wishes to discuss the project,
those requests should be taken seriously.

---

## Licensing

Do **not** assume that the presence of readable source code in a commercial
game makes that source open source.

It does not.

Any license eventually applied to Cursed Edition should distinguish between:

1. newly written modernization/platform code, and
2. original Sixty Four code/assets.

Original copyrighted material remains subject to its original rights.

This section will be updated if the project receives explicit permission or
licensing terms from the rights holder.

---

## Why "Cursed Edition"?

Because the project began under the assumption that porting an Electron game to
the web would involve actual porting.

Instead:

```bash
python -m http.server
```

worked.

Then we discovered browser saves already worked too.

At that point the name chose itself.

---

## Final technical summary

```text
Sixty Four
│
├── readable JavaScript
├── HTML
├── Canvas
├── browser audio
├── localStorage
├── browser fallback
│
└── Electron
     ├── Steamworks
     ├── Steam Cloud
     ├── achievements
     └── bundled Chromium
```

Cursed Edition intends to become:

```text
Sixty Four
│
├── Vite
├── TypeScript
├── Canvas
├── IndexedDB
├── modern input
├── account system
├── optional cloud saves
├── mod API
└── normal web browser
```

Turns out the browser part was never the difficult bit.

Famous last words.
