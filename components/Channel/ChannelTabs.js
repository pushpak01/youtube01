import { PlaySquare, Users, Info, Library } from 'lucide-react';

export default function ChannelTabs({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'videos', label: 'Videos', icon: PlaySquare, count: null },
    { id: 'community', label: 'Community', icon: Users, count: 24 },
    { id: 'playlists', label: 'Playlists', icon: Library, count: 12 },
    { id: 'about', label: 'About', icon: Info, count: null }
  ];

  return (
    <div className="border-b border-gray-700">
      <div className="flex space-x-8">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 transition-all font-medium ${
                activeTab === tab.id
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              <Icon size={20} />
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span className="bg-gray-600 text-gray-300 text-xs px-2 py-1 rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}