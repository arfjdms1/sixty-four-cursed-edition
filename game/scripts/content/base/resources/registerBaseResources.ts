import type { ResourceDefinition } from '../../../registry/resource-types.js'

export const BASE_RESOURCE_IDS = [
	'charonite',
	'elmerine',
	'qanetite',
	'beta-pylene',
	'hell-gem',
	'chromalit',
	'celestial-foam',
	'hollow-stone',
	'void',
	'reality',
] as const

export type BaseResourceTypeId = typeof BASE_RESOURCE_IDS[number]

export function getBaseResourceDefinitions(): ResourceDefinition[] {
	return [
		{
			id: 'charonite',
			legacyIndex: 0,
			name: `Charonite`,
			sfx: `tap1`,
			triplet: ['#28282E', '#26323E', '#112'],
			surgeTriplet: ['#7E7E82', '#515B65', '#70707A'],
			chances: [
			{
				type: 0,
				mean: 6,
				stdev: 16,
				base: 1
			}
			],
			probabilities: [
			{
				point: 10,
				spread: 65,
				value: 1
			}
			],
			mean: 6,
			stdev: 16,
			base: 1
		},
		{
			id: 'elmerine',
			legacyIndex: 1,
			name: `Elmerine`,
			sfx: `tap2`,
			triplet: [`#FFC759`, `#FFE86F`, `#FF8F60`],
			chances: [
			{
				type: 0,
				mean: 16,
				stdev: 5,
				base: .01
			}
			],
			probabilities: [
			{
				point: 16,
				spread: 16,
				value: .04
			}
			],
			mean: 16,
			stdev: 5,
			base: .01
		},
		{
			id: 'qanetite',
			legacyIndex: 2,
			name: `Qanetite`,
			sfx: `tap3`,
			triplet: ['#863DFF', '#5E3EDC', '#4925D6'],
			chances: [
			{
				type: 0,
				mean: 32,
				stdev: 4,
				base: .005
			}
			],
			probabilities: [
			{
				point: 34,
				spread: 14,
				value: .064
			}
			],
			mean: 32,
			stdev: 4,
			base: .005
		},
		{
			id: 'beta-pylene',
			legacyIndex: 3,
			name: `Beta-Pylene`,
			sfx: `tap4`,
			triplet: ['#F26F67', '#FFB68C', '#C02E63'],
			chances: [
			{
				type: 0,
				mean: 90,
				stdev: 10,
				base: .1
			},
			{
				type: 1,
				from: 80,
				to: 10000,
				base: .999
			}
			],
			probabilities: [
			{
				point: 80,
				spread: 35,
				value: .1,
				span: Infinity
			}
			],
			mean: 116,
			stdev: 16,
			base: .01
		},
		{
			id: 'hell-gem',
			legacyIndex: 4,
			name: `Hell Gem`,
			sfx: `tap5`,
			triplet: ['#A6F246', '#E3FD43', '#4CB96B'],
			chances: [
			{
				type: 1,
				from: 80,
				to: 600,
				base: .001
			},
			{
				type: 0,
				mean: 550,
				stdev: 32,
				base: 100
			}
			],
			probabilities: [
			{
				point: 130,
				spread: 50,
				value: .0002,
				span: 420
			},
			{
				point: 550,
				spread: 150,
				value: .3,
			}
			]
		},
		{
			id: 'chromalit',
			legacyIndex: 5,
			name: `Chromalit`,
			sfx: `tap6`,
			triplet: ['#B5FFD2', '#FFFDD0', '#AFC5FC'],
			chances: [
			{
				type: 1,
				from: 600,
				to: 1000000,
				base: .002
			},
			{
				type: 0,
				mean: 1800,
				stdev: 16,
				base: 40
			}
			],
			probabilities: [
			{
				point: 700,
				spread: 100,
				value: .0002,
				span: Infinity
			},
			{
				point: 1800,
				spread: 100,
				value: .1
			}
			]
		},
		{
			id: 'celestial-foam',
			legacyIndex: 6,
			name: `Celestial foam`,
			sfx: `tap7`,
			triplet: ['#CED8D2', '#F8EFDA', '#9F9FAD'],
			chances: [
			{
				type: 1,
				from: 1800,
				to: 1000000,
				base: 2
			},
			{
				type: 0,
				mean: 1800,
				stdev: 16,
				base: 40
			}
			],
			probabilities: [
			{
				point: 1900,
				spread: 200,
				value: .4,
				span: Infinity
			}
			]
		},
		{
			id: 'hollow-stone',
			legacyIndex: 7,
			name: `Hollow stone`,
			sfx: `hollow`,
			triplet: ['#D5B57D', '#FBF0D9', '#843317']
		},
		{
			id: 'void',
			legacyIndex: 8,
			name: `Void`,
			sfx: `void`,
			triplet: ['#000','#000', '#000']
		},
		{
			id: 'reality',
			legacyIndex: 9,
			name: `Reality`,
			sfx: `void`,
			triplet: ['#F8F8EF', '#FFE1F0', '#E6E4FF']
		}
	]
}

export function assertBaseResourceDefinitions(definitions: readonly ResourceDefinition[]): void {
	if (definitions.length !== BASE_RESOURCE_IDS.length){
		throw new Error(`Invalid base resource definition count: ${definitions.length}`)
	}
	for (let legacyIndex = 0; legacyIndex < BASE_RESOURCE_IDS.length; legacyIndex++){
		const id = BASE_RESOURCE_IDS[legacyIndex]
		const definition = definitions[legacyIndex]
		if (definition.id !== id){
			throw new Error(`Invalid base resource order at index ${legacyIndex}: ${definition.id}`)
		}
		if (definition.legacyIndex !== legacyIndex){
			throw new Error(`Invalid legacy index for base resource ${id}: ${definition.legacyIndex}`)
		}
	}
}
