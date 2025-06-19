// Analytics and Tracking System
class Analytics {
	constructor() {
		this.storageKey = 'gameAnalytics'
		this.dailyCounterKey = 'gameDailyCounter'
		this.sessionKey = 'gameSession'
		this.init()
	}

	// Initialize analytics
	init() {
		this.createVisitorSession()
		this.trackVisit()
		this.setupEventListeners()
		this.updateDailyCounter()
		this.displayCounters()
	}

	// Get user's basic info
	getUserInfo() {
		const userAgent = navigator.userAgent
		const language = navigator.language

		// Detect device type
		const isMobile =
			/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
		const deviceType = isMobile ? 'Mobile' : 'Desktop'

		// Detect browser
		let browser = 'Unknown'
		if (userAgent.includes('Chrome')) browser = 'Chrome'
		else if (userAgent.includes('Firefox')) browser = 'Firefox'
		else if (userAgent.includes('Safari')) browser = 'Safari'
		else if (userAgent.includes('Edge')) browser = 'Edge'

		// Get screen resolution
		const screenRes = `${screen.width}x${screen.height}`

		return {
			userAgent,
			language,
			deviceType,
			browser,
			screenRes,
			timestamp: new Date().toISOString(),
			timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
		}
	}

	// Create unique session ID
	createVisitorSession() {
		let session = localStorage.getItem(this.sessionKey)
		if (!session) {
			session =
				'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
			localStorage.setItem(this.sessionKey, session)
		}
		this.sessionId = session
	}

	// Get or fetch IP and location info
	async getLocationInfo() {
		try {
			// Try to get cached location info
			const cached = localStorage.getItem('locationInfo')
			const cacheTime = localStorage.getItem('locationInfoTime')

			// If cached data is less than 24 hours old, use it
			if (
				cached &&
				cacheTime &&
				Date.now() - parseInt(cacheTime) < 24 * 60 * 60 * 1000
			) {
				return JSON.parse(cached)
			}

			// Fetch new location info
			const response = await fetch('https://ipapi.co/json/')
			const data = await response.json()

			const locationInfo = {
				ip: data.ip || 'Unknown',
				country: data.country_name || 'Unknown',
				city: data.city || 'Unknown',
				region: data.region || 'Unknown',
				countryCode: data.country_code || 'XX',
			}

			// Cache the result
			localStorage.setItem('locationInfo', JSON.stringify(locationInfo))
			localStorage.setItem('locationInfoTime', Date.now().toString())

			return locationInfo
		} catch (error) {
			console.log('Could not fetch location info:', error)
			return {
				ip: 'Unknown',
				country: 'Unknown',
				city: 'Unknown',
				region: 'Unknown',
				countryCode: 'XX',
			}
		}
	}

	// Track a visit
	async trackVisit() {
		const userInfo = this.getUserInfo()
		const locationInfo = await this.getLocationInfo()

		const visitData = {
			id: 'visit_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
			sessionId: this.sessionId,
			type: 'visit',
			timestamp: new Date().toISOString(),
			page: window.location.pathname,
			referrer: document.referrer || 'Direct',
			...userInfo,
			...locationInfo,
		}

		this.saveEvent(visitData)
		this.sendToServer(visitData)
	}

	// Track clicks on specific elements
	trackClick(element, action, details = '') {
		const clickData = {
			id: 'click_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
			sessionId: this.sessionId,
			type: 'click',
			action: action,
			details: details,
			timestamp: new Date().toISOString(),
			element: element.tagName,
			elementClass: element.className,
			elementId: element.id,
			elementText: element.textContent?.substring(0, 50) || '',
		}

		this.saveEvent(clickData)
		this.sendToServer(clickData)
	}

	// Save event to localStorage
	saveEvent(eventData) {
		let analytics = JSON.parse(localStorage.getItem(this.storageKey) || '[]')
		analytics.push(eventData)

		// Keep only last 1000 events
		if (analytics.length > 1000) {
			analytics = analytics.slice(-1000)
		}

		localStorage.setItem(this.storageKey, JSON.stringify(analytics))
	}

	// Send to server (mock function - replace with your server endpoint)
	async sendToServer(data) {
		try {
			// Replace with your actual tracking server URL
			const serverUrl = 'https://your-tracking-server.com/api/track'

			// For now, just log to console (remove in production)
			console.log('📊 Analytics Event:', data)

			// Uncomment and configure for real server
			/*
      await fetch(serverUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      */
		} catch (error) {
			console.log('Failed to send analytics data:', error)
		}
	}

	// Update daily counter
	updateDailyCounter() {
		const today = new Date().toDateString()
		let dailyData = JSON.parse(
			localStorage.getItem(this.dailyCounterKey) || '{}'
		)

		if (!dailyData[today]) {
			dailyData[today] = 0
		}

		// Check if this session already counted today
		const sessionKey = `counted_${today}_${this.sessionId}`
		if (!localStorage.getItem(sessionKey)) {
			dailyData[today]++
			localStorage.setItem(sessionKey, 'true')
			localStorage.setItem(this.dailyCounterKey, JSON.stringify(dailyData))
		}
	}

	// Get today's visitor count
	getTodayCount() {
		const today = new Date().toDateString()
		const dailyData = JSON.parse(
			localStorage.getItem(this.dailyCounterKey) || '{}'
		)
		return dailyData[today] || 0
	}

