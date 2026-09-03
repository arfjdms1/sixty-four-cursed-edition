import type { ModManagementApi } from '../modding/ModManagement.js'
import type { ModSnapshot } from '../modding/types.js'

export interface ModsSaveApi {
	exportSaveToken(): string | undefined
	importSaveToken(token: string): boolean
}

function statusText(snapshot: ModSnapshot): string {
	let base: string
	if (snapshot.status === 'failed') base = 'Failed'
	else if (snapshot.status === 'loading') base = 'Loading'
	else if (snapshot.status === 'active') base = 'Active'
	else if (snapshot.status === 'discovered') base = 'Enabled'
	else if (snapshot.status === 'disabled') base = 'Disabled'
	else base = snapshot.status
	if (snapshot.reloadRequired) return `${base} · Reload required`
	return base
}

export class ModsPanel {
	private readonly api: ModManagementApi
	private readonly saveApi: ModsSaveApi | null
	private overlay: HTMLDivElement | null = null
	private listEl: HTMLDivElement | null = null
	private reloadButton: HTMLButtonElement | null = null
	private boundKeyHandler: ((e: KeyboardEvent) => void) | null = null

	constructor(api: ModManagementApi, saveApi?: ModsSaveApi | null) {
		this.api = api
		this.saveApi = saveApi ?? null
	}

	isOpen(): boolean {
		return this.overlay !== null && document.body.contains(this.overlay)
	}

