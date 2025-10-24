import { useState } from 'react';
import { useSonicWallet } from '../contexts/SonicWalletContext';
import { X, User, Copy, Check, ExternalLink, Coins, Edit, Save, Send, Download, QrCode } from 'lucide-react';

export default function UserProfileModal({ isOpen, onClose }) {
  const { account, balance, logout, sendTransaction } = useSonicWallet();
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'send', 'receive'

  if (!isOpen) return null;

  const copyAddress = async () => {
    if (account) {
      await navigator.clipboard.writeText(account);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  const viewOnExplorer = () => {
    window.open(`https://testnet.sonicscan.org/address/${account}`, '_blank');
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    if (username) localStorage.setItem('sonicUsername', username);
    if (bio) localStorage.setItem('sonicBio', bio);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-md border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">
            {activeTab === 'profile' ? 'Profile' :
             activeTab === 'send' ? 'Send Tokens' : 'Receive Tokens'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-800">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'profile'
                ? 'text-white border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('send')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'send'
                ? 'text-white border-b-2 border-green-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Send
          </button>
          <button
            onClick={() => setActiveTab('receive')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'receive'
                ? 'text-white border-b-2 border-yellow-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Receive
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'profile' && (
            <ProfileTab
              account={account}
              balance={balance}
              username={username}
              setUsername={setUsername}
              bio={bio}
              setBio={setBio}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              copied={copied}
              copyAddress={copyAddress}
              formatAddress={formatAddress}
              handleSaveProfile={handleSaveProfile}
              viewOnExplorer={viewOnExplorer}
              logout={logout}
            />
          )}

          {activeTab === 'send' && (
            <SendTab
              balance={balance}
              sendTransaction={sendTransaction}
              onClose={onClose}
            />
          )}

          {activeTab === 'receive' && (
            <ReceiveTab
              account={account}
              copied={copied}
              copyAddress={copyAddress}
              formatAddress={formatAddress}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Profile Tab Component
function ProfileTab({
  account, balance, username, setUsername, bio, setBio, isEditing, setIsEditing,
  copied, copyAddress, formatAddress, handleSaveProfile, viewOnExplorer, logout
}) {
  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <User size={32} className="text-white" />
        </div>
        <div className="flex-1">
          {isEditing ? (
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          ) : (
            <h3 className="text-lg font-semibold text-white">
              {username || 'Anonymous User'}
            </h3>
          )}
          <p className="text-gray-400 text-sm">{formatAddress(account)}</p>
        </div>
        <button
          onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
          className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-400 hover:text-white"
        >
          {isEditing ? <Save size={20} /> : <Edit size={20} />}
        </button>
      </div>

      {/* Wallet Balance */}
      <div className="bg-gray-800 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Coins size={20} className="text-yellow-400" />
            <span className="text-white font-medium">Wallet Balance</span>
          </div>
          <span className="text-white font-bold">
            {parseFloat(balance).toFixed(4)} S
          </span>
        </div>
      </div>

      {/* Wallet Address */}
      <div className="bg-gray-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <User size={20} className="text-blue-400" />
            <span className="text-white font-medium">Wallet Address</span>
          </div>
          <button
            onClick={copyAddress}
            className="flex items-center space-x-1 text-sm text-gray-400 hover:text-white transition-colors"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
        <p className="text-gray-300 text-sm font-mono break-all">
          {account}
        </p>
      </div>

      {/* Bio Section */}
      <div className="bg-gray-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white font-medium">Bio</span>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              Edit
            </button>
          )}
        </div>
        {isEditing ? (
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself..."
            rows="3"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
          />
        ) : (
          <p className="text-gray-300 text-sm">
            {bio || 'No bio yet. Click edit to add one.'}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex space-x-3">
        <button
          onClick={viewOnExplorer}
          className="flex-1 flex items-center justify-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-3 rounded-lg transition-colors"
        >
          <ExternalLink size={16} />
          <span>Explorer</span>
        </button>

        <button
          onClick={logout}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

// Send Tab Component
function SendTab({ balance, sendTransaction, onClose }) {
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSend = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!toAddress) {
      setError('Please enter recipient address');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (parseFloat(amount) > parseFloat(balance)) {
      setError('Insufficient balance');
      return;
    }

    setIsSending(true);
    try {
      const tx = await sendTransaction(toAddress, parseFloat(amount));
      setSuccess(`Transaction sent! Hash: ${tx.hash}`);
      setToAddress('');
      setAmount('');

      // Close modal after 3 seconds
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error) {
      setError(`Failed to send: ${error.message}`);
    } finally {
      setIsSending(false);
    }
  };

  const setMaxAmount = () => {
    setAmount(parseFloat(balance).toFixed(4));
  };

  return (
    <div className="space-y-6">
      {/* Balance */}
      <div className="bg-gray-800 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-300">Available Balance</span>
          <span className="text-white font-bold text-lg">
            {parseFloat(balance).toFixed(4)} S
          </span>
        </div>
      </div>

      {/* Send Form */}
      <form onSubmit={handleSend} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Recipient Address
          </label>
          <input
            type="text"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            placeholder="Enter wallet address"
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 font-mono text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Amount (S)
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.001"
              min="0"
              max={balance}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 pr-20"
            />
            <button
              type="button"
              onClick={setMaxAmount}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs"
            >
              MAX
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-900 bg-opacity-20 rounded-lg border border-red-800">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-900 bg-opacity-20 rounded-lg border border-green-800">
            <p className="text-green-300 text-sm">{success}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSending}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          <Send size={18} />
          <span>{isSending ? 'Sending...' : 'Send Tokens'}</span>
        </button>
      </form>
    </div>
  );
}

// Receive Tab Component
function ReceiveTab({ account, copied, copyAddress, formatAddress }) {
  return (
    <div className="space-y-6 text-center">
      {/* QR Code Placeholder */}
      <div className="bg-white p-6 rounded-xl mx-auto w-48 h-48 flex items-center justify-center">
        <div className="text-center">
          <QrCode size={64} className="text-gray-800 mx-auto mb-2" />
          <p className="text-gray-600 text-xs">QR Code</p>
        </div>
      </div>

      {/* Wallet Address */}
      <div className="bg-gray-800 rounded-xl p-4">
        <p className="text-gray-300 text-sm mb-2">Your Wallet Address</p>
        <p className="text-white font-mono text-sm break-all mb-3">
          {account}
        </p>
        <button
          onClick={copyAddress}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          <span>{copied ? 'Copied!' : 'Copy Address'}</span>
        </button>
      </div>

      {/* Instructions */}
      <div className="bg-yellow-900 bg-opacity-20 rounded-lg p-4 border border-yellow-800">
        <p className="text-yellow-300 text-sm">
          Share this address to receive S tokens on Sonic Testnet.
          Make sure the sender is using the Sonic Testnet network.
        </p>
      </div>
    </div>
  );
}