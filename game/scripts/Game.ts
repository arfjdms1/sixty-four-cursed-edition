import { Bezier } from './bezier.js'
import { abstract_getCodex } from './codex.js'
import { Sprite } from './sprites.js'
import { Auxpump } from './entities/Auxpump.js'
import { Auxpump2 } from './entities/Auxpump2.js'
import { Cube } from './entities/Cube.js'
import { Entropic } from './entities/Entropic.js'
import { Entropic2a } from './entities/Entropic2a.js'
import { Pump } from './entities/Pump.js'
import { Silo } from './entities/Silo.js'
import { Achiever, Cloud, Explainer, Messenger, Shop, Splash } from './ui.js'
import { abstract_getWords } from './words.js'
import { SaveSystem } from './save/SaveSystem.js'
import type { SaveHost } from './save/types.js'
import { AudioSystem } from './audio/AudioSystem.js'
import type { AudioHost } from './audio/types.js'
import { EffectSystem } from './effects/EffectSystem.js'
import { InputSystem } from './input/InputSystem.js'
import type { InputHost, MouseState } from './input/types.js'
import { RenderSystem } from './rendering/RenderSystem.js'
import type { RenderHost } from './rendering/types.js'
import { VFX } from './effects/VFX.js'
import { Exhaust } from './effects/Exhaust.js'
import { ResourceExplosion } from './effects/ResourceExplosion.js'
import { ResourceSpark } from './effects/ResourceSpark.js'
import { ResourceTransfer } from './effects/ResourceTransfer.js'
import { ChasmTransfer } from './effects/ChasmTransfer.js'
import { Lightning } from './effects/Lightning.js'
import type { ColorTriplet, ResourceAmounts, Vec2 } from '../types/core.js'
import type { ClockWorkerTick, GameStartupPayload } from '../types/platform.js'
import type { EncodedSave, LoadableSaveState, SaveBackup, SaveSource, SerializedEntity, SerializedEntityParams } from '../types/save.js'
import type { EffectCompletion, EffectHost, EffectVisibility } from './effects/types.js'
import type { EntityHost } from './entities/types.js'
import type { GameEntity, GameRuntimeState, GlState, HeldItem, PlayingSound, PointerInput, SoundState } from './game/types.js'
import { ResourceSystem } from './resources/ResourceSystem.js'
import type { ResourceHost } from './resources/types.js'
import { EntityManager } from './entities/EntityManager.js'
import type { EntityManagerHost } from './entities/manager-types.js'
import { InteractionSystem } from './interaction/InteractionSystem.js'
import type { InteractionHost } from './interaction/types.js'

export { VFX, Exhaust, ResourceExplosion, ResourceSpark, ResourceTransfer, ChasmTransfer, Lightning }

export interface Game extends GameRuntimeState {}

type ResourceOwnedField = 'analytics' | 'resources' | 'resourcePops' | 'resourceBuffer' | 'resourceRates' | 'rateMeasureMode'

function installResourceAccessor<K extends ResourceOwnedField>(game: Game, property: K): void {
	Object.defineProperty(game, property, {
		configurable: true,
		enumerable: true,
		get: () => game.resourceSystem[property],
		set: (value: ResourceSystem[K]) => { game.resourceSystem[property] = value },
	})
}

type EntityOwnedField = 'stuff' | 'stuffMap' | 'entitiesInGame' | 'chromaToContain'

function installEntityAccessor<K extends EntityOwnedField>(game: Game, property: K): void {
	Object.defineProperty(game, property, {
		configurable: true,
		enumerable: true,
		get: () => game.entityManager[property],
		set: (value: EntityManager[K]) => { game.entityManager[property] = value },
	})
}

type InteractionOwnedField =
	| 'selectedCell'
	| 'selectedEntity'
	| 'canPlace'
	| 'itemInHand'
	| 'itemInHandPriceTag'
	| 'transportedEntity'
	| 'hoveredCell'
	| 'hoveredEntity'
	| 'hoveredResource'
	| 'altActive'
	| 'pressedQOnBlank'
	| 'pressedQOnMachine'

function installInteractionAccessor<K extends InteractionOwnedField>(game: Game, property: K): void {
	Object.defineProperty(game, property, {
		configurable: true,
		enumerable: true,
		get: () => game.interaction[property],
		set: (value: InteractionSystem[K]) => { game.interaction[property] = value },
	})
}

