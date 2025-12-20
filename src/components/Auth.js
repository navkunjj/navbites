import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const { name, email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.type]: e.target.value });

    // Handle Input Change specifically for name since type="text" could be ambiguous if we add more fields
    const onNameChange = e => setFormData({ ...formData, name: e.target.value });
    const onEmailChange = e => setFormData({ ...formData, email: e.target.value });
    const onPasswordChange = e => setFormData({ ...formData, password: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setError('');

        const url = isLogin 
            ? `${API_URL}/api/auth/login`
            : `${API_URL}/api/auth/register`;
        
        const body = isLogin 
            ? { email, password }
            : { name, email, password };

        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.msg || 'Authentication failed');
            }

            // Success - only allow regular users
            if (data.user.role === 'admin') {
                setError('Admin users must use the Admin Login page');
                return;
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            navigate('/');
            
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex bg-premium-black text-white">
            {/* Left Side - Image (Hidden on mobile) */}
            <div className="hidden lg:block w-1/2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10"></div>
                <img 
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80" 
                    alt="Premium Dining" 
                    className="w-full h-full object-cover animate-pan-slow"
                />
                <div className="absolute bottom-20 left-12 z-20">
                    <h2 className="text-5xl font-serif font-bold text-white mb-4">Experience <br/> <span className="text-premium-gold">Excellence</span></h2>
                    <p className="text-gray-300 text-lg max-w-md">Join our exclusive community of food connoisseurs and enjoy priority reservations.</p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-premium-black relative">
                {/* Close Button */}
                <button onClick={() => navigate('/')} className="absolute top-8 right-8 text-gray-400 hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <div className="text-3xl font-serif font-bold tracking-wider mb-2">
                            <span className="text-premium-gold">NAV</span>
                            <span className="text-white">BITES</span>
                        </div>
                        <h2 className="text-4xl font-bold mt-6">{isLogin ? 'Welcome Back.' : 'Create Account.'}</h2>
                        <p className="text-gray-400 mt-2">
                            {isLogin ? 'Please sign in to continue your journey.' : 'Begin your culinary adventure today.'}
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form className="mt-8 space-y-6" onSubmit={onSubmit}>
                        <div className="space-y-4">
                            {!isLogin && (
                                <div>
                                    <label className="text-sm font-medium text-gray-400 ml-1">Full Name</label>
                                    <input 
                                        type="text" 
                                        value={name}
                                        onChange={onNameChange}
                                        placeholder="John Doe"
                                        className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-premium-gold focus:ring-1 focus:ring-premium-gold transition-all"
                                        required={!isLogin}
                                    />
                                </div>
                            )}
                            <div>
                                <label className="text-sm font-medium text-gray-400 ml-1">Email Address</label>
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={onEmailChange}
                                    placeholder="you@example.com"
                                    className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-premium-gold focus:ring-1 focus:ring-premium-gold transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-400 ml-1">Password</label>
                                <input 
                                    type="password" 
                                    value={password}
                                    onChange={onPasswordChange}
                                    placeholder="••••••••"
                                    className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-premium-gold focus:ring-1 focus:ring-premium-gold transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {isLogin && (
                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center text-gray-400 cursor-pointer">
                                    <input type="checkbox" className="mr-2 accent-premium-gold w-4 h-4" />
                                    Remember me
                                </label>
                                <a href="#" className="text-premium-gold hover:underline">Forgot password?</a>
                            </div>
                        )}

                        <button className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-4 rounded-xl hover:scale-[1.02] transition-transform duration-300 shadow-lg shadow-yellow-500/20">
                            {isLogin ? 'Sign In' : 'Create Account'}
                        </button>
                    </form>

                    <div className="text-center mt-6">
                        <p className="text-gray-400">
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <button 
                                type="button"
                                onClick={() => {
                                    setIsLogin(!isLogin);
                                    setError('');
                                    setFormData({ name: '', email: '', password: '' });
                                }}
                                className="text-premium-gold font-bold hover:underline transition-all"
                            >
                                {isLogin ? 'Sign Up' : 'Log In'}
                            </button>
                        </p>
                    </div>

                    {/* Admin Login Button */}
                    <div className="mt-6">
                        <button
                            onClick={() => navigate('/admin/login')}
                            className="w-full px-6 py-3 bg-premium-dark border-2 border-premium-gold/30 text-premium-gold font-bold rounded-xl hover:bg-premium-gold/10 hover:border-premium-gold transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                            </svg>
                            Admin Login
                        </button>
                    </div>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-premium-black text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button type="button" className="flex items-center justify-center bg-white/5 border border-white/10 py-3 rounded-lg hover:bg-white/10 transition-colors gap-2">
                             {/* Google Icon SVG */}
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/></svg>
                            <span className="text-sm font-medium text-gray-300">Google</span>
                        </button>
                        <button type="button" className="flex items-center justify-center bg-white/5 border border-white/10 py-3 rounded-lg hover:bg-white/10 transition-colors gap-2">
                            {/* Apple Icon SVG */}
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.45-1.02 3.93-.83 1.29.17 2.31.7 2.92 1.6-2.58 1.6-2.21 4.8 0 6.09-.64 1.76-1.57 3.5-2.93 5.37zm-2.08-16.7c.3 2.18-1.74 4.31-3.6 4.12-.22-1.92 1.69-3.99 3.6-4.12z"/></svg>
                            <span className="text-sm font-medium text-gray-300">Apple</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;
