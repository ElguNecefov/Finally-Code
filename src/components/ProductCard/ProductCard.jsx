// import React from 'react';
// import { Star, Heart } from 'lucide-react';
// import './ProductCard.css';

// function ProductCard({ name, price, originalPrice, rating, reviews, imageUrl, badge }) {
//   const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
//   const fallbackImage = "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=500";

//   return (
//     <div className="product-card">
//       <div className="image-container">
//         <img 
//           src={imageUrl} 
//           alt={name} 
//           className="product-img" 
//           onError={(e) => { e.target.src = fallbackImage; }} 
//         />
//         {badge && <span className="product-badge">{badge}</span>}
//         <button className="like-btn">
//           <Heart className="heart-icon" />
//         </button>
//       </div>

//       <div className="product-info">
//         <h3 className="product-title">{name}</h3>

//         <div className="rating-container">
//           {Array.from({ length: 5 }).map((_, i) => (
//             <Star key={i} className={`star ${i < Math.floor(rating) ? 'filled' : ''}`} />
//           ))}
//           <span className="reviews-count">({reviews})</span>
//         </div>

//         <div className="price-container">
//           <span className="current-price">${price.toFixed(2)}</span>
//           {originalPrice && (
//             <>
//               <span className="original-price">${originalPrice.toFixed(2)}</span>
//               <span className="discount-tag">-{discount}%</span>
//             </>
//           )}
//         </div>

//         <button className="add-to-cart-btn">Add to Cart</button>
//       </div>
//     </div>
//   );
// }

// export default ProductCard;




import React, { useState } from 'react'
import { Heart, CheckCircle2, Star, MapPin } from 'lucide-react'
import { useShop } from '../../context/ShopContext'
import ProductModal from '../ProductModal/ProductModal'
import './ProductCard.css'

export default function ProductCard({ product }) {
  const { toggleFavorite, isFavorite } = useShop()
  const [open, setOpen] = useState(false)
  const fav = isFavorite(product.id)

  return (
    <>
      <div className="pcard">
        <div className="pcard-img-wrap">
          {product.image
            ? <img src={product.image} alt={product.name} className="pcard-img" loading="lazy" />
            : <div className="pcard-noimg">Şəkil mövcud deyil</div>}
          <span className="pcard-badge">{product.condition}</span>
          <button className={`pcard-fav ${fav ? 'pcard-fav-on' : ''}`} onClick={e => { e.stopPropagation(); toggleFavorite(product) }}>
            <Heart size={15} style={fav ? { fill: 'currentColor' } : {}} />
          </button>
        </div>
        <div className="pcard-body">
          <h3 className="pcard-name">{product.name}</h3>
          <div className="pcard-seller">
            <span>{product.seller}</span>
            <CheckCircle2 size={12} className="pcard-check" />
            <span className="pcard-dot">•</span>
            <Star size={12} className="pcard-star" />
            <span>{product.rating} ({product.reviewCount})</span>
          </div>
          <div className="pcard-loc"><MapPin size={12} /><span>{product.location}</span></div>
          <div className="pcard-foot">
            <span className="pcard-price">{product.price}₼</span>
            <button className="pcard-btn" onClick={() => setOpen(true)}>Bax</button>
          </div>
        </div>
      </div>
      <ProductModal product={product} open={open} onClose={() => setOpen(false)} />
    </>
  )
}