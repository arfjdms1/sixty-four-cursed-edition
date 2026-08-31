import type { EffectCompletion, EffectHost, EffectVisibility, VFXPayload } from './types.js'

export class VFX {
	declare master: EffectHost
	declare oncomplete: EffectCompletion
	declare visibility: EffectVisibility
	declare time: number
	declare maxEndTime: number
	declare terminate: boolean

	constructor(master: EffectHost, payload?: VFXPayload){

		this.master = master
		this.oncomplete = (_value?: unknown)=>{}
		this.visibility = payload?.visibility || [1]

	}

	update(dt: number){

		this.time += dt

		if (this.time >= this.maxEndTime){
			
			this.oncomplete()
			this.terminate = true

		}

	}

	render(){

	}
	
}
