import React, { useState, useEffect } from 'react';
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
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const MENU_ITEMS = [
  {
    id: 1,
    name: "İmza Flat White",
    price: 85,
    kcal: 120,
    image: "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=400&q=80",
    allergens: ["Süt"],
    note: "Cheesecake ile harika gider",
    mood: ["All", "Working Mode (Strong)"]
  },
  {
    id: 2,
    name: "Belçika Çikolatalı Brownie",
    price: 110,
    kcal: 450,
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=400&q=80",
    allergens: ["Gluten", "Yumurta"],
    warning: "Son 3 adet kaldı!",
    mood: ["All", "Sweet Tooth"]
  },
  {
    id: 3,
    name: "Yulaf Sütlü Latte",
    price: 95,
    kcal: 85,
    image: "https://images.unsplash.com/photo-1551033406-611cf9a28f67?auto=format&fit=crop&w=400&q=80",
    allergens: [],
    mood: ["All", "Diet (Gluten-Free)"]
  },
  {
    id: 4,
    name: "Soğuk Demleme (Cold Brew)",
    price: 105,
    kcal: 5,
    image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=400&q=80",
    allergens: [],
    mood: ["All", "Working Mode (Strong)"]
  }
];

const MOODS = ["All", "Working Mode (Strong)", "Sweet Tooth", "Diet (Gluten-Free)"];

