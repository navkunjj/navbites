import React from 'react';

const DishCard = ({ title, description, price, rating, image, onOrder, onClick }) => {
  return (
    <div 
        onClick={onClick}
        className="glass rounded-2xl p-4 hover:bg-white/5 transition-all duration-300 group cursor-pointer border border-white/5 hover:border-premium-gold/30 flex flex-col h-full"
    >
        {/* Image Container */}
        <div className="h-48 rounded-xl bg-gray-800 mb-4 overflow-hidden relative shrink-0">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 transition-opacity group-hover:opacity-60"></div>
            <img 
              src={image} 
              alt={title} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            
            <div className="absolute top-3 left-3 z-20 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-1">
                <span className="text-yellow-400 text-xs">★</span>
                <span className="text-xs font-bold">{rating}</span>
            </div>
        </div>

        <div className="flex flex-col flex-1 space-y-2">
            <div className="flex justify-between items-start gap-2">
                <h3 className="text-lg md:text-xl font-serif font-bold text-white group-hover:text-premium-gold transition-colors line-clamp-1">{title}</h3>
                <span className="text-premium-emerald font-bold whitespace-nowrap">{price} Coins</span>
            </div>
            <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 ease-in-out overflow-hidden">
                <p className="text-sm text-gray-400 min-h-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    {description}
                </p>
            </div>
            
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    onOrder();
                }}
                className="w-full mt-4 py-3 md:py-2 border border-white/10 rounded-lg text-sm text-gray-300 hover:bg-premium-gold hover:text-black hover:border-premium-gold transition-all font-medium"
            >
                Add to Order
            </button>
        </div>
    </div>
  );
};

export default DishCard;
