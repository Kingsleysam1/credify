"use client";

import React, { useState } from "react";
import SearchBar from "./searchBar";
import ContentCard from "./contentCard";
import { useScaffoldReadContract } from "../../hooks/scaffold-eth";

const Explorer = () => {
  const [searchHash, setSearchHash] = useState<string>("");

  const { data: contentData, isLoading, error } = useScaffoldReadContract({
    contractName: "registerAIGeneratedContent",
    functionName: "contentByHash",
    args: [searchHash],
    enabled: !!searchHash,
  });

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-3xl font-bold mb-4">CredifAI Explorer 🔍</h1>
      <SearchBar onSearch={setSearchHash} />

      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error loading content.</p>}
      {contentData?.creator !== "0x0000000000000000000000000000000000000000" ? (
        <ContentCard data={contentData} />
      ) : (
        searchHash && <p className="text-yellow-600">No content found for this hash.</p>
      )}
    </div>
  );
};

export default Explorer;
