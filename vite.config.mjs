import { cpSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

const projectRoot = fileURLToPath(new URL('.', import.meta.url))
const srcRoot = resolve(projectRoot, 'src')

/** Preserve document-relative URLs used to load images, audio, and fonts at runtime. */
function copyStaticAssets(outDir) {
  return {
    name: 'copy-static-assets',
    closeBundle() {
      cpSync(resolve(srcRoot, 'resources'), resolve(outDir, 'resources'), { recursive: true })
    },
  }
}

export default defineConfig(({ mode }) => {
  const isOffline = mode === 'offline' || process.env.BUILD_TARGET === 'offline'
  const outDir = resolve(projectRoot, 'dist', isOffline ? 'offline' : 'hosted')
  const base = process.env.VITE_BASE || './'

  const plugins = [copyStaticAssets(outDir)]
  if (isOffline) {
    plugins.push(viteSingleFile({ useRecommendedBuildConfig: false }))
  }

  return {
    base,
    root: srcRoot,
    publicDir: false,
    build: {
      outDir,
      emptyOutDir: true,
      assetsInlineLimit: isOffline ? 100000000 : 4096,
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
    plugins,
  }
})
