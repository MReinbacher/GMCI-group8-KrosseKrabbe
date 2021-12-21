//  do things on load
document.addEventListener("DOMContentLoaded", function () {
    sliderValueOnInput();
});

// Events
document.getElementById("personNumber").oninput = sliderValueOnInput;


// Event functions
function sliderValueOnInput() {
    var personNumberRange = document.getElementById("personNumber");
    var personNumberValue = document.getElementById("personNumberValue");
    personNumberValue.innerHTML = personNumberRange.value;
};