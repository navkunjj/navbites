import React from 'react';

const CartSidebar = ({ isOpen, onClose, cartItems, onRemove, onCheckout }) => {
    const total = cartItems.reduce((sum, item) => sum + (parseFloat(item.price) * (item.quantity || 1)), 0);
    const currency = "Tokens";

    return (
        <>
            {/* Backdrop */}
            <div 
                className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-premium-dark border-l border-white/10 z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'} shadow-2xl`}>
                <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/20">
                        <h2 className="text-2xl font-serif font-bold text-white">Your Order</h2>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
                            ✕
                        </button>
                    </div>

                    {/* Items */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {cartItems.length === 0 ? (
                            <div className="text-center text-gray-500 mt-20">
                                <p className="text-lg">Your cart is empty</p>
                                <p className="text-sm mt-2">Add some delicious dishes!</p>
                            </div>
                        ) : (
                            cartItems.map((item, index) => (
                                <div key={index} className="flex gap-4 p-4 glass rounded-xl border-white/5">
                                    <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded-lg" />
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-white line-clamp-1">{item.title}</h3>
                                            <span className="text-premium-emerald font-bold">{item.price} {currency}</span>
                                        </div>
                                        <div className="flex justify-between items-center mt-1">
                                           <p className="text-xs text-gray-400 line-clamp-1">{item.description}</p>
                                           <span className="text-xs bg-white/10 px-2 py-0.5 rounded text-gray-300">
                                              Qty: {item.quantity || 1}
                                           </span>
                                        </div>
                                        <button 
                                            onClick={() => onRemove(index)}
                                            className="text-xs text-red-400 hover:text-red-300 mt-2 underline"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-white/10 bg-black/40">
                        <div className="flex justify-between items-center mb-6 text-xl font-bold">
                            <span>Total</span>
                            <span className="text-premium-gold">{total.toFixed(0)} {currency}</span>
                        </div>
                        <button 
                            onClick={onCheckout}
                            disabled={cartItems.length === 0}
                            className="w-full py-4 bg-premium-gold text-black font-bold uppercase tracking-wider rounded-lg hover:bg-yellow-500 transition-colors shadow-lg shadow-premium-gold/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Confirm Order
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CartSidebar;
