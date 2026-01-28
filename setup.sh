#!/bin/bash

# Quick Start Script for ERC-20 Faucet DApp

echo "================================"
echo "ERC-20 Faucet DApp Setup"
echo "================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Check if Node.js is installed
echo -e "${YELLOW}Checking prerequisites...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js is not installed!${NC}"
    echo -e "${YELLOW}Please install Node.js from https://nodejs.org/${NC}"
    exit 1
fi

NODE_VERSION=$(node --version)
echo -e "${GREEN}✓ Node.js installed: $NODE_VERSION${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}✗ npm is not installed!${NC}"
    exit 1
fi

NPM_VERSION=$(npm --version)
echo -e "${GREEN}✓ npm installed: $NPM_VERSION${NC}"

echo ""
echo -e "${CYAN}================================${NC}"
echo -e "${CYAN}Step 1: Installing Dependencies${NC}"
echo -e "${CYAN}================================${NC}"

echo -e "${YELLOW}Installing root dependencies...${NC}"
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Failed to install root dependencies${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Root dependencies installed${NC}"

echo -e "${YELLOW}Installing frontend dependencies...${NC}"
cd frontend
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Failed to install frontend dependencies${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
cd ..

echo ""
echo -e "${CYAN}================================${NC}"
echo -e "${CYAN}Step 2: Environment Setup${NC}"
echo -e "${CYAN}================================${NC}"

if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Creating .env file...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ Created .env file${NC}"
    echo -e "${YELLOW}⚠ IMPORTANT: Edit .env and add your private key and RPC URL${NC}"
else
    echo -e "${GREEN}✓ .env file already exists${NC}"
fi

if [ ! -f "frontend/.env" ]; then
    echo -e "${YELLOW}Creating frontend/.env file...${NC}"
    cp frontend/.env.example frontend/.env
    echo -e "${GREEN}✓ Created frontend/.env file${NC}"
else
    echo -e "${GREEN}✓ frontend/.env file already exists${NC}"
fi

echo ""
echo -e "${CYAN}================================${NC}"
echo -e "${CYAN}Step 3: Compiling Contracts${NC}"
echo -e "${CYAN}================================${NC}"

echo -e "${YELLOW}Compiling smart contracts...${NC}"
npm run compile

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Failed to compile contracts${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Contracts compiled successfully${NC}"

echo ""
echo -e "${CYAN}================================${NC}"
echo -e "${CYAN}Step 4: Running Tests${NC}"
echo -e "${CYAN}================================${NC}"

echo -e "${YELLOW}Running smart contract tests...${NC}"
npm test

if [ $? -ne 0 ]; then
    echo -e "${YELLOW}⚠ Some tests failed. Please review the output.${NC}"
else
    echo -e "${GREEN}✓ All tests passed!${NC}"
fi

echo ""
echo -e "${CYAN}================================${NC}"
echo -e "${CYAN}Setup Complete!${NC}"
echo -e "${CYAN}================================${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo ""
echo -e "1. Configure .env file with your credentials:"
echo "   - Add your private key"
echo "   - Add Sepolia RPC URL (Infura or Alchemy)"
echo "   - Add Etherscan API key"
echo ""
echo -e "2. Deploy to Sepolia testnet:"
echo -e "   ${CYAN}npm run deploy${NC}"
echo ""
echo "3. Update frontend/.env with deployed addresses"
echo ""
echo -e "4. Start the application:"
echo -e "   ${CYAN}docker compose up --build${NC}"
echo -e "   OR"
echo -e "   ${CYAN}cd frontend && npm run dev${NC}"
echo ""
echo "5. Access the app at: http://localhost:3000"
echo ""
echo -e "${YELLOW}For detailed instructions, see:${NC}"
echo "  - DEPLOYMENT.md for deployment guide"
echo "  - DEVELOPMENT.md for development guide"
echo "  - README.md for full documentation"
echo ""
echo -e "${CYAN}================================${NC}"
