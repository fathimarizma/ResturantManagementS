let customers = [];
let nextCustomerId = 1; // To ensure unique IDs

const customerTable = document
  .getElementById("customerTable")
  .getElementsByTagName("tbody")[0];

// Load customers from local storage on page load
document.addEventListener("DOMContentLoaded", () => {
  loadCustomersFromLocalStorage();
  displayCustomers();
});

function displayCustomers() {
  customerTable.innerHTML = "";

  customers.forEach((customer, index) => {
    const row = customerTable.insertRow();
    const idCell = row.insertCell();
    const nameCell = row.insertCell();
    const mobileCell = row.insertCell();
    const actionsCell = row.insertCell();

    idCell.textContent = customer.id;
    nameCell.textContent = customer.name;
    mobileCell.textContent = customer.mobile;

    actionsCell.innerHTML = `
              <a class="btn-update" onclick="openEditCustomerPopup(${index})">Edit</a>
              <a class="btn-delete" onclick="deleteCustomer(${index})">Delete</a>
          `;
  });
}

function openAddCustomerPopup() {
  // Clear the form fields when opening - good practice
  document.getElementById("customerId").value = nextCustomerId; // Suggest the next ID
  document.getElementById("customerName").value = "";
  document.getElementById("customerMobile").value = "";
  document.getElementById("addCustomerPopup").style.display = "block";
}

function openEditCustomerPopup(index) {
  const customer = customers[index];
  document.getElementById("editCustomerIndex").value = index;
  document.getElementById("editCustomerId").value = customer.id;
  document.getElementById("editCustomerName").value = customer.name;
  document.getElementById("editCustomerMobile").value = customer.mobile;
  document.getElementById("editCustomerPopup").style.display = "block";
}

function closePopup(popupId) {
  document.getElementById(popupId).style.display = "none";
}

// Add Customer Form Submission
document
  .getElementById("addCustomerForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const newCustomer = {
      id: parseInt(document.getElementById("customerId").value, 10),
      name: document.getElementById("customerName").value,
      mobile: document.getElementById("customerMobile").value,
    };

    customers.push(newCustomer);
    nextCustomerId++; // Increment for the next customer
    saveCustomersToLocalStorage();
    displayCustomers();
    closePopup("addCustomerPopup");
  });

// Edit Customer Form Submission
document
  .getElementById("editCustomerForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const index = parseInt(
      document.getElementById("editCustomerIndex").value,
      10
    );
    customers[index] = {
      id: parseInt(document.getElementById("editCustomerId").value, 10), // Update ID if needed
      name: document.getElementById("editCustomerName").value,
      mobile: document.getElementById("editCustomerMobile").value,
    };

    saveCustomersToLocalStorage();
    displayCustomers();
    closePopup("editCustomerPopup");
  });

function deleteCustomer(index) {
  if (confirm(`Are you sure you want to delete this customer?`)) {
    customers.splice(index, 1);
    saveCustomersToLocalStorage();
    displayCustomers();
  }
}

// Save customers to local storage
function saveCustomersToLocalStorage() {
  localStorage.setItem("customers", JSON.stringify(customers));
}

function loadCustomersFromLocalStorage() {
  const storedCustomers = localStorage.getItem("customers");
  if (storedCustomers) {
    customers = JSON.parse(storedCustomers);
    // Update nextCustomerId based on loaded data
    if (customers.length > 0) {
      nextCustomerId = Math.max(...customers.map((c) => c.id)) + 1;
    }
  }
}
