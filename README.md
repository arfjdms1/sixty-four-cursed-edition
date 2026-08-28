
# Sixty Four: Cursed Edition

This project started as an attempt to port Sixty Four to the web.

That turned out to be unnecessary.

The shipped game already contains readable JavaScript, HTML, assets, browser-compatible save logic, and a fallback path for running without Electron. Serving the `game/` directory with a basic HTTP server was enough to make the game run in a normal browser with working local saves.

In other words:

```bash
cd game
python -m http.server 6464
````

was apparently the web port.

This repository exists to modernize that browser-compatible codebase with Vite, TypeScript, improved persistence, cloud saves, accounts, and other web-focused improvements while preserving original behavior.

## Status

- [x] Runs in a normal browser
- [x] Local saves work
- [ ] Vite migration
- [ ] TypeScript migration
- [ ] IndexedDB persistence
- [ ] Cloud saves
- [ ] Account system
- [ ] Web-safe input handling
- [ ] Mod compatibility

## Legal

This is an unofficial project and is not affiliated with or endorsed by the developer or publisher of Sixty Four.

The original game, code, assets, audio, and trademarks belong to their respective rights holders.

This repository is currently private while the project is being explored and modernized.
