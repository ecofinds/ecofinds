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
                "Authorization": `Bearer k-proj-WdAR4WJkTGaHxlUI6Qglc8QlW4OS6N274LVmjokc7IWpcoQhvS6EsB1L8WkzSfnAm9K0XP4-cLT3BlbkFJU8_9KR3TfLc3qHBVyosLs55UCuW22-ZV4-WKC3QA8kL8H0q0lRCt0my0XHg8E7rLatY1vvmgAA`
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
