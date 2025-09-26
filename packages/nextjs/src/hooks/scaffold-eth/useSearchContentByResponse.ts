import { useState } from "react";
import { useScaffoldReadContract } from "./useScaffoldReadContract";
import { useDeployedContractInfo } from "./useDeployedContractInfo";

export const useSearchByResponse = () => {
  const [response, setResponse] = useState("");
  const [hash, setHash] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);

  const { data: contract } = useDeployedContractInfo("RegisterAIGeneratedContent");

  const { data: storedHash, refetch: refetchHash } = useScaffoldReadContract({
    contractName: "RegisterAIGeneratedContent",
    functionName: "responseToHash",
    args: [response],
    enabled: false,
  });

  const { data: storedContent, refetch: refetchContent } = useScaffoldReadContract({
    contractName: "RegisterAIGeneratedContent",
    functionName: "contentByHash",
    args: [hash],
    enabled: false,
  });

  const search = async () => {
    const hashRes = await refetchHash();
    const h = hashRes?.data;
    setHash(h);

    if (h) {
      const contentRes = await refetchContent({ args: [h] });
      setResult(contentRes?.data ?? null);
    } else {
      setResult(null);
    }
  };

  return {
    response,
    setResponse,
    search,
    result,
    isFound: !!result,
  };
};
