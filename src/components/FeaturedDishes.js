import React, { useState, useEffect } from 'react';
import DishCard from './DishCard';
import { API_URL } from '../config';

const dishes = [
    {
        id: 1,
        title: "Truffle Wagyu Steak",
        description: "A5 Japanese Wagyu served with black truffle reduction and seasonal roasted vegetables.",
        price: "128",
        rating: "4.9",
        category: "Steakhouse",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 2,
        title: "Lobster Thermidor",
        description: "Fresh Atlantic lobster baked with creamy cognac sauce and gruyère cheese crust.",
        price: "95",
        rating: "4.8",
        category: "Seafood",
        image: "https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 3,
        title: "Gold Leaf Risotto",
        description: "Saffron risotto topped with 24k edible gold leaf and parmigiano reggiano.",
        price: "75",
        rating: "4.7",
        category: "Italian",
        image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 4,
        title: "Oysters Rockefeller",
        description: "Freshly shucked oysters baked with spinach, herbs, and a buttery breadcrumb topping.",
        price: "68",
        rating: "4.9",
        category: "Seafood",
        image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 5,
        title: "Pan-Seared Scallops",
        description: "Jumbo sea scallops seared to perfection served with cauliflower purée and caviar.",
        price: "85",
        rating: "4.8",
        category: "Seafood",
        image: "https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 6,
        title: "Midnight Chocolate Cake",
        description: "Decadent dark chocolate fondant with a molten core and vanilla bean gelato.",
        price: "45",
        rating: "5.0",
        category: "Desserts",
        image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 7,
        title: "Premium Sushi Set",
        description: "Chef's selection of premium nigiri and sashimi flown in daily from Tsukiji Market.",
        price: "88",
        rating: "4.9",
        category: "Asian Fusion",
        image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 8,
        title: "Herb-Crusted Lamb",
        description: "New Zealand lamb rack with mint pesto, fondant potatoes, and red wine jus.",
        price: "92",
        rating: "4.8",
        category: "Fine Dining",
        image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 9,
        title: "Berry Pavlova",
        description: "Crisp meringue topped with whipped chantilly cream and fresh summer berries.",
        price: "35",
        rating: "4.7",
        category: "Desserts",
        image: "https://images.unsplash.com/photo-1470324161839-ce2bb6fa6bc3?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 10,
        title: "Wild Mushroom Risotto",
        description: "Creamy arborio rice with foraged mushrooms, truffle oil, and vegan parmesan.",
        price: "65",
        rating: "4.6",
        category: "Vegan",
        image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 11,
        title: "Tofu Pad Thai",
        description: "Rice noodles stir-fried with pressed tofu, bean sprouts, peanuts, and tamarind sauce.",
        price: "42",
        rating: "4.5",
        category: "Vegan",
        image: "https://images.unsplash.com/photo-1559311648-d46f4d8593d8?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 12,
        title: "Tom Yum Soup",
        description: "Spicy and sour Thai soup with lemongrass, galangal, kaffir lime leaves, and jumbo shrimp.",
        price: "38",
        rating: "4.8",
        category: "Asian Fusion",
        image: "https://images.unsplash.com/photo-1548943487-a2e4b43b4853?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 13,
        title: "Margherita Pizza",
        description: "San Marzano tomatoes, fresh buffalo mozzarella, basil, and extra virgin olive oil.",
        price: "55",
        rating: "4.7",
        category: "Italian",
        image: "https://images.unsplash.com/photo-1574129624542-467f9aa93374?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 14,
        title: "Ribeye Steak",
        description: "Dry-aged prime ribeye chargrilled to your liking, served with garlic herb butter.",
        price: "115",
        rating: "4.9",
        category: "Steakhouse",
        image: "https://images.unsplash.com/photo-1606416133972-4e78205e3394?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 15,
        title: "Caviar Platter",
        description: "Beluga caviar served with traditional accompaniments: blinis, crème fraîche, and chopped egg.",
        price: "250",
        rating: "5.0",
        category: "Fine Dining",
        image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80"
    }
];

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
