document.addEventListener("DOMContentLoaded", function () {
    
    checkSignInStatus();
    
    const addAddressButton = document.getElementById("addAddressButton");
    const addAddressForm = document.getElementById("addAddressForm");
    const cancelAddAddressButton = document.getElementById("cancelAddAddress");

    // Add Address button click event
    addAddressButton.addEventListener("click", function() {
        console.log("Add Address button clicked");
        // Toggle visibility by changing display style
        if (addAddressForm.style.display === "none" || addAddressForm.style.display === "") {
            addAddressForm.style.display = "block"; // Show the form
        } else {
            addAddressForm.style.display = "none"; // Hide the form
        }
    });

    // Cancel button click event
    cancelAddAddressButton.addEventListener("click", function() {
        console.log("Cancel Add Address button clicked");
        addAddressForm.style.display = "none"; // Hide the form
    });
    
    // Load user data and update UI
    let userData = localStorage.getItem("userData");
    if (userData) {
        userData = JSON.parse(userData);
        const name = userData.name;
        const email = userData.email;
        document.getElementById("userName").innerHTML = name;
        document.getElementById("userEmail").innerHTML = email;
    }

    // Load addresses when the page loads
    loadAddresses();

    // Function to add a new address
    document.getElementById("addressForm").addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent form submission

        // Get the form input values
        const name = document.getElementById("addressName").value;
        const city = document.getElementById("addressCity").value;
        const area = document.getElementById("addressArea").value;
        const street = document.getElementById("addressStreet").value;
        const landmark = document.getElementById("addressLandmark").value;
        const pincode = document.getElementById("addressPincode").value;
        const phone = document.getElementById("addressPhone").value;

        // Debugging: Log the input values
        console.log("Form Input Values:", { name, city, area, street, landmark, pincode, phone });

        // Get user's email from localStorage
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
                phone 
            } 
        };

        // Debugging: Check new address data
        console.log("New Address Data:", newAddress);

        // Add the address to the backend
        fetch("http://127.0.0.1:8000/api/add_address", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newAddress)
        })
            .then(response => {
                // Check if the response is okay
                if (!response.ok) {
                    return response.json().then(err => { throw new Error(err.message || "Network response was not ok"); });
                }
                return response.json();
            })
            .then(data => {
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
            .catch(error => console.error("Error adding address:", error));
    });

    // Function to load addresses from MongoDB and display them
    function loadAddresses() {
        // Get the user's email from localStorage
        const email = JSON.parse(localStorage.getItem("userData")).email;

        // Fetch addresses from the backend
        fetch('http://127.0.0.1:8000/api/get_addresses?email=${email}')
            .then(response => response.json())
            .then(data => {
                const addresses = data.addresses || [];
                const addressList = document.getElementById("addressList");

                // Clear existing address list
                addressList.innerHTML = "";

                // Populate the address list dynamically
                addresses.forEach(address => {
                    const addressItem = document.createElement("div");
                    addressItem.className = "address-item";
                    const addressHTML = `
                        <div>
                            <p>Area: ${address.area}</p>
                            <p>City: ${address.city}</p>
                            <p>Landmark: ${address.landmark}</p>
                            <p>Pincode: ${address.pincode}</p>
                        </div>
                    `;
                    addressItem.innerHTML = addressHTML;
                    addressList.appendChild(addressItem);
                });

                 // Hide the "Add Address" button if there are 5 or more addresses
                const addAddressButton = document.getElementById("addAddressButton");
                if (addresses.length >= 5) {
                    addAddressButton.style.display = "none";
                } else {
                    addAddressButton.style.display = "block";
                }
            })
            .catch(error => console.error("Error loading addresses:", error));
    }

    // Function to delete an address
    window.deleteAddress = function(addressId) {
        const email = JSON.parse(localStorage.getItem("userData")).email; // Get the user's email from localStorage

        // Send DELETE request to the API
        fetch('http://127.0.0.1:8000/api/delete_address/${addressId}?email=${email}', {
            method: "DELETE",
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    //alert(data.message); // Show success message
                    loadAddresses(); // Reload the addresses list
                } else {
                    alert("Error deleting address: " + data.detail);
                }
            })
            .catch((error) => console.error("Error deleting address:", error));
    }

    // Logout functionality
    document.getElementById("logoutButton").addEventListener("click", function() {
        console.log("Logging out..."); // Debugging
        // Clear user data from localStorage
        localStorage.removeItem("userData");

        // Redirect to the login page or home page
        window.location.href = "../Login/login.html"; // Change this to your actual login page
    });
});

function checkSignInStatus() {
    const userData = localStorage.getItem('userData');
    
    if (!userData) {
        // Redirect to login page if user is not signed in
        window.location.href = "../Login/login.html"; // Or update to your actual login page path
    }
}

// // Call this function on page load (for example, on every protected page)
// checkSignInStatus();