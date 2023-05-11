import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://realtime-database-65559-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")

addButtonEl.addEventListener("click", function() {
    if (inputValue != "") {
        let inputValue = inputFieldEl.value
        //push new value to database
        push(shoppingListInDB, inputValue)
        
        clearInputFieldEl()
        
        appendItemToShoppingListEl(inputValue)
    }
})
//update array from database, snapshot is the new data
onValue(shoppingListInDB, function(snapshot){
    if(snapshot.exists()){
        //get array of array(key, value)
        let itemArray = Object.entries(snapshot.val())
        clearShoppingListEl()
        for(let i=0; i<itemArray.length; i++){
            let currentItem=itemArray[i]
            let currentKey=currentItem[0]
            let currentValue=currentItem[1]
            appendItemToShoppingListEl(currentItem)
        }
    }
    else{
        shoppingListEl.innerHTML = "No items here... yet"
    }
})


function clearInputFieldEl() {
    inputFieldEl.value = ""
}
function clearShoppingListEl(){
    shoppingListEl.innerHTML=''
}

function appendItemToShoppingListEl(item) {
    //create element with tag
    let itemID = item[0]
    let itemValue=item[1]

    let newEl = document.createElement("li")
    //set text inside
    newEl.textContent = itemValue

    newEl.addEventListener("click", function(){
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        remove(exactLocationOfItemInDB)
    })
    //choose where to put
    shoppingListEl.append(newEl)
    
}
