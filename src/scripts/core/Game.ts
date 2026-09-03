import { Bezier } from '../bezier.js'
import { abstract_getCodex } from '../codex.js'
import { Sprite } from '../sprites.js'
import { Achiever, Cloud, Explainer, Messenger, Shop, Splash } from '../ui.js'
import { abstract_getWords } from '../words.js'
import { SaveSystem } from '../engine/save/SaveSystem.js'
import type { SaveHost } from '../engine/save/types.js'
import { AudioSystem } from '../engine/audio/AudioSystem.js'
import type { AudioHost } from '../engine/audio/types.js'
import { EffectSystem } from '../engine/effects/EffectSystem.js'
import { InputSystem } from '../engine/input/InputSystem.js'
import type { InputHost, MouseState } from '../engine/input/types.js'
import { RenderSystem } from '../engine/rendering/RenderSystem.js'
import type { RenderHost } from '../engine/rendering/types.js'
import { VFX } from '../engine/effects/VFX.js'
import { Exhaust } from '../engine/effects/Exhaust.js'
import { ResourceExplosion } from '../engine/effects/ResourceExplosion.js'
import { ResourceSpark } from '../engine/effects/ResourceSpark.js'
import { ResourceTransfer } from '../engine/effects/ResourceTransfer.js'
import { ChasmTransfer } from '../engine/effects/ChasmTransfer.js'
import { Lightning } from '../engine/effects/Lightning.js'
import type { ColorTriplet, ResourceAmounts, Vec2 } from '../../types/core.js'
import type { ClockWorkerTick, GameStartupPayload } from '../../types/platform.js'
import type { EncodedSave, LoadableSaveState, SaveBackup, SaveSource, SerializedEntity, SerializedEntityParams } from '../../types/save.js'
import type { EffectCompletion, EffectHost, EffectVisibility } from '../engine/effects/types.js'
import type { EntityHost } from '../engine/entities/types.js'
import type { GameEntity, GameRuntimeState, GlState, HeldItem, PlayingSound, PointerInput, SoundState } from './types.js'
import { ResourceSystem } from '../engine/resources/ResourceSystem.js'
import type { ResourceHost } from '../engine/resources/types.js'
import { EntityManager } from '../engine/entities/EntityManager.js'
import type { EntityManagerHost } from '../engine/entities/manager-types.js'
import { InteractionSystem } from '../engine/interaction/InteractionSystem.js'
import type { InteractionHost } from '../engine/interaction/types.js'
import { AutonomySystem } from '../engine/autonomy/AutonomySystem.js'
import type { AutonomyHost } from '../engine/autonomy/types.js'
import { WorldEventSystem } from '../engine/events/WorldEventSystem.js'
import type { WorldEventHost } from '../engine/events/types.js'
import { EntityRegistry } from '../registry/EntityRegistry.js'
import { ResourceRegistry } from '../registry/ResourceRegistry.js'
import type { ContentContext } from '../content/types.js'
import { createEntityContext } from '../engine/entities/context/EntityContext.js'
import type { ModManagementApi } from '../modding/ModManagement.js'
import { HOME_SCREEN_VARIANTS, type HomeScreenVariant } from '../startupPresentation.js'

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

type EventOwnedField = 'slowdown' | 'hollowEvents' | 'darkHollowEvents' | 'surgeSpawnTimer'

function installEventAccessor<K extends EventOwnedField>(game: Game, property: K): void {
	Object.defineProperty(game, property, {
		configurable: true,
		enumerable: true,
		get: () => game.worldEvents[property],
		set: (value: WorldEventSystem[K]) => { game.worldEvents[property] = value },
	})
}

export class Game implements SaveHost, AudioHost, EffectHost, InputHost, RenderHost, ResourceHost, EntityManagerHost, InteractionHost, AutonomyHost, WorldEventHost {
	declare modManagementApi?: ModManagementApi

