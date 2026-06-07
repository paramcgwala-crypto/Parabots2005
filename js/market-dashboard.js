// ===================================
// Forex & Market Hub Dashboard Script
// ===================================

// Global state variables
let activeNewsTab = 'all';
let activeCalendarFilter = 'all';

// Mock News Database
const newsDatabase = [
    { id: 1, category: 'forex', title: 'EUR/USD Rallies Above 1.0900 as ECB Hints at Rate Pause', time: '10 mins ago', snippet: 'ECB members suggested inflation concerns are stabilizing, pushing EUR/USD past key psychological resistance at 1.0900. Tech analysts target 1.0950 next.' },
    { id: 2, category: 'gold', title: 'Gold Spot Hits $2620 as Safe-Haven Inflows Surge Amid Geopolitical Uncertainty', time: '25 mins ago', snippet: 'Strong technical breakout in XAUUSD above $2600. Buyers target resistance at $2650 as traditional hedges see sustained inflows from global asset managers.' },
    { id: 3, category: 'crypto', title: 'Bitcoin Holds $98,000 Support After Liquidating Over $150M in Shorts', time: '40 mins ago', snippet: 'BTC trades consolidation channel as spot ETF inflows remain steady. Derivatives orderflow hints at breakout pressure toward the historical $100,000 level.' },
    { id: 4, category: 'forex', title: 'USD/JPY Plummets to 142.50 as Bank of Japan Signals Hawkish Policy Shift', time: '1 hr ago', snippet: 'BOJ Governor Kazuo Ueda reiterated intentions to normalize rate environments if economic parameters meet forecast curves, sparking sharp yen buying.' },
    { id: 5, category: 'crypto', title: 'Ethereum Gas Fees Hit Multi-Month Lows as L2 Scaling Volume Doubles', time: '2 hrs ago', snippet: 'Dencun upgrade efficiencies shift transactions to Base and Arbitrum network structures. ETH price maintains support near $3,450 base.' },
    { id: 6, category: 'gold', title: 'Gold ETFs Report First Consecutive Inflow Weeks in Q2', time: '3 hrs ago', snippet: 'Institutional asset allocators added over 15 metric tons to gold-backed vaults. Market indicators show strong accumulation phases in spot contracts.' },
    { id: 7, category: 'forex', title: 'GBP/USD Steadies Near 1.2750 Ahead of Bank of England Inflation Testimony', time: '4 hrs ago', snippet: 'BOE policy managers present testimony to parliament. Traders price in 78% probability of rate hold, keeping GBP supported above short-term MA lines.' }
];

// Mock Economic Calendar Database
const calendarDatabase = [
    { time: '08:30', currency: 'EUR', impact: 'medium', event: 'French Flash Services PMI', previous: '48.2', forecast: '48.9', actual: '49.1' },
    { time: '09:00', currency: 'EUR', impact: 'high', event: 'German Flash Manufacturing PMI', previous: '42.5', forecast: '43.1', actual: '42.9' },
    { time: '13:30', currency: 'USD', impact: 'high', event: 'Core Durable Goods Orders m/m', previous: '0.2%', forecast: '0.1%', actual: '0.3%' },
    { time: '15:00', currency: 'USD', impact: 'high', event: 'CB Consumer Confidence', previous: '104.0', forecast: '105.5', actual: '106.2' },
    { time: '15:30', currency: 'USD', impact: 'medium', event: 'Crude Oil Inventories', previous: '-1.2M', forecast: '0.8M', actual: '1.9M' },
    { time: '23:50', currency: 'JPY', impact: 'low', event: 'SPPI y/y', previous: '2.1%', forecast: '2.0%', actual: '2.1%' }
];

// Initial Trading Signals
const activeSignals = [
    { id: 1, pair: 'XAUUSD', type: 'buy', entry: '2615.50', tp: '2635.00', sl: '2603.00', status: 'active', time: '15m ago' },
    { id: 2, pair: 'EURUSD', type: 'buy', entry: '1.0880', tp: '1.0940', sl: '1.0845', status: 'completed', time: '1h ago' },
    { id: 3, pair: 'GBPUSD', type: 'sell', entry: '1.2780', tp: '1.2690', sl: '1.2825', status: 'active', time: '2h ago' },
    { id: 4, pair: 'USDJPY', type: 'sell', entry: '143.20', tp: '141.50', sl: '144.10', status: 'stopped', time: '4h ago' }
];

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Hide default page loading screen
    const mainPreloader = document.getElementById('loadingScreen');
    if (mainPreloader) {
        setTimeout(() => {
            mainPreloader.classList.add('hidden');
        }, 500);
    }
    
    // Start live UTC clocks
    initClock();
    
    // Start dynamic widgets
    updateSessions();
    setInterval(updateSessions, 60000); // Check sessions every minute
    
    initCurrencyStrength();
    setInterval(updateCurrencyStrength, 8000); // Shift strength every 8 seconds
    
    initMarketSentiment();
    
    renderNews();
    renderCalendar();
    renderSignals();
});

