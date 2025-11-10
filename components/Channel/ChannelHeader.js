import { useState } from 'react';
import { Bell, Share, MoreHorizontal, Users, Eye, Coins, Calendar } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';

export default function ChannelHeader({ channel }) {
  const [isSubscribed, setIsSubscribed] = useState(channel.isSubscribed);
  const [showNotifications, setShowNotifications] = useState(false);
  const { isConnected } = useWallet();

  const handleSubscribe = () => {
    if (!isConnected) {
      alert('Please connect your wallet to subscribe');
      return;
    }
    setIsSubscribed(!isSubscribed);
  };

  const handleTip = () => {
    if (!isConnected) {
      alert('Please connect your wallet to send tips');
      return;
    }
    // Implement tip functionality
    console.log(`Tipping channel: ${channel.name}`);
  };

  const handleShare = () => {
    // Implement share functionality
    navigator.clipboard.writeText(window.location.href);
    alert('Channel link copied to clipboard!');
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num;
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="relative">
      {/* Channel Banner */}
      <div className="h-48 bg-gradient-to-r from-cyan-900/30 via-purple-900/30 to-pink-900/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        {channel.isLive && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full flex items-center space-x-2 z-10 animate-pulse">
            <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
            <span className="font-bold">LIVE NOW</span>
          </div>
        )}
      </div>

      {/* Channel Info */}
      <div className="bg-dark-900/80 backdrop-blur-4xl border-b border-cyan-400/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-6">
            {/* Channel Avatar */}
            <div className="relative -mt-20 lg:-mt-16">
              <div className="w-32 h-32 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-3xl border-4 border-dark-900 shadow-2xl shadow-cyan-500/30 flex items-center justify-center">
                <Users size={48} className="text-white" />
              </div>
              {channel.isVerified && (
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-cyan-400 rounded-full border-4 border-dark-900 flex items-center justify-center shadow-lg">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              )}
            </div>

            {/* Channel Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-white truncate">{channel.name}</h1>
                {channel.isVerified && (
                  <div className="w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                )}
              </div>

              <p className="text-gray-300 text-lg mb-4 line-clamp-2">{channel.description}</p>

              {/* Channel Stats */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <Users size={16} className="text-cyan-400" />
                  <span>{formatNumber(parseInt(channel.subscribers))} subscribers</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye size={16} className="text-purple-400" />
                  <span>{formatNumber(channel.totalViews)} total views</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Coins size={16} className="text-yellow-400" />
                  <span>{channel.earnings} earned</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar size={16} className="text-green-400" />
                  <span>Joined {formatDate(channel.joinedDate)}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                {channel.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm border border-cyan-400/30"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              {/* Tip Button */}
              <button
                onClick={handleTip}
                className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-6 py-3 rounded-2xl transition-all shadow-lg shadow-yellow-500/25 font-bold"
              >
                <Coins size={18} />
                <span>Tip Creator</span>
              </button>

              {/* Subscribe Button */}
              <button
                onClick={handleSubscribe}
                className={`px-8 py-3 rounded-2xl font-bold transition-all ${
                  isSubscribed
                    ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                    : 'bg-red-500 text-white hover:bg-red-600'
                }`}
              >
                {isSubscribed ? 'Subscribed' : 'Subscribe'}
              </button>

              {/* Notification Bell */}
              {isSubscribed && (
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-3 bg-dark-700 hover:bg-gray-600 rounded-2xl transition-colors relative"
                >
                  <Bell size={20} className="text-gray-300" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                </button>
              )}

              {/* Share Button */}
              <button
                onClick={handleShare}
                className="p-3 bg-dark-700 hover:bg-gray-600 rounded-2xl transition-colors"
              >
                <Share size={20} className="text-gray-300" />
              </button>

              {/* More Options */}
              <button className="p-3 bg-dark-700 hover:bg-gray-600 rounded-2xl transition-colors">
                <MoreHorizontal size={20} className="text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}