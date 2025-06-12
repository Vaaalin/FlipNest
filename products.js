// Products JavaScript file for FlipNest e-commerce platform

// Sample product data (this would normally come from a database)
const sampleProducts = [
    {
        id: 1,
        title: "Apple MacBook Pro 2020",
        description: "Barely used MacBook Pro with M1 chip, 8GB RAM, 256GB SSD. In excellent condition.",
        price: 89999,
        seller: "John Doe",
        location: "Nairobi, NBO",
        date: "2025-05-20",
        category: "electronics",
        image: "images/apple mackbook.jpg",
        condition: "Like New"
    },
    {
        id: 2,
        title: "Vintage Leather Sofa",
        description: "Beautiful vintage leather sofa in brown. Some wear but in good condition. Very comfortable.",
        price: 35000,
        seller: "Sarah Murigi",
        location: "Mombasa, MSA",
        date: "2025-05-18",
        category: "furniture",
        image: "images/vintagesofa.jpg",
        condition: "Good"
    },
    {
        id: 3,
        title: "Canon EOS 5D Mark IV",
        description: "Professional DSLR camera with 24-70mm lens. Low shutter count, includes carrying case.",
        price: 120000,
        seller: "Mumtaaz Abdinur",
        location: "Mandera",
        date: "2025-05-21",
        category: "electronics",
        image: "images/camera.jpg",
        condition: "Excellent"
    },
    {
        id: 4,
        title: "Designer Dress - Size M",
        description: "Brand name designer dress, only worn once for a special occasion. Original price 30000 ksh.",
        price: 8500,
        seller: "Stacy Wanjiku",
        location: "Kisumu, KSM",
        date: "2025-05-19",
        category: "clothing",
        image: "images/dress.jpg",
        condition: "Like New"
    },
    {
        id: 5,
        title: "Harry Potter Complete Book Set",
        description: "All 7 Harry Potter books in hardcover. Some minor wear on the covers but pages are in perfect condition.",
        price: 6500,
        seller: "Affan Abubakar",
        location: "Nairobi, NBO",
        date: "2025-05-17",
        category: "books",
        image: "images/books.jpg",
        condition: "Good"
    },
    {
        id: 6,
        title: "Dining Table with 4 Chairs",
        description: "Solid wood dining table set. Table is 60\" x 36\" and comes with 4 matching chairs.",
        price: 22000,
        seller: "Ralph Mwangi",
        location: "Thika, THK",
        date: "2025-05-16",
        category: "furniture",
        image: "images/diningtable.jpg",
        condition: "Good"
    }
];

// Function to load featured products on the homepage
function loadFeaturedProducts() {
    const featuredProductsContainer = document.getElementById('featured-products');
    
    if (!featuredProductsContainer) return;
    
    // Clear loading message
    featuredProductsContainer.innerHTML = '';
    
    // Display products
    for (const product of sampleProducts) {
    const productCard = createProductCard(product);
    featuredProductsContainer.appendChild(productCard);
}
}

// Function to create a product card element
function createProductCard(product) {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.dataset.id = product.id;
    
    // Format price with commas and two decimal places
    const formattedPrice = product.price.toLocaleString('en-US', {
        style: 'currency',
        currency: 'KSH'
    });
    
    // Format date to be more readable
    const productDate = new Date(product.date);
    const formattedDate = productDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    
    productCard.innerHTML = `
    
        <div class="product-image">
         <div class="product-price">${formattedPrice}</div>
            <img src="${product.image}" alt="${product.title}" onerror="this.src='https://via.placeholder.com/300x220?text=Product+Image'">
            
        </div>
        <div class="product-details">
            <h3 class="product-title">${product.title}</h3>
            <p class="product-seller">Seller: ${product.seller}</p>
            <p class="product-description">${product.description.substring(0, 100)}${product.description.length > 100 ? '...' : ''}</p>
            <div class="product-meta">
                <span class="product-location"><i class="fas fa-map-marker-alt"></i> ${product.location}</span>
                <span class="product-date"><i class="far fa-calendar-alt"></i> ${formattedDate}</span>
            </div>
            <div class="product-condition">Condition: <span>${product.condition}</span></div>
            <div class="product-actions">
                <a href="product-details.html?id=${product.id}" class="btn btn-primary">View Details</a>
                <button class="btn btn-secondary add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        </div>
    `;
    
    // Add event listener to "Add to Cart" button
    productCard.querySelector('.add-to-cart').addEventListener('click', (e) => {
        e.preventDefault();
        addToCart(product);
    });
    
    return productCard;
}

