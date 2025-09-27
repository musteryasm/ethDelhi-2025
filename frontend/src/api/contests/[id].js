import { ethers } from "ethers";
import ABI from "../../contractABI.json";

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, ABI, provider);

export default async function handler(req, res) {
  try {
    const { id } = req.query;

    const contest = await contract.contests(id);
    const participants = await contract.getParticipants(id);

    // Format response (convert BigNumbers to strings)
    const formatted = {
      contestId: id,
      name: contest.name,
      stakeAmount: contest.stakeAmount.toString(),
      startTime: contest.startTime.toString(),
      endTime: contest.endTime.toString(),
      maxParticipants: contest.maxParticipants.toString(),
      minParticipants: contest.minParticipants.toString(),
      rewardsDistributed: contest.rewardsDistributed,
      participants,
    };

    res.status(200).json(formatted);
  } catch (err) {
    console.error("Error fetching contest:", err);
    res.status(500).json({ error: err.message });
  }
}