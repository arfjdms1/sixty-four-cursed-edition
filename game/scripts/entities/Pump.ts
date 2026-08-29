import type { ColorTriplet, ResourceAmounts, Vec2 } from '../../types/core.js'
import type { EntityHost } from './types.js'
import { Entity } from './Entity.js'
import { Sprite } from '../sprites.js'
import { Cloud } from '../ui.js'
import { Auxpump } from './Auxpump.js'
import { Cube } from './Cube.js'
import { Doublechannel } from './Doublechannel.js'
import { Valve } from './Valve.js'

export class Pump extends Entity{

	constructor(master: EntityHost){
		super(master)
		this.hitboxPriority = 2
		this.active = false
		this.basePumpSpeed = .04
		this.pumpSpeed = this.basePumpSpeed
		this.depth = 0
		this.soulPower = 1
		this.surgeBoost = 0
		this.surgeMaxTime = 3000

		this.name = `pump`

		this.doublechannel = false
		this.auxpump = false

		this.spoolup = 0
		this.spoolupSpeed = 5e-4
		this.spooldownSpeed = 2e-4
		this.online = false
		this.hold = false

		this.digSpeed = .01

		this.sprite = new Sprite({
			master: this.master,
			src: `img/channel.png`,
			mask: [0,0,455,466],
			frames: [[0,0,455,466],[455,0,455,466],[910,0,455,466],[1365,0,455,466],[1820,0,455,466],[2275,0,455,466],[2730,0,455,466],[3185,0,455,466],[3640,0,455,466],[4095,0,455,466], [0,466,455,466],[455,466,455,466],[910,466,455,466],[1365,466,455,466],[1820,466,455,466],[2275,466,455,466],[2730,466,455,466],[3185,466,455,466],[3640,466,455,466],[4095,466,455,466]],
			origins: [227, 335],
			scale: 1,
			sequences: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19],
			intervals: 100
		})

