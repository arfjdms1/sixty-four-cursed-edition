import type { ColorTriplet, Vec2 } from '../../types/core.js'
import { Cube } from '../entities/Cube.js'
import type { GameEntity } from '../game/types.js'
import type { RenderHost, WorldProjection } from './types.js'

export class RenderSystem implements WorldProjection {
	host: RenderHost

	constructor(host: RenderHost){
		this.host = host
	}

	initScreenSize(): void {
		this.host.w = this.host.canvas.width = this.host.canvas.offsetWidth * this.host.pixelRatio
		this.host.h = this.host.canvas.height = this.host.canvas.offsetHeight * this.host.pixelRatio
		this.host.w2 = this.host.w / 2
		this.host.h2 = this.host.h / 2
		this.host.solidUnit = this.host.h * .1
		this.host.screenUnit = this.host.h * .1
		this.host.regularFont = `600 ` + this.host.screenUnit * .16 + `px Montserrat, sans-serif`
		this.host.smallFont = `600 ` + this.host.screenUnit * .12 + `px Montserrat, sans-serif`
		this.host.microFont = this.host.screenUnit * .09 + `px Montserrat, sans-serif`
		this.host.bigFont = this.host.screenUnit * .3 + `px Verdana, sans-serif`
		this.host.setResourceHomes()

		this.host.flashlight = this.host.ctx.createRadialGradient(this.host.w2, this.host.h2, this.host.h2/4, this.host.w2, this.host.h2, this.host.w2)
		this.host.flashlight.addColorStop(0, `#1120`)
		this.host.flashlight.addColorStop(1, `#1129`)

		const dx = this.host.pixelRatio * 4
		for (let i = 0; i < this.host.analytics.graphs.length; i++){
			this.host.analytics.graphs[i].canvas.width = dx * this.host.analytics.dataSize + dx * 16
			this.host.analytics.graphs[i].canvas.height = this.host.analytics.graphs[i].canvas.width * .5
		}
	}

	uvToXY(uv: Vec2): Vec2 {
		return [ (uv[0] * 0.866 - uv[1] * .866) * this.host.unit - this.host.translation[0] * this.host.zoom, (uv[0] * .5 + uv[1] * .5) * this.host.unit - this.host.translation[1] * this.host.zoom]
	}

	uvToXYUntranslated(uv: Vec2): Vec2 {
		const xy = this.host.uvToXY(uv)
		return [xy[0] + this.host.w2, xy[1] + this.host.h2]
	}

	xyToUV(xy: Vec2): Vec2 {
		const centered = [xy[0]*this.host.pixelRatio - this.host.w2 + this.host.translation[0] * this.host.zoom, xy[1]*this.host.pixelRatio - this.host.h2 + this.host.translation[1] * this.host.zoom]
		const fx = centered[0] / .866 * .5
		const normalized: Vec2 = [(centered[1] + fx) / this.host.unit + .5, (centered[1] - fx) / this.host.unit + .5]
		return normalized
	}

	getHitCoordinates(xy: Vec2): Vec2 {
		return [(xy[0] * this.host.pixelRatio - this.host.w2 + this.host.translation[0]) / this.host.unit, (xy[1] * this.host.pixelRatio - this.host.h2 + this.host.translation[1]) / this.host.unit]
	}

	setResourceHomes(): void {
		this.host.resourceHomes = []
		for (let i = 0; i < this.host.resources.length; i++){
			this.host.resourceHomes.push([this.host.screenUnit * (i+1) * .8, this.host.screenUnit])
		}
	}

	drawResourceInScreenCoordinates(id: number, p: Vec2): void {
		this.host.resourcesSprites[id].scale = .25/this.host.zoom
		this.host.resourcesSprites[id].renderXY(p)
		this.host.resourcesSprites[id].scale = .25
	}

	drawCube(position: Vec2, size: number, triplet?: ColorTriplet): void {
		this.host.drawPrism([position[0]+size/2, position[1]+size/2], size, size, triplet)
	}

	drawPrism(position: Vec2, size: number, height: number, triplet?: ColorTriplet): void {
		const colors = triplet ? triplet : [`#FFC759`, `#FFE86F`, `#FF8F60`]
		height = height || 0

		const hy = height * this.host.unit
		const dx = size * .866 * this.host.unit
		const dy = size * .5 * this.host.unit

		this.host.ctx.save()
		const xy = this.host.uvToXY(position)
		this.host.ctx.translate(xy[0], xy[1])

		if (height){
			this.host.ctx.fillStyle = colors[0]
			this.host.ctx.beginPath()
			this.host.ctx.moveTo(0, -hy - dy)
			this.host.ctx.lineTo(dx, -hy)
			this.host.ctx.lineTo(dx, 0)
			this.host.ctx.lineTo(0, dy)
			this.host.ctx.lineTo(-dx, 0)
			this.host.ctx.lineTo(-dx, -hy)
			this.host.ctx.closePath()
			this.host.ctx.fill()

			this.host.ctx.fillStyle = colors[2]
			this.host.ctx.beginPath()
			this.host.ctx.moveTo(dx, -hy)
			this.host.ctx.lineTo(dx, 0)
			this.host.ctx.lineTo(0, dy)
			this.host.ctx.lineTo(0, dy - hy)
			this.host.ctx.closePath()
			this.host.ctx.fill()
		}

		this.host.ctx.fillStyle = colors[1]
		this.host.ctx.beginPath()
		this.host.ctx.moveTo(0, -hy - dy)
		this.host.ctx.lineTo(dx, -hy)
		this.host.ctx.lineTo(0, dy - hy)
		this.host.ctx.lineTo(-dx, -hy)
		this.host.ctx.closePath()
		this.host.ctx.fill()

		this.host.ctx.restore()
	}

