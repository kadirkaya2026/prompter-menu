import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, X, Smartphone, CreditCard, Banknote, Star, Coffee, Clock, Search, 
  Info, Music2, CheckCircle2, AlertTriangle, Users, LayoutDashboard, Utensils, Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) { return twMerge(clsx(inputs)); }

const MENU_DATA = {
  coffee: [
    { id: 1, name: "Signature Flat White", price: 85, time: 4, kcal: 120, desc: "Özel kavrum çekirdekler ve ipeksi süt köpüğü.", ingredients: "Espresso, Double Shot, Mikro-köpüklü Süt", image: "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=300&h=300&q=80", allergens: ["Süt"], badge: "Popüler" },
    { id: 2, name: "Yulaf Sütlü Latte", price: 95, time: 5, kcal: 85, desc: "Bitkisel süt tercih edenler için hafif bir seçenek.", ingredients: "Espresso, Yulaf Sütü, Vanilya Özü", image: "https://images.unsplash.com/photo-1551033406-611cf9a28f67?auto=format&fit=crop&w=300&h=300&q=80", allergens: [] },
  ],
  dessert: [
    { id: 4, name: "Belçika Çikolatalı Brownie", price: 110, time: 7, kcal: 450, desc: "Sıcak servis edilir, yanında krema ile.", ingredients: "70% Kakao, Tereyağı, Ceviz, Belçika Çikolatası", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=300&h=300&q=80", allergens: ["Gluten", "Süt", "Kuruyemiş"], badge: "Şefin Seçimi" },
  ]
};

const JUKEBOX_QUEUE = [
  { id: 1, title: "RÜYA", artist: "Ege Çubukçu" },
  { id: 2, title: "Blinding Lights", artist: "The Weeknd" },
];

const App = () => {
  const [view, setView] = useState('customer'); // customer, admin
  const [screen, setScreen] = useState('menu'); // menu, active, feedback
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isCrmOpen, setIsCrmOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isBillOpen, setIsBillOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [splitCount, setSplitCount] = useState(1);
  const [rating, setRating] = useState(0);
  
  // Admin / Kasa Durumları
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'order', table: '4', content: '2x Flat White', time: 'Şimdi', status: 'Yeni' },
    { id: 2, type: 'music', table: '2', content: 'Blinding Lights - The Weeknd', time: '2 dk önce', status: 'Beklemede' }
  ]);

  const totalPrice = cart.reduce((acc, item) => acc + item.price, 0);

  useEffect(() => {
    if (screen === 'active' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [screen, timeLeft]);

  const addNotification = (type, content) => {
    const newNote = {
      id: Date.now(),
      type,
      table: '4',
      content,
      time: 'Şimdi',
      status: 'Yeni'
    };
    setNotifications([newNote, ...notifications]);
  };

  const startOrder = () => {
    const totalTime = Math.max(...cart.map(i => i.time), 5) * 60;
    setTimeLeft(totalTime);
    addNotification('order', `${cart.length} Ürün: ${cart.map(i=>i.name).join(', ')}`);
    setIsCrmOpen(false);
    setScreen('active');
  };

  const requestBill = () => {
    const content = paymentMethod === 'split' 
      ? `Hesap: ₺${totalPrice} (Alman Usulü - ${splitCount} Kişi)` 
      : `Hesap: ₺${totalPrice} (${paymentMethod === 'cash' ? 'Nakit' : 'Kart'})`;
    addNotification('bill', content);
    setScreen('feedback');
    setIsBillOpen(false);
  };

  const handleMusicVote = (song) => {
    addNotification('music', `İstek: ${song.title} - ${song.artist}`);
    alert(`"${song.title}" isteğiniz kasaya iletildi!`);
  };

  if (view === 'admin') {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-[#050505] text-white p-6">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-black uppercase italic tracking-tighter">Kasa <span className="text-primary">Paneli</span></h2>
          <button onClick={() => setView('customer')} className="p-3 bg-zinc-900 rounded-2xl border border-white/10 text-zinc-400">
            <Utensils size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] mb-4">Gelen Bildirimler</p>
          {notifications.map(note => (
            <motion.div 
              initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
              key={note.id} 
              className="bg-zinc-900/50 border border-white/5 rounded-3xl p-5 flex gap-4"
            >
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0",
                note.type === 'order' ? "bg-blue-500/10 text-blue-500" : 
                note.type === 'bill' ? "bg-primary/10 text-primary" : "bg-green-500/10 text-green-500"
              )}>
                {note.type === 'order' ? <ShoppingCart size={20}/> : note.type === 'bill' ? <CreditCard size={20}/> : <Music2 size={20}/>}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-sm">Masa {note.table}</h4>
                  <span className="text-[9px] font-black uppercase text-zinc-600">{note.time}</span>
                </div>
                <p className="text-xs text-zinc-400 font-medium leading-relaxed">{note.content}</p>
                <div className="mt-3 flex gap-2">
                   <button className="px-3 py-1.5 bg-white text-black text-[10px] font-black uppercase rounded-lg">Onayla</button>
                   <button onClick={() => setNotifications(notifications.filter(n => n.id !== note.id))} className="px-3 py-1.5 bg-zinc-800 text-zinc-400 text-[10px] font-black uppercase rounded-lg">Sil</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#070707] text-white font-sans selection:bg-primary">
      
      {/* CUSTOMER HEADER */}
      {screen === 'menu' && (
        <header className="sticky top-0 z-40 bg-[#070707]/90 backdrop-blur-xl border-b border-white/5 p-6 flex justify-between items-center">
          <button onClick={() => setView('admin')} className="opacity-10 hover:opacity-100 transition-opacity">
            <LayoutDashboard size={16} />
          </button>
          <div className="text-center">
            <h1 className="text-xl font-black italic tracking-tighter text-white uppercase leading-none">Prompter <span className="text-primary">Menu</span></h1>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Masa 4 • Kadıköy</p>
          </div>
          <button className="relative w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center border border-white/10">
            <Search size={18} className="text-zinc-400" />
          </button>
        </header>
      )}

      {/* MENU CONTENT */}
      {screen === 'menu' && (
        <main className="p-6 pb-32 space-y-4">
           {/* Category Bar & Items (Previous logic) */}
           <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6">
              {Object.keys(MENU_DATA).map(cat => (
                <button key={cat} className="px-6 py-3 bg-zinc-900 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/5">
                  {cat === 'coffee' ? 'Kahveler' : 'Tatlılar'}
                </button>
              ))}
           </div>
           
           {MENU_DATA.coffee.concat(MENU_DATA.dessert).map(item => (
            <motion.div 
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="flex gap-4 p-4 bg-zinc-900/30 rounded-[32px] border border-white/5 active:scale-[0.97] transition-all"
            >
              <div className="relative w-24 h-24 flex-shrink-0">
                <img src={item.image} className="w-full h-full object-cover rounded-2xl shadow-xl" alt={item.name} />
                <div className="absolute -bottom-2 -right-2 bg-black/80 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 flex items-center gap-1">
                  <Clock size={10} className="text-primary" />
                  <span className="text-[9px] font-black">{item.time} dk</span>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <h3 className="font-black italic text-base leading-none mb-1">{item.name}</h3>
                  <p className="text-[11px] text-zinc-500 line-clamp-2 font-medium">{item.desc}</p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-black italic text-primary">₺{item.price}</span>
                  <button onClick={(e) => { e.stopPropagation(); setCart([...cart, {...item, cartId: Date.now()}]); }} className="w-10 h-10 bg-white text-black rounded-xl font-black text-xl">+</button>
                </div>
              </div>
            </motion.div>
          ))}
        </main>
      )}

      {/* ACTIVE TRACKING SCREEN */}
      {screen === 'active' && (
        <main className="p-8 pt-16 flex flex-col items-center">
          <div className="w-24 h-24 bg-primary/10 rounded-[36px] flex items-center justify-center mb-8">
            <Coffee size={40} className="text-primary animate-bounce" />
          </div>
          <h2 className="text-4xl font-black uppercase italic italic mb-2">Hazırlanıyor</h2>
          <div className="w-full bg-zinc-900/50 p-8 rounded-[40px] border border-white/5 mb-8 text-center">
             <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Tahmini Teslimat</p>
             <div className="text-5xl font-black italic mb-4">
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
             </div>
             <div className="h-2 w-full bg-black rounded-full overflow-hidden">
                <motion.div 
                   animate={{ width: "100%" }}
                   transition={{ duration: timeLeft, ease: "linear" }}
                   className="h-full bg-primary"
                />
             </div>
          </div>

          {/* JUKEBOX SIMULATION */}
          <div className="w-full bg-[#1DB954]/5 p-6 rounded-[32px] border border-[#1DB954]/20 mb-8">
             <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
               <Music2 size={12} /> Sıradaki Şarkıyı Sen Seç
             </p>
             <div className="space-y-4">
                {JUKEBOX_QUEUE.map(song => (
                  <div key={song.id} className="flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold">{song.title}</p>
                      <p className="text-[10px] text-zinc-500">{song.artist}</p>
                    </div>
                    <button onClick={() => handleMusicVote(song)} className="px-4 py-2 bg-white/5 rounded-xl text-[10px] font-black uppercase">İste</button>
                  </div>
                ))}
             </div>
          </div>

          <button onClick={() => setIsBillOpen(true)} className="w-full bg-primary py-5 rounded-3xl font-black uppercase italic text-lg shadow-xl shadow-primary/20">Hesabı İste</button>
        </main>
      )}

      {/* SMART BILL MODAL */}
      <AnimatePresence>
        {isBillOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsBillOpen(false)} className="fixed inset-0 bg-black/90 backdrop-blur-md z-[110]" />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="fixed bottom-0 left-0 right-0 bg-[#0f0f0f] rounded-t-[48px] z-[120] p-10 border-t border-white/10 max-w-md mx-auto">
              <h3 className="text-2xl font-black uppercase italic mb-8 text-center">Ödeme Seçeneği</h3>
              
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { id: 'cash', icon: Banknote, label: 'Nakit' },
                  { id: 'card', icon: CreditCard, label: 'Kart' },
                  { id: 'split', icon: Users, label: 'Bölüş' }
                ].map((m) => (
                  <button 
                    key={m.id} 
                    onClick={() => setPaymentMethod(m.id)}
                    className={cn(
                      "flex flex-col items-center gap-3 p-6 rounded-3xl border transition-all",
                      paymentMethod === m.id ? "bg-primary border-primary" : "bg-black border-white/5 text-zinc-500"
                    )}
                  >
                    <m.icon size={24} />
                    <span className="text-[10px] font-black uppercase">{m.label}</span>
                  </button>
                ))}
              </div>

              {paymentMethod === 'split' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-black p-6 rounded-3xl border border-white/5 mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Kişi Sayısı</span>
                    <div className="flex items-center gap-6">
                      <button onClick={() => setSplitCount(Math.max(1, splitCount - 1))} className="w-10 h-10 bg-zinc-900 rounded-xl font-black text-xl">-</button>
                      <span className="font-black text-xl text-primary">{splitCount}</span>
                      <button onClick={() => setSplitCount(splitCount + 1)} className="w-10 h-10 bg-zinc-900 rounded-xl font-black text-xl">+</button>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Kişi Başı</span>
                    <span className="text-2xl font-black italic text-primary">₺{(totalPrice / splitCount).toFixed(2)}</span>
                  </div>
                </motion.div>
              )}

              <button 
                onClick={requestBill}
                disabled={!paymentMethod}
                className="w-full bg-white text-black py-6 rounded-3xl font-black uppercase italic text-xl shadow-2xl disabled:opacity-30"
              >
                Garsonu Çağır
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* FOOTER CART BAR */}
      {screen === 'menu' && totalPrice > 0 && (
        <div className="fixed bottom-8 left-6 right-6 z-50">
          <button onClick={() => setIsCartOpen(true)} className="w-full bg-primary p-5 rounded-3xl flex justify-between items-center shadow-2xl shadow-primary/40">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-black/20 rounded-xl flex items-center justify-center"><ShoppingCart size={20}/></div>
              <p className="font-black italic">₺{totalPrice}</p>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest bg-black/20 px-3 py-1 rounded-lg">Sepeti Onayla</span>
          </button>
        </div>
      )}

      {/* CRM & FEEDBACK Logic (Maintained but kept concise) */}
      <AnimatePresence>
        {isCrmOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
             <div className="bg-zinc-900 w-full rounded-[48px] p-10 border border-white/10 text-center">
                <Smartphone size={40} className="mx-auto mb-6 text-primary" />
                <h3 className="text-2xl font-black uppercase italic mb-8">Numaranı Gir</h3>
                <input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="0 (5xx) xxx xx xx" className="w-full bg-black border border-white/10 rounded-2xl p-5 text-center text-2xl font-black mb-8" />
                <button onClick={startOrder} className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase italic text-xl">Onayla</button>
             </div>
          </div>
        )}
      </AnimatePresence>

      {/* ITEM DETAIL MODAL */}
      <AnimatePresence>
        {selectedItem && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedItem(null)} className="fixed inset-0 bg-black/95 backdrop-blur-2xl z-[150]" />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="fixed bottom-0 left-0 right-0 bg-[#0a0a0a] rounded-t-[48px] z-[160] p-8 border-t border-white/10 max-w-md mx-auto">
              <img src={selectedItem.image} className="w-full h-64 object-cover rounded-[32px] mb-6" />
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-3xl font-black italic uppercase leading-none">{selectedItem.name}</h3>
                <span className="text-2xl font-black text-primary">₺{selectedItem.price}</span>
              </div>
              <div className="flex gap-3 mb-8">
                <div className="bg-zinc-900 px-4 py-2 rounded-xl text-[10px] font-black uppercase text-zinc-400 border border-white/5">{selectedItem.time} dk Hazırlık</div>
                <div className="bg-zinc-900 px-4 py-2 rounded-xl text-[10px] font-black uppercase text-zinc-400 border border-white/5">{selectedItem.kcal} kcal</div>
              </div>
              <div className="space-y-6 mb-10">
                <p className="text-sm text-zinc-400 leading-relaxed font-medium">{selectedItem.desc}</p>
                <div className="p-5 bg-zinc-900/50 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-black uppercase text-zinc-500 mb-2 tracking-widest">İçindekiler & Alerjen</p>
                  <p className="text-xs font-medium text-zinc-300">{selectedItem.ingredients}</p>
                  {selectedItem.allergens.length > 0 && <p className="text-[10px] font-black text-amber-500 mt-2 uppercase italic">⚠️ Alerjen: {selectedItem.allergens.join(', ')}</p>}
                </div>
              </div>
              <button onClick={() => { setCart([...cart, {...selectedItem, cartId: Date.now()}]); setSelectedItem(null); }} className="w-full bg-white text-black py-5 rounded-[24px] font-black uppercase italic text-xl">Sepete Ekle</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{` .no-scrollbar::-webkit-scrollbar { display: none; } `}</style>
    </div>
  );
};

export default App;
