// =========================
// ELEMENTS
// =========================

const itemName = document.getElementById("itemName");
const category = document.getElementById("category");
const quantity = document.getElementById("quantity");
const price = document.getElementById("price");

const addBtn = document.getElementById("addBtn");
const clearBtn = document.getElementById("clearBtn");

const groceryList = document.getElementById("groceryList");
const totalCost = document.getElementById("totalCost");

const tabs = document.querySelectorAll(".tab");


// =========================
// DATA
// =========================

let groceries = JSON.parse(localStorage.getItem("groceries")) || [];

let currentFilter = "all";


// =========================
// SAVE
// =========================

function saveData() {
    localStorage.setItem("groceries", JSON.stringify(groceries));
}


// =========================
// TOTAL COST
// =========================

function updateTotal() {

    let total = 0;

    groceries.forEach(item => {
        total += item.price * item.quantity;
    });

    totalCost.innerText = "₹" + total.toFixed(2);
}


// =========================
// DISPLAY ITEMS
// =========================

function displayItems() {

    groceryList.innerHTML = "";

    let filtered = groceries;

    if (currentFilter === "todo") {

        filtered = groceries.filter(item => !item.bought);

    } else if (currentFilter === "bought") {

        filtered = groceries.filter(item => item.bought);

    }

    if (filtered.length === 0) {

        groceryList.innerHTML =
            `<p style="text-align:center;color:gray;margin-top:40px;">
            No Items Found
        </p>`;

        updateTotal();

        return;
    }

    filtered.forEach((item, index) => {

        groceryList.innerHTML += `

        <div class="item">

            <div class="item-left">

                <h3 ${item.bought ? 'style="text-decoration:line-through;color:gray;"' : ""}>
                    ${item.name}
                </h3>

                <p>

                    ${item.category}

                    |

                    Qty : ${item.quantity}

                    |

                    ₹${item.price}

                </p>

            </div>

            <div class="item-right">

                <button
                    class="buyBtn"
                    onclick="toggleBought(${index})">

                    ${item.bought ? "Undo" : "Bought"}

                </button>

                <button
                    class="deleteBtn"
                    onclick="deleteItem(${index})">

                    Delete

                </button>

            </div>

        </div>

        `;

    });

    updateTotal();

}


// =========================
// ADD ITEM
// =========================

addBtn.addEventListener("click", () => {

    const name = itemName.value.trim();

    const qty = Number(quantity.value);

    const cost = Number(price.value);

    if (name === "") {

        alert("Enter Item Name");

        return;
    }

    if (cost <= 0) {

        alert("Enter Valid Price");

        return;
    }

    groceries.push({

        name: name,

        category: category.value,

        quantity: qty,

        price: cost,

        bought: false

    });

    saveData();

    displayItems();

    itemName.value = "";

    quantity.value = 1;

    price.value = "";

});


// =========================
// DELETE
// =========================

function deleteItem(index) {

    groceries.splice(index, 1);

    saveData();

    displayItems();

}


// =========================
// BOUGHT / UNDO
// =========================

function toggleBought(index) {

    groceries[index].bought = !groceries[index].bought;

    saveData();

    displayItems();

}


// =========================
// CLEAR
// =========================

clearBtn.addEventListener("click", () => {

    if (confirm("Clear Entire Grocery List?")) {

        groceries = [];

        saveData();

        displayItems();

    }

});


// =========================
// FILTERS
// =========================

tabs.forEach(tab => {

    tab.addEventListener("click", () => {

        tabs.forEach(btn => btn.classList.remove("active"));

        tab.classList.add("active");

        currentFilter = tab.dataset.filter;

        displayItems();

    });

});


// =========================
// ENTER KEY
// =========================

[itemName, quantity, price].forEach(input => {

    input.addEventListener("keypress", function (e) {

        if (e.key === "Enter") {

            addBtn.click();

        }

    });

});


// =========================
// START
// =========================

displayItems();