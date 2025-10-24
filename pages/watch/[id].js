import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import SonicWalletConnect from '../../components/SonicWalletConnect';
import {
  ArrowLeft, Search, Menu, Mic, Video, Bell, User,
  ThumbsUp, ThumbsDown, Share, Save, MoreVertical,
  Play, Pause, Volume2, Maximize, Settings,
  Home as HomeIcon, Compass, PlaySquare, Library, Eye
} from 'lucide-react';

export default function WatchPage() {
  const router = useRouter();
  const { id } = router.query;
  const [isMobile, setIsMobile] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);

  const allVideos = [
    {
      id: '1',
      title: 'Build and Deploy a Modern YouTube Clone with React & Next.js | Full Course 2024',
      description: 'In this complete course, you will learn how to build a fully functional YouTube clone using React, Next.js, Tailwind CSS, and modern web development practices. We cover everything from setup to deployment.',
      thumbnail: '/thumbnails/1.jpg',
      videoUrl: '/videos/sample1.mp4',
      views: '152K',
      timestamp: '2 days ago',
      channel: {
        name: 'CodeWithHarry',
        id: 'codewithharry',
        avatar: '/avatars/1.jpg',
        subscribers: '1.2M',
        verified: true
      },
      duration: '28:15',
      likes: '15K',
      dislikes: '200'
    },
    {
      id: '2',
      title: 'Next.js 14 Full Course 2024 | Build and Deploy a Modern React App',
      thumbnail: '/thumbnails/2.jpg',
      views: '89K',
      timestamp: '1 week ago',
      channel: {
        name: 'WebDevSimplified',
        id: 'webdevsimplified',
        avatar: '/avatars/2.jpg',
        subscribers: '850K',
        verified: true
      },
      duration: '42:30'
    }
  ];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    if (id) {
      const video = allVideos.find(v => v.id === id);
      setCurrentVideo(video);
      setRelatedVideos(allVideos.filter(v => v.id !== id));
    }

    return () => window.removeEventListener('resize', checkMobile);
  }, [id]);

  if (!currentVideo) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  const mobileNavItems = [
    { icon: HomeIcon, label: 'Home' },
    { icon: Compass, label: 'Explore' },
    { icon: PlaySquare, label: 'Shorts' },
    { icon: Library, label: 'Subscriptions' },
    { icon: Library, label: 'Library' }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Head>
        <title>{currentVideo.title} - MyTube</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>

      <header className="flex items-center justify-between px-3 sm:px-4 py-3 bg-black border-b border-gray-800 sticky top-0 z-50">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-900 rounded-full transition-colors"
          >
            <ArrowLeft size={isMobile ? 20 : 24} />
          </button>
          {!isMobile && (
            <div className="flex items-center space-x-2 cursor-pointer">
              <div className="bg-red-600 text-white p-1 rounded">
                <Video size={20} />
              </div>
              <span className="text-xl font-bold">MyTube</span>
            </div>
          )}
        </div>

        {!isMobile && (
          <div className="flex items-center flex-1 max-w-2xl mx-8">
            <div className="flex w-full">
              <input
                type="text"
                placeholder="Search"
                className="w-full px-4 py-2 bg-black border border-gray-700 rounded-l-full focus:outline-none focus:border-blue-500 text-sm text-white placeholder-gray-500"
              />
              <button className="px-6 py-2 bg-gray-900 border border-l-0 border-gray-700 rounded-r-full hover:bg-gray-800 transition-colors">
                <Search size={20} />
              </button>
            </div>
            <button className="ml-4 p-2 bg-gray-900 rounded-full hover:bg-gray-800 transition-colors">
              <Mic size={20} />
            </button>
          </div>
        )}

        <div className="flex items-center space-x-3">
          {!isMobile && (
            <>
              <button className="p-2 hover:bg-gray-900 rounded-full transition-colors">
                <Video size={20} />
              </button>
              <button className="p-2 hover:bg-gray-900 rounded-full transition-colors">
                <Bell size={20} />
              </button>
            </>
          )}
          <SonicWalletConnect />
        </div>
      </header>

      <div className="flex flex-col lg:flex-row">
        <div className="flex-1 lg:pr-6">
          <div className="p-3 sm:p-4 lg:p-6">
            <div className="bg-gray-900 rounded-xl aspect-video mb-4 flex items-center justify-center relative">
              <div className="text-center">
                <div className="text-gray-500 text-lg mb-2">Video Player</div>
                <div className="text-gray-600 text-sm">Playing: {currentVideo.title}</div>
              </div>

              <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-70 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="text-white p-2 hover:bg-gray-700 rounded-full"
                  >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                  <div className="flex items-center space-x-3">
                    <button className="text-white p-2 hover:bg-gray-700 rounded-full">
                      <Volume2 size={20} />
                    </button>
                    <button className="text-white p-2 hover:bg-gray-700 rounded-full">
                      <Settings size={20} />
                    </button>
                    <button className="text-white p-2 hover:bg-gray-700 rounded-full">
                      <Maximize size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold mb-4">
              {currentVideo.title}
            </h1>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-gray-800">
              <div className="text-gray-400 text-sm mb-3 sm:mb-0">
                {currentVideo.views} views • {currentVideo.timestamp}
              </div>

              <div className="flex items-center justify-between sm:justify-start sm:space-x-2 lg:space-x-4 w-full sm:w-auto">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <button className="flex items-center space-x-1 sm:space-x-2 bg-gray-800 hover:bg-gray-700 px-3 py-2 sm:px-4 sm:py-2 rounded-full transition-colors flex-1 sm:flex-none justify-center">
                    <ThumbsUp size={16} className="sm:w-[18px] sm:h-[18px]" />
                    <span className="text-xs sm:text-sm">{currentVideo.likes}</span>
                  </button>
                  <button className="flex items-center space-x-1 sm:space-x-2 bg-gray-800 hover:bg-gray-700 px-3 py-2 sm:px-4 sm:py-2 rounded-full transition-colors flex-1 sm:flex-none justify-center">
                    <ThumbsDown size={16} className="sm:w-[18px] sm:h-[18px]" />
                    <span className="text-xs sm:text-sm">{currentVideo.dislikes}</span>
                  </button>
                </div>

                <div className="flex items-center space-x-1 sm:space-x-2">
                  <button className="flex items-center space-x-1 sm:space-x-2 bg-gray-800 hover:bg-gray-700 px-3 py-2 sm:px-4 sm:py-2 rounded-full transition-colors flex-1 sm:flex-none justify-center">
                    <Share size={16} className="sm:w-[18px] sm:h-[18px]" />
                    <span className="text-xs sm:text-sm hidden xs:inline">Share</span>
                  </button>
                  <button className="flex items-center space-x-1 sm:space-x-2 bg-gray-800 hover:bg-gray-700 px-3 py-2 sm:px-4 sm:py-2 rounded-full transition-colors flex-1 sm:flex-none justify-center">
                    <Save size={16} className="sm:w-[18px] sm:h-[18px]" />
                    <span className="text-xs sm:text-sm hidden xs:inline">Save</span>
                  </button>
                </div>

                <button className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full transition-colors flex-shrink-0">
                  <MoreVertical size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-800">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                  <User size={24} className="text-gray-400" />
                </div>
                <div>
                  <div
                    onClick={() => router.push(`/channel/${currentVideo.channel.id}`)}
                    className="flex items-center space-x-2 cursor-pointer hover:text-white transition-colors"
                  >
                    <h3 className="font-semibold text-lg">{currentVideo.channel.name}</h3>
                    {currentVideo.channel.verified && (
                      <span className="text-blue-400 text-sm">✓</span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm">{currentVideo.channel.subscribers} subscribers</p>
                </div>
              </div>
              <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full transition-colors font-semibold">
                Subscribe
              </button>
            </div>

            <div className="bg-gray-900 rounded-lg p-4 mb-6">
              <p className="text-gray-300 text-sm whitespace-pre-line">
                {currentVideo.description || 'No description available for this video.'}
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Comments</h3>
              <div className="space-y-4">
                <div className="text-gray-500 text-center py-8">
                  Comments feature coming soon...
                </div>
              </div>
            </div>
          </div>
        </div>

        {!isMobile && (
          <div className="lg:w-80 xl:w-96 p-4 lg:p-6">
            <h3 className="font-semibold text-lg mb-4">Up next</h3>
            <div className="space-y-4">
              {relatedVideos.map(video => (
                <div
                  key={video.id}
                  onClick={() => router.push(`/watch/${video.id}`)}
                  className="flex space-x-3 cursor-pointer group"
                >
                  <div className="flex-shrink-0 relative">
                    <div className="w-40 bg-gray-800 rounded-lg aspect-video flex items-center justify-center">
                      <span className="text-gray-500 text-xs">Thumbnail</span>
                    </div>
                    <div className="absolute bottom-1 right-1 bg-black bg-opacity-90 text-white text-xs px-1 py-0.5 rounded">
                      {video.duration}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm line-clamp-2 group-hover:text-blue-400 transition-colors mb-1">
                      {video.title}
                    </h4>
                    <p className="text-gray-400 text-xs mb-1">{video.channel.name}</p>
                    <div className="text-gray-400 text-xs">
                      {video.views} views • {video.timestamp}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 flex justify-around items-center py-3 z-50">
          {mobileNavItems.map((item, index) => (
            <button
              key={index}
              className="flex flex-col items-center justify-center space-y-1 flex-1"
            >
              <item.icon
                size={24}
                className={item.label === 'Home' ? "text-white" : "text-gray-500"}
              />
              <span className={`text-xs ${item.label === 'Home' ? "text-white" : "text-gray-500"}`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}