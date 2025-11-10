import { useState } from 'react';
import Link from 'next/link';
import { Search, Menu, Mic, Video, Bell, User, Wallet, Rocket } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';

export default function NeonHeader({ isMobile, onSidebarToggle, router, userProfile, profileLoading }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const {
    isConnected,
    walletAddress,
    setShowWalletModal
  } = useWallet();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  console.log('🔍 Header Debug:', {
    isConnected,
    walletAddress,
    hasUserProfile: !!userProfile,
    profilePicture: userProfile?.profilePicture
  });

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-dark-900 bg-opacity-90 backdrop-blur-4xl border-b border-cyan-400/20 sticky top-0 z-50 shadow-neon-blue">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onSidebarToggle}
          className="p-3 hover:bg-cyan-400/10 rounded-2xl transition-all duration-300 hover:scale-110 group neon-border animate-pulse-glow"
        >
          <Menu size={22} className="text-cyan-400 group-hover:rotate-90 transition-transform duration-300" />
        </button>

        {/* Animated Logo */}
        <div
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={() => router.push('/')}
        >
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-500 shadow-neon-blue animate-float">
              <Rocket size={28} className="text-white" />
            </div>
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-2xl blur opacity-30 group-hover:opacity-70 transition-opacity duration-300"></div>
          </div>
          {!isMobile && (
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gradient-rainbow animate-gradient-flow">
                SonicVision
              </span>
              <span className="text-xs text-cyan-400 -mt-1 animate-pulse">Decentralized Media</span>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Neon Search */}
      {!isMobile && (
        <div className="flex-1 max-w-2xl mx-8">
          <div className={`relative transition-all duration-500 ${isSearchFocused ? 'scale-105' : ''}`}>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-2xl blur opacity-30 animate-pulse"></div>
            <form onSubmit={handleSearch} className="relative">
              <div className="flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  placeholder="Explore decentralized universe..."
                  className="w-full px-6 py-4 bg-dark-800 border-2 border-cyan-400/50 rounded-2xl focus:outline-none focus:border-cyan-400 text-white placeholder-cyan-200 backdrop-blur-sm pr-16 text-lg shadow-inner-neon"
                />
                <button
                  type="submit"
                  className="absolute right-2 p-3 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-xl transition-all duration-300 hover:scale-110 hover:rotate-12 shadow-neon-blue"
                >
                  <Search size={20} className="text-white" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Right Actions with Neon Effects */}
      <div className="flex items-center space-x-3">
        {!isMobile && (
          <>
            <button className="p-3 hover:bg-cyan-400/10 rounded-2xl transition-all duration-300 hover:scale-110 group relative neon-border">
              <Mic size={22} className="text-cyan-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
            </button>

            <button className="p-3 hover:bg-purple-400/10 rounded-2xl transition-all duration-300 hover:scale-110 group neon-border">
              <Video size={22} className="text-purple-400" />
            </button>

            <button className="p-3 hover:bg-pink-400/10 rounded-2xl transition-all duration-300 hover:scale-110 group relative neon-border">
              <Bell size={22} className="text-pink-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-bounce"></div>
            </button>
          </>
        )}

        {/* Single Wallet/Profile Section */}
        {isConnected && walletAddress ? (
          /* Profile Picture Circle - Click to go to Profile */
          <Link
            href={`/profile/${walletAddress}`}
            className="p-1 hover:scale-110 transition-all duration-300 group relative cursor-pointer"
          >
            {/* Neon glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full blur opacity-30 group-hover:opacity-70 transition-opacity duration-300"></div>

            {/* Profile picture or placeholder */}
            {userProfile?.profilePicture ? (
              <img
                src={userProfile.profilePicture}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-cyan-400 shadow-neon-blue relative z-10 cursor-pointer"
              />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center border-2 border-cyan-400 shadow-neon-blue relative z-10 cursor-pointer">
                <User size={18} className="text-white" />
              </div>
            )}
          </Link>
        ) : (
          /* Single Connect Wallet Button */
          <button
            onClick={() => setShowWalletModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-bold rounded-2xl hover:shadow-neon-blue hover:scale-105 transition-all duration-300 flex items-center space-x-2 shadow-lg"
          >
            <Wallet size={18} />
            <span>Connect Wallet</span>
          </button>
        )}
      </div>
    </header>
  );
}