import { Buffer } from 'node:buffer'
import { cpSync } from 'node:fs'
import { posix, resolve } from 'node:path'
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

/** Keep lazy chunks catchable while embedding them in the offline HTML file. */
function inlineDynamicChunksAsDataUrls() {
  return {
    name: 'inline-dynamic-chunks-as-data-urls',
    enforce: 'post',
    generateBundle(_options, bundle) {
      const encoded = new Map()

      const replaceDependency = (code, owner, dependency, dataUrl) => {
        const relative = posix.relative(posix.dirname(owner), dependency)
        const specifier = relative.startsWith('.') ? relative : `./${relative}`
        const replacement = JSON.stringify(dataUrl)
        const next = code
          .replaceAll(JSON.stringify(specifier), replacement)
          .replaceAll(`'${specifier}'`, replacement)
        if (next === code) throw new Error(`Could not inline dynamic chunk reference ${specifier} from ${owner}`)
        return next
      }

      const encodeChunk = (fileName, stack = new Set()) => {
        const cached = encoded.get(fileName)
        if (cached) return cached
        if (stack.has(fileName)) throw new Error(`Offline dynamic chunk cycle includes ${fileName}`)

        const chunk = bundle[fileName]
        if (!chunk || chunk.type !== 'chunk') throw new Error(`Missing offline dynamic chunk ${fileName}`)
        if (chunk.isEntry) throw new Error(`Offline dynamic chunk ${fileName} imports an entry chunk`)
        if (chunk.viteMetadata?.importedCss?.size) {
          throw new Error(`Offline dynamic chunk ${fileName} imports CSS; bundled mod CSS is not supported by API v0`)
        }

        const nextStack = new Set(stack).add(fileName)
        let code = chunk.code
        for (const dependency of [...chunk.imports, ...chunk.dynamicImports]) {
          const dependencyUrl = encodeChunk(dependency, nextStack)
          code = replaceDependency(code, fileName, dependency, dependencyUrl)
        }

        const dataUrl = `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`
        encoded.set(fileName, dataUrl)
        return dataUrl
      }

      for (const chunk of Object.values(bundle)) {
        if (chunk.type !== 'chunk' || !chunk.isEntry) continue
        for (const dependency of [...chunk.imports, ...chunk.dynamicImports]) {
          chunk.code = replaceDependency(chunk.code, chunk.fileName, dependency, encodeChunk(dependency))
        }
      }
      for (const fileName of encoded.keys()) delete bundle[fileName]
    },
  }
}

export default defineConfig(({ mode }) => {
  const isOffline = mode === 'offline' || process.env.BUILD_TARGET === 'offline'
  const outDir = resolve(projectRoot, 'dist', isOffline ? 'offline' : 'hosted')
  const base = process.env.VITE_BASE || './'

  const plugins = [copyStaticAssets(outDir)]
  if (isOffline) {
    plugins.push(inlineDynamicChunksAsDataUrls())
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
