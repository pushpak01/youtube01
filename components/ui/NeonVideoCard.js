import { useState } from 'react';
import { CirclePlay, User, Eye, Coins, Star, Heart, Share, Download } from 'lucide-react';

export default function NeonVideoCard({ video, isMobile, onClick }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div
      className="group cursor-pointer transform transition-all duration-500 hover:scale-105"
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
      onClick={onClick}
    >
      <div className={`
        relative overflow-hidden rounded-3xl border-2 border-cyan-400/30
        bg-gradient-to-br from-dark-800 via-dark-700 to-dark-800
        ${isHovered ? 'border-cyan-400 shadow-neon-blue scale-105' : ''}
        transition-all duration-500 card-holographic
      `}>
        {/* Animated Background Layer */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

        {/* Thumbnail Container */}
        <div className="relative aspect-video overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-cyan-900/30 to-purple-900/30 flex items-center justify-center particle-bg">
            <div className="text-center relative z-10">
              <div className="w-20 h-20 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-neon-blue">
                <CirclePlay size={32} className="text-white" />
              </div>
              <span className="text-cyan-300 text-sm font-medium animate-pulse">Decentralized Stream</span>
            </div>
          </div>

          {/* Hover Overlay with Actions */}
          {isHovered && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex items-end p-6">
              <div className="flex space-x-3 w-full">
                <button
                  onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }}
                  className={`flex-1 py-3 rounded-xl transition-all duration-300 ${
                    isLiked
                      ? 'bg-pink-500 shadow-neon-pink'
                      : 'bg-gray-800 hover:bg-pink-500/20'
                  }`}
                >
                  <Heart size={20} className={`mx-auto ${isLiked ? 'text-white fill-white' : 'text-gray-400'}`} />
                </button>
                <button className="flex-1 py-3 bg-gray-800 rounded-xl hover:bg-cyan-500/20 transition-all duration-300">
                  <Share size={20} className="text-cyan-400 mx-auto" />
                </button>
                <button className="flex-1 py-3 bg-gray-800 rounded-xl hover:bg-purple-500/20 transition-all duration-300">
                  <Download size={20} className="text-purple-400 mx-auto" />
                </button>
              </div>
            </div>
          )}

          {/* Live Badge with Animation */}
          <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-3 py-2 rounded-full flex items-center space-x-2 shadow-neon-pink animate-pulse-glow">
            <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
            <span className="font-bold">LIVE</span>
          </div>

          {/* Token Reward Badge */}
          <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs px-3 py-2 rounded-full flex items-center space-x-1 font-bold shadow-neon-pink">
            <Coins size={14} />
            <span>+25 SONIC</span>
          </div>

          {/* Duration */}
          <div className="absolute bottom-4 right-4 bg-black/80 text-white text-xs px-3 py-2 rounded-xl backdrop-blur-sm">
            {video.duration}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 relative">
          {/* Channel Info with Verification */}
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-neon-blue">
                <User size={20} className="text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-dark-800 animate-pulse"></div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-white font-bold text-lg truncate hover:text-cyan-300 transition-colors">
                  {video.channel}
                </span>
                {video.verified && (
                  <div className="w-5 h-5 bg-cyan-400 rounded-full flex items-center justify-center shadow-neon-blue">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-3 text-sm text-cyan-300">
                <span>{video.views} views</span>
                <span className="text-cyan-400">•</span>
                <span>{video.timestamp}</span>
              </div>
            </div>
          </div>

          {/* Title with Gradient Effect */}
          <h3 className="text-xl font-bold text-white line-clamp-2 mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-500 leading-tight">
            {video.title}
          </h3>

          {/* Engagement Metrics with Icons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2 text-cyan-300">
                <Eye size={16} />
                <span>{video.views}</span>
              </div>
              <div className="flex items-center space-x-2 text-green-400 animate-pulse">
                <Coins size={16} />
                <span className="font-bold">Earn Rewards</span>
              </div>
              <div className="flex items-center space-x-2 text-yellow-400">
                <Star size={16} />
                <span>4.9</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-pink-400">
              <Heart size={16} />
              <span>2.4K</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}