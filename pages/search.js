import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import SonicWalletConnect from '../components/SonicWalletConnect';
import {
  Search, ArrowLeft, Filter, User, Clock,
  Home as HomeIcon, Compass, PlaySquare, Library
} from 'lucide-react';

export default function SearchPage() {
  const router = useRouter();
  const { q } = router.query; // Get search query from URL
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState(q || '');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock search data - In real app, you'd fetch from API
  const allVideos = [
    {
      id: '1',
      title: 'Build and Deploy a Modern YouTube Clone with React & Next.js',
      description: 'Learn how to build a complete YouTube clone using React, Next.js, and Tailwind CSS',
      thumbnail: '/thumbnails/1.jpg',
      views: '152K',
      timestamp: '2 days ago',
      channel: 'CodeWithHarry',
      duration: '28:15',
      verified: true
    },
    {
      id: '2',
      title: 'Next.js 14 Full Course 2024 | Build and Deploy a Modern React App',
      description: 'Complete Next.js tutorial for beginners to advanced developers',
      thumbnail: '/thumbnails/2.jpg',
      views: '89K',
      timestamp: '1 week ago',
      channel: 'WebDevSimplified',
      duration: '42:30',
      verified: true
    },
    {
      id: '3',
      title: 'Learn Tailwind CSS in 1 Hour - Complete Crash Course 2024',
      description: 'Master Tailwind CSS quickly with this comprehensive tutorial',
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
      description: 'Latest JavaScript features and ES6+ syntax every developer should know',
      thumbnail: '/thumbnails/4.jpg',
      views: '120K',
      timestamp: '5 days ago',
      channel: 'The Net Ninja',
      duration: '35:47',
      verified: false
    },
    {
      id: '5',
      title: 'React Hooks Tutorial - useState, useEffect, useContext',
      description: 'Complete guide to React Hooks for modern React development',
      thumbnail: '/thumbnails/5.jpg',
      views: '95K',
      timestamp: '2 weeks ago',
      channel: 'Programming with Mosh',
      duration: '45:20',
      verified: true
    },
    {
      id: '6',
      title: 'Node.js Backend Development - REST API with Express',
      description: 'Build RESTful APIs with Node.js, Express, and MongoDB',
      thumbnail: '/thumbnails/6.jpg',
      views: '75K',
      timestamp: '3 days ago',
      channel: 'Academind',
      duration: '1:15:30',
      verified: true
    }
  ];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Perform search when query changes
    if (q) {
      performSearch(q);
    }

    return () => window.removeEventListener('resize', checkMobile);
  }, [q]);

  const performSearch = (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const results = allVideos.filter(video =>
        video.title.toLowerCase().includes(query.toLowerCase()) ||
        video.description.toLowerCase().includes(query.toLowerCase()) ||
        video.channel.toLowerCase().includes(query.toLowerCase())
      );

      setSearchResults(results);
      setLoading(false);
    }, 500);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

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
        <title>{q ? `${q} - Search` : 'Search'} - MyTube</title>
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
          {!isMobile && (
            <div className="flex items-center space-x-2 cursor-pointer">
              <div className="bg-red-600 text-white p-1 rounded">
                <PlaySquare size={20} />
              </div>
              <span className="text-xl font-bold">MyTube</span>
            </div>
          )}
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex items-center flex-1 max-w-2xl mx-4 lg:mx-8">
          <div className="flex w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search MyTube"
              className="w-full px-4 py-2 bg-black border border-gray-700 rounded-l-full focus:outline-none focus:border-blue-500 text-sm text-white placeholder-gray-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-gray-900 border border-l-0 border-gray-700 rounded-r-full hover:bg-gray-800 transition-colors"
            >
              <Search size={20} />
            </button>
          </div>
        </form>

        <div className="flex items-center space-x-3">
          {!isMobile && (
            <>
              <button className="p-2 hover:bg-gray-900 rounded-full transition-colors">
                <Filter size={20} />
              </button>
            </>
          )}
          <SonicWalletConnect />
        </div>
      </header>

      <main className={`${isMobile ? 'pb-20' : 'p-6'}`}>
        {/* Search Results */}
        <div className="max-w-6xl mx-auto">
          {/* Search Header */}
          {q && (
            <div className="px-4 sm:px-6 py-4 border-b border-gray-800">
              <h1 className="text-xl font-semibold">
                Search results for "{q}"
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                {loading ? 'Searching...' : `${searchResults.length} results found`}
              </p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
          )}

          {/* Search Results Grid */}
          {!loading && searchResults.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 sm:p-6">
              {searchResults.map(video => (
                <div
                  key={video.id}
                  onClick={() => router.push(`/watch/${video.id}`)}
                  className="flex flex-col sm:flex-row cursor-pointer group hover:bg-gray-900 rounded-xl p-3 transition-colors"
                >
                  {/* Thumbnail */}
                  <div className="flex-shrink-0 relative mb-3 sm:mb-0 sm:mr-4">
                    <div className="w-full sm:w-60 bg-gray-800 rounded-lg aspect-video flex items-center justify-center">
                      <span className="text-gray-500 text-sm">Thumbnail</span>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-90 text-white text-xs px-1.5 py-0.5 rounded">
                      {video.duration}
                    </div>
                  </div>

                  {/* Video Info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-blue-400 transition-colors mb-2">
                      {video.title}
                    </h3>

                    <div className="flex items-center text-gray-400 text-sm mb-2">
                      <span>{video.views} views</span>
                      <span className="mx-2">•</span>
                      <span>{video.timestamp}</span>
                    </div>

                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                        <User size={16} className="text-gray-400" />
                      </div>
                      <div
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/channel/${video.channelId}`);
                          }}
                          className="flex items-center space-x-1 cursor-pointer hover:text-white transition-colors"
                        >
                          <span className="text-sm text-gray-300">{video.channel}</span>
                          {video.verified && (
                            <span className="text-blue-400 text-xs">✓</span>
                          )}
                      </div>
                    </div>

                    <p className="text-gray-400 text-sm line-clamp-2">
                      {video.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && q && searchResults.length === 0 && (
            <div className="text-center py-16 px-4">
              <div className="max-w-md mx-auto">
                <Search size={64} className="mx-auto text-gray-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No results found</h3>
                <p className="text-gray-400 mb-6">
                  Try different keywords or check your spelling
                </p>
                <button
                  onClick={() => router.push('/')}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full transition-colors"
                >
                  Browse Videos
                </button>
              </div>
            </div>
          )}

          {/* Empty State - No search yet */}
          {!q && !loading && (
            <div className="text-center py-16 px-4">
              <div className="max-w-md mx-auto">
                <Search size={64} className="mx-auto text-gray-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Search MyTube</h3>
                <p className="text-gray-400">
                  Find your favorite videos, channels, and creators
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 flex justify-around items-center py-3 z-50">
          {mobileNavItems.map((item, index) => (
            <button
              key={index}
              className="flex flex-col items-center justify-center space-y-1 flex-1"
              onClick={() => {
                if (item.label === 'Home') router.push('/');
              }}
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