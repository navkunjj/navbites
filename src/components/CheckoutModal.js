import React, { useState } from 'react';

const CheckoutModal = ({ isOpen, onClose, onConfirm, totalTokens }) => {
    const [formData, setFormData] = useState({
        address: '',
        phone: '',
        instructions: ''
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm(formData);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div 
                className="absolute inset-0 bg-black/90 backdrop-blur-md"
                onClick={onClose}
            ></div>
            <div className="relative bg-premium-dark border border-white/10 rounded-3xl overflow-hidden max-w-lg w-full shadow-2xl animate-in fade-in zoom-in duration-300">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-serif font-bold text-white">Complete Order</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">✕</button>
                    </div>

                    <div className="mb-8 p-4 bg-premium-gold/10 border border-premium-gold/20 rounded-2xl flex justify-between items-center">
                        <span className="text-gray-300">Amount to Pay</span>
                        <span className="text-2xl font-bold text-premium-gold">{totalTokens} Coins</span>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Delivery Address</label>
                            <textarea 
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-premium-gold transition-colors outline-none h-24 resize-none"
                                placeholder="Enter your full delivery address..."
                                value={formData.address}
                                onChange={(e) => setFormData({...formData, address: e.target.value})}
                            ></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Phone Number</label>
                            <input 
                                type="tel"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-premium-gold transition-colors outline-none"
                                placeholder="e.g. +91 98765 43210"
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Order Instructions (Optional)</label>
                            <input 
                                type="text"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-premium-gold transition-colors outline-none"
                                placeholder="e.g. No spicy, extra cheese..."
                                value={formData.instructions}
                                onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                            />
                        </div>

                        <button 
                            type="submit"
                            className="w-full py-4 bg-premium-gold text-black font-bold uppercase tracking-wider rounded-xl hover:bg-yellow-500 transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-premium-gold/20"
                        >
                            Place Order with Coins
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CheckoutModal;
