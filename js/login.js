// Form and error message references
const form = document.querySelector("form");
const errorMsg = document.getElementById("error-msg");

// Handle form submission
form.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent default form submission

  // Get the username and password values
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Simple login check
  if (username === "admin" && password === "123") {
    // Successful login - redirect to dashboard
    window.location.href = "dashboard.html"; // Replace with your actual dashboard page
  } else {
    // Invalid credentials - show error message
    errorMsg.textContent = "Invalid username or password!";
    errorMsg.style.display = "block";
  }
});
