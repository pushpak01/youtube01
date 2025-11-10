import { useState } from 'react';
import { Coins, Share2, Download, Bookmark, Flag } from 'lucide-react';

export default function ActionButtons({ video, onTip, onShare, onDownload, onSave, onReport }) {
  const [isSaved, setIsSaved] = useState(false);

  return (
    <div className="flex items-center space-x-2">
      {/* Tip Button */}
      <button
        onClick={onTip}
        className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-2xl transition-colors"
      >
        <Coins size={16} />
        <span>Tip</span>
      </button>

      {/* Share Button */}
      <button
        onClick={onShare}
        className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-2xl transition-colors"
      >
        <Share2 size={16} />
        <span>Share</span>
      </button>

      {/* Download Button */}
      <button
        onClick={onDownload}
        className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-2xl transition-colors"
      >
        <Download size={16} />
        <span>Download</span>
      </button>

      {/* Save Button */}
      <button
        onClick={() => {
          setIsSaved(!isSaved);
          onSave?.();
        }}
        className={`flex items-center space-x-2 px-4 py-2 rounded-2xl transition-colors ${
          isSaved ? 'bg-purple-500 text-white' : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
        }`}
      >
        <Bookmark size={16} fill={isSaved ? 'currentColor' : 'none'} />
        <span>{isSaved ? 'Saved' : 'Save'}</span>
      </button>

      {/* Report Button */}
      <button
        onClick={onReport}
        className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-2xl transition-colors"
      >
        <Flag size={16} />
        <span>Report</span>
      </button>
    </div>
  );
}