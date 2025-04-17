import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";
import { db, doc, getDoc } from "./firebase.js"; // ✅ make sure firebase.js exports getDoc

let genAI, model;

// 🔑 Load the API key from Firestore on page load
async function getApiKey() {
  try {
    const snapshot = await getDoc(doc(db, "apikey", "googlegenai"));
    const apiKey = snapshot.data().key;

    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    console.log("✅ Gemini model initialized");
  } catch (err) {
    console.error("❌ Failed to load API key:", err);
    appendMessage("⚠️ AI not available right now.", "bot");
  }
}

getApiKey(); // Load API key at startup

// 🧠 Rule-based chatbot logic
function ruleChatBot(text) {
  if (text.startsWith("add task")) {
    const task = text.replace("add task", "").trim();
    if (task) {
      window.addTask(task); // function provided by script.js
      appendMessage(`✅ Task "${task}" added.`, "bot");
    } else {
      appendMessage("⚠️ Please specify a task to add.", "bot");
    }
    return true;
  }

  if (text.startsWith("complete")) {
    const task = text.replace("complete", "").trim();
    if (task) {
      // Find and remove by name
      window.findHabitByName(task).then((id) => {
        if (id) {
          window.removeTask(id);
          window.removeVisualTask(id);
          appendMessage(`✅ Task "${task}" completed.`, "bot");
        } else {
          appendMessage(`⚠️ Task "${task}" not found.`, "bot");
        }
      });
    } else {
      appendMessage("⚠️ Please specify a task to complete.", "bot");
    }
    return true;
  }

  return false;
}

// 🤖 Handle unknown input using Gemini AI
async function askChatBot(prompt) {
  if (!model) {
    appendMessage("⚠️ AI not ready. Try again shortly.", "bot");
    return;
  }

  appendMessage("🤖 Thinking...", "bot");

  try {
    const result = await model.generateContent(prompt);
    const reply = result?.candidates?.[0]?.content?.parts?.[0]?.text || "🤖 I’m not sure how to help with that.";

    // Replace "Thinking..." with the real reply
    const lastBotMsg = document.querySelector(".history.bot:last-of-type");
    if (lastBotMsg) {
      lastBotMsg.textContent = `🤖 AI: ${reply}`;
    } else {
      appendMessage(`🤖 AI: ${reply}`, "bot");
    }

    console.log("🟢 AI response:", reply);
  } catch (err) {
    console.error("❌ AI Error:", err);
    appendMessage("⚠️ Error talking to AI.", "bot");
  }
}

// 🖱️ Chat send button listener
document.getElementById("send-btn").addEventListener("click", () => {
  const input = document.getElementById("chat-input");
  const text = input.value.trim().toLowerCase();
  if (!text) return;

  appendMessage(`🧑 You: ${text}`, "user");
  input.value = "";

  // Rule-based first, AI fallback
  if (!ruleChatBot(text)) {
    askChatBot(text);
  }
});

// 💬 Append message to chat history
function appendMessage(message, sender = "bot") {
  const chatHistory = document.getElementById("chat-history");
  const msg = document.createElement("div");
  msg.className = `history ${sender}`;
  msg.textContent = message;
  chatHistory.appendChild(msg);
  chatHistory.scrollTop = chatHistory.scrollHeight;
}
