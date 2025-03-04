async function askChatBot(request) {
    if (!apiKey || !model) {
        appendMessage("⚠️ Error: AI model not initialized. Please wait for API key.");
        console.error("❌ AI Key is missing before chatbot request.");
        return;
    }

    try {
        appendMessage("🤖 Thinking...");

        const response = await model.generateContent({
            contents: [{ parts: [{ text: request }] }]
        });

        if (!response || !response.candidates || response.candidates.length === 0) {
            console.error("❌ AI Model did not return valid text.");
            appendMessage("⚠️ Error: No valid response from AI.");
            return;
        }

        const aiMessage = response.candidates[0].content?.parts?.[0]?.text || "⚠️ No response received.";
        appendMessage(`🤖 AI: ${aiMessage}`);

    } catch (error) {
        console.error("❌ Chatbot error:", error);
        appendMessage("⚠️ Error: Unable to generate response. Check API Key or Network.");
    }
}
