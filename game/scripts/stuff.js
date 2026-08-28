class Entity {

	constructor(master){
		this.master = master
		this.soi = [[0,-1], [1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]]
		this.entitySpan = 0
		this.entityHeight = 1

		this.darksprite = new Sprite({
			master: this.master,
			src: `img/symbol0${Math.floor(Math.random() * 4) + 1}.png`,
			mask: [0,0,256,256],
			frames: [[0,0,256,256],[256,0,256,256],[512,0,256,256]],
			origins: [128, 256],
			scale: .7,
			sequences: [0,1,2],
			intervals: 80
		})

		this.soul = 1
		this.soulPower = 0

		this.hints = []

	}

	//HINT STUFF

	getHint(){
		// return this.state === 0 ? this.hints[0] : this.state === 2 ? this.hints[1] : false
		return this.state === 0 ? this.hints[0] : this.state === 2 ? this.hints[1] : this.master.altActive ? this.hints[0] : false
	}
	getDarkHint(){
		return false
	}
	getSellHint(){
		return this.sellHint || false
	}
	initHint(){
		this.hints = [new Cloud(this.master), new Cloud(this.master)]
		if (this.fuel) {
			if (this.conversion !== undefined){
				// this.hints[0].addResourceList(this.fuel)
				this.hints[0].addConvertersOutput(this.fuel, this.getConversionOutput.bind(this))
			} else {
				this.hints[0].addResourceList(this.fuel)
			}
			
		}
		if (this.conversion !== undefined){
			this.hints[1].addProgress(_=>this.conversion)
		} else if (this.fill !== undefined) {
			this.hints[1].addProgress(_=>this.fill)
		}

		const description = `<b>${this.master.words.entities[this.name]?.name}</b><br/>${this.master.words.entities[this.name]?.description}`
		this.hints[0].addDescription(description)
		this.hints[1].addDescription(description)

		const qHint = this.master.codex.entities[this.name].canPurchase && !this.master.codex.entities[this.name].onlyone
		const eHint = this.master.canRelocate(this)
		if (qHint || eHint){
			this.hints[0].addQEString(qHint,eHint)
			this.hints[1].addQEString(qHint,eHint)
		}
		
	}
	initSellHint(){
		this.sellHint = new Cloud(this.master)
		this.sellHint.addSellIcon()
		this.sellHint.addLine()
		this.sellHint.addRefundList(this.name)
	}

	shootExhaust(){

		const screenxy = this.master.uvToXYUntranslated(this.position)
		const pan = this.master.getPanValueFromX(screenxy[0])
		const loudness = this.master.getLoudnessFromXY(screenxy)
		this.master.playSound(`exhaust`, pan, loudness)
		this.master.createExhaust(this.position, this.master.codex.resources[this.fuel.length - 1].triplet[1])

	}

	update(){}
	render(){}
	init(){}
	onmousedown(){}
	onmouseup(){}
	onDelete(){}

	updateSoul(dt){
		if (this.soul < 1){
			this.soul += 1e-5 * dt
			if (this.soul > 1) this.soul = 1
		}
	}

	darkrender(dt, vposition){
		const position = vposition ? vposition : this.position
		const ctx = this.master.ctx
		// const xy = this.master.uvToXY(position)
		ctx.save()
		// ctx.translate(xy[0], xy[1])
		ctx.globalAlpha = this.soul
		this.darksprite.render(position, dt, false, .5 + this.soulPower ** .2)
		ctx.restore()
	}

	ondarkhover(){
		if (this.soul === 1){

			const screenxy = this.master.uvToXYUntranslated(this.position)
			const pan = this.master.getPanValueFromX(screenxy[0])
			const loudness = this.master.getLoudnessFromXY(screenxy)
			this.master.playSound(`soul`, pan, loudness, true)

			this.soul = 0
			if (this.master.voidsculpture) this.master.createResourceTransfer([0,0,0,0,0,0,0,0,0,this.soulPower], screenxy, this.master.uvToXYUntranslated([this.master.voidsculpture.position[0] - 1, this.master.voidsculpture.position[1] - 1]), false, [0,1])
		}
	}

	canHit(){
		return (this.state === 0)
	}
	canDarkHit(){return false}

	setPosition(uv){

		this.position = uv
		this.init()
		return this

	}

	getNeighbours(){

		const n = []

		for (let i = 0; i < this.soi.length; i++){
			n.push(this.master.stuffMap[`u${this.position[0] + this.soi[i][0]}v${this.position[1] + this.soi[i][1]}`])
		}

		return n

	}

	isConnected(){
		return this.chasmNetwork ? this.chasmNetwork === this.master.chasm?.chasmNetwork : false
	}

}

class Strange extends Entity{

	constructor(master){
		super(master)
		this.entityHeight = 3
		this.name = `strange`
		this.entitySpan = 1
		this.indestructible = true

		this.sprite = new Sprite({
			master: this.master,
			src: `img/strange.png`,
			frames: [[0,0,907,829]],
			origins: [454,566],
			scale: 3,
			sequences: [0],
			intervals: 100
		})

		this.initHint()
	}

	canHit(){
		return true
	}

	onmousedown(){
		const screenxy = this.master.uvToXYUntranslated(this.position)
		const pan = this.master.getPanValueFromX(screenxy[0])
		const loudness = this.master.getLoudnessFromXY(screenxy)
		this.master.playSound(`horn`)
		this.master.stats.strangeRockPoked++
	}

	render(dt, vposition){

		this.sprite.render(vposition ? vposition : this.position, dt)

	}

}

class Strange1 extends Entity{

	constructor(master){
		super(master)
		this.entityHeight = 3
		this.name = `strange1`
		this.entitySpan = 1
		this.indestructible = true

		this.spawnRadius = 8
		this.maxSpawnedHollows = 8
		this.spawnedHollows = 0
		this.spawnTimerBase = 80000
		this.spawnTimer = 160000

		this.soulPower = 0

		this.sprite = new Sprite({
			master: this.master,
			src: `img/strange1.png`,
			frames: [[0,0,907,1002]],
			origins: [454,741],
			scale: 3,
			sequences: [0],
			intervals: 100
		})

		this.darksprite = new Sprite({
			master: this.master,
			src: `img/vent.png`,
			frames: [[0,0,454,831]],
			origins: [227, 700],
			scale: 3,
			sequences: [0],
			intervals: 100
		})

		this.initHint()
	}

	ondarkhover(){}

	updateSoul(){this.soul = 1}

	update(dt){

		this.spawnTimer -= dt

		if (this.spawnTimer <= 0){

			this.spawnTimer = this.spawnTimerBase + Math.random() * this.spawnTimerBase * 2
			if (this.spawnedHollows < this.maxSpawnedHollows){
				this.spawnHollow()
			}

		}

	}

	spawnHollow(){

		let consumed = false

		if (this.master.fruits.size){

			for (const f of this.master.fruits){
				consumed = f.seed()
				if (consumed) break
			}

		}

		if (consumed){

			this.master.playSound(`horn`, 0, .4)

		} else {

			for (let i = 0; i < 32; i++){

				const dx = -this.spawnRadius + Math.floor(Math.random() * this.spawnRadius * 2)
				const dy = -this.spawnRadius + Math.floor(Math.random() * this.spawnRadius * 2)

				if ((dx >= -2 && dx <= 1 && dy >= -2 && dy <= 1) || (dx >= -4 && dx <= -1 && dy >= -4 && dy <= -1)) continue

				const rx = this.position[0] + dx
				const ry = this.position[1] + dy

				if (!this.master.entityAtCoordinates([rx, ry])){

					this.master.addEntity(`hollow`, [rx, ry])
					this.spawnedHollows++
					this.master.createHollowEvent(`#FFBB36`, 6000, `horn`, true)
					break

				}

			}

		}
		

	}

	init(){
		this.master.hellgemChunk = 512
		this.master.hollowSite = this
	}

	onDelete(){
		this.master.hellgemChunk = 64
	}

	canHit(){
		return true
	}

	onmousedown(){
		const screenxy = this.master.uvToXYUntranslated(this.position)
		const pan = this.master.getPanValueFromX(screenxy[0])
		const loudness = this.master.getLoudnessFromXY(screenxy)
		this.master.playSound(`horn`, pan, loudness)
		this.master.stats.strangeRockPoked++
	}

	render(dt, vposition){

		this.sprite.render(vposition ? vposition : this.position, dt)

	}

}

class Strange2 extends Strange1{

	constructor(master){
		super(master)
		this.name = `strange2`

		this.spawnRadius = 8
		this.maxSpawnedHollows = 16
		this.spawnedHollows = 0
		this.spawnTimerBase = 40000
		this.spawnTimer = 80000

		this.sprite = new Sprite({
			master: this.master,
			src: `img/strange2.png`,
			frames: [[0,0,936,994]],
			origins: [455,732],
			scale: 3,
			sequences: [0],
			intervals: 100
		})

		this.initHint()
	}

}

class Strange3 extends Strange2{

	constructor(master){
		super(master)
		this.name = `strange3`

		this.spawnRadius = 8
		this.maxSpawnedHollows = 16
		this.spawnedHollows = 0
		this.spawnTimerBase = 6000
		this.spawnTimer = 20000

		this.sprite = new Sprite({
			master: this.master,
			src: `img/strange3.png`,
			frames: [[0,0,936,994]],
			origins: [455,732],
			scale: 3,
			sequences: [0],
			intervals: 100
		})

		this.initHint()
	}

	spawnHollow(){

		let consumed = false

		if (this.master.fruits.size){

			for (const f of this.master.fruits){
				consumed = f.seed()
				if (consumed) break
			}

		}

		if (!consumed){

			for (let i = 0; i < 32; i++){

				const dx = -this.spawnRadius + Math.floor(Math.random() * this.spawnRadius * 2)
				const dy = -this.spawnRadius + Math.floor(Math.random() * this.spawnRadius * 2)

				if ((dx >= -2 && dx <= 1 && dy >= -2 && dy <= 1) || (dx >= -4 && dx <= -1 && dy >= -4 && dy <= -1)) continue

				const rx = this.position[0] + dx
				const ry = this.position[1] + dy

				if (!this.master.entityAtCoordinates([rx, ry])){

					this.master.addEntity(`hollow`, [rx, ry])
					this.spawnedHollows++
					break

				}

			}

		}

	}

	onmousedown(){
		const screenxy = this.master.uvToXYUntranslated(this.position)
		const pan = this.master.getPanValueFromX(screenxy[0])
		const loudness = this.master.getLoudnessFromXY(screenxy)
		this.master.playSound(`horn`, pan, loudness)
		this.master.stats.strangeRockPoked++

		if (this.master.pinhole && this.master.stuff.length < 3){
			this.master.watchCredits()
		}
	}

	render(dt, vposition){

		const position = vposition ? vposition : this.position
		if (vposition) {
			this.sprite.render(position, dt)
		} else {
			let delta = Math.sin(performance.now() / 6000) * .5

			this.sprite.render([position[0] + delta, position[1] + delta], dt)
		}

	}

}

class Vault extends Entity{

	constructor(master){
		super(master)
		this.entityHeight = 2
		this.name = `vault`
		this.maxExcitement = 1024
		this.excitement = 0
		this.soulPower = 16

		this.sprite = new Sprite({
			master: this.master,
			src: `img/vault.png`,
			frames: [[0,0,455,838],[455,0,455,838]],
			origins: [227,707],
			scale: 1,
			sequences: [0,1],
			intervals: 30
		})

		this.initHint()
		this.initSellHint()
	}

	tap(){
		this.excitement = this.maxExcitement
	}

	update(dt){

		if (this.excitement > 0) {
			this.excitement = Math.max(0, this.excitement - dt)
		}

	}

	render(dt, vposition){

		this.sprite.renderState(vposition ? vposition : this.position, 0)
		this.master.ctx.globalAlpha = (this.excitement / this.maxExcitement) ** 2
		this.sprite.renderState(vposition ? vposition : this.position, 1)
		this.master.ctx.globalAlpha = 1

	}

	onDelete(){

		this.master.vaults.delete(this)
		this.master.annihilationMachines.delete(this)

	}

	init(){

		this.master.vaults.add(this)
		this.master.annihilationMachines.add(this)

	}

}

class Doublechannel extends Entity{

	constructor(master){
		super(master)
		this.name = `doublechannel`
		this.value = 1
		this.soulPower = .2

		this.sprite = new Sprite({
			master: this.master,
			src: `img/double_spr.png`,
			frames: [[0,0,455,265],[455,0,455,265],[910,0,455,265]],
			origins: [226,131],
			scale: 1,
			sequences: [0,1,2],
			intervals: 30
		})

		this.initHint()
		this.initSellHint()
	}

	render(dt, vposition){

		this.sprite.render(vposition ? vposition : this.position, dt)

	}

}

class Consumer extends Entity{

	constructor(master){
		super(master)
		this.name = `consumer`
		this.resetTime = 16000
		this.timer = 0
		this.maxMultiplicator = 9
		this.multiplicator = 1
		this.resources = new Array(this.master.resources.length).fill(0)
		this.maxResourceCount = 1024
		this.resourceCount = 0
		this.bonus = .11111 // *9=1

		this.fill = 0
		this.state = 0
		this.fuel = [0,0,0,1024,0,16]
		this.soulPower = 2

		this.sprite = new Sprite({
			master: this.master,
			src: `img/consumer.png`,
			frames: [[0,0,455,423],[455,0,455,423],[910,0,455,423],[0,423,455,423],[455,423,455,423],[910,423,455,423]],
			origins: [226,292],
			scale: 1,
			sequences: [[0],[1,2,3,4,5]],
			intervals: 100
		})

		this.initHint()
		this.initSellHint()
	}

	init(){

		this.isNextToSilo = false
		for (let i = 0; i < this.soi.length; i++){
			const cell = this.master.entityAtCoordinates([this.position[0] + this.soi[i][0], this.position[1] + this.soi[i][1]])
			if (cell instanceof Silo){
				this.isNextToSilo = true
				break
			}
		}

	}

	consume(r, o){

		this.master.createResourceTransfer(r, o, this.master.uvToXYUntranslated(this.position), _=>{
			
			for (let i = 0; i < r.length; i++){
				if (r[i]){
					this.resources[i] += r[i]
					this.resourceCount += r[i]
					if (this.resourceCount >= this.maxResourceCount){
						this.release()
					}
				}
			}

		}, 3)

	}

	onDelete(){

		this.master.createResourceTransfer(this.resources, this.master.uvToXYUntranslated(this.position))

	}

	release(){

		const screenxy = this.master.uvToXYUntranslated(this.position)
		const pan = this.master.getPanValueFromX(screenxy[0])
		const loudness = this.master.getLoudnessFromXY(screenxy)
		this.master.playSound(`release`, pan, loudness)

		this.fill -= .00390625 // 1/256
		if (this.fill <= 0){
			this.fill = 0
			if (this.state === 2) this.shootExhaust()
			this.state = 0
			this.sprite.switchSequence(0)
		}
		this.timer = this.resetTime

		for (let i = 0; i < this.resources.length; i++){
			this.resources[i] = Math.floor(this.resources[i] * (1 + (this.multiplicator * this.bonus)))
		}

		this.master.createResourceTransfer(this.resources, this.master.uvToXYUntranslated(this.position))
		this.resourceCount = 0
		this.resources = new Array(this.master.resources.length).fill(0)
		this.multiplicator = Math.min(this.multiplicator + 1, this.maxMultiplicator)

	}

	update(dt){

		if (this.state === 2 && this.sprite.currentSequence === 0) this.sprite.switchSequence(1)
		this.timer = Math.max(0, this.timer - dt)
		if (this.timer === 0) {
			this.multiplicator = 1
		}

	}

	refill(){
		if (this.state === 0){

			const resources = this.master.requestResources(this.fuel, this.position, _=>{
				this.activate()
			})
			if (resources) this.state = 1

		}
	}

	activate(){
		this.fill = 1
		this.state = 2
	}

	onmousedown(){

		this.refill()

	}

	render(dt, vposition){

		const f = (this.multiplicator - 1) / this.maxMultiplicator
		this.sprite.renderState(vposition ? vposition : this.position, f)

	}

}

class Preheater extends Entity{

	constructor(master){
		super(master)
		this.name = `preheater`
		this.maxMultiplicator = 3
		this.multiplicator = 1.5

		this.fill = 0
		this.state = 0
		this.fuel = [0,0,0,65536,0,512]
		this.soulPower = 2

		this.sprite = new Sprite({
			master: this.master,
			src: `img/preheater.png`,
			frames: [[0,0,455,293],[455,0,455,293],[910,0,455,293],[1365,0,455,293]],
			origins: [226,161],
			scale: 1,
			sequences: [0,1,2,3],
			intervals: 100
		})

		this.initHint()
		this.initSellHint()
	}

	tap(){
		if (this.state === 2){
			this.fill -= 3e-6
			if (this.fill <= 0){
				this.fill = 0
				if (this.state === 2) this.shootExhaust()
				this.state = 0
				return 0
			}
			return this.multiplicator
		}
		return 0

	}

	init(){


		this.convertersNearby = 0
		this.isNextToSilo = false

		for (let i = 0; i < this.soi.length; i++){
			const cell = this.master.entityAtCoordinates([this.position[0] + this.soi[i][0], this.position[1] + this.soi[i][1]])
			if (cell && (cell instanceof Converter32 || cell instanceof Converter13 || cell instanceof Converter41 || cell instanceof Converter76 || cell instanceof Converter64) ){
				this.convertersNearby++
			} else if (cell && (cell instanceof Silo)){
				this.isNextToSilo = true
			}

		}

		this.multiplicator = .5 + 2.5 * this.convertersNearby / 8
		this.spriteState = Math.min(1, .25 + this.convertersNearby / 8 * .75)

	}

	refill(){
		if (this.state === 0){

			const resources = this.master.requestResources(this.fuel, this.position, _=>{
				this.activate()
			})
			if (resources) this.state = 1

		}
	}

	activate(){
		this.fill = 1
		this.state = 2
	}

	onmousedown(){

		this.refill()

	}

	render(dt, vposition){

		const f = this.fill ? this.spriteState : 0
		this.sprite.renderState(vposition ? vposition : this.position, f)

	}

}

class Doublechannel2 extends Doublechannel{

