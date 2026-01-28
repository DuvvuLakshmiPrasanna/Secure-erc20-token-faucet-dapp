# Quick Start Script for ERC-20 Faucet DApp

Write-Host "================================" -ForegroundColor Cyan
Write-Host "ERC-20 Faucet DApp Setup" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking prerequisites..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "✓ npm installed: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ npm is not installed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Step 1: Installing Dependencies" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

Write-Host "Installing root dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to install root dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Root dependencies installed" -ForegroundColor Green

Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location frontend
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to install frontend dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Frontend dependencies installed" -ForegroundColor Green
Set-Location ..

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Step 2: Environment Setup" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

if (-Not (Test-Path ".env")) {
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✓ Created .env file" -ForegroundColor Green
    Write-Host "⚠ IMPORTANT: Edit .env and add your private key and RPC URL" -ForegroundColor Yellow
} else {
    Write-Host "✓ .env file already exists" -ForegroundColor Green
}

if (-Not (Test-Path "frontend\.env")) {
    Write-Host "Creating frontend/.env file..." -ForegroundColor Yellow
    Copy-Item "frontend\.env.example" "frontend\.env"
    Write-Host "✓ Created frontend/.env file" -ForegroundColor Green
} else {
    Write-Host "✓ frontend/.env file already exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Step 3: Compiling Contracts" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

Write-Host "Compiling smart contracts..." -ForegroundColor Yellow
npm run compile

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to compile contracts" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Contracts compiled successfully" -ForegroundColor Green

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Step 4: Running Tests" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

Write-Host "Running smart contract tests..." -ForegroundColor Yellow
npm test

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠ Some tests failed. Please review the output." -ForegroundColor Yellow
} else {
    Write-Host "✓ All tests passed!" -ForegroundColor Green
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Configure .env file with your credentials:" -ForegroundColor White
Write-Host "   - Add your private key" -ForegroundColor White
Write-Host "   - Add Sepolia RPC URL (Infura or Alchemy)" -ForegroundColor White
Write-Host "   - Add Etherscan API key" -ForegroundColor White
Write-Host ""
Write-Host "2. Deploy to Sepolia testnet:" -ForegroundColor White
Write-Host "   npm run deploy" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Update frontend/.env with deployed addresses" -ForegroundColor White
Write-Host ""
Write-Host "4. Start the application:" -ForegroundColor White
Write-Host "   docker compose up --build" -ForegroundColor Cyan
Write-Host "   OR" -ForegroundColor Yellow
Write-Host "   cd frontend && npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "5. Access the app at: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "For detailed instructions, see:" -ForegroundColor Yellow
Write-Host "  - DEPLOYMENT.md for deployment guide" -ForegroundColor White
Write-Host "  - DEVELOPMENT.md for development guide" -ForegroundColor White
Write-Host "  - README.md for full documentation" -ForegroundColor White
Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
