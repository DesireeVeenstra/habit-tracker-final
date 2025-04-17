import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

console.log("✅ AI chatbot script loaded");

// ✅ Your Google AI Studio API key
const apiKey = "AIzaSyDIfIKwkNJKb4Voo26lSNgUr2tOXpAjS5c";
const genAI = new GoogleGenerativeAI(apiKey);

// ✅ Use the correct model for browser/API key usage
const model = genAI.getGenerativeModel({ model: "models/text-bison-001" });

function appendMessage(message, sender = "system") {
    const chatHistory = document.getElementById("chat-history");
    const msg = document.createElement("div");
    msg.className = `history ${sender}`;
    msg.textContent = message;
    chatHistory.appendChild(msg);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

document.getElementById("send-btn").addEventListener("click", () => {
    const input = document.getElementById("chat-input");
    const text = input.value.trim();
    if (!text) return;

    appendMessage(`🧑 You: ${text}`, "user");
    input.value = "";
    askChatBot(text);
});

async function askChatBot(prompt) {
    const thinkingMsg = document.createElement("div");
    thinkingMsg.textContent = "🤖 Thinking...";
    thinkingMsg.className = "thinking";
    document.getElementById("chat-history").appendChild(thinkingMsg);
    document.getElementById("chat-history").scrollTop = document.getElementById("chat-history").scrollHeight;

    try {
        console.log("🟡 Sending to text-bison:", prompt);

        const result = await model.generateContent({
            contents: [{ parts: [{ text: prompt }] }],
        });

        console.log("🟢 API Response:", result);

        thinkingMsg.remove();

        const reply = result?.candidates?.[0]?.content?.parts?.[0]?.text || "🤖 No response.";
        appendMessage(`🤖 AI: ${reply}`, "bot");
    } catch (err) {
        console.error("❌ AI Error:", err);
        thinkingMsg.remove();
        appendMessage("⚠️ Error talking to AI.", "bot");
    }
}
