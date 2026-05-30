import React from 'react';
import './CategoryCard.css';

// icon propuna Lucide-react kitabxanasından gələn ikonu göndərəcəksən (məsələn: Laptop, Smartphone)
function CategoryCard({ name, icon: Icon, productCount }) {
  return (
    <button className="category-card-btn">
      <div className="category-icon-wrapper">
        {Icon && <Icon className="category-icon" />}
      </div>
      <div className="category-info">
        <h3 className="category-name">{name}</h3>
        <p className="category-count">{productCount} Products</p>
      </div>
    </button>
  );
}

export default CategoryCard;