import { ethers } from "ethers";
import dotenv from "dotenv";
import contractAbi from "../abi/RegisterAIGeneratedContent.json"; // adjust if you keep ABI elsewhere

dotenv.config();

// ✅ Load env variables
const RPC_URL = process.env.RPC_URL!;
const PRIVATE_KEY = process.env.PRIVATE_KEY!;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS!;

if (!RPC_URL || !PRIVATE_KEY || !CONTRACT_ADDRESS) {
  throw new Error("❌ Missing environment variables in .env file.");
}

// ✅ Setup provider and signer
const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// ✅ Create contract instance
const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, wallet);

/**
 * 🔐 Registers AI-generated content onchain
 * @param contentHash - keccak256 hash of content metadata
 * @param prompt - the original prompt used for generation
 * @param ipfsHash - CID of the IPFS-pinned JSON
 * @returns transaction receipt
 */
export async function registerContentOnchain(
  contentHash: string,
  prompt: string,
  ipfsHash: string
) {
  try {
    console.log("🚀 Calling registerAIContent onchain...");
    const tx = await contract.registerAIContent(contentHash, prompt, ipfsHash);
    const receipt = await tx.wait();
    console.log("✅ Content registered! Tx hash:", receipt.hash);
    return receipt;
  } catch (err) {
    console.error("❌ Contract write failed:", err);
    throw err;
  }
}
