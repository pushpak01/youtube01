import { useState } from 'react';
import { useSonicWallet } from '../contexts/SonicWalletContext';
import { X, Wallet, Copy, Check, Shield, AlertCircle, Download } from 'lucide-react';

export default function CreateWalletModal({ isOpen, onClose }) {
  const { createNewWallet, isLoading } = useSonicWallet();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1);
  const [mnemonic, setMnemonic] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleCreateWallet = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    console.log('🔄 Starting wallet creation...');

    const result = await createNewWallet(password);
    console.log('💰 Wallet creation result:', result);

    if (result.success && result.mnemonic) {
      console.log('📝 Moving to recovery phrase display');
      setMnemonic(result.mnemonic);
      setWalletAddress(result.address);
      setStep(2); // This should show the recovery phrase
    } else {
      setError(result.error || 'Failed to create wallet');
    }
  };

  const copyMnemonic = async () => {
    if (mnemonic) {
      await navigator.clipboard.writeText(mnemonic);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadRecoveryPhrase = () => {
    if (!mnemonic) return;

    const element = document.createElement('a');
    const file = new Blob([`Sonic Wallet Recovery Phrase\n\nRecovery Phrase: ${mnemonic}\nWallet Address: ${walletAddress}\nNetwork: Sonic Testnet\n\n⚠️ Keep this secure and private!`], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `sonic-wallet-backup.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleClose = () => {
    setStep(1);
    setPassword('');
    setConfirmPassword('');
    setError('');
    setMnemonic('');
    setWalletAddress('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-gray-900 rounded-xl sm:rounded-2xl w-full max-w-md border border-gray-700 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-800 sticky top-0 bg-gray-900">
          <h2 className="text-lg sm:text-xl font-bold text-white">
            {step === 1 ? 'Create Sonic Wallet' : '🔐 Backup Your Wallet'}
          </h2>
          <button
            onClick={handleClose}
            className="p-1 sm:p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-400 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {step === 1 ? (
            <form onSubmit={handleCreateWallet} className="space-y-4">
              <div className="flex items-start space-x-2 p-3 bg-blue-900 bg-opacity-20 rounded-lg border border-blue-800">
                <Shield size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs sm:text-sm text-blue-300">
                  Create a new wallet on Sonic Testnet. You'll get a 12-word recovery phrase to backup.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter a strong password (min 8 characters)"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
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
                {isLoading ? 'Creating Wallet...' : 'Create Wallet & Get Recovery Phrase'}
              </button>
            </form>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {/* Critical Warning */}
              <div className="flex items-start space-x-2 p-3 bg-red-900 bg-opacity-30 rounded-lg border border-red-700">
                <AlertCircle size={20} className="text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-red-200 font-semibold text-sm mb-1">🚨 CRITICAL: Backup Your Recovery Phrase</p>
                  <p className="text-red-200 text-xs">
                    Write these 12 words down and store them securely. This is your only way to recover your wallet!
                  </p>
                </div>
              </div>

              {/* Recovery Phrase Display */}
              <div className="bg-gray-800 rounded-lg p-3 sm:p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-sm font-medium text-gray-300">Recovery Phrase (12 words)</span>
                    <p className="text-xs text-gray-400 mt-1">Sonic Testnet Wallet</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={downloadRecoveryPhrase}
                      className="flex items-center space-x-1 text-xs text-gray-400 hover:text-yellow-400 transition-colors"
                      title="Download as text file"
                    >
                      <Download size={14} />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={copyMnemonic}
                      className="flex items-center space-x-1 text-xs text-gray-400 hover:text-white transition-colors"
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                      <span>{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {/* Words Grid */}
                <div className="bg-black rounded-lg p-4 border border-gray-700">
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {mnemonic.split(' ').map((word, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 bg-gray-900 rounded">
                        <span className="text-gray-500 text-xs w-4 text-right">{index + 1}.</span>
                        <span className="text-white text-sm font-medium flex-1">{word}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Security Tips */}
              <div className="bg-yellow-900 bg-opacity-20 rounded-lg p-3 border border-yellow-800">
                <h4 className="text-yellow-300 text-sm font-semibold mb-2">💡 Security Tips:</h4>
                <ul className="text-yellow-200 text-xs space-y-1">
                  <li>• Write on paper - avoid digital storage</li>
                  <li>• Store in multiple secure locations</li>
                  <li>• Never share with anyone</li>
                  <li>• Don't take photos/screenshots</li>
                </ul>
              </div>

              {/* Wallet Address */}
              <div className="bg-gray-800 rounded-lg p-3">
                <span className="text-sm font-medium text-gray-300 block mb-2">Your Wallet Address</span>
                <p className="text-xs font-mono text-blue-400 break-all bg-black p-2 rounded">
                  {walletAddress}
                </p>
                <p className="text-gray-400 text-xs mt-1">Use this address to receive S tokens on Sonic Testnet</p>
              </div>

              <button
                onClick={handleClose}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition-colors font-medium text-sm sm:text-base"
              >
                ✅ I've Securely Backed Up My Recovery Phrase
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}