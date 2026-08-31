import { abstract_getWords } from './words.js'
import type { LanguageCode, LanguagePack } from './words.js'
import type { ColorTriplet, ResourceAmounts, Vec2 } from '../types/core.js'
import type { GameSpaceport } from '../types/platform.js'
import type { SaveBackup } from '../types/save.js'

type AchievementState = boolean | 0 | 1
type MessageEventState = boolean | null

interface AchievementDefinition {
	steamid: string
	src: string
	condition: (master: AchievementConditionHost) => unknown
}

interface MessageEventDefinition {
	condition: (master: MessageConditionHost) => unknown
	chain: number[]
	fired?: boolean
}

interface ResourceDefinition {
	triplet: ColorTriplet
}

interface EntityDefinition {
	price: number[]
	priceExponent?: number
	canPurchase?: boolean
	merge?: boolean
	isUpgradeTo?: string
	shouldUnlock?: (master: ShopUnlockHost) => unknown
}

interface AchievementConditionHost {
	resources: ResourceAmounts
	entitiesInGame: Record<string, number | undefined>
	stats: {
		darkVisited: number
		absoluteResourcesCount: number
		totalPlayTime: number
		totalCubeClicks: number
		machinesBuild: number
		machinesSold: number
		strangeRockPoked: number
		maxDepth: number
		timesTeleported: number
		timeSinceLastDelete: number
		excavatorWasBuilt: boolean
	}
	gameIsLocked?: boolean
	perpetum?: boolean
	pinhole?: unknown
	cookie?: unknown
	rbrtimeup?: boolean
	got64kmphAchievement?: boolean
}

interface MessageConditionHost {
	splash: { isShown: boolean }
	entitiesInGame: Record<string, number | undefined>
	stuff: Array<{ state?: number }>
	resources: ResourceAmounts
	stats: { maxDepth: number, timeEvents: number }
	plane: 0 | 1
	bridge: boolean
	preventSaving?: boolean
	lastDialogue?: boolean
}

interface ShopUnlockHost {
	resources: ResourceAmounts
	entitiesInGame: Record<string, number | undefined>
	chasm?: unknown
}

interface AchieverHost extends AchievementConditionHost {
	codex: { achievements: AchievementDefinition[] }
	words: Pick<LanguagePack, 'achievements'>
	splash: { updateGlory: () => void }
	updateSteamAchievement: (id: string, value: boolean) => void
}

interface MessengerHost extends MessageConditionHost {
	codex: {
		messages: {
			events: MessageEventDefinition[]
			origins: Array<0 | 1>
		}
	}
	words: Pick<LanguagePack, 'messages'>
}

interface SplashHost {
	isMute: boolean
	steamId: string | number
	words: LanguagePack
	version: string
	actx?: AudioContext
	preventSaving?: boolean
	spaceport: GameSpaceport
	languageId: number
	languages: LanguageCode[]
	codex: { achievements: AchievementDefinition[] }
	backups: SaveBackup[]
	achiever?: { fired: AchievementState[] }
	mute: (mute: boolean) => void
	initAudio: () => void
	updateGlobalVolume: (volume: number) => void
	exportSave: () => void | Promise<void>
	loadSaveFromClipboard: () => void | Promise<void>
	changeLanguage: (id: number) => void
	saveGame: () => unknown
	togglePhotofobia: () => void
	toggleChill: () => void
	restoreBackup: (id: number) => void
}

interface CloudHost {
	resources: ResourceAmounts
	codex: { resources: ResourceDefinition[] }
	eraserType: 0 | 1 | 2
	makeReadable: (value: number) => string | number
	getRealPrice: (name: string, selling?: boolean) => number[]
}

interface ShopHost extends ShopUnlockHost {
	pinhole?: unknown
	codex: { entities: Record<string, EntityDefinition> }
	words: LanguagePack
	unlockedEntities: Record<string, boolean | undefined>
	onlyones: Record<string, boolean | undefined>
	entitiesInGame: Record<string, number | undefined>
	eraserType: 0 | 1 | 2
	getRealPrice: (name: string, selling?: boolean) => number[]
	makeReadable: (value: number) => string | number
	pickupItem: (name: string) => void
	processMousemove: () => void
}

interface ExplainerHost {
	entitiesInGame: Record<string, number | undefined>
	messenger: { firedEvents: MessageEventState[] }
	resources: ResourceAmounts
	itemInHand?: unknown
	altActive?: boolean
	hoveredEntity?: unknown
	pressedQOnBlank?: boolean
	pressedQOnMachine?: boolean
	translation: Vec2
	splash: { isShown: boolean }
	words: Pick<LanguagePack, 'explainer'>
	steamId: string | number
}

interface AchievementQueueItem {
	id: number
	condition: AchievementDefinition['condition']
}

interface MessageQueueItem {
	timer: number
	element: HTMLDivElement
	id: number
}

interface SplashAchievementElements {
	cell: HTMLDivElement
	img: HTMLDivElement
	name: HTMLDivElement
	desc: HTMLDivElement
}

type CloudTextValue = string | number
type CloudCheck =
	| { element: HTMLDivElement, f: () => number, effect: 'width' }
	| { element: HTMLDivElement, f: () => unknown, effect: 'opacity' }
	| { element: HTMLDivElement, f: () => CloudTextValue, effect: 'text' }
	| { element: HTMLDivElement, f: () => string, effect: 'class' }

interface ShopItemParams {
	vessel: HTMLDivElement
	name: string
	description: string
	price: number[]
	priceExponent: number
	id: string
}

interface ShopItem {
	html: HTMLDivElement
	pack: HTMLDivElement | false
	priceHtml: HTMLDivElement
	price: number[]
	priceExponent: number
	name: string
	counter: HTMLDivElement
	existed: HTMLDivElement
	priceElements?: HTMLElement[]
}

interface TutorialStep {
	showIf: (master: ExplainerHost, timer: number) => unknown
	hideIf: (master: ExplainerHost, timer: number) => unknown
}

export class Achiever {
	declare master: AchieverHost
	declare data: AchievementDefinition[]
	declare element: HTMLDivElement
	declare fired: AchievementState[]
	declare queue: AchievementQueueItem[]

	constructor(master: AchieverHost){

		this.master = master
		this.data = this.master.codex.achievements

		this.element = document.createElement(`div`)
		this.element.classList.add(`glory_vessel`)
		document.body.append(this.element)

		this.setState()

	}

