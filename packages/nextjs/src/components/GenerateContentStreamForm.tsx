"use client";

import { useState } from "react";

export default function GenerateContentStreamForm() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResponse("");
    setLoading(true);

    try {
      const res = await fetch(`/api/stream?prompt=${encodeURIComponent(prompt)}`);
      if (!res.ok || !res.body) throw new Error("No stream");

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let content = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; // preserve incomplete line

        for (const line of lines) {
          if (!line.trim()) continue;

          try {
            const json = JSON.parse(line);
            const chunk = json.response;
            content += chunk;
            setResponse(content);
          } catch (err) {
            console.warn("Could not parse line:", line);
          }
        }
      }
    } catch (err) {
      console.error("Stream error:", err);
      setResponse("❌ Something went wrong while streaming.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-xl">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt..."
        className="w-full px-4 py-2 border rounded text-black"
        rows={4}
        disabled={loading}
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Stream"}
      </button>

      {response && (
        <div className="mt-4 bg-gray-100 text-black p-4 rounded whitespace-pre-wrap">
          <strong>AI Response:</strong>
          <p>{response}</p>
        </div>
      )}
    </form>
  );
}
