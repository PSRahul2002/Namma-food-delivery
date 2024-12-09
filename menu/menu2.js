document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const restaurantId = urlParams.get('restaurantId');

    if (!restaurantId) {
        console.error('No restaurant ID provided');
        return;
    }

    const cartContainer = document.getElementById('goto-cart'); // Ensure this ID matches your HTML
    if (cartContainer) {
        console.log('Cart button found, adding event listener');
        cartContainer.addEventListener('click', () => {
            console.log('Redirecting to cart page');
            window.location.href = '../Cart/cart.html'; // Update to your actual cart page path
        });
    } else {
        console.error('No element found with ID "goto-cart"');
    }

    fetch('/menu/menu.json')
        .then(response => response.json())
        .then(data => {
            const restaurantMenu = data.find(restaurant => restaurant.restaurantId === restaurantId);
            
            if (!restaurantMenu) {
                console.error('Restaurant menu not found');
                return;
            }

            displayMenu(restaurantMenu);
            updateCartUI(restaurantId); // Initialize cart UI for the specific restaurant
        })
        .catch(error => console.error('Error fetching menu data:', error));
});

function displayMenu(menuData) {
    const menuContainer = document.getElementById('menu-container');
    
    const restaurantInfo = document.createElement('div');
    restaurantInfo.className = 'restaurant-info';
    restaurantInfo.innerHTML = `
        <h1>${menuData.restaurantName}</h1>
        <p>${menuData.description}</p>
    `;
    menuContainer.appendChild(restaurantInfo);

    menuData.categories.forEach(category => {
        const categorySection = document.createElement('div');
        categorySection.className = 'menu-category';
        categorySection.innerHTML = `
            <h2>${category.name}</h2>
            <div class="menu-items">
                ${category.items.map(item => `
                    <div class="menu-item">
                        <h3>${item.name}</h3>
                        <p>${item.description}</p>
                        <p class="price">₹${item.price}</p>
                        <div class="cart-controls">
                            <button class="add-to-cart" 
                                    data-item-id="${item.id}"
                                    data-item-name="${item.name}"
                                    data-item-price="${item.price}"
                                    data-restaurant-id="${menuData.restaurantId}">
                                Add to Cart
                            </button>
                            <div class="quantity-controls" style="display: none;">
                                <button class="decrease-quantity">-</button>
                                <span class="quantity">1</span>
                                <button class="increase-quantity">+</button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        menuContainer.appendChild(categorySection);
    });

    setupCartControls();
}

function setupCartControls() {
    const menuItems = document.querySelectorAll('.menu-item');

    menuItems.forEach(item => {
        const addToCartBtn = item.querySelector('.add-to-cart');
        const quantityControls = item.querySelector('.quantity-controls');
        const decreaseBtn = item.querySelector('.decrease-quantity');
        const increaseBtn = item.querySelector('.increase-quantity');
        const quantitySpan = item.querySelector('.quantity');

        const itemId = addToCartBtn.dataset.itemId;
        const restaurantId = addToCartBtn.dataset.restaurantId;
        const cartItem = getCartItem(restaurantId, itemId);
        
        if (cartItem) {
            addToCartBtn.style.display = 'none';
            quantityControls.style.display = 'flex';
            quantitySpan.textContent = cartItem.quantity;
        } else {
            addToCartBtn.style.display = 'block';
            quantityControls.style.display = 'none';
            quantitySpan.textContent = '0'; // Ensure quantity is reset
        }

        addToCartBtn.addEventListener('click', () => {
            const itemId = addToCartBtn.dataset.itemId;
            const itemName = addToCartBtn.dataset.itemName;
            const itemPrice = parseFloat(addToCartBtn.dataset.itemPrice);
            const newRestaurantId = addToCartBtn.dataset.restaurantId;

            const currentRestaurantId = getCartRestaurantId();

            if (currentRestaurantId && currentRestaurantId !== newRestaurantId) {
                // Alert user if trying to add item from a different restaurant
                const userConfirmed = confirm("You already have items from another restaurant in the cart. Do you want to clear your cart and add this item?");
                if (userConfirmed) {
                    clearCart(); // Clear the current cart
                    addToCart(newRestaurantId, itemId, itemName, itemPrice);
                    addToCartBtn.style.display = 'none';
                    quantityControls.style.display = 'flex';
                    quantitySpan.textContent = '1'; // Update to 1 when first added
                    updateCartUI(newRestaurantId);
                }
            } else {
                addToCart(newRestaurantId, itemId, itemName, itemPrice);
                addToCartBtn.style.display = 'none';
                quantityControls.style.display = 'flex';
                quantitySpan.textContent = '1'; // Update to 1 when first added
                updateCartUI(newRestaurantId);
            }
        });

        decreaseBtn.addEventListener('click', () => {
            const currentQuantity = parseInt(quantitySpan.textContent);
            if (currentQuantity > 1) {
                updateCartItemQuantity(restaurantId, itemId, currentQuantity - 1);
                quantitySpan.textContent = (currentQuantity - 1).toString();
            } else {
                removeFromCart(restaurantId, itemId);
                quantityControls.style.display = 'none';
                addToCartBtn.style.display = 'block';
                quantitySpan.textContent = '0'; // Reset when removed
            }
            updateCartUI(restaurantId);
        });

        increaseBtn.addEventListener('click', () => {
            const currentQuantity = parseInt(quantitySpan.textContent);
            updateCartItemQuantity(restaurantId, itemId, currentQuantity + 1);
            quantitySpan.textContent = (currentQuantity + 1).toString();
            updateCartUI(restaurantId);
        });
    });
}

