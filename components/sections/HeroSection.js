import { Sparkles } from 'lucide-react';

export default function HeroSection() {
  return (
    <div className="px-8 mb-12">
      <div className="bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl p-12 border-2 border-cyan-400/20 backdrop-blur-4xl relative overflow-hidden card-holographic">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-5xl font-bold text-gradient-rainbow animate-gradient-flow mb-4">
                Welcome to SonicVision
              </h1>
              <p className="text-cyan-300 text-xl mb-2">The future of decentralized media is here</p>
              <p className="text-purple-300">Watch, Create, and Earn in the Web3 Universe</p>
            </div>
            <div className="flex items-center space-x-3 text-yellow-400 animate-pulse-glow">
              <Sparkles size={32} />
              <span className="text-2xl font-bold">Community Picks</span>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center p-6 bg-dark-800/50 rounded-2xl backdrop-blur-sm border border-cyan-400/20">
              <div className="text-3xl font-bold text-cyan-400 mb-2">1.2M+</div>
              <div className="text-cyan-300">Active Users</div>
            </div>
            <div className="text-center p-6 bg-dark-800/50 rounded-2xl backdrop-blur-sm border border-purple-400/20">
              <div className="text-3xl font-bold text-purple-400 mb-2">45K+</div>
              <div className="text-purple-300">Content Creators</div>
            </div>
            <div className="text-center p-6 bg-dark-800/50 rounded-2xl backdrop-blur-sm border border-pink-400/20">
              <div className="text-3xl font-bold text-pink-400 mb-2">2.5M</div>
              <div className="text-pink-300">SONIC Earned</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}