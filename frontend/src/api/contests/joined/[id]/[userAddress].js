import { ethers } from "ethers";
import ABI from "../../../../contractABI.json";

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const contract = new ethers.Contract("0xd43dc5f84320B34149Be4D0602F862DdD61A45CF", ABI, provider);

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { id, userAddress } = req.query;

    // Validate inputs
    if (!id || !userAddress) {
      return res.status(400).json({ 
        error: "Missing required parameters",
        message: "Both contest ID and user address are required"
      });
    }

    // Check if user has joined the contest
    const hasJoined = await contract.isParticipant(id, userAddress);

    res.status(200).json({
      contestId: id,
      userAddress,
      hasJoined: Boolean(hasJoined),
      message: hasJoined ? "User has joined this contest" : "User has not joined this contest"
    });

  } catch (err) {
    console.error("Error checking join status:", err);
    
    // Handle specific error cases
    if (err.code === 'CALL_EXCEPTION' && err.data === null) {
      return res.status(404).json({ 
        error: "Contest not found", 
        message: `Contest with ID ${id} does not exist`,
        hasJoined: false
      });
    }
    
    res.status(500).json({ 
      error: err.message,
      hasJoined: false,
      debug: {
        contestId: id,
        userAddress,
        errorCode: err.code
      }
    });
  }
}