export class Game implements SaveHost, AudioHost, EffectHost, InputHost, RenderHost, ResourceHost, EntityManagerHost, InteractionHost {

	constructor(canvas: HTMLCanvasElement, preload: GameStartupPayload){

		this.canvas = canvas
		this.ctx = this.canvas.getContext(`2d`) as CanvasRenderingContext2D

		this.isWindows = navigator.userAgent.indexOf(`Win`) !== -1
		this.steamId = preload?.steamId || ``
		this.languages = [`en`, `ru`, `de`, `ptbr`, `it`, `es`, `fr`, `nl`, `cz`, `pl`, `jp`, `kr`, `sch`, `tch`, `thai`, `hu`, `lv`, `ro`]
		this.languageId = this.getLanguageId() as number
		if (this.languageId === null) this.languageId = (preload && preload.languageId !== null) ? preload.languageId : 0
		this.language = this.languages[this.languageId]
		this.hasSteam = this.steamId ? true : false
		this.saves = new SaveSystem(this)
		this.audio = new AudioSystem(this)
		this.effects = new EffectSystem(this)
		this.input = new InputSystem(this)
		this.renderer = new RenderSystem(this)
		this.resourceSystem = new ResourceSystem(this)
		this.entityManager = new EntityManager(this, this as EntityHost)
		this.interaction = new InteractionSystem(this, this.entityManager, this.resourceSystem)

		try {
			if (typeof window.require !== `function`) throw new ReferenceError(`require is not defined`)
			this.spaceport = window.require(`electron`).ipcRenderer
		} catch(e){
			this.spaceport = {send:(_: unknown)=>false, isPlaceholder: true}
		}

		this.pixelRatio = devicePixelRatio
		this.translation = [0, 0]
		this.translationMap = [0, 0, 0, 0]
		const zoom = +localStorage.getItem(`abstractv03_zoom${this.steamId}`)!
		this.zoomRange = [.3, 2]
		this.zoom = (zoom >= this.zoomRange[0] && zoom <= this.zoomRange[1]) ? zoom : 1
		
		this.translationSpeed = this.pixelRatio
		this.distanceToOrigins = 0

		this.time = {lt: performance.now(), dt: 0, realDt: 0}
		this.renderTime = {lt: performance.now(), dt: 0}
		this.chillMode = false
		this.version = `1.1.0`

		installEntityAccessor(this, `stuff`)
		installEntityAccessor(this, `stuffMap`)
		installEntityAccessor(this, `entitiesInGame`)
		installEntityAccessor(this, `chromaToContain`)
		this.entityManager.initEntities()

		installInteractionAccessor(this, `selectedCell`)
		installInteractionAccessor(this, `selectedEntity`)
		installInteractionAccessor(this, `canPlace`)
		installInteractionAccessor(this, `itemInHand`)
		installInteractionAccessor(this, `itemInHandPriceTag`)
		installInteractionAccessor(this, `transportedEntity`)
		installInteractionAccessor(this, `hoveredCell`)
		installInteractionAccessor(this, `hoveredEntity`)
		installInteractionAccessor(this, `hoveredResource`)
		installInteractionAccessor(this, `altActive`)
		installInteractionAccessor(this, `pressedQOnBlank`)
		installInteractionAccessor(this, `pressedQOnMachine`)

		this.unlockedEntities = {}
		this.plane = 0
		this.bridge = false
		this.maxEntityHeight = 3
		this.resourceTransferType = 0
		this.onlyones = {}
		this.eraserType = 0
		this.hellgemChunk = 64
		this.renderLimitOfAKind = 96
		this.currentHint = {
			entity: undefined,
			element: undefined
		}
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
			totalResourcesMined: new Array(10).fill(0) as ResourceAmounts,
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
		
		this.shop = new Shop(document.querySelector(`.shop`) as HTMLDivElement, this as ConstructorParameters<typeof Shop>[1])
		this.splash = new Splash(this as unknown as ConstructorParameters<typeof Splash>[0])
		this.messenger = new Messenger(this as unknown as ConstructorParameters<typeof Messenger>[0])
		this.steamAchievements = preload?.steamAchievements
		this.achiever = new Achiever(this as unknown as ConstructorParameters<typeof Achiever>[0])
		this.explainer = new Explainer(this as ConstructorParameters<typeof Explainer>[0],localStorage.getItem(`abstractv03_helpIsNeeded${this.steamId}`))

		if (!this.hasSteam) this.showSteamWarning()
		this.setListeners()

		this.updateLoop()
		this.clock = new Worker(new URL('./clock.ts', import.meta.url))
		this.clock.addEventListener(`message`, (m: MessageEvent<ClockWorkerTick>)=>{
			this.updateLoop()
		})
		this.renderloop()
		setTimeout( (_: unknown)=>this.saveLoop(), 10000)
		setTimeout( (_: unknown)=>this.backupLoop(), 240000)

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
		installResourceAccessor(this, `analytics`)
		this.resourceSystem.initAnalytics()
	}

