// Constants
const PAGE_IDS = ["general", "menu", "contactDetails", "complete"];
const PAGE_SUBTITLES = ["Reservierung", "Menü", "Kontaktdetails", "Reservierung abgeschlossen"];
const FOOD = ["foodBurger", "foodPizza"];
const FOOD_PRICE = { "foodBurger": 10, "foodPizza": 15 };

const EURO = "\u20AC"

// State variables
var currentPage = 0;
var shoppingCart = Object.create(null);


//  do things on load
document.addEventListener("DOMContentLoaded", function () {
    // Elements
    const tables = document.getElementsByClassName("table");

    // Events
    document.getElementById("personNumber").oninput = sliderValueOnInput;
    for (let item of tables) {
        item.onclick = onClickHandlerTable;
    }
    document.getElementById("backButton").onclick = onClickHandlerNavigation;
    document.getElementById("forwardButton").onclick = onClickHandlerNavigation;
    for (let item of FOOD) {
        document.getElementById(item).getElementsByClassName("KK-button-minus")[0].addEventListener("click", function () { onClickHandlerMenuButton(item, -1); });
        document.getElementById(item).getElementsByClassName("KK-button-plus")[0].addEventListener("click", function () { onClickHandlerMenuButton(item, +1); });
    }
    sliderValueOnInput();
    goToPage(currentPage);
    initShoppingCart();
    initPrices();
});

// Functions
function goToPage(page) {
    document.getElementById(PAGE_IDS[currentPage]).style.display = "none";
    document.getElementById(PAGE_IDS[page]).style.display = "flex";
    document.getElementById("subtitle").innerText = PAGE_SUBTITLES[page];
    currentPage = page;
}

function initShoppingCart() {
    for (let item of FOOD) {
        shoppingCart[item] = 0;
    }
}

function initPrices() {
    for (let item of FOOD) {
        document.getElementById(item).getElementsByClassName("KK-menuItem-price")[0].innerText = FOOD_PRICE[item] + " " + EURO;   
    }
}

function updateShoppingCart(item, amount) {
    shoppingCart[item] += amount;
    if (shoppingCart[item] <= 0) shoppingCart[item] = 0;
}

function updateMenuPage(foodId) {
    let item = document.getElementById(foodId);
    let minusButton = item.getElementsByClassName("KK-button-minus")[0];
    let valueField = item.getElementsByTagName("span")[0];

    if (shoppingCart[foodId] <= 0) {
        minusButton.disabled = true;
    } else {
        minusButton.disabled = false;
    }
    valueField.innerText = shoppingCart[foodId];

    let totalPrice = 0;
    for (let item of FOOD) {
        totalPrice += shoppingCart[item] * FOOD_PRICE[item];
    }

    let totalPriceElement = document.getElementById("totalPrice");
    if (totalPrice > 0) {
        totalPriceElement.style.display = "block";
        totalPriceElement.innerText = totalPrice + " " + EURO;
    }
    else {
        totalPriceElement.style.display = "none";
    }
}

// Event functions
function sliderValueOnInput(event) {
    var personNumberValue = document.getElementById("personNumberValue");
    if (event) {
        personNumberValue.innerHTML = this.value;
    } else {
        personNumberValue.innerHTML = document.getElementById("personNumber").value;
    }
};

function onClickHandlerTable(event) {
    const target = event.currentTarget;
    if (target.classList.contains("not-available")) return false; // if not-available -> do nothing
    if (target.classList.contains("selected")) { // deselect if selected
        target.classList.remove("selected");
    } else { // select if not selected
        var selectedTables = document.querySelectorAll(".table.selected");
        for (let item of selectedTables) {
            item.classList.remove("selected");
        }
        target.classList.add("selected");
    }
}

function onClickHandlerNavigation(event) {
    let nextPage;
    if (event.currentTarget.id == "forwardButton") {
        nextPage = currentPage + 1;
        if (nextPage >= PAGE_IDS.length - 1) {
            event.currentTarget.disabled = true;
        }
        document.getElementById("backButton").disabled = false;
    } else {
        nextPage = currentPage - 1;
        if (nextPage <= 0) {
            event.currentTarget.disabled = true;
        }
        document.getElementById("forwardButton").disabled = false;
    }
    goToPage(nextPage);
}

function onClickHandlerMenuButton(foodId, amount) {
    updateShoppingCart(foodId, amount);
    updateMenuPage(foodId);
}