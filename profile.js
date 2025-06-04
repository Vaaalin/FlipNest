// Profile JavaScript file for FlipNest e-commerce platform

// Sample user listings data (this would normally come from a database)
const sampleListings = [
    {
        id: 101,
        title: "Vintage Leather Jacket",
        description: "Genuine leather jacket in excellent condition. Size L.",
        price: 120.00,
        image: "images/products/jacket.jpg",
        status: "active",
        date: "2025-05-15",
        views: 24,
        sellerId: 1
    },
    {
        id: 102,
        title: "iPhone 12 Pro - 128GB",
        description: "Used iPhone 12 Pro in good condition. Comes with charger and original box.",
        price: 550.00,
        image: "images/products/iphone.jpg",
        status: "active",
        date: "2025-05-20",
        views: 42,
        sellerId: 1
    },
    {
        id: 103,
        title: "Coffee Table - Solid Wood",
        description: "Handcrafted coffee table made from reclaimed wood. Dimensions: 120x60x45cm.",
        price: 180.00,
        image: "images/products/table.jpg",
        status: "sold",
        date: "2025-05-10",
        views: 18,
        sellerId: 1
    }
];

// Sample messages data
const sampleMessages = [
    {
        id: 1,
        sender: {
            id: 2,
            name: "Jane Smith",
            avatar: "images/user2.jpg"
        },
        recipient: {
            id: 1,
            name: "John Doe"
        },
        subject: "Interested in your iPhone",
        message: "Hi there, I'm interested in your iPhone 12 Pro. Is it still available? Does it have any scratches or issues?",
        date: "2025-05-28T14:30:00",
        read: false,
        listingId: 102
    },
    {
        id: 2,
        sender: {
            id: 3,
            name: "Michael Brown",
            avatar: "images/user3.jpg"
        },
        recipient: {
            id: 1,
            name: "John Doe"
        },
        subject: "Coffee table inquiry",
        message: "Hello, I'm interested in your coffee table. Would you be willing to deliver it to downtown?",
        date: "2025-05-25T09:15:00",
        read: true,
        listingId: 103
    }
];

// Sample purchases data
const samplePurchases = [
    {
        id: 201,
        title: "Wireless Headphones",
        price: 85.00,
        seller: "Emily Wilson",
        date: "2025-05-18",
        status: "delivered",
        image: "images/products/headphones.jpg"
    },
    {
        id: 202,
        title: "Desk Lamp - Modern Design",
        price: 45.50,
        seller: "David Miller",
        date: "2025-05-22",
        status: "shipped",
        image: "images/products/lamp.jpg"
    }
];

// Sample favorites data
const sampleFavorites = [
    {
        id: 301,
        title: "Mountain Bike - Trek",
        price: 350.00,
        seller: "Robert Johnson",
        image: "images/products/bike.jpg",
        date: "2025-05-19"
    },
    {
        id: 302,
        title: "Antique Wooden Bookshelf",
        price: 120.00,
        seller: "Sarah Thompson",
        image: "images/products/bookshelf.jpg",
        date: "2025-05-21"
    }
];

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        // Redirect to login page if not logged in
        window.location.href = 'login.html';
        return;
    }
    
    // Load user profile data
    loadUserProfile(user);
    
    // Load user listings
    loadUserListings(user.id);
    
    // Load user purchases
    loadPurchases(user.id);
    
    // Load user favorites
    loadFavorites(user.id);
    
    // Load user messages
    loadMessages(user.id);
    
    // Set up tab navigation
    setupTabNavigation();
    
    // Set up form handlers
    setupFormHandlers(user);
    
    // Update cart count
    updateCartCount();
});

