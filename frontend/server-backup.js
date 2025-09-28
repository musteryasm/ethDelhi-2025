import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ethers } from 'ethers';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Import contract ABI
import { readFileSync } from 'fs';
const ABI = JSON.parse(readFileSync('./contractABI.json', 'utf8'));

// Initialize contract connection (lazy loading)
let provider = null;
let wallet = null;
let contract = null;

function getContract() {
  if (!contract) {
    try {
      provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
      wallet = new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY, provider);
      contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, ABI, wallet);
    } catch (error) {
      console.error('Failed to initialize blockchain connection:', error.message);
      throw new Error('Blockchain connection failed: ' + error.message);
    }
  }
  return contract;
}

// Helper function to get contest data and participants
async function getContestData(contestId) {
  const contract = getContract();
  const contestData = await contract.getContest(contestId);
  const participants = await contract.getParticipants(contestId);
  
  // Format the returned data to match expected structure
  const formattedContestData = {
    name: contestData[0],
    stakeAmount: contestData[1],
    startTime: contestData[2],
    endTime: contestData[3],
    maxParticipants: contestData[4],
    minParticipants: contestData[5],
    rewardsDistributed: contestData[6]
  };
  
  return { contestData: formattedContestData, participants };
}

// Helper function to check if contest is active
function isContestActive(contestData) {
  const currentTime = Math.floor(Date.now() / 1000);
  return currentTime >= Number(contestData.startTime) && currentTime <= Number(contestData.endTime);
}

// Helper function to validate join request
function validateJoinRequest(contestData, participants, userAddress) {
  const currentTime = Math.floor(Date.now() / 1000);
  const isActive = isContestActive(contestData);
  const validationErrors = [];
  
  if (!isActive) {
    const status = currentTime < Number(contestData.startTime) ? "not started" : "ended";
    validationErrors.push(`Contest has ${status}`);
  }

  if (participants.length >= Number(contestData.maxParticipants)) {
    validationErrors.push("Contest is full");
  }

  if (participants.includes(userAddress)) {
    validationErrors.push("User has already joined this contest");
  }

  return {
    canJoin: validationErrors.length === 0,
    errors: validationErrors,
    isActive
  };
}

// Helper function to format contest info
function formatContestInfo(contestData, participants, contestId = null) {
  return {
    contestId: contestId,
    name: contestData.name,
    stakeAmount: contestData.stakeAmount.toString(),
    participantCount: participants.length,
    maxParticipants: contestData.maxParticipants.toString(),
    minParticipants: contestData.minParticipants.toString(),
    startTime: contestData.startTime.toString(),
    endTime: contestData.endTime.toString(),
    isActive: isContestActive(contestData),
    rewardsDistributed: contestData.rewardsDistributed
  };
}

// Helper function to get contest statistics
function getContestStats(contestData, participants) {
  return {
    participantCount: participants.length,
    maxParticipants: contestData.maxParticipants.toString(),
    minParticipants: contestData.minParticipants.toString(),
    stakeAmount: contestData.stakeAmount.toString(),
    totalStake: (BigInt(contestData.stakeAmount) * BigInt(participants.length)).toString(),
    isActive: isContestActive(contestData),
    hasEnded: Date.now() / 1000 > Number(contestData.endTime),
    rewardsDistributed: contestData.rewardsDistributed,
    canJoin: isContestActive(contestData) && 
             participants.length < Number(contestData.maxParticipants) &&
             !contestData.rewardsDistributed
  };
}

// Health check endpoint
app.get('/api', (req, res) => {
  res.status(200).json({ status: "Backend is running 🚀" });
});

// Create contest endpoint
app.post('/api/contests/create', async (req, res) => {
  try {
    const { name, stakeAmount, startTime, endTime, maxParticipants, minParticipants } = req.body;

    if (!name || !stakeAmount || !startTime || !endTime || !maxParticipants || !minParticipants) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    console.log("Creating contest with data:", { name, stakeAmount, startTime, endTime, maxParticipants, minParticipants });

    const contract = getContract();
    const tx = await contract.createContest(
      name,
      stakeAmount,
      startTime,
      endTime,
      maxParticipants,
      minParticipants
    );

    console.log("Transaction sent, waiting for confirmation...");
    const receipt = await tx.wait();
    console.log("Transaction confirmed:", receipt.hash);

    // Look for ContestCreated event to get the contest ID
    let contestId = null;
    if (receipt.logs) {
      for (const log of receipt.logs) {
        try {
          const parsedLog = contract.interface.parseLog(log);
          if (parsedLog && parsedLog.name === 'ContestCreated') {
            contestId = parsedLog.args.contestId.toString();
            console.log("Found ContestCreated event, contestId:", contestId);
            break;
          }
        } catch (e) {
          // Not our event, continue
        }
      }
    }

    res.status(200).json({ 
      txHash: receipt.hash,
      contestId: contestId,
      message: contestId ? `Contest created with ID: ${contestId}` : "Contest created but couldn't extract ID from event"
    });
  } catch (err) {
    console.error("Error creating contest:", err);
    res.status(500).json({ error: err.message });
  }
});

