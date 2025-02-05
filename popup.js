document.addEventListener("DOMContentLoaded", function () {
    chrome.storage.local.get("recommendations", (data) => {
        if (chrome.runtime.lastError) {
            console.error("Error accessing Chrome storage:", chrome.runtime.lastError);
            return;
        } // error logic uwu

        console.log("Popup fetched recommendations:", data);
        let resultsContainer = document.getElementById("results");

        if (data.recommendations) {
            resultsContainer.innerText = data.recommendations;
        } else {
            resultsContainer.innerText = "No recommendations found.";
        }
    });
});
