import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Users, Play, Activity, Camera, Wallet } from "lucide-react";
import { ethers } from "ethers";
import GlassCard from "../components/GlassCard";
import NeonButton from "../components/NeonButton";
import outputSquatGif from "../gifs/output_squat.gif";

// Contract configuration
const CONTRACT_ADDRESS = "0xE5f2A565Ee0Aa9836B4c80a07C8b32aAd7978e22";
const SEPOLIA_CHAIN_ID = "0xaa36a7"; // 11155111 in decimal
const CONTRACT_ABI = [
  "function joinContest(uint256 contestId) external payable",
  "function getParticipants(uint256 contestId) external view returns (address[])",
  "function contests(uint256) external view returns (string memory name, uint256 stakeAmount, uint256 startTime, uint256 endTime, uint256 maxParticipants, uint256 minParticipants, bool rewardsDistributed)",
  "event ContestCreated(uint256 indexed contestId, string name)",
];

const ChallengesPage = () => {
  // Existing state
  const [showContestModal, setShowContestModal] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [stakeInput, setStakeInput] = useState("");
  const [isStarting, setIsStarting] = useState(false);
  const [selectedContest, setSelectedContest] = useState<any | null>(null);

  // New Web3 state
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [userJoinedContests, setUserJoinedContests] = useState(new Set());

  // Connect wallet function
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      // Check if we're on Sepolia
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      console.log("Current Chain ID:", chainId);

      if (chainId !== SEPOLIA_CHAIN_ID) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: SEPOLIA_CHAIN_ID }],
          });
        } catch (switchError) {
          if (switchError.code === 4902) {
            // Chain not added to MetaMask
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: SEPOLIA_CHAIN_ID,
                  chainName: "Sepolia Test Network",
                  nativeCurrency: {
                    name: "ETH",
                    symbol: "ETH",
                    decimals: 18,
                  },
                  rpcUrls: ["https://sepolia.infura.io/v3/"],
                  blockExplorerUrls: ["https://sepolia.etherscan.io"],
                },
              ],
            });
          } else {
            throw switchError;
          }
        }
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      setAccount(accounts[0]);
      setContract(contractInstance);

      console.log("✅ Wallet connected:", accounts[0]);
      console.log("✅ Contract instance created");

      // Check which contests user has joined
      await checkUserJoinedContests(accounts[0]);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("Failed to connect wallet: " + error.message);
    }
  };

  // Fetch contests from backend API
  const fetchContests = async () => {
    console.log("🔄 Fetching contests from API...");

    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/contests");

      console.log("📡 API Response Status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("📊 API Response Data:", data);

      if (data.contests && Array.isArray(data.contests)) {
        console.log(`✅ Found ${data.contests.length} contests from API`);
        setContests(data.contests);
      } else {
        console.warn("⚠️ API response missing contests array");
        throw new Error("Invalid API response format");
      }
    } catch (error) {
      console.error("❌ Error fetching contests from API:", error);
      console.log("🔄 Using fallback data...");

      // Fallback to static data if API fails
      const fallbackContests = [
        {
          id: 0,
          name: "Push-up Challenge (Fallback)",
          stakeAmount: "100000000000000000", // 0.1 ETH in wei
          startTime: Math.floor(Date.now() / 1000),
          endTime: Math.floor(Date.now() / 1000) + 30 * 24 * 3600,
          maxParticipants: 100,
          minParticipants: 5,
          participantCount: 23,
          difficulty: "Medium",
          rewardsDistributed: false,
        },
        {
          id: 1,
          name: "Squat Master (Fallback)",
          stakeAmount: "50000000000000000", // 0.05 ETH in wei
          startTime: Math.floor(Date.now() / 1000),
          endTime: Math.floor(Date.now() / 1000) + 14 * 24 * 3600,
          maxParticipants: 50,
          minParticipants: 5,
          participantCount: 12,
          difficulty: "Easy",
          rewardsDistributed: false,
        },
      ];

      console.log("📋 Fallback contests loaded:", fallbackContests);
      setContests(fallbackContests);
    } finally {
      setLoading(false);
    }
  };

  // Check which contests user has joined
  const checkUserJoinedContests = async (userAddress) => {
    const joinedSet = new Set();

    for (const contest of contests) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/contests/${contest.id}/joined/${userAddress}`
        );
        const data = await response.json();

        if (data.hasJoined) {
          joinedSet.add(contest.id);
        }
      } catch (error) {
        console.error(
          `Error checking join status for contest ${contest.id}:`,
          error
        );
      }
    }

    setUserJoinedContests(joinedSet);
  };

  // Join contest function
  const joinContest = async (contest) => {
    setSelectedChallenge(contest);
    if (!contract || !account) {
      alert("Please connect your wallet first");
      return;
    }

    console.log("🔍 Debug Info:");
    console.log("Contest:", contest);
    console.log("Contest ID:", contest.id);
    console.log("Stake Amount (wei):", contest.stakeAmount);
    console.log("Account:", account);
    console.log("Current Time:", Math.floor(Date.now() / 1000));
    console.log("Start Time:", contest.startTime);
    console.log("End Time:", contest.endTime);

    try {
      setJoining(true);

      // Pre-flight validation checks
      const currentTime = Math.floor(Date.now() / 1000);

      if (currentTime < parseInt(contest.startTime)) {
        alert("Contest has not started yet");
        return;
      }

      if (currentTime > parseInt(contest.endTime)) {
        alert("Contest has already ended");
        return;
      }

      // Check balance
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(account);
      const requiredAmount = BigInt(contest.stakeAmount);

      console.log("User Balance (ETH):", ethers.formatEther(balance));
      console.log("Required Amount (ETH):", ethers.formatEther(requiredAmount));

      if (balance < requiredAmount) {
        alert(
          `Insufficient balance. You have ${ethers.formatEther(
            balance
          )} ETH but need ${ethers.formatEther(requiredAmount)} ETH`
        );
        return;
      }

      // Get current gas price and estimate gas
      const gasPrice = await provider.send("eth_gasPrice", []);
      console.log("Gas Price:", gasPrice);

      try {
        // Try to estimate gas first
        const estimatedGas = await contract.joinContest.estimateGas(
          contest.id,
          {
            value: contest.stakeAmount,
            from: account,
          }
        );
        console.log("Estimated Gas:", estimatedGas.toString());
      } catch (gasError) {
        console.error("Gas estimation failed:", gasError);

        // Try to get more specific error by calling as view function
        try {
          const contractRead = new ethers.Contract(
            CONTRACT_ADDRESS,
            [
              ...CONTRACT_ABI,
              "function contests(uint256) external view returns (string memory, uint256, uint256, uint256, uint256, uint256, bool)",
            ],
            provider
          );

          const contestData = await contractRead.contests(contest.id);
          console.log("Contract contest data:", contestData);

          if (!contestData || contestData[0] === "") {
            alert(
              "Contest does not exist on the blockchain. Please check if it was created properly."
            );
            return;
          }
        } catch (readError) {
          console.error("Failed to read contract:", readError);
          alert(
            "Contract interaction failed. Please check if you are on the correct network (Sepolia)."
          );
          return;
        }

        // If we can't estimate gas, show specific error
        alert("Transaction will likely fail. Check console for details.");
        return;
      }

      // Call smart contract to join contest
      console.log("🚀 Sending transaction...");
      const tx = await contract.joinContest(contest.id, {
        value: contest.stakeAmount,
        gasLimit: 300000, // Add explicit gas limit
      });

      console.log("Transaction sent:", tx.hash);

      // Wait for confirmation
      const receipt = await tx.wait();
      console.log("Transaction confirmed:", receipt);

      console.log("Successfully joined contest!");

      // Update local state
      setUserJoinedContests((prev) => new Set([...prev, contest.id]));

      // Refresh contest data
      await fetchContests();

      alert("Successfully joined contest!");
    } catch (error) {
      console.error("Error joining contest:", error);

      let errorMessage = "Failed to join contest: ";

      if (error.message.includes("user rejected")) {
        errorMessage += "Transaction cancelled by user";
      } else if (error.message.includes("insufficient funds")) {
        errorMessage += "Insufficient ETH balance";
      } else if (error.message.includes("Already joined")) {
        errorMessage += "You have already joined this contest";
      } else if (error.message.includes("Contest not started")) {
        errorMessage += "Contest has not started yet";
      } else if (error.message.includes("Contest ended")) {
        errorMessage += "Contest has already ended";
      } else if (error.message.includes("Incorrect stake")) {
        errorMessage += "Incorrect stake amount";
      } else if (error.message.includes("Contest full")) {
        errorMessage += "Contest is full";
      } else if (error.message.includes("Invalid contest")) {
        errorMessage += "Contest does not exist";
      } else if (error.code === "CALL_EXCEPTION") {
        errorMessage +=
          "Contract call failed. Check if contest exists and you meet all requirements.";
      } else {
        errorMessage += error.message;
      }

      alert(errorMessage);
    } finally {
      setJoining(false);
      setShowContestModal(true);
    }
  };

  // Helper function to format difficulty badge
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "bg-green-900 text-green-300";
      case "medium":
        return "bg-yellow-900 text-yellow-300";
      case "hard":
        return "bg-red-900 text-red-300";
      default:
        return "bg-gray-900 text-gray-300";
    }
  };

  // Helper function to format time
  const formatTime = (timestamp) => {
    return new Date(parseInt(timestamp) * 1000).toLocaleDateString();
  };

  // Helper function to convert wei to ETH
  const formatStake = (stakeAmount) => {
    try {
      return ethers.formatEther(stakeAmount) + " ETH";
    } catch {
      return stakeAmount;
    }
  };

  // Load contests on component mount
  useEffect(() => {
    fetchContests();
  }, []);

  // Check join status when account changes
  useEffect(() => {
    if (account && contests.length > 0) {
      checkUserJoinedContests(account);
    }
  }, [account, contests]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-cyber-green">Loading contests...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="font-orbitron text-3xl font-bold text-cyber-green">
          Active Challenges
        </h2>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-400">
            Total Contests:{" "}
            <span className="text-cyber-green font-bold">
              {contests.length}
            </span>
            <span className="ml-2 text-xs">
              {contests.length > 0 && contests[0].name?.includes("Fallback")
                ? "(Using Fallback Data)"
                : "(Live from API)"}
            </span>
          </div>
          {account ? (
            <div className="text-sm text-cyber-green">
              Connected: {account.substring(0, 6)}...{account.substring(38)}
            </div>
          ) : (
            <NeonButton onClick={connectWallet} size="sm">
              <Wallet className="w-4 h-4 mr-2" />
              Connect Wallet
            </NeonButton>
          )}
        </div>
      </div>

      {/* Contest Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {contests.map((contest) => {
          const hasJoined = userJoinedContests.has(contest.id);
          const isActive =
            parseInt(contest.startTime) <= Date.now() / 1000 &&
            parseInt(contest.endTime) > Date.now() / 1000;

          return (
            <GlassCard key={contest.id} glowEffect>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-orbitron text-xl font-bold text-white mb-2">
                    {contest.name}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    {contest.difficulty && (
                      <span
                        className={`px-2 py-1 rounded text-xs ${getDifficultyColor(
                          contest.difficulty
                        )}`}
                      >
                        {contest.difficulty}
                      </span>
                    )}
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatTime(contest.startTime)} -{" "}
                      {formatTime(contest.endTime)}
                    </span>
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {contest.participantCount || 0}/{contest.maxParticipants}
                    </span>
                  </div>

                  {/* Contest Status */}
                  <div className="mt-2">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        isActive
                          ? "bg-green-900 text-green-300"
                          : "bg-gray-900 text-gray-300"
                      }`}
                    >
                      {isActive ? "Active" : "Upcoming"}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-cyber-green font-bold text-lg">
                    {formatStake(contest.stakeAmount)}
                  </div>
                  <div className="text-xs text-gray-400">Stake Required</div>
                </div>
              </div>

              <div className="flex space-x-3">
                {hasJoined ? (
                  <>
                    <NeonButton
                      size="sm"
                      className="flex-1 bg-green-900 border-green-500"
                      disabled
                    >
                      ✅ Joined
                    </NeonButton>
                    <NeonButton
                      size="sm"
                      onClick={() => {
                        setSelectedChallenge(contest);
                        setStakeInput(formatStake(contest.stakeAmount));
                        setShowCameraModal(true);
                      }}
                    >
                      <Activity className="w-4 h-4 mr-2" />
                      Start Exercise
                    </NeonButton>
                  </>
                ) : (
                  <>
                    <NeonButton
                      size="sm"
                      className="flex-1"
                      onClick={() => joinContest(contest)}
                      disabled={!account || joining || !isActive}
                    >
                      {joining ? (
                        "Joining..."
                      ) : !account ? (
                        "Connect Wallet"
                      ) : !isActive ? (
                        "Not Active"
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Join Contest
                        </>
                      )}
                    </NeonButton>
                    <NeonButton size="sm" variant="secondary">
                      View Details
                    </NeonButton>
                  </>
                )}
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* No wallet connected message */}
      {!account && (
        <GlassCard className="text-center py-8">
          <Wallet className="w-16 h-16 text-cyber-green mx-auto mb-4 opacity-50" />
          <h3 className="font-orbitron text-xl font-bold text-white mb-2">
            Connect Your Wallet
          </h3>
          <p className="text-gray-400 mb-4">
            Connect your MetaMask wallet to join contests and start earning
            rewards
          </p>
          <NeonButton onClick={connectWallet}>
            <Wallet className="w-4 h-4 mr-2" />
            Connect Wallet
          </NeonButton>
        </GlassCard>
      )}

      {/* Contest Modal */}
      {showContestModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
        >
          <GlassCard className="max-w-xl w-full max-h-[70vh] overflow-y-auto">
            <div className="text-center mb-6">
              <h3 className="font-orbitron text-2xl font-bold text-cyber-green mb-2">
                {selectedContest?.name ?? "Contest Details"}
              </h3>
              <p className="text-gray-300 mb-4">
                {selectedContest?.description ?? "Get ready to compete!"}
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
                <h4 className="font-orbitron text-lg font-bold text-white mb-3">
                  Contest Rules
                </h4>
                <div className="space-y-2">
                  {selectedContest.rules.map((rule: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center text-sm text-gray-300"
                    >
                      <Target className="w-4 h-4 mr-2 text-cyber-green flex-shrink-0" />
                      {rule}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <label className="text-sm text-gray-300 w-24">Entry Fee</label>
                <input
                  value={stakeInput}
                  onChange={(e) => setStakeInput(e.target.value)}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                />
              </div>

              <div className="flex space-x-4">
                <NeonButton
                  className="flex-1"
                  onClick={async () => {
                    try {
                      setIsStarting(true);
                      // Open the detection interface
                      window.open("http://localhost:5001/", "_blank");
                      setShowContestModal(false);
                    } catch (err) {
                      console.error(err);
                    } finally {
                      setIsStarting(false);
                    }
                  }}
                >
                  <Activity className="w-4 h-4 mr-2" />
                  {isStarting ? "Starting..." : "Start Contest"}
                </NeonButton>
                <NeonButton
                  variant="secondary"
                  onClick={() => {
                    setShowContestModal(false);
                  }}
                >
                  Cancel
                </NeonButton>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
};

export default ChallengesPage;
