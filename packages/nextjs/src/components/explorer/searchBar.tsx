// components/explorer/SearchBar.tsx
import React, { useState } from "react";

interface Props {
  onSearch: (hash: string) => void;
}

const SearchBar = ({ onSearch }: Props) => {
  const [input, setInput] = useState("");

  const handleSearch = () => {
    const trimmed = input.trim();
    if (trimmed.startsWith("0x") && trimmed.length === 66) {
      onSearch(trimmed);
    } else {
      alert("Please enter a valid keccak256 hash (66 characters, starting with 0x).");
    }
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        placeholder="Enter content hash (0x...)"
        value={input}
        onChange={e => setInput(e.target.value)}
        className="flex-1 p-2 border rounded"
      />
      <button onClick={handleSearch} className="bg-black text-white px-4 py-2 rounded">
        Search
      </button>
    </div>
  );
};

export default SearchBar;
