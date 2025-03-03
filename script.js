import { db, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from './firebase.js';

document.getElementById("add-habit").addEventListener("click", async () => {
    const habitInput = document.getElementById("habit-input").value;
    if (habitInput.trim() !== "") {
        await addDoc(collection(db, "habits"), { name: habitInput, streak: 0 });
        document.getElementById("habit-input").value = "";
        loadHabits();
    }
});

async function loadHabits() {
    const habitList = document.getElementById("habit-list");
    habitList.innerHTML = "";
    const querySnapshot = await getDocs(collection(db, "habits"));
    querySnapshot.forEach((docSnapshot) => {
        const habitData = docSnapshot.data();
        const li = document.createElement("li");
        li.textContent = `${habitData.name} (Streak: ${habitData.streak})`;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", async () => {
            await deleteDoc(doc(db, "habits", docSnapshot.id));
            loadHabits();
        });

        li.appendChild(deleteBtn);
        habitList.appendChild(li);
    });
}

window.onload = loadHabits;
