// Constants
const PAGE_IDS = ["general", "menu", "contactDetails", "complete"];
const PAGE_SUBTITLES = ["Reservierung", "Menü", "Kontaktdetails", "Reservierung abgeschlossen"];
const FOOD = ["foodBurger", "foodPizza"];
const FOOD_PRICE = { "foodBurger": 10, "foodPizza": 15 };

const EURO = "\u20AC"

// State variables
var tables;
var currentPage = 0;
var shoppingCart = Object.create(null);


//  do things on load
document.addEventListener("DOMContentLoaded", function () {
    // Elements
    tables = document.getElementsByClassName("table");

    // Events
    document.getElementById("personNumber").oninput = sliderValueOnInput;
    for (let item of tables) {
        item.onclick = onClickHandlerTable;
    }
    document.getElementById("backButton").onclick = onClickHandlerNavigation;
    document.getElementById("forwardButton").onclick = onClickHandlerNavigation;
    document.getElementById("reservationTime").oninput = onInputHandlerTime;
    for (let item of FOOD) {
        document.getElementById(item).getElementsByClassName("KK-button-minus")[0].addEventListener("click", function () { onClickHandlerMenuButton(item, -1); });
        document.getElementById(item).getElementsByClassName("KK-button-plus")[0].addEventListener("click", function () { onClickHandlerMenuButton(item, +1); });
    }
    for (let item of document.getElementsByClassName("KK-collapse-button")) {
        item.onclick = onClickHandlerCollapsible;
    }

    // Initialization
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

/**
 * 
 * @param {HTMLElement} element
 * 
 */
function getPercentagePos(element) {
    let styleMap = element.computedStyleMap();
    var width = Number(styleMap.get('width').value.toFixed(2));
    var height = Number(styleMap.get('height').value.toFixed(2));
    var left = Number(styleMap.get('left').value.toFixed(2));
    var top = Number(styleMap.get('top').value.toFixed(2));
    return { width: width, height: height, left: left, top: top };
}

/**
 * 
 * @param {HTMLElement} table1
 * @param {HTMLElement} table2
 * 
 */
function arangeTables(table1, table2, arange = false) {
    let table1pos = getPercentagePos(table1);
    let table2pos = getPercentagePos(table2);

    if (!(table1.classList.contains("vierer") || table1.classList.contains("viererVert"))) return false;
    if (!(table2.classList.contains("vierer") || table2.classList.contains("viererVert"))) return false;

    if (table1pos.top > 20 && table1pos.top < 50 && table1pos.top == table2pos.top) { //indoor area
        if (table1pos.left > table2pos.left) { //table1 should always be the left table
            let temp = table1;
            table1 = table2;
            table2 = temp;
            temp = table1pos;
            table1pos = table2pos;
            table2pos = temp;
        }
        if (table2pos.left - table1pos.left < 13 || table2pos.left - table1pos.left > 14) return false; //if not neighbours -> quit

        if (table1pos.left > 70 || (table1pos.left < 40 && table1pos.left > 15)) {
            if (arange) {
                table1.style.left = (table2pos.left - table1pos.width) + "%";
            }
            return true;
        } else if (table1pos.left < 70 && table1pos.left > 40) {
            if (arange) {
                table2.style.left = (table1pos.left + table2pos.width) + "%";
            }
            return true;
        }
    } else if (table1pos.top > 60 && table1pos.top < 90 && table1pos.left == table2pos.left) {
        if (table1pos.top > table2pos.top) { //table1 should always be the upper table
            let temp = table1;
            table1 = table2;
            table2 = temp;
            temp = table1pos;
            table1pos = table2pos;
            table2pos = temp;
        }

        if (table2pos.top - table1pos.top < 17 || table2pos.left - table1pos.left > 18) return false; //if not neighbours -> quit

        if (arange) {
            table2.style.top = (table1pos.top + table2pos.height) + "%";
        }
        return true;
    }
    return false;
}

function resetTables() {
    for (table of tables) {
        table.classList.remove("selected");
        table.classList.remove("highlight");
        table.attributeStyleMap.clear();
    }
}

function highlightTables(inputTable) {
    for (table of tables) {
        table.classList.remove("highlight");
        if (inputTable != null) {
            if (arangeTables(inputTable, table)) {
                if (!table.classList.contains("not-available")) {
                    table.classList.add("highlight");
                }
            }
        }
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
    resetTables();
};

function onClickHandlerTable(event) {
    const target = event.currentTarget;
    if (target.classList.contains("not-available")) return false; // if not-available -> do nothing
    var personNumber = document.getElementById("personNumber").value;
    var selectedTables = document.querySelectorAll(".table.selected");

    if (target.classList.contains("selected")) { // deselect if selected
        target.classList.remove("selected");
        for (let item of selectedTables) {
            item.attributeStyleMap.clear();
        }
    } else { // select if not selected
        if (personNumber > 4 && selectedTables.length == 1) {
            if (!arangeTables(target, selectedTables[0], true)) {
                for (let item of selectedTables) {
                    item.classList.remove("selected");
                    item.attributeStyleMap.clear();
                }
            }
        } else {
            for (let item of selectedTables) {
                item.classList.remove("selected");
                item.attributeStyleMap.clear();
            }
        }
        target.classList.add("selected");
    }

    selectedTables = document.querySelectorAll(".table.selected");
    if (personNumber > 4 && selectedTables.length == 1) {
        highlightTables(selectedTables[0]);
    }
    else {
        highlightTables(null);
    }
}

function onClickHandlerNavigation(event) {
    let nextPage;
    if (event.currentTarget.id == "forwardButton") {
        nextPage = currentPage + 1;
        if (nextPage >= PAGE_IDS.length - 1) {
            event.currentTarget.style.visibility = "hidden";
            document.getElementById("backButton").style.visibility = "hidden";
            customerEmailConfirmPage.innerText = document.getElementById("customerEmail").value;
        }
        else {
            if (nextPage >= PAGE_IDS.length - 2) {
                // event.currentTarget.disabled = true;
                event.currentTarget.innerText = "Reservierung abschließen";
            }
            // document.getElementById("backButton").disabled = false;
            document.getElementById("backButton").style.visibility = "visible";
        }
    } else {
        nextPage = currentPage - 1;
        if (nextPage <= 0) {
            // event.currentTarget.disabled = true;
            event.currentTarget.style.visibility = "hidden";
        }
        // document.getElementById("forwardButton").disabled = false;
        document.getElementById("forwardButton").innerText = "Weiter";
    }
    goToPage(nextPage);
}

function onClickHandlerMenuButton(foodId, amount) {
    updateShoppingCart(foodId, amount);
    updateMenuPage(foodId);
}

function onClickHandlerCollapsible(event) {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    content.classList.toggle("active");
}

function onInputHandlerTime(event) {
    resetTables();
    //TODO mark unavailable tables
}