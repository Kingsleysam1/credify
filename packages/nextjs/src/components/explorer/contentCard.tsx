// components/explorer/contentCard.tsx
import React from "react";

type ContentData = {
  creator: string;
  prompt: string;
  output: string;
  model: string;
  timestamp: bigint | number;
};

const ContentCard = ({ data }: { data?: ContentData }) => {
  if (!data) {
    return <p className="text-red-500">No content data available.</p>;
  }

  const { creator, prompt, output, model, timestamp } = data;

  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white dark:bg-gray-900">
      <h2 className="text-xl font-semibold mb-2">Generated Content</h2>
      <p><strong>Creator:</strong> {creator}</p>
      <p><strong>Prompt:</strong> {prompt}</p>
      <p><strong>Output:</strong> {output}</p>
      <p><strong>Model:</strong> {model}</p>
      <p><strong>Timestamp:</strong> {new Date(Number(timestamp) * 1000).toLocaleString()}</p>
    </div>
  );
};

export default ContentCard;