// Function to add a product to the cart
function addToCart(product) {
    // Get current cart from localStorage or initialize empty array
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product is already in cart
    const existingProductIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingProductIndex !== -1) {
        // Product already in cart, increment quantity
        cart[existingProductIndex].quantity += 1;
    } else {
        // Add new product to cart with quantity 1
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Show notification
    if (window.flipnest && window.flipnest.showNotification) {
        window.flipnest.showNotification(`${product.title} added to cart!`, 'success');
    } else {
        alert(`${product.title} added to cart!`);
    }
    
    // Update cart count in the UI
    updateCartCount();
}

// Function to update the cart count in the UI
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Create or update cart count element
    let cartCountElement = document.querySelector('.cart-count');
    
    if (!cartCountElement) {
        cartCountElement = document.createElement('span');
        cartCountElement.className = 'cart-count';
        const cartLink = document.querySelector('a[href="cart.html"]');
        if (cartLink) {
            cartLink.appendChild(cartCountElement);
        }
    }
    
    if (cartCount > 0) {
        cartCountElement.textContent = cartCount;
        cartCountElement.style.display = 'inline-block';
    } else {
        cartCountElement.style.display = 'none';
    }
    
    // Add cart count styles if not already added
    if (!document.getElementById('cart-count-styles')) {
        const style = document.createElement('style');
        style.id = 'cart-count-styles';
        style.textContent = `
            .cart-count {
                display: inline-block;
                background-color: var(--secondary-color);
                color: white;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                font-size: 12px;
                text-align: center;
                line-height: 20px;
                position: absolute;
                top: -10px;
                right: -10px;
            }
            
            a[href="cart.html"] {
                position: relative;
            }
        `;
        document.head.appendChild(style);
    }
}

// Function to load products by category
function loadProductsByCategory(category) {
    const productsContainer = document.getElementById('category-products');
    
    if (!productsContainer) return;
    
    // Clear container
    productsContainer.innerHTML = '';
    
    // Filter products by category
    const filteredProducts = category ? 
        sampleProducts.filter(product => product.category === category) : 
        sampleProducts;
    
    if (filteredProducts.length === 0) {
        productsContainer.innerHTML = '<p class="no-products">No products found in this category.</p>';
        return;
    }
    
    // Display filtered products
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsContainer.appendChild(productCard);
    });
}

// Function to search products
function searchProducts(query) {
    if (!query) return sampleProducts;
    
    query = query.toLowerCase();
    
    return sampleProducts.filter(product => 
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.seller.toLowerCase().includes(query) ||
        product.location.toLowerCase().includes(query)
    );
}

// Function to load search results
function loadSearchResults() {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query');
    
    const searchResultsContainer = document.getElementById('search-results');
    const searchQueryElement = document.getElementById('search-query');
    
    if (!searchResultsContainer) return;
    
    if (searchQueryElement) {
        searchQueryElement.textContent = query || 'all products';
    }
    
    // Clear container
    searchResultsContainer.innerHTML = '';
    
    // Search products
    const results = query ? searchProducts(query) : sampleProducts;
    
    if (results.length === 0) {
        searchResultsContainer.innerHTML = `<p class="no-results">No products found matching "${query}".</p>`;
        return;
    }
    
    // Display search results
    results.forEach(product => {
        const productCard = createProductCard(product);
        searchResultsContainer.appendChild(productCard);
    });
}

// Initialize product functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Load featured products on homepage
    loadFeaturedProducts();
    
    // Update cart count
    updateCartCount();
    
    // Check if on category page
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    
    if (window.location.pathname.includes('categories.html') && category) {
        loadProductsByCategory(category);
        
        // Update category title
        const categoryTitleElement = document.getElementById('category-title');
        if (categoryTitleElement) {
            categoryTitleElement.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        }
    }
    
    // Check if on search results page
    if (window.location.pathname.includes('search.html')) {
        loadSearchResults();
    }
});
