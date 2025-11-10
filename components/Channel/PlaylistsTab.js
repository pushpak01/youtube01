import { useRouter } from 'next/router';
import { Play, List, Eye, Lock } from 'lucide-react';

export default function PlaylistsTab({ playlists }) {
  const router = useRouter();

  const handlePlaylistClick = (playlistId) => {
    router.push(`/playlist/${playlistId}`);
  };

  if (playlists.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📚</div>
        <h3 className="text-xl font-bold text-white mb-2">No Playlists Yet</h3>
        <p className="text-gray-400">This channel hasn't created any playlists.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {playlists.map((playlist) => (
        <div
          key={playlist.id}
          onClick={() => handlePlaylistClick(playlist.id)}
          className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
        >
          <div className="bg-dark-800/50 backdrop-blur-lg rounded-3xl border border-cyan-400/20 overflow-hidden hover:border-cyan-400/50 transition-all duration-300 card-holographic">
            {/* Playlist Thumbnail */}
            <div className="relative aspect-video bg-gradient-to-br from-cyan-900/30 to-purple-900/30 flex items-center justify-center">
              {/* Playlist Icon Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
                  <Play size={24} className="text-white" fill="white" />
                </div>
              </div>

              {/* Video Count */}
              <div className="absolute bottom-3 left-3 bg-black/80 text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
                <List size={12} />
                <span>{playlist.videoCount} videos</span>
              </div>

              {/* Views */}
              <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
                <Eye size={12} />
                <span>{playlist.views}</span>
              </div>

              {/* Private Badge */}
              {playlist.isPrivate && (
                <div className="absolute top-3 right-3 bg-gray-600 text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
                  <Lock size={12} />
                  <span>Private</span>
                </div>
              )}
            </div>

            {/* Playlist Info */}
            <div className="p-4">
              <h3 className="text-white font-semibold line-clamp-2 group-hover:text-cyan-300 transition-colors mb-2">
                {playlist.title}
              </h3>

              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>{playlist.videoCount} videos</span>
                <span>{playlist.views} views</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}