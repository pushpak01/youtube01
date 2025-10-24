import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Eye } from 'lucide-react';
import SonicWalletConnect from '../../components/SonicWalletConnect';
import {
  ArrowLeft, Search, Bell, User, Video, Users, Play,
  ThumbsUp, Share, Calendar, Globe, Twitter, Instagram
} from 'lucide-react';

export default function ChannelPage() {
  const router = useRouter();
  const { id } = router.query;
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState('videos'); // 'videos', 'about'
  const [channel, setChannel] = useState(null);
  const [channelVideos, setChannelVideos] = useState([]);

  // Mock channel data - In real app, you'd fetch this based on channel ID
  const mockChannels = {
    'codewithharry': {
      id: 'codewithharry',
      name: 'CodeWithHarry',
      description: 'Learn programming with easy-to-understand tutorials. Python, JavaScript, Web Development and more!',
      avatar: '/avatars/1.jpg',
      banner: '/banners/1.jpg',
      subscribers: '1.2M',
      totalVideos: '245',
      totalViews: '45M',
      joinDate: 'Mar 15, 2019',
      verified: true,
      links: {
        website: 'https://codewithharry.com',
        twitter: 'https://twitter.com/codewithharry',
        instagram: 'https://instagram.com/codewithharry'
      }
    },
    'traversymedia': {
      id: 'traversymedia',
      name: 'Traversy Media',
      description: 'Web development and programming tutorials for all levels. Focusing on modern technologies and best practices.',
      avatar: '/avatars/3.jpg',
      banner: '/banners/3.jpg',
      subscribers: '2.1M',
      totalVideos: '890',
      totalViews: '210M',
      joinDate: 'Jan 5, 2015',
      verified: true,
      links: {
        website: 'https://traversymedia.com',
        twitter: 'https://twitter.com/traversymedia'
      }
    },
    'thenetninja': {
      id: 'thenetninja',
      name: 'The Net Ninja',
      description: 'Full-stack web development tutorials. React, Vue, Node.js, Firebase and much more!',
      avatar: '/avatars/4.jpg',
      banner: '/banners/4.jpg',
      subscribers: '850K',
      totalVideos: '420',
      totalViews: '68M',
      joinDate: 'Jun 20, 2017',
      verified: false,
      links: {
        website: 'https://thenetninja.co.uk'
      }
    }
  };

  // Mock videos data
  const allVideos = [
    {
      id: '1',
      title: 'Build and Deploy a Modern YouTube Clone with React & Next.js',
      thumbnail: '/thumbnails/1.jpg',
      views: '152K',
      timestamp: '2 days ago',
      channel: 'CodeWithHarry',
      channelId: 'codewithharry',
      duration: '28:15',
      likes: '15K'
    },
    {
      id: '2',
      title: 'Python Django Full Course for Beginners | Build 3 Projects',
      thumbnail: '/thumbnails/6.jpg',
      views: '95K',
      timestamp: '4 days ago',
      channel: 'CodeWithHarry',
      channelId: 'codewithharry',
      duration: '2:15:40',
      likes: '8.2K'
    },
    {
      id: '3',
      title: 'Learn Tailwind CSS in 1 Hour - Complete Crash Course 2024',
      thumbnail: '/thumbnails/3.jpg',
      views: '210K',
      timestamp: '3 days ago',
      channel: 'Traversy Media',
      channelId: 'traversymedia',
      duration: '1:05:22',
      likes: '12K'
    },
    {
      id: '4',
      title: 'JavaScript Modern Features You Must Know in 2024 - ES6+',
      thumbnail: '/thumbnails/4.jpg',
      views: '120K',
      timestamp: '5 days ago',
      channel: 'The Net Ninja',
      channelId: 'thenetninja',
      duration: '35:47',
      likes: '6.5K'
    },
    {
      id: '5',
      title: 'React TypeScript Tutorial - Build a Portfolio Website',
      thumbnail: '/thumbnails/8.jpg',
      views: '64K',
      timestamp: '3 weeks ago',
      channel: 'CodeWithHarry',
      channelId: 'codewithharry',
      duration: '38:12',
      likes: '4.2K'
    },
    {
      id: '6',
      title: 'Node.js Backend Development - REST API with Express',
      thumbnail: '/thumbnails/10.jpg',
      views: '85K',
      timestamp: '3 days ago',
      channel: 'Traversy Media',
      channelId: 'traversymedia',
      duration: '1:15:30',
      likes: '7.8K'
    }
  ];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Load channel data and videos when ID changes
    if (id && mockChannels[id]) {
      setChannel(mockChannels[id]);
      // Filter videos for this channel
      const videos = allVideos.filter(video => video.channelId === id);
      setChannelVideos(videos);
    }

    return () => window.removeEventListener('resize', checkMobile);
  }, [id]);

  if (!channel) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div>Channel not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Head>
        <title>{channel.name} - MyTube</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>

            {/* Header */}
      <header className="flex items-center justify-between px-3 sm:px-4 py-3 bg-black border-b border-gray-800 sticky top-0 z-50">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-900 rounded-full transition-colors"
          >
            <ArrowLeft size={isMobile ? 20 : 24} />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
              <Video size={16} className="text-white" />
            </div>
            {!isMobile && <span className="text-lg font-bold">MyTube</span>}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button className="p-2 hover:bg-gray-900 rounded-full transition-colors">
            <Search size={20} />
          </button>
          <button className="p-2 hover:bg-gray-900 rounded-full transition-colors">
            <Bell size={20} />
          </button>
          {/* ADD WALLET CONNECT HERE */}
          <SonicWalletConnect />
        </div>
      </header>

      {/* Channel Banner */}
      <div className="relative">
        <div className="h-32 sm:h-48 bg-gradient-to-r from-purple-600 to-blue-600"></div>

        {/* Channel Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 sm:p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-end space-y-4 sm:space-y-0 sm:space-x-6">
              {/* Channel Avatar */}
              <div className="w-20 h-20 sm:w-32 sm:h-32 bg-gray-700 rounded-full border-4 border-black flex items-center justify-center">
                <User size={isMobile ? 24 : 32} className="text-gray-400" />
              </div>

              {/* Channel Details */}
              <div className="flex-1 text-white">
                <div className="flex items-center space-x-2 mb-2">
                  <h1 className="text-xl sm:text-3xl font-bold">{channel.name}</h1>
                  {channel.verified && (
                    <span className="text-blue-400 text-sm sm:text-base">✓</span>
                  )}
                </div>
                <div className="flex flex-wrap items-center space-x-4 text-sm sm:text-base text-gray-300">
                  <span>@{channel.id}</span>
                  <span>{channel.subscribers} subscribers</span>
                  <span>{channel.totalVideos} videos</span>
                </div>
              </div>

              {/* Subscribe Button */}
              <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-semibold transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-800 bg-black sticky top-14 z-40">
        <div className="max-w-6xl mx-auto">
          <div className="flex">
            <button
              onClick={() => setActiveTab('videos')}
              className={`px-4 sm:px-6 py-3 font-medium transition-colors border-b-2 ${
                activeTab === 'videos'
                  ? 'text-white border-white'
                  : 'text-gray-400 border-transparent hover:text-white'
              }`}
            >
              VIDEOS
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`px-4 sm:px-6 py-3 font-medium transition-colors border-b-2 ${
                activeTab === 'about'
                  ? 'text-white border-white'
                  : 'text-gray-400 border-transparent hover:text-white'
              }`}
            >
              ABOUT
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4 sm:p-6">
        {activeTab === 'videos' && (
          <VideosTab videos={channelVideos} isMobile={isMobile} />
        )}

        {activeTab === 'about' && (
          <AboutTab channel={channel} />
        )}
      </main>
    </div>
  );
}

