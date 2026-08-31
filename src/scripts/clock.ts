import type { ClockWorkerRequest, ClockWorkerTick } from '../types/platform.js'

const workerScope = self as unknown as DedicatedWorkerGlobalScope
let ready = true
workerScope.addEventListener(`message`, (_event: MessageEvent<ClockWorkerRequest>)=>{
	ready = true
})
const loop = setInterval((_event?: unknown)=>{
	if (ready){
		ready = false
		workerScope.postMessage(true satisfies ClockWorkerTick)
	}
}, 5)
