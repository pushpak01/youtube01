import { useState } from 'react';
import { MessageCircle, Heart, MoreHorizontal, Send } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';

// Mock comments data
const mockComments = [
  {
    id: 1,
    user: {
      name: 'CryptoEnthusiast',
      avatar: '/avatars/user1.jpg',
      isVerified: true
    },
    text: 'This is amazing! The Sonic blockchain is really changing the game for content creators. 🚀',
    timestamp: '2 hours ago',
    likes: 42,
    isLiked: false,
    tips: '5 SONIC'
  },
  {
    id: 2,
    user: {
      name: 'Web3Developer',
      avatar: '/avatars/user2.jpg',
      isVerified: true
    },
    text: 'Great tutorial! Can you make one about smart contract integration?',
    timestamp: '3 hours ago',
    likes: 28,
    isLiked: true,
    tips: '2 SONIC'
  },
  {
    id: 3,
    user: {
      name: 'NFTCollector',
      avatar: '/avatars/user3.jpg',
      isVerified: false
    },
    text: 'Just bought the NFT for this video! So excited to own a piece of this content. 💎',
    timestamp: '4 hours ago',
    likes: 15,
    isLiked: false,
    tips: '10 SONIC'
  }
];

export default function CommentsSection({ videoId }) {
  const [comments, setComments] = useState(mockComments);
  const [newComment, setNewComment] = useState('');
  const [sortBy, setSortBy] = useState('top');
  const { isConnected, walletAddress } = useWallet();

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    if (!isConnected) {
      alert('Please connect your wallet to comment');
      return;
    }

    const comment = {
      id: comments.length + 1,
      user: {
        name: 'You',
        avatar: '/avatars/default.jpg',
        isVerified: false
      },
      text: newComment,
      timestamp: 'Just now',
      likes: 0,
      isLiked: false,
      tips: '0 SONIC'
    };

    setComments([comment, ...comments]);
    setNewComment('');
  };

  const handleLikeComment = (commentId) => {
    if (!isConnected) {
      alert('Please connect your wallet to like comments');
      return;
    }

    setComments(comments.map(comment =>
      comment.id === commentId
        ? {
            ...comment,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            isLiked: !comment.isLiked
          }
        : comment
    ));
  };

  const handleTipComment = (commentId) => {
    if (!isConnected) {
      alert('Please connect your wallet to tip comments');
      return;
    }
    // Implement tip functionality
    console.log(`Tipping comment ${commentId}`);
  };

  return (
    <div className="bg-dark-800/50 backdrop-blur-lg rounded-3xl p-6 border border-cyan-400/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <MessageCircle size={20} className="text-cyan-400" />
          <h3 className="text-xl font-bold text-white">{comments.length} Comments</h3>
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-dark-700 border border-gray-600 rounded-2xl px-4 py-2 text-white text-sm focus:outline-none focus:border-cyan-400"
        >
          <option value="top">Top Comments</option>
          <option value="newest">Newest First</option>
        </select>
      </div>

      {/* Add Comment */}
      <div className="flex space-x-4 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-2xl flex-shrink-0"></div>
        <div className="flex-1">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={isConnected ? "Add a comment..." : "Connect wallet to comment"}
            disabled={!isConnected}
            className="w-full bg-dark-700 border border-gray-600 rounded-2xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 disabled:opacity-50"
            onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-400 text-sm">
              {isConnected ? `Commenting as ${walletAddress.slice(0, 8)}...` : 'Wallet not connected'}
            </span>
            <button
              onClick={handleAddComment}
              disabled={!isConnected || !newComment.trim()}
              className="flex items-center space-x-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-2xl transition-colors"
            >
              <Send size={16} />
              <span>Comment</span>
            </button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex space-x-4">
            {/* User Avatar */}
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-2xl flex-shrink-0"></div>

            {/* Comment Content */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-white text-sm">{comment.user.name}</span>
                  {comment.user.isVerified && (
                    <div className="w-4 h-4 bg-cyan-400 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                  )}
                  <span className="text-gray-400 text-sm">{comment.timestamp}</span>
                </div>
                <button className="text-gray-400 hover:text-white p-1 rounded-full transition-colors">
                  <MoreHorizontal size={16} />
                </button>
              </div>

              <p className="text-gray-300 text-sm mb-3">{comment.text}</p>

              {/* Comment Actions */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleLikeComment(comment.id)}
                  className={`flex items-center space-x-1 text-sm transition-colors ${
                    comment.isLiked ? 'text-cyan-400' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Heart size={14} fill={comment.isLiked ? 'currentColor' : 'none'} />
                  <span>{comment.likes}</span>
                </button>

                <button
                  onClick={() => handleTipComment(comment.id)}
                  className="flex items-center space-x-1 text-yellow-400 text-sm hover:text-yellow-300 transition-colors"
                >
                  <span>💎</span>
                  <span>Tip {comment.tips}</span>
                </button>

                <button className="text-gray-400 hover:text-white text-sm transition-colors">
                  Reply
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}