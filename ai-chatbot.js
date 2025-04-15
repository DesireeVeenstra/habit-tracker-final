import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

const apiKey = "AIzaSyDIfIKwkNJKb4Voo26lSNgUr2tOXpAjS5c";
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

function appendMessage(message) {
    const chatHistory = document.getElementById("chat-history");
    const msg = document.createElement("div");
    msg.classList.add("history");
    msg.textContent = message;
    chatHistory.appendChild(msg);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

document.getElementById("send-btn").addEventListener("click", () => {
    const input = document.getElementById("chat-input");
    const message = input.value.trim();
    if (message !== "") {
        appendMessage(`🧑 You: ${message}`);
        askChatBot(message);
        input.value = "";
    }
});