	constructor(master){
		super(master)
		this.name = `doublechannel2`
		this.value = 3
		this.soulPower = 1

		this.sprite = new Sprite({
			master: this.master,
			src: `img/double2.png`,
			frames: [[0,0,455,431],[455,0,455,431],[910,0,455,431]],
			origins: [226,300],
			scale: 1,
			sequences: [0,1,2],
			intervals: 30
		})

		this.initHint()
		this.initSellHint()
	}

	render(dt, vposition){

		this.sprite.render(vposition ? vposition : this.position, dt)

	}

}

class Auxpump extends Entity{

	constructor(master){
		super(master)
		this.fill = 0
		this.state = 0
		this.name = `auxpump`
		this.fuel = [0,8]
		this.soulPower = .2

		this.sprite = new Sprite({
			master: this.master,
			src: `img/auxpump.png`,
			mask: [0,0,455,507],
			frames: [[0,0,455,507]],
			backframes: [[455,0,455,507]],
			origins: [227, 376],
			scale: 1,
			sequences: [0],
			intervals: 100
		})

		this.initHint()
		this.initSellHint()
	}

	init(){
		this.isNextToSilo = false
		for (let i = 0; i < this.soi.length; i++){
			const cell = this.master.entityAtCoordinates([this.position[0] + this.soi[i][0], this.position[1] + this.soi[i][1]])
			if (cell instanceof Silo){
				this.isNextToSilo = true
				break
			}
		}
	}


	tap(dt){

		if (this.state === 2){

			this.fill -= 1e-5 * dt//2e-5 * dt
			if (this.fill <= 0){
				this.fill = 0
				if (this.state === 2) this.shootExhaust()
				this.state = 0
			}
			return .25
		}

		return 0
	}

	refill(){
		if (this.state === 0){

			const resources = this.master.requestResources(this.fuel, this.position, _=>{
				this.activate()
			})

			if (resources) this.state = 1

		}
	}

	activate(){
		this.fill = 1
		this.state = 2
	}

	onmousedown(){

		this.refill()

	}

	render(dt, vposition){

		const position = vposition ? vposition : this.position

		this.sprite.render(position, 0, true)
		if (this.fill){
			this.master.drawPrism([this.position[0] - .025 + .125, this.position[1] - .025 - .125], .5, .5 * this.fill, this.master.codex.resources[1].triplet)
		}
		this.sprite.render(position)

	}

}

class Auxpump2 extends Auxpump{

	constructor(master){
		super(master)
		this.name = `auxpump2`
		this.fuel = [0,256,0,4]
		this.soulPower = 1

		this.sprite = new Sprite({
			master: this.master,
			src: `img/auxpump1.png`,
			mask: [0,0,455,573],
			frames: [[0,0,455,573]],
			origins: [227, 440],
			scale: 1,
			sequences: [0],
			intervals: 100
		})

		this.initHint()
		this.initSellHint()
	}

	tap(dt){

		if (this.state === 2){

			this.fill -= 1.2e-6 * dt//2e-6 * dt
			if (this.fill <= 0){
				this.fill = 0
				if (this.state === 2) this.shootExhaust()
				this.state = 0
			}
			return 1
		}

		return 0
	}

	render(dt, vposition){

		const position = vposition ? vposition : this.position

		this.sprite.render(position)
		if (this.fill){
			this.master.drawPrism([position[0] - .42, position[1] + .50 - .42], .06, this.fill, this.master.codex.resources[3].triplet)
		}

	}

}

class Valve extends Entity{

	constructor(master){
		super(master)
		this.fill = 0
		this.state = 0
		this.fuel = [1]
		this.soulPower = .1

		this.name = `valve`

		this.sprite = new Sprite({
			master: this.master,
			src: `img/valve.png`,
			mask: [0,0,455,269],
			frames: [[0,0,455,269]],
			backframes: [[455,0,455,269]],
			origins: [227, 138],
			scale: 1,
			sequences: [0],
			intervals: 100
		})

		this.initHint()
		this.initSellHint()
	}

	init(){
		this.isNextToSilo = false
		for (let i = 0; i < this.soi.length; i++){
			const cell = this.master.entityAtCoordinates([this.position[0] + this.soi[i][0], this.position[1] + this.soi[i][1]])
			if (cell instanceof Silo){
				this.isNextToSilo = true
				break
			}
		}
	}

	tap(dt){
		this.fill -= 1e-5 * dt
		if (this.fill <= 0){
			this.fill = 0
			if (this.state === 2) this.shootExhaust()
			this.state = 0
		}
	}

	refill(){
		if (this.state === 0){

			const resources = this.master.requestResources(this.fuel, this.position, _=>{
				this.activate()
			})

			if (resources) this.state = 1

		}
	}

	activate(){
		this.fill = 1
		this.state = 2
	}

	onmousedown(){

		this.refill()

	}

	render(dt, vposition){

		const position = vposition ? vposition : this.position

		this.sprite.render(position, 0, true)

		if (this.fill){
			this.master.drawPrism([position[0] - .025 + .25, position[1] - .025], .25, .25 * this.fill, this.master.codex.resources[0].triplet)
		}

		this.sprite.render(position)
		
	}

}

class Injector extends Entity{

	constructor(master){
		super(master)
		this.fill = 0
		this.state = 0
		this.fuel = [0,0,64,0,32]
		this.name = `injector`
		this.soulPower = 1

		this.sprite = new Sprite({
			master: this.master,
			src: `img/injector.png`,
			mask: [0,0,455,287],
			frames: [[0,0,455,287],[455,0,455,287],[910,0,455,287]],
			origins: [227, 156],
			scale: 1,
			sequences: [[0],[1,2]],
			intervals: 60
		})

		this.initHint()
		this.initSellHint()
	}

	init(){
		this.isNextToSilo = false
		for (let i = 0; i < this.soi.length; i++){
			const cell = this.master.entityAtCoordinates([this.position[0] + this.soi[i][0], this.position[1] + this.soi[i][1]])
			if (cell instanceof Silo){
				this.isNextToSilo = true
				break
			}
		}
	}

	update(){
		if (this.state === 2 && this.sprite.currentSequence === 0) this.sprite.switchSequence(1)
	}

	tap(mult){
		this.fill -= 0.03125 * mult
		if (this.fill <= 0){
			this.fill = 0
			if (this.state === 2) this.shootExhaust()
			this.state = 0
			this.sprite.switchSequence(0)
		}
	}

	refill(){

		if (this.state === 0){

			const resources = this.master.requestResources(this.fuel, this.position, _=>{
				this.activate()
			})

			if (resources) this.state = 1

		}

	}

	activate(){
		this.fill = 1
		this.state = 2

		//Looking for something to swap
		const n = this.getNeighbours()

		for (let i = 0; i < n.length; i++){
			if (n[i] && n[i] instanceof Cube && n[i].state === 2){
				n[i].swapRandomResource(this,4)
			}
		}

	}

	onmousedown(){

		this.refill()

	}

	render(dt, vposition){

		const ctx = this.master.ctx
		const unit = this.master.unit
		const position = vposition ? vposition : this.position

		this.sprite.render(position, dt)

		if (this.fill){
			const screen = this.master.uvToXY([position[0] - .6, position[1] - .6])
			const scale = .2 + this.fill * .8
			ctx.save()
			ctx.translate(screen[0] + (Math.random() * 2 - 1) * unit * .01 + this.master.translation[0] * scale * this.master.zoom, screen[1] + (Math.random() * 2 - 1) * unit * .01 + this.master.translation[1] * scale * this.master.zoom)
			ctx.scale(scale,scale)
			this.master.resourcesSprites[4].render([0,0])
			ctx.restore()
		}

	}

}

class Entropic extends Entity{

	constructor(master){
		super(master)
		this.fill = 0
		this.state = 0
		this.power = .33
		this.interval = 1000
		this.timer = 0
		this.fuel = [0,0,1]
		this.name = `entropic`
		this.soulPower = 1

		this.sprite = new Sprite({
			master: this.master,
			src: `img/entropy.png`,
			mask: [0,0,455,335],
			frames: [[0,0,455,335],[0,335,455,335]],
			backframes: [[455,0,455,335],[455,335,455,335]],
			origins: [227, 204],
			scale: 1,
			sequences: [0,1],
			intervals: 100
		})

		this.initHint()
		this.initSellHint()
	}

	init(){
		this.isNextToSilo = false
		for (let i = 0; i < this.soi.length; i++){
			const cell = this.master.entityAtCoordinates([this.position[0] + this.soi[i][0], this.position[1] + this.soi[i][1]])
			if (cell instanceof Silo){
				this.isNextToSilo = true
				break
			}
		}
	}

	tap(){
		this.fill -= 1e-3
		if (this.fill <= 0){
			this.fill = 0
			if (this.state === 2) this.shootExhaust()
			this.state = 0
		}
	}

	refill(){
		if (this.state === 0){

			const resources = this.master.requestResources(this.fuel, this.position, _=>{
				this.activate()
			})
			if (resources) this.state = 1

		}
	}

	activate(){
		this.fill = 1
		this.state = 2
	}

	onmousedown(){

		this.refill()

	}

	update(dt){

		if (this.state === 2){

			this.timer += dt
			if (this.timer > this.interval){
				this.timer = 0

				//Find cubes to break
				for (let i = 0; i < this.soi.length; i++){

					const cell = this.master.stuffMap[`u${this.position[0] + this.soi[i][0]}v${this.position[1] + this.soi[i][1]}`]
					if (cell && cell instanceof Cube && cell.state === 2){
						this.tap()
						cell.onmousedown(this.power)
					} else if (cell && cell instanceof Gradient && cell.isConnected()){
						this.tap()
						cell.tap(this.power)
					}

				}

			}

		}

	}

	render(dt, vposition){

		const position = vposition ? vposition : this.position

		if (position) {

			this.sprite.renderState(position, this.fill ? 1 : 0, true)

			if (this.fill){
				this.master.drawPrism([position[0] - .32, position[1] - .32], .25, .25 * this.fill, this.master.codex.resources[2].triplet)
			}

			this.sprite.renderState(position, this.fill ? 1 : 0)

		}

	}

}

class Entropic2 extends Entropic{

	constructor(master){
		super(master)
		this.interval = 300
		this.fuel = [0,0,0,0,0,1]
		this.power = .66
		this.name = `entropic2`
		this.soulPower = 2

		this.sprite = new Sprite({
			master: this.master,
			src: `img/entropy2.png`,
			mask: [0,0,455,335],
			frames: [[0,0,455,335],[0,335,455,335]],
			backframes: [[455,0,455,335],[455,335,455,335]],
			origins: [227, 204],
			scale: 1,
			sequences: [0,1],
			intervals: 100
		})

		this.initHint()
		this.initSellHint()
	}

	tap(){
		this.fill -= 5e-5
		if (this.fill <= 0){
			this.fill = 0
			if (this.state === 2) this.shootExhaust()
			this.state = 0
		}
	}


	render(dt, vposition){

		const position = vposition ? vposition : this.position

		if (position) {

			this.sprite.renderState(position, this.fill ? 1 : 0, true)

			if (this.fill){
				this.master.drawPrism([position[0] - .32, position[1] - .32], .25, .25 * this.fill, this.master.codex.resources[5].triplet)
			}

			this.sprite.renderState(position, this.fill ? 1 : 0)

		}

	}

}

class Entropic2a extends Entropic{

	constructor(master){
		super(master)
		this.fuel = [0,0,0,0,0,8]
		this.power = 2
		this.name = `entropic2a`
		this.soulPower = 2

		this.candidates = []

		this.sprite = new Sprite({
			master: this.master,
			src: `img/entropy2a.png`,
			mask: [0,0,455,382],
			frames: [[0,0,455,382],[0,382,455,382]],
			backframes: [[455,0,455,382],[455,382,455,382]],
			origins: [227, 250],
			scale: 1,
			sequences: [0,1],
			intervals: 100
		})

		this.initHint()
		this.initSellHint()
	}

	update(dt){

		if (this.state === 2){

			//Find cubes to break
			for (let i = 0; i < this.soi.length; i++){

				const hash = `u${this.position[0] + this.soi[i][0]}v${this.position[1] + this.soi[i][1]}`
				const cell = this.master.stuffMap[hash]
				if (cell && cell instanceof Cube){

					if (cell.state === 2 && this.candidates[hash]){
						this.tap()
						cell.onmousedown(this.power)
						delete this.candidates[hash]
					} else if (cell.state < 2 && !this.candidates[hash]){
						this.candidates[hash] = true
					}
					
				}

			}

		}

	}

	tap(){
		this.fill -= 5e-3
		if (this.fill <= 0){
			this.fill = 0
			if (this.state === 2) this.shootExhaust()
			this.state = 0
		}
	}


	render(dt, vposition){

		const position = vposition ? vposition : this.position

		if (position) {

			this.sprite.renderState(position, this.fill ? 1 : 0, true)

			if (this.fill){
				this.master.drawPrism([position[0] - .32, position[1] - .32], .25, .25 * this.fill, this.master.codex.resources[5].triplet)
			}

			this.sprite.renderState(position, this.fill ? 1 : 0)

		}

	}

}

class Entropic3 extends Entity{

	constructor(master){
		super(master)
		this.fill = 0
		this.state = 0
		this.fuel = [0,0,0,0,0,0,0,0,1]
		this.power = 256
		this.name = `entropic3`
		this.soulPower = 4

		this.sprite = new Sprite({
			master: this.master,
			src: `img/entropy3.png`,
			mask: [0,0,455,368],
			frames: [[0,0,455,368],[0,368,455,368]],
			backframes: [[455,0,455,368],[455,368,455,368]],
			origins: [227, 236],
			scale: 1,
			sequences: [0,1],
			intervals: 100
		})

		this.initHint()
		this.initSellHint()
	}

	init(){
		this.master.annihilationMachines.add(this)
		this.isNextToSilo = false
		for (let i = 0; i < this.soi.length; i++){
			const cell = this.master.entityAtCoordinates([this.position[0] + this.soi[i][0], this.position[1] + this.soi[i][1]])
			if (cell instanceof Silo){
				this.isNextToSilo = true
				break
			}
		}
	}

	onDelete(){
		this.master.annihilationMachines.delete(this)
	}

	tap(){
		
		this.process()

		if (this.fill <= 0){
			this.fill = 0
			if (this.state === 2) this.shootExhaust()
			this.state = 0
		}
	}

	refill(){
		if (this.state === 0){

			const resources = this.master.requestResources(this.fuel, this.position, _=>{
				this.activate()
			})
			if (resources) this.state = 1

		}
	}

	activate(){
		this.fill = 1
		this.state = 2
	}

	onmousedown(){

		this.refill()

	}

	process(){
		if (this.state === 2){

			//Find cubes to break
			let cubesAround = false
			for (let i = 0; i < this.soi.length; i++){

				const cell = this.master.stuffMap[`u${this.position[0] + this.soi[i][0]}v${this.position[1] + this.soi[i][1]}`]
				if (cell && cell instanceof Cube && cell.state === 2){
					cubesAround = true
					cell.onmousedown(this.power)
				} else if (cell && cell instanceof Gradient && cell.isConnected()){
					cubesAround = true
					cell.tap(this.power)
				}

			}

			if (cubesAround) {
				this.master.createResourceExplosion([0,0,0,0,0,0,0,0,16], this.master.uvToXYUntranslated(this.position))
				this.fill -= 4e-3//0.0078125//0.015625
				if (!this.master.voidsculpture) this.master.createHollowEvent(`#60F2`,500)
			}
		}
	}

	render(dt, vposition){

		const position = vposition ? vposition : this.position

		if (position) {

			this.sprite.renderState(position, this.fill ? 1 : 0, true)

			if (this.fill){
				this.master.drawPrism([position[0] - .48, position[1] - .48], .25, .25 * this.fill, this.master.codex.resources[8].triplet)
			}

			this.sprite.renderState(position, this.fill ? 1 : 0)

		}

	}

}

class Destabilizer extends Entity{

	constructor(master){
		super(master)
		this.fill = 0
		this.state = 0
		this.fuel = [0,1]
		this.soulPower = .2

		this.name = `destabilizer`

		this.sprite = new Sprite({
			master: this.master,
			src: `img/des.png`,
			mask: [0,0,455,306],
			frames: [[0,0,455,306]],
			backframes: [[455,0,455,306]],
			origins: [227, 175],
			scale: 1,
			sequences: [0],
			intervals: 100
		})

		// this.puff = new Sprite({
		// 	master: this.master,
		// 	src: `img/puff.png`,
		// 	frames: [[0,0,210,210],[210,0,210,210],[420,0,210,210],[630,0,210,210], [0,210,210,210],[210,210,210,210],[420,210,210,210],[630,210,210,210], [0,420,210,210],[210,420,210,210],[420,420,210,210],[630,420,210,210], [0,630,210,210],[210,630,210,210],[420,630,210,210],[630,630,210,210]],
		// 	origins: [105, 170],
		// 	scale: 1,
		// 	sequences: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
		// 	intervals: 80
		// })

		this.initHint()
		this.initSellHint()
	}

	init(){
		this.isNextToSilo = false
		for (let i = 0; i < this.soi.length; i++){
			const cell = this.master.entityAtCoordinates([this.position[0] + this.soi[i][0], this.position[1] + this.soi[i][1]])
			if (cell instanceof Silo){
				this.isNextToSilo = true
				break
			}
		}
	}

	tap(mult){
		this.fill -= .0078125 * mult//.015625 * mult
		if (this.fill <= 0){
			this.fill = 0
			if (this.state === 2) this.shootExhaust()
			this.state = 0
		}
		return 1
	}

	refill(){
		if (this.state === 0){

			const resources = this.master.requestResources(this.fuel, this.position, _=>{
				this.activate()
			})
			if (resources) this.state = 1

		}
	}

	activate(){
		this.fill = 1
		this.state = 2
	}

	onmousedown(){

		this.refill()

	}

	render(dt, vposition){

		const position = vposition ? vposition : this.position

		this.sprite.render(position, 0, true)

		if (this.fill){
			this.master.drawPrism([position[0] - .025 + .27, position[1] - .025 + .02], .25, .25 * this.fill, this.master.codex.resources[1].triplet)
		}

		this.sprite.render(position, 0)

	}

}

class Destabilizer2 extends Destabilizer{

