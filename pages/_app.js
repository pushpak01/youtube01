import '../styles/globals.css'
import { SonicWalletProvider } from '../contexts/SonicWalletContext'

export default function MyApp({ Component, pageProps }) {
  return (
    <SonicWalletProvider>
      <Component {...pageProps} />
    </SonicWalletProvider>
  )
}