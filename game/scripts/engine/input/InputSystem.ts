import type { Vec2 } from '../../../types/core.js'
import type { InputHost, MouseState, PointerInput } from './types.js'

export class InputSystem {
	host: InputHost
	mouse: MouseState
	gamepadButtons: Array<number | boolean> = []
	gamepadControl?: boolean
	thereWasZoomAction?: boolean
	keyboardMovementHappening?: number
	zoomWhenShiftPressed?: number
	shiftPressed?: boolean
	resizeAnimationFrame?: number

	constructor(host: InputHost){
		this.host = host
		this.mouse = {
			xy: [0,0],
			offsetxy: [0,0],
			cursorVisible: true,
			state: 0,
			positionChanged: false,
			lastOffset: [0,0],
			lastTouch: [0,0],
			automate: false,
			maxTimer: 150,
			timer: 150
		}
	}

	updateMouseData(x: number, y: number): void {
		this.mouse.offsetxy[0] = x
		this.mouse.offsetxy[1] = y
		this.mouse.xy[0] = x * this.host.pixelRatio
		this.mouse.xy[1] = y * this.host.pixelRatio

		const distance2 = (x - this.mouse.lastOffset[0]) ** 2 + (y - this.mouse.lastOffset[1]) ** 2
		this.mouse.lastOffset[0] = x
		this.mouse.lastOffset[1] = y
		if (distance2 > 1) this.mouse.positionChanged = true
	}

