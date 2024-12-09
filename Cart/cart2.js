let selectedAddress = null; // Variable to store the selected address
let restaurantName = ""; // Variable to store the restaurant name
let cartData = {}; // Declare cartData at the top for global access

document.addEventListener('DOMContentLoaded', () => {
    // Get restaurantId from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const restaurantId = urlParams.get('restaurantId');

    if (!restaurantId) {
        console.error('No restaurant ID provided');
        return; // Exit if no restaurant ID is found
    }

    // Load restaurant data from the JSON file directly
    fetch('../restaurants/restaurants.json')
        .then(response => response.json())
        .then(restaurants => {
            const restaurant = restaurants.find(r => r.id === restaurantId);
            
            if (!restaurant) {
                console.error('Restaurant not found');
                return; // Exit if the restaurant is not found
            }

            // Store the restaurant name
            restaurantName = restaurant ? restaurant.name : 'Unknown Restaurant';

            // Retrieve user email from localStorage
            const userData = JSON.parse(localStorage.getItem("userData"));
            const userEmail = userData ? userData.email : 'Unknown User'; // Fallback if userData is not found

            // Initialize cartData with the restaurant name and email
            cartData = {
                restaurantName: restaurantName, // Use the stored restaurant name
                items: [], // Initialize with an empty array or fetch actual cart items
                email: userEmail, // Add email to cartData
                address: selectedAddress // Initially null until an address is selected
            };

            // Print initial cartData
            console.log("Initial Cart Data:", cartData);
        })
        .catch(error => console.error('Error fetching restaurant data:', error));
});

// Function to handle address selection
function selectAddress(button) {
    // Remove 'selected-address' class from all address items
    const allAddressItems = document.querySelectorAll('.address-item');
    allAddressItems.forEach(item => {
        item.classList.remove('selected-address');
    });

    // Add 'selected-address' class to the clicked address item
    const addressItem = button.closest('.address-item');
    addressItem.classList.add('selected-address');

    // Store the selected address details
    const addressDetails = {
        name: addressItem.querySelector('p:nth-child(1)').textContent.split(': ')[1],
        area: addressItem.querySelector('p:nth-child(2)').textContent.split(': ')[1],
        city: addressItem.querySelector('p:nth-child(3)').textContent.split(': ')[1],
        landmark: addressItem.querySelector('p:nth-child(4)').textContent.split(': ')[1],
        pincode: addressItem.querySelector('p:nth-child(5)').textContent.split(': ')[1],
        phone: addressItem.querySelector('p:nth-child(6)').textContent.split(': ')[1],
    };

    selectedAddress = addressDetails; // Store the selected address

    // Update cartData with the selected address
    cartData.address = selectedAddress; // Include the selected address

    // Print actual cart data after the address is selected
    console.log("Cart Data after address selection:", cartData);
}

// Function to load addresses from MongoDB
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
                    <button class="selectButton" onclick="selectAddress(this)">Select</button>
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

// Call loadAddresses on page load
document.addEventListener("DOMContentLoaded", loadAddresses);