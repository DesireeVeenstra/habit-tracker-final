
import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

const apiKey = "AIzaSyDIfIKwkNJKb4Voo26lSNgUr2tOXpAjS5c";
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

function appendMessage(message) {
    const chatHistory = document.getElementById("chat-history");
    const msg = document.createElement("div");
    msg.className = "history";
    msg.textContent = message;
    chatHistory.appendChild(msg);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

document.getElementById("send-btn").addEventListener("click", () => {
    const input = document.getElementById("chat-input");
    const text = input.value.trim();
    if (!text) return;

    appendMessage(`🧑 You: ${text}`);
    askChatBot(text);
    input.value = "";
});

async function askChatBot(request) {
    try {
        appendMessage("🤖 Thinking...");
        const result = await model.generateContent({
            contents: [{ parts: [{ text: request }] }],
        });
        const reply = result?.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
        appendMessage(`🤖 AI: ${reply}`);
    } catch (err) {
        console.error("AI Error:", err);
        appendMessage("⚠️ Error talking to AI.");
    }
}
