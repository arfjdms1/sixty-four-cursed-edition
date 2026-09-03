# Bundled Mod Template

Copy this directory into `src/mods/`, then edit the manifest ID, name, author, description, and setup behavior. The ID must be a unique lowercase `namespace:name` value.

```bash
cp -r examples/mod-template src/mods/my-mod
npm run typecheck
npm run build
```

Run the game, open **Mods**, enable the mod, and reload when prompted. Bundled source mods are compiled with the application; this is not a drop-in external mod package.

Use only `../../scripts/modding/api/index.js` for imports. See [`docs/modding.md`](../../docs/modding.md) for content, behavior, and safe UI examples.
