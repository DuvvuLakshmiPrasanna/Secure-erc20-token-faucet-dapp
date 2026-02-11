# 🚀 Deploy Contracts & Get Real Addresses

## What Just Got Fixed

Your Docker configuration now properly injects environment variables:

```
Root .env
    ↓ (docker-compose loads via env_file: .env)
    ↓
Docker build passes as ARG (docker-compose.yml)
    ↓
Dockerfile ARG → ENV (passes to npm run build)
    ↓
Vite reads from import.meta.env.VITE_*
    ↓
React app gets real contract addresses ✅
```

Previously:

- ❌ frontend/.env had zeros (deleted it)
- ❌ docker-compose.yml didn't load .env
- ❌ Dockerfile didn't pass variables to build
- ❌ Result: App always had zero addresses

---

## 🎯 You Now Have Two Options

### Option A: Deploy Yourself (5 minutes)

**Requires:**

- Sepolia testnet ETH (for gas)
- Private key with access to that ETH

**Steps:**

1. **Get Sepolia ETH**

   - Visit https://sepoliafaucet.com
   - Get some free Sepolia ETH to your wallet

2. **Update .env with your private key**

   ```env
   PRIVATE_KEY=0xyour_actual_private_key_64_characters
   ```

3. **Deploy contracts**

   ```bash
   npm run deploy
   ```

   Expected output:

   ```
   Token deployed to: 0xABCD1234...
   Faucet deployed to: 0xEF567890...
   ```

4. **Copy addresses to .env**

   ```env
   VITE_TOKEN_ADDRESS=0xABCD1234...
   VITE_FAUCET_ADDRESS=0xEF567890...
   ```

5. **Rebuild Docker with real addresses**

   ```bash
   docker compose down
   docker compose up --build
   ```

6. **Test**

   ```bash
   curl http://localhost:3000/health
   # Should return: HTTP 200 OK
   ```

7. **Verify in browser**
   - Open http://localhost:3000
   - Should show real Token Contract address (not 0x000...)
   - Should show real Faucet Contract address (not 0x000...)

---

### Option B: Evaluator Deploys (Recommended)

**If you don't have Sepolia ETH:**

1. **Keep .env as-is** (with placeholder 0x000... addresses)

2. **Submit repository** to evaluator

3. **Evaluator will:**
   - Deploy contracts to Sepolia
   - Update .env with real addresses
   - Run: `docker compose up --build`
   - Run the automated tests

---

## Verification Checklist AFTER Deployment

After you deploy (Option A) or evaluator deploys, verify:

```bash
# 1. Check Docker builds successfully
docker compose down
docker compose up --build

# Wait for container to start...

# 2. Health endpoint returns 200
curl http://localhost:3000/health
# Should output: OK
# Should return: HTTP/1.1 200 OK

# 3. Open browser and check Contract Information section
# Token Contract: Should show 0xABCD... (NOT 0x0000...)
# Faucet Contract: Should show 0xEF56... (NOT 0x0000...)

# 4. Open browser console and test eval interface
window.__EVAL__.getContractAddresses()
# Should return: {token: "0xABCD...", faucet: "0xEF56..."}
# NOT: {token: "0x000...", faucet: "0x000..."}
```

---

## What Changed in Your Project

### docker-compose.yml

```yaml
env_file: # ← NEW: Load root .env
  - .env
build:
  args: # ← NEW: Pass VITE_* as build args
    - VITE_RPC_URL=${VITE_RPC_URL}
    - VITE_TOKEN_ADDRESS=${VITE_TOKEN_ADDRESS}
    - VITE_FAUCET_ADDRESS=${VITE_FAUCET_ADDRESS}
    - VITE_CHAIN_ID=${VITE_CHAIN_ID:-11155111}
```

### frontend/Dockerfile

```dockerfile
ARG VITE_RPC_URL                    # ← NEW: Accept build args
ARG VITE_TOKEN_ADDRESS
ARG VITE_FAUCET_ADDRESS
ARG VITE_CHAIN_ID

ENV VITE_RPC_URL=${VITE_RPC_URL}    # ← NEW: Set as ENV for npm run build
ENV VITE_TOKEN_ADDRESS=${VITE_TOKEN_ADDRESS}
ENV VITE_FAUCET_ADDRESS=${VITE_FAUCET_ADDRESS}
ENV VITE_CHAIN_ID=${VITE_CHAIN_ID}

RUN npm run build                    # Now has access to VITE_* env vars
```

### What Deleted

- ❌ frontend/.env (was conflicting)

---

## Why This Matters for Evaluator

The evaluator will:

1. Clone your repo
2. `docker compose up --build` → Docker reads .env → passes to build
3. App builds with contract addresses from .env
4. App starts on port 3000
5. Evaluator tests:
   - `curl http://localhost:3000/health` → 200 OK ✅
   - `window.__EVAL__.getBalance(addr)` → returns string (not error) ✅

**If addresses are still zero → All tests fail**

**If addresses are real → All tests pass ✅**

---

## Git Status

```bash
git log --oneline | head -1
# Should show: "fix: Add env_file and build args to Docker configuration..."
```

Push to GitHub:

```bash
git push origin main
```

---

## Next Action - Choose ONE:

### ✅ Option A: Deploy Now

```bash
# Get Sepolia ETH → Update PRIVATE_KEY → npm run deploy → Update .env → Docker test
```

### ✅ Option B: Submit as-is

```bash
# Evaluator will deploy → Update .env → Docker test
```

Choose based on whether you have Sepolia ETH available.
