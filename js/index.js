// Constants
const PAGE_IDS = ["general", "menu", "contactDetails", "complete"];
const PAGE_SUBTITLES = ["Reservierung", "Menü", "Kontaktdetails", "Reservierung abgeschlossen"];
const FOOD = ["foodBurger", "foodPizza"];
const FOOD_PRICE = {"foodBurger": 10, "foodPizza": 15};
const TABLES = {
  1: 'zweier', // left room
  2: 'zweier',
  3: 'zweier',
  4: 'zweier',
  5: 'zweier',
  6: 'zweier',
  7: 'zweier',
  8: 'vierer',
  9: 'vierer',
  10: 'vierer',
  11: 'vierer',
  12: 'zweier',
  13: 'zweier',
  14: 'vierer', // right room
  15: 'vierer',
  16: 'vierer',
  17: 'vierer',
  18: 'vierer',
  19: 'vierer',
  20: 'vierer',
  21: 'vierer',
  22: 'zweier',
  23: 'zweier',
  24: 'zweier',
  25: 'zweier',
  26: 'zweier', // outdoor
  27: 'zweier',
  28: 'viererVert',
  29: 'viererVert',
  30: 'zweier',
  31: 'viererVert',
  32: 'zweier',
  33: 'zweier',
  34: 'viererVert',
  35: 'viererVert',
  36: 'zweier',
  37: 'viererVert'
}

const EURO = "\u20AC"

const OCCUPIED_TABLES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

// State variables
let tables
let currentPage = 0
const shoppingCart = Object.create(null)


