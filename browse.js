// browse.js - JavaScript for the browse page functionality

document.addEventListener('DOMContentLoaded', function() {
    // Update UI based on login status
    updateLoginStatus();
    
    // Load products
    loadProducts();
    
    // Update cart count
    updateCartCount();
    
    // Set up event listeners for filters
    setupFilterListeners();
    
    // Check for search query in URL
    checkForSearchQuery();
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

function checkForSearchQuery() {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query');
    
    if (query) {
        document.getElementById('search-input').value = query;
        // Apply the search filter
        filterProducts();
    }
}

function setupFilterListeners() {
    // Add event listeners to all filter controls
    document.getElementById('category-filter').addEventListener('change', filterProducts);
    document.getElementById('condition-filter').addEventListener('change', filterProducts);
    document.getElementById('sort-filter').addEventListener('change', filterProducts);
    document.getElementById('min-price').addEventListener('input', filterProducts);
    document.getElementById('max-price').addEventListener('input', filterProducts);
    document.getElementById('search-input').addEventListener('input', filterProducts);
}

function loadProducts() {
    // Get products from localStorage or use sample products if none exist
    let products = JSON.parse(localStorage.getItem('products')) || [];
    
    // If no products in localStorage, use sample products from products.js
    if (products.length === 0 && typeof sampleProducts !== 'undefined') {
        products = sampleProducts;
    }
    
    // Store the products in a global variable for filtering
    window.allProducts = products;
    
    // Display the products
    filterProducts();
}

function filterProducts() {
    const products = window.allProducts || [];
    const categoryFilter = document.getElementById('category-filter').value;
    const conditionFilter = document.getElementById('condition-filter').value;
    const sortFilter = document.getElementById('sort-filter').value;
    const minPrice = document.getElementById('min-price').value ? parseFloat(document.getElementById('min-price').value) : 0;
    const maxPrice = document.getElementById('max-price').value ? parseFloat(document.getElementById('max-price').value) : Infinity;
    const searchQuery = document.getElementById('search-input').value.toLowerCase();
    
    // Filter products based on criteria
    let filteredProducts = products.filter(product => {
        // Category filter
        if (categoryFilter !== 'all' && product.category !== categoryFilter) {
            return false;
        }
        
        // Condition filter
        if (conditionFilter !== 'all' && product.condition !== conditionFilter) {
            return false;
        }
        
        // Price filter
        if (product.price < minPrice || product.price > maxPrice) {
            return false;
        }
        
        // Search query
        if (searchQuery && !product.title.toLowerCase().includes(searchQuery) && 
            !product.description.toLowerCase().includes(searchQuery)) {
            return false;
        }
        
        return true;
    });
    
    // Sort products
    switch (sortFilter) {
        case 'price-asc':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'newest':
        default:
            // Assuming newer products have higher IDs
            filteredProducts.sort((a, b) => b.id - a.id);
            break;
    }
    
    // Display products
    displayProducts(filteredProducts);
}

function displayProducts(products) {
    const productContainer = document.getElementById('product-container');
    
    if (products.length === 0) {
        productContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>No items found</h3>
                <p>Try adjusting your filters or search terms</p>
            </div>
        `;
        return;
    }
    
    // Create product grid
    let html = '<div class="product-grid">';
    
    products.forEach(product => {
        html += `
            <div class="product-card">
                <div class="price-tag">$${product.price.toFixed(2)}</div>
                <div class="product-image">
                    <img src="${product.image}" alt="${product.title}" onerror="this.onerror=null; this.src='https://via.placeholder.com/300x200?text=FlipNest';">
                </div>
                <div class="product-info">
                    <h3 class="product-title"><a href="product.html?id=${product.id}">${product.title}</a></h3>
                    <div class="product-meta">
                        <span>Seller: ${product.seller}</span>
                    </div>
                    <div class="product-condition">Condition: ${product.condition}</div>
                </div>
                <div class="product-actions">
                    <button class="btn view-details" onclick="window.location.href='product.html?id=${product.id}'">
                        VIEW DETAILS
                    </button>
                    <button class="btn add-to-cart" onclick="addToCart(${product.id})">
                        ADD TO CART
                    </button>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    
    // Add pagination if there are many products
    if (products.length > 12) {
        // Simple pagination for demonstration
        html += `
            <div class="pagination">
                <button class="pagination-btn" disabled>&laquo; Prev</button>
                <button class="pagination-btn active">1</button>
                <button class="pagination-btn">2</button>
                <button class="pagination-btn">3</button>
                <button class="pagination-btn">Next &raquo;</button>
            </div>
        `;
    }
    
    productContainer.innerHTML = html;
}

// Function to add item to cart
function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product is already in cart
    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
        // Increment quantity if already in cart
        existingItem.quantity += 1;
    } else {
        // Find product details
        const products = window.allProducts || [];
        const product = products.find(p => p.id === productId);
        
        if (product) {
            // Add new item to cart
            cart.push({
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
                seller: product.seller,
                quantity: 1
            });
        }
    }
    
    // Save updated cart
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // Show confirmation
    alert('Item added to cart!');
}
