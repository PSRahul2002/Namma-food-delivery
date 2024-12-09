// Sample data for past orders
document.addEventListener('DOMContentLoaded', (event) => {
    checkSignInStatus();
});

const orders = [
    {
        id: 1,
        date: '2023-10-01',
        items: [
            { name: 'Pizza', quantity: 2, price: 500 },
            { name: 'Pasta', quantity: 1, price: 300 }
        ],
        total: 1300
    },
    {
        id: 2,
        date: '2023-09-15',
        items: [
            { name: 'Burger', quantity: 1, price: 200 },
            { name: 'Fries', quantity: 2, price: 100 }
        ],
        total: 400
    },
    {
        id: 3,
        date: '2023-08-20',
        items: [
            { name: 'Sushi', quantity: 3, price: 600 },
            { name: 'Miso Soup', quantity: 1, price: 150 }
        ],
        total: 2250
    }
];

// Function to display orders
function displayOrders() {
    const ordersList = document.getElementById('ordersList');
    orders.forEach(order => {
        const orderDiv = document.createElement('div');
        orderDiv.className = 'order';
        orderDiv.innerHTML = `
            <h3>Order #${order.id}</h3>
            <p><strong>Date:</strong> ${order.date}</p>
            <p><strong>Total:</strong> ₹${order.total}</p>
            <div class="order-details">
                <strong>Items:</strong>
                <ul>
                    ${order.items.map(item => `<li>${item.name} (x${item.quantity}) - ₹${item.price}</li>`).join('')}
                </ul>
            </div>
        `;
        ordersList.appendChild(orderDiv);
    });
}

// Call the function to display orders on page load
displayOrders();

function checkSignInStatus() {
    const userData = localStorage.getItem('userData');
    
    if (!userData) {
        // Redirect to login page if user is not signed in
        window.location.href = "../Login/login.html"; // Or update to your actual login page path
    }
}