	fireAchievement(id: number){
		this.fired[id] = true

		const vessel = document.createElement(`div`)
		vessel.classList.add(`glory_item`)
		const image = document.createElement(`div`)
		image.classList.add(`glory_image`)
		const text = document.createElement(`div`)
		text.classList.add(`glory_text`)
		const name = document.createElement(`div`)
		name.classList.add(`glory_name`)
		const description = document.createElement(`div`)
		description.classList.add(`glory_description`)

		image.style.backgroundImage = `url(${this.data[id].src})`
		name.innerHTML = `<nobr>${this.master.words.achievements[id].name}</nobr>`
		description.innerHTML = `${this.master.words.achievements[id].description}`

		vessel.append(image)
		vessel.append(text)
		text.append(name)
		text.append(description)

		this.element.append(vessel)
		setTimeout((_event: unknown)=>{
			this.element.removeChild(vessel)
		},10000)

		this.master.splash.updateGlory()

		//STEAM
		this.master.updateSteamAchievement(this.data[id].steamid, true)

	}

	sneakAchievement(id: number){
		this.fired[id] = true
		this.master.splash.updateGlory()
	}

	setState(achievedList: AchievementState[] = new Array<AchievementState>(this.data.length).fill(false)){

		this.fired = achievedList
		this.queue = []
		this.element.innerHTML = ``

		for (let i = 0; i < this.data.length; i++){

			if (!this.fired[i]){

				this.queue.push({
					id: i,
					condition: this.data[i].condition
				})

			}

		}

		this.master.splash.updateGlory()

	}

	update(_dt: number){

		for (let i = 0; i < this.queue.length; i++){

			if (this.queue[i].condition(this.master)){

				this.fireAchievement(this.queue[i].id)
				this.queue.splice(i,1)
				i--

			}

		}

	}

}
export class Messenger {
	declare master: MessengerHost
	declare events: MessageEventDefinition[]
	declare origins: Array<0 | 1>
	declare element: HTMLDivElement
	declare chatIcon: HTMLDivElement
	declare chatCounter: HTMLDivElement
	declare messagesShown: 0 | 1
	declare unreadCounter: number
	declare shownMessages: number[]
	declare firedEvents: MessageEventState[]
	declare messageQueue: MessageQueueItem[]
	declare eventIdQueue: number[]

	constructor(master: MessengerHost){

		this.master = master
		// this.data = this.master.codex.messages
		this.events = this.master.codex.messages.events
		this.origins = this.master.codex.messages.origins

		this.element = document.createElement(`div`)
		this.element.classList.add(`messenger`)
		document.body.append(this.element)

		this.chatIcon = document.createElement(`div`)
		this.chatIcon.classList.add(`chatIcon`)
		document.body.append(this.chatIcon)
		this.chatCounter = document.createElement(`div`)
		this.chatCounter.classList.add(`counter`)
		this.chatIcon.append(this.chatCounter)

		this.chatIcon.onclick = _=>{
			if (this.messagesShown === 1){
				this.hideMessages()
			} else {
				this.showMessages()
			}
		}

		this.setState()

	}

	hideMessages(){

		this.messagesShown = 0
		this.element.classList.add(`collapsed`)

	}

	showMessages(){

		this.messagesShown = 1
		this.unreadCounter = 0
		this.chatCounter.style.display = `none`
		this.element.classList.remove(`collapsed`)

	}

	update(dt: number){

		for (let i = 0; i < this.eventIdQueue.length; i++){

			const e = this.events[this.eventIdQueue[i]]
			if (e.condition(this.master)){

				this.firedEvents[this.eventIdQueue[i]] = true
				this.initChain(e.chain)
				this.eventIdQueue.splice(i,1)
				i--

			}

		}


		const m = this.messageQueue[0]
		if (m){
			m.timer -= dt
			if (m.timer <= 0){

				this.element.append(m.element)
				setTimeout((_event: unknown)=>{m.element.classList.remove(`unpopped`)}, 10)
				this.messageQueue.shift()
				this.element.scrollTo({ top: this.element.scrollHeight, behavior: 'smooth' })
				if (!this.messagesShown) {
					this.unreadCounter++
					this.chatCounter.style.display = `block`
					this.chatCounter.innerHTML = String(this.unreadCounter)
				}

			}
		}

	}

	setState(fired: MessageEventState[] = [], list: number[] = [], shown: 0 | 1 = 1){

		this.shownMessages = list
		this.firedEvents = fired
		this.messageQueue = []
		this.eventIdQueue = []

		this.element.innerHTML = ``

		for (let i = 0; i < this.shownMessages.length; i++){
			// const message = this.data.list[this.shownMessages[i]]
			const wrap = document.createElement(`div`)
			wrap.classList.add(`bubblewrap`, this.origins[this.shownMessages[i]] ? `right` : `left`)
			const bubble = document.createElement(`div`)
			bubble.classList.add(`bubble`)
			// bubble.innerHTML = message.text[this.master.language]
			bubble.innerHTML = this.master.words.messages[this.shownMessages[i]]
			wrap.append(bubble)
			this.element.append(wrap)
		}

		for (let i = 0; i < this.events.length; i++){
			this.events[i].fired = this.firedEvents[i] || false
			if (!this.events[i].fired) {
				this.eventIdQueue.push(i)
			}
		}

		setTimeout((_event: unknown)=>{this.element.scrollTo({ top: this.element.scrollHeight, behavior: 'smooth' })}, 100)

		if (shown){
			this.showMessages()
		} else {
			this.hideMessages()
		}

	}

	initChain(chain: number[] = []){

		for (let i = 0; i < chain.length; i++){

			// const previous = this.data.list[chain[i-1]] || false
			// const message = this.data.list[chain[i]]
			const messageText = this.master.words.messages[chain[i]]
			const previousText = this.master.words.messages[chain[i-1]] || ``

			const wrap = document.createElement(`div`)
			wrap.classList.add(`bubblewrap`, this.origins[chain[i]] ? `right` : `left`, `unpopped`)
			const bubble = document.createElement(`div`)
			bubble.classList.add(`bubble`)
			// bubble.innerHTML = message.text[this.master.language]
			bubble.innerHTML = messageText
			wrap.append(bubble)

			this.shownMessages.push(chain[i])
			this.messageQueue.push({
				// timer: 900 + message.text[this.master.language].length * 50 + (previous ? previous.text[this.master.language].length * 50 : 0),
				timer: 900 + messageText.length * 50 + previousText.length * 50,
				element: wrap,
				id: chain[i]
			})

		}

	}

}