function getCartItem(restaurantId, itemId) {
    const cart = getCart(restaurantId);
    return cart.find(item => item.id === itemId);
}

function updateCartUI(restaurantId) {
    const cart = getCart(restaurantId);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Update cart counter
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) cartCount.textContent = totalItems || '0';

    // Update all cart total displays
    const cartTotals = document.querySelectorAll('.cart-total');
    cartTotals.forEach(total => {
        total.textContent = `₹${totalPrice.toFixed(2)}`;
    });
}

// function addToCart(restaurantId, itemId, itemName, itemPrice) {
//     const cart = getCart(restaurantId); // Get the cart for this restaurant
    
//     const existingItem = cart.find(item => item.id === itemId);
    
//     if (existingItem) {
//         existingItem.quantity += 1; // Update quantity if the item already exists
//     } else {
//         // Add new item with the restaurantId
//         cart.push({
//             id: itemId,
//             name: itemName,
//             price: parseFloat(itemPrice), // Ensure price is stored as a number
//             quantity: 1,
//             restaurantId: restaurantId // Include restaurantId in the item
//         });
//     }
    
//     saveCart(restaurantId, cart); // Save the updated cart back to local storage
//     updateCartUI(restaurantId); // Update the UI
// }


function addToCart(restaurantId, itemId, itemName, itemPrice) {
    const cart = getCart(restaurantId);
    
    const existingItem = cart.find(item => item.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: itemId,
            name: itemName,
            price: parseFloat(itemPrice), // Ensure price is stored as a number
            quantity: 1
        });
    }
    
    saveCart(restaurantId, cart);
    updateCartUI(restaurantId);
}

function updateCartItemQuantity(restaurantId, itemId, newQuantity) {
    const cart = getCart(restaurantId);
    const item = cart.find(item => item.id === itemId);
    if (item) {
        item.quantity = newQuantity;
        saveCart(restaurantId, cart);
        updateCartUI(restaurantId);
    }
}

function removeFromCart(restaurantId, itemId) {
    const cart = getCart(restaurantId);
    const updatedCart = cart.filter(item => item.id !== itemId);
    saveCart(restaurantId, updatedCart);
    updateCartUI(restaurantId);
}


function getCart(restaurantId) {
    const cart = localStorage.getItem('cart');
    const parsedCart = cart ? JSON.parse(cart) : {};
    return parsedCart[restaurantId] || [];
}

function saveCart(restaurantId, cart) {
    const storedCart = localStorage.getItem('cart');
    const parsedCart = storedCart ? JSON.parse(storedCart) : {};
    parsedCart[restaurantId] = cart;
    localStorage.setItem('cart', JSON.stringify(parsedCart));
}

function getCartRestaurantId() {
    const cart = localStorage.getItem('cart');
    if (!cart) return null;

    const parsedCart = JSON.parse(cart);
    const restaurantIds = Object.keys(parsedCart);
    return restaurantIds.length > 0 ? restaurantIds[0] : null;
}

function clearCart() {
    localStorage.removeItem('cart');
    updateCartUI(null); // Update UI for no cart
}

// Return the first restaurant ID
function getCartRestaurantId() {
    const cart = localStorage.getItem('cart');
    if (!cart) return null;

    const parsedCart = JSON.parse(cart);
    const restaurantIds = Object.keys(parsedCart);
    return restaurantIds.length > 0 ? restaurantIds[0] : null; 
}


// Function to retrieve and log cart items from local storage
function printCartItems() {
    // Retrieve the cart from local storage
    const cart = localStorage.getItem('cart');

    // Check if the cart exists
    if (cart) {
        // Parse the cart JSON string into an object
        const cartItems = JSON.parse(cart);
        
        // Log the cart items to the console
        console.log("Cart Items:", cartItems);
    } else {
        console.log("No items in the cart.");
    }
}