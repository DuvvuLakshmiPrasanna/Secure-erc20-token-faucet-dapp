# Screenshots Guide

This guide explains how to capture and organize screenshots for the ERC-20 Faucet DApp submission.

## Quick Start

1. **Start the application:**

   ```bash
   docker compose up
   ```

2. **Open in browser:**

   - Navigate to: http://localhost:3000

3. **Capture screenshots** following the specifications below

4. **Save to `screenshots/` directory** with the provide filenames

5. **Verify README links** are working

## Screenshot Specifications

**Format:** PNG
**Resolution:** Minimum 1280x720 (recommended 1920x1080)
**File Size:** Maximum 2 MB per image
**Quality:** High contrast, readable text

## 8 Required Screenshots

### Screenshot 1: Wallet Connection Interface

**Filename:** `01-wallet-connection.png`
**Content:**

- DApp homepage/landing page
- "Connect Wallet" button prominently visible
- No connected wallet address shown
- Clean, initial state UI
- MetaMask extension visible in address bar (optional but helpful)

**Steps to capture:**

1. Open http://localhost:3000 in fresh browser tab
2. Ensure MetaMask is installed and visible
3. Screenshot shows initial state before connection

---

### Screenshot 2: Connected Dashboard - Initial State

**Filename:** `02-dashboard-initial.png`
**Content:**

- Wallet connected successfully
- User address displayed (e.g., 0x742d35... format)
- Balance showing: **0 FCT**
- "Connect Wallet" button changed to "Disconnect" or address shown
- "Claim Tokens" button visible and enabled
- "Check Eligibility" status showing ready to claim
- Clean interface layout

**Steps to capture:**

1. Click "Connect Wallet" button
2. Approve wallet connection in MetaMask
3. Wait for page to update and display balance
4. Screenshot the connected state with 0 balance

---

### Screenshot 3: Token Balance Display

**Filename:** `03-token-balance.png`
**Content:**

- After successful token claim
- Balance updated to: **10 FCT**
- Cooldown timer visible (showing ~23:59:00 remaining)
- Real-time balance display
- Transaction status or confirmation message
- No errors displayed

**Steps to capture:**

1. From previous state, click "Claim Tokens"
2. Approve transaction in MetaMask
3. Wait for confirmation (~15-30 seconds)
4. Verify balance updates to 10 FCT
5. Screenshot the updated state

---

### Screenshot 4: Successful Claim Transaction

**Filename:** `04-claim-success.png`
**Content:**

- Success message/notification visible
- Transaction hash displayed
- Updated balance shown
- Cooldown timer activated
- "Claim Tokens" button now disabled (greyed out)
- Clear confirmation feedback
- Optional: Transaction link to Etherscan

**Steps to capture:**

1. Continue from previous claim
2. Look for success notification/toast message
3. Verify button state changed to disabled
4. Screenshot showing clear success feedback

---

### Screenshot 5: Transaction Confirmation Flow

**Filename:** `05-transaction-confirmation.png`
**Content:**

- MetaMask modal/popup visible
- Transaction details shown:
  - From address
  - To address (TokenFaucet contract)
  - Gas fees
  - Token value (10 FCT)
- "Confirm" and "Reject" buttons visible
- Network shown (Sepolia)
- Function name: `requestTokens` or similar

**Steps to capture:**

1. Click "Claim Tokens" button
2. MetaMask confirmation modal appears
3. Screenshot the modal before clicking confirm
4. Capture all transaction details

---

### Screenshot 6: Cooldown Error State

**Filename:** `06-cooldown-error.png`
**Content:**

- Error message clearly displayed
- Message text: "Cooldown period not elapsed" or similar
- Shows time remaining (e.g., "23:58:00 remaining")
- "Claim Tokens" button disabled (greyed out)
- Timer countdown visible
- Red/warning styling for error
- No successful claim possible

**Steps to capture:**

1. After claimed tokens (from previous screenshots)
2. Click "Claim Tokens" again immediately
3. Capture the error message and disabled button state
4. Show the remaining cooldown time

---

### Screenshot 7: Lifetime Limit Error

**Filename:** `07-lifetime-limit-error.png`
**Content:**

- Error message clearly displayed
- Message text: "Lifetime claim limit reached" or "100 FCT limit exceeded"
- Show balance at max (100 FCT or close to it)
- "Claim Tokens" button disabled
- Clear explanation that no more claims possible
- Error styling prominent

**Steps to capture:**

1. In development/test environment, mock reaching 100 FCT limit
2. Alternative: Show UI design for this state
3. Display error message and disabled state
4. Can be taken after wallet reset or in test network

