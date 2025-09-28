import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Users, Play, Activity, Camera, Wallet, Trophy, Zap, Crown, Star } from "lucide-react";
import { ethers } from "ethers";
import GlassCard from "../components/GlassCard";
import NeonButton from "../components/NeonButton";
import outputSquatGif from "../gifs/output_squat.gif";
import { HARDCODED_CONTESTS, getTimeRemaining } from "../data/contests";
import { API_CONFIG } from "../config/api";

const ChallengePage = () => {
  const [showContestModal, setShowContestModal] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [selectedContest, setSelectedContest] = useState(null);
  const [account, setAccount] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [balance, setBalance] = useState("0");
  const [isStaking, setIsStaking] = useState(false);
  const [stakingStatus, setStakingStatus] = useState("");
  const [contests, setContests] = useState(HARDCODED_CONTESTS);

  // Connect to MetaMask
  const connectWallet = async () => {
    console.log("Connect wallet clicked!");
    
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }

    try {
      setIsConnecting(true);
      console.log("Requesting accounts...");
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
        
        // Switch to Citrea Testnet first, then get balance
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        if (chainId !== API_CONFIG.CHAIN_ID) {
          await switchToCitreaNetwork();
        }
        
        // Get balance with retry logic
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const balance = await provider.getBalance(accounts[0]);
          setBalance(ethers.formatEther(balance));
        } catch (balanceError) {
          console.warn("Could not fetch balance:", balanceError);
          setBalance("0.0000"); // Set default balance
        }
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      
      // Handle specific MetaMask errors
      if (error.code === -32603 && error.data?.cause?.isBrokenCircuitError) {
        alert("MetaMask circuit breaker is open. Please wait a moment and try again, or refresh the page.");
      } else if (error.code === 4001) {
        alert("Connection rejected by user");
      } else {
        alert(`Failed to connect wallet: ${error.message}`);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  // Switch to Citrea Testnet
  const switchToCitreaNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: API_CONFIG.CHAIN_ID }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: API_CONFIG.CHAIN_ID,
              chainName: 'Citrea Testnet',
              nativeCurrency: {
                name: 'Citrea',
                symbol: 'CBTC',
                decimals: 18,
              },
              rpcUrls: [API_CONFIG.RPC_URL],
              blockExplorerUrls: ['https://explorer.testnet.citrea.xyz'],
            }],
          });
        } catch (addError) {
          console.error('Failed to add Citrea network:', addError);
          alert('Please add Citrea Testnet manually in MetaMask');
        }
      }
    }
  };

  // Stake in contest
  const stakeInContest = async (contest) => {
    if (!isConnected) {
      alert("Please connect your wallet first!");
      return;
    }

    try {
      setIsStaking(true);
      setStakingStatus("Preparing transaction...");
      
      // Skip balance check for now due to RPC issues
      // Just proceed with the transaction and let MetaMask handle it
      setStakingStatus("Please confirm transaction in MetaMask...");

      // Create transaction using window.ethereum directly to avoid RPC issues
      const txParams = {
            from: account,
        to: API_CONFIG.CONTRACT_ADDRESS,
        value: `0x${BigInt(contest.stakeAmount).toString(16)}`,
        data: `0x5d6e6c7c${contest.id.toString(16).padStart(64, '0')}`, // joinContest function call
        gas: "0x30d40" // 200000 in hex
      };

      // Send transaction
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [txParams]
      });

      setStakingStatus("Transaction submitted, waiting for confirmation...");
      console.log("Transaction hash:", txHash);

      // Wait for confirmation using a simple approach
      let receipt = null;
      let attempts = 0;
      const maxAttempts = 30; // 30 seconds max wait

      while (!receipt && attempts < maxAttempts) {
        try {
          receipt = await window.ethereum.request({
            method: 'eth_getTransactionReceipt',
            params: [txHash]
          });
          if (!receipt) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
            attempts++;
          }
        } catch (error) {
          console.warn("Error checking transaction receipt:", error);
          await new Promise(resolve => setTimeout(resolve, 1000));
          attempts++;
        }
      }

      if (receipt) {
      console.log("Transaction confirmed:", receipt);
        setStakingStatus("Success! You've joined the contest!");
        
        // Update contest participant count
        setContests(prevContests => 
          prevContests.map(c => 
            c.id === contest.id 
              ? { ...c, participantCount: c.participantCount + 1 }
              : c
          )
        );

        // Close modal after success
        setTimeout(() => {
          setShowContestModal(false);
          setStakingStatus("");
        }, 2000);
      } else {
        setStakingStatus("Transaction submitted but confirmation timed out. Check your wallet for status.");
      }

    } catch (error) {
      console.error("Error staking:", error);
      
      if (error.code === 4001) {
        setStakingStatus("Transaction rejected by user");
      } else if (error.code === -32603) {
        setStakingStatus("Insufficient funds for gas or transaction failed");
      } else {
        setStakingStatus(`Error: ${error.message}`);
      }
    } finally {
      setIsStaking(false);
    }
  };

  // Open contest modal
  const openContestModal = (contest) => {
    setSelectedContest(contest);
    setShowContestModal(true);
    setStakingStatus("");
  };

  // Get contest icon
  const getContestIcon = (contest) => {
    switch (contest.id) {
      case 1: return <Zap className="w-6 h-6 text-green-500" />;
      case 2: return <Activity className="w-6 h-6 text-blue-500" />;
      case 3: return <Trophy className="w-6 h-6 text-purple-500" />;
      case 4: return <Crown className="w-6 h-6 text-yellow-500" />;
      default: return <Star className="w-6 h-6 text-cyber-green" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-orbitron text-5xl font-bold text-cyber-green mb-4"
          >
            🏆 Fitness Challenges
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300 mb-8"
          >
            Join contests, stake CBTC, and win rewards!
          </motion.p>

          {/* Wallet Connection */}
          <div className="flex justify-center gap-4 mb-8">
            {!isConnected ? (
              <NeonButton
                onClick={connectWallet}
                disabled={isConnecting}
                className="px-8 py-3"
              >
                {isConnecting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-cyber-green border-t-transparent rounded-full animate-spin" />
                    Connecting...
            </div>
          ) : (
                  <div className="flex items-center gap-2">
                    <Wallet className="w-5 h-5" />
              Connect Wallet
                  </div>
                )}
            </NeonButton>
            ) : (
              <div className="flex items-center gap-4 glass rounded-lg px-6 py-3">
                <div className="flex items-center gap-2 text-cyber-green">
                  <div className="w-2 h-2 bg-cyber-green rounded-full animate-pulse" />
                  Connected
                </div>
                <div className="text-white">
                  {account.slice(0, 6)}...{account.slice(-4)}
                </div>
                <div className="text-gray-300">
                  {parseFloat(balance).toFixed(4)} CBTC
                </div>
              </div>
          )}
        </div>
      </div>

        {/* Contests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contests.map((contest, index) => (
            <motion.div
              key={contest.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="h-full cursor-pointer hover:scale-105 transition-all duration-300">
                <div className="h-full flex flex-col">
                  {/* Contest Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-cyber-green/20 rounded-lg flex items-center justify-center">
                      {getContestIcon(contest)}
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">Difficulty</div>
                      <div className="font-semibold text-cyber-green">{contest.difficulty}</div>
                    </div>
                  </div>

                  {/* Contest Info */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-cyber-green mb-2">
                    {contest.name}
                  </h3>
                    <p className="text-gray-300 text-sm mb-4">
                      {contest.description}
                    </p>

                    {/* Stats */}
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400 flex items-center">
                          <Wallet className="w-4 h-4 mr-1" />
                          Stake:
                        </span>
                        <span className="text-white font-semibold">
                          {contest.stakeAmountDisplay} CBTC
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400 flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          Participants:
                        </span>
                        <span className="text-white">
                          {contest.participantCount}/{contest.maxParticipants}
                      </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400 flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                          Duration:
                        </span>
                        <span className="text-white">{contest.duration}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400 flex items-center">
                          <Trophy className="w-4 h-4 mr-1" />
                          Prize Pool:
                    </span>
                        <span className="text-cyber-green font-semibold">
                          {contest.prizePool}
                    </span>
                  </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400 flex items-center">
                          <Activity className="w-4 h-4 mr-1" />
                          Time Left:
                        </span>
                        <span className="text-white">
                          {getTimeRemaining(contest.endTime)}
                    </span>
                  </div>
                </div>
                  </div>

                  {/* Action Button */}
                  <NeonButton
                    onClick={() => openContestModal(contest)}
                    className="w-full mt-auto"
                    disabled={!isConnected}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Play className="w-4 h-4" />
                      {isConnected ? "Join Contest" : "Connect to Join"}
                    </div>
                  </NeonButton>
                </div>
              </GlassCard>
            </motion.div>
          ))}
              </div>
      </div>

      {/* Contest Modal */}
      {showContestModal && selectedContest && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
        >
          <GlassCard className="max-w-xl w-full max-h-[70vh] overflow-y-auto">
            <div className="text-center mb-6">
              <h3 className="font-orbitron text-2xl font-bold text-cyber-green mb-2">
                {selectedContest.name}
              </h3>
              <p className="text-gray-300 mb-4">
                {selectedContest.description}
              </p>
            </div>

            <div className="relative mb-6">
              <div className="aspect-video bg-gray-900 rounded-lg border-2 border-cyber-green relative overflow-hidden">
                <div className="absolute inset-4 border-2 border-dashed border-cyber-green opacity-50 rounded-lg" />
                <div className="flex items-center justify-center h-full">
                  <img
                    src={outputSquatGif}
                    alt="contest demo"
                    className="max-w-full h-auto object-contain"
                  />
                </div>

                <div className="absolute top-2 left-2 w-8 h-8 border-l-2 border-t-2 border-cyber-green opacity-80" />
                <div className="absolute top-2 right-2 w-8 h-8 border-r-2 border-t-2 border-cyber-green opacity-80" />
                <div className="absolute bottom-2 left-2 w-8 h-8 border-l-2 border-b-2 border-cyber-green opacity-80" />
                <div className="absolute bottom-2 right-2 w-8 h-8 border-r-2 border-b-2 border-cyber-green opacity-80" />
              </div>
            </div>

            {selectedContest && (
              <div className="mb-6">
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div className="glass rounded-lg p-3">
                    <div className="text-gray-400">Stake Amount</div>
                    <div className="text-cyber-green font-semibold">
                      {selectedContest.stakeAmountDisplay} CBTC
                    </div>
                  </div>
                  <div className="glass rounded-lg p-3">
                    <div className="text-gray-400">Prize Pool</div>
                    <div className="text-cyber-green font-semibold">
                      {selectedContest.prizePool}
                    </div>
                  </div>
                  <div className="glass rounded-lg p-3">
                    <div className="text-gray-400">Participants</div>
                    <div className="text-white">
                      {selectedContest.participantCount}/{selectedContest.maxParticipants}
                    </div>
                  </div>
                  <div className="glass rounded-lg p-3">
                    <div className="text-gray-400">Duration</div>
                    <div className="text-white">{selectedContest.duration}</div>
                  </div>
                </div>

                {/* Staking Status */}
                {stakingStatus && (
                  <div className={`glass rounded-lg p-3 mb-4 ${
                    stakingStatus.includes("Success") 
                      ? "border-cyber-green" 
                      : stakingStatus.includes("failed") || stakingStatus.includes("Error")
                      ? "border-red-500"
                      : "border-blue-500"
                  }`}>
                    <div className={`text-center ${
                      stakingStatus.includes("Success") 
                        ? "text-cyber-green" 
                        : stakingStatus.includes("failed") || stakingStatus.includes("Error")
                        ? "text-red-400"
                        : "text-blue-400"
                    }`}>
                      {stakingStatus}
                </div>
              </div>
            )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                <NeonButton
                    onClick={() => setShowContestModal(false)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600"
                >
                  Cancel
                </NeonButton>
                  <NeonButton
                    onClick={() => stakeInContest(selectedContest)}
                    disabled={isStaking || !isConnected}
                    className="flex-1"
                  >
                    {isStaking ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-cyber-green border-t-transparent rounded-full animate-spin" />
                        Staking...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Wallet className="w-4 h-4" />
                        Stake {selectedContest.stakeAmountDisplay} CBTC
                      </div>
                    )}
                  </NeonButton>
                </div>
              </div>
            )}
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
};

export default ChallengePage;