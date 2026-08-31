import { Annihilator } from './machines/industrial/Annihilator.js'
import { Auxpump } from './machines/channels/Auxpump.js'
import { Auxpump2 } from './machines/channels/Auxpump2.js'
import { Chasm } from './world/cosmic/Chasm.js'
import { Clicker1 } from './machines/clickers/Clicker1.js'
import { Clicker2 } from './machines/clickers/Clicker2.js'
import { Clicker3 } from './machines/clickers/Clicker3.js'
import { Conductor } from './machines/industrial/Conductor.js'
import { Consumer } from './machines/industrial/Consumer.js'
import { Converter13 } from './machines/converters/Converter13.js'
import { Converter32 } from './machines/converters/Converter32.js'
import { Converter41 } from './machines/converters/Converter41.js'
import { Converter64 } from './machines/converters/Converter64.js'
import { Converter76 } from './machines/converters/Converter76.js'
import { Cookie } from './world/anomalies/Cookie.js'
import { Cube } from './entities/Cube.js'
import { Destabilizer } from './machines/destabilizers/Destabilizer.js'
import { Destabilizer2 } from './machines/destabilizers/Destabilizer2.js'
import { Destabilizer2a } from './machines/destabilizers/Destabilizer2a.js'
import { Doublechannel } from './machines/channels/Doublechannel.js'
import { Doublechannel2 } from './machines/channels/Doublechannel2.js'
import { Entropic } from './machines/entropics/Entropic.js'
import { Entropic2 } from './machines/entropics/Entropic2.js'
import { Entropic2a } from './machines/entropics/Entropic2a.js'
import { Entropic3 } from './machines/entropics/Entropic3.js'
import { Eye } from './entities/Eye.js'
import { Flower } from './world/botanicals/Flower.js'
import { Fruit } from './world/botanicals/Fruit.js'
import { Generaldecay } from './world/anomalies/Generaldecay.js'
import { Gradient } from './machines/channels/Gradient.js'
import { Hollow } from './world/botanicals/Hollow.js'
import { Injector } from './machines/destabilizers/Injector.js'
import { Mega1 } from './machines/megas/Mega1.js'
import { Mega1a } from './machines/megas/Mega1a.js'
import { Mega1b } from './machines/megas/Mega1b.js'
import { Mega2 } from './machines/megas/Mega2.js'
import { Mega3 } from './machines/megas/Mega3.js'
import { Pinhole } from './world/cosmic/Pinhole.js'
import { Preheater } from './machines/converters/Preheater.js'
import { Pump } from './machines/pumps/Pump.js'
import { Pump2 } from './machines/pumps/Pump2.js'
import { Reflector } from './machines/converters/Reflector.js'
import { Silo } from './machines/storage/Silo.js'
import { Silo2 } from './machines/storage/Silo2.js'
import { Stabilizer } from './machines/stabilizers/Stabilizer.js'
import { Stabilizer2 } from './machines/stabilizers/Stabilizer2.js'
import { Stabilizer3 } from './machines/stabilizers/Stabilizer3.js'
import { Strange } from './world/monoliths/Strange.js'
import { Strange1 } from './world/monoliths/Strange1.js'
import { Strange2 } from './world/monoliths/Strange2.js'
import { Strange3 } from './world/monoliths/Strange3.js'
import { Surge } from './entities/Surge.js'
import { Valve } from './machines/channels/Valve.js'
import { Vault } from './machines/storage/Vault.js'
import { Vessel } from './machines/storage/Vessel.js'
import { Vessel2 } from './machines/storage/Vessel2.js'
import { Voidsculpture } from './world/cosmic/Voidsculpture.js'
import { Waypoint } from './world/anomalies/Waypoint.js'
import { baseEntityMetadata } from './baseEntityMetadata.js'
import type { EntityDefinition, RuntimeEntityConstructor } from '../../registry/types.js'

