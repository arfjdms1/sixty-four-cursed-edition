class Sprite {

	constructor(args){

		this.master = args.master

		if (this.master.images[args.src]){
			this.img = this.master.images[args.src]
		} else {
			this.img = new Image()
			this.img.src = args.src
		}

		this.scale = args.scale || 1
		this.frames = args.frames
		this.backframes = args.backframes
		this.sequences = args.sequences ? args.sequences[0].length ? args.sequences : [args.sequences] : [[0]]
		this.intervals = args.intervals.length ? args.intervals : new Array(this.sequences.length).fill(args.intervals)
		
		if (!args.origins[0].length){
			this.origins = []
			for (let i = 0; i < this.frames.length; i++){
				this.origins.push(args.origins)
			}
		} else {
			this.origins = args.origins
		}

		this.switchSequence(0)

	}

	switchSequence(n){
		if (this.sequences[n]) this.currentSequence = n
		this.timer = 0
		this.currentFrame = 0
	}

	update(dt){
		if (dt) {
			this.timer += dt
			if (this.timer > this.intervals[this.currentSequence]){
				this.timer = this.timer % this.intervals[this.currentSequence]
				this.currentFrame++
				if (this.currentFrame > this.sequences[this.currentSequence].length - 1) this.currentFrame = 0
			}
		}
	}

	render(uv,dt,back = false, scaleMult = 1){

		this.update(dt)

		const p = this.master.uvToXY(uv)
		const mask = back ? this.backframes[this.sequences[this.currentSequence][this.currentFrame]] : this.frames[this.sequences[this.currentSequence][this.currentFrame]]
		const origin = this.origins[this.sequences[this.currentSequence][this.currentFrame]]
		const scale = this.master.unit * 1.737 / mask[2] * this.scale * scaleMult

		this.master.ctx.drawImage(
			this.img, 
			mask[0], 
			mask[1], 
			mask[2], 
			mask[3], 
			p[0] - origin[0]*scale, 
			p[1] - origin[1]*scale, 
			mask[2]*scale, 
			mask[3]*scale
		)
	}

	renderState(uv,f,back,scaleMult = 1){

		const p = this.master.uvToXY(uv)
		const frame = Math.min(Math.floor(this.sequences[this.currentSequence].length * f), this.sequences[this.currentSequence].length-1)
		const mask = back ? this.backframes[this.sequences[this.currentSequence][frame]] : this.frames[this.sequences[this.currentSequence][frame]]
		const origin = this.origins[this.sequences[this.currentSequence][frame]]
		const scale = this.master.unit * 1.737 / mask[2] * this.scale * scaleMult

		this.master.ctx.drawImage(
			this.img, 
			mask[0], 
			mask[1], 
			mask[2], 
			mask[3], 
			p[0] - origin[0]*scale, 
			p[1] - origin[1]*scale, 
			mask[2]*scale, 
			mask[3]*scale
		)
	}

	renderXY(xy,dt,back){

		this.update(dt)

		const p = xy
		const mask = back ? this.backframes[this.sequences[this.currentSequence][this.currentFrame]] : this.frames[this.sequences[this.currentSequence][this.currentFrame]]
		const origin = this.origins[this.sequences[this.currentSequence][this.currentFrame]]
		const scale = this.master.unit * 1.737 / mask[2] * this.scale

		this.master.ctx.drawImage(
			this.img, 
			mask[0], 
			mask[1], 
			mask[2], 
			mask[3], 
			p[0] - origin[0]*scale, 
			p[1] - origin[1]*scale, 
			mask[2]*scale, 
			mask[3]*scale
		)
	}

}

class GLSprite {

	constructor(master, args){

		this.master = master
		this.src = args.src
		this.ratio = args.ratio
		this.unit = args.unit
		this.screenUV = args.screenUV
		this.offsets = args.offsets
		this.svgUpscale = args.svgUpscale

		this.setupGL()

	}

	setupGL(){

		const gl = this.master.glStuff.gl

		this.vertices = [-this.screenUV[0], -this.screenUV[1], this.screenUV[0], -this.screenUV[1], this.screenUV[0], this.screenUV[1], -this.screenUV[0], this.screenUV[1]]
		this.texcoords = [0, 0, this.unit[0], 0, this.unit[0], this.unit[1], 0, this.unit[1]]

		this.pbuffer = gl.createBuffer()
  		gl.bindBuffer(gl.ARRAY_BUFFER, this.pbuffer)
  		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW)

  		this.tbuffer = gl.createBuffer()
  		gl.bindBuffer(gl.ARRAY_BUFFER, this.tbuffer)
  		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.texcoords), gl.STATIC_DRAW)

  		if (!this.master.glStuff.textures[this.src]){
			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
			const image = new Image()
			image.src = this.src
			this.master.glStuff.textures[this.src] = this.texture = gl.createTexture()
			gl.bindTexture(gl.TEXTURE_2D, this.texture)
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255,255,255,0]))
			image.onload = _=>{

				let vcanvas
				if (this.svgUpscale){
					vcanvas = document.createElement(`canvas`)
					vcanvas.width = image.naturalWidth * this.svgUpscale
					vcanvas.height = image.naturalHeight * this.svgUpscale
					const vctx = vcanvas.getContext(`2d`)
					vctx.drawImage(image, 0, 0, vcanvas.width, vcanvas.height)
				}

				gl.bindTexture(gl.TEXTURE_2D, this.texture)
				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.svgUpscale ? vcanvas : image)
			}
		} else {
			this.texture = this.master.glStuff.textures[this.src]
		}

	}

	render(screenuv, offsetId){

		const gl = this.master.glStuff.gl

		gl.bindTexture(gl.TEXTURE_2D, this.texture)
		gl.uniform2fv(this.master.glStuff.uspriteoffset, this.offsets[offsetId || 0])
		gl.uniform2fv(this.master.glStuff.uoffset, screenuv)
		gl.bindBuffer(gl.ARRAY_BUFFER, this.pbuffer)
        gl.vertexAttribPointer(this.master.glStuff.pal, 2, gl.FLOAT, false, 0, 0)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.tbuffer)
        gl.vertexAttribPointer(this.master.glStuff.tal, 2, gl.FLOAT, false, 0, 0)
		gl.drawArrays(gl.TRIANGLE_FAN, 0, 4)

	}

}	