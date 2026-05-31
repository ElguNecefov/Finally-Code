import React from 'react'
import { X, User, CheckCircle2, Star, MapPin, ShoppingCart, Heart } from 'lucide-react'
import { useShop } from '../../context/ShopContext'
import './ProductModal.css'

export default function ProductModal({ product, open, onClose }) {
  const { toggleFavorite, isFavorite, addToCart } = useShop()
  const fav = isFavorite(product.id)
  if (!open) return null

  return (
    <div className="moverlay" onClick={onClose}>
      <div className="mdialog" onClick={e => e.stopPropagation()}>
        <button className="mclose" onClick={onClose}><X size={18} /></button>
        <div className="mgrid">
          <div className="mimg-side">
            {product.image
              ? <img src={product.image} alt={product.name} className="mimg" />
              : <div className="mnoimg">Şəkil mövcud deyil</div>}
            <span className="mbadge">{product.condition}</span>
          </div>
          <div className="minfo">
            <h2 className="mtitle">{product.name}</h2>
            <div className="mseller">
              <div className="mavatar"><User size={15} /></div>
              <div>
                <div className="mseller-name">{product.seller} <CheckCircle2 size={12} className="mcheck" /></div>
                <div className="mrating"><Star size={11} className="mstar" /> {product.rating} reytinq ({product.reviewCount} rəy)</div>
              </div>
            </div>
            <div className="mdivider" />
            <p className="mdesc">{product.description || 'Ətraflı məlumat üçün satıcı ilə əlaqə saxlayın.'}</p>
            <div className="mmeta">
              <span><MapPin size={13} /> {product.location}</span>
              <span className="mcatag">Kateqoriya: {product.category}</span>
            </div>
            <div className="mfooter">
              <div>
                <div className="mplabel">Qiymət</div>
                <div className="mprice">{product.price}₼</div>
              </div>
              <div className="mbtns">
                <button className="mcart" onClick={() => { addToCart(product); onClose() }}>
                  <ShoppingCart size={17} /> Səbətə at
                </button>
                <button className={`mfav ${fav ? 'mfav-on' : ''}`} onClick={() => toggleFavorite(product)}>
                  <Heart size={17} style={fav ? { fill: 'currentColor' } : {}} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}