	isVisible(p: GameEntity): boolean {
		const coords = this.host.uvToXYUntranslated(p.position)
		const span = p.entitySpan * this.host.unit || 0
		if (coords[0] + span < -this.host.unit || coords[0] - span > this.host.w + this.host.unit || coords[1] + span < -this.host.unit || coords[1] - span > this.host.h + this.host.unit + (p.entityHeight || 1) * this.host.unit) return false
		return true
	}

	renderSlowdown(): void {
		if (this.host.slowdown.state) {
			this.host.ctx.save()
			this.host.ctx.globalAlpha = this.host.slowdown.f
			this.host.ctx.globalCompositeOperation = `multiply`
			this.host.ctx.fillStyle = `#FFBB36`
			this.host.ctx.fillRect(0,0,this.host.w,this.host.h)
			this.host.ctx.restore()
		}
	}

	renderHoveredCell(): void {
		if (this.host.hoveredEntity){
			this.host.ctx.save()
			const xy = this.host.uvToXY(this.host.hoveredEntity?.position || (this.host.hoveredCell as Vec2))
			this.host.ctx.translate(xy[0], xy[1])

			const mult = this.host.hoveredEntity?.entitySpan === 1 ? 3 : 1.1
			const dx = .866 * this.host.unit * mult
			const dy = .5 * this.host.unit * mult
			const s = .2
			const l = .8

			this.host.ctx.strokeStyle = this.host.hoveredEntity ? `#112` : `#D0D4D8`
			this.host.ctx.lineWidth = this.host.unit * (this.host.hoveredEntity ? .02 : .01)

			if (!this.host.hoveredEntity){
				this.host.ctx.beginPath()
				this.host.ctx.moveTo(-dx * s, -dy * l)
				this.host.ctx.lineTo(0, -dy)
				this.host.ctx.lineTo(dx * s, -dy * l)
				this.host.ctx.stroke()
			}

			this.host.ctx.beginPath()
			this.host.ctx.moveTo(dx * l, -dy * s)
			this.host.ctx.lineTo(dx, 0)
			this.host.ctx.lineTo(dx * l, dy * s)
			this.host.ctx.stroke()

			this.host.ctx.beginPath()
			this.host.ctx.moveTo(-dx * s, dy * l)
			this.host.ctx.lineTo(0, dy)
			this.host.ctx.lineTo(dx * s, dy * l)
			this.host.ctx.stroke()

			this.host.ctx.beginPath()
			this.host.ctx.moveTo(-dx * l, -dy * s)
			this.host.ctx.lineTo(-dx, 0)
			this.host.ctx.lineTo(-dx * l, dy * s)
			this.host.ctx.stroke()
			
			this.host.ctx.restore()
		}
	}

	renderSOI(entity: GameEntity | Vec2): void {
		this.host.ctx.save()
		const xy = this.host.uvToXY((entity as GameEntity).position || (entity as Vec2))
		this.host.ctx.translate(xy[0], xy[1])

		const dx = .866 * this.host.unit * 3
		const dy = .5 * this.host.unit * 3
		const s = .1
		const l = .9

		this.host.ctx.fillStyle = `#11112208`
		this.host.ctx.beginPath()
		this.host.ctx.moveTo(0, -dy)
		this.host.ctx.lineTo(dx, 0)
		this.host.ctx.lineTo(0, dy)
		this.host.ctx.lineTo(-dx, 0)
		this.host.ctx.closePath()
		this.host.ctx.fill()

		this.host.ctx.strokeStyle = `#A5A5B4`
		this.host.ctx.lineWidth = this.host.unit * .02

		this.host.ctx.beginPath()
		this.host.ctx.moveTo(-dx * s, -dy * l)
		this.host.ctx.lineTo(0, -dy)
		this.host.ctx.lineTo(dx * s, -dy * l)
		this.host.ctx.stroke()

		this.host.ctx.beginPath()
		this.host.ctx.moveTo(dx * l, -dy * s)
		this.host.ctx.lineTo(dx, 0)
		this.host.ctx.lineTo(dx * l, dy * s)
		this.host.ctx.stroke()

		this.host.ctx.beginPath()
		this.host.ctx.moveTo(-dx * s, dy * l)
		this.host.ctx.lineTo(0, dy)
		this.host.ctx.lineTo(dx * s, dy * l)
		this.host.ctx.stroke()

		this.host.ctx.beginPath()
		this.host.ctx.moveTo(-dx * l, -dy * s)
		this.host.ctx.lineTo(-dx, 0)
		this.host.ctx.lineTo(-dx * l, dy * s)
		this.host.ctx.stroke()
		
		this.host.ctx.restore()
	}

