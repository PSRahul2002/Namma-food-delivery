let userData = localStorage.getItem("userData");

// Debugging: Check if userData is retrieved
console.log("Retrieved userData:", userData);

// Check if userData is null
if (!userData) {
  // Redirect to login page if userData is not found
  console.warn("No user data found, redirecting to login.");
  window.location.href = "../Login/login.html"; // Change this to your actual login page
} else {
  userData = JSON.parse(userData);
  console.log("Parsed userData:", userData); // Debugging: Check parsed userData

  const name = userData.name;
  const email = userData.email;

  document.getElementById("userName").innerHTML = name;
  document.getElementById("userEmail").innerHTML = email;

  document.addEventListener("DOMContentLoaded", function () {
    loadAddresses(); // Load addresses when the page loads
  });

  // Function to add a new address
  document
    .getElementById("addressForm")
    .addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent form submission

      // Get the form input values
      const name = document.getElementById("addressName").value;
      const city = document.getElementById("addressCity").value;
      const area = document.getElementById("addressArea").value;
      const street = document.getElementById("addressStreet").value;
      const landmark = document.getElementById("addressLandmark").value;
      const pincode = document.getElementById("addressPincode").value;
      const phone = document.getElementById("addressPhone").value;

      // Get user's email from localStorage
      const userData = JSON.parse(localStorage.getItem("userData"));
      const email = userData.email;

      // Address object, wrapping the actual address data inside the 'address' field
      const newAddress = {
        email: email,
        address: {
          name,
          city,
          area,
          street,
          landmark,
          pincode,
          phone,
        },
      };

      // Debugging: Check new address data
      console.log("New Address Data:", newAddress);

      // Add the address to the backend
      fetch("http://127.0.0.1:8000/api/add_address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAddress),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Response from add_address:", data); // Debugging response
          if (data.success) {
            // Reload the address list
            loadAddresses();

            // Hide the form and reset the fields
            document.getElementById("addAddressForm").style.display = "none";
            document.getElementById("addressForm").reset();
          } else {
            alert("Error adding address: " + data.message);
          }
        })
        .catch((error) => console.error("Error adding address:", error));
    });

  // Function to load addresses from MongoDB and display them
  function loadAddresses() {
    // Get the user's email from localStorage
    const email = JSON.parse(localStorage.getItem("userData")).email;
  
    // Fetch addresses from the backend
    fetch(`http://127.0.0.1:8000/api/get_addresses?email=${email}`)
      .then((response) => response.json())
      .then((data) => {
        const addresses = data.addresses || [];
        const addressList = document.getElementById("addressList");
  
        // Clear existing address list
        addressList.innerHTML = "";
  
        // Populate the address list dynamically
        addresses.forEach((address) => {
          const addressItem = document.createElement("div");
          addressItem.className = "address-item";
          const addressHTML = `
              <div>
                  <p>Name: <strong>${address.name}</strong></p>
                  <p>Street: ${address.street}</p>
                  <p>Area: ${address.area}</p>
                  <p>City: ${address.city}</p>
              </div>
          `;
          addressItem.innerHTML = addressHTML;
          addressList.appendChild(addressItem);
        });
      })
      .catch((error) => console.error("Error loading addresses:", error));
  }

  // Function to delete an address
  function deleteAddress(addressId) {
    const email = JSON.parse(localStorage.getItem("userData")).email; // Get the user's email from localStorage

    // Send DELETE request to the API
    fetch(
      'http://127.0.0.1:8000/api/delete_address/${addressId}?email=${email}',
      {
        method: "DELETE",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // alert(data.message); // Show success message
          loadAddresses(); // Reload the addresses list
        } else {
          alert("Error deleting address: " + data.detail);
        }
      })
      .catch((error) => console.error("Error deleting address:", error));
  }

  // Function to toggle the visibility of the add address form
  document
    .getElementById("addAddressButton")
    .addEventListener("click", function () {
      const form = document.getElementById("addAddressForm");
      console.log("Add Address Button Clicked"); // Debugging log
      // Toggle visibility
      if (form.style.display === "none" || form.style.display === "") {
        form.style.display = "block"; // Show the form
        console.log("Form displayed"); // Debugging log
      } else {
        form.style.display = "none"; // Hide the form
        console.log("Form hidden"); // Debugging log
      }
    });

  // Cancel button functionality to hide the form
  document
    .getElementById("cancelAddAddress")
    .addEventListener("click", function () {
      const form = document.getElementById("addAddressForm");
      form.style.display = "none"; // Hide the form when cancel button is clicked
    });

  // Logout functionality
  document.getElementById("logoutButton").addEventListener("click", function () {
      // Clear user data from localStorage
      localStorage.removeItem("userData");

      // Redirect to the login page or home page
      window.location.href = "../Login/login.html"; // Change this to your actual login page
    });
}

export function loadAddresses() {
  // Get the user's email from localStorage
  const email = JSON.parse(localStorage.getItem("userData")).email;

  // Fetch addresses from the backend
  fetch(`http://127.0.0.1:8000/api/get_addresses?email=${email}`)
    .then((response) => response.json())
    .then((data) => {
      const addresses = data.addresses || [];
      const addressList = document.getElementById("addressList");

      // Clear existing address list
      addressList.innerHTML = "";

      // Populate the address list dynamically
      addresses.forEach((address) => {
        const addressItem = document.createElement("div");
        addressItem.className = "address-item";
        const addressHTML = `
            <div>
                <p>Name: <strong>${address.name}</strong></p>
                <p>Street: ${address.street}</p>
                <p>Area: ${address.area}</p>
                <p>City: ${address.city}</p>
            </div>
        `;
        addressItem.innerHTML = addressHTML;
        addressList.appendChild(addressItem);
      });
    })
    .catch((error) => console.error("Error loading addresses:", error));
}


export function deleteAddress(addressId) {
  const email = JSON.parse(localStorage.getItem("userData")).email; // Get the user's email from localStorage

  // Send DELETE request to the API
  fetch(
    'http://127.0.0.1:8000/api/delete_address/${addressId}?email=${email}',
    {
      method: "DELETE",
    }
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // alert(data.message); // Show success message
        loadAddresses(); // Reload the addresses list
      } else {
        alert("Error deleting address: " + data.detail);
      }
    })
    .catch((error) => console.error("Error deleting address:", error));
}
