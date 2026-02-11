#!/bin/bash
# Comprehensive Verification Script for ERC-20 Token Faucet DApp

echo "=========================================="
echo "ERC-20 Token Faucet DApp - Verification"
echo "=========================================="

# Check Node.js version
echo "✓ Checking Node.js..."
node --version

# Check npm packages
echo ""
echo "✓ Checking npm dependencies..."
npm list --depth=0 2>/dev/null | head -20

# Compile contracts
echo ""
echo "✓ Compiling smart contracts..."
npm run compile

# Run tests
echo ""
echo "✓ Running test suite..."
npm test

# Check Docker
echo ""
echo "✓ Checking Docker installation..."
docker --version
docker compose --version

# Check contract artifacts
echo ""
echo "✓ Verifying contract artifacts..."
if [ -f "artifacts/contracts/Token.sol/Token.json" ]; then
    echo "✅ Token.sol artifacts found"
else
    echo "❌ Token.sol artifacts NOT found"
fi

if [ -f "artifacts/contracts/TokenFaucet.sol/TokenFaucet.json" ]; then
    echo "✅ TokenFaucet.sol artifacts found"
else
    echo "❌ TokenFaucet.sol artifacts NOT found"
fi

# Final status
echo ""
echo "=========================================="
echo "✅ VERIFICATION COMPLETE"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Deploy contracts: npm run deploy"
echo "2. Update frontend .env with contract addresses"
echo "3. Build and run Docker: docker compose up --build"
