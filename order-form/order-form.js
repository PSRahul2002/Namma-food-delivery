document.addEventListener('DOMContentLoaded', (event) => {
    checkSignInStatus();
});


document.getElementById('order-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    let isValid = true;

    // Validate Name
    const name = document.getElementById('name');
    const nameError = document.getElementById('name-error');
    if (name.value.trim() === '') {
        nameError.textContent = 'Name is required.';
        nameError.style.display = 'block';
        isValid = false;
    } else {
        nameError.style.display = 'none';
    }

    // Validate Address
    const address = document.getElementById('address');
    const addressError = document.getElementById('address-error');
    if (address.value.trim() === '') {
        addressError.textContent = 'Address is required.';
        addressError.style.display = 'block';
        isValid = false;
    } else {
        addressError.style.display = 'none';
    }

    // Validate Phone
    const phone = document.getElementById('phone');
    const phoneError = document.getElementById('phone-error');
    const phonePattern = /^[0-9]{10}$/; // Example pattern for a 10-digit phone number
    if (!phonePattern.test(phone.value.trim())) {
        phoneError.textContent = 'Enter a valid 10-digit phone number.';
        phoneError.style.display = 'block';
        isValid = false;
    } else {
        phoneError.style.display = 'none';
    }

    // Validate Payment Method
    const paymentMethod = document.getElementById('payment-method');
    const paymentError = document.getElementById('payment-error');
    if (paymentMethod.value === '') {
        paymentError.textContent = 'Please select a payment method.';
        paymentError.style.display = 'block';
        isValid = false;
    } else {
        paymentError.style.display = 'none';
    }

    // If all fields are valid, submit the form
    if (isValid) {
        alert('Form submitted successfully!');
        // Here you can add code to actually submit the form, e.g., using AJAX
    }
});