	// Get total unique visitors (last 30 days)
	getTotalCount() {
		const dailyData = JSON.parse(
			localStorage.getItem(this.dailyCounterKey) || '{}'
		)
		const thirtyDaysAgo = new Date()
		thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

		let total = 0
		for (const [date, count] of Object.entries(dailyData)) {
			if (new Date(date) >= thirtyDaysAgo) {
				total += count
			}
		}
		return total
	}

	// Display counters on page
	displayCounters() {
		const todayCount = this.getTodayCount()
		const totalCount = this.getTotalCount()

		// Create counter element if it doesn't exist
		let counter = document.getElementById('visitorCounter')
		if (!counter) {
			counter = document.createElement('div')
			counter.id = 'visitorCounter'
			counter.innerHTML = `
        <div class="visitor-counter">
          <div class="counter-item">
            <span class="counter-label">Сегодня:</span>
            <span class="counter-value" id="todayCount">${todayCount}</span>
          </div>
          <div class="counter-item">
            <span class="counter-label">Всего:</span>
            <span class="counter-value" id="totalCount">${totalCount}</span>
          </div>
        </div>
      `

			// Add to page
			document.body.appendChild(counter)
		}

		// Update counter styles
		this.addCounterStyles()
	}

	// Add CSS styles for counter
	addCounterStyles() {
		if (document.getElementById('counterStyles')) return

		const style = document.createElement('style')
		style.id = 'counterStyles'
		style.textContent = `
      .visitor-counter {
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 10px 15px;
        border-radius: 10px;
        font-size: 12px;
        z-index: 999;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        min-width: 120px;
      }

      .counter-item {
        display: flex;
        justify-content: space-between;
        margin: 2px 0;
      }

      .counter-label {
        color: #ccc;
        margin-right: 10px;
      }

      .counter-value {
        color: #00ff88;
        font-weight: bold;
      }

      @media (max-width: 768px) {
        .visitor-counter {
          bottom: 10px;
          left: 10px;
          font-size: 11px;
          padding: 8px 12px;
        }
      }
    `
		document.head.appendChild(style)
	}

	// Setup event listeners for tracking
	setupEventListeners() {
		// Track game button clicks
		document.addEventListener('click', e => {
			if (e.target.matches('.game-btn')) {
				this.trackClick(e.target, 'start_game', 'Клик на кнопку начать игру')
			}

			if (e.target.matches('.telegram-btn')) {
				this.trackClick(e.target, 'telegram_click', 'Клик на Telegram канал')
			}

			if (e.target.matches('.language-option')) {
				const lang = e.target.onclick
					.toString()
					.match(/changeLanguage\('(\w+)'\)/)?.[1]
				this.trackClick(e.target, 'language_change', `Смена языка на ${lang}`)
			}
		})

		// Track page visibility changes
		document.addEventListener('visibilitychange', () => {
			if (document.hidden) {
				this.trackEvent('page_blur', 'Пользователь переключился с вкладки')
			} else {
				this.trackEvent('page_focus', 'Пользователь вернулся на вкладку')
			}
		})

		// Track time on page
		this.startTime = Date.now()
		window.addEventListener('beforeunload', () => {
			const timeOnPage = Math.round((Date.now() - this.startTime) / 1000)
			this.trackEvent('page_leave', `Время на странице: ${timeOnPage} сек`)
		})
	}

	// Track custom events
	trackEvent(eventType, details = '') {
		const eventData = {
			id: 'event_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
			sessionId: this.sessionId,
			type: 'event',
			eventType: eventType,
			details: details,
			timestamp: new Date().toISOString(),
		}

		this.saveEvent(eventData)
		this.sendToServer(eventData)
	}

	// Get analytics summary
	getAnalyticsSummary() {
		const analytics = JSON.parse(localStorage.getItem(this.storageKey) || '[]')
		const today = new Date().toDateString()

		const todayEvents = analytics.filter(
			event => new Date(event.timestamp).toDateString() === today
		)

		const visits = analytics.filter(event => event.type === 'visit')
		const clicks = analytics.filter(event => event.type === 'click')

		return {
			totalEvents: analytics.length,
			todayEvents: todayEvents.length,
			totalVisits: visits.length,
			totalClicks: clicks.length,
			uniqueCountries: [...new Set(visits.map(v => v.country))].length,
			topBrowsers: this.getTopValues(visits, 'browser'),
			topCountries: this.getTopValues(visits, 'country'),
		}
	}

	// Helper to get top values
	getTopValues(data, field) {
		const counts = {}
		data.forEach(item => {
			const value = item[field] || 'Unknown'
			counts[value] = (counts[value] || 0) + 1
		})

		return Object.entries(counts)
			.sort(([, a], [, b]) => b - a)
			.slice(0, 5)
	}

	// Export analytics data
	exportData() {
		const analytics = JSON.parse(localStorage.getItem(this.storageKey) || '[]')
		const summary = this.getAnalyticsSummary()

		const exportData = {
			summary,
			events: analytics,
			exportTime: new Date().toISOString(),
		}

		const blob = new Blob([JSON.stringify(exportData, null, 2)], {
			type: 'application/json',
		})

		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = `gaming-analytics-${
			new Date().toISOString().split('T')[0]
		}.json`
		a.click()
		URL.revokeObjectURL(url)
	}
}

// Initialize analytics when script loads
let gameAnalytics

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', () => {
		gameAnalytics = new Analytics()
	})
} else {
	gameAnalytics = new Analytics()
}

// Make analytics available globally
window.gameAnalytics = gameAnalytics
