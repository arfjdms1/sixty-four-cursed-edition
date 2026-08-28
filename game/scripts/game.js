class VFX {

	constructor(master, payload){

		this.master = master
		this.oncomplete = _=>{}
		this.visibility = payload?.visibility || [1]

	}

	update(dt){

		this.time += dt

		if (this.time >= this.maxEndTime){
			
			this.oncomplete()
			this.terminate = true

		}

	}

	render(){

	}
	

}

class Exhaust extends VFX {

	constructor(master, payload){

		super(master, payload)

		this.time = 0
		this.maxEndTime = 220
		this.uv = payload?.uv || [0,0]
		this.shift = [(Math.random() * 2 - 1) * this.master.unit * .2, (Math.random() * 2 - 1) * this.master.unit * .2]
		this.maxRadius = (.6 + Math.random() * .8) * this.master.unit
		this.color = payload?.color || `#EEE`

	}

	render(){

		if (this.visibility[this.master.plane]){

			const f = (this.time / this.maxEndTime)
			const r1 = f ** .3 * this.maxRadius
			const r2 = Math.max(0, (f - .3333) * 1.3) ** .4 * this.maxRadius
			const p = this.master.uvToXYUntranslated(this.uv)

			const ctx = this.master.ctx

			ctx.fillStyle = this.color

			ctx.beginPath()
			ctx.arc(p[0], p[1], r1, 0, Math.PI * 2)
			// ctx.closePath()

			// ctx.beginPath()
			ctx.arc(p[0], p[1], r2, 0, Math.PI * 2)
			ctx.closePath()

			ctx.fill(`evenodd`)

		}

	}

}

class ResourceExplosion extends VFX {

	constructor(master, payload){

		super(master, payload)

		//payload:
		//resources, source

		const force = (payload?.force || 9) * this.master.unit
		const endRange = [100,600]
		const paths = []
		const resources = []
		const endTimes = []

		let maxEndTime = 0

		for (let i = 0; i < payload.resources.length; i++){

			const max = Math.min(payload.resources[i], this.master.renderLimitOfAKind)
			const rp = payload?.source ? payload.source : this.master.resourceHomes[i]

			for (let j = 0; j < max; j++){

				const d = [force * (Math.random() * 2 - 1), force * (Math.random() * 2 - 1)]

				const curve = new Bezier([[rp[0], rp[1]], [rp[0] + d[0], rp[1] + d[1]],[rp[0] + d[0], rp[1] + d[1]], [rp[0]+d[0], rp[1] + d[1]]])
				const endTime = endRange[0] + Math.random() * [endRange[1] - endRange[0]]
				paths.push(curve)
				resources.push(i)
				endTimes.push(endTime)
				maxEndTime = Math.max(maxEndTime, endTime)
				
			}

		}


		this.resources = resources
		this.paths = paths
		this.endTimes = endTimes
		this.maxEndTime = maxEndTime
		this.time = 0

	}

	render(){

		if (this.visibility[this.master.plane]){

			for (let j = 0; j < this.resources.length; j++){

				// if ((this.resources[j] !== 9 && !this.master.plane) || (this.resources[j] === 9 && this.master.plane === 1)){

					const f = (this.time / this.endTimes[j]) ** .6
					if (f <= 1){
					
						const from = Math.max(0, f - .05)
						const to = Math.min(1, f + .05)
						const q = this.quantities ? this.quantities[j] : 1

						const b = this.paths[j]
						this.master.ctx.strokeStyle = this.master.codex.resources[this.resources[j]].triplet[j%3]
						this.master.ctx.lineCap = `round`
						this.master.ctx.lineWidth = (.5 + (1-f) * .5) * this.master.pixelRatio * 4
						this.master.ctx.beginPath()
						const p0 = b.getXY(from)
						this.master.ctx.moveTo(p0[0], p0[1])
						for (let f = from + .02; f < to; f+=.02){
							const p = b.getXY(f)
							this.master.ctx.lineTo(p[0], p[1])
						}
						this.master.ctx.stroke()

					}

				// }
				

			}
		}

	}

}

class ResourceSpark extends VFX {

	constructor(master, payload){

		super(master, payload)

		//payload:
		//resources, source

		const multiplyer = 16
		const force = this.master.unit * 2
		const endRange = [60,300]
		const paths = []
		const resources = []
		const endTimes = []

		let maxEndTime = 0

		for (let i = 0; i < payload.resources.length; i++){

			const max = Math.min(payload.resources[i] * multiplyer, this.master.renderLimitOfAKind)
			const rp = payload?.source ? payload.source : this.master.resourceHomes[i]

			for (let j = 0; j < max; j++){

				const d = [force * (Math.random() * 2 - 1), force * (Math.random() * 2 - 1)]
				const offsetA = [force * (Math.random() * 2 - 1) * .2, force * (Math.random() * 2 - 1) * .2]
				const offsetB = [force * (Math.random() * 2 - 1) * .2, force * (Math.random() * 2 - 1) * .2]

				const curve = new Bezier([
					[rp[0], rp[1]], 
					[rp[0] + offsetA[0], rp[1] + offsetA[0]],
					[rp[0] + d[0] + offsetB[0], rp[1] + d[1] + offsetB[1]], 
					[rp[0] + d[0], rp[1] + d[1]]])
				const endTime = endRange[0] + Math.random() * [endRange[1] - endRange[0]]
				paths.push(curve)
				resources.push(i)
				endTimes.push(endTime)
				maxEndTime = Math.max(maxEndTime, endTime)
				
			}

		}

		this.resources = resources
		this.paths = paths
		this.endTimes = endTimes
		this.maxEndTime = maxEndTime
		this.time = 0

	}

	render(){

		if (this.visibility[this.master.plane]){

			for (let j = 0; j < this.resources.length; j++){

				

					const f = (this.time / this.endTimes[j]) ** .6
					if (f <= 1){
					
						const from = Math.max(0, f - .05)
						const to = Math.min(1, f + .05)
						const q = this.quantities ? this.quantities[j] : 1

						const b = this.paths[j]
						this.master.ctx.strokeStyle = this.master.codex.resources[this.resources[j]].triplet[j%3]
						this.master.ctx.lineCap = `round`
						this.master.ctx.lineWidth = (.5 + (1-f) * .5) * this.master.pixelRatio * 4
						this.master.ctx.beginPath()
						const p0 = b.getXY(from)
						this.master.ctx.moveTo(p0[0], p0[1])
						for (let f = from + .02; f < to; f+=.02){
							const p = b.getXY(f)
							this.master.ctx.lineTo(p[0], p[1])
						}
						this.master.ctx.stroke()

					}

				
				

			}

		}

	}

}

class ResourceTransfer extends VFX {

	constructor(master, payload){

		super(master, payload)

		//payload:
		//force, resources, source, destination, skip analytics

		const force = (payload?.force || 9) * this.master.unit
		const endRange = this.master.resourceTransferType < 2 ? [900,1500] : [100,600]
		const paths = []
		const resources = []
		const endTimes = []
		const quantities = []
		let maxEndTime = 0

		if (this.master.resourceTransferType < 3){

			for (let i = 0; i < payload.resources.length; i++){

				if (payload.resources[i]){

					const max = Math.min(payload.resources[i], this.master.renderLimitOfAKind)
					const rd = payload?.destination ? payload.destination : this.master.resourceHomes[i]
					const rp = payload?.source ? payload.source : this.master.resourceHomes[i]

					for (let j = 0; j < max; j++){

						const curve = new Bezier([
							[rp[0], rp[1]], 
							[rp[0] + force * (Math.random() * 2 - 1), rp[1] + force * (Math.random() * 2 - 1)],
							[rd[0] + force * .1 * (Math.random() * 2 - 1), rd[1] + force * .1 * (Math.random() * 2 - 1)], 
							[rd[0], rd[1]]
						])
						const endTime = endRange[0] + Math.random() * [endRange[1] - endRange[0]]
						paths.push(curve)
						resources.push(i)
						quantities.push(1)
						endTimes.push(endTime)
						maxEndTime = Math.max(maxEndTime, endTime)
						
					}
				}

			}
		} else {
			for (let i = 0; i < payload.resources.length; i++){

				if (payload.resources[i]){

				const rd = payload?.destination ? payload.destination : this.master.resourceHomes[i]
				const rp = payload?.source ? payload.source : this.master.resourceHomes[i]

				const curve = new Bezier([
					[rp[0], rp[1]], 
					[rp[0] + force * (Math.random() * 2 - 1), rp[1] + force * (Math.random() * 2 - 1)],
					[rd[0] + force * (Math.random() * 2 - 1), rd[1] + force * (Math.random() * 2 - 1)],
					[rd[0], rd[1]]
					])
				const endTime = endRange[0] + Math.random() * (endRange[1] - endRange[0])
				paths.push(curve)
				resources.push(i)
				quantities.push(payload.resources[i])
				endTimes.push(endTime)
				maxEndTime = Math.max(maxEndTime, endTime)
					
				}

			}
		}


		this.resources = resources
		this.quantities = quantities
		this.paths = paths
		this.endTimes = endTimes
		this.maxEndTime = maxEndTime
		this.oncomplete = payload?.f ? payload.f : _=>{this.master.addResourcesFromArray(payload.resources, payload.skip)}
		this.time = 0
		
	}

	render(){

		if (this.visibility[this.master.plane]){

			for (let j = 0; j < this.resources.length; j++){

				
				let f = (this.time / this.endTimes[j]) ** .6
				if (f <= 1){

					if (this.master.resourceTransferType === 0){

						const coords = this.paths[j].getXY(f)
						this.master.drawResourceInScreenCoordinates(this.resources[j], coords)

					} else {
				
						const from = Math.max(0, f - .05)
						const to = Math.min(1, f + .05)
						const q = this.quantities ? this.quantities[j] : 1

						const b = this.paths[j]
						this.master.ctx.strokeStyle = this.master.codex.resources[this.resources[j]].triplet[j%3]
						this.master.ctx.lineCap = `round`
						this.master.ctx.lineWidth = (.5 + (1-f) * .5) * this.master.pixelRatio * 4 * (this.master.resourceTransferType < 3 ? 1 : .5 + 5 * Math.min(1, q / 256))
						this.master.ctx.beginPath()
						const p0 = b.getXY(from)
						this.master.ctx.moveTo(p0[0], p0[1])
						for (let f = from + .02; f < to; f+=.02){
							const p = b.getXY(f)
							this.master.ctx.lineTo(p[0], p[1])
						}
						this.master.ctx.stroke()

					}

				}
				

			}

		}

	}

}

class ChasmTransfer extends VFX {

	constructor(master, payload){

		super(master, payload)

		this.resources = payload.resources
		this.maxEndTime = 100 + Math.random() * 200
		this.path = payload.path
		this.oncomplete = payload?.f ? payload.f : _=>{this.master.addResourcesFromArray(payload.resources)}
		this.time = 0

		// for (let i = 0; i < this.path.length; i++){
		// 	this.path[i][0] += (Math.random() * 2 - 1) * this.master.unit * .2
		// 	this.path[i][1] += (Math.random() * 2 - 1) * this.master.unit * .2
		// }
		
	}

	render(){

		if (this.visibility[this.master.plane] && this.path.length > 1){

			const deviance = .05
			const delta = 2
			const t = this.time / this.maxEndTime
			const center = (this.path.length - 1) * t

			const ctx = this.master.ctx

			ctx.lineCap = `round`
			ctx.lineWidth = Math.max(0, (1 - Math.abs(.5 - t) * 2)) ** 4 * this.master.pixelRatio * 8

			let xyf, xyl
			const idf = Math.max(Math.floor(center - delta), 0)
			const fromStart = idf === 0
			if (fromStart){
				xyf = this.master.uvToXYUntranslated(this.path[idf])
			} else {
				const xyf0 = this.master.uvToXYUntranslated(this.path[idf])
				const xyf1 = this.master.uvToXYUntranslated(this.path[idf + 1])
				xyf = [xyf0[0] + (xyf1[0] - xyf0[0]) * (center % 1), xyf0[1] + (xyf1[1] - xyf0[1]) * (center % 1)]
			}

			const idl = Math.min(Math.floor(center + delta), this.path.length - 1)
			const toEnd = idl === this.path.length - 1
			if (toEnd){
				xyl = this.master.uvToXYUntranslated(this.path[idl])
			} else {
				const xyl0 = this.master.uvToXYUntranslated(this.path[idl])
				const xyl1 = this.master.uvToXYUntranslated(this.path[idl - 1])
				xyl = [xyl0[0] + (xyl1[0] - xyl0[0]) * (center % 1), xyl0[1] + (xyl1[1] - xyl0[1]) * (center % 1)]
			}

			let dx0 = 0, dy0 = 0, dx1 = 0, dy1 = 0

			if (fromStart){
				dx0 = (Math.random() * 2 - 1) * this.master.unit * deviance * 2
				dy0 = (Math.random() * 2 - 1) * this.master.unit * deviance * 2
			}
			if (toEnd){
				dx1 = (Math.random() * 2 - 1) * this.master.unit * deviance * 2
				dy1 = (Math.random() * 2 - 1) * this.master.unit * deviance * 2
			}

			

			for (let r = 0; r < this.resources.length; r++){
				if (this.resources[r]){
					ctx.strokeStyle = this.master.codex.resources[r].triplet[1]
					ctx.beginPath()
					ctx.moveTo(xyf[0] + dx0, xyf[1] + dy0)
					for (let i = idf + 1; i < idl; i++){
						const xy = this.master.uvToXYUntranslated(this.path[i])
						ctx.lineTo(xy[0] + ((i * this.master.time.lt * 57.319 * (r + 367.13) % 1) * 2 - 1) * this.master.unit * deviance, xy[1] + ((i * this.master.time.lt * 793.567 * (r + 17.2) % 1) * 2 - 1) * this.master.unit * deviance)
					}
					ctx.lineTo(xyl[0] + dx1, xyl[1] + dy1)
					ctx.stroke()
				}
			}

		}

	}

}

class Lightning extends VFX {

	constructor(master, payload){

		super(master, payload)

		this.color = payload.color || `#FFF`

		const force = 4 * this.master.unit
		this.resources = payload.resources
		this.maxEndTime = 100 + Math.random() * 200

		const rd = payload?.destination ? payload.destination : this.master.resourceHomes[i]
		const rp = payload?.source ? payload.source : this.master.resourceHomes[i]
		const curve = new Bezier([
			[rp[0], rp[1]], 
			[rp[0] + force * (Math.random() * 2 - 1), rp[1] + force * (Math.random() * 2 - 1)],
			[rd[0] + force * (Math.random() * 2 - 1), rd[1] + force * (Math.random() * 2 - 1)],
			[rd[0], rd[1]]
			])
		
		this.path = curve
		this.oncomplete = payload?.f ? payload.f : _=>{this.master.addResourcesFromArray(payload.resources)}
		this.time = 0
		
	}

	render(){

		if (this.visibility[this.master.plane]){

			const t = this.time / this.maxEndTime

			this.master.ctx.strokeStyle = this.color
			this.master.ctx.lineCap = `round`
			this.master.ctx.lineWidth = (1 - t) * this.master.pixelRatio * 4
			this.master.ctx.beginPath()
			const p0 = this.path.getXY(0)
			this.master.ctx.moveTo(p0[0], p0[1])
			for (let f = .05; f <= 1; f+=.05){
				const p = this.path.getXY(f)
				const r1 = (Math.random() * 2 - 1) * this.master.unit * .1
				const r2 = (Math.random() * 2 - 1) * this.master.unit * .1
				this.master.ctx.lineTo(p[0] + r1, p[1] + r2)
			}
			this.master.ctx.stroke()

			if (t < .33 && !this.master.chillMode){
				this.master.ctx.save()
				this.master.ctx.globalAlpha = (1 - t*3) * .1
				// this.master.ctx.fillStyle = `rgba(255,255,255,${(1 - t*3) * .1})`
				this.master.ctx.fillStyle = this.color
				this.master.ctx.fillRect(0,0,this.master.w,this.master.h)
				this.master.ctx.restore()

			}

		}

	}

}

class Game {

