import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";
import { db, doc, getDoc } from "./firebase.js";

let genAI, model;

// Load API key from Firestore and initialize Gemini
async function getApiKey() {
  try {
    const snapshot = await getDoc(doc(db, "apikey", "googlegenai"));
    const apiKey = snapshot.data().key;
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    console.log("✅ Gemini model initialized.");
  } catch (err) {
    console.error("❌ Failed to load API key:", err);
    appendMessage("⚠️ AI not available right now.", "bot");
  }
}

getApiKey(); // Load on page start

// Listen for send button click
document.getElementById("send-btn").addEventListener("click", () => {
  const input = document.getElementById("chat-input");
  const text = input.value.trim().toLowerCase();
  if (!text) return;

  appendMessage(`🧑 You: ${text}`, "user");
  input.value = "";

  // First try to match rules
  if (!ruleChatBot(text)) {
    // If no rule matched, ask AI
    askChatBot(text);
  }
});

// Display message in chat
function appendMessage(message, sender = "bot") {
  const chatHistory = document.getElementById("chat-history");
  const msg = document.createElement("div");
  msg.className = `history ${sender}`;
  msg.textContent = message;
  chatHistory.appendChild(msg);
  chatHistory.scrollTop = chatHistory.scrollHeight;
}

// Command logic
function ruleChatBot(text) {
  if (text.startsWith("add task")) {
    const task = text.replace("add task", "").trim();
    if (task) {
      addTask(task); // assumed function in your app
      appendMessage(`✅ Task "${task}" added.`, "bot");
    } else {
      appendMessage("⚠️ Please specify a task to add.", "bot");
    }
    return true;
  }

  if (text.startsWith("complete")) {
    const task = text.replace("complete", "").trim();
    if (task) {
      if (removeFromTaskName(task)) {
        appendMessage(`✅ Task "${task}" completed.`, "bot");
      } else {
        appendMessage(`⚠️ Task "${task}" not found.`, "bot");
      }
    } else {
      appendMessage("⚠️ Please specify a task to complete.", "bot");
    }
    return true;
  }

  return false;
}

// AI fallback for unknown input
async function askChatBot(prompt) {
  if (!model) {
    appendMessage("⚠️ AI not ready. Try again shortly.", "bot");
    return;
  }

  appendMessage("🤖 Thinking...", "bot");

  try {
    const result = await model.generateContent(prompt);
    const reply = result?.candidates?.[0]?.content?.parts?.[0]?.text || "🤖 I don’t know how to help with that.";
    
    // Replace last "Thinking..." message
    const msgs = document.querySelectorAll(".history.bot");
    if (msgs.length) msgs[msgs.length - 1].textContent = `🤖 AI: ${reply}`;
    else appendMessage(`🤖 AI: ${reply}`, "bot");

    console.log("🟢 AI response:", reply);
  } catch (err) {
    console.error("❌ AI Error:", err);
    appendMessage("⚠️ Error talking to AI.", "bot");
  }
}

// Remove task by name (used in ruleChatBot)
function removeFromTaskName(taskName) {
  const elements = document.getElementsByName(taskName);
  if (elements.length === 0) return false;

  elements.forEach((el) => {
    removeTask(el.id); // assumed function
    removeVisualTask(el.id); // assumed function
  });

  return true;
}