// 1. Clock Updates
function initClock() {
    const timerElement = document.getElementById('marketTimer');
    function updateClock() {
        const now = new Date();
        const utcStr = now.toISOString().substring(11, 19) + ' UTC';
        if (timerElement) {
            timerElement.textContent = utcStr;
        }
    }
    updateClock();
    setInterval(updateClock, 1000);
}

// 2. Active Session Tracker (based on UTC hours)
function updateSessions() {
    const now = new Date();
    const utcHour = now.getUTCHours();
    
    // Define trading hours in UTC:
    // Sydney: 22:00 - 07:00
    // Tokyo: 00:00 - 09:00
    // London: 08:00 - 17:00
    // New York: 13:00 - 22:00
    
    const sessions = {
        sydney: (utcHour >= 22 || utcHour < 7),
        tokyo: (utcHour >= 0 && utcHour < 9),
        london: (utcHour >= 8 && utcHour < 17),
        newyork: (utcHour >= 13 && utcHour < 22)
    };
    
    Object.keys(sessions).forEach(key => {
        const row = document.getElementById(`session-${key}`);
        if (row) {
            const indicator = row.querySelector('.session-indicator');
            if (sessions[key]) {
                indicator.className = 'session-indicator active';
                row.style.borderColor = 'rgba(0, 245, 212, 0.2)';
            } else {
                indicator.className = 'session-indicator';
                row.style.borderColor = 'rgba(255, 255, 255, 0.05)';
            }
        }
    });
}

// 3. Currency Strength Meter
const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'];
let strengths = { USD: 7.2, EUR: 5.8, GBP: 6.4, JPY: 3.1, CAD: 4.5, AUD: 5.1 };

function initCurrencyStrength() {
    renderCurrencyStrength();
}

function updateCurrencyStrength() {
    // Introduce random minor volatility variations (-0.3 to +0.3)
    currencies.forEach(cur => {
        let delta = (Math.random() * 0.6 - 0.3);
        strengths[cur] = Math.max(1, Math.min(10, strengths[cur] + delta));
    });
    renderCurrencyStrength();
}

function renderCurrencyStrength() {
    const container = document.getElementById('strengthMeterList');
    if (!container) return;
    
    // Sort by strength descending
    const sorted = Object.entries(strengths).sort((a, b) => b[1] - a[1]);
    
    container.innerHTML = sorted.map(([cur, val]) => {
        const percentage = val * 10;
        return `
            <div class="strength-row">
                <div class="currency-label">${cur}</div>
                <div class="strength-bar-container">
                    <div class="strength-bar" style="width: ${percentage}%; background:${cur === 'USD' ? 'linear-gradient(135deg, #00F5D4, #00BBF9)' : 'var(--gradient-2)'};"></div>
                </div>
                <div class="strength-value">${val.toFixed(1)}</div>
            </div>
        `;
    }).join('');
}

// 4. Market Sentiment Ratios
const sentiments = [
    { pair: 'EURUSD', long: 62 },
    { pair: 'GBPUSD', long: 48 },
    { pair: 'USDJPY', long: 38 },
    { pair: 'XAUUSD', long: 71 },
    { pair: 'BTCUSD', long: 84 }
];

function initMarketSentiment() {
    const container = document.getElementById('sentimentContainer');
    if (!container) return;
    
    container.innerHTML = sentiments.map(s => {
        const short = 100 - s.long;
        return `
            <div class="sentiment-gauge-wrapper">
                <div class="d-flex justify-content-between" style="font-size:12px; font-weight:600; margin-bottom:4px;">
                    <span>${s.pair}</span>
                    <span style="color:var(--primary);">${s.long}% Long</span>
                </div>
                <div class="sentiment-ratio-bar">
                    <div class="sentiment-long-fill" style="width: ${s.long}%"></div>
                </div>
                <div class="sentiment-bar-labels">
                    <span style="color:var(--primary); font-size:10px;">Buy: ${s.long}%</span>
                    <span style="color:#ff4757; font-size:10px;">Sell: ${short}%</span>
                </div>
            </div>
        `;
    }).join('');
}

