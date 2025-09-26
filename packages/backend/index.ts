import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { generateAIContentAndStore } from "./ai/generate";
import { registerContentOnChain, getContentByHash } from "./contract/registerContent"; // ✅ Combined imports
import { keccak256, toUtf8Bytes } from "ethers";
import { streamAIContent } from "./ai/streamAIContent";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("✅ CredifAI backend is running.");
});

// 🧠 Generate AI content + store on IPFS + register onchain
app.post("/generate", async (req, res) => {
  const { prompt, creator } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const result = await generateAIContentAndStore(prompt, creator);
    res.json({ success: true, ...result });
  } catch (err: any) {
    console.error("❌ Error:", err);
    res.status(500).json({ success: false, error: err.message || "Internal server error" });
  }
});


app.get("/stream", async (req, res) => {
  const prompt = req.query.prompt as string;
  if (!prompt) return res.status(400).send("Prompt is required");

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    await streamAIContent(prompt, chunk => {
      res.write(`data: ${chunk}\n\n`);
    });
    res.end();
  } catch (err) {
    console.error("❌ Error during stream:", err);
    res.status(500).end("error");
  }
});


// 🔍 Verify content by rehashing and checking onchain
app.post("/verify", async (req, res) => {
  const { content, creator } = req.body;

  if (!content || !creator) {
    return res.status(400).json({ error: "Content and creator address are required" });
  }

  try {
    const timeStamp = req.body.timeStamp || 0; // optional timestamp support if needed
    const hashInput = `${content}-${creator}-${timeStamp}`;
    const contentHash = keccak256(toUtf8Bytes(hashInput));

    const metadata = await getContentByHash(contentHash);

    if (metadata && metadata.timeStamp !== "0") {
      res.json({ success: true, exists: true, metadata });
    } else {
      res.json({ success: true, exists: false });
    }
  } catch (err: any) {
    console.error("❌ Verification error:", err);
    res.status(500).json({ success: false, error: err.message || "Internal error" });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 CredifAI backend running at http://localhost:${PORT}`));
