import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Head from 'next/head';

// Components
import VideoPlayer from '../../components/watch/VideoPlayer';
import VideoInfo from '../../components/watch/VideoInfo';
import CommentsSection from '../../components/watch/CommentsSection';
import RelatedVideos from '../../components/watch/RelatedVideos';
import ConnectionStatus from '../../components/ConnectionStatus';
import ParticleBackground from '../../components/ui/ParticleBackground';

// Mock data (replace with actual API calls)
const mockVideoData = {
  '1': {
    id: '1',
    title: 'Building the Future of Decentralized Media on Sonic Blockchain - Live Demo & Tutorial',
    description: 'Learn how to build and deploy decentralized media applications on the Sonic blockchain. This comprehensive tutorial covers everything from smart contracts to frontend integration.',
    views: '152K',
    timestamp: '2 hours ago',
    duration: '28:15',
    channel: {
      id: 'web3innovators',
      name: 'Web3 Innovators',
      avatar: '/avatars/1.jpg',
      subscribers: '125K',
      isVerified: true,
      isSubscribed: false
    },
    likes: '12.4K',
    dislikes: '234',
    comments: '2.1K',
    tags: ['web3', 'blockchain', 'tutorial', 'sonic', 'decentralized'],
    category: 'Education',
    earnings: '2,450 SONIC',
    nft: {
      available: true,
      price: '0.5 ETH',
      supply: 100
    },
    streamUrl: '/videos/sample.mp4',
    thumbnail: '/thumbnails/1.jpg'
  },
  '2': {
    id: '2',
    title: 'Live: SONIC Token Mining & Staking Strategies 2024 - Earn Passive Income',
    description: 'Join us live as we explore the best SONIC token mining and staking strategies for 2024. Learn how to maximize your passive income in the Sonic ecosystem.',
    views: '89K',
    timestamp: 'LIVE NOW',
    duration: 'LIVE',
    channel: {
      id: 'cryptomasters',
      name: 'Crypto Masters',
      avatar: '/avatars/2.jpg',
      subscribers: '89K',
      isVerified: true,
      isSubscribed: false
    },
    likes: '8.7K',
    dislikes: '156',
    comments: '1.2K',
    tags: ['live', 'mining', 'staking', 'sonic', 'crypto'],
    category: 'Live Stream',
    earnings: '1,890 SONIC',
    nft: {
      available: false,
      price: null,
      supply: 0
    },
    streamUrl: '/videos/live.mp4',
    thumbnail: '/thumbnails/2.jpg',
    isLive: true
  },
  '3': {
    id: '3',
    title: 'Creating Your First NFT Video Collection - Complete Step by Step Guide',
    description: 'Complete guide to creating and minting your first NFT video collection on the Sonic blockchain. Learn about metadata, smart contracts, and marketplace integration.',
    views: '210K',
    timestamp: '1 day ago',
    duration: '45:22',
    channel: {
      id: 'nftcreatorpro',
      name: 'NFT Creator Pro',
      avatar: '/avatars/3.jpg',
      subscribers: '156K',
      isVerified: true,
      isSubscribed: false
    },
    likes: '18.9K',
    dislikes: '321',
    comments: '3.4K',
    tags: ['nft', 'tutorial', 'minting', 'collection', 'web3'],
    category: 'NFT',
    earnings: '4,210 SONIC',
    nft: {
      available: true,
      price: '0.1 ETH',
      supply: 500
    },
    streamUrl: '/videos/nft-guide.mp4',
    thumbnail: '/thumbnails/3.jpg'
  }
};

const mockRelatedVideos = [
  {
    id: '4',
    title: 'Sonic Blockchain: Complete Developer Guide 2024',
    channel: 'Web3 Devs',
    views: '98K',
    timestamp: '3 days ago',
    duration: '32:45',
    thumbnail: '/thumbnails/4.jpg',
    isLive: false
  },
  {
    id: '5',
    title: 'Live: Building dApps on Sonic - Q&A Session',
    channel: 'Sonic Official',
    views: '45K',
    timestamp: 'LIVE NOW',
    duration: 'LIVE',
    thumbnail: '/thumbnails/5.jpg',
    isLive: true
  },
  {
    id: '6',
    title: 'NFT Video Marketplace Tutorial - Sonic Platform',
    channel: 'NFT Masters',
    views: '67K',
    timestamp: '1 week ago',
    duration: '28:12',
    thumbnail: '/thumbnails/6.jpg',
    isLive: false
  }
];

export default function WatchPage() {
  const router = useRouter();
  const { id } = router.query;
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      // Simulate API call
      setLoading(true);
      setTimeout(() => {
        const videoData = mockVideoData[id];
        if (videoData) {
          setVideo(videoData);
          setError(null);
        } else {
          setError('Video not found');
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
          <p className="text-cyan-400 text-lg">Loading video...</p>
        </div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-white mb-2">Video Not Found</h1>
          <p className="text-gray-400 mb-6">The video you're looking for doesn't exist.</p>
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

  return (
    <div className="min-h-screen bg-dark-950 text-white">
      <Head>
        <title>{video.title} - SonicVision</title>
        <meta name="description" content={video.description} />
        <meta property="og:title" content={video.title} />
        <meta property="og:description" content={video.description} />
        <meta property="og:image" content={video.thumbnail} />
      </Head>

      <ParticleBackground />
      <div className="fixed inset-0 cyber-grid opacity-20 pointer-events-none z-1"></div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Video Player and Info - 3/4 width */}
          <div className="lg:col-span-3 space-y-6">
            {/* Video Player */}
            <VideoPlayer video={video} />

            {/* Video Information */}
            <VideoInfo video={video} />

            {/* Comments Section */}
            <CommentsSection videoId={video.id} />
          </div>

          {/* Related Videos - 1/4 width */}
          <div className="lg:col-span-1">
            <RelatedVideos videos={mockRelatedVideos} currentVideoId={video.id} />
          </div>
        </div>
      </div>

      <ConnectionStatus />
    </div>
  );
}