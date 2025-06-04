// Main JavaScript file for FlipNest e-commerce platform

// DOM Elements
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const userProfile = document.querySelector('.user-profile');
const usernameSpan = document.getElementById('username');

// Check if user is logged in
function checkLoginStatus() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        // User is logged in
        loginBtn.classList.add('hidden');
        registerBtn.classList.add('hidden');
        userProfile.classList.remove('hidden');
        usernameSpan.textContent = user.firstName;
    } else {
        // User is not logged in
        loginBtn.classList.remove('hidden');
        registerBtn.classList.remove('hidden');
        userProfile.classList.add('hidden');
    }
}

// Initialize the application
function init() {
    checkLoginStatus();
    
    // Add event listeners for mobile menu toggle
    const menuToggle = document.createElement('div');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    document.querySelector('header .container').appendChild(menuToggle);
    
    menuToggle.addEventListener('click', () => {
        document.querySelector('nav ul').classList.toggle('show');
    });
    
    // Add responsive styles for mobile menu
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 768px) {
            nav ul {
                display: none;
                flex-direction: column;
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background-color: white;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                padding: 20px;
                z-index: 100;
            }
            
            nav ul.show {
                display: flex;
            }
            
            nav ul li {
                margin: 10px 0;
            }
            
            .menu-toggle {
                display: block;
                font-size: 24px;
                cursor: pointer;
            }
        }
        
        @media (min-width: 769px) {
            .menu-toggle {
                display: none;
            }
        }
    `;
    document.head.appendChild(style);
}

// Add event listener for when DOM content is loaded
document.addEventListener('DOMContentLoaded', init);

// Handle logout
function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    checkLoginStatus();
    window.location.href = 'index.html';
}

// Add logout functionality to user profile dropdown
function setupUserDropdown() {
    const userProfileElement = document.querySelector('.user-profile');
    if (userProfileElement) {
        // Create dropdown menu
        const dropdown = document.createElement('div');
        dropdown.className = 'dropdown-menu';
        dropdown.innerHTML = `
            <ul>
                <li><a href="profile.html" class="dropdown-link">My Profile</a></li>
                <li><a href="sell.html" class="dropdown-link">My Listings</a></li>
                <li><a href="messages.html" class="dropdown-link">Messages</a></li>
                <li><a href="#" id="logout-btn">Logout</a></li>
            </ul>
        `;
        
        userProfileElement.appendChild(dropdown);
        
        // Toggle dropdown when clicking on the profile icon/link
        const profileLink = userProfileElement.querySelector('a');
        profileLink.addEventListener('click', (e) => {
            e.preventDefault(); // Only prevent default on the main profile link
            dropdown.classList.toggle('show');
        });
        
        // Add logout event listener
        document.getElementById('logout-btn').addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!userProfileElement.contains(e.target)) {
                dropdown.classList.remove('show');
            }
        });
        
        // Add dropdown styles
        const style = document.createElement('style');
        style.textContent = `
            .user-profile {
                position: relative;
            }
            
            .dropdown-menu {
                display: none;
                position: absolute;
                top: 100%;
                right: 0;
                background-color: #faf7f4; /* Warm off-white background */
                box-shadow: 0 4px 8px rgba(193, 169, 142, 0.1); /* Warm shadow */
                border: 1px solid rgba(193, 169, 142, 0.2); /* Light warm border */
                border-radius: 5px;
                width: 200px;
                z-index: 100;
                padding: 5px 0;
            }
            
            .dropdown-menu.show {
                display: block;
            }
            
            .dropdown-menu ul {
                display: block;
                padding: 10px 0;
                margin: 0;
            }
            
            .dropdown-menu ul li {
                margin: 0;
                list-style: none;
            }
            
            .dropdown-menu ul li a {
                display: block;
                padding: 10px 20px;
                color: #8a7e74; /* Medium warm gray */
                transition: all 0.3s ease;
                text-decoration: none;
                font-weight: 500;
            }
            
            .dropdown-menu ul li a:hover {
                background-color: rgba(193, 169, 142, 0.1); /* Very light warm hover */
                color: #c1a98e; /* Primary warm taupe */
            }
        `;
        document.head.appendChild(style);
    }
}

// Call setupUserDropdown after DOM is loaded
document.addEventListener('DOMContentLoaded', setupUserDropdown);

// Handle form submissions with fetch API
function handleFormSubmit(formElement, endpoint, successCallback, errorCallback) {
    formElement.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(formElement);
        const formDataObj = {};
        
        formData.forEach((value, key) => {
            formDataObj[key] = value;
        });
        
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formDataObj),
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }
            
            if (successCallback) {
                successCallback(data);
            }
            
        } catch (error) {
            console.error('Error:', error);
            if (errorCallback) {
                errorCallback(error.message);
            }
        }
    });
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Add notification styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            animation: slideIn 0.3s ease, fadeOut 0.5s ease 2.5s forwards;
        }
        
        .notification.success {
            background-color: var(--success-color);
        }
        
        .notification.error {
            background-color: var(--danger-color);
        }
        
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; visibility: hidden; }
        }
    `;
    document.head.appendChild(style);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Export functions for use in other scripts
window.flipnest = {
    checkLoginStatus,
    logout,
    handleFormSubmit,
    showNotification
};
