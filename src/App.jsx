import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, X, Smartphone, CreditCard, Banknote, Star, Coffee, Clock, Search, 
  Music2, CheckCircle2, AlertTriangle, Users, LayoutDashboard, Utensils, Bell, 
  ChevronRight, Play, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- DATA ---
const MENU_DATA = {
  coffee: [
    { id: 1, name: "Signature Flat White", price: 85, time: 4, kcal: 120, desc: "Özel kavrum çekirdekler ve ipeksi süt köpüğü.", ingredients: "Espresso, Double Shot, Mikro-köpüklü Süt", image: "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=400&h=400&q=80", allergens: ["Süt"], badge: "Popüler" },
    { id: 2, name: "Yulaf Sütlü Latte", price: 95, time: 5, kcal: 85, desc: "Bitkisel süt tercih edenler için hafif bir seçenek.", ingredients: "Espresso, Yulaf Sütü, Vanilya Özü", image: "https://images.unsplash.com/photo-1551033406-611cf9a28f67?auto=format&fit=crop&w=400&h=400&q=80", allergens: [] },
  ],
  dessert: [
    { id: 4, name: "Belçika Brownie", price: 110, time: 7, kcal: 450, desc: "Sıcak servis edilir, yanında krema ile.", ingredients: "70% Kakao, Tereyağı, Ceviz, Belçika Çikolatası", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=400&h=400&q=80", allergens: ["Gluten", "Süt", "Kuruyemiş"], badge: "Şefin Seçimi" },
  ]
};

const App = () => {
  const [mode, setMode] = useState('customer'); // customer, kitchen
  const [screen, setScreen] = useState('menu'); // menu, active, feedback
  const [activeTab, setActiveTab] = useState('coffee');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isCrmOpen, setIsCrmOpen] = useState(false);
  const [isBillOpen, setIsBillOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [splitCount, setSplitCount] = useState(1);
  const [timeLeft, setTimeLeft] = useState(0);
  const [rating, setRating] = useState(0);
  const [jukeboxVote, setJukeboxVote] = useState(null);

  // Kasa Bildirimleri
  const [orders, setOrders] = useState([]);

  const totalPrice = cart.reduce((acc, item) => acc + item.price, 0);

  useEffect(() => {
    if (screen === 'active' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [screen, timeLeft]);

  const handleOrderConfirm = () => {
    const newOrder = {
      id: Math.random().toString(36).substr(2, 5).toUpperCase(),
      items: cart,
      total: totalPrice,
      table: '4',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'pending'
    };
    setOrders([newOrder, ...orders]);
    setTimeLeft(Math.max(...cart.map(i => i.time), 5) * 60);
    setIsCrmOpen(false);
    setScreen('active');
  };

  const handleBillConfirm = () => {
    const billNote = {
      id: 'BILL-' + Math.random().toString(36).substr(2, 3).toUpperCase(),
      type: 'bill',
      table: '4',
      total: totalPrice,
      method: paymentMethod,
      split: paymentMethod === 'split' ? splitCount : 1,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setOrders([billNote, ...orders]);
    setScreen('feedback');
    setIsBillOpen(false);
  };

  if (mode === 'kitchen') {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-[#050505] text-white p-6 font-sans">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-black italic uppercase tracking-tighter">Mutfak <span className="text-primary">Paneli</span></h2>
          <button onClick={() => setMode('customer')} className="p-3 bg-zinc-900 rounded-2xl text-zinc-500"><Utensils size={20} /></button>
        </div>
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="py-20 text-center text-zinc-800 font-black uppercase text-xs tracking-widest">Bekleyen İşlem Yok</div>
          ) : (
            orders.map(order => (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} key={order.id} className="bg-zinc-900/50 border border-white/5 p-6 rounded-[32px]">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary font-black">M{order.table}</div>
                    <div>
                      <h4 className="font-bold text-sm">{order.id}</h4>
                      <p className="text-[10px] text-zinc-600 font-bold uppercase">{order.time}</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-black uppercase text-zinc-500 bg-black px-2 py-1 rounded-lg">
                    {order.type === 'bill' ? 'HESAP' : 'SİPARİŞ'}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 font-medium mb-4">
                  {order.type === 'bill' ? `${order.method.toUpperCase()} - ₺${order.total}` : `${order.items.length} Ürün: ${order.items.map(i=>i.name).join(', ')}`}
                </p>
                <div className="flex gap-2">
                  <button onClick={() => setOrders(orders.filter(o => o.id !== order.id))} className="flex-1 bg-white text-black py-3 rounded-2xl font-black uppercase italic text-[10px]">Tamamlandı</button>
                  <button className="p-3 bg-zinc-800 rounded-xl text-zinc-500"><Bell size={16} /></button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#070707] text-white font-sans selection:bg-primary">
      
      {/* CUSTOMER HEADER */}
      {screen === 'menu' && (
        <header className="sticky top-0 z-40 bg-[#070707]/90 backdrop-blur-xl border-b border-white/5 p-6 flex justify-between items-center">
          <div onDoubleClick={() => setMode('kitchen')}>
            <h1 className="text-xl font-black italic tracking-tighter text-white uppercase">Prompter <span className="text-primary underline">Menu</span></h1>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Masa 4 • Kadıköy</p>
          </div>
          <button className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center border border-white/10 text-zinc-400">
            <Search size={18} />
          </button>
        </header>
      )}

      {/* MENU CONTENT */}
      {screen === 'menu' && (
        <main className="p-6 pb-32">
          <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar">
            {Object.keys(MENU_DATA).map(cat => (
              <button 
                key={cat} 
                onClick={() => setActiveTab(cat)}
                className={`px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${activeTab === cat ? 'bg-primary border-primary text-white' : 'bg-zinc-900 border-white/5 text-zinc-500'}`}
              >
                {cat === 'coffee' ? '☕ Kahveler' : '🍰 Tatlılar'}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {MENU_DATA[activeTab].map(item => (
              <motion.div 
                layout key={item.id} onClick={() => setSelectedItem(item)}
                className="flex gap-4 p-4 bg-zinc-900/30 rounded-[32px] border border-white/5 active:scale-[0.98] transition-all"
              >
                <div className="relative w-24 h-24 flex-shrink-0">
                  <img src={item.image} className="w-full h-full object-cover rounded-2xl shadow-xl" />
                  <div className="absolute -bottom-2 -right-2 bg-black/80 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 flex items-center gap-1">
                    <Clock size={10} className="text-primary" />
                    <span className="text-[9px] font-black">{item.time} dk</span>
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <h3 className="font-black italic text-[15px] mb-1 leading-none">{item.name}</h3>
                    <p className="text-[11px] text-zinc-500 line-clamp-2 leading-tight">{item.desc}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-black italic text-primary">₺{item.price}</span>
                    <button onClick={(e) => { e.stopPropagation(); setCart([...cart, {...item, cartId: Date.now()}]); }} className="w-10 h-10 bg-white text-black rounded-xl font-black text-xl">+</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </main>
      )}

      {/* ACTIVE TRACKING */}
      {screen === 'active' && (
        <main className="p-8 pt-16 flex flex-col items-center">
          <div className="w-24 h-24 bg-primary/10 rounded-[40px] flex items-center justify-center mb-8"><Coffee size={40} className="text-primary animate-bounce" /></div>
          <h2 className="text-4xl font-black uppercase italic mb-2">Hazırlanıyor</h2>
          <div className="w-full bg-zinc-900/50 p-10 rounded-[48px] border border-white/5 mb-8 text-center">
             <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-4">Kalan Süre</p>
             <div className="text-6xl font-black italic mb-6">
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
             </div>
             <div className="h-1.5 w-full bg-black rounded-full overflow-hidden">
                <motion.div animate={{ width: "100%" }} transition={{ duration: timeLeft, ease: "linear" }} className="h-full bg-primary" />
             </div>
          </div>

          <div className="w-full bg-[#1DB954]/5 p-6 rounded-[32px] border border-[#1DB954]/10 mb-8">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-[#1DB954] rounded-full flex items-center justify-center text-black"><Play size={16} fill="black" /></div>
                <div>
                  <p className="text-[9px] font-black text-[#1DB954] uppercase mb-1">Şu an çalıyor</p>
                  <p className="text-xs font-bold">Arctic Monkeys - Do I Wanna Know</p>
                </div>
             </div>
             <div className="space-y-3">
                <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Sıradaki Parçayı Sen Seç</p>
                <div className="flex justify-between items-center">
                   <p className="text-[11px] font-bold">RÜYA - Ege Çubukçu</p>
                   <button onClick={() => alert('İsteğin Kasaya İletildi!')} className="px-4 py-2 bg-white/5 rounded-xl text-[10px] font-black uppercase">İste</button>
                </div>
             </div>
          </div>

          <button onClick={() => setIsBillOpen(true)} className="w-full bg-primary py-5 rounded-3xl font-black uppercase italic text-lg shadow-xl shadow-primary/20">Hesabı İste</button>
        </main>
      )}

      {/* MODALS */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="fixed inset-0 z-[100] bg-black p-8 flex flex-col pt-20">
             <button onClick={() => setSelectedItem(null)} className="absolute top-8 right-8 p-3 bg-zinc-900 rounded-2xl"><X /></button>
             <img src={selectedItem.image} className="w-full h-72 object-cover rounded-[40px] mb-8" />
             <h3 className="text-3xl font-black italic uppercase mb-2 leading-none">{selectedItem.name}</h3>
             <div className="flex gap-3 mb-6">
                <span className="bg-zinc-900 px-3 py-1 rounded-lg text-[10px] font-black uppercase text-zinc-500">{selectedItem.time} dk</span>
                <span className="bg-zinc-900 px-3 py-1 rounded-lg text-[10px] font-black uppercase text-zinc-500">{selectedItem.kcal} kcal</span>
             </div>
             <p className="text-zinc-400 mb-8 font-medium leading-relaxed">{selectedItem.desc}</p>
             <div className="bg-zinc-900/50 p-5 rounded-[28px] border border-white/5 mb-8">
                <p className="text-[10px] font-black uppercase text-zinc-600 mb-2">İçindekiler</p>
                <p className="text-xs text-zinc-300 font-medium">{selectedItem.ingredients}</p>
             </div>
             <button onClick={() => { setCart([...cart, {...selectedItem, cartId: Date.now()}]); setSelectedItem(null); }} className="w-full bg-white text-black py-5 rounded-[32px] font-black uppercase italic text-xl mt-auto">Sepete Ekle • ₺{selectedItem.price}</button>
          </motion.div>
        )}

        {isCartOpen && (
          <div className="fixed inset-0 z-[110] flex flex-col justify-end">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsCartOpen(false)} />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} className="relative bg-[#121212] rounded-t-[48px] p-10 max-w-md mx-auto w-full border-t border-white/10 shadow-2xl">
              <h3 className="text-2xl font-black italic uppercase mb-8">Sepetin</h3>
              <div className="space-y-4 mb-8 max-h-[40vh] overflow-y-auto no-scrollbar">
                {cart.map(i => (
                  <div key={i.cartId} className="flex justify-between items-center bg-black/40 p-4 rounded-3xl border border-white/5">
                    <span className="font-bold text-sm">{i.name}</span>
                    <span className="font-black italic text-primary">₺{i.price}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mb-8 px-2 font-black italic">
                <span className="text-zinc-500 uppercase text-xs">Toplam</span>
                <span className="text-3xl text-primary">₺{totalPrice}</span>
              </div>
              <button onClick={() => { setIsCartOpen(false); setIsCrmOpen(true); }} className="w-full bg-primary py-5 rounded-3xl font-black uppercase italic text-lg shadow-xl shadow-primary/20">Siparişi Tamamla</button>
            </motion.div>
          </div>
        )}

        {isCrmOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black">
            <div className="w-full space-y-8 text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-[30px] flex items-center justify-center mx-auto text-primary animate-pulse"><Smartphone size={40} /></div>
              <h3 className="text-3xl font-black italic uppercase">Numaranı Gir</h3>
              <input type="tel" placeholder="05xx..." className="w-full bg-zinc-900 border border-white/10 p-6 rounded-3xl text-2xl font-black text-center focus:border-primary outline-none" />
              <button onClick={handleOrderConfirm} className="w-full bg-white text-black py-6 rounded-3xl font-black uppercase italic text-xl shadow-2xl">Siparişi Onayla</button>
            </div>
          </div>
        )}

        {isBillOpen && (
          <div className="fixed inset-0 z-[130] flex flex-col justify-end">
             <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setIsBillOpen(false)} />
             <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} className="relative bg-zinc-900 rounded-t-[48px] p-10 border-t border-white/10">
                <h3 className="text-2xl font-black uppercase italic mb-8 text-center">Ödeme Seçeneği</h3>
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {[
                    { id: 'cash', icon: Banknote, label: 'Nakit' },
                    { id: 'card', icon: CreditCard, label: 'Kart' },
                    { id: 'split', icon: Users, label: 'Bölüş' }
                  ].map(m => (
                    <button 
                      key={m.id} onClick={() => setPaymentMethod(m.id)}
                      className={`flex flex-col items-center gap-3 p-6 rounded-[32px] border transition-all ${paymentMethod === m.id ? 'bg-primary border-primary' : 'bg-black border-white/5 text-zinc-500'}`}
                    >
                      <m.icon size={24} />
                      <span className="text-[10px] font-black uppercase">{m.label}</span>
                    </button>
                  ))}
                </div>
                {paymentMethod === 'split' && (
                  <div className="bg-black p-6 rounded-3xl mb-8 border border-white/5">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-xs font-bold text-zinc-600 uppercase">Kişi Sayısı</span>
                      <div className="flex items-center gap-6 font-black text-xl">
                        <button onClick={() => setSplitCount(Math.max(1, splitCount-1))}>-</button>
                        <span className="text-primary">{splitCount}</span>
                        <button onClick={() => setSplitCount(splitCount+1)}>+</button>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                      <span className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Kişi Başı</span>
                      <span className="text-2xl font-black italic text-primary">₺{(totalPrice / splitCount).toFixed(2)}</span>
                    </div>
                  </div>
                )}
                <button onClick={handleBillConfirm} disabled={!paymentMethod} className="w-full bg-white text-black py-6 rounded-3xl font-black uppercase italic text-xl disabled:opacity-30">Garsonu Çağır</button>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FLOATING CART BAR */}
      {screen === 'menu' && totalPrice > 0 && (
        <div className="fixed bottom-10 left-6 right-6 z-50">
          <button onClick={() => setIsCartOpen(true)} className="w-full bg-primary p-5 rounded-3xl flex justify-between items-center shadow-2xl shadow-primary/40 active:scale-95 transition-transform">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-black/20 rounded-xl flex items-center justify-center"><ShoppingCart size={20} /></div>
                <span className="font-black italic text-xl">₺{totalPrice}</span>
             </div>
             <span className="text-[10px] font-black uppercase tracking-widest bg-black/20 px-4 py-2 rounded-xl">Sepeti Onayla</span>
          </button>
        </div>
      )}

      {/* FEEDBACK SCREEN */}
      {screen === 'feedback' && (
        <div className="min-h-screen flex flex-col items-center justify-center p-10 text-center bg-black">
          <div className="w-24 h-24 bg-primary/10 rounded-[40px] flex items-center justify-center text-primary mb-8"><CheckCircle2 size={48} /></div>
          <h2 className="text-5xl font-black uppercase italic italic mb-4">Afiyet <span className="text-primary block mt-2">Olsun!</span></h2>
          <p className="text-zinc-500 mb-12 font-medium">Lütfen bizi değerlendir.</p>
          <div className="flex gap-4 mb-16">
            {[1, 2, 3, 4, 5].map(s => <Star key={s} size={40} onClick={() => setRating(s)} fill={rating >= s ? "#FF6B00" : "none"} color={rating >= s ? "#FF6B00" : "#27272a"} />)}
          </div>
          <button onClick={() => window.location.reload()} className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.3em] border-b border-zinc-900 pb-1">Menüye Dön</button>
        </div>
      )}

      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
};

export default App;
