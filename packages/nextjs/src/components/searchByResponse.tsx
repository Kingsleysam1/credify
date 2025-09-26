// components/SearchByResponse.tsx
"use client";

import { useState } from "react";
import { useSearchContentByResponse } from "@/hooks/useSearchContentByResponse";

export const SearchByResponse = () => {
  const [input, setInput] = useState("");
  const { data: content, isLoading, error } = useSearchContentByResponse(input);

  return (
    <div className="p-4 border rounded-xl max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-2">Search by AI Response</h2>
      <input
        className="border px-2 py-1 w-full mb-4"
        placeholder="Paste full AI response..."
        value={input}
        onChange={e => setInput(e.target.value)}
      />

      {isLoading && <p>Searching...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}
      {content && content.creator !== "0x0000000000000000000000000000000000000000" && (
        <div className="bg-gray-100 p-3 rounded-lg">
          <p><strong>Prompt:</strong> {content.prompt}</p>
          <p><strong>Response:</strong> {content.response}</p>
          <p><strong>Creator:</strong> {content.creator}</p>
          <p><strong>IPFS ID:</strong> {content.ipfsID}</p>
          <p><strong>Timestamp:</strong> {new Date(Number(content.timeStamp) * 1000).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
};
