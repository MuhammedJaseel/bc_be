import mongoose from "mongoose";

const { Schema, model } = mongoose;

const txnSchema = new Schema(
  {
    th: { type: String, required: true, unique: true, index: true }, // transaction hash
    tn: { type: Number, required: true }, // nounce
    s: { type: String, required: true }, // signature
    f: { type: String, required: true }, // from
    t: { type: String, required: true }, // to
    v: { type: String, required: true }, // value
    gp: { type: String, required: true }, // gas price
    gl: { type: String, required: true }, // gas limit
    gu: { type: String, required: true }, // gas user
    bn: { type: Number }, // block number
    bh: { type: String }, // block hash
    st: { type: String, required: true }, // status S, P, F ( Succes, Pending, Failed )
    ts: { type: Number, default: Date.now }, // timestamp
  },
  { versionKey: false },
);

export default model("Txn", txnSchema);
