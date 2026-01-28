const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Starting deployment...");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");
  
  // Deploy FaucetToken
  console.log("\n1. Deploying FaucetToken...");
  const FaucetToken = await ethers.getContractFactory("FaucetToken");
  const token = await FaucetToken.deploy();
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("✓ FaucetToken deployed to:", tokenAddress);
  
  // Deploy TokenFaucet
  console.log("\n2. Deploying TokenFaucet...");
  const TokenFaucet = await ethers.getContractFactory("TokenFaucet");
  const faucet = await TokenFaucet.deploy(tokenAddress);
  await faucet.waitForDeployment();
  const faucetAddress = await faucet.getAddress();
  console.log("✓ TokenFaucet deployed to:", faucetAddress);
  
  // Set faucet as minter
  console.log("\n3. Setting faucet as minter...");
  const tx = await token.setMinter(faucetAddress);
  await tx.wait();
  console.log("✓ Faucet set as minter");
  
  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    token: tokenAddress,
    faucet: faucetAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    blockNumber: await ethers.provider.getBlockNumber()
  };
  
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }
  
  const filename = path.join(deploymentsDir, `${hre.network.name}.json`);
  fs.writeFileSync(filename, JSON.stringify(deploymentInfo, null, 2));
  console.log("\n✓ Deployment info saved to:", filename);
  
  // Display summary
  console.log("\n" + "=".repeat(60));
  console.log("DEPLOYMENT SUMMARY");
  console.log("=".repeat(60));
  console.log("Network:", hre.network.name);
  console.log("Token Address:", tokenAddress);
  console.log("Faucet Address:", faucetAddress);
  console.log("=".repeat(60));
  
  // Verification instructions
  if (hre.network.name !== "localhost" && hre.network.name !== "hardhat") {
    console.log("\nTo verify contracts on Etherscan, run:");
    console.log(`npx hardhat verify --network ${hre.network.name} ${tokenAddress}`);
    console.log(`npx hardhat verify --network ${hre.network.name} ${faucetAddress} ${tokenAddress}`);
    
    // Wait for Etherscan to index
    console.log("\nWaiting 30 seconds for Etherscan to index...");
    await new Promise(resolve => setTimeout(resolve, 30000));
    
    // Auto-verify if API key is available
    if (process.env.ETHERSCAN_API_KEY) {
      console.log("\n4. Verifying contracts on Etherscan...");
      try {
        await hre.run("verify:verify", {
          address: tokenAddress,
          constructorArguments: []
        });
        console.log("✓ Token verified");
      } catch (error) {
        console.log("Token verification error:", error.message);
      }
      
      try {
        await hre.run("verify:verify", {
          address: faucetAddress,
          constructorArguments: [tokenAddress]
        });
        console.log("✓ Faucet verified");
      } catch (error) {
        console.log("Faucet verification error:", error.message);
      }
    }
  }
  
  console.log("\n✓ Deployment complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
