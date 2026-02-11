# 🚀 Deployment & Running Guide

## ✅ Status

- ✅ All 24 tests passing
- ✅ Compilation successful
- ✅ Docker containers cleaned up
- ✅ Ready for deployment/testing

---

## 📝 Correct Commands

### For Testing & Development

```bash
# Compile contracts
npm run compile

# Run all tests
npm test

# Run tests with gas reporter (optional)
REPORT_GAS=true npm test
```

### For Deploying to Sepolia

**Important:** Use `--` to pass arguments through npm

```bash
# Deploy to Sepolia testnet (REQUIRES credentials in .env)
npm run deploy -- --network sepolia

# The .env file must have:
# - PRIVATE_KEY=your_private_key
# - SEPOLIA_RPC_URL=your_infura_or_alchemy_url
# - ETHERSCAN_API_KEY=your_etherscan_api_key
```

### For Frontend Development

```bash
cd frontend

# Install dependencies (one-time)
npm install

# Start development server
npm run dev
# Access at http://localhost:5173

# Build for production
npm run build

# Preview production build
npm run preview
```

### For Running with Docker

```bash
# Build and start the container
docker compose up --build

# Access the frontend at http://localhost:3000
# Check health endpoint: http://localhost:3000/health

# Stop the container
docker compose down

# Rebuild from scratch
docker compose up --build --force-recreate
```

---

## ⚙️ Configuration

### Root `.env` (for deployment)

```bash
PRIVATE_KEY=0x... # Your wallet's private key
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
ETHERSCAN_API_KEY=YOUR_API_KEY
```

### Frontend `.env` (after deployment)

```bash
VITE_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
VITE_TOKEN_ADDRESS=0xYourDeployedTokenAddress
VITE_FAUCET_ADDRESS=0xYourDeployedFaucetAddress
VITE_CHAIN_ID=11155111
```

---

## 🔧 Troubleshooting

### Docker Port Already in Use

```bash
# Clean up containers and networks
docker compose down --remove-orphans

# Then restart
docker compose up
```

### Need Fresh Compilation

```bash
# Clean build artifacts
npx hardhat clean

# Recompile
npm run compile
```

### Tests Failing

```bash
# Run tests with detailed output
npx hardhat test --verbose
```

### Cannot Deploy - Missing Credentials

```bash
# Copy example config
cp .env.example .env

# Edit .env with your actual credentials
# - Get private key from MetaMask
# - Generate Infura/Alchemy project
# - Generate Etherscan API key
```

---

## 📊 Quick Reference

| Task             | Command                               | Notes                     |
| ---------------- | ------------------------------------- | ------------------------- |
| Compile          | `npm run compile`                     | For testing only          |
| Test             | `npm test`                            | All 24 tests pass         |
| Deploy           | `npm run deploy -- --network sepolia` | Requires .env credentials |
| Dev Server       | `cd frontend && npm run dev`          | Runs on port 5173         |
| Docker           | `docker compose up`                   | Runs on port 3000         |
| Verify Contracts | `npm run verify`                      | After deployment          |
| Check Health     | `curl http://localhost:3000/health`   | Docker only               |

---

## ✅ Pre-Deployment Checklist

Before deploying to Sepolia:

- [ ] Have testnet ETH in deployment wallet (0.1+ ETH recommended)
- [ ] Update `.env` with valid credentials
- [ ] Run `npm test` to ensure all tests pass
- [ ] Test locally with Hardhat network first
- [ ] Save deployment addresses after successful deployment

---

## 🎯 What Happens During Deployment

When you run `npm run deploy -- --network sepolia`:

1. Deploys Token contract
2. Deploys TokenFaucet contract with Token address
3. Sets faucet as authorized minter
4. Save deployment info to `deployments/sepolia.json`
5. (Optional) Verifies contracts on Etherscan
6. Displays all contract addresses

---

**Everything is now configured and ready to use!**
