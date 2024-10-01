let order = [];
let dishes = [];
// Initialize the order ID (will load from localStorage if exists)
let nextOrderId = 1;

let customers = [];
let nextCustomerId = 1;

// Initialize the page once the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  loadDishes();
  displayDishes();
  loadOrderIdFromLocalStorage();
  loadUserDetails();
});

// Function to load dishes from localStorage or initialize with an empty array
function loadDishes() {
  const storedDishes = localStorage.getItem("dishes");
  dishes = storedDishes ? JSON.parse(storedDishes) : [];
}

// Function to display dishes, filtered by category (default is "all")
function displayDishes(category = "all") {
  const dishesContainer = document.getElementById("dishes-container");
  dishesContainer.innerHTML = ""; // Clear previous dishes

  // Filter the dishes based on the selected category
  const filteredDishes =
    category === "all"
      ? dishes
      : dishes.filter((dish) => dish.category === category);

  // Create and display each dish card
  filteredDishes.forEach((dish) => {
    const dishElement = document.createElement("div");
    dishElement.classList.add("dish-card");
    dishElement.innerHTML = `
      <img src="${dish.image}" alt="${dish.name}" />
      <h3>${dish.name}</h3>
      <p>Rs ${dish.price}</p>
    `;

    // Add the dish to the order when clicked
    dishElement.addEventListener("click", () => {
      addToOrder(dish.name, dish.price);
    });
    dishesContainer.appendChild(dishElement);
  });
}

// Search dishes by name
function searchDishes() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  const filteredDishes = dishes.filter((dish) =>
    dish.name.toLowerCase().includes(searchTerm)
  );
  displayDishes("all"); // Re-display all dishes that match the search
}

// Add a dish to the order
function addToOrder(dishName, price) {
  const existingOrderItem = order.find((item) => item.name === dishName);

  // If the dish is already in the order, increase the quantity, otherwise add it
  if (existingOrderItem) {
    existingOrderItem.quantity++;
  } else {
    order.push({ name: dishName, price: price, quantity: 1 });
  }
  updateOrderSummary();
}

