import express from "express";
import bcRouter from "./bcRouter.js";
import cors from "cors";
import { mineTransactins } from "./services/chain.js";
import { connectDB } from "./modules/database.js";
import { PORT } from "./modules/static.js";

const app = express();
app.use(express.json());

app.use(cors());

await connectDB();

app.get("", async (req, res) => {
  return res.json({ app: "rpc1", status: "Working", version: "1.0.5" });
});

app.post("", async (req, res) => {
  return res.json(await bcRouter(req.body));
});

app.get("/mine", async (req, res) => {
  return res.json(await mineTransactins());
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
