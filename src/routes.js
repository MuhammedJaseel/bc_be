import express from "express";
import { formatEther } from "ethers";
import { gatAllWallets } from "./modules/store.js";
const router = express.Router();

router.get("/wallets", async (req, res) => {
  const _wallets = await gatAllWallets();
  const wallets = [];
  for (const w of _wallets)
    wallets.push({ a: w.a, b: formatEther(w.b) });
  return res.json(wallets);
});

export default router;