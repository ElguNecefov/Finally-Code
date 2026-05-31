// import React from 'react';
// import { Search, ShoppingCart, User, Menu, Heart } from 'lucide-react';
// import './Header.css';

// function Header({ cartCount = 3 }) {
//   return (
//     <header className="site-header">
//       <div className="header-container">
//         <div className="header-left">
//           <button className="mobile-menu-btn">
//             <Menu className="icon" />
//           </button>
//           <h1 className="logo-title">TechStore</h1>
//           <nav className="desktop-nav">
//             <a href="#" className="nav-link">Categories</a>
//             <a href="#" className="nav-link">Deals</a>
//             <a href="#" className="nav-link">New Arrivals</a>
//             <a href="#" className="nav-link">Support</a>
//           </nav>
//         </div>

//         <div className="header-center">
//           <div className="search-box">
//             <Search className="search-icon" />
//             <input type="search" placeholder="Search for products..." className="search-input" />
//           </div>
//         </div>

//         <div className="header-right">
//           <button className="mobile-search-btn"><Search className="icon" /></button>
//           <button className="wishlist-btn"><Heart className="icon" /></button>
//           <button className="user-btn"><User className="icon" /></button>
//           <button className="cart-btn">
//             <ShoppingCart className="icon" />
//             {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
//           </button>
//         </div>
//       </div>
//     </header>
//   );
// }

// export default Header;



import React, { useState } from 'react'
import { Search, Bell, Heart, ShoppingCart, User } from 'lucide-react'
import { useShop } from '../../context/ShopContext'
import FavoritesPanel from '../FavoritesPanel/FavoritesPanel'
import CartPanel from '../CartPanel/CartPanel'
import './Header.css'

export default function Header({ searchTerm, setSearchTerm }) {
  const { favorites, cart } = useShop()
  const [favOpen, setFavOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0)

  return (
    <>
      <header className="hdr">
        <div className="hdr-inner">
          <div className="hdr-logo">
            <div className="hdr-logo-icon">G</div>
            <span className="hdr-logo-text">GadgetBazar</span>
          </div>

          <div className="hdr-search">
            <Search size={15} className="hdr-search-ico" />
            <input
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Gadget, brend və ya satıcı axtarın..."
              className="hdr-input"
            />
          </div>

          <div className="hdr-actions">
            <button className="hdr-btn"><Bell size={19} /></button>

            <button className="hdr-btn hdr-btn-rel" onClick={() => setFavOpen(true)}>
              <Heart size={19} />
              {favorites.length > 0 && <span className="hdr-badge hdr-badge-accent">{favorites.length}</span>}
            </button>

            <button className="hdr-btn hdr-btn-rel" onClick={() => setCartOpen(true)}>
              <ShoppingCart size={19} />
              {cartCount > 0 && <span className="hdr-badge hdr-badge-dark">{cartCount}</span>}
            </button>

            <div className="hdr-sep" />
            <button className="hdr-btn"><User size={19} /></button>
            <button className="hdr-sell">İndi Sat</button>
          </div>
        </div>
      </header>

      <FavoritesPanel open={favOpen} onClose={() => setFavOpen(false)} />
      <CartPanel open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}