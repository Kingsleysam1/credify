import { ethers } from "ethers";
import registerAiGeneratedContent from "../abi/registerAIGeneratedContent.json"; // ABI file
import * as dotenv from "dotenv";

dotenv.config();

// ✅ Load environment variables
const RPC_URL = process.env.RPC_URL!;
const PRIVATE_KEY = process.env.PRIVATE_KEY!;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS!;

if (!RPC_URL || !PRIVATE_KEY || !CONTRACT_ADDRESS) {
  throw new Error("❌ Missing environment variables: RPC_URL, PRIVATE_KEY, or CONTRACT_ADDRESS");
}

// ✅ Set up provider and signer
const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// ✅ Contract instance for both read & write
const contract = new ethers.Contract(CONTRACT_ADDRESS, registerAiGeneratedContent.abi, wallet);

/**
 * 📝 Writes AI-generated content metadata to the smart contract
 */
export const registerContentOnChain = async ({
  contentHash,
  prompt,
  response,
  ipfsID,
}: {
  contentHash: string;
  prompt: string;
  response: string;
  ipfsID: string;
}) => {
  try {
    console.log("📡 Calling smart contract: registerAIContent()");
    const tx = await contract.registerAIContent(contentHash, prompt, response, ipfsID);
    console.log("✅ Tx sent:", tx.hash);

    const receipt = await tx.wait();
    console.log("✅ Tx confirmed:", receipt.hash);

    return receipt;
  } catch (err) {
    console.error("❌ Smart contract write failed:", err);
    throw err;
  }
};

/**
 * 🔍 Fetches AI-generated content metadata by content hash
 */
export const getContentByHash = async (hash: string) => {
  try {
    const content = await contract.getContentByHash(hash);

    const formatted = {
      prompt: content[0],
      creator: content[1],
      response: content[2], // include if your contract stores response separately
      ipfsID: content[3],
      timeStamp: content[4].toString(),
    };

    return formatted;
  } catch (err) {
    console.error("❌ Failed to fetch content by hash:", err);
    throw err;
  }
};
