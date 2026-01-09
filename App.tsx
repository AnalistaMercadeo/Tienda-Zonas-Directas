import React, { useState, useEffect } from 'react';
import { ShoppingCart, User, LogOut, CheckCircle, Trophy, Flag, MapPin, Truck, Phone, Package, Menu, X, Settings, Hash } from 'lucide-react';
import { Client, Reward, OrderDetails, CartItem } from './types';
import { getDatabase, getPoints, deductPoints } from './services/db';
import { AdminPanel } from './components/AdminPanel';

type ViewState = 'login' | 'store' | 'checkout' | 'success' | 'admin';

// Extracted Component to avoid "useState inside loop" error
const RewardCard = ({ 
  reward, 
  currentUser, 
  currentPoints, 
  onAddToCart 
}: { 
  reward: Reward; 
  currentUser: Client; 
  currentPoints: number; 
  onAddToCart: (reward: Reward, qty: number) => void;
}) => {
  const [qty, setQty] = useState(1);
  const price = currentUser.type === 'Pareto' ? reward.pointsPareto : reward.pointsNormal;
  const canAfford = currentPoints >= price;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow border border-gray-100 flex flex-col">
      <div className="h-48 overflow-hidden relative">
        <img src={reward.imageUrl} alt={reward.name} className="w-full h-full object-cover transition-transform hover:scale-110 duration-500" />
        {!canAfford && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-bold border border-white px-3 py-1 rounded">Insuficiente</span>
          </div>
        )}
      </div>
      <div className="p-6 flex-grow flex flex-col">
        <h4 className="text-xl font-bold text-gray-800 mb-2 leading-tight">{reward.name}</h4>
        <p className="text-gray-500 text-sm mb-4 flex-grow">{reward.description}</p>
        
        <div className="flex justify-between items-end mt-4">
          <div>
            <p className="text-xs text-gray-400 uppercase">Costo</p>
            <p className={`text-3xl font-sports ${canAfford ? 'text-gulf-blue' : 'text-red-400'}`}>
              {price.toLocaleString()} pts
            </p>
          </div>
          
          <div className="flex flex-col items-end gap-2">
             <div className="flex items-center border rounded">
               <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-2 py-1 hover:bg-gray-100 text-gray-600">-</button>
               <span className="px-2 w-8 text-center text-sm font-bold">{qty}</span>
               <button onClick={() => setQty(qty + 1)} className="px-2 py-1 hover:bg-gray-100 text-gray-600">+</button>
             </div>
             <button 
              onClick={() => onAddToCart(reward, qty)}
              disabled={!canAfford}
              className={`px-4 py-2 rounded-lg font-bold text-sm shadow-sm transition-colors ${canAfford ? 'bg-gulf-orange text-white hover:bg-orange-600' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
             >
               CANJEAR
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  // Application State
  const [view, setView] = useState<ViewState>('login');
  const [currentUser, setCurrentUser] = useState<Client | null>(null);
  const [currentPoints, setCurrentPoints] = useState<number>(0);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Login Form State
  const [loginId, setLoginId] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [clientsList, setClientsList] = useState<Client[]>([]);

  // Order Form State
  const [orderDetails, setOrderDetails] = useState<OrderDetails>({
    address: '', receiver: '', city: '', phone: ''
  });

  // Load Data on Mount
  useEffect(() => {
    const db = getDatabase();
    setClientsList(db.clients);
  }, [view]);

  // Actions
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate credentials using ID (businessId) and Password
    const user = clientsList.find(c => c.businessId === loginId && c.password === loginPass);
    
    if (user) {
      setCurrentUser(user);
      setCurrentPoints(getPoints(user.pointOfSale));
      setView('store');
    } else {
      alert('ID o Contraseña incorrectos.');
    }
  };

  const addToCart = (reward: Reward, qty: number) => {
    if (qty <= 0) return;
    
    const price = currentUser?.type === 'Pareto' ? reward.pointsPareto : reward.pointsNormal;
    const existing = cart.find(c => c.id === reward.id);

    if (existing) {
      setCart(cart.map(c => c.id === reward.id ? { ...c, quantity: c.quantity + qty } : c));
    } else {
      setCart([...cart, { ...reward, quantity: qty, appliedPrice: price || 0 }]);
    }
    alert(`¡${qty}x ${reward.name} agregado al carrito!`);
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(c => c.id !== id));
  };

  const calculateTotal = () => {
    return cart.reduce((acc, item) => acc + (item.appliedPrice * item.quantity), 0);
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    const total = calculateTotal();

    if (!currentUser) return;

    if (total > currentPoints) {
      alert(`Error: No tienes suficientes puntos. Necesitas ${total}, tienes ${currentPoints}.`);
      return;
    }

    setLoading(true);

    // Simulate Network Request
    setTimeout(() => {
      const success = deductPoints(currentUser.pointOfSale, total);
      if (success) {
        // Log "Email" to console
        console.log(`
          --- EMAIL ENVIADO ---
          Para: agallego@gulfcolombia.com, asismercadeo@gulfcolombia.com
          Asunto: Nuevo Canje de Premios - ${currentUser.pointOfSale}
          
          Detalles del Pedido:
          Punto de Venta: ${currentUser.pointOfSale}
          ID Cliente (NIT): ${currentUser.businessId}
          Tipo Cliente: ${currentUser.type}
          Items:
          ${cart.map(c => `- ${c.quantity}x ${c.name} (${c.appliedPrice} pts c/u)`).join('\n')}
          
          Total Puntos Redimidos: ${total}
          
          Datos de Envío:
          Recibe: ${orderDetails.receiver}
          Dirección: ${orderDetails.address}
          Ciudad: ${orderDetails.city}
          Teléfono: ${orderDetails.phone}
          ---------------------
        `);
        
        setCurrentPoints(prev => prev - total);
        setCart([]);
        setView('success');
      } else {
        alert('Error al procesar la transacción.');
      }
      setLoading(false);
    }, 1500);
  };

  // --- Render Helpers ---

  // Header Component
  const Header = () => (
    <header className="bg-gulf-blue text-white shadow-lg sticky top-0 z-50 border-b-4 border-gulf-orange">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="bg-white p-1 rounded-full">
             <Trophy size={32} className="text-gulf-orange" />
          </div>
          <div>
             <h1 className="text-2xl font-sports tracking-wide leading-none">PROLUB GULF</h1>
             <p className="text-xs text-gulf-lightblue font-bold tracking-wider">MUNDIAL 2026 REWARDS</p>
          </div>
        </div>
        
        {currentUser && view !== 'login' && view !== 'admin' && (
          <div className="flex items-center space-x-6">
            <div className="hidden md:block text-right">
              <p className="text-sm opacity-80">{currentUser.pointOfSale}</p>
              <p className="font-sports text-xl text-gulf-orange">{currentPoints.toLocaleString()} Pts</p>
            </div>
            
            <button onClick={() => setView('store')} className="hover:text-gulf-orange transition-colors">
              Catálogo
            </button>
            
            <button onClick={() => cart.length > 0 && setView('checkout')} className="relative hover:text-gulf-orange transition-colors">
              <ShoppingCart size={24} />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-gulf-orange text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cart.reduce((a, b) => a + b.quantity, 0)}
                </span>
              )}
            </button>

            <button onClick={() => { setCurrentUser(null); setView('login'); setCart([]); }} className="text-red-400 hover:text-red-300" title="Salir">
              <LogOut size={24} />
            </button>
          </div>
        )}
      </div>
    </header>
  );

  // Views
  if (view === 'login') {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        <div className="flex-grow flex items-center justify-center p-4" 
             style={{backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")', backgroundColor: '#f3f4f6'}}>
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-md w-full border border-gray-200">
            <div className="bg-gulf-blue p-8 text-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
               <Trophy className="mx-auto text-gulf-orange mb-4 w-16 h-16 animate-bounce" />
               <h2 className="text-4xl font-sports text-white mb-2 relative z-10">ACCESO EXCLUSIVO</h2>
               <p className="text-gulf-lightblue text-sm relative z-10">Plataforma de Fidelización Prolub SA</p>
            </div>
            <form onSubmit={handleLogin} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Usuario / ID</label>
                <div className="relative">
                   <Hash className="absolute left-3 top-3 text-gray-400" size={20}/>
                   <input 
                    type="text"
                    required
                    placeholder="# Ingrese el ID asignado"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gulf-orange focus:border-transparent outline-none"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                   />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Contraseña</label>
                <div className="relative">
                   <Settings className="absolute left-3 top-3 text-gray-400" size={20}/>
                   <input 
                    type="password"
                    required
                    placeholder="Ingrese su clave"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gulf-orange focus:border-transparent outline-none"
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                   />
                </div>
              </div>
              <button type="submit" className="w-full bg-gulf-orange hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-[1.02] shadow-lg">
                INGRESAR AL JUEGO
              </button>
            </form>
            <div className="bg-gray-50 p-4 text-center border-t">
              <button onClick={() => setView('admin')} className="text-xs text-gray-400 hover:text-gulf-blue">Acceso Administrativo</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'admin') {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Header />
        <main className="container mx-auto p-4 flex-grow">
          <AdminPanel onLogout={() => setView('login')} />
        </main>
      </div>
    );
  }

  if (view === 'store' && currentUser) {
    const rewards = getDatabase().rewards;
    
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Header />
        
        {/* Dashboard Banner */}
        <div className="bg-gradient-to-r from-gulf-blue to-blue-800 text-white py-12 px-4 relative overflow-hidden">
           <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 transform skew-x-12 bg-white"></div>
           <div className="container mx-auto relative z-10">
             <h2 className="text-5xl font-sports mb-2">HOLA, <span className="text-gulf-orange">{currentUser.pointOfSale.toUpperCase()}</span></h2>
             <p className="text-xl opacity-90 mb-6">Tu categoría actual es: <span className="font-bold bg-white text-gulf-blue px-2 py-0.5 rounded text-sm uppercase">{currentUser.type}</span></p>
             <div className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 pr-8">
                <p className="text-sm uppercase tracking-widest opacity-70">Saldo Disponible</p>
                <p className="text-6xl font-sports text-white leading-none">{currentPoints.toLocaleString()}</p>
             </div>
           </div>
        </div>

        {/* Catalog */}
        <main className="container mx-auto px-4 py-8 flex-grow">
          <h3 className="text-3xl font-sports text-gulf-blue mb-6 border-l-4 border-gulf-orange pl-3">PREMIOS TITULARES</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rewards.map(reward => (
              <RewardCard 
                key={reward.id} 
                reward={reward} 
                currentUser={currentUser} 
                currentPoints={currentPoints} 
                onAddToCart={addToCart} 
              />
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (view === 'checkout') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
           <button onClick={() => setView('store')} className="mb-6 text-gulf-blue hover:underline flex items-center">
             ← Volver al Catálogo
           </button>
           
           <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row">
              {/* Order Summary */}
              <div className="bg-gray-800 text-white p-8 md:w-1/3">
                 <h3 className="text-2xl font-sports mb-6 text-gulf-orange">TU SELECCIÓN</h3>
                 <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                   {cart.map((item, idx) => (
                     <div key={idx} className="flex justify-between items-start border-b border-gray-700 pb-2">
                        <div>
                           <p className="font-bold text-sm">{item.name}</p>
                           <p className="text-xs text-gray-400">Cant: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono text-gulf-lightblue">{(item.appliedPrice * item.quantity).toLocaleString()}</p>
                          <button onClick={() => removeFromCart(item.id)} className="text-xs text-red-400 hover:text-red-300">Eliminar</button>
                        </div>
                     </div>
                   ))}
                 </div>
                 <div className="mt-8 pt-4 border-t border-gray-600">
                    <div className="flex justify-between text-xl font-bold">
                       <span>Total</span>
                       <span>{calculateTotal().toLocaleString()} pts</span>
                    </div>
                    <p className="text-xs text-right mt-1 text-gray-400">Saldo restante: {(currentPoints - calculateTotal()).toLocaleString()} pts</p>
                 </div>
              </div>

              {/* Checkout Form */}
              <div className="p-8 md:w-2/3">
                 <h3 className="text-2xl font-sports text-gulf-blue mb-6 flex items-center">
                   <Truck className="mr-2" /> DATOS DE ENVÍO
                 </h3>
                 <form onSubmit={handleCheckout} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Recibe (Nombre)</label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 text-gray-400" size={16}/>
                            <input required type="text" className="w-full pl-9 border p-2 rounded focus:ring-1 focus:ring-gulf-orange outline-none" 
                                   value={orderDetails.receiver} onChange={e => setOrderDetails({...orderDetails, receiver: e.target.value})} />
                          </div>
                       </div>
                       <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Teléfono</label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 text-gray-400" size={16}/>
                            <input required type="tel" className="w-full pl-9 border p-2 rounded focus:ring-1 focus:ring-gulf-orange outline-none"
                                   value={orderDetails.phone} onChange={e => setOrderDetails({...orderDetails, phone: e.target.value})} />
                          </div>
                       </div>
                    </div>
                    <div>
                       <label className="block text-sm font-bold text-gray-700 mb-1">Dirección Completa</label>
                       <div className="relative">
                         <MapPin className="absolute left-3 top-3 text-gray-400" size={16}/>
                         <input required type="text" className="w-full pl-9 border p-2 rounded focus:ring-1 focus:ring-gulf-orange outline-none"
                                value={orderDetails.address} onChange={e => setOrderDetails({...orderDetails, address: e.target.value})} />
                       </div>
                    </div>
                    <div>
                       <label className="block text-sm font-bold text-gray-700 mb-1">Ciudad / Municipio</label>
                       <div className="relative">
                         <Flag className="absolute left-3 top-3 text-gray-400" size={16}/>
                         <input required type="text" className="w-full pl-9 border p-2 rounded focus:ring-1 focus:ring-gulf-orange outline-none"
                                value={orderDetails.city} onChange={e => setOrderDetails({...orderDetails, city: e.target.value})} />
                       </div>
                    </div>
                    
                    <div className="pt-6">
                       <button type="submit" disabled={loading} className="w-full bg-gulf-orange hover:bg-orange-600 text-white font-bold py-4 rounded-lg shadow-lg transition-all flex justify-center items-center text-lg">
                          {loading ? 'Procesando...' : `CONFIRMAR CANJE POR ${calculateTotal().toLocaleString()} PTS`}
                       </button>
                    </div>
                 </form>
              </div>
           </div>
        </main>
      </div>
    );
  }

  if (view === 'success') {
    return (
      <div className="min-h-screen bg-gulf-blue flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg text-center animate-pulse-slow">
           <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-green-500 w-12 h-12" />
           </div>
           <h2 className="text-4xl font-sports text-gulf-blue mb-4">¡GOLAZO!</h2>
           <p className="text-gray-600 text-lg mb-6">
             Tu canje ha sido registrado exitosamente. Hemos enviado la orden al equipo de logística.
           </p>
           <div className="bg-gray-100 p-4 rounded-lg mb-6 text-sm text-left">
             <p className="font-bold text-gray-700">Se notificó a:</p>
             <ul className="list-disc list-inside text-gray-600">
               <li>agallego@gulfcolombia.com</li>
               <li>asismercadeo@gulfcolombia.com</li>
             </ul>
           </div>
           <button onClick={() => setView('store')} className="bg-gulf-orange text-white px-8 py-3 rounded-full font-bold hover:bg-orange-600 transition-colors">
             Volver a la Tienda
           </button>
        </div>
      </div>
    );
  }

  return <div>Loading...</div>;
};

export default App;