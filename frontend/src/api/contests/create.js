import { ethers } from "ethers";
import ABI from "../../contractABI.json";

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY, provider);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, ABI, wallet);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      name,
      stakeAmount,
      startTime,
      endTime,
      maxParticipants,
      minParticipants,
    } = req.body;

    const tx = await contract.createContest(
      name,
      stakeAmount,
      startTime,
      endTime,
      maxParticipants,
      minParticipants
    );

    const receipt = await tx.wait();

    // ✅ Get event topic hash for ContestCreated
    const eventTopic = contract.interface.getEventTopic("ContestCreated");

    let contestId = null;
    for (const log of receipt.logs) {
      if (log.topics[0] === eventTopic) {
        const parsed = contract.interface.parseLog(log);
        contestId = parsed.args.contestId.toString();
        break;
      }
    }

    res.status(200).json({
      txHash: receipt.hash,
      contestId,
    });
  } catch (err) {
    console.error("Error creating contest:", err);
    res.status(500).json({ error: err.message });
  }
}