import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ cartCount, onCartClick, user, onLogout, searchTerm, onSearchChange, onTopUp }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleCategoryClick = () => {
    // If already on home page, just scroll to categories
    if (window.location.pathname === '/') {
      const categoriesSection = document.getElementById('categories');
      if (categoriesSection) {
        categoriesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      // Navigate to home page with hash
      navigate('/#categories');
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] transition-all duration-300 glass border-b-0 backdrop-blur-md">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center gap-4 relative">
          {/* Logo */}
          <div onClick={() => navigate('/')} className="text-2xl font-serif font-bold tracking-wider cursor-pointer z-[100] relative flex-shrink-0">
            <span className="text-premium-gold">NAV</span>
            <span className="text-white">BITES</span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-6 items-center flex-shrink-0">
            <button
              onClick={handleCategoryClick}
              className="text-gray-300 hover:text-premium-gold transition-colors font-medium whitespace-nowrap"
            >
              Menu Categories
            </button>
            {user && (
              <button
                onClick={() => navigate('/orders')}
                className="text-gray-300 hover:text-premium-emerald transition-colors font-medium whitespace-nowrap"
              >
                My Orders
              </button>
            )}
            <button
              onClick={() => navigate('/')}
              className="text-gray-300 hover:text-premium-emerald transition-colors whitespace-nowrap"
            >
              Reservations
            </button>
            <button
              onClick={() => navigate('/')}
              className="text-gray-300 hover:text-premium-emerald transition-colors whitespace-nowrap"
            >
              Chefs
            </button>
          </div>

          {/* Mobile User Name - Centered */}
          {user && (
            <div className="md:hidden absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <span className="text-gray-400 text-xs mr-1">Hi,</span>
              <span className="text-white font-bold text-sm">{user.name.split(' ')[0]}</span>
            </div>
          )}

          {/* Right Side - Search, Cart, Auth */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Search Bar */}
            <div className="hidden lg:flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-1.5 focus-within:border-premium-gold/50 transition-all w-48 xl:w-64">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search dishes..."
                className="bg-transparent border-none outline-none text-sm text-white px-3 w-full placeholder:text-gray-500"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>

            {/* Cart Button */}
            <button
              onClick={onCartClick}
              className="relative p-2 text-gray-300 hover:text-white transition-colors group z-[100] flex-shrink-0"
            >
              <div className="border border-white/20 p-2 rounded-full hover:bg-white/10 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-premium-gold text-black text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="hidden md:flex items-center gap-3 flex-shrink-0">
                <div className="flex items-center gap-2 px-3 py-1 bg-premium-gold/10 border border-premium-gold/30 rounded-full group transition-all">
                  <span className="text-premium-gold font-bold">★</span>
                  <span className="text-sm font-bold text-premium-gold">{user.tokens || 0}</span>
                  <button
                    onClick={onTopUp}
                    className="ml-2 w-5 h-5 flex items-center justify-center bg-premium-gold text-black rounded-full text-xs hover:bg-yellow-500 transition-colors shadow-sm"
                    title="Top up coins"
                  >
                    +
                  </button>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Welcome,</p>
                  <p className="text-sm font-bold text-white">{user.name}</p>
                </div>
                <button
                  onClick={onLogout}
                  className="px-4 py-2 border border-white/20 text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-300 rounded-full font-medium text-sm whitespace-nowrap"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-1.5 md:px-6 md:py-2 border border-premium-gold text-premium-gold hover:bg-premium-gold hover:text-black transition-all duration-300 rounded-full font-medium whitespace-nowrap text-sm"
              >
                Login
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 text-white z-[100] focus:outline-none flex-shrink-0"
            >
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-black/95 backdrop-blur-lg z-[90] transition-transform duration-300 md:hidden overflow-y-auto flex ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="m-auto flex flex-col items-center w-full py-10 space-y-8">
          {/* Mobile Search */}
          <div className="flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-3 focus-within:border-premium-gold/50 transition-all w-64">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search dishes..."
              className="bg-transparent border-none outline-none text-base text-white px-3 w-full placeholder:text-gray-500"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          <button
            onClick={() => { handleCategoryClick(); setIsMenuOpen(false); }}
            className="text-2xl text-white hover:text-premium-gold font-bold"
          >
            Menu Categories
          </button>
          {user && (
            <button
              onClick={() => { navigate('/orders'); setIsMenuOpen(false); }}
              className="text-2xl text-white hover:text-premium-gold font-bold"
            >
              My Orders
            </button>
          )}
          <button
            onClick={() => { navigate('/'); setIsMenuOpen(false); }}
            className="text-2xl text-white hover:text-premium-gold font-bold"
          >
            Reservations
          </button>
          <button
            onClick={() => { navigate('/'); setIsMenuOpen(false); }}
            className="text-2xl text-white hover:text-premium-gold font-bold"
          >
            Chefs
          </button>

          {user && (
            <div className="flex flex-col items-center space-y-4 pt-6 border-t border-white/10 w-64">
              <div className="flex flex-col items-center gap-2">
                <span className="text-gray-400 text-sm">Welcome,</span>
                <span className="text-premium-gold font-bold text-xl">{user.name}</span>

                {/* Mobile Token Display */}
                <div className="flex items-center gap-2 px-4 py-2 bg-premium-gold/10 border border-premium-gold/30 rounded-full">
                  <span className="text-premium-gold font-bold">★</span>
                  <span className="text-lg font-bold text-premium-gold">{user.tokens || 0}</span>
                  <button
                    onClick={() => { onTopUp(); setIsMenuOpen(false); }}
                    className="ml-2 w-6 h-6 flex items-center justify-center bg-premium-gold text-black rounded-full text-sm font-bold hover:bg-yellow-500 transition-colors shadow-sm"
                    title="Top up coins"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={() => { onLogout(); setIsMenuOpen(false); }}
                className="px-8 py-3 border border-white/20 text-white rounded-full hover:bg-white/10 w-full"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