	togglePhotofobia(){

		this.photofobia = !this.photofobia
		this.splash.setPhotofobia(this.photofobia)
		localStorage.setItem(`abstractv03_photofobia${this.steamId}`, this.photofobia as unknown as string)

	}

	toggleChill(){

		this.chillMode = !this.chillMode
		this.splash.chill.classList.toggle(`active`)
		localStorage.setItem(`abstractv03_chill${this.steamId}`, this.chillMode as unknown as string)

	}

	preloadImages(): Record<string, HTMLImageElement | undefined> {
		const list = this.codex.preload
		const images: Record<string, HTMLImageElement> = {}
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

	initialLoad(save?: SaveSource){
		this.saves.initialLoad(save)
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

	updateSteamAchievement(id: string, v: boolean){
		this.spaceport?.send(`achieve`, id)
	}

	getMute(): boolean {
		return this.audio.getMute()
	}

	getLanguageId(): number | null {
		const id = +localStorage.getItem(`abstractv03_language${this.steamId}`)!
		if (id && this.languages[id]) return id
		return null
	}

	changeLanguage(id: number){
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

			localStorage.setItem(`abstractv03_language${this.steamId}`, this.languageId as unknown as string)
		}
	}

	initScreenSize(){
		this.renderer.initScreenSize()
	}

	watchCredits(){
		this.preventSaving = true
		const texts = this.words.credits
		const eonly = abstract_getWords().en.credits
		const l = this.language

		const addLine = (t: string) => {
			const say = document.createElement(`p`)
			say.innerHTML = t
			this.creditPillar.appendChild(say)
		}

		this.halt = true
		this.messenger.element.innerHTML = ``
		setTimeout((_: unknown)=>{this.lastDialogue = true}, 20000)

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

		this.creditImage.style.opacity = 1 as unknown as string
		this.creditImage.play()

		this.creditImage.addEventListener(`ended`,_=>{
			this.creditImage.style.transition = `opacity 48s ease`
			this.creditImage.style.opacity = 0 as unknown as string
		})

		const speed = .02
		let scrollAmount = -1000
		let lt = performance.now()
		let finalChord: HTMLDivElement | false = false
		const scrollDown = (p: HTMLDivElement)=>{

			const edge = p.getBoundingClientRect().bottom < 0

			if (!edge) requestAnimationFrame((_: number)=>{scrollDown(p)})

			const now = performance.now()
			const dt = now - lt
			lt = now

			scrollAmount += speed * dt
			p.style.transform = `translate(0,${innerHeight - scrollAmount}px)`

			if (!finalChord && edge){
				finalChord = document.createElement(`div`)
				finalChord.classList.add(`finalChord`)
				finalChord.innerHTML = `<span>T-1</span>`
				this.credits!.append(finalChord)
				finalChord.onclick = (_: MouseEvent)=>{
					location.reload()
				}
				setTimeout((_: unknown)=>{(finalChord as HTMLDivElement).style.opacity = 1 as unknown as string},640)
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

	switchPlane(p: number){

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
		const silos: Silo[] = []
		const automatedStuff = new Set<GameEntity>()
		const auxes = new Set<Auxpump | Auxpump2>()
		const pumps = new Set<Pump>()
		const mapTiles = new Set<string>()
		const pumpZones: Array<{ pump: Pump; speed: number; uvs: Vec2[] }> = []

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

				if (m[j] && m[j] instanceof Auxpump) auxes.add(m[j] as Auxpump)
				if (m[j] && !(m[j] instanceof Cube)) automatedStuff.add(m[j] as GameEntity)

			}

		}

		//Get all automated pumps
		for (let a of auxes){

			for (let i = 0; i < a.soi.length; i++){

				const uv: Vec2 = [a.position[0] + a.soi[i][0], a.position[1] + a.soi[i][1]]
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

				if (auxes.has(p.auxes[i] as Auxpump | Auxpump2) && p.auxes[i] instanceof Auxpump2){
					auxMult = 1
					break
				}

			}

			const zone: { pump: Pump; speed: number; uvs: Vec2[] } = {
				pump: p,
				speed: p.pumpSpeed * (1 + auxMult),
				uvs: []
			}

			for (let i = 0; i < range.length; i++){

				const uv: Vec2 = [p.position[0] + range[i][0], p.position[1] + range[i][1]]
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
		const soi: Vec2[] = [[0,-1], [1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]]
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
					initialPower += entity.power as number
				} else if (entity instanceof Entropic) {
					initialPower += entity.power as number
					powerRate += (entity.power as number) / entity.interval
					}

				}

				if(!initialPower || !powerRate) console.log(c)

			}

		}


		// console.log(automatedStuff)

	}

