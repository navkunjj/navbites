import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-black/90 border-t border-white/10 pt-16 pb-8 text-sm">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <div className="text-2xl font-serif font-bold tracking-wider mb-4">
                            <span className="text-premium-gold">NAV</span>
                            <span className="text-white">BITES</span>
                        </div>
                        <p className="text-gray-400 leading-relaxed">
                            Experience the finest culinary masterpieces delivered directly to your doorstep. Elevating home dining to an art form.
                        </p>
                        <div className="flex space-x-4 pt-2">
                             {/* Social Placeholders */}
                             {['twitter', 'facebook', 'instagram', 'linkedin'].map(social => (
                                 <div key={social} className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-premium-gold hover:text-black transition-all cursor-pointer">
                                     <span className="capitalize text-xs">{social[0]}</span>
                                 </div>
                             ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-bold uppercase tracking-widest mb-6">Explore</h4>
                        <ul className="space-y-3 text-gray-400">
                            {['Menu', 'Our Story', 'Chefs', 'Locations', 'Careers'].map(item => (
                                <li key={item} className="hover:text-premium-gold transition-colors cursor-pointer">
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Help */}
                    <div>
                        <h4 className="text-white font-bold uppercase tracking-widest mb-6">Support</h4>
                        <ul className="space-y-3 text-gray-400">
                            {['Help Center', 'FAQs', 'Terms of Service', 'Privacy Policy', 'Contact Us'].map(item => (
                                <li key={item} className="hover:text-premium-gold transition-colors cursor-pointer">
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-white font-bold uppercase tracking-widest mb-6">Newsletter</h4>
                        <p className="text-gray-400 mb-4">Subscribe for exclusive offers and seasonal menu updates.</p>
                        <div className="flex flex-col space-y-3">
                            <input 
                                type="email" 
                                placeholder="Your email address" 
                                className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-premium-gold transition-colors"
                            />
                            <button className="bg-premium-gold text-black font-bold py-3 rounded-lg hover:bg-yellow-500 transition-colors">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-xs">
                    <p>&copy; 2025 Nav Bites. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <span>Privacy</span>
                        <span>Terms</span>
                        <span>Sitemap</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
