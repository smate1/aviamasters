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
		vpnWarning:
			'<strong>⚠️ Важно:</strong> Перед входом, пожалуйста, <strong>отключите VPN</strong> для корректной работы сайта и получения бонусов.',
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
		vpnWarning:
			'<strong>⚠️ Важливо:</strong> Перед входом, будь ласка, <strong>відключіть VPN</strong> для коректної роботи сайту та отримання бонусів.',
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
		vpnWarning:
			'<strong>⚠️ Important:</strong> Before entering, please <strong>disable VPN</strong> for proper site operation and bonus eligibility.',
	},
}

// Current language state (default is Russian)
let currentLanguage = 'ru'

// Analytics system
class GameAnalytics {
	constructor() {
		this.sessionData = {
			sessionId: this.generateSessionId(),
			startTime: new Date().toISOString(),
			userAgent: navigator.userAgent,
			language: navigator.language,
			timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
			referrer: this.getReferrerInfo(),
			screenResolution: `${screen.width}x${screen.height}`,
			deviceType: this.getDeviceType(),
			browser: this.getBrowserInfo(),
			ip: null,
			country: null,
			city: null,
			countryCode: null,
		}
		this.uniqueVisitorKey = 'gameUniqueVisitor'
		this.analyticsKey = 'gameAnalytics'
		this.ipCacheKey = 'gameIpCache'

		this.init()
	}

	getReferrerInfo() {
		const referrer = document.referrer
		if (!referrer) {
			return 'Прямой переход'
		}

		try {
			const url = new URL(referrer)
			const hostname = url.hostname.toLowerCase()

			// Определяем тип источника
			if (hostname.includes('google')) {
				return `Google (${hostname})`
			} else if (hostname.includes('yandex')) {
				return `Yandex (${hostname})`
			} else if (hostname.includes('bing')) {
				return `Bing (${hostname})`
			} else if (hostname.includes('facebook') || hostname.includes('fb.com')) {
				return `Facebook (${hostname})`
			} else if (
				hostname.includes('vk.com') ||
				hostname.includes('vkontakte')
			) {
				return `VKontakte (${hostname})`
			} else if (hostname.includes('telegram') || hostname.includes('t.me')) {
				return `Telegram (${hostname})`
			} else if (hostname.includes('instagram')) {
				return `Instagram (${hostname})`
			} else if (hostname.includes('youtube')) {
				return `YouTube (${hostname})`
			} else if (hostname.includes('twitter') || hostname.includes('x.com')) {
				return `Twitter/X (${hostname})`
			} else if (hostname.includes('tiktok')) {
				return `TikTok (${hostname})`
			} else if (
				hostname.includes('aviamonster') ||
				hostname.includes('aviamasters')
			) {
				return `Наш сайт (${hostname})`
			} else {
				return `${hostname}`
			}
		} catch (e) {
			return referrer.length > 50 ? referrer.substring(0, 50) + '...' : referrer
		}
	}

	generateSessionId() {
		return (
			'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
		)
	}

	getDeviceType() {
		const userAgent = navigator.userAgent.toLowerCase()
		if (/mobile|android|iphone|ipad|phone|tablet/i.test(userAgent)) {
			if (/tablet|ipad/i.test(userAgent)) {
				return 'Tablet'
			}
			return 'Mobile'
		}
		return 'Desktop'
	}

	getBrowserInfo() {
		const userAgent = navigator.userAgent
		if (userAgent.includes('Chrome')) return 'Chrome'
		if (userAgent.includes('Firefox')) return 'Firefox'
		if (userAgent.includes('Safari')) return 'Safari'
		if (userAgent.includes('Edge')) return 'Edge'
		if (userAgent.includes('Opera')) return 'Opera'
		return 'Unknown'
	}

