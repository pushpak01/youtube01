// pages/api/profile/create.js - COMPLETE DEBUG VERSION
import { ethers } from 'ethers';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Array to collect debug events
  const debugEvents = [];

  try {
    const { walletAddress, storjUrl, legalNameHash, nickname, signature } = req.body;

    console.log('📥 Received profile creation request:', {
      walletAddress,
      storjUrl: storjUrl?.substring(0, 50) + '...',
      legalNameHash,
      nickname,
      signatureLength: signature?.length
    });

    // Validate all required fields
    if (!walletAddress || !ethers.isAddress(walletAddress)) {
      return res.status(400).json({ error: 'Invalid wallet address' });
    }

    if (!storjUrl || !storjUrl.startsWith('storj://')) {
      return res.status(400).json({ error: 'Invalid Storj URL' });
    }

    if (!legalNameHash || !ethers.isHexString(legalNameHash, 32)) {
      return res.status(400).json({
        error: 'Invalid legal name hash format. Must be 32 bytes hex string.'
      });
    }

    if (!nickname || !signature) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (nickname.length < 3 || nickname.length > 20) {
      return res.status(400).json({ error: 'Nickname must be 3-20 characters' });
    }

    // IMPORTANT: Create the EXACT same message as frontend
    const message = `Create Profile - ${storjUrl} - ${legalNameHash} - ${nickname} - ${walletAddress.toLowerCase()}`;
    console.log('📝 Verifying message:', message);

    let recoveredAddress;
    try {
      recoveredAddress = ethers.verifyMessage(message, signature);
      console.log('✅ Signature verified. Recovered:', recoveredAddress);
    } catch (sigError) {
      console.error('❌ Signature verification failed:', sigError);
      return res.status(401).json({ error: 'Invalid signature format' });
    }

    if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      console.error('❌ Signature mismatch:', {
        recovered: recoveredAddress,
        expected: walletAddress
      });
      return res.status(401).json({ error: 'Signature verification failed' });
    }

    // Create wallet and contract instance
    const provider = new ethers.JsonRpcProvider(process.env.SONIC_RPC_URL);
    const wallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY, provider);

    const PROFILE_ABI = [
      "function createProfile(string memory storjUrl, bytes32 legalNameHash, string memory nickname, bytes calldata signature) external",
      "function profileExists(address) external view returns (bool)",
      "function testMessage(string memory storjUrl, bytes32 legalNameHash, string memory nickname) external view returns (string memory)",
      "event ProfileCreated(address indexed user, string storjUrl, uint256 timestamp)",
      "event Debug(string message, bytes32 data, address addr)",
      "event DebugMessage(string message)",
      "event DebugHash(bytes32 hash)"
    ];

    const contract = new ethers.Contract(
      process.env.PROFILE_CONTRACT_ADDRESS,
      PROFILE_ABI,
      wallet
    );

    // Check if profile already exists
    const exists = await contract.profileExists(walletAddress);
    if (exists) {
      return res.status(400).json({ error: 'Profile already exists' });
    }

    console.log('⏳ Creating profile on blockchain...', {
      contractAddress: process.env.PROFILE_CONTRACT_ADDRESS,
      legalNameHash
    });

    // Convert signature to bytes format
    const signatureBytes = ethers.getBytes(signature);

    // Debug logging
    console.log('🔍 Final parameters:', {
      storjUrl: storjUrl.length,
      legalNameHash,
      legalNameHashLength: legalNameHash.length,
      nickname: nickname.length,
      signatureBytesLength: signatureBytes.length
    });

    // TEST: Call testMessage function to see what message the contract constructs
    try {
      console.log('🧪 Testing message construction in contract...');
      const contractMessage = await contract.testMessage(storjUrl, legalNameHash, nickname);
      console.log('📝 Contract constructs message:', contractMessage);
      console.log('📝 Frontend constructed message:', message);
      console.log('🔍 Messages match:', contractMessage === message);
    } catch (testError) {
      console.log('⚠️ Could not test message construction:', testError.message);
    }

    // TEST: Use callStatic to simulate the transaction
    try {
      console.log('🧪 Testing with callStatic (simulation)...');
      await contract.createProfile.staticCall(
        storjUrl,
        legalNameHash,
        nickname,
        signatureBytes
      );
      console.log('✅ callStatic simulation succeeded');
    } catch (staticError) {
      console.error('❌ callStatic simulation failed:', staticError);
      debugEvents.push({ type: 'callStaticError', error: staticError.message });

      // Try to get more detailed error information
      if (staticError.info && staticError.info.error) {
        console.error('📋 Detailed error:', staticError.info.error);
      }
      if (staticError.reason) {
        console.error('📋 Revert reason:', staticError.reason);
      }

      return res.status(400).json({
        error: 'Contract simulation failed: ' + staticError.message,
        simulationError: staticError.message
      });
    }

    // Set up event listeners for debug events
    const eventListeners = [];

    const debugListener = contract.on("Debug", (message, data, addr) => {
      const event = { type: 'Debug', message, data, addr, timestamp: Date.now() };
      console.log('🔍 Contract Debug:', event);
      debugEvents.push(event);
    });

    const debugMessageListener = contract.on("DebugMessage", (message) => {
      const event = { type: 'DebugMessage', message, timestamp: Date.now() };
      console.log('🔍 Contract DebugMessage:', event);
      debugEvents.push(event);
    });

    const debugHashListener = contract.on("DebugHash", (hash) => {
      const event = { type: 'DebugHash', hash, timestamp: Date.now() };
      console.log('🔍 Contract DebugHash:', event);
      debugEvents.push(event);
    });

    const profileCreatedListener = contract.on("ProfileCreated", (user, storjUrl, timestamp) => {
      const event = { type: 'ProfileCreated', user, storjUrl, timestamp, timestamp: Date.now() };
      console.log('✅ Contract ProfileCreated:', event);
      debugEvents.push(event);
    });

    eventListeners.push(debugListener, debugMessageListener, debugHashListener, profileCreatedListener);

    // Create profile on blockchain with higher gas
    console.log('🔄 Calling contract createProfile...');
    const tx = await contract.createProfile(
      storjUrl,
      legalNameHash,
      nickname,
      signatureBytes,
      {
        gasLimit: 1500000, // Increased gas limit
        gasPrice: ethers.parseUnits('5', 'gwei') // Higher gas price
      }
    );

    console.log('📮 Transaction sent:', tx.hash);

    // Wait for transaction confirmation
    console.log('⏳ Waiting for transaction confirmation...');
    const receipt = await tx.wait();

    // Remove event listeners
    try {
      contract.removeAllListeners();
    } catch (cleanupError) {
      console.log('⚠️ Event listener cleanup warning:', cleanupError.message);
    }

    // Log all debug events captured
    console.log('📋 Total debug events captured:', debugEvents.length);
    debugEvents.forEach((event, index) => {
      console.log(`🔍 Event ${index}:`, event);
    });

    console.log('✅ Transaction confirmed in block:', receipt.blockNumber);
    console.log('⛽ Gas used:', receipt.gasUsed.toString());
    console.log('💸 Effective gas price:', ethers.formatUnits(receipt.gasPrice, 'gwei'), 'gwei');

    return res.status(200).json({
      success: true,
      transactionHash: tx.hash,
      blockNumber: receipt.blockNumber,
      contractAddress: process.env.PROFILE_CONTRACT_ADDRESS,
      gasUsed: receipt.gasUsed.toString(),
      debugEvents: debugEvents // Include debug events in response for debugging
    });

  } catch (error) {
    console.error('❌ Profile creation error:', error);

    // Log any debug events that were captured before the error
    if (debugEvents.length > 0) {
      console.log('📋 Debug events before error:', debugEvents);
    }

    // Handle specific contract errors
    if (error.reason) {
      return res.status(400).json({
        error: error.reason,
        debugEvents
      });
    }

    if (error.info && error.info.error) {
      return res.status(400).json({
        error: error.info.error.message,
        debugEvents
      });
    }

    if (error.code === 'CALL_EXCEPTION') {
      return res.status(400).json({
        error: 'Transaction reverted. This usually means: profile already exists, nickname taken, or signature verification failed.',
        debugEvents
      });
    }

    return res.status(500).json({
      error: 'Failed to create profile: ' + error.message,
      debugEvents
    });
  }
}