	renderAffected(name: string): void {
		const list = this.host.codex.entities[name].affected
		if (list){
			const color = `#53B976`
			const n = []
			const o = this.host.hoveredCell as Vec2
			let hasAffected = false
			const r = this.host.unit * .05
			const xy0 = this.host.uvToXY(o)

			for (let i = 0; i < 9; i++){
				const du = -1 + i % 3
				const dv = -1 + Math.floor(i / 3)
				const m = this.host.stuffMap[`u${o[0] + du}v${o[1] + dv}`]
				const conductorok = (name === `conductor` || m?.name === `conductor`) ? i%2 : 1

				if (m && conductorok) n.push(m)
			}

			this.host.ctx.strokeStyle = color
			this.host.ctx.lineWidth = r * .5

			for (let i = 0; i < n.length; i++){
				if (list[n[i].name]){
					hasAffected = true
					const xy = this.host.uvToXY(n[i].position)

					this.host.ctx.beginPath()
					this.host.ctx.moveTo(xy0[0], xy0[1])
					this.host.ctx.bezierCurveTo(xy0[0], xy0[1] + this.host.unit * .3, xy[0], xy[1] + this.host.unit * .3, xy[0], xy[1])
					this.host.ctx.stroke()

					this.host.ctx.fillStyle = color
					this.host.ctx.beginPath()
					this.host.ctx.arc(xy[0], xy[1], r, 0, Math.PI * 2)
					this.host.ctx.closePath()
					this.host.ctx.fill()
					this.host.ctx.fillStyle = `#FFF`
					this.host.ctx.beginPath()
					this.host.ctx.arc(xy[0], xy[1], r - this.host.ctx.lineWidth, 0, Math.PI * 2)
					this.host.ctx.closePath()
					this.host.ctx.fill()
				}
			}

			if (hasAffected){
				this.host.ctx.fillStyle = color
				this.host.ctx.beginPath()
				this.host.ctx.arc(xy0[0], xy0[1], r, 0, Math.PI * 2)
				this.host.ctx.closePath()
				this.host.ctx.fill()
				this.host.ctx.fillStyle = `#FFF`
				this.host.ctx.beginPath()
				this.host.ctx.arc(xy0[0], xy0[1], r - this.host.ctx.lineWidth, 0, Math.PI * 2)
				this.host.ctx.closePath()
				this.host.ctx.fill()
			}
		}
	}

	renderCursor(): void {
		if (!this.host.plane){
			const hint = this.host.itemInHand?.eraser ? this.host.hoveredEntity?.getSellHint() : this.host.itemInHand ? this.host.itemInHandPriceTag : this.host.hoveredEntity?.getHint()
			const canHit = this.host.hoveredEntity && this.host.hoveredEntity.canHit()

			if (this.host.showUnfilled) this.host.renderUnfilled()

			this.host.ctx.save()
			this.host.ctx.translate(this.host.mouse.xy[0], this.host.mouse.xy[1])

			const radius = this.host.pixelRatio * (canHit ? 12 : 6)
			this.host.ctx.fillStyle = canHit ? `#000` : `#FFF`
			this.host.ctx.beginPath()
			this.host.ctx.arc(0, 0, radius, 0, Math.PI * 2)
			this.host.ctx.closePath()
			this.host.ctx.fill()
			this.host.ctx.fillStyle = canHit ? `#FFF` : `#000`
			this.host.ctx.beginPath()
			this.host.ctx.arc(0, 0, radius * .8, 0, Math.PI * 2)
			this.host.ctx.closePath()
			this.host.ctx.fill()

			if (hint){
				hint.update()
				if (hint.element !== this.host.currentHint.element){
					if (this.host.currentHint.element) document.body.removeChild(this.host.currentHint.element)
					this.host.currentHint.element = hint.element
					this.host.currentHint.entity = this.host.hoveredEntity
					document.body.appendChild(this.host.currentHint.element!)
				}
				if (this.host.itemInHand){
					Reflect.set(this.host.currentHint.element!.style, `opacity`, this.host.canPlace ? 1 : .3)
				}
			}
			if (!hint && this.host.currentHint.element){
				this.host.removeHint()
			}
			this.host.ctx.restore()
		} else if (this.host.plane === 1){
			const hint = this.host.hoveredEntity?.getDarkHint()
			const canHit = this.host.hoveredEntity?.canDarkHit()

			this.host.ctx.save()
			this.host.ctx.translate(this.host.mouse.xy[0], this.host.mouse.xy[1])

			const radius = this.host.pixelRatio * (canHit ? 12 : 6)
			this.host.ctx.fillStyle = `#FFF`
			this.host.ctx.beginPath()
			this.host.ctx.arc(0, 0, radius, 0, Math.PI * 2)
			this.host.ctx.closePath()
			this.host.ctx.fill()

			if (hint){
				hint.update()
				if (hint.element !== this.host.currentHint.element){
					if (this.host.currentHint.element) document.body.removeChild(this.host.currentHint.element)
					this.host.currentHint.element = hint.element
					this.host.currentHint.entity = this.host.hoveredEntity
					document.body.appendChild(this.host.currentHint.element!)
				}
			}

			if ((this.host.itemInHand || !hint) && this.host.currentHint.element){
				this.host.removeHint()
			}
			this.host.ctx.restore()
		}

		//ARROW
		if (this.host.distanceToOrigins > 80 && this.host.hoveredCell){
			const origin = this.host.uvToXYUntranslated([0,0])
			const vector = [origin[0] - this.host.mouse.xy[0], origin[1] - this.host.mouse.xy[1]]
			const angle = Math.atan2(vector[1], vector[0])
			this.host.ctx.save()
			this.host.ctx.translate(this.host.mouse.xy[0], this.host.mouse.xy[1])
			this.host.ctx.rotate(angle)
			this.host.ctx.fillStyle = this.host.plane ? `#FFF` : `#000`
			this.host.ctx.beginPath()
			const u = this.host.unit / this.host.zoom
			this.host.ctx.moveTo(-u*.1, -u * .1)
			this.host.ctx.lineTo(u * .2, 0)
			this.host.ctx.lineTo(-u*.1, u * .1)
			this.host.ctx.lineTo(-u * .05, 0)
			this.host.ctx.closePath()
			this.host.ctx.fill()
			this.host.ctx.restore()
		}
	}