// Load user profile data
function loadUserProfile(user) {
    // Set user name and email
    document.getElementById('profile-name').textContent = `${user.firstName} ${user.lastName}`;
    document.getElementById('profile-email').textContent = user.email;
    
    // Set user stats
    const userListings = sampleListings.filter(listing => listing.sellerId === user.id);
    const activeListings = userListings.filter(listing => listing.status === 'active');
    const soldListings = userListings.filter(listing => listing.status === 'sold');
    
    document.getElementById('listings-count').textContent = userListings.length;
    document.getElementById('sold-count').textContent = soldListings.length;
    document.getElementById('rating').textContent = '4.8'; // Sample rating
    
    // Show/hide become seller button based on user status
    const becomeSellerBtn = document.getElementById('become-seller-btn');
    if (user.isSeller) {
        becomeSellerBtn.style.display = 'none';
    } else {
        becomeSellerBtn.addEventListener('click', () => {
            // In a real app, this would make an API call to upgrade the user to a seller
            user.isSeller = true;
            localStorage.setItem('user', JSON.stringify(user));
            showNotification('You are now a seller!', 'success');
            becomeSellerBtn.style.display = 'none';
        });
    }
    
    // Set up edit profile button
    document.getElementById('edit-profile-btn').addEventListener('click', () => {
        // Switch to settings tab
        switchTab('settings');
    });
    
    // Populate settings form
    const settingsForm = document.getElementById('settings-form');
    if (settingsForm) {
        document.getElementById('first-name').value = user.firstName || '';
        document.getElementById('last-name').value = user.lastName || '';
        document.getElementById('email').value = user.email || '';
        document.getElementById('phone').value = user.phone || '';
        document.getElementById('address').value = user.address || '';
    }
}

// Load user listings
function loadUserListings(userId) {
    const listingsGrid = document.getElementById('listings-grid');
    const userListings = sampleListings.filter(listing => listing.sellerId === userId);
    
    if (userListings.length === 0) {
        listingsGrid.innerHTML = '<p class="no-listings">You don\'t have any listings yet.</p>';
        return;
    }
    
    listingsGrid.innerHTML = '';
    
    userListings.forEach(listing => {
        const formattedPrice = listing.price.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        });
        
        const formattedDate = new Date(listing.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        const statusClass = `status-${listing.status}`;
        const statusText = listing.status.charAt(0).toUpperCase() + listing.status.slice(1);
        
        const listingCard = document.createElement('div');
        listingCard.className = 'listing-card';
        listingCard.innerHTML = `
            <div class="listing-image">
                <img src="${listing.image}" alt="${listing.title}" onerror="this.src='https://via.placeholder.com/250x160?text=Product'">
                <div class="listing-status ${statusClass}">${statusText}</div>
            </div>
            <div class="listing-details">
                <h3 class="listing-title">${listing.title}</h3>
                <div class="listing-price">${formattedPrice}</div>
                <div class="listing-meta">
                    <span class="listing-date"><i class="far fa-calendar-alt"></i> ${formattedDate}</span>
                    <span class="listing-views"><i class="far fa-eye"></i> ${listing.views} views</span>
                </div>
                <div class="listing-actions">
                    <a href="edit-listing.html?id=${listing.id}" class="btn btn-primary btn-small">Edit</a>
                    <button class="btn btn-secondary btn-small" data-id="${listing.id}" onclick="deleteListing(${listing.id})">Delete</button>
                </div>
            </div>
        `;
        
        listingsGrid.appendChild(listingCard);
    });
}

// Load user purchases
function loadPurchases(userId) {
    const purchasesList = document.getElementById('purchases-list');
    
    if (samplePurchases.length === 0) {
        purchasesList.innerHTML = '<p class="no-purchases">You haven\'t made any purchases yet.</p>';
        return;
    }
    
    purchasesList.innerHTML = '';
    
    samplePurchases.forEach(purchase => {
        const formattedPrice = purchase.price.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        });
        
        const formattedDate = new Date(purchase.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        const purchaseItem = document.createElement('div');
        purchaseItem.className = 'purchase-item';
        purchaseItem.innerHTML = `
            <div class="purchase-image">
                <img src="${purchase.image}" alt="${purchase.title}" onerror="this.src='https://via.placeholder.com/80x80?text=Product'">
            </div>
            <div class="purchase-details">
                <h3 class="purchase-title">${purchase.title}</h3>
                <p class="purchase-seller">Seller: ${purchase.seller}</p>
                <p class="purchase-price">${formattedPrice}</p>
                <p class="purchase-date">Purchased on ${formattedDate}</p>
                <p class="purchase-status">Status: <span class="status-${purchase.status}">${purchase.status}</span></p>
            </div>
            <div class="purchase-actions">
                <a href="#" class="btn btn-primary btn-small">Track</a>
                <a href="#" class="btn btn-secondary btn-small">Contact Seller</a>
            </div>
        `;
        
        purchasesList.appendChild(purchaseItem);
    });
}