	setListeners(): void {
		if (this.host.spaceport && !this.host.spaceport.isPlaceholder){
			this.host.spaceport.on(`windowState`, (_e, d)=>{
				console.log(d)
				if (d === `blur`) this.host.doOnBlur()
				if (d === `focus`) this.host.doOnFocus()
			})
		}

		addEventListener(`resize`, _=>{
			if (this.resizeAnimationFrame !== undefined) cancelAnimationFrame(this.resizeAnimationFrame)
			this.resizeAnimationFrame = requestAnimationFrame(_=>{this.host.initScreenSize()})
		})

		addEventListener(`gamepadconnected`, _=>{
			this.host.shop?.gamePadHint.classList.add(`gamePadPresent`)
		})
		addEventListener(`gamepaddisconnected`, _=>{
			this.host.shop?.gamePadHint.classList.remove(`gamePadPresent`)
			this.host.splash?.show()
			if (this.host.splash) this.host.splash.selected = false
		})

		addEventListener(`blur`, _e=>{
			this.host.doOnBlur()
		})
		addEventListener(`focus`, _e=>{
			this.host.doOnFocus()
		})

		addEventListener(`keydown`, (e: KeyboardEvent)=>{
			this.gamepadControl = false
			this.thereWasZoomAction = true

			if (e.keyCode === 27){
				if (this.host.itemInHand) {
					delete this.host.itemInHand
					delete this.host.transportedEntity
				} else {
					this.host.toggleSplash()
				}
			} else if (e.keyCode === 81){
				this.host.processQ()
			} else if (e.keyCode === 18){
				e.preventDefault()
				this.host.altActive = true
				document.body.classList.add(`altHolded`)
			} else if (e.keyCode === 69){
				this.host.processE()
			} else if (e.keyCode === 87 || e.keyCode === 38){
				this.host.translationMap[0] = 1
			} else if (e.keyCode === 68 || e.keyCode === 39){
				this.host.translationMap[1] = 1
			} else if (e.keyCode === 83 || e.keyCode === 40){
				this.host.translationMap[2] = 1
			} else if (e.keyCode === 65 || e.keyCode === 37){
				this.host.translationMap[3] = 1
			} else if (e.keyCode === 16 || e.keyCode === 17){
				if (!this.zoomWhenShiftPressed) {
					this.zoomWhenShiftPressed = this.host.zoom
					delete this.thereWasZoomAction
				}
				this.shiftPressed = true
			}
		})

		addEventListener(`keyup`, (e: KeyboardEvent)=>{
			if (e.keyCode === 87 || e.keyCode === 38){
				this.host.translationMap[0] = 0
				if (this.keyboardMovementHappening === 87) delete this.keyboardMovementHappening
			} else if (e.keyCode === 68 || e.keyCode === 39){
				this.host.translationMap[1] = 0
				if (this.keyboardMovementHappening === 87) delete this.keyboardMovementHappening
			} else if (e.keyCode === 83 || e.keyCode === 40){
				this.host.translationMap[2] = 0
				if (this.keyboardMovementHappening === 87) delete this.keyboardMovementHappening
			} else if (e.keyCode === 65 || e.keyCode === 37){
				this.host.translationMap[3] = 0
				if (this.keyboardMovementHappening === 87) delete this.keyboardMovementHappening
			} else if (e.keyCode === 18){
				this.host.altActive = false
				document.body.classList.remove(`altHolded`)
			} else if (e.keyCode === 16 || e.keyCode === 17){
				this.shiftPressed = false
				if (!this.thereWasZoomAction){
					this.host.zoom = 1
				}
				delete this.zoomWhenShiftPressed
			}
		})

		this.host.canvas.addEventListener(`click`, _e=>{
			this.host.processClick()
		})

		this.host.canvas.addEventListener(`mousemove`, e=>{
			this.host.processMousemove(e)
		})

		this.host.canvas.addEventListener(`touchstart`, e=>{
			if (e.target === this.host.canvas) e.preventDefault()
			this.mouse.lastTouch[0] = e.touches[0].clientX
			this.mouse.lastTouch[1] = e.touches[0].clientY
			this.host.processMousemove(e.touches[0])
			this.mouse.positionChanged = false
		})

		this.host.canvas.addEventListener(`touchend`, e=>{
			if (e.target === this.host.canvas) e.preventDefault()
			if (!this.mouse.positionChanged){
				this.host.processMousedown(e)
			}
			this.host.processMousemove(e.touches[0])
		})

		this.host.canvas.addEventListener(`touchmove`, e=>{
			if (e.target === this.host.canvas) e.preventDefault()
			if (e.touches.length === 2){
				const delta: Vec2 = [
					(e.touches[0].clientX - this.mouse.lastTouch[0]) * this.host.pixelRatio,
					(e.touches[0].clientY - this.mouse.lastTouch[1]) * this.host.pixelRatio,
				]
				this.host.processMousemove(e.touches[0], delta)
			} else {
				this.host.processMousemove(e.touches[0])
			}
			this.mouse.lastTouch[0] = e.touches[0].clientX
			this.mouse.lastTouch[1] = e.touches[0].clientY
			console.log(this.mouse.lastTouch[0])
		})

		this.host.canvas.addEventListener(`mousedown`, e=>{
			this.host.processMousedown(e)
		})

		this.host.canvas.addEventListener(`mouseup`, e=>{
			if (!this.mouse.positionChanged && e.button === 2 && this.host.itemInHand){
				delete this.host.itemInHand
				delete this.host.transportedEntity
			}
			this.host.processMouseup()
		})

		this.host.canvas.addEventListener(`mouseenter`, _e=>{
			this.mouse.cursorVisible = true
		})

		this.host.canvas.addEventListener(`mouseout`, _e=>{
			this.host.processMouseout()
		})

		this.host.canvas.addEventListener('wheel', e=>{
			e.preventDefault()

			if (this.shiftPressed){
				if (!this.thereWasZoomAction) this.thereWasZoomAction = true
				const delta: Vec2 = [
					(e as WheelEvent & { wheelDeltaX: number }).wheelDeltaX * (this.host.isWindows ? .2 : .5),
					(e as WheelEvent & { wheelDeltaY: number }).wheelDeltaY * (this.host.isWindows ? .2 : .5)
				]
				this.host.zoomInOut(Math.abs(delta[1]) > Math.abs(delta[0]) ? delta[1] : delta[0])
			} else {
				const delta: Vec2 = [
					(e as WheelEvent & { wheelDeltaX: number }).wheelDeltaX * (this.host.isWindows ? .2 : .5) / this.host.zoom,
					(e as WheelEvent & { wheelDeltaY: number }).wheelDeltaY * (this.host.isWindows ? .2 : .5) / this.host.zoom
				]
				this.host.processMousemove(e, delta)
			}
		})
	}