	removeHint(): void {
		if (this.host.currentHint.element) {
			document.body.removeChild(this.host.currentHint.element)
			this.host.currentHint.element = undefined
			this.host.currentHint.entity = undefined
		}
	}

	renderUnfilled(): void {
		this.host.ctx.save()
		const margin = this.host.pixelRatio * 16
		const size = this.host.pixelRatio * 18
		for (let i = 0; i < this.host.unfilledEntities.length; i++){
			const coords = this.host.uvToXYUntranslated(this.host.unfilledEntities[i].position)
			const vector = [this.host.mouse.xy[0] - coords[0], this.host.mouse.xy[1] - coords[1]]
			const length = (vector[0] ** 2 + vector[1] ** 2) ** .5

			if (length > this.host.unit * 6){
				this.host.ctx.strokeStyle = `#112`
				this.host.ctx.lineWidth = this.host.pixelRatio
				vector[0] /= length
				vector[1] /= length
				this.host.ctx.beginPath()
				this.host.ctx.moveTo(this.host.mouse.xy[0] - vector[0] * margin, this.host.mouse.xy[1] - vector[1] * margin)
				this.host.ctx.lineTo(this.host.mouse.xy[0] - vector[0] * size, this.host.mouse.xy[1] - vector[1] * size)
				this.host.ctx.stroke()
			} else {
				this.host.ctx.fillStyle = `#112`
				this.host.ctx.strokeStyle = `#778`
				this.host.ctx.lineWidth = this.host.pixelRatio / 2
				this.host.ctx.beginPath()
				this.host.ctx.moveTo(this.host.mouse.xy[0], this.host.mouse.xy[1])
				this.host.ctx.lineTo(coords[0], coords[1])
				this.host.ctx.stroke()

				this.host.ctx.beginPath()
				this.host.ctx.arc(coords[0], coords[1], this.host.pixelRatio * 2, 0, Math.PI * 2)
				this.host.ctx.closePath()
				this.host.ctx.fill()
			}
		}
		this.host.ctx.restore()
	}

	renderAvailability(): void {
		this.host.drawPrism(this.host.hoveredCell as Vec2, 1, 0, this.host.canPlace ? [`#0F06`,`#0F06`,`#0F06`] : [`#F006`,`#F006`,`#F006`])
	}