// Load user favorites
function loadFavorites(userId) {
    const favoritesGrid = document.getElementById('favorites-grid');
    
    if (sampleFavorites.length === 0) {
        favoritesGrid.innerHTML = '<p class="no-favorites">You don\'t have any favorites yet.</p>';
        return;
    }
    
    favoritesGrid.innerHTML = '';
    
    sampleFavorites.forEach(favorite => {
        const formattedPrice = favorite.price.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        });
        
        const formattedDate = new Date(favorite.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        const favoriteCard = document.createElement('div');
        favoriteCard.className = 'listing-card';
        favoriteCard.innerHTML = `
            <div class="listing-image">
                <img src="${favorite.image}" alt="${favorite.title}" onerror="this.src='https://via.placeholder.com/250x160?text=Product'">
            </div>
            <div class="listing-details">
                <h3 class="listing-title">${favorite.title}</h3>
                <div class="listing-price">${formattedPrice}</div>
                <div class="listing-meta">
                    <span class="listing-seller">Seller: ${favorite.seller}</span>
                    <span class="listing-date"><i class="far fa-calendar-alt"></i> ${formattedDate}</span>
                </div>
                <div class="listing-actions">
                    <a href="product.html?id=${favorite.id}" class="btn btn-primary btn-small">View</a>
                    <button class="btn btn-secondary btn-small" onclick="removeFromFavorites(${favorite.id})">Remove</button>
                </div>
            </div>
        `;
        
        favoritesGrid.appendChild(favoriteCard);
    });
}

// Load user messages
function loadMessages(userId) {
    const messagesList = document.getElementById('messages-list');
    const userMessages = sampleMessages.filter(msg => msg.recipient.id === userId);
    
    if (userMessages.length === 0) {
        messagesList.innerHTML = '<p class="no-messages">You don\'t have any messages yet.</p>';
        return;
    }
    
    messagesList.innerHTML = '';
    
    // Create message container
    const messagesContainer = document.createElement('div');
    messagesContainer.className = 'messages-container';
    
    userMessages.forEach(message => {
        const formattedDate = new Date(message.date).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const messageItem = document.createElement('div');
        messageItem.className = `message-item ${message.read ? '' : 'unread'}`;
        messageItem.dataset.id = message.id;
        messageItem.innerHTML = `
            <div class="message-sender">
                <img src="${message.sender.avatar}" alt="${message.sender.name}" onerror="this.src='https://via.placeholder.com/40x40?text=User'">
            </div>
            <div class="message-content">
                <div class="message-header">
                    <h4 class="message-subject">${message.subject}</h4>
                    <span class="message-date">${formattedDate}</span>
                </div>
                <p class="message-sender-name">From: ${message.sender.name}</p>
                <p class="message-text">${message.message}</p>
                <div class="message-actions">
                    <button class="btn btn-primary btn-small reply-btn" data-id="${message.id}">Reply</button>
                    <button class="btn btn-secondary btn-small delete-btn" data-id="${message.id}">Delete</button>
                </div>
            </div>
        `;
        
        // Add click handler to mark as read
        messageItem.addEventListener('click', () => {
            if (!message.read) {
                message.read = true;
                messageItem.classList.remove('unread');
            }
        });
        
        messagesContainer.appendChild(messageItem);
    });
    
    messagesList.appendChild(messagesContainer);
    
    // Add event listeners for message actions
    document.querySelectorAll('.reply-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const messageId = parseInt(btn.dataset.id);
            replyToMessage(messageId);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const messageId = parseInt(btn.dataset.id);
            deleteMessage(messageId);
        });
    });
}

// Set up tab navigation
function setupTabNavigation() {
    const tabLinks = document.querySelectorAll('.profile-nav a');
    
    tabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = link.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
}

// Switch tabs
function switchTab(tabId) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all links
    document.querySelectorAll('.profile-nav a').forEach(link => {
        link.classList.remove('active');
    });
    
    // Show the selected tab
    document.getElementById(tabId).classList.add('active');
    
    // Add active class to the clicked link
    document.querySelector(`.profile-nav a[data-tab="${tabId}"]`).classList.add('active');
}

// Set up form handlers
function setupFormHandlers(user) {
    const settingsForm = document.getElementById('settings-form');
    
    if (settingsForm) {
        settingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values
            const firstName = document.getElementById('first-name').value;
            const lastName = document.getElementById('last-name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const address = document.getElementById('address').value;
            const currentPassword = document.getElementById('current-password').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            // Validate form
            if (!firstName || !lastName || !email) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }
            
            // Check if changing password
            if (newPassword) {
                if (!currentPassword) {
                    showNotification('Please enter your current password', 'error');
                    return;
                }
                
                if (newPassword !== confirmPassword) {
                    showNotification('New passwords do not match', 'error');
                    return;
                }
                
                // In a real app, this would verify the current password and update it
            }
            
            // Update user data
            user.firstName = firstName;
            user.lastName = lastName;
            user.email = email;
            user.phone = phone;
            user.address = address;
            
            // Save updated user to localStorage
            localStorage.setItem('user', JSON.stringify(user));
            
            // Update profile display
            document.getElementById('profile-name').textContent = `${firstName} ${lastName}`;
            document.getElementById('profile-email').textContent = email;
            document.getElementById('username').textContent = firstName;
            
            showNotification('Profile updated successfully', 'success');
        });
    }
}

