// pages/profile/[address].js
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useWallet } from '../../context/WalletContext';
import ParticleBackground from '../../components/ui/ParticleBackground';
import {
  LogOut,
  User,
  Video,
  Award,
  Link,
  Calendar,
  ExternalLink,
  Eye,
  Coins,
  Share2,
  Copy,
  CheckCircle,
  Sparkles,
  Megaphone,
  Film,
  Wallet
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { address } = router.query;
  const { walletAddress, disconnectWallet, isConnected } = useWallet();

  const [profile, setProfile] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [selectedRole, setSelectedRole] = useState('user');

  useEffect(() => {
    if (address) {
      loadProfile();
    }
  }, [address]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError('');

      await new Promise(resolve => setTimeout(resolve, 800));

      const response = await fetch('/api/profile/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: address })
      });

      const { exists, profileData: apiProfileData, error: apiError } = await response.json();

      if (!exists) {
        setError('Profile not found');
        return;
      }

      if (apiError) {
        setError(apiError);
        return;
      }

      setProfile(apiProfileData);
      setProfileData(apiProfileData);

    } catch (error) {
      console.error('❌ Error loading profile:', error);
      setError('Failed to load profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setShowDisconnectModal(false);
    router.push('/');
  };

  const copyAddress = async () => {
    await navigator.clipboard.writeText(address);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const shareProfile = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profileData?.nickname || 'Anonymous'} Profile`,
          text: `Check out ${profileData?.nickname || 'Anonymous'}'s profile on SonicVision`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      copyAddress();
    }
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setShowRoleSelector(false);
    console.log(`Role selected: ${role}`);
  };

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
  };

  const isOwnProfile = isConnected && walletAddress?.toLowerCase() === address?.toLowerCase();

  const getRoleBadgeStyle = () => {
    switch (selectedRole) {
      case 'advertiser':
        return 'bg-blue-500/20 text-blue-400 border-blue-400/30';
      case 'creator':
        return 'bg-purple-500/20 text-purple-400 border-purple-400/30';
      default:
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-400/30';
    }
  };

  const getRoleDisplay = () => {
    switch (selectedRole) {
      case 'advertiser':
        return {
          text: 'Advertiser',
          icon: <Megaphone size={14} />,
          color: 'blue'
        };
      case 'creator':
        return {
          text: 'Creator',
          icon: <Film size={14} />,
          color: 'purple'
        };
      default:
        return {
          text: 'User',
          icon: <User size={14} />,
          color: 'cyan'
        };
    }
  };

  const currentRole = getRoleDisplay();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800 relative">
        <ParticleBackground />
        <div className="cyber-grid opacity-20 pointer-events-none"></div>

        <div className="relative z-10 max-w-6xl mx-auto p-6">
          <div className="card-holographic p-8 mb-8 animate-pulse">
            <div className="flex items-center space-x-6">
              <div className="w-32 h-32 bg-gray-700 rounded-full"></div>
              <div className="flex-1">
                <div className="h-8 bg-gray-700 rounded-lg w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-700 rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          </div>

          <div className="card-holographic p-8 animate-pulse">
            <div className="h-6 bg-gray-700 rounded w-1/4 mb-6"></div>
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-700 rounded-xl mb-4"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800 flex items-center justify-center p-6 relative">
        <ParticleBackground />
        <div className="cyber-grid opacity-20 pointer-events-none"></div>

        <div className="text-center max-w-md relative z-10">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30">
            <User size={32} className="text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Profile Not Found</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-neon-blue"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800 text-white relative">
      <ParticleBackground />
      <div className="cyber-grid opacity-20 pointer-events-none fixed inset-0"></div>
      <div className="animated-gradient-bg fixed inset-0 z-0"></div>

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto p-6">
          {/* Profile Header */}
          <div className="card-holographic p-8 mb-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-1000"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 animate-pulse"></div>

            <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-6 lg:space-y-0">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  {profileData?.profilePicture ? (
                    <>
                      <div className="relative overflow-hidden rounded-full">
                        <img
                          src={profileData.profilePicture}
                          alt="Profile"
                          className="w-32 h-32 rounded-full object-cover border-4 border-cyan-400 shadow-2xl shadow-cyan-400/30 transition-all duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 mix-blend-overlay rounded-full"></div>
                      </div>
                      <div className="absolute inset-0 bg-cyan-400 rounded-full blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500 -z-10"></div>
                    </>
                  ) : (
                    <div className="relative">
                      <div className="w-32 h-32 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center border-4 border-cyan-400 shadow-2xl shadow-cyan-400/30 group-hover:shadow-cyan-400/40 transition-all duration-500 group-hover:scale-105">
                        <User size={42} className="text-white" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-br from-green-500/15 to-emerald-500/15 mix-blend-overlay rounded-full"></div>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h1 className="text-5xl font-bold text-gradient-rainbow font-cyber">
                      {profileData?.nickname || 'Anonymous'}
                    </h1>
                    {isOwnProfile && (
                      <span className="px-4 py-2 bg-cyan-500/20 text-cyan-400 text-sm font-medium rounded-full border border-cyan-400/30 shadow-neon-blue">
                        <Sparkles size={16} className="inline mr-1" />
                        You
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-4 mt-4">
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Calendar size={18} className="text-cyan-400" />
                      <span>
                        Joined {profile.createdAt ? new Date(Number(profile.createdAt) * 1000).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : 'Unknown'}
                      </span>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getRoleBadgeStyle()}`}>
                      <div className="flex items-center space-x-1">
                        {currentRole.icon}
                        <span>{currentRole.text}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {isOwnProfile && (
                  <div className="relative">
                    <button
                      onClick={() => setShowRoleSelector(!showRoleSelector)}
                      className="flex items-center space-x-2 px-5 py-3 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 rounded-xl transition-all duration-300 hover:scale-105 text-cyan-400 hover:text-cyan-300 hover:shadow-neon-blue group"
                    >
                      <Award size={18} className="group-hover:scale-110 transition-transform" />
                      <span>Role</span>
                    </button>

                    {showRoleSelector && (
                      <div className="absolute top-full right-0 mt-2 w-72 card-holographic p-3 border border-cyan-400/30 rounded-xl z-50 animate-scale-in">
                        <div className="text-sm text-cyan-400 font-medium mb-3 px-2">Select Your Role</div>
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            onClick={() => handleRoleSelect('user')}
                            className={`p-3 rounded-lg border transition-all duration-300 flex flex-col items-center space-y-2 ${
                              selectedRole === 'user'
                                ? 'bg-cyan-500/20 border-cyan-400/50 shadow-neon-blue'
                                : 'bg-gray-700/30 border-gray-600/30 hover:border-cyan-400/30 hover:bg-cyan-500/10'
                            }`}
                          >
                            <div className={`p-2 rounded-full ${
                              selectedRole === 'user' ? 'bg-cyan-500/20' : 'bg-gray-600/30'
                            }`}>
                              <User size={20} className={
                                selectedRole === 'user' ? 'text-cyan-400' : 'text-gray-400'
                              } />
                            </div>
                            <span className={
                              selectedRole === 'user' ? 'text-cyan-400 font-medium' : 'text-gray-300'
                            }>
                              User
                            </span>
                            <span className="text-xs text-gray-400 text-center">
                              Watch content
                            </span>
                          </button>

                          <button
                            onClick={() => handleRoleSelect('advertiser')}
                            className={`p-3 rounded-lg border transition-all duration-300 flex flex-col items-center space-y-2 ${
                              selectedRole === 'advertiser'
                                ? 'bg-blue-500/20 border-blue-400/50 shadow-neon-blue'
                                : 'bg-gray-700/30 border-gray-600/30 hover:border-blue-400/30 hover:bg-blue-500/10'
                            }`}
                          >
                            <div className={`p-2 rounded-full ${
                              selectedRole === 'advertiser' ? 'bg-blue-500/20' : 'bg-gray-600/30'
                            }`}>
                              <Megaphone size={20} className={
                                selectedRole === 'advertiser' ? 'text-blue-400' : 'text-gray-400'
                              } />
                            </div>
                            <span className={
                              selectedRole === 'advertiser' ? 'text-blue-400 font-medium' : 'text-gray-300'
                            }>
                              Advertiser
                            </span>
                            <span className="text-xs text-gray-400 text-center">
                              Promote brand
                            </span>
                          </button>

                          <button
                            onClick={() => handleRoleSelect('creator')}
                            className={`p-3 rounded-lg border transition-all duration-300 flex flex-col items-center space-y-2 ${
                              selectedRole === 'creator'
                                ? 'bg-purple-500/20 border-purple-400/50 shadow-neon-purple'
                                : 'bg-gray-700/30 border-gray-600/30 hover:border-purple-400/30 hover:bg-purple-500/10'
                            }`}
                          >
                            <div className={`p-2 rounded-full ${
                              selectedRole === 'creator' ? 'bg-purple-500/20' : 'bg-gray-600/30'
                            }`}>
                              <Film size={20} className={
                                selectedRole === 'creator' ? 'text-purple-400' : 'text-gray-400'
                              } />
                            </div>
                            <span className={
                              selectedRole === 'creator' ? 'text-purple-400 font-medium' : 'text-gray-300'
                            }>
                              Creator
                            </span>
                            <span className="text-xs text-gray-400 text-center">
                              Create content
                            </span>
                          </button>
                        </div>
                        <div className="absolute -top-2 right-4 w-4 h-4 bg-cyan-400/20 border-l border-t border-cyan-400/50 transform rotate-45"></div>
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={shareProfile}
                  className="flex items-center space-x-2 px-5 py-3 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600 rounded-xl transition-all duration-300 hover:scale-105 text-gray-300 hover:text-white hover:shadow-neon-blue group"
                >
                  <Share2 size={18} className="group-hover:scale-110 transition-transform" />
                  <span>Share</span>
                </button>

                {isOwnProfile && (
                  <button
                    onClick={() => setShowDisconnectModal(true)}
                    className="flex items-center space-x-2 px-5 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-xl transition-all duration-300 hover:scale-105 text-red-400 hover:text-red-300 hover:shadow-neon-pink group"
                  >
                    <LogOut size={18} className="group-hover:scale-110 transition-transform" />
                    <span>Disconnect</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="card-holographic p-2 mb-6">
            <div className="flex space-x-1">
              {[
                { id: 'overview', label: 'Overview', icon: Eye },
                { id: 'activity', label: 'Activity', icon: Video },
                { id: 'rewards', label: 'Rewards', icon: Coins },
                { id: 'wallet', label: 'Wallet', icon: Wallet }
              ].map(tab => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-4 px-6 rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/25'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                    }`}
                  >
                    <IconComponent size={18} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="card-holographic p-8">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {profileData?.bio && (
                  <div>
                    <h3 className="text-2xl font-bold mb-6 flex items-center space-x-3 text-cyan-400">
                      <User size={24} />
                      <span>About</span>
                    </h3>
                    <p className="text-cyan-200 leading-relaxed text-lg bg-gray-900/30 p-6 rounded-2xl border border-cyan-400/20">
                      {profileData.bio}
                    </p>
                  </div>
                )}

                <div>
                  <h3 className="text-2xl font-bold mb-6 flex items-center space-x-3 text-cyan-400">
                    <Award size={24} />
                    <span>
                      {selectedRole === 'user'
                        ? 'User Dashboard'
                        : selectedRole === 'advertiser'
                        ? 'Advertising Dashboard'
                        : 'Creator Studio'
                      }
                    </span>
                  </h3>
                  <div className="bg-gray-900/30 p-6 rounded-2xl border border-cyan-400/20">
                    {selectedRole === 'user' ? (
                      <div className="text-cyan-200">
                        <p className="text-lg mb-4">Welcome to your User Dashboard!</p>
                        <ul className="space-y-2 text-gray-300">
                          <li>• Watch and discover amazing content</li>
                          <li>• Earn rewards for watching videos</li>
                          <li>• Build your watch history</li>
                          <li>• Explore trending videos</li>
                        </ul>
                      </div>
                    ) : selectedRole === 'advertiser' ? (
                      <div className="text-cyan-200">
                        <p className="text-lg mb-4">Welcome to your Advertising Dashboard!</p>
                        <ul className="space-y-2 text-gray-300">
                          <li>• Create and manage ad campaigns</li>
                          <li>• Track ad performance metrics</li>
                          <li>• Reach your target audience</li>
                          <li>• Maximize your advertising ROI</li>
                        </ul>
                      </div>
                    ) : (
                      <div className="text-cyan-200">
                        <p className="text-lg mb-4">Welcome to your Creator Studio!</p>
                        <ul className="space-y-2 text-gray-300">
                          <li>• Upload and manage your content</li>
                          <li>• Track video performance analytics</li>
                          <li>• Engage with your audience</li>
                          <li>• Monetize your creative work</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {profileData?.watchHistory && profileData.watchHistory.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-bold mb-6 flex items-center space-x-3 text-blue-400">
                      <Eye size={24} />
                      <span>Recent Activity</span>
                    </h3>
                    <div className="space-y-4">
                      {profileData.watchHistory.slice(0, 3).map((watch, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-6 bg-gray-700/30 rounded-2xl border border-gray-600/30 hover:border-cyan-400/30 transition-all duration-300 group hover:scale-[1.02]"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                              <Video size={24} className="text-white" />
                            </div>
                            <div>
                              <div className="font-bold text-white text-lg">Video #{watch.videoId}</div>
                              <div className="text-sm text-gray-400">
                                {new Date(watch.watchedAt * 1000).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="text-green-400 font-bold text-xl flex items-center space-x-2">
                            <Coins size={20} />
                            <span>+{watch.rewardsEarned} S</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'activity' && (
              <div>
                <h3 className="text-2xl font-bold mb-8 flex items-center space-x-3 text-blue-400">
                  <Video size={24} />
                  <span>Watch History</span>
                </h3>

                {profileData?.watchHistory && profileData.watchHistory.length > 0 ? (
                  <div className="space-y-4">
                    {profileData.watchHistory.map((watch, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-6 bg-gray-700/30 rounded-2xl border border-gray-600/30 hover:border-blue-400/30 transition-all duration-300 group hover:scale-[1.02]"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                            <Video size={28} className="text-white" />
                          </div>
                          <div>
                            <div className="font-bold text-white text-xl">Video #{watch.videoId}</div>
                            <div className="text-gray-400">
                              Watched on {new Date(watch.watchedAt * 1000).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-green-400 font-bold text-2xl flex items-center space-x-2 justify-end">
                            <Coins size={24} />
                            <span>+{watch.rewardsEarned} S</span>
                          </div>
                          <div className="text-sm text-gray-400 mt-1">Rewards Earned</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-600">
                      <Video size={40} className="text-gray-500" />
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-3">No Activity Yet</h4>
                    <p className="text-gray-400 max-w-md mx-auto text-lg">
                      {isOwnProfile
                        ? "You haven't watched any videos yet. Start exploring content to earn rewards!"
                        : "This user hasn't watched any videos yet."
                      }
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'rewards' && (
              <div>
                <h3 className="text-2xl font-bold mb-8 flex items-center space-x-3 text-green-400">
                  <Coins size={24} />
                  <span>Rewards Earned</span>
                </h3>

                <div className="grid grid-cols-1 gap-6">
                  <div className="card-holographic p-8 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-400/30">
                    <div className="flex items-center space-x-6 mb-4">
                      <div className="p-4 bg-green-500/20 rounded-2xl">
                        <Coins size={32} className="text-green-400" />
                      </div>
                      <div>
                        <div className="text-gray-400 text-lg mb-2">Total Rewards Earned</div>
                        <div className="text-4xl font-bold text-green-400">
                          {profileData.totalRewardsEarned || '0'} S
                        </div>
                      </div>
                    </div>
                    <div className="text-gray-400 text-sm">
                      Total rewards earned from watching videos on SonicVision
                    </div>
                  </div>
                </div>

                {profileData?.watchHistory && profileData.watchHistory.length > 0 && (
                  <div className="mt-8">
                    <h4 className="text-xl font-bold mb-6 text-cyan-400">Recent Rewards</h4>
                    <div className="space-y-4">
                      {profileData.watchHistory.slice(0, 5).map((watch, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-5 bg-gray-700/30 rounded-2xl border border-gray-600/30 hover:border-green-400/30 transition-all duration-300"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                              <Video size={20} className="text-green-400" />
                            </div>
                            <div>
                              <div className="font-semibold text-white">Video #{watch.videoId}</div>
                              <div className="text-sm text-gray-400">
                                {new Date(watch.watchedAt * 1000).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="text-green-400 font-bold text-xl">
                            +{watch.rewardsEarned} S
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'wallet' && (
              <div className="space-y-8">
                {/* Wallet Address Section */}
                <div>
                  <h3 className="text-2xl font-bold mb-6 flex items-center space-x-3 text-cyan-400">
                    <Wallet size={24} />
                    <span>Wallet Address</span>
                  </h3>

                  <div className="bg-gray-900/30 p-6 rounded-2xl border border-cyan-400/20">
                    <div className="relative">
                      <code className="bg-gray-800/50 px-4 py-4 rounded-xl text-sm break-all border border-gray-700 font-mono backdrop-blur-sm block">
                        {address}
                      </code>

                      <button
                        onClick={copyAddress}
                        className="absolute top-3 right-3 p-2 bg-cyan-500/20 hover:bg-cyan-500/30 rounded-lg transition-all duration-200 hover:scale-110 border border-cyan-400/50"
                        title="Copy address"
                      >
                        {copiedAddress ? (
                          <CheckCircle size={18} className="text-green-400" />
                        ) : (
                          <Copy size={18} className="text-cyan-400" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <span className="text-sm text-gray-400">
                        {copiedAddress ? 'Copied!' : formatAddress(address)}
                      </span>
                      <button
                        onClick={() => window.open(`https://testnet.sonicscan.org/address/${address}`, '_blank')}
                        className="flex items-center space-x-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors group"
                      >
                        <span>View on Explorer</span>
                        <ExternalLink size={16} className="group-hover:scale-110 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Disconnect Modal */}
      {showDisconnectModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="card-holographic max-w-md w-full p-8 border border-red-500/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-3xl"></div>

            <div className="text-center relative z-10">
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/30">
                <LogOut size={32} className="text-red-400" />
              </div>

              <h3 className="text-2xl font-bold text-white mb-3">Disconnect Wallet?</h3>
              <p className="text-gray-400 mb-8 leading-relaxed">
                You will be signed out of your wallet connection. Don't worry, your profile and data will be saved. You can reconnect anytime.
              </p>

              <div className="flex space-x-4">
                <button
                  onClick={() => setShowDisconnectModal(false)}
                  className="flex-1 py-4 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 border border-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDisconnect}
                  className="flex-1 py-4 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2 border border-red-500/50"
                >
                  <LogOut size={20} />
                  <span>Disconnect</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}