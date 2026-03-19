// Browser information collection functions

function getUserAgent() {
    return navigator.userAgent;
}

function getScreenSize() {
    return {
        width: screen.width,
        height: screen.height
    };
}

function getBrowserLanguage() {
    return navigator.language || navigator.userLanguage;
}

async function detectIncognito() {
    // Try to detect incognito mode using various heuristics
    // This is not foolproof but covers common cases

    // Check for headless browser
    if (navigator.webdriver) {
        return true;
    }

    // Try using storage quota (may be limited in incognito)
    try {
        if ('storage' in navigator && 'estimate' in navigator.storage) {
            const estimate = await navigator.storage.estimate();
            // In incognito, quota might be lower
            if (estimate.quota < 100000000) { // Less than ~100MB
                return true;
            }
        }
    } catch (e) {
        // Error accessing storage estimate
    }

    // Try localStorage (works in incognito but data doesn't persist)
    // This won't reliably detect incognito
    try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
    } catch (e) {
        return true; // Storage blocked
    }

    return false; // Assume not incognito
}

function detectMobile() {
    const userAgent = getUserAgent().toLowerCase();
    const screenSize = getScreenSize();

    // Check user agent for mobile keywords
    const mobileKeywords = ['mobile', 'android', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];
    const hasMobileKeyword = mobileKeywords.some(keyword => userAgent.includes(keyword));

    // Check screen width (typical mobile breakpoint)
    const isSmallScreen = screenSize.width < 768;

    return hasMobileKeyword || isSmallScreen;
}

function getBrowserVersion() {
    const userAgent = getUserAgent();
    let browser = 'Unknown';
    let version = 'Unknown';

    // Chrome
    const chromeMatch = userAgent.match(/Chrome\/(\d+)/);
    if (chromeMatch) {
        browser = 'Chrome';
        version = chromeMatch[1];
    }

    // Firefox
    const firefoxMatch = userAgent.match(/Firefox\/(\d+)/);
    if (firefoxMatch) {
        browser = 'Firefox';
        version = firefoxMatch[1];
    }

    // Safari
    const safariMatch = userAgent.match(/Version\/(\d+).*Safari/);
    if (safariMatch && !chromeMatch) {
        browser = 'Safari';
        version = safariMatch[1];
    }

    // Edge
    const edgeMatch = userAgent.match(/Edg\/(\d+)/);
    if (edgeMatch) {
        browser = 'Edge';
        version = edgeMatch[1];
    }

    return `${browser} ${version}`;
}

// Bot probability calculation

const BOT_WEIGHTS = {
    headlessBrowser: 30,      // navigator.webdriver
    unusualScreenSize: 15,    // Very small/large screens
    incognitoMode: 20,        // Incognito/private browsing
    unusualLanguage: 10,      // Less common languages
    mobileMismatch: 10,       // User agent mobile but screen large
    oldBrowser: 5,            // Very old browser versions
    highVisitCount: 10        // Many visits in session
};

function calculateBotProbability(browserData) {
    let totalScore = 0;
    const factors = [];
    const maxScore = Object.values(BOT_WEIGHTS).reduce((a, b) => a + b, 0);

    // Headless browser detection
    if (navigator.webdriver) {
        totalScore += BOT_WEIGHTS.headlessBrowser;
        factors.push({ name: 'Headless Browser', score: BOT_WEIGHTS.headlessBrowser, level: 'high' });
    } else {
        factors.push({ name: 'Headless Browser', score: 0, level: 'low' });
    }

    // Unusual screen size
    const screenSize = browserData.screenSize;
    let screenScore = 0;
    if (screenSize.width < 800 || screenSize.height < 600) {
        screenScore = BOT_WEIGHTS.unusualScreenSize;
    } else if (screenSize.width > 3840 || screenSize.height > 2160) {
        screenScore = BOT_WEIGHTS.unusualScreenSize * 0.5; // Less suspicious for very large screens
    }
    totalScore += screenScore;
    factors.push({
        name: 'Unusual Screen Size',
        score: screenScore,
        level: screenScore > 0 ? 'medium' : 'low'
    });

    // Incognito mode
    if (browserData.incognito) {
        totalScore += BOT_WEIGHTS.incognitoMode;
        factors.push({ name: 'Incognito Mode', score: BOT_WEIGHTS.incognitoMode, level: 'high' });
    } else {
        factors.push({ name: 'Incognito Mode', score: 0, level: 'low' });
    }

    // Unusual language (less common languages might indicate bot)
    const commonLanguages = ['en', 'es', 'fr', 'de', 'zh', 'ja', 'pt', 'ru', 'ar', 'hi'];
    const language = browserData.language.split('-')[0]; // Get primary language
    let languageScore = 0;
    if (!commonLanguages.includes(language)) {
        languageScore = BOT_WEIGHTS.unusualLanguage;
    }
    totalScore += languageScore;
    factors.push({
        name: 'Unusual Language',
        score: languageScore,
        level: languageScore > 0 ? 'medium' : 'low'
    });

    // Mobile mismatch
    const isMobileUA = /mobile|android|iphone|ipad|ipod|blackberry|windows phone/i.test(browserData.userAgent);
    const isSmallScreen = screenSize.width < 768;
    let mobileScore = 0;
    if (isMobileUA !== isSmallScreen) {
        mobileScore = BOT_WEIGHTS.mobileMismatch;
    }
    totalScore += mobileScore;
    factors.push({
        name: 'Mobile Mismatch',
        score: mobileScore,
        level: mobileScore > 0 ? 'medium' : 'low'
    });

    // Old browser version (very old browsers might be bots)
    const versionMatch = browserData.browserVersion.match(/\d+/);
    const version = versionMatch ? parseInt(versionMatch[0]) : 0;
    let versionScore = 0;
    if (version < 50) { // Arbitrary threshold
        versionScore = BOT_WEIGHTS.oldBrowser;
    }
    totalScore += versionScore;
    factors.push({
        name: 'Old Browser',
        score: versionScore,
        level: versionScore > 0 ? 'medium' : 'low'
    });

    // High visit count
    let visitScore = 0;
    if (browserData.visitCount > 10) {
        visitScore = BOT_WEIGHTS.highVisitCount;
    } else if (browserData.visitCount > 5) {
        visitScore = BOT_WEIGHTS.highVisitCount * 0.5;
    }
    totalScore += visitScore;
    factors.push({
        name: 'High Visit Count',
        score: visitScore,
        level: visitScore > BOT_WEIGHTS.highVisitCount * 0.5 ? 'medium' : 'low'
    });

    // Calculate percentage (0-100)
    const percentage = Math.min(100, Math.round((totalScore / maxScore) * 100));

    return {
        score: totalScore,
        maxScore: maxScore,
        percentage: percentage,
        factors: factors,
        riskLevel: percentage >= 70 ? 'high' : percentage >= 40 ? 'medium' : 'low'
    };
}

