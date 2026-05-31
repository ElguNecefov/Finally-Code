import React from 'react'
import { X, Heart } from 'lucide-react'
import { useShop } from '../../context/ShopContext'
import './FavoritesPanel.css'

export default function FavoritesPanel({ open, onClose }) {
  const { favorites } = useShop()
  return (
    <>
      {open && <div className="pnl-overlay" onClick={onClose} />}
      <div className={`pnl ${open ? 'pnl-open' : ''}`}>
        <div className="pnl-hdr">
          <h2 className="pnl-title">Sevimlilər ({favorites.length})</h2>
          <button className="pnl-close" onClick={onClose}><X size={17} /></button>
        </div>
        <div className="pnl-body">
          {favorites.length === 0
            ? <div className="pnl-empty"><Heart size={42} className="pnl-empty-ico" /><p>Heç bir məhsul əlavə edilməyib.</p></div>
            : favorites.map(item => (
              <div key={item.id} className="pnl-item">
                <div className="pnl-thumb">
                  {item.image ? <img src={item.image} alt={item.name} /> : <span className="pnl-nophoto">Şəkil yoxdur</span>}
                </div>
                <div className="pnl-item-info">
                  <p className="pnl-item-name">{item.name}</p>
                  <p className="pnl-item-price">{item.price}₼</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  )
}