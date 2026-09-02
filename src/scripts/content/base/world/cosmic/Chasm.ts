import type { ColorTriplet, ResourceAmounts, Vec2 } from '../../../../../types/core.js'
import type { EntityHost } from '../../../../engine/entities/types.js'
import { Entity } from '../../../../engine/entities/Entity.js'
import { Sprite } from '../../../../sprites.js'
import { Cloud } from '../../../../ui.js'
import { Conductor } from '../../machines/industrial/Conductor.js'
import { Generaldecay } from '../anomalies/Generaldecay.js'
import { Gradient } from '../../machines/channels/Gradient.js'
import { Silo2 } from '../../machines/storage/Silo2.js'

export class Chasm extends Entity{

	constructor(master: EntityHost){
		super(master)
		this.name = `chasm`
		this.chasmNetwork = 1
		this.chasmNetworkKey = "1"
		this.chasmOrder = 0

		// this.measure = {
		// 	totalTime: 120000,
		// 	timer: 1000,
		// 	r0: false
		// }

		this.sprite = new Sprite({
			master: this.master,
			src: `resources/images/chasm.png`,
			frames: [[0,0,454,559]],
			origins: [227,428],
			scale: 1,
			sequences: [0],
			intervals: 100
		})

		this.initHint()
		this.initSellHint()

		// this.initHint()
	}

	// getHint(){
	// 	return this.hint
	// }

	// initHint(){
	// 	// this.hint = new Cloud(this.master)
	// 	// this.hint.addProgress(_=> 1 - this.measure.timer / this.measure.totalTime)
	// 	// this.hint.addResourceList(this.master.gradient)
	// 	// this.hint.addPreGradientStats()
	// }

	update(dt?: number){

		// this.measure.timer -= dt

		// if (this.measure.timer <= 0){

		// 	const exactTime = this.measure.totalTime - this.measure.timer
		// 	const r1 = [...this.master.resources]

		// 	if (this.measure.r0){
		// 		for (let i = 0; i < 10; i++){
		// 			this.master.preGradient[i] = (r1[i] - this.measure.r0[i]) / exactTime * 1000
		// 		}
		// 	}

		// 	this.measure.timer = this.measure.totalTime
		// 	this.measure.r0 = r1

		// 	this.initHint()

		// }

	}

	init(){

		this.master.chasm = this
		this.updateChain()

	}

	onDelete(){

		this.master.chasm = undefined

	}

	canHit(){return false}
	onmousedown(){
		
	}

	render(dt?: number, vposition?: Vec2){

		const position = vposition ? vposition : this.position
		this.sprite.renderState(position, 0)

	}

	updateChain(){

		this.chasmNetworkKey = String(Number(this.chasmNetworkKey || 0) + 1)
		this.chasmNetwork = this.chasmNetworkKey
		this.chasmPath = []

		const queue = []
		queue.push(this)

		for (let safe = 0; safe < 1e3; safe++){

			const specimen = queue.shift() as unknown as { soi: Vec2[]; position: Vec2; chasmOrder: number; chasmPath: Vec2[] } | undefined;
			if (!specimen) break;

			for (let i = 0; i < specimen.soi.length; i+=2){
				const cell = this.context.spatial.entityAt([((specimen as unknown as { position: Vec2 }).position)[0] + specimen.soi[i][0], ((specimen as unknown as { position: Vec2 }).position)[1] + specimen.soi[i][1]])
				const condition = Boolean(cell && (cell.chasmNetwork as unknown) !== this.chasmNetworkKey && (cell instanceof Conductor || cell instanceof Silo2 || cell instanceof Gradient || cell instanceof Generaldecay))
				if (condition){
					if (cell) cell.chasmNetwork = this.chasmNetworkKey
					if (cell && specimen) (cell as unknown as { chasmOrder: number }).chasmOrder = ((specimen as unknown as { chasmOrder?: number })?.chasmOrder || 0) + 1
					if (cell && specimen) cell.chasmPath = [...(((specimen as unknown as { chasmPath?: Vec2[] })?.chasmPath || []) || []), ((specimen as unknown as { position: Vec2 }).position)]
					queue.push(cell)
				}

			}

			if (!queue.length) break
			queue.sort((a,b)=>((a as unknown as { chasmOrder: number })?.chasmOrder || 0) - ((b as unknown as { chasmOrder: number })?.chasmOrder || 0))

		}

	}

}
