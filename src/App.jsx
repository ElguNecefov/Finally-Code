// import React from 'react';
// import Header from './components/Header/Header';
// import HeroSection from './components/HeroSection/HeroSection';
// import CategoryCard from './components/CategoryCard/CategoryCard';
// import ProductCard from './components/ProductCard/ProductCard';
// import Footer from './components/Footer/Footer';


// import { Laptop, Smartphone, Headphones, Watch } from 'lucide-react';

// function App() {
//   return (
//     <div>
//       {/* 1. Səhifənin Yuxarı Hissəsi */}
//       <Header cartCount={3} />
      
//       {/* 2. Giriş Banneri */}
//       <HeroSection />
      
//       <main style={{ maxWidth: '1280px', margin: '40px auto', padding: '0 16px' }}>
        
//         {/* 3. Kateqoriyalar Bölməsi */}
//         <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px' }}>
//           Shop by Category
//         </h2>
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '48px' }}>
//           <CategoryCard name="Laptops" icon={Laptop} productCount={120} />
//           <CategoryCard name="Smartphones" icon={Smartphone} productCount={85} />
//           <CategoryCard name="Audio" icon={Headphones} productCount={43} />
//           <CategoryCard name="Wearables" icon={Watch} productCount={29} />
//         </div>

//         <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', marginBottom: '48px' }} />

//         {/* 4. Məhsullar Bölməsi */}
//         <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px' }}>
//           Trending Products
//         </h2>
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '24px' }}>
//           <ProductCard 
//             name="Wireless Noise-Canceling Headphones" 
//             price={199.99} 
//             originalPrice={249.99} 
//             rating={4.5} 
//             reviews={128} 
//             imageUrl="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500" 
//             badge="Sale"
//           />
//           <ProductCard 
//             name="Ultra-Thin 14-inch Laptop - 512GB SSD" 
//             price={899.00} 
//             rating={4.8} 
//             reviews={64} 
//             imageUrl="https://images.unsplash.com/photo-1496181130204-755241524eab?w=500" 
//           />
//         </div>

//       </main>

//       {/* 5. Səhifənin Sonu */}
//       <Footer />
//     </div>
//   );
// }

// export default App;


import React from 'react'
import { ShopProvider } from './context/ShopContext'
import Home from './pages/Home/Home'

export default function App() {
  return (
    <ShopProvider>
      <Home />
    </ShopProvider>
  )
}