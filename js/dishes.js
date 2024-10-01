let dishes = [];

const dishTable = document
  .getElementById("dishTable")
  .getElementsByTagName("tbody")[0];

// Load dishes from local storage on page load
document.addEventListener("DOMContentLoaded", () => {
  loadDishesFromLocalStorage();
  displayDishes();
});

function displayDishes() {
  dishTable.innerHTML = ""; // Clear the table

  dishes.forEach((dish, index) => {
    const row = dishTable.insertRow();
    const nameCell = row.insertCell();
    const categoryCell = row.insertCell();
    const priceCell = row.insertCell();
    const imageCell = row.insertCell();
    const actionsCell = row.insertCell();

    nameCell.textContent = dish.name;
    categoryCell.textContent = dish.category;
    priceCell.textContent = dish.price;
    imageCell.innerHTML = `<img src="${dish.image}" alt="${dish.name}" class="dishImg">`;

    // Actions buttons
    actionsCell.innerHTML = `
                <a  onclick="openEditDishPopup(${index})" class="btn-update">Edit</a>
                <a  onclick="deleteDish(${index})" class="btn-delete">Delete</a>
            `;
  });
}

function openAddDishPopup() {
  document.getElementById("addDishPopup").style.display = "block";
}

function openEditDishPopup(index) {
  const dish = dishes[index];
  document.getElementById("editDishIndex").value = index;
  document.getElementById("editDishName").value = dish.name;
  document.getElementById("editDishCategory").value = dish.category;
  document.getElementById("editDishPrice").value = dish.price;
  document.getElementById("editDishImage").value = dish.image;
  document.getElementById("editDishPopup").style.display = "block";
}

function closePopup(popupId) {
  document.getElementById(popupId).style.display = "none";
}

// Add Dish Form Submission
document
  .getElementById("addDishForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const fileInput = document.getElementById("dishImage");
    const file = fileInput.files[0]; // Get the selected file

    if (file) {
      const reader = new FileReader();

      reader.onload = function (e) {
        const newDish = {
          name: document.getElementById("dishName").value,
          category: document.getElementById("dishCategory").value,
          price: parseFloat(document.getElementById("dishPrice").value),
          image: e.target.result, // Store the data URL in the dish object
        };

        dishes.push(newDish);
        saveDishesToLocalStorage();
        displayDishes();
        closePopup("addDishPopup");
      };

      reader.readAsDataURL(file); // Read the image file as a data URL
    } else {
      alert("Please select an image file.");
    }
  });

// Edit Dish Form Submission
document
  .getElementById("editDishForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const index = parseInt(document.getElementById("editDishIndex").value, 10);
    const fileInput = document.getElementById("editDishImage"); // Corrected ID
    const file = fileInput.files[0];

    if (file) {
      // Handle new image upload (same as before)
      const reader = new FileReader();

      reader.onload = function (e) {
        dishes[index] = {
          // ... other properties ...
          image: e.target.result,
        };

        saveDishesToLocalStorage();
        displayDishes();
        closePopup("editDishPopup");
      };

      reader.readAsDataURL(file);
    } else {
      // If no new image is selected, use the existing image (same as before)
      dishes[index] = {
        // ... other properties ...
        image: dishes[index].image,
      };

      saveDishesToLocalStorage();
      displayDishes();
      closePopup("editDishPopup");
    }
  });

function deleteDish(index) {
  if (confirm(`Are you sure you want to delete ${dishes[index].name}?`)) {
    dishes.splice(index, 1);
    saveDishesToLocalStorage();
    displayDishes();
  }
}
// Save dishes to local storage
function saveDishesToLocalStorage() {
  localStorage.setItem("dishes", JSON.stringify(dishes));
}
function loadDishesFromLocalStorage() {
  const storedDishes = localStorage.getItem("dishes");
  if (storedDishes) {
    dishes = JSON.parse(storedDishes);
  }
}
