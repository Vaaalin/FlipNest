// cart.js - JavaScript for the cart page functionality

document.addEventListener('DOMContentLoaded', function() {
    // Update UI based on login status
    updateLoginStatus();
    
    // Load cart items
    loadCartItems();
    
    // Update cart count
    updateCartCount();
});

function updateLoginStatus() {
    const user = JSON.parse(localStorage.getItem('user'));
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const userProfile = document.querySelector('.user-profile');
    const username = document.getElementById('username');
    
    if (user) {
        loginBtn.parentElement.classList.add('hidden');
        registerBtn.parentElement.classList.add('hidden');
        userProfile.classList.remove('hidden');
        username.textContent = user.firstName;
    } else {
        loginBtn.parentElement.classList.remove('hidden');
        registerBtn.parentElement.classList.remove('hidden');
        userProfile.classList.add('hidden');
    }
}

function loadCartItems() {
    const cartContent = document.getElementById('cart-content');
    const cartHeaderElement = document.querySelector('.cart-header');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Update cart count in header
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    if (cartHeaderElement) {
        const countBadge = cartHeaderElement.querySelector('.cart-count-badge') || document.createElement('div');
        countBadge.className = 'cart-count-badge';
        countBadge.innerHTML = `<i class="fas fa-shopping-cart"></i> ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`;
        
        if (!cartHeaderElement.querySelector('.cart-count-badge')) {
            cartHeaderElement.appendChild(countBadge);
        }
    }
    
    if (cart.length === 0) {
        // Display empty cart message
        cartContent.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-cart"></i>
                <h3>Your cart is empty</h3>
                <p>Looks like you haven't added any items to your cart yet.</p>
                <a href="index.html" class="btn btn-primary">Start Shopping</a>
            </div>
        `;
        return;
    }
    
    // Create cart items HTML
    let cartItemsHTML = '<div class="cart-items">';
    let subtotal = 0;
    
    cart.forEach(cartItem => {
        // Use the cart item directly since it already contains all product info
        const itemTotal = cartItem.price * cartItem.quantity;
        subtotal += itemTotal;
        
        cartItemsHTML += `
            <div class="cart-item" data-id="${cartItem.id}">
                <div class="cart-item-image">
                    <img src="${cartItem.image}" alt="${cartItem.title}" onerror="this.onerror=null; this.src='https://via.placeholder.com/120x120?text=FlipNest';">
                </div>
                <div class="cart-item-details">
                    <h3 class="cart-item-title"><a href="product.html?id=${cartItem.id}">${cartItem.title}</a></h3>
                    <p class="cart-item-seller"><i class="fas fa-user"></i> Seller: ${cartItem.seller}</p>
                    <p class="cart-item-price">$${cartItem.price.toFixed(2)}</p>
                </div>
                <div class="cart-item-actions">
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease-btn" onclick="updateQuantity(${cartItem.id}, ${cartItem.quantity - 1})"><i class="fas fa-minus"></i></button>
                        <input type="number" class="quantity-input" value="${cartItem.quantity}" min="1" max="10" onchange="updateQuantityInput(${cartItem.id}, this.value)">
                        <button class="quantity-btn increase-btn" onclick="updateQuantity(${cartItem.id}, ${cartItem.quantity + 1})"><i class="fas fa-plus"></i></button>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart(${cartItem.id})"><i class="fas fa-trash"></i> Remove</button>
                </div>
            </div>
        `;
    });
    
    cartItemsHTML += '</div>';
    
    // Calculate tax and total
    const tax = subtotal * 0.1; // Assuming 10% tax
    const total = subtotal + tax;
    
    // Add summary section
    cartItemsHTML += `
        <div class="cart-summary">
            <div class="summary-row">
                <span>Subtotal:</span>
                <span>$${subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Tax (10%):</span>
                <span>$${tax.toFixed(2)}</span>
            </div>
            <div class="summary-row total">
                <span>Total:</span>
                <span>$${total.toFixed(2)}</span>
            </div>
            <button class="checkout-btn" onclick="checkout()"><i class="fas fa-lock"></i> Proceed to Checkout</button>
        </div>
        <a href="index.html" class="continue-shopping"><i class="fas fa-arrow-left"></i> Continue Shopping</a>
    `;
    
    cartContent.innerHTML = cartItemsHTML;
}

function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        // If quantity is less than 1, remove the item
        removeFromCart(productId);
        return;
    }
    
    if (newQuantity > 10) {
        // Limit to 10 items max
        newQuantity = 10;
    }
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Find the item in the cart
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex !== -1) {
        // Update quantity
        cart[itemIndex].quantity = newQuantity;
        
        // Save updated cart
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Reload cart items and update count
        loadCartItems();
        updateCartCount();
    }
}

function updateQuantityInput(productId, value) {
    // Convert value to number and ensure it's valid
    const newQuantity = parseInt(value);
    
    if (!isNaN(newQuantity) && newQuantity > 0) {
        updateQuantity(productId, newQuantity);
    }
}

function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Filter out the item to remove
    cart = cart.filter(item => item.id !== productId);
    
    // Save updated cart
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Reload cart items and update count
    loadCartItems();
    updateCartCount();
}

function checkout() {
    // In a real application, this would redirect to a checkout page
    // For this demo, we'll just show an alert
    alert('Checkout functionality would be implemented here. In a real application, this would proceed to payment processing.');
    
    // Clear the cart after checkout
    localStorage.setItem('cart', JSON.stringify([]));
    
    // Reload cart items and update count
    loadCartItems();
    updateCartCount();
}

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
