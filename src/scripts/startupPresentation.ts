export type HomeScreenVariantId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7

export interface HomeScreenVariant {
	readonly id: HomeScreenVariantId
	readonly column: 0 | 1 | 2 | 3
	readonly row: 0 | 1
	readonly imagePath: 'resources/images/logo/sheet.png'
	readonly backgroundPosition: string
	readonly consolePreviewUrl: string
}

interface StartupConsole {
	info(message: string, ...optionalParams: string[]): void
}

const IMAGE_PATH = 'resources/images/logo/sheet.png' as const
const DIVIDER = '--------------------------------------------------'

function variant(
	id: HomeScreenVariantId,
	column: HomeScreenVariant['column'],
	row: HomeScreenVariant['row'],
	consolePreviewUrl: string,
): HomeScreenVariant {
	return Object.freeze({
		id,
		column,
		row,
		imagePath: IMAGE_PATH,
		backgroundPosition: `${100 / 3 * column}% ${100 * row}%`,
		consolePreviewUrl,
	})
}

export const HOME_SCREEN_VARIANTS: readonly HomeScreenVariant[] = Object.freeze([
	variant(0, 0, 0, new URL('../resources/images/logo/console/variant-0.png', import.meta.url).href),
	variant(1, 1, 0, new URL('../resources/images/logo/console/variant-1.png', import.meta.url).href),
	variant(2, 2, 0, new URL('../resources/images/logo/console/variant-2.png', import.meta.url).href),
	variant(3, 3, 0, new URL('../resources/images/logo/console/variant-3.png', import.meta.url).href),
	variant(4, 0, 1, new URL('../resources/images/logo/console/variant-4.png', import.meta.url).href),
	variant(5, 1, 1, new URL('../resources/images/logo/console/variant-5.png', import.meta.url).href),
	variant(6, 2, 1, new URL('../resources/images/logo/console/variant-6.png', import.meta.url).href),
	variant(7, 3, 1, new URL('../resources/images/logo/console/variant-7.png', import.meta.url).href),
])

export const STARTUP_SPLASH_TEXT = Object.freeze({
	title: 'Sixty Four: Cursed Edition',
	credit: 'Browser modernization & modding by arfjdms1',
	api: 'Mod API v0 · Experimental',
})

export function selectHomeScreenVariant(random: () => number = Math.random): HomeScreenVariant {
	const value = random()
	if (!Number.isFinite(value) || value < 0 || value >= 1) {
		throw new RangeError('Home-screen variant selection requires a value in [0, 1)')
	}
	return HOME_SCREEN_VARIANTS[Math.floor(value * HOME_SCREEN_VARIANTS.length)]
}

export function printStartupConsoleSplash(
	selectedHomeVariant: HomeScreenVariant,
	output: StartupConsole = console,
): void {
	const artworkStyle = [
		`background-image: url("${selectedHomeVariant.consolePreviewUrl}")`,
		'background-position: center',
		'background-repeat: no-repeat',
		'background-size: contain',
		'font-size: 1px',
		'padding: 32px',
	].join(';')

	output.info(
		`${DIVIDER}\n%c %c\n\n${STARTUP_SPLASH_TEXT.title}\n${STARTUP_SPLASH_TEXT.credit}\n${STARTUP_SPLASH_TEXT.api}\n${DIVIDER}`,
		artworkStyle,
		'',
	)
}
