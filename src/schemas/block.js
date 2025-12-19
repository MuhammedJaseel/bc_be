import { ethers } from "ethers";
import mongoose from "mongoose";

const { Schema, model } = mongoose;

const blockSchema = new Schema({
  num: { type: String, required: true, unique: true, index: true }, // block number
  h: { type: String, required: true, unique: true, index: true }, // block hash
  ph: { type: String, required: true, unique: true, index: true }, // parent hash
  n: { type: String, required: true, unique: true, index: true }, // nonce
  t: { type: String, required: true }, // timestamp
  txs: { type: Array, required: true }, // transactions
  ca: { type: Date, required: true, default: Date.now } // createdAt
});

export default model("Block", blockSchema);

// Block Number: 171220
// Block Hash: 0xabc123...
// Parent Hash: 0xdef456...
// Miner: 0x829BD824B016326A401d083B33D092293333A830
// Timestamp: 1700000000
// Nonce: 0x0000000000000000
// Difficulty: 0
// Gas Used / Gas Limit: 15351234 / 30000000
// Transactions count: 5
// First tx hash: 0xe1a1c4...
// From: 0xSenderAddress
// To: 0xReceiverAddress
// Value (wei): 1000000000000000000
// Gas Price: 10000000000


// console.log("0x8be0b66abb13a57fc80d5545f0f6d7b3eb560c8fb63864c412b34054797c0b67");
