import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';

// Import components
import NeonHeader from '../components/layout/NeonHeader';
import CategoriesBar from '../components/layout/CategoriesBar';
import ParticleBackground from '../components/ui/ParticleBackground';
import NeonFloatingButton from '../components/ui/NeonFloatingButton';
import HeroSection from '../components/sections/HeroSection';
import VideoGrid from '../components/sections/VideoGrid';
import ProfileCreationModal from '../components/ProfileCreationModal';

// Import hooks
import useMobileDetection from '../components/hooks/useMobileDetection';

export default function UltraSonicVision() {
  const { isConnected, walletAddress } = useWallet();
  const { isMobile } = useMobileDetection();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const router = useRouter();

  // Check for user profile when wallet connects
  useEffect(() => {
    if (isConnected && walletAddress) {
      loadUserProfile();
    } else {
      setUserProfile(null);
    }
  }, [isConnected, walletAddress]);

  const loadUserProfile = async () => {
    try {
      setProfileLoading(true);
      console.log('🔍 Loading profile for:', walletAddress);

      const response = await fetch('/api/profile/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress })
      });

      const { exists, profileData } = await response.json();
      console.log('📋 Profile exists:', exists, 'Data:', profileData);

      if (exists && profileData) {
        setUserProfile(profileData);
      } else {
        setUserProfile(null);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setUserProfile(null);
    } finally {
      setProfileLoading(false);
    }
  };

  // Listen for profile creation events
  useEffect(() => {
    const handleProfileCreated = (event) => {
      console.log('🎉 Profile created event received:', event.detail);
      loadUserProfile(); // Reload profile after creation
    };

    window.addEventListener('profileCreated', handleProfileCreated);
    return () => window.removeEventListener('profileCreated', handleProfileCreated);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800 text-white overflow-x-hidden">
      <Head>
        <title>SonicVision - Next Gen Decentralized Media</title>
        <meta name="description" content="Experience the future of decentralized video content on Sonic Blockchain" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>

      {/* Enhanced Particle Background */}
      <ParticleBackground />

      {/* Cyber Grid Overlay */}
      <div className="fixed inset-0 cyber-grid opacity-20 pointer-events-none z-1"></div>

      <NeonHeader
        isMobile={isMobile}
        onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
        router={router}
        userProfile={userProfile}
        profileLoading={profileLoading}
      />

      <div className="relative z-10">
        <main className={`transition-all duration-500 ${isMobile ? 'pb-24' : ''}`}>

          {/* Animated Categories */}
          <CategoriesBar isMobile={isMobile} />

          {/* Hero Section */}
          <HeroSection />

          {/* Video Grid */}
          <VideoGrid isMobile={isMobile} router={router} />
        </main>
      </div>

      {/* Enhanced Floating Action Button */}
      <NeonFloatingButton />

      {/* Profile Creation Modal */}
      <ProfileCreationModal />
    </div>
  );
}