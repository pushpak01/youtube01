import { useState } from 'react';
import { Heart, MessageCircle, Share, Coins, Send, Users } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';

export default function CommunityTab({ posts, channelId }) {
  const [communityPosts, setCommunityPosts] = useState(posts);
  const [newPost, setNewPost] = useState('');
  const { isConnected, walletAddress } = useWallet();

  const handleLikePost = (postId) => {
    if (!isConnected) {
      alert('Please connect your wallet to like posts');
      return;
    }

    setCommunityPosts(communityPosts.map(post =>
      post.id === postId
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  const handleAddPost = () => {
    if (!newPost.trim()) return;

    if (!isConnected) {
      alert('Please connect your wallet to post');
      return;
    }

    const post = {
      id: communityPosts.length + 1,
      user: {
        name: 'You',
        avatar: '/avatars/default.jpg',
        isVerified: false
      },
      text: newPost,
      timestamp: 'Just now',
      likes: 0,
      comments: 0,
      tips: '0 SONIC'
    };

    setCommunityPosts([post, ...communityPosts]);
    setNewPost('');
  };

  const handleTipPost = (postId) => {
    if (!isConnected) {
      alert('Please connect your wallet to tip posts');
      return;
    }
    // Implement tip functionality
    console.log(`Tipping post ${postId}`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Create Post */}
      <div className="bg-dark-800/50 backdrop-blur-lg rounded-3xl p-6 border border-cyan-400/20 mb-6">
        <div className="flex space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Users size={24} className="text-white" />
          </div>
          <div className="flex-1">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder={isConnected ? "Share something with the community..." : "Connect wallet to post"}
              disabled={!isConnected}
              rows="3"
              className="w-full bg-dark-700 border border-gray-600 rounded-2xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 disabled:opacity-50 resize-none"
            />
            <div className="flex justify-between items-center mt-3">
              <span className="text-gray-400 text-sm">
                {isConnected ? `Posting as ${walletAddress.slice(0, 8)}...` : 'Wallet not connected'}
              </span>
              <button
                onClick={handleAddPost}
                disabled={!isConnected || !newPost.trim()}
                className="flex items-center space-x-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded-2xl transition-colors"
              >
                <Send size={16} />
                <span>Post</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Community Posts */}
      <div className="space-y-6">
        {communityPosts.map((post) => (
          <div key={post.id} className="bg-dark-800/50 backdrop-blur-lg rounded-3xl p-6 border border-cyan-400/20">
            <div className="flex space-x-4">
              {/* User Avatar */}
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Users size={24} className="text-white" />
              </div>

              {/* Post Content */}
              <div className="flex-1">
                {/* User Info */}
                <div className="flex items-center space-x-2 mb-3">
                  <span className="font-bold text-white">{post.user.name}</span>
                  {post.user.isVerified && (
                    <div className="w-4 h-4 bg-cyan-400 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                  )}
                  <span className="text-gray-400 text-sm">{post.timestamp}</span>
                </div>

                {/* Post Text */}
                <p className="text-gray-300 mb-4">{post.text}</p>

                {/* Post Actions */}
                <div className="flex items-center space-x-6">
                  <button
                    onClick={() => handleLikePost(post.id)}
                    className="flex items-center space-x-2 text-gray-400 hover:text-cyan-400 transition-colors"
                  >
                    <Heart size={18} />
                    <span className="text-sm">{post.likes}</span>
                  </button>

                  <button className="flex items-center space-x-2 text-gray-400 hover:text-purple-400 transition-colors">
                    <MessageCircle size={18} />
                    <span className="text-sm">{post.comments}</span>
                  </button>

                  <button
                    onClick={() => handleTipPost(post.id)}
                    className="flex items-center space-x-2 text-yellow-400 hover:text-yellow-300 transition-colors"
                  >
                    <Coins size={18} />
                    <span className="text-sm">Tip {post.tips}</span>
                  </button>

                  <button className="flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-colors">
                    <Share size={18} />
                    <span className="text-sm">Share</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {communityPosts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-xl font-bold text-white mb-2">No Community Posts Yet</h3>
          <p className="text-gray-400">Be the first to start a conversation!</p>
        </div>
      )}
    </div>
  );
}