	constructor(canvas, preload){

		this.canvas = canvas
		this.ctx = this.canvas.getContext(`2d`)

		this.isWindows = navigator.userAgent.indexOf(`Win`) !== -1
		this.steamId = preload?.steamId || ``
		this.languages = [`en`, `ru`, `de`, `ptbr`, `it`, `es`, `fr`, `nl`, `cz`, `pl`, `jp`, `kr`, `sch`, `tch`, `thai`, `hu`, `lv`, `ro`]
		this.languageId = this.getLanguageId()
		if (this.languageId === null) this.languageId = (preload && preload.languageId !== null) ? preload.languageId : 0
		this.language = this.languages[this.languageId]
		this.hasSteam = this.steamId ? true : false
		this.backups = []

		try {
			this.spaceport = require(`electron`).ipcRenderer
		} catch(e){
			this.spaceport = {send:_=>false, isPlaceholder: true}
		}

		this.pixelRatio = devicePixelRatio
		this.translation = [0, 0]
		this.translationMap = [0, 0, 0, 0]
		const zoom = +localStorage.getItem(`abstractv03_zoom${this.steamId}`)
		this.zoomRange = [.3, 2]
		this.zoom = (zoom >= this.zoomRange[0] && zoom <= this.zoomRange[1]) ? zoom : 1
		
		this.translationSpeed = this.pixelRatio
		this.distanceToOrigins = 0

		this.time = {lt: performance.now(), dt: 0, realDt: 0}
		this.renderTime = {lt: performance.now(), dt: 0}
		this.mouse = {
			xy: [0,0],
			offsetxy: [0,0],
			cursorVisible: true,
			state: 0,
			positionChanged: false,
			lastOffset: [0,0],
			lastTouch: [0,0],
			automate: false,
			maxTimer: 150,
			timer: 150
		}
		this.gamepadButtons = []
		this.isMute = this.getMute()
		this.globalSoundVolume = .6
		this.chillMode = false
		this.version = `1.1.0`

		this.stuff = []
		this.stuffMap = {}
		this.unlockedEntities = {}
		this.vfx = []
		this.chasmVfx = []
		this.entitiesInGame = {}
		this.plane = 0
		this.bridge = false
		this.maxEntityHeight = 3
		this.selectedCell = false
		this.selectedEntity = false
		this.resourceTransferType = 0
		this.onlyones = {}
		this.eraserType = 0
		this.hellgemChunk = 64
		this.renderLimitOfAKind = 96
		this.currentHint = {
			entity: undefined,
			element: undefined
		}
		this.canPlace = false
		this.needNoHelp = false
		// this.music = {
		// 	playing: false,
		// 	finishedAt: performance.now(),
		// 	nextIn: 10000
		// }

		this.hollowSite = false
		this.hollowHardness = 64
		this.hollowEvents = []
		this.darkHollowEvents = []
		this.hollowImage = new Image()
		this.hollowImage.src = `img/hollowEvent.png`

		this.surgeSpawnTimer = 30000 + Math.random() * 120000

		this.voidsculpture = false
		this.switchedplanes = false

		this.slowdown = {
			state: false,
			timer: 0,
			totalTime: 0,
			multiplyer: .1,
			f: 0,
			cooldown: 0
		}

		this.initAnalytics()

		this.waypointList = []
		this.activeCubes = new Set()
		this.annihilators = new Set()
		this.annihilationMachines = new Set()
		this.vaults = new Set()
		this.fruits = new Set()
		this.pumps = new Set()
		this.conductors = new Set()
		this.activeConverters = new Set()
		this.stabilizers = new Set()

		this.stats = {
			totalResourcesMined: new Array(10).fill(0),
			absoluteResourcesCount: 0,
			maxDepth: 0,
			timeEvents: 0,
			totalPlayTime: 0,
			totalCubeClicks: 0,
			machinesBuild: 0,
			machinesSold: 0,
			timesTeleported: 0,
			strangeRockPoked: 0,
			darkVisited: 0,
			timeSinceLastDelete: Infinity,
			excavatorWasBuilt: false
		}

		this.codex = abstract_getCodex()
		this.images = this.preloadImages()
		this.words = abstract_getWords()[this.language]
		this.initResources()
		this.initScreenSize()
		
		this.shop = new Shop(document.querySelector(`.shop`), this)
		this.splash = new Splash(this)
		this.messenger = new Messenger(this)
		this.steamAchievements = preload?.steamAchievements
		this.achiever = new Achiever(this)
		this.explainer = new Explainer(this,localStorage.getItem(`abstractv03_helpIsNeeded${this.steamId}`))

		if (!this.hasSteam) this.showSteamWarning()
		this.setListeners()

		this.updateLoop()
		this.clock = new Worker(`scripts/clock.js`)
		this.clock.addEventListener(`message`, m=>{
			this.updateLoop()
		})
		this.renderloop()
		setTimeout( _=>this.saveLoop(), 10000)
		setTimeout( _=>this.backupLoop(), 240000)

		this.splash.show()

		this.initialLoad(preload?.save)
		
		if (localStorage.getItem(`abstractv03_photofobia${this.steamId}`) === `true` ? true : false) this.togglePhotofobia()
		if (localStorage.getItem(`abstractv03_chill${this.steamId}`) === `true` ? true : false) this.toggleChill()
		if (!this.chillMode) this.splash.fireNotification(this.words.splash.flashbang || ``, this.splash.chill, true, true, 32000)
		// if (!this.chillMode) this.splash.fireNotification(`Bright flashing lights are part of this game. If you are sensitive to them, you may consider disabling flashes by clicking this icon.`, this.splash.chill, true, true, 32000)

		const lsgv = localStorage.getItem(`abstractv03_globalSoundVolume${this.steamId}`)
		if (lsgv !== null) this.updateGlobalVolume(+lsgv)

		this.updateMouseData(this.w2/2, this.h2/2)
		this.processMousemove()

	}

