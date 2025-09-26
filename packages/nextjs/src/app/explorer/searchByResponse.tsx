"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SearchByResponse() {
  const [response, setResponse] = useState("");
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`/api/search/response`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response }),
      });

      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error("Search failed:", error);
      setResult({ error: "Search failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Enter full or partial AI response"
          value={response}
          onChange={(e) => setResponse(e.target.value)}
        />
        <Button onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>

      {result && (
        <div className="border rounded p-4 bg-gray-50">
          {result.error && <p className="text-red-500">{result.error}</p>}

          {result.content && (
            <div>
              <h2 className="text-lg font-bold">Match Found:</h2>
              <p><strong>Prompt:</strong> {result.content.prompt}</p>
              <p><strong>Response:</strong> {result.content.response}</p>
              <p><strong>Creator:</strong> {result.content.creator}</p>
              <p><strong>IPFS ID:</strong> {result.content.ipfsID}</p>
              <p><strong>Timestamp:</strong> {new Date(result.content.timeStamp * 1000).toLocaleString()}</p>
            </div>
          )}

          {!result.content && !result.error && (
            <p className="text-gray-600">No matching content found.</p>
          )}
        </div>
      )}
    </div>
  );
}
