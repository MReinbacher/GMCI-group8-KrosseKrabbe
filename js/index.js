// Constants
const PAGE_IDS = ["general", "menu", "contactDetails", "complete"];
const PAGE_SUBTITLES = ["Reservierung", "Menü", "Kontaktdetails", "Reservierung abgeschlossen"];

// State variables
var currentPage = 0;


//  do things on load
document.addEventListener("DOMContentLoaded", function () {
    sliderValueOnInput();

    // Elements
    const tables = document.getElementsByClassName("table");

    // Events
    document.getElementById("personNumber").oninput = sliderValueOnInput;
    for (let item of tables) {
        item.onclick = onClickHandlerTable;
    }
    document.getElementById("backButton").onclick = onClickHandlerNavigation;
    document.getElementById("forwardButton").onclick = onClickHandlerNavigation;

});

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
    document.getElementById(PAGE_IDS[currentPage]).style.display = "none";
    document.getElementById(PAGE_IDS[nextPage]).style.display = "block";
    document.getElementById("subtitle").innerText = PAGE_SUBTITLES[nextPage];
    currentPage = nextPage;
}