import type {
	EncodedSave,
	LoadableSaveState,
	SaveBackup,
	SaveHost,
	SaveSource,
	SaveStorage,
	SerializedEntity,
	SerializedEntityParams,
} from './types.js'
import { SaveCodec } from './SaveCodec.js'
import { LocalStorageSaveStorage } from './SaveStorage.js'
import type { GameEntity } from '../game/types.js'

export class SaveSystem {
	host: SaveHost
	storage: SaveStorage
	backups: SaveBackup[] = []
	preventSaving: boolean = false
	preventCloud: boolean = false

	constructor(host: SaveHost, storage: SaveStorage = new LocalStorageSaveStorage()){
		this.host = host
		this.storage = storage
	}

	getSaveKey(prefix: string = `abstractv03`): string {
		return `${prefix}${this.host.steamId}`
	}

	decodeSave(s: unknown): LoadableSaveState | 0 {
		return SaveCodec.decode(s)
	}

	encodeSave(s: string): EncodedSave | undefined {
		return SaveCodec.encode(s)
	}

	serializeEntity(e: GameEntity): SerializedEntity | undefined {
		return SaveCodec.serializeEntity(e)
	}

	assembleSave(backupless?: boolean): EncodedSave | undefined {
		return SaveCodec.assembleSave(this.host, this.backups, backupless)
	}

	initialLoad(save?: SaveSource){
		if (save){
			const cloud = this.decodeSave(save)
			const local = this.decodeSave(this.storage.getItem(this.getSaveKey(`abstractv03`)))

			const loadSuccess = this.loadSave((!local && cloud) || ((cloud as LoadableSaveState)?.timestamp as number) > ((local as LoadableSaveState)?.timestamp as number) ? cloud : local)
			if (!loadSuccess) {
				this.host.prepopulate()
				this.host.splash?.updateBackups()
			}
			this.host.cleanup()
		} else {
			const loadSuccess = this.loadSave()
			if (!loadSuccess) {
				this.host.prepopulate()
				this.host.splash?.updateBackups()
			}
			this.host.cleanup()
		}
	}

	loadSave( manual: LoadableSaveState | 0 = this.decodeSave(this.storage.getItem(this.getSaveKey(`abstractv03`))) ): boolean {
		if (!manual) return false

		try {
			//To make sure
			for (let i = 0; i < manual.resources.length; i++){
				if (manual.resources[i]) this.host.resources[i] = manual.resources[i]
			}

			this.host.onlyones = manual.onlyones || {}

			//Just to make sure
			for (let i in this.host.onlyones){
				if (!this.host.codex.entities[i]?.onlyone) delete this.host.onlyones[i]
			}

			this.host.updateEraserType(manual.eraserType || 0)

			if (manual.hollowHardness) this.host.hollowHardness = Math.min(64, manual.hollowHardness)
			if (manual.slowdown) this.host.slowdown = manual.slowdown
			if (manual.plane) {
				this.host.plane = manual.plane
				this.host.shop?.switchPlane(this.host.plane)
			}
			if (manual.switchedplanes) this.host.switchedplanes = manual.switchedplanes
			if (manual.bridge) this.host.bridge = manual.bridge
			if (manual.unlockedEntities) this.host.unlockedEntities = manual.unlockedEntities
			if (manual.needNoHelp) this.host.needNoHelp = true
			if (manual.messengerFiredEvents && manual.messengerShownMessages && manual.messengerShown !== undefined) {
				this.host.messenger?.setState(manual.messengerFiredEvents, manual.messengerShownMessages, manual.messengerShown)
			}
			if (manual.existed) {
				this.host.shop?.setExisted(manual.existed)
			}
			if (manual.glory) this.host.achiever?.setState(this.host.steamAchievements || manual.glory)
			if (manual.stats) {
				for (let i in manual.stats)
				(this.host.stats as unknown as Record<string, unknown>)[i] = (manual.stats as unknown as Record<string, unknown>)[i]
			}
			if (manual.backups) this.backups = manual.backups
			if (manual.existed?.pump2) this.host.stats.excavatorWasBuilt = true
			
			for (let i = 0; i < manual.stuff.length; i++){

				const s = manual.stuff[i]
				const entity = s.name === `cube` ? this.host.addEntity(s.name, s.position, {pump: false, resources: s.par.resources}) : s.name === `surge` ? this.host.addEntity(s.name, s.position, {resources: s.par.resources, rayNumber: s.par.rayNumber, grade: s.par.grade, colors: s.par.colors, type: s.par.type, maxLife: s.par.maxLife, life: s.par.life}) : this.host.addEntity(s.name, s.position, undefined, {skipShopUpdate: true})
				if (entity){
					try{
						for (let j in s.par){
							if ((s.par[j as keyof SerializedEntityParams] as unknown) !== `resources`) (entity as unknown as Record<string, unknown>)[j] = s.par[j as keyof SerializedEntityParams]
						}
					} catch(e){console.log(s)}

					entity.init()
				}

			}
			this.host.shop?.updateElements()
			this.host.splash?.updateBackups()

			return true
		} catch(e){

			alert(`Sorry, there is a problem with loading the game. Game saving won't be available and all the progress will be lost on quit.
				${e}`)
			this.preventCloud = true
			return false
		}
	}