export class Splash {
	declare master: SplashHost
	declare gameIsMute: boolean
	declare isShown: boolean
	declare element: HTMLDivElement
	declare items: HTMLDivElement[]
	declare glory: HTMLDivElement
	declare selected: boolean
	declare selectedId: number
	declare texts: LanguagePack['splash']
	declare sf: HTMLDivElement
	declare playElement: HTMLDivElement
	declare muteElement: HTMLDivElement
	declare soundBar: HTMLDivElement
	declare soundSlider: HTMLDivElement
	declare resetProgressbar: HTMLDivElement
	declare chill: HTMLDivElement
	declare backupLabels: HTMLDivElement[]
	declare backupElements: HTMLDivElement[]
	declare gloryButton: HTMLDivElement
	declare deGloryButton: HTMLDivElement
	declare achievements: SplashAchievementElements[]
	declare words: LanguagePack | undefined

	constructor(master: SplashHost){
		this.master = master

		this.gameIsMute = this.master.isMute
		this.isShown = true

		this.element = document.createElement(`div`)
		this.element.classList.add(`splash`)
		this.items = []

		this.glory = document.createElement(`div`)
		this.glory.classList.add(`achievementSplash`)

		this.selected = false
		this.selectedId = 0

		this.init()
	}

	fireNotification(t: string, el: HTMLElement = this.element, up?: boolean, leftFlag?: boolean, time = 16000){

		const n = document.createElement(`div`)
		n.classList.add(`splashNotification`)
		if (leftFlag) n.classList.add(`leftFlag`)
		if (up) n.classList.add(`splashNotificationUp`)
		n.innerHTML = t
		el.append(n)
		setTimeout((_event: unknown)=>{n.remove()}, time)
		n.onanimationend = _=>{
			n.remove()
		}

	}

	selectItem(){
		this.selected = true
		this.items[this.selectedId].classList.add(`selected`)
	}
	selectPreviousItem(){
		if (this.items[this.selectedId - 1]){
			this.items[this.selectedId].classList.remove(`selected`)
			this.selectedId--
			this.items[this.selectedId].classList.add(`selected`)
		}
	}
	selectNextItem(){
		if (this.items[this.selectedId + 1]){
			this.items[this.selectedId].classList.remove(`selected`)
			this.selectedId++
			this.items[this.selectedId].classList.add(`selected`)
		}
	}
	deselectItem(){
		this.selected = false
	}

	setPhotofobia(v: boolean){

		if (v){
			this.element.classList.add(`photofobia`)
		} else {
			this.element.classList.remove(`photofobia`)
		}

	}

	show(){

		const rx = Math.floor(Math.random() * 4)
		const ry = Math.floor(Math.random() * 2)
		this.sf.style.backgroundPosition = `${100 / 3 * rx}% ${100 * ry}%`;

		this.isShown = true
		this.master.mute(true)
		document.body.appendChild(this.element)
		document.body.appendChild(this.glory)

	}
	close(){
		this.isShown = false
		if (!this.gameIsMute) this.master.mute(false)
		document.body.removeChild(this.element)
		document.body.removeChild(this.glory)
		this.deGloryButton.style.display = `none`
		this.playElement.innerHTML = this.texts.continue
		this.glory.style.left = `100%`
	}

	updateMute(mute: boolean){
		this.gameIsMute = mute
		this.muteElement.innerHTML = this.gameIsMute ? this.texts.soundoff : this.texts.soundon
		if (!this.gameIsMute) this.muteElement.append(this.soundBar)
		localStorage.setItem(`abstractv03_mute${this.master.steamId}`, String(this.gameIsMute))
	}

