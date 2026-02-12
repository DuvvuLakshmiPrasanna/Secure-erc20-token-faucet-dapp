# Screenshots Directory

This directory contains screenshots of the ERC-20 Token Faucet DApp demonstrating all user interfaces and states.

## Files to Add

Follow the SCREENSHOTS_GUIDE.md for detailed instructions on capturing each screenshot.

### Required Screenshots:

1. **01-wallet-connection.png** - Initial DApp state with "Connect Wallet" button
2. **02-dashboard-initial.png** - Connected wallet showing 0 FCT balance
3. **03-token-balance.png** - After successful claim showing 10 FCT balance
4. **04-claim-success.png** - Success confirmation with transaction details
5. **05-transaction-confirmation.png** - MetaMask transaction confirmation modal
6. **06-cooldown-error.png** - Error state showing cooldown period not elapsed
7. **07-lifetime-limit-error.png** - Error state showing lifetime limit reached
8. **08-faucet-paused.png** - Error state showing faucet is paused

## Instructions

1. Open `../SCREENSHOTS_GUIDE.md` for detailed capture instructions
2. Follow the step-by-step guide for each screenshot
3. Save PNG files in this directory with exact filenames above
4. Recommended resolution: 1280x720 or higher
5. Maximum file size: 2 MB per image

## Verification

After adding all screenshots:

```bash
# Verify files exist
ls -la screenshots/

# Should show 8 PNG files
# Commit and push
git add screenshots/
git commit -m "feat: add application screenshots for submission"
git push
```

## README Integration

Screenshots are embedded in README.md using relative paths:

```markdown
![Alt text](screenshots/01-wallet-connection.png)
```

All links are already configured in README.md - just add the image files!
