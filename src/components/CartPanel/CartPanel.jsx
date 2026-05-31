import React from 'react'
import { X, ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react'
import { useShop } from '../../context/ShopContext'
import './CartPanel.css'

export default function CartPanel({ open, onClose }) {
  const { cart, cartTotal, removeFromCart, updateQuantity } = useShop()
  return (
    <>
      {open && <div className="cpnl-overlay" onClick={onClose} />}
      <div className={`cpnl ${open ? 'cpnl-open' : ''}`}>
        <div className="cpnl-hdr">
          <h2 className="cpnl-title">Səbət</h2>
          <button className="cpnl-close" onClick={onClose}><X size={17} /></button>
        </div>
        <div className="cpnl-body">
          {cart.length === 0
            ? <div className="cpnl-empty"><ShoppingCart size={42} className="cpnl-empty-ico" /><p>Səbətiniz boşdur.</p></div>
            : cart.map(item => (
              <div key={item.id} className="citem">
                <div className="cthumb">
                  {item.image ? <img src={item.image} alt={item.name} /> : <span className="cnophoto">Şəkil yoxdur</span>}
                </div>
                <div className="citem-info">
                  <div className="citem-top">
                    <p className="citem-name">{item.name}</p>
                    <button className="cremove" onClick={() => removeFromCart(item.id)}><Trash2 size={14} /></button>
                  </div>
                  <div className="citem-bot">
                    <span className="citem-price">{item.price}₼</span>
                    <div className="cqty">
                      <button className="cqty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus size={11} /></button>
                      <span className="cqty-num">{item.quantity}</span>
                      <button className="cqty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={11} /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
        {cart.length > 0 && (
          <div className="cpnl-foot">
            <div className="ctotal"><span>Cəmi:</span><span className="ctotal-amt">{cartTotal}₼</span></div>
            <button className="ccheckout">Sifarişi Tamamla</button>
          </div>
        )}
      </div>
    </>
  )
}