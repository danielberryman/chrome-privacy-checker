console.log("Privacy Check: Scanning for GDPR compliance...");

// Load tracking cookie list
let trackingCookies = [];
fetch(chrome.runtime.getURL("cookie_list.json"))
    .then(response => response.json())
    .then(data => {
        trackingCookies = data.tracking_cookies;
        scanCookies();
    });

function detectConsentBanner() {
    const bannerSelectors = [
        "#onetrust-consent-sdk", ".cookie-banner", "#cookie-notice",
        "[id*=cookie]", "[class*=cookie]"
    ];

    return bannerSelectors.some(selector => document.querySelector(selector));
}

function hasGivenConsent() {
    const consentCookieNames = ["euconsent-v2", "OptanonConsent", "cookie_consent"];
    return document.cookie.split("; ").some(cookie =>
        consentCookieNames.some(name => cookie.startsWith(name + "="))
    );
}

function hasGivenConsentStorage() {
    const consentKeys = ["cookie_consent", "gdpr_consent", "OptanonConsent"];
    return consentKeys.some(key => localStorage.getItem(key) !== null);
}

// Scan for tracking violations
function scanCookies() {
    const cookies = document.cookie.split("; ");
    console.log("Detected Cookies:", cookies);

    const foundTrackingCookies = cookies.filter(cookie =>
        trackingCookies.some(tc => cookie.startsWith(tc + "="))
    );

    const hasConsentBanner = detectConsentBanner();
    const userHasGivenConsent = hasGivenConsent() || hasGivenConsentStorage();

    const scanResult = {
        status: foundTrackingCookies.length > 0 && !userHasGivenConsent ? "violation" : "compliant",
        cookies: foundTrackingCookies,
        bannerDetected: hasConsentBanner,
        consentGiven: userHasGivenConsent
    };

    // Store the results in Chrome local storage
    chrome.storage.local.set({ privacyCheckResult: scanResult });
}
