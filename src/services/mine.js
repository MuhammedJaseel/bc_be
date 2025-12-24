import { MINER_1 } from "../modules/static.js";
import Block from "../schemas/block.js";
import Txn from "../schemas/txn.js";
import crypto from "crypto";
import Wallets from "../schemas/wallets.js";
import { ethers } from "ethers";
import mongoose from "mongoose";

var BLOCK = null;

async function getCBlock() {
  if (BLOCK !== null) return BLOCK;
  let block = await Block.findOne().sort({ bn: -1 });
  if (block) {
    BLOCK = {
      number: block.bn + 1,
      nonce: "0x0000000000000000",
      timestamp: new Date().getTime(),
      prevHash: block.bh,
    };
    return BLOCK;
  }
  if (!block) {
    BLOCK = {
      number: 1,
      nonce: "0x0000000000000000",
      timestamp: new Date().getTime(),
      prevHash:
        "0x0000000000000000000000000000000000000000000000000000000000000000",
    };
    return BLOCK;
  }
}

export default async function mine() {
  let responseTransactiCount = 0;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const cBlock = await getCBlock();

    const txns = await Txn.find({ st: "P" }, null, { session });

    const txnHashes = [];
    var totalGasUsed = BigInt(0);

    const hashRow = JSON.stringify({
      number: cBlock.number,
      prevHash: cBlock.prevHash,
      data: "",
    });

    const blockHash =
      "0x" + crypto.createHash("sha256").update(hashRow).digest("hex");

    for (let tx of txns) {
      let toAddress = ethers.getAddress(tx.t);

      let to = await Wallets.findOne({ a: toAddress }, null, { session });

      if (!to) {
        let body = { a: toAddress, b: tx.v };

        await Wallets.create([body], { session });
      } else {
        let toBalance = BigInt(to.b) + BigInt(tx.v);

        let a = toAddress;
        let b = "0x" + toBalance.toString(16);

        await Wallets.findOneAndUpdate({ a }, { b }, { session });
      }

      let updateResult = await Txn.findOneAndUpdate(
        { th: tx.th, st: "P" },
        { st: "C", bn: cBlock.number, bh: blockHash },
        { session }
      );

      if (updateResult) {
        await Wallets.findOneAndUpdate(
          { a: tx.f },
          { $inc: { cn: 1 } },
          { session }
        );
        txnHashes.push(tx.th);
        totalGasUsed = totalGasUsed + BigInt(tx.gu);
      }
    }

    if (txnHashes.length === 0) throw {};

    const MINER = ethers.getAddress(MINER_1);

    const totalGasUsedHex = "0x" + totalGasUsed.toString(16);

    await Block.create(
      [
        {
          bn: cBlock.number,
          bh: blockHash,
          ph: cBlock.prevHash,
          n: "0x0000000000000000",
          ts: cBlock.timestamp,
          txs: txnHashes,
          m: MINER,
          gu: totalGasUsedHex,
        },
      ],
      { session }
    );

    let miner = await Wallets.findOne({ a: MINER }, null, { session });

    if (!miner) {
      let body = { a: MINER, b: totalGasUsedHex };
      await Wallets.create([body], { session });
    } else {
      let minerNewBalance = BigInt(miner.b) + totalGasUsed;
      let a = MINER;
      let b = "0x" + minerNewBalance.toString(16);
      await Wallets.findOneAndUpdate({ a }, { b }, { session });
    }

    BLOCK = {
      number: cBlock.number + 1,
      nonce: "0x0000000000000000",
      timestamp: new Date().getTime(),
      prevHash: blockHash,
    };

    responseTransactiCount = txnHashes.length;

    await session.commitTransaction();
    session.endSession();

    try {
      fetch(process.env.SCAN_API + "/rpcinfo?info=block_added").catch(() => {});
    } catch (e) {}
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log(error);
  }

  return { txsCount: responseTransactiCount };
}
