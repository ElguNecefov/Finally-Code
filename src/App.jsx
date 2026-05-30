import React from 'react';
import Header from './components/Header/Header';
import CategoryCard from './components/CategoryCard/CategoryCard';

// İkonları Lucide-dən import edirik
import { Laptop, Smartphone, Headphones, Watch } from 'lucide-react';

function App() {
  return (
    <div>
      <Header cartCount={3} />
      
      <main style={{ maxWidth: '1280px', margin: '40px auto', padding: '0 16px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px' }}>
          Shop by Category
        </h2>
        
        {/* Kartların yan-yana düzülməsi üçün qrid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
          <CategoryCard name="Laptops" icon={Laptop} productCount={120} />
          <CategoryCard name="Smartphones" icon={Smartphone} productCount={85} />
          <CategoryCard name="Audio" icon={Headphones} productCount={43} />
          <CategoryCard name="Wearables" icon={Watch} productCount={29} />
        </div>
      </main>
    </div>
  );
}

export default App;