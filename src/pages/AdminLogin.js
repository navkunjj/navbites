import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

const AdminLogin = () => {
    const [formData, setFormData] = useState({ email: '', password: '', secretCode: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Verify secret code first
        const SECRET_CODE = 'ADMIN2024';
        if (formData.secretCode !== SECRET_CODE) {
            setError('Invalid admin security code');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, password: formData.password })
            });

            const data = await res.json();

            console.log('Login response:', data); // Debug log
            console.log('User role:', data.user?.role); // Debug log

            if (res.ok) {
                // Check if user is admin
                if (data.user.role !== 'admin') {
                    setError('Access denied. Admin privileges required.');
                    setLoading(false);
                    return;
                }

                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/admin/dashboard');
            } else {
                setError(data.msg || 'Login failed');
                setLoading(false);
            }
        } catch (err) {
            console.error('Login error:', err); // Debug log
            setError('Server error. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-premium-black via-premium-dark to-premium-black flex items-center justify-center px-6">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-[20%] left-[10%] w-96 h-96 bg-premium-gold/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-premium-emerald/5 rounded-full blur-[120px]"></div>
            </div>

            <div className="relative z-10 w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-block mb-4">
                        <div className="text-4xl font-serif font-bold tracking-wider">
                            <span className="text-premium-gold">NAV</span>
                            <span className="text-white">BITES</span>
                        </div>
                        <div className="text-premium-gold text-sm font-medium tracking-widest mt-2">ADMIN PORTAL</div>
                    </div>
                </div>

                <div className="glass border border-white/10 rounded-3xl p-8 shadow-2xl">
                    <h2 className="text-2xl font-bold text-white mb-2">Administrator Login</h2>
                    <p className="text-gray-400 text-sm mb-6">Access the admin dashboard</p>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-premium-gold/50 transition-colors"
                                placeholder="admin@navbites.com"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-premium-gold/50 transition-colors"
                                placeholder="••••••••"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">Admin Secret Code</label>
                            <input
                                type="password"
                                name="secretCode"
                                value={formData.secretCode}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-premium-gold/50 transition-colors text-center tracking-widest"
                                placeholder="Enter secret code"
                            />
                            <p className="text-xs text-gray-500 mt-2 text-center">🔒 Additional security layer for admin access</p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-6 py-3 bg-premium-gold text-black font-bold rounded-xl hover:bg-yellow-500 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => navigate('/')}
                            className="text-gray-400 hover:text-premium-gold transition-colors text-sm"
                        >
                            ← Back to Main Site
                        </button>
                    </div>
                </div>

                <div className="mt-6 text-center text-gray-500 text-xs">
                    <p>Authorized personnel only</p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
