// components/ProfileCreationModal.js - UPDATED VERSION
import { useState, useEffect } from 'react';
import { X, Lock, User, Eye, EyeOff, Shield, Upload } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { encryptData, generateEncryptionKey } from '../utils/encryption';

export default function ProfileCreationModal() {
  const {
    isConnected,
    walletAddress,
    signMessage,
    setShowWalletModal
  } = useWallet();

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [legalName, setLegalName] = useState('');
  const [nickname, setNickname] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [bio, setBio] = useState('');
  const [showLegalNameWarning, setShowLegalNameWarning] = useState(false);

  // Security state
  const [encryptionKey, setEncryptionKey] = useState('');
  const [isEncryptionSetup, setIsEncryptionSetup] = useState(false);

  // Check if profile exists when wallet connects
  useEffect(() => {
    if (isConnected && walletAddress) {
      checkProfileExists();
    }
  }, [isConnected, walletAddress]);

  const checkProfileExists = async () => {
    try {
      console.log('🔍 Checking if profile exists for:', walletAddress);
      const response = await fetch('/api/profile/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress })
      });

      const { exists } = await response.json();
      console.log('📋 Profile exists:', exists);

      if (!exists) {
        console.log('🎯 Opening profile creation modal');
        setIsOpen(true);
        initializeEncryption();
      } else {
        console.log('✅ Profile already exists, keeping modal closed');
        setIsOpen(false);
      }
    } catch (error) {
      console.error('❌ Error checking profile:', error);
    }
  };

  const initializeEncryption = async () => {
    try {
      console.log('🔐 Setting up encryption...');
      // Generate encryption key from wallet signature
      const message = `Sonic YouTube Profile Encryption - ${walletAddress} - ${Date.now()}`;
      const signed = await signMessage(message);

      // Derive encryption key from signature
      const key = await generateEncryptionKey(signed.signature);
      setEncryptionKey(key);
      setIsEncryptionSetup(true);
      console.log('✅ Encryption setup complete');
    } catch (error) {
      console.error('❌ Failed to setup security:', error);
      setError('Failed to setup security: ' + error.message);
    }
  };

  const handleLegalNameChange = (value) => {
    setLegalName(value);
    if (!showLegalNameWarning && value.trim().length > 0) {
      setShowLegalNameWarning(true);
    }
  };

  const handleProfilePicture = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate image
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Profile picture must be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      setProfilePicture(file);
      setError('');
    }
  };

  const uploadProfilePicture = async (file) => {
    console.log('📤 Uploading profile picture...');
    const formData = new FormData();
    formData.append('profileImage', file);

    const response = await fetch('/api/storj/upload', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to upload image');
    }

    const { fileUrl } = await response.json();
    console.log('✅ Profile picture uploaded:', fileUrl);
    return fileUrl;
  };

  const createProfileData = async () => {
    let profilePictureUrl = '';

    // Upload profile picture if selected
    if (profilePicture) {
      profilePictureUrl = await uploadProfilePicture(profilePicture);
    }

    // Create profile JSON for Storj
    const profileData = {
      nickname: nickname.trim(),
      profilePicture: profilePictureUrl,
      bio: bio.trim(),
      socialLinks: {},
      watchHistory: [],
      totalRewardsEarned: "0",
      preferences: {
        autoplay: true,
        quality: "1080p"
      },
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    // Generate the filename using wallet address
    const filename = `profiles/${walletAddress}/profile.json`;
    console.log('💾 Creating profile data:', profileData);

    // Upload profile data to Storj
    const storjResponse = await fetch('/api/storj/upload-json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename: filename,
        data: profileData
      })
    });

    if (!storjResponse.ok) {
      const errorData = await storjResponse.json();
      throw new Error(errorData.error || 'Failed to upload profile data');
    }

    const { fileUrl } = await storjResponse.json();
    console.log('✅ Profile data uploaded to Storj:', fileUrl);
    return fileUrl;
  };

  // FIXED: Proper hash generation function
  const generateLegalNameHash = async (encryptedData) => {
    try {
      // Convert string to bytes properly for hashing
      const encoder = new TextEncoder();
      const data = encoder.encode(encryptedData);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      // Ensure it's exactly 64 characters (32 bytes)
      if (hashHex.length !== 64) {
        throw new Error('Invalid hash length: ' + hashHex.length);
      }

      return hashHex;
    } catch (error) {
      console.error('❌ Hash generation error:', error);
      throw new Error('Failed to generate legal name hash: ' + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log('🚀 Starting profile creation...');

      // Validation
      if (!legalName.trim() || !nickname.trim()) {
        throw new Error('Legal name and nickname are required');
      }

      if (nickname.length < 3 || nickname.length > 20) {
        throw new Error('Nickname must be 3-20 characters');
      }

      if (!isEncryptionSetup) {
        throw new Error('Security setup incomplete');
      }

      // Encrypt legal name
      console.log('🔐 Encrypting legal name...');
      const encryptedLegalName = await encryptData(legalName.trim(), encryptionKey);

      // Generate hash properly
      console.log('🔍 Generating legal name hash...');
      const legalNameHashHex = await generateLegalNameHash(encryptedLegalName);
      const legalNameHashBytes32 = '0x' + legalNameHashHex; // Add 0x prefix for bytes32

      console.log('🔐 Hash generation:', {
        encryptedLength: encryptedLegalName.length,
        hashHex: legalNameHashHex,
        hashBytes32: legalNameHashBytes32
      });

      // Create profile data on Storj
      console.log('📦 Creating profile data on Storj...');
      const storjProfileUrl = await createProfileData();

      // IMPORTANT: Create the exact message that will be verified
      // This must match EXACTLY what the contract expects
      const message = `Create Profile - ${storjProfileUrl} - ${legalNameHashBytes32} - ${nickname} - ${walletAddress.toLowerCase()}`;

      console.log("📝 Signing message:", message);
      const signature = await signMessage(message);

      console.log('📝 Profile creation details:', {
          walletAddress,
          storjUrl: storjProfileUrl,
          legalNameHash: legalNameHashBytes32,
          nickname,
          signatureLength: signature.signature.length,
          messageLength: message.length
      });

      // Create profile on blockchain
      console.log('⛓️ Creating profile on blockchain...');
      const response = await fetch('/api/profile/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress,
          storjUrl: storjProfileUrl,
          legalNameHash: legalNameHashBytes32,
          nickname: nickname.trim(),
          signature: signature.signature
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create profile');
      }

      const result = await response.json();
      console.log('✅ Profile created successfully:', result);

      // Success - close modal
      setIsOpen(false);

      // Show success message and trigger reload
      window.dispatchEvent(new CustomEvent('profileCreated', {
         detail: {
           transactionHash: result.transactionHash,
           walletAddress: walletAddress
         }
      }));

      // Clear form
      setLegalName('');
      setNickname('');
      setProfilePicture(null);
      setBio('');

    } catch (error) {
      console.error('❌ Profile creation error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl max-w-md w-full p-6 border border-gray-700 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white">Create Your Profile</h3>
            <p className="text-gray-400 text-sm mt-1">
              Secure, decentralized identity setup
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
            disabled={isLoading}
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Security Status */}
        <div className={`mb-4 p-3 rounded-lg border ${
          isEncryptionSetup
            ? 'bg-green-500/20 border-green-500/50'
            : 'bg-blue-500/20 border-blue-500/50'
        }`}>
          <div className="flex items-center space-x-2">
            <Shield size={16} className={
              isEncryptionSetup ? 'text-green-400' : 'text-blue-400'
            } />
            <span className={`text-sm font-medium ${
              isEncryptionSetup ? 'text-green-400' : 'text-blue-400'
            }`}>
              {isEncryptionSetup ? 'Security Active' : 'Setting up security...'}
            </span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Legal Name Warning */}
        {showLegalNameWarning && (
          <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
            <div className="flex items-start space-x-2">
              <Lock size={16} className="text-yellow-400 mt-0.5" />
              <div>
                <p className="text-yellow-400 text-sm font-medium">
                  One-Time Change
                </p>
                <p className="text-yellow-300 text-xs mt-1">
                  Your legal name can only be changed once. Please verify it's correct.
                  This information is encrypted and visible only to you.
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Legal Name */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-white mb-2">
              <Lock size={16} />
              <span>Legal Name</span>
            </label>
            <input
              type="text"
              value={legalName}
              onChange={(e) => handleLegalNameChange(e.target.value)}
              placeholder="Your government name"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              required
              disabled={isLoading}
            />
            <p className="text-gray-400 text-xs mt-1">
              Encrypted and private • One-time change only
            </p>
          </div>

          {/* Nickname */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-white mb-2">
              <User size={16} />
              <span>Public Nickname</span>
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Your public username"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              minLength={3}
              maxLength={20}
              required
              disabled={isLoading}
            />
            <p className="text-gray-400 text-xs mt-1">
              Visible to everyone • Can be changed later
            </p>
          </div>

          {/* Profile Picture */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-white mb-2">
              <Upload size={16} />
              <span>Profile Picture</span>
            </label>
            <div className="flex items-center space-x-4">
              {profilePicture && (
                <img
                  src={URL.createObjectURL(profilePicture)}
                  alt="Preview"
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
              <label className="flex-1 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePicture}
                  className="hidden"
                  disabled={isLoading}
                />
                <div className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 hover:bg-gray-700 transition-colors text-center">
                  {profilePicture ? 'Change Image' : 'Choose Image'}
                </div>
              </label>
            </div>
            <p className="text-gray-400 text-xs mt-1">
              Optional • Max 5MB • Stored on decentralized storage
            </p>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell everyone about yourself..."
              rows={3}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
              maxLength={160}
              disabled={isLoading}
            />
            <p className="text-gray-400 text-xs mt-1">
              {bio.length}/160 characters
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !isEncryptionSetup}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating Secure Profile...</span>
              </>
            ) : (
              <span>Create Secure Profile</span>
            )}
          </button>
        </form>

        {/* Security Footer */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex items-center space-x-2 text-gray-400 text-xs">
            <Shield size={12} />
            <span>
              Your data is encrypted and stored on decentralized networks
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}