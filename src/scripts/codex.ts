import type { ResourceAmounts } from '../types/core.js'
import { EntityRegistry } from './registry/EntityRegistry.js'
import { ResourceRegistry } from './registry/ResourceRegistry.js'
import type { ResourceMetadata } from './registry/resource-types.js'
import type { RuntimeEntityConstructor as EntityConstructor } from './registry/types.js'

export type { EntityConstructor }
export type { ResourceChance, ResourceProbability } from './registry/resource-types.js'

export interface CodexResource extends ResourceMetadata {}

export interface CodexConditionHost {
	resources: ResourceAmounts | number[]
	entitiesInGame: Record<string, number>
	stuff: Array<{ state?: number }>
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
		timeEvents: number
	}
	splash: { isShown: boolean }
	plane: 0 | 1
	bridge: boolean
	preventSaving?: boolean
	lastDialogue?: boolean
	gameIsLocked?: boolean
	perpetum?: boolean
	pinhole?: unknown
	cookie?: unknown
	rbrtimeup?: boolean
	got64kmphAchievement?: boolean
	chasm?: unknown
}

export interface CodexEntity {
	class?: EntityConstructor
	price: number[]
	priceExponent?: number
	canPurchase?: boolean
	isUpgradeTo?: string
	onlyone?: boolean
	affected?: Record<string, boolean>
	shouldUnlock?: (game: CodexConditionHost) => unknown
	merge?: boolean
}

export interface CodexMessageEvent {
	condition: (game: CodexConditionHost) => unknown
	chain: number[]
	fired?: boolean
}

export interface CodexAchievement {
	steamid: string
	src: string
	condition: (game: CodexConditionHost) => unknown
}

export interface CodexData {
	resources: CodexResource[]
	entities: Record<string, CodexEntity>
	messages: {
		origins: Array<0 | 1>
		events: CodexMessageEvent[]
	}
	achievements: CodexAchievement[]
	preload: string[]
}

