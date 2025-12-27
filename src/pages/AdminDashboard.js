import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState(null);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [dishes, setDishes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (!token || !storedUser) {
            navigate('/admin/login');
            return;
        }

        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.role !== 'admin') {
            navigate('/admin/login');
            return;
        }

        setUser(parsedUser);
        fetchData(token);
    }, [navigate]);

    const fetchData = async (token) => {
        try {
            const headers = { 'x-auth-token': token };

            const [statsRes, ordersRes, usersRes, dishesRes] = await Promise.all([
                fetch(`${API_URL}/api/admin/stats`, { headers }),
                fetch(`${API_URL}/api/admin/orders`, { headers }),
                fetch(`${API_URL}/api/admin/users`, { headers }),
                fetch(`${API_URL}/api/admin/dishes`, { headers })
            ]);

            const [statsData, ordersData, usersData, dishesData] = await Promise.all([
                statsRes.json(),
                ordersRes.json(),
                usersRes.json(),
                dishesRes.json()
            ]);

            setStats(statsData);
            setOrders(ordersData);
            setUsers(usersData);
            setDishes(dishesData);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching data:', err);
            showNotification('Error loading data', 'error');
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/admin/login');
    };

    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
    };

    const updateOrderStatus = async (orderId, status) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/admin/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({ status })
            });

            if (res.ok) {
                const updatedOrder = await res.json();
                setOrders(orders.map(o => o._id === orderId ? updatedOrder : o));
                showNotification('Order status updated successfully');
            }
        } catch (err) {
            showNotification('Error updating order', 'error');
        }
    };

    const deleteOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to cancel this order? Tokens will be refunded.')) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/admin/orders/${orderId}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': token }
            });

            if (res.ok) {
                setOrders(orders.filter(o => o._id !== orderId));
                showNotification('Order cancelled and refunded');
                fetchData(token); // Refresh stats
            }
        } catch (err) {
            showNotification('Error cancelling order', 'error');
        }
    };

    const toggleUserStatus = async (userId, currentStatus) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/admin/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({ isActive: !currentStatus })
            });

            if (res.ok) {
                const updatedUser = await res.json();
                setUsers(users.map(u => u._id === userId ? updatedUser : u));
                showNotification(`User ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
            }
        } catch (err) {
            showNotification('Error updating user', 'error');
        }
    };

    const [dishForm, setDishForm] = useState({
        title: '', description: '', price: '', rating: '4.5', category: 'Appetizers', image: ''
    });
    const [editingDish, setEditingDish] = useState(null);
    const [showDishModal, setShowDishModal] = useState(false);

    const handleDishSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const url = editingDish
                ? `${API_URL}/api/admin/dishes/${editingDish._id}`
                : `${API_URL}/api/admin/dishes`;

            const res = await fetch(url, {
                method: editingDish ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify(dishForm)
            });

            if (res.ok) {
                const savedDish = await res.json();
                if (editingDish) {
                    setDishes(dishes.map(d => d._id === editingDish._id ? savedDish : d));
                    showNotification('Dish updated successfully');
                } else {
                    setDishes([savedDish, ...dishes]);
                    showNotification('Dish added successfully');
                }
                setShowDishModal(false);
                setEditingDish(null);
                setDishForm({ title: '', description: '', price: '', rating: '4.5', category: 'Appetizers', image: '' });
            }
        } catch (err) {
            showNotification('Error saving dish', 'error');
        }
    };

    const deleteDish = async (dishId) => {
        if (!window.confirm('Are you sure you want to delete this dish?')) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/admin/dishes/${dishId}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': token }
            });

            if (res.ok) {
                setDishes(dishes.filter(d => d._id !== dishId));
                showNotification('Dish deleted successfully');
            }
        } catch (err) {
            showNotification('Error deleting dish', 'error');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-premium-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-premium-gold"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-premium-black text-white">
            {/* Header */}
            <header className="bg-premium-dark border-b border-white/10 sticky top-0 z-40">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="text-2xl font-serif font-bold tracking-wider">
                            <span className="text-premium-gold">NAV</span>
                            <span className="text-white">BITES</span>
                        </div>
                        <span className="text-premium-gold text-xs font-medium tracking-widest">ADMIN</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-400 text-sm">Welcome, <span className="text-white font-bold">{user?.name}</span></span>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 border border-white/20 text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-300 rounded-full font-medium text-sm"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Navigation Tabs */}
            <div className="bg-premium-dark/50 border-b border-white/10">
                <div className="container mx-auto px-6">
                    <div className="flex space-x-1">
                        {['overview', 'orders', 'users', 'dishes'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-4 font-medium capitalize transition-all ${activeTab === tab
                                        ? 'text-premium-gold border-b-2 border-premium-gold'
                                        : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="container mx-auto px-6 py-8">
                {activeTab === 'overview' && stats && (
                    <div>
                        <h2 className="text-3xl font-bold mb-6">Dashboard Overview</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div className="bg-premium-dark border border-white/10 rounded-2xl p-6">
                                <div className="text-gray-400 text-sm mb-2">Total Orders</div>
                                <div className="text-3xl font-bold text-premium-gold">{stats.totalOrders}</div>
                            </div>
                            <div className="bg-premium-dark border border-white/10 rounded-2xl p-6">
                                <div className="text-gray-400 text-sm mb-2">Total Users</div>
                                <div className="text-3xl font-bold text-premium-emerald">{stats.totalUsers}</div>
                            </div>
                            <div className="bg-premium-dark border border-white/10 rounded-2xl p-6">
                                <div className="text-gray-400 text-sm mb-2">Total Dishes</div>
                                <div className="text-3xl font-bold text-white">{stats.totalDishes}</div>
                            </div>
                            <div className="bg-premium-dark border border-white/10 rounded-2xl p-6">
                                <div className="text-gray-400 text-sm mb-2">Total Revenue</div>
                                <div className="text-3xl font-bold text-premium-gold">{stats.totalRevenue} Tokens</div>
                            </div>
                        </div>

                        <h3 className="text-xl font-bold mb-4">Recent Orders</h3>
                        <div className="bg-premium-dark border border-white/10 rounded-2xl overflow-hidden">
                            {stats.recentOrders.map((order) => (
                                <div key={order._id} className="border-b border-white/10 last:border-0 p-4 hover:bg-white/5 transition-colors">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <div className="font-bold">{order.user?.name}</div>
                                            <div className="text-sm text-gray-400">{order.items.length} items • {order.totalTokens} Tokens</div>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'Delivered' ? 'bg-premium-emerald/20 text-premium-emerald' : 'bg-premium-gold/20 text-premium-gold'
                                            }`}>
                                            {order.status}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div>
                        <h2 className="text-3xl font-bold mb-6">Order Management</h2>
                        <div className="bg-premium-dark border border-white/10 rounded-2xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-white/5">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-bold">Order ID</th>
                                            <th className="px-6 py-4 text-left text-sm font-bold">Customer</th>
                                            <th className="px-6 py-4 text-left text-sm font-bold">Delivery Info</th>
                                            <th className="px-6 py-4 text-left text-sm font-bold">Items</th>
                                            <th className="px-6 py-4 text-left text-sm font-bold">Total</th>
                                            <th className="px-6 py-4 text-left text-sm font-bold">Status</th>
                                            <th className="px-6 py-4 text-left text-sm font-bold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((order) => (
                                            <tr key={order._id} className="border-t border-white/10 hover:bg-white/5">
                                                <td className="px-6 py-4 text-sm font-mono">{order._id.slice(-6)}</td>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium">{order.user?.name}</div>
                                                    <div className="text-xs text-gray-400">{order.user?.email}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm">{order.address}</div>
                                                    <div className="text-xs text-gray-400">{order.phone}</div>
                                                </td>
                                                <td className="px-6 py-4 text-sm">{order.items.length} items</td>
                                                <td className="px-6 py-4 text-sm font-bold text-premium-gold">{order.totalTokens} Tokens</td>
                                                <td className="px-6 py-4">
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                                        className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm text-white"
                                                    >
                                                        <option value="Processing" className="bg-gray-800">Processing</option>
                                                        <option value="Preparing" className="bg-gray-800">Preparing</option>
                                                        <option value="Out for Delivery" className="bg-gray-800">Out for Delivery</option>
                                                        <option value="Delivered" className="bg-gray-800">Delivered</option>
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => deleteOrder(order._id)}
                                                        className="text-red-400 hover:text-red-300 text-sm font-medium"
                                                    >
                                                        Cancel
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div>
                        <h2 className="text-3xl font-bold mb-6">User Management</h2>
                        <div className="bg-premium-dark border border-white/10 rounded-2xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-white/5">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-bold">Name</th>
                                            <th className="px-6 py-4 text-left text-sm font-bold">Email</th>
                                            <th className="px-6 py-4 text-left text-sm font-bold">Tokens</th>
                                            <th className="px-6 py-4 text-left text-sm font-bold">Status</th>
                                            <th className="px-6 py-4 text-left text-sm font-bold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user) => (
                                            <tr key={user._id} className="border-t border-white/10 hover:bg-white/5">
                                                <td className="px-6 py-4 font-medium">{user.name}</td>
                                                <td className="px-6 py-4 text-sm text-gray-400">{user.email}</td>
                                                <td className="px-6 py-4 text-sm font-bold text-premium-gold">{user.tokens}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.isActive ? 'bg-premium-emerald/20 text-premium-emerald' : 'bg-red-500/20 text-red-400'
                                                        }`}>
                                                        {user.isActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => toggleUserStatus(user._id, user.isActive)}
                                                        className="text-premium-gold hover:text-yellow-500 text-sm font-medium"
                                                    >
                                                        {user.isActive ? 'Deactivate' : 'Activate'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'dishes' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold">Food Items Management</h2>
                            <button
                                onClick={() => {
                                    setEditingDish(null);
                                    setDishForm({ title: '', description: '', price: '', rating: '4.5', category: 'Appetizers', image: '' });
                                    setShowDishModal(true);
                                }}
                                className="px-6 py-3 bg-premium-gold text-black font-bold rounded-xl hover:bg-yellow-500 transition-all"
                            >
                                + Add New Dish
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {dishes.map((dish) => (
                                <div key={dish._id} className="bg-premium-dark border border-white/10 rounded-2xl overflow-hidden hover:border-premium-gold/30 transition-all">
                                    <img src={dish.image} alt={dish.title} className="w-full h-48 object-cover" />
                                    <div className="p-4">
                                        <h3 className="font-bold text-lg mb-2">{dish.title}</h3>
                                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{dish.description}</p>
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-premium-gold font-bold">{dish.price} Tokens</span>
                                            <span className="text-sm text-gray-400">{dish.category}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setEditingDish(dish);
                                                    setDishForm({
                                                        title: dish.title,
                                                        description: dish.description,
                                                        price: dish.price,
                                                        rating: dish.rating,
                                                        category: dish.category,
                                                        image: dish.image
                                                    });
                                                    setShowDishModal(true);
                                                }}
                                                className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors text-sm"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => deleteDish(dish._id)}
                                                className="flex-1 px-4 py-2 bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors text-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            {/* Dish Modal */}
            {showDishModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                    <div className="bg-premium-dark border border-white/10 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <h3 className="text-2xl font-bold mb-6">{editingDish ? 'Edit Dish' : 'Add New Dish'}</h3>
                        <form onSubmit={handleDishSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Title</label>
                                <input
                                    type="text"
                                    value={dishForm.title}
                                    onChange={(e) => setDishForm({ ...dishForm, title: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-premium-gold/50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Description</label>
                                <textarea
                                    value={dishForm.description}
                                    onChange={(e) => setDishForm({ ...dishForm, description: e.target.value })}
                                    required
                                    rows="3"
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-premium-gold/50"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Price (Tokens)</label>
                                    <input
                                        type="number"
                                        value={dishForm.price}
                                        onChange={(e) => setDishForm({ ...dishForm, price: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-premium-gold/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Rating</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="5"
                                        value={dishForm.rating}
                                        onChange={(e) => setDishForm({ ...dishForm, rating: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-premium-gold/50"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Category</label>
                                <select
                                    value={dishForm.category}
                                    onChange={(e) => setDishForm({ ...dishForm, category: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-premium-gold/50"
                                >
                                    <option value="Appetizers">Appetizers</option>
                                    <option value="Curries">Curries</option>
                                    <option value="Rice & Biryani">Rice & Biryani</option>
                                    <option value="Street Food">Street Food</option>
                                    <option value="Tandoor">Tandoor</option>
                                    <option value="South Indian">South Indian</option>
                                    <option value="Fusion">Fusion</option>
                                    <option value="Desserts">Desserts</option>
                                    <option value="Beverages">Beverages</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Image URL</label>
                                <input
                                    type="url"
                                    value={dishForm.image}
                                    onChange={(e) => setDishForm({ ...dishForm, image: e.target.value })}
                                    required
                                    placeholder="https://images.unsplash.com/..."
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-premium-gold/50"
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-premium-gold text-black font-bold rounded-xl hover:bg-yellow-500 transition-all"
                                >
                                    {editingDish ? 'Update Dish' : 'Add Dish'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowDishModal(false)}
                                    className="flex-1 px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Notification */}
            <div className={`fixed bottom-8 right-8 z-60 transition-all duration-500 transform ${notification.show ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
                <div className={`px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-3 ${notification.type === 'success' ? 'bg-premium-emerald text-black' : 'bg-red-500 text-white'
                    }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    {notification.message}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
