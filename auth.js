const sampleUsers = [
    {
        id: 1,
        email: 'john@example.com',
        password: 'password123', // In a real app, this would be hashed
        firstName: 'John',
        lastName: 'Doe',
        phone: '123-456-7890',
        address: '123 Main St, New York, NY',
        isSeller: true
    },
    {
        id: 2,
        email: 'jane@example.com',
        password: 'password456', // In a real app, this would be hashed
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '987-654-3210',
        address: '456 Oak Ave, Los Angeles, CA',
        isSeller: false
    }
];

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already logged in
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        updateUIForLoggedInUser(user);
    }
    
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Register form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
});

// Handle login form submission
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember').checked;
    
    // Validate form
    if (!email || !password) {
        showError('Please fill in all fields');
        return;
    }
    
    // Check if user exists (this would be a server request in a real app)
    const user = sampleUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Login successful
        const userData = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            isSeller: user.isSeller
        };
        
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Generate a fake token (in a real app, this would come from the server)
        const token = generateToken();
        localStorage.setItem('authToken', token);
        
        // Set session flag to indicate user just logged in
        sessionStorage.setItem('justLoggedIn', 'true');
        
        // Check if there's a redirect URL stored
        const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
        if (redirectUrl) {
            // Clear the stored URL
            sessionStorage.removeItem('redirectAfterLogin');
            // Redirect to the stored URL
            window.location.href = redirectUrl;
        } else {
            // Redirect to homepage
            window.location.href = 'index.html';
        }
    } else {
        // Login failed
        showError('Invalid email or password');
    }
}

// Handle register form submission
function handleRegister(e) {
    e.preventDefault();
    
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const agreeTerms = document.getElementById('agree-terms').checked;
    
    // Validate form
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        showError('Please fill in all fields');
        return;
    }
    
    if (password !== confirmPassword) {
        showError('Passwords do not match');
        return;
    }
    
    if (!agreeTerms) {
        showError('You must agree to the Terms and Conditions');
        return;
    }
    
    // Check if email already exists
    const emailExists = sampleUsers.some(u => u.email === email);
    
    if (emailExists) {
        showError('Email already exists');
        return;
    }
    
    // In a real app, this would send a request to the server to create a new user
    // For this demo, we'll just simulate a successful registration
    
    // Create new user object
    const newUser = {
        id: sampleUsers.length + 1,
        email,
        password, // In a real app, this would be hashed
        firstName,
        lastName,
        isSeller: false
    };
    
    // Add to sample users (in a real app, this would be saved to a database)
    sampleUsers.push(newUser);
    
    // Store user data in localStorage
    const userData = {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        isSeller: newUser.isSeller
    };
    
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Generate a fake token
    const token = generateToken();
    localStorage.setItem('authToken', token);
    
    // Set session flag to indicate user just logged in
    sessionStorage.setItem('justLoggedIn', 'true');
    
    // Redirect to homepage
    window.location.href = 'index.html';
}

// Handle logout
function handleLogout(e) {
    if (e) e.preventDefault();
    
    // Remove user data and token from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    
    // Clear session storage
    sessionStorage.removeItem('justLoggedIn');
    sessionStorage.removeItem('userSessionActive');
    
    // Redirect to homepage
    window.location.href = 'index.html';
}

// Show error message
function showError(message) {
    // Check if error element exists
    let errorElement = document.querySelector('.error-message');
    
    // If not, create it
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        
        // Insert after form
        const form = document.querySelector('form');
        form.parentNode.insertBefore(errorElement, form.nextSibling);
    }
    
    // Set error message and show
    errorElement.textContent = message;
    errorElement.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
        errorElement.classList.remove('show');
    }, 3000);
}

// Generate a random token (for demo purposes)
function generateToken() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Check if user is logged in
function checkAuth() {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('authToken');
    
    return !!user && !!token;
}

// Update UI elements for logged in user
function updateUIForLoggedInUser(user) {
    // Update username in header
    const usernameElement = document.getElementById('username');
    if (usernameElement && user) {
        usernameElement.textContent = user.firstName;
    }

    // Show user profile, hide login/register buttons
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const userProfile = document.querySelector('.user-profile');
    
    if (loginBtn && registerBtn && userProfile) {
        loginBtn.parentElement.classList.add('hidden');
        registerBtn.parentElement.classList.add('hidden');
        userProfile.classList.remove('hidden');
    }
}

// Protect seller pages
function protectSellerPages() {
    // Get current page path
    const currentPath = window.location.pathname;
    
    // List of seller-only pages
    const sellerPages = [
        '/seller-dashboard.html',
        '/add-listing.html',
        '/manage-listings.html'
    ];
    
    // Check if current page is a seller page
    const isSellerPage = sellerPages.some(page => currentPath.endsWith(page));
    
    if (isSellerPage) {
        // Check if user is logged in
        const user = JSON.parse(localStorage.getItem('user'));
        
        if (!user) {
            // Not logged in, redirect to login
            sessionStorage.setItem('redirectAfterLogin', window.location.href);
            window.location.href = 'login.html';
            return;
        }
        
        // Check if user is a seller
        if (!user.isSeller) {
            // Not a seller, redirect to become-seller page
            window.location.href = 'become-seller.html';
            return;
        }
    }
}

// Function to upgrade user to seller
function becomeASeller() {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (user) {
        // Update user to be a seller
        user.isSeller = true;
        
        // Save updated user data
        localStorage.setItem('user', JSON.stringify(user));
        
        // Redirect to seller dashboard
        window.location.href = 'seller-dashboard.html';
    } else {
        // Not logged in, redirect to login
        window.location.href = 'login.html';
    }
}

// Initialize authentication on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check login status
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        updateUIForLoggedInUser(user);
    }
    
    // Protect seller pages
    protectSellerPages();
    
    // Setup become seller button if it exists
    const becomeSellerBtn = document.getElementById('become-seller-btn');
    if (becomeSellerBtn) {
        becomeSellerBtn.addEventListener('click', becomeASeller);
    }
});
