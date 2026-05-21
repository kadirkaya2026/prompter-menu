import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  X, 
  Smartphone, 
  CreditCard, 
  Banknote,
  Star,
  Coffee,
  Clock,
  Search,
  Info,
  ChevronRight,
  Music2,
  Play,
  CheckCircle2,
  AlertTriangle
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
  { id: 'cold', name: 'Soğuk İçecekler', icon: '🥤' }
];

const MENU_DATA = {
  coffee: [
    { id: 1, name: "Signature Flat White", price: 85, time: 4, kcal: 120, desc: "Özel kavrum çekirdekler ve ipeksi süt köpüğü.", ingredients: "Espresso, Double Shot, Mikro-köpüklü Süt", image: "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=300&h=300&q=80", allergens: ["Süt"], badge: "Popüler" },
    { id: 2, name: "Yulaf Sütlü Latte", price: 95, time: 5, kcal: 85, desc: "Bitkisel süt tercih edenler için hafif bir seçenek.", ingredients: "Espresso, Yulaf Sütü, Vanilya Özü", image: "https://images.unsplash.com/photo-1551033406-611cf9a28f67?auto=format&fit=crop&w=300&h=300&q=80", allergens: [] },
  ],
  dessert: [
    { id: 4, name: "Belçika Çikolatalı Brownie", price: 110, time: 7, kcal: 450, desc: "Sıcak servis edilir, yanında krema ile.", ingredients: "70% Kakao, Tereyağı, Ceviz, Belçika Çikolatası", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=300&h=300&q=80", allergens: ["Gluten", "Süt", "Kuruyemiş"], badge: "Şefin Seçimi" },
  ],
  cold: [
    { id: 6, name: "Iced Hibiscus Tea", price: 75, time: 3, kcal: 45, desc: "Taze demlenmiş hibiskus, buz ve çubuk tarçın.", ingredients: "Hibiskus Çiçeği, Taze Nane, Buz", image: "https://images.unsplash.com/photo-1553173154-5622b1af05c1?auto=format&fit=crop&w=300&h=300&q=80", allergens: [] },
  ]
};

const JUKEBOX_QUEUE = [
  { id: 1, title: "RÜYA", artist: "Ege Çubukçu" },
  { id: 2, title: "Blinding Lights", artist: "The Weeknd" },
  { id: 3, title: "Do I Wanna Know", artist: "Arctic Monkeys" }
];

const App = () => {
  const [screen, setScreen] = useState('menu');
  const [activeCategory, setActiveCategory] = useState('coffee');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isCrmOpen, setIsCrmOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isJukeboxOpen, setIsJukeboxOpen] = useState(false);
  const [jukeboxVote, setJukeboxVote] = useState(null);
  const [rating, setRating] = useState(0);

  const cartCount = cart.length;
  const totalPrice = cart.reduce((acc, item) => acc + item.price, 0);

  // Geri sayım mantığı
  useEffect(() => {
    if (screen === 'active' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [screen, timeLeft]);

  const addToCart = (e, item) => {
    e.stopPropagation();
    setCart([...cart, { ...item, cartId: Date.now() }]);
  };

  const startOrder = () => {
    const totalTime = Math.max(...cart.map(i => i.time)) * 60; // En uzun hazırlanan ürünün süresi (saniye)
    setTimeLeft(totalTime);
    setIsCrmOpen(false);
    setScreen('active');
  };

  const handleMusicVote = (song) => {
    setJukeboxVote(song.id);
    setTimeout(() => {
      alert(`"${song.title}" için isteğiniz kasaya iletildi!`);
    }, 500);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#070707] text-white font-sans selection:bg-primary">
      
      {/* HEADER */}
      {screen === 'menu' && (
        <header className="sticky top-0 z-40 bg-[#070707]/90 backdrop-blur-xl border-b border-white/5 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-xl font-black italic tracking-tighter text-white uppercase">Prompter <span className="text-primary underline decoration-2 underline-offset-4">Menu</span></h1>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Masa 4 • Kadıköy</p>
            </div>
            <button className="relative w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center border border-white/10">
              <Search size={20} className="text-zinc-400" />
            </button>
          </div>

          <div className="flex gap-2.5 overflow-x-auto no-scrollbar -mx-6 px-6">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "flex items-center gap-2 px-6 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all border",
                  activeCategory === cat.id 
                    ? "bg-primary border-primary text-white shadow-xl shadow-primary/20" 
                    : "bg-zinc-900 border-white/5 text-zinc-500"
                )}
              >
                <span>{cat.icon}</span> {cat.name}
              </button>
            ))}
          </div>
        </header>
      )}

      {/* MENU ITEMS */}
      {screen === 'menu' && (
        <main className="p-6 pb-32 space-y-4">
          {MENU_DATA[activeCategory].map(item => (
            <motion.div 
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="flex gap-4 p-4 bg-zinc-900/30 rounded-[32px] border border-white/5 active:scale-[0.97] transition-all"
            >
              <div className="relative w-24 h-24 flex-shrink-0">
                <img src={item.image} className="w-full h-full object-cover rounded-2xl" alt={item.name} />
                <div className="absolute -bottom-2 -right-2 bg-black/80 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 flex items-center gap-1">
                  <Clock size={10} className="text-primary" />
                  <span className="text-[9px] font-black">{item.time} dk</span>
                </div>
              </div>
              
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-black italic text-base leading-none mb-1">{item.name}</h3>
                  <p className="text-[11px] text-zinc-500 line-clamp-2 leading-snug font-medium">{item.desc}</p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-black italic text-primary">₺{item.price}</span>
                  <button 
                    onClick={(e) => addToCart(e, item)}
                    className="w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center font-bold text-xl hover:bg-primary hover:text-white transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </main>
      )}

      {/* ACTIVE ORDER SCREEN */}
      {screen === 'active' && (
        <main className="p-8 pt-16 flex flex-col items-center min-h-screen">
          <div className="w-32 h-32 bg-primary/10 rounded-[48px] flex items-center justify-center mb-8 relative">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-2 border-dashed border-primary/30 rounded-[48px]"
            />
            <Coffee size={48} className="text-primary" />
          </div>

          <h2 className="text-4xl font-black uppercase italic italic mb-2">Hazırlanıyor</h2>
          <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest mb-12">Sipariş No: #2841</p>

          {/* TIMER */}
          <div className="w-full bg-zinc-900 p-8 rounded-[40px] border border-white/5 mb-8 text-center relative overflow-hidden">
             <div className="relative z-10">
                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Kalan Süre</p>
                <div className="text-5xl font-black italic mb-4">
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </div>
                <div className="h-1.5 w-full bg-black rounded-full overflow-hidden">
                   <motion.div 
                     initial={{ width: "100%" }}
                     animate={{ width: `${(timeLeft / (Math.max(...cart.map(i => i.time)) * 60)) * 100}%` }}
                     className="h-full bg-primary"
                   />
                </div>
             </div>
          </div>

          {/* SPOTIFY/JUKEBOX SECTION */}
          <div className="w-full bg-[#1DB954]/5 p-6 rounded-[32px] border border-[#1DB954]/20 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#1DB954] rounded-full flex items-center justify-center text-black">
                <Music2 size={20} />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-[9px] font-black text-[#1DB954] uppercase tracking-widest">Şu an Çalıyor</p>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-sm truncate">Arctic Monkeys - Do I Wanna Know</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
               <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Sıradaki Parçayı Seç</p>
               {JUKEBOX_QUEUE.slice(0, 2).map(song => (
                 <div key={song.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold">{song.title}</p>
                      <p className="text-[10px] text-zinc-500">{song.artist}</p>
                    </div>
                    <button 
                      onClick={() => handleMusicVote(song)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all",
                        jukeboxVote === song.id ? "bg-[#1DB954] text-black" : "bg-white/5 text-white"
                      )}
                    >
                      {jukeboxVote === song.id ? "Seçildi" : "İste"}
                    </button>
                 </div>
               ))}
            </div>
          </div>

          <button 
            onClick={() => setScreen('feedback')}
            className="w-full bg-zinc-900 border border-white/5 py-5 rounded-3xl font-black uppercase italic tracking-widest"
          >
            Hesabı İste
          </button>
        </main>
      )}

      {/* PRODUCT DETAIL MODAL */}
      <AnimatePresence>
        {selectedItem && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[60]"
            />
            <motion.div 
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              className="fixed bottom-0 left-0 right-0 bg-[#0f0f0f] rounded-t-[48px] z-[70] p-8 border-t border-white/10 max-w-md mx-auto"
            >
              <img src={selectedItem.image} className="w-full h-64 object-cover rounded-[32px] mb-6 shadow-2xl" />
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-3xl font-black italic uppercase leading-none">{selectedItem.name}</h3>
                <span className="text-2xl font-black text-primary">₺{selectedItem.price}</span>
              </div>

              <div className="flex gap-4 mb-8">
                <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded-xl border border-white/5">
                   <Clock size={14} className="text-primary" />
                   <span className="text-xs font-bold">{selectedItem.time} dk Hazırlanma</span>
                </div>
                <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded-xl border border-white/5">
                   <Star size={14} className="text-primary" />
                   <span className="text-xs font-bold">{selectedItem.kcal} kcal</span>
                </div>
              </div>

              <div className="space-y-6 mb-10">
                <div>
                  <p className="text-[10px] font-black uppercase text-zinc-500 mb-2 tracking-widest">Açıklama</p>
                  <p className="text-sm text-zinc-300 leading-relaxed">{selectedItem.desc}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-zinc-500 mb-2 tracking-widest">İçindekiler</p>
                  <p className="text-sm text-zinc-300 leading-relaxed font-medium">{selectedItem.ingredients}</p>
                </div>
                {selectedItem.allergens.length > 0 && (
                  <div className="flex items-center gap-2 text-amber-500 bg-amber-500/10 p-4 rounded-2xl border border-amber-500/20">
                    <AlertTriangle size={18} />
                    <p className="text-[11px] font-bold">Alerjen Uyarısı: {selectedItem.allergens.join(', ')}</p>
                  </div>
                )}
              </div>

              <button 
                onClick={(e) => { addToCart(e, selectedItem); setSelectedItem(null); }}
                className="w-full bg-white text-black py-5 rounded-[24px] font-black uppercase italic text-xl active:scale-95 transition-transform"
              >
                Sepete Ekle
              </button>
            </motion.div>
          </>
        )}

        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[80]"
            />
            <motion.div 
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              className="fixed bottom-0 left-0 right-0 bg-[#0f0f0f] rounded-t-[48px] z-[90] p-8 border-t border-white/10 max-w-md mx-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black italic uppercase">Sepetin</h3>
                <button onClick={() => setIsCartOpen(false)} className="p-3 bg-zinc-900 rounded-2xl text-zinc-500"><X size={20}/></button>
              </div>

              <div className="space-y-4 mb-8 max-h-[30vh] overflow-y-auto no-scrollbar">
                {cart.map((item) => (
                  <div key={item.cartId} className="flex justify-between items-center bg-zinc-900/50 p-4 rounded-3xl border border-white/5">
                    <div className="flex gap-4 items-center">
                      <img src={item.image} className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <p className="font-bold text-sm leading-none mb-1">{item.name}</p>
                        <p className="text-xs text-primary font-black italic">₺{item.price}</p>
                      </div>
                    </div>
                    <button onClick={() => setCart(cart.filter(i => i.cartId !== item.cartId))} className="text-zinc-600">
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mb-10 px-2">
                <span className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Toplam</span>
                <span className="text-3xl font-black italic text-primary">₺{totalPrice}</span>
              </div>

              <button 
                onClick={() => { setIsCartOpen(false); setIsCrmOpen(true); }}
                className="w-full bg-white text-black py-5 rounded-3xl font-black uppercase italic text-lg"
              >
                Siparişi Gönder
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* CRM MODAL */}
      <AnimatePresence>
        {isCrmOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="bg-zinc-900 w-full rounded-[48px] p-10 relative border border-white/10"
            >
              <div className="text-center mb-10">
                <div className="w-16 h-16 bg-primary/20 rounded-[28px] flex items-center justify-center mx-auto mb-6 text-primary">
                  <Smartphone size={32} />
                </div>
                <h3 className="text-2xl font-black uppercase italic mb-2">Hemen Başla</h3>
                <p className="text-zinc-500 text-xs font-medium">Siparişini takip etmek ve Wi-Fi şifresini almak için numaranı gir.</p>
              </div>
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0 (5xx) xxx xx xx"
                className="w-full bg-black border border-white/10 rounded-2xl p-5 text-center text-2xl font-black tracking-tighter focus:outline-none focus:border-primary mb-8"
              />
              <button 
                onClick={startOrder}
                className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase italic text-xl"
              >
                Siparişi Onayla
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FIXED FOOTER CART BAR */}
      {screen === 'menu' && cartCount > 0 && (
        <motion.div 
          initial={{ y: 100 }} animate={{ y: 0 }}
          className="fixed bottom-8 left-6 right-6 z-50 shadow-2xl"
        >
          <button 
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-primary p-5 rounded-3xl flex items-center justify-between shadow-primary/30 active:scale-95 transition-transform"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-black/20 rounded-xl flex items-center justify-center">
                <ShoppingCart size={20} />
              </div>
              <div className="text-left">
                <p className="text-[9px] font-black uppercase opacity-70">Siparişin</p>
                <p className="font-bold text-sm">{cartCount} Ürün</p>
              </div>
            </div>
            <p className="font-black text-2xl italic leading-none">₺{totalPrice}</p>
          </button>
        </motion.div>
      )}

      {/* FEEDBACK SCREEN */}
      {screen === 'feedback' && (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-black">
          <motion.div 
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="w-24 h-24 bg-primary/20 rounded-[40px] flex items-center justify-center mx-auto mb-8 text-primary"
          >
            <CheckCircle2 size={48} />
          </motion.div>
          <h2 className="text-4xl font-black uppercase italic mb-12 leading-none">Afiyet <span className="text-primary block mt-2">Olsun!</span></h2>
          <div className="flex gap-3 justify-center mb-12">
            {[1, 2, 3, 4, 5].map((s) => (
              <button key={s} onClick={() => setRating(s)} className="p-1">
                <Star size={44} fill={rating >= s ? "#FF6B00" : "none"} color={rating >= s ? "#FF6B00" : "#27272a"} />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <button onClick={() => window.location.reload()} className="text-zinc-600 font-black uppercase tracking-widest text-[10px] border-b border-zinc-800 pb-1">Menüye Dön</button>
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
