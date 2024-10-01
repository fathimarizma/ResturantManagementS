let orders = []; // Global orders array to store the orders from localStorage

// Load and display orders when the page loads
document.addEventListener("DOMContentLoaded", () => {
  loadOrderDetailsFromLocalStorage(); // Load stored orders from localStorage
  displayOrders(); // Display the orders in the table
});

// Load order details from localStorage
function loadOrderDetailsFromLocalStorage() {
  const storedOrders = localStorage.getItem("orderHistory");
  if (storedOrders) {
    orders = JSON.parse(storedOrders); // Parse and load orders from localStorage
  } else {
    orders = []; // Default to an empty array if no orders exist
  }
}

const orderTableBody = document
  .getElementById("orderTable")
  .getElementsByTagName("tbody")[0];

// Display Orders in the table
function displayOrders() {
  orderTableBody.innerHTML = ""; // Clear the table

  orders.forEach((order) => {
    const row = orderTableBody.insertRow();
    row.insertCell().textContent = order.id; // Display Order ID
    row.insertCell().textContent = order.userName; // Display Customer Name
    row.insertCell().textContent = order.mobileNumber; // Display Mobile Number
    row.insertCell().textContent = `Rs ${order.total.toFixed(2)}`; // Display Total Amount
    row.insertCell().textContent = order.timestamp; // Display Order Date

    // Add action buttons for viewing details and deleting orders
    const actionsCell = row.insertCell();
    actionsCell.innerHTML = `
        <a onclick="viewOrderDetails(${order.id})" class="btn-view">View Details</button>
        <a onclick="deleteOrder(${order.id})" class = "btn-delete">Delete</a>`;
  });
}
// View Order Details in a Popup
function viewOrderDetails(orderId) {
  const order = orders.find((order) => order.id === orderId);
  if (order) {
    let orderDetailsHTML = `
          <h2>Order Details (ID: ${order.id})</h2>
          <p><strong>Customer:</strong> ${order.userName}</p>
          <p><strong>Mobile:</strong> ${order.mobileNumber}</p>
          <p><strong>Date:</strong> ${order.timestamp}</p>
          <p><strong>Total:</strong> Rs ${order.total.toFixed(2)}</p>
          <h3>Items:</h3>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>`;

    // Display each item in the order
    order.items.forEach((item) => {
      orderDetailsHTML += `
            <tr>
              <td>${item.name}</td>
              <td>Rs ${item.price.toFixed(2)}</td> <div class="btn-group">
              <td>${item.quantity}</td>
              <td>Rs ${(item.price * item.quantity).toFixed(2)}</td> 
            </tr>`;
    });

    orderDetailsHTML += `</tbody></table>`;

    // Set the popup content and display it
    document.getElementById("orderDetails").innerHTML = orderDetailsHTML;
    document.getElementById("orderDetailsPopup").style.display = "block";
  }
}

// Close the order details popup
function closeOrderDetailsPopup() {
  document.getElementById("orderDetailsPopup").style.display = "none";
}

// Delete an order by ID
function deleteOrder(orderId) {
  if (confirm("Are you sure you want to delete this order?")) {
    // Filter out the deleted order
    orders = orders.filter((order) => order.id !== orderId);
    localStorage.setItem("orderHistory", JSON.stringify(orders)); // Update localStorage
    displayOrders(); // Re-render the table after deletion
  }
}

// Filter Orders by Selected Month
function filterOrdersByMonth() {
  const selectedMonth = document.getElementById("monthFilter").value;
  if (!selectedMonth) {
    alert("Please select a month");
    return;
  }

  // Filter orders by the selected month in the timestamp (YYYY-MM)
  const filteredOrders = orders.filter((order) =>
    order.timestamp.startsWith(`2023-${selectedMonth}`)
  );
  displayFilteredOrders(filteredOrders);
}

// Display Filtered Orders in the table
function displayFilteredOrders(filteredOrders) {
  orderTableBody.innerHTML = ""; // Clear the table

  filteredOrders.forEach((order) => {
    const row = orderTableBody.insertRow();
    row.insertCell().textContent = order.id; // Display Order ID
    row.insertCell().textContent = order.userName; // Display Customer Name
    row.insertCell().textContent = order.mobileNumber; // Display Mobile Number
    row.insertCell().textContent = `Rs ${order.total.toFixed(2)}`; // Display Total Amount
    row.insertCell().textContent = order.timestamp; // Display Order Date

    // Add action buttons for viewing details and deleting orders
    const actionsCell = row.insertCell();
    actionsCell.innerHTML = `
        <a onclick="viewOrderDetails(${order.id})" class="btn-view">View Details</button>
        <a onclick="deleteOrder(${order.id})" class = "btn-delete">Delete</a>`;
  });
}

// Print Order Report for the current displayed orders
function printOrderReport() {
  window.print(); // Trigger the browser's print dialog
}