	init(o?: { selectedId?: number, selected?: boolean }){

		this.texts = this.master.words.splash

		this.element.innerHTML = ``
		this.glory.innerHTML = ``

		const headerBox = document.createElement(`div`)
		headerBox.classList.add(`headerBox`)
		headerBox.innerHTML = `SIXTY&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FOUR`//this.texts.sixtyfour
		this.element.append(headerBox)

		this.sf = document.createElement(`div`)
		this.sf.classList.add(`sixtyFour`)
		this.element.append(this.sf)

		const menu = document.createElement(`div`)
		menu.classList.add(`menu`)
		this.element.append(menu)

		this.playElement = document.createElement(`div`)
		this.playElement.classList.add(`menuItem`, `main`)
		this.playElement.innerHTML = localStorage.getItem(`abstractv03${this.master.steamId}`) ? this.texts.continue : this.texts.start
		menu.append(this.playElement)

		this.muteElement = document.createElement(`div`)
		this.muteElement.classList.add(`menuItem`, `muteButton`)
		this.muteElement.innerHTML = this.gameIsMute ? this.texts.soundoff : this.texts.soundon
		menu.append(this.muteElement)
		this.soundBar = document.createElement(`div`)
		this.soundBar.classList.add(`soundBar`)
		if (!this.gameIsMute) this.muteElement.append(this.soundBar)
		this.soundSlider = document.createElement(`div`)
		this.soundSlider.classList.add(`soundSlider`)
		this.soundBar.append(this.soundSlider)

		// const saveload = document.createElement(`div`)
		// saveload.style.position = `relative`
		// saveload.classList.add(`menuItem`, `nohover`)
		// const save = document.createElement(`span`)
		// save.classList.add(`subMenuItem`)
		// save.innerHTML = this.texts.save
		// const load = document.createElement(`span`)
		// load.classList.add(`subMenuItem`)
		// load.innerHTML = this.texts.load
		// const slash = document.createElement(`span`)
		// slash.innerHTML = ` / `
		// slash.style.color = `#CCC`
		// saveload.append(save)
		// saveload.append(slash)
		// saveload.append(load)
		// menu.append(saveload)

		const language = document.createElement(`div`)
		language.classList.add(`menuItem`)
		language.innerHTML = this.texts.language
		menu.append(language)

		const reset = document.createElement(`div`)
		// reset.style.position = `relative`
		this.resetProgressbar = document.createElement(`div`)
		this.resetProgressbar.classList.add(`resetProgressbar`)
		const resetText = document.createElement(`span`)
		resetText.innerText = this.texts.reset
		reset.classList.add(`menuItem`)
		reset.append(this.resetProgressbar)
		reset.append(resetText)
		menu.append(reset)

		const quit = document.createElement(`div`)
		quit.classList.add(`menuItem`)
		quit.innerHTML = this.texts.quit
		menu.append(quit)

		//EXIMP
		const exp = document.createElement(`span`)
		exp.classList.add(`hoverable`)
		exp.innerHTML = `[${this.texts.export}]&nbsp;`
		const imp = document.createElement(`span`)
		imp.classList.add(`hoverable`)
		imp.innerHTML = `[${this.texts.import}]`

		const credit = document.createElement(`div`)
		credit.classList.add(`credit`)
		credit.innerHTML = `<span>${this.texts.credit} ${this.master.version}</span> `//this.texts.credit + ` ` + this.master.version
		credit.append(exp)
		credit.append(imp)
		this.element.append(credit)

		const publisher = document.createElement(`div`)
		publisher.classList.add(`publisher`)
		this.element.append(publisher)

		const flashlight = document.createElement(`div`)
		flashlight.classList.add(`flashlight`)
		this.element.append(flashlight)

		this.chill = document.createElement(`div`)
		this.chill.classList.add(`chill`)
		this.element.append(this.chill)

		const fullscreen = document.createElement(`div`)
		fullscreen.classList.add(`fullscreen`)
		this.element.append(fullscreen)

		const discord = document.createElement(`div`)
		discord.classList.add(`discord`)
		this.element.append(discord)

		this.backupLabels = []
		this.backupElements = []
		const backupVessel = document.createElement(`div`)
		backupVessel.classList.add(`backupVessel`)
		this.element.append(backupVessel)
		for (let i = 0; i < 4; i++){

			const bel = document.createElement(`div`)
			bel.classList.add(`backupElement`)
			this.backupElements.push(bel)
			backupVessel.append(bel)

			const dot = document.createElement(`div`)
			dot.classList.add(`dot`)
			bel.append(dot)

			const blab = document.createElement(`div`)
			blab.classList.add(`backupLabel`)
			this.backupLabels.push(blab)
			bel.append(blab)

		}

		this.playElement.onclick = _=>{
			if (!this.master.actx && !this.gameIsMute) this.master.initAudio()
			this.close()
		}

		this.muteElement.onclick = _=>{
			this.updateMute(!this.gameIsMute)
		}

		this.soundBar.onmousedown = e=>{
			const v = e.offsetX / (e.target as HTMLElement).offsetWidth
			this.master.updateGlobalVolume(v)
		}
		this.soundBar.onmousemove = e=>{
			if (e.buttons){
				const v = e.offsetX / (e.target as HTMLElement).offsetWidth
				this.master.updateGlobalVolume(v)
			}
		}
		this.soundBar.onclick = e=>{
			e.stopPropagation()
		}

		reset.onmousedown = _=>{
			this.fireNotification(this.texts.warning, reset)
			// console.log(this.resetProgressbar)
			this.resetProgressbar.classList.add(`active`)
			this.resetProgressbar.onanimationend = _=>{
				this.master.preventSaving = true
				this.master.spaceport.send(`reset`, ``)
				localStorage.removeItem(`abstractv03${this.master.steamId}`)
				localStorage.removeItem(`abstractv03_helpIsNeeded${this.master.steamId}`)

				setTimeout((_event: unknown)=>{location.reload()},400)
			}
		}
		reset.onmouseup = _=>{
			this.resetProgressbar.onanimationend = null
			this.resetProgressbar.classList.remove(`active`)
		}
		reset.onmouseout = _=>{
			this.resetProgressbar.onanimationend = null
			this.resetProgressbar.classList.remove(`active`)
		}

		// save.onclick = _=>{
		// 	this.master.exportSave()
		// 	this.fireNotification(this.master.preventSaving ? this.words.random.toolate : this.master.words.random.paste, saveload)
		// }

		// load.onclick = _=>{
		// 	this.master.loadSaveFromClipboard()
		// }

		exp.onclick = _=>{
			this.master.exportSave()
			// Keep the legacy failure path when export is attempted after saving is disabled.
			this.fireNotification(this.master.preventSaving ? (this.words as LanguagePack).random.toolate : this.master.words.random.paste, exp, true)
		}
		imp.onclick = _=>{
			this.master.loadSaveFromClipboard()
		}

		language.onclick = _=>{
			this.master.changeLanguage((this.master.languageId + 1) % (this.master.languages.length))
		}

		quit.onclick = _=>{
			this.master.saveGame()
			this.master.spaceport.send(`quit`, ``)
		}

		flashlight.onclick = _=>{
			this.master.togglePhotofobia()
		}

		this.chill.onclick = _=>{
			this.master.toggleChill()
		}

		fullscreen.onclick = _=>{
			this.master.spaceport?.send(`toggleFullscreen`,``)
		}

		discord.onclick = _=>{
			this.master.spaceport?.send(`openDiscord`,``)
		}

		//Achievements
		this.gloryButton = document.createElement(`div`)
		this.gloryButton.classList.add(`gloryButton`)
		this.gloryButton.innerHTML = this.texts.glory
		this.element.append(this.gloryButton)

		this.deGloryButton = document.createElement(`div`)
		this.deGloryButton.classList.add(`gloryButton`)
		this.deGloryButton.innerHTML = this.texts.deglory
		this.deGloryButton.style.display = `none`
		this.glory.append(this.deGloryButton)

		this.gloryButton.onclick = _=>{
			this.glory.style.left = String(0)
			this.deGloryButton.style.display = `block`
		}

		this.deGloryButton.onclick = _=>{
			this.glory.style.left = `100%`
			this.deGloryButton.style.display = `none`
		}

		this.achievements = []

		for (let i = 0; i < this.master.codex.achievements.length; i++){

			const cell = document.createElement(`div`)
			cell.classList.add(`ablock`)
			cell.style.opacity = String(.3)
			this.glory.append(cell)

			const img = document.createElement(`div`)
			img.classList.add(`image`)
			img.style.backgroundImage = `url('resources/images/glory/blank.png')`
			cell.append(img)

			const name = document.createElement(`div`)
			name.classList.add(`name`)
			name.innerHTML = ``
			cell.append(name)

			const desc = document.createElement(`div`)
			desc.classList.add(`description`)
			desc.innerHTML = ``
			cell.append(desc)

			this.achievements.push({
				cell: cell,
				img: img,
				name: name,
				desc: desc
			})

		}

		this.updateGlory()

		this.items = [
			this.playElement,
			this.muteElement,
			// save,
			// load,
			language,
			reset,
			quit
		]

		if (o?.selectedId) this.selectedId = o.selectedId
		if (o?.selected) this.selectItem()

	}