	constructor(master){
		super(master)
		this.fuel = [0,64]
		this.name = `destabilizer2`
		this.soulPower = 1

		this.sprite = new Sprite({
			master: this.master,
			src: `img/des2.png`,
			mask: [0,0,455,395],
			frames: [[0,0,455,395],[455,0,455,395],[910,0,455,395]],
			origins: [227, 264],
			scale: 1,
			sequences: [0,1,2],
			intervals: 30
		})

		this.initHint()
		this.initSellHint()
	}

	tap(mult){
		this.fill -= 7e-4 * mult //1.4e-3 * mult 
		if (this.fill <= 0){
			this.fill = 0
			if (this.state === 2) this.shootExhaust()
			this.state = 0
		}
		return 2
	}

	render(dt, vposition){


		const position = vposition ? vposition : this.position

		this.sprite.render(position, this.fill ? dt : 0)

		if (this.fill){
			this.master.drawPrism([position[0] - .44, position[1] - .34 - .44], .06, this.fill, this.master.codex.resources[1].triplet)
		}

		// this.puff.render([position[0] - .4, position[1] - .76], dt)

	}

}

class Destabilizer2a extends Destabilizer{

	constructor(master){
		super(master)
		this.fuel = [0,64,0,0,1]
		this.name = `destabilizer2a`
		this.soulPower = 2

		this.sprite = new Sprite({
			master: this.master,
			src: `img/des2a.png`,
			mask: [0,0,455,395],
			frames: [[0,0,455,395],[455,0,455,395],[910,0,455,395],[1365,0,455,395]],
			origins: [227, 264],
			scale: 1,
			sequences: [[0],[1,2,3]],
			intervals: 30
		})

		this.initHint()
		this.initSellHint()
	}

	tap(mult){
		this.fill -= 3e-3 * mult//1.2e-2 * mult
		if (this.fill <= 0){
			this.fill = 0
			this.sprite.switchSequence(0)
			if (this.state === 2) this.shootExhaust()
			this.state = 0
		}
		return 625
	}

	update(){
		if (this.state === 2 && this.sprite.currentSequence === 0) this.sprite.switchSequence(1)
	}

	render(dt, vposition){

		const position = vposition ? vposition : this.position

		this.sprite.render(position, dt)

		if (this.fill){
			const screen = this.master.uvToXY([position[0] - .25, position[1] - .48])
			const scale = .2 + this.fill * .8
			this.master.ctx.save()
			this.master.ctx.translate(screen[0] + (Math.random() * 2 - 1) * this.master.unit * .01 + this.master.translation[0] * scale * this.master.zoom, screen[1] + (Math.random() * 2 - 1) * this.master.unit * .01 + this.master.translation[1] * scale * this.master.zoom)
			this.master.ctx.scale(scale,scale)
			this.master.resourcesSprites[4].render([0,0])
			this.master.ctx.restore()
		}

	}

}

class Converter32 extends Entity{

	constructor(master){
		super(master)
		this.fill = 0
		this.conversion = 0
		this.baseConversionSpeed = 1e-5
		this.state = 0
		this.fuel = [256,0,32]
		this.name = `converter32`
		this.soulPower = 1

		this.sprite = new Sprite({
			master: this.master,
			src: `img/c31-2.png`,
			mask: [0,0,455,393],
			frames: [[0,0,455,393]],
			backframes: [[455,0,455,393]],
			origins: [227, 262],
			scale: 1,
			sequences: [0],
			intervals: 100
		})

		this.initHint()
		this.initSellHint()

	}

	getConversionOutput(){
		return [0, 256]
	}

	update(dt){

		if (this.state === 2){
			let multiplicator = 1
			for (let i = 0; i < this.preheaters.length; i++){
				// if (this.preheaters[i].state === 2){
					const tap = this.preheaters[i].tap()
					multiplicator += tap
				// }
			}
			this.conversion += (this.baseConversionSpeed + (this.baseConversionSpeed * .01 * (Math.random() * 2 - 1))) * dt * multiplicator
			if (this.conversion >= 1){
				if (this.state === 2) this.shootExhaust()
				this.state = 0
				this.conversion = 0
				this.fill = 0
				this.master.activeConverters.delete(this)
				const screenxy = this.master.uvToXYUntranslated(this.position)
				const pan = this.master.getPanValueFromX(screenxy[0])
				const loudness = this.master.getLoudnessFromXY(screenxy)
				this.master.createResourceTransfer(this.getConversionOutput(), screenxy)
				this.master.playSound(`break`, pan, loudness)
				this.master.playSound(`tap2`, pan, loudness)
			}
		}

		if (this.conversion > 0 && this.sprite.currentSequence === 0) this.sprite.switchSequence(1)

	}

	refill(){
		if (this.state === 0){

			const resources = this.master.requestResources(this.fuel, this.position, _=>{
				this.activate()
			})
			if (resources) this.state = 1

		}
	}

	activate(){
		this.fill = 1
		this.state = 2
		this.master.activeConverters.add(this)
	}

	onDelete(){
		this.master.activeConverters.delete(this)
	}

	onmousedown(){

		this.refill()

	}

	init(){

		this.preheaters = []
		this.isNextToSilo = false

		for (let i = 0; i < this.soi.length; i++){
			const cell = this.master.entityAtCoordinates([this.position[0] + this.soi[i][0], this.position[1] + this.soi[i][1]])
			if (cell && cell instanceof Preheater){
				this.preheaters.push(cell)
			} else if (cell && cell instanceof Silo){
				this.isNextToSilo = true
			}

		}
		
	}

	render(dt, vposition){

		const ctx = this.master.ctx
		const unit = this.master.unit
		const position = vposition ? vposition : this.position
		const xy = this.master.uvToXY(position)


		this.sprite.render(position,0,true)

		if (this.fill){
			ctx.save()
			ctx.translate(xy[0], xy[1]-unit/2.2)
			ctx.fillStyle = this.master.codex.resources[0].triplet[1]
			ctx.beginPath()
			ctx.arc(0,0, unit/1.9, 0, Math.PI * 2)
			ctx.closePath()
			ctx.fill()

			ctx.globalAlpha = this.conversion
			ctx.fillStyle = this.master.codex.resources[1].triplet[1]
			ctx.beginPath()
			ctx.arc(0,0, unit/1.9, 0, Math.PI * 2)
			ctx.closePath()
			ctx.fill()
			ctx.restore()
		}

		this.sprite.render(position)

	}

}

class Converter13 extends Entity{

	constructor(master){
		super(master)
		this.fill = 0
		this.conversion = 0
		this.baseConversionSpeed = 1e-5
		this.state = 0
		this.fuel = [4096, 64, 0, 32]
		this.name = `converter13`
		this.soulPower = 1

		this.sprite = new Sprite({
			master: this.master,
			src: `img/c1-3.png`,
			mask: [0,0,455,280],
			frames: [[0,560,455,280],[0,0,455,280],[455,0,455,280],[910,0,455,280],[1365,0,455,280],[1820,0,455,280]],
			backframes: [[0,560,455,280],[0,280,455,280],[455,280,455,280],[910,280,455,280],[1365,280,455,280],[1820,280,455,280]],
			origins: [227, 148],
			scale: 1,
			sequences: [[0],[1,2,3,4,5]],
			intervals: 240
		})

		this.initHint()
		this.initSellHint()

	}

	getConversionOutput(){
		return [2048, 0, 256]
	}

	onDelete(){
		if (this.sfxPlaying) this.master.stopSound(this.sfxPlaying,1)
		this.master.activeConverters.delete(this)
	}

	update(dt){

		if (this.state === 2){
			if (!this.sfxPlaying){
				const screenxy = this.master.uvToXYUntranslated(this.position)
				const pan = this.master.getPanValueFromX(screenxy[0])
				const loudness = this.master.getLoudnessFromXY(screenxy)
				this.sfxPlaying = this.master.startSound(`bubble`, pan, loudness)
			}
			let multiplicator = 1
			for (let i = 0; i < this.preheaters.length; i++){
				const tap = this.preheaters[i].tap()
				multiplicator += tap
			}
			this.conversion += (this.baseConversionSpeed + (this.baseConversionSpeed * .1 * (Math.random() * 2 - 1))) * dt * multiplicator//this.baseConversionSpeed * dt
			if (this.conversion >= 1){
				if (this.state === 2) this.shootExhaust()
				this.state = 0
				this.conversion = 0
				this.fill = 0
				this.master.activeConverters.delete(this)
				const screenxy = this.master.uvToXYUntranslated(this.position)
				const pan = this.master.getPanValueFromX(screenxy[0])
				const loudness = this.master.getLoudnessFromXY(screenxy)
				this.master.createResourceTransfer(this.getConversionOutput(), screenxy)
				this.sprite.switchSequence(0)
				this.master.playSound(`break`, pan, loudness)
				this.master.playSound(`tap3`, pan, loudness)
				this.master.stopSound(this.sfxPlaying,3)
				delete this.sfxPlaying
			}

		}

		if (this.conversion > 0 && this.sprite.currentSequence === 0) this.sprite.switchSequence(1)

	}

	refill(){
		if (this.state === 0){

			const resources = this.master.requestResources(this.fuel, this.position, _=>{
				this.activate()
			})
			if (resources) this.state = 1

		}
	}

	activate(){
		this.fill = 1
		this.state = 2
		this.sprite.switchSequence(1)
		this.master.activeConverters.add(this)
	}

	onmousedown(){

		this.refill()

	}

	init(){

		this.preheaters = []
		this.isNextToSilo = false

		for (let i = 0; i < this.soi.length; i++){
			const cell = this.master.entityAtCoordinates([this.position[0] + this.soi[i][0], this.position[1] + this.soi[i][1]])
			if (cell && cell instanceof Preheater){
				this.preheaters.push(cell)
			} else if (cell && cell instanceof Silo){
				this.isNextToSilo = true
			}

		}
		
	}

	render(dt, vposition){

		const position = vposition ? vposition : this.position

		if (this.state === 2) this.sprite.render(position,dt,true)

		if (this.fill){
			this.master.drawPrism([position[0] - .26, position[1] + .26], .36, .28 * this.conversion, this.master.codex.resources[2].triplet)
		}

		this.sprite.render(position, dt)

	}

}

class Converter41 extends Entity{

	constructor(master){
		super(master)
		this.fill = 0
		this.conversion = 0
		this.baseConversionSpeed = 1e-5
		this.state = 0
		this.fuel = [0, 64, 16, 8192]
		this.name = `converter41`
		this.soulPower = 1
		this.entityHeight = 2

		this.sprite = new Sprite({
			master: this.master,
			src: `img/c4-1.png`,
			mask: [0,0,455,730],
			frames: [[0,0,455,730],[455,0,455,730]],
			origins: [227, 600],
			scale: 1,
			sequences: [0,1],
			intervals: 100
		})

		this.initHint()
		this.initSellHint()

	}

	getConversionOutput(){
		return [16384, 32, 8]
	}

	update(dt){

		if (this.state === 2){

			let multiplicator = 1
			for (let i = 0; i < this.preheaters.length; i++){
				const tap = this.preheaters[i].tap()
				multiplicator += tap
			}

			this.conversion += (this.baseConversionSpeed + (this.baseConversionSpeed * .1 * (Math.random() * 2 - 1))) * dt * multiplicator//this.baseConversionSpeed * dt
			
			if (this.conversion >= 1){
				if (this.state === 2) this.shootExhaust()
				this.state = 0
				this.conversion = 0
				this.fill = 0
				this.master.activeConverters.delete(this)
				const screenxy = this.master.uvToXYUntranslated(this.position)
				const pan = this.master.getPanValueFromX(screenxy[0])
				const loudness = this.master.getLoudnessFromXY(screenxy)
				this.master.createResourceTransfer(this.getConversionOutput(), screenxy)
				this.sprite.switchSequence(0)
				this.master.playSound(`break`, pan, loudness)
				this.master.playSound(`tap1`, pan, loudness)
			}
		}

		if (this.conversion > 0 && this.sprite.currentSequence === 0) this.sprite.switchSequence(1)

	}

	refill(){
		if (this.state === 0){

			const resources = this.master.requestResources(this.fuel, this.position, _=>{
				this.activate()
			})
			if (resources) this.state = 1

		}
	}

	activate(){
		this.fill = 1
		this.state = 2
		this.sprite.switchSequence(1)
		this.master.activeConverters.add(this)
	}

	onDelete(){
		this.master.activeConverters.delete(this)
	}

	onmousedown(){

		this.refill()

	}

	init(){

		this.preheaters = []
		this.isNextToSilo = false

		for (let i = 0; i < this.soi.length; i++){
			const cell = this.master.entityAtCoordinates([this.position[0] + this.soi[i][0], this.position[1] + this.soi[i][1]])
			if (cell && cell instanceof Preheater){
				this.preheaters.push(cell)
			} else if (cell && cell instanceof Silo){
				this.isNextToSilo = true
			}

		}
		
	}

	render(dt, vposition){

		const ctx = this.master.ctx
		const unit = this.master.unit
		const position = vposition ? vposition : this.position

		this.sprite.renderState(position, 0)
		if (this.conversion){
			ctx.save()
			ctx.globalAlpha = Math.min(this.conversion * 10, 1)
			this.sprite.renderState(position, 1)
			ctx.restore()
		}

	}
}

class Converter76 extends Entity{

	constructor(master){
		super(master)
		this.entityHeight = 2
		this.fill = 0
		this.conversion = 0
		this.baseConversionSpeed = 1e-5
		this.state = 0
		this.fuel = [0, 0, 0, 0, 0, 1, 8192]
		this.name = `converter76`
		this.soulPower = 2

		this.sprite = new Sprite({
			master: this.master,
			src: `img/c7-6.png`,
			// mask: [0,0,455,730],
			frames: [[0,0,455,795],[455,0,455,795],[910,0,455,795],[1365,0,455,795]],
			origins: [227, 663],
			scale: 1,
			sequences: [[0],[1,2,3]],
			intervals: 30
		})

		this.initHint()
		this.initSellHint()

	}

	getConversionOutput(){
		return [0, 0, 0, 0, 1, 2048]
	}

	update(dt){

		if (this.state === 2){

			let multiplicator = 1
			for (let i = 0; i < this.preheaters.length; i++){
				const tap = this.preheaters[i].tap()
				multiplicator += tap
			}

			this.conversion += (this.baseConversionSpeed + (this.baseConversionSpeed * .1 * (Math.random() * 2 - 1))) * dt * multiplicator//this.baseConversionSpeed * dt
			if (this.conversion >= 1){
				if (this.state === 2) this.shootExhaust()
				this.state = 0
				this.conversion = 0
				this.fill = 0
				this.master.activeConverters.delete(this)
				const screenxy = this.master.uvToXYUntranslated(this.position)
				const pan = this.master.getPanValueFromX(screenxy[0])
				const loudness = this.master.getLoudnessFromXY(screenxy)
				this.master.createResourceTransfer(this.getConversionOutput(), screenxy)
				this.sprite.switchSequence(0)
				this.master.playSound(`break`, pan, loudness)
				this.master.playSound(`tap6`, pan, loudness)
			}
		}

		if (this.conversion > 0 && this.sprite.currentSequence === 0) this.sprite.switchSequence(1)

	}

	refill(){
		if (this.state === 0){

			const resources = this.master.requestResources(this.fuel, this.position, _=>{
				this.activate()
			})
			if (resources) this.state = 1

		}
	}

	activate(){
		this.fill = 1
		this.state = 2
		this.sprite.switchSequence(1)
		this.master.activeConverters.add(this)
	}

	onDelete(){
		this.master.activeConverters.delete(this)
	}

	onmousedown(){

		this.refill()

	}

	init(){

		this.preheaters = []
		this.isNextToSilo = false

		for (let i = 0; i < this.soi.length; i++){
			const cell = this.master.entityAtCoordinates([this.position[0] + this.soi[i][0], this.position[1] + this.soi[i][1]])
			if (cell && cell instanceof Preheater){
				this.preheaters.push(cell)
			} else if (cell && cell instanceof Silo){
				this.isNextToSilo = true
			}

		}
		
	}

	render(dt, vposition){

		const position = vposition ? vposition : this.position
		this.sprite.render(position, dt)
	}
}

class Converter64 extends Entity{

	constructor(master){
		super(master)
		this.soi = [[0,-1], [1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-2],[1,-2],[2,-2],[2,-1],[2,0],[2,1],[2,2],[1,2],[0,2],[-1,2],[-2,2],[-2,1],[-2,0],[-2,-1],[-2,-2],[-1,-2]]
		this.sor = [[0,-1], [1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]]
		this.fill = 0
		this.conversion = 0
		this.baseConversionSpeed = 1e-5
		this.state = 0
		this.fuel = [0, 0, 0, 0, 0, 4096, 32768]
		this.name = `converter64`
		this.soulPower = 2
		this.reflectorCount = 0

		this.sprite = new Sprite({
			master: this.master,
			src: `img/reactor.png`,
			frames: [[0,0,455,443],[455,0,455,443]],
			origins: [227, 311],
			scale: 1,
			sequences: [[0,1]],
			intervals: 100
		})

		this.initHint()
		this.initSellHint()

	}

	getConversionOutput(){
		const output = (32768 + this.reflectorCount * 8192) * 4
		return [0, 0, 0, output, 128]
	}

	init(){


		this.preheaters = []
		this.alone = true
		this.reflectorCount = 0
		this.isNextToSilo = false

		for (let i = 0; i < this.sor.length; i++){
			const cell = this.master.entityAtCoordinates([this.position[0] + this.sor[i][0], this.position[1] + this.sor[i][1]])
			if (cell && cell instanceof Reflector){
				this.reflectorCount++
			} else if (cell && cell instanceof Preheater){
				this.preheaters.push(cell)
			}

		}
		for (let i = 0; i < this.soi.length; i++){
			const cell = this.master.entityAtCoordinates([this.position[0] + this.soi[i][0], this.position[1] + this.soi[i][1]])
			if (cell && cell instanceof Converter64){
				this.alone = false
				// break
			} else if (cell && cell instanceof Silo){
				this.isNextToSilo = true
			}

		}

	}

