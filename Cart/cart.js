let selectedAddress = null;

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
        // const name = userData.name;
        const email = userData.email;

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

    
});

// Redirect user if not logged in
function checkSignInStatus() {
    const userData = localStorage.getItem('userData');
    if (!userData) {
        window.location.href = "../Login/login.html";
    }
}

// Function to retrieve cart data from local storage
function getCartData() {
    const cart = localStorage.getItem('cart');
    if (!cart) {
        console.error('No cart data found in local storage.');
        return null;
    }
    return JSON.parse(cart);
}

// Function to render cart items dynamically
function renderCartItems(cartData) {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = ''; // Clear any existing content

    // Check if there are items in the cart
    if (cartData.items.length === 0) {
        cartItemsContainer.innerHTML = `<p>Your cart is empty.</p>`;
        return;
    }

    // Render each item
    cartData.items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.innerHTML = `
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-quantity">x${item.quantity}</div>
            <div class="cart-item-price">₹${(item.price * item.quantity).toFixed(2)}</div>
        `;
        cartItemsContainer.appendChild(itemElement);
    });
}

// Function to calculate and display the total amount
function renderCartTotal(cartData) {
    const totalAmountElement = document.getElementById('total-amount');
    const totalAmount = cartData.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    totalAmountElement.textContent = `₹${totalAmount.toFixed(2)}`;
}

// Call functions to render data
document.addEventListener('DOMContentLoaded', () => {
    loadAddresses();

    const allCartData = getCartData();
    if (!allCartData) return; // Stop if no cart data found

    // Assuming only one restaurant cart is active
    const restaurantId = Object.keys(allCartData)[0];

    // Load restaurant data from the JSON file directly
    fetch('../restaurants/restaurants.json')
        .then(response => response.json())
        .then(restaurants => {
            const restaurant = restaurants.find(r => r.id === restaurantId);

            const userData = JSON.parse(localStorage.getItem("userData"));
            const userEmail = userData ? userData.email : 'Unknown User'; // Fallback if userData is not found
            const cartData = {
                restaurantName: restaurant ? `${restaurant.name}` : 'Unknown Restaurant',
                items: allCartData[restaurantId],
                email: userEmail, // Add email to cartData
                address: selectedAddress// Include the selected address
            };

            // Render restaurant name, cart items, total, and address options
            document.getElementById('restaurant-name').textContent = cartData.restaurantName;
            renderCartItems(cartData);
            renderCartTotal(cartData);
            
            console.log("Cart Data:", cartData);
        });
});

// Handle Checkout
document.getElementById('checkout-btn').addEventListener('click', () => {
    const specialInstructions = document.getElementById('special-instructions').value;
    const selectedAddressId = document.getElementById('address-select').value;

    // Log the data for demo purposes
    console.log('Special Instructions:', specialInstructions);
    console.log('Selected Address ID:', selectedAddressId);

    // For now, just show a confirmation message
    alert('Proceeding to checkout with the selected address and items.');

    // Here, you can send the data to your back-end for order processing
});


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
                    <button id = "selectButton" class="selectButton" onclick="selectAddress(this)">Select</button>
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

    const addressDetails = {
        name: addressItem.querySelector('p:nth-child(1)').textContent.split(': ')[1],
        area: addressItem.querySelector('p:nth-child(2)').textContent.split(': ')[1],
        city: addressItem.querySelector('p:nth-child(3)').textContent.split(': ')[1],
        landmark: addressItem.querySelector('p:nth-child(4)').textContent.split(': ')[1],
        pincode: addressItem.querySelector('p:nth-child(5)').textContent.split(': ')[1],
        phone: addressItem.querySelector('p:nth-child(6)').textContent.split(': ')[1],
    };

    selectedAddress = addressDetails; // Store the selected address
    cartData.address = selectedAddress; // Include the selected address
}