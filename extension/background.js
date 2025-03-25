chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url) {
        fetch("http://127.0.0.1:5000/check_url", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ url: tab.url }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("API Response:", data);

                let title = "✅ Safe Website";
                let message = "This site is safe to browse.";

                if (data.phishing) {
                    title = "⚠️ Phishing Alert!";
                    message = "Warning! This site may be a phishing attempt.";
                    
                }
                chrome.notifications.create({
                    type: "basic",
                    iconUrl: icon,
                    title: title,
                    message: message,
                    priority: 2
                });
                chrome.windows.create({
                    url: "popup.html",
                    type: "popup",
                    width: 300,
                    height: 150,
                    left: screen.width - 320,
                    top: 50
                });
            })
            .catch((error) => console.error("Error:", error));
    }
});
