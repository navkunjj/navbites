import React, { useState, useEffect } from 'react';
import DishCard from './DishCard';
import { API_URL } from '../config';



const FeaturedDishes = ({ onAddToCart, onDishClick, selectedCategory, searchTerm }) => {
    const [visibleCount, setVisibleCount] = useState(6);
    const [dishes, setDishes] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch dishes from database
    useEffect(() => {
        const fetchDishes = async () => {
            try {
                const res = await fetch(`${API_URL}/api/dishes`);
                const data = await res.json();
                setDishes(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching dishes:', err);
                setLoading(false);
            }
        };
        fetchDishes();
    }, []);

    // Reset visible count when category or search changes
    useEffect(() => {
        setVisibleCount(6);
    }, [selectedCategory, searchTerm]);

    const filteredDishes = dishes.filter(dish => {
        const matchesCategory = selectedCategory === "All" || dish.category === selectedCategory;
        const matchesSearch = dish.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dish.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dish.category.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleSeeMore = () => {
        setVisibleCount(prev => prev + 3);
    };

    const handleSeeLess = () => {
        setVisibleCount(6);
    };

    return (
        <section className="py-20 bg-premium-dark">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="text-premium-gold uppercase tracking-widest text-sm font-medium">Chef's Selection</span>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold mt-3 mb-4">
                        {selectedCategory === "All" ? "Curated Masterpieces" : `${selectedCategory} Collection`}
                    </h2>
                    <div className="w-24 h-1 bg-premium-emerald mx-auto rounded-full"></div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-premium-gold"></div>
                    </div>
                ) : (
                    <>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 min-h-[400px]">
                            {filteredDishes.length > 0 ? (
                                filteredDishes.slice(0, visibleCount).map((dish) => (
                                    <DishCard
                                        key={dish.id}
                                        {...dish}
                                        onOrder={() => onAddToCart(dish)}
                                        onClick={() => onDishClick(dish)}
                                    />
                                ))
                            ) : (
                                <div className="col-span-full text-center py-20">
                                    <p className="text-gray-400 text-lg italic">No dishes found in this category yet. Coming soon!</p>
                                </div>
                            )}
                        </div>

                        {filteredDishes.length > visibleCount && (
                            <div className="text-center">
                                <button
                                    onClick={handleSeeMore}
                                    className="px-8 py-3 glass text-premium-gold border border-premium-gold/30 rounded-full hover:bg-premium-gold hover:text-black hover:scale-105 transition-all duration-300 font-medium tracking-wide"
                                >
                                    See More Dishes
                                </button>
                            </div>
                        )}

                        {visibleCount > 6 && filteredDishes.length <= visibleCount && (
                            <div className="text-center">
                                <button
                                    onClick={handleSeeLess}
                                    className="px-8 py-3 glass text-white border border-white/30 rounded-full hover:bg-white hover:text-black hover:scale-105 transition-all duration-300 font-medium tracking-wide"
                                >
                                    See Less
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
};

export default FeaturedDishes;
