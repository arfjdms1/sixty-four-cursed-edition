import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import http from 'node:http'

// 1. Validate achievement definitions and static asset files
const codexFile = fs.readFileSync('src/scripts/codex.ts', 'utf8')
const achievementSrcMatches = [...codexFile.matchAll(/src:\s*[`'"]([^`'"]+)[`'"]/g)].map(m => m[1])
const achievementSrcs = achievementSrcMatches.filter(s => s.includes('glory/'))

assert.equal(achievementSrcs.length, 33, `Expected 33 achievement sources, found ${achievementSrcs.length}`)

const requiredFiles = ['resources/images/glory/blank.png', ...achievementSrcs]

for (const rel of requiredFiles) {
	const srcPath = path.join('src', rel)
	assert.ok(fs.existsSync(srcPath), `Missing source achievement icon: ${srcPath}`)
	const stat = fs.statSync(srcPath)
	assert.ok(stat.size > 0, `Source achievement icon is empty: ${srcPath}`)
}

// 2. Validate built distribution files if present
for (const target of ['hosted', 'offline']) {
	const targetDir = path.join('dist', target)
	if (fs.existsSync(targetDir)) {
		for (const rel of requiredFiles) {
			const distPath = path.join(targetDir, rel)
			assert.ok(fs.existsSync(distPath), `Missing build achievement icon in dist/${target}: ${distPath}`)
			const stat = fs.statSync(distPath)
			assert.ok(stat.size > 0, `Build achievement icon is empty: ${distPath}`)
		}
	}
}

// 3. Test HTTP 200 resolution via live server
const mimeTypes = {
	'.png': 'image/png',
	'.html': 'text/html',
	'.css': 'text/css',
	'.js': 'application/javascript',
	'.svg': 'image/svg+xml',
	'.mp3': 'audio/mpeg',
}

const serverRoot = fs.existsSync('dist/hosted') ? 'dist/hosted' : 'src'
const server = http.createServer((req, res) => {
	const safePath = path.normalize(req.url.split('?')[0]).replace(/^(\.\.[\/\\])+/, '')
	const filePath = path.join(serverRoot, safePath === '/' ? 'index.html' : safePath)
	if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
		const ext = path.extname(filePath).toLowerCase()
		res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' })
		res.end(fs.readFileSync(filePath))
	} else {
		res.writeHead(404, { 'Content-Type': 'text/plain' })
		res.end('Not Found')
	}
})

await new Promise(resolve => server.listen(0, '127.0.0.1', () => resolve()))
const port = server.address().port

async function fetchUrl(url) {
	return new Promise((resolve, reject) => {
		http.get(url, (res) => {
			const chunks = []
			res.on('data', chunk => chunks.push(chunk))
			res.on('end', () => {
				resolve({
					statusCode: res.statusCode,
					headers: res.headers,
					body: Buffer.concat(chunks),
				})
			})
		}).on('error', reject)
	})
}

try {
	for (const rel of requiredFiles) {
		const url = `http://127.0.0.1:${port}/${rel}`
		const res = await fetchUrl(url)
		assert.equal(res.statusCode, 200, `Expected 200 for ${url}, got ${res.statusCode}`)
		assert.equal(res.headers['content-type'], 'image/png')
		assert.ok(res.body.length > 0)
	}
} finally {
	await new Promise(resolve => server.close(resolve))
}

console.log(`Validated ${requiredFiles.length} achievement icons successfully.`)
