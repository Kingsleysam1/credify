"use client";

import { useEffect, useState } from "react";

type ContentItem = {
  hash: string;
  prompt: string;
  response: string;
  creator: string;
  ipfsID: string;
  timeStamp: string;
};

export default function Explorer() {
  const [data, setData] = useState<ContentItem[]>([]);
  const [filtered, setFiltered] = useState<ContentItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/explorer")
      .then(res => res.json())
      .then(json => {
        setData(json.contents || []);
        setFiltered(json.contents || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("❌ Explorer fetch failed:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (search.trim() === "") {
      setFiltered(data);
    } else {
      const query = search.toLowerCase();
      setFiltered(
        data.filter(
          item =>
            item.response.toLowerCase().includes(query) ||
            item.prompt.toLowerCase().includes(query)
        )
      );
    }
  }, [search, data]);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 text-black">
      <h1 className="text-3xl font-bold mb-4">🔎 CredifAI Explorer</h1>

      <input
        type="text"
        placeholder="Search responses or prompts..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-6"
      />

      {loading ? (
        <p>Loading content...</p>
      ) : filtered.length === 0 ? (
        <p>No matching content found.</p>
      ) : (
        <div className="space-y-6">
          {filtered.map((item, i) => (
            <div key={i} className="border p-4 rounded shadow">
              <p className="text-sm text-gray-600">
                <strong>Creator:</strong> {item.creator}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Timestamp:</strong> {new Date(Number(item.timeStamp) * 1000).toLocaleString()}
              </p>
              <p className="mt-2">
                <strong>Prompt:</strong> {item.prompt}
              </p>
              <p className="mt-2">
                <strong>Response:</strong> {item.response}
              </p>
              <p className="mt-2">
                <strong>IPFS:</strong>{" "}
                <a
                  href={`https://gateway.pinata.cloud/ipfs/${item.ipfsID}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View on IPFS
                </a>
              </p>
              <p className="mt-2 text-xs text-gray-400">
                <strong>Hash:</strong> {item.hash}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
