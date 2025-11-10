// pages/api/profile/get.js
import { ethers } from 'ethers';

const SONIC_RPC = 'https://rpc.testnet.soniclabs.com';
const provider = new ethers.JsonRpcProvider(SONIC_RPC);

const PROFILE_ABI = [
  "function getProfile(address user) external view returns (tuple(string storjProfileUrl, bytes32 legalNameHash, bool legalNameChanged, uint256 createdAt, uint256 nonce))"
];

const PROFILE_CONTRACT_ADDRESS = process.env.PROFILE_CONTRACT_ADDRESS || '0x801897c550809C5c28A14cbb8b55aF45733b8524';

// Function to convert storj:// URL to downloadable URL
const convertStorjUrlToDownloadable = (storjUrl) => {
  if (!storjUrl || !storjUrl.startsWith('storj://')) {
    return storjUrl;
  }

  const filePath = storjUrl.replace('storj://sonic-profile/', '');
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  return `${baseUrl}/api/storj/download?file=${encodeURIComponent(filePath)}`;
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { address } = req.query;

    if (!address || !ethers.isAddress(address)) {
      return res.status(400).json({ error: 'Invalid wallet address' });
    }

    if (!PROFILE_CONTRACT_ADDRESS) {
      return res.status(500).json({ error: 'Profile contract not configured' });
    }

    console.log('🔍 Getting profile for:', address);

    const contract = new ethers.Contract(PROFILE_CONTRACT_ADDRESS, PROFILE_ABI, provider);
    const onChainProfile = await contract.getProfile(address);

    if (!onChainProfile || onChainProfile.createdAt === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    console.log('📋 On-chain profile:', onChainProfile);

    // Load profile data from Storj
    let profileData = null;
    if (onChainProfile.storjProfileUrl && onChainProfile.storjProfileUrl !== '') {
      try {
        const storjUrl = onChainProfile.storjProfileUrl.replace('storj://', '');
        const filePath = storjUrl.replace('sonic-profile/', '');

        console.log('📦 Loading Storj data from:', filePath);

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const storjResponse = await fetch(`${baseUrl}/api/storj/download?file=${encodeURIComponent(filePath)}`);

        if (storjResponse.ok) {
          profileData = await storjResponse.json();

          // Convert profile picture URL
          if (profileData.profilePicture && profileData.profilePicture.startsWith('storj://')) {
            profileData.profilePicture = convertStorjUrlToDownloadable(profileData.profilePicture);
          }

          console.log('✅ Loaded profile data from Storj');
        } else {
          console.log('❌ Storj response not OK:', storjResponse.status);
        }
      } catch (error) {
        console.error('❌ Error loading Storj data:', error);
      }
    }

    const responseData = {
      walletAddress: address,
      onChainData: {
        storjProfileUrl: onChainProfile.storjProfileUrl,
        legalNameHash: onChainProfile.legalNameHash,
        legalNameChanged: onChainProfile.legalNameChanged,
        createdAt: onChainProfile.createdAt.toString(),
        nonce: onChainProfile.nonce.toString()
      },
      ...profileData
    };

    console.log('✅ Final profile data:', responseData);
    res.status(200).json(responseData);

  } catch (error) {
    console.error('❌ Profile get error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}