// scripts/deploy.js - FIXED contract name
const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

// Helper function to safely serialize BigInt values
function safeStringify(obj, indent = 2) {
  const replacer = (key, value) => {
    if (typeof value === 'bigint') {
      return value.toString();
    }
    return value;
  };
  return JSON.stringify(obj, replacer, indent);
}

async function main() {
  console.log("🚀 Starting UserProfile contract deployment...");
  console.log("🔧 Network:", network.name);

  const networkInfo = await ethers.provider.getNetwork();
  console.log("🔗 Chain ID:", networkInfo.chainId.toString());

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "SONIC");

  if (balance === 0n) {
    throw new Error("Insufficient balance for deployment");
  }

  // List available contracts
  console.log("📋 Checking available contracts...");

  // Try different possible contract names
  const possibleContractNames = [
    "UserProfileDebug",
    "UserProfileSimple",
    "UserProfile",
    "UserProfileSignatureFixed"
  ];

  let ContractFactory;
  let contractName;

  for (const name of possibleContractNames) {
    try {
      console.log(`🔍 Trying contract: ${name}...`);
      ContractFactory = await ethers.getContractFactory(name);
      contractName = name;
      console.log(`✅ Found contract: ${name}`);
      break;
    } catch (error) {
      console.log(`❌ Contract ${name} not found: ${error.message}`);
    }
  }

  if (!ContractFactory) {
    throw new Error("No valid contract found. Please check your contract names.");
  }

  console.log(`📄 Using contract: ${contractName}`);

  // Estimate gas
  console.log("⏳ Estimating deployment gas...");
  const deploymentTx = await ContractFactory.getDeployTransaction();
  const estimatedGas = await ethers.provider.estimateGas(deploymentTx);
  console.log("⛽ Estimated gas:", estimatedGas.toString());

  // Deploy the contract
  console.log("🛠️ Deploying contract...");
  const contract = await ContractFactory.deploy();

  console.log("📮 Transaction hash:", contract.deploymentTransaction().hash);
  console.log("⏳ Waiting for deployment confirmation...");

  // Wait for deployment to complete
  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();

  console.log("✅ Contract deployed successfully!");
  console.log("📌 Contract address:", contractAddress);

  // Wait for a few confirmations
  console.log("🔍 Waiting for block confirmations...");
  const receipt = await contract.deploymentTransaction().wait(3);
  console.log("✅ Contract confirmed in block:", receipt.blockNumber.toString());
  console.log("⛽ Gas used:", receipt.gasUsed.toString());

  // Save deployment info to a file
  const deploymentInfo = {
    network: network.name,
    chainId: networkInfo.chainId.toString(),
    contractName: contractName,
    contractAddress: contractAddress,
    deployer: deployer.address,
    transactionHash: contract.deploymentTransaction().hash,
    blockNumber: receipt.blockNumber.toString(),
    timestamp: new Date().toISOString(),
    gasUsed: receipt.gasUsed.toString(),
    totalCost: ethers.formatEther(receipt.gasUsed * receipt.gasPrice)
  };

  // Create deployments directory if it doesn't exist
  const deploymentsDir = path.join(__dirname, '..', 'deployments');
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  // Save deployment info
  const deploymentFile = path.join(deploymentsDir, `deployment-${network.name}-${Date.now()}.json`);
  fs.writeFileSync(deploymentFile, safeStringify(deploymentInfo, 2));
  console.log("💾 Deployment info saved to:", deploymentFile);

  // Display next steps
  console.log("\n🎉 Deployment completed successfully!");
  console.log("=".repeat(50));
  console.log("📋 NEXT STEPS:");
  console.log("1. Update your environment file:");
  console.log(`   Add to .env.local:`);
  console.log(`   PROFILE_CONTRACT_ADDRESS=${contractAddress}`);
  console.log("");
  console.log("2. Verify the contract on block explorer:");
  console.log(`   https://testnet.sonicscan.org/address/${contractAddress}`);
  console.log("");
  console.log("3. Restart your Next.js application:");
  console.log("   npm run dev");
  console.log("");
  console.log("4. Test the profile creation functionality");
  console.log("=".repeat(50));

  return { contractAddress, contractName };
}

// Error handling
main()
  .then(({ contractAddress, contractName }) => {
    console.log("\n✨ Deployment process finished!");
    console.log(`📍 Contract: ${contractName}`);
    console.log(`📍 Address: ${contractAddress}`);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });