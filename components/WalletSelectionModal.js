import { useState } from 'react';
import { X, Wallet, Smartphone, ExternalLink } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

export default function WalletSelectionModal() {
  const {
    showWalletModal,
    setShowWalletModal,
    connectMetaMask,
    setupSonicConnection,
    isMetaMaskInstalled
  } = useWallet();

  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');

  const handleMetaMaskConnect = async () => {
    try {
      setIsConnecting(true);
      setError('');
      await connectMetaMask();
    } catch (err) {
      setError(err.message || 'Failed to connect to MetaMask');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSonicConnect = () => {
    setupSonicConnection();
  };

  if (!showWalletModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl max-w-md w-full p-6 border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Connect Wallet</h3>
          <button
            onClick={() => setShowWalletModal(false)}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Wallet Options */}
        <div className="space-y-3">
          {/* MetaMask Option */}
          <button
            onClick={handleMetaMaskConnect}
            disabled={isConnecting || !isMetaMaskInstalled()}
            className="w-full flex items-center justify-between p-4 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/50 rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <Wallet size={20} className="text-white" />
              </div>
              <div className="text-left">
                <p className="text-white font-semibold">MetaMask</p>
                <p className="text-orange-300 text-sm">
                  {isMetaMaskInstalled() ? 'Browser wallet' : 'Not installed'}
                </p>
              </div>
            </div>
            {!isMetaMaskInstalled() ? (
              <ExternalLink size={16} className="text-orange-300" />
            ) : isConnecting ? (
              <div className="w-5 h-5 border-2 border-orange-300 border-t-transparent rounded-full animate-spin" />
            ) : null}
          </button>

          {/* Sonic Wallet Option */}
          <button
            onClick={handleSonicConnect}
            className="w-full flex items-center justify-between p-4 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 rounded-xl transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Smartphone size={20} className="text-white" />
              </div>
              <div className="text-left">
                <p className="text-white font-semibold">Sonic Wallet</p>
                <p className="text-blue-300 text-sm">Mobile wallet</p>
              </div>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-700">
          <p className="text-gray-400 text-xs text-center">
            By connecting your wallet, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}