const App = () => {
  const [screen, setScreen] = useState('menu'); // menu, active, feedback
  const [activeMood, setActiveMood] = useState('All');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCrmOpen, setIsCrmOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [isBillOpen, setIsBillOpen] = useState(false);
  const [splitCount, setSplitCount] = useState(1);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isFinished, setIsFinished] = useState(false);

  const addToCart = (item) => {
    setCart([...cart, { ...item, cartId: Date.now() }]);
  };

  const totalPrice = cart.reduce((acc, item) => acc + item.price, 0);

  const handleSendOrder = () => {
    setIsCartOpen(false);
    setIsCrmOpen(true);
  };

  const confirmOrder = () => {
    setIsCrmOpen(false);
    setScreen('active');
  };

  const handleAskForBill = () => {
    setIsBillOpen(true);
  };

  const finishSession = () => {
    setIsBillOpen(false);
    setScreen('feedback');
  };

  const filteredItems = MENU_ITEMS.filter(item => item.mood.includes(activeMood));

  return (
    <div className="max-w-md mx-auto min-h-screen bg-black text-white font-sans selection:bg-primary selection:text-white">
      
      {/* HEADER */}
      {screen !== 'feedback' && (
        <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md p-6 flex justify-between items-center border-b border-zinc-800">
          <div>
            <h1 className="text-xl font-bold tracking-tight">PROMPTER <span className="text-primary">MENU</span></h1>
            <p className="text-xs text-zinc-500 font-medium">Masa 4 • Kadıköy Şubesi</p>
          </div>
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 bg-zinc-900 rounded-full border border-zinc-800 active:scale-90 transition-transform"
          >
            <ShoppingCart size={20} />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cart.length}
              </span>
            )}
          </button>
        </header>
      )}

      {screen === 'menu' && (
        <motion.main 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="pb-24"
        >
          {/* MOOD FILTER */}
          <div className="flex gap-3 overflow-x-auto px-6 py-6 no-scrollbar">
            {MOODS.map(mood => (
              <button
                key={mood}
                onClick={() => setActiveMood(mood)}
                className={cn(
                  "px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 border",
                  activeMood === mood 
                    ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" 
                    : "bg-zinc-900 border-zinc-800 text-zinc-400"
                )}
              >
                {mood}
              </button>
            ))}
          </div>

          {/* MENU ITEMS */}
          <div className="px-6 space-y-8">
            {filteredItems.map(item => (
              <motion.div 
                layout
                key={item.id}
                className="group bg-zinc-900/50 rounded-3xl overflow-hidden border border-zinc-800/50 hover:border-primary/30 transition-colors"
              >
                <div className="relative h-56 overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  {item.warning && (
                    <div className="absolute top-4 left-4 bg-red-600/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
                      <AlertCircle size={12} /> {item.warning}
                    </div>
                  )}
                  <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-2xl text-sm font-bold border border-white/10">
                    ₺{item.price}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <div className="flex items-center gap-2">
                      {item.allergens.map(a => (
                        <span key={a} title={a} className="w-2 h-2 rounded-full bg-zinc-700" />
                      ))}
                    </div>
                  </div>
                  <p className="text-zinc-500 text-xs mb-4 flex items-center gap-2 font-medium">
                    <Clock size={12} /> {item.kcal} kcal 
                    <span className="w-1 h-1 rounded-full bg-zinc-800" />
                    {item.allergens.length > 0 ? item.allergens.join(', ') : 'Alerjen Yok'}
                  </p>
                  
                  {item.note && (
                    <div className="mb-5 p-3 bg-primary/5 border border-primary/10 rounded-2xl text-[11px] text-primary/90 font-medium italic">
                      "Şefin Notu: {item.note}"
                    </div>
                  )}

                  <button 
                    onClick={() => addToCart(item)}
                    className="w-full bg-white text-black py-3.5 rounded-2xl font-bold text-sm hover:bg-primary hover:text-white transition-all active:scale-95"
                  >
                    Sepete Ekle
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.main>
      )}

      {screen === 'active' && (
        <motion.main 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 space-y-6 pb-24"
        >
          {/* ORDER STATUS */}
          <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -mr-16 -mt-16" />
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary animate-pulse">
                <Coffee size={24} />
              </div>
              <div>
                <h2 className="font-bold text-lg">Mutfakta Hazırlanıyor</h2>
                <p className="text-xs text-zinc-500 font-medium">Sipariş No: #2841 • Yaklaşık 8 dk.</p>
              </div>
            </div>
            <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: "30%" }}
                animate={{ width: "65%" }}
                transition={{ duration: 10, repeat: Infinity }}
                className="h-full bg-primary"
              />
            </div>
          </div>

          {/* WIFI REWARD */}
          <div className="bg-gradient-to-br from-zinc-900 to-black p-6 rounded-3xl border border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                <Wifi size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Wi-Fi Şifresi</p>
                <p className="font-mono font-bold text-lg tracking-wider">prompter2024</p>
              </div>
            </div>
            <button className="text-[10px] font-bold text-primary uppercase border border-primary/20 px-3 py-1.5 rounded-lg">Kopyala</button>
          </div>

          {/* JUKEBOX */}
          <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold flex items-center gap-2">
                <Music size={18} className="text-primary" /> Jukebox
              </h3>
              <span className="text-[10px] text-zinc-500 font-medium px-2 py-1 bg-black rounded-lg border border-zinc-800">Canlı</span>
            </div>
            
            <div className="mb-6 p-4 bg-black rounded-2xl border border-zinc-800">
              <p className="text-[10px] text-primary font-bold uppercase mb-1">Şu an çalan</p>
              <h4 className="font-bold">Arctic Monkeys - Do I Wanna Know</h4>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] text-zinc-500 font-bold uppercase">Sıradaki Şarkılar</p>
              {[
                { title: "RÜYA", artist: "Ege Çubukçu" },
                { title: "Blinding Lights", artist: "The Weeknd" }
              ].map((song, i) => (
                <div key={i} className="flex items-center justify-between py-1">
                  <div>
                    <p className="text-sm font-bold">{song.title}</p>
                    <p className="text-xs text-zinc-500">{song.artist}</p>
                  </div>
                  <button className="flex items-center gap-1.5 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-xs font-bold transition-colors">
                    Oyla
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={handleAskForBill}
            className="w-full bg-primary text-white py-5 rounded-3xl font-bold shadow-xl shadow-primary/20 active:scale-95 transition-transform flex items-center justify-center gap-2"
          >
            Hesabı İste
          </button>
        </motion.main>
      )}

      {screen === 'feedback' && (
        <motion.main 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen flex flex-col items-center justify-center p-8 text-center"
        >
          {rating < 4 && rating !== 0 ? (
            <div className="w-full space-y-6">
              <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={40} />
              </div>
              <h2 className="text-2xl font-bold">Bunu Duyduğumuza Üzüldük</h2>
              <p className="text-zinc-400 text-sm">Deneyiminizi telafi etmek istiyoruz. Lütfen sorunun ne olduğunu bize iletin.</p>
              <textarea 
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Neyi düzeltmemizi istersiniz?"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-5 text-sm focus:outline-none focus:border-primary min-h-[150px]"
              />
              <button 
                onClick={() => setIsFinished(true)}
                className="w-full bg-white text-black py-4 rounded-3xl font-bold"
              >
                Geri Bildirimi Gönder
              </button>
            </div>
          ) : rating >= 4 ? (
            <div className="space-y-6">
               <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-6xl mb-4"
               >
                🎉
               </motion.div>
               <h2 className="text-3xl font-bold">Harika!</h2>
               <p className="text-zinc-400">Puanınız için teşekkürler. Şimdiden %10 Cashback kazandınız! WhatsApp'ınızı kontrol edin.</p>
               <button 
                onClick={() => window.location.reload()}
                className="w-full bg-primary text-white py-4 px-12 rounded-3xl font-bold"
               >
                Harika, Görüşürüz!
               </button>
            </div>
          ) : (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold">Deneyimin nasıldı?</h2>
              <div className="flex gap-4 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button 
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-2 active:scale-125 transition-transform"
                  >
                    <Star size={36} fill={rating >= star ? "#FF6B00" : "none"} color={rating >= star ? "#FF6B00" : "#27272a"} />
                  </button>
                ))}
              </div>
              <p className="text-zinc-500 text-sm">Puanınız hizmet kalitemizi artırmamıza yardımcı olur.</p>
            </div>
          )}
        </motion.main>
      )}

      {/* MODALS & DRAWERS */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />
            <motion.div 
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-zinc-900 rounded-t-[40px] z-50 p-8 border-t border-white/5 max-w-md mx-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold">Sepetin</h3>
                <button onClick={() => setIsCartOpen(false)} className="p-2 bg-black rounded-full text-zinc-500"><X size={20}/></button>
              </div>

              {cart.length === 0 ? (
                <div className="py-12 text-center text-zinc-500 font-medium">Sepetin henüz boş.</div>
              ) : (
                <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto pr-2 no-scrollbar">
                  {cart.map((item) => (
                    <div key={item.cartId} className="flex justify-between items-center">
                      <div className="flex gap-4 items-center">
                        <img src={item.image} className="w-16 h-16 rounded-2xl object-cover" />
                        <div>
                          <p className="font-bold text-sm">{item.name}</p>
                          <p className="text-xs text-zinc-500">₺{item.price}</p>
                        </div>
                      </div>
                      <button onClick={() => setCart(cart.filter(i => i.cartId !== item.cartId))} className="text-zinc-600">
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-zinc-800 pt-6 mb-8">
                <div className="flex justify-between mb-4">
                  <span className="text-zinc-500 font-medium">Toplam</span>
                  <span className="text-xl font-bold">₺{totalPrice}</span>
                </div>
              </div>

              <button 
                disabled={cart.length === 0}
                onClick={handleSendOrder}
                className="w-full bg-primary disabled:opacity-50 text-white py-5 rounded-3xl font-bold text-lg shadow-xl shadow-primary/20 active:scale-95 transition-transform"
              >
                Siparişi Gönder
              </button>
            </motion.div>
          </>
        )}

        {isCrmOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="bg-zinc-900 w-full rounded-[40px] p-8 relative border border-white/5"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
                  <Smartphone size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">Wi-Fi Şifresini Al</h3>
                <p className="text-zinc-500 text-sm">Siparişini takip etmek ve Wi-Fi şifresini görmek için telefon numaranı gir.</p>
              </div>

              <div className="space-y-4 mb-8">
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0 (5xx) xxx xx xx"
                  className="w-full bg-black border border-zinc-800 rounded-2xl p-4 text-center text-lg font-bold focus:outline-none focus:border-primary transition-colors"
                />
                
                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input type="checkbox" className="mt-1 accent-primary" defaultChecked />
                    <span className="text-[11px] text-zinc-500 leading-relaxed font-medium">KVKK Aydınlatma Metni'ni okudum ve kabul ediyorum.</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input type="checkbox" className="mt-1 accent-primary" defaultChecked />
                    <span className="text-[11px] text-zinc-500 leading-relaxed font-medium">Özel WhatsApp indirimleri ve cashback fırsatlarından haberdar olmak istiyorum.</span>
                  </label>
                </div>
              </div>

              <button 
                onClick={confirmOrder}
                className="w-full bg-white text-black py-4 rounded-2xl font-bold active:scale-95 transition-transform"
              >
                Onayla ve Mutfağa Gönder
              </button>
            </motion.div>
          </div>
        )}

        {isBillOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsBillOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />
            <motion.div 
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              className="fixed bottom-0 left-0 right-0 bg-zinc-900 rounded-t-[40px] z-50 p-8 border-t border-white/5 max-w-md mx-auto"
            >
              <h3 className="text-xl font-bold mb-8 text-center">Nasıl ödemek istersiniz?</h3>
              
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { id: 'cash', icon: Banknote, label: 'Nakit' },
                  { id: 'card', icon: CreditCard, label: 'Kart' },
                  { id: 'split', icon: Users, label: 'Bölüş' }
                ].map((item) => (
                  <button key={item.id} className="flex flex-col items-center gap-3 p-4 bg-black rounded-3xl border border-zinc-800 active:border-primary transition-colors">
                    <item.icon size={24} className="text-zinc-500" />
                    <span className="text-xs font-bold">{item.label}</span>
                  </button>
                ))}
              </div>

              <div className="bg-black p-6 rounded-3xl border border-zinc-800 mb-8">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-zinc-500 font-medium">Kaç kişi bölüşecek?</span>
                  <div className="flex items-center gap-4">
                    <button onClick={() => setSplitCount(Math.max(1, splitCount - 1))} className="w-8 h-8 flex items-center justify-center bg-zinc-800 rounded-full font-bold">-</button>
                    <span className="font-bold w-4 text-center">{splitCount}</span>
                    <button onClick={() => setSplitCount(splitCount + 1)} className="w-8 h-8 flex items-center justify-center bg-zinc-800 rounded-full font-bold">+</button>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-zinc-900">
                  <span className="text-sm font-bold">Kişi Başı</span>
                  <span className="text-lg font-bold text-primary">₺{(totalPrice / splitCount).toFixed(2)}</span>
                </div>
              </div>

              <button 
                onClick={finishSession}
                className="w-full bg-primary text-white py-5 rounded-3xl font-bold text-lg shadow-xl shadow-primary/20 active:scale-95 transition-transform"
              >
                Garsonu POS ile Çağır
              </button>
              
              <p className="text-center mt-4 text-[11px] text-zinc-500 font-medium">
                Garson Masa 4'e {splitCount} adet POS cihazı ile yönlendiriliyor.
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default App;
