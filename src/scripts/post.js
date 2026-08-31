class PostProcessor {

	constructor(canvas){
		this.canvas = canvas
		this.w = this.canvas.width = this.canvas.offsetWidth * devicePixelRatio
		this.h = this.canvas.height = this.canvas.offsetHeight * devicePixelRatio
		this.gl = this.canvas.getContext(`webgl2`)

		this.vsh = `#version 300 es 
	
	in vec2 a_position;

	void main(){
		gl_Position = vec4(a_position, 0.0, 1.0);
	}`
		this.fsh = `#version 300 es

	precision highp float;
	uniform sampler2D u_image;
	uniform vec2 u_size;
	out vec4 pixelColor;

	void main(void){

		vec2 uv = gl_FragCoord.xy / u_size;
		vec2 delta = uv - vec2(.5);
		vec2 delta1 = delta * 1.005;
		vec2 delta2 = delta * .995;
		float mult = clamp(0., 1., 1. - length(delta));

		vec3 cc = texture(u_image, uv).rgb;
		vec3 c1 = texture(u_image, vec2(.5) + delta1).rgb;
		vec3 c2 = texture(u_image, vec2(.5) + delta2).rgb;

		vec3 final = vec3(c1.r * mult * .95, cc.g * mult * .92, c2.b * mult);
		
		pixelColor = vec4(final, 1.);

	}`

		this.initGL()

	}

	cleanup(){
		this.gl.bindTexture(this.gl.TEXTURE_2D, null)
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null)
		this.gl.deleteTexture(this.source)
		this.gl.deleteBuffer(this.vbuffer)
		this.gl.deleteShader(this.vshader)
		this.gl.deleteShader(this.fshader)
		this.gl.deleteProgram(this.program)

	}

	updateSize(w,h){
		this.w = this.canvas.width = w
		this.h = this.canvas.height = h

		this.gl.bindTexture(this.gl.TEXTURE_2D, this.source)
		this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.w, this.h, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null)
	}

	process(c){

		this.updateTexture(c)
		this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, 4)
		// this.ctx.drawImage(c,0,0)

	}

	initGL(){

		//Vertex Shader
		this.vshader = this.gl.createShader(this.gl.VERTEX_SHADER)
		this.gl.shaderSource(this.vshader, this.vsh)
		this.gl.compileShader(this.vshader)
		if (!this.gl.getShaderParameter(this.vshader, this.gl.COMPILE_STATUS)) throw new Error(this.gl.getShaderInfoLog(this.vshader))

		//Fragment Shader
		this.fshader = this.gl.createShader(this.gl.FRAGMENT_SHADER)
		this.gl.shaderSource(this.fshader, this.fsh)
		this.gl.compileShader(this.fshader)
		if (!this.gl.getShaderParameter(this.fshader, this.gl.COMPILE_STATUS)) throw new Error(this.gl.getShaderInfoLog(this.fshader))

		//Program
		this.program = this.gl.createProgram()
		this.gl.attachShader(this.program, this.vshader)
		this.gl.attachShader(this.program, this.fshader)
		this.gl.linkProgram(this.program)
		if (this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)){
			this.gl.useProgram(this.program)
			this.uniforms = {}
			this.uniforms.size = this.gl.getUniformLocation(this.program, 'u_size')
			this.gl.uniform2fv(this.uniforms.size, [this.w, this.h])

		} else {
			throw new Error(this.gl.getProgramInfoLog(this.program));
		}

		//Geometry
		this.vertices = [-1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0];
		this.vbuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbuffer)
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.gl.STATIC_DRAW);

		//Vertex shader a_position
		this.va = this.gl.createVertexArray();
		this.gl.bindVertexArray(this.va);
		this.gl.enableVertexAttribArray(this.va);
		this.gl.vertexAttribPointer(this.va, 2, this.gl.FLOAT, false, 0, 0);

		//Texture
		this.source = this.gl.createTexture()
		this.gl.bindTexture(this.gl.TEXTURE_2D, this.source)
		this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.w, this.h, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null)
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT)
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT)
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST)
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST)
		this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true)

	}

	updateTexture(t){
		this.gl.bindTexture(this.gl.TEXTURE_2D, this.source)
		this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, t)
	}

}