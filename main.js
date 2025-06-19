// Translations object
const translations = {
	ru: {
		pageTitle: 'Gaming Landing - Лучшая онлайн игра',
		gameHere: 'ИГРА ЗДЕСЬ',
		bonus: 'БОНУС: +500% К ДЕПОЗИТУ',
		promoCode: 'ПРОМОКОД: LEPRO12',
		startGame: 'НАЧАТЬ ИГРУ',
		wantToWin: 'Хочешь убедиться?',
		joinTelegram: 'Вступай в Telegram канал — мой путь к 1,000,000$!',
		telegramChannel: 'Telegram канал',
		brand: '🎮 AVIAMASTERS',
		gameDescription: 'Лучшая онлайн игра с большими выигрышами!',
	},
	kz: {
		pageTitle: 'Gaming Landing - Ең жақсы онлайн ойын',
		gameHere: 'ОЙЫН МҰНДА',
		bonus: 'БОНУС: +500% ДЕПОЗИТКЕ',
		promoCode: 'ПРОМОКОД: LEPRO12',
		startGame: 'ОЙЫНДЫ БАСТАУ',
		wantToWin: 'Көз жеткізгің келе ме?',
		joinTelegram: 'Telegram каналына қосыл — менің 1,000,000$ жолым!',
		telegramChannel: 'Telegram канал',
		brand: '🎮 AVIAMASTERS',
		gameDescription: 'Үлкен ұтыстары бар ең жақсы онлайн ойын!',
	},
	ua: {
		pageTitle: 'Gaming Landing - Найкраща онлайн гра',
		gameHere: 'ГРА ТУТ',
		bonus: 'БОНУС: +500% К ДЕПОЗИТУ',
		promoCode: 'ПРОМОКОД: LEPRO12',
		startGame: 'ПОЧАТИ ГРУ',
		wantToWin: 'Хочеш переконатися?',
		joinTelegram: 'Вступай в Telegram канал — мій шлях к 1,000,000$!',
		telegramChannel: 'Telegram канал',
		brand: '🎮 AVIAMASTERS',
		gameDescription: 'Найкраща онлайн гра з великими виграшами!',
	},
	en: {
		pageTitle: 'Gaming Landing - Best Online Game',
		gameHere: 'GAME HERE',
		bonus: 'BONUS: +500% TO DEPOSIT',
		promoCode: 'PROMO CODE: LEPRO12',
		startGame: 'START GAME',
		wantToWin: 'Want to make sure?',
		joinTelegram: 'Join Telegram channel — my way to $1,000,000!',
		telegramChannel: 'Telegram channel',
		brand: '🎮 AVIAMASTERS',
		gameDescription: 'Best online game with big winnings!',
	},
}

// Current language state (default is Russian)
let currentLanguage = 'ru'

// Initialize the app
function initializeApp() {
	// Detect browser language or get from localStorage
	const savedLanguage = localStorage.getItem('gameLanguage')
	if (savedLanguage && savedLanguage in translations) {
		currentLanguage = savedLanguage
	} else {
		// Auto-detect language from browser
		const browserLang = navigator.language.toLowerCase()
		if (browserLang.startsWith('kk') || browserLang.startsWith('kz')) {
			currentLanguage = 'kz'
		} else if (browserLang.startsWith('uk') || browserLang.startsWith('ua')) {
			currentLanguage = 'ua'
		} else if (browserLang.startsWith('en')) {
			currentLanguage = 'en'
		} else {
			// Default to Russian for most users
			currentLanguage = 'ru'
		}
	}

	updateLanguageDisplay()
	updateContent()
}

// Update language selector display
function updateLanguageDisplay() {
	const currentLangElement = document.getElementById('currentLang')
	if (currentLangElement) {
		const flags = {
			ru: '🇷🇺 RU',
			kz: '🇰🇿 KZ',
			ua: '🇺🇦 UA',
			en: '🇺🇸 EN',
		}
		currentLangElement.textContent = flags[currentLanguage]
	}
}

