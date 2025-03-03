document.getElementById("open-chatbot").addEventListener("click", async () => {
    const userMessage = prompt("Ask me anything about habit tracking!");
    if (!userMessage) return;

    const response = await fetch("https://api.openai.com/v1/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer YOUR_OPENAI_API_KEY"
        },
        body: JSON.stringify({
            model: "text-davinci-003",
            prompt: `You are a habit tracking assistant. User asks: "${userMessage}"`,
            max_tokens: 50
        })
    });

    const data = await response.json();
    document.getElementById("chatbot-container").textContent = data.choices[0].text;
});
