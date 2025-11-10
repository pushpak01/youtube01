// pages/api/profile/check.js - UPDATED VERSION
import { ethers } from 'ethers';

// Sonic Testnet RPC
const SONIC_RPC = 'https://rpc.testnet.soniclabs.com';
const provider = new ethers.JsonRpcProvider(SONIC_RPC);

// Profile Contract ABI (minimal for checking)
const PROFILE_ABI = [
  "function profileExists(address user) external view returns (bool)",
  "function getProfile(address user) external view returns (tuple(string storjProfileUrl, bytes32 legalNameHash, bool legalNameChanged, uint256 createdAt, uint256 nonce))"
];

// Use the new contract address
const PROFILE_CONTRACT_ADDRESS = process.env.PROFILE_CONTRACT_ADDRESS || '0x801897c550809C5c28A14cbb8b55aF45733b8524';

// Function to convert storj:// URL to downloadable URL
const convertStorjUrlToDownloadable = (storjUrl) => {
  if (!storjUrl || !storjUrl.startsWith('storj://')) {
    return storjUrl;
  }

  // Convert: storj://sonic-profile/profile-pictures/filename.png
  // To: /api/storj/download?file=profile-pictures/filename.png
  const filePath = storjUrl.replace('storj://sonic-profile/', '');
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  return `${baseUrl}/api/storj/download?file=${encodeURIComponent(filePath)}`;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { walletAddress } = req.body;

    console.log('🔍 Checking profile for:', walletAddress);

    // Validate wallet address
    if (!walletAddress || !ethers.isAddress(walletAddress)) {
      console.log('❌ Invalid wallet address:', walletAddress);
      return res.status(400).json({ error: 'Invalid wallet address' });
    }

    // Normalize address
    const normalizedAddress = ethers.getAddress(walletAddress);

    // If no contract deployed yet, return false
    if (!PROFILE_CONTRACT_ADDRESS) {
      console.log('❌ No contract address configured');
      return res.status(200).json({ exists: false });
    }

    console.log('📋 Using contract:', PROFILE_CONTRACT_ADDRESS);

    const contract = new ethers.Contract(PROFILE_CONTRACT_ADDRESS, PROFILE_ABI, provider);

    try {
      const exists = await contract.profileExists(normalizedAddress);
      console.log('📋 Profile exists:', exists);

      // If profile exists, load full profile data
      if (exists) {
        console.log('📦 Loading full profile data...');
        const onChainProfile = await contract.getProfile(normalizedAddress);
        console.log('📋 On-chain profile data:', onChainProfile);

        let profileData = null;
        let storjError = null;

        // Load profile data from Storj if available
        if (onChainProfile.storjProfileUrl && onChainProfile.storjProfileUrl !== '') {
          try {
            // Extract the path from storj:// URL
            const storjUrl = onChainProfile.storjProfileUrl.replace('storj://', '');
            // Remove bucket name from path if present
            const filePath = storjUrl.replace('sonic-profile/', '');

            console.log('📦 Loading Storj data from path:', filePath);

            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
            const storjResponse = await fetch(`${baseUrl}/api/storj/download?file=${encodeURIComponent(filePath)}`);

            if (storjResponse.ok) {
              profileData = await storjResponse.json();
              console.log('✅ Loaded profile data from Storj');

              // Convert profile picture URL to downloadable URL
              if (profileData.profilePicture && profileData.profilePicture.startsWith('storj://')) {
                profileData.profilePicture = convertStorjUrlToDownloadable(profileData.profilePicture);
                console.log('🖼️ Converted profile picture URL:', profileData.profilePicture);
              }
            } else {
              storjError = `Storj response: ${storjResponse.status}`;
              console.log('❌ Storj response not OK:', storjResponse.status);
            }
          } catch (storjError) {
            console.error('❌ Error loading Storj data:', storjError);
            storjError = storjError.message;
          }
        }

        const responseData = {
          exists: true,
          profileData: {
            walletAddress: normalizedAddress,
            storjProfileUrl: onChainProfile.storjProfileUrl,
            legalNameHash: onChainProfile.legalNameHash,
            legalNameChanged: onChainProfile.legalNameChanged,
            createdAt: onChainProfile.createdAt.toString(),
            nonce: onChainProfile.nonce.toString(),
            ...profileData
          },
          storjError: storjError // Include error info for debugging
        };

        console.log('✅ Sending profile data');
        return res.status(200).json(responseData);
      }

      console.log('❌ Profile does not exist');
      return res.status(200).json({ exists: false });
    } catch (error) {
      // If contract call fails, assume no profile
      console.error('❌ Contract call error:', error);
      return res.status(200).json({ exists: false });
    }

  } catch (error) {
    console.error('❌ Profile check error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}