	renderResources(): void {
		this.host.ctx.textAlign = `center`
		this.host.ctx.textBaseline = `middle`

		const glow = this.host.ctx.createRadialGradient(0,0,0,0,0,this.host.screenUnit * .4)
		glow.addColorStop(.5, `#FFFF`)
		glow.addColorStop(1, `#FFF0`)

		for (let i = 0; i < this.host.resources.length; i++){
			if (this.host.resources[i]){
				this.host.ctx.font = this.host.regularFont
				const s = this.host.resourcePops[i] || 0
				this.host.ctx.save()
				this.host.ctx.translate(this.host.resourceHomes[i][0], this.host.resourceHomes[i][1])
				this.host.ctx.scale(.8 + s, .8 + s)

				this.host.ctx.fillStyle = glow
				this.host.ctx.beginPath()
				this.host.ctx.arc(0,0,this.host.screenUnit * .4,0,Math.PI * 2)
				this.host.ctx.closePath()
				this.host.ctx.fill()
				
				this.host.drawResourceInScreenCoordinates(i, [0,0])
				this.host.ctx.restore()

				let text: string | number = this.host.makeReadable(this.host.resources[i])
				if (this.host.entitiesInGame.pinhole > 0){
					const t = performance.now()
					if (Math.sin(t/834) * .6 + Math.sin(t/27) * .4 > 0){
						text = Math.random().toString(36).slice(2, 5)
					} else {
						const dict = [`U/D`,`C/S`,`T/B`,`E/νE`,`μ/νμ`,`τ/ντ`,`G/γ`,`Z/W`,`H`,`Δ/νΔ`]
						text = dict[i]
					}
				}

				const pad = this.host.screenUnit * .04
				const x = this.host.resourceHomes[i][0]
				const y = this.host.resourceHomes[i][1] - this.host.screenUnit * .4
				this.host.ctx.fillStyle = `#FFF`
				const measure = this.host.ctx.measureText(text as string)
				
				if (this.host.ctx.roundRect){
					this.host.ctx.beginPath()
					this.host.ctx.roundRect(x - measure.actualBoundingBoxLeft - pad, y - measure.actualBoundingBoxAscent - pad, measure.width + pad * 2, measure.actualBoundingBoxDescent + measure.actualBoundingBoxAscent + pad * 2, this.host.pixelRatio * 2)
					this.host.ctx.closePath()
					this.host.ctx.fill()
				} else {
					this.host.ctx.fillRect(x - measure.actualBoundingBoxLeft - pad, y - measure.actualBoundingBoxAscent - pad, measure.width + pad * 2, measure.actualBoundingBoxDescent + measure.actualBoundingBoxAscent + pad * 2)
				}

				this.host.ctx.fillStyle = `#000`
				this.host.ctx.fillText(text as string, this.host.resourceHomes[i][0], this.host.resourceHomes[i][1] - this.host.screenUnit * .4)

				if (i === this.host.hoveredResource){
					//Name
					const shift = -this.host.screenUnit * .84
					const nameMeasure = this.host.ctx.measureText(this.host.words.resources[i])
					this.host.ctx.fillStyle = `#FFF`
					if (this.host.ctx.roundRect){
						this.host.ctx.beginPath()
						this.host.ctx.roundRect(x - nameMeasure.actualBoundingBoxLeft - pad, y - nameMeasure.actualBoundingBoxAscent - pad - shift, nameMeasure.width + pad * 2, nameMeasure.actualBoundingBoxDescent + nameMeasure.actualBoundingBoxAscent + pad * 2, this.host.pixelRatio * 2)
						this.host.ctx.closePath()
						this.host.ctx.fill()
					} else {
						this.host.ctx.fillRect(x - nameMeasure.actualBoundingBoxLeft - pad, y - nameMeasure.actualBoundingBoxAscent - pad, nameMeasure.width + pad * 2, nameMeasure.actualBoundingBoxDescent + nameMeasure.actualBoundingBoxAscent + pad * 2)
					}
					this.host.ctx.fillStyle = this.host.codex.resources[i].triplet[2]
					this.host.ctx.fillText(this.host.words.resources[i], this.host.resourceHomes[i][0], this.host.resourceHomes[i][1] - this.host.screenUnit * .4 - shift)

					//Gradient instant
					this.host.ctx.font = this.host.smallFont
					if (this.host.entitiesInGame.mega1 > 0 || this.host.entitiesInGame.mega1a > 0 || this.host.entitiesInGame.mega1b > 0){
						const shift2 = -this.host.screenUnit * 1.03
						const value = this.host.analytics.average[i][0]
						const average = `+ ${this.host.makeReadable(value)} / s`
						const averageMeasure = this.host.ctx.measureText(average)
						this.host.ctx.fillStyle = `#FFF`
						if (this.host.ctx.roundRect){
							this.host.ctx.beginPath()
							this.host.ctx.roundRect(x - averageMeasure.actualBoundingBoxLeft - pad, y - averageMeasure.actualBoundingBoxAscent - pad - shift2, averageMeasure.width + pad * 2, averageMeasure.actualBoundingBoxDescent + averageMeasure.actualBoundingBoxAscent + pad * 2, this.host.pixelRatio * 2)
							this.host.ctx.closePath()
							this.host.ctx.fill()
						} else {
							this.host.ctx.fillRect(x - averageMeasure.actualBoundingBoxLeft - pad, y - averageMeasure.actualBoundingBoxAscent - pad, averageMeasure.width + pad * 2, averageMeasure.actualBoundingBoxDescent + averageMeasure.actualBoundingBoxAscent + pad * 2)
						}
						this.host.ctx.fillStyle = `#6ea56e`
						this.host.ctx.fillText(average, this.host.resourceHomes[i][0], this.host.resourceHomes[i][1] - this.host.screenUnit * .4 - shift2)

						const shift3 = -this.host.screenUnit * 1.2
						const value2 = this.host.analytics.average[i][1]
						const average2 = `– ${this.host.makeReadable(-value2)} / s`
						const averageMeasure2 = this.host.ctx.measureText(average2)
						this.host.ctx.fillStyle = `#FFF`
						if (this.host.ctx.roundRect){
							this.host.ctx.beginPath()
							this.host.ctx.roundRect(x - averageMeasure2.actualBoundingBoxLeft - pad, y - averageMeasure2.actualBoundingBoxAscent - pad - shift3, averageMeasure2.width + pad * 2, averageMeasure2.actualBoundingBoxDescent + averageMeasure2.actualBoundingBoxAscent + pad * 2, this.host.pixelRatio * 2)
							this.host.ctx.closePath()
							this.host.ctx.fill()
						} else {
							this.host.ctx.fillRect(x - averageMeasure2.actualBoundingBoxLeft - pad, y - averageMeasure2.actualBoundingBoxAscent - pad, averageMeasure2.width + pad * 2, averageMeasure2.actualBoundingBoxDescent + averageMeasure2.actualBoundingBoxAscent + pad * 2)
						}
						this.host.ctx.fillStyle = `#C38C75`
						this.host.ctx.fillText(average2, this.host.resourceHomes[i][0], this.host.resourceHomes[i][1] - this.host.screenUnit * .4 - shift3)
					}

					if (this.host.entitiesInGame.mega1b > 0){
						const padding = this.host.pixelRatio * 16
						const dx = this.host.pixelRatio * 4
						const g = this.host.analytics.graphs[i]
						const width = g.canvas.width
						const shortWidth = dx * this.host.analytics.dataSize
						const height = g.canvas.height / 2
						const ctx = g.ctx
						ctx.clearRect(0,0,width,height*2)
						ctx.fillStyle = `#FFFFFFF6`
						ctx.beginPath()
						ctx.roundRect(0,0,width,height*2, this.host.pixelRatio * 4)
						ctx.closePath()
						ctx.fill()

						let max = 0

						for (let j = 0; j < g.data.length; j++){
							if (g.data[j][0] > max){
								max = g.data[j][0]
							}
							if (-g.data[j][1] > max){
								max = -g.data[j][1]
							}
						}

						const order = +Math.floor(max).toString().length
						const delta = 10 ** (order - 1)
						max = delta * (Math.floor(max / delta) + 1)

						for (let j = 0; j < g.data.length; j++){
							const hhPlus = Math.floor(g.data[j][0] / max * height)
							const hhMinus = Math.floor(-g.data[j][1] / max * height)
							ctx.globalAlpha = .4
							ctx.fillStyle = `#C38C75`
							ctx.fillRect(j*dx, height, dx, hhMinus)
							ctx.fillStyle = `#6ea56e`
							ctx.fillRect(j*dx, height - hhPlus, dx, hhPlus)
							ctx.globalAlpha = 1
							ctx.fillStyle = `#C38C75`
							ctx.fillRect(j*dx, height + hhMinus, dx, this.host.pixelRatio)
							ctx.fillStyle = `#6ea56e`
							ctx.fillRect(j*dx, height - hhPlus, dx - this.host.pixelRatio, this.host.pixelRatio)
						}

						const lastPlus = Math.floor(this.host.analytics.frame[i][0] / (this.host.analytics.measuringFrame - this.host.analytics.frameTimer) * 1000 / max * height)
						const lastMinus = Math.floor(-this.host.analytics.frame[i][1] / (this.host.analytics.measuringFrame - this.host.analytics.frameTimer) * 1000 / max * height)
						ctx.globalAlpha = .4
						ctx.fillStyle = `#C38C75`
						ctx.fillRect(g.data.length*dx, height, dx, lastMinus)
						ctx.fillStyle = `#6ea56e`
						ctx.fillRect(g.data.length*dx, height - lastPlus, dx, lastPlus)
						ctx.globalAlpha = 1
						ctx.fillStyle = `#C38C75`
						ctx.fillRect(g.data.length*dx, height + lastMinus, dx, this.host.pixelRatio)
						ctx.fillStyle = `#6ea56e`
						ctx.fillRect(g.data.length*dx, height - lastPlus, dx - this.host.pixelRatio, this.host.pixelRatio)

						ctx.fillStyle = `#000`
						ctx.font = height * .12 + `px Montserrat, sans-serif`
						ctx.textBaseline = `middle`
						ctx.textAlign = `left`

						const maxDigit = +max.toString()[0]
						const secondHalf = maxDigit < 2 || maxDigit > 5

						for (let v = delta-max; v < max; v+=delta){
							const digit = +Math.abs(v).toString()[0]
							if (secondHalf && (digit % 2)) continue
							const lh = height - (v / max) * height
							ctx.globalAlpha = .1
							ctx.fillRect(0, lh, shortWidth + dx, 1)
							ctx.globalAlpha = 1
							ctx.fillText(this.host.makeReadable(v) + ` / s`, shortWidth + padding, lh)
						}

						this.host.ctx.imageSmoothingEnabled = false
						this.host.ctx.drawImage(g.canvas, Math.max(this.host.resourceHomes[0][0] / 2, this.host.resourceHomes[i][0] - width/2), this.host.resourceHomes[0][1] * 2)
						this.host.ctx.imageSmoothingEnabled = true
					}
				}
			}
		}
	}

