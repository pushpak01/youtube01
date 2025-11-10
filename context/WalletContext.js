import { createContext, useContext, useState, useEffect } from 'react';

const WalletContext = createContext();

export function WalletProvider({ children }) {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [connectionSession, setConnectionSession] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletType, setWalletType] = useState(null); // 'sonic' or 'metamask'

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && !!window.ethereum;
  };

  // Generate unique session ID for Sonic
  const generateSessionId = () => {
    return `sonic_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Generate QR code data for SonicWallet
  const generateQRData = () => {
    const sessionId = generateSessionId();
    const payload = {
      type: 'sonic_youtube_connection',
      version: '1.0',
      dappName: 'Sonic YouTube',
      dappUrl: typeof window !== 'undefined' ? window.location.origin : '',
      chains: [14601], // Sonic Testnet
      methods: ['sonic_signMessage', 'sonic_signTransaction'],
      sessionId: sessionId,
      timestamp: Date.now(),
      callbackUrl: `${typeof window !== 'undefined' ? window.location.origin : ''}/api/connection`
    };

    // Store session temporarily
    sessionStorage.setItem(`sonic_session_${sessionId}`, JSON.stringify({
      ...payload,
      status: 'pending',
      connectedAt: null,
      walletAddress: null
    }));

    return JSON.stringify(payload);
  };

  // MetaMask connection
  const connectMetaMask = async () => {
    try {
      if (!isMetaMaskInstalled()) {
        throw new Error('MetaMask is not installed');
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        const address = accounts[0];
        setIsConnected(true);
        setWalletAddress(address);
        setWalletType('metamask');
        setShowWalletModal(false);

        return address;
      }
    } catch (error) {
      console.error('MetaMask connection error:', error);
      throw error;
    }
  };

  // Sonic connection setup
  const setupSonicConnection = () => {
    setWalletType('sonic');
    setShowQRModal(true);
    setShowWalletModal(false);
  };

  // Check connection status for Sonic
  const checkConnectionStatus = async (sessionId) => {
    try {
      const sessionKey = `sonic_session_${sessionId}`;
      const sessionData = sessionStorage.getItem(sessionKey);

      if (sessionData) {
        const session = JSON.parse(sessionData);
        if (session.status === 'connected' && session.walletAddress) {
          setIsConnected(true);
          setWalletAddress(session.walletAddress);
          setConnectionSession(session);
          setWalletType('sonic');
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error checking connection status:', error);
      return false;
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress('');
    setConnectionSession(null);
    setWalletType(null);

    // Clear all Sonic sessions
    Object.keys(sessionStorage).forEach(key => {
      if (key.startsWith('sonic_session_')) {
        sessionStorage.removeItem(key);
      }
    });
  };

  // Sign message (for authentication)
  const signMessage = async (message) => {
    if (!isConnected || !walletType) {
      throw new Error('Wallet not connected');
    }

    if (walletType === 'metamask') {
      // MetaMask message signing
      try {
        const signature = await window.ethereum.request({
          method: 'personal_sign',
          params: [message, walletAddress],
        });
        return {
          message,
          signature,
          address: walletAddress
        };
      } catch (error) {
        throw new Error('User denied message signature');
      }
    } else if (walletType === 'sonic') {
      // Sonic message signing (existing implementation)
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            message,
            signature: `sonic_signature_${Date.now()}`,
            address: walletAddress
          });
        }, 1000);
      });
    }
  };

  // Listen for MetaMask account changes
  useEffect(() => {
    if (isMetaMaskInstalled() && walletType === 'metamask') {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          // User disconnected from MetaMask
          disconnectWallet();
        } else if (accounts[0] !== walletAddress) {
          // Account changed
          setWalletAddress(accounts[0]);
        }
      };

      const handleChainChanged = () => {
        // Reload the page when chain changes
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [walletType, walletAddress]);

  return (
    <WalletContext.Provider value={{
      isConnected,
      walletAddress,
      connectionSession,
      showQRModal,
      setShowQRModal,
      showWalletModal,
      setShowWalletModal,
      walletType,
      generateQRData,
      checkConnectionStatus,
      connectMetaMask,
      setupSonicConnection,
      disconnectWallet,
      signMessage,
      isMetaMaskInstalled,
      setIsConnected,
      setWalletAddress,
      setConnectionSession
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}