// packages/backend/routes/register.ts

import { Router } from "express";
import { ethers } from "ethers";
import dotenv from "dotenv";
import { generateAIContentAndStore } from "../ai/generate"; // AI logic
import { uploadToPinata } from "../ipfs/pinata";             // Pinata upload logic
import registerAIGeneratedContent from "../abi/registerAiGeneratedContent.json"; // Adjust path as needed

dotenv.config();

const router = Router();

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

// Create contract instance
const contractAddress = process.env.CONTRACT_ADDRESS!;
const contract = new ethers.Contract(
  contractAddress,
  registerAIGeneratedContent.abi,
  wallet
);

router.post("/", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, error: "Prompt is required" });
    }

    // 1. Generate AI content
    const content = await generateAIContentAndStore(prompt);

    // 2. Upload to IPFS
    const ipfsResponse = await uploadToPinata({ prompt, content });

    const ipfsHash = ipfsResponse?.IpfsHash || ipfsResponse?.ipfsHash;
    if (!ipfsHash) {
      return res.status(500).json({ success: false, error: "Failed to get IPFS hash" });
    }

    // 3. Hash IPFS string
    const contentHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(ipfsHash));

    // 4. Interact with smart contract
    const tx = await contract.registerContent(prompt, contentHash);
    await tx.wait();

    // 5. Return result
    return res.json({
      success: true,
      txHash: tx.hash,
      ipfsHash,
      content,
    });

  } catch (error: any) {
    console.error("❌ Error in /register route:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Unknown error occurred",
    });
  }
});

export default router;
