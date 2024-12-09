document.addEventListener('DOMContentLoaded', () => {
    checkSignInStatus();
    const restaurantGrid = document.getElementById('restaurant-grid');

    // Fetch restaurant data from restaurants.json
    fetch('restaurants.json')
        .then(response => response.json())
        .then(data => {
            data.forEach(restaurant => {
                const restaurantCard = document.createElement('div');
                restaurantCard.className = 'restaurant-card';
                restaurantCard.innerHTML = `
                    <img src="${restaurant.image}" alt="${restaurant.name} Logo">
                    <h2>${restaurant.name}</h2>
                    <button class="view-menu-button" data-restaurant-id="${restaurant.id}">View Menu</button>
                `;

                // Add click event listener to the View Menu button
                const viewMenuButton = restaurantCard.querySelector('.view-menu-button');
                viewMenuButton.addEventListener('click', () => {
                    navigateToMenu(restaurant.id);
                });

                restaurantGrid.appendChild(restaurantCard);
            });
        })
        .catch(error => console.error('Error fetching restaurant data:', error));
});

function navigateToMenu(restaurantId) {
    // Navigate to the menu page with the restaurant ID as a parameter
    window.location.href = `/menu/menu.html?restaurantId=${restaurantId}`;
}

function checkSignInStatus() {
    const userData = localStorage.getItem('userData');
    
    if (!userData) {
        // Redirect to login page if user is not signed in
        window.location.href = "../Login/login.html"; // Or update to your actual login page path
    }
}

// document.addEventListener('DOMContentLoaded', () => {
//     const restaurantGrid = document.getElementById('restaurant-grid');

//     // Fetch restaurant data from restaurants.json
//     fetch('restaurants.json')
//         .then(response => response.json())
//         .then(data => {
//             data.forEach(restaurant => {
//                 const restaurantCard = document.createElement('div');
//                 restaurantCard.className = 'restaurant-card';
//                 restaurantCard.innerHTML = `
//                     <img src="${restaurant.image}" alt="${restaurant.name} Logo">
//                     <h2>${restaurant.name}</h2>
//                     <button class="view-menu-button">View Menu</button>
//                 `;
//                 restaurantGrid.appendChild(restaurantCard);
//             });
//         })
//         .catch(error => console.error('Error fetching restaurant data:', error));
// });