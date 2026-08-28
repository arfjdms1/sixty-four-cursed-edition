import { cpSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const projectRoot = fileURLToPath(new URL('.', import.meta.url))
const gameRoot = resolve(projectRoot, 'game')
const distRoot = resolve(projectRoot, 'dist')

/** Preserve document-relative URLs used to load images, audio, and fonts at runtime. */
function copyStaticAssets() {
  return {
    name: 'copy-static-assets',
    closeBundle() {
      for (const entry of ['img', 'sfx', 'font']) {
        cpSync(resolve(gameRoot, entry), resolve(distRoot, entry), { recursive: true })
      }
    },
  }
}

export default defineConfig({
  base: './',
  root: gameRoot,
  publicDir: false,
  build: {
    outDir: distRoot,
    emptyOutDir: true,
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
  plugins: [copyStaticAssets()],
})