//  do things on load
document.addEventListener("DOMContentLoaded", function () {
  addTables(document.getElementById('virtualRestaurant'));

  // Elements
  tables = document.getElementsByClassName("table");

  // Events
  document.getElementById("personNumber").oninput = sliderValueOnInput;
  for (const item of tables) {
    item.onclick = onClickHandlerTable;
  }
  document.getElementById("backButton").onclick = onClickHandlerNavigation;
  document.getElementById("forwardButton").onclick = onClickHandlerNavigation;
  document.getElementById("reservationTime").oninput = onInputHandlerTime;
  for (const item of FOOD) {
    document.getElementById(item).getElementsByClassName("KK-button-minus")[0].addEventListener("click", function () {
      onClickHandlerMenuButton(item, -1);
    });
    document.getElementById(item).getElementsByClassName("KK-button-plus")[0].addEventListener("click", function () {
      onClickHandlerMenuButton(item, +1);
    });
  }
  for (const item of document.getElementsByClassName("KK-collapse-button")) {
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

/**
 * @param {HTMLDivElement} table
 * @param {number} amount
 */
function addChairs(table, amount) {
  for (let i = 0; i < amount; i++) {
    const chair = document.createElement('div');
    chair.classList.add(`stuhl-${i + 1}`);
    const chairImage = document.createElement('img');
    chairImage.src = 'img/Stuhl.png';
    chairImage.alt = `Stuhl #${i + 1}`;
    chair.appendChild(chairImage);
    table.appendChild(chair)
  }
}

/**
 * @param {HTMLDivElement} table
 * @param {string} imgName
 */
function addTableObject(table, imgName) {
  const tableObj = document.createElement('div');
  tableObj.classList.add('tisch');
  const tableImage = document.createElement('img');
  tableImage.src = `img/${imgName}.png`;
  tableImage.alt = `Tisch #${table.getAttribute('table-number')} (${table.classList.contains("not-available") ? 'reserviert' : 'nicht reserviert'})`;
  tableObj.appendChild(tableImage);
  table.appendChild(tableObj);
}

function populateTables() {
  const tables = document.querySelectorAll('.table');
  for (const table of tables) {
    if (table.classList.contains('zweier')) {
      addChairs(table, 2);
      addTableObject(table, 'Tisch');
    } else if (table.classList.contains('vierer')) {
      addChairs(table, 4);
      addTableObject(table, 'GrosserTisch');
    } else if (table.classList.contains('viererVert')) {
      addChairs(table, 4);
      addTableObject(table, 'GrosserTisch_vert');
    }
  }
}

/**
 * @param {HTMLDivElement} restaurant virtual restaurant object to populate
 */
function addTables(restaurant) {
  for (const [nr, type] of Object.entries(TABLES)) {
    const table = document.createElement('div');
    table.id = `table_${nr}`;
    table.classList.add('table');
    table.classList.add(type);
    table.setAttribute('table-number', nr);
    restaurant.appendChild(table);
  }
  populateTables();
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

  minusButton.disabled = shoppingCart[foodId] <= 0;
  valueField.innerText = shoppingCart[foodId];

  let totalPrice = 0;
  for (let item of FOOD) {
    totalPrice += shoppingCart[item] * FOOD_PRICE[item];
  }

  let totalPriceElement = document.getElementById("totalPrice");
  if (totalPrice > 0) {
    totalPriceElement.style.display = "block";
    totalPriceElement.innerText = totalPrice + " " + EURO;
  } else {
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
  return {width: width, height: height, left: left, top: top};
}

/**
 *
 * @param {HTMLElement} table1
 * @param {HTMLElement} table2
 *
 * @param {boolean} arrange whether to arrange them
 */
function arrangeTables(table1, table2, arrange = false) {
  let table1pos = getPercentagePos(table1);
  let table2pos = getPercentagePos(table2);

  if (!(table1.classList.contains("vierer") || table1.classList.contains("viererVert"))) return false;
  if (!(table2.classList.contains("vierer") || table2.classList.contains("viererVert"))) return false;

  if (table1pos.top > 20 && table1pos.top < 50 && table1pos.top === table2pos.top) { //indoor area
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
      if (arrange) {
        table1.style.left = (table2pos.left - table1pos.width) + "%";
      }
      return true;
    } else if (table1pos.left < 70 && table1pos.left > 40) {
      if (arrange) {
        table2.style.left = (table1pos.left + table2pos.width) + "%";
      }
      return true;
    }
  } else if (table1pos.top > 60 && table1pos.top < 90 && table1pos.left === table2pos.left) {
    if (table1pos.top > table2pos.top) { //table1 should always be the upper table
      let temp = table1;
      table2 = temp;
      temp = table1pos;
      table1pos = table2pos;
      table2pos = temp;
    }

    if (table2pos.top - table1pos.top < 17 || table2pos.left - table1pos.left > 18) return false; //if not neighbours -> quit

    if (arrange) {
      table2.style.top = (table1pos.top + table2pos.height) + "%";
    }
    return true;
  }
  return false;
}

function resetTables() {
  for (let table of tables) {
    table.classList.remove("selected");
    table.classList.remove("highlight");
    table.attributeStyleMap.clear();
  }
}

function highlightTables(inputTable) {
  for (let table of tables) {
    table.classList.remove("highlight");
    if (inputTable != null) {
      if (arrangeTables(inputTable, table)) {
        if (!table.classList.contains("not-available")) {
          table.classList.add("highlight");
        }
      }
    }
  }
}

function deactivateUnavailableTables(tables) {
  const disabledTables = document.getElementsByClassName("not-available")
  while (disabledTables.length > 0) {
    disabledTables[0].classList.remove("not-available");
  }
  if (document.getElementById("reservationTime").value === "") return;
  for (let tableNumber of tables) {
    let id = "table_" + tableNumber;
    const table = document.getElementById(id)
    if (table != null) {
      table.classList.add("not-available");
      table.querySelector(".tisch > img").alt = `Tisch #${table.getAttribute('table-number')} (${table.classList.contains("not-available") ? 'reserviert' : 'nicht reserviert'})`;
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
}

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
    if (personNumber > 4 && selectedTables.length === 1) {
      if (!arrangeTables(target, selectedTables[0], true)) {
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
  if (personNumber > 4 && selectedTables.length === 1) {
    highlightTables(selectedTables[0]);
  } else {
    highlightTables(null);
  }
}

function onClickHandlerNavigation(event) {
  let nextPage;
  if (event.currentTarget.id === "forwardButton") {
    nextPage = currentPage + 1;
    if (nextPage >= PAGE_IDS.length - 1) {
      event.currentTarget.style.visibility = "hidden";
      document.getElementById("backButton").style.visibility = "hidden";
      customerEmailConfirmPage.innerText = document.getElementById("customerEmail").value; // ???
    } else {
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
  this.nextElementSibling.classList.toggle("active");
}

function onInputHandlerTime(event) {
  resetTables();
  deactivateUnavailableTables(OCCUPIED_TABLES);
}