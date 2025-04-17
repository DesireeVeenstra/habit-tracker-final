import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

// ✅ Your Gemini or PaLM API Key (from Google AI Studio)
const apiKey = "AIzaSyDIfIKwkNJKb4Voo26lSNgUr2tOXpAjS5c";
const genAI = new GoogleGenerativeAI(apiKey);

// ✅ Use a model that works in browser environment
const model = genAI.getGenerativeModel({ model: "models/chat-bison-001" });

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

async function askChatBot(request) {
    const thinkingMsg = document.createElement("div");
    thinkingMsg.textContent = "🤖 Thinking...";
    thinkingMsg.className = "thinking";
    document.getElementById("chat-history").appendChild(thinkingMsg);
    document.getElementById("chat-history").scrollTop = document.getElementById("chat-history").scrollHeight;

    try {
        console.log("🟡 Sending request to Gemini:", request);
        const result = await model.generateContent({
            contents: [{ parts: [{ text: request }] }],
        });

        console.log("🟢 Gemini response:", result);

        thinkingMsg.remove();
        const reply = result?.candidates?.[0]?.content?.parts?.[0]?.text || "🤖 No response.";
        appendMessage(`🤖 AI: ${reply}`, "bot");
    } catch (err) {
        console.error("❌ AI Error:", err);
        thinkingMsg.remove();
        appendMessage("⚠️ Error talking to AI.", "bot");
    }
}
