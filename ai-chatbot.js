import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

// ✅ Your Gemini API Key (from Google AI Studio)
const apiKey = "AIzaSyDIfIKwkNJKb4Voo26lSNgUr2tOXpAjS5c";
const genAI = new GoogleGenerativeAI(apiKey);

// ✅ Use the working Gemini model name
const model = genAI.getGenerativeModel({ model: "models/gemini-pro" });

// ✅ Add message to chat history
function appendMessage(message, sender = "system") {
    const chatHistory = document.getElementById("chat-history");
    const msg = document.createElement("div");
    msg.className = `history ${sender}`;
    msg.textContent = message;
    chatHistory.appendChild(msg);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

// ✅ Handle send button click
document.getElementById("send-btn").addEventListener("click", () => {
    const input = document.getElementById("chat-input");
    const text = input.value.trim();
    if (!text) return;

    appendMessage(`🧑 You: ${text}`, "user");
    input.value = "";
    askChatBot(text);
});

// ✅ AI chatbot interaction using generateContentStream()
async function askChatBot(prompt) {
    const thinkingMsg = document.createElement("div");
    thinkingMsg.textContent = "🤖 Thinking...";
    thinkingMsg.className = "thinking";
    document.getElementById("chat-history").appendChild(thinkingMsg);
    document.getElementById("chat-history").scrollTop = document.getElementById("chat-history").scrollHeight;

    try {
        console.log("🟡 Sending to Gemini:", prompt);

        const result = await model.generateContentStream(prompt);
        thinkingMsg.remove();

        let replyText = "";

        for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
                replyText += text;
                // Update the last bot message live
                const botMsgs = document.querySelectorAll(".history.bot");
                if (botMsgs.length > 0) {
                    botMsgs[botMsgs.length - 1].textContent = `🤖 AI: ${replyText}`;
                } else {
                    appendMessage(`🤖 AI: ${replyText}`, "bot");
                }
            }
        }

        console.log("🟢 AI Final Reply:", replyText);

    } catch (err) {
        console.error("❌ AI Error:", err);
        thinkingMsg.remove();
        appendMessage("⚠️ Error talking to AI.", "bot");
    }
}
