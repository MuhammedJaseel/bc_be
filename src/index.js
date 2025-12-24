import express from "express";
import dotenv from "dotenv";

import bcRouter from "./bcRouter.js";
import cors from "cors";
import { mineTransactins } from "./services/chain.js";
import { connectDB } from "./modules/database.js";
import {
  connectLocalServer,
  IS_LOCAL_SERVER,
  LOCAL_SERVER,
} from "./modules/localServer.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors());

await connectDB();
await connectLocalServer();

app.get("", async (req, res) => {
  if (
    IS_LOCAL_SERVER &&
    (req.hostname === "rpc1-be.vercel" || req.hostname === "localhost")
  ) {
    try {
      const targetUrl = `${LOCAL_SERVER}${req.url}`;
      const response = await fetch(targetUrl, {
        method: req.method,
        headers: { ...req.headers, host: new URL(LOCAL_SERVER).host },
        body: ["GET", "HEAD"].includes(req.method)
          ? null
          : JSON.stringify(req.body),
      });
      const data = await response.text();
      return res.status(response.status).send(data);
    } catch (err) {
      // res.status(500).send("Server Error");
    }
  }
  return res.json({ app: "rpc1", status: "Working", version: "1.0.4" });
});

app.post("", async (req, res) => {
  return res.json(await bcRouter(req.body));
});

app.get("/mine", async (req, res) => {
  return res.json(await mineTransactins());
});

const PORT = process.env.PORT || 4501;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