	get entityHost(): EntityHost {
		return this as EntityHost
	}

	//RESOURCES

	initResources(){

		installResourceAccessor(this, `resources`)
		installResourceAccessor(this, `resourcePops`)
		this.resourceSystem.initResources()
		// this.preGradient = new Array(10).fill(0)
		this.resourcesSprites = [] as unknown as Sprite[] & Record<string | number, Sprite>

		for (let i = 0; i < this.codex.resources.length; i++){
			this.resourcesSprites.push(new Sprite({
				master: this as EntityHost,
				src: `img/resources.png`,
				frames: [[i*108,0,104,120]],
				origins: [52,60],
				scale: .25,
				intervals: 100
			}))
		}
		installResourceAccessor(this, `resourceBuffer`)
		installResourceAccessor(this, `resourceRates`)
		this.resourceSystem.initRateTracking()

	}

	setResourceHomes(){
		this.renderer.setResourceHomes()
	}

	//SAVE
	get backups(): SaveBackup[] {
		return this.saves.backups
	}
	set backups(val: SaveBackup[]) {
		this.saves.backups = val
	}

	get preventSaving(): boolean {
		return this.saves.preventSaving
	}
	set preventSaving(val: boolean) {
		this.saves.preventSaving = val
	}

	get preventCloud(): boolean {
		return this.saves.preventCloud
	}
	set preventCloud(val: boolean) {
		this.saves.preventCloud = val
	}

	async exportSave(): Promise<void> {
		return this.saves.exportSave()
	}

	async loadSaveFromClipboard(): Promise<void> {
		return this.saves.loadSaveFromClipboard()
	}

	importSave(data: EncodedSave | undefined){
		return this.saves.importSave(data)
	}

	loadSave( manual: LoadableSaveState | 0 = this.saves.decodeSave(localStorage.getItem(`abstractv03${this.steamId}`)) ): boolean {
		return this.saves.loadSave(manual)
	}

	restoreBackup(n: number){
		return this.saves.restoreBackup(n)
	}

	backupLoop(){
		return this.saves.backupLoop()
	}

	saveLoop(){
		return this.saves.saveLoop()
	}

	saveGame(){
		return this.saves.saveGame()
	}

	assembleSave(backupless?: boolean): EncodedSave | undefined {
		return this.saves.assembleSave(backupless)
	}

	decodeSave(s: unknown): LoadableSaveState | 0 {
		return this.saves.decodeSave(s)
	}

	encodeSave(s: string): EncodedSave | undefined {
		return this.saves.encodeSave(s)
	}

	getEntityString(e: GameEntity): SerializedEntity | undefined {
		return this.saves.serializeEntity(e)
	}

