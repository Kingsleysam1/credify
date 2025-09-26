"use client";

import { useState } from "react";
import axios from "axios";
import { keccak256, toUtf8Bytes } from "ethers";

const VerifyContentForm = () => {
  const [content, setContent] = useState("");
  const [verifiedData, setVerifiedData] = useState<null | {
    prompt: string;
    ipfsID: string;
    creator: string;
    timeStamp: string;
  }>(null);
  const [notFound, setNotFound] = useState(false);

  const handleVerify = async () => {
    setNotFound(false);
    setVerifiedData(null);

    if (!content) return;

    const hash = keccak256(toUtf8Bytes(content));

    try {
      const res = await axios.get(`http://localhost:5001/verify/${hash}`);
      if (res.data && res.data.exists) {
        setVerifiedData(res.data.data);
      } else {
        setNotFound(true);
      }
    } catch (err) {
      console.error("❌ Verification error:", err);
      setNotFound(true);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 mt-10 border border-gray-700 rounded-xl text-white">
      <h2 className="text-xl font-bold mb-4">Verify AI-Generated Content</h2>
      <textarea
        className="w-full p-2 rounded bg-gray-900 border border-gray-600"
        rows={4}
        placeholder="Paste AI-generated content here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button
        onClick={handleVerify}
        className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
      >
        Verify Content
      </button>

      {verifiedData && (
        <div className="mt-6 p-4 bg-gray-900 border border-green-600 rounded">
          <p><strong>✅ Content Verified</strong></p>
          <p><strong>Prompt:</strong> {verifiedData.prompt}</p>
          <p><strong>Creator:</strong> {verifiedData.creator}</p>
          <p><strong>IPFS:</strong> {verifiedData.ipfsID}</p>
          <p><strong>Timestamp:</strong> {new Date(Number(verifiedData.timeStamp) * 1000).toLocaleString()}</p>
        </div>
      )}

      {notFound && (
        <div className="mt-4 text-red-500">
          ❌ No match found for this content on-chain.
        </div>
      )}
    </div>
  );
};

export default VerifyContentForm;
