import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingCart, 
  ChevronRight, 
  Wifi, 
  Music, 
  X, 
  Check, 
  Smartphone, 
  CreditCard, 
  Users, 
  Banknote,
  Star,
  Coffee,
  AlertCircle,
  Clock,
  Search,
  ChevronDown,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const CATEGORIES = [
  { id: 'coffee', name: 'Kahveler', icon: '☕' },
  { id: 'dessert', name: 'Tatlılar', icon: '🍰' },
  { id: 'cold', name: 'Soğuk İçecekler', icon: '🥤' },
  { id: 'diet', name: 'Diyet & Sağlık', icon: '🌱' }
];

const MENU_DATA = {
  coffee: [
    { id: 1, name: "Signature Flat White", price: 85, kcal: 120, desc: "Özel kavrum çekirdekler ve ipeksi süt köpüğü.", image: "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=200&h=200&q=80", allergens: ["Süt"], badge: "Popüler" },
    { id: 2, name: "Yulaf Sütlü Latte", price: 95, kcal: 85, desc: "Bitkisel süt tercih edenler için hafif bir seçenek.", image: "https://images.unsplash.com/photo-1551033406-611cf9a28f67?auto=format&fit=crop&w=200&h=200&q=80", allergens: [] },
    { id: 3, name: "V60 Demleme", price: 105, kcal: 2, desc: "Etiyopya Kochere çekirdekleri ile demlenmiş.", image: "https://images.unsplash.com/photo-1544787210-2211d7c928c7?auto=format&fit=crop&w=200&h=200&q=80", allergens: [] },
  ],
  dessert: [
    { id: 4, name: "Belçika Çikolatalı Brownie", price: 110, kcal: 450, desc: "Sıcak servis edilir, yanında krema ile.", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=200&h=200&q=80", allergens: ["Gluten", "Süt"], badge: "Şefin Seçimi" },
    { id: 5, name: "San Sebastian Cheesecake", price: 135, kcal: 520, desc: "Akışkan kıvamlı, yanık dış yüzey.", image: "https://images.unsplash.com/photo-1567620905732-2d1ec7bb7445?auto=format&fit=crop&w=200&h=200&q=80", allergens: ["Süt", "Yumurta"] },
  ],
  cold: [
    { id: 6, name: "Iced Hibiscus Tea", price: 75, kcal: 45, desc: "Taze demlenmiş hibiskus, buz ve çubuk tarçın.", image: "https://images.unsplash.com/photo-1553173154-5622b1af05c1?auto=format&fit=crop&w=200&h=200&q=80", allergens: [] },
  ],
  diet: [
    { id: 7, name: "Chia Puding", price: 90, kcal: 180, desc: "Badem sütü, chia tohumu ve taze meyveler.", image: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&w=200&h=200&q=80", allergens: ["Kuruyemiş"] },
  ]
};

const App = () => {
  const [screen, setScreen] = useState('menu');
  const [activeCategory, setActiveCategory] = useState('coffee');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCrmOpen, setIsCrmOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [isBillOpen, setIsBillOpen] = useState(false);
  const [splitCount, setSplitCount] = useState(1);
  const [rating, setRating] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const cartCount = cart.length;
  const totalPrice = cart.reduce((acc, item) => acc + item.price, 0);

  const addToCart = (item) => {
    setCart([...cart, { ...item, cartId: Date.now() }]);
  };

  const handleSendOrder = () => {
    setIsCartOpen(false);
    setIsCrmOpen(true);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#0a0a0a] text-white font-sans">
      
      {/* MODERN NAVBAR */}
      {screen === 'menu' && (
        <nav className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/5 px-6 py-4">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white uppercase italic">Prompter <span className="text-primary">Menu</span></h1>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">Masa 4 • Kadıköy</p>
            </div>
            <div className="flex gap-3">
              <button className="p-2.5 bg-zinc-900 rounded-2xl border border-white/5 text-zinc-400">
                <Search size={18} />
              </button>
              <button className="p-2.5 bg-zinc-900 rounded-2xl border border-white/5 text-zinc-400">
                <Info size={18} />
              </button>
            </div>
          </div>

          {/* HORIZONTAL CATEGORIES */}
          <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-6 px-6">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all whitespace-nowrap border",
                  activeCategory === cat.id 
                    ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" 
                    : "bg-zinc-900 border-white/5 text-zinc-500"
                )}
              >
                <span>{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </nav>
      )}

      {/* MENU CONTENT */}
      {screen === 'menu' && (
        <main className="pb-32 px-6 pt-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black italic uppercase tracking-tight">
              {CATEGORIES.find(c => c.id === activeCategory)?.name}
            </h2>
            <span className="h-[1px] flex-1 bg-white/5 ml-6"></span>
          </div>

          <div className="space-y-4">
            {MENU_DATA[activeCategory].map(item => (
              <motion.div 
                layout
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="group flex gap-4 p-4 bg-zinc-900/40 rounded-[28px] border border-white/5 hover:bg-zinc-900/60 transition-all active:scale-[0.98]"
              >
                <div className="relative w-24 h-24 flex-shrink-0">
                  <img src={item.image} className="w-full h-full object-cover rounded-2xl shadow-xl" alt={item.name} />
                  {item.badge && (
                    <span className="absolute -top-2 -left-2 bg-primary text-[9px] font-black uppercase px-2 py-1 rounded-lg shadow-lg">
                      {item.badge}
                    </span>
                  )}
                </div>
                
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <h3 className="font-bold text-[15px] mb-1 leading-tight">{item.name}</h3>
                    <p className="text-[11px] text-zinc-500 leading-relaxed line-clamp-2 mb-2 font-medium">
                      {item.desc}
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="font-black text-lg text-primary italic">₺{item.price}</span>
                    <button 
                      onClick={() => addToCart(item)}
                      className="w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-colors shadow-lg"
                    >
                      <span className="text-xl font-bold">+</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </main>
      )}

      {/* FIXED BOTTOM CART BAR */}
      {screen === 'menu' && cartCount > 0 && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-6 left-6 right-6 z-50"
        >
          <button 
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-primary p-5 rounded-3xl flex items-center justify-between shadow-2xl shadow-primary/30 active:scale-95 transition-transform"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-black/20 rounded-xl flex items-center justify-center">
                <ShoppingCart size={20} />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Sepetin</p>
                <p className="font-bold text-sm leading-none">{cartCount} Ürün Ekledin</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Toplam</p>
              <p className="font-black text-xl italic leading-none">₺{totalPrice}</p>
            </div>
          </button>
        </motion.div>
      )}

      {/* CRM MODAL & BILL FLOW (Previous logic maintained but restyled) */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60]"
            />
            <motion.div 
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              className="fixed bottom-0 left-0 right-0 bg-[#121212] rounded-t-[40px] z-[70] p-8 border-t border-white/5 max-w-md mx-auto"
            >
              <div className="w-12 h-1 bg-white/10 rounded-full mx-auto mb-8" />
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black italic uppercase">Sepetin</h3>
                <button onClick={() => setIsCartOpen(false)} className="p-3 bg-zinc-900 rounded-2xl text-zinc-500"><X size={20}/></button>
              </div>

              <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto no-scrollbar">
                {cart.map((item) => (
                  <div key={item.cartId} className="flex justify-between items-center bg-zinc-900/50 p-4 rounded-3xl border border-white/5">
                    <div className="flex gap-4 items-center">
                      <img src={item.image} className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <p className="font-bold text-sm">{item.name}</p>
                        <p className="text-xs text-primary font-black italic">₺{item.price}</p>
                      </div>
                    </div>
                    <button onClick={() => setCart(cart.filter(i => i.cartId !== item.cartId))} className="p-2 bg-black/50 rounded-lg text-red-500">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mb-8 px-2">
                <span className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Toplam Ödeme</span>
                <span className="text-3xl font-black italic text-primary">₺{totalPrice}</span>
              </div>

              <button 
                onClick={handleSendOrder}
                className="w-full bg-white text-black py-5 rounded-3xl font-black uppercase italic tracking-tighter text-lg shadow-xl active:scale-95 transition-transform"
              >
                Siparişi Onayla
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* DASHBOARD & FEEDBACK SCREENS (Maintained for logic) */}
      {screen === 'active' && (
        <div className="p-6 pt-12 text-center">
           {/* Previous Active Dashboard content with new styling */}
           <div className="w-24 h-24 bg-primary/20 rounded-[40px] flex items-center justify-center mx-auto mb-6 text-primary animate-pulse">
             <Coffee size={40} />
           </div>
           <h2 className="text-3xl font-black uppercase italic italic mb-2">Hazırlanıyor</h2>
           <p className="text-zinc-500 text-sm font-medium mb-12">Siparişin #2841 mutfakta özenle hazırlanıyor.</p>
           
           <div className="bg-zinc-900/50 p-6 rounded-[32px] border border-white/5 mb-6 text-left">
             <p className="text-[10px] font-black uppercase text-primary mb-2">Wi-Fi Bağlantısı</p>
             <div className="flex justify-between items-center">
               <p className="text-xl font-black tracking-widest">prompter2024</p>
               <Wifi size={20} className="text-zinc-600" />
             </div>
           </div>

           <button 
             onClick={() => setIsBillOpen(true)}
             className="w-full bg-primary py-5 rounded-3xl font-black uppercase italic text-lg mt-12"
           >
             Hesabı İste
           </button>
        </div>
      )}

      {/* REST OF CRM MODAL */}
      {isCrmOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="bg-[#121212] w-full rounded-[48px] p-10 relative border border-white/10"
          >
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-primary/10 rounded-[30px] flex items-center justify-center mx-auto mb-6 text-primary border border-primary/20">
                <Smartphone size={36} />
              </div>
              <h3 className="text-3xl font-black uppercase italic mb-3 leading-none">Hemen Başla</h3>
              <p className="text-zinc-500 text-[13px] leading-relaxed">Wi-Fi şifresini almak ve siparişini takip etmek için numaranı gir.</p>
            </div>
            <input 
              type="tel" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0 (5xx) xxx xx xx"
              className="w-full bg-black border border-white/10 rounded-[24px] p-5 text-center text-2xl font-black tracking-tighter focus:outline-none focus:border-primary transition-colors mb-8 shadow-inner"
            />
            <button 
              onClick={() => { setIsCrmOpen(false); setScreen('active'); }}
              className="w-full bg-white text-black py-5 rounded-[24px] font-black uppercase italic text-xl shadow-2xl active:scale-95 transition-transform"
            >
              Devam Et
            </button>
          </motion.div>
        </div>
      )}

      {/* PRE-CHECKOUT FEEDBACK SIMULATION */}
      {isBillOpen && (
        <div className="fixed inset-0 z-[110] flex items-end justify-center p-6">
           <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsBillOpen(false)} />
           <motion.div 
             initial={{ y: 300 }} animate={{ y: 0 }}
             className="bg-zinc-900 w-full rounded-[40px] p-8 relative border-t border-white/10"
           >
              <h3 className="text-2xl font-black uppercase italic mb-8 text-center">Ödeme Şekli</h3>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <button className="flex flex-col items-center gap-4 p-8 bg-black rounded-[32px] border border-white/5 active:border-primary">
                  <CreditCard size={32} className="text-primary" />
                  <span className="font-black uppercase italic text-xs tracking-widest">Kart</span>
                </button>
                <button className="flex flex-col items-center gap-4 p-8 bg-black rounded-[32px] border border-white/5 active:border-primary">
                  <Banknote size={32} className="text-primary" />
                  <span className="font-black uppercase italic text-xs tracking-widest">Nakit</span>
                </button>
              </div>
              <button 
                onClick={() => setScreen('feedback')}
                className="w-full bg-primary py-6 rounded-3xl font-black uppercase italic text-xl"
              >
                Garsonu Çağır
              </button>
           </motion.div>
        </div>
      )}

      {screen === 'feedback' && (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-black">
          <div className="text-6xl mb-8">☕</div>
          <h2 className="text-4xl font-black uppercase italic mb-4 leading-none">Afiyet <span className="text-primary text-5xl block mt-2">Olsun!</span></h2>
          <p className="text-zinc-500 mb-12">Deneyimin nasıldı? Puan vererek bizi geliştir.</p>
          <div className="flex gap-3 justify-center mb-12">
            {[1, 2, 3, 4, 5].map((s) => (
              <button key={s} onClick={() => setRating(s)} className="p-1 active:scale-150 transition-transform">
                <Star size={44} fill={rating >= s ? "#FF6B00" : "none"} color={rating >= s ? "#FF6B00" : "#27272a"} />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p className="text-primary font-black uppercase italic animate-bounce">Teşekkür Ederiz!</p>
              <button onClick={() => window.location.reload()} className="mt-8 text-zinc-600 font-bold uppercase tracking-widest text-[10px] border-b border-zinc-800 pb-1">Menüye Dön</button>
            </motion.div>
          )}
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default App;