	addWaypoint(e: GameEntity, o?: number){

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

	removeWaypoint(e: GameEntity){

		let reduce = false

		for (let i = 0; i < this.waypointList.length; i++){

			if (reduce){
				this.waypointList[i]!.order--
			} else {
				if (e === this.waypointList[i]){

					this.waypointList.splice(i,1)
					i--
					reduce = true

				}
			}

		}

	}

	useWaypoint(e: GameEntity){

		for (let i = 0; i < this.waypointList.length; i++){

			if (e === this.waypointList[i]){

				const next = this.waypointList[(i+1)%this.waypointList.length]

				const delta = this.uvToXY(next!.position)
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

	mute(on: boolean){
		this.audio.mute(on)
	}

	updateEraserType(t: 0 | 1 | 2){
		this.eraserType = t
		this.shop.check()
	}

	initGlWithShader(){

		this.glcanvas = document.createElement(`canvas`)
		this.glcanvas.width = this.w
		this.glcanvas.height = this.h
		const gl = this.gl = this.glcanvas.getContext(`webgl2`, {premultipliedAlpha: false}) as WebGL2RenderingContext

		//Vertex Shader
		const vshader = gl.createShader(gl.VERTEX_SHADER)!
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
		if (!gl.getShaderParameter(vshader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(vshader) as string)

		//Fragment Shader
		const fshader = gl.createShader(gl.FRAGMENT_SHADER)!
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
		if (!gl.getShaderParameter(fshader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(fshader) as string)

		//Program
		const program = gl.createProgram()!
		gl.attachShader(program, vshader)
		gl.attachShader(program, fshader)
		gl.linkProgram(program)
		if (gl.getProgramParameter(program, gl.LINK_STATUS)){
			gl.useProgram(program)
		} else {
			throw new Error(gl.getProgramInfoLog(program) as string)
		}
		
		this.glStuff = {
			gl: gl,
			textures: {}
		} as GlState

		this.glStuff.pal = gl.getAttribLocation(program, `a_position`)
		gl.enableVertexAttribArray(this.glStuff.pal)
		this.glStuff.tal = gl.getAttribLocation(program, `a_texcoord`)
		gl.enableVertexAttribArray(this.glStuff.tal)

		this.glStuff.uspriteoffset = gl.getUniformLocation(program, 'u_spriteoffset')
		this.glStuff.uoffset = gl.getUniformLocation(program, 'u_offset')

		gl.enable(gl.BLEND)
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)


	}

	getLoudnessFromXY(xy: Vec2){
		return this.audio.getLoudnessFromXY(xy)
	}

	getPanValueFromX(x: number){
		return this.audio.getPanValueFromX(x)
	}

	pickupItem(name: string){
		this.interaction.pickupItem(name)
	}

	requestResources(r: number[], d: Vec2, f?: ((resources?: number[]) => void) | false, skip?: boolean){
		return this.resourceSystem.requestResources(r, d, f, skip)
	}

	askForResources(r: number[], d: Vec2, f?: ((resources: number[]) => void) | false, skip?: boolean){
		return this.resourceSystem.askForResources(r, d, f, skip)
	}

	get isMute(): boolean {
		return this.audio.isMute
	}
	set isMute(val: boolean) {
		this.audio.isMute = val
	}

	get globalSoundVolume(): number {
		return this.audio.globalSoundVolume
	}
	set globalSoundVolume(val: number) {
		this.audio.globalSoundVolume = val
	}

	get actx(): AudioContext | undefined {
		return this.audio.actx
	}
	set actx(val: AudioContext | undefined) {
		this.audio.actx = val
	}

	get sfx(): SoundState | undefined {
		return this.audio.sfx
	}
	set sfx(val: SoundState | undefined) {
		this.audio.sfx = val
	}

	updateGlobalSounds(){
		this.audio.updateGlobalSounds()
	}

	updateGlobalVolume(v = this.globalSoundVolume){
		this.audio.updateGlobalVolume(v)
	}

	fadeSound(v: number){
		this.audio.fadeSound(v)
	}

	initAudio(){
		this.audio.initAudio()
	}

	startSound(id: string | number, panning?: number, loudness?: number): PlayingSound | false {
		return this.audio.startSound(id, panning, loudness)
	}

	stopSound(sfx: unknown, t?: number){
		this.audio.stopSound(sfx, t)
	}

	setLoudnessToSFX(sfx: unknown, l: number){
		this.audio.setLoudnessToSFX(sfx, l)
	}

	setPanToSFX(sfx: unknown, p: number){
		this.audio.setPanToSFX(sfx, p)
	}

	playSound(id: string | number, panning?: number, loudness?: number, dark?: boolean, forced?: boolean){
		this.audio.playSound(id, panning, loudness, dark, forced)
	}

	getRealPrice(name: string, sale?: boolean){
		return this.resourceSystem.getRealPrice(name, sale)
	}


	canAfford(name: string){
		return this.resourceSystem.canAfford(name)
	}

	clearCell(uv: Vec2){
		this.entityManager.clearCell(uv)
	}

	updateMouseData(x: number, y: number){
		this.input.updateMouseData(x, y)
	}

	processMousemove(e?: PointerInput, dxy?: Vec2){
		this.interaction.processMousemove(e, dxy)
	}

	processMousedown(e?: unknown){
		this.interaction.processMousedown(e)
	}

	processQ(){
		this.interaction.processQ()
	}

	processE(){
		this.interaction.processE()
	}

	canRelocate(e: GameEntity | false | undefined){
		return this.interaction.canRelocate(e)
	}

	relocate(e: GameEntity, p: Vec2){
		this.interaction.relocate(e, p)
	}

	processClick(){
		this.interaction.processClick()
	}

	processMouseup(){
		this.interaction.processMouseup()
	}

	processMouseout(){
		this.interaction.processMouseout()
	}

	zoomInOut(delta: number){

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

	get mouse(): MouseState {
		return this.input.mouse
	}
	set mouse(val: MouseState) {
		this.input.mouse = val
	}

	get gamepadButtons(): Array<number | boolean> {
		return this.input.gamepadButtons
	}
	set gamepadButtons(val: Array<number | boolean>) {
		this.input.gamepadButtons = val
	}

	get gamepadControl(): boolean | undefined {
		return this.input.gamepadControl
	}
	set gamepadControl(val: boolean | undefined) {
		this.input.gamepadControl = val
	}

	get thereWasZoomAction(): boolean | undefined {
		return this.input.thereWasZoomAction
	}
	set thereWasZoomAction(val: boolean | undefined) {
		this.input.thereWasZoomAction = val
	}

	get keyboardMovementHappening(): number | undefined {
		return this.input.keyboardMovementHappening
	}
	set keyboardMovementHappening(val: number | undefined) {
		this.input.keyboardMovementHappening = val
	}

	get zoomWhenShiftPressed(): number | undefined {
		return this.input.zoomWhenShiftPressed
	}
	set zoomWhenShiftPressed(val: number | undefined) {
		this.input.zoomWhenShiftPressed = val
	}

	get shiftPressed(): boolean | undefined {
		return this.input.shiftPressed
	}
	set shiftPressed(val: boolean | undefined) {
		this.input.shiftPressed = val
	}

	get resizeAnimationFrame(): number | undefined {
		return this.input.resizeAnimationFrame
	}
	set resizeAnimationFrame(val: number | undefined) {
		this.input.resizeAnimationFrame = val
	}

	setListeners(){
		this.input.setListeners()
	}

	getHitCoordinates(xy: Vec2): Vec2 {
		return this.renderer.getHitCoordinates(xy)
	}

	checkHitBox(uv: Vec2, hb: [number, number, number, number]){
		if (uv[0] > hb[0] && uv[0] < hb[2] && uv[1] > hb[1] && uv[1] < hb[3]) return true
		return false
	}

	updateAnalytics(dt: number){
		this.resourceSystem.updateAnalytics(dt)
	}

	updateLoop(){
		//Service updates
		const now = performance.now()
		this.time.dt = (now - this.time.lt)
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
		this.currentlyExtracting = false as unknown as number
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
		this.updateAnalytics(this.time.dt)

		if (this.entitiesInGame.pinhole > 0){
			this.resources = new Array(10).fill(.01) as ResourceAmounts
		}

		this.clock?.postMessage(true)
	}

	updateAutoClicker(dt: number){
		this.input.updateAutoClicker(dt)
	}

	updateGamepad(dt: number){
		this.input.updateGamepad(dt)
	}

	measureRates(){
		installResourceAccessor(this, `rateMeasureMode`)
		this.resourceSystem.measureRates(()=>{ delete this.rateMeasureMode })
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

			const time = (10000 + Math.random() * 10000 * hollows) * ((power as number) === .01 ? .5 : 1)

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

	updateResourceInteractions(dt: number){

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

			const outcomes: Array<[number, (n: number) => number[]]> = this.generaldecay ? [[.5, n=>[0,0,0,0,4*n]],[.8, n=>[0,0,0,16*n]],[.93, n=>[0,0,32*n]],[1, n=>[0,64*n]]] : [[.5, n=>[0,0,0,0,2*n]],[.85, n=>[0,0,0,8*n]],[.97, n=>[0,0,16*n]],[1, n=>[0,32*n]]]

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
				let outcome: [number, (n: number) => number[]] | undefined
				for (let i = 0; i < 4; i++){
					if (dice < outcomes[i][0]){
						outcome = outcomes[i]
						break
					}
				}

				if (this.generaldecay){
					this.generaldecay.consume(outcome![1](hits))
				} else {
					this.playSound(`geiger`)
					this.createResourceTransfer(outcome![1](hits), this.resourceHomes[5])
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
				
				let annihilatorWorking: number | boolean | void = false
				for (const a of this.annihilators){
					annihilatorWorking = a.tap!() || annihilatorWorking
				}
				this.playSound(`hellbreak`,0, this.voidsculpture ? .16 : 1)
				if (!annihilatorWorking){
					this.createResourceExplosion([0,0,0,0,hellToDestroy,0,heavenToDestroy])
				}

				for (const m of this.annihilationMachines){
					m.tap!()
				}

			}

		}

	}

	updateResourcePops(dt: number){
		this.resourceSystem.updateResourcePops(dt)
	}

	updateTranslation(dt: number){

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

		requestAnimationFrame((_: unknown)=>{this.renderloop()})

		this.unit = this.solidUnit * this.zoom

		if (this.halt) return

			const now = performance.now()
			this.renderTime.dt = now - this.renderTime.lt
			this.renderTime.lt = now

			if (this.slowdown.state) this.renderTime.dt *= (1 * (1 - this.slowdown.f) + this.slowdown.multiplyer * this.slowdown.f)

			this.renderer.renderFrame(this.renderTime.dt)

	}

	renderSlowdown(){
		this.renderer.renderSlowdown()
	}

	renderHoveredCell(){
		this.renderer.renderHoveredCell()
	}

	renderSOI(entity: GameEntity | Vec2){
		this.renderer.renderSOI(entity)
	}

	renderAffected(name: string){
		this.renderer.renderAffected(name)
	}

	renderCursor(){
		this.renderer.renderCursor()
	}

	removeHint(){
		this.renderer.removeHint()
	}

	renderUnfilled(){
		this.renderer.renderUnfilled()
	}

	renderAvailability(){
		this.renderer.renderAvailability()
	}

	renderResources(){
		this.renderer.renderResources()
	}

	renderResourceBeds(){
		this.renderer.renderResourceBeds()
	}

	renderDarkResources(){
		this.renderer.renderDarkResources()
	}

	makeReadable(n: number){
		const sign = Math.sign(n)
		const abs = Math.abs(n)
		if (abs<1e4) return sign * Math.floor(abs)
		if (abs<1e6) return sign * Math.floor(abs/10)/100 + ` K`
		if (abs<1e9) return sign * Math.floor(abs/10000)/100 + ` M`
		if (abs<1e12) return sign * Math.floor(abs/10000000)/100 + ` B`
		if (abs<1e15) return sign * Math.floor(abs/10000000000)/100 + ` T`
		return `A lot`
	}

	addResourcesFromArray(a: number[], skipAnalytics?: boolean){
		this.resourceSystem.addResourcesFromArray(a, skipAnalytics)
	}

	substractResourcesFromArray(a: number[], skipAnalytics?: boolean){
		this.resourceSystem.substractResourcesFromArray(a, skipAnalytics)
	}

	isVisible(p: GameEntity){
		return this.renderer.isVisible(p)
	}

	renderConductors(dt: number){
		this.renderer.renderConductors(dt)
	}

	renderEntities(dt: number){
		this.renderer.renderEntities(dt)
	}

	updateUnfilled(_dt = 0){

		this.unfilledEntities = []
		for (let i = 0; i < this.stuff.length; i++){
			if (!(this.stuff[i] instanceof Cube) && this.stuff[i]?.fill === 0 && this.stuff[i].state !== 1 && !this.stuff[i].isNextToSilo) this.unfilledEntities.push(this.stuff[i])
		}

	}

	updateEntities(dt: number){
		this.entityManager.updateEntities(dt)
	}

	updateRange(){

		this.range = {x: [-5, 5], y: [-5, 5]}

	}

	renderGrid(){
		this.renderer.renderGrid(this.range)
	}

	drawResourceInScreenCoordinates(id: number, p: Vec2){
		this.renderer.drawResourceInScreenCoordinates(id, p)
	}

	drawCube(position: Vec2, size: number, triplet?: ColorTriplet){
		this.renderer.drawCube(position, size, triplet)
	}

	drawPrism(position: Vec2, size: number, height: number, triplet?: ColorTriplet){
		this.renderer.drawPrism(position, size, height, triplet)
	}

	uvToXY(uv: Vec2): Vec2 {
		return this.renderer.uvToXY(uv)
	}

	uvToXYUntranslated(uv: Vec2): Vec2 {
		return this.renderer.uvToXYUntranslated(uv)
	}

	xyToUV(xy: Vec2): Vec2 {
		return this.renderer.xyToUV(xy)
	}

	entityAtCoordinates(p: Vec2){
		return this.entityManager.entityAtCoordinates(p)
	}

	addEntity(name: string, position: Vec2, misc?: unknown, options: { skipShopUpdate?: boolean } = {}): GameEntity | false {
		return this.entityManager.addEntity(name, position, misc, options)
	}

	get vfx(): VFX[] {
		return this.effects.vfx
	}
	set vfx(val: VFX[]) {
		this.effects.vfx = val
	}

	get chasmVfx(): VFX[] {
		return this.effects.chasmVfx
	}
	set chasmVfx(val: VFX[]) {
		this.effects.chasmVfx = val
	}

	renderVFX(){
		this.effects.renderVFX()
	}

	renderChasmVFX(){
		this.effects.renderChasmVFX()
	}

	renderChasm(){
		this.renderer.renderChasm()
	}

	updateVFX(dt: number){
		this.effects.updateVFX(dt)
	}

	// Resources, origin position, destination position, onfinish or will be added to resources, visibility
	createResourceTransfer(r: number[], p?: Vec2 | false, d?: Vec2, f?: EffectCompletion | false, v?: EffectVisibility, skip?: boolean){
		return this.effects.createResourceTransfer(r, p, d, f, v, skip)
	}

	createChasmTransfer(r: number[], path: unknown, f?: EffectCompletion | false, v?: EffectVisibility){
		return this.effects.createChasmTransfer(r, path, f, v)
	}

	createLightning(r: number[], p?: Vec2 | false, d?: Vec2, f?: EffectCompletion | false, v?: EffectVisibility, c?: string){
		return this.effects.createLightning(r, p, d, f, v, c)
	}

	createResourceExplosion(r: number[], p?: Vec2 | false, v?: EffectVisibility){
		return this.effects.createResourceExplosion(r, p, v)
	}

	createResourceSpark(c: number[], p?: Vec2 | false, v?: EffectVisibility){
		return this.effects.createResourceSpark(c, p, v)
	}

	createExhaust(uv: Vec2, c?: string, v?: EffectVisibility){
		return this.effects.createExhaust(uv, c, v)
	}

	createHollowEvent(color = `#FFBB36`, time = 6000, sound: string | number | false = false, image = false){

		if (sound) this.playSound(sound, 0, 1)

		this.hollowEvents.push({max: time, time: time, color: color, imageTime: image ? 250 : 0, maxImageTime: 200})

	}
	createDarkHollowEvent(color = `#FFBB36`, time = 6000, sound: string | number | false = false, image = false){

		if (sound) this.playSound(sound, 0, 1)

		this.darkHollowEvents.push({max: time, time: time, color: color, imageTime: image ? 250 : 0, maxImageTime: 200})

	}

	updateHollowEvents(dt: number){

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
		this.renderer.renderHollowEvents()
	}

	renderDarkHollowEvents(){
		this.renderer.renderDarkHollowEvents()
	}

	initiateSlowdown(t: number, m: number){

		this.stats.timeEvents++

		this.slowdown.state = true 
		this.slowdown.timer = t
		this.slowdown.totalTime = t
		this.slowdown.multiplyer = m

	}

	updateSurge(dt: number){
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
