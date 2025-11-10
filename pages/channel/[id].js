import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Head from 'next/head';

// Components
import ChannelHeader from '../../components/channel/ChannelHeader';
import ChannelTabs from '../../components/channel/ChannelTabs';
import VideoGrid from '../../components/channel/VideoGrid';
import AboutTab from '../../components/channel/AboutTab';
import CommunityTab from '../../components/channel/CommunityTab';
import PlaylistsTab from '../../components/channel/PlaylistsTab';
import ConnectionStatus from '../../components/ConnectionStatus';
import ParticleBackground from '../../components/ui/ParticleBackground';

// Mock data (replace with actual API calls)
const mockChannels = {
  'web3innovators': {
    id: 'web3innovators',
    name: 'Web3 Innovators',
    description: 'Building the future of decentralized media and Web3 technologies. Tutorials, live coding, and insights into blockchain development.',
    avatar: '/avatars/1.jpg',
    banner: '/banners/1.jpg',
    subscribers: '125K',
    videos: '89',
    isVerified: true,
    isLive: false,
    joinedDate: '2023-01-15',
    totalViews: '2.4M',
    earnings: '45,230 SONIC',
    socialLinks: {
      twitter: 'https://twitter.com/web3innovators',
      website: 'https://web3innovators.com',
      discord: 'https://discord.gg/web3innovators'
    },
    tags: ['Web3', 'Blockchain', 'Tutorials', 'Development', 'Sonic'],
    isSubscribed: false
  },
  'cryptomasters': {
    id: 'cryptomasters',
    name: 'Crypto Masters',
    description: 'Live trading, market analysis, and deep dives into cryptocurrency projects. Join us daily for live streams and expert insights.',
    avatar: '/avatars/2.jpg',
    banner: '/banners/2.jpg',
    subscribers: '89K',
    videos: '156',
    isVerified: true,
    isLive: true,
    joinedDate: '2022-08-22',
    totalViews: '1.8M',
    earnings: '32,150 SONIC',
    socialLinks: {
      twitter: 'https://twitter.com/cryptomasters',
      telegram: 'https://t.me/cryptomasters',
      website: 'https://cryptomasters.io'
    },
    tags: ['Crypto', 'Trading', 'Live', 'Analysis', 'DeFi'],
    isSubscribed: false
  },
  'nftcreatorpro': {
    id: 'nftcreatorpro',
    name: 'NFT Creator Pro',
    description: 'Everything about NFT creation, minting, and marketing. From beginner guides to advanced techniques for successful NFT projects.',
    avatar: '/avatars/3.jpg',
    banner: '/banners/3.jpg',
    subscribers: '156K',
    videos: '234',
    isVerified: true,
    isLive: false,
    joinedDate: '2023-03-10',
    totalViews: '3.7M',
    earnings: '78,450 SONIC',
    socialLinks: {
      twitter: 'https://twitter.com/nftcreatorpro',
      instagram: 'https://instagram.com/nftcreatorpro',
      opensea: 'https://opensea.io/nftcreatorpro'
    },
    tags: ['NFT', 'Art', 'Minting', 'Collections', 'Marketplace'],
    isSubscribed: false
  }
};

const mockVideos = {
  'web3innovators': [
    {
      id: '1',
      title: 'Building the Future of Decentralized Media on Sonic Blockchain',
      views: '152K',
      timestamp: '2 hours ago',
      duration: '28:15',
      thumbnail: '/thumbnails/1.jpg',
      isLive: false,
      earnings: '2,450 SONIC',
      nft: { available: true, price: '0.5 ETH' }
    },
    {
      id: '2',
      title: 'Smart Contract Development - Complete Beginner Guide',
      views: '98K',
      timestamp: '3 days ago',
      duration: '45:22',
      thumbnail: '/thumbnails/2.jpg',
      isLive: false,
      earnings: '1,890 SONIC',
      nft: { available: false }
    },
    {
      id: '3',
      title: 'Live: Q&A Session - Sonic Blockchain Updates',
      views: '67K',
      timestamp: '1 week ago',
      duration: '1:15:30',
      thumbnail: '/thumbnails/3.jpg',
      isLive: true,
      earnings: '3,210 SONIC',
      nft: { available: true, price: '0.2 ETH' }
    }
  ],
  'cryptomasters': [
    {
      id: '4',
      title: 'Live: Bitcoin Price Analysis & Trading Strategy',
      views: '45K',
      timestamp: 'LIVE NOW',
      duration: 'LIVE',
      thumbnail: '/thumbnails/4.jpg',
      isLive: true,
      earnings: '1,560 SONIC',
      nft: { available: false }
    },
    {
      id: '5',
      title: 'SONIC Token Deep Dive - Investment Potential',
      views: '78K',
      timestamp: '1 day ago',
      duration: '32:18',
      thumbnail: '/thumbnails/5.jpg',
      isLive: false,
      earnings: '2,340 SONIC',
      nft: { available: true, price: '0.3 ETH' }
    }
  ],
  'nftcreatorpro': [
    {
      id: '6',
      title: 'Creating Your First NFT Collection - Step by Step',
      views: '210K',
      timestamp: '2 days ago',
      duration: '38:45',
      thumbnail: '/thumbnails/6.jpg',
      isLive: false,
      earnings: '4,210 SONIC',
      nft: { available: true, price: '0.1 ETH' }
    },
    {
      id: '7',
      title: 'NFT Marketing Strategies That Actually Work',
      views: '134K',
      timestamp: '1 week ago',
      duration: '29:12',
      thumbnail: '/thumbnails/7.jpg',
      isLive: false,
      earnings: '3,150 SONIC',
      nft: { available: false }
    }
  ]
};

