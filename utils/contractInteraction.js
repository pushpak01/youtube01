// utils/contractInteraction.js
import { ethers } from 'ethers';

const SONIC_RPC = process.env.NEXT_PUBLIC_SONIC_RPC || 'https://rpc.testnet.soniclabs.com';

// Profile Contract ABI - FIXED: calldata for signature parameter
export const PROFILE_ABI = [
  "function createProfile(string memory storjUrl, bytes32 legalNameHash, string memory nickname, bytes calldata signature) external",
  "function updateLegalName(bytes32 newLegalNameHash, bytes calldata signature) external",
  "function updateProfile(string memory newStorjUrl, bytes calldata signature) external",
  "function getProfile(address user) external view returns (tuple(string storjProfileUrl, bytes32 legalNameHash, bool legalNameChanged, uint256 createdAt, uint256 nonce))",
  "function profileExists(address user) external view returns (bool)",
  "function getNicknameOwner(string memory nickname) external view returns (address)",
  "event ProfileCreated(address indexed user, string storjUrl, uint256 timestamp)",
  "event LegalNameUpdated(address indexed user, bytes32 newLegalNameHash)",
  "event ProfileUpdated(address indexed user, string newStorjUrl)"
];

export const getProvider = () => {
  return new ethers.JsonRpcProvider(SONIC_RPC);
};

export const getProfileContract = (address, signer = null) => {
  const provider = getProvider();
  const contractSigner = signer || provider;
  return new ethers.Contract(address, PROFILE_ABI, contractSigner);
};

export const checkProfileExists = async (walletAddress, contractAddress) => {
  try {
    const contract = getProfileContract(contractAddress);
    return await contract.profileExists(walletAddress);
  } catch (error) {
    console.error('Error checking profile:', error);
    return false;
  }
};

export const getProfileData = async (walletAddress, contractAddress) => {
  try {
    const contract = getProfileContract(contractAddress);
    return await contract.getProfile(walletAddress);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
};