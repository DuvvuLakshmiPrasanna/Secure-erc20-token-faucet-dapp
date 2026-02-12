# Video Demonstration Guide

This file provides guidance for recording and uploading the video demonstration for the ERC-20 Token Faucet DApp submission.

## Video Requirements

- **Duration:** 2-5 minutes
- **Resolution:** 1280x720 minimum (1920x1080 recommended)
- **Format:** MP4, MOV, or WebM
- **Audio:** Optional (text overlays recommended)
- **Frame Rate:** 30 FPS or higher

## What to Show in Video

### Segment 1: Wallet Connection (0:00-0:30)

- Launch the DApp at http://localhost:3000
- Show initial state with "Connect Wallet" button
- Click "Connect Wallet"
- MetaMask popup appears
- Approve connection in MetaMask
- Show connected wallet address

### Segment 2: Initial Dashboard (0:30-1:00)

- Display connected wallet address
- Show initial balance: **0 FCT**
- Show "Claim Tokens" button (enabled)
- Show remaining allowance: **100 FCT**
- Point out UI elements

### Segment 3: Claiming Tokens (1:00-2:00)

- Click "Claim Tokens" button
- MetaMask confirmation modal appears
- Narrate/overlay: "Reviewing transaction details"
- Click "Confirm" in MetaMask
- Show transaction hash in browser
- Wait for confirmation (~15-30 seconds with text overlay "Processing...")
- Balance updates to **10 FCT**
- Cooldown timer appears showing **~23:59:00**
- Show success message/notification

### Segment 4: Cooldown Period (2:00-3:00)

- Attempt to click "Claim Tokens" again
- Show button is now disabled/greyed out
- Display error message: "Cooldown period not elapsed"
- Show countdown timer in real-time (1-2 seconds of countdown)
- Narrate/overlay explaining the 24-hour requirement
- Show remaining allowance still available: **90 FCT**

### Segment 5: Transaction Verification (3:00-3:30)

- Show transaction hash link
- (Optional) Click link to Etherscan
- Demonstrate viewing transaction on blockchain
- Show contract interaction details

### Segment 6: Error Handling (3:30-4:00)

- Demonstrate attempting invalid actions
- Show wallet rejection flow (or at least mention it)
- Display clear error messages
- Show UI handles errors gracefully

## Recording Software Options

### Option A: OBS Studio (Recommended - Free)

1. Download: https://obsproject.com/
2. Create new Scene
3. Add Browser source: http://localhost:3000
4. Set resolution: 1920x1080
5. Record using Ctrl+R
6. Output formats: MP4, MOV, WebM

### Option B: Loom (Free with limits)

1. Visit: https://www.loom.com/
2. Install extension
3. Open http://localhost:3000
4. Click Loom button to record
5. Automatically uploads to Loom
6. Share link in README

### Option C: QuickTime (macOS)

1. Open QuickTime Player
2. File → New Screen Recording
3. Select window to record
4. Adjust resolution to at least 1280x720
5. Click Record button
6. Save as MP4

### Option D: Windows 10/11 Game Bar

1. Open http://localhost:3000
2. Press Windows + G
3. Click "Record"
4. Video saves to Videos folder
5. Edit if needed

## Recording Tips

1. **Cursor Highlighting**

   - Enable in OBS or recording software
   - Helps viewers follow actions
   - Makes clicks visible

2. **Text Overlays**

   - Add with OBS or editing software
   - Label each section
   - Explain what's happening

3. **Test First**

   - Do a practice run
   - Ensure audio (if used) is clear
   - Verify application state
   - Check all buttons work

4. **Stable Network**

   - Close background apps
   - Disable auto-updates
   - Use wired internet if possible
   - Reduces lag/stuttering

5. **Clean UI**
   - Close unnecessary windows
   - Max out browser window
   - Remove debug console
   - Consistent resolution

## Recording Checklist

Before recording:

