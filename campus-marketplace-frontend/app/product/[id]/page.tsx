'use client';

import { useRouter } from 'next/navigation';
import listings from '../../data/listings.json';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const router = useRouter();
  const productId = parseInt(params.id);
  const product = listings.find(p => p.id === productId);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <button 
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-white border-2 border-green-700 text-green-700 hover:bg-green-700 hover:text-white font-semibold rounded-full"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      {/* Navbar */}
      <header className="bg-[#FFF8F0] py-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <img 
              src="/logo.png" 
              alt="SustainEDU" 
              className="h-20 w-auto cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => router.push('/')}
            />
            <button 
              onClick={() => router.push('/')}
              className="text-gray-700 hover:text-green-600 font-semibold"
            >
              ← Back to Marketplace
            </button>
          </div>
        </div>
      </header>

      {/* Product Detail */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Left: Image */}
          <div>
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg aspect-square">
              <img 
                src={product.image} 
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right: Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {product.title}
              </h1>
              <p className="text-5xl font-bold text-green-600 mb-6">
                ${product.price}
              </p>
              
              <div className="flex items-center gap-2 mb-6">
                <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                  {product.category}
                </span>
                <span className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-semibold">
                  {product.condition}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 text-lg">Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Seller Info */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">Seller Information</h3>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-semibold text-gray-900 text-lg">{product.seller.name}</p>
                  <p className="text-sm text-gray-600">{product.seller.university}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-yellow-500 text-lg">
                    <span>★</span>
                    <span className="font-bold text-gray-900">{product.seller.rating}</span>
                  </div>
                  <p className="text-xs text-gray-600">{product.seller.reviewCount} reviews</p>
                </div>
              </div>
            </div>

            {/* Contact Button */}
            <button 
              onClick={() => alert('Chat feature coming soon! Your backend team is working on this.')}
              className="w-full py-4 bg-white border-2 border-green-700 text-green-700 hover:bg-black hover:text-white hover:border-black font-bold rounded-xl transition-all transform hover:-translate-y-1 hover:shadow-xl text-lg"
            >
              💬 Contact Seller
            </button>

            {/* Safety Tips */}
            <div className="bg-green-50 border-2 border-green-200 p-4 rounded-xl">
              <p className="text-sm text-green-800 font-medium">
                <strong>Safety Tip:</strong> Meet in a public place on campus. Never share personal financial information.
              </p>
            </div>
          </div>
        </div>

        {/* Similar Items */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Similar Items
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {listings
              .filter(item => item.category === product.category && item.id !== product.id)
              .slice(0, 4)
              .map(item => (
                <div 
                  key={item.id}
                  onClick={() => router.push(`/product/${item.id}`)}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-1"
                >
                  <div className="aspect-square bg-gray-100">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3">
                    <h4 className="font-semibold text-sm text-gray-900 line-clamp-1">{item.title}</h4>
                    <p className="text-lg font-bold text-green-600">${item.price}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </main>
    </div>
  );
}