// 5. Render News Center
function renderNews() {
    const container = document.getElementById('newsFeedContainer');
    if (!container) return;
    
    const filteredNews = activeNewsTab === 'all' 
        ? newsDatabase 
        : newsDatabase.filter(item => item.category === activeNewsTab);
        
    container.innerHTML = filteredNews.map(item => `
        <div class="news-item">
            <div class="news-meta">
                <span style="text-transform:uppercase;">${item.category}</span>
                <span class="news-time">${item.time}</span>
            </div>
            <div class="news-title" onclick="toggleNewsSnippet(${item.id})">${item.title}</div>
            <div class="news-snippet" id="snippet-${item.id}">${item.snippet}</div>
        </div>
    `).join('');
}

function switchNewsTab(tab) {
    activeNewsTab = tab;
    // Set active class on buttons
    const buttons = document.querySelectorAll('#newsTabs .news-tab-btn');
    buttons.forEach(btn => {
        if(btn.textContent.toLowerCase() === tab.toLowerCase() || (tab === 'all' && btn.textContent === 'All')) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    renderNews();
}

function toggleNewsSnippet(id) {
    const element = document.getElementById(`snippet-${id}`);
    if (element) {
        if (element.style.display === 'block') {
            element.style.display = 'none';
        } else {
            // Close other snippets first
            document.querySelectorAll('.news-snippet').forEach(el => el.style.display = 'none');
            element.style.display = 'block';
        }
    }
}

// 6. Interactive Economic Calendar
function renderCalendar() {
    const container = document.getElementById('economicCalendarBody');
    if (!container) return;
    
    const filtered = activeCalendarFilter === 'all'
        ? calendarDatabase
        : calendarDatabase.filter(item => item.impact === activeCalendarFilter);
        
    if (filtered.length === 0) {
        container.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">No high impact events scheduled.</td></tr>`;
        return;
    }
    
    container.innerHTML = filtered.map(item => `
        <tr>
            <td><strong>${item.time}</strong></td>
            <td><strong>${item.currency}</strong></td>
            <td>
                <span class="impact-badge impact-${item.impact}">${item.impact}</span>
            </td>
            <td style="color:var(--text); font-weight:500;">${item.event}</td>
            <td class="text-end text-muted">${item.previous || '-'}</td>
            <td class="text-end text-muted">${item.forecast || '-'}</td>
            <td class="text-end" style="color:${parseFloat(item.actual) >= parseFloat(item.forecast) ? 'var(--primary)' : '#ff4757'}; font-weight:700;">
                ${item.actual || '-'}
            </td>
        </tr>
    `).join('');
}

function filterCalendar(impact) {
    activeCalendarFilter = impact;
    
    // Toggle active state in buttons
    const btnAll = document.getElementById('filter-all');
    const btnHigh = document.getElementById('filter-high');
    const btnMed = document.getElementById('filter-medium');
    
    if (btnAll) btnAll.classList.remove('active');
    if (btnHigh) btnHigh.classList.remove('active');
    if (btnMed) btnMed.classList.remove('active');
    
    const activeBtn = document.getElementById(`filter-${impact}`);
    if (activeBtn) activeBtn.classList.add('active');
    
    renderCalendar();
}

// 7. Trading Signals list
function renderSignals() {
    const container = document.getElementById('signalsGrid');
    if (!container) return;
    
    container.innerHTML = activeSignals.map(sig => `
        <div class="col-md-6 mb-3">
            <div class="signal-item ${sig.type}">
                <div class="signal-header">
                    <span class="signal-pair">${sig.pair}</span>
                    <span class="signal-type ${sig.type}">${sig.type.toUpperCase()}</span>
                </div>
                <div style="font-size:12px; margin-top:5px; font-weight:600;">
                    Entry Price: <span style="color:var(--text);">${sig.entry}</span>
                </div>
                <div class="signal-levels">
                    <div>TP: <span class="text-success">${sig.tp}</span></div>
                    <div>SL: <span class="text-danger">${sig.sl}</span></div>
                    <div>
                        <span class="signal-status-badge ${sig.status}">${sig.status}</span>
                    </div>
                </div>
                <div style="font-size:10px; color:var(--muted-text); margin-top:8px; display:flex; justify-content:space-between;">
                    <span>Calculated ${sig.time}</span>
                    <span>System AI Match: 94%</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Add a live generated random signal on click request
function generateRandomSignal() {
    const pairs = ['XAUUSD', 'EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD'];
    const types = ['buy', 'sell'];
    
    const randomPair = pairs[Math.floor(Math.random() * pairs.length)];
    const randomType = types[Math.floor(Math.random() * types.length)];
    
    let entry = 0, tp = 0, sl = 0;
    
    if (randomPair === 'XAUUSD') {
        entry = (2550 + Math.random() * 100).toFixed(2);
        tp = (parseFloat(entry) + (randomType === 'buy' ? 20 : -20)).toFixed(2);
        sl = (parseFloat(entry) + (randomType === 'buy' ? -15 : 15)).toFixed(2);
    } else if (randomPair === 'USDJPY') {
        entry = (140 + Math.random() * 5).toFixed(2);
        tp = (parseFloat(entry) + (randomType === 'buy' ? 1.5 : -1.5)).toFixed(2);
        sl = (parseFloat(entry) + (randomType === 'buy' ? -1.0 : 1.0)).toFixed(2);
    } else {
        entry = (1.05 + Math.random() * 0.2).toFixed(4);
        tp = (parseFloat(entry) + (randomType === 'buy' ? 0.0080 : -0.0080)).toFixed(4);
        sl = (parseFloat(entry) + (randomType === 'buy' ? -0.0050 : 0.0050)).toFixed(4);
    }
    
    const newSig = {
        id: Date.now(),
        pair: randomPair,
        type: randomType,
        entry: entry,
        tp: tp,
        sl: sl,
        status: 'active',
        time: 'Just now'
    };
    
    // Add to front of active list
    activeSignals.unshift(newSig);
    if (activeSignals.length > 6) activeSignals.pop(); // Keep max 6 signals
    
    renderSignals();
}

// 8. Calculators Mathematics
function calculateRisk() {
    const balance = parseFloat(document.getElementById('riskBalance').value);
    const riskPercent = parseFloat(document.getElementById('riskPercent').value);
    const stopLoss = parseFloat(document.getElementById('riskStopLoss').value);
    const resultBox = document.getElementById('riskResult');
    
    if (!balance || !riskPercent || !stopLoss) {
        alert('Please fill all calculator inputs.');
        return;
    }
    
    const riskAmount = balance * (riskPercent / 100);
    // standard positions sizing estimation: 1 standard lot = $10 per pip on 100k contract for major pairs
    // Position Size (lots) = Risk Amount / (Stop Loss in pips * 10)
    const positionSize = riskAmount / (stopLoss * 10);
    
    resultBox.style.display = 'block';
    resultBox.innerHTML = `
        <div class="d-flex justify-content-between mb-1">
            <span>Capital at Risk:</span>
            <strong class="text-danger">$${riskAmount.toFixed(2)}</strong>
        </div>
        <div class="d-flex justify-content-between">
            <span>Recommended Lots:</span>
            <strong class="text-success">${positionSize.toFixed(2)} Lots</strong>
        </div>
    `;
}

function calculatePosition() {
    const risk = parseFloat(document.getElementById('posRisk').value);
    const entry = parseFloat(document.getElementById('posEntry').value);
    const stop = parseFloat(document.getElementById('posStop').value);
    const resultBox = document.getElementById('posResult');
    
    if (!risk || !entry || !stop) {
        alert('Please fill all calculator inputs.');
        return;
    }
    
    // Pip size calculations (based on normal 4 decimal pricing except for JPY or Gold)
    const priceDiff = Math.abs(entry - stop);
    let pipDifference = priceDiff * 10000;
    
    // If Gold or JPY
    if (entry > 50) {
        pipDifference = priceDiff * 100;
    }
    
    const lots = risk / (pipDifference * 10);
    
    resultBox.style.display = 'block';
    resultBox.innerHTML = `
        <div class="d-flex justify-content-between mb-1">
            <span>Pip Stop Loss:</span>
            <strong>${pipDifference.toFixed(1)} Pips</strong>
        </div>
        <div class="d-flex justify-content-between">
            <span>Lot Sizing:</span>
            <strong class="text-success">${lots.toFixed(2)} Lots</strong>
        </div>
    `;
}

// 9. Quick scrolling navigation
function scrollToSection(id) {
    const section = document.getElementById(id);
    if (section) {
        // Remove active class from all buttons
        document.querySelectorAll('#hubNavigation button').forEach(btn => btn.classList.remove('active'));
        
        // Find which button triggered and add active class
        const targetBtn = Array.from(document.querySelectorAll('#hubNavigation button'))
            .find(btn => btn.getAttribute('onclick').includes(id));
        if (targetBtn) targetBtn.classList.add('active');
        
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}
