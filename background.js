import { API_KEY } from "./config.js";

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.action === "extractData") {
        let { productName, price } = message.data;

        if (!productName) return;

        let alternatives = await fetchAlternatives(productName, price);
        
        chrome.storage.local.set({ recommendations: alternatives }, () => {
            console.log("Alternatives saved.");
        });

        chrome.runtime.sendMessage({ action: "showResults", results: alternatives });
    }
});

async function fetchAlternatives(product, price) {
    try {
        let response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [
                    { role: "system", content: "You are a product recommendation assistant." },
                    { role: "user", content: `Find sustainable and minority-owned alternatives for "${product}" under ${price}.` }
                ]
            })
        });

        let data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error("Error fetching alternatives:", error);
        return "Error finding alternatives. Try again!";
    }
}
