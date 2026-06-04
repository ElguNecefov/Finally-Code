// YENİ AMAZON API
const API_URL = 'https://real-time-amazon-data.p.rapidapi.com/search';
const API_KEY = 'b7e96e01dfmsh95f55f53c831621p1f1819jsn3679d2c185d1';
const API_HOST = 'real-time-amazon-data.p.rapidapi.com';

// State
let products = [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentCategory = 'all';
let currentProduct = null;

// DOM Elementler
const productsGrid = document.getElementById('productsContainer');
const favoritesGrid = document.getElementById('favoritesGrid');
const cartItems = document.getElementById('cartItems');
const productsCount = document.getElementById('productsCount');
const favoritesCountText = document.getElementById('favoritesCountText');
const favoritesCount = document.getElementById('favoritesCount');
const cartCount = document.getElementById('cartCount');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const categoryBtns = document.querySelectorAll('.category-btn');
const productsSection = document.getElementById('productsSection');
const favoritesSection = document.getElementById('favoritesSection');
const cartSection = document.getElementById('cartSection');
const productModal = document.getElementById('productModal');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');


document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    updateCounts();
    setupEventListeners();
});

// Fetch Products from Amazon API
async function fetchProducts(search = '', category = 'all') {
    console.log('=== fetchProducts başladı ===');
    console.log('Search:', search);
    console.log('Category:', category);
    
    if (!productsGrid) {
        console.error('❌ productsGrid tapılmadı!');
        return;
    }
    
    productsGrid.innerHTML = '<div class="loading">Məhsullar yüklənir...</div>';
    
    try {
        // Map categories to search 
        const categoryMap = {
            'all': 'electronics',
            'smartphones': 'smartphone iphone samsung galaxy',
            'smartwatches': 'smartwatch apple watch fitness',
            'notebooks': 'laptop macbook notebook computer',
            'tablets': 'tablet ipad samsung tab',
            'audio': 'airpods headphones earbuds speaker',
            'cameras': 'camera canon nikon dslr',
            'games': 'gaming playstation xbox console',
            'accessories': 'charger case cable accessory'
        };
        
        const query = search || categoryMap[category] || 'electronics';
        const url = `${API_URL}?query=${encodeURIComponent(query)}&page=1&country=US&sort_by=RELEVANCE&product_condition=ALL&is_prime=false&deals_and_discounts=NONE`;
        
        console.log('📡 API URL:', url);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': API_KEY,
                'X-RapidAPI-Host': API_HOST
            }
        });
        
        console.log('📥 Response status:', response.status);
        console.log('📥 Response ok:', response.ok);
        
        if (!response.ok) {
            throw new Error(`API xətası: ${response.status} - ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('📦 API cavabı (tam):', data);
        console.log('📦 data.data:', data.data);
        
        if (data.data) {
            console.log('📦 data.data.products:', data.data.products);
            console.log('📦 Məhsul sayı:', data.data.products ? data.data.products.length : 0);
        }
        
        if (data.data && data.data.products && data.data.products.length > 0) {
            console.log('✅ Məhsullar tapıldı:', data.data.products.length);
            
            // Transform Amazon API data to our format
            products = data.data.products.map((product, index) => {
                console.log(`Məhsul ${index + 1}:`, product);
                return {
                    id: product.asin || (Date.now() + index),
                    name: product.product_title || 'Məhsul',
                    brand: extractBrand(product.product_title) || 'Unknown',
                    price: parsePrice(product.product_price),
                    oldPrice: parsePrice(product.product_price) * 1.2,
                    discount: 15,
                    image: product.product_photo || 'https://via.placeholder.com/400x400',
                    images: [product.product_photo || 'https://via.placeholder.com/400x400'],
                    rating: (Math.random() * 2 + 3).toFixed(1),
                    ratingCount: Math.floor(Math.random() * 100) + 10,
                    location: 'Bakı, Azərbaycan',
                    description: product.product_title || 'Bu məhsul haqqında ətraflı məlumat tezliklə əlavə olunacaq.',
                    category: category === 'all' ? getRandomCategory() : category,
                    stock: Math.floor(Math.random() * 50) + 1
                };
            });
            
            console.log('✅ Transformasiya olundu:', products.length, 'məhsul');
            console.log('✅ İlk məhsul:', products[0]);
            
            displayProducts(products);
            updateProductsCount(products.length);
            console.log('✅ displayProducts çağrıldı');
            
        } else {
            console.warn('⚠️ Məhsul tapılmadı');
            productsGrid.innerHTML = '<div class="error">Məhsul tapılmadı</div>';
            updateProductsCount(0);
        }
        
    } catch (error) {
        console.error('❌ XƏTA:', error);
        console.error('❌ Xəta mesajı:', error.message);
        productsGrid.innerHTML = `<div class="error">Xəta baş verdi: ${error.message}</div>`;
        updateProductsCount(0);
    }
    
    console.log('=== fetchProducts bitdi ===');
}


function extractBrand(title) {
    if (!title) return 'Unknown';
    const brands = ['Apple', 'Samsung', 'Sony', 'LG', 'Dell', 'HP', 'Lenovo', 'Asus', 'Acer', 'Xiaomi', 'Huawei', 'Oppo', 'Realme', 'Google', 'Microsoft', 'Amazon', 'Canon', 'Nikon'];
    for (let brand of brands) {
        if (title.toLowerCase().includes(brand.toLowerCase())) {
            return brand;
        }
    }
    return title.split(' ')[0];
}

function parsePrice(priceStr) {
    if (!priceStr) return Math.floor(Math.random() * 1000) + 100;
    const match = priceStr.toString().match(/[\d.]+/);
    return match ? parseFloat(match[0]) : Math.floor(Math.random() * 1000) + 100;
}

function getRandomCategory() {
    const categories = ['smartphones', 'notebooks', 'tablets', 'audio', 'smartwatches', 'accessories'];
    return categories[Math.floor(Math.random() * categories.length)];
}

function showLoading() {
    productsGrid.innerHTML = '<div class="loading"></div>';
}

function displayProducts(productsToDisplay) {
    console.log('=== displayProducts başladı ===');
    console.log('Göstəriləcək məhsul sayı:', productsToDisplay.length);
    console.log('productsGrid:', productsGrid);
    
    if (!productsGrid) {
        console.error('❌ productsGrid elementi tapılmadı!');
        return;
    }
    
    if (!productsToDisplay || productsToDisplay.length === 0) {
        console.warn('⚠️ Məhsul yoxdur');
        productsGrid.innerHTML = '<div class="error">Məhsul tapılmadı</div>';
        return;
    }
    
    console.log('🎨 Məhsul kartları yaradılır...');
    
    const html = productsToDisplay.map(product => {
        console.log('Kart yaradılır:', product.name);
        return createProductCard(product);
    }).join('');
    
    console.log('📝 HTML uzunluğu:', html.length);
    console.log('📝 HTML nümunəsi:', html.substring(0, 200));
    
    productsGrid.innerHTML = html;
    
    console.log('✅ innerHTML təyin olundu');
    console.log('productsGrid.innerHTML uzunluğu:', productsGrid.innerHTML.length);
    
    // Add event listeners
    const viewBtns = document.querySelectorAll('.view-btn');
    console.log('View düymələri sayı:', viewBtns.length);
    
    viewBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = btn.dataset.id;
            console.log('View clicked:', productId);
            openProductModal(productId);
        });
    });
    
    const favBtns = document.querySelectorAll('.favorite-btn-card');
    console.log('Favorite düymələri sayı:', favBtns.length);
    
    favBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = btn.dataset.id;
            console.log('Favorite clicked:', productId);
            toggleFavorite(productId);
        });
    });
    
    const cards = document.querySelectorAll('.product-card');
    console.log('Məhsul kartları sayı:', cards.length);
    
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const productId = card.dataset.id;
            console.log('Card clicked:', productId);
            openProductModal(productId);
        });
    });
    
    console.log('=== displayProducts bitdi ===');
}

function createProductCard(product) {
    const isFavorite = favorites.includes(product.id);
    const oldPrice = product.oldPrice || (product.price * 1.2).toFixed(2);
    const discount = product.discount || Math.round(((oldPrice - product.price) / oldPrice) * 100);
    
    return `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/400x400?text=No+Image'">
                <span class="badge-new">Təzə</span>
                <button class="favorite-btn-card ${isFavorite ? 'active' : ''}" data-id="${product.id}">
                    <i class="${isFavorite ? 'fas' : 'far'} fa-heart"></i>
                </button>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-meta">
                    <span class="brand">
                        <span class="brand-dot"></span>
                        ${product.brand}
                    </span>
                    <span class="rating">
                        <i class="fas fa-star"></i>
                        ${product.rating}
                    </span>
                    <span class="rating-count">(${product.ratingCount})</span>
                </div>
                <div class="location">
                    <i class="fas fa-map-marker-alt"></i> ${product.location}
                </div>
                <div class="product-footer">
                    <div class="price">${product.price.toFixed(2)}₼</div>
                    <button class="view-btn" data-id="${product.id}">Bax</button>
                </div>
            </div>
        </div>
    `;
}