// Main application logic
async function initializeApp() {
    try {
        // Collect browser data
        const browserData = {
            userAgent: getUserAgent(),
            screenSize: getScreenSize(),
            language: getBrowserLanguage(),
            incognito: await detectIncognito(),
            isMobile: detectMobile(),
            browserVersion: getBrowserVersion()
        };

        // Fetch server data
        const serverResponse = await fetch('/api/info');
        const serverData = await serverResponse.json();

        // Combine data
        const fullData = {
            ...browserData,
            ip: serverData.ip,
            visitCount: serverData.visitCount
        };

        // Calculate bot probability
        const analysis = calculateBotProbability(fullData);

        // Display data
        displayBrowserInfo(fullData);
        displayBotAnalysis(analysis);

    } catch (error) {
        console.error('Error initializing app:', error);
        // Fallback display
        document.getElementById('user-agent').textContent = 'Error loading data';
    }
}

function displayBrowserInfo(data) {
    document.getElementById('user-agent').textContent = data.userAgent;
    document.getElementById('screen-size').textContent = `${data.screenSize.width} x ${data.screenSize.height}`;
    document.getElementById('browser-language').textContent = data.language;
    document.getElementById('incognito-mode').textContent = data.incognito ? 'Yes' : 'No';
    document.getElementById('ip-address').textContent = data.ip;
    document.getElementById('device-type').textContent = data.isMobile ? 'Mobile' : 'Desktop';
    document.getElementById('browser-version').textContent = data.browserVersion;
    document.getElementById('visit-count').textContent = data.visitCount;
}

function displayBotAnalysis(analysis) {
    // Update probability bar
    const probabilityBar = document.getElementById('probability-bar');
    const probabilityText = document.getElementById('probability-text');

    probabilityBar.style.width = `${analysis.percentage}%`;
    probabilityText.textContent = `${analysis.percentage}% Bot Probability`;

    // Update bar color based on risk level
    if (analysis.riskLevel === 'high') {
        probabilityBar.style.background = 'linear-gradient(90deg, #e74c3c 0%, #c0392b 100%)';
    } else if (analysis.riskLevel === 'medium') {
        probabilityBar.style.background = 'linear-gradient(90deg, #f39c12 0%, #e67e22 100%)';
    } else {
        probabilityBar.style.background = 'linear-gradient(90deg, #27ae60 0%, #229954 100%)';
    }

    // Display factors
    const factorsList = document.getElementById('factors-list');
    factorsList.innerHTML = '';

    analysis.factors.forEach(factor => {
        const factorElement = document.createElement('div');
        factorElement.className = `factor-item ${factor.level}`;
        factorElement.innerHTML = `
            <span>${factor.name}</span>
            <span>+${factor.score} points</span>
        `;
        factorsList.appendChild(factorElement);
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Export functions for testing
window.browserInfo = {
    getUserAgent,
    getScreenSize,
    getBrowserLanguage,
    detectIncognito,
    detectMobile,
    getBrowserVersion,
    calculateBotProbability,
    BOT_WEIGHTS
};