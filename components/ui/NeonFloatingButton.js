import { useState } from 'react';
import { Rocket, Coins, Video, Sparkles } from 'lucide-react';

export default function NeonFloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { icon: Rocket, label: 'Go Live', color: 'from-green-400 to-cyan-400', glow: 'shadow-neon-green' },
    { icon: Coins, label: 'Earn Tokens', color: 'from-yellow-400 to-orange-400', glow: 'shadow-neon-pink' },
    { icon: Video, label: 'Upload', color: 'from-purple-400 to-pink-400', glow: 'shadow-neon-purple' },
  ];

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Action Buttons */}
      <div className={`flex flex-col items-end space-y-4 mb-4 transition-all duration-500 ${
        isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-50 pointer-events-none'
      }`}>
        {actions.map((action, index) => (
          <button
            key={index}
            className={`flex items-center space-x-3 bg-gradient-to-r ${action.color} text-white px-6 py-4 rounded-2xl ${action.glow} transform hover:scale-110 transition-all duration-300 animate-pulse-glow group`}
          >
            <span className="text-sm font-bold whitespace-nowrap text-black">{action.label}</span>
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
              <action.icon size={20} className="text-white" />
            </div>
          </button>
        ))}
      </div>

      {/* Main FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-20 h-20 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-400 rounded-2xl flex items-center justify-center shadow-neon-pink transform hover:scale-110 transition-all duration-300 group animate-float-3d relative overflow-hidden"
      >
        <Sparkles size={28} className={`transform transition-transform duration-500 ${isOpen ? 'rotate-180 scale-110' : 'rotate-0'} text-white`} />

        {/* Animated border */}
        <div className="absolute inset-0 border-2 border-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-400 rounded-2xl animate-spin-3d opacity-70"></div>
      </button>
    </div>
  );
}