import { useState } from 'react';
import { useSonicWallet } from '../contexts/SonicWalletContext';
import { X, Key, Wallet, AlertCircle } from 'lucide-react';

export default function LoginModal({ isOpen, onClose }) {
  const { loginWithPassword, importWalletFromMnemonic, isLoading } = useSonicWallet();
  const [mode, setMode] = useState('login'); // 'login' or 'import'
  const [password, setPassword] = useState('');
  const [mnemonic, setMnemonic] = useState('');
  const [importPassword, setImportPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const result = await loginWithPassword(password);

    if (result.success) {
      onClose();
      setPassword('');
      setError('');
    } else {
      setError(result.error);
    }
  };

  const handleImport = async (e) => {
    e.preventDefault();
    setError('');

    if (importPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    const result = await importWalletFromMnemonic(mnemonic, importPassword);

    if (result.success) {
      onClose();
      setMnemonic('');
      setImportPassword('');
      setError('');
    } else {
      setError(result.error);
    }
  };

  const handleClose = () => {
    setMode('login');
    setPassword('');
    setMnemonic('');
    setImportPassword('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-gray-900 rounded-xl sm:rounded-2xl w-full max-w-md border border-gray-700 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-800 sticky top-0 bg-gray-900">
          <h2 className="text-lg sm:text-xl font-bold text-white">
            {mode === 'login' ? 'Login to Wallet' : 'Import Wallet'}
          </h2>
          <button
            onClick={handleClose}
            className="p-1 sm:p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-400 hover:text-white"
          >
            <X size={18} className="sm:w-[20px] sm:h-[20px]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {/* Mode Toggle */}
          <div className="flex bg-gray-800 rounded-lg p-1 mb-4 sm:mb-6">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors flex items-center justify-center ${
                mode === 'login'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Key size={14} className="sm:w-[16px] sm:h-[16px] mr-1 sm:mr-2" />
              Login
            </button>
            <button
              onClick={() => setMode('import')}
              className={`flex-1 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors flex items-center justify-center ${
                mode === 'import'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Wallet size={14} className="sm:w-[16px] sm:h-[16px] mr-1 sm:mr-2" />
              Import
            </button>
          </div>

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your wallet password"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm"
                  required
                />
              </div>

              {error && (
                <div className="flex items-start space-x-2 p-3 bg-red-900 bg-opacity-20 rounded-lg border border-red-800">
                  <AlertCircle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs sm:text-sm text-red-300">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {isLoading ? 'Logging in...' : 'Login to Wallet'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleImport} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Recovery Phrase
                </label>
                <textarea
                  value={mnemonic}
                  onChange={(e) => setMnemonic(e.target.value)}
                  placeholder="Enter your 12 or 24 word recovery phrase"
                  rows="3"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={importPassword}
                  onChange={(e) => setImportPassword(e.target.value)}
                  placeholder="Set a new password for this wallet"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm"
                  required
                />
              </div>

              {error && (
                <div className="flex items-start space-x-2 p-3 bg-red-900 bg-opacity-20 rounded-lg border border-red-800">
                  <AlertCircle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs sm:text-sm text-red-300">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {isLoading ? 'Importing Wallet...' : 'Import Wallet'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}