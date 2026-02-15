"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const tabFromUrl = searchParams.get('tab');
  const [isLogin, setIsLogin] = useState(tabFromUrl === 'signup' ? false : true);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [university, setUniversity] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  

  const API = process.env.NEXT_PUBLIC_API_URL;

  if (!API) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is missing. Put it in .env.local next to package.json and restart `npm run dev`.",
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    const endpoint = isLogin ? "/auth/login" : "/auth/signup";
    const body = isLogin ? { email, password } : { email, name, password, university };

    try {
      const res = await fetch(`${API}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const text = await res.text();
        setMessage(`Error: ${text}`);
        setLoading(false);
        return;
      }

      setMessage("Success!");
      setTimeout(() => {
        router.push("/");
      }, 500);
    } catch (error) {
      setMessage("Connection error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex relative">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(/background.jpg)', 
          filter: 'brightness(0.7)',
        }}
      />
      <div className="absolute inset-0 bg-[#FFF8F0]" />

      {/* Content */}
      <div className="relative z-10 w-full flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <img 
              src="/logo.png" 
              alt="SustainEDU" 
              className="h-40 w-auto mx-auto mb-4 drop-shadow-2xl"
            />
          </div>

          {/* Auth Box */}
          <div className="bg-[#FFF8F0]/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-2 border-white/20">
            {/* Toggle */}
            <div className="flex bg-white rounded-full p-1 mb-6 shadow-sm border-2 border-gray-200">
              <button
                onClick={() => {
                  setIsLogin(true);
                  setMessage(null);
                }}
                className={`flex-1 py-2.5 rounded-full font-semibold text-sm transition-all ${
                  isLogin 
                    ? 'bg-green-600 text-white shadow-md' 
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                Log In
              </button>
              <button
                onClick={() => {
                  setIsLogin(false);
                  setMessage(null);
                }}
                className={`flex-1 py-2.5 rounded-full font-semibold text-sm transition-all ${
                  !isLogin 
                    ? 'bg-green-600 text-white shadow-md' 
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Error/Success Message */}
            {message && (
              <div className={`mb-4 p-3 rounded-xl text-sm font-medium ${
                message.includes('Success') 
                  ? 'bg-green-100 border-2 border-green-300 text-green-800' 
                  : 'bg-red-100 border-2 border-red-300 text-red-800'
              }`}>
                {message}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 font-medium placeholder-gray-400"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 font-medium placeholder-gray-400"
                  required
                />
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    University
                  </label>
                  <select
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 font-medium"
                    required
                  >
                    <option value="">Select your university</option>
                    <option value="uw-eau-claire">University of Wisconsin - Eau Claire</option>
                    <option value="umn">University of Minnesota</option>
                    <option value="uwmadison">University of Wisconsin - Madison</option>
                    <option value="macalester">Macalester College</option>
                    <option value="carleton">Carleton College</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 font-medium placeholder-gray-400"
                  required
                  minLength={6}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-white border-2 border-green-700 text-green-700 hover:bg-black hover:text-white hover:border-black font-bold rounded-xl transition-all transform hover:-translate-y-1 hover:shadow-xl text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Please wait...' : (isLogin ? 'Log In' : 'Create Account')}
              </button>
            </form>

            {/* Back to Home */}
            <div className="mt-6 text-center">
              <button 
                onClick={() => router.push('/')}
                className="text-gray-700 hover:text-green-600 font-semibold text-sm transition-colors"
              >
                ← Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}