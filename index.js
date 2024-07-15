import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js"
import { getDatabase, ref, push, onValue, update } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js"

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
        from: inputFromEl.value,
        likes: 0
    }
    if (newEndorsement.message) {
        addEndorsement(newEndorsement)    
    }
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
    const newItemEl = document.createElement("div")
    newItemEl.className = "endorsement"
    const endorsement = item[1]
    const newLikesEl = createLikesEl(endorsement.likes, item[0])

    newItemEl.innerHTML = `
        <p class="bold">To ${endorsement.to}</p>
        <p>${endorsement.message}</p>
        <div id="${item[0]}-div-el">
            <p class="bold">From ${endorsement.from}</p>
        </div>
    `
    endorsementListEl.prepend(newItemEl)

    const newDivEl = document.getElementById(`${item[0]}-div-el`)
    newDivEl.append(newLikesEl)
}

function createLikesEl(likes, itemID) {
    const newLikesEl = document.createElement("p")
    newLikesEl.className = "bolder"
    newLikesEl.textContent = `❤ ${likes ?? 0}`

    newLikesEl.addEventListener("click", function () {
        if (localStorage.getItem(`${itemID}-liked`)) {
            return
        }
        const updateData = {
            likes: (likes ?? 0) + 1
        }
        const itemLocationInDB = ref(database, `endorsements_v2/${itemID}`)
        update(itemLocationInDB, updateData)
        localStorage.setItem(`${itemID}-liked`, 1)
    })

    return newLikesEl
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
