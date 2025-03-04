import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { db } from "./firebase.js"; 

// Load Google's Gemini AI dynamically
const { GoogleGenerativeAI } = await import("https://esm.sh/@google/generative-ai");

let apiKey;
let model;

// Ensure DOM is fully loaded before accessing elements
document.addEventListener("DOMContentLoaded", async () => {
    console.log("✅ DOM fully loaded, initializing chatbot...");

    // Get references to UI elements
    const chatInput = document.getElementById("chat-input");
    const chatHistory = document.getElementById("chat-history");
    const sendBtn = document.getElementById("send-btn");

    if (!chatInput || !chatHistory || !sendBtn) {
        console.error("❌ Missing Chatbot UI elements. Make sure chatbot-container exists in the HTML.");
        return;
    }

    // Fetch API key from Firestore
    async function getApiKey() {
        try {
            console.log("🔍 Checking Firestore for API key...");
            let snapshot = await getDoc(doc(db, "apikey", "googlegenai"));

            if (!snapshot.exists()) {
                console.error("❌ Firestore Error: API Key document does not exist.");
                appendMessage("Error: Missing API key in Firestore.");
                return;
            }

            apiKey = snapshot.data().key;
            console.log("✅ API Key Retrieved:", apiKey);

            if (!apiKey) {
                console.error("❌ API Key is empty or null.");
                appendMessage("Error: API key is missing in Firestore.");
                return;
            }

            // Initialize Google Gemini AI Model
            const genAI = new GoogleGenerativeAI(apiKey);
            model = genAI.getGenerativeModel({ model: "gemini-pro" });

        } catch (error) {
            console.error("❌ Error fetching API key from Firestore:", error);
            appendMessage("Error: Unable to retrieve API key.");
        }
    }

    // Initialize API Key Retrieval
    await getApiKey();

    // Function to send user message to Gemini AI
    async function askChatBot(request) {
        if (!apiKey || !model) {
            appendMessage("Error: AI model not initialized. Please wait for API key.");
            console.error("❌ API Key is not loaded before chatbot request.");
            return;
        }

        try {
            appendMessage("🤖 Thinking...");

            // Properly formatted request for Gemini API
            const response = await model.generateContent({
                contents: [{ role: "user", parts: [{ text: request }] }]
            });

            // Check if response contains valid text
            if (!response || !response.candidates || response.candidates.length === 0) {
                console.error("❌ AI Model did not return valid text.");
                appendMessage("Error: No valid response from AI.");
                return;
            }

            // Extract AI-generated response
            const aiMessage = response.candidates[0].content.parts[0].text;
            appendMessage(`🤖 AI: ${aiMessage}`);
        } catch (error) {
            console.error("❌ Chatbot error:", error);
            appendMessage("Error: Unable to generate response.");
        }
    }

    // Append messages to chat history
    function appendMessage(message) {
        let history = document.createElement("div");
        history.textContent = message;
        history.className = 'history';
        chatHistory.appendChild(history);
        chatInput.value = "";
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    // **Fix: Ensure Event Listener is Attached**
    sendBtn.addEventListener("click", async () => {
        let userMessage = chatInput.value.trim();
        if (!userMessage) {
            appendMessage("Please enter a message.");
            return;
        }

        appendMessage("You: " + userMessage);
        await askChatBot(userMessage);
    });

    console.log("✅ Chatbot event listeners initialized.");
});
