// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Token.sol";

/**
 * @title TokenFaucet
 * @dev Distributes tokens with rate limiting (cooldown period and lifetime limits)
 */
contract TokenFaucet is ReentrancyGuard, Ownable {
    // Token contract reference
    Token public token;
    
    // Amount of tokens distributed per request (10 tokens with 18 decimals)
    uint256 public constant FAUCET_AMOUNT = 10 * 10**18;
    
    // Cooldown period between claims (24 hours)
    uint256 public constant COOLDOWN_TIME = 24 hours;
    
    // Maximum tokens an address can claim in its lifetime (100 tokens)
    uint256 public constant MAX_CLAIM_AMOUNT = 100 * 10**18;
    
    // Faucet pause state
    bool public paused;
    
    // Mapping to track last claim timestamp for each address
    mapping(address => uint256) public lastClaimAt;
    
    // Mapping to track total claimed amount per address
    mapping(address => uint256) public totalClaimed;
    
    // Events
    event TokensClaimed(address indexed user, uint256 amount, uint256 timestamp);
    event FaucetPaused(bool paused);
    
    /**
     * @dev Constructor initializes the faucet with token contract
     * @param _token Address of the token contract
     */
    constructor(address _token) Ownable(msg.sender) {
        require(_token != address(0), "Token address cannot be zero");
        token = Token(_token);
        paused = false;
    }
    
    /**
     * @dev Allows users to request tokens from the faucet
     */
    function requestTokens() external nonReentrant {
        require(!paused, "Faucet is paused");
        require(canClaim(msg.sender), "Cannot claim at this time");
        
        uint256 remaining = remainingAllowance(msg.sender);
        require(remaining >= FAUCET_AMOUNT, "Lifetime claim limit reached");
        
        // Update state before external call (checks-effects-interactions)
        lastClaimAt[msg.sender] = block.timestamp;
        totalClaimed[msg.sender] += FAUCET_AMOUNT;
        
        // Mint tokens to user
        token.mint(msg.sender, FAUCET_AMOUNT);
        
        emit TokensClaimed(msg.sender, FAUCET_AMOUNT, block.timestamp);
    }
    
    /**
     * @dev Check if an address can currently claim tokens
     * @param user Address to check
     * @return bool True if user can claim, false otherwise
     */
    function canClaim(address user) public view returns (bool) {
        if (paused) return false;
        if (totalClaimed[user] >= MAX_CLAIM_AMOUNT) return false;
        if (lastClaimAt[user] == 0) return true; // First time claiming
        if (block.timestamp >= lastClaimAt[user] + COOLDOWN_TIME) return true;
        return false;
    }
    
    /**
     * @dev Get remaining claimable amount for an address
     * @param user Address to check
     * @return uint256 Remaining claimable tokens
     */
    function remainingAllowance(address user) public view returns (uint256) {
        uint256 claimed = totalClaimed[user];
        if (claimed >= MAX_CLAIM_AMOUNT) return 0;
        return MAX_CLAIM_AMOUNT - claimed;
    }
    
    /**
     * @dev Check if faucet is currently paused
     * @return bool Current pause state
     */
    function isPaused() public view returns (bool) {
        return paused;
    }
    
    /**
     * @dev Pause or unpause the faucet (admin only)
     * @param _paused New pause state
     */
    function setPaused(bool _paused) external onlyOwner {
        paused = _paused;
        emit FaucetPaused(_paused);
    }
    
    /**
     * @dev Get time remaining until user can claim again
     * @param user Address to check
     * @return uint256 Seconds until next claim (0 if can claim now)
     */
    function timeUntilNextClaim(address user) public view returns (uint256) {
        if (lastClaimAt[user] == 0) return 0;
        uint256 nextClaimTime = lastClaimAt[user] + COOLDOWN_TIME;
        if (block.timestamp >= nextClaimTime) return 0;
        return nextClaimTime - block.timestamp;
    }
}
