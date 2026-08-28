let ready = true
self.addEventListener(`message`, _=>{
	ready = true
})
const loop = setInterval(_=>{
	if (ready){
		ready = false
		self.postMessage(true)
	}
}, 5)

