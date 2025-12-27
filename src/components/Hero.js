import React from 'react';

const Hero = () => {
  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden pt-20 pb-10">
      {/* Background Decor */}
      <div className="absolute top-[20%] left-[10%] w-64 h-64 bg-premium-gold/10 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-premium-emerald/10 rounded-full blur-[120px]"></div>

      <div className="container mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        <div className="space-y-6 text-center md:text-left">
          <span className="text-premium-gold tracking-[0.2em] font-medium uppercase text-sm">Culinary Excellence</span>
          <h1 className="text-4xl md:text-7xl font-serif font-bold leading-tight">
            Taste the <br className="hidden md:block" />
            <span className="text-gradient-gold">Extraordinary</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-md leading-relaxed mx-auto md:mx-0">
            Experience Michelin-star quality cuisine delivered directly to your doorstep. crafted by world-renowned chefs.
          </p>
          <div className="flex justify-center md:justify-start space-x-4 pt-4">
            <button className="px-8 py-3 bg-premium-gold text-black font-bold rounded-full hover:bg-yellow-500 transition-transform hover:scale-105 shadow-lg shadow-premium-gold/20">
              View Menu
            </button>
            <button className="px-8 py-3 glass text-white rounded-full hover:bg-white/10 transition-colors">
              Watch Video
            </button>
          </div>
        </div>

        <div className="relative max-w-[300px] md:max-w-none mx-auto w-full">
          {/* Hero Image */}
          <div className="aspect-square rounded-full border border-white/10 flex items-center justify-center relative overflow-hidden pulse-animation group">
            <img
              src="/images/hero_dish.png"
              alt="Premium Steak"
              className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-700 animate-float"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-full"></div>

            {/* Decorative circle ring */}
            <div className="absolute inset-4 border border-white/20 rounded-full border-dashed animate-spin-slow pointer-events-none"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
