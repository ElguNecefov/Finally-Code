const API = 'https://dummyjson.com/products';
const cache = {};

let products = [];

let favorites = [];
let cart = [];

try {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
        const parsed = JSON.parse(savedFavorites);
        favorites = Array.isArray(parsed) ? parsed : [];
    }

    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        const parsed = JSON.parse(savedCart);
        cart = Array.isArray(parsed) ? parsed : [];
    }
} catch (e) {
    console.error('localStorage xətası:', e);
    favorites = [];
    cart = [];
}

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
    updateCounts();
    loadAllCategories();
    setupEvents();
});

async function loadAllCategories() {
    try {
        const [p, l, t, a, mw, ww] = await Promise.all([
            fetch(`${API}/category/smartphones?limit=50`),
            fetch(`${API}/category/laptops?limit=50`),
            fetch(`${API}/category/tablets?limit=50`),
            fetch(`${API}/category/mobile-accessories?limit=50`),
            fetch(`${API}/category/mens-watches?limit=50`),
            fetch(`${API}/category/womens-watches?limit=50`)
        ]);

        const [pd, ld, td, ad, mwd, wwd] = await Promise.all([p.json(), l.json(), t.json(), a.json(), mw.json(), ww.json()]);

        const audioKw = ['airpod', 'beats', 'earphone', 'headphone', 'echo', 'homepod', 'speaker'];
        const accKw = ['charger', 'case', 'battery', 'cable', 'monopod', 'selfie', 'magSafe'];

        const accs = ad.products || [];
        const audio = accs.filter(p => audioKw.some(k => p.title?.toLowerCase().includes(k)));
        const accessories = accs.filter(p => {
            const t = p.title?.toLowerCase() || '';
            return accKw.some(k => t.includes(k)) && !audioKw.some(k => t.includes(k));
        });
        const watches = [...(mwd.products || []), ...(wwd.products || []), ...accs.filter(p => p.title?.toLowerCase().includes('watch'))];

        cache.smartphones = pd.products || [];
        cache.notebooks = ld.products || [];
        cache.tablets = td.products || [];
        cache.audio = audio;
        cache.accessories = accessories;
        cache.watches = watches;
        cache.all = [...cache.smartphones, ...cache.notebooks, ...cache.tablets, ...audio, ...accessories, ...watches];

        fetchProducts('', 'all');
    } catch (e) {
        productsGrid.innerHTML = `<div class="error">Xəta: ${e.message}</div>`;
    }
    
    favorites = favorites.filter(id => products.some(p => p.id === id));
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateCounts();
}

async function fetchProducts(query = '', category = 'all') {
    productsGrid.innerHTML = '<div class="loading"></div>';

    let base = [];
    if (query) {
        const q = query.toLowerCase();
        base = (cache.all || []).filter(p => p.title?.toLowerCase().includes(q) || p.brand?.toLowerCase().includes(q));
    } else if (category !== 'all' && cache[category]) {
        base = cache[category];
    } else {
        base = cache.all || [];
    }

    if (!base.length) {
    productsGrid.innerHTML = '<div class="error">Məhsul tapılmadı</div>';
    productsCount.textContent = '0 məhsul';  
    return;
}

    let final = [];
    if (category === 'all' || query) {
        final = base.map(p => format(p, p.id));
    } else {
        const colors = ['Black', 'White', 'Silver', 'Gold', 'Blue'];
        const storages = ['64GB', '128GB', '256GB', '512GB', '1TB'];
        base.forEach(p => {
            const count = Math.floor(Math.random() * 2) + 2;
            for (let i = 0; i < count; i++) {
                const c = colors[Math.floor(Math.random() * colors.length)];
                const s = storages[Math.floor(Math.random() * storages.length)];
                final.push(format(p, p.id * 100 + i, `${p.title} - ${c} ${s}`));
            }
        });
        final.sort(() => Math.random() - 0.5);
    }

    products = final;
    displayProducts(products);
    productsCount.textContent = `${products.length} məhsul`;
}

function format(p, id, name = null) {
    const price = p.price || 100;
    const discount = p.discountPercentage || Math.floor(Math.random() * 30) + 5;
    const images = p.images?.length ? p.images : [p.thumbnail || 'https://via.placeholder.com/400'];

    return {
        id, name: name || p.title, brand: p.brand || 'Unknown',
        price: (price * (1 - discount / 100)).toFixed(2),
        oldPrice: price, discount: Math.round(discount),
        image: p.thumbnail || images[0], images,
        rating: p.rating || (Math.random() * 2 + 3).toFixed(1),
        ratingCount: Math.floor(Math.random() * 500) + 50,
        description: p.description || 'Məhsul haqqında',
        category: p.category || 'electronics',
        location: 'Bakı', stock: p.stock || Math.floor(Math.random() * 30) + 1
    };
}

function displayProducts(list) {
    productsGrid.innerHTML = list.map(p => `
        <div class="product-card" data-id="${p.id}">
            <div class="product-image">
                <img src="${p.image}" alt="${p.name}">
                ${p.discount ? `<span class="discount-badge">-${p.discount}%</span>` : ''}
                <button class="favorite-btn-card ${favorites.includes(p.id) ? 'active' : ''}" data-id="${p.id}">
                    <i class="${favorites.includes(p.id) ? 'fas' : 'far'} fa-heart"></i>
                </button>
            </div>
            <div class="product-info">
                <h3 class="product-title">${p.name}</h3>
                <div class="product-meta">
                    <span class="brand"><span class="brand-dot"></span>${p.brand}</span>
                    <span class="rating"><i class="fas fa-star"></i>${p.rating}</span>
                    <span class="rating-count">(${p.ratingCount})</span>
                </div>
                <div class="location"><i class="fas fa-map-marker-alt"></i>${p.location}</div>
                <div class="product-footer">
                    <div class="price">${p.price}₼</div>
                    <button class="view-btn" data-id="${p.id}">Bax</button>
                </div>
            </div>
        </div>
    `).join('');

    document.querySelectorAll('.view-btn').forEach(b => b.onclick = () => openModal(parseInt(b.dataset.id)));
    document.querySelectorAll('.favorite-btn-card').forEach(b => b.onclick = (e) => { e.stopPropagation(); toggleFav(parseInt(b.dataset.id)); });
    document.querySelectorAll('.product-card').forEach(c => c.onclick = () => openModal(parseInt(c.dataset.id)));
}

