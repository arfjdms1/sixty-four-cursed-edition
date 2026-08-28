import { cpSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const projectRoot = fileURLToPath(new URL('.', import.meta.url))
const gameRoot = resolve(projectRoot, 'game')
const distRoot = resolve(projectRoot, 'dist')

/** Copy the legacy browser game unchanged into dist after Vite's no-op build. */
function copyLegacyGame() {
  return {
    name: 'copy-legacy-game',
    closeBundle() {
      for (const entry of ['index.html', 'scripts', 'img', 'sfx', 'font']) {
        cpSync(resolve(gameRoot, entry), resolve(distRoot, entry), { recursive: true })
      }
      rmSync(resolve(distRoot, 'assets'), { recursive: true, force: true })
    },
  }
}

export default defineConfig({
  root: gameRoot,
  publicDir: false,
  build: {
    outDir: distRoot,
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(projectRoot, 'vite-empty-entry.js'),
    },
  },
  server: {
    host: '127.0.0.1',
    port: 6464,
    strictPort: true,
  },
  preview: {
    host: '127.0.0.1',
    port: 6464,
    strictPort: true,
  },
  plugins: [copyLegacyGame()],
})
