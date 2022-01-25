//  do things on load
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("reservationTime").oninput = onInputHandlerTime;
});

function onInputHandlerTime(event) {
    if (event.currentTarget.value === "") document.getElementById("tableBody").style.visibility = "hidden";
    else document.getElementById("tableBody").style.visibility = "visible";
}