export function abstract_getCodex(
	registry: EntityRegistry,
	resourceRegistry: ResourceRegistry,
): CodexData {
	const Cube = registry.getConstructor('cube')
	const resources = resourceRegistry.legacyDefinitions().map((definition, legacyIndex) => {
		if (definition.legacyIndex !== legacyIndex){
			throw new Error(`Missing legacy resource definition at index ${legacyIndex}`)
		}
		const { id: _id, legacyIndex: _legacyIndex, ...resource } = definition
		return resource
	})
	return {
	resources,
	entities: {
		pinhole: {
			class: registry.getConstructor('pinhole'),
			price: [64, 64, 64, 64, 64, 640000, 64e9, 64, 64, 64],
			priceExponent: 1,
			canPurchase: true,
			isUpgradeTo: `chasm`,
			onlyone: true,
			shouldUnlock: m=>m.entitiesInGame.gradient > 0
		},
		strange: {
			class: registry.getConstructor('strange'),
			price: [0],
			canPurchase: false
		},
		strange1: {
			class: registry.getConstructor('strange1'),
			price: [16384,16384,16384,16384,0,0,16384],
			onlyone: true,
			canPurchase: true,
			isUpgradeTo: `strange`,
			shouldUnlock: m=>m.resources[6] > 0
		},
		strange2: {
			class: registry.getConstructor('strange2'),
			price: [8388608,4194304,4194304,4194304,0,32768,262054,16,64],
			onlyone: true,
			canPurchase: true,
			isUpgradeTo: `strange1`,
			shouldUnlock: m=>m.resources[8] > 0 && m.entitiesInGame.strange1 > 0
		},
		strange3: {
			class: registry.getConstructor('strange3'),
			price: [0,0,0,0,2048,0,0,128,2048,2048],
			onlyone: true,
			canPurchase: true,
			isUpgradeTo: `strange2`,
			shouldUnlock: m=>m.resources[9] > 0 && m.entitiesInGame.strange2 > 0
		},
		voidsculpture: {
			class: registry.getConstructor('voidsculpture'),
			price: [0, 0, 0, 0, 0, 0, 0, 0, 1024],
			canPurchase: true,
			onlyone: true,
			shouldUnlock: m=>m.resources[8] > 0 && (m.entitiesInGame.strange2 > 0 || m.entitiesInGame.strange3 > 0)
		},
		gradient: {
			class: registry.getConstructor('gradient'),
			price: [8e7, 4e7, 4e7, 0, 0, 0, 0, 0, 2e4, 1e4],
			priceExponent: 1.2,
			canPurchase: true,
			affected: {conductor: true, silo2: true, destabilizer: true, destabilizer2: true, entropic: true, entropic2: true, entropic3: true},
			shouldUnlock: m=>m.chasm ? true : false
		},
		chasm: {
			class: registry.getConstructor('chasm'),
			price: [20000000,20000000,20000000,20000000,4000,20000,2000000,2000,2000,4000],
			priceExponent: 2,
			canPurchase: true,
			onlyone: true,
			affected: {conductor: true, silo2: true},
			shouldUnlock: m=>m.entitiesInGame.strange3 > 0
		},
		conductor: {
			class: registry.getConstructor('conductor'),
			price: [0,0,0,0,0,0,0,0,1,1],
			priceExponent: 1.06,
			canPurchase: true,
			affected: {conductor: true, silo2: true, gradient: true, chasm: true, generaldecay: true},
			shouldUnlock: m=>m.entitiesInGame.chasm > 0
		},
		vault: {
			class: registry.getConstructor('vault'),
			price: [0,131072,131072,1048576,0,32,131072,4],
			priceExponent: 3,
			canPurchase: true,
			shouldUnlock: m=>m.resources[7] > 0
		},
		pump: {
			class: registry.getConstructor('pump'),
			price: [0,0,256],
			priceExponent: 2,
			canPurchase: true,
			affected: {valve: true, auxpump: true, auxpump2: true, doublechannel: true, doublechannel2: true},
			shouldUnlock: m=>m.resources[2] > 0,
			merge: true
		},
		pump2: {
			class: registry.getConstructor('pump2'),
			price: [65536,0,0,0,128],
			priceExponent: 1.65,
			canPurchase: true,
			isUpgradeTo: `pump`,
			affected: {valve: true, auxpump: true, auxpump2: true, doublechannel: true, doublechannel2: true},
			shouldUnlock: m=>m.resources[4] > 0
		},
		cube: {
			class: registry.getConstructor('cube'),
			price: [0,0,0]
		},
		destabilizer: {
			class: registry.getConstructor('destabilizer'),
			price: [512,0,0],
			priceExponent: 1.1,
			canPurchase: true,
			affected: {silo: true, silo2: true, cube: true, gradient: true},
			shouldUnlock: m=>m.resources[0] > 0,
			merge: true
		},
		destabilizer2: {
			class: registry.getConstructor('destabilizer2'),
			price: [2048,128],
			priceExponent: 1.2,
			canPurchase: true,
			isUpgradeTo: `destabilizer`,
			affected: {silo: true, silo2: true, cube: true, gradient: true},
			shouldUnlock: m=>m.resources[1] > 0 && m.entitiesInGame.destabilizer > 0,
			merge: true
		},
		destabilizer2a: {
			class: registry.getConstructor('destabilizer2a'),
			price: [16384,256,128,4096,4],
			priceExponent: 1.2,
			canPurchase: true,
			isUpgradeTo: `destabilizer2`,
			affected: {silo: true, silo2: true, cube: true},
			shouldUnlock: m=>m.resources[4] > 0 && m.entitiesInGame.destabilizer2 > 0
		},
		injector: {
			class: registry.getConstructor('injector'),
			price: [16384,512,512,4096,32],
			priceExponent: 1.3,
			canPurchase: true,
			affected: {silo: true, silo2: true, cube: true},
			shouldUnlock: m=>m.resources[4] > 0
		},
		doublechannel: {
			class: registry.getConstructor('doublechannel'),
			priceExponent: 1.1,
			price: [1024,4],
			canPurchase: true,
			affected: {pump: true, pump2: true},
			shouldUnlock: m=>m.resources[1] > 0,
			merge: true
		},
		doublechannel2: {
			class: registry.getConstructor('doublechannel2'),
			price: [65536,2048,2048,0,0,128],
			priceExponent: 1.1,
			canPurchase: true,
			isUpgradeTo: `doublechannel`,
			affected: {pump: true, pump2: true},
			shouldUnlock: m=>m.resources[5] > 0 && m.entitiesInGame.doublechannel > 0
		},
		valve: {
			class: registry.getConstructor('valve'),
			price: [1024],
			priceExponent: 2,
			canPurchase: true,
			affected: {pump: true, pump2: true, silo: true, silo2: true},
			shouldUnlock: m=>m.resources[0] > 0,
			merge: true
		},
		auxpump: {
			class: registry.getConstructor('auxpump'),
			price: [2048,16],
			priceExponent: 2,
			canPurchase: true,
			isUpgradeTo: `valve`,
			affected: {pump: true, pump2: true, silo: true, silo2: true},
			shouldUnlock: m=>m.resources[1] > 0 && m.entitiesInGame.valve > 0,
			merge: true
		},
		auxpump2: {
			class: registry.getConstructor('auxpump2'),
			price: [8192,1024,512,1],
			priceExponent: 1.3,
			canPurchase: true,
			isUpgradeTo: `auxpump`,
			affected: {pump: true, pump2: true, silo: true, silo2: true},
			shouldUnlock: m=>m.resources[3] > 0 && m.entitiesInGame.auxpump > 0
		},
		entropic: {
			class: registry.getConstructor('entropic'),
			price: [2048,64,1],
			priceExponent: 1.1,
			canPurchase: true,
			affected: {cube: true, gradient: true, silo: true, silo2: true},
			shouldUnlock: m=>m.resources[2] > 0,
			merge: true
		},
		entropic2: {
			class: registry.getConstructor('entropic2'),
			price: [32768,0,1024,0,0,64],
			priceExponent: 1.2,
			canPurchase: true,
			isUpgradeTo: `entropic`,
			affected: {cube: true, gradient: true, silo: true, silo2: true},
			shouldUnlock: m=>m.resources[5] > 0 && m.entitiesInGame.entropic > 0,
			merge: true
		},
		entropic2a: {
			class: registry.getConstructor('entropic2a'),
			price: [32768,1024,1024,0,0,128],
			priceExponent: 1.2,
			canPurchase: true,
			isUpgradeTo: `entropic`,
			affected: {cube: true, silo: true, silo2: true},
			shouldUnlock: m=>m.resources[5] > 0 && m.entitiesInGame.entropic > 0,
			merge: true
		},
		entropic3: {
			class: registry.getConstructor('entropic3'),
			price: [524288,0,0,0,0,8192,16384,4,64],
			priceExponent: 1.3,
			canPurchase: true,
			isUpgradeTo: `entropic2`,
			affected: {cube: true, gradient: true, silo: true, silo2: true},
			shouldUnlock: m=>m.resources[8] > 0
		},
		converter32: {
			class: registry.getConstructor('converter32'),
			price: [2048,0,8],
			priceExponent: 1.2,
			canPurchase: true,
			affected: {silo: true, silo2: true, preheater: true},
			shouldUnlock: m=>m.resources[2] > 0,
			merge: true
		},
		converter13: {
			class: registry.getConstructor('converter13'),
			price: [4096,128,0,16],
			priceExponent: 1.1,
			canPurchase: true,
			affected: {silo: true, silo2: true, preheater: true},
			shouldUnlock: m=>m.resources[3] > 0 && m.entitiesInGame.converter32 > 0,
			merge: true
		},
		converter41: {
			class: registry.getConstructor('converter41'),
			price: [128,128,128,4096],
			priceExponent: 1.1,
			canPurchase: true,
			affected: {silo: true, silo2: true, preheater: true},
			shouldUnlock: m=>m.resources[3] > 0 && m.entitiesInGame.converter13 > 0,
			merge: true
		},
		converter76: {
			class: registry.getConstructor('converter76'),
			price: [262144,0,0,0,128,256,65536],
			priceExponent: 1.5,
			canPurchase: true,
			affected: {silo: true, silo2: true, preheater: true},
			shouldUnlock: m=>m.resources[6] > 0 && m.entitiesInGame.converter41 > 0,
			merge: true
		},
		converter64: {
			class: registry.getConstructor('converter64'),
			price: [1048576,0,0,524288,256,4096,131027],
			priceExponent: 1.3,
			canPurchase: true,
			affected: {silo: true, silo2: true, preheater: true, reflector: true},
			shouldUnlock: m=>m.entitiesInGame.converter76 > 0,
			merge: true
		},
		reflector: {
			class: registry.getConstructor('reflector'),
			price: [0,0,0,524288,0,2048,8192],
			priceExponent: 1.1,
			canPurchase: true,
			affected: {converter64: true},
			shouldUnlock: m=>m.entitiesInGame.converter64 > 0,
			merge: true
		},
		preheater: {
			class: registry.getConstructor('preheater'),
			price: [524288, 16384, 32768, 524288, 256, 2048, 32768],
			priceExponent: 1.1,
			canPurchase: true,
			affected: {silo: true, silo2: true, converter32: true, converter13: true, converter41: true, converter76: true, converter64: true},
			shouldUnlock: m=>m.resources[6] > 0
		},
		mega1: {
			class: registry.getConstructor('mega1'),
			price: [32768,512,512,32768],
			canPurchase: true,
			onlyone: true,
			shouldUnlock: m=>m.resources[3] > 0
		},
		mega1a: {
			class: registry.getConstructor('mega1a'),
			price: [524288,2048,2048,131027,256],
			canPurchase: true,
			isUpgradeTo: `mega1`,
			onlyone: true,
			shouldUnlock: m=>m.resources[4] > 0 && m.entitiesInGame.mega1 > 0
		},
		mega1b: {
			class: registry.getConstructor('mega1b'),
			price: [2097152,16384,16384,524288,256,128,64],
			canPurchase: true,
			isUpgradeTo: `mega1a`,
			onlyone: true,
			shouldUnlock: m=>m.resources[6] > 0 && m.entitiesInGame.mega1a > 0
		},
		mega2: {
			class: registry.getConstructor('mega2'),
			price: [4096,128,128,32],
			canPurchase: true,
			onlyone: true,
			shouldUnlock: m=>m.resources[3] > 0
		},
		mega3: {
			class: registry.getConstructor('mega3'),
			price: [131027,2048,2048,65536,64],
			canPurchase: true,
			isUpgradeTo: `mega2`,
			onlyone: true,
			shouldUnlock: m=>m.resources[4] > 0 && m.entitiesInGame.mega2 > 0
		},
		eye: {
			class: registry.getConstructor('eye'),
			price: [65536,512,1024,16385,16],
			canPurchase: true,
			onlyone: true,
			shouldUnlock: m=>m.resources[4] > 0
		},
		cookie: {
			class: registry.getConstructor('cookie'),
			price: [1],
			canPurchase: false
		},
		silo: {
			class: registry.getConstructor('silo'),
			price: [32768, 0, 0, 0, 64],
			priceExponent: 1.1,
			canPurchase: true,
			affected: {destabilizer: true, destabilizer2: true, destabilizer2a: true, valve: true, auxpump: true, auxpump2: true, entropic: true, entropic2: true, entropic2a: true, entropic3: true, converter32: true, converter13: true, converter41: true, converter76: true, converter64: true, injector: true, vessel: true, vessel2: true, consumer: true, preheater: true, annihilator: true},
			shouldUnlock: m=>m.resources[4] > 0,
			merge: true
		},
		silo2: {
			class: registry.getConstructor('silo2'),
			price: [524288, 0, 0, 0, 64, 32, 128],
			priceExponent: 1.1,
			canPurchase: true,
			isUpgradeTo: `silo`,
			affected: {gradient: true, chasm: true, conductor: true, destabilizer: true, destabilizer2: true, destabilizer2a: true, valve: true, auxpump: true, auxpump2: true, entropic: true, entropic2: true, entropic2a: true, entropic3: true, converter32: true, converter13: true, converter41: true, converter76: true, converter64: true, injector: true, vessel: true, vessel2: true, consumer: true, preheater: true, annihilator: true},
			shouldUnlock: m=>m.resources[6] > 0 && m.entitiesInGame.silo > 0
		},
		vessel: {
			class: registry.getConstructor('vessel'),
			price: [65513, 2048, 1024, 0, 0, 16],
			priceExponent: 1.3,
			canPurchase: true,
			affected: {silo: true, silo2: true},
			shouldUnlock: m=>m.resources[5] > 0,
			merge: true
		},
		vessel2: {
			class: registry.getConstructor('vessel2'),
			price: [268435456, 134217728, 134217728, 0, 0, 16384, 0, 0, 0, 4096],
			priceExponent: 1.3,
			canPurchase: true,
			isUpgradeTo: `vessel`,
			affected: {silo: true, silo2: true},
			shouldUnlock: m=>m.chasm ? true : false
		},
		consumer: {
			class: registry.getConstructor('consumer'),
			price: [131027, 1024, 8192, 131027, 32, 256],
			priceExponent: 1.2,
			canPurchase: true,
			affected: {silo: true, silo2: true, cube: true},
			shouldUnlock: m=>m.resources[5] > 0
		},
		hollow: {
			class: registry.getConstructor('hollow'),
			price: [0],
			canPurchase: false
		},
		generaldecay: {
			class: registry.getConstructor('generaldecay'),
			price: [0,524288,524288,0,0,0,1048576],
			canPurchase: true,
			onlyone: true,
			affected: {conductor: true},
			shouldUnlock: m=>m.resources[6] > 0
		},
		waypoint: {
			class: registry.getConstructor('waypoint'),
			price: [524288,0,262054,262054,0,0,0,8],
			priceExponent: 2,
			canPurchase: true,
			shouldUnlock: m=>m.resources[7] > 0
		},
		annihilator: {
			class: registry.getConstructor('annihilator'),
			price: [8388608,524288,1048576,256,2048,16384,0,32],
			priceExponent: 1.2,
			canPurchase: true,
			affected: {silo: true, silo2: true},
			shouldUnlock: m=>m.resources[7] > 0
		},
		flower: {
			class: registry.getConstructor('flower'),
			price: [0,0,0,0,0,0,0,1,8],
			priceExponent: 1.2,
			canPurchase: true,
			isUpgradeTo: `hollow`,
			shouldUnlock: m=>m.resources[8] > 0,
			merge: true
		},
		fruit: {
			class: registry.getConstructor('fruit'),
			price: [0,0,0,0,0,0,0,16,256,512],
			priceExponent: 1.1,
			canPurchase: true,
			isUpgradeTo: `flower`,
			shouldUnlock: m=>m.resources[9] > 0 && m.entitiesInGame.flower > 0
		},
		clicker1: {
			class: registry.getConstructor('clicker1'),
			price: [2048,64,128],
			canPurchase: true,
			onlyone: true,
			shouldUnlock: m=>m.entitiesInGame.entropic > 0,
			merge: true
		},
		clicker2: {
			class: registry.getConstructor('clicker2'),
			price: [0,0,4096,32768,128],
			canPurchase: true,
			onlyone: true,
			isUpgradeTo: `clicker1`,
			shouldUnlock: m=>m.resources[4] > 0 && m.entitiesInGame.clicker1 > 0,
			merge: true
		},
		clicker3: {
			class: registry.getConstructor('clicker3'),
			price: [0,0,0,0,0,2048],
			canPurchase: true,
			onlyone: true,
			isUpgradeTo: `clicker2`,
			shouldUnlock: m=>m.resources[5] > 0 && m.entitiesInGame.clicker2 > 0
		},
		stabilizer: {
			class: registry.getConstructor('stabilizer'),
			price: [64,1024],
			priceExponent: 8,
			shouldUnlock: m=>m.entitiesInGame.surge > 0 && m.resources[1] > 0,
			canPurchase: true,
			merge: true
		},
		stabilizer2: {
			class: registry.getConstructor('stabilizer2'),
			price: [64,1024,1024,8192,48,128],
			priceExponent: 8,
			isUpgradeTo: `stabilizer`,
			shouldUnlock: m=>m.entitiesInGame.stabilizer > 0 && m.resources[5] > 0,
			canPurchase: true
		},
		stabilizer3: {
			class: registry.getConstructor('stabilizer3'),
			price: [64,1024,1024,8192,48,128],
			canPurchase: false
		},
		eraser: {
			price: [0,0,1],
			canPurchase: true,
			shouldUnlock: m=>m.resources[2] > 0
		},
		eraser2: {
			price: [0,0,0,1],
			canPurchase: true,
			shouldUnlock: m=>m.resources[3] > 0
		},
		eraser3: {
			price: [0,0,0,0,1],
			canPurchase: true,
			shouldUnlock: m=>m.resources[4] > 0
		},
		surge: {
			class: registry.getConstructor('surge'),
			price: [1],
			canPurchase: false
		}
	},
	messages: {
		origins: [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1,0,0,0,0,1,0,1,0,1,1,0,1,0,0,0,0,1,0,1,0,1,0,0,0,1,0,1,0,1,1,1,0,1,0,1,1,0,1,1,1,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1,0,1,0,1,1,1,0,1,0,1,0,1,1,0,1,0,1,0,1,1,1,0,1,0,1,1,0,1,0,1,0,1,0,1,0,1,0,0,0,1,0,0,1,0,1,0,1,0,0,1,0,0,0,0,1,0,1,0,1,0,1,1,0,1,0,1,1,0,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1,0,1,1,0,1,0,1,1,1,1,1,1,1,1,1,0,0,1,0,1,0,1,0,1,1,1,0,1,0,1,0,1,0,0,0,0,0,1,0,0,1,1,0,1,0,1,0,1,1,0,1,0,1,0,1,1,0,1,0,1,0,1,1,1,0,1,0,1,0,0,0,1],
		events: [
			{
				condition: m=>!m.splash.isShown,
				chain: [0,1,2,3,4,5,6]
			},
			{
				condition: m=>{
					if (m.entitiesInGame.cube < 1) return false
					for (let i = 0; i < m.stuff.length; i++){
						if (Cube && m.stuff[i] instanceof Cube && m.stuff[i].state === 2) return true
					}
					return false
				},
				chain: [7,8,9,10]
			},
			{
				condition: m=>m.resources[0],
				chain: [11,12]
			},
			{
				condition: m=>m.resources[1],
				chain: [13,14]
			},
			{
				condition: m=>m.resources[0] >= 512,
				chain: [15,16]
			},
			{
				condition: m=>m.entitiesInGame.destabilizer,
				chain: [17,18,19,20,21]
			},
			{
				condition: m=>m.resources[0] >= 1024 && m.resources[1] >= 4,
				chain: [22,23]
			},
			{
				condition: m=>m.resources[2] > 0,
				chain: [24,25,26,27,28,29,30,31,32,33]
			},
			{
				condition: m=>m.resources[2] > 256,
				chain: [34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59]
			},
			{
				condition: m=>m.resources[3] > 0,
				chain: [60,61,62,63,64,65,66,67,68,69,70,71,72,73]
			},
			{
				condition: m=>m.resources[3] > 16,
				chain: [74,75,76,77,78,79,80,81,82,83]
			},
			{
				condition: m=>m.resources[3] > 1569,
				chain: [84,85,86,87,88,89,90,91,92,93,94,95]
			},
			{
				condition: m=>m.resources[4] > 0,
				chain: [96,97,98,99,100]
			},
			{
				condition: m=>m.entitiesInGame.destabilizer2a > 0,
				chain: [101,102]
			},
			{
				condition: m=>m.resources[4] > 96,
				chain: [103,104,105,106,107,108,109,110,111,112,113]
			},
			{
				condition: m=>m.resources[5] > 8,
				chain: [114,115]
			},
			{
				condition: m=>m.resources[5] > 100,
				chain: [116,117,118,119,120,121,122,123,124,125,126,127,128,129]
			},
			{
				condition: m=>m.stats.maxDepth > 1650,
				chain: [130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146]
			},
			{
				condition: m=>m.resources[6] > 1024,
				chain: [147,148,149,150,151,152,153,154,155,156]
			},
			{
				condition: m=>m.entitiesInGame.strange1 > 0,
				chain: [157,158,159,160,161,162,163,164,165]
			},
			{
				condition: m=>m.entitiesInGame.hollow > 0,
				chain: [172,173,174]
			},
			{
				condition: m=>m.resources[7] > 0,
				chain: [166,167,168]
			},
			{
				condition: m=>m.stats.timeEvents > 0,
				chain: [169,170,171]
			},
			{
				condition: m=>m.resources[8] > 0,
				chain: [175,176,177,178]
			},
			{
				condition: m=>m.entitiesInGame.flower > 0,
				chain: [179,180,181,182]
			},
			{
				condition: m=>m.entitiesInGame.strange2 > 0,
				chain: [183,184,185,186]
			},
			{
				condition: m=>m.resources[8] > 1000,
				chain: [187,188,189]
			},
			{
				condition: m=>m.entitiesInGame.voidsculpture > 0,
				chain: [190,191,192,193,194,195,196,197]
			},
			{
				condition: m=>m.plane === 1,
				chain: [198,199,200,201]
			},
			{
				condition: m=>m.resources[9] > 400,
				chain: [202,203,204]
			},
			{
				condition: m=>m.bridge && !m.plane,
				chain: [205,206,207,208,209,210,211,212,213,214]
			},
			{
				condition: m=>m.entitiesInGame.strange3 > 0,
				chain: [215,216,217,218,219,220,221,222]
			},
			{
				condition: m=>m.entitiesInGame.conductor > 0,
				chain: [223,224,225,226,227,228,229,230,231,232,233]
			},
			{
				condition: m=>m.entitiesInGame.gradient > 0,
				chain: [234,235,236,237,238]
			},
			{
				condition: m=>m.entitiesInGame.gradient > 1,
				chain: [239,240,241,242,243,244]
			},
			{
				condition: m=>m.entitiesInGame.pinhole > 0,
				chain: [245,246,247,248,249,250,251,252]
			},
			{
				condition: m=>m.preventSaving && m.stuff.length < 4,
				chain: [253]
			},
			{
				condition: m=>m.lastDialogue,
				chain: [0,1,2,254,255,256,257,258,259,260,261,262]
			}
		]
	},
	achievements: [
		{	
			steamid: `FOOLSGOLD`,
			src: `resources/images/glory/stone2.png`,
			condition: m=>m.resources[1] > 0
		},
		{
			steamid: `DEEPPURPLE`,
			src: `resources/images/glory/stone3.png`,
			condition: m=>m.resources[2] > 0
		},
		{
			steamid: `BLOODOFTHELAND`,
			src: `resources/images/glory/stone4.png`,
			condition: m=>m.resources[3] > 0
		},
		{
			steamid: `GREENENERGY`,
			src: `resources/images/glory/stone5.png`,
			condition: m=>m.resources[4] > 0
		},
		{
			steamid: `HOTGLASS`,
			src: `resources/images/glory/stone6.png`,
			condition: m=>m.resources[5] > 0
		},
		{
			steamid: `HOLYCONCRETE`,
			src: `resources/images/glory/stone7.png`,
			condition: m=>m.resources[6] > 0
		},
		{
			steamid: `CANITDODISHES`,
			src: `resources/images/glory/stone8.png`,
			condition: m=>m.resources[7] > 0
		},
		{
			steamid: `WHERETHESUNDOESNTSHINE`,
			src: `resources/images/glory/stone9.png`,
			condition: m=>m.resources[8] > 0
		},
		{
			steamid: `WHOYOUGONNACALL`,
			src: `resources/images/glory/stone10.png`,
			condition: m=>m.resources[9] > 0
		},
		{
			steamid: `NIETZSCHE`,
			src: `resources/images/glory/n.png`,
			condition: m=>m.stats.darkVisited >= 64
		},
		{
			steamid: `64K`,
			src: `resources/images/glory/k.png`,
			condition: m=>m.stats.absoluteResourcesCount >= 64000
		},
		{
			steamid: `64M`,
			src: `resources/images/glory/m.png`,
			condition: m=>m.stats.absoluteResourcesCount >= 64000000
		},
		{
			steamid: `64B`,
			src: `resources/images/glory/b.png`,
			condition: m=>m.stats.absoluteResourcesCount >= 64000000000
		},
		{
			steamid: `YOUMAYRESETNOW`,
			src: `resources/images/glory/r.png`,
			condition: m=>m.gameIsLocked
		},
		{
			steamid: `PERPETUMSHMOBILE`,
			src: `resources/images/glory/pm.png`,
			condition: m=>m.perpetum
		},
		{
			steamid: `NEEDABREAK`,
			src: `resources/images/glory/t.png`,
			condition: m=>m.stats.totalPlayTime > 230400000
		},
		{
			steamid: `MUSTDESTROY`,
			src: `resources/images/glory/c.png`,
			condition: m=>m.stats.totalCubeClicks >= 6400
		},
		{
			steamid: `ARCHITECT`,
			src: `resources/images/glory/build.png`,
			condition: m=>m.stats.machinesBuild >= 64
		},
		{
			steamid: `DESTROYER`,
			src: `resources/images/glory/sold.png`,
			condition: m=>m.stats.machinesSold >= 64
		},
		{
			steamid: `HELLRAISER`,
			src: `resources/images/glory/h.png`,
			condition: m=>m.entitiesInGame.vault >= 9
		},
		{
			steamid: `ENDBEGINNING`,
			src: `resources/images/glory/end.png`,
			condition: m=>m.pinhole
		},
		{
			steamid: `COOKIECLICKER`,
			src: `resources/images/glory/cookie.png`,
			condition: m=>m.cookie
		},
		{
			steamid: `DRUNKENSAILOR`,
			src: `resources/images/glory/honk.png`,
			condition: m=>m.stats.strangeRockPoked >= 64
		},
		{
			steamid: `MRMINE`,
			src: `resources/images/glory/mine.png`,
			condition: m=>m.entitiesInGame.pump2 >= 9
		},
		{
			steamid: `ISTHEREALIMIT`,
			src: `resources/images/glory/d04.png`,
			condition: m=>m.stats.maxDepth >= 6400
		},
		{
			steamid: `SETHBRUNDLE`,
			src: `resources/images/glory/tp.png`,
			condition: m=>m.stats.timesTeleported >= 64
		},
		{
			steamid: `REDBLUEROCK`,
			src: `resources/images/glory/rb.png`,
			condition: m=>m.pinhole && !m.rbrtimeup && m.stats.timeSinceLastDelete >= 900000 && m.entitiesInGame.vessel2 < 15
		},
		{
			steamid: `STRAIGHTTOHELL`,
			src: `resources/images/glory/tohell.png`,
			condition: m=>m.stats.totalPlayTime < 3840000 && m.resources[4] > 0
		},
		{
			steamid: `SCRATCHTHESURFACE`,
			src: `resources/images/glory/d01.png`,
			condition: m=>m.stats.maxDepth >= 6.4
		},
		{
			steamid: `ISITHOT`,
			src: `resources/images/glory/d02.png`,
			condition: m=>m.stats.maxDepth >= 64
		},
		{
			steamid: `TOODEEP`,
			src: `resources/images/glory/d03.png`,
			condition: m=>m.stats.maxDepth >= 640
		},
		{
			steamid: `SIXTYFOURDOWN`,
			src: `resources/images/glory/route.png`,
			condition: m=>m.got64kmphAchievement
		},
		{
			steamid: `NEOPHOBIA`,
			src: `resources/images/glory/pump.png`,
			condition: m=>m.pinhole && !m.stats.excavatorWasBuilt
		}
	],
	preload: [
		`resources/images/annihilator.png`,
		`resources/images/entropy3.png`,
		`resources/images/auxpump.png`,
		`resources/images/eye.png`,
		`resources/images/silo.png`,
		`resources/images/auxpump1.png`,
		`resources/images/flower.png`,
		`resources/images/silo2.png`,
		`resources/images/c1-3.png`,
		`resources/images/fruit.png`,
		`resources/images/strange.png`,
		`resources/images/c31-2.png`,
		`resources/images/generaldecay.png`,
		`resources/images/strange1.png`,
		`resources/images/c4-1.png`,
		`resources/images/strange2.png`,
		`resources/images/c7-6.png`,
		`resources/images/gradient.png`,
		`resources/images/strange3.png`,
		`resources/images/channel.png`,
		`resources/images/hollow.png`,
		`resources/images/symbol01.png`,
		`resources/images/channel2.png`,
		`resources/images/hollowEvent.png`,
		`resources/images/symbol02.png`,
		`resources/images/chasm.png`,
		`resources/images/injector.png`,
		`resources/images/symbol03.png`,
		`resources/images/symbol04.png`,
		`resources/images/conductor.png`,
		`resources/images/mega1.png`,
		`resources/images/symbol05.png`,
		`resources/images/consumer.png`,
		`resources/images/mega1a.png`,
		`resources/images/cookie.png`,
		`resources/images/mega1b.png`,
		`resources/images/valve.png`,
		`resources/images/des.png`,
		`resources/images/pinhole.png`,
		`resources/images/vault.png`,
		`resources/images/des2.png`,
		`resources/images/vent.png`,
		`resources/images/des2a.png`,
		`resources/images/preheater.png`,
		`resources/images/vessel.png`,
		`resources/images/double2.png`,
		`resources/images/reactor.png`,
		`resources/images/vessel2.png`,
		`resources/images/double_spr.png`,
		`resources/images/recycler.png`,
		`resources/images/voidsculpture.png`,
		`resources/images/entropy.png`,
		`resources/images/recycler2.png`,
		`resources/images/voidsculpture_dark.png`,
		`resources/images/entropy2.png`,
		`resources/images/reflector.png`,
		`resources/images/waypoint.png`,
		`resources/images/entropy2a.png`,
		`resources/images/resources.png`
	]
}}
