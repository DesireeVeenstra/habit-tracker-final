// ai-chatbot.js

document.getElementById("send-btn").addEventListener("click", () => {
    const input = document.getElementById("chat-input");
    const message = input.value.trim().toLowerCase();
    if (!message) return;

    appendMessage(`🧑 You: ${message}`);
    input.value = "";

    if (!ruleChatBot(message)) {
        // fallback to fake AI response
        appendMessage("🤖 AI: I'm still learning! Try saying 'add task...' or 'complete...'");
    }
});

// Append messages to chat history
function appendMessage(message) {
    const chatHistory = document.getElementById("chat-history");
    const history = document.createElement("div");
    history.textContent = message;
    history.className = 'history';
    chatHistory.appendChild(history);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

// Try to match commands
function ruleChatBot(request) {
    if (request.startsWith("add task")) {
        let task = request.replace("add task", "").trim();
        if (task) {
            addTask(task); // This should call your existing addTask function
            appendMessage(`✅ Task '${task}' added!`);
        } else {
            appendMessage("⚠️ Please specify a task to add.");
        }
        return true;
    }

    if (request.startsWith("complete")) {
        let taskName = request.replace("complete", "").trim();
        if (taskName) {
            if (removeFromTaskName(taskName)) {
                appendMessage(`✅ Task '${taskName}' marked as complete.`);
            } else {
                appendMessage("⚠️ Task not found.");
            }
        } else {
            appendMessage("⚠️ Please specify a task to complete.");
        }
        return true;
    }

    return false;
}

// Search for tasks by name and remove them
function removeFromTaskName(task) {
    const elements = document.getElementsByName(task);
    if (elements.length === 0) return false;

    elements.forEach(e => {
        removeTask(e.id);       // assumes you have this
        removeVisualTask(e.id); // assumes you have this too
    });

    return true;
}