		this.initHint()
		this.initSellHint()

	}

	boost(){
		this.surgeTimer = this.surgeMaxTime
	}

	getHint(){
		return this.hint
	}

	initHint(){
		this.hint = new Cloud(this.master)
		this.hint.addDynamicText(()=>Math.floor((this.depth || 0) * 10) + `m`)//zzz Maybe localize?
		this.hint.addProgress(()=>(this.depth || 0) * 10 % 1)
		this.hint.addDescription(`<b>${this.master.words.entities[this.name].name}</b><br/>${this.master.words.entities[this.name].description}`)
		this.hint.addQEString(true,false)
	}

	// Duplicate onDelete method removed (overwritten at line 3157)

	canHit(){
		return true
	}

	getProbability(point: number = 0, spread: number = 0, value: number = 0, span: number = 0){
		if ((this.depth || 0) < point - spread || (this.depth || 0) > point + spread + span) return 0
		if (!spread && span) return value
		if (span) return (this.depth || 0) < point ? value * (.5 * Math.cos(((this.depth || 0) - point) * (Math.PI / spread)) + .5) : (this.depth || 0) > point + span ? value * (.5 * Math.cos(((this.depth || 0) - point - span) * (Math.PI / spread)) + .5) : value
		return value * (.5 * Math.cos(((this.depth || 0) - point) * (Math.PI / spread)) + .5)
	}

	TESTgetProbability(d: number = 0, point: number = 0, spread: number = 0, value: number = 0, span: number = 0){
		if (d < point - spread || d > point + spread + span) return 0
		if (!spread && span) return value
		if (span) return d < point ? value * (.5 * Math.cos((d - point) * (Math.PI / spread)) + .5) : d > point + span ? value * (.5 * Math.cos((d - point - span) * (Math.PI / spread)) + .5) : value
		return value * (.5 * Math.cos((d - point) * (Math.PI / spread)) + .5)
	}

	TESTgetRP(d: number){
		let psum = 0
		const probs = []
		for (let i = 0; i < this.master.codex.resources.length; i++){

			if (this.master.codex.resources[i].chances){
				const c = this.master.codex.resources[i].chances as Array<{ type: number; mean?: number; stdev?: number; base?: number; from?: number; to?: number }> | undefined
				let p = 0

				if (c) for (let j = 0; j < c.length; j++){
					const item = c[j]
					if (item && item.type === 0){
						const mean = item.mean || 0
						const stdev = item.stdev || 1
						const base = item.base || 0
						p = Math.max(p, base * Math.exp(-.5 * ((d - mean) / stdev) ** 2) / (stdev * (Math.PI * 2) ** .5))
					} else if (item && item.type === 1){
						p = Math.max(p, (d >= (item.from || 0) && d <= (item.to || 0)) ? (item.base || 0) : 0)
					}

				}

				psum += p
				probs.push(p)
			} else {
				probs.push(0)
			}

		}

		for (let i = 0; i < probs.length; i++){

			probs[i] /= psum

		}

		return probs

	}

	TESTgetRP2(d: number){
		let psum = 0
		const probs = []
		for (let i = 0; i < this.master.codex.resources.length; i++){

			if (this.master.codex.resources[i].chances){
				const c = this.master.codex.resources[i].probabilities as Array<{ point: number; spread: number; value: number; span: number }> | undefined
				let p = 0

				if (c) for (let j = 0; j < c.length; j++){
					const item = c[j]; if (item) p = Math.max(p, this.TESTgetProbability(d, item.point, item.spread, item.value, item.span))
				}

				psum += p
				probs.push(p)
			} else {
				probs.push(0)
			}

		}

		for (let i = 0; i < probs.length; i++){
			probs[i] /= psum
		}

		return probs

	}

	TESTgetRPGraph(){

		const canvas = document.createElement(`canvas`)
		document.body.append(canvas)
		canvas.style.display = `block`
		canvas.style.position = `absolute`
		canvas.style.top = `0`
		canvas.style.left = `0`
		canvas.style.width = innerWidth + `px`
		canvas.style.height = innerHeight + `px`
		const w = canvas.width = innerWidth * this.master.pixelRatio
		const h = canvas.height = innerHeight * this.master.pixelRatio
		const ctx = canvas.getContext(`2d`)
		if (!ctx) return

		ctx.fillRect(0,0,w,h)

		const power = 1
		const depth = [1000, 10000]
		const ddepth = depth[1] - depth[0]
		const dx = w/ddepth

		ctx.lineWidth = this.master.pixelRatio

		//AXES
		ctx.strokeStyle = `#FFF2`
		for (let i = 0; i < ddepth; i+=1000){
			const x = dx * i

			ctx.beginPath()
			ctx.moveTo(x, 0)
			ctx.lineTo(x, h)
			ctx.stroke()

		}

		for (let i = 0; i < 1; i+=.05){
			
			const y1 = h/2 - i * h/2
			const y2 = h - i * h/2

			ctx.beginPath()
			ctx.moveTo(0, y1)
			ctx.lineTo(w, y1)
			ctx.stroke()

			ctx.beginPath()
			ctx.moveTo(0, y2)
			ctx.lineTo(w, y2)
			ctx.stroke()

		}

		//OLD
		let prevs = this.TESTgetRP(depth[0])
		for (let i = 1; i < ddepth; i++){

			const p = this.TESTgetRP(depth[0] + i)
			const x = dx * i

			for (let j = 0; j < p.length; j++){

				ctx.strokeStyle = this.master.codex.resources[j].triplet[0]
				ctx.beginPath()
				ctx.moveTo(x - dx, h/2 - h/2 * prevs[j] ** power)
				ctx.lineTo(x, h/2 - h/2 * p[j] ** power)
				ctx.stroke()

			}

			prevs = p

		}

		//NEW
		prevs = this.TESTgetRP2(depth[0])
		for (let i = 1; i < ddepth; i++){

			const p = this.TESTgetRP2(depth[0] + i)
			const x = dx * i

			for (let j = 0; j < p.length; j++){

				ctx.strokeStyle = this.master.codex.resources[j].triplet[0]
				ctx.beginPath()
				ctx.moveTo(x - dx, h - h/2 * prevs[j] ** power)
				ctx.lineTo(x, h - h/2 * p[j] ** power)
				ctx.stroke()

			}

			prevs = p

		}


	}

	TESTgetDistribution(){

		const tst = [10,2,3,20,0,1,60]

		const DEPTH = 90000
		const heap = new Array(10).fill(0)

		for (let d = 0; d < DEPTH; d++){

			let sum = 0
			const slice = new Array(10).fill(0)

			for (let i = 0; i < 10; i++){

				const c = this.master.codex.resources[i].probabilities as Array<{ point: number; spread: number; value: number; span: number }> | undefined
				if (!c) continue

				let v = 0
				if (c) for (let j = 0; j < c.length; j++){
					let vv
					if (d < c[j].point - c[j].spread || d > c[j].point + c[j].spread + c[j].span){
						vv = 0
					} else if (!c[j].spread && c[j].span){
						vv = c[j].value
					} else if (c[j].span){
						vv = d < c[j].point ? c[j].value * (.5 * Math.cos((d - c[j].point) * (Math.PI / c[j].spread)) + .5) : d > c[j].point + c[j].span ? c[j].value * (.5 * Math.cos((d - c[j].point - c[j].span) * (Math.PI / c[j].spread)) + .5) : c[j].value
					} else {
						vv = c[j].value * (.5 * Math.cos((d - c[j].point) * (Math.PI / c[j].spread)) + .5)
					}
					v = Math.max(v, vv)
				}
				sum += v
				slice[i] = v
			}

			for (let i = 0; i < 10; i++){
				heap[i] += slice[i] / sum / DEPTH
			}

		}

		return heap

	}

	getResource(){

		let psum = 0
		const probs = []

		for (let i = 0; i < this.master.codex.resources.length; i++){

			if (this.master.codex.resources[i].probabilities){
				const c = this.master.codex.resources[i].probabilities as Array<{ point: number; spread: number; value: number; span: number }> | undefined
				let p = 0

				if (c) for (let j = 0; j < c.length; j++){
					const item = c[j]; if (item) p = Math.max(p, this.getProbability(item.point, item.spread, item.value, item.span))
				}

				psum += p
				probs.push(p)
			} else {
				probs.push(0)
			}

		}

		const rn = Math.random()
		let acc = 0
		let rid = this.master.codex.resources.length - 1

		for (let i = 0; i < probs.length; i++){

			const p = probs[i] / psum
			acc += p
			if (rn < acc) {
				rid = i
				break
			}

		}

		return rid

	}

	init(){

		this.master.pumps.add(this)
		this.checkForModifiers()
	}

	onDelete(){
		this.master.pumps.delete(this)
	}

	checkForModifiers(){

		let speedmult = 0
		this.auxes = []

		let locked = this.master.stats.totalResourcesMined[2] < 1 && this.name !== `pump2`

		for (let i = 0; i < this.soi.length; i++){

			const cell = this.master.stuffMap[`u${this.position[0] + this.soi[i][0]}v${this.position[1] + this.soi[i][1]}`]

			if (cell){
				if (cell instanceof Doublechannel){
					speedmult += cell.value
				} else if (cell instanceof Auxpump){
					this.auxes.push(cell)
				} else if (cell instanceof Cube){
					locked = false
				}
			} else {
				locked = false
			}

		}

		this.pumpSpeed = this.basePumpSpeed * (1 + speedmult)
		this.doublechannel = speedmult
		if (locked){
			this.master.gameIsLocked = true
		}

	}

	onmousedown(){
		this.active = true
	}

	onmouseup(){
		this.active = false
	}

	update(dt?: number){

		if (this.surgeTimer){

			if (dt) this.surgeTimer -= dt
			if (this.surgeTimer < 0){
				this.surgeTimer = 0
			}
			this.surgeBoost = (this.surgeTimer / this.surgeMaxTime) ** 2 * 8

		}

		let work = false
		if ((this.master.hoveredEntity as unknown) !== this) this.onmouseup()

		//Check aux pumps for initiating
		let totalspeed = this.active ? this.pumpSpeed : 0
		let auxSpeed = 0
		let activeAuxes = []
		if (this.auxes?.length){
			for (let i = 0; i < this.auxes.length; i++){
				const aux = this.auxes[i] as { tap?: (n: number) => number } | undefined;
				const ping = aux?.tap?.(0) || 0;
				if (ping) {
					activeAuxes.push(this.auxes[i])
					if (!this.active) auxSpeed = Math.max(ping, auxSpeed)
				}
			}
		}
		totalspeed += (auxSpeed + this.surgeBoost) * this.pumpSpeed

		if (totalspeed){

			work = true

			//Spooling?
			if (this.spoolup < 1){
				this.spoolup = Math.min(1, this.spoolup + this.spoolupSpeed * (dt || 0))
				if (!this.active){
					for (let i = 0; i < activeAuxes.length; i++){
						(activeAuxes[i] as { tap?: (n: number) => number })?.tap?.((dt || 0) / activeAuxes.length)
					}
				}
			} else {
				const spotIds = []
				let cubes = []

				//Check for existing cubes
				for (let i = 0; i < this.soi.length; i++){

					const p: Vec2 = [this.position[0] + this.soi[i][0], this.position[1] + this.soi[i][1]]
					const cell = this.master.entityAtCoordinates(p)

					if (cell && cell instanceof Cube && cell.state === 0 && cell.pump === this){
						cubes.push(cell)
					//Preventing aux lock for building
					} else if (!cell && !(this.master.itemInHand && ((this.master.hoveredCell as Vec2)[0]) === p[0] && ((this.master.hoveredCell as Vec2)[1]) === p[1])){
						spotIds.push(i)
					}

				}

				//Update cubes
				if (cubes.length){
					const quantity = totalspeed / cubes.length * (dt || 0)
					for (let i = 0; i < cubes.length; i++){
						this.pumpTo(cubes[i] as { accept?: (q: number) => boolean }, quantity)
					}
					if (!this.active){
						for (let i = 0; i < activeAuxes.length; i++){
							(activeAuxes[i] as { tap?: (n: number) => number })?.tap?.((dt || 0) / activeAuxes.length)
						}
					}
				
				//Or initiating new
				} else if (spotIds.length){

					const id = spotIds[Math.floor(Math.random() * spotIds.length)]
					const spotPosition: Vec2 = [this.position[0] + this.soi[id][0], this.position[1] + this.soi[id][1]]
					const resources = []
					for (let r = 0; r < 64; r++){
						resources.push(this.getResource())
					}
					this.master.addEntity(`cube`, spotPosition, {pump: this, resources: resources})
					this.master.processMousemove()

				} else {
					work = false
				}
			}


		} else {

			//Check for valve
			this.hold = false

			if (this.spoolup){
				for (let i = 0; i < this.soi.length; i++){

					// const cell = this.master.stuffMap[`u${this.position[0] + this.soi[i][0]}v${this.position[1] + this.soi[i][1]}`]
					const cell = this.master.entityAtCoordinates([this.position[0] + this.soi[i][0], this.position[1] + this.soi[i][1]] as Vec2)

					if (cell && cell instanceof Valve && cell.state === 2){
						(cell as unknown as { tap?: (d?: number) => void })?.tap?.(dt)
						this.hold = true
						break
					}

				}
			}

			if (!this.hold){
				this.spoolup = Math.max(0, this.spoolup - this.spooldownSpeed * (dt || 0))
			}

		}

		if (work){
			if (!this.sfxPlaying){
				const screenxy = this.master.uvToXYUntranslated(this.position)
				const pan = this.master.getPanValueFromX(screenxy[0])
				const loudness = this.master.getLoudnessFromXY(screenxy)
				this.sfxPlaying = this.master.startSound(`rumble`, pan, loudness)
			}
		} else {
			if (this.sfxPlaying){
				this.master.stopSound(this.sfxPlaying, 3)
				delete this.sfxPlaying
			}
		}

	}

	pumpTo(c: { accept?: (q: number) => boolean }, q: number){
		const flow = c.accept ? c.accept(q) : false
		if (flow){
			this.depth += this.digSpeed * q / (1 + this.depth ** .7)
			this.master.currentlyExtracting = 1
			this.master.stats.maxDepth = Math.max(this.master.stats.maxDepth, this.depth) || 0
		}
	}

	render(dt?: number, vposition?: Vec2){

		const position = vposition ? vposition : this.position

		if (position) {

			this.sprite.renderState(position, this.spoolup)

			// const ctx = ctx
			// const unit = this.master.unit
			// const xy = this.master.uvToXY([position[0] - .85, position[1] - 1.25])
			// const step = unit * .12

			// ctx.font = step + `px Verdana`
			// ctx.textAlign = `left`
			// ctx.textBaseline = `middle`
			// ctx.fillStyle = `#000`
			// ctx.fillText(Math.floor(this.depth*10) + `m`, xy[0], xy[1])

			// ctx.lineCap = `round`
			// ctx.lineWidth = unit * .04

			// ctx.strokeStyle = `#EEE`
			// ctx.beginPath()
			// ctx.moveTo(xy[0], xy[1] + step)
			// ctx.lineTo(xy[0] + unit/4, xy[1] + step)
			// ctx.stroke()

			// ctx.strokeStyle = `#000`
			// ctx.beginPath()
			// ctx.moveTo(xy[0], xy[1] + step)
			// ctx.lineTo(xy[0] + unit * (this.depth * 10 % 1) / 4, xy[1] + step)
			// ctx.stroke()

		}
	}

}
