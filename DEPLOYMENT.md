# Deployment Guide

This guide walks you through deploying the ERC-20 Faucet DApp to Sepolia testnet.

## Prerequisites

1. **Get Sepolia ETH**
   - Visit [Sepolia Faucet](https://sepoliafaucet.com/)
   - Or use [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
   - You'll need ~0.5 ETH for deployment and testing

2. **Get an RPC URL**
   - Sign up for [Infura](https://infura.io/) or [Alchemy](https://www.alchemy.com/)
   - Create a new project
   - Copy your Sepolia RPC URL

3. **Get Etherscan API Key**
   - Sign up at [Etherscan](https://etherscan.io/)
   - Go to API Keys section
   - Create a new API key

## Step-by-Step Deployment

### 1. Configure Environment

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```bash
PRIVATE_KEY=your_private_key_here
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
ETHERSCAN_API_KEY=your_etherscan_api_key
```

**⚠️ Security Warning:** Never commit your `.env` file or share your private key!

### 2. Install Dependencies

```bash
npm install
```

### 3. Compile Contracts

```bash
npm run compile
```

You should see output like:

```
Compiled 10 Solidity files successfully
```

### 4. Run Tests (Optional but Recommended)

```bash
npm test
```

All tests should pass:

```
  25 passing (5s)
```

### 5. Deploy to Sepolia

```bash
npm run deploy
```

The deployment script will:

1. Deploy FaucetToken contract
2. Deploy TokenFaucet contract
3. Set faucet as authorized minter
4. Save deployment info to `deployments/sepolia.json`
5. Wait 30 seconds for Etherscan indexing
6. Automatically verify contracts on Etherscan

**Expected output:**

```
Starting deployment...
Deploying contracts with account: 0x742d35Cc...
Account balance: 0.5 ETH

1. Deploying FaucetToken...
✓ FaucetToken deployed to: 0xABCD1234...

2. Deploying TokenFaucet...
✓ TokenFaucet deployed to: 0xEFGH5678...

3. Setting faucet as minter...
✓ Faucet set as minter

✓ Deployment info saved to: deployments/sepolia.json

============================================================
DEPLOYMENT SUMMARY
============================================================
Network: sepolia
Token Address: 0xABCD1234...
Faucet Address: 0xEFGH5678...
============================================================

Waiting 30 seconds for Etherscan to index...

4. Verifying contracts on Etherscan...
✓ Token verified
✓ Faucet verified

✓ Deployment complete!
```

### 6. Verify Deployment

Check your deployment on Etherscan:

- Token: https://sepolia.etherscan.io/address/YOUR_TOKEN_ADDRESS
- Faucet: https://sepolia.etherscan.io/address/YOUR_FAUCET_ADDRESS

### 7. Configure Frontend

Update `frontend/.env`:

```bash
VITE_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
VITE_TOKEN_ADDRESS=0xYourDeployedTokenAddress
VITE_FAUCET_ADDRESS=0xYourDeployedFaucetAddress
VITE_CHAIN_ID=11155111
```

### 8. Update README

Edit `README.md` and update the "Deployed Contracts" section with your addresses:

```markdown
| Contract    | Address               | Etherscan                                                        |
| ----------- | --------------------- | ---------------------------------------------------------------- |
| FaucetToken | `0xYourTokenAddress`  | [View](https://sepolia.etherscan.io/address/0xYourTokenAddress)  |
| TokenFaucet | `0xYourFaucetAddress` | [View](https://sepolia.etherscan.io/address/0xYourFaucetAddress) |
```

### 9. Build and Run Frontend

#### Option A: Docker (Recommended)

```bash
# Update docker-compose.yml with your contract addresses
docker compose up --build

# Access at http://localhost:3000
```

#### Option B: Local Development

```bash
cd frontend
npm install
npm run dev

# Access at http://localhost:3000
```

### 10. Test the DApp

1. Open http://localhost:3000 in your browser
2. Install MetaMask if not already installed
3. Add Sepolia network to MetaMask
4. Get some Sepolia ETH from a faucet
5. Click "Connect MetaMask"
6. Click "Claim Tokens"
7. Confirm the transaction in MetaMask
8. Wait for confirmation
9. Your balance should update!

## Troubleshooting

### Issue: "Insufficient funds for gas"

**Solution:** Get more Sepolia ETH from a faucet

### Issue: "Network mismatch"

**Solution:** Switch MetaMask to Sepolia network

### Issue: "Contract verification failed"

**Solution:** Manually verify using:

```bash
npx hardhat verify --network sepolia TOKEN_ADDRESS
npx hardhat verify --network sepolia FAUCET_ADDRESS TOKEN_ADDRESS
```

### Issue: "Transaction underpriced"

**Solution:** Increase gas price in MetaMask or wait for network to be less congested

### Issue: "Nonce too low"

**Solution:** Reset your account in MetaMask (Settings > Advanced > Reset Account)

## Manual Verification (if auto-verification fails)

### Verify Token Contract

```bash
npx hardhat verify --network sepolia 0xYourTokenAddress
```

### Verify Faucet Contract

```bash
npx hardhat verify --network sepolia 0xYourFaucetAddress 0xYourTokenAddress
```

## Post-Deployment Checklist

- [ ] Both contracts deployed successfully
- [ ] Faucet set as minter in token contract
- [ ] Contracts verified on Etherscan
- [ ] Frontend `.env` updated with addresses
- [ ] README updated with deployment info
- [ ] Application accessible at http://localhost:3000
- [ ] Health endpoint returns 200: http://localhost:3000/health
- [ ] Can connect MetaMask
- [ ] Can claim tokens successfully
- [ ] `window.__EVAL__` functions work

## Next Steps

1. Test all functionality thoroughly
2. Take screenshots of the working application
3. Record a video demonstration
4. Push to GitHub
5. Submit the repository URL

## Gas Cost Estimates

| Operation         | Estimated Gas | Cost @ 30 gwei |
| ----------------- | ------------- | -------------- |
| Deploy Token      | ~1,200,000    | ~0.036 ETH     |
| Deploy Faucet     | ~800,000      | ~0.024 ETH     |
| Set Minter        | ~50,000       | ~0.0015 ETH    |
| First Claim       | ~100,000      | ~0.003 ETH     |
| Subsequent Claims | ~80,000       | ~0.0024 ETH    |

**Total deployment cost:** ~0.065 ETH on Sepolia

## Support

If you encounter issues:

1. Check the error message carefully
2. Review the troubleshooting section
3. Check Hardhat/Etherscan documentation
4. Open an issue on GitHub

---

**Happy deploying! 🚀**
