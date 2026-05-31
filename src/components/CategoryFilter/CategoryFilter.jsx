import React from 'react'
import './CategoryFilter.css'

const CATS = ['Hamısı','Smartfonlar','Smart saatlar','Noutbuklar','Planşetlər','Audio','Kameralar','Oyun','Aksesuarlar']

export default function CategoryFilter({ selected, onSelect }) {
  return (
    <div className="catbar">
      <div className="catbar-inner">
        {CATS.map(c => (
          <button key={c} onClick={() => onSelect(c)} className={`catpill ${selected === c ? 'catpill-on' : ''}`}>{c}</button>
        ))}
      </div>
    </div>
  )
}