- [ ] Docker running: `docker compose up`
- [ ] Frontend accessible: http://localhost:3000
- [ ] MetaMask installed and configured
- [ ] Test wallet has Sepolia ETH
- [ ] Recording software installed
- [ ] Sufficient disk space (at least 500 MB)
- [ ] Network stable and fast

During recording:

- [ ] Speak clearly (if narrating)
- [ ] Move cursor slowly so viewers can follow
- [ ] Pause briefly at key moments
- [ ] Show error states clearly
- [ ] Demonstrate all features

## Uploading Options

### Option 1: YouTube (Recommended)

1. Create YouTube account if needed
2. Go to https://www.youtube.com/
3. Click Profile → Create a Channel
4. Click Upload button
5. Select your video file
6. Set title and description
7. Choose "Unlisted" for privacy
8. Publish
9. Copy video URL
10. Add to README in format:
    ```
    [Watch Demo](https://www.youtube.com/watch?v=VIDEO_ID)
    ```

### Option 2: Loom (Easiest)

1. Sign up at https://www.loom.com/
2. Install extension
3. Record directly from browser
4. Loom handles hosting
5. Share link in README:
   ```
   [Watch Demo](https://loom.com/share/SHARE_ID)
   ```

### Option 3: Repository File

If file size < 100 MB:

1. Add directly to repository
2. Name: `erc20-faucet-demo.mp4`
3. Push to GitHub
4. Link in README:
   ```
   [Watch Demo](erc20-faucet-demo.mp4)
   ```

### Option 4: GitHub Releases

1. Create a Release on GitHub
2. Upload video as asset
3. Copy asset URL
4. Link in README

## README Integration

After uploading video:

**For YouTube:**

```markdown
## 🎥 Video Demonstration

[Watch Full Demo on YouTube](https://www.youtube.com/watch?v=YOUR_VIDEO_ID)

Duration: 4 minutes | Resolution: 1920x1080 | Topics: Wallet Connection, Token Claiming, Cooldown, Error Handling
```

**For Loom:**

```markdown
## 🎥 Video Demonstration

[Watch Full Demo on Loom](https://www.loom.com/share/YOUR_SHARE_ID)

Duration: 4 minutes | Topics: Wallet Connection, Token Claiming, Cooldown, Error Handling
```

## Common Issues & Solutions

**Issue: Video is too dark/hard to see**

- Solution: Increase brightness in recording software
- Adjust camera/screen settings before recording

**Issue: Audio is unclear or missing**

- Solution: Test microphone separately
- Record in quiet environment
- Use text overlays instead of narration

**Issue: Video is too large**

- Solution: Export at lower bitrate (720p is usually sufficient)
- Compress with HandBrake (free tool)
- Use OBS output settings to control quality

**Issue: Loom recording is choppy**

- Solution: Close background applications
- Reduce browser window size
- Record in 720p instead of 1080p
- Check network speeds

**Issue: YouTube upload fails**

- Solution: Check file format (.mp4 recommended)
- Verify file size isn't too large
- Ensure YouTube account is verified
- Try uploading during off-peak hours

## Estimated Timeline

- Recording: 10-15 minutes
- Reviewing/Editing: 10-20 minutes
- Uploading/Processing: 5-10 minutes
- Total: ~30-45 minutes

## Final Checklist

- [ ] Video recorded showing all required segments
- [ ] Duration between 2-5 minutes
- [ ] Resolution at least 1280x720
- [ ] All features demonstrated
- [ ] Error states shown
- [ ] Audio/overlays clear and professional
- [ ] Video uploaded to platform (YouTube/Loom/GitHub)
- [ ] Link added to README
- [ ] Link tested and works
- [ ] Video is publicly accessible
- [ ] Changes committed and pushed

---

**Need help?** Check the official guides:

- OBS Studio: https://obsproject.com/wiki/
- Loom: https://support.loom.com/
- YouTube: https://support.google.com/youtube/

**Ready to record?** Start with the recommended segments above and you'll have a professional demo!