	show(): void {
		if (this.isOpen()) {
			this.render()
			return
		}
		this.overlay = document.createElement('div')
		this.overlay.classList.add('modsBackdrop')
		this.overlay.setAttribute('aria-hidden', 'false')

		const panel = document.createElement('div')
		panel.classList.add('modsPanel')
		panel.setAttribute('role', 'dialog')
		panel.setAttribute('aria-modal', 'true')
		panel.setAttribute('aria-label', 'Mods')

		const header = document.createElement('div')
		header.classList.add('modsHeader')

		const titleWrap = document.createElement('div')
		titleWrap.classList.add('modsTitleWrap')
		const puzzleIcon = document.createElement('div')
		puzzleIcon.classList.add('modsHeaderIcon')
		titleWrap.append(puzzleIcon)
		const title = document.createElement('h2')
		title.classList.add('modsTitle')
		title.textContent = 'MODS'
		titleWrap.append(title)
		header.append(titleWrap)

		const experimental = document.createElement('div')
		experimental.classList.add('modsExperimental')
		experimental.textContent = 'Mod API v0 · Experimental'
		header.append(experimental)

		panel.append(header)

		if (this.saveApi) {
			const settingsDetails = document.createElement('details')
			settingsDetails.classList.add('modsSettings')

			const summary = document.createElement('summary')
			summary.classList.add('modsSettingsSummary')

			const summaryLabel = document.createElement('span')
			summaryLabel.classList.add('modsSettingsSummaryLabel')
			summaryLabel.textContent = '⚙ SETTINGS & SAVE DATA'

			const summaryArrow = document.createElement('span')
			summaryArrow.classList.add('modsSettingsArrow')
			summaryArrow.textContent = '▾'

			summary.append(summaryLabel, summaryArrow)
			settingsDetails.append(summary)

			const settingsContent = document.createElement('div')
			settingsContent.classList.add('modsSettingsContent')

			const settingsDesc = document.createElement('div')
			settingsDesc.classList.add('modsSettingsDesc')
			settingsDesc.textContent = 'Backup or restore your complete game progress using a Base64 save token.'
			settingsContent.append(settingsDesc)

			const saveActions = document.createElement('div')
			saveActions.classList.add('modsSaveActions')

			const saveDialogContainer = document.createElement('div')
			saveDialogContainer.classList.add('modsSaveContainer')

			const showDialog = (contentEl: HTMLElement) => {
				saveDialogContainer.textContent = ''
				saveDialogContainer.append(contentEl)
			}

			const clearDialog = () => {
				saveDialogContainer.textContent = ''
			}

			const exportBtn = document.createElement('button')
			exportBtn.classList.add('modsSaveButton', 'modsExportBtn')
			exportBtn.type = 'button'
			exportBtn.textContent = 'Export Save'
			exportBtn.addEventListener('click', () => {
				const token = this.saveApi?.exportSaveToken()
				if (!token) {
					window.alert('No save to export')
					return
				}
				const box = document.createElement('div')
				box.classList.add('modsSaveDialog', 'modsExportDialog')

				const boxHeader = document.createElement('div')
				boxHeader.classList.add('modsSaveDialogHeader')
				const boxTitle = document.createElement('span')
				boxTitle.classList.add('modsSaveDialogTitle')
				boxTitle.textContent = 'SAVE BACKUP TOKEN'
				const boxClose = document.createElement('button')
				boxClose.type = 'button'
				boxClose.classList.add('modsSaveDialogClose')
				boxClose.textContent = '✕'
				boxClose.addEventListener('click', clearDialog)
				boxHeader.append(boxTitle, boxClose)

				const boxDesc = document.createElement('div')
				boxDesc.classList.add('modsSaveDialogDesc')
				boxDesc.textContent = 'Copy this Base64 token to backup or move your save.'

				const textarea = document.createElement('textarea')
				textarea.classList.add('modsSaveTokenInput')
				textarea.readOnly = true
				textarea.spellcheck = false
				textarea.value = token
				setTimeout(() => {
					textarea.focus()
					textarea.select()
				}, 10)

				const buttons = document.createElement('div')
				buttons.classList.add('modsSaveDialogButtons')

				const copyBtn = document.createElement('button')
				copyBtn.type = 'button'
				copyBtn.classList.add('modsSaveActionBtn', 'modsCopyBtn')
				copyBtn.textContent = 'Copy Token'

				const status = document.createElement('div')
				status.classList.add('modsSaveDialogStatus')
				status.setAttribute('aria-live', 'polite')

				copyBtn.addEventListener('click', () => {
					if (navigator.clipboard?.writeText) {
						navigator.clipboard.writeText(token).catch(() => {})
					}
					status.textContent = '✓ Copied to clipboard!'
					copyBtn.textContent = 'Copied!'
					setTimeout(() => { copyBtn.textContent = 'Copy Token' }, 2000)
				})

				const doneBtn = document.createElement('button')
				doneBtn.type = 'button'
				doneBtn.classList.add('modsSaveActionBtn', 'modsCloseDialogBtn')
				doneBtn.textContent = 'Done'
				doneBtn.addEventListener('click', clearDialog)

				buttons.append(copyBtn, doneBtn)
				box.append(boxHeader, boxDesc, textarea, buttons, status)
				showDialog(box)
			})

			const importBtn = document.createElement('button')
			importBtn.classList.add('modsSaveButton', 'modsImportBtn')
			importBtn.type = 'button'
			importBtn.textContent = 'Import Save'
			importBtn.addEventListener('click', () => {
				const box = document.createElement('div')
				box.classList.add('modsSaveDialog', 'modsImportDialog')

				const boxHeader = document.createElement('div')
				boxHeader.classList.add('modsSaveDialogHeader')
				const boxTitle = document.createElement('span')
				boxTitle.classList.add('modsSaveDialogTitle')
				boxTitle.textContent = 'IMPORT SAVE PROGRESS'
				const boxClose = document.createElement('button')
				boxClose.type = 'button'
				boxClose.classList.add('modsSaveDialogClose')
				boxClose.textContent = '✕'
				boxClose.addEventListener('click', clearDialog)
				boxHeader.append(boxTitle, boxClose)

				const boxDesc = document.createElement('div')
				boxDesc.classList.add('modsSaveDialogDesc')
				boxDesc.textContent = 'Paste a Base64 save token below to replace current game progress.'

				const textarea = document.createElement('textarea')
				textarea.classList.add('modsSaveTokenInput')
				textarea.placeholder = 'Paste Base64 save token here...'
				textarea.spellcheck = false
				setTimeout(() => { textarea.focus() }, 10)

				const buttons = document.createElement('div')
				buttons.classList.add('modsSaveDialogButtons')

				const applyBtn = document.createElement('button')
				applyBtn.type = 'button'
				applyBtn.classList.add('modsSaveActionBtn', 'modsApplyImportBtn')
				applyBtn.textContent = 'Restore & Reload'

				const status = document.createElement('div')
				status.classList.add('modsSaveDialogStatus')
				status.setAttribute('aria-live', 'polite')

				applyBtn.addEventListener('click', () => {
					const val = textarea.value.trim()
					if (!val) {
						status.textContent = 'Please paste a save token.'
						status.classList.add('modsStatusError')
						return
					}
					const ok = this.saveApi?.importSaveToken(val)
					if (!ok) {
						status.textContent = 'Invalid save token.'
						status.classList.add('modsStatusError')
					} else {
						status.textContent = '✓ Save valid. Restoring game...'
						status.classList.remove('modsStatusError')
					}
				})

				const cancelBtn = document.createElement('button')
				cancelBtn.type = 'button'
				cancelBtn.classList.add('modsSaveActionBtn', 'modsCloseDialogBtn')
				cancelBtn.textContent = 'Cancel'
				cancelBtn.addEventListener('click', clearDialog)

				buttons.append(applyBtn, cancelBtn)
				box.append(boxHeader, boxDesc, textarea, buttons, status)
				showDialog(box)
			})

			saveActions.append(exportBtn, importBtn)
			settingsContent.append(saveActions, saveDialogContainer)
			settingsDetails.append(settingsContent)
			panel.append(settingsDetails)
		}

		this.listEl = document.createElement('div')
		this.listEl.classList.add('modsList')
		panel.append(this.listEl)

		const footer = document.createElement('div')
		footer.classList.add('modsFooter')

		this.reloadButton = document.createElement('button')
		this.reloadButton.classList.add('modsReloadButton')
		this.reloadButton.type = 'button'
		this.reloadButton.textContent = 'Reload game'
		this.reloadButton.addEventListener('click', () => this.api.reload())
		footer.append(this.reloadButton)

		const closeButton = document.createElement('button')
		closeButton.classList.add('modsCloseButton')
		closeButton.type = 'button'
		closeButton.textContent = 'Close'
		closeButton.addEventListener('click', () => this.hide())
		footer.append(closeButton)

		panel.append(footer)
		this.overlay.append(panel)

		this.boundKeyHandler = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				if (this.isOpen()) {
					e.preventDefault()
					e.stopPropagation()
					e.stopImmediatePropagation()
					this.hide()
				}
			}
		}
		window.addEventListener('keydown', this.boundKeyHandler, true)

		this.overlay.addEventListener('click', e => {
			if (e.target === this.overlay) this.hide()
		})

		document.body.append(this.overlay)
		this.render()
		closeButton.focus()
	}

	hide(): void {
		if (!this.overlay) return
		if (this.boundKeyHandler) window.removeEventListener('keydown', this.boundKeyHandler, true)
		this.boundKeyHandler = null
		this.overlay.remove()
		this.overlay = null
		this.listEl = null
		this.reloadButton = null
	}

	private render(): void {
		if (!this.listEl || !this.reloadButton) return
		const snapshots = this.api.mods()
		this.listEl.textContent = ''

		if (snapshots.length === 0) {
			const empty = document.createElement('div')
			empty.classList.add('modsEmpty')
			empty.textContent = 'No mods installed.'
			this.listEl.append(empty)
		} else {
			for (const snapshot of snapshots) {
				this.listEl.append(this.createCard(snapshot))
			}
		}

		const needsReload = snapshots.some(s => s.reloadRequired)
		this.reloadButton.style.display = needsReload ? '' : 'none'
		this.reloadButton.disabled = !needsReload
	}

	private createCard(snapshot: ModSnapshot): HTMLElement {
		const card = document.createElement('div')
		card.classList.add('modCard')
		card.setAttribute('data-mod-id', snapshot.manifest.id)

		const header = document.createElement('div')
		header.classList.add('modCardHeader')

		const name = document.createElement('div')
		name.classList.add('modName')
		name.textContent = snapshot.manifest.name
		header.append(name)

		const version = document.createElement('div')
		version.classList.add('modVersion')
		version.textContent = `v${snapshot.manifest.version}`
		header.append(version)

		card.append(header)

		if (snapshot.manifest.author) {
			const author = document.createElement('div')
			author.classList.add('modAuthor')
			author.textContent = `by ${snapshot.manifest.author}`
			card.append(author)
		}

		if (snapshot.manifest.description) {
			const desc = document.createElement('div')
			desc.classList.add('modDescription')
			desc.textContent = snapshot.manifest.description
			card.append(desc)
		}

		const meta = document.createElement('div')
		meta.classList.add('modMeta')

		const id = document.createElement('div')
		id.classList.add('modId')
		id.textContent = snapshot.manifest.id
		meta.append(id)

		if (snapshot.manifest.homepage) {
			const link = document.createElement('a')
			link.classList.add('modHomepage')
			link.textContent = snapshot.manifest.homepage
			link.href = snapshot.manifest.homepage
			link.target = '_blank'
			link.rel = 'noopener noreferrer'
			meta.append(link)
		}

		card.append(meta)

		const status = document.createElement('div')
		status.classList.add('modStatus')
		status.textContent = statusText(snapshot)
		status.setAttribute('aria-live', 'polite')
		card.append(status)

		if (snapshot.reloadRequired) {
			const reloadNotice = document.createElement('div')
			reloadNotice.classList.add('modReloadRequired')
			reloadNotice.textContent = 'Reload required'
			card.append(reloadNotice)
		}

		if (snapshot.status === 'failed' && snapshot.error) {
			const error = document.createElement('div')
			error.classList.add('modError')
			const phase = document.createElement('span')
			phase.classList.add('modErrorPhase')
			phase.textContent = snapshot.error.phase
			error.append(phase)
			const msg = document.createElement('span')
			msg.classList.add('modErrorMessage')
			msg.textContent = `: ${snapshot.error.error.message}`
			error.append(msg)
			card.append(error)
		}

		const toggleWrap = document.createElement('label')
		toggleWrap.classList.add('modToggleLabel')

		const toggle = document.createElement('input')
		toggle.type = 'checkbox'
		toggle.classList.add('modToggle')
		toggle.checked = snapshot.enabled
		toggle.setAttribute('aria-label', `Enable ${snapshot.manifest.name}`)
		// disable while loading to avoid races
		toggle.disabled = snapshot.status === 'loading'

		const toggleText = document.createElement('span')
		toggleText.classList.add('modToggleText')
		toggleText.textContent = snapshot.enabled ? 'Enabled' : 'Disabled'

		toggle.addEventListener('change', () => {
			const prev = snapshot.enabled
			const ok = toggle.checked ? this.api.enable(snapshot.manifest.id) : this.api.disable(snapshot.manifest.id)
			if (!ok) {
				// revert on failure and keep authoritative state
				toggle.checked = prev
				toggleText.textContent = prev ? 'Enabled' : 'Disabled'
			}
			this.render()
		})

		toggleWrap.append(toggle, toggleText)
		card.append(toggleWrap)

		return card
	}
}
