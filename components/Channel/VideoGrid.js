import { useRouter } from 'next/router';
import { Play, Eye, Coins, Diamond } from 'lucide-react';

export default function VideoGrid({ videos }) {
  const router = useRouter();

  const handleVideoClick = (videoId) => {
    router.push(`/watch/${videoId}`);
  };

  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎬</div>
        <h3 className="text-xl font-bold text-white mb-2">No Videos Yet</h3>
        <p className="text-gray-400">This channel hasn't uploaded any videos.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {videos.map((video) => (
        <div
          key={video.id}
          onClick={() => handleVideoClick(video.id)}
          className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
        >
          <div className="bg-dark-800/50 backdrop-blur-lg rounded-3xl border border-cyan-400/20 overflow-hidden hover:border-cyan-400/50 transition-all duration-300 card-holographic">
            {/* Thumbnail */}
            <div className="relative aspect-video bg-gradient-to-br from-cyan-900/30 to-purple-900/30 flex items-center justify-center">
              {/* Play Button Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
                  <Play size={24} className="text-white" fill="white" />
                </div>
              </div>

              {/* Live Badge */}
              {video.isLive && (
                <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1 animate-pulse">
                  <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                  <span>LIVE</span>
                </div>
              )}

              {/* NFT Badge */}
              {video.nft.available && (
                <div className="absolute top-3 right-3 bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                  <Diamond size={12} />
                  <span>NFT</span>
                </div>
              )}

              {/* Duration */}
              <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs px-2 py-1 rounded">
                {video.duration}
              </div>
            </div>

            {/* Video Info */}
            <div className="p-4">
              <h3 className="text-white font-semibold line-clamp-2 group-hover:text-cyan-300 transition-colors mb-2">
                {video.title}
              </h3>

              <div className="flex items-center justify-between text-sm text-gray-400">
                <div className="flex items-center space-x-1">
                  <Eye size={14} />
                  <span>{video.views}</span>
                </div>
                <div className="flex items-center space-x-1 text-yellow-400">
                  <Coins size={14} />
                  <span>{video.earnings}</span>
                </div>
              </div>

              <div className="text-xs text-gray-500 mt-2">
                {video.timestamp}
              </div>

              {/* NFT Price */}
              {video.nft.available && (
                <div className="mt-3 p-2 bg-purple-500/20 rounded-lg border border-purple-400/30">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-purple-400">NFT Price:</span>
                    <span className="text-white font-bold">{video.nft.price}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}