import { useState } from 'react';
import { Wallet, LogOut, User } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

export default function ConnectionStatus() {
  const {
    isConnected,
    walletAddress,
    setShowWalletModal,
    disconnectWallet,
    walletType
  } = useWallet();

  const [showDropdown, setShowDropdown] = useState(false);

  const shortenAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getWalletIcon = () => {
    switch (walletType) {
      case 'metamask':
        return '🦊';
      case 'sonic':
        return '⚡';
      default:
        return <Wallet size={20} className="text-white" />;
    }
  };

  const getWalletName = () => {
    switch (walletType) {
      case 'metamask':
        return 'MetaMask';
      case 'sonic':
        return 'Sonic Wallet';
      default:
        return 'Wallet';
    }
  };

  if (!isConnected) {
    return (
      <button
        onClick={() => setShowWalletModal(true)}
        className="flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-cyan-400 to-purple-500 hover:from-cyan-500 hover:to-purple-600 rounded-2xl transition-all duration-300 hover:scale-105 shadow-neon-purple animate-pulse-glow group"
      >
        <Wallet size={20} className="text-white" />
        <span className="text-sm font-bold text-white">Connect Wallet</span>
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 rounded-2xl transition-all duration-300 hover:scale-105 shadow-neon-green animate-pulse-glow group"
      >
        <span className="text-white">{getWalletIcon()}</span>
        <span className="text-sm font-bold text-white">{shortenAddress(walletAddress)}</span>
      </button>

      {showDropdown && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-dark-800 border border-cyan-400/30 rounded-2xl shadow-neon-blue z-50 backdrop-blur-4xl">
          <div className="p-4 border-b border-cyan-400/20">
            <p className="text-xs text-cyan-300">Connected with {getWalletName()}</p>
            <p className="text-sm font-mono text-white truncate mt-1">{walletAddress}</p>
          </div>
          <button
            onClick={() => {
              disconnectWallet();
              setShowDropdown(false);
            }}
            className="flex items-center space-x-2 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 transition-all duration-300 rounded-b-2xl"
          >
            <LogOut size={16} />
            <span className="text-sm font-medium">Disconnect</span>
          </button>
        </div>
      )}
    </div>
  );
}