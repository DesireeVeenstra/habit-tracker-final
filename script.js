import { db, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from './firebase.js?v=2'; // ✅ Add this

let editingId = null;

// Add or Update Habit
document.getElementById("add-habit").addEventListener("click", async () => {
    const habitInput = document.getElementById("habit-input");
    const name = habitInput.value.trim();
    if (!name) {
        alert("⚠️ Please enter a habit.");
        return;
    }

    try {
        if (editingId) {
            await updateDoc(doc(db, "habits", editingId), { name });
            editingId = null;
            document.getElementById("add-habit").textContent = "Add Habit";
        } else {
            const today = new Date().toISOString().split("T")[0];
            await addDoc(collection(db, "habits"), {
                name,
                dates: [],
                createdAt: today
            });
        }

        habitInput.value = "";
        loadHabits();
    } catch (error) {
        console.error("❌ Error saving habit:", error);
        alert("Error saving habit.");
    }
});

// Load and display habits
async function loadHabits() {
    const habitList = document.getElementById("habit-list");
    habitList.innerHTML = "";

    try {
        const snapshot = await getDocs(collection(db, "habits"));
        const today = new Date().toISOString().split("T")[0];

        snapshot.forEach((docSnap) => {
            const habit = docSnap.data();
            const habitId = docSnap.id;

            const streak = calculateStreak(habit.dates);
            const rate = calculateCompletionRate(habit.dates, habit.createdAt);

            const li = document.createElement("li");
            li.innerHTML = `
                <strong>${habit.name}</strong>
                <br>🔥 Streak: ${streak} days
                <br>✅ Completion Rate: ${rate.toFixed(1)}%
            `;
            li.setAttribute("data-id", habitId);
            li.setAttribute("name", habit.name.toLowerCase());

            const markBtn = document.createElement("button");
            markBtn.textContent = "Mark Done Today";
            markBtn.onclick = async () => {
                if (!habit.dates.includes(today)) {
                    const updatedDates = [...habit.dates, today];
                    await updateDoc(doc(db, "habits", habitId), { dates: updatedDates });
                    loadHabits();
                }
            };

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

            li.appendChild(markBtn);
            li.appendChild(editBtn);
            li.appendChild(deleteBtn);
            habitList.appendChild(li);
        });

        if (snapshot.empty) {
            habitList.innerHTML = "<p>No habits found.</p>";
        }

    } catch (error) {
        console.error("❌ Error loading habits:", error);
        alert("Error loading habits.");
    }
}

// Calculate streak based on consecutive dates
function calculateStreak(dates) {
    const sorted = [...dates].sort((a, b) => new Date(b) - new Date(a));
    let streak = 0;
    let current = new Date();

    for (let dateStr of sorted) {
        const date = new Date(dateStr);
        if (date.toDateString() === current.toDateString()) {
            streak++;
            current.setDate(current.getDate() - 1);
        } else {
            break;
        }
    }

    return streak;
}

// Calculate completion rate from creation date
function calculateCompletionRate(dates, createdAt) {
    const start = new Date(createdAt);
    const now = new Date();
    const totalDays = Math.floor((now - start) / (1000 * 60 * 60 * 24)) + 1;
    return (dates.length / totalDays) * 100;
}

window.onload = loadHabits;

// ✅ Export for chatbot
window.addTask = async function (taskName) {
    const today = new Date().toISOString().split("T")[0];
    await addDoc(collection(db, "habits"), {
        name: taskName,
        dates: [],
        createdAt: today
    });
    loadHabits();
};

window.removeTask = async function (id) {
    await deleteDoc(doc(db, "habits", id));
    loadHabits();
};

window.removeVisualTask = function (id) {
    const li = document.querySelector(`[data-id="${id}"]`);
    if (li) li.remove();
};

window.findHabitByName = async function (name) {
    const snapshot = await getDocs(collection(db, "habits"));
    for (const docSnap of snapshot.docs) {
        if (docSnap.data().name.toLowerCase() === name.toLowerCase()) {
            return docSnap.id;
        }
    }
    return null;
};