	restoreBackup(n: number){
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
				data: save as EncodedSave
			})
			if (this.backups.length > 4) this.backups.pop()
			this.host.splash?.updateBackups()
		}
		setTimeout((_: unknown)=>{this.backupLoop()}, 240000)
	}

	saveLoop(){
		setTimeout((_: unknown)=>{this.saveLoop()}, 10000)
		this.saveGame()

		//UPDATES
		const payload = [
			{id: `HOURSINARUN`, value: Math.floor(this.host.stats.totalPlayTime / 1000 / 60 / 60) || 0 },
			{id: `DARKVISITS`, value: this.host.stats.darkVisited || 0},
			{id: `TOTALRESOURCECOUNT_K`, value: Math.min(Math.floor(this.host.stats.absoluteResourcesCount / 1e3), 64) || 0},
			{id: `TOTALRESOURCECOUNT_M`, value: Math.min(Math.floor(this.host.stats.absoluteResourcesCount / 1e6), 64) || 0},
			{id: `TOTALRESOURCECOUNT_B`, value: Math.min(Math.floor(this.host.stats.absoluteResourcesCount / 1e9), 64) || 0},
			{id: `TOTALCUBECLICKS`, value: this.host.stats.totalCubeClicks || 0},
			{id: `MACHINESBUILT`, value: this.host.stats.machinesBuild || 0},
			{id: `MACHINESSOLD`, value: this.host.stats.machinesSold || 0},
			{id: `VAULTS`, value: this.host.entitiesInGame?.vault || 0},
			{id: `ROCKPOKES`, value: this.host.stats.strangeRockPoked || 0},
			{id: `PUMPS`, value: this.host.entitiesInGame?.pump2 || 0},
			{id: `MAXDEPTH`, value: this.host.stats.maxDepth * 10 || 0},
			{id: `TIMESTELEPORTED`, value: this.host.stats.timesTeleported || 0}
		]
		this.host.spaceport?.send(`updateStat`, payload)
	}

	saveGame(){
		if (!this.preventSaving){
			this.storage.setItem(this.getSaveKey(`abstractv03_zoom`), String(this.host.zoom))
			const save = this.assembleSave()
			if (!this.preventCloud){
				this.storage.setItem(this.getSaveKey(`abstractv03`), save as string)
				this.host.spaceport?.send(`save`, save)
			}
		}
	}

	async exportSave(){
		if (!this.preventSaving){
			const save = this.assembleSave(true)
			await navigator.clipboard.writeText(save as string)
		}
	}

	async loadSaveFromClipboard(){
		const encoded = await navigator.clipboard.readText()
		const state = this.decodeSave(encoded)
		if (!state) return
		state.backups = this.backups
		const hope = this.encodeSave(JSON.stringify(state))
		this.importSave(hope)
	}

	importSave(data: EncodedSave | undefined){
		this.host.spaceport?.send(`save`, data)
		this.storage.setItem(this.getSaveKey(`abstractv03`), data as string)
		location.reload()
	}
}
