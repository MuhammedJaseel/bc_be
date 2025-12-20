import { ethers } from "ethers";
import Wallets from "../schemas/wallets.js";

// //////////////////////////////// Wallets /////////////////////////////////////

export async function gatAllWallets() {
  try {
    const count = await Wallets.countDocuments({});
    if (count === 0) {
      await Wallets.insertMany(wallets);
    }
  } catch (err) {
    console.error("gatAllWallets error:", err);
  }
  return Wallets.find();
}

export function createWallet(a, b) {
  const body = { a: ethers.getAddress(a), b };
  return Wallets.create(body);
}

export function updateWallet(a, body = {}) {
  if (!a || typeof a !== "string") return null;
  return Wallets.findOneAndUpdate({ a: ethers.getAddress(a) }, body);
}
