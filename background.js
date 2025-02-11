import { API_KEY } from "./src/config.js";

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
                "Authorization": `Bearer ${process.env.KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [
                    { role: "system", content: "You are a product recommendation assistant that advises comparably cheap, eco friendly, and minority supporting goods." },
                    { role: "user", content: `Find 5 different sustainable and minority-owned alternatives for "${product}" under ${price}. Include product name, price, 1 sentence description, eco friendly rating out of 5, and minority supporting rating out of 5.` }
                    { role: "assistant", content: "1. Eco Boots. Boots made from recycled plastic bottles. Eco-Friendly Rating: 5/5. Minority support rating: 1/5. 1. Eco Boots. Boots made from recycled plastic bottles. Eco-Friendly Rating: 5/5. Minority support rating: 1/5. 2. Eco Boots. Boots made from recycled plastic bottles. Eco-Friendly Rating: 5/5. Minority support rating: 1/5. 3. Eco Boots. Boots made from recycled plastic bottles. Eco-Friendly Rating: 5/5. Minority support rating: 1/5. 4. Eco Boots. Boots made from recycled plastic bottles. Eco-Friendly Rating: 5/5. Minority support rating: 1/5. 5. Eco Boots. Boots made from recycled plastic bottles. Eco-Friendly Rating: 5/5. Minority support rating: 1/5."}
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
