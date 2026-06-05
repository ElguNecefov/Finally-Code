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

function openModal(id) {
    const p = products.find(x => x.id === id);
    if (!p) return;
    currentProduct = p;

    modalImage.src = p.image;
    modalTitle.textContent = p.name;
    modalStars.innerHTML = '★'.repeat(Math.floor(p.rating)) + '☆'.repeat(5 - Math.floor(p.rating));
    modalRatingCount.textContent = `(${p.ratingCount})`;
    modalLocation.textContent = p.location;
    modalPrice.textContent = `${p.price}₼`;
    modalOldPrice.textContent = `${p.oldPrice}₼`;
    modalDiscount.textContent = `-${p.discount}%`;
    modalDescription.textContent = p.description;
    modalBrand.textContent = p.brand;
    modalCategory.textContent = p.category;
    modalStock.textContent = `${p.stock} ədəd`;

    const favBtn = document.getElementById('modalFavoriteBtn');
    favBtn.className = `favorite-btn ${favorites.includes(p.id) ? 'active' : ''}`;
    favBtn.innerHTML = `<i class="${favorites.includes(p.id) ? 'fas' : 'far'} fa-heart"></i>`;

    thumbnailImages.innerHTML = p.images.map((img, i) => `<div class="thumbnail ${i === 0 ? 'active' : ''}"><img src="${img}"></div>`).join('');
    productModal.classList.add('active');
}

