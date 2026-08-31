import type { Vec2 } from '../types/core.js'

export type PointTuple = Vec2 | [number, number] | readonly [number, number]

export interface PointObject {
	x: number
	y: number
}

export type BezierPoint =
	| PointTuple
	| PointObject
	| (Record<string, unknown> & { [index: number]: number | undefined })

export type BezierControlPoints =
	| [PointTuple, PointTuple, PointTuple, PointTuple]
	| PointTuple[]
	| [PointObject, PointObject, PointObject, PointObject]
	| PointObject[]
	| BezierPoint[]

export interface ClosestPointResult {
	x: number | undefined
	y: number | undefined
	d: number
	t: number
}

export type BoundingBox = [minx: number, miny: number, maxx: number, maxy: number]

export class Bezier {
	declare points: BezierControlPoints

	constructor(p: BezierControlPoints){

		this.points = p

	}

	getXY(t: number): Vec2 {
		const a = -(t**3)+3*t**2-3*t+1
		const b = 3*t**3-6*t**2+3*t
		const c = -3*t**3+3*t**2
		const d = t**3
		return [(this.points[0] as PointTuple)[0] * a + (this.points[1] as PointTuple)[0] * b + (this.points[2] as PointTuple)[0] * c + (this.points[3] as PointTuple)[0] * d, (this.points[0] as PointTuple)[1] * a + (this.points[1] as PointTuple)[1] * b + (this.points[2] as PointTuple)[1] * c + (this.points[3] as PointTuple)[1] * d]
	}

	getDXY(t: number): PointObject {
		const a = -3*t**2+6*t-3
		const b = 9*t**2-12*t+3
		const c = -9*t**2+6*t
		const d = 3*t**2

		return {x: (this.points[0] as PointObject).x * a + (this.points[1] as PointObject).x * b + (this.points[2] as PointObject).x * c + (this.points[3] as PointObject).x * d, y: (this.points[0] as PointObject).y * a + (this.points[1] as PointObject).y * b + (this.points[2] as PointObject).y * c + (this.points[3] as PointObject).y * d}
	}

	getDDXY(t: number): PointObject {
		const a = -6*t+6
		const b = 18*t-12
		const c = -18*t+6
		const d = 6*t

		return {x: (this.points[0] as PointObject).x * a + (this.points[1] as PointObject).x * b + (this.points[2] as PointObject).x * c + (this.points[3] as PointObject).x * d, y: (this.points[0] as PointObject).y * a + (this.points[1] as PointObject).y * b + (this.points[2] as PointObject).y * c + (this.points[3] as PointObject).y * d}
	}

	getNormal(t: number): PointObject {

		const d = this.getDXY(t)
		const length = (d.x ** 2 + d.y ** 2) ** .5

		return {x: -d.y / length, y: d.x / length}

	}

	getClosestPoint(x: number, y: number): ClosestPointResult | undefined {

		const divisions = 32

		const searchRange = (t0: number, t1: number)=>{

			const dt = (t1 - t0) / divisions
			let min = Infinity
			let tmin = 0

			for (let t = t0; t <= t1; t += dt){

				const p = this.getXY(t) as unknown as PointObject
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
				const xy = this.getXY(d.t) as unknown as PointObject
				return {x: xy.x, y: xy.y, d: d.d, t: d.t}
			}

			lastd = d.d
			range /= (divisions * 2)
			ta = Math.max(0, d.t - range)
			tb = Math.min(1, d.t + range)

		}
		
	}

	getCurvature(t: number): number {
		const d = this.getDXY(t)
		const dd = this.getDDXY(t)
		return (d.x * dd.y - d.y * dd.x) / (d.x ** 2 + d.y ** 2) ** 1.5
	}

	getBoundingBox(): BoundingBox {

		const ax = -3 * (this.points[0] as PointObject).x + 9 * (this.points[1] as PointObject).x - 9 * (this.points[2] as PointObject).x + 3 * (this.points[3] as PointObject).x
		const ay = -3 * (this.points[0] as PointObject).y + 9 * (this.points[1] as PointObject).y - 9 * (this.points[2] as PointObject).y + 3 * (this.points[3] as PointObject).y
		const bx = 6 * (this.points[0] as PointObject).x - 12 * (this.points[1] as PointObject).x + 6 * (this.points[2] as PointObject).x
		const by = 6 * (this.points[0] as PointObject).y - 12 * (this.points[1] as PointObject).y + 6 * (this.points[2] as PointObject).y
		const cx = -3 * (this.points[0] as PointObject).x + 3 * (this.points[1] as PointObject).x
		const cy = -3 * (this.points[0] as PointObject).y + 3 * (this.points[1] as PointObject).y

		const tx1 = Math.min(Math.max(((-bx + (bx ** 2 - 4 * ax * cx)**.5) / (2 * ax) || 0), 0), 1)
		const tx2 = Math.min(Math.max(((-bx - (bx ** 2 - 4 * ax * cx)**.5) / (2 * ax) || 0), 0), 1)
		const ty1 = Math.min(Math.max(((-by + (by ** 2 - 4 * ay * cy)**.5) / (2 * ay) || 0), 0), 1)
		const ty2 = Math.min(Math.max(((-by - (by ** 2 - 4 * ay * cy)**.5) / (2 * ay) || 0), 0), 1)

		const p1 = this.getXY(tx1) as unknown as PointObject
		const p2 = this.getXY(tx2) as unknown as PointObject
		const p3 = this.getXY(ty1) as unknown as PointObject
		const p4 = this.getXY(ty2) as unknown as PointObject

		const minx = Math.min(p1.x, p2.x, p3.x, p4.x, (this.points[0] as PointObject).x, (this.points[3] as PointObject).x)
		const maxx = Math.max(p1.x, p2.x, p3.x, p4.x, (this.points[0] as PointObject).x, (this.points[3] as PointObject).x)
		const miny = Math.min(p1.y, p2.y, p3.y, p4.y, (this.points[0] as PointObject).y, (this.points[3] as PointObject).y)
		const maxy = Math.max(p1.y, p2.y, p3.y, p4.y, (this.points[0] as PointObject).y, (this.points[3] as PointObject).y)

		return [minx, miny, maxx, maxy]

	}

}
