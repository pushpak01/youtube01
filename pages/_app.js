import '../styles/globals.css';
import { WalletProvider } from '../context/WalletContext';
import WalletSelectionModal from '../components/WalletSelectionModal';
import WalletConnectQR from '../components/WalletConnectQR';
import ProfileCreationModal from '../components/ProfileCreationModal';

export default function MyApp({ Component, pageProps }) {
  return (
    <WalletProvider>
      <Component {...pageProps} />
      <WalletSelectionModal />
      <WalletConnectQR />
      <ProfileCreationModal />
    </WalletProvider>
  );
}