// Videos Tab Component
function VideosTab({ videos, isMobile }) {
  const router = useRouter();

  if (videos.length === 0) {
    return (
      <div className="text-center py-16">
        <Video size={64} className="text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-400 mb-2">No videos yet</h3>
        <p className="text-gray-500">This channel hasn't uploaded any videos.</p>
      </div>
    );
  }

  return (
    <div className={isMobile ? "space-y-4" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"}>
      {videos.map(video => (
        <div
          key={video.id}
          onClick={() => router.push(`/watch/${video.id}`)}
          className="cursor-pointer group"
        >
          {/* Thumbnail */}
          <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden mb-3">
            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center">
              <span className="text-gray-400 text-sm">Thumbnail</span>
            </div>
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-1.5 py-0.5 rounded">
              {video.duration}
            </div>
          </div>

          {/* Video Info */}
          <div className="flex space-x-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm line-clamp-2 group-hover:text-blue-400 transition-colors mb-1 text-white">
                {video.title}
              </h3>
              <div className="flex items-center text-gray-400 text-xs space-x-2">
                <span>{video.views} views</span>
                <span>•</span>
                <span>{video.timestamp}</span>
              </div>
              <div className="flex items-center text-gray-400 text-xs mt-1">
                <ThumbsUp size={12} className="mr-1" />
                <span>{video.likes}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// About Tab Component
function AboutTab({ channel }) {
  return (
    <div className="space-y-6 max-w-3xl">
      {/* Channel Description */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
        <p className="text-gray-300 leading-relaxed">
          {channel.description}
        </p>
      </div>

      {/* Channel Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <Users size={24} className="text-red-400 mx-auto mb-2" />
          <div className="text-white font-semibold">{channel.subscribers}</div>
          <div className="text-gray-400 text-sm">Subscribers</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <Play size={24} className="text-blue-400 mx-auto mb-2" />
          <div className="text-white font-semibold">{channel.totalVideos}</div>
          <div className="text-gray-400 text-sm">Videos</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <Eye size={24} className="text-green-400 mx-auto mb-2" />
          <div className="text-white font-semibold">{channel.totalViews}</div>
          <div className="text-gray-400 text-sm">Total Views</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <Calendar size={24} className="text-yellow-400 mx-auto mb-2" />
          <div className="text-white font-semibold">{channel.joinDate}</div>
          <div className="text-gray-400 text-sm">Joined</div>
        </div>
      </div>

      {/* Links */}
      {channel.links && Object.keys(channel.links).length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Links</h3>
          <div className="space-y-2">
            {channel.links.website && (
              <a href={channel.links.website} target="_blank" rel="noopener noreferrer"
                 className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors">
                <Globe size={16} />
                <span>Website</span>
              </a>
            )}
            {channel.links.twitter && (
              <a href={channel.links.twitter} target="_blank" rel="noopener noreferrer"
                 className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors">
                <Twitter size={16} />
                <span>Twitter</span>
              </a>
            )}
            {channel.links.instagram && (
              <a href={channel.links.instagram} target="_blank" rel="noopener noreferrer"
                 className="flex items-center space-x-2 text-pink-400 hover:text-pink-300 transition-colors">
                <Instagram size={16} />
                <span>Instagram</span>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