	renderResourceBeds(): void {
		this.host.ctx.fillStyle = `#FFF`
		const r = this.host.unit * .5

		for (let i = 0; i < this.host.resources.length; i++){
			if (this.host.resources[i]){
				this.host.ctx.beginPath()
				this.host.ctx.arc(this.host.resourceHomes[i][0], this.host.resourceHomes[i][1], r, 0, Math.PI * 2)
				this.host.ctx.closePath()
				this.host.ctx.fill()
			}
		}
	}

	renderDarkResources(): void {
		this.host.ctx.font = this.host.regularFont
		this.host.ctx.textAlign = `center`
		this.host.ctx.textBaseline = `middle`

		if (this.host.resources[9]){
			const s = this.host.resourcePops[9] || 0
			this.host.ctx.save()
			this.host.ctx.translate(this.host.resourceHomes[0][0], this.host.resourceHomes[0][1])
			this.host.ctx.scale(.8 + s, .8 + s)
			this.host.drawResourceInScreenCoordinates(9, [0,0])
			this.host.ctx.restore()
			this.host.ctx.fillStyle = `#FFF`
			this.host.ctx.fillText(this.host.makeReadable(this.host.resources[9]) as string, this.host.resourceHomes[0][0], this.host.resourceHomes[0][1] - this.host.screenUnit * .4)
		}
	}

