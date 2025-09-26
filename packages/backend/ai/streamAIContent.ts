import { createParser } from "eventsource-parser";

/**
 * Streams content from the Ollama model server.
 * 
 * @param prompt - The user's input prompt.
 * @param onData - A callback to receive each streamed chunk of data.
 */
export async function streamAIContent(prompt: string, onData: (text: string) => void) {
  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "deepseek-r1", // Change to another model like "mistral" if desired
      prompt,
      stream: true,
    }),
  });

  if (!response.ok || !response.body) {
    throw new Error(`Failed to stream from Ollama: ${response.statusText}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  const parser = createParser((event) => {
    if (event.type === "event") {
      try {
        const data = JSON.parse(event.data);
        const text = data.response;
        if (text) onData(text);
      } catch (err) {
        console.warn("⚠️ Stream chunk parse error:", err);
      }
    }
  });

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    parser.feed(chunk);
  }
}