---

### Screenshot 8: Faucet Paused State

**Filename:** `08-faucet-paused.png`
**Content:**

- Information/alert message displayed
- Message: "Faucet is paused" or similar
- "Claim Tokens" button disabled
- Optional: Show when faucet will be unpaused
- Red/warning styling
- Clear indication no claims available
- UI still responsive and connected

**Steps to capture:**

1. Use admin account to pause faucet (tested in contracts)
2. Or manually modify frontend state for screenshot
3. Capture the paused state message
4. Show disabled claim button
5. Alternative: Design mockup of this state

---

## Capturing Screenshots

### Using Browser Dev Tools

1. Press `F12` to open Developer Tools
2. Click device toggle (mobile/desktop) for responsive testing
3. Set resolution to 1280x720 or higher
4. Use browser screenshot:
   - Chrome: `Ctrl+Shift+S` or DevTools icon
   - Firefox: Right-click → "Take Screenshot"
   - Safari: Command+Shift+Shift+4

### Using System Screenshot Tools

- **Windows:** Snipping Tool or Windows + Shift + S
- **macOS:** Command + Shift + 4
- **Linux:** PrintScreen or Screenshot app

### Using OBS Studio (Professional)

1. Install OBS Studio (free)
2. Create Scene with Browser capture
3. Set resolution to 1920x1080
4. Take individual screenshots via OBS

## Organizing Screenshots

```
screenshots/
├── 01-wallet-connection.png
├── 02-dashboard-initial.png
├── 03-token-balance.png
├── 04-claim-success.png
├── 05-transaction-confirmation.png
├── 06-cooldown-error.png
├── 07-lifetime-limit-error.png
└── 08-faucet-paused.png
```

## Verifying README Links

After adding screenshots, verify links work:

```markdown
# In README.md:

![Wallet Connection](screenshots/01-wallet-connection.png)
```

**Testing links:**

1. Push changes to GitHub
2. View raw README on GitHub
3. Verify images load correctly
4. Check file names match exactly (case-sensitive)

## Tips for Better Screenshots

1. **Clear UI State**

   - Close notifications/toasts before capturing
   - Ensure no error overlays
   - Center content on screen

2. **Visible Content**

   - Zoom at 100% or 125% for readability
   - Include address/numbers clearly
   - Show button states (enabled/disabled)

3. **Professional Quality**

   - Consistent lighting
   - No debug console visible (unless needed)
   - Minimal window chrome
   - Consistent resolution across all images

4. **Context Information**
   - Include relevant UI elements
   - Show state indicators (connected/disconnected)
   - Display balances and timers clearly
   - Include error messages fully

## Troubleshooting

**Screenshot 2 (Initial State):**
If you don't have test ETH:

- Use testnet faucet: https://sepoliafaucet.com/
- Wait for transaction to finalize (~1 min)
- Then proceed with claiming

**Screenshots 3-4 (After Claim):**
Requires successful transaction:

- Verify MetaMask is connected
- Confirm you have testnet ETH for gas
- Check contract addresses in frontend/.env
- Monitor browser console for errors

**Screenshots 6-8 (Error States):**
Can be created by:

- Taking another screenshot after first claim (cooldown error)
- Setting up test conditions
- Creating manual UI mockups
- Using browser dev tools to modify DOM

## Adding Screenshots to README

Once all screenshots are captured:

1. **Move files to repository:**

   ```bash
   cp *.png erc20-web3-faucet-dapp/screenshots/
   ```

2. **Commit and push:**

   ```bash
   git add screenshots/
   git commit -m "feat: add application screenshots for submission"
   git push origin main
   ```

3. **Verify in GitHub:**
   - Visit repository on GitHub
   - Navigate to README.md
   - Confirm all screenshot images render

## Support

If you encounter issues:

1. **Docker not working?**

   ```bash
   docker compose down
   docker compose up --build
   ```

2. **Frontend not loading?**

   - Check http://localhost:3000/health
   - Should return HTTP 200

3. **Images not showing in README?**
   - Check file paths are relative: `screenshots/filename.png`
   - Ensure files are in screenshots/ directory
   - Verify filenames match exactly
   - Push changes to GitHub

---

**Ready to capture?** Here's the quick checklist:

- [ ] Docker running: `docker compose up`
- [ ] Frontend accessible: http://localhost:3000
- [ ] MetaMask connected and funded
- [ ] Follow 8 steps above for each screenshot
- [ ] Save files to `screenshots/` directory
- [ ] Commit and push to GitHub
- [ ] Verify images render in README

**Estimated time:** 15-20 minutes
