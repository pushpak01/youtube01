import { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

const SonicWalletContext = createContext();

export function SonicWalletProvider({ children }) {
  const [account, setAccount] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [provider, setProvider] = useState(null);
  const [balance, setBalance] = useState('0');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if wallet exists in localStorage on app start
  useEffect(() => {
    checkExistingWallet();
  }, []);

  const checkExistingWallet = () => {
    if (typeof window === 'undefined') return;

    const storedWallet = localStorage.getItem('sonicWallet');
    const storedAddress = localStorage.getItem('sonicWalletAddress');
    const storedLogin = localStorage.getItem('sonicWalletLoggedIn');

    console.log('🔄 Checking stored wallet:', {
      hasWallet: !!storedWallet,
      hasAddress: !!storedAddress,
      wasLoggedIn: storedLogin === 'true'
    });

    if (storedWallet && storedAddress && storedLogin === 'true') {
      setAccount(storedAddress);
      setIsLoggedIn(true);
      // Wallet will be decrypted when user logs in
    }
  };

  const setupProvider = async (walletInstance) => {
  try {
    console.log('🔗 Setting up Sonic Testnet provider...');

    // Sonic Testnet RPC URL
    const sonicProvider = new ethers.JsonRpcProvider('https://rpc.testnet.soniclabs.com');
    setProvider(sonicProvider);

    // Get balance
    const accountBalance = await sonicProvider.getBalance(walletInstance.address);
    const formattedBalance = ethers.formatEther(accountBalance);

    console.log('💰 Balance fetched:', {
      address: walletInstance.address,
      balance: formattedBalance + ' S'
    });

    setBalance(formattedBalance);
  } catch (error) {
    console.error('❌ Error setting up provider:', error);
    setBalance('0');
  }
};

  const createNewWallet = async (password) => {
    setIsLoading(true);
    try {
      console.log('🔐 Generating new wallet...');

      // Generate a new random wallet
      const newWallet = ethers.Wallet.createRandom();

      console.log('✅ Wallet created:', {
        address: newWallet.address,
        hasMnemonic: !!newWallet.mnemonic,
        mnemonic: newWallet.mnemonic?.phrase
      });

      if (!newWallet.mnemonic) {
        throw new Error('No mnemonic generated');
      }

      // Encrypt the wallet with password
      const encryptedWallet = await newWallet.encrypt(password);

      // Store in localStorage
      localStorage.setItem('sonicWallet', encryptedWallet);
      localStorage.setItem('sonicWalletAddress', newWallet.address);
      localStorage.setItem('sonicWalletLoggedIn', 'true');

      setWallet(newWallet);
      setAccount(newWallet.address);
      setIsLoggedIn(true);
      await setupProvider(newWallet);

      return {
        success: true,
        mnemonic: newWallet.mnemonic.phrase,
        address: newWallet.address
      };
    } catch (error) {
      console.error('❌ Error creating wallet:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const importWalletFromMnemonic = async (mnemonic, password) => {
    setIsLoading(true);
    try {
      // Validate mnemonic
      if (!ethers.Mnemonic.isValidMnemonic(mnemonic)) {
        return { success: false, error: 'Invalid mnemonic phrase' };
      }

      // Create wallet from mnemonic
      const importedWallet = ethers.Wallet.fromPhrase(mnemonic);

      // Encrypt and store
      const encryptedWallet = await importedWallet.encrypt(password);
      localStorage.setItem('sonicWallet', encryptedWallet);
      localStorage.setItem('sonicWalletAddress', importedWallet.address);
      localStorage.setItem('sonicWalletLoggedIn', 'true');

      setWallet(importedWallet);
      setAccount(importedWallet.address);
      setIsLoggedIn(true);
      await setupProvider(importedWallet);

      return { success: true, address: importedWallet.address };
    } catch (error) {
      console.error('Error importing wallet:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithPassword = async (password) => {
    setIsLoading(true);
    try {
      const encryptedWallet = localStorage.getItem('sonicWallet');
      if (!encryptedWallet) {
        return { success: false, error: 'No wallet found' };
      }

      const decryptedWallet = await ethers.Wallet.fromEncryptedJson(encryptedWallet, password);

      setWallet(decryptedWallet);
      setAccount(decryptedWallet.address);
      setIsLoggedIn(true);
      localStorage.setItem('sonicWalletLoggedIn', 'true');
      await setupProvider(decryptedWallet);

      return { success: true };
    } catch (error) {
      console.error('Error logging in:', error);
      return { success: false, error: 'Invalid password' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setWallet(null);
    setAccount(null);
    setProvider(null);
    setBalance('0');
    setIsLoggedIn(false);
    localStorage.removeItem('sonicWalletLoggedIn');
    // Keep wallet data for future login
  };

  const getWalletInfo = () => {
    if (!wallet) return null;

    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
      publicKey: wallet.publicKey,
      mnemonic: wallet.mnemonic?.phrase
    };
  };

  const sendTransaction = async (toAddress, amount) => {
    if (!wallet || !provider) {
      throw new Error('Wallet not connected');
    }

    try {
      const connectedWallet = wallet.connect(provider);

      const tx = await connectedWallet.sendTransaction({
        to: toAddress,
        value: ethers.parseEther(amount.toString()),
        gasLimit: 21000
      });

      return tx;
    } catch (error) {
      console.error('Error sending transaction:', error);
      throw new Error(`Transaction failed: ${error.message}`);
    }
  };

  const value = {
    account,
    wallet,
    provider,
    balance,
    isLoggedIn,
    isLoading,
    createNewWallet,
    importWalletFromMnemonic,
    loginWithPassword,
    logout,
    getWalletInfo,
    sendTransaction
  };

  return (
    <SonicWalletContext.Provider value={value}>
      {children}
    </SonicWalletContext.Provider>
  );
}

export function useSonicWallet() {
  const context = useContext(SonicWalletContext);
  if (!context) {
    throw new Error('useSonicWallet must be used within a SonicWalletProvider');
  }
  return context;
}