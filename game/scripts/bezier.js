class Bezier {

	constructor(p){

		this.points = p

	}

	getXY(t){
		const a = -(t**3)+3*t**2-3*t+1
		const b = 3*t**3-6*t**2+3*t
		const c = -3*t**3+3*t**2
		const d = t**3
		return [this.points[0][0] * a + this.points[1][0] * b + this.points[2][0] * c + this.points[3][0] * d, this.points[0][1] * a + this.points[1][1] * b + this.points[2][1] * c + this.points[3][1] * d]
	}

	getDXY(t){
		const a = -3*t**2+6*t-3
		const b = 9*t**2-12*t+3
		const c = -9*t**2+6*t
		const d = 3*t**2

		return {x: this.points[0].x * a + this.points[1].x * b + this.points[2].x * c + this.points[3].x * d, y: this.points[0].y * a + this.points[1].y * b + this.points[2].y * c + this.points[3].y * d}
	}

	getDDXY(t){
		const a = -6*t+6
		const b = 18*t-12
		const c = -18*t+6
		const d = 6*t

		return {x: this.points[0].x * a + this.points[1].x * b + this.points[2].x * c + this.points[3].x * d, y: this.points[0].y * a + this.points[1].y * b + this.points[2].y * c + this.points[3].y * d}
	}

	getNormal(t){

		const d = this.getDXY(t)
		const length = (d.x ** 2 + d.y ** 2) ** .5

		return {x: -d.y / length, y: d.x / length}

	}

	getClosestPoint(x,y){

		const divisions = 32

		const searchRange = (t0, t1)=>{

			const dt = (t1 - t0) / divisions
			let min = Infinity
			let tmin = 0

			for (let t = t0; t <= t1; t += dt){

				const p = this.getXY(t)
				const distance = ((p.x - x) ** 2 + (p.y - y)**2 ) ** .5
				if (distance < min){
					min = distance
					tmin = t
				}

			}

			return {d: min, t: tmin}

		}

		const eps = .1
		let ta = 0
		let tb = 1
		let range = 1
		let lastd = Infinity

		for (let i = 0; i < 32; i++){

			const d = searchRange(ta, tb)
			if (Math.abs(d.d - lastd) < eps){
				const xy = this.getXY(d.t)
				return {x: xy.x, y: xy.y, d: d.d, t: d.t}
			}

			lastd = d.d
			range /= (divisions * 2)
			ta = Math.max(0, d.t - range)
			tb = Math.min(1, d.t + range)

		}
		
	}

	getCurvature(t){
		const d = this.getDXY(t)
		const dd = this.getDDXY(t)
		return (d.x * dd.y - d.y * dd.x) / (d.x ** 2 + d.y ** 2) ** 1.5
	}

	getBoundingBox(){

		const ax = -3 * this.points[0].x + 9 * this.points[1].x - 9 * this.points[2].x + 3 * this.points[3].x
		const ay = -3 * this.points[0].y + 9 * this.points[1].y - 9 * this.points[2].y + 3 * this.points[3].y
		const bx = 6 * this.points[0].x - 12 * this.points[1].x + 6 * this.points[2].x
		const by = 6 * this.points[0].y - 12 * this.points[1].y + 6 * this.points[2].y
		const cx = -3 * this.points[0].x + 3 * this.points[1].x
		const cy = -3 * this.points[0].y + 3 * this.points[1].y

		const tx1 = Math.min(Math.max(((-bx + (bx ** 2 - 4 * ax * cx)**.5) / (2 * ax) || 0), 0), 1)
		const tx2 = Math.min(Math.max(((-bx - (bx ** 2 - 4 * ax * cx)**.5) / (2 * ax) || 0), 0), 1)
		const ty1 = Math.min(Math.max(((-by + (by ** 2 - 4 * ay * cy)**.5) / (2 * ay) || 0), 0), 1)
		const ty2 = Math.min(Math.max(((-by - (by ** 2 - 4 * ay * cy)**.5) / (2 * ay) || 0), 0), 1)

		const p1 = this.getXY(tx1)
		const p2 = this.getXY(tx2)
		const p3 = this.getXY(ty1)
		const p4 = this.getXY(ty2)

		const minx = Math.min(p1.x, p2.x, p3.x, p4.x, this.points[0].x, this.points[3].x)
		const maxx = Math.max(p1.x, p2.x, p3.x, p4.x, this.points[0].x, this.points[3].x)
		const miny = Math.min(p1.y, p2.y, p3.y, p4.y, this.points[0].y, this.points[3].y)
		const maxy = Math.max(p1.y, p2.y, p3.y, p4.y, this.points[0].y, this.points[3].y)

		return [minx, miny, maxx, maxy]

	}

}