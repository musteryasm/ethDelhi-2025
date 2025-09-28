import { ethers } from "ethers";
import ABI from "../../contractABI.json";

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY, provider);
const contract = new ethers.Contract("0xd43dc5f84320B34149Be4D0602F862DdD61A45CF", ABI, wallet);

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

    // Send tx
    const tx = await contract.createContest(
      name,
      stakeAmount,
      startTime,
      endTime,
      maxParticipants,
      minParticipants
    );

    const receipt = await tx.wait();

    // ✅ Parse logs for ContestCreated event
    let contestId = null;
    for (const log of receipt.logs) {
      try {
        const parsed = contract.interface.parseLog(log);
        if (parsed.name === "ContestCreated") {
          contestId = parsed.args.contestId.toString();
          break;
        }
      } catch {
        // ignore unrelated logs
      }
    }

    res.status(200).json({
      txHash: receipt.transactionHash,
      contestId,
      message: contestId
        ? `Contest created with ID: ${contestId}`
        : "Contest created (ID not found in logs)",
    });
  } catch (err) {
    console.error("Error creating contest:", err);
    res.status(500).json({ error: err.message });
  }
}