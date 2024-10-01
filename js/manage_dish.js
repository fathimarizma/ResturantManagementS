// Get the popup
var popup = document.getElementById("addFoodPopup");

// Get the link that opens the popup
var link = document.getElementById("addDishLink");

// When the user clicks the link, open the popup
link.onclick = function (event) {
  event.preventDefault(); // Prevent default anchor click behavior
  popup.style.display = "block";
};

// Close the popup when the user clicks on <span> (x)
function closePopup() {
  popup.style.display = "none";
}

// Optional: Close the popup when the user clicks anywhere outside of the popup
window.onclick = function (event) {
  if (event.target == popup) {
    popup.style.display = "none";
  }
};
