import { useRouter } from 'next/router';
import { Eye, Clock, Users } from 'lucide-react';

export default function RelatedVideos({ videos, currentVideoId }) {
  const router = useRouter();

  const handleVideoClick = (videoId) => {
    router.push(`/watch/${videoId}`);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-white mb-4">Related Videos</h3>

      {videos.map((video) => (
        <div
          key={video.id}
          onClick={() => handleVideoClick(video.id)}
          className="flex space-x-3 p-3 bg-dark-800/50 hover:bg-dark-700/70 rounded-2xl cursor-pointer transition-all duration-300 border border-cyan-400/10 hover:border-cyan-400/30 group"
        >
          {/* Thumbnail */}
          <div className="relative flex-shrink-0">
            <div className="w-24 h-16 bg-gradient-to-br from-cyan-900/30 to-purple-900/30 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              {video.isLive ? (
                <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold animate-pulse">
                  LIVE
                </div>
              ) : (
                <div className="text-cyan-400 text-xs">PREVIEW</div>
              )}
            </div>
            <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
              {video.duration}
            </div>
          </div>

          {/* Video Info */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-cyan-300 transition-colors">
              {video.title}
            </h4>
            <p className="text-xs text-gray-400 mt-1">{video.channel}</p>
            <div className="flex items-center space-x-2 text-xs text-gray-400 mt-1">
              <div className="flex items-center space-x-1">
                <Eye size={12} />
                <span>{video.views}</span>
              </div>
              <span>•</span>
              <span>{video.timestamp}</span>
            </div>
          </div>
        </div>
      ))}

      {/* Load More */}
      <button className="w-full py-3 bg-dark-700/50 hover:bg-dark-600/50 text-cyan-400 rounded-2xl transition-colors border border-cyan-400/20 text-sm font-medium">
        Load More Videos
      </button>
    </div>
  );
}