// Update all translatable content
function updateContent() {
	const elements = document.querySelectorAll('[data-translate]')
	for (const element of elements) {
		const key = element.getAttribute('data-translate')
		if (key && key in translations[currentLanguage]) {
			element.textContent = translations[currentLanguage][key]
		}
	}

	// Update page title
	const titleElement = document.querySelector('title')
	if (titleElement) {
		titleElement.textContent = translations[currentLanguage].pageTitle
	}

	// Update meta description
	const metaDescription = document.querySelector('meta[name="description"]')
	if (metaDescription) {
		metaDescription.setAttribute(
			'content',
			translations[currentLanguage].gameDescription
		)
	}

	// Update HTML lang attribute
	const langMap = { ru: 'ru', kz: 'kk', ua: 'uk', en: 'en' }
	document.documentElement.lang = langMap[currentLanguage]
}

// Toggle language dropdown
function toggleLanguageDropdown() {
	const dropdown = document.getElementById('languageDropdown')
	if (dropdown) {
		dropdown.classList.toggle('show')
	}
}

// Change language
function changeLanguage(language) {
	if (language in translations) {
		currentLanguage = language
		localStorage.setItem('gameLanguage', language)
		updateLanguageDisplay()
		updateContent()

		// Hide dropdown
		const dropdown = document.getElementById('languageDropdown')
		if (dropdown) {
			dropdown.classList.remove('show')
		}

		// Show notification
		showNotification(translations[currentLanguage].gameDescription)
	}
}

// Start game function
function startGame() {
	// Add some interactive feedback
	const button = event?.target
	if (button) {
		button.style.transform = 'scale(0.95)'
		setTimeout(() => {
			button.style.transform = 'scale(1.1)'
		}, 100)
		setTimeout(() => {
			button.style.transform = 'scale(1)'
		}, 200)
	}

	// Show notification or redirect
	showNotification(`🎮 ${translations[currentLanguage].startGame}!`)

	// Here you can add actual game logic or redirect
	// window.open('https://your-game-url.com', '_blank');
}

// Show notification
function showNotification(message) {
	// Create notification element
	const notification = document.createElement('div')
	notification.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 255, 136, 0.9);
    color: white;
    padding: 20px;
    border-radius: 10px;
    font-weight: bold;
    z-index: 10000;
    animation: fadeInOut 2s ease-in-out;
  `
	notification.textContent = message

	// Add fade animation
	const style = document.createElement('style')
	style.textContent = `
    @keyframes fadeInOut {
      0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
      50% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
      100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    }
  `
	document.head.appendChild(style)

	document.body.appendChild(notification)

	// Remove notification after animation
	setTimeout(() => {
		if (document.body.contains(notification)) {
			document.body.removeChild(notification)
		}
		if (document.head.contains(style)) {
			document.head.removeChild(style)
		}
	}, 2000)
}

// Close dropdown when clicking outside
document.addEventListener('click', event => {
	const dropdown = document.getElementById('languageDropdown')
	const languageSelector = document.querySelector('.language-selector')

	if (
		dropdown &&
		languageSelector &&
		!languageSelector.contains(event.target)
	) {
		dropdown.classList.remove('show')
	}
})

// Add some interactive animations
function addInteractiveAnimations() {

	// Add click effect to buttons
	const buttons = document.querySelectorAll('.game-btn, .telegram-btn')
	for (const button of buttons) {
		button.addEventListener('click', e => {
			// Create ripple effect
			const ripple = document.createElement('span')
			const rect = e.target.getBoundingClientRect()
			const size = Math.max(rect.width, rect.height)
			ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple 0.6s linear;
        width: ${size}px;
        height: ${size}px;
        left: ${e.clientX - rect.left - size / 2}px;
        top: ${e.clientY - rect.top - size / 2}px;
        pointer-events: none;
      `

			const rippleStyle = document.createElement('style')
			rippleStyle.textContent = `
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `
			document.head.appendChild(rippleStyle)

			e.target.style.position = 'relative'
			e.target.style.overflow = 'hidden'
			e.target.appendChild(ripple)

			setTimeout(() => {
				if (ripple.parentNode) {
					ripple.remove()
				}
				if (rippleStyle.parentNode) {
					rippleStyle.remove()
				}
			}, 600)
		})
	}
}

// Make functions globally available
window.toggleLanguageDropdown = toggleLanguageDropdown
window.changeLanguage = changeLanguage
window.startGame = startGame

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
	initializeApp()
	addInteractiveAnimations()

	// Add welcome animation
	setTimeout(() => {
		showNotification(`🎉 ${translations[currentLanguage].gameDescription}`)
	}, 10)
})
