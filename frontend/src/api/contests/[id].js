import { ethers } from "ethers";
import ABI from "../../contractABI.json";

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const contract = new ethers.Contract("0xd43dc5f84320B34149Be4D0602F862DdD61A45CF", ABI, provider);

export default async function handler(req, res) {
  try {
    const { id } = req.query;

    const contest = await contract.getContest(id);
    const participants = await contract.getParticipants(id);

    // Format response (convert BigNumbers to strings)
    const formatted = {
      contestId: id,
      name: contest[0],
      stakeAmount: contest[1].toString(),
      startTime: contest[2].toString(),
      endTime: contest[3].toString(),
      maxParticipants: contest[4].toString(),
      minParticipants: contest[5].toString(),
      rewardsDistributed: contest[6],
      participants,
    };

    res.status(200).json(formatted);
  } catch (err) {
    console.error("Error fetching contest:", err);
    
    // Handle specific error cases
    if (err.code === 'CALL_EXCEPTION' && err.data === null) {
      return res.status(404).json({ 
        error: "Contest not found", 
        message: `Contest with ID ${id} does not exist`,
        debug: {
          contestId: id,
          errorCode: err.code,
          contractAddress: "0x121C6f87A451BFfcF48445Bc48445E33855abf73"
        }
      });
    }
    
    res.status(500).json({ 
      error: err.message,
      debug: {
        contestId: id,
        errorCode: err.code,
        contractAddress: "0x121C6f87A451BFfcF48445Bc48445E33855abf73"
      }
    });
  }
}