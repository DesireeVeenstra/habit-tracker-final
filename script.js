import { db, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from './firebase.js';

let editingId = null;

document.getElementById("add-habit").addEventListener("click", async () => {
    const habitInput = document.getElementById("habit-input");
    const name = habitInput.value.trim();
    if (!name) return;

    if (editingId) {
        await updateDoc(doc(db, "habits", editingId), { name });
        editingId = null;
        document.getElementById("add-habit").textContent = "Add Habit";
    } else {
        await addDoc(collection(db, "habits"), { name });
    }

    habitInput.value = "";
    loadHabits();
});

async function loadHabits() {
    const habitList = document.getElementById("habit-list");
    habitList.innerHTML = "";

    const snapshot = await getDocs(collection(db, "habits"));
    snapshot.forEach((docSnap) => {
        const habit = docSnap.data();
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
}

window.onload = loadHabits;
