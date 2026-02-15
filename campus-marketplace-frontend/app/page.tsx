'use client';

import { useState, useEffect } from 'react';
import ProductCard from './components/ProductCard';
import listings from './data/listings.json';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  const categories = ['All', 'Furniture', 'Appliances', 'Decor', 'Books'];

  useEffect(() => {
    async function checkAuthStatus(){
      const API = process.env.NEXT_PUBLIC_API_URL;
      try{
        const res = await fetch(`${API}/auth/me`, {
          credentials:'include',
        });
        if (res.ok){
          const userData = await res.json();
          setIsLoggedIn(false);
          setUser(userData);
        }
      } catch (error){
        console.log('Not logged in');
      }
    }
    checkAuthStatus();
  },[]
  );

  const handleLogout = async () => {
    const API = process.env.NEXT_PUBLIC_API_URL;

    try{
      await fetch(`${API}/auth/logout`, {
        method:'POST',
        credentials: 'include',
      });
      setIsLoggedIn(false);
      setUser(null);
      window.location.reload();

    } catch (error){
      console.error('Logout failed:', error);
    }
  }

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      {/* Simple Top Navigation Bar */}
      <header className="bg-[#FFF8F0] py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <img 
                src="/logo.png" 
                alt="SustainEDU" 
                className="h-40 w-auto cursor-pointer hover:opacity-80 transition-opacity"
              />
            </div>

            {/* Right Side - Dynamic based on login */}
            <div className="flex items-center gap-3">
              {isLoggedIn ? (
                <>
                  <button 
                    onClick={() => window.location.href = '/sell'}
                    className="px-6 py-2.5 bg-green-600 border-2 border-black hover:bg-green-700 text-white font-semibold rounded-full transition-all transform hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    Sell Now
                  </button>
                  <button 
                    onClick={() => alert('Inbox coming soon!')}
                    className="px-6 py-2.5 bg-white border-2 border-green-700 text-green-700 hover:bg-green-700 hover:text-white hover:border-black font-semibold rounded-full transition-all transform hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    💬 Inbox
                  </button>
                  <button 
                    onClick={() => alert('Profile coming soon!')}
                    className="px-6 py-2.5 bg-white border-2 border-green-700 text-green-700 hover:bg-green-700 hover:text-white hover:border-black font-semibold rounded-full transition-all transform hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    👤 Profile
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="px-6 py-2.5 text-gray-700 hover:text-red-600 font-semibold transition-all"
                  >
                    Logout
                  </button>
                </>

              ):(
                // Not logged in
                <>
              
              <button 
                onClick={() => window.location.href = '/auth?tab=signup'}
                className="px-6 py-2.5 bg-white border-2 border-green-700 text-green-700 hover:bg-green-700 hover:text-white hover:border-black font-semibold rounded-full transition-all transform hover:-translate-y-0.5 hover:shadow-lg"
              >
                Sign up
              </button>
              <button 
                onClick={() => window.location.href = '/auth?tab=login'}
                className="px-6 py-2.5 bg-white border-2 border-green-700 text-green-700 hover:bg-green-700 hover:text-white hover:border-black font-semibold rounded-full transition-all transform hover:-translate-y-0.5 hover:shadow-lg"
              >
                Log in
              </button>
              </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="bg-gradient-to-br from-green-50 to-white py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Mending Over Ending
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto font-medium">
            Your campus marketplace for sustainable living. Buy and sell quality dorm essentials from fellow students.
          </p>
          
          <p className="text-base text-gray-600 mb-10 max-w-2xl mx-auto">
            Quality items originally from trusted brands like <span className="font-semibold text-gray-900">IKEA, Target, Wayfair, Best Buy,</span> and more — now available at student-friendly prices.
          </p>

          {/* Key Benefits */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="text-4xl mb-3">💰</div>
              <h3 className="font-bold text-gray-900 mb-2">Save Money</h3>
              <p className="text-sm text-gray-700">Items up to 70% off retail price</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="text-4xl mb-3">♻️</div>
              <h3 className="font-bold text-gray-900 mb-2">Reduce Waste</h3>
              <p className="text-sm text-gray-700">Keep furniture out of landfills</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="text-4xl mb-3">🤝</div>
              <h3 className="font-bold text-gray-900 mb-2">Verified Sellers</h3>
              <p className="text-sm text-gray-700">Student-to-student trust & reviews</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="text-4xl mb-3">🌍</div>
              <h3 className="font-bold text-gray-900 mb-2">Sustainability</h3>
              <p className="text-sm text-gray-700">Lower your carbon footprint</p>
            </div>
          </div>

          <button 
            onClick={() => {
              document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-10 py-4 bg-white border-2 border-green-700 text-green-700 hover:bg-green-700 hover:text-white hover:border-black font-bold rounded-full text-lg transition-all transform hover:-translate-y-1 hover:shadow-xl"
          >
            Start Shopping
          </button>
        </div>
      </section>

      {/* SCROLLING CATEGORY BAR */}
      <div className="bg-[#FFF8F0] py-3 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          <span className="text-gray-600 text-lg mx-4" style={{ fontFamily: 'Courier New, monospace' }}>
            Furniture • Appliances • Decor • Textbooks • Mini Fridges • Coffee Makers • Desk Chairs • Bean Bags • Microwaves • Lamps • Storage Bins • Bookshelves • Gaming Chairs • Air Fryers • Bedding • Rugs • Fans • Blenders • Electric Kettles • Futons •
            Furniture • Appliances • Decor • Textbooks • Mini Fridges • Coffee Makers • Desk Chairs • Bean Bags • Microwaves • Lamps • Storage Bins • Bookshelves • Gaming Chairs • Air Fryers • Bedding • Rugs • Fans • Blenders • Electric Kettles • Futons
          </span>
          <span className="text-gray-600 text-lg mx-4" style={{ fontFamily: 'Courier New, monospace' }}>
            Furniture • Appliances • Decor • Textbooks • Mini Fridges • Coffee Makers • Desk Chairs • Bean Bags • Microwaves • Lamps • Storage Bins • Bookshelves • Gaming Chairs • Air Fryers • Bedding • Rugs • Fans • Blenders • Electric Kettles • Futons •
            Furniture • Appliances • Decor • Textbooks • Mini Fridges • Coffee Makers • Desk Chairs • Bean Bags • Microwaves • Lamps • Storage Bins • Bookshelves • Gaming Chairs • Air Fryers • Bedding • Rugs • Fans • Blenders • Electric Kettles • Futons
          </span>
        </div>
      </div>

      {/* TESTIMONIALS SECTION */}
      <section className="py-16 px-4 bg-[#FFF8F0]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
            What Students Are Saying
          </h2>
          <p className="text-center text-sm text-gray-600 mb-10">(Demo Testimonials)</p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="flex items-center gap-1 mb-3">
                <span className="text-yellow-500">★★★★★</span>
              </div>
              <p className="text-gray-700 mb-4 italic">
                "Saved over $800 furnishing my entire dorm room! Everything was in great condition and the sellers were super responsive."
              </p>
              <p className="font-semibold text-gray-900">Sarah M.</p>
              <p className="text-sm text-gray-600">UW-Eau Claire, Freshman</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="flex items-center gap-1 mb-3">
                <span className="text-yellow-500">★★★★★</span>
              </div>
              <p className="text-gray-700 mb-4 italic">
                "Found the perfect desk in just minutes. Love that I'm buying sustainably and supporting fellow students!"
              </p>
              <p className="font-semibold text-gray-900">Mike T.</p>
              <p className="text-sm text-gray-600">University of Minnesota, Sophomore</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="flex items-center gap-1 mb-3">
                <span className="text-yellow-500">★★★★★</span>
              </div>
              <p className="text-gray-700 mb-4 italic">
                "So much better than Facebook Marketplace! Everyone here is actually a verified student. Feels way safer."
              </p>
              <p className="font-semibold text-gray-900">Jessica L.</p>
              <p className="text-sm text-gray-600">Macalester College, Junior</p>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS SECTION */}
      <section id="products" className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Category Filters */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-3 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full font-semibold transition-all whitespace-nowrap ${
                    selectedCategory === category
                      ? 'bg-green-600 text-white shadow-md'
                      : 'bg-white text-gray-900 border-2 border-gray-200 hover:border-green-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-white border-2 border-gray-300 rounded-full text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {listings.map((listing) => (
              <ProductCard
                key={listing.id}
                id={listing.id}
                title={listing.title}
                price={listing.price}
                image={listing.image}
                seller={listing.seller}
              />
            ))}
          </div>
        </div>
      </section>

      {/* JOIN COMMUNITY CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-green-600 to-green-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Ready to Start Saving and Selling?
          </h2>
          <p className="text-xl text-green-50 mb-8">
            Join 500+ students buying and selling sustainably on campus
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => window.location.href = '/auth?tab=signup'}
              className="px-10 py-4 bg-white border-2 border-green-700 text-green-700 hover:bg-gray-200 hover:text-white hover:border-black font-bold rounded-full text-lg transition-all transform hover:-translate-y-1 hover:shadow-xl"
            >
              Sign Up Now
            </button>
            <button 
              onClick={() => window.location.href = '/auth'}
              className="px-10 py-4 bg-white border-2 border-green-700 text-green-700 hover:bg-gray-200 hover:text-white hover:border-black font-bold rounded-full text-lg transition-all transform hover:-translate-y-1 hover:shadow-xl"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4 text-gray-900">Campus Market</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-700 hover:text-green-600 font-medium">About us</a></li>
                <li><a href="#" className="text-gray-700 hover:text-green-600 font-medium">Careers</a></li>
                <li><a href="#" className="text-gray-700 hover:text-green-600 font-medium">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4 text-gray-900">Sell</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-700 hover:text-green-600 font-medium">How to sell</a></li>
                <li><a href="#" className="text-gray-700 hover:text-green-600 font-medium">Seller tips</a></li>
                <li><a href="#" className="text-gray-700 hover:text-green-600 font-medium">Safety</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4 text-gray-900">Help</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-700 hover:text-green-600 font-medium">Help Center</a></li>
                <li><a href="#" className="text-gray-700 hover:text-green-600 font-medium">Contact us</a></li>
                <li><a href="#" className="text-gray-700 hover:text-green-600 font-medium">Trust & Safety</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4 text-gray-900">Download the app</h3>
              <p className="text-sm text-gray-700 font-medium">
                Buy and sell faster on iOS and Android
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm font-semibold text-gray-900">
            <p>© 2026 Campus Market. Mending over Ending.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}