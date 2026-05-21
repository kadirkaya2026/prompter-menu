import React, { useState, useEffect } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  useParams, 
  useNavigate,
  Link
} from 'react-router-dom';
import { 
  ShoppingCart, X, Smartphone, CreditCard, Banknote, Star, Coffee, Clock, Search, 
  Info, Music2, CheckCircle2, AlertTriangle, Users, LayoutDashboard, Utensils, Bell,
  ChevronRight, Plus, LogIn, Store, Trash2, ArrowLeft, Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) { return twMerge(clsx(inputs)); }

// --- DATA MOCK & STORAGE HELPERS ---

const DEFAULT_RESTAURANTS = [
  { id: 'prompter-kadikoy', name: 'Prompter Kadıköy', logo: '☕', address: 'Moda Cd. No:4' },
  { id: 'prompter-besiktas', name: 'Prompter Beşiktaş', logo: '🥐', address: 'Ihlamurdere Cd. No:12' }
];

const INITIAL_MENU = {
  coffee: [
    { id: 1, name: "Signature Flat White", price: 85, time: 4, kcal: 120, desc: "Özel kavrum çekirdekler ve ipeksi süt köpüğü.", ingredients: "Espresso, Double Shot, Mikro-köpüklü Süt", image: "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=300&h=300&q=80", allergens: ["Süt"], badge: "Popüler" },
    { id: 2, name: "Yulaf Sütlü Latte", price: 95, time: 5, kcal: 85, desc: "Bitkisel süt tercih edenler için hafif bir seçenek.", ingredients: "Espresso, Yulaf Sütü, Vanilya Özü", image: "https://images.unsplash.com/photo-1551033406-611cf9a28f67?auto=format&fit=crop&w=300&h=300&q=80", allergens: [] },
  ],
  dessert: [
    { id: 4, name: "Belçika Çikolatalı Brownie", price: 110, time: 7, kcal: 450, desc: "Sıcak servis edilir, yanında krema ile.", ingredients: "70% Kakao, Tereyağı, Ceviz, Belçika Çikolatası", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=300&h=300&q=80", allergens: ["Gluten", "Süt", "Kuruyemiş"], badge: "Şefin Seçimi" },
  ]
};

const getStorage = (key, def) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : def;
};

const setStorage = (key, val) => localStorage.setItem(key, JSON.stringify(val));

// --- COMPONENTS ---

// 1. LANDING / RESTAURANT SELECTION
const Landing = () => {
  const [restaurants] = useState(() => getStorage('restaurants', DEFAULT_RESTAURANTS));
  
  return (
    <div className="min-h-screen bg-[#070707] p-8">
      <div className="mb-12 text-center pt-12">
        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">Prompter <span className="text-primary underline">Network</span></h1>
        <p className="text-zinc-500 text-sm mt-2 font-medium">Lütfen restoran seçiniz veya QR okutunuz.</p>
      </div>

      <div className="grid gap-4">
        {restaurants.map(res => (
          <Link to={`/${res.id}/menu`} key={res.id}>
            <motion.div whileTap={{ scale: 0.98 }} className="bg-zinc-900/50 border border-white/5 p-6 rounded-[32px] flex items-center gap-6">
              <div className="text-4xl">{res.logo}</div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">{res.name}</h3>
                <p className="text-xs text-zinc-500">{res.address}</p>
              </div>
              <ChevronRight className="text-zinc-700" />
            </motion.div>
          </Link>
        ))}
      </div>

      <div className="mt-20 text-center">
        <Link to="/admin/login" className="text-[10px] font-black uppercase text-zinc-700 tracking-[0.3em] hover:text-primary transition-colors">
          Restoran Sahibi Misiniz? Admin Girişi
        </Link>
      </div>
    </div>
  );
};