function toggleFav(id) {
    const i = favorites.indexOf(id);
    if (i > -1) {
        favorites.splice(i, 1);
        showToast('Silindi');
    } else {
        favorites.push(id);
        showToast('Əlavə edildi');
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    
    
    const favCountEl = document.getElementById('favoritesCount');
    if (favCountEl) {
        favCountEl.textContent = favorites.length;
    }
    

    const modalFavBtn = document.getElementById('modalFavoriteBtn');
    if (modalFavBtn && currentProduct && currentProduct.id === id) {
        const isFav = favorites.includes(id);
        modalFavBtn.className = `favorite-btn ${isFav ? 'active' : ''}`;
        modalFavBtn.innerHTML = `<i class="${isFav ? 'fas' : 'far'} fa-heart"></i>`;
    }
    
    
    displayProducts(products);
    if (favoritesSection.classList.contains('active')) {
        displayFavorites();
    }
}
function displayFavorites() {
    const fav = products.filter(p => favorites.includes(p.id));
    if (!fav.length) {
        favoritesGrid.innerHTML = '<div class="empty-state"><i class="far fa-heart"></i><p>Boşdur</p></div>';
        favoritesCountText.textContent = '0 məhsul';
    } else {
        favoritesGrid.innerHTML = fav.map(p => `
            <div class="product-card" data-id="${p.id}">
                <div class="product-image">
                    <img src="${p.image}">
                    <button class="favorite-btn-card active" data-id="${p.id}">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
                <div class="product-info">
                    <h3 class="product-title">${p.name}</h3>
                    <div class="price">${p.price}₼</div>
                    <button class="view-btn" data-id="${p.id}">Bax</button>
                </div>
            </div>
        `).join('');
        favoritesCountText.textContent = `${fav.length} məhsul`;

        
        document.querySelectorAll('#favoritesGrid .view-btn').forEach(b => {
            b.onclick = () => openModal(parseInt(b.dataset.id));
        });
        document.querySelectorAll('#favoritesGrid .favorite-btn-card').forEach(b => {
            b.onclick = (e) => { e.stopPropagation(); toggleFav(parseInt(b.dataset.id)); };
        });
    }
}
function addToCart(id) {
    const p = products.find(x => x.id === id);
    if (!p) return;
    const item = cart.find(x => x.id === id);
    if (item) item.quantity++;
    else cart.push({ id: p.id, name: p.name, brand: p.brand, price: p.price, image: p.image, quantity: 1 });
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCounts();
    showToast('Səbətə əlavə edildi');
    if (cartSection.classList.contains('active')) displayCart();
}

function updateQty(id, change) {
    const item = cart.find(x => x.id === id);
    if (!item) return;
    const newQty = item.quantity + change;
    if (newQty < 1) return;
    item.quantity = newQty;
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCounts();
    displayCart();
}

function removeFromCart(id) {
    cart = cart.filter(x => x.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCounts();
    displayCart();
    showToast('Silindi');
}

function displayCart() {
    if (!cart.length) {
        cartItems.innerHTML = '<div class="empty-state"><i class="fas fa-shopping-cart"></i><p>Boşdur</p></div>';
        cartItemCount.textContent = '0';
        cartTotalAmount.textContent = '0₼';
        cartTotal.textContent = '0₼';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image"><img src="${item.image}"></div>
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-brand">${item.brand}</div>
                <div class="cart-item-price">${item.price}₼</div>
            </div>
            <div class="cart-item-controls">
                <div class="quantity-control">
                    <button class="quantity-btn" onclick="updateQty(${item.id}, -1)" ${item.quantity <= 1 ? 'disabled' : ''}>−</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQty(${item.id}, 1)">+</button>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})"><i class="fas fa-trash-alt"></i></button>
            </div>
        </div>
    `).join('');

    const total = cart.reduce((s, i) => s + i.quantity, 0);
    const amount = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    cartItemCount.textContent = total;
    cartTotalAmount.textContent = `${amount.toFixed(2)}₼`;
    cartTotal.textContent = `${amount.toFixed(2)}₼`;
}

function updateCounts() {
    const favCount = document.getElementById('favoritesCount');
    const cartCountEl = document.getElementById('cartCount');

    if (favCount) {
        favCount.textContent = favorites.length;
    }

    if (cartCountEl) {
        const total = cart.reduce((s, i) => s + (i.quantity || 1), 0);
        cartCountEl.textContent = total;
    }
}

function showToast(msg) {
    toastMessage.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 1500);
}

function showSection(s) {
    productsSection.classList.remove('active');
    favoritesSection.classList.remove('active');
    cartSection.classList.remove('active');
    if (s === 'products') productsSection.classList.add('active');
    else if (s === 'favorites') { favoritesSection.classList.add('active'); displayFavorites(); }
    else if (s === 'cart') { cartSection.classList.add('active'); displayCart(); }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setupEvents() {
    searchBtn.onclick = () => {
        const q = searchInput.value.trim();
        if (q) { currentCategory = 'all'; categoryBtns.forEach(b => b.classList.toggle('active', b.dataset.category === 'all')); fetchProducts(q); }
    };

    categoryBtns.forEach(b => b.onclick = () => {
        currentCategory = b.dataset.category;
        categoryBtns.forEach(x => x.classList.toggle('active', x === b));
        searchInput.value = '';
        fetchProducts('', currentCategory);
    });

    favoritesBtn.onclick = () => showSection('favorites');
    cartBtn.onclick = () => showSection('cart');
    backToProducts.onclick = () => showSection('products');
    backToProductsCart.onclick = () => showSection('products');
    modalClose.onclick = () => { productModal.classList.remove('active'); currentProduct = null; };
    modalFavoriteBtn.onclick = () => { if (currentProduct) toggleFav(currentProduct.id); };
    addToCartBtn.onclick = () => { if (currentProduct) addToCart(currentProduct.id); };
    productModal.onclick = (e) => { if (e.target === productModal) { productModal.classList.remove('active'); currentProduct = null; } };
    document.onkeydown = (e) => { if (e.key === 'Escape' && productModal.classList.contains('active')) { productModal.classList.remove('active'); currentProduct = null; } };
    document.querySelector('.checkout-btn').onclick = () => showToast('Tezliklə');
}

window.updateQty = updateQty;
window.removeFromCart = removeFromCart;