	async getIpInfo() {
		try {
			// Сначала проверяем кеш
			const cachedData = localStorage.getItem(this.ipCacheKey)
			if (cachedData) {
				const { data, timestamp } = JSON.parse(cachedData)
				// Кеш действует 24 часа
				if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
					return data
				}
			}

			// Получаем данные с API
			const response = await fetch('https://ipapi.co/json/')
			const data = await response.json()

			const ipInfo = {
				ip: data.ip,
				country: data.country_name,
				city: data.city,
				countryCode: data.country_code,
			}

			// Сохраняем в кеш
			localStorage.setItem(
				this.ipCacheKey,
				JSON.stringify({
					data: ipInfo,
					timestamp: Date.now(),
				})
			)

			return ipInfo
		} catch (error) {
			console.warn('Failed to get IP info:', error)
			return {
				ip: 'Unknown',
				country: 'Unknown',
				city: 'Unknown',
				countryCode: 'XX',
			}
		}
	}

	async init() {
		// Получаем IP информацию
		const ipInfo = await this.getIpInfo()
		Object.assign(this.sessionData, ipInfo)

		// Проверяем уникальность посетителя по IP
		this.trackUniqueVisitor()
	}

	trackUniqueVisitor() {
		const visitedIPs = JSON.parse(
			localStorage.getItem(this.uniqueVisitorKey) || '[]'
		)
		const currentIP = this.sessionData.ip

		// Проверяем, был ли уже такой IP
		const isUniqueVisitor = !visitedIPs.includes(currentIP)

		if (isUniqueVisitor && currentIP !== 'Unknown') {
			visitedIPs.push(currentIP)
			localStorage.setItem(this.uniqueVisitorKey, JSON.stringify(visitedIPs))

			// Записываем визит только для уникальных IP
			this.trackEvent('visit', 'page_visit', {
				isUniqueVisitor: true,
				totalVisitsFromThisIP: 1,
			})
		} else {
			// Считаем количество визитов с этого IP
			const existingData = JSON.parse(
				localStorage.getItem(this.analyticsKey) || '[]'
			)
			const visitsFromThisIP =
				existingData.filter(item => item.ip === currentIP).length + 1

			this.trackEvent('visit', 'page_visit', {
				isUniqueVisitor: false,
				totalVisitsFromThisIP: visitsFromThisIP,
			})
		}
	}

	trackEvent(type, action, details = {}) {
		const eventData = {
			...this.sessionData,
			timestamp: new Date().toISOString(),
			type: type,
			action: action,
			details: JSON.stringify(details),
			url: window.location.href,
			pageTitle: document.title,
		}

		// Получаем существующие данные
		const existingData = JSON.parse(
			localStorage.getItem(this.analyticsKey) || '[]'
		)
		existingData.push(eventData)

		// Сохраняем (ограничиваем до 1000 записей)
		if (existingData.length > 1000) {
			existingData.splice(0, existingData.length - 1000)
		}

		localStorage.setItem(this.analyticsKey, JSON.stringify(existingData))
	}

	trackClick(elementType, elementText, url = null) {
		this.trackEvent('click', elementType, {
			elementText: elementText,
			targetUrl: url,
			clickTime: new Date().toISOString(),
		})
	}
}

// Initialize analytics
const analytics = new GameAnalytics()

// Initialize the app
function initializeApp() {
	// Detect browser language or get from localStorage
	const savedLanguage = localStorage.getItem('gameLanguage')
	if (savedLanguage && savedLanguage in translations) {
		currentLanguage = savedLanguage
	} else {
		// Auto-detect language from browser
		const browserLang = navigator.language.toLowerCase()
		if (browserLang.startsWith('uk') || browserLang.startsWith('ua')) {
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
			// Для VPN предупреждения используем innerHTML чтобы сохранить HTML теги
			if (key === 'vpnWarning') {
				element.innerHTML = translations[currentLanguage][key]
			} else {
				element.textContent = translations[currentLanguage][key]
			}
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
	const langMap = { ru: 'ru', ua: 'uk', en: 'en' }
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

		// Track language change
		analytics.trackEvent('event', 'language_change', { newLanguage: language })

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
	// Track click on play button
	analytics.trackClick(
		'play_button',
		translations[currentLanguage].startGame,
		'#'
	)

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
			// Track telegram click
			if (button.classList.contains('telegram-btn')) {
				const telegramUrl = button.getAttribute('href')
				analytics.trackClick(
					'telegram_button',
					translations[currentLanguage].telegramChannel,
					telegramUrl
				)
			}

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
	}, 1000)
})