	updateAutoClicker(dt: number): void {
		if (!this.mouse.automate || !this.mouse.state || !this.host.hoveredEntity || !(this.host.hoveredEntity.name === `cube` || this.host.hoveredEntity.name === `hollow`)) return

		this.mouse.timer -= dt
		if (this.mouse.timer <= 0){
			this.mouse.timer = this.mouse.maxTimer
			this.host.processMousedown()
		}
	}

	updateGamepad(dt: number): void {
		const gamepad = navigator.getGamepads()[0]
		if (!gamepad || gamepad.id.toLowerCase().includes("wheel") || gamepad.id.toLowerCase().includes("driving")) return

		const deadzone = .25
		const freezone = .75
		if (gamepad.axes && gamepad.axes[0] !== undefined && Math.abs(gamepad.axes[0]) > deadzone){
			this.gamepadControl = true
			this.host.translationMap[gamepad.axes[0] > 0 ? 1 : 3] = (Math.abs(gamepad.axes[0]) - deadzone) / freezone * 1.6
			this.mouse.positionChanged = true
		} else {
			if (this.gamepadControl) this.host.translationMap[1] = this.host.translationMap[3] = 0
		}

		if (gamepad.axes && gamepad.axes[1] !== undefined && Math.abs(gamepad.axes[1]) > deadzone){
			if (this.host.altActive && this.host.messenger){
				this.host.messenger.element.scrollBy(0, dt * gamepad.axes[1])
			} else if (this.host.splash?.isShown){
				this.host.splash.glory.scrollBy(0, dt * gamepad.axes[1])
			} else {
				this.gamepadControl = true
				this.host.translationMap[gamepad.axes[1] > 0 ? 2 : 0] = (Math.abs(gamepad.axes[1]) - deadzone) / freezone * 1.6
				this.mouse.positionChanged = true	
			}
		} else {
			if (this.gamepadControl) this.host.translationMap[2] = this.host.translationMap[0] = 0
		}

		if (gamepad.axes && gamepad.axes[2] !== undefined && gamepad.axes[3] !== undefined && (Math.abs(gamepad.axes[2]) > deadzone || Math.abs(gamepad.axes[3]) > deadzone)){
			const x = Math.min(this.host.w / this.host.pixelRatio, Math.max(0, this.mouse.offsetxy[0] + (Math.max(0, Math.abs(gamepad.axes[2]) - deadzone)) * Math.sign(gamepad.axes[2]) / freezone * dt * this.host.pixelRatio * .4))
			const y = Math.min(this.host.h / this.host.pixelRatio, Math.max(0, this.mouse.offsetxy[1] + (Math.max(0, Math.abs(gamepad.axes[3]) - deadzone)) * Math.sign(gamepad.axes[3]) / freezone * dt * this.host.pixelRatio * .4))
			this.updateMouseData(x,y)
			this.host.processMousemove()
		}
		
		const mainAction = (v: number | boolean)=>{
			if (this.host.splash?.isShown){
				if (v) {
					if (this.host.splash.selected && this.host.splash.items[this.host.splash.selectedId]?.onmousedown) (this.host.splash.items[this.host.splash.selectedId].onmousedown as (() => unknown))()
					if (this.host.splash.selected) this.host.splash.items[this.host.splash.selectedId]?.click()
				} else {
					if (this.host.splash.selected && this.host.splash.items[this.host.splash.selectedId]?.onmouseup) (this.host.splash.items[this.host.splash.selectedId].onmouseup as (() => unknown))()
				}
			} else if (this.host.shop?.selected){
				const id = this.host.shop.items[this.host.shop.selectedId]?.name
				if (id && this.host.canAfford?.(id)) {
					this.host.pickupItem?.(id)
					this.host.processMousemove()
				}
				this.host.shop.deselectItem()
			} else {
				if (v) {
					this.host.processMousedown()
				} else {
					if (!this.mouse.positionChanged) {
						this.host.processClick()
					}
					this.host.processMouseup()
				}
			}
		}

		const isValidButton = (id: number, prop: keyof GamepadButton = `value`) => gamepad.buttons[id] && gamepad.buttons[id][prop] !== undefined && gamepad.buttons[id][prop] !== this.gamepadButtons[id]

		if (isValidButton(0)){
			mainAction(gamepad.buttons[0].value)
			this.gamepadButtons[0] = gamepad.buttons[0].value
		}
		if (isValidButton(7,`pressed`)){
			mainAction(gamepad.buttons[7].pressed)
			this.gamepadButtons[7] = gamepad.buttons[7].pressed
		}

		if (isValidButton(2)){
			if (gamepad.buttons[2].value) this.host.processE()
			this.gamepadButtons[2] = gamepad.buttons[2].value
		}

		if (isValidButton(1)){
			if (gamepad.buttons[1].value) this.host.processQ()
			this.gamepadButtons[1] = gamepad.buttons[1].value
		}

		if (isValidButton(10)){
			if (gamepad.buttons[10].value) this.host.messenger?.chatIcon.click()
			this.gamepadButtons[10] = gamepad.buttons[10].value
		}

		if (isValidButton(12)){
			if (gamepad.buttons[12].value) {
				if (this.host.splash?.isShown){
					if (this.host.splash.selected){
						this.host.splash.selectPreviousItem()
					} else {
						this.host.splash.selectItem()
					}
				} else if (this.host.shop?.selected){
					this.host.shop.selectPreviousItem()
				} else {
					this.host.shop?.selectItem()
				}
			}
			this.gamepadButtons[12] = gamepad.buttons[12].value
		}

		if (isValidButton(13)){
			if (gamepad.buttons[13].value) {
				if (this.host.splash?.isShown){
					if (this.host.splash.selected){
						this.host.splash.selectNextItem()
					} else {
						this.host.splash.selectItem()
					}
				} else if (this.host.shop?.selected){
					this.host.shop.selectNextItem()
				} else {
					this.host.shop?.selectItem()
				}
			}
			this.gamepadButtons[13] = gamepad.buttons[13].value
		}

		if (isValidButton(14)){
			if (gamepad.buttons[14].value) {
				if (this.host.splash?.isShown){
					if (this.host.splash.items[this.host.splash.selectedId] === this.host.splash.muteElement){
						this.host.updateGlobalVolume?.((this.host.globalSoundVolume ?? 0.6) - .1)
					} else {
						this.host.splash.deGloryButton.click()	
					}
				} else if (this.host.shop?.selected){
					this.host.shop.deselectItem()
				} else {
					this.host.shop?.selectItem()
				}
			}
			this.gamepadButtons[14] = gamepad.buttons[14].value
		}

		if (isValidButton(15)){
			if (gamepad.buttons[15].value) {
				if (this.host.splash?.isShown){
					if (this.host.splash.items[this.host.splash.selectedId] === this.host.splash.muteElement){
						this.host.updateGlobalVolume?.((this.host.globalSoundVolume ?? 0.6) + .1)
					} else {
						this.host.splash.gloryButton.click()
					}
				} else if (this.host.shop?.selected){
					const id = this.host.shop.items[this.host.shop.selectedId]?.name
					if (id && this.host.canAfford?.(id)) {
						this.host.pickupItem?.(id)
						this.host.processMousemove()
					}
					this.host.shop.deselectItem()
				} else {
					this.host.shop?.selectItem()
				}
			}
			this.gamepadButtons[15] = gamepad.buttons[15].value
		}

		if (isValidButton(8)){
			if (gamepad.buttons[8].value) {
				this.host.togglePhotofobia?.()
			}
			this.gamepadButtons[8] = gamepad.buttons[8].value
		}

		if (isValidButton(9)){
			if (gamepad.buttons[9].value) {
				this.host.toggleSplash()
			}
			this.gamepadButtons[9] = gamepad.buttons[9].value
		}

		if (isValidButton(6,`pressed`)){
			if (gamepad.buttons[6].pressed) {
				this.host.altActive = true
				document.body.classList.add(`altHolded`)
			} else {
				this.host.altActive = false
				document.body.classList.remove(`altHolded`)
			}
			this.gamepadButtons[6] = gamepad.buttons[6].pressed
		}
	}
}
