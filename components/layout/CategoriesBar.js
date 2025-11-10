export default function CategoriesBar({ isMobile }) {
  const categories = ['All', '🔥 Trending', '🎮 Gaming', '🎵 Music', '💎 NFTs', '🚀 DeFi', '🌌 Metaverse', '📚 Tutorials', '🎤 Live', '💫 AMA'];

  return (
    <div className={`
      flex space-x-4 overflow-x-auto scrollbar-glow px-8 py-6
      ${isMobile ? 'sticky top-20 bg-dark-900/80 backdrop-blur-4xl z-30' : ''}
    `}>
      {categories.map((category, index) => (
        <button
          key={index}
          className="flex-shrink-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 hover:from-cyan-500/20 hover:to-purple-500/20 px-6 py-4 rounded-2xl transition-all duration-300 hover:scale-110 text-white font-bold border-2 border-cyan-400/30 hover:border-cyan-400 shadow-neon-blue hover:shadow-neon-purple group"
        >
          <span className="text-gradient-rainbow group-hover:animate-pulse">
            {category}
          </span>
        </button>
      ))}
    </div>
  );
}