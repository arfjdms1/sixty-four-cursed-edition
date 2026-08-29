import type {
	EncodedSave,
	LoadableSaveState,
	SaveBackup,
	SaveHost,
	SerializedEntity,
	SerializedEntityParams,
} from './types.js'
import type { GameEntity } from '../game/types.js'

export class SaveCodec {
	static encode(s: string): EncodedSave | undefined {
		try {
			return btoa(s) as EncodedSave
		} catch {
			console.log(`I cant save because the designer of this game decided "Well, there is no weird characters in save, I'll just encode it and call it a day." Tell him to fix this shit.`)
		}
	}

	static decode(s: unknown): LoadableSaveState | 0 {
		try {
			const legacy = (s as string).substring(0,8) === `{"stuff"`
			const payload = legacy ? s as string : atob(s as string)
			return JSON.parse(payload) as LoadableSaveState
		} catch {
			console.log(`I cant load most brobably because you have something weird in your clipboard. Gimme a save!`)
			return 0
		}
	}

	static serializeEntity(e: GameEntity): SerializedEntity | undefined {
		if (!e.name || (e.name === `cube` && e.state !== 2)) return

		const par = {} as SerializedEntityParams
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
			par.grade = e.grade as 0 | 1 | 2
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

		return { name: e.name, position: e.position, par: par }
	}

	static assembleSave(host: SaveHost, backups: SaveBackup[] | undefined, backupless?: boolean): EncodedSave | undefined {
		const stuff: SerializedEntity[] = []
		for (let i = 0; i < host.stuff.length; i++){
			const serialized = SaveCodec.serializeEntity(host.stuff[i])
			if (serialized) stuff.push(serialized)
		}

		const string = JSON.stringify({
			stuff: stuff, 
			onlyones: host.onlyones, 
			resources: host.resources, 
			eraserType: host.eraserType,
			hollowHardness: host.hollowHardness,
			slowdown: host.slowdown,
			plane: host.plane,
			version: host.version,
			switchedplanes: host.switchedplanes,
			bridge: host.bridge,
			unlockedEntities: host.unlockedEntities,
			needNoHelp: host.needNoHelp,
			messengerShownMessages: host.messenger?.shownMessages,
			messengerFiredEvents: host.messenger?.firedEvents,
			messengerShown: host.messenger?.messagesShown,
			existed: host.shop?.existed,
			glory: host.achiever?.fired,
			stats: host.stats,
			timestamp: Date.now(),
			backups: backupless ? undefined : backups
		})

		return SaveCodec.encode(string)
	}
}