	update(dt){

		if (this.state === 2 && this.alone){

			let multiplicator = 1
			for (let i = 0; i < this.preheaters.length; i++){
				const tap = this.preheaters[i].tap()
				multiplicator += tap
			}
			this.conversion += (this.baseConversionSpeed + (this.baseConversionSpeed * .1 * (Math.random() * 2 - 1))) * dt * (1 + this.reflectorCount / 8) * multiplicator//this.baseConversionSpeed * dt
			if (this.conversion >= 1){
				if (this.state === 2) this.shootExhaust()
				this.state = 0
				this.conversion = 0
				this.fill = 0
				this.master.activeConverters.delete(this)
				
				const screenxy = this.master.uvToXYUntranslated(this.position)
				const pan = this.master.getPanValueFromX(screenxy[0])
				const loudness = this.master.getLoudnessFromXY(screenxy)
				this.master.createResourceTransfer(this.getConversionOutput(), screenxy)
				this.master.playSound(`break`, pan, loudness)
				this.master.playSound(`tap4`, pan, loudness)
			}
		}

		if (this.conversion > 0 && this.sprite.currentSequence === 0) this.sprite.switchSequence(1)

	}

	refill(){
		if (this.state === 0){

			const resources = this.master.requestResources(this.fuel, this.position, _=>{
				this.activate()
			})
			if (resources) this.state = 1

		}
	}

	activate(){
		this.fill = 1
		this.state = 2
		this.master.activeConverters.add(this)
	}

	onDelete(){
		this.master.activeConverters.delete(this)
	}

	onmousedown(){

		this.refill()

	}

	render(dt, vposition){
		this.sprite.renderState(vposition ? vposition : this.position, (this.fill > 0 && this.alone) ? 1 : 0)
	}
}

class Reflector extends Entity{

	constructor(master){
		super(master)
		this.name = `reflector`
		this.variant = 0
		this.soulPower = .5

		this.variantMap = [.25, .125, 0, .875, .75, .625, .5, .375]

		this.sprite = new Sprite({
			master: this.master,
			src: `img/reflector.png`,
			frames: [[0,0,455,279],[455,0,455,279],[910,0,455,279],[1365,0,455,279],[0,279,455,279],[455,279,455,279],[910,279,455,279],[1365,279,455,279]],
			origins: [227, 147],
			scale: 1,
			sequences: [0,1,2,3,4,5,6,7],
			intervals: 100
		})

		this.initHint()
		this.initSellHint()
	}

	init(){

		for (let i = 0; i < this.soi.length; i++){
			const cell = this.master.entityAtCoordinates([this.position[0] + this.soi[i][0], this.position[1] + this.soi[i][1]])
			if (cell && cell instanceof Converter64){
				this.variant = this.variantMap[i]
				break
			}

		}
	}

	render(dt, vposition){
		this.sprite.renderState(vposition ? vposition : this.position, this.variant)
	}
}

class Generaldecay extends Entity{

	constructor(master){
		super(master)
		this.entityHeight = 2
		this.name = `generaldecay`
		this.maxCapacity = 1024
		this.capacity = 0
		this.resources = [0,0,0,0,0]
		this.soulPower = 4
		this.chasmNetwork = false

		this.sprite = new Sprite({
			master: this.master,
			src: `img/generaldecay.png`,
			frames: [[0,0,455,875]],
			origins: [227, 743],
			scale: 1,
			sequences: [0,0],
			intervals: 100
		})

		this.initHint()
		this.initSellHint()
	}

	consume(r){

		for (let i = 0; i < r.length; i++){

			this.capacity += r[i]
			this.resources[i] += r[i]

		}

		if (this.capacity >= this.maxCapacity){

			const screenxy = this.master.uvToXYUntranslated(this.position)
			const pan = this.master.getPanValueFromX(screenxy[0])
			const loudness = this.master.getLoudnessFromXY(screenxy)
			this.master.playSound(`geiger`, pan, loudness)

			
			if (this.master.chasm && this.master.chasm.chasmNetwork === this.chasmNetwork){
				this.master.createChasmTransfer(this.resources, [...this.chasmPath, this.position].reverse())
			} else {
				this.master.createResourceTransfer(this.resources, screenxy)
			}
			
			this.resources = [0,0,0,0,0]
			this.capacity = 0

		}

	}

	onDelete(){
		delete this.master.generaldecay
	}

	init(){
		this.master.generaldecay = this
		this.master.chasm?.updateChain()
	}

	render(dt, vposition){
		this.sprite.renderState(vposition ? vposition : this.position, this.capacity > 0 ? 1 : 0)
	}
}

class Cube extends Entity{

	constructor(master, misc){

		super(master)
		this.pump = misc.pump
		this.fill = 0
		this.maxFill = 64
		this.state = 0 //0 growing, 1 transition, 2 stable, 3 exploded

		this.name = `cube`

		this.colorBlank = [`#f8f8f8`, `#fefefe`, `#e6e6e4`]
		this.reversePause = 100
		this.reverseTimer = this.reversePause
		this.reverseSpeed = .01
		this.unveilSpeed = 4e-3
		this.unveilProgress = 0
		this.broken = 0
		this.baseBreakPower = .08
		this.breakPower = this.baseBreakPower
		this.shakePower = .04

		this.destabilizers = []
		this.consumers = []

		this.resources = misc.resources
		this.resourceCoordinates = []
		this.resourceShifts3d = []

	}

	initHint(){}

	// drawHint(){}

	canHit(){
		return this.state === 2
	}

	onDelete(){
		this.master.activeCubes.delete(this)
	}

	onmousedown(power = 1){
		if (this.state === 2){

			const screenxy = this.master.uvToXYUntranslated(this.position)
			const pan = this.master.getPanValueFromX(screenxy[0])
			const loudness = this.master.getLoudnessFromXY(screenxy)

			for (let i = 0; i < this.composition.length; i++){
				if (this.composition[i]){
					this.master.playSound(this.master.codex.resources[i].sfx, pan, loudness)
				}
			}

			if (this.master.resourceTransferType < 3) this.master.createResourceSpark(this.composition,screenxy)
			
			let acc = 0
			const hellgem = this.composition[4]

			for (let i = 0; i < this.destabilizers.length; i++){
				const d = this.destabilizers[i]
				if (d.state === 2 && d instanceof Destabilizer2a){
					if (hellgem) acc += d.tap(power)
				} else if (d.state === 2){
					acc += d.tap(power)
				}
			}

			//Hard resources
			const hardmult = hellgem ? .03 : 1

			this.breakPower = this.baseBreakPower * (1 + acc) * hardmult

			this.broken += this.breakPower * power

			if (this.broken >= 1){
				this.broken = 1
				this.state = 3
				this.master.activeCubes.delete(this)
				if (this.master.plane === 1) {
					this.master.createExhaust(this.position, `#FFF`, [0,1])
				}

				let activeConsumers = []
				for (let i = 0; i < this.consumers.length; i++){
					const c = this.consumers[i]
					if (c.state === 2){
						activeConsumers.push(c)
					}
				}
				const consumer = activeConsumers.length > 1 ? activeConsumers[Math.floor(Math.random() * activeConsumers.length)] : activeConsumers.length > 0 ? activeConsumers[0] : false

				this.master.playSound(`break`, pan, loudness)

				if (this.master.resourceTransferType < 3){
					for (let i = 0; i < this.resourceCoordinates.length; i++){
						const scoords = this.master.uvToXYUntranslated(this.resourceCoordinates[i])
						const r = []
						r[this.resources[i]] = 1

						if (consumer){
							consumer.consume(r,scoords)
						} else {
							this.master.createResourceTransfer(r, scoords)
						}
						
					}
				} else {
					const resources = new Array(this.master.resources.length).fill(0)
					for (let i = 0; i < this.resources.length; i++){
						resources[this.resources[i]]++
					}
					const scoords = this.master.uvToXYUntranslated(this.position)
					if (consumer){
						consumer.consume(resources, scoords)
					} else {
						this.master.createResourceTransfer(resources, scoords)
					}
				}

				this.master.processMousemove()
				this.killme = true

			} else {

				for (let i = 0; i < 64; i++){

					this.resourceShifts3d[i] = [(Math.random() * 2 - 1) * this.shakePower * this.broken, (Math.random() * 2 - 1) * this.shakePower * this.broken, (Math.random() * 2 - 1) * this.shakePower * 2 * this.broken]

				}

			}
		}
	}

	init(){

		if (!this.composition){

			this.composition = []

			for (let i = 0; i < 64; i++){

				const resource = this.resources[i]
				if (!this.composition[resource]) this.composition[resource] = 0.015625; else this.composition[resource] += 0.015625

				const dx = -.385 + .25 * (i % 4)
				const dy = -.385 + .25 * (Math.floor(i/4) % 4)
				const dz = .25 * Math.floor(Math.floor(i/4) / 4)
				this.resourceCoordinates.push([this.position[0] + dx - dz, this.position[1] + dy - dz])
				this.resourceShifts3d.push([0,0,0])

			}

		}
		this.consumers = []
		this.destabilizers = []
		for (let i = 0; i < this.soi.length; i++){

			const cell = this.master.stuffMap[`u${this.position[0] + this.soi[i][0]}v${this.position[1] + this.soi[i][1]}`]

			if (cell && cell instanceof Destabilizer) {
				this.destabilizers.push(cell)
			} else if (cell && cell instanceof Consumer){
				this.consumers.push(cell)
			}

		}

		if (this.state === 2){
			this.master.activeCubes.add(this)
		}

	}

	update(dt){

		//DEGRADE
		if (this.state === 0 && !this.pump?.hold){
			if (this.reverseTimer){

				this.reverseTimer = Math.min(0, this.reverseTimer - dt)

			} else {

				this.fill -= this.reverseSpeed * dt
				if (this.fill <= 0) {
					this.fill = 0
					this.master.clearCell(this.position)
				}

			}
		//UNVEIL
		} else if (this.state === 1){

			this.unveilProgress += this.unveilSpeed * dt
			if (this.unveilProgress >= 1){
				this.unveilProgress = 1
				this.state = 2
				this.master.processMousemove()
				this.master.activeCubes.add(this)

				//Checking for injectors
				for (let i = 0; i < this.soi.length; i++){
					const cell = this.master.stuffMap[`u${this.position[0] + this.soi[i][0]}v${this.position[1] + this.soi[i][1]}`]
					if (cell && cell instanceof Injector && cell.state === 2){

						this.swapRandomResource(cell, 4)
						break
						
					}

				}

			}

		}

	}

	swapRandomResource(cell, swapResourceId){
		if (!this.composition[swapResourceId]){
			cell.tap(1)
			const swapPosition = Math.floor(Math.random() * 64)
			const resourceId = this.resources[swapPosition]

			this.resources[swapPosition] = swapResourceId
			this.composition[swapResourceId] = 0.015625
			this.composition[resourceId] -= 0.015625

			const screenxy = this.master.uvToXYUntranslated(this.resourceCoordinates[swapPosition])
			const pan = this.master.getPanValueFromX(screenxy[0])
			const loudness = this.master.getLoudnessFromXY(screenxy)

			const explosionArray = []
			explosionArray[resourceId] = 1
			this.master.playSound(this.master.codex.resources[resourceId].sfx, pan, loudness)
			this.master.createResourceTransfer(explosionArray, screenxy)
		}
	}

	drawResources(){

			const visible = [12,13,14,3,7,11,15, 28,29,30,19,23,27,31, 44,45,46,35,39,43,47, 48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63]

			for (let id = 0; id < visible.length; id++){

				const i = visible[id]

				const dx = (Math.random() * 2 - 1) * this.broken * this.shakePower
				const dy = (Math.random() * 2 - 1) * this.broken * this.shakePower
				const dz = (Math.random() * 2 - 1) * this.broken * this.shakePower + .125

				this.master.resourcesSprites[this.resources[i]].render([
					this.resourceCoordinates[i][0] + this.resourceShifts3d[i][0] + dx - dz - this.resourceShifts3d[i][2], 
					this.resourceCoordinates[i][1] + this.resourceShifts3d[i][1] + dy - dz - this.resourceShifts3d[i][2]
				])

			}

	}

	render(){

		const ctx = this.master.ctx
		const unit = this.master.unit

		ctx.strokeStyle = `#99A`
		ctx.lineWidth = unit * .01

		if (this.state === 0){
			this.master.drawPrism(this.position, 1, this.fill / this.maxFill, this.colorBlank)
		} else if (this.state === 1){
			this.drawResources()
			this.master.ctx.save()
			this.master.ctx.globalAlpha = 1 - this.unveilProgress
			this.master.drawPrism(this.position, 1, 1, this.colorBlank)
			this.master.ctx.restore()
		} else if (this.state === 2){
			this.drawResources()
		}

		//DEBUG
		// this.showHitbox()

	}

	darkrender(){

		// const ctx = this.master.ctx
		// const unit = this.master.unit
		// const size = .5 * (1 - this.fill / this.maxFill)

		// ctx.fillStyle = `#FFF`
		// const xy = this.master.uvToXY(this.position)

		// ctx.beginPath()
		// ctx.arc(xy[0], xy[1], size * unit, 0, Math.PI * 2)
		// ctx.closePath()
		// ctx.fill()

	}

	accept(q){
		
		this.fill += q
		this.reverseTimer = this.reversePause
		if (this.fill > this.maxFill) {
			this.fill = this.maxFill
			this.state = 1
			return false
		}

		return true

	}

	ondarkhover(){}
	updateSoul(){}

}

class Pump extends Entity{

	constructor(master){
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
		this.hint.addDynamicText(_=>Math.floor(this.depth * 10) + `m`)//zzz Maybe localize?
		this.hint.addProgress(_=>this.depth * 10 % 1)
		this.hint.addDescription(`<b>${this.master.words.entities[this.name].name}</b><br/>${this.master.words.entities[this.name].description}`)
		this.hint.addQEString(true,false)
	}

	onDelete(){
		if (this.sfxPlaying) this.master.stopSound(this.sfxPlaying,1)

		for (let i = 0; i < this.soi.length; i++){

			const p = [this.position[0] + this.soi[i][0], this.position[1] + this.soi[i][1]]
			const cell = this.master.entityAtCoordinates(p)

			if (cell && cell instanceof Cube){
				if (cell.pump == this) cell.pump = false
			}

		}

	}

	canHit(){
		return true
	}

	getProbability(point = 0, spread = 0, value = 0, span = 0){
		if (this.depth < point - spread || this.depth > point + spread + span) return 0
		if (!spread && span) return value
		if (span) return this.depth < point ? value * (.5 * Math.cos((this.depth - point) * (Math.PI / spread)) + .5) : this.depth > point + span ? value * (.5 * Math.cos((this.depth - point - span) * (Math.PI / spread)) + .5) : value
		return value * (.5 * Math.cos((this.depth - point) * (Math.PI / spread)) + .5)
	}

	TESTgetProbability(d = 0, point = 0, spread = 0, value = 0, span = 0){
		if (d < point - spread || d > point + spread + span) return 0
		if (!spread && span) return value
		if (span) return d < point ? value * (.5 * Math.cos((d - point) * (Math.PI / spread)) + .5) : d > point + span ? value * (.5 * Math.cos((d - point - span) * (Math.PI / spread)) + .5) : value
		return value * (.5 * Math.cos((d - point) * (Math.PI / spread)) + .5)
	}

