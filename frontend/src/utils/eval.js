import web3Service from "./web3.js";

/**
 * Directly attach evaluation interface to window
 * This avoids tree-shaking issues in production builds
 */

window.__EVAL__ = {
  connectWallet: async () => {
    const address = await web3Service.connectWallet();
    if (!address) throw new Error("Wallet connection failed");
    return String(address);
  },

  requestTokens: async () => {
    const txHash = await web3Service.requestTokens();
    if (!txHash) throw new Error("Transaction failed");
    return String(txHash);
  },

  getBalance: async (address) => {
    const balance = await web3Service.getBalance(address);
    return balance.toString();
  },

  canClaim: async (address) => {
    const result = await web3Service.canClaim(address);
    return Boolean(result);
  },

  getRemainingAllowance: async (address) => {
    const allowance = await web3Service.getRemainingAllowance(address);
    return allowance.toString();
  },

  getContractAddresses: async () => {
    return {
      token: import.meta.env.VITE_TOKEN_ADDRESS,
      faucet: import.meta.env.VITE_FAUCET_ADDRESS
    };
  }
};