"use client";

import { useState } from "react";
import { useAccount } from "wagmi";

const GenerateContentStreamForm = () => {
  const { address } = useAccount();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamedContent, setStreamedContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt || !address) return;

    setLoading(true);
    setStreamedContent("");

    const res = await fetch(`/api/stream?prompt=${encodeURIComponent(prompt)}`);
    const reader = res.body?.getReader();
    const decoder = new TextDecoder("utf-8");

    if (!reader) {
      alert("Failed to receive stream.");
      setLoading(false);
      return;
    }

    let result = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      try {
        for (const line of chunk.split("\n")) {
          if (line.trim()) {
            const json = JSON.parse(line);
            if (json.response) {
              result += json.response;
              setStreamedContent(result);
            }
          }
        }
      } catch (err) {
        console.error("Chunk parse error:", err);
      }
    }

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-4 border border-gray-700 rounded-xl text-white">
      <h2 className="text-2xl mb-4 font-bold">CredifAI Streaming Prompt</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <textarea
          className="w-full p-2 rounded bg-gray-900 border border-gray-600"
          rows={4}
          placeholder="Enter your prompt here..."
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
        />
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Generating..." : "Submit Prompt"}
        </button>
      </form>

      {streamedContent && (
        <div className="mt-6 bg-gray-900 p-4 rounded border border-gray-700">
          <p className="whitespace-pre-wrap">{streamedContent}</p>
        </div>
      )}
    </div>
  );
};

export default GenerateContentStreamForm;