// 2. CUSTOMER MENU
const CustomerMenu = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('coffee');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isCrmOpen, setIsCrmOpen] = useState(false);
  const [screen, setScreen] = useState('menu'); // menu, active, feedback
  const [timeLeft, setTimeLeft] = useState(0);
  const [orderId, setOrderId] = useState(null);

  const restaurant = DEFAULT_RESTAURANTS.find(r => r.id === restaurantId) || DEFAULT_RESTAURANTS[0];
  const totalPrice = cart.reduce((acc, item) => acc + item.price, 0);

  useEffect(() => {
    if (screen === 'active' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [screen, timeLeft]);

  const sendOrder = () => {
    const orders = getStorage('orders', []);
    const newOrder = {
      id: Math.random().toString(36).substr(2, 9),
      restaurantId,
      items: cart,
      total: totalPrice,
      table: '4',
      status: 'pending',
      timestamp: Date.now(),
      timeLeft: Math.max(...cart.map(i => i.time), 5) * 60
    };
    setStorage('orders', [newOrder, ...orders]);
    setOrderId(newOrder.id);
    setTimeLeft(newOrder.timeLeft);
    setIsCrmOpen(false);
    setScreen('active');
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#070707] text-white">
      {screen === 'menu' && (
        <>
          <header className="sticky top-0 z-40 bg-[#070707]/90 backdrop-blur-xl border-b border-white/5 p-6 flex justify-between items-center">
            <button onClick={() => navigate('/')}><ArrowLeft size={20} className="text-zinc-500" /></button>
            <div className="text-center">
              <h1 className="text-xl font-black italic tracking-tighter uppercase">{restaurant.name}</h1>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Masa 4 • QR Sipariş</p>
            </div>
            <button className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center border border-white/10"><Search size={18} /></button>
          </header>

          <main className="p-6 pb-32 space-y-4">
             {/* Categories */}
             <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6">
                {Object.keys(INITIAL_MENU).map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      "px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all",
                      activeCategory === cat ? "bg-primary border-primary" : "bg-zinc-900 border-white/5 text-zinc-500"
                    )}
                  >
                    {cat === 'coffee' ? 'Kahveler' : 'Tatlılar'}
                  </button>
                ))}
             </div>
             
             {INITIAL_MENU[activeCategory].map(item => (
              <motion.div 
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="flex gap-4 p-4 bg-zinc-900/30 rounded-[32px] border border-white/5 active:scale-[0.97] transition-all"
              >
                <img src={item.image} className="w-24 h-24 object-cover rounded-2xl" />
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <h3 className="font-black italic text-base leading-none mb-1">{item.name}</h3>
                    <p className="text-[11px] text-zinc-500 line-clamp-2">{item.desc}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-black italic text-primary">₺{item.price}</span>
                    <button onClick={(e) => { e.stopPropagation(); setCart([...cart, {...item, cartId: Date.now()}]); }} className="w-10 h-10 bg-white text-black rounded-xl font-black text-xl">+</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </main>

          {totalPrice > 0 && (
            <div className="fixed bottom-8 left-6 right-6 z-50">
              <button onClick={() => setIsCartOpen(true)} className="w-full bg-primary p-5 rounded-3xl flex justify-between items-center shadow-2xl">
                <div className="flex items-center gap-4">
                  <ShoppingCart size={20} />
                  <p className="font-black italic text-xl">₺{totalPrice}</p>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest bg-black/20 px-4 py-2 rounded-xl">Sepeti Onayla</span>
              </button>
            </div>
          )}
        </>
      )}

      {screen === 'active' && (
        <div className="p-8 pt-16 flex flex-col items-center">
          <div className="w-24 h-24 bg-primary/10 rounded-[36px] flex items-center justify-center mb-8"><Coffee size={40} className="text-primary animate-bounce" /></div>
          <h2 className="text-4xl font-black uppercase italic mb-2 tracking-tighter">Hazırlanıyor</h2>
          <div className="w-full bg-zinc-900/50 p-10 rounded-[48px] border border-white/5 mb-8 text-center">
             <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">Tahmini Teslimat</p>
             <div className="text-6xl font-black italic mb-6">
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
             </div>
             <div className="h-2 w-full bg-black rounded-full overflow-hidden">
                <motion.div animate={{ width: "100%" }} transition={{ duration: timeLeft, ease: "linear" }} className="h-full bg-primary" />
             </div>
          </div>
          <button onClick={() => setScreen('feedback')} className="w-full bg-white text-black py-5 rounded-3xl font-black uppercase italic text-lg mt-20">Hesabı İste</button>
        </div>
      )}

      {screen === 'feedback' && (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
          <CheckCircle2 size={80} className="text-primary mb-8" />
          <h2 className="text-4xl font-black uppercase italic mb-12">Afiyet <span className="text-primary block">Olsun!</span></h2>
          <button onClick={() => navigate('/')} className="text-zinc-600 font-black uppercase tracking-widest text-[10px] border-b border-zinc-800 pb-1">Anasayfaya Dön</button>
        </div>
      )}

      {/* DETAIL MODAL */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="fixed inset-0 z-[100] bg-black p-8 flex flex-col pt-20">
            <button onClick={() => setSelectedItem(null)} className="absolute top-8 right-8 p-3 bg-zinc-900 rounded-2xl"><X /></button>
            <img src={selectedItem.image} className="w-full h-72 object-cover rounded-[40px] mb-8" />
            <h3 className="text-4xl font-black italic uppercase mb-4">{selectedItem.name}</h3>
            <p className="text-zinc-400 mb-8 font-medium leading-relaxed">{selectedItem.desc}</p>
            <div className="mt-auto flex gap-4">
              <div className="flex-1 bg-zinc-900 p-6 rounded-[32px] border border-white/5">
                <p className="text-[10px] font-black uppercase text-zinc-500 mb-1">Fiyat</p>
                <p className="text-2xl font-black italic text-primary">₺{selectedItem.price}</p>
              </div>
              <button onClick={() => { setCart([...cart, {...selectedItem, cartId: Date.now()}]); setSelectedItem(null); }} className="flex-[2] bg-white text-black rounded-[32px] font-black uppercase italic text-xl">Sepete Ekle</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CART MODAL & CRM */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-[110] flex flex-col justify-end">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsCartOpen(false)} />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} className="relative bg-zinc-900 rounded-t-[48px] p-10 max-w-md mx-auto w-full border-t border-white/10">
              <h3 className="text-2xl font-black italic uppercase mb-8">Sepetim</h3>
              <div className="space-y-4 mb-8 max-h-[40vh] overflow-y-auto no-scrollbar">
                {cart.map(i => (
                  <div key={i.cartId} className="flex justify-between items-center bg-black/40 p-4 rounded-3xl">
                    <span className="font-bold">{i.name}</span>
                    <span className="font-black italic text-primary">₺{i.price}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => { setIsCartOpen(false); setIsCrmOpen(true); }} className="w-full bg-primary py-5 rounded-3xl font-black uppercase italic text-lg">Siparişi Tamamla</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCrmOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black">
            <div className="w-full space-y-8 text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-[30px] flex items-center justify-center mx-auto text-primary"><Smartphone size={40} /></div>
              <h3 className="text-3xl font-black italic uppercase">Numaranı Gir</h3>
              <input type="tel" placeholder="05xx..." className="w-full bg-zinc-900 border border-white/10 p-6 rounded-3xl text-2xl font-black text-center" />
              <button onClick={sendOrder} className="w-full bg-white text-black py-6 rounded-3xl font-black uppercase italic text-xl">Siparişi Onayla</button>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// 3. ADMIN LOGIN
const AdminLogin = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-[30px] flex items-center justify-center mx-auto text-primary mb-6"><LogIn size={40} /></div>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter">Admin <span className="text-primary underline">Panel</span></h2>
        </div>
        <div className="space-y-4">
          <input type="text" placeholder="Kullanıcı Adı" className="w-full bg-zinc-900 border border-white/5 p-5 rounded-2xl font-medium focus:border-primary transition-colors outline-none" />
          <input type="password" placeholder="Şifre" className="w-full bg-zinc-900 border border-white/5 p-5 rounded-2xl font-medium focus:border-primary transition-colors outline-none" />
          <button onClick={() => navigate('/admin/dashboard')} className="w-full bg-primary py-5 rounded-2xl font-black uppercase italic text-lg shadow-xl shadow-primary/20 mt-4">Giriş Yap</button>
        </div>
      </div>
    </div>
  );
};

// 4. ADMIN DASHBOARD
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState(() => getStorage('restaurants', DEFAULT_RESTAURANTS));
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [newName, setNewName] = useState('');

  const createRestaurant = () => {
    const newRes = {
      id: newName.toLowerCase().replace(/\s/g, '-'),
      name: newName,
      logo: '☕',
      address: 'Yeni Adres'
    };
    const updated = [...restaurants, newRes];
    setRestaurants(updated);
    setStorage('restaurants', updated);
    setIsNewOpen(false);
    setNewName('');
  };

  return (
    <div className="min-h-screen bg-[#050505] p-8">
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-2xl font-black italic uppercase tracking-tighter">Restoran <span className="text-primary">Yönetimi</span></h2>
        <button onClick={() => navigate('/')} className="p-3 bg-zinc-900 rounded-2xl text-zinc-500"><X size={20} /></button>
      </div>

      <div className="grid gap-4">
        {restaurants.map(res => (
          <div key={res.id} className="bg-zinc-900/50 border border-white/5 p-6 rounded-[32px] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-2xl">{res.logo}</div>
              <h3 className="font-bold">{res.name}</h3>
            </div>
            <div className="flex gap-2">
              <button onClick={() => navigate(`/admin/${res.id}`)} className="p-3 bg-white text-black rounded-xl"><LayoutDashboard size={18} /></button>
              <button className="p-3 bg-zinc-800 text-red-500 rounded-xl"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}

        <button onClick={() => setIsNewOpen(true)} className="w-full border-2 border-dashed border-zinc-800 p-6 rounded-[32px] flex items-center justify-center gap-2 text-zinc-600 font-bold hover:border-primary/50 hover:text-primary transition-all">
          <Plus size={20} /> Yeni Restoran Ekle
        </button>
      </div>

      <AnimatePresence>
        {isNewOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-zinc-900 p-8 rounded-[40px] w-full max-w-sm border border-white/10">
              <h3 className="text-xl font-black italic uppercase mb-6 text-center">Yeni Restoran</h3>
              <input value={newName} onChange={e => setNewName(e.target.value)} type="text" placeholder="Restoran Adı" className="w-full bg-black border border-white/5 p-5 rounded-2xl mb-6 font-bold" />
              <div className="flex gap-4">
                <button onClick={() => setIsNewOpen(false)} className="flex-1 py-4 font-bold text-zinc-500">İptal</button>
                <button onClick={createRestaurant} className="flex-1 bg-primary py-4 rounded-2xl font-black uppercase italic">Oluştur</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// 5. RESTAURANT KASA PANEL (THE IMPORTANT ONE)
const KasaPanel = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  
  // Real-time sync sim (localstorage check every 2 seconds)
  useEffect(() => {
    const checkOrders = () => {
      const allOrders = getStorage('orders', []);
      const restaurantOrders = allOrders.filter(o => o.restaurantId === restaurantId);
      setOrders(restaurantOrders);
    };
    checkOrders();
    const interval = setInterval(checkOrders, 2000);
    return () => clearInterval(interval);
  }, [restaurantId]);

  const updateStatus = (orderId, status) => {
    const allOrders = getStorage('orders', []);
    const updated = allOrders.map(o => o.id === orderId ? {...o, status} : o);
    setStorage('orders', updated);
    setOrders(updated.filter(o => o.restaurantId === restaurantId));
  };

  return (
    <div className="min-h-screen bg-[#050505] p-6">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-2xl font-black italic uppercase tracking-tighter">Kasa <span className="text-primary">Paneli</span></h2>
          <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">{restaurantId}</p>
        </div>
        <button onClick={() => navigate('/admin/dashboard')} className="p-3 bg-zinc-900 rounded-2xl text-zinc-400"><Store size={20} /></button>
      </div>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-20 text-zinc-700 font-black uppercase text-xs tracking-[0.3em]">Henüz Sipariş Yok</div>
        ) : (
          orders.map(order => (
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} key={order.id} className="bg-zinc-900/50 border border-white/5 rounded-[32px] p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black italic">M{order.table}</div>
                  <div>
                    <h4 className="font-bold text-sm">#{order.id.substr(0, 5)}</h4>
                    <p className="text-[10px] text-zinc-600 font-bold uppercase">{new Date(order.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>
                <div className={cn(
                  "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest italic",
                  order.status === 'pending' ? "bg-amber-500/10 text-amber-500" : "bg-green-500/10 text-green-500"
                )}>
                  {order.status === 'pending' ? 'Bekliyor' : 'Hazır'}
                </div>
              </div>

              <div className="space-y-2 mb-6 border-y border-white/5 py-4">
                {order.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-xs font-medium">
                    <span className="text-zinc-400">1x {it.name}</span>
                    <span className="font-black italic">₺{it.price}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-2 text-primary font-black italic">
                  <span>Toplam</span>
                  <span>₺{order.total}</span>
                </div>
              </div>

              <div className="flex gap-3">
                {order.status === 'pending' ? (
                  <button onClick={() => updateStatus(order.id, 'ready')} className="flex-1 bg-white text-black py-3 rounded-2xl font-black uppercase italic text-xs tracking-tighter">Hazırla & Bildir</button>
                ) : (
                  <button onClick={() => {
                    const all = getStorage('orders', []);
                    const filtered = all.filter(o => o.id !== order.id);
                    setStorage('orders', filtered);
                    setOrders(filtered.filter(o => o.restaurantId === restaurantId));
                  }} className="flex-1 bg-zinc-800 text-zinc-500 py-3 rounded-2xl font-black uppercase italic text-xs tracking-tighter">Kapat</button>
                )}
                <button className="px-4 py-3 bg-zinc-900 rounded-2xl text-zinc-400"><Bell size={16}/></button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---

const App = () => {
  return (
    <Router>
      <Routes>
        {/* CUSTOMER ROUTES */}
        <Route path="/" element={<Landing />} />
        <Route path="/:restaurantId/menu" element={<CustomerMenu />} />
        
        {/* ADMIN ROUTES */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/:restaurantId" element={<KasaPanel />} />
      </Routes>
    </Router>
  );
};

export default App;
