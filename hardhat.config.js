// hardhat.config.js - UPDATED
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: '.env.local' }); // SPECIFIC PATH

// Debug: Check if environment variables are loaded
console.log("🔧 Hardhat Config Debug:");
console.log("DEPLOYER_PRIVATE_KEY exists:", !!process.env.DEPLOYER_PRIVATE_KEY);
console.log("SONIC_RPC_URL:", process.env.SONIC_RPC_URL);

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    sonicTestnet: {
      url: process.env.SONIC_RPC_URL || "https://rpc.testnet.soniclabs.com",
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
      chainId: 14601,
      gas: 3000000,
      gasPrice: 3000000000,
    }
  },
  etherscan: {
    apiKey: {
      sonicTestnet: process.env.ETHERSCAN_API_KEY || "abc"
    },
    customChains: [
      {
        network: "sonicTestnet",
        chainId: 14601,
        urls: {
          apiURL: "https://testnet.sonicscan.org/api",
          browserURL: "https://testnet.sonicscan.org"
        }
      }
    ]
  }
};