	updateBackups(){

		for (let i = 0; i < 4; i++){

			
			if (this.master.backups[i]){

				this.backupElements[i].classList.remove(`disabled`)
				this.backupElements[i].onclick = _=>{
					this.master.restoreBackup(i)
				}

				const date = new Date(this.master.backups[i].timestamp)
				const dd = date.getDate()
				let mm = date.getMonth() + 1 + ``
				if (mm.length === 1) mm = `0` + mm
  				const hh = date.getHours()
  				let min = date.getMinutes() + ``
  				if (min.length === 1) min = `0` + min

				this.backupLabels[i].innerHTML = `<nobr>${this.texts.load.slice(0,1)+this.texts.load.slice(1).toLowerCase()} ${dd}.${mm}, ${hh}:${min}</nobr>`
			} else {

				this.backupElements[i].classList.add(`disabled`)
				this.backupElements[i].onclick = null

			}

		}

	}

	updateGlory(){

		for (let i = 0; i < this.achievements.length; i++){

			const a = this.achievements[i]
			if (this.master.achiever?.fired[i]){

				a.cell.style.opacity = String(1)
				a.img.style.backgroundImage = `url('${this.master.codex.achievements[i].src}')`
				a.name.innerHTML = this.master.words.achievements[i].name
				a.desc.innerHTML = this.master.words.achievements[i].description

			}

		}

	}
}

export class Cloud {
	declare master: CloudHost
	declare updatables: unknown[]
	declare element: HTMLDivElement
	declare resourceChecks: false | unknown[]
	declare checks: CloudCheck[]

	constructor(master: CloudHost){
		this.master = master
		this.updatables = []
		this.element = document.createElement(`div`)
		this.element.classList.add(`hintBubble`)
		this.resourceChecks = false
		this.checks = []
	}

	setDarkMode(){
		this.element.classList.add(`dark`)
	}

	addName(name: string){
		const el = document.createElement(`div`)
		el.classList.add(`entityName`)
		el.innerHTML = name
		this.element.append(el)
	}

	addDynamicText(check: (() => CloudTextValue) | false | null = (_value?: unknown)=>0){
		const el = document.createElement(`div`)
		el.classList.add(`hintDepth`)
		this.element.append(el)

		if (check){
			this.checks.push({
				element: el,
				f: check,
				effect: `text`
			})
		}
	}

	addDescription(d: string){
		const el = document.createElement(`div`)
		el.classList.add(`hintDescription`)
		el.innerHTML = d
		this.element.append(el)
	}

	addQEString(q: boolean, e: boolean){

		const el = document.createElement(`div`)
		el.classList.add(`hintQE`)

		if (q){
			const elq = document.createElement(`div`)
			elq.classList.add(`q`)
			el.append(elq)
		}

		if (e){
			const ele = document.createElement(`div`)
			ele.classList.add(`e`)
			el.append(ele)
		}

		this.element.append(el)

	}

	addLine(_d?: unknown){
		const el = document.createElement(`div`)
		el.classList.add(`hintLine`)
		this.element.append(el)
	}

	addProgress(check: (() => number) | false | null){
		const back = document.createElement(`div`)
		back.classList.add(`hintProgressBarBack`)
		const bar = document.createElement(`div`)
		bar.classList.add(`hintProgressBar`)
		back.append(bar)
		this.element.append(back)

		if (check){
			this.checks.push({
				element: bar,
				f: check,
				effect: `width`
			})
		}
	}
	addGradeAndProgress(grade: number, type: number, check: (() => number) | false | null){

		const wrap = document.createElement(`div`)
		wrap.classList.add(`gradeWrap`)
		this.element.append(wrap)

		const gradeHint = document.createElement(`div`)
		gradeHint.classList.add(`gradeHint`)
		// gradeHint.innerHTML = grade === 2 ? `<span><span style="transform:scale(1,.5)">▎</span><span style="transform:scale(1,.75)">▎</span><span style="transform:scale(1,1)">▎</span></span>` : grade === 1 ? `<span><span style="transform:scale(1,.5)">▎</span><span style="transform:scale(1,.75)">▎</span></span><span style="opacity:.2"><span style="transform:scale(1,1)">▎</span></span>` : `<span><span style="transform:scale(1,.5)">▎</span></span><span style="opacity:.2"><span style="transform:scale(1,.75)">▎</span><span style="transform:scale(1,1)">▎</span></span>`
		gradeHint.innerHTML = grade === 2 ? `<span>★★★</span>` : grade === 1 ? `<span>★★<span style="opacity:.2">★</span></span>` : `<span>★<span style="opacity:.2">★★</span></span>`
		const color = this.master.codex.resources[type].triplet[2]
		gradeHint.style.color = color
		wrap.append(gradeHint)

		const back = document.createElement(`div`)
		back.classList.add(`hintProgressBarBack`)
		const bar = document.createElement(`div`)
		bar.classList.add(`hintProgressBar`)
		back.append(bar)
		wrap.append(back)

		if (check){
			this.checks.push({
				element: bar,
				f: check,
				effect: `width`
			})
		}
	}

	addResourceList(r: number[]){

		this.resourceChecks = []

		const wrap = document.createElement(`div`)
		let empty = true

		for (let i = 0; i < r.length; i++){

			if (r[i]){
				empty = false
				const chunk = document.createElement(`div`)
				chunk.classList.add(`hintResourceChunk`)
				wrap.append(chunk)

				// this.resourceChecks.push({id: i, element: chunk, value: r[i]})
				this.checks.push({
					element: chunk,
					f: (_value?: unknown)=>this.master.resources[i]>=r[i],
					effect: `opacity`
				})

				const resourceIcon = document.createElement(`div`)
				resourceIcon.classList.add(`hintResourceIcon`, `r${i}`)
				chunk.append(resourceIcon)

				const resourceString = document.createElement(`div`)
				resourceString.classList.add(`hintResourceString`)
				chunk.append(resourceString)
				resourceString.innerHTML = String(this.master.makeReadable(Math.ceil(r[i])))//Math.ceil(r[i])

			}

		}

		if (!empty) this.element.append(wrap)

	}

