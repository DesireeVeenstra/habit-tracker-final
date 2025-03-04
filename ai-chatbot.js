import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { db } from "./firebase.js"; 

let apiKey;
let modelUrl = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1";

// Get references to UI elements
const chatInput = document.getElementById("chat-input");
const chatHistory = document.getElementById("chat-history");
const sendBtn = document.getElementById("send-btn");

// Fetch API key from Firestore
async function getApiKey() {
    try {
        console.log("🔍 Checking Firestore for API key...");
        let snapshot = await getDoc(doc(db, "apikey", "huggingface"));

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
        }
    } catch (error) {
        console.error("❌ Error fetching API key from Firestore:", error);
        appendMessage("Error: Unable to retrieve API key.");
    }
}

// Initialize API Key Retrieval
getApiKey();

// Function to send user message to Hugging Face AI API
async function askChatBot(request) {
    if (!apiKey) {
        appendMessage("Error: AI model not initialized. Please wait for API key.");
        console.error("❌ API Key is not loaded before chatbot request.");
        return;
    }

    try {
        appendMessage("🤖 Thinking...");

        const response = await fetch(modelUrl, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                inputs: request,
                options: { wait_for_model: true }
            })
        });

        if (!response.ok) {
            let errorText = await response.text();
            console.error(`❌ API error: ${response.status} - ${response.statusText}\n${errorText}`);
            appendMessage(`Error: AI response failed (Status ${response.status})`);
            return;
        }

        const data = await response.json();

        if (!data || !data.generated_text) {
            console.error("❌ AI Model did not return valid text.");
            appendMessage("Error: No valid response from AI.");
            return;
        }

        appendMessage(`🤖 AI: ${data.generated_text}`);
    } catch (error) {
        console.error("❌ Chatbot error:", error);

        if (error.message.includes("Failed to fetch")) {
            appendMessage("Error: Network issue or API blocked.");
        } else {
            appendMessage("Error: Unable to generate response.");
        }
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

// Event listener for chatbot interactions
sendBtn.addEventListener("click", async () => {
    let userMessage = chatInput.value.trim().toLowerCase();
    if (!userMessage) {
        appendMessage("Please enter a message.");
        return;
    }

    appendMessage("You: " + userMessage);
    await askChatBot(userMessage);
});
