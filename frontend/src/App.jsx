import { useState, useEffect } from "react";
import { ethers } from "ethers";
import web3Service from "./utils/web3";
import "./App.css";

function App() {
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("0");
  const [canClaim, setCanClaim] = useState(false);
  const [remainingAllowance, setRemainingAllowance] = useState("0");
  const [cooldownTime, setCooldownTime] = useState(0);
  const [loading, setLoading] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [message, setMessage] = useState(null);
  const [contracts, setContracts] = useState({ token: "", faucet: "" });

  useEffect(() => {
    // Get contract addresses
    const addresses = web3Service.getContractAddresses();
    setContracts(addresses);

    // Listen for account changes
    web3Service.onAccountsChanged((accounts) => {
      if (accounts.length === 0) {
        handleDisconnect();
      } else {
        setAccount(accounts[0]);
        loadUserData(accounts[0]);
      }
    });

    // Listen for chain changes
    web3Service.onChainChanged(() => {
      window.location.reload();
    });
  }, []);

  useEffect(() => {
    if (account) {
      loadUserData(account);
      const interval = setInterval(() => {
        loadUserData(account);
      }, 10000); // Refresh every 10 seconds

      return () => clearInterval(interval);
    }
  }, [account]);

  useEffect(() => {
    if (cooldownTime > 0) {
      const interval = setInterval(() => {
        setCooldownTime((prev) => {
          if (prev <= 1) {
            loadUserData(account);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [cooldownTime, account]);

  const loadUserData = async (address) => {
    try {
      const [bal, claim, allowance, cooldown] = await Promise.all([
        web3Service.getBalance(address),
        web3Service.canClaim(address),
        web3Service.getRemainingAllowance(address),
        web3Service.getTimeUntilNextClaim(address),
      ]);

      setBalance(bal);
      setCanClaim(claim);
      setRemainingAllowance(allowance);
      setCooldownTime(cooldown);
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const handleConnect = async () => {
    setLoading(true);
    setMessage(null);

    try {
      if (!web3Service.isMetaMaskInstalled()) {
        setMessage({
          type: "error",
          text: "MetaMask is not installed. Please install MetaMask to use this dApp.",
        });
        return;
      }

      const address = await web3Service.connectWallet();
      setAccount(address);
      setConnected(true);
      setMessage({
        type: "success",
        text: "Wallet connected successfully!",
      });

      await loadUserData(address);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setMessage({
        type: "error",
        text: error.message || "Failed to connect wallet",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    web3Service.disconnectWallet();
    setConnected(false);
    setAccount("");
    setBalance("0");
    setCanClaim(false);
    setRemainingAllowance("0");
    setCooldownTime(0);
    setMessage(null);
  };

  const handleClaim = async () => {
    if (!canClaim || claiming) return;

    setClaiming(true);
    setMessage(null);

    try {
      const txHash = await web3Service.requestTokens();

      setMessage({
        type: "success",
        text: `Tokens claimed successfully! Transaction: ${txHash.substring(0, 10)}...`,
      });

      // Reload data after successful claim
      await loadUserData(account);
    } catch (error) {
      console.error("Error claiming tokens:", error);
      setMessage({
        type: "error",
        text: error.message || "Failed to claim tokens",
      });
    } finally {
      setClaiming(false);
    }
  };

  const formatBalance = (balance) => {
    try {
      return ethers.formatEther(balance);
    } catch {
      return "0";
    }
  };

  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const formatTime = (seconds) => {
    if (seconds === 0) return "Ready to claim!";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>🚰 ERC-20 Token Faucet</h1>
          <p>Get free test tokens on Sepolia testnet</p>
        </header>

        {message && (
          <div className={`alert alert-${message.type}`}>
            <span className="alert-icon">
              {message.type === "success"
                ? "✓"
                : message.type === "error"
                  ? "✕"
                  : "⚠"}
            </span>
            <span>{message.text}</span>
          </div>
        )}

        <div className="card wallet-section">
          <h2>Wallet Connection</h2>

          {!connected ? (
            <div style={{ textAlign: "center", padding: "2rem 0" }}>
              <p
                style={{
                  marginBottom: "1.5rem",
                  color: "var(--text-secondary)",
                }}
              >
                Connect your MetaMask wallet to get started
              </p>
              <button
                className="btn btn-primary btn-large"
                onClick={handleConnect}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Connecting...
                  </>
                ) : (
                  <>🦊 Connect MetaMask</>
                )}
              </button>
            </div>
          ) : (
            <>
              <div className="wallet-info">
                <div>
                  <div className="status-badge status-connected">
                    <span className="status-dot"></span>
                    Connected
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--text-secondary)",
                      marginBottom: "0.25rem",
                    }}
                  >
                    Your Address
                  </div>
                  <div className="address">{formatAddress(account)}</div>
                </div>
                <button
                  className="btn btn-secondary"
                  onClick={handleDisconnect}
                >
                  Disconnect
                </button>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-label">Token Balance</div>
                  <div className="stat-value">
                    {parseFloat(formatBalance(balance)).toFixed(2)}
                    <span className="stat-unit">FCT</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Remaining Allowance</div>
                  <div className="stat-value">
                    {parseFloat(formatBalance(remainingAllowance)).toFixed(0)}
                    <span className="stat-unit">FCT</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {connected && (
          <div className="card claim-section">
            <h2>Claim Tokens</h2>

            <div className="claim-info">
              <div className="stat-label">
                {canClaim && cooldownTime === 0
                  ? "Ready to Claim"
                  : "Next Claim Available In"}
              </div>
              <div className="cooldown-timer">{formatTime(cooldownTime)}</div>
              <p
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "0.9rem",
                  marginTop: "0.5rem",
                }}
              >
                Receive 10 FCT tokens per claim
              </p>
            </div>

            <button
              className="btn btn-primary btn-large"
              onClick={handleClaim}
              disabled={!canClaim || claiming || cooldownTime > 0}
            >
              {claiming ? (
                <>
                  <span className="spinner"></span>
                  Claiming Tokens...
                </>
              ) : cooldownTime > 0 ? (
                `Wait ${formatTime(cooldownTime)}`
              ) : !canClaim ? (
                "Cannot Claim"
              ) : (
                "💧 Claim Tokens"
              )}
            </button>

            {remainingAllowance === "0" && (
              <div
                className="alert alert-warning"
                style={{ marginTop: "1rem" }}
              >
                <span className="alert-icon">⚠</span>
                <span>You have reached the maximum claim limit.</span>
              </div>
            )}
          </div>
        )}

        <div className="card">
          <h3 style={{ marginBottom: "1rem" }}>Contract Information</h3>
          <div className="contract-links">
            <div>
              <strong>Token Contract:</strong>{" "}
              <a
                href={`https://sepolia.etherscan.io/address/${contracts.token}`}
                target="_blank"
                rel="noopener noreferrer"
                className="contract-link"
              >
                {contracts.token || "Not deployed"}
              </a>
            </div>
            <div>
              <strong>Faucet Contract:</strong>{" "}
              <a
                href={`https://sepolia.etherscan.io/address/${contracts.faucet}`}
                target="_blank"
                rel="noopener noreferrer"
                className="contract-link"
              >
                {contracts.faucet || "Not deployed"}
              </a>
            </div>
          </div>
        </div>

        <footer className="footer">
          <p>Built with React, Ethers.js, and Solidity</p>
          <p style={{ marginTop: "0.5rem" }}>
            Network: Sepolia Testnet • Cooldown: 24 hours • Limit: 100 FCT per
            address
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
