# Development Guide

This guide covers local development, testing, and advanced usage.

## Development Setup

### 1. Install Dependencies

```bash
# Root dependencies (Hardhat)
npm install

# Frontend dependencies
cd frontend
npm install
cd ..
```

### 2. Local Blockchain Development

#### Start Local Hardhat Node

```bash
npx hardhat node
```

This starts a local Ethereum node with:

- 20 pre-funded accounts
- Instant mining
- Console logging
- Fork capability

#### Deploy to Local Node

In a new terminal:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

#### Update Frontend for Local Development

Edit `frontend/.env`:

```bash
VITE_RPC_URL=http://127.0.0.1:8545
VITE_TOKEN_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
VITE_FAUCET_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
VITE_CHAIN_ID=31337
```

## Testing

### Run All Tests

```bash
npm test
```

### Run Specific Test File

```bash
npx hardhat test test/TokenFaucet.test.js
```

### Run with Gas Reporting

```bash
REPORT_GAS=true npm test
```

Output:

```
·----------------------------------------|---------------------------|-------------|-----------------------------·
|  Solc version: 0.8.20                  ·  Optimizer enabled: true  ·  Runs: 200  ·  Block limit: 30000000 gas  │
·········································|···························|·············|······························
|  Methods                                                                                                        │
·················|·······················|·············|·············|·············|···············|··············
|  Contract      ·  Method               ·  Min        ·  Max        ·  Avg        ·  # calls      ·  usd (avg)  │
·················|·······················|·············|·············|·············|···············|··············
|  TokenFaucet   ·  requestTokens        ·      80000  ·     100000  ·      90000  ·           15  ·          -  │
·················|·······················|·············|·············|·············|···············|··············
```

### Test Coverage

```bash
npx hardhat coverage
```

Generates coverage report in `coverage/` directory.

### Watch Mode (Auto-run tests on change)

```bash
npx hardhat watch test
```

## Frontend Development

### Development Server

```bash
cd frontend
npm run dev
```

- Hot module replacement (HMR)
- Fast refresh
- Instant updates

### Build for Production

```bash
cd frontend
npm run build
```

Outputs optimized build to `dist/` directory.

### Preview Production Build

```bash
cd frontend
npm run preview
```

## Smart Contract Development

### Compile Contracts

```bash
npx hardhat compile
```

Outputs:

- `artifacts/` - Compiled contracts
- `cache/` - Compilation cache
- `typechain-types/` - TypeScript types

### Clean Build Artifacts

```bash
npx hardhat clean
```

### Console (Interactive)

```bash
npx hardhat console --network localhost
```

Example usage:

```javascript
const Token = await ethers.getContractFactory("FaucetToken");
const token = await Token.attach("0x5FbDB...");
const balance = await token.balanceOf("0x742d...");
console.log(ethers.formatEther(balance));
```

## Advanced Testing

### Time Manipulation

Test cooldown periods:

```javascript
const { time } = require("@nomicfoundation/hardhat-network-helpers");

// Fast forward 24 hours
await time.increase(24 * 60 * 60);

// Set specific timestamp
await time.increaseTo(1234567890);
```

### Impersonation

Test as different accounts:

```javascript
const {
  impersonateAccount,
} = require("@nomicfoundation/hardhat-network-helpers");

await impersonateAccount("0x742d35Cc...");
const signer = await ethers.getSigner("0x742d35Cc...");
```

### Snapshot & Revert

Save and restore blockchain state:

```javascript
const { takeSnapshot } = require("@nomicfoundation/hardhat-network-helpers");

const snapshot = await takeSnapshot();

// Make changes
await faucet.requestTokens();

// Restore
await snapshot.restore();
```

## Debugging

### Console Logging in Solidity

```solidity
import "hardhat/console.sol";

function requestTokens() external {
    console.log("User:", msg.sender);
    console.log("Balance:", token.balanceOf(msg.sender));
}
```

### Stack Traces

Hardhat provides detailed stack traces for reverts:

```
Error: VM Exception while processing transaction: reverted with reason string 'Cannot claim at this time'
    at TokenFaucet.requestTokens (contracts/TokenFaucet.sol:45)
    at processTicksAndRejections (node:internal/process/task_queues:95:5)
```

