import { Globe, Twitter, MessageCircle, ExternalLink, Coins, Users, Eye, Calendar } from 'lucide-react';

export default function AboutTab({ channel }) {
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

  const getSocialIcon = (platform) => {
    switch (platform) {
      case 'twitter':
        return <Twitter size={18} />;
      case 'discord':
        return <MessageCircle size={18} />;
      case 'website':
        return <Globe size={18} />;
      case 'telegram':
        return <MessageCircle size={18} />;
      case 'instagram':
        return <Globe size={18} />;
      case 'opensea':
        return <ExternalLink size={18} />;
      default:
        return <Globe size={18} />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Channel Description */}
      <div className="lg:col-span-2">
        <div className="bg-dark-800/50 backdrop-blur-lg rounded-3xl p-6 border border-cyan-400/20">
          <h3 className="text-xl font-bold text-white mb-4">Description</h3>
          <p className="text-gray-300 whitespace-pre-line leading-relaxed">
            {channel.description}
          </p>

          {/* Tags */}
          <div className="mt-6">
            <h4 className="text-lg font-semibold text-white mb-3">Tags & Interests</h4>
            <div className="flex flex-wrap gap-2">
              {channel.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-2 bg-cyan-500/20 text-cyan-400 rounded-xl text-sm border border-cyan-400/30 hover:bg-cyan-500/30 transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Channel Stats & Links */}
      <div className="space-y-6">
        {/* Stats */}
        <div className="bg-dark-800/50 backdrop-blur-lg rounded-3xl p-6 border border-cyan-400/20">
          <h3 className="text-xl font-bold text-white mb-4">Channel Stats</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Users size={20} className="text-cyan-400" />
                <span className="text-gray-300">Subscribers</span>
              </div>
              <span className="text-white font-bold">{formatNumber(parseInt(channel.subscribers))}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Eye size={20} className="text-purple-400" />
                <span className="text-gray-300">Total Views</span>
              </div>
              <span className="text-white font-bold">{formatNumber(channel.totalViews)}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Coins size={20} className="text-yellow-400" />
                <span className="text-gray-300">Total Earnings</span>
              </div>
              <span className="text-white font-bold">{channel.earnings}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Calendar size={20} className="text-green-400" />
                <span className="text-gray-300">Joined</span>
              </div>
              <span className="text-white font-bold">{formatDate(channel.joinedDate)}</span>
            </div>
          </div>
        </div>

        {/* Social Links */}
        {Object.keys(channel.socialLinks).length > 0 && (
          <div className="bg-dark-800/50 backdrop-blur-lg rounded-3xl p-6 border border-cyan-400/20">
            <h3 className="text-xl font-bold text-white mb-4">Links</h3>
            <div className="space-y-3">
              {Object.entries(channel.socialLinks).map(([platform, url]) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 bg-dark-700 hover:bg-gray-600 rounded-2xl transition-colors group"
                >
                  {getSocialIcon(platform)}
                  <span className="text-gray-300 group-hover:text-white capitalize">
                    {platform}
                  </span>
                  <ExternalLink size={14} className="text-gray-400 ml-auto" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}