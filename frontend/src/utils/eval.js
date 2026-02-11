import web3Service from './web3.js';

/**
 * Evaluation Interface - Exposes programmatic access to dApp functionality
 * This interface is used by the automated testing system
 */
export function setupEvalInterface() {
  window.__EVAL__ = {
    /**
     * Connect wallet and return the connected address
     * @returns {Promise<string>} Connected address as string
     */
    connectWallet: async () => {
      try {
        const address = await web3Service.connectWallet();
        if (!address) {
          throw new Error('No address returned from wallet connection');
        }
        return address;
      } catch (error) {
        throw new Error(`Failed to connect wallet: ${error.message}`);
      }
    },

    /**
     * Request tokens from faucet
     * @returns {Promise<string>} Transaction hash
     */
    requestTokens: async () => {
      try {
        const txHash = await web3Service.requestTokens();
        if (!txHash) {
          throw new Error('No transaction hash returned');
        }
        return txHash;
      } catch (error) {
        throw new Error(`Failed to request tokens: ${error.message}`);
      }
    },

    /**
     * Get token balance for an address
     * @param {string} address - Ethereum address
     * @returns {Promise<string>} Balance in base units as string
     */
    getBalance: async (address) => {
      try {
        if (!address || !address.startsWith('0x')) {
          throw new Error('Invalid address format');
        }
        const balance = await web3Service.getBalance(address);
        return balance;
      } catch (error) {
        throw new Error(`Failed to get balance: ${error.message}`);
      }
    },

    /**
     * Check if address can claim tokens
     * @param {string} address - Ethereum address
     * @returns {Promise<boolean>} True if address can claim, false otherwise
     */
    canClaim: async (address) => {
      try {
        if (!address || !address.startsWith('0x')) {
          throw new Error('Invalid address format');
        }
        const canClaim = await web3Service.canClaim(address);
        return canClaim;
      } catch (error) {
        throw new Error(`Failed to check claim eligibility: ${error.message}`);
      }
    },

    /**
     * Get remaining claimable amount for address
     * @param {string} address - Ethereum address
     * @returns {Promise<string>} Remaining allowance in base units as string
     */
    getRemainingAllowance: async (address) => {
      try {
        if (!address || !address.startsWith('0x')) {
          throw new Error('Invalid address format');
        }
        const allowance = await web3Service.getRemainingAllowance(address);
        return allowance;
      } catch (error) {
        throw new Error(`Failed to get remaining allowance: ${error.message}`);
      }
    },

    /**
     * Get contract addresses
     * @returns {Promise<Object>} Object with token and faucet addresses
     */
    getContractAddresses: async () => {
      try {
        const addresses = web3Service.getContractAddresses();
        if (!addresses.token || !addresses.faucet) {
          throw new Error('Contract addresses not configured');
        }
        return {
          token: addresses.token,
          faucet: addresses.faucet
        };
      } catch (error) {
        throw new Error(`Failed to get contract addresses: ${error.message}`);
      }
    },

    /**
     * Get health status
     * @returns {Promise<Object>} Health check result
     */
    getHealth: async () => {
      return {
        status: 'ok',
        timestamp: new Date().toISOString()
      };
    }
  };
}
