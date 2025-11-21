import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, MapPin, Phone, Clock, Menu as MenuIcon, X, Mail } from 'lucide-react';
import Hero from './components/Hero';
import MenuSection from './components/MenuSection';
import CartDrawer from './components/CartDrawer';
import WhyChooseUs from './components/WhyChooseUs';
import PopularMenu from './components/PopularMenu';
import AboutUs from './components/AboutUs';
import SearchOverlay from './components/SearchOverlay';
import { Product, CartItem } from './types';

const App: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'menu' | 'about'>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo(0, 0);
    setMobileMenuOpen(false);
  }, [currentPage]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-white text-gray-800 overflow-x-hidden flex flex-col font-sans">
      
      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-30 transition-all duration-300 ${scrolled || currentPage !== 'home' || mobileMenuOpen ? 'bg-white/95 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <button onClick={() => setCurrentPage('home')} className="flex items-center gap-2 focus:outline-none z-40 relative">
            <div className="w-10 h-10 bg-brand-green rounded-full flex items-center justify-center text-white font-bold text-xl">
              W
            </div>
            <span className="font-bold text-2xl text-brand-dark">
              Warung Sedap
            </span>
          </button>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-10 font-medium text-gray-600">
            <button 
              onClick={() => setCurrentPage('home')} 
              className={`transition-colors ${currentPage === 'home' ? 'text-brand-green font-bold' : 'hover:text-brand-green'}`}
            >
              Beranda
            </button>
            <button 
              onClick={() => setCurrentPage('menu')} 
              className={`transition-colors ${currentPage === 'menu' ? 'text-brand-green font-bold' : 'hover:text-brand-green'}`}
            >
              Menu
            </button>
            <button 
              onClick={() => setCurrentPage('about')}
              className={`transition-colors ${currentPage === 'about' ? 'text-brand-green font-bold' : 'hover:text-brand-green'}`}
            >
              Tentang Kami
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 z-40 relative">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden sm:block"
            >
               <Search size={24} className="text-gray-600" />
            </button>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:bg-brand-light rounded-full transition-colors group"
            >
              <ShoppingCart size={24} className="text-gray-800" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 bg-brand-green text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                  {cartItemCount}
                </span>
              )}
            </button>
            <button 
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
               {mobileMenuOpen ? <X /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`fixed inset-0 bg-white z-30 flex flex-col items-center justify-center gap-8 transition-transform duration-300 md:hidden ${mobileMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
            <button onClick={() => setCurrentPage('home')} className="text-2xl font-bold">Beranda</button>
            <button onClick={() => setCurrentPage('menu')} className="text-2xl font-bold">Menu</button>
            <button onClick={() => setCurrentPage('about')} className="text-2xl font-bold">Tentang Kami</button>
            <button onClick={() => {
              setMobileMenuOpen(false);
              setIsSearchOpen(true);
            }} className="text-xl text-gray-500 flex items-center gap-2"><Search size={20}/> Cari Menu</button>
        </div>
      </nav>

      {/* Content */}
      <main className="flex-grow">
        {currentPage === 'home' && (
          <>
            <Hero onViewMenu={() => setCurrentPage('menu')} />
            <WhyChooseUs />
            <PopularMenu onAddToCart={addToCart} onSeeAll={() => setCurrentPage('menu')} />
            
            {/* CTA Bottom */}
            <section className="py-24 bg-white">
               <div className="container mx-auto px-4">
                  <div className="bg-brand-green rounded-[50px] p-12 md:p-20 text-center text-white relative overflow-hidden">
                     <div className="relative z-10">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Dapatkan Diskon 10% Pesanan Pertama</h2>
                        <p className="text-green-100 max-w-xl mx-auto mb-10">
                           Berlangganan newsletter kami dan dapatkan penawaran serta promo eksklusif langsung ke inbox Anda.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-lg mx-auto">
                           <input 
                             type="email" 
                             placeholder="Masukkan email Anda" 
                             className="px-6 py-4 rounded-full text-gray-800 flex-1 focus:outline-none"
                           />
                           <button className="bg-brand-dark text-white px-8 py-4 rounded-full font-bold hover:bg-gray-800 transition-colors">
                              Berlangganan
                           </button>
                        </div>
                     </div>
                     {/* Background Circles */}
                     <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                     <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full translate-x-1/3 translate-y-1/3"></div>
                  </div>
               </div>
            </section>
          </>
        )}

        {currentPage === 'menu' && (
          <div className="pt-20">
             <MenuSection onAddToCart={addToCart} />
          </div>
        )}

        {currentPage === 'about' && (
          <AboutUs />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-brand-dark text-white pt-20 pb-10">
        <div className="container mx-auto px-8 grid md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-6 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-brand-green rounded-full flex items-center justify-center text-white font-bold text-xl">W</div>
              <span className="font-bold text-2xl">Warung Sedap</span>
            </div>
            <p className="text-gray-400 leading-relaxed text-sm">
              Kami menyajikan makanan terbaik di kota, membawa cita rasa otentik langsung ke depan pintu Anda.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 text-lg">Menu</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li onClick={() => setCurrentPage('home')} className="hover:text-brand-green cursor-pointer">Beranda</li>
              <li onClick={() => setCurrentPage('about')} className="hover:text-brand-green cursor-pointer">Mengapa Kami</li>
              <li onClick={() => setCurrentPage('menu')} className="hover:text-brand-green cursor-pointer">Menu Spesial</li>
              <li onClick={() => setCurrentPage('menu')} className="hover:text-brand-green cursor-pointer">Makanan Reguler</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-lg">Bantuan</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="hover:text-brand-green cursor-pointer">Kebijakan Privasi</li>
              <li className="hover:text-brand-green cursor-pointer">Syarat & Ketentuan</li>
              <li className="hover:text-brand-green cursor-pointer">Kebijakan</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-lg">Kontak</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-start gap-3">
                <Phone className="text-brand-green" size={18} />
                <span>+62 812 3456 7890</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="text-brand-green" size={18} />
                <span>hello@warungsedap.com</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="text-brand-green" size={18} />
                <span>Jl. Merdeka No. 45, Jakarta</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="text-center text-gray-600 border-t border-gray-800 pt-8 text-sm">
          &copy; 2024 Warung Sedap. All rights reserved.
        </div>
      </footer>

      {/* Overlays */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cart}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
      />

      <SearchOverlay 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onAddToCart={addToCart}
      />

    </div>
  );
};

export default App;