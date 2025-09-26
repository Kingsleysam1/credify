import { useState } from "react";
import { useAccount } from "wagmi";
import { abi } from "~~/contracts/registerAIGeneratedContent"; // 👈 your actual ABI import
import { parseAbi } from "viem";
import { Address } from "viem";

const contractAddress = "0xB5c7E294638DbbBB4BcC6b88EB54d559e948f463"; // ✅ Replace this

const AiUploader = () => {
  const { address } = useAccount();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const { writeAsync: writeContract } = useContractWrite({
    address: contractAddress,
    abi,
    functionName: "registerAIContent",
  });

  const handleSubmit = async () => {
    if (!prompt || !address) return;
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5001/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, walrusID: address }),
      });

      const data = await res.json();
      setResult(data);

      // 📝 Write to contract with args from backend
      const tx = await writeContract({
        args: [data.contentHash as `0x${string}`, prompt, data.ipfsHash],
      });

      console.log("✅ Registered onchain:", tx.hash);
    } catch (err) {
      console.error("❌ Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto mt-10 p-4 border rounded-xl shadow-xl bg-white text-black">
      <h2 className="text-xl font-bold mb-4">AI Content + Web3</h2>
      <textarea
        className="w-full p-2 border rounded mb-2"
        rows={4}
        placeholder="Enter your prompt..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Processing..." : "Generate & Register"}
      </button>

      {result && (
        <div className="mt-6">
          <h4 className="font-semibold">✅ Result:</h4>
          <p><strong>AI Content:</strong> {result.content}</p>
          <p><strong>Content Hash:</strong> {result.contentHash}</p>
          <p><strong>IPFS:</strong>{" "}
            <a
              href={`https://gateway.pinata.cloud/ipfs/${result.ipfsHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              View File
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default AiUploader;
