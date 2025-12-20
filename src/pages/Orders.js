import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (!token || !storedUser) {
            navigate('/login');
            return;
        }

        setUser(JSON.parse(storedUser));
        fetchOrders(token);
    }, [navigate]);

    const fetchOrders = async (token) => {
        try {
            const res = await fetch(`${API_URL}/api/orders`, {
                headers: { 'x-auth-token': token }
            });
            const data = await res.json();
            if (Array.isArray(data)) {
                setOrders(data);
            }
        } catch (err) {
            console.error("Failed to fetch orders", err);
        } finally {
            setLoading(false);
        }
    };

    const [notification, setNotification] = useState({ show: false, message: '' });

    const showNotification = (message) => {
        setNotification({ show: true, message });
        setTimeout(() => setNotification({ show: false, message: '' }), 3000);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    const handleTopUp = async () => {
        if (!user) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/auth/topup`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'x-auth-token': token 
                },
                body: JSON.stringify({ amount: 100 })
            });
            const data = await res.json();
            if (data.tokens) {
                const updatedUser = { ...user, tokens: data.tokens };
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
                showNotification("Added 100 Tokens to your account!");
            }
        } catch (err) {
            console.error("Top-up error", err);
        }
    };

    return (
        <div className="bg-premium-black min-h-screen text-white selection:bg-premium-gold selection:text-black font-sans">
            <Navbar 
                cartCount={0} 
                onCartClick={() => navigate('/')}
                user={user}
                onLogout={handleLogout}
                searchTerm=""
                onSearchChange={() => {}}
                onTopUp={handleTopUp}
            />

            <main className="container mx-auto px-6 pt-32 pb-20">
                <div className="mb-12">
                    <span className="text-premium-gold uppercase tracking-widest text-sm font-medium">Your Culinary Journey</span>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mt-3 mb-4">Order History</h1>
                    <div className="w-24 h-1 bg-premium-emerald rounded-full"></div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-premium-gold"></div>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-20 bg-premium-dark rounded-3xl border border-white/5">
                        <p className="text-gray-400 text-xl mb-8 font-serif italic text-pretty max-w-md mx-auto">
                            "You haven't embarked on your culinary adventure yet. Our chefs are waiting to create something extraordinary for you."
                        </p>
                        <button 
                            onClick={() => navigate('/')}
                            className="px-8 py-3 bg-premium-gold text-black font-bold rounded-xl hover:scale-105 transition-transform"
                        >
                            Explore Our Menu
                        </button>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-premium-dark border border-white/10 rounded-3xl overflow-hidden shadow-2xl hover:border-premium-gold/30 transition-all duration-300">
                                <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between gap-8">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-4 mb-6">
                                            <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
                                                order.status === 'Delivered' ? 'bg-premium-emerald/20 text-premium-emerald' : 'bg-premium-gold/20 text-premium-gold'
                                            }`}>
                                                {order.status}
                                            </span>
                                            <span className="text-gray-400 text-sm">
                                                {new Date(order.date).toLocaleDateString(undefined, { 
                                                    year: 'numeric', 
                                                    month: 'long', 
                                                    day: 'numeric' 
                                                })}
                                            </span>
                                        </div>

                                        <div className="space-y-4">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-4 group">
                                                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-white/10 group-hover:border-premium-gold/50 transition-colors">
                                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-bold text-white group-hover:text-premium-gold transition-colors">{item.title}</h3>
                                                        <p className="text-gray-400 text-sm">{item.quantity} x {item.price} Tokens</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex flex-col justify-between items-end border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-8 min-w-[200px]">
                                        <div className="text-right">
                                            <p className="text-gray-400 text-sm mb-1">Total Amount</p>
                                            <p className="text-3xl font-bold text-premium-gold">{order.totalTokens} Tokens</p>
                                        </div>
                                        <div className="text-right mt-6">
                                            <p className="text-xs text-gray-500 uppercase tracking-widest mb-2 font-bold">Delivery Details</p>
                                            <p className="text-sm text-gray-300 max-w-[200px]">{order.address}</p>
                                            <p className="text-sm text-gray-400 mt-1">{order.phone}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <Footer />

            {/* Notification Popup */}
            <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] transition-all duration-500 transform ${notification.show ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
                <div className="bg-premium-emerald text-black px-6 py-3 rounded-full font-bold shadow-lg shadow-premium-emerald/20 flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    {notification.message}
                </div>
            </div>
        </div>
    );
};

export default Orders;
