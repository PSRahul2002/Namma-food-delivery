// Function to handle Google Sign-In response
function handleCredentialResponse(response) {
    console.log("Encoded JWT ID token: " + response.credential);

    // Send the token to your back-end API
    fetch('https://namma-food-delivery-backend.onrender.com/api/auth/google-signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: response.credential })
    })
    .then(res => res.json())
    .then(data => {
        if (data.message === "User data saved successfully") {
            // Redirect to the home page or dashboard
            localStorage.setItem("userData", JSON.stringify(data.user));
            window.location.href = '../index.html';
        } else {
            showError("Error during sign-in. Please try again.");
        }
    })
    .catch(err => {
        showError("Error during sign-in. Please try again.");
        console.error("Error:", err);
    });
}

// Function to show error messages on the page
function showError(message) {
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}
