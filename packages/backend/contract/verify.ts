import { ethers } from "ethers";
import registerAiGeneratedContent from "../abi/registerAIGeneratedContent.json";
import * as dotenv from "dotenv";
import { keccak256, toUtf8Bytes } from "ethers";

dotenv.config();

const RPC_URL = process.env.RPC_URL!;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS!;

const provider = new ethers.JsonRpcProvider(RPC_URL);
const contract = new ethers.Contract(CONTRACT_ADDRESS, registerAiGeneratedContent.abi, provider);

export const verifyContentOnChain = async (content: string, creator: string) => {
  try {
    // Loop over possible timestamps if you stored dynamic timestamp
    // For now we assume frontend must also pass timestamp
    const timestamp = 0; // ❌ This will never work if timestamp isn't consistent

    // If you pinned a payload like:
    // { prompt, content, creator, timeStamp }
    // Then during generation, you probably hashed:
    // `${ipfsHash}-${creator}-${timestamp}`

    // ⚠️ YOU NEED TO HAVE ACCESS TO THE SAME IPFS HASH + timestamp
    // If not, verification by content alone won't work.

    // A safer approach is:
    // 👉 Query all stored content hashes and compare their content

    // OR

    // ✅ Refactor your contract to support a mapping like:
    // mapping(string => bytes32) public hashByContent;

    return {
      exists: false,
      metadata: null,
    };
  } catch (err) {
    console.error("❌ Verification failed:", err);
    throw err;
  }
};