	constructor(canvas: HTMLCanvasElement, preload: GameStartupPayload, content: ContentContext, modManagementApi?: ModManagementApi, homeScreenVariant: HomeScreenVariant = HOME_SCREEN_VARIANTS[0], steamWarningVisible = true){

		this.canvas = canvas
		this.ctx = this.canvas.getContext(`2d`) as CanvasRenderingContext2D

		this.isWindows = navigator.userAgent.indexOf(`Win`) !== -1
		this.steamId = preload?.steamId || ``
		this.languages = [`en`, `ru`, `de`, `ptbr`, `it`, `es`, `fr`, `nl`, `cz`, `pl`, `jp`, `kr`, `sch`, `tch`, `thai`, `hu`, `lv`, `ro`]
		this.languageId = this.getLanguageId() as number
		if (this.languageId === null) this.languageId = (preload && preload.languageId !== null) ? preload.languageId : 0
		this.language = this.languages[this.languageId]
		this.hasSteam = this.steamId ? true : false
		this.modManagementApi = modManagementApi
		this.entityRegistry = new EntityRegistry(content.entityDefinitions)
		this.resourceRegistry = new ResourceRegistry(content.resourceDefinitions)
		this.codex = abstract_getCodex(this.entityRegistry, this.resourceRegistry)
		this.saves = new SaveSystem(this)
		this.audio = new AudioSystem(this)
		this.effects = new EffectSystem(this)
		this.input = new InputSystem(this)
		this.renderer = new RenderSystem(this)
		this.resourceSystem = new ResourceSystem(this)
		this.entityContext = createEntityContext(this)
		this.entityManager = new EntityManager(this, this as EntityHost, this.entityRegistry)
		this.interaction = new InteractionSystem(this, this.entityManager, this.resourceSystem, this.entityRegistry)
		this.autonomy = new AutonomySystem(this, this.entityManager)
		this.worldEvents = new WorldEventSystem(this, this.entityManager, this.resourceSystem)

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

		installEventAccessor(this, `slowdown`)
		installEventAccessor(this, `hollowEvents`)
		installEventAccessor(this, `darkHollowEvents`)
		installEventAccessor(this, `surgeSpawnTimer`)

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
		this.hollowImage = new Image()
		this.hollowImage.src = `resources/images/hollowEvent.png`

		this.voidsculpture = false
		this.switchedplanes = false

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

		this.images = this.preloadImages()
		this.words = abstract_getWords()[this.language]
		this.initResources()
		this.initScreenSize()
		
		this.shop = new Shop(document.querySelector(`.shop`) as HTMLDivElement, this as ConstructorParameters<typeof Shop>[1])
		this.splash = new Splash(this as unknown as ConstructorParameters<typeof Splash>[0], homeScreenVariant)
		this.messenger = new Messenger(this as unknown as ConstructorParameters<typeof Messenger>[0])
		this.steamAchievements = preload?.steamAchievements
		this.achiever = new Achiever(this as unknown as ConstructorParameters<typeof Achiever>[0])
		this.explainer = new Explainer(this as ConstructorParameters<typeof Explainer>[0],localStorage.getItem(`abstractv03_helpIsNeeded${this.steamId}`))

		if (!this.hasSteam && steamWarningVisible) this.showSteamWarning()
		this.setListeners()

		this.updateLoop()
		this.clock = new Worker(new URL('../clock.ts', import.meta.url))
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
		this.creditImage.innerHTML = `<source src="resources/video/tst3.mp4" type="video/mp4">`
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
		return this.autonomy.getAutonomy()
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
				src: `resources/images/resources.png`,
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

	exportSaveToken(): string | undefined {
		return this.saves.assembleSave(true) as string | undefined
	}

	async loadSaveFromClipboard(): Promise<void> {
		return this.saves.loadSaveFromClipboard()
	}

	importSave(data: EncodedSave | undefined){
		return this.saves.importSave(data)
	}

	importSaveToken(token: string): boolean {
		const trimmed = token.trim()
		if (!trimmed) return false
		const state = this.saves.decodeSave(trimmed)
		if (!state) return false
		const encoded = this.saves.encodeSave(JSON.stringify(state))
		if (!encoded) return false
		this.saves.importSave(encoded)
		return true
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
		this.worldEvents.updateSlowdownEvent()
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
		this.worldEvents.createHollowEvent(color, time, sound, image)
	}

	createDarkHollowEvent(color = `#FFBB36`, time = 6000, sound: string | number | false = false, image = false){
		this.worldEvents.createDarkHollowEvent(color, time, sound, image)
	}

	updateHollowEvents(dt: number){
		this.worldEvents.updateHollowEvents(dt)
	}

	renderHollowEvents(){
		this.renderer.renderHollowEvents()
	}

	renderDarkHollowEvents(){
		this.renderer.renderDarkHollowEvents()
	}

	initiateSlowdown(t: number, m: number){
		this.worldEvents.initiateSlowdown(t, m)
	}

	updateSurge(dt: number){
		this.worldEvents.updateSurge(dt)
	}

	spawnSurge(type?: number){
		this.worldEvents.spawnSurge(type)
	}

}
