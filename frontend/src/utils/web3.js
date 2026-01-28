import { ethers } from 'ethers';
import { TOKEN_ABI, FAUCET_ABI } from './contracts';

const RPC_URL = import.meta.env.VITE_RPC_URL || 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY';
const TOKEN_ADDRESS = import.meta.env.VITE_TOKEN_ADDRESS || '';
const FAUCET_ADDRESS = import.meta.env.VITE_FAUCET_ADDRESS || '';
const CHAIN_ID = import.meta.env.VITE_CHAIN_ID || '11155111'; // Sepolia

class Web3Service {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.tokenContract = null;
    this.faucetContract = null;
    this.currentAccount = null;
  }

  // Initialize provider (read-only)
  getProvider() {
    if (!this.provider) {
      this.provider = new ethers.JsonRpcProvider(RPC_URL);
    }
    return this.provider;
  }

  // Check if MetaMask is installed
  isMetaMaskInstalled() {
    return typeof window.ethereum !== 'undefined';
  }

  // Connect wallet
  async connectWallet() {
    if (!this.isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed. Please install MetaMask to use this dApp.');
    }

    try {
      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found. Please unlock MetaMask.');
      }

      this.currentAccount = accounts[0];

      // Create provider and signer from MetaMask
      const provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await provider.getSigner();

      // Check network
      const network = await provider.getNetwork();
      const chainId = network.chainId.toString();

      if (chainId !== CHAIN_ID) {
        await this.switchNetwork();
      }

      // Initialize contracts with signer
      this.tokenContract = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, this.signer);
      this.faucetContract = new ethers.Contract(FAUCET_ADDRESS, FAUCET_ABI, this.signer);

      return this.currentAccount;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  }

  // Switch to correct network
  async switchNetwork() {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${parseInt(CHAIN_ID).toString(16)}` }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        throw new Error('Please add Sepolia network to MetaMask');
      }
      throw switchError;
    }
  }

  // Disconnect wallet
  disconnectWallet() {
    this.signer = null;
    this.tokenContract = null;
    this.faucetContract = null;
    this.currentAccount = null;
  }

  // Get token balance
  async getBalance(address) {
    try {
      const contract = this.tokenContract || new ethers.Contract(
        TOKEN_ADDRESS,
        TOKEN_ABI,
        this.getProvider()
      );
      const balance = await contract.balanceOf(address);
      return balance.toString();
    } catch (error) {
      console.error('Error getting balance:', error);
      throw new Error('Failed to get token balance');
    }
  }

  // Check if user can claim
  async canClaim(address) {
    try {
      const contract = this.faucetContract || new ethers.Contract(
        FAUCET_ADDRESS,
        FAUCET_ABI,
        this.getProvider()
      );
      return await contract.canClaim(address);
    } catch (error) {
      console.error('Error checking claim eligibility:', error);
      throw new Error('Failed to check claim eligibility');
    }
  }

  // Get remaining allowance
  async getRemainingAllowance(address) {
    try {
      const contract = this.faucetContract || new ethers.Contract(
        FAUCET_ADDRESS,
        FAUCET_ABI,
        this.getProvider()
      );
      const allowance = await contract.remainingAllowance(address);
      return allowance.toString();
    } catch (error) {
      console.error('Error getting remaining allowance:', error);
      throw new Error('Failed to get remaining allowance');
    }
  }

  // Get time until next claim
  async getTimeUntilNextClaim(address) {
    try {
      const contract = this.faucetContract || new ethers.Contract(
        FAUCET_ADDRESS,
        FAUCET_ABI,
        this.getProvider()
      );
      const time = await contract.timeUntilNextClaim(address);
      return Number(time);
    } catch (error) {
      console.error('Error getting cooldown time:', error);
      return 0;
    }
  }

  // Request tokens from faucet
  async requestTokens() {
    if (!this.faucetContract || !this.signer) {
      throw new Error('Wallet not connected. Please connect your wallet first.');
    }

    try {
      const tx = await this.faucetContract.requestTokens();
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('Error requesting tokens:', error);
      
      // Parse error message
      if (error.message.includes('Faucet is paused')) {
        throw new Error('The faucet is currently paused. Please try again later.');
      } else if (error.message.includes('Cannot claim at this time')) {
        throw new Error('You must wait 24 hours between claims.');
      } else if (error.message.includes('Lifetime claim limit reached')) {
        throw new Error('You have reached the maximum claim limit.');
      } else if (error.message.includes('user rejected')) {
        throw new Error('Transaction was rejected.');
      } else {
        throw new Error('Failed to claim tokens. Please try again.');
      }
    }
  }

  // Get contract addresses
  getContractAddresses() {
    return {
      token: TOKEN_ADDRESS,
      faucet: FAUCET_ADDRESS
    };
  }

  // Listen to account changes
  onAccountsChanged(callback) {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', callback);
    }
  }

  // Listen to chain changes
  onChainChanged(callback) {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', callback);
    }
  }
}

// Create singleton instance
const web3Service = new Web3Service();

// Expose evaluation interface
window.__EVAL__ = {
  connectWallet: async () => {
    try {
      const address = await web3Service.connectWallet();
      return address;
    } catch (error) {
      throw new Error(`Failed to connect wallet: ${error.message}`);
    }
  },

  requestTokens: async () => {
    try {
      const txHash = await web3Service.requestTokens();
      return txHash;
    } catch (error) {
      throw new Error(`Failed to request tokens: ${error.message}`);
    }
  },

  getBalance: async (address) => {
    try {
      if (!address) {
        throw new Error('Address parameter is required');
      }
      const balance = await web3Service.getBalance(address);
      return balance;
    } catch (error) {
      throw new Error(`Failed to get balance: ${error.message}`);
    }
  },

  canClaim: async (address) => {
    try {
      if (!address) {
        throw new Error('Address parameter is required');
      }
      const canClaim = await web3Service.canClaim(address);
      return canClaim;
    } catch (error) {
      throw new Error(`Failed to check claim eligibility: ${error.message}`);
    }
  },

  getRemainingAllowance: async (address) => {
    try {
      if (!address) {
        throw new Error('Address parameter is required');
      }
      const allowance = await web3Service.getRemainingAllowance(address);
      return allowance;
    } catch (error) {
      throw new Error(`Failed to get remaining allowance: ${error.message}`);
    }
  },

  getContractAddresses: async () => {
    return web3Service.getContractAddresses();
  }
};

export default web3Service;
