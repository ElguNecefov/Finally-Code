import React, { useState } from 'react'
import Header from '../../components/Header/Header'
import CategoryFilter from '../../components/CategoryFilter/CategoryFilter'
import ProductCard from '../../components/ProductCard/ProductCard'
import products from '../../data/products'

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('Hamısı')
  const [searchTerm, setSearchTerm] = useState('')

  // Məhsulları kateqoriyaya və axtarış sözünə görə filtrləyirik
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'Hamısı' || product.category === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.seller.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Yalnız aktiv və daxili dolu olan komponentləri saxladıq */}
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
      <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
      
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px 40px 20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111' }}>Məhsullar</h2>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>{filteredProducts.length} məhsul tapıldı</p>
        </div>

        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
            <p>Axtarışınıza uyğun məhsul tapılmadı.</p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
            gap: '24px' 
          }}>
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}