// Distribute rewards endpoint
app.post('/api/contests/distribute', async (req, res) => {
  try {
    const { contestId, winner1, winner2, winner3 } = req.body;

    if (!contestId || !winner1 || !winner2 || !winner3) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const contract = getContract();
    const tx = await contract.distributeRewards(contestId, winner1, winner2, winner3);
    const receipt = await tx.wait();

    res.status(200).json({ txHash: receipt.hash });
  } catch (err) {
    console.error("Error distributing rewards:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get contest by ID endpoint
app.get('/api/contests/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Fetching contest ID: ${id}`);

    // Test contract connection
    console.log("Testing contract connection...");
    const contract = getContract();
    try {
      const owner = await contract.owner();
      console.log("Contract owner:", owner);
    } catch (ownerErr) {
      console.log("Owner call failed:", ownerErr.message);
    }

    // Get contest data using helper function
    const { contestData, participants } = await getContestData(id);
    console.log("Contest data:", contestData);
    console.log("Participants data:", participants);

    const contest = formatContestInfo(contestData, participants, id);

    res.status(200).json({ 
      contest,
      participants: participants,
      message: "Contest data retrieved successfully"
    });
  } catch (err) {
    console.error("Error fetching contest:", err);
    console.error("Error details:", {
      code: err.code,
      value: err.value,
      message: err.message
    });
    
    // Handle case where contest doesn't exist
    if (err.code === 'BAD_DATA' && err.value === '0x') {
      return res.status(404).json({ 
        error: "Contest not found", 
        message: "This contest ID doesn't exist yet. Make sure to create a contest first and wait for transaction confirmation.",
        debug: {
          contestId: req.params.id,
          errorCode: err.code,
          errorValue: err.value,
          contractAddress: process.env.CONTRACT_ADDRESS
        }
      });
    }
    
    res.status(500).json({ 
      error: err.message,
      debug: {
        contestId: req.params.id,
        errorCode: err.code,
        errorValue: err.value,
        contractAddress: process.env.CONTRACT_ADDRESS
      }
    });
  }
});

// Get all contests endpoint
app.get('/api/contests', async (req, res) => {
  try {
    // This is a simple implementation - in production you might want to store contest count
    // For now, we'll try to get contests 1-10 and filter out empty ones
    const contests = [];
    
    for (let i = 1; i <= 10; i++) {
      try {
        const { contestData, participants } = await getContestData(i);
        if (contestData.name && contestData.name !== '') {
          const contestInfo = formatContestInfo(contestData, participants, i);
          contests.push({
            ...contestInfo,
            participants: participants
          });
        }
      } catch (err) {
        // Contest doesn't exist, continue
        break;
      }
    }

    res.status(200).json({ 
      contests,
      total: contests.length,
      message: "Contests retrieved successfully"
    });
  } catch (err) {
    console.error("Error fetching contests:", err);
    res.status(500).json({ error: err.message });
  }
});

// Check if user joined contest
app.get('/api/contests/:id/joined/:userAddress', async (req, res) => {
  try {
    const { id, userAddress } = req.params;
    
    const { participants } = await getContestData(id);
    const hasJoined = participants.includes(userAddress);
    
    res.status(200).json({ 
      hasJoined,
      userAddress,
      contestId: id,
      message: hasJoined ? "User has joined this contest" : "User has not joined this contest"
    });
  } catch (err) {
    console.error("Error checking join status:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get contest statistics
app.get('/api/contests/:id/stats', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { contestData, participants } = await getContestData(id);
    const stats = {
      contestId: id,
      ...getContestStats(contestData, participants)
    };

    res.status(200).json({ 
      stats,
      message: "Contest statistics retrieved successfully"
    });
  } catch (err) {
    console.error("Error fetching contest stats:", err);
    res.status(500).json({ error: err.message });
  }
});

// Pre-validate join attempt (before MetaMask transaction)
app.post('/api/contests/:id/pre-join', async (req, res) => {
  try {
    const { id } = req.params;
    const { userAddress } = req.body;

    if (!userAddress) {
      return res.status(400).json({ error: "Missing userAddress" });
    }

    console.log(`Pre-validating join for user ${userAddress} in contest ${id}`);

    // Get contest details from blockchain
    const { contestData, participants } = await getContestData(id);
    const validation = validateJoinRequest(contestData, participants, userAddress);
    const contestInfo = formatContestInfo(contestData, participants, id);

    // Return validation result
    if (!validation.canJoin) {
      return res.status(400).json({ 
        canJoin: false,
        errors: validation.errors,
        contestInfo
      });
    }

    // Success - user can join, provide transaction details
    res.status(200).json({ 
      canJoin: true,
      message: "User can join this contest",
      contestInfo,
      transactionParams: {
        contractAddress: process.env.CONTRACT_ADDRESS,
        method: "joinContest",
        params: [parseInt(id)],
        value: contestData.stakeAmount.toString(),
        gasLimit: "300000"
      },
      contractInteraction: {
        contractAddress: process.env.CONTRACT_ADDRESS,
        method: "joinContest",
        params: [parseInt(id)],
        value: contestData.stakeAmount.toString(),
        gasLimit: "300000",
        // Frontend implementation example
        frontendCode: `
// Example frontend implementation:
const tx = await contract.joinContest(${id}, {
    value: "${contestData.stakeAmount.toString()}"
});
await tx.wait();
        `.trim()
      }
    });

  } catch (err) {
    console.error("Error in pre-validation:", err);
    res.status(500).json({ 
      error: "Failed to validate join request",
      details: err.message 
    });
  }
});

// Confirm join after successful MetaMask transaction
app.post('/api/contests/:id/confirm-join', async (req, res) => {
  try {
    const { id } = req.params;
    const { userAddress, txHash } = req.body;

    if (!userAddress || !txHash) {
      return res.status(400).json({ error: "Missing userAddress or txHash" });
    }

    console.log(`Confirming join for user ${userAddress} in contest ${id}, tx: ${txHash}`);

    // In production, you would:
    // 1. Verify the transaction hash on blockchain
    // 2. Confirm it's a valid joinContest call for this contest
    // 3. Store the join in your database
    // 4. Send confirmation email/notification

    // For now, just validate the user is now in the contest
    const { contestData, participants } = await getContestData(id);
    
    if (!participants.includes(userAddress)) {
      return res.status(400).json({ 
        error: "User not found in contest participants",
        message: "Transaction may still be pending or failed"
      });
    }

    const contestInfo = formatContestInfo(contestData, participants, id);

    // Success - user successfully joined
    res.status(200).json({
      success: true,
      message: "Join confirmed successfully",
      txHash: txHash,
      contestInfo: {
        contestId: id,
        name: contestData.name,
        stakeAmount: contestData.stakeAmount.toString(),
        participantCount: participants.length,
        maxParticipants: contestData.maxParticipants.toString()
      },
      userInfo: {
        address: userAddress,
        joinedAt: new Date().toISOString(),
        position: participants.indexOf(userAddress) + 1
      }
    });

  } catch (err) {
    console.error("Error confirming join:", err);
    res.status(500).json({ 
      error: "Failed to confirm join",
      details: err.message 
    });
  }
});

// Complete MetaMask integration guide for frontend developers
app.get('/api/contests/:id/metamask-integration', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { contestData } = await getContestData(id);
    
    res.status(200).json({
      contestInfo: {
        contestId: parseInt(id),
        name: contestData.name,
        stakeAmount: contestData.stakeAmount.toString(),
        stakeAmountETH: (parseFloat(contestData.stakeAmount.toString()) / 1e18).toFixed(4)
      },
      integration: {
        // Complete React component
        reactComponent: `
import React, { useState } from 'react';
import { ethers } from 'ethers';

const JoinContestButton = () => {
  const [loading, setLoading] = useState(false);
  const [userAddress, setUserAddress] = useState('');
  
  // Step 1: Connect MetaMask
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask!');
      return;
    }
    
    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      setUserAddress(accounts[0]);
      return accounts[0];
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      alert('Failed to connect wallet');
    }
  };
  
  // Step 2: Join Contest
  const joinContest = async () => {
    setLoading(true);
    
    try {
      // Connect wallet if not connected
      const address = userAddress || await connectWallet();
      if (!address) return;
      
      // Step 2a: Pre-validate with your API
      const preValidation = await fetch('/api/contests/${id}/pre-join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userAddress: address })
      });
      
      const preResult = await preValidation.json();
      
      if (!preResult.canJoin) {
        alert('Cannot join: ' + preResult.errors.join(', '));
        return;
      }
      
      // Step 2b: Execute MetaMask transaction
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        "${process.env.CONTRACT_ADDRESS}",
        [{"inputs":[{"internalType":"uint256","name":"contestId","type":"uint256"}],"name":"joinContest","outputs":[],"stateMutability":"payable","type":"function"}],
        signer
      );
      
      const tx = await contract.joinContest(${id}, {
        value: "${contestData.stakeAmount.toString()}",
        gasLimit: 300000
      });
      
      alert('Transaction sent! Hash: ' + tx.hash);
      
      // Step 2c: Wait for confirmation
      const receipt = await tx.wait();
      
      // Step 2d: Confirm with your API
      const confirmation = await fetch('/api/contests/${id}/confirm-join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userAddress: address, 
          txHash: receipt.hash 
        })
      });
      
      const confirmResult = await confirmation.json();
      
      if (confirmResult.success) {
        alert('Successfully joined contest! You are participant #' + confirmResult.userInfo.position);
      }
      
    } catch (error) {
      console.error('Error joining contest:', error);
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      {!userAddress && (
        <button onClick={connectWallet}>
          Connect MetaMask
        </button>
      )}
      
      {userAddress && (
        <div>
          <p>Connected: {userAddress.slice(0,6)}...{userAddress.slice(-4)}</p>
          <button onClick={joinContest} disabled={loading}>
            {loading ? 'Joining...' : 'Join Contest (${(parseFloat(contestData.stakeAmount.toString()) / 1e18).toFixed(4)} ETH)'}
          </button>
        </div>
      )}
    </div>
  );
};

export default JoinContestButton;
        `.trim(),
        
        // Simple JavaScript version
        vanillaJS: `
// Complete vanilla JavaScript implementation
async function joinContest() {
  // Step 1: Connect MetaMask
  if (!window.ethereum) {
    alert('Please install MetaMask!');
    return;
  }
  
  try {
    const accounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts' 
    });
    const userAddress = accounts[0];
    
    // Step 2: Pre-validate
    const preResponse = await fetch('/api/contests/${id}/pre-join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userAddress })
    });
    
    const preResult = await preResponse.json();
    
    if (!preResult.canJoin) {
      alert('Cannot join: ' + preResult.errors.join(', '));
      return;
    }
    
    // Step 3: Execute transaction
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      "${process.env.CONTRACT_ADDRESS}",
      [{"inputs":[{"internalType":"uint256","name":"contestId","type":"uint256"}],"name":"joinContest","outputs":[],"stateMutability":"payable","type":"function"}],
      signer
    );
    
    const tx = await contract.joinContest(${id}, {
      value: "${contestData.stakeAmount.toString()}"
    });
    
    console.log('Transaction sent:', tx.hash);
    const receipt = await tx.wait();
    console.log('Transaction confirmed:', receipt.hash);
    
    // Step 4: Confirm with API
    const confirmResponse = await fetch('/api/contests/${id}/confirm-join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        userAddress, 
        txHash: receipt.hash 
      })
    });
    
    const confirmResult = await confirmResponse.json();
    
    if (confirmResult.success) {
      alert('Successfully joined contest!');
    }
    
  } catch (error) {
    console.error('Error:', error);
    alert('Error: ' + error.message);
  }
}
        `.trim()
      },
      
      apiEndpoints: {
        preValidate: `POST /api/contests/${id}/pre-join`,
        confirm: `POST /api/contests/${id}/confirm-join`,
        checkStatus: `GET /api/contests/${id}/joined/:userAddress`
      },
      
      contractInfo: {
        address: process.env.CONTRACT_ADDRESS,
        network: "Sepolia Testnet",
        chainId: "11155111"
      }
    });
    
  } catch (err) {
    console.error("Error generating integration guide:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get contest join instructions (Helper for frontend developers)
app.get('/api/contests/:id/join-instructions', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { contestData } = await getContestData(id);
    
    res.status(200).json({
      contractAddress: process.env.CONTRACT_ADDRESS,
      method: "joinContest",
      parameters: {
        contestId: parseInt(id),
        value: contestData.stakeAmount.toString()
      },
      frontendImplementation: {
        javascript: `
// Using ethers.js v6
import { ethers } from 'ethers';

async function joinContest() {
    // Connect to MetaMask
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    
    // Create contract instance
    const contract = new ethers.Contract(
        "${process.env.CONTRACT_ADDRESS}",
        contractABI, // Your contract ABI
        signer
    );
    
    // Join contest
    const tx = await contract.joinContest(${id}, {
        value: "${contestData.stakeAmount.toString()}"
    });
    
    // Wait for confirmation
    const receipt = await tx.wait();
    console.log("Successfully joined contest!", receipt.hash);
    
    return receipt;
}
        `.trim(),
        react: `
// React component example
import { useState } from 'react';
import { ethers } from 'ethers';

function JoinContestButton() {
    const [loading, setLoading] = useState(false);
    
    const handleJoin = async () => {
        setLoading(true);
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(contractAddress, ABI, signer);
            
            const tx = await contract.joinContest(${id}, {
                value: "${contestData.stakeAmount.toString()}"
            });
            
            await tx.wait();
            alert("Successfully joined contest!");
        } catch (error) {
            alert("Error: " + error.message);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <button onClick={handleJoin} disabled={loading}>
            {loading ? "Joining..." : "Join Contest (${ethers.formatEther(contestData.stakeAmount)} ETH)"}
        </button>
    );
}
        `.trim()
      },
      gasEstimate: "300000",
      networkInfo: {
        chainId: "11155111", // Sepolia
        name: "Sepolia Testnet",
        rpcUrl: "https://sepolia.infura.io/v3/YOUR_PROJECT_ID"
      }
    });
    
  } catch (err) {
    console.error("Error getting join instructions:", err);
    res.status(500).json({ error: err.message });
  }
});

// Batch process pending joins (Admin endpoint)
app.post('/api/admin/process-joins', async (req, res) => {
  try {
    // In production, this would:
    // 1. Get pending joins from database
    // 2. Group by contest to optimize gas
    // 3. Execute blockchain transactions in batches
    // 4. Update database with transaction results
    
    console.log("🔄 Processing batch join transactions...");
    
    // Simulate batch processing
    const mockPendingJoins = [
      { contestId: 0, userAddress: "0x123...", amount: "1000000000000000000" },
      { contestId: 0, userAddress: "0x456...", amount: "1000000000000000000" },
      { contestId: 1, userAddress: "0x789...", amount: "2000000000000000000" }
    ];
    
    const results = [];
    
    for (const join of mockPendingJoins) {
      try {
        // In production: await contract.joinContest(join.contestId, { value: join.amount })
        const mockTxHash = `0x${Math.random().toString(16).substring(2, 66)}`;
        
        results.push({
          contestId: join.contestId,
          userAddress: join.userAddress,
          status: "success",
          txHash: mockTxHash
        });
        
        console.log(`✅ Processed join for ${join.userAddress} in contest ${join.contestId}`);
        
      } catch (error) {
        results.push({
          contestId: join.contestId,
          userAddress: join.userAddress,
          status: "failed",
          error: error.message
        });
        
        console.log(`❌ Failed join for ${join.userAddress}: ${error.message}`);
      }
    }
    
    res.status(200).json({
      message: "Batch processing completed",
      processed: results.length,
      successful: results.filter(r => r.status === "success").length,
      failed: results.filter(r => r.status === "failed").length,
      results: results
    });
    
  } catch (err) {
    console.error("Error in batch processing:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get user's contest history
app.get('/api/users/:address/contests', async (req, res) => {
  try {
    const { address } = req.params;
    
    // In production, this would query your database
    // For now, we'll check all contests on blockchain
    
    const userContests = [];
    
    // Check first 10 contests (in production, you'd have a better indexing system)
    for (let i = 1; i <= 10; i++) {
      try {
        const { contestData, participants } = await getContestData(i);
        if (participants.includes(address)) {
          userContests.push({
            contestId: i,
            name: contestData.name,
            stakeAmount: contestData.stakeAmount.toString(),
            status: contestData.rewardsDistributed ? "completed" : "active",
            joinedAt: "N/A" // In production, you'd store this in database
          });
        }
      } catch (error) {
        // Contest doesn't exist, continue
        break;
      }
    }
    
    res.status(200).json({
      userAddress: address,
      totalContests: userContests.length,
      contests: userContests
    });
    
  } catch (err) {
    console.error("Error fetching user contests:", err);
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
});