	addConvertersOutput(r: number[], f: (() => number[] | false) = (_value?: unknown)=>false){

		this.resourceChecks = []

		const vessel = document.createElement(`div`)
		vessel.classList.add(`converterOutputVessel`)
		const wrap = document.createElement(`div`)
		wrap.classList.add(`converterInput`)
		const wrap2 = document.createElement(`div`)
		wrap2.classList.add(`converterOutput`)

		let empty = true

		for (let i = 0; i < r.length; i++){

			if (r[i]){
				empty = false
				const chunk = document.createElement(`div`)
				chunk.classList.add(`hintResourceChunk`)
				wrap.append(chunk)

				// this.resourceChecks.push({id: i, element: chunk, value: r[i]})
				this.checks.push({
					element: chunk,
					f: (_value?: unknown)=>this.master.resources[i]>=r[i],
					effect: `opacity`
				})

				const resourceIcon = document.createElement(`div`)
				resourceIcon.classList.add(`hintResourceIcon`, `r${i}`)
				chunk.append(resourceIcon)

				const resourceString = document.createElement(`div`)
				resourceString.classList.add(`hintResourceString`)
				chunk.append(resourceString)
				resourceString.innerHTML = String(this.master.makeReadable(Math.ceil(r[i])))//Math.ceil(r[i])

			}

		}

		const o = f()
		if (o){
			for (let i = 0; i < o.length; i++){

				if (o[i]){
					const chunk = document.createElement(`div`)
					chunk.classList.add(`hintResourceChunk`)
					wrap2.append(chunk)

					const resourceIcon = document.createElement(`div`)
					resourceIcon.classList.add(`hintResourceIcon`, `r${i}`)
					chunk.append(resourceIcon)

					const resourceString = document.createElement(`div`)
					resourceString.classList.add(`hintResourceString`)
					chunk.append(resourceString)
					resourceString.innerHTML = String(this.master.makeReadable(Math.ceil(r[i])))//Math.ceil(r[i])

					this.checks.push({
						element: resourceString,
						f: (_value?: unknown)=> this.master.makeReadable((f() as number[])[i]),
						effect: `text`
					})

				}

			}
		}

		vessel.append(wrap, wrap2)
		if (!empty) this.element.append(vessel)

	}

	addSellIcon(){

		const wrap = document.createElement(`div`)

		const chunk1 = document.createElement(`div`)
		chunk1.classList.add(`hintResourceChunk`, `ref1`)
		wrap.append(chunk1)

		const chunk2 = document.createElement(`div`)
		chunk2.classList.add(`hintResourceChunk`, `ref2`)
		wrap.append(chunk2)

		const chunk3 = document.createElement(`div`)
		chunk3.classList.add(`hintResourceChunk`, `ref3`)
		wrap.append(chunk3)

		this.checks.push({
			element: wrap,
			f: (_value?: unknown)=> this.master.eraserType === 2 ? `ref_hell` : this.master.eraserType === 1 ? `ref_beta` : `ref_qanetite`,
			effect: `class`
		})

		const resourceIcon1 = document.createElement(`div`)
		resourceIcon1.classList.add(`hintResourceIcon`, `r2`)
		chunk1.append(resourceIcon1)

		const resourceString1 = document.createElement(`div`)
		resourceString1.classList.add(`hintResourceString`)
		resourceString1.innerHTML = `1`
		chunk1.append(resourceString1)

		const resourceIcon2 = document.createElement(`div`)
		resourceIcon2.classList.add(`hintResourceIcon`, `r3`)
		chunk2.append(resourceIcon2)

		const resourceString2 = document.createElement(`div`)
		resourceString2.classList.add(`hintResourceString`)
		resourceString2.innerHTML = `1`
		chunk2.append(resourceString2)

		const resourceIcon3 = document.createElement(`div`)
		resourceIcon3.classList.add(`hintResourceIcon`, `r4`)
		chunk3.append(resourceIcon3)

		const resourceString3 = document.createElement(`div`)
		resourceString3.classList.add(`hintResourceString`)
		resourceString3.innerHTML = `1`
		chunk3.append(resourceString3)

		this.element.append(wrap)

	}

	addRefundList(name: string){

		const initPrice = this.master.getRealPrice(name, true)
		const wrap = document.createElement(`div`)
		let empty = true

		for (let i = 0; i < initPrice.length; i++){

			if (initPrice[i]){
				empty = false
				const chunk = document.createElement(`div`)
				chunk.classList.add(`hintResourceChunk`)
				wrap.append(chunk)

				const resourceIcon = document.createElement(`div`)
				resourceIcon.classList.add(`hintResourceIcon`, `r${i}`)
				chunk.append(resourceIcon)

				const resourceString = document.createElement(`div`)
				resourceString.classList.add(`hintResourceString`, `refund`)
				chunk.append(resourceString)
				resourceString.innerHTML = `+` + this.master.makeReadable(Math.floor(initPrice[i]))

				this.checks.push({
					element: resourceString,
					f: (_value?: unknown)=>{
						const p = this.master.getRealPrice(name, true)
						return `+` + this.master.makeReadable(Math.floor(p[i]))
					},
					effect: `text`
				})

			}

		}

		if (!empty) this.element.append(wrap)

	}

	update(){

		if (this.checks.length){
			for (let i = 0; i < this.checks.length; i++){

				const c = this.checks[i]

				if (c.effect === `width`){
					c.element.style.width = c.f() * 100 + `%`
				} else if (c.effect === `opacity`){
					c.element.style.opacity = c.f() ? String(1) : String(.3)
				} else if (c.effect === `text`){
					c.element.innerHTML = String(c.f())
				} else if (c.effect === `class`){
					c.element.className = c.f()
				}

			}
		}

	}

}

export class Shop {
	declare master: ShopHost
	declare vessel: HTMLDivElement
	declare selected: boolean
	declare selectedId: number
	declare shopToggle: HTMLDivElement
	declare gamePadHint: HTMLDivElement
	declare items: ShopItem[]
	declare darkitems: ShopItem[]
	declare existed: Record<string, boolean | undefined>

