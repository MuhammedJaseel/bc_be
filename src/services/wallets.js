import Decimal from "decimal.js";
import { Transaction, keccak256 } from "ethers";
import { createWallet, findWallet, updateWallet } from "../modules/store.js";
import { ESTIMATE_GAS, GAS_PRICE, MINER_1 } from "../modules/static.js";

export const getBalance = async (params) => {
  const a = params?.[0];
  // const wallet = await walletModel.findOne({ a });
  const wallet = await findWallet(a);
  return wallet?.b || "0x0";
};

export const sendRawTransaction = async (params) => {
  const signedTx = Transaction.from(params[0]);
  const rawTx = signedTx.serialized;
  const txHash = keccak256(rawTx);
  const txValue = new Decimal(signedTx.value);
  const txGas = new Decimal(GAS_PRICE) * new Decimal(ESTIMATE_GAS);

  const from = await findWallet(signedTx.from);

  if (!from) {
    return {
      error: {
        code: -32603,
        message: "insufficient funds for execution",
      },
    };
  }

  var fromBalance = new Decimal(from.b);

  if (fromBalance < txValue.plus(txGas)) {
    return {
      error: {
        code: -32603,
        message: "insufficient funds for execution",
      },
    };
  }

  fromBalance -= txValue.plus(txGas);

  await updateWallet(from.a, { b: "0x" + fromBalance.toString(16) });

  let to = await findWallet(signedTx.to);
  let miner = await findWallet(MINER_1);

  if (!miner) {
    await createWallet(MINER_1, "0x" + txGas.toString(16));
  } else {
    let minerNewBalance = new Decimal(miner.b).plus(txGas);
    let b = "0x" + minerNewBalance.toNumber().toString(16);
    await updateWallet(miner.a, { b });
  }

  if (!to) {
    await createWallet(signedTx.to, "0x" + txValue.toString(16));
  } else {
    let toBalance = new Decimal(to.b).plus(txValue);
    let b = "0x" + toBalance.toNumber().toString(16);
    await updateWallet(signedTx.to, { b });
  }

  return { result: txHash };
};

export const getTransactionByHash = (params) => {
  return {
    nonce: "0x96",
    gasPrice: "0x2bc4f987a2000",
    gas: "0x5208",
    to: "0x6D093194B7453a89045E7300732535de8103E316",
    value: "0xde0b6b3a7640000",
    input: "0x",
    v: "0x23b57",
    r: "0xade074db580ef99e161d65abdc8b9c7b4d97ee62de46405c919a793eb405b272",
    s: "0x1bb64e2d0e23850cd8f01141823b64b4238c72c0449a24e941ac032941d984d0",
    hash: "0x42f5c0d28fc07b9d4c15e186b2f2c2ab4c3492e30a463e6c0c0a5afe2272e312",
    from: "0x791a1C72CcbE377432a191d2b07432815a644A69",
    blockHash: null,
    blockNumber: null,
    transactionIndex: null,
    type: "0x0",
  };
};

export const getTransactionReceipt = (params) => {
  return {
    root: "0x0000000000000000000000000000000000000000000000000000000000000000",
    cumulativeGasUsed: "0x5208",
    logsBloom:
      "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    logs: [],
    status: "0x1",
    transactionHash:
      "0x42f5c0d28fc07b9d4c15e186b2f2c2ab4c3492e30a463e6c0c0a5afe2272e312",
    transactionIndex: "0x0",
    blockHash:
      "0xaf989710fe1d7a9ac052803be39aa3dd5a7286bc01deef4f520d1a32d33d2bcc",
    blockNumber: "0x75b0fb",
    gasUsed: "0x5208",
    contractAddress: null,
    from: "0x791a1C72CcbE377432a191d2b07432815a644A69",
    to: "0x6D093194B7453a89045E7300732535de8103E316",
  };
};

// console.log((31680000000000).toString(16));
