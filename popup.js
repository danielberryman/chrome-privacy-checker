document.addEventListener("DOMContentLoaded", function () {
    chrome.storage.local.get("privacyCheckResult", function (data) {
        if (data.privacyCheckResult) {
            const message = data.privacyCheckResult;
            const statusElement = document.getElementById("status");
            const detailsElement = document.getElementById("details");

            if (message.status === "violation") {
                statusElement.innerHTML = "❌ GDPR Violation: Tracking before consent!";
                statusElement.style.color = "red";

                detailsElement.innerHTML = `
                    <p><strong>Tracking Cookies Detected:</strong></p>
                    <ul>${message.cookies.map(c => `<li>${c}</li>`).join('')}</ul>
                    <p>Consent Banner Found: ${message.bannerDetected ? "✔️ Yes" : "❌ No"}</p>
                    <p>User Consent Given: ${message.consentGiven ? "✔️ Yes" : "❌ No"}</p>
                `;
            } else {
                statusElement.innerHTML = "✔️ Compliant: No pre-consent tracking.";
                statusElement.style.color = "green";

                detailsElement.innerHTML = `
                    <p>Consent Banner Found: ${message.bannerDetected ? "✔️ Yes" : "❌ No"}</p>
                    <p>User Consent Given: ${message.consentGiven ? "✔️ Yes" : "❌ No"}</p>
                `;
            }
        } else {
            document.getElementById("status").innerHTML = "No scan data available.";
        }
    });
});