	renderConductors(dt: number): void {
		if (!this.host.plane){
			const c = Array.from(this.host.conductors)
			for (let i = 0; i < c.length; i++){
				if (this.host.isVisible(c[i] as GameEntity)) (c[i] as GameEntity).render(dt)
			}
		}
	}

	renderEntities(dt: number): void {
		if (!this.host.plane){
			for (let i = 0; i < this.host.stuff.length; i++){
				if (this.host.stuff[i].name !== `conductor` && this.host.isVisible(this.host.stuff[i])) this.host.stuff[i].render(dt)
			}
		} else if (this.host.plane === 1){
			for (let i = 0; i < this.host.stuff.length; i++){
				if (this.host.isVisible(this.host.stuff[i])) this.host.stuff[i].darkrender(dt)
			}
		}
	}

	renderGrid(range: { x: Vec2; y: Vec2 }): void {
		this.host.ctx.save()
		this.host.ctx.strokeStyle = `#1129`
		this.host.ctx.setLineDash([8,8])
		for (let y = range.y[0]; y <= range.y[1]; y++){
			this.host.ctx.beginPath()
			const xy0 = this.host.uvToXY([range.x[0]+.5,y+.5])
			this.host.ctx.moveTo(xy0[0], xy0[1])
			const xy1 = this.host.uvToXY([range.x[1]+.5,y+.5])
			this.host.ctx.lineTo(xy1[0], xy1[1])
			this.host.ctx.stroke()
		}
		for (let x = range.x[0]; x <= range.x[1]; x++){
			this.host.ctx.beginPath()
			const xy0 = this.host.uvToXY([x+.5,range.y[0]+.5])
			this.host.ctx.moveTo(xy0[0], xy0[1])
			const xy1 = this.host.uvToXY([x+.5,range.y[1]+.5])
			this.host.ctx.lineTo(xy1[0], xy1[1])
			this.host.ctx.stroke()
		}
		this.host.ctx.restore()
	}

	renderChasm(): void {
		const chasmDeltas = [
			[-this.host.unit * .3, 	-this.host.unit * 1.38],
			[-this.host.unit * .19, 	-this.host.unit * 1.45],
			[-this.host.unit * .085, -this.host.unit * 1.51],
			[this.host.unit * .025, 	-this.host.unit * 1.57],
			[this.host.unit * .13, 	-this.host.unit * 1.64],

			[-this.host.unit * .13, 	-this.host.unit * 1.29],
			[-this.host.unit * .02, 	-this.host.unit * 1.35],
			[this.host.unit * .085, 	-this.host.unit * 1.41],
			[this.host.unit * .195, 	-this.host.unit * 1.47],
			[this.host.unit * .3, 	-this.host.unit * 1.54],
		]

		if (this.host.isVisible(this.host.chasm!)){
			const cp = this.host.uvToXYUntranslated(this.host.chasm!.position)

			for (let i = 0; i < this.host.resources.length; i++){
				if (!this.host.resources[i]) continue
				const delta = chasmDeltas[i] || [0,0]
				const tilt = i < 5 ? -this.host.unit * .4 : this.host.unit
				const rp = this.host.resourceHomes[i]
				const cy = rp[1] + (cp[1] + delta[1] - rp[1]) * .7

				this.host.ctx.strokeStyle = this.host.codex.resources[i].triplet[0]
				this.host.ctx.lineWidth = this.host.unit * (.02 + .1 * this.host.resourcePops[i])

				this.host.ctx.beginPath()
				this.host.ctx.moveTo(rp[0], rp[1])
				this.host.ctx.bezierCurveTo(rp[0], cy, cp[0] + delta[0] + tilt, cy, cp[0] + delta[0], cp[1] + delta[1])
				this.host.ctx.stroke()
			}
		}
	}