	constructor(container: HTMLDivElement, master: ShopHost){

		this.master = master
		this.vessel = container
		
		this.selected = false
		this.selectedId = 0

		//Minimized
		this.shopToggle = document.createElement(`div`)
		this.shopToggle.classList.add(`shopToggle`)
		document.body.appendChild(this.shopToggle)
		this.shopToggle.onclick = _=>{
			this.vessel.classList.toggle(`minimized`)
			this.shopToggle.classList.toggle(`toggled`)
		}

		//Gamepad
		this.gamePadHint = document.createElement(`div`)
		this.gamePadHint.classList.add(`shopGamepadHint`)
		document.body.append(this.gamePadHint)

		this.init()
		this.checkLoop()


	}

	centerItem(name: string){

		for (let i = 0; i < this.items.length; i++){
			if (name === this.items[i].name) {
				this.items[i].html.scrollIntoView({behavior: `smooth`, block: `center`})
			}
		}

	}

	selectItem(){

		if (!this.master.unlockedEntities[this.items[this.selectedId].name]){
			for (let i = 1; i < this.items.length; i++){
				if (this.master.unlockedEntities[this.items[i].name] && !this.items[i].html.classList.contains(`hidden`)){
					this.selectedId = i
					break
				}
			}
		}

		this.selected = true
		this.items[this.selectedId].html.classList.add(`selected`)
		this.items[this.selectedId].html.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"})

	}

	selectNextItem(){

		for (let i = this.selectedId + 1; i < this.items.length; i++){
			if (this.items[i]?.name && !this.items[i].html.classList.contains(`hidden`)){

				this.items[this.selectedId].html.classList.remove(`selected`)
				this.selectedId = i
				this.items[this.selectedId].html.classList.add(`selected`)
				this.items[this.selectedId].html.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"})
				break

			}
		}

	}

	selectPreviousItem(){

		for (let i = this.selectedId - 1; i >= 0; i--){
			if (this.items[i]?.name && !this.items[i].html.classList.contains(`hidden`)){

				this.items[this.selectedId].html.classList.remove(`selected`)
				this.selectedId = i
				this.items[this.selectedId].html.classList.add(`selected`)
				this.items[this.selectedId].html.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"})
				break

			}
		}

	}

	deselectItem(){
		this.selected = false
		this.items[this.selectedId].html.classList.remove(`selected`)
	}

	setExisted(v: Record<string, boolean | undefined>){
		this.existed = v
		this.updateElements()
	}

	init(){

		this.vessel.classList.remove(`darkShop`)
		this.items = []
		if (!this.existed){
			this.existed = {
				eraser: true,
				eraser2: true,
				eraser3: true
			}
		}
		this.darkitems = []
		this.vessel.innerHTML = ``
		this.shopToggle.style.display = this.master.pinhole ? `none` : `block`

		let pack: HTMLDivElement | false = false
		for (let i in this.master.codex.entities){
			const e = this.master.codex.entities[i]
			if (e.canPurchase){
				if (e.merge){

					if (!pack){
						pack = document.createElement(`div`)
						pack.classList.add(`shopPack`)
						this.vessel.append(pack)
					}

					this.addItem({
					vessel: pack,
					name: this.master.words?.entities[i]?.name || abstract_getWords().en?.entities[i]?.name,
					description: this.master.words?.entities[i]?.description || abstract_getWords().en?.entities[i]?.description,
					price: e.price,
					priceExponent: e.priceExponent || 1,
					id: i})
				} else {

					this.addItem({
					vessel: pack ? pack : this.vessel,
					name: this.master.words?.entities[i]?.name || abstract_getWords().en?.entities[i]?.name,
					description: this.master.words?.entities[i]?.description || abstract_getWords().en?.entities[i]?.description,
					price: e.price,
					priceExponent: e.priceExponent || 1,
					id: i})

					pack = false
				}
				
			}
		}

		this.updateElements()
	}

	initdark(){

		this.vessel.classList.add(`darkShop`)
		this.vessel.innerHTML = ``
		this.items = []
		this.darkitems = []
		this.shopToggle.style.display = `none`

	}

	switchPlane(p: number){

		if (p === 1) {
			this.initdark()
		} else {
			this.init()
		}

	} 

	checkLoop(){

		setTimeout((_event: unknown)=>{this.checkLoop()}, 100)
		this.check()

	}

	check(){

		if (this.master.resources[0]) this.gamePadHint.classList.add(`shopActive`)

		for (let i = 0; i < this.items.length; i++){

			let unlocked = this.master.unlockedEntities[this.items[i].name] || false
			if (!unlocked) {
				unlocked = (this.master.codex.entities[this.items[i].name].shouldUnlock && this.master.codex.entities[this.items[i].name].shouldUnlock!(this.master)) ? true : false
				if (unlocked) this.master.unlockedEntities[this.items[i].name] = true
			}
			
			let afford = true
			const matrix: number[] = []
			const price = this.master.getRealPrice(this.items[i].name)
			for (let j = 0; j < price.length; j++){
				if (price[j]){
					if (price[j] > this.master.resources[j]){
						afford = false
						matrix.push(0)
					} else {
						matrix.push(1)
					}
				}
			}

			if (afford){
				this.items[i].html.classList.remove(`disabled`)
			} else {
				this.items[i].html.classList.add(`disabled`)
				if (this.items[i].priceElements){

					for (let j = 0; j < this.items[i].priceElements!.length; j++){

						if (matrix[j]){
							this.items[i].priceElements![j].classList.add(`available`)
						} else {
							this.items[i].priceElements![j].classList.remove(`available`)
						}

					}

				}
			}

			if (unlocked) {
				this.items[i].html.classList.remove(`hidden`)
				if (this.items[i].pack) (this.items[i].pack as HTMLDivElement).classList.add(`visible`)
			}

			if (this.master.onlyones[this.items[i].name]){
				this.items[i].html.classList.add(`hidden`)
			}


			//ERASERS CHECK
			if (this.items[i].name === `eraser`){
				if (this.master.eraserType === 0 && this.master.unlockedEntities[this.items[i].name]){
					this.items[i].html.classList.remove(`hidden`)
				} else {
					this.items[i].html.classList.add(`hidden`)
				}
			}
			if (this.items[i].name === `eraser2`){
				if (this.master.eraserType === 1){
					this.items[i].html.classList.remove(`hidden`)
				} else {
					this.items[i].html.classList.add(`hidden`)
				}
			}
			if (this.items[i].name === `eraser3`){
				if (this.master.eraserType === 2){
					this.items[i].html.classList.remove(`hidden`)
				} else {
					this.items[i].html.classList.add(`hidden`)
				}
			}

		}
		// console.timeEnd(`shopUpdate`)
		// console.timeLog(`shopUpdate`)
	}

