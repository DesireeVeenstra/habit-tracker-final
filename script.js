import { db, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from './firebase.js';

let editingId = null;

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

async function loadHabits() {
    const habitList = document.getElementById("habit-list");
    habitList.innerHTML = "";

    try {
        const snapshot = await getDocs(collection(db, "habits"));
        console.log("📦 Loaded habits:", snapshot.size);

        snapshot.forEach((docSnap) => {
            const habit = docSnap.data();
            console.log("📋 Habit:", habit);

            const li = document.createElement("li");
            li.textContent = habit.name;

            const editBtn = document.createElement("button");
            editBtn.textContent = "Edit";
            editBtn.onclick = () => {
                document.getElementById("habit-input").value = habit.name;
                editingId = docSnap.id;
                document.getElementById("add-habit").textContent = "Update Habit";
            };

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.onclick = async () => {
                await deleteDoc(doc(db, "habits", docSnap.id));
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

window.onload = loadHabits;