const mockCommunityPosts = [
  {
    id: 1,
    user: {
      name: 'BlockchainBuddy',
      avatar: '/avatars/user1.jpg',
      isVerified: true
    },
    text: 'Just implemented the smart contract tutorial from last week - worked perfectly! Thanks for the great content! 🚀',
    timestamp: '2 hours ago',
    likes: 24,
    comments: 8,
    tips: '5 SONIC'
  },
  {
    id: 2,
    user: {
      name: 'Web3Wizard',
      avatar: '/avatars/user2.jpg',
      isVerified: false
    },
    text: 'Can we get a tutorial on integrating Sonic with React applications? That would be super helpful!',
    timestamp: '5 hours ago',
    likes: 18,
    comments: 12,
    tips: '2 SONIC'
  }
];

const mockPlaylists = [
  {
    id: 1,
    title: 'Sonic Blockchain Masterclass',
    videoCount: 12,
    thumbnail: '/thumbnails/playlist1.jpg',
    views: '450K'
  },
  {
    id: 2,
    title: 'Web3 Development Series',
    videoCount: 8,
    thumbnail: '/thumbnails/playlist2.jpg',
    views: '320K'
  },
  {
    id: 3,
    title: 'Live Coding Sessions',
    videoCount: 15,
    thumbnail: '/thumbnails/playlist3.jpg',
    views: '890K'
  }
];

export default function ChannelPage() {
  const router = useRouter();
  const { id } = router.query;
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [activeTab, setActiveTab] = useState('videos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      // Simulate API calls
      setLoading(true);
      setTimeout(() => {
        const channelData = mockChannels[id];
        const channelVideos = mockVideos[id] || [];

        if (channelData) {
          setChannel(channelData);
          setVideos(channelVideos);
          setError(null);
        } else {
          setError('Channel not found');
        }
        setLoading(false);
      }, 1000);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cyan-400 text-lg">Loading channel...</p>
        </div>
      </div>
    );
  }

  if (error || !channel) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-white mb-2">Channel Not Found</h1>
          <p className="text-gray-400 mb-6">The channel you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-2xl transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'videos':
        return <VideoGrid videos={videos} />;
      case 'about':
        return <AboutTab channel={channel} />;
      case 'community':
        return <CommunityTab posts={mockCommunityPosts} channelId={channel.id} />;
      case 'playlists':
        return <PlaylistsTab playlists={mockPlaylists} />;
      default:
        return <VideoGrid videos={videos} />;
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 text-white">
      <Head>
        <title>{channel.name} - SonicVision</title>
        <meta name="description" content={channel.description} />
        <meta property="og:title" content={channel.name} />
        <meta property="og:description" content={channel.description} />
        <meta property="og:image" content={channel.avatar} />
      </Head>

      <ParticleBackground />
      <div className="fixed inset-0 cyber-grid opacity-20 pointer-events-none z-1"></div>

      {/* Channel Header */}
      <ChannelHeader channel={channel} />

      {/* Channel Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Tabs Navigation */}
        <ChannelTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab Content */}
        <div className="mt-6">
          {renderTabContent()}
        </div>
      </div>

      <ConnectionStatus />
    </div>
  );
}