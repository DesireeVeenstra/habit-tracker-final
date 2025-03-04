import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"; 
import { db } from "./firebase.js";

let apiKey = null;
let model = null;

// ✅ Ensure DOM is ready before running chatbot
document.addEventListener("DOMContentLoaded", async () => {
    console.log("✅ DOM fully loaded, initializing chatbot...");

    // Get references to UI elements
    const chatInput = document.getElementById("chat-input");
    const chatHistory = document.getElementById("chat-history");
    const sendBtn = document.getElementById("send-btn");

    // ✅ Check if chatbot UI elements exist
    if (!chatInput || !chatHistory || !sendBtn) {
        console.error("❌ Missing Chatbot UI elements. Ensure chatbot-container exists in HTML.");
        return;
    }

    // ✅ Fetch API key from Firestore
    async function getApiKey() {
        try {
            console.log("🔍 Checking Firestore for API key...");
            const snapshot = await getDoc(doc(db, "apikey", "googlegenai"));

            if (!snapshot.exists()) {
                console.error("❌ Firestore Error: API Key document does not exist.");
                appendMessage("⚠️ Error: Missing API key in Firestore.");
                return;
            }

            apiKey = snapshot.data().key;
            console.log("✅ API Key Retrieved:", apiKey);

            if (!apiKey || apiKey.trim() === "") {
                console.error("❌ API Key is empty or invalid.");
                appendMessage("⚠️ Error: API key is missing in Firestore.");
                return;
            }

            // ✅ Initialize Google Gemini AI Model
            const { GoogleGenerativeAI } = await import("https://esm.sh/@google/generative-ai");
            const genAI = new GoogleGenerativeAI(apiKey);
            model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


        } catch (error) {
            console.error("❌ Error fetching API key from Firestore:", error);
            appendMessage("⚠️ Error: Unable to retrieve API key.");
        }
    }

    await getApiKey();

    // ✅ Function to send user message to AI
    async function askChatBot(request) {
        if (!apiKey || !model) {
            appendMessage("⚠️ Error: AI model not initialized. Please wait for API key.");
            console.error("❌ AI Key is missing before chatbot request.");
            return;
        }

        try {
            appendMessage("🤖 Thinking...");

            // ✅ Correct API request format
            const response = await model.generateContent({
                contents: [{ role: "user", parts: [{ text: request }] }]
            });

            if (!response || !response.candidates || response.candidates.length === 0) {
                console.error("❌ AI Model did not return valid text.");
                appendMessage("⚠️ Error: No valid response from AI.");
                return;
            }

            // ✅ Extract AI-generated response
            const aiMessage = response.candidates[0].content.parts[0]?.text || "⚠️ AI could not generate a response.";
            appendMessage(`🤖 AI: ${aiMessage}`);
        } catch (error) {
            console.error("❌ Chatbot error:", error);
            appendMessage("⚠️ Error: Unable to generate response. Check API Key or Network.");
        }
    }

    // ✅ Function to append messages to chat history
    function appendMessage(message) {
        let history = document.createElement("div");
        history.textContent = message;
        history.className = 'history';
        chatHistory.appendChild(history);
        chatInput.value = "";
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    // ✅ Ensure send button works
    sendBtn.addEventListener("click", async () => {
        let userMessage = chatInput.value.trim();
        if (!userMessage) {
            appendMessage("⚠️ Please enter a message.");
            return;
        }

        appendMessage("You: " + userMessage);
        await askChatBot(userMessage);
    });

    console.log("✅ Chatbot event listeners initialized.");
});
