import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import SonicWalletConnect from '../components/SonicWalletConnect';
import {
  Search, Menu, Mic, Video, Bell, User, Home as HomeIcon, Compass,
  PlaySquare, Library, History, Clock, ThumbsUp, Flame,
  Music2, GamepadIcon, Clapperboard, Newspaper, Trophy,
  Lightbulb, Shirt, Podcast, Youtube
} from 'lucide-react';

export default function YouTubeHome() {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();

  // Reliable mobile detection
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const mockVideos = [
    {
      id: '1',
      title: 'Build and Deploy a Modern YouTube Clone with React & Next.js | Full Course 2024',
      thumbnail: '/thumbnails/1.jpg',
      views: '152K',
      timestamp: '2 days ago',
      channel: 'CodeWithHarry',
      channelId: 'codewithharry',
      duration: '28:15',
      verified: true
    },
    {
      id: '2',
      title: 'Next.js 14 Full Course 2024 | Build and Deploy a Modern React App',
      thumbnail: '/thumbnails/2.jpg',
      views: '89K',
      timestamp: '1 week ago',
      channel: 'WebDevSimplified',
      channelId: 'webdevsimplified',
      duration: '42:30',
      verified: true
    },
    {
      id: '3',
      title: 'Learn Tailwind CSS in 1 Hour - Complete Crash Course 2024',
      thumbnail: '/thumbnails/3.jpg',
      views: '210K',
      timestamp: '3 days ago',
      channel: 'Traversy Media',
      duration: '1:05:22',
      verified: true
    },
    {
      id: '4',
      title: 'JavaScript Modern Features You Must Know in 2024 - ES6+',
      thumbnail: '/thumbnails/4.jpg',
      views: '120K',
      timestamp: '5 days ago',
      channel: 'The Net Ninja',
      duration: '35:47',
      verified: false
    },
    {
      id: '5',
      title: 'Building a Real-Time Chat App with Socket.io & React | Full Tutorial',
      thumbnail: '/thumbnails/5.jpg',
      views: '75K',
      timestamp: '2 weeks ago',
      channel: 'JavaScript Mastery',
      duration: '51:18',
      verified: true
    },
    {
      id: '6',
      title: 'Python Django Full Course for Beginners | Build 3 Projects',
      thumbnail: '/thumbnails/6.jpg',
      views: '95K',
      timestamp: '4 days ago',
      channel: 'FreeCodeCamp',
      duration: '2:15:40',
      verified: true
    },
    {
      id: '7',
      title: 'How to Become a Frontend Developer in 2024 - Complete Roadmap',
      thumbnail: '/thumbnails/7.jpg',
      views: '180K',
      timestamp: '1 day ago',
      channel: 'Programming with Mosh',
      duration: '22:33',
      verified: true
    },
    {
      id: '8',
      title: 'React TypeScript Tutorial - Build a Portfolio Website',
      thumbnail: '/thumbnails/8.jpg',
      views: '64K',
      timestamp: '3 weeks ago',
      channel: 'Theo - t3.gg',
      duration: '38:12',
      verified: false
    },
    {
      id: '9',
      title: 'Master CSS Grid Layout - Complete Tutorial for Beginners',
      thumbnail: '/thumbnails/9.jpg',
      views: '110K',
      timestamp: '1 week ago',
      channel: 'CSS Tricks',
      duration: '45:20',
      verified: true
    },
    {
      id: '10',
      title: 'Node.js Backend Development - REST API with Express',
      thumbnail: '/thumbnails/10.jpg',
      views: '85K',
      timestamp: '3 days ago',
      channel: 'Academind',
      duration: '1:15:30',
      verified: true
    },
    {
      id: '11',
      title: 'React Native Mobile App Development - Full Course',
      thumbnail: '/thumbnails/11.jpg',
      views: '95K',
      timestamp: '2 weeks ago',
      channel: 'ProgrammingHero',
      duration: '2:30:15',
      verified: false
    },
    {
      id: '12',
      title: 'Web Performance Optimization - Speed Up Your Website',
      thumbnail: '/thumbnails/12.jpg',
      views: '70K',
      timestamp: '5 days ago',
      channel: 'WebDev',
      duration: '38:45',
      verified: true
    }
  ];

  const desktopSidebarItems = [
    { icon: HomeIcon, label: 'Home' },
    { icon: Compass, label: 'Explore' },
    { icon: PlaySquare, label: 'Shorts' },
    { icon: Library, label: 'Subscriptions' },
    { icon: History, label: 'History' },
    { icon: Clock, label: 'Watch Later' },
    { icon: ThumbsUp, label: 'Liked Videos' }
  ];

  const mobileNavItems = [
    { icon: HomeIcon, label: 'Home', active: true },
    { icon: Compass, label: 'Explore', active: false },
    { icon: PlaySquare, label: 'Shorts', active: false },
    { icon: Library, label: 'Subscriptions', active: false },
    { icon: Library, label: 'Library', active: false }
  ];

  const exploreItems = [
    { icon: Flame, label: 'Trending' },
    { icon: Music2, label: 'Music' },
    { icon: GamepadIcon, label: 'Gaming' },
    { icon: Clapperboard, label: 'Movies & TV' },
    { icon: Newspaper, label: 'News' },
    { icon: Trophy, label: 'Sports' },
    { icon: Lightbulb, label: 'Learning' },
    { icon: Shirt, label: 'Fashion & Beauty' },
    { icon: Podcast, label: 'Podcasts' }
  ];

  return (
    <div className="min-h-screen bg-black text-white youtube-dark">
      <Head>
        <title>MyTube - YouTube Clone</title>
        <meta name="description" content="YouTube clone built with Next.js" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>

      {/* Header */}
      <header className="flex items-center justify-between px-3 sm:px-4 py-3 bg-black border-b border-gray-800 sticky top-0 z-50">
        {/* Left Section */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {!isMobile && (
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-900 rounded-full transition-colors"
            >
              <Menu size={isMobile ? 20 : 24} />
            </button>
          )}
          <div className="flex items-center space-x-2 cursor-pointer">
            <Youtube size={isMobile ? 24 : 28} className="text-red-600" />
            {!isMobile && (
              <span className="text-xl font-bold text-white">MyTube</span>
            )}
          </div>
        </div>

        {/* Search Section */}
        {!isMobile ? (
          <form onSubmit={(e) => {
            e.preventDefault();
            const searchInput = e.target.querySelector('input[type="text"]');
            if (searchInput.value.trim()) {
              router.push(`/search?q=${encodeURIComponent(searchInput.value)}`);
            }
          }} className="flex items-center flex-1 max-w-2xl mx-4 lg:mx-8">
            <div className="flex w-full">
              <input
                type="text"
                placeholder="Search"
                className="w-full px-4 py-2 bg-black border border-gray-700 rounded-l-full focus:outline-none focus:border-blue-500 text-sm text-white placeholder-gray-500"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-gray-900 border border-l-0 border-gray-700 rounded-r-full hover:bg-gray-800 transition-colors"
              >
                <Search size={20} />
              </button>
            </div>
            <button
              type="button"
              className="ml-4 p-2 bg-gray-900 rounded-full hover:bg-gray-800 transition-colors"
            >
              <Mic size={20} />
            </button>
          </form>
        ) : (
          <button
            onClick={() => router.push('/search')}
            className="p-2 hover:bg-gray-900 rounded-full transition-colors"
          >
            <Search size={24} />
          </button>
        )}

        {/* Right Section */}
        <div className="flex items-center space-x-2 sm:space-x-3">
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

      <div className="flex">
        {/* Desktop Sidebar */}
        {!isMobile && sidebarOpen && (
          <aside className="w-64 bg-black h-[calc(100vh-64px)] overflow-y-auto sticky top-16 border-r border-gray-800">
            <div className="p-2">
              {desktopSidebarItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-900 cursor-pointer transition-colors mb-1"
                >
                  <item.icon size={20} className="mr-4" />
                  <span className="text-sm">{item.label}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-800 my-2"></div>

            <div className="p-2">
              <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Explore</h3>
              {exploreItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-900 cursor-pointer transition-colors mb-1"
                >
                  <item.icon size={20} className="mr-4" />
                  <span className="text-sm">{item.label}</span>
                </div>
              ))}
            </div>
          </aside>
        )}

        {/* Main Content - FIXED MOBILE SIZE */}
        <main className={`${isMobile ? 'pb-20 w-full' : 'flex-1'}`}>
          {/* Categories Bar */}
          <div className={`flex space-x-2 overflow-x-auto scrollbar-hide ${
            isMobile ? 'px-3 py-3 sticky top-14 bg-black z-40' : 'p-6 pb-4'
          }`}>
            {['All', 'Music', 'Gaming', 'Live', 'React', 'JavaScript', 'Next.js', 'Programming', 'Comedy', 'Recently uploaded'].map((category) => (
              <button
                key={category}
                className={`flex-shrink-0 bg-gray-900 hover:bg-gray-800 rounded-full transition-colors text-white ${
                  isMobile ? 'px-3 py-2 text-xs' : 'px-3 py-1.5 text-sm'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Video Grid - FIXED MOBILE SIZE */}
          <div className={`
            ${isMobile
              ? 'space-y-4 px-3 pb-4 w-full'
              : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6'
            }
          `}>
            {mockVideos.map(video => (
              <div
                key={video.id}
                className={isMobile ? 'w-full' : 'cursor-pointer group'}
                onClick={() => router.push(`/watch/${video.id}`)}
              >
                {/* Thumbnail */}
                <div className={`
                  relative bg-gray-900 rounded-xl overflow-hidden
                  ${isMobile ? 'aspect-video w-full mb-2' : 'aspect-video mb-3'}
                `}>
                  <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-700 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">Thumbnail</span>
                  </div>
                  <div className={`
                    absolute bg-black bg-opacity-90 text-white rounded
                    ${isMobile ? 'bottom-1 right-1 text-xs px-1 py-0.5' : 'bottom-2 right-2 text-xs px-1.5 py-0.5'}
                  `}>
                    {video.duration}
                  </div>
                </div>

                {/* Video Info */}
                <div className={`
                  flex
                  ${isMobile ? 'space-x-2 w-full' : 'space-x-3'}
                `}>
                  <div className="flex-shrink-0">
                    <div className={`
                      bg-gray-800 rounded-full flex items-center justify-center
                      ${isMobile ? 'w-8 h-8' : 'w-10 h-10'}
                    `}>
                      <User size={isMobile ? 14 : 18} className="text-gray-500" />
                    </div>
                  </div>
                  <div className={`
                    flex-1
                    ${isMobile ? 'min-w-0 w-full' : 'min-w-0'}
                  `}>
                    <h3 className={`
                      font-medium line-clamp-2 text-white
                      ${isMobile ? 'text-sm leading-tight mb-1' : 'text-base group-hover:text-blue-400 transition-colors mb-1'}
                    `}>
                      {video.title}
                    </h3>
                    <p
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent video click
                        router.push(`/channel/${video.channelId}`);
                      }}
                      className="text-gray-400 text-sm flex items-center cursor-pointer hover:text-white transition-colors"
                    >
                      {video.channel}
                      {video.verified && (
                        <span className="ml-1 text-blue-400">✓</span>
                      )}
                    </p>
                    <div className="text-gray-400 text-sm">
                      {video.views} views • {video.timestamp}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 flex justify-around items-center py-3 z-50">
          {mobileNavItems.map((item, index) => (
            <button
              key={index}
              className="flex flex-col items-center justify-center space-y-1 flex-1"
            >
              <item.icon
                size={24}
                className={item.active ? "text-white" : "text-gray-500"}
              />
              <span className={`text-xs ${item.active ? "text-white" : "text-gray-500"}`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}