	addItem(params: ShopItemParams){

		const item = document.createElement(`div`)
		item.classList.add(`shopItem`, `hidden`)

		const imageVessel = document.createElement(`div`)
		imageVessel.classList.add(`imageVessel`)
		item.append(imageVessel)
		const image = document.createElement(`img`)
		image.src = `resources/images/shop/${params.id}.jpg`
		imageVessel.appendChild(image)

		const upgrade = this.master.codex.entities[params.id]?.isUpgradeTo
		if (upgrade && !(upgrade === `chasm` || upgrade === `hollow`)){
			const upBox = document.createElement(`div`)
			upBox.classList.add(`upgradeFrom`)
			upBox.style.backgroundImage = `url("resources/images/shop/${upgrade}.jpg")`
			imageVessel.appendChild(upBox)
		}

		const header = document.createElement(`div`)
		header.classList.add(`itemHeader`)
		header.innerText = params.name
		item.append(header)

		const description = document.createElement(`div`)
		description.classList.add(`itemDescription`)
		description.innerText = params.description
		item.append(description)

		const price = document.createElement(`div`)
		price.classList.add(`itemPrice`)
		item.append(price)

		const counter = document.createElement(`div`)
		counter.classList.add(`itemCounter`)
		item.append(counter)

		const existed = document.createElement(`div`)
		existed.classList.add(`existed`)
		existed.innerText = this.master.words.random.existed
		item.append(existed)

		params.vessel.append(item)

		item.onmousedown = _=>{
			this.master.pickupItem(params.id)
			this.master.processMousemove()
		}

		this.items.push({
			html: item,
			pack: params.vessel.classList.contains(`shopPack`) ? params.vessel : false, 
			priceHtml: price, 
			price: params.price, 
			priceExponent: params.priceExponent,
			name: params.id, 
			counter: counter,
			existed: existed
		})

	}

	updateElements(){
		for (let i = 0; i < this.items.length; i++){
			this.updatePrice(this.items[i])
			this.updateCounter(this.items[i])
			this.updateExisted(this.items[i])
		}
	}

	updateExisted(item: ShopItem){
		if (this.master.entitiesInGame[item.name]) this.existed[item.name] = true

		item.existed.style.display = this.existed[item.name] ? `none` : `block`
		if (this.existed[item.name]){
			item.html.classList.remove(`newItem`)
		} else {
			item.html.classList.add(`newItem`)
		}
	}

	updatePrice(item: ShopItem){

		// const quantity = (this.master.entitiesInGame[item.name] || 0)

		// let priceString = ``
		item.priceElements = []
		item.priceHtml.innerHTML = ``
		const realPrice = this.master.getRealPrice(item.name)

		for (let i = 0; i < item.price.length; i++){
			if (item.price[i]){

				const nobr = document.createElement(`nobr`)
				const rico = document.createElement(`div`)
				rico.classList.add(`rico`, `r${i}`)
				const string = document.createElement(`span`)
				string.className = `priceString`
				string.innerHTML = String(this.master.makeReadable( Math.ceil(realPrice[i]) ))

				nobr.append(rico, string)
				item.priceHtml.append(nobr)
				item.priceElements.push(nobr)


				// priceString += `<nobr><div class="rico r${i}" ></div><span class="priceString">${this.master.makeReadable( Math.ceil(item.price[i] * item.priceExponent ** quantity) )}</span></nobr>`
			}
		}

		// item.priceHtml.innerHTML = priceString

	}

	updateCounter(item: ShopItem){
		item.counter.innerHTML = String(this.master.entitiesInGame[item.name] || ``)
	}

}

export class Explainer {
	declare finished: true | undefined
	declare master: ExplainerHost
	declare stuff: TutorialStep[]
	declare next: number
	declare state: 0 | 1
	declare timer: number
	declare element: HTMLDivElement

	constructor(master: ExplainerHost, next: number | string | null = 0){

		if (+(next as number | string) === -1){
			this.finished = true
		}

		this.master = master

		this.stuff = [

			{
				showIf: (m,t)=>(t > 30000),
				hideIf: (m,t)=>(Number(m.entitiesInGame.cube) > 0)
			},
			{
				showIf: (m,t)=>(m.messenger.firedEvents[1] && t > 2000),
				hideIf: (m,t)=>(m.resources[0] > 0 && t > 10000)
			},
			{
				showIf: (m,t)=>(m.itemInHand),
				hideIf: (m,t)=>(!m.itemInHand)
			},
			{
				showIf: (m,t)=>(m.messenger.firedEvents[7] && t > 1000),
				hideIf: (m,t)=>(m.altActive && m.hoveredEntity)
			},
			{
				showIf: (m,t)=>(m.messenger.firedEvents[7]),
				hideIf: (m,t)=>(m.pressedQOnBlank)
			},
			{
				showIf: (m,t)=>(m.messenger.firedEvents[7]),
				hideIf: (m,t)=>(m.pressedQOnMachine)
			},
			{
				showIf: (m,t)=>(m.messenger.firedEvents[10]),
				hideIf: (m,t)=>(m.translation[0] || m.translation[1])
			}
		]
		this.next = +(next as number | string)
		this.state = 0 //0 not shown, 1 is shown
		this.timer = 0

		this.element = document.createElement(`div`)
		this.element.classList.add(`explainer`)
		document.body.append(this.element)

	}

	update(dt: number){

		if (!this.master.splash.isShown){

			const item = this.stuff[this.next]
			if (this.finished || !item) return

			if (!this.state){
				this.timer += dt
				if (item.showIf(this.master, this.timer)){

					this.element.innerHTML = this.master.words.explainer[this.next]
					this.timer = 0
					this.state = 1

				}
			}

			if (this.state) {
				this.timer += dt
				if (item.hideIf(this.master, this.timer)){

					this.element.innerHTML = ``
					this.next++
					this.state = 0
					this.timer = 0

					if (!this.stuff[this.next]){
						this.element.remove()
						this.finished = true
						localStorage.setItem(`abstractv03_helpIsNeeded${this.master.steamId}`, String(-1))
					} else {
						localStorage.setItem(`abstractv03_helpIsNeeded${this.master.steamId}`, String(this.next))
					}

				}
			}
		}

	}

}
