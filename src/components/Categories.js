import React from 'react';

const categories = [
    { id: 1, name: "All", active: true },
    { id: 2, name: "Fine Dining" },
    { id: 3, name: "Steakhouse" },
    { id: 4, name: "Seafood" },
    { id: 5, name: "Desserts" },
    { id: 6, name: "Vegan" },
    { id: 7, name: "Asian Fusion" },
    { id: 8, name: "Italian" }
];

const Categories = ({ activeCategory, onCategoryChange }) => {
    return (
        <section id="categories" className="py-10 border-b border-white/10 bg-premium-black/50 sticky top-20 z-40 backdrop-blur-md">
            <div className="container mx-auto px-6 overflow-x-auto no-scrollbar">
                <div className="flex space-x-4 min-w-max">
                    {categories.map((cat) => (
                        <button 
                            key={cat.id}
                            onClick={() => onCategoryChange(cat.name)}
                            className={`px-6 py-2 rounded-full border transition-all duration-300 font-medium whitespace-nowrap
                                ${activeCategory === cat.name 
                                    ? 'bg-premium-gold border-premium-gold text-black' 
                                    : 'border-white/10 text-gray-400 hover:border-premium-gold hover:text-white'
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Categories;
