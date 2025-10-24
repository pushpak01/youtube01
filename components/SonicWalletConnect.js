import { useState, useEffect } from 'react';
import { useSonicWallet } from '../contexts/SonicWalletContext';
import { Wallet, LogOut, User, Copy, Check, Key, Download } from 'lucide-react';
import CreateWalletModal from './CreateWalletModal';
import LoginModal from './LoginModal';
import UserProfileModal from './UserProfileModal';

export default function SonicWalletConnect() {
  const {
    account,
    balance,
    isLoggedIn,
    logout
  } = useSonicWallet();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const savedUsername = localStorage.getItem('sonicUsername') || '';
    setUsername(savedUsername);
  }, []);

  const copyAddress = async () => {
    if (account) {
      await navigator.clipboard.writeText(account);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const downloadBackup = () => {
    alert('Backup functionality would be implemented here');
  };

  if (isLoggedIn) {
    return (
      <>
        <div className="flex items-center space-x-1 sm:space-x-3">
          {/* Wallet Info - Hidden on mobile, shown on desktop */}
          <div className="hidden sm:flex flex-col items-end">
            <div className="text-sm font-medium text-white">
              {formatAddress(account)}
            </div>
            <div className="text-xs text-green-400">
              {parseFloat(balance).toFixed(4)} S
            </div>
          </div>

          {/* Copy Address Button */}
          <button
            onClick={copyAddress}
            className="p-1 sm:p-2 hover:bg-gray-700 rounded-full transition-colors text-gray-400 hover:text-white"
            title="Copy address"
          >
            {copied ? <Check size={16} className="sm:w-[16px] sm:h-[16px]" /> : <Copy size={16} className="sm:w-[16px] sm:h-[16px]" />}
          </button>

          {/* Backup Wallet */}
          <button
            onClick={downloadBackup}
            className="p-1 sm:p-2 hover:bg-gray-700 rounded-full transition-colors text-gray-400 hover:text-yellow-400"
            title="Backup wallet"
          >
            <Download size={16} className="sm:w-[16px] sm:h-[16px]" />
          </button>

          {/* User Profile Button */}
          <button
            onClick={() => setShowProfileModal(true)}
            className="p-1 sm:p-2 hover:bg-gray-700 rounded-full transition-colors text-gray-400 hover:text-white"
          >
            <User size={18} className="sm:w-[20px] sm:h-[20px]" />
          </button>

          {/* Disconnect Button */}
          <button
            onClick={logout}
            className="p-1 sm:p-2 hover:bg-gray-700 rounded-full transition-colors text-red-400 hover:text-red-300"
            title="Logout"
          >
            <LogOut size={18} className="sm:w-[20px] sm:h-[20px]" />
          </button>
        </div>

        <UserProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
        />
      </>
    );
  }

  return (
    <>
      <div className="flex items-center space-x-1 sm:space-x-3">
        {/* Create New Wallet - Smaller on mobile */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-green-600 hover:bg-green-700 text-white rounded-full transition-colors font-medium text-xs sm:text-sm"
        >
          <Wallet size={14} className="sm:w-[18px] sm:h-[18px]" />
          <span className="hidden xs:inline">Create</span>
        </button>

        {/* Import Wallet - Smaller on mobile */}
        <button
          onClick={() => setShowLoginModal(true)}
          className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors font-medium text-xs sm:text-sm"
        >
          <Key size={14} className="sm:w-[18px] sm:h-[18px]" />
          <span className="hidden xs:inline">Import</span>
        </button>
      </div>

      <CreateWalletModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
}