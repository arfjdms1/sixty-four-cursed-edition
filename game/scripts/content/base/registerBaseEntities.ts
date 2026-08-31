import { Annihilator } from '../../entities/Annihilator.js'
import { Auxpump } from '../../entities/Auxpump.js'
import { Auxpump2 } from '../../entities/Auxpump2.js'
import { Chasm } from '../../entities/Chasm.js'
import { Clicker1 } from '../../entities/Clicker1.js'
import { Clicker2 } from '../../entities/Clicker2.js'
import { Clicker3 } from '../../entities/Clicker3.js'
import { Conductor } from '../../entities/Conductor.js'
import { Consumer } from '../../entities/Consumer.js'
import { Converter13 } from '../../entities/Converter13.js'
import { Converter32 } from '../../entities/Converter32.js'
import { Converter41 } from '../../entities/Converter41.js'
import { Converter64 } from '../../entities/Converter64.js'
import { Converter76 } from '../../entities/Converter76.js'
import { Cookie } from '../../entities/Cookie.js'
import { Cube } from '../../entities/Cube.js'
import { Destabilizer } from '../../entities/Destabilizer.js'
import { Destabilizer2 } from '../../entities/Destabilizer2.js'
import { Destabilizer2a } from '../../entities/Destabilizer2a.js'
import { Doublechannel } from '../../entities/Doublechannel.js'
import { Doublechannel2 } from '../../entities/Doublechannel2.js'
import { Entropic } from '../../entities/Entropic.js'
import { Entropic2 } from '../../entities/Entropic2.js'
import { Entropic2a } from '../../entities/Entropic2a.js'
import { Entropic3 } from '../../entities/Entropic3.js'
import { Eye } from '../../entities/Eye.js'
import { Flower } from '../../entities/Flower.js'
import { Fruit } from '../../entities/Fruit.js'
import { Generaldecay } from '../../entities/Generaldecay.js'
import { Gradient } from '../../entities/Gradient.js'
import { Hollow } from '../../entities/Hollow.js'
import { Injector } from '../../entities/Injector.js'
import { Mega1 } from '../../entities/Mega1.js'
import { Mega1a } from '../../entities/Mega1a.js'
import { Mega1b } from '../../entities/Mega1b.js'
import { Mega2 } from '../../entities/Mega2.js'
import { Mega3 } from '../../entities/Mega3.js'
import { Pinhole } from '../../entities/Pinhole.js'
import { Preheater } from '../../entities/Preheater.js'
import { Pump } from '../../entities/Pump.js'
import { Pump2 } from '../../entities/Pump2.js'
import { Reflector } from '../../entities/Reflector.js'
import { Silo } from '../../entities/Silo.js'
import { Silo2 } from '../../entities/Silo2.js'
import { Stabilizer } from '../../entities/Stabilizer.js'
import { Stabilizer2 } from '../../entities/Stabilizer2.js'
import { Stabilizer3 } from '../../entities/Stabilizer3.js'
import { Strange } from '../../entities/Strange.js'
import { Strange1 } from '../../entities/Strange1.js'
import { Strange2 } from '../../entities/Strange2.js'
import { Strange3 } from '../../entities/Strange3.js'
import { Surge } from '../../entities/Surge.js'
import { Valve } from '../../entities/Valve.js'
import { Vault } from '../../entities/Vault.js'
import { Vessel } from '../../entities/Vessel.js'
import { Vessel2 } from '../../entities/Vessel2.js'
import { Voidsculpture } from '../../entities/Voidsculpture.js'
import { Waypoint } from '../../entities/Waypoint.js'
import { baseEntityMetadata } from '../../registry/baseEntityMetadata.js'
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
