"use client";

import { useState } from "react";

export default function LiveStream() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setOutput("");

    const res = await fetch(`/api/stream?prompt=${encodeURIComponent(input)}`);
    const reader = res.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) return;

    let done = false;
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunk = decoder.decode(value);
      setOutput(prev => prev + chunk); // 👈 append to output
    }

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-4 text-white">
      <textarea
        className="w-full bg-gray-800 p-3 rounded"
        placeholder="Ask something..."
        value={input}
        onChange={e => setInput(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white"
      >
        {loading ? "Thinking..." : "Generate"}
      </button>

      <div className="mt-4 bg-gray-900 p-4 rounded min-h-[100px] whitespace-pre-wrap">
        {output}
      </div>
    </div>
  );
}
