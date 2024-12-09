document.addEventListener("DOMContentLoaded", function () {
    checkSignInStatus();
    
    const addAddressButton = document.getElementById("addAddressButton");
    const addAddressForm = document.getElementById("addAddressForm");
    const cancelAddAddressButton = document.getElementById("cancelAddAddress");

    // Toggle the add address form
    addAddressButton.addEventListener("click", function() {
        addAddressForm.style.display = "block";
    });

    // Cancel button to hide form
    cancelAddAddressButton.addEventListener("click", function() {
        addAddressForm.style.display = "none";
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

    // Handle address form submission
    document.getElementById("addressForm").addEventListener("submit", function (event) {
        event.preventDefault();

        // Gather form inputs
        const name = document.getElementById("addressName").value;
        const city = document.getElementById("addressCity").value;
        const area = document.getElementById("addressArea").value;
        const street = document.getElementById("addressStreet").value;
        const landmark = document.getElementById("addressLandmark").value;
        const pincode = document.getElementById("addressPincode").value;
        const phone = document.getElementById("addressPhone").value;
        const email = JSON.parse(localStorage.getItem("userData")).email;

        const newAddress = { 
            email: email, 
            address: { name, city, area, street, landmark, pincode, phone }
        };

        // Add the address
        fetch("http://127.0.0.1:8000/api/add_address", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newAddress)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                loadAddresses(); // Reload addresses
                addAddressForm.style.display = "none"; // Hide the form
                document.getElementById("addressForm").reset(); // Reset the form
            } else {
                alert("Error adding address: " + data.message);
            }
        })
        .catch(error => console.error("Error adding address:", error));
    });

    // Function to load addresses from MongoDB
    loadAddresses();

    // Function to delete an address
    window.deleteAddress = function (addressId) {
        const email = JSON.parse(localStorage.getItem("userData")).email;

        fetch(`http://127.0.0.1:8000/api/delete_address/${addressId}?email=${email}`, {
            method: "DELETE",
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                loadAddresses(); // Reload addresses
            } else {
                alert("Error deleting address: " + data.message);
            }
        })
        .catch(error => console.error("Error deleting address:", error));
    };

    // Logout functionality
    document.getElementById("logoutButton").addEventListener("click", function() {
        localStorage.removeItem("userData");
        window.location.href = "../Login/login.html";
    });
});

// Redirect user if not logged in
function checkSignInStatus() {
    const userData = localStorage.getItem('userData');
    if (!userData) {
        window.location.href = "../Login/login.html";
    }
}

function loadAddresses() {
    const email = JSON.parse(localStorage.getItem("userData")).email;

    fetch(`http://127.0.0.1:8000/api/get_addresses?email=${email}`)
        .then(response => response.json())
        .then(data => {
            const addresses = data.addresses || [];
            const addressList = document.getElementById("addressList");

            // Clear existing addresses
            addressList.innerHTML = "";

            addresses.forEach(address => {
                const addressItem = document.createElement("div");
                addressItem.className = "address-item";
                addressItem.innerHTML = `
                    <p>Name: ${address.name}</p>
                    <p>Area: ${address.area}</p>
                    <p>City: ${address.city}</p>
                    <p>Landmark: ${address.landmark}</p>
                    <p>Pincode: ${address.pincode}</p>
                    <p>Phone: ${address.phone}</p>
                    <button onclick="deleteAddress('${address._id}')">Delete</button>
                `;
                addressList.appendChild(addressItem);
            });

            if (addresses.length >= 5) {
                addAddressButton.style.display = "none";
            } else {
                addAddressButton.style.display = "block";
            }
        })
        .catch(error => console.error("Error loading addresses:", error));
}


// export {deleteAddress}