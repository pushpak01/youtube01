import { useState } from 'react';
import { ThumbsUp, ThumbsDown, Share, Download, Bookmark, Flag, Coins, Gift, Users } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';

export default function VideoInfo({ video }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(video.channel.isSubscribed);
  const [showTipModal, setShowTipModal] = useState(false);
  const [tipAmount, setTipAmount] = useState('');
  const { isConnected, walletAddress } = useWallet();

  const handleLike = () => {
    if (isDisliked) setIsDisliked(false);
    setIsLiked(!isLiked);
  };

  const handleDislike = () => {
    if (isLiked) setIsLiked(false);
    setIsDisliked(!isDisliked);
  };

  const handleSubscribe = () => {
    setIsSubscribed(!isSubscribed);
  };

  const handleTip = () => {
    if (!isConnected) {
      alert('Please connect your wallet to send tips');
      return;
    }
    setShowTipModal(true);
  };

  const sendTip = () => {
    // Implement tip sending logic
    console.log(`Sending ${tipAmount} SONIC to ${video.channel.name}`);
    setShowTipModal(false);
    setTipAmount('');
  };

  const buyNFT = () => {
    if (!isConnected) {
      alert('Please connect your wallet to purchase NFT');
      return;
    }
    // Implement NFT purchase logic
    console.log(`Purchasing NFT for video ${video.id}`);
  };

  return (
    <div className="bg-dark-800/50 backdrop-blur-lg rounded-3xl p-6 border border-cyan-400/20">
      {/* Video Title and Stats */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-white mb-2">{video.title}</h1>
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <span>{video.views} views</span>
          <span>•</span>
          <span>{video.timestamp}</span>
          <span>•</span>
          <span className="text-cyan-400">{video.category}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          {/* Like/Dislike */}
          <div className="flex items-center space-x-2 bg-dark-700 rounded-2xl p-1">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                isLiked ? 'bg-cyan-500 text-white' : 'hover:bg-gray-600 text-gray-300'
              }`}
            >
              <ThumbsUp size={18} />
              <span>{video.likes}</span>
            </button>
            <div className="h-6 w-px bg-gray-600"></div>
            <button
              onClick={handleDislike}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                isDisliked ? 'bg-red-500 text-white' : 'hover:bg-gray-600 text-gray-300'
              }`}
            >
              <ThumbsDown size={18} />
            </button>
          </div>

          {/* Share */}
          <button className="flex items-center space-x-2 bg-dark-700 hover:bg-gray-600 text-gray-300 px-4 py-2 rounded-2xl transition-colors">
            <Share size={18} />
            <span>Share</span>
          </button>

          {/* Download */}
          <button className="flex items-center space-x-2 bg-dark-700 hover:bg-gray-600 text-gray-300 px-4 py-2 rounded-2xl transition-colors">
            <Download size={18} />
            <span>Download</span>
          </button>

          {/* Save */}
          <button className="flex items-center space-x-2 bg-dark-700 hover:bg-gray-600 text-gray-300 px-4 py-2 rounded-2xl transition-colors">
            <Bookmark size={18} />
            <span>Save</span>
          </button>

          {/* Tip */}
          <button
            onClick={handleTip}
            className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-4 py-2 rounded-2xl transition-all shadow-lg shadow-yellow-500/25"
          >
            <Gift size={18} />
            <span>Tip Creator</span>
          </button>

          {/* Report */}
          <button className="flex items-center space-x-2 bg-dark-700 hover:bg-gray-600 text-gray-300 p-2 rounded-2xl transition-colors">
            <Flag size={18} />
          </button>
        </div>

        {/* NFT Purchase */}
        {video.nft.available && (
          <button
            onClick={buyNFT}
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-2xl transition-all shadow-lg shadow-purple-500/25 font-bold"
          >
            <Coins size={18} />
            <span>Buy NFT - {video.nft.price}</span>
          </button>
        )}
      </div>

      {/* Channel Info and Description */}
      <div className="border-t border-gray-700 pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-2xl flex items-center justify-center">
              <Users size={24} className="text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-white">{video.channel.name}</h3>
                {video.channel.isVerified && (
                  <div className="w-5 h-5 bg-cyan-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                )}
              </div>
              <p className="text-gray-400 text-sm">{video.channel.subscribers} subscribers</p>
            </div>
          </div>

          <button
            onClick={handleSubscribe}
            className={`px-6 py-3 rounded-2xl font-bold transition-all ${
              isSubscribed
                ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                : 'bg-red-500 text-white hover:bg-red-600'
            }`}
          >
            {isSubscribed ? 'Subscribed' : 'Subscribe'}
          </button>
        </div>

        {/* Video Description */}
        <div className="bg-dark-700/50 rounded-2xl p-4">
          <p className="text-gray-300 whitespace-pre-line">{video.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {video.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm border border-cyan-400/30"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Earnings */}
          <div className="mt-4 p-3 bg-yellow-500/20 rounded-xl border border-yellow-400/30">
            <div className="flex items-center space-x-2 text-yellow-400">
              <Coins size={16} />
              <span className="font-bold">Creator Earnings: {video.earnings}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tip Modal */}
      {showTipModal && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
          <div className="bg-dark-800 rounded-3xl p-6 max-w-md w-full mx-4 border border-cyan-400/30">
            <h3 className="text-xl font-bold text-white mb-4">Tip {video.channel.name}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Amount (SONIC)</label>
                <input
                  type="number"
                  value={tipAmount}
                  onChange={(e) => setTipAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-dark-700 border border-gray-600 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowTipModal(false)}
                  className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-2xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={sendTip}
                  className="flex-1 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-2xl transition-all font-bold"
                >
                  Send Tip
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}