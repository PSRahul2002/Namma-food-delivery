document.addEventListener('DOMContentLoaded', () => {
    checkSignInStatus();
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
            updateCartUI(); // Initialize cart UI on page load
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
                                    data-item-price="${item.price}">
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
        const cartItem = getCartItem(itemId);
        if (cartItem) {
            addToCartBtn.style.display = 'none';
            quantityControls.style.display = 'flex';
            quantitySpan.textContent = cartItem.quantity;
        } else {
            quantitySpan.textContent = '0'; // Set to 0 if not in cart
            addToCartBtn.style.display = 'block';
            quantityControls.style.display = 'none';
        }

        addToCartBtn.addEventListener('click', () => {
            const itemId = addToCartBtn.dataset.itemId;
            const itemName = addToCartBtn.dataset.itemName;
            const itemPrice = parseFloat(addToCartBtn.dataset.itemPrice);

            addToCart(itemId, itemName, itemPrice);
            addToCartBtn.style.display = 'none';
            quantityControls.style.display = 'flex';
            quantitySpan.textContent = '1'; // Set to 1 when first added
            updateCartUI();
        });

        decreaseBtn.addEventListener('click', () => {
            const itemId = addToCartBtn.dataset.itemId;
            const currentQuantity = parseInt(quantitySpan.textContent);
            
            if (currentQuantity > 1) {
                updateCartItemQuantity(itemId, currentQuantity - 1);
                quantitySpan.textContent = (currentQuantity - 1).toString();
            } else {
                removeFromCart(itemId);
                quantityControls.style.display = 'none';
                addToCartBtn.style.display = 'block';
                quantitySpan.textContent = '0';
            }
            updateCartUI();
        });

        increaseBtn.addEventListener('click', () => {
            const itemId = addToCartBtn.dataset.itemId;
            const currentQuantity = parseInt(quantitySpan.textContent);
            const newQuantity = currentQuantity + 1;
            updateCartItemQuantity(itemId, newQuantity);
            quantitySpan.textContent = newQuantity.toString();
            updateCartUI();
        });
    });
}

function getCartItem(itemId) {
    const cart = getCart();
    return cart.find(item => item.id === itemId);
}

function updateCartUI() {
    const cart = getCart();
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

function addToCart(itemId, itemName, itemPrice) {
    const cart = getCart();
    
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
    
    saveCart(cart);
    updateCartUI();
}

function updateCartItemQuantity(itemId, newQuantity) {
    const cart = getCart();
    const item = cart.find(item => item.id === itemId);
    if (item) {
        item.quantity = newQuantity;
        saveCart(cart);
        updateCartUI();
    }
}

function removeFromCart(itemId) {
    const cart = getCart();
    const updatedCart = cart.filter(item => item.id !== itemId);
    saveCart(updatedCart);
    updateCartUI();
}

function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function checkSignInStatus() {
    const userData = localStorage.getItem('userData');
    
    if (!userData) {
        // Redirect to login page if user is not signed in
        window.location.href = "../Login/login.html"; // Or update to your actual login page path
    }
}