export const BASE_ENTITY_CONSTRUCTORS: readonly [string, RuntimeEntityConstructor][] = [
	['pinhole', Pinhole],
	['strange', Strange],
	['strange1', Strange1],
	['strange2', Strange2],
	['strange3', Strange3],
	['voidsculpture', Voidsculpture],
	['gradient', Gradient],
	['chasm', Chasm],
	['conductor', Conductor],
	['vault', Vault],
	['pump', Pump],
	['pump2', Pump2],
	['cube', Cube],
	['destabilizer', Destabilizer],
	['destabilizer2', Destabilizer2],
	['destabilizer2a', Destabilizer2a],
	['injector', Injector],
	['doublechannel', Doublechannel],
	['doublechannel2', Doublechannel2],
	['valve', Valve],
	['auxpump', Auxpump],
	['auxpump2', Auxpump2],
	['entropic', Entropic],
	['entropic2', Entropic2],
	['entropic2a', Entropic2a],
	['entropic3', Entropic3],
	['converter32', Converter32],
	['converter13', Converter13],
	['converter41', Converter41],
	['converter76', Converter76],
	['converter64', Converter64],
	['reflector', Reflector],
	['preheater', Preheater],
	['mega1', Mega1],
	['mega1a', Mega1a],
	['mega1b', Mega1b],
	['mega2', Mega2],
	['mega3', Mega3],
	['eye', Eye],
	['cookie', Cookie],
	['silo', Silo],
	['silo2', Silo2],
	['vessel', Vessel],
	['vessel2', Vessel2],
	['consumer', Consumer],
	['hollow', Hollow],
	['generaldecay', Generaldecay],
	['waypoint', Waypoint],
	['annihilator', Annihilator],
	['flower', Flower],
	['fruit', Fruit],
	['clicker1', Clicker1],
	['clicker2', Clicker2],
	['clicker3', Clicker3],
	['stabilizer', Stabilizer],
	['stabilizer2', Stabilizer2],
	['stabilizer3', Stabilizer3],
	['surge', Surge],
]

const structuralLinkage: Record<string, { isUpgradeTo?: string; onlyone?: boolean; canPurchase?: boolean }> = {
	pinhole: { isUpgradeTo: 'chasm', onlyone: true },
	strange: { canPurchase: false },
	strange1: { isUpgradeTo: 'strange', onlyone: true },
	strange2: { isUpgradeTo: 'strange1', onlyone: true },
	strange3: { isUpgradeTo: 'strange2', onlyone: true },
	voidsculpture: { onlyone: true },
	chasm: { onlyone: true },
	pump2: { isUpgradeTo: 'pump' },
	destabilizer2: { isUpgradeTo: 'destabilizer' },
	destabilizer2a: { isUpgradeTo: 'destabilizer2' },
	doublechannel2: { isUpgradeTo: 'doublechannel' },
	auxpump: { isUpgradeTo: 'valve' },
	auxpump2: { isUpgradeTo: 'auxpump' },
	entropic2: { isUpgradeTo: 'entropic' },
	entropic2a: { isUpgradeTo: 'entropic' },
	entropic3: { isUpgradeTo: 'entropic2' },
	mega1: { onlyone: true },
	mega1a: { isUpgradeTo: 'mega1', onlyone: true },
	mega1b: { isUpgradeTo: 'mega1a', onlyone: true },
	mega2: { onlyone: true },
	mega3: { isUpgradeTo: 'mega2', onlyone: true },
	eye: { onlyone: true },
	cookie: { canPurchase: false },
	silo2: { isUpgradeTo: 'silo' },
	vessel2: { isUpgradeTo: 'vessel' },
	hollow: { canPurchase: false },
	generaldecay: { onlyone: true },
	flower: { isUpgradeTo: 'hollow' },
	fruit: { isUpgradeTo: 'flower' },
	clicker1: { onlyone: true },
	clicker2: { isUpgradeTo: 'clicker1', onlyone: true },
	clicker3: { isUpgradeTo: 'clicker2', onlyone: true },
	stabilizer2: { isUpgradeTo: 'stabilizer' },
	stabilizer3: { canPurchase: false },
	surge: { canPurchase: false },
}

export function getBaseEntityDefinitions(): EntityDefinition[] {
	const metaMap = new Map(baseEntityMetadata.map(m => [m.id, m]))

	return BASE_ENTITY_CONSTRUCTORS.map(([id, constructor]) => {
		const meta = metaMap.get(id)
		if (!meta) throw new Error(`Missing base entity metadata for ${id}`)
		const link = structuralLinkage[id]
		return {
			id,
			constructor,
			kind: meta.kind,
			family: meta.family,
			capabilities: meta.capabilities,
			isUpgradeTo: link?.isUpgradeTo,
			onlyone: link?.onlyone || false,
			canPurchase: link?.canPurchase !== undefined ? link.canPurchase : true,
		}
	})
}
