import { useState, useEffect, useRef } from 'react';
import { X, RefreshCw, CheckCircle, AlertCircle, Copy } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

export default function WalletConnectQR() {
  const {
    showQRModal,
    setShowQRModal,
    generateQRData,
    checkConnectionStatus,
    connectionSession,
    isConnected
  } = useWallet();

  const [qrData, setQrData] = useState('');
  const [qrImageUrl, setQrImageUrl] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [connectionError, setConnectionError] = useState('');
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (showQRModal) {
      const newQrData = generateQRData();
      setQrData(newQrData);
      generateQRCode(newQrData);
      setConnectionError('');
      startConnectionCheck(JSON.parse(newQrData).sessionId);
    }
  }, [showQRModal]);

  const generateQRCode = async (data) => {
    // Dynamic import of qrcode to avoid SSR issues
    const QRCode = (await import('qrcode')).default;

    try {
      const url = await QRCode.toDataURL(data, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrImageUrl(url);
    } catch (err) {
      console.error('Error generating QR code:', err);
    }
  };

  const startConnectionCheck = async (sessionId) => {
    setIsChecking(true);

    const maxAttempts = 30;
    let attempts = 0;

    const checkInterval = setInterval(async () => {
      attempts++;

      const isConnected = await checkConnectionStatus(sessionId);

      if (isConnected) {
        clearInterval(checkInterval);
        setIsChecking(false);
        setTimeout(() => setShowQRModal(false), 2000);
      } else if (attempts >= maxAttempts) {
        clearInterval(checkInterval);
        setIsChecking(false);
        setConnectionError('Connection timeout. Please try again.');
      }
    }, 2000);

    return () => clearInterval(checkInterval);
  };

  const handleRetry = async () => {
    const newQrData = generateQRData();
    setQrData(newQrData);
    await generateQRCode(newQrData);
    setConnectionError('');
    startConnectionCheck(JSON.parse(newQrData).sessionId);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(qrData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!showQRModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl max-w-md w-full p-6 border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Connect Sonic Wallet</h3>
          <button
            onClick={() => setShowQRModal(false)}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Connection Status */}
        {isConnected ? (
          <div className="text-center py-8">
            <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-white mb-2">Connected Successfully!</h4>
            <p className="text-gray-400">Your Sonic Wallet is now connected.</p>
          </div>
        ) : (
          <>
            {/* QR Code Display */}
            <div className="mb-4 flex flex-col items-center">
              {qrImageUrl ? (
                <div className="bg-white p-6 rounded-lg border-2 border-gray-300">
                  <img
                    src={qrImageUrl}
                    alt="QR Code for Sonic Wallet Connection"
                    className="w-48 h-48"
                  />
                </div>
              ) : (
                <div className="bg-white p-6 rounded-lg border-2 border-gray-300 w-48 h-48 flex items-center justify-center">
                  <RefreshCw size={24} className="text-gray-400 animate-spin" />
                </div>
              )}

              {/* Copy to clipboard option */}
              <button
                onClick={copyToClipboard}
                className="flex items-center space-x-2 mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm transition-colors"
              >
                <Copy size={16} />
                <span>{copied ? 'Copied!' : 'Copy QR Data'}</span>
              </button>

              {/* QR Data Preview */}
              <div className="mt-3 text-center">
                <p className="text-xs text-gray-400 mb-1">QR contains:</p>
                <div className="bg-gray-800 p-2 rounded text-xs font-mono text-gray-300 max-w-xs overflow-hidden">
                  {qrData ? `${qrData.substring(0, 40)}...` : 'Generating QR code...'}
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-3 mb-6">
              <h4 className="text-white font-semibold text-center mb-4">How to connect:</h4>
              <div className="flex items-start space-x-3">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  1
                </div>
                <p className="text-gray-300 text-sm">
                  Open <strong className="text-blue-400">Sonic Wallet</strong> on your mobile device
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  2
                </div>
                <p className="text-gray-300 text-sm">
                  Tap on <strong className="text-blue-400">"Scan QR"</strong> in the dashboard
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  3
                </div>
                <p className="text-gray-300 text-sm">
                  Scan the QR code above to connect
                </p>
              </div>
            </div>

            {/* Connection Status */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                {isChecking ? (
                  <>
                    <RefreshCw size={16} className="text-blue-500 animate-spin" />
                    <span className="text-blue-500 text-sm">Waiting for connection...</span>
                  </>
                ) : connectionError ? (
                  <>
                    <AlertCircle size={16} className="text-red-500" />
                    <span className="text-red-500 text-sm">{connectionError}</span>
                  </>
                ) : null}
              </div>

              {connectionError && (
                <button
                  onClick={handleRetry}
                  className="flex items-center space-x-1 text-blue-500 hover:text-blue-400 text-sm"
                >
                  <RefreshCw size={14} />
                  <span>Retry</span>
                </button>
              )}
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={() => setShowQRModal(false)}
            className="flex-1 py-3 px-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
          >
            {isConnected ? 'Close' : 'Cancel'}
          </button>
          {!isConnected && (
            <button
              onClick={handleRetry}
              className="flex items-center justify-center space-x-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              <RefreshCw size={16} />
              <span>Refresh QR</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}