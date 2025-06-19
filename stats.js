// Statistics Dashboard
class StatsDashboard {
	constructor() {
		this.isVisible = false
		this.setupKeyboardShortcut()
	}

	// Setup keyboard shortcut to open stats (Ctrl+Shift+S)
	setupKeyboardShortcut() {
		document.addEventListener('keydown', e => {
			if (e.ctrlKey && e.shiftKey && e.key === 'S') {
				e.preventDefault()
				this.toggleStats()
			}
		})

		// Also add secret click area in corner
		const secretArea = document.createElement('div')
		secretArea.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 50px;
      height: 50px;
      z-index: 10000;
      opacity: 0;
      cursor: pointer;
    `
		secretArea.addEventListener('click', () => this.toggleStats())
		document.body.appendChild(secretArea)
	}

	// Toggle stats dashboard
	toggleStats() {
		if (this.isVisible) {
			this.hideStats()
		} else {
			this.showStats()
		}
	}

	// Show statistics dashboard
	showStats() {
		if (this.isVisible) return

		const analytics = JSON.parse(localStorage.getItem('gameAnalytics') || '[]')
		const summary = this.getStatsSummary(analytics)

		const statsOverlay = document.createElement('div')
		statsOverlay.id = 'statsOverlay'
		statsOverlay.innerHTML = `
      <div class="stats-dashboard">
        <div class="stats-header">
          <h1>📊 Статистика посещений</h1>
          <button class="close-btn" onclick="window.statsDashboard.hideStats()">✕</button>
        </div>

        <div class="stats-summary">
          <div class="summary-item">
            <span class="summary-label">Уникальных IP:</span>
            <span class="summary-value">${summary.uniqueIPs}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Всего записей:</span>
            <span class="summary-value">${summary.totalEvents}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Сегодня:</span>
            <span class="summary-value">${summary.todayEvents}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Кликов:</span>
            <span class="summary-value">${summary.totalClicks}</span>
          </div>
        </div>

        <div class="stats-controls">
          <button onclick="window.statsDashboard.clearStats()">🗑 Очистить логи</button>
          <button onclick="window.gameAnalytics.exportData()">📥 Скачать JSON</button>
          <button onclick="window.statsDashboard.exportCSV()">📊 Скачать CSV</button>
          <select id="countryFilter" onchange="window.statsDashboard.filterTable()">
            <option value="">Все страны</option>
            ${this.getCountryOptions(analytics)}
          </select>
        </div>

        <div class="stats-table-container">
          <table class="stats-table" id="statsTable">
            <thead>
              <tr>
                <th>IP</th>
                <th>Страна</th>
                <th>Город</th>
                <th>Время</th>
                <th>Устр-во</th>
                <th>Браузер</th>
                <th>Действие</th>
                <th>Детали</th>
              </tr>
            </thead>
            <tbody>
              ${this.generateTableRows(analytics)}
            </tbody>
          </table>
        </div>

        <div class="stats-charts">
          <div class="chart-container">
            <h3>📈 Топ стран</h3>
            <div class="chart-bar-container">
              ${this.generateCountryChart(analytics)}
            </div>
          </div>

          <div class="chart-container">
            <h3>🌐 Топ браузеров</h3>
            <div class="chart-bar-container">
              ${this.generateBrowserChart(analytics)}
            </div>
          </div>
        </div>
      </div>
    `

		// Add styles
		this.addStatsStyles()

		document.body.appendChild(statsOverlay)
		this.isVisible = true

		// Make overlay clickable to close
		statsOverlay.addEventListener('click', e => {
			if (e.target === statsOverlay) {
				this.hideStats()
			}
		})
	}

	// Hide stats dashboard
	hideStats() {
		const overlay = document.getElementById('statsOverlay')
		if (overlay) {
			overlay.remove()
			this.isVisible = false
		}
	}

	// Get statistics summary
	getStatsSummary(analytics) {
		const today = new Date().toDateString()
		const todayEvents = analytics.filter(
			event => new Date(event.timestamp).toDateString() === today
		)

		const visits = analytics.filter(event => event.type === 'visit')
		const clicks = analytics.filter(event => event.type === 'click')
		const uniqueIPs = [...new Set(visits.map(v => v.ip))].length

		return {
			totalEvents: analytics.length,
			todayEvents: todayEvents.length,
			totalClicks: clicks.length,
			uniqueIPs: uniqueIPs,
		}
	}

	// Generate country filter options
	getCountryOptions(analytics) {
		const countries = [
			...new Set(
				analytics
					.filter(event => event.country && event.country !== 'Unknown')
					.map(event => event.country)
			),
		].sort()

		return countries
			.map(country => `<option value="${country}">${country}</option>`)
			.join('')
	}

	// Generate table rows
	generateTableRows(analytics, countryFilter = '') {
		let filteredAnalytics = analytics

		if (countryFilter) {
			filteredAnalytics = analytics.filter(
				event => event.country === countryFilter
			)
		}

		// Sort by timestamp (newest first)
		filteredAnalytics.sort(
			(a, b) => new Date(b.timestamp) - new Date(a.timestamp)
		)

		return filteredAnalytics
			.slice(0, 100)
			.map(event => {
				const date = new Date(event.timestamp)
				const deviceIcon = event.deviceType === 'Mobile' ? '📱' : '💻'
				const actionIcon = this.getActionIcon(event)

				return `
        <tr>
          <td>${event.ip || '-'}</td>
          <td>${this.getCountryFlag(event.countryCode)} ${
					event.country || '-'
				}</td>
          <td>${event.city || '-'}</td>
          <td>${date.toLocaleString('ru-RU')}</td>
          <td>${deviceIcon} ${event.deviceType || '-'}</td>
          <td>${event.browser || '-'}</td>
          <td>${actionIcon} ${event.type || '-'}</td>
          <td>${event.details || event.action || '-'}</td>
        </tr>
      `
			})
			.join('')
	}

	// Get action icon
	getActionIcon(event) {
		switch (event.type) {
			case 'visit':
				return '👁️'
			case 'click':
				return '👆'
			case 'event':
				return '⚡'
			default:
				return '❓'
		}
	}

	// Get country flag
	getCountryFlag(countryCode) {
		const flags = {
			RU: '🇷🇺',
			KZ: '🇰🇿',
			UA: '🇺🇦',
			US: '🇺🇸',
			DE: '🇩🇪',
			FR: '🇫🇷',
			GB: '🇬🇧',
			CA: '🇨🇦',
			AU: '🇦🇺',
			JP: '🇯🇵',
			CN: '🇨🇳',
			IN: '🇮🇳',
			BR: '🇧🇷',
			MX: '🇲🇽',
			IT: '🇮🇹',
			ES: '🇪🇸',
			PL: '🇵🇱',
			TR: '🇹🇷',
			SA: '🇸🇦',
			CZ: '🇨🇿',
		}
		return flags[countryCode] || '🌍'
	}

	// Generate country chart
	generateCountryChart(analytics) {
		const visits = analytics.filter(
			event => event.type === 'visit' && event.country
		)
		const countryCounts = {}

		visits.forEach(visit => {
			const country = visit.country
			countryCounts[country] = (countryCounts[country] || 0) + 1
		})

		const sortedCountries = Object.entries(countryCounts)
			.sort(([, a], [, b]) => b - a)
			.slice(0, 5)

		const maxCount = Math.max(...sortedCountries.map(([, count]) => count))

		return sortedCountries
			.map(([country, count]) => {
				const percentage = (count / maxCount) * 100
				return `
        <div class="chart-bar">
          <div class="chart-label">${country}</div>
          <div class="chart-bar-fill" style="width: ${percentage}%"></div>
          <div class="chart-value">${count}</div>
        </div>
      `
			})
			.join('')
	}

	// Generate browser chart
	generateBrowserChart(analytics) {
		const visits = analytics.filter(
			event => event.type === 'visit' && event.browser
		)
		const browserCounts = {}

		visits.forEach(visit => {
			const browser = visit.browser
			browserCounts[browser] = (browserCounts[browser] || 0) + 1
		})

		const sortedBrowsers = Object.entries(browserCounts)
			.sort(([, a], [, b]) => b - a)
			.slice(0, 5)

		const maxCount = Math.max(...sortedBrowsers.map(([, count]) => count))

		return sortedBrowsers
			.map(([browser, count]) => {
				const percentage = (count / maxCount) * 100
				const browserIcon = this.getBrowserIcon(browser)
				return `
        <div class="chart-bar">
          <div class="chart-label">${browserIcon} ${browser}</div>
          <div class="chart-bar-fill" style="width: ${percentage}%"></div>
          <div class="chart-value">${count}</div>
        </div>
      `
			})
			.join('')
	}

	// Get browser icon
	getBrowserIcon(browser) {
		const icons = {
			Chrome: '🟢',
			Firefox: '🦊',
			Safari: '🧭',
			Edge: '🔷',
			Opera: '🎭',
		}
		return icons[browser] || '🌐'
	}

	// Filter table by country
	filterTable() {
		const countryFilter = document.getElementById('countryFilter')?.value || ''
		const analytics = JSON.parse(localStorage.getItem('gameAnalytics') || '[]')
		const tableBody = document.querySelector('#statsTable tbody')

		if (tableBody) {
			tableBody.innerHTML = this.generateTableRows(analytics, countryFilter)
		}
	}

	// Clear all statistics
	clearStats() {
		if (confirm('Вы уверены, что хотите очистить все логи?')) {
			localStorage.removeItem('gameAnalytics')
			localStorage.removeItem('gameDailyCounter')
			localStorage.removeItem('gameSession')

			// Clear all session keys
			const keysToRemove = []
			for (let i = 0; i < localStorage.length; i++) {
				const key = localStorage.key(i)
				if (key && key.startsWith('counted_')) {
					keysToRemove.push(key)
				}
			}
			keysToRemove.forEach(key => localStorage.removeItem(key))

			this.hideStats()

			// Update counters
			if (window.gameAnalytics) {
				window.gameAnalytics.displayCounters()
			}

			alert('Логи очищены!')
		}
	}

	// Export data as CSV
	exportCSV() {
		const analytics = JSON.parse(localStorage.getItem('gameAnalytics') || '[]')

		if (analytics.length === 0) {
			alert('Нет данных для экспорта')
			return
		}

		const headers = [
			'IP',
			'Страна',
			'Город',
			'Время',
			'Устройство',
			'Браузер',
			'Тип',
			'Действие',
			'Детали',
		]
		const csvContent = [
			headers.join(','),
			...analytics.map(event =>
				[
					event.ip || '',
					event.country || '',
					event.city || '',
					event.timestamp || '',
					event.deviceType || '',
					event.browser || '',
					event.type || '',
					event.action || '',
					(event.details || '').replace(/,/g, ';'),
				]
					.map(field => `"${field}"`)
					.join(',')
			),
		].join('\n')

		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = `gaming-stats-${new Date().toISOString().split('T')[0]}.csv`
		a.click()
		URL.revokeObjectURL(url)
	}

	// Add CSS styles for stats dashboard
	addStatsStyles() {
		if (document.getElementById('statsStyles')) return

		const style = document.createElement('style')
		style.id = 'statsStyles'
		style.textContent = `
      #statsOverlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        z-index: 10000;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
        box-sizing: border-box;
      }