// Delete a listing
function deleteListing(listingId) {
    if (confirm('Are you sure you want to delete this listing?')) {
        // In a real app, this would make an API call to delete the listing
        const user = JSON.parse(localStorage.getItem('user'));
        
        // Remove the listing from the sample data
        const index = sampleListings.findIndex(listing => listing.id === listingId);
        if (index !== -1) {
            sampleListings.splice(index, 1);
            
            // Reload the listings
            loadUserListings(user.id);
            
            // Update stats
            document.getElementById('listings-count').textContent = sampleListings.filter(listing => listing.sellerId === user.id).length;
            
            showNotification('Listing deleted successfully', 'success');
        }
    }
}

// Remove from favorites
function removeFromFavorites(favoriteId) {
    // In a real app, this would make an API call to remove the favorite
    const index = sampleFavorites.findIndex(fav => fav.id === favoriteId);
    if (index !== -1) {
        sampleFavorites.splice(index, 1);
        
        // Reload favorites
        const user = JSON.parse(localStorage.getItem('user'));
        loadFavorites(user.id);
        
        showNotification('Removed from favorites', 'success');
    }
}

// Reply to a message
function replyToMessage(messageId) {
    const message = sampleMessages.find(msg => msg.id === messageId);
    if (message) {
        // In a real app, this would open a reply form or modal
        // For this demo, we'll just show a notification
        showNotification(`Replying to ${message.sender.name}...`, 'info');
    }
}

// Delete a message
function deleteMessage(messageId) {
    if (confirm('Are you sure you want to delete this message?')) {
        // In a real app, this would make an API call to delete the message
        const index = sampleMessages.findIndex(msg => msg.id === messageId);
        if (index !== -1) {
            sampleMessages.splice(index, 1);
            
            // Remove the message element from the DOM
            const messageElement = document.querySelector(`.message-item[data-id="${messageId}"]`);
            if (messageElement) {
                messageElement.remove();
            }
            
            // Check if there are any messages left
            const user = JSON.parse(localStorage.getItem('user'));
            const userMessages = sampleMessages.filter(msg => msg.recipient.id === user.id);
            if (userMessages.length === 0) {
                document.getElementById('messages-list').innerHTML = '<p class="no-messages">You don\'t have any messages yet.</p>';
            }
            
            showNotification('Message deleted successfully', 'success');
        }
    }
}

// Show notification
function showNotification(message, type = 'success') {
    // Check if notification container exists
    let notificationContainer = document.querySelector('.notification-container');
    
    // If not, create it
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
        
        // Add notification container styles
        const style = document.createElement('style');
        style.textContent = `
            .notification-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1000;
            }
            
            .notification {
                margin-bottom: 10px;
                padding: 15px 20px;
                border-radius: 5px;
                color: white;
                font-weight: 500;
                box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
                display: flex;
                align-items: center;
                justify-content: space-between;
                min-width: 300px;
                max-width: 400px;
                animation: slideIn 0.3s ease, fadeOut 0.5s ease 2.5s forwards;
            }
            
            .notification.success {
                background-color: var(--success-color, #28a745);
            }
            
            .notification.error {
                background-color: var(--danger-color, #dc3545);
            }
            
            .notification.info {
                background-color: var(--primary-color, #4a6ee0);
            }
            
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 16px;
                cursor: pointer;
                margin-left: 10px;
            }
            
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        ${message}
        <button class="notification-close">&times;</button>
    `;
    
    // Add notification to container
    notificationContainer.appendChild(notification);
    
    // Add close button event listener
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Update cart count
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    let totalItems = 0;
    cart.forEach(item => {
        totalItems += item.quantity;
    });
    
    cartCountElement.textContent = totalItems;
    
    if (totalItems > 0) {
        cartCountElement.style.display = 'inline-block';
    } else {
        cartCountElement.style.display = 'none';
    }
}
