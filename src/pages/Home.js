import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import emailjs from '@emailjs/browser';
import { API_URL } from '../config';
import Hero from '../components/Hero';
import FeaturedDishes from '../components/FeaturedDishes';
import Footer from '../components/Footer';
import Categories from '../components/Categories';
import CartSidebar from '../components/CartSidebar';
import CheckoutModal from '../components/CheckoutModal';
import DishDetailModal from '../components/DishDetailModal';

const Home = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedDish, setSelectedDish] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState({ show: false, message: '' });

  const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
            headers: { 'x-auth-token': token }
        });
        if (res.status === 401) {
            handleLogout();
            return;
        }
        const data = await res.json();
        if (data.tokens !== undefined) {
            setUser(data);
            localStorage.setItem('user', JSON.stringify(data));
        }
    } catch (err) {
        console.error("Failed to fetch user data", err);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      fetchUserData();
    }

    // Handle hash navigation (e.g., /#categories)
    if (window.location.hash === '#categories') {
      setTimeout(() => {
        const categoriesSection = document.getElementById('categories');
        if (categoriesSection) {
          categoriesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, []);

  // Fetch cart when user logs in
  useEffect(() => {
    if (user) {
      const fetchCart = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await fetch(`${API_URL}/api/cart`, {
             headers: { 'x-auth-token': token }
          });
          const data = await res.json();
          if (Array.isArray(data)) {
             setCartItems(data);
          }
        } catch (err) {
          console.error("Failed to fetch cart", err);
        }
      };
      fetchCart();
    } else {
      setCartItems([]); // Clear cart or load local guest cart if we implemented that
    }
  }, [user?.id]); // Use user.id to avoid unnecessary re-fetches if only tokens change

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCartItems([]);
  };

  const showNotification = (message) => {
    setNotification({ show: true, message });
    setTimeout(() => setNotification({ show: false, message: '' }), 3000);
  };

  const addToCart = async (dish) => {
    if (user) {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/api/cart`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'x-auth-token': token 
            },
            body: JSON.stringify(dish)
        });
        if (res.status === 401) {
            handleLogout();
            showNotification("Session expired. Please login again.");
            return;
        }
        if (res.ok) {
            const updatedCart = await res.json();
            setCartItems(updatedCart);
            showNotification(`${dish.title} added to cart!`);
        } else {
             console.error("Failed to add to cart");
        }
      } catch (err) {
          console.error("Error adding to cart", err);
      }
    } else {
        // Guest Cart
        const existingItemIndex = cartItems.findIndex(item => item.title === dish.title);
        
        if (existingItemIndex > -1) {
            const updatedCart = [...cartItems];
            updatedCart[existingItemIndex].quantity = (updatedCart[existingItemIndex].quantity || 1) + 1;
            setCartItems(updatedCart);
        } else {
            setCartItems([...cartItems, { ...dish, quantity: 1 }]);
        }
        showNotification(`${dish.title} added to cart!`);
    }
  };

  const removeFromCart = async (index) => {
    if (user) {
        const itemToRemove = cartItems[index];
        if (!itemToRemove._id) return; 

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/cart/${itemToRemove._id}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': token }
            });
            if (res.status === 401) {
                handleLogout();
                return;
            }
            if (res.ok) {
                 const updatedCart = await res.json();
                 setCartItems(updatedCart);
            }
        } catch (err) {
            console.error("Error removing from cart", err);
        }
    } else {
        const newCart = [...cartItems];
        newCart.splice(index, 1);
        setCartItems(newCart);
    }
  };

  const handleCheckout = () => {
    if (!user) {
        showNotification("Please login to place an order");
        return;
    }
    const total = cartItems.reduce((sum, item) => sum + (parseFloat(item.price) * (item.quantity || 1)), 0);
    if (user.tokens < total) {
        showNotification(`Insufficient tokens! You need ${total - user.tokens} more.`);
        return;
    }
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleConfirmOrder = async (orderData) => {
    try {
        const token = localStorage.getItem('token');
        const total = cartItems.reduce((sum, item) => sum + (parseFloat(item.price) * (item.quantity || 1)), 0);
        
        const res = await fetch(`${API_URL}/api/orders`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'x-auth-token': token 
            },
            body: JSON.stringify({
                items: cartItems,
                totalTokens: total,
                address: orderData.address,
                phone: orderData.phone
            })
        });

        if (res.ok) {
            const result = await res.json();
            setCartItems([]);
            setIsCheckoutOpen(false);
            showNotification("Order placed successfully!");
            // Update local tokens
            fetchUserData();

            // Send Email Notification
            const templateParams = {
                to_name: 'Admin',
                from_name: user.name,
                order_id: result.order._id,
                total_tokens: total,
                items: cartItems.map(item => `${item.quantity || 1}x ${item.title}`).join(', '),
                address: orderData.address,
                phone: orderData.phone,
                message: orderData.instructions || 'No instructions'
            };

            emailjs.send('service_q287z0s', 'template_r2meh0c', templateParams, 'IkL-4N0hhJ51_YaQQ')
                .then((response) => {
                   console.log('SUCCESS!', response.status, response.text);
                   showNotification("Order placed and email sent!");
                }, (err) => {
                   console.log('FAILED...', err);
                   showNotification("Order placed, but email failed.");
                });
        } else {
            const err = await res.json();
            showNotification(err.msg || "Order failed");
        }
    } catch (err) {
        console.error("Checkout error", err);
        showNotification("An error occurred during checkout");
    }
  };

  const handleTopUp = async () => {
    if (!user) return;
    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/api/auth/topup`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'x-auth-token': token 
            },
            body: JSON.stringify({ amount: 100 })
        });
        const data = await res.json();
        if (data.tokens) {
            const updatedUser = { ...user, tokens: data.tokens };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            showNotification("Added 100 Tokens to your account!");
        }
    } catch (err) {
        console.error("Top-up error", err);
    }
  };

  return (
    <div className="bg-premium-black min-h-screen text-white selection:bg-premium-gold selection:text-black font-sans relative overflow-hidden">
      {/* Background Depth Effects */}
      <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-premium-gold/10 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-[10000ms]"></div>
          <div className="absolute top-[20%] right-[-5%] w-[35rem] h-[35rem] bg-premium-emerald/10 rounded-full blur-[100px] mix-blend-screen"></div>
          <div className="absolute bottom-[-10%] left-[20%] w-[45rem] h-[45rem] bg-purple-900/10 rounded-full blur-[130px] mix-blend-screen"></div>
          
          {/* Dish Depth Layer */}
          <div className="absolute top-[10%] right-[10%] w-[50rem] h-[50rem] opacity-20 pointer-events-none">
             <img 
                src="/images/hero_dish.png" 
                alt="" 
                className="w-full h-full object-contain blur-[100px] scale-150 animate-pulse-slow mix-blend-overlay"
             />
          </div>
      </div>

      <div className="relative z-10">
      <Navbar 
        cartCount={cartItems.length} 
        onCartClick={() => setIsCartOpen(true)}
        user={user}
        onLogout={handleLogout}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onTopUp={handleTopUp}
      />
      
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cartItems} 
        onRemove={removeFromCart} 
        onCheckout={handleCheckout}
      />

      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        totalTokens={cartItems.reduce((sum, item) => sum + (parseFloat(item.price) * (item.quantity || 1)), 0)}
        onConfirm={handleConfirmOrder}
      />

      <Hero />
      <Categories 
        activeCategory={selectedCategory} 
        onCategoryChange={setSelectedCategory} 
      />
      <FeaturedDishes 
        selectedCategory={selectedCategory}
        searchTerm={searchTerm}
        onAddToCart={addToCart} 
        onDishClick={(dish) => setSelectedDish(dish)}
      />
      <Footer />

      <DishDetailModal 
        dish={selectedDish} 
        isOpen={!!selectedDish} 
        onClose={() => setSelectedDish(null)} 
        onAddToCart={addToCart} 
      />

      {/* Cart Notification Popup */}
      <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] transition-all duration-500 transform ${notification.show ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
        <div className="bg-premium-emerald text-black px-6 py-3 rounded-full font-bold shadow-lg shadow-premium-emerald/20 flex items-center gap-3">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          {notification.message}
        </div>
      </div>
      </div>
    </div>
  );
};

export default Home;
