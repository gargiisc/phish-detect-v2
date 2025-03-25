document.addEventListener("DOMContentLoaded", function () {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
        let url = tabs[0].url;
        document.getElementById("url-text").textContent = url;

        fetch("http://127.0.0.1:5000/check_url", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: url }),
        })
        .then(response => response.json())
        .then(data => {
            const statusText = document.getElementById("status-text");
            const statusIcon = document.getElementById("status-icon");

            if (data.phishing) {
                statusText.textContent = "⚠️ This site is unsafe!";
                statusText.style.color = "red";
                statusIcon.src = "danger_icon.png";
            } else {
                statusText.textContent = "✅ This site is safe.";
                statusText.style.color = "green";
                statusIcon.src = "safe_icon.png";
            }
        })
        .catch(error => {
            console.error("Error:", error);
            document.getElementById("status-text").textContent = "Error checking site.";
        });
    });
});
