// packages/backend/server.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import registerRoute from "./routes/register";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/register", registerRoute);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 CredifAI backend running at http://localhost:${PORT}`);
});
