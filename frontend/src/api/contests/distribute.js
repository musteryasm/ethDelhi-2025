import { ethers } from "ethers";
import ABI from "../../contractABI.json";

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY, provider);
const contract = new ethers.Contract("0xd43dc5f84320B34149Be4D0602F862DdD61A45CF", ABI, wallet);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { contestId, winner1, winner2, winner3 } = req.body;

    const tx = await contract.distributeRewards(contestId, winner1, winner2, winner3);
    const receipt = await tx.wait();

    res.status(200).json({ txHash: receipt.hash });
  } catch (err) {
    console.error("Error distributing rewards:", err);
    res.status(500).json({ error: err.message });
  }
}