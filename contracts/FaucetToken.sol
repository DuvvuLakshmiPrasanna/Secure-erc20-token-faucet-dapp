// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FaucetToken
 * @dev ERC-20 Token with controlled minting for faucet distribution
 */
contract FaucetToken is ERC20, Ownable {
    // Maximum supply of tokens (100 million tokens with 18 decimals)
    uint256 public constant MAX_SUPPLY = 100_000_000 * 10**18;
    
    // Address authorized to mint tokens (faucet contract)
    address public minter;
    
    event MinterUpdated(address indexed newMinter);
    
    /**
     * @dev Constructor sets token name, symbol, and initial owner
     */
    constructor() ERC20("Faucet Token", "FCT") Ownable(msg.sender) {
        // Minter will be set after faucet deployment
    }
    
    /**
     * @dev Sets the authorized minter address (faucet contract)
     * @param _minter Address of the faucet contract
     */
    function setMinter(address _minter) external onlyOwner {
        require(_minter != address(0), "Minter cannot be zero address");
        minter = _minter;
        emit MinterUpdated(_minter);
    }
    
    /**
     * @dev Mints tokens to a specified address
     * @param to Recipient address
     * @param amount Amount of tokens to mint
     */
    function mint(address to, uint256 amount) external {
        require(msg.sender == minter, "Only minter can mint tokens");
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds maximum supply");
        require(to != address(0), "Cannot mint to zero address");
        
        _mint(to, amount);
    }
}
