import { useState } from "react";
import axios from "axios";

export const PromptForm = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt) return;

    setLoading(true);
    try {
      const response = await axios.post("/generate", { prompt });
      setResult(response.data);
    } catch (err) {
      console.error("❌ Error:", err);
      alert("Failed to generate content.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-xl shadow-sm bg-white max-w-2xl mx-auto mt-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          className="w-full p-2 border rounded"
          rows={4}
          placeholder="Enter your prompt..."
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </form>

      {result && (
        <div className="mt-6">
          <h3 className="font-bold mb-2">Generated Content:</h3>
          <p className="bg-gray-100 p-3 rounded whitespace-pre-wrap">{result.content}</p>

          <h4 className="mt-4 text-sm text-gray-500">IPFS Hash:</h4>
          <a
            href={`https://ipfs.io/ipfs/${result.ipfsHash}`}
            className="text-blue-600 break-all"
            target="_blank"
          >
            {result.ipfsHash}
          </a>

          <h4 className="mt-2 text-sm text-gray-500">Content Hash:</h4>
          <p className="break-all text-xs">{result.contentHash}</p>

          <h4 className="mt-2 text-sm text-gray-500">Transaction Hash:</h4>
          <a
            href={`https://sepolia.etherscan.io/tx/${result.txHash}`}
            className="text-blue-600 break-all"
            target="_blank"
          >
            {result.txHash}
          </a>
        </div>
      )}
    </div>
  );
};
