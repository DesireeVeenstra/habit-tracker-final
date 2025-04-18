import { db, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from './firebase.js?v=2'; // ✅ Add this

let editingId = null;

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

async function loadHabits() {
  const habitList = document.getElementById("habit-list");
  habitList.innerHTML = "";

  try {
    const snapshot = await getDocs(collection(db, "habits"));
    const today = new Date().toISOString().split("T")[0];

    const habitData = [];

    snapshot.forEach((docSnap) => {
      const habit = docSnap.data();
      const habitId = docSnap.id;

      // 🔁 fallback defaults
      const createdAt = habit.createdAt || today;
      const dates = Array.isArray(habit.dates) ? habit.dates : [];

      const streak = calculateStreak(dates);
      const rate = calculateCompletionRate(dates, createdAt);

      habitData.push({ name: habit.name, dates });

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
        if (!dates.includes(today)) {
          const updatedDates = [...dates, today];
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

    if (typeof Chart !== "undefined") {
        renderChart(habitData);
      } else {
        console.warn("⚠️ Chart.js not loaded — skipping chart rendering.");
      }
      
    if (snapshot.empty) {
      habitList.innerHTML = "<p>No habits found.</p>";
    }

  } catch (error) {
    console.error("❌ Error loading habits:", error);
    alert("Error loading habits.");
  }
}

function calculateStreak(dates) {
    if (!Array.isArray(dates)) return 0; // ✅ Fix crash if dates is missing/null
  
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
  

function calculateCompletionRate(dates, createdAt) {
  const start = new Date(createdAt);
  const now = new Date();
  const totalDays = Math.floor((now - start) / (1000 * 60 * 60 * 24)) + 1;
  return (dates.length / totalDays) * 100;
}

window.onload = loadHabits;

// ✅ Chart rendering
let habitChart = null;
function renderChart(habitData) {
  const ctx = document.getElementById("habit-chart").getContext("2d");

  const labels = habitData.map(h => h.name);
  const data = habitData.map(h => Array.isArray(h.dates) ? h.dates.length : 0);

  if (habitChart) habitChart.destroy();

  habitChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Habit Completions",
        data,
        backgroundColor: "rgba(153, 102, 255, 0.5)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          precision: 0
        }
      }
    }
  });
}