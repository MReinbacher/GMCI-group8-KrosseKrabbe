
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

});

// Event functions
function sliderValueOnInput() {
    var personNumberRange = document.getElementById("personNumber");
    var personNumberValue = document.getElementById("personNumberValue");
    personNumberValue.innerHTML = personNumberRange.value;
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