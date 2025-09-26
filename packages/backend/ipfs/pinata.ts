// ipfs/uploadToPinata.ts
import axios from "axios";
import pinataSDK from "@pinata/sdk";
import * as dotenv from "dotenv";
dotenv.config();

export const uploadToPinata = async (
  prompt: string,
  content: string
): Promise<{ ipfsHash: string }> => {
  const pinataApiKey = process.env.PINATA_API_KEY!;
  const pinataSecretApiKey = process.env.PINATA_SECRET_API_KEY!;

  const response = await axios.post(
    "https://api.pinata.cloud/pinning/pinJSONToIPFS",
    {
      pinataMetadata: {
        name: "CredifAI Content",
      },
      pinataContent: {
        prompt,
        content,
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
        pinata_api_key: (pinataApiKey),
        pinata_secret_api_key: (pinataSecretApiKey),
      },
    }
  );

  return {
    ipfsHash: response.data.IpfsHash,
  };
};
