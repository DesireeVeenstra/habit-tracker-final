import { db, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from './firebase.js';

let editingId = null;

// Event: Add or Update Habit
document.getElementById("add-habit").addEventListener("click", async () => {
    const habitInput = document.getElementById("habit-input");
    const name = habitInput.value.trim();
    if (!name) {
        alert("⚠️ Please enter a habit first.");
        return;
    }

    try {
        if (editingId) {
            console.log("🔄 Updating habit:", editingId);
            await updateDoc(doc(db, "habits", editingId), { name });
            editingId = null;
            document.getElementById("add-habit").textContent = "Add Habit";
        } else {
            console.log("➕ Adding new habit:", name);
            await addDoc(collection(db, "habits"), { name });
        }

        habitInput.value = "";
        loadHabits();
    } catch (error) {
        console.error("❌ Error adding habit:", error);
        alert("Error saving habit. Check console.");
    }
});

// Load habits and display
async function loadHabits() {
    const habitList = document.getElementById("habit-list");
    habitList.innerHTML = "";

    try {
        const snapshot = await getDocs(collection(db, "habits"));
        console.log("📦 Loaded habits:", snapshot.size);

        snapshot.forEach((docSnap) => {
            const habit = docSnap.data();
            const habitId = docSnap.id;

            console.log("📋 Habit:", habit);

            const li = document.createElement("li");
            li.textContent = habit.name;
            li.setAttribute("data-id", habitId);
            li.setAttribute("name", habit.name.toLowerCase());

            const editBtn = document.createElement("button");
            editBtn.textContent = "Edit";
            editBtn.onclick = () => {
                document.getElementById("habit-input").value = habit.name;
                editingId = habitId;
                document.getElementById("add-habit").textContent = "Update Habit";
            };

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.onclick = async () => {
                await deleteDoc(doc(db, "habits", habitId));
                loadHabits();
            };

            li.appendChild(editBtn);
            li.appendChild(deleteBtn);
            habitList.appendChild(li);
        });

        if (snapshot.empty) {
            habitList.innerHTML = "<p>No habits found.</p>";
        }

    } catch (error) {
        console.error("❌ Error loading habits:", error);
        alert("Error loading habits. Check console.");
    }
}

// ✅ Exported functions for chatbot
window.addTask = async function (taskName) {
    try {
        console.log("🧠 [Chatbot] Adding habit:", taskName);
        await addDoc(collection(db, "habits"), { name: taskName });
        loadHabits();
    } catch (error) {
        console.error("❌ Failed to add habit:", error);
    }
};

window.removeTask = async function (id) {
    try {
        console.log("🧠 [Chatbot] Removing habit by ID:", id);
        await deleteDoc(doc(db, "habits", id));
        loadHabits();
    } catch (error) {
        console.error("❌ Failed to remove habit:", error);
    }
};

window.removeVisualTask = function (id) {
    const li = document.querySelector(`[data-id="${id}"]`);
    if (li) {
        li.remove();
        console.log("🧼 [Chatbot] Removed visual habit from DOM:", id);
    }
};

// Helper to find habits by name
window.findHabitByName = async function (name) {
    try {
        const snapshot = await getDocs(collection(db, "habits"));
        for (const docSnap of snapshot.docs) {
            if (docSnap.data().name.toLowerCase() === name.toLowerCase()) {
                return docSnap.id;
            }
        }
        return null;
    } catch (err) {
        console.error("❌ Error searching habit:", err);
        return null;
    }
};

window.onload = loadHabits;
