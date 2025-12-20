import React from 'react';

const DishDetailModal = ({ dish, isOpen, onClose, onAddToCart }) => {
    if (!isOpen || !dish) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
                className="absolute inset-0 bg-black/90 backdrop-blur-md"
                onClick={onClose}
            ></div>
            <div className="relative bg-premium-dark border border-white/10 rounded-3xl overflow-hidden max-w-4xl w-full shadow-2xl animate-in fade-in zoom-in duration-300">
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 z-10 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition-colors"
                >
                    ✕
                </button>
                <div className="flex flex-col md:flex-row h-full max-h-[90vh] overflow-y-auto">
                    <div className="w-full md:w-1/2 h-80 md:h-[600px] overflow-hidden">
                        <img 
                            src={dish.image} 
                            alt={dish.title} 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col">
                        <div className="flex items-center gap-3 mb-4 text-premium-gold">
                            <span className="text-lg font-medium">★</span>
                            <span className="text-lg font-bold">{dish.rating}</span>
                            <span className="text-gray-500 mx-2">|</span>
                            <span className="text-sm uppercase tracking-widest font-bold">{dish.category}</span>
                        </div>
                        
                        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-white">{dish.title}</h2>
                        
                        <div className="space-y-6 mb-10 overflow-y-auto">
                            <div>
                                <h4 className="text-premium-gold uppercase tracking-widest text-xs font-bold mb-2">Description</h4>
                                <p className="text-gray-300 text-lg leading-relaxed">{dish.description}</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <h4 className="text-gray-500 uppercase tracking-widest text-[10px] font-bold mb-1">Preparation</h4>
                                    <p className="text-sm text-gray-200">20-25 Minutes</p>
                                </div>
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <h4 className="text-gray-500 uppercase tracking-widest text-[10px] font-bold mb-1">Calories</h4>
                                    <p className="text-sm text-gray-200">450 kcal</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-premium-gold uppercase tracking-widest text-xs font-bold mb-2">Chef's Notes</h4>
                                <p className="text-gray-400 text-sm italic">"Each ingredient is hand-picked daily to ensure the peak of freshness and flavor. Our wagyu is sourced from heritage farms in the Kagoshima prefecture."</p>
                            </div>
                        </div>

                        <div className="mt-auto pt-8 border-t border-white/10 flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-xs uppercase tracking-widest mb-1 font-bold">Price per serving</p>
                                <span className="text-3xl font-bold text-premium-emerald">{dish.price} Tokens</span>
                            </div>
                            <button 
                                onClick={() => {
                                    onAddToCart(dish);
                                    onClose();
                                }}
                                className="px-10 py-4 bg-premium-gold text-black font-bold rounded-xl hover:bg-yellow-500 hover:scale-105 transition-all shadow-lg shadow-premium-gold/20 tracking-wide uppercase text-sm"
                            >
                                Add to Order
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DishDetailModal;