	initAnalytics(){

		this.analytics = {
			measuringFrame: 1000,
			frameCount: 16,
			frames: [],
			frame: [[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],
			frameTimer: 0,
			average: [[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],
			instant: [[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],
			dataSize: 64,
			graphs: []
		}

		for (let i = 0; i < 10; i++){

			const canvas = document.createElement(`canvas`)
			canvas.width = this.w2 / 2
			canvas.height = this.h2 / 2

			this.analytics.graphs.push({
				canvas: canvas,
				ctx: canvas.getContext(`2d`),
				data: [],
				max: 10
			})

		}

	}

	togglePhotofobia(){

		this.photofobia = !this.photofobia
		this.splash.setPhotofobia(this.photofobia)
		localStorage.setItem(`abstractv03_photofobia${this.steamId}`, this.photofobia)

	}

	toggleChill(){

		this.chillMode = !this.chillMode
		this.splash.chill.classList.toggle(`active`)
		localStorage.setItem(`abstractv03_chill${this.steamId}`, this.chillMode)

	}

	preloadImages(){
		const list = this.codex.preload
		const images = {}
		for (let i = 0; i < list.length; i++){

			const img = new Image()
			img.src = list[i]
			images[list[i]] = img

		}
		return images

	}

	showSteamWarning(){

		const warn = document.createElement(`div`)
		warn.classList.add(`steamWarning`)
		document.body.append(warn)

		warn.innerHTML = this.words.random.steamWarning

	}

	initialLoad(save){

		if (save){
			const cloud = this.decodeSave(save)
			const local = this.decodeSave(localStorage.getItem(`abstractv03${this.steamId}`))

			const loadSuccess = this.loadSave((!local && cloud) || (cloud?.timestamp > local?.timestamp) ? cloud : local)
			if (!loadSuccess) {
				this.prepopulate()
				this.splash.updateBackups()
			}
		    this.cleanup()
		} else {
			const loadSuccess = this.loadSave()
	     	if (!loadSuccess) {
	     		this.prepopulate()
	     		this.splash.updateBackups()
	     	}
	     	this.cleanup()
		}

		

	}

	prepopulate(){
		this.addEntity(`pump`,[0,0])
		if (!this.entityAtCoordinates([-100,-100]) ){
			this.addEntity(`strange`,[-100,-100])
		}
		if (!this.entityAtCoordinates([-1024,1024]) ){
			this.addEntity(`cookie`,[-1024,1024])
		}
		if (this.steamAchievements && this.steamAchievements.length){
			this.achiever.setState(this.steamAchievements)
		}
	}

	updateSteamAchievement(id,v){
		this.spaceport?.send(`achieve`, id)
	}

	getMute(){
		const mute = localStorage.getItem(`abstractv03_mute${this.steamId}`)
		return mute === `true` ? true : false
	}

	getLanguageId(){
		const id = +localStorage.getItem(`abstractv03_language${this.steamId}`)
		if (id && this.languages[id]) return id
		return null
	}

	changeLanguage(id){
		if (this.languages[id]){
			this.languageId = id
			this.language = this.languages[this.languageId]
			this.words = abstract_getWords()[this.language]
			this.splash.init({selected: this.splash.selected, selectedId: this.splash.selectedId})
			this.splash.updateBackups()
			// this.shop.init()
			this.shop.switchPlane(this.plane)
			this.messenger.setState(this.messenger.firedEvents, this.messenger.shownMessages, this.messenger.messagesShown)

			for (let i = 0; i < this.stuff.length; i++){
				this.stuff[i].initHint()
			}

			localStorage.setItem(`abstractv03_language${this.steamId}`, this.languageId)
		}
	}

	initScreenSize(){
		this.w = this.canvas.width = this.canvas.offsetWidth * this.pixelRatio
		this.h = this.canvas.height = this.canvas.offsetHeight * this.pixelRatio
		this.w2 = this.w / 2
		this.h2 = this.h / 2
		this.solidUnit = this.h * .1
		// this.unit = this.h * .1
		this.screenUnit = this.h * .1
		this.regularFont = `600 ` + this.screenUnit * .16 + `px Montserrat, sans-serif`
		this.smallFont = `600 ` + this.screenUnit * .12 + `px Montserrat, sans-serif`
		this.microFont = this.screenUnit * .09 + `px Montserrat, sans-serif`
		this.bigFont = this.screenUnit * .3 + `px Verdana, sans-serif`
		this.setResourceHomes()

		this.flashlight = this.ctx.createRadialGradient(this.w2, this.h2, this.h2/4, this.w2, this.h2, this.w2)
		this.flashlight.addColorStop(0, `#1120`)
		this.flashlight.addColorStop(1, `#1129`)

		const dx = this.pixelRatio * 4
		for (let i = 0; i < this.analytics.graphs.length; i++){
			this.analytics.graphs[i].canvas.width = dx * this.analytics.dataSize + dx * 16//this.w2 / 2
			this.analytics.graphs[i].canvas.height = this.analytics.graphs[i].canvas.width * .5//this.h2/3
		}
	}

	watchCredits(){
		this.preventSaving = true
		const texts = this.words.credits
		const eonly = abstract_getWords().en.credits
		const l = this.language

		const addLine = t => {
			const say = document.createElement(`p`)
			say.innerHTML = t
			this.creditPillar.appendChild(say)
		}

		this.halt = true
		this.messenger.element.innerHTML = ``
		setTimeout(_=>{this.lastDialogue = true}, 20000)

		this.credits = document.createElement(`div`)
		this.credits.classList.add(`credits`)
		document.body.appendChild(this.credits)

		// this.creditImage = document.createElement(`div`)
		// this.creditImage.classList.add(`creditImage`)
		// this.credits.appendChild(this.creditImage)

		this.creditImage = document.createElement(`video`)
		this.creditImage.classList.add(`tstv`)
		// this.creditImage.setAttribute(`autoplay`,``)
		this.creditImage.innerHTML = `<source src="img/tst/tst3.mp4" type="video/mp4">`
		this.credits.appendChild(this.creditImage)

		this.creditPillar = document.createElement(`div`)
		this.creditPillar.classList.add(`creditPillar`)
		this.credits.appendChild(this.creditPillar)
		this.creditPillar.style.transform = `translate(0,${innerHeight}px)`

		addLine(texts[0])
		addLine(texts[1])
		addLine(texts[2])
		addLine(`&nbsp;`)
		addLine(texts[3])
		const rtotal = this.makeReadable(this.stats.absoluteResourcesCount)
		addLine(`${texts[4]} ${rtotal}`)

		addLine(`${texts[5]} ${this.makeReadable(this.stats.totalResourcesMined[0])}<br>
			${texts[6]} ${this.makeReadable(this.stats.totalResourcesMined[1])}<br>
			${texts[7]} ${this.makeReadable(this.stats.totalResourcesMined[2])}<br>
			${texts[8]} ${this.makeReadable(this.stats.totalResourcesMined[3])}<br>
			${texts[9]} ${this.makeReadable(this.stats.totalResourcesMined[4])}<br>
			${texts[10]} ${this.makeReadable(this.stats.totalResourcesMined[5])}<br>
			${texts[11]} ${this.makeReadable(this.stats.totalResourcesMined[6])}<br>
			${texts[12]} ${this.makeReadable(this.stats.totalResourcesMined[7])}<br>
			${texts[13]} ${this.makeReadable(this.stats.totalResourcesMined[8])}<br>
			${texts[14]} ${this.makeReadable(this.stats.totalResourcesMined[9])}
			`)

		addLine(`${texts[15]} ${this.stats.machinesBuild}`)
		addLine(`${texts[16]} ${this.stats.machinesSold}`)
		addLine(`${texts[17]} ${Math.floor(this.stats.maxDepth * 10)}`)
		addLine(`${texts[18]} ${this.stats.strangeRockPoked}`)
		addLine(`${texts[19]} ${this.stats.timesTeleported}`)
		addLine(`${texts[20]} ${this.stats.totalCubeClicks}`)
		addLine(`${texts[21]} ${this.stats.timeEvents}`)
		addLine(`${texts[22]} ${Math.floor(this.stats.totalPlayTime / 1000 / 60 / 60 * 10)/10} ${texts[23]}`)

		addLine(`&nbsp;`)
		addLine(texts[24])
		addLine(texts[25])
		addLine(texts[26])
		addLine(texts[27])
		addLine(texts[28])
		addLine(texts[31])
		addLine(`${eonly[32]}<br>${eonly[33]}<br>${eonly[34]}<br>${eonly[35]}<br>${eonly[36]}<br>${eonly[37]}<br>${eonly[38]}<br>${eonly[39]}<br>${eonly[40]}<br>${eonly[41]}<br>${eonly[42]}<br>${eonly[43]}<br>${eonly[44]}<br>${eonly[45]}<br>${eonly[46]}`)
		addLine(`&nbsp;`)
		addLine(texts[29])
		addLine(texts[30])

		this.creditImage.style.opacity = 1
		this.creditImage.play()

		this.creditImage.addEventListener(`ended`,_=>{
			this.creditImage.style.transition = `opacity 48s ease`
			this.creditImage.style.opacity = 0
		})

		const speed = .02
		let scrollAmount = -1000
		let lt = performance.now()
		let finalChord = false
		const scrollDown = p=>{

			const edge = p.getBoundingClientRect().bottom < 0

			if (!edge) requestAnimationFrame(_=>{scrollDown(p)})

			const now = performance.now()
			const dt = now - lt
			lt = now

			scrollAmount += speed * dt
			p.style.transform = `translate(0,${innerHeight - scrollAmount}px)`

			if (!finalChord && edge){
				finalChord = document.createElement(`div`)
				finalChord.classList.add(`finalChord`)
				finalChord.innerHTML = `<span>T-1</span>`
				this.credits.append(finalChord)
				finalChord.onclick = _=>{
					location.reload()
				}
				setTimeout(_=>{finalChord.style.opacity = 1},640)
			}

		}
		scrollDown(this.creditPillar)


	}

	closeCredits(){
		if (this.credits){
			this.halt = false
			this.credits.innerHTML = ``
			document.body.removeChild(this.credits)
			this.credits = undefined
		}
	}

	switchPlane(p){

		if (this.plane !== p){
			this.shop.switchPlane(p)
		}
		if (this.plane === 0 && p === 1) this.stats.darkVisited++
		this.plane = p ? 1 : 0

		this.removeHint()

	}

	getAutonomy(){

		if (!this.chasm) return false

		const key = this.chasm.chasmNetwork
		const silos = []
		const automatedStuff = new Set()
		const auxes = new Set()
		const pumps = new Set()
		const mapTiles = new Set()
		const pumpZones = []

		//Get all connected silos
		for (let i = 0; i < this.stuff.length; i++){

			const s = this.stuff[i]
			if (s instanceof Silo && s.chasmNetwork === key){
				silos.push(s)
			}

		}

		//Get all supplied auxes
		for (let i = 0; i < silos.length; i++){

			const s = silos[i]
			const m = s.getNeighbours()

			for (let j = 0; j < m.length; j++){

				if (m[j] && m[j] instanceof Auxpump) auxes.add(m[j])
				if (m[j] && !(m[j] instanceof Cube)) automatedStuff.add(m[j])

			}

		}

		//Get all automated pumps
		for (let a of auxes){

			for (let i = 0; i < a.soi.length; i++){

				const uv = [a.position[0] + a.soi[i][0], a.position[1] + a.soi[i][1]]
				const entity = this.entityAtCoordinates(uv)
				if (entity instanceof Pump) pumps.add(entity)

			}


		}

		//Get zones available for cubes with pump speeds
		for (let p of pumps){

			const range = p.soe ? p.soe : p.soi

			//Hardcode for auxes
			let auxMult = .25
			for (let i = 0; i < p.auxes.length; i++){

				if (auxes.has(p.auxes[i]) && p.auxes[i] instanceof Auxpump2){
					auxMult = 1
					break
				}

			}

			const zone = {
				pump: p,
				speed: p.pumpSpeed * (1 + auxMult),
				uvs: []
			}

			for (let i = 0; i < range.length; i++){

				const uv = [p.position[0] + range[i][0], p.position[1] + range[i][1]]
				const uvString = `u${uv[0]}v${uv[1]}`
				const entity = this.entityAtCoordinates(uv)

				if (!entity || entity instanceof Cube || !mapTiles.has(uvString)) {
					zone.uvs.push(uv)
					mapTiles.add(uvString)
				}

			}

			pumpZones.push(zone)

		}

		//Check for bonuses and breakers for each spot
		const soi = [[0,-1], [1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]]
		for (let i = 0; i < pumpZones.length; i++){

			const pz = pumpZones[i]

			for (let j = 0; j < pz.uvs.length; j++){

				const c = pz.uvs[j]

				let cubeBreakpower = .08
				let initialPower = 0
				let powerRate = 0
				let breakSpeed = 0

				for (let k = 0; k < soi.length; k++){

					const entity = this.entityAtCoordinates( [c[0] + soi[k][0], c[1] + soi[k][1]] )
					if (!entity || !automatedStuff.has(entity)) continue
					if (entity instanceof Entropic2a) {
						initialPower += entity.power
					} else if (entity instanceof Entropic) {
						initialPower += entity.power
						powerRate += entity.power / entity.interval
					}

				}

				if(!initialPower || !powerRate) console.log(c)

			}

		}


		// console.log(automatedStuff)

	}

	//RESOURCES

	initResources(){

		this.resources = new Array(10).fill(0)
		this.resourcePops = new Array(10).fill(0)
		// this.preGradient = new Array(10).fill(0)
		this.resourcesSprites = []

		for (let i = 0; i < this.codex.resources.length; i++){
			this.resourcesSprites.push(new Sprite({
				master: this,
				src: `img/resources.png`,
				frames: [[i*108,0,104,120]],
				origins: [52,60],
				scale: .25,
				intervals: 100
			}))
		}

		this.resourceBuffer = new Array(10).fill(0)
		this.resourceRates = new Array(10).fill(0)

	}

	setResourceHomes(){

		this.resourceHomes = []
		for (let i = 0; i < this.resources.length; i++){
			this.resourceHomes.push([this.screenUnit * (i+1) * .8, this.screenUnit])
		}

	}

	//SAVE

	async exportSave(){

		if (!this.preventSaving){
			const save = this.assembleSave(true)
			await navigator.clipboard.writeText(save)
		}

	}

	async loadSaveFromClipboard(){

		const encoded = await navigator.clipboard.readText()
		const state = this.decodeSave(encoded)
		if (!state) return
		state.backups = this.backups
		const hope = this.encodeSave(JSON.stringify(state))
		this.importSave(hope)

		// const text = this.decodeSave(encoded)
		// if (text) this.importSave(encoded)

	}

	importSave(data){
		
		this.spaceport?.send(`save`, data)
		localStorage.setItem(`abstractv03${this.steamId}`, data)
		location.reload()

	}

	loadSave( manual = this.decodeSave(localStorage.getItem(`abstractv03${this.steamId}`)) ){

		if (!manual) return false

		try {
			//To make sure
			for (let i = 0; i < manual.resources.length; i++){
				if (manual.resources[i]) this.resources[i] = manual.resources[i]
			}

			this.onlyones = manual.onlyones || {}

			//Just to make sure
			for (let i in this.onlyones){
				if (!this.codex.entities[i].onlyone) delete this.onlyones[i]
			}

			this.updateEraserType(manual.eraserType || 0)

			if (manual.hollowHardness) this.hollowHardness = Math.min(64, manual.hollowHardness)
			if (manual.slowdown) this.slowdown = manual.slowdown
			if (manual.plane) {
				this.plane = manual.plane
				this.shop.switchPlane(this.plane)
			}
			if (manual.switchedplanes) this.switchedplanes = manual.switchedplanes
			if (manual.bridge) this.bridge = manual.bridge
			if (manual.unlockedEntities) this.unlockedEntities = manual.unlockedEntities
			if (manual.needNoHelp) this.needNoHelp = true
			if (manual.messengerFiredEvents && manual.messengerShownMessages && manual.messengerShown !== undefined) {
				this.messenger.setState(manual.messengerFiredEvents, manual.messengerShownMessages, manual.messengerShown)
			}
			if (manual.existed) {
				this.shop.setExisted(manual.existed)
			}
			if (manual.glory) this.achiever.setState(this.steamAchievements || manual.glory)
			if (manual.stats) {
				for (let i in manual.stats)
				this.stats[i] = manual.stats[i]
			}
			if (manual.backups) this.backups = manual.backups
			if (manual.existed?.pump2) this.stats.excavatorWasBuilt = true
			
			for (let i = 0; i < manual.stuff.length; i++){

				const s = manual.stuff[i]
				const entity = s.name === `cube` ? this.addEntity(s.name, s.position, {pump: false, resources: s.par.resources}) : s.name === `surge` ? this.addEntity(s.name, s.position, {resources: s.par.resources, rayNumber: s.par.rayNumber, grade: s.par.grade, colors: s.par.colors, type: s.par.type, maxLife: s.par.maxLife, life: s.par.life}) : this.addEntity(s.name, s.position, undefined, {skipShopUpdate: true})
				if (entity){
					try{
						for (let j in s.par){
							if (s.par[j] !== `resources`) entity[j] = s.par[j]
						}
					} catch(e){console.log(s)}

					entity.init()
				}

			}
			this.shop.updateElements()
			this.splash.updateBackups()

			return true
		} catch(e){

			alert(`Sorry, there is a problem with loading the game. Game saving won't be available and all the progress will be lost on quit.
				${e}`)
			this.preventCloud = true
			return false
		}

	}

	restoreBackup(n){

		if (!this.backups[n]) return
		const state = this.decodeSave(this.backups[n].data)
		if (!state) return
		state.backups = this.backups
		const hope = this.encodeSave(JSON.stringify(state))
		this.importSave(hope)

	}

	backupLoop(){

		if (!this.preventSaving){
			const save = this.assembleSave(true)
			this.backups.unshift({
				timestamp: Date.now(),
				data: save
			})
			if (this.backups.length > 4) this.backups.pop()
			this.splash.updateBackups()
		}
		setTimeout(_=>{this.backupLoop()}, 240000)

	}

	saveLoop(){

		setTimeout(_=>{this.saveLoop()}, 10000)
		this.saveGame()

		//UPDATES
		const payload = [
			{id: `HOURSINARUN`, value: Math.floor(this.stats.totalPlayTime / 1000 / 60 / 60) || 0 },
			{id: `DARKVISITS`, value: this.stats.darkVisited || 0},
			{id: `TOTALRESOURCECOUNT_K`, value: Math.min(Math.floor(this.stats.absoluteResourcesCount / 1e3), 64) || 0},
			{id: `TOTALRESOURCECOUNT_M`, value: Math.min(Math.floor(this.stats.absoluteResourcesCount / 1e6), 64) || 0},
			{id: `TOTALRESOURCECOUNT_B`, value: Math.min(Math.floor(this.stats.absoluteResourcesCount / 1e9), 64) || 0},
			{id: `TOTALCUBECLICKS`, value: this.stats.totalCubeClicks || 0},
			{id: `MACHINESBUILT`, value: this.stats.machinesBuild || 0},
			{id: `MACHINESSOLD`, value: this.stats.machinesSold || 0},
			{id: `VAULTS`, value: this.entitiesInGame.vault || 0},
			{id: `ROCKPOKES`, value: this.stats.strangeRockPoked || 0},
			{id: `PUMPS`, value: this.entitiesInGame.pump2 || 0},
			{id: `MAXDEPTH`, value: this.stats.maxDepth * 10 || 0},
			{id: `TIMESTELEPORTED`, value: this.stats.timesTeleported || 0}
		]
		this.spaceport?.send(`updateStat`, payload)

	}

	saveGame(){
		if (!this.preventSaving){
			localStorage.setItem(`abstractv03_zoom${this.steamId}`, this.zoom)
			const save = this.assembleSave()
			if (!this.preventCloud){
				localStorage.setItem(`abstractv03${this.steamId}`, save)
				this.spaceport?.send(`save`, save)
			}
		}
	}

	assembleSave(backupless){

		const stuff = []
		for (let i = 0; i < this.stuff.length; i++){
			const string = this.getEntityString(this.stuff[i])
			if (string) stuff.push(string)
		}

		const string = JSON.stringify({
			stuff: stuff, 
			onlyones: this.onlyones, 
			resources: this.resources, 
			eraserType: this.eraserType,
			hollowHardness: this.hollowHardness,
			slowdown: this.slowdown,
			plane: this.plane,
			version: this.version,
			switchedplanes: this.switchedplanes,
			bridge: this.bridge,
			unlockedEntities: this.unlockedEntities,
			needNoHelp: this.needNoHelp,
			messengerShownMessages: this.messenger.shownMessages,
			messengerFiredEvents: this.messenger.firedEvents,
			messengerShown: this.messenger.messagesShown,
			existed: this.shop.existed,
			glory: this.achiever.fired,
			stats: this.stats,
			timestamp: Date.now(),
			backups: backupless ? undefined : this.backups
		})

		return this.encodeSave(string)
		

	}

	decodeSave(s){
		try {
			const legacy = s.substring(0,8) === `{"stuff"`
			const payload = legacy ? s : atob(s)
			return JSON.parse(payload)
		} catch(e){
			console.log(`I cant load most brobably because you have something weird in your clipboard. Gimme a save!`)
			return 0
		}
	}

	encodeSave(s){
		try {
			return btoa(s)
		} catch(e){
			console.log(`I cant save because the designer of this game decided "Well, there is no weird characters in save, I'll just encode it and call it a day." Tell him to fix this shit.`)
		}
		
	}

	getEntityString(e){

		if (!e.name || e.name === `cube` && e.state !== 2) return

		const par = {}
		if (e.name === `pump` || e.name === `pump2`) par.depth = e.depth
		if (e.name === `pump2`) par.timeStamp = 0
		if (e.fill !== undefined) par.fill = e.fill
		if (e.state !== undefined) par.state = (e.state === 1 ? 0 : e.state)
		if (e.conversion !== undefined) par.conversion = e.conversion
		if (e.resources !== undefined) par.resources = e.resources
		if (e.resourceCount !== undefined) par.resourceCount = e.resourceCount
		if (e.spawnedHollows !== undefined) par.spawnedHollows = e.spawnedHollows
		if (e.variant !== undefined) par.variant = e.variant
		if (e.order !== undefined) par.order = e.order
		if (e.soul !== undefined) par.soul = e.soul
		if (e.grade !== undefined) {
			par.grade = e.grade
			par.type = e.type
			par.rayNumber = e.rayNumber
			par.colors = e.colors
			par.maxLife = e.maxLifeTimer
			par.life = e.lifeTimer
		}

		if (e.name === `cube` && e.state === 2) {
			par.broken = e.broken
			par.state = 2
		}

		return {name: e.name, position: e.position, par: par}
	}

	addWaypoint(e, o){

		if (o === undefined){
			o = this.waypointList.length
			for (let i = 0; i < this.waypointList.length; i++){
				if (!this.waypointList[i]){
					o = i
					break
				}
			}
		}

		let exists = -1
		for (let i = 0; i < this.waypointList.length; i++){
			if (e === this.waypointList[i]){
				exists = i
				break
			}
		}

		if (exists === -1) this.waypointList[o] = e
		if (exists !== -1 && o !== exists){
			this.waypointList[exists] = undefined
			this.waypointList[o] = e
		}

		return o

	}

	removeWaypoint(e){

		let reduce = false

		for (let i = 0; i < this.waypointList.length; i++){

			if (reduce){
				this.waypointList[i].order--
			} else {
				if (e === this.waypointList[i]){

					this.waypointList.splice(i,1)
					i--
					reduce = true

				}
			}

		}

	}

	useWaypoint(e){

		for (let i = 0; i < this.waypointList.length; i++){

			if (e === this.waypointList[i]){

				const next = this.waypointList[(i+1)%this.waypointList.length]

				const delta = this.uvToXY(next.position)
				this.translation[0] += delta[0] / this.zoom
				this.translation[1] += delta[1] / this.zoom

			}

		}

	}

	cleanup(){
		//Govnocode to fix everything in legacy

		//thee mega1 onlyones
		if (!this.entitiesInGame.mega1b && this.onlyones.mega1b) delete this.onlyones.mega1b
		if (!this.entitiesInGame.mega1a && !this.entitiesInGame.mega1b && this.onlyones.mega1a) delete this.onlyones.mega1a
		if (!this.entitiesInGame.mega1 && !this.entitiesInGame.mega1a && !this.entitiesInGame.mega1b && this.onlyones.mega1) delete this.onlyones.mega1
		this.shop.check()

	}

	mute(on){

		if (on){
			this.fadeSound(0)
			this.isMute = true
		} else {
			this.fadeSound(1)
			this.isMute = false
		}

	}

	updateEraserType(t){
		this.eraserType = t
		this.shop.check()
	}

	initGlWithShader(){

		this.glcanvas = document.createElement(`canvas`)
		this.glcanvas.width = this.w
		this.glcanvas.height = this.h
		const gl = this.gl = this.glcanvas.getContext(`webgl2`, {premultipliedAlpha: false})

		//Vertex Shader
		const vshader = gl.createShader(gl.VERTEX_SHADER)
		gl.shaderSource(vshader, 
			`#version 300 es 
			in vec2 a_position;
			in vec2 a_texcoord;
			uniform vec2 u_offset;
			out vec2 v_texcoord;
			void main(){
				gl_Position = vec4(a_position + u_offset, 0.0, 1.0);
				v_texcoord = a_texcoord;
			}`)
		gl.compileShader(vshader)
		if (!gl.getShaderParameter(vshader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(vshader))

		//Fragment Shader
		const fshader = gl.createShader(gl.FRAGMENT_SHADER)
		gl.shaderSource(fshader, 
			`#version 300 es

			precision highp float;
			in vec2 v_texcoord;
			uniform sampler2D u_image;
			uniform vec2 u_spriteoffset;
			out vec4 pixelColor;

			void main(void){
				vec4 color = texture(u_image, v_texcoord + u_spriteoffset);
				pixelColor = color; //vec4(v_texcoord, 0., 1.);
			}`)
		gl.compileShader(fshader)
		if (!gl.getShaderParameter(fshader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(fshader))

		//Program
		const program = gl.createProgram()
		gl.attachShader(program, vshader)
		gl.attachShader(program, fshader)
		gl.linkProgram(program)
		if (gl.getProgramParameter(program, gl.LINK_STATUS)){
			gl.useProgram(program)
		} else {
			throw new Error(gl.getProgramInfoLog(program))
		}
		
		this.glStuff = {
			gl: gl,
			textures: {}
		}

		this.glStuff.pal = gl.getAttribLocation(program, `a_position`)
		gl.enableVertexAttribArray(this.glStuff.pal)
		this.glStuff.tal = gl.getAttribLocation(program, `a_texcoord`)
		gl.enableVertexAttribArray(this.glStuff.tal)

		this.glStuff.uspriteoffset = gl.getUniformLocation(program, 'u_spriteoffset')
		this.glStuff.uoffset = gl.getUniformLocation(program, 'u_offset')

		gl.enable(gl.BLEND)
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)


	}

	getLoudnessFromXY(xy){
		const distance = Math.max(Math.abs(xy[0] - this.w2), Math.abs(xy[1] - this.h2)) / this.w / 2
		return Math.max(0, 1 - distance)
	}

	getPanValueFromX(x){
		return Math.min(Math.max(-1, x / this.w * 2 - 1), 1)
	}

	pickupItem(name){

		if (name === `eraser` || name === `eraser2` || name === `eraser3`){
			this.itemInHand = {name: name, eraser: true}
		} else {
			this.itemInHand = new this.codex.entities[name].class(this)
		}

		delete this.transportedEntity

		if (!this.itemInHand.eraser){
			this.itemInHandPriceTag = new Cloud(this)
			this.itemInHandPriceTag.addResourceList(this.getRealPrice(this.itemInHand.name))
		}

	}

	requestResources(r,d,f,skip){

		let good = true
		
		for (let i = 0; i < r.length; i++){

			if (r[i] && this.resources[i] < r[i]){
				good = false
				break
			}

		}

		if (good) {

			this.substractResourcesFromArray(r,skip)
			this.createResourceTransfer(r, false, this.uvToXYUntranslated(d), f ? f : _=>{}, undefined, skip)
			return true
		}

		return false

	}

	askForResources(r,d,f,skip){

		const response = []
		
		for (let i = 0; i < r.length; i++){

			if (r[i]){
				response[i] = Math.min(this.resources[i], r[i])
			}

		}

		this.substractResourcesFromArray(response,skip)
		this.createResourceTransfer(response, false, this.uvToXYUntranslated(d), f ? _=>{f(response)} : _=>{}, undefined, skip)
		return true

	}

	updateGlobalSounds(){

		for (let i = 0; i < this.stuff.length; i++){
			if (this.stuff[i].sfxPlaying) {

				const screenxy = this.uvToXYUntranslated(this.stuff[i].position)
				const pan = this.getPanValueFromX(screenxy[0])
				const loudness = this.getLoudnessFromXY(screenxy)

				this.setPanToSFX(this.stuff[i].sfxPlaying, pan)
				this.setLoudnessToSFX(this.stuff[i].sfxPlaying, loudness)

			}
		}

	}

	updateGlobalVolume(v = this.globalSoundVolume){
		v = Math.max(0, Math.min(1, v))
		this.globalSoundVolume = v
		if (this.splash.soundSlider) this.splash.soundSlider.style.width = 100 * v + `%`
		localStorage.setItem(`abstractv03_globalSoundVolume${this.steamId}`, v)

	}

	fadeSound(v){
		if (this.actx){
			this.sfx.master.gain.cancelScheduledValues(this.actx.currentTime)
			this.sfx.master.gain.linearRampToValueAtTime(.001 + this.globalSoundVolume * v, this.actx.currentTime + 1)
			if (v === 0) this.sfx.master.gain.setValueAtTime(0, this.actx.currentTime + 1)

		}
	}

	initAudio(){

		this.actx = new (AudioContext || webkitAudioContext)()
		this.sfx = {
			ready: false,
			master: this.actx.createGain(),
			samples: {},
			stackSize: 0
		}
		this.sfx.master.gain.value = this.globalSoundVolume
		this.sfx.master.connect(this.actx.destination)

		let counter = 0
		const samples = [
			{src: `sfx/tap.mp3?v5`, name: `tap1`, duration: .2, detune: 300, volume: .5},
			{src: `sfx/tap2.mp3?v2`, name: `tap2`, duration: 1.5, detune: 300, volume: .06},
			{src: `sfx/tap3.mp3?v1`, name: `tap3`, duration: 2, detune: 200, volume: .4},
			{src: `sfx/tap4.mp3?v1`, name: `tap4`, duration: .7, detune: 300, volume: .3},
			{src: `sfx/tap5.mp3?v1`, name: `tap5`, duration: .6, detune: 200, volume: .1},
			{src: `sfx/tap6.mp3?v1`, name: `tap6`, detune: 200, volume: .6},
			{src: `sfx/tap7.mp3`, name: `tap7`, detune: 80, volume: .3},
			{src: `sfx/break.mp3?v3`, name: `break`, duration: .5, detune: 300, volume: .6},
			{src: `sfx/rumble.mp3`, name: `rumble`, volume: .8},
			{src: `sfx/bubble.mp3`, name: `bubble`, volume: .2},
			{src: `sfx/counter.mp3`, name: `geiger`, volume: .3, detune: 100},
			{src: `sfx/release.mp3`, name: `release`, volume: .6},
			{src: `sfx/hellbreak.mp3`, name: `hellbreak`, volume: .4,detune: 100},
			{src: `sfx/horn.mp3`, name: `horn`, volume: .9},
			{src: `sfx/hollow.mp3`, name: `hollow`, detune: 250, volume: .2},
			{src: `sfx/teleport.mp3`, name: `teleport`, volume: .9},
			{src: `sfx/void.mp3`, name: `void`, volume: .9, detune: 100},
			{src: `sfx/soul.mp3`, name: `soul`, volume: 1, detune: 800},
			{src: `sfx/exhaust.mp3`, name: `exhaust`, volume: 1, detune: 200},
			{src: `sfx/lightning.mp3`, name: `lightning`, volume: .5, detune: 50},
			{src: `sfx/siloin.mp3`, name: `silo`, volume: .8},
			{src: `sfx/siloout.mp3`, name: `silo2`, volume: .8},
			{src: `sfx/collect.mp3`, name: `collect`, volume: 1},
			{src: `sfx/shallow_anne.mp3`, name: `endingMusic`, volume: 1}
		]

		for (let i = 0; i < samples.length; i++){

			const s = samples[i]

			fetch(s.src).then(r => {
				r.arrayBuffer().then(buffer=>{
					this.actx.decodeAudioData(buffer, data=>{
						this.sfx.samples[s.name] = {data: data, duration: s.duration, detune: s.detune, volume: s.volume}
						check(this.sfx)
					})
				})
			})

		}

		function check(sfx){
			counter++
			if (counter >= samples.length) sfx.ready = true;
		}

		
	}

	startSound(id, panning, loudness){
		if (this.sfx?.ready){
			if (loudness === undefined) loudness = 1
			const source = this.actx.createBufferSource()
			const volume = this.actx.createGain()
			const pan = this.actx.createStereoPanner()
			pan.pan.value = panning || 0
			volume.gain.value = this.sfx.samples[id].volume * loudness || .5 * loudness
			source.buffer = this.sfx.samples[id].data
			source.loop = true
			if (this.sfx.samples[id].detune) source.detune.value = (Math.random() * 2 - 1) * this.sfx.samples[id].detune
			source.connect(pan)
			pan.connect(volume)
			volume.connect(this.sfx.master)
			
			source.start(this.actx.currentTime)
			// this.sfx.stackSize++

			return {source: source, volume: volume, pan: pan, baseVolume: this.sfx.samples[id].volume || .5}
		}
		return false
	}

	stopSound(sfx, t){
		if (this.sfx?.ready && sfx){
			sfx.volume.gain.exponentialRampToValueAtTime(.01, this.actx.currentTime + (t || 1))
			sfx.source.stop(this.actx.currentTime + (t || 1))
			// this.sfx.stackSize = Math.max(0, this.sfx.stackSize - 1)
		}
	}

	setLoudnessToSFX(sfx, l){
		if (this.sfx?.ready && sfx){
			sfx.volume.gain.value = sfx.baseVolume * l
		}
	}

	setPanToSFX(sfx, p){
		if (this.sfx?.ready && sfx){
			sfx.pan.pan.value = p
		}
	}

	playSound(id, panning, loudness, dark, forced){

		if (this.sfx?.ready && (this.sfx.stackSize < 128 || forced)){
			loudness = (loudness === undefined ? 1 : loudness)
			let filter
			let source = this.actx.createBufferSource()
			let volume = this.actx.createGain()
			let pan = this.actx.createStereoPanner()
			pan.pan.value = panning || 0
			volume.gain.value = this.sfx.samples[id].volume * loudness || .5 * loudness
			source.buffer = this.sfx.samples[id].data
			let detune = this.sfx.samples[id].detune ? (Math.random() * 2 - 1) * this.sfx.samples[id].detune : 0
			if (this.slowdown.state) {
				detune += (this.slowdown.multiplyer < 1 ? -100/this.slowdown.multiplyer : this.slowdown.multiplyer * 200) * this.slowdown.f
			}
			source.detune.value = detune
			source.connect(pan)
			pan.connect(volume)
			if (!this.plane || dark){
				volume.connect(this.sfx.master)
			} else {
				filter = this.actx.createBiquadFilter()
				filter.type = `lowpass`
				volume.connect(filter).connect(this.sfx.master)
			}
			this.sfx.stackSize++
			// source.onended = _=>{
			// 	source.disconnect()
			// 	volume.disconnect()
			// 	pan.disconnect()
			// 	// source = null
			// 	// volume = null
			// 	// pan = null
			// 	if (filter) {
			// 		filter.disconnect()
			// 		// filter = null
			// 	}
			// 	this.sfx.stackSize = Math.max(0, this.sfx.stackSize - 1)
			// }
			setTimeout(_=>{this.sfx.stackSize = Math.max(0, this.sfx.stackSize - 1)}, (this.sfx.samples[id].duration || source.buffer.duration) * 1000)
			source.start(this.actx.currentTime)
			source.stop(this.actx.currentTime + (this.sfx.samples[id].duration || source.buffer.duration))
		}

	}

	getRealPrice(name, sale){

		// if (price[i]) this.resources[i] += Math.floor(price[i] * (this.eraserType === 2 ? 1 : this.eraserType === 1 ? .9 : .5))

		const mult = this.codex.entities[name].priceExponent ? this.codex.entities[name].priceExponent ** Math.max(0, (this.entitiesInGame[name] || 0) - (sale ? 1 : 0)) : 1
		const sellMult = sale ? (this.eraserType === 2 ? 1 : this.eraserType === 1 ? .9 : .5) : 1
		if (mult === 1) return this.codex.entities[name].price

		const realPrice = []
		for (let i = 0; i < this.codex.entities[name].price.length; i++){
			realPrice.push(this.codex.entities[name].price[i] * mult * sellMult)
		}
		return realPrice
	}


	canAfford(name){

		let can = true
		const price = this.getRealPrice(name)
		// const source = this.codex.entities[name].priceType ? this[this.codex.entities[name].priceType] : this.resources
		const source = this.resources

		for (let i = 0; i < price.length; i++){

			if (price[i] && source[i] < price[i]){
				can = false
				break
			}

		}

		return can

	}

	clearCell(uv){
		const entity = this.entityAtCoordinates(uv)
		if (!entity) return
		if (entity.onDelete) entity.onDelete()
		const n = entity.getNeighbours()

		this.entitiesInGame[entity.name]--
		this.shop.updateElements()

		if (!entity.entitySpan) {
			delete this.stuffMap[`u${entity.position[0]}v${entity.position[1]}`]
		} else {
			const s = entity.entitySpan
			for (let dy = -s; dy <= s; dy++){
				for (let dx = -s; dx <= s; dx++){

					delete this.stuffMap[`u${entity.position[0]+dx}v${entity.position[1]+dy}`]

				}
			}
		}
		
		for (let i = 0; i < this.stuff.length; i++){
			if (this.stuff[i] === entity){
				this.stuff.splice(i,1)
				break
			}
		}

		for (let i = 0; i < n.length; i++){
			if (n[i]) n[i].init()
		}

	}

	updateMouseData(x,y){

		this.mouse.offsetxy[0] = x
		this.mouse.offsetxy[1] = y
		this.mouse.xy[0] = x * this.pixelRatio
		this.mouse.xy[1] = y * this.pixelRatio

		const distance2 = (x - this.mouse.lastOffset[0]) ** 2 + (y - this.mouse.lastOffset[1]) ** 2
		this.mouse.lastOffset[0] = x
		this.mouse.lastOffset[1] = y
		if (distance2 > 1) this.mouse.positionChanged = true

	}

	processMousemove(e, dxy){

		const x = e?.offsetX || e?.clientX
		const y = e?.offsetY || e?.clientY

		if (e){

			this.updateMouseData(x,y)

			if (e.buttons === 2) {
				this.translation[0] -= e.movementX * this.pixelRatio / this.zoom
				this.translation[1] -= e.movementY * this.pixelRatio / this.zoom
			} else if (e.buttons === 1 && this.hoveredEntity) {

				//DragFill
				const n = this.hoveredEntity.name
				const donotclick = (n === `cube` || n === `pump` || n === `pump2` || n === `waypoint` || n === `voidsculpture` || n === `strange` || n === `strange1` || n === `strange2` || n === `strange3` || n === `cookie` || n === `hollow`)
				if (!this.itemInHand && !this.plane && !donotclick){

					this.hoveredEntity?.onmousedown()	

				}


			} else if (dxy) {
				this.translation[0] -= dxy[0]
				this.translation[1] -= dxy[1]
			}
		}

		const uv = this.xyToUV([this.mouse.offsetxy[0], this.mouse.offsetxy[1]])
		const targetCell = [Math.floor(uv[0]), Math.floor(uv[1])]
		this.hoveredCell = targetCell
		this.hoveredEntity = this.entityAtCoordinates(this.hoveredCell)

		this.hoveredResource = false
		const delta = this.screenUnit * .3
		for (let i = 0; i < this.resourceHomes.length; i++){
			const home = this.resourceHomes[i]
			if (this.mouse.xy[0] > home[0] - delta && this.mouse.xy[0] < home[0] + delta && this.mouse.xy[1] > home[1] - delta && this.mouse.xy[1] < home[1] + delta){
				this.hoveredResource = i
				break
			}

		}
		
		if (this.plane === 1 && this.hoveredEntity?.ondarkhover){
			this.hoveredEntity.ondarkhover()
		}

		this.canPlace = false
		if (this.itemInHand){
			const base = this.hoveredCell && this.canAfford(this.itemInHand.name)
			const eraserOk = this.itemInHand.eraser && this.hoveredEntity && !this.hoveredEntity.indestructible && !(this.hoveredEntity instanceof Cube) && !((this.hoveredEntity instanceof Pump || this.hoveredEntity instanceof Gradient) && ((this.entitiesInGame[`pump`] || 0) + (this.entitiesInGame[`pump2`] || 0) + (this.entitiesInGame[`gradient`] || 0) < 2))
			const newOk = !this.itemInHand.eraser && !this.hoveredEntity && !this.codex.entities[this.itemInHand.name].isUpgradeTo
			const upgradeOk = this.hoveredEntity && !this.itemInHand.eraser && this.codex.entities[this.itemInHand.name]?.isUpgradeTo === this.hoveredEntity.name
			this.canPlace = this.transportedEntity ? (!this.hoveredEntity || this.canRelocate(this.hoveredEntity)) : (base && (eraserOk || newOk || upgradeOk))
		}

	}

	processMousedown(e){
		if (e?.buttons !== 2){

			this.mouse.state = 1

			//Hitbox check
			const cubeClicked = (this.hoveredEntity && this.hoveredEntity.name === `cube`)
			if (!this.itemInHand || cubeClicked){

				if (cubeClicked){
					this.stats.totalCubeClicks++
				}

				if (this.hoveredEntity){
					// this.selectedCell = winner.position
					this.selectedEntity = this.hoveredEntity
					if (!this.plane){
						this.selectedEntity.onmousedown()
					} else if (this.plane === 1 && this.selectedEntity.ondarkmousedown){
						this.selectedEntity.ondarkmousedown()
					}
					
				}

				this.processMousemove()

			}

		}

		this.mouse.positionChanged = false
	}

	processQ(){
		if (this.itemInHand){
			delete this.itemInHand
			delete this.transportedEntity
		} else if (this.hoveredEntity && !this.plane){
			this.shop.centerItem(this.hoveredEntity.name)
			if (this.canAfford(this.hoveredEntity.name) && !this.onlyones[this.hoveredEntity.name] && this.codex.entities[this.hoveredEntity.name].canPurchase){
				this.pickupItem(this.hoveredEntity.name)
				this.pressedQOnMachine = true
			}
		} else if (!this.plane){
			const eraser = this.eraserType === 1 ? `eraser2` : this.eraserType === 2 ? `eraser3` : `eraser`
			if (this.canAfford(eraser)) {
				this.pressedQOnBlank = true
				this.pickupItem(eraser)
			}
		}
	}

	processE(){

		if (this.entitiesInGame.mega3 > 0 && this.resources[4] >= 1 && this.hoveredEntity && this.canRelocate(this.hoveredEntity) && !this.plane && !this.entitiesInGame.pinhole){
			
			this.transportedEntity = this.hoveredEntity
			this.itemInHand = new this.codex.entities[this.hoveredEntity.name].class(this)
			delete this.itemInHandPriceTag

		}

	}

	canRelocate(e){
		if (!e || !e.name) return false
		return (this.codex.entities[e.name].canPurchase || e.name === `stabilizer3`) && !(e.name === `flower` || e.name === `fruit` || e.name === `strange1` || e.name === `strange2` || e.name === `strange3` || e.name === `pump` || e.name === `pump2` || e.name === `cube`)
	}

	relocate(e,p){

		const n = e.getNeighbours()
		const targetEntity = this.entityAtCoordinates(p)
		if (targetEntity && (targetEntity.span || !(this.canRelocate(targetEntity)))) return

		//Clean up without triigering ondelete
		if (!e.entitySpan) {
			delete this.stuffMap[`u${e.position[0]}v${e.position[1]}`]
		} else {
			const s = e.entitySpan
			for (let dy = -s; dy <= s; dy++){
				for (let dx = -s; dx <= s; dx++){
					delete this.stuffMap[`u${e.position[0]+dx}v${e.position[1]+dy}`]
				}
			}
		}

		//relocate
		if (!e.entitySpan) {
			this.stuffMap[`u${p[0]}v${p[1]}`] = e
		} else {
			const s = e.entitySpan
			for (let dy = -s; dy <= s; dy++){
				for (let dx = -s; dx <= s; dx++){
					this.stuffMap[`u${p[0]+dx}v${p[1]+dy}`] = e
				}
			}
		}

		//swap
		if (targetEntity) {
			this.stuffMap[`u${e.position[0]}v${e.position[1]}`] = targetEntity
			targetEntity.setPosition([...e.position])
		}
		
		e.setPosition(p)


		this.stuff.sort((a,b)=>a.position[0] + a.position[1] - b.position[0] - b.position[1])

		//update new neighbours
		for (let i = 0; i < e.soi.length; i++){
			const cell = this.stuffMap[`u${e.position[0] + e.soi[i][0]}v${e.position[1] + e.soi[i][1]}`]
			if (cell){
				cell.init()
			}
		}

		//update previous neighbours
		for (let i = 0; i < n.length; i++){
			if (n[i]) n[i].init()
		}

	}

	processClick(){

		// console.log(this.hoveredCell)
		// this.spawnSurge() ///REMqqqqqqqqqqqq
		// this.addEntity(`surge`, this.hoveredCell)

		const ok = this.itemInHand && this.hoveredCell && this.canAfford(this.itemInHand.name) && !(this.itemInHand.eraser && (this.hoveredEntity instanceof Pump || this.hoveredEntity instanceof Gradient) && ((this.entitiesInGame[`pump`] || 0) + (this.entitiesInGame[`pump2`] || 0) + (this.entitiesInGame[`gradient`] || 0) < 2))
		
		if (this.transportedEntity && this.hoveredCell && this.resources[4] >= 1){

			//Relocation
			this.requestResources([0,0,0,0,1], this.hoveredCell, false, true)
			this.relocate(this.transportedEntity, this.hoveredCell)
			delete this.transportedEntity
			delete this.itemInHand

		} else if (ok){
			// const entityHere = this.entityAtCoordinates(this.hoveredCell)

			//Just your regular item placement
			if (!this.hoveredEntity && !this.itemInHand.eraser && !this.codex.entities[this.itemInHand.name].isUpgradeTo){

				const price = this.getRealPrice(this.itemInHand.name)

				this.requestResources(price, this.hoveredCell, false, true)

				this.addEntity(this.itemInHand.name, this.hoveredCell)
				this.stats.machinesBuild++
				this.processMousemove()

				if (this.codex.entities[this.itemInHand.name].onlyone){
					this.onlyones[this.itemInHand.name] = true
					this.shop.check()
					delete this.itemInHand
				} else if (!this.canAfford(this.itemInHand?.name)){
					delete this.itemInHand
				} else {
					this.pickupItem(this.itemInHand.name)
				}
				
				// console.log(this.itemInHand)
				// if (this.itemInHand && !this.canAfford(this.itemInHand.name)) { //zzz random error in console "Cannot read properties of undefined (reading 'name')" fixed?
				// 	delete this.itemInHand
				// } else {
				// 	this.pickupItem(this.itemInHand.name) // to update the price
				// }
				// delete this.hoveredCell

			//Erasing
			} else if (this.hoveredEntity && this.itemInHand.eraser && !(this.hoveredEntity instanceof Cube) && !this.hoveredEntity.indestructible){

				//REFUND
				const price = this.getRealPrice(this.hoveredEntity.name, true)
				const xy = this.uvToXYUntranslated(this.hoveredCell)

				if (this.codex.entities[this.hoveredEntity.name].onlyone){

					let chainElement = this.codex.entities[this.hoveredEntity.name]
					while (chainElement.isUpgradeTo){
						delete this.onlyones[chainElement.isUpgradeTo]
						chainElement = this.codex.entities[chainElement.isUpgradeTo]
					}

					if (this.codex.entities[this.hoveredEntity.name].isUpgradeTo){
						delete this.onlyones[this.codex.entities[this.hoveredEntity.name].isUpgradeTo]
					}

					delete this.onlyones[this.hoveredEntity.name]
					this.shop.check()
				}

				this.createResourceTransfer(price, xy, undefined, undefined, undefined, true)

				this.requestResources(this.getRealPrice(this.itemInHand.name), this.hoveredCell, false, true) //just the cost of erasing
				this.clearCell(this.hoveredCell)
				this.stats.machinesSold++
				this.stats.timeSinceLastDelete = 0
				this.hoveredEntity = undefined

			//Upgrading
			} else if (this.hoveredEntity && !this.itemInHand.eraser && this.codex.entities[this.itemInHand.name]?.isUpgradeTo === this.hoveredEntity.name){

				if (this.itemInHand.name === `pinhole`){
					this.saveGame()
					this.preventSaving = true
				}
				
				this.clearCell(this.hoveredCell)
				this.stats.timeSinceLastDelete = 0

				const price = this.getRealPrice(this.itemInHand.name)
				const refund = this.getRealPrice(this.hoveredEntity.name)
				
				this.createResourceTransfer(refund, this.uvToXYUntranslated(this.hoveredCell), undefined, undefined, undefined, true)
				this.requestResources(price, this.hoveredCell, _=>{}, true)
				this.addEntity(this.itemInHand.name, this.hoveredEntity.position)
				this.stats.machinesBuild++
				if (this.codex.entities[this.itemInHand.name].onlyone) {
					this.onlyones[this.itemInHand.name] = true
					delete this.itemInHand
				} else if (!this.canAfford(this.itemInHand?.name)){
					delete this.itemInHand
				} else {
					this.pickupItem(this.itemInHand.name) // to update the price
				}
				this.shop.check()
				// delete this.hoveredCell

			//Cancel build mode if click on machine
			} else if (this.itemInHand && this.hoveredEntity?.name !== `cube`) {
				delete this.itemInHand
			}
		}
		

		// if (this.plane === 1){

		// 	if (this.hoveredEntity && this.hoveredEntity instanceof Pump){
		// 		this.createDarkLink(this.hoveredEntity)
		// 	}

		// }

	}

	processMouseup(){
		this.mouse.state = 0
		this.mouse.timer = this.mouse.maxTimer
		if (this.selectedEntity && !this.plane) this.selectedEntity.onmouseup()
		this.selectedEntity = false
	}

	processMouseout(){
		this.mouse.cursorVisible = false
		if (this.selectedEntity && !this.plane) this.selectedEntity.onmouseup()
		this.selectedEntity = false
		this.removeHint()
	}

	zoomInOut(delta){

		this.zoom = Math.min(this.zoomRange[1], Math.max(this.zoomRange[0], this.zoom + delta * this.time.realDt * .0002))

	}

	doOnBlur(){
		if (!this.isMute) this.fadeSound(0)
		this.altActive = false
		this.translationMap[0] = 0
		this.translationMap[1] = 0
		this.translationMap[2] = 0
		this.translationMap[3] = 0
		this.processMouseout()
	}
	doOnFocus(){
		if (!this.isMute) this.fadeSound(1)
		this.mouse.cursorVisible = true
	}
	toggleSplash(){
		if (this.splash.isShown){
			if (!this.actx && !this.splash?.gameIsMute) this.initAudio()
			this.splash.close()
		} else {
			this.splash.show()
		}
	}

	setListeners(){

		if (!this.spaceport.isPlaceholder){
			this.spaceport.on(`windowState`, (e,d)=>{
					console.log(d)
                    if (d === `blur`) this.doOnBlur()
                    if (d === `focus`) this.doOnFocus()
            })
		}

		addEventListener(`resize`, _=>{

			cancelAnimationFrame(this.resizeAnimationFrame)
			this.resizeAnimationFrame = requestAnimationFrame(_=>{this.initScreenSize()})
			// console.log(`init canvas`)
		})

		addEventListener(`gamepadconnected`, _=>{
			// console.log(_.gamepad)
			this.shop.gamePadHint.classList.add(`gamePadPresent`)
		})
		addEventListener(`gamepaddisconnected`, _=>{
			this.shop.gamePadHint.classList.remove(`gamePadPresent`)
			this.splash.show()
			this.splash.selected = false
		})

		addEventListener(`blur`, e=>{
			this.doOnBlur()
		})
		addEventListener(`focus`, e=>{
			this.doOnFocus()
		})

		addEventListener(`keydown`, e=>{

			this.gamepadControl = false
			this.thereWasZoomAction = true

			if (e.keyCode === 27){
				if (this.itemInHand) {
					delete this.itemInHand
					delete this.transportedEntity
				} else {
					this.toggleSplash()
				}
				
			} else if (e.keyCode === 81){
				this.processQ()
				
			} else if (e.keyCode === 18){
				e.preventDefault()
				this.altActive = true
				document.body.classList.add(`altHolded`)
			} else if (e.keyCode === 69){
				this.processE()
			} else if (e.keyCode === 87 || e.keyCode === 38){
				this.translationMap[0] = 1
			} else if (e.keyCode === 68 || e.keyCode === 39){
				this.translationMap[1] = 1
			} else if (e.keyCode === 83 || e.keyCode === 40){
				this.translationMap[2] = 1
			} else if (e.keyCode === 65 || e.keyCode === 37){
				this.translationMap[3] = 1
			} else if (e.keyCode === 16 || e.keyCode === 17){
				if (!this.zoomWhenShiftPressed) {
					this.zoomWhenShiftPressed = this.zoom
					delete this.thereWasZoomAction
				}
				this.shiftPressed = true
				
			}

		})
		addEventListener(`keyup`, e=>{
			if (e.keyCode === 87 || e.keyCode === 38){
				this.translationMap[0] = 0
				if (this.keyboardMovementHappening === 87) delete this.keyboardMovementHappening
			} else if (e.keyCode === 68 || e.keyCode === 39){
				this.translationMap[1] = 0
				if (this.keyboardMovementHappening === 87) delete this.keyboardMovementHappening
			} else if (e.keyCode === 83 || e.keyCode === 40){
				this.translationMap[2] = 0
				if (this.keyboardMovementHappening === 87) delete this.keyboardMovementHappening
			} else if (e.keyCode === 65 || e.keyCode === 37){
				this.translationMap[3] = 0
				if (this.keyboardMovementHappening === 87) delete this.keyboardMovementHappening
			} else if (e.keyCode === 18){
				this.altActive = false
				document.body.classList.remove(`altHolded`)
			} else if (e.keyCode === 16 || e.keyCode === 17){
				this.shiftPressed = false
				if (!this.thereWasZoomAction){
					this.zoom = 1
				}
				delete this.zoomWhenShiftPressed
			}
		})

		this.canvas.addEventListener(`click`, e=>{
			
			this.processClick()
			
		})

		this.canvas.addEventListener(`mousemove`, e=>{
			this.processMousemove(e)
		})

		this.canvas.addEventListener(`touchstart`, e=>{
			if (e.target === this.canvas) e.preventDefault()
			this.mouse.lastTouch[0] = e.touches[0].clientX
			this.mouse.lastTouch[1] = e.touches[0].clientY
			this.processMousemove(e.touches[0])
			this.mouse.positionChanged = false
			// this.processMousedown(e)
		})

		this.canvas.addEventListener(`touchend`, e=>{
			if (e.target === this.canvas) e.preventDefault()
			// this.mouse.lastTouch[0] = e.touches[0].clientX
			// this.mouse.lastTouch[1] = e.touches[0].clientY
			if (!this.mouse.positionChanged){
				this.processMousedown(e)
			}

			this.processMousemove(e.touches[0])
		})

		this.canvas.addEventListener(`touchmove`, e=>{
			if (e.target === this.canvas) e.preventDefault()
			if (e.touches.length === 2){
				const delta = [
					(e.touches[0].clientX - this.mouse.lastTouch[0]) * this.pixelRatio,
					(e.touches[0].clientY - this.mouse.lastTouch[1]) * this.pixelRatio,
				]
				this.processMousemove(e.touches[0], delta)
			} else {
				this.processMousemove(e.touches[0])
			}
			this.mouse.lastTouch[0] = e.touches[0].clientX
			this.mouse.lastTouch[1] = e.touches[0].clientY

			console.log(this.mouse.lastTouch[0])
			
		})

		this.canvas.addEventListener(`mousedown`, e=>{

			this.processMousedown(e)

		})

		this.canvas.addEventListener(`mouseup`, e=>{

			if (!this.mouse.positionChanged && e.button === 2 && this.itemInHand){
				delete this.itemInHand
				delete this.transportedEntity
			}

			this.processMouseup()

		})

		this.canvas.addEventListener(`mouseenter`, e=>{
			this.mouse.cursorVisible = true
		})
		this.canvas.addEventListener(`mouseout`, e=>{
			this.processMouseout()
		})

		this.canvas.addEventListener('wheel', e=>{
			e.preventDefault()

			if (this.shiftPressed){

				if (!this.thereWasZoomAction) this.thereWasZoomAction = true

				const delta = [
					e.wheelDeltaX * (this.isWindows ? .2 : .5),
					e.wheelDeltaY * (this.isWindows ? .2 : .5)
				]

				this.zoomInOut(Math.abs(delta[1]) > Math.abs(delta[0]) ? delta[1] : delta[0])

			} else {

				const delta = [
					e.wheelDeltaX * (this.isWindows ? .2 : .5) / this.zoom,
					e.wheelDeltaY * (this.isWindows ? .2 : .5) / this.zoom
				]

				this.processMousemove(e, delta)

			}
			
		})

	}

	getHitCoordinates(xy){
		return [(xy[0] * this.pixelRatio - this.w2 + this.translation[0]) / this.unit, (xy[1] * this.pixelRatio - this.h2 + this.translation[1]) / this.unit]
	}

	checkHitBox(uv, hb){

		if (uv[0] > hb[0] && uv[0] < hb[2] && uv[1] > hb[1] && uv[1] < hb[3]) return true
		return false
	}

	updateAnalytics(dt){

		const a = this.analytics

		a.frameTimer -= dt
		if (a.frameTimer < 0){

			a.frameTimer = a.measuringFrame + a.frameTimer
			a.frames.push(a.frame)
			a.instant = a.frame
			for (let i = 0; i < a.instant.length; i++){
				const norm = a.measuringFrame / 1000
				a.instant[i][0] /= norm
				a.instant[i][1] /= norm
				a.graphs[i].data.push(a.instant[i])
				if (a.graphs[i].data.length > a.dataSize) a.graphs[i].data.shift()
			}


			a.frame = [[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]]
			if (a.frames.length > a.frameCount) a.frames.shift()

			//Average
			a.average = [[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]]
			for (let i = 0; i < a.frames.length; i++){
				const norm = a.frames.length / (i + 1) * this.analytics.frames.length / 2
				for (let j = 0; j < a.frames[i].length; j++){

					a.average[j][0] += a.frames[i][j][0] / norm
					a.average[j][1] += a.frames[i][j][1] / norm

				}
			}

		}

	}

	updateLoop(){

		// setTimeout(_=>{this.updateLoop()}, 10)

		//Service updates
		const now = performance.now()
		this.time.dt = (now - this.time.lt)//ccc
		this.time.realDt = this.time.dt
		const realDt = this.time.dt
		this.time.lt = now
		this.stats.totalPlayTime += this.time.dt
		this.stats.timeSinceLastDelete += this.time.dt

		this.updateGamepad(this.time.dt)
		this.messenger.update(this.time.dt)
		this.achiever.update(this.time.dt)
		this.explainer?.update(this.time.dt)

		if (this.halt) {
			this.clock?.postMessage(true)
			return
		}

		//Ingame updates
		this.currentlyExtracting = false
		this.updateSlowdownEvent()
		this.updateUnfilled(this.time.dt)
		this.updateEntities(this.time.dt)
		this.updateResourceInteractions(this.time.dt)
		this.updateVFX(this.time.dt)
		this.updateHollowEvents(this.time.dt)
		this.updateRange()
		this.updateTranslation(realDt)
		this.updateResourcePops(this.time.dt)
		this.updateAutoClicker(this.time.dt)
		this.updateSurge(this.time.dt)
		// this.updateResourceInteractions(this.time.dt)
		this.updateAnalytics(this.time.dt)

		if (this.entitiesInGame.pinhole > 0){
			this.resources = new Array(10).fill(.01)
		}

		this.clock?.postMessage(true)

	}

	// updateMusic(t){
	// 	const m = this.music

	// 	if (m.nextIn < t){

	// 		const duration = this.sfx.samples[`testMusic`].data.duration * 1000
	// 		m.nextIn = performance.now() + duration + Math.random() * 60000

	// 		if (m.playing) this.stopSound(m.playing)
	// 		m.playing = this.startSound(`testMusic`)

	// 	}
	// }

	updateAutoClicker(dt){

		if (!this.mouse.automate || !this.mouse.state || !this.hoveredEntity || !(this.hoveredEntity instanceof Cube || this.hoveredEntity instanceof Hollow)) return
		//cube, hollow cube

		this.mouse.timer -= dt
		if (this.mouse.timer <= 0){

			this.mouse.timer = this.mouse.maxTimer// + (Math.random() * this.mouse.maxTimer * .5 - this.mouse.maxTimer * .25)
			this.processMousedown()

		}

	}

	updateGamepad(dt){

		const gamepad = navigator.getGamepads()[0]
		if (!gamepad || gamepad.id.toLowerCase().includes("wheel") || gamepad.id.toLowerCase().includes("driving")) return

		// Check mapping
		// for (let i = 0; i < gamepad.buttons.length; i++){
		// 	if (gamepad.buttons[i].pressed) console.log(i)
		// }

		//Move - achievements - dialogue
		const deadzone = .25
		const freezone = .75
		if (gamepad.axes && gamepad.axes[0] !== undefined && Math.abs(gamepad.axes[0]) > deadzone){
			this.gamepadControl = true
			this.translationMap[gamepad.axes[0] > 0 ? 1 : 3] = (Math.abs(gamepad.axes[0]) - deadzone) / freezone * 1.6
			this.mouse.positionChanged = true
		} else {
			if (this.gamepadControl) this.translationMap[1] = this.translationMap[3] = 0
		}

		if (gamepad.axes && gamepad.axes[1] !== undefined && Math.abs(gamepad.axes[1]) > deadzone){
			if (this.altActive){
				this.messenger.element.scrollBy(0, dt * gamepad.axes[1])
			} else if (this.splash.isShown){
				this.splash.glory.scrollBy(0, dt * gamepad.axes[1])
			} else {
				this.gamepadControl = true
				this.translationMap[gamepad.axes[1] > 0 ? 2 : 0] = (Math.abs(gamepad.axes[1]) - deadzone) / freezone * 1.6
				this.mouse.positionChanged = true	
			}

		} else {
			if (this.gamepadControl) this.translationMap[2] = this.translationMap[0] = 0
		}

		//Mouse
		if (gamepad.axes && gamepad.axes[2] !== undefined && gamepad.axes[3] !== undefined && Math.abs(gamepad.axes[2]) > deadzone || Math.abs(gamepad.axes[3]) > deadzone){
			const x = Math.min(this.w / this.pixelRatio, Math.max(0, this.mouse.offsetxy[0] + (Math.max(0, Math.abs(gamepad.axes[2]) - deadzone)) * Math.sign(gamepad.axes[2]) / freezone * dt * this.pixelRatio * .4))
			const y = Math.min(this.h / this.pixelRatio, Math.max(0, this.mouse.offsetxy[1] + (Math.max(0, Math.abs(gamepad.axes[3]) - deadzone)) * Math.sign(gamepad.axes[3]) / freezone * dt * this.pixelRatio * .4))
			this.updateMouseData(x,y)
			this.processMousemove()
		}
		
		//Main action
		const mainAction = v=>{
			if (this.splash.isShown){
				if (v) {
					if (this.splash.selected && this.splash.items[this.splash.selectedId].onmousedown) this.splash.items[this.splash.selectedId].onmousedown()
					if (this.splash.selected) this.splash.items[this.splash.selectedId].click()
				} else {
					if (this.splash.selected && this.splash.items[this.splash.selectedId].onmouseup) this.splash.items[this.splash.selectedId].onmouseup()
				}
			} else if (this.shop.selected){
				const id = this.shop.items[this.shop.selectedId].name
				if (this.canAfford(id)) {
					this.pickupItem(id)
					this.processMousemove()
				}
				this.shop.deselectItem()
			} else {
				if (v) {
					this.processMousedown()
				} else {
					if (!this.mouse.positionChanged) {
						this.processClick()
					}
					this.processMouseup()
				}
			}
		}

		const isValidButton = (id,prop=`value`) => gamepad.buttons[id] && gamepad.buttons[id][prop] !== undefined && gamepad.buttons[id][prop] !== this.gamepadButtons[id]

		// console.log(this.shop.selected)

		if (isValidButton(0)){
			mainAction(gamepad.buttons[0].value)
			this.gamepadButtons[0] = gamepad.buttons[0].value
		}
		if (isValidButton(7,`pressed`)){
			mainAction(gamepad.buttons[7].pressed)
			this.gamepadButtons[7] = gamepad.buttons[7].pressed
		}

		//E
		if (isValidButton(2)){
			if (gamepad.buttons[2].value) this.processE()
			this.gamepadButtons[2] = gamepad.buttons[2].value
		}


		//Cancel
		if (isValidButton(1)){
			if (gamepad.buttons[1].value) this.processQ()
			this.gamepadButtons[1] = gamepad.buttons[1].value
		}

		//Chat
		if (isValidButton(10)){
			if (gamepad.buttons[10].value) this.messenger.chatIcon.click()
			this.gamepadButtons[10] = gamepad.buttons[10].value
		}

		//Shop and menu
		if (isValidButton(12)){
			if (gamepad.buttons[12].value) {
				if (this.splash.isShown){
					if (this.splash.selected){
						this.splash.selectPreviousItem()
					} else {
						this.splash.selectItem()
					}
				} else if (this.shop.selected){
					this.shop.selectPreviousItem()
				} else {
					this.shop.selectItem()
				}
				
			}
			this.gamepadButtons[12] = gamepad.buttons[12].value
		}

		if (isValidButton(13)){
			if (gamepad.buttons[13].value) {
				if (this.splash.isShown){
					if (this.splash.selected){
						this.splash.selectNextItem()
					} else {
						this.splash.selectItem()
					}
				} else if (this.shop.selected){
					this.shop.selectNextItem()
				} else {
					this.shop.selectItem()
				}
				
			}
			this.gamepadButtons[13] = gamepad.buttons[13].value
		}

		if (isValidButton(14)){
			if (gamepad.buttons[14].value) {
				if (this.splash.isShown){
					if (this.splash.items[this.splash.selectedId] === this.splash.muteElement){
						this.updateGlobalVolume(this.globalSoundVolume - .1)
					} else {
						this.splash.deGloryButton.click()	
					}
				} else if (this.shop.selected){
					this.shop.deselectItem()
				} else {
					this.shop.selectItem()
				}
				
			}
			this.gamepadButtons[14] = gamepad.buttons[14].value
		}

		if (isValidButton(15)){
			if (gamepad.buttons[15].value) {
				if (this.splash.isShown){
					if (this.splash.items[this.splash.selectedId] === this.splash.muteElement){
						this.updateGlobalVolume(this.globalSoundVolume + .1)
					} else {
						this.splash.gloryButton.click()
					}
				} else if (this.shop.selected){
					const id = this.shop.items[this.shop.selectedId].name
					if (this.canAfford(id)) {
						this.pickupItem(id)
						this.processMousemove()
					}
					this.shop.deselectItem()
				} else {
					this.shop.selectItem()
				}
				
			}
			this.gamepadButtons[15] = gamepad.buttons[15].value
		}

		//Flashlight
		if (isValidButton(8)){
			if (gamepad.buttons[8].value) {
				this.togglePhotofobia()
				
			}
			this.gamepadButtons[8] = gamepad.buttons[8].value
		}

		//Menu
		if (isValidButton(9)){
			if (gamepad.buttons[9].value) {
				this.toggleSplash()
			}
			this.gamepadButtons[9] = gamepad.buttons[9].value
		}

		//Alt
		if (isValidButton(6,`pressed`)){
			if (gamepad.buttons[6].pressed) {
				this.altActive = true
				document.body.classList.add(`altHolded`)
			} else {
				this.altActive = false
				document.body.classList.remove(`altHolded`)
			}
			this.gamepadButtons[6] = gamepad.buttons[6].pressed
		}

	}

	measureRates(){

		const timeWindow = 11000
		const resourceBuffer = [...this.resources]
		this.rateMeasureMode = true

		setTimeout(_=>{

			const delta = this.resources.map((v,i)=>v-resourceBuffer[i])
			const resourceRates = delta.map(v=>v/timeWindow*100) //Change in resources per second
			console.log(resourceRates)
			delete this.rateMeasureMode

		},timeWindow)

		
		// this.resourceRates = delta.map(v=>v/dt)

		// console.log(this.resourceRates)//zzz

		// this.resourceBuffer = [...this.resources]

	}

	updateSlowdownEvent(){

		if (this.slowdown.state){

			this.slowdown.timer -= this.time.dt

			const f = this.slowdown.timer / this.slowdown.totalTime
			this.slowdown.f = f < .2 ? f * 5 : f < .8 ? 1 : 1 - (f - .8) * 5

			this.time.dt *= (1 * (1 - this.slowdown.f) + this.slowdown.multiplyer * this.slowdown.f)


			//zzz I don't remember why it was !this.plane. Weird.
			if (this.slowdown.timer <= 0 || this.plane){
				this.slowdown.state = false
			}

		} else if (!this.slowdown.cooldown && !this.entitiesInGame.pinhole){

			const hollows = this.entitiesInGame.hollow || 0
			const flowers = (this.entitiesInGame.flower || 0) + (this.entitiesInGame.fruit || 0)
			const threshold = Math.max(0, hollows - flowers) * this.time.dt * 1e-6

			if (Math.random() < threshold && !this.plane){

				const dice = Math.random()
				const power = (dice < .1 && hollows > 8) ? .02 : dice < .3 ? .1 : dice < .7 ? .5 : 2

				const time = (10000 + Math.random() * 10000 * hollows) * (power === .01 ? .5 : 1)

				// const fast = Math.random() < .333
				// const veryslow = hollows > 8 && fast && (Math.random() < .333)

				// const time = (20000 + Math.random() * 20000 * hollows) * (veryslow ? .5 : 1)
				this.slowdown.cooldown = 96000
				this.initiateSlowdown( time, power )
				
			}

		} else {

			this.slowdown.cooldown = Math.max(0, this.slowdown.cooldown - this.time.dt)

		}

	}

	updateResourceInteractions(dt){

		//Halflife
		if (this.resources[5]){

			const decayChance = 2e-5 * dt

			// const outcomes = [
			// 	[.5, n=>[0,0,0,0,2*n]],
			// 	[.85, n=>[0,0,0,8*n]],
			// 	[.97, n=>[0,0,16*n]],
			// 	[1, n=>[0,32*n]]
			// ]
			// const outcomesDecay = [
			// 	[.5, n=>[0,0,0,0,4*n]],
			// 	[.8, n=>[0,0,0,16*n]],
			// 	[.9, n=>[0,0,32*n]],
			// 	[1, n=>[0,64*n]]
			// ]

			const outcomes = this.generaldecay ? [[.5, n=>[0,0,0,0,4*n]],[.8, n=>[0,0,0,16*n]],[.93, n=>[0,0,32*n]],[1, n=>[0,64*n]]] : [[.5, n=>[0,0,0,0,2*n]],[.85, n=>[0,0,0,8*n]],[.97, n=>[0,0,16*n]],[1, n=>[0,32*n]]]

			const average = this.chromaToContain * decayChance
			let hits = 0

			if (average < 1 && Math.random() < average) {
				hits = 1
			} else if (average >= 1){
				hits = Math.floor(average)
			} else {
				hits = 0
			}

			// this.resources[5] = Math.max(0, this.resources[5] - hits)
			this.substractResourcesFromArray([0,0,0,0,0,hits])

			if (hits) {

				const dice = Math.random()
				let outcome
				for (let i = 0; i < 4; i++){
					if (dice < outcomes[i][0]){
						outcome = outcomes[i]
						break
					}
				}

				if (this.generaldecay){
					this.generaldecay.consume(outcome[1](hits))
				} else {
					this.playSound(`geiger`)
					this.createResourceTransfer(outcome[1](hits), this.resourceHomes[5])
				}
			}

		}

		//Crusade
		if (this.resources[6]){

			let heavenToDestroy = Math.min(Math.floor(Math.max(0, this.resources[4] - this.vaults.size * 1024) / this.hellgemChunk), this.resources[6])
			let hellToDestroy = heavenToDestroy * this.hellgemChunk
			if (!hellToDestroy && this.forcedAnnihilation){
				delete this.forcedAnnihilation
				hellToDestroy = Math.min(1, this.resources[4])
				heavenToDestroy = hellToDestroy
			}

			if (this.resources[4] > 1e9) this.resources[4] = 1e9

			if (hellToDestroy){
				
				this.substractResourcesFromArray([0,0,0,0,hellToDestroy,0,heavenToDestroy])
				this.createResourceTransfer([0,0,0,hellToDestroy * 4], this.resourceHomes[4])
				
				let annihilatorWorking = false
				for (const a of this.annihilators){
					annihilatorWorking = a.tap() || annihilatorWorking
				}
				this.playSound(`hellbreak`,0, this.voidsculpture ? .16 : 1)
				if (!annihilatorWorking){
					this.createResourceExplosion([0,0,0,0,hellToDestroy,0,heavenToDestroy])
				}

				for (const m of this.annihilationMachines){
					m.tap()
				}

			}

		}

	}

	updateResourcePops(dt){

		for (let i = 0; i < this.resourcePops.length; i++){
			this.resourcePops[i] = Math.max(0, this.resourcePops[i] * (1 - 1/dt))
		}

	}

	updateTranslation(dt){

		let updated = false

		if (this.translationMap[0]) {this.translation[1] -= dt * this.translationSpeed * this.translationMap[0] / this.zoom; updated = true}
		if (this.translationMap[1]) {this.translation[0] += dt * this.translationSpeed * this.translationMap[1] / this.zoom; updated = true}
		if (this.translationMap[2]) {this.translation[1] += dt * this.translationSpeed * this.translationMap[2] / this.zoom; updated = true}
		if (this.translationMap[3]) {this.translation[0] -= dt * this.translationSpeed * this.translationMap[3] / this.zoom; updated = true}

		if (updated){
			this.processMousemove()
			this.updateGlobalSounds()
		}

		//Distance to origin
		if (this.hoveredCell){
			this.distanceToOrigins = Math.min( (this.hoveredCell[0] ** 2 + this.hoveredCell[1] ** 2)**.5, ((this.hoveredCell[0] + 100) ** 2 + (this.hoveredCell[1] + 100) ** 2)**.5 )
		}

	}

	renderloop(){

		requestAnimationFrame(_=>{this.renderloop()})

		this.unit = this.solidUnit * this.zoom

		if (this.halt) return

			const now = performance.now()
			this.renderTime.dt = now - this.renderTime.lt
			this.renderTime.lt = now

			if (this.slowdown.state) this.renderTime.dt *= (1 * (1 - this.slowdown.f) + this.slowdown.multiplyer * this.slowdown.f)

			if (this.plane === 1){
				this.ctx.fillStyle = `#000`
				this.ctx.fillRect(0, 0, this.w, this.h)
			} else {
				this.ctx.fillStyle = `#FFF`
				this.ctx.fillRect(0, 0, this.w, this.h)
			}
			
			this.ctx.save()
			this.ctx.translate(this.w2, this.h2)
			
			//HIGHLIGHT
			this.renderConductors(this.renderTime.dt)
			this.ctx.translate(-this.w2, -this.h2)
			this.renderChasmVFX()
			this.ctx.translate(this.w2, this.h2)
			this.renderEntities(this.renderTime.dt)

			if (this.altActive && !this.plane) {
				this.ctx.fillStyle = `#FFFC`
				this.ctx.fillRect(-this.w2, -this.h2, this.w, this.h)

				if (this.hoveredEntity && !(this.hoveredEntity instanceof Cube)){
					this.renderSOI(this.hoveredEntity)
					this.hoveredEntity.render(0)
					this.renderAffected(this.hoveredEntity.name)
				}

			}


			if (this.itemInHand && this.hoveredCell){
				this.renderAvailability()
				this.renderSOI(this.hoveredCell)
			}
			if (this.hoveredCell) this.renderHoveredCell()
			if (this.itemInHand && this.hoveredCell && !this.itemInHand.eraser){
				
				this.ctx.save()
				this.ctx.globalAlpha = .5
				this.itemInHand.render(0, this.hoveredCell)
				this.ctx.restore()
				this.renderAffected(this.itemInHand.name)

			}

			//Pinhole
			if (this.pinhole){

				const radius = this.unit * .01 + this.unit * 2 * this.pinhole.f
				const da = .05
				const time = performance.now() / 1000

				const noise = (Math.sin(time * 37) * .6 + Math.sin(time * 1913.2) * .4) * this.unit * .08

				const ctx = this.ctx
				const xy = this.uvToXY(this.pinhole.position)
				ctx.save()
				ctx.translate(xy[0], xy[1] - this.unit)
				ctx.fillStyle = this.plane ? `#FFF` : `#000`

				ctx.beginPath()
				ctx.arc(0,0,Math.max(0,radius + noise),0,Math.PI * 2)

				ctx.closePath()

				// ctx.clip()
				// ctx.drawImage(this.spaceImage,-this.spaceImage.naturalWidth/2,-this.spaceImage.naturalHeight/2)

				ctx.fill()
				ctx.restore()

			}

			this.ctx.restore()

			this.renderVFX()

			if (!this.plane){

				if (this.chasm) this.renderChasm()
				this.renderResources()
				if (!this.chillMode) this.renderHollowEvents()
				this.renderSlowdown()

			} else {

				if (this.entitiesInGame.pinhole > 0){
					this.renderResources()
				} else {
					this.renderDarkResources()
				}
				
				if (!this.chillMode) this.renderDarkHollowEvents()

			}
			

			if (this.mouse.cursorVisible) this.renderCursor()


			//Hint position update
			if (this.currentHint.element){

				this.currentHint.element.style.left = this.mouse.offsetxy[0] + `px`
				this.currentHint.element.style.top = this.mouse.offsetxy[1] + `px`

			}

			if (this.photofobia && this.flashlight && !this.plane){
				this.ctx.fillStyle = this.flashlight
				this.ctx.fillRect(0,0,this.w,this.h)
			}

			//TST
			// this.ctx.fillStyle = `#000`
			// this.ctx.font = this.regularFont
			// this.ctx.textAlign = `left`
			// for (let i = 0; i < 10; i++){
			// 	this.ctx.fillText(Math.floor(this.gradient[i] * 100)/100,this.w * .05, this.h / 2 + devicePixelRatio * 18 * i)
			// }

	}

	renderSlowdown(){
		if (this.slowdown.state) {

			this.ctx.save()
			
			this.ctx.globalAlpha = this.slowdown.f
			this.ctx.globalCompositeOperation = `multiply`

			this.ctx.fillStyle = `#FFBB36`
			this.ctx.fillRect(0,0,this.w,this.h)
			
			this.ctx.restore()

			}
	}

	renderHoveredCell(){

		// const dx = .866 * this.unit
		// const dy = .5 * this.unit

		// this.ctx.save()
		// const xy = this.uvToXY(this.hoveredCell)
		// this.ctx.translate(xy[0], xy[1])

		// this.ctx.strokeStyle = `#1123`
		// this.ctx.lineWidth = this.pixelRatio
		// this.ctx.setLineDash([this.pixelRatio * 2, this.pixelRatio * 2])
		// this.ctx.beginPath()
		// this.ctx.moveTo(0, -dy)
		// this.ctx.lineTo(dx, 0)
		// this.ctx.lineTo(0, dy)
		// this.ctx.lineTo(-dx, 0)
		// this.ctx.closePath()
		// this.ctx.stroke()
		// this.ctx.restore()

		//NEW
		if (this.hoveredEntity){
			this.ctx.save()
			const xy = this.uvToXY(this.hoveredEntity?.position || this.hoveredCell)
			this.ctx.translate(xy[0], xy[1])

			const mult = this.hoveredEntity?.entitySpan === 1 ? 3 : 1.1
			const dx = .866 * this.unit * mult
			const dy = .5 * this.unit * mult
			const s = .2
			const l = .8

			this.ctx.strokeStyle = this.hoveredEntity ? `#112` : `#D0D4D8`
			this.ctx.lineWidth = this.unit * (this.hoveredEntity ? .02 : .01)

			if (!this.hoveredEntity){
				this.ctx.beginPath()
				this.ctx.moveTo(-dx * s, -dy * l)
				this.ctx.lineTo(0, -dy)
				this.ctx.lineTo(dx * s, -dy * l)
				this.ctx.stroke()
			}

			this.ctx.beginPath()
			this.ctx.moveTo(dx * l, -dy * s)
			this.ctx.lineTo(dx, 0)
			this.ctx.lineTo(dx * l, dy * s)
			this.ctx.stroke()

			this.ctx.beginPath()
			this.ctx.moveTo(-dx * s, dy * l)
			this.ctx.lineTo(0, dy)
			this.ctx.lineTo(dx * s, dy * l)
			this.ctx.stroke()

			this.ctx.beginPath()
			this.ctx.moveTo(-dx * l, -dy * s)
			this.ctx.lineTo(-dx, 0)
			this.ctx.lineTo(-dx * l, dy * s)
			this.ctx.stroke()
			
			this.ctx.restore()
		}

	}

	renderSOI(entity){

		// this.drawPrism(this.hoveredCell, 3, 0, [`#FF03`,`#FF03`,`#FF03`])

		//NEW
		this.ctx.save()
		const xy = this.uvToXY(entity.position || entity)
		this.ctx.translate(xy[0], xy[1])

		const dx = .866 * this.unit * 3
		const dy = .5 * this.unit * 3
		const s = .1
		const l = .9

		this.ctx.fillStyle = `#11112208`//`#E8A52316`
		this.ctx.beginPath()
		this.ctx.moveTo(0, -dy)
		this.ctx.lineTo(dx, 0)
		this.ctx.lineTo(0, dy)
		this.ctx.lineTo(-dx, 0)
		this.ctx.closePath()
		this.ctx.fill()

		this.ctx.strokeStyle = `#A5A5B4`//`#FF8F60`
		this.ctx.lineWidth = this.unit * .02

		this.ctx.beginPath()
		this.ctx.moveTo(-dx * s, -dy * l)
		this.ctx.lineTo(0, -dy)
		this.ctx.lineTo(dx * s, -dy * l)
		this.ctx.stroke()

		this.ctx.beginPath()
		this.ctx.moveTo(dx * l, -dy * s)
		this.ctx.lineTo(dx, 0)
		this.ctx.lineTo(dx * l, dy * s)
		this.ctx.stroke()

		this.ctx.beginPath()
		this.ctx.moveTo(-dx * s, dy * l)
		this.ctx.lineTo(0, dy)
		this.ctx.lineTo(dx * s, dy * l)
		this.ctx.stroke()

		this.ctx.beginPath()
		this.ctx.moveTo(-dx * l, -dy * s)
		this.ctx.lineTo(-dx, 0)
		this.ctx.lineTo(-dx * l, dy * s)
		this.ctx.stroke()
		
		this.ctx.restore()


	}

	renderAffected(name){
		const list = this.codex.entities[name].affected
		if (list){
			const color = `#53B976`
			const n = []
			const o = this.hoveredCell
			let hasAffected = false
			const r = this.unit * .05
			const xy0 = this.uvToXY(o)

			for (let i = 0; i < 9; i++){
				const du = -1 + i % 3
				const dv = -1 + Math.floor(i / 3)
				const m = this.stuffMap[`u${o[0] + du}v${o[1] + dv}`]
				const conductorok = (name === `conductor` || m?.name === `conductor`) ? i%2 : 1

				if (m && conductorok) n.push(m)
			}

			this.ctx.strokeStyle = color
			this.ctx.lineWidth = r * .5

			for (let i = 0; i < n.length; i++){

				if (list[n[i].name]){

					hasAffected = true
					const xy = this.uvToXY(n[i].position)

					this.ctx.beginPath()
					this.ctx.moveTo(xy0[0], xy0[1])
					// this.ctx.lineTo(xy[0], xy[1])
					this.ctx.bezierCurveTo(xy0[0], xy0[1] + this.unit * .3, xy[0], xy[1] + this.unit * .3, xy[0], xy[1])
					this.ctx.stroke()

					this.ctx.fillStyle = color
					this.ctx.beginPath()
					this.ctx.arc(xy[0], xy[1], r, 0, Math.PI * 2)
					this.ctx.closePath()
					this.ctx.fill()
					this.ctx.fillStyle = `#FFF`
					this.ctx.beginPath()
					this.ctx.arc(xy[0], xy[1], r - this.ctx.lineWidth, 0, Math.PI * 2)
					this.ctx.closePath()
					this.ctx.fill()

				}

			}

			if (hasAffected){

				this.ctx.fillStyle = color
				this.ctx.beginPath()
				this.ctx.arc(xy0[0], xy0[1], r, 0, Math.PI * 2)
				this.ctx.closePath()
				this.ctx.fill()
				this.ctx.fillStyle = `#FFF`
				this.ctx.beginPath()
				this.ctx.arc(xy0[0], xy0[1], r - this.ctx.lineWidth, 0, Math.PI * 2)
				this.ctx.closePath()
				this.ctx.fill()

			}

		}

	}

	renderCursor(){

		if (!this.plane){
			const hint = this.itemInHand?.eraser ? this.hoveredEntity?.getSellHint() : this.itemInHand ? this.itemInHandPriceTag : this.hoveredEntity?.getHint()
			const canHit = this.hoveredEntity && this.hoveredEntity.canHit()

			if (this.showUnfilled) this.renderUnfilled()

			this.ctx.save()
			this.ctx.translate(this.mouse.xy[0], this.mouse.xy[1])

			const radius = this.pixelRatio * (canHit ? 12 : 6)
			this.ctx.fillStyle = canHit ? `#000` : `#FFF`
			this.ctx.beginPath()
			this.ctx.arc(0, 0, radius, 0, Math.PI * 2)
			this.ctx.closePath()
			this.ctx.fill()
			this.ctx.fillStyle = canHit ? `#FFF` : `#000`
			this.ctx.beginPath()
			this.ctx.arc(0, 0, radius * .8, 0, Math.PI * 2)
			this.ctx.closePath()
			this.ctx.fill()

			if (hint){

				hint.update()

				if (hint.element !== this.currentHint.element){

					if (this.currentHint.element) document.body.removeChild(this.currentHint.element)
					this.currentHint.element = hint.element
					this.currentHint.entity = this.hoveredEntity
					document.body.appendChild(this.currentHint.element)

				}

				if (this.itemInHand){
					this.currentHint.element.style.opacity = this.canPlace ? 1 : .3
				}

			}
			if (!hint && this.currentHint.element){
				this.removeHint()
			}

			this.ctx.restore()

		} else if (this.plane === 1){

			const hint = this.hoveredEntity?.getDarkHint()
			const canHit = this.hoveredEntity?.canDarkHit()

			this.ctx.save()
			this.ctx.translate(this.mouse.xy[0], this.mouse.xy[1])

			const radius = this.pixelRatio * (canHit ? 12 : 6)

			this.ctx.fillStyle = `#FFF`
			this.ctx.beginPath()
			this.ctx.arc(0, 0, radius, 0, Math.PI * 2)
			this.ctx.closePath()
			this.ctx.fill()

			if (hint){

				hint.update()

				if (hint.element !== this.currentHint.element){

					if (this.currentHint.element) document.body.removeChild(this.currentHint.element)
					this.currentHint.element = hint.element
					this.currentHint.entity = this.hoveredEntity
					document.body.appendChild(this.currentHint.element)

				}

			}

			if ((this.itemInHand || !hint) && this.currentHint.element){
				this.removeHint()
			}

			this.ctx.restore()

		}

		//ARROW
		if (this.distanceToOrigins > 80 && this.hoveredCell){
			const origin = this.uvToXYUntranslated([0,0])
			const vector = [origin[0] - this.mouse.xy[0], origin[1] - this.mouse.xy[1]]
			const angle = Math.atan2(vector[1], vector[0])
			this.ctx.save()
			this.ctx.translate(this.mouse.xy[0], this.mouse.xy[1])
			this.ctx.rotate(angle)
			this.ctx.fillStyle = this.plane ? `#FFF` : `#000`
			this.ctx.beginPath()
			const u = this.unit / this.zoom
			this.ctx.moveTo(-u*.1, -u * .1)
			this.ctx.lineTo(u * .2, 0)
			this.ctx.lineTo(-u*.1, u * .1)
			this.ctx.lineTo(-u * .05, 0)
			this.ctx.closePath()
			this.ctx.fill()
			this.ctx.restore()
		}


	}

	removeHint(){
		if (this.currentHint.element) {
			document.body.removeChild(this.currentHint.element)
			this.currentHint.element = undefined
			this.currentHint.entity = undefined
		}
	}

	renderUnfilled(){
		this.ctx.save()
		const margin = this.pixelRatio * 16
		const size = this.pixelRatio * 18
		for (let i = 0; i < this.unfilledEntities.length; i++){
			const coords = this.uvToXYUntranslated(this.unfilledEntities[i].position)
			const vector = [this.mouse.xy[0] - coords[0], this.mouse.xy[1] - coords[1]]
			const length = (vector[0] ** 2 + vector[1] ** 2) ** .5

			if (length > this.unit * 6){
				this.ctx.strokeStyle = `#112`
				this.ctx.lineWidth = this.pixelRatio
				vector[0] /= length
				vector[1] /= length
				this.ctx.beginPath()
				this.ctx.moveTo(this.mouse.xy[0] - vector[0] * margin, this.mouse.xy[1] - vector[1] * margin)
				this.ctx.lineTo(this.mouse.xy[0] - vector[0] * size, this.mouse.xy[1] - vector[1] * size)
				this.ctx.stroke()

			} else {
				this.ctx.fillStyle = `#112`
				this.ctx.strokeStyle = `#778`
				this.ctx.lineWidth = this.pixelRatio / 2
				this.ctx.beginPath()
				this.ctx.moveTo(this.mouse.xy[0], this.mouse.xy[1])
				this.ctx.lineTo(coords[0], coords[1])
				this.ctx.stroke()

				this.ctx.beginPath()
				this.ctx.arc(coords[0], coords[1], this.pixelRatio * 2, 0, Math.PI * 2)
				this.ctx.closePath()
				this.ctx.fill()
			}
			
		}
		this.ctx.restore()
	}

	renderAvailability(){

		this.drawPrism(this.hoveredCell, 1, 0, this.canPlace ? [`#0F06`,`#0F06`,`#0F06`] : [`#F006`,`#F006`,`#F006`])

		// return ok //xxx

	}

	renderResources(){

		this.ctx.textAlign = `center`
		this.ctx.textBaseline = `middle`

		const glow = this.ctx.createRadialGradient(0,0,0,0,0,this.screenUnit * .4)
		glow.addColorStop(.5, `#FFFF`)
		glow.addColorStop(1, `#FFF0`)

		for (let i = 0; i < this.resources.length; i++){

			if (this.resources[i]){

				this.ctx.font = this.regularFont
				const s = this.resourcePops[i] || 0
				this.ctx.save()
				this.ctx.translate(this.resourceHomes[i][0], this.resourceHomes[i][1])
				this.ctx.scale(.8 + s, .8 + s)

				this.ctx.fillStyle = glow
				this.ctx.beginPath()
				this.ctx.arc(0,0,this.screenUnit * .4,0,Math.PI * 2)
				this.ctx.closePath()
				this.ctx.fill()
				
				this.drawResourceInScreenCoordinates(i, [0,0])
				this.ctx.restore()

				let text = this.makeReadable(this.resources[i])
				if (this.entitiesInGame.pinhole > 0){

					const t = performance.now()
					if (Math.sin(t/834) * .6 + Math.sin(t/27) * .4 > 0){
						text = Math.random().toString(36).slice(2, 5)
					} else {
						const dict = [`U/D`,`C/S`,`T/B`,`E/νE`,`μ/νμ`,`τ/ντ`,`G/γ`,`Z/W`,`H`,`Δ/νΔ`]
						text = dict[i]
					}

				}

				const pad = this.screenUnit * .04
				const x = this.resourceHomes[i][0]
				const y = this.resourceHomes[i][1] - this.screenUnit * .4
				this.ctx.fillStyle = `#FFF`
				const measure = this.ctx.measureText(text)
				
				if (this.ctx.roundRect){
					this.ctx.beginPath()
					this.ctx.roundRect(x - measure.actualBoundingBoxLeft - pad, y - measure.actualBoundingBoxAscent - pad, measure.width + pad * 2, measure.actualBoundingBoxDescent + measure.actualBoundingBoxAscent + pad * 2, this.pixelRatio * 2)
					this.ctx.closePath()
					this.ctx.fill()
				} else {
					this.ctx.fillRect(x - measure.actualBoundingBoxLeft - pad, y - measure.actualBoundingBoxAscent - pad, measure.width + pad * 2, measure.actualBoundingBoxDescent + measure.actualBoundingBoxAscent + pad * 2)
				}
				

				this.ctx.fillStyle = `#000`
				this.ctx.fillText(text, this.resourceHomes[i][0], this.resourceHomes[i][1] - this.screenUnit * .4)

				if (i === this.hoveredResource){

					//Name
					const shift = -this.screenUnit * .84
					const nameMeasure = this.ctx.measureText(this.words.resources[i])
					this.ctx.fillStyle = `#FFF`
					if (this.ctx.roundRect){
						this.ctx.beginPath()
						this.ctx.roundRect(x - nameMeasure.actualBoundingBoxLeft - pad, y - nameMeasure.actualBoundingBoxAscent - pad - shift, nameMeasure.width + pad * 2, nameMeasure.actualBoundingBoxDescent + nameMeasure.actualBoundingBoxAscent + pad * 2, this.pixelRatio * 2)
						this.ctx.closePath()
						this.ctx.fill()
					} else {
						this.ctx.fillRect(x - nameMeasure.actualBoundingBoxLeft - pad, y - nameMeasure.actualBoundingBoxAscent - pad, nameMeasure.width + pad * 2, nameMeasure.actualBoundingBoxDescent + nameMeasure.actualBoundingBoxAscent + pad * 2)
					}
					this.ctx.fillStyle = this.codex.resources[i].triplet[2]
					this.ctx.fillText(this.words.resources[i], this.resourceHomes[i][0], this.resourceHomes[i][1] - this.screenUnit * .4 - shift)

					//Gradient instant
					this.ctx.font = this.smallFont
					if (this.entitiesInGame.mega1 > 0 || this.entitiesInGame.mega1a > 0 || this.entitiesInGame.mega1b > 0){
						const shift2 = -this.screenUnit * 1.03
						const value = this.analytics.average[i][0]
						const average = `+ ${this.makeReadable(value)} / s`
						const averageMeasure = this.ctx.measureText(average)
						this.ctx.fillStyle = `#FFF`
						if (this.ctx.roundRect){
							this.ctx.beginPath()
							this.ctx.roundRect(x - averageMeasure.actualBoundingBoxLeft - pad, y - averageMeasure.actualBoundingBoxAscent - pad - shift2, averageMeasure.width + pad * 2, averageMeasure.actualBoundingBoxDescent + averageMeasure.actualBoundingBoxAscent + pad * 2, this.pixelRatio * 2)
							this.ctx.closePath()
							this.ctx.fill()
						} else {
							this.ctx.fillRect(x - averageMeasure.actualBoundingBoxLeft - pad, y - averageMeasure.actualBoundingBoxAscent - pad, averageMeasure.width + pad * 2, averageMeasure.actualBoundingBoxDescent + averageMeasure.actualBoundingBoxAscent + pad * 2)
						}
						this.ctx.fillStyle = `#6ea56e`
						this.ctx.fillText(average, this.resourceHomes[i][0], this.resourceHomes[i][1] - this.screenUnit * .4 - shift2)

						const shift3 = -this.screenUnit * 1.2
						const value2 = this.analytics.average[i][1]
						const average2 = `– ${this.makeReadable(-value2)} / s`
						const averageMeasure2 = this.ctx.measureText(average2)
						this.ctx.fillStyle = `#FFF`
						if (this.ctx.roundRect){
							this.ctx.beginPath()
							this.ctx.roundRect(x - averageMeasure2.actualBoundingBoxLeft - pad, y - averageMeasure2.actualBoundingBoxAscent - pad - shift3, averageMeasure2.width + pad * 2, averageMeasure2.actualBoundingBoxDescent + averageMeasure2.actualBoundingBoxAscent + pad * 2, this.pixelRatio * 2)
							this.ctx.closePath()
							this.ctx.fill()
						} else {
							this.ctx.fillRect(x - averageMeasure2.actualBoundingBoxLeft - pad, y - averageMeasure2.actualBoundingBoxAscent - pad, averageMeasure2.width + pad * 2, averageMeasure2.actualBoundingBoxDescent + averageMeasure2.actualBoundingBoxAscent + pad * 2)
						}
						this.ctx.fillStyle = `#C38C75`
						this.ctx.fillText(average2, this.resourceHomes[i][0], this.resourceHomes[i][1] - this.screenUnit * .4 - shift3)
					}

					if (this.entitiesInGame.mega1b > 0){
						//Graphs
						const padding = this.pixelRatio * 16
						const dx = this.pixelRatio * 4
						const g = this.analytics.graphs[i]
						// g.canvas.width = dx * this.analytics.dataSize + padding * 8//qqqqq
						const width = g.canvas.width
						//const dx = Math.floor((width - padding * 7) / this.analytics.dataSize)
						const shortWidth = dx * this.analytics.dataSize
						const height = g.canvas.height / 2
						const ctx = g.ctx
						ctx.clearRect(0,0,width,height*2)
						ctx.fillStyle = `#FFFFFFF6`
						ctx.beginPath()
						ctx.roundRect(0,0,width,height*2, this.pixelRatio * 4)
						ctx.closePath()
						ctx.fill()
						// ctx.fillRect(0,0,width,height*2)
						// ctx.fillStyle = this.codex.resources[i].triplet[0]

						let max = 0
						let negative = false

						for (let j = 0; j < g.data.length; j++){

							if (g.data[j][0] > max){
								max = g.data[j][0]
								negative = false
							}

							if (-g.data[j][1] > max){
								max = -g.data[j][1]
								negative = true
							}
						}

						const order = +Math.floor(max).toString().length
						const delta = 10 ** (order - 1)
						max = delta * (Math.floor(max / delta) + 1) //10 ** order

						for (let j = 0; j < g.data.length; j++){
							const hhPlus = Math.floor(g.data[j][0] / max * height)
							const hhMinus = Math.floor(-g.data[j][1] / max * height)
							ctx.globalAlpha = .4
							ctx.fillStyle = `#C38C75`
							ctx.fillRect(j*dx, height, dx, hhMinus)
							ctx.fillStyle = `#6ea56e`
							ctx.fillRect(j*dx, height - hhPlus, dx, hhPlus)
							ctx.globalAlpha = 1
							ctx.fillStyle = `#C38C75`
							ctx.fillRect(j*dx, height + hhMinus, dx, this.pixelRatio)
							ctx.fillStyle = `#6ea56e`
							ctx.fillRect(j*dx, height - hhPlus, dx - this.pixelRatio, this.pixelRatio)
						}

						const lastPlus = Math.floor(this.analytics.frame[i][0] / (this.analytics.measuringFrame - this.analytics.frameTimer) * 1000 / max * height)
						const lastMinus = Math.floor(-this.analytics.frame[i][1] / (this.analytics.measuringFrame - this.analytics.frameTimer) * 1000 / max * height)
						ctx.globalAlpha = .4
						ctx.fillStyle = `#C38C75`
						ctx.fillRect(g.data.length*dx, height, dx, lastMinus)
						ctx.fillStyle = `#6ea56e`
						ctx.fillRect(g.data.length*dx, height - lastPlus, dx, lastPlus)
						ctx.globalAlpha = 1
						ctx.fillStyle = `#C38C75`
						ctx.fillRect(g.data.length*dx, height + lastMinus, dx, this.pixelRatio)
						ctx.fillStyle = `#6ea56e`
						ctx.fillRect(g.data.length*dx, height - lastPlus, dx - this.pixelRatio, this.pixelRatio)

						ctx.fillStyle = `#000`
						ctx.font = height * .12 + `px Montserrat, sans-serif`//this.microFont
						ctx.textBaseline = `middle`
						ctx.textAlign = `left`

						const maxDigit = +max.toString()[0]
						const secondHalf = maxDigit < 2 || maxDigit > 5

						for (let v = delta-max; v < max; v+=delta){

							const digit = +Math.abs(v).toString()[0]
							if (secondHalf && (digit % 2)) continue

							const lh = height - (v / max) * height

							ctx.globalAlpha = .1
							ctx.fillRect(0, lh, shortWidth + dx, 1)

							ctx.globalAlpha = 1
							ctx.fillText(this.makeReadable(v) + ` / s`, shortWidth + padding, lh)

						}


						this.ctx.imageSmoothingEnabled = false
						this.ctx.drawImage(g.canvas, Math.max(this.resourceHomes[0][0] / 2, this.resourceHomes[i][0] - width/2), this.resourceHomes[0][1] * 2)
						this.ctx.imageSmoothingEnabled = true
					}

				}
				

			}

		}

	}

	renderResourceBeds(){

		this.ctx.fillStyle = `#FFF`
		const r = this.unit * .5

		for (let i = 0; i < this.resources.length; i++){

			if (this.resources[i]){

				this.ctx.beginPath()
				this.ctx.arc(this.resourceHomes[i][0], this.resourceHomes[i][1], r, 0, Math.PI * 2)
				this.ctx.closePath()
				this.ctx.fill()

				// this.ctx.save()
				// this.ctx.translate(this.resourceHomes[i][0], this.resourceHomes[i][1])
				// this.ctx.scale(.8 + s, .8 + s)
				// this.drawResourceInScreenCoordinates(i, [0,0])
				// this.ctx.restore()
				// this.ctx.fillStyle = `#000`

				

			}

		}

	}

	renderDarkResources(){

		this.ctx.font = this.regularFont
		this.ctx.textAlign = `center`
		this.ctx.textBaseline = `middle`
		

		if (this.resources[9]){

			const s = this.resourcePops[9] || 0
			this.ctx.save()
			this.ctx.translate(this.resourceHomes[0][0], this.resourceHomes[0][1])
			this.ctx.scale(.8 + s, .8 + s)
			this.drawResourceInScreenCoordinates(9, [0,0])
			this.ctx.restore()
			this.ctx.fillStyle = `#FFF`
			this.ctx.fillText(this.makeReadable(this.resources[9]), this.resourceHomes[0][0], this.resourceHomes[0][1] - this.screenUnit * .4)
			
		}

		

	}

	makeReadable(n){
		const sign = Math.sign(n)
		const abs = Math.abs(n)
		if (abs<1e4) return sign * Math.floor(abs)
		if (abs<1e6) return sign * Math.floor(abs/10)/100 + ` K`
		if (abs<1e9) return sign * Math.floor(abs/10000)/100 + ` M`
		if (abs<1e12) return sign * Math.floor(abs/10000000)/100 + ` B`
		if (abs<1e15) return sign * Math.floor(abs/10000000000)/100 + ` T`
		return `A lot`
	}

	addResourcesFromArray(a,skipAnalytics){

		const f = this.analytics.frame || []

		for (let i = 0; i < a.length; i++){
			if (a[i]) {
				this.resources[i] += a[i]
				if (!skipAnalytics) f[i][0] += a[i]
				this.resourcePops[i] = .5
				this.stats.totalResourcesMined[i] += a[i]
				this.stats.absoluteResourcesCount += a[i]
			}
		}

	}

	substractResourcesFromArray(a,skipAnalytics){

		const f = this.analytics.frame || []

		for (let i = 0; i < a.length; i++){
			if (a[i]) {
				this.resources[i] = Math.max(0, this.resources[i] -= a[i])
				if (!skipAnalytics) f[i][1] -= a[i]
			}
		}

	}

	isVisible(p){

		const coords = this.uvToXYUntranslated(p.position)
		const span = p.entitySpan * this.unit || 0
		if (coords[0] + span < -this.unit || coords[0] - span > this.w + this.unit || coords[1] + span < -this.unit || coords[1] - span > this.h + this.unit + (p.entityHeight || 1) * this.unit) return false
		return true

	}

	renderConductors(dt){
		if (!this.plane){

			const c = Array.from(this.conductors)
			for (let i = 0; i < c.length; i++){
				if (this.isVisible(c[i])) c[i].render(dt)
			}

		}
	}

	renderEntities(dt){

		if (!this.plane){

			for (let i = 0; i < this.stuff.length; i++){

				if (this.stuff[i].name !== `conductor` && this.isVisible(this.stuff[i])) this.stuff[i].render(dt)
				
			}

		} else if (this.plane === 1){

			for (let i = 0; i < this.stuff.length; i++){

				if (this.isVisible(this.stuff[i])) this.stuff[i].darkrender(dt)

			}

		}

	}

	updateUnfilled(){

		this.unfilledEntities = []
		for (let i = 0; i < this.stuff.length; i++){
			if (!(this.stuff[i] instanceof Cube) && this.stuff[i]?.fill === 0 && this.stuff[i].state !== 1 && !this.stuff[i].isNextToSilo) this.unfilledEntities.push(this.stuff[i])
		}

	}

	updateEntities(dt){

		this.chromaToContain = this.resources[5]
		// this.unfilledEntities = []

		for (let i = 0; i < this.stuff.length; i++){

			if (this.stuff[i].killme){

				this.stuff[i].onDelete()
				this.entitiesInGame[this.stuff[i].name]--
				delete this.stuffMap[`u${this.stuff[i].position[0]}v${this.stuff[i].position[1]}`]
				this.stuff.splice(i,1)
				i--

			} else {

				//Halflife stuff
				if (this.stuff[i] instanceof Vessel){
					if (this.chromaToContain && this.stuff[i].state === 2){
						this.stuff[i].tap(dt)
						this.stuff[i].isUsed = true
						this.chromaToContain = Math.max(0, this.chromaToContain - this.stuff[i].capacity)
					} else {
						this.stuff[i].isUsed = false
					}
				}

				this.stuff[i].update(dt)
				this.stuff[i]?.updateSoul(dt)
				// if (this.stuff[i]?.fill === 0 && !(this.stuff[i] instanceof Cube)) this.unfilledEntities.push(this.stuff[i])
				// if (!(this.stuff[i] instanceof Cube) && this.stuff[i]?.fill === 0 && !this.stuff[i].isNextToSilo) this.unfilledEntities.push(this.stuff[i])
			}

		}

	}

	updateRange(){

		this.range = {x: [-5, 5], y: [-5, 5]}

	}

	renderGrid(){

		this.ctx.save()
		this.ctx.strokeStyle = `#1129`
		this.ctx.setLineDash([8,8])
		for (let y = this.range.y[0]; y <= this.range.y[1]; y++){
			this.ctx.beginPath()
			const xy0 = this.uvToXY([this.range.x[0]+.5,y+.5])
			this.ctx.moveTo(xy0[0], xy0[1])
			const xy1 = this.uvToXY([this.range.x[1]+.5,y+.5])
			this.ctx.lineTo(xy1[0], xy1[1])
			this.ctx.stroke()
		}
		for (let x = this.range.x[0]; x <= this.range.x[1]; x++){
			this.ctx.beginPath()
			const xy0 = this.uvToXY([x+.5,this.range.y[0]+.5])
			this.ctx.moveTo(xy0[0], xy0[1])
			const xy1 = this.uvToXY([x+.5,this.range.y[1]+.5])
			this.ctx.lineTo(xy1[0], xy1[1])
			this.ctx.stroke()
		}
		this.ctx.restore()

		//DEBUG
		// if (this.selectedCell){
		// 	this.drawCube([this.selectedCell[0] + .5, this.selectedCell[1] + .5], .1)
		// }
		

	}

	drawResourceInScreenCoordinates(id, p){

		this.resourcesSprites[id].scale = .25/this.zoom
		this.resourcesSprites[id].renderXY(p)
		this.resourcesSprites[id].scale = .25

	}

	drawCube(position, size, triplet){

		this.drawPrism([position[0]+size/2, position[1]+size/2], size, size, triplet)

	}

	drawPrism(position, size, height, triplet){

		const colors = triplet ? triplet : [`#FFC759`, `#FFE86F`, `#FF8F60`]
		height = height || 0

		const hy = height * this.unit
		const dx = size * .866 * this.unit
		const dy = size * .5 * this.unit

		this.ctx.save()
		const xy = this.uvToXY(position)
		this.ctx.translate(xy[0], xy[1])

		if (height){
			this.ctx.fillStyle = colors[0]
			this.ctx.beginPath()
			this.ctx.moveTo(0, -hy - dy)
			this.ctx.lineTo(dx, -hy)
			this.ctx.lineTo(dx, 0)
			this.ctx.lineTo(0, dy)
			this.ctx.lineTo(-dx, 0)
			this.ctx.lineTo(-dx, -hy)
			this.ctx.closePath()
			this.ctx.fill()

			this.ctx.fillStyle = colors[2]
			this.ctx.beginPath()
			this.ctx.moveTo(dx, -hy)
			this.ctx.lineTo(dx, 0)
			this.ctx.lineTo(0, dy)
			this.ctx.lineTo(0, dy - hy)
			this.ctx.closePath()
			this.ctx.fill()
		}

		this.ctx.fillStyle = colors[1]
		this.ctx.beginPath()
		this.ctx.moveTo(0, -hy - dy)
		this.ctx.lineTo(dx, -hy)
		this.ctx.lineTo(0, dy - hy)
		this.ctx.lineTo(-dx, -hy)
		this.ctx.closePath()
		this.ctx.fill()

		this.ctx.restore()

	}

	uvToXY(uv){

		return [ (uv[0] * 0.866 - uv[1] * .866) * this.unit - this.translation[0] * this.zoom, (uv[0] * .5 + uv[1] * .5) * this.unit - this.translation[1] * this.zoom]

	}
	// getUntranslatedScreenXY(uv){

	// 	return [ (uv[0] * 0.866 - uv[1] * .866) * this.unit, (uv[0] * .5 + uv[1] * .5) * this.unit]

	// }
	uvToXYUntranslated(uv){

		const xy = this.uvToXY(uv)
		return [xy[0] + this.w2, xy[1] + this.h2]

	}

	xyToUV(xy){

		const centered = [xy[0]*this.pixelRatio - this.w2 + this.translation[0] * this.zoom, xy[1]*this.pixelRatio - this.h2 + this.translation[1] * this.zoom]
		const fx = centered[0] / .866 * .5
		const normalized = [(centered[1] + fx) / this.unit + .5, (centered[1] - fx) / this.unit + .5]
		return normalized

	}

	entityAtCoordinates(p){
		return this.stuffMap[`u${p[0]}v${p[1]}`]

	}

	addEntity(name, position, misc, options = {}){

		//Make check for bigger entities zzz
		if (this.codex.entities[name] && !this.entityAtCoordinates(position)){

			let entity
			try {
				entity = new this.codex.entities[name].class(this, misc)
			} catch {
				entity = false
			}

			if (entity){

				this.stuff.push(entity)
				if (!entity.entitySpan) {
					this.stuffMap[`u${position[0]}v${position[1]}`] = entity
				} else {

					const s = entity.entitySpan
					for (let dy = -s; dy <= s; dy++){
						for (let dx = -s; dx <= s; dx++){

							this.stuffMap[`u${position[0]+dx}v${position[1]+dy}`] = entity

						}
					}

				}
				
				entity.setPosition(position)
				this.stuff.sort((a,b)=>a.position[0] + a.position[1] - b.position[0] - b.position[1])

				//AUTOINIT everything around
				if (!(entity instanceof Cube)){
					for (let i = 0; i < entity.soi.length; i++){
						const cell = this.stuffMap[`u${entity.position[0] + entity.soi[i][0]}v${entity.position[1] + entity.soi[i][1]}`]
						if (cell){
							cell.init()
						}
					}
				}

				if (!this.entitiesInGame[entity.name]) {
					this.entitiesInGame[entity.name] = 1
				} else {
					this.entitiesInGame[entity.name]++
				}

				if (!options.skipShopUpdate && name !== `cube`) this.shop.updateElements()

			}

			return entity
		} else {
			// console.log(`This place is occupied`)
		}
		return false

	}

	renderVFX(){
		for (let i = 0; i < this.vfx.length; i++){
			if (this.chillMode && i > 32) return
			this.vfx[i].render()
		}
	}

	renderChasmVFX(){
		for (let i = 0; i < this.chasmVfx.length; i++){
			if (this.chillMode && i > 32) return
			this.chasmVfx[i].render()
		}
	}

	renderChasm(){

		const chasmDeltas = [
			[-this.unit * .3, 	-this.unit * 1.38],
			[-this.unit * .19, 	-this.unit * 1.45],
			[-this.unit * .085, -this.unit * 1.51],
			[this.unit * .025, 	-this.unit * 1.57],
			[this.unit * .13, 	-this.unit * 1.64],

			[-this.unit * .13, 	-this.unit * 1.29],
			[-this.unit * .02, 	-this.unit * 1.35],
			[this.unit * .085, 	-this.unit * 1.41],
			[this.unit * .195, 	-this.unit * 1.47],
			[this.unit * .3, 	-this.unit * 1.54],
		]

		if (this.isVisible(this.chasm)){

			const cp = this.uvToXYUntranslated(this.chasm.position)

			for (let i = 0; i < this.resources.length; i++){

				if (!this.resources[i]) continue

				const delta = chasmDeltas[i] || [0,0]
				const tilt = i < 5 ? -this.unit * .4 : this.unit
				const rp = this.resourceHomes[i]
				const cy = rp[1] + (cp[1] + delta[1] - rp[1]) * .7

				this.ctx.strokeStyle = this.codex.resources[i].triplet[0]
				this.ctx.lineWidth = this.unit * (.02 + .1 * this.resourcePops[i])

				this.ctx.beginPath()
				this.ctx.moveTo(rp[0], rp[1])
				this.ctx.bezierCurveTo(rp[0], cy, cp[0] + delta[0] + tilt, cy, cp[0] + delta[0], cp[1] + delta[1])
				this.ctx.stroke()

			}

		}

	}

	updateVFX(dt){

		for (let i = 0; i < this.vfx.length; i++){

			this.vfx[i].update(dt)
			if (this.vfx[i].terminate){
				this.vfx.splice(i,1)
				i--
			}
			
		}

		for (let i = 0; i < this.chasmVfx.length; i++){

			this.chasmVfx[i].update(dt)
			if (this.chasmVfx[i].terminate){
				this.chasmVfx.splice(i,1)
				i--
			}
			
		}

	}

	// Resources, origin position, destination position, onfinish or will be added to resources, visibility
	createResourceTransfer(r,p,d,f,v,skip){
		const transfer = new ResourceTransfer(this, {resources: r, source: p, destination: d, f: f, visibility: v, skip: skip})
		this.vfx.push(transfer)
		// this.chasmVfx.push(transfer)

	}

	createChasmTransfer(r,path,f,v){

		const transfer = new ChasmTransfer(this, {resources: r, path: path, f: f, visibility: v})
		// this.vfx.push(transfer)
		this.chasmVfx.push(transfer)

	}

	createLightning(r,p,d,f,v,c){

		this.vfx.push(new Lightning(this, {resources: r, source: p, destination: d, f: f, visibility: v, color: c}))

	}

	createResourceExplosion(r,p,v){
		this.vfx.push(new ResourceExplosion(this, {resources: r, source: p, visibility: v}))
	}

	createResourceSpark(c,p,v){

		this.vfx.push(new ResourceSpark(this, {resources: c, source: p, visibility: v}))

	}

	createExhaust(uv,c,v){
		this.vfx.push(new Exhaust(this, {uv: uv, color: c, visibility: v}))
	}

	createHollowEvent(color = `#FFBB36`, time = 6000, sound = false, image = false){

		if (sound) this.playSound(sound, 0, 1)

		this.hollowEvents.push({max: time, time: time, color: color, imageTime: image ? 250 : 0, maxImageTime: 200})

	}
	createDarkHollowEvent(color = `#FFBB36`, time = 6000, sound = false, image = false){

		if (sound) this.playSound(sound, 0, 1)

		this.darkHollowEvents.push({max: time, time: time, color: color, imageTime: image ? 250 : 0, maxImageTime: 200})

	}

	updateHollowEvents(dt){

		for (let i = 0; i < this.hollowEvents.length; i++){

			const e = this.hollowEvents[i]
			e.time -= dt
			e.imageTime -= dt
			if (e.time <= 0){
				
				this.hollowEvents.splice(i,1)
				i--

			}

		}
		for (let i = 0; i < this.darkHollowEvents.length; i++){

			const e = this.darkHollowEvents[i]
			e.time -= dt
			e.imageTime -= dt
			if (e.time <= 0){
				
				this.darkHollowEvents.splice(i,1)
				i--

			}

		}

	}

	renderHollowEvents(){

		this.ctx.save()
		for (let i = 0; i < this.hollowEvents.length; i++){

			const e = this.hollowEvents[i]
			this.ctx.globalAlpha = e.time / e.max

			this.ctx.fillStyle = e.color
			this.ctx.fillRect(0,0,this.w,this.h)

			if (e.imageTime > 0){

				this.ctx.globalAlpha = e.imageTime / e.maxImageTime
				const size = this.unit * 6
				this.ctx.drawImage(this.hollowImage, this.w2 - size / 2, this.h2 - size / 2, size, size)

			}

		}
		this.ctx.restore()

	}

	renderDarkHollowEvents(){

		this.ctx.save()
		for (let i = 0; i < this.darkHollowEvents.length; i++){

			const e = this.darkHollowEvents[i]
			this.ctx.globalAlpha = e.time / e.max

			this.ctx.fillStyle = e.color
			this.ctx.fillRect(0,0,this.w,this.h)

			if (e.imageTime > 0){

				this.ctx.globalAlpha = e.imageTime / e.maxImageTime
				const size = this.unit * 6
				this.ctx.drawImage(this.hollowImage, this.w2 - size / 2, this.h2 - size / 2, size, size)

			}

		}
		this.ctx.restore()

	}

	initiateSlowdown(t,m){

		this.stats.timeEvents++

		this.slowdown.state = true 
		this.slowdown.timer = t
		this.slowdown.totalTime = t
		this.slowdown.multiplyer = m

	}

	updateSurge(dt){
		if (this.currentlyExtracting) this.surgeSpawnTimer -= dt
		if (this.surgeSpawnTimer <= 0){
			this.spawnSurge()
			this.surgeSpawnTimer = 20000 + Math.random() * 80000
		}
	}

	spawnSurge(){

		if (!this.resources[1]) return

		const dice = Math.random()
		const multiplyer = dice < .75 ? .1 : dice < .9 ? .3 : .5

		let maxId = 0
		for (let i = 9; i >=0; i--){
			if (this.resources[i] > 0){
				maxId = i
				break
			}
		}
		const rid = Math.floor(Math.random() * (maxId + 1))
		const source = rid > 6 ? Math.min(this.resources[rid], 512) : rid === 5 ? Math.min(this.resources[rid], 16384) : Math.min(this.resources[rid], 262144)
		const base = this.stats.totalResourcesMined[rid] > 2048 ? 512 + multiplyer * source : multiplyer * source
		const amount = Math.max(1, base + source * multiplyer * Math.random())

		const resources = []
		resources[rid] = amount
		const colors = this.codex.resources[rid].surgeTriplet ? this.codex.resources[rid].surgeTriplet : this.codex.resources[rid].triplet

		const origin = this.xyToUV(this.mouse.offsetxy)
		const radius = 6

		for (let i = 0; i < 32; i++){

			const u = Math.floor((Math.random() * 2 - 1) * radius + origin[0])
			const v = Math.floor((Math.random() * 2 - 1) * radius + origin[1])
			const rayNumber = 1 + Math.floor(multiplyer * 24)
			const grade = rayNumber < 5 ? 0 : rayNumber < 10 ? 1 : 2

			const placed = this.addEntity(`surge`, [u,v], {
				resources: resources,
				rayNumber: rayNumber,
				grade: grade,
				colors: colors,
				type: rid
			}, {skipShopUpdate: true})

			if (placed) break

		}

	}

}