### Debugging Frontend

Open browser console and check:

```javascript
// Check if MetaMask is installed
console.log(window.ethereum);

// Check evaluation interface
console.log(window.__EVAL__);

// Test functions
await window.__EVAL__.getContractAddresses();
```

## Docker Development

### Build Image

```bash
docker build -t faucet-frontend ./frontend
```

### Run Container

```bash
docker run -p 3000:3000 \
  -e VITE_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY \
  -e VITE_TOKEN_ADDRESS=0x... \
  -e VITE_FAUCET_ADDRESS=0x... \
  faucet-frontend
```

### Debug Container

```bash
# Shell into running container
docker exec -it faucet-frontend sh

# Check nginx logs
docker logs faucet-frontend

# Test health endpoint
docker exec faucet-frontend wget -O- http://localhost:3000/health
```

## Code Quality

### Linting

Install Solhint:

```bash
npm install --save-dev solhint
```

Create `.solhint.json`:

```json
{
  "extends": "solhint:recommended",
  "rules": {
    "compiler-version": ["error", "^0.8.0"],
    "func-visibility": ["warn", { "ignoreConstructors": true }]
  }
}
```

Run linter:

```bash
npx solhint 'contracts/**/*.sol'
```

### Formatting

Install Prettier:

```bash
npm install --save-dev prettier prettier-plugin-solidity
```

Create `.prettierrc`:

```json
{
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": false,
  "overrides": [
    {
      "files": "*.sol",
      "options": {
        "printWidth": 100,
        "tabWidth": 4,
        "useTabs": false,
        "singleQuote": false,
        "bracketSpacing": false
      }
    }
  ]
}
```

Format code:

```bash
npx prettier --write 'contracts/**/*.sol'
npx prettier --write 'frontend/src/**/*.{js,jsx}'
```

## Performance Optimization

### Gas Optimization

1. **Use `calldata` for read-only parameters**

```solidity
function process(uint256[] calldata data) external {
    // More gas efficient than memory
}
```

2. **Pack storage variables**

```solidity
struct User {
    uint128 lastClaim;    // Pack into single slot
    uint128 totalClaimed; // Pack into single slot
}
```

3. **Use events instead of storage**

```solidity
event DataStored(uint256 value);
emit DataStored(value); // Cheaper than storage
```

### Frontend Optimization

1. **Lazy loading**

```javascript
const Component = lazy(() => import("./Component"));
```

2. **Memoization**

```javascript
const memoizedValue = useMemo(() => expensiveCalc(), [deps]);
```

3. **Debouncing**

```javascript
const debouncedUpdate = useCallback(
  debounce(() => loadData(), 500),
  [],
);
```

## Useful Commands

```bash
# Hardhat
npx hardhat help                    # Show all commands
npx hardhat accounts                # List accounts
npx hardhat node                    # Start local node
npx hardhat compile                 # Compile contracts
npx hardhat test                    # Run tests
npx hardhat coverage               # Test coverage
npx hardhat clean                  # Clean artifacts

# Frontend
npm run dev                         # Start dev server
npm run build                       # Build for production
npm run preview                     # Preview production build

# Docker
docker compose up                   # Start all services
docker compose down                 # Stop all services
docker compose logs                 # View logs
docker compose ps                   # List containers
docker compose build                # Rebuild images
```

## Project Structure

```
erc20-web3-faucet-dapp/
├── contracts/              # Solidity contracts
│   ├── FaucetToken.sol
│   └── TokenFaucet.sol
├── test/                   # Test files
│   └── TokenFaucet.test.js
├── scripts/                # Deployment scripts
│   └── deploy.js
├── frontend/               # React frontend
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── utils/
│   │       ├── contracts.js
│   │       └── web3.js
│   ├── Dockerfile
│   └── nginx.conf
├── deployments/            # Deployment artifacts
├── hardhat.config.js       # Hardhat configuration
├── docker-compose.yml      # Docker configuration
├── package.json           # Node dependencies
└── README.md              # Documentation
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Run tests and linting
6. Submit a pull request

## Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)
- [Ethers.js Documentation](https://docs.ethers.org)
- [React Documentation](https://react.dev)
- [Solidity Documentation](https://docs.soliditylang.org)

---

**Happy coding! 💻**