// Update the order summary displayed on the screen
function updateOrderSummary() {
  const orderList = document.getElementById("orderList");
  orderList.innerHTML = ""; // Clear previous order items

  let total = 0;
  order.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${item.name} x${item.quantity} - Rs ${(
      item.price * item.quantity
    ).toFixed(2)}`;
    orderList.appendChild(listItem);
    total += item.price * item.quantity;
  });

  document.getElementById("totalAmount").textContent = `Rs ${total.toFixed(2)}`;
}

// Checkout the order and save order and user details
function checkoutOrder() {
  if (order.length === 0) {
    alert("Your order is empty!");
    return;
  }

  const customerName = document.getElementById("customerName").value.trim();
  const mobileNumber = document.getElementById("mobileNumber").value.trim();

  // Ensure the user enters valid name and mobile number
  if (!customerName || !mobileNumber) {
    alert("Please enter your name and mobile number.");
    return;
  }
  // if (mobileNumber.length != 10) {
  //   alert("Please enter Valid mobile number");
  //   return;
  // }
  saveUserDetailsToLocalStorage();

  // Create and save the order details
  const orderDetails = {
    id: nextOrderId,
    items: order,
    userName: customerName,
    mobileNumber: mobileNumber,
    total: parseFloat(
      document.getElementById("totalAmount").textContent.replace("Rs", "")
    ),
    timestamp: new Date().toLocaleString(),
  };

  saveOrderDetailsToLocalStorage(orderDetails);

  // Increment the order ID and save it
  nextOrderId++;
  saveOrderIdToLocalStorage();

  // Display the bill and reset the order
  displayBill(orderDetails);
  resetOrder();
}

// Reset the order details after checkout
function resetOrder() {
  order = [];
  updateOrderSummary();
  document.getElementById("customerName").value = "";
  document.getElementById("mobileNumber").value = "";
}

// Save user details to localStorage with error handling
function saveUserDetailsToLocalStorage() {
  try {
    const customerName = document.getElementById("customerName").value;
    const mobileNumber = document.getElementById("mobileNumber").value;

    if (!customerName || !mobileNumber) {
      alert("Please enter all required details.");
      return;
    }

    const newCustomer = {
      id: nextCustomerId, // Use nextCustomerId for a unique ID
      name: customerName,
      mobile: mobileNumber,
    };

    customers.push(newCustomer); // Add the new customer to the array
    nextCustomerId++; // Increment customer ID for the next customer
    saveCustomersToLocalStorage(); // Save the updated customers array to localStorage
    alert("User details saved successfully!");
  } catch (error) {
    alert("Failed to save user details. Please try again.");
    console.error("Error saving user details:", error);
  }
}

// Save the customers array to localStorage
function saveCustomersToLocalStorage() {
  localStorage.setItem("customers", JSON.stringify(customers));
}

// Load user details from localStorage (for pre-filling fields, if needed)
function loadUserDetails() {
  const storedUserDetails = loadCustomersFromLocalStorage();
  if (storedUserDetails && storedUserDetails.length > 0) {
    document.getElementById("customerName").value = storedUserDetails[0].name;
    document.getElementById("mobileNumber").value = storedUserDetails[0].mobile;
  }
}

// Load customers from localStorage and update nextCustomerId
function loadCustomersFromLocalStorage() {
  const storedCustomers = localStorage.getItem("customers");
  if (storedCustomers) {
    customers = JSON.parse(storedCustomers);
    // Update nextCustomerId based on loaded data
    if (customers.length > 0) {
      nextCustomerId = Math.max(...customers.map((c) => c.id)) + 1;
    }
  }
  return customers;
}

// Call this function to initialize customer data when the page loads
window.onload = function () {
  loadCustomersFromLocalStorage();
};

// Save order details to localStorage
function saveOrderDetailsToLocalStorage(orderDetails) {
  let orderHistory = loadOrderDetailsFromLocalStorage();
  orderHistory.push(orderDetails);
  localStorage.setItem("orderHistory", JSON.stringify(orderHistory));
  console.log("Order saved:", orderDetails);
}

// Load order details from localStorage
function loadOrderDetailsFromLocalStorage() {
  const storedOrderDetails = localStorage.getItem("orderHistory");
  return storedOrderDetails ? JSON.parse(storedOrderDetails) : [];
}

// Save the next order ID to localStorage
function saveOrderIdToLocalStorage() {
  localStorage.setItem("nextOrderId", nextOrderId);
}

// Load the next order ID from localStorage
function loadOrderIdFromLocalStorage() {
  const storedOrderId = localStorage.getItem("nextOrderId");
  if (storedOrderId) {
    nextOrderId = parseInt(storedOrderId, 10);
  }
}

// Display the bill in a popup
function displayBill(orderDetails) {
  const billDetailsDiv = document.getElementById("billDetails");
  billDetailsDiv.innerHTML = `
    <p>Order ID: ${orderDetails.id}</p>
    <p>Customer: ${orderDetails.userName}</p>
    <p>Mobile: ${orderDetails.mobileNumber}</p>
    <p>Time: ${orderDetails.timestamp}</p>
  `;

  const billItemsList = document.getElementById("billItems");
  billItemsList.innerHTML = "";
  orderDetails.items.forEach((item) => {
    billItemsList.innerHTML += `
      <li>${item.name} x${item.quantity} - Rs ${(
      item.price * item.quantity
    ).toFixed(2)}</li>
    `;
  });
  billItemsList.innerHTML += `<li class="total">Total: Rs ${orderDetails.total.toFixed(
    2
  )}</li>`;

  document.getElementById("billPopup").style.display = "block";
}

// Print the bill
function printBill() {
  window.print();
}

// Close the popup
function closePopup(popupId) {
  document.getElementById(popupId).style.display = "none";
}

// Category filtering for dishes
document.querySelectorAll(".category").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(".category.active").classList.remove("active");
    button.classList.add("active");
    const category = button.getAttribute("data-category");
    displayDishes(category);
  });
});
