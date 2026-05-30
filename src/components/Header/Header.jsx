import React from 'react';
import { Search, ShoppingCart, User, Menu, Heart } from 'lucide-react';
import './Header.css';

function Header({ cartCount = 3 }) {
  return (
    <header className="site-header">
      <div className="header-container">
        <div className="header-left">
          <button className="mobile-menu-btn">
            <Menu className="icon" />
          </button>
          <h1 className="logo-title">TechStore</h1>
          <nav className="desktop-nav">
            <a href="#" className="nav-link">Categories</a>
            <a href="#" className="nav-link">Deals</a>
            <a href="#" className="nav-link">New Arrivals</a>
            <a href="#" className="nav-link">Support</a>
          </nav>
        </div>

        <div className="header-center">
          <div className="search-box">
            <Search className="search-icon" />
            <input type="search" placeholder="Search for products..." className="search-input" />
          </div>
        </div>

        <div className="header-right">
          <button className="mobile-search-btn"><Search className="icon" /></button>
          <button className="wishlist-btn"><Heart className="icon" /></button>
          <button className="user-btn"><User className="icon" /></button>
          <button className="cart-btn">
            <ShoppingCart className="icon" />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;