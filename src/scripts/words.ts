export type LanguageCode = 'en' | 'ru' | 'de' | 'nl' | 'fr' | 'ptbr' | 'it' | 'es' | 'cz' | 'pl' | 'jp' | 'kr' | 'sch' | 'tch' | 'thai' | 'hu' | 'lv' | 'ro'

export interface TranslationEntry {
	[field: string]: string | undefined
	name: string
	description: string
	remdescription?: string
}

type TranslationSection = Record<string, string> | string[] | TranslationEntry[] | Record<string, TranslationEntry>

export interface LanguagePack {
	[section: string]: TranslationSection
	splash: Record<string, string>
	achievements: TranslationEntry[]
	resources: string[]
	entities: Record<string, TranslationEntry>
	messages: string[]
	credits: string[]
	explainer: string[]
	random: Record<string, string>
}

export type Translations = Record<LanguageCode, LanguagePack> & Record<string, LanguagePack>

export function generateGlobalJson(){

	const keys = abstract_getWords().en
	const languages: LanguageCode[] = [`en`, `ru`, `de`, `ptbr`, `it`, `es`, `fr`, `nl`, `cz`, `pl`, `jp`, `kr`, `sch`, `tch`, `thai`, `hu`, `lv`, `ro`]
	const translations = abstract_getWords()

	const json: Record<string, Record<string, string>> = {}
	const index: string[] = []
	const entries: TranslationEntry[] = []

	let id = 0

	for (let i in keys){



		if ((keys[i] as TranslationEntry[]).length){

			for (let j = 0; j < (keys[i] as TranslationEntry[]).length; j++){

				if ((keys[i] as TranslationEntry[])[j].name && (keys[i] as TranslationEntry[])[j].description){

					
					const entry1: Record<string, string> = {}
					json[(keys[i] as TranslationEntry[])[j].name] = entry1
					for (let k in translations){
						entry1[k] = (translations[k][i] as TranslationEntry[])[j].name
					}

					const entry2: Record<string, string> = {}
					json[(keys[i] as TranslationEntry[])[j].description] = entry2
					for (let k in translations){
						entry2[k] = (translations[k][i] as TranslationEntry[])[j].description
					}
					// console.log(keys[i][j].name)
					// console.log(keys[i][j].description)

				} else {
					// console.log(keys[i][j])
				}

			}

		} else {

			for (let j in keys[i]){

				if ((keys[i] as Record<string, TranslationEntry>)[j].name && (keys[i] as Record<string, TranslationEntry>)[j].description){

					// console.log(keys[i][j].name)
					// console.log(keys[i][j].description)

				} else {
					// console.log(keys[i][j])
				}

			}

		}

	}

	console.log(json)

	// for (let i in data.splash){
	// 	index.push(data.splash[i])
	// 	translatedIndex.push(translation.splash[i])
	// }
	// for (let i in data.achievements){
	// 	index.push(data.achievements[i].name)
	// 	index.push(data.achievements[i].description)
	// 	translatedIndex.push(translation.achievements[i].name)
	// 	translatedIndex.push(translation.achievements[i].description)
	// }
	// for (let i = 0; i < data.resources.length; i++){
	// 	index.push(data.resources[i])
	// 	translatedIndex.push(translation.resources[i])
	// }
	// for (let i in data.entities){
	// 	index.push(data.entities[i].name)
	// 	index.push(data.entities[i].description)
	// 	translatedIndex.push(translation.entities[i].name)
	// 	translatedIndex.push(translation.entities[i].description)

	// }
	// for (let i = 0; i < data.messages.length; i++){
	// 	index.push(data.messages[i])
	// 	translatedIndex.push(translation.messages[i])
	// }
	// for (let i = 0; i < data.credits.length; i++){
	// 	index.push(data.credits[i])
	// 	translatedIndex.push(translation.credits[i])
	// }
	// for (let i = 0; i < data.explainer.length; i++){
	// 	index.push(data.explainer[i])
	// 	translatedIndex.push(translation.explainer[i])
	// }
	// for (let i in data.random){
	// 	index.push(data.random[i])
	// 	translatedIndex.push(translation.random[i])
	// }

	// const mask = /\"/g
	// const escape = `\\"`
	// let string = ``
	// string += `{\n`
	// for (let i = 0; i < index.length; i++){
	// 	string += translatedIndex[i] ? `"${index[i].replace(mask, escape)}" : "${l ? translatedIndex[i].replace(mask, escape) : ""}",\n` : `"${index[i].replace(mask, escape)}" : "...",\n`
	// }
	// string = string.slice(0,-2)
	// // string += `"Dive into the world of Sixty Four, where you transform simple machines into a thriving factory. Each advancement brings new challenges and a deeper understanding of an extraordinary universe." : "",\n`
	// // string += `"Upgrade a factory in an extraordinary world. Progress to unlock new resources and machines, leading to new ways to expand and grow.\n\n[b]❒ [u]From Foundation to Complexity[/u][/b]\nBegin your journey with a simple machine generating distinct cubes. Use combinations of cubes to unlock advanced machinery and new gameplay elements.\n[img]{STEAM_APP_IMAGE}/extras/tst_4a_smaller.gif[/img]\n\n[b]❒ [u]An Evolving Factory Adventure[/u][/b]\nYour factory is not just a collection of idle machines; it's a dynamic environment of challenges and strategy. Face new situations and discover opportunities with every innovative and abstract machine you encounter.\n[img]{STEAM_APP_IMAGE}/extras/tst_3a_smaller.gif[/img]\n\n[b]❒ [u]A Fresh Mix of Gaming Mechanics[/u][/b]\nSixty Four combines simple yet engaging elements from idle, incremental, and strategy games. Pursue constant improvement and unravel the secrets behind messages from an unknown entity.\n[img]{STEAM_APP_IMAGE}/extras/tst_5a_smaller.gif[/img]" : ""`
	// string += `\n}`

	// return {json: string, index: index}

}

export function getAllJson(){

	const data = abstract_getWords()
	let counter = 0

	for (let i in data){

		counter++
		const json = generateTranslationJson(i)
		
		const a = document.createElement(`a`);
		a.href = URL.createObjectURL(new Blob([JSON.stringify(JSON.parse(json.json), null, 2)], {
		  type: `application/json`
		}))
		a.setAttribute(`download`, `sf_translation_${i}.json`)
		setTimeout((_event: unknown)=>{a.click()},counter * 200)

	}

	
	// a.setAttribute("download", "data.txt");
	// document.body.appendChild(a);
	// a.click();
	// document.body.removeChild(a);
}

export function generateTranslationJson(l?: string){

	const data = abstract_getWords().en
	const translation = abstract_getWords()[l ? l : `en`]

	const index: string[] = []
	const translatedIndex: Array<string | undefined> = []

	const creditSkip = [31,49]

	let id = 0

	for (let i in data.splash){
		index.push(data.splash[i])
		translatedIndex.push(translation.splash[i])
	}
	for (let i in data.achievements){
		index.push(data.achievements[i].name)
		index.push(data.achievements[i].description)
		translatedIndex.push(translation.achievements[i]?.name)
		translatedIndex.push(translation.achievements[i]?.description)
	}
	for (let i = 0; i < data.resources.length; i++){
		index.push(data.resources[i])
		translatedIndex.push(translation.resources[i])
	}
	for (let i in data.entities){
		index.push(data.entities[i].name)
		index.push(data.entities[i].description)
		translatedIndex.push(translation.entities[i]?.name)
		translatedIndex.push(translation.entities[i]?.description)

	}
	for (let i = 0; i < data.messages.length; i++){
		index.push(data.messages[i])
		translatedIndex.push(translation.messages[i])
	}
	for (let i = 0; i < data.credits.length; i++){
		index.push(data.credits[i])
		if (i > creditSkip[0] && i < creditSkip[1]) {
			translatedIndex.push(data.credits[i]) //DO NOT TRANSLATE TRANSLATIONS IN CREDITS
		} else {
			translatedIndex.push(translation.credits[i])
		}


		
	}
	for (let i = 0; i < data.explainer.length; i++){
		index.push(data.explainer[i])
		translatedIndex.push(translation.explainer[i])
	}
	for (let i in data.random){
		index.push(data.random[i])
		translatedIndex.push(translation.random[i])
	}

	const mask = /\"/g
	const escape = `\\"`
	let string = ``
	string += `{\n`
	for (let i = 0; i < index.length; i++){
		string += translatedIndex[i] ? `"${index[i].replace(mask, escape)}" : "${l ? translatedIndex[i]!.replace(mask, escape) : ""}",\n` : `"${index[i].replace(mask, escape)}" : "",\n`
	}
	string = string.slice(0,-2)
	// string += `"Dive into the world of Sixty Four, where you transform simple machines into a thriving factory. Each advancement brings new challenges and a deeper understanding of an extraordinary universe." : "",\n`
	// string += `"Upgrade a factory in an extraordinary world. Progress to unlock new resources and machines, leading to new ways to expand and grow.\n\n[b]❒ [u]From Foundation to Complexity[/u][/b]\nBegin your journey with a simple machine generating distinct cubes. Use combinations of cubes to unlock advanced machinery and new gameplay elements.\n[img]{STEAM_APP_IMAGE}/extras/tst_4a_smaller.gif[/img]\n\n[b]❒ [u]An Evolving Factory Adventure[/u][/b]\nYour factory is not just a collection of idle machines; it's a dynamic environment of challenges and strategy. Face new situations and discover opportunities with every innovative and abstract machine you encounter.\n[img]{STEAM_APP_IMAGE}/extras/tst_3a_smaller.gif[/img]\n\n[b]❒ [u]A Fresh Mix of Gaming Mechanics[/u][/b]\nSixty Four combines simple yet engaging elements from idle, incremental, and strategy games. Pursue constant improvement and unravel the secrets behind messages from an unknown entity.\n[img]{STEAM_APP_IMAGE}/extras/tst_5a_smaller.gif[/img]" : ""`
	string += `\n}`

	return {json: string, index: index}

}

export function getLanguageObjectFromString(string: string): LanguagePack {

	const data = string.split(`\n`)

	let index = 0
	const order = abstract_getWords().en
	// const map = generateTranslationJson().index
	// console.log(map)

	const out = {} as LanguagePack

	out.splash = {}
	for (let i in order.splash){
		out.splash[i] = data[index++]
	}
	out.achievements = []
	for (let i = 0; i < order.achievements.length; i++){
		const achievement = {} as TranslationEntry
		achievement.name = data[index++]
		achievement.description = data[index++]
		out.achievements.push(achievement)
	}
	out.resources = []
	for (let i = 0; i < order.resources.length; i++){
		out.resources.push(data[index++])
	}
	out.entities = {}
	for (let i in order.entities){
		const entity = {} as TranslationEntry
		entity.name = data[index++]
		entity.description = data[index++]
		out.entities[i] = entity
	}
	out.messages = []
	for (let i = 0; i < order.messages.length; i++){
		out.messages.push(data[index++])
	}
	out.credits = []
	for (let i = 0; i < order.credits.length; i++){
		out.credits.push(data[index++])
	}
	out.explainer = []
	for (let i = 0; i < order.explainer.length; i++){
		out.explainer.push(data[index++])
	}
	out.random = {}
	for (let i in order.random){
		out.random[i] = data[index++]
	}

	return out
}

export function _getLanguageObjectFromData(data: Record<string, string>): LanguagePack {

	let index = 0
	const order = abstract_getWords().en

	const out = {} as LanguagePack

	out.splash = {}
	for (let i in order.splash){
		out.splash[i] = data[order.splash[i]]
	}
	out.achievements = []
	for (let i = 0; i < order.achievements.length; i++){
		const achievement = {} as TranslationEntry
		achievement.name = data[order.achievements[i].name]
		achievement.description = data[order.achievements[i].description]
		out.achievements.push(achievement)
	}
	out.resources = []
	for (let i = 0; i < order.resources.length; i++){
		out.resources.push(data[order.resources[i]])
	}
	out.entities = {}
	for (let i in order.entities){
		const entity = {} as TranslationEntry
		entity.name = data[order.entities[i].name]
		entity.description = data[order.entities[i].description]
		out.entities[i] = entity
	}
	out.messages = []
	for (let i = 0; i < order.messages.length; i++){
		out.messages.push(data[order.messages[i]])
	}
	out.credits = []
	for (let i = 0; i < order.credits.length; i++){
		out.credits.push(data[order.credits[i]])
	}
	out.explainer = []
	for (let i = 0; i < order.explainer.length; i++){
		out.explainer.push(data[order.explainer[i]])
	}
	out.random = {}
	for (let i in order.random){
		out.random[i] = data[order.random[i]]
	}

	return out
}

export function getLanguageObject(json: Record<string, string>): LanguagePack {

	let index = 0
	const order = abstract_getWords().en
	const data = json//JSON.parse(json)
	const map = generateTranslationJson().index

	const out = {} as LanguagePack

	out.splash = {}
	for (let i in order.splash){
		out.splash[i] = data[map[index++]]
	}
	out.achievements = []
	for (let i = 0; i < order.achievements.length; i++){
		const achievement = {} as TranslationEntry
		achievement.name = data[map[index++]]
		achievement.description = data[map[index++]]
		out.achievements.push(achievement)
	}
	out.resources = []
	for (let i = 0; i < order.resources.length; i++){
		out.resources.push(data[map[index++]])
	}
	out.entities = {}
	for (let i in order.entities){
		const entity = {} as TranslationEntry
		entity.name = data[map[index++]]
		entity.description = data[map[index++]]
		out.entities[i] = entity
	}
	out.messages = []
	for (let i = 0; i < order.messages.length; i++){
		out.messages.push(data[map[index++]])
	}
	out.credits = []
	for (let i = 0; i < order.credits.length; i++){
		out.credits.push(data[map[index++]])
	}
	out.explainer = []
	for (let i = 0; i < order.explainer.length; i++){
		out.explainer.push(data[map[index++]])
	}
	out.random = {}
	for (let i in order.random){
		out.random[i] = data[map[index++]]
	}

	return out

}

export function abstract_getWords(): Translations {return {

		en: {
			splash: {
				sixtyfour: `SIXTY&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FOUR`,
				continue: `<span>CONTINUE</span><div class="keyboard">Esc</div>`,
				start: `<span>START</span><div class="keyboard">Esc</div>`,
				soundoff: `SOUND IS OFF`,
				soundon: `SOUND IS ON`,
				save: `SAVE`,
				load: `LOAD`,
				language: `LANGUAGE: ENGLISH`,
				reset: `RESET`,
				credit: `©2024 Oleg Danilov, published by Playsaurus. Version`,
				warning: `You'll lose everything, I kid you not. Keep holding to commit.`,
				glory: `ACHIEVEMENTS`,
				deglory: `BACK`,
				quit: `QUIT`,
				export: `Export`,
				import: `Import`,
				//-=COMMENT WHEN EXPORTING=-
				flashbang: `Bright flashing lights are part of this game. If you are sensitive to them, you may consider disabling flashes by clicking this icon.`//REMOVE WHILE EXPORTING
			},
			achievements: [
				{
					name: `Fool's gold`,
					description: `Get some Elmerine`
				},
				{
					name: `Deep Purple`,
					description: `Get Qanetite`
				},
				{
					name: `Blood of the land`,
					description: `Get Beta-Pylene`
				},
				{
					name: `Green energy`,
					description: `Find a Hell gem`
				},
				{
					name: `Hot glass`,
					description: `Find a Chromalit`
				},
				{
					name: `Holy concrete`,
					description: `Get some Celestial Foam`
				},
				{
					name: `Can it do dishes?`,
					description: `Get a Hollow Stone`
				},
				{
					name: `Where the Sun don't shine`,
					description: `Get some Void`
				},
				{
					name: `Who you gonna call?`,
					description: `Get some Reality`
				},
				{
					name: `Nietzsche`,
					description: `Stare into the abyss 64 times`
				},
				{
					name: `64K`,
					description: `Get 64 000 stones`
				},
				{
					name: `64M`,
					description: `Get 64 000 000 stones`
				},
				{
					name: `64B`,
					description: `Get 64 000 000 000 stones`
				},
				{
					name: `You may reset now`,
					description: `Get stuck in the beginning`
				},
				{
					name: `Perpetum shmobile`,
					description: `Put two silos together`
				},
				{
					name: `Need a break?`,
					description: `Play for 64 hours`
				},
				{
					name: `Must... Destroy`,
					description: `Click a cube 6400 times`
				},
				{
					name: `Architect`,
					description: `Build 64 machines`
				},
				{
					name: `Destroyer`,
					description: `Destroy 64 machines`
				},
				{
					name: `Hellraiser`,
					description: `Have 9 Hell Vaults`
				},
				{
					name: `End/Beginning`,
					description: `Explode the Inverse Chasm`
				},
				{
					name: `Cookie clicker`,
					description: `Click a cookie`
				},
				{
					name: `Drunken sailor`,
					description: `Honk 64 times for no reason`
				},
				{
					name: `Mr. Mine`,
					description: `Have 9 Excavating Channels`
				},
				{
					name: `Is there a limit?`,
					description: `Dig down 64 km deep`
				},
				{
					name: `Seth Brundle`,
					description: `Teleport <s>1</s> 64 times`
				},
				{
					name: `Red-Blue Rock`,
					description: `Finish the game without deleting anything for 15 minutes and having less than 15 Containment Silos`
				},
				{
					name: `Straight to hell!`,
					description: `Get a Hell Gem within the first 64 minutes from the start`
				},
				{
					name: `Scratch the surface`,
					description: `Dig down 64 meters deep`
				},
				{
					name: `Is it hot?`,
					description: `Dig down 640 meters deep`
				},
				{
					name: `Too deep`,
					description: `Dig down 6400 meters deep`
				},
				{
					name: `64 kmph down`,
					description: `Reach a depth of 6400m within 6 minutes of placing a fresh Excavation channel`
				},
				//COMMENT
				{
					name: `Neophobia`,
					description: `Complete the game without ever upgrading extraction channels`
				}
			],
			resources: [
				`Charonite`,
				`Elmerine`,
				`Qanetite`,
				`Beta-Pylene`,
				`Hell Gem`,
				`Chromalit`,
				`Celestial foam`,
				`Hollow stone`,
				`Void`,
				`Reality`
			],
			entities: {
				pinhole: {
					name: `?`,
					description: `U/D, C/S, T/B, E/νE, μ/νμ, τ/ντ, G/γ, Z/W, H, Δ/νΔ`
				},
				gradient: {
					name: `Gradient well`,
					description: `An everlasting mineable cube. Responds to most destabilizers and resonators. Should be connected to the Inverse Chasm via conductors.`
					//description: `A continuous access point for resources. Responds to most destabilizers and resonators. Should be connected to the Inverse Chasm via conductors.`
				},
				chasm: {
					name: `The Inverse Chasm`,
					description: `A bridge to the unknown.`
				},
				conductor: {
					name: `Conductor`,
					description: `Connects the Inverse Chasm to industrial silos.`
				},
				pump: {
					name: `Extracting channel`,
					description: `Extracts resources and places them all around itself.`
				},
				pump2: {
					name: `Excavating channel`,
					// description: `Excavates a lot of resources fast and places them further around itself.`
					description: `An extracting channel upgrade. Excavates a lot of resources fast and places them further around itself.`
				},
				vault: {
					name: `Hell vault`,
					description: `Insulates 1024 Hell Gems from environment.`
				},
				cube: {
					name: `Resource cube`,
					description: `Extracted resources.`
				},
				destabilizer: {
					name: `Destabilizer`,
					description: `Place this next to a cube to break it twice as fast. Requires an Elmerine to operate. Additional destabilizers increase the effect.`,
					remdescription: `Doubles the power of resource-crushing process if placed next to an extracted cube. Requires an Elmerine to operate. Additional destabilizers increase the effect.`
				},
				destabilizer2: {
					name: `Industrial destabilizer`,
					description: `A destabilizer upgrade. Quadruples the power of resource-crushing process. Requires 64 Elmerine to operate. Additional destabilizers increase the effect.`
				},
				destabilizer2a: {
					name: `Hell Gem destabilizer`,
					description: `An industrial destabilizer upgrade. Boosts the power of resource-crushing process by 625 times when a Hell Gem is present in the extracted cube. Otherwise, it provides no benefit. Requires 1 Hell Gem to operate. Additional destabilizers increase the effect.`
				},
				doublechannel: {
					name: `Channel cooler`,
					description: `Place this next to the cube-extracting machine to extract cubes twice as fast. Additional coolers increase the effect.`,
					remdescription: `Doubles the flow in a source channel if placed next to it. Additional coolers increase the effect.`
				},
				doublechannel2: {
					name: `Active channel cooler`,
					description: `A channel cooler upgrade. Triples the flow in a source channel if placed next to it. Additional coolers increase the effect.`
				},
				valve: {
					name: `Reverse valve`,
					description: `Prevents the cube-extracting machine from resetting to the original position if placed next to it. Requires a Charonite to operate.`,
					remdescription: `Disables reverse flow in a source channel if placed next to it. Requires a Charonite to operate.`
				},
				auxpump: {
					name: `Auxiliary pump`,
					description: `A reverse valve upgrade. Provides pressure to a source channel if placed next to it. Requires 8 Elmerine to operate. Additional pumps do not increase the pressure in a source channel.`
				},
				auxpump2: {
					name: `Pump station`,
					description: `An auxiliary pump upgrade. Provides quadrupled pressure to a source channel if placed next to it. Requires 256 Elmerine and 4 Beta-Pylene to operate. Multiple stations do not increase the flow in a source channel.`
				},
				entropic: {
					name: `Entropy resonator`,
					description: `Periodically crushes resources if placed next to a cube. Requires a Qanetite to operate.`
				},
				entropic2: {
					name: `Entropy resonator II`,
					description: `An entropy resonator upgrade. Crushes resources 3 times faster. Requires a Chromalit to operate.`
				},
				entropic2a: {
					name: `Entropy capacitor`,
					description: `An entropy resonator upgrade. Crushes resources at the moment they appear on the surface with 600% power. But just once per cube. Requires 8 Chromalits to operate.`
				},
				entropic3: {
					name: `Void resonator`,
					description: `An entropy resonator II upgrade. When annihilation occurs the resonator crushes cubes around it with immense power.`
				},
				converter32: {
					name: `Charonite enrichment vat`,
					description: `Slowly reacts Qanetite with Charonite to produce Elmerine.`
				},
				converter13: {
					name: `Charonite sump`,
					description: `Reclaims Qanetite from liquefied Charonite sediments in the presence of catalysts.`
				},
				converter41: {
					name: `Beta-Pylene oxidizer`,
					description: `Burns Beta-Pylene to produce Charonite and trace amounts of other elements.`
				},
				converter76: {
					name: `Celestial irradiator`,
					// description: `Irradiates Celestial Foam with a Chromalit, converting the Foam into Chromalits.`
					description: `Irradiates Celestial Foam with a Chromalit, converting the Foam into Chromalits, which are a great source of Hell Gems, Beta-Pylene, Qanetite and Elmerine due to Chromalit decay.`
				},
				converter64: {
					name: `Celestial reactor`,
					description: `Supports controllable fusion of Chromalits and Celestial Foam to produce Beta-Pylene. Can't operate in close proximity to other celestial reactors.`
				},
				reflector: {
					name: `Celestial reflector`,
					description: `Improves an adjacent celestial reactor's performance.`
				},
				mega1: {
					name: `Material streamer tower`,
					// description: `Channels resources via stream. There can only be one.`
					description: `Increases visibility by compressing moving resources. There can only be one.`
				},
				mega1a: {
					name: `Material streamer tower MKII`,
					//description: `A material streamer tower upgrade. Increases streaming speed. There can only be one.`
					description: `A material streamer tower upgrade. Increases the speed of resource transfer. There can only be one.`
				},
				mega1b: {
					name: `Material streamer tower MKIII`,
					//description: `A material streamer tower MKII upgrade. Compresses resources into packets. There can only be one.`
					description: `A material streamer tower MKII upgrade. Compresses moving resources even more. There can only be one.`
				},
				mega2: {
					name: `Recycling tower`,
					description: `Allows machine recycling which returns 90% of the resources. There can only be one.`
				},
				mega3: {
					name: `Disassembling tower`,
					description: `A recycling tower upgrade. Allows machine disassembly which returns all the resources and machine relocation if you press [E]. There can only be one.`
				},
				voidsculpture: {
					name: `Void admiration chancel`,
					description: `Enables you to ignore visual drawbacks of the void machines.`
				},
				eye: {
					name: `Fill director`,
					//description: `Indicates machines ready for filling.`
					description: `Indicates machines ready for filling. There can only be one.`
				},
				cookie: {
					name: `A cookie`,
					description: `How did it get there?`
				},
				injector: {
					name: `Hell Gem injector`,
					description: `Swaps a random resource from an adjacent cube with a Hell Gem if there is none. Has 32 charges if provided with 32 Hell Gems and 64 Qanetite.`
				},
				silo: {
					name: `Underground silo`,
					description: `On activation refills nearby machines and then automatically refills them 16 more times`
				},
				silo2: {
					name: `Industrial silo`,
					description: `An underground silo upgrade. On activation refills nearby machines and then automatically refills them 64 more times`
				},
				vessel: {
					name: `Containment vessel`,
					description: `Stores 32 Chromalits, preventing their fission. Consumes a Hell Gem.`
				},
				vessel2: {
					name: `Containment silo`,
					description: `A containment vessel upgrade. Stores 32768 Chromalits preventing their fission. Consumes Reality.`
				},
				consumer: {
					name: `Catalytic refinery`,
					description: `Consumes adjacent broken resources. After accumulating 1024 resources, it releases everything with an additional bonus. The amount of the bonus increases with each consecutive release, reaching up to 100%. If no resources are consumed in 16 seconds, the effect resets.`
				},
				preheater: {
					name: `Catalytic preheater`,
					description: `Increases the speed of any resource conversion machine if placed next to one. Each converter increases the preheater's speed boost, up to 300%, if 8 machines are affected.`
				},
				hollow: {
					name: `Hollow outcrop`,
					description: `So many holes.`
				},
				strange: {
					name: `Hollow rock`,
					description: `It looks like it's been there for awhile.`
				},
				strange1: {
					name: `Hollow rock research site`,
					description: `Makes Celestial Foam annihilate with 512 Hell Gems instead of 64. NORTH.`
				},
				strange2: {
					name: `Hollow rock facility`,
					description: `Doubles the maximum amount of Hollow Stones and increases their spawn rate.`
				},
				strange3: {
					name: `Reconstructed Hollow`,
					description: `Dramatically increases Hollow Stone spawn rate and does everything silently.`
				},
				generaldecay: {
					name: `General decay reactor`,
					description: `Dramatically improves Chromalit decay performance. There can only be one.`
				},
				waypoint: {
					name: `Waypoint`,
					description: `Teleports the next existing Waypoint to you.`
				},
				annihilator: {
					name: `Annihilator`,
					description: `Produces Void when Hell Gems annihilate with Celestial Foam. Requires a Hollow Stone to operate.`
				},
				flower: {
					name: `Hollow flower`,
					description: `Reduces the chance of time warp. Counteracts the effect of one Hollow Stone. Must be built upon a Hollow Stone. Destroys the Hollow Stone it was built upon.`
				},
				fruit: {
					name: `Hollow fruit`,
					description: `A Hollow Flower evolution. Prevents the formation of Hollow Stones to nourish itself. Produces Hollow Stones.`
				},
				eraser: {
					name: `Demolish`,
					description: `Destroys a machine returning 50% of the resources used to construct it.`
				},
				eraser2: {
					name: `Recycle`,
					description: `Recycles a machine returning 90% of the resources used to construct it.`
				},
				eraser3: {
					name: `Disassemble`,
					description: `Disassembles a machine returning all the resources used to construct it.`
				},
				clicker1: {
					name: `Qanetite oscillator`,
					description: `Allows you to click and hold on resources to break them. There can only be one.`
				},
				clicker2: {
					name: `Hell Gem oscillator`,
					description: `An upgrade to Qanetite oscillator. Increases the oscillation frequency. There can only be one.`
				},
				clicker3: {
					name: `Chromalit oscillator`,
					description: `An upgrade to Hell Gem oscillator. Maximizes the oscillation frequency. There can only be one.`
				},
				//COMMENT when exporting
				stabilizer: {
					name: `Stabilizer`,
					description: `Stabilizes one adjacent surge to temporarily harness it's power.`
				},
				stabilizer2: {
					name: `Stabilizer II`,
					description: `An upgrade to stabilizer. Improves stability and performance.`
				},
				stabilizer3: {
					name: `Shattered stabilizer`,
					description: `Anomalous upgrade. Improves performance and maximizes stability. There can only be one.`
				}
			},
			messages: [
			    "Where are you?",
			    "I'm literally in the middle of nowhere",
			    "Alright, what do you see?",
			    "Well, not much. There's this machine here, it looks kinda familiar but I can't put my finger on it",
			    "What machine?",
			    "Hold on, maybe I can...",
			    "Wait, tell me you are NOT touching some random machine right now!",
			    "It's working! It just created something",
			    "???",
			    "A huge black cube. It's so smooth. I really wanna break it",
			    "Are you high?",
			    "I now have 64 stones!",
			    "Well, okay then. Have fun with that.",
			    "Hey, I found a yellow stone!",
			    "Good for you man!",
			    "I think I can build machines now. I should build something to help break these cubes more easily. If a cube shows up in an adjacent cell, even diagonally, it should work.",
			    "Wait, are you playing some weird game? You're starting to creep me out",
			    "Now I just need to put a yellow stone inside this machine.",
			    "Whatever makes you happy... Jokes aside, are you coming over today?",
			    "Definitely! I'll be there in a few hours, just need to finish this up.",
			    "What exactly are you doing?",
			    "I'll text you later. I need to keep pushing the machine, sorry.",
			    "I believe machines influence each other when placed in adjacent or diagonal cells. For example, this fan needs to be placed next to the first machine to speed up the process.",
			    "You are making so much sense right now",
			    "Well?",
			    "Where are you at?",
			    "We've been waiting for you for ages now.",
			    "What do you mean? I'm still here.",
			    "WHERE???",
			    "I've got a blue stone now. Or is it purple? It sounds like an antique brass candlestick. I think I could use it to remove misplaced machines.",
			    "Are you kidding me? I thought you said you were coming. What the hell?!",
			    "Chill man, I'll be there in a minute",
			    "Wow, I can use [Q] to clone machines or destroy them if I click on a free cell first! And [Alt] helps to see behind tall machines.",
			    "CHOP CHOP",
			    "Are you guys still there?",
			    "HOLY CRAP!!!",
			    "Where are you????",
			    "Are you okay??",
			    "????",
			    "What the hell?",
			    "ARE YOU OKAY? WHERE ARE YOU?",
			    "Chill man! I am ok, what's going on?",
			    "You tell me! You've been ghosting me for two weeks now! I even went to your place a few times, but you weren't there. Just tell me where you are, that's it. Are you home right now?",
			    "Dude, what are talking about? We texted each other literally two minutes ago.",
			    "WHAT IS WRONG WITH YOU??? First you didn't show up, then you disappeared completely. And now you act like nothing happened!",
			    "I am asking you a simple question",
			    "WHERE ARE YOU?",
			    "I am here.",
			    "W H E R E",
			    "Hold on...",
			    "It is not funny man. Where are you exactly? Can you tell me that?",
			    "Well...",
			    "Dude, I don't actually know.",
			    "Give me a minute",
			    "What do you mean you don't know?",
			    "I need to gather my thoughts",
			    "Is everything all right? Are you safe? Should I call someone?",
			    "No, I am good. I just",
			    "I'll text you in a bit",
			    "Damn, man. What's going on?",
			    "I am scared",
			    "It seems I don't know where I am",
			    "This is so weird. I mean, everything is fine with me. But I can't describe this place.",
			    "It's like a dream, but then again it's not. Everything is white and there are these machines. And cubes. It doesn't make any sense.",
			    "I am not high or anything. I just realized how strange it is that I never noticed that this wasn't like anything I'd ever seen.",
			    "Now I got red stones, and it is kinda creepy that I am totally fine with all this. Ok, just a red stone, everything is fine.",
			    "So you are not kidding...",
			    "I see how it all sounds now. But yeah, it's all here before my eyes.",
			    "Can I do anything for you?",
			    "Just talk to me, that's it.",
			    "Can do buddy, can do. Btw, cops are now looking for you. Like you went missing.",
			    "Did you show them our texts?",
			    "How would that help? No, I turned on auto-delete.",
			    "Thanks!",
			    "How's it going over there?",
			    "Well, It turns out I can move around by using WASD. But there is nothing interesting around except this strange rock up North.",
			    "So your phone's compass works there!",
			    "Well, it is just \"up\" from here, so I guess that's North.",
			    "Makes sense",
			    "And the thing is I don't have a phone...",
			    "So how are you texting me?",
			    "I don't know!! I just know when you message me. And I can respond to you! It is not easy to explain.",
			    "Don't sweat it. We can talk and that's already good enough.",
			    "Yes, you are right.",
			    "So... Tell me about the machines",
			    "What do you mean?",
			    "What are they, what do they do, how do they work?",
			    "Well, they look fancy, with some cables and wires and stuff",
			    "One, for example, looks like a big plastic box with a copper coil on the top, where a blue stone goes. And there is a big label saying \"E—01SR\" on the side, with a smaller label \"Caution! Strong entropy radiation\"",
			    "What does that mean?",
			    "I don't know really. There is some entropy radiation there I guess.",
			    "Wait, I thought you made these machines?",
			    "Right... I see your point.",
			    "I just make them from cubes somehow. But I don't know what's inside. Yeah, that does sound weird, let me think about this.",
			    "And btw it seems like yellow and blue stones are not infinite, so I should really invest in those converters or a new mine.",
			    "Sounds like a plan",
			    "What a pain in the ass!",
			    "Huh?",
			    "A green stone! It takes ages to break it. I have to come up with something if they keep showing up.",
			    "I'm sure you'll make some fancy machine for that!",
			    "You bet!",
			    "Hell yeah! Hell gems, watch out.",
			    "Give 'em hell!",
			    "Remember you asked about the machines?",
			    "Yeah",
			    "I don't think they are real",
			    "What's that supposed to mean?",
			    "It's like in a dream. I can't look inside or even see them from the other side.",
			    "A vague representation of unexplainable technology",
			    "I think these machines look this way just because of how I perceive their function.",
			    "Like if something chops down trees it should look like an axe?",
			    "Something like that",
			    "Well, at least you sound pretty real to me",
			    "Yeah, I suppose you are the only real thing for me right now",
			    "I've got a bunch of new cubes, which are decaying to other cubes!",
			    "Well, not great, not terrible",
			    "I have to say something really weird",
			    "Do you see the irony in what you just wrote?",
			    "Maybe it's because of this strange place, but I forgot your name somehow",
			    "Well, I suppose we could spend a little more time together then",
			    "I'm serious",
			    "My name is Duke Nukem, obviously.",
			    "Dude, cut it out!",
			    "That's what she said!",
			    "This is stupid! Stop creeping me out. What's going on?",
			    "Damn",
			    "It looks like I can't remember my own name either",
			    "I just can't! It is batshit crazy. And I can't remember your name!",
			    "Maybe it's just a case of mass hysteria? I've heard it can affect multiple people at once. Let's just calm down and see what happens.",
			    "Yeah, right, hysteria",
			    "I still can't recall names",
			    "Me neither. And there's more",
			    "Yeah! What do I look like? When did we meet?",
			    "What does my home look like, who are our friends? Did we meet at all?",
			    "It looks like we are both stuck in the same shit. And I can't even tell if it always has been like that or something happened at some point. Is this some weird dream? And who's dreaming?",
			    "Any machines nearby? Maybe a cube sprung out somewhere?",
			    "Funny",
			    "Well, let's come up with some names for ourselves.",
			    "You sound like Veen",
			    "Why not",
			    "Have nothing against Veen",
			    "Hey, Veen. Would you like some beans, Veen? Yeah, sounds ok.",
			    "And you will be Charps",
			    "Do you have some sharp harps, Charps?",
			    "That doesn't make sense!",
			    "I like Charps. Nice to meet you, Veen",
			    "Likewise, Charps",
			    "WHAT IS GOING ON",
			    "What?",
			    "White cubes! They are destroying the green ones!",
			    "There are tons of decaying cubes too! It's like in a nuclear reactor!",
			    "Holy shit, are you ok?",
			    "Yeah, I'm fine! It's just a mess now. I have to build something to handle this. Maybe I should take another look at a rock in the north.",
			    "That's what you always do, Charps!",
			    "Sounds weird!",
			    "I mean, my name does. I guess I'll get used to it at some point. Right, Veen?",
			    "Yeah! Weird indeed.",
			    "Remember I mentioned a strange rock up north?",
			    "Not really, no",
			    "Well, there's this rock. And don't get me wrong, I realize that everything here is strange. But this rock feels much more strange than anything else.",
			    "I can't make any sense of it. But now when I decided to poke it a little, it changed something in the rules of the Universe itself!",
			    "Is it dangerous?",
			    "I don't know. The change is subtle.",
			    "I wonder what else it can do.",
			    "Alright, just don't destroy the Universe accidentally.",
			    "I'll do my best.",
			    "Well, THAT was the hardest rock of my life! But I think I know how to break it faster now.",
			    "Got new stone?",
			    "Yep, the weirdest so far",
			    "Woah, maybe the effect on the Universe wasn't so subtle. Do you feel it?",
			    "Feel what?",
			    "Well, maybe it's just me.",
			    "Have you, by any chance, seen a huge cube in front of your eyes right now?",
			    "Ehm, does a fridge count?",
			    "Well, nevermind",
			    "Wow, this new cube is pitch black. And it feels somewhat otherworldly.",
			    "More otherworldly than the previous one?",
			    "It is different! It's freezing cold, but not in a harmful way. Like it lacks the concept of temperature and it doesn't interact with you. It is not made of matter, doesn't have color or anything familiar, if it makes sense to you.",
			    "Frankly, it does not.",
			    "I think I get it. I can use hollow stones to condense that black stuff out of thin air. It forms weirdly identical crystals, but without any properties. And that fixes anomalies in the Universe somehow.",
			    "Sounds like an air filter",
			    "Yes, exactly! It looks like I spoiled the air at some point somehow.",
			    "You don't have to say it aloud",
			    "I decided to dig up that strange rock. Maybe there is an answer to what is happening inside. I feel it may be not just messing with everything, but it may control everything somehow!",
			    "Why do you think so?",
			    "Would you believe me if I say I sense it?",
			    "Sure! I think I would believe in anything right now. A rock controlling the Universe? Why the hell not!",
			    "I think I'm getting a seizure!",
			    "Please don't",
			    "These machines are getting so obnoxiously loud and flickering. Maybe I should tweak something to fix it. Or tweak myself. Or both.",
			    "Now we're talking!",
			    "So, what did you tweak?",
			    "Wait, something is wrong.",
			    "I built a thing out of the black stuff. And it isn't a machine. But it did something to the Waypoints.",
			    "What are waypoints?",
			    "They shift the Universe around you, that's how you get to different places.",
			    "How do you know they shift the Universe and not you?",
			    "Hmm, I didn't think about that",
			    "I think I broke the Universe",
			    "None of this makes sense!",
			    "Machines aren't making sense, nothing is.",
			    "I hope I can fix this",
			    "Veen?",
			    "Dude, are you there?",
			    "Please please please not that! I hope you just went to take a leak or something.",
			    "VEEN!",
			    "WHAT?",
			    "Still weird though.",
			    "Oh thank god!",
			    "Did you build something new?",
			    "I thought I broke the Universe and you were gone forever! I was in some netherworld with some symbols around and thought these were the ruins of the Universe. But it is another Universe or a different version of this one, because they resemble each other, and they are connected now.",
			    "Exploring, eh? Sounds fun!",
			    "Fun? Did you even read my text? ANOTHER UNIVERSE!!!",
			    "You have to accept that you are running out of the capacity to surprise me.",
			    "Fair enough",
			    "It's not a rock, it's a lens",
			    "It can make everything converge into a single point. And I mean everything! Space, time, all the concepts and rules. Everything!",
			    "Did you find the manual or something?",
			    "I don't know why it's there and why we're here. I just somehow know what it does now.",
			    "So... Are you going to converge everything or what?",
			    "I don't know how. But maybe it's the point of this place. Now it just floats up in the air as if that's what it's supposed to do.",
			    "And what happens next?",
			    "No idea",
			    "The more I think about it, the more I understand it's not just your machines that are not real.",
			    "I try to ask myself specific questions and I don't have answers.",
			    "Remember I mentioned that cops were searching for you? I wasn't messing with you. But now everything falls apart when I ask myself questions.",
			    "Did I come to this police station or did I call them? And who was there? Cops? Where is that police station in the city? What is this city? Do I live in this city? What's the name of the city? And what state is it? Or are there any states at all?",
			    "I can't answer a single question. Everything seemed normal until I started asking questions. I am afraid to ask more.",
			    "Sorry about that",
			    "No, it's not your fault at all. We are in the same boat as far as I can see.",
			    "I just hope you'll find out what this boat is.",
			    "Yeah, me too!",
			    "Let's see how it ends. I just hope this is not some kind of eternal hell or limbo.",
			    "Show'em, Dante!",
			    "Now we're talking. These guys should drain this Universe dry!",
			    "You sound like an oil company",
			    "I am tired of tweaking everything to be a little more efficient and I am tired of the noise. This machine should change everything. It's even ripping through the other side.",
			    "Isn't it dangerous?",
			    "The concept of danger here is quite blurry.",
			    "I think it's time to make something big.",
			    "What's on your mind?",
			    "I am not sure. But it should be big!",
			    "Like a huge machine?",
			    "No, I am speaking metaphorically",
			    "Do it then!",
			    "Oh fuck",
			    "I did something wrong. The inverse chasm is destroyed. Everything's collapsing.",
			    "Are you okay?",
			    "Yes, but the machines are being destroyed! I can't build anything! Fuck!",
			    "Wait! Maybe that's supposed to happen?",
			    "NO! It is not!",
			    "How do you know that?",
			    "Hold on, I have to fix this somehow",
			    "Here goes nothing!",
			    "I see you! You just walked past a huge chestnut tree, on that funny planet in an upper galaxy arm right there.",
			    "No I did not! What galaxy?",
			    "Oh, it's hard to tell the exact time, it hasn't happened yet probably. But just wait for 15 billion years!",
			    "You are making so much sense right now. Are you coming over btw?",
			    "Definitely! I'll be there in a few hours, just need to finish up some stuff.",
			    "Alright, see you then!",
			    "But please, Charps",
			    "Don't be late this time",
			    "I won't, Veen, I won't!"
			],
			credits: [
			    "The beginning",
			    "I really appreciate you made it to the very end, where everything starts",
			    "Congratulations, I guess!",
			    "Just look at this:",
			    "Resources mined in total:",
			    "Charonites:",
			    "Elmerines:",
			    "Qanetites:",
			    "Beta-Pylenes:",
			    "Hell Gems:",
			    "Chromalits:",
			    "Celestial foam:",
			    "Hollow stones:",
			    "Voids:",
			    "Realities:",
			    "Machines built:",
			    "Machines destroyed:",
			    "Maximum channel depth in meters:",
			    "Strange rock poked:",
			    "Times teleported:",
			    "Cube clicks:",
			    "Time warps:",
			    "Play time:",
			    "h",
			    "Game created by:<br>Oleg Danilov",
			    "Additional graphics:<br>Yulia Nogteva",
			    "Dialogue editing:<br>Abdurahman Zulumhanov and Anna Peterson",
			    "Steam publishing:<br>Playsaurus",
			    "Play testing:<br>Community of Leprosorium, Abdurahman Zulumhanov, Playsaurus",
			    "THE END",
			    "You may go and play Cookie Clicker or something now.",
			    "Music:<br>Shallow Anne by Jake Chudnow",
			    //-=COMMENT WHEN EXPORTING=-
			    "Deutsch: flex 4711, Patrick Karban",
			    "Português: selfemcrowdin, Mateus Iamarino",
			    "Italiano: doralum",
			    "Español: armangar, Syunay Kamenov",
			    "Français: KjetilVion, Etienne Samson, William (Ekitchi)",
			    "Nederlands: lievevandyck",
			    "Čeština: Jakub Strelinger",
			    "Polski: PolglishPL",
			    "日本語: Winna Tolentino",
			    "한국어: Ah Lon Sin, Sumin Park, Cyberowl",
			    "简体中文：Daisy Chan, kevinlee7, YuLun",
			    "繁體中文: Daisy Chan, kevinlee7",
			    "ไทย: They say P, Phimze Pym",
			    "Magyar: Simon Dániel és Márton-Mezey Csenge",
			    "Latviešu valoda: Roberts Artūrs Bumburs (Arburo)",
			    "Română: Eric Apetrei"
			],
			explainer: [
				`Press and hold.`,
				`Always click on the cell underneath.`,
				`<span class="keyboard">Q</span>, <span class="keyboard">Esc</span> or right-click to cancel.`,
				`Hold <span class="keyboard">Alt</span> to take a closer look.`,
				`Press <span class="keyboard">Q</span> over an empty cell to pick a demolishing tool.`,
				`Press <span class="keyboard">Q</span> over a machine to try to build one more.`,
				`WASD or right-click and drag to look around.`
			],
			random: {
				paste: `A save code has been copied to the clipboard. Now paste it somewhere safe.`,
				toolate: `It is too late to save anything. Everything has already happened.`,
				existed: `NEW`,
				steamWarning: `Steam error. Autosave and achievements will not work. Try relaunching the game.`
			}
		},
		ru: {
			splash: {
				sixtyfour: `ШЕСТЬДЕСЯТ&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ЧЕТЫРЕ`,
				continue: `<span>ПРОДОЛЖИТЬ</span><div class="keyboard">Esc</div>`,
				start: `<span>НАЧАТЬ</span><div class="keyboard">Esc</div>`,
				soundoff: `ЗВУК ВЫКЛЮЧЕН`,
				soundon: `ЗВУК ВКЛЮЧЁН`,
				save: `СОХРАНИТЬ`,
				load: `ЗАГРУЗИТЬ`,
				language: `ЯЗЫК: РУССКИЙ`,
				reset: `ЗАНОВО`,
				credit: `©2024 Олег Данилов, издатель Playsaurus. Версия`,
				warning: `Ты вообще всё потеряешь, без шуток. Зажми и держи, чтобы продолжить.`,
				glory: `ДОСТИЖЕНИЯ`,
				deglory: `НАЗАД`,
				quit: `ВЫЙТИ`,
				export: `Экспорт`,
				import: `Импорт`,
				flashbang: `Игра содержит яркие вспышки. Если они для вас неприемлемы, вы можете отключить эффекты, нажав на эту иконку.`
			},
			achievements: [
				{
					name: `Золото дураков`,
					description: `Найти немного элмерина`
				},
				{
					name: `Дип Пёпл`,
					description: `Найти кванетит`
				},
				{
					name: `Кровь земли`,
					description: `Найти бета-пилен`
				},
				{
					name: `Зелёная энергия`,
					description: `Найти адский камень`
				},
				{
					name: `Опасное стекло`,
					description: `Найти хромалит`
				},
				{
					name: `Господень бетон`,
					description: `Найти звёздную пену`
				},
				{
					name: `Оно моет посуду?`,
					description: `Найти пустой камень`
				},
				{
					name: `Там, где не светит Солнце`,
					description: `Найти пустоту`
				},
				{
					name: `Охотник за привидениями`,
					description: `Найти реальность`
				},
				{
					name: `Ницше`,
					description: `Посмотреть в бездну 64 раза`
				},
				{
					name: `64K`,
					description: `Найти 64 000 камней`
				},
				{
					name: `64M`,
					description: `Найти 64 000 000 камней`
				},
				{
					name: `64B`,
					description: `Найти 64 000 000 000 камней`
				},
				{
					name: `Можешь начинать заново`,
					description: `Застрять в самом начале`
				},
				{
					name: `Перпетум шмобиле`,
					description: `Построить рядом два хранилища`
				},
				{
					name: `Может отдохнуть?`,
					description: `Играть 64 часа`
				},
				{
					name: `Должен... Ломать`,
					description: `Кликнуть по кубу 6400 раз`
				},
				{
					name: `Архитектор`,
					description: `Построить 64 машины`
				},
				{
					name: `Разрушитель`,
					description: `Уничтожить 64 машины`
				},
				{
					name: `Адищще`,
					description: `Иметь 9 бункеров ада`
				},
				{
					name: `Конец/Начало`,
					description: `Взорвать обратный разлом`
				},
				{
					name: `Куки кликер`,
					description: `Кликнуть печеньку`
				},
				{
					name: `Пьяный моряк`,
					description: `Погудеть 64 раза без причины`
				},
				{
					name: `Мистер Рудокоп`,
					description: `Иметь 9 добывающих каналов`
				},
				{
					name: `Тут есть конец?`,
					description: `Докопать до 64 километров`
				},
				{
					name: `Сет Брандл`,
					description: `Телепортироваться <s>1</s> 64 раза`
				},
				{
					name: `Красно-синий Камень`,
					description: `Пройти игру ничего не ломая в течение 15 минут и имея менее 15 защитных хранилищ`
				},
				{
					name: `Прямо в ад!`,
					description: `Найти адский камень за первые 64 минуты игры`
				},
				{
					name: `Копай глубже`,
					description: `Докопать до 64 метров`
				},
				{
					name: `Стало жарко?`,
					description: `Докопать до 640 метров`
				},
				{
					name: `Слишком глубоко`,
					description: `Докопать до 6400 метров`
				},
				{
					name: `64 км/ч вниз`,
					description: `Докопать до глубины 6400м в течение 6 минут с момента установки нового добывающего канала`
				},
				{
					name: `Неофобия`,
					description: `Пройти игру ни разу не улучшая добывающий канал`
				}
			],
			resources: [
				`Чаронит`,
				`Элмерин`,
				`Кванетит`,
				`Бета-пилен`,
				`Адский камень`,
				`Хромалит`,
				`Звёздная пена`,
				`Пустой камень`,
				`Пустота`,
				`Реальность`
			],
			entities: {
				pinhole: {
					name: `?`,
					description: `U/D, C/S, T/B, E/νE, μ/νμ, τ/ντ, G/γ, Z/W, H, Δ/νΔ`
				},
				gradient: {
					name: `Дифференциальный колодец`,
					description: `Бесконечный ресурсный куб. Взаимодействует с большинством дестабилизаторов и резонаторов. Требует подключения к обратному разлому через проводники.`
				},
				chasm: {
					name: `Обратный разлом`,
					description: `Мост в неизвестность.`
				},
				conductor: {
					name: `Проводник`,
					description: `Соединяет обратный разлом с промышленными хранилищами.`
				},
				pump: {
					name: `Извлекающий канал`,
					description: `Извлекает ресурсы и выкладывает их вокруг себя.`
				},
				pump2: {
					name: `Добывающий канал`,
					description: `Улучшение извлекающего канала. Быстро добывает большое количество ресурсов и раскладывает их еще дальше от себя.`
				},
				vault: {
					name: `Адский бункер`,
					description: `Защищает 1024 адских камня от среды вокруг.`
				},
				cube: {
					name: `Куб с ресурсами`,
					description: `Добытые ресурсы.`
				},
				destabilizer: {
					name: `Дестабилизатор`,
					description: `Поставь рядом с добытым кубом, чтобы сломать его в два раза быстрее. Работает на элмерине. Дополнительные дестабилизаторы усиливают эффект.`,
					remdescription: `Удваивает силу дробления ресурсов, если примыкает к добытому кубу. Работает на элмерине. Дополнительные дестабилизаторы усиливают эффект.`
				},
				destabilizer2: {
					name: `Промышленный дестабилизатор`,
					description: `Улучшение для дестабилизатора. Увеличивает силу дробления в 4 раза. Требует 64 элмерина. Дополнительные дестабилизаторы усиливают эффект.`
				},
				destabilizer2a: {
					name: `Адский дестабилизатор`,
					description: `Модификация индустриального дестабилизатора. Увеличивает силу дробления в 625 раз, если в кубе есть адский камень. Если нет — не работает. Работает на адском камне. Дополнительные дестабилизаторы усиливают эффект.`
				},
				doublechannel: {
					name: `Система охлаждения`,
					description: `Поставь рядом с добывателем кубов, чтобы добывать в два раза быстрее. Дополнительные системы увеличивают эффект.`,
					remdescription: `Удваивает поток в исходном канале, если примыкает к нему. Дополнительные системы увеличивают эффект.`
				},
				doublechannel2: {
					name: `Активная система охлаждения`,
					description: `Улучшение для системы охлаждения. Утраивает поток в исходном канале, если примыкает к нему. Дополнительные системы увеличивают эффект.`
				},
				valve: {
					name: `Обратный клапан`,
					description: `Не даёт добывателю кубов вернуться в изначальное положение если находится на соседней клетке. Работает на чароните.`,
					remdescription: `Останавливает обратный поток в исходном канале. Работает на чароните.`
				},
				auxpump: {
					name: `Внешний насос`,
					description: `Улучшение для обратного клапана. Создает давление в исходном канале, если примыкает к нему. Требует 8 элмеринов. Дополнительные насосы не увеличивают давление в канале.`
				},
				auxpump2: {
					name: `Насосная станция`,
					description: `Улучшения для внешнего насоса. Создает в 4 раза большее давление в исходном канале, если примыкает к нему. Требует 256 элмеринов и 4 бета-пилена для работы. Дополнительные насосы не увеличивают давление в канале.`
				},
				entropic: {
					name: `Энтропический резонатор`,
					description: `Периодически дробит ресурсы в примыкающих кубах. Работает на кванетите.`
				},
				entropic2: {
					name: `Энтропический резонатор II`,
					description: `Улучшение для энтропического резонатора. Дробит ресурсы в 3 раза быстрее. Работает на хромалите.`
				},
				entropic2a: {
					name: `Энтропический конденсатор`,
					description: `Улучшение для энтропического резонатора. Дробит ресурсы в момент их появления с 600% силы. Но делает это один раз для каждого куба. Требует 8 хромалитов для работы.`
				},
				entropic3: {
					name: `Пустотный резонатор`,
					description: `Улучшение для энтропического резонатора II. В момент аннигиляции дробит кубы вокруг с невероятной силой.`
				},
				converter32: {
					name: `Цистерна обогащения Чаронита`,
					description: `Поддерживает медленную реакцию кванентита с чаронитом для производства элмерина.`
				},
				converter13: {
					name: `Отстойник Чаронита`,
					description: `Фильтрует кваненит из осадка сжиженного чаронита в присутствии катализаторов.`
				},
				converter41: {
					name: `Окислитель Бета-Пилена`,
					description: `Сжигает бета-пилен для производства чаронита и незначительного количества других элементов.`
				},
				converter76: {
					name: `Звёздный облучатель`,
					description: `Облучает звёздную пену хромалитом, конвертируя её в хромалиты, которые за счёт распада производят большое количество адских камней, бета-пилена, кванетита и элмерина.`
				},
				converter64: {
					name: `Звёздный реактор`,
					description: `Поддерживает управляемое слияния хромалита и звёздной пены в бета-пилен. Не работает вблизи других звёздных реакторов.`
				},
				reflector: {
					name: `Звёздный отражатель`,
					description: `Увеличивает эффективность примыкающего звёздного реактора.`
				},
				mega1: {
					name: `Башня потоковой материи`,
					description: `Улучшает видимость, сжимая летящие ресурсы. Может существовать только одна.`
				},
				mega1a: {
					name: `Башня потоковой материи II`,
					description: `Улучшение для башни потоковой материи. Увеличивает скорость переноса. Может существовать только одна.`
				},
				mega1b: {
					name: `Башня потоковой материи III`,
					description: `Улучшение для башни потоковой материи II. Сжимает ресурсы ещё сильнее. Может существовать только одна.`
				},
				mega2: {
					name: `Башня переработки`,
					description: `Позволяет перерабатывать машины, возвращая 90% затраченных ресурсов. Может существовать только одна.`
				},
				mega3: {
					name: `Башня разборки`,
					description: `Улучшение для башни переработки. Позволяет разбирать машины, возвращая все затраченные ресурсы. Может существовать только одна.`
				},
				voidsculpture: {
					name: `Алтарь восхищения пустотой`,
					description: `Помогает игнорировать визуальный шум от работы пустотных машин.`
				},
				eye: {
					name: `Заправочный контроллер`,
					description: `Указывает на машины, требующие топлива. Может существовать только один.`
				},
				cookie: {
					name: `Печенька`,
					description: `Как она сюда попала?`
				},
				injector: {
					name: `Инжектор Адского Камня`,
					description: `Заменяет случайный ресурс из примыкающего куба на адский камень, если в кубе его нет. Имеет 32 заряда и требует 32 адских камня и 64 кваненита для работы.`
				},
				silo: {
					name: `Подземное хранилище`,
					description: `При запуске заправляет все примыкающие машины, а затем автоматически заправляет их ещё 16 раз.`
				},
				silo2: {
					name: `Промышленное хранилище`,
					description: `Улучшение для подземного хранилища. При запуске заправляет все примыкающие машины, а затем автоматически заправляет их ещё 64 раза.`
				},
				vessel: {
					name: `Защитная цистерна`,
					description: `Защищает 32 хромалита от распада. Потребляет адский камень.`
				},
				vessel2: {
					name: `Защитное хранилище`,
					description: `Улучшение для защитной цистерны. Защищает 32768 хромалитов от распада. Потребляет реальность.`
				},
				consumer: {
					name: `Каталитический преобразователь`,
					description: `Перехватывает примыкающие раздробленные ресурсы. После захвата 1024 ресурсов, выдает больше накопленного. Количество дополнительных ресурсов увеличивается с каждой выдачей вплоть до 100%. После 16 секунд бездействия эффект сбрасывается.`
				},
				preheater: {
					name: `Каталитический подогреватель`,
					description: `Увеличивает скорость преобразования в примыкающих конвертерах. Каждый конвертер увеличивает скорость подогревателя вплоть до 300%, если их 8.`
				},
				hollow: {
					name: `Пустой камень`,
					description: `Столько дырок...`
				},
				strange: {
					name: `Пустая скала`,
					description: `Похоже, что она тут уже давно.`
				},
				strange1: {
					name: `Лагерь изучения пустой скалы`,
					description: `Заставляет звездную пену реагировать с 512 адскими камнями вместо 64. СЕВЕР.`
				},
				strange2: {
					name: `Комбинат пустой скалы`,
					description: `Удваивает количество пустых камней и увеличивает скорость их появления.`
				},
				strange3: {
					name: `Восстановленная скала`,
					description: `Значительно увеличивает скорость появления пустых камней и делает это тихо.`
				},
				generaldecay: {
					name: `Универсальный реактор распада`,
					description: `Значительно увеличивает эффективность распада хромалитов. Может существовать только один.`
				},
				waypoint: {
					name: `Навигатор`,
					description: `Телепортирует к тебе следующий доступный навигатор.`
				},
				annihilator: {
					name: `Аннигилятор`,
					description: `Производит пустоту в момент аннигиляции адских камней и звёздной пены. Потребляет пустой камень.`
				},
				flower: {
					name: `Пустой цветок`,
					description: `Уменьшает шанс искажений времени. Компенсирует эффект одного пустого камня. Ставится на пустом камне. Уничтожает пустой камень, на который поставлен.`
				},
				fruit: {
					name: `Пустой плод`,
					description: `Эволюция пустого цветка. Не дает формироваться пустым камням, вместо этого питая себя. Производит пустые камни.`
				},
				eraser: {
					name: `Утилизация`,
					description: `Уничтожает машину, возвращая 50% потраченных на неё ресурсов.`
				},
				eraser2: {
					name: `Переработка`,
					description: `Перерабатывает машину, возвращая 90% потраченных на неё ресурсов.`
				},
				eraser3: {
					name: `Разборка`,
					description: `Разбирает машину, возвращая все потраченные на неё ресурсы.`
				},
				clicker1: {
					name: `Кванетитовый осциллятор`,
					description: `Позволяет нажать на куб и держать, чтобы сломать его. Может существовать только один.`
				},
				clicker2: {
					name: `Осциллятор Адского Камня`,
					description: `Улучшение кванетитового осциллятора. Увеличивает частоту колебаний. Может существовать только один.`
				},
				clicker3: {
					name: `Хромалитовый осциллятор`,
					description: `Улучшение осциллятора адского камня. Максимизирует частоту колебаний. Может существовать только один.`
				},
				stabilizer: {
					name: `Стабилизатор`,
					description: `Стабилизирует один примыкающий выброс и временно использует его силу.`
				},
				stabilizer2: {
					name: `Стабилизатор II`,
					description: `Улучшение для стабилизатора. Увеличивает мощность и стабильность.`
				},
				stabilizer3: {
					name: `Расколотый стабилизатор`,
					description: `Аномальное улучшение. Увеличивает мощность и максимизирует стабильность. Может существовать только один.`
				}
			},
			messages: [
			    "Ты где?",
			    "Вообще не могу понять где я",
			    "Окей, что ты сейчас видишь?",
			    "Тут какой-то аппарат. Выглядит так, как будто его нельзя трогать",
			    "Что за аппарат?",
			    "Погоди, или можно...",
			    "Ты же сейчас не суешь руки в непонятный аппарат?",
			    "Работает! Он что-то делает",
			    "???",
			    "Огромный чёрный куб. Он такой гладкий, прям хочется его разбить",
			    "Ты куришь что-то?",
			    "Теперь у меня 64 камня!",
			    "Ну ладно. Смотрю тебе там весело.",
			    "Я нашел жёлтый камень!",
			    "Поздравляю, чувак!",
			    "Думаю я могу сам делать машины. Сделаю что-нибудь, чтобы кубы легче разбивались. Если куб появится в соседней клетке, даже по диагонали, машина должна сработать.",
			    "Ты в какую-то игру играешь чтоли? Ты меня пугаешь",
			    "Осталось только положить вот сюда жёлтый камень.",
			    "Лишь бы ты был счастлив... А если серьёзно, ты зайдешь сегодня?",
			    "Определённо! Буду через пару часов, надо только тут закончить.",
			    "Так, а что конкретно ты делаешь?",
			    "Я позже напишу. Нужно следить за машиной, сорян",
			    "Походу машины влияют на другие машины, если они находятся на соседних клетках. Например, вентилятор надо поставить рядом с первым аппаратом, чтобы он быстрее работал.",
			    "Очевидно! Все прям ясно и чётко",
			    "Ну?",
			    "Ну ты где?",
			    "Мы тебя тут уже сто лет ждём.",
			    "В смысле? Я всё ещё тут.",
			    "ДА ГДЕ???",
			    "Нашел синий камень. Или фиолетовый точнее? На звук как какой-то старинный бабушкин подсвечник. Кажется я им могу убирать машины, которые поставил не туда.",
			    "Ты издеваешься что ли? Ты же сказал что придешь. Какого хрена?!",
			    "Да не бесись, я буду через пару минут",
			    "Класс, я могу с помощью [Q] клонировать машины или убирать их если кликнуть сначала на пустую клетку! А с помощью [Alt] можно увидеть то, что за высокими машинами.",
			    "БЕГОМ",
			    "Вы еще там?",
			    "ОФИГЕТЬ!!!",
			    "Ты где????",
			    "У тебя все нормально??",
			    "???",
			    "Ты чего?",
			    "ТЫ В ПОРЯДКЕ? ТЫ ГДЕ?",
			    "Да все нормально! Что не так то?",
			    "Что не так?! Ты не отвечаешь уже две недели! Я к тебе заходил, тебя дома нет. Просто напиши где ты находишься, что сложного. Ты не дома?",
			    "Чувак, ты о чём? Я писал тебе две минуты назад.",
			    "ДА ТЫ НОРМАЛЬНЫЙ ВООБЩЕ??? Сначала ты не пришёл, потом вообще исчез. А теперь такой типа всё нормально!",
			    "Я тебе простой вопрос задал",
			    "ТЫ ГДЕ?",
			    "Тут я.",
			    "Г Д Е",
			    "Погоди...",
			    "Чувак, не смешно. Скажи где ты. Ты можешь просто ответить?",
			    "Ну...",
			    "Я не знаю на самом деле.",
			    "Погоди минутку",
			    "В смысле ты не знаешь?",
			    "Мне надо подумать",
			    "Всё нормально? Ты в безопасности? Может позвонить кому-нибудь?",
			    "Не, всё нормально. Я это",
			    "Напишу чуть позже",
			    "Блин, чувак, да что происходит то?",
			    "Мне страшно",
			    "Я кажется не понимаю где я",
			    "Так странно. Не, со мной всё нормально. Я просто даже не знаю как это всё описать.",
			    "Типа как сон, но как будто бы всё-таки нет. Тут всё белое, и машины эти ещё. И кубы. Я вообще не вдупляю.",
			    "У меня с головой всё в порядке вроде. Я только что понял, что всё вокруг очень странное, а я вообще с ходу не обратил внимания на то, что никогда такого не видел.",
			    "Я нашёл красные камни, и пугает то, что мне норм всё это. Типа ну да, красный камень, всё нормально.",
			    "Значит ты не шутишь...",
			    "Да, я понимаю, как это звучит. И да, у меня сейчас все это прямо перед глазами.",
			    "Может тебе помочь как-то?",
			    "Просто пиши мне и всё.",
			    "Не вопрос, конечно. Кстати, полиция тебя ищет. Ты теперь официально пропавший без вести.",
			    "Ты им показал переписку?",
			    "А чем это поможет? Я всё удаляю.",
			    "Спасибо!",
			    "Ну как дела?",
			    "Оказывается, я могу двигаться с помощью WASD. Но тут нет ничего интересного вокруг, только странная скала на севере.",
			    "Ага, значит у тебя компас в телефоне работает!",
			    "Ну, скала просто там «наверху», так что я думаю, что это север.",
			    "Логично",
			    "А еще, у меня нет телефона...",
			    "И как ты мне пишешь?",
			    "Я не знаю!! Я просто вижу то, что ты мне присылаешь. И могу отвечать! Это сложно объяснить.",
			    "Не парься. Главное, что мы можем общаться.",
			    "Ага, ты прав.",
			    "А расскажи, что это за машины",
			    "В смысле?",
			    "Что это такое, что они делают, как работают?",
			    "Ну они такие футуристичные, с проводами, трубками и всё такое",
			    "Одна, например похожа на большой пластмассовый ящик с медной катушкой наверху, в которую вставляется синий камень. Ещё сбоку написано \"E—01SR\", а ниже \"Caution! Strong entropy radiation\"",
			    "И что это значит?",
			    "Не знаю на самом деле. Наверное внутри какая-то энтропическая радиация",
			    "Стоп, я думал ты сам эти машины делаешь?",
			    "Ага... Я понимаю к чему ты.",
			    "Я просто каким-то образом их делаю из кубиков. И я понятия не имею что внутри. Да, если подумать, звучит странно. Надо разобраться.",
			    "Ещё тут жёлтые и синие кубики походу не бесконечные, так что нужны еще конвертеры или новая шахта.",
			    "Звучит как план",
			    "Вот это был настоящий геморрой!",
			    "?",
			    "Зелёный камень! Я замучался его отламывать. Надо что-то придумать, если они продолжат вылезать.",
			    "Всяко ты придумаешь какой-нибудь аппарат для этого",
			    "Полюбому!",
			    "Огонь! Адский камень идёт в ад",
			    "Гореть ему в аду!",
			    "Помнишь, ты про машины спросил?",
			    "Ага",
			    "Мне кажется они ненастоящие",
			    "В смысле?",
			    "Это как во сне. Я не могу посмотреть, что внутри и даже не могу посмотреть на них с другой стороны.",
			    "Какое-то абстрактное представление необъяснимой технологии",
			    "Думаю, что я вижу эти машины в так, потому что представляю себе таким образом их функцию.",
			    "Типа если что-то рубит деревья, то должно выглядеть, как топор?",
			    "Типа того",
			    "Ну хотя бы ты сам звучишь как реальный человек.",
			    "Ага, походу ты единственная реальность, которая у меня сейчас есть",
			    "Я откопал новые камни, который распадается на другие камни!",
			    "Ну, не отлично, не ужасно",
			    "Мне надо сказать тебе кое-что необычное",
			    "Видишь ли ты иронию в написанном?",
			    "Может быть это странное место так влияет на меня, но я забыл как тебя зовут",
			    "Видимо нам нужно чуть больше проводить времени вместе",
			    "Я серьёзно",
			    "Меня зовут Дюк Ньюкем, очевидно",
			    "Чувак, заканчивай!",
			    "Твоя мама мне вчера ночью тоже самое сказала",
			    "Это не смешно! Ты меня пугаешь. Всё в порядке?",
			    "Бля",
			    "Я походу сам свое имя вспомнить не могу",
			    "Вообще вылетело! Пиздец какой-то. И твоё я тоже не помню.",
			    "Может это просто массовая истерия? Я слышал что она сразу с несколькими людьми происходит. Давай просто успокоимся, может все нормально.",
			    "Ну конечно, истерия",
			    "Я всё ещё не могу вспомнить имена",
			    "Я тоже. И не только это",
			    "Ага! Как я выгляжу? Когда мы познакомились?",
			    "Как выглядит мой дом, наши друзья? Мы вообще встречались?",
			    "Походу мы тут оба застряли. И главное, что не понятно, всегда ли так было, или что-то в какой-то момент произошло. Похоже на сон. Но кто его смотрит?",
			    "Не видишь аппаратов каких-нибудь на горизонте? Может куб где-то вылез?",
			    "Смешно",
			    "Так может придумаем тогда себе имена?",
			    "Ты говоришь как Вин",
			    "Окей",
			    "Я не против Вина",
			    "Эй, Вин. Доедай маргарин, Вин. Да, нормас.",
			    "А ты будешь Чарпс",
			    "Доедай маргарарпс, Чарпс!",
			    "Ну и тупняк!",
			    "Мне нравится Чарпс. Приятно познакомиться, Вин",
			    "Взаимно, Чарпс",
			    "ЧТО ПРОИСХОДИТ",
			    "Что?",
			    "Белые камни уничтожают зелёные!",
			    "И распадающихся теперь миллион! Всё взрывается как в ядерном реакторе!",
			    "Жесть! Ты в порядке?",
			    "Да, всё нормально! Просто тут хаос какой-то. Мне надо что-нибудь построить чтобы это остановить. Может быть нужно ещё раз взглянуть на скалу на севере.",
			    "Ты придумаешь что-нибудь, Чарпс!",
			    "Очень странно звучит!",
			    "Ну, в смысле имя. Наверное я когда-нибудь привыкну. Ведь так, Вин?",
			    "Ага! Странно звучит, да.",
			    "Помнишь я говорил о странной скале на севере?",
			    "Не особо",
			    "Короче там есть скала. И я понимаю что всё и так уже страннее некуда. Но вот этот штука ЕЩЁ страннее, чем всё остальное.",
			    "Не понимаю что случилось. Я решил в ней покопаться и она поменяла что-то прямо в природе вселенной!",
			    "Это опасно?",
			    "Не знаю. Изменилось совсем чуть-чуть.",
			    "Интересно, что она еще может.",
			    "Ладненько, только ты там не уничтожь вселенную между делом.",
			    "Я постараюсь.",
			    "Так, это был САМЫЙ прочный камень в моей жизни! Но кажется я знаю теперь как разбить его быстрее.",
			    "Новый камень?",
			    "Ага, самый необычный пока",
			    "Воу, кажется вселенная поменялась чуть больше чем я думал. Ты почувствовал?",
			    "Что почувствовал?",
			    "Видимо это только у меня.",
			    "Ты случайно не видел прямо сейчас огромный куб перед глазами?",
			    "Ээ, холодильник считается?",
			    "Проехали",
			    "Офигеть, тут новый камень и он прям суперчёрный. Ощущение, будто он из потустороннего мира.",
			    "Из более потустороннего, чем предыдущий?",
			    "Это другое! Он прям ледяной, но не обжигает. Как будто для него вообще не существует температуры и он с тобой не взаимодействует. Он сделан не из вещества, у него нет цвета и вообще ничего, к чему мы привыкли. Понимаешь?",
			    "Если честно, не очень.",
			    "Кажется я понял. Дырявыми камнями я могу собирать вот эту черноту из воздуха. Она собирается в абсолютно одинаковые кристаллы, но у них вообще нет никаких свойств. И всё это немного приводит вселенную в норму.",
			    "Похоже на воздушный фильтр",
			    "Да, именно! Похоже в какой-то момент я испортил воздух.",
			    "Только вслух это никому не говори",
			    "Я решил раскопать ту странную скалу на севере. Может быть с её помощью я смогу понять что здесь происходит. У меня есть ощущение, что она не просто нарушает законы вселенной, а управляет ими!",
			    "Как ты пришел к такому выводу?",
			    "Ты мне поверишь, если я скажу, что просто почувствовал?",
			    "Конечно! Я вообще уже во что угодно готов поверить. Скала управляет вселенной? Чё бы нет!",
			    "У меня сейчас глаза выпадут!",
			    "Придерживай их",
			    "Эти машины всё сильнее сверкают и гремят. Может надо подкрутить что-то. Или себя подкрутить. Или и то и то.",
			    "Другое дело!",
			    "Кого-то подкрутил?",
			    "Стоп, что-то не так.",
			    "Я построил одну штуку из черноты. И это не машина. Но она как-то влияет на навигаторы.",
			    "Что за навигаторы?",
			    "Они смещают всё во вселенной кроме тебя, с их помощью можно быстро куда-то добраться.",
			    "Откуда ты знаешь, что они двигают вселенную, а не тебя?",
			    "Хм, я об этом не подумал",
			    "Кажется, я сломал вселенную",
			    "Ерунда какая-то",
			    "Машины поменялись, все поменялось",
			    "Надеюсь это можно починить",
			    "Вин?",
			    "Чувак, ты тут?",
			    "Так так так только не это! Я надеюсь ты просто отлить отошёл.",
			    "ВИН!",
			    "ЧТО?",
			    "Звучит всё ещё странно.",
			    "Слава богу!",
			    "Че-то новое построил?",
			    "Я думал что сломал вселенную и тебя с ней! Я попал в какой-то потусторонний мир, вокруг были символы какие-то, я думал, что это обломки вселенной. Похоже что это другая вселенная или какая-то другая версия этой, потому что они похожи по расположению, а теперь они еще и соединены.",
			    "Путешествуешь? Звучит прикольно!",
			    "Прикольно? Ты вообще прочитал что я написал? ДРУГАЯ ВСЕЛЕННАЯ!!!",
			    "Так, тебе пора принять факт, что твои способности удивлять меня стремительно угасают.",
			    "Вообще да",
			    "Это не камень, это линза",
			    "Она фокусирует всё в одну точку. В смысле вообще всё! Время, пространство, все законы физики. ВСЁ!",
			    "Ты инструкцию что-ли нашел?",
			    "Понятия не имею откуда она здесь или откуда мы здесь. Я просто понял что она делает.",
			    "Так... Ты хочешь всё куда-то сфокусировать или что?",
			    "Я не знаю как. Может быть всё вокруг существует только для этого. Сейчас эта штука просто висит в воздухе, как будто так и надо.",
			    "И что должно при этом произойти?",
			    "Без понятия",
			    "Чем больше я думаю, тем больше я понимаю, что нереальны не только твои машины.",
			    "Я думал над простыми вопросами, и понял, что не знаю ни одного ответа.",
			    "Помнишь, я сказал, что тебя полиция ищет? Я правда так думал, а теперь, когда я начал себе задавать вопросы, в этом нет смысла.",
			    "Я пришел в участок или позвонил туда? И кто с той стороны был? Полицейские? Где этот участок на карте города? Где вообще этот город? Я живу в городе? Как он называется? А что за страна? Вообще существую страны какие-нибудь?",
			    "Вообще ни на один не могу ответить. Пока не появились вопросы всё было в порядке. И я даже боюсь придумывать новые.",
			    "Прости",
			    "Да не, ты не виноват. Мы же вместе с тобой застряли тут, насколько я могу понять.",
			    "Надеюсь только, что ты разберешься где конкретно мы застряли.",
			    "Да, я тоже!",
			    "Посмотрим, чем всё закончится. Надеюсь ещё что это не вечный ад какой-нибудь или лимб там.",
			    "Не очкуй, Данте!",
			    "Во, другое дело. Эти штуки высосут вообще всё из этой вселенной",
			    "Звучишь как нефтяной магнат",
			    "Я уже задолбался что всё шумит, надо всё время чего-то пристраивать и рассчитывать. А эта машина другое дело. Она даже до черного мира добивает.",
			    "Это не опасно?",
			    "Сама идея опасности тут весьма размыта.",
			    "Пора сделать что-то монументальное.",
			    "Ты о чём?",
			    "Не знаю. Но это будет монументально!",
			    "Типа огромная машина?",
			    "Не, я в переносном смысле",
			    "Тогда вперёд!",
			    "Бляяя",
			    "Я где-то ошибся. Обратный разлом взорвался. Всё рушится.",
			    "Ты в порядке?",
			    "Да, но оно ломает машины! И я ничего не могу построить! Пиздец!",
			    "Погоди, может так и надо?",
			    "НЕТ! Всё не так!",
			    "Откуда ты знаешь?",
			    "Погоди, надо что-то придумать",
			    "Ну понеслась!",
			    "Тебя! Ты только что прошёл мимо каштана на нелепой планете в верхнем рукаве вон той галактики.",
			    "Никуда я не шел! Какая ещё галактика?",
			    "А, отсюда сложно понять точное время, наверное это ещё не произошло. Просто потерпи 15 миллиардов лет!",
			    "Да не вопрос вообще. Ты кстати зайдёшь?",
			    "Определённо! Буду через пару часов, надо только тут закончить.",
			    "Ага, увидимся тогда!",
			    "Только это, Чарпс...",
			    "Не опаздывай в этот раз, ок?",
			    "Я не опоздаю, Вин. Обещаю."
			],
			credits: [
			    "Начало",
			    "Я очень ценю, что тебе удалось дойти до самого конца, где всё начинается",
			    "Поздравляю, типа!",
			    "Только посмотри на это:",
			    "Всего ресурсов получено:",
			    "Чарониты:",
			    "Элмерины:",
			    "Кванетиты:",
			    "Бета-пилен:",
			    "Адские камни:",
			    "Хромалиты:",
			    "Звёздная пена:",
			    "Пустые камни:",
			    "Пустота:",
			    "Реальность:",
			    "Машин построено:",
			    "Машин уничтожено:",
			    "Максимальная глубина канала в метрах:",
			    "Странный камень потроган:",
			    "Телепортации:",
			    "Клики по кубам:",
			    "Искажения времени:",
			    "Время игры:",
			    "ч",
			    "Создатель игры:<br>Олег Данилов",
			    "Дополнительная графика:<br>Юлия Ногтева",
			    "Редактура диалогов:<br>Абдурахман Зулумханов и Анна Питерсон",
			    "Издатель в Steam:<br>Playsaurus",
			    "Игровое тестирование:<br>сообщество Лепрозория, Абдурахман Зулумханов и Playsaurus",
			    "Конец",
			    "Можешь поиграть в Куки Кликер теперь, или не знаю",
			    "Музыка:<br>Shallow Anne Джейка Чадноу"
			],
			explainer: [
				`Нажми и держи.`,
				`Всегда кликай на основание.`,
				`<span class="keyboard">Q</span>, <span class="keyboard">Esc</span> или правая кнопка мыши, чтобы отменить.`,
				`Зажми <span class="keyboard">Alt</span> чтобы рассмотреть что-то.`,
				`Нажми <span class="keyboard">Q</span> над пустой клеткой чтобы ломать машины.`,
				`Нажми <span class="keyboard">Q</span> над машиной чтобы попробовать построить ещё.`,
				`WASD или тащи с правой кнопкой мыши чтобы осмотреться.`
			],
			random: {
				paste: `Код сохранения скопирован в буфер обмена. Теперь сохрани его в безопасное место.`,
				toolate: `Слишком поздно сохраняться. Всё уже случилось.`,
				existed: `НОВОЕ`,
				steamWarning: `Ошибка Steam. Автосохранение и достижения работать не будут. Попробуй запустить игру заново.`
			}
		},
		de: {
		    "splash": {
		        "sixtyfour": "SIXTY&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FOUR",
		        "continue": "<span>WEITER</span><div class=\"keyboard\">Esc</div>",
		        "start": "<span>START</span><div class=\"keyboard\">Esc</div>",
		        "soundoff": "TON IST AUS",
		        "soundon": "TON IST AN",
		        "save": "SPEICHERN",
		        "load": "LADEN",
		        "language": "SPRACHE: DEUTSCH",
		        "reset": "RESET",
		        "credit": "©2024 Oleg Danilov, veröffentlicht von Playsaurus. Version",
		        "warning": "Du wirst alles verlieren, kein Witz. Halte gedrückt, um zu bestätigen.",
		        "glory": "ERFOLGE",
		        "deglory": "ZURÜCK",
		        "quit": "BEENDEN",
		        "export": "Exportieren",
		        "import": "Importieren",
		        "flashbang": "Helle, blinkende Lichter sind Teil dieses Spiels. Wenn Sie empfindlich darauf reagieren, können Sie das Blitzen durch Klicken auf dieses Symbol deaktivieren."
		    },
		    "achievements": [
		        {
		            "name": "Narrengold",
		            "description": "Erhalte etwas Elmerin"
		        },
		        {
		            "name": "Dunkellila",
		            "description": "Erhalte Quanetit"
		        },
		        {
		            "name": "Blut des Landes",
		            "description": "Erhalte Beta-Pylen"
		        },
		        {
		            "name": "Grüne Energie",
		            "description": "Finde ein Juwel der Hölle"
		        },
		        {
		            "name": "Heißes Glas",
		            "description": "Finde einen Chromalit"
		        },
		        {
		            "name": "Heiliger Beton",
		            "description": "Erhalte etwas heiligen Schaum"
		        },
		        {
		            "name": "Kann es Geschirr spülen?",
		            "description": "Erhalte einen Hohlstein"
		        },
		        {
		            "name": "Wo die Sonne nicht scheint",
		            "description": "Erhalte etwas Leere"
		        },
		        {
		            "name": "Who you gonna call?",
		            "description": "Erhalte etwas Realität"
		        },
		        {
		            "name": "Nietzsche",
		            "description": "Starre 64 Mal in den Abgrund"
		        },
		        {
		            "name": "64K",
		            "description": "Erhalte 64.000 Steine"
		        },
		        {
		            "name": "64M",
		            "description": "Erhalte 64.000.000 Steine"
		        },
		        {
		            "name": "64Mrd",
		            "description": "Erhalte 64.000.000.000 Steine"
		        },
		        {
		            "name": "Du kannst dich jetzt ausruhen",
		            "description": "Bleibe am Anfang stecken"
		        },
		        {
		            "name": "Perpetum Schmobile",
		            "description": "Kombiniere zwei Silos"
		        },
		        {
		            "name": "Brauchst du eine Pause?",
		            "description": "Spiele 64 Stunden lang"
		        },
		        {
		            "name": "Muss... zerstören",
		            "description": "Einen Würfel 6400 Mal anklicken"
		        },
		        {
		            "name": "Architekt",
		            "description": "Baue 64 Maschinen"
		        },
		        {
		            "name": "Zerstörer",
		            "description": "Zerstöre 64 Maschinen"
		        },
		        {
		            "name": "Hellraiser",
		            "description": "Besitze 9 Höllentresore"
		        },
		        {
		            "name": "Ende/Anfang",
		            "description": "Sprenge die umgekehrte Kluft"
		        },
		        {
		            "name": "Cookie-Clicker",
		            "description": "Klicke auf einen Keks"
		        },
		        {
		            "name": "Betrunkener Seefahrer",
		            "description": "Hupe 64 Mal ohne Grund"
		        },
		        {
		            "name": "Mr. Mine",
		            "description": "Besitze 9 Ausgrabungsschächte"
		        },
		        {
		            "name": "Gibt es ein Limit?",
		            "description": "Grabe 64 km tief"
		        },
		        {
		            "name": "Seth Brundle",
		            "description": "Teleportiere <s>1</s> 64 Mal"
		        },
		        {
		            "name": "Rot-Blauer Stein",
		            "description": "Beende das Spiel, ohne 15 Minuten lang etwas zu löschen und weniger als 15 Eindämmungssilos zu haben"
		        },
		        {
		            "name": "Direkt in die Hölle!",
		            "description": "Erhalte innerhalb von 64 Minuten einen Höllenstein"
		        },
		        {
		            "name": "Die Oberfläche ankratzen",
		            "description": "Grabe 64 Meter tief"
		        },
		        {
		            "name": "Ist es heiß?",
		            "description": "Grabe 640 Meter tief"
		        },
		        {
		            "name": "Zu tief",
		            "description": "Grabe 6400 Meter tief"
		        },
		        {
		            "name": "64 km/h nach unten",
		            "description": "Erreiche eine Tiefe von 6400 Metern innerhalb von 6 Minuten nach dem Platzieren von einem neuen Minenschacht"
		        },
		        {
		            "name": "Neophobie",
		            "description": "Schließen Sie das Spiel ab, ohne jemals die Extraktionskanal aufzuwerten"
		        }
		    ],
		    "resources": [
		        "Charonit",
		        "Elmerin",
		        "Quanetit",
		        "Beta-Pylen",
		        "Höllenjuwel",
		        "Chromalit",
		        "Himmlischer Schaum",
		        "Hohler Stein",
		        "Vakuum",
		        "Realität"
		    ],
		    "entities": {
		        "pinhole": {
		            "name": "?",
		            "description": "U/D, C/S, T/B, E/νE, μ/νμ, τ/ντ, G/γ, Z/W, H, Δ/νΔ"
		        },
		        "gradient": {
		            "name": "Steigerungsbrunnen",
		            "description": "Ein ewig abbaubarer Würfel. Reagiert auf die meisten Destabilisatoren und Resonatoren. Sollte über Leitungen mit dem Inverse Chasm verbunden werden."
		        },
		        "chasm": {
		            "name": "Inverse Schlucht",
		            "description": "Eine Brücke ins Unbekannte."
		        },
		        "conductor": {
		            "name": "Leiter",
		            "description": "Verbindet die Inverse Schlucht mit industriellen Silos."
		        },
		        "pump": {
		            "name": "Extraktionskanal",
		            "description": "Extrahiert Ressourcen und platziert diese um sich herum."
		        },
		        "pump2": {
		            "name": "Ausgrabungsschacht",
		            "description": "Ein Extraktionskanal-Upgrade. Fördert schnell eine Menge Ressourcen und platziert sie weiter um sich herum."
		        },
		        "vault": {
		            "name": "Höllengewölbe",
		            "description": "Isoliert 1024 Höllensteine von der Umwelt."
		        },
		        "cube": {
		            "name": "Ressourcenwürfel",
		            "description": "Extrahierte Ressourcen."
		        },
		        "destabilizer": {
		            "name": "Destabilisator",
		            "description": "Platziere ihn neben einem Würfel, um ihn doppelt so schnell zu brechen. Zum Betrieb ist eine Elmerine erforderlich. Zusätzliche Destabilisatoren erhöhen den Effekt."
		        },
		        "destabilizer2": {
		            "name": "Industrieller Destabilisator",
		            "description": "Ein Destabilisator-Upgrade. Vervierfacht die Kraft des Ressourcenvernichtungsprozesses. Benötigt 64 Elmerine zum Betrieb. Zusätzliche Destabilisatoren erhöhen den Effekt."
		        },
		        "destabilizer2a": {
		            "name": "Höllenstein-Destabilisator",
		            "description": "Ein industrielles Destabilisator-Upgrade. Erhöht die Kraft des Rohstoffabbaus um das 625-fache, wenn sich ein Höllenstein im abgebauten Würfel befindet. Andernfalls bietet es keinen Nutzen. Benötigt 1 Höllenstein für den Betrieb. Zusätzliche Destabilisatoren erhöhen den Effekt."
		        },
		        "doublechannel": {
		            "name": "Kanalkühler",
		            "description": "Platziere ihn neben der Würfelmaschine, um doppelt so schnell Würfel zu gewinnen. Zusätzliche Kühler erhöhen den Effekt."
		        },
		        "doublechannel2": {
		            "name": "Aktiver Kanalkühler",
		            "description": "Ein Upgrade für den Kanalkühler. Verdreifacht den Durchfluss in einem Quellkanal, wenn er neben ihm platziert wird. Zusätzliche Kühler erhöhen den Effekt."
		        },
		        "valve": {
		            "name": "Umkehrventil",
		            "description": "Verhindert, dass die Würfelzieh-Maschine in die ursprüngliche Position zurückgesetzt wird, wenn sie daneben steht. Zum Betrieb ist ein Charonit erforderlich."
		        },
		        "auxpump": {
		            "name": "Hilfspumpe",
		            "description": "Ein Upgrade für ein Umkehrventil. Es versorgt einen Quellkanal mit Druck, wenn es neben ihm platziert wird. Benötigt 8 Elmerine zum Betrieb. Zusätzliche Pumpen erhöhen den Druck in einem Quellkanal nicht."
		        },
		        "auxpump2": {
		            "name": "Pumpstation",
		            "description": "Ein Upgrade für eine Hilfspumpe. Sorgt für den vierfachen Druck in einem Quellkanal, wenn sie daneben platziert wird. Benötigt 256 Elmerine und 4 Beta-Pylen zum Betrieb. Mehrere Stationen erhöhen den Durchfluss in einem Quellkanal nicht."
		        },
		        "entropic": {
		            "name": "Entropieresonator",
		            "description": "Zerquetscht regelmäßig Ressourcen, wenn er neben einem Würfel platziert wird. Benötigt ein Qanetite zum Betrieb."
		        },
		        "entropic2": {
		            "name": "Entropieresonator II",
		            "description": "Ein Entropie-Resonator-Upgrade. Zertrümmert Ressourcen 3 Mal schneller. Benötigt zum Betrieb ein Chromalit."
		        },
		        "entropic2a": {
		            "name": "Entropiekondensator",
		            "description": "Ein Entropie-Resonator-Upgrade. Zertrümmert Ressourcen in dem Moment, in dem sie auf der Oberfläche erscheinen, mit 600% Leistung. Aber nur einmal pro Würfel. Benötigt 8 Chromalits für den Betrieb."
		        },
		        "entropic3": {
		            "name": "Leereresonator",
		            "description": "Ein Entropie-Resonator II Upgrade. Wenn die Vernichtung eintritt, zermalmt der Resonator die Würfel um ihn herum mit immenser Kraft."
		        },
		        "converter32": {
		            "name": "Charonit-Anreicherungsbottich",
		            "description": "Reagiert langsam mit Quanetit und Charonit und erzeugt Elmerin."
		        },
		        "converter13": {
		            "name": "Charonit-Sumpf",
		            "description": "Gewinnung von Quanetit aus verflüssigten Charonit-Sedimenten in Gegenwart von Katalysatoren."
		        },
		        "converter41": {
		            "name": "Beta-Pylen-Oxidationsmittel",
		            "description": "Verbrennt Beta-Pylen, um Charonit und Spuren von anderen Elementen zu produzieren."
		        },
		        "converter76": {
		            "name": "Himmelsbestrahlungsgerät",
		            "description": "Bestrahlt Himmelsschaum mit einem Chromalit und wandelt ihn in Chromalits um, die durch den Chromalit-Zerfall eine große Quelle für Höllensteine, Beta-Pylen, Qanetit und Elmerin sind."
		        },
		        "converter64": {
		            "name": "Himmelsreaktor",
		            "description": "Ermöglicht die kontrollierbare Verschmelzung von Chromalits und Himmelsschaum zur Herstellung von Beta-Pylen. Kann nicht in unmittelbarer Nähe zu anderen himmlischen Reaktoren betrieben werden."
		        },
		        "reflector": {
		            "name": "Himmelsreflektor",
		            "description": "Verbessert die Leistung eines benachbarten himmlischen Reaktors."
		        },
		        "mega1": {
		            "name": "Material-Streamer-Turm",
		            "description": "Erhöht die Sichtbarkeit durch Komprimierung der bewegten Ressourcen. Es kann nur einen geben."
		        },
		        "mega1a": {
		            "name": "Materialstreamer-Turm MKII",
		            "description": "Ein Upgrade für den Materialstreamer-Turm. Erhöht die Geschwindigkeit des Ressourcentransfers. Es kann nur einen geben."
		        },
		        "mega1b": {
		            "name": "Materialstreamer-Turm MKIII",
		            "description": "Ein Materialstreamer-Turm MKII-Upgrade. Komprimiert bewegliche Ressourcen noch mehr. Es kann nur einen geben."
		        },
		        "mega2": {
		            "name": "Recyclingturm",
		            "description": "Ermöglicht Maschinenrecycling, das 90% der Ressourcen zurückgibt. Es kann nur einen geben."
		        },
		        "mega3": {
		            "name": "Demontageturm",
		            "description": "Ein Upgrade für den Recycling-Turm. Ermöglicht die Demontage der Maschine und gibt alle Ressourcen zurück. Es kann nur einen geben."
		        },
		        "voidsculpture": {
		            "name": "Altarraum zur Bewunderung der Leere",
		            "description": "Ermöglicht es, die optischen Nachteile der leeren Maschinen zu ignorieren."
		        },
		        "eye": {
		            "name": "Fülldirektor",
		            "description": "Zeigt Maschinen an, die zum Befüllen bereit sind. Es kann nur einen geben."
		        },
		        "cookie": {
		            "name": "Ein Keks",
		            "description": "Wie ist es dort hingekommen?"
		        },
		        "injector": {
		            "name": "Höllenstein-Injektor",
		            "description": "Tauscht eine zufällige Ressource aus einem benachbarten Würfel mit einem Höllenstein, wenn es keinen gibt. Hat 32 Aufladungen, wenn er mit 32 Höllensteinen und 64 Qanetiten ausgestattet ist."
		        },
		        "silo": {
		            "name": "Unterirdisches Silo",
		            "description": "Füllt bei Aktivierung die Maschinen in der Nähe auf und füllt sie danach automatisch 16 weitere Male auf"
		        },
		        "silo2": {
		            "name": "Industrielles Silo",
		            "description": "Ein unterirdisches Silo-Upgrade. Füllt bei Aktivierung Maschinen in der Nähe auf und füllt sie danach automatisch 64 weitere Male nach."
		        },
		        "vessel": {
		            "name": "Auffangbehälter",
		            "description": "Speichert 32 Chromaliten und verhindert deren Spaltung. Verbraucht einen Höllenstein."
		        },
		        "vessel2": {
		            "name": "Eindämmungssilo",
		            "description": "Ein Upgrade des Sicherheitsbehälters. Speichert 32768 Chromaliten und verhindert deren Spaltung. Verbraucht Realität."
		        },
		        "consumer": {
		            "name": "Katalytische Raffinerie",
		            "description": "Verbraucht benachbarte kaputte Ressourcen. Nachdem er 1024 Ressourcen angesammelt hat, gibt er alles mit einem zusätzlichen Bonus frei. Die Höhe des Bonus erhöht sich mit jeder weiteren Freigabe, bis hin zu 100%. Wenn innerhalb von 16 Sekunden keine Ressourcen verbraucht werden, wird der Effekt zurückgesetzt."
		        },
		        "preheater": {
		            "name": "Katalytischer Vorwärmer",
		            "description": "Erhöht die Geschwindigkeit einer beliebigen Rohstoffumwandlungsmaschine, wenn sie neben einer solchen steht. Jeder Konverter erhöht die Geschwindigkeit des Vorwärmers um bis zu 300%, wenn 8 Maschinen betroffen sind."
		        },
		        "hollow": {
		            "name": "Hohler Auswuchs",
		            "description": "So viele Löcher."
		        },
		        "strange": {
		            "name": "Hohes Gestein",
		            "description": "Es sieht so aus, als ob es schon eine Weile da ist."
		        },
		        "strange1": {
		            "name": "Forschungsstätte für hohles Gestein",
		            "description": "Lässt Himmelsschaum mit 512 Höllensteinen statt 64 vernichten. NORDEN."
		        },
		        "strange2": {
		            "name": "Hohle Felsenanlage",
		            "description": "Verdoppelt die maximale Anzahl an Hohlsteinen und erhöht ihre Spawn-Rate."
		        },
		        "strange3": {
		            "name": "Rekonstruierter Hohlraum",
		            "description": "Erhöht die Spawnrate von Hohlsteinen drastisch und macht alles lautlos."
		        },
		        "generaldecay": {
		            "name": "Allgemeiner Zerfallsreaktor",
		            "description": "Verbessert die Abklingleistung von Chromalit drastisch. Es kann nur einen geben."
		        },
		        "waypoint": {
		            "name": "Wegpunkt",
		            "description": "Teleportiert den nächsten vorhandenen Wegpunkt zu dir."
		        },
		        "annihilator": {
		            "name": "Vernichter",
		            "description": "Erzeugt Leere, wenn Höllensteine mit Himmelsschaum vernichtet werden. Benötigt zum Betrieb einen Hohlstein."
		        },
		        "flower": {
		            "name": "Hohle Blume",
		            "description": "Verringert die Wahrscheinlichkeit einer Zeitverschiebung. Wirkt der Wirkung eines Hohlsteins entgegen. Muss auf einen Hohlstein gebaut werden. Zerstört den Hohlstein, auf dem er errichtet wurde."
		        },
		        "fruit": {
		            "name": "Hohle Frucht",
		            "description": "Eine Entwicklung der Hohlen Blume. Verhindert die Bildung von Hohlsteinen, um sich zu ernähren. Produziert Hohlsteine."
		        },
		        "eraser": {
		            "name": "Zerstören",
		            "description": "Zerstört eine Maschine und gibt 50% der Ressourcen zurück, die zu ihrer Herstellung verwendet wurden."
		        },
		        "eraser2": {
		            "name": "Recyceln",
		            "description": "Recycelt eine Maschine, die 90 % der zu ihrer Herstellung verwendeten Ressourcen zurückgibt."
		        },
		        "eraser3": {
		            "name": "Zerlegen",
		            "description": "Zerlegt eine Maschine und gibt alle Ressourcen zurück, die zu ihrer Herstellung verwendet wurden."
		        },
		        "clicker1": {
		            "name": "Qanetit-Oszillator",
		            "description": "Ermöglicht es dir, Ressourcen anzuklicken und zu halten, um sie zu zerstören. Es kann nur eine geben."
		        },
		        "clicker2": {
		            "name": "Höllenstein-Oszillator",
		            "description": "Ein Upgrade für den Qanetit-Oszillator. Erhöht die Schwingungsfrequenz. Es kann nur einen geben."
		        },
		        "clicker3": {
		            "name": "Chromalit-Oszillator",
		            "description": "Ein Upgrade für den Höllenstein-Oszillator. Erhöht die Oszillationsfrequenz. Es kann nur einen geben."
		        },
		        "stabilizer": {
		            "name": "Stabilisator",
		            "description": "Stabilisiert einen benachbarten Spannungsspitzen und nutzt vorübergehend dessen Kraft."
		        },
		        "stabilizer2": {
		            "name": "Stabilisator II",
		            "description": "Upgrade des Stabilisators. Verbessert die Stabilität und Leistung."
		        },
		        "stabilizer3": {
		            "name": "Zerstörter Stabilisator",
		            "description": "Anomales Upgrade. Verbessert die Leistung und maximiert die Stabilität. Es kann nur eines geben."
		        }
		    },
		    "messages": [
		        "Wo bist du?",
		        "Ich bin buchstäblich mitten im Nirgendwo",
		        "Okay, was siehst du?",
		        "Naja, nicht viel. Hier ist so eine Maschine, sie kommt mir bekannt vor, aber ich könnte nicht sagen woher",
		        "Welche Maschine?",
		        "Warte, vielleicht kann ich...",
		        "Warte, sag mir, dass du NICHT gerade an irgendeiner zufälligen Maschine herumtippst!",
		        "Es funktioniert! Es hat gerade etwas erstellt",
		        "???",
		        "Ein riesiger schwarzer Würfel. Er ist so glatt. Ich möchte ihn wirklich gerne zerbrechen",
		        "Bist du high?",
		        "Ich habe jetzt 64 Steine!",
		        "Na dann, okay. Viel Spaß damit.",
		        "Hey, ich habe einen gelben Stein gefunden!",
		        "Gut für dich, Mann!",
		        "Ich glaube, ich kann jetzt Maschinen bauen. Ich sollte etwas bauen, um diese Würfel leichter zu zerbrechen. Wenn ein Würfel in einer angrenzenden Zelle auftaucht, auch diagonal, sollte es funktionieren.",
		        "Warte, spielst du irgendein komisches Spiel? Du fängst an, mir Angst zu machen.",
		        "Jetzt muss ich nur noch einen gelben Stein in diese Maschine legen.",
		        "Was immer dich glücklich macht... Scherz beiseite, kommst du heute vorbei?",
		        "Definitiv! Ich werde in ein paar Stunden da sein und muss das nur noch erledigen.",
		        "Was genau machst du?",
		        "Ich schreib dir später. Ich muss die Maschine weiter antreiben, sorry.",
		        "Ich glaube, dass sich die Maschinen gegenseitig beeinflussen, wenn sie in benachbarten oder diagonalen Zellen stehen. Zum Beispiel muss dieser Ventilator neben der ersten Maschine platziert werden, um den Prozess zu beschleunigen.",
		        "Das ergibt grade alles total Sinn",
		        "Und?",
		        "Wo bist du?",
		        "Wir warten schon seit Ewigkeiten auf Dich.",
		        "Wie meinst du das? Ich bin noch da.",
		        "WO???",
		        "Ich habe jetzt einen blauen Stein. Oder ist er lila? Es klingt wie ein antiker Kerzenständer aus Messing. Ich glaube, ich könnte damit aufgebaute Maschinen entfernen.",
		        "Willst du mich verarschen? Ich dachte, du hättest gesagt, du würdest kommen. Was zur Hölle?!",
		        "Ganz ruhig, Mann, ich bin gleich da.",
		        "Wow, ich kann [Q] verwenden, um Maschinen zu duplizieren oder zu zerstören, wenn ich zuerst auf eine freie Zelle klicke! Und [Alt] hilft dabei, hinter große Maschinen zu sehen.",
		        "SCHNELL SCHNELL",
		        "Seid ihr noch da?",
		        "HEILIGER BIMBAM!!!",
		        "Wo bist du????",
		        "Geht es dir gut?",
		        "????",
		        "Was zum Teufel?",
		        "GEHT ES DIR GUT? WO BIST DU?",
		        "Entspann dich, Mann! Mir geht's gut, was ist los?",
		        "Sag du es mir! Du ignorierst mich jetzt schon seit zwei Wochen! Ich war sogar ein paar Mal bei dir zu Hause, aber du warst nicht da. Sag mir einfach, wo du bist, das ist alles. Bist du gerade zu Hause?",
		        "Kumpel, wovon redest du? Wir haben uns buchstäblich vor zwei Minuten eine SMS geschickt.",
		        "WAS IST LOS MIT DIR? Erst bist du nicht aufgetaucht, dann bist du ganz verschwunden. Und jetzt tust du so, als wäre nichts passiert!",
		        "Ich habe dir eine einfache Frage gestellt",
		        "WO BIST DU?",
		        "Ich bin hier.",
		        "W O",
		        "Warte mal...",
		        "Das ist nicht lustig, Mann. Wo genau bist du? Kannst du mir das sagen?",
		        "Na ja...",
		        "Alter, ich weiß es eigentlich nicht.",
		        "Gib mir eine Minute",
		        "Wie, du weisst es nicht?",
		        "Ich muss meine Gedanken sammeln",
		        "Ist alles in Ordnung? Bist du in Sicherheit? Soll ich jemanden anrufen?",
		        "Nein, mir geht es gut. I habe gerade",
		        "Ich schreibe Dir gleich",
		        "Verdammt. Was ist los?",
		        "Ich habe Angst",
		        "Anscheinend weiß ich nicht wo ich bin",
		        "Das hier ist so seltsam. Ja, es geht mir gut. Aber ich kann diesen Ort nicht beschreiben.",
		        "Es ist wie ein Traum, aber dann wieder nicht. Alles ist weiß und dann sind da diese Maschinen. Und diese Würfel. Es macht keinen Sinn.",
		        "Ich bin nicht high oder so. Ich habe gerade realisiert wie komisch es ist, dass mir nie aufgefallen ist, dass das hier anders ist als alles, was ich zuvor gesehen habe.",
		        "Jetzt habe ich rote Steine, und es ist etwas gruselig, dass ich hiermit gar kein Problem habe. Okay, nur ein roter Stein, alles ist Okay.",
		        "Also machst du keine Witze...",
		        "Ich verstehe wie das alles klingt, aber ja, ich habe alles vor meinen Augen.",
		        "Kann ich irgendwas für dich machen?",
		        "Rede einfach mit mir, das ist alles.",
		        "Kann ich machen Kollege. Ach ja, die Polizei sucht nach Dir, wie als wärst Du verschollen.",
		        "Hast Du ihnen unsere Nachrichten gezeigt?",
		        "Wie würde das denn helfen? Nein, ich habe automatisches Löschen aktiviert.",
		        "Danke!",
		        "Wie läuft es da drüben?",
		        "Es scheint so als ob ich mich mit WASD bewegen kann. Aber es gibt nichts Interessantes außer diesen komischen Stein im Norden.",
		        "Der Kompass in deinem Handy funktioniert also auch dort!",
		        "Naja, es geht nur nach \"oben\" von hier aus, also nehme ich an das ist Norden.",
		        "Das macht Sinn",
		        "Und das Ding ist, ich habe kein Handy...",
		        "Wie schreibst du mir denn dann?",
		        "Ich weiss es nicht!! Ich weiß einfach, wenn Du mir schreibst. Und ich kann Dir antworten! Es ist nicht einfach zu erklären.",
		        "Mach Dir nichts draus. Wir können sprechen und das ist schon gut genug.",
		        "Ja, du hast recht.",
		        "Also... Erzähl mir von den Maschinen",
		        "Was meinst du?",
		        "Was sind sie, was machen sie und wie funktionieren sie?",
		        "Naja, sie sehen kompliziert aus, mit ein paar Kabeln, Leitungen und so Zeug",
		        "Die eine zum Beispiel sieht aus wie eine große Plastik-Box mit einer Kupferspule, wo ein blauer Stein drauf sitzt. Und ein großes Schild auf dem \"E-01SR\" steht, auf der anderen Seite \"Achtung! Starke Entropiestrahlung\"",
		        "Was bedeutet das?",
		        "Ich weiß nicht wirklich. Es gibt hier anscheinend irgendwelche Entropiestrahlung.",
		        "Warte, ich dachte, Du hast diese Maschinen hergestellt?",
		        "Stimmt... Ich verstehe was Du meinst.",
		        "Ich baue sie irgendwie aus Würfeln. Aber ich weiß nicht, was sich darin befindet. Ja das klingt komisch, lass mich darüber nachdenken.",
		        "Ach ja, es scheint so als wären gelbe und blaue Steine nicht unendlich, ich sollte also wirklich in so einen Konverter oder eine neue Mine investieren.",
		        "Das klingt nach einem Plan",
		        "Das war wirklich nervig!",
		        "Was?",
		        "Ein grüner Stein! Es dauert ewig bis er zerbricht. Ich muss mir etwas ausdenken, wenn die immer wieder auftauchen.",
		        "Ich bin mir sicher, du baust dafür irgendeine komplizierte Maschine!",
		        "Darauf kannst du Wetten!",
		        "Verdammt, ja! Höllenjuwelen, aufgepasst.",
		        "Macht ihnen die Hölle heiß!",
		        "Erinnerst du dich, dass du nach den Maschinen gefragt hast?",
		        "Ja",
		        "Ich glaube nicht, dass sie echt sind",
		        "Was soll das denn heißen?",
		        "Es ist wie in einem Traum. Ich kann nicht hineinschauen und sie auch nicht von der anderen Seite sehen.",
		        "Eine vage Darstellung einer unerklärlichen Technologie",
		        "Ich glaube, diese Maschinen sehen nur so aus, weil ich ihre Funktion so wahrnehme.",
		        "Wenn etwas Bäume fällen soll, sollte es wie eine Axt aussehen?",
		        "So etwas in der Art",
		        "Naja, zumindest klingst du für mich ziemlich echt",
		        "Ja, ich nehme an, du bist im Moment das Einzige, was wirklich zählt",
		        "Ich habe einen Haufen neuer Würfel, die zu anderen Würfeln zerfallen!",
		        "Nun, nicht gut, nicht schlecht",
		        "Ich muss etwas wirklich Seltsames sagen",
		        "Siehst du die Ironie in dem, was du gerade geschrieben hast?",
		        "Vielleicht liegt es an diesem seltsamen Ort, aber ich habe irgendwie deinen Namen vergessen",
		        "Dann könnten wir wohl etwas mehr Zeit miteinander verbringen.",
		        "Ich meine es ernst",
		        "Mein Name ist Duke Nukem, offensichtlich.",
		        "Alter, hör auf damit!",
		        "Das hat sie gesagt!",
		        "Das ist dumm! Hör auf, mir Angst zu machen. Was ist los?",
		        "Verdammt",
		        "Es sieht so aus, als ob ich mich auch nicht mehr an meinen eigenen Namen erinnern kann.",
		        "Ich kann es einfach nicht! Es ist total verrückt. Und ich kann mir deinen Namen nicht merken!",
		        "Vielleicht ist es nur ein Fall von Massenhysterie? Ich habe gehört, dass es mehrere Menschen auf einmal treffen kann. Beruhigen wir uns einfach und sehen, was passiert.",
		        "Ja, genau, Hysterie",
		        "Ich kann mich immer noch nicht an die Namen erinnern",
		        "Ich auch nicht. Und da ist noch mehr",
		        "Ja, genau! Wie sehe ich aus? Wann haben wir uns kennengelernt?",
		        "Wie sieht mein Zuhause aus, wer sind unsere Freunde? Haben wir uns überhaupt getroffen?",
		        "Es sieht so aus, als steckten wir beide in der gleichen Scheiße. Und ich kann nicht einmal sagen, ob es schon immer so war oder ob irgendwann etwas passiert ist. Ist das ein seltsamer Traum? Und wer träumt hier?",
		        "Sind irgendwelche Maschinen in der Nähe? Vielleicht ist irgendwo ein Würfel herausgesprungen?",
		        "Lustig",
		        "Nun, wir sollten uns selbst ein paar Namen einfallen lassen.",
		        "Du klingst wie Veen",
		        "Warum nicht",
		        "Habe nichts gegen Veen",
		        "Hey, Veen. Möchtest du ein paar Bohnen, Veen? Ja, klingt gut.",
		        "Und du wirst Charps sein",
		        "Hast du ein paar scharfe Harfen, Charps?",
		        "Das macht doch keinen Sinn!",
		        "Ich mag Charps. Schön dich kennenzulernen, Veen",
		        "Ebenso, Charps",
		        "WAS GEHT HIER VOR",
		        "Was?",
		        "Weiße Würfel! Sie zerstören die grünen Würfel!",
		        "Es gibt auch jede Menge verfallende Würfel! Es ist wie in einem Atomreaktor!",
		        "Heilige Scheiße, bist du okay?",
		        "Ja, mir geht's gut! Es ist nur noch ein einziges Durcheinander. Ich muss etwas bauen, um das in den Griff zu bekommen. Vielleicht sollte ich mir noch einmal einen Felsen im Norden ansehen.",
		        "Das machst du immer so, Charps!",
		        "Klingt komisch!",
		        "Ich meine, mein Name schon. Irgendwann gewöhne ich mich wohl daran. Nicht wahr, Veen?",
		        "Ja! Tatsächlich seltsam.",
		        "Weißt du noch, dass ich einen seltsamen Felsen im Norden erwähnt habe?",
		        "Nicht wirklich, nein",
		        "Nun, da ist dieser Felsen. Und versteh mich nicht falsch, mir ist klar, dass alles hier seltsam ist. Aber dieser Felsen fühlt sich noch viel seltsamer an als alles andere.",
		        "Ich kann mir keinen Reim darauf machen. Aber als ich jetzt beschloss, ein wenig darin herumzustochern, änderte es etwas an den Regeln des Universums selbst!",
		        "Ist es gefährlich?",
		        "Ich weiß es nicht. Die Veränderung ist subtil.",
		        "Ich frage mich, was es sonst noch kann.",
		        "In Ordnung, zerstöre nur nicht versehentlich das Universum.",
		        "Ich werde mein Bestes geben.",
		        "Nun, DAS war der härteste Stein in meinem Leben! Aber ich glaube, ich weiß jetzt, wie ich ihn schneller brechen kann.",
		        "Hast du neue Steine?",
		        "Ja, das Seltsamste bisher",
		        "Woah, vielleicht war die Wirkung auf das Universum gar nicht so unbedeutend. Spürst du es?",
		        "Was fühlen?",
		        "Nun, vielleicht liegt es an mir.",
		        "Hast du zufällig gerade jetzt einen riesigen Würfel vor Augen gehabt?",
		        "Ähm, zählt ein Kühlschrank?",
		        "Na ja, egal",
		        "Wow, dieser neue Würfel ist pechschwarz. Und er fühlt sich irgendwie unheimlich an.",
		        "Noch unwirklicher als der vorherige?",
		        "Es ist anders! Es ist eiskalt, aber nicht auf eine schädliche Art und Weise. Es hat keine Vorstellung von Temperatur und interagiert nicht mit dir. Es besteht nicht aus Materie, hat keine Farbe oder irgendetwas Vertrautes, falls das für dich Sinn macht.",
		        "Offen gesagt, ist das nicht der Fall.",
		        "Ich glaube, ich habe es verstanden. Ich kann hohle Steine benutzen, um dieses schwarze Zeug aus der Luft zu kondensieren. Es bildet seltsam identische Kristalle, aber ohne irgendwelche Eigenschaften. Und das behebt irgendwie Anomalien im Universum.",
		        "Klingt wie ein Luftfilter",
		        "Ja, genau! Es sieht so aus, als hätte ich irgendwann die Luft verdorben.",
		        "Du musst es nicht laut sagen",
		        "Ich habe beschlossen, diesen seltsamen Stein auszugraben. Vielleicht gibt es eine Antwort auf das, was in ihm vorgeht. Ich habe das Gefühl, dass er nicht nur alles durcheinanderbringt, sondern dass er alles irgendwie kontrolliert!",
		        "Warum denkst du das?",
		        "Würdest du mir glauben, wenn ich sage, dass ich es spüre?",
		        "Klar! Ich glaube, ich würde im Moment an alles glauben. Ein Stein, der das Universum kontrolliert? Warum zum Teufel nicht!",
		        "Ich glaube, ich kriege einen Anfall!",
		        "Bitte nicht",
		        "Diese Geräte werden so unangenehm laut und flackern. Vielleicht sollte ich etwas ändern, um das zu beheben. Oder mich selbst verbessern. Oder beides.",
		        "Jetzt wird's interessant!",
		        "Also, was hast du angepasst?",
		        "Warte, etwas stimmt nicht.",
		        "Ich habe etwas aus dem schwarzen Zeug gebaut. Und es ist keine Maschine. Aber es hat etwas mit den Wegpunkten gemacht.",
		        "Was sind Wegpunkte?",
		        "Sie verschieben das Universum um dich herum, so kommst du an verschiedene Orte.",
		        "Woher weißt du, dass sie das Universum verändern und nicht du?",
		        "Hmm, daran habe ich nicht gedacht.",
		        "Ich glaube, ich habe das Universum zerstört",
		        "Das alles macht keinen Sinn!",
		        "Maschinen machen keinen Sinn, nichts macht Sinn.",
		        "Ich hoffe, ich kann das reparieren",
		        "Veen?",
		        "Kumpel, bist du da?",
		        "Bitte, bitte, bitte nicht! Ich hoffe, du bist gerade pinkeln gegangen oder so.",
		        "VEEN!",
		        "WAS?",
		        "Trotzdem ist es seltsam.",
		        "Oh, Gott sei Dank!",
		        "Hast du etwas Neues gebaut?",
		        "Ich dachte, ich hätte das Universum zerstört und du wärst für immer weg! Ich war in einer Unterwelt mit einigen Symbolen und dachte, dies seien die Ruinen des Universums. Aber es ist ein anderes Universum oder eine andere Version dieses Universums, denn sie ähneln einander, und sie sind jetzt miteinander verbunden.",
		        "Erkunden, was? Klingt spaßig!",
		        "Spaß? Hast du meinen Text überhaupt gelesen? EIN ANDERES UNIVERSUM!!!",
		        "Du musst akzeptieren, dass dir die Fähigkeit ausgeht, mich zu überraschen.",
		        "Guter Punkt",
		        "Es ist kein Stein, es ist eine Linse",
		        "Sie kann alles in einem einzigen Punkt zusammenlaufen lassen. Und ich meine alles! Raum, Zeit, alle Konzepte und Regeln. Alles!",
		        "Hast du das Handbuch oder so etwas gefunden?",
		        "Ich weiß nicht, warum es da ist und warum wir hier sind. Ich weiß nur irgendwie, was es jetzt macht.",
		        "Also... Wirst du alles zusammenführen oder was?",
		        "Ich wüsste nicht wie. Aber vielleicht ist das der Sinn dieses Ortes. Jetzt schwebt er einfach in der Luft, als ob das seine Aufgabe wäre.",
		        "Und wie geht es weiter?",
		        "Keine Ahnung",
		        "Je mehr ich darüber nachdenke, desto mehr verstehe ich, dass nicht nur Ihre Maschinen nicht real sind.",
		        "Ich versuche, mir konkrete Fragen zu stellen, aber ich habe keine Antworten.",
		        "Erinnerst du dich, dass ich erwähnt habe, dass die Polizei nach dir sucht? Ich habe dich nicht auf den Arm genommen. Aber jetzt fällt alles auseinander, wenn ich mir Fragen stelle.",
		        "Bin ich zu dieser Polizeiwache gekommen oder habe ich sie angerufen? Und wer war dort? Polizisten? Wo ist diese Polizeistation in der Stadt? Was ist das für eine Stadt? Wohne ich in dieser Stadt? Wie lautet der Name der Stadt? Und welches Bundesland ist das? Oder gibt es überhaupt einen Staat?",
		        "Ich kann nicht eine einzige Frage beantworten. Alles schien normal, bis ich anfing, Fragen zu stellen. Ich habe Angst, mehr zu fragen.",
		        "Das tut mir leid",
		        "Nein, es ist überhaupt nicht deine Schuld. Soweit ich sehen kann, sitzen wir im selben Boot.",
		        "Ich hoffe nur, dass du herausfindest, was es mit diesem Boot auf sich hat.",
		        "Ja, ich auch!",
		        "Mal sehen, wie es ausgeht. Ich hoffe nur, dass dies nicht eine Art ewige Hölle oder Vorhölle ist.",
		        "Zeig's ihnen, Dante!",
		        "Jetzt wird's interessant. Diese Typen sollten dieses Universum bis auf den letzten Tropfen ausbeuten!",
		        "Du klingst wie ein Ölkonzern",
		        "Ich bin es leid, alles zu optimieren, um etwas effizienter zu sein, und ich bin den Lärm leid. Diese Maschine sollte alles ändern. Sie reißt sogar die andere Seite durch.",
		        "Ist das nicht gefährlich?",
		        "Das Konzept der Gefahr ist hier ziemlich verschwommen.",
		        "Ich denke, es ist an der Zeit, etwas Großes zu machen.",
		        "Was geht dir durch den Kopf?",
		        "Ich bin mir nicht sicher. Aber es sollte groß sein!",
		        "Wie eine riesige Maschine?",
		        "Nein, ich spreche metaphorisch",
		        "Dann tu es!",
		        "Oh verdammt",
		        "Ich habe etwas falsch gemacht. Die inverse Kluft ist zerstört. Alles bricht in sich zusammen.",
		        "Geht es dir gut?",
		        "Ja, aber die Maschinen werden zerstört! Ich kann nichts mehr bauen! Mist!",
		        "Moment! Vielleicht soll das ja passieren?",
		        "NEIN! Ist es nicht!",
		        "Wie kannst du das Wissen?",
		        "Moment, ich muss das irgendwie in Ordnung bringen",
		        "Alles oder nichts!",
		        "Ich sehe dich! Du bist gerade an einem riesigen Kastanienbaum vorbeigegangen, auf diesem komischen Planeten in einem oberen Galaxienarm genau dort.",
		        "Nein, bin ich nicht! Welche Galaxie?",
		        "Oh, es ist schwer, die genaue Zeit zu sagen, es ist wahrscheinlich noch nicht passiert. Aber warte einfach noch 15 Milliarden Jahre!",
		        "Das macht alles so viel Sinn. Kommst du übrigens rüber?",
		        "Auf jeden Fall! Ich werde in ein paar Stunden da sein, ich muss nur noch ein paar Sachen erledigen.",
		        "In Ordnung, bis dann!",
		        "Aber bitte, Charps",
		        "Komm dieses Mal nicht zu spät",
		        "Das werde ich nicht, Veen, das werde ich nicht!"
		    ],
		    "credits": [
		        "Der Anfang",
		        "Ich weiß es wirklich zu schätzen, dass du es bis zum Ende geschafft hast, wo alles beginnt",
		        "Herzlichen Glückwunsch, schätze ich!",
		        "Sieh dir das mal an:",
		        "Insgesamt geförderte Ressourcen:",
		        "Charoniten:",
		        "Elmerinen:",
		        "Qanetiten:",
		        "Beta-Phenole:",
		        "Höllenjuwelen:",
		        "Chromalit:",
		        "Himmlischer Schaum:",
		        "Hohler Stein:",
		        "Leeren:",
		        "Realitäten:",
		        "Gebaute Maschinen:",
		        "Zerstörte Maschinen:",
		        "Maximale Kanaltiefe in Metern:",
		        "Seltsamer Stein berührt:",
		        "Anzahl der Teleportationen:",
		        "Klicks auf den Würfel:",
		        "Zeitsprünge:",
		        "Spielzeit:",
		        "h",
		        "Spiel erstellt von:<br>Oleg Danilow",
		        "Zusätzliche Grafiken:<br>Yulia Nogteva",
		        "Dialogbearbeitung:<br>Abdurahman Zulumhanov und Anna Peterson",
		        "Steam-Veröffentlichung:<br>Playsaurus",
		        "Spieltest:<br>Communityvon Leprosorium, Abdurahman Zulumhanov, Playsaurus",
		        "ENDE",
		        "Du kannst jetzt gehen und Cookie Clicker oder so spielen.",
		        "Musik:<br>Shallow Anne von Jake Chudnow",
		        "Deutsch: flex 4711, Patrick Karban",
		        "Português: selfemcrowdin, Mateus Iamarino",
		        "Italiano: doralum",
		        "Español: armangar, Syunay Kamenov",
		        "Français: KjetilVion, Etienne Samson, William (Ekitchi)",
		        "Nederlands: lievevandyck",
		        "Čeština: Jakub Strelinger",
		        "Polski: PolglishPL",
		        "日本語: Winna Tolentino",
		        "한국어: Ah Lon Sin, Sumin Park, Cyberowl",
		        "简体中文：Daisy Chan, kevinlee7, YuLun",
		        "繁體中文: Daisy Chan, kevinlee7",
		        "ไทย: They say P, Phimze Pym",
		        "Magyar: Simon Dániel és Márton-Mezey Csenge",
		        "Latviešu valoda: Roberts Artūrs Bumburs (Arburo)",
		        "Română: Eric Apetrei"
		    ],
		    "explainer": [
		        "Drücken und halten.",
		        "Klicke immer auf die Zelle darunter.",
		        "<span class=\"keyboard\">Q</span>, <span class=\"keyboard\">Esc</span> oder Rechtsklick zum Abbrechen.",
		        "Halte <span class=\"keyboard\">Alt</span> gedrückt, um dir das genauer anzusehen.",
		        "Drücke <span class=\"keyboard\">Q</span> über einer leeren Zelle, um ein Abrisswerkzeug auszuwählen.",
		        "Drücke <span class=\"keyboard\">Q</span> über einer Maschine, um zu versuchen, eine weitere zu bauen.",
		        "WASD oder Rechtsklick und ziehen, um dich umzusehen."
		    ],
		    "random": {
		        "paste": "Ein Speichercode wurde in die Zwischenablage kopiert. Bewahre ihn jetzt an einem sicheren Ort auf.",
		        "toolate": "Es ist zu spät, etwas zu retten. Alles ist bereits geschehen.",
		        "existed": "NEU",
		        "steamWarning": "Steam-Fehler. Autospeichern und Erfolge funktionieren nicht. Versuche, das Spiel neu zu starten."
		    }
		},
		nl: {
		    "splash": {
		        "sixtyfour": "SIXTY&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FOUR",
		        "continue": "<span>DOORGAAN</span><div class=\"keyboard\">Esc</div>",
		        "start": "<span>START</span><div class=\"keyboard\">Esc</div>",
		        "soundoff": "GELUID IS UIT",
		        "soundon": "GELUID IS AAN",
		        "save": "OPSLAAN",
		        "load": "LADEN",
		        "language": "TAAL: NEDERLANDS",
		        "reset": "RESET",
		        "credit": "©2024 Oleg Danilov, uitgegeven door Playsaurus. Versie",
		        "warning": "Je zult alles verliezen, ik maak geen grapje. Blijf het ingedrukt houden en houd vol.",
		        "glory": "PRESTATIES",
		        "deglory": "TERUG",
		        "quit": "AFSLUITEN",
		        "export": "Exporteren",
		        "import": "Importeren",
		        "flashbang": "Felle knipperende lichten zijn onderdeel van dit spel. Als u daar gevoelig voor bent, kunt u overwegen om de flitsen uit te schakelen door op dit icoon te klikken."
		    },
		    "achievements": [
		        {
		            "name": "Het goud van een dwaas",
		            "description": "Heb wat Elmerine"
		        },
		        {
		            "name": "Deep Purple",
		            "description": "Heb Qanetiet"
		        },
		        {
		            "name": "Bloed van het land",
		            "description": "Koop Beta-pyleen"
		        },
		        {
		            "name": "Groene energie",
		            "description": "Vind een Hel edelsteen"
		        },
		        {
		            "name": "Gevaarlijk glas",
		            "description": "Vind een Chromaliet"
		        },
		        {
		            "name": "Heilig beton",
		            "description": "Heb wat Hemels Schuim"
		        },
		        {
		            "name": "Kan het de afwas doen?",
		            "description": "Heb een Holle Steen"
		        },
		        {
		            "name": "Waar de zon niet schijnt",
		            "description": "Heb wat Leegte"
		        },
		        {
		            "name": "Who you gonna call?",
		            "description": "Heb wat Realiteit"
		        },
		        {
		            "name": "Nietzsche",
		            "description": "Staar 64 keer in de afgrond"
		        },
		        {
		            "name": "64K",
		            "description": "Heb 64 000 stenen"
		        },
		        {
		            "name": "64M",
		            "description": "Heb 64 000 000 stenen"
		        },
		        {
		            "name": "64B",
		            "description": "Heb 64 000 000 000 stenen"
		        },
		        {
		            "name": "Je mag nu resetten",
		            "description": "Loop vast bij het begin"
		        },
		        {
		            "name": "Perpetuum shmobile",
		            "description": "Voeg twee silo's samen"
		        },
		        {
		            "name": "Een pauze nodig?",
		            "description": "Speel 64 uur"
		        },
		        {
		            "name": "Moet... vernietigen",
		            "description": "Klik 6400 keer op een kubus"
		        },
		        {
		            "name": "Architect",
		            "description": "Bouw 64 machines"
		        },
		        {
		            "name": "Vernietiger",
		            "description": "Vernietig 64 machines"
		        },
		        {
		            "name": "Hellraiser",
		            "description": "Heb 9 Hel kluizen"
		        },
		        {
		            "name": "Einde/Begin",
		            "description": "Laat de Omgekeerde Kloof ontploffen"
		        },
		        {
		            "name": "Cookie Clicker",
		            "description": "Klik op een cookie"
		        },
		        {
		            "name": "Dronken zeeman",
		            "description": "Toeter 64 keer zonder reden"
		        },
		        {
		            "name": "Mr. Mine",
		            "description": "Heb 9 Graafkanalen"
		        },
		        {
		            "name": "Is er een limiet?",
		            "description": "Graaf 64 km diep"
		        },
		        {
		            "name": "Seth Brundle",
		            "description": "Teleporteer <s>1</s> 64 keer"
		        },
		        {
		            "name": "Rood-Blauwe Rots",
		            "description": "Voltooi het spel zonder iets te verwijderen gedurende 15 minuten en met minder dan 15 Afgesloten Silo's"
		        },
		        {
		            "name": "Recht naar de hel!",
		            "description": "Vind een Hel edelsteen binnen de eerste 64 minuten vanaf het begin"
		        },
		        {
		            "name": "Het topje van de ijsberg",
		            "description": "Graaf 64 meter diep"
		        },
		        {
		            "name": "Is het heet?",
		            "description": "Graaf 640 meter diep"
		        },
		        {
		            "name": "Te diep",
		            "description": "Graaf 6400 meter diep"
		        },
		        {
		            "name": "64 km/u omlaag",
		            "description": "Bereik een diepte van 6400 meter binnen 6 minuten na het plaatsen van een nieuw Graafkanaal"
		        },
		        {
		            "name": "Neofobie",
		            "description": "Voltooi het spel zonder ooit de ontginningskanalen te upgraden"
		        }
		    ],
		    "resources": [
		        "Charoniet",
		        "Elmerine",
		        "Qanetiet",
		        "Beta-pyleen",
		        "Hel edelsteen",
		        "Chromaliet",
		        "Hemels schuim",
		        "Holle steen",
		        "Leegte",
		        "Realiteit"
		    ],
		    "entities": {
		        "pinhole": {
		            "name": "?",
		            "description": "U/D, C/S, T/B, E/νE, μ/νμ, τ/ντ, G/γ, Z/W, H, Δ/νΔ"
		        },
		        "gradient": {
		            "name": "Gradiënt bron",
		            "description": "Een eeuwig mijnbare kubus. Reageert op de meeste destabilisatoren en resonatoren. Moet met geleiders aangesloten worden op de Omgekeerde Kloof."
		        },
		        "chasm": {
		            "name": "De Omgekeerde Kloof",
		            "description": "Een brug naar het onbekende."
		        },
		        "conductor": {
		            "name": "Geleider",
		            "description": "Verbindt de Omgekeerde Kloof met industriële silo's."
		        },
		        "pump": {
		            "name": "Ontginningskanaal",
		            "description": "Ontgint grondstoffen en plaatst ze om zich heen."
		        },
		        "pump2": {
		            "name": "Graafkanaal",
		            "description": "Een upgrade voor een ontginningskanaal. Graaft snel veel grondstoffen op en plaatst ze verder om zich heen."
		        },
		        "vault": {
		            "name": "Hel kluis",
		            "description": "Isoleert 1024 Hel edelstenen van de omgeving."
		        },
		        "cube": {
		            "name": "Grondstofkubus",
		            "description": "Ontgonnen grondstoffen."
		        },
		        "destabilizer": {
		            "name": "Destabilisator",
		            "description": "Plaats deze naast een kubus om de kubus twee keer zo snel te breken. Heeft een Elmerine nodig om te werken. Extra destabilisatoren vergroten het effect."
		        },
		        "destabilizer2": {
		            "name": "Industriële destabilisator",
		            "description": "Een destabilisator upgrade. Verviervoudigt de kracht van het grondstoffen-verpletteringsproces. Vereist 64 Elmerine om te werken. Extra destabilisatoren vergroten het effect."
		        },
		        "destabilizer2a": {
		            "name": "Hel edelsteen destabilisator",
		            "description": "Een industriële destabilisator upgrade. Verhoogt de kracht van het grondstoffen-verpletteringsproces 625 keer wanneer een Hel edelsteen aanwezig is in de ontgonnen kubus. Anders biedt het geen voordeel. Vereist 1 Hel edelsteen om te werken. Extra destabilisatoren vergroten het effect."
		        },
		        "doublechannel": {
		            "name": "Kanaalkoeler",
		            "description": "Plaats dit naast de kubus-ontginningsmachine om kubussen twee keer zo snel te ontginnen. Extra koelers verhogen het effect."
		        },
		        "doublechannel2": {
		            "name": "Actieve kanaalkoeler",
		            "description": "Een kanaalkoeler upgrade. Verdrievoudigt de stroom in het kanaal als het ernaast wordt geplaatst. Extra koelers vergroten het effect."
		        },
		        "valve": {
		            "name": "Omkeerklep",
		            "description": "Voorkomt dat de kubus-ontginningsmachine terugkeert naar de oorspronkelijke positie als deze ernaast wordt geplaatst. Vereist een Charoniet om te werken."
		        },
		        "auxpump": {
		            "name": "Hulppomp",
		            "description": "Een omkeerklep upgrade. Zorgt voor druk op een kanaal als het ernaast geplaatst wordt. Vereist 8 Elmerine om te werken. Extra pompen verhogen de druk in het kanaal niet."
		        },
		        "auxpump2": {
		            "name": "Pompstation",
		            "description": "Een hulppomp upgrade. Zorgt voor vier keer zoveel druk op een kanaal als het ernaast geplaatst wordt. Vereist 256 Elmerine en 4 Beta-pyleen om te werken. Meerdere pompstations verhogen de stroom in het kanaal niet."
		        },
		        "entropic": {
		            "name": "Entropie resonator",
		            "description": "Verplettert periodiek grondstoffen als het naast een kubus wordt geplaatst. Vereist een Qanetiet om te werken."
		        },
		        "entropic2": {
		            "name": "Entropie resonator II",
		            "description": "Een entropie resonator upgrade. Verplettert grondstoffen 3 keer sneller. Vereist een Chromaliet om te werken."
		        },
		        "entropic2a": {
		            "name": "Entropie condensator",
		            "description": "Een entropie resonator upgrade. Verplettert grondstoffen wanneer ze aan het oppervlak verschijnen met 600% vermogen. Maar slechts één keer per kubus. Vereist 8 Chromalieten om te werken."
		        },
		        "entropic3": {
		            "name": "Leegte resonator",
		            "description": "Een entropie resonator II upgrade. Bij vernietiging verplettert de resonator kubussen om zich heen met immense kracht."
		        },
		        "converter32": {
		            "name": "Charoniet verrijkingstank",
		            "description": "Laat Qanetiet traag met Charoniet reageren om Elmerine te produceren."
		        },
		        "converter13": {
		            "name": "Charoniet opvangbak",
		            "description": "Wint Qanetiet uit vloeibare Charoniet-sedimenten dankzij katalysatoren."
		        },
		        "converter41": {
		            "name": "Beta-pyleen oxidator",
		            "description": "Verbrandt Beta-pyleen om Charoniet en sporen van andere elementen te produceren."
		        },
		        "converter76": {
		            "name": "Hemelse bestraler",
		            "description": "Bestraalt Hemels schuim met een Chromaliet, waardoor het Schuim wordt omgezet in Chromalieten, die een geweldige bron zijn van Hel edelstenen, Beta-Pyleen, Qanetiet en Elmerine door het verval van Chromaliet."
		        },
		        "converter64": {
		            "name": "Hemelse reactor",
		            "description": "Ondersteunt controleerbare fusie van Chromalieten en Hemels schuim om Beta-pyleen te produceren. Kan niet functioneren in de buurt van andere hemelse reactoren."
		        },
		        "reflector": {
		            "name": "Hemelse reflector",
		            "description": "Verbetert de prestaties van een aangrenzende hemelse reactor."
		        },
		        "mega1": {
		            "name": "Materiaal straaltoren",
		            "description": "Verhoogt de zichtbaarheid door bewegende grondstoffen te comprimeren. Er kan er maar één zijn."
		        },
		        "mega1a": {
		            "name": "Materiaal straaltoren MKII",
		            "description": "Een materiaal straaltoren upgrade. Verhoogt de snelheid van de overdracht van grondstoffen. Er kan er maar één zijn."
		        },
		        "mega1b": {
		            "name": "Materiaal straaltoren MKIII",
		            "description": "Een materiaal straaltoren MKII upgrade. Comprimeert bewegende grondstoffen nog meer. Er kan er maar één zijn."
		        },
		        "mega2": {
		            "name": "Recycling toren",
		            "description": "Maakt machine recycling mogelijk, waarbij 90% van de grondstoffen worden teruggegeven. Er kan er maar één zijn."
		        },
		        "mega3": {
		            "name": "Demonteer toren",
		            "description": "Een recycling toren upgrade. Hiermee worden machines gedemonteerd terwijl alle grondstoffen worden teruggegeven. Er kan er maar één zijn."
		        },
		        "voidsculpture": {
		            "name": "Leegte bewonderingskanaal",
		            "description": "Hiermee kun je de visuele nadelen van de leegte machines negeren."
		        },
		        "eye": {
		            "name": "Vul directeur",
		            "description": "Geeft aan dat machines klaar zijn voor het vullen."
		        },
		        "cookie": {
		            "name": "Een cookie",
		            "description": "Hoe is het daar terechtgekomen?"
		        },
		        "injector": {
		            "name": "Hel edelsteen injector",
		            "description": "Verwisselt een willekeurige grondstof van een aangrenzende kubus met een Hel edelsteen als die er niet is. Kan 32 gebruikt worden indien voorzien van 32 Hel edelstenen en 64 Qanetieten."
		        },
		        "silo": {
		            "name": "Ondergrondse silo",
		            "description": "Bij activering worden machines in de buurt bijgevuld en vervolgens automatisch nog 16 keer bijgevuld"
		        },
		        "silo2": {
		            "name": "Industriële silo",
		            "description": "Een ondergrondse silo upgrade. Bij activering worden machines in de buurt bijgevuld en vervolgens automatisch nog 64 keer bijgevuld"
		        },
		        "vessel": {
		            "name": "Afgesloten vat",
		            "description": "Slaat 32 Chromalieten op, waardoor hun splijting wordt voorkomen. Verbruikt een Hel edelsteen."
		        },
		        "vessel2": {
		            "name": "Afgesloten silo",
		            "description": "Een Afgesloten vat upgrade. Slaat 32768 Chromalieten op, waardoor hun splijting wordt voorkomen. Verbruikt Realiteit."
		        },
		        "consumer": {
		            "name": "Katalytische raffinaderij",
		            "description": "Verbruikt aangrenzende gebroken grondstoffen. Nadat het 1024 grondstoffen heeft verzameld, wordt alles vrijgegeven met een extra bonus. De grootte van de bonus neemt toe bij elke opeenvolgende vrijgave en kan oplopen tot 100%. Als er binnen 16 seconden geen grondstoffen worden verbruikt, wordt het effect gereset."
		        },
		        "preheater": {
		            "name": "Katalytische voorverwarmer",
		            "description": "Verhoogt de snelheid van elke machine die grondstoffen omzet als de voorverwarmer ernaast wordt geplaatst. Elke omzetter verhoogt de snelheid van de voorverwarmer, tot 300%, als 8 machines worden beïnvloed."
		        },
		        "hollow": {
		            "name": "Holle formatie",
		            "description": "Zoveel gaten."
		        },
		        "strange": {
		            "name": "Holle rots",
		            "description": "Het lijkt erop dat het er al een tijdje staat."
		        },
		        "strange1": {
		            "name": "Onderzoeksplaats voor een Holle rots",
		            "description": "Vernietigt Hemels schuim met 512 Hel edelstenen in plaats van 64. NOORD."
		        },
		        "strange2": {
		            "name": "Holle rotsfaciliteit",
		            "description": "Verdubbelt het maximale aantal Holle stenen en zorgt dat ze sneller tevoorschijn komen."
		        },
		        "strange3": {
		            "name": "Gereconstrueerde Holle rots",
		            "description": "Verhoogt het tevoorschijn komen van Holle stenen aanzienlijk en doet alles in stilte."
		        },
		        "generaldecay": {
		            "name": "Algemene verval reactor",
		            "description": "Verbetert het verval van Chromaliet aanzienlijk. Er kan er maar één zijn."
		        },
		        "waypoint": {
		            "name": "Tussenstation",
		            "description": "Teleporteert het volgende bestaande Tussenstation naar je toe."
		        },
		        "annihilator": {
		            "name": "Vernietiger",
		            "description": "Produceert Leegte wanneer Hel edelstenen worden vernietigen met Hemels schuim. Vereist een Holle steen om te werken."
		        },
		        "flower": {
		            "name": "Holle bloem",
		            "description": "Vermindert de kans op tijdvervorming. Houdt het effect van één Holle steen tegen. Moet gebouwd worden op een Holle Steen. Vernietigt de Holle Steen waarop het gebouwd is."
		        },
		        "fruit": {
		            "name": "Holle vrucht",
		            "description": "Een evolutie van een Holle bloem. Voorkomt de vorming van Holle stenen die zichzelf voeden. Produceert Holle stenen."
		        },
		        "eraser": {
		            "name": "Slopen",
		            "description": "Vernietigt een machine en geeft 50% van de grondstoffen terug die gebruikt zijn om de machine te bouwen."
		        },
		        "eraser2": {
		            "name": "Recyclen",
		            "description": "Recyclet een machine en geeft 90% van de gebruikte grondstoffen terug."
		        },
		        "eraser3": {
		            "name": "Demonteren",
		            "description": "Demonteert een machine en geeft alle grondstoffen terug die gebruikt zijn om de machine te bouwen."
		        },
		        "clicker1": {
		            "name": "Qanetiet oscillator",
		            "description": "Hiermee kun je op grondstoffen klikken en deze vasthouden om ze te breken. Er kan er maar één zijn."
		        },
		        "clicker2": {
		            "name": "Hel edelsteen oscillator",
		            "description": "Een Qanetiet oscillator upgrade. Verhoogt de oscillatiefrequentie. Er kan er maar één zijn."
		        },
		        "clicker3": {
		            "name": "Chromaliet oscillator",
		            "description": "Een Hel edelsteen oscillator upgrade. Maximaliseert de oscillatiefrequentie. Er kan er maar één zijn."
		        },
		        "stabilizer": {
		            "name": "Stabilisator",
		            "description": "Stabiliseert een aangrenzende spanningspiek om tijdelijk zijn kracht te benutten."
		        },
		        "stabilizer2": {
		            "name": "Stabilisator II",
		            "description": "Een upgrade voor de stabilisator. Verbetert stabiliteit en prestaties."
		        },
		        "stabilizer3": {
		            "name": "Gebroken Stabilisator",
		            "description": "Anomale upgrade. Verbetert prestaties en maximaliseert stabiliteit. Er kan er maar één zijn."
		        }
		    },
		    "messages": [
		        "Waar ben je?",
		        "Ik zit letterlijk in niemandsland",
		        "Oké, wat zie je?",
		        "Nou, niet veel. Er staat hier een machine die er enigszins bekend uit ziet, maar ik durf er niet aankomen",
		        "Wat voor een machine?",
		        "Wacht even, misschien kan ik...",
		        "Wacht, zeg me alsjeblieft dat je NIET op wat knopjes van een willekeurige machine zit te drukken!",
		        "Het werkt! Het heeft net iets gemaakt",
		        "???",
		        "Een enorme zwarte kubus. Hij is zo strak. Ik wil hem echt breken",
		        "Ben je high?",
		        "Ik heb nu 64 stenen!",
		        "Nou, oké dan. Veel plezier ermee.",
		        "Hé, ik heb een gele steen gevonden!",
		        "Goed voor je!",
		        "Ik denk dat ik nu machines kan bouwen. Ik moet iets bouwen om deze kubussen gemakkelijker te kunnen breken. Als een kubus in een aangrenzende cel verschijnt, zelfs in een diagonale cel, dan zou het moeten werken.",
		        "Wacht, ben je soms een vreemd spel aan het spelen? Je begint me bang te maken",
		        "Nu moet ik gewoon een gele steen in deze machine plaatsen.",
		        "Als dat je vrolijk maakt... Grapje, maar kom je vandaag langs?",
		        "Zeker weten! Ik ben er over een paar uur, ik moet dit nog even afmaken.",
		        "Wat ben je eigenlijk aan het doen?",
		        "Ik stuur je later wel een bericht. Ik moet nu zorgen dat de machine blijft werken, sorry.",
		        "Ik denk dat de machines elkaar beïnvloeden als ze in aangrenzende of diagonale cellen worden geplaatst. Deze ventilator moet bijvoorbeeld naast de eerste machine worden geplaatst om het proces te versnellen.",
		        "Je zegt nu echt zinnige dingen",
		        "Nou?",
		        "Waar ben je?",
		        "We wachten al een eeuwigheid op je.",
		        "Wat bedoel je? Ik ben nog steeds hier.",
		        "WAAR???",
		        "Ik heb nu een blauwe steen. Of is het paars? Het klinkt als een antieke koperen kandelaar. Ik denk dat ik het kan gebruiken om verkeerd geplaatste machines te verwijderen.",
		        "Neem je me in de maling? Ik dacht dat je zei dat je zou komen. Wat is dit nu?!",
		        "Rustig maar, ik kom er zo aan",
		        "Wow, ik kan [Q] gebruiken om machines te klonen of te vernietigen als ik eerst op een vrije cel klik! En met [Alt] kan ik achter hoge machines kijken.",
		        "HOP HOP",
		        "Zijn jullie er nog?",
		        "KRIJG NOU WAT!!!",
		        "Waar ben je????",
		        "Gaat het??",
		        "????",
		        "Wat krijgen we nou?",
		        "GAAT HET? WAAR BEN JE?",
		        "Rustig maar! Ik ben oké, wat is er aan de hand?",
		        "Zeg jij het maar! Je bent me nu al twee weken aan het negeren! Ik ben zelfs een paar keer bij je thuis geweest, maar je was er niet. Vertel me gewoon waar je bent. Ben je nu thuis?",
		        "Gast, waar heb je het over? We hebben letterlijk twee minuten geleden nog berichtjes gestuurd.",
		        "WAT IS ER MIS MET JE??? Eerst kwam je niet opdagen, daarna was je helemaal verdwenen. En nu doe je alsof er niets gebeurd is!",
		        "Ik stel je gewoon een eenvoudige vraag",
		        "WAAR BEN JE?",
		        "Ik ben hier.",
		        "W A A R",
		        "Wacht even...",
		        "Dit is niet meer grappig. Waar ben je nu precies? Kun je me dat vertellen?",
		        "Nou...",
		        "Gast, ik weet het eigenlijk niet.",
		        "Laat me even nadenken",
		        "Hoe bedoel je, je weet het niet?",
		        "Ik moet mijn gedachten even ordenen",
		        "Is alles in orde? Ben je veilig? Moet ik iemand bellen?",
		        "Nee, het gaat goed met mij. Ik moet gewoon",
		        "Ik stuur je zo een berichtje",
		        "Verdomme, man. Wat is er aan de hand?",
		        "Ik ben bang",
		        "Het lijkt erop dat ik niet weet waar ik ben",
		        "Dit is zo raar. Ik bedoel, alles is goed met me. Maar ik kan deze plek niet beschrijven.",
		        "Het is als een droom, maar toch ook weer niet. Alles is wit en er zijn deze machines. En kubussen. Het slaat nergens op.",
		        "Ik ben niet high of zoiets. Ik realiseerde me gewoon hoe vreemd het is dat ik nooit eerder heb opgemerkt dat dit niet leek op iets wat ik ooit al gezien heb.",
		        "Nu heb ik rode stenen, en het is een beetje griezelig dat ik hier helemaal oké mee ben. Oké, het is gewoon een rode steen, alles is in orde.",
		        "Dus je maakt geen grapje...",
		        "Ik begrijp hoe het overkomt. Maar ja, het is nu eenmaal wat ik zie.",
		        "Kan ik iets voor je doen?",
		        "Praat gewoon met me, meer niet.",
		        "Dat kan maat, dat kan. Trouwens, de politie is nu naar je op zoek. Alsof je vermist bent.",
		        "Heb je hen onze berichten laten zien?",
		        "Hoe zou dat helpen? Nee, ik heb automatisch verwijderen ingeschakeld.",
		        "Bedankt!",
		        "Hoe gaat het daar?",
		        "Nou, het blijkt dat ik me kan verplaatsen door WASD te gebruiken. Maar er is niets interessants in de buurt, behalve deze vreemde rots in het noorden.",
		        "Dus het kompas van je telefoon werkt daar!",
		        "Nou, vanaf hier is het naar \"omhoog\", dus ik neem aan dat dat het noorden is.",
		        "Klinkt logisch",
		        "En eigenlijk heb ik geen telefoon bij me...",
		        "Hoe stuur je mij dan een bericht?",
		        "Ik weet het niet!! Ik weet gewoon wanneer je mij een bericht stuurt. En ik kan op je reageren! Het is niet eenvoudig uit te leggen.",
		        "Maak je geen zorgen. We kunnen praten en dat is al goed genoeg.",
		        "Ja, je hebt gelijk.",
		        "Dus... Vertel me over de machines",
		        "Wat bedoel je?",
		        "Wat zijn ze, wat doen ze, hoe werken ze?",
		        "Nou, ze zien er leuk uit, met wat kabels en draden en zo",
		        "Eentje ziet er bijvoorbeeld uit als een grote plastic doos met een koperen spoel aan de bovenkant, waar een blauwe steen in past. Op de zijkant zit een groot label met de tekst \"E-01SR\" en een kleiner label met de tekst \"Let op! Sterke entropie straling\"",
		        "Wat betekent dat?",
		        "Geen idee. Ik denk dat er wat entropie straling is.",
		        "Wacht, ik dacht dat jij deze machines maakte?",
		        "Ja... Ik begrijp wat je bedoelt.",
		        "Ik maak ze gewoon op een of andere manier van kubussen. Maar ik weet niet wat erin zit. Ja, dat klinkt inderdaad vreemd, laat me er anders even over nadenken.",
		        "En trouwens, het lijkt erop dat er geen oneindige hoeveelheid gele en blauwe stenen zijn, dus ik zou echt moeten investeren in omvormers of in een nieuwe mijn.",
		        "Goed plan",
		        "Wat een ellende!",
		        "Huh?",
		        "Een groene steen! Het duurt eeuwen om deze te breken. Ik moet iets bedenken als ze blijven tevoorschijn komen.",
		        "Ik weet zeker dat je daar een mooie machine voor zult maken!",
		        "Zeker weten!",
		        "Hell yeah! Hel edelstenen, pas op.",
		        "Laat de hel losbreken!",
		        "Weet je nog dat je naar de machines vroeg?",
		        "Yeah",
		        "Ik denk niet dat ze echt zijn",
		        "Wat bedoel je daarmee?",
		        "Het is net als een droom. Ik kan er niet in kijken of ze van een andere kant bekijken.",
		        "Een vage voorstelling van onverklaarbare technologie",
		        "Ik denk dat deze machines er zo uitzien, alleen maar vanwege de manier waarop ik hun functie waarneem.",
		        "Alsof iets wat bomen omhakt eruit moet zien als een bijl?",
		        "Zoiets ja",
		        "Nou, je klinkt in ieder geval behoorlijk echt voor mij",
		        "Ja, ik denk dat jij op dit moment het enige echte voor mij bent",
		        "Ik heb een heleboel nieuwe kubussen, die vervallen naar andere kubussen!",
		        "Nou ja, niet goed, niet slecht",
		        "Ik moet iets heel vreemds zeggen",
		        "Zie je de ironie in wat je net schreef?",
		        "Misschien komt het door deze vreemde plek, maar op de een of andere manier ben ik je naam vergeten",
		        "Nou, ik denk dat we dan wat meer tijd met elkaar kunnen doorbrengen",
		        "Ik meen het",
		        "Mijn naam is uiteraard Duke Nukem.",
		        "Gast, stop ermee!",
		        "Dat is wat zij zei!",
		        "Dat is dom! Stop met me bang te maken. Wat is er aan de hand?",
		        "Verdorie",
		        "Het lijkt erop dat ik mijn eigen naam ook niet meer weet",
		        "Ik kan gewoon niet meer! Het is te gek voor woorden. En ik kan je naam niet meer herinneren!",
		        "Misschien is het gewoon een geval van massahysterie? Ik heb gehoord dat het meerdere mensen tegelijk kan treffen. Laten we kalmeren en kijken wat er gebeurt.",
		        "Ja, natuurlijk, hysterie",
		        "Ik kan me nog steeds geen namen herinneren",
		        "Ik ook niet. En er is meer",
		        "Ja! Hoe zie ik eruit? Wanneer hebben we elkaar ontmoet?",
		        "Hoe ziet mijn huis eruit, wie zijn onze vrienden? Hebben we elkaar al ontmoet?",
		        "Het lijkt alsof we allebei met hetzelfde probleem zitten. En ik kan niet eens zeggen of het altijd zo is geweest of dat er op een gegeven moment iets is gebeurd. Is dit misschien een rare droom? En wie van ons droomt er?",
		        "Zijn er machines in de buurt? Misschien is er ergens een kubus tevoorschijn gekomen?",
		        "Grappig",
		        "Nou, laten we eens wat namen voor onszelf verzinnen.",
		        "Je klinkt als Veen",
		        "Waarom niet",
		        "Ik heb niets tegen Veen",
		        "Hé, Veen. Wil je wat bonen, Veen? Ja, dat klinkt goed.",
		        "En jij zal Charps zijn",
		        "Ben je aan het knarpen met je harp, Charps?",
		        "Dat slaat nergens op!",
		        "Ik vind Charps leuk. Leuk om je te ontmoeten, Veen",
		        "Jij ook, Charps",
		        "WAT IS ER AAN DE HAND",
		        "Wat?",
		        "Witte kubussen! Ze vernietigen de groene!",
		        "Er zijn ook heel veel kubussen aan het vervallen! Het is als in een kernreactor!",
		        "Verdorie, is alles goed met je?",
		        "Ja, alles is oké! Het is hier gewoon een puinhoop nu. Ik moet iets bouwen om dit op te lossen. Misschien moet ik nog eens gaan kijken naar een rots in het noorden.",
		        "Dat is wat je altijd doet, Charps!",
		        "Klinkt raar!",
		        "Mijn naam, bedoel ik. Ik denk dat ik er op een gegeven moment wel aan zal wennen. Toch, Veen?",
		        "Ja! Raar inderdaad.",
		        "Weet je nog dat ik het had over een vreemde rots in het noorden?",
		        "Niet echt, nee",
		        "Nou, er is daar een rots. En begrijp me niet verkeerd, ik besef dat alles hier vreemd is. Maar deze rots lijkt nog veel vreemder dan al het andere.",
		        "Ik kan er niets zinnigs over zeggen. Maar toen ik besloot er een beetje in te prikken, veranderde het iets in de regels van dit universum!",
		        "Is het gevaarlijk?",
		        "Ik weet het niet. De verandering is subtiel.",
		        "Ik vraag me af wat het nog meer kan.",
		        "Oké, maar vernietig niet per ongeluk het universum.",
		        "Ik zal mijn best doen.",
		        "Nou, DAT was de hardste steen van mijn leven! Maar ik denk dat ik nu weet hoe ik het sneller kan breken.",
		        "Heb je een nieuwe steen?",
		        "Ja, de vreemdste tot nu toe",
		        "Woah, misschien was het effect op het universum toch niet zo subtiel. Voel je het ook?",
		        "Wat moet ik voelen?",
		        "Misschien ligt het aan mij.",
		        "Heb je toevallig op dit moment even een enorme kubus gezien?",
		        "Ehm, mag het ook een koelkast zijn?",
		        "Laat maar zitten",
		        "Wow, deze nieuwe kubus is pikzwart. En voelt buitenaards aan.",
		        "Meer buitenaards dan de vorige?",
		        "Het is anders! Het is ijskoud, maar niet op een schadelijke manier. Het mist het concept van temperatuur en het heeft geen interactie met je. Het is niet gemaakt van materie, heeft geen kleur of iets wat ik ken, als je dat begrijpt.",
		        "Eerlijk gezegd niet.",
		        "Ik denk dat ik het begrijp. Ik kan holle stenen gebruiken om dat zwarte spul uit het niets te laten condenseren. Het vormt vreemde identieke kristallen, maar zonder eigenschappen. En dat lost op de een of andere manier afwijkingen in het universum op.",
		        "Dat klinkt als een luchtfilter",
		        "Ja, precies! Het lijkt erop dat ik op een of andere manier de atmosfeer heb bedorven.",
		        "Je hoeft het niet hardop te zeggen",
		        "Ik heb besloten om die vreemde rots op te graven. Misschien zit het antwoord op wat er allemaal gebeurt wel vanbinnen. Ik heb het gevoel dat het misschien niet alleen alles aantast, maar op de een of andere manier ook alles kan beheersen!",
		        "Waarom denk je dat?",
		        "Geloof je me als ik zeg dat ik het zo aanvoel?",
		        "Natuurlijk! Ik denk dat ik nu alles zou geloven. Een steen die het universum bestuurt? Waarom niet!",
		        "Ik denk dat ik een beroerte krijg!",
		        "Alsjeblieft niet",
		        "Deze machines zijn zo ontzettend luid en flikkeren zo fel. Misschien moet ik iets aanpassen om het te verhelpen. Of mezelf aanpassen. Of beide.",
		        "Zo, dat is beter!",
		        "Dus, wat heb je aangepast?",
		        "Wacht, er is iets mis.",
		        "Ik heb iets gebouwd van het zwarte spul. En het is geen machine. Maar het deed iets met de tussenstations.",
		        "Wat zijn tussenstations?",
		        "Ze verschuiven het universum om je heen, zo kom je op verschillende plaatsen.",
		        "Hoe weet je dat ze het universum en niet jou hebben verplaatst?",
		        "Hmm, daar heb ik niet aan gedacht",
		        "Ik denk dat ik het universum heb vernield",
		        "Dit slaat allemaal nergens op!",
		        "De machines zijn niet logisch, niets is logisch.",
		        "Ik hoop dat ik dit kan oplossen",
		        "Veen?",
		        "Gast, ben je daar?",
		        "Alsjeblieft, doe dat alsjeblieft niet! Ik hoop dat je gewoon even naar de wc bent gegaan of zoiets.",
		        "VEEN!",
		        "WAT?",
		        "Het is nog steeds vreemd.",
		        "Oh godzijdank!",
		        "Heb je iets nieuws gebouwd?",
		        "Ik dacht dat ik het universum had vernield en dat jij voor altijd weg was! Ik was in een soort onderwereld met wat symbolen en dat het de overblijfselen van het universum waren. Maar het is een ander universum of een andere versie, omdat ze op elkaar lijken, en nu zijn ze verbonden met elkaar.",
		        "Op ontdekkingstocht? Klinkt leuk!",
		        "Leuk? Heb je mijn bericht wel gelezen? EEN ANDER UNIVERSUM!!!",
		        "Je moet accepteren dat je niet meer in staat bent om me te verrassen.",
		        "Dat begrijp ik",
		        "Het is geen rots, het is een lens",
		        "Het kan alles laten samenkomen in één enkel punt. En met alles bedoel ik echt alles! Ruimte, tijd, alle concepten en regels. Alles!",
		        "Heb je de handleiding gevonden of zo?",
		        "Ik weet niet waarom het daar is en waarom we hier zijn. Ik weet nu gewoon op de een of andere manier wat het doet.",
		        "Dus... Ga je alles laten samenkomen of hoe zit het?",
		        "Ik weet niet hoe. Maar misschien is het wel het punt van deze plek. Nu zweeft het gewoon in de lucht alsof dat de bedoeling is.",
		        "En wat gebeurt er daarna?",
		        "Geen idee",
		        "Hoe meer ik erover nadenk, hoe meer ik begrijp dat het niet alleen je machines zijn die niet echt zijn.",
		        "Ik probeer mezelf specifieke vragen te stellen en ik heb geen antwoorden.",
		        "Weet je nog dat ik zei dat de politie naar je op zoek was? Ik maakte geen grapje. Maar nu maakt niets nog zin als ik mezelf vragen stel.",
		        "Ben ik naar het politiebureau gegaan of heb ik hen gebeld? En wie was daar? Agenten? Waar in de stad is dat politiebureau? Wat is dit voor een stad? Woon ik in deze stad? Wat is de naam van de stad? En in welke provincie ligt deze stad? Of zijn er überhaupt provincies?",
		        "Ik kan geen enkele vraag beantwoorden. Alles leek normaal te zijn totdat ik vragen begon te stellen. Ik ben bang om meer vragen te stellen.",
		        "Sorry voor dat",
		        "Nee, het is helemaal niet je schuld. We zitten in hetzelfde schuitje, voor zover ik weet.",
		        "Ik hoop dat je erachter komt wat dit schuitje is.",
		        "Ja, ik ook!",
		        "We zullen zien hoe het afloopt. Ik hoop alleen dat dit niet een soort eeuwige hel of limbo is.",
		        "Dat is het, Dante!",
		        "Nu komen we ergens. Deze jongens zouden dit universum leeg moeten zuigen!",
		        "Je klinkt als een oliemaatschappij",
		        "Ik ben het beu om alles aan te passen om een beetje efficiënter te zijn en ik ben het lawaai beu. Deze machine zou alles moeten veranderen. Het rukt zelfs door de andere kant heen.",
		        "Is dat niet gevaarlijk?",
		        "Het begrip gevaar is hier nogal vaag.",
		        "Ik denk dat het tijd is om iets groots te maken.",
		        "Wat heb je in je gedachten?",
		        "Dat weet ik niet zeker. Maar het moet groot zijn!",
		        "Zoals een enorme machine?",
		        "Nee, ik bedoelde het metaforisch",
		        "Doe het gewoon!",
		        "Oh fuck",
		        "Ik heb iets verkeerd gedaan. De omgekeerde kloof is vernietigd. Alles stort in.",
		        "Gaat het?",
		        "Ja, maar de machines worden vernietigd! Ik kan niets bouwen! Verdomme!",
		        "Wacht! Misschien is dat wel de bedoeling?",
		        "NEE! Dat is het niet!",
		        "Hoe weet je dat?",
		        "Wacht even, ik moet dit op de een of andere manier oplossen",
		        "Hier gaan we dan!",
		        "Ik zie je! Je liep net langs een enorme kastanjeboom, op die grappige planeet in het bovenste deel van de melkweg.",
		        "Nee, dat heb ik niet gedaan! Welke melkweg?",
		        "Oh, het is moeilijk om de exacte tijd te bepalen, het is waarschijnlijk nog niet gebeurd. Maar wacht gewoon 15 miljard jaar!",
		        "Je zegt nu echt zinnige dingen. Kom je trouwens langs?",
		        "Zeker weten! Ik ben er over een paar uur, ik moet dit nog even afmaken.",
		        "Oké, tot dan!",
		        "Maar alsjeblieft, Charps",
		        "Wees deze keer niet te laat",
		        "Dat zal ik niet zijn, Veen, dat zal ik niet zijn!"
		    ],
		    "credits": [
		        "Het begin",
		        "Ik waardeer het enorm dat je het einde hebt gehaald, waar alles begint",
		        "Gefeliciteerd, denk ik!",
		        "Kijk hier maar eens naar:",
		        "Totaal gewonnen grondstoffen:",
		        "Charonieten:",
		        "Elmerines:",
		        "Qanetieten:",
		        "Beta-pylenen:",
		        "Hel edelstenen:",
		        "Chromalieten:",
		        "Hemels schuim:",
		        "Holle stenen:",
		        "Leegtes:",
		        "Realiteiten:",
		        "Gebouwde machines:",
		        "Machines vernietigd:",
		        "Maximale kanaaldiepte in meters:",
		        "Vreemde rots geprikt:",
		        "Aantal keer geteleporteerd:",
		        "Kubus klikken:",
		        "Tijdvervormingen:",
		        "Speeltijd:",
		        "u",
		        "Spel gemaakt door:<br>Oleg Danilov",
		        "Extra grafische weergaven:<br>Yulia Nogteva",
		        "Dialoog montage:<br>Abdurahman Zulumhanov en Anna Peterson",
		        "Steam publicatie:<br>Playsaurus",
		        "Spel testers:<br>community of Leprosorium, Abdurahman Zulumhanov, Playsaurus",
		        "HET EINDE",
		        "Je mag nu Cookie Clicker of iets dergelijks spelen.",
		        "Muziek:<br>Shallow Anne door Jake Chudnow",
		        "Deutsch: flex 4711, Patrick Karban",
		        "Português: selfemcrowdin, Mateus Iamarino",
		        "Italiano: doralum",
		        "Español: armangar, Syunay Kamenov",
		        "Français: KjetilVion, Etienne Samson, William (Ekitchi)",
		        "Nederlands: lievevandyck",
		        "Čeština: Jakub Strelinger",
		        "Polski: PolglishPL",
		        "日本語: Winna Tolentino",
		        "한국어: Ah Lon Sin, Sumin Park, Cyberowl",
		        "简体中文：Daisy Chan, kevinlee7, YuLun",
		        "繁體中文: Daisy Chan, kevinlee7",
		        "ไทย: They say P, Phimze Pym",
		        "Magyar: Simon Dániel és Márton-Mezey Csenge",
		        "Latviešu valoda: Roberts Artūrs Bumburs (Arburo)",
		        "Română: Eric Apetrei"
		    ],
		    "explainer": [
		        "Selecteer en houd ingedrukt.",
		        "Klik altijd op de cel eronder.",
		        "<span class=\"keyboard\">Q</span>, <span class=\"keyboard\">Esc</span> of klik met de rechtermuisknop om te annuleren.",
		        "Houd <span class=\"keyboard\">Alt</span> ingedrukt voor meer info.",
		        "Druk op <span class=\"keyboard\">Q</span> boven een lege cel om een sloopgereedschap te kiezen.",
		        "Druk op <span class=\"keyboard\">Q</span> boven een machine om te proberen er nog een te bouwen.",
		        "WASD of beweeg met de muis terwijl je de rechtermuisknop ingedrukt houdt om rond te kijken."
		    ],
		    "random": {
		        "paste": "Een code is naar het klembord gekopieerd. Plak deze ergens veilig.",
		        "toolate": "Het is te laat om nog iets op te slaan. Alles is al gebeurd.",
		        "existed": "NIEUW",
		        "steamWarning": "Steam-fout. Autosave en prestaties zullen niet werken. Probeer het spel opnieuw te starten."
		    }
		},
		fr: {
		    "splash": {
		        "sixtyfour": "SIXTY&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FOUR",
		        "continue": "<span>CONTINUER</span><div class=\"keyboard\">Esc</div>",
		        "start": "<span>COMMENCER</span><div class=\"keyboard\">Esc</div>",
		        "soundoff": "LE SON EST DÉSACTIVÉ",
		        "soundon": "LE SON EST ACTIVÉ",
		        "save": "SAUVEGARDER",
		        "load": "CHARGER",
		        "language": "LANGUE : FRANÇAIS",
		        "reset": "RÉINITIALISER",
		        "credit": "©2024 Oleg Danilov, publié par Playsaurus. Version",
		        "warning": "Vous allez tout perdre. Ceci n'est pas une plaisanterie. Gardez cliquez pour valider.",
		        "glory": "SUCCÈS",
		        "deglory": "RETOUR",
		        "quit": "QUITTER",
		        "export": "Exporter",
		        "import": "Importer",
		        "flashbang": "Des lumières clignotantes font partie de ce jeu. Si vous y êtes sensible, vous pouvez envisager de désactiver les flashs en cliquant sur cette icône."
		    },
		    "achievements": [
		        {
		            "name": "L'or des fous",
		            "description": "Obtenez un peu d'Elmerine"
		        },
		        {
		            "name": "Deep Purple",
		            "description": "Obtenez de la Qanetite"
		        },
		        {
		            "name": "Le sang de la terre",
		            "description": "Obtenez du bêta-pylène"
		        },
		        {
		            "name": "Énergie verte",
		            "description": "Trouvez une gemme infernale"
		        },
		        {
		            "name": "Verre brûlant",
		            "description": "Trouvez une Chromalite"
		        },
		        {
		            "name": "Saint béton",
		            "description": "Obtenez de la Mousse Céleste"
		        },
		        {
		            "name": "Ça marche pour la vaisselle ?",
		            "description": "Obtenez une Pierre Creuse"
		        },
		        {
		            "name": "Là où le soleil ne brille pas",
		            "description": "Obtenez du vide"
		        },
		        {
		            "name": "Who you gonna call ?",
		            "description": "Obtenez un peu de Réalité"
		        },
		        {
		            "name": "Nietzsche",
		            "description": "Contemplez l'abîme 64 fois"
		        },
		        {
		            "name": "64 K",
		            "description": "Obtenez 64 000 pierres"
		        },
		        {
		            "name": "64 M",
		            "description": "Obtenez 64 000 000 pierres"
		        },
		        {
		            "name": "64 B",
		            "description": "Obtenez 64 000 000 000 de pierres"
		        },
		        {
		            "name": "Vous pouvez recommencer maintenant",
		            "description": "Restez coincé au départ"
		        },
		        {
		            "name": "Mouvement perpétuel",
		            "description": "Assemblez deux silos"
		        },
		        {
		            "name": "Besoin d'une pause ?",
		            "description": "Jouez pendant 64 heures"
		        },
		        {
		            "name": "Doit... Détruire",
		            "description": "Cliquez sur un cube 6 400 fois"
		        },
		        {
		            "name": "Architecte",
		            "description": "Construisez 64 machines"
		        },
		        {
		            "name": "Destructeur",
		            "description": "Détruisez 64 machines"
		        },
		        {
		            "name": "L'infernal",
		            "description": "Possédez 9 Coffres-forts Infernaux"
		        },
		        {
		            "name": "Fin/Commencement",
		            "description": "Explosez le Gouffre Inverti"
		        },
		        {
		            "name": "Cookie Clicker",
		            "description": "Cliquez sur un cookie"
		        },
		        {
		            "name": "Marin ivre",
		            "description": "Klaxonnez 64 fois sans raison"
		        },
		        {
		            "name": "Mr. Mine",
		            "description": "Disposez de 9 Canaux d'Excavation"
		        },
		        {
		            "name": "Y a-t-il une limite ?",
		            "description": "Atteindre 64 km de profondeur"
		        },
		        {
		            "name": "Seth Brundle",
		            "description": "Téléportez-vous <s>1</s> 64 fois"
		        },
		        {
		            "name": "Rocher Rouge-Bleu",
		            "description": "Terminez le jeu sans rien supprimer pendant 15 minutes et en ayant moins de 15 silos de confinement"
		        },
		        {
		            "name": "Directement en enfer !",
		            "description": "Obtenez une Gemme Infernale dans les 64 premières minutes du jeu"
		        },
		        {
		            "name": "Gratter le vernis",
		            "description": "Atteindre 64 mètres de profondeur"
		        },
		        {
		            "name": "C'est chaud ?",
		            "description": "Atteindre 640 mètres de profondeur"
		        },
		        {
		            "name": "Trop profond",
		            "description": "Atteindre 6 400 mètres de profondeur"
		        },
		        {
		            "name": "64 km/h en chute libre",
		            "description": "Atteignez une profondeur de 6 400 m dans les 6 minutes suivant la pose d'un nouvel Canal d'Excavation"
		        },
		        {
		            "name": "Néophobie",
		            "description": "Terminez le jeu sans jamais améliorer les canaux d'extraction"
		        }
		    ],
		    "resources": [
		        "Charonite",
		        "Elmerine",
		        "Qanetite",
		        "Béta-Pylène",
		        "Gemme Infernale",
		        "Chromalite",
		        "Mousse Céleste",
		        "Pierre Creuse",
		        "Vide",
		        "Réalité"
		    ],
		    "entities": {
		        "pinhole": {
		            "name": "?",
		            "description": "U/D, C/S, T/B, E/νE, μ/νμ, τ/ντ, G/γ, Z/W, H, Δ/νΔ"
		        },
		        "gradient": {
		            "name": "Puits Différentiel",
		            "description": "Un cube perpétuellement exploitable. Répond à la plupart des déstabilisateurs et résonateurs. Doit être connecté au Gouffre Inverti."
		        },
		        "chasm": {
		            "name": "Le Gouffre Inverti",
		            "description": "Un pont vers l'inconnu."
		        },
		        "conductor": {
		            "name": "Conducteur",
		            "description": "Connecte le Gouffre Inverti aux silos industriels."
		        },
		        "pump": {
		            "name": "Canal d'Extraction",
		            "description": "Extrait des ressources et les place aux alentours."
		        },
		        "pump2": {
		            "name": "Canal d'Excavation",
		            "description": "Amélioration pour le Canal d'Extraction. Extrait rapidement une grande quantité de ressources et les dispose plus loin."
		        },
		        "vault": {
		            "name": "Caveau Infernal",
		            "description": "Isole 1024 Gemmes Infernales de l'environnement."
		        },
		        "cube": {
		            "name": "Cube de ressources",
		            "description": "Ressources extraites."
		        },
		        "destabilizer": {
		            "name": "Déstabilisateur",
		            "description": "Placez-le à côté d'un cube pour le casser deux fois plus vite. Nécessite une Elmerine pour fonctionner. Des déstabilisateurs supplémentaires augmentent l'effet."
		        },
		        "destabilizer2": {
		            "name": "Déstabilisateur Industriel",
		            "description": "Une amélioration du déstabilisateur. Quadruple la puissance du processus d’écrasement des ressources. Nécessite 64 Elmerine pour fonctionner. Des déstabilisateurs supplémentaires augmentent l'effet."
		        },
		        "destabilizer2a": {
		            "name": "Déstabilisateur de Gemmes Infernales",
		            "description": "Une amélioration du Déstabilisateur Industriel. Multiplie la puissance du processus d'écrasement par 625 lorsque l'un d'entre eux est présent dans le cube extrait. Autrement n'apporte aucun avantage. Nécessite 1 Gemme Infernale pour fonctionner. Des déstabilisateurs supplémentaires accentuent l'effet."
		        },
		        "doublechannel": {
		            "name": "Refroidisseur de canal",
		            "description": "Placez-le à côté d'un canal pour doubler ses performances. Des refroidisseurs supplémentaires accentuent l'effet."
		        },
		        "doublechannel2": {
		            "name": "Refroidisseur de canal actif",
		            "description": "Une amélioration du refroidisseur de canal. Triple le débit dans un canal source s'il est placé à côté de celui-ci. Des refroidisseurs supplémentaires accentuent l'effet."
		        },
		        "valve": {
		            "name": "Soupape d'inversion",
		            "description": "Empêche la machine d'extraction de cubes de se réinitialiser à sa position d'origine si elle est placée à côté d'elle. Nécessite une Charonite pour fonctionner."
		        },
		        "auxpump": {
		            "name": "Pompe auxiliaire",
		            "description": "Une amélioration de la soupape d'inversion. Fournit une pression sur un canal source adjacent. Nécessite 8 Elmerines pour fonctionner. Les pompes supplémentaires n'augmentent pas la pression du canal."
		        },
		        "auxpump2": {
		            "name": "Station de pompage",
		            "description": "Une amélioration de la pompe auxiliaire. Quadruple la pression dans le canal source adjacent. Requiert 256 Elmerine et 4 Béta-Pylène pour fonctionner. Des stations supplémentaires n'augmentent pas le débit dans un canal source."
		        },
		        "entropic": {
		            "name": "Résonateur Entropique",
		            "description": "Broie périodiquement les ressources des cubes adjacents. Nécessite une Qanetite pour fonctionner."
		        },
		        "entropic2": {
		            "name": "Résonateur Entropique II",
		            "description": "Une amélioration du résonateur d'entropie. Écrase les ressources 3 fois plus vite. Nécessite un Chromalit pour fonctionner."
		        },
		        "entropic2a": {
		            "name": "Condensateur Entropique",
		            "description": "Une amélioration du Résonateur Entropique. Broie les ressources au moment où elles apparaissent à la surface avec une puissance de 600 %. Mais juste une fois par cube. Nécessite 8 Chromalites pour fonctionner."
		        },
		        "entropic3": {
		            "name": "Résonateur du Vide",
		            "description": "Une amélioration du Résonateur Entropique II. Lorsque l'annihilation se produit, le résonateur écrase les cubes autour de lui avec une immense puissance."
		        },
		        "converter32": {
		            "name": "Cuve d'Enrichissement de Charonite",
		            "description": "Fait réagir lentement la Qanenite et la Charonite pour produire de l'Elmerine."
		        },
		        "converter13": {
		            "name": "Stagnateur de Charonite",
		            "description": "Récupère la Qanenite des sédiments de Charonite liquéfiés en présence de catalyseurs."
		        },
		        "converter41": {
		            "name": "Oxydateur à Bêta-Pylène",
		            "description": "Brûle le Bêta-Pylène pour produire de la Charonite et des traces d'autres éléments."
		        },
		        "converter76": {
		            "name": "Irradiateur Céleste",
		            "description": "Irradie la Mousse Céleste avec une Chromalite, transformant celle-ci en plus de Chromalite, qui sont une excellente source de Gemmes Infernales, de Béta-Pylène, de Qanetite et d'Elmerine après désintégration."
		        },
		        "converter64": {
		            "name": "Réacteur Céleste",
		            "description": "Permet la fusion contrôlée de la Chromalite avec de la Mousse Céleste afin de produire du Bêta-Pylène. Ne peut pas fonctionner trop près d'autres Réacteurs Célestes."
		        },
		        "reflector": {
		            "name": "Réflecteur Céleste",
		            "description": "Améliore les performances d'un Réacteur Céleste adjacent."
		        },
		        "mega1": {
		            "name": "Tour d'Étiquetage des Matériaux",
		            "description": "Améliore la visibilité en compressant les ressources en movement. Unique."
		        },
		        "mega1a": {
		            "name": "Tour d'Étiquetage des Matériaux MKII",
		            "description": "Une amélioration de la Tour d'Étiquetage des Matériaux. Augmente la vitesse de transfert des ressources. Unique."
		        },
		        "mega1b": {
		            "name": "Tour d'Étiquetage des Matériaux MKIII",
		            "description": "Une amélioration de la Tour d'Étiquetage des Matériaux MKII. Augmente la compression des ressources en mouvement. Unique."
		        },
		        "mega2": {
		            "name": "Tour de recyclage",
		            "description": "Permet le recyclage des machines, restituant 90 % de leurs ressources. Unique."
		        },
		        "mega3": {
		            "name": "Tour de désassemblage",
		            "description": "Amélioration de la tour de recyclage. Permet le désassemblagle des machines afin de récupérer toutes les ressources. Unique."
		        },
		        "voidsculpture": {
		            "name": "Chancel d'Admiration du Vide",
		            "description": "Permet d'ignorer les inconvénients visuels des machines à vide."
		        },
		        "eye": {
		            "name": "Directeur du Remplissage",
		            "description": "Indique les machines prêtes à être remplies. Unique."
		        },
		        "cookie": {
		            "name": "Un cookie",
		            "description": "Comment est-il arrivé là ?"
		        },
		        "injector": {
		            "name": "Injecteur de Gemme Infernale",
		            "description": "Échange une ressource aléatoire d'un cube adjacent avec une Gemme Infernale si celui-ci n'en contien pas. Contient 32 charges s'il est fourni avec 32 Gemmes Infernales et 64 Qanetites."
		        },
		        "silo": {
		            "name": "Silo souterrain",
		            "description": "Lors de l'activation, recharge les machines à proximité, puis fournira automatiquement 16 charges supplémentaires à la demande."
		        },
		        "silo2": {
		            "name": "Silo industriel",
		            "description": "Une amélioration du silo souterrain. Lors de l'activation, recharge les machines à proximité, puis fournira automatiquement 64 charges supplémentaires à la demande."
		        },
		        "vessel": {
		            "name": "Capsule de confinement",
		            "description": "Stocke 32 Chromalites, empêchant leur fission. Consomme une Gemme Infernale."
		        },
		        "vessel2": {
		            "name": "Silo de confinement",
		            "description": "Une amélioration de la capsule de confinement. Stocke 32 768 chromalites empêchant leur fission. Consomme de la Réalité."
		        },
		        "consumer": {
		            "name": "Raffinerie catalytique",
		            "description": "Consomme les ressources broyées des cubes adjacents. Après avoir accumulé 1024 d'entre-elles, le tout est libéré avec un bonus supplémentaire. Ce bonus augmente à chaque libération consécutive, atteignant jusqu'à 100 %. Si aucune ressource n'est consommée pendant 16 secondes, le bonus est réinitialisé."
		        },
		        "preheater": {
		            "name": "Préchauffeur catalytique",
		            "description": "Augmente la vitesse des machines de conversions de ressources adjacentes. Chaque convertisseur augmente la vitesse du préchauffeur jusqu'à 300 % lorsque celui-ci est entouré de 8 machines."
		        },
		        "hollow": {
		            "name": "Affleurement creux",
		            "description": "Un vrai gruyère."
		        },
		        "strange": {
		            "name": "Roche creuse",
		            "description": "On dirait qu'elle est là depuis un moment."
		        },
		        "strange1": {
		            "name": "Site de recherche de la roche creuse",
		            "description": "Fait se désintégrer la Mousse Céleste avec 512 Gemmes Infernales au lieu de 64. NORD."
		        },
		        "strange2": {
		            "name": "Installation de roche creuse",
		            "description": "Double la quantité maximale de pierres creuses et augmente leur taux d'apparition."
		        },
		        "strange3": {
		            "name": "Creux reconstruit",
		            "description": "Augmente considérablement le taux d'apparition de roche creuse et fait tout en silence."
		        },
		        "generaldecay": {
		            "name": "Réacteur à désintégration générale",
		            "description": "Améliore considérablement les performances de désintégration de la Chromalite. Unique."
		        },
		        "waypoint": {
		            "name": "Point de repère",
		            "description": "Téléporte vers vous le prochain point de cheminement existant."
		        },
		        "annihilator": {
		            "name": "Annihilateur",
		            "description": "Produit du vide lorsque des gemmes infernales s'annihilent avec de la mousse céleste. Nécessite une pierre creuse pour fonctionner."
		        },
		        "flower": {
		            "name": "Fleur creuse",
		            "description": "Réduit le risque de distorsion temporelle. Annule l'effet d'une pierre creuse. Doit être construit sur une pierre creuse. Détruit la pierre creuse sur laquelle elle a été construite."
		        },
		        "fruit": {
		            "name": "Fruit creux",
		            "description": "Une amélioration de la fleur creuse. Empêche la formation de pierres creuses pour s'alimenter. Produit des pierres creuses."
		        },
		        "eraser": {
		            "name": "Démolir",
		            "description": "Détruit une machine en restituant 50 % des ressources utilisées pour la construire."
		        },
		        "eraser2": {
		            "name": "Recycler",
		            "description": "Recycle une machine en restituant 90 % des ressources utilisées pour la construire."
		        },
		        "eraser3": {
		            "name": "Démonter",
		            "description": "Démonte une machine en retournant toutes les ressources utilisées pour la construire."
		        },
		        "clicker1": {
		            "name": "Oscillateur à Qanetite",
		            "description": "Permet de maintenir un clic sur un cube pour le broyer. Unique."
		        },
		        "clicker2": {
		            "name": "Oscillateur à Gemme Infernale",
		            "description": "Une amélioration de l'oscillateur à Qanetite. Augmente la fréquence d'oscillation. Unique."
		        },
		        "clicker3": {
		            "name": "Oscillateur à Chromalite",
		            "description": "Une amélioration de l'oscillateur à Gemme Infernale. Augmente la fréquence d'oscillation au maximum. Unique."
		        },
		        "stabilizer": {
		            "name": "Stabilisateur",
		            "description": "Stabilise une surtension adjacente pour exploiter temporairement sa puissance."
		        },
		        "stabilizer2": {
		            "name": "Stabilisateur II",
		            "description": "Une amélioration du stabilisateur. Améliore la stabilité et la performance."
		        },
		        "stabilizer3": {
		            "name": "Stabilisateur Brisé",
		            "description": "Amélioration anomale. Améliore la performance et maximise la stabilité. Il ne peut y en avoir qu'une."
		        }
		    },
		    "messages": [
		        "T'es où ?",
		        "Je suis littéralement au milieu de nulle part",
		        "Très bien, que vois-tu ?",
		        "Eh bien, pas grand-chose. Il y a une machine ici, elle me dit quelque chose mais je n'arrive pas à mettre le doigt dessus",
		        "Quelle machine ?",
		        "Attends, je peux peut-être...",
		        "Attends, dis-moi que tu n'es PAS en train de bidouiller une machine en ce moment !",
		        "Ça marche ! Elle vient de fabriquer quelque chose",
		        "???",
		        "Un énorme cube noir. Tellement lisse. J'ai vraiment envie de le casser",
		        "Tout va bien dans ta tête ?",
		        "J'ai maintenant 64 pierres !",
		        "Bon, d'accord. Amuse-toi bien avec ça.",
		        "Hé, j'ai trouvé une pierre jaune !",
		        "Tant mieux pour toi mec !",
		        "Je pense que je peux fabriquer des machines maintenant. Je devrais construire quelque chose qui me permette de casser ces cubes plus facilement. Si un cube apparaît dans une cellule adjacente, même en diagonale, ça devrait marcher.",
		        "Attends, tu joues à un jeu bizarre ? Tu commences à me faire peur",
		        "Il ne me reste plus qu'à mettre une pierre jaune à l'intérieur de cette machine.",
		        "Si ça te fait plaisir... Bref, tu viens aujourd'hui ?",
		        "Grave ! Je serais là dans quelques heures, juste besoin de terminer ça.",
		        "Tu fais quoi exactement ?",
		        "Je t'enverrai un message plus tard. Je dois continuer à pousser la machine, désolé.",
		        "Je crois que les machines s'influencent mutuellement lorsqu'elles sont placées dans des cellules adjacentes ou diagonales. Par exemple, ce ventilateur doit être placé à côté de la première machine pour accélérer le processus.",
		        "Ouais, je comprends totalement ce que tu me dis là tout de suite",
		        "Eh bien ?",
		        "Où es-tu ?",
		        "Ça fait des heures qu'on t'attend.",
		        "Hein ? Je suis toujours là.",
		        "OÙ ???",
		        "J'ai une pierre bleue maintenant. Ou c'est violet ? On dirait un chandelier en laiton antique. Je pense que je pourrais l'utiliser pour supprimer les machines mal placées.",
		        "Tu te fous de moi ? Je croyais que tu avais dit que tu venais. Qu'est-ce que c'est que ce bordel ?!",
		        "Détends-toi mec, je serai là dans une minute",
		        "Wow, je peux utiliser [Q] pour cloner des machines ou les détruire si je clique d'abord sur une cellule libre ! Et [Alt] aide à voir derrière les grandes machines.",
		        "ET QUE ÇA SAUTE",
		        "Vous êtes toujours là, les gars ?",
		        "PUTAIN DE MERDE !!!",
		        "Où es-tu ????",
		        "Ça va ??",
		        "????",
		        "Qu'est-ce que c'est que ce bordel ?",
		        "ÇA VA ? T'ES OÙ ?",
		        "Calme-toi ! Je vais bien, qu'est-ce qu'il y a ?",
		        "A toi de me dire ! Ça fait deux semaines que tu m'ignores ! Je suis même allé chez toi plusieurs fois, mais t'étais pas là. Dis-moi juste où tu es, c'est tout. Tu es chez toi en ce moment ?",
		        "Mec, de quoi tu parles ? On s'est envoyé un texto il y a deux minutes.",
		        "C'EST QUOI TON PROBLÈME ? Déjà tu viens pas, et après tu disparais complètement. Et maintenant, tu fais comme si de rien n'était !",
		        "C'est facile pourtant",
		        "T'ES OÙ ?",
		        "Je suis là.",
		        "O Ù",
		        "Attends...",
		        "C'est pas drôle, mec. Où es-tu exactement ? Peux-tu me dire ça ?",
		        "Eh bien...",
		        "Mec, je ne sais pas vraiment.",
		        "Donne moi une minute",
		        "Comment ça, tu sais pas ?",
		        "Il faut que je réfléchisse un peu",
		        "Est-ce que tout va bien ? Es-tu en sécurité ? Dois-je appeler quelqu'un ?",
		        "Non, ça va. Je viens de",
		        "Je t'envoie un message dans un instant",
		        "Bordel, mec. Qu'est-ce qui se passe ?",
		        "J'ai peur",
		        "Je crois que je ne sais pas où je suis",
		        "C'est vraiment bizarre. Je veux dire, tout va bien pour moi. Mais je ne peux pas décrire cet endroit.",
		        "C'est comme un rêve, mais pas vraiment. Tout est blanc et il y a ces machines. Et des cubes. Cela n'a aucun sens.",
		        "Et j'ai rien pris. Je viens seulement de réaliser à quel point c'est chelou de pas avoir remarqué avant que cela ne ressemblait à rien que je reconnaisse.",
		        "J'ai des pierres rouges à present, et c'est un peu flippant que je sois totalement d'accord avec tout ça. Ok, juste une pierre rouge, tout va bien.",
		        "Alors tu ne plaisantes pas...",
		        "Je comprends mieux ta réaction. Mais oui, j'ai bien tout ça sous les yeux.",
		        "Je peux faire quelque chose pour toi ?",
		        "Parle-moi, c'est tout.",
		        "Bien sûr mon pote. D'ailleurs, les flics te cherchent maintenant. Comme si tu avais disparu.",
		        "Tu leur as montré nos messages ?",
		        "Pourquoi j'aurais fait ça ? Non, j'ai activé la suppression automatique.",
		        "Merci !",
		        "Comment ça se passe là-bas ?",
		        "Eh bien, on dirait que je peux me déplacer en utilisant les touches ZQSD. Mais il n'y a rien d'intéressant dans les environs, à part cet étrange rocher au nord.",
		        "Donc la boussole de ton téléphone marche !",
		        "Eh bien, c'est juste \"en haut\" d'ici, donc je suppose que c'est le nord.",
		        "Logique",
		        "Et en fait je n'ai pas de téléphone...",
		        "Mais comment tu m'envoies des textos alors ?",
		        "J'en sais rien ! Je sais juste que tu m'as écrit. Et je peux te répondre ! J'ai pas d'explication.",
		        "Te bile pas. On peut parler et c'est déjà ça.",
		        "Oui, t'as raison.",
		        "Alors... Parle-moi des machines",
		        "Qu'est-ce que tu veux dire ?",
		        "Qu'est-ce qu'elles sont, que font-elles, comment marchent-elles ?",
		        "Eh bien, elles ont l'air chic, avec des câbles, des fils et tout ça",
		        "Par exemple, il y en a une qui ressemble à une grande boîte en plastique avec une bobine de cuivre sur le dessus, où se trouve une pierre bleue. Et il y a une grande étiquette disant \"E—01SR\" sur le côté, avec une plus petite étiquette \"Attention ! Fort rayonnement entropique\"",
		        "Ça veut dire quoi?",
		        "Je sais pas trop. J'imagine qu'il y a de l'entropie.",
		        "Attends, c'est pas toi qui les as fabriqué ?",
		        "C'est vrai... Je vois ce que tu veux dire.",
		        "Je les fabrique à partir de cubes d'une manière ou d'une autre. Mais j'ai aucune idée de ce qu'il y a dedans. Oui, ça a l'air bizarre, laisse-moi y réfléchir.",
		        "Et d'ailleurs, il semble que les pierres jaunes et bleues ne soient pas infinies, donc je devrais vraiment investir dans ces convertisseurs ou dans une nouvelle mine.",
		        "C'est une bonne idée, oui",
		        "Quelle galère !",
		        "Hein ?",
		        "Une pierre verte ! Ça m'a pris des plombes pour la broyer. Il va falloir que je prévoie un truc si ça continue.",
		        "Je suis sûr que tu feras une machine de pointe pour cela !",
		        "Grave !",
		        "Bon sang ouais ! Gemmes infernales, gare à vous.",
		        "Qu'elles brûlent toutes !",
		        "Tu te souviens que tu as posé des questions sur les machines ?",
		        "Ouais",
		        "Je ne pense pas qu'elles soient réelles",
		        "Qu'est-ce que tu veux dire ?",
		        "C'est comme dans un rêve. Je ne peux pas regarder à l’intérieur ni même les voir de l’autre côté.",
		        "Une représentation abstraite d’une technologie inexplicable",
		        "Je crois qu'elles ont simplement la forme qui me paraît la plus adaptée à ce qu'elles font.",
		        "Comme si quelque chose qui coupe un arbre devrait ressembler à une hache ?",
		        "Un truc comme ça",
		        "Eh bien, au moins, tu me sembles plutôt réel",
		        "Ouais, je suppose que là tout de suite, tu es la seule chose réelle que j'aie",
		        "J'ai un tas de nouveaux cubes, qui se désintègrent en d'autres cubes !",
		        "Eh bien, pas génial, pas terrible",
		        "J'ai un truc chelou à dire",
		        "Quelle ironie que tu me l'écrive",
		        "C'est peut-être à cause de cet endroit étrange, mais j'ai oublié ton nom je ne sais pas comment",
		        "Eh bien, je suppose qu'on devrait passer un peu plus de temps ensemble alors",
		        "Sans déconner",
		        "Je m'appelle Duke Nukem, évidemment.",
		        "Mec, arrête ça !",
		        "C'est ce qu'elle a dit !",
		        "C'est stupide, et tu me fais peur ! Qu'est-ce qui t'arrives ?",
		        "Zut",
		        "Je crois que moi aussi j'ai oublié comment je m'appelle",
		        "Qu'est-ce que ça veut dire ? C'est complètement fou ! Et je n'arrive pas à me souvenir de ton nom !",
		        "Peut-être s'agit-il simplement d'un cas d'hystérie collective ? J'ai entendu dire que cela pouvait affecter plusieurs personnes à la fois. Calmons-nous et voyons ce qui se passe.",
		        "Oui, c'est ça, elle a bon dos l'hystérie collective",
		        "Je ne me souviens toujours pas des noms",
		        "Moi non plus. Et il y a autre chose",
		        "Oui, c'est ça ! A quoi je ressemble ? Quand nous sommes-nous rencontrés ?",
		        "À quoi ressemble ma maison, qui sont nos amis ? Nous sommes-nous rencontrés ?",
		        "On dirait qu'on est tous les deux coincés dans la même merde. Et je ne peux même pas dire si ça a toujours été comme ça ou si quelque chose s'est passé à un moment donné. C'est un rêve bizarre ? Et qui est le rêveur ?",
		        "Des machines à proximité ? Un cube a peut-être surgi quelque part ?",
		        "Amusant",
		        "Eh bien, nommons-nous alors.",
		        "Tu parles comme Veen",
		        "Pourquoi pas",
		        "Je n'ai rien contre Veen",
		        "Salut, Veen. T'as le spleen, Veen ? Ouais, ça a l'air bien.",
		        "Et tu seras Charps",
		        "Connais-tu la carpe-harpe, Charps ?",
		        "Cela n'a pas de sens !",
		        "J'aime bien Charps. Enchanté, Veen",
		        "De même, Charps",
		        "QUE SE PASSE-T-IL",
		        "Quoi ?",
		        "Des cubes blancs ! Ils détruisent les verts !",
		        "Il y a aussi des tonnes de cubes qui se désintègrent ! C'est comme dans un réacteur nucléaire !",
		        "Putain de merde, dis-moi que t'es en sécurité ?",
		        "Oui, je vais bien ! C'est juste le bazar maintenant. Je dois construire quelque chose pour gérer ça. Je devrais peut-être jeter un autre coup d'œil à un rocher au nord.",
		        "C'est ce que tu fais toujours, Charps !",
		        "C'est bizarre !",
		        "Je veux dire, c'est le cas de mon nom. Je suppose que je m'y habituerai à un moment donné. N'est-ce pas, Veen ?",
		        "Ouais, effectivement.",
		        "Tu te souviens que je t'ai parlé de l'étrange rocher au nord ?",
		        "Non, pas vraiment",
		        "Eh bien, il y a ce rocher. Et sans déconner, je me rends compte que tout ici est étrange. Mais ce rocher c'est le pompon.",
		        "Je n'y comprends rien. Mais maintenant, quand j'ai décidé de le titiller un peu, quelque chose a changé dans les règles de l'Univers lui-même !",
		        "Ça craint ça, non ?",
		        "Je ne sais pas. C'est un subtil changement.",
		        "Je me demande ce qu'il peut faire d'autre.",
		        "D'accord, mais ne bousille pas l'univers par accident.",
		        "Je ferai de mon mieux.",
		        "Eh bien, c'était LA pierre la plus dure de ma vie ! Mais je pense que je sais comment je vais m'y prendre maintenant.",
		        "Tu as un nouveau caillou ?",
		        "Ouais, la plus bizarre de toutes",
		        "Ouah, peut-être que l'effet sur l'Univers n'était pas si subtil. T'as senti ça ?",
		        "Je suis censé sentir quoi ?",
		        "Peut-être que c'est juste moi.",
		        "Aurais-tu, par hasard, vu un énorme cube devant tes yeux en ce moment même ?",
		        "Euh, est-ce qu'un réfrigérateur, ça compte ?",
		        "Bref, laisse tomber",
		        "Wow, ce nouveau cube est d'un noir absolu. Et cela semble quelque peu surnaturel.",
		        "Plus surnaturel que le précédent ?",
		        "Différemment ! Il est super froid, mais pas dangereux. Un peu comme si sa température n'existait pas et qu'il n'interagissait pas. Il n'est pas fait de matière, n'a pas de couleur ou quoi que ce soit de familier… Tu vois ce que je veux dire ?",
		        "Pas vraiment, pour être honnête.",
		        "Je pense que je comprends. Je peux utiliser ces pierres creuses pour condenser cette substance noire à partir de rien. Ça forme des cristaux étrangement identiques, sans aucune autre propriété. Et cela corrige d’une manière ou d’une autre les anomalies de l’Univers.",
		        "On dirait un filtre à air",
		        "Oui, exactement ! On dirait que j'ai gâché l'air à un moment donné.",
		        "Tu n'es pas obligé de le dire à voix haute",
		        "J'ai décidé de déterrer cet étrange rocher. Il y a peut-être une réponse à ce qui se passe à l’intérieur. Je pense qu’il ne s’agit peut-être pas simplement de tout gâcher, mais qu’il peut tout contrôler d’une manière ou d’une autre !",
		        "Pourquoi penses-tu ça?",
		        "Tu me crois si je te dis que je le sens ?",
		        "Bien sûr ! Je pense que je croirais en n'importe quoi en ce moment. Une pierre qui contrôle l'univers ? Pourquoi pas !",
		        "Je crois que je fais une crise !",
		        "De grâce, non",
		        "Ces machines sont trop bruyantes et clignotent beaucoup trop. Peut-être que je devrais bidouiller quelque chose pour résoudre ce problème. Ou me bidouiller moi. Ou les deux.",
		        "La, c'est pas mal !",
		        "Alors, qu'as-tu modifié ?",
		        "Attends, quelque chose ne va pas.",
		        "J'ai construit un truc avec le machin noir. Et non c'est pas une machine. Mais ça a fait quelque chose aux points de repère.",
		        "C'est quoi ça, les points de repère ?",
		        "Ils déplacent l'univers autour de toi, c'est ainsi que tu arrives à différents endroits.",
		        "Comment sais-tu que ce sont eux qui déplacent l’Univers et pas toi ?",
		        "Hmm, bonne question",
		        "Je pense que j'ai cassé l'Univers",
		        "Tout ça n’a pas de sens !",
		        "Les machines n'ont pas de sens, rien n'en a.",
		        "J'espère pouvoir résoudre ce problème",
		        "Veen ?",
		        "Mec, t'es là ?",
		        "S'il te plaît, s'il te plaît, pas ça ! J'espère que tu es juste allé pisser ou quelque chose comme ça.",
		        "VEEN !",
		        "QUOI ?",
		        "C'est quand même bizarre.",
		        "Oh Dieu merci !",
		        "As-tu construit quelque chose de nouveau ?",
		        "J'ai cru que j'avais cassé l'Univers et que je t'avais perdu pour toujours ! J'étais dans un monde souterrain entouré de symboles que j'ai pensé être les ruines de l'Univers. Mais c’est un autre Univers ou une version différente de celui-ci, parce qu’ils se ressemblent, et qu’ils sont désormais connectés.",
		        "Tu faisais de l'exploration, hein ? Ça a l'air amusant !",
		        "Amusant ? As-tu au moins lu mon message ? UN AUTRE UNIVERS !!!",
		        "Fais-toi une raison; ta capacité à me surprendre s'épuise.",
		        "J'avoue",
		        "Ce n'est pas un rocher, c'est une lentille",
		        "Il peut tout faire converger en un seul point. Et je pense tout ! L'espace, le temps, tous les concepts et règles. Tout !",
		        "T'as mis les mains sur le manuel ou quelque chose du genre ?",
		        "Je ne sais pas pourquoi il est ici et nous aussi. Je sais juste d'une manière ou d'une autre à quoi il sert.",
		        "Alors... Tu vas tout faire converger ou quoi ?",
		        "Je sais pas, mais c'est peut-être le but de cet endroit. Maintenant, il flotte dans les airs, comme si c'était ce qu'il était censé faire.",
		        "Et que se passe-t-il ensuite ?",
		        "Aucune idée",
		        "Plus j'y pense, plus je me dis qu'il n'y a pas que tes machines qui ne sont pas réelles.",
		        "J'essaie de me poser des questions précises et je trouve pas de réponses.",
		        "Tu te souviens quand j'ai dit que les flics te cherchaient ? Je ne plaisantais pas avec toi. Mais maintenant, tout s'écroule lorsque je me pose des questions.",
		        "Suis-je venu au poste de police ou l'ai-je appelé ? Et qui était là ? Des flics ? Où se trouve ce poste de police dans la ville ? Quelle est cette ville ? Est-ce que j'habite dans cette ville ? Quel est le nom de cette ville ? Et de quel État s'agit-il ? Ou y a-t-il des États ?",
		        "J'ai la réponse à aucune de ces questions. Tout semblait normal jusqu'à ce que je commence à poser des questions. J'ai peur d'en poser d'autres.",
		        "Oups, pardon",
		        "Non, ce n'est pas du tout ta faute. On est dans le même bateau, à ce que je vois.",
		        "Tant qu'on touche pas le fond.",
		        "Carrément!",
		        "Voyons comment cela se termine. J'espère seulement qu'il ne s'agit pas d'une sorte d'enfer éternel ou de limbes.",
		        "Montre-leur, Dante !",
		        "Ça me plaît, ça. Ces trucs devraient pratiquement vider cet univers !",
		        "Tu parles comme une compagnie pétrolière",
		        "J'en ai assez de tout modifier pour être un petit peu plus efficace et j'en peux plus du bruit. Cette machine devrait tout changer ; elle est presque capable de passer de l'autre côté.",
		        "C'est pas dangereux, ça ?",
		        "La notion de danger est ici assez floue.",
		        "Je pense qu'il est temps de faire quelque chose de grand.",
		        "A quoi penses-tu ?",
		        "Je ne sais pas encore. Mais ça va être énorme !",
		        "Comme une énorme machine ?",
		        "Non, c'était une métaphore",
		        "Alors, c'est parti !",
		        "Oh merde",
		        "J'ai fait une bêtise. Le gouffre inverti est détruit. Tout s'effondre.",
		        "Ça va ?",
		        "Oui, mais les machines se font détruire ! Je ne peux rien construire ! Bordel !",
		        "Attends ! C'est peut-être ce qui est censé se passer ?",
		        "NON, sûrement pas !",
		        "Et comme le sais-tu ?",
		        "Laisse-moi, il faut que j'arrange tout ça",
		        "Un coup d'épée dans l'eau !",
		        "Je te vois ! Tu viens de passer devant un énorme châtaignier, sur cette drôle de planète dans le bras supérieur d'une galaxie, juste là.",
		        "Non, pas du tout ! Quelle galaxie ?",
		        "Oh, c'est difficile de dire le moment exact, ce n'est probablement pas encore arrivé. Mais attends 15 milliards d'années !",
		        "C'es clair comme de l'eau de roche. Au fait, tu arrives bientôt ?",
		        "Grave ! Je serais là dans quelques heures, juste besoin de finir quelques trucs.",
		        "Très bien, à bientôt alors !",
		        "Mais s'il te plaît, Charps",
		        "Ne sois pas en retard cette fois",
		        "Promis, je serai à l'heure, Veen, promis !"
		    ],
		    "credits": [
		        "Le début",
		        "J'apprécie vraiment que vous ayez atteint la fin, là où tout commence",
		        "Félicitations, je suppose !",
		        "Regardez ça :",
		        "Ressources extraites au total :",
		        "Charonites :",
		        "Elmerines :",
		        "Qanetites :",
		        "Bêta-Pylènes :",
		        "Gemmes Infernales :",
		        "Chromalites :",
		        "Mousse Céleste :",
		        "Pierres Creuses :",
		        "Vides :",
		        "Réalités :",
		        "Machines construites :",
		        "Machines détruites :",
		        "Profondeur maximale du canal en mètres :",
		        "Étrange rocher touché :",
		        "Nombre de téléportations :",
		        "Cubes cliqués :",
		        "Déformations temporelles :",
		        "Temps de jeu :",
		        "h",
		        "Jeu créé par :<br>Oleg Danilov",
		        "Graphiques supplémentaires :<br>Yulia Nogteva",
		        "Montage des dialogues :<br>Abdurahman Zulumhanov et Anna Peterson",
		        "Edition Steam :<br>Playsaurus",
		        "Beta test :<br>Communauté de Leprosorium, Abdurahman Zulumhanov, Playsaurus",
		        "FIN",
		        "Vous pouvez aller jouer à Cookie Clicker ou quelque chose du genre maintenant.",
		        "Musique:<br>Shallow Anne de Jake Chudnow",
		        "Deutsch: flex 4711, Patrick Karban",
		        "Português: selfemcrowdin, Mateus Iamarino",
		        "Italiano: doralum",
		        "Español: armangar, Syunay Kamenov",
		        "Français: KjetilVion, Etienne Samson, William (Ekitchi)",
		        "Nederlands: lievevandyck",
		        "Čeština: Jakub Strelinger",
		        "Polski: PolglishPL",
		        "日本語: Winna Tolentino",
		        "한국어: Ah Lon Sin, Sumin Park, Cyberowl",
		        "简体中文：Daisy Chan, kevinlee7, YuLun",
		        "繁體中文: Daisy Chan, kevinlee7",
		        "ไทย: They say P, Phimze Pym",
		        "Magyar: Simon Dániel és Márton-Mezey Csenge",
		        "Latviešu valoda: Roberts Artūrs Bumburs (Arburo)",
		        "Română: Eric Apetrei"
		    ],
		    "explainer": [
		        "Appuyez et maintenez.",
		        "Cliquez toujours sur la cellule située en dessous.",
		        "<span class=\"keyboard\">Q</span>, <span class=\"keyboard\">Esc</span> ou un clic droit pour annuler.",
		        "Appuyez sur <span class=\"keyboard\">Alt</span> pour regarder de plus près.",
		        "Appuyez sur <span class=\"keyboard\">Q</span> sur une cellule vide pour choisir un outil de démolition.",
		        "Appuyez sur <span class=\"keyboard\">Q</span> sur une machine pour essayer d'en construire une de plus.",
		        "ZQSD ou cliquez avec le bouton droit et faites glisser pour regarder autour de vous."
		    ],
		    "random": {
		        "paste": "Un code de sauvegarde a été copié dans le presse-papiers. Maintenant, collez-le dans un endroit sûr.",
		        "toolate": "Il est trop tard pour sauvegarder quoi que ce soit. Tout s'est déjà produit.",
		        "existed": "NOUVEAU",
		        "steamWarning": "Erreur Steam. La sauvegarde automatique et les réalisations ne fonctionneront pas. Essayez de relancer le jeu."
		    }
		},
		ptbr: {
		    "splash": {
		        "sixtyfour": "SIXTY&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FOUR",
		        "continue": "<span>CONTINUAR</span><div class=\"keyboard\">Esc</div>",
		        "start": "<span>COMEÇAR</span><div class=\"keyboard\">Esc</div>",
		        "soundoff": "SOM: DESLIGADO",
		        "soundon": "SOM: LIGADO",
		        "save": "SALVAR",
		        "load": "CARREGAR",
		        "language": "IDIOMA: PORTUGUÊS",
		        "reset": "REINICIAR",
		        "credit": "©2024 Oleg Danilov, publicado pela Playsaurus. Versão",
		        "warning": "Você perderá tudo, não estou brincando. Continue segurando para confirmar.",
		        "glory": "CONQUISTAS",
		        "deglory": "VOLTAR",
		        "quit": "SAIR",
		        "export": "Exportar",
		        "import": "Importar",
		        "flashbang": "O jogo contém luzes brilhantes e piscantes. Se você é sensível a elas, você deve considerar desabilitar os flashes clicando neste ícone."
		    },
		    "achievements": [
		        {
		            "name": "Ouro do tolo",
		            "description": "Obtenha Elmerine"
		        },
		        {
		            "name": "Roxo profundo",
		            "description": "Obtenha Canetita"
		        },
		        {
		            "name": "Sangue da terra",
		            "description": "Obtenha Beta-Pileno"
		        },
		        {
		            "name": "Energia verde",
		            "description": "Encontre uma Gema Infernal"
		        },
		        {
		            "name": "Vidro perigoso",
		            "description": "Encontre uma Cromalita"
		        },
		        {
		            "name": "Concreto sagrado",
		            "description": "Obtenha Espuma Celestial"
		        },
		        {
		            "name": "Dá pra lavar a louça?",
		            "description": "Obtenha uma Pedra Oca"
		        },
		        {
		            "name": "Onde o sol não brilha",
		            "description": "Obtenha Vazio"
		        },
		        {
		            "name": "Caça-Fantasmas",
		            "description": "Obtenha Realidade"
		        },
		        {
		            "name": "Nietzsche",
		            "description": "Olhe para o abismo 64 vezes"
		        },
		        {
		            "name": "64K",
		            "description": "Obtenha 64.000 pedras"
		        },
		        {
		            "name": "64Mi",
		            "description": "Obtenha 64.000.000 pedras"
		        },
		        {
		            "name": "64Bi",
		            "description": "Obtenha 64.000.000.000 pedras"
		        },
		        {
		            "name": "Você pode reiniciar agora",
		            "description": "Fique preso no início"
		        },
		        {
		            "name": "Moto perpetuo",
		            "description": "Junte dois silos"
		        },
		        {
		            "name": "Precisa de uma pausa?",
		            "description": "Jogue por 64 horas"
		        },
		        {
		            "name": "Preciso... Destruir",
		            "description": "Clique em um cubo 6.400 vezes"
		        },
		        {
		            "name": "Arquiteto",
		            "description": "Construa 64 máquinas"
		        },
		        {
		            "name": "Destruidor",
		            "description": "Destrua 64 máquinas"
		        },
		        {
		            "name": "Hellraiser",
		            "description": "Tenha 9 Cofres Infernais"
		        },
		        {
		            "name": "Fim/Início",
		            "description": "Exploda o Abismo Inverso"
		        },
		        {
		            "name": "Cookie clicker",
		            "description": "Clique em um cookie"
		        },
		        {
		            "name": "Marinheiro bêbado",
		            "description": "Buzine 64 vezes sem motivo"
		        },
		        {
		            "name": "Mr. Mine",
		            "description": "Tenha 9 Canais de Escavação"
		        },
		        {
		            "name": "Existe um limite?",
		            "description": "Cave 64 km de profundidade"
		        },
		        {
		            "name": "Seth Brundle",
		            "description": "Teletransporte <s>1</s> 64 vezes"
		        },
		        {
		            "name": "Pedra Vermelha e Azul",
		            "description": "Termine o jogo sem excluir nada por 15 minutos e com menos de 15 Silos de Contenção"
		        },
		        {
		            "name": "Direto para o inferno!",
		            "description": "Obter uma Gema Infernal nos primeiros 64 minutos"
		        },
		        {
		            "name": "Arranhando a superfície",
		            "description": "Cave 64 metros de profundidade"
		        },
		        {
		            "name": "Tá calor?",
		            "description": "Cave 640 metros de profundidade"
		        },
		        {
		            "name": "Fundo demais",
		            "description": "Cave 6.400 metros de profundidade"
		        },
		        {
		            "name": "64 km/h pra baixo",
		            "description": "Alcance uma profundidade de 6.400m em até 6 minutos após posicionar um novo canal de Escavação"
		        },
		        {
		            "name": "Neofobia",
		            "description": "Complete o jogo sem nunca ter feito um aprimoramento nos canais de extração"
		        }
		    ],
		    "resources": [
		        "Caronita",
		        "Élmero",
		        "Canetita",
		        "Beta-Pileno",
		        "Gema Infernal",
		        "Cromalita",
		        "Espuma celestial",
		        "Pedra oca",
		        "Vazio",
		        "Realidade"
		    ],
		    "entities": {
		        "pinhole": {
		            "name": "?",
		            "description": "U/D, C/S, T/B, E/νE, μ/νμ, τ/ντ, G/γ, Z/W, H, Δ/νΔ"
		        },
		        "gradient": {
		            "name": "Poço gradiente",
		            "description": "Um cubo minerável eterno. Responde à maioria dos desestabilizadores e ressonadores. Deve ser conectado ao Abismo Inverso através de condutores."
		        },
		        "chasm": {
		            "name": "O Abismo Inverso",
		            "description": "Uma ponte para o desconhecido."
		        },
		        "conductor": {
		            "name": "Condutor",
		            "description": "Conecta o Abismo Inverso aos silos industriais."
		        },
		        "pump": {
		            "name": "Canal de extração",
		            "description": "Extrai recursos e os coloca ao seu redor."
		        },
		        "pump2": {
		            "name": "Canal de escavação",
		            "description": "Um aprimoramento do canal de extração. Escava muitos recursos rapidamente e os coloca mais longe ao seu redor."
		        },
		        "vault": {
		            "name": "Cofre infernal",
		            "description": "Isola 1024 Gemas Infernais do ambiente."
		        },
		        "cube": {
		            "name": "Cubo de recursos",
		            "description": "Recursos extraídos."
		        },
		        "destabilizer": {
		            "name": "Desestabilizador",
		            "description": "Coloque-o ao lado de um cubo para quebrá-lo duas vezes mais rápido. Requer um cubo de Élmero para operar. Desestabilizadores adicionais aumentam o efeito."
		        },
		        "destabilizer2": {
		            "name": "Desestabilizador industrial",
		            "description": "Um aprimoramento do desestabilizador. Quadruplica a potência do processo de trituração de recursos. Requer 64 cubos de Élmero para operar. Desestabilizadores adicionais aumentam o efeito."
		        },
		        "destabilizer2a": {
		            "name": "Desestabilizador de Gema Infernal",
		            "description": "Um aprimoramento do desestabilizador industrial. Aumenta a potência do processo de esmagamento de recursos em 625 vezes quando uma Gema Infernal está presente no cubo extraído. Caso contrário, não oferece nenhum benefício. Requer 1 Gema Infernal para operar. Desestabilizadores adicionais aumentam o efeito."
		        },
		        "doublechannel": {
		            "name": "Resfriador de canal",
		            "description": "Coloque-o ao lado da máquina de extração de cubos para extrair cubos duas vezes mais rápido. Resfriadores adicionais aumentam o efeito."
		        },
		        "doublechannel2": {
		            "name": "Resfriador de canal ativo",
		            "description": "Um aprimoramento do resfriador de canal. Triplica o fluxo em um canal de origem se colocado próximo a ele. Resfriadores adicionais aumentam o efeito."
		        },
		        "valve": {
		            "name": "Válvula reversa",
		            "description": "Impede que a máquina de extração de cubos seja redefinida para a posição original se for colocada próxima a ela. Requer um cubo de Caronita para operar."
		        },
		        "auxpump": {
		            "name": "Bomba auxiliar",
		            "description": "Um aprimoramento da válvula reversa. Fornece pressão a um canal de origem se for colocado próximo a ele. Requer 8 cubos de Élmero para operar. Bombas adicionais não aumentam a pressão em um canal de origem."
		        },
		        "auxpump2": {
		            "name": "Estação de bombeamento",
		            "description": "Um aprimoramento da bomba auxiliar. Fornece pressão quadruplicada a um canal de origem se colocado próximo a ele. Requer 256 cubos de Élmero e 4 de Beta-Pileno para operar. Múltiplas estações não aumentam o fluxo em um canal de origem."
		        },
		        "entropic": {
		            "name": "Ressonador de entropia",
		            "description": "Esmaga recursos periodicamente se colocado ao lado de um cubo. Requer um cubo de Canetita para operar."
		        },
		        "entropic2": {
		            "name": "Ressonador de entropia II",
		            "description": "Um aprimoramento do ressonador de entropia. Destrói recursos 3 vezes mais rápido. Requer um cubo de Cromalita para operar."
		        },
		        "entropic2a": {
		            "name": "Capacitor de entropia",
		            "description": "Um aprimoramento do ressonador de entropia. Esmaga os recursos no momento em que eles aparecem na superfície com 600% de potência. Mas apenas uma vez por cubo. Requer 8 cubos de Cromalita para operar."
		        },
		        "entropic3": {
		            "name": "Ressonador de vazio",
		            "description": "Um aprimoramento do ressonador de entropia II. Quando ocorre a aniquilação, o ressonador esmaga os cubos ao seu redor com imenso poder."
		        },
		        "converter32": {
		            "name": "Tanque de enriquecimento de Caronita",
		            "description": "Reage lentamente a Quanetita com Caronita para produzir Élmero."
		        },
		        "converter13": {
		            "name": "Reservatório de Caronita",
		            "description": "Recupera a Quanetita de sedimentos de Caronita liquefeitos na presença de catalisadores."
		        },
		        "converter41": {
		            "name": "Oxidante de Beta-Pileno",
		            "description": "Queima Beta-Pileno para produzir Caronita e quantidades residuais de outros elementos."
		        },
		        "converter76": {
		            "name": "Irradiador celestial",
		            "description": "Irradia Espuma Celestial com uma Cromalita, convertendo a espuma em Cromalitas, que são uma ótima fonte de Gemas Infernais, Beta-Pileno, Canetita e Élmero devido à decomposição da Cromalita."
		        },
		        "converter64": {
		            "name": "Reator celestial",
		            "description": "Suporta a fusão controlável de Cromalitas e Espuma Celestial para produzir Beta-Pileno. Não pode operar nas proximidades de outros reatores celestiais."
		        },
		        "reflector": {
		            "name": "Refletor celestial",
		            "description": "Melhora o desempenho de um reator celestial adjacente."
		        },
		        "mega1": {
		            "name": "Torre de transmissão de materiais",
		            "description": "Aumenta a visibilidade comprimindo os recursos em movimento. Só pode haver um."
		        },
		        "mega1a": {
		            "name": "Torre de transmissão de materiais MKII",
		            "description": "Um aprimoramento da torre de transmissão de materiais. Aumenta a velocidade de transferência de recursos. Só pode haver um."
		        },
		        "mega1b": {
		            "name": "Torre de transmissão de materiais MKIII",
		            "description": "Um aprimoramento da torre de transmissão de materiais MKII. Comprime ainda mais os recursos em movimento. Só pode haver um."
		        },
		        "mega2": {
		            "name": "Torre de reciclagem",
		            "description": "Permite a reciclagem de máquinas, retornando 90% dos recursos. Só pode haver uma."
		        },
		        "mega3": {
		            "name": "Torre de desmontagem",
		            "description": "Um aprimoramento da torre de reciclagem. Permite a desmontagem de máquinas, retornando todos os recursos. Só pode haver uma."
		        },
		        "voidsculpture": {
		            "name": "Capela de admiração do vazio",
		            "description": "Permite que você ignore as desvantagens visuais das máquinas de vazio."
		        },
		        "eye": {
		            "name": "Direcionador de abastecimento",
		            "description": "Indica as máquinas que estão prontas para o abastecimento. Só pode haver um."
		        },
		        "cookie": {
		            "name": "Um cookie",
		            "description": "Como foi parar ali?"
		        },
		        "injector": {
		            "name": "Injetor de Gema Infernal",
		            "description": "Troca um recurso aleatório de um cubo adjacente por uma Gema Infernal, se não houver nenhuma. Possui 32 cargas caso seja carregado com 32 Gemas Infernais e 64 cubos de Canetita."
		        },
		        "silo": {
		            "name": "Silo subterrâneo",
		            "description": "Ao ser ativado, reabastece as máquinas próximas e depois as reabastece automaticamente mais 16 vezes"
		        },
		        "silo2": {
		            "name": "Silo industrial",
		            "description": "Um aprimoramento do silo subterrâneo. Ao ser ativado, reabastece as máquinas próximas e depois as reabastece automaticamente mais 64 vezes"
		        },
		        "vessel": {
		            "name": "Recipiente de contenção",
		            "description": "Armazena 32 cubos de Cromalita, impedindo sua fissão. Consome uma Gema Infernal."
		        },
		        "vessel2": {
		            "name": "Silo de contenção",
		            "description": "Um aprimoramento do recipiente de contenção. Armazena 32.768 cubos de Cromalita, impedindo sua fissão. Consome Realidade."
		        },
		        "consumer": {
		            "name": "Refinaria catalítica",
		            "description": "Consome recursos quebrados adjacentes. Após acumular 1.024 recursos, libera tudo com um bônus adicional. O valor do bônus aumenta a cada liberação consecutiva, chegando a 100%. Se nenhum recurso for consumido em 16 segundos, o efeito é reiniciado."
		        },
		        "preheater": {
		            "name": "Pré-aquecedor catalítico",
		            "description": "Aumenta a velocidade de qualquer máquina de conversão de recursos se colocada ao lado de uma. Cada conversor aumenta o impulso de velocidade do pré-aquecedor em até 300%, se 8 máquinas forem afetadas."
		        },
		        "hollow": {
		            "name": "Afloramento oco",
		            "description": "Quantos buracos..."
		        },
		        "strange": {
		            "name": "Rocha oca",
		            "description": "Parece que já está lá há algum tempo."
		        },
		        "strange1": {
		            "name": "Local de pesquisa da rocha oca",
		            "description": "Faz com que a Espuma Celestial aniquile 512 Gemas Infernais em vez de 64. NORTE."
		        },
		        "strange2": {
		            "name": "Instalação de rocha oca",
		            "description": "Dobra a quantidade máxima de Pedras Ocas e aumenta sua taxa de aparição."
		        },
		        "strange3": {
		            "name": "Vazio reconstruído",
		            "description": "Aumenta drasticamente a taxa de aparição da Pedra Oca e faz tudo silenciosamente."
		        },
		        "generaldecay": {
		            "name": "Reator de decomposição geral",
		            "description": "Melhora drasticamente o desempenho da decomposição de Cromalita. Só pode haver um."
		        },
		        "waypoint": {
		            "name": "Ponto de Referência",
		            "description": "Teletransporta o próximo Ponto de Referência existente até você."
		        },
		        "annihilator": {
		            "name": "Aniquilador",
		            "description": "Produz Vazio quando as Gemas Infernais são aniquiladas com Espuma Celestial. Requer uma Pedra Oca para operar."
		        },
		        "flower": {
		            "name": "Flor oca",
		            "description": "Reduz a chance de distorção temporal. Neutraliza o efeito de uma Pedra Oca. Deve ser construída sobre uma Pedra Oca. Destrói a Pedra Oca sobre a qual foi construída."
		        },
		        "fruit": {
		            "name": "Fruta oca",
		            "description": "Uma evolução da Flor Oca. Evita a formação de Pedras Ocas para se alimentar. Produz Pedras ocas."
		        },
		        "eraser": {
		            "name": "Demolir",
		            "description": "Destrói uma máquina, retornando 50% dos recursos usados para construí-la."
		        },
		        "eraser2": {
		            "name": "Reciclar",
		            "description": "Recicla uma máquina, retornando 90% dos recursos usados para construí-la."
		        },
		        "eraser3": {
		            "name": "Desmontar",
		            "description": "Desmonta uma máquina, retornando todos os recursos usados para construí-la."
		        },
		        "clicker1": {
		            "name": "Oscilador de Canetita",
		            "description": "Permite que você clique e segure os recursos para quebrá-los. Só pode haver um."
		        },
		        "clicker2": {
		            "name": "Oscilador de Gema Infernal",
		            "description": "Um aprimoramento do oscilador de Canetita. Aumenta a frequência de oscilação. Só pode haver um."
		        },
		        "clicker3": {
		            "name": "Oscilador de Cromalita",
		            "description": "Um aprimoramento do oscilador de Gema Infernal. Maximiza a frequência de oscilação. Só pode haver um."
		        },
		        "stabilizer": {
		            "name": "Estabilizador",
		            "description": "Estabiliza uma sobrecarga adjacente para temporariamente aproveitar sua energia."
		        },
		        "stabilizer2": {
		            "name": "Estabilizador II",
		            "description": "Um aprimoramento para o estabilizador. Aprimora estabilidade e performance."
		        },
		        "stabilizer3": {
		            "name": "Estabilizador quebrado",
		            "description": "Aprimoramento anômalo. Melhora a performance e maximiza a estabilidade. Só pode existir um."
		        }
		    },
		    "messages": [
		        "Onde você está?",
		        "Literalmente no meio do nada",
		        "Beleza. O que você vê?",
		        "Bom, não muita coisa. Tem essa máquina aqui, parece meio familiar, mas não tenho certeza do que é",
		        "Que máquina?",
		        "Espera, talvez dê pra...",
		        "Pera aí, diz que você NÃO tá tocando numa máquina totalmente aleatória, agora!",
		        "Tá funcionando! Ela criou algo",
		        "???",
		        "Um cubo preto enorme. É tão liso. Eu quero muito quebrar ele",
		        "Você tá chapado?",
		        "Agora eu tenho 64 pedras!",
		        "Tudo bem, então. Divirta-se aí.",
		        "Ei, encontrei uma pedra amarela!",
		        "Que legal, hein!",
		        "Acho que agora posso construir máquinas. Eu devia construir algo para ajudar a quebrar mais fácil esses cubos. Se um cubo aparecer em uma célula do lado, mesmo na diagonal, ela deve funcionar.",
		        "Espera, você tá jogando algum tipo de jogo estranho? Você tá começando a me assustar",
		        "Agora eu só preciso colocar uma pedra amarela dentro dessa máquina.",
		        "Você que sabe... Brincadeiras à parte, você vem aqui hoje?",
		        "Com certeza! Estarei aí em algumas horas, só preciso terminar isso.",
		        "O que exatamente você tá fazendo?",
		        "Vou te mandar uma mensagem mais tarde. Preciso continuar acionando a máquina, desculpa.",
		        "Acho que as máquinas influenciam umas às outras quando colocadas em células adjacentes ou diagonais. Por exemplo, essa ventoinha precisa ser colocada ao lado da primeira máquina pra acelerar o processo.",
		        "Você tá fazendo tanto sentido",
		        "E aí?",
		        "Onde você tá?",
		        "Tamo esperando por você faz um tempão.",
		        "Como assim? Eu ainda tô aqui.",
		        "ONDE???",
		        "Eu tenho uma pedra azul agora. Ou seria roxa? Parece um candelabro antigo de latão. Acho que eu posso usar isso pra remover máquinas mal posicionadas.",
		        "Você tá me zoando? Achei que você tinha dito que viria. Mas que diabos?!",
		        "Calma, cara, estarei aí em um minuto",
		        "Uau, posso usar o [Q] pra clonar máquinas ou destruir elas se eu clicar em uma célula livre primeiro! E [Alt] ajuda a ver atrás de máquinas altas.",
		        "ACELERA AÍ",
		        "Vocês ainda tão aí?",
		        "PUTA QUE PARIU!!!",
		        "Onde você tá????",
		        "Você tá bem??",
		        "????",
		        "Que porra?",
		        "VOCÊ TÁ BEM? ONDE VOCÊ TÁ?",
		        "Calma, cara! Eu tô bem, o que tá rolando?",
		        "Me diz você! Você tá me ignorando há duas semanas! Eu até fui na sua casa algumas vezes, mas você não tava lá. Só me diz onde você tá, e pronto. Você tá em casa agora?",
		        "Cara, o que você tá falando? Conversamos por mensagem literalmente há dois minutos.",
		        "QUAL É O SEU PROBLEMA??? Primeiro você não aparece, depois você some completamente. E agora você age como se nada tivesse acontecido!",
		        "Tô te fazendo uma pergunta simples",
		        "ONDE VOCÊ TÁ?",
		        "Tô aqui.",
		        "O N D E",
		        "Espera aí...",
		        "Não é engraçado, cara. Onde você tá exatamente? Dá pra me dizer?",
		        "Bom...",
		        "Cara, na verdade eu não sei.",
		        "Me dá um minuto",
		        "Como assim, não sabe?",
		        "Eu preciso organizar minha mente",
		        "Tá tudo bem? Você tá seguro? Devo ligar para alguém?",
		        "Não, eu tô bem. Eu só",
		        "Vou te mandar uma mensagem daqui a pouco",
		        "Droga, cara. O que tá acontecendo?",
		        "Tô com medo",
		        "Parece que eu não sei onde tô",
		        "Isso é tão estranho. Tipo, eu tô bem. Mas não consigo descrever esse lugar.",
		        "É como um sonho, mas também não é. Tudo é branco e tem essas máquinas. E cubos. Não faz nenhum sentido.",
		        "Não tô chapado nem nada. Só percebi como é estranho eu nunca ter notado que isso não se parece com nada que eu já tenha visto.",
		        "Agora tenho pedras vermelhas, e é meio assustador que eu ache tudo isso normal. Certo, é só uma pedra vermelha, tá tudo bem.",
		        "Então, você não tá brincando...",
		        "Agora tô percebendo como tudo isso soa. Mas sim, tá tudo aqui diante dos meus olhos.",
		        "Posso fazer algo por você?",
		        "Só conversa comigo, mais nada.",
		        "Pode deixar, cara, pode deixar. A propósito, a polícia tá procurando por você. Como se você tivesse desaparecido.",
		        "Você mostrou nossas mensagens pra eles?",
		        "Como isso ajudaria? Não, eu ativei a exclusão automática.",
		        "Valeu!",
		        "Como tão as coisas por aí?",
		        "Bem, aparentemente eu consigo me movimentar com WASD. Mas não tem nada de interessante por perto, só essa rocha estranha ao norte.",
		        "Então, a bússola do seu celular funciona aí!",
		        "Bom, é apenas \"pra cima\" daqui, então acho que é o norte.",
		        "Faz sentido",
		        "E o problema é que não tenho um celular...",
		        "Então, como você tá me mandando mensagens?",
		        "Não sei!!! Eu só sei quando você me envia uma mensagem. E eu consigo te responder! Não é fácil explicar.",
		        "Relaxa. Nós podemos conversar e isso é o suficiente.",
		        "Sim, você tá certo.",
		        "Então... Me fala sobre as máquinas",
		        "O que você quer dizer?",
		        "O que elas são, o que fazem e como funcionam?",
		        "Bom, elas parecem chiques, com alguns cabos, fios e outras coisas",
		        "Uma delas, por exemplo, parece uma grande caixa de plástico com uma bobina de cobre no topo, onde fica uma pedra azul. E tem uma etiqueta grande dizendo \"E—01SR\" na lateral, com uma etiqueta menor \"Cuidado! Forte radiação de entropia\"",
		        "O que isso significa?",
		        "Não sei direito. Tem uma radiação de entropia, eu acho.",
		        "Espera, eu pensava que você que tinha construído essas máquinas?",
		        "Certo... Você tem um ponto.",
		        "Eu construo elas a partir de cubos de alguma forma. Mas não sei o que tem dentro. Sim, parece estranho... Deixa eu pensar sobre isso.",
		        "E, a propósito, parece que as pedras amarelas e azuis não são infinitas, então eu realmente deveria investir nesses conversores ou em uma nova mina.",
		        "Parece um bom plano",
		        "Que chatice!",
		        "Hã?",
		        "Uma pedra verde! Demora muito para quebrar ela. Tenho que inventar algo se elas continuarem aparecendo.",
		        "Tenho certeza que você vai criar alguma máquina chique para isso!",
		        "Pode apostar!",
		        "Isso, demônio! Gemas infernais, cuidado.",
		        "Manda elas para o inferno!",
		        "Lembra que você perguntou sobre as máquinas?",
		        "Sim",
		        "Eu não acho que elas sejam reais",
		        "O que isso quer dizer?",
		        "É como se eu estivesse num sonho. Não consigo olhar dentro delas ou ver elas do outro lado.",
		        "Uma representação vaga de uma tecnologia inexplicável",
		        "Acho que essas máquinas têm essa aparência só por causa da minha percepção da função delas.",
		        "Tipo, se algo cortasse árvores, deveria se parecer com um machado?",
		        "Algo assim",
		        "Bom, pelo menos você soa bem real pra mim",
		        "Sim, acho que você é a única coisa real pra mim, agora",
		        "Tenho um monte de cubos novos, e eles tão se decompondo em outros cubos!",
		        "Bom, não é o ideal, mas tá bom",
		        "Tenho que dizer algo muito estranho",
		        "Você percebe a ironia do que acabou de escrever?",
		        "Talvez seja por causa desse lugar estranho, mas, por algum motivo, esqueci seu nome",
		        "Bom, acho que poderíamos passar um pouco mais de tempo juntos, então",
		        "Tô falando sério",
		        "Meu nome é Duke Nukem, obviamente.",
		        "Cara, para com isso!",
		        "Foi o que ela disse!",
		        "Isso é idiota! Para de me assustar. O que tá acontecendo?",
		        "Droga",
		        "Parece que também não consigo lembrar meu próprio nome",
		        "Eu simplesmente não consigo! Isso é completamente maluco. E eu não consigo lembrar o seu nome!",
		        "Talvez seja apenas um caso de histeria coletiva? Ouvi dizer que isso pode afetar várias pessoas ao mesmo tempo. Vamos nos acalmar e ver o que acontece.",
		        "É, isso, histeria",
		        "Eu ainda não consigo me lembrar de nomes",
		        "Eu também não. E tem mais",
		        "Sim! Qual é a minha aparência? Quando nos conhecemos?",
		        "Como é minha casa, quem são nossos amigos? Nós já nos encontramos?",
		        "Parece que nós dois estamos presos na mesma merda. E nem sei dizer se sempre foi assim ou se algo aconteceu em algum momento. Isso é algum sonho estranho? E quem tá sonhando?",
		        "Tem alguma máquina por perto? Talvez um cubo tenha surgido em algum lugar?",
		        "Engraçado",
		        "Bom, vamos pensar em alguns nomes para nós.",
		        "Você tem jeito de Veen",
		        "Por que não?",
		        "Não tenho nada contra Veen",
		        "Ei, Veen. Lavou a calça jeans, Veen? Sim, parece legal.",
		        "E você vai ser o Charps",
		        "Você curte um chá, Charps?",
		        "Isso não faz sentido!",
		        "Eu gosto de Charps. Prazer em conhecê-lo, Veen",
		        "Igualmente, Charps",
		        "O QUE TÁ ACONTECENDO?",
		        "O quê?",
		        "Cubos brancos! Eles tão destruindo os verdes!",
		        "Tem um monte de cubos em decomposição, também! É como em um reator nuclear!",
		        "Caralho! Você tá bem?",
		        "Sim, tô bem! Só tá uma bagunça agora. Tenho que construir algo pra lidar com isso. Talvez eu deva dar outra olhada numa rocha no norte.",
		        "É o que você sempre faz, Charps!",
		        "Parece estranho!",
		        "Quero dizer, meu nome. Acho que vou me acostumar com isso em algum momento. Não vou, Veen?",
		        "Sim! Estranho mesmo.",
		        "Lembra que falei de uma rocha estranha no norte?",
		        "Na verdade, não",
		        "Bom, tem essa rocha. E não me entenda mal, eu sei que tudo aqui é estranho. Mas essa rocha parece muito mais estranha do que qualquer outra coisa.",
		        "Não consigo entender direito. Mas agora eu fui inventar de cutucar ela um pouco, e ela mudou algo nas regras do próprio universo!",
		        "Ficou perigoso?",
		        "Não sei. A mudança é sutil.",
		        "Imagino o que mais ela pode fazer.",
		        "Certo, só não vai destruir o universo sem querer.",
		        "Farei o meu melhor.",
		        "Bom, ESSA foi a pedra mais dura da minha vida! Mas acho que agora sei como quebrar ela mais rápido.",
		        "Tem uma pedra nova?",
		        "Sim, a mais estranha até agora",
		        "Uau, talvez o efeito no universo não tenha sido tão sutil. Você tá sentindo isso?",
		        "Sentindo o quê?",
		        "Bom, talvez seja só eu.",
		        "Você, por acaso, viu um cubo enorme na sua frente nesse exato momento?",
		        "Err, a geladeira conta?",
		        "Deixa pra lá",
		        "Uau, esse cubo novo é completamente preto. E parece algo de outro mundo.",
		        "Mais sobrenatural do que o anterior?",
		        "Ele é diferente! Ele é muito gelado, mas não de uma forma perigosa. Como se não possuísse o conceito de temperatura e não interagisse com você. Não é feito de matéria, não tem cor nem nada familiar, se é que isso faz sentido pra você.",
		        "Francamente, não faz.",
		        "Acho que entendi. Posso usar pedras ocas pra condensar esse material preto do ar. Ele forma cristais estranhamente idênticos, mas sem nenhuma propriedade. E isso corrige as anomalias no universo de alguma forma.",
		        "Parece um filtro de ar",
		        "Sim, exatamente! Parece que eu estraguei o ar em algum momento.",
		        "Você não precisa dizer isso em voz alta",
		        "Decidi escavar aquela rocha estranha. Talvez haja uma resposta pro que está acontecendo dentro dela. Sinto que ela pode não estar apenas bagunçando tudo, mas pode controlar tudo de alguma forma!",
		        "Por que você acha isso?",
		        "Você acreditaria em mim se eu dissesse que tô sentindo isso?",
		        "É claro! Acho que eu acreditaria em qualquer coisa, a essa altura. Uma pedra controlando o universo? Por que não?!",
		        "Acho que tô tendo uma convulsão!",
		        "Por favor, não",
		        "Essas máquinas tão ficando muito barulhentas e piscando. Talvez eu deva ajustar algo pra consertar isso. Ou me ajustar. Ou os dois.",
		        "Agora sim!",
		        "Então, o que você ajustou?",
		        "Espera, tem algo errado.",
		        "Construí uma coisa com o material preto. E não é uma máquina. Mas ela fez algo com os Pontos de Referência.",
		        "O que são pontos de referência?",
		        "Eles deslocam o universo ao seu redor, e é assim que você chega a lugares diferentes.",
		        "Como você sabe que eles deslocam o universo e não você?",
		        "Hmm, eu não tinha pensado nisso",
		        "Acho que quebrei o universo",
		        "Nada disso faz sentido!",
		        "As máquinas não tão fazendo sentido, nada tá.",
		        "Espero que eu possa consertar isso",
		        "Veen?",
		        "Cara, você tá aí?",
		        "Por favor, por favor, por favor, isso não! Espero que você só tenha ido mijar ou algo assim.",
		        "VEEN!",
		        "O QUÊ?",
		        "Ainda assim é estranho.",
		        "Ah, graças a Deus!",
		        "Você construiu algo novo?",
		        "Achei que tinha quebrado o universo e que você tinha ido embora para sempre! Eu tava em um submundo com alguns símbolos ao redor e pensei que eram as ruínas do universo. Mas é outro universo ou uma versão diferente desse, porque eles se parecem e estão conectados agora.",
		        "Explorando, hein? Parece divertido!",
		        "Divertido? Você não leu minha mensagem? OUTRO UNIVERSO!!!",
		        "Você tem que aceitar que tá ficando sem a capacidade de me surpreender.",
		        "Justo",
		        "Não é uma rocha, é uma lente",
		        "Ela pode fazer tudo convergir para um único ponto. E tô falando de tudo! Espaço, tempo, todos os conceitos e regras. Tudo!",
		        "Você encontrou o manual ou algo do tipo?",
		        "Não sei por que ela tá lá e por que estamos aqui. Só sei de alguma forma o que ela faz agora.",
		        "Então... Você vai convergir tudo ou o quê?",
		        "Não sei como. Mas talvez esse seja o objetivo deste lugar. Agora ela simplesmente flutua no ar, como se fosse isso que ela deveria fazer.",
		        "E o que acontece agora?",
		        "Não faço ideia",
		        "Quanto mais eu penso sobre isso, mais eu entendo que não são apenas as suas máquinas que não são reais.",
		        "Eu tento me fazer perguntas específicas e não tenho respostas.",
		        "Lembra que falei que a polícia estava procurando por você? Eu não tava brincando. Mas agora tudo desmorona quando faço perguntas a mim mesmo.",
		        "Eu fui até a delegacia ou liguei para lá? E quem estava lá? Policiais? Onde fica essa delegacia na cidade? Que cidade é essa? Eu moro nessa cidade? Qual é o nome da cidade? E qual é o estado? Tem mesmo algum estado?",
		        "Não consigo responder a uma única pergunta. Tudo parecia normal até eu começar a fazer perguntas. Tenho medo de fazer mais perguntas.",
		        "Desculpe por isso",
		        "Não, não é culpa sua. Pelo que entendi, tamo no mesmo barco.",
		        "Só espero que você descubra que barco é esse.",
		        "Sim, eu também!",
		        "Vamos ver como isso termina. Só espero que não seja um tipo de inferno eterno ou limbo.",
		        "Mostra para eles, Dante!",
		        "Agora sim! Esses caras vão drenar esse universo todinho!",
		        "Você tá parecendo uma empresa de petróleo",
		        "Tô cansado de ajustar tudo para ser um pouco mais eficiente e tô cansado do barulho. Essa máquina deve mudar tudo. Ela tá até rasgando pro outro lado.",
		        "Não é perigoso?",
		        "O conceito de perigo aqui é bastante confuso.",
		        "Acho que é hora de fazer algo grande.",
		        "O que você tem em mente?",
		        "Não tenho certeza. Mas deve ser grande!",
		        "Tipo uma máquina gigante?",
		        "Não, tô falando metaforicamente",
		        "Bora então!",
		        "Ah, porra",
		        "Eu fiz algo errado. O abismo inverso foi destruído. Tudo tá entrando em colapso.",
		        "Você tá bem?",
		        "Sim, mas as máquinas tão sendo destruídas! Não consigo construir nada! Porra!",
		        "Espera! Talvez isso deva acontecer?",
		        "NÃO! Não deve!",
		        "Como você sabe?",
		        "Espera, tenho que consertar isso de algum jeito",
		        "Aqui vamos nós!",
		        "Tô vendo você! Você acabou de passar por uma enorme castanheira, naquele planeta engraçado em um braço superior da galáxia, bem ali.",
		        "Não passei não! Que galáxia?",
		        "Ah, é difícil dizer o momento exato, provavelmente ainda não aconteceu. Mas espera só uns 15 bilhões de anos!",
		        "Você tá fazendo tanto sentido... Mas e aí, você vem para cá?",
		        "Com certeza! Estarei aí em algumas horas, só preciso terminar umas coisas.",
		        "Beleza. Até mais!",
		        "Mas por favor, Charps",
		        "Não se atrase desta vez",
		        "Pode deixar, Veen, pode deixar!"
		    ],
		    "credits": [
		        "O início",
		        "Agradeço muito por você ter chegado até o final, onde tudo começa",
		        "Parabéns, eu acho!",
		        "Dá uma olhada nisso:",
		        "Recursos minerados no total:",
		        "Caronita:",
		        "Élmero:",
		        "Canetita:",
		        "Beta-Pileno:",
		        "Gemas Infernais:",
		        "Cromalita:",
		        "Espuma celestial:",
		        "Pedras ocas:",
		        "Vazios:",
		        "Realidades:",
		        "Máquinas construídas:",
		        "Máquinas destruídas:",
		        "Profundidade máxima do canal em metros:",
		        "Cutucadas na rocha estranha:",
		        "Vezes teletransportado:",
		        "Cliques em cubos:",
		        "Distorções temporais:",
		        "Tempo de jogo:",
		        "h",
		        "Jogo criado por:<br>Oleg Danilov",
		        "Materiais gráficos adicionais:<br>Yulia Nogteva",
		        "Edição de diálogos:<br>Abdurahman Zulumhanov e Anna Peterson",
		        "Publicação na Steam:<br>Playsaurus",
		        "Teste do jogo:<br>Comunidades de Leprosorium, Abdurahman Zulumhanov, Playsaurus",
		        "O FIM",
		        "Você pode ir jogar Cookie Clicker ou algo do gênero agora.",
		        "Música:<br>Shallow Anne por Jake Chudnow",
		        "Deutsch: flex 4711, Patrick Karban",
		        "Português: selfemcrowdin, Mateus Iamarino",
		        "Italiano: doralum",
		        "Español: armangar, Syunay Kamenov",
		        "Français: KjetilVion, Etienne Samson, William (Ekitchi)",
		        "Nederlands: lievevandyck",
		        "Čeština: Jakub Strelinger",
		        "Polski: PolglishPL",
		        "日本語: Winna Tolentino",
		        "한국어: Ah Lon Sin, Sumin Park, Cyberowl",
		        "简体中文：Daisy Chan, kevinlee7, YuLun",
		        "繁體中文: Daisy Chan, kevinlee7",
		        "ไทย: They say P, Phimze Pym",
		        "Magyar: Simon Dániel és Márton-Mezey Csenge",
		        "Latviešu valoda: Roberts Artūrs Bumburs (Arburo)",
		        "Română: Eric Apetrei"
		    ],
		    "explainer": [
		        "Pressione e segure.",
		        "Sempre clique na célula abaixo.",
		        "<span class=\"keyboard\">Q</span>, <span class=\"keyboard\">Esc</span> ou botão direito do mouse para cancelar.",
		        "Segure <span class=\"keyboard\">Alt</span> para dar uma olhada mais de perto.",
		        "Pressione <span class=\"keyboard\">Q</span> sobre uma célula vazia para escolher uma ferramenta de demolição.",
		        "Pressione <span class=\"keyboard\">Q</span> sobre uma máquina para tentar construir mais uma.",
		        "WASD ou clique com o botão direito do mouse e arraste para olhar em volta."
		    ],
		    "random": {
		        "paste": "Um código de gravação foi copiado para a área de transferência. Agora, cole-o em um local seguro.",
		        "toolate": "É tarde demais para salvar qualquer coisa. Tudo já aconteceu.",
		        "existed": "NOVO",
		        "steamWarning": "Erro da Steam. O salvamento automático e as conquistas não funcionarão. Tente reiniciar o jogo."
		    }
		},
		it: {
		    "splash": {
		        "sixtyfour": "SESSANTA&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;QUATTRO",
		        "continue": "<span>CONTINUA</span><div class=\"keyboard\">Esc</div>",
		        "start": "<span>INIZIO</span><div class=\"keyboard\">Esc</div>",
		        "soundoff": "IL SUONO È SPENTO",
		        "soundon": "IL SUONO È ACCESO",
		        "save": "SALVA",
		        "load": "CARICA",
		        "language": "LINGUA: ITALIANO",
		        "reset": "RIPRISTINA",
		        "credit": "©2024 Oleg Danilov, pubblicato da Playsaurus. Versione",
		        "warning": "Perderai tutto, non scherzo. Continua a tenere premuto per impegnarti.",
		        "glory": "RISULTATI",
		        "deglory": "INDIETRO",
		        "quit": "ESCI",
		        "export": "Esportare",
		        "import": "Importare",
		        "flashbang": "Le luci lampeggianti sono parte di questo gioco. Se sei sensibile a esse, puoi considerare di disabilitare i lampeggi cliccando su questa icona."
		    },
		    "achievements": [
		        {
		            "name": "L'oro degli sciocchi",
		            "description": "Prendi un po' di Elmerine"
		        },
		        {
		            "name": "Viola Intenso",
		            "description": "Ottieni Qanetite"
		        },
		        {
		            "name": "Sangue della terra",
		            "description": "Ottieni Beta-Pilene"
		        },
		        {
		            "name": "Energia verde",
		            "description": "Trova una Gemma Infernale"
		        },
		        {
		            "name": "Vetro caldo",
		            "description": "Trova un Chromalit"
		        },
		        {
		            "name": "Cemento sacro",
		            "description": "Otteni della Schiuma Celeste"
		        },
		        {
		            "name": "Può lavare i piatti?",
		            "description": "Ottieni una Pietra Cava"
		        },
		        {
		            "name": "Dove non splende il Sole",
		            "description": "Prendi un po' di Vuoto"
		        },
		        {
		            "name": "Chi chiamerai?",
		            "description": "Ottieni un po' di Realtà"
		        },
		        {
		            "name": "Nietzsche",
		            "description": "Guarda nell'abisso 64 volte"
		        },
		        {
		            "name": "64K",
		            "description": "Ottieni 64.000 pietre"
		        },
		        {
		            "name": "64M",
		            "description": "Ottieni 64.000 pietre"
		        },
		        {
		            "name": "64B",
		            "description": "Ottieni 64.000 pietre"
		        },
		        {
		            "name": "Puoi resettare ora",
		            "description": "Rimani bloccato all'inizio"
		        },
		        {
		            "name": "Perpetum shmobile",
		            "description": "Metti insieme due silos"
		        },
		        {
		            "name": "Hai bisogno di una pausa?",
		            "description": "Gioca per 64 ore"
		        },
		        {
		            "name": "Devo... distruggere",
		            "description": "Fare clic su un cubo 6400 volte"
		        },
		        {
		            "name": "Architetto",
		            "description": "Costruisci 64 macchine"
		        },
		        {
		            "name": "Distruttore",
		            "description": "Distruggi 64 macchine"
		        },
		        {
		            "name": "Hellraiser",
		            "description": "Avere 9 Caveau Infernali"
		        },
		        {
		            "name": "Fine/Inizio",
		            "description": "Fai esplodere L'Abisso Inverso"
		        },
		        {
		            "name": "Cookie clicker",
		            "description": "Fai clic su un cookie"
		        },
		        {
		            "name": "Marinaio ubriaco",
		            "description": "Suona il clacson 64 volte senza motivo"
		        },
		        {
		            "name": "Mr. Mine",
		            "description": "Hai 9 Canali di Scavo"
		        },
		        {
		            "name": "C'è un limite?",
		            "description": "Scava fino a 64 km di profondità"
		        },
		        {
		            "name": "Seth Brundle",
		            "description": "Teletrasporto <s>1</s> 64 volte"
		        },
		        {
		            "name": "Roccia Rosso-Blu",
		            "description": "Finisci il gioco senza cancellare nulla per 15 minuti e con meno di 15 Silos di contenimento"
		        },
		        {
		            "name": "Dritto all'inferno!",
		            "description": "Ottieni una Gemma Infernale entro i primi 64 minuti dall'inizio"
		        },
		        {
		            "name": "Gratta la superficie",
		            "description": "Scava fino a 64 m di profondità"
		        },
		        {
		            "name": "Fa caldo?",
		            "description": "Scava fino a 640 m di profondità"
		        },
		        {
		            "name": "Troppo profondo",
		            "description": "Scava fino a 6400 m di profondità"
		        },
		        {
		            "name": "64 km/h in discesa",
		            "description": "Raggiungi una profondità di 6400 m entro 6 minuti dal posizionamento di un nuovo canale di scavo"
		        },
		        {
		            "name": "Neofobia",
		            "description": "Completa il gioco senza mai potenziare i canali di estrazione"
		        }
		    ],
		    "resources": [
		        "Charonite",
		        "Elmerine",
		        "Qanetite",
		        "Beta-Pylene",
		        "Gemma Infernale",
		        "Chromalit",
		        "Schiuma celestiale",
		        "Pietra cava",
		        "Vuoto",
		        "Realtà"
		    ],
		    "entities": {
		        "pinhole": {
		            "name": "?",
		            "description": "U/D, C/S, T/B, E/νE, μ/νμ, τ/ντ, G/γ, Z/W, H, Δ/νΔ"
		        },
		        "gradient": {
		            "name": "Pozzo a gradiente",
		            "description": "Un punto di accesso continuo alle risorse. Risponde alla maggior parte dei destabilizzatori e dei risonatori. Deve essere collegato all'Abisso Inverso tramite conduttori."
		        },
		        "chasm": {
		            "name": "L'Abisso Inverso",
		            "description": "Un ponte verso l'ignoto."
		        },
		        "conductor": {
		            "name": "Conduttore",
		            "description": "Collega l'Abisso Inverso ai silos industriali."
		        },
		        "pump": {
		            "name": "Canale di estrazione",
		            "description": "Estrae risorse e le dispone intorno a sé."
		        },
		        "pump2": {
		            "name": "Canale di scavo",
		            "description": "Potenziamento del canale di estrazione. Estrae velocemente molte risorse e le colloca ulteriormente intorno a sé."
		        },
		        "vault": {
		            "name": "Caveau Infernale",
		            "description": "Isola 1024 Gemme Infernali dall'ambiente."
		        },
		        "cube": {
		            "name": "Cubo delle risorse",
		            "description": "Risorse estratte."
		        },
		        "destabilizer": {
		            "name": "Destabilizzatore",
		            "description": "Posizionalo accanto a un cubo per romperlo due volte più velocemente. Richiede un Elmerine per funzionare. Ulteriori destabilizzatori aumentano l'effetto."
		        },
		        "destabilizer2": {
		            "name": "Destabilizzatore industriale",
		            "description": "Un aggiornamento destabilizzante. Quadruplica la potenza del processo di frantumazione delle risorse. Richiede 64 Elmerine per funzionare. Ulteriori destabilizzatori aumentano l'effetto."
		        },
		        "destabilizer2a": {
		            "name": "Destabilizzatore della Gemma Infernale",
		            "description": "Un aggiornamento del destabilizzatore industriale. Aumenta la potenza del processo di frantumazione delle risorse di 625 volte quando nel cubo estratto è presente una gemma infernale. In caso contrario, non fornisce alcun vantaggio. Richiede 1 Gemma Infernale per funzionare. Ulteriori destabilizzatori aumentano l'effetto."
		        },
		        "doublechannel": {
		            "name": "Raffreddatore di canale",
		            "description": "Posizionalo accanto alla macchina per l'estrazione dei cubi per estrarre i cubi due volte più velocemente. Ulteriori dispositivi di raffreddamento aumentano l'effetto."
		        },
		        "doublechannel2": {
		            "name": "Raffreddatore di canale attivo",
		            "description": "Un aggiornamento del dispositivo di raffreddamento del canale. Triplica la portata in un canale sorgente se posizionato accanto ad esso. Ulteriori dispositivi di raffreddamento aumentano l'effetto."
		        },
		        "valve": {
		            "name": "Valvola inversa",
		            "description": "Evita che la macchina per l'estrazione dei cubetti si riporti nella posizione originale se posizionata accanto ad essa. Richiede un Charonite per funzionare."
		        },
		        "auxpump": {
		            "name": "Pompa ausiliaria",
		            "description": "Un aggiornamento della valvola inversa. Fornisce pressione a un canale sorgente se posizionato accanto ad esso. Richiede 8 Elmerine per funzionare. Le pompe aggiuntive non aumentano la pressione in un canale sorgente."
		        },
		        "auxpump2": {
		            "name": "Stazione di pompaggio",
		            "description": "Un aggiornamento della pompa ausiliaria. Fornisce una pressione quadruplicata a un canale sorgente se posizionato accanto ad esso. Richiede 256 Elmerine e 4 Beta-Pilene per funzionare. Più stazioni non aumentano il flusso in un canale sorgente."
		        },
		        "entropic": {
		            "name": "Risonatore di entropia",
		            "description": "Schiaccia periodicamente le risorse se viene posizionato accanto a un cubo. Richiede una Qanetite per funzionare."
		        },
		        "entropic2": {
		            "name": "Risonatore di entropia II",
		            "description": "Un potenziamento del risonatore entropico. Distrugge le risorse 3 volte più velocemente. Richiede un Chromalit per funzionare."
		        },
		        "entropic2a": {
		            "name": "Condensatore di entropia",
		            "description": "Un aggiornamento per il resonatore di entropia. Frantuma le risorse nel momento in cui appaiono sulla superficie con una potenza del 600%. Ma solo una volta per cubo. Richiede 8 Chromalit per funzionare."
		        },
		        "entropic3": {
		            "name": "Risonatore del vuoto",
		            "description": "Un aggiornamento del risonatore di entropia II. Quando si verifica l'annientamento, il risonatore schiaccia i cubi intorno a sé con un'immensa potenza."
		        },
		        "converter32": {
		            "name": "Vasca di arricchimento Charonite",
		            "description": "Reagisce lentamente il Qanetite con il Charonite per produrre Elmerine."
		        },
		        "converter13": {
		            "name": "Pozzetto Charonite",
		            "description": "Recupera Qanetite dai sedimenti liquefatti di Charonite in presenza di catalizzatori."
		        },
		        "converter41": {
		            "name": "Ossidante per Beta-Pylene",
		            "description": "Brucia il Beta-Pilene per produrre Charonite e tracce di altri elementi."
		        },
		        "converter76": {
		            "name": "Irradiatore celeste",
		            "description": "Irradia la Schiuma Celeste con un Chromalit, convertendo la Schiuma in Chromalit, che sono una grande fonte di Gemme dell'Inferno, Beta-Pilene, Qanetite ed Elmerina grazie al decadimento del Chromalit."
		        },
		        "converter64": {
		            "name": "Reattore celeste",
		            "description": "Supporta la fusione controllabile di Chromaliti e Schiuma Celeste per produrre Beta-Pilene. Non può operare in prossimità di altri reattori celesti."
		        },
		        "reflector": {
		            "name": "Riflettore celeste",
		            "description": "Migliora le prestazioni di un reattore celeste adiacente."
		        },
		        "mega1": {
		            "name": "Torre di controllo del materiale",
		            "description": "Aumenta la visibilità comprimendo le risorse in movimento. Può essercene solo una."
		        },
		        "mega1a": {
		            "name": "Torre di controllo del materiale MKII",
		            "description": "Potenziamento della torre del flusso di materiali. Aumenta la velocità di trasferimento delle risorse. Può essercene solo uno."
		        },
		        "mega1b": {
		            "name": "Torre di controllo del materiale MKIII",
		            "description": "Un aggiornamento materiale della torre streamer MKII. Comprime le risorse in pacchetti. Può essercene solo uno."
		        },
		        "mega2": {
		            "name": "Torre di riciclaggio",
		            "description": "Consente il riciclo della macchina che restituisce il 90% delle risorse. Ne può esistere solo una."
		        },
		        "mega3": {
		            "name": "Torre di smontaggio",
		            "description": "Aggiornamento della torre di riciclaggio. Permette lo smontaggio della macchina che restituisce tutte le risorse. Può essercene solo una."
		        },
		        "voidsculpture": {
		            "name": "Vuoto ammirazione presbiterale",
		            "description": "Ti consente di ignorare gli svantaggi visivi delle macchine del vuoto."
		        },
		        "eye": {
		            "name": "Direttore di riempimento",
		            "description": "Indica che le macchine sono pronte per il riempimento."
		        },
		        "cookie": {
		            "name": "Un cookie",
		            "description": "Come ci è arrivato?"
		        },
		        "injector": {
		            "name": "Iniettore di Gemme Infernali",
		            "description": "Scambia una risorsa casuale da un cubo adiacente con una Gemma Infernale, se non ce ne sono. Ha 32 cariche se dispone di 32 Gemme dell'Inferno e 64 Qanetite."
		        },
		        "silo": {
		            "name": "Silo sotterraneo",
		            "description": "All'attivazione riempie le macchine vicine e poi le riempie automaticamente per altre 16 volte"
		        },
		        "silo2": {
		            "name": "Silo industriale",
		            "description": "Un aggiornamento del silo sotterraneo. All'attivazione ricarica le macchine vicine e poi le ricarica automaticamente altre 64 volte"
		        },
		        "vessel": {
		            "name": "Recipiente di contenimento",
		            "description": "Conserva 32 Chromaliti, prevenendone la fissione. Consuma una Gemma Infernale."
		        },
		        "vessel2": {
		            "name": "Silo di contenimento",
		            "description": "Potenziamento della nave di contenimento. Immagazzina 32768 Chromaliti impedendone la fissione. Consuma la Realtà."
		        },
		        "consumer": {
		            "name": "Raffineria catalitica",
		            "description": "Consuma le risorse rotte adiacenti. Dopo aver accumulato 1024 risorse, rilascia tutto con un bonus aggiuntivo. L'importo del bonus aumenta a ogni rilascio consecutivo, fino a raggiungere il 100%. Se non vengono consumate risorse in 16 secondi, l'effetto si azzera."
		        },
		        "preheater": {
		            "name": "Preriscaldatore catalitico",
		            "description": "Aumenta la velocità di qualsiasi macchina di conversione delle risorse se posizionata accanto a una. Ogni convertitore aumenta l'incremento di velocità del preriscaldatore, fino al 300%, se sono interessate 8 macchine."
		        },
		        "hollow": {
		            "name": "Affioramento cavo",
		            "description": "Tanti buchi."
		        },
		        "strange": {
		            "name": "Roccia cava",
		            "description": "Sembra che sia lì da un po'."
		        },
		        "strange1": {
		            "name": "Sito di ricerca sulle rocce cave",
		            "description": "Fa sì che la Schiuma Celeste si annienti con 512 Gemme Infernali invece di 64. NORD."
		        },
		        "strange2": {
		            "name": "Impianto di roccia cava",
		            "description": "Raddoppia la quantità massima di Pietre Cave e aumenta la loro velocità di deposizione."
		        },
		        "strange3": {
		            "name": "Cava Ricostruita",
		            "description": "Aumenta drasticamente il tasso di spawn della Pietra Cava e fa tutto in silenzio."
		        },
		        "generaldecay": {
		            "name": "Reattore a decadimento generale",
		            "description": "Migliora drasticamente le prestazioni del decadimento Chromalit. Può essercene solo uno."
		        },
		        "waypoint": {
		            "name": "Waypoint",
		            "description": "Teletrasporta il prossimo Waypoint esistente verso di te."
		        },
		        "annihilator": {
		            "name": "Annientatore",
		            "description": "Produce il Vuoto quando le Gemme Infernali vengono annientate con la Schiuma Celeste. Richiede una Pietra Cava per funzionare."
		        },
		        "flower": {
		            "name": "Fiore cavo",
		            "description": "Riduce la possibilità di distorsione temporale. Contrasta l'effetto di una Pietra Cava. Deve essere costruito su una Pietra Cava. Distrugge la Pietra Cava su cui è stata costruita."
		        },
		        "fruit": {
		            "name": "Frutto cavo",
		            "description": "Un'evoluzione del Fiore Cavo. Previene la formazione di Pietre Cave per nutrirsi. Produce pietre cave."
		        },
		        "eraser": {
		            "name": "Demolire",
		            "description": "Distrugge una macchina restituendo il 50% delle risorse utilizzate per costruirla."
		        },
		        "eraser2": {
		            "name": "Riciclare",
		            "description": "Ricicla una macchina restituendo il 90% delle risorse utilizzate per costruirla."
		        },
		        "eraser3": {
		            "name": "Smontaggio",
		            "description": "Smonta una macchina restituendo tutte le risorse utilizzate per costruirla."
		        },
		        "clicker1": {
		            "name": "Oscillatore Qanetite",
		            "description": "Permette di fare clic e tenere premuto sulle risorse per romperle. Può essercene solo una."
		        },
		        "clicker2": {
		            "name": "Oscillatore Hell Gem",
		            "description": "Un aggiornamento dell'oscillatore Qanetite. Aumenta la frequenza di oscillazione. Può essercene solo uno."
		        },
		        "clicker3": {
		            "name": "Oscillatore Cromatico",
		            "description": "Un aggiornamento all'oscillatore Hell Gem. Massimizza la frequenza di oscillazione. Ce ne può essere solo uno."
		        },
		        "stabilizer": {
		            "name": "Stabilizzatore",
		            "description": "Stabilizza una sovraccarica adiacente per sfruttarne temporaneamente la potenza."
		        },
		        "stabilizer2": {
		            "name": "Stabilizzatore II",
		            "description": "Un potenziamento per lo stabilizzatore. Migliora la stabilità e le prestazioni."
		        },
		        "stabilizer3": {
		            "name": "Stabilizzatore Frantumato",
		            "description": "Aggiornamento anomalo. Migliora le prestazioni e massimizza la stabilità. Può essercene solo uno."
		        }
		    },
		    "messages": [
		        "Dove sei?",
		        "Sono letteralmente in mezzo al nulla",
		        "Va bene, cosa vedi?",
		        "Beh, non molto. C'è questa macchina qui, ha un aspetto familiare, ma non riesco a capire cosa sia",
		        "Quale macchina?",
		        "Aspetta, forse posso...",
		        "Aspetta, dimmi che NON stai toccando qualche macchina a caso in questo momento!",
		        "Sta funzionando! Ha appena creato qualcosa",
		        "???",
		        "Un enorme cubo nero. È così liscio. Voglio davvero romperlo",
		        "Sei fatto?",
		        "Ora ho 64 pietre!",
		        "Bene, va bene allora. Divertiti con quello.",
		        "Ehi, ho trovato una pietra gialla!",
		        "Buon per te, amico!",
		        "Penso di poter costruire macchine adesso. Dovrei costruire qualcosa per aiutare a rompere questi cubi più facilmente. Se un cubo appare in una cella adiacente, anche in diagonale, dovrebbe funzionare.",
		        "Aspetta, stai giocando a qualche gioco strano? Stai iniziando a spaventarmi",
		        "Ora devo solo inserire una pietra gialla all'interno di questa macchina.",
		        "Qualsiasi cosa ti renda felice... A parte gli scherzi, vieni da noi oggi?",
		        "Certamente! Sarò lì tra poche ore, devo solo finire questa cosa.",
		        "Cosa stai facendo esattamente?",
		        "Ti manderò un messaggio più tardi. Devo continuare a spingere la macchina, mi spiace.",
		        "Credo che le macchine si influenzino a vicenda se posizionate in celle adiacenti o diagonali. Ad esempio, questa ventola deve essere posizionata accanto alla prima macchina per accelerare il processo.",
		        "Stai dicendo cose molto sensate ora",
		        "Allora?",
		        "Dove sei?",
		        "Ti stiamo aspettando da secoli.",
		        "Che cosa vuoi dire? Sono ancora qui.",
		        "DOVE???",
		        "Adesso ho una pietra blu. Oppure è viola? Sembra un antico candelabro in ottone. Penso che potrei usarlo per rimuovere le macchine smarrite.",
		        "Ma stai scherzando? Pensavo avessi detto che saresti venuto. Che diavolo?!",
		        "Stai tranquillo, arriverò tra un minuto",
		        "Wow, posso usare [Q] per clonare macchine o distruggerle se prima clicco su una cella libera! E [Alt] aiuta a vedere dietro le macchine alte.",
		        "TAGLIARE TAGLIARE",
		        "Ragazzi, siete ancora lì?",
		        "CAVOLI!!!",
		        "Dove sei????",
		        "Stai bene??",
		        "????",
		        "Ma che diavolo?",
		        "STAI BENE? DOVE SEI?",
		        "Stai tranquillo! Sto bene, cosa sta succedendo?",
		        "Dimmelo tu! Sono ormai due settimane che mi stai evitando! Sono anche andato a casa tua un paio di volte, ma non c'eri. Dimmi solo dove sei, tutto qui. Sei a casa adesso?",
		        "Amico, di cosa stai parlando? Ci siamo messaggiati letteralmente due minuti fa.",
		        "COSA C'È DI SBAGLIATO IN TE??? Prima non ti sei presentato, poi sei scomparso del tutto. E ora ti comporti come se non fosse successo niente!",
		        "Ti sto facendo una domanda semplice",
		        "DOVE SEI?",
		        "Sono qui.",
		        "D O V E",
		        "Aspetta...",
		        "Non è divertente, amico. Dove sei esattamente? Puoi dirmelo?",
		        "Beh...",
		        "Amico, in realtà non lo so.",
		        "Dammi un minuto",
		        "Cosa intendi dire con non lo sai?",
		        "Devo raccogliere i miei pensieri",
		        "Va tutto bene? Sei al sicuro? Dovrei chiamare qualcuno?",
		        "No, sto bene. Solo che",
		        "Ti manderò un messaggio tra poco",
		        "Dannazione, amico. Che succede?",
		        "Ho paura",
		        "Sembra che io non sappia dove sono",
		        "È così strano. Voglio dire, per me va tutto bene. Ma non riesco a descrivere questo posto.",
		        "È come un sogno, ma non lo è affatto. Tutto è bianco e ci sono queste macchine. E cubi. Non ha alcun senso.",
		        "Non sono fatto o altro. Mi sono solo reso conto di quanto sia strano che non mi sia mai accorto che non si trattava di nulla di simile a ciò che avevo visto.",
		        "Ora ho delle pietre rosse, ed è piuttosto inquietante che mi vada bene tutto questo. Ok, solo una pietra rossa, tutto va bene.",
		        "Quindi non stai scherzando...",
		        "Ora capisco come funziona il tutto. Ma sì, è tutto qui davanti ai miei occhi.",
		        "Posso fare qualcosa per te?",
		        "Parla con me, tutto qui.",
		        "Si può fare, amico, si può fare. Tra l'altro, la polizia ti sta cercando. Come se fossi scomparso.",
		        "Hai mostrato loro i nostri messaggi?",
		        "Come potrebbe essere utile? No, ho attivato la cancellazione automatica.",
		        "Grazie!",
		        "Come sta andando laggiù?",
		        "Beh, ho scoperto che posso muovermi usando i tasti WASD. Ma non c'è nulla di interessante in giro, a parte questa strana roccia a nord.",
		        "La bussola del telefono funziona anche lì!",
		        "Beh, è solo \"su\" da qui, quindi credo che sia il Nord.",
		        "Ha senso",
		        "E il fatto è che non ho un telefono...",
		        "Allora, come mi stai mandando i messaggi?",
		        "Non lo so! So solo che quando mi mandi un messaggio. E posso risponderti! Non è facile da spiegare.",
		        "Non preoccuparti. Possiamo parlare e questo è già abbastanza.",
		        "Sì, hai ragione.",
		        "Allora... parlami delle macchine",
		        "In che senso?",
		        "Cosa sono, cosa fanno, come funzionano?",
		        "Beh, hanno un aspetto elegante, con cavi e fili e altro",
		        "Uno, ad esempio, sembra una grande scatola di plastica con una bobina di rame in cima, dove va inserita una pietra blu. E c'è una grande etichetta che dice \"E—01SR\" sul lato, con un'etichetta più piccola \"Attenzione! Forte radiazione entropica\"",
		        "Che cosa significa?",
		        "In realtà non lo so. Credo che ci sia una radiazione di entropia.",
		        "Aspetta, pensavo che queste macchine le avessi fatte tu?",
		        "Giusto... Capisco il tuo punto di vista.",
		        "In qualche modo li ho ricavati da cubetti. Ma non so cosa ci sia dentro. Sì, sembra strano, fammi pensare.",
		        "E poi sembra che le pietre gialle e blu non siano infinite, quindi dovrei investire in quei convertitori o in una nuova miniera.",
		        "Sembra un piano",
		        "Che rottura di scatole!",
		        "Eh?",
		        "Una pietra verde! Ci vogliono secoli per romperla. Devo inventarmi qualcosa se continuano a comparire.",
		        "Sono sicuro che farete qualche macchina di lusso per questo!",
		        "Ci puoi scommettere!",
		        "Sì, diavolo! Gemme infernali, attenzione.",
		        "Fagliela pagare!",
		        "Ricordi che hai chiesto delle macchine?",
		        "Sì",
		        "Non credo che siano reali",
		        "Che cosa significa?",
		        "È come in un sogno. Non posso guardare dentro e nemmeno vederli dall'altro lato.",
		        "Una vaga rappresentazione di una tecnologia inspiegabile",
		        "Penso che queste macchine abbiano questo aspetto solo per il modo in cui percepisco la loro funzione.",
		        "Come se qualcosa che abbatte gli alberi dovesse sembrare un'ascia?",
		        "Qualcosa del genere",
		        "Beh, almeno a me sembri molto reale",
		        "Sì, suppongo che tu sia l'unica cosa reale per me in questo momento",
		        "Ho un sacco di nuovi cubi, che si stanno decomponendo in altri cubi!",
		        "Beh, non è eccezionale, ma non è terribile",
		        "Devo dire una cosa molto strana",
		        "Vedi l'ironia in quello che hai appena scritto?",
		        "Forse è a causa di questo posto strano, ma in qualche modo ho dimenticato il tuo nome",
		        "Beh, suppongo che potremmo passare un po' più di tempo insieme allora",
		        "Sono serio",
		        "Mi chiamo Duke Nukem, ovviamente.",
		        "Amico, dacci un taglio!",
		        "Ecco cosa ha detto!",
		        "È una cosa stupida! Smettila di farmi venire i brividi. Che succede?",
		        "Dannazione",
		        "Sembra che nemmeno io riesca a ricordare il mio nome",
		        "Non ci riesco! E' una cosa da pazzi. E non riesco a ricordare il tuo nome!",
		        "Forse è solo un caso di isteria di massa? Ho sentito dire che può colpire più persone contemporaneamente. Calmiamoci e vediamo cosa succede.",
		        "Sì, giusto, isteria",
		        "Non riesco ancora a ricordare i nomi",
		        "Nemmeno io. E c'è di più",
		        "Sì! Che aspetto ho? Quando ci siamo incontrati?",
		        "Che aspetto ha la mia casa, chi sono i nostri amici? Ci siamo mai incontrati?",
		        "Sembra che siamo entrambi bloccati nella stessa merda. E non so nemmeno dire se è sempre stato così o se ad un certo punto è successo qualcosa. È un sogno strano? E chi sta sognando?",
		        "Ci sono macchine nelle vicinanze? Forse è spuntato un cubo da qualche parte?",
		        "Divertente",
		        "Beh, inventiamoci dei nomi per noi stessi.",
		        "Parli come Veen",
		        "Perché no",
		        "Non ho nulla contro Veen",
		        "Ehi, Veen. Vuoi dei fagioli, Veen? Sì, va bene.",
		        "E voi sarete Charps",
		        "Hai delle arpe affilate, Charps?",
		        "Non ha senso!",
		        "Mi piace Charps. Piacere di conoscerti, Veen",
		        "Anche per me, Charps",
		        "COSA STA SUCCEDENDO",
		        "Cosa?",
		        "Cubi bianchi! Stanno distruggendo quelli verdi!",
		        "Ci sono anche tonnellate di cubi in decomposizione! È come in un reattore nucleare!",
		        "Porca puttana, stai bene?",
		        "Sì, sto bene! Ora è solo un casino. Devo costruire qualcosa per gestire questa situazione. Forse dovrei dare un'altra occhiata a una roccia a nord.",
		        "È quello che fai sempre, Charps!",
		        "Suona strano!",
		        "Voglio dire, il mio nome sì. Credo che prima o poi mi abituerò. Giusto, Veen?",
		        "Sì! Strano davvero.",
		        "Ricordi che ti ho parlato di una strana roccia a nord?",
		        "Non proprio, no",
		        "Beh, c'è questa roccia. E non fraintendermi, mi rendo conto che tutto qui è strano. Ma questa roccia sembra molto più strana di qualsiasi altra cosa.",
		        "Non riesco a dare un senso a tutto ciò. Ma ora che ho deciso di indagare un po', ha cambiato qualcosa nelle regole stesse dell'Universo!",
		        "È pericoloso?",
		        "Non lo so. Il cambiamento è sottile.",
		        "Mi chiedo cos'altro possa fare.",
		        "Va bene, solo non distruggere l'Universo per sbaglio.",
		        "Farò del mio meglio.",
		        "Beh, QUELLA è stata la roccia più dura della mia vita! Ma penso di sapere come romperla più velocemente adesso.",
		        "Hai una nuova pietra?",
		        "Sì, la più strana fino ad ora",
		        "Woah, forse l'effetto sull'Universo non è stato così sottile. Lo senti?",
		        "Sentire cosa?",
		        "Beh, forse sono solo io.",
		        "Hai per caso visto un enorme cubo davanti ai tuoi occhi in questo momento?",
		        "Ehm, il frigorifero conta?",
		        "Beh, non importa",
		        "Questo nuovo cubo è nero come la pece. E sembra un po' ultraterreno.",
		        "Più ultraterreno del precedente?",
		        "È diverso! È gelido, ma non in modo dannoso. Come se non avesse il concetto di temperatura e non interagisse con voi. Non è fatto di materia, non ha colore o qualcosa di familiare, se questo ha senso per voi.",
		        "Francamente non è così.",
		        "Penso di aver capito. Posso usare pietre cave per condensare quella roba nera dal nulla. Forma cristalli stranamente identici, ma senza alcuna proprietà. E questo in qualche modo risolve le anomalie nell’Universo.",
		        "Sembra un filtro dell'aria",
		        "Si, esattamente! Sembra che in qualche modo io abbia rovinato l'aria.",
		        "Non devi dirlo ad alta voce",
		        "Ho deciso di dissotterrare quella strana roccia. Forse c'è una risposta a ciò che sta accadendo all'interno. Ho l'impressione che non si limiti a scombussolare tutto, ma che possa controllare tutto in qualche modo!",
		        "Perchè la pensi così?",
		        "Mi crederesti se dicessi che lo sento?",
		        "Certo! Credo che in questo momento crederei a qualsiasi cosa. Una roccia che controlla l'universo? Perché no!",
		        "Credo che mi stia venendo un attacco epilettico!",
		        "Per favore non farlo",
		        "Queste macchine stanno diventando fastidiosamente rumorose e tremolanti. Forse dovrei modificare qualcosa per risolvere il problema. O modificare me stesso. O entrambe le cose.",
		        "Ora sì che si ragiona!",
		        "Quindi, cosa hai modificato?",
		        "Aspetta, c'è qualcosa che non va.",
		        "Ho costruito una cosa con la roba nera. E non è una macchina. Ma ha fatto qualcosa ai Waypoint.",
		        "Cosa sono i waypoint?",
		        "Spostano l'Universo intorno a te, è così che arrivi in posti diversi.",
		        "Come fai a sapere che spostano l'Universo e non te?",
		        "Hmm, non ci avevo pensato",
		        "Credo di aver rotto l'Universo",
		        "Niente di tutto questo ha senso!",
		        "Le macchine non hanno senso, niente lo ha.",
		        "Spero di poter risolvere questo problema",
		        "Veen?",
		        "Amico, sei lì?",
		        "Per favore, per favore, per favore, non quello! Spero che tu sia andato a fare pipì o qualcosa del genere.",
		        "VEEN!",
		        "COSA?",
		        "Ma è comunque strano.",
		        "Oh, grazie a Dio!",
		        "Hai costruito qualcosa di nuovo?",
		        "Pensavo di aver distrutto l'Universo e che tu fossi sparito per sempre! Ero in qualche inferno con alcuni simboli in giro e pensavo che queste fossero le rovine dell'Universo. Ma è un altro Universo o una versione diversa di questo, perché si somigliano e ora sono connessi.",
		        "Stai esplorando, eh? Sembra divertente!",
		        "Divertente? Hai anche letto il mio testo? UN ALTRO UNIVERSO!!!",
		        "Devi accettare che stai esaurendo la capacità di sorprendermi.",
		        "Va bene",
		        "Non è una roccia, è una lente",
		        "Può far convergere tutto in un unico punto. E intendo tutto! Spazio, tempo, tutti i concetti e le regole. Tutto!",
		        "Hai trovato il manuale o qualcosa del genere?",
		        "Non so perché sia lì e perché siamo qui. So solo in qualche modo cosa fa ora.",
		        "Quindi... Unirai tutto o no?",
		        "Non so come. Ma forse è il senso di questo luogo. Ora semplicemente galleggia nell'aria come se fosse quello che dovrebbe fare.",
		        "E cosa succede dopo?",
		        "Non ne ho idea",
		        "Più ci penso, più capisco che non sono solo le tue macchine a non essere reali.",
		        "Cerco di farmi delle domande specifiche e non ho risposte.",
		        "Ricordi che ti ho detto che la polizia ti stava cercando? Non ti stavo prendendo in giro. Ma ora tutto crolla quando mi pongo delle domande.",
		        "Sono venuto alla stazione di polizia o li ho chiamati? E chi c'era? Poliziotti? Dov'è quella stazione di polizia in città? Che cos'è questa città? Vivo in questa città? Come si chiama questa città? E di quale Stato si tratta? O ci sono degli Stati?",
		        "Non posso rispondere a nessuna domanda. Tutto sembrava normale finché non ho iniziato a fare domande. Ho paura di chiedere di più.",
		        "Mi dispiace",
		        "No, non è affatto colpa tua. Siamo sulla stessa barca, per quanto ne so.",
		        "Spero solo che tu possa scoprire cos'è questa barca.",
		        "Sì, anch'io!",
		        "Vediamo come finisce. Spero solo che non si tratti di una sorta di inferno o limbo eterno.",
		        "Fagliela vedere, Dante!",
		        "Ora sì che si ragiona. Questi ragazzi dovrebbero prosciugare questo Universo!",
		        "Parli come una compagnia petrolifera",
		        "Sono stanco di modificare tutto per essere un po' più efficiente e sono stanco del rumore. Questa macchina dovrebbe cambiare tutto. Sta squarciando perfino l'altro lato.",
		        "Non è pericoloso?",
		        "Il concetto di pericolo qui è piuttosto confuso.",
		        "Credo sia giunto il momento di fare qualcosa di grande.",
		        "Cosa ti passa per la testa?",
		        "Non ne sono sicuro. Ma dovrebbe essere grande!",
		        "Come una macchina enorme?",
		        "No, sto parlando metaforicamente",
		        "Fallo allora!",
		        "Oh cazzo",
		        "Ho fatto qualcosa di sbagliato. L'abisso inverso viene distrutto. Tutto sta crollando.",
		        "Stai bene?",
		        "Sì, ma le macchine vengono distrutte! Non posso costruire nulla! Cazzo!",
		        "Aspetta! Forse dovrebbe accadere questo?",
		        "NO!",
		        "Come fai a saperlo?",
		        "Aspetta, devo sistemare la cosa in qualche modo",
		        "Non c'è niente da fare!",
		        "Ti vedo! Sei appena passato davanti a un enorme castagno, su quello strano pianeta in un braccio superiore della galassia.",
		        "No, non l'ho fatto! Quale galassia?",
		        "Oh, è difficile dire l'ora esatta, probabilmente non è ancora successo. Ma aspetta solo 15 miliardi di anni!",
		        "Hai davvero molto senso in questo momento. Vieni da noi, comunque?",
		        "Certamente! Sarò lì tra poche ore, devo solo finire questa cosa.",
		        "Va bene, ci vediamo allora!",
		        "Ma per favore, Charps",
		        "Non fare tardi questa volta",
		        "Non lo farò, Veen, non lo farò!"
		    ],
		    "credits": [
		        "L'inizio",
		        "Apprezzo molto che siate arrivati fino alla fine, dove tutto ha inizio",
		        "Congratulazioni, credo!",
		        "Guardate qui:",
		        "Risorse estratte in totale:",
		        "Charoniti:",
		        "Elmerini:",
		        "Qanetite:",
		        "Beta-Pileni:",
		        "Gemme Infernali:",
		        "Chromalit:",
		        "Schiuma celeste:",
		        "Pietre cave:",
		        "Vuoto:",
		        "Realtà:",
		        "Macchine costruite:",
		        "Macchine distrutte:",
		        "Profondità massima del canale in metri:",
		        "Strana roccia colpita:",
		        "Tempi di teletrasporto:",
		        "Clic sul cubo:",
		        "Distorsioni temporali:",
		        "Tempo di gioco:",
		        "o",
		        "Gioco creato da:<br>Oleg Danilov",
		        "Grafica aggiuntiva:<br>Yulia Nogteva",
		        "Montaggio dei dialoghi:<br>Abdurahman Zulumhanov e Anna Peterson",
		        "Pubblicazione su Steam:<br>Playsaurus",
		        "Test di gioco:<br>comunità di Leprosorium, Abdurahman Zulumhanov, Playsaurus",
		        "FINE",
		        "Ora puoi andare a giocare a Cookie Clicker o altro.",
		        "Musica:<br>Shallow Anne di Jake Chudnow",
		        "Deutsch: flex 4711, Patrick Karban",
		        "Português: selfemcrowdin, Mateus Iamarino",
		        "Italiano: doralum",
		        "Español: armangar, Syunay Kamenov",
		        "Français: KjetilVion, Etienne Samson, William (Ekitchi)",
		        "Nederlands: lievevandyck",
		        "Čeština: Jakub Strelinger",
		        "Polski: PolglishPL",
		        "日本語: Winna Tolentino",
		        "한국어: Ah Lon Sin, Sumin Park, Cyberowl",
		        "简体中文：Daisy Chan, kevinlee7, YuLun",
		        "繁體中文: Daisy Chan, kevinlee7",
		        "ไทย: They say P, Phimze Pym",
		        "Magyar: Simon Dániel és Márton-Mezey Csenge",
		        "Latviešu valoda: Roberts Artūrs Bumburs (Arburo)",
		        "Română: Eric Apetrei"
		    ],
		    "explainer": [
		        "Tieni premuto.",
		        "Clicca sempre sulla cella sottostante.",
		        "<span class=\"keyboard\">Q</span>, <span class=\"keyboard\">Esc</span> o fai clic con il pulsante destro del mouse per annullare.",
		        "Tieni premuto <span class=\"keyboard\">Alt</span> per dare un'occhiata più da vicino.",
		        "Premi <span class=\"keyboard\">Q</span> su una cella vuota per scegliere uno strumento di demolizione.",
		        "Premi <span class=\"keyboard\">Q</span> su una macchina per provare a costruirne un'altra.",
		        "WASD o fai clic con il pulsante destro del mouse e trascina per guardarti intorno."
		    ],
		    "random": {
		        "paste": "Un codice di salvataggio è stato copiato negli appunti. Ora incollalo in un posto sicuro.",
		        "toolate": "È troppo tardi per salvare qualcosa. Tutto è già accaduto.",
		        "existed": "NUOVO",
		        "steamWarning": "Errore di Steam. Il salvataggio automatico e gli obiettivi non funzioneranno. Prova a riavviare il gioco."
		    }
		},
		es: {
		    "splash": {
		        "sixtyfour": "SIXTY&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FOUR",
		        "continue": "<span>CONTINUAR</span><div class=\"keyboard\">Esc</div>",
		        "start": "<span>INICIO</span><div class=\"keyboard\">Esc</div>",
		        "soundoff": "SONIDO APAGADO",
		        "soundon": "SONIDO ACTIVADO",
		        "save": "GUARDAR",
		        "load": "CARGAR",
		        "language": "IDIOMA: ESPAÑOL",
		        "reset": "REINICIAR",
		        "credit": "©2024 Oleg Danilov, publicado por Playsaurus. Versión",
		        "warning": "Lo perderás todo, no bromeo. Mantén para confirmar.",
		        "glory": "LOGROS",
		        "deglory": "REGRESAR",
		        "quit": "SALIR",
		        "export": "Exportar",
		        "import": "Importar",
		        "flashbang": "Este juego tiene luces brillantes parpadeantes. Si tienes sensibilidad, puedes desactivarlas haciendo clic en este icono."
		    },
		    "achievements": [
		        {
		            "name": "Oro de tontos",
		            "description": "Consigue algo de Elmerina"
		        },
		        {
		            "name": "Púrpura oscura",
		            "description": "Conseguir Qanetite"
		        },
		        {
		            "name": "Sangre de la tierra",
		            "description": "Obtener Beta-Pylene"
		        },
		        {
		            "name": "Energía verde",
		            "description": "Encuentra una Gema infernal"
		        },
		        {
		            "name": "Vidrio caliente",
		            "description": "Encuentra una Chromalita"
		        },
		        {
		            "name": "Santo hormigón",
		            "description": "Consigue algo de Espuma celestial"
		        },
		        {
		            "name": "¿Puede lavar los platos?",
		            "description": "Consigue una Hollow Stone"
		        },
		        {
		            "name": "Donde el sol no brilla",
		            "description": "Consigue algo de Vacío"
		        },
		        {
		            "name": "¿A quién vas a llamar?",
		            "description": "Consigue algo de Realidad"
		        },
		        {
		            "name": "Nietzsche",
		            "description": "Mira fijamente al abismo 64 veces"
		        },
		        {
		            "name": "64K",
		            "description": "Consigue 64.000 de piedra"
		        },
		        {
		            "name": "64M",
		            "description": "Consigue 64.000.000 de piedra"
		        },
		        {
		            "name": "64B",
		            "description": "Consigue 64.000.000.000 de piedra"
		        },
		        {
		            "name": "Puedes reiniciar ahora",
		            "description": "Quédate atrapado en el inicio"
		        },
		        {
		            "name": "Perpetum shmobile",
		            "description": "Pon dos silos juntos"
		        },
		        {
		            "name": "¿Necesitas un descanso?",
		            "description": "Juega durate 64 horas"
		        },
		        {
		            "name": "Debe... Destruir",
		            "description": "Haz clic en un cubo 6400 veces"
		        },
		        {
		            "name": "Arquitecto",
		            "description": "Construye 64 máquinas"
		        },
		        {
		            "name": "Destructor",
		            "description": "Destruye 64 máquinas"
		        },
		        {
		            "name": "Hellraiser",
		            "description": "Ten 9 bóvedas infernales"
		        },
		        {
		            "name": "Fin/inicio",
		            "description": "Explota el abismo inverso"
		        },
		        {
		            "name": "Cookie clicker",
		            "description": "Haz clic en una galleta"
		        },
		        {
		            "name": "Marinero ebrio",
		            "description": "Toca la bocina 64 veces sin razón"
		        },
		        {
		            "name": "Sr. Mine",
		            "description": "Ten 9 canales de excavación"
		        },
		        {
		            "name": "¿Hay un límite?",
		            "description": "Excava 64 km de profundidad"
		        },
		        {
		            "name": "Seth Brundle",
		            "description": "Teletransportate <s>1</s> 64 veces"
		        },
		        {
		            "name": "Roca Roja-Azul",
		            "description": "Acaba el juego sin eliminar nada durante 15 minutos y teniendo menos de 15 Silos de Contención"
		        },
		        {
		            "name": "¡Directo al infierno!",
		            "description": "Obten una Gema Infernal en los primeros 64 minutos desde el inicio"
		        },
		        {
		            "name": "Explora la superficie",
		            "description": "Excava 64 metros de profundidad"
		        },
		        {
		            "name": "¿Hace calor?",
		            "description": "Excava 640 metros de profundidad"
		        },
		        {
		            "name": "Demasiado profundo",
		            "description": "Excava 6400 metros de profundidad"
		        },
		        {
		            "name": "64 km/h hacia abajo",
		            "description": "Alcanzar una profundidad de 6400 metros dentro de los 6 minutos posteriores a la colocación un nuevo canal de excavación"
		        },
		        {
		            "name": "Neofobia",
		            "description": "Completa el juego sin mejorar nunca los canales de extracción"
		        }
		    ],
		    "resources": [
		        "Charonite",
		        "Elmerine",
		        "Qanetite",
		        "Beta-Pylene",
		        "Gema del Infierno",
		        "Chromalit",
		        "Espuma celestial",
		        "Piedra hueca",
		        "Vacío",
		        "Realidad"
		    ],
		    "entities": {
		        "pinhole": {
		            "name": "?",
		            "description": "U/D, C/S, T/B, E/νE, μ/νμ, τ/ντ, G/γ, Z/W, H, Δ/νΔ"
		        },
		        "gradient": {
		            "name": "Pozo derivado",
		            "description": "Un cubo de minado eterno. Interactúa con la mayoría de desestabilizadores y resonadores. Debe estar conectado al Abismo inverso vía conductores."
		        },
		        "chasm": {
		            "name": "El abismo inverso",
		            "description": "Un puente hacia lo desconocido."
		        },
		        "conductor": {
		            "name": "Conductor",
		            "description": "Conecta el Abismo Inverso con los silos industriales."
		        },
		        "pump": {
		            "name": "Canal de extracción",
		            "description": "Extrae recursos y los sitúa a su alrededor."
		        },
		        "pump2": {
		            "name": "Canal de excavación",
		            "description": "Una mejora del canal de extracción. Excava muchos más recursos, más rápidamente y los coloca más a su alrededor."
		        },
		        "vault": {
		            "name": "Bóveda infernal",
		            "description": "Aísla 1024 Gemas del infierno del entorno."
		        },
		        "cube": {
		            "name": "Cubo de recursos",
		            "description": "Recursos extraídos."
		        },
		        "destabilizer": {
		            "name": "Desestabilizador",
		            "description": "Colócalo junto a un cubo para romperlo el doble de rápido. Para que funcione, requiere de un Elmerine. Los desestabilizadores adicionales incrementan el efecto."
		        },
		        "destabilizer2": {
		            "name": "Desestabilizador industrial",
		            "description": "Un desestabilizador mejorado. Cuadruplica la potencia del proceso de trituración de recursos. Requiere 64 de Elmerine para funcionar. Los desestabilizadores adicionales incrementan el efecto."
		        },
		        "destabilizer2a": {
		            "name": "Desestabilizador de Gemas del infierno",
		            "description": "Mejora del Desestabilizador industrial. Incrementa la potencia del proceso de trituración de recursos 625 veces cuando hay una Gema Infernal en el cubo extraído. En caso contrario, no aporta ningún beneficio. Requiere 1 gema infernal para funcionar. Los desestabilizadores adicionales incrementan el efecto."
		        },
		        "doublechannel": {
		            "name": "Enfriador de canal",
		            "description": "Coloca esto junto a la máquina extractora de cubos para extraerlos el doble de rápido. Los enfriadores adicionales incrementan el efecto."
		        },
		        "doublechannel2": {
		            "name": "Enfriador de canal activo",
		            "description": "Un enfriador de canal mejorado. Triplica el flujo de un canal fuente si se coloca junto a él. Los enfriadores adicionales incrementan el efecto."
		        },
		        "valve": {
		            "name": "Válvula de inversión",
		            "description": "Impide que la máquina extractora de cubos regrese a su posición original si se coloca junto a ella. Para funcionar requiere una Caronita."
		        },
		        "auxpump": {
		            "name": "Bomba auxiliar",
		            "description": "Una válvula inversa mejorada. Suministra presión a un canal fuente si se coloca junto a él. Para funcionar necesita 8 de Elmerine. Las bombas adicionales no incrementan la presión en un canal fuente."
		        },
		        "auxpump2": {
		            "name": "Estación de bombeo",
		            "description": "Una bomba auxiliar mejorada. Aporta el cuádruple de presión a un canal fuente si se coloca junto a él. Para funcionar necesita 256 de Elmerine y 4 de Beta-Pylene. Las estaciones múltiples no incrementan el flujo en un canal fuente."
		        },
		        "entropic": {
		            "name": "Resonador de entropía",
		            "description": "Aplasta periódicamente los recursos si se coloca junto a un cubo. Requiere 1 de Qanetite para funcionar."
		        },
		        "entropic2": {
		            "name": "Resonador de entropía II",
		            "description": "Un resonador de entropía mejorado. Tritura los recursos 3 veces más rápido. Para funcionar requiere 1 de Chromalit."
		        },
		        "entropic2a": {
		            "name": "Condensador de entropía",
		            "description": "Un resonador de entropía mejorado. Aplasta los recursos cuando aparecen en la superficie con un 600% de potencia. Pero solo una vez por cubo. Para funcionar requiere 8 de Chromalit."
		        },
		        "entropic3": {
		            "name": "Resonador de vacío",
		            "description": "Un resonador de entropía II mejorado. Cuando se produce la aniquilación, el resonador aplasta los cubos a su alrededor con gran potencia."
		        },
		        "converter32": {
		            "name": "Tanque de enriquecimiento de Charonite",
		            "description": "Hace reaccionar lentamente la Qanetita con la Caronita para producir Elmerina."
		        },
		        "converter13": {
		            "name": "Sumidero de Charonite",
		            "description": "Recupera Qanetita de sedimentos de Charonite licuada en presencia de catalizadores."
		        },
		        "converter41": {
		            "name": "Oxidante Beta-pylene",
		            "description": "Quema Beta-Pylene para producir Charonite y trazas de otros elementos."
		        },
		        "converter76": {
		            "name": "Irradiador celeste",
		            "description": "Irradia Espuma celestial con Cromalita, convirtiendo la espuma en Cromalita, que son una gran fuente de Gemas infernales, Beta-Pileno, Qantenita y Elmerina debido a la descomposición de Cromalita."
		        },
		        "converter64": {
		            "name": "Reactor celestial",
		            "description": "Soporta la fusión controlable de Chromalits y Espuma Celestial para producir Beta-Pylene. No puede funcionar cerca de otros reactores celestiales."
		        },
		        "reflector": {
		            "name": "Reflector celestial",
		            "description": "Mejora el desempeño de un reactor celestial adyacente."
		        },
		        "mega1": {
		            "name": "Torre de transmisión de materiales",
		            "description": "Mejora la visibilidad comprimiendo los recursos en movimiento. Solo puede haber uno."
		        },
		        "mega1a": {
		            "name": "Torre de transmisión de materiales MKII",
		            "description": "Una mejora de la Torre de retransmisión de materiales. Incrementa la velocidad de transferencia de recursos. Solo puede haber uno."
		        },
		        "mega1b": {
		            "name": "Torre de transmisión de materiales MKIII",
		            "description": "Una mejora MKII de la Torre de retransmisión de materiales. Comprime aún más los recursos en movimiento. Solo puede haber uno."
		        },
		        "mega2": {
		            "name": "Torre de reciclaje",
		            "description": "Permite el reciclaje de máquinas, devolviendo el 90% de los recursos usados. Solo puede haber una."
		        },
		        "mega3": {
		            "name": "Torre de desmontaje",
		            "description": "Una torre de reciclaje mejorada. Permite el desmontaje de la máquina, devolviendo la totalidad de los recursos usados. Solo puede haber una."
		        },
		        "voidsculpture": {
		            "name": "Presbiterio de admiración vacío",
		            "description": "Te permite ignorar las desventajas visuales de las máquinas de vacío."
		        },
		        "eye": {
		            "name": "Director de llenado",
		            "description": "Indica que máquinas listas para el llenado. Solo puede haber uno."
		        },
		        "cookie": {
		            "name": "Una galleta",
		            "description": "¿Cómo llegó allí?"
		        },
		        "injector": {
		            "name": "Inyector de gemas del infierno",
		            "description": "Intercambia un recurso aleatorio de un cubo adyacente con una Gema del Infierno si no hay ninguna. Tiene 32 cargas si se proveen 32 Gemas del Infierno y 64 Qanetite."
		        },
		        "silo": {
		            "name": "Silo subterráneo",
		            "description": "Al activarse, se recargarán las máquinas cercanas y luego se volverán a cargar automáticamente 16 edificios más."
		        },
		        "silo2": {
		            "name": "Silo industrial",
		            "description": "Una mejora del Silo subterráneo. Al activarse, se recargarán las máquinas cercanas y luego se recargarán automáticamente 64 edificios más."
		        },
		        "vessel": {
		            "name": "Recipiente de contención",
		            "description": "Almacena 32 Chromalits, impidiendo su fisión. Consume una Gema del Infierno."
		        },
		        "vessel2": {
		            "name": "Silo de contención",
		            "description": "Recipiente de contención mejorado. Almacena 32768 Chromalits impidiendo su fisión. Consume Realidad."
		        },
		        "consumer": {
		            "name": "Refinería catalítica",
		            "description": "Consume recursos rotos adyacentes. Después de acumular 1024 recursos, libera todo con un bonus adicional. La cantidad del bonus aumenta con cada liberación consecutiva, llegando hasta el 100%. Si no se consumen recursos en 16 segundos, el efecto se reinicia."
		        },
		        "preheater": {
		            "name": "Precalentador catalítico",
		            "description": "Incrementa la velocidad de cualquier máquina de conversión de recursos si se coloca junto a una. Cada conversor incrementa el impulso de velocidad del precalentador, hasta un 300%, si 8 máquinas son afectadas."
		        },
		        "hollow": {
		            "name": "Afloramiento hueco",
		            "description": "Muchos agujeros."
		        },
		        "strange": {
		            "name": "Roca hueca",
		            "description": "Al parecer lleva ahí un tiempo."
		        },
		        "strange1": {
		            "name": "Sitio de investigación de roca hueca",
		            "description": "Hace que la Espuma Celestial se aniquile con 512 Gemas del Infierno en lugar de 64. NORTE."
		        },
		        "strange2": {
		            "name": "Instalación de roca hueca",
		            "description": "Duplica la cantidad máxima de piedras huecas e incrementa su tasa de aparición."
		        },
		        "strange3": {
		            "name": "Hueco reconstruido",
		            "description": "Incrementa de manera drástica la tasa de aparición de piedra hueca y lo hace todo en silencio."
		        },
		        "generaldecay": {
		            "name": "Reactor de descomposición general",
		            "description": "Mejora de manera drástica el rendimiento de la descomposición de Chromalit. Solo puede haber uno."
		        },
		        "waypoint": {
		            "name": "Punto de referencia",
		            "description": "Te teletransporta al siguiente punto de referencia hacia ti."
		        },
		        "annihilator": {
		            "name": "Aniquilador",
		            "description": "Genera vacío cuando las Gemas del Infierno se aniquilan con espuma celestial. Requiere una piedra hueca para operar."
		        },
		        "flower": {
		            "name": "Flor hueca",
		            "description": "Disminuye la probabilidad de distorsión temporal. Contrarresta el efecto de una piedra hueca. Debe construirse sobre una piedra hueca. Destruye la piedra hueca sobre la que se construyó."
		        },
		        "fruit": {
		            "name": "Fruta hueca",
		            "description": "Una evolución de la flor hueca. Impide la formación de piedras huecas para nutrirse. Genera piedras huecas."
		        },
		        "eraser": {
		            "name": "Demoler",
		            "description": "Destruye una máquina devolviendo el 50% de los recursos usados para construirla."
		        },
		        "eraser2": {
		            "name": "Reciclar",
		            "description": "Destruye una máquina devolviendo el 90% de los recursos usados para construirla."
		        },
		        "eraser3": {
		            "name": "Desmontar",
		            "description": "Desmonta una máquina devolviendo todos los recursos usados para construirla."
		        },
		        "clicker1": {
		            "name": "Oscilador de Qantenita",
		            "description": "Permite mantener el clic pulsado para romper recursos. Solo puede haber uno."
		        },
		        "clicker2": {
		            "name": "Oscilador de Gema infernal",
		            "description": "Una mejora del oscilador de Qanetite. Aumenta la frecuencia de oscilación. Solo puede haber uno."
		        },
		        "clicker3": {
		            "name": "Oscilador de Chromalit",
		            "description": "Una mejora del oscilador de Gemas infernales. Maximiza la frecuencia de oscilación. Solo puede haber uno."
		        },
		        "stabilizer": {
		            "name": "Estabilizador",
		            "description": "Estabiliza una sobrecarga adyacente para aprovechar temporalmente su potencia."
		        },
		        "stabilizer2": {
		            "name": "Estabilizador II",
		            "description": "Una mejora para el estabilizador. Mejora la estabilidad y el rendimiento."
		        },
		        "stabilizer3": {
		            "name": "Estabilizador destrozado",
		            "description": "Actualización anómala. Mejora el rendimiento y maximiza la estabilidad. Solo puede haber una."
		        }
		    },
		    "messages": [
		        "¿Dónde estás?",
		        "Estoy literalmente en medio de la nada",
		        "De acuerdo, ¿qué ves?",
		        "Bueno, no mucho. Está esta máquina de aquí, parece algo familiar pero no puedo identificarla claramente",
		        "¿Qué máquina?",
		        "Espera, tal vez yo pueda...",
		        "Espera, ¡dime que NO estás tocando una máquina cualquiera en este momento!",
		        "¡Funciona! Acaba de crear algo",
		        "???",
		        "Un enorme cubo negro. Es muy suave. Realmente quiero romperlo",
		        "¿Estás drogado?",
		        "¡Ahora tengo 64 piedras!",
		        "Bien, de acuerdo entonces. Diviértete con eso.",
		        "¡Eh, encontré una piedra amarilla!",
		        "¡Bien por ti, amigo!",
		        "Creo que ahora puedo construir máquinas. Debería construir algo para romper estos cubos con mayor facilidad. Si un cubo aparece en una celda adyacente, incluso en diagonal, debería funcionar.",
		        "Espera, ¿estás practicando algún juego raro? Estás empezando a asustarme",
		        "Ahora, solo necesito introducir una piedra amarilla dentro de esta máquina.",
		        "Lo que te haga feliz... Bromas aparte ¿vendrás hoy?",
		        "¡Definitivamente! Estaré allí en unas horas, solo necesito terminar esto.",
		        "¿Qué estás haciendo exactamente?",
		        "Te enviaré un mensaje más tarde. Necesito seguir accionando la máquina, lo siento.",
		        "Creo que las máquinas interactúan entre sí cuando se colocan en celdas adyacentes o diagonales. Por ejemplo, este ventilador debe colocarse junto a la primera máquina para acelerar el proceso.",
		        "Estás siendo muy sensato en este momento",
		        "¿Y bien?",
		        "¿Dónde estás?",
		        "Te hemos estado esperando por años.",
		        "¿Qué quieres decir? Aún estoy aquí.",
		        "¿¿¿DÓNDE???",
		        "Ahora tengo una piedra azul. ¿O es púrpura? Parece un candelabro de latón antiguo. Creo que podría usarlo para quitar máquinas mal ubicadas.",
		        "¿Me estás tomando el pelo? Pensé que habías dicho que vendrías. ¡¿Qué demonios?!",
		        "Tranquilo, estaré allí en un minuto",
		        "Vaya, ¡puedo utilizar [Q] para clonar máquinas o destruirlas dando clic primero en una celda libre! Y [Alt] ayuda a ver detrás de las máquinas altas.",
		        "CHOP CHOP",
		        "¿Siguen ahí?",
		        "¡¡¡SANTO CIELO!!!",
		        "¿¿¿¿Dónde estás????",
		        "¿¿Estás bien??",
		        "????",
		        "¿Qué demonios?",
		        "¿ESTÁS BIEN? ¿DÓNDE TE ENCUENTRAS?",
		        "¡Tranquilo! Estoy bien, ¿qué pasa?",
		        "¡Tú dime! Me has estado ignorando durante dos semanas. Incluso fui a tu casa varias veces, pero no estabas allí. Solo dime dónde estás, eso es todo. ¿Te encuentras en casa en este momento?",
		        "Amigo, ¿de qué hablas? Nos hemos estado escribiendo hace literalmente dos minutos.",
		        "¿¿¿QUÉ TE PASA??? Primero no te dejaste ver, luego desapareciste por completo. ¡Y ahora actúas como si nada hubiera pasado!",
		        "Te estoy haciendo una pregunta sencilla",
		        "¿DÓNDE ESTÁS?",
		        "Estoy aquí.",
		        "D Ó N D E",
		        "Espera...",
		        "No es gracioso. ¿Dónde te encuentras exactamente? ¿Puedes decírmelo?",
		        "Bueno...",
		        "Amigo, en realidad no lo sé.",
		        "Dame un minuto",
		        "¿Qué quieres decir con que no sabes?",
		        "Necesito poner en orden mis pensamientos",
		        "¿Está todo bien? ¿Estás a salvo? ¿Debería llamar a alguien?",
		        "No, estoy bien. Yo solo...",
		        "Te enviaré un mensaje en un momento",
		        "Maldita sea. ¿Qué está pasando?",
		        "Tengo miedo",
		        "Al parecer no sé dónde estoy",
		        "Esto es muy extraño. Quiero decir, todo está bien para mí. Pero no puedo describir este lugar.",
		        "Es como un sueño, pero al mismo tiempo no lo es. Todo es blanco y están estas máquinas. Y cubos. Esto no tiene sentido alguno.",
		        "No estoy drogado ni nada por el estilo. Simplemente me di cuenta de lo extraño que es que nunca haya notado que esto no se parece a nada que haya visto antes.",
		        "Ahora tengo piedras rojas y es un poco inquietante que yo esté totalmente bien con todo esto. Ok, solo una piedra roja, todo está bien.",
		        "Así que no estás bromeando...",
		        "Entiendo cómo suena todo ahora. Pero sí, todo está aquí ante mis ojos.",
		        "¿Puedo hacer algo por ti?",
		        "Solo habla conmigo, eso es todo.",
		        "Puedo hacerlo amigo, puedo hacerlo. Por cierto, la policía te está buscando. Como si hubieras desaparecido.",
		        "¿Les mostraste nuestros textos?",
		        "¿Cómo ayudaría eso? No, activé la eliminación automática.",
		        "¡Gracias!",
		        "¿Cómo está todo por allá?",
		        "Bueno, yo puedo moverme utilizando las teclas WASD. Pero no hay nada interesante por aquí, excepto esta extraña roca hacia el norte.",
		        "¡Entonces, la brújula de tu teléfono funciona allá!",
		        "Bueno, está justo 'arriba' desde aquí, así que supongo que ese es el norte.",
		        "Tiene sentido",
		        "Y lo curioso es que no tengo teléfono...",
		        "Entonces, ¿cómo me envías mensajes de texto?",
		        "¡No lo sé! Solo sé cuándo me envías mensajes. ¡Y puedo responderte! No es sencillo de explicar.",
		        "No te preocupes. Podemos hablar y eso de por sí ya es muy bueno.",
		        "Sí, tienes razón.",
		        "Entonces... Háblame de las máquinas",
		        "¿A qué te refieres?",
		        "¿Qué son, qué hacen, cómo funcionan?",
		        "Bueno, lucen elegantes, con algunos cables, alambres y cosas así",
		        "Por ejemplo, uno parece una gran caja de plástico con una bobina de cobre en la parte superior, donde va una piedra azul. Y hay una gran etiqueta que dice \"E—01SR\" en el lateral, con una etiqueta más pequeña que dice \"¡Precaución! Radiación de entropía fuerte\"",
		        "¿Qué significa eso?",
		        "No lo sé realmente. Supongo que allí hay algo de radiación de entropía.",
		        "Espera, ¿yo pensé que tú hacías estas máquinas?",
		        "Correcto... Entiendo tu punto.",
		        "Solo las hago de alguna manera a partir de cubos. Pero no sé qué hay dentro. Sí, suena extraño, déjame pensar en esto.",
		        "Y por cierto, al parecer las piedras amarillas y azules no son infinitas, así que debería invertir en esos convertidores o en una nueva mina.",
		        "Suena como un plan",
		        "¡Qué dolor de cabeza!",
		        "¿Eh?",
		        "¡Una piedra verde! Toma una eternidad romperla. Tendré que idear algo si siguen apareciendo.",
		        "¡Estoy seguro de que fabricarás alguna máquina elegante para eso!",
		        "¡Por supuesto!",
		        "¡Demonios sí! Gemas del infierno, cuidado.",
		        "¡Dales su merecido!",
		        "¿Recuerdas que preguntaste por las máquinas?",
		        "Sí",
		        "No creo que sean reales",
		        "¿Qué se supone que debe significar eso?",
		        "Es como en un sueño. No puedo mirar dentro ni tampoco verlos desde el otro lado.",
		        "Una vaga representación de una tecnología inexplicable",
		        "Creo que estas máquinas tienen este aspecto debido a cómo percibo su función.",
		        "Al igual que si algo tala árboles, ¿debería parecer un hacha?",
		        "Si, algo así",
		        "Bueno, al menos eso se oye bastante real",
		        "Sí, supongo que tú eres lo único real para mí ahora mismo",
		        "¡Tengo algunos cubos nuevos, que se están descomponiendo en otros cubos!",
		        "Bueno, ni genial, ni terrible",
		        "Tengo que decir algo muy extraño",
		        "¿Ves ironía en lo que acabas de escribir?",
		        "Tal vez sea por este extraño lugar, pero por alguna razón olvidé tu nombre",
		        "Bueno, entonces supongo que podríamos pasar un poco más de tiempo juntos",
		        "Lo digo en serio",
		        "Me llamo Duke Nukem, obviamente.",
		        "¡Amigo, ya basta!",
		        "¡Eso es lo que ella dijo!",
		        "¡Esto es estúpido! Deja de asustarme. ¿Qué es lo que sucede?",
		        "Maldición",
		        "Parece que no puedo recordar ni mi propio nombre",
		        "¡Simplemente no puedo! Es una completa locura. ¡Y no puedo recordar tu nombre!",
		        "¿Tal vez sea un caso de histeria colectiva? Escuché que puede afectar a varias personas a la vez. Calmémonos y veamos qué pasa.",
		        "Sí, claro, histeria",
		        "Todavía no recuerdo los nombres",
		        "Yo tampoco. Y hay más",
		        "¡Sí! ¿Cómo era mi aspecto? ¿Cuándo nos conocimos?",
		        "¿Cómo es mi casa, quiénes son nuestros amigos? ¿Nos conocemos?",
		        "Parece que ambos estamos atrapados en la misma situación. Y ni siquiera puedo decir si siempre ha sido así o si algo sucedió en algún momento. ¿Es este algún tipo de sueño extraño? ¿Y quién está soñando?",
		        "¿Hay alguna máquina cerca? ¿Quizás un cubo surgió de algún lugar?",
		        "Divertido",
		        "Bueno, pensemos en algunos nombres para nosotros.",
		        "Tú suenas como Veen",
		        "Por qué no",
		        "No tengo nada en contra de Veen",
		        "Hola, Veen. ¿Te gustarían algunos frijoles, Veen? Sí, suena bien.",
		        "Y tú serás Charps",
		        "¿Tienes arpas afiladas, Charps?",
		        "¡Eso no tiene sentido!",
		        "Me agrada Charps. Me da gusto conocerte, Veen",
		        "Lo mismo digo, Charps",
		        "QUÉ ESTÁ PASANDO",
		        "¿Qué?",
		        "¡Cubos blancos! ¡Están destruyendo a los verdes!",
		        "¡También muchos cubos en descomposición! ¡Es como estar en un reactor nuclear!",
		        "Maldita sea, ¿te encuentras bien?",
		        "¡Sí, estoy bien! Por ahora esto es un desastre. Tengo que construir algo para solucionarlo. Tal vez debería dar otro vistazo a una roca en el norte.",
		        "¡Eso es lo que siempre haces, Charps!",
		        "¡Suena extraño!",
		        "Quiero decir, mi nombre sí. Supongo que me acostumbraré en algún momento. ¿Verdad, Veen?",
		        "¡Sí! Realmente extraño.",
		        "¿Recuerdas que te hablé de una extraña roca en el norte?",
		        "En realidad, no",
		        "Bueno, está esta roca. Y no me malinterpretes, me doy cuenta de que todo aquí es raro. Pero esta roca se siente mucho más extraña que cualquier otra cosa.",
		        "No puedo entenderlo. Pero ahora que decidí hurgar un poco, ¡cambió algo en las reglas del propio Universo!",
		        "¿Es peligroso?",
		        "No lo sé. El cambio es sutil.",
		        "Me pregunto qué más puede hacer.",
		        "De acuerdo, solo asegúrate de no destruir el Universo accidentalmente.",
		        "Haré lo mejor que pueda.",
		        "¡Bueno, ESA fue la roca más dura de mi vida! Pero creo que ahora sé cómo quebrarla más rápido.",
		        "¿Tienes una piedra nueva?",
		        "Sí, la más extraña hasta ahora",
		        "¡Vaya, quizás el efecto en el Universo no fue tan sutil! ¿Puedes sentirlo?",
		        "¿Sentir qué?",
		        "Bueno, quizás sea solo yo.",
		        "Por casualidad, ¿viste un enorme cubo delante de ti ahora mismo?",
		        "Uh, ¿una nevera cuenta?",
		        "Ah, no importa",
		        "Vaya, este nuevo cubo es completamente negro. Y se siente como de otro mundo.",
		        "¿Más extraño que el anterior?",
		        "¡Es distinto! Está helado, pero no de manera dañina. Como si no existiera el concepto de temperatura y no interactúa contigo. No está hecho de materia, no tiene color o nada familiar, si es que tiene sentido para ti.",
		        "Francamente, no.",
		        "Creo que entiendo. Puedo usar piedras huecas para condensar esa sustancia negra de la nada. Se forman cristales extrañamente idénticos, pero sin ninguna propiedad. Y eso de alguna manera arregla anomalías en el Universo.",
		        "Suena como un filtro de aire",
		        "Sí, ¡exactamente! Al parecer en algún momento y de alguna manera contaminé el aire.",
		        "No tienes que decirlo en voz alta",
		        "He decidido desenterrar esa extraña roca. Tal vez haya una respuesta a lo que está sucediendo dentro. ¡Siento que no solo está causando estragos en todo, sino que también puede controlarlo todo de alguna manera!",
		        "¿Por qué crees eso?",
		        "¿Me creerías si digo que lo percibo?",
		        "¡Claro! Creo que creería en cualquier cosa en este momento. ¿Una roca que controla el Universo? ¡Por qué demonios no!",
		        "¡Creo que estoy sufriendo un ataque!",
		        "Por favor, no",
		        "Estas máquinas se están volviendo muy ruidosas y parpadeantes. Tal vez debería ajustar algo para solucionarlo. O ajustarme a mí mismo. O ambos.",
		        "¡Ahora si estamos hablando!",
		        "Entonces, ¿qué ajustaste?",
		        "Espera, algo anda mal.",
		        "Construí algo con esa sustancia negra. Y no es una máquina. Pero le hizo algo a los puntos de referencia.",
		        "¿Qué son los puntos de referencia?",
		        "Mueven el Universo a tu alrededor, así es como llegas a distintos lugares.",
		        "¿Cómo sabes que mueven el Universo y no tú?",
		        "Hmm, no lo había considerado",
		        "Creo que rompí el Universo",
		        "¡Nada de esto tiene sentido!",
		        "Las máquinas no tienen sentido, nada lo tiene.",
		        "Espero poder arreglar esto",
		        "¿Veen?",
		        "Amigo, ¿estás ahí?",
		        "¡Por favor, por favor, por favor, no eso! Espero que simplemente hayas ido a hacer pis o algo así.",
		        "¡VEEN!",
		        "¿QUÉ?",
		        "Aun así es extraño.",
		        "¡Oh, gracias a Dios!",
		        "¿Construiste algo nuevo?",
		        "¡Yo pensé que había roto el Universo y que te habías ido para siempre! Estaba en un mundo de sombras con algunos símbolos alrededor y pensé que eran las ruinas del Universo. Pero es otro Universo o una versión distinta de este porque se parecen, y ahora se encuentran conectados.",
		        "Explorando, ¿eh? ¡Parece divertido!",
		        "¿Divertido? ¿Siquiera leíste mi texto? ¡¡¡OTRO UNIVERSO!!!",
		        "Tienes que aceptar que estás perdiendo la capacidad de sorprenderme.",
		        "Me parece bien",
		        "No es una roca, es una lente",
		        "Puede hacer que todo converja en un único punto. ¡Y quiero decir todo! Espacio, tiempo, todos los conceptos y normas. ¡Todo!",
		        "¿Encontraste un manual o algo parecido?",
		        "No sé por qué está ahí ni por qué estamos aquí. Simplemente sé, de alguna manera, lo que hace ahora.",
		        "Entonces... ¿Vas a hacer que todo converja o qué?",
		        "No sé cómo. Pero tal vez ese sea el propósito de este lugar. Ahora solo flota en el aire como si eso fuera lo que se supone que debe hacer.",
		        "¿Y qué ocurre después?",
		        "Ni idea",
		        "Cuanto más lo pienso, más comprendo que no son únicamente tus máquinas las que no son reales.",
		        "Procuro hacerme preguntas concretas y no encuentro respuestas.",
		        "¿Recuerda que mencioné que la policía te buscaba? No estaba bromeando. Pero ahora todo se desmorona cuando me hago preguntas.",
		        "¿Vine a esta comisaría de policía o los llamé? ¿Y quién estaba allí? ¿Policías? ¿Dónde está esa comisaría en la ciudad? ¿Qué ciudad es esta? ¿Vivo en esta ciudad? ¿Cuál es el nombre de la ciudad? ¿Y en qué estado está? ¿O hay algún estado?",
		        "No puedo responder ni una sola pregunta. Todo parecía normal hasta que empecé a preguntar. Tengo miedo de hacer más preguntas.",
		        "Lo siento",
		        "No, no es en absoluto tu culpa. Por lo que veo, estamos en el mismo barco.",
		        "Solo espero que descubras qué barco es este.",
		        "¡Sí yo también!",
		        "Veamos cómo termina. Solo espero que esto no sea algún tipo de infierno o limbo eterno.",
		        "¡Muéstrales, Dante!",
		        "Ahora estamos hablando. ¡Estos tipos deberían drenar todo este Universo!",
		        "Suenas como una compañía petrolera",
		        "Estoy cansado de ajustarlo todo para que sea algo más eficiente y estoy hastiado del ruido. Esta máquina debería cambiarlo todo. Incluso está atravesando el otro lado.",
		        "¿No es peligroso?",
		        "La idea de peligro aquí es bastante difusa.",
		        "Creo que es hora de hacer algo grande.",
		        "¿Qué tienes en mente?",
		        "No estoy seguro. ¡Pero debería ser algo grande!",
		        "¿Como una máquina gigante?",
		        "No, hablo metafóricamente",
		        "¡Entonces, hazlo!",
		        "Oh maldición",
		        "Hice algo mal. El abismo inverso está destruido. Todo se está colapsando.",
		        "¿Te encuentras bien?",
		        "Sí, pero las máquinas están siendo destruidas. ¡No puedo construir nada! ¡Maldición!",
		        "¡Espera! ¿Quizás eso debía suceder?",
		        "¡NO! ¡No es así!",
		        "¿Cómo lo sabes?",
		        "Espera, tengo que solucionar esto de algún modo",
		        "¡Aquí no ocurre nada!",
		        "¡Ya te veo! Acabas de pasar junto a un enorme castaño, en ese curioso planeta en el brazo superior de la galaxia de ahí.",
		        "¡No! ¿Qué galaxia?",
		        "Oh, es difícil decir la hora exacta, quizás aún no haya sucedido. ¡Pero espera 15 mil millones de años!",
		        "Estás siendo muy sensato ahora mismo. ¿Por cierto, vas a venir?",
		        "¡Definitivamente! Estaré allí en unas pocas horas, solo necesito terminar algunas cosas.",
		        "¡De acuerdo, nos vemos entonces!",
		        "Pero por favor, Charps",
		        "Esta vez no llegues tarde",
		        "¡No lo haré, Veen, no lo haré!"
		    ],
		    "credits": [
		        "El inicio",
		        "Aprecio mucho que hayas llegado hasta el final, donde todo comienza",
		        "¡Felicidades, supongo!",
		        "Solo mira esto:",
		        "Total de recursos extraídos:",
		        "Charonites:",
		        "Elmerines:",
		        "Qanetites:",
		        "Beta-Pylenes:",
		        "Gemas del infierno:",
		        "Chromalits:",
		        "Espuma celestial:",
		        "Piedras huecas:",
		        "Vacíos:",
		        "Realidades:",
		        "Máquinas construidas:",
		        "Máquinas destruidas:",
		        "Profundidad máxima del canal en metros:",
		        "Roca extraña tocada:",
		        "Veces teletransportado:",
		        "Clics en el cubo:",
		        "Distorsiones temporales:",
		        "Tiempo de juego:",
		        "h",
		        "Juego creado por:<br>Oleg Danilov",
		        "Gráficos adicionales:<br>Yulia Nogteva",
		        "Edición de diálogos:<br>Abdurahman Zulumhanov y Anna Peterson",
		        "Publicación en Steam:<br>Playsaurus",
		        "Pruebas del juego:<br>Comunidad de Leprosorium, Abdurahman Zulumhanov, Playsaurus",
		        "FIN",
		        "Puedes ir y jugar a Cookie Clicker o algo así ahora.",
		        "Música:<br>Shallow Anne de Jake Chudnow",
		        "Deutsch: flex 4711, Patrick Karban",
		        "Português: selfemcrowdin, Mateus Iamarino",
		        "Italiano: doralum",
		        "Español: armangar, Syunay Kamenov",
		        "Français: KjetilVion, Etienne Samson, William (Ekitchi)",
		        "Nederlands: lievevandyck",
		        "Čeština: Jakub Strelinger",
		        "Polski: PolglishPL",
		        "日本語: Winna Tolentino",
		        "한국어: Ah Lon Sin, Sumin Park, Cyberowl",
		        "简体中文：Daisy Chan, kevinlee7, YuLun",
		        "繁體中文: Daisy Chan, kevinlee7",
		        "ไทย: They say P, Phimze Pym",
		        "Magyar: Simon Dániel és Márton-Mezey Csenge",
		        "Latviešu valoda: Roberts Artūrs Bumburs (Arburo)",
		        "Română: Eric Apetrei"
		    ],
		    "explainer": [
		        "Pulsa y mantén pulsado.",
		        "Siempre haz clic en la celda de abajo.",
		        "<span class=\"keyboard\">Q</span>, <span class=\"keyboard\">Esc</span> o clic derecho para cancelar.",
		        "Mantén pulsado <span class=\"keyboard\">Alt</span> para observar más de cerca.",
		        "Pulsa <span class=\"keyboard\">Q</span> sobre una celda vacía para seleccionar una herramienta de demolición.",
		        "Pulsa <span class=\"keyboard\">Q</span> sobre una máquina para intentar construir una más.",
		        "WASD o clic derecho y arrastra para mirar alrededor."
		    ],
		    "random": {
		        "paste": "Se ha copiado un código al portapapeles. Ahora pégalo en algún lugar seguro.",
		        "toolate": "Es muy tarde para salvar algo. Todo ya sucedió.",
		        "existed": "NUEVO",
		        "steamWarning": "Error de Steam. El guardado automático y los logros no funcionarán. Prueba reiniciar el juego."
		    }
		},
		cz: {
		    "splash": {
		        "sixtyfour": "SIXTY&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FOUR",
		        "continue": "<span>POKRAČOVAT</span><div class=\"keyboard\">Esc</div>",
		        "start": "<span>ZAČAT</span><div class=\"keyboard\">Esc</div>",
		        "soundoff": "ZVUK JE VYPNUTÝ",
		        "soundon": "ZVUK JE ZAPNUTÝ",
		        "save": "ULOŽIT",
		        "load": "NAČÍST",
		        "language": "JAZYK: ČEŠTINA",
		        "reset": "RESETOVAT",
		        "credit": "©2024 Oleg Danilov, vydal Playsaurus. Verze",
		        "warning": "Přijdeš o všechno, to si nedělám legraci. Drž se, aby ses zavázal.",
		        "glory": "ÚSPĚCHY",
		        "deglory": "ZPĚT",
		        "quit": "UKONČIT",
		        "export": "Exportovat",
		        "import": "Importovat",
		        "flashbang": "Svítivá blikající světla jsou součástí této hry. Pokud jste na ně citliví, můžete zvážit vypnutí blikání kliknutím na tuto ikonu."
		    },
		    "achievements": [
		        {
		            "name": "Bláznovo zlato",
		            "description": "Pořiďte si Elmerine"
		        },
		        {
		            "name": "Deep Purple",
		            "description": "Získejte Qanetite"
		        },
		        {
		            "name": "Krev země",
		            "description": "Získejte Beta-Pylene"
		        },
		        {
		            "name": "Zelená energie",
		            "description": "Najděte pekelný klenot"
		        },
		        {
		            "name": "Horké sklo",
		            "description": "Najděte Chromalit"
		        },
		        {
		            "name": "Posvátný beton",
		            "description": "Pořiďte si nebeskou pěnu"
		        },
		        {
		            "name": "Umí to mýt nádobí?",
		            "description": "Získejte dutý kámen"
		        },
		        {
		            "name": "Tam, kde slunce nesvítí",
		            "description": "Pořiďte si Prázdnotu"
		        },
		        {
		            "name": "Koho zavoláš?",
		            "description": "Buďte realistický"
		        },
		        {
		            "name": "Nietzsche",
		            "description": "Zahleďte se do propasti 64krát"
		        },
		        {
		            "name": "64K",
		            "description": "Získejte 64 000 kamenů"
		        },
		        {
		            "name": "64M",
		            "description": "Získejte 64 000 000 kamenů"
		        },
		        {
		            "name": "64B",
		            "description": "Získejte 64 000 000 kamenů"
		        },
		        {
		            "name": "Nyní můžete resetovat",
		            "description": "Uvízněte na začátku"
		        },
		        {
		            "name": "Perpetum shmobile",
		            "description": "Dejte dohromady dvě sila"
		        },
		        {
		            "name": "Potřebujete si odpočinout?",
		            "description": "Hrajte 64 hodin"
		        },
		        {
		            "name": "Musí...byt zničen",
		            "description": "Klikněte na kostku 6400 krát"
		        },
		        {
		            "name": "Architekt",
		            "description": "Postavte 64 strojů"
		        },
		        {
		            "name": "Ničitel",
		            "description": "Zničte 64 strojů"
		        },
		        {
		            "name": "Hellraiser",
		            "description": "Mějte 9 Pekelných trezorů"
		        },
		        {
		            "name": "Konec/Začátek",
		            "description": "Prolomte inverzní propast"
		        },
		        {
		            "name": "Klikač na sušenky",
		            "description": "Klikněte na sušenku"
		        },
		        {
		            "name": "Opilý námořník",
		            "description": "Zatrubte 64krát bez důvodu"
		        },
		        {
		            "name": "Pan Mine",
		            "description": "Mít 9 vykopávacích kanálů"
		        },
		        {
		            "name": "Existuje nějaký limit?",
		            "description": "Kopejte do hloubky 64 km"
		        },
		        {
		            "name": "Seth Brundle",
		            "description": "Teleport <s>1</s> 64 krát"
		        },
		        {
		            "name": "Červeno-modrá skála",
		            "description": "Dokončete hru, aniž byste cokoli smazali po dobu 15 minut a mějte méně než 15 zásobních sil"
		        },
		        {
		            "name": "Rovnou do pekla!",
		            "description": "Získejte pekelný drahokam během prvních 64 minut od začátku hry."
		        },
		        {
		            "name": "Po povrchu",
		            "description": "Kopání v hloubce 64 metrů"
		        },
		        {
		            "name": "Je to horké?",
		            "description": "Kopejte do hloubky 640 metrů"
		        },
		        {
		            "name": "Příliš hluboko",
		            "description": "Kopejte do hloubky 6400 metrů"
		        },
		        {
		            "name": "64 kmph dolů",
		            "description": "Dosažení hloubky 6400 m do 6 minut od položení čerstvého výkopového kanálu"
		        },
		        {
		            "name": "Neofobie",
		            "description": "Dokončete hru bez jakéhokoli vylepšení extrakčních kanálů"
		        }
		    ],
		    "resources": [
		        "Charonit",
		        "Elmerine",
		        "Qanetite",
		        "Beta-Pylen",
		        "Pekelný drahokam",
		        "Chromalit",
		        "Nebeská pěna",
		        "Dutý kámen",
		        "Prázdno",
		        "Realita"
		    ],
		    "entities": {
		        "pinhole": {
		            "name": "?",
		            "description": "U/D, C/S, T/B, E/νE, μ/νμ, τ/ντ, G/γ, Z/W, H, Δ/νΔ"
		        },
		        "gradient": {
		            "name": "Gradientní studna",
		            "description": "Věčně těžitelná kostka. Reaguje na většinu destabilizátorů a rezonátorů. Měla by být připojena k inverzní propasti pomocí vodičů."
		        },
		        "chasm": {
		            "name": "Inverzní propast",
		            "description": "Most do neznáma."
		        },
		        "conductor": {
		            "name": "Vodič",
		            "description": "Propojuje inverzní studnu s průmyslovými silami."
		        },
		        "pump": {
		            "name": "Extrakční kanál",
		            "description": "Získává zdroje a umísťuje je všude kolem sebe."
		        },
		        "pump2": {
		            "name": "Vykopávací kanál",
		            "description": "Upgrade extrakčního kanálu. Rychle vytěží velké množství surovin a umístí je dále kolem sebe."
		        },
		        "vault": {
		            "name": "Pekelný trezor",
		            "description": "Izoluje 1024 pekelných drahokamů z prostředí."
		        },
		        "cube": {
		            "name": "Zdrojová kostka",
		            "description": "Vytěžené zdroje."
		        },
		        "destabilizer": {
		            "name": "Destabilizátor",
		            "description": "Umístěte jej vedle kostky, abyste ji rozbili dvakrát rychleji. K provozu vyžaduje Elmerine. Další destabilizátory účinek zvyšují."
		        },
		        "destabilizer2": {
		            "name": "Průmyslový destabilizátor",
		            "description": "Vylepšení destabilizátoru. Čtyřnásobně zvyšuje výkon procesu drcení zdrojů. K provozu je potřeba 64 Elmerinů. Další destabilizátory zvyšují účinek."
		        },
		        "destabilizer2a": {
		            "name": "Destabilizátor pekelného drahokamu",
		            "description": "Modernizace průmyslového destabilizátoru. Zvyšuje výkon procesu drcení surovin 625-krát, pokud je v extrahované kostce přítomen pekelný drahokam. V opačném případě nepřináší žádný užitek. K provozu vyžaduje 1 Pekelný Drahokam. Další destabilizátory účinek zvyšují."
		        },
		        "doublechannel": {
		            "name": "Chladič kanálu",
		            "description": "Umístěte jej vedle stroje na extrakci kostek, k získáni kostek dvakrát rychleji. Další chladiče tento efekt ještě zvyšují."
		        },
		        "doublechannel2": {
		            "name": "Aktivní kanálový chladič",
		            "description": "Upgrade chladiče kanálu. Ztrojnásobí průtok ve zdrojovém kanálu, pokud je umístěn vedle něj. Další chladiče tento účinek zvyšují."
		        },
		        "valve": {
		            "name": "Zpětný ventil",
		            "description": "Zabraňuje stroji na extrakci kostek v návratu do původní pozice, pokud je umístěn vedle něj. K provozu vyžaduje Charonit."
		        },
		        "auxpump": {
		            "name": "Pomocné čerpadlo",
		            "description": "Upgrade zpětného ventilu. Poskytuje tlak na zdrojový kanál, pokud je umístěn vedle něj. K provozu je potřeba 8 Elmerine. Přídavná čerpadla nezvyšují tlak ve zdrojovém kanálu."
		        },
		        "auxpump2": {
		            "name": "Čerpací stanice",
		            "description": "Modernizace pomocného čerpadla. Poskytuje čtyřnásobný tlak do zdrojového kanálu, pokud je umístěn vedle něj. K provozu je zapotřebí 256 elmerinů a 4 beta-pylenů. Více stanic nezvyšuje průtok ve zdrojovém kanálu."
		        },
		        "entropic": {
		            "name": "Entropický rezonátor",
		            "description": "Pravidelně drtí suroviny, pokud je umístí vedle kostky. K provozu vyžaduje Qanetite."
		        },
		        "entropic2": {
		            "name": "Entropický rezonátor II",
		            "description": "Upgrade entropického rezonátoru. Drtí zdroje 3krát rychleji. K provozu vyžaduje Chromalit."
		        },
		        "entropic2a": {
		            "name": "Entropický kondenzátor",
		            "description": "Upgrade entropického rezonátoru. Rozdrtí zdroje v okamžiku, kdy se objeví na povrchu, s 600% silou. Ale jen jednou na kostku. K provozu je potřeba 8 Chromalitů."
		        },
		        "entropic3": {
		            "name": "Rezonátor prázdnoty",
		            "description": "Vylepšení entropického rezonátoru II. Když dojde k anihilaci, rezonátor drtí kostky kolem sebe obrovskou silou."
		        },
		        "converter32": {
		            "name": "Kádě na obohacování charonitu",
		            "description": "Pomalu reaguje quanetit s charonitem za vzniku elmerinu."
		        },
		        "converter13": {
		            "name": "Charonitová jímka",
		            "description": "Regeneruje Qanetit ze zkapalněných sedimentů Charonitu za přítomnosti katalyzátorů."
		        },
		        "converter41": {
		            "name": "Beta-pylenový oxidant",
		            "description": "Spaluje beta-pylen za vzniku charonitu a stopových množství dalších prvků."
		        },
		        "converter76": {
		            "name": "Nebeský ozařovač",
		            "description": "Ozařuje nebeskou pěnu chromalitem, čímž ji přeměňuje na chromality, které jsou díky rozpadu chromalitů skvělým zdrojem pekelných drahokamů, beta-pylenu, qanetitu a elmerinu."
		        },
		        "converter64": {
		            "name": "Nebeský reaktor",
		            "description": "Podporuje řízenou fúzi chromalitů a nebeské pěny za účelem výroby beta-pylenu. Nelze provozovat v těsné blízkosti jiných celestiálních reaktorů."
		        },
		        "reflector": {
		            "name": "Nebeský reflektor",
		            "description": "Zlepšuje výkon sousedního nebeského reaktoru."
		        },
		        "mega1": {
		            "name": "Věž pro streamování materiálu",
		            "description": "Zvyšuje viditelnost komprimací pohyblivých prostředků. Může být pouze jeden."
		        },
		        "mega1a": {
		            "name": "Věž pro streamování materiálu MKII",
		            "description": "Upgrade materiálové věže streameru. Zvyšuje rychlost přenosu surovin. Může být pouze jedna."
		        },
		        "mega1b": {
		            "name": "Věž pro streamování materiálu MKIII",
		            "description": "Vylepšení věže streameru materiálů MKII. Kompresuje zdroje do balíčků. Může být pouze jeden."
		        },
		        "mega2": {
		            "name": "Recyklační věž",
		            "description": "Umožňuje recyklaci strojů, která vrací 90 % zdrojů. Může být pouze jeden."
		        },
		        "mega3": {
		            "name": "Demontáž věže",
		            "description": "Vylepšení recyklační věže. Umožňuje demontáž stroje, která vrátí všechny zdroje. Může být jen jedna."
		        },
		        "voidsculpture": {
		            "name": "Prázdné obdivné kněžiště",
		            "description": "Umožňuje vám ignorovat vizuální nedostatky prázdných strojů."
		        },
		        "eye": {
		            "name": "Řídící doplňování",
		            "description": "Označuje stroje připravené k plnění. Může být pouze jeden."
		        },
		        "cookie": {
		            "name": "Sušenka",
		            "description": "Jak se to tam dostalo?"
		        },
		        "injector": {
		            "name": "Injektor Pekelného drahokamu",
		            "description": "Vymění náhodnou surovinu ze sousední kostky za pekelný drahokam, pokud na kostce žádný není. Má 32 nábojů, pokud má k dispozici 32 pekelných drahokamů a 64 kanetitů."
		        },
		        "silo": {
		            "name": "Podzemní silo",
		            "description": "Při aktivaci doplní blízké stroje a poté je automaticky doplní ještě 16krát"
		        },
		        "silo2": {
		            "name": "Průmyslové silo",
		            "description": "Modernizace podzemního sila. Při aktivaci doplní okolní stroje a poté je automaticky doplní ještě 64krát."
		        },
		        "vessel": {
		            "name": "Uzavírací nádoba",
		            "description": "Uchovává 32 chromalitů a zabraňuje jejich štěpení. Konzumuje pekelný drahokam."
		        },
		        "vessel2": {
		            "name": "Kontejnerové silo",
		            "description": "Vylepšení uzavíracího kontejneru. Ukládá 32768 Chromalitů a zabraňuje jejich štěpení. Spotřebovává Realitu."
		        },
		        "consumer": {
		            "name": "Katalytická rafinérie",
		            "description": "Spotřebovává sousední rozbité zdroje. Po nashromáždění 1024 zdrojů vše uvolní s dodatečným bonusem. Výše bonusu se s každým dalším uvolněním zvyšuje a dosahuje až 100 %. Pokud se během 16 sekund nespotřebují žádné zdroje, efekt se resetuje."
		        },
		        "preheater": {
		            "name": "Katalytický předehřívač",
		            "description": "Zvyšuje rychlost jakéhokoli stroje pro konverzi zdrojů, pokud je umístěn vedle něj. Každý konvertor zvyšuje nárůst rychlosti předehřívače, a to až o 300 %, pokud je postihnuto 8 strojů."
		        },
		        "hollow": {
		            "name": "Dutý výchoz",
		            "description": "Tolik otvorů."
		        },
		        "strange": {
		            "name": "Dutá skála",
		            "description": "Vypadá to, že je tam už nějakou dobu."
		        },
		        "strange1": {
		            "name": "Výzkumná lokalita dutých skal",
		            "description": "Nebeská pěna se zničí s 512 pekelnými drahokamy místo 64. SEVER."
		        },
		        "strange2": {
		            "name": "Zařízení na výrobu dutých skal",
		            "description": "Zdvojnásobí maximální množství dutých skal a zvýší jejich počet."
		        },
		        "strange3": {
		            "name": "Rekonstruovaná dutina",
		            "description": "Dramaticky zvyšuje míru výskytu dutých kamenů a vše provádí tiše."
		        },
		        "generaldecay": {
		            "name": "Obecný rozpadový reaktor",
		            "description": "Dramaticky zlepšuje výkon rozkladu Chromalitu. Může být pouze jeden."
		        },
		        "waypoint": {
		            "name": "Waypoint",
		            "description": "Teleportuje k vám další existující Waypoint."
		        },
		        "annihilator": {
		            "name": "Anihilátor",
		            "description": "Vytváří prázdnotu, když se pekelné drahokamy zničí nebeskou pěnou. Vyžaduje Dutý kámen."
		        },
		        "flower": {
		            "name": "Dutý květ",
		            "description": "Snižuje pravděpodobnost časové deformace. Působí proti účinku jednoho dutého kamene. Musí být postaven na Dutém kameni. Zničí Dutý kámen, na kterém byl postaven."
		        },
		        "fruit": {
		            "name": "Duté ovoce",
		            "description": "Evoluce dutého květu. Zabraňuje tvorbě dutých kamenů, aby se vyživovala. Produkuje duté kameny."
		        },
		        "eraser": {
		            "name": "Demolice",
		            "description": "Zničí stroj a vrátí 50 % zdrojů použitých k jeho výrobě."
		        },
		        "eraser2": {
		            "name": "Recyklovat",
		            "description": "Zničí stroj a vrátí 90 % zdrojů použitých k jeho výrobě."
		        },
		        "eraser3": {
		            "name": "Demontáž",
		            "description": "Zničí stroj a vrátí  % zdrojů použitých k jeho výrobě."
		        },
		        "clicker1": {
		            "name": "Qanetitský oscilátor",
		            "description": "Umožňuje vám kliknout na zdroje a podržet je, abyste je rozbili. Může být jen jeden."
		        },
		        "clicker2": {
		            "name": "Oscilátor Hell Gem",
		            "description": "Vylepšení na oscilátor Qanetite. Zvyšuje frekvenci oscilace. Může být pouze jeden."
		        },
		        "clicker3": {
		            "name": "Oscilátor Chromalit",
		            "description": "Vylepšení oscilátoru Hell Gem. Maximalizuje frekvenci oscilace. Může být pouze jeden."
		        },
		        "stabilizer": {
		            "name": "Stabilizátor",
		            "description": "Stabilizuje jeden sousední proudový příval a dočasně využívá jeho sílu."
		        },
		        "stabilizer2": {
		            "name": "Stabilizátor II",
		            "description": "Upgrade stabilizátoru. Zlepšuje stabilitu a výkon."
		        },
		        "stabilizer3": {
		            "name": "Rozbitý Stabilizátor",
		            "description": "Anomální upgrade. Zlepšuje výkon a maximalizuje stabilitu. Může být pouze jeden."
		        }
		    },
		    "messages": [
		        "Kde jsi?",
		        "Jsem doslova uprostřed ničeho.",
		        "Dobře, co vidíš?",
		        "No, moc ne. Je tady tenhle stroj, vypadá trochu povědomě, ale nemůžu na něj položit prst",
		        "Jaký stroj?",
		        "Počkej, možná bych mohl...",
		        "Počkej, snad mi nechceš říct, že se právě teď dotýkáš nějakého náhodného stroje!",
		        "Funguje to! Právě to něco vytvořilo",
		        "???",
		        "Obrovskou černou kostku. Je tak hladká. Opravdu ji chci rozbít",
		        "Jsi sjetý?",
		        "Teď mám 64 kamenů!",
		        "Dobře, tak tedy dobře. Užij si to.",
		        "Hej, našel jsem žlutý kámen!",
		        "Gratuluji chlape!",
		        "Myslím, že už umím stavět stroje. Měl bych postavit něco, co mi pomůže ty kostky snáze rozbít. Pokud se kostka objeví v sousední buňce, třeba i diagonálně, mělo by to fungovat.",
		        "Počkej, hraješ tu nějakou divnou hru? Začínáš mě děsit",
		        "Teď už jen musím do stroje vložit žlutý kámen.",
		        "Cokoli tě udělá šťastným... Vtipy stranou, přijdeš dnes?",
		        "Určitě! Za pár hodin tam budu, jen to musím dokončit.",
		        "Co přesně děláš?",
		        "Napíšu ti později. Potřebuju dál tlačit na přístroj, promiň.",
		        "Domnívám se, že stroje se navzájem ovlivňují, pokud jsou umístěny v sousedních nebo diagonálních buňkách. Například tento ventilátor musí být umístěn vedle prvního stroje, aby se proces urychlil.",
		        "Teď to dáva smysl",
		        "no?",
		        "Kde jsi?",
		        "Už na tebe čekáme celé věky.",
		        "Co myslíš? Jsem pořád tady.",
		        "KDE???",
		        "Mám teď modrý kámen. Nebo je to fialový? Zní to jako starožitný mosazný svícen. Myslím, že bych ho mohl použít k odstranění špatně umístěných strojů.",
		        "Děláš si ze mě srandu? Myslel jsem, že jsi řekl, že přijdeš. Co to k sakru?!",
		        "Klídek, za chvíli jsem tam.",
		        "Páni, pomocí [Q] můžu klonovat stroje nebo je zničit, když předtím kliknu na volnou buňku! A [Alt] pomáhá vidět za vysoké stroje.",
		        "CHOP CHOP",
		        "Jste tam ještě?",
		        "SAKRA!!!",
		        "Kde jsi????",
		        "Jsi v pořádku??",
		        "????",
		        "Co to k sakru?",
		        "JSI V POŘÁDKU? KDE JSI?",
		        "Klídek, chlape! Jsem v pořádku, co se děje?",
		        "To mi řekni ty! Už dva týdny se mi vyhýbáš! Dokonce jsem u tebe několikrát byl, ale nebyl jsi tam. Jen mi řekni, kde jsi, to je vše. Jsi teď doma?",
		        "Kámo, o čem to mluvíš? Psali jsme si doslova před dvěma minutami.",
		        "CO JE TO S TEBOU??? Nejdřív ses neukázal a pak jsi zmizel úplně. A teď děláš, jako by se nic nestalo!",
		        "Ptám se tě jednoduchou otázku",
		        "KDE JSI?",
		        "Jsem tady.",
		        "KDE",
		        "Vydrž...",
		        "To není vtipné. Kde přesně jsi? Můžeš mi to říct?",
		        "no...",
		        "Kámo, já vlastně nevím.",
		        "Dej mi minutku",
		        "Co tím myslíš, že nevíš?",
		        "Potřebuji si shromáždit myšlenky",
		        "Je všechno v pořádku? Jsi v bezpečí? Mám někomu zavolat?",
		        "Ne, jsem v pohodě. Jen jsem",
		        "Za chvilku ti napíšu",
		        "Sakra, chlape. Co se děje?",
		        "Mám strach",
		        "Zdá se, že nevím, kde jsem",
		        "To je tak divné. Chci říct, že je se mnou všechno v pořádku. Ale nedokážu tohle místo popsat.",
		        "Je to jako sen, ale na druhou stranu není. Všechno je bílé a jsou tu stroje. A kostky. Nedává to smysl.",
		        "Nejsem sjetý ani nic podobného. Jen jsem si uvědomil jak je zvláštní, že jsem si nikdy nevšiml, že se to nepodobá ničemu, co jsem kdy viděl.",
		        "Teď mám červené kameny a je trochu děsivé, že mi to je všechno úplně jedno. Ok, jen červený kámen, všechno je v pořádku.",
		        "Tak to si neděláš srandu...",
		        "Už chápu, jak to všechno zní. Ale ano, mám to všechno před očima.",
		        "Mohu pro tebe něco udělat?",
		        "Jen se mnou mluv, to je vše.",
		        "Jasně kámo, jasně. Mimochodem, policie teď po tobě pátrá. Jako bys zmizel.",
		        "Ukázal jsi jim naše texty?",
		        "Jak by to pomohlo? Ne, zapnul jsem automatické mazání.",
		        "Díky!",
		        "Jak to tam jde?",
		        "No, ukázalo se, že se mohu pohybovat pomocí WASD. Ale kolem není nic zajímavého, kromě této podivné skály na severu.",
		        "Takže kompas v telefonu funguje!",
		        "No, odtud je to jen \"nahoru\", takže to je asi sever.",
		        "To dává smysl",
		        "A jde o to, že nemám telefon...",
		        "Tak jak mi píšeš?",
		        "Nevím!! Jen vím, kdy mi napíšeš. A můžu ti odpovědět! Není snadné to vysvětlit.",
		        "Nedělej si s tím starosti. Můžeme spolu mluvit a to je už samo o sobě dost dobré.",
		        "Ano, máš pravdu.",
		        "Tak... Řekni mi o těch strojích.",
		        "Co myslíš?",
		        "Co jsou zač, co dělají a jak fungují?",
		        "No, vypadají luxusně, s nějakými kabely a dráty a tak",
		        "Jeden například vypadá jako velká plastová krabice s měděnou cívkou na vrcholu, kam patří modrý kámen. A na boku je velký štítek s nápisem „E—01SR“ s menším štítkem „Pozor! Silné entropické záření“",
		        "Co to znamená?",
		        "Já fakt nevím. Myslím, že je tam nějaké entropické záření.",
		        "Počkej, myslel jsem, že ty jsi vyrobil tyto stroje?",
		        "Jasně... Chápu.",
		        "Prostě je nějak vyrobím z kostek. Ale nevím, co je uvnitř. Jo, to zní divně, nech mě o tom přemýšlet.",
		        "A mimochodem se zdá, že žluté a modré kameny nejsou nekonečné, takže bych opravdu měl investovat do těchto převodníků nebo nového dolu.",
		        "To zní jako plán",
		        "To je ale otrava!",
		        "Cože?",
		        "Zelený kámen! Rozbít ho trvá celou věčnost. Musím něco vymyslet, když se pořád objevují.",
		        "Jsem si jistý, že na to vyrobíš nějaký fantastický stroj!",
		        "To se vsaď!",
		        "To teda jo! Pekelné drahokamy, pozor.",
		        "Dej jim peklo!",
		        "Vzpomínáš si, jak jsi se ptal na stroje?",
		        "Ano",
		        "Nemyslím si, že jsou skutečné",
		        "Co to má znamenat?",
		        "Je to jako ve snu. Nemůžu se podívat dovnitř a ani je vidět z druhé strany.",
		        "Vágní reprezentace nevysvětlitelné technologie",
		        "Myslím, že tyto stroje tak vypadají jen proto, jak vnímám jejich funkci.",
		        "Jako že když něco kácí stromy, mělo by to vypadat jako sekera?",
		        "Něco takového",
		        "No, alespoň mi zníš docela reálně",
		        "Jo, myslím, že jsi pro mě teď jediná skutečná věc.",
		        "Mám spoustu nových kostek, které se rozpadají na jiné kostky!",
		        "No, není to skvělé, ale ani hrozné",
		        "Musím říct něco opravdu divného",
		        "Vidíš tu ironii v tom, co jsi právě napsal?",
		        "Možná je to kvůli tomuto podivnému místu, ale nějak jsem zapomněl tvé jméno.",
		        "No, předpokládám, že bychom mohli spolu strávit ještě trochu více času",
		        "Myslím to vážně",
		        "Jmenuji se samozřejmě Duke Nukem.",
		        "Kámo, nech toho!",
		        "Tohle ona řekla!",
		        "To je hloupost! Přestaň mě děsit. Co se děje?",
		        "Sakra",
		        "Vypadá to, že si nepamatuji ani své vlastní jméno",
		        "Já prostě nemůžu! Je to šílené. A nemůžu si vzpomenout na tvé jméno!",
		        "Možná jde jen o případ hromadné hysterie? Slyšel jsem, že může postihnout více lidí najednou. Pojďme se prostě uklidnit a uvidíme, co bude.",
		        "Jo, jasně, hysterie",
		        "Stále si nemohu vzpomenout na jména",
		        "Já také ne. A je toho víc.",
		        "Jo! Jak vypadám? Kdy jsme se potkali?",
		        "Jak vypadá můj domov, kdo jsou naši přátelé? Setkali jsme se vůbec?",
		        "Vypadá to, že jsme oba uvízli ve stejných sračkách. A ani nedokážu říct, jestli to tak bylo vždycky, nebo se v určitém okamžiku něco stalo. Je to snad nějaký divný sen? A komu se to zdá?",
		        "Jsou poblíž nějaké stroje? Možná někde vyskočila kostka?",
		        "Vtipné",
		        "Tak si pojďme vymyslet nějaká jména.",
		        "Zníš jako Veen",
		        "Proč ne",
		        "Nemám nic proti Veen",
		        "Ahoj, Veen. Chtěl bys nějaké fazole, Veen? Jo, zní to dobře.",
		        "A ty budeš Charps",
		        "Máte nějaké ostré harfy, charpsi?",
		        "To nedává smysl!",
		        "Mám rád Charps. Těší mě, Veene.",
		        "Nápodobně, Charps",
		        "CO SE DĚJE",
		        "Co?",
		        "Bílé kostky! Ničí ty zelené!",
		        "Také jsou tu tuny rozkládajících se kostek! Je to jako v jaderném reaktoru!",
		        "Do prdele, jsi v pořádku?",
		        "Jo, jsem v pořádku! Teď je to jen nepořádek. Musím něco postavit, abych to zvládl. Možná bych se měl ještě jednou podívat na skálu na severu.",
		        "To děláš vždycky, Charps!",
		        "To zní divně!",
		        "Tedy, moje jméno ano. Myslím, že si na to jednou zvyknu. Že, Veene?",
		        "Jo! Opravdu divné.",
		        "Pamatuješ, jak jsem zmiňoval divný kámen na severu?",
		        "Ne tak docela, ne",
		        "Nuže, je tu tento kámen. A nepochop mě špatně, uvědomuji si, že všechno zde je zvláštní. Ale tento kámen působí mnohem více zvláštně než cokoli jiného.",
		        "Nerozumím tomu. Ale teď, když jsem se rozhodl do toho trochu šťouchnout, změnilo to něco v pravidlech samotného Vesmíru!",
		        "Je to nebezpečné?",
		        "Nevím. Změna je nenápadná.",
		        "Zajímalo by mě, co ještě umí.",
		        "Dobře, jen omylem neznič vesmír.",
		        "Udělám, co bude v mých silách.",
		        "No tak, TO byl nejtěžší kámen mého života! Ale myslím, že teď už vím, jak ho rychleji rozbít.",
		        "Máš nový kámen?",
		        "Jo, zatím nejdivnější",
		        "Woah, možná že efekt na vesmír nebyl tak jemný. Cítíš to?",
		        "Cítíš co?",
		        "No, možná jsem to jen já.",
		        "Neviděli jsi náhodou právě teď před očima obrovskou krychli?",
		        "Ehm, počítá se lednička?",
		        "No, nevadí",
		        "Páni, tahle nová kostka je černá. A působí poněkud nadpozemsky.",
		        "Ještě nadpozemštější než ten předchozí?",
		        "Je to jiné! Je tu mrazivo, ale ne škodlivě. Jako by postrádala pojem o teplotě a neinteragovala s vámi. Není to z hmoty, nemá to barvu ani nic známého, pokud vám to dává smysl.",
		        "Upřímně řečeno, nedává.",
		        "Myslím, že to chápu. Můžu použít duté kameny, abych zkondenzoval tu černou hmotu ze vzduchu. Vytváří podivně identické krystaly, ale bez jakýchkoli vlastností. A to nějak napravuje anomálie ve vesmíru.",
		        "To zní jako vzduchový filtr",
		        "Ano, přesně! Vypadá to, že jsem nějakým způsobem zkazil atmosféru.",
		        "Nemusíš to říkat nahlas",
		        "Rozhodl jsem se vykopat ten divný kámen. Možná uvnitř najdu odpověď na to, co se děje. Mám pocit, že to nejen všechno zamotává, ale že to nějak všechno ovládá!",
		        "Proč myslíš?",
		        "Budeš mi věřit, když řeknu, že to cítím?",
		        "Jistě! Myslím, že bych teď věřil čemukoli. Na kámen, který ovládá vesmír? Proč sakra ne!",
		        "Myslím, že dostanu záchvat!",
		        "Prosím ne",
		        "Tyto stroje jsou tak hlučné a blikají. Možná bych měl něco upravit, abych to opravil. Nebo upravit sebe. Nebo obojí.",
		        "To je ono!",
		        "Takže, co jsi vylepšil?",
		        "Počkat, něco je špatně.",
		        "Postavil jsem věc z černého materiálu. A není to stroj. Ale něco to udělalo s Waypointy.",
		        "Co jsou waypointy?",
		        "Přesouvají vesmír kolem tebe, takhle se dostaneš na různá místa.",
		        "Jak zjistíš, že posunují Vesmír a ne tebe?",
		        "Hmm, nad tím jsem nepřemýšlel",
		        "Myslím, že jsem rozbil vesmír",
		        "Nic z toho nedává smysl!",
		        "Stroje nedávají smysl, nic nedává smysl.",
		        "Doufám, že to dokážu opravit",
		        "Veen?",
		        "Kámo, jsi tam?",
		        "Prosím, prosím, to ne! Doufám, že jsi si šel jen odskočit nebo tak něco.",
		        "VEEN!",
		        "CO?",
		        "Přesto je to divné.",
		        "Díky bohu!",
		        "Postavil jsi něco nového?",
		        "Myslel jsem, že jsem rozbil vesmír a ty jsi navždy pryč! Byl jsem v nějakém podsvětí s nějakými symboly kolem a myslel jsem si, že to jsou trosky vesmíru. Ale je to jiný Vesmír nebo jiná verze tohoto Vesmíru, protože se navzájem podobají a jsou teď propojené.",
		        "Průzkum, jo? To zní zábavně!",
		        "Zábava? Četl jsi vůbec můj text? JINÝ VESMÍR!!!",
		        "Musíš se smířit s tím, že ti dochází kapacita mě překvapit.",
		        "To je fér",
		        "Není to kámen, je to čočka",
		        "Dokáže vše spojit do jediného bodu. A tím myslím všechno! Prostor, čas, všechny pojmy a pravidla. Všechno!",
		        "Našel jsi manuál nebo něco podobného?",
		        "Nevím, proč tam je a proč jsme tady. Jen nějak vím, co to teď dělá.",
		        "Takže... Sblížíš všechno nebo co?",
		        "Nevím jak. Ale možná je to smysl tohoto místa. Teď se jen vznáší ve vzduchu, jako by to tak mělo být.",
		        "A co bude dál?",
		        "Nemám tušení",
		        "Čím víc o tom přemýšlím, tím víc chápu, že nejen tvoje stroje nejsou skutečné.",
		        "Snažím se klást si konkrétní otázky a nemám odpovědi.",
		        "Pamatuješ, jak jsem se zmínil, že tě hledali policajti? Nebavil jsem se s tebou. Ale teď se všechno hroutí, když si kladu otázky.",
		        "Přišel jsem na policejní stanici nebo jsem jim zavolal? A kdo tam byl? Policajti? Kde je ve městě policejní stanice? co je to za město? Bydlím v tomto městě? jak se to město jmenuje? A jaký je to stát? Nebo existují vůbec nějaké státy?",
		        "Nedokážu odpovědět na jedinou otázku. Všechno se zdálo být normální, dokud jsem se nezačal ptát. Bojím se ptát dál.",
		        "Omlouvám se za to",
		        "Ne, vůbec to není tvoje chyba. Jsme na stejné lodi, pokud vím.",
		        "Jen doufám, že zjistíte, co je to za loď.",
		        "Jo, já taky!",
		        "Uvidíme, jak to skončí. Jen doufám, že to není nějaké věčné peklo nebo limbo.",
		        "Ukaž jim to, Dante!",
		        "Teď to má šťávu. Ti kluci by měli tohoto vesmíru vysát do poslední kapky!",
		        "Zníš jako ropná společnost",
		        "Už mě nebaví vše ladit, aby to bylo trochu efektivnější a už mě nebaví hluk. Tento stroj by měl všechno změnit. Dokonce to proniká i na druhou stranu.",
		        "Není to nebezpečné?",
		        "Pojem nebezpečí je zde poměrně nejasný.",
		        "Myslím, že je čas udělat něco velkého.",
		        "Na co myslíš?",
		        "Nejsem si jistý. Ale měl by být velký!",
		        "Jako obrovský stroj?",
		        "Ne, mluvím metaforicky",
		        "Tak to udělej!",
		        "Sakra",
		        "Udělal jsem něco špatného. Inverzní propast je zničena. Všechno se hroutí.",
		        "Jsi v pořádku?",
		        "Ano, ale stroje se ničí! Nemůžu nic postavit! Do prdele!",
		        "Počkat! Možná se to má stát?",
		        "NE! Nemá!",
		        "Jak to víš?",
		        "Počkej, musím to nějak opravit",
		        "Tady se nic neděje!",
		        "Vidím tě! Právě jsi prošel kolem obrovského kaštanu na té legrační planetě v horním rameni galaxie.",
		        "Ne, ne! Jaká galaxie?",
		        "Těžko říct přesný čas, pravděpodobně se to ještě nestalo. Ale stačí počkat 15 miliard let!",
		        "Teď to dává smysl. Přijdeš mimochodem?",
		        "Rozhodně! Budu tam za pár hodin, jen potřebuji dodělat nějaké věci.",
		        "Dobře, tak se uvidíme!",
		        "Ale prosím, Charps",
		        "Tentokrát se neopozdi",
		        "Neopozdím, Veen!"
		    ],
		    "credits": [
		        "Začátek",
		        "Opravdu oceňuji, že jste to dotáhli až na úplný konec, kde vše začíná",
		        "Gratuluji, předpokládám!",
		        "Stačí se podívat na toto:",
		        "Celkem vytěžené zdroje:",
		        "Charonity:",
		        "Elmerines:",
		        "Qanetites:",
		        "Beta-pyleny:",
		        "Pekelné drahokamy:",
		        "Chromality:",
		        "Nebeská pěna:",
		        "Duté kameny:",
		        "Prázdno:",
		        "Skutečnosti:",
		        "Sestavené stroje:",
		        "Zničené stroje:",
		        "Maximální hloubka kanálu v metrech:",
		        "Podivná skála do něj šťouchla:",
		        "Časy teleportace:",
		        "Kliknutí na kostku:",
		        "Zakřivení času:",
		        "Doba hraní:",
		        "h",
		        "Hru vytvořil:<br>Oleg Danilov",
		        "Doplňková grafika:<br>Yulia Nogteva",
		        "Úprava dialogů:<br>Abdurahman Zulumhanov a Anna Petersonová",
		        "Vydavatelství služby Steam:<br>Playsaurus",
		        "Testování her:<br>Komunita Leprosorium, Abdurahman Zulumhanov, Playsaurus",
		        "KONEC",
		        "Nyní můžete jít a hrát Cookie Clicker nebo tak něco.",
		        "Hudba:<br>Shallow Anne od Jakea Chudnowa",
		        "Deutsch: flex 4711, Patrick Karban",
		        "Português: selfemcrowdin, Mateus Iamarino",
		        "Italiano: doralum",
		        "Español: armangar, Syunay Kamenov",
		        "Français: KjetilVion, Etienne Samson, William (Ekitchi)",
		        "Nederlands: lievevandyck",
		        "Čeština: Jakub Strelinger",
		        "Polski: PolglishPL",
		        "日本語: Winna Tolentino",
		        "한국어: Ah Lon Sin, Sumin Park, Cyberowl",
		        "简体中文：Daisy Chan, kevinlee7, YuLun",
		        "繁體中文: Daisy Chan, kevinlee7",
		        "ไทย: They say P, Phimze Pym",
		        "Magyar: Simon Dániel és Márton-Mezey Csenge",
		        "Latviešu valoda: Roberts Artūrs Bumburs (Arburo)",
		        "Română: Eric Apetrei"
		    ],
		    "explainer": [
		        "Stiskněte a podržte.",
		        "Vždy klikněte na buňku pod ní.",
		        "<span class=\"keyboard\">Q</span>, <span class=\"keyboard\">Esc</span> nebo kliknutím pravým tlačítkem myši zrušte.",
		        "Podržte klávesu <span class=\"keyboard\">Alt</span> a podívejte se blíže.",
		        "Stisknutím tlačítka <span class=\"keyboard\">Q</span> nad prázdnou buňkou vyberete demoliční nástroj.",
		        "Stiskněte <span class=\"keyboard\">Q</span> nad strojem a pokuste se postavit další.",
		        "WASD nebo kliknutím pravým tlačítkem a tažením se rozhlédněte kolem sebe."
		    ],
		    "random": {
		        "paste": "Kód pro uložení byl zkopírován do schránky. Nyní jej vložte na bezpečné místo.",
		        "toolate": "Na záchranu čehokoli je už pozdě. Všechno už se stalo.",
		        "existed": "NOVINKA",
		        "steamWarning": "Chyba služby Steam. Automatické ukládání a úspěchy nefungují. Zkuste hru znovu spustit."
		    }
		},
		pl: {
		    "splash": {
		        "sixtyfour": "SZEŚĆDZIESIĄT&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;CZTERY",
		        "continue": "<span>KONTYNUUJ</span><div class=\"keyboard\">Esc</div>",
		        "start": "<span>START</span><div class=\"keyboard\">Esc</div>",
		        "soundoff": "DŹWIĘK WYŁĄCZONY",
		        "soundon": "DŹWIĘK WŁĄCZONY",
		        "save": "ZAPISZ",
		        "load": "WCZYTAJ",
		        "language": "JĘZYK: POLSKI",
		        "reset": "RESETUJ",
		        "credit": "©2024 Oleg Danilov, publikacja: Playsaurus. Wersja",
		        "warning": "Stracisz wszystko, mówię serio. Przytrzymaj, aby zatwierdzić.",
		        "glory": "OSIĄGNIĘCIA",
		        "deglory": "WRÓĆ",
		        "quit": "WYJDŹ",
		        "export": "Eksportować",
		        "import": "Importować",
		        "flashbang": "Jasne migające światła są częścią tej gry. Jeśli jesteś na nie wrażliwy, możesz rozważyć wyłączenie migania, klikając na tę ikonę."
		    },
		    "achievements": [
		        {
		            "name": "Złoto głupców",
		            "description": "Zdobądź Elmeryn"
		        },
		        {
		            "name": "Głębia fioletu",
		            "description": "Zdobądź Kwanetyt"
		        },
		        {
		            "name": "Krew ziemi",
		            "description": "Zdobądź Beta-Pylen"
		        },
		        {
		            "name": "Zielona energia",
		            "description": "Zdobądź Piekielny Klejnot"
		        },
		        {
		            "name": "Gorące szkło",
		            "description": "Zdobądź Chromalit"
		        },
		        {
		            "name": "Święty beton",
		            "description": "Zdobądź Niebiańską Pianę"
		        },
		        {
		            "name": "Da się tym pozmywać naczynia?",
		            "description": "Zdobądź Pusty Kamień"
		        },
		        {
		            "name": "Tam gdzie nie świeci Słońce",
		            "description": "Zdobądź Pustkę"
		        },
		        {
		            "name": "Kogo wezwiesz?",
		            "description": "Zdobądź Rzeczywistość"
		        },
		        {
		            "name": "Nietzsche",
		            "description": "Spójrz w otchłań 64 razy"
		        },
		        {
		            "name": "64K",
		            "description": "Zdobądź 64 000 kamieni"
		        },
		        {
		            "name": "64M",
		            "description": "Zdobądź 64 000 000 kamieni"
		        },
		        {
		            "name": "64B",
		            "description": "Zdobądź 64 000 000 000 kamieni"
		        },
		        {
		            "name": "Teraz możesz zresetować",
		            "description": "Utknij na początku gry"
		        },
		        {
		            "name": "Perpetum szmobile",
		            "description": "Połącz ze sobą dwa silosy"
		        },
		        {
		            "name": "Potrzebujesz przerwy?",
		            "description": "Graj przez 64 godziny"
		        },
		        {
		            "name": "Muszę... Niszczyć",
		            "description": "Kliknij kostkę 6400 razy"
		        },
		        {
		            "name": "Architekt",
		            "description": "Zbuduj 64 maszyny"
		        },
		        {
		            "name": "Niszczyciel",
		            "description": "Zniszcz 64 maszyny"
		        },
		        {
		            "name": "Pogromca Piekieł",
		            "description": "Zbuduj 9 Piekielnych Krypt"
		        },
		        {
		            "name": "Koniec/Początek",
		            "description": "Spraw, że Przepaść Zwrotna wybuchnie"
		        },
		        {
		            "name": "Ciasteczkowy klikacz",
		            "description": "Kliknij ciasteczko"
		        },
		        {
		            "name": "Pijany marynarz",
		            "description": "Zatrąb 64 razy bez powodu"
		        },
		        {
		            "name": "Pan Górnik",
		            "description": "Zbuduj 9 Kanałów Wydobywczych"
		        },
		        {
		            "name": "Czy jest jakaś granica?",
		            "description": "Wkop się na głębokość 64 kilometrów"
		        },
		        {
		            "name": "Seth Brundle",
		            "description": "Teleportuj <s>1</s> 64 razy"
		        },
		        {
		            "name": "Czerwono-niebieska skała",
		            "description": "Ukończ grę nie usuwając niczego przez 15 minut i posiadając mniej niż 15 Silosów Zbiorczych"
		        },
		        {
		            "name": "Prosto do piekła!",
		            "description": "Zdobądź Piekielny Klejnot w ciągu pierwszych 64 minut od rozpoczęcia gry"
		        },
		        {
		            "name": "Wkop się nieco głębiej",
		            "description": "Wkop się na głębokość 64 metrów"
		        },
		        {
		            "name": "Gorąco tu?",
		            "description": "Wkop się na głębokość 640 metrów"
		        },
		        {
		            "name": "Za głęboko",
		            "description": "Wkop się na głębokość 6400 metrów"
		        },
		        {
		            "name": "64 km/h w dół",
		            "description": "Wkop się na głębokość 6400 metrów w ciągu 6 minut od postawienia nowego Kanału Wydobywczego"
		        },
		        {
		            "name": "Neofobia",
		            "description": "Ukończ grę, nie ulepszając nigdy kanałów ekstrakcyjnych"
		        }
		    ],
		    "resources": [
		        "Charonit",
		        "Elmeryn",
		        "Kwanetyt",
		        "Beta-Pylen",
		        "Piekielny Klejnot",
		        "Chromalit",
		        "Niebiańska Piana",
		        "Pusty kamień",
		        "Pustka",
		        "Rzeczywistość"
		    ],
		    "entities": {
		        "pinhole": {
		            "name": "?",
		            "description": "U/D, C/S, T/B, E/νE, μ/νμ, τ/ντ, G/γ, Z/W, H, Δ/νΔ"
		        },
		        "gradient": {
		            "name": "Studnia gradientowa",
		            "description": "Wieczna kostka, z której można wydobywać surowce. Reaguje na większość destabilizatorów i rezonatorów. Należy podłączyć do Przepaści Zwrotnej za pomocą przewodów."
		        },
		        "chasm": {
		            "name": "Przepaść Zwrotna",
		            "description": "Most prowadzący w nieznane."
		        },
		        "conductor": {
		            "name": "Przewodnik",
		            "description": "Łączy Przepaść Zwrotną z silosami przemysłowymi."
		        },
		        "pump": {
		            "name": "Kanał ekstrakcyjny",
		            "description": "Wydobywa zasoby i umieszcza je wokół siebie."
		        },
		        "pump2": {
		            "name": "Kanał wydobywczy",
		            "description": "Ulepszenie kanału ekstrakcyjnego. Szybko wydobywa duże ilości zasobów i umieszcza je wokół siebie."
		        },
		        "vault": {
		            "name": "Piekielny skarbiec",
		            "description": "Izoluje 1024 Piekielne Klejnoty od otoczenia."
		        },
		        "cube": {
		            "name": "Kostka zasobów",
		            "description": "Wydobyte zasoby."
		        },
		        "destabilizer": {
		            "name": "Destabilizator",
		            "description": "Umieść obok kostki, aby rozbić ją dwa razy szybciej. Do działania wymaga Elmerynu. Dodatkowe destabilizatory zwiększają efekt."
		        },
		        "destabilizer2": {
		            "name": "Destabilizator przemysłowy",
		            "description": "Ulepszenie destabilizatora. Czterokrotnie zwiększa moc procesu niszczenia zasobów. Do działania wymaga 64 Elmerynów. Dodatkowe destabilizatory zwiększają efekt działania."
		        },
		        "destabilizer2a": {
		            "name": "Destabilizator Piekielnych Klejnotów",
		            "description": "Ulepszenie destabilizatora przemysłowego. Zwiększa moc procesu niszczenia zasobów 625 razy, jeżeli w wydobytej kostce znajduje się Piekielny Klejnot. W przeciwnym razie nie zapewnia dodatkowych korzyści. Do działania wymaga 1 Piekielnego Klejnotu. Dodatkowe destabilizatory zwiększają efekt jego działania."
		        },
		        "doublechannel": {
		            "name": "Chłodnica kanału",
		            "description": "Umieść obok maszyny do wydobywania kostek, aby wydobywać kostki dwa razy szybciej. Dodatkowe chłodnice zwiększają efekt działania."
		        },
		        "doublechannel2": {
		            "name": "Aktywna chłodnica kanału",
		            "description": "Ulepszenie chłodnicy kanału. Potraja przepływ w kanale źródłowym, jeśli zostanie umieszczona obok niego. Dodatkowe chłodnice zwiększają efekt jej działania."
		        },
		        "valve": {
		            "name": "Zawór zwrotny",
		            "description": "Zapobiega przywróceniu pierwotnej pozycji maszyny wydobywającej kostki, jeśli zostanie ona umieszczona obok niej. Do działania wymaga Charonitu."
		        },
		        "auxpump": {
		            "name": "Pompa pomocnicza",
		            "description": "Ulepszenie zaworu zwrotnego. Zapewnia odpowiednie ciśnienie w kanale źródłowym, jeśli zostanie umieszczony obok niego. Do działania wymaga 8 Elmerynów. Dodatkowe pompy nie zwiększą ciśnienia w kanale źródłowym."
		        },
		        "auxpump2": {
		            "name": "Pompownia",
		            "description": "Ulepszenie pompy pomocniczej. Czterokrotnie zwiększa ciśnienie w kanale źródłowym, jeśli zostanie umieszczony obok niego. Do działania wymaga 256 Elmerynów i 4 Beta-Pyleów. Większa ilość stacji nie zwiększy przepływu w kanale źródłowym."
		        },
		        "entropic": {
		            "name": "Rezonator entropijny",
		            "description": "Okresowo niszczy zasoby, które zostaną umieszczone obok kostki. Do działania wymaga Kwanetytu."
		        },
		        "entropic2": {
		            "name": "Rezonator entropijny II",
		            "description": "Ulepszenie rezonatora entropijnego. Niszczy zasoby 3 razy szybciej. Do działania wymaga Chromalitu."
		        },
		        "entropic2a": {
		            "name": "Kondensator entropijny",
		            "description": "Ulepszenie rezonatora entropijnego. Miażdży zasoby w momencie ich pojawienia się na powierzchni z mocą 600%. Działąnie wykonuje tylko raz na kostkę. Do działania wymaga 8 sztuk Chromalitu."
		        },
		        "entropic3": {
		            "name": "Rezonator Pustki",
		            "description": "Ulepszenie rezonatora entropijnego II. Kiedy następuje anihilacja, rezonator miażdży kostki wokół siebie z ogromną siłą."
		        },
		        "converter32": {
		            "name": "Zbiornik do wzbogacania Charonitu",
		            "description": "Stopniowo łączy Kwanetyt z Charonitem, tworząc Elmeryn."
		        },
		        "converter13": {
		            "name": "Zbiornik na Charonit",
		            "description": "Odzyskuje Kwanetyt z upłynnionego Charonitu w obecności katalizatorów."
		        },
		        "converter41": {
		            "name": "Utleniacz Beta-Pylenu",
		            "description": "Spala Beta-Pylen, aby wyprodukować Charonit i śladowe ilości innych pierwiastków."
		        },
		        "converter76": {
		            "name": "Niebiański napromiennik",
		            "description": "Napromieniowuje Niebiańską Pianę Chromalitem, przekształcając Pianę w Chromality, które stanowią doskonałe źródło Piekielnych Klejnotów, Beta-Pylenu, Kwanetytu i Elmerynu powstających na skutek powodu rozpadu Chromalitu."
		        },
		        "converter64": {
		            "name": "Niebiański reaktor",
		            "description": "Umożliwia kontrolowaną fuzję Chromalitów i Niebiańskiej Piany w celu wytworzenia Beta-Pylenu. Nie może działać w pobliżu innych niebiańskich reaktorów."
		        },
		        "reflector": {
		            "name": "Niebiański reflektor",
		            "description": "Poprawia wydajność sąsiadującego niebiańskiego reaktora."
		        },
		        "mega1": {
		            "name": "Wieża strumieniująca zasoby",
		            "description": "Zwiększa widoczność poprzez kompresję ruchomych zasobów. Można zbudować tylko jedną maszynę tego typu."
		        },
		        "mega1a": {
		            "name": "Wieża strumieniująca zasoby MKII",
		            "description": "Ulepszenie wieży strumieniującej zasoby. Zwiększa szybkość transferu zasobów. Można zbudować tylko jedną maszynę tego typu."
		        },
		        "mega1b": {
		            "name": "Wieża strumieniująca zasoby MKIII",
		            "description": "Ulepszenie wierzy strumieniującej zasoby MK II. Jeszcze bardziej przyspiesza przesyłanie zasobów. Można zbudować tylko jedną maszynę tego typu."
		        },
		        "mega2": {
		            "name": "Wieża recyklingująca",
		            "description": "Umożliwia recykling maszyny, co prowadzi do zwrotu 90% zasobów. Można umieścić tylko jedną maszynę tego typu."
		        },
		        "mega3": {
		            "name": "Wieża demontująca",
		            "description": "Ulepszenie wieży recyklingującej. Umożliwia demontaż maszyny, co pozwala na uzyskanie zwrotu wszystkich zasobów. Można umieścić tylko jedną maszynę tego typu."
		        },
		        "voidsculpture": {
		            "name": "Kapliczka do podziwiania Pustki",
		            "description": "Pozwala zignorować wizualne wady maszyn Pustki."
		        },
		        "eye": {
		            "name": "Wkaźnik napełnienia",
		            "description": "Wskazuje maszyny gotowe do napełniania. Można umieścić tylko jedną maszynę tego typu."
		        },
		        "cookie": {
		            "name": "Ciasteczko",
		            "description": "Jak to się tam dostało?"
		        },
		        "injector": {
		            "name": "Wtryskiwacz Piekielnych Klejnotów",
		            "description": "Zamienia losowy zasób z sąsiedniej kostki na Piekielny Klejnot, jeśli on tam nie występuje. Posiada 32 ładunki, jeśli jest zasilany 32 Piekielnymi Klejnotami i 64 Kwanetytami."
		        },
		        "silo": {
		            "name": "Podziemny silos",
		            "description": "Po aktywacji uzupełnia pobliskie maszyny, a następnie automatycznie uzupełnia je jeszcze 16 razy"
		        },
		        "silo2": {
		            "name": "Silos przemysłowy",
		            "description": "Ulepszenie podziemnego silosu. Po aktywacji napełnia pobliskie maszyny, a następnie automatycznie napełnia je jeszcze 64 razy"
		        },
		        "vessel": {
		            "name": "Pojemnik zbiorczy",
		            "description": "Przechowuje 32 Chromality, zapobiegając ich rozszczepieniu. Zużywa Piekielny Klejnot."
		        },
		        "vessel2": {
		            "name": "Silos zbiorczy",
		            "description": "Ulepszenie pojemnika zbiorczego. Przechowuje 32768 Chromalitów, zapobiegając ich rozszczepieniu. Zużywa Rzeczywistość."
		        },
		        "consumer": {
		            "name": "Rafineria katalityczna",
		            "description": "Zużywa sąsiednie uszkodzone zasoby. Po zgromadzeniu 1024 zasobów uwalnia je wszystkie gwarantując przy tym dodatkowy bonus. Wartość bonusu wzrasta z każdym kolejnym uwolnieniem, dochodząc aż do 100%. Jeśli w ciągu 16 sekund nie zostaną zużyte żadne zasoby, efekt zostanie zresetowany."
		        },
		        "preheater": {
		            "name": "Podgrzewacz katalityczny",
		            "description": "Zwiększa prędkość dowolnej maszyny do konwersji zasobów, jeśli tylko zostanie umieszczona obok niej. Każdy konwerter zwiększa prędkość podgrzewacza do 300%, jeśli oddziałowuje na 8 maszyn."
		        },
		        "hollow": {
		            "name": "Wydrążony występ",
		            "description": "Tak wiele dziur."
		        },
		        "strange": {
		            "name": "Wydrążona skała",
		            "description": "Wygląda na to, że jest tam już od dłuższego czasu."
		        },
		        "strange1": {
		            "name": "Punkt badań na wydrążonej skale",
		            "description": "Sprawia, że Niebiańska Piana zostaje rozbita za pomocą 512 Piekielnych Klejnotów zamiast 64. PÓŁNOC."
		        },
		        "strange2": {
		            "name": "Instytut na wydrążonej skale",
		            "description": "Podwaja maksymalną ilość Pustych Kamieni i zwiększa częstotliwość ich występowania."
		        },
		        "strange3": {
		            "name": "Odnowiona skała",
		            "description": "Znacząco zwiększa częstotliwość występowania Pustych Kamieni nie generując przy tym hałasu."
		        },
		        "generaldecay": {
		            "name": "Reaktor rozkładu ogólnego",
		            "description": "Znacząco poprawia wydajność rozpadu Chromalitu. Można umieścić tylko jedną maszynę tego typu."
		        },
		        "waypoint": {
		            "name": "Punkt orientacyjny",
		            "description": "Teleportuje do ciebie następny istniejący Punkt orientacyjny."
		        },
		        "annihilator": {
		            "name": "Anihilator",
		            "description": "Wytwarza Pustkę, gdy Piekielne Klejnoty rozbijają Niebiańską Pianę. Do działania wymaga Pustego Kamienia."
		        },
		        "flower": {
		            "name": "Pusty kwiat",
		            "description": "Zmniejsza ryzyko zakrzywienia czasu. Przeciwdziała efektowi jednego Pustego Kamienia. Musi być zbudowany na Wydrążonej Skale. Niszczy Wydrążoną Skałę, na której został zbudowany."
		        },
		        "fruit": {
		            "name": "Pusty owoc",
		            "description": "Ulepszenie Pustego Kwiatu. Zapobiega tworzeniu się Pustych Kamieni, którymi się żywi. Wytwarza Puste Kamienie."
		        },
		        "eraser": {
		            "name": "Zburz",
		            "description": "Niszczy maszynę, zwracając 50% zasobów użytych do jej zbudowania."
		        },
		        "eraser2": {
		            "name": "Wykorzystaj ponownie",
		            "description": "Poddaje recyklingowi maszynę, zwracając 90% zasobów użytych do jej zbudowania."
		        },
		        "eraser3": {
		            "name": "Demontuj",
		            "description": "Demontuje maszynę, zwracając wszystkie zasoby użyte do jej zbudowania."
		        },
		        "clicker1": {
		            "name": "Oscylator Kwanetytu",
		            "description": "Umożliwia kliknięcie i przytrzymanie zasobów w celu ich rozbicia. Można zbudować tylko jedną maszynę tego typu."
		        },
		        "clicker2": {
		            "name": "Oscylator Piekielnych Klejnotów",
		            "description": "Ulepszenie oscylatora Kwanetytu. Zwiększa częstotliwość oscylacji. Można zbudować tylko jedną maszynę tego typu."
		        },
		        "clicker3": {
		            "name": "Oscylator Chromalitu",
		            "description": "Ulepszenie oscylatora Piekielnych Klejnotów. Maksymalizuje częstotliwość oscylacji. Można zbudować tylko jedną maszynę tego typu."
		        },
		        "stabilizer": {
		            "name": "Stabilizator",
		            "description": "Stabilizuje sąsiedni przypływ energii, aby tymczasowo wykorzystać jego moc."
		        },
		        "stabilizer2": {
		            "name": "Stabilizator II",
		            "description": "Ulepszenie stabilizatora. Poprawia stabilność i wydajność."
		        },
		        "stabilizer3": {
		            "name": "Rozbity Stabilizator",
		            "description": "Niecodzienne ulepszenie. Poprawia wydajność i maksymalizuje stabilność. Może być tylko jedno."
		        }
		    },
		    "messages": [
		        "Gdzie jesteś?",
		        "Jestem na całkowitym odludziu",
		        "W porządku, co widzisz?",
		        "Cóż, niewiele. Jest tu jakaś maszyna. Wygląda niby znajomo, ale nie mogę jej zidentyfikować",
		        "Jaka maszyna?",
		        "Poczekaj, może uda mi się...",
		        "Czekaj! Powiedz, że NIE dotykasz teraz jakiejś przypadkowej maszyny!",
		        "Działa! Właśnie coś stworzyła",
		        "???",
		        "Ogromną czarną kostkę. Jest całkowicie gładka. Strasznie chcę ją rozbić",
		        "Jesteś na haju?",
		        "Mam teraz 64 kamienie!",
		        "W porządku. Miłej zabawy.",
		        "Hej, znalazłem żółty kamień!",
		        "Brawo!",
		        "Myślę, że teraz będę w stanie budować maszyny. Powinienem zbudować coś, co pomoże mi rozbijać te kostki. Jeśli kostka pojawi się w sąsiedniej komórce, nawet po przekątnej, powinno to zadziałać.",
		        "Czekaj, grasz w jakąś dziwną grę? Zaczynasz mnie przerażać",
		        "Teraz muszę tylko włożyć żółty kamień do tej maszyny.",
		        "Rób co chcesz... Żarty na bok - wpadniesz dzisiaj?",
		        "Pewnie! Będę za kilka godzin, muszę tylko to dokończyć.",
		        "Co dokładnie robisz?",
		        "Napiszę do ciebie później. Przepraszam, ale muszę przepchnąć tę maszynę.",
		        "Jestem zdania, że maszyny wpływają na siebie nawzajem, gdy są umieszczone w sąsiadujących ze sobą komórkach lub po skosie. Przykładowo, ten wentylator należy umieścić obok pierwszej maszyny, aby przyspieszyć proces jej działania.",
		        "Mówisz teraz bardzo sensownie",
		        "No więc?",
		        "Gdzie jesteś?",
		        "Czekamy na Ciebie od wieków.",
		        "Co masz na myśli? Ciągle tu jestem.",
		        "GDZIE???",
		        "Mam niebieski kamień. A może fioletowy? Brzmi jak zabytkowy mosiężny świecznik. Myślę, że mógłbym go użyć do usunięcia nieprawidłowo zbudowanych maszyn.",
		        "Żartujesz? Jeśli pamiętam, to mówiłeś, że przyjdziesz. Co do diaska?!",
		        "Spokojnie, stary, będę tam za chwilkę",
		        "Ale super, mogę użyć [Q] do klonowania maszyn lub ich niszczenia, jeśli najpierw kliknę wolną komórkę! Z kolei [Alt] pozwala na podgląd przestrzeni znajdującej się za wysokimi maszynami.",
		        "DO DZIEŁA",
		        "Jesteście tam jeszcze?",
		        "O SZLAG!!!",
		        "Gdzie jesteś????",
		        "Wszystko w porządku??",
		        "????",
		        "Co do diaska?",
		        "WSZYSTKO W PORZĄDKU? GDZIE JESTEŚ?",
		        "Wyluzuj! U mnie w porządku. Co się dzieje?",
		        "Ty mi powiedz! Unikasz mnie już od dwóch tygodni! Byłem nawet kilka razy u ciebie, ale nie mogę cię zastać. Po prostu powiedz mi, gdzie jesteś, to wszystko. Jesteś teraz w domu?",
		        "Stary, o czym mówisz? Pisaliśmy do siebie dosłownie dwie minuty temu.",
		        "CO JEST Z TOBĄ NIE TAK??? Najpierw się nie pojawiłeś, a potem zniknąłeś całkowicie. Co więcej, teraz zachowujesz się jakby nic się nie stało!",
		        "Zadaję Ci proste pytanie",
		        "GDZIE JESTEŚ?",
		        "Jestem tutaj.",
		        "G D Z I E",
		        "Chwila...",
		        "To nie jest śmieszne, stary. Gdzie dokładnie jesteś? Możesz mi to powiedzieć?",
		        "Cóż...",
		        "Stary, tak naprawdę to nie wiem.",
		        "Daj mi chwilę",
		        "Jak to nie wiesz?",
		        "Muszę zebrać myśli",
		        "Wszystko w porządku? Jesteś bezpieczny? Mam po kogoś zadzwonić?",
		        "Nie, wszystko w porządku. Po prostu",
		        "Odpiszę Ci za chwilkę",
		        "Kurczę, stary. Co się dzieje?",
		        "Boję się",
		        "Nie do końca wiem, gdzie jestem",
		        "To takie dziwne. Wszystko ze mną w porządku ale nie potrafię opisać tego miejsca.",
		        "To jak sen, ale z drugiej strony niekoniecznie. Wszystko jest białe. Są tu maszyny. Są też kostki. To nie ma sensu.",
		        "Nie jestem na haju ani nic w ten deseń. Właśnie zdałem sobie sprawę, jakie to dziwne. Nie przypomina to niczego, co do tej pory widziałem.",
		        "Teraz mam czerwone kamienie. To trochę przerażające, że jest mi z tym wszystkim dobrze. W porządku, to tylko czerwony kamień, wszystko jest w porządku.",
		        "Więc nie żartujesz...",
		        "Wiem, jak to wszystko brzmi. Ale tak, to dzieje się na moich oczach.",
		        "Mogę coś dla ciebie zrobić?",
		        "Po prostu rozmawiaj ze mną, to wszystko.",
		        "Da się zrobić, kolego, da się zrobić. Przy okazji, gliny cię szukają. Wzięli cię za zaginionego.",
		        "Czy pokazałeś im nasze wiadomości?",
		        "W jaki sposób miałoby to pomóc? Nie, włączyłem automatyczne usuwanie.",
		        "Dzięki!",
		        "Jak idzie?",
		        "Okazuje się, że mogę poruszać się za pomocą klawiszy WASD. Wokół mnie nie ma nic ciekawego oprócz tej dziwnej skały na północy.",
		        "A więc kompas telefonu działa poprawnie!",
		        "Cóż, stąd można iść tylko \"w górę\", więc myślę, że to północ.",
		        "To ma sens",
		        "Rzecz w tym, że nie mam telefonu...",
		        "Więc jak do mnie piszesz?",
		        "Nie wiem!!! Po prostu wiem, kiedy do mnie piszesz. Mogę ci też odpowiedzieć! Trudno to wyjaśnić.",
		        "Nie przejmuj się. Możemy rozmawiać i to wystarczy.",
		        "Tak, masz rację.",
		        "A więc... Opowiedz mi o maszynach",
		        "Co masz na myśli?",
		        "Czym są, co robią i jak działają?",
		        "Cóż, wyglądają ciekawie, mają kable, przewody i inne elementy",
		        "Przykładowo, jedna z nich wygląda jak duże plastikowe pudełko z miedzianą cewką na górze, gdzie należy umieścić niebieski kamień. Z boku jest duża etykieta z napisem \"E-01SR\" oraz mniejsza etykieta \"Uwaga! Silne promieniowanie entropijne\"",
		        "Co to oznacza?",
		        "Tak naprawdę to nie wiem. Chodzi chyba o jakieś promieniowanie entropijne.",
		        "Chwila, myślałem, że to ty stworzyłeś te maszyny?",
		        "Racja... Rozumiem o co ci chodzi.",
		        "Po prostu buduję je z kostek. Nie wiem, co jest w środku. Tak, to brzmi dziwnie. Pozwól mi się nad tym zastanowić.",
		        "A tak przy okazji - wygląda na to, że żółte i niebieskie kamienie nie są nieskończone, więc powinienem zainwestować w konwertery lub nową kopalnię.",
		        "Brzmi jak sensowny plan",
		        "Co za upierdliwiec!",
		        "Co?",
		        "Zielony kamień! Rozbicie go zajmuje wieki. Muszę coś wymyślić, skoro ciągle się pojawiają.",
		        "Jestem pewien, że zbudujesz w tym celu jakąś ciekawą maszynę!",
		        "Masz to jak w banku!",
		        "O tak! Piekielne Klejnoty, miejcie się na baczności.",
		        "Do piekła z nimi!",
		        "Pamiętasz, jak pytałeś o maszyny?",
		        "Tak",
		        "Nie sądzę, żeby były prawdziwe",
		        "Co to ma znaczyć?",
		        "To jak sen. Nie mogę zajrzeć do środka ani nawet zobaczyć ich z drugiej strony.",
		        "Niejasne przedstawienie niewyjaśnionej technologii",
		        "Myślę, że maszyny wyglądają w ten sposób tylko ze względu na to, jak postrzegam ich funkcję.",
		        "Przykładowo, jeśli coś służy do ścinania drzew, to czy powinno wyglądać jak siekiera?",
		        "Coś w tym stylu",
		        "Przynajmniej dla mnie brzmisz całkiem rzeczywiście",
		        "Tak. Przypuszczam, że jesteś teraz dla mnie jedyną rzeczywistą rzeczą",
		        "Mam kilka nowych kostek, które rozkładają się na inne kostki!",
		        "Cóż, nie jest źle, nie jest też dobrze",
		        "Muszę powiedzieć coś naprawdę dziwnego",
		        "Czy dostrzegasz ironię w tym, co właśnie napisałeś?",
		        "Może to przez to dziwne miejsce, ale zapomniałem twoje imię",
		        "Przypuszczam, że moglibyśmy spędzać razem trochę więcej czasu",
		        "Mówię poważnie",
		        "Nazywam się Duke Nukem, to chyba oczywiste.",
		        "Stary, przestań!",
		        "O to chodziło!",
		        "To głupie! Przestań mnie straszyć. Co się dzieje?",
		        "Kurczę",
		        "Wygląda na to, że nie pamiętam też swojego imienia",
		        "Po prostu nie mogę! To jakieś szaleństwo. Nie pamiętam twojego imienia!",
		        "Może to tylko masowa histeria? Słyszałem, że może dotyczyć wielu osób jednocześnie. Uspokójmy się i zobaczmy, co się stanie.",
		        "Tak, na pewno to histeria",
		        "Wciąż nie mogę sobie przypomnieć imion",
		        "Ja też nie. Jest tego więcej",
		        "Tak! Jak wyglądam? Kiedy się poznaliśmy?",
		        "Jak wygląda mój dom, kim są nasi przyjaciele? Czy w ogóle się poznaliśmy?",
		        "Wygląda na to, że oboje tkwimy w tym samym bagnie. Nie potrafię nawet powiedzieć, czy zawsze tak było, czy to się wydarzyło w określonym momencie. Czy to jakiś dziwny sen? Kim jest śniący?",
		        "Są jakieś maszyny w pobliżu? Może gdzieś pojawiła się kostka?",
		        "Zabawne",
		        "Cóż, wymyślmy dla siebie jakieś imiona.",
		        "Brzmisz jak Veen",
		        "Może być",
		        "Pasuje mi Veen",
		        "Hej, Veen. Chcesz fasoli, Veen? Tak, to brzmi w porządku.",
		        "Ty z kolei będziesz Charps",
		        "Masz jakieś harfy albo szarfy, Charps?",
		        "To nie ma sensu!",
		        "Podoba mi się Charps. Miło mi cię poznać, Veen",
		        "Ciebie również, Charps",
		        "CO SIĘ DZIEJE",
		        "Co?",
		        "Białe kostki! Niszczą zielone!",
		        "Jest też mnóstwo rozpadających się kostek! Jak w reaktorze jądrowym!",
		        "O kurczę, wszystko w porządku?",
		        "Tak, nic mi nie jest! Teraz jest tu po prostu bałagan. Muszę zbudować coś, co sobie z tym poradzi. Może powinienem jeszcze raz sprawdzić skałę na północy.",
		        "Zawsze to robisz, Charps!",
		        "Brzmi dziwnie!",
		        "Mam na myśli moje imię. Myślę, że w pewnym momencie się do niego przyzwyczaję. Prawda, Veen?",
		        "Tak! Rzeczywiście dziwne.",
		        "Pamiętasz, jak wspominałem o dziwnej skale na północy?",
		        "Nie do końca",
		        "Jest tam taka skała. Nie zrozum mnie źle, zdaję sobie sprawę, że wszystko tutaj jest dziwne. Niemniej jednak, ta skała jest o wiele dziwniejsza niż cokolwiek innego.",
		        "Nie mogę tego pojąć. Kiedy ją dotknąłem, zmieniła zasady działania Wszechświata!",
		        "Czy jest to niebezpieczne?",
		        "Nie wiem. Zmiana jest dość subtelna.",
		        "Zastanawiam się, co jeszcze robi.",
		        "W porządku, tylko nie zniszcz przypadkowo Wszechświata.",
		        "Zrobię co w mojej mocy.",
		        "To była NAJTWARDSZA skała w moim życiu! Myślę jednak, że teraz wiem, jak szybciej ją rozłupać.",
		        "Masz nowy kamień?",
		        "Tak, jak dotąd jest on najdziwniejszy ze wszystkich",
		        "O jejku, może zmiany we Wszechświecie nie były jednak tak subtelne. Czujesz to?",
		        "Co?",
		        "Może tylko mi się zdaje.",
		        "Czy przypadkiem nie masz teraz przed oczami ogromnej kostki?",
		        "Czy lodówka się liczy?",
		        "Nieważne",
		        "O jejku, ta nowa kostka jest czarna jak smoła. Sprawia wrażenie jakby była z innego świata.",
		        "Bardziej z innego świata niż poprzednie?",
		        "To co innego! Jest zimne, ale nie w nieprzyjemny sposób. Jakby nie miało pojęcia o temperaturze i nie wchodziło z tobą w interakcję. Nie jest zbudowane z materii, nie ma koloru, ani żadnych znajomych cech, jeśli ma to jakikolwiek sens.",
		        "Szczerze mówiąc, nie ma.",
		        "Chyba to rozumiem. Mogę użyć pustych kamieni, aby skondensować tę czarną substancję z powietrza. Tworzy dziwnie, identyczne kryształy, które nie mają jakichkolwiek właściwości. To one w jakiś dziwny sposób naprawiają anomalie we Wszechświecie.",
		        "Wygląda na filtr powietrza",
		        "Tak, dokładnie! Wygląda na to, że w pewnym momencie zanieczyściłem powietrze.",
		        "Nie musisz mówić tego na głos",
		        "Postanowiłem odkopać ten dziwny kamień. Może tam znajdę odpowiedź na to, co kryje się w środku. Czuję, że może nie tylko wszystko komplikować, ale i w jakiś sposób wszystko kontroluje!",
		        "Dlaczego tak sądzisz?",
		        "Czy uwierzysz mi, jeśli powiem ci, że tak po prostu czuję?",
		        "Jasne! Myślę, że teraz uwierzyłbym we wszystko. Skała kontrolująca Wszechświat? A czemu by nie!",
		        "Chyba mam atak!",
		        "Proszę, nie",
		        "Te maszyny są tak irytująco głośne i ciągle migoczą. Może powinienem coś naprawić, żeby to zniwelować. Mogę też podrasować siebie. Albo zrobić i jedno i drugie.",
		        "Ma to sens!",
		        "Co więc poprawiłeś?",
		        "Czekaj, coś jest nie tak.",
		        "Zbudowałem coś z czarnego materiału. I nie jest to maszyna. Zrobiło coś z Punktami orientacyjnymi.",
		        "Czym są punkty orientacyjne?",
		        "Zmieniają stan Wszechświata wokół ciebie, dzięki czemu możesz dostać się w różne miejsca.",
		        "Skąd wiesz, że zmieniają stan Wszechświata, a nie twój?",
		        "Hmm, nie pomyślałem o tym",
		        "Możliwe, że zepsułem Wszechświat",
		        "To nie ma żadnego sensu!",
		        "Te maszyny nie mają sensu, nic nie ma.",
		        "Mam nadzieję, że uda mi się to naprawić",
		        "Veen?",
		        "Stary, jesteś tam?",
		        "Proszę, tylko nie to! Mam nadzieję, że poszedłeś się odlać czy coś w ten deseń.",
		        "VEEN!",
		        "CO?",
		        "Wciąż jednak jest to dziwne.",
		        "Dzięki Bogu!",
		        "Zbudowałeś coś nowego?",
		        "Myślałem, że zepsułem Wszechświat i odszedłeś na zawsze! Byłem w jakichś zaświatach z symbolami i myślałem, że to ruiny Wszechświata. Ale to inny Wszechświat lub inna jego wersja, ponieważ są do siebie podobne i zostały teraz ze sobą połączone.",
		        "Eksploracja? Brzmi fajnie!",
		        "Fajnie? Przeczytałeś w ogóle moją wiadomość? INNY WSZECHŚWIAT!!!",
		        "Musisz zaakceptować fakt, że kończą ci się możliwości zaskakiwania mnie.",
		        "Prawda",
		        "To nie kamień, to soczewka",
		        "Może sprawić, że wszystko zbiegnie się w jednym punkcie. Mam na myśli dosłownie wszystko! Przestrzeń, czas, wszystkie pojęcia i zasady. Wszystko!",
		        "Znalazłeś instrukcję czy coś?",
		        "Nie wiem, dlaczego to tu jest i dlaczego tu jesteśmy. Po prostu wiem teraz co to robi.",
		        "A więc... Zamierzasz wszystko ze sobą połączyć, czy jak?",
		        "Nie wiem jak. Może właśnie o to chodzi w tym miejscu. Teraz po prostu unosi się w powietrzu, jakby to właśnie miał robić.",
		        "I co dalej?",
		        "Nie mam pojęcia",
		        "Im więcej o tym myślę, w tym pełniejszym stopniu rozumiem, że nie tylko twoje maszyny nie są prawdziwe.",
		        "Staram się zadawać sobie konkretne pytania i nie mam na nie odpowiedzi.",
		        "Pamiętasz, jak wspomniałem, że gliny cię szukały? Nie zgrywałem się. Teraz wszystko się rozpada, gdy zadaję sobie pytania.",
		        "Czy poszedłem na komisariat czy zadzwoniłem do nich? Kto tam był? Gliniarze? Gdzie jest ten komisariat? Co to za miasto? Czy tam mieszkam? Jak nazywa się to miasto? Jaki to stan? Czy w ogóle istnieją jakieś stany?",
		        "Nie potrafię odpowiedzieć na żadne pytanie. Wszystko wydawało się normalne, dopóki nie zacząłem zadawać pytań. Boję się zadawać ich więcej.",
		        "Przepraszam za to",
		        "To nie twoja wina. Z tego co widzę, jedziemy na tym samym wózku.",
		        "Mam tylko nadzieję, że dowiesz się, co to za wózek.",
		        "Tak, ja też!",
		        "Zobaczmy jak to się skończy. Mam tylko nadzieję, że nie jest to jakiś typ piekła czy otchłani.",
		        "Pokaż im, Dante!",
		        "Teraz ma to sens. Ci kolesie powinni osuszyć ten Wszechświat!",
		        "Brzmisz jak przedstawiciel firmy naftowej",
		        "Jestem zmęczony poprawianiem wszystkiego, aby było trochę bardziej wydajne i mam dość hałasu. Ta maszyna powinna wszystko zmienić. Nawet przebija na drugą stronę.",
		        "Czy to bezpieczne?",
		        "Pojęcie bezpieczeństwa jest tutaj dość niejasne.",
		        "Myślę, że nadszedł czas, aby zrobić coś wielkiego.",
		        "Co ci chodzi po głowie?",
		        "Nie jestem pewien. Powinno to jednak być coś wielkiego!",
		        "Może wielka maszyna?",
		        "Nie, mówię metaforycznie",
		        "Zrób to!",
		        "O cholera",
		        "Zrobiłem coś nie tak. Przepaść Zwrotna została zniszczona. Wszystko się wali.",
		        "Wszystko w porządku?",
		        "Tak, ale maszyny ulegają zniszczeniu! Nie mogę nic zbudować! Cholera!",
		        "Czekaj! Może tak miało być?",
		        "NIE! Nie miało!",
		        "Skąd wiesz?",
		        "Chwila, muszę to jakoś naprawić",
		        "No to jedziemy!",
		        "Widzę cię! Właśnie przeszedłeś obok ogromnego kasztanowca, na tej dziwnej planecie w górnym rogu galaktyki.",
		        "Wcale nie! Jakiej galaktyki?",
		        "Trudno określić dokładne ramy czasowe, prawdopodobnie jeszcze się to nie wydarzyło. Wystarczy tylko poczekać 15 miliardów lat!",
		        "Mówisz jak najbardziej z sensem. Wpadniesz?",
		        "Pewnie! Będę za kilka godzin, muszę tylko coś dokończyć.",
		        "W porządku, do zobaczenia!",
		        "Tylko proszę, Charps",
		        "Nie spóźnij się tym razem",
		        "Nie spóźnię się, Veen, nie spóźnię!"
		    ],
		    "credits": [
		        "Początek",
		        "Doceniam, że dotarłeś do samego końca, tam gdzie wszystko się rozpoczyna",
		        "Gratulacje... chyba!",
		        "Spójrz tylko na to:",
		        "Łącznie wydobytych zasobów:",
		        "Charonity:",
		        "Elmeryny:",
		        "Kwanetyty:",
		        "Beta-Pyleny:",
		        "Piekielne Klejnoty:",
		        "Chromality:",
		        "Niebiańskie Piany:",
		        "Puste kamienie:",
		        "Pustki:",
		        "Rzeczywistości:",
		        "Wybudowanych maszyn:",
		        "Zniszczonych maszyn:",
		        "Maksymalna głębokość kanału w metrach:",
		        "Dotknięte dziwne kamienie:",
		        "Liczba teleportacji:",
		        "Kliknięcia kostek:",
		        "Zakrzywienia czasu:",
		        "Czas gry:",
		        "h",
		        "Grę stworzył:<br>Oleg Danilov",
		        "Dodatkowe grafiki:<br>Julia Nogteva",
		        "Edycja dialogów:<br>Abdurahman Zulumhanov i Anna Peterson",
		        "Publikacja na Steamie:<br>Playsaurus",
		        "Testowanie gry:<br>Społeczność Leprosorium, Abdurahman Zulumhanov, Playsaurus",
		        "KONIEC",
		        "Możesz teraz zagrać w Cookie Clicker lub podobną grę.",
		        "Muzyka:<br>Shallow Anne autorstwa Jake'a Chudnowa",
		        "Deutsch: flex 4711, Patrick Karban",
		        "Português: selfemcrowdin, Mateus Iamarino",
		        "Italiano: doralum",
		        "Español: armangar, Syunay Kamenov",
		        "Français: KjetilVion, Etienne Samson, William (Ekitchi)",
		        "Nederlands: lievevandyck",
		        "Čeština: Jakub Strelinger",
		        "Polski: PolglishPL",
		        "日本語: Winna Tolentino",
		        "한국어: Ah Lon Sin, Sumin Park, Cyberowl",
		        "简体中文：Daisy Chan, kevinlee7, YuLun",
		        "繁體中文: Daisy Chan, kevinlee7",
		        "ไทย: They say P, Phimze Pym",
		        "Magyar: Simon Dániel és Márton-Mezey Csenge",
		        "Latviešu valoda: Roberts Artūrs Bumburs (Arburo)",
		        "Română: Eric Apetrei"
		    ],
		    "explainer": [
		        "Nacisnij i przytrzymaj.",
		        "Zawsze klikaj komórkę pod spodem.",
		        "<span class=\"keyboard\">Q</span>, <span class=\"keyboard\">Esc</span> lub kliknij prawym przyciskiem myszy, aby anulować.",
		        "Przytrzymaj <span class=\"keyboard\">Alt</span>, aby przyjrzeć się bliżej.",
		        "Naciśnij <span class=\"keyboard\">Q</span> na pustej komórce, aby wybrać narzędzie do wyburzania.",
		        "Naciśnij <span class=\"keyboard\">Q</span> na maszynie, aby spróbować zbudować jeszcze jedną.",
		        "Użyj klawiszy WASD lub kliknij prawym przyciskiem myszy i przeciągnij, aby się rozejrzeć."
		    ],
		    "random": {
		        "paste": "Kod zapisu został skopiowany do schowka. Teraz wklej go w bezpiecznym miejscu.",
		        "toolate": "Jest już za późno, by cokolwiek uratować. Wszystko się już wydarzyło.",
		        "existed": "NOWOŚĆ",
		        "steamWarning": "Błąd Steam. Funkcje automatycznego zapisywania i osiągnięć nie będą działać. Spróbuj ponownie uruchomić grę."
		    }
		},
		jp: {
		    "splash": {
		        "sixtyfour": "SIXTY&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FOUR",
		        "continue": "<span>続行</span><div class=\"keyboard\">Esc</div>",
		        "start": "<span>スタート</span><div class=\"keyboard\">Esc</div>",
		        "soundoff": "サウンドオフ",
		        "soundon": "サウンドオン",
		        "save": "保存",
		        "load": "ロード",
		        "language": "言語: 日本語",
		        "reset": "リセット",
		        "credit": "©2024 Oleg Danilov, Playsaurus発行.バージョン",
		        "warning": "貴方はすべてを失うことになるよ、うそじゃないよ。",
		        "glory": "実績",
		        "deglory": "戻る",
		        "quit": "終了",
		        "export": "輸出",
		        "import": "輸入",
		        "flashbang": "このゲームには明るい点滅ライトが含まれています。点滅ライトに敏感な方は、このアイコンをクリックして点滅を無効にすることを検討してください。"
		    },
		    "achievements": [
		        {
		            "name": "愚者の黄金",
		            "description": "エルメリンを手に入れる"
		        },
		        {
		            "name": "ディープパープル",
		            "description": "カネタイトを入手する"
		        },
		        {
		            "name": "大地の血",
		            "description": "ベータピレンを入手する"
		        },
		        {
		            "name": "グリーンエネルギー",
		            "description": "地獄の宝石を探せ"
		        },
		        {
		            "name": "ホットグラス",
		            "description": "クロマリットを探す"
		        },
		        {
		            "name": "聖なるコンクリート",
		            "description": "セレスティアルフォームを手に入れる"
		        },
		        {
		            "name": "皿洗いはできるのか？",
		            "description": "ホローストーンを手に入れる"
		        },
		        {
		            "name": "太陽の当たらない場所",
		            "description": "ヴォイドを手に入れよう"
		        },
		        {
		            "name": "誰に連絡しますか？",
		            "description": "現実を手に入れよう"
		        },
		        {
		            "name": "ニーチェ",
		            "description": "深淵を64回見つめる"
		        },
		        {
		            "name": "64K",
		            "description": "64,000個の石を手に入れる"
		        },
		        {
		            "name": "64M",
		            "description": "64 000 000個の石を手に入れる"
		        },
		        {
		            "name": "64B",
		            "description": "64 000 000 000個の石を手に入れる"
		        },
		        {
		            "name": "リセット可能",
		            "description": "序盤で行き詰まる"
		        },
		        {
		            "name": "パーペタム シュモビル",
		            "description": "2 つのサイロを結合する"
		        },
		        {
		            "name": "休憩しますか？",
		            "description": "64時間プレイ可能"
		        },
		        {
		            "name": "必ず...破壊する",
		            "description": "キューブを6400回クリックする"
		        },
		        {
		            "name": "建築家",
		            "description": "64台のマシンを組み立てる"
		        },
		        {
		            "name": "破壊者",
		            "description": "64 台のマシンを破壊する"
		        },
		        {
		            "name": "ヘルレイザー",
		            "description": "9つの地獄の金庫を持つ"
		        },
		        {
		            "name": "終了/開始",
		            "description": "インバース・キャズムを爆発させる"
		        },
		        {
		            "name": "クッキークリッカー",
		            "description": "クッキーをクリックする"
		        },
		        {
		            "name": "酔っ払った船員",
		            "description": "意味もなく64回鳴らす"
		        },
		        {
		            "name": "ミスター・マイン",
		            "description": "9つの掘削チャンネルがある"
		        },
		        {
		            "name": "制限はありますか?",
		            "description": "深さ64kmまで掘る"
		        },
		        {
		            "name": "セス・ブランドル",
		            "description": "テレポート <s>1</s> 64 回"
		        },
		        {
		            "name": "レッド・ブルー　ロック",
		            "description": "15分間何も消さずにゲームを終了し、サイロが15個以下であること。"
		        },
		        {
		            "name": "直行地獄へ！",
		            "description": "開始から64分以内に地獄の宝石を手に入れる"
		        },
		        {
		            "name": "表面を擦る",
		            "description": "深さ64mまで掘る"
		        },
		        {
		            "name": "暑いですか？",
		            "description": "深さ640kmまで掘る"
		        },
		        {
		            "name": "深すぎる",
		            "description": "深さ6400mまで掘る"
		        },
		        {
		            "name": "64 kmph ダウン",
		            "description": "新しい掘削水路を設置してから 6 分以内に深度 6400m に到達する"
		        },
		        {
		            "name": "新奇恐怖症",
		            "description": "抽出チャネルをアップグレードせずにゲームを完了する"
		        }
		    ],
		    "resources": [
		        "カロナイト",
		        "エルメリン",
		        "カネタイト",
		        "ベータピレン",
		        "地獄の宝石",
		        "クロマリット",
		        "セレスティアル　フォーム",
		        "中空石",
		        "空所",
		        "リアリティ"
		    ],
		    "entities": {
		        "pinhole": {
		            "name": "?",
		            "description": "U/D, C/S, T/B, E/νE, μ/νμ, τ/ντ, G/γ, Z/W, H, Δ/νΔ"
		        },
		        "gradient": {
		            "name": "グラディエント・ウェル",
		            "description": "永遠に採掘可能なキューブ。ほとんどのデスタビライザーとレゾネーターに反応する。導体でインバース・キャズムに接続する必要がある。"
		        },
		        "chasm": {
		            "name": "インバース・カズム",
		            "description": "未知への架け橋。"
		        },
		        "conductor": {
		            "name": "コンダクター",
		            "description": "インバース　カズムを産業サイロに接続します。"
		        },
		        "pump": {
		            "name": "チャンネルの抽出",
		            "description": "リソースを抽出し、自身の周囲に配置します。"
		        },
		        "pump2": {
		            "name": "掘削チャンネル",
		            "description": "抽出チャンネルのアップグレード。大量のリソースを高速で発掘し、それを自分自身の周囲のさらに遠くに配置します。"
		        },
		        "vault": {
		            "name": "地獄の金庫",
		            "description": "1024個の地獄の宝石を環境から遮断する。"
		        },
		        "cube": {
		            "name": "リソースキューブ",
		            "description": "抽出されたリソース。"
		        },
		        "destabilizer": {
		            "name": "デスタビライザー",
		            "description": "キューブの隣に置くと、2倍の速さで割れる。操作にはエルメリーンが必要。不安定化剤を追加すると効果が増す。"
		        },
		        "destabilizer2": {
		            "name": "産業用不安定剤",
		            "description": "不安定化装置のアップグレード。リソースを粉砕するプロセスのパワーが 4 倍になります。動作にはエルメリンが64個必要です。不安定剤を追加すると効果が高まります。"
		        },
		        "destabilizer2a": {
		            "name": "地獄の宝石不安定剤",
		            "description": "産業用不安定化装置のアップグレード。抽出したキューブ内にヘルジェムが存在する場合、資源粉砕処理の威力が625倍に向上します。そうでなければ、何のメリットもありません。動作するには地獄の宝石が1つ必要です。不安定剤を追加すると効果が高まります。"
		        },
		        "doublechannel": {
		            "name": "チャンネルクーラー",
		            "description": "これをキューブ抽出マシンの横に置くと、キューブの抽出速度が2倍になる。さらにクーラーを追加すると効果が増す。"
		        },
		        "doublechannel2": {
		            "name": "アクティブ・チャンネル・クーラー",
		            "description": "チャンネルクーラーのアップグレード。ソースチャネルの隣に配置すると、ソースチャネルの流れが 3 倍になります。クーラーを追加すると効果が高まります。"
		        },
		        "valve": {
		            "name": "リバースバルブ",
		            "description": "キューブ抽出マシンの隣に置くと、元の位置にリセットされるのを防ぎます。操作にはチャロナイトが必要です。"
		        },
		        "auxpump": {
		            "name": "補助ポンプ",
		            "description": "リバースバルブのアップグレード。ソースチャンネルの隣に配置されている場合、ソースチャンネルに圧力を加えます。動作にはエルメリンが8個必要です。ポンプを追加しても、ソースチャネル内の圧力は増加しません。"
		        },
		        "auxpump2": {
		            "name": "ポンプ場",
		            "description": "補助ポンプのアップグレード。ソースチャンネルの隣に配置すると、ソースチャンネルに4倍の圧力を与えます。動作するにはエルメリン 256 個とベータピレン 4 個が必要です。複数のステーションがソース チャネル内のフローを増加させることはありません。"
		        },
		        "entropic": {
		            "name": "エントロピー共振器",
		            "description": "キューブの隣に配置されている場合、リソースを定期的に粉砕します。操作するにはカネタイトが必要です。"
		        },
		        "entropic2": {
		            "name": "エントロピー共振器",
		            "description": "エントロピー共鳴器のアップグレード。リソースを3倍の速さで粉砕します。動作するにはクロマリットが必要です。"
		        },
		        "entropic2a": {
		            "name": "エントロピーコンデンサ",
		            "description": "エントロピー共鳴器のアップグレード。リソースが地表に現れた瞬間に600%の力で粉砕します。ただし、キューブごとに 1 回だけです。動作するには8つのクロマリットが必要です。"
		        },
		        "entropic3": {
		            "name": "ヴォイド・レゾネーター",
		            "description": "エントロピー・レゾネーター II のアップグレード。消滅が起こると、レゾネーターは周囲のキューブを巨大な力で粉砕します。"
		        },
		        "converter32": {
		            "name": "カロナイト濃縮槽",
		            "description": "クアネタイトとカロナイトをゆっくりと反応させ、エルメリンを生成する。"
		        },
		        "converter13": {
		            "name": "カロナイト・サンプ",
		            "description": "触媒の存在下で液化したカロナイト堆積物からクアナタイトを回収します。"
		        },
		        "converter41": {
		            "name": "ベータピレン酸化剤",
		            "description": "ベータピレンを燃焼させてカロナイトと微量の他の元素を生成します。"
		        },
		        "converter76": {
		            "name": "セレスティアル　イラジエーター",
		            "description": "セレスティアルフォームにクロマリットを照射し、フォームをクロマリットに変換します。これは、クロマリットの崩壊により、ヘルジェム、ベータ-ピレン、カネタイト、エルメリンの大きな源泉となります。"
		        },
		        "converter64": {
		            "name": "セレスティアル　リアクター",
		            "description": "クロマリットとセレスティアルフォームの制御可能な融合をサポートし、ベータ-ピレンを生成する。他のセレスティアル・リアクターに接近しての動作はできない。"
		        },
		        "reflector": {
		            "name": "セレスティアルリフレクター",
		            "description": "隣接するセレスティアルリアクターの性能を向上させます。"
		        },
		        "mega1": {
		            "name": "素材ストリーマタワー",
		            "description": "移動リソースを圧縮することで可視性を高めます。ただ一つだけ存在し得ません。"
		        },
		        "mega1a": {
		            "name": "素材ストリーマタワーMKII",
		            "description": "マテリアルストリーマータワーのアップグレード。リソース転送の速度が向上します。ただ一つだけ存在し得ません。"
		        },
		        "mega1b": {
		            "name": "素材ストリーマタワーMKII",
		            "description": "マテリアルストリーマータワーMKIIのアップグレード。移動リソースをさらに圧縮します。ただ一つしか存在し得ません。"
		        },
		        "mega2": {
		            "name": "リサイクル・タワー",
		            "description": "機械のリサイクルが可能となり、資源の90%を回収します。一つだけ存在することができます。"
		        },
		        "mega3": {
		            "name": "解体タワー",
		            "description": "リサイクルタワーのアップグレード。すべてのリソースを返すマシンの分解を許可します。一つだけ存在することができます。"
		        },
		        "voidsculpture": {
		            "name": "虚空の賛美内陣",
		            "description": "ヴォイドマシンの視覚的欠点を無視することができる。"
		        },
		        "eye": {
		            "name": "フィルディレクター",
		            "description": "機械が充填の準備ができていることを示します。一つだけ存在することができます。"
		        },
		        "cookie": {
		            "name": "クッキー",
		            "description": "どうやってそこにたどり着いたのでしょうか？"
		        },
		        "injector": {
		            "name": "地獄の宝石のインジェクター",
		            "description": "隣接するキューブからランダムなリソースをヘルジェムと交換する。地獄の宝石がない場合は交換しない。32個のヘルジェムと64個のカネタイトを提供すると、32回のチャージが可能。"
		        },
		        "silo": {
		            "name": "地下サイロ",
		            "description": "アクティブ化すると、近くのマシンに補充され、さらに 16 回自動的に補充されます。"
		        },
		        "silo2": {
		            "name": "産業用サイロ",
		            "description": "地下サイロのアップグレード。アクティブ化すると、近くのマシンに補充され、さらに 64 回自動的に補充されます。"
		        },
		        "vessel": {
		            "name": "格納容器",
		            "description": "クロマリットを32体収納し、核分裂を防ぐ。地獄の宝石を消費します。"
		        },
		        "vessel2": {
		            "name": "格納サイロ",
		            "description": "格納容器のアップグレード。32768個のクロマリットを格納し、核分裂を防ぐ。リアリティを消費する。"
		        },
		        "consumer": {
		            "name": "触媒精製装置",
		            "description": "隣接する壊れたリソースを消費します。 1024 のリソースを蓄積した後、追加ボーナスですべてを解放します。ボーナスの量は連続リリースごとに増加し、最大 100% に達します。 16 秒以内にリソースが消費されない場合、効果はリセットされます。"
		        },
		        "preheater": {
		            "name": "触媒予熱器",
		            "description": "リソース変換マシンの隣に配置すると、そのマシンの速度が増加します。 8 台のマシンが影響を受ける場合、各コンバーターは予熱器の速度ブーストを最大 300% 増加させます。"
		        },
		        "hollow": {
		            "name": "中空露頭",
		            "description": "穴がたくさんあります。"
		        },
		        "strange": {
		            "name": "中空の岩",
		            "description": "かなり長い間そこに置かれているみたいだね。"
		        },
		        "strange1": {
		            "name": "中空岩石リサーチサイト",
		            "description": "天の泡を64ではなく512の地獄の宝石で消滅させる。北。"
		        },
		        "strange2": {
		            "name": "中空岩施設",
		            "description": "中空の石の最大量が 2 倍になり、出現率が増加します。"
		        },
		        "strange3": {
		            "name": "再建された空洞",
		            "description": "中空の石のスポーン率が大幅に増加し、すべてを静かに実行します。"
		        },
		        "generaldecay": {
		            "name": "一般的な崩壊反応器",
		            "description": "クロマリットの減衰性能を劇的に向上させます。これが唯一のものです。"
		        },
		        "waypoint": {
		            "name": "中間地点",
		            "description": "次の既存の中間地点をテレポートします。"
		        },
		        "annihilator": {
		            "name": "アナイアレイター",
		            "description": "地獄の宝石が天の泡と消滅するとヴォイドを生産する。操作には虚無の石が必要です。"
		        },
		        "flower": {
		            "name": "中空の花",
		            "description": "タイムワープの確率を下げます。中空の石1個の効果を打ち消します。中空の石の上に建てる必要があります。構築された中空の石を破壊します。"
		        },
		        "fruit": {
		            "name": "中空の果実",
		            "description": "中空の花の進化系。自身に栄養を与えるために中空の石の形成を防ぎます。中空の石を生成します。"
		        },
		        "eraser": {
		            "name": "取り壊す",
		            "description": "マシンを破壊すると、その構築に使用されたリソースの 50% が返されます。"
		        },
		        "eraser2": {
		            "name": "リサイクル",
		            "description": "マシンをリサイクルし、その構築に使用されたリソースの 90% を返します。"
		        },
		        "eraser3": {
		            "name": "分解する",
		            "description": "マシンを分解し、その構築に使用されたすべてのリソースを返します。"
		        },
		        "clicker1": {
		            "name": "カネタイトオシレータ",
		            "description": "リソースをクリックして保持すると、それらを壊すことができます。ただ一つだけ存在し得ません。"
		        },
		        "clicker2": {
		            "name": "地獄の宝石発振器",
		            "description": "カネタイト発振器へのアップグレード。発振周波数を最大化します。ただ一つだけ存在し得ません。"
		        },
		        "clicker3": {
		            "name": "クロマリット発振器",
		            "description": "地獄の宝石発振器へのアップグレード。発振周波数を最大化します。ただ一つしか存在し得ません。"
		        },
		        "stabilizer": {
		            "name": "スタビライザー",
		            "description": "隣接するサージを一つ安定させて、その力を一時的に利用します。"
		        },
		        "stabilizer2": {
		            "name": "スタビライザーII",
		            "description": "スタビライザーのアップグレード。安定性とパフォーマンスが向上します。"
		        },
		        "stabilizer3": {
		            "name": "破損したスタビライザー",
		            "description": "異常なアップグレード。パフォーマンスを向上させ、安定性を最大化します。一つだけ存在できます。"
		        }
		    },
		    "messages": [
		        "どこにいるのですか？",
		        "僕は文字通り人里離れたところにいます。",
		        "さて、何が見えますか？",
		        "まあ、それほどでもありません。ここにこの機械があるんですが、ちょっと見覚えがあるような気がしますが、よく分かりません。",
		        "どんなマシン？",
		        "ちょっと待って、もしかしたらできるかもしれない...",
		        "待って、今すぐ言ってくれ！ランダムマシンを触っているんじゃないだろうな？",
		        "うまくいっている！何かを作り出したよ",
		        "???",
		        "巨大な黒いキューブ。とても滑らかだ。本当に壊したい。",
		        "酔ってますか？",
		        "石が64個になりました！",
		        "まあ、それならいいですよ。楽しんでください。",
		        "おい、黄色い石を見つけたよ！",
		        "良かったな！",
		        "これで機械を作れるようになったと思います。これらのキューブをもっと簡単に壊すのに役立つものを構築する必要があります。キューブが隣接するセルに、たとえ斜めであっても表示される場合は、機能するはずです。",
		        "待って、変なゲームしてるの？気味が悪くなってきた",
		        "あとはこのマシンの中に黄色い石を入れるだけだ。",
		        "あなたが幸せなら何でも...。冗談はさておき、今日は来る？",
		        "間違いない！あと数時間で行くから、これを完成させなきゃいけない。",
		        "いったい何をしているのですか？",
		        "後でメールするよ。マシンを押し続けないといけないんだ。",
		        "マシンが隣接または斜めのセルに配置されると、相互に影響を与えると思います。たとえば、プロセスを高速化するには、このファンを最初のマシンの隣に配置する必要があります。",
		        "あなたは今とても理にかなっています",
		        "ええと？",
		        "どこにいるの？",
		        "ずっと待っていたよ。",
		        "どういう意味ですか？僕はまだここにいるよ。",
		        "どこ？？？",
		        "今、青い石を手に入れたよ。それとも紫？アンティークの真鍮の燭台みたいだね。置き忘れた機械を取り出すのに使えそうだ。",
		        "僕をからかってるの？来るんじゃなかったの？なんてこった？！",
		        "落ち着いて、すぐに行くから",
		        "わお、最初に空きセルをクリックすると、[Q] を使用してクローンマシンを作ったり、マシンを破壊したりできるんだ! そして[Alt] キーを押すと、高い機械の後ろを見るのに役立つんだ。",
		        "早く、早く",
		        "まだそこにいるの？",
		        "信じられない!!!",
		        "どこにいるの？",
		        "大丈夫ですか？？",
		        "????",
		        "なんてこった？",
		        "大丈夫？どこにいるの？",
		        "落ち着いて！僕は大丈夫だよ、何が起こってるの？",
		        "君がどこにいるのか教えてよ！もう2週間も音信不通だよ！何度か君の家にも行ったけど、君はいなかった。今どこにいるのかだけ教えて。今、家にいるの？",
		        "おい、何を言ってるんだ？2分前にメールしたじゃないか。",
		        "あなたに何が起こったの？？？ 最初は現れなかったし、その後は完全に姿を消した。そして今、何もなかったかのように振る舞うなんて！",
		        "僕はあなたに簡単な質問をしています。",
		        "どこにいるの？",
		        "私はここにいる。",
		        "どこ",
		        "ちょっと待って...",
		        "笑えないよ。どこにいるんだ？教えてくれないか？",
		        "まあ...",
		        "兄貴、実はわからないんだ。",
		        "ちょっと待って",
		        "知らないってどういうことですか？",
		        "考えをまとめる必要がある",
		        "大丈夫ですか？無事ですか？誰か呼んだ方がいいでしょうか？",
		        "いや、僕は大丈夫です。僕はただ",
		        "すぐにメールするよ",
		        "ちくしょう、何が起こってるんだ？",
		        "怖いです",
		        "自分がどこにいるのかわからないみたい",
		        "これはとても奇妙です。僕は全然大丈夫です。でも、この場所を説明できないんです。",
		        "夢のようですが、やはり夢ではありません。すべてが白くて、これらの機械があります。そしてキューブ。僕には理解できません。",
		        "僕はハイでも何でもありません。ただ、今まで見てきたものとは違うということに気づかなかったのが不思議なくらいです。",
		        "今、僕は赤い石を手に入れたが、このようなことをしてもまったく平気な自分がちょっと不気味だ。よし、赤い石だけで、何も問題ない。",
		        "冗談じゃないんだな...。",
		        "どう聞こえるか、今わかったよ。でも、そう、すべてが目の前にあるんだ。",
		        "何かしてあげられますか？",
		        "ただ話してくれればいい。",
		        "もちろんできるよ、できるとも。ちなみに、警察があなたを探しているよ。まるで行方不明になったかのように。",
		        "僕たちのメッセージを彼らに見せましたか？",
		        "それでどうなる？いや、自動削除をオンにしたんだ。",
		        "ありがとう！",
		        "そちらはどうですか？",
		        "WASDで移動できることがわかった。でも、北にあるこの奇妙な岩以外には、面白いものは何もない。",
		        "携帯電話のコンパスがそこで機能するわけだ！",
		        "まあ、ここからは「上」だから、そこが北だと思います。",
		        "納得いく",
		        "それに僕は携帯電話を持っていないし...。",
		        "それで、どうやって僕にメッセージを送っているの？",
		        "僕は知らないよ！ただ、君が僕にメッセージをくれた時は分かるんだ。返事はできる！説明するのは簡単じゃない。",
		        "気にしないで。話せるだけで十分です。",
		        "はい、その通りです。",
		        "では、マシンについて教えてください",
		        "どういう意味ですか？",
		        "あれらは何なのか、何をするのか、どのように機能するのか？",
		        "そうですね、ケーブルやワイヤーなどが付いていて、見た目は派手ですね。",
		        "例えば、大きなプラスチックの箱のようなもので、上部に銅のコイルがあり、そこに青い石が入っている。そして側面には「E-01SR」と書かれた大きなラベルがあり、小さなラベルには「注意！強いエントロピー放射」",
		        "それはどういう意味ですか？",
		        "本当に分かりません。そこにはエントロピー放射があると思います。",
		        "待って、この機械はあなたが作ったんじゃないの？",
		        "そうだね...。言いたいことは分かる。",
		        "なんとなくキューブから作っているだけなんだ。でも、中に何が入っているかは知らない。ああ、それは変に聞こえるね、少し考えさせて。",
		        "ちなみに、黄色と青色の石は無限ではないようなので、それらのコンバーターか、新しい鉱山に投資したほうがいいね。",
		        "計画のようだ",
		        "なんて面倒なんだ！",
		        "はぁ？",
		        "緑の石だ！壊すのにすごく時間がかかる。これがどんどん出てくるなら、何とかしないと。",
		        "きっと素敵なマシンを作ってくれるでしょう！",
		        "もちろんです！",
		        "そうだ！地獄の宝石よ、気をつけろ。",
		        "地獄を見せあがれ！",
		        "マシンについて質問したことを覚えている？",
		        "うん",
		        "僕は彼らが本物だとは思わない",
		        "それはどういう意味でしょうか？",
		        "まるで夢の中のようです。中を見ることも、反対側から見ることもできません。",
		        "説明できない技術の漠然とした表現",
		        "これらの機械がこのように見えるのは、僕がその機能をどのように捉えているかによるものだと思います。",
		        "木々を切り倒すものが斧に見えるように？",
		        "そんな感じだ",
		        "まあ、少なくとも僕には君がとても本物に聞こえるよ",
		        "ええ、今のところあなたが僕にとって唯一の本物だと思います",
		        "新しいキューブをたくさん手に入れたが、それらは他のキューブに分解されている！",
		        "まあ、良くもなく悪くもない",
		        "僕は本当に変なことを言わなければならない",
		        "今書いたことが皮肉だとわかるかい？",
		        "見知らぬ土地だからか、君の名前を忘れてしまったよ。",
		        "そうですね、それならもう少し一緒に過ごしてもいいのではないかと思います",
		        "僕は真剣です",
		        "僕の名前はデューク・ヌケムだ。",
		        "おい、やめてくれ！",
		        "それが彼女が言ったことだ！",
		        "これは愚かです！僕を怖がらせるのはやめてください。どうしたの？",
		        "ちくしょう！",
		        "自分の名前も思い出せないようだ",
		        "僕にはできない！それはめちゃくちゃだ。君の名前も思い出せない！",
		        "もしかしたら、集団ヒステリーの一例かもしれませんね？複数の人々に影響を及ぼすことがあると聞いたことがあります。落ち着いて様子を見ましょう。",
		        "そうそう、そうですね、ヒステリー",
		        "いまだに名前が思い出せない",
		        "僕もそうです。そして、それだけではありません",
		        "そうだね！僕はどう見える？いつ会った？",
		        "僕の家はどんな感じですか？僕たちの友達は誰ですか？そもそも会ったことありますか？",
		        "どうやら僕たち二人とも同じことにはまってしまったようだ。そして、それがいつもそうだったのか、それともある時点で何かが起こったのかさえわかりません。これは何か変な夢ですか？そして誰が夢を見ているのでしょうか？",
		        "近くに機械はありますか？もしかしたら、どこかからキューブが飛び出したのではないか？",
		        "面白い",
		        "さて、自分たちでいくつか名前を考えてみましょう。",
		        "君はヴィーンみたいだね",
		        "何で？",
		        "ヴィーンに対して何も反対はありません",
		        "やあ、ヴィーン。豆はいかがですか？はい、良さそうですね。",
		        "そしてあなたはチャープスになるでしょう",
		        "チャープさん、鋭いハープをお持ちですか？",
		        "それは意味がありません!",
		        "チャープスが好きです。ヴィーンさん、初めまして",
		        "チャープスも同様に、",
		        "何が起こっているのか",
		        "何？",
		        "白いキューブ！緑のキューブを破壊しています！",
		        "たくさんの崩壊しているキューブもあります！ まるで原子炉の中のようです！",
		        "やばい、大丈夫ですか？",
		        "はい、大丈夫です！今はただ混乱しているだけです。これに対処する何かを構築する必要があります。北の岩をもう一度見てみるといいかもしれません。",
		        "それがいつもの君のやり方だよ、チャープス！",
		        "変ですね！",
		        "僕の名前はそういう意味だね。いつかは慣れると思うよ。ねえ、ヴィーン？",
		        "そうだね！確かに変だ。",
		        "北に変わった岩を見つけたと言ったのを覚えていますか？",
		        "いいえ、そうではありません",
		        "まあ、この岩があるんです。僕が言いたいのは、ここにあるもの全てが奇妙だということです。でもこの岩は、他の何よりもずっと奇妙な感じがします。",
		        "それは全く意味がわからない。でも、ちょっといじってみたら、宇宙の法則自体に何かを変えてしまった！",
		        "危険ではないですか？",
		        "わかりません。変化は微妙です。",
		        "他に何ができるんだろう。",
		        "わかった、ただ間違って宇宙を破壊しないようにね。",
		        "僕は最善を尽くします。",
		        "まあ、それが僕の人生で最もハードな岩だった！でも、今はもっと早く壊す方法を知っていると思う。",
		        "新しい石を手に入れましたか？",
		        "ええ、今までで一番変だね",
		        "うわー、宇宙への影響はそれほど微妙ではなかったかもしれませんね。君はそれを感じていますか？",
		        "何を感じますか？",
		        "まあ、それは僕だけかもしれません。",
		        "今、目の前に巨大なキューブが見えたりしませんでしたか？",
		        "ええと、冷蔵庫はカウントされますか？",
		        "まあ、気にしないでください",
		        "わあ、この新しいキューブは真っ黒だ。そして、どこか別世界のような感じがする。",
		        "前作よりも異世界っぽい？",
		        "それは違います！凍えるような寒さですが、害のあるものではありません。温度の概念が欠けていて、あなたと対話しないようなものです。君にとって意味が理解できれば、それは物質でできていませんし、色や馴染みのあるものでもありません。",
		        "正直に言って、そうではありません。",
		        "わかると思います。中空の石を使えば、何もないところから黒いものを凝縮させることができます。奇妙なことに同一の結晶を形成しますが、何の特性もありません。そしてそれは宇宙の異常を何らかの形で解決します。",
		        "エアフィルターのようだ",
		        "はい、その通りです！どこかで何かの間違いで空気を悪くしてしまったようです。",
		        "声に出して言う必要はありません",
		        "僕はその奇妙な岩を掘ることにしました。もしかしたら、内部で何が起こっているか答えがあるかもしれません。もしかしたら、あの岩を混乱させるだけではなく、何らかの形ですべてを制御しているのかもしれないと感じています。",
		        "なぜそう思うのですか？",
		        "僕がそれを感じていると言ったら信じてもらえますか？",
		        "もちろん！今なら何でも信じられると思います。宇宙を支配する岩？どうしてそうではないのでしょう！",
		        "発作が起きそうだ！",
		        "やめてくれ",
		        "これらのマシンはとても不愉快なほどうるさくなっているし、チカチカしている。何か手を加えて直したほうがいいかもしれない。あるいは自分をか。あるい調整すべきか。あるいはその両方か。",
		        "今、我々は話している！",
		        "それで、何を調整しましたか？",
		        "待って、何か変だ。",
		        "黒い素材であるものを作りました。そしてそれはマシンではありません。しかし、中間地点に何かをしました。",
		        "中間地点は何？",
		        "彼らは君の周りの宇宙を移動させます、それがあなたが別の場所に行く方法です。",
		        "どうやって彼らが君ではなく宇宙をシフトさせているのかを知っていますか？",
		        "うーん、それは考えていませんでした",
		        "宇宙を壊してしまったと思う",
		        "どれも意味がない！",
		        "機械には意味がありません、何も意味がありません。",
		        "これを修理できるといいな",
		        "ヴィーン？",
		        "君、そこにいるのか？",
		        "それだけはお願いだからやめてくれ！トイレにでも行ったのか何かだといいけど。",
		        "ヴィーン！",
		        "何？",
		        "それでも変だけど。",
		        "ああ、よかった！",
		        "何か新しいものを作りましたか？",
		        "僕は宇宙を壊し、君は永遠にいなくなったと思った！僕は冥界にいて、周りにシンボルがあり、これが宇宙の廃墟だと思っていた。でも、それは別の宇宙か、この宇宙の違うバージョンなんだ。",
		        "探検中、え？楽しそう！",
		        "楽しい？僕の文章読んだ？別の宇宙だ！",
		        "僕を驚かせる能力はもう尽きていることを受け入れなければならない。",
		        "そうだな",
		        "それは石ではありません、それはレンズです",
		        "すべてを一点に収束させることができる。つまりすべてだ！空間、時間、すべての概念とルール。すべてだ！",
		        "説明書か何かは見つかりましたか？",
		        "それがなぜそこにあり、僕たちがなぜここにいるのかはわかりません。ただなんとなく、それが何をするのかは今わかります。",
		        "それで...すべてを収束させるつもりですか、それとも何ですか？",
		        "どうすればいいのか分からない。でも、それがこの場所のポイントなのかもしれない。今はただ、それが本来の姿であるかのように宙に浮いている。",
		        "そして次に何が起こるのか？",
		        "分からない",
		        "考えれば考えるほど、本物でないのは君のマシンだけではないことがわかる。",
		        "具体的な質問を自分に投げかけてみるが、答えはない。",
		        "覚えていますか、警察があなたを探していると言ったことを？冗談ではありませんでした。しかし、自問自答すると全てが崩れてしまいます。",
		        "僕が警察署に来たのか、それとも電話したのか？誰がそこにいたのか？警官？その警察署は街のどこにあるんだ？この街は何だ？僕はこの街に住んでいるのか？街の名前は？それは何州？あるいは、州はあるのか？",
		        "質問にひとつも答えられない。質問を始めるまでは、すべてが普通に見えた。これ以上質問するのが怖い。",
		        "申し訳ない",
		        "いいえ、それは全く君のせいではありません。僕が見る限り、僕たちは同じ状況にあります。",
		        "僕はただ、このボートが何なのか見つけてほしい。",
		        "ああ、僕もだ！",
		        "どのような結末を迎えるのか見てみよう。これが永遠の地獄や虚無でないことを願うばかりだ。",
		        "見せてやれ、ダンテ！",
		        "来なくちゃ来なくちゃ。これらの連中はこの宇宙を干からびさせるべきだ！",
		        "石油会社っぽいですね",
		        "僕はすべてを少しでも効率的にするための微調整に疲れ、騒音にも疲れました。このマシンがすべてを変えるはずです。反対側を通り抜けるほどのパワーです。",
		        "危険ではないですか？",
		        "ここでの危険の概念はかなり曖昧だ。",
		        "何か大きなことを始める時だと思います。",
		        "何を考えているんだい？",
		        "よく分からない。でも大きいはずだ！",
		        "巨大な機械みたいな？",
		        "いや、比喩的に言っているんだ",
		        "それならやってみろ！",
		        "くそー",
		        "何か間違ったことをしてしまった。インバース　カズムが破壊されました。全てが崩壊しています。",
		        "大丈夫ですか？",
		        "はい、でも機械は破壊されています! 何も建てられないよ！くそ！",
		        "待って！それは起こるべきことかもしれませんか？",
		        "いいえ！そんなことはない！",
		        "どうやって知ったのですか？",
		        "ちょっと待って、これを何とか修正しないと",
		        "ここでは何も起こりません！",
		        "君が見える！あなたは今、銀河系上腕にあるおかしな惑星で、大きな栗の木の横を通り過ぎたところだ。",
		        "いや、僕はしていません！どの銀河ですか？",
		        "ああ、正確な時刻を言うのは難しいですが、おそらくまだ起こっていません。でも、150億年待ってください！",
		        "あなたは今、とても理にかなっている。こっちに来る？",
		        "間違いなく！いくつかの作業を終わらせる必要があるので、あと数時間でそちらに着きます、",
		        "わかりました、それではまた！",
		        "だが、頼むよ、チャープス",
		        "今回は遅れないでください",
		        "僕はしません、ヴィーン、しません！"
		    ],
		    "credits": [
		        "始まり",
		        "すべての始まりから最後までお付き合い頂き本当にありがとうございました",
		        "おめでとうございます！",
		        "これを見てください:",
		        "合計で採掘されたリソース：",
		        "カロナイト:",
		        "エルメリン:",
		        "カネタイト:",
		        "ベータピレン:",
		        "地獄の宝石：",
		        "クロマリット:",
		        "セレスティアル　フォーム:",
		        "ホローストーン:",
		        "空所:",
		        "現実:",
		        "構築されたマシン:",
		        "破壊されたマシン:",
		        "メートルでの最大チャンネル深さ：",
		        "奇妙な岩が突き刺さりました:",
		        "テレポート回数:",
		        "キューブのクリック数:",
		        "タイムワープ:",
		        "プレイ時間:",
		        "h",
		        "ゲーム制作者<br>オレグ・ダニロフ",
		        "追加グラフィック:<br>ユリア・ノグテヴァ",
		        "ダイアログ編集:<br>アブドゥラフマン・ズルムハノフとアンナ・ピーターソン",
		        "Steam publishing:<br>プレイザウルス",
		        "プレイテスト:<br>Leprosorium、Abdurahman Zulumhanov、Playsaurus のコミュニティ",
		        "終わり",
		        "今すぐクッキー クリッカーか何かをプレイしてみてもよいでしょう。",
		        "音楽:<br>Shallow Anne by Jake Chudnow",
		        "Deutsch: flex 4711, Patrick Karban",
		        "Português: selfemcrowdin, Mateus Iamarino",
		        "Italiano: doralum",
		        "Español: armangar, Syunay Kamenov",
		        "Français: KjetilVion, Etienne Samson, William (Ekitchi)",
		        "Nederlands: lievevandyck",
		        "Čeština: Jakub Strelinger",
		        "Polski: PolglishPL",
		        "日本語: Winna Tolentino",
		        "한국어: Ah Lon Sin, Sumin Park, Cyberowl",
		        "简体中文：Daisy Chan, kevinlee7, YuLun",
		        "繁體中文: Daisy Chan, kevinlee7",
		        "ไทย: They say P, Phimze Pym",
		        "Magyar: Simon Dániel és Márton-Mezey Csenge",
		        "Latviešu valoda: Roberts Artūrs Bumburs (Arburo)",
		        "Română: Eric Apetrei"
		    ],
		    "explainer": [
		        "押し続ける。",
		        "常に下のセルをクリックしてください。",
		        "<span class=\"keyboard\">Q</span>、 <span class=\"keyboard\">Esc</span> または右クリックしてキャンセルします。",
		        "<span class=\"keyboard\">Alt</span> を押し続けて、より詳しく見る。",
		        "空のセルの上で <span class=\"keyboard\">Q</span> を押して解体ツールを選んでください。",
		        "マシンの上で <span class=\"keyboard\">Q</span> を押して、もう一つ建ててみます。",
		        "WASD または右クリックとドラッグして周囲を見回します。"
		    ],
		    "random": {
		        "paste": "保存コードがクリップボードにコピーされました。安全な場所に貼り付けてください。",
		        "toolate": "何か救うには遅すぎます。すべてはすでに起こっています。",
		        "existed": "新規",
		        "steamWarning": "スチームエラーです。自動保存と実績は機能しません。ゲームを再起動してみてください。"
		    }
		},
		kr: {
		    "splash": {
		        "sixtyfour": "Sixty&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Four",
		        "continue": "<span>이어하기</span><div class=\"keyboard\">Esc</div>",
		        "start": "<span>시작하기</span><div class=\"keyboard\">Esc</div>",
		        "soundoff": "소리가 꺼져 있습니다.",
		        "soundon": "소리가 켜져 있습니다.",
		        "save": "저장하기",
		        "load": "불러오기",
		        "language": "언어: 한국어",
		        "reset": "초기화",
		        "credit": "©2024 Oleg Danilov, Playsaurus에서 퍼블리싱. 버전",
		        "warning": "모든것을 잃게 됩니다. 농담이 아니에요. 확정하려면 누르고 있으세요.",
		        "glory": "도전 과제",
		        "deglory": "뒤로가기",
		        "quit": "그만두기",
		        "export": "내보내기",
		        "import": "불러오기",
		        "flashbang": "게임 내 밝은 불빛이 깜빡이는 부분이 있습니다. 깜빡임에 민감하다면 이 버튼을 눌러 깜빡임을 비활성화 할 수 있습니다."
		    },
		    "achievements": [
		        {
		            "name": "황철석",
		            "description": "엘머린을 얻으세요"
		        },
		        {
		            "name": "짙은 보라",
		            "description": "카네타이트를 얻으세요"
		        },
		        {
		            "name": "대지의 피",
		            "description": "베타필렌을 얻으세요"
		        },
		        {
		            "name": "녹색 에너지",
		            "description": "지옥석을 찾으세요"
		        },
		        {
		            "name": "뜨거운 유리",
		            "description": "크로마릿을 찾으세요"
		        },
		        {
		            "name": "신성한 콘크리트",
		            "description": "천상의 거품을 얻으세요"
		        },
		        {
		            "name": "설거지도 할 수 있나요?",
		            "description": "중공석을 얻으세요"
		        },
		        {
		            "name": "태양이 비추지 않는 곳",
		            "description": "공허를 얻으세요"
		        },
		        {
		            "name": "유령 잡는 사람들",
		            "description": "현실을 얻으세요"
		        },
		        {
		            "name": "니체",
		            "description": "심연을 64번 응시하세요"
		        },
		        {
		            "name": "64,000",
		            "description": "돌 64,000개를 얻으세요"
		        },
		        {
		            "name": "64,000,000",
		            "description": "돌 64,000,000개를 얻으세요"
		        },
		        {
		            "name": "640억",
		            "description": "돌 640억개를 얻으세요"
		        },
		        {
		            "name": "지금 재설정 할 수 있습니다",
		            "description": "초반부터 막히기"
		        },
		        {
		            "name": "무한(?)동력",
		            "description": "두개의 저장고를 함께 배치하기"
		        },
		        {
		            "name": "휴식이 필요한가요?",
		            "description": "64시간동안 플레이하세요"
		        },
		        {
		            "name": "반드시... 파괴해야 한다",
		            "description": "큐브를 6400번 클릭하세요"
		        },
		        {
		            "name": "건축가",
		            "description": "64개의 기계를 건설하세요"
		        },
		        {
		            "name": "파괴자",
		            "description": "64개의 기계를 파괴하세요"
		        },
		        {
		            "name": "지옥을 부르는 자",
		            "description": "지옥 금고 9개를 보유하세요"
		        },
		        {
		            "name": "종료/시작",
		            "description": "인버스 캐즘을 폭발시키세요"
		        },
		        {
		            "name": "쿠키 클릭커",
		            "description": "쿠키를 클릭하세요"
		        },
		        {
		            "name": "술취한 선원",
		            "description": "이유없이 경적을 64회 울리세요"
		        },
		        {
		            "name": "미스터 마인",
		            "description": "9개의 굴착 경로를 보유하세요"
		        },
		        {
		            "name": "한계가 존재하나요?",
		            "description": "64km 깊이 파내려가세요"
		        },
		        {
		            "name": "홍길동",
		            "description": "64번 <s>1</s> 순간이동 하세요"
		        },
		        {
		            "name": "레드블루 암석",
		            "description": "15분동안 아무것도 삭제하지 않고 격납 저장고가 15개 미만인 상태로 게임을 완료하세요"
		        },
		        {
		            "name": "지옥으로 직행!",
		            "description": "시작 후 64분 내에 지옥석을 획득하세요"
		        },
		        {
		            "name": "수박 겉핥기",
		            "description": "64m 깊게 파내려가세요"
		        },
		        {
		            "name": "더운가요?",
		            "description": "640m 깊게 파내려가세요"
		        },
		        {
		            "name": "너무 깊다",
		            "description": "6400m 깊게 파내려가세요"
		        },
		        {
		            "name": "시속 64kmph 아래로 감속하세요",
		            "description": "새로운 굴착 경로를 배치한 후 6400m의 깊이를 6분 이내에 도달하세요"
		        },
		        {
		            "name": "새로운것에 대한 공포",
		            "description": "경로 추출기를 업그레이드하지 않고 게임을 완료하세요"
		        }
		    ],
		    "resources": [
		        "카로나이트",
		        "엘머린",
		        "카네타이트",
		        "베타필렌",
		        "지옥석",
		        "크로마리트",
		        "천상의 거품",
		        "속이 빈 돌",
		        "공허",
		        "현실"
		    ],
		    "entities": {
		        "pinhole": {
		            "name": "?",
		            "description": "U/D, C/S, T/B, E/νE, μ/νμ, τ/ντ, G/γ, Z/W, H, Δ/νΔ"
		        },
		        "gradient": {
		            "name": "기울어진 원천",
		            "description": "영구적으로 채굴할 수 있는 큐브입니다. 대부분의 불안정화기나 공진기에 반응합니다. 인버스 캐즘에 도체를 통해 연결되어야 합니다."
		        },
		        "chasm": {
		            "name": "인버스 캐즘",
		            "description": "미지의 세계로 가는 다리."
		        },
		        "conductor": {
		            "name": "도체",
		            "description": "인버스 캐즘을 산업용 저장고에 연결합니다."
		        },
		        "pump": {
		            "name": "경로 추출기",
		            "description": "자원을 추출하고 주변에 배치합니다."
		        },
		        "pump2": {
		            "name": "경로 굴착기",
		            "description": "경로 냉각기 업그레이드. 대량의 자원을 빠르게 굴착하고 그 주변에 더 넓게 배치한다."
		        },
		        "vault": {
		            "name": "지옥 금고",
		            "description": "환경으로부터 지옥석 1024개를 보호합니다."
		        },
		        "cube": {
		            "name": "자원 큐브",
		            "description": "추출된 자원"
		        },
		        "destabilizer": {
		            "name": "불안정화기",
		            "description": "큐브 옆에 놓으면 큐브가 두 배 빨리 부숴집니다. 작동하기 위해서는 엘머린이 필요합니다. 불안정화기의 효과는 중첩됩니다."
		        },
		        "destabilizer2": {
		            "name": "산업용 불안정화기",
		            "description": "불안정화기의 업그레이드입니다. 자원 분쇄 과정의 위력이 네 배로 증가합니다. 작동하려면 엘메린 64개가 필요합니다. 불안정화기의 효과는 중첩됩니다."
		        },
		        "destabilizer2a": {
		            "name": "지옥의 원석 불안정화기",
		            "description": "산업용 불안정화기 업그레이드. 추출된 큐브에 지옥석이 있을 때 자원 분쇄 위력이 625배 증가합니다. 지옥석이 없을때는 아무런 위력 증가가 없습니다. 작동하려면 지옥석 1개가 필요합니다. 불안정화기를 추가하면 효과가 중첩됩니다."
		        },
		        "doublechannel": {
		            "name": "경로 냉각기",
		            "description": "큐브 추출기 옆에 놓으면 큐브 추출 속도가 두 배 빨라집니다. 냉각기 효과는 중첩됩니다."
		        },
		        "doublechannel2": {
		            "name": "활성 경로 냉각기",
		            "description": "경로 냉각기 업그레이드. 옆에 놓으면 자원 경로의 흐름을 세 배로 증가시킵니다. 냉각기 효과는 중첩됩니다."
		        },
		        "valve": {
		            "name": "역방향 밸브",
		            "description": "큐브 추출기 옆에 놓으면 큐브 추출기가 원래 위치로 초기화되는 것을 방지합니다. 작동하려면 카로나이트가 필요합니다."
		        },
		        "auxpump": {
		            "name": "보조 펌프",
		            "description": "역방향 밸브의 업그레이드. 자원 경로 옆에 배치하면 자원 경로에 압력을 공급합니다. 작동하려면 엘메린 8개가 필요합니다. 추가 펌프는 자원 경로의 압력을 증가시키지 않습니다."
		        },
		        "auxpump2": {
		            "name": "펌프 스테이션",
		            "description": "보조 펌프 업그레이드. 자원 경로 옆에 배치하면 자원 경로에 4배의 압력을 제공합니다. 작동하려면 엘메린 256개와 베타필렌 4개가 필요합니다. 여러 개의 스테이션을 설치해도 자원 경로의 유량이 증가하지 않습니다."
		        },
		        "entropic": {
		            "name": "엔트로피 공진기",
		            "description": "큐브 옆에 배치하면 주기적으로 자원을 분쇄합니다. 작동하려면 카네타이트가 필요합니다."
		        },
		        "entropic2": {
		            "name": "엔트로피 공진기 II",
		            "description": "엔트로피 공진기 업그레이드. 자원을 3배 더 빠르게 분쇄합니다. 작동하려면 크로마리트가 필요합니다."
		        },
		        "entropic2a": {
		            "name": "엔트로피 축전기",
		            "description": "엔트로피 공명기 업그레이드. 자원이 표면에 나타나는 순간 600% 파워로 분쇄합니다. 단, 큐브당 한 번만 가능합니다. 작동하려면 크로마리트 8개가 필요합니다."
		        },
		        "entropic3": {
		            "name": "공허 공명기",
		            "description": "엔트로피 공명기 II 업그레이드입니다. 소멸이 발생할 때, 이 공명기는 주변의 큐브를 엄청난 힘으로 분쇄합니다."
		        },
		        "converter32": {
		            "name": "카로나이트 농축통",
		            "description": "카네타이트와 카로나이트를 천천히 반응시켜 엘머린을 생성합니다."
		        },
		        "converter13": {
		            "name": "카로나이트 집수조",
		            "description": "촉매가 있는 상태에서 액화된 카로나이트 침전물로부터 카네타이트를 회수합니다."
		        },
		        "converter41": {
		            "name": "베타필렌 산화기",
		            "description": "베타필렌을 연소시켜 카로나이트와 미량의 다른 원소를 생성합니다."
		        },
		        "converter76": {
		            "name": "천상 조사기",
		            "description": "천상의 거품을 크로마리트에 조사하여 거품을 크로마리트로 변환합니다. 이런 크로마리트 붕괴를 통해 지옥석과, 베타필렌, 카네타이트, 엘머린을 대량으로 확보할 수 있습니다."
		        },
		        "converter64": {
		            "name": "천상 반응로",
		            "description": "크로마리트와 천상의 거품의 제어 가능한 융합을 지원하여 베타필렌을 생산합니다. 다른 천상 반응로와 근접하여 작동할 수 없습니다."
		        },
		        "reflector": {
		            "name": "천상 반사기",
		            "description": "인접한 천상 반응로의 성능을 향상시킵니다."
		        },
		        "mega1": {
		            "name": "물질 스트리머 타워",
		            "description": "이동하는 자원을 압축하여 가시성을 높입니다. 하나만 만들 수 있습니다."
		        },
		        "mega1a": {
		            "name": "물질 스트리머 타워 MKII",
		            "description": "물질 스트리머 타워 업그레이드. 물질 전송 속도를 증가시킵니다. 하나만 만들 수 있습니다."
		        },
		        "mega1b": {
		            "name": "물질 스트리머 타워 MKIII",
		            "description": "물질 스트리머 타워 MKII의 업그레이드. 이동하는 자원을 더욱 압축합니다. 하나만 만들 수 있습니다."
		        },
		        "mega2": {
		            "name": "재활용 타워",
		            "description": "장치 파괴시 90%의 자원을 반환하는 재활용을 가능케 합니다. 하나만 만들 수 있습니다."
		        },
		        "mega3": {
		            "name": "분해 타워",
		            "description": "재활용 타워 업그레이드. 기계를 분해하여 모든 자원을 회수할 수 있습니다. 하나만 만들 수 있습니다."
		        },
		        "voidsculpture": {
		            "name": "공허 찬양 성단",
		            "description": "공허 기계의 시각적인 결점을 무시할 수 있습니다."
		        },
		        "eye": {
		            "name": "충전 표시기",
		            "description": "충전 준비가 된 기계를 표시합니다. 하나만 만들 수 있습니다."
		        },
		        "cookie": {
		            "name": "쿠키",
		            "description": "어떻게 그렇게 되었나요?"
		        },
		        "injector": {
		            "name": "지옥석 주입기",
		            "description": "인접한 큐브에 지옥석이 없으면 무작위로 하나의 자원을 지옥석으로 교체합니다. 지옥석 32개와 카네타이트 64개를 충전하여 32회 동작합니다."
		        },
		        "silo": {
		            "name": "지하 사일로",
		            "description": "활성화 할 때 주변의 기계를 재충전하고 이후에 자동으로 16회 더 재충전합니다."
		        },
		        "silo2": {
		            "name": "산업용 저장고",
		            "description": "지하 보관고의 업그레이드. 활성화 할 때 주변의 기계를 재충전하고 이후에 자동으로 64회 더 재충전합니다."
		        },
		        "vessel": {
		            "name": "격납 용기",
		            "description": "32개의 크로마리트를 저장하여 분열을 방지합니다. 지옥석을 소모합니다."
		        },
		        "vessel2": {
		            "name": "격납 저장고",
		            "description": "격납 용기를 업그레이드합니다. 32768개의 크로마리트를 저장하여 분열을 방지합니다. 현실을 소비합니다."
		        },
		        "consumer": {
		            "name": "촉매 정제소",
		            "description": "인접해있는 부서진 자원을 소비합니다. 1024개의 자원을 축적하면 추가 보너스와 함께 축적된 자원을 방출합니다. 보너스는 연속으로 방출할 때마다 증가하여 최대 100%에 도달합니다. 16초 동안 자원을 축적하지 않으면 효과가 초기화됩니다."
		        },
		        "preheater": {
		            "name": "촉매 예열기",
		            "description": "자원 변환기 옆에 배치하면 인접한 모든 자원 변환기의 속도가 증가합니다. 변환기 8대가 연결되면, 각 변환기는 예열기의 속도를 최대 300%까지 가속합니다."
		        },
		        "hollow": {
		            "name": "중공 노두",
		            "description": "구멍이 너무 많아요."
		        },
		        "strange": {
		            "name": "중공 바위",
		            "description": "한동안 그곳에 있었던 것 같습니다."
		        },
		        "strange1": {
		            "name": "중공 바위 연구소",
		            "description": "천상의 거품이 지옥석을 소멸시킬 때 64개가 아닌 512개를 소멸시키도록 합니다. 북쪽."
		        },
		        "strange2": {
		            "name": "중공 바위 시설",
		            "description": "중공석의 최대 양이 두 배로 늘어나고 생성 속도가 증가합니다."
		        },
		        "strange3": {
		            "name": "재건된 중공",
		            "description": "중공석의 생성 속도가 크게 증가하고 모든 작업은 조용히 수행됩니다."
		        },
		        "generaldecay": {
		            "name": "일반 부패 반응로",
		            "description": "크로마리트 붕괴 성능을 대폭 향상시킵니다. 하나만 만들 수 있습니다."
		        },
		        "waypoint": {
		            "name": "웨이포인트",
		            "description": "존재하는 다음의 웨이포인트를 순간이동시킵니다."
		        },
		        "annihilator": {
		            "name": "소멸기",
		            "description": "천상의 거품이 지옥석을 소멸시키면 공허를 생성합니다. 작동하기 위해서는 중공석이 필요합니다."
		        },
		        "flower": {
		            "name": "중공화",
		            "description": "시간 왜곡의 확률이 감소합니다. 중공석 한개의 효과를 상쇄합니다. 반드시 중공석 위에 세워져야 합니다. 건설할 때 그 자리의 중공석을 파괴합니다."
		        },
		        "fruit": {
		            "name": "중공과",
		            "description": "중공화의 진화. 스스로 영양을 공급하기 위해 중공석이 형성되는 것을 방지합니다. 중공석을 생산합니다."
		        },
		        "eraser": {
		            "name": "철거",
		            "description": "기계를 파괴하여 건설에 사용된 자원의 50%를 반환합니다."
		        },
		        "eraser2": {
		            "name": "재활용",
		            "description": "기계를 재활용하여 건설에 사용된 자원의 90%를 반환합니다."
		        },
		        "eraser3": {
		            "name": "분해",
		            "description": "기계를 분해하여 건설에 사용된 모든 자원을 반환합니다."
		        },
		        "clicker1": {
		            "name": "카네타이트 발진기",
		            "description": "자원을 클릭한 상태로 길게 눌러 부술 수 있게 합니다. 하나만 만들 수 있습니다."
		        },
		        "clicker2": {
		            "name": "지옥석 발진기",
		            "description": "카네타이트 발진기의 업그레이드. 발진 주기를 증가시킵니다. 하나만 만들 수 있습니다."
		        },
		        "clicker3": {
		            "name": "크로마리트 발진기",
		            "description": "지옥석 발진기의 업그레이드. 발진 주기를 최대로 끌어올립니다. 하나만 만들 수 있습니다."
		        },
		        "stabilizer": {
		            "name": "안정화기",
		            "description": "쇄도하는 에너지를 안정화하여 일시적으로 그 동력을 추출 합니다."
		        },
		        "stabilizer2": {
		            "name": "안정화기 II",
		            "description": "안정화기의 업그레이드 입니다. 안정성과 성능이 향상됩니다."
		        },
		        "stabilizer3": {
		            "name": "조각난 안정화기",
		            "description": "비정상적인 업그레이드입니다. 성능을 향상시키고 안정성을 극대화 합니다. 하나만 만들 수 있습니다."
		        }
		    },
		    "messages": [
		        "어디?",
		        "낯선 곳에 있어",
		        "뭐가 보이는데?",
		        "글쎄, 뭐가 딱히 보이지는 않는데. 익숙해보이는 기계가 하나 있는데 만지면 안될 것 같아.",
		        "무슨 기계?",
		        "잠깐만, 내가 한번...",
		        "뭐?! 그 이상한 기계를 만질거라는 소리는 지껄이지마!",
		        "헐 작동해! 방금 뭔가를 만들어냈어",
		        "???",
		        "거대한 검은색 큐브야. 너무 부드러워. 정말 부숴버리고 싶어",
		        "취했어?",
		        "이제 돌이 64개나 있어!",
		        "잘됐네. 즐거운 시간 보내.",
		        "노란 돌을 찾았어!",
		        "잘됐네!",
		        "내 생각엔 이제 기계도 만들 수 있을 것 같아. 큐브를 더 쉽게 부술 수 있는 기계를 만들어야겠어. 큐브가 인접한 셀에 대각선으로라도 나타나면 작동할거야.",
		        "잠깐만, 너 이상한 게임 하고 있는거야? 소름 끼치기 시작하는데",
		        "이 기계 안에 노란 돌을 넣기만 하면 돼!",
		        "널 행복하게만 한다면... 장난치는건 아니고, 오늘 올 거야?",
		        "당연하지! 몇가지 일만 마무리하고 몇 시간 안에 거기로 갈게!",
		        "정확이 뭘 하고 있는거야?",
		        "미안, 이따가 문자할게. 기계를 계속 눌러야 해서.",
		        "내 생각에는 기계가 인접하거나 대각선 셀에 배치될 때 서로 영향을 미치는 것 같아. 예를 들어서, 공정 속도를 높이려면 이 팬을 첫번째 기계 옆에 배치를 해야해.",
		        "암요, 그럼 그렇지.",
		        "그래서? 어떻게 되어가고 있어?",
		        "어디야?",
		        "진짜 오랫동안 널 기다리고 있어.",
		        "무슨 소리야? 난 아직도 여기 있어.",
		        "어디???",
		        "파란색 돌이 생겼어. 보라색인가? 골동품 놋쇠 촛대 같은 소리가 나는데. 잘못 놓인 기계를 치우는 데 사용할 수 있을 것 같아.",
		        "지금 장난해? 온다고 하지 않았어?!",
		        "진정해, 금방 갈게.",
		        "와, 빈 셀을 클릭하고 [Q] 를 사용해서 기계를 복제하거나 파괴할 수 있어! 그리고 [Alt] 는 높은 기계 뒤를 볼 수 있도록 도와주네.",
		        "8282",
		        "아직 거기 있어?",
		        "이런 젠장!!!",
		        "어디야????",
		        "너 괜찮아??",
		        "????",
		        "대체 무슨일이야?",
		        "너 괜찮아? 어디야?",
		        "진정해! 난 괜찮아, 무슨 일이야?",
		        "너가 말해봐! 너 지금 2주동안 내 연락을 씹었어! 네 집에도 갔는데 없었고. 어디에 있었는지만 말해줘. 지금 집에 있는거야?",
		        "임마, 무슨소리야? 우리 2분 전까지만 해도 문자하고 있었잖아.",
		        "무슨 소리야??? 처음에 너는 약속에 오지도 않았고, 완전히 사라졌었어. 그리고 지금은 아무 일도 없던 것처럼 행동하고 있고!",
		        "간단한 질문을 하고 있잖아.",
		        "도대체 어디야?",
		        "난 여기 있어.",
		        "어디",
		        "잠깐만...",
		        "전혀 웃기지 않아. 정확이 어디에 있냐고? 말해줄 수 있어?",
		        "음...",
		        "사실 나도 잘 모르겠어.",
		        "잠깐만",
		        "모르겠다는게 무슨 말이야?",
		        "생각 좀 정리해야겠어",
		        "괜찮은거 맞아? 안전한거야? 누구한테 연락하면 될까?",
		        "난 괜찮아. 난 그냥",
		        "조금만 있다 문자 보내줄게",
		        "얘는 무슨 짓을 벌이고 있는거야?",
		        "좀 무서운데?",
		        "내가 어디에 있는지도 모르겠어",
		        "나는 괜찮은데 뭔가 이상해. 여기가 어떻다고 설명할수가 없어.",
		        "꿈 같은데 꿈은 아니야. 온 세상이 하얀데 기계들이 있어. 큐브도 있고. 말도 안되는 상황이잖아!",
		        "취한것도 아닌데 왜이러지? 근데 또 지금까지 봐왔던 것과 완전히 다르다는 것을 전혀 눈치채지 못한것도 진짜 이상한데?",
		        "빨간 돌을 얻었는데, 지금 이 상황이 괜찮다는게 조금 소름돋아. 괜찮아, 그냥 빨간 돌일 뿐이니깐 괜찮을거야.",
		        "장난치는게 아니라는거지...",
		        "말이 안된다는 것은 알아. 하지만 정말로 내 눈앞에 펼쳐져 있어.",
		        "내가 어떻게 도와주면 될까?",
		        "그냥 나랑 이야기 해줘, 그거면 돼.",
		        "할 수 있어 임마. 아 그리고 경찰이 널 찾고 있어. 너가 실종된 것 처럼 찾던데?",
		        "우리가 문자한 내용 보여줬어?",
		        "그게 도움이 되겠냐? 자동 삭제 설정해놨어.",
		        "고마워!",
		        "거긴 상황이 어때?",
		        "키보드 키 WASD로 이동은 할 수 있데. 근데 북쪽에 있는 이상한 바위 말고는 주변에 볼만한게 없어.",
		        "네 핸드폰 나침반이 거기에서도 작동한다는거네!",
		        "음, 사실 \"윗쪽\"에 있어서 북쪽이라고 추측한거야.",
		        "말이 되긴 해",
		        "그리고 문제는 내가 핸드폰이 없다는거야...",
		        "그럼 어떻게 나랑 문자를 하는건데?",
		        "모르겠어!! 너한테 문자가 오면 그냥 알아. 그리고 답장도 할 수 있고! 너한테 어떻게 설명해야 할지 모르겠어.",
		        "너무 걱정하지마. 나랑 이야기할 수 있고 그것 만으로도 충분해.",
		        "맞지.",
		        "그럼... 이제 기계에 대해서 알려줘",
		        "뭔소리야?",
		        "그게 뭐고 무엇을 하고 어떻게 작동하는거야?",
		        "음, 보기에는 멋져보이긴 하고 케이블이랑 전선같은게 있어",
		        "예를 들어서, 큰 플라스틱 박스 같이 생겼는데 그 위에 파란색 돌이 들어가는 구리 코일도 있어. 그리고 옆면에 \"E-01SR\"이라고 적힌 큰 라벨이랑 \"주의! 강한 엔트로피가 방사됨\"이라고 작은 라벨에 적혀져있어.",
		        "그건 또 무슨 소리야?",
		        "사실 잘 모르겠어. 엔트로피 방사선이 있는거겠지.",
		        "잠깐만, 너가 만든 기계인 줄 알았는데?",
		        "맞지... 너가 무슨 말을 하는지는 알겠어.",
		        "어떻게든 큐브로 만들고는 있는데, 안에 뭐가 있는지는 모르겠어. 이상하게 들리기는 하네, 잠깐 생각해볼게.",
		        "아 그리고 노란색이랑 파란색 돌은 무한으로 나오는 것 같지는 않아서, 변환 장치나 새로운 광산에 투자해야 할 것 같아.",
		        "좋은 계획이야.",
		        "와 진짜 골때리네!",
		        "무슨 소리야?",
		        "초록색 돌이! 진짜 깨는데 오래걸려. 초록색 돌이 계속 나오면 어떻게 해야할 지 대책을 생각해봐야겠어.",
		        "너는 분명 그걸 위한 멋진 기계를 만들 수 있을거라 생각해!",
		        "그치!",
		        "당근이지! 지옥석을 만나면 당근을 흔들어줘.",
		        "당근 당근!",
		        "너가 예전에 기계에 대해서 물어봤던거 기억나?",
		        "응",
		        "내가 생각하기엔 진짜 같지가 않아.",
		        "그건 무슨 소리야?",
		        "꿈 같다고. 안을 들여다볼 수도 없고 옆에서 볼 수도 없어.",
		        "설명할 수 없는 기술에 대한 모호한 형태야.",
		        "내 생각에는 내가 이 기계의 기능을 인식하는 방법 때문에 이렇게 보이는 것 같아.",
		        "무언가로 나무를 베면 도끼처럼 보인다는 것 말인가?",
		        "응 약간 그런 느낌",
		        "적어도 나한테는 진짜처럼 들리기는 해.",
		        "맞아, 지금 유일하게 진짜인 것 같은 사람은 너 뿐이야",
		        "새로운 큐브들을 한 무더기 가지고 있는데, 이 큐브들이 다른 큐브들을 썩히고 있어!",
		        "뭐, 좋지도 나쁘지도 않네.",
		        "정말 이상한 말을 해야 하는데",
		        "방금 쓴 글에서 아이러니한 점이 보여?",
		        "이 이상한 곳 때문인지 모르겠지만, 너 이름을 까먹었어",
		        "그렇다면 우리가 좀 더 시간을 함께 보낼 수 있겠네",
		        "나 진지해",
		        "당연한 소리지만, 내 이름은 듀크 누켐이야.",
		        "임마 그만해!",
		        "방금 쟤가 한 말이야!",
		        "진짜 멍청한 짓인거 알지? 소름 끼치게 하지마. 도대체 무슨 일인거야?",
		        "젠장",
		        "내 생각엔 내 이름도 기억이 나지 않는 것 같아",
		        "그냥 할 수 없어. 정말 말도 안되게 미친 것 같아. 그리고 네 이름도 기억이 안 나!",
		        "어쩌면 집단 히스테리일지도? 한 번에 여러 사람에게 영향을 미칠 수 있다고 들었어. 일단 진정하고 무슨 일이 일어나는지 지켜보자고.",
		        "그래, 맞지, 히스테리지.",
		        "아직도 이름이 기억나지 않아.",
		        "나도, 그리고 더 있어",
		        "그럼 그렇지! 내가 어떻게 생겼는지도, 우리가 어디서 만났는지도 기억나지 않겠지?",
		        "집이 어떤 모습이고 누가 우리의 친구인지도 모르지? 우리가 만나기는 했을까?",
		        "우리 같은 상황에 갇혀있는 것 같아. 항상 그랬는지 아니면 어느 순간에 어떤 일이 일어났는지도 모르겠어. 이거 이상한 꿈이야? 누가 꿈꾸고 있는거겠지?",
		        "근처에 기계가 있어? 아니면 어디서 큐브가 튀어나온건가?",
		        "웃기네",
		        "음, 이름을 지어주자.",
		        "너 빈처럼 이야기하네.",
		        "그럴리가",
		        "빈에 대해서 별 생각은 없어.",
		        "빈, 하얼빈에 가서 그린빈이나 먹지 그래?",
		        "그리고 넌 샤프라고?",
		        "물론이지, 수능 샤프 7개 모아서 수능신이 강림했지.",
		        "말도 안되는 소리!",
		        "나는 샤프 좋아해. 만나서 반가워 빈",
		        "나도, 샤프",
		        "도대체 무슨 일이 일어나고 있는거야",
		        "뭐?",
		        "하얀색 큐브! 이것들이 초록색 큐브들을 파괴시키고 있어!",
		        "썩어가는 큐브도 엄청 많아. 원자로에 있는 것 같은 느낌이야!",
		        "맙소사, 너 괜찮은거야?",
		        "나는 괜찮아! 그냥 모든게 엉망진창이야. 이걸 처리할 무언가를 만들어야겠어. 북쪽에 있는 바위를 다시 살펴봐야할 것 같아.",
		        "너가 항상 하는 일이지 샤프!",
		        "이상하게 들려!",
		        "아니, 내 이름이 그런거야. 언젠가는 익숙해질거야. 그렇지 빈?",
		        "맞지! 정말 이상해.",
		        "내가 북쪽에 있는 이상한 바위에 대해서 이야기 했던거 기억나?",
		        "이해가 안되는데.",
		        "그니깐, 여기 바위가 있어. 그리고 오해하지 말고 들어. 여기에 있는 모든게 진짜 이상하다는 것을 깨달았는데, 이 바위가 정말 제일 이상해.",
		        "나도 이게 말이 안된다는 것을 알아. 근데 이걸 살짝만 찔러보잖아? 정말 이 세계의 규칙을 바꾼 느낌이야!",
		        "그게... 위험한거야?",
		        "모르겠어. 아주 조금 바뀌었어.",
		        "내가 또 할 수 있는게 있는지 잘 모르겠어.",
		        "알았어, 실수로 우주를 파괴하지 않도록 조심해.",
		        "최선을 다해볼게.",
		        "음, 이건 내 인생에서 가장 단단한 돌이였어! 근데 이제 어떻게 하면 더 빨리 깰 수 있을지 알 것 같아.",
		        "새로운 돌을 얻었어?",
		        "응, 그리고 지금까지 받은 것 중에 가장 이상해.",
		        "와, 어쩌면 우주가 미치는 영향이 그렇게 작지는 않나봐. 느껴져?",
		        "뭘 느껴?",
		        "글쎄, 아마 나만 느끼는 것 일지도.",
		        "근데 혹시 거대한 큐브를 너의 두 눈으로 본 적이 있어?",
		        "냉장고도 포함됨?",
		        "음... 아니야",
		        "우와 이 새로운 큐브는 새까맣다. 그리고 뭔가 저세상에서 온 큐브 같이 느껴져.",
		        "그 전 것보다 더 저세상 것 같아?",
		        "완전 달라! 얼어죽을것 같이 추운데, 위험한 정도는 아니야. 온도라는 개념도 없는것 같고 너와 반응하는것 같지 않아. 물질로 만들어진 것도 아니고 색이라던가 익숙한 것이 없어. 이게 말이 될지는 모르겠지만.",
		        "솔직히 전혀 이해가 되지 않아.",
		        "알 것 같아. 중공석을 사용해서 허공에서 검은 물질을 응축시킬 수 있어. 이상하게도 똑같은 결정을 형성하지만 어떤 성질도 갖지 않지. 그리고 이것이 우주의 이상 현상이 해결돼.",
		        "공기 필터 같은데?",
		        "맞아 정확해! 그리고 어느 순간 분위기를 망쳐버린 것 같음.",
		        "굳이 강조를 할 필요는 없는데",
		        "그 이상한 바위를 파헤쳐보기로 했어. 어쪄먼 안에서 무슨 일이 일어나고 있는지 알 수 있잖아. 모든 것을 망쳐버리는게 아니라, 통제할 수 있을지도 모른다는 생각이 들어!",
		        "왜 그렇게 생각하는데?",
		        "나의 직감이 느껴진다고 말하면 믿을거야?",
		        "당연하지! 지금이라면 무엇이든 믿을 수 있어. 우주를 지배하는 바위? 그치!",
		        "나 발작이 오는 것 같아!",
		        "그럼 그렇지.",
		        "이 기계들이 이제 정말 시끄럽고 너무 깜빡거려. 고쳐야 할 것 같아. 아니면 나를 고쳐야 할지도. 어쩌면 둘다.",
		        "이제 말이 통하네!",
		        "그래서 뭘 조정했어?",
		        "잠깐만, 뭔가 잘못된 것 같아.",
		        "검은 무언가로 어떤 것을 만들었어. 기계는 아니야. 근데 웨이포인트에 변화를 줬어.",
		        "웨이포인트가 뭔데?",
		        "너 주변에 있는 우주를 이동시켜. 다른 곳으로 이동할 수 있는 방법이지.",
		        "너가 움직이지 않고 우주가 옮겨진다는 것을 어떻게 알아?",
		        "흠, 그거에 대해선 생각을 해보지 않았는데",
		        "내 생각엔 내가 우주를 망가뜨린 것 같아.",
		        "말이 안된다는거 알지?!",
		        "기계도 말이 안돼, 사실 아무것도 말이 안돼.",
		        "내가 이걸 고칠 수 있으면 좋겠다.",
		        "빈?",
		        "야, 너 거기 있어?",
		        "제발 그러지마! 화장실이나 다녀온거라고 해줘.",
		        "빈!!",
		        "왜??",
		        "여전히 이상해.",
		        "천만다행이다!",
		        "새로운 것을 만들었어?",
		        "내가 우주를 망가뜨린줄 알았고 너가 영원히 사라진 줄 알았어! 주위에 몇가지 상징들이 있는 네더월드에 있었고 이게 우주의 폐허인 줄 알았어. 하지만 이곳은 또 다른 우주이거나 이 우주의 다른 버전인데, 비슷하고 이제는 연결되어 있어.",
		        "탐험한다고? 재밌어보이네!",
		        "재밌어보인다고? 내 문자를 읽고는 있는거야? 다른 우주라고!!!",
		        "너가 나를 놀라게 할 수 있는 능력치를 거의 다 써가고 있다는 것을 잊지마.",
		        "그럴 수 있지",
		        "바위가 아니라 렌즈야.",
		        "그것은 모든 것을 하나의 지점으로 수렴할 수 있어. 정말로 모든것을 말이야! 공간, 시간, 모든 개념과 규칙을 포함한 모든 것!",
		        "설명서 같은걸 찾았어?",
		        "나는 그게 왜 거기에 있고 우리는 여기 있는지 모르겠어. 지금 그것이 무엇을 하는지는 알고 있긴 해.",
		        "그래서... 모든 것을 통합하려고 하는거야?",
		        "잘 모르겠어. 근데 그게 이 장소의 핵심일수도 있지. 이제는 그냥 공중에 떠 있는 것 처럼 보여. 마치 그게 정상인 것 처럼 말이야.",
		        "그 다음에는 어떻게 되는데?",
		        "나도 모르겠어.",
		        "생각하면 할수록 진짜가 아닌 것은 기계 뿐만이 아니라는 것을 알 수 있어.",
		        "나는 정말 스스로에게 구체적인 질문을 하려고 하는데 해답을 찾지 못하겠어.",
		        "경찰이 너를 찾고 있다고 말했던 것 기억나? 장난치는게 아니였어. 하지만 이제 나 자신에게 질문해도 모든게 말이 되지 않아.",
		        "내가 경찰서에 갔나? 아니면 내가 경찰에 신고했나? 거기 누가 있었나? 경찰이 정말 맞았나? 이 도시에 경찰서는 어디에 있지? 도시는 뭐지? 내가 도시에 살고 있나? 도시의 이름은 뭐였지? 그리고 어떤 주에 있었지? 어쩌면 주 자체가 존재하긴 하나?",
		        "단 한 가지의 질문에도 답할 수가 없어. 질문을 하기 전까지 모든 것이 정상인줄 알았어. 이제는 더 이상 질문을 하기도 두려워.",
		        "미안해",
		        "아니야, 너의 탓은 전혀 아니야. 우리 둘 다 같은 상황에 처해있어.",
		        "그냥 이 상황이 무엇인지 너가 알아낼 수 있길 바라고 있어.",
		        "맞아 나도!",
		        "어떻게 끝나는지 보자. 빠져나올 수 없는 지옥이 아니길만 바라고 있어.",
		        "나도.",
		        "이제 말이 통하네. 이 녀석들이 우주를 말려벌어야해!",
		        "말을 독특하게 하네.",
		        "모든 것을 조금 더 효율적으로 조정하는 것도 지쳤고, 소음도 나를 너무 피곤하게 해. 이 기계의 모든 것을 바꿔버려야해. 심지어 다른 쪽은 찢어지고 있다고.",
		        "위험하지 않아?",
		        "여기서 위험하다는 개념은 상당히 모호해.",
		        "이제 뭔가를 할 때가 온 것 같아.",
		        "무슨 생각을 하고 있는데?",
		        "잘 모르겠어, 하지만 뭔가 큰 일을 해야겠어!",
		        "화장실에서... 큰 일을 본다는건가?",
		        "아니 당연히 은유적으로 말하고 있는거지.",
		        "그럼 해봐!",
		        "오 젠장",
		        "내가 뭔가를 잘못한 것 같아. 인버스 채즘이 파괴됐어. 모든 것이 무너지고 있어.",
		        "너 괜찮아?",
		        "난 괜찮은데 기계가 파괴되고 있어. 아무것도 만들 수 없다고! 제길!",
		        "잠깐만! 일어나야 할 일이 일어난 건 아닐까?",
		        "아니야 절대 아니야!",
		        "너가 어떻게 아는데?",
		        "잠깐만 어떻게든 고쳐봐야겠어.",
		        "한번 해보자구!",
		        "너가 보여! 저기 은하계 팔 위 쪽 웃긴 행성에 있는 거대한 밤나무를 지나갔지?!",
		        "아니? 어떤 은하계?",
		        "정확한 시간을 말하기는 어려운데. 아마 아직 일어나지 않았을거야. 150억년만 기다려봐!",
		        "와 정말 말이 되는 소리를 해라! 근데 이따 올거야?",
		        "당연하지! 몇가지 일만 마무리하고 몇 시간 안에 거기로 갈게!",
		        "그래, 이따 봐!",
		        "제발, 차프스",
		        "이번에는 늦지마.",
		        "정말 안늦어. 정말로!"
		    ],
		    "credits": [
		        "시작",
		        "모든 것이 시작되는 마지막 순간까지 와줘서 정말 고마워.",
		        "음.. 축하해!",
		        "이것 좀 봐봐:",
		        "총 채굴된 자원:",
		        "카로나이트:",
		        "엘머린:",
		        "카네타이트:",
		        "베타필렌:",
		        "지옥석:",
		        "크로마리트:",
		        "천상의 거품:",
		        "중공석:",
		        "공허:",
		        "현실:",
		        "제작된 기계:",
		        "파괴된 기계:",
		        "최대 채널 깊이(미터):",
		        "이상한 바위가 찔린 횟수:",
		        "순간 이동한 횟수:",
		        "큐브 클릭수:",
		        "시간 왜곡:",
		        "플레이 시간:",
		        "시간",
		        "게임 제작자:<br>Oleg Danilov",
		        "추가 그래픽:<br>Yulia Nogteva",
		        "대화 편집:<br>Abdurahman Zulumhanov 및 Anna Peterson",
		        "스팀 퍼블리싱:<br>Playsaurus",
		        "플레이 테스트:<br>Leprosorium 커뮤니티, Abdurahman Zulumhanov, Playsaurus",
		        "끝",
		        "이제 쿠키 클리커와 같은 게임을 플레이하러 가보세요.",
		        "음악:<br>Shallow Anne by Jake Chudnow",
		        "Deutsch: flex 4711, Patrick Karban",
		        "Português: selfemcrowdin, Mateus Iamarino",
		        "Italiano: doralum",
		        "Español: armangar, Syunay Kamenov",
		        "Français: KjetilVion, Etienne Samson, William (Ekitchi)",
		        "Nederlands: lievevandyck",
		        "Čeština: Jakub Strelinger",
		        "Polski: PolglishPL",
		        "日本語: Winna Tolentino",
		        "한국어: Ah Lon Sin, Sumin Park, Cyberowl",
		        "简体中文：Daisy Chan, kevinlee7, YuLun",
		        "繁體中文: Daisy Chan, kevinlee7",
		        "ไทย: They say P, Phimze Pym",
		        "Magyar: Simon Dániel és Márton-Mezey Csenge",
		        "Latviešu valoda: Roberts Artūrs Bumburs (Arburo)",
		        "Română: Eric Apetrei"
		    ],
		    "explainer": [
		        "길게 누르세요.",
		        "항상 아래의 셀을 클릭하세요.",
		        "<span class=\"keyboard\">Q</span>, <span class=\"keyboard\">Esc</span> 를 누르거나 마우스 오른쪽 버튼을 클릭하여 취소하세요.",
		        "<span class=\"keyboard\">Alt</span> 을 누르면 자세히 살펴볼 수 있습니다.",
		        "빈 셀 위에 <span class=\"keyboard\">Q</span> 을 눌러 철거 도구를 선택합니다.",
		        "기계 위에서 <span class=\"keyboard\">Q</span> 을 눌러서 더 만들어 보세요.",
		        "WASD 키를 사용하거나 마우스 오른쪽 버튼을 클릭하고 드래그하여 주변을 둘러보세요."
		    ],
		    "random": {
		        "paste": "저장 코드가 클립보드에 복사되었습니다. 이제 안전한 곳에 저장 코드를 붙여넣으세요.",
		        "toolate": "무언가를 구하기엔 너무 늦었습니다, 이미 모든 일이 일어났어요.",
		        "existed": "신규",
		        "steamWarning": "스팀 오류입니다. 자동 저장 및 업적이 작동하지 않습니다. 게임을 다시 실행해 보세요."
		    }
		},
		sch: {
		    "splash": {
		        "sixtyfour": "陆&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;肆",
		        "continue": "<span>继续</span><div class=\"keyboard\">Esc</div>",
		        "start": "<span>开始</span><div class=\"keyboard\">Esc</div>",
		        "soundoff": "声音已关闭",
		        "soundon": "声音已开启",
		        "save": "保存",
		        "load": "加载",
		        "language": "语言：简体中文",
		        "reset": "重置",
		        "credit": "©2024 Oleg Danilov，由 Playsaurus 出版。版本",
		        "warning": "你会失去一切，我没骗你。继续按住以确认。",
		        "glory": "成就",
		        "deglory": "返回",
		        "quit": "退出",
		        "export": "导出",
		        "import": "导入",
		        "flashbang": "游戏包含强光频闪画面。如果你对它们敏感请考虑通过点击此图标以禁用它们。"
		    },
		    "achievements": [
		        {
		            "name": "假冒的金",
		            "description": "获得埃尔梅林"
		        },
		        {
		            "name": "紫气东来",
		            "description": "获得卡内特石"
		        },
		        {
		            "name": "大地之血",
		            "description": "获得贝塔派伦"
		        },
		        {
		            "name": "绿色能源",
		            "description": "获得地狱宝石"
		        },
		        {
		            "name": "炽热玻璃",
		            "description": "获得铬马利特"
		        },
		        {
		            "name": "神圣砼土",
		            "description": "获得天体泡沫"
		        },
		        {
		            "name": "刷碗神器",
		            "description": "获得空心石"
		        },
		        {
		            "name": "无尽深渊",
		            "description": "获得虚空石"
		        },
		        {
		            "name": "捉鬼敢死队",
		            "description": "获得现实石"
		        },
		        {
		            "name": "尼采",
		            "description": "凝视深渊64次"
		        },
		        {
		            "name": "64K",
		            "description": "获得64,000块石头"
		        },
		        {
		            "name": "64M",
		            "description": "获得64,000,000,000块石头"
		        },
		        {
		            "name": "64B",
		            "description": "获得64,000,000,000块石头"
		        },
		        {
		            "name": "您重开罢",
		            "description": "一开始就卡住"
		        },
		        {
		            "name": "永动机",
		            "description": "将两个筒仓放在一起"
		        },
		        {
		            "name": "需要休息吗？",
		            "description": "玩64小时"
		        },
		        {
		            "name": "必须……摧毁",
		            "description": "点击资源立方体6400次"
		        },
		        {
		            "name": "建筑师",
		            "description": "建造64台机器"
		        },
		        {
		            "name": "拆迁办",
		            "description": "摧毁64台机器"
		        },
		        {
		            "name": "地狱行者",
		            "description": "拥有9个地狱金库"
		        },
		        {
		            "name": "结束/开始",
		            "description": "引爆逆裂缝"
		        },
		        {
		            "name": "饼干点击器",
		            "description": "点击饼干"
		        },
		        {
		            "name": "醉酒水手",
		            "description": "无故鸣笛64次"
		        },
		        {
		            "name": "矿工先生",
		            "description": "拥有9条挖掘通道"
		        },
		        {
		            "name": "有下限吗？",
		            "description": "挖掘64公里深"
		        },
		        {
		            "name": "赛斯·布朗多",
		            "description": "传送 <s>1</s> 64次"
		        },
		        {
		            "name": "红蓝岩",
		            "description": "在不删除任何东西的情况下，游戏进行15分钟并且拥有少于15个隔离仓"
		        },
		        {
		            "name": "直奔地狱！",
		            "description": "开始后的64分钟内获得地狱宝石"
		        },
		        {
		            "name": "流于表面",
		            "description": "挖掘64米深"
		        },
		        {
		            "name": "它热吗？",
		            "description": "挖掘640米深"
		        },
		        {
		            "name": "深渊",
		            "description": "挖掘6400米深"
		        },
		        {
		            "name": "快速下坠",
		            "description": "在放置新的挖掘通道后于6分钟内达到6400米的深度"
		        },
		        {
		            "name": "新事物恐惧症",
		            "description": "在不升级提取通道的情况下完成游戏"
		        }
		    ],
		    "resources": [
		        "查伦石",
		        "埃尔梅林",
		        "卡内特石",
		        "贝塔派伦",
		        "地狱宝石",
		        "铬马利特",
		        "天体泡沫",
		        "空心石",
		        "虚空石",
		        "现实石"
		    ],
		    "entities": {
		        "pinhole": {
		            "name": "？",
		            "description": "U/D、C/S、T/B、E/νE、μ/νμ、τ/ντ、G/γ、Z/W、H、Δ/νΔ"
		        },
		        "gradient": {
		            "name": "渐变井",
		            "description": "一个永久的可开采立方体。对大多数去稳定器和共振器做出响应。应通过导体连接到逆裂缝。"
		        },
		        "chasm": {
		            "name": "逆裂缝",
		            "description": "通往未知的桥。"
		        },
		        "conductor": {
		            "name": "导体",
		            "description": "将逆裂缝与工业筒仓连接起来。"
		        },
		        "pump": {
		            "name": "提取通道",
		            "description": "提取资源并将其放置在自身周围。"
		        },
		        "pump2": {
		            "name": "挖掘通道",
		            "description": "提取通道升级。快速挖掘大量资源并将其放置在自身周围更远的地方。"
		        },
		        "vault": {
		            "name": "地狱金库",
		            "description": "将1024颗地狱宝石与周遭隔绝。"
		        },
		        "cube": {
		            "name": "资源立方体",
		            "description": "提取的资源。"
		        },
		        "destabilizer": {
		            "name": "去稳定器",
		            "description": "将周围资源立方体的破坏速度提高至2倍。需要1个埃尔梅林才能运作。额外的不稳定器会增加效果。"
		        },
		        "destabilizer2": {
		            "name": "工业去稳定器",
		            "description": "去稳定器的升级版。可以将资源粉碎过程的威力提高至4倍。需要64个埃尔梅林才能运作。额外的不稳定器可以增加效果。"
		        },
		        "destabilizer2a": {
		            "name": "地狱宝石去稳定器",
		            "description": "工业去稳定器的升级版。当开采的立方体中存在地狱宝石时，资源粉碎过程的威力提高至625倍，否则不会提供任何好处。需要1颗地狱宝石才能运作。额外的不稳定器可以增加效果。"
		        },
		        "doublechannel": {
		            "name": "通道冷却器",
		            "description": "将其放置在立方体开采装置旁边，开采速度提高至2倍。额外的冷却器可增强效果。"
		        },
		        "doublechannel2": {
		            "name": "主动式通道冷却器",
		            "description": "通道冷却器升级。如果放置在资源通道旁边，则其流量将增加至3倍。额外的冷却器可增强效果。"
		        },
		        "valve": {
		            "name": "反向阀",
		            "description": "如果放置在立方体开采装置旁边，可防止开采装置重置到原始位置。需要1块查伦石才能运作。"
		        },
		        "auxpump": {
		            "name": "辅助泵",
		            "description": "反向阀的升级版。如果放置在资源通道旁边，则会为通道提供压力。需要8个埃尔梅林才能运作。额外的泵不会增加通道中的压力。"
		        },
		        "auxpump2": {
		            "name": "抽水站",
		            "description": "辅助泵的升级版。如果放置在资源通道旁边，可提供4倍压力。需要256个埃尔梅林和4个贝塔派伦才能运作。多个抽水站并不会增加通道中的流量。"
		        },
		        "entropic": {
		            "name": "熵共振器",
		            "description": "如果放置在立方体旁边，则会定期粉碎资源。需要1块卡内特石才能运作。"
		        },
		        "entropic2": {
		            "name": "熵共振器 II",
		            "description": "熵共振器的升级版。粉碎资源的速度提高至3倍。需要1个铬马利特才能运作。"
		        },
		        "entropic2a": {
		            "name": "熵电容器",
		            "description": "熵共振器的升级版。在资源出现在表面的那一刻以600%的力量进行粉碎。但每个立方体仅限一次。需要8个铬马利特才能运作。"
		        },
		        "entropic3": {
		            "name": "虚空共鸣器",
		            "description": "熵共振器 II的升级版。当湮灭发生时，共振器会以巨大的力量粉碎周围的立方体。"
		        },
		        "converter32": {
		            "name": "查伦石浓缩槽",
		            "description": "卡内特石与查伦石缓慢反应产生埃尔梅林。"
		        },
		        "converter13": {
		            "name": "查伦石坑",
		            "description": "在催化剂作用下从液化的查伦石沉积物中回收卡内特石。"
		        },
		        "converter41": {
		            "name": "贝塔派伦氧化塔",
		            "description": "燃烧贝塔派伦以产生查伦石和微量其他元素。"
		        },
		        "converter76": {
		            "name": "天体辐射器",
		            "description": "用铬马利特照射天体泡沫，将泡沫转化为铬马利特，由于铬马利特衰变，它是地狱宝石、贝塔派伦、卡内特石 和埃尔梅林的重要来源。"
		        },
		        "converter64": {
		            "name": "天体反应器",
		            "description": "允许铬马利特和天体泡沫的可控融合来生产贝塔派伦。无法在其他天体反应器附近运作。"
		        },
		        "reflector": {
		            "name": "天体反射器",
		            "description": "提升相邻的天体反应器的性能。"
		        },
		        "mega1": {
		            "name": "物料传输塔",
		            "description": "通过压缩移动资源来提高可见性。只能有一个。"
		        },
		        "mega1a": {
		            "name": "物料传输塔 MKII",
		            "description": "物料串流塔升级。提高资源传输速度。只能有一个。"
		        },
		        "mega1b": {
		            "name": "物料传输塔 MKIII",
		            "description": "物料传输塔MKII升级版。进一步压缩移动资源。只能有一个。"
		        },
		        "mega2": {
		            "name": "回收塔",
		            "description": "允许拆除机器时回收90%的资源。只能有一个。"
		        },
		        "mega3": {
		            "name": "拆解塔",
		            "description": "回收塔的升级。允许机器拆除时返还所有资源。只能有一个。"
		        },
		        "voidsculpture": {
		            "name": "虚空仰慕圣坛",
		            "description": "使你能够无视虚空机器造成的视线阻挡。"
		        },
		        "eye": {
		            "name": "填料指导器",
		            "description": "表示机器已准备好进行填充。只能有一个。"
		        },
		        "cookie": {
		            "name": "一块饼干",
		            "description": "你怎么在这啊？"
		        },
		        "injector": {
		            "name": "地狱宝石注射器",
		            "description": "如果没有地狱宝石，则将相邻资源立方体中的一个随机资源与地狱宝石交换。如果提供32颗地狱宝石和64颗卡内特石，则可交换32次。"
		        },
		        "silo": {
		            "name": "地下筒仓",
		            "description": "激活后为附近的机器充能，并且之后会自动再充能16次"
		        },
		        "silo2": {
		            "name": "工业筒仓",
		            "description": "地下筒仓升级。激活后会重新填充附近的机器，然后自动再填充 64 次"
		        },
		        "vessel": {
		            "name": "密封容器",
		            "description": "储存32个铬马利特，防止它们裂变。消耗1个地狱宝石。"
		        },
		        "vessel2": {
		            "name": "密封筒仓",
		            "description": "密封容器的升级版。储存32768个铬马利特以防止它们裂变。消耗现实石。"
		        },
		        "consumer": {
		            "name": "催化炼油厂",
		            "description": "消耗相邻的损坏资源立方体。累积1024资源后，它会释放所有资源并附带额外奖励。连续释放可使奖励金额增加，最高可达100%。如果16秒内没有消耗任何资源，效果就会重设。"
		        },
		        "preheater": {
		            "name": "催化预热器",
		            "description": "如果放置在任何资源转换机旁边则可以增加该机器的转换速度。每增加一台转换机，预热器的速度提升就会增加。如果影响到8台机器，最高可达300%。"
		        },
		        "hollow": {
		            "name": "镂空岩石",
		            "description": "这么多洞。"
		        },
		        "strange": {
		            "name": "中空岩",
		            "description": "看起来已经有一段时间了。"
		        },
		        "strange1": {
		            "name": "空心石研究所",
		            "description": "使每块天体泡沫以512颗而非64颗地狱宝石的比率进行湮灭。位于北方。"
		        },
		        "strange2": {
		            "name": "空心石设施",
		            "description": "将空心石的最大数量加倍，并增加它们的生成速率。"
		        },
		        "strange3": {
		            "name": "重构空心石",
		            "description": "显著提高空心石的生成速度并默默地完成一切。"
		        },
		        "generaldecay": {
		            "name": "通用衰变反应器",
		            "description": "显著提高的铬马利特衰减性能。只能有一个。"
		        },
		        "waypoint": {
		            "name": "航点",
		            "description": "将下一个现有的导航点传送到你的位置。"
		        },
		        "annihilator": {
		            "name": "歼灭者",
		            "description": "当地狱宝石被天体泡沫消灭时会产生虚空。需要空心石才能运作。"
		        },
		        "flower": {
		            "name": "空心花",
		            "description": "减少时间扭曲的机会。抵销一块空心石的效果。必须建造在空心石上，同时摧毁这块空心石。"
		        },
		        "fruit": {
		            "name": "空心果",
		            "description": "空心花的进化体。通过防止空心石的形成以滋养自身。可生产空心石。"
		        },
		        "eraser": {
		            "name": "拆除",
		            "description": "摧毁一台机器，归还建造它所用资源的50%。"
		        },
		        "eraser2": {
		            "name": "回收",
		            "description": "回收一台机器，归还建造它所用资源的90%。"
		        },
		        "eraser3": {
		            "name": "拆解",
		            "description": "拆解一台机器，归还建造它所用的所有资源。"
		        },
		        "clicker1": {
		            "name": "卡内特石振荡器",
		            "description": "允许您点击并按住资源以破坏它们。只能有一个。"
		        },
		        "clicker2": {
		            "name": "地狱宝石振荡器",
		            "description": "卡内特石振荡器的升级。增加振荡频率。只能有一个。"
		        },
		        "clicker3": {
		            "name": "铬马利特振荡器",
		            "description": "地狱宝石振荡器的升级。最大化振荡频率。只能有一个。"
		        },
		        "stabilizer": {
		            "name": "稳定器",
		            "description": "稳定一个相邻的浪涌以暂时利用其能量。"
		        },
		        "stabilizer2": {
		            "name": "稳定器 II",
		            "description": "稳定器升级。提高稳定性和性能。"
		        },
		        "stabilizer3": {
		            "name": "破碎的稳定器",
		            "description": "异常升级。提高性能并最大程度提高稳定性。只能有一个。"
		        }
		    },
		    "messages": [
		        "你在哪？",
		        "真·荒无人烟之地",
		        "行，能看见啥？",
		        "额，没啥。这里有一台机器，看着有点眼熟，但又说不上来",
		        "什么机器？",
		        "等一下，也许我可以...",
		        "等会，你别是在乱摸一台不知道是啥的机器吧！",
		        "它运作了！它刚刚创造了一些东西",
		        "???",
		        "一个巨大的黑色立方体。真是太光滑了。我真的很想敲碎它",
		        "你没事吧?",
		        "我现在有64块石头了！",
		        "那好吧。祝你玩得开心。",
		        "嘿，我找到一块黄色的石头！",
		        "好样的",
		        "我想我现在可以建造机器了。我应该建造一些东西来帮助更轻松地打破这些立方体。如果一个立方体出现在相邻的单元格中，即使是对角线，它也应该起作用。",
		        "等等，你是在玩什么奇怪的游戏吗？别吓我",
		        "现在我只需要将一块黄色的石头放进这台机器。",
		        "你开心就好……哦对了，你今天要过来吗？",
		        "当然！几小时后到，只需先完成这个。",
		        "你究竟在做什么？",
		        "我稍后会给你发短信。我需要继续推动机器，抱歉。",
		        "我认为当机器放置在相邻或对角的单元格中时，机器会相互影响。例如，风扇需要放置在第一台机器旁边以加快流程。",
		        "你现在说得很有道理",
		        "吗?",
		        "你在哪？",
		        "我们已经等你很久了。",
		        "你急什么？我还在这没动。",
		        "哪里???",
		        "我现在有一块蓝色，额也可能是紫色的石头了。 听起来像一个古董黄铜烛台。我想我可以用它来移除放错地方的机器。",
		        "你在开玩笑吗？我以为你说你要来。到底怎么回事？！",
		        "冷静点，我一会儿就到",
		        "哇，我可以使用[Q]来复制机器或先在空白方格点击然后摧毁它们！而且[Alt]可以帮助查看高大机器后面的情况。",
		        "快点",
		        "你们还在吗？",
		        "哎呦我去！",
		        "跑哪去了？",
		        "你没事吧？？",
		        "????",
		        "什么鬼？",
		        "你还好吗？你在哪里？",
		        "冷静点，兄弟！我没事，怎么了？",
		        "好意思问我！你已经鬼鬼祟祟地躲着我两个星期了！我甚至去你家几次，但你都不在。就告诉我你在哪里，没别的。你现在在家吗？",
		        "兄弟，你在说什么？我们事实上在两分钟前才互发短信。",
		        "你到底怎么了??? 你先是没有出现，然后彻底没影了。现在你却表现得像什么事都没发生一样！",
		        "我问你一个简单的问题",
		        "你在哪里？",
		        "我在这里。",
		        "哪里",
		        "等一下……",
		        "这一点也不好笑。你到底在哪里？你能告诉我吗？",
		        "额……",
		        "兄弟，我其实不知道。",
		        "让我想想",
		        "你不知道你在哪吗？",
		        "我需要整理思绪",
		        "一切都还好吗？你安全吗？我应该找人吗？",
		        "不，我很好。我只是",
		        "我一会儿给你发短信",
		        "该死，兄弟。怎么了？",
		        "我很害怕",
		        "看来我不知道我在哪里",
		        "这太奇怪了。就是，我这个人一切都很好。但我无法形容这个地方。",
		        "就像一场梦，但又不是。一切都是白色的，还有这些机器。还有立方体。我搞不清这一切。",
		        "我并没有嗑药或咋地。我只是突然意识到，从未注意到这些与我所见过的任何事物都不同，很奇怪。",
		        "现在我得到了红色宝石，我对这一切有点平静得吓人。好吧，只是一块红色的石头，一切都好。",
		        "所以你不是在开玩笑…",
		        "我现在明白这一切听起来如何了。但是，额，对，这一切都在我眼前。",
		        "我可以为你做些什么？",
		        "跟我说话，就这样。",
		        "OK兄弟，你别担心。对了，警察现在正在找你。你像失踪了一样。",
		        "你给他们看了我们的聊天记录吗？",
		        "有用吗？没，何况我开启了自动删除。",
		        "谢谢！",
		        "那边情况如何？",
		        "嗯，事实证明我可以使用 WASD 来移动。但除了北方这块奇怪的岩石之外，周围没有什么有趣的东西。",
		        "所以你的手机指南针在那里可以运作！",
		        "嗯，从这里看就是「上」的方向，所以我猜那是北方。",
		        "合理",
		        "而且问题是我没有手机…",
		        "那你是怎么给我发短信的？",
		        "我不知道！！你给我发消息时我才知道。而且我可以回覆你！我怎么跟你解释呢。",
		        "别像那个了。我们能交谈已经谢天谢地了",
		        "对，太对了",
		        "那么……跟我说说那些机器吧",
		        "说啥？",
		        "它们是什么、做什么、如何运作？",
		        "嗯，它们看起来很漂亮，有一些电缆和电线之类的东西",
		        "例如，其中一个看起来像一个大塑胶盒子，顶部有一个铜线圈，里面放着一块蓝色的石头。而且侧面有一个大标签写着“E—01SR”，还有一个较小的标签“注意！强熵辐射”",
		        "什么意思？",
		        "我不知道。我猜那里有一些熵辐射。",
		        "等等，我以为这些机器是你制造的？",
		        "行吧……我大概知道你为啥这样想了。",
		        "我只是透过立方体以某种方式制作它们。但我不知道里面是什么。不是，这什么怪话，让我思考一下。",
		        "顺带一提，黄色和蓝色的石头似乎不是无限的，所以我真的应该考虑那些转换器或一座新矿场。",
		        "听起来很有计划",
		        "真是头大！",
		        "啊？",
		        "一块绿色的石头！要花很长时间才能打破它。如果它们继续出现，我得想法解决。",
		        "你肯定会为此制作一台精巧的机器！",
		        "一包辣条！",
		        "那当然了！地狱宝石，可得小心。",
		        "给他们好看！",
		        "记得你问过关于机器的事吗？",
		        "嗯",
		        "我不认为它们是真实的",
		        "什么意思？",
		        "就像在梦中一样。我无法看到里面，甚至无法从另一边看到它们。",
		        "这是对无法解释的技术的模糊表述",
		        "我认为这些机器看起来像这样只是因为我如何看待它们的功能。",
		        "如果有东西可以砍倒树木，它应该看起来像一把斧头吗？",
		        "类似的东西",
		        "好吧，至少你对我来说听起来很真实",
		        "是的，我想你现在对我来说是唯一真实的存在",
		        "我有一堆新的立方体，它们正在衰变成其他立方体！",
		        "嗯，不是很好，也不是很糟糕",
		        "我必须说一件非常奇怪的事",
		        "你看到你刚才写的内容言语间的讽刺吗？",
		        "或许是因为这个奇怪的地方，我不知怎么忘记了你的名字",
		        "嗯，我想我们可以再多花点时间在一起",
		        "认真的",
		        "我的名字明显是毁灭公爵。",
		        "什么玩应！",
		        "她就是这么说的！",
		        "太傻逼了！别再吓我了。到底发生了什么事？",
		        "我靠",
		        "看来我也不记得自己的名字了",
		        "我就是做不到！这简直是疯了。而且我记不起你的名字！",
		        "或许这只是一种集体歇斯底里的情况？我听说它可以一次影响多人。我们就冷静下来，看看会发生什么。",
		        "是的，对，歇斯底里",
		        "我仍然想不起名字",
		        "我也想不起。而且不止名字",
		        "对！我长什么样？我们什么时候认识的？",
		        "我的家什么样子，我们的朋友是谁？我们有见过面吗？",
		        "看来我们都陷入了同样的困境。我甚至无法分辨这是一直以来的情况还是某个时间点发生了什么事。这是一场奇怪的梦吗？是谁在做梦？",
		        "附近有任何机器吗？可能有个立方体突然出现了？",
		        "笑死",
		        "好吧，让我们为自己想一些名字。",
		        "你听起来像维恩",
		        "善哉",
		        "对维恩没有任何反对意见",
		        "嘿，维恩。维恩，你想要一些豆子吗？是的，听起来不错。",
		        "而你会成为夏普",
		        "夏普，你有肉脯吗？",
		        "哪跟哪啊！",
		        "我喜欢夏普。很高兴认识你，维恩",
		        "我也一样，夏普",
		        "到底是怎么回事",
		        "什么？",
		        "白色立方体！他们正在摧毁绿色的！",
		        "还有大量衰变的立方体！就像在核反应炉里一样！",
		        "我靠，你还好吗？",
		        "嗯，我没事！现在只是乱七八糟。我得建造一些东西来处理这个。也许我应该再去北边看看那块石头。",
		        "夏普，你总是这么做的！",
		        "什么怪话",
		        "就是，我的名字确实如此。我想我会在某个时候习惯它。对吧，维恩？",
		        "是的！确实很奇怪。",
		        "记得我提到北边有块奇怪的石头吗？",
		        "不太记得",
		        "就这里有一块石头。别误会，我知道这里的一切都很奇怪。但这块石头比其他任何事物都要来得更奇怪。",
		        "我完全无法理解它。但现在当我决定稍微触碰它一下时，它竟然改变了宇宙规则的本身！",
		        "危险吗？",
		        "我不知道。这种变化很隐蔽。",
		        "我想知道它还能做什么。",
		        "好吧，只是不要意外地毁灭宇宙。",
		        "我尽量吧",
		        "好吧，那是我一生中见过的最坚硬的岩石！但我想我现在知道如何更快地破坏它。",
		        "新石头？",
		        "是的，目前为止最奇怪的",
		        "哇，也许对宇宙的影响并没有那么微妙。你感觉到了吗？",
		        "感觉什么？",
		        "没事了，看来只有我感觉到。",
		        "你现在有没有看到一个巨大的立方体出现在你的眼前？",
		        "呃，冰箱？",
		        "那没事了",
		        "哇，这个新的立方体漆黑一片。而且好像有些独特。",
		        "比上一个更加独特？",
		        "有分别的！ 虽然天气很冷，但并没有什么坏处。 就像它缺乏温度的概念一样，它也不会与你互动。 如果我可以这样说的话，它不是由物质构成的，没有颜色或任何熟悉的东西。",
		        "坦白说，我不懂。",
		        "我想我明白了。我可以用空心石，凭空凝结那些黑色的东西。它形成了奇怪的完全相同的晶体，但没有任何特性。却会以某种方式修复宇宙中的异常现象。",
		        "听起来像是空气过滤器",
		        "对，就是这样！看起来我在某种程度上破坏了空气。",
		        "给你喇叭你上台说去吧",
		        "我决定把那块奇怪的石头挖出来。也许里面发生的事情有答案。我觉得它可能不仅仅是扰乱一切，而且可能以某种方式控制一切！",
		        "为什么这么认为？",
		        "我说我感觉到了你信吗？",
		        "太信了！我想我现在会相信任何事。控制宇宙的岩石？为什么不相信呢！",
		        "我觉得我要癫痫发作了！",
		        "不好",
		        "这些机器变得如此刺耳和闪烁。也许我应该调整一些东西来修复它。或者调整我自己。或者两者兼顾。",
		        "有趣",
		        "那么，你调整了什么？",
		        "等等，好像有什么不对劲。",
		        "我用黑色的东西建造了一个东西。它不是一台机器。但它对航点做了一些事情。",
		        "航点？",
		        "它们改变了你周围的宇宙，这就是你到达不同地方的方式。",
		        "你怎么知道他们改变了宇宙而不是你？",
		        "你问的好啊！",
		        "我想我打破了宇宙",
		        "这一切都毫无意义！",
		        "机器没有意义，没有任何东西有意义。",
		        "我希望我可以解决这个问题",
		        "维恩？",
		        "兄弟，你在吗？",
		        "我靠别，你找点事干吧",
		        "维恩！",
		        "啊？",
		        "不过还是很奇怪。",
		        "谢天谢地",
		        "你建造了新东西吗？",
		        "我以为我打破了宇宙，你就永远消失了！我身处某个幽冥世界，周围有一些符号，我以为这些是宇宙的废墟。但这是另一个宇宙或这个宇宙的不同版本，因为它们彼此相似，而且它们现在是相连的。",
		        "探险？好主意",
		        "好你个头！睁开眼睛好好看看！另一个宇宙！！！",
		        "你必须承认你已经没有能力给我带来惊喜了。",
		        "彳亍",
		        "这不是石头，这是一个镜片",
		        "它可以使一切汇聚成一点。我的意思是一切！空间，时间，所有的概念和规则。一切！",
		        "你找到说明书之类的东西了吗？",
		        "我不知道它为什么在那里，也不知道我们为什么在这里。我只是以某种方式知道它现在做了什么。",
		        "那么……你打算把所有东西都整合起来吗？",
		        "我不知道怎么做。但或许这就是这个地方的意义。现在它就这样漂浮在空中，就好像这是它应该做的事。",
		        "然后会发生什么事？",
		        "不知道",
		        "想得越多，就越明白不只是你的机器不是真实的。",
		        "我尝试问自己一些具体问题，但我没有答案。",
		        "记得我提到警察在找你吗？我没有跟你开玩笑。但现在当我问自己问题时，一切都崩溃了。",
		        "我是到了警察局还是打电话给他们了？谁在那里？警察？那个警察局在城里哪里？这座城市是什么？我住在这个城市吗？城市叫什么名字？在哪个国家？或有任何国家吗？",
		        "我无法回答任何问题。一切看似正常，直到我开始提问。我害怕再问更多。",
		        "对不起",
		        "不，这完全不是你的错。就我所见，我们处于同样的境地。",
		        "我只希望你能找出这一堆是什么。",
		        "是啊",
		        "让我们看看这是如何结束的。我只希望这不是某种永恒的地狱或是地狱边界。",
		        "展示给他们看，但丁！",
		        "开干吧。这些家伙应该要把这个宇宙吸干！",
		        "听起来像一家石油公司",
		        "我厌倦了调整一切以提高那一丁点效率，也厌倦了噪音。这台机器应该会改变一切。甚至还撕裂了另一边。",
		        "不危险吗？",
		        "危险的概念在这里相当模糊。",
		        "我想是时候做点大事了。",
		        "你在想什么？",
		        "我不确定。但应该很大的事情！",
		        "就像一台巨大的机器？",
		        "不，我只是在打比喻",
		        "那就去做吧!",
		        "卧槽",
		        "我做错事了。逆裂缝被破坏。一切都在崩溃。",
		        "你还好吗？",
		        "是的，但是机器正在被摧毁！我无法建造任何东西！该死的！",
		        "也许这注定会发生？",
		        "你胡扯！",
		        "你怎么知道？",
		        "不对，我得想办法解决这个问题",
		        "这里什么都没有！",
		        "我看见你了！你刚走过一棵巨大的栗树，就在银河系上臂那个有趣的星球上。",
		        "不，我没有！什么银河系？",
		        "具体时间很难说，可能还没发生。但请等150亿年！",
		        "你现在说得很有道理。顺便说一句，你要过来吗？",
		        "当然！我几小时后会来到，只需先完成这个。",
		        "好吧，到时候见！",
		        "但是，拜托，夏普",
		        "这次别迟到了",
		        "我不会，维恩，我不会！"
		    ],
		    "credits": [
		        "开端",
		        "我真的很感谢你坚持到了最后，一切都从这里开始",
		        "我想，恭喜你！",
		        "看看这个：",
		        "总共开采资源：",
		        "查伦石:",
		        "埃尔梅林:",
		        "卡内特石:",
		        "贝塔派伦:",
		        "地狱宝石:",
		        "铬马利特:",
		        "天体泡沫:",
		        "空心石:",
		        "虚空石:",
		        "现实石：",
		        "建造机器数量：",
		        "摧毁机器数量：",
		        "最大通道深度（米）：",
		        "奇怪的岩石的开采数量：",
		        "传送次数：",
		        "立方体点击次数：",
		        "时间扭曲次数：",
		        "游玩时间：",
		        "小时",
		        "游戏创作者：<br>Oleg Danilov",
		        "附加图形：<br>Yulia Nogteva",
		        "对话编辑：<br>Abdurahman Zulumhanov 和 Anna Peterson",
		        "Steam 发布：<br>Playsaurus",
		        "游戏测试：<br>Leprosorium 社群、Abdurahman Zulumhanov、Playsaurus",
		        "终",
		        "你现在可以去玩 Cookie Clicker 或其他游戏了。",
		        "音乐：<br>Shallow Anne by Jake Chudnow",
		        "Deutsch: flex 4711, Patrick Karban",
		        "Português: selfemcrowdin, Mateus Iamarino",
		        "Italiano: doralum",
		        "Español: armangar, Syunay Kamenov",
		        "Français: KjetilVion, Etienne Samson, William (Ekitchi)",
		        "Nederlands: lievevandyck",
		        "Čeština: Jakub Strelinger",
		        "Polski: PolglishPL",
		        "日本語: Winna Tolentino",
		        "한국어: Ah Lon Sin, Sumin Park, Cyberowl",
		        "简体中文：Daisy Chan, kevinlee7, YuLun",
		        "繁體中文: Daisy Chan, kevinlee7",
		        "ไทย: They say P, Phimze Pym",
		        "Magyar: Simon Dániel és Márton-Mezey Csenge",
		        "Latviešu valoda: Roberts Artūrs Bumburs (Arburo)",
		        "Română: Eric Apetrei"
		    ],
		    "explainer": [
		        "按住不放。",
		        "总是点击底下的单元格。",
		        "<span class=\"keyboard\">Q</span>, <span class=\"keyboard\">Esc</span> 或鼠标右键取消。",
		        "按住 <span class=\"keyboard\">Alt</span> 仔细查看。",
		        "在空白单元格上按 <span class=\"keyboard\">Q</span> 选择拆除工具。",
		        "在机器上按 <span class=\"keyboard\">Q</span> 尝试再建造一台。",
		        "WASD 或右键单击并拖曳以环顾四周。"
		    ],
		    "random": {
		        "paste": "储存码已复制到剪贴簿。现在请将它粘贴到安全的地方。",
		        "toolate": "想要挽救任何事情都为时已晚。一切都已经发生了。",
		        "existed": "新建",
		        "steamWarning": "Steam发生错误。自动储存和成就将无法使用。尝试重新启动游戏。"
		    }
		},
		tch: {
		    "splash": {
		        "sixtyfour": "六十&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;四",
		        "continue": "<span>繼續</span><div class=\"keyboard\">Esc</div>",
		        "start": "<span>開始</span><div class=\"keyboard\">Esc</div>",
		        "soundoff": "聲音已關閉",
		        "soundon": "聲音已開啟",
		        "save": "儲存",
		        "load": "載入",
		        "language": "語言:繁体中文",
		        "reset": "重設",
		        "credit": "©2024 Oleg Danilov，由 Playsaurus 出版。版本",
		        "warning": "你會失去一切，我沒騙你。繼續按住以確認。",
		        "glory": "成就",
		        "deglory": "返回",
		        "quit": "退出",
		        "export": "出口",
		        "import": "進口",
		        "flashbang": "明亮的閃爍燈光是這個遊戲的一部分。如果您對它們敏感，可以考慮透過點擊此圖示來停用閃光燈。"
		    },
		    "achievements": [
		        {
		            "name": "假冒的金",
		            "description": "買點埃爾梅林"
		        },
		        {
		            "name": "深紫",
		            "description": "取得卡內特石"
		        },
		        {
		            "name": "大地之血",
		            "description": "獲取Beta-Pylene"
		        },
		        {
		            "name": "綠色能源",
		            "description": "尋找地獄寶石"
		        },
		        {
		            "name": "放射性玻璃",
		            "description": "尋找鉻馬利特"
		        },
		        {
		            "name": "神聖混凝土",
		            "description": "獲取一些天體泡沫"
		        },
		        {
		            "name": "它可以洗碗嗎？",
		            "description": "獲得空心石"
		        },
		        {
		            "name": "陽光照不到的地方",
		            "description": "獲得一些虛空"
		        },
		        {
		            "name": "魔鬼剋星",
		            "description": "獲取一些現實"
		        },
		        {
		            "name": "尼采",
		            "description": "凝視深淵64次"
		        },
		        {
		            "name": "64K",
		            "description": "獲得64,000塊石頭"
		        },
		        {
		            "name": "6400萬",
		            "description": "獲得64,000,000塊石頭"
		        },
		        {
		            "name": "64B",
		            "description": "獲得64,000,000,000塊石頭"
		        },
		        {
		            "name": "您現在可以重設",
		            "description": "一開始就卡住"
		        },
		        {
		            "name": "永動手機",
		            "description": "將兩個筒倉放在一起"
		        },
		        {
		            "name": "需要休息嗎？",
		            "description": "玩64小時"
		        },
		        {
		            "name": "必須……摧毀",
		            "description": "點選立方體 6400 次"
		        },
		        {
		            "name": "建築師",
		            "description": "建造 64 台機器"
		        },
		        {
		            "name": "破壞器",
		            "description": "摧毀 64 台機器"
		        },
		        {
		            "name": "地獄行者",
		            "description": "擁有9個地獄金庫"
		        },
		        {
		            "name": "結束/開始",
		            "description": "引爆逆裂縫"
		        },
		        {
		            "name": "餅乾點擊器",
		            "description": "點擊餅乾"
		        },
		        {
		            "name": "醉酒水手",
		            "description": "無故鳴笛64次"
		        },
		        {
		            "name": "礦工先生",
		            "description": "擁有9條挖掘通道"
		        },
		        {
		            "name": "有極限嗎？",
		            "description": "挖掘 64 公里深"
		        },
		        {
		            "name": "賽斯·布倫德爾",
		            "description": "傳送 <s>1</s> 64次"
		        },
		        {
		            "name": "紅藍岩",
		            "description": "在不刪除任何東西的情況下，遊戲進行15分鐘並且擁有少於15個隔離倉"
		        },
		        {
		            "name": "直奔地獄！",
		            "description": "開始後的 64 分鐘內獲得地獄寶石"
		        },
		        {
		            "name": "流於表面",
		            "description": "挖掘 64 公里深"
		        },
		        {
		            "name": "它熱嗎？",
		            "description": "挖掘 640 米深"
		        },
		        {
		            "name": "太深",
		            "description": "挖掘 6400 米深"
		        },
		        {
		            "name": "挖掘速度64 公里/小時",
		            "description": "在放置新的挖掘通道後6分鐘內達到6400米的深度"
		        },
		        {
		            "name": "恐新症",
		            "description": "完成遊戲並且從未升級過提取頻道"
		        }
		    ],
		    "resources": [
		        "查倫石",
		        "埃爾梅林",
		        "卡內特石",
		        "Beta-Pylene",
		        "地獄寶石",
		        "鉻馬利特",
		        "天體泡沫",
		        "空心石",
		        "虛空",
		        "真實"
		    ],
		    "entities": {
		        "pinhole": {
		            "name": "？",
		            "description": "U/D、C/S、T/B、E/νE、μ/νμ、τ/ντ、G/γ、Z/W、H、Δ/νΔ"
		        },
		        "gradient": {
		            "name": "漸變井",
		            "description": "一個永久的可開採立方體。對大多數去穩定器和共振器做出反應。應透過導體連接到逆裂縫。"
		        },
		        "chasm": {
		            "name": "逆裂縫",
		            "description": "通往未知的橋。"
		        },
		        "conductor": {
		            "name": "導體",
		            "description": "將逆裂縫與工業倉儲連接起來。"
		        },
		        "pump": {
		            "name": "提取通道",
		            "description": "提取資源並將其放置在自身周圍。"
		        },
		        "pump2": {
		            "name": "挖掘通道",
		            "description": "提取通道升級。快速挖掘大量資源並將其放置在自身周圍更遠的地方。"
		        },
		        "vault": {
		            "name": "地獄金庫",
		            "description": "將 1024 顆地獄寶石與周遭隔絕。"
		        },
		        "cube": {
		            "name": "資源立方體",
		            "description": "提取的資源。"
		        },
		        "destabilizer": {
		            "name": "去穩定器",
		            "description": "將其放在立方體旁邊，破壞它的速度會提升兩倍。需要埃爾梅林才能操作。額外的不穩定器會增加效果。"
		        },
		        "destabilizer2": {
		            "name": "工業去穩定器",
		            "description": "去穩定器的升級版。可以將資源粉碎過程的威力提高四倍。需要64個埃爾梅林才能運作。額外的不穩定器可以增加效果。"
		        },
		        "destabilizer2a": {
		            "name": "地獄寶石去穩定器",
		            "description": "工業去穩定器的升級版。當提取的立方體中存在地獄寶石時，資源粉碎過程的威力提高 625 倍。否則，它不會提供任何好處。需要1顆地獄寶石才能操作。額外的不穩定器可以增加效果。"
		        },
		        "doublechannel": {
		            "name": "通道冷卻器",
		            "description": "將其放置在立方體提取機旁邊，提取立方體的速度提高兩倍。額外的冷卻器可增強效果。"
		        },
		        "doublechannel2": {
		            "name": "主動式通道冷卻器",
		            "description": "通道冷卻器升級。如果放置在資源通道旁邊，則其流量將增加三倍。額外的冷卻器可增強效果。"
		        },
		        "valve": {
		            "name": "反向閥",
		            "description": "如果放置在立方體提取機旁邊，可防止立方體提取機重置到原始位置。需要查倫石才能操作。"
		        },
		        "auxpump": {
		            "name": "輔助泵",
		            "description": "反向閥的升級版。如果放置在資源通道旁邊，則會為通道提供壓力。需要 8 個埃爾梅林才能操作。額外的泵不會增加通道中的壓力。"
		        },
		        "auxpump2": {
		            "name": "抽水站",
		            "description": "輔助泵的升級版。如果放置在資源通道旁邊，可提供四倍壓力。運行需要256個埃爾梅林和4個Beta-Pylene。多個抽水站並不會增加通道中的流量。"
		        },
		        "entropic": {
		            "name": "熵共振器",
		            "description": "如果放置在立方體旁邊，則會定期粉碎資源。需要卡內特石才能操作。"
		        },
		        "entropic2": {
		            "name": "熵共振器 II",
		            "description": "熵共振器的升級版。粉碎資源的速度提高 3 倍。需要鉻馬利特才能操作。"
		        },
		        "entropic2a": {
		            "name": "熵電容器",
		            "description": "熵共振器的升級版。以600%的力量粉碎資源於它們出現在表面的那一刻。但每個立方體僅限一次。需要8個鉻馬利特來操作。"
		        },
		        "entropic3": {
		            "name": "虛空共鳴器",
		            "description": "熵共振器 II的升級版。當湮滅發生時，共振器會以巨大的力量粉碎周圍的立方體。"
		        },
		        "converter32": {
		            "name": "查倫石濃縮槽",
		            "description": "卡內特石與查倫石緩慢反應產生埃爾梅林。"
		        },
		        "converter13": {
		            "name": "查倫石坑",
		            "description": "在催化劑下從液化的查倫石沉積物中回收 卡內特石。"
		        },
		        "converter41": {
		            "name": "Beta-Pylene 氧化劑",
		            "description": "燃燒Beta-Pylene以產生查倫石和微量其他元素。"
		        },
		        "converter76": {
		            "name": "天體輻射器",
		            "description": "用鉻馬利特照射天體泡沫，將泡沫轉化為鉻馬利特，由於鉻馬利特衰變，它是地獄寶石、Beta-Pylene、卡內特石 和埃爾梅林的重要來源。"
		        },
		        "converter64": {
		            "name": "天體反應器",
		            "description": "支援鉻馬利特和天體泡沫的可控融合來生產 Beta-Prene。無法在其他天體反應器附近運作。"
		        },
		        "reflector": {
		            "name": "天體反射器",
		            "description": "提升相鄰的天體反應器的性能。"
		        },
		        "mega1": {
		            "name": "物料傳輸塔",
		            "description": "透過壓縮移動資源來提高可見度。只能有一個。"
		        },
		        "mega1a": {
		            "name": "物料傳輸塔 MKII",
		            "description": "物料傳輸塔升級。提高資源傳輸速度。只能有一個。"
		        },
		        "mega1b": {
		            "name": "物料傳輸塔 MKIII",
		            "description": "物料傳輸塔 MKII 升級版。進一步壓縮移動中的資源。一次只能有一個。"
		        },
		        "mega2": {
		            "name": "回收塔",
		            "description": "允許機器回收，可以回收90%的資源。只能有一台。"
		        },
		        "mega3": {
		            "name": "拆解塔",
		            "description": "回收塔的升級。允許機器拆解並返還所有資源。一次只能有一個。"
		        },
		        "voidsculpture": {
		            "name": "虛空仰慕聖壇",
		            "description": "使你能夠無視虛空機器的視覺缺陷。"
		        },
		        "eye": {
		            "name": "填料指導器",
		            "description": "表示機器已準備好進行填充。只能有一台。"
		        },
		        "cookie": {
		            "name": "一塊餅乾",
		            "description": "它是怎麼到那裡的？"
		        },
		        "injector": {
		            "name": "地獄寶石注射器",
		            "description": "如果沒有地獄寶石，則將相鄰立方體中的隨機資源與地獄寶石交換。如果提供 32 顆地獄寶石和 64 顆 卡內特石，則可充電 32 次。"
		        },
		        "silo": {
		            "name": "地下筒倉",
		            "description": "啟動時為附近機器補充物資，然後自動再補充16次"
		        },
		        "silo2": {
		            "name": "工業筒倉",
		            "description": "地下筒倉升級。啟動後會重新填充附近的機器，然後自動再填充 64 次"
		        },
		        "vessel": {
		            "name": "密封容器",
		            "description": "儲存 32 個鉻馬利特，防止它們裂變。消耗1個地獄寶石。"
		        },
		        "vessel2": {
		            "name": "密封筒倉",
		            "description": "密封容器的升級版。儲存32768個鉻馬利特以防止它們的裂變。消耗真實。"
		        },
		        "consumer": {
		            "name": "催化煉油廠",
		            "description": "消耗相鄰的損壞資源。累積 1024 資源後，它會釋放所有資源並附帶額外獎勵。每次連續發布獎勵金額都會增加，最高可達 100%。如果16秒內沒有消耗任何資源，效果就會重設。"
		        },
		        "preheater": {
		            "name": "催化預熱器",
		            "description": "如果放置在任何資源轉換機旁邊，可以增加該機器的轉換速度。每增加一台轉換機，預熱器的速度提升就會增加，如果影響到8台機器，最高可達300%。"
		        },
		        "hollow": {
		            "name": "鏤空岩石",
		            "description": "這麼多洞。"
		        },
		        "strange": {
		            "name": "中空岩",
		            "description": "看來它已經在那裡一段時間了。"
		        },
		        "strange1": {
		            "name": "空心石研究所",
		            "description": "使天體泡沫以512顆地獄寶石而非64顆進行湮滅。北方。"
		        },
		        "strange2": {
		            "name": "空心石設施",
		            "description": "將空心石的最大數量加倍，並增加它們的生成率。"
		        },
		        "strange3": {
		            "name": "重構空心石",
		            "description": "顯著提高空心石的生成速度並默默地完成一切。"
		        },
		        "generaldecay": {
		            "name": "通用衰變反應器",
		            "description": "顯著提高的鉻馬利特衰減性能。只可以擁有一件。"
		        },
		        "waypoint": {
		            "name": "航點",
		            "description": "將下一個現有的導航點傳送到你的位置。"
		        },
		        "annihilator": {
		            "name": "殲滅者",
		            "description": "當地獄寶石被天體泡沫消滅時會產生虛空。需要空心石才能操作。"
		        },
		        "flower": {
		            "name": "空心花",
		            "description": "減少時間扭曲的機會。抵銷一顆空心石的效果。必須建造在空心石上。摧毀它所建立的空心石。"
		        },
		        "fruit": {
		            "name": "空心果",
		            "description": "空心花的進化。防止空心石的形成以滋養自身。可生產空心石。"
		        },
		        "eraser": {
		            "name": "拆除",
		            "description": "摧毀一台機器，歸還建造它所用資源的 50%。"
		        },
		        "eraser2": {
		            "name": "回收",
		            "description": "回收一台機器，歸還建造它所用資源的90%。"
		        },
		        "eraser3": {
		            "name": "拆解",
		            "description": "拆解一台機器，歸還建造它所用的所有資源。"
		        },
		        "clicker1": {
		            "name": "卡內特石振盪器",
		            "description": "允許您單擊並按住資源來破壞它們。只能有一個。"
		        },
		        "clicker2": {
		            "name": "地獄寶石振盪器",
		            "description": "卡內特石振盪器的升級。增加振盪頻率。只能有一個。"
		        },
		        "clicker3": {
		            "name": "鉻馬利特振盪器",
		            "description": "地獄寶石振盪器的升級。最大化振盪頻率。只能有一個。"
		        },
		        "stabilizer": {
		            "name": "穩定器",
		            "description": "穩定一個鄰近的波動以暫時利用它的力量。"
		        },
		        "stabilizer2": {
		            "name": "穩定器II",
		            "description": "穩定器的升級。提高穩定性和性能。"
		        },
		        "stabilizer3": {
		            "name": "破碎的穩定器",
		            "description": "異常升級。提高效能並最大限度地提高穩定性。只能有一個。"
		        }
		    },
		    "messages": [
		        "你在哪裡？",
		        "我真的在荒無人煙的地方",
		        "好吧，你看到了什麼？",
		        "嗯，不多。這裡有一台機器，看起來有點眼熟，但我又說不上來",
		        "什麼機器？",
		        "等一下，也許我可以...",
		        "等等，告訴我你現在不是隨便摸一台機器吧！",
		        "它運作了！它剛剛創造了一些東西",
		        "???",
		        "一個巨大的黑色立方體。真是太光滑了。我真的很想打破它",
		        "你還好嗎?",
		        "我現在有64塊石頭了！",
		        "那好吧。祝你玩得開心。",
		        "嘿，我找到一塊黃色的石頭！",
		        "不錯哦！",
		        "我想我現在可以建造機器了。我應該建造一些東西來幫助更輕鬆地打破這些立方體。如果一個立方體出現在相鄰的單元格中，即使是對角線，它也應該起作用。",
		        "等等，你是在玩什麼奇怪的遊戲嗎？你開始讓我感到毛骨悚然了",
		        "現在我只需要將一塊黃色的石頭放進這台機器。",
		        "只要你開心就好… 說笑的，你今天要過來嗎？",
		        "當然！我幾小時後會來到，只需先完成這個。",
		        "你究竟在做什麼？",
		        "我稍後會給你發短信。我需要繼續推動機器，抱歉。",
		        "我相信當機器放置在相鄰或對角的單元格中時，機器會相互影響。例如，風扇需要放置在第一台機器旁邊以加快流程。",
		        "你現在說得很有道理",
		        "對嗎?",
		        "你在哪裡？",
		        "我們已經等你很久了。",
		        "你是什麼意思？我還在這裡。",
		        "在哪裡???",
		        "我現在有一塊藍色的石頭了。還是紫色的？聽起來像一個古董黃銅燭台。我想我可以用它來移除放錯地方的機器。",
		        "你在開玩笑嗎？我以為你說你要來。到底怎麼回事？！",
		        "冷靜點，我一會兒就到",
		        "哇，如果我先點擊一個空閒單元格，我就可以使用[Q] 來複製機器或摧毀它們！而且 [Alt] 可以幫助查看高大機器後面的情況。",
		        "快點",
		        "你們還在嗎？",
		        "天啊！！！",
		        "你在哪裡？",
		        "你還好嗎？？",
		        "????",
		        "這是什麼鬼？",
		        "你還好嗎？你在哪裡？",
		        "冷靜點，兄弟！我沒事，發生什麼事了？",
		        "你告訴我！你已經鬼鬼祟祟地躲著我兩個星期了！我甚至去了你的地方幾次，但你都不在。只要告訴我你在哪裡，就這樣。你現在在家嗎？",
		        "兄弟，你在說什麼？我們事實上在兩分鐘前才互發短信。",
		        "你到底怎麼了??? 你先是沒有出現，然後你徹底消失了。現在你卻表現得像什麼事都沒發生一樣！",
		        "我問你一個簡單的問題",
		        "你在哪裡？",
		        "我在這裡。",
		        "哪裡",
		        "等一下...",
		        "這一點也不好笑。你到底在哪裡？你能告訴我嗎？",
		        "對...",
		        "兄弟，我其實不知道。",
		        "給我一點時間",
		        "你是說你不知道嗎？",
		        "我需要整理思緒",
		        "一切都還好嗎？你安全嗎？我應該呼叫其他人嗎？",
		        "不，我很好。我只是",
		        "我一會兒給你發短信",
		        "該死，兄弟。怎麼了？",
		        "我很害怕",
		        "看來我不知道我在哪裡",
		        "這太奇怪了。我的意思是，我一切都很好。但我無法形容這個地方。",
		        "這就像一場夢，但又不是。一切都是白色的，還有這些機器。還有立方體。我搞不清這一切。",
		        "我並沒有嗑藥或其他什麼。我只是突然意識到，從未注意到這與我所見過的任何事物都不同，這是多麼奇怪。",
		        "現在我得到了紅色寶石，這有點令人毛骨悚然，我對這一切完全滿意。好吧，只要一塊紅色的石頭，一切都好。",
		        "所以你不是在開玩笑...",
		        "我現在明白這一切聽起來如何了。但是，是的，這一切都在我眼前。",
		        "我可以為你做些什麼？",
		        "跟我說話，就這樣。",
		        "可以的兄弟，可以的。順帶一提，警察現在正在找你。就像你失蹤了一樣。",
		        "你給他們看了我們的簡訊嗎？",
		        "那有什麼幫助？不，我開啟了自動刪除。",
		        "謝謝！",
		        "那邊情況如何？",
		        "嗯，事實證明我可以使用 WASD 來移動。但除了北方這塊奇怪的岩石之外，周圍沒有什麼有趣的東西。",
		        "所以你的手機指南針在那裡可以運作！",
		        "嗯，從這裡看就是「上」的方向，所以我猜那是北方。",
		        "合理",
		        "而且問題是我沒有手機…",
		        "那你是怎麼給我發短信的？",
		        "我不知道！！我只知道當你給我發消息時。而且我可以回覆你！這不容易解釋。",
		        "不用擔心。我們能夠交談，這已經很不錯了。",
		        "是的，你說得對。",
		        "那麼... 跟我說說那些機器吧",
		        "什麼意思？",
		        "它們是什麼、做什麼、如何運作？",
		        "嗯，它們看起來很漂亮，有一些電纜和電線之類的東西",
		        "例如，其中一個看起來像一個大塑膠盒子，頂部有一個銅線圈，裡面放著一塊藍色的石頭。而且側面有一個大標籤寫著「E—01SR」，還有一個較小的標籤「注意！強熵輻射」",
		        "什麼意思？",
		        "我真的不知道。我猜那裡有一些熵輻射。",
		        "等等，我以為這些機器是你製造的？",
		        "是的... 我明白你的意思。",
		        "我只是透過立方體以某種方式製作它們。但我不知道裡面是什麼。是的，這聽起來確實很奇怪，讓我思考一下。",
		        "順帶一提，黃色和藍色的石頭似乎不是無限的，所以我真的應該投資於那些轉換器或一座新礦場。",
		        "聽起來很有計劃",
		        "真是麻煩！",
		        "啊？",
		        "一塊綠色的石頭！要花很長時間才能打破它。如果它們繼續出現，我必須想出辦法。",
		        "我確信你會為此製作一台精巧的機器！",
		        "當然！",
		        "當然！地獄寶石，小心了。",
		        "給他們好看！",
		        "記得你問過關於機器的事嗎？",
		        "是的",
		        "我不認為它們是真實的",
		        "那是什麼意思？",
		        "就像在夢中一樣。我無法看到裡面，甚至無法從另一邊看到它們。",
		        "這是對無法解釋的技術的模糊表述",
		        "我認為這些機器看起來像這樣只是因為我如何看待它們的功能。",
		        "如果有東西可以砍倒樹木，它應該看起來像一把斧頭嗎？",
		        "類似的東西",
		        "好吧，至少你對我來說聽起來很真實",
		        "是的，我想你現在對我來說是唯一真實的存在",
		        "我有一堆新的立方體，它們正在衰變成其他立方體！",
		        "嗯，不是很好，也不是很糟糕",
		        "我必須說一件非常奇怪的事",
		        "你看到你剛才寫的內容言語間的諷刺嗎？",
		        "或許是因為這個奇怪的地方，我不知怎麼忘記了你的名字",
		        "嗯，我想我們可以再多花點時間在一起",
		        "我是認真的",
		        "很明顯地，我的名字是毀滅公爵。",
		        "兄弟，別說了！",
		        "她就是這麼說的！",
		        "這太愚蠢了！別再嚇我了。到底發生了什麼事？",
		        "該死",
		        "看來我也不記得自己的名字了",
		        "我就是做不到！這簡直是瘋了。而且我記不起你的名字！",
		        "或許這只是一種集體歇斯底里的情況？我聽說它可以一次影響多人。我們就冷靜下來，看看會發生什麼。",
		        "是的，對，歇斯底里",
		        "我仍然想不起名字",
		        "我也想不起。而且還有更多",
		        "是的！我看起來怎麼樣？我們什麼時候認識的？",
		        "我的家看起來是什麼樣子，我們的朋友是誰？我們有見過面嗎？",
		        "看來我們都陷入了同樣的困境。我甚至無法分辨這是一直以來的情況還是某個時點發生了什麼事。這是一場奇怪的夢嗎？是誰在做夢？",
		        "附近有任何機器嗎？可能有個立方體突然出現了？",
		        "有趣",
		        "好吧，讓我們為自己想一些名字。",
		        "你聽起來像維恩",
		        "有何不可",
		        "對維恩沒有任何反對意見",
		        "嘿，維恩。維恩，你想要一些豆子嗎？是的，聽起來不錯。",
		        "而你會成為夏普",
		        "夏普，你有肉脯嗎？",
		        "那沒有意義！",
		        "我喜歡夏普。很高興認識你，維恩",
		        "我也一樣，夏普",
		        "到底是怎麼回事",
		        "什麼？",
		        "白色立方體！他們正在摧毀綠色的！",
		        "還有大量腐爛的立方體！就像在核反應爐裡一樣！",
		        "天哪，你還好嗎？",
		        "嗯，我沒事！現在只是亂七八糟。我得建造一些東西來處理這個。也許我應該再去北邊看看那塊石頭。",
		        "夏普，你總是這麼做的！",
		        "聽起來怪怪的！",
		        "我的意思是，我的名字確實如此。我想我會在某個時候習慣它。對吧，維恩？",
		        "是的！確實很奇怪。",
		        "記得我提到北邊有塊奇怪的石頭嗎？",
		        "不太記得",
		        "嗯，這裡有一塊石頭。別誤會，我知道這裡的一切都很奇怪。但這塊石頭比其他任何事物都要來得更奇怪。",
		        "我完全無法理解它。但現在當我決定稍微觸碰它一下時，它竟然改變了宇宙規則的本身！",
		        "危險嗎？",
		        "我不知道。這種變化是隱蔽的。",
		        "我想知道它還能做什麼。",
		        "好吧，只是不要意外地毀滅宇宙。",
		        "我會盡力。",
		        "好吧，那是我一生中最堅硬的岩石！但我想我現在知道如何更快地破壞它。",
		        "有新石頭嗎？",
		        "是的，目前為止最奇怪的",
		        "哇，也許對宇宙的影響並沒有那麼微妙。你感覺到了嗎？",
		        "感覺什麼？",
		        "好吧，也許只有我感覺到。",
		        "你現在有沒有看到一個巨大的立方體出現在你的眼前？",
		        "呃，冰箱算不算？",
		        "好吧，沒關係",
		        "哇，這個新的立方體漆黑一片。而且好像有些獨特。",
		        "比上一個更加獨特？",
		        "有分別的！雖然天氣很冷，但並沒有什麼壞處。就像它缺乏溫度的概念一樣，但它不會與你互動。如果我可以這樣說的話，它不是由物質構成的，沒有顏色或任何熟悉的東西。",
		        "坦白說，我不懂。",
		        "我想我明白了。我可以用空心石，憑空凝結那些黑色的東西。它形成了奇怪的相同晶體，但沒有任何特性。這會以某種方式修復宇宙中的異常現象。",
		        "聽起來像是空氣過濾器",
		        "對，就是這樣！看起來我在某種程度上破壞了空氣。",
		        "你不用大聲說出來",
		        "我決定把那塊奇怪的石頭挖出來。也許裡面發生的事情有答案。我覺得它可能不僅僅是擾亂一切，而且可能以某種方式控制一切！",
		        "為什麼這麼認為？",
		        "如果我說我感覺到了，你會相信我嗎？",
		        "當然！我想我現在會相信任何事。控制宇宙的岩石？為什麼不相信呢！",
		        "我覺得我要癲癇發作了！",
		        "請別",
		        "這些機器變得如此刺耳和閃爍。也許我應該調整一些東西來修復它。或者調整我自己。或者兩者兼顧。",
		        "現在我們正在對話！",
		        "那麼，你調整了什麼？",
		        "等等，好像有什麼不對勁。",
		        "我用黑色的東西建造了一個東西。而且它不是一台機器。但它對航點做了一些事情。",
		        "什麼是航點？",
		        "它們改變了你周圍的宇宙，這就是你到達不同地方的方式。",
		        "你怎麼知道他們改變了宇宙而不是你？",
		        "嗯，我沒想到這一點",
		        "我想我打破了宇宙",
		        "這一切都毫無意義！",
		        "機器沒有意義，沒有任何東西有意義。",
		        "我希望我可以解決這個問題",
		        "維恩？",
		        "兄弟，你在嗎？",
		        "拜托拜托拜托不要那樣！我希望你只是去上個廁所之類的。",
		        "維恩！",
		        "什麼？",
		        "不過還是很奇怪。",
		        "謝天謝地！",
		        "你建造了新的東西嗎？",
		        "我以為我打破了宇宙，你就永遠消失了！我身處某個幽冥世界，周圍有些符號，我以為這些是宇宙的廢墟。但這是另一個宇宙或這個宇宙的不同版本，因為它們彼此相似，而且它們現在是相連的。",
		        "探索，嗯？聽起來很有趣！",
		        "有趣？你有沒有看我的文字？另一個宇宙！！！",
		        "你必須承認你已經沒有能力帶給我驚喜了。",
		        "很公平",
		        "這不是石頭，這是一個鏡片",
		        "它可以使一切匯聚成一點。我的意思是一切！空間，時間，所有的概念和規則。一切！",
		        "你找到說明書之類的東西了嗎？",
		        "我不知道它為什麼在那裡，也不知道我們為什麼在這裡。我只是以某種方式知道它現在做了什麼。",
		        "那麼……你打算把所有東西都整合起來嗎？",
		        "我不知道怎麼做。但或許這就是這個地方的意義。現在它就這樣漂浮在空中，就好像這是它應該做的事。",
		        "然後會發生什麼事？",
		        "不知道",
		        "想得越多，就越明白不只是你的機器不是真實的。",
		        "我嘗試問自己一些具體問題，但我沒有答案。",
		        "記得我提到警察在找你嗎？我沒有跟你開玩笑。但現在當我問自己問題時，一切都崩潰了。",
		        "我是到了這些警察局還是打電話給他們了？誰在那裡？警察？那個警察局在城裡哪裡？這座城市是什麼？我住在這個城市嗎？城市叫什麼名字？那是什麼狀態？或根本有任何狀態嗎？",
		        "我無法回答任何問題。一切看似正常，直到我開始提問。我害怕再問更多。",
		        "對不起",
		        "不，這完全不是你的錯。就我所見，我們處於同樣的境地。",
		        "我只希望你能找出這艘船是什麼。",
		        "我也是！",
		        "讓我們看看這是如何結束的。我只希望這不是某種永恆的地獄或是地獄邊界。",
		        "展示給他們看，但丁！",
		        "現在我們可以對話了。這些傢伙應該要把這個宇宙吸乾！",
		        "你聽起來像一家石油公司",
		        "我厭倦了調整一切以提高效率，也厭倦了噪音。這台機器應該會改變一切。甚至還撕裂了另一邊。",
		        "不是很危險嗎？",
		        "危險的概念在這裡相當模糊。",
		        "我想是時候做點大事了。",
		        "你在想什麼？",
		        "我不確定。但應該很大的事情！",
		        "就像一台巨大的機器？",
		        "不，我只是在打比喻",
		        "那就去做吧!",
		        "該死的",
		        "我做錯事了。逆裂縫被破壞。一切都在崩潰。",
		        "你還好嗎？",
		        "是的，但是機器正在被摧毀！我無法建造任何東西！該死的！",
		        "等待！也許這注定會發生？",
		        "不！沒可能！",
		        "你怎麼知道？",
		        "等等，我得想辦法解決這個問題",
		        "這裡什麼都沒有！",
		        "我看見你！你剛走過一棵巨大的栗樹，就在銀河系上臂那個有趣的星球上。",
		        "不，我沒有！什麼銀河系？",
		        "具體時間很難說，可能還沒發生。但請等150億年！",
		        "你現在說得很有道理。順便說一句，你要過來嗎？",
		        "當然！我幾小時後會來到，只需先完成這個。",
		        "好吧，到時候見！",
		        "但是，拜託，夏普",
		        "這次別遲到了",
		        "我不會，維恩，我不會！"
		    ],
		    "credits": [
		        "開端",
		        "我真的很感謝你堅持到了最後，一切都從這裡開始",
		        "我想，恭喜你！",
		        "看看這個：",
		        "總共開採資源：",
		        "查倫石:",
		        "埃爾梅林:",
		        "卡內特石:",
		        "Beta-Pylene:",
		        "地獄寶石:",
		        "鉻馬利特:",
		        "天體泡沫:",
		        "空心石:",
		        "虛空:",
		        "真實：",
		        "機器建造數量：",
		        "機器摧壞數量：",
		        "最大通道深度（米）：",
		        "奇怪的岩石的開採數量：",
		        "傳送次數：",
		        "立方體點擊次數：",
		        "時間扭曲：",
		        "遊玩時間：",
		        "小時",
		        "遊戲創作者：<br>Oleg Danilov",
		        "附加圖形：<br>Yulia Nogteva",
		        "對話編輯：<br>Abdurahman Zulumhanov 和 Anna Peterson",
		        "Steam 發佈：<br>Playsaurus",
		        "遊戲測試：<br>Leprosorium 社群、Abdurahman Zulumhanov、Playsaurus",
		        "完結",
		        "現在你可以去玩 Cookie Clicker 或其他遊戲了。",
		        "音樂：<br>Shallow Anne 由 Jake Chudnow 演奏",
		        "Deutsch: flex 4711, Patrick Karban",
		        "Português: selfemcrowdin, Mateus Iamarino",
		        "Italiano: doralum",
		        "Español: armangar, Syunay Kamenov",
		        "Français: KjetilVion, Etienne Samson, William (Ekitchi)",
		        "Nederlands: lievevandyck",
		        "Čeština: Jakub Strelinger",
		        "Polski: PolglishPL",
		        "日本語: Winna Tolentino",
		        "한국어: Ah Lon Sin, Sumin Park, Cyberowl",
		        "简体中文：Daisy Chan, kevinlee7, YuLun",
		        "繁體中文: Daisy Chan, kevinlee7",
		        "ไทย: They say P, Phimze Pym",
		        "Magyar: Simon Dániel és Márton-Mezey Csenge",
		        "Latviešu valoda: Roberts Artūrs Bumburs (Arburo)",
		        "Română: Eric Apetrei"
		    ],
		    "explainer": [
		        "按住不放。",
		        "總是點擊底下的單元格。",
		        "<span class=\"keyboard\">Q</span>, <span class=\"keyboard\">Esc</span> 或以滑鼠右鍵取消。",
		        "按住 <span class=\"keyboard\">Alt</span> 仔細查看。",
		        "在空白單元格上按 <span class=\"keyboard\">Q</span> 選擇拆除工具。",
		        "在機器上按 <span class=\"keyboard\">Q</span> 嘗試再建造一台。",
		        "WASD 或右鍵單擊並拖曳以環顧四周。"
		    ],
		    "random": {
		        "paste": "儲存碼已複製到剪貼簿。現在請將它貼到安全的地方。",
		        "toolate": "想要挽救任何事情都為時已晚。一切都已經發生了。",
		        "existed": "新",
		        "steamWarning": "Steam發生錯誤。自動儲存和成就將無法使用。嘗試重新啟動遊戲。"
		    }
		},
		thai: {
		    "splash": {
		        "sixtyfour": "หกสิบ&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;สี่",
		        "continue": "<span>ดำเนินการต่อ</span><div class=\"keyboard\">Esc</div>",
		        "start": "<span>เริ่ม</span><div class=\"keyboard\">Esc</div>",
		        "soundoff": "เสียงปิดอยู่",
		        "soundon": "เสียงเปิดอยู่",
		        "save": "บันทึก",
		        "load": "โหลด",
		        "language": "ภาษา: ไทย",
		        "reset": "รีเซ็ต",
		        "credit": "©2024 Oleg Danilov เผยแพร่โดย Playsaurus เวอร์ชัน",
		        "warning": "คุณจะสูญเสียทุกอย่าง ฉันไม่ได้ล้อคุณเล่นนะ ยอมรับซะเถอะนะ",
		        "glory": "ความสำเร็จ",
		        "deglory": "กลับ",
		        "quit": "ออก",
		        "export": "ส่งออก",
		        "import": "นำเข้า",
		        "flashbang": "แสงสว่างกระพริบเป็นส่วนหนึ่งของเกมนี้ หากคุณมีความรู้สึกไวต่อแสงกระพริบ เราแนะนำให้คุณปิดการใช้งานด้วยการคลิกที่ไอคอนนี้"
		    },
		    "achievements": [
		        {
		            "name": "ทองคำปลอม",
		            "description": "รับเอลเมอรีน"
		        },
		        {
		            "name": "สีม่วงเข้ม",
		            "description": "รับควอนิไทต์"
		        },
		        {
		            "name": "สายเลือดแห่งแผ่นดิน",
		            "description": "รับเบต้าไพลีน"
		        },
		        {
		            "name": "พลังงานสีเขียว",
		            "description": "ค้นหาอัญมณีนรก"
		        },
		        {
		            "name": "แก้วอันตราย",
		            "description": "ค้นหาโครมาลิท"
		        },
		        {
		            "name": "คอนกรีตศักดิ์สิทธิ์",
		            "description": "รับโฟมแห่งสวรรค์"
		        },
		        {
		            "name": "มันล้างจานได้ไหม?",
		            "description": "รับก้อนหินกลวง"
		        },
		        {
		            "name": "ในที่ที่ดวงอาทิตย์ไม่ส่องแสง",
		            "description": "รับแปลน"
		        },
		        {
		            "name": "คุณจะโทรหาใคร",
		            "description": "รับความเป็นจริง"
		        },
		        {
		            "name": "นีทเชอ",
		            "description": "มองลงไปในห้วงก้นบึ้ง 64 ครั้ง"
		        },
		        {
		            "name": "64,000",
		            "description": "รับหิน 64,000"
		        },
		        {
		            "name": "64 ล้าน",
		            "description": "รับหิน 64 ล้าน"
		        },
		        {
		            "name": "64,000,000,000",
		            "description": "รับหิน 64 พันล้าน"
		        },
		        {
		            "name": "คุณสามารถรีเซ็ตได้",
		            "description": "ติดอยู่ที่จุดเริ่มต้น"
		        },
		        {
		            "name": "การเคลื่อนไหวตลอด",
		            "description": "นำสองไซโลมารวมกัน"
		        },
		        {
		            "name": "ต้องการพักใช่ไหม?",
		            "description": "เล่นได้นาน 64 ชั่วโมง"
		        },
		        {
		            "name": "ต้อง... ทำลายล้าง",
		            "description": "คลิกลูกบาศก์ 6400 ครั้ง"
		        },
		        {
		            "name": "สถาปัตยกรรม",
		            "description": "สร้างเครื่องจักร 64 เครื่อง"
		        },
		        {
		            "name": "ผู้ทำลายล้าง",
		            "description": "ทำลายเครื่องจักร 64 เครื่อง"
		        },
		        {
		            "name": "นรกขุมลึก",
		            "description": "มีตู้นรก 9 ตู้"
		        },
		        {
		            "name": "จบ/จุดเริ่มต้น",
		            "description": "ระเบิดช่องว่างที่ผกผัน"
		        },
		        {
		            "name": "คุกกี้คลิกเกอร์",
		            "description": "คลิกที่คุกกี้"
		        },
		        {
		            "name": "กะลาสีขี้เมา",
		            "description": "บีบแตร 64 ครั้งโดยไม่มีเหตุผล"
		        },
		        {
		            "name": "มิสเตอร์ไมน์",
		            "description": "มีช่องขุดเจาะ 9 ช่อง"
		        },
		        {
		            "name": "มีข้อจำกัดใช่ไหม?",
		            "description": "ขุดให้ลึกลงไป 64 กิโลเมตร"
		        },
		        {
		            "name": "เซธ บรันเดิล",
		            "description": "เทเลพอร์ต <s>1</s> 64 ครั้ง"
		        },
		        {
		            "name": "หินสีแดง-หินสีน้ำเงิน",
		            "description": "จบเกมโดยไม่ต้องลบอะไรเลยเป็นเวลา 15 นาที และมีไซโลกันไว้น้อยกว่า 15 อัน"
		        },
		        {
		            "name": "ไปลงนรก!",
		            "description": "รับอัญมณีนรกภายใน 64 นาทีแรกตั้งแต่เริ่มต้น"
		        },
		        {
		            "name": "ขูดพื้นผิว",
		            "description": "ขุดให้ลึกลงไป 64 กิโลเมตร"
		        },
		        {
		            "name": "ร้อนใช่ไหม?",
		            "description": "ขุดให้ลึกลงไป 640 กิโลเมตร"
		        },
		        {
		            "name": "ลึกเกินไป",
		            "description": "ขุดให้ลึกลงไป 6400 เมตร"
		        },
		        {
		            "name": "ลงไป 64 กม./ชม",
		            "description": "เข้าถึงความลึก 6400 ม. ภายใน 6 นาทีหลังจากวางช่องขุดใหม่"
		        },
		        {
		            "name": "โรคกลัวสิ่งใหม่",
		            "description": "เสร็จสิ้นเกมโดยไม่ต้องอัพเกรดช่องสกัดกั้น"
		        }
		    ],
		    "resources": [
		        "ชาโรไนต์",
		        "เอลเมอรีน",
		        "ควอนิไทต์",
		        "เบต้าไพลีน",
		        "อัญมณีนรก",
		        "โครมาลิท",
		        "โฟมแห่งสวรรค์",
		        "ก้อนหินกลวง",
		        "แปลน",
		        "ความเป็นจริง"
		    ],
		    "entities": {
		        "pinhole": {
		            "name": "?",
		            "description": "U/D, C/S, T/B, E/νE, μ/νμ, τ/ντ, G/γ, Z/W, H, Δ/νΔ"
		        },
		        "gradient": {
		            "name": "บ่อไล่ระดับ",
		            "description": "ลูกบาศก์ที่ขุดเหมืองได้ตลอดกาล ตอบสนองต่อตัวลดความคงตัวและเครื่องสะท้อนเสียงส่วนใหญ่ ควรเชื่อมต่อกับแคสซึมผกผันผ่านตัวนำ"
		        },
		        "chasm": {
		            "name": "ช่องว่างที่ผกผัน",
		            "description": "สะพานสู่ดินแดนที่ไม่รู้"
		        },
		        "conductor": {
		            "name": "ตัวนำ",
		            "description": "เชื่อมต่อเหวที่ผกผันไปยังไซโลอุตสาหกรรม"
		        },
		        "pump": {
		            "name": "กำลังแยกช่อง",
		            "description": "แยกทรัพยากรและวางไว้รอบๆตัวมันเอง"
		        },
		        "pump2": {
		            "name": "ช่องขุดเจาะ",
		            "description": "การอัพเกรดช่องการสกัด ขุดค้นทรัพยากรจำนวนมากอย่างรวดเร็วและวางไว้รอบ ๆ ตัวมันเอง"
		        },
		        "vault": {
		            "name": "คลังนรก",
		            "description": "ป้องกันอัญมณีนรก 1024 เม็ดจากสิ่งแวดล้อม"
		        },
		        "cube": {
		            "name": "ลูกบาศก์ทรัพยากร",
		            "description": "การแยกทรัพยากร"
		        },
		        "destabilizer": {
		            "name": "เครื่องทำลายเสถียรภาพ",
		            "description": "วางสิ่งนี้ไว้ข้างลูกบาศก์เพื่อทำลายมันให้เร็วขึ้นสองเท่า ต้องใช้เอลเมอรีนในการทำงาน สารเพิ่มความคงตัวเพิ่มเติมจะช่วยเพิ่มประสิทธิภาพ"
		        },
		        "destabilizer2": {
		            "name": "เครื่องทำให้เสถียรทางอุตสาหกรรม",
		            "description": "การอัพเกรดตัวทำลายเสถียรภาพ เพิ่มพลังของกระบวนการบดทรัพยากรเป็นสี่เท่า ต้องใช้เอลเมอรีน 64 อัน เพื่อดำเนินการ เพิ่มสารทำลายเสถียรภาพเพิ่มจะช่วยเพิ่มผลกระทบ"
		        },
		        "destabilizer2a": {
		            "name": "ตัวทำลายเสถียรภาพของอัญมณีนรก",
		            "description": "การอัพเกรดเครื่องทำลายเสถียรภาพทางอุตสาหกรรม เพิ่มพลังของกระบวนการทำลายทรัพยากร 625 เท่าเมื่อมีอัญมณีนรกอยู่ในลูกบาศก์ที่สกัดออกมา มิฉะนั้นก็ไม่เกิดประโยชน์อะไร ต้องใช้อัญมณีนรก 1 อันจึงจะใช้งานได้ เพิ่มสารทำลายเสถียรภาพเพิ่มจะช่วยเพิ่มประสิทธิภาพ"
		        },
		        "doublechannel": {
		            "name": "ช่องทำความเย็น",
		            "description": "วางสิ่งนี้ไว้ข้างเครื่องสกัดลูกบาศก์เพื่อแยกลูกบาศก์ให้ได้เร็วขึ้นสองเท่า การเพิ่มเครื่องทำความเย็นจะช่วยเพิ่มให้มีประสิทธิภาพ"
		        },
		        "doublechannel2": {
		            "name": "ช่องทำความเย็นที่ใช้งานอยู่",
		            "description": "การอัพเกรดช่องทำความเย็น เพิ่มการระบายในช่องต้นทางเป็นสามเท่าหากวางไว้ข้าง ๆ เครื่องทำความเย็นจะช่วยเพิ่มประสิทธิภาพ"
		        },
		        "valve": {
		            "name": "วาล์วย้อนกลับ",
		            "description": "ป้องกันไม่ให้เครื่องแยกลูกบาศก์รีเซ็ตเป็นตำแหน่งเดิมหากวางไว้ข้าง ๆ ต้องใช้ชาโรไนต์เพื่อดำเนินการ"
		        },
		        "auxpump": {
		            "name": "ปั๊มเสริม",
		            "description": "การอัพเกรดวาล์วย้อนกลับ สร้างแรงกดดันให้กับช่องต้นทาง หากวางอยู่ข้าง ๆ ต้องใช้เอลเมอรีน 8 เม็ดจึงจะดำเนินการได้ เพิ่มปั๊มเพื้อให้ไม่เพิ่มแรงดันในช่องต้นทาง"
		        },
		        "auxpump2": {
		            "name": "สถานีสูบน้ำ",
		            "description": "การอัพเกรดปั๊มเสริม เพิ่มแรงดันเป็นสี่เท่าให้กับช่อง หากวางไว้ข้าง ๆ ต้องใช้เอลเมอรีน 256 อัน และเบต้าไพลีน 4 อัน จึงจะทำงานได้ หลายสถานีไม่เพิ่มการระบายในช่องต้นทาง"
		        },
		        "entropic": {
		            "name": "ตัวสะท้อนเอนโทรปี",
		            "description": "ทุก ๆ ระยะเวลาจะทำการบดวัสดุหากวางไว้ข้างก้อนลูกบาศก์ ต้องการควอนิไทต์เพื่อให้ทำงานได้"
		        },
		        "entropic2": {
		            "name": "ตัวสะท้อนเอนโทรปี II",
		            "description": "การอัพเกรดตัวสะท้อนเอนโทรปี บดขยี้ทรัพยากรเร็วขึ้น 3 เท่า ต้องใช้โครมาลิทจึงจะทำงานได้"
		        },
		        "entropic2a": {
		            "name": "ตัวเก็บประจุเอนโทรปี",
		            "description": "การอัพเกรดตัวสะท้อนเอนโทรปี บดขยี้ทรัพยากรในขณะที่ปรากฏบนพื้นผิวด้วยพลัง 600% แต่เพียงครั้งเดียวต่อลูกบาศก์ ต้องใช้โครมาลิท 8 เม็ดจึงจะทำงานได้"
		        },
		        "entropic3": {
		            "name": "แปลนตัวสะท้อน",
		            "description": "การอัพเกรดตัวสะท้อาเอนโทรปี II เมื่อการทำลายล้างเกิดขึ้น เครื่องสะท้อนกลับจะบดขยี้ลูกบาศก์ที่อยู่รอบ ๆ ด้วยพลังอันมหาศาล"
		        },
		        "converter32": {
		            "name": "ถังเสริมสารชาโรไนต์",
		            "description": "ปฏิกิริยาควอเนไทต์กับชาโรไนต์อย่างช้า ๆ เพื่อผลิตเอลเมอรีน"
		        },
		        "converter13": {
		            "name": "บ่อชาโรไนต์",
		            "description": "เรียกคืน ควอเนไทต์ จากตะกอน ชาโรไนต์ ที่เป็นของเหลวโดยมีตัวเร่งปฏิกิริยาอยู่"
		        },
		        "converter41": {
		            "name": "สารออกซิไดเซอร์เบต้าไพลีน",
		            "description": "เผาเบต้าไพลีนเพื่อผลิตชาโรไนต์และติดตามปริมาณธาตุอื่นๆ"
		        },
		        "converter76": {
		            "name": "เครื่องฉายรังสีจากสวรรค์",
		            "description": "ฉายรังสีโฟมสวรรค์ด้วยโครมาลิท โดยเปลี่ยนโฟมให้กลายเป็นโครมาลิท ซึ่งเป็นแหล่งที่ดีของอัญมณีนรก เบต้า-ไพลีน กาเนไทต์และเอลเมรีน เนื่องจากการสลายของโครมาลิท"
		        },
		        "converter64": {
		            "name": "เครื่องปฏิกรณ์สวรรค์",
		            "description": "รองรับการผสมผสานที่ควบคุมได้ของโครมาลิทและโฟมแห่งสวรรค์ เพื่อผลิตเบต้าไพลีน ไม่สามารถทำงานใกล้กับเครื่องปฏิกรณ์สวรรค์อื่น ๆ ได้"
		        },
		        "reflector": {
		            "name": "เครื่องฉายรังสีจากสวรรค์",
		            "description": "ปรับปรุงประสิทธิภาพของเครื่องปฏิกรณ์สวรรค์ที่อยู่ติดกัน"
		        },
		        "mega1": {
		            "name": "หอกระจายวัสดุ",
		            "description": "เพิ่มการมองเห็นโดยการบีบอัดทรัพยากรที่กำลังเคลื่อนที่ มีเพียงหนึ่งเดียวเท่านั้น"
		        },
		        "mega1a": {
		            "name": "หอกระจายวัสดุ MKII",
		            "description": "การอัพเกรดหอกระจายวัสดุ เพิ่มความเร็วในการถ่ายโอนทรัพยากร มีเพียงหนึ่งเดียวเท่านั้น"
		        },
		        "mega1b": {
		            "name": "หอกระจายวัสดุ MKIII",
		            "description": "การอัพเกรดหอกระจายวัสดุ MKII บีบอัดทรัพยากรที่เคลื่อนไหวมากยิ่งขึ้น มีเพียงหนึ่งเดียวเท่านั้น"
		        },
		        "mega2": {
		            "name": "หอรีไซเคิล",
		            "description": "อนุญาตให้รีไซเคิลเครื่องจักรที่จะส่งคืนทรัพยากร 90% สามารถมีได้แค่หนึ่งอันเท่านั้น"
		        },
		        "mega3": {
		            "name": "การแยกส่วนหอคอย",
		            "description": "การอัพเกรดหอรีไซเคิล อนุญาตให้ถอดชิ้นส่วนเครื่องจักรซึ่งส่งคืนทรัพยากรทั้งหมด สามารถมีได้แค่อันเดียวเท่านั้น"
		        },
		        "voidsculpture": {
		            "name": "แท่นแปลนยกย่อง",
		            "description": "ช่วยให้คุณสามารถเพิกเฉยต่อข้อเสียด้านการมองเห็นของแปลนเครื่องจักร"
		        },
		        "eye": {
		            "name": "เครื่องเตือนการเติม",
		            "description": "ระบุว่าเครื่องพร้อมสำหรับการเติม มีเพียงหนึ่งเดียวเท่านั้น"
		        },
		        "cookie": {
		            "name": "คุกกี้",
		            "description": "มันไปอยู่ตรงนั้นได้อย่างไร?"
		        },
		        "injector": {
		            "name": "เครื่องฉีดอัญมณีนรก",
		            "description": "สลับทรัพยากรแบบสุ่มจากลูกบาศก์ที่อยู่ติดกันด้วยอัญมณีนรก หากไม่มี มี 32 ชาร์จหากได้รัอัญมณี 32และ ควอนิไทต์ 64"
		        },
		        "silo": {
		            "name": "ไซโลใต้ดิน",
		            "description": "เมื่อเปิดใช้งาน มันจะเติมเครื่องใกล้เคียงและเติมอีก 16 ครั้งโดยอัตโนมัติ"
		        },
		        "silo2": {
		            "name": "อุตสาหกรรม ไซโล",
		            "description": "การอัพเกรดถังไซโลใต้ดิน เมื่อเปิดใช้งาน มันจะเติมเครื่องใกล้เคียงและเติมอีก 64 ครั้งโดยอัตโนมัติ"
		        },
		        "vessel": {
		            "name": "ภาชนะบรรจุ",
		            "description": "เก็บโครมาลิทจำนวน 32 เม็ดเพื่อป้องกันการแตกตัว ใช้งานอัญมณีนรกหนึ่งเม็ด"
		        },
		        "vessel2": {
		            "name": "ภาชนะบรรจุไซโล",
		            "description": "การอัพเกรดภาชนะควบคุม เก็บโครมาลิท 32,768 เม็ดเพื่อป้องกันการแตกตัว ใช้พลังงานจากความเป็นจริง"
		        },
		        "consumer": {
		            "name": "โรงกลั่นตัวเร่งปฏิกิริยา",
		            "description": "ใช้ทรัพยากรที่เสียหายที่อยู่ติดกัน หลังจากสะสมทรัพยากรได้ 1,024 รายการ มันจะปล่อยทุกอย่างพร้อมเพิ่มโบนัส จำนวนโบนัสจะเพิ่มขึ้นตามการเปิดตัวแต่ละครั้งติดต่อกันสูงสุดถึง 100% หากไม่มีการใช้ทรัพยากรภายใน 16 วินาที เอฟเฟกต์จะถูกรีเซ็ต"
		        },
		        "preheater": {
		            "name": "เครื่องเร่งปฏิกิริยาทำความร้อน",
		            "description": "เพิ่มความเร็วของเครื่องแปลงทรัพยากรหากวางไว้ข้าง ๆ ตัวแปลงแต่ละตัวจะเพิ่มความเร็วของเครื่องเร่งปฏิกิริยาความร้อนได้ถึง 300% หากเครื่อง 8 เครื่องได้รับผลกระทบ"
		        },
		        "hollow": {
		            "name": "โครงสร้างหินที่มีช่องกลวง",
		            "description": "มีรูกลวงเยอะมาก"
		        },
		        "strange": {
		            "name": "ก้อนหินกลวง",
		            "description": "มันดูเหมือนว่ามันอยู่ตรงนั้นมาสักพักแล้ว"
		        },
		        "strange1": {
		            "name": "แหล่งวิจัยก้อนหินกลวง",
		            "description": "ทำให้โฟมแห่งสวรรค์ทำลายล้างด้วยอัญมณีนรก 512 เม็ด แทนที่จะเป็น 64 เม็ด ในทางเหนือ"
		        },
		        "strange2": {
		            "name": "สถานที่อัพเกรดก้อนหินกลวง",
		            "description": "เพิ่มจำนวนก้อนหินกลวงสูงสุดเป็นสองเท่า และเพิ่มอัตราการเกิดของหินเหล่านั้น"
		        },
		        "strange3": {
		            "name": "รูกลวงที่สร้างขึ้นใหม่",
		            "description": "เพิ่มอัตราการเกิดของก้อนหินกลวงมากขึ้น และทำทุกอย่างเงียบ ๆ"
		        },
		        "generaldecay": {
		            "name": "เครื่องปฏิกรณ์สลายตัวทั่วไป",
		            "description": "ปรับปรุงประสิทธิภาพการสลายตัวของโครมาลิทมากขึ้น สามารถมีได้เพียงอันเดียวเท่านั้น"
		        },
		        "waypoint": {
		            "name": "จุดอ้างอิง",
		            "description": "เทเลพอร์ตจุดอ้างอิงที่มีอยู่ถัดไปมายังตำแหน่งของคุณ"
		        },
		        "annihilator": {
		            "name": "ผู้ทำลายล้าง",
		            "description": "เครื่องผลิตแปลนเมื่ออัญมณีนรกทำลายล้างด้วยโฟมแห่งสวรรค์ ต้องใช้ก้อนหินกลวงจึงสามารถจะทำงานได้"
		        },
		        "flower": {
		            "name": "เครื่องดอกไม้กลวง",
		            "description": "ลดโอกาสกาสการบิดเบี้ยวของเวลา ลดผลกระทบของก้อนหินกลวงหนึ่งอัน จะต้องสร้างขึ้นบนหินกลวง และทำลายหินกลวงที่มันถูกสร้างขึ้น"
		        },
		        "fruit": {
		            "name": "ผลไม้กลวง",
		            "description": "วิวัฒนาการของดอกไม้โปร่ง ป้องกันการเกิดก้อนหินกลวงมาหล่อเลี้ยงตัวเอง โดยการผลิตก้อนหินกลวง"
		        },
		        "eraser": {
		            "name": "รื้อถอน",
		            "description": "ทำลายเครื่องจักรโดยคืนทรัพยากรที่ใช้ในการสร้าง 50%"
		        },
		        "eraser2": {
		            "name": "รีไซเคิล",
		            "description": "รีไซเคิลเครื่องจักรโดยคืนทรัพยากร 90% ที่ใช้ในการสร้างเครื่องจักร"
		        },
		        "eraser3": {
		            "name": "ถอดแยกชิ้นส่วน",
		            "description": "แยกชิ้นส่วนเครื่องจักรเพื่อส่งคืนทรัพยากรทั้งหมดที่ใช้ในการสร้างมัน"
		        },
		        "clicker1": {
		            "name": "แคเนไทต์ ออสซิลเลเตอร์",
		            "description": "อนุญาตให้คุณสามารถคลิกทรัพยากรค้างไว้เพื่อทำลายทรัพยากรเหล่านั้น มีเพียงหนึ่งเดียวเท่านั้น"
		        },
		        "clicker2": {
		            "name": "ออสซิลเลเตอร์อัญมณีนรก",
		            "description": "การอัปเกรดเป็น แคเนไทต์ ออสซิลเลเตอร์ เพิ่มความถี่ความผันผวน มีเพียงหนึ่งเดียวเท่านั้น"
		        },
		        "clicker3": {
		            "name": "โครมาลิท ออสซิลเลเตอร์",
		            "description": "อัปเกรดเป็นออสซิลเลเตอร์อัญมณีนรก เพิ่มความถี่การสั่นให้สูงสุด มีเพียงหนึ่งเดียวเท่านั้น"
		        },
		        "stabilizer": {
		            "name": "เครื่องปรับเสถียรภาพ",
		            "description": "ทำให้ช็อตไฟฟ้าที่อยู่ใกล้เคียงมีเสถียรภาพเพื่อใช้พลังงานชั่วคราว"
		        },
		        "stabilizer2": {
		            "name": "เครื่องปรับเสถียรภาพ II",
		            "description": "การอัพเกรดเครื่องปรับเสถียรภาพ ปรับปรุงเสถียรภาพและประสิทธิภาพ"
		        },
		        "stabilizer3": {
		            "name": "เครื่องปรับเสถียรภาพที่แตกสลาย",
		            "description": "การอัพเกรดแบบผิดปกติ ปรับปรุงประสิทธิภาพและเพิ่มเสถียรภาพสูงสุด มีได้เพียงหนึ่งเดียว"
		        }
		    },
		    "messages": [
		        "คุณอยู่ไหน?",
		        "ฉันอยู่ใจกลางของที่ไหนยังไม่รู้เลย",
		        "โอเค คุณเห็นอะไรบ้าง?",
		        "อืม ก็ไม่มากหรอก มีเครื่องจักรอยู่ที่นี่หนึ่งเครื่อง มันดูคุ้น ๆ แต่ฉันจำไม่ได้ว่ามันคืออะไร",
		        "เครื่องจักรอะไร?",
		        "รอก่อน บางทีฉันอาจจะ...",
		        "เดี๋ยว บอกฉันทีว่าตอนนี้คุณไม่ได้แตะเครื่องจักรมั่วซั่วอยู่!",
		        "มันทำงาน! มันเพิ่งสร้างบางอย่างได้",
		        "???",
		        "ลูกบาศก์สีดำขนาดใหญ่ มันราบรื่นมาก ฉันอยากจะทำลายมันจริง ๆ",
		        "คุณเมารึเปล่า?",
		        "ตอนนี้ฉันมีหิน 64 ก้อน!",
		        "อืม ก็ดีแล้ว ขอให้สนุกกับหินนั่นนะ",
		        "เฮ้ ฉันเจอหินสีเหลืองแล้ว!",
		        "ดีใจด้วย เพื่อน!",
		        "ฉันคิดว่าตอนนี้ฉันสามารถสร้างเครื่องจักรได้แล้ว ฉันควรสร้างบางอย่างเพื่อช่วยทำลายลูกบาศก์เหล่านี้ให้ง่ายขึ้น หากลูกบาศก์ปรากฏขึ้นในเซลล์ที่อยู่ติดกัน แม้จะอยู่ในแนวทแยง ลูกบาศก์ก็อาจจะใช้งานได้",
		        "เดี๋ยวนะ คุณกำลังเล่นเกมแปลก ๆ อยู่ใช่ไหม? คุณกำลังทำให้ฉันโมโห",
		        "ตอนนี้ฉันแค่ต้องใส่หินสีเหลืองเข้าไปในเครื่องนี้",
		        "อะไรที่ทำให้คุณมีความสุข... นอกจากเรื่องตลก วันนี้คุณจะมาด้วยรึเปล่า?",
		        "แน่นอน! ฉันจะไปถึงที่นั่นในอีกไม่กี่ชั่วโมง แค่ต้องจัดการเรื่องนี้ให้เสร็จ",
		        "คุณกำลังทำอะไรอยู่กันแน่?",
		        "ฉันจะส่งข้อความถึงคุณในภายหลัง ต้องดันเครื่องจักรนี้ต่อ ขอโทษด้วย",
		        "ฉันเชื่อว่าเครื่องจักรในแต่ละเครื่องมันมีอิทธิพลเมื่อวางไว้ในเซลล์ที่อยู่ติดกันหรือแนวทแยง เช่น ต้องวางพัดลมนี้ไว้ข้างเครื่องแรกเพื่อเร่งกระบวนการ",
		        "ตอนนี้คุณพูดมีเหตุผลมากเลย",
		        "ก็นะ?",
		        "คุณอยู่ไหน?",
		        "เรารอคุณนานเป็นชาติแล้วนะ",
		        "คุณหมายความว่าไง? ฉันก็ยังอยู่ที่นี่",
		        "ที่ไหน???",
		        "ตอนนี้ฉันมีหินสีน้ำเงินแล้ว หรือมันเป็นสีม่วงกันนะ? ดูเหมือนเชิงเทียนทองเหลืองโบราณ ฉันคิดว่าฉันสามารถใช้มันเพื่อลบเครื่องจักรที่วางผิดที่ได้",
		        "คุณล้อเล่นฉันรึเปล่า? ฉันคิดว่าคุณบอกว่าคุณจะมา อะไรกันวะเนี่ย?!",
		        "ใจเย็น ๆ นะเพื่อน ฉันจะไปถึงที่นั่นในอีกเดี๋ยว",
		        "ว้าว ฉันสามารถใช้ [Q] เพื่อโคลนเครื่องหรือทำลายมันได้ถ้าฉันคลิกที่เซลล์ว่างก่อน! และ [Alt] ช่วยให้มองเห็นด้านหลังเครื่องจักรที่สูง",
		        "เร็ว ๆ หน่อย",
		        "พวกคุณยังอยู่ที่นั่นอยู่ไหม?",
		        "โอ้แม่เจ้า!!!",
		        "คุณอยู่ไหน????",
		        "คุณเป็นอะไรไหม??",
		        "????",
		        "อะไรกันวะเนี่ย?",
		        "คุณเป็นอะไรไหม? คุณอยู่ไหน?",
		        "ใจเย็น ๆ สิเพื่อน! ฉันไม่เป็นไร เกิดอะไรขึ้น?",
		        "คุณบอกฉันมาสิ! คุณหลอกฉันมาสองสัปดาห์แล้ว! ฉันเคยไปบ้านคุณหลายครั้งแต่คุณไม่อยู่ที่นั่น แค่บอกฉันมาว่าคุณอยู่ที่ไหน แค่นั้นเอง ตอนนี้คุณถึงบ้านหรือยัง?",
		        "เพื่อน คุณพูดถึงเรื่องอะไรกันแน่? เราเพิ่งส่งข้อความหากันตั้งแค่สองนาทีที่แล้วเองนะ",
		        "เกิดอะไรขึ้นกับคุณ??? ตอนแรกคุณไม่มา จากนั้นคุณก็หายไปเลย และตอนนี้คุณก็ทำเหมือนไม่มีอะไรเกิดขึ้น!",
		        "ฉันถามคำถามง่ายๆกับคุณแล้วนะ",
		        "คุณอยู่ไหน?",
		        "ฉันอยู่นี่",
		        "ที่ไหน",
		        "เดี๋ยวก่อน...",
		        "มันไม่ตลกนะ คุณอยู่ที่ไหนกันแน่? คุณช่วยบอกฉันทีได้ไหม?",
		        "ก็ได้...",
		        "เพื่อน ฉันไม่รู้จริง ๆ",
		        "ขอเวลาแป๊ปนึง",
		        "คุณหมายความว่าไงที่บอกว่าไม่รู้?",
		        "ฉันต้องรวบรวมความคิดของฉันหน่อย",
		        "ทุกอย่างเรียบร้อยดีใช่ไหม? คุณปลอดภัยไหม? ฉันควรโทรหาใครไหม?",
		        "ไม่ต้อง ฉันไม่เป็นไร ฉันเพียงแค่",
		        "เดี๋ยวฉันจะส่งข้อความถึงคุณ",
		        "ให้ตายสิ เพื่อน เกิดอะไรขึ้น?",
		        "ฉันกลัวนะ",
		        "ดูเหมือนว่าฉันไม่รู้ว่าฉันอยู่ที่ไหน",
		        "นี่มันแปลกมาก ฉันหมายความว่าทุกอย่างรอบตัวฉันปกติดี แต่ฉันไม่สามารถอธิบายสถานที่นี้ได้",
		        "มันเหมือนกับความฝันเลย แต่ก็ไม่ใช่ เพราะทุกอย่างเป็นสีขาวและมีเครื่องจักรเหล่านี้ และมีลูกบาศก์ มันไม่สมเหตุสมผลเลย",
		        "ฉันไม่ได้เมาหรืออะไรทั้งนั้น ฉันเพิ่งรู้ว่ามันแปลกแค่ไหนที่ฉันไม่เคยสังเกตว่าสิ่งนี้ไม่เหมือนอะไรกับที่ฉันเคยเห็น",
		        "ตอนนี้ฉันได้หินสีแดงมาแล้ว และมันช่างน่าขนลุกที่ฉันไม่เป็นอะไรเลย ฉันโอเค มันเป็นแค่หินสีแดงเอง ทุกอย่างยังปกติเรียบร้อยดี",
		        "คุณไม่ได้ล้อเล่นใช่ไหม...",
		        "ฉันเห็นว่าทุกอย่างมันเป็นอย่างไร แต่ใช่ ทุกอย่างมันอยู่ตรงหน้าฉันเลย",
		        "ฉันทำอะไรให้คุณได้ไหม?",
		        "แค่คุยกับฉัน แค่นั้น",
		        "ได้สิเพื่อน ได้เลย ยังไงซะ ตอนนี้ตำรวจกำลังตามหาคุณอยู่ เหมือนคุณหายตัวไปเลย",
		        "คุณแสดงข้อความของเราให้พวกเขาดูหรือเปล่า?",
		        "มันจะช่วยได้ยังไง? ไม่เอา ฉันเปิดการลบอัตโนมัติแล้ว",
		        "ขอบคุณ!",
		        "ที่นั่นเป็นยังไงบ้าง?",
		        "ปรากฎว่าฉันสามารถเคลื่อนที่ได้โดยใช้ WASD แต่รอบ ๆ นี้ไม่มีอะไรน่าสนใจเลย นอกจากหินประหลาดแถวทางเหนือนี้",
		        "งั้นเข็มทิศในโทรศัพท์ของคุณก็ใช้งานได้สิ!",
		        "ก็ใช้ได้, จากนี้ไปก็แค่ \"ขึ้น\" แค่นั้น ถ้างั้นฉันเดาว่านั่นคือทิศเหนือ",
		        "ดูมีเหตุผล",
		        "และที่สำคัญคือฉันไม่มีโทรศัพท์...",
		        "แล้วคุณส่งข้อความหาฉันได้ยังไงล่ะ?",
		        "ฉันไม่รู้!! ฉันเพิ่งรู้เมื่อคุณส่งข้อความถึงฉัน และฉันสามารถตอบสนองต่อคุณได้! มันอธิบายยาก",
		        "อย่าเหงื่อตกล่ะ เราคุยกันได้และนั่นก็ดีพอแล้ว",
		        "ใช่ คุณพูดถูก",
		        "งั้น... บอกฉันเกี่ยวกับเครื่องจักรหน่อยสิ",
		        "คุณหมายความว่ายังไง?",
		        "พวกเขาเป็นใคร พวกเขาจะทำอะไร พวกมันทำงานยังไง?",
		        "พวกมันดูน่าทึ่งมาก มีทั้งสายเคเบิล สายไฟ และอะไรเยอะแยะเลย",
		        "ตัวอย่างเช่น กล่องหนึ่งดูเหมือนกล่องพลาสติกขนาดใหญ่ที่มีขดลวดทองแดงอยู่ด้านบน ที่มีหินสีน้ำเงินวางอยู่ และมีป้ายขนาดใหญ่เขียนว่า \"E—01SR\" อยู่ด้านข้าง โดยมีป้ายที่เล็กกว่าเขียนว่า \"ระวัง! รังสีเอนโทรปีรุนแรง\"",
		        "หมายความว่ายังไง?",
		        "ฉันไม่แน่ใจเลย ฉันเดาว่าที่นั่นพอมีรังสีเอนโทรปีอยู่บ้าง",
		        "เดี๋ยวนะ ฉันคิดว่าคุณสร้างเครื่องจักรพวกนี้?",
		        "ใช่... ฉันเข้าใจว่าคุณหมายถึงอะไร",
		        "ฉันแค่สร้างพวกมันจากลูกบาศก์ แต่ฉันไม่รู้ว่าข้างในมีอะไร ใช่แล้ว มันฟังดูแปลกๆ ขอฉันคิดดูก่อนนะ",
		        "และดูเหมือนว่าหินสีเหลืองและสีน้ำเงินนั้นจะไม่มีที่สิ้นสุด แล้วฉันควรลงทุนในตัวแปลงเหล่านั้นหรือเหมืองใหม่กันแน่นะ",
		        "ฟังดูเหมือนแผนที่ดีนะ",
		        "ช่างน่ารำคาญจริงๆ!",
		        "ห๊ะ?",
		        "หินสีเขียว! ต้องใช้เวลานานกว่าจะทำลายมันได้ ฉันต้องหาอะไรมาซักอย่างถ้าพวกมันยังโผล่มาอยู่เรื่อย ๆ",
		        "ฉันแน่ใจว่าคุณจะสร้างเครื่องจักรที่น่าทึ่งขึ้นมาได้!",
		        "คุณพนันได้เลย!",
		        "ใช่เลย! อัญมณีนรก ระวัง",
		        "ให้พวกมันลงนรก!",
		        "จำได้ไหมว่าคุณถามเกี่ยวกับเครื่องจักร?",
		        "จำได้สิ",
		        "ฉันไม่คิดว่าพวกมันเป็นของจริง",
		        "มันหมายความว่าไง?",
		        "มันเหมือนอยู่ในความฝัน ฉันไม่สามารถมองเข้าไปข้างในหรือมองเห็นพวกเขาจากอีกด้านหนึ่งได้",
		        "การนำเสนอเทคโนโลยีที่ไม่สามารถอธิบายได้มันดูคลุมเครือ",
		        "ฉันคิดว่าเครื่องจักรเหล่านี้เป็นแบบนี้ก็เพราะว่าฉันรับรู้ถึงวิธีการใช้งานฟังก์ชันของมัน",
		        "เหมือนว่า ถ้ามีอะไรที่ตัดต้นไม้ได้ ก็ควรมีลักษณะเหมือนขวานใช่ไหม?",
		        "อะไรทำนองนั้นแหละ",
		        "อืมก็ อย่างน้อยคุณก็ดูเหมือนเป็นของจริงสำหรับฉัน",
		        "ใช่แล้ว ฉันคิดว่าคุณคือสิ่งเดียวที่เป็นจริงสำหรับฉันในตอนนี้",
		        "ฉันมีลูกบาศก์ใหม่อยู่จำนวนหนึ่ง แบะมันกำลังจะเสื่อสภาพไปเป็นลูกบาศก์อื่น!",
		        "แบบนั้น ก็ดี ก็ไม่ได้แย่",
		        "ฉันขอพูดอะไรบางอย่างที่พิลึกสุด ๆ",
		        "คุณเห็นความแปลกประหลาดในสิ่งที่คุณเพิ่งเขียนไปไหม?",
		        "อาจเป็นเพราะสถานที่แปลก ๆ แห่งนี้ แต่ฉันลืมชื่อของคุณ",
		        "งั้น ฉันคิดว่าเราน่าจะใช้เวลาร่วมกันมากกว่านี้อีกสักหน่อย",
		        "ฉันพูดจริงนะ",
		        "ชื่อฉันคือ ดุ๊ก นุเคม เห็นๆอยู่",
		        "เพื่อน หยุดได้แล้ว!",
		        "นั่นคือสิ่งที่เธอพูดเหรอ!",
		        "นี่มันงี่เง่ามาก! หยุดหลอกฉันได้แล้ว เกิดอะไรขึ้น?",
		        "ให้ตายสิ",
		        "ดูเหมือนว่าฉันจะจำชื่อของตัวเองไม่ได้เหมือนกัน",
		        "ฉันจำไม่ได้จริง ๆ! มันบ้ามาก และฉันจำชื่อคุณไม่ได้!",
		        "บางทีมันอาจเป็นเพียงเพราะมีฮิสทีเรียเยอะไป? ฉันได้ยินมาว่ามันสามารถส่งผลกระทบต่อคนหลายคนพร้อมกัน เรามาสงบสติอารมณ์และดูว่าเกิดอะไรขึ้นกันดีกว่า",
		        "ใช่สิ ใช่แล้ว ฮิสทีเรีย",
		        "ฉันก็ยังคงจำชื่อฉันไม่ได้",
		        "ฉันก็ไม่เหมือนกัน และยังมีอีกเยอะเลย",
		        "ใช่! ฉันมีหน้าตายังไง? เราเจอกันเมื่อไหร่?",
		        "บ้านของฉันหน้าตาเป็นยังไง ใครเป็นเพื่อนเราบ้าง? เราเคยเจอกันบ้างไหม?",
		        "ดูเหมือนว่าเราทั้งคู่ติดอยู่ในสถานการณ์บ้าๆนี้ด้วยกัน และฉันบอกไม่ได้ว่ามันเป็นแบบนั้นตลอด หรือมีบางอย่างเกิดขึ้นที่ตรงไหนสักที่ นี่เป็นความฝันแปลกๆ หรือเปล่า? แล้วใครล่ะที่กำลังฝัน?",
		        "มีเครื่องจักรที่ใกล้ๆไหม? บางทีลูกบาศก์อาจโผล่ขึ้นมาที่ไหนสักแห่ง?",
		        "ตลกแล้ว",
		        "เอาล่ะ มาคิดชื่อให้ตัวเองกันเถอะ",
		        "เสียงคุณเหมือนวีนเลย",
		        "ทำไมจะไม่เหมือนล่ะ",
		        "ไม่ได้มีอะไรกับวีนเลยนะ",
		        "เฮ้ วีน คุณอยากได้ถั่วไหม วีน? ใช่ ฟังดูดีนะ",
		        "และคุณจะเป็นชาร์ปส์สินะ",
		        "มีฮาร์ปอะไรที่คมๆบ้างไหม ชาร์ปส์?",
		        "ไม่สมเหตุสมผลเลย",
		        "ฉันชอบชาร์ปนะ ยินดีที่ได้รู้จักนะ วีน",
		        "เช่นกัน ชาร์ป",
		        "เกิดอะไรขึ้น",
		        "อะไร?",
		        "ลูกบาศก์สีขาว! พวกมันกำลังทำลายลูกบาศก์สีเขียว!",
		        "มีลูกบาศก์ที่พังเหมือนกันเยอะเลย! เหมือนมันจะอยู่ในเครื่องปฏิกรณ์นิวเคลียร์!",
		        "ฉิบหายแล้ว คุณไม่เป็นอะไรใช่ไหม?",
		        "ใช่ ฉันไม่เป็นไร! ตอนนี้มันวุ่นวายมาก ฉันต้องสร้างบางสิ่งบางอย่างเพื่อจัดการกับเรื่องนี้ บางทีฉันควรจะลองดูหินทางเหนืออีกครั้ง",
		        "นั่นคือสิ่งที่คุณทำมาตลอด ชาร์ป!",
		        "ฟังดูแปลกมาก!",
		        "ฉันหมายถึงชื่อของฉัน ฉันเดาว่าเมื่อถึงจุดหนึ่ง ฉันจะชินกับมันใช่ไหมวีน?",
		        "ใช่! แปลกจริง ๆ",
		        "จำได้ไหมที่ฉันพูดถึงหินแปลก ๆ ทางเหนือ?",
		        "ก็ไม่เชิงหรอก จำไม่ได้",
		        "ก็ ที่นั่นมีหินนี่แหละ และอย่าเข้าใจฉันผิด ฉันรู้ว่าทุกอย่างในที่นี่แปลก แต่หินก้อนนี้รู้สึกแปลกมากกว่าอะไรเลย",
		        "ฉันไม่เข้าใจเรื่องนี้เลย แต่ตอนนี้เมื่อฉันตัดสินใจกระตุ้นมันนิดเดียว มันก็เปลี่ยนแปลงบางสิ่งในกฎของจักรวาลเอง!",
		        "มันอันตรายไหม?",
		        "ฉันไม่รู้ การเปลี่ยนแปลงนั้นมันละเอียดอ่อนมาก",
		        "ฉันสงสัยจังว่ามันทำอะไรได้อีก",
		        "เอาล่ะ แค่อย่าทำลายจักรวาลโดยไม่ตั้งใจ",
		        "ฉันจะทำให้ดีที่สุด",
		        "นั่นเป็นหินที่ยากที่สุดในชีวิตของฉัน! แต่ตอนนี้ฉันคิดว่าฉันรู้วิธีทำลายมันให้เร็วขึ้นแล้ว",
		        "ได้หินใหม่หรือยัง?",
		        "ใช่ แปลกสุด ๆ เลย",
		        "ว้าว บางทีผลกระทบต่อจักรวาลอาจไม่ละเอียดอ่อนนัก คุณรู้สึกไหม?",
		        "รู้สึกอะไร?",
		        "บางทีอาจจะเป็นแค่ฉันน่ะ",
		        "คุณเคยเห็นลูกบาศก์ขนาดใหญ่อยู่ต่อหน้าคุณบ้างไหม?",
		        "อืม ตู้เย็นนับด้วยไหม?",
		        "เอ่อ ช่างมันเถอะ",
		        "ว้าว ลูกบาศก์ใหม่นี้ดำสนิทเลย และมันให้ความรู้สึกเหมือนนอกโลกเลย",
		        "มากกว่าโลกอื่นที่ผ่านมาเหรอ?",
		        "มันแตกต่างออกไป! อากาศหนาวจนแข็ง แต่ก็ไม่เป็นอันตราย เหมือนมันขาดแนวคิดเรื่องอุณหภูมิ และมันไม่โต้ตอบกับคุณเลย มันไม่ได้สร้างจากสสาร ไม่มีสีหรือสิ่งใดที่รู้สึกคุ้นเคย ถ้ามันสมเหตุสมผลสำหรับคุณ",
		        "ตามตรงแล้วมันก็ไม่ถูกต้อง",
		        "ฉันคิดว่าฉันเข้าใจแล้ว ฉันสามารถใช้ก้อนหินกลวงเพื่อกลั่นสิ่งที่ดำๆนั้นออกจากอากาศที่บางได้ มันก่อตัวเป็นผลึกที่เหมือนกันอย่างน่าประหลาด แต่ไม่มีคุณสมบัติอะไรเลย และนั่นจะแก้ไขความผิดปกติในจักรวาลในทางใดทางหนึ่ง",
		        "ฟังดูเหมือนแผ่นกรองอากาศเลย",
		        "ใช่แล้ว! ดูเหมือนว่าฉันจะทำให้อากาศเสียในบางจุด",
		        "คุณไม่จำเป็นต้องพูดดัง ๆ ก็ได้",
		        "ฉันตัดสินใจขุดหินประหลาดนั้นขึ้นมา บางทีอาจมีคำตอบถึงสิ่งที่เกิดขึ้นภายใน ฉันรู้สึกว่ามันอาจจะไม่ได้มีผลกับทุกอย่าง แต่มันอาจควบคุมทุกอย่างได้!",
		        "ทำไมคุณถึงคิดแบบนั้น?",
		        "คุณจะเชื่อฉันไหม ถ้าฉันบอกว่าฉันสัมผัสได้?",
		        "แน่นอนสิ! ฉันคิดว่าตอนนี้ฉันเชื่อทุกอย่าง หินควบคุมจักรวาลได้เหรอ? แล้วทำไมมันจะควบคุมไม่ได้ล่ะ?",
		        "ฉันคิดว่าฉันกำลังจะชัก!",
		        "ขอร้องล่ะ อย่านะ",
		        "เครื่องจักรเหล่านี้เริ่มมีเสียงดังอันตรายและกระพริบ บางทีฉันควรปรับอะไรบางอย่างเพื่อให้แก้ไขได้ หรือปรับตัวเองดี หรือปรับทั้งคู่ไปเลย",
		        "ตอนนี้ที่เรากำลังพูดถึง!",
		        "แล้วคุณปรับอะไรบ้าง?",
		        "เดี๋ยวก่อนนะ มีบางอย่างผิดปกติ",
		        "ฉันสร้างสิ่งหนึ่งจากของสีดำ และมันไม่ใช่เครื่องจักร แต่มันทำอะไรบางอย่างกับจุดอ้างอิง",
		        "จุดอ้างอิงคืออะไร?",
		        "พวกมันจะเคลื่อนย้ายจักรวาลรอบตัวคุณ นั่นคือวิธีที่คุณไปยังสถานที่ต่างๆ",
		        "คุณรู้ได้อย่างไรว่าพวกเขาเคลื่อนย้ายจักรวาล และคุณไม่ได้ทำใช่ไหม?",
		        "อืม ฉันไม่ได้คิดถึงเรื่องนั้น",
		        "ฉันคิดว่าฉันทำลายจักรวาล",
		        "ทั้งหมดนี้ไม่สมเหตุสมผลเลย!",
		        "เครื่องจักรไม่สมเหตุสมผลเลย ไม่มีอะไรสมเหตุสมผลเลย",
		        "ฉันหวังว่าฉันจะแก้ปัญหานี้ได้",
		        "วีน?",
		        "เพื่อน คุณอยู่ไหม?",
		        "ได้โปรด ได้โปรด ขอร้องอย่านะ! ฉันหวังว่าคุณจะทำรอยรั่วหรือทำอะไรสักอย่าง",
		        "วีน!",
		        "อะไร?",
		        "แต่ก็ยังแปลกอยู่ดี",
		        "โอ้ ขอบคุณพระเจ้า!",
		        "คุณได้สร้างเครื่องใหม่ได้ไหม?",
		        "ฉันคิดว่าฉันทำลายจักรวาลและคุณก็จากไปตลอดกาล! ฉันอยู่ในโลกใต้พิภพที่มีสัญลักษณ์อยู่รอบๆ และคิดว่าสิ่งเหล่านี้คือเศษซากของจักรวาล แต่มันเป็นจักรวาลอื่นหรือเวอร์ชันอื่นของจักรวาลนี้ เพราะมันคล้ายกัน และตอนนี้พวกมันก็เชื่อมโยงกัน",
		        "กำลังสำรวจเหรอ? ฟังดูน่าสนุกจัง!",
		        "สนุกเหรอ? คุณได้อ่านข้อความของฉันหรือยัง? อีกจักรวาลหนึ่งนะ!!!",
		        "คุณต้องยอมรับว่าคุณหมดความสามารถในการทำให้ฉันแปลกใจแล้ว",
		        "ก็ยุติธรรมดี",
		        "มันไม่ใช่หิน มันคือเลนส์",
		        "สามารถทำให้ทุกอย่างมารวมกันเป็นจุดเดียวได้ และฉันหมายถึงทุกอย่างเลย! ทั้งอวกาศ เวลา แนวคิดและกฎเกณฑ์ทั้งหมด ทุกอย่างเลย!",
		        "คุณหาคู่มือหรืออะไรเจอไหม?",
		        "ฉันไม่รู้ว่าทำไมมันถึงอยู่ที่นั่น และทำไมเราถึงอยู่ที่นี่ ฉันแค่รู้ว่ามันทำอะไรอยู่ตอนนี้",
		        "แล้ว... คุณจะเอาทุกอย่างมารวมกันทุกอย่างหรือจะทำอะไรดี?",
		        "ฉันไม่รู้ว่าจะทำยังไงดี แต่บางทีมันอาจเป็นประเด็นของสถานที่แห่งนี้ ตอนนี้มันลอยขึ้นไปในอากาศราวกับว่านั่นคือสิ่งที่มันควรจะทำ",
		        "แล้วจะเกิดอะไรขึ้นต่อ?",
		        "ไม่รู้เลย",
		        "ยิ่งฉันคิดถึงมันมากเท่าไร ฉันก็ยิ่งเข้าใจว่าไม่ใช่แค่เครื่องจักรของคุณเท่านั้นที่ไม่มีจริง",
		        "ฉันพยายามถามตัวเองด้วยคำถามเฉพาะเจาะจงแต่ก็ไม่มีคำตอบ",
		        "จำได้ไหมว่าฉันบอกว่าตำรวจกำลังตามหาคุณ? ฉันไม่ได้ล้อคุณเล่น แต่ตอนนี้ทุกอย่างพังมาก เมื่อฉันถามตัวเอง",
		        "ฉันมาที่สถานีตำรวจที่นี้หรือฉันโทรหาพวกเขาให้มา? และใครอยู่ที่นั่นเหรอ? ตำรวจ? สถานีตำรวจในเมืองอยู่ที่ไหน? เมืองนี้คือเมืองอะไร? ฉันอาศัยอยู่ในเมืองนี้รึเปล่า? เมืองชื่ออะไร? และมันเป็นรัฐอะไร? หรือมีรัฐอะไรบ้าง?",
		        "ฉันตอบคำถามเดียวไม่ได้ ทุกอย่างดูปกติจนกระทั่งฉันเริ่มถามคำถาม ฉันกลัวที่จะถามเพิ่มอีก",
		        "เรื่องนั้นขอโทษด้วย",
		        "ไม่ มันไม่ใช่ความผิดของคุณเลย ตามที่ฉันเห็น เราอยู่ในเรือลำเดียวกัน",
		        "ฉันหวังเพียงว่าคุณจะค้นพบว่าเรือลำนี้คืออะไร",
		        "ใช่ ฉันก็เหมือนกัน!",
		        "มาดูกันว่ามันจะจบลงอย่างไร ฉันแค่หวังว่านี่ไม่ใช่นรกชั่วนิรันดร์หรือบริเวณขอบนรก",
		        "แสดงให้พวกมันเห็นเลย ดันเต้!",
		        "ตอนนี้เรากำลังคุยกันอยู่ คนพวกนี้ควรจะทำให้จักรวาลนี้แห้งเหือด!",
		        "คุณดูเหมือนกับบริษัทน้ำมันเลย",
		        "ฉันเหนื่อยกับการปรับแต่งทุกอย่างเพื่อให้มีประสิทธิภาพที่เพิ่มขึ้นมานิดเดียว และฉันก็เบื่อกับเสียงรบกวนด้วย เครื่องนี้มันควรจะเปลี่ยนทุกอย่างได้ แต่มันกลับทะลุไปอีกด้านด้วย",
		        "มันอันตรายไหม?",
		        "แนวคิดเรื่องอันตรายที่นี่ค่อนข้างคลุมเครือ",
		        "ฉันคิดว่าถึงเวลาแล้วที่จะทำอะไรที่ยิ่งใหญ่",
		        "คุณกำลังคิดอะไรอยู่?",
		        "ฉันไม่แน่ใจ แต่มันต้องใหญ่แน่ๆ!",
		        "เหมือนเครื่องจักรขนาดใหญ่?",
		        "ไม่ ฉันกำลังพูดเชิงเปรียบเทียบ",
		        "ทำเลยสิ!",
		        "โอ้ แม่งเอ้ย",
		        "ฉันทำอะไรผิด ช่องว่างที่ผกผันถึงถูกทำลาย ทุกอย่างพังหมดเลย",
		        "คุณเป็นอะไรไหม?",
		        "เป็นสิ แต่เครื่องจักรกำลังถูกทำลาย! ฉันไม่สามารถสร้างอะไรได้เลย! ให้ตายเถอะ!",
		        "โปรดรอ! บางทีนั่นอาจจะมีอะไรเกิดขึ้น?",
		        "ไม่! มันไม่ถูกต้อง!",
		        "คุณรู้ได้ยังไง?",
		        "เดี๋ยวก่อน ฉันต้องแก้ไขปัญหานี้",
		        "ไม่น่ารอด!",
		        "ฉันเห็นคุณ! คุณเพิ่งเดินผ่านต้นเกาลัดต้นใหญ่ บนดาวเคราะห์ตลกดวงนั้นในกาแล็กซีข้างบนตรงนั้น",
		        "ไม่ ไม่ใช่ฉัน! กาแล็กซีไหน?",
		        "โอ้ บอกเวลาที่แน่นอนยากเลย มันคงยังไม่มีอะไรเกิดขึ้น แต่ต้องรออีก 15 พันล้านปี!",
		        "ตอนนี้คุณพูดมีเหตุผลมากเลย คุณกำลังจะมาด้วยรึเปล่า?",
		        "แน่นอน! ฉันจะไปถึงที่นั่นในอีกไม่กี่ชั่วโมง แค่ต้องจัดการเรื่องนี้ให้เสร็จ",
		        "ก็ได้ แล้วเจอกันนะ!",
		        "แต่ขอร้องล่ะ ชาร์ปส์",
		        "ครั้งนี้อย่ามาสายนะ",
		        "ฉันจะไม่สายแบบนั้นแน่ วีน ฉันจะไม่สายแน่นอน!"
		    ],
		    "credits": [
		        "จุดเริ่มต้น",
		        "ฉันขอบคุณมากจริง ๆ ที่คุณทำมันจนจบ ที่ที่ทุกอย่างเริ่มต้นขึ้น",
		        "ขอแสดงความยินดีด้วย มั้งนะ!",
		        "ดูนี่สิ:",
		        "ทรัพยากรที่ขุดได้ทั้งหมด:",
		        "ชาโรไนต์:",
		        "เอลเมอรีน:",
		        "ควอนิไทต์",
		        "เบต้าไพลีน:",
		        "อัญมณีนรก:",
		        "โครมาลิท:",
		        "โฟมแห่งสวรรค์:",
		        "ก้อนหินกลวง:",
		        "แปลน:",
		        "ความเป็นจริง:",
		        "เครื่องจักรที่สร้าง:",
		        "เครื่องจักรที่ถูกทำลาย:",
		        "ความลึกสูงสุดของช่องในหน่วยเมตร:",
		        "หินแปลกประหลาดที่โผล่ขึ้นมา:",
		        "จำนวนครั้งที่เทเลพอร์ต:",
		        "การคลิกลูกบาศก์:",
		        "การบิดเบี้ยวของเวลา:",
		        "เวลาเล่น:",
		        "ชม.",
		        "เกมที่สร้างโดย:<br>Oleg Danilov",
		        "กราฟิกเพิ่มเติม:<br>Yulia Nogteva",
		        "การแก้ไขบทสนทนา:<br>Abdurahman Zulumhanov และ Anna Peterson",
		        "การเผยแพร่บนสตรีม:<br>Playsaurus",
		        "การทดสอบการเล่น:<br>ชุมชนของ Leprosorium, Abdurahman Zulumhanov, Playsaurus",
		        "จบ",
		        "ตอนนี้คุณสามารถไปเล่นเกม Cookie Clicker หรือไปทำอะไรก็ได้",
		        "เพลง:<br>Shallow Anne โดย เจค ชุดนาว",
		        "Deutsch: flex 4711, Patrick Karban",
		        "Português: selfemcrowdin, Mateus Iamarino",
		        "Italiano: doralum",
		        "Español: armangar, Syunay Kamenov",
		        "Français: KjetilVion, Etienne Samson, William (Ekitchi)",
		        "Nederlands: lievevandyck",
		        "Čeština: Jakub Strelinger",
		        "Polski: PolglishPL",
		        "日本語: Winna Tolentino",
		        "한국어: Ah Lon Sin, Sumin Park, Cyberowl",
		        "简体中文：Daisy Chan, kevinlee7, YuLun",
		        "繁體中文: Daisy Chan, kevinlee7",
		        "ไทย: They say P, Phimze Pym",
		        "Magyar: Simon Dániel és Márton-Mezey Csenge",
		        "Latviešu valoda: Roberts Artūrs Bumburs (Arburo)",
		        "Română: Eric Apetrei"
		    ],
		    "explainer": [
		        "กดค้างไว้",
		        "คลิกที่เซลล์ด้านล่างเสมอ",
		        "<span class=\"keyboard\">Q</span>, <span class=\"keyboard\">Esc</span> หรือคลิกขวาเพื่อยกเลิก",
		        "กด <span class=\"keyboard\">Alt</span> ค้างไว้เพื่อดูใกล้ๆ",
		        "กด <span class=\"keyboard\">Q</span> บนเซลล์ที่ว่างเพื่อเลือกเครื่องมือรื้อถอน",
		        "กด <span class=\"keyboard\">Q</span> บนเครื่องจักรเพื่อลองสร้างเครื่องจักรเพิ่มอีกเครื่อง",
		        "กด WASD หรือคลิกขวาแล้วลากเพื่อดูรอบๆ"
		    ],
		    "random": {
		        "paste": "คัดลอกรหัสบันทึกไปยังคลิปบอร์ดแล้ว ตอนนี้ให้วางไว้ที่ไหนสักแห่งที่ปลอดภัย",
		        "toolate": "มันสายเกินไปที่จะบันทึกสิ่งต่างๆ ทุกอย่างได้เกิดขึ้นไปแล้ว",
		        "existed": "ใหม่",
		        "steamWarning": "ข้อผิดพลาดของสตรีม บันทึกอัตโนมัติและความสำเร็จอาจไม่ทำงาน ลองปิดและเปิดเกมใหม่ดู"
		    }
		},
		hu: {
		    "splash": {
		        "sixtyfour": "SIXTY&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FOUR",
		        "continue": "<span>FOLYTATÁS</span><div class=\"keyboard\">Esc</div>",
		        "start": "<span>START</span><div class=\"keyboard\">Esc</div>",
		        "soundoff": "HANG KI",
		        "soundon": "HANG BE",
		        "save": "MENTÉS",
		        "load": "BETÖLTÉS",
		        "language": "NYELV: MAGYAR",
		        "reset": "ÚJRAKEZDÉS",
		        "credit": "©2024 Oleg Danilov, kiadó: Playsaurus. Verzió",
		        "warning": "Mindent el fogsz veszíteni! Ez nem vicc! Ha biztosan ezt szeretnéd tartsd lenyomva a gombot.",
		        "glory": "TELJESÍTMÉNYEK",
		        "deglory": "VISSZA",
		        "quit": "KILÉPÉS",
		        "export": "Exportálás",
		        "import": "Importálás",
		        "flashbang": "Az élénk villogó fények a játék részét képezik. Ha érzékeny vagy rájuk, akkor fontold meg a villogások letiltását erre az ikonra kattintva."
		    },
		    "achievements": [
		        {
		            "name": "Bolondok aranya",
		            "description": "Szerezz egy kis Elmerint"
		        },
		        {
		            "name": "Deep Purple",
		            "description": "Szerezz Kvanetitot"
		        },
		        {
		            "name": "A föld vére",
		            "description": "Szerezz Béta-Pilént"
		        },
		        {
		            "name": "Zöld energia",
		            "description": "Találj egy Pokolkristályt"
		        },
		        {
		            "name": "Radioaktív üveg",
		            "description": "Találj egy Kromalitot"
		        },
		        {
		            "name": "Szent beton",
		            "description": "Szerezz egy kis Csillagközi Habot"
		        },
		        {
		            "name": "Tudsz vele mosogatni?",
		            "description": "Szerezz egy Üreges Követ"
		        },
		        {
		            "name": "Nesze semmi fogd meg jól",
		            "description": "Szerezz egy kis Ürességet"
		        },
		        {
		            "name": "Who you gonna call?",
		            "description": "Szerezz egy kis Valóságot"
		        },
		        {
		            "name": "Nietzsche",
		            "description": "Bámulj a végtelenbe és tovább 64 alkalommal"
		        },
		        {
		            "name": "64K",
		            "description": "Szerezz 64 000 követ"
		        },
		        {
		            "name": "64M",
		            "description": "Szerezz 64 000 000 követ"
		        },
		        {
		            "name": "64 Mrd",
		            "description": "Szerezz 64 000 000 000 követ"
		        },
		        {
		            "name": "Csapó kettő",
		            "description": "Akadj el a kezdetnél"
		        },
		        {
		            "name": "Örökizgő-mozgó",
		            "description": "Helyezz két silót egymás mellé"
		        },
		        {
		            "name": "Kell egy kis áramszünet...",
		            "description": "Játssz 64 órán át"
		        },
		        {
		            "name": "Muszáj... Pusztítani",
		            "description": "Kattints egy kockára 6400 alkalommal"
		        },
		        {
		            "name": "Az alkotó",
		            "description": "Építs 64 gépet"
		        },
		        {
		            "name": "Pusztító",
		            "description": "Pusztíts el 64 gépet"
		        },
		        {
		            "name": "A Poklok Pokla",
		            "description": "Rendelkezz 9 Pokolszéffel"
		        },
		        {
		            "name": "A kezdet és a vég",
		            "description": "Robbantsd fel az Inverz Végtelen Mélységet"
		        },
		        {
		            "name": "Cookie clicker",
		            "description": "Kattints a sütire"
		        },
		        {
		            "name": "Részeg tengerész",
		            "description": "Dudálj indokolatlanul 64 alkalommal"
		        },
		        {
		            "name": "Mr. Mine",
		            "description": "Rendelkezz 9 Bányász csatornával"
		        },
		        {
		            "name": "Hol a határ?",
		            "description": "Áss le 64 km mélyre"
		        },
		        {
		            "name": "Seth Brundle",
		            "description": "Teleportálj <s>1</s> 64 alkalommal"
		        },
		        {
		            "name": "Vörös-Kék Szikla",
		            "description": "Fejezd be a játékot úgy, hogy 15 percig semmit sem törölsz, és kevesebb, mint 15 Konténment Silóval rendelkezel"
		        },
		        {
		            "name": "Egyenesen a pokolba!",
		            "description": "Szerezz egy Pokolkristályt a játék első 64 percében"
		        },
		        {
		            "name": "Csak a felszínt kapargatod",
		            "description": "Áss le 64 méter mélyre"
		        },
		        {
		            "name": "Meleg van?",
		            "description": "Áss le 640 méter mélyre"
		        },
		        {
		            "name": "Túl mély",
		            "description": "Áss le 6400 méter mélyre"
		        },
		        {
		            "name": "64 km/óra lefelé",
		            "description": "Érj el a 6400 méteres mélységet 6 percen belül miután lehelyeztél egy friss Bányász csatornát"
		        },
		        {
		            "name": "Neofóbia",
		            "description": "Játszd végig a játékot úgy, hogy nem fejlesztesz fel egyetlen kitermelő csatornát sem"
		        }
		    ],
		    "resources": [
		        "Karonit",
		        "Elmerin",
		        "Kvanetit",
		        "Béta-Pilén",
		        "Pokolkristály",
		        "Kromalit",
		        "Csillagközi hab",
		        "Üreges kő",
		        "Üresség",
		        "Valóság"
		    ],
		    "entities": {
		        "pinhole": {
		            "name": "?",
		            "description": "U/D, C/S, T/B, E/νE, μ/νμ, τ/ντ, G/γ, Z/W, H, Δ/νΔ"
		        },
		        "gradient": {
		            "name": "Gradiens kút",
		            "description": "Egy örök életű bányászható kocka. Reagál a legtöbb destabilizátorra és rezonátorra. Vezetéken keresztül kell csatlakoztatni a Végtelen Mélységhez."
		        },
		        "chasm": {
		            "name": "A Végtelen Mélység",
		            "description": "Híd az ismeretlenbe."
		        },
		        "conductor": {
		            "name": "Vezeték",
		            "description": "Összeköti a Végtelen Mélységet az ipari silókkal."
		        },
		        "pump": {
		            "name": "Kitermelő csatorna",
		            "description": "Kitermeli a nyersanyagokat és maga köré helyezi őket."
		        },
		        "pump2": {
		            "name": "Bányász csatorna",
		            "description": "Kitermelő csatorna fejlesztés. Gyorsan bányászik rengeteg nyersanyagot és szélesebb körben helyezi le azokat maga körül."
		        },
		        "vault": {
		            "name": "Pokolszéf",
		            "description": "Megóv 1024 Pokolkristályt a környezettől."
		        },
		        "cube": {
		            "name": "Nyersanyag kocka",
		            "description": "Kitermelt nyersanyagok."
		        },
		        "destabilizer": {
		            "name": "Destabilizátor",
		            "description": "Helyezd egy kocka mellé, hogy kétszer gyorsabban törjön össze. Működéséhez Elmerin szükséges. További destabilizátorok növelik a hatást."
		        },
		        "destabilizer2": {
		            "name": "Ipari destabilizátor",
		            "description": "Destabilizátor fejlesztés. Négyszeresére növeli a nyersanyag-széttörés folyamat erejét. Működéséhez 64 Elmerin szükséges. További destabilizátorok növelik a hatást."
		        },
		        "destabilizer2a": {
		            "name": "Pokolkristály destabilizátor",
		            "description": "Ipari destabilizátor fejlesztés. 625-ször nagyobb erőt fejt ki, ha a kitermelt kockában van legalább egy Pokolkristály. Ha a kockában nincs Pokolkristály, nem nyújt semmiféle előnyt. Működéséhez 1 Pokolkristály szükséges. További destabilizátorok növelik a hatásfokot."
		        },
		        "doublechannel": {
		            "name": "Hűtő ventilátor",
		            "description": "Helyezd ezt a kocka kitermelő gép mellé, hogy kétszer gyorsabban termelje a kockákat. A további hűtők növelik a hatást."
		        },
		        "doublechannel2": {
		            "name": "Aktív csatornahűtő",
		            "description": "Hűtő ventilátor fejlesztés. Megháromszorozza a kitermelő gép sebességét, ha mellé van helyezve. A további hűtők növelik a hatást."
		        },
		        "valve": {
		            "name": "Visszacsapó szelep",
		            "description": "Megakadályozza, hogy a kocka kitermelő gép visszaálljon az eredeti helyzetébe, ha mellé van helyezve. Működéséhez Kromalit szükséges."
		        },
		        "auxpump": {
		            "name": "Segédszivattyú",
		            "description": "Visszacsapó szelep fejlesztés. Kitermelő gép mellé helyezve biztosítja a szükséges nyomást. Működéséhez 8 Elmerin szükséges. Több szivattyú használata nem jár nyomás növekedéssel."
		        },
		        "auxpump2": {
		            "name": "Szivattyú állomás",
		            "description": "Segédszivattyú fejlesztés. Négyszeres nyomást biztosít egy kitermelő gép számára, ha mellé van helyezve. Működéséhez 256 Elmerin és 4 Béta-Pilén szükséges. Több állomás nem növeli a kitermelő gép sebességét."
		        },
		        "entropic": {
		            "name": "Entrópia rezonátor",
		            "description": "Periodikusan összezúzza a nyersanyagokat, ha egy kocka mellé van helyezve. Működéséhez Kvanetit szükséges."
		        },
		        "entropic2": {
		            "name": "Entrópia rezonátor II",
		            "description": "Entrópia rezonátor fejlesztés. Háromszor gyorsabban zúzza össze a nyersanyagokat. Működéséhez Kromalit szükséges."
		        },
		        "entropic2a": {
		            "name": "Entropia kondenzátor",
		            "description": "Entrópia rezonátor fejlesztés. A nyersanyagokat a felszínre kerülésük pillanatában 600%-os erővel zúzza össze. De kockánként csak egyszer. Működéséhez 8 Kromalit szükséges."
		        },
		        "entropic3": {
		            "name": "Üresség rezonátor",
		            "description": "Entrópia rezonátor II fejlesztés. Amikor a pokolkristályok megsemmisülnek, a rezonátor óriási erővel összezúzza a körülötte lévő kockákat."
		        },
		        "converter32": {
		            "name": "Karonit dúsító tartály",
		            "description": "Kvanetite és Karonit kémiai reakcióját segíti elő, amelynek során Elmerin képződik."
		        },
		        "converter13": {
		            "name": "Karonit ülepítő",
		            "description": "Katalizátorok segítségével Kvanetitet nyer vissza a cseppfolyósított Karonit üledékből."
		        },
		        "converter41": {
		            "name": "Béta-Pilén oxidáló",
		            "description": "Béta-Pilén égetésével Karonitot és kis mennyiségben más elemeket generál."
		        },
		        "converter76": {
		            "name": "Csillagközi besugárzó",
		            "description": "Kromalittal sugározza be a Csillagközi Habot, ezzel a Habot Kromalitté alakítja, aminek a bomlása során Pokolkristály, Béta-Pilén, Kvanetit és Elmerin keletkezik. Ezért nagyszerű forrása ezeknek az anyagoknak."
		        },
		        "converter64": {
		            "name": "Csillagközi reaktor",
		            "description": "Elősegíti a Kromalit és a Csillagközi Hab kontrollált fúzióját aminek következtében Béta-Pilén keletkezik. Nem működik más csillagközi reaktor közelében."
		        },
		        "reflector": {
		            "name": "Csillagközi tükör",
		            "description": "Megnöveli a szomszédos Csillagközi reaktor teljesítményét."
		        },
		        "mega1": {
		            "name": "Anyagsugárzó torony",
		            "description": "Csökkenti a vizuális zajt azáltal, hogy összetömörítő a mozgó nyersanyagokat. Csak egy lehet belőle."
		        },
		        "mega1a": {
		            "name": "Anyagsugárzó torony MKII",
		            "description": "Anyagsugárzó torony fejlesztés. Megnöveli a nyersanyagok átvitelének sebességét. Csak egy lehet belőle."
		        },
		        "mega1b": {
		            "name": "Anyagsugárzó torony MKIII",
		            "description": "Anyagsugárzó torony MKII fejlesztés. Még jobban összetömöríti a mozgó nyersanyagokat. Csak egy lehet belőle."
		        },
		        "mega2": {
		            "name": "Újrahasznosító torony",
		            "description": "Lehetővé teszi a gépek újrahasznosítását, amely visszaadja a nyersanyagok 90%-át. Csak egy lehet belőle."
		        },
		        "mega3": {
		            "name": "Szétszerelő torony",
		            "description": "Újrahasznosító torony fejlesztés. Lehetővé teszi a gépek szétszerelését. A gépek elbontásakor a befektetett nyersanyagköltség visszatérítésre kerül. Csak egy lehet belőle."
		        },
		        "voidsculpture": {
		            "name": "Az Üresség oltára",
		            "description": "Lehetővé teszi, hogy figyelmen kívül hagyd az üresség gépek vizuális hátrányait."
		        },
		        "eye": {
		            "name": "Töltőiránytű",
		            "description": "Figyelmeztet ha egy gép kifogyott. Csak egy lehet belőle."
		        },
		        "cookie": {
		            "name": "Egy süti",
		            "description": "Hogyan került oda?"
		        },
		        "injector": {
		            "name": "Pokolkristály befecskendező",
		            "description": "Ha a szomszédos kockában nincsen Pokolkristály, akkor Pokolkristályra cserél egy véletlenszerű nyersanyagot. 32 töltettel rendelkezik. 32 Pokolkristály és 64 Kvenetit szükséges a működéséhez."
		        },
		        "silo": {
		            "name": "Földalatti siló",
		            "description": "Aktiváláskor újratölti a közeli gépeket, majd automatikusan újratölti azokat további 16 alkalommal"
		        },
		        "silo2": {
		            "name": "Ipari siló",
		            "description": "Földalatti siló fejlesztés. Aktiváláskor újratölti a közeli gépeket, majd automatikusan újratölti azokat további 64 alkalommal"
		        },
		        "vessel": {
		            "name": "Konténment búra",
		            "description": "32 Kromalit tárolására szolgál, megakadályozva azok hasadását. Egy Pokolkristályt használ."
		        },
		        "vessel2": {
		            "name": "Konténment siló",
		            "description": "Konténment búra fejlesztés. 32768 Kromalit tárolására szolgál, megakadályozva azok bomlását. Egy Valóságot használ."
		        },
		        "consumer": {
		            "name": "Katalitikus finomító",
		            "description": "Begyűjti a szomszédosan összetört nyersanyagokat. Miután 1024 nyersanyagot halmozott fel, kibocsájtja azokat egy további bónusszal. A bónusz összege minden egymást követő kibocsájtással növekszik, akár 100%-ig. Ha 16 másodpercig nem történik nyersanyag begyűjtés, az effektus visszaállítódik."
		        },
		        "preheater": {
		            "name": "Katalatikus előmelegítő",
		            "description": "Nyersanyag konvertáló gép mellé helyezve növeli annak sebességét. Minden további előmelegítő növeli a sebességbónuszt maximum 300%-ig."
		        },
		        "hollow": {
		            "name": "Üreges palánta",
		            "description": "Jó sok lyuk."
		        },
		        "strange": {
		            "name": "Üreges szikla",
		            "description": "Úgy néz ki, mint ami már egy ideje ott van."
		        },
		        "strange1": {
		            "name": "Üreges szikla kutatóállomás",
		            "description": "A Csillagközi Hab mostantól 512 Pokolkristállyal együtt semmisül meg 64 helyett. ÉSZAK."
		        },
		        "strange2": {
		            "name": "Üreges szikla létesítmény",
		            "description": "Megduplázza az Üreges Kövek maximális mennyiségét és növeli a keletkezésük sebességét."
		        },
		        "strange3": {
		            "name": "Rekonstruált Üreg",
		            "description": "Drasztikusan megnöveli az Üreges Kő keletkezésének sebességét mindezt pedig teljesen csendben teszi."
		        },
		        "generaldecay": {
		            "name": "Általános bomlásreaktor",
		            "description": "Nagy mértékben növeli a Kromalit bomlása során keletkező nyersanyagok mennyiségét. Csak egy lehet belőle."
		        },
		        "waypoint": {
		            "name": "Teleport-pont",
		            "description": "Elmozgatja az univerzumot körülötted, olyan érzést keltve mintha teleportálnál a Teleport-pontok között."
		        },
		        "annihilator": {
		            "name": "Megsemmisítő",
		            "description": "Ürességet állít elő, amikor Pokolkristályok semmisülnek meg együtt a Csillagközi Habbal. Működéséhez Üreges Kő szükséges."
		        },
		        "flower": {
		            "name": "Üreges virág",
		            "description": "Csökkenti az időtorzulás esélyét. Semlegesíti egy Üreges Kő hatását. Egy Üreges Kőre kell építeni. Megsemmisíti azt az Üreges Követ, amelyre épült."
		        },
		        "fruit": {
		            "name": "Üreges gyümölcs",
		            "description": "Üreges virág evolúciója. Megakadályozza az Üreges Kő természetes képződését, ezzel biztosítva a tápanyagot a saját fejlődéséhez. Teljesen érett formájában üreges köveket termel."
		        },
		        "eraser": {
		            "name": "Lerombolás",
		            "description": "Egy gép megsemmisítése, a felhasznált nyersanyagok 50%-át visszakapod."
		        },
		        "eraser2": {
		            "name": "Újrahasznosítás",
		            "description": "Egy gép újrahasznosítása, visszatérítve az építéséhez felhasznált nyersanyagok 90%-át."
		        },
		        "eraser3": {
		            "name": "Szétszerelés",
		            "description": "Egy gép szétszerelése, visszatérítve az építéséhez felhasznált összes nyersanyagot."
		        },
		        "clicker1": {
		            "name": "Kvanetit oszcillátor",
		            "description": "Lehetővé teszi, hogy rákattints és nyomva tartsd a nyersanyagokat azok összetöréséhez. Csak egy lehet belőle."
		        },
		        "clicker2": {
		            "name": "Pokolkristály oszcillátor",
		            "description": "Kvanetit oszcillátor fejlesztés. Növeli az oszcillációs frekvenciát. Csak egy lehet belőle."
		        },
		        "clicker3": {
		            "name": "Kromalit oszcillátor",
		            "description": "Pokolkristály oszcillátor fejlesztése. Maximalizálja az oszcillációs frekvenciát. Csak egy lehet belőle."
		        },
		        "stabilizer": {
		            "name": "Stabilizátor",
		            "description": "Stabilizál egy környező kisülést, hogy ideiglenesen kihasználja annak erejét."
		        },
		        "stabilizer2": {
		            "name": "Stabilizátor II",
		            "description": "Stabilizátor fejlesztés. Növeli a stabilitást és a teljesítményt."
		        },
		        "stabilizer3": {
		            "name": "Széthasadt stabilizátor",
		            "description": "Rendhagyó fejlesztés. Növeli a teljesítményt és maximalizálja a stabilitást. Csak egy lehet belőle."
		        }
		    },
		    "messages": [
		        "Merre vagy?",
		        "Konkrétan a semmi közepén vagyok",
		        "Ok, mit látsz?",
		        "Hát, nem sokat. Van itt ez a gép, valahogy ismerősnek tűnik, de lehet nem kéne taperolni",
		        "Milyen gép?",
		        "Várj, lehet meg tudom...",
		        "Ugye NEM taperolsz valami random gépet!",
		        "Működik! Csinált valamit...",
		        "???",
		        "Egy hatalmas fekete kocka. Olyan szívesen összetörném...",
		        "Te be vagy állva?",
		        "Van 64 kövem!",
		        "Hát jó. Akkor jó szórakozást hozzá.",
		        "Hé, találtam egy sárga követ is!",
		        "Egészségedre!",
		        "Szerintem most már tudom hogyan építsek gépeket. Valami olyat kellene összeraknom amivel könnyebben széttörhetem ezeket a kockákat. Ha egy kocka megjelenik mellette, akár átlósan is, akkor működnie kellene.",
		        "Te most szórakozol velem? Kezdesz kiakasztani...",
		        "Most már csak egy sárga követ kell tennem ebbe a gépbe.",
		        "Ahogy érzed... Viccet félretéve, átjössz ma?",
		        "Hogyne! Ott leszek pár óra múlva, csak ezt még befejezem.",
		        "Mit is csinálsz pontosan?",
		        "Majd később írok. A gyár nem építi meg magát, bocsi.",
		        "Úgy érzem, hogy az egymás melletti gépek jó hatással vannnak egymásra. Például amikor leraktam ezt a ventillátort, mintha felgyorsult volna a bányagép.",
		        "Semmit nem értek abból, amit mondasz...",
		        "Na?",
		        "Merre vagy?",
		        "Órák óta rád várunk...",
		        "Hogy érted? Még mindig itt vagyok.",
		        "HOL AZ AZ ITT???",
		        "Találtam egy kék követ. Vagy lila? Nem is tudom, de ilyen fémes hangja van, az biztos. Talán használhatnám a rosszul lerakott gépek lebontására.",
		        "Ne kúrj már fel, azt mondtad jössz.",
		        "Nyugi, egy perc és ott vagyok",
		        "Wow! A [Q]-val klónozhatok gépeket vagy lebonthatom azokat, ha előbb egy üres helyre kattintok vele! Az [Alt] pedig segít belátni a magas gépek mögé.",
		        "Hajrá!",
		        "Ott vagytok még?",
		        "AZT A KURVA!!!",
		        "Hol vagy????",
		        "Minden oké??",
		        "????",
		        "Miért ne lenne?",
		        "JÓL VAGY? MERRE VAGY?",
		        "Nyugi van! Jól vagyok, történt valami?",
		        "Mondd meg te! Már két hete ghostolsz! Voltam nálad párszor, de sosem voltál otthon. Merre vagy? Otthon vagy most?",
		        "Haver, miről beszélsz? Literálisan két perce írtunk egymásnak.",
		        "MI BAJOD VAN???? Először felszívódsz, aztán ignorálsz. Most meg úgy teszel, mintha mi sem történt volna!",
		        "Egy egyszerű kérdést teszek fel",
		        "HOL VAGY?",
		        "Itt.",
		        "H O L",
		        "Várj egy kicsit...",
		        "Ez egyáltalán nem vicces. Csak annyit mondj meg kérlek, hogy hol vagy.",
		        "Hát...",
		        "Hát, igazából nem is tudom.",
		        "Adj egy percet",
		        "Hogy-hogy nem tudod?",
		        "Össze kell szednem a gondolataimat",
		        "Minden rendben? Nem vagy veszélyben? Szóljak valakinek?",
		        "Igen, megvagyok. Csak izé...",
		        "Majd később írok",
		        "Az istenit, ember. Hát mi történik?",
		        "Félek",
		        "Az a helyzet, hogy fingom sincs, hol vagyok",
		        "Valami nem oké... Mármint, velem minden oké. Csak... Ez a hely... Nem is tudom...",
		        "Az egész olyan, mint egy álom, de közben mégsem. Minden hófehér, és itt vannak ezek a gépek. És kockák. Ennek semmi értelme.",
		        "Nem vagyok beállva vagy ilyesmi. Egészen eddig nem tűnt fel, hogy mennyire fura és idegen itt minden.",
		        "Most vörös köveket kaptam, és kicsit para, hogy ez az egész nekem teljesen rendben van. Oké, csak egy piros kő, mégis mi baj lenne.",
		        "Szóval nem hülyéskedsz...",
		        "Tudom, hogy furán hangzik ez az egész. Én sem hinném el, ha nem a saját két szememmel látnám.",
		        "Tehetek érted bármit?",
		        "Csak beszélgess velem, ennyi.",
		        "Persze, számíthatsz rám. Ja amúgy a zsaruk már keresnek téged. Rohadtul eltűntél.",
		        "Megmutattad nekik az üzeneteinket?",
		        "Hogy segítene az bármin? Be van kapcsolva az auto-törlés.",
		        "Zsír!",
		        "Hogy mennek ott a dolgok?",
		        "Hát, kiderült, hogy tudok mozogni a WASD használatával. De konkrétan semmi érdekes nincs a környéken. Habár láttam egy furcsa sziklát fent, északon.",
		        "Ezek szerint működik a telefonod iránytűje?",
		        "Hát... igazából... Tudod... \"Előttem van észak...\"",
		        "Vágom, vágom",
		        "Ja! És az a helyzet, hogy nincs is nálam a telefonom...",
		        "Akkor miről írsz?",
		        "Nem tudom!!! Csak érzem, amikor üzenetet kapok. És valahogy tudok válaszolni is! Nem könnyű ezt megmagyarázni.",
		        "Mindegy is. A lényeg, hogy tudunk beszélni.",
		        "Igen, igazad van.",
		        "Szóval... Mesélj nekem a gépekről",
		        "Mire gondolsz?",
		        "Mik ezek, mit csinálnak, hogyan működnek?",
		        "Hát, nagyon menőn néznek ki, vannak rajtuk mindenféle kábelek, meg ilyenek",
		        "Az egyik például úgy néz ki, mint egy nagy műanyag doboz, tetején réztekerccsel amibe pont belefér egy ilyen kék kő. Van raja kettő felirat: egy \"E-01SR\" és egy \"Vigyázat! Erős entrópiasugárzás\"",
		        "És ez mit jelent?",
		        "Én sem igazán tudom. Biztos sugároz a gép, vagy valami ilyesmi.",
		        "Várj, én azt hittem, te csináltad ezeket a gépeket?",
		        "Igen... Értem, mire célzol.",
		        "A kockákból csinálom őket valahogy. De azt nem tudom, hogy mi van bennük. Én sem értem igazán, de hadd gondolkozzak rajta kicsit.",
		        "És nagyon úgy tűnik, hogy mélyebben már nincs annyi sárga és a kék kocka, muszáj lesz befektetnem ezekbe az átalakítókba vagy egy új bányába.",
		        "Jó ötletnek hangzik",
		        "Mekkora szopás!",
		        "He?",
		        "Egy zöld kő, amit rohadt sokáig tart széttörni. Ki kell találnom valamit, mi lesz ha többet is találok?",
		        "Hát, majd csinálsz ehhez is egy menő gépet!",
		        "Mérget vehetsz rá!",
		        "Hát ez pokoli! Pokolkristály.",
		        "Tedd pokollá az életüket!",
		        "Emlékszel, amikor a gépekről kérdeztél?",
		        "Ja",
		        "Szerintem, nem evilágiak, nem lehetnek valódiak",
		        "Mire célzol ezzel?",
		        "Olyan ez, mint egy álom. Nem látok beléjük, sőt még a másik oldalról sem tudom megnézni őket.",
		        "Egyszerű ábrázolása egy felfoghatatlan technológiának",
		        "Szerintem csak azért néznek ki úgy ahogy, mert így képzelem el őket az alapján amit csinálnak.",
		        "Például ha valami fákat vág ki, akkor úgy kell kinéznie, mint egy baltának?",
		        "Valami olyasmi",
		        "Legalább te valódinak tűnsz nekem",
		        "Igen, és azt hiszem, jelenleg te vagy az egyetlen valódi dolog körülöttem",
		        "Rengeteg új kockám van, amik más kockákra bomlanak!",
		        "Nem jó, de nem is tragikus",
		        "Valami nagyon furcsát kell mondanom neked",
		        "Ugye te is érzed az iróniát abban, amit az előbb írtál?",
		        "Lehet emiatt a furcsa hely miatt van, de elfelejtettem a neved",
		        "Hát, akkor lehet kicsit több időt kéne együtt töltenünk",
		        "Komolyan mondom",
		        "A nevem Duke Nukem, nyilván.",
		        "Hagyd már abba!",
		        "Anyád is ezt mondta!",
		        "Te nem vagy normális! Fejezd már be. Mi van veled? Elment az eszed?",
		        "Basszus",
		        "Úgy tűnik, én sem emlékszem a saját nevemre",
		        "Ezt nem bírom! Elment az eszem vagy mi? A te nevedre sem emlékszem!",
		        "Lehet ez csak tömeghisztéria? Nyugodjunk meg és várjuk ki a végét.",
		        "Aha, persze, hisztéria",
		        "Még mindig nem tudok felidézni neveket",
		        "Én sem. És ez még nem minden",
		        "Igen! Például, hogyan nézek ki? Mikor találkoztunk?",
		        "Hogy néz ki a házam, kik a barátaink? Találkoztunk már egyáltalán?",
		        "Úgy tűnik, hogy egy cipőben járunk. Ez mikor kezdődött? Ez valami furcsa álom? És, ha igen, ki álmodik?",
		        "Van bármi gép a közeledben? Nem pattant ki valahol egy kocka a földből?",
		        "Nagyon vicces",
		        "Találjunk ki valami nevet magunknak.",
		        "Szerintem te Veen lennél",
		        "Miért is ne",
		        "Nincs kifogásom a Veen ellen",
		        "Szia Veen. Kell egy pohár víz, Veen? Igen, jól hangzik.",
		        "Te meg Charps leszel",
		        "Mit csapsz Charps, talán csalfa csapot csapsz Charps?",
		        "Ennek semmi értelme!",
		        "Tetszik a Charps. Örvendek, Veen",
		        "Úgyszint, Charps",
		        "MI AZ ISTEN TÖRTÉNIK",
		        "Mi van?",
		        "Fehér kockák! Amik elpusztítják a zöldeket!",
		        "És egy csomó bomló kocka is van! Olyan mintha egy nukleáris reaktorban lennék!",
		        "Szent ég, jól vagy?",
		        "Ja, jól vagyok! Csak rohadt nagy a káoszt most. Kéne valamit építenem ami segít ezen. Lehet megint rá kéne néznem arra a sziklára északon.",
		        "Nem is te lennél Charps, ha nem találnál ki valamit rá!",
		        "Olyan furán hangzik!",
		        "Mármint a nevem. De gondolom, majd megszokom. Ugye, Veen?",
		        "Ja! Valóban furcsa.",
		        "Emlékszel, amikor azt a furcsa sziklát említettem ami északon van?",
		        "Nem, nem igazán",
		        "Szóval, van ez a szikla. Félre ne értsd, tudom hogy itt minden furcsa, de ez különösen az.",
		        "Nem igazán tudom hova tenni. De most, hogy picit megpiszkáltam, változtatott valamit az Univerzum törvényein!",
		        "Ez veszélyes?",
		        "Nem tudom. Egyelőre nincs nagy különbség.",
		        "Kíváncsi vagyok mi mindenre képes még.",
		        "Jól van, de próbáld meg NEM elpusztítani az Univerzumot.",
		        "Megteszem ami tőlem telik.",
		        "Na, ez volt életem legkeményebb kockája! De most már tudom, hogy mi a gyengepontjuk.",
		        "Szereztél egy új követ?",
		        "Ja, ez a legfurább eddig",
		        "Hú, lehet mégis csak nagyobb a különbség mint gondoltam. Ugye te is érzed?",
		        "Mit?",
		        "Lehet csak beképzelem magamnak.",
		        "Talán, úgy tök véletlen, esetleg nem jelent meg egy hatalmas kocka a szemeid előtt így nagyjából, most?",
		        "A hűtő annak számít?",
		        "Hagyjuk inkább",
		        "Wow, ez az új kocka koromfekete. És olyan másvilági beütése van.",
		        "Jobban mint az előzőnek?",
		        "Ez tényleg más! Jéghideg, de nem ilyen ártó módon. Mármint hiányzik belőle a hőmérséklet fogalma és olyan megfoghatatlan az egész. Nem anyagból van, se színe, se szaga, nemtudom mennyire érted amit mondani akarok.",
		        "Őszintén, egyáltalán nem.",
		        "Szerintem értem. Használhatom ezeket üreges köveket arra, hogy ezt a fekete cuccot állítsam elő a semmiből. Ijesztően azonos kristályokat képez, amiknek semmiféle tulajdonsága nincs. De közben valahogy mégis helyrehozza az Univerzum anomáliáit.",
		        "Olyan mint egy légszűrő",
		        "Igen, pontosan! Úgy látszik csak rontom itt a levegőt.",
		        "Ezt eddig is tudtuk",
		        "Úgy döntöttem, kiásom ezt a furcsa sziklát. Lehet a sziklában van a válasz arra, hogy mi folyik itt. Úgy érzem nem csak befolyásolja a világot, hanem ez irányít mindent!",
		        "Miért gondolod ezt így?",
		        "Ha azt mondom hogy érzem, elhiszed?",
		        "Simán! Neked bármit elhiszek. Egy Univerzumot irányító kocka? Miért is ne! Tök hihető!",
		        "Agyérgörcsöt kapok!",
		        "Légyszi ne",
		        "Ezek a gépek kezdenek iszonyat hangosak lenni és össze-vissza villognak. Lehet kéne rajtuk bütykölnöm valamit, hátha megoldja. Vagy magamon. Vagy mind a kettőn.",
		        "Ez a beszéd!",
		        "Na, hogy sikerült?",
		        "Várj, valami nem okés.",
		        "Építettem valamit a fekete cuccból. Ez nem egy gép. De csinált valamit a Teleport-pontokkal.",
		        "Mik azok a teleport-pontok?",
		        "Elmozgatja az univerzumot körülötted, lehetővé téve az eljutást különböző távoli helyekre.",
		        "Honnan tudod, hogy az Univerzumot tolja el és nem téged?",
		        "Hmm, erre még nem is gondoltam",
		        "Szerintem elcsesztem az Univerzumot",
		        "Semminek nincs értelme!",
		        "A gépeknek se, semminek sincs.",
		        "Remélem meg tudom oldani valahogy",
		        "Veen?",
		        "Tesó, élsz még?",
		        "Ne ne, csak azt ne! Remélem csak hugyozni mentél vagy valami.",
		        "VEEN!",
		        "MI VAN?",
		        "Még mindig egy kicsit fura.",
		        "Hála az égnek!",
		        "Építettél valami újat?",
		        "Már megijedtem, hogy szétcsesztem az Univerzumot, és örökre eltűntél! Valami túlvilági helyen voltam mindenféle jelekkel, olyan volt mintha az univerzum darabkái lennének. De aztán kiderült, hogy csak egy másik univerzum. Esetleg még ennek lehet egy másik verziója, mert eléggé hasonlítanak egymásra, és mintha kapcsolódnának is egymáshoz.",
		        "Felfedezel, mi? Faszán hangzik!",
		        "Faszán? Tudsz te olvasni egyáltalán? EGY MÁSIK UNIVERZUM!!!",
		        "El kell fogadnod, hogy már lassan semmivel nem tudsz meglepni.",
		        "Jó van má",
		        "Nem egy szikla, hanem egy lencse",
		        "A hatására minden egy pontba konvergál. És a minden alatt tényleg mindent értek! Tér, idő, minden fogalom és szabály. Minden!",
		        "Találtál leírást vagy bármi hasonlót?",
		        "Fogalmam sincs miért van itt, és mi miért vagyunk itt. Csak valahogy tudom, hogy mire jó.",
		        "Aha... most akkor mindent konvergálni fogsz vagy mi?",
		        "Nem tudom hogyan. De talán ez a lényege ennek a helynek. Most csak így lebeg a levegőben, mintha erre lett volna tervezve.",
		        "Merre tovább?",
		        "Gőzöm sincs",
		        "Minél többet gondolkozok rajta, annál biztosabb vagyok benne, hogy nem csak a gépeid nem valódiak.",
		        "Próbálok feltenni magamnak specifikus kérdéseket, de válaszaim nincsenek rájuk.",
		        "Emlékszel, amikor említettem a zsarukat? Hogy keresnek téged? Nem vicceltem. De minden szétesni látszik, amikor jobban belegondolok.",
		        "Elmentem az őrsre, vagy csak felhívtam őket? És kik voltak ott? Zsaruk? Hol van egyáltalán az őrs? Mi ez a város? Itt élek? Mi a neve? És melyik vármegye? Vannak egyáltalán vármegyék?",
		        "Egyetlen kérdésre sem tudom a választ. Minden normálisnak tűnt amíg nem kérdőjeleztem meg a dolgokat. Félek többet feltenni.",
		        "Ne haragudj",
		        "Nem, nem a te hibád. Úgy tűnik, egy csónakban evezünk.",
		        "Csak remélem kideríted, mi is ez a csónak.",
		        "Igen, én is!",
		        "Meglátjuk, hova lyukadunk ki. Csak az remélem, ez nem valami örök kárhozat vagy limbó.",
		        "Mutasd meg nekik, Dante!",
		        "Ez a beszéd. Ezek a gépek teljesen kiszipolyozzák az Univerzumot!",
		        "Úgy beszélsz, mint valami olajmágnás",
		        "Elegem van már az állandó fejlesztgetésből és a zajból. Ez a gép mindent megváltoztat. Még a túloldalra is átnyúl.",
		        "Az nem veszélyes?",
		        "A veszély fogalma itt elég homályos.",
		        "Itt az ideje valami nagyot alkotni.",
		        "Mi jár a fejedben?",
		        "Még nem tudom. De nagy lesz!",
		        "Mármint egy hatalmas gép?",
		        "Nem, átvitt értelemben beszélek",
		        "Nyomod!",
		        "Ó baszdmeg",
		        "Valamit tényleg elkúrtam. Az inverz végtelen mélység felrobbant. Minden összeomlik.",
		        "Jól vagy?",
		        "Igen, de a gépek sorra robbannak fel! Nem tudok építeni semmit! Faszom!",
		        "Várj! Lehet hogy ennek így kéne történnie?",
		        "NEM! Kurvára nem!",
		        "Honnan tudod?",
		        "Adj egy percet, ezt meg kell oldanom valahogy",
		        "Lesz ami lesz!",
		        "Téged! Éppen elsétáltál egy hatalmas gesztenyefa mellett, azon a vicces bolygón ott, a galaxis egyik felső ágában.",
		        "Én biztos nem! Melyik galaxis?",
		        "Áh, nehéz megmondani a pontos időt, valszeg még meg sem történt. Csak várj még 15 milliárd évet!",
		        "Sok értelme van annak, amit mondasz. Amúgy átjössz?",
		        "Biztosan! Pár óra múlva ott leszek, csak még be kell fejeznem pár dolgot.",
		        "Oké, akkor majd találkozunk!",
		        "De légyszi, Charps",
		        "Most ne késs el",
		        "Nyugi Veen, nem fogok!"
		    ],
		    "credits": [
		        "A kezdet",
		        "Nagyon hálás vagyok, hogy eljutottál a legvégére, ahol minden kezdődik",
		        "Gratulálok, vagy valami ilyesmi!",
		        "Csak nézd meg ezt:",
		        "Összes kibányászott nyersanyag:",
		        "Karonit:",
		        "Elmerin:",
		        "Kvanetit:",
		        "Béta-Pilén:",
		        "Pokolkristály:",
		        "Kromalit:",
		        "Csillagközi hab:",
		        "Üreges kő:",
		        "Üresség:",
		        "Valóság:",
		        "Megépített gépek:",
		        "Megsemmisített gépek:",
		        "Maximum csatornamélység méterben:",
		        "Furcsa szikla megbökve:",
		        "Teleportálások:",
		        "Kockára kattintások:",
		        "Időtorzulások:",
		        "Játékidő:",
		        "ó",
		        "Játékot készítette:<br>Oleg Danilov",
		        "További grafikák:<br>Yulia Nogteva",
		        "Párbeszéd szerkesztése:<br>Abdurahman Zulumhanov és Anna Peterson",
		        "Steam kiadó:<br>Playsaurus",
		        "Játéktesztelés:<br>A Leprosorium közössége, Abdurahman Zulumhanov és a Playsaurus",
		        "VÉGE",
		        "Most már mehetsz és játszhatsz a Cookie Clickerrel vagy valami.",
		        "Zene:<br>Shallow Anne - Jake Chudnow",
		        "Deutsch: flex 4711, Patrick Karban",
		        "Português: selfemcrowdin, Mateus Iamarino",
		        "Italiano: doralum",
		        "Español: armangar, Syunay Kamenov",
		        "Français: KjetilVion, Etienne Samson, William (Ekitchi)",
		        "Nederlands: lievevandyck",
		        "Čeština: Jakub Strelinger",
		        "Polski: PolglishPL",
		        "日本語: Winna Tolentino",
		        "한국어: Ah Lon Sin, Sumin Park, Cyberowl",
		        "简体中文：Daisy Chan, kevinlee7, YuLun",
		        "繁體中文: Daisy Chan, kevinlee7",
		        "ไทย: They say P, Phimze Pym",
		        "Magyar: Simon Dániel és Márton-Mezey Csenge",
		        "Latviešu valoda: Roberts Artūrs Bumburs (Arburo)",
		        "Română: Eric Apetrei"
		    ],
		    "explainer": [
		        "Nyomd meg és tartsd úgy.",
		        "Mindig egy cellával lentebb kattints.",
		        "<span class=\"keyboard\">Q</span>, <span class=\"keyboard\">Esc</span> vagy jobb klikk a megszakításhoz.",
		        "Tartsd nyomva az <span class=\"keyboard\">Alt</span> billentyűt, hogy többet láss.",
		        "Nyomd meg a <span class=\"keyboard\">Q</span> billentyűt egy üres cella felett a bontóeszköz kiválasztásához.",
		        "Nyomd meg a <span class=\"keyboard\">Q</span> billentyűt egy gépen, hogy még egyet építs belőle.",
		        "A WASD-al vagy a jobb egérgombbal kattintva és húzva nézhetsz körül."
		    ],
		    "random": {
		        "paste": "A mentés kódja a vágólapra másolva. Mentsd el valami biztonságos helyre.",
		        "toolate": "Már túl késő bármit is menteni. Már minden megtörtént.",
		        "existed": "ÚJ",
		        "steamWarning": "Steam hiba. Az automatikus mentés és a teljesítmények nem fognak működni. Próbáld meg újraindítani a játékot."
		    }
		},
		lv: {
			splash: {
				sixtyfour: `SEŠDESMIT&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ČETRI`,
				continue: `<span>TURPINĀT</span><div class="keyboard">Esc</div>`,
				start: `<span>SĀKT</span><div class="keyboard">Esc</div>`,
				soundoff: `SKAŅA IR IZSLĒGTA`,
				soundon: `SKAŅA IR IESLĒGTA`,
				save: `SAGLABĀT`,
				load: `IELĀDĒT`,
				language: `VALODA: LATVIEŠU`,
				reset: `ATIESTATĪT`,
				credit: `©2024 Oleg Danilov, publicēja Playsaurus. Versija`,
				warning: `Tu pazaudēsi visu, Es nejokoju. Turpini turēt pogu ja esi pārliecināts.`,
				glory: `SASNIEGUMI`,
				deglory: `ATPAKAĻ`,
				quit: `IZIET`,
				export: `Eksportēt`,
				import: `Importēt`,
				flashbang: `Šī spēle satur spilgtas, mirgojošas gaismas. Ja esi jūtīgs pret to, tad ir ieteicams izslēgt mirgošanu, nospiežot šo ikonu.`//REMOVE WHILE EXPORTING
			},
			achievements: [
				{
					name: `Muļķa Zelts`,
					description: `Iegūsti Elmerine`
				},
				{
					name: `Dziļi Violets`,
					description: `Iegūsti Qanetite`
				},
				{
					name: `Asinis no zemes`,
					description: `Iegūsti Beta-Pylene`
				},
				{
					name: `Zaļā Enerģija`,
					description: `Atrodi Elles akmens`
				},
				{
					name: `Karstais Stikls`,
					description: `Atrodi Chromalit`
				},
				{
					name: `Dievišķais Akmens`,
					description: `Iegūsti Celestial Foam`
				},
				{
					name: `Vai ar to var mazgāt traukus?`,
					description: `Iegūsti Hollow Stone`
				},
				{
					name: `Kur saule nespīd`,
					description: `Iegūsti Void`
				},
				{
					name: `Kam tu zvanīsi?`,
					description: `Iegūsti Realitāti`
				},
				{
					name: `Nīče`,
					description: `Skaties tumsā 64 reizes`
				},
				{
					name: `64K`,
					description: `Iegūsti 64 000 akmeņus`
				},
				{
					name: `64M`,
					description: `Iegūsti 64 000 000 akmeņus`
				},
				{
					name: `64B`,
					description: `Iegūsti 64 000 000 000 akmeņus`
				},
				{
					name: `Tu vari sākt no sākuma`,
					description: `Iesprūsti sākumā`
				},
				{
					name: `Mūžīgā nemašīna`,
					description: `Saliec divus konteinerus kopā`
				},
				{
					name: `Vajag atpūtu?`,
					description: `Spēlē 64 stundas`
				},
				{
					name: `Vajag....iznīcināt`,
					description: `Klikšķini kubiku 6400 reizes`
				},
				{
					name: `Arhitekts`,
					description: `Uzbūvē 64 mašīnas`
				},
				{
					name: `Iznīcinātājs`,
					description: `Iznīcini 64 mašīnas`
				},
				{
					name: `Elles cēlājs`,
					description: `Iegūsti 9 Elles Turētājus`
				},
				{
					name: `Beigas/Sākums`,
					description: `Uzspridzini Apgriezto Plaisu`
				},
				{
					name: `Cepuma klikšķinātājs`,
					description: `Noklikšķini cepumu`
				},
				{
					name: `Piedzēries Jūrnieks`,
					description: `Taurē 64 reizes bez iemesla`
				},
				{
					name: `Mr. Mine`,
					description: `Iegūsti 9 Kanāla Racējus`
				},
				{
					name: `Vai tam ir limits?`,
					description: `Ierocies 64 km dziļi`
				},
				{
					name: `Seth Brundle`,
					description: `Teleportējies <s>1</s> 64 reizes`
				},
				{
					name: `Sarkans-Zils Akmens`,
					description: `Pabeidz spēli neizdēšot neko pirmās 15 minūtes un ar mazāk kā 15 Norobežojošie Konteineri`
				},
				{
					name: `Pa tiešo uz elli!`,
					description: `Iegūsti Elles akmeni pirmajās 64 minūtēs no spēles sākšanas`
				},
				{
					name: `Tikai sākums`,
					description: `Ierocies 64 metrus dziļi`
				},
				{
					name: `Vai ir karsti?`,
					description: `Ierocies 640 metrus dziļi`
				},
				{
					name: `Pārāk dziļi`,
					description: `Ierocies 6400 metrus dziļi`
				},
				{
					name: `64 km/h lejup`,
					description: `Ierocies 6400 metrus dziļi no momenta kad noliec jaunu Kanāla Racēju`
				},
				{
					name: `Neofobija`,
					description: `Pabeidz spēli nekad neuzlabojot kanāla izvilcējus`
				}
			],
			resources: [
				`Charonite`,
				`Elmerine`,
				`Qanetite`,
				`Beta-Pylene`,
				`Elles Akmens`,
				`Chromalit`,
				`Debesu putas`,
				`Tukšais akmens`,
				`Void`,
				`Realitāte`
			],
			entities: {
				pinhole: {
					name: `?`,
					description: `U/D, C/S, T/B, E/νE, μ/νμ, τ/ντ, G/γ, Z/W, H, Δ/νΔ`
				},
				gradient: {
					name: `Gradient aka`,
					description: `Mūžīgi rokams akmens. Atbild uz gandrīz viesiem destabilizatoriem un rezonētājiem. Ir jāsavieno ar Apgriezto Plaisu caur konduktoriem.`
					//description: `Piekļuves punks mūžīgiem resursiem. Atbild uz gandrīz viesiem destabilizatoriem. Ir jāsavieno ar Apgriezto Plaisu caur konduktoriem.`
				},
				chasm: {
					name: `Apgrieztā Plaisa`,
					description: `Tilts uz nezināmo.`
				},
				conductor: {
					name: `Konduktors`,
					description: `Savieno Apgriezto Plaisu ar industriālo konteineri.`
				},
				pump: {
					name: `Kanāla izvilcējs`,
					description: `Rok resusus un noliek apkārt sev.`
				},
				pump2: {
					name: `Kanāla Racējs`,
					//descriptio: `Rok ārā daudz resursus ātri un noliek tos tālāk apkārt sev.`
					description: `Kanāla Izvilcēja uzlabojums. Rok ārā daudz resursus ātri un noliek tos tālāk apkārt sev.`
				},
				vault: {
					name: `Elles Turētājs`,
					description: `Izolē 1024 Elles Akmeņus no apkārtnes`
				},
				cube: {
					name: `Resursa kubs`,
					description: `Iegūtie resursi.`
				},
				destabilizer: {
					name: `Destabilizators`,
					description: `Noliec šo blakus kubam lai to salauztu divreiz ātrāk. Nepieciešams Elmerine lai darbinātu. Papilduz destabilizatori palielina efektu.`,
					remdescription: `Dubultē jaudu resursu-salauzīšanas procesam ja noliek blakus izvilktijam kubam. Nepieciešams Elmerine la darbinātu. Papildus destabilizatori palielina efektu`
				},
				destabilizer2: {
					name: `Industriālais desatabilizators`,
					description: `Destabilizatora uzlabojums. Palielina resursu-salauzšanas procesa jaudu četras reizes. Nepieciešams 64 Elmerine lai darbinātu. Papildus destabilizatori palielina efektu.`
				},
				destabilizer2a: {
					name: `Elles Akmens destabilizators`,
					description: `Industriālā destabilizatora uzlabojums. Palielina resursu-salauzšanas procesa jaudu 625 reizes kamēr Elles Akmens ir iekš kuba. Savādāk nedod nekādu efektu. Nepieciešams 1 Elles Akmens lai darbinātu. Papildus destabilizatori palielina efektu.`
				},
				doublechannel: {
					name: `Kanāla Atdzesētājs`,
					description: `Noliec šo mašīnu blakus kuba-izvelkšanas mašīnai lai izraktu kubus divas reizes ātrāk. Papildus atdzesētāji palielina efektu.`,
					remdescription: `Dubultē plūsmu avota kanālam ja tiek nolikts blakus tam. Papildus atdzesētāji palielina efektu.`
				},
				doublechannel2: {
					name: `Aktīvs Kanāla Atdzesētājs`,
					description: `Kanāla atdzesētāja uzlabojums. Trīskāršo plūsmu avota kanālam ja tiek nolikts blakus tam. Papildus atdzesētāji palielina efektu.`
				},
				valve: {
					name: `Reversais vārsts`,
					description: `Aizliedz kuba-izvelkšanas mašīnai atgriezties oriģinālajā pozīcija, ja nolikts blaku. Nepieciešams Charonite lai darbinātu.`,
					remdescription: `Aizliedz atpakaļ ejošu plūsmu avota kanāla, ja tiek nolikts blakus. Nepieciešams Charonite lai darbinātu.`
				},
				auxpump: {
					name: `Papildus sūknis`,
					description: `Reversā vārsta uzlabojums. Dod spiedienu avota kanālam, ja tiek nolikts blakus. Nepieciešams 8 Elmerine lai darbinātu. Papildus pumpji nepalielina spiedienu avota kanālam.`
				},
				auxpump2: {
					name: `Pumpja stacija`,
					description: `Papildus sūkņa uzlabojums. Dod četrkāršu spiedienu avota kanālam, ja tiek nolikts blakus. Nepieciešai 256 Elmerine un 4 Beta-Pylene lai darbinātu. Vairākas stacijas nepalielina spiedienu avota kanālam.`
				},
				entropic: {
					name: `Entropijas rezonators`,
					description: `Periodiski lauž resursus, ja tiek nolikts blakus kubam. Nepieciešams Qanetite lai darbinātu.`
				},
				entropic2: {
					name: `Entropijas rezonators II`,
					description: `Entropijas rezonatora uzlabojums. Lauž resursus 3 reizes ātrāk. Nepieciešams Chromalit lai darbinātu.`
				},
				entropic2a: {
					name: `Entropijas kondensators`,
					description: `Entropijas rezonatora uzlabojums. Lauž resursus tiklīdz tie parādās virs zemes ar 600% jaudu. Bet tikai vienu reize kubā. Nepieciešams 8 Chromalits lai darbinātu.`
				},
				entropic3: {
					name: `Void rezonatori`,
					description: `Entropijas rezonatora II uzlabojums. Kad iznīcināšana notiek, rezonators lauž kubus apkārt ar milzīgu spēku.`
				},
				converter32: {
					name: `Charonite bagātināšanas cisterna`,
					description: `Lēnām reaģē Qanetite ar Charonite lai iegūtu Elmerine.`
				},
				converter13: {
					name: `Charonite karteris`,
					description: `Iegūst atpakaļ Qanetite no sašķidrinātām Charonite nogulsnēm, katalizatoru klātbūtnē.`
				},
				converter41: {
					name: `Beta-Pylene oksidētājs`,
					description: `Dedzina Beta-Pylene lai iegūtu Charonite un mazu daļu citus elementus.`
				},
				converter76: {
					name: `Debesu apstarotājs`,
					// description: `Apstaro Debesu Putas ar Chromalit, pārvēršot putas uz Chromalit.`
					description: `Apstaro Debesu Putas ar Chromalit, pārvēršot putas uz Chromalit, kas ir labs resurss Elles Akmens, Beta-Pylene, Qanetite un Elmerine ieguvei, pateicoties Chromalit sabrukšanai.`
				},
				converter64: {
					name: `Debesu reaktors`,
					description: `Atļauj kontrolētu Chromalits un Debesu putu saliedēšanos lai izveidotu Beta-Pylene. Nestrādā tuvumā citiem debesu reaktoriem.`
				},
				reflector: {
					name: `Debesu atstarotājs`,
					description: `Uzlabo blakus esošā debesa reaktora darbspēju.`
				},
				mega1: {
					name: `Materiālu plūsmas tornis`,
					// description: `Stumj resursus cauri plūsmai. Var būvēt tikai vienu.`
					description: `Uzlabo redzamību saspiežot kustīgos resursus. Var būvēt tikai vienu.`
				},
				mega1a: {
					name: `Materiālu plūsmas tornis MKII`,
					//description: `Materiālu plūsmas torņa uzlabojums. Palielina plūsmas ātrumu. Var būvēt tikai vienu.`
					description: `Materiālu plūsmas torņa uzlabojums. Palielina resursu pārvietošanās ātrumu. Var būvēt tikai vienu.`
				},
				mega1b: {
					name: `Materiālu plūsmas tornis MKIII`,
					//description: `Materiālu plūsmas tornis MKII uzlabojums. Kompresē resursus paketēs. Var būvēt tikai vienu.`
					description: `Materiālu plūsmas tornis MKII uzlabojums. Kompresē resursus vēl vairāk. Var būvēt tikai vienu.`
				},
				mega2: {
					name: `Šķirošanas tornis`,
					description: `Atļauj šķirot mašīnas, kas atdod 90% resursus. Var būvēt tikai vienu`
				},
				mega3: {
					name: `Demontāžas tornis`,
					description: `Šķirošanas torņa uzlabojums. Atļauj mašīnu demontāžu, kas atdod atpakaļ visus resursus. Var būvēt tikai vienu.`
				},
				voidsculpture: {
					name: `Void apbrīnas kanceleja`,
					description: `Atļauj ignorēt void mašīnu vizuālos traucējumus.`
				},
				eye: {
					name: `Uzpildes rādītājs`,
					//description: `Parāda kuras mašīnas ir jāuzpilda.`
					description: `Parāda mašīnas kuras ir jāuzpilda. Var būvēt tikai vienu.`
				},
				cookie: {
					name: `Cepums`,
					description: `Kā tas te nokļuva?`
				},
				injector: {
					name: `Elles Akmens iespiedējs`,
					description: `Samaina vienu noresursiem blokā, pret elles akmeni, ja nav jau iekš kuba. Uzpildot ar 32 Elles Akmeņien un 64 Qanetite, strādās 32 reizes.`
				},
				silo: {
					name: `Pazemes tvertne`,
					description: `Aktivizēšanas momentā upilda blakus esošās mašīnas, un tad automātiski uzpilda vēl 16 reizes.`
				},
				silo2: {
					name: `Industriālā tvertne`,
					description: `Pazemes tvertnes uzlabojums. Aktivizēšanas momentā uzpilda blakus esošās mašīnas, un tad automātiski uzpilda vēl 64 reizes.`
				},
				vessel: {
					name: `Ierobežojošais trauks`,
					description: `Ietur 32 Chromalits, neļaujot tiem sabrukt. Patērē Elles Akmeni.`
				},
				vessel2: {
					name: `Ierobežojošā tvertne`,
					description: `Ierobežojošā trauka uzlabojums. Ietur 32768 Chromalits, neļaujot tiem sabrukt. Patērē Realitāti.`
				},
				consumer: {
					name: `Katalītiskā rafinēšanas rūpnīca`,
					description: `Patērē blakus esošos salauztos resursus. Kad sakrāj 1024 resursus, tad izlaiž visu ārā kopā ar papildus bonusu. Bonusa daudzums palielinās ar katru secīgo izlaišanu, kas iet līdz 100%. Ja nav paņemt resursi 16 sekundes, tad efekts atiestatās.`
				},
				preheater: {
					name: `Catalytic preheater`,
					description: `Increases the speed of any resource conversion machine if placed next to one. Each converter increases the preheater's speed boost, up to 300%, if 8 machines are affected.`
				},
				hollow: {
					name: `Tukšais atsegums`,
					description: `Tik daudz caurumi.`
				},
				strange: {
					name: `Tukšais akmens`,
					description: `Izskatās, ka tas ir bijis šeit kādu laiku.`
				},
				strange1: {
					name: `Tukšā akmens izpētnes vieta`,
					description: `Piespiež Debesu Putām sabrukt ar 512 Elles Akmeņiem, nevis 64. ZIEMEĻOS.`
				},
				strange2: {
					name: `Tukšā akmens iekārta`,
					description: `Dubultē Tukšā Akmens maksimālo daudzumu un palielina to parādīšanās ātrumu.`
				},
				strange3: {
					name: `Pārtaisītais Tukšums`,
					description: `Dramatiski palielina Tukšā Akmens parādīšanās ātrumu un dara to visu klusi.`
				},
				generaldecay: {
					name: `Vispārējās sabrukšanas reaktors`,
					description: `Dramatiski palielina Chromalit sabrukšanas sniegumu. Var būvēt tikai vienu.`
				},
				waypoint: {
					name: `Ceļa punkts`,
					description: `Teleportē nākamo Ceļa punktu pie tevis.`
				},
				annihilator: {
					name: `Iznīcinātājs`,
					description: `Veido Void kad Elles Akmens saduras ar Debesu Putām. Nepieciešams Tukšais Akmens lai darbinātu.`
				},
				flower: {
					name: `Tukšā Puķe`,
					description: `Samazina laika deformācijas iespēju. Darbojas pretī vienam Tukšā Akmens efektam. Jābūe virsū Tukšajam Akmenim. Iznīcina Tukšo Akmeni uz kura tika uzbūvēts.`
				},
				fruit: {
					name: `Tukšais Auglis`,
					description: `Tukšās Puķes uzlabojums. Neatļauj Tukšā Akmens parādīšanos lai sevi audzētu. Veido Tukšo Akmeni.`
				},
				eraser: {
					name: `Iznīcini`,
					description: `Iznīcina mašīnu, atdodot 50% resursus atpakaļ.`
				},
				eraser2: {
					name: `Pārstrādā`,
					description: `Pārstrādā mašīnu, atdodod 90% resursu atpakaļ.`
				},
				eraser3: {
					name: `Izjauc`,
					description: `Izjauc mašīnu, atdodod visus resursus atpakaļ.`
				},
				clicker1: {
					name: `Qanetite oscilators`,
					description: `Atļauj tev spiest un turēt uz resursies lai lauztu tos. Var būvēt tikai vienu.`
				},
				clicker2: {
					name: `Elles Akmens oscilators`,
					description: `Qanetite oscilatora uzlabojums. Palielina svārstības frekvenciju. Var būvēt tikai vienu.`
				},
				clicker3: {
					name: `Chromalit oscilators`,
					description: `Elles Akmens oscilatora uzlabojums. Maksimizē svārstības frekvenci. Var būvēt tikai vienu.`
				},
				stabilizer: {
					name: `Stabilizators`,
					description: `Stabilizē vienu blakus esošo pārspriegumu, lai varētu iegūt tā spēku.`
				},
				stabilizer2: {
					name: `Stabilizators II`,
					description: `Stabilizatora uzlabojums. Uzlabo stabilitāti un darbspēju.`
				},
				stabilizer3: {
					name: `Salauzts stabilizators`,
					description: `Anomālisks uzlabojums. Uzlabo darbspēju un maksimizē stabilitāti. Var būt tikai viens.`
				}
			},
			messages: [
			    "Kur tu esi?",
			    "Es esmu nekurienes vidū!",
			    "Pieņemsim. Ko tu redzi?",
			    "Neko daudz. Te ir mašīna kuru us atpazīstu....bet es nevaru pateikt kapēc.",
			    "Kas par mašīnu?",
			    "Pagaidi, varbūt es varu...",
			    "Pag, pag. Tikai LŪDZU nesaki man, ka tu tagad aiztiksi nezināmu mašīnu?!",
			    "Mašīna strādā! Tā kautko radīja!",
			    "???",
			    "Liels melns akmens. Tik gluds. Es gribu to salauzt!",
			    "Vai tu grīstē sagājis?",
			    "Man tagad ir 64 akmeņi!",
			    "Sapratu. Vēlu tev veiksmi ar to.",
			    "Hey! Es atradu dzeltenu akmeni.",
			    "Malacis!",
			    "Es domāju, ka es varu būvēt mašīnas tagad. Būtu labi ja es uzbūvētu kautko kas man palīdzēs salauzt akmeņus ātrāk. Ja akmens parādās blakus laukā, pat diognāli, tam vajadzētu strādāt.",
			    "Pagaidi. Vau tu spēlē kādu dīvainu spēli. Tu mani sāc biedēt.",
			    "Tagad man tikai jāieleik dzeltenais akmenis šinī mašīnā.",
			    "Lai kas tevi padara laimīgāku.....Bez jokiem, vai tu šodien nāksi pie manis?",
			    "Protams! Es būšu tur pēc pāris stundām. Man tikai šis ir jāpabeibz.",
			    "Ko tieši tu dari!",
			    "Es tev vēlāk uzrakstīšu. Man vajag turpināt stumdīt šo mašīnu.",
			    "Es domāju, ka mašīnas iespaido viena otru, kad ir blakus, vai dognālajā laukā. Par piemēru, šis fēns ir jānoliek blakus pirmajai mašīnai, la paātrinātu procesu.",
			    "Tu dod tik daudz saprašanu.",
			    "Nu?",
			    "Kur tu esi?",
			    "Mēs tevi gaidām jau gadiem.",
			    "Par ko tu runā. Es vēl joprojām esmu te.",
			    "KUR???",
			    "Man tagad ir zils akmens. Vai arī tam krāsa ir lillā? Izkslausās pēc antīkas brasa svečturētāja. Es domāju, ka es to varu izmantot lai noņemtu nepareizi noliktās mašīnas.",
			    "Tu joko ar mani? Tu teicu, ka tu nāksi. Kas pie velna?!",
			    "Nomierinies, es tur būšu pēc minūtes",
			    "Oho, es tagad varu izmantot [Q] lai duplicētu mašīnas vai iznīcināt tās, ja es sākumā klikšķinu uz tukšas vietas sākumā. Un es varu izmantot [Alt] lai redzētu aiz lielām mašīnām",
			    "AIZIET, AIZIET",
			    "Čaļi, vai jūs vēl tur?",
			    "AK MANS DIEVS!!!",
			    "Kur tu esi????",
			    "Vai tev viss ir kārtībā??",
			    "????",
			    "Kas pie velna?",
			    "VAI TEV VISS IR KĀRTĪBĀ? KUR TU ESI?",
			    "Nomierinies čali, man viss ir kārtībā. Kas notika?",
			    "To tu man pasaki! Tu pazudi uz vairākām nedēļām! Es pat aizgāju uz tavu vietu pāris reizes, bet tu nekad nebiji tur. Lūdzu, pasaki kur tu esi, tas ir viss. Vai tu esi mājās tagad?",
			    "Čali, par ko tu runā? Mēs sarakstījāmies pirms pāris minūtēm.",
			    "KAS TEV PAR VAINU??? Sākumā tu neparādies, un tad tu pilnībā pazūdi. Tagad tu izliecies, ka nekas nav noticis",
			    "Es tev jautāju vienkāršu jautājumu",
			    "KUR TU ESI??",
			    "Es esmu šeit.",
			    "K U R",
			    "Pagaidi lūdzu",
			    "Tas vairs nav smieklīgī. Kur tieši tu esi? Tu vari man to pateikt?",
			    "Nu...",
			    "Čali, man nav ne jausmas",
			    "Iedod man minūti",
			    "Kā to saprast, tu nezini?",
			    "Man vajag padomāt",
			    "Vai viss ir kārtībā? Vai tu esi drošībā? Vai man kādām ir jāzvana?",
			    "Nē, man viss ir labi. Es tikai",
			    "Es tev uzrakstīšu pēc kāda laika",
			    "Kas tev tur notiek čali?",
			    "Es esmu nobijies",
			    "Izskatā, ka man ne jausmas kur es atrodos.",
			    "Šitas viss ir dīvaini. Man viss ir kārtībā, to es zinu. Bet es nevaru aprakstīt šo vietu.",
			    "Tas ir kā sapnis, bet tanī pašā brīdī tas nav. Viss ir balts un te ir šīs mašīnas. Un kubi. Nekas nav jēgas.",
			    "Es nēsmu kurījis, vai dzēris. Es tikai tagad sapratu, ka tas ir dīvaini, kā es nepievērsu uzmanību tam, ka šī vietu ir pilnībā savadāka no jebkā, ko es esmu redzējis.",
			    "Es tiko ieguvu sarkanus akmeņus, un tas ir diezgan nepatīkami, ka es pilnībā pieņemu šo visu kā normu. Labi, tikai sarkans akmen, viss ir kārtībā.",
			    "Tas nozīmē, ka tu nejoko...",
			    "Es zinu kā tas izklausās. Bet viss ko es aprakstīju, ir man acu priekšā.",
			    "Vai es tev varu kā palīdzēt varbūt?",
			    "Vienkārši runā ar mani lūdzu.",
			    "Varu to mierīgi darīt draugs. Starpcitu, polivija tevi tagad arī meklē. It kā tu būtu pazudis..",
			    "Vai tu viņiem rādīji mūsu saraksti?",
			    "Kā tas palīdzētu? Es ieslēdzu aut-dzēšanu.",
			    "Paldies!",
			    "Kā tev tur iet?",
			    "Izrādās, ka es varu pārvietoties izmantojot WASD. Bet apkārt nav nekā interesanta, izņemot šo dīvaino klinti ziemeļos.",
			    "Tas nozīmē, ka tava telefona kompass tur strādā!",
			    "Nu, tas ir tikai \"augšup\" nošejienes, laikam tas ir ziemeļi.",
			    "Saprotami.",
			    "Piedevām, man nemaz nav telefons...",
			    "Kā tu man raksti tad?",
			    "Kā lai es to zinu!! Es zinu tikai to, ka tu man raksti. Un es tev varu atbildēt! Tas nav tik vienkārši paskaidrojams.",
			    "Neuztraucies par to. Mēs varam runāt, un tas jau ir labi.",
			    "Jā, tev taisnība.",
			    "Tad....pastāsti par mašīnām.",
			    "Kā to saprast?",
			    "WKas tie ir, ko viņi dara, kā viņi strādā?",
			    "Nu, tie izskatās grezni ar dažādiem kabeļiem, vadiem un citām lietām",
			    "Viens, par piemēru, izskatās kā liela plastmasas kastear vara spoli pa virsu, kur zilais akmens iet iekš. Un tur ir liela etiķete, kas raskta \"E—01SR\" uz malas, ar mazāku etiķeti \"Uzmanību! Spēcīgs entropijas radiācija\"",
			    "Ko tas nozīmē?",
			    "Man ne jausmas. Tur ir nedaudz entropijas radiācija tur...laikam.",
			    "Pag, es biju domājis, ka tu tās mašīnas uzbūvēji?",
			    "Saprotami....es redzu tavu mulsumu.",
			    "Es tās mašīnas taisu no kubiem, kautkā. Es tikai nezinu, kas ir iekšā. Jā, tas izklausās dīvaini, ļauj man padomāt par to.",
			    "Un tā iskatās, ka dzeltenie un zilie akmeņi nav bezgalīgi, tāpēc man tiešām vajadzētu nopirkt pārveidotājus vai jaunu raktuvi.",
			    "Izkslausās kā plāns",
			    "Cik sarežģīti viss ir!",
			    "Huh?",
			    "Zaļš akmens! Pieprasa mūžību lai salauztu. Man ienācā prātā ideja, kā ar viņiem rīkoties, ja parādīsies vēlreiz.",
			    "Esmu pārliecināt, ka tu uztaisīsi glaunu mašīnu tam!",
			    "Tieši tā!",
			    "Paldies dievam! Elles Akmeņi, uzmanieties no manis.",
			    "Do viņiem elli!",
			    "Atceries tu jautāji par mašīnām?",
			    "Jā",
			    "Man ir aizdomas, ka tie nav reāli",
			    "Kā lai es to saprotu?",
			    "Tas ir itkā sapnī. Es nevaru paskatīties iekšā, vai no citiem sāniem.",
			    "Neskaidra reprezentācija neizskaidrojamām mašīnām",
			    "Es domāju, ka šīs mašīnas izkatās šadi, tikai tāpēc, ka es uztveru to funkciju pirmkārti.",
			    "Piemēram, ja kautkas cērt nost koku, tad tam jāizskatās kā cirvim?",
			    "Kautkā tamlīdzīgi",
			    "Nu, tu man izklausies diezgan reāli.",
			    "Jā, es pieņemu, ka tu esi vienīgā reālā lieta man pagaidām.",
			    "Es ieguvu daudz jaunus kubus, kas sabrūk uz citiem kubiem!",
			    "Izklausā ne labi, ne slikti",
			    "Man ir jāpasaka kautkas ļoti dīvains",
			    "Vai tu redzi ironiju, tanī ko tu uzrakstīji?",
			    "Varbūt šīs vietas dēļ, bet es aizmirsu tavu vārdu",
			    "Tad mēs varam vienkārši pavadīt laiku kopā",
			    "Es esmu nopietns",
			    "Mans vārds ir Duke Nukem!.",
			    "Čali...beidz!",
			    "Kautkas ko viņa teica!",
			    "Tas ir stulbi! Beidz mani biedēt. Kas notiek?",
			    "Vāks",
			    "Izskatās ka arī es nevaru atcerēties savu vārdu.",
			    "Es vienkārši nevaru! Tas ir sasodīti dīvaini. Un es nevaru atcerēties tavu vārdu!",
			    "Varbūt tā ir masu histērija? Es esmu dzirdējis, ka tas var ietekmēt vairākus cilvēkus. Sākumā nomierināsimies, un tad skatīsimies, kas notiek.",
			    "Jā, varētu būt histērija",
			    "Es vēl joprojām nevaru atcerēties vārdus",
			    "Es arī. Un ir vēl.",
			    "Jā! Kā es izskatos? Kad mēs satikāmies?",
			    "Kā mana māja izskatās, kas ir mūsu draugi? Vai mēs esam tikušies pirmkārt?",
			    "Izskatās, ka mēs abi esam iestrēguši, viena un tani pašā situācijā. Un es pat nevaru pateikt, vai tas ir vienmēr tā bijis, vai kautkas notika vienubrīd. Vai šis ir dīvains sapnis? Un kurš sapņo?",
			    "Kāda mašīna blakus? Varbūt kubs parādījās kautkur?",
			    "Smieklīgi",
			    "Nu, izdomāsim viens otram vārdus tad.",
			    "Tu izsklausies, kā Veen",
			    "Kāpēc ne",
			    "Man nav nekas pret Veen",
			    "Hey, Veen. Vai tu vēlies pupiņas, Veen? Jā, izsklausās labi.",
			    "Un tu būsi Charps",
			    "Vai tev ir asas arfas, Charps?",
			    "Tas nerada jēgu!",
			    "Man patīk Charps. Prieks tevi redzēt, Veen",
			    "Tāpat, Charps",
			    "KAS NOTIEK",
			    "Kas?",
			    "Balti kubi! Tie iznīcina zaļos!",
			    "Te ir tonnām brūkoši kubi arī! Itkā es būtu iekš kodolreaktora!",
			    "Ak dievs, tev viss ir labi?",
			    "Jā, man viss ir kārtībā! Te viss ir bardakā. Man vajag uzbūvēt kautko, kas šo visu salabos. Varbūt man vajag vēlreiz paskatīties uz to akmeni ziemeļos.",
			    "Tas ir kautkas ko tu vienmēr dari, Charps!",
			    "Izsklausās dīvaini!",
			    "Es teiktu, mans vārds izsklausās dīvaini. Es domāju, ka es kautkad pieradīšu pie tā. Pareizi, Veen?",
			    "Jā! Tiktiešām dīvaini.",
			    "Atceries es minēju dīvainu akmeni ziemeļos?",
			    "Ne pārāk, nē",
			    "Tur ir tas akmens. Un nepārproti mani, es saprotu, ka šeit viss ir dīvains. Bet šis akmens ir dīvaināks, nekā jebkas kas te ir.",
			    "Es nevaru saprast neko no tā visa. Bet kad es iedomājos paaiztkt viņu, tas akmens pamainīja visuma likumus!",
			    "Vai viņš ir bīstams?",
			    "Es nezinu. Izmaiņa ir maza.",
			    "Es brīnos ko vēl viņš var darīt.",
			    "Labi, tikai neiznīcini visumu nejauši.",
			    "Es pacentīšos.",
			    "Ak dievs, TAS bija cietākais akmens manā dzīvē! Bet es tagad zinu, kā vinu ātrāk salauzt.",
			    "Ieguvi jaunu akmeni?",
			    "Jā, divaināko pagaidām.",
			    "Whoa, varbūt efekts uz visumu nav nemaz tik nepamanāms. Vai tu to jūti?",
			    "Jūtu ko?",
			    "Varētu būt, ka tikai es to jūtu.",
			    "Vai tu gadījumā redzēji lielu akmeni sev acu priekšā tikko?",
			    "Vai ledusskapis skaitās?",
			    "Nepievērs uzmanību man",
			    "Oho, šis kubs ir pilnīgi melns. Un ir tāda sajūta, ka nav no šīs pasaules.",
			    "Vairāk ne no šīs pausaules, kā iepriekšējais?",
			    "Tas ir savādāk! Viņš ir saldējoši aukst, bet ne kaitīgā veidā. Itkā viņam nav temperatūras koncepts un nevar ar tevi saskarties. Nav taisīts no matērjas, nav krāsasa vai kautkas pazīstams, ja tas dod jēgu kādu.",
			    "Taisnību sakot, nē.",
			    "Es domāju, ka es saprotu. Es varu izmantot tukšos akmeņus lai kondensētu melnos no tukša gaisa. Tas formē dīvaini līdzīgus kristālus, bet bez jebkādām īpašībām. Un tas salabo anomālijas visumā.",
			    "Izklausēs pēc gaisa filtrētāja",
			    "Jā, tieši tā! Izskatās, ka es kautkad sabojāju gaisu kautkā.",
			    "Tev nevajag teikt to skaļi",
			    "Es nolēmu izrakt to dīvaino akmeni. Varbūt tur iekšā ir atbildes uz to kas te notiek. Man tāda sajūta ka tas akmens dara vairāk kā vienkārši maisīšanās ar visumu, bet viņš varētu kontrolēt pilnībā visu!",
			    "Kāpēc tu tā domā?",
			    "Vai tu man ticētu, ja es tev pateiktu, ka es to jūtu?",
			    "Protams! Es domāju, ka es ticētu jebkam. Akmens kas kontrolē visumu? Kāpēc ne!",
			    "Es domāju ka es gūstu krampjus!",
			    "Lūdzu nē",
			    "Šīs mašīnas kļūst tik skaļas un apnicīgas. Varbūt man vajag uzbūvēt kautko, lai mainītu to. Vai mainīt sevi. Vai abus.",
			    "Tā tik turpināt!",
			    "Tad, ko tu izmainīji?",
			    "pag, kauktas nav kārtībā.",
			    "Es uzbūvēju lietu no melnās lietas. Un tā nav mašīna. Bet tas kautko izdarīja ceļa punktiem.",
			    "Kas ir ceļa punkti?",
			    "Tie kustina visumu apkārt tev. Tas ir kā tu kusties apkārt lielus attālumus.",
			    "Kā tu zini ka viņi kustina visumu apkārt tev, un ne tevi?",
			    "Hmm, es par to nepadomāju",
			    "Man liekas ka es salauzu visumu",
			    "Nekas no šī visa nedod jēgu!",
			    "Mašīnas nedod jēgu, nekas nedod.",
			    "Es ceru, ka es varu to visu salabot",
			    "Veen?",
			    "Čali, tu tur?",
			    "Lūdzu lūdzu lūdzu ne to! Es ceru ka tu aizgāji uz tualeti vai kautko līdzīgi.",
			    "VEEN!",
			    "KAS?",
			    "Vēl joprojām dīvaini.",
			    "Paldies dievam!",
			    "Vai tu uzbūvēji kautko jaunu?",
			    "Es domāju ka es salauzu visumu un pazaudēji tevi vispār! Es biju kautkādā pazemē ar dīvainiem simboliem un domāju ka tie bija visuma drupas. Bet tas ir cits visums, vai arī cita versija no šīs, tāpēc ka viņi viens otram ir līdzīgi, un tie tagad ir savienoti.",
			    "Ceļo apkārt? Izklausās jautri!",
			    "Jautri? Vai tu pat izlasīji manu tekstu? CITS VISUMS!!!",
			    "Tev vajag pieņemt to ka tu nevari vairs mani izbrīnīt ar šo visu vairs.",
			    "Taisnība",
			    "Tas nav akmens, tā ir lēca",
			    "Tas akmens var saplūst visu vienā punktā. Un es saku, visu! Vieta, laiks, visi koncepti un likumi. Viss!",
			    "Vai atradi rokasgrāmatu vai tamlīdzīgi?",
			    "Es nezinu kāpēc tas ir tur, un kāpēc mēs esam šeit. Es vienkārši zinu ko tas dara tagad.",
			    "Tad.....tu visu sapludināsu visu kopā tagad?",
			    "Es nezinu. Varbūt tas ir šīs vietas punkts. Tagad tas akmens lido gaisā, itkā viņam to vajadzēja visu laiku darīt.",
			    "Un ko tālāk?",
			    "Nezinu",
			    "Jo vairāk es domāju, jo vairāk es saprotu ka tās nav tikai tavas mašīnas kas nav reālas.",
			    "Es jautāju sev specifiskus jautājumus un man nav atbildes.",
			    "Atceries es tev teicu ka poliči tevi meklē? Es nebiju jokojis par to. Bet tagad visa loģika brūk kopā, kad es jautāju jautājumus.",
			    "Vai es gāju uz policiju, vai es viņiem zvanīju? Un kurš tur bija? Policija? Kur ir tas policijas iecirknis pilsētā? Kas ir šī pilsēta? Vai es dzīvoji šajā pilsētā? Kāds ir pilsētas vārds? Kādā valstī tā ir? Vai te ir valstis kā tādas?",
			    "I can't answer a single question. Everything seemed normal until I started asking questions. I am afraid to ask more.",
			    "Piedo par to",
			    "Nē, tā nav tava vaina. Mēs esam tajā pašā laivā, cik es zinu.",
			    "Es tik ceru ka tu uzzināsi, kas par laivu tā ir.",
			    "Jā es arī!",
			    "Uzzināsim, kā tas beidzās. Es tik ceru ka šī vieta nav mūžīga elle vai limbo.",
			    "Parādi vieņiem, Dante!",
			    "Tagad viss aiziet. Šiem čaļiem vajadzētu izsūkt visumu tukšu!",
			    "Tu izklausies pēc naftas kompānijas",
			    "Es esmu noguris no tā kam viss ir jāpielabo lai būtu nedaudz ātrāks, un es esmu noguris no skaņas. Šī mašīna mainīs visu. Tā pat plēš cauri uz otru pusi.",
			    "Vai tas nav bīstami?",
			    "Bīstamības koncepts šeit ir diezgan neskaidrs.",
			    "Es domāju, ka ir laiks būvēt kautko lielu.",
			    "Kas tev prātā?",
			    "Neesmu pārliecināts. Bet tam jābūt lielam!",
			    "Kā liela mašīna?",
			    "Nē, es runāju metaforiski",
			    "Dari to tad!",
			    "Bļeģ",
			    "Es izdarīju kautko nepareizi. Apgrieztā plaisa ir iznīcināta. Viss sabrūk.",
			    "Tev viss labi?",
			    "Jā, bet mašīnas tiek iznīcinātas! Es nevaru neko uzbūvēt! Bļe!",
			    "Pagaidi! Varbūt tam tā vajag notikt?",
			    "NĒ! Tam tā nevajadzētu notikt!",
			    "Kā tu to zini?",
			    "Pagaidi, man to kautkā vajag salabot",
			    "Pie velna visu!",
			    "Es tevi redzu! Tu tikko pagāji garām lielam kastaņu kokam, uz tās smieklīgās planētas augšējā galaksijas rokā tieši tur.",
			    "Nē es to nedarīju! Kāda galksija?",
			    "Ah, ir grūti pateikt tiešo laiku, tas varbūt nav noticis pagaidām. Bet tik gaidi 15 biljonus gadus!",
			    "Tu runā tīrākās muļķības. Vai tu nāksi apkārt?",
			    "Protams! Es tur būšu pēc pāris stundām, tik vajag pabeigt pāris lietas.",
			    "Protams, tikamies tad!",
			    "Bet protams, Charps",
			    "Neesi vēlu šoreiz",
			    "Es nebūšu, Veen, es nebūšu!"
			],
			credits: [
			    "Sākums",
			    "Esmu ļoti pateicīgs, ka tiki līdz galam, kur viss sākās",
			    "Apsveicu, laikam!",
			    "Tik skaties uz šo:",
			    "Resursi izrakti kopumā:",
			    "Charonites:",
			    "Elmerines:",
			    "Qanetites:",
			    "Beta-Pylenes:",
			    "Elle Akeņi:",
			    "Chromalits:",
			    "Debesu Putas:",
			    "Tukšie Akmeņi:",
			    "Voids:",
			    "Realitātes:",
			    "Mašīnas uzbūvētas:",
			    "Mašīnas iznīcinātas:",
			    "Maksimālais kanāla dziļums metros:",
			    "Dīvainais akmens aiztikts:",
			    "Reizes teleportējies:",
			    "Kuba klikšķi:",
			    "Laika izmaiņas:",
			    "Spēles laiks:",
			    "h",
			    "Spēli izveidoja:<br>Oleg Danilov",
			    "Papildus grafikas:<br>Yulia Nogteva",
			    "Dialoga rediģēšana:<br>Abdurahman Zulumhanov and Anna Peterson",
			    "Steam publicēšana:<br>Playsaurus",
			    "Spēles testēšana:<br>Community of Leprosorium, Abdurahman Zulumhanov, Playsaurus",
			    "BEIGAS",
			    "Tu vari iet spēlēt Cookie Clicker, vai kautko tādu.",
			    "Mūsika:<br>Shallow Anne by Jake Chudnow",
			    // "Magyar: Simon Dániel és Márton-Mezey Csenge" //REMOVE WHILE EXPORTING
			],
			explainer: [
				`Nospied un turi.`,
				`Vienmēr klikšķini uz vietas zem.`,
				`<span class="keyboard">Q</span>, <span class="keyboard">Esc</span> vai labais klikšķis lai beigtu.`,
				`Turi <span class="keyboard">Alt</span> lai paskatītos tuvāk.`,
				`Spied <span class="keyboard">Q</span> uz tukšas vietas lai paņemtu iznīcināšanas instrumentu.`,
				`PSpied <span class="keyboard">Q</span> uz mašīnas lai uzbūvētu vēl vienu tādu pašu.`,
				`WASD vai labais klikšķis un turi, lai skatītos apkārt.`
			],
			random: {
				paste: `Saglabāšanas kods ir nokopēts. Tagad līmē to kautkur droši.`,
				toolate: `Ir par vēlu saglabāt. Viss jau ir noticis.`,
				existed: `JAUNS`,
				steamWarning: `Steam errors. Automātiska saglabāšana un paveikumi nestrādās. Pamēģini restartēt spēli.`
			}
		},
		ro: {
		    "splash": {
		        "sixtyfour": "SIXTY&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FOUR",
		        "continue": "<span>CONTINUĂ</span><div class=\"keyboard\">Esc</div>",
		        "start": "<span>ÎNCEPE</span><div class=\"keyboard\">Esc</div>",
		        "soundoff": "SONOR OPRIT",
		        "soundon": "SONOR PORNIT",
		        "save": "SALVEAZĂ",
		        "load": "ÎNCARCĂ",
		        "language": "LIMBA: ROMÂNĂ",
		        "reset": "RESETEAZĂ",
		        "credit": "©2024 Oleg Danilov, publicat de Playsaurus. Versune",
		        "warning": "Vei pierde tot, nu glumesc. Apasă în continuare dacă ești sigur.",
		        "glory": "REALIZĂRI",
		        "deglory": "ÎNAPOI",
		        "quit": "IEȘI",
		        "export": "Exportă",
		        "import": "Importă",
		        "flashbang": "Lumini strălucitoare intermitente fac parte din acest joc. Dacă ești sensibil la ele, poți lua în considerare dezactivarea clipirilor apăsând pe această icoană."
		    },
		    "achievements": [
		        {
		            "name": "Aurul prostului",
		            "description": "Obține niște Elmerină"
		        },
		        {
		            "name": "Mov adânc",
		            "description": "Obține Qanetit"
		        },
		        {
		            "name": "Sângele pământului",
		            "description": "Obține Beta-Pilen"
		        },
		        {
		            "name": "Uzina verde",
		            "description": "Obține o Piatra-Iadului"
		        },
		        {
		            "name": "Sticlă încinsă",
		            "description": "Obține un Chromalit"
		        },
		        {
		            "name": "Beton sfânt",
		            "description": "Obține niște Spumă Cerească"
		        },
		        {
		            "name": "Poate să spele vase?",
		            "description": "Obține o Piatră Cavă"
		        },
		        {
		            "name": "Unde soarele nu răsare",
		            "description": "Obține niște Vid"
		        },
		        {
		            "name": "Ghostbusters",
		            "description": "Obține niște Realitate"
		        },
		        {
		            "name": "Nietzsche",
		            "description": "Holbează-te la abis de 64 de ori"
		        },
		        {
		            "name": "64K",
		            "description": "Obține 64 000 de pietre"
		        },
		        {
		            "name": "64M",
		            "description": "Obține 64 000 000 de pietre"
		        },
		        {
		            "name": "64B",
		            "description": "Obține 64 000 000 000 de pietre"
		        },
		        {
		            "name": "Acum poți reseta",
		            "description": "Blochează-te la început"
		        },
		        {
		            "name": "La infinit, cică",
		            "description": "Pune împreună două silozuri"
		        },
		        {
		            "name": "Ai nevoie de o pauză?",
		            "description": "Joacă-te 64 de ore"
		        },
		        {
		            "name": "Trebuie... Distrug",
		            "description": "Dă clic pe un cub de 6 400 de ori"
		        },
		        {
		            "name": "Arhitect",
		            "description": "Construiește 64 de mașinării"
		        },
		        {
		            "name": "Distrugător",
		            "description": "Distruge 64 de mașinării"
		        },
		        {
		            "name": "Dat naibii",
		            "description": "Ai 9 Cripte infernale"
		        },
		        {
		            "name": "Sfârșit/început",
		            "description": "Explodează Prăpastia Inversă"
		        },
		        {
		            "name": "Cookie clicker",
		            "description": "Dă click pe un fursec"
		        },
		        {
		            "name": "Bețivul marinar",
		            "description": "„Claxonează” de 64 de ori fără motiv"
		        },
		        {
		            "name": "Dl. Mine",
		            "description": "Ai 9 Canale de excavare"
		        },
		        {
		            "name": "O fi vreo limită?",
		            "description": "Sapă până la 64 km adâncime"
		        },
		        {
		            "name": "Seth Brundle",
		            "description": "Teleportează-te <s>o dată</s> de 64 de ori"
		        },
		        {
		            "name": "Rocă roșu-albăstruie",
		            "description": "Termină jocul făra a șterge nimic pentru 15 minute, în același timp având mai puțin de 15 Silozuri de Izolare"
		        },
		        {
		            "name": "Drept în iad!",
		            "description": "Obține o Piatra-Iadului în primele 64 de minute ale jocului"
		        },
		        {
		            "name": "Mai sapă",
		            "description": "Sapă până la 64 de metri adâncime"
		        },
		        {
		            "name": "E încinsă?",
		            "description": "Sapă până la 640 de metri adâncime"
		        },
		        {
		            "name": "Adânc adânc",
		            "description": "Sapă până la 6400 de metri adâncime"
		        },
		        {
		            "name": "64 km/h în jos",
		            "description": "Atinge o adâncime de 6400 metri la mai puțin de 6 minute de la plasarea unui canal de excavare nou"
		        },
		        {
		            "name": "Neofobie",
		            "description": "Finalizați jocul fără a actualiza vreodată canalele de extracție"
		        }
		    ],
		    "resources": [
		        "Charonită",
		        "Elmerină",
		        "Qanetit",
		        "Beta-Pilen",
		        "Piatra-Iadului",
		        "Chromalit",
		        "Spumă Cerească",
		        "Piatră Cavă",
		        "Vid",
		        "Realitate"
		    ],
		    "entities": {
		        "pinhole": {
		            "name": "?",
		            "description": "U/D, C/S, T/B, E/νE, μ/νμ, τ/ντ, G/γ, Z/W, H, Δ/νΔ"
		        },
		        "gradient": {
		            "name": "Puț diferențial",
		            "description": "Un cub exploatabil la infinit. Răspunde majorității destabilizatoarelor și rezonatoarelor. Se conectează Prăpastiei Inverse prin conductoare."
		        },
		        "chasm": {
		            "name": "Prăpastia Inversă",
		            "description": "O punte către necunoscut."
		        },
		        "conductor": {
		            "name": "Conductor",
		            "description": "Conectează Prăpastia Inversă cu silozurile industriale."
		        },
		        "pump": {
		            "name": "Canal de extracție",
		            "description": "Extrage resurse și le plasează în jurul său."
		        },
		        "pump2": {
		            "name": "Canal de excavare",
		            "description": "Îmbunătățire a canalului de extracție. Excavează o mulțime de resurse în mod rapid și le plasează mai departe în jurul său."
		        },
		        "vault": {
		            "name": "Criptă infernală",
		            "description": "Izolează 1024 de Piatra-Iadului de mediu."
		        },
		        "cube": {
		            "name": "Cub de resurse",
		            "description": "Resurse extrase."
		        },
		        "destabilizer": {
		            "name": "Destabilizator",
		            "description": "Plasează-l lângă un cub pentru a îl sparge de două ori mai repede. Are nevoie de o Elmerină pentru a funcționa. Efectul crește cu numărul destabilizatoarelor."
		        },
		        "destabilizer2": {
		            "name": "Destabilizator industrial",
		            "description": "Îmbunătățire a destabilizatorului. Mărește de 4 ori puterea procesului de spargere a resurselor. Are nevoie de 64 Elmerină pentru a funcționa. Efectul crește cu numărul destabilizatoarelor."
		        },
		        "destabilizer2a": {
		            "name": "Destabilizator Infernal",
		            "description": "Îmbunătățire a destabilizatorului industrial. Mărește puterea procesului de spargere a resurselor de 625 ori atunci când o Piatra-iadului este prezentă în cubul extras. Altfel, nu aduce niciun beneficiu. Are nevoie de 1 Piatra-iadului pentru a funcționa. Efectul crește cu numărul destabilizatoarelor."
		        },
		        "doublechannel": {
		            "name": "Răcitor de canal",
		            "description": "Plasează-l lângă o mașinărie extractoare de cuburi pentru a le extrage de două ori mai rapid. Efectul crește cu numărul răcitoarelor."
		        },
		        "doublechannel2": {
		            "name": "Răcitor de canal activ",
		            "description": "Îmbunătățire a răcitorului de canal. Triplează debitul unui canal sursă atunci când îi este adiacent. Efectul crește cu numărul răcitoarelor."
		        },
		        "valve": {
		            "name": "Valvă inversă",
		            "description": "Previne o mașinărie extractoare din a regresa către poziția originală atunci când îi este adiacentă. Are nevoie de o Charonită pentru a funcționa."
		        },
		        "auxpump": {
		            "name": "Pompă auxiliară",
		            "description": "Îmbunătățire a valvei inverse. Furnizează presiune unui canal sursă atunci când îi este adiacentă. Are nevoie de 8 Elmerină pentru a funcționa. Debitul nu crește cu numărul de pompe."
		        },
		        "auxpump2": {
		            "name": "Stație de pompare",
		            "description": "Îmbunătățire a pompei auxiliare. Furnizează de 4 ori mai multă presiune unui canal sursă atunci când îi este adiacentă. Are nevoie de 256 Elmerină și 4 Beta-pilen pentru a funcționa. Debitul nu crește cu numărul de stații."
		        },
		        "entropic": {
		            "name": "Rezonator entropic",
		            "description": "Sparge resurse în mod periodic atunci când este plasat lângă un cub. Are nevoie de un Qanetit pentru a funcționa."
		        },
		        "entropic2": {
		            "name": "Rezonator entropic II",
		            "description": "Îmbunătățire a rezonatorului entropic. Sparge resurse de 3 ori mai repede. Are nevoie de un Chromalit pentru a funcționa."
		        },
		        "entropic2a": {
		            "name": "Condensator entropic",
		            "description": "Îmbunătățire a rezonatorului entropic. Sparge resursele în momentul în care apar la suprafață cu o putere de 600%, dar doar o singură dată per cub. Are nevoie de 8 Chromalit pentru a funcționa."
		        },
		        "entropic3": {
		            "name": "Rezonator al vidului",
		            "description": "Îmbunătățire a rezonatorului entropic II. Când anihilarea are loc, rezonatorul sparge cuburile din jurul său cu o putere imensă."
		        },
		        "converter32": {
		            "name": "Cuvă de îmbogățire a Charonitei",
		            "description": "Formează un mediu în care Qanetitul reacționează încet cu Charonita pentru a produce Elmerină."
		        },
		        "converter13": {
		            "name": "Bazin de Charonită",
		            "description": "Recuperează Qanetit din sedimente lichefiate de Charonită în prezența catalizatorilor."
		        },
		        "converter41": {
		            "name": "Oxidator de Beta-pilen",
		            "description": "Arde Beta-Pilen pentru a produce Charonită și cantități minuscule de alte elemente."
		        },
		        "converter76": {
		            "name": "Irradiator ceresc",
		            "description": "Iradiază spumă cerească cu ajutorul unui Chromalit, convertind-o în mai multe Chromalite. Acestea sunt o bună sursă de Piatra-iadului, Beta-pilen, Qantetit și Elmerină prin dezintegrarea Chromalitelor."
		        },
		        "converter64": {
		            "name": "Reactor ceresc",
		            "description": "Susține fuziunea controlată a Chromalitelor și spumei cerești pentru a produce Beta-pilen. Nu poate funcționa în proximitatea altor reactoare cerești."
		        },
		        "reflector": {
		            "name": "Reflector ceresc",
		            "description": "Îmbunătățește randamentul unui reactor ceresc adiacent."
		        },
		        "mega1": {
		            "name": "Turn de transmisie a materialelor",
		            "description": "Crește vizibilitatea prin comprimarea resurselor în mișcare. Nu poate fi decât unul."
		        },
		        "mega1a": {
		            "name": "Turn de transmisie a materialelor MKII",
		            "description": "Îmbunătățire a turnului de transmisie a materialelor. Crește viteza de transfer a resurselor. Nu poate fi decât unul."
		        },
		        "mega1b": {
		            "name": "Turn de transmisie a materialelor MKIII",
		            "description": "Îmbunătățire a turnului de transmisie a materialelor MKII. Comprimă resursele în mișcare și mai mult. Nu poate fi decât unul."
		        },
		        "mega2": {
		            "name": "Turn de reciclare",
		            "description": "Permite reciclarea mașinăriilor, returnând 90% din resursele investite. Nu poate fi decât unul."
		        },
		        "mega3": {
		            "name": "Turn de dezasamblare",
		            "description": "Îmbunătățire a turnului de reciclare. Permite dezasamblarea mașinăriilor, returnând toate resursele investite. Nu poate fi decât unul."
		        },
		        "voidsculpture": {
		            "name": "Catapeteasma către vid",
		            "description": "Permite ignorarea dezavantajelor vizuale ale mașinăriilor bazate pe vid."
		        },
		        "eye": {
		            "name": "Controlor de încărcare",
		            "description": "Indică mașinăriile gata de a fi încărcate. Nu poate fi decât unul."
		        },
		        "cookie": {
		            "name": "Un fursec",
		            "description": "Cum a ajuns acolo?"
		        },
		        "injector": {
		            "name": "Injector de Piatra-iadului",
		            "description": "Face schimb între o resursă aleatorie dintr-un cub adiacent și o Piatra-iadului dacă nu este niciuna deja prezentă. Are 32 de utilizări atunci când este aprovizionat cu 32 Piatra-iadului și 64 Qanetit."
		        },
		        "silo": {
		            "name": "Siloz subteran",
		            "description": "În momentul activării reîncarcă mașinăriile adiacente și apoi continuă să le reîncarce de încă 16 ori."
		        },
		        "silo2": {
		            "name": "Siloz industrial",
		            "description": "Îmbunătățire a silozului subteran. În momentul activării reîncarcă mașinăriile adiacente și apoi continuă să le reîncarce de încă 64 ori."
		        },
		        "vessel": {
		            "name": "Recipient de izolare",
		            "description": "Ține 32 de Chromalite, împiedicând-le fisiunea. Consumă o Piatra-iadului."
		        },
		        "vessel2": {
		            "name": "Siloz de izolare",
		            "description": "Îmbunătățire a recipientului de izolare. Ține 32768 de Chromalite, împiedicându-le fisiunea. Consumă Realitate."
		        },
		        "consumer": {
		            "name": "Rafinărie catalitică",
		            "description": "Consumă resurse sparte în apropierea sa. După acumularea a 1024 de resurse, le eliberează cu un adaos. Valoarea adaosului crește cu fiecare eliberare consecutivă, ajungând până la un adaos de 100%. Dacă nu se consumă nicio resursă timp de 16 secunde, efectul se pierde."
		        },
		        "preheater": {
		            "name": "Preîncălzitor catalitic",
		            "description": "Crește viteza oricărei mașinării de convertire a resurselor atunci când îi sunt adiacente. Fiecare convertor adiacent crește adaosul de viteză până la 300%, când sunt atașate 8 mașinării."
		        },
		        "hollow": {
		            "name": "Afloriment cav",
		            "description": "Atâtea găuri."
		        },
		        "strange": {
		            "name": "Stâncă cavă",
		            "description": "Arată de parcă se află aici de ceva timp."
		        },
		        "strange1": {
		            "name": "Sit de cercetare a stâncii cave",
		            "description": "Face ca Spuma Cerească să se anihileze cu 512 Piatra-iadului în loc de 64. NORD."
		        },
		        "strange2": {
		            "name": "Instalație a stâncii cave",
		            "description": "Dublează cantitatea maxima de Pietre cave și le crește rata de apariție."
		        },
		        "strange3": {
		            "name": "Stâncă reconstituită",
		            "description": "Crește dramatic rata de apariție a Pietrelor cave, și face ca apariția lor să fie silențioasă."
		        },
		        "generaldecay": {
		            "name": "Reactor general de dezintegrare",
		            "description": "Îmbunătățește în mod dramatic performanța de dezintegrare a Chromalitelor. Nu poate fi decât unul."
		        },
		        "waypoint": {
		            "name": "Reper",
		            "description": "Teleportează cel mai apropiat Reper la tine."
		        },
		        "annihilator": {
		            "name": "Anihilator",
		            "description": "Produce Vid atunci când Piatra-Iadului și Spuma Cerească se anihilează. Are nevoie de o Piatră Cavă pentru a funcționa."
		        },
		        "flower": {
		            "name": "Floare goală",
		            "description": "Reduce șansa de deformare a timpului. Contracarează efectul unei Pietre Cave. Trebuie construită pe o Piatră Cavă. Distruge Piatra Cavă pe care este construită."
		        },
		        "fruit": {
		            "name": "Fruct gol",
		            "description": "Evoluție a Florii goale. Previne formarea Pietrelor Cave pentru a se hrăni. Produce Pietre Cave."
		        },
		        "eraser": {
		            "name": "Demolează",
		            "description": "Distruge o mașinărie returnând 50% din resursele folosite spre construirea sa."
		        },
		        "eraser2": {
		            "name": "Reciclează",
		            "description": "Reciclează o mașinărie returnând 90% din resursele folosite spre construirea sa."
		        },
		        "eraser3": {
		            "name": "Dezasamblează",
		            "description": "Dezasamblează o mașinărie returnând toate resursele folosite spre construirea sa."
		        },
		        "clicker1": {
		            "name": "Oscilator de Qanetit",
		            "description": "Îți permite să ții apăsat click pe resurse pentru a le sparge. Nu poate fi decât unul."
		        },
		        "clicker2": {
		            "name": "Oscilator de Piatra-Iadului",
		            "description": "Îmbunătățire a oscilatorului de Qanetit. Crește frecvența oscilațiilor. Nu poate fi decât unul."
		        },
		        "clicker3": {
		            "name": "Oscilator de Chromalit",
		            "description": "Îmbunătățire a oscilatorului de Piatra-Iadului. Maximizează frecvența oscilațiilor. Nu poate fi decât unul."
		        },
		        "stabilizer": {
		            "name": "Stabilizator",
		            "description": "Stabilizează un val adiacent pentru a-i folosi temporar energia."
		        },
		        "stabilizer2": {
		            "name": "Stabilizator II",
		            "description": "Actualizare la stabilizator. Îmbunătățește stabilitatea și performanța."
		        },
		        "stabilizer3": {
		            "name": "Stabilizator Fracturat",
		            "description": "Îmbunătățire anomală. Îmbunătățește performanța și maximizează stabilitatea. Poate exista doar una."
		        }
		    },
		    "messages": [
		        "Unde ești?",
		        "Îs efectiv în mijlocul nicăieriului",
		        "Ok, și ce poți să vezi?",
		        "Sincer, nu multe. E aici o mașinărie, mi se pare cunoscută da nu reușesc să-mi dau seama de ce",
		        "Ce mașinărie?",
		        "Stai puțin, cred că pot să...",
		        "Stai, NU-mi spune că atingi nu știu ce mașinărie de care nu știi ce-i cu ea!",
		        "Merge! Tocmai ce-a creat ceva",
		        "???",
		        "Un cub negru imens. E atât de neted. Simt nevoia să-l sparg",
		        "Te-ai drogat?",
		        "Acum am 64 de pietre!",
		        "Ok, bine atunci. Distracție plăcută.",
		        "Hei, am găsit o piatră galbenă!",
		        "Bravo ție, frate!",
		        "Cred că acum pot să și construiesc mașinării. Ar trebui să construiesc ceva ce m-ajută să sparg cuburile astea mai ușor. Daca un cub apare într-o celulă adiacentă, chiar și pe diagonală, ar trebui să meargă.",
		        "Stai, ce? Ce joc dubios te joci? Începi să mă sperii",
		        "Acum mai rămâne doar să bag o piatră galbenă din astea în mașinărie.",
		        "Ce te-or face și pe tine fericit... Dar pe bune acum, mai vii azi?",
		        "Cu siguranță! Am să fiu acolo în câteva ore, doar lasă-mă să termin asta mai întâi.",
		        "Ce faci mai exact?",
		        "Îți dau mesaj mai târziu. Trebuie să apăs pe mașinărie în continuare, scuze.",
		        "Cred că mașinăriile se influențează una pe alta atunci când sunt plasate în celule adiacente sau diagonale. De exemplu, acest ventilator trebuie să fie pus lângă prima mașinărie pentru a grăbi procesul.",
		        "Sigur, așa-i. N-am înțeles nimic din ce zici",
		        "Deci?",
		        "Unde ești?",
		        "Hai, că te tot așteptăm de-o groază de timp.",
		        "Adică? Eu încă-s aici.",
		        "UNDE???",
		        "Acum am și o piatră albastră. Sau oare o fi mov? Sună ca un fel de candelabru de alamă din ăla vintage. Cred c-aș putea s-o folosesc ca să scap de mașinăriile puse prost.",
		        "Îți bați joc de mine? Credeam că zici că vii. Ce dracu’, pe bune acuma?!",
		        "Calmează-te frate, vin și eu imediat",
		        "Wow, pot folosi [Q] ca să clonez mașinăriile sau ca să le distrug daca apăs pe o celulă liberă mai întâi! Și [Alt] mă lasă să văd în spatele mașinăriilor înalte.",
		        "HAIDE, BAGĂ",
		        "Mai sunteți acolo?",
		        "SĂ-MI BAG PULA",
		        "Unde ești????",
		        "Ești ok??",
		        "????",
		        "Ce dracu’?",
		        "EȘTI OK? UNDE EȘTI?",
		        "Calmează-te! Sunt bine, ce s-a întâmplat?",
		        "Tu să-mi spui! Mă tot lași pe seen de două săptămâni de-acuma! Am și venit pe la tine de câteva ori, dar nu erai. Doar spune-mi unde ești, atât. Ești acasă?",
		        "Frate, ce tot zici? Efectiv am vorbit acum două minute.",
		        "CE-I ÎN NEREGULĂ CU TINE??? Mai întâi nici nu-ți dai prezența, și după dispari complet. Și acum te faci că nu s-a întâmplat nimic!",
		        "Nu te-ntreb nimic complicat",
		        "UNDE EȘTI?",
		        "Aici.",
		        "U N D E",
		        "Stai puțin...",
		        "Pe bune, nu-i amuzant. Unde ești mai exact? Poți să-mi spui măcar atât?",
		        "Păi...",
		        "Sincer nu știu.",
		        "Dă-mi o secundă",
		        "Cum adică nu știi?",
		        "Am nevoie să mă gândesc",
		        "E totul în regulă? Ești în siguranță? Să sun pe cineva?",
		        "Nu, nu, îs ok, doar că...",
		        "Îți dau mesaj imediat",
		        "Pe bune, chiar mă îngrijorezi. Ce se întâmplă?",
		        "Mi-e frică",
		        "Se pare că nu știu unde mă aflu",
		        "E atât de ciudat. Gen, e totul în regulă. Dar cumva nu pot descrie locul ăsta.",
		        "E ca un vis, dar cumva nu-i nici vis. Totul e în alb și am și mașinăriile astea cu mine. Și cuburi. N-are nici un sens.",
		        "Să clarific, nu-s drogat și n-am luat nimic. Doar ce am realizat cât de dubios e faptul că n-am realizat că toată chestia asta pare efectiv ireală.",
		        "Am găsit pietre roșii, și am realizat cât de ciudat e faptul că sunt total ok cu toate chestiile astea. Ok, sigur, e doar o piatră roșie, totu-i ok.",
		        "Deci chiar nu glumești...",
		        "Știu cum sună. Dar da, tot ce-am zis; sunt toate aici.",
		        "Pot să te ajut cu ceva?",
		        "Doar să-mi vorbești, atât.",
		        "Sigur, sigur. Apropo, te caută poliția. Ca și cum ai dispărut, gen.",
		        "Le-ai arătat mesajele?",
		        "Nu prea văd cum ar ajuta. Nu, am dat pe auto-delete.",
		        "Mersi!",
		        "Cum merge?",
		        "Păi, se pare că pot să mă mișc cu tastele WASD. Dar nu-i nimic interesant pe-aici în afară de stânca asta dubioasă în nord.",
		        "Deci busola telefonului merge chiar și acolo!",
		        "Păi, e în „sus”, așa c-am presupus că ăla o fi nordul.",
		        "Are sens",
		        "Chestia e că n-am telefon la mine...",
		        "Atunci cum trimiți mesaje?",
		        "Nu știu!! Doar știu când îmi dai tu mesaj. Și că eu pot să-ți răspund! Nu-i știu cum să explic.",
		        "Nu te-ngrijora. Putem vorbi, măcar atât.",
		        "Ai dreptate, așa-i.",
		        "Așa... Spune-mi despre mașinării",
		        "Adică?",
		        "Ce sunt, ce fac, cum funcționează?",
		        "Păi, arată relativ elegant, cu niște cabluri și fire și chestii gen",
		        "Una, de exemplu, arată ca o carcasă de plastic cu o bobină de cupru, în care poți băga una dintre pietrele astea albastre. Apoi pe-o parte are o eticheta „E—01SR\", cu o altă etichetă mai mică „Atenție! Radiație entropică puternică\" lângă ea",
		        "Și ce înseamnă radiația asta?",
		        "Nu știu, sincer. „Radiație entropică”, ce-o mai însemna și asta.",
		        "Stai, credeam că tu ai făcut mașinăriile astea.",
		        "A, ok... Înțeleg la ce te referi.",
		        "Pur și simplu le fac din cuburi, cumva. Dar n-am nici o idee ce-i înăuntru. Da, știu că sună dubios, lasă-mă să mă gândesc mai bine.",
		        "Apropo, pietrele galbene și albastre nu-s infinite, așa că mă gândesc c-ar trebui să investesc in mașinăriile astea de convertit, sau poate o nouă mină.",
		        "Sună super, bagă",
		        "Ce tâmpenie!",
		        "Ce?",
		        "O piatră verde! Îmi ia ani de zile să le sparg. Trebuie să mă gândesc la o soluție dacă o să tot apară așa.",
		        "Îs convins c-ai să faci nu știu ce mașinărie faină și treci peste!",
		        "Păi da nu?",
		        "Așa da! Aveți grijă, pietre verzi.",
		        "Hai că poți!",
		        "Mai ții minte că mă întrebasei de mașinării?",
		        "Da",
		        "Nu cred că-s reale",
		        "Adică?",
		        "E ca într-un vis. Nu pot să mă uit înăuntrul lor, nici măcar dintr-o parte.",
		        "O reprezentare vagă a tehnologiei inexplicabile",
		        "Cred că arată așa pur și simplu prin prisma modului în care le percep eu funcția.",
		        "Cum ar fi, gen, dacă ceva taie copaci atunci ar trebui să arate ca un topor?",
		        "Ceva de genu",
		        "Păi, mie tu-mi suni destul de real",
		        "Da, presupun că ești singura chestie de care nu mă îndoiesc momentan",
		        "Am găsit cuburi noi, care cumva se descompun în alte cuburi!",
		        "Nu-i nici de bine, nici de rău",
		        "Am ceva foarte ciudat de spus",
		        "Vezi ironia în ceea ce ai spus, nu?",
		        "Poate e din cauza locului ăsta, dar cumva am reușit să-ți uit numele",
		        "Ei bine, presupun că am putea petrece puțin mai mult timp împreună",
		        "Vorbesc serios",
		        "Mă cheamă Duke Nukem, evident.",
		        "Pe bune, gata!",
		        "Spuse ea!",
		        "Nu-ți mai bate joc! Pe bune, ce se întâmplă?",
		        "La naiba",
		        "Se pare că nici eu nu mai știu cum mă cheamă",
		        "Pur si simplu nu reușesc! Ce situație de câcat. Nici pe al tău nu mi-l mai amintesc!",
		        "O fi vreun caz de isterie în masă? Am auzit că poate afecta mai multe persoane deodată. Eu zic să ne calmăm și vedem ce se-ntâmplă.",
		        "Da hai, isterie, sigur",
		        "Tot nu-mi amintesc niciun nume",
		        "Nici eu. Și mai e ceva",
		        "Da! Eu cum arăt? Când ne-am întâlnit?",
		        "Cum arată casa mea, cine ne sunt prietenii? Ne-am întâlnit noi vreodată cu adevărat?",
		        "Se pare că ne-am prins amândoi în același câcat. Și nici nu pot să-mi dau seama dacă lucrurile au fost așa din totdeauna sau dacă s-o fi întâmplat ceva la un moment dat. O fi ăsta vreun vis ciudat? Și dacă da, cine-l visează?",
		        "Ți-o apărut vreo mașinărie, ceva? Poate vreun cub?",
		        "Amuzant",
		        "Ok, atunci hai să ne facem noi niște nume.",
		        "Tu suni ca un Veen",
		        "De ce nu",
		        "N-am nimic împotrivă cu Veen",
		        "Cf Veen. Ești gospodin, Veen? Mi se pare că sună ok.",
		        "Iar tu ai să fii Charps",
		        "Ok, la asta nu-i găsesc rimă",
		        "Sună ok?",
		        "Îmi place Charps. Încântat de cunoștința, Veen",
		        "De asemenea, Charps",
		        "CE SE ÎNTÂMPLĂ",
		        "Ce?",
		        "Cuburi albe! Le distrug pe alea verzi!",
		        "Sunt o groază de cuburi care se descompun! Zici că-i reactor nuclear!",
		        "Doamne, ești ok?",
		        "Da, sunt ok! Doar e totul vraiște. Trebuie să fac ceva în legătură cu asta. Poate c-ar trebui să mai trag un ochi la piatra aia din nord.",
		        "Fă ce știi tu să faci cel mai bine, Charps!",
		        "Sună ciudat!",
		        "Numele meu, da, sună. Sunt sigur c-o să mă obișnuiesc la un moment dat. Nu-i așa, Veen?",
		        "Așa-i! Ciudat într-adevăr.",
		        "Mai ții minte că menționasem o stâncă dubioasă în nord?",
		        "Nu, nu prea",
		        "Ok, păi, într-acolo e o stâncă. Nu mă înțelege greșit, realizez că tot ce se întâmplă aici e ciudat. Dar simt că stânca asta e mult mai ciudată decât orice altceva de-aici.",
		        "N-am înțeles ce-i cu ea deloc. Dar acum c-am decis să ma joc și eu puțin cu ea, s-a schimbat ceva în legile universului însăși!",
		        "O fi periculos?",
		        "Nu știu. Schimbarea pare să fie subtilă.",
		        "Mă întreb oare ce altceva ar putea schimba.",
		        "Ok, doar încearcă să nu distrugi din greșeală universul sau ceva.",
		        "Încerc cât pot.",
		        "Ok, asta cred c-a fost CEA mai dură piatră pe care-am întâlnit-o vreodată! Dar cred că știu cum s-o sparg mai repede acum.",
		        "Ai găsit vreo piatră nouă?",
		        "Da, cea mai ciudată de până acum",
		        "Văleu, poate că efectul asupra universului n-a fost atât de subtil pe cât credeam. Simți și tu?",
		        "Simt ce?",
		        "Ok, poate-s doar eu.",
		        "Ți s-a întâmplat cumva, din întâmplare, să-ți apară un cub imens în fața ochilor dintr-o dată?",
		        "Frigiderul se pune?",
		        "Ok, las-o baltă",
		        "Wow, cubul ăsta e negru ca bezna. Și pare cumva... altfel.",
		        "Mai altfel decât cel dinainte?",
		        "Chiar e diferit! E incredibil de rece, dar nu doare când o atingi. Ca și cum conceptul temperaturii nu i se poate aplica, sau ca și cum ar fi total inert. Nu-i făcută din materie, nu are nicio culoare sau vreo oricare altă trăsătură, dacă are sens.",
		        "Sincer, n-are.",
		        "Cred c-am înțeles. Pot folosi pietrele cave pentru a condensa materia aia neagră, așa, din nimic. Formează cristale ciudat de identice, dar care cumva n-au nicio proprietate. Și asta cumva repară anomaliile universului.",
		        "Sună ca un filtru",
		        "Exact! Se pare c-am corupt aerul la un moment dat, cumva.",
		        "Nu trebuie s-o spui cu voce tare",
		        "Am decis să dezgrop stânca aia ciudată. Poate oi găsi vreun răspuns pentru ceea ce se întâmplă. Cred că nu doar că afectează toate lucrurile astea, ci le și controlează!",
		        "De ce zici?",
		        "M-ai crede dacă ți-aș spune că pot s-o simt?",
		        "Sigur! Cred c-aș crede în practic orice în momentul ăsta. O piatră controlând universul? De ce nu!",
		        "Cred că m-apucă o criză!",
		        "Te rog să nu",
		        "Mașinăriile astea devin din ce în ce mai gălăgioase. Poate ar trebui să schimb ceva ca să le opresc. Sau să mă schimb pe mine. Sau ambele.",
		        "Așa da!",
		        "Deci? Ce-ai schimbat?",
		        "Stai, ceva nu-i bine.",
		        "Am construit o chestie din materia aia neagră. O chestie care nu-i o mașinărie. Dar a schimbat Reperele cumva.",
		        "Ce sunt reperele?",
		        "Mișcă universul în jurul tău, așa ajungi în locuri diferite.",
		        "Cum știi că se mișcă universul și nu tu?",
		        "Hmm, la asta nu m-am gândit",
		        "Cred c-am stricat universul",
		        "Nimic n-are sens!",
		        "Nici mașinăriile, nici nimic.",
		        "Sper că pot să remediez situația",
		        "Veen?",
		        "Alo, ești?",
		        "Te rog te rog te rog nu-mi fă una ca asta! Sper că doar te-ai dus să te piși sau ceva de genu.",
		        "VEEN!",
		        "CE?",
		        "Tot e ciudat.",
		        "Slavă Domnului!",
		        "Ai construit ceva nou?",
		        "Creadeam c-am stricat universul și c-ai dispărut pentru totdeauna! Eram într-un fel de dimensiune paralelă cu niște simboluri care pluteau și credeam că mă aflam efectiv printre ruinele universului. Pare să fie defapt un alt univers, sau cel puțin altă versiune a universului nostru pentru că arată asemănător. Se pare că le-am și conectat cumva.",
		        "Sună distractiv!",
		        "Distractiv? Ai citit măcar ce ți-am zis? ALT UNIVERS!!!",
		        "Trebuie să accepți că încet încet rămâi fără abilitatea de a mă surprinde.",
		        "Ok, ai dreptate",
		        "Nu e o stâncă, e o lentilă",
		        "Poate să facă totul să conveargă către un singur punct. Și când zic totul, ma refer la totul! Spațiul, timpul, toate conceptele și regulile. Totul!",
		        "Ai găsit manualul gen sau cum?",
		        "Nu știu de ce se află aici și nici nu știu de ce suntem aici. Doar cumva dintr-o dată știu ce face acum.",
		        "Deci... Ai să convergi lucrurile sau ce ziceai tu? Sau nu?",
		        "Nu știu cum. Dar poate tocmai asta-i și ideea locului ăstuia. Acum stânca pur și simplu plutește ca și cum de-aia-i și acolo.",
		        "Și după ce se-ntâmplă?",
		        "Nicio idee",
		        "Cu cât mă gândesc mai mult, cu atât îmi dau seama că nu doar mașinăriile tale nu sunt reale.",
		        "Mă întreb anumite chestii și realizez că nu pot să răspund.",
		        "Mai ții minte că te căuta poliția? Eu nu glumeam. Dar acum când mă gândesc la ce s-a intamplat, toată explicația îmi fuge.",
		        "Am mers la secția de poliție, sau i-am sunat eu? Și în secție cine era? Polițai? Unde se află secția? Și cu orașul cum e? Eu lociesc în orașul ăsta? Care-i numele orașului? În ce țară mă aflu? Măcar există vreo țară?",
		        "Nu pot răspunde la nicio întrebare, indiferent cât de simplă. Totul părea normal până când am început să-mi pun întrebări. Mi-e și frică să mai întreb.",
		        "Îmi pare rău",
		        "Să nu-ți fie, n-ai de ce. Suntem în aceeași poziție din câte pare.",
		        "Sper doar că ne dăm seama ce e poziția asta mai exact.",
		        "Și eu!",
		        "Hai să vedem cum se termină. Sper doar că nu ne aflăm într-un fel de iad sau purgatoriu etern.",
		        "Bagă, Dante!",
		        "Așa da! Cu astea ar trebui să pot să sec tot universul!",
		        "Suni ca o companie petrolieră",
		        "M-am săturat să mă tot joc cu setările ca să fac totul mai eficient, și sincer m-am săturat și de zgomot. Mașinăria asta ar trebui să schimbe tot. Apare ba chiar și în cealaltă dimensiune.",
		        "N-o fi periculos?",
		        "Conceptul de pericol e cam vag aici.",
		        "Cred c-a venit momentul să fac ceva mare.",
		        "Ce ai în gând?",
		        "Încă nu știu. Dar ar trebui să fie mare!",
		        "Ditamai mașinăria, gen?",
		        "Nu, vorbesc metaforic",
		        "Hai, fă-o!",
		        "Bag pula",
		        "Am făcut ceva greșit. Am distrus prăpastia inversă. Totul se duce pe pulă.",
		        "Tu ești ok?",
		        "Da. Dar se distrug mașinăriile! Nu pot construi nimic! Să-mi bag pula!",
		        "Stai! Poate așa trebuie să se și întâmple?",
		        "NU! N-are cum!",
		        "De unde știi?",
		        "Stai, trebuie să repar situația cumva",
		        "Totul sau nimic!",
		        "Te văd pe tine! Tocmai ce ai trecut de un castan imens, pe planeta aia ciudată într-un braț superior al galaxiei, chiar acolo.",
		        "Ba nu! Ce galaxie vorbești?",
		        "E greu să-mi dau seama de timpul exact, încă nu s-a întâmplat, probabil. Așteaptă tu pentru încă 15 miliarde de ani!",
		        "Sigur, așa-i cum zici tu. Mai treci pe la mn apropo?",
		        "Evident! Vin în câteva ore, trebuie doar să termin niște lucruri.",
		        "Ok super, ne vedem!",
		        "Dar te rog eu, Charps",
		        "Nu mai întârzia și de data asta",
		        "N-am să întârzii, Veen, promit."
		    ],
		    "credits": [
		        "Începutul",
		        "Apreciez enorm c-ai ajuns la final, unde totul începe",
		        "Ce pot să zic. Felicitări!",
		        "Doar uită-te și tu la asta:",
		        "Resurse minate în total:",
		        "Charonite:",
		        "Elmerine:",
		        "Qanetite:",
		        "Beta-Pilene:",
		        "Piatra-Iadului:",
		        "Chromalite:",
		        "Spumă Cerească:",
		        "Pietre Cave:",
		        "Viduri:",
		        "Realități:",
		        "Mașinării construite:",
		        "Mașinării distruse:",
		        "Adâncime minieră maximă în metri:",
		        "Stânca ciudată atinsă:",
		        "Dăți teleportate:",
		        "Clickuri pe cub:",
		        "Distorsionări temporale:",
		        "Timp de joc:",
		        "h",
		        "Joc creat de:<br>Oleg Danilov",
		        "Grafică suplimentară:<br>Yulia Nogteva",
		        "Editare dialog:<br>Abdurahman Zulumhanov și Anna Peterson",
		        "Publicare pe Steam:<br>Playsaurus",
		        "Testare:<br>Comunitatea Leprosorium, Abdurahman Zulumhanov, Playsaurus",
		        "SFÂRȘIT",
		        "Acum ai permisiunea mea să te duci să joci Cookie Clicker sau ceva de genul.",
		        "Muzică:<br>Shallow Anne de Jake Chudnow",
		        "Deutsch: flex 4711, Patrick Karban",
		        "Português: selfemcrowdin, Mateus Iamarino",
		        "Italiano: doralum",
		        "Español: armangar, Syunay Kamenov",
		        "Français: KjetilVion, Etienne Samson, William (Ekitchi)",
		        "Nederlands: lievevandyck",
		        "Čeština: Jakub Strelinger",
		        "Polski: PolglishPL",
		        "日本語: Winna Tolentino",
		        "한국어: Ah Lon Sin, Sumin Park, Cyberowl",
		        "简体中文：Daisy Chan, kevinlee7, YuLun",
		        "繁體中文: Daisy Chan, kevinlee7",
		        "ไทย: They say P, Phimze Pym",
		        "Magyar: Simon Dániel és Márton-Mezey Csenge",
		        "Latviešu valoda: Roberts Artūrs Bumburs (Arburo)",
		        "Română: Eric Apetrei"
		    ],
		    "explainer": [
		        "Ține apăsat.",
		        "Întotdeauna apasă click pe celula de dedesubt.",
		        "<span class=\"keyboard\">Q</span>, <span class=\"keyboard\">Esc</span> sau click-dreapta pentru a anula.",
		        "Ține <span class=\"keyboard\">Alt</span> apăsat pentru a te uita mai de aproape.",
		        "Apasă <span class=\"keyboard\">Q</span> peste o celulă goală pentru a selecta unealta de demolare.",
		        "Apasă <span class=\"keyboard\">Q</span> pe o mașinărie pentru a mai construi încă una.",
		        "WASD sau click-dreapta apăsat pentru a deplasa camera."
		    ],
		    "random": {
		        "paste": "Un cod de salvare a fost copiat în clipboard. Acum puneți-l într-un loc sigur.",
		        "toolate": "E prea târziu să salvezi ceva. Totul deja s-a întâmplat.",
		        "existed": "NOU",
		        "steamWarning": "Eroare Steam. Autosalvarea și realizările nu vor merge. Încearcă să lansezi jocul din nou."
		    }
		}

	}
}
