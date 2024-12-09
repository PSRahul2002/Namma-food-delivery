// Placeholder for any JavaScript functionality
checkSignInStatus();
document.addEventListener('DOMContentLoaded', () => {
    checkSignInStatus();
    console.log('Index page loaded');
});

function checkSignInStatus() {
    const userData = localStorage.getItem('userData');
    
    if (!userData) {
        // Redirect to login page if user is not signed in
        window.location.href = "../Login/login.html"; // Or update to your actual login page path
    }
}