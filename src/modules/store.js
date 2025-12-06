const wallets = [
  {
    a: "0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199",
    b: "0xa18f07d736b90be550000000",
  },
  {
    a: "0x347d5c8dc99bd5f70d429f350fb9578fd78a2f35",
    b: "0xa18f07d736b90be550000000",
  },
];

export const hashes = [
  { h: "0x42f5c0d28fc07b9d4c15e186b2f2c2ab4c3492e30a463e6c0c0a5afe2272e312" },
];

export const blocks = [
  {
    n: 0,
    h: "0xaf989710fe1d7a9ac052803be39aa3dd5a7286bc01deef4f520d1a32d33d2bcc",
  },
];

export async function gatAllWallets() {
  return wallets;
}

export async function findWallet(address) {
  if (!address || typeof address !== "string") return null;
  const addr = address.toLowerCase();
  return (
    wallets.find(
      (w) =>
        (w.a && w.a.toLowerCase() === addr) ||
        (w.b && w.b.toLowerCase() === addr)
    ) || null
  );
}

export function createWallet(body) {
  wallets.push(body);
}

export function updateWallet(a, body = {}) {
  if (!a || typeof a !== "string") return null;
  const addr = a.toLowerCase();
  const i = wallets.findIndex(
    (w) =>
      (w.a && w.a.toLowerCase() === addr) || (w.b && w.b.toLowerCase() === addr)
  );
  if (i === -1) return null;

  wallets[i] = { ...wallets[i], ...body };
  return wallets[i];
}

export function findHash(hash) {
  if (!hash || typeof hash !== "string") return null;
  const h = hash.toLowerCase();
  return hashes.find((x) => x.h && x.h.toLowerCase() === h) || null;
}

export function updateHash(hash, updates = {}) {
  if (!hash || typeof hash !== "string") return null;
  const h = hash.toLowerCase();
  const i = hashes.findIndex((x) => x.h && x.h.toLowerCase() === h);
  if (i === -1) return null;
  hashes[i] = { ...hashes[i], ...updates };
  return hashes[i];
}

export function findBlockByNumber(number) {
  if (typeof number !== "number") return null;
  return blocks.find((b) => b.n === number) || null;
}

export function findBlockByHash(hash) {
  if (!hash || typeof hash !== "string") return null;
  const h = hash.toLowerCase();
  return blocks.find((b) => b.h && b.h.toLowerCase() === h) || null;
}

export function updateBlockByNumber(number, updates = {}) {
  if (typeof number !== "number") return null;
  const i = blocks.findIndex((b) => b.n === number);
  if (i === -1) return null;
  blocks[i] = { ...blocks[i], ...updates };
  return blocks[i];
}

export function updateBlockByHash(hash, updates = {}) {
  if (!hash || typeof hash !== "string") return null;
  const h = hash.toLowerCase();
  const i = blocks.findIndex((b) => b.h && b.h.toLowerCase() === h);
  if (i === -1) return null;
  blocks[i] = { ...blocks[i], ...updates };
  return blocks[i];
}