      .stats-dashboard {
        background: #1a1a1a;
        color: white;
        border-radius: 15px;
        padding: 20px;
        max-width: 1200px;
        max-height: 90vh;
        width: 100%;
        overflow-y: auto;
        border: 2px solid #333;
      }

      .stats-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        border-bottom: 1px solid #333;
        padding-bottom: 15px;
      }

      .stats-header h1 {
        margin: 0;
        color: #00ff88;
      }

      .close-btn {
        background: #ff4444;
        color: white;
        border: none;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        cursor: pointer;
        font-size: 16px;
      }

      .stats-summary {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 15px;
        margin-bottom: 20px;
        padding: 15px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 10px;
      }

      .summary-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .summary-label {
        color: #ccc;
      }

      .summary-value {
        color: #00ff88;
        font-weight: bold;
        font-size: 1.2em;
      }

      .stats-controls {
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
        flex-wrap: wrap;
      }

      .stats-controls button,
      .stats-controls select {
        background: #333;
        color: white;
        border: 1px solid #555;
        padding: 8px 12px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 12px;
      }

      .stats-controls button:hover {
        background: #444;
      }

      .stats-table-container {
        max-height: 400px;
        overflow-y: auto;
        margin-bottom: 20px;
        border: 1px solid #333;
        border-radius: 5px;
      }

      .stats-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 12px;
      }

      .stats-table th,
      .stats-table td {
        padding: 8px;
        text-align: left;
        border-bottom: 1px solid #333;
      }

      .stats-table th {
        background: #2a2a2a;
        position: sticky;
        top: 0;
        color: #00ff88;
      }

      .stats-table tr:hover {
        background: rgba(255, 255, 255, 0.05);
      }

      .stats-charts {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
      }

      .chart-container {
        background: rgba(255, 255, 255, 0.05);
        padding: 15px;
        border-radius: 10px;
      }

      .chart-container h3 {
        margin: 0 0 15px 0;
        color: #00ff88;
      }

      .chart-bar {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        position: relative;
      }

      .chart-label {
        min-width: 80px;
        font-size: 11px;
        color: #ccc;
      }

      .chart-bar-fill {
        height: 20px;
        background: linear-gradient(45deg, #00ff88, #00cc66);
        margin: 0 10px;
        border-radius: 3px;
        position: relative;
        min-width: 5px;
      }

      .chart-value {
        color: white;
        font-weight: bold;
        font-size: 11px;
      }

      @media (max-width: 768px) {
        .stats-dashboard {
          padding: 15px;
          margin: 10px;
        }

        .stats-summary {
          grid-template-columns: 1fr 1fr;
        }

        .stats-charts {
          grid-template-columns: 1fr;
        }

        .stats-table {
          font-size: 10px;
        }

        .stats-table th,
        .stats-table td {
          padding: 4px;
        }
      }
    `
		document.head.appendChild(style)
	}
}

// Initialize stats dashboard
window.statsDashboard = new StatsDashboard()
