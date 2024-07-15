import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js"

const firebaseConfig = {
    apiKey: "AIzaSyA6uQNIRA_5yjqn1h7sWbWIDpxFn_v65Uk",
    authDomain: "realtime-database-c1c98.firebaseapp.com",
    databaseURL: "https://realtime-database-c1c98-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "realtime-database-c1c98",
    storageBucket: "realtime-database-c1c98.appspot.com",
    messagingSenderId: "234792289299",
    appId: "1:234792289299:web:850db364ecffa21ed22be6"
}

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)
const endorsementsInDB = ref(database, "endorsements_v2")

const publishBtn = document.getElementById("publish-btn")
const inputEl = document.getElementById("input-el")
const inputFromEl = document.getElementById("from-input-el")
const inputToEl = document.getElementById("to-input-el")
const endorsementListEl = document.getElementById("endorsement-list-el")

publishBtn.addEventListener("click", function () {
    const newEndorsement = {
        to: inputToEl.value,
        message: inputEl.value,
        from: inputFromEl.value
    }
    addEndorsement(newEndorsement)
    clearInputEls()
})

function addEndorsement(value) {
    push(endorsementsInDB, value)
}

function clearInputEls() {
    inputToEl.value = ""
    inputEl.value = ""
    inputFromEl.value = ""
}

function clearEndorsementList() {
    endorsementListEl.innerHTML = ""
}

function appendItemToList(item) {
    // <div class="endorsement">
    //     <p class="bold">To Leanne</p>
    //     <p>Leanne! Thank you so much for helping me with the March accounting. Saved so much time because of you! 💜 Frode</p>
    //     <div>
    //         <p class="bold">From Frode</p>
    //         <p class="bolder">❤ 4</p>
    //     </div>
    // </div>
    let newItemEl = document.createElement("div")
    const endorsement = item[1]
    newItemEl.className = "endorsement"
    newItemEl.innerHTML = `
        <p class="bold">To ${endorsement.to}</p>
        <p>${endorsement.message}</p>
        <p class="bold">From ${endorsement.from}</p>
    `
    endorsementListEl.append(newItemEl)
}

onValue(endorsementsInDB, function (snapshot) {
    clearEndorsementList()
    
    if (snapshot.exists()) {
        const itemsArray = Object.entries(snapshot.val())
    
        for (let i = 0; i < itemsArray.length; i++) {
            appendItemToList(itemsArray[i])
        }
    }
})
