// packages/nextjs/app/api/stream/route.ts
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const prompt = searchParams.get("prompt");

  if (!prompt) {
    return new Response("Missing prompt", { status: 400 });
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const ollamaRes = await fetch("http://localhost:11434/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "deepseek-r1:latest",
            prompt,
            stream: true,
          }),
        });

        if (!ollamaRes.ok || !ollamaRes.body) {
          controller.enqueue(encoder.encode("❌ Ollama stream failed to start.\n"));
          controller.close();
          return;
        }

        const reader = ollamaRes.body.getReader();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          controller.enqueue(encoder.encode(chunk));
        }

        controller.close();
      } catch (err: any) {
        console.error("Streaming error:", err);
        controller.enqueue(encoder.encode("❌ Failed to stream from Ollama.\n"));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