	TESTgetRP(d){
		let psum = 0
		const probs = []
		for (let i = 0; i < this.master.codex.resources.length; i++){

			if (this.master.codex.resources[i].chances){
				const c = this.master.codex.resources[i].chances
				let p = 0

				for (let j = 0; j < c.length; j++){
					if (c[j].type === 0){
						const mean = c[j].mean
						const stdev = c[j].stdev
						const base = c[j].base
						p = Math.max(p, base * Math.exp(-.5 * ((d - mean) / stdev) ** 2) / (stdev * (Math.PI * 2) ** .5))
					} else if (c[j].type === 1){
						p = Math.max(p, (d >= c[j].from && d <= c[j].to) ? c[j].base : 0)
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

	TESTgetRP2(d){
		let psum = 0
		const probs = []
		for (let i = 0; i < this.master.codex.resources.length; i++){

			if (this.master.codex.resources[i].chances){
				const c = this.master.codex.resources[i].probabilities || []
				let p = 0

				for (let j = 0; j < c.length; j++){
					p = Math.max(p, this.TESTgetProbability(d, c[j].point, c[j].spread, c[j].value, c[j].span))
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

				const c = this.master.codex.resources[i].probabilities
				if (!c) continue

				let v = 0
				for (let j = 0; j < c.length; j++){
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
				const c = this.master.codex.resources[i].probabilities
				let p = 0

				for (let j = 0; j < c.length; j++){
					p = Math.max(p, this.getProbability(c[j].point, c[j].spread, c[j].value, c[j].span))
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

		let locked = this.master.stats.totalResourcesMined[2] < 1 && !(this instanceof Pump2)

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

	update(dt){

		if (this.surgeTimer){

			this.surgeTimer -= dt
			if (this.surgeTimer < 0){
				this.surgeTimer = 0
			}
			this.surgeBoost = (this.surgeTimer / this.surgeMaxTime) ** 2 * 8

		}

		let work = false
		if (this.master.hoveredEntity !== this) this.onmouseup()

		//Check aux pumps for initiating
		let totalspeed = this.active ? this.pumpSpeed : 0
		let auxSpeed = 0
		let activeAuxes = []
		if (this.auxes?.length){
			for (let i = 0; i < this.auxes.length; i++){
				const ping = this.auxes[i].tap(0)
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
				this.spoolup = Math.min(1, this.spoolup + this.spoolupSpeed * dt)
				if (!this.active){
					for (let i = 0; i < activeAuxes.length; i++){
						activeAuxes[i].tap(dt / activeAuxes.length)
					}
				}
			} else {
				const spotIds = []
				let cubes = []

				//Check for existing cubes
				for (let i = 0; i < this.soi.length; i++){

					const p = [this.position[0] + this.soi[i][0], this.position[1] + this.soi[i][1]]
					const cell = this.master.entityAtCoordinates(p)

					if (cell && cell instanceof Cube && cell.state === 0 && cell.pump === this){
						cubes.push(cell)
					//Preventing aux lock for building
					} else if (!cell && !(this.master.itemInHand && this.master.hoveredCell[0] === p[0] && this.master.hoveredCell[1] === p[1])){
						spotIds.push(i)
					}

				}

				//Update cubes
				if (cubes.length){
					const quantity = totalspeed / cubes.length * dt
					for (let i = 0; i < cubes.length; i++){
						this.pumpTo(cubes[i], quantity, dt)
					}
					if (!this.active){
						for (let i = 0; i < activeAuxes.length; i++){
							activeAuxes[i].tap(dt / activeAuxes.length)
						}
					}
				
				//Or initiating new
				} else if (spotIds.length){

					const id = spotIds[Math.floor(Math.random() * spotIds.length)]
					const spotPosition = [this.position[0] + this.soi[id][0], this.position[1] + this.soi[id][1]]
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
					const cell = this.master.entityAtCoordinates([this.position[0] + this.soi[i][0], this.position[1] + this.soi[i][1]])

					if (cell && cell instanceof Valve && cell.state === 2){
						cell.tap(dt)
						this.hold = true
						break
					}

				}
			}

			if (!this.hold){
				this.spoolup = Math.max(0, this.spoolup - this.spooldownSpeed * dt)
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

	pumpTo(c,q){
		const flow = c.accept(q)
		if (flow){
			this.depth += this.digSpeed * q / (1 + this.depth ** .7)
			this.master.currentlyExtracting = true
			this.master.stats.maxDepth = Math.max(this.master.stats.maxDepth, this.depth) || 0
		}
	}

	render(dt, vposition){

		const position = vposition ? vposition : this.position

		if (position) {

			this.sprite.renderState(position, this.spoolup)

			// const ctx = this.master.ctx
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

class Pump2 extends Pump{

	constructor(master){
		super(master)
		this.soe = [[0,-1], [1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-2],[1,-2],[2,-2],[2,-1],[2,0],[2,1],[2,2],[1,2],[0,2],[-1,2],[-2,2],[-2,1],[-2,0],[-2,-1],[-2,-2],[-1,-2]]
		this.basePumpSpeed = .08
		this.pumpSpeed = this.basePumpSpeed
		this.soulPower = 2

		//Glory Stuff
		this.timeStamp = performance.now()
		this.passed6400 = false

		this.name = `pump2`

		this.spoolupSpeed = 1e-3
		this.spooldownSpeed = 4e-4

		this.digSpeed = .08

		this.sprite = new Sprite({
			master: this.master,
			src: `img/channel2.png`,
			mask: [0,0,455,466],
			frames: [[0,0,455,463],[455,0,455,463],[910,0,455,463],[1365,0,455,463],[1820,0,455,463],[2275,0,455,463],[2730,0,455,463],[3185,0,455,463]],
			origins: [227, 332],
			scale: 1,
			sequences: [0,1,2,3,4,5,6,7],
			intervals: 100
		})

		this.initSellHint()

	}

	init(){
		this.master.stats.excavatorWasBuilt = true
		this.master.pumps.add(this)
		this.checkForModifiers()
	}

	onDelete(){
		this.master.stats.excavatorWasBuilt = true
		this.master.pumps.delete(this)
	}

	update(dt){

		if (this.surgeTimer){

			this.surgeTimer -= dt
			if (this.surgeTimer < 0){
				this.surgeTimer = 0
			}
			this.surgeBoost = (this.surgeTimer / this.surgeMaxTime) ** 2 * 8

		}

		let work = false
		if (this.master.hoveredEntity !== this) this.onmouseup()

		//Check aux pumps for initiating
		let totalspeed = this.active ? this.pumpSpeed : 0
		let auxSpeed = 0
		let activeAuxes = []
		if (this.auxes?.length){
			for (let i = 0; i < this.auxes.length; i++){
				// totalspeed += this.auxes[i].tap(0) * this.pumpSpeed
				const ping = this.auxes[i].tap(0)
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
				this.spoolup = Math.min(1, this.spoolup + this.spoolupSpeed * dt)
				if (!this.active){
					for (let i = 0; i < activeAuxes.length; i++){
						activeAuxes[i].tap(dt / activeAuxes.length)
					}
				}
			} else {
				const spotIds = []
				let cubes = []

				//Check for existing cubes
				for (let i = 0; i < this.soe.length; i++){

					// const cell = this.master.stuffMap[`u${this.position[0] + this.soi[i][0]}v${this.position[1] + this.soi[i][1]}`]
					const p = [this.position[0] + this.soe[i][0], this.position[1] + this.soe[i][1]]
					const cell = this.master.entityAtCoordinates(p)

					if (cell && cell instanceof Cube && cell.state === 0 && cell.pump === this){
						cubes.push(cell)
					//Preventing aux lock for building
					} else if (!cell && !(this.master.itemInHand && this.master.hoveredCell[0] === p[0] && this.master.hoveredCell[1] === p[1])){
						spotIds.push(i)
					}

				}

				//Update cubes
				if (cubes.length){
					const quantity = totalspeed / cubes.length * dt
					for (let i = 0; i < cubes.length; i++){
						this.pumpTo(cubes[i], quantity, dt)
					}
					if (!this.active){
						for (let i = 0; i < activeAuxes.length; i++){
							activeAuxes[i].tap(dt / activeAuxes.length)
						}
					}
				
				//Or initiating new
				} else if (spotIds.length){

					const id = spotIds[Math.floor(Math.random() * spotIds.length)]
					const spotPosition = [this.position[0] + this.soe[id][0], this.position[1] + this.soe[id][1]]
					const resources = []
					for (let r = 0; r < 64; r++){
						resources.push(this.getResource())
					}
					this.master.addEntity(`cube`, spotPosition, {pump: this, resources: resources})
					this.master.processMousemove()
					// if (pumpactive) this.auxpump.tap(dt)

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
					const cell = this.master.entityAtCoordinates([this.position[0] + this.soi[i][0], this.position[1] + this.soi[i][1]])

					if (cell && cell instanceof Valve && cell.state === 2){
						cell.tap(dt)
						this.hold = true
						break
					}

				}
			}

			if (!this.hold){
				this.spoolup = Math.max(0, this.spoolup - this.spooldownSpeed * dt)
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

		if (!this.passed6400 && this.depth >= 640){
			this.passed6400 = true
			if (Math.abs(performance.now() - (this.timeStamp || Infinity)) < 360000) this.master.got64kmphAchievement = true
		}

	}

}

class Mega1 extends Entity{

	constructor(master){
		super(master)
		this.entityHeight = 4
		this.name = `mega1`
		this.soulPower = 1

		this.sprite = new Sprite({
			master: this.master,
			src: `img/mega1.png`,
			frames: [[0,0,455,1469]],
			origins: [226,1337],
			scale: 1,
			sequences: [0],
			intervals: 100
		})

		this.initHint()
		this.initSellHint()
	}

	init(){

		this.master.resourceTransferType = Math.max(this.master.resourceTransferType, 1)

	}

	onDelete(){

		if (this.master.resourceTransferType === 1) this.master.resourceTransferType = 0

	}

	render(dt, vposition){

		this.sprite.render(vposition ? vposition : this.position)

	}

}

class Mega1a extends Entity{

	constructor(master){
		super(master)
		this.entityHeight = 4
		this.name = `mega1a`
		this.soulPower = 2

		this.sprite = new Sprite({
			master: this.master,
			src: `img/mega1a.png`,
			frames: [[0,0,455,1469]],
			origins: [226,1337],
			scale: 1,
			sequences: [0],
			intervals: 100
		})
		this.initHint()
		this.initSellHint()
	}

	init(){

		this.master.resourceTransferType = Math.max(this.master.resourceTransferType, 2)

	}

	onDelete(){

		if (this.master.resourceTransferType === 2) this.master.resourceTransferType = 0

	}

	render(dt, vposition){

		this.sprite.render(vposition ? vposition : this.position)

	}

}

class Mega1b extends Entity{

	constructor(master){
		super(master)
		this.entityHeight = 4
		this.name = `mega1b`
		this.soulPower = 4

		this.sprite = new Sprite({
			master: this.master,
			src: `img/mega1b.png`,
			frames: [[0,0,697,1469]],
			origins: [226,1337],
			scale: 1.532,
			sequences: [0],
			intervals: 100
		})

		this.initHint()
		this.initSellHint()
	}

	init(){

		this.master.resourceTransferType = Math.max(this.master.resourceTransferType, 3)

	}

	onDelete(){

		if (this.master.resourceTransferType === 3) this.master.resourceTransferType = 0

	}

	render(dt, vposition){

		this.sprite.render(vposition ? vposition : this.position)

	}

}

class Mega2 extends Entity{

	constructor(master){
		super(master)
		this.entityHeight = 3
		this.name = `mega2`
		this.soulPower = 2

		this.sprite = new Sprite({
			master: this.master,
			src: `img/recycler.png`,
			frames: [[0,0,455,1093]],
			origins: [226,961],
			scale: 1,
			sequences: [0],
			intervals: 100
		})

		this.initHint()
		this.initSellHint()
	}

	init(){

		this.master.updateEraserType(1)
		document.body.classList.add(`allowQHints`)

		// this.master.resourceTransferType = Math.max(this.master.resourceTransferType, 1)

	}

	onDelete(){

		this.master.updateEraserType(0)
		document.body.classList.remove(`allowQHints`)

		// if (this.master.resourceTransferType === 1) this.master.resourceTransferType = 0

	}

	render(dt, vposition){

		this.sprite.render(vposition ? vposition : this.position)

	}

}

class Mega3 extends Entity{

	constructor(master){
		super(master)
		this.entityHeight = 3
		this.name = `mega3`
		this.soulPower = 2

		this.sprite = new Sprite({
			master: this.master,
			src: `img/recycler2.png`,
			frames: [[0,0,455,1093]],
			origins: [226,961],
			scale: 1,
			sequences: [0],
			intervals: 100
		})

		this.initHint()
		this.initSellHint()
	}

	init(){

		this.master.updateEraserType(2)
		document.body.classList.add(`allowEHints`)
		// this.master.resourceTransferType = Math.max(this.master.resourceTransferType, 1)

	}

	onDelete(){

		this.master.updateEraserType(0)
		document.body.classList.remove(`allowEHints`)
		// if (this.master.resourceTransferType === 1) this.master.resourceTransferType = 0

	}

	render(dt, vposition){

		this.sprite.render(vposition ? vposition : this.position)

	}

}

class Eye extends Entity{

	constructor(master){
		super(master)
		this.name = `eye`
		this.soulPower = 1

		this.sprite = new Sprite({
			master: this.master,
			src: `img/eye.png`,
			frames: [[0,0,455,343]],
			origins: [226,212],
			scale: 1,
			sequences: [0],
			intervals: 100
		})

		this.initHint()
		this.initSellHint()
	}

	init(){

		this.master.showUnfilled = true

	}

	onDelete(){

		this.master.showUnfilled = false

	}

	render(dt, vposition){

		this.sprite.render(vposition ? vposition : this.position)

	}

}

class Clicker1 extends Entity{

	constructor(master){
		super(master)
		this.name = `clicker1`
		this.soulPower = 1

		this.sprite = new Sprite({
			master: this.master,
			src: `img/clicker1.png`,
			frames: [[0,0,455,343]],
			origins: [226,212],
			scale: 1,
			sequences: [0],
			intervals: 100
		})

		this.initHint()
		this.initSellHint()
	}

	init(){

		this.master.mouse.automate = true
		this.master.mouse.maxTimer = 150

	}

	onDelete(){

		this.master.mouse.automate = false

	}

	render(dt, vposition){

		this.sprite.render(vposition ? vposition : this.position)

	}

}
class Clicker2 extends Clicker1{

	constructor(master){
		super(master)
		this.name = `clicker2`
		this.soulPower = 1

		this.sprite = new Sprite({
			master: this.master,
			src: `img/clicker2.png`,
			frames: [[0,0,455,343]],
			origins: [226,212],
			scale: 1,
			sequences: [0],
			intervals: 100
		})

		this.initHint()
		this.initSellHint()
	}

	init(){

		this.master.mouse.automate = true
		this.master.mouse.maxTimer = 100

	}

}
class Clicker3 extends Clicker1{

	constructor(master){
		super(master)
		this.name = `clicker3`
		this.soulPower = 1

		this.sprite = new Sprite({
			master: this.master,
			src: `img/clicker3.png`,
			frames: [[0,0,455,343]],
			origins: [226,212],
			scale: 1,
			sequences: [0],
			intervals: 100
		})

		this.initHint()
		this.initSellHint()
	}

	init(){

		this.master.mouse.automate = true
		this.master.mouse.maxTimer = 50

	}

}

class Cookie extends Entity{

	constructor(master){
		super(master)
		this.name = `cookie`
		this.soulPower = 1
		this.indestructible = true

		this.sprite = new Sprite({
			master: this.master,
			src: `img/cookie.png`,
			frames: [[0,0,454,291]],
			origins: [227,159],
			scale: 1,
			sequences: [0],
			intervals: 100
		})

		this.initHint()
	}

	onmousedown(){
		this.master.cookie = true
	}

	render(dt){

		this.sprite.renderState(this.position,0)

	}

}

class Pinhole extends Entity{

	constructor(master){
		super(master)
		this.name = `pinhole`
		this.indestructible = true
		this.happened = false

		this.f = 0

		this.maxFlashTimer = 2000
		this.flashTimer = this.maxFlashTimer * Math.random()

		this.maxSwitchTimer = 16000
		this.switchTimer = 32000

		this.sprite = new Sprite({
			master: this.master,
			src: `img/pinhole.png`,
			frames: [[0,0,454,299]],
			origins: [227,167],
			scale: 1,
			sequences: [0],
			intervals: 100
		})

		this.shopsprite = new Sprite({
			master: this.master,
			src: `img/chasm.png`,
			frames: [[0,0,454,559]],
			origins: [227,428],
			scale: 1,
			sequences: [0],
			intervals: 100
		})
	}

	initHint(){}

	init(){

		if (!this.happened){
			this.master.playSound(`lightning`)
			this.master.createHollowEvent(`#000`, 50000)
			this.happened = true

			if (this.master.voidsculpture) this.master.clearCell(this.master.voidsculpture.position)
			this.master.shop.vessel.style.display = `none`
			this.master.shop.shopToggle.style.display = `none`
			this.master.hollowSite.spawnTimerBase = 2000
			this.master.pinhole = this
			this.master.playSound(`endingMusic`,undefined,undefined,undefined,true)

			this.totalCount = this.master.stuff.length

			//TST
			this.finalTimer = 300000
			// const timeGoal = 300000
			// this.maxFlashTimer = timeGoal / this.totalCount * 2

			setTimeout(_=>this.master.rbrtimeup = true, 640)
		}

	}

	update(dt){

		this.flashTimer -= dt
		this.switchTimer -= dt
		this.finalTimer -= dt

		this.maxFlashTimer = Math.max(250, this.finalTimer / (this.master.stuff.length + 1) * 2)

		if (this.flashTimer <= 0){
			this.flashTimer = this.maxFlashTimer * Math.random()// * (this.master.stuff.length < 4 ? .2 : 1)

			const entity = this.master.stuff[Math.floor(Math.random() * this.master.stuff.length)]
			
			const exy = this.master.uvToXYUntranslated(entity.position)
			const gxy = this.master.uvToXYUntranslated([this.position[0] - 1, this.position[1] - 1])

			this.master.playSound(`lightning`, undefined, undefined, this.master.plane ? true : false)
			this.master.createLightning([], exy, gxy, _=>{}, [1,1], this.master.plane ? `#FFF` : `#112`)

			//Gamepad
			const gamepad = navigator.getGamepads()[0]
			if (gamepad){
				gamepad.vibrationActuator?.reset()
				gamepad.vibrationActuator?.playEffect(`dual-rumble`,{
				startDelay: 0,
				  duration: 50,
				  weakMagnitude: .6,
				  strongMagnitude: .2
				})
			}

			//(entity.name === `mega1b` && this.master.stuff.length > 4)
			if (entity.name !== `pinhole` && entity.name !== `strange3`){
				this.master.createResourceExplosion(this.master.getRealPrice(entity.name), exy)
				this.master.clearCell(entity.position)
			} else if (entity.name === `strange3`){
				this.master.playSound(`horn`)
			}

		}

		if (this.switchTimer <= 0){
			this.switchTimer = this.maxSwitchTimer
			this.master.playSound(`teleport`,undefined,undefined, this.master.plane ? true : false,true)
			this.master.switchPlane(this.master.plane ? 0 : 1)
		}

		this.f = 1 - ((this.master.stuff.length - 2) / this.totalCount)


	}

	onDelete(){


	}

	render(dt, vposition){

		if (vposition){

			this.shopsprite.renderState(vposition,0)

		} else {

			this.sprite.render(this.position)

		}

	}

}

class Gradient extends Entity{

	constructor(master){
		super(master)
		this.name = `gradient`
		this.soulPower = 0

		this.maxFlashTimer = 1000
		this.flashTimer = this.maxFlashTimer + Math.random() * this.maxFlashTimer

		this.base = 4096
		// this.gradient = [mult * 0.10416666666666667, mult * 0.020833333333333332, mult * 0.03125, mult * 0.20833333333333334, 0, mult * 0.010416666666666666, mult * 0.625]//[10,2,3,20,0,1,60]

		this.sprite = new Sprite({
			master: this.master,
			src: `img/gradient.png`,
			frames: [[0,0,468,540]],
			origins: [234,408],
			scale: 1,
			sequences: [0],
			intervals: 100
		})

		this.initHint()
		this.initSellHint()
	}

	getDiscrete(mult){
		return [this.base * mult * 0.10416666666666667, this.base * mult * 0.020833333333333332, this.base * mult * 0.03125, this.base * mult * 0.20833333333333334, 0, 0, this.base * mult * 0.625]
		// return [this.base * mult * 0.10416666666666667, this.base * mult * 0.020833333333333332, this.base * mult * 0.03125, this.base * mult * 0.20833333333333334, 0, this.base * mult * 0.010416666666666666, this.base * mult * 0.625]
	}

	tap(power){

		let acc = 0

		for (let i = 0; i < this.destabilizers.length; i++){
			const d = this.destabilizers[i]
			if (d.state === 2){
				acc += d.tap(power)
			}
		}

		power *= (1 + acc)
		const r = this.getDiscrete(power)
		const scoords = this.master.uvToXYUntranslated(this.position)
		this.master.createChasmTransfer(r, [...this.chasmPath, this.position].reverse())
		// this.master.addResourcesFromArray(r)

	}

	update(dt){

		this.flashTimer -= dt

		if (this.flashTimer <= 0){
			this.flashTimer = this.maxFlashTimer + Math.random() * this.maxFlashTimer

			const entity = this.master.stuff[Math.floor(Math.random() * this.master.stuff.length)]
			
			if (entity.soul === 1){

				const exy = this.master.uvToXYUntranslated(entity.position)
				const gxy = this.master.uvToXYUntranslated(this.position)

				if (this.master.plane){
					const pan = this.master.getPanValueFromX(gxy[0])
					const loudness = Math.max(this.master.getLoudnessFromXY(exy), this.master.getLoudnessFromXY(gxy))
					this.master.playSound(`lightning`, pan, loudness, true)

				}

				entity.soul = 0
				this.master.createLightning([0,0,0,0,0,0,0,0,0,entity.soulPower], exy, gxy, false, [0,1])
			}

		}

	}

	init(){

		this.destabilizers = []
		for (let i = 0; i < this.soi.length; i++){

			const cell = this.master.stuffMap[`u${this.position[0] + this.soi[i][0]}v${this.position[1] + this.soi[i][1]}`]

			if (cell && cell instanceof Destabilizer && !(cell instanceof Destabilizer2a)) {
				this.destabilizers.push(cell)
			}

		}

		this.master.chasm?.updateChain()

	}

	onDelete(){

		// this.master.showUnfilled = false

	}

	render(dt, vposition){

		this.sprite.render(vposition ? vposition : this.position)

	}

	darkrender(dt, vposition){

		// this.sprite.render(vposition ? vposition : this.position)
		const ctx = this.master.ctx

		const height = 3
		const hy = height * this.master.unit
		const dx = 1 * .866 * this.master.unit
		const dy = 1 * .5 * this.master.unit

		const color = ctx.createLinearGradient(0,-dy,0,-hy)
		color.addColorStop(0, `#FFF`)
		color.addColorStop(1, `#FFF0`)
		ctx.fillStyle = color

		ctx.save()
		const xy = this.master.uvToXY(this.position)
		ctx.translate(xy[0], xy[1])

		ctx.beginPath()
		ctx.moveTo(0, -hy - dy)
		ctx.lineTo(dx, -hy)
		ctx.lineTo(dx, 0)
		ctx.lineTo(0, dy)
		ctx.lineTo(-dx, 0)
		ctx.lineTo(-dx, -hy)
		ctx.closePath()
		ctx.fill()

		const gradient = ctx.createRadialGradient(0,0,0,0,0,this.master.unit * 2)
		gradient.addColorStop(0,`#FFF9`)
		gradient.addColorStop(1,`#FFF0`)
		ctx.fillStyle = gradient
		ctx.beginPath()
		ctx.arc(0,0,this.master.unit * 2,0,Math.PI * 2)
		ctx.closePath()
		ctx.fill()

		ctx.restore()

	}

}

class Chasm extends Entity{

	constructor(master){
		super(master)
		this.name = `chasm`
		this.chasmNetwork = 1
		this.chasmNetworkKey = 1
		this.chasmOrder = 0

		// this.measure = {
		// 	totalTime: 120000,
		// 	timer: 1000,
		// 	r0: false
		// }

		this.sprite = new Sprite({
			master: this.master,
			src: `img/chasm.png`,
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

	update(dt){

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
		this.master.chasm.updateChain()

	}

	onDelete(){

		this.master.chasm = undefined

	}

	canHit(){return false}
	onmousedown(){
		
	}

	render(dt, vposition){

		const position = vposition ? vposition : this.position
		this.sprite.renderState(position, 0)

	}

	updateChain(){

		this.chasmNetworkKey++
		this.chasmNetwork = this.chasmNetworkKey
		this.chasmPath = []

		const queue = []
		queue.push(this)

		for (let safe = 0; safe < 1e3; safe++){

			const specimen = queue.shift()

			for (let i = 0; i < specimen.soi.length; i+=2){
				const cell = this.master.entityAtCoordinates([specimen.position[0] + specimen.soi[i][0], specimen.position[1] + specimen.soi[i][1]])
				const condition = (cell && cell.chasmNetwork !== this.chasmNetworkKey && (cell instanceof Conductor || cell instanceof Silo2 || cell instanceof Gradient  || cell instanceof Generaldecay))
				if (condition){
					cell.chasmNetwork = this.chasmNetworkKey
					cell.chasmOrder = specimen.chasmOrder + 1
					cell.chasmPath = [...specimen.chasmPath, specimen.position]
					queue.push(cell)
				}

			}

			if (!queue.length) break
			queue.sort((a,b)=>a.chasmOrder - b.chasmOrder)

		}

	}

}

class Conductor extends Entity{

	constructor(master){
		super(master)
		this.name = `conductor`
		this.variant = 0
		this.chasmNetwork = false

		const df = 1/11
		this.variantMap = {
			bbbb: 0,
			bbab: df,
			abab: df,
			abbb: df,
			bbaa: df*2,
			abba: df*3,
			aabb: df*4,
			baab: df*5,
			aaba: df*6,
			abaa: df*7,
			baaa: df*8,
			aaab: df*9,
			aaaa: df*10
		}

		this.sprite = new Sprite({
			master: this.master,
			src: `img/conductor.png`,
			frames: [[0,0,454,263],[454,0,454,263],[910,0,454,263],[1364,0,454,263],[0,263,454,263],[454,263,454,263],[910,263,454,263],[1364,263,454,263],[0,526,454,263],[454,526,454,263],[910,526,454,263]],
			origins: [226,130],
			scale: 1,
			sequences: [0,1,2,3,4,5,6,7,8,9,10],
			intervals: 100
		})

		this.initHint()
		this.initSellHint()
	}

	init(){

		let map = ``

		for (let i = 0; i < this.soi.length; i+=2){
			const cell = this.master.entityAtCoordinates([this.position[0] + this.soi[i][0], this.position[1] + this.soi[i][1]])
			const condition = (cell && (cell instanceof Conductor || cell instanceof Chasm || cell instanceof Silo2 || cell instanceof Gradient || cell instanceof Generaldecay))
			map += (condition ? `a` : `b`)

		}

		this.variant = this.variantMap[map] || 0
		this.master.chasm?.updateChain()
		this.master.conductors.add(this)

	}

	onDelete(){

		this.master.conductors.delete(this)

	}

	render(dt, vposition){

		this.sprite.renderState(vposition ? vposition : this.position, this.variant)

	}

}

class Voidsculpture extends Entity{

	constructor(master){
		super(master)
		this.entityHeight = 3.5
		this.name = `voidsculpture`
		
		this.threshold = 512
		this.bridge = false
		this.fuel = [0,0,0,0,0,0,0,0,1]
		this.darkFuel = [0,0,0,0,0,0,0,0,0,1]

		this.sprite = new Sprite({
			master: this.master,
			src: `img/voidsculpture.png`,
			frames: [[0,0,455,1100]],
			origins: [226,968],
			scale: 1,
			sequences: [0],
			intervals: 100
		})
		this.darksprite = new Sprite({
			master: this.master,
			src: `img/voidsculpture_dark.png`,
			frames: [[0,0,455,385]],
			origins: [226,254],
			scale: 1,
			sequences: [0],
			intervals: 100
		})

		this.initHint()
		this.initSellHint()
	}

	getHint(){
		return (this.master.plane === 0 && this.master.bridge) ? this.hints[0] : false
	}
	getDarkHint(){
		return this.master.resources[9] >= this.threshold ? this.hints[1] : false
	}

	initHint(){
		this.hints = [new Cloud(this.master), new Cloud(this.master)]
		this.hints[0].addResourceList([0,0,0,0,0,0,0,0,1])
		this.hints[1].addResourceList([0,0,0,0,0,0,0,0,0,1])
		this.hints[1].setDarkMode()

		this.hints[0].addDescription(`<b>${this.master.words.entities[this.name].name}</b><br/>${this.master.words.entities[this.name].description}`)
		this.hints[0].addQEString(false,true)
	}

	ondarkhover(){}

	init(){

		this.master.voidsculpture = this

	}

	canHit(){
		return (this.master.plane === 0 && this.master.bridge && this.master.resources[8] >= 1) || (this.master.plane === 1)
	}
	canDarkHit(){
		return this.master.resources[9] >= this.threshold
	}

	onDelete(){

		this.master.voidsculpture = false

	}

	ondarkmousedown(){
		if (this.master.resources[9] >= this.threshold){
			this.master.bridge = true
			this.master.substractResourcesFromArray([0,0,0,0,0,0,0,0,0,1])
			this.master.switchPlane(0)
			this.master.playSound(`teleport`,undefined,undefined,undefined,true)
			this.master.createHollowEvent(`#FFF`, 20000)

			//Gamepad
			const gamepad = navigator.getGamepads()[0]
			if (gamepad){
				gamepad.vibrationActuator?.reset()
				gamepad.vibrationActuator?.playEffect(`dual-rumble`,{
				startDelay: 0,
				  duration: 200,
				  weakMagnitude: .2,
				  strongMagnitude: .4,
				})
			}
		}
	}

	onmousedown(){
		if (this.master.bridge && this.master.resources[8] >= 1){
			this.master.substractResourcesFromArray([0,0,0,0,0,0,0,0,1])
			this.master.switchPlane(1)
			this.master.playSound(`teleport`,undefined,undefined,undefined,true)

			//Gamepad
			const gamepad = navigator.getGamepads()[0]
			if (gamepad && gamepad.vibrationActuator){
				gamepad.vibrationActuator?.reset()
				gamepad.vibrationActuator?.playEffect(`dual-rumble`,{
				startDelay: 0,
				  duration: 200,
				  weakMagnitude: .2,
				  strongMagnitude: .4,
				})
			}

		}
	}

	render(dt, vposition){

		this.sprite.render(vposition ? vposition : this.position)

		if (this.master.bridge && !vposition){

			const radius = this.master.unit * 1
			const da = .05
			const time = performance.now() / 1000

			const ctx = this.master.ctx
			const xy = this.master.uvToXY(this.position)
			ctx.save()
			ctx.translate(xy[0], xy[1] - this.master.unit * 3.6)
			ctx.fillStyle = `#000`

			ctx.beginPath()
			ctx.moveTo(radius + radius * Math.sin(time) * .04 + radius * Math.sin(time*1.3) * .04 + radius * Math.sin(-time*1.9) * .02, 0)
			for (let a = da; a < Math.PI * 2; a+=da){

				const r = radius + radius * Math.sin(a * 5 + time) * .04 + radius * Math.sin(a * 4 + time*1.3) * .04 + radius * Math.sin(a * 7 - time*1.9) * .02
				ctx.lineTo(r * Math.cos(a), r * Math.sin(a))

			}

			ctx.closePath()
			ctx.fill()
			ctx.restore()

		}

	}
	darkrender(dt, vposition){

		const position = vposition ? vposition : this.position
		const radius = this.master.unit * (Math.min(1, this.master.resources[9] / this.threshold) + .01)
		const da = .05
		const time = performance.now() / 1000

		this.darksprite.render(vposition ? vposition : this.position)

		const ctx = this.master.ctx
		const xy = this.master.uvToXY(position)
		ctx.save()
		ctx.translate(xy[0], xy[1] - this.master.unit)
		ctx.fillStyle = `#FFF`

		ctx.beginPath()
		ctx.moveTo(radius + radius * Math.sin(time) * .04 + radius * Math.sin(time*1.3) * .04 + radius * Math.sin(-time*1.9) * .02, 0)
		for (let a = da; a < Math.PI * 2; a+=da){

			const r = radius + radius * Math.sin(a * 5 + time) * .04 + radius * Math.sin(a * 4 + time*1.3) * .04 + radius * Math.sin(a * 7 - time*1.9) * .02
			ctx.lineTo(r * Math.cos(a), r * Math.sin(a))

		}

		ctx.closePath()
		ctx.fill()

		if (this.master.resources[9] >= this.threshold){
			const gradient = ctx.createRadialGradient(0,0,0,0,0,this.master.unit * 8)
			gradient.addColorStop(0,`#FFF9`)
			gradient.addColorStop(1,`#FFF0`)
			ctx.fillStyle = gradient
			ctx.beginPath()
			ctx.arc(0,0,this.master.unit * 8,0,Math.PI * 2)
			ctx.closePath()
			ctx.fill()
		}

		ctx.restore()

	}
	renderDarkHint(){

		const ctx = this.master.ctx


		const startAngle = -Math.PI / 2
		const endAngle = Math.PI * 2 * Math.min(1, this.master.resources[9] / this.threshold) + startAngle
		
		const radius = this.master.pixelRatio * 10

		ctx.lineCap = `round`

		ctx.lineWidth = this.master.pixelRatio * 2
		ctx.strokeStyle = `#fff`
		ctx.beginPath()
		ctx.arc(0, 0, radius, startAngle, endAngle)
		ctx.stroke()

		if (this.master.resources[9] > this.threshold){
			ctx.fillStyle = `#FFF`
			ctx.beginPath()
			ctx.arc(0, 0, this.master.unit * .06, 0, Math.PI * 2)
			ctx.closePath()
			ctx.fill()

			ctx.fillStyle = `#000`
			ctx.font = this.master.bigFont
			ctx.textAlign = `left`
			ctx.save()
			ctx.translate(this.master.unit / 2,0)
			ctx.scale(.5, .5)

			const sprite = this.master.resourcesSprites[9]
			const p = [0, this.master.unit * .6]
			ctx.fillRect(-this.master.unit / 3, -this.master.unit / 3 + p[1], this.master.unit * 1, this.master.unit * .65)
			const mask = sprite.frames[sprite.sequences[sprite.currentSequence][sprite.currentFrame]]
			const origin = sprite.origins[sprite.sequences[sprite.currentSequence][sprite.currentFrame]]
			const scale = this.master.unit * 1.737 / mask[2] * sprite.scale

			ctx.drawImage(
				sprite.img, 
				mask[0], 
				mask[1], 
				mask[2], 
				mask[3], 
				p[0] - origin[0]*scale, 
				p[1] - origin[1]*scale, 
				mask[2]*scale, 
				mask[3]*scale
			)

			ctx.fillStyle = `#FFF`
			ctx.fillText(1, p[0] + this.master.unit/3, p[1])
			ctx.restore()


		}
			
	}

}

class Hollow extends Entity{

	constructor(master, owner){
		super(master)
		this.name = `hollow`
		this.integrity = 1
		this.state = 2
		this.indestructible = true

		this.soulPower = 0

		this.sprite = new Sprite({
			master: this.master,
			src: `img/hollow.png`,
			frames: [[0,0,455,312],[455,0,455,312],[910,0,455,312],[0,312,455,312],[455,312,455,312],[910,312,455,312]],
			origins: [226,180],
			scale: 1,
			sequences: [[0],[1],[2],[3],[4],[5]],
			intervals: 100
		})

		this.darksprite = new Sprite({
			master: this.master,
			src: `img/vent.png`,
			frames: [[0,0,454,831]],
			origins: [227, 700],
			scale: 1,
			sequences: [0],
			intervals: 100
		})
	}

	updateSoul(){this.soul = 1}

	initHint(){}

	ondarkhover(){
		
	}

	canHit(){
		return true
	}

	getOwner(){
		return this.master.hollowSite
	}

	init(){

		if (!this.variant) this.variant = Math.floor(Math.random() * this.sprite.sequences.length)
		this.sprite.switchSequence(this.variant)

	}

	onmousedown(){

		if (this.state === 2){

			this.integrity -= 1 / this.master.hollowHardness

			const screenxy = this.master.uvToXYUntranslated(this.position)
			const pan = this.master.getPanValueFromX(screenxy[0])
			const loudness = this.master.getLoudnessFromXY(screenxy)
			this.master.playSound(`hollow`, pan, loudness)
			this.master.createResourceExplosion([0,0,0,0,0,0,0,64],screenxy)

			if (this.integrity <= 0 && !this.killme){

				const screenxy = this.master.uvToXYUntranslated(this.position)
				const pan = this.master.getPanValueFromX(screenxy[0])
				const loudness = this.master.getLoudnessFromXY(screenxy)
				this.master.playSound(`break`, pan, loudness)
				this.master.createResourceTransfer([0,0,0,0,0,0,0,1], screenxy)

				this.master.hollowHardness = Math.max(4, this.master.hollowHardness / 2)
				this.killme = true
				this.state = 3

			}
		}
	}

	onDelete(){
		const hollowSite = this.getOwner()
		if (hollowSite) hollowSite.spawnedHollows--
	}

	render(dt, vposition){

		this.sprite.render(vposition ? vposition : this.position)

	}

}

class Flower extends Entity{

	constructor(master, owner){
		super(master)
		this.entityHeight = 2
		this.name = `flower`
		this.soulPower = 32

		this.sprite = new Sprite({
			master: this.master,
			src: `img/flower.png`,
			frames: [[0,0,455,847]],
			origins: [226,716],
			scale: 1,
			sequences: [[0]],
			intervals: 100
		})

		this.initHint()
		this.initSellHint()
	}

	canHit(){
		return false
	}

	getOwner(){
		return this.master.hollowSite
	}

	init(){

	}

	onmousedown(){

	}

	onDelete(){
		const hollowSite = this.getOwner()
	}

	render(dt, vposition){

		this.sprite.render(vposition ? vposition : this.position)

	}

}

class Fruit extends Flower{

	constructor(master, owner){
		super(master)
		this.name = `fruit`
		this.soulPower = 128

		this.conversion = 0
		this.baseConversionSpeed = 1e-5
		this.state = 0

		this.sprite = new Sprite({
			master: this.master,
			src: `img/fruit.png`,
			frames: [[0,0,455,480],[455,0,455,480]],
			origins: [[227,341],[227,240]],
			scale: 1,
			sequences: [[0,1]],
			intervals: 100
		})

		this.initHint()
		this.initSellHint()
	}

	getHint(){
		return this.hints[1]
	}

	seed(){

		if (!this.state){
			this.state = 2//zzz
			this.conversion = 0
			return true
		}

		return false
	}

	update(dt){

		if (this.state === 2){
			this.conversion += (this.baseConversionSpeed + (this.baseConversionSpeed * .1 * (Math.random() * 2 - 1))) * dt
			if (this.conversion >= 1){
				this.state = 0
				const screenxy = this.master.uvToXYUntranslated(this.position)
				const pan = this.master.getPanValueFromX(screenxy[0])
				const loudness = this.master.getLoudnessFromXY(screenxy)
				this.master.createResourceTransfer(this.getResourceFromFraction(this.conversion), screenxy)
				this.conversion = 0
				this.master.playSound(`hollow`, pan, loudness)
			}
		}

	}

	getResourceFromFraction(f){
		const base = f * 8
		const add = f * 8 * Math.random()
		return [0,0,0,0,0,0,0,base + add]
	}

	canHit(){
		return this.state === 2
	}

	init(){
		this.master.fruits.add(this)
	}

	onmousedown(){
		if (this.state === 2){

			this.state = 0
			const screenxy = this.master.uvToXYUntranslated(this.position)
			const pan = this.master.getPanValueFromX(screenxy[0])
			const loudness = this.master.getLoudnessFromXY(screenxy)
			this.master.createResourceTransfer(this.getResourceFromFraction(this.conversion), screenxy)
			this.master.playSound(`hollow`, pan, loudness)

		}
	}

	onDelete(){
		this.master.fruits.delete(this)
	}

	render(dt, vposition){

		const position = vposition ? vposition : this.position
		this.sprite.renderState(position, 0)
		if (this.state === 2) this.sprite.renderState([position[0] - 1.3, position[1] - 1.3], 1, false, this.conversion)

	}

	// drawHint(){
	// 	if (this.conversion && this.state === 2){

	// 		const ctx = this.master.ctx
	// 		const startAngle = -Math.PI / 2
	// 		const endAngle = Math.PI * 2 * this.conversion + startAngle
			
	// 		const radius = this.master.pixelRatio * 16

	// 		ctx.lineCap = `round`

	// 		ctx.fillStyle = `#0003`
	// 		ctx.beginPath()
	// 		ctx.arc(0,0,radius*1.4,0,Math.PI*2)
	// 		ctx.closePath()
	// 		ctx.fill()

	// 		ctx.lineWidth = this.master.pixelRatio * 2
	// 		ctx.strokeStyle = `#fff`
	// 		ctx.beginPath()
	// 		ctx.arc(0, 0, radius, startAngle, endAngle)
	// 		ctx.stroke()

	// 	}
	// }

}

class Vessel extends Entity{

	constructor(master){
		super(master)
		this.name = `vessel`
		this.fill = 0
		this.state = 0
		this.fuel = [0,0,0,0,1]
		this.soulPower = 1

		this.isUsed = false
		this.capacity = 32

		this.sprite = new Sprite({
			master: this.master,
			src: `img/vessel.png`,
			frames: [[0,0,455,391],[455,0,455,391]],
			origins: [226,260],
			scale: 1,
			sequences: [[0,1]],
			intervals: 100
		})

		this.initHint()
		this.initSellHint()
	}

	init(){
		this.isNextToSilo = false
		for (let i = 0; i < this.soi.length; i++){
			const cell = this.master.entityAtCoordinates([this.position[0] + this.soi[i][0], this.position[1] + this.soi[i][1]])
			if (cell instanceof Silo){
				this.isNextToSilo = true
				break
			}
		}
	}

	tap(dt){
		this.fill -= 3e-7 * dt//1e-6 * dt
		if (this.fill <= 0){
			this.fill = 0
			if (this.state === 2) this.shootExhaust()
			this.state = 0
		}
	}

	refill(){
		if (this.state === 0){

			const resources = this.master.requestResources(this.fuel, this.position, _=>{
				this.activate()
			})

			if (resources) this.state = 1

		}
	}

	activate(){
		this.fill = 1
		this.state = 2
	}

	onmousedown(){

		this.refill()

	}

	render(dt, vposition){

		this.sprite.renderState(vposition ? vposition : this.position, this.isUsed ? 1 : 0)

	}

}

class Vessel2 extends Vessel{

	constructor(master){
		super(master)
		this.name = `vessel2`
		this.fuel = [0,0,0,0,0,0,0,0,0,1]
		this.soulPower = 1024

		this.capacity = 32768

		this.sprite = new Sprite({
			master: this.master,
			src: `img/vessel2.png`,
			frames: [[0,0,454,615],[454,0,454,615]],
			origins: [227,484],
			scale: 1,
			sequences: [[0,1]],
			intervals: 100
		})

		this.initHint()
		this.initSellHint()
	}

}

class Silo extends Entity{

	constructor(master){
		super(master)
		this.name = `silo`
		this.fill = 0
		this.state = 0
		this.fuel = [0,256,0,0,2]
		this.dive = 0
		this.diveSpeed = 1e-3
		this.bubbleSpeed = 5e-4
		this.soulPower = .5
		this.chasmNetwork = false
		this.freeTimer = 100

		this.sprite = new Sprite({
			master: this.master,
			src: `img/silo.png`,
			frames: [[0,0,455,594],[455,0,455,594],[910,0,455,594],[1365,0,455,594],[1820,0,455,594],[2275,0,455,594],[0,594,455,594],[455,594,455,594],[910,594,455,594],[1365,594,455,594],[1820,594,455,594],[2275,594,455,594]],
			origins: [226,462],
			scale: 1,
			sequences: [0,1,2,3,4,5,6,7,8,9,10,11],
			intervals: 60
		})

		this.initHint()
		this.initSellHint()

	}

	init(){

		for (let i = 0; i < this.soi.length; i++){
			const cell = this.master.entityAtCoordinates([this.position[0] + this.soi[i][0], this.position[1] + this.soi[i][1]])
			if (cell && cell instanceof Silo){
				this.master.perpetum = true
				break
			}

		}

	}


	tap(){
		if (this.freeTimer <= 0){
			this.fill -= .0625
			if (this.fill <= 0){
				this.fill = 0
				if (this.state === 2) {
					const screenxy = this.master.uvToXYUntranslated(this.position)
					const pan = this.master.getPanValueFromX(screenxy[0])
					const loudness = this.master.getLoudnessFromXY(screenxy)
					this.master.playSound(`silo2`, pan, loudness)
					this.shootExhaust()
				}
				this.state = 4 //Bubbling
			}
			this.freeTimer = 200
		}
	}


	update(dt){

		if (this.state === 0 && this.chasmNetwork === this.master.chasm?.chasmNetwork) {
			
			const good = this.refill()
			if (good){
				this.master.createChasmTransfer(this.fuel, [...this.chasmPath, this.position], _=>{})
			}
		}

		if (this.state === 2){

			this.dive = 1
			if (this.freeTimer > 0) this.freeTimer -= dt

			for (let i = 0; i < this.soi.length; i++){

				const cell = this.master.stuffMap[`u${this.position[0] + this.soi[i][0]}v${this.position[1] + this.soi[i][1]}`]
				if (cell && cell.canHit() && cell.refill && !(cell instanceof Silo)){

					const request = cell.fuel
					let ok = true
					for (let j = 0; j < cell.fuel.length; j++){
						if (cell.fuel[j] && this.master.resources[j] < cell.fuel[j]){
							ok = false
							break
						}
					}
					if (ok){

						cell.refill()
						this.tap()

					}

				}

			}

		} else if (this.state === 3){

			//Diving
			this.dive += this.diveSpeed * dt
			if (this.dive >= 1){
				this.state = 2
				this.freeTimer = 100
			}

		} else if (this.state === 4){

			//Bubbling
			this.dive -= this.bubbleSpeed * dt
			if (this.dive <= 0){
				this.dive = 0
				this.state = 0
			}

		}
	}

	onmousedown(){

		this.refill()

	}

	refill(){
		if (this.state === 0){

			const resources = this.master.requestResources(this.fuel, this.position, _=>{
				this.activate()
			})

			if (resources) {

				this.state = 1
				return true
			}

		}

		return false
	}

	activate(){
		const screenxy = this.master.uvToXYUntranslated(this.position)
		const pan = this.master.getPanValueFromX(screenxy[0])
		const loudness = this.master.getLoudnessFromXY(screenxy)
		this.master.playSound(`silo`, pan, loudness)

		this.fill = 1
		this.state = 3
	}

	render(dt, vposition){

		this.sprite.renderState(vposition ? vposition : this.position, this.dive)

	}

}

class Silo2 extends Silo{

	constructor(master){
		super(master)
		this.name = `silo2`
		this.fuel = [0,1024,0,0,8,16]
		this.diveSpeed = 2e-3
		this.bubbleSpeed = 1e-3
		this.soulPower = 1

		this.sprite = new Sprite({
			master: this.master,
			src: `img/silo2.png`,
			frames: [[0,0,455,594],[455,0,455,594],[910,0,455,594],[1365,0,455,594],[1820,0,455,594],[2275,0,455,594],[0,594,455,594],[455,594,455,594],[910,594,455,594],[1365,594,455,594],[1820,594,455,594],[2275,594,455,594]],
			origins: [226,462],
			scale: 1,
			sequences: [0,1,2,3,4,5,6,7,8,9,10,11],
			intervals: 60
		})

		this.initHint()
		this.initSellHint()
	}

	init(){

		for (let i = 0; i < this.soi.length; i++){
			const cell = this.master.entityAtCoordinates([this.position[0] + this.soi[i][0], this.position[1] + this.soi[i][1]])
			if (cell && cell instanceof Silo){
				this.master.perpetum = true
				break
			}

		}

		this.master.chasm?.updateChain()

	}

	tap(){
		if (this.freeTimer <= 0){
			this.fill -= .015625
			if (this.fill <= 0){
				this.fill = 0
				if (this.state === 2) {

					const screenxy = this.master.uvToXYUntranslated(this.position)
					const pan = this.master.getPanValueFromX(screenxy[0])
					const loudness = this.master.getLoudnessFromXY(screenxy)
					this.master.playSound(`silo2`, pan, loudness)
					this.shootExhaust()

					this.shootExhaust()
				}
				this.state = 4 //Bubbling
			}
			this.freeTimer = 200
		}

	}

}

class Waypoint extends Entity{

	constructor(master, owner){
		super(master)
		this.name = `waypoint`
		this.soulPower = 2
		this.fuel = [0,0,0,0,512]

		this.sprite = new Sprite({
			master: this.master,
			src: `img/waypoint.png`,
			frames: [[0,0,455,616],[455,0,455,616],[910,0,455,616]],
			origins: [226,484],
			scale: 1,
			sequences: [0,1,2],
			intervals: 60
		})

		this.initHint()
		this.initSellHint()
	}

	canHit(){
		return true
	}

	getHint(){
		return this.hint
	}

	initHint(){

		this.hint = new Cloud(this.master)
		this.hint.addResourceList([0,0,0,0,512])

		this.hint.addDescription(`<b>${this.master.words.entities[this.name].name}</b><br/>${this.master.words.entities[this.name].description}`)
		this.hint.addQEString(true,true)

	}

	init(){

		this.order = this.master.addWaypoint(this, this.order)
		
	}

	onmousedown(){

		const good = this.master.requestResources([0,0,0,0,512],this.position)

		if (good){
			const prerequisites = this.master.voidsculpture && !this.master.switchedplanes && (Math.random() < .5)
			if (prerequisites){

				this.master.switchedplanes = true
				this.master.switchPlane(1)
				this.master.playSound(`teleport`,undefined,undefined,undefined,true)
				this.master.createHollowEvent(`#000`, this.master.voidsculpture ? 1000 : 10000)

				//Gamepad
				const gamepad = navigator.getGamepads()[0]
				if (gamepad && gamepad.vibrationActuator){
					gamepad.vibrationActuator?.reset()
					gamepad.vibrationActuator?.playEffect(`dual-rumble`,{
					startDelay: 0,
					  duration: 200,
					  weakMagnitude: .4,
					  strongMagnitude: .6,
					})
				}

			} else {

				this.master.useWaypoint(this)
				this.master.playSound(`teleport`,undefined,undefined,undefined,true)
				this.master.createHollowEvent(`#000`, this.master.voidsculpture ? 1000 : 10000)
				this.master.stats.timesTeleported++

				//Gamepad
				const gamepad = navigator.getGamepads()[0]
				if (gamepad && gamepad.vibrationActuator){
					gamepad.vibrationActuator?.reset()
					gamepad.vibrationActuator?.playEffect(`dual-rumble`,{
					startDelay: 0,
					  duration: 200,
					  weakMagnitude: .2,
					  strongMagnitude: 0,
					})
				}

			}
		}
		
	}

	onDelete(){

		this.master.removeWaypoint(this)
		
	}

	render(dt, vposition){

		this.sprite.render(vposition ? vposition : this.position, dt)

	}

	// drawHint(){

	// 	const ctx = this.master.ctx

	// 	ctx.font = this.master.bigFont
	// 	ctx.textAlign = `left`
	// 	ctx.save()
	// 	ctx.translate(this.master.unit / 2,0)
	// 	ctx.scale(.5, .5)

	// 	ctx.globalAlpha = 1
	// 	ctx.fillStyle = `#FFFE`
		
	// 	const sprite = this.master.resourcesSprites[4]
	// 	ctx.fillRect(-this.master.unit / 3, -this.master.unit / 3, this.master.unit * (1.4), this.master.unit * .6)
	// 	const mask = sprite.frames[sprite.sequences[sprite.currentSequence][sprite.currentFrame]]
	// 	const origin = sprite.origins[sprite.sequences[sprite.currentSequence][sprite.currentFrame]]
	// 	const scale = this.master.unit * 1.737 / mask[2] * sprite.scale

	// 	ctx.globalAlpha = this.master.resources[4] >= 512 ? 1 : .3

	// 	ctx.drawImage(
	// 		sprite.img, 
	// 		mask[0], 
	// 		mask[1], 
	// 		mask[2], 
	// 		mask[3], 
	// 		-origin[0]*scale, 
	// 		-origin[1]*scale, 
	// 		mask[2]*scale, 
	// 		mask[3]*scale
	// 	)

	// 	ctx.fillStyle = `#000`
	// 	ctx.fillText(512, this.master.unit/3, 0)
		

	// 	ctx.restore()

	// }

}

class Annihilator extends Entity{

	constructor(master){
		super(master)
		this.name = `annihilator`
		this.value = 1

		this.fill = 0
		this.state = 0
		this.fuel = [0,0,0,0,0,0,0,1]
		this.soulPower = 2

		this.transitionTime = 900
		this.transitionState = 0

		this.sprite = new Sprite({
			master: this.master,
			src: `img/annihilator.png`,
			frames: [[0,0,455,480],[455,0,455,480],[910,0,455,480],[1365,0,455,480],[1820,0,455,480],[2275,0,455,480],[0,480,455,480],[455,480,455,480],[910,480,455,480],[1365,480,455,480],[1820,480,455,480],[0,960,455,480],[455,960,455,480],[910,960,455,480],[1365,960,455,480],[1820,960,455,480],[2275,960,455,480]],
			origins: [226, 348],
			scale: 1,
			sequences: [[16],[0,1,2,3,4,5,6,7,8,9,10],[15,14,13,12,11],[11,12,13,14,15]],
			intervals: 100
		})

		this.sprite.switchSequence(0)
		this.initHint()
		this.initSellHint()
	}

	onDelete(){
		this.master.annihilators.delete(this)
	}

	init(){

		this.master.annihilators.add(this)
		if (this.state === 2 && this.sprite.currentSequence === 0) {
			this.timer = this.transitionTime
			this.sprite.switchSequence(2)
		}

		this.isNextToSilo = false
		for (let i = 0; i < this.soi.length; i++){
			const cell = this.master.entityAtCoordinates([this.position[0] + this.soi[i][0], this.position[1] + this.soi[i][1]])
			if (cell instanceof Silo){
				this.isNextToSilo = true
				break
			}
		}

	}

	tap(){
		if (this.state === 2){
			this.fill -= .03125
			if (this.fill <= 0){
				this.fill = 0
				if (this.state === 2) this.shootExhaust()
				this.state = 0
				this.sprite.switchSequence(3)
				this.timer = this.transitionTime
			}

			const screenxy = this.master.uvToXYUntranslated(this.position)
			this.master.createResourceSpark([0,0,0,0,0,0,0,0,1], screenxy)
			this.master.createResourceTransfer([0,0,0,0,0,0,0,0,1], screenxy)
			this.master.createResourceExplosion([0,0,0,0,0,0,0,0,16], screenxy)
			if (!this.master.voidsculpture) this.master.createHollowEvent(`#60F1`,500)

			return true
		}
		return false
	}

	refill(){
		if (this.state === 0){

			const resources = this.master.requestResources(this.fuel, this.position, _=>{
				this.activate()
			})
			if (resources) this.state = 1

		}
	}

	activate(){
		this.fill = 1
		this.state = 2

		this.sprite.switchSequence(2)
		this.timer = this.transitionTime
	}

	onmousedown(){

		this.refill()

	}

	render(dt, vposition){
		if (this.sprite.currentSequence === 2 || this.sprite.currentSequence === 3){
			this.sprite.renderState(vposition ? vposition : this.position, this.transitionState)
		} else {
			this.sprite.render(vposition ? vposition : this.position, dt)
		}

	}

	update(dt){

		if (this.sprite.currentSequence === 2 || this.sprite.currentSequence === 3){

			this.timer -= dt
			this.transitionState = Math.min(1, 1 - this.timer / this.transitionTime)

			if (this.timer <= 0){

				this.transitionState = 0
				this.sprite.switchSequence(this.sprite.currentSequence === 2 ? 1 : 0)

			}

		}

	}

}

class Surge extends Entity{

	constructor(master, args){
		super(master)
		this.name = `surge`
		this.soulPower = 8
		this.resources = args.resources
		this.grade = args.grade || 0
		this.rayNumber = args.rayNumber
		this.colors = args.colors
		this.type = args.type
		this.indestructible = true

		this.maxHarvestTimer = 400
		this.harvestTimer = 400
		this.harvestProgression = 0
		this.mouseDistance = Infinity
		const life = 12000 + Math.random() * 28000
		this.maxLifeTimer = args.maxLife || life
		this.lifeTimer = args.life || life
		this.ripeTime = 1000
		this.ripeTimer = 0
		this.ripe = 0

		this.done = false

	}

	getHint(){return false}

	init(){

		const n = this.getNeighbours()
		
		for (let i = 0; i < n.length; i++){
			if (n[i] && n[i] instanceof Stabilizer){
				n[i].init()
			}
		}

	}

	setPosition(uv){

		this.position = uv

		this.rays = []
		for (let i = 0; i < this.rayNumber; i++){

			const originOffset = [Math.random() * .4 - .2, Math.random() * .4 - .2]

			const endControlAngle = Math.random() * Math.PI * 2
			const endControlRadius = Math.random() * 3
			const endControlOffset = [Math.cos(endControlAngle) * endControlRadius, Math.sin(endControlAngle) * endControlRadius]
			
			const height = Math.random() * 2
			const color = `#000`

			const rad = Math.random() * 2 - 1
			const sp = Math.random() * 2 - 1

			const p = this.master.uvToXY(this.position)
			const u = this.master.unit

			this.rays.push({
				originOffset: originOffset,
				endControlOffset: endControlOffset,
				height: height, 
				color: this.colors[Math.floor(Math.random() * this.colors.length)],
				r: rad,
				s: sp,
				dr: Math.random(),
				rs: Math.random(),
				reach: .5 + Math.random()
			})

		}

		return this

	}

	onDelete(){
		if (this.stabilizer){
			this.stabilizer.surge = false
			this.stabilizer.init()
		}
	}

	update(dt){

		
		if (this.ripe < 1){
			this.ripeTimer += dt
			this.ripe = this.ripeTimer / this.ripeTime
			if (this.ripe >= 1){
				this.ripe = 1
			}
		}

		if (this.stabilizer){

			this.lifeTimer -= dt * this.stabilizer.stabilization

		} else {

			this.lifeTimer -= dt

			const mUV = this.master.xyToUV(this.master.mouse.offsetxy)
			this.mouseDistance = ((this.position[0] - mUV[0]) ** 2 + (this.position[1] - mUV[1]) ** 2) ** .5

			if (this.mouseDistance < .75 || this.harvestProgression){
				if (!this.harvestProgression){
					const pan = this.master.getPanValueFromX(this.master.uvToXYUntranslated(this.position)[0])
					this.master.playSound(`collect`, pan, .4)
				}
				this.harvestTimer -= dt
				this.harvestProgression = 1 - this.harvestTimer / this.maxHarvestTimer
			}

			if (this.harvestProgression >= 1 && !this.killme){
				this.harvestProgression = 1
				this.killme = true
				this.master.createResourceTransfer(this.resources, this.master.mouse.xy)

				const pan = this.master.getPanValueFromX(this.master.uvToXYUntranslated(this.position)[0])
				for (let i = 0; i < this.resources.length; i++){
					if (this.resources[i]){
						this.master.playSound(this.master.codex.resources[i].sfx, pan, 1)
						this.master.playSound(`lightning`, pan, .4)
					}
				}
			}

		}

		if (this.lifeTimer <= 0){
				this.killme = true
			this.master.createResourceExplosion(this.resources, this.master.uvToXYUntranslated(this.position))

			const screenxy = this.master.uvToXYUntranslated(this.position)
			const pan = this.master.getPanValueFromX(screenxy[0])
			const loudness = this.master.getLoudnessFromXY(screenxy)
			this.master.playSound(`lightning`, pan, loudness * .2)
		}

	}

	render(dt, vposition){

		const ctx = this.master.ctx
		const p = this.master.uvToXY(this.position)

		ctx.lineWidth = this.master.pixelRatio * 2

		if (this.rays && !this.done){
			const t = this.master.time.lt / 600
			for (let i = 0; i < this.rays.length; i++){

				const r = this.rays[i]
				const u = this.master.unit

				ctx.strokeStyle = r.color
				ctx.beginPath()

				// ctx.stroke()
				const rr = r.r + Math.cos(t * r.rs) * r.dr
				const endXY_a = [this.position[0] + Math.cos(t * r.s) * rr, this.position[1] + Math.sin(t * r.s) * rr]
				const mouseUV = this.master.xyToUV(this.master.mouse.offsetxy)
				const endXY_b = this.stabilizer ? this.stabilizer.attractorPosition : [mouseUV[0] - .5, mouseUV[1] - .5]
				const d = ((endXY_b[0] - this.position[0]) ** 2 + (endXY_b[1] - this.position[1]) ** 2) ** .5
				const f = this.stabilizer ? 0 : this.harvestProgression > 0 ? 0 : Math.min(Math.max(0, (d * r.reach - 1) / 2), 1)

				const endXY = [endXY_a[0] * f + endXY_b[0] * (1-f), endXY_a[1] * f + endXY_b[1] * (1-f)]
				const endShift = [-r.height * f + r.endControlOffset[0] * (1 - f), -r.height * f + r.endControlOffset[1] * (1 - f)]

				const line = new Bezier([
					[this.position[0] + r.originOffset[0], this.position[1] + r.originOffset[1]],
					[this.position[0] + r.originOffset[0] - r.height, this.position[1] + r.originOffset[1] - r.height],
					[endXY[0] + endShift[0], endXY[1] + endShift[1]],
					[endXY[0], endXY[1]]
				])

				for (let j = this.harvestProgression; j <= this.ripe; j+=.1){

					const xy = this.master.uvToXY(line.getXY(j))
					if (j%1) {
						xy[0] += (Math.random() * 2 - 1) * u * (.02 + f * .04)
						xy[1] += (Math.random() * 2 - 1) * u * (.02 + f * .04)
					}
					ctx.lineTo(xy[0], xy[1])
				}

				ctx.stroke()

			}
		}

		// ctx.fillStyle = `#F00`
		// ctx.beginPath()
		// ctx.arc(p[0], p[1], this.master.unit / 4, 0, Math.PI * 2)
		// ctx.closePath()
		// ctx.fill()

	}

}

class Stabilizer extends Entity{

	constructor(master){
		super(master)
		this.name = `stabilizer`
		this.soulPower = 1
		this.attractorPosition = false

		this.surge = false
		this.timer = -1

		this.stabilization = .02
		this.baseInterval = 2000

		this.sprite = new Sprite({
			master: this.master,
			src: `img/stabilizer.png`,
			frames: [[0,0,455,529]],
			origins: [227,398],
			scale: 1,
			sequences: [0],
			intervals: 100
		})

		this.initHint()
		this.initSellHint()
	}

	initHint(){

		this.hint = new Cloud(this.master)
		if (this.surge) this.hint.addGradeAndProgress(this.surge.grade, this.surge.type, _=>this.surge.lifeTimer / this.surge.maxLifeTimer)

		const description = `<b>${this.master.words.entities[this.name]?.name} ${this.surge ? '(' + this.master.words.resources[this.surge.type] + ')' : ''}</b><br/>${this.master.words.entities[this.name]?.description}`
		this.hint.addDescription(description)
		this.hint.addQEString(this.name !== `stabilizer3`,true)
		
	}

	getHint(){
		// return this.state === 0 ? this.hints[0] : this.state === 2 ? this.hints[1] : false
		return (this.surge || this.master.altActive) ? this.hint : false
	}

	update(dt){

		if (this.power){

			this.power.timer -= dt
			if (this.power.timer <= 0){
				this.power.timer = this.power.maxTimer + (Math.random() * 2 - 1) * this.power.maxTimer * .5
				this.power.f()
			}

		}

	}

	setPosition(uv){

		this.position = uv
		this.attractorPosition = [uv[0] - 1.5, uv[1] - 1.5]
		this.init()
		return this

	}

	init(){

		let previousSurge = -1
		this.master.stabilizers.add(this)

		if (this.surge) {
			previousSurge = this.surge
			this.surge.stabilizer = false
			this.surge = false
		}

		let multipleSurgeSpawner = false
		const stabilizers = Array.from(this.master.stabilizers)
		for (let i = 0; i < stabilizers.length; i++){
			if (stabilizers[i].surge.type === 5) {
				multipleSurgeSpawner = true
				break
			}
		}

		let surges = []
		const n = this.getNeighbours()
		
		for (let i = 0; i < n.length; i++){
			if (n[i] && n[i] instanceof Surge && !n[i].harvestProgression){
					if (!n[i].stabilizer && !(multipleSurgeSpawner && n[i].type === 5)) surges.push(n[i])
					if (n[i] === previousSurge){
						surges = [n[i]]
						break
					}
			}
		}

		if (surges.length){
			const id = Math.floor(Math.random() * surges.length)
			this.surge = surges[id]
			this.surge.stabilizer = this
		}

		this.initSurgePower()
		this.initHint()

	}

	initSurgePower(){

		if (this.surge){

			const t = this.surge.type
			const g = this.surge.grade
			const strength = g === 0 ? 2 : g === 1 ? 4 : 8
			const conversion = g === 0 ? .6 : g === 1 ? .75 : .9

			const times = [
				g === 0 ? this.baseInterval * 8 : g === 1 ? this.baseInterval * 4 : this.baseInterval * 2,
				g === 0 ? this.baseInterval * 16 : g === 1 ? this.baseInterval * 12 : this.baseInterval * 6,
				g === 0 ? this.baseInterval * 4 : g === 1 ? this.baseInterval * 1 : this.baseInterval * .5,
				g === 0 ? this.baseInterval * 4 : g === 1 ? this.baseInterval * 2 : this.baseInterval,
				g === 0 ? this.baseInterval * 18 : g === 1 ? this.baseInterval * 12 : this.baseInterval * 8,
				g === 0 ? this.baseInterval * 48 : g === 1 ? this.baseInterval * 32 : this.baseInterval * 24,
				g === 0 ? this.baseInterval * 4 : g === 1 ? this.baseInterval * 2 : this.baseInterval,
				g === 0 ? this.baseInterval * 24 : g === 1 ? this.baseInterval * 18 : this.baseInterval * 12,
				g === 0 ? this.baseInterval * 18 : g === 1 ? this.baseInterval * 12 : this.baseInterval * 8,
				g === 0 ? this.baseInterval * 48 : g === 1 ? this.baseInterval * 32 : this.baseInterval * 24
			]
			const functions = [
				m=>{
					const pumps = Array.from(this.master.pumps)
					const dice = Math.floor(Math.random() * pumps.length)
					if (pumps[dice]) {
						pumps[dice].boost()
						const screenxy = this.master.uvToXYUntranslated(this.attractorPosition)
						const pan = this.master.getPanValueFromX(screenxy[0])
						const loudness = this.master.getLoudnessFromXY(screenxy)
						this.master.playSound(`lightning`, pan, loudness, this.master.plane ? true : false)
						this.master.createLightning([], screenxy, this.master.uvToXYUntranslated(pumps[dice].position), _=>{}, [1,0], `#112`)
					}

				},
				m=>{
					const unfilled = Array.from(this.master.unfilledEntities)
					const dice = Math.floor(Math.random() * unfilled.length)
					if (unfilled[dice]) {
						unfilled[dice].onmousedown(strength)
						const screenxy = this.master.uvToXYUntranslated(this.attractorPosition)
						const pan = this.master.getPanValueFromX(screenxy[0])
						const loudness = this.master.getLoudnessFromXY(screenxy)
						this.master.playSound(`lightning`, pan, loudness, this.master.plane ? true : false)
						this.master.createLightning([], screenxy, this.master.uvToXYUntranslated(unfilled[dice].position), _=>{}, [1,0], `#FA3`)
					}
				},
				m=>{
					const cubes = Array.from(this.master.activeCubes)
					const dice = Math.floor(Math.random() * cubes.length)
					if (cubes[dice]) {
						cubes[dice].onmousedown(strength)
						const screenxy = this.master.uvToXYUntranslated(this.attractorPosition)
						const pan = this.master.getPanValueFromX(screenxy[0])
						const loudness = this.master.getLoudnessFromXY(screenxy)
						this.master.playSound(`lightning`, pan, loudness, this.master.plane ? true : false)
						this.master.createLightning([], screenxy, this.master.uvToXYUntranslated(cubes[dice].position), _=>{}, [1,0], `#863DFF`)
					}
				},
				m=>{
					const cubes = Array.from(this.master.activeCubes)
					const dice = Math.floor(Math.random() * cubes.length)
					if (cubes[dice] && cubes[dice].composition[3]) {
						cubes[dice].broken = cubes[dice].broken + (1 - cubes[dice].broken) * .8
						let swapped = 0
						for (let i = 0; i < cubes[dice].resources.length; i++){

							if (cubes[dice].resources[i] === 3) {
								const dice2 = Math.random()
								const rid = dice2 < .92 ? 0 : dice2 < .96 ? 1 : 2
								cubes[dice].resources[i] = rid
								cubes[dice].composition[3] -= 0.015625
								cubes[dice].composition[rid] = cubes[dice].composition[rid] ? cubes[dice].composition[rid] + 0.015625 : 0.015625
								swapped++
							}

						}

						const screenxy = this.master.uvToXYUntranslated(this.attractorPosition)
						const cubeScreenxy = this.master.uvToXYUntranslated(cubes[dice].position)
						const pan = this.master.getPanValueFromX(screenxy[0])
						const loudness = this.master.getLoudnessFromXY(screenxy)
						this.master.playSound(`lightning`, pan, loudness, this.master.plane ? true : false)
						this.master.createLightning([], screenxy, cubeScreenxy, _=>{}, [1,0], `#F26F67`)

						if (swapped){
							const r = [0,0,0,swapped]
							this.master.createResourceTransfer(r, cubeScreenxy)
						}

					}
				},
				m=>{
					const converters = Array.from(this.master.activeConverters)
					const dice = Math.floor(Math.random() * converters.length)
					if (converters[dice]) {
						
						converters[dice].conversion = converters[dice].conversion + (1 - converters[dice].conversion) * conversion
						const screenxy = this.master.uvToXYUntranslated(this.attractorPosition)
						const pan = this.master.getPanValueFromX(screenxy[0])
						const loudness = this.master.getLoudnessFromXY(screenxy)
						this.master.playSound(`lightning`, pan, loudness, this.master.plane ? true : false)
						this.master.createLightning([], screenxy, this.master.uvToXYUntranslated(converters[dice].position), _=>{}, [1,0], `#A6F246`)
					}
				},
				m=>{
					this.master.spawnSurge()
				},
				m=>{
					this.master.forcedAnnihilation = true
				},
				m=>{
					if (this.master.hollowSite.spawnHollow && this.master.hollowSite.spawnedHollows < this.master.hollowSite.maxSpawnedHollows){

						this.master.hollowSite.spawnHollow()

					}
				},
				m=>{
					const stabilizers = Array.from(this.master.stabilizers)
					const stabilizers2 = []
					let theone = false
					for (let i = 0; i < stabilizers.length; i++){
						if (stabilizers[i] instanceof Stabilizer2 && stabilizers[i].surge && stabilizers[i] !== this) {
							stabilizers2.push(stabilizers[i])
							if (!this.master.entitiesInGame.stabilizer3 && stabilizers[i].surge.type === 9) theone = stabilizers[i]
						}
					}
					if (theone){

						const uv = theone.position
						this.master.clearCell(uv)
						this.master.addEntity(`stabilizer3`, uv)

					} else if (stabilizers2.length){

						const dice = Math.floor(Math.random() * stabilizers2.length)
						const one = stabilizers2[dice]
						one.surge.lifeTimer = one.surge.maxLifeTimer
						this.surge.lifeTimer = 64

						const screenxy = this.master.uvToXYUntranslated(this.attractorPosition)
						const pan = this.master.getPanValueFromX(screenxy[0])
						const loudness = this.master.getLoudnessFromXY(screenxy)
						this.master.playSound(`lightning`, pan, loudness, this.master.plane ? true : false)
						this.master.createLightning([], screenxy, this.master.uvToXYUntranslated(one.position), _=>{}, [1,0], `#000`)
					}
				},
				m=>{
					for (let i = 0; i < this.master.stuff.length; i++){
						this.master.stuff[i].updateSoul(strength * 16000)
					}
				}
			]

			this.power = {
				maxTimer: times[t],
				timer: times[t] * 1.5,
				f: functions[t]
			}

		} else {

			this.power = false

		}

	}

	onDelete(){

		if (this.surge) this.surge.stabilizer = false
		this.master.stabilizers.delete(this)

	}

	render(dt, vposition){

		const axy = this.attractorPosition ? this.master.uvToXY(this.attractorPosition) : false
		this.sprite.render(vposition ? vposition : this.position)

		if (this.power && this.surge){
			const timeFraction = Math.min(1, this.power.timer / this.power.maxTimer)
			const f = Math.min(.9, Math.max(.04, (timeFraction ** .5) * .6 + (Math.random() * 2 - 1) * .04))
			const delta = this.master.unit * 2
			const gradient = this.master.ctx.createRadialGradient(axy[0],axy[1],0,axy[0],axy[1],delta)
			this.master.ctx.globalAlpha = (1 - timeFraction) * .8
			gradient.addColorStop(f-.04,`#FFF0`)
			gradient.addColorStop(f, this.master.codex.resources[this.surge.type].triplet[Math.floor(Math.random() * 2)])
			gradient.addColorStop(f+.1,`#FFF0`)
			this.master.ctx.fillStyle = gradient
			this.master.ctx.fillRect(axy[0] - delta, axy[1] - delta, delta*2, delta*2)
			this.master.ctx.globalAlpha = 1
		}
		

	}

}

class Stabilizer2 extends Stabilizer{

	constructor(master){
		super(master)
		this.name = `stabilizer2`
		this.soulPower = 16

		this.stabilization = .01
		this.baseInterval = 1000

		this.sprite = new Sprite({
			master: this.master,
			src: `img/stabilizer2.png`,
			frames: [[0,0,455,529]],
			origins: [227,398],
			scale: 1,
			sequences: [0],
			intervals: 100
		})

		this.initHint()
		this.initSellHint()
	}

}

class Stabilizer3 extends Stabilizer{

	constructor(master){
		super(master)
		this.name = `stabilizer3`
		this.soulPower = 64

		this.stabilization = 0
		this.baseInterval = 500

		this.sprite = new Sprite({
			master: this.master,
			src: `img/stabilizer3.png`,
			frames: [[0,0,455,580]],
			origins: [227,448],
			scale: 1,
			sequences: [0],
			intervals: 100
		})

		this.initHint()
		this.initSellHint()
	}

	setPosition(uv){

		this.position = uv
		this.attractorPosition = [uv[0] - .6, uv[1] - .6]
		this.init()
		return this

	}

}