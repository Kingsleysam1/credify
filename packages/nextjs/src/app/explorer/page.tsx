import { SearchByResponse } from "./searchByResponse";

export default function ExplorerPage() {
  return (
    <main className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">CredifAI Content Explorer</h1>
      <SearchByResponse />
    </main>
  );
}