	renderHollowEvents(): void {
		this.host.ctx.save()
		for (let i = 0; i < this.host.hollowEvents.length; i++){
			const e = this.host.hollowEvents[i]
			this.host.ctx.globalAlpha = e.time / e.max
			this.host.ctx.fillStyle = e.color
			this.host.ctx.fillRect(0,0,this.host.w,this.host.h)

			if (e.imageTime > 0){
				this.host.ctx.globalAlpha = e.imageTime / e.maxImageTime
				const size = this.host.unit * 6
				this.host.ctx.drawImage(this.host.hollowImage, this.host.w2 - size / 2, this.host.h2 - size / 2, size, size)
			}
		}
		this.host.ctx.restore()
	}

	renderDarkHollowEvents(): void {
		this.host.ctx.save()
		for (let i = 0; i < this.host.darkHollowEvents.length; i++){
			const e = this.host.darkHollowEvents[i]
			this.host.ctx.globalAlpha = e.time / e.max
			this.host.ctx.fillStyle = e.color
			this.host.ctx.fillRect(0,0,this.host.w,this.host.h)

			if (e.imageTime > 0){
				this.host.ctx.globalAlpha = e.imageTime / e.maxImageTime
				const size = this.host.unit * 6
				this.host.ctx.drawImage(this.host.hollowImage, this.host.w2 - size / 2, this.host.h2 - size / 2, size, size)
			}
		}
		this.host.ctx.restore()
	}

	renderFrame(dt: number): void {
		if (this.host.plane === 1){
			this.host.ctx.fillStyle = `#000`
			this.host.ctx.fillRect(0, 0, this.host.w, this.host.h)
		} else {
			this.host.ctx.fillStyle = `#FFF`
			this.host.ctx.fillRect(0, 0, this.host.w, this.host.h)
		}
		
		this.host.ctx.save()
		this.host.ctx.translate(this.host.w2, this.host.h2)
		
		//HIGHLIGHT
		this.host.renderConductors(dt)
		this.host.ctx.translate(-this.host.w2, -this.host.h2)
		this.host.renderChasmVFX()
		this.host.ctx.translate(this.host.w2, this.host.h2)
		this.host.renderEntities(dt)

		if (this.host.altActive && !this.host.plane) {
			this.host.ctx.fillStyle = `#FFFC`
			this.host.ctx.fillRect(-this.host.w2, -this.host.h2, this.host.w, this.host.h)

			if (this.host.hoveredEntity && !(this.host.hoveredEntity instanceof Cube)){
				this.host.renderSOI(this.host.hoveredEntity)
				this.host.hoveredEntity.render(0)
				this.host.renderAffected(this.host.hoveredEntity.name)
			}
		}

		if (this.host.itemInHand && this.host.hoveredCell){
			this.host.renderAvailability()
			this.host.renderSOI(this.host.hoveredCell)
		}
		if (this.host.hoveredCell) this.host.renderHoveredCell()
		if (this.host.itemInHand && this.host.hoveredCell && !this.host.itemInHand.eraser){
			this.host.ctx.save()
			this.host.ctx.globalAlpha = .5
			this.host.itemInHand.render(0, this.host.hoveredCell)
			this.host.ctx.restore()
			this.host.renderAffected(this.host.itemInHand.name)
		}

		//Pinhole
		if (this.host.pinhole){
			const radius = this.host.unit * .01 + this.host.unit * 2 * this.host.pinhole.f
			const time = performance.now() / 1000
			const noise = (Math.sin(time * 37) * .6 + Math.sin(time * 1913.2) * .4) * this.host.unit * .08

			const xy = this.host.uvToXY(this.host.pinhole.position)
			this.host.ctx.save()
			this.host.ctx.translate(xy[0], xy[1] - this.host.unit)
			this.host.ctx.fillStyle = this.host.plane ? `#FFF` : `#000`
			this.host.ctx.beginPath()
			this.host.ctx.arc(0,0,Math.max(0,radius + noise),0,Math.PI * 2)
			this.host.ctx.closePath()
			this.host.ctx.fill()
			this.host.ctx.restore()
		}

		this.host.ctx.restore()

		this.host.renderVFX()

		if (!this.host.plane){
			if (this.host.chasm) this.host.renderChasm()
			this.host.renderResources()
			if (!this.host.chillMode) this.host.renderHollowEvents()
			this.host.renderSlowdown()
		} else {
			if (this.host.entitiesInGame.pinhole > 0){
				this.host.renderResources()
			} else {
				this.host.renderDarkResources()
			}
			if (!this.host.chillMode) this.host.renderDarkHollowEvents()
		}

		if (this.host.mouse.cursorVisible) this.host.renderCursor()

		//Hint position update
		if (this.host.currentHint.element){
			this.host.currentHint.element.style.left = this.host.mouse.offsetxy[0] + `px`
			this.host.currentHint.element.style.top = this.host.mouse.offsetxy[1] + `px`
		}

		if (this.host.photofobia && this.host.flashlight && !this.host.plane){
			this.host.ctx.fillStyle = this.host.flashlight
			this.host.ctx.fillRect(0,0,this.host.w,this.host.h)
		}
	}
}
