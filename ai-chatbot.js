import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { db } from "./firebase.js";

let apiKey = null;
let model = null;

document.addEventListener("DOMContentLoaded", async () => {
    console.log("✅ DOM fully loaded, initializing chatbot...");

    async function getApiKey() {
        try {
            console.log("🔍 Checking Firestore for API key...");
            const snapshot = await getDoc(doc(db, "apikey", "googlegenai"));

            if (!snapshot.exists()) {
                console.error("❌ Firestore Error: API Key document does not exist.");
                appendMessage("Error: Missing API key in Firestore.");
                return;
            }

            apiKey = snapshot.data().key;
            console.log("✅ API Key Retrieved:", apiKey);

            if (!apiKey || apiKey.trim() === "") {
                console.error("❌ API Key is empty or invalid.");
                appendMessage("Error: API key is missing in Firestore.");
                return;
            }

            // ✅ Initialize Google Gemini AI Model
            const { GoogleGenerativeAI } = await import("https://esm.sh/@google/generative-ai");
            const genAI = new GoogleGenerativeAI(apiKey);
            model = genAI.getGenerativeModel({ model: "gemini-pro" });

        } catch (error) {
            console.error("❌ Error fetching API key from Firestore:", error);
            appendMessage("Error: Unable to retrieve API key.");